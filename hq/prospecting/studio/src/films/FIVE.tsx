// SPEC_FIVE: Le Five Abidjan (prospect #10). Idea: their concept "Scène & Assiette": curtain up on a theatre programme.
// Facts: IG bio (Scène & Assiette, French & Mediterranean, reservations), reels May–Jul 2026 (lunch formulas Mon–Fri, wine reserve). No award claim.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, lin } from "../kit";

const LOOK: Look = { bg: "#0B1325", bg2: "#1C2742", ink: "#F5EBDD", dim: "#A9A194", accent: "#C9A45C", accent2: "#9B1F31", card: "#16203A",
  display: "Cinzel", displayWeight: 600, tracking: 2 };
export const FIVE_FRAMES = fr(24.5);

const Spot: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(f, 0, fr(1.2));
  return (
    <Svg>
      <defs>
        <radialGradient id="cone" cx="50%" cy="0%" r="100%"><stop offset="0%" stopColor="#FFF3D6" stopOpacity={0.55 * k} /><stop offset="100%" stopColor="#FFF3D6" stopOpacity={0} /></radialGradient>
      </defs>
      <path d="M 470 0 L 610 0 L 900 1480 L 180 1480 Z" fill="url(#cone)" />
      <ellipse cx={540} cy={1480} rx={360 * k} ry={70 * k} fill="#FFF3D6" opacity={0.25} />
      <rect x={0} y={1520} width={1080} height={400} fill="#120C0A" opacity={0.6} />
    </Svg>
  );
};

const Curtain: React.FC = () => {
  const f = useCurrentFrame();
  const open = ease(f, fr(0.4), fr(2.0));
  const plate = ease(f, fr(1.2), fr(2.2));
  const panel = (side: number) => {
    const x = side < 0 ? -540 * open : 540 + 540 * open;
    return (
      <g transform={`translate(${x} 0)`}>
        <rect x={0} y={0} width={540} height={1920} fill="#9B1F31" />
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={i * 90} y={0} width={45} height={1920} fill="#7E1726" opacity={0.7} />)}
        <rect x={side < 0 ? 500 : 0} y={0} width={40} height={1920} fill="#C9A45C" opacity={0.6} />
      </g>
    );
  };
  return (
    <>
      <Svg>
        <g opacity={plate} transform={`translate(540 1180) scale(${0.85 + 0.15 * plate})`}>
          <circle r={300} fill="#F5EBDD" /><circle r={300} fill="none" stroke="#C9A45C" strokeWidth={10} /><circle r={225} fill="none" stroke="#E2D4BF" strokeWidth={3} />
          <path d="M -60 20 Q 0 -60 70 10 Q 20 50 -60 20 Z" fill="#8A4B2A" /><circle cx={-20} cy={-20} r={10} fill="#5E8C4A" /><circle cx={30} cy={-30} r={8} fill="#5E8C4A" />
        </g>
        {panel(-1)}{panel(1)}
        <rect x={0} y={0} width={1080} height={120} fill="#7E1726" />
        <rect x={0} y={110} width={1080} height={14} fill="#C9A45C" />
      </Svg>
      <Type at={1.4} y={300} size={130} lines={["*Scène*", "& Assiette."]} />
    </>
  );
};

const ACTS = [{ a: "Acte I", t: "Le déjeuner", s: "Formules du lundi au vendredi" }, { a: "Acte II", t: "Le dîner", s: "Tous les soirs" }, { a: "Acte III", t: "La cave", s: "Une réserve de vins choisis" }];
const Programme: React.FC = () => {
  const f = useCurrentFrame();
  const card = ease(f, 0, fr(0.6));
  return (
    <>
      <div style={{ position: "absolute", left: 130, top: 300, width: 820, height: 1300, background: "#F5EBDD", borderRadius: 12, border: "6px double #C9A45C",
        opacity: card, transform: `translateY(${(1 - card) * 80}px)` }} />
      <div style={{ position: "absolute", top: 380, width: 1080, textAlign: "center", fontFamily: "Cinzel", fontWeight: 700, fontSize: 74, color: "#0B1325", letterSpacing: 6, opacity: card }}>Programme</div>
      <div style={{ position: "absolute", left: 390, top: 490, width: 300, height: 4, background: "#C9A45C", opacity: card }} />
      {ACTS.map((x, i) => {
        const at = fr(0.8 + i * 1.6);
        const k = ease(f, at, at + 14);
        return (
          <div key={x.a} style={{ position: "absolute", top: 600 + i * 320, width: 1080, textAlign: "center", opacity: k, clipPath: `inset(0 ${(1 - k) * 100}% 0 0)` }}>
            <div style={{ fontFamily: "Cinzel", fontSize: 40, color: "#9B1F31", fontWeight: 700, letterSpacing: 8 }}>{x.a}</div>
            <div style={{ fontFamily: "Cinzel", fontSize: 76, color: "#0B1325", fontWeight: 600, marginTop: 8 }}>{x.t}</div>
            <div style={{ fontSize: 36, color: "#6E655B", fontWeight: 600, marginTop: 10 }}>{x.s}</div>
          </div>
        );
      })}
    </>
  );
};

export const FIVE: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop cy={30} />
    <Scene from={0} to={3.6}><Spot /><Type at={0.6} y={560} size={96} lines={["Ce soir,", "*à* *l'affiche…*"]} /></Scene>
    <Scene from={3.4} to={7.8}><Curtain /></Scene>
    <Scene from={7.6} to={14.4}><Programme /></Scene>
    <Scene from={14.2} to={17.6}><Type at={0.1} y={640} size={104} lines={["Cuisine", "*française*", "& méditerranéenne."]} /></Scene>
    <Scene from={17.4} to={21.2}><Pin at={0.1} y={820} title="Rue des Jardins" sub="II Plateaux · Cocody" /><CallPill at={0.9} y={1250} wa={false} number="07 09 08 88 08" /></Scene>
    <Scene from={21.0} to={24.5} fade={0.25}><AbsoluteFill><EndCard name="Le Five" tagline="Scène & Assiette · Abidjan" size={170} /></AbsoluteFill></Scene>
  </Film>
);
