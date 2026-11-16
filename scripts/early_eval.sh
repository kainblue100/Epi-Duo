#!/usr/bin/env bash
# Score each arm as soon as its predictions exist, then delete the per-cell prediction
# files (about 2.2 GB per arm; they can be rebuilt from the checkpoint in a minute).
# Runs next to scripts/run_benchmark.sh so that predictions never pile up on disk.
#
#   scripts/early_eval.sh <k562|rpe1> <seed>
#
# Required environment: BENCH, RUNS, LOGS; optional: PYTHON, EVAL_THREADS.
# The benchmark driver skips any run that already has cell-eval/results.csv, and this
# script never touches a run the driver is scoring (cell-eval/ exists without results).
set -uo pipefail

SPLIT="$1"; SEED="$2"
: "${BENCH:?}" "${RUNS:?}" "${LOGS:?}"
PYTHON="${PYTHON:-python}"
export OMP_NUM_THREADS=2 MKL_NUM_THREADS=2 OPENBLAS_NUM_THREADS=2 NUMEXPR_NUM_THREADS=2
declare -A failed=()

driver_alive() { pgrep -f "run_benchmark.sh $SPLIT [0-9]+ [0-9]+ $SEED\$" > /dev/null; }

# Print the prediction directory of a run once its predictions are complete.
predictions() {
    local run="$1" model
    model="$(basename "$run")"; model="${model%-s"$SEED"}"
    if [ -s "$run/eval_final/predict.json" ]; then
        echo "$run/eval_final"
    elif [ -d "$run/eval_final.ckpt" ] && grep -q STATE_RUN_DONE "$LOGS/$model-$SPLIT-s$SEED.log" 2> /dev/null; then
        echo "$run/eval_final.ckpt"
    fi
}

sweep() {
    local include_state="$1" run name dir
    for run in "$RUNS/$SPLIT"/*-s"$SEED"; do
        [ -d "$run" ] || continue
        name="$(basename "$run")"
        dir="$(predictions "$run")"
        [ -n "$dir" ] || continue
        if [ -s "$run/cell-eval/results.csv" ] && [ -s "$run/cell-eval/eval.json" ]; then
            if [ -e "$dir/adata_pred.h5ad" ] && ! pgrep -f "epiduo eval --pred $dir/" > /dev/null; then
                rm -f "$dir/adata_pred.h5ad" "$dir/adata_real.h5ad"
                echo "$(date +%T) freed $dir"
            fi
            continue
        fi
        [ -e "$run/cell-eval" ] && continue                      # the driver is scoring this run
        [ -n "${failed[$name]:-}" ] && continue
        # the driver scores STATE itself the moment STATE finishes; only take it over if the driver is gone
        [ "$include_state" = 0 ] && [ "$name" = "state_sm-s$SEED" ] && continue
        [ -s "$dir/adata_pred.h5ad" ] || continue
        rm -rf "$run/cell-eval.early"
        echo "$(date +%T) scoring $name"
        if nice -n 15 "$PYTHON" -m epiduo eval --pred "$dir/adata_pred.h5ad" --real "$dir/adata_real.h5ad" \
                --genes "$BENCH/genes.csv" --output "$run/cell-eval.early" --num-threads "${EVAL_THREADS:-4}" \
                > "$LOGS/eval-$name-$SPLIT.log" 2>&1 \
            && [ -s "$run/cell-eval.early/eval.json" ] && [ ! -e "$run/cell-eval" ]; then
            mv "$run/cell-eval.early" "$run/cell-eval"
            echo "$(date +%T) scored $name"
        else
            failed[$name]=1
            echo "$(date +%T) NOT_SCORED $name (see $LOGS/eval-$name-$SPLIT.log)"
        fi
    done
}

while driver_alive; do
    sweep 0
    sleep 20
done
sweep 1
sweep 1
echo "EARLY_EVAL_DONE $SPLIT-s$SEED"
