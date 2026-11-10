// SPEC_ANTIKA: Madame Antika (prospect #2). Idea: the founder's journey Abidjan → Havana → back, landing on the menu.
// Facts: IG posts 25 Aug 2026 (story), 20 Aug 2026 (dishes), 26 Aug 2025 (viaje/fiesta line); Maps (address). No prices/hours.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, Draw, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#FFF4E6", bg2: "#FFE0C2", ink: "#2B1B17", dim: "#93766A", accent: "#F2542D", accent2: "#0FA3A0", card: "#FFFFFF",
  display: "Shrikhand", displayWeight: 400 };
export const ANTIKA_FRAMES = fr(27);

const Sun: React.FC = () => {
  const f = useCurrentFrame();
  const r = ease(f, 0, fr(1.6));
  return (
    <Svg>
      <circle cx={540} cy={1560 - 260 * r} r={300} fill="#F2542D" opacity={0.95} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M -20 ${1500 + i * 70} Q 270 ${1460 + i * 70 + 30 * Math.sin(f / 12 + i)} 540 ${1500 + i * 70} T 1100 ${1500 + i * 70} L 1100 1920 L -20 1920 Z`}
          fill={i % 2 ? "#0FA3A0" : "#12B5B0"} opacity={0.35 + i * 0.18} />
      ))}
    </Svg>
  );
};

const q = (p0: number[], c: number[], p1: number[], t: number) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1],
];
const Journey: React.FC = () => {
  const f = useCurrentFrame();
  const A = [790, 1330], HAV = [260, 1010];
  const C1 = [560, 700], C2 = [520, 1480];
  const go = ease(f, fr(0.6), fr(3.0));
  const back = ease(f, fr(3.6), fr(6.0));
  const t = back > 0 ? back : go;
  const [px, py] = back > 0 ? q(HAV, C2, A, back) : q(A, C1, HAV, go);
  const dir = back > 0 ? 1 : -1;
  return (
    <>
      <Svg>
        <Draw d={`M ${A[0]} ${A[1]} Q ${C1[0]} ${C1[1]} ${HAV[0]} ${HAV[1]}`} k={go} len={900} stroke="#F2542D" w={7} />
        <Draw d={`M ${HAV[0]} ${HAV[1]} Q ${C2[0]} ${C2[1]} ${A[0]} ${A[1]}`} k={back} len={820} stroke="#0FA3A0" w={7} />
        {[[A, "#F2542D"], [HAV, "#0FA3A0"]].map(([p, c], i) => <circle key={i} cx={(p as number[])[0]} cy={(p as number[])[1]} r={22} fill={c as string} />)}
        <g transform={`translate(${px} ${py}) scale(${dir} 1)`} opacity={t > 0 && t < 1 ? 1 : 0}>
          <path d="M -40 0 L 40 -6 L 52 0 L 40 6 Z M -6 -2 L 10 -34 L 22 -34 L 14 -2 Z M -6 2 L 10 34 L 22 34 L 14 2 Z M -40 -2 L -46 -16 L -36 -16 L -28 -2 Z" fill="#2B1B17" />
        </g>
      </Svg>
      <div style={{ position: "absolute", left: 610, top: 1370, fontFamily: "Shrikhand", fontSize: 56, color: "#F2542D" }}>Abidjan</div>
      <div style={{ position: "absolute", left: 120, top: 1050, fontFamily: "Shrikhand", fontSize: 56, color: "#0FA3A0", opacity: lin(f, fr(2.6), fr(3)) }}>La Havane</div>
      <Type at={0.2} out={3.3} y={300} size={86} lines={["Une femme ivoirienne.", "*Un* *rêve.*"]} />
      <Type at={3.5} y={300} size={86} lines={["Un voyage…", "*et* *un* *retour.*"]} />
    </>
  );
};

const Dish: React.FC<{ x: number; y: number; k: number; kind: number }> = ({ x, y, k, kind }) => (
  <g transform={`translate(${x} ${y}) scale(${k})`}>
    <ellipse cx={0} cy={70} rx={140} ry={34} fill="#2B1B17" opacity={0.12} />
    <ellipse cx={0} cy={40} rx={150} ry={50} fill="#FFFFFF" stroke="#E9CDB4" strokeWidth={4} />
    {kind === 0 && <>
      <path d="M -105 30 A 105 90 0 0 1 105 30 Z" fill="#E7A24A" />
      {Array.from({ length: 9 }).map((_, i) => { const a = Math.PI + (i + 0.5) * Math.PI / 9; return <circle key={i} cx={105 * Math.cos(a) * 0.98} cy={30 + 90 * Math.sin(a) * 0.98} r={9} fill="#C97E2E" />; })}
    </>}
    {kind === 1 && [-70, 0, 70].map((dx, i) => <ellipse key={i} cx={dx} cy={10 - (i === 1 ? 26 : 0)} rx={44} ry={30} fill="#C98A3E" stroke="#A86A28" strokeWidth={4} />)}
    {kind === 2 && <>
      <path d="M -110 40 Q -60 -90 0 -110 Q 60 -90 110 40 Z" fill="#6BAA3A" />
      <path d="M -36 -78 Q 0 -150 36 -78 Q 0 -60 -36 -78 Z" fill="#F2542D" />
      <circle cx={-40} cy={-10} r={10} fill="#4F8A26" /><circle cx={30} cy={-30} r={8} fill="#4F8A26" /><circle cx={50} cy={10} r={9} fill="#4F8A26" />
    </>}
  </g>
);
const Menu: React.FC = () => {
  const f = useCurrentFrame();
  const NAMES = ["Empanadas", "Croquetas", "Volcan Guacamole"];
  return (
    <>
      <Type at={0.1} y={300} size={92} lines={["Au menu,", "*Cuba* *&* *Abidjan.*"]} />
      <Svg>{NAMES.map((_, i) => <Dish key={i} x={540} y={830 + i * 330} k={pop(f, fr(0.7 + i * 0.8), 11)} kind={i} />)}</Svg>
      {NAMES.map((n, i) => (
        <div key={n} style={{ position: "absolute", left: 0, width: 1080, top: 960 + i * 330, textAlign: "center", fontFamily: "Shrikhand", fontSize: 54,
          color: i === 2 ? "#F2542D" : "#2B1B17", opacity: lin(f, fr(1.0 + i * 0.8), fr(1.3 + i * 0.8)) }}>{n}</div>
      ))}
    </>
  );
};

const Rhythm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Type at={0.1} y={330} size={90} lines={["Chaque plat", "est un *viaje.*"]} />
      <Type at={1.6} y={1450} size={90} lines={["Chaque rythme,", "une ^fiesta.^"]} />
      <Svg>{Array.from({ length: 11 }).map((_, i) => {
        const h = 60 + 220 * Math.abs(Math.sin(f / 5 + i * 0.9)) * ease(f, 0, fr(0.8));
        return <rect key={i} x={135 + i * 76} y={1100 - h / 2} width={46} height={h} rx={23} fill={i % 2 ? "#0FA3A0" : "#F2542D"} />;
      })}</Svg>
    </>
  );
};

export const ANTIKA: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop cy={40} />
    <Scene from={0} to={4.2}><Sun /><Type at={0.4} y={330} size={88} lines={["Un voyage à Cuba…"]} /><Type at={1.5} y={470} size={120} lines={["*sans* *quitter*", "*Abidjan.*"]} /></Scene>
    <Scene from={4.0} to={11.0}><Journey /></Scene>
    <Scene from={10.8} to={17.4}><Menu /></Scene>
    <Scene from={17.2} to={21.6}><Rhythm /></Scene>
    <Scene from={21.4} to={24.2}><Type at={0.1} y={420} size={92} lines={["On vous attend", "*à* *Cocody.*"]} /><Pin at={0.4} y={1180} title="Boulevard des Martyrs" sub="Cocody · Abidjan" /></Scene>
    <Scene from={24.0} to={27} fade={0.25}><AbsoluteFill><EndCard name="Madame Antika" tagline="Saveurs afro-latines · Abidjan" size={128} /></AbsoluteFill></Scene>
  </Film>
);
