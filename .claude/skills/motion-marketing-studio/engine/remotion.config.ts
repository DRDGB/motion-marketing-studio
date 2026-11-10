import { Config } from "@remotion/cli/config";
import fs from "node:fs";
import path from "node:path";

// Use an installed Chrome Headless Shell when one exists (sandboxed/cloud machines often block the download host).
const findShell = (): string | undefined => {
  if (process.env.REMOTION_BROWSER_EXECUTABLE) return process.env.REMOTION_BROWSER_EXECUTABLE;
  const base = "/opt/pw-browsers";
  if (!fs.existsSync(base)) return undefined;
  for (const d of fs.readdirSync(base)) {
    const p = path.join(base, d, "chrome-headless-shell-linux64", "chrome-headless-shell");
    if (d.startsWith("chromium_headless_shell") && fs.existsSync(p)) return p;
  }
  return undefined;
};
const shell = findShell();
if (shell) Config.setBrowserExecutable(shell);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Phone-safe colour: yuv420p, TV range, BT.709-tagged (the default can be full-range yuvj420p).
Config.setColorSpace("bt709");
Config.setPixelFormat("yuv420p");
// If you add three.js scenes and WebGL fails headless, also set: Config.setChromiumOpenGlRenderer("swangle");
