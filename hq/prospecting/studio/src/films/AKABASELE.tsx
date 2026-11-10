// SPEC_AKABASELE: Akabasele 100% Human Virgin Hair (prospect #6). Idea: texture swatches drawn as living lines.
// Facts: IG/FB posts (textures, formats, Yopougon Carrefour Amondji, WhatsApp). Kinshasa omitted until confirmed. No "lifetime"/price claims.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop, CallPill, Draw, EndCard, Film, Look, Pin, Scene, Svg, Type, ease, fr, lin } from "../kit";

const LOOK: Look = { bg: "#24102A", bg2: "#45213F", ink: "#FFF3F6", dim: "#C9AFC3", accent: "#E9AA8D", accent2: "#F7D4C4", card: "#341832",
  display: "Abril Fatface", displayWeight: 400, italicAccent: true };
export const AKABASELE_FRAMES = fr(23.5);

const Strands: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Svg>
      {Array.from({ length: 9 }).map((_, i) => {
        let d = "";
        for (let k = 0; k <= 60; k++) { const y = 700 + k * 22; const x = 120 + i * 105 + 26 * Math.sin(k / 6 + f / 15 + i); d += `${k ? "L" : "M"} ${x.toFixed(1)} ${y} `; }
        return <Draw key={i} d={d} k={ease(f, fr(0.1 + i * 0.08), fr(1.6 + i * 0.08))} len={1500} stroke={i % 3 ? "#7A4A6E" : "#E9AA8D"} w={i % 3 ? 3 : 5} />;
      })}
    </Svg>
  );
};

const pattern = (kind: number, x: number, y: number, f: number) => {
  const out: string[] = [];
  for (let r = 0; r < 5; r++) {
    let d = "";
    for (let k = 0; k <= 40; k++) {
      const t = k / 40, px = x - 150 + t * 300, py = y - 80 + r * 40;
      const off = kind === 0 ? 0 : kind === 1 ? 14 * Math.sin(t * 12 + f / 10 + r) : kind === 2 ? 9 * Math.sin(t * 40 + f / 6 + r) : 2 * Math.sin(t * 6 + f / 20);
      d += `${k ? "L" : "M"} ${px.toFixed(1)} ${(py + off).toFixed(1)} `;
    }
    out.push(d);
  }
  return out;
};
const Swatches: React.FC = () => {
  const f = useCurrentFrame();
  const S = [{ n: "Lisse", c: "#E9AA8D" }, { n: "Bouclé", c: "#F7D4C4" }, { n: "Afro", c: "#E9AA8D" }, { n: "Gris", c: "#C8C8CF" }];
  return (
    <>
      <Type at={0.1} y={300} size={100} lines={["Choisissez", "*votre* *texture.*"]} />
      {S.map((sw, i) => {
        const x = i % 2 ? 765 : 315, y = 920 + Math.floor(i / 2) * 430;
        const k = ease(f, fr(0.6 + i * 0.5), fr(1.5 + i * 0.5));
        return (
          <React.Fragment key={sw.n}>
            <div style={{ position: "absolute", left: x - 200, top: y - 170, width: 400, height: 340, borderRadius: 34, background: "#341832", border: "2px solid #6B3B60", opacity: k, transform: `scale(${0.9 + 0.1 * k})` }} />
            <Svg>{pattern(i, x, y - 20, f).map((d, r) => <Draw key={r} d={d} k={k} len={420} stroke={sw.c} w={5} />)}</Svg>
            <div style={{ position: "absolute", left: x - 200, width: 400, top: y + 100, textAlign: "center", fontFamily: "Abril Fatface", fontWeight: 400, fontSize: 54, color: "#FFF3F6", opacity: k }}>{sw.n}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

const Formats: React.FC = () => {
  const f = useCurrentFrame();
  const F = ["Perruques", "Tissages", "Closures"];
  return (
    <>
      <Type at={0.1} y={300} size={100} lines={["En *cheveux*", "*vierges.*"]} />
      {F.map((n, i) => {
        const at = fr(0.6 + i * 0.6);
        const k = ease(f, at, at + 12);
        return (
          <React.Fragment key={n}>
            <Svg><circle cx={260} cy={880 + i * 230} r={58} fill="none" stroke="#E9AA8D" strokeWidth={5} opacity={k} />
              <Draw d={`M ${232} ${880 + i * 230} L ${252} ${902 + i * 230} L ${292} ${858 + i * 230}`} k={ease(f, at + 6, at + 18)} len={110} stroke="#E9AA8D" w={8} /></Svg>
            <div style={{ position: "absolute", left: 370, top: 880 + i * 230 - 52, fontFamily: "Abril Fatface", fontWeight: 400, fontSize: 88, color: "#FFF3F6", opacity: k, transform: `translateX(${(1 - k) * 60}px)` }}>{n}</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const AKABASELE: React.FC = () => (
  <Film look={LOOK}>
    <Backdrop />
    <Scene from={0} to={3.8}><Strands /><Type at={0.4} y={300} size={110} lines={["Vrais cheveux."]} /><Type at={1.5} y={440} size={120} lines={["*Vraie* *différence.*"]} /></Scene>
    <Scene from={3.6} to={11.0}><Swatches /></Scene>
    <Scene from={10.8} to={14.6}><Formats /></Scene>
    <Scene from={14.4} to={17.8}><Type at={0.1} y={360} size={96} lines={["Venez", "*les* *toucher.*"]} /><Pin at={0.4} y={1150} title="Yopougon" sub="Carrefour Amondji · Abidjan" /></Scene>
    <Scene from={17.6} to={20.6}><CallPill at={0.2} y={900} label="Commandez sur WhatsApp" number="07 89 54 32 70" /></Scene>
    <Scene from={20.4} to={23.5} fade={0.25}><AbsoluteFill><EndCard name="AKABASELE" tagline="100% human virgin hair · Abidjan" size={136} /></AbsoluteFill></Scene>
  </Film>
);
