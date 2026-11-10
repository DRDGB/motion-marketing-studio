#!/usr/bin/env python3
"""Generate one voice take with ElevenLabs text-to-speech *with timestamps* (character alignment).
Needs env ELEVENLABS_API_KEY (set by the account owner as an environment secret; never in chat).
Spends credits: run --dry-run first and get approval for the batch.

Input: a text file with one spoken line per line (no tags for multilingual_v2; [tags] ok for v3/v4).
Lines are joined with newlines so the model pauses between them.

Usage:
  python3 -I tts_elevenlabs.py --voice <voice_id> --text lines.txt --out episodes/<ID>/source/VO_<ID>_FULL.mp3 \
      [--model eleven_v4] [--stability 0.5] [--similarity 0.75] [--style 0.0] [--dry-run]
Writes <out>.mp3 and <out>.alignment.json ({"alignment": {...}, "normalized_alignment": {...}, "text": ...}).
Endpoint per ElevenLabs API reference (POST /v1/text-to-speech/{voice_id}/with-timestamps); verify the
current docs if a call fails.
"""
import argparse, base64, json, os, re, ssl, sys, urllib.error, urllib.request
from pathlib import Path

CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--text", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--stability", type=float, default=0.5)
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--style", type=float, default=0.0)
    ap.add_argument("--format", default="mp3_44100_128")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    lines = [l.strip().rstrip("|").strip() for l in Path(a.text).read_text(encoding="utf-8").splitlines() if l.strip()]
    if a.model.startswith("eleven_multilingual") or a.model.startswith("eleven_flash"):
        lines = [re.sub(r"\[[^\]]*\]\s*", "", l) for l in lines]  # tags are read aloud on v2 models
    text = "\n".join(lines)
    print(f"model={a.model} voice={a.voice} lines={len(lines)} characters={len(text)} (≈ credits for most models)")
    if a.dry_run:
        print(text); return
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("ELEVENLABS_API_KEY is not set. Ask the account owner to add it as an environment secret (never paste it in chat).")
    body = {"text": text, "model_id": a.model,
            "voice_settings": {"stability": a.stability, "similarity_boost": a.similarity, "style": a.style}}
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}/with-timestamps?output_format={a.format}"
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST",
                                 headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300, context=CTX) as r:
            res = json.loads(r.read())
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs API error {e.code}: {e.read()[:400].decode('utf-8', 'replace')}")
    out = Path(a.out); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(base64.b64decode(res["audio_base64"]))
    al = {"text": text, "lines": lines, "model": a.model, "voice": a.voice,
          "alignment": res.get("alignment"), "normalized_alignment": res.get("normalized_alignment")}
    Path(str(out) + ".alignment.json").write_text(json.dumps(al, ensure_ascii=False))
    print(f"wrote {out} and {out}.alignment.json")


if __name__ == "__main__":
    main()
