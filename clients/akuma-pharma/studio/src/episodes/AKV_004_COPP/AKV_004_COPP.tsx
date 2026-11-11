// AKV-004 v2 "What is a CoPP?": Wanjiru, Nairobi (scenario + education, D-022/D-023). CoPP facts: W-001…W-003.
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
import { Thread, Pt } from "../../lib/thread";
import { Doc, Folder, MedCarton, Carton } from "../../lib/akuma_icons";
import { Building, Check, Cross } from "../../lib/icons";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN } from "../../lib/people";
import { PhoneCTA, FinalCard } from "../../lib/akuma_end";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_004_COPP_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const show = (w: string, nx?: string, pv?: string) => w.replace("C-O-P-P", "CoPP").replace("W-H-O", "WHO");
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.map((i) => ({ text: show(ws[i].w, ws[i + 1]?.w, ws[i - 1]?.w), t: ws[i].t, style: st[i] ?? def })));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };
const lf = (a: number, g: number) => fr(g - a);

const WANJIRU = { look: { skin: SKIN.brown, hair: "puff" as const }, outfit: { top: "shirt" as const, topColor: "#16181D", bottom: "trousers" as const, bottomColor: "#5B606B" } };
const AK_COORD = { look: { skin: SKIN.light, hair: "bun" as const }, outfit: { top: "shirt" as const, topColor: "#FFFFFF", bottom: "trousers" as const, bottomColor: "#16181D" } };

const MAP_B = on("L01", 2) - 0.1;
const WH_A = MAP_B, WH_B = AT("L02") - 0.1;
const FILE_A = WH_B, FILE_B = AT("L03") - 0.1;
const DOC_A = FILE_B, DOC_B = AT("L04") - 0.1;
const AUTH_A = DOC_B, AUTH_B = AT("L05") - 0.1;
const OLD_A = AUTH_B, OLD_B = AT("L06") - 0.25;
const RED_A = AT("L06") - 0.5, RED_B = AT("L07") - 0.25;
const OK_A = RED_B, OK_B = AT("L08") - 0.1;
const CTA_A = OK_B, CTA_B = AT("L09") - 0.1;
const END_A = CTA_B;

const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const k = interpolate(t, [0.1, 2.0], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const box = lerpBox(AFRICA_BOX, boxOf("KE", 0.6), k) as Box;
  const frame: [number, number, number, number] = [40, 560, 1000, 1000];
  const { P } = fit(box, frame);
  const [nx, ny] = P(CITIES.Nairobi as [number, number]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="KE" hk={ease(f, 16, 36)} dim={ease(f, 10, 45) * 0.6} showIndia={false} />
      <Pin x={nx} y={ny} p={pop(f, fr(on("L01", 0) - 0.1), 10)} size={1.1} />
      <text x={nx - 40} y={ny + 70} textAnchor="end" fontFamily={DISPLAY} fontSize={56} fontWeight={700} fill={C.ink} opacity={ease(f, fr(on("L01", 0)), fr(on("L01", 0)) + 8)}>Nairobi</text>
      <Flag iso="KE" x={110} y={1220} w={210} h={140} t={t} raise={ease(f, fr(on("L01", 1) - 0.3), fr(on("L01", 1) + 0.5))} />
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 540, background: `linear-gradient(${C.bg} 82%, transparent)` }} />
    <Kinetic offset={0} lines={KW("L01", [[0, 1]], { 0: "base", 1: "accent" })} />
  </AbsoluteFill>);
};

const Warehouse: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + WH_A;
  return (<AbsoluteFill style={{ background: "#F6F2EC" }}>
    <Svg>
      <rect x={0} y={1500} width={1080} height={420} fill="#E6E0D6" />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <Carton key={`${r}-${c}`} x={560 + c * 118 - (r % 2) * 40} y={1420 - r * 150} s={0.42 * pop(f, 2 + (r * 5 + c) * 1.2)} />))}
      <Person x={260} y={1860} s={0.66} {...WANJIRU} face="smile" blink={blinkAt(t)} prop="clipboard" armR={{ up: 30, low: -60 }} />
    </Svg>
    <div style={{ position: "absolute", top: 110, left: 60, fontFamily: TEXT, fontSize: 24, color: C.dim }}>Illustrative story</div>
    <Kinetic offset={WH_A} lines={KW("L01", [[2], [3, 4, 5], [6, 7]], { 2: "accent", 3: "dim", 4: "dim", 5: "base", 6: "base", 7: "big" })} />
  </AbsoluteFill>);
};

const FileScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + FILE_A;
  const note = pop(f, lf(FILE_A, on("L02", 10) - 0.1), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Folder x={640} y={1130} s={1.5 * pop(f, 2)} />
      <text x={640} y={1060} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={34} letterSpacing={4} fill={C.ink} opacity={ease(f, 6, 14)}>REGISTRATION FILE</text>
      <g transform={`translate(800 1230) rotate(8) scale(${note})`}>
        <rect x={-150} y={-70} width={300} height={140} rx={6} fill="#FFE27A" stroke={C.ink} strokeWidth={5} />
        <text x={0} y={-12} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={36} fill={C.accent}>MISSING:</text>
        <text x={0} y={40} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={44} fill={C.ink}>CoPP</text>
      </g>
      <Person x={230} y={1860} s={0.62} {...WANJIRU} face="worried" brows="up" blink={blinkAt(t)} armL={{ up: -20, low: -150 }} />
    </Svg>
    <Kinetic offset={FILE_A} lines={KW("L02", [[0, 1], [2, 3]], { 0: "dim", 1: "base", 2: "dim", 3: "accent" })} exitAt={on("L02", 4) - 0.05} />
    <Kinetic offset={FILE_A} lines={KW("L02", [[4, 5, 6], [7, 8], [9, 10]], { 4: "dim", 5: "base", 6: "dim", 7: "base", 8: "base", 9: "dim", 10: "big" })} />
  </AbsoluteFill>);
};

const DocScene: React.FC = () => {
  const f = useCurrentFrame();
  const who = pop(f, lf(DOC_A, on("L03", 11) - 0.1), 9);
  const hl = (i: number) => ease(f, lf(DOC_A, on("L03", i)), lf(DOC_A, on("L03", i)) + 6);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g transform={`translate(540 1180) scale(${0.85 + 0.15 * pop(f, 2)})`}>
        <rect x={-300} y={-420} width={600} height={840} rx={18} fill="#FFFFFF" stroke={C.ink} strokeWidth={8} />
        <rect x={-300} y={-420} width={600} height={60} rx={18} fill={C.ink} />
        <text x={0} y={-378} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={24} letterSpacing={4} fill="#FFFFFF">ILLUSTRATIVE</text>
        {[["CERTIFICATE", 5, -270], ["OF A PHARMACEUTICAL", 7, -210], ["PRODUCT", 8, -150]].map(([txt, i, y]) => (
          <text key={String(txt)} x={0} y={Number(y)} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={40} fill={hl(Number(i)) > 0.5 ? C.accent : C.ink}>{String(txt)}</text>
        ))}
        {[-60, -10, 40, 90, 140, 190].map((y, i) => <rect key={y} x={-230} y={y} width={i % 2 ? 300 : 420} height={16} rx={8} fill={alpha(C.ink, 0.25)} />)}
        <g transform={`translate(170 300) scale(${who})`}>
          <rect x={-110} y={-40} width={220} height={80} rx={40} fill={C.accent} />
          <text x={0} y={14} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={34} fill="#FFFFFF">WHO format</text>
        </g>
      </g>
    </Svg>
    <div style={{ position: "absolute", top: 1650, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 30, color: C.dim }}>CoPP (WHO abbreviation: CPP) · Source: WHO TRS 1033, Annex 9</div>
    <Kinetic offset={DOC_A} lines={KW("L03", [[0, 1, 2, 3]], { 0: "dim", 1: "dim", 2: "dim", 3: "big" })} exitAt={on("L03", 4) - 0.05} />
    <Kinetic offset={DOC_A} lines={KW("L03", [[9, 10, 11, 12]], { 9: "dim", 10: "dim", 11: "accent", 12: "base" })} />
  </AbsoluteFill>);
};

const AuthScene: React.FC = () => {
  const f = useCurrentFrame();
  const notAt = lf(AUTH_A, on("L04", 11) - 0.1);
  const flow: Pt[] = [[300, 1000], [540, 900], [780, 1000]];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Building x={270} y={1150} s={0.8 * pop(f, 2)} kind="bank" />
      <text x={270} y={1240} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={26} letterSpacing={2} fill={C.ink} opacity={ease(f, 6, 14)}>NATIONAL AUTHORITY</text>
      <text x={270} y={1276} textAnchor="middle" fontFamily={TEXT} fontWeight={600} fontSize={24} fill={C.dim} opacity={ease(f, 6, 14)}>exporting country</text>
      <Thread pts={flow} k={ease(f, 10, 40)} width={8} />
      <Doc x={800} y={1100} s={0.75 * pop(f, 30)} stamp={pop(f, 44)} />
      <g opacity={ease(f, notAt, notAt + 8)}>
        <Building x={540} y={1650} s={0.6} kind="shop" />
        <text x={540} y={1715} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={26} letterSpacing={2} fill={C.dim}>SELLER</text>
        <Cross x={680} y={1520} s={0.8 * pop(f, notAt + 6)} />
      </g>
    </Svg>
    <Kinetic offset={AUTH_A} lines={KW("L04", [[0, 1, 2, 3], [4, 5, 6], [7, 8, 9, 10]], { 0: "dim", 1: "dim", 2: "base", 3: "dim", 4: "dim", 5: "base", 6: "accent", 7: "dim", 8: "dim", 9: "base", 10: "base" })} exitAt={on("L04", 11) - 0.05} />
    <Kinetic offset={AUTH_A} lines={KW("L04", [[11, 12, 13], [14]], { 11: "big", 12: "dim", 13: "dim", 14: "accent" })} />
  </AbsoluteFill>);
};

const OldSupplier: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + OLD_A;
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g transform={`translate(640 1150) scale(${0.62 + 0.08 * pop(f, 2)})`}>
        <rect x={-270} y={-520} width={540} height={1040} rx={64} fill="#16181D" />
        <rect x={-245} y={-490} width={490} height={980} rx={44} fill="#F6F2EC" />
        <rect x={-245} y={-490} width={490} height={130} rx={44} fill="#9AA0A8" />
        <rect x={-245} y={-410} width={490} height={50} fill="#9AA0A8" />
        <text x={-200} y={-400} fontFamily={TEXT} fontWeight={800} fontSize={34} fill="#FFFFFF">Old supplier</text>
        <rect x={-30} y={-200} width={250} height={90} rx={24} fill="#FFFFFF" stroke="#16181D" strokeWidth={4} />
        <text x={-10} y={-145} fontFamily={TEXT} fontWeight={700} fontSize={30} fill="#16181D">Any update?</text>
        <text x={220} y={-80} textAnchor="end" fontFamily={TEXT} fontWeight={600} fontSize={24} fill={C.accent} opacity={ease(f, lf(OLD_A, on("L05", 3)), lf(OLD_A, on("L05", 3)) + 8)}>Seen 3 weeks ago</text>
      </g>
      <Person x={230} y={1860} s={0.62} {...WANJIRU} face="sad" brows="up" blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
    </Svg>
    <Kinetic offset={OLD_A} lines={KW("L05", [[0, 1, 2], [3, 4], [5, 6]], { 0: "dim", 1: "base", 2: "accent", 3: "base", 4: "big", 5: "dim", 6: "accent" })} />
  </AbsoluteFill>);
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + RED_A;
  const chk = lf(RED_A, on("L06", 15) - 0.1);
  return (<DarkWorld>
    <Svg>
      <circle cx={300} cy={1400} r={300} fill={alpha("#FFFFFF", 0.95)} />
      <Person x={300} y={1820} s={0.6} {...AK_COORD} face="smile" blink={blinkAt(t)} prop="phone" armR={{ up: 116, low: -128 }} />
      <Thread pts={[[420, 1200], [600, 1050], [780, 1150]]} k={ease(f, lf(RED_A, on("L06", 7)), lf(RED_A, on("L06", 11)))} dark width={8} />
      <Doc x={800} y={1250} s={0.95 * pop(f, lf(RED_A, on("L06", 9)))} stamp={pop(f, chk)} />
      <g transform={`translate(${720 + 120 * ease(f, chk - 20, chk)} 1180)`} opacity={ease(f, chk - 24, chk - 16) * (1 - ease(f, chk + 4, chk + 12))}>
        <circle r={60} fill={alpha("#FFFFFF", 0.3)} stroke={C.ink} strokeWidth={10} /><rect x={38} y={38} width={20} height={70} rx={10} fill={C.ink} transform="rotate(-45 48 73)" />
      </g>
    </Svg>
    <div style={{ position: "absolute", top: 1750, left: 520, fontFamily: TEXT, fontSize: 24, color: alpha("#FFFFFF", 0.8) }}>Illustrative</div>
    <Kinetic dark offset={RED_A} top={190} lines={KW("L06", [[0, 1, 2]], { 0: "dim", 1: "big", 2: "big" })} exitAt={on("L06", 3) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L06", [[3, 4, 5, 6], [7, 8], [9, 10, 11]], { 3: "dim", 4: "base", 5: "dim", 6: "base", 7: "accent", 8: "dim", 9: "dim", 10: "dim", 11: "base" })} exitAt={on("L06", 12) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L06", [[12, 13], [14, 15, 16]], { 12: "dim", 13: "base", 14: "dim", 15: "accent", 16: "base" })} />
  </DarkWorld>);
};

const OkScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + OK_A;
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Folder x={700} y={1130} s={1.4 * pop(f, 2)} />
      <Check x={820} y={1010} s={1.1 * pop(f, 8)} k={ease(f, 8, 20)} />
      <Person x={260} y={1860} s={0.66} {...WANJIRU} face="big-smile" blink={blinkAt(t)} armL={{ up: 150, low: 165 + 10 * Math.sin(t * 8) }} />
    </Svg>
    <Kinetic offset={OK_A} lines={KW("L07", [[0, 1], [2, 3, 4, 5]], { 0: "base", 1: "accent", 2: "base", 3: "dim", 4: "base", 5: "big" })} />
  </AbsoluteFill>);
};

const CtaScene: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <PhoneCTA msg="Hi Akuma Pharma, product name for my registration: …" typeAt={on("L08", 6) - CTA_A} sendAt={on("L08", 12) - CTA_A + 0.2} pillAt={on("L08", 12) - CTA_A} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L08", [[0, 1], [2, 3, 4, 5]], { 0: "dim", 1: "base", 2: "dim", 3: "dim", 4: "dim", 5: "accent" })} exitAt={on("L08", 6) - 0.05} />
  <Kinetic offset={CTA_A} top={150} lines={KW("L08", [[6, 7, 8], [9, 10], [11, 12]], { 6: "base", 7: "dim", 8: "dim", 9: "base", 10: "accent", 11: "dim", 12: "big" })} />
</AbsoluteFill>);

export const AKV_004_COPP: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const win = (a: number, b: number) => interpolate(f, [fr(a), fr(a) + 8, fr(b) - 8, fr(b)], [0, 1, 1, 0], clamp);
  const tradeO = Math.max(win(AUTH_A, AUTH_B), win(CTA_A, END_A));
  const inRed = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_B + 0.3}><MapScene /></Span>
      <Span a={WH_A} b={WH_B}><Warehouse /></Span>
      <Span a={FILE_A} b={FILE_B}><FileScene /></Span>
      <Span a={DOC_A} b={DOC_B}><DocScene /></Span>
      <Span a={AUTH_A} b={AUTH_B}><AuthScene /></Span>
      <Span a={OLD_A} b={OLD_B + 0.5}><OldSupplier /></Span>
      <Span a={OK_A} b={OK_B}><OkScene /></Span>
      <Span a={CTA_A} b={CTA_B}><CtaScene /></Span>
      <Reveal r={r} cx={540} cy={1200}><Span a={RED_A} b={RED_B + 0.4}><RedScene /></Span></Reveal>
      <div style={{ position: "absolute", top: t >= CTA_A - 0.3 ? 1770 : 1800, left: 150, right: 150, padding: "10px 18px", borderRadius: 16, background: alpha("#FFFFFF", 0.88), textAlign: "center", fontFamily: TEXT, fontSize: 23, fontWeight: 500, color: C.dim, opacity: inRed ? 0 : tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {t > 0.6 && t < END_A && <CornerBug dark={inRed} />}
      <Span a={END_A} b={T.total}><FinalCard today="Nairobi" highlight="KE" reviewed="2026-11-11" extraPins={["Nairobi"]} /></Span>
    </AbsoluteFill>
  );
};
