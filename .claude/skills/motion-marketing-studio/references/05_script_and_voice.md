# Phase 5a: Script and voice

Each video lives in `clients/<slug>/episodes/<ID>/` (ID like `E001_<SHORT_SLUG>`). Template:
`templates/episode/SCRIPT_AND_VOICE.md`.

## 1. Script (two columns: what we hear + what we see)
- 10–13 spoken lines for 35–50 s. One idea per line, 6–18 words. Read it aloud.
- Every line has: spoken text · one subject on screen · motion · claim IDs (if factual).
- Numbers spoken the way people say them ("a hundred and four", not "104"), so the voice reads them right.
- Never describe what the picture already shows; add what it cannot.
- Fact lines carry claim IDs from `RESEARCH_LEDGER.csv`; interpretation lines are marked as such.
- End: payoff line → short CTA line → (optional) teaser for the next video in the series.
- Run the hook QA (`04_creative_system.md` §3) and the compliance checklist (`10_compliance.md`)
  before any voice is generated. Record both results in the script file.

## 2. Voice options (choose per client in the brief)
**A. ElevenLabs via MCP (automatic).** If an ElevenLabs MCP server is connected (tools for
text-to-speech / listing voices), generate the voice yourself after the script passes compliance:
1. List voices once; pick one with the client (record name + voice ID in the brief). Keep it stable.
2. Generate the **whole script as one take** (consistent tone), file `VO_<ID>_FULL.mp3`, saved into
   `episodes/<ID>/source/`. Check credit cost before generating; MCP TTS spends account credits.
3. If the API offers timestamps/alignment, save it as `episodes/<ID>/source/alignment.json` and use
   it for word timing (more exact than pause detection).
4. Log provider, plan, model, voice, date and terms URL in `ASSET_REGISTER.csv`. Commercial use requires
   a paid plan; never ship free-tier audio for a client.
**B. ElevenLabs via direct API** (`scripts/tts_elevenlabs.py`, needs `ELEVENLABS_API_KEY` in the
environment; never in chat). Same rules as A.
**C. Human or UI generation.** Give the user the paste-ready block below; they upload the MP3.
**D. Captions only** (no voice): timing comes from a reading-speed model (~2.6 words/s).

## 3. Paste-ready block (proven format for ElevenLabs UI)
```
[matter-of-fact] First line of the script. |
[curious] Second line… with a beat. |
Third line, no tag. |
...
```
- One generation for the whole video; ` |` ends each line; tags in square brackets at line start,
  about half the lines (tags that are read aloud or ignored → remove them, use punctuation).
- Ellipses `…` create the small pauses that later split the read into lines.
- Settings that worked: Stability ~50, Similarity ~75, style low. Verify the current model name.
- Budget: 40–45 s ≈ 650–750 characters.
- Persona (default, adapt to brand): calm, warm, precise; never shouts; slightly slower on numbers.

## 4. Languages
For French/other languages: write natively (not translated word-for-word), keep lines short, check
numbers and units are spoken naturally, and verify the voice pronounces brand and product names
(add phonetic spelling in the paste block if needed, e.g. "Doli-prane").

## 5. Hand-off states
`SCRIPT_DRAFT → COMPLIANCE_OK → VOICE_REQUESTED → VOICE_READY → ANIMATION → RENDERED → QC_PASS →
PACKAGE_READY → APPROVED → PUBLISHED_BY_CLIENT`. Update `PRODUCTION_QUEUE.csv` at every change.
