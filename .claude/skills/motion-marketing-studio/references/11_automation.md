# Automation, connections and secrets

## 1. Queue-driven runs
`PRODUCTION_QUEUE.csv` is the single source of truth. One automation run = one state transition chain
for ONE video: pick the first `VOICE_READY` item → set `ANIMATION` (commit) → build → render → QC →
package → deliver → `PACKAGE_READY` (commit) → append `RUN_LOG.md`. Nothing ready → log `idle`, stop.
Scripts and voices are produced in batches of 5–7 so runs never starve. Approval items are never
automated: publishing, spending, external accounts.

**Scheduling** (only if a scheduler is available and the user approves): an hourly run with this prompt:
> Studio run for client `<slug>`. Read `clients/<slug>/PRODUCTION_QUEUE.csv`; follow the
> motion-marketing-studio skill (`references/11_automation.md` §1). One video per run. Never publish
> or spend. If nothing is VOICE_READY (and voice generation is not approved for automation), log idle.
Use minute ≠ 0 (e.g. :35) to avoid load spikes. If the run is long (render ~10 min), that is fine; one
run at a time. After a worker restart: check for a finished MP4 (frame count) before re-rendering.

## 2. Voice: ElevenLabs
- **Plan:** commercial use needs a paid plan (Starter or higher) at generation time. Check the current
  price and credits on the official pricing page before paying; record the plan in `ASSET_REGISTER.csv`.
- **Hosted MCP (recommended connector):** `https://api.elevenlabs.io/v1/mcp`, OAuth sign-in with the
  ElevenLabs account (claude.ai: Settings → Connectors → Add custom connector; Claude Code: add an HTTP
  MCP server with that URL). No API key in chat. Disable tools you do not need (phone calls, agents,
  voice cloning) and set credit-spending tools to "ask first". The legacy local server
  (`uvx elevenlabs-mcp`, env `ELEVENLABS_API_KEY`) is archived; use only as a fallback.
- **Direct API (for exact word timing):** `scripts/tts_elevenlabs.py` calls
  `POST /v1/text-to-speech/{voice_id}/with-timestamps`, saves the MP3 and the character alignment, and
  `scripts/words_from_alignment.py` turns it into line ranges + words.json. Needs `ELEVENLABS_API_KEY`
  set as an **environment secret** by the owner (cloud environment settings / local shell profile /
  git-ignored `.env`), never pasted in chat. Test once with `--dry-run`, then one real call.
- **Spending gate:** every TTS call spends credits. Before a batch, show the character count and the
  remaining credits (`check_subscription` via MCP, or the API's subscription endpoint) and get approval
  once per batch. Models: `eleven_v4` (expressive, tags) first; `eleven_multilingual_v2` as fallback with
  all `[tags]` stripped.

## 3. Delivery: Google Drive
- **Connector route:** a Drive connector can create folders/docs; some cannot carry large binaries
  (MP4). Test with one file.
- **API route (reliable for MP4):** the owner creates a Google Cloud project → enables Drive API →
  OAuth consent screen (External; add themselves as a Test user) → OAuth client type "TVs and Limited
  Input devices" → stores `GDRIVE_CLIENT_ID` and `GDRIVE_CLIENT_SECRET` as environment secrets (and allows
  `oauth2.googleapis.com`, `www.googleapis.com` if the network is restricted) → in a new session run
  `python3 -I scripts/drive_auth.py` (shows a short code to enter at google.com/device; writes the refresh
  token to a private file, never to chat) → owner copies it into `GDRIVE_REFRESH_TOKEN` and deletes the
  file → `python3 -I scripts/drive_upload.py --check`.
- **Token lifetime:** while the OAuth app is in "Testing", refresh tokens expire after 7 days. For
  permanent automation the owner publishes the app (needs a homepage + privacy-policy URL on a domain
  they own). Log the expiry date; when uploads fail with `invalid_grant`, set the queue blocker
  `BLOCKED: drive token` and tell the owner.
- Folder convention: one production folder per client; per video `DD-MM-YYYY_<ID>_<slug>`.

## 4. Secrets checklist
Names only in docs and logs: `ELEVENLABS_API_KEY`, `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`,
`GDRIVE_REFRESH_TOKEN`. Never print values, never write them to the repo, never ask for them in chat.
`validate_workspace.py` scans for token-shaped strings before every commit.

## 5. Durable memory
The workspace (git) is the memory. Cloud sessions are ephemeral: commit after each milestone and push.
Never rely on temp folders or chat history for decisions, approvals or state.
