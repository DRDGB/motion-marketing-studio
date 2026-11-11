// CCV-002 « ChapChapCV, c'est quoi ? »: product intro with the REAL app screens (client-supplied, D-007) + ChapClaw (D-008).
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
import { MapLayer, AFRICA_BOX, fit, Pin, CITIES, Box } from "../../lib/map";
import { Person, SKIN } from "../../lib/people";
import { CVDoc } from "../../lib/ccv_icons";
import { CtaPanel, CcvEndCard, Screen, screenBox } from "../../lib/ccv_end";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const CCV_002_APP_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const PUNCT = /^[«»:;!?.,…"']+$/;
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.filter((i) => ws[i] && !PUNCT.test(ws[i].w)).map((i) => ({ text: ws[i].w.replace(/[«»]/g, ""), t: ws[i].t, style: st[i] ?? def })));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };
const lf = (a: number, g: number) => fr(g - a);

// client screens (natural sizes)
const HOME = { src: "ui/ui_home_cv.png", nat: [460, 830] as [number, number] };
const EDITOR = { src: "ui/ui_cv_editor_ats.png", nat: [477, 837] as [number, number] };
const JOBS = { src: "ui/ui_jobs_home.png", nat: [459, 858] as [number, number] };
const OFFER = { src: "ui/ui_job_offer.png", nat: [491, 856] as [number, number] };
const PORTF = { src: "ui/ui_portfolio_home.png", nat: [434, 848] as [number, number] };
const CY = 1150, H = 1230;

const AWA = { look: { skin: SKIN.brown, hair: "braids" as const }, outfit: { top: "blouse" as const, topColor: "#FFFFFF", bottom: "skirt" as const, bottomColor: "#18181B" } };
const KOFFI = { look: { skin: SKIN.deep, hair: "cap" as const, wrap: C.accent }, outfit: { top: "tee" as const, topColor: "#065F46", bottom: "trousers" as const, bottomColor: "#2B2E35" } };

const INTRO_B = on("L01", 11) - 0.1;
const HOME_A = INTRO_B, HOME_B = AT("L03") - 0.1;
const CV_A = HOME_B, CV_B = AT("L04") - 0.1;
const JOB_A = CV_B, JOB_M = on("L04", 10) - 0.05, JOB_B = AT("L05") - 0.1;
const PF_A = JOB_B, PF_B = AT("L06") - 0.25;
const RED_A = AT("L06") - 0.5, RED_B = AT("L08") - 0.25;
const CTA_A = RED_B, CTA_B = AT("L09") - 0.1;
const END_A = CTA_B;

const Pill: React.FC<{ n: number; text: string; o: number }> = ({ n, text, o }) => (
  <div style={{ position: "absolute", top: 455, width: "100%", display: "flex", justifyContent: "center", opacity: o }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", border: `4px solid ${C.ink}`, borderRadius: 40, padding: "8px 26px 8px 8px", fontFamily: TEXT, fontWeight: 800, fontSize: 36, color: C.ink }}>
      <span style={{ width: 52, height: 52, borderRadius: 26, background: C.accent, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</span>{text}
    </div>
  </div>
);
const Ring: React.FC<{ x: number; y: number; r: number; p: number; t: number }> = ({ x, y, r, p, t }) => {
  const ph = (t * 1.4) % 1;
  return <svg width={1080} height={1920} style={{ position: "absolute" }}><circle cx={x} cy={y} r={r * (1 + 0.5 * ph)} fill="none" stroke={C.accent} strokeWidth={7} opacity={p * (1 - ph)} /><circle cx={x} cy={y} r={r} fill="none" stroke={C.accent} strokeWidth={8} opacity={p} /></svg>;
};
const Box2: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}><rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx={18} fill="none" stroke={C.accent} strokeWidth={8} opacity={p} strokeDasharray={2 * (w + h + 40)} strokeDashoffset={2 * (w + h + 40) * (1 - p)} /></svg>
);

const IntroScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const box: Box = [-200, -200, 260, 60];
  const frame: [number, number, number, number] = [60, 560, 960, 640];
  const { P } = fit(box, frame);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} dim={0.3} showIndia={false} highlight="CI" hk={0.6} />
      {["Abidjan", "Dakar", "Douala"].map((c, i) => { const [x, y] = P(CITIES[c] as [number, number]); return <Pin key={c} x={x} y={y} p={pop(f, 4 + i * 8)} size={0.8} label={c} />; })}
      <Person x={300} y={1880} s={0.66} {...AWA} face="neutral" blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
      <Person x={780} y={1880} s={0.66} {...KOFFI} face="neutral" blink={blinkAt(t, 1.3)} prop="phone" armR={{ up: 30, low: -100 }} />
    </Svg>
    <Kinetic offset={0} top={150} lines={KW("L01", [[0, 1, 2, 3]], { 0: "dim", 1: "base", 2: "dim", 3: "accent" })} exitAt={on("L01", 5) - 0.05} />
    <Kinetic offset={0} top={150} lines={KW("L01", [[5, 6, 7], [8, 9]], { 5: "dim", 6: "base", 7: "dim", 8: "base", 9: "accent" })} />
  </AbsoluteFill>);
};

const HomeScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const up = ease(f, 0, 14);
  const b = screenBox(HOME.nat, 540, CY, H);
  const [sx, sy] = b.P(200, 156);
  const sw = ease(f, lf(HOME_A, on("L02", 3) - 0.1), lf(HOME_A, on("L02", 3)) + 8);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - up) * 500}px)`, opacity: up }}><Screen {...HOME} cx={540} cy={CY} h={H} /></div>
    <Box2 x={sx - 165 * b.s} y={sy - 24 * b.s} w={330 * b.s} h={48 * b.s} p={sw} />
    {[0, 1, 2].map((i) => { const p = pop(f, lf(HOME_A, on("L02", 3)) + 6 + i * 4); const [x] = b.P(85 + i * 115, 0); return <div key={i} style={{ position: "absolute", left: x - 28, top: sy + 24 * b.s + 18, width: 56, height: 56, borderRadius: 28, background: C.accent, color: "#FFFFFF", fontFamily: TEXT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${p})` }}>{i + 1}</div>; })}
    <Kinetic offset={HOME_A} top={150} lines={KW("L01", [[11, 12, 13], [15]], { 11: "dim", 12: "base", 13: "dim", 15: "accent" })} exitAt={AT("L02") - 0.05} />
    <Kinetic offset={HOME_A} top={150} lines={KW("L02", [[0, 1, 2], [3, 4], [5, 6]], { 0: "dim", 1: "dim", 2: "base", 3: "accent", 4: "big", 5: "dim", 6: "base" })} />
  </AbsoluteFill>);
};

const CvScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const inn = ease(f, 0, 12);
  const b = screenBox(EDITOR.nat, 540, CY + 60, H);
  const [ax, ay] = b.P(97, 733);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Screen {...EDITOR} cx={540} cy={CY + 60} h={H} dx={(1 - inn) * 900} />
    <Ring x={ax} y={ay} r={42 * b.s} p={ease(f, lf(CV_A, on("L03", 10) - 0.1), lf(CV_A, on("L03", 10)) + 6)} t={t} />
    <Pill n={1} text="ChapChapCV" o={pop(f, 2)} />
    <Kinetic offset={CV_A} top={150} lines={KW("L03", [[3, 4], [5, 6, 7]], { 3: "accent", 4: "base", 5: "dim", 6: "dim", 7: "base" })} exitAt={on("L03", 8) - 0.05} />
    <Kinetic offset={CV_A} top={150} lines={KW("L03", [[8, 9, 10, 11], [12, 13, 14, 15]], { 8: "dim", 9: "dim", 10: "base", 11: "accent", 12: "dim", 13: "dim", 14: "dim", 15: "base" })} />
  </AbsoluteFill>);
};

const JobScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const m = lf(JOB_A, JOB_M);
  const inn = ease(f, 0, 12), swap = ease(f, m, m + 10);
  const b = screenBox(OFFER.nat, 540, CY + 60, H);
  const [px, py] = b.P(262, 492);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Screen {...JOBS} cx={540} cy={CY + 60} h={H} dx={(1 - inn) * 900 - swap * 900} o={1 - swap} />
    <Screen {...OFFER} cx={540} cy={CY + 60} h={H} dx={(1 - swap) * 900} o={swap} />
    <Box2 x={px - 118 * b.s} y={py - 24 * b.s} w={236 * b.s} h={48 * b.s} p={ease(f, m + 6, m + 20)} />
    <Pill n={2} text="ChapChap Jobs" o={pop(f, 2)} />
    <Kinetic offset={JOB_A} top={150} lines={KW("L04", [[4, 5, 6], [7, 8, 9]], { 4: "dim", 5: "base", 6: "accent", 7: "dim", 8: "dim", 9: "big" })} exitAt={on("L04", 10) - 0.05} />
    <Kinetic offset={JOB_A} top={150} lines={KW("L04", [[10, 11, 12], [13, 14, 15]], { 10: "dim", 11: "dim", 12: "accent", 13: "dim", 14: "dim", 15: "base" })} />
  </AbsoluteFill>);
};

const PortfolioScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const inn = ease(f, 0, 12);
  const b = screenBox(PORTF.nat, 500, CY + 60, H);
  const [lx, ly] = b.P(40, 232);
  const qr = pop(f, lf(PF_A, on("L05", 10) - 0.1), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Screen {...PORTF} cx={500} cy={CY + 60} h={H} dx={(1 - inn) * 900} />
    <Box2 x={lx} y={ly} w={340 * b.s} h={42 * b.s} p={ease(f, lf(PF_A, on("L05", 9) - 0.1), lf(PF_A, on("L05", 13)))} />
    <svg width={1080} height={1920} style={{ position: "absolute" }}><g transform={`translate(905 1420) scale(${qr})`}>
      <rect x={-85} y={-85} width={170} height={170} rx={14} fill="#FFFFFF" stroke={C.ink} strokeWidth={6} />
      {Array.from({ length: 49 }).map((_, i) => ((i * 7 + 3) % 5 < 2 || [0, 6, 42].includes(i)) ? <rect key={i} x={-70 + (i % 7) * 20} y={-70 + Math.floor(i / 7) * 20} width={18} height={18} fill={C.ink} /> : null)}
    </g></svg>
    <Pill n={3} text="ChapChap Portfolio" o={pop(f, 2)} />
    <Kinetic offset={PF_A} top={150} lines={KW("L05", [[4, 5, 6], [7, 8]], { 4: "dim", 5: "base", 6: "dim", 7: "dim", 8: "accent" })} exitAt={on("L05", 9) - 0.05} />
    <Kinetic offset={PF_A} top={150} lines={KW("L05", [[9, 10], [11, 12, 13]], { 9: "dim", 10: "accent", 11: "dim", 12: "big", 13: "base" })} />
  </AbsoluteFill>);
};

const ClawScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + RED_A;
  const grow = ease(f, lf(RED_A, on("L06", 6) - 0.2), lf(RED_A, on("L06", 7)) + 6);
  const q = pop(f, lf(RED_A, on("L07", 0)), 9), a = pop(f, lf(RED_A, on("L07", 8)), 9);
  const upd = ease(f, lf(RED_A, on("L07", 12)), lf(RED_A, on("L07", 15)) + 6);
  const W = 120 + 760 * grow, Hh = 120 + 900 * grow;
  return (<DarkWorld>
    <div style={{ position: "absolute", left: 540 - W / 2, top: 1180 - Hh / 2, width: W, height: Hh, borderRadius: 60 - 24 * grow, background: grow < 0.05 ? C.accent : "#FFFFFF", boxShadow: "0 30px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
      {grow < 0.3 && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, color: "#FFFFFF", background: C.accent }}>🤖</div>}
      {grow > 0.3 && <div style={{ opacity: ease(f, lf(RED_A, on("L06", 7)), lf(RED_A, on("L06", 7)) + 8) }}>
        <div style={{ height: 110, background: C.accent, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", color: "#FFFFFF", fontFamily: TEXT, fontWeight: 800, fontSize: 40 }}><span style={{ width: 64, height: 64, borderRadius: 32, background: "#FFFFFF", color: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🤖</span>ChapClaw · agent IA</div>
        <div style={{ position: "absolute", top: 160, right: 30, maxWidth: 560, background: C.accent, color: "#FFFFFF", borderRadius: "28px 28px 6px 28px", padding: "22px 28px", fontFamily: TEXT, fontWeight: 700, fontSize: 34, opacity: q, transform: `scale(${0.8 + 0.2 * q})`, transformOrigin: "right top" }}>Adapte mon CV pour un poste de commercial</div>
        <div style={{ position: "absolute", top: 330, left: 30, maxWidth: 560, background: alpha(C.support[0], 0.12), color: C.ink, borderRadius: "28px 28px 28px 6px", padding: "22px 28px", fontFamily: TEXT, fontWeight: 700, fontSize: 34, opacity: a, transform: `scale(${0.8 + 0.2 * a})`, transformOrigin: "left top" }}>C'est fait ✓ Titre, résumé et compétences mis à jour.</div>
        <svg width={760} height={420} style={{ position: "absolute", top: 520, left: 60 }}><g transform="translate(380 220) scale(0.62)"><CVDoc x={0} y={0} fill={1} hl={upd > 0.3 ? [1, 2, 5] : []} name="Koffi A." /></g></svg>
      </div>}
    </div>
    <div style={{ position: "absolute", top: 1760, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 24, color: alpha("#FFFFFF", 0.8) }}>Exemple illustratif</div>
    <Kinetic dark offset={RED_A} top={150} lines={KW("L06", [[0, 1, 2], [3, 4, 5]], { 0: "dim", 1: "dim", 2: "base", 3: "dim", 4: "base", 5: "accent" })} exitAt={on("L06", 6) - 0.05} />
    <Kinetic dark offset={RED_A} top={150} lines={KW("L06", [[6], [7], [8, 9, 10]], { 6: "base", 7: "accent", 8: "dim", 9: "base", 10: "base" })} exitAt={on("L07", 0) - 0.05} />
    <Kinetic dark offset={RED_A} top={150} lines={KW("L07", [[0, 1, 2, 3, 4, 5, 6]], { 0: "dim", 1: "dim", 2: "base", 3: "dim", 4: "dim", 5: "dim", 6: "base" })} exitAt={on("L07", 8) - 0.05} />
    <Kinetic dark offset={RED_A} top={150} lines={KW("L07", [[8, 9, 10, 11], [12, 13, 14, 15]], { 8: "dim", 9: "accent", 10: "dim", 11: "base", 12: "dim", 13: "accent", 14: "dim", 15: "base" })} exitAt={on("L07", 16) - 0.05} />
    <Kinetic dark offset={RED_A} top={150} lines={KW("L07", [[16, 17]], { 16: "accent", 17: "accent" })} />
  </DarkWorld>);
};

const CtaScene: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <CtaPanel urlAt={lf(CTA_A, on("L08", 2) - 0.1)} btnAt={lf(CTA_A, on("L08", 7) - 0.1)} noteAt={lf(CTA_A, on("L08", 9))} />
  <Kinetic offset={CTA_A} top={180} lines={KW("L08", [[0, 1]], { 0: "base", 1: "dim" })} exitAt={on("L08", 3) - 0.05} />
  <Kinetic offset={CTA_A} top={180} lines={KW("L08", [[3, 4, 5], [7, 8, 9]], { 3: "dim", 4: "base", 5: "dim", 7: "accent", 8: "base", 9: "accent" })} />
</AbsoluteFill>);

export const CCV_002_APP: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const inGreen = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={INTRO_B + 0.3}><IntroScene /></Span>
      <Span a={HOME_A} b={HOME_B}><HomeScene /></Span>
      <Span a={CV_A} b={CV_B}><CvScene /></Span>
      <Span a={JOB_A} b={JOB_B}><JobScene /></Span>
      <Span a={PF_A} b={PF_B + 0.5}><PortfolioScene /></Span>
      <Span a={CTA_A} b={CTA_B}><CtaScene /></Span>
      <Reveal r={r} cx={540} cy={1180}><Span a={RED_A} b={RED_B + 0.4}><ClawScene /></Span></Reveal>
      {t > 0.6 && t < END_A && <CornerBug dark={inGreen} />}
      <Span a={END_A} b={T.total}><CcvEndCard lead="Abidjan, Dakar, Douala…" services="CV · Jobs · Portfolio · ChapClaw · @chapchapcv" footer="Écrans de l'application ChapChapCV · Exemples illustratifs · Voix générée par IA" /></Span>
    </AbsoluteFill>
  );
};
