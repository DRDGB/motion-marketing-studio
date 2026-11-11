// "The Thread": a single line that ties a story to its solution (configurable signature device).
// Colour rule: accent on the light world; white (or ink) on the dark world, never accent-on-accent.
import React from "react";
import { C, alpha } from "../theme";

export type Pt = [number, number];

/** Smooth path through points (Catmull-Rom → cubic Bézier) plus arc-length helpers, all computed in JS
 *  so the tip position is deterministic on every frame. */
export const threadPath = (pts: Pt[], tension = 0.5) => {
  const segs: { p0: Pt; c1: Pt; c2: Pt; p1: Pt }[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(pts.length - 1, i + 2)];
    const t = tension / 3;
    segs.push({ p0: b, c1: [b[0] + (c[0] - a[0]) * t, b[1] + (c[1] - a[1]) * t], c2: [c[0] - (d[0] - b[0]) * t, c[1] - (d[1] - b[1]) * t], p1: c });
  }
  const bez = (s: (typeof segs)[number], u: number): Pt => {
    const v = 1 - u;
    return [
      v * v * v * s.p0[0] + 3 * v * v * u * s.c1[0] + 3 * v * u * u * s.c2[0] + u * u * u * s.p1[0],
      v * v * v * s.p0[1] + 3 * v * v * u * s.c1[1] + 3 * v * u * u * s.c2[1] + u * u * u * s.p1[1],
    ];
  };
  // sample for arc length
  const samples: { pt: Pt; len: number }[] = [{ pt: pts[0], len: 0 }];
  let len = 0;
  segs.forEach((s) => {
    let prev = s.p0;
    for (let k = 1; k <= 40; k++) {
      const p = bez(s, k / 40);
      len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      samples.push({ pt: p, len });
      prev = p;
    }
  });
  const d = segs.length
    ? `M ${pts[0][0]} ${pts[0][1]} ` + segs.map((s) => `C ${s.c1[0]} ${s.c1[1]} ${s.c2[0]} ${s.c2[1]} ${s.p1[0]} ${s.p1[1]}`).join(" ")
    : "";
  /** Point at fraction k (0..1) of the total length. */
  const at = (k: number): Pt => {
    const target = Math.max(0, Math.min(1, k)) * len;
    let i = samples.findIndex((s) => s.len >= target);
    if (i <= 0) return samples[0].pt;
    const A = samples[i - 1], B2 = samples[i], u = (target - A.len) / Math.max(1e-6, B2.len - A.len);
    return [A.pt[0] + (B2.pt[0] - A.pt[0]) * u, A.pt[1] + (B2.pt[1] - A.pt[1]) * u];
  };
  return { d, len, at };
};

/** Thread colour for a world. */
export const threadColor = (dark?: boolean | "ink") => (dark === "ink" ? C.ink : dark ? C.light : C.accent);

/** The animated thread: draws from 0 to k, with a small "needle" bead at the tip while drawing. */
export const Thread: React.FC<{ pts: Pt[]; k: number; dark?: boolean | "ink"; width?: number; bead?: boolean; tension?: number }> = ({ pts, k, dark, width = 9, bead = true, tension }) => {
  const p = threadPath(pts, tension);
  const col = threadColor(dark);
  const tip = p.at(k);
  return (
    <g>
      <path d={p.d} stroke={col} strokeWidth={width} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.len} strokeDashoffset={p.len * (1 - Math.max(0, Math.min(1, k)))} />
      {bead && k > 0.001 && k < 0.999 && <>
        <circle cx={tip[0]} cy={tip[1]} r={width * 2.4} fill={alpha(col, 0.18)} />
        <circle cx={tip[0]} cy={tip[1]} r={width * 1.15} fill={col} />
      </>}
    </g>
  );
};

/** A node the thread passes through (a check, a stop). pop = 0..1 scale-in. */
export const Node: React.FC<{ x: number; y: number; pop: number; dark?: boolean | "ink"; r?: number }> = ({ x, y, pop, dark, r = 22 }) => {
  const col = threadColor(dark);
  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      <circle r={r} fill={dark ? C.ink : C.surface} stroke={col} strokeWidth={7} />
      <circle r={r * 0.4} fill={col} />
    </g>
  );
};

/** The knot: a small loop tied at the end of the thread (end card, "your door"). k = 0..1 draws the loop. */
export const Knot: React.FC<{ x: number; y: number; k: number; dark?: boolean | "ink"; s?: number }> = ({ x, y, k, dark, s = 1 }) => {
  const col = threadColor(dark);
  const loop = "M -60 0 C -20 -70 50 -60 40 -10 C 30 40 -40 40 -20 -10 C 0 -60 60 -30 90 0";
  const L = 420;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={loop} stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - Math.max(0, Math.min(1, k)))} />
    </g>
  );
};
