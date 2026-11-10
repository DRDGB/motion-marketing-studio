# motion-marketing-studio (v1.1, 2026-11-10)

A portable Claude skill that runs a complete motion-design marketing studio for any business:
intake → research (business, brand, audience, market, rules) → strategy + 30/60-day calendar →
brand-token Remotion animation → AI or human voice → mix → QC → ready-to-post packages (Drive) →
weekly growth loop, with a team of specialist agents. One isolated workspace per client.

## Install
- **Claude Code (recommended, can render videos):** copy this folder to `<project>/.claude/skills/motion-marketing-studio/`
  (or `~/.claude/skills/` for all projects). Optional: install the agent team with
  `python3 -I .claude/skills/motion-marketing-studio/scripts/new_client.py <slug> --name "<Client>" --install-agents`
  (agents load in the next session).
- **Claude apps (chat):** upload the zip as a custom skill in your settings (Skills section). In chat-only
  environments without a shell the skill runs in **PLAN mode** (intake, research, strategy, scripts,
  voice prompts, storyboards); rendering happens later in a Claude Code session on the same workspace.

## Agency setup (many clients in one repo, recommended)
In a new private repo: unzip this skill anywhere (or into `.claude/skills/`) and run
`python3 -I motion-marketing-studio/scripts/init_studio.py --name "<Studio Name>"` (installs the skill,
agents, `CLAUDE.md`, `hq/` roster and shared engine). Each client then lives in `clients/<slug>/`, one
hourly dispatcher routine serves all active clients, and `check_isolation.py` keeps them apart.
See `references/12_studio.md`.

## First message to use it
> "New client: <name>, website <url>, Instagram <link>. They want <goal>. Use the motion-marketing-studio skill."

The skill checks the environment, scaffolds `clients/<slug>/`, researches the site before asking you
anything, then asks only what it could not find.

## Requirements for FULL mode
Python 3.10+ with numpy · Node 18+ and npm · ffmpeg/ffprobe · Chrome/Chromium (or Remotion's own
download) · ~1.2 GB for `node_modules` per client workspace (or `--link-node-modules` to share one
install with the same pinned versions).

## Optional connections (set up by the account owner; never paste keys in chat)
- **ElevenLabs** (voice): paid plan for commercial use. Hosted MCP connector
  `https://api.elevenlabs.io/v1/mcp` (OAuth), and/or env secret `ELEVENLABS_API_KEY` for
  `scripts/tts_elevenlabs.py` (gives exact word timing).
- **Google Drive** (delivery): env secrets `GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`,
  `GDRIVE_REFRESH_TOKEN` (`scripts/drive_auth.py` creates the token), or a Drive connector.
- **Scheduler** (automation): an hourly routine running one queue item per run.
Details: `references/11_automation.md`.

## Contents
`SKILL.md` (start here) · `references/` (phase playbooks, compliance, lessons, sources snapshot) ·
`agents/` (11 `mms-*` subagent definitions) · `scripts/` (env check, scaffolding, brand extraction,
voice/timing, music, mix, QC, packaging, Drive) · `templates/` (workspace + episode) · `engine/`
(Remotion 4.0.541 brand-token engine with a DEMO composition and a rough-cut episode template).

## Licences and notices
- Skill text, scripts and engine code: provided to the skill's owner for their studio work.
- Bundled fonts: Inter, SIL Open Font License 1.1 (`engine/public/fonts/OFL.txt`).
- Remotion is **not** bundled (installed via npm). Its free licence covers individuals, non-profits and
  companies of up to 3 people (count freelancers and any co-operating client team); larger teams need a
  Remotion Company License. See `references/10_compliance.md`.
- Music and SFX are synthesized by the scripts (own work). Voices, logos, fonts and footage from clients
  or providers must be licensed and logged per workspace.

## Changelog
- 1.1 (2026-11-10): multi-client studio layer (`init_studio.py`, `hq/CLIENTS.csv`, per-client `client.json`,
  `dispatch.py` one-job-per-run dispatcher + `--report`, `check_isolation.py`, shared engine install,
  `references/12_studio.md`); sector checklists for finance, food, beauty, real estate, education, jobs,
  alcohol/gambling, kids, NGOs, legal, tech; business-neutral demo and examples; Drive folder read from
  `client.json`.
- 1.0 (2026-11-10): first portable release, generalised from a working Shorts studio (six finished
  Shorts produced with this pipeline).
