#!/usr/bin/env python3
"""Voice desk: paste-ready voice cards out, uploaded voice files in, with no mix-ups.

Each voice take has a VOICE CODE  <content_id>-<LANG>-v<n>   (e.g. AKV-003-EN-v1)
and a TEXT HASH = first 8 hex of sha256(script text without tags/pipes, whitespace collapsed).
The expected file name is  <voice code>-<text hash>.mp3  (e.g. AKV-003-EN-v1-3fa2c9d1.mp3).

On ingest every file gets an AUDIO HASH (sha256 of the bytes) and is identified by
  1. the voice code in its file name, or
  2. speech-to-text (faster-whisper, if installed) matched against every open request,
and, when speech-to-text is available, VERIFIED: the transcript must match the requested text.
A file whose audio hash is already in the manifest is a duplicate and is skipped. A request whose
script text changed after the voice was made is reported as STALE.

Usage (from the studio repo root):
  python3 -I hq/tools/voice_desk.py card   <slug> <content_id>... [--lang en|fr] [--version 1]
  python3 -I hq/tools/voice_desk.py ingest <slug> <audio files>... [--plan "Starter"] [--commercial yes|no]
  python3 -I hq/tools/voice_desk.py status <slug>
Script text is read from the first fenced block under the heading "## Voice" (EN) or "## Voice FR"
in clients/<slug>/episodes/<content_id>*/SCRIPT_AND_VOICE.md.
Records: clients/<slug>/VOICE_REQUESTS.csv, clients/<slug>/VOICE_MANIFEST.csv,
cards: clients/<slug>/voice_cards/VOICE_CARDS_<date>.md, audio: episodes/<dir>/source/VO_<ID>_<LANG>_FULL.<ext>
"""
import argparse, csv, difflib, hashlib, json, re, shutil, subprocess, sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path.cwd()
REQ_COLS = ["voice_code", "content_id", "lang", "version", "text_sha8", "chars", "expected_file", "requested_at", "status"]
MAN_COLS = ["voice_code", "content_id", "lang", "version", "text_sha8", "audio_sha256", "duration_s", "original_name",
            "stored_path", "match_method", "transcript_similarity", "plan", "commercial_licence", "received_at", "status"]
CODE_RE = re.compile(r"([A-Z]{2,5}-\d{3})-(EN|FR|PT|AR)-v(\d+)(?:-([0-9a-f]{8}))?", re.I)
NOW = lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")


def ws(slug):
    w = ROOT / "clients" / slug
    if not w.is_dir():
        sys.exit(f"no client workspace {w}")
    return w


def read_csv(p, cols):
    if not p.exists():
        return []
    return list(csv.DictReader(p.open(newline="", encoding="utf-8")))


def write_csv(p, cols, rows):
    with p.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, cols, quoting=csv.QUOTE_MINIMAL)
        w.writeheader()
        w.writerows(rows)


def episode_dir(w, cid):
    hits = sorted({p for pat in (cid, cid.replace("-", "_")) for p in (w / "episodes").glob(f"{pat}*") if p.is_dir()})
    if not hits:
        sys.exit(f"no episode folder episodes/{cid}* in {w}")
    return hits[0]


def paste_block(ep, lang):
    md = (ep / "SCRIPT_AND_VOICE.md").read_text(encoding="utf-8")
    head = r"^##\s+Voice\s*$" if lang == "en" else rf"^##\s+Voice\s+{lang.upper()}\b.*$"
    m = re.search(head, md, re.M)
    if not m and lang != "en":  # a single-language episode (e.g. French-first client) keeps its block under "## Voice"
        m = re.search(r"^##\s+Voice\s*$", md, re.M)
    if not m:
        sys.exit(f"{ep.name}: no '## Voice{'' if lang == 'en' else ' ' + lang.upper()}' section")
    b = re.search(r"```[^\n]*\n(.*?)```", md[m.end():], re.S)
    if not b or not b.group(1).strip():
        sys.exit(f"{ep.name}: empty voice block")
    return b.group(1).strip()


def spoken(block):
    t = re.sub(r"\[[^\]]*\]", " ", block)          # audio tags
    t = t.replace("|", " ")
    return re.sub(r"\s+", " ", t).strip()


def sha8(text):
    return hashlib.sha256(spoken(text).encode("utf-8")).hexdigest()[:8]


def words(t):
    t = t.lower().replace("’", "'")
    return re.findall(r"[a-zà-ÿ0-9']+", t)


def similarity(a, b):
    return round(difflib.SequenceMatcher(None, words(a), words(b)).ratio(), 3)


def duration(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(p)], capture_output=True, text=True)
    try:
        return round(float(json.loads(r.stdout)["format"]["duration"]), 2)
    except Exception:
        return ""


_model = None


def transcribe(p, lang=None):
    global _model
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        return None
    if _model is None:
        _model = WhisperModel("base", device="cpu", compute_type="int8")
    import numpy as np  # decode with ffmpeg (avoids PyAV version issues), 16 kHz mono float32
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    segs, _ = _model.transcribe(audio, language=lang, beam_size=1, vad_filter=True)
    return " ".join(s.text for s in segs)


def cmd_card(a):
    w = ws(a.slug)
    reqs = read_csv(w / "VOICE_REQUESTS.csv", REQ_COLS)
    lines = [f"# Voice cards: {w.name} · {NOW()}",
             "",
             "For each card: paste the block into ElevenLabs as ONE generation, use the settings shown, download the MP3",
             "and **rename it to the file name given** before uploading. Generate on a plan with a commercial licence for",
             "anything the client will publish.", ""]
    for cid in a.ids:
        ep = episode_dir(w, cid)
        block = paste_block(ep, a.lang)
        h = sha8(block)
        code = f"{cid}-{a.lang.upper()}-v{a.version}"
        fname = f"{code}-{h}.mp3"
        old = next((r for r in reqs if r["voice_code"] == code), None)
        if old and old["text_sha8"] != h:
            sys.exit(f"{code} already requested with different text ({old['text_sha8']}); use --version {a.version + 1}")
        if not old:
            reqs.append({"voice_code": code, "content_id": cid, "lang": a.lang.upper(), "version": a.version, "text_sha8": h,
                         "chars": len(block), "expected_file": fname, "requested_at": NOW(), "status": "REQUESTED"})
        title = re.search(r'^#\s*[^:]+:\s*"?(.*?)"?\s*$', (ep / "SCRIPT_AND_VOICE.md").read_text(encoding="utf-8"), re.M)
        lines += [f"## {code} · {title.group(1) if title else ep.name}",
                  f"**Save as:** `{fname}` · {len(block)} characters · voice + settings: see the top of this file",
                  "```", block, "```", ""]
    write_csv(w / "VOICE_REQUESTS.csv", REQ_COLS, reqs)
    out = w / "voice_cards" / f"VOICE_CARDS_{datetime.now(timezone.utc).strftime('%Y-%m-%d_%H%M')}.md"
    out.parent.mkdir(exist_ok=True)
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(out)


def cmd_ingest(a):
    w = ws(a.slug)
    reqs = read_csv(w / "VOICE_REQUESTS.csv", REQ_COLS)
    man = read_csv(w / "VOICE_MANIFEST.csv", MAN_COLS)
    seen = {r["audio_sha256"] for r in man}
    for f in map(Path, a.files):
        digest = hashlib.sha256(f.read_bytes()).hexdigest()
        if digest in seen:
            print(f"DUPLICATE  {f.name}: same audio already stored"); continue
        req, method, sim, text = None, "", "", None
        m = CODE_RE.search(f.name)
        if m:
            code = f"{m.group(1).upper()}-{m.group(2).upper()}-v{m.group(3)}"
            req = next((r for r in reqs if r["voice_code"] == code), None)
            method = "filename"
        tr = transcribe(f, None)
        if tr is not None:
            if req is None:  # identify by content
                best = []
                for r in (x for x in reqs if x["status"] in ("REQUESTED", "STALE")):
                    t = spoken(paste_block(episode_dir(w, r["content_id"]), r["lang"].lower()))
                    best.append((similarity(tr, t), r))
                best.sort(key=lambda x: -x[0])
                if best and best[0][0] >= 0.6:
                    req, method = best[0][1], "transcript"
            if req is not None:
                text = spoken(paste_block(episode_dir(w, req["content_id"]), req["lang"].lower()))
                sim = similarity(tr, text)
        if req is None:
            print(f"UNMATCHED  {f.name}: rename it to its voice code (e.g. AKV-003-EN-v1-xxxxxxxx.mp3) and ingest again"); continue
        ep = episode_dir(w, req["content_id"])
        current = sha8(paste_block(ep, req["lang"].lower()))
        status = "VOICE_READY"
        if current != req["text_sha8"]:
            status = "STALE (script changed after request)"
        if sim != "" and sim < 0.85:
            status = f"CHECK (transcript similarity {sim})"
        if a.commercial != "yes":
            status += " · NOT FOR PUBLICATION (no commercial licence)"
        dst = ep / "source" / f"VO_{req['content_id']}_{req['lang']}_FULL{f.suffix.lower()}"
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists():
            dst = dst.with_name(f"{dst.stem}_v{req['version']}_{digest[:8]}{dst.suffix}")
        shutil.copy2(f, dst)
        man.append({"voice_code": req["voice_code"], "content_id": req["content_id"], "lang": req["lang"], "version": req["version"],
                    "text_sha8": req["text_sha8"], "audio_sha256": digest, "duration_s": duration(dst), "original_name": f.name,
                    "stored_path": str(dst.relative_to(w)), "match_method": method, "transcript_similarity": sim,
                    "plan": a.plan, "commercial_licence": a.commercial, "received_at": NOW(), "status": status})
        req["status"] = "RECEIVED" if status.startswith("VOICE_READY") else status.split(" ")[0]
        seen.add(digest)
        print(f"{status.split(' ')[0]:<11} {f.name} -> {req['voice_code']} ({method}{', sim ' + str(sim) if sim != '' else ''}) -> {dst.relative_to(w)}")
    write_csv(w / "VOICE_MANIFEST.csv", MAN_COLS, man)
    write_csv(w / "VOICE_REQUESTS.csv", REQ_COLS, reqs)


def cmd_status(a):
    w = ws(a.slug)
    reqs = read_csv(w / "VOICE_REQUESTS.csv", REQ_COLS)
    man = read_csv(w / "VOICE_MANIFEST.csv", MAN_COLS)
    print(f"| Voice code | Expected file | Request | Received | Now |\n|---|---|---|---|---|")
    for r in reqs:
        got = [m for m in man if m["voice_code"] == r["voice_code"]]
        try:
            cur = sha8(paste_block(episode_dir(w, r["content_id"]), r["lang"].lower()))
            now = "text unchanged" if cur == r["text_sha8"] else "SCRIPT CHANGED: new version needed"
        except SystemExit as e:
            now = str(e)
        print(f"| {r['voice_code']} | {r['expected_file']} | {r['status']} | {got[-1]['status'] if got else '-'} | {now} |")


def main():
    ap = argparse.ArgumentParser()
    sp = ap.add_subparsers(dest="cmd", required=True)
    c = sp.add_parser("card"); c.add_argument("slug"); c.add_argument("ids", nargs="+"); c.add_argument("--lang", default="en"); c.add_argument("--version", type=int, default=1)
    i = sp.add_parser("ingest"); i.add_argument("slug"); i.add_argument("files", nargs="+"); i.add_argument("--plan", default=""); i.add_argument("--commercial", choices=["yes", "no"], default="no")
    s = sp.add_parser("status"); s.add_argument("slug")
    a = ap.parse_args()
    {"card": cmd_card, "ingest": cmd_ingest, "status": cmd_status}[a.cmd](a)


if __name__ == "__main__":
    main()
