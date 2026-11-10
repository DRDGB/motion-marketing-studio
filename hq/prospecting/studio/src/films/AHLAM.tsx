// SPEC_AHLAM: Pâtisserie Ahlam (prospect #9). Idea: their 5-step order process, each step adds a cake layer (pinnable).
// Facts: IG reel 15 Oct 2026 (the 5 details to send on WhatsApp), reels Oct–Nov 2026 (personalised kids' cakes). No licensed characters.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, EndCard, Film, Look, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#FFF7EC", bg2: "#E5F7F0", ink: "#1E2A4A", dim: "#7C86A2", accent: "#FF5D8A", accent2: "#FFB703", card: "#FFFFFF",
  display: "Fredoka", displayWeight: 600 };
export const AHLAM_FRAMES = fr(25);

const Balloons: React.FC = () => {
  const f = useCurrentFrame();
  const C = ["#FF5D8A", "#FFB703", "#3CCFA7", "#6C8CFF", "#FF5D8A"];
  return (
    <Svg>{C.map((c, i) => {
      const y = 1900 - ((f * (5 + i)) % 1500) * ease(f, 0, 20) - i * 60, x = 140 + i * 200 + 20 * Math.sin(f / 15 + i);
      return <g key={i}><path d={`M ${x} ${y + 95} q 12 60 -6 130`} stroke="#1E2A4A" strokeWidth={3} fill="none" opacity={0.4} /><ellipse cx={x} cy={y} rx={70} ry={88} fill={c} /><ellipse cx={x - 22} cy={y - 30} rx={14} ry={22} fill="#FFFFFF" opacity={0.5} /></g>;
    })}</Svg>
  );
};

const STEPS = ["Ton modèle", "Ta date", "Ton parfum", "Le nombre de parts", "Le prénom à écrire"];
const LAYER = ["#3CCFA7", "#FF5D8A", "#FFB703", "#6C8CFF", "#FFFFFF"];
const Steps: React.FC = () => {
  const f = useCurrentFrame();
  const base = 1620;
  return (
    <>
      <Svg>
        <rect x={250} y={base} width={580} height={30} rx={15} fill="#1E2A4A" opacity={0.15} />
        {STEPS.map((_, i) => {
          const at = fr(0.6 + i * 2.4);
          const p = pop(f, at, 12);
          const w = 520 - i * 56, h = 110, y = base - (i + 1) * h;
          return (
            <g key={i} transform={`translate(0 ${(1 - Math.min(1, p)) * -700})`} opacity={lin(f, at, at + 3)}>
              <rect x={540 - w / 2} y={y} width={w} height={h} rx={22} fill={LAYER[i]} stroke="#1E2A4A" strokeWidth={4} />
              {Array.from({ length: Math.floor(w / 60) }).map((__, j) => <path key={j} d={`M ${540 - w / 2 + 30 + j * 60} ${y} q 15 26 30 0`} fill="#FFFFFF" opacity={0.85} />)}
            </g>
          );
        })}
      </Svg>
      {STEPS.map((st, i) => {
        const at = 0.5 + i * 2.4;
        const k = ease(f, fr(at), fr(at) + 10);
        const o = i < STEPS.length - 1 ? 1 - ease(f, fr(at + 2.2), fr(at + 2.2) + 8) : 1;
        return (
          <div key={st} style={{ position: "absolute", top: 330, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: k * o, transform: `translateY(${(1 - k) * 40}px)` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: LAYER[i] === "#FFFFFF" ? "#FF5D8A" : LAYER[i], display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Fredoka", fontWeight: 700, fontSize: 90, color: "#FFFFFF", border: "5px solid #1E2A4A" }}>{i + 1}</div>
            <div style={{ fontFamily: "Fredoka", fontWeight: 600, fontSize: 92, color: "#1E2A4A", marginTop: 30, textAlign: "center", padding: "0 60px" }}>{st}</div>
          </div>
        );
      })}
    </>
  );
};

const Candles: React.FC = () => {
  const f = useCurrentFrame();
  const name = "JAD";
  const shown = Math.floor(ease(f, fr(0.8), fr(1.8)) * name.length + 0.001);
  return (
    <>
      <Svg>
        {[0, 1, 2, 3, 4].map((i) => { const w = 520 - i * 56, y = 1620 - (i + 1) * 110; return <rect key={i} x={540 - w / 2} y={y} width={w} height={110} rx={22} fill={LAYER[i]} stroke="#1E2A4A" strokeWidth={4} />; })}
        {[-90, 0, 90].map((dx, i) => {
          const fl = pop(f, fr(0.2 + i * 0.15), 9);
          return <g key={i}><rect x={540 + dx - 12} y={980} width={24} height={90} rx={8} fill={i === 1 ? "#FF5D8A" : "#6C8CFF"} />
            <ellipse cx={540 + dx} cy={960 + 3 * Math.sin(f / 3 + i)} rx={16 * fl} ry={30 * fl} fill="#FFB703" /><ellipse cx={540 + dx} cy={966} rx={7 * fl} ry={14 * fl} fill="#FFFFFF" /></g>;
        })}
        <text x={540} y={1150} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={80} fill="#FF5D8A">{name.slice(0, shown)}</text>
      </Svg>
      <div style={{ position: "absolute", top: 1660, width: 1080, textAlign: "center", fontSize: 34, color: "#7C86A2", fontWeight: 600 }}>Exemple</div>
      <Type at={0.1} y={330} size={96} lines={["Le thème", "*de* *ton* *choix.*"]} />
    </>
  );
};

export const AHLAM: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop cy={65} />
    <Scene from={0} to={4.0}><Balloons /><Type at={0.3} y={520} size={92} lines={["Ton petit héros", "a un anniversaire ?"]} /><Type at={1.8} y={800} size={108} lines={["*On* *s'occupe*", "*du* *gâteau.*"]} /></Scene>
    <Scene from={3.8} to={16.4}><Steps /></Scene>
    <Scene from={16.2} to={19.8}><Candles /></Scene>
    <Scene from={19.6} to={22.2}><CallPill at={0.2} y={880} label="Commande sur WhatsApp" number="01 02 51 51 51" /></Scene>
    <Scene from={22.0} to={25} fade={0.25}><AbsoluteFill><EndCard name="Pâtisserie Ahlam" tagline="Gâteaux personnalisés · Abidjan" size={124} /></AbsoluteFill></Scene>
  </Film>
);
