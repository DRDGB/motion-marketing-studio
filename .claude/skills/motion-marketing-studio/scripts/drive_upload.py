#!/usr/bin/env python3
"""Upload files to Google Drive with the studio's own OAuth client (scope: drive.file).

Setup: references/11_automation.md (Drive section). Needs env secrets GDRIVE_CLIENT_ID,
GDRIVE_CLIENT_SECRET and GDRIVE_REFRESH_TOKEN. Never prints secrets or tokens.

Usage:
  python3 -I drive_upload.py --parent <FOLDER_ID> [--subfolder NAME] FILE [FILE ...]
  python3 -I drive_upload.py --check          # verify the token works, print nothing secret

Notes:
  * drive.file only lets the app see files/folders it created or that were opened
    with it. If --parent is a folder created elsewhere, Drive may answer 404.
  * Uploads are resumable (8 MiB chunks), so large MP4s are fine.
"""
import argparse, json, mimetypes, os, ssl, sys, urllib.error, urllib.parse, urllib.request

CA = os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None)
CTX = ssl.create_default_context(cafile=CA) if CA else ssl.create_default_context()
API = "https://www.googleapis.com/drive/v3"
UPLOAD = "https://www.googleapis.com/upload/drive/v3/files"
CHUNK = 8 * 1024 * 1024
FOLDER = "application/vnd.google-apps.folder"


def req(url, data=None, headers=None, method=None):
    r = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(r, context=CTX) as resp:
            body = resp.read()
            return resp.status, dict(resp.headers), (json.loads(body) if body else {})
    except urllib.error.HTTPError as e:
        if e.code == 308:  # resumable "incomplete"
            return 308, dict(e.headers), {}
        raise SystemExit(f"Drive API error {e.code} on {url.split('?')[0]}: {e.read().decode(errors='replace')[:500]}")


def access_token(refresh_token=None):
    env = os.environ
    missing = [k for k in ("GDRIVE_CLIENT_ID", "GDRIVE_CLIENT_SECRET") if not env.get(k)]
    rt = refresh_token or env.get("GDRIVE_REFRESH_TOKEN")
    if not rt:
        missing.append("GDRIVE_REFRESH_TOKEN")
    if missing:
        raise SystemExit("Missing env secrets: " + ", ".join(missing))
    body = urllib.parse.urlencode({"client_id": env["GDRIVE_CLIENT_ID"], "client_secret": env["GDRIVE_CLIENT_SECRET"],
                                   "refresh_token": rt, "grant_type": "refresh_token"}).encode()
    return req("https://oauth2.googleapis.com/token", data=body)[2]["access_token"]


def find_or_create_folder(tok, name, parent):
    q = f"name = '{name.replace(chr(39), chr(92) + chr(39))}' and mimeType = '{FOLDER}' and '{parent}' in parents and trashed = false"
    _, _, r = req(f"{API}/files?" + urllib.parse.urlencode({"q": q, "fields": "files(id,name)"}),
                  headers={"Authorization": f"Bearer {tok}"})
    if r.get("files"):
        return r["files"][0]["id"]
    meta = json.dumps({"name": name, "mimeType": FOLDER, "parents": [parent]}).encode()
    return req(f"{API}/files?fields=id", data=meta, method="POST",
               headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})[2]["id"]


def upload(tok, path, parent=None, name=None, mime=None, as_google_type=None):
    """Resumable upload. as_google_type converts (e.g. text/plain -> Google Doc)."""
    size = os.path.getsize(path)
    mime = mime or mimetypes.guess_type(path)[0] or "application/octet-stream"
    meta = {"name": name or os.path.basename(path)}
    if parent:
        meta["parents"] = [parent]
    if as_google_type:
        meta["mimeType"] = as_google_type
    _, h, _ = req(f"{UPLOAD}?uploadType=resumable&fields=id,name,webViewLink,size,md5Checksum",
                  data=json.dumps(meta).encode(), method="POST",
                  headers={"Authorization": f"Bearer {tok}", "Content-Type": "application/json; charset=UTF-8",
                           "X-Upload-Content-Type": mime, "X-Upload-Content-Length": str(size)})
    session = h.get("Location") or h.get("location")
    with open(path, "rb") as f:
        off = 0
        while True:
            chunk = f.read(CHUNK)
            end = off + len(chunk) - 1
            hdr = {"Content-Length": str(len(chunk))}
            if size:
                hdr["Content-Range"] = f"bytes {off}-{end}/{size}"
            st, _, r = req(session, data=chunk, method="PUT", headers=hdr)
            if st in (200, 201):
                return r
            off += len(chunk)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parent", help="Drive folder ID to upload into")
    ap.add_argument("--subfolder", help="create/reuse this subfolder under --parent")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("files", nargs="*")
    a = ap.parse_args()
    tok = access_token()
    if a.check:
        _, _, r = req(f"{API}/about?fields=user(emailAddress)", headers={"Authorization": f"Bearer {tok}"})
        print("Drive token OK for", r["user"]["emailAddress"])
        return
    if not a.files:
        ap.error("no files given")
    parent = a.parent
    if a.subfolder:
        parent = find_or_create_folder(tok, a.subfolder, parent or "root")
    for p in a.files:
        r = upload(tok, p, parent)
        print(json.dumps({"file": p, "id": r.get("id"), "size": r.get("size"), "md5": r.get("md5Checksum"),
                          "link": r.get("webViewLink")}))


if __name__ == "__main__":
    sys.exit(main())
