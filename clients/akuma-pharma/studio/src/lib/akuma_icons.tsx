// Akuma Pharma pictograms: drawn, UNLABELLED, generic (no product names, no regulator/WHO marks, no people injecting,
// no pens). Black line/shape art in both worlds (D-015); crimson only for the one accented part on the white world.
// Use inside <svg width={1080} height={1920}>; centred on x,y; s = scale.
import React from "react";
import { C, SHADOW, alpha } from "../theme";

type P = { x: number; y: number; s?: number; o?: number; dark?: boolean; rot?: number; accent?: boolean };
const INK = () => C.ink;
const ACC = (dark?: boolean) => (dark ? C.ink : C.accent);
const PAPER = () => C.surface;
const G: React.FC<P & { children: React.ReactNode; shadow?: boolean }> = ({ x, y, s = 1, o = 1, rot = 0, children, shadow = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o} style={shadow ? { filter: SHADOW } : undefined}>{children}</g>
);

/** Generic manufacturing plant (no signage): saw-tooth roof, chimney, windows. */
export const Factory: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -220 120 L -220 -40 L -140 -100 L -140 -40 L -60 -100 L -60 -40 L 20 -100 L 20 -40 L 220 -40 L 220 120 Z" fill={PAPER()} stroke={INK()} strokeWidth={10} strokeLinejoin="round" />
    <rect x={120} y={-200} width={50} height={160} fill={INK()} />
    {[-170, -90, -10, 70, 150].map((x) => <rect key={x} x={x} y={10} width={44} height={44} rx={6} fill={p.accent ? ACC(p.dark) : alpha(INK(), 0.85)} />)}
  </G>
);

/** One document with lines and a corner fold; `stamp` adds a round check stamp (no logo). */
export const Doc: React.FC<P & { stamp?: number }> = ({ stamp = 0, ...p }) => (
  <G {...p} shadow>
    <path d="M -110 -150 L 60 -150 L 110 -100 L 110 150 L -110 150 Z" fill={PAPER()} stroke={INK()} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 60 -150 L 60 -100 L 110 -100" fill="none" stroke={INK()} strokeWidth={8} strokeLinejoin="round" />
    {[-80, -40, 0, 40].map((y, i) => <rect key={y} x={-80} y={y} width={i === 0 ? 120 : 160} height={14} rx={7} fill={alpha(INK(), i === 0 ? 0.9 : 0.35)} />)}
    {stamp > 0 && <g transform={`translate(40 95) scale(${stamp}) rotate(-12)`}>
      <circle r={46} fill="none" stroke={ACC(p.dark)} strokeWidth={8} />
      <path d="M -20 0 L -5 16 L 22 -16" stroke={ACC(p.dark)} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>}
  </G>
);

/** A stack of n documents fanned (spread 0..1), or merged into one folder when spread → 0. */
export const DocStack: React.FC<P & { n?: number; spread?: number }> = ({ n = 5, spread = 1, ...p }) => (
  <G {...p}>
    {Array.from({ length: n }).map((_, i) => {
      const c = i - (n - 1) / 2;
      return <Doc key={i} x={c * 70 * spread} y={-Math.abs(c) * 10 * spread} rot={c * 7 * spread} s={0.8} dark={p.dark} />;
    })}
  </G>
);

/** Closed folder (the "one folder" payoff). */
export const Folder: React.FC<P> = (p) => (
  <G {...p} shadow>
    <path d="M -160 -110 L -50 -110 L -20 -80 L 160 -80 L 160 120 L -160 120 Z" fill={PAPER()} stroke={INK()} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -160 -40 L 160 -40" stroke={INK()} strokeWidth={9} />
    <rect x={-60} y={10} width={120} height={22} rx={11} fill={ACC(p.dark)} />
  </G>
);

/** Shipping carton (unlabelled), with tape. */
export const Carton: React.FC<P> = (p) => (
  <G {...p} shadow>
    <path d="M -130 -60 L 0 -120 L 130 -60 L 130 110 L 0 170 L -130 110 Z" fill={PAPER()} stroke={INK()} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -130 -60 L 0 0 L 130 -60 M 0 0 L 0 170" fill="none" stroke={INK()} strokeWidth={9} strokeLinejoin="round" />
    <path d="M -65 -90 L 65 -30" stroke={ACC(p.dark)} strokeWidth={22} strokeLinecap="round" />
  </G>
);

/** Blister pack: generic, 2×4 cavities, no text. */
export const Blister: React.FC<P> = (p) => (
  <G {...p} shadow>
    <rect x={-130} y={-80} width={260} height={160} rx={18} fill={PAPER()} stroke={INK()} strokeWidth={8} />
    {Array.from({ length: 8 }).map((_, i) => <ellipse key={i} cx={-90 + (i % 4) * 60} cy={-32 + Math.floor(i / 4) * 64} rx={20} ry={14} fill={i === 0 && p.accent ? ACC(p.dark) : alpha(INK(), 0.85)} />)}
  </G>
);

/** Cargo ship (side view). */
export const Ship: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -230 0 L 230 0 L 180 80 L -190 80 Z" fill={INK()} />
    {[-170, -100, -30, 40].map((x, i) => <rect key={x} x={x} y={-70} width={62} height={62} rx={4} fill={i === 1 ? ACC(p.dark) : PAPER()} stroke={INK()} strokeWidth={7} />)}
    <rect x={120} y={-120} width={70} height={120} fill={PAPER()} stroke={INK()} strokeWidth={7} />
  </G>
);

/** Cargo plane (top-down silhouette). */
export const Plane: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M 0 -170 C 18 -170 22 -140 22 -110 L 22 -30 L 190 40 L 190 70 L 22 30 L 22 110 L 70 150 L 70 170 L 0 150 L -70 170 L -70 150 L -22 110 L -22 30 L -190 70 L -190 40 L -22 -30 L -22 -110 C -22 -140 -18 -170 0 -170 Z" fill={INK()} />
  </G>
);

/** The buyer's door: a warehouse / business door with a handle (the thread ties here). */
export const Door: React.FC<P & { open?: number }> = ({ open = 0, ...p }) => (
  <G {...p}>
    <rect x={-150} y={-260} width={300} height={360} rx={10} fill={PAPER()} stroke={INK()} strokeWidth={10} />
    <rect x={-110} y={-220} width={220} height={320} rx={6} fill={alpha(INK(), 0.1 + 0.5 * open)} stroke={INK()} strokeWidth={8} />
    <circle cx={70} cy={-40} r={14} fill={ACC(p.dark)} />
    <rect x={-190} y={100} width={380} height={18} rx={9} fill={INK()} />
  </G>
);

/** Thermometer + droplet (heat and humidity; for stability topics). level = 0..1. */
export const HeatHumidity: React.FC<P & { level?: number }> = ({ level = 0.7, ...p }) => (
  <G {...p}>
    <rect x={-120} y={-200} width={60} height={300} rx={30} fill={PAPER()} stroke={INK()} strokeWidth={9} />
    <rect x={-104} y={-184 + 268 * (1 - level)} width={28} height={268 * level} rx={14} fill={ACC(p.dark)} />
    <circle cx={-90} cy={130} r={50} fill={ACC(p.dark)} stroke={INK()} strokeWidth={9} />
    <path d="M 90 -120 C 140 -40 170 0 170 50 A 80 80 0 0 1 10 50 C 10 0 40 -40 90 -120 Z" fill={PAPER()} stroke={INK()} strokeWidth={9} />
  </G>
);

/** Question card (series #1 device): a card with a big "?" that flips to the answer side. flip = 0..1. */
export const QuestionCard: React.FC<P & { flip?: number }> = ({ flip = 0, ...p }) => {
  const sx = Math.abs(Math.cos(flip * Math.PI));
  const front = flip < 0.5;
  return (
    <G {...p} shadow>
      <g transform={`scale(${Math.max(0.02, sx)} 1)`}>
        <rect x={-210} y={-280} width={420} height={560} rx={36} fill={front ? (p.dark ? C.surface : C.ink) : C.surface} stroke={C.ink} strokeWidth={8} />
        {front && <text y={90} textAnchor="middle" fontSize={340} fontWeight={700} fontFamily="Playfair Display" fill={p.dark ? C.ink : C.light}>?</text>}
        {!front && <path d="M -70 0 L -20 50 L 80 -60" stroke={ACC(p.dark)} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      </g>
    </G>
  );
};
