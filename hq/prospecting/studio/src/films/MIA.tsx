// SPEC_MIA: Mia Institut (prospect #7). Idea: their own hook "batterie à 0%… un soin et c'est reparti pour 100%".
// Facts: IG bio (ongles nude, soins glowy, regard de biche; éclat au quotidien), IG reels (avec ou sans RDV), Maps (Angré). No treatment claims.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, lin, mix } from "../kit";

const LOOK: Look = { bg: "#F4ECE4", bg2: "#FFFFFF", ink: "#2E2724", dim: "#9C8F86", accent: "#DE4A3C", accent2: "#C9A98F", card: "#FFFFFF",
  display: "Jost", displayWeight: 500, upper: true, tracking: 4 };
export const MIA_FRAMES = fr(23);

const STEPS = [{ n: "Soin glowy", v: 0.25 }, { n: "Regard de biche", v: 0.5 }, { n: "Ongles nude", v: 0.75 }, { n: "Éclat", v: 1 }];
const Battery: React.FC<{ charge: boolean }> = ({ charge }) => {
  const f = useCurrentFrame();
  let v = 0;
  if (charge) STEPS.forEach((st, i) => { const at = fr(0.6 + i * 2.1); v = mix(v, st.v, ease(f, at, at + 18)); });
  const blink = !charge ? (Math.floor(f / 10) % 2 ? 1 : 0.25) : 1;
  const X = 250, Y = 940, BW = 520, BH = 260;
  const col = v < 0.3 ? "#DE4A3C" : v < 0.99 ? "#C9A98F" : "#2E2724";
  return (
    <>
      <Svg>
        <rect x={X} y={Y} width={BW} height={BH} rx={44} fill="#FFFFFF" stroke="#2E2724" strokeWidth={10} />
        <rect x={X + BW + 10} y={Y + BH / 2 - 50} width={40} height={100} rx={14} fill="#2E2724" />
        <rect x={X + 22} y={Y + 22} width={Math.max(26, (BW - 44) * v)} height={BH - 44} rx={26} fill={col} opacity={charge ? 1 : blink} />
      </Svg>
      <div style={{ position: "absolute", top: Y + BH + 60, width: 1080, textAlign: "center", fontFamily: "Jost", fontWeight: 600, fontSize: 150, color: "#2E2724" }}>{Math.round(v * 100)}%</div>
    </>
  );
};

const Charge: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Battery charge />
      {STEPS.map((st, i) => {
        const at = 0.5 + i * 2.1;
        return <Type key={st.n} at={at} out={i < STEPS.length - 1 ? at + 1.9 : undefined} y={330} size={st.v === 1 ? 140 : 104} lines={[st.v === 1 ? "*Rechargée.*" : `*${st.n}*`]} />;
      })}
      <div style={{ position: "absolute", top: 1560, width: 1080, textAlign: "center", fontSize: 40, color: "#9C8F86", fontWeight: 600, opacity: lin(f, 0, 10) }}>
        Un soin, et c'est reparti.
      </div>
    </>
  );
};

const Sparkles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Svg>{Array.from({ length: 14 }).map((_, i) => {
      const a = (i / 14) * Math.PI * 2, d = 120 + 260 * ease(f, fr(0.2), fr(1.4));
      const x = 540 + Math.cos(a) * d * 1.4, y = 1180 + Math.sin(a) * d, s = 0.6 + 0.4 * Math.sin(f / 6 + i);
      return <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M 0 -30 L 7 -7 L 30 0 L 7 7 L 0 30 L -7 7 L -30 0 L -7 -7 Z" fill={i % 2 ? "#DE4A3C" : "#C9A98F"} />;
    })}</Svg>
  );
};

export const MIA: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={3.4}><Battery charge={false} /><Type at={0.3} y={360} size={110} lines={["Batterie", "*à* *plat* *?*"]} /></Scene>
    <Scene from={3.2} to={12.6} fade={0.15}><Charge /></Scene>
    <Scene from={12.4} to={16.2}><Sparkles /><Type at={0.2} y={1000} size={96} lines={["Révélez", "*votre* *éclat*", "au quotidien."]} /></Scene>
    <Scene from={16.0} to={19.6}><Type at={0.1} y={380} size={84} lines={["Avec ou sans", "*rendez-vous.*"]} /><Pin at={0.5} y={1180} title="Angré" sub="Cocody · Abidjan" /></Scene>
    <Scene from={19.4} to={23} fade={0.25}><AbsoluteFill><EndCard name="Mia Institut" tagline="Soins · Regard · Ongles" size={130} /></AbsoluteFill><CallPill at={0.9} y={1330} number="01 02 62 21 12" /></Scene>
  </Film>
);
