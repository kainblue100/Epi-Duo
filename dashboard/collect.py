"""Read the state of an Epi-Duo work directory and print it as one JSON object.

Runs on the training server with the system Python (standard library only):

    python3 collect.py /path/to/work

The dashboard server pipes this file to ``ssh host python3 - WORK``; nothing is
installed on the server and nothing is written there.
"""

import csv
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

WORK = Path(sys.argv[1])
RUNS, LOGS = WORK / "runs", WORK / "logs" / "runs"
SPLITS = ("k562", "rpe1")
# arm -> (log file prefix, kind, only for seed 42)
ARMS = {
    "state_sm": ("state_sm", "state", False),
    "backbone": ("epiduo-none-real", "epiduo", False),
    "epi-grn": ("epiduo-grn-real", "epiduo", False),
    "epi-grn-shuffled": ("epiduo-grn-shuffled", "epiduo", False),
    "epi-direct": ("epiduo-direct-real", "epiduo", False),
    "epi-direct-shuffled": ("epiduo-direct-shuffled", "epiduo", False),
    "perturb_mean": ("perturb_mean", "state", True),
    "context_mean": ("context_mean", "state", True),
}
BASELINE_STEPS = 100
TQDM = re.compile(r"(\d+)%\|[^|]*\|\s*(\d+)/(\d+)\s*\[([^\]]*)\]")
RATE = re.compile(r"([\d.]+)\s*(it/s|s/it)")
NOW = time.time()


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


def mtime(path):
    try:
        return os.path.getmtime(path)
    except OSError:
        return None


def tail_lines(path, size=6000, keep=14):
    """Last lines of a log; tqdm rewrites its line with carriage returns, so split on both."""
    try:
        with open(path, "rb") as handle:
            handle.seek(0, 2)
            handle.seek(max(0, handle.tell() - size))
            text = handle.read().decode("utf-8", "replace")
    except OSError:
        return []
    lines = [line.strip() for line in re.split(r"[\r\n]+", text) if line.strip()]
    out = []
    for line in lines:  # drop consecutive progress-bar frames of the same bar
        if out and TQDM.search(line) and TQDM.search(out[-1]) and line.split("%|")[0][:-3] == out[-1].split("%|")[0][:-3]:
            out[-1] = line
        else:
            out.append(line)
    return [line[:260] for line in out[-keep:]]


def last_bar(lines):
    for line in reversed(lines):
        found = TQDM.search(line)
        if found:
            rate = RATE.search(found.group(4))
            per_second = None
            if rate:
                per_second = float(rate.group(1)) if rate.group(2) == "it/s" else 1.0 / max(float(rate.group(1)), 1e-9)
            label = line[: found.start()].rsplit(":", 1)[0].strip()
            return {"label": label[-70:], "percent": int(found.group(1)), "done": int(found.group(2)),
                    "total": int(found.group(3)), "per_second": per_second}
    return None


def processes():
    try:
        text = subprocess.run(["ps", "-eo", "pid,etimes,args", "--no-headers", "-ww"], capture_output=True,
                              text=True, timeout=10).stdout
    except (OSError, subprocess.SubprocessError):
        return []
    found = []
    for line in text.splitlines():
        parts = line.split(None, 2)
        if len(parts) == 3 and str(WORK) in parts[2] or (len(parts) == 3 and "run_benchmark.sh" in parts[2]):
            found.append({"pid": int(parts[0]), "seconds": int(parts[1]), "args": parts[2]})
    return found


def run_activity(procs, split, name):
    """Which step of the pipeline currently has a live process for this run."""
    run = str(RUNS / split / name)
    active = {}
    for proc in procs:
        args = proc["args"]
        if "epiduo eval" in args and run + "/" in args:
            active["eval"] = proc["seconds"]
        elif "epiduo predict" in args and args.rstrip().split("--run ")[-1].split()[0] == run:
            active["predict"] = proc["seconds"]
        elif " tx predict" in args and "--output-dir " + run + " " in args + " ":
            active["predict"] = proc["seconds"]
        elif "epiduo train" in args and "--output " + run in args + " " and (args + " ").split("--output " + run)[1][:1] == " ":
            active["train"] = max(active.get("train", 0), proc["seconds"])
        elif " tx train" in args and "output_dir=" + str(RUNS / split) + " " in args and "name=" + name + " " in args + " ":
            active["train"] = max(active.get("train", 0), proc["seconds"])
    return active


def epiduo_history(log):
    history, config = [], None
    try:
        with open(log, encoding="utf-8", errors="replace") as handle:
            for line in handle:
                if line.startswith('{"step"'):
                    try:
                        history.append(json.loads(line))
                    except ValueError:
                        pass
                elif line.startswith('{"benchmark"'):
                    try:
                        config = json.loads(line)
                    except ValueError:
                        pass
    except OSError:
        pass
    return history, config


def state_history(metrics):
    """Lightning CSV log: train_loss every 50 steps, val_loss at validation."""
    train, val, last = {}, [], 0
    try:
        with open(metrics, newline="", encoding="utf-8") as handle:
            for row in csv.DictReader(handle):
                try:
                    step = int(float(row.get("step") or 0))
                except ValueError:
                    continue
                last = max(last, step)
                if row.get("train_loss"):
                    train.setdefault(step // 1000, []).append(float(row["train_loss"]))
                if row.get("val_loss"):
                    val.append({"step": step + 1, "val_loss": float(row["val_loss"])})
    except (OSError, ValueError):
        pass
    points = [{"step": (bucket + 1) * 1000, "train_loss": sum(v) / len(v)} for bucket, v in sorted(train.items())]
    return points, val, last + 1 if last else 0


def aggregate(path):
    """Mean row of cell-eval's agg_results.csv."""
    try:
        with open(path, newline="", encoding="utf-8") as handle:
            rows = list(csv.reader(handle))
    except OSError:
        return None
    if not rows:
        return None
    for row in rows[1:]:
        if row and row[0] == "mean":
            out = {}
            for key, value in zip(rows[0][1:], row[1:]):
                try:
                    out[key] = float(value)
                except ValueError:
                    out[key] = None
            return out
    return None


def describe_run(split, seed, arm, procs, driver_alive, default_steps):
    prefix, kind, _ = ARMS[arm]
    name = "%s-s%d" % (arm, seed)
    run = RUNS / split / name
    log = LOGS / ("%s-%s-s%d.log" % (prefix, split, seed))
    eval_log = LOGS / ("eval-%s-%s.log" % (name, split))
    baseline = arm in ("perturb_mean", "context_mean")
    info = {"split": split, "seed": seed, "arm": arm, "kind": kind, "name": name, "log": log.name,
            "max_steps": BASELINE_STEPS if baseline else default_steps, "step": 0, "history": [], "val_history": []}
    active = run_activity(procs, split, name)
    lines = tail_lines(log) if log.exists() else []
    info["updated"] = mtime(log)

    if kind == "epiduo":
        history, config = epiduo_history(log)
        config = read_json(run / "config.json") or config or {}
        info["max_steps"] = config.get("max_steps", info["max_steps"])
        info["parameters"] = config.get("parameters")
        info["history"] = history
        info["val_history"] = [{"step": h["step"], "val_loss": h["val_loss"]} for h in history if "val_loss" in h]
        if history:
            last = history[-1]
            info.update(step=last["step"], train_loss=last.get("train_loss"), val_loss=last.get("val_loss"),
                        minutes=last.get("minutes"))
            if last.get("minutes"):
                info["steps_per_minute"] = last["step"] / last["minutes"]
        trained = (run / "final.pt").exists()
        predicted = (run / "eval_final" / "predict.json").exists()
        pred_dir = run / "eval_final"
    else:
        train_points, val_points, step = state_history(run / "version_0" / "metrics.csv")
        info["history"], info["val_history"], info["step"] = train_points, val_points, step
        if train_points:
            info["train_loss"] = train_points[-1]["train_loss"]
        if val_points:
            info["val_loss"] = val_points[-1]["val_loss"]
        bar = last_bar(lines)
        if "train" in active and active["train"] > 0:
            info["minutes"] = active["train"] / 60
            if bar and bar["per_second"] and "Epoch" in " ".join(lines[-3:]):
                info["steps_per_minute"] = bar["per_second"] * 60
            elif step:
                info["steps_per_minute"] = step / max(info["minutes"], 1e-6)
        trained = (run / "checkpoints" / "final.ckpt").exists()
        predicted = any("STATE_RUN_DONE" in line for line in lines)
        pred_dir = run / "eval_final.ckpt"

    scored = (run / "cell-eval" / "results.csv").exists() and (run / "cell-eval" / "eval.json").exists()
    failed = any("Traceback (most recent call last)" in line or "Refusing to overwrite" in line for line in lines)
    if trained:
        info["step"] = info["max_steps"]
    if scored:
        stage = "scored"
        info["metrics"] = aggregate(run / "cell-eval" / "agg_results.csv")
        info["scored_at"] = mtime(run / "cell-eval" / "eval.json")
    elif "eval" in active:
        stage = "evaluating"
        info["eval_seconds"] = active["eval"]
        info["eval_bar"] = last_bar(tail_lines(eval_log))
    elif predicted:
        eval_tail = tail_lines(eval_log) if eval_log.exists() else []
        stage = "eval_failed" if any("Traceback" in line for line in eval_tail) else "predicted"
    elif "predict" in active or (trained and not failed and (active or driver_alive)):
        stage = "predicting"
    elif "train" in active:
        stage = "training"
    elif failed:
        stage = "failed"
    elif run.exists() or log.exists():
        stage = "training" if driver_alive else "interrupted"
    else:
        stage = "queued" if driver_alive else "not_started"
    info["stage"] = stage
    if stage == "training" and info.get("steps_per_minute"):
        info["eta_minutes"] = max(info["max_steps"] - info["step"], 0) / info["steps_per_minute"]
    info["predictions_on_disk"] = (pred_dir / "adata_pred.h5ad").exists()
    if stage in ("failed", "eval_failed", "interrupted"):
        info["error"] = (tail_lines(eval_log if stage == "eval_failed" else log, keep=6) or [""])[-1]
    return info


def eval_minutes(janitor):
    """Mean cell-eval duration, from the 'HH:MM:SS scoring NAME' / 'scored NAME' pairs early_eval.sh logs."""
    started, durations = {}, []
    try:
        lines = Path(janitor).read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError:
        return None
    for line in lines:
        found = re.fullmatch(r"(\d+):(\d+):(\d+) (scoring|scored) (\S+)", line.strip())
        if not found:
            continue
        seconds = int(found.group(1)) * 3600 + int(found.group(2)) * 60 + int(found.group(3))
        if found.group(4) == "scoring":
            started[found.group(5)] = seconds
        elif found.group(5) in started:
            durations.append(((seconds - started[found.group(5)]) % 86400) / 60)
    return sum(durations) / len(durations) if durations else None


def resources():
    out = {"cpus": os.cpu_count(), "load": list(os.getloadavg()), "gpus": []}
    try:
        text = subprocess.run(
            ["nvidia-smi", "--query-gpu=index,name,memory.used,memory.total,utilization.gpu,temperature.gpu",
             "--format=csv,noheader,nounits"], capture_output=True, text=True, timeout=15).stdout
        for line in text.strip().splitlines():
            index, name, used, total, util, temp = [part.strip() for part in line.split(",")]
            out["gpus"].append({"index": int(index), "name": name, "memory_used_mib": float(used),
                                "memory_total_mib": float(total), "utilization": float(util), "temperature": float(temp)})
    except (OSError, ValueError, subprocess.SubprocessError):
        pass
    try:
        stat = os.statvfs(str(WORK))
        out["disk"] = {"free_gib": stat.f_bavail * stat.f_frsize / 2 ** 30, "total_gib": stat.f_blocks * stat.f_frsize / 2 ** 30}
    except OSError:
        pass
    try:
        size = subprocess.run(["du", "-sb", str(RUNS)], capture_output=True, text=True, timeout=20).stdout.split()
        out["runs_gib"] = int(size[0]) / 2 ** 30
    except (OSError, ValueError, IndexError, subprocess.SubprocessError):
        pass
    try:
        memory = dict(line.split(":", 1) for line in Path("/proc/meminfo").read_text().splitlines())
        out["memory"] = {"total_gib": int(memory["MemTotal"].split()[0]) / 2 ** 20,
                         "available_gib": int(memory["MemAvailable"].split()[0]) / 2 ** 20}
    except (OSError, KeyError, ValueError):
        pass
    return out


def main():
    procs = processes()
    drivers = []
    for path in sorted(LOGS.glob("driver-*-s*.log")) if LOGS.exists() else []:
        found = re.fullmatch(r"driver-(\w+)-s(\d+)\.log", path.name)
        if not found:
            continue
        split, seed = found.group(1), int(found.group(2))
        steps, alive, elapsed = 20000, False, 0
        for proc in procs:
            cmd = re.search(r"run_benchmark\.sh %s \d+ (\d+) %d\s*$" % (split, seed), proc["args"])
            if cmd:
                alive, steps = True, int(cmd.group(1))
                elapsed = proc["seconds"]
        text = "\n".join(tail_lines(path, keep=5))
        driver = {"split": split, "seed": seed, "alive": alive, "done": "BENCHMARK_DONE" in text,
                  "max_steps": steps, "started": NOW - elapsed if alive else None, "updated": mtime(path),
                  "last_line": text.splitlines()[-1] if text else ""}
        janitor = LOGS / ("janitor-%s-s%d.log" % (split, seed))
        driver["early_eval"] = any("early_eval.sh %s %d" % (split, seed) in proc["args"] for proc in procs)
        driver["early_eval_log"] = tail_lines(janitor, keep=4)
        driver["eval_minutes"] = eval_minutes(janitor)
        drivers.append(driver)

    runs = []
    for driver in drivers:
        for arm, (_, _, only_first) in ARMS.items():
            if only_first and driver["seed"] != 42:
                continue
            try:
                info = describe_run(driver["split"], driver["seed"], arm, procs, driver["alive"], driver["max_steps"])
            except Exception as error:  # one unreadable run must not blank the whole dashboard
                info = {"split": driver["split"], "seed": driver["seed"], "arm": arm, "stage": "unknown",
                        "error": repr(error), "step": 0, "max_steps": driver["max_steps"], "history": [], "val_history": []}
            runs.append(info)

    logs = []
    if LOGS.exists():
        for path in sorted(LOGS.glob("*.log"), key=lambda p: mtime(p) or 0, reverse=True)[:40]:
            logs.append({"name": path.name, "updated": mtime(path), "size": path.stat().st_size,
                         "tail": tail_lines(path, keep=14)})

    manifest, prior = read_json(WORK / "benchmark" / "manifest.json"), read_json(WORK / "prior" / "summary.json")
    stages = {
        "environment": (WORK / "env" / "bin" / "state").exists(),
        "benchmark": bool(manifest),
        "prior": bool(prior),
        "compare": {split: (WORK / "compare" / split / "comparison.csv").exists() for split in SPLITS},
        "export": (WORK / "public").exists() and any((WORK / "public").iterdir()),
    }
    summary = {}
    if manifest:
        summary["benchmark"] = {key: manifest.get(key) for key in ("cells", "control_cells", "hvg", "eligible_perturbations", "splits")}
    if prior:
        summary["prior"] = {"nodes": prior.get("nodes"), "source_factors": prior.get("source_factors"),
                            "atac_elements": prior.get("atac_elements"), "loops": prior.get("loops"),
                            "edges": {k: v.get("edges") for k, v in (prior.get("relations") or {}).items()}}
    print(json.dumps({"time": NOW, "host": os.uname().nodename, "work": str(WORK), "resources": resources(),
                      "drivers": drivers, "runs": runs, "logs": logs, "stages": stages, "summary": summary}))


main()
