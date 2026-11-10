// SPEC_LBF: Luxury by Fat (prospect #1). Idea: the wig as a luxury object; a gold strand writes the story.
// Facts: their own IG posts (origins, services, WhatsApp), retrieved 2026-11-10. No prices, no hair claims.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, Draw, EndCard, Film, Look, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#0B0A09", bg2: "#211C15", ink: "#F6EFE3", dim: "#A89A83", accent: "#D9B56B", accent2: "#F3E3BF", card: "#1A1612",
  display: "Playfair Display", displayWeight: 600, italicAccent: true };
export const LBF_FRAMES = fr(24);

const wave = (x0: number, x1: number, y: number, amp: number, n: number, phase = 0) => {
  let d = `M ${x0} ${y}`;
  for (let i = 1; i <= 80; i++) { const x = x0 + ((x1 - x0) * i) / 80; d += ` L ${x.toFixed(1)} ${(y + amp * Math.sin((i / 80) * n * Math.PI * 2 + phase)).toFixed(1)}`; }
  return d;
};

const Strand: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(f, 0, fr(2.4));
  const ph = f / 18;
  return (
    <Svg>
      {[0, 1, 2].map((i) => <Draw key={i} d={wave(-40, 1120, 1180 + i * 26, 70 - i * 12, 2.2, ph + i * 0.6)} k={k - i * 0.08} len={1700} stroke={i ? "#8C7442" : "#D9B56B"} w={i ? 3 : 6} />)}
    </Svg>
  );
};

const curl = (cx: number, cy: number) => { let d = ""; for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 6; const r = 6 + i * 0.75; d += `${i ? "L" : "M"} ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} `; } return d; };
const ORIGINS = [
  { t: "Burmese", s: "curly", icon: (x: number, y: number) => curl(x, y) },
  { t: "Indian", s: "baby curly · glueless", icon: (x: number, y: number) => wave(x - 50, x + 50, y, 16, 2.5) },
  { t: "Vietnamese", s: "raw", icon: (x: number, y: number) => `M ${x - 50} ${y - 22} L ${x + 50} ${y - 22} M ${x - 50} ${y} L ${x + 50} ${y} M ${x - 50} ${y + 22} L ${x + 50} ${y + 22}` },
];
const Origins: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Type at={0.1} y={330} size={84} lines={["Trois origines.", { t: "_Une_ _seule_ *exigence.*", size: 96 }]} />
      {ORIGINS.map((o, i) => {
        const p = ease(f, fr(0.7 + i * 0.45), fr(1.4 + i * 0.45));
        const y = 790 + i * 250;
        return (
          <div key={o.t} style={{ position: "absolute", left: 150, top: y, width: 780, height: 200, borderRadius: 28, border: "2px solid #D9B56B", background: "#16130F",
            opacity: p, transform: `translateX(${(1 - p) * 300}px)`, display: "flex", alignItems: "center" }}>
            <svg width={200} height={200}><path d={o.icon(100, 100)} fill="none" stroke="#D9B56B" strokeWidth={5} strokeLinecap="round" /></svg>
            <div>
              <div style={{ fontFamily: "Playfair Display", fontSize: 70, fontWeight: 600, color: "#F6EFE3" }}>{o.t}</div>
              <div style={{ fontSize: 36, color: "#A89A83", fontWeight: 600, marginTop: 4 }}>{o.s}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

const Stamps: React.FC = () => {
  const f = useCurrentFrame();
  const W3 = ["Raw.", "Naturel.", "Durable."];
  return (
    <>
      {W3.map((w, i) => {
        const at = fr(0.3 + i * 0.75);
        const p = pop(f, at, 13);
        const sc = 1.7 - 0.7 * Math.min(1, p);
        return (
          <div key={w} style={{ position: "absolute", top: 620 + i * 250, width: 1080, textAlign: "center", fontFamily: "Playfair Display", fontStyle: "italic", fontWeight: 700,
            fontSize: 170, color: i === 2 ? "#D9B56B" : "#F6EFE3", opacity: lin(f, at, at + 5), transform: `scale(${sc})` }}>{w}</div>
        );
      })}
    </>
  );
};

const Thread: React.FC = () => {
  const f = useCurrentFrame();
  const STEPS = ["Pose", "Confection", "Livraison"];
  const k = ease(f, fr(0.3), fr(2.6));
  return (
    <>
      <Type at={0.1} y={300} size={88} lines={["On s'occupe", "*de tout.*"]} />
      <Svg><Draw d="M 300 760 L 300 1500" k={k} len={740} stroke="#D9B56B" w={5} /></Svg>
      {STEPS.map((st, i) => {
        const at = fr(0.5 + i * 0.7);
        const p = pop(f, at, 12);
        return (
          <React.Fragment key={st}>
            <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}><circle cx={300} cy={800 + i * 330} r={30 * p} fill="#D9B56B" /></svg>
            <div style={{ position: "absolute", left: 380, top: 800 + i * 330 - 50, fontFamily: "Playfair Display", fontSize: 88, fontWeight: 600, color: "#F6EFE3",
              opacity: lin(f, at, at + 8), transform: `translateX(${(1 - Math.min(1, p)) * 60}px)` }}>{st}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const LBF: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={4.3}><Strand /><Type at={0.5} y={420} size={92} lines={["Pas une perruque."]} /><Type at={1.6} y={560} size={150} lines={["*Une* *signature.*"]} /></Scene>
    <Scene from={4.1} to={10.1}><Origins /></Scene>
    <Scene from={9.9} to={14.2}><Stamps /></Scene>
    <Scene from={14.0} to={18.2}><Thread /></Scene>
    <Scene from={18.0} to={21.2}><Type at={0.1} y={520} size={96} lines={["Votre prochain", "*modèle*", "vous attend."]} /><CallPill at={0.6} y={1080} number="07 87 81 14 00" /></Scene>
    <Scene from={21.0} to={24} fade={0.25}><AbsoluteFill><EndCard name="LUXURY BY FAT" tagline="Perruques premium · Abidjan" size={118} /></AbsoluteFill></Scene>
  </Film>
);
