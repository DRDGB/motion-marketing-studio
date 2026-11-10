// Contact sheets for review: node stills.mjs [ID ...]  → ../renders/stills/<ID>_<frame>.png (one bundle for all).
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const out = path.resolve("../renders/stills");
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const comps = await getCompositions(serveUrl, { browserExecutable });
const want = process.argv.slice(2);
for (const c of comps.filter((c) => !want.length || want.includes(c.id))) {
  const n = 8;
  for (let i = 0; i < n; i++) {
    const frame = Math.round(((i + 0.55) / n) * (c.durationInFrames - 1));
    await renderStill({ composition: c, serveUrl, output: path.join(out, `${c.id}_${String(frame).padStart(4, "0")}.png`), frame, scale: 0.25, browserExecutable });
  }
  console.log("stills", c.id);
}
