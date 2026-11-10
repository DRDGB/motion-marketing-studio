# Phase 5b: Production pipeline (FULL mode)

All commands run from the client workspace root `clients/<slug>/` (call it `WS`). `SKILL_DIR` is the
skill folder. Use `python3 -I` for every script. One video at a time, end to end.

## IDs
`<ID>` = files and code names (`E001_STORAGE_HEAT`); `<COMP>` = the Remotion composition id, the same with
`-` instead of `_` (`E001-STORAGE-HEAT`). Remotion rejects underscores in composition ids.

## Layout
```
WS/episodes/<ID>/SCRIPT_AND_VOICE.md        script, claims, compliance, voice block
WS/episodes/<ID>/source/VO_<ID>_FULL.mp3     the voice (one take)
WS/studio/src/episodes/<ID>/timeline.json    clip map + music + sfx (the composition imports it)
WS/studio/src/episodes/<ID>/words.json       word onsets (generated)
WS/studio/src/episodes/<ID>/<ID>.tsx         the composition (scenes)
WS/studio/public/episodes/<ID>/mix.wav       final soundtrack (generated, gitignored)
WS/renders/<ID>/<ID>_v1.mp4                  render (gitignored)
WS/deliverables/<ID>/                        package: POST.md, SRT, cover, QC report, frames, DELIVERED.md
```

## Step 1: map the voice to the lines
- With a TTS alignment file: `python3 -I $SKILL_DIR/scripts/words_from_alignment.py <alignment.json>
  <script lines file>` prints per-line start/end times. Use them as `src` ranges.
- Without one: `python3 -I $SKILL_DIR/scripts/syllable_peaks.py episodes/<ID>/source/VO_<ID>_FULL.mp3`
  (try `--min-pause 0.12 --noise -36` for finer splits). It prints speech segments with syllable-peak
  counts. Group consecutive segments into lines so each group's peaks ≈ the line's syllables and its
  duration ≈ syllables / speech rate (fit the rate over the whole take). Line-end pauses are usually
  0.4–0.6 s; ellipses may or may not leave a gap. When a boundary is ambiguous, check voiced-vowel runs
  (one per syllable) before deciding. Short blips (< 0.3 s, weakly voiced) are breaths: drop them.
- Write the map and how you decided into `timeline.json` → `"note"`.

## Step 2: timeline.json
```json
{"id": "E001_SLUG", "fps": 30, "total": 46.2,
 "voSource": "episodes/E001_SLUG/source/VO_E001_SLUG_FULL.mp3",
 "clips": [{"id": "L01", "src": [0.0, 2.63], "at": 0.20, "text": "Exact words as spoken."}],
 "music": {"bpm": 96, "transpose": 0, "mech": [9.3, 20.5], "drop": [20.5, 21.1], "resolve": [21.1, 35.2], "loop": [35.2, 42.2], "end": 42.2},
 "sfx": [{"type": "whoosh", "at": 11.2, "gain": -22}]}
```
- `src` = where the line is in the voice file; `at` = where it plays in the video. Tighten long gaps,
  leave ~0.8–1.0 s for a reveal transition, ~3.5–4 s at the end for the end card.
- `text` must be exactly what is spoken (captions are generated from it).
- `music.drop[1]` = the Switch line's start → it lands on a downbeat.
- SFX types: hit, whoosh, beep, rustle, lens (reveal), tick, unlock (switch), clack, chime (end).
  Place them on word onsets after step 3.

## Step 3: words, music, mix
```bash
python3 -I $SKILL_DIR/scripts/align_words.py studio/src/episodes/<ID>/timeline.json studio/src/episodes/<ID>/words.json
python3 -I $SKILL_DIR/scripts/music_bed.py studio/src/episodes/<ID>/timeline.json studio/public/episodes/<ID>/music.wav
python3 -I $SKILL_DIR/scripts/build_mix.py studio/src/episodes/<ID>/timeline.json studio/public/episodes/<ID>/music.wav studio/public/episodes/<ID>/mix.wav
```
- `align_words` spreads words by syllables inside each clip and snaps to pauses. Check its printout;
  when a line has internal pauses, pin those words to the measured sub-segment starts (edit words.json).
- Target: integrated −16 LUFS (±1), true peak ≤ −1 dBTP. The mix script reports both.
- The music bed is original (composed in code, no third-party audio). Vary `bpm`/`transpose` per client.

## Step 4: composition
```bash
python3 -I $SKILL_DIR/scripts/new_episode.py <ID>     # scaffolds <ID>.tsx from the template and registers it
```
Build scenes with the engine (`studio/src/lib/`): `Kinetic` (word-synced type), `Backdrop`
(brand texture), `SceneCam` (slow push), `Reveal` (circle reveal in the accent colour, surface ↔ dark
world), `EndCard` (logo, tagline, CTA), `icons.tsx` (themed pictograms: Phone, Card, Coin, Person,
Building (bank/shop/office/pharmacy), Box, Clock, Chat, Check, Cross, Cart, Bar, Arrow, Badge, plus
sector extras Pill, Bottle, PlusCross). Draw new pictograms in SVG
when a line needs one; keep them literal and simple; reuse tokens from `theme.ts` only.

## Step 5: review stills + Focus Test
```bash
cd studio && for t in 1.5 5 9 14 20 26 32 38 44; do npx remotion still src/index.ts <COMP> ../renders/<ID>/s_$t.png --frame=$(python3 -c "print(round($t*30))") --scale=0.4 --log=error & done; wait
python3 -I $SKILL_DIR/scripts/contact_sheet.py ../renders/<ID> ../renders/<ID>/sheet.png
```
Run at most ~6 stills in parallel (each spawns a browser; more can run out of memory). Look at the
sheet. Apply the Focus Test to every frame: overlaps, text collisions, empty zones, illegible labels,
anything that reads as something else. Fix, re-render the changed frames, look again.

## Step 6: render + QC
```bash
cd studio && npx remotion render src/index.ts <COMP> ../renders/<ID>/<ID>_v1.mp4 --codec=h264 --crf=17 --audio-codec=aac --audio-bitrate=256k --log=error
bash $SKILL_DIR/scripts/qc.sh renders/<ID>/<ID>_v1.mp4 > deliverables/<ID>/QC_REPORT.txt
```
Run the render in the background if your tools allow (a 45 s video can take 5–15 min). QC must show:
full decode, 1080×1920, yuv420p, BT.709, expected frame count (= total × fps), −16 ±1 LUFS, no
unexpected black/freeze/silence. Extract 10–14 frames to `deliverables/<ID>/frames/` and look at them.

## Step 7: package → `07_delivery.md`.

## Commit discipline
Commit source (tsx, json, md, csv) after each milestone so a restart loses nothing. Never commit MP4,
WAV mixes, or secrets (the workspace `.gitignore` covers renders and audio).
