# Prospect studio (gift videos)

Remotion project for **prospect** spec films (not clients). Uses the shared engine install
(`node_modules` → `hq/shared-engine/node_modules`; run `init_studio.py --setup` in a fresh session first).

- `src/kit.tsx`: generic building blocks (kinetic type with `*accent*` / `^accent2^` / `_dim_` markup, scenes,
  pin, call pill, end card). Every film passes its own `Look`; no brand data is shared between prospects.
- `src/films/<ID>.tsx`: one film per prospect; the header comment lists the facts used and their sources.
- `public/fonts/`: OFL fonts, each with its licence file (Inter, Playfair Display, Shrikhand, Cormorant Garamond,
  DM Serif Display, Fraunces, Abril Fatface, Jost, Unbounded, Fredoka, Cinzel).

## Commands (from this folder)
```bash
npx tsc --noEmit                 # typecheck
node stills.mjs SPEC-LBF         # 8 review stills → ../renders/stills/
./render_all.sh                  # all films, picture only → ../renders/picture/
python3 -I make_audio.py         # original music bed + mux → ../renders/<ID>.mp4 (final)
```
Renders are git-ignored (never commit MP4/WAV). A film takes ~2–3 min to render on 4 CPUs.

## Before sending a film
1. Verification call done (number + WhatsApp confirmed); fix the number in the film if it differs, re-render.
2. Re-read the dossier's compliance notes; nothing on screen that isn't in the dossier's fact table.
3. The owner sends it personally (WhatsApp/email). Update `../PIPELINE.csv`.

## When a prospect becomes a client
`new_client.py <slug> …`, then move that prospect's film into the client's own `studio/` as their first episode
(copy only that film + the kit pieces it uses, set their real brand tokens from files they send).
