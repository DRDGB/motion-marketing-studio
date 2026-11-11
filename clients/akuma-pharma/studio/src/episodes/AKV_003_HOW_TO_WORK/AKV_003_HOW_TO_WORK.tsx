// AKV-003 v2 "How to work with Akuma Pharma": Madame Ngo, Douala (scenario, D-022/D-023).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import TL from "./timeline.json";
import WORDS from "./words.json";
import { Backdrop, DarkWorld, Reveal, revealRadius } from "../../lib/stage";
import { Kinetic } from "../../lib/kinetic";
import { CornerBug } from "../../lib/endcard";
import { WordEntry, WStyle, KWord, fr, ease, pop, clamp } from "../../lib/time";
import { Timeline } from "../types";
import { C, TEXT, DISPLAY, alpha } from "../../theme";
import { Thread, Knot, Pt } from "../../lib/thread";
import { PharmaPlant, Pharmacist, Doc, Plane, Ship, MedCarton, Pharmacy } from "../../lib/akuma_icons";
import { Clock } from "../../lib/icons";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CountryLabel, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN } from "../../lib/people";
import { PhoneCTA, FinalCard } from "../../lib/akuma_end";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_003_HOW_TO_WORK_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const show = (w: string, nx?: string, pv?: string) => (w === "W-H-O" && nx === "G-M-P" ? "WHO-GMP" : w === "G-M-P" && pv === "W-H-O" ? "" : w);
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.map((i) => ({ text: show(ws[i].w, ws[i + 1]?.w, ws[i - 1]?.w), t: ws[i].t, style: st[i] ?? def })).filter((k) => k.text !== ""));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

const NGO = { look: { skin: SKIN.deep, hair: "wrap" as const, wrap: C.accent, glasses: true }, outfit: { top: "blouse" as const, topColor: "#FFFFFF", bottom: "skirt" as const, bottomColor: "#16181D" } };
const COURIER = { look: { skin: SKIN.brown, hair: "cap" as const, wrap: C.accent }, outfit: { top: "tee" as const, topColor: "#16181D", bottom: "trousers" as const, bottomColor: "#3D5A80" } };

// anchors
const MAP_B = on("L01", 2) - 0.1;
const SHOP_A = MAP_B, SHOP_B = AT("L02") - 0.1;
const FIND_A = SHOP_B, FIND_B = AT("L03") - 0.1;
const S1_A = FIND_B, S1_B = AT("L04") - 0.1;
const S2_A = S1_B, S2_M = on("L04", 8) - 0.1, S2_B = AT("L05") - 0.08;
const S3_A = S2_B, S3_B = AT("L06") - 0.08;
const S4_A = S3_B, S4_B = AT("L07") - 0.25;
const RED_A = AT("L07") - 0.5, RED_B = AT("L08") - 0.25;
const CTA_A = RED_B, CTA_B = AT("L09") - 0.1;
const END_A = CTA_B;

const StepPill: React.FC<{ n: number; o: number }> = ({ n, o }) => (
  <div style={{ position: "absolute", top: 600, left: 60, opacity: o, display: "flex", gap: 10, alignItems: "center", fontFamily: TEXT, fontWeight: 800, fontSize: 30, letterSpacing: 3 }}>
    <span style={{ background: C.accent, color: "#FFFFFF", padding: "8px 18px", borderRadius: 30 }}>STEP {n}</span><span style={{ color: C.dim }}>OF 4</span>
  </div>
);

const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const k = interpolate(t, [0.1, 2.0], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const box = lerpBox(AFRICA_BOX, boxOf("CM", 0.55), k) as Box;
  const frame: [number, number, number, number] = [40, 560, 1000, 1000];
  const { P } = fit(box, frame);
  const [dx, dy] = P(CITIES.Douala as [number, number]);
  const c = P([128, -95]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="CM" hk={ease(f, 16, 36)} dim={ease(f, 10, 45) * 0.6} showIndia={false} />
      <Pin x={dx} y={dy} p={pop(f, fr(on("L01", 0) - 0.1), 10)} size={1.1} />
      <text x={dx - 40} y={dy + 70} textAnchor="end" fontFamily={DISPLAY} fontSize={56} fontWeight={700} fill={C.ink} opacity={ease(f, fr(on("L01", 0)), fr(on("L01", 0)) + 8)}>Douala</text>
      <Flag iso="CM" x={790} y={1220} w={210} h={140} t={t} raise={ease(f, fr(on("L01", 1) - 0.3), fr(on("L01", 1) + 0.5))} />
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 540, background: `linear-gradient(${C.bg} 82%, transparent)` }} />
    <Kinetic offset={0} lines={KW("L01", [[0, 1]], { 0: "base", 1: "accent" })} />
  </AbsoluteFill>);
};

const ShopScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + SHOP_A;
  const tired = t > on("L01", 7);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Pharmacy x={250} y={1260} s={0.85 * pop(f, 2)} />
      <Pharmacy x={830} y={1260} s={0.85 * pop(f, 6)} />
      <text x={250} y={1450} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={30} letterSpacing={3} fill={C.dim} opacity={ease(f, 8, 16)}>SHOP 1</text>
      <text x={830} y={1450} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={30} letterSpacing={3} fill={C.dim} opacity={ease(f, 12, 20)}>SHOP 2</text>
      <Person x={540} y={1860} s={0.66} {...NGO} face={tired ? "worried" : "smile"} brows={tired ? "up" : "flat"} blink={blinkAt(t)} armL={tired ? { up: -20, low: -120 } : { up: 14, low: 6 }} />
      {tired && <Clock x={800} y={1600} s={0.7 * pop(f, Math.round((on("L01", 10) - SHOP_A) * 30))} t={(t * 0.8) % 1} />}
    </Svg>
    <Kinetic offset={SHOP_A} lines={KW("L01", [[2, 3], [4, 5, 6]], { 2: "dim", 3: "accent", 4: "dim", 5: "base", 6: "big" })} exitAt={on("L01", 7) - 0.05} />
    <Kinetic offset={SHOP_A} lines={KW("L01", [[7, 8, 9], [10, 11, 12]], { 7: "dim", 8: "dim", 9: "dim", 10: "base", 11: "dim", 12: "accent" })} />
    <div style={{ position: "absolute", top: 110, left: 60, fontFamily: TEXT, fontSize: 24, color: C.dim }}>Illustrative story</div>
  </AbsoluteFill>);
};

const FindScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + FIND_A;
  const four = pop(f, fr(on("L02", 9) - FIND_A - 0.05), 9);
  const logo = pop(f, fr(on("L02", 3) - FIND_A - 0.1), 10);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Person x={330} y={1860} s={0.66} {...NGO} face={t > on("L02", 3) ? "big-smile" : "neutral"} blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
      <g opacity={1 - four}>
        <circle cx={760} cy={1120} r={170 * logo} fill="#FFFFFF" stroke={C.ink} strokeWidth={6} />
        <image href={staticFile("brand/logo.svg")} x={760 - 110 * logo} y={1120 - 110 * logo} width={220 * logo} height={220 * logo} />
      </g>
      <text x={760} y={1300} textAnchor="middle" fontFamily={DISPLAY} fontSize={520 * four} fontWeight={700} fill={C.accent}>4</text>
    </Svg>
    <Kinetic offset={FIND_A} lines={KW("L02", [[0, 1, 2], [3, 4]], { 0: "dim", 1: "dim", 2: "base", 3: "big", 4: "accent" })} exitAt={on("L02", 5) - 0.05} />
    <Kinetic offset={FIND_A} lines={KW("L02", [[5, 6, 7], [8, 9, 10]], { 5: "base", 6: "dim", 7: "dim", 8: "dim", 9: "accent", 10: "big" })} />
  </AbsoluteFill>);
};

const Step1: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <PhoneCTA y={1160} msg="Hi Akuma Pharma, here is my product list" typeAt={on("L03", 2) - S1_A} attachAt={on("L03", 6) - S1_A} sendAt={on("L03", 8) - S1_A + 0.3} pillAt={on("L03", 8) - S1_A} />
  <StepPill n={1} o={1} />
  <Kinetic offset={S1_A} lines={KW("L03", [[0, 1], [2, 3, 4, 5, 6], [7, 8]], { 0: "dim", 1: "accent", 2: "dim", 3: "base", 4: "dim", 5: "base", 6: "base", 7: "dim", 8: "big" })} top={150} />
</AbsoluteFill>);

const Step2: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + S2_A;
  const box: Box = [-200, -420, 1000, 380];
  const frame: [number, number, number, number] = [30, 700, 1020, 900];
  const { P } = fit(box, frame);
  const dou = P(CITIES.Douala as [number, number]) as Pt, mo = P(CITIES.Mohali as [number, number]) as Pt;
  const mapPhase = t < S2_M;
  const loop: Pt[] = Array.from({ length: 13 }, (_, i) => { const a = Math.PI * 0.75 + (i / 12) * Math.PI * 2; return [540 + 400 * Math.cos(a), 1150 + 230 * Math.sin(a)] as Pt; });
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      {mapPhase ? <>
        <MapLayer box={box} frame={frame} highlight="IN" dim={0.2} showIndia />
        <Thread pts={[dou, [(dou[0] + mo[0]) / 2, Math.min(dou[1], mo[1]) - 150], mo]} k={ease(f, 2, 40)} width={9} />
        <Pin x={dou[0]} y={dou[1]} p={1} size={0.6} />
        <image href={staticFile("brand/logo.svg")} x={mo[0] - 50} y={mo[1] - 170} width={100} height={100} />
      </> : <>
        <PharmaPlant x={540} y={1150} s={1.15 * pop(f, fr(S2_M - S2_A))} />
        <Thread pts={loop} k={ease(f, fr(S2_M - S2_A) + 4, fr(S2_M - S2_A) + 40)} width={8} />
        <Pharmacist x={900} y={1520} s={0.5 * pop(f, fr(S2_M - S2_A) + 10)} arm={ease(f, fr(S2_M - S2_A) + 20, fr(S2_M - S2_A) + 34)} />
      </>}
    </Svg>
    {!mapPhase && <div style={{ position: "absolute", top: 1470, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 26, color: C.dim }}>Illustrative example: partner manufacturer's site</div>}
    <StepPill n={2} o={1} />
    <Kinetic offset={S2_A} lines={KW("L04", [[0, 1], [2, 3, 4, 5], [6, 7]], { 0: "dim", 1: "accent", 2: "dim", 3: "base", 4: "dim", 5: "base", 6: "base", 7: "dim" })} exitAt={S2_M} top={150} />
    <Kinetic offset={S2_A} lines={KW("L04", [[8, 9], [11], [12]], { 8: "dim", 9: "big", 11: "accent", 12: "base" })} top={150} />
  </AbsoluteFill>);
};

const Step3: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + S3_A;
  const q = pop(f, fr(on("L05", 5) - S3_A - 0.1), 9), d = pop(f, fr(on("L05", 9) - S3_A - 0.1), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g transform={`translate(780 ${1080}) rotate(-6) scale(${0.95 * q})`} opacity={Math.min(1, q * 1.5)}>
        <rect x={-150} y={-190} width={300} height={380} rx={16} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
        <text x={0} y={-120} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={44} letterSpacing={6} fill={C.accent}>QUOTE</text>
        {[-60, -10, 40, 90].map((y, i) => <g key={y}><rect x={-110} y={y} width={130} height={14} rx={7} fill={alpha(C.ink, 0.35)} /><rect x={50} y={y} width={60} height={14} rx={7} fill={alpha(C.ink, i === 3 ? 0.9 : 0.35)} /></g>)}
      </g>
      <Doc x={580} y={1300} s={0.85 * d} rot={6} stamp={pop(f, fr(on("L05", 11) - S3_A))} />
      <Person x={260} y={1860} s={0.66} {...NGO} face={t > on("L05", 11) ? "big-smile" : "smile"} blink={blinkAt(t)} prop="clipboard" armR={{ up: 30, low: -60 }} />
    </Svg>
    <div style={{ position: "absolute", top: 1560, left: 520, fontFamily: TEXT, fontSize: 24, color: C.dim, opacity: d }}>Illustrative</div>
    <StepPill n={3} o={1} />
    <Kinetic offset={S3_A} lines={KW("L05", [[0, 1], [2, 3, 4, 5]], { 0: "dim", 1: "accent", 2: "dim", 3: "base", 4: "dim", 5: "big" })} exitAt={on("L05", 6) - 0.05} top={150} />
    <Kinetic offset={S3_A} lines={KW("L05", [[6, 7, 8], [9, 10, 11]], { 6: "dim", 7: "dim", 8: "base", 9: "base", 10: "dim", 11: "accent" })} top={150} />
  </AbsoluteFill>);
};

const Step4: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + S4_A; const dur = fr(S4_B - S4_A);
  const doorAt = fr(on("L06", 4) - S4_A);
  const p = ease(f, 0, doorAt), q = ease(f, doorAt * 0.5, doorAt);
  const walk = ease(f, doorAt, dur * 0.92);
  const route: Pt[] = [[60, 1000], [300, 920], [560, 1000], [780, 1130], [1020, 1080]];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      {f < doorAt ? <>
        <Thread pts={route} k={ease(f, 0, doorAt)} width={8} />
        <g opacity={1 - q}><Plane x={80 + 640 * p} y={950 - 30 * Math.sin(p * 3)} s={0.62} rot={90} /></g>
        <g opacity={q}><Ship x={280 + 420 * q} y={1280} s={0.9} /></g>
        <Person x={880} y={1860} s={0.5} {...NGO} face="smile" blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
      </> : <>
        <Pharmacy x={600} y={1250} s={1.5 * pop(f, doorAt)} />
        <Person x={-60 + 520 * walk} y={1860} s={0.6} {...COURIER} face="smile" blink={blinkAt(t)} armL={{ up: -35, low: -95 }} armR={{ up: -35, low: -95 }} prop="box" />
        <Thread pts={[[-20, 820], [260, 760], [560, 980], [780, 1325]]} k={ease(f, doorAt, doorAt + 30)} />
        <Knot x={780} y={1338} k={ease(f, fr(on("L06", 15) - S4_A - 0.2), fr(on("L06", 15) - S4_A + 0.4))} s={0.9} />
      </>}
    </Svg>
    <StepPill n={4} o={1} />
    <Kinetic offset={S4_A} lines={KW("L06", [[0, 1], [2, 3]], { 0: "dim", 1: "accent", 2: "dim", 3: "big" })} exitAt={on("L06", 4) - 0.05} top={150} />
    <Kinetic offset={S4_A} lines={KW("L06", [[4, 5, 6, 7], [8, 9], [10, 11, 12, 13, 14, 15]], { 4: "dim", 5: "dim", 6: "base", 7: "base", 8: "dim", 9: "base", 10: "dim", 11: "dim", 12: "dim", 13: "dim", 14: "dim", 15: "accent" })} top={150} />
  </AbsoluteFill>);
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + RED_A;
  return (<DarkWorld>
    <Svg>
      <circle cx={540} cy={1330} r={380} fill={alpha("#FFFFFF", 0.95)} />
      <Person x={540} y={1800} s={0.75} {...NGO} face="big-smile" blink={blinkAt(t)} armL={{ up: 150, low: 165 + 10 * Math.sin(t * 9) }} armR={{ up: 150, low: 165 - 10 * Math.sin(t * 9) }} />
    </Svg>
    <Kinetic dark offset={RED_A} top={190} lines={KW("L07", [[0, 1], [2, 3]], { 0: "big", 1: "base", 2: "big", 3: "base" })} exitAt={on("L07", 4) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L07", [[4, 5], [6]], { 4: "base", 5: "base", 6: "accent" })} />
  </DarkWorld>);
};

const CtaScene: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <PhoneCTA msg="Hi Akuma Pharma, here is my product list" typeAt={on("L08", 2) - CTA_A} attachAt={on("L08", 6) - CTA_A} sendAt={on("L08", 9) - CTA_A} pillAt={on("L08", 8) - CTA_A} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L08", [[0, 1]], { 0: "big", 1: "accent" })} exitAt={on("L08", 2) - 0.05} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L08", [[2, 3, 4], [5, 6], [7, 8, 9]], { 2: "base", 3: "dim", 4: "dim", 5: "base", 6: "base", 7: "dim", 8: "accent", 9: "big" })} />
</AbsoluteFill>);

export const AKV_003_HOW_TO_WORK: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const win = (a: number, b: number) => interpolate(f, [fr(a), fr(a) + 8, fr(b) - 8, fr(b)], [0, 1, 1, 0], clamp);
  const tradeO = Math.max(win(S2_A + 0.3, S2_B), win(CTA_A, END_A));
  const inRed = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_B + 0.3}><MapScene /></Span>
      <Span a={SHOP_A} b={SHOP_B}><ShopScene /></Span>
      <Span a={FIND_A} b={FIND_B}><FindScene /></Span>
      <Span a={S1_A} b={S1_B}><Step1 /></Span>
      <Span a={S2_A} b={S2_B}><Step2 /></Span>
      <Span a={S3_A} b={S3_B}><Step3 /></Span>
      <Span a={S4_A} b={S4_B + 0.5}><Step4 /></Span>
      <Span a={CTA_A} b={CTA_B}><CtaScene /></Span>
      <Reveal r={r} cx={540} cy={1200}><Span a={RED_A} b={RED_B + 0.4}><RedScene /></Span></Reveal>
      <div style={{ position: "absolute", top: t >= CTA_A - 0.3 ? 1770 : 1690, left: 150, right: 150, padding: "10px 18px", borderRadius: 16, background: alpha("#FFFFFF", 0.88), textAlign: "center", fontFamily: TEXT, fontSize: 23, fontWeight: 500, color: C.dim, opacity: inRed ? 0 : tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {t > 0.6 && t < END_A && <CornerBug dark={inRed} />}
      <Span a={END_A} b={T.total}><FinalCard today="Douala" highlight="CM" reviewed="2026-11-11" extraPins={["Douala"]} /></Span>
    </AbsoluteFill>
  );
};
