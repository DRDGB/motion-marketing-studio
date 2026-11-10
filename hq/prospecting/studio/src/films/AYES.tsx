// SPEC_AYES: AYES Essentielle (prospect #5). Idea: Ivorian ingredients orbit the jar, then fall into it.
// Facts: ayesessentielle.com (tagline, made in CI, Chantilly de karité) + IG Oct 2026 (ingredients, boutique/delivery). No efficacy claims.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, EndCard, Film, Look, Scene, Svg, Type, ease, fr, lin, pop } from "../kit";

const LOOK: Look = { bg: "#FFF8F0", bg2: "#F9E5D3", ink: "#3A2A20", dim: "#9C806C", accent: "#D57D55", accent2: "#3F6B4F", card: "#FFFFFF",
  display: "Fraunces", displayWeight: 600, italicAccent: true };
export const AYES_FRAMES = fr(26);

const ING = ["Karité", "Baobab", "Coco", "Hibiscus", "Touloucouna"];
const Ingredient: React.FC<{ i: number; x: number; y: number; s: number; o?: number }> = ({ i, x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    {i === 0 && <><ellipse rx={46} ry={56} fill="#B07A45" /><ellipse cy={-30} rx={30} ry={18} fill="#E8C99B" /></>}
    {i === 1 && <><path d="M 0 -70 C 40 -70 48 40 0 70 C -48 40 -40 -70 0 -70 Z" fill="#8E9A5B" /><line y1={-70} y2={-96} stroke="#5E5A3A" strokeWidth={6} /></>}
    {i === 2 && <><circle r={58} fill="#6B4A32" /><circle r={42} fill="#F7EFE3" /><circle cx={-12} cy={-12} r={7} fill="#6B4A32" /><circle cx={12} cy={-12} r={7} fill="#6B4A32" /><circle cy={10} r={7} fill="#6B4A32" /></>}
    {i === 3 && <>{[0, 1, 2, 3, 4].map((k) => <ellipse key={k} cx={0} cy={-36} rx={28} ry={40} fill="#C8323F" transform={`rotate(${k * 72})`} />)}<circle r={14} fill="#F2C14E" /></>}
    {i === 4 && <>{[-40, 0, 40].map((r, k) => <path key={k} d="M 0 0 C 30 -30 30 -80 0 -100 C -30 -80 -30 -30 0 0 Z" fill="#3F6B4F" transform={`rotate(${r})`} />)}</>}
  </g>
);
const Jar: React.FC<{ lid: number; label?: string }> = ({ lid, label }) => (
  <g>
    <rect x={380} y={1080} width={320} height={300} rx={60} fill="#FFFFFF" stroke="#EAD3C1" strokeWidth={4} />
    <rect x={380} y={1180} width={320} height={110} fill="#D57D55" />
    <text x={540} y={1252} textAnchor="middle" fontFamily="Fraunces" fontWeight={700} fontSize={56} fill="#FFFFFF">AYES</text>
    <rect x={370} y={1080 - 70 + (1 - lid) * -260} width={340} height={70} rx={24} fill="#3F6B4F" opacity={lid > 0 ? 1 : 0} />
    {label && <text x={540} y={1460} textAnchor="middle" fontFamily="Fraunces" fontStyle="italic" fontWeight={600} fontSize={60} fill="#3A2A20">{label}</text>}
  </g>
);

const Orbit: React.FC = () => {
  const f = useCurrentFrame();
  const spin = f / 50;
  const items = ING.map((_, i) => {
    const a = spin + (i / ING.length) * Math.PI * 2;
    return { i, x: 540 + Math.cos(a) * 360, y: 1180 + Math.sin(a) * 150, z: Math.sin(a) };
  }).sort((a, b) => a.z - b.z);
  return (
    <>
      <Svg>
        {items.filter((it) => it.z < 0).map((it) => <Ingredient key={it.i} i={it.i} x={it.x} y={it.y} s={(0.8 + 0.35 * it.z) * pop(f, fr(0.2 + it.i * 0.2))} />)}
        <Jar lid={0} />
        {items.filter((it) => it.z >= 0).map((it) => <Ingredient key={it.i} i={it.i} x={it.x} y={it.y} s={(0.8 + 0.35 * it.z) * pop(f, fr(0.2 + it.i * 0.2))} />)}
      </Svg>
      <Type at={0.1} y={290} size={70} font="text" lines={["_Les_ _trésors_ _de_ _la_ _nature_ _ivoirienne_"]} />
      {ING.map((n, i) => <Type key={n} at={1.0 + i * 1.45} out={i < ING.length - 1 ? 2.25 + i * 1.45 : undefined} y={430} size={130} lines={[`*${n}*`]} />)}
    </>
  );
};

const Fill: React.FC = () => {
  const f = useCurrentFrame();
  const lid = ease(f, fr(2.6), fr(3.2));
  return (
    <>
      <Svg>
        {ING.map((_, i) => {
          const at = fr(0.2 + i * 0.4);
          const p = ease(f, at, at + 14);
          const sx = 180 + i * 180;
          return <Ingredient key={i} i={i} x={sx + (540 - sx) * p} y={700 + 380 * p} s={0.9 - 0.6 * p} o={1 - lin(f, at + 12, at + 16)} />;
        })}
        <Jar lid={lid} label={lid > 0.5 ? "Chantilly de karité" : undefined} />
      </Svg>
      <Type at={0.1} y={300} size={100} lines={["Tout l'essentiel,", "*dans* *un* *pot.*"]} />
    </>
  );
};

const Seal: React.FC = () => {
  const f = useCurrentFrame();
  const p = pop(f, fr(0.3), 12);
  const txt = "FABRIQUÉ EN CÔTE D'IVOIRE · FABRIQUÉ EN CÔTE D'IVOIRE · ";
  return (
    <>
      <Svg>
        <defs><path id="ring" d="M 540 1130 m -250 0 a 250 250 0 1 1 500 0 a 250 250 0 1 1 -500 0" /></defs>
        <g transform={`translate(540 1130) scale(${p}) translate(-540 -1130)`}>
          <circle cx={540} cy={1130} r={300} fill="#D57D55" />
          <g transform={`rotate(${f * 0.8} 540 1130)`}><text fontFamily="Inter" fontWeight={900} fontSize={34} fill="#FFF8F0" letterSpacing={6}><textPath href="#ring">{txt}</textPath></text></g>
          {["#F77F00", "#FFFFFF", "#009E60"].map((c, i) => <rect key={c} x={420 + i * 80} y={1060} width={80} height={140} fill={c} />)}
        </g>
      </Svg>
      <Type at={0.6} y={420} size={104} lines={["*Fait* *ici.*"]} />
    </>
  );
};

export const AYES: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={3.6}><Type at={0.3} y={620} size={96} lines={["Votre peau mérite…"]} /><Type at={1.3} y={780} size={160} lines={["*l'essentiel.*"]} /></Scene>
    <Scene from={3.4} to={11.6}><Orbit /></Scene>
    <Scene from={11.4} to={16.2}><Fill /></Scene>
    <Scene from={16.0} to={19.8}><Seal /></Scene>
    <Scene from={19.6} to={22.8}><Type at={0.1} y={560} size={104} lines={["Boutique", "*&* *livraison.*"]} /><CallPill at={0.6} y={1060} number="07 49 25 04 39" /></Scene>
    <Scene from={22.6} to={26} fade={0.25}><AbsoluteFill><EndCard name="AYES Essentielle" tagline="Pour une peau belle & saine, naturellement." size={124} /></AbsoluteFill></Scene>
  </Film>
);
