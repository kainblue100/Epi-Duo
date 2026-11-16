#!/usr/bin/env bash
# Run every arm of the benchmark for one held-out context and one seed on one GPU,
# then score all of them with cell-eval.
#
#   scripts/run_benchmark.sh <k562|rpe1> <gpu> [max_steps] [seed]
#
# Required environment: BENCH, PRIOR, RUNS, LOGS; optional: PYTHON, STATE, EVAL_THREADS.
# STATE trains in the background while the five Epi-Duo arms run one after another.
# The two mean baselines have no trained weights, so they are only run for seed 42.
set -euo pipefail

SPLIT="$1"; GPU="$2"; STEPS="${3:-20000}"; SEED="${4:-42}"
: "${BENCH:?}" "${PRIOR:?}" "${RUNS:?}" "${LOGS:?}"
PYTHON="${PYTHON:-python}"
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$LOGS"
tag="$SPLIT-s$SEED"

bash "$HERE/run_state.sh" state_sm "$SPLIT" "$GPU" "$STEPS" "$SEED" > "$LOGS/state_sm-$tag.log" 2>&1 &
state_job=$!
for arm in "none real" "grn real" "grn shuffled" "direct real" "direct shuffled"; do
    # shellcheck disable=SC2086
    bash "$HERE/run_epiduo.sh" $arm "$SPLIT" "$GPU" "$STEPS" "$SEED" > "$LOGS/epiduo-${arm// /-}-$tag.log" 2>&1
done
if [ "$SEED" = 42 ]; then
    for baseline in perturb_mean context_mean; do
        bash "$HERE/run_state.sh" "$baseline" "$SPLIT" "$GPU" 100 "$SEED" > "$LOGS/$baseline-$tag.log" 2>&1
    done
fi
wait "$state_job"

for run in "$RUNS/$SPLIT"/*-s"$SEED"; do
    [ -e "$run/cell-eval/results.csv" ] && continue
    for dir in "$run/eval_final" "$run/eval_final.ckpt"; do
        [ -s "$dir/adata_pred.h5ad" ] || continue
        nice -n 15 "$PYTHON" -m epiduo eval --pred "$dir/adata_pred.h5ad" --real "$dir/adata_real.h5ad" \
            --genes "$BENCH/genes.csv" --output "$run/cell-eval" --num-threads "${EVAL_THREADS:-4}" \
            > "$LOGS/eval-$(basename "$run")-$SPLIT.log" 2>&1
    done
done
echo "BENCHMARK_DONE $tag"
