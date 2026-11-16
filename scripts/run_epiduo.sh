#!/usr/bin/env bash
# Train one Epi-Duo arm and write its adata_pred.h5ad / adata_real.h5ad.
#
#   scripts/run_epiduo.sh <grn|direct|none> <real|shuffled> <k562|rpe1> <gpu> [max_steps] [seed]
#
# Required environment: BENCH (output of `epiduo prep`), PRIOR (output of `epiduo prior`), RUNS (run root).
set -euo pipefail

MODEL="$1"; KIND="$2"; SPLIT="$3"; GPU="$4"; STEPS="${5:-20000}"; SEED="${6:-42}"
: "${BENCH:?Set BENCH}" "${PRIOR:?Set PRIOR}" "${RUNS:?Set RUNS}"
PYTHON="${PYTHON:-python}"
case "$MODEL-$KIND" in
    none-real) NAME="backbone-s$SEED"; extra=() ;;
    grn-real|direct-real) NAME="epi-$MODEL-s$SEED"; extra=(--prior "$PRIOR") ;;
    grn-shuffled|direct-shuffled) NAME="epi-$MODEL-shuffled-s$SEED"; extra=(--prior "$PRIOR" --shuffled-prior) ;;
    *) echo "Unknown arm $MODEL $KIND" >&2; exit 1 ;;
esac
OUT="$RUNS/$SPLIT/$NAME"
export CUDA_VISIBLE_DEVICES="$GPU" OMP_NUM_THREADS=2 MKL_NUM_THREADS=2 OPENBLAS_NUM_THREADS=2

nice -n 10 "$PYTHON" -m epiduo train --benchmark "$BENCH" --split "$SPLIT" --model "$MODEL" "${extra[@]}" \
    --max-steps "$STEPS" --seed "$SEED" --output "$OUT"
nice -n 10 "$PYTHON" -m epiduo predict --run "$OUT" --checkpoint final.pt
echo "EPIDUO_RUN_DONE $OUT"
