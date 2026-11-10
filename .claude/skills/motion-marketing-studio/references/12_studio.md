# Running a multi-client studio (one repo, many clients)

Use this when one repo serves many clients (the recommended setup for an agency). For a single client,
the plain workspace from Phase 0 is enough.

## Why one repo with folders (not branches, not one repo per client)
- One copy of the skill and agents: improve once, every client benefits.
- One branch (`main`): the dispatcher can see every client's queue and pick the most urgent job.
- Folders make ownership obvious (`clients/<slug>/…`); branches per client drift and invite cross-merges.
- Split a client into its own repo only if a contract requires strict confidentiality, the client must
  receive or co-edit the project files (this also changes the Remotion licence headcount), or a
  freelancer must see that client only.

## Layout
```
<studio repo>/
├── CLAUDE.md                     studio rules (from templates/studio/CLAUDE.md)
├── .claude/skills/motion-marketing-studio/   this skill
├── .claude/agents/mms-*.md       the agent team
├── hq/CLIENTS.csv                roster: slug, name, status, sector, country, timezone, publish_slot, cadence,
│                                 platforms, language, approver, drive_parent, created, notes
├── hq/DISPATCH_LOG.md            one line per automation run (which client, which item, result)
├── hq/shared-engine/             package.json + one node_modules, linked into every client's studio/
└── clients/<slug>/               one client: records + client.json + studio/ (engine copy with its brand)
```
`client.json` holds what automation needs for that client: status (`onboarding` | `active` | `paused` |
`archived`), timezone, publish slot, cadence, platforms, language, approver, publisher, `drive_parent`
(the client's own Drive folder ID), voice settings (`auto_generate_after_batch_approval`), regulated
flag and reviewer. Keep `hq/CLIENTS.csv` and `client.json` in sync (status especially).

## Setup
1. First time (repo root): `python3 -I <skill>/scripts/init_studio.py --name "<Studio Name>"`
   → installs the skill and agents into `.claude/`, writes `CLAUDE.md`, `README.md`, `.gitignore`, `hq/`.
2. Every fresh session: `python3 -I .claude/skills/motion-marketing-studio/scripts/init_studio.py --setup`
   → one `npm install` in `hq/shared-engine/`, then relinks every client's `studio/node_modules`.
3. New client: `python3 -I .claude/skills/motion-marketing-studio/scripts/new_client.py <slug> --name "<Name>"
   --sector <sector> --country <CC> --timezone <Area/City> --language <fr|en>` → workspace + `client.json`
   + roster row + engine link. Then Phase 0 continues inside `clients/<slug>/`.
4. Status flow: `onboarding` (phases 1–4) → `active` (after the strategy and look are approved) → `paused`
   / `archived`. Only `active` clients are picked by the dispatcher.

## The dispatcher (one routine for the whole studio)
`python3 -I .claude/skills/motion-marketing-studio/scripts/dispatch.py` prints the single next job:
- `build`: the most urgent `VOICE_READY` item across all active clients (earliest publish date, then
  roster order). Build it end to end in that client's folder only.
- `voice`: a `COMPLIANCE_OK` item of a client whose `client.json` allows voice generation after batch
  approval (the batch's credit spend was approved). Generate the voice, set `VOICE_READY`.
- `idle`: nothing ready.
`dispatch.py --report` prints every client's queue by state, next publish date and blockers: the
"where are we?" view.

**Scheduled routine prompt (hourly, minute ≠ 0, only with the owner's approval):**
> Studio run. In the studio repo: git pull; run `init_studio.py --setup` if node_modules are missing; run
> `dispatch.py`. If idle, append one line to `hq/DISPATCH_LOG.md`, push, stop. Otherwise do exactly that one
> job for that one client following the motion-marketing-studio skill (references/06–07 and 11), working
> only inside `clients/<slug>/`, delivering to that client's `drive_parent`. Update the client's queue and
> RUN_LOG.md, append `hq/DISPATCH_LOG.md`, run `check_isolation.py`, commit `[<slug>] …`, push. Never publish,
> never spend beyond approved batches, never print secrets.

## Isolation guarantees (check before every push)
`python3 -I .claude/skills/motion-marketing-studio/scripts/check_isolation.py` fails if:
a client's files mention another client (path or name) · two clients share a Drive folder · a client
folder is missing from the roster · any workspace fails validation (CSV width, token-shaped strings).
It warns when a client's `brand.json` name differs from the client name.

## Habits that keep 10+ clients sane
- Start every task by naming the client; one client per task, per commit, per run.
- Commit messages: `[<slug>] …` for client work, `[hq] …` for studio-wide changes.
- Weekly: `dispatch.py --report` → plan voice batches where queues run low (buffer ≥ 5 per active client).
- Each client gets its own Drive folder (shared with that client only); the repo is never shared with clients.
