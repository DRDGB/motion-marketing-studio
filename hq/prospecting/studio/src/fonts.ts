// Local font files only (OFL licences next to each file in public/fonts/). No network at render time.
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

const FACES: { family: string; file: string; weight: string; style?: string }[] = [
  { family: "Inter", file: "fonts/Inter-Medium.otf", weight: "500" },
  { family: "Inter", file: "fonts/Inter-Bold.otf", weight: "700" },
  { family: "Inter", file: "fonts/Inter-Black.otf", weight: "900" },
  { family: "Playfair Display", file: "fonts/PlayfairDisplay.ttf", weight: "400 900" },
  { family: "Shrikhand", file: "fonts/Shrikhand.ttf", weight: "400" },
  { family: "Cormorant Garamond", file: "fonts/CormorantGaramond.ttf", weight: "300 700" },
  { family: "DM Serif Display", file: "fonts/DMSerifDisplay.ttf", weight: "400" },
  { family: "DM Serif Display", file: "fonts/DMSerifDisplay-Italic.ttf", weight: "400", style: "italic" },
  { family: "Fraunces", file: "fonts/Fraunces.ttf", weight: "100 900" },
  { family: "Abril Fatface", file: "fonts/AbrilFatface.ttf", weight: "400" },
  { family: "Jost", file: "fonts/Jost.ttf", weight: "100 900" },
  { family: "Unbounded", file: "fonts/Unbounded.ttf", weight: "200 900" },
  { family: "Fredoka", file: "fonts/Fredoka.ttf", weight: "300 700" },
  { family: "Cinzel", file: "fonts/Cinzel.ttf", weight: "400 900" },
];

let started = false;
export const loadFonts = () => {
  if (started || typeof document === "undefined") return;
  started = true;
  const handle = delayRender("Loading fonts");
  Promise.all(
    FACES.map((f) => new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: f.weight, style: f.style ?? "normal" }).load().then((l) => document.fonts.add(l))),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
};
