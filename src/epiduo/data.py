"""In-memory access to the prepared benchmark and construction of model inputs."""

from __future__ import annotations

import json
from pathlib import Path

import h5py
import numpy as np
import torch

from .prep import CONTEXTS, CONTROL, read_column


class Benchmark:
    """All cells of both contexts with their perturbation, context and split role."""

    def __init__(self, root: Path, held_out: str) -> None:
        root = Path(root)
        splits = json.loads((root / "splits" / "splits.json").read_text(encoding="utf-8"))
        if splits["control"] != CONTROL or held_out not in CONTEXTS:
            raise ValueError("Unexpected benchmark layout")
        self.root, self.held_out = root, held_out
        self.perts = [CONTROL] + list(splits["eligible"])
        index = {name: i for i, name in enumerate(self.perts)}
        self.test = sorted(index[p] for p in splits[held_out]["test"])
        self.val = sorted(index[p] for p in splits[held_out]["val"])
        matrices, pert, context, names = [], [], [], []
        for c, name in enumerate(CONTEXTS):
            with h5py.File(root / "data" / f"{name}.h5ad", "r") as f:
                matrices.append(f["obsm/X_hvg"][:])
                labels = read_column(f["obs"], "target_gene").astype(str)
                names.append(f["obs/_index"].asstr()[:])
                genes = f["var/_index"].asstr()[:].tolist()
            pert.append(np.asarray([index[label] for label in labels.tolist()]))
            context.append(np.full(len(labels), c))
        self.genes = genes
        self.x = np.concatenate(matrices)
        self.pert = np.concatenate(pert)
        self.context = np.concatenate(context)
        self.cell_names = np.concatenate(names)
        held = np.isin(self.pert, self.test + self.val) & (self.context == CONTEXTS.index(held_out))
        self.train_mask = ~held

    def groups(self, mask: np.ndarray) -> list[tuple[int, int, np.ndarray]]:
        """(context, perturbation, cell indices) for every non-empty group inside ``mask``."""
        out = []
        for c in range(len(CONTEXTS)):
            rows = np.flatnonzero(mask & (self.context == c))
            if not len(rows):
                continue
            order = np.argsort(self.pert[rows], kind="stable")
            rows = rows[order]
            values, starts = np.unique(self.pert[rows], return_index=True)
            for value, part in zip(values.tolist(), np.split(rows, starts[1:]), strict=True):
                out.append((c, value, part))
        return out

    def controls(self) -> list[np.ndarray]:
        return [np.flatnonzero((self.pert == 0) & (self.context == c)) for c in range(len(CONTEXTS))]


def load_prior(kind: str, prior_dir: Path, bench: Benchmark, dim: int, shuffled: bool):
    """Build the prior module and the index tensors that tie it to the benchmark axes."""
    import pandas as pd

    from .model import DirectPrior, GRNPrior

    nodes = pd.read_csv(Path(prior_dir) / "nodes.csv", keep_default_na=False)
    by_target = {t: n for t, n in zip(nodes["target"], nodes["node"], strict=True) if t}
    pert_node = torch.tensor([by_target.get(p, -1) for p in bench.perts])
    by_gene = dict(zip(nodes.loc[nodes["hvg_index"] >= 0, "hvg_index"], nodes.loc[nodes["hvg_index"] >= 0, "node"],
                       strict=True))
    gene_node = torch.tensor([by_gene[i] for i in range(len(bench.genes))])
    symbols = nodes.sort_values("hvg_index").loc[lambda d: d["hvg_index"] >= 0, "symbol"].tolist()
    if symbols != bench.genes:
        raise ValueError("The prior was built for a different gene axis")
    if kind == "direct":
        data = np.load(Path(prior_dir) / "direct.npz")
        tokens, mask = torch.from_numpy(data["tokens"]), torch.from_numpy(data["mask"])
        if shuffled:
            order = torch.from_numpy(data["shuffled_gene_order"])
            tokens, mask = tokens[order], mask[order]
        return DirectPrior(tokens, mask, dim), pert_node, gene_node, None
    if kind != "grn":
        raise ValueError(kind)
    data = np.load(Path(prior_dir) / "grn.npz")
    prefix = "shuffled_" if shuffled else ""
    relation = torch.from_numpy(data[prefix + "relation"])
    source = torch.from_numpy(data[prefix + "source"])
    target = torch.from_numpy(data[prefix + "target"])
    symmetric = data["symmetric"].tolist()
    prior = GRNPrior(torch.from_numpy(data["node_features"]), torch.from_numpy(data["node_masks"]),
                     relation, source, target, symmetric, dim)
    # direct edges from each perturbed gene to each output gene, one channel per adjacency
    rows = pert_node.clamp_min(0)
    support = prior.adjacency.gt(0).transpose(1, 2)[:, rows][:, :, gene_node].float()
    support = support * (pert_node >= 0)[None, :, None]
    return prior, pert_node, gene_node, support
