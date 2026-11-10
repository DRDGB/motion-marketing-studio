// Load the brand's local font files before rendering (no network needed).
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { B } from "./theme";

let started = false;
export const loadBrandFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const seen = new Set<string>();
  const faces: FontFace[] = [];
  for (const group of [B.fonts.display, B.fonts.text]) {
    for (const f of group.files) {
      const key = `${group.family}|${f.weight}|${f.style ?? "normal"}`;
      if (seen.has(key)) continue;
      seen.add(key);
      faces.push(new FontFace(group.family, `url(${staticFile(f.file)})`, { weight: String(f.weight), style: f.style ?? "normal" }));
    }
  }
  if (!faces.length) return;
  const handle = delayRender("Loading brand fonts");
  Promise.all(faces.map((ff) => ff.load().then((l) => document.fonts.add(l))))
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
};
