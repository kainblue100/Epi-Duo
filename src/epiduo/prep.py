"""Build the two-context Replogle benchmark used by every model arm.

The preprocessing follows ``state tx preprocess_train``: library-size
normalisation, ``log1p`` and 2,000 highly variable genes stored in
``obsm["X_hvg"]``.  Two things are stricter than the STATE recipe and are
recorded in the manifest: highly variable genes are chosen only from cells
that are training cells in *both* held-out-context splits, and no output
is ever overwritten.
"""

from __future__ import annotations

import hashlib
import json
import random
import shutil
import tomllib
from collections import Counter
from pathlib import Path

import h5py
import numpy as np

CONTROL_SOURCE = "control"
CONTROL = "non-targeting"
CONTEXTS = ("k562", "rpe1")
SEED = 42


def sha256(path: Path) -> str:
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def require_free_space(path: Path, reserve_gib: float) -> None:
    free = shutil.disk_usage(path).free / 1024**3
    if free < reserve_gib:
        raise OSError(f"Only {free:.0f} GiB free at {path}; the reserve is {reserve_gib:.0f} GiB")


def read_column(group: h5py.Group, name: str) -> np.ndarray:
    """Read an AnnData obs/var column stored as plain, categorical or nullable data."""

    def values(node):
        if isinstance(node, h5py.Group):  # nullable array: values + mask
            node = node["values"]
        return node.asstr()[:] if node.dtype.kind in "OS" else node[:]

    node = group[name]
    if isinstance(node, h5py.Group) and "categories" in node:
        return np.asarray(values(node["categories"]))[node["codes"][:]]
    return values(node)


def load_metadata(path: Path) -> dict:
    with h5py.File(path, "r") as f:
        obs, var = f["obs"], f["var"]
        return {
            "path": Path(path),
            "n_obs": f["X"].shape[0],
            "perturbation": read_column(obs, "perturbation").astype(str),
            "target_id": read_column(obs, "gene_id").astype(str),
            "batch": read_column(obs, "batch").astype(str),
            "symbols": read_column(var, "gene_name").astype(str),
            "ensembl": read_column(var, "ensembl_id").astype(str),
        }


def paper_test_list(toml_path: Path, context: str) -> list[str]:
    """Held-out perturbations of the STATE preprint for one Replogle context."""
    with Path(toml_path).open("rb") as stream:
        config = tomllib.load(stream)
    return list(config["fewshot"][f"replogle.{context}"]["test"])


def choose_splits(meta: dict, paper: dict, min_cells: int, n_val: int) -> dict:
    counts = {c: Counter(meta[c]["perturbation"].tolist()) for c in CONTEXTS}
    eligible = sorted(
        p for p in set(counts["k562"]) & set(counts["rpe1"])
        if p != CONTROL_SOURCE and all(counts[c][p] >= min_cells for c in CONTEXTS)
    )
    splits = {}
    for index, context in enumerate(CONTEXTS):
        test = sorted(set(paper[context]) & set(eligible))
        remaining = sorted(set(eligible) - set(test))
        val = sorted(random.Random(SEED + index).sample(remaining, n_val))
        splits[context] = {
            "test": test,
            "val": val,
            "fewshot_train": sorted(set(remaining) - set(val)),
            "paper_test_total": len(paper[context]),
        }
    return {"eligible": eligible, "splits": splits, "counts": counts}


def normalise_file(meta: dict, keep_rows: np.ndarray, columns: np.ndarray, out: np.memmap, label: str) -> None:
    """Stream raw counts, write log1p(CP10k) for the kept rows and shared genes."""
    with h5py.File(meta["path"], "r") as f:
        x = f["X"]
        if not isinstance(x, h5py.Dataset):
            raise ValueError("Expected a dense raw-count matrix")
        step = (x.chunks[0] if x.chunks else 1024) * 8
        position = np.full(x.shape[0], -1, dtype=np.int64)
        position[keep_rows] = np.arange(len(keep_rows))
        for start in range(0, x.shape[0], step):
            stop = min(start + step, x.shape[0])
            local = np.flatnonzero(position[start:stop] >= 0)
            if not len(local):
                continue
            block = x[start:stop][local]
            if not np.isfinite(block).all() or (block < 0).any() or (block != np.floor(block)).any():
                raise ValueError(f"{label}: expression is not finite non-negative integer counts")
            library = block.sum(axis=1, dtype=np.float64)
            if (library <= 0).any():
                raise ValueError(f"{label}: a selected cell has no counts")
            block = block[:, columns] * (10_000.0 / library).astype(np.float32)[:, None]
            np.log1p(block, out=block)
            out[position[start:stop][local]] = block
            print(f"{label}: {stop}/{x.shape[0]} rows", flush=True)


def select_hvgs(matrix: np.ndarray, rows: np.ndarray, symbols: list[str], n_hvg: int) -> np.ndarray:
    import anndata as ad
    import pandas as pd
    import scanpy as sc

    sample = ad.AnnData(X=np.asarray(matrix[np.sort(rows)]), var=pd.DataFrame(index=symbols))
    sample.uns["log1p"] = {"base": None}
    sc.pp.highly_variable_genes(sample, n_top_genes=n_hvg, flavor="seurat")
    selected = np.flatnonzero(sample.var["highly_variable"].to_numpy())
    if len(selected) != n_hvg:
        raise ValueError(f"Expected {n_hvg} highly variable genes, found {len(selected)}")
    return selected


def plain_string_indexes(path: Path) -> None:
    """cell-load 0.10 cannot read nullable string indexes; rewrite them as plain strings."""
    with h5py.File(path, "r+") as f:
        for key in ("obs/_index", "var/_index"):
            node = f[key]
            if isinstance(node, h5py.Dataset):
                continue
            if node.attrs.get("encoding-type") != "nullable-string-array" or np.any(node["mask"][:]):
                raise ValueError(f"Unexpected index encoding at {key}")
            values = node["values"].asstr()[:]
            parent, name = key.rsplit("/", 1)
            del f[key]
            dataset = f[parent].create_dataset(
                name, data=np.asarray(values, dtype=object), dtype=h5py.string_dtype("utf-8")
            )
            dataset.attrs["encoding-type"] = "string-array"
            dataset.attrs["encoding-version"] = "0.2.0"


def write_context(path: Path, matrix: np.ndarray, obs, symbols: list[str], ensembl: list[str]) -> None:
    import anndata as ad
    import pandas as pd
    from scipy import sparse

    var = pd.DataFrame({"ensembl_id": ensembl}, index=pd.Index(symbols, name=None))
    data = ad.AnnData(X=sparse.csr_matrix(matrix), obs=obs, var=var)
    data.obsm["X_hvg"] = np.ascontiguousarray(matrix)
    data.uns["log1p"] = {"base": None}
    data.write_h5ad(path)
    plain_string_indexes(path)


def split_toml(data_dir: Path, context: str, split: dict) -> str:
    return (
        "# Few-shot context generalisation: every other context is training data;\n"
        f"# the listed perturbations of {context} are held out.\n"
        f'[datasets]\nreplogle = "{data_dir}"\n\n[training]\nreplogle = "train"\n\n[zeroshot]\n\n'
        f'[fewshot]\n[fewshot."replogle.{context}"]\n'
        f"val = {json.dumps(split['val'])}\n"
        f"test = {json.dumps(split['test'])}\n"
    )


def prepare(
    k562: Path, rpe1: Path, paper_k562: Path, paper_rpe1: Path, output: Path, *,
    min_cells: int = 20, n_hvg: int = 2000, n_val: int = 100, hvg_cells: int = 100_000,
    reserve_gib: float = 205.0,
) -> None:
    import pandas as pd

    output = Path(output)
    if output.exists():
        raise FileExistsError(output)
    require_free_space(output.parent, reserve_gib + 30)
    meta = {"k562": load_metadata(k562), "rpe1": load_metadata(rpe1)}
    paper = {"k562": paper_test_list(paper_k562, "k562"), "rpe1": paper_test_list(paper_rpe1, "rpe1")}
    chosen = choose_splits(meta, paper, min_cells, n_val)
    eligible = set(chosen["eligible"]) | {CONTROL_SOURCE}

    pairs = [set(zip(meta[c]["symbols"], meta[c]["ensembl"], strict=True)) for c in CONTEXTS]
    shared = [pair for pair in zip(meta["k562"]["symbols"], meta["k562"]["ensembl"], strict=True) if pair in pairs[1]]
    symbols = [symbol for symbol, _ in shared]
    if len(set(symbols)) != len(symbols):
        raise ValueError("Shared gene symbols are not unique")

    output.mkdir(mode=0o700)
    data_dir = output / "data"
    data_dir.mkdir()
    (output / "splits").mkdir()
    scratch = output / "scratch.f32"
    rows = {c: np.flatnonzero(np.isin(meta[c]["perturbation"], sorted(eligible))) for c in CONTEXTS}
    offsets = {"k562": 0, "rpe1": len(rows["k562"])}
    total = len(rows["k562"]) + len(rows["rpe1"])
    matrix = np.lib.format.open_memmap(scratch, mode="w+", dtype=np.float32, shape=(total, len(shared)))
    for context in CONTEXTS:
        lookup = {pair: i for i, pair in enumerate(zip(meta[context]["symbols"], meta[context]["ensembl"], strict=True))}
        columns = np.asarray([lookup[pair] for pair in shared], dtype=np.int64)
        view = matrix[offsets[context]: offsets[context] + len(rows[context])]
        normalise_file(meta[context], rows[context], columns, view, context)
    matrix.flush()

    # Cells that are training cells under both held-out-context splits.
    always_train = []
    for context in CONTEXTS:
        held = set(chosen["splits"][context]["test"]) | set(chosen["splits"][context]["val"])
        labels = meta[context]["perturbation"][rows[context]]
        always_train.append(offsets[context] + np.flatnonzero(~np.isin(labels, sorted(held))))
    always_train = np.concatenate(always_train)
    rng = np.random.default_rng(SEED)
    sample = rng.choice(always_train, size=min(hvg_cells, len(always_train)), replace=False)
    hvg = select_hvgs(matrix, sample, symbols, n_hvg)
    hvg_symbols = [symbols[i] for i in hvg]
    hvg_ensembl = [shared[i][1] for i in hvg]

    target_ids: dict[str, str] = {}
    for context in CONTEXTS:
        labels = meta[context]["perturbation"][rows[context]]
        batches = meta[context]["batch"][rows[context]]
        ids = meta[context]["target_id"][rows[context]]
        for label, ensembl_id in zip(labels.tolist(), ids.tolist(), strict=True):
            if label != CONTROL_SOURCE and target_ids.setdefault(label, ensembl_id) != ensembl_id:
                raise ValueError(f"Perturbation {label} maps to more than one Ensembl ID")
        obs = pd.DataFrame(
            {
                "target_gene": np.where(labels == CONTROL_SOURCE, CONTROL, labels),
                "cell_type": context,
                "gem_group": [f"{context}_{batch}" for batch in batches],
                "source_row": rows[context],
            },
            index=[f"{context}:{row}" for row in rows[context]],
        )
        block = np.asarray(matrix[offsets[context]: offsets[context] + len(rows[context])][:, hvg])
        write_context(data_dir / f"{context}.h5ad", block, obs, hvg_symbols, hvg_ensembl)
        del block
    del matrix
    scratch.unlink()

    pd.DataFrame({"symbol": hvg_symbols, "ensembl_id": hvg_ensembl}).to_csv(output / "genes.csv", index=False)
    targets = sorted(target_ids)
    pd.DataFrame({"symbol": targets, "ensembl_id": [target_ids[t] for t in targets]}).to_csv(
        output / "targets.csv", index=False
    )
    for context in CONTEXTS:
        (output / "splits" / f"{context}.toml").write_text(
            split_toml(data_dir, context, chosen["splits"][context]), encoding="utf-8", newline="\n"
        )
    (output / "splits" / "splits.json").write_text(
        json.dumps({"control": CONTROL, "eligible": chosen["eligible"], **chosen["splits"]}, indent=1),
        encoding="utf-8", newline="\n",
    )
    manifest = {
        "format": "epi-duo-benchmark-v1",
        "sources": {c: {"file": meta[c]["path"].name, "rows": int(meta[c]["n_obs"])} for c in CONTEXTS},
        "cells": {c: int(len(rows[c])) for c in CONTEXTS},
        "control_cells": {c: int((meta[c]["perturbation"][rows[c]] == CONTROL_SOURCE).sum()) for c in CONTEXTS},
        "shared_genes": len(shared),
        "hvg": n_hvg,
        "eligible_perturbations": len(chosen["eligible"]),
        "min_cells_per_perturbation_and_context": min_cells,
        "splits": {
            c: {k: (len(v) if isinstance(v, list) else v) for k, v in chosen["splits"][c].items()} for c in CONTEXTS
        },
        "normalisation": "log1p(counts / per-cell total over all stored genes * 10000)",
        "hvg_selection": (
            f"scanpy seurat flavour on a seeded sample of {len(sample)} cells that are "
            "training cells under both splits"
        ),
        "test_lists": "STATE preprint replogle_tomls/{k562,rpe1}.toml intersected with eligible perturbations",
        "sha256": {
            **{f"data/{c}.h5ad": sha256(data_dir / f"{c}.h5ad") for c in CONTEXTS},
            **{f"splits/{c}.toml": sha256(output / "splits" / f"{c}.toml") for c in CONTEXTS},
        },
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8", newline="\n")
    print(json.dumps(manifest, indent=1), flush=True)
