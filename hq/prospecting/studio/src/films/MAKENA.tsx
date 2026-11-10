// SPEC_MAKENA: Makena Spa (prospect #3). Idea: their own promise "un monde où le temps se fige": the clock stops.
// Facts: makenaspa.net + IG bio (services, 2 Plateaux), retrieved 2026-11-10. No prices, hours, slimming or medical claims.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, Draw, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#0E2A21", bg2: "#1D4537", ink: "#F3EBDD", dim: "#A9BCAD", accent: "#D9B46C", accent2: "#9ACDB3", card: "#163A2E",
  display: "Cormorant Garamond", displayWeight: 600, italicAccent: true };
export const MAKENA_FRAMES = fr(25);

const Clock: React.FC<{ stopAt?: number }> = ({ stopAt }) => {
  const f = useCurrentFrame();
  // fast spin, then (if stopAt) decelerate to a stop over 2.4 s
  const t = f / 30;
  let a: number;
  if (stopAt === undefined) a = t * 900;
  else { const p = Math.min(1, t / 2.4); a = 3.9 * 900 + (900 * 2.4 * (1 - (1 - p) ** 3)) / 3; } // continues from the previous scene's angle
  const CX = 540, CY = 1130, R = 270;
  return (
    <Svg>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#D9B46C" strokeWidth={5} />
      {Array.from({ length: 12 }).map((_, i) => { const g = (i / 12) * Math.PI * 2; return <line key={i} x1={CX + Math.cos(g) * (R - 26)} y1={CY + Math.sin(g) * (R - 26)} x2={CX + Math.cos(g) * (R - 6)} y2={CY + Math.sin(g) * (R - 6)} stroke="#D9B46C" strokeWidth={i % 3 ? 3 : 7} />; })}
      <line x1={CX} y1={CY} x2={CX} y2={CY - 150} stroke="#F3EBDD" strokeWidth={10} strokeLinecap="round" transform={`rotate(${a / 12} ${CX} ${CY})`} />
      <line x1={CX} y1={CY} x2={CX} y2={CY - 220} stroke="#D9B46C" strokeWidth={5} strokeLinecap="round" transform={`rotate(${a} ${CX} ${CY})`} />
      <circle cx={CX} cy={CY} r={14} fill="#D9B46C" />
    </Svg>
  );
};

// Thin-line icons for the four rituals.
const ICONS: Record<string, string> = {
  Massage: "M -70 30 Q 0 -10 70 30 M -60 50 Q 0 15 60 50 M -40 -40 a 22 22 0 1 0 0.1 0 M 10 -20 Q 40 -60 70 -30",
  Hammam: "M -40 50 Q -60 0 -40 -30 Q -20 -60 -40 -90 M 0 50 Q -20 0 0 -30 Q 20 -60 0 -90 M 40 50 Q 20 0 40 -30 Q 60 -60 40 -90",
  "Soin visage": "M 0 -90 C -70 -90 -75 -10 -60 30 C -45 70 -20 90 0 90 C 20 90 45 70 60 30 C 75 -10 70 -90 0 -90 M -30 -10 L -14 -10 M 14 -10 L 30 -10 M -20 40 Q 0 54 20 40",
  Gommage: "M -60 -40 a 10 10 0 1 0 0.1 0 M -10 -70 a 8 8 0 1 0 0.1 0 M 40 -30 a 12 12 0 1 0 0.1 0 M -40 20 a 7 7 0 1 0 0.1 0 M 20 30 a 10 10 0 1 0 0.1 0 M 60 60 a 6 6 0 1 0 0.1 0 M -10 70 a 9 9 0 1 0 0.1 0",
};
const Rituals: React.FC = () => {
  const f = useCurrentFrame();
  const names = Object.keys(ICONS);
  return (
    <>
      <Type at={0.1} y={300} size={110} lines={["Vos *rituels.*"]} />
      {names.map((n, i) => {
        const x = i % 2 ? 760 : 320, y = 900 + Math.floor(i / 2) * 420;
        const k = ease(f, fr(0.5 + i * 0.55), fr(1.6 + i * 0.55));
        const br = 1 + 0.04 * Math.sin(f / 14 + i);
        return (
          <React.Fragment key={n}>
            <Svg><circle cx={x} cy={y} r={150 * br} fill="#163A2E" stroke="#D9B46C" strokeWidth={2} opacity={k} />
              <g transform={`translate(${x} ${y}) scale(${1.1 * br})`}><Draw d={ICONS[n]} k={k} len={900} stroke="#D9B46C" w={5} /></g></Svg>
            <div style={{ position: "absolute", left: x - 220, width: 440, top: y + 170, textAlign: "center", fontFamily: "Cormorant Garamond", fontWeight: 600, fontSize: 58, color: "#F3EBDD", opacity: k }}>{n}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

const Breath: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const inhale = t < 2 ? ease(f, 0, fr(2)) : 1 - ease(f, fr(2), fr(4));
  const r = 160 + 190 * inhale;
  return (
    <>
      <Type at={0.1} y={300} size={120} lines={["*Respirez.*"]} />
      <Svg>
        {[1.35, 1.18, 1].map((m, i) => <circle key={i} cx={540} cy={1130} r={r * m} fill="#9ACDB3" opacity={0.08 + i * 0.1} />)}
        <circle cx={540} cy={1130} r={r} fill="none" stroke="#D9B46C" strokeWidth={4} />
      </Svg>
      <div style={{ position: "absolute", top: 1090, width: 1080, textAlign: "center", fontFamily: "Cormorant Garamond", fontStyle: "italic", fontWeight: 600, fontSize: 70, color: "#F3EBDD" }}>
        {t < 2 ? "Inspirez…" : "Expirez."}
      </div>
    </>
  );
};

export const MAKENA: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={4.1}><Clock /><Type at={0.3} y={360} size={110} lines={["Abidjan", "va vite…"]} /></Scene>
    <Scene from={3.9} to={8.6} fade={0.15}><Clock stopAt={0} /><Type at={1.2} y={330} size={104} lines={["Ici,", "*le* *temps* *se* *fige.*"]} /></Scene>
    <Scene from={8.4} to={15.6}><Rituals /></Scene>
    <Scene from={15.4} to={19.6}><Breath /></Scene>
    <Scene from={19.4} to={22.2}><Pin at={0.1} y={900} title="Les 2 Plateaux" sub="Cocody · Abidjan" /><CallPill at={0.8} y={1300} wa={false} number="07 68 41 60 61" /></Scene>
    <Scene from={22.0} to={25} fade={0.25}><AbsoluteFill><EndCard name="MAKENA SPA" tagline="Massages · Hammam · Soins · Abidjan" size={132} /></AbsoluteFill></Scene>
  </Film>
);
