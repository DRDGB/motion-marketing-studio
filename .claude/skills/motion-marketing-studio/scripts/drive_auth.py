#!/usr/bin/env python3
"""One-time Google Drive authorisation (OAuth device flow, scope drive.file) for drive_upload.py.
Needs env GDRIVE_CLIENT_ID and GDRIVE_CLIENT_SECRET (an OAuth client of type "TVs and Limited Input devices").
Prints only the short user code and the verification URL (not secret). The refresh token is written to a
private file (mode 600, outside any repo) for the owner to copy into the env secret GDRIVE_REFRESH_TOKEN,
then delete. It is never printed.
Usage: python3 -I drive_auth.py [--out ~/.config/mms/gdrive_refresh_token]
"""
import argparse, json, os, ssl, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None))


def post(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return json.loads(e.read() or b"{}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="~/.config/mms/gdrive_refresh_token")
    a = ap.parse_args()
    cid, sec = os.environ.get("GDRIVE_CLIENT_ID"), os.environ.get("GDRIVE_CLIENT_SECRET")
    if not cid or not sec:
        sys.exit("Set GDRIVE_CLIENT_ID and GDRIVE_CLIENT_SECRET as environment secrets first (never paste them in chat).")
    d = post("https://oauth2.googleapis.com/device/code", {"client_id": cid, "scope": "https://www.googleapis.com/auth/drive.file"})
    if "device_code" not in d:
        sys.exit(f"device code request failed: {d.get('error')} {d.get('error_description', '')}")
    print(f"Open {d.get('verification_url', 'https://www.google.com/device')} and enter the code: {d['user_code']}", flush=True)
    interval, deadline = int(d.get("interval", 5)), time.time() + int(d.get("expires_in", 900))
    while time.time() < deadline:
        time.sleep(interval)
        t = post("https://oauth2.googleapis.com/token", {"client_id": cid, "client_secret": sec, "device_code": d["device_code"],
                                                          "grant_type": "urn:ietf:params:oauth:grant-type:device_code"})
        if "refresh_token" in t:
            p = Path(os.path.expanduser(a.out)); p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(t["refresh_token"]); os.chmod(p, 0o600)
            print(f"Authorised. Refresh token saved to {p} (mode 600). Copy its contents into the environment secret "
                  "GDRIVE_REFRESH_TOKEN, start a new session, run drive_upload.py --check, then delete the file.")
            return
        if t.get("error") == "slow_down":
            interval += 5
        elif t.get("error") not in ("authorization_pending",):
            sys.exit(f"authorisation failed: {t.get('error')} {t.get('error_description', '')}")
    sys.exit("timed out waiting for approval; run again")


if __name__ == "__main__":
    main()
