// SPEC_MARIACILE: Pâtisserie Maria Cile (prospect #4). Idea: "quand l'art défie la gravité": tiers stack, the top one floats.
// Facts: IG posts (Gravity Wedding Cake 7 Jul 2026; occasions; trainings 2 Jul 2026; WhatsApp commandes). No prices, no records.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, Chip, EndCard, Film, Look, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#FBF6F0", bg2: "#F7E5DE", ink: "#3B2A22", dim: "#A08A7E", accent: "#C29A52", accent2: "#D98E86", card: "#FFFFFF",
  display: "DM Serif Display", displayWeight: 400, italicAccent: true };
export const MARIACILE_FRAMES = fr(26.5);

const TIERS = [{ w: 560, h: 190, c: "#FFFFFF" }, { w: 430, h: 170, c: "#FDF1EC" }, { w: 310, h: 150, c: "#FFFFFF" }];
const Cake: React.FC<{ build: boolean }> = ({ build }) => {
  const f = useCurrentFrame();
  const base = 1560;
  const stand = ease(f, 0, fr(0.8));
  const lift = build ? ease(f, fr(4.4), fr(5.6)) : 0;
  const bob = build ? Math.sin(f / 13) * 10 * lift : 0;
  let y = base - 40;
  return (
    <Svg>
      <g opacity={stand}>
        <rect x={540 - 340 * stand} y={base - 40} width={680 * stand} height={26} rx={13} fill="#E7D6C6" />
        <path d={`M 500 ${base - 14} L 580 ${base - 14} L 600 ${base + 120} L 480 ${base + 120} Z`} fill="#E7D6C6" />
        <rect x={420} y={base + 110} width={240} height={22} rx={11} fill="#DCC7B4" />
      </g>
      {TIERS.map((t, i) => {
        const at = fr(0.6 + i * 0.9);
        const p = build ? pop(f, at, 13) : 1;
        const top = y - t.h;
        y = top;
        const float = i === 2 ? -150 * lift + bob : 0;
        const dropY = (1 - Math.min(1, p)) * -900;
        const beads = build ? ease(f, at + 8, at + 30) : 1;
        return (
          <g key={i} transform={`translate(0 ${dropY + float})`} opacity={lin(f, at, at + 4) || (build ? 0 : 1)}>
            <rect x={540 - t.w / 2} y={top} width={t.w} height={t.h} rx={14} fill={t.c} stroke="#EAD9CC" strokeWidth={3} />
            <rect x={540 - t.w / 2} y={top + t.h * 0.42} width={t.w} height={16} fill="#C29A52" opacity={0.9} />
            {Array.from({ length: Math.floor(t.w / 34) }).map((_, j) => (j / Math.floor(t.w / 34) < beads ? <circle key={j} cx={540 - t.w / 2 + 17 + j * 34} cy={top + t.h - 6} r={10} fill="#F3E6DC" stroke="#E2CDBE" strokeWidth={2} /> : null))}
            {i === 2 && <path d={`M 540 ${top - 70} c -30 -40 -80 -10 -50 30 l 50 40 l 50 -40 c 30 -40 -20 -70 -50 -30 z`} fill="#D98E86" opacity={build ? ease(f, fr(3.1), fr(3.6)) : 1} />}
          </g>
        );
      })}
      {lift > 0 && Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2 + f / 30;
        return <circle key={i} cx={540 + Math.cos(a) * 230} cy={1080 - 150 * lift + Math.sin(a) * 40} r={6 + 3 * Math.sin(f / 6 + i)} fill="#C29A52" opacity={0.8 * lift} />;
      })}
    </Svg>
  );
};

const Occasions: React.FC = () => {
  const f = useCurrentFrame();
  const O = ["Mariage", "Baptême", "Anniversaire"];
  return (
    <>
      <Type at={0.1} y={300} size={96} lines={["Pour vos", "*grands* *jours.*"]} />
      {O.map((o, i) => {
        const p = ease(f, fr(0.6 + i * 0.6), fr(1.4 + i * 0.6));
        return (
          <div key={o} style={{ position: "absolute", top: 820 + i * 260, left: 140, width: 800, height: 190, borderRadius: 95, background: i === 1 ? "#D98E86" : "#C29A52",
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Serif Display", fontSize: 92, color: "#FFFFFF",
            transform: `translateX(${(i % 2 ? 1 : -1) * (1 - p) * 900}px) rotate(${(i - 1) * -2}deg)` }}>{o}</div>
        );
      })}
    </>
  );
};

export const MARIACILE: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop cy={60} />
    <Scene from={0} to={3.6}><Cake build={false} /><Type at={0.3} y={300} size={92} lines={["Et si un gâteau…"]} /><Type at={1.4} y={430} size={118} lines={["*défiait* *la* *gravité ?*"]} /></Scene>
    <Scene from={3.4} to={12.4}><Cake build /><Type at={0.2} out={3.6} y={300} size={96} lines={["Étage", "*par* *étage.*"]} /><Type at={4.3} y={300} size={96} lines={["Quand l'art", "*défie* *la* *gravité.*"]} /></Scene>
    <Scene from={12.2} to={17.0}><Occasions /></Scene>
    <Scene from={16.8} to={20.6}><Type at={0.1} y={620} size={110} lines={["Créé", "*sur* *mesure,*", "à Abidjan."]} /><Chip at={1.4} x={540} y={1300} text="Formations Gravity Cake" size={46} /></Scene>
    <Scene from={20.4} to={23.6}><CallPill at={0.2} y={900} label="Commandes" number="05 86 00 22 03" /></Scene>
    <Scene from={23.4} to={26.5} fade={0.25}><AbsoluteFill><EndCard name="Maria Cile" tagline="Pâtisserie · Cake design · Abidjan" size={150} /></AbsoluteFill></Scene>
  </Film>
);
