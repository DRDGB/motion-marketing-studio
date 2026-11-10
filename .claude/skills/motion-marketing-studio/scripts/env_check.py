#!/usr/bin/env python3
"""Phase 0 capability check. Prints a Markdown report; never prints secret values (names only).
Usage: python3 -I env_check.py [--site https://client.example] > clients/<slug>/00_ENV_CHECK.md
"""
import argparse, os, shutil, socket, ssl, subprocess, sys, urllib.request
from datetime import datetime, timezone


def ver(cmd):
    try:
        out = subprocess.run(cmd, capture_output=True, text=True, timeout=20)
        return (out.stdout or out.stderr).strip().splitlines()[0][:80]
    except Exception as e:  # noqa: BLE001
        return f"missing ({type(e).__name__})"


def reach(url):
    ctx = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None))
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "mms-env-check/1.0"})
        with urllib.request.urlopen(req, timeout=12, context=ctx) as r:
            return f"OK ({r.status})"
    except urllib.error.HTTPError as e:
        return f"reachable, HTTP {e.code}"
    except Exception as e:  # noqa: BLE001
        return f"blocked/unreachable ({type(e).__name__})"


def chrome():
    cands = [os.environ.get("REMOTION_BROWSER_EXECUTABLE", "")]
    for base in ("/opt/pw-browsers", os.path.expanduser("~/.cache/ms-playwright")):
        if os.path.isdir(base):
            for root, _, files in os.walk(base):
                for f in files:
                    if f in ("chrome-headless-shell", "chrome", "headless_shell"):
                        cands.append(os.path.join(root, f))
    cands += [shutil.which(x) or "" for x in ("chromium", "chromium-browser", "google-chrome")]
    return [c for c in cands if c and os.path.exists(c)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--site", help="client website to test reachability")
    a = ap.parse_args()
    print(f"# Environment check ({datetime.now(timezone.utc):%Y-%m-%d %H:%M} UTC)\n")
    print("| Item | Result |\n|---|---|")
    print(f"| python | {sys.version.split()[0]} |")
    try:
        import numpy  # noqa: F401
        print("| numpy | OK |")
    except ImportError:
        print("| numpy | MISSING (pip install numpy) |")
    for name, cmd in (("node", ["node", "--version"]), ("npm", ["npm", "--version"]), ("ffmpeg", ["ffmpeg", "-version"]), ("ffprobe", ["ffprobe", "-version"]), ("git", ["git", "--version"])):
        print(f"| {name} | {ver(cmd)} |")
    ch = chrome()
    print(f"| chrome/chromium | {ch[0] if ch else 'none found (Remotion will try to download one)'} |")
    du = shutil.disk_usage(".")
    print(f"| disk free here | {du.free / 1e9:.1f} GB (cloud sessions may have a smaller allowance than df shows) |")
    for host in ("https://registry.npmjs.org/", "https://fonts.googleapis.com/", "https://api.elevenlabs.io/", "https://www.googleapis.com/"):
        print(f"| reach {host} | {reach(host)} |")
    if a.site:
        print(f"| reach client site | {reach(a.site)} |")
    for k in ("ELEVENLABS_API_KEY", "GDRIVE_CLIENT_ID", "GDRIVE_CLIENT_SECRET", "GDRIVE_REFRESH_TOKEN", "REMOTION_BROWSER_EXECUTABLE"):
        print(f"| env {k} | {'set' if os.environ.get(k) else 'not set'} |")
    full = all(shutil.which(x) for x in ("node", "npm", "ffmpeg", "ffprobe"))
    print(f"\n**Suggested mode:** {'FULL (can render)' if full else 'PLAN (no renderer: plan + scripts only)'}")
    print("Also list the callable tools yourself (Agent, web search/fetch, Drive connector, ElevenLabs MCP, scheduling).")


if __name__ == "__main__":
    main()
