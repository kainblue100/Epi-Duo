#!/usr/bin/env bash
# Train STATE (or one of its mean baselines) with the official CLI on the Epi-Duo
# benchmark, then write adata_pred.h5ad / adata_real.h5ad with `state tx predict`.
#
#   scripts/run_state.sh <state_sm|perturb_mean|context_mean> <k562|rpe1> <gpu> [max_steps] [seed]
#
# Required environment: BENCH (output of `epiduo prep`), RUNS (run root), STATE (path to the state CLI).
set -euo pipefail

MODEL="$1"; SPLIT="$2"; GPU="$3"; STEPS="${4:-20000}"; SEED="${5:-42}"
: "${BENCH:?Set BENCH to the benchmark directory}" "${RUNS:?Set RUNS to the run root}"
STATE="${STATE:-state}"
NAME="${MODEL}-s${SEED}"
OUT="$RUNS/$SPLIT"
if [ -e "$OUT/$NAME" ]; then
    echo "Refusing to overwrite $OUT/$NAME" >&2
    exit 1
fi
mkdir -p "$OUT"
export CUDA_VISIBLE_DEVICES="$GPU" WANDB_MODE=disabled HF_HUB_OFFLINE=1 TRANSFORMERS_OFFLINE=1
export OMP_NUM_THREADS=2 MKL_NUM_THREADS=2 OPENBLAS_NUM_THREADS=2 NUMEXPR_NUM_THREADS=2

common=(
    "output_dir=$OUT" "name=$NAME" "use_wandb=false" "overwrite=false"
    "data.kwargs.toml_config_path=$BENCH/splits/$SPLIT.toml"
    "data.kwargs.embed_key=X_hvg" "data.kwargs.output_space=embedding"
    "data.kwargs.pert_col=target_gene" "data.kwargs.cell_type_key=cell_type"
    "data.kwargs.batch_col=gem_group" "data.kwargs.control_pert=non-targeting"
    "data.kwargs.num_workers=${WORKERS:-4}" "data.kwargs.barcode=true"
    "training.train_seed=$SEED" "training.wandb_track=false" "training.batch_size=16"
    "training.max_steps=$STEPS" "training.val_freq=${VAL_FREQ:-1000}"
    "training.ckpt_every_n_steps=${CKPT_FREQ:-$STEPS}"
    "model.kwargs.cell_set_len=128"
)
case "$MODEL" in
    state_sm) extra=() ;;
    perturb_mean|context_mean) extra=("model.kwargs.cell_sentence_len=128") ;;
    *) echo "Unknown model $MODEL" >&2; exit 1 ;;
esac

nice -n 10 "$STATE" tx train "model=$MODEL" "${common[@]}" "${extra[@]}"
test -s "$OUT/$NAME/checkpoints/final.ckpt"
# every STATE checkpoint is ~0.5 GB; keep only the two that are ever evaluated
find "$OUT/$NAME/checkpoints" -name '*.ckpt' ! -name final.ckpt ! -name best.ckpt -delete
nice -n 10 "$STATE" tx predict --output-dir "$OUT/$NAME" --checkpoint final.ckpt --predict-only
echo "STATE_RUN_DONE $OUT/$NAME"
