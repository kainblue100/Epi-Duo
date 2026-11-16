"""Synthetic-genome checks of the evidence table, the candidate network and the controls."""

import gzip
import json
import tempfile
import unittest
from pathlib import Path

import numpy as np

from epiduo import prior


def write_gz(path: Path, text: str) -> Path:
    with gzip.open(path, "wt") as stream:
        stream.write(text)
    return path


def gtf_line(gene: str, start: int, end: int, strand: str = "+") -> str:
    attributes = f'gene_id "{gene}.1"; transcript_id "T{gene}"; tag "Ensembl_canonical";'
    return f"chr1\tTEST\ttranscript\t{start}\t{end}\t.\t{strand}\t.\t{attributes}\n"


def peak(start: int, end: int, signal: float = 10.0) -> str:
    return f"chr1\t{start}\t{end}\t.\t1000\t.\t{signal}\t5\t5\t{(end - start) // 2}\n"


def loop(a: tuple[int, int], b: tuple[int, int]) -> str:
    return f"chr1\t{a[0]}\t{a[1]}\tchr1\t{b[0]}\t{b[1]}\t.\t.\t.\t.\t0,255,255\t10\n"


class PriorTest(unittest.TestCase):
    def test_overlap_pairs_matches_brute_force(self):
        rng = np.random.default_rng(0)
        a_start = rng.integers(0, 1000, 200)
        a_end = a_start + rng.integers(1, 60, 200)
        b_start = rng.integers(0, 1000, 150)
        b_end = b_start + rng.integers(1, 90, 150)
        i, j = prior.overlap_pairs(a_start, a_end, b_start, b_end)
        expected = {(x, y) for x in range(200) for y in range(150)
                    if a_start[x] < b_end[y] and b_start[y] < a_end[x]}
        self.assertEqual(set(zip(i.tolist(), j.tolist())), expected)

    def test_degree_preserving_shuffle(self):
        rng = np.random.default_rng(1)
        pairs = {(int(a), int(b)) for a, b in rng.integers(0, 40, (400, 2)) if a != b}
        src = np.asarray([a for a, _ in sorted(pairs)])
        dst = np.asarray([b for _, b in sorted(pairs)])
        new_src, new_dst, swaps = prior.degree_preserving_shuffle(src, dst, False, np.random.default_rng(2))
        self.assertGreater(swaps, 0)
        self.assertTrue(np.array_equal(np.bincount(src, minlength=40), np.bincount(new_src, minlength=40)))
        self.assertTrue(np.array_equal(np.bincount(dst, minlength=40), np.bincount(new_dst, minlength=40)))
        shuffled = set(zip(new_src.tolist(), new_dst.tolist()))
        self.assertEqual(len(shuffled), len(pairs))
        self.assertTrue(all(a != b for a, b in shuffled))
        self.assertNotEqual(shuffled, pairs)

    def test_build_on_a_synthetic_locus(self):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)
            (tmp / "genes.csv").write_text("symbol,ensembl_id\nG1,ENSG1\nG2,ENSG2\nG3,ENSG3\nG4,ENSG4\n")
            (tmp / "targets.csv").write_text("symbol,ensembl_id\nG1,ENSG1\nTF1,ENSGTF\nNOLOCUS,ENSGX\n")
            (tmp / "chip").mkdir()
            (tmp / "selection.json").write_text(json.dumps({"files": [
                {"file_accession": "CHIP1", "source_symbol": "TF1", "source_ensembl_id": "ENSGTF"}]}))
            write_gz(tmp / "genes.gtf.gz", "".join([
                gtf_line("ENSG1", 10_001, 20_000), gtf_line("ENSG2", 500_001, 520_000),
                gtf_line("ENSG3", 690_000, 705_000, "-"), gtf_line("ENSG4", 2_000_001, 2_010_000),
                gtf_line("ENSGTF", 900_001, 910_000),
            ]))
            write_gz(tmp / "atac.bed.gz", peak(9_500, 10_200, 30) + peak(499_800, 500_300) + peak(300_000, 300_400))
            write_gz(tmp / "chip" / "CHIP1.bed.gz", peak(9_900, 10_100) + peak(300_100, 300_300))
            write_gz(tmp / "loops.bedpe.gz", "#header\n" + loop((295_000, 305_000), (495_000, 505_000))
                     + loop((5_000, 15_000), (495_000, 505_000)) + loop((295_000, 305_000), (700_000, 710_000)))
            cpg = "".join(f"chr1\t{p}\t{p + 1}\t.\t20\t+\t{p}\t{p + 1}\t0,0,0\t20\t10\n" for p in (9_600, 9_800, 10_050))
            write_gz(tmp / "wgbs.bed.gz", cpg)
            prior.build(tmp / "genes.csv", tmp / "targets.csv", tmp / "selection.json", tmp / "chip",
                        tmp / "atac.bed.gz", [tmp / "loops.bedpe.gz"], [tmp / "wgbs.bed.gz"],
                        tmp / "genes.gtf.gz", tmp / "prior", max_tokens=4)
            summary = json.loads((tmp / "prior" / "summary.json").read_text())
            grn = np.load(tmp / "prior" / "grn.npz")
            direct = np.load(tmp / "prior" / "direct.npz")
            node = {"G1": 0, "G2": 1, "G3": 2, "G4": 3, "TF1": 4, "NOLOCUS": 5}
            edges = {name: set() for name in prior.RELATIONS}
            for r, s, t in zip(grn["relation"], grn["source"], grn["target"]):
                edges[prior.RELATIONS[r]].add((int(s), int(t)))
            self.assertEqual(edges["tf_promoter"], {(node["TF1"], node["G1"])})
            # the distal element is loop-linked to G2 and G3
            self.assertEqual(edges["tf_distal"], {(node["TF1"], node["G2"]), (node["TF1"], node["G3"])})
            self.assertEqual(edges["promoter_contact"], {(node["G1"], node["G2"])})
            self.assertEqual(edges["shared_element"], {(node["G2"], node["G3"])})
            self.assertEqual(summary["nodes"], 6)
            self.assertEqual(summary["nodes_with_locus"], 5)
            # G1 promoter: accessible, three CpGs at 10% methylation with 60 reads
            self.assertAlmostEqual(float(grn["node_features"][node["G1"], 1]), 0.1, places=6)
            self.assertEqual(float(grn["node_masks"][node["G1"], 1]), 1.0)
            self.assertEqual(float(grn["node_masks"][node["G2"], 1]), 0.0)  # unobserved, not zero
            features = direct["features"].tolist()
            tokens, mask = direct["tokens"], direct["mask"]
            first = tokens[node["G1"], 0]
            self.assertEqual(first[features.index("is_promoter")], 1.0)
            self.assertEqual(first[features.index("chip_TF1")], 1.0)
            self.assertAlmostEqual(float(first[features.index("methylation")]), 0.1, places=6)
            self.assertEqual(int(mask[node["G4"]].sum()), 0)  # no accessible element nearby
            self.assertEqual(int(mask[node["NOLOCUS"]].sum()), 0)
            # G2: its promoter peak first, then the loop-linked distal peak
            self.assertEqual(tokens[node["G2"], 0, features.index("is_promoter")], 1.0)
            self.assertEqual(tokens[node["G2"], 1, features.index("is_loop_linked")], 1.0)
            self.assertEqual(tokens[node["G2"], 1, features.index("chip_TF1")], 1.0)
            order = direct["shuffled_gene_order"]
            self.assertEqual(sorted(order.tolist()), list(range(6)))
            self.assertEqual(int(order[node["NOLOCUS"]]), node["NOLOCUS"])


if __name__ == "__main__":
    unittest.main()
