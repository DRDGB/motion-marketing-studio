# Lessons (hard-won, anonymised; append new ones with a date)

## Rendering
- Remotion's default output can be full-range `yuvj420p`. Set `Config.setColorSpace("bt709")` and
  `Config.setPixelFormat("yuv420p")` (done in the engine config) or colours shift on phones.
- Headless WebGL (three.js / @remotion/three) may only work with `Config.setChromiumOpenGlRenderer("swangle")`.
- If the default Chrome download host is blocked, point `REMOTION_BROWSER_EXECUTABLE` at an installed
  Chrome Headless Shell / Chromium.
- Many parallel `remotion still` processes can be killed for lack of memory; cap at ~6.
- Per-frame SVG drop-shadows and `feTurbulence` grain are the main render-time costs (~10–15 min per
  50 s at 1080×1920 on a small machine). Keep shadows on few elements; the engine's grain is one static layer.
- JSON imports in TS need `resolveJsonModule`; cast typed JSON with `as unknown as T`.
- Prop names can collide with local variables (an end-card prop called `cta` shadowed a local); keep
  component props distinct.
- Long kinetic lines with `big`/`accent` words overflow 1080 px; keep ≤ 3 heavy words per line.

## Audio
- A limiter with auto-level (`alimiter` default) plus mono→stereo duplication pushed a mix to
  −11.5 LUFS / 0 dBFS. Use `level=disabled` and 0.707 pan gains; normalise VO alone first.
- Put the music downbeat exactly on the Switch line; a short tension drop before it sells the reveal.

## Voice ↔ line mapping (no speech-to-text)
- Silence detection alone mis-splits: ellipses don't always leave a gap, line ends usually do (0.4–0.6 s).
- Syllable-peak counts per segment ≈ nominal syllables (ratio ~0.9–1.0 with the bundled counter).
- Voiced-vowel run counting settles ambiguous boundaries (one run per syllable).
- A 0.3 s weakly-voiced blip between lines is a breath, not a word.
- Duplicate uploads happen: compare duration + segment pattern before assuming a file is new; a
  "new" file with the identical duration and pauses is the same take.
- If the voice was recorded from an older script version, the **audio wins**: update the on-screen
  text and the script file to what is actually said, and re-check the claim.

## Process
- Validate CSVs before every push; never pipe a validator through `head` when it gates a push (the
  exit code gets lost).
- Commit source after each milestone; cloud workers restart and long renders get killed. Check for a
  finished MP4 (frame count = total × fps) before re-rendering after a restart.
- Keep end-card/series numbering tied to the **publish order**, not production order; write the
  number in one place (the calendar) and read it from there.
- Clients and founders give feedback as "don't re-edit what's posted": change future videos, not
  published ones.
- Descriptions: no URLs, no "AI voice" credits unless required; sources in the pinned comment.
