"""Score predictions with cell-eval and compare model arms.

``evaluate`` calls cell-eval the way ``state tx predict`` does (log1p
input, geometric-mean fold changes, the chosen metric profile).
``compare`` puts several arms side by side on the perturbations for which
a metric is defined in every arm, with a paired bootstrap interval and a
paired Wilcoxon test against a reference arm.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from .prep import CONTROL

LOWER_IS_BETTER = {"mse", "mae", "mse_delta", "mae_delta"}
FAMILIES = {
    "expression": ["pearson_delta", "mse", "mae", "mse_delta", "mae_delta"],
    "discrimination": ["discrimination_score_l1", "discrimination_score_l2", "discrimination_score_cosine",
                       "pearson_edistance", "clustering_agreement"],
    "differential expression": ["overlap_at_N", "overlap_at_50", "overlap_at_100", "overlap_at_200",
                                "overlap_at_500", "precision_at_N", "precision_at_50", "precision_at_100",
                                "precision_at_200", "precision_at_500", "de_spearman_sig", "de_direction_match",
                                "de_spearman_lfc_sig", "de_sig_genes_recall", "pr_auc", "roc_auc"],
}
PDEX_KWARGS = {"is_log1p": True, "geometric_mean": True}  # pdex>=0.3 spelling of STATE's exp_post_agg=True
SKIPPED = ("pearson_edistance", "clustering_agreement")  # `state tx predict` skips these two as well


def evaluate(pred: Path, real: Path, output: Path, *, profile: str = "full", num_threads: int = 4,
             genes: list[str] | None = None) -> None:
    import anndata as ad
    from cell_eval import MetricsEvaluator

    output = Path(output)
    if (output / "results.csv").exists():
        raise FileExistsError(output / "results.csv")
    output.mkdir(parents=True, exist_ok=True)
    adata_pred, adata_real = ad.read_h5ad(pred), ad.read_h5ad(real)
    for data in (adata_pred, adata_real):
        if "gene_names" in data.var:  # `state tx predict` keeps symbols in a column, not in the index
            data.var_names = data.var["gene_names"].astype(str).to_numpy()
        data.obs["target_gene"] = data.obs["target_gene"].astype(str)
    if genes is not None:
        for data in (adata_pred, adata_real):
            if data.n_vars != len(genes):
                raise ValueError("Gene axis length differs from the benchmark")
            if not set(data.var_names) & set(genes):  # positional names: restore the benchmark symbols
                data.var_names = genes
    if list(adata_pred.var_names) != list(adata_real.var_names):
        raise ValueError("Predicted and real gene axes differ")
    evaluator = MetricsEvaluator(
        adata_pred=adata_pred, adata_real=adata_real, control_pert=CONTROL, pert_col="target_gene",
        num_threads=num_threads, outdir=str(output), pdex_kwargs=dict(PDEX_KWARGS),
    )
    results, aggregate = evaluator.compute(profile=profile, basename="results.csv", skip_metrics=list(SKIPPED))
    aggregate.write_csv(output / "agg_results.csv")
    meta = {"profile": profile, "pdex_kwargs": PDEX_KWARGS, "skipped_metrics": list(SKIPPED),
            "perturbations": results.height, "cells": {"pred": adata_pred.n_obs, "real": adata_real.n_obs},
            "pred": str(pred), "real": str(real)}
    (output / "eval.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    print(aggregate, flush=True)


def paired_summary(values: np.ndarray, reference: np.ndarray, lower_is_better: bool, rng) -> dict:
    from scipy.stats import wilcoxon

    gain = (reference - values) if lower_is_better else (values - reference)  # > 0: better than reference
    draws = rng.integers(0, len(gain), (2000, len(gain)))
    low, high = np.percentile(gain[draws].mean(axis=1), [2.5, 97.5])
    p = float(wilcoxon(gain).pvalue) if np.any(gain != 0) else 1.0
    return {"gain": float(gain.mean()), "ci_low": float(low), "ci_high": float(high), "wilcoxon_p": p,
            "share_better": float((gain > 0).mean())}


def compare(arms: dict[str, str], reference: str, output: Path) -> None:
    """``arms`` maps a name to one cell-eval directory or to several (comma separated, one per seed).

    Per-perturbation scores are averaged over seeds before arms are compared, so the
    interval reflects variation between perturbations; ``seed_sd`` reports the spread
    of the per-seed means separately.
    """
    import pandas as pd

    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    tables = {
        name: [pd.read_csv(Path(path) / "results.csv").set_index("perturbation") for path in paths.split(",")]
        for name, paths in arms.items()
    }
    if reference not in tables:
        raise ValueError(f"Reference arm {reference!r} is missing")
    every = [t for runs in tables.values() for t in runs]
    perts = sorted(set.intersection(*(set(t.index) for t in every)))
    if any(len(t) != len(perts) for t in every):
        raise ValueError("Arms were scored on different perturbations")
    rng = np.random.default_rng(0)
    rows = []
    for family, metrics in FAMILIES.items():
        for metric in metrics:
            if any(metric not in t.columns for t in every):
                continue
            per_seed = {name: [pd.to_numeric(t.loc[perts, metric], errors="coerce") for t in runs]
                        for name, runs in tables.items()}
            frame = pd.DataFrame({name: pd.concat(runs, axis=1).mean(axis=1, skipna=False)
                                  for name, runs in per_seed.items()})
            keep = np.isfinite(frame).all(axis=1)
            frame = frame[keep]
            if frame.empty:
                continue
            per_condition = frame[reference].nunique() > 1 or len(frame) == 1
            for name in tables:
                seed_means = [float(run[keep].mean()) for run in per_seed[name]]
                row = {"family": family, "metric": metric, "arm": name, "mean": float(frame[name].mean()),
                       "seeds": len(seed_means),
                       "seed_sd": float(np.std(seed_means, ddof=1)) if len(seed_means) > 1 else float("nan"),
                       "n_perturbations": len(frame) if per_condition else 0,
                       "higher_is_better": metric not in LOWER_IS_BETTER}
                if name != reference and per_condition and len(frame) > 1:
                    row.update(paired_summary(frame[name].to_numpy(), frame[reference].to_numpy(),
                                              metric in LOWER_IS_BETTER, rng))
                rows.append(row)
    table = pd.DataFrame(rows)
    table.to_csv(output / "comparison.csv", index=False)
    wide = table.pivot(index=["family", "metric"], columns="arm", values="mean").loc[
        [(f, m) for f, ms in FAMILIES.items() for m in ms if (f, m) in set(zip(table["family"], table["metric"]))],
        list(tables),
    ]
    wide.to_csv(output / "means.csv")
    print(wide.to_string(float_format=lambda v: f"{v:.4f}"), flush=True)
