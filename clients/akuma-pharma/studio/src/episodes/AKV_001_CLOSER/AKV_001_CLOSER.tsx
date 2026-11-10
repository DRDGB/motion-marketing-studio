// AKV-001 "Closer Than You Think": launch film. Scenes follow episodes/AKV_001_CLOSER/SCRIPT_AND_VOICE.md (lines table).
// White world, red world for the Switch (L08), The Thread throughout, end card with CTA.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import TL from "./timeline.json";
import WORDS from "./words.json";
import { Backdrop, DarkWorld, Reveal, revealRadius, SceneCam } from "../../lib/stage";
import { Kinetic } from "../../lib/kinetic";
import { CornerBug, EndCard } from "../../lib/endcard";
import { WordEntry, WStyle, KWord, fr, ease, pop, clamp } from "../../lib/time";
import { Timeline } from "../types";
import { C, TEXT, DISPLAY, alpha } from "../../theme";
import { Thread, Node, Knot, Pt } from "../../lib/thread";
import { Pharmacy, PharmaPlant, Pharmacist, MedCarton, DocStack, Doc, Blister, Plane, Ship, Capsule } from "../../lib/akuma_icons";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_001_CLOSER_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
/** Rows of words for a clip: `rows` = word counts per row; `st` = style overrides by word index. */
const K = (id: string, rows: number[], st: Record<number, WStyle> = {}, from = 0, def: WStyle = "base"): KWord[][] => {
  const ws = words(id).slice(from);
  const out: KWord[][] = []; let i = 0;
  const show = (k: number) => {
    const w = ws[k].w, nx = ws[k + 1]?.w;
    if (w === "W-H-O" && nx === "G-M-P") return "WHO-GMP";
    if (w === "G-M-P" && ws[k - 1]?.w === "W-H-O") return "";
    return w.replace(/\b([A-Z])-(?=[A-Z]\b)/g, "$1");
  };
  rows.forEach((n) => { out.push(ws.slice(i, i + n).map((w, j) => ({ text: show(i + j), t: w.t, style: st[from + i + j] ?? def })).filter((x) => x.text !== "")); i += n; });
  return out;
};
const onset = (id: string, i: number) => words(id)[i].t;
const START = (id: string) => clip(id).at - 0.15;
const ids = T.clips.map((c) => c.id);
const END_OF = (id: string) => { const k = ids.indexOf(id); return k < ids.length - 1 ? START(ids[k + 1]) : T.total; };
const END_AT = START("L12");

const Scene: React.FC<{ id: string; children: React.ReactNode; until?: string }> = ({ id, children, until }) => {
  const a = START(id), b = until ? END_OF(until) : END_OF(id);
  return <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
};
const Legend: React.FC<{ text: string; y?: number; o?: number; dark?: boolean }> = ({ text, y = 1500, o = 1, dark }) => (
  <div style={{ position: "absolute", top: y, left: 90, right: 90, textAlign: "center", fontFamily: TEXT, fontSize: 28, fontWeight: 500, color: dark ? alpha(C.light, 0.8) : C.dim, opacity: o }}>{text}</div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const local = (f: number, id: string, t: number) => f - fr(t - START(id)); // frames since global second t, inside scene id

// ---------- scenes ----------
const S01: React.FC = () => {
  const f = useCurrentFrame(); const id = "L01";
  const thread: Pt[] = [[-30, 980], [200, 900], [380, 1010], [470, 1160]];
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 2, 4, 2], { 9: "accent", 10: "big", 0: "dim", 1: "dim", 2: "dim", 7: "dim", 8: "dim" })} />
    <SceneCam dur={fr(END_OF(id) - START(id))}><Svg>
      <Pharmacy x={540} y={1300} s={1.15 * pop(f, 3)} />
      <Thread pts={thread} k={ease(f, 2, 26)} />
    </Svg></SceneCam>
  </>);
};
const S02: React.FC = () => {
  const f = useCurrentFrame(); const id = "L02";
  const lift = ease(f, 6, 30);
  const arc: Pt[] = [[230, 1330], [540, 1180], [850, 1330]];
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 3, 3, 3], { 0: "dim", 1: "dim", 8: "dim", 9: "dim", 10: "dim", 11: "accent" }, 0)} />
    <Svg>
      <MedCarton x={540} y={1060 - 80 * lift} s={1.25 * pop(f, 2)} />
      <Thread pts={arc} k={ease(f, 20, 60)} width={7} bead={false} />
      <Node x={230} y={1330} pop={pop(f, 18)} /><Node x={850} y={1330} pop={pop(f, 50)} />
      <text x={230} y={1410} textAnchor="middle" fontFamily={TEXT} fontSize={32} fontWeight={700} letterSpacing={3} fill={C.ink} opacity={pop(f, 20)}>YOUR MARKET</text>
      <text x={850} y={1410} textAnchor="middle" fontFamily={TEXT} fontSize={32} fontWeight={700} letterSpacing={3} fill={C.accent} opacity={pop(f, 52)}>INDIA</text>
    </Svg>
    <Legend y={1470} o={ease(f, 40, 50)} text="India's pharmaceutical exports to Africa: US$3.93 billion (FY2024-25). Source: Pharmexcil." />
  </>);
};
const S03: React.FC = () => {
  const f = useCurrentFrame(); const id = "L03";
  const at = (i: number) => fr(onset(id, i) - START(id));
  const count = f < at(4) ? 2 : f < at(9) ? 4 : 7; // time zones · emails · documents
  const sway = f > at(9) ? Math.sin((f - at(9)) / 4) * 4 * Math.max(0, 1 - (f - at(9)) / 30) : 0;
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [2, 2, 1, 4, 1], { 0: "dim", 1: "dim", 5: "dim", 6: "dim", 7: "base", 8: "dim", 9: "accent" })} />
    <Svg><g transform={`rotate(${sway} 540 1250)`}><DocStack x={540} y={1220} n={count} spread={1} s={1.05 * pop(f, Math.max(0, at(2) - 4))} /></g></Svg>
  </>);
};
const S04: React.FC = () => {
  const f = useCurrentFrame(); const id = "L04";
  const grey = ease(f, 40, 70);
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 2, 3], { 0: "dim", 1: "dim", 2: "dim", 5: "dim", 6: "dim", 7: "ghost" })} />
    <Svg><g opacity={1 - 0.6 * grey}>
      {[180, 400, 620, 840].map((x, i) => <g key={x}>
        <MedCarton x={x} y={1200} s={0.75 * pop(f, 4 + i * 3)} />
        <circle cx={x + 55} cy={1135} r={26} fill="none" stroke={C.ink} strokeWidth={6} opacity={0.5 + 0.5 * Math.abs(Math.sin((f + i * 5) / 6))} />
      </g>)}
    </g></Svg>
  </>);
};
const S05: React.FC = () => {
  const f = useCurrentFrame(); const id = "L05";
  const tc = fr(onset(id, 4) - START(id)); // "closer…"
  const k = ease(f, tc - 4, tc + 18);
  const lx = 250 + 140 * k, rx = 830 - 140 * k;
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 2, 5], { 0: "dim", 1: "dim", 2: "dim", 3: "base", 4: "accent", 5: "dim", 6: "dim", 7: "dim", 8: "dim", 9: "dim" })} />
    <Svg>
      <Pharmacy x={lx} y={1260} s={0.55 * pop(f, 2)} />
      <PharmaPlant x={rx} y={1300} s={0.45 * pop(f, 6)} />
      <Thread pts={[[lx + 60, 1330], [540, 1250 - 60 * (1 - k)], [rx - 60, 1330]]} k={ease(f, 4, 24)} />
    </Svg>
  </>);
};
const S06: React.FC = () => {
  const f = useCurrentFrame(); const id = "L06";
  const loop: Pt[] = Array.from({ length: 13 }, (_, i) => { const a = Math.PI * 0.75 + (i / 12) * Math.PI * 2; return [540 + 330 * Math.cos(a), 1220 + 200 * Math.sin(a)] as Pt; });
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [2, 2, 1, 2, 2], { 0: "dim", 1: "dim", 2: "big", 4: "accent", 5: "dim", 6: "base", 7: "dim", 8: "dim" })} />
    <Svg>
      <PharmaPlant x={540} y={1220} s={1.0 * pop(f, 2)} />
      <Thread pts={loop} k={ease(f, 10, 60)} width={8} />
      <Pharmacist x={900} y={1440} s={0.42 * pop(f, 40)} arm={ease(f, 60, 80)} />
    </Svg>
    <Legend y={1500} o={ease(f, 6, 14)} text="Illustrative example: partner manufacturer's site" />
  </>);
};
const S07: React.FC = () => {
  const f = useCurrentFrame(); const id = "L07";
  const td = fr(onset(id, 5) - START(id)); // "documents"
  const sweep = ease(f, 6, td);
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 1, 2], { 0: "dim", 1: "base", 2: "dim", 3: "big", 4: "dim", 5: "accent" })} />
    <Svg>
      <Blister x={300} y={1260} s={0.8 * pop(f, 4)} rot={-8} />
      <Doc x={640} y={1200} s={1.15 * pop(f, 2)} stamp={pop(f, td)} />
      <g transform={`translate(${520 + 260 * sweep} ${1150 + 40 * Math.sin(sweep * 6)})`} opacity={sweep < 1 ? 1 : 1 - ease(f, td + 6, td + 14)}>
        <circle r={70} fill={alpha(C.surface, 0.35)} stroke={C.ink} strokeWidth={12} />
        <rect x={45} y={45} width={24} height={90} rx={12} fill={C.ink} transform="rotate(-45 57 90)" />
      </g>
    </Svg>
    <Legend y={1500} o={ease(f, 6, 14)} text="Illustrative" />
  </>);
};
const S08: React.FC = () => {
  const f = useCurrentFrame(); const id = "L08";
  const second = onset(id, 4); // second "We"
  return (<>
    <Kinetic dark offset={START(id)} exitAt={second - 0.05} top={560} lines={K(id, [3, 1], { 0: "base", 1: "base", 2: "base", 3: "big" })} />
    <Kinetic dark offset={START(id)} top={560} lines={K(id, [3, 3, 1], { 4: "base", 5: "base", 6: "base", 7: "dim", 8: "dim", 9: "base", 10: "accent" }, 4)} />
    <Svg><g opacity={0.25 * pop(f, 2)}><Capsule x={540} y={1400} s={2.2} dark /></g></Svg>
  </>);
};
const S09: React.FC = () => {
  const f = useCurrentFrame(); const id = "L09";
  const stitch: Pt[] = [[640, 1080], [700, 1140], [620, 1180], [700, 1230], [610, 1270]];
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 2, 2, 2], { 0: "dim", 1: "base", 2: "dim", 3: "dim", 4: "base", 5: "dim", 6: "dim", 7: "dim", 8: "accent" })} />
    <Svg>
      <MedCarton x={470} y={1250} s={1.35 * pop(f, 2)} />
      <Doc x={760} y={1160} s={0.62 * pop(f, 12)} rot={8} stamp={pop(f, 30)} />
      <Thread pts={stitch} k={ease(f, 20, 60)} width={7} />
    </Svg>
    <Legend y={1500} o={ease(f, 6, 14)} text="Illustrative" />
  </>);
};
const S10: React.FC = () => {
  const f = useCurrentFrame(); const id = "L10";
  const dur = fr(END_OF(id) - START(id));
  const p = ease(f, 0, dur * 0.55), q = ease(f, dur * 0.45, dur);
  const route: Pt[] = [[60, 1060], [300, 980], [560, 1060], [780, 1200], [1020, 1140]];
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [3, 3, 3, 5], { 0: "dim", 1: "base", 2: "dim", 3: "dim", 4: "base", 5: "dim", 6: "dim", 7: "dim", 8: "dim", 9: "dim", 10: "dim", 11: "dim", 12: "dim", 13: "accent" })} top={170} />
    <Svg>
      <Thread pts={route} k={ease(f, 0, dur)} width={8} />
      <g opacity={1 - q}><Plane x={80 + 620 * p} y={1020 - 30 * Math.sin(p * 3)} s={0.42} rot={90} /></g>
      <g opacity={q}><Ship x={300 + 450 * q} y={1360} s={0.55} /></g>
      <MedCarton x={160} y={1420} s={0.5 * pop(f, 6)} />
    </Svg>
  </>);
};
const S11: React.FC = () => {
  const f = useCurrentFrame(); const id = "L11";
  return (<>
    <Kinetic offset={START(id)} lines={K(id, [2, 3, 3], { 0: "dim", 1: "base", 2: "base", 3: "dim", 4: "base", 5: "dim", 6: "dim", 7: "accent" })} />
    <Svg>
      <Pharmacy x={540} y={1300} s={1.1 * pop(f, 2)} />
      <Thread pts={[[-20, 1100], [250, 1040], [470, 1180], [610, 1360]]} k={ease(f, 2, 30)} />
      <Knot x={610} y={1370} k={ease(f, 28, 46)} s={0.9} />
    </Svg>
  </>);
};

export const AKV_001_CLOSER: React.FC = () => {
  const f = useCurrentFrame();
  const dA = START("L08") - 0.45, dB = END_OF("L08");
  const r = revealRadius(f, fr(dA), fr(dA + 0.75), fr(dB - 0.2), fr(dB + 0.5));
  const tradeIn = clip("L09").at, tradeOut = END_AT;
  const tradeO = interpolate(f, [fr(tradeIn), fr(tradeIn) + 10, fr(tradeOut) - 10, fr(tradeOut)], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Scene id="L01"><S01 /></Scene>
      <Scene id="L02"><S02 /></Scene>
      <Scene id="L03"><S03 /></Scene>
      <Scene id="L04"><S04 /></Scene>
      <Scene id="L05"><S05 /></Scene>
      <Scene id="L06"><S06 /></Scene>
      <Scene id="L07"><S07 /></Scene>
      <Scene id="L09"><S09 /></Scene>
      <Scene id="L10"><S10 /></Scene>
      <Scene id="L11"><S11 /></Scene>
      <Reveal r={r} cx={540} cy={1150}><DarkWorld><Scene id="L08"><S08 /></Scene></DarkWorld></Reveal>
      <div style={{ position: "absolute", top: 1560, left: 80, right: 80, textAlign: "center", fontFamily: TEXT, fontSize: 25, fontWeight: 500, color: C.dim, opacity: tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {f > fr(2.2) && f < fr(END_AT) && <CornerBug dark={f > fr(dA + 0.75) && f < fr(dB - 0.2)} />}
      <Sequence from={fr(END_AT)}>
        <EndCard dark={false} cta="SEND YOUR PRODUCT LIST" />
        <div style={{ position: "absolute", top: 1430, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 40, color: C.ink, opacity: ease(f - fr(END_AT), 30, 42) }}>
          Next: What is <span style={{ color: C.accent, fontStyle: "italic" }}>Akuma Pharma</span>?
        </div>
        <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 24, color: C.dim, lineHeight: 1.35 }}>
          Akuma Enterprises, Kharar, Punjab, India · Reviewed: 2026-11-10<br />For licensed pharmaceutical trade · AI-generated narration
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
