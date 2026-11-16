"""Live progress dashboard for an Epi-Duo benchmark running on a remote server.

    python dashboard/server.py --host user@server --work /path/to/epi-duo-work

Every ``--interval`` seconds the server pipes ``collect.py`` to
``ssh HOST python3 - WORK``, keeps the latest snapshot plus a short history of
resource use, and serves one page at http://127.0.0.1:8787/. Standard library
only; it listens on localhost and is read-only on the remote side.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import threading
import time
from collections import deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HERE = Path(__file__).resolve().parent
COLLECTOR = (HERE / "collect.py").read_text(encoding="utf-8").replace("\r\n", "\n")
HISTORY_LIMIT = 2880  # 12 hours at one sample every 15 seconds


def find_ssh(explicit: str | None) -> str:
    candidates = [explicit, r"C:\Program Files\Git\usr\bin\ssh.exe", shutil.which("ssh")]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    raise SystemExit("ssh was not found; pass --ssh")


class Monitor:
    def __init__(self, args: argparse.Namespace):
        self.args = args
        self.ssh = find_ssh(args.ssh)
        self.repo = Path(args.repo).resolve()
        self.cache = HERE / ".cache" / "history.json"
        self.lock = threading.Lock()
        self.wake = threading.Event()
        self.snapshot: dict | None = None
        self.local: dict = {}
        self.poll = {"ok": False, "error": "尚未取得数据", "last_success": None, "last_attempt": None,
                     "seconds": None, "interval": args.interval}
        self.history: deque = deque(maxlen=HISTORY_LIMIT)
        try:
            saved = json.loads(self.cache.read_text(encoding="utf-8"))
            if saved.get("work") == args.work and saved.get("host") == args.host:
                self.history.extend(saved["samples"])
        except (OSError, ValueError, KeyError):
            pass

    def collect(self) -> dict:
        command = [self.ssh, "-o", "BatchMode=yes", "-o", "ConnectTimeout=10", self.args.host,
                   f"python3 - '{self.args.work}'"]
        done = subprocess.run(command, input=COLLECTOR.encode("utf-8"), capture_output=True, timeout=90)
        if done.returncode != 0:
            raise RuntimeError(done.stderr.decode("utf-8", "replace").strip()[-400:] or f"ssh exited {done.returncode}")
        return json.loads(done.stdout.decode("utf-8"))

    def local_state(self) -> dict:
        """Deliverables that live in the local repository rather than on the server."""
        repo = self.repo

        def git(*parts: str) -> str | None:
            try:
                done = subprocess.run(["git", "-C", str(repo), *parts], capture_output=True, text=True, timeout=10)
            except (OSError, subprocess.SubprocessError):
                return None
            return done.stdout.strip() if done.returncode == 0 else None

        results = repo / "results"
        head, remote_head = git("rev-parse", "HEAD"), git("rev-parse", "origin/main")
        return {
            "repo": str(repo),
            "readme": (repo / "README.md").exists(),
            "explainer": (repo / "docs" / "index.html").exists(),
            "site_data": (repo / "docs" / "results.js").exists(),
            "results": results.exists() and any(results.rglob("*.csv")),
            "commits": int(git("rev-list", "--count", "HEAD") or 0),
            "remote": git("remote", "get-url", "origin"),
            "pushed": bool(head and head == remote_head),
        }

    def sample(self, snapshot: dict) -> dict:
        resources, runs = snapshot.get("resources", {}), snapshot.get("runs", [])
        return {
            "t": snapshot["time"],
            "gpu": [[g["utilization"], g["memory_used_mib"]] for g in resources.get("gpus", [])],
            "disk": (resources.get("disk") or {}).get("free_gib"),
            "load": (resources.get("load") or [None])[0],
            "runs_gib": resources.get("runs_gib"),
            "scored": sum(r.get("stage") == "scored" for r in runs),
        }

    def loop(self) -> None:
        while True:
            started = time.time()
            try:
                snapshot = self.collect()
                with self.lock:
                    self.snapshot = snapshot
                    self.history.append(self.sample(snapshot))
                    self.poll.update(ok=True, error=None, last_success=time.time())
                    samples = list(self.history)
                try:
                    self.cache.parent.mkdir(exist_ok=True)
                    self.cache.write_text(json.dumps({"host": self.args.host, "work": self.args.work, "samples": samples}),
                                          encoding="utf-8")
                except OSError:
                    pass
            except Exception as error:  # keep polling; the page shows the reason
                with self.lock:
                    self.poll.update(ok=False, error=str(error)[:400])
            with self.lock:
                self.poll.update(last_attempt=time.time(), seconds=time.time() - started)
            self.wake.wait(max(self.args.interval - (time.time() - started), 1))
            self.wake.clear()

    def status(self) -> dict:
        # snapshot copy under the lock; local git probes stay outside so a slow
        # filesystem cannot block the collector thread (or the next HTTP response)
        with self.lock:
            payload = {"now": time.time(), "poll": dict(self.poll), "snapshot": self.snapshot,
                       "history": list(self.history), "local": self.local,
                       "config": {"host": self.args.host, "work": self.args.work,
                                  "reserve_gib": self.args.reserve_gib}}
        if time.time() - self.local.get("_checked", 0) > 30:
            local = self.local_state()
            local["_checked"] = time.time()
            with self.lock:
                self.local = local
            payload["local"] = local
        return payload


def handler(monitor: Monitor):
    class Handler(BaseHTTPRequestHandler):
        def send(self, code: int, body: bytes, kind: str) -> None:
            self.send_response(code)
            self.send_header("Content-Type", kind)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self) -> None:  # noqa: N802 - name fixed by http.server
            path = self.path.split("?")[0]
            if path in ("/", "/index.html"):
                self.send(200, (HERE / "index.html").read_bytes(), "text/html; charset=utf-8")
            elif path == "/api/status":
                self.send(200, json.dumps(monitor.status()).encode("utf-8"), "application/json")
            else:
                self.send(404, b"not found", "text/plain")

        def do_POST(self) -> None:  # noqa: N802
            if self.path == "/api/refresh":
                monitor.wake.set()
                self.send(200, b"{}", "application/json")
            else:
                self.send(404, b"not found", "text/plain")

        def log_message(self, *args) -> None:  # the page polls every few seconds; keep the console quiet
            pass

    return Handler


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--host", required=True, help="ssh destination, e.g. user@server")
    parser.add_argument("--work", required=True, help="Epi-Duo work directory on the server")
    parser.add_argument("--repo", default=str(HERE.parent), help="local Epi-Duo repository (for the local deliverables)")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument("--interval", type=float, default=15, help="seconds between remote polls")
    parser.add_argument("--reserve-gib", type=float, default=200, help="free space that must stay untouched")
    parser.add_argument("--ssh", help="path to the ssh executable")
    args = parser.parse_args()
    monitor = Monitor(args)
    threading.Thread(target=monitor.loop, daemon=True).start()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), handler(monitor))
    print(f"Epi-Duo dashboard: http://127.0.0.1:{args.port}/  (polling {args.host} every {args.interval:g}s)", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
