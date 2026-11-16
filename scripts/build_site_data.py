"""Turn results/ into docs/results.js for the explainer page."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RESULTS = ROOT / "results"
OUT = ROOT / "docs" / "results.js"

LABELS = {
    "state": "STATE",
    "backbone": "骨架（无先验）",
    "epi_grn": "Epi-GRN",
    "epi_grn_shuffled": "Epi-GRN 打乱",
    "epi_direct": "Epi-Direct",
    "epi_direct_shuffled": "Epi-Direct 打乱",
    "perturb_mean": "perturb_mean",
    "context_mean": "context_mean",
}
ORDER = list(LABELS)
FAMILIES = {
    "expression": "表达",
    "discrimination": "区分",
    "differential expression": "差异表达",
}
HEADLINE = {
    "pearson_delta", "mse", "mae", "discrimination_score_l1", "discrimination_score_cosine",
    "overlap_at_N", "precision_at_N", "de_direction_match", "de_spearman_lfc_sig", "pr_auc", "roc_auc",
}


def finite(v):
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return x if x == x else None


def read_csv(path: Path) -> list[dict]:
    import csv

    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def load_split(split: str) -> dict:
    comparison = read_csv(RESULTS / split / "comparison" / "comparison.csv")
    means = read_csv(RESULTS / split / "comparison" / "means.csv")
    arms = [a for a in ORDER if a in (means[0] if means else {})]
    by_key = {(r["family"], r["metric"], r["arm"]): r for r in comparison}
    rows = []
    for mean_row in means:
        family, metric = mean_row["family"], mean_row["metric"]
        higher = metric not in {"mse", "mae", "mse_delta", "mae_delta"}
        state_mean = finite(by_key.get((family, metric, "state"), {}).get("mean"))
        denom = abs(state_mean or 0) or 1.0
        values = {}
        for arm in arms:
            r = by_key.get((family, metric, arm))
            if not r:
                continue
            mean = finite(r.get("mean"))
            gain = finite(r.get("gain")) if arm != "state" else None
            lo = finite(r.get("ci_low")) if arm != "state" else None
            hi = finite(r.get("ci_high")) if arm != "state" else None
            p = finite(r.get("wilcoxon_p")) if arm != "state" else None
            rel = (gain / denom) if gain is not None else None
            verdict = None
            if arm != "state" and p is not None and lo is not None and hi is not None:
                if p < 0.05 and lo > 0:
                    verdict = "better"
                elif p < 0.05 and hi < 0:
                    verdict = "worse"
                else:
                    verdict = "tie"
            values[arm] = {"mean": mean, "gain": gain, "rel_gain": rel,
                           "rel_lo": (lo / denom) if lo is not None else None,
                           "rel_hi": (hi / denom) if hi is not None else None,
                           "p": p, "verdict": verdict}
        rows.append({"family": family, "family_label": FAMILIES.get(family, family), "metric": metric,
                     "higher": higher, "headline": metric in HEADLINE, "values": values})
    return {
        "caption": f"留出 {split.upper()} · seed 42 · 相对 STATE 的配对比较",
        "arms": arms,
        "labels": {a: LABELS[a] for a in arms},
        "rows": rows,
    }


def main() -> None:
    prior = json.loads((RESULTS / "prior-summary.json").read_text(encoding="utf-8"))
    bench = json.loads((RESULTS / "benchmark.json").read_text(encoding="utf-8"))
    example = json.loads((RESULTS / "example.json").read_text(encoding="utf-8"))
    payload = {
        "benchmark": {
            "cells": bench["cells"],
            "controls": bench["control_cells"],
            "hvg": bench["hvg"],
            "eligible": bench["eligible_perturbations"],
            "splits": bench["splits"],
        },
        "prior": {
            "nodes": prior["nodes"],
            "factors": prior["source_factors"],
            "factor_symbols": prior["source_factor_symbols"],
            "atac": prior["atac_elements"],
            "loops": prior["loops"],
            "edges": {k: v["edges"] for k, v in prior["relations"].items()},
            "shuffled_kept": {k: v["shuffled_edges_kept_from_real"] for k, v in prior["relations"].items()},
            "tokens_with_any": prior.get("nodes_with_tokens") or prior.get("direct", {}).get("nodes_with_tokens"),
        },
        "example": example,
        "results": {split: load_split(split) for split in ("k562", "rpe1")
                    if (RESULTS / split / "comparison" / "comparison.csv").exists()},
    }
    # fill missing prior token count from summary if nested
    if payload["prior"]["tokens_with_any"] is None:
        payload["prior"]["tokens_with_any"] = prior.get("direct_tokens", {}).get("nodes_with_tokens")
    OUT.write_text("window.EPIDUO = " + json.dumps(payload, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    print("wrote", OUT, "bytes", OUT.stat().st_size)


if __name__ == "__main__":
    main()
