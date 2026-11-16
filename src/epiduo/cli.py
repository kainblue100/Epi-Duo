"""``epiduo`` command line: prep → prior → train → predict → eval."""

from __future__ import annotations

import argparse
from pathlib import Path


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(prog="epiduo", description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)

    p = commands.add_parser("prep", help="normalise, select HVGs and write the benchmark and split TOMLs")
    p.add_argument("--k562", type=Path, required=True, help="raw-count Replogle K562 essential h5ad")
    p.add_argument("--rpe1", type=Path, required=True, help="raw-count Replogle RPE1 h5ad")
    p.add_argument("--paper-k562", type=Path, required=True, help="STATE preprint replogle_tomls/k562.toml")
    p.add_argument("--paper-rpe1", type=Path, required=True, help="STATE preprint replogle_tomls/rpe1.toml")
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--min-cells", type=int, default=20)
    p.add_argument("--num-hvgs", type=int, default=2000)
    p.add_argument("--num-val", type=int, default=100)
    p.add_argument("--reserve-gib", type=float, default=205.0)

    p = commands.add_parser("prior", help="build the GRN and direct-token priors from epigenomic tracks")
    p.add_argument("--benchmark", type=Path, required=True, help="output directory of `epiduo prep`")
    p.add_argument("--chip-selection", type=Path, required=True, help="JSON listing the ChIP files and factors")
    p.add_argument("--chip-dir", type=Path, required=True)
    p.add_argument("--atac", type=Path, required=True)
    p.add_argument("--loops", type=Path, nargs="+", required=True)
    p.add_argument("--wgbs", type=Path, nargs="+", required=True)
    p.add_argument("--gencode", type=Path, required=True)
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--max-tokens", type=int, default=24)

    p = commands.add_parser("train", help="train Epi-GRN, Epi-Direct or the prior-free backbone")
    p.add_argument("--benchmark", type=Path, required=True)
    p.add_argument("--split", choices=("k562", "rpe1"), required=True, help="held-out context")
    p.add_argument("--model", choices=("grn", "direct", "none"), required=True)
    p.add_argument("--prior", type=Path, help="output directory of `epiduo prior`")
    p.add_argument("--shuffled-prior", action="store_true", help="use the structure-destroying control prior")
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--max-steps", type=int, default=20000)
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--cell-set-len", type=int, default=128)
    p.add_argument("--hidden-dim", type=int, default=512)
    p.add_argument("--layers", type=int, default=4)
    p.add_argument("--heads", type=int, default=8)
    p.add_argument("--prior-dim", type=int, default=128)
    p.add_argument("--lr", type=float, default=1e-4)
    p.add_argument("--weight-decay", type=float, default=5e-4)
    p.add_argument("--val-freq", type=int, default=1000)
    p.add_argument("--seed", type=int, default=42)
    p.add_argument("--device", default="cuda")

    p = commands.add_parser("predict", help="predict the held-out perturbations of a trained run")
    p.add_argument("--run", type=Path, required=True)
    p.add_argument("--checkpoint", default="final.pt")
    p.add_argument("--output", type=Path, help="defaults to <run>/eval_<checkpoint>")
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--device", default="cuda")

    p = commands.add_parser("eval", help="score predictions with cell-eval, exactly as `state tx predict` does")
    p.add_argument("--pred", type=Path, required=True, help="adata_pred.h5ad")
    p.add_argument("--real", type=Path, required=True, help="adata_real.h5ad")
    p.add_argument("--output", type=Path, required=True)
    p.add_argument("--profile", default="full")
    p.add_argument("--num-threads", type=int, default=4)
    p.add_argument("--genes", type=Path, help="benchmark genes.csv; names the gene axis of STATE outputs")

    p = commands.add_parser("compare", help="collect cell-eval tables of several arms into one comparison")
    p.add_argument("--arm", action="append", required=True, metavar="NAME=EVAL_DIR[,EVAL_DIR...]",
                   help="one cell-eval directory per seed")
    p.add_argument("--reference", default="state", help="arm that the others are compared with")
    p.add_argument("--output", type=Path, required=True)

    args = parser.parse_args(argv)
    if args.command == "prep":
        from .prep import prepare
        prepare(args.k562, args.rpe1, args.paper_k562, args.paper_rpe1, args.output, min_cells=args.min_cells,
                n_hvg=args.num_hvgs, n_val=args.num_val, reserve_gib=args.reserve_gib)
    elif args.command == "prior":
        from .prior import build
        build(args.benchmark / "genes.csv", args.benchmark / "targets.csv", args.chip_selection, args.chip_dir,
              args.atac, args.loops, args.wgbs, args.gencode, args.output, max_tokens=args.max_tokens)
    elif args.command == "train":
        from .train import train
        train(args)
    elif args.command == "predict":
        from .predict import predict
        predict(args.run, args.checkpoint, args.output, seed=args.seed, device=args.device)
    elif args.command == "eval":
        from .evaluate import evaluate
        genes = None
        if args.genes:
            import pandas as pd
            genes = pd.read_csv(args.genes)["symbol"].tolist()
        evaluate(args.pred, args.real, args.output, profile=args.profile, num_threads=args.num_threads, genes=genes)
    elif args.command == "compare":
        from .evaluate import compare
        compare(dict(item.split("=", 1) for item in args.arm), args.reference, args.output)


if __name__ == "__main__":
    main()
