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

/** Pharmaceutical manufacturing plant (WHO-GMP style): clean flat-roof block, glazed cleanroom band, capsule emblem.
 *  No chimney, no signage text. `Factory` is kept as an alias so older scenes still compile. */
export const PharmaPlant: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-240} y={-120} width={300} height={240} rx={8} fill={PAPER()} stroke={INK()} strokeWidth={10} />
    <rect x={60} y={-40} width={180} height={160} rx={8} fill={PAPER()} stroke={INK()} strokeWidth={10} />
    <rect x={-210} y={-80} width={240} height={56} rx={6} fill={alpha(INK(), 0.85)} />
    {[-180, -120, -60, 0].map((x) => <rect key={x} x={x} y={-72} width={4} height={40} fill={PAPER()} />)}
    <g transform="translate(-90 40) rotate(-35)">
      <path d="M -50 -20 L 0 -20 L 0 20 L -50 20 A 20 20 0 0 1 -50 -20 Z" fill={ACC(p.dark)} />
      <path d="M 0 -20 L 50 -20 A 20 20 0 0 1 50 20 L 0 20 Z" fill={PAPER()} stroke={INK()} strokeWidth={6} />
    </g>
    {[90, 150].map((x) => <rect key={x} x={x} y={-10} width={40} height={40} rx={5} fill={alpha(INK(), 0.85)} />)}
    <rect x={120} y={60} width={60} height={60} rx={4} fill={alpha(INK(), 0.25)} />
    <rect x={-270} y={120} width={540} height={14} rx={7} fill={INK()} />
  </G>
);
export const Factory = PharmaPlant;

/** Pharmacy storefront (the buyer): awning, big plus sign (black on white world / white on red), shelves in the window. */
export const Pharmacy: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-200} y={-170} width={400} height={330} rx={10} fill={PAPER()} stroke={INK()} strokeWidth={10} />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${-200 + i * 57.1} -170 L ${-142.9 + i * 57.1} -170 L ${-142.9 + i * 57.1} -120 Q ${-171.4 + i * 57.1} -95 ${-200 + i * 57.1} -120 Z`} fill={i % 2 ? PAPER() : ACC(p.dark)} stroke={INK()} strokeWidth={4} />)}
    <g transform="translate(0 -250)">
      <rect x={-60} y={-60} width={120} height={120} rx={22} fill={p.dark ? C.light : INK()} />
      <rect x={-16} y={-42} width={32} height={84} rx={6} fill={p.dark ? INK() : PAPER()} />
      <rect x={-42} y={-16} width={84} height={32} rx={6} fill={p.dark ? INK() : PAPER()} />
    </g>
    <rect x={-170} y={-80} width={200} height={150} rx={6} fill={alpha(INK(), 0.08)} stroke={INK()} strokeWidth={6} />
    {[-50, 10].map((y) => <rect key={y} x={-160} y={y} width={180} height={8} fill={INK()} />)}
    {[-150, -115, -80, -45, -10].map((x, i) => <rect key={x} x={x} y={-42} width={24} height={32} rx={4} fill={i === 2 ? ACC(p.dark) : alpha(INK(), 0.8)} />)}
    {[-150, -105, -60, -15].map((x) => <rect key={x} x={x} y={20} width={34} height={30} rx={4} fill={alpha(INK(), 0.6)} />)}
    <rect x={70} y={-60} width={100} height={220} rx={6} fill={alpha(INK(), 0.12)} stroke={INK()} strokeWidth={6} />
    <circle cx={150} cy={50} r={8} fill={INK()} />
  </G>
);

/** Pharmacist / QA professional: faceless, white lab coat with black outline, clipboard. arm 0..1 raises the clipboard. */
export const Pharmacist: React.FC<P & { arm?: number }> = ({ arm = 0, ...p }) => (
  <G {...p}>
    <rect x={-40} y={-90} width={30} height={170} rx={14} fill={INK()} />
    <rect x={10} y={-90} width={30} height={170} rx={14} fill={INK()} />
    <path d="M -80 -330 Q -84 -350 -60 -352 L 60 -352 Q 84 -350 80 -330 L 92 -60 Q 92 -40 72 -40 L -72 -40 Q -92 -40 -92 -60 Z" fill={PAPER()} stroke={INK()} strokeWidth={9} />
    <path d="M -30 -352 L 0 -290 L 30 -352" fill="none" stroke={INK()} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 0 -290 L 0 -60" stroke={INK()} strokeWidth={6} />
    <rect x={30} y={-250} width={30} height={8} rx={4} fill={ACC(p.dark)} />
    <rect x={-104} y={-340} width={26} height={170} rx={13} fill={PAPER()} stroke={INK()} strokeWidth={7} transform="rotate(8 -91 -330)" />
    <g transform={`rotate(${-20 - 60 * arm} 78 -330)`}>
      <rect x={66} y={-340} width={26} height={150} rx={13} fill={PAPER()} stroke={INK()} strokeWidth={7} />
      <rect x={50} y={-210} width={70} height={90} rx={6} fill={INK()} />
      <rect x={60} y={-195} width={50} height={8} rx={4} fill={PAPER()} /><rect x={60} y={-178} width={40} height={8} rx={4} fill={PAPER()} />
    </g>
    <circle cx={0} cy={-405} r={44} fill={INK()} />
  </G>
);

/** Medicine carton (unlabelled): a box with a plus sign and a capsule mark, no text. */
export const MedCarton: React.FC<P> = (p) => (
  <G {...p} shadow>
    <rect x={-120} y={-80} width={240} height={160} rx={10} fill={PAPER()} stroke={INK()} strokeWidth={8} />
    <rect x={-120} y={-80} width={240} height={36} rx={10} fill={ACC(p.dark)} />
    <g transform="translate(-60 20)"><rect x={-26} y={-8} width={52} height={16} rx={4} fill={INK()} /><rect x={-8} y={-26} width={16} height={52} rx={4} fill={INK()} /></g>
    {[0, 22, 44].map((y) => <rect key={y} x={0} y={y - 6} width={y ? 80 : 100} height={10} rx={5} fill={alpha(INK(), 0.4)} />)}
  </G>
);

/** Capsule (two-tone). */
export const Capsule: React.FC<P> = ({ rot = -30, ...p }) => (
  <G {...p} rot={rot}>
    <path d="M -90 -36 L 0 -36 L 0 36 L -90 36 A 36 36 0 0 1 -90 -36 Z" fill={ACC(p.dark)} stroke={INK()} strokeWidth={6} />
    <path d="M 0 -36 L 90 -36 A 36 36 0 0 1 90 36 L 0 36 Z" fill={PAPER()} stroke={INK()} strokeWidth={6} />
  </G>
);

/** Glass vial with crimp cap (no syringe). */
export const Vial: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-34} y={-130} width={68} height={34} rx={6} fill={ACC(p.dark)} stroke={INK()} strokeWidth={6} />
    <path d="M -24 -96 L 24 -96 L 24 -80 Q 50 -70 50 -40 L 50 110 Q 50 130 30 130 L -30 130 Q -50 130 -50 110 L -50 -40 Q -50 -70 -24 -80 Z" fill={PAPER()} stroke={INK()} strokeWidth={8} />
    <rect x={-50} y={10} width={100} height={60} fill={alpha(INK(), 0.85)} />
  </G>
);

/** Tablet bottle (unlabelled). */
export const PillBottle: React.FC<P> = (p) => (
  <G {...p}>
    <rect x={-70} y={-160} width={140} height={50} rx={10} fill={INK()} />
    <rect x={-90} y={-110} width={180} height={250} rx={28} fill={PAPER()} stroke={INK()} strokeWidth={9} />
    <rect x={-70} y={-50} width={140} height={110} rx={10} fill={ACC(p.dark)} />
    <g transform="translate(0 5)"><rect x={-24} y={-8} width={48} height={16} rx={4} fill={PAPER()} /><rect x={-8} y={-24} width={16} height={48} rx={4} fill={PAPER()} /></g>
  </G>
);

/** QC lab flask with liquid level (testing). */
export const Flask: React.FC<P & { level?: number }> = ({ level = 0.5, ...p }) => (
  <G {...p}>
    <clipPath id="akm-flask"><path d="M -30 -150 L 30 -150 L 30 -40 L 110 120 Q 120 150 90 150 L -90 150 Q -120 150 -110 120 L -30 -40 Z" /></clipPath>
    <rect x={-130} y={150 - 300 * level} width={260} height={300} fill={ACC(p.dark)} clipPath="url(#akm-flask)" />
    <path d="M -30 -150 L 30 -150 L 30 -40 L 110 120 Q 120 150 90 150 L -90 150 Q -120 150 -110 120 L -30 -40 Z" fill="none" stroke={INK()} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-46} y={-170} width={92} height={22} rx={8} fill={INK()} />
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
    <g transform="translate(-65 75) skewY(25)"><rect x={-28} y={-9} width={56} height={18} rx={4} fill={INK()} /><rect x={-9} y={-28} width={18} height={56} rx={4} fill={INK()} /></g>
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

/** The buyer's door: a pharmaceutical distributor's door with a plus sign above (the thread ties here). */
export const Door: React.FC<P & { open?: number }> = ({ open = 0, ...p }) => (
  <G {...p}>
    <rect x={-150} y={-260} width={300} height={360} rx={10} fill={PAPER()} stroke={INK()} strokeWidth={10} />
    <rect x={-110} y={-220} width={220} height={320} rx={6} fill={alpha(INK(), 0.1 + 0.5 * open)} stroke={INK()} strokeWidth={8} />
    <circle cx={70} cy={-40} r={14} fill={ACC(p.dark)} />
    <rect x={-190} y={100} width={380} height={18} rx={9} fill={INK()} />
    <g transform="translate(0 -320)"><rect x={-44} y={-44} width={88} height={88} rx={16} fill={p.dark ? C.light : INK()} /><rect x={-11} y={-30} width={22} height={60} rx={4} fill={p.dark ? INK() : PAPER()} /><rect x={-30} y={-11} width={60} height={22} rx={4} fill={p.dark ? INK() : PAPER()} /></g>
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
