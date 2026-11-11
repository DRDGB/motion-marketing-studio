// CCV-001 « Pas d'expérience ? Pas de problème. » : Awa, Abidjan (French, scenario format D-005).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import TL from "./timeline.json";
import WORDS from "./words.json";
import { Backdrop, DarkWorld, Reveal, revealRadius } from "../../lib/stage";
import { Kinetic } from "../../lib/kinetic";
import { CornerBug } from "../../lib/endcard";
import { WordEntry, WStyle, KWord, fr, ease, pop, clamp } from "../../lib/time";
import { Timeline } from "../types";
import { B, C, TEXT, DISPLAY, alpha } from "../../theme";
import { Thread, Pt } from "../../lib/thread";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN, Bubble } from "../../lib/people";
import { Clock } from "../../lib/icons";
import { Phone, AppBar, QCard, CVDoc, Sticky, JobCard, SiteCard, CyberShop, Taxi, Street, Thought } from "../../lib/ccv_icons";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const CCV_001_AWA_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const PUNCT = /^[«»:;!?.,…"']+$/;
/** Caption rows by word index; pure punctuation tokens are skipped. */
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.filter((i) => ws[i] && !PUNCT.test(ws[i].w)).map((i) => ({ text: ws[i].w.replace(/[«»]/g, ""), t: ws[i].t, style: st[i] ?? def })));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };
const lf = (a: number, g: number) => fr(g - a);
const Label: React.FC<{ text: string; top?: number; dark?: boolean }> = ({ text, top = 1650, dark }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 24, fontWeight: 600, color: dark ? alpha("#FFFFFF", 0.8) : C.dim }}>{text}</div>
);

const AWA = { look: { skin: SKIN.brown, hair: "braids" as const }, outfit: { top: "blouse" as const, topColor: "#FFFFFF", bottom: "skirt" as const, bottomColor: "#18181B" } };
const COUSIN = { look: { skin: SKIN.deep, hair: "cap" as const, wrap: C.accent }, outfit: { top: "tee" as const, topColor: "#065F46", bottom: "trousers" as const, bottomColor: "#2B2E35" } };

const MAP_B = on("L01", 3) - 0.1;
const STREET_A = MAP_B, STREET_B = AT("L02") - 0.1;
const DESK_A = STREET_B, DESK_B = AT("L03") - 0.1;
const CYBER_A = DESK_B, CYBER_B = AT("L04") - 0.25;
const RED_A = AT("L04") - 0.5, RED_B = AT("L05") - 0.25;
const Q_A = RED_B, Q_B = AT("L06") - 0.1;
const NOTE_A = Q_B, NOTE_B = AT("L07") - 0.1;
const JOBS_A = NOTE_B, JOBS_B = AT("L08") - 0.1;
const APPLY_A = JOBS_B, APPLY_B = AT("L09") - 0.1;
const CTA_A = APPLY_B, CTA_B = AT("L10") - 0.1;
const END_A = CTA_B;

const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const k = interpolate(t, [0.1, 1.9], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const box = lerpBox(AFRICA_BOX, boxOf("CI", 0.6), k) as Box;
  const frame: [number, number, number, number] = [40, 560, 1000, 1000];
  const { P } = fit(box, frame);
  const [x, y] = P(CITIES.Abidjan as [number, number]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="CI" hk={ease(f, 14, 34)} dim={ease(f, 10, 45) * 0.6} showIndia={false} />
      <Pin x={x} y={y} p={pop(f, fr(on("L01", 0) - 0.1), 10)} size={1.1} />
      <text x={x + 40} y={y + 70} fontFamily={DISPLAY} fontSize={56} fontWeight={800} fill={C.ink} opacity={ease(f, fr(on("L01", 0)), fr(on("L01", 0)) + 8)}>Abidjan</text>
      <Flag iso="CI" x={110} y={1240} w={210} h={140} t={t} raise={ease(f, fr(on("L01", 1) - 0.3), fr(on("L01", 1) + 0.5))} />
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 540, background: `linear-gradient(${C.bg} 82%, transparent)` }} />
    <Kinetic offset={0} lines={KW("L01", [[0], [1, 2]], { 0: "big", 1: "base", 2: "accent" })} />
  </AbsoluteFill>);
};

const StreetScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + STREET_A;
  const taxi = interpolate(f, [0, lf(STREET_A, STREET_B)], [-260, 1300], clamp);
  return (<AbsoluteFill>
    <Svg>
      <Street y0={1560} />
      <Taxi x={taxi} y={1700} s={0.9} />
      <Person x={600} y={1660} s={0.72} {...AWA} face="smile" blink={blinkAt(t)} prop="clipboard" armR={{ up: 30, low: -60 }} />
      <Thought x={790} y={820} s={pop(f, lf(STREET_A, on("L01", 15) - 0.3), 10)} text="STAGE" />
    </Svg>
    <div style={{ position: "absolute", top: 110, left: 60, fontFamily: TEXT, fontSize: 24, color: C.dim }}>Histoire illustrative</div>
    <Kinetic offset={STREET_A} lines={KW("L01", [[3], [4, 5], [6, 7, 8]], { 3: "accent", 4: "base", 5: "dim", 6: "base", 7: "dim", 8: "dim" })} exitAt={on("L01", 9) - 0.05} />
    <Kinetic offset={STREET_A} lines={KW("L01", [[9, 10, 11], [13, 14], [15]], { 9: "dim", 10: "dim", 11: "accent", 13: "dim", 14: "base", 15: "big" })} />
  </AbsoluteFill>);
};

const DeskScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + DESK_A;
  const q = pop(f, lf(DESK_A, on("L02", 8) - 0.1), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <rect x={0} y={1380} width={1080} height={40} fill={alpha(C.ink, 0.85)} />
      <CVDoc x={740} y={1080} s={0.95 * pop(f, 2)} fill={0} rot={4} />
      <Person x={290} y={1860} s={0.68} {...AWA} face={t > on("L02", 5) ? "worried" : "neutral"} brows={t > on("L02", 5) ? "up" : "flat"} blink={blinkAt(t)} armL={{ up: -20, low: -150 }} />
      {q > 0 && <Bubble x={560} y={820} w={720} text="Je mets quoi sur mon CV ?" tx={400} ty={980} p={q} size={46} italic />}
    </Svg>
    <Kinetic offset={DESK_A} lines={KW("L02", [[0, 1, 2], [3, 4]], { 0: "dim", 1: "dim", 2: "dim", 3: "base", 4: "accent" })} exitAt={on("L02", 5) - 0.05} />
    <Kinetic offset={DESK_A} lines={KW("L02", [[5, 6]], { 5: "base", 6: "big" })} exitAt={on("L02", 8) - 0.05} />
    <Kinetic offset={DESK_A} lines={KW("L02", [[8, 9, 10], [11]], { 8: "dim", 9: "dim", 10: "dim", 11: "accent" })} />
  </AbsoluteFill>);
};

const CyberScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + CYBER_A;
  const tag = pop(f, lf(CYBER_A, on("L03", 15) - 0.1), 9);
  const clock = pop(f, lf(CYBER_A, on("L03", 18) - 0.2), 9);
  return (<AbsoluteFill>
    <Svg>
      <Street y0={1560} />
      <CyberShop x={760} y={1440} s={0.85 * pop(f, 2)} tag={tag} />
      <Person x={260} y={1840} s={0.66} {...COUSIN} face="smile" blink={blinkAt(t)} armR={{ up: 95, low: 95 }} />
      <Person x={470} y={1860} s={0.62} {...AWA} face={t > on("L03", 15) ? "worried" : "neutral"} blink={blinkAt(t, 1)} />
      <Clock x={860} y={820} s={0.9 * clock} t={(t * 0.9) % 1} />
    </Svg>
    <Label text="Exemple illustratif" top={1880} />
    <Kinetic offset={CYBER_A} lines={KW("L03", [[0, 1, 2, 3]], { 0: "dim", 1: "base", 2: "dim", 3: "dim" })} exitAt={on("L03", 6) - 0.05} />
    <Kinetic offset={CYBER_A} lines={KW("L03", [[6, 7, 8], [9, 10, 11, 12, 13]], { 6: "base", 7: "dim", 8: "accent", 9: "dim", 10: "dim", 11: "dim", 12: "base", 13: "base" })} exitAt={on("L03", 15) - 0.05} />
    <Kinetic offset={CYBER_A} lines={KW("L03", [[15, 16], [17, 18]], { 15: "base", 16: "accent", 17: "dim", 18: "big" })} />
  </AbsoluteFill>);
};

const GreenScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + RED_A;
  const s = 0.78, ex = 540, ey = 1820;
  const phone: Pt = [ex + 42 * s, ey - 610 * s];
  const logo = pop(f, lf(RED_A, on("L04", 4) - 0.1), 10);
  return (<DarkWorld>
    <Svg>
      <circle cx={540} cy={1390} r={360} fill={alpha("#FFFFFF", 0.96)} />
      <Person x={ex} y={ey} s={s} {...AWA} face={t > on("L04", 3) ? "big-smile" : "surprised"} blink={blinkAt(t)} armR={{ up: 30, low: -100 }} prop="phone" />
      <Thread pts={[[1120, 700], [900, 860], [760, 1100], phone]} k={ease(f, lf(RED_A, on("L04", 0)), lf(RED_A, on("L04", 3)))} width={11} />
      <g transform={`translate(540 860) scale(${logo})`}><rect x={-230} y={-70} width={460} height={140} rx={30} fill="#FFFFFF" /><image href={staticFile(B.logo ?? "brand/logo.png")} x={-200} y={-50} width={400} height={100} preserveAspectRatio="xMidYMid meet" /></g>
    </Svg>
    <Kinetic dark offset={RED_A} top={190} lines={KW("L04", [[0, 1]], { 0: "big", 1: "accent" })} exitAt={on("L04", 3) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L04", [[5, 6, 7, 8], [9], [10, 11, 12]], { 5: "base", 6: "base", 7: "dim", 8: "base", 9: "accent", 10: "dim", 11: "dim", 12: "base" })} exitAt={on("L04", 13) - 0.05} />
    <Kinetic dark offset={RED_A} top={190} lines={KW("L04", [[13, 14]], { 13: "accent", 14: "accent" })} />
  </DarkWorld>);
};

const QScene: React.FC = () => {
  const f = useCurrentFrame();
  const qs = ["Ton nom", "Le poste visé", "Ton parcours", "Tes compétences"];
  const gen = ease(f, lf(Q_A, on("L05", 6)), lf(Q_A, on("L05", 9)) + 10);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Phone x={540} y={1170} s={0.82 * (0.9 + 0.1 * pop(f, 2))}>
        <AppBar />
        {gen < 0.05 ? qs.map((q, i) => <QCard key={q} y={170 + i * 132} n={i + 1} label={q} p={pop(f, 4 + i * 11, 9)} done={f > 50 + i * 4} />) : null}
        {gen >= 0.05 && <CVDoc x={240} y={540} s={0.98} fill={gen} />}
      </Phone>
    </Svg>
    <Label text="Exemple illustratif" top={1640} />
    <Kinetic offset={Q_A} top={160} lines={KW("L05", [[0, 1, 2], [3, 4]], { 0: "dim", 1: "base", 2: "dim", 3: "accent", 4: "base" })} exitAt={on("L05", 5) - 0.05} />
    <Kinetic offset={Q_A} top={160} lines={KW("L05", [[5, 6], [7, 8, 9]], { 5: "dim", 6: "accent", 7: "big", 8: "dim", 9: "base" })} />
  </AbsoluteFill>);
};

const NoteScene: React.FC = () => {
  const f = useCurrentFrame();
  const fly = ease(f, lf(NOTE_A, on("L06", 8) - 0.1), lf(NOTE_A, on("L06", 13)) + 6);
  const n1 = pop(f, lf(NOTE_A, on("L06", 0)), 9), n2 = pop(f, lf(NOTE_A, on("L06", 5)), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <CVDoc x={540} y={1300} s={1.1} fill={1} hl={fly > 0.6 ? [2, 6] : []} />
      <g opacity={1 - fly}>
        <Sticky x={330 + 120 * fly} y={760 + 420 * fly} s={1.05 * n1 * (1 - 0.6 * fly)} rot={-5} text="Projet de fin d'études" />
        <Sticky x={740 - 120 * fly} y={930 + 470 * fly} s={1.05 * n2 * (1 - 0.6 * fly)} rot={4} text="Bénévolat" color="#FFD0B8" />
      </g>
      {fly > 0.6 && <text x={540} y={1640} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={48} fill={C.accent} opacity={ease(f, lf(NOTE_A, on("L06", 12)), lf(NOTE_A, on("L06", 12)) + 8)}>POINTS FORTS</text>}
    </Svg>
    <Label text="Exemple illustratif" top={1700} />
    <Kinetic offset={NOTE_A} top={160} lines={KW("L06", [[0, 1], [2, 3, 4]], { 0: "dim", 1: "base", 2: "dim", 3: "dim", 4: "base" })} exitAt={on("L06", 5) - 0.05} />
    <Kinetic offset={NOTE_A} top={160} lines={KW("L06", [[5, 6]], { 5: "dim", 6: "big" })} exitAt={on("L06", 8) - 0.05} />
    <Kinetic offset={NOTE_A} top={160} lines={KW("L06", [[8, 9, 10], [11, 12, 13]], { 8: "accent", 9: "dim", 10: "base", 11: "dim", 12: "base", 13: "big" })} />
  </AbsoluteFill>);
};

const JobsScene: React.FC = () => {
  const f = useCurrentFrame();
  const sw = lf(JOBS_A, on("L07", 4) - 0.1);
  const site = ease(f, sw, sw + 10);
  const jobs = [["Assistante marketing", "Abidjan · Stage"], ["Chargée de clientèle", "Abidjan · CDD"], ["Assistante RH", "Bouaké · Stage"]];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g opacity={1 - site}>{jobs.map(([a, b], i) => <JobCard key={a} x={540} y={760 + i * 200} s={pop(f, 4 + i * 6)} title={a} place={b} verified={ease(f, lf(JOBS_A, on("L07", 3)) + i * 3, lf(JOBS_A, on("L07", 3)) + 8 + i * 3)} />)}</g>
      <g opacity={site}><SiteCard x={540} y={1050} s={1.25 * (0.8 + 0.2 * site)} url="chapchapcv.com/p/awa" qr={pop(f, lf(JOBS_A, on("L07", 11)))} /></g>
    </Svg>
    <Label text="Exemples illustratifs" top={1460} />
    <Kinetic offset={JOBS_A} top={160} lines={KW("L07", [[0], [1, 2, 3]], { 0: "dim", 1: "dim", 2: "base", 3: "accent" })} exitAt={on("L07", 4) - 0.05} />
    <Kinetic offset={JOBS_A} top={160} lines={KW("L07", [[4, 5, 6], [7, 8], [9, 10, 11, 12]], { 4: "dim", 5: "dim", 6: "base", 7: "dim", 8: "accent", 9: "dim", 10: "dim", 11: "base", 12: "big" })} />
  </AbsoluteFill>);
};

const ApplyScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + APPLY_A;
  const press = lf(APPLY_A, on("L08", 7));
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      {f > press && Array.from({ length: 18 }).map((_, i) => { const a = (i / 18) * Math.PI * 2; const r = 60 + (f - press) * 9; return <circle key={i} cx={760 + r * Math.cos(a)} cy={900 + r * Math.sin(a) + (f - press) * 2} r={10} fill={i % 3 ? C.accent : C.support[0]} opacity={Math.max(0, 1 - (f - press) / 30)} />; })}
      <g transform={`translate(760 900) scale(${f > press && f < press + 6 ? 0.92 : 1})`}><rect x={-170} y={-55} width={340} height={110} rx={55} fill={C.accent} /><text x={0} y={16} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={44} fill="#FFFFFF">Postuler</text></g>
      <Person x={330} y={1860} s={0.72} {...AWA} face="big-smile" blink={blinkAt(t)} prop="phone" armR={{ up: 30, low: -100 }} />
    </Svg>
    <Kinetic offset={APPLY_A} top={160} lines={KW("L08", [[0, 1, 2, 3]], { 0: "accent", 1: "dim", 2: "dim", 3: "big" })} exitAt={on("L08", 4) - 0.05} />
    <Kinetic offset={APPLY_A} top={160} lines={KW("L08", [[4, 5], [6, 7], [8, 9]], { 4: "dim", 5: "dim", 6: "dim", 7: "base", 8: "dim", 9: "accent" })} />
  </AbsoluteFill>);
};

const CtaScene: React.FC = () => {
  const f = useCurrentFrame();
  const url = pop(f, lf(CTA_A, on("L09", 5) - 0.1), 9), btn = pop(f, lf(CTA_A, on("L09", 9) - 0.1), 9);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", top: 760, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 104, color: C.ink, transform: `scale(${0.8 + 0.2 * url})`, opacity: url }}>chapchap<span style={{ color: C.accent }}>cv</span>.com</div>
    <div style={{ position: "absolute", top: 930, width: "100%", display: "flex", justifyContent: "center", opacity: btn, transform: `scale(${0.85 + 0.15 * btn})` }}>
      <div style={{ background: C.accent, color: "#FFFFFF", borderRadius: 70, padding: "26px 64px", fontFamily: TEXT, fontWeight: 800, fontSize: 56 }}>Créer mon CV</div>
    </div>
    <div style={{ position: "absolute", top: 1090, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 700, fontSize: 40, color: C.dim, opacity: btn }}>@chapchapcv</div>
    <div style={{ position: "absolute", top: 1220, left: 120, right: 120, textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 34, color: C.ink, opacity: ease(f, lf(CTA_A, on("L09", 14)), lf(CTA_A, on("L09", 14)) + 8), lineHeight: 1.3 }}>Créez gratuitement.<br />Payez uniquement ce que vous utilisez.</div>
    <Kinetic offset={CTA_A} top={180} lines={KW("L09", [[0, 1], [3, 4]], { 0: "base", 1: "accent", 3: "dim", 4: "dim" })} exitAt={on("L09", 13) - 0.05} />
    <Kinetic offset={CTA_A} top={180} lines={KW("L09", [[13, 14, 15], [16, 17, 18, 19, 20]], { 13: "dim", 14: "base", 15: "accent", 16: "dim", 17: "base", 18: "dim", 19: "dim", 20: "big" })} />
  </AbsoluteFill>);
};

const PINS = ["Abidjan", "Dakar", "Douala", "Accra", "Lagos", "Kinshasa", "Nairobi"];
const EndCard: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const frame: [number, number, number, number] = [330, 1060, 420, 420];
  const { P } = fit(AFRICA_BOX, frame);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <image href={staticFile(B.logo ?? "brand/logo.png")} x={190} y={190} width={700} height={170 * pop(f, 2)} preserveAspectRatio="xMidYMid meet" />
      <MapLayer box={AFRICA_BOX} frame={frame} dim={0.4} showIndia={false} highlight="CI" hk={1} />
      {PINS.map((c, i) => { const [x, y] = P(CITIES[c] as [number, number]); const p = pop(f, fr(1.0 + i * 0.2)); const ph = (t * 1.2 + i * 0.3) % 1; return <g key={c}><circle cx={x} cy={y} r={7 + 18 * ph * p} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - ph) * p} /><circle cx={x} cy={y} r={7 * p} fill={i === 0 ? C.accent : C.ink} /></g>; })}
    </Svg>
    <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 70, color: C.ink, opacity: ease(f, 6, 16) }}>Ton CV. Ton job. <span style={{ color: C.accent }}>Chap chap.</span></div>
    <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", justifyContent: "center", opacity: ease(f, 12, 20) }}>
      <div style={{ background: C.accent, color: "#FFFFFF", borderRadius: 60, padding: "18px 48px", fontFamily: TEXT, fontWeight: 800, fontSize: 40 }}>Créer mon CV</div>
    </div>
    <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 800, fontSize: 64, color: C.ink, opacity: ease(f, 16, 24) }}>chapchapcv.com</div>
    <div style={{ position: "absolute", top: 800, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 34, color: C.dim, opacity: ease(f, 18, 26) }}>CV · Offres d'emploi · Portfolio · @chapchapcv</div>
    <div style={{ position: "absolute", top: 1520, left: 70, right: 70, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 50, color: C.ink, lineHeight: 1.15, opacity: ease(f, 40, 52) }}>
      Abidjan aujourd'hui. <span style={{ color: C.accent }}>Et toi, tu es où ?</span>
      <div style={{ fontFamily: TEXT, fontSize: 32, fontWeight: 600, color: C.dim, marginTop: 10 }}>Dis-le en commentaire.</div>
    </div>
    <div style={{ position: "absolute", top: 1790, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 21, color: C.dim }}>Histoire et exemples illustratifs · Voix générée par IA</div>
  </AbsoluteFill>);
};

export const CCV_001_AWA: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const inGreen = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_B + 0.3}><MapScene /></Span>
      <Span a={STREET_A} b={STREET_B}><StreetScene /></Span>
      <Span a={DESK_A} b={DESK_B}><DeskScene /></Span>
      <Span a={CYBER_A} b={CYBER_B + 0.5}><CyberScene /></Span>
      <Span a={Q_A} b={Q_B}><QScene /></Span>
      <Span a={NOTE_A} b={NOTE_B}><NoteScene /></Span>
      <Span a={JOBS_A} b={JOBS_B}><JobsScene /></Span>
      <Span a={APPLY_A} b={APPLY_B}><ApplyScene /></Span>
      <Span a={CTA_A} b={CTA_B}><CtaScene /></Span>
      <Reveal r={r} cx={540} cy={1200}><Span a={RED_A} b={RED_B + 0.4}><GreenScene /></Span></Reveal>
      {t > 0.6 && t < END_A && <CornerBug dark={inGreen} />}
      <Span a={END_A} b={T.total}><EndCard /></Span>
    </AbsoluteFill>
  );
};
