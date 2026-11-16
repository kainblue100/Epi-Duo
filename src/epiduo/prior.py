"""Turn public K562 epigenomic tracks into the two priors compared here.

Both priors are derived from one shared evidence table so that they differ
only in *form*:

* ``grn``    – typed candidate edges between genes (Epi-GRN input);
* ``direct`` – a padded set of cis-element tokens per gene (Epi-Direct input).

Evidence: ENCODE ATAC peaks, TF ChIP-seq peaks, Hi-C loops and WGBS CpG
methylation, all bulk, unpaired K562 experiments on GRCh38, plus GENCODE
transcript starts.  Overlap is evidence of a *candidate* relation, not of
causal regulation, and no sign is assigned.
"""

from __future__ import annotations

import gzip
import json
import re
from pathlib import Path

import numpy as np

PRIMARY = [f"chr{i}" for i in range(1, 23)] + ["chrX", "chrY"]
CHROM_INDEX = {name: i for i, name in enumerate(PRIMARY)}
PROMOTER_UP, PROMOTER_DOWN = 1000, 1001
PROXIMAL = 50_000
RELATIONS = ("tf_promoter", "tf_distal", "promoter_contact", "shared_element")
SYMMETRIC = (False, False, True, True)
ELEMENT_FEATURES = ("accessibility", "signed_distance", "abs_distance", "is_promoter", "is_loop_linked",
                    "methylation", "methylation_observed")
NODE_FEATURES = ("promoter_accessibility", "promoter_methylation", "linked_elements", "loop_partners")
MIN_CPG_COVERAGE = 10


# ----------------------------------------------------------------- intervals

def overlap_pairs(a_start, a_end, b_start, b_end):
    """Indices (i, j) of half-open intervals a[i], b[j] on one chromosome that overlap."""
    if not len(a_start) or not len(b_start):
        return np.empty(0, np.int64), np.empty(0, np.int64)
    order = np.argsort(b_start, kind="stable")
    starts, ends = b_start[order], b_end[order]
    longest = int((ends - starts).max())
    low = np.searchsorted(starts, a_start - longest, side="left")
    high = np.searchsorted(starts, a_end, side="left")
    sizes = np.maximum(high - low, 0)
    i = np.repeat(np.arange(len(a_start)), sizes)
    j = np.arange(int(sizes.sum())) - np.repeat(np.cumsum(sizes) - sizes, sizes) + np.repeat(low, sizes)
    keep = ends[j] > a_start[i]
    return i[keep], order[j[keep]]


def genome_overlaps(a, b):
    """Overlap two interval tables (chrom, start, end arrays) across chromosomes."""
    left, right = [], []
    for chrom in np.intersect1d(a[0], b[0]):
        ia, ib = np.flatnonzero(a[0] == chrom), np.flatnonzero(b[0] == chrom)
        i, j = overlap_pairs(a[1][ia], a[2][ia], b[1][ib], b[2][ib])
        left.append(ia[i])
        right.append(ib[j])
    if not left:
        return np.empty(0, np.int64), np.empty(0, np.int64)
    return np.concatenate(left), np.concatenate(right)


# ------------------------------------------------------------------- readers

def read_narrowpeak(path: Path):
    chrom, start, end, signal = [], [], [], []
    with gzip.open(path, "rt") as stream:
        for line in stream:
            parts = line.rstrip("\n").split("\t")
            if parts[0] not in CHROM_INDEX:
                continue
            s, e = int(parts[1]), int(parts[2])
            summit = int(parts[9]) if len(parts) > 9 else 0
            if e <= s or summit >= e - s:
                continue  # malformed interval or summit outside the peak
            chrom.append(CHROM_INDEX[parts[0]])
            start.append(s)
            end.append(e)
            signal.append(float(parts[6]))
    return np.asarray(chrom), np.asarray(start), np.asarray(end), np.asarray(signal, dtype=np.float32)


def read_loops(paths):
    """Union of intra-chromosomal loop calls as two anchor tables."""
    loops = set()
    for path in paths:
        with gzip.open(path, "rt") as stream:
            for line in stream:
                if line.startswith("#"):
                    continue
                p = line.split("\t")
                c1 = p[0] if p[0].startswith("chr") else "chr" + p[0]
                c2 = p[3] if p[3].startswith("chr") else "chr" + p[3]
                if c1 != c2 or c1 not in CHROM_INDEX:
                    continue
                loops.add((CHROM_INDEX[c1], int(p[1]), int(p[2]), int(p[4]), int(p[5])))
    table = np.asarray(sorted(loops), dtype=np.int64)
    return (table[:, 0], table[:, 1], table[:, 2]), (table[:, 0], table[:, 3], table[:, 4])


def read_gencode(path: Path, wanted: set[str]):
    """Transcript starts (0-based) and the canonical start for the wanted Ensembl genes."""
    gene_id = re.compile(r'gene_id "([^".]+)')
    genes: dict[str, dict] = {}
    with gzip.open(path, "rt") as stream:
        for line in stream:
            if line.startswith("#"):
                continue
            p = line.split("\t", 9)
            if p[2] != "transcript" or p[0] not in CHROM_INDEX:
                continue
            found = gene_id.search(p[8])
            if not found or found.group(1) not in wanted:
                continue
            tss = int(p[3]) - 1 if p[6] == "+" else int(p[4]) - 1
            record = genes.setdefault(found.group(1), {"chrom": CHROM_INDEX[p[0]], "strand": p[6], "tss": []})
            if record["chrom"] != CHROM_INDEX[p[0]]:
                record["ambiguous"] = True
            record["tss"].append(tss)
            if "Ensembl_canonical" in p[8]:
                record["canonical"] = tss
    return {k: v for k, v in genes.items() if not v.get("ambiguous")}


def read_methylation(paths, intervals):
    """Coverage-weighted CpG methylation of each interval, pooled over replicates.

    ``intervals`` is (chrom, start, end).  Returns methylated and total read
    counts per interval; an interval without reads is unobserved, not zero.
    """
    import pandas as pd

    methylated = np.zeros(len(intervals[0]))
    covered = np.zeros(len(intervals[0]))
    by_chrom = {c: np.flatnonzero(intervals[0] == c) for c in np.unique(intervals[0])}
    for path in paths:
        reader = pd.read_csv(
            path, sep="\t", header=None, usecols=[0, 1, 9, 10], names=["chrom", "pos", "cov", "pct"],
            dtype={"chrom": "category", "pos": np.int64, "cov": np.float64, "pct": np.float64},
            chunksize=4_000_000, compression="gzip",
        )
        rows = 0
        for chunk in reader:
            rows += len(chunk)
            for name, part in chunk.groupby("chrom", observed=True, sort=False):
                index = by_chrom.get(CHROM_INDEX.get(name, -1))
                if index is None or not len(index):
                    continue
                pos = part["pos"].to_numpy()
                order = np.argsort(pos, kind="stable")
                pos = pos[order]
                cov = part["cov"].to_numpy()[order]
                meth = cov * part["pct"].to_numpy()[order] / 100.0
                cum_cov = np.concatenate(([0.0], np.cumsum(cov)))
                cum_meth = np.concatenate(([0.0], np.cumsum(meth)))
                low = np.searchsorted(pos, intervals[1][index], side="left")
                high = np.searchsorted(pos, intervals[2][index], side="left")
                covered[index] += cum_cov[high] - cum_cov[low]
                methylated[index] += cum_meth[high] - cum_meth[low]
            print(f"{Path(path).name}: {rows} CpG rows", flush=True)
    return methylated, covered


# ------------------------------------------------------------------ controls

def degree_preserving_shuffle(src, dst, symmetric: bool, rng, swaps_per_edge: int = 5):
    """Double-edge swaps that keep every node's in- and out-degree and forbid self/multi-edges."""
    src, dst = src.copy(), dst.copy()
    n = len(src)
    if n < 2:
        return src, dst, 0

    def key(a, b):
        return (min(a, b), max(a, b)) if symmetric else (a, b)

    present = {key(a, b) for a, b in zip(src.tolist(), dst.tolist())}
    done = 0
    for _ in range(swaps_per_edge * n * 20):
        if done >= swaps_per_edge * n:
            break
        i, j = rng.integers(0, n, 2)
        a, b, c, d = int(src[i]), int(dst[i]), int(src[j]), int(dst[j])
        if a == d or c == b or key(a, d) in present or key(c, b) in present or key(a, d) == key(c, b):
            continue
        present.discard(key(a, b))
        present.discard(key(c, d))
        present.add(key(a, d))
        present.add(key(c, b))
        dst[i], dst[j] = d, b
        done += 1
    return src, dst, done


# --------------------------------------------------------------------- build

def build(
    genes_csv: Path, targets_csv: Path, chip_selection: Path, chip_dir: Path, atac: Path,
    loops: list[Path], wgbs: list[Path], gencode: Path, output: Path, *,
    max_tokens: int = 24, seed: int = 20261116,
) -> None:
    import pandas as pd

    output = Path(output)
    if output.exists():
        raise FileExistsError(output)

    hvg = pd.read_csv(genes_csv)
    targets = pd.read_csv(targets_csv)
    selection = json.loads(Path(chip_selection).read_text(encoding="utf-8"))["files"]
    tf_symbols = sorted({item["source_symbol"] for item in selection})
    tf_ensembl = {item["source_symbol"]: item["source_ensembl_id"] for item in selection}

    # Node axis: output genes, perturbation targets and ChIP source factors.
    nodes: dict[str, dict] = {}
    for i, row in enumerate(hvg.itertuples()):
        nodes[row.ensembl_id] = {"symbol": row.symbol, "hvg_index": i, "target": "", "tf_index": -1}
    for row in targets.itertuples():
        node = nodes.setdefault(row.ensembl_id, {"symbol": row.symbol, "hvg_index": -1, "target": "", "tf_index": -1})
        node["target"] = row.symbol
    for t, symbol in enumerate(tf_symbols):
        node = nodes.setdefault(tf_ensembl[symbol], {"symbol": symbol, "hvg_index": -1, "target": "", "tf_index": -1})
        node["tf_index"] = t
    node_ids = list(nodes)
    n_nodes, n_tf = len(node_ids), len(tf_symbols)
    tf_node = np.full(n_tf, -1)
    for i, ensembl_id in enumerate(node_ids):
        if nodes[ensembl_id]["tf_index"] >= 0:
            tf_node[nodes[ensembl_id]["tf_index"]] = i

    loci = read_gencode(gencode, set(node_ids))
    has_locus = np.asarray([e in loci for e in node_ids])
    canonical = np.zeros(n_nodes, dtype=np.int64)
    strand = np.ones(n_nodes, dtype=np.int64)
    node_chrom = np.full(n_nodes, -1)
    p_node, p_chrom, p_start, p_end = [], [], [], []
    m_node, m_chrom, m_start, m_end = [], [], [], []  # merged promoter windows, for methylation
    for i, ensembl_id in enumerate(node_ids):
        locus = loci.get(ensembl_id)
        if locus is None:
            continue
        starts = sorted(set(locus["tss"]))
        canonical[i] = locus.get("canonical", starts[0] if locus["strand"] == "+" else starts[-1])
        strand[i] = 1 if locus["strand"] == "+" else -1
        node_chrom[i] = locus["chrom"]
        for tss in starts:
            window = (max(0, tss - PROMOTER_UP), tss + PROMOTER_DOWN)
            p_node.append(i)
            p_chrom.append(locus["chrom"])
            p_start.append(window[0])
            p_end.append(window[1])
            if m_node and m_node[-1] == i and window[0] <= m_end[-1]:
                m_end[-1] = max(m_end[-1], window[1])
            else:
                m_node.append(i)
                m_chrom.append(locus["chrom"])
                m_start.append(window[0])
                m_end.append(window[1])
    p_node, m_node = np.asarray(p_node), np.asarray(m_node)
    promoters = (np.asarray(p_chrom), np.asarray(p_start), np.asarray(p_end))
    merged = (np.asarray(m_chrom), np.asarray(m_start), np.asarray(m_end))

    # Elements are ATAC peaks; ChIP evidence only counts inside accessible chromatin.
    e_chrom, e_start, e_end, e_signal = read_narrowpeak(atac)
    elements = (e_chrom, e_start, e_end)
    n_elements = len(e_chrom)
    binding = np.zeros((n_elements, n_tf), dtype=bool)
    promoter_binding = set()  # (tf, node): ChIP ∩ ATAC ∩ promoter share at least one base
    pe_p, pe_e = genome_overlaps(promoters, elements)
    for item in selection:
        t = tf_symbols.index(item["source_symbol"])
        chip = read_narrowpeak(Path(chip_dir) / f"{item['file_accession']}.bed.gz")
        ce_c, ce_e = genome_overlaps(chip[:3], elements)
        binding[ce_e, t] = True
        # three-way overlap, as in the Epi-C3 ENCODE promoter graph
        low = np.maximum(chip[1][ce_c], e_start[ce_e])
        high = np.minimum(chip[2][ce_c], e_end[ce_e])
        shared = (np.full(len(low), 0), low, high)
        for chrom in np.unique(e_chrom[ce_e]):
            part = np.flatnonzero(e_chrom[ce_e] == chrom)
            proms = np.flatnonzero(promoters[0] == chrom)
            i, j = overlap_pairs(shared[1][part], shared[2][part], promoters[1][proms], promoters[2][proms])
            promoter_binding.update((t, int(n)) for n in p_node[proms[j]])

    # gene <-> element links
    link = {}  # (node, element) -> [is_promoter, is_loop]
    for p, e in zip(pe_p.tolist(), pe_e.tolist()):
        link.setdefault((int(p_node[p]), e), [False, False])[0] = True
    anchor_a, anchor_b = read_loops(loops)
    n_loops = len(anchor_a[0])
    loop_gene = [set(), set()]  # (loop, node) per anchor side
    loop_element = [set(), set()]
    for side, anchor in enumerate((anchor_a, anchor_b)):
        a, p = genome_overlaps(anchor, promoters)
        loop_gene[side] = set(zip(a.tolist(), p_node[p].tolist()))
        a, e = genome_overlaps(anchor, elements)
        loop_element[side] = set(zip(a.tolist(), e.tolist()))
    genes_at = [dict(), dict()]
    elements_at = [dict(), dict()]
    for side in (0, 1):
        for loop, node in loop_gene[side]:
            genes_at[side].setdefault(loop, []).append(int(node))
        for loop, element in loop_element[side]:
            elements_at[side].setdefault(loop, []).append(element)
    contact = set()
    for loop in range(n_loops):
        for side in (0, 1):
            for node in genes_at[side].get(loop, ()):
                for element in elements_at[1 - side].get(loop, ()):
                    link.setdefault((node, element), [False, False])[1] = True
        for a in genes_at[0].get(loop, ()):
            for b in genes_at[1].get(loop, ()):
                if a != b:
                    contact.add((min(a, b), max(a, b)))

    # proximal elements (for the direct tokens only)
    proximal = {}
    located = np.flatnonzero(has_locus)
    windows = (node_chrom[located], np.maximum(0, canonical[located] - PROXIMAL), canonical[located] + PROXIMAL)
    w, e = genome_overlaps(windows, elements)
    for node, element in zip(located[w].tolist(), e.tolist()):
        proximal.setdefault(node, []).append(element)

    # methylation of elements and of each gene's promoter windows
    both = tuple(np.concatenate(pair) for pair in zip(elements, merged))
    meth, cov = read_methylation(wgbs, both)
    e_meth, e_cov = meth[:n_elements], cov[:n_elements]
    element_observed = e_cov >= MIN_CPG_COVERAGE
    element_methylation = np.where(element_observed, e_meth / np.maximum(e_cov, 1), 0.0)
    node_meth = np.bincount(m_node, weights=meth[n_elements:], minlength=n_nodes)
    node_cov = np.bincount(m_node, weights=cov[n_elements:], minlength=n_nodes)
    node_meth_observed = node_cov >= MIN_CPG_COVERAGE

    # ------------------------------------------------------------- GRN edges
    edges = {name: set() for name in RELATIONS}
    for t, node in promoter_binding:
        if tf_node[t] != node:
            edges["tf_promoter"].add((int(tf_node[t]), node))
    by_node: dict[int, list] = {}
    by_element: dict[int, list] = {}
    for (node, element), (is_promoter, is_loop) in link.items():
        by_node.setdefault(node, []).append((element, is_promoter, is_loop))
        if is_loop and not is_promoter:
            by_element.setdefault(element, []).append(node)
            for t in np.flatnonzero(binding[element]):
                if tf_node[t] != node and (int(tf_node[t]), node) not in edges["tf_promoter"]:
                    edges["tf_distal"].add((int(tf_node[t]), node))
    edges["promoter_contact"] = contact
    for members in by_element.values():
        members = sorted(set(members))
        for x, a in enumerate(members):
            for b in members[x + 1:]:
                if (a, b) not in contact:
                    edges["shared_element"].add((a, b))

    rng = np.random.default_rng(seed)
    rel, src, dst, s_rel, s_src, s_dst = [], [], [], [], [], []
    relation_summary = {}
    for r, name in enumerate(RELATIONS):
        pairs = np.asarray(sorted(edges[name]), dtype=np.int64).reshape(-1, 2)
        a, b, swaps = degree_preserving_shuffle(pairs[:, 0], pairs[:, 1], SYMMETRIC[r], rng)
        if SYMMETRIC[r]:
            real = {(min(x, y), max(x, y)) for x, y in pairs.tolist()}
            fake = {(min(x, y), max(x, y)) for x, y in zip(a.tolist(), b.tolist())}
        else:
            real, fake = set(map(tuple, pairs.tolist())), set(zip(a.tolist(), b.tolist()))
        relation_summary[name] = {
            "edges": len(pairs), "symmetric": SYMMETRIC[r], "successful_swaps": int(swaps),
            "shuffled_edges_kept_from_real": len(real & fake),
        }
        rel.append(np.full(len(pairs), r))
        src.append(pairs[:, 0])
        dst.append(pairs[:, 1])
        s_rel.append(np.full(len(pairs), r))
        s_src.append(a)
        s_dst.append(b)

    accessibility = np.log1p(e_signal) / np.log1p(e_signal.max())
    node_features = np.zeros((n_nodes, len(NODE_FEATURES)), dtype=np.float32)
    node_masks = np.zeros_like(node_features)
    partners = np.zeros(n_nodes)
    for a, b in contact:
        partners[a] += 1
        partners[b] += 1
    for node in range(n_nodes):
        if not has_locus[node]:
            continue
        linked = by_node.get(node, [])
        promoter_elements = [e for e, is_promoter, _ in linked if is_promoter]
        node_features[node, 0] = max((accessibility[e] for e in promoter_elements), default=0.0)
        node_features[node, 2] = min(len(linked), 20) / 20
        node_features[node, 3] = min(partners[node], 10) / 10
        node_masks[node, [0, 2, 3]] = 1
        if node_meth_observed[node]:
            node_features[node, 1] = node_meth[node] / node_cov[node]
            node_masks[node, 1] = 1

    # ---------------------------------------------------------- direct tokens
    n_features = len(ELEMENT_FEATURES) + n_tf
    tokens = np.zeros((n_nodes, max_tokens, n_features), dtype=np.float32)
    token_mask = np.zeros((n_nodes, max_tokens), dtype=bool)
    token_counts = np.zeros(n_nodes, dtype=np.int64)
    centre = (e_start + e_end) // 2
    for node in located.tolist():
        flags = {e: (is_promoter, is_loop) for e, is_promoter, is_loop in by_node.get(node, [])}
        for element in proximal.get(node, []):
            flags.setdefault(element, (False, False))
        chosen = sorted(
            flags,
            key=lambda e: (0 if flags[e][0] else 1 if flags[e][1] else 2, abs(int(centre[e]) - canonical[node])),
        )[:max_tokens]
        token_counts[node] = len(flags)
        for slot, element in enumerate(chosen):
            is_promoter, is_loop = flags[element]
            distance = (int(centre[element]) - canonical[node]) * strand[node]
            scaled = np.log10(1 + abs(distance)) / 6.5
            tokens[node, slot, :7] = (
                accessibility[element], np.sign(distance) * scaled, scaled, is_promoter, is_loop,
                element_methylation[element], element_observed[element],
            )
            tokens[node, slot, 7:] = binding[element]
            token_mask[node, slot] = True
    permutation = np.arange(n_nodes)
    permutation[located] = rng.permutation(located)

    output.mkdir(mode=0o700)
    pd.DataFrame({
        "node": np.arange(n_nodes), "ensembl_id": node_ids,
        "symbol": [nodes[e]["symbol"] for e in node_ids],
        "hvg_index": [nodes[e]["hvg_index"] for e in node_ids],
        "target": [nodes[e]["target"] for e in node_ids],
        "tf_index": [nodes[e]["tf_index"] for e in node_ids],
        "has_locus": has_locus,
    }).to_csv(output / "nodes.csv", index=False)
    np.savez_compressed(
        output / "grn.npz",
        relation=np.concatenate(rel), source=np.concatenate(src), target=np.concatenate(dst),
        shuffled_relation=np.concatenate(s_rel), shuffled_source=np.concatenate(s_src),
        shuffled_target=np.concatenate(s_dst),
        node_features=node_features, node_masks=node_masks,
        relations=np.asarray(RELATIONS), symmetric=np.asarray(SYMMETRIC),
    )
    np.savez_compressed(
        output / "direct.npz", tokens=tokens, mask=token_mask, shuffled_gene_order=permutation,
        features=np.asarray(list(ELEMENT_FEATURES) + [f"chip_{s}" for s in tf_symbols]),
    )
    degree_out = np.bincount(np.concatenate(src), minlength=n_nodes)
    degree_in = np.bincount(np.concatenate(dst), minlength=n_nodes)
    target_nodes = np.asarray([bool(nodes[e]["target"]) for e in node_ids])
    hvg_nodes = np.asarray([nodes[e]["hvg_index"] >= 0 for e in node_ids])
    summary = {
        "format": "epi-duo-prior-v1",
        "nodes": n_nodes, "hvg_nodes": int(hvg_nodes.sum()), "target_nodes": int(target_nodes.sum()),
        "source_factors": n_tf, "source_factor_symbols": tf_symbols,
        "nodes_with_locus": int(has_locus.sum()),
        "atac_elements": int(n_elements), "elements_bound_by_any_factor": int(binding.any(axis=1).sum()),
        "loops": int(n_loops),
        "elements_with_methylation": int(element_observed.sum()),
        "nodes_with_promoter_methylation": int(node_meth_observed.sum()),
        "relations": relation_summary,
        "target_nodes_with_any_edge": int(((degree_in + degree_out > 0) & target_nodes).sum()),
        "target_nodes_that_are_source_factors": int((target_nodes & (degree_out > 0) & (tf_node_mask(tf_node, n_nodes))).sum()),
        "hvg_nodes_with_any_edge": int(((degree_in + degree_out > 0) & hvg_nodes).sum()),
        "direct_tokens": {
            "max_tokens": max_tokens, "features": n_features,
            "nodes_with_tokens": int(token_mask.any(axis=1).sum()),
            "median_candidate_elements": float(np.median(token_counts[located])),
            "nodes_truncated": int((token_counts > max_tokens).sum()),
            "priority": "promoter overlap, then loop-linked, then nearest within 50 kb of the canonical TSS",
        },
        "definitions": {
            "promoter": "[TSS-1000, TSS+1001) around every GENCODE v44 transcript start",
            "tf_promoter": "factor ChIP peak, ATAC peak and target promoter share at least one base",
            "tf_distal": "factor ChIP peak overlaps an ATAC peak in the loop anchor opposite the target promoter",
            "promoter_contact": "promoters of two genes lie in opposite anchors of one Hi-C loop",
            "shared_element": "two genes are loop-linked to the same distal ATAC peak",
            "methylation": f"coverage-weighted CpG fraction pooled over WGBS replicates; fewer than {MIN_CPG_COVERAGE} reads is unobserved",
        },
        "controls": {
            "grn": "per-relation degree-preserving double-edge swaps; node features unchanged",
            "direct": "token sets reassigned by a permutation of genes that have a locus",
        },
        "caveats": [
            "Bulk, unpaired K562 experiments; applying them to RPE1 is cross-cell-line transfer.",
            "Edges are unsigned candidates, not validated regulatory interactions.",
            "Only the ChIP factors already selected by Epi-C3 are used, so factor coverage is narrow.",
        ],
        "seed": seed,
    }
    (output / "summary.json").write_text(json.dumps(summary, indent=1), encoding="utf-8", newline="\n")
    print(json.dumps(summary, indent=1), flush=True)


def tf_node_mask(tf_node: np.ndarray, n_nodes: int) -> np.ndarray:
    mask = np.zeros(n_nodes, dtype=bool)
    mask[tf_node[tf_node >= 0]] = True
    return mask
