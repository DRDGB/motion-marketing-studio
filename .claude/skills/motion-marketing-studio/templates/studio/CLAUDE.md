# {{STUDIO_NAME}}: operating rules (multi-client motion studio)

This repo is a client studio run with the `motion-marketing-studio` skill
(`.claude/skills/motion-marketing-studio/SKILL.md`). Read it before any client work, and
`references/12_studio.md` for how the studio is organised.

## Layout
- `hq/CLIENTS.csv`: the roster (one row per client). `hq/DISPATCH_LOG.md`: what each automation run did.
- `hq/shared-engine/`: one shared install of the Remotion engine dependencies (linked into every client).
- `clients/<slug>/`: everything for ONE client (brief, research, brand tokens, strategy, calendar, queue,
  episodes, deliverables, analytics, run log, `client.json` with its delivery settings).

## Non-negotiables
1. One client = one folder. Never copy or reference another client's brand, assets, research, scripts or
   data. Work on one client at a time; say which client at the start of each task.
2. Commit messages start with the client slug: `[<slug>] <what changed>`. Studio-wide changes: `[hq]`.
3. Run `python3 -I .claude/skills/motion-marketing-studio/scripts/check_isolation.py` before every push.
4. Approval gates: never publish, post, schedule publicly, spend, subscribe or change external accounts
   without the account owner's explicit approval. Clients receive packages; humans publish.
5. Secrets live only in environment settings (names in docs, never values). Never commit MP4/WAV.
6. Fresh session: `python3 -I .claude/skills/motion-marketing-studio/scripts/init_studio.py --setup`
   (installs the shared engine and relinks clients), then
   `python3 -I .claude/skills/motion-marketing-studio/scripts/dispatch.py --report` to see the studio state.

## Default next action
If asked "what next?", run `dispatch.py --report`, pick the most urgent item across clients, and advance
it one state for that client only.
