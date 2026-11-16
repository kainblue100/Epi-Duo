"""Predict held-out perturbations and write the two AnnData files cell-eval expects.

As in ``state tx predict``: one predicted cell is produced for every real
test cell (control cells included, predicted with the control label), each
from a randomly matched control cell of the same context, and both
matrices are clipped to [0, 14] before scoring.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import torch

from .data import Benchmark
from .prep import CONTEXTS
from .train import build_model

CLIP = (0.0, 14.0)


@torch.no_grad()
def predict(run: Path, checkpoint: str = "final.pt", output: Path | None = None, *, seed: int = 0,
            device: str = "cuda") -> None:
    import anndata as ad
    import pandas as pd

    run = Path(run)
    output = Path(output) if output else run / f"eval_{Path(checkpoint).stem}"
    if output.exists():
        raise FileExistsError(output)
    config = json.loads((run / "config.json").read_text(encoding="utf-8"))
    bench = Benchmark(config["benchmark"], config["split"])
    device = torch.device(device)
    model = build_model(config, bench).to(device)
    model.load_state_dict(torch.load(run / checkpoint, map_location=device))
    model.eval()

    held = CONTEXTS.index(config["split"])
    in_context = bench.context == held
    controls = np.flatnonzero(in_context & (bench.pert == 0))
    rng = np.random.default_rng(seed)
    set_len = config["cell_set_len"]
    x = torch.from_numpy(bench.x).to(device)
    rows, parents, predicted = [], [], []
    for pert in [0] + bench.test:
        cells = np.flatnonzero(in_context & (bench.pert == pert))
        matched = rng.choice(controls, size=len(cells), replace=len(cells) > len(controls))
        label = torch.tensor([pert], device=device)
        for start in range(0, len(cells), set_len):
            basal = x[torch.from_numpy(matched[start: start + set_len]).to(device)]
            predicted.append(model(basal[None], label)[0].clamp(*CLIP).cpu().numpy())
        rows.append(cells)
        parents.append(matched)
    rows, parents = np.concatenate(rows), np.concatenate(parents)
    obs = pd.DataFrame(
        {
            "target_gene": pd.Categorical([bench.perts[p] for p in bench.pert[rows]]),
            "cell_type": config["split"],
            "pert_cell_barcode": bench.cell_names[rows],
            "ctrl_cell_barcode": bench.cell_names[parents],
        },
        index=[str(i) for i in range(len(rows))],
    )
    var = pd.DataFrame(index=bench.genes)
    output.mkdir(parents=True, mode=0o700)
    ad.AnnData(X=np.concatenate(predicted), obs=obs, var=var).write_h5ad(output / "adata_pred.h5ad")
    ad.AnnData(X=np.clip(bench.x[rows], *CLIP), obs=obs.copy(), var=var).write_h5ad(output / "adata_real.h5ad")
    summary = {"checkpoint": checkpoint, "cells": int(len(rows)), "test_perturbations": len(bench.test),
               "control_cells": int(len(controls)), "seed": seed, "clip": CLIP}
    (output / "predict.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
    print(json.dumps(summary), flush=True)
