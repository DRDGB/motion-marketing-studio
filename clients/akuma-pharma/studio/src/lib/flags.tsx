// National flags (official colours), drawn as a waving cloth on a pole. Add countries as the series moves.
import React from "react";
import { C, alpha } from "../theme";

const SPECS: Record<string, { stripes: string[]; dir: "v" | "h"; extra?: "star-gh" | "kenya" }> = {
  NG: { stripes: ["#008751", "#FFFFFF", "#008751"], dir: "v" },
  CI: { stripes: ["#F77F00", "#FFFFFF", "#009E60"], dir: "v" },
  GH: { stripes: ["#CE1126", "#FCD116", "#006B3F"], dir: "h", extra: "star-gh" },
  SN: { stripes: ["#00853F", "#FDEF42", "#E31B23"], dir: "v" },
  KE: { stripes: ["#000000", "#BB0000", "#006600"], dir: "h", extra: "kenya" },
  IN: { stripes: ["#FF9933", "#FFFFFF", "#138808"], dir: "h" },
};

/** Waving flag: w×h cloth, wave phase t (seconds), raise 0..1 (cloth slides up the pole). */
export const Flag: React.FC<{ iso: string; x: number; y: number; w?: number; h?: number; t?: number; raise?: number; s?: number }> = ({ iso, x, y, w = 360, h = 240, t = 0, raise = 1, s = 1 }) => {
  const sp = SPECS[iso];
  const N = 24;
  const wave = (u: number) => Math.sin(u * 5.2 - t * 6) * 10 * u; // amplitude grows away from the pole
  const strip = (i: number, n: number) => {
    // polygon for stripe i of n, sampled along x, offset by wave
    const pts: string[] = [];
    if (sp.dir === "v") {
      const a = (i / n) * w, b = ((i + 1) / n) * w;
      for (let k = 0; k <= N; k++) { const xx = a + (b - a) * (k / N); pts.push(`${xx},${wave(xx / w)}`); }
      for (let k = N; k >= 0; k--) { const xx = a + (b - a) * (k / N); pts.push(`${xx},${h + wave(xx / w)}`); }
    } else {
      const a = (i / n) * h, b = ((i + 1) / n) * h;
      for (let k = 0; k <= N; k++) { const xx = w * (k / N); pts.push(`${xx},${a + wave(xx / w)}`); }
      for (let k = N; k >= 0; k--) { const xx = w * (k / N); pts.push(`${xx},${b + wave(xx / w)}`); }
    }
    return pts.join(" ");
  };
  const yOff = (1 - raise) * 420;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-10} y={-20} width={14} height={h + 470} rx={6} fill={C.ink} />
      <circle cx={-3} cy={-26} r={14} fill={C.ink} />
      <g transform={`translate(4 ${yOff})`}>
        {sp.stripes.map((col, i) => <polygon key={i} points={strip(i, sp.stripes.length)} fill={col} stroke={col === "#FFFFFF" ? alpha(C.ink, 0.15) : col} strokeWidth={1} />)}
        {sp.extra === "star-gh" && <text x={w / 2} y={h / 2 + 30 + wave(0.5)} textAnchor="middle" fontSize={90} fill="#000000">★</text>}
        <polyline points={Array.from({ length: N + 1 }, (_, k) => `${(w * k) / N},${wave(k / N)}`).join(" ")} fill="none" stroke={alpha(C.ink, 0.25)} strokeWidth={2} />
        {/* soft fold shading */}
        {Array.from({ length: 4 }).map((_, i) => { const u = (i + 0.6) / 4.2; return <rect key={i} x={u * w} y={wave(u)} width={w * 0.06} height={h} fill={alpha("#000000", 0.05 + 0.04 * Math.sin(u * 5.2 - t * 6))} />; })}
      </g>
    </g>
  );
};
