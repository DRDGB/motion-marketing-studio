// Brand tokens -> theme. Every component reads colours/fonts from here, never hard-coded values.
import BRAND from "./brand/brand.json";

type FontFile = { file: string; weight: number; style?: "normal" | "italic" };
export type Brand = {
  name: string; tagline: string; handle?: string; cta: string; logo: string | null;
  colors: { bg: string; surface: string; ink: string; dim: string; accent: string; accentDeep: string; dark: string; darkSurface: string; light: string; support: string[] };
  fonts: { display: { family: string; files: FontFile[] }; text: { family: string; files: FontFile[] } };
  texture: "paper" | "clean" | "grid";
  motion: { energy: "calm" | "lively"; radius: number; shadow: "soft" | "none" };
};
export const B = BRAND as unknown as Brand;
export const C = B.colors;
export const DISPLAY = `"${B.fonts.display.family}", Inter, system-ui, sans-serif`;
export const TEXT = `"${B.fonts.text.family}", Inter, system-ui, sans-serif`;
export const SHADOW = B.motion.shadow === "none" ? "none" : "drop-shadow(0 18px 22px rgba(20,24,32,0.18)) drop-shadow(0 3px 4px rgba(20,24,32,0.12))";
export const ENERGY = B.motion.energy === "lively" ? 1.25 : 1; // speeds up pops/pushes a little for lively brands

/** rgba() from a #rrggbb token. */
export const alpha = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
