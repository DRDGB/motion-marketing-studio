# Phase 4: Creative system (brand → motion)

Output: `04_BRAND_MOTION_SYSTEM.md`, `studio/src/brand/brand.json`, three direction stills + three
short motion tests (3–5 s each) in `04_DIRECTIONS/`. The user picks one; log it in `DECISIONS.md`.

## 1. Translate the brand into tokens (`brand.json`)
Fill from Phase 2 (`BRAND_EXTRACT.json` + verified screenshots + client files):
- colours: `bg, surface, ink, dim, accent, accentDeep, dark, darkSurface, light, support[]`
  (ONE accent; it always marks the subject of the frame).
- fonts: display + text families with local font files and weights; licence noted.
- logo: file in `studio/public/brand/`; `tagline`; `cta` (end-card button text); `handle`.
- texture: `paper` (warm grain), `clean` (flat gradient), or `grid` (blueprint lines).
- motion: `energy` (`calm` | `lively`), `radius` (corner roundness), `shadow` (`soft` | `none`).
The engine reads only these tokens, so changing a client is a token change, not a code change.

## 2. Three directions (show before full production)
Always three *different* ideas, each true to the brand:
1. **Brand-native**: the client's palette and type, clean pictograms, calm motion.
2. **Editorial**: same palette, bolder typography, high-contrast "two worlds" (light surface → dark
   reveal), a signature transition (circle reveal / wipe in the accent colour).
3. **Stretch**: one distinctive device (e.g. blueprint grid, paper cut-outs, isometric 3D, map/route)
   that could own a series.
For each: one still at the hook moment, one 3–5 s motion test, a 3-line rationale, risks. Render with
the engine (`06_production_pipeline.md`). Ask the user to pick or mix.

## 3. Grammar every video follows
**Story spine (25–50 s):** Hook (0–3 s: a concrete object + a tension, a number, or a question) →
Setup (what people think) → Reveal (open the mechanism / show how it works) → **Switch** (at 45–65%:
the insight that flips the obvious answer; must be sourced) → Payoff (what it means for the viewer)
→ CTA (short, after the payoff) → End card (logo, tagline, CTA).

**Focus Test (run on every beat; fail = redesign):**
1. What is THE subject right now? Exactly one thing.
2. Does anything else on screen carry information the viewer might try to read? Remove/dim it.
3. Do the words say what the picture means? Picture + words = the sentence.
4. Where does the eye go next? The next element appears exactly there.
5. Has something changed in the last ~0.6 s? If not, add micro-motion.

**Kinetic typography:** words appear on their spoken onset (2-frame lead). Roles: `dim` (connectives)
· `base` · `big` (key noun) · `accent` (THE payoff word; max one per beat) · `outline` · `ghost`.
Max ~10 words on screen; stack by meaning; blocks exit upward. No caption boxes.

**9:16 zones (1080×1920):** text y 170–700 · subject y 700–1500 · legend y 1500–1750 · keep the
right edge (x > 970) and the bottom 170 px free of key information (platform UI).

**Rhythm:** a cut or world change every 4–7 s; micro-motion every ≤ 0.6 s; the signature reveal at most
twice per video (open, close). Music: a small tension drop before the Switch, downbeat on it.

**Hooks (pick one pattern per video, rotate):** contradiction · concrete consequence · wrong
intuition · impossible object · stakes for a (consenting/sourced) real person · countdown/scale ·
the customer's exact question. Score each hook 1–5 on specificity, truthfulness, visual-verbal
match, payoff exists, originality vs the last 5, works muted, works at 9:16; rewrite anything < 4.

## 4. Anti-patterns
Stock-photo background with a tiny overlay · caption box describing the picture · two moving
subjects at once · decoration that carries no information · fake UI of a real platform · copying a
competitor's or reference creator's trade dress · medical/financial imagery that implies a promise
(see `10_compliance.md`).
