// Themed pictograms (SVG <g> elements, centred on x,y; s = scale). Literal and simple, brand colours only.
// Use inside an <svg width={1080} height={1920}>. Add new ones here in the same style when a line needs one.
import React from "react";
import { C, DISPLAY, SHADOW, TEXT, alpha } from "../theme";

type P = { x: number; y: number; s?: number; o?: number; dark?: boolean };
const G: React.FC<P & { children: React.ReactNode; shadow?: boolean; rot?: number }> = ({ x, y, s = 1, o = 1, children, shadow = true, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} style={shadow ? { filter: SHADOW } : undefined}>{children}</g>
);
// Akuma rule: illustrations are BLACK line/shape art in both worlds (white and red).
const fg = (_dark?: boolean) => C.ink;
// Accent fill: crimson on the white world; black on the red world (never red on red).
const ac = (dark?: boolean): string => (dark ? C.ink : C.accent);

export const Phone: React.FC<P & { lit?: number; label?: string }> = ({ lit = 0, label, ...p }) => (
  <G {...p}>
    <rect x={-110} y={-200} width={220} height={400} rx={34} fill={C.ink} />
    <rect x={-96} y={-182} width={192} height={364} rx={24} fill={lit > 0.5 ? ac(p.dark) : C.surface} />
    {label && <text y={12} textAnchor="middle" fontFamily={TEXT} fontSize={Math.min(34, 300 / Math.max(1, label.length))} fontWeight={700} fill={lit > 0.5 ? C.light : C.ink}>{label}</text>}
  </G>
);

export const Card: React.FC<P & { rot?: number }> = ({ rot = 0, ...p }) => (
  <G {...p} rot={rot}>
    <rect x={-170} y={-105} width={340} height={210} rx={20} fill={C.support[2] ?? C.ink} />
    <rect x={-130} y={-40} width={56} height={44} rx={8} fill={ac(p.dark)} />
    <rect x={-130} y={50} width={160} height={14} rx={7} fill={C.support[0] ?? C.dim} />
  </G>
);

export const Coin: React.FC<P & { label?: string; r?: number }> = ({ label = "$", r = 60, ...p }) => (
  <G {...p}>
    <circle r={r} fill={ac(p.dark)} />
    <circle r={r * 0.8} fill="none" stroke={(p.dark ? alpha(C.light, 0.5) : C.accentDeep)} strokeWidth={r * 0.07} />
    <text y={r * 0.36} textAnchor="middle" fontFamily={DISPLAY} fontSize={r} fontWeight={900} fill={C.light}>{label}</text>
  </G>
);

/** Faceless person (neutral silhouette). arm: 0 = down, 1 = raised forward. */
export const Person: React.FC<P & { arm?: number; color?: string }> = ({ arm = 0, color, ...p }) => {
  const c = color ?? fg(p.dark);
  const a = -10 - 80 * arm;
  return (
    <G {...p}>
      <rect x={-38} y={-200} width={30} height={196} rx={14} fill={c} />
      <rect x={8} y={-200} width={30} height={196} rx={14} fill={c} />
      <path d="M -62 -318 Q -66 -338 -44 -340 L 44 -340 Q 66 -338 62 -318 L 48 -188 Q 46 -180 38 -180 L -38 -180 Q -46 -180 -48 -188 Z" fill={c} />
      <g transform={`rotate(${a} 56 -320)`}><rect x={44} y={-330} width={26} height={150} rx={13} fill={c} /></g>
      <rect x={-70} y={-330} width={26} height={150} rx={13} fill={c} transform="rotate(8 -56 -320)" />
      <circle cx={0} cy={-398} r={42} fill={c} />
    </G>
  );
};

/** Building: kind "bank" (columns), "shop" (awning), "pharmacy" (cross sign), "office". */
export const Building: React.FC<P & { kind?: "bank" | "shop" | "pharmacy" | "office"; label?: string }> = ({ kind = "office", label, ...p }) => {
  const c = fg(p.dark);
  return (
    <G {...p}>
      {kind === "bank" && <>
        <polygon points="-170,-250 0,-340 170,-250" fill={c} />
        {[-120, -40, 40, 120].map((x) => <rect key={x} x={x - 18} y={-230} width={36} height={190} rx={8} fill={c} />)}
        <rect x={-190} y={-40} width={380} height={40} rx={8} fill={c} />
      </>}
      {(kind === "shop" || kind === "pharmacy" || kind === "office") && <>
        <rect x={-180} y={-300} width={360} height={300} rx={14} fill={C.surface} stroke={c} strokeWidth={8} />
        {kind === "shop" && Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-180 + i * 60} -300 L ${-120 + i * 60} -300 L ${-120 + i * 60} -250 Q ${-150 + i * 60} -225 ${-180 + i * 60} -250 Z`} fill={i % 2 ? C.surface : ac(p.dark)} />)}
        {kind === "pharmacy" && <PlusCross x={0} y={-370} s={0.9} />}
        {kind === "office" && Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-140 + (i % 3) * 100} y={-260 + Math.floor(i / 3) * 110} width={80} height={80} rx={8} fill={alpha(c, 0.18)} />)}
        <rect x={-50} y={-130} width={100} height={130} rx={8} fill={alpha(c, 0.25)} />
      </>}
      {label && <text y={60} textAnchor="middle" fontFamily={TEXT} fontSize={34} fontWeight={700} letterSpacing={4} fill={c}>{label}</text>}
    </G>
  );
};

/** The pharmacy/health cross (accent colour; check local rules before using a red cross). */
export const PlusCross: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-80} y={-80} width={160} height={160} rx={22} fill={ac(p.dark)} />
    <rect x={-22} y={-60} width={44} height={120} rx={8} fill={C.light} />
    <rect x={-60} y={-22} width={120} height={44} rx={8} fill={C.light} />
  </G>
);

export const Pill: React.FC<P & { rot?: number }> = ({ rot = -30, ...p }) => (
  <G {...p} rot={rot}>
    <path d="M -100 -40 L 0 -40 L 0 40 L -100 40 A 40 40 0 0 1 -100 -40 Z" fill={ac(p.dark)} />
    <path d="M 0 -40 L 100 -40 A 40 40 0 0 1 100 40 L 0 40 Z" fill={C.surface} stroke={alpha(C.ink, 0.15)} strokeWidth={3} />
  </G>
);

export const Bottle: React.FC<P & { label?: string }> = ({ label = "Rx", ...p }) => (
  <G {...p}>
    <rect x={-70} y={-200} width={140} height={50} rx={10} fill={C.ink} />
    <rect x={-95} y={-150} width={190} height={300} rx={30} fill={ac(p.dark)} />
    <rect x={-80} y={-90} width={160} height={150} rx={12} fill={C.surface} />
    <text y={10} textAnchor="middle" fontFamily={DISPLAY} fontSize={56} fontWeight={900} fill={C.ink}>{label}</text>
  </G>
);

export const Box: React.FC<P & { label?: string }> = ({ label, ...p }) => (
  <G {...p}>
    <rect x={-130} y={-110} width={260} height={220} rx={12} fill={C.support[0] ?? C.dim} />
    <rect x={-130} y={-110} width={260} height={50} rx={12} fill={C.support[1] ?? C.ink} />
    <rect x={-20} y={-110} width={40} height={220} fill={alpha(C.light, 0.5)} />
    {label && <text y={60} textAnchor="middle" fontFamily={TEXT} fontSize={34} fontWeight={700} fill={C.ink}>{label}</text>}
  </G>
);

/** Clock; t = 0..1 sweeps the minute hand once. */
export const Clock: React.FC<P & { t?: number }> = ({ t = 0, ...p }) => (
  <G {...p}>
    <circle r={120} fill={C.surface} stroke={fg(p.dark)} strokeWidth={12} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-4} y={-108} width={8} height={18} rx={3} fill={fg(p.dark)} transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-60} width={12} height={66} rx={6} fill={fg(p.dark)} transform="rotate(-60)" />
    <rect x={-5} y={-95} width={10} height={100} rx={5} fill={ac(p.dark)} transform={`rotate(${t * 360})`} />
    <circle r={12} fill={ac(p.dark)} />
  </G>
);

export const Chat: React.FC<P & { text?: string; w?: number; fromRight?: boolean }> = ({ text = "…", w = 420, fromRight = false, ...p }) => (
  <G {...p}>
    <rect x={-w / 2} y={-70} width={w} height={140} rx={40} fill={fromRight ? ac(p.dark) : C.surface} />
    <path d={fromRight ? `M ${w / 2 - 70} 60 L ${w / 2 - 10} 110 L ${w / 2 - 110} 66 Z` : `M ${-w / 2 + 70} 60 L ${-w / 2 + 10} 110 L ${-w / 2 + 110} 66 Z`} fill={fromRight ? ac(p.dark) : C.surface} />
    <text y={14} textAnchor="middle" fontFamily={TEXT} fontSize={40} fontWeight={700} fill={fromRight ? C.light : C.ink}>{text}</text>
  </G>
);

export const Check: React.FC<P & { k?: number }> = ({ k = 1, ...p }) => (
  <G {...p} shadow={false}>
    <circle r={70} fill={ac(p.dark)} />
    <path d="M -32 2 L -8 28 L 36 -26" stroke={C.light} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120} strokeDashoffset={120 * (1 - k)} />
  </G>
);

export const Cross: React.FC<P> = (p) => (
  <G {...p} shadow={false}>
    <circle r={70} fill={fg(p.dark)} />
    <path d="M -28 -28 L 28 28 M 28 -28 L -28 28" stroke={C.light} strokeWidth={16} strokeLinecap="round" />
  </G>
);

export const Cart: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -170 -120 L -120 -120 L -80 60 L 120 60 L 160 -70 L -100 -70" stroke={fg(p.dark)} strokeWidth={18} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <circle cx={-60} cy={110} r={24} fill={fg(p.dark)} /><circle cx={100} cy={110} r={24} fill={fg(p.dark)} />
  </G>
);

/** Horizontal bar 0..1 with label and value text. */
export const Bar: React.FC<P & { v: number; label?: string; value?: string; w?: number }> = ({ v, label, value, w = 760, ...p }) => (
  <G {...p} shadow={false}>
    <rect x={-w / 2} y={-40} width={w} height={80} rx={40} fill={alpha(fg(p.dark), 0.12)} />
    <rect x={-w / 2} y={-40} width={Math.max(80, w * v)} height={80} rx={40} fill={ac(p.dark)} />
    {label && <text x={-w / 2} y={-70} fontFamily={TEXT} fontSize={36} fontWeight={700} fill={fg(p.dark)}>{label}</text>}
    {value && <text x={w / 2} y={-70} textAnchor="end" fontFamily={DISPLAY} fontSize={44} fontWeight={900} fill={ac(p.dark)}>{value}</text>}
  </G>
);

/** Arrow drawn along a path; k = 0..1 draw progress. Coordinates are absolute (not centred). */
export const Arrow: React.FC<{ d: string; k: number; color?: string; width?: number; len?: number; dark?: boolean }> = ({ d, k, color, width = 10, len = 1200, dark }) => (
  <path d={d} stroke={color ?? ac(dark)} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
);

/** Rounded label chip. */
export const Badge: React.FC<P & { text: string; filled?: boolean }> = ({ text, filled = true, ...p }) => {
  const w = Math.max(160, text.length * 26 + 60);
  return (
    <G {...p} shadow={false}>
      <rect x={-w / 2} y={-38} width={w} height={76} rx={38} fill={filled ? ac(p.dark) : "none"} stroke={ac(p.dark)} strokeWidth={4} />
      <text y={13} textAnchor="middle" fontFamily={TEXT} fontSize={34} fontWeight={700} letterSpacing={2} fill={filled ? C.light : ac(p.dark)}>{text}</text>
    </G>
  );
};
