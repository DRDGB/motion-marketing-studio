// SPEC_CLOCHETTE: Clochette Onglerie (prospect #8). Idea: their line "Le temps passe… le style reste" + a living colour palette.
// Facts: IG bio (excellence de l'onglerie, hours, Zone 4 opposite Pikado, infoline) + IG caption ("le temps passe… le style reste"). No prices.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, pop } from "../kit";

const LOOK: Look = { bg: "#FBE8EC", bg2: "#FFFFFF", ink: "#151515", dim: "#8E7E84", accent: "#D63B74", accent2: "#9AA1AD", card: "#FFFFFF",
  display: "Unbounded", displayWeight: 700, tracking: -1 };
export const CLOCHETTE_FRAMES = fr(24);

const Bell: React.FC = () => {
  const f = useCurrentFrame();
  const sw = 22 * Math.sin(f / 4) * Math.exp(-f / 50);
  return (
    <Svg>
      {[0, 1, 2].map((i) => { const r = ((f + i * 14) % 42) / 42; return <circle key={i} cx={540} cy={1150} r={180 + 220 * r} fill="none" stroke="#D63B74" strokeWidth={4} opacity={0.5 * (1 - r)} />; })}
      <g transform={`rotate(${sw} 540 930)`}>
        <path d="M 540 930 C 430 930 410 1030 405 1130 C 400 1210 370 1240 340 1270 L 740 1270 C 710 1240 680 1210 675 1130 C 670 1030 650 930 540 930 Z" fill="#D63B74" />
        <circle cx={540} cy={918} r={22} fill="#151515" />
        <circle cx={540 + sw * 1.5} cy={1300} r={34} fill="#151515" />
      </g>
    </Svg>
  );
};

const COLS = [
  { c: "#E9C3AE", n: "Nude" }, { c: "#B5122C", n: "Rouge" }, { c: "#F6D6DC", n: "French", tip: true }, { c: "#151515", n: "Nail art", dots: true }, { c: "#C7CBD3", n: "Chrome" },
];
const Nail: React.FC<{ x: number; y: number; k: number; c: string; tip?: boolean; dots?: boolean }> = ({ x, y, k, c, tip, dots }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -60 90 L -60 -40 C -60 -110 60 -110 60 -40 L 60 90 Z" fill="#FFFFFF" stroke="#E6CFD5" strokeWidth={4} />
    <clipPath id={`n${x}${y}`}><path d="M -60 90 L -60 -40 C -60 -110 60 -110 60 -40 L 60 90 Z" /></clipPath>
    <g clipPath={`url(#n${x}${y})`}>
      <rect x={-60} y={90 - 200 * k} width={120} height={200} fill={c} />
      {tip && <rect x={-60} y={-110} width={120} height={50 * k} fill="#FFFFFF" />}
      {dots && k > 0.9 && [[-25, -30], [20, 0], [-10, 40], [28, -50]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={9} fill="#D63B74" />)}
      <rect x={-40} y={-60} width={14} height={110} rx={7} fill="#FFFFFF" opacity={0.35 * k} />
    </g>
  </g>
);
const Palette: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Svg>{Array.from({ length: 10 }).map((_, i) => {
        const col = COLS[i % 5], at = fr(0.5 + i * 0.32);
        return <Nail key={i} x={160 + (i % 5) * 190} y={i < 5 ? 980 : 1330} k={ease(f, at, at + 14)} c={col.c} tip={col.tip} dots={col.dots} />;
      })}</Svg>
      <Type at={0.1} y={300} size={86} lines={["Nude, rouge,", "french, *nail* *art…*"]} />
      <Type at={3.6} y={1560} size={56} font="text" lines={["_Votre_ _style,_ *votre* *couleur.*"]} />
    </>
  );
};

const Time: React.FC = () => {
  const f = useCurrentFrame();
  const a = f * 14;
  return (
    <>
      <Svg>
        <circle cx={360} cy={1150} r={210} fill="#FFFFFF" stroke="#151515" strokeWidth={8} />
        <line x1={360} y1={1150} x2={360} y2={1010} stroke="#151515" strokeWidth={10} strokeLinecap="round" transform={`rotate(${a / 12} 360 1150)`} />
        <line x1={360} y1={1150} x2={360} y2={980} stroke="#D63B74" strokeWidth={6} strokeLinecap="round" transform={`rotate(${a} 360 1150)`} />
        <circle cx={360} cy={1150} r={14} fill="#151515" />
        <g transform={`translate(780 1150) scale(${1.4 * pop(f, fr(1.6), 12)})`}><Nail x={0} y={0} k={1} c="#B5122C" /></g>
        {Array.from({ length: 4 }).map((_, i) => { const t = (f / 30 + i * 0.5) % 2; return <path key={i} transform={`translate(${720 + i * 40} ${1000 + (i % 2) * 260}) scale(${0.3 + 0.5 * Math.sin(t * Math.PI / 2)})`} d="M 0 -30 L 7 -7 L 30 0 L 7 7 L 0 30 L -7 7 L -30 0 L -7 -7 Z" fill="#D63B74" />; })}
      </Svg>
      <Type at={0.2} y={300} size={76} lines={["Le temps passe…"]} />
      <Type at={1.6} y={500} size={104} lines={["*le* *style* *reste.*"]} />
    </>
  );
};

const Hours: React.FC = () => (
  <>
    <Type at={0.1} y={560} size={300} lines={["*7j/7*"]} />
    <Type at={0.7} y={1010} size={60} font="text" lines={["Lun – Sam · 9h – 19h30", "Dim · 11h – 19h30"]} stagger={0.05} />
  </>
);

export const CLOCHETTE: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={3.6}><Bell /><Type at={0.6} y={330} size={100} lines={["L'excellence", "*de* *l'onglerie.*"]} /></Scene>
    <Scene from={3.4} to={10.8}><Palette /></Scene>
    <Scene from={10.6} to={14.8}><Time /></Scene>
    <Scene from={14.6} to={18.0}><Hours /></Scene>
    <Scene from={17.8} to={21.0}><Pin at={0.1} y={820} title="Zone 4 · Rue Paul Langevin" sub="En face de Pikado" /><CallPill at={0.9} y={1250} wa={false} number="07 78 34 78 34" /></Scene>
    <Scene from={20.8} to={24} fade={0.25}><AbsoluteFill><EndCard name="Clochette" tagline="Nail bar · Abidjan" size={150} /></AbsoluteFill></Scene>
  </Film>
);
