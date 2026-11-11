// Map of Africa (+ India, Arabian Peninsula) from Natural Earth 1:50m (public domain), with a camera that eases
// from one bounding box to another (continent → country → city), a highlighted country and city pins.
import React from "react";
import GEO from "../data/geo.json";
import { C, TEXT, DISPLAY, alpha } from "../theme";

type Country = { name: string; africa: boolean; d: string; bbox: [number, number, number, number]; label: [number, number] | null };
const G = GEO as unknown as { countries: Record<string, Country>; cities: Record<string, [number, number]> };
export const COUNTRIES = G.countries;
export const CITIES = G.cities;
export type Box = [number, number, number, number];

/** Bounding box of all African countries (map units). */
export const AFRICA_BOX: Box = (() => {
  const b: Box = [1e9, 1e9, -1e9, -1e9];
  Object.values(G.countries).filter((c) => c.africa).forEach((c) => { b[0] = Math.min(b[0], c.bbox[0]); b[1] = Math.min(b[1], c.bbox[1]); b[2] = Math.max(b[2], c.bbox[2]); b[3] = Math.max(b[3], c.bbox[3]); });
  return b;
})();
export const boxOf = (iso: string, pad = 0.15): Box => {
  const [a, b, c, d] = G.countries[iso].bbox; const w = c - a, h = d - b;
  return [a - w * pad, b - h * pad, c + w * pad, d + h * pad];
};
export const lerpBox = (A: Box, B: Box, k: number): Box => A.map((v, i) => v + (B[i] - v) * k) as Box;

/** Fit `box` (map units) into the screen rectangle `frame` [x, y, w, h]; returns the SVG transform and a projector. */
export const fit = (box: Box, frame: [number, number, number, number]) => {
  const [x0, y0, x1, y1] = box; const [fx, fy, fw, fh] = frame;
  const s = Math.min(fw / (x1 - x0), fh / (y1 - y0));
  const ox = fx + (fw - (x1 - x0) * s) / 2 - x0 * s, oy = fy + (fh - (y1 - y0) * s) / 2 - y0 * s;
  return { s, transform: `translate(${ox} ${oy}) scale(${s})`, P: (p: [number, number]): [number, number] => [ox + p[0] * s, oy + p[1] * s] };
};

/** The map layer. `box` = camera; `highlight` = ISO code filled crimson; `dim` fades non-highlighted countries. */
export const MapLayer: React.FC<{ box: Box; frame?: [number, number, number, number]; highlight?: string; hk?: number; dim?: number; showIndia?: boolean; dark?: boolean }> = ({ box, frame = [40, 300, 1000, 1240], highlight, hk = 1, dim = 0, showIndia = true, dark }) => {
  const { s, transform } = fit(box, frame);
  const line = dark ? C.ink : C.ink;
  return (
    <g transform={transform}>
      {Object.entries(G.countries).map(([iso, c]) => {
        if (!c.africa && !(showIndia && iso === "IN") && !["SA", "YE", "OM", "AE", "ES", "PT", "IT", "GR", "TR", "SY", "IQ", "IR", "JO", "IL", "PK", "LK", "BD", "NP", "KW", "QA", "FR"].includes(iso)) return null;
        const hi = iso === highlight;
        const context = !c.africa && iso !== "IN";
        const fill = hi ? (dark ? C.ink : C.accent) : context ? alpha(C.ink, 0.04) : dark ? alpha(C.light, 0.92 - 0.5 * dim) : alpha(C.ink, 0.06 + 0.02 * (1 - dim));
        return <path key={iso} d={c.d} fill={hi ? fill : fill} fillOpacity={hi ? 0.15 + 0.85 * hk : 1} stroke={context ? alpha(line, 0.25) : line} strokeWidth={(hi ? 3 : 1.6) / s} strokeLinejoin="round" opacity={context ? 0.6 : 1 - 0.55 * dim * (hi ? 0 : 1)} />;
      })}
    </g>
  );
};

/** City pin (screen coords) with a bounce-in (p 0..1) and a label. */
export const Pin: React.FC<{ x: number; y: number; p: number; label?: string; dark?: boolean; size?: number }> = ({ x, y, p, label, dark, size = 1 }) => (
  <g transform={`translate(${x} ${y - 30 * (1 - p)}) scale(${size})`} opacity={Math.min(1, p * 2)}>
    <ellipse cx={0} cy={4} rx={18} ry={6} fill={alpha(C.ink, 0.25)} />
    <path d="M 0 0 C -10 -22 -34 -40 -34 -66 A 34 34 0 1 1 34 -66 C 34 -40 10 -22 0 0 Z" fill={dark ? C.light : C.ink} />
    <circle cx={0} cy={-66} r={14} fill={dark ? C.ink : C.accent} />
    {label && <text x={46} y={-56} fontFamily={DISPLAY} fontSize={54} fontWeight={700} fill={dark ? C.light : C.ink}>{label}</text>}
  </g>
);

/** Country name label in caps (screen coords). */
export const CountryLabel: React.FC<{ x: number; y: number; text: string; o?: number; color?: string }> = ({ x, y, text, o = 1, color }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={TEXT} fontSize={44} fontWeight={800} letterSpacing={10} fill={color ?? C.ink} opacity={o}>{text}</text>
);
