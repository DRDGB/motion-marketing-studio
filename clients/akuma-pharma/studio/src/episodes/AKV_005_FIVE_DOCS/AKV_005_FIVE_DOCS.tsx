// AKV-005 v2 "5 documents before you sign": Mahamat, N'Djamena (scenario + checklist, D-022/D-023).
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
import { Thread } from "../../lib/thread";
import { Doc, Carton } from "../../lib/akuma_icons";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN } from "../../lib/people";
import { PhoneCTA, FinalCard } from "../../lib/akuma_end";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_005_FIVE_DOCS_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const show = (w: string) => w.replace("C-O-P-P", "CoPP").replace("W-H-O", "WHO").replace("G-M-P", "GMP");
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.map((i) => ({ text: show(ws[i].w), t: ws[i].t, style: st[i] ?? def })));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };
const lf = (a: number, g: number) => fr(g - a);

const MAHAMAT = { look: { skin: SKIN.warm, hair: "cap" as const, wrap: "#16181D", beard: true }, outfit: { top: "shirt" as const, topColor: "#E9ECEF", bottom: "trousers" as const, bottomColor: "#5B606B" } };
const AK_COORD = { look: { skin: SKIN.light, hair: "bun" as const }, outfit: { top: "shirt" as const, topColor: "#FFFFFF", bottom: "trousers" as const, bottomColor: "#16181D" } };
const AK_PHARM = { look: { skin: SKIN.light, hair: "short" as const, glasses: true }, outfit: { top: "coat" as const, topColor: "#FFFFFF", under: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35" } };

const MAP_B = on("L01", 2) - 0.1;
const STORE_A = MAP_B, STORE_B = AT("L02") - 0.1;
const PRICE_A = STORE_B, PRICE_B = AT("L03") - 0.1;
const SIGN_A = PRICE_B, SIGN_B = AT("L04") - 0.1;
const CARDS_A = SIGN_B, CARDS_B = AT("L08") - 0.25;
const RED_A = AT("L08") - 0.5, RED_B = AT("L09") - 0.25;
const CTA_A = RED_B, CTA_B = AT("L10") - 0.1;
const END_A = CTA_B;

const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const k = interpolate(t, [0.1, 1.9], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const box = lerpBox(AFRICA_BOX, boxOf("TD", 0.45), k) as Box;
  const frame: [number, number, number, number] = [40, 560, 1000, 1000];
  const { P } = fit(box, frame);
  const [x, y] = P(CITIES["N'Djamena"] as [number, number]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="TD" hk={ease(f, 14, 34)} dim={ease(f, 10, 45) * 0.6} showIndia={false} />
      <Pin x={x} y={y} p={pop(f, fr(on("L01", 0) - 0.1), 10)} size={1.1} />
      <text x={x - 40} y={y + 70} textAnchor="end" fontFamily={DISPLAY} fontSize={56} fontWeight={700} fill={C.ink} opacity={ease(f, fr(on("L01", 0)), fr(on("L01", 0)) + 8)}>N'Djamena</text>
      <Flag iso="TD" x={800} y={1260} w={210} h={140} t={t} raise={ease(f, fr(on("L01", 1) - 0.3), fr(on("L01", 1) + 0.5))} />
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 540, background: `linear-gradient(${C.bg} 82%, transparent)` }} />
    <Kinetic offset={0} lines={KW("L01", [[0, 1]], { 0: "base", 1: "accent" })} />
  </AbsoluteFill>);
};

const Store: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + STORE_A;
  return (<AbsoluteFill style={{ background: "#F6F2EC" }}>
    <Svg>
      <rect x={0} y={1500} width={1080} height={420} fill="#E6E0D6" />
      <g transform="translate(540 640)"><rect x={-330} y={-50} width={660} height={100} rx={14} fill={C.ink} /><g transform="translate(-260 0)"><rect x={-30} y={-30} width={60} height={60} rx={10} fill="#FFFFFF" /><rect x={-8} y={-22} width={16} height={44} rx={3} fill={C.ink} /><rect x={-22} y={-8} width={44} height={16} rx={3} fill={C.ink} /></g><text x={40} y={18} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={44} letterSpacing={6} fill="#FFFFFF">HOSPITAL STORE</text></g>
      {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <Carton key={`${r}-${c}`} x={600 + c * 118 - (r % 2) * 40} y={1400 - r * 150} s={0.42 * pop(f, 2 + (r * 4 + c) * 1.2)} />))}
      <Person x={250} y={1860} s={0.66} {...MAHAMAT} face="smile" blink={blinkAt(t)} prop="clipboard" armR={{ up: 30, low: -60 }} />
    </Svg>
    <div style={{ position: "absolute", top: 110, left: 60, fontFamily: TEXT, fontSize: 24, color: C.dim }}>Illustrative story</div>
    <Kinetic offset={STORE_A} lines={KW("L01", [[2], [3, 4], [5, 6, 7]], { 2: "accent", 3: "dim", 4: "base", 5: "dim", 6: "dim", 7: "big" })} />
  </AbsoluteFill>);
};

const PriceScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + PRICE_A;
  const noDoc = ease(f, lf(PRICE_A, on("L02", 10) - 0.1), lf(PRICE_A, on("L02", 10)) + 4);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g transform={`translate(680 1140) scale(${0.9 + 0.1 * pop(f, 2)}) rotate(3)`}>
        <rect x={-260} y={-380} width={520} height={760} rx={22} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
        <rect x={-260} y={-380} width={520} height={110} rx={22} fill="#F2B8C0" />
        <text x={0} y={-305} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={54} fill={C.ink}>PRICE LIST</text>
        {[-200, -130, -60, 10, 80, 150].map((y, i) => <g key={y}><rect x={-210} y={y} width={240} height={18} rx={9} fill={alpha(C.ink, 0.3)} />{[0, 1, 2].map((s) => <text key={s} x={70 + s * 46} y={y + 18} fontSize={34} fill="#E8B400">★</text>)}</g>)}
        <rect x={-260} y={250} width={520} height={130} rx={0} fill={alpha(C.accent, 0.08 * noDoc)} />
        <text x={-220} y={330} fontFamily={TEXT} fontWeight={800} fontSize={40} fill={noDoc > 0.5 ? C.accent : C.ink}>Attachments: 0</text>
      </g>
      <Person x={230} y={1860} s={0.62} {...MAHAMAT} face={noDoc > 0.5 ? "worried" : "surprised"} brows={noDoc > 0.5 ? "down" : "up"} blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
    </Svg>
    <Kinetic offset={PRICE_A} lines={KW("L02", [[0, 1, 2, 3, 4], [5, 6], [7, 8]], { 0: "dim", 1: "dim", 2: "base", 3: "dim", 4: "dim", 5: "dim", 6: "accent", 7: "base", 8: "base" })} exitAt={on("L02", 9) - 0.05} />
    <Kinetic offset={PRICE_A} lines={KW("L02", [[9, 10], [11]], { 9: "dim", 10: "big", 11: "accent" })} />
  </AbsoluteFill>);
};

const SignScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + SIGN_A;
  const five = pop(f, lf(SIGN_A, on("L03", 6) - 0.05), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g opacity={1 - five * 0.85}>
        <rect x={520} y={860} width={420} height={560} rx={16} fill="#FFFFFF" stroke={C.ink} strokeWidth={7} />
        <text x={730} y={940} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={38} letterSpacing={6} fill={C.ink}>CONTRACT</text>
        {[1000, 1060, 1120, 1180].map((y) => <rect key={y} x={570} y={y} width={320} height={16} rx={8} fill={alpha(C.ink, 0.25)} />)}
        <path d="M 580 1330 Q 640 1300 700 1335" stroke={alpha(C.ink, 0.4)} strokeWidth={5} fill="none" />
        <g transform={`translate(${760 + 40 * Math.sin(t * 2)} ${1290}) rotate(35)`}><rect x={-12} y={-140} width={24} height={150} rx={6} fill={C.ink} /><path d="M -12 10 L 0 40 L 12 10 Z" fill={C.accent} /></g>
      </g>
      <text x={730} y={1300} textAnchor="middle" fontFamily={DISPLAY} fontSize={520 * five} fontWeight={700} fill={C.accent}>5</text>
      <Person x={250} y={1860} s={0.66} {...MAHAMAT} face="neutral" blink={blinkAt(t)} brows="up" />
    </Svg>
    <Kinetic offset={SIGN_A} lines={KW("L03", [[0], [1, 2, 3]], { 0: "accent", 1: "dim", 2: "dim", 3: "big" })} exitAt={on("L03", 4) - 0.05} />
    <Kinetic offset={SIGN_A} lines={KW("L03", [[4, 5], [6, 7]], { 4: "base", 5: "dim", 6: "accent", 7: "big" })} />
  </AbsoluteFill>);
};

const CARDS = [
  { n: 1, title: ["WHO-format", "CoPP"], at: () => on("L04", 0), x: 290, y: 760 },
  { n: 2, title: ["GMP", "certificate"], at: () => on("L04", 5), x: 790, y: 760 },
  { n: 3, title: ["Stability data", "30 °C / 75 % RH"], at: () => on("L05", 0), x: 290, y: 1080 },
  { n: 4, title: ["Registration", "dossier*"], at: () => on("L05", 7), x: 790, y: 1080 },
  { n: 5, title: ["Batch", "CoA"], at: () => on("L06", 0), x: 540, y: 1400 },
];
const CardsScene: React.FC = () => {
  const f = useCurrentFrame();
  const scan = ease(f, lf(CARDS_A, on("L07", 1)), lf(CARDS_A, on("L07", 9)));
  const nameO = ease(f, lf(CARDS_A, on("L07", 4)), lf(CARDS_A, on("L07", 5)) + 4);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      {CARDS.map((c) => { const p = pop(f, lf(CARDS_A, c.at() - 0.1), 9); return (
        <g key={c.n} transform={`translate(${c.x} ${c.y - 60 * (1 - p)}) rotate(${(c.n % 2 ? -2 : 2) * p}) scale(${0.8 + 0.2 * p})`} opacity={Math.min(1, p * 1.5)}>
          <rect x={-215} y={-125} width={430} height={250} rx={18} fill="#FFFFFF" stroke={C.ink} strokeWidth={6} />
          <circle cx={-160} cy={-70} r={36} fill={C.accent} /><text x={-160} y={-56} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={44} fill="#FFFFFF">{c.n}</text>
          <text x={-105} y={-72} fontFamily={TEXT} fontWeight={800} fontSize={34} fill={C.ink}>{c.title[0]}</text>
          <text x={-105} y={-30} fontFamily={TEXT} fontWeight={700} fontSize={30} fill={C.dim}>{c.title[1]}</text>
          {[10, 40].map((y) => <rect key={y} x={-180} y={y} width={300} height={12} rx={6} fill={alpha(C.ink, 0.2)} />)}
          <g opacity={nameO}><rect x={-185} y={66} width={370} height={40} rx={8} fill={alpha(C.accent, 0.12)} /><text x={0} y={95} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={24} fill={C.accent}>Manufacturer: XYZ Pharma</text></g>
        </g>); })}
      {scan > 0 && scan < 1 && <rect x={40} y={700 + 820 * scan} width={1000} height={8} fill={C.accent} opacity={0.75} />}
    </Svg>
    <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 24, color: C.dim }}>*where one exists · "XYZ Pharma" is illustrative · our suggested checklist, not an official list</div>
    <Kinetic offset={CARDS_A} top={160} lines={KW("L04", [[0, 1, 2, 3, 4]], { 0: "accent", 1: "dim", 2: "base", 3: "dim", 4: "big" })} exitAt={on("L04", 5) - 0.05} />
    <Kinetic offset={CARDS_A} top={160} lines={KW("L04", [[5, 6, 7, 8]], { 5: "accent", 6: "dim", 7: "big", 8: "base" })} exitAt={on("L05", 0) - 0.05} />
    <Kinetic offset={CARDS_A} top={160} lines={KW("L05", [[0, 1, 2], [3, 4, 5, 6]], { 0: "accent", 1: "base", 2: "dim", 3: "dim", 4: "base", 5: "base", 6: "dim" })} exitAt={on("L05", 7) - 0.05} />
    <Kinetic offset={CARDS_A} top={160} lines={KW("L05", [[7, 8, 9, 10], [11, 12, 13]], { 7: "accent", 8: "dim", 9: "base", 10: "base", 11: "dim", 12: "dim", 13: "dim" })} exitAt={on("L06", 0) - 0.05} />
    <Kinetic offset={CARDS_A} top={160} lines={KW("L06", [[0, 1, 2], [3, 4, 5, 6]], { 0: "accent", 1: "dim", 2: "base", 3: "dim", 4: "base", 5: "dim", 6: "base" })} exitAt={on("L07", 0) - 0.05} />
    <Kinetic offset={CARDS_A} top={160} lines={KW("L07", [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]], { 0: "dim", 1: "accent", 2: "dim", 3: "dim", 4: "base", 5: "big", 6: "base", 7: "dim", 8: "dim", 9: "base" })} />
  </AbsoluteFill>);
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + RED_A;
  const chk = lf(RED_A, on("L08", 11) - 0.1);
  return (<DarkWorld>
    <Svg>
      <circle cx={540} cy={1420} r={420} fill={alpha("#FFFFFF", 0.95)} />
      <Person x={360} y={1850} s={0.58} {...AK_COORD} face="smile" blink={blinkAt(t)} prop="phone" armR={{ up: 116, low: -128 }} />
      <Person x={720} y={1850} s={0.58} {...AK_PHARM} face="smile" blink={blinkAt(t, 1.2)} prop="clipboard" armR={{ up: 30, low: -60 }} />
      {[0, 1, 2, 3, 4].map((i) => <Doc key={i} x={180 + i * 180} y={980} s={0.42 * pop(f, lf(RED_A, on("L08", 5)) + i * 3)} stamp={pop(f, chk + i * 3)} />)}
      <Thread pts={[[120, 860], [540, 820], [960, 860]]} k={ease(f, lf(RED_A, on("L08", 5)), chk)} dark width={7} bead={false} />
    </Svg>
    <div style={{ position: "absolute", top: 1860, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 22, color: alpha("#FFFFFF", 0.8) }}>Illustrative</div>
    <Kinetic dark offset={RED_A} top={190} lines={KW("L08", [[0, 1, 2]], { 0: "dim", 1: "big", 2: "big" })} exitAt={on("L08", 3) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L08", [[3, 4, 5, 6], [7, 8, 9]], { 3: "dim", 4: "base", 5: "accent", 6: "base", 7: "dim", 8: "dim", 9: "base" })} exitAt={on("L08", 10) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L08", [[10, 11, 12]], { 10: "dim", 11: "accent", 12: "big" })} />
  </DarkWorld>);
};

const CtaScene: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <PhoneCTA msg="CHECKLIST" typeAt={on("L09", 3) - CTA_A} sendAt={on("L09", 9) - CTA_A} pillAt={on("L09", 9) - CTA_A - 0.2} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L09", [[0, 1, 2]], { 0: "dim", 1: "dim", 2: "accent" })} exitAt={on("L09", 3) - 0.05} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L09", [[3], [4], [5, 6, 7], [8, 9]], { 3: "base", 4: "big", 5: "dim", 6: "base", 7: "base", 8: "dim", 9: "accent" })} />
</AbsoluteFill>);

export const AKV_005_FIVE_DOCS: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const win = (a: number, b: number) => interpolate(f, [fr(a), fr(a) + 8, fr(b) - 8, fr(b)], [0, 1, 1, 0], clamp);
  const tradeO = Math.max(win(CARDS_A, CARDS_B), win(CTA_A, END_A));
  const inRed = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_B + 0.3}><MapScene /></Span>
      <Span a={STORE_A} b={STORE_B}><Store /></Span>
      <Span a={PRICE_A} b={PRICE_B}><PriceScene /></Span>
      <Span a={SIGN_A} b={SIGN_B}><SignScene /></Span>
      <Span a={CARDS_A} b={CARDS_B + 0.5}><CardsScene /></Span>
      <Span a={CTA_A} b={CTA_B}><CtaScene /></Span>
      <Reveal r={r} cx={540} cy={1200}><Span a={RED_A} b={RED_B + 0.4}><RedScene /></Span></Reveal>
      <div style={{ position: "absolute", top: t >= CTA_A - 0.3 ? 1770 : 1690, left: 150, right: 150, padding: "10px 18px", borderRadius: 16, background: alpha("#FFFFFF", 0.88), textAlign: "center", fontFamily: TEXT, fontSize: 23, fontWeight: 500, color: C.dim, opacity: inRed ? 0 : tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {t > 0.6 && t < END_A && <CornerBug dark={inRed} />}
      <Span a={END_A} b={T.total}><FinalCard today="N'Djamena" highlight="TD" reviewed="2026-11-11" extraPins={["N'Djamena"]} /></Span>
    </AbsoluteFill>
  );
};
