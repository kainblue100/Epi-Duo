"""Collect the aggregate, shareable outputs of a benchmark run.

Nothing per-cell is exported: no expression matrices, no cell identities,
no predicted cells and no model weights.  Absolute paths are removed.

    python scripts/export_public.py --work /path/to/workdir --output public/
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

import numpy as np
import pandas as pd

SPLITS = ("k562", "rpe1")


def strip_paths(value):
    if isinstance(value, dict):
        return {k: strip_paths(v) for k, v in value.items() if k not in {"pred", "real", "output"}}
    if isinstance(value, list):
        return [strip_paths(v) for v in value]
    if isinstance(value, str) and value.startswith("/"):
        return Path(value).name
    return value


def copy_json(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(strip_paths(json.loads(source.read_text())), indent=1), encoding="utf-8")


def state_history(run: Path) -> list[dict]:
    """Validation loss per step from the Lightning CSV logger of a STATE run."""
    files = sorted(run.glob("version_*/metrics.csv"))
    if not files:
        return []
    table = pd.read_csv(files[-1])
    column = next((c for c in table.columns if c in ("val_loss", "val/loss")), None)
    if column is None:
        return []
    rows = table.dropna(subset=[column])
    return [{"step": int(s), "val_loss": float(v)} for s, v in zip(rows["step"], rows[column], strict=True)]


def example_locus(prior_dir: Path, run: Path | None) -> dict:
    """One real gene: its cis-element tokens, its candidate edges and a small neighbourhood."""
    nodes = pd.read_csv(prior_dir / "nodes.csv", keep_default_na=False)
    direct = np.load(prior_dir / "direct.npz")
    grn = np.load(prior_dir / "grn.npz")
    features = direct["features"].tolist()
    tokens, mask = direct["tokens"], direct["mask"]
    chip = [i for i, name in enumerate(features) if name.startswith("chip_")]
    loop_col, promoter_col = features.index("is_loop_linked"), features.index("is_promoter")
    relations = grn["relations"].tolist()
    rel, src, dst = grn["relation"], grn["source"], grn["target"]

    # a perturbation target that is also an output gene, with loop-linked and factor-bound elements
    best, best_score = None, -1.0
    for node in np.flatnonzero((nodes["target"] != "") & (nodes["hvg_index"] >= 0)):
        n = int(mask[node].sum())
        if not 8 <= n <= 14:
            continue
        t = tokens[node, :n]
        factors = int((t[:, chip].sum(axis=0) > 0).sum())
        score = factors + 3 * min(int(t[:, loop_col].sum()), 3) + 2 * min(int(t[:, promoter_col].sum()), 2)
        if score > best_score:
            best, best_score = int(node), score
    n = int(mask[best].sum())
    attention = None
    if run is not None and (run / "final.pt").exists():
        import torch

        from epiduo.model import DirectPrior

        state = torch.load(run / "final.pt", map_location="cpu")
        weights = {k.removeprefix("prior."): v for k, v in state.items() if k.startswith("prior.")}
        module = DirectPrior(torch.from_numpy(tokens), torch.from_numpy(mask), weights["query"].shape[-1])
        module.load_state_dict(weights)
        module.eval()
        with torch.no_grad():
            attention = module.attention()[best, :n].tolist()

    regulators = sorted({int(s) for r, s, t in zip(rel, src, dst) if t == best and r < 2})
    partners = sorted({int(s if t == best else t) for r, s, t in zip(rel, src, dst) if r >= 2 and best in (s, t)})
    keep = [best] + regulators[:4] + partners[:3]
    for regulator in regulators[:4]:  # a few other targets of the same factors
        others = [int(t) for r, s, t in zip(rel, src, dst) if s == regulator and r == 0 and t not in keep]
        keep += others[:2]
    keep = list(dict.fromkeys(keep))
    index = {node: i for i, node in enumerate(keep)}
    edges = [
        {"relation": relations[r], "source": index[int(s)], "target": index[int(t)]}
        for r, s, t in zip(rel, src, dst) if int(s) in index and int(t) in index
    ]
    return {
        "gene": nodes.loc[best, "symbol"],
        "features": features,
        "tokens": np.round(tokens[best, :n], 4).tolist(),
        "trained_attention": attention,
        "node_features": dict(zip(["promoter_accessibility", "promoter_methylation", "linked_elements",
                                   "loop_partners"], np.round(grn["node_features"][best], 4).tolist())),
        "subgraph": {"nodes": [nodes.loc[k, "symbol"] for k in keep],
                     "is_factor": [bool(nodes.loc[k, "tf_index"] >= 0) for k in keep], "edges": edges},
        "note": "Derived from public ENCODE K562 tracks (ATAC ENCSR868FGK, WGBS ENCSR765JPC, Hi-C ENCSR545YBD, "
                "TF ChIP-seq) and GENCODE v44; distances are log-scaled as in the model input.",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--work", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    work, out = args.work, args.output
    out.mkdir(parents=True, exist_ok=True)

    copy_json(work / "benchmark" / "manifest.json", out / "benchmark.json")
    copy_json(work / "prior" / "summary.json", out / "prior-summary.json")
    shutil.copyfile(work / "benchmark" / "splits" / "splits.json", out / "splits.json")
    for split in SPLITS:
        for run in sorted((work / "runs" / split).glob("*-s*")):
            target = out / split / run.name
            if (run / "cell-eval" / "results.csv").exists():
                target.mkdir(parents=True, exist_ok=True)
                for name in ("results.csv", "agg_results.csv"):
                    shutil.copyfile(run / "cell-eval" / name, target / name)
                copy_json(run / "cell-eval" / "eval.json", target / "eval.json")
            if (run / "config.json").exists():
                copy_json(run / "config.json", target / "config.json")
                shutil.copyfile(run / "history.json", target / "history.json")
            elif (run / "config.yaml").exists():
                text = (run / "config.yaml").read_text()
                target.mkdir(parents=True, exist_ok=True)
                (target / "config.yaml").write_text(re.sub(r"/\S*/", "", text), encoding="utf-8")
                (target / "history.json").write_text(json.dumps(state_history(run), indent=1), encoding="utf-8")
        for comparison in [work / "compare" / split, *sorted((work / "runs" / split).glob("comparison*"))]:
            if (comparison / "comparison.csv").exists():
                shutil.copytree(comparison, out / split / "comparison", dirs_exist_ok=True)
    run = work / "runs" / "k562" / "epi-direct-s42"
    (out / "example.json").write_text(json.dumps(example_locus(work / "prior", run), indent=1), encoding="utf-8")
    freeze = work / "env-meta" / "freeze.txt"
    if freeze.exists():
        lines = [line for line in freeze.read_text().splitlines() if " @ file://" not in line]
        (out / "environment.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("exported to", out)


if __name__ == "__main__":
    main()
