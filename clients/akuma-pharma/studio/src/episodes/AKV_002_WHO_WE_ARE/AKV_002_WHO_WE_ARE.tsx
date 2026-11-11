// AKV-002 v2 "What is Akuma Pharma?": short pan-African brand intro (D-022/D-023/D-024).
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
import { PharmaPlant, Doc, Pharmacy } from "../../lib/akuma_icons";
import { MapLayer, AFRICA_BOX, boxOf, fit, Pin, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN } from "../../lib/people";
import { PharmacyInterior } from "../../lib/pharmacy_scene";
import { PhoneCTA, FinalCard } from "../../lib/akuma_end";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_002_WHO_WE_ARE_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const show = (w: string, nx?: string, pv?: string) => (w === "W-H-O" && nx === "G-M-P" ? "WHO-GMP" : w === "G-M-P" && pv === "W-H-O" ? "" : w.replace(/"/g, ""));
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.map((i) => ({ text: show(ws[i].w, ws[i + 1]?.w, ws[i - 1]?.w), t: ws[i].t, style: st[i] ?? def })).filter((k) => k.text !== ""));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const L = (f: number, a: number, g: number) => fr(g - a); // global second g → local frame in a Span starting at a
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// anchors
const MAP_B = AT("L02") - 0.15;
const SHELF_A = MAP_B, SHELF_B = AT("L03") - 0.2;
const RED_A = AT("L03") - 0.5, RED_B = AT("L04") - 0.25;
const IND_A = RED_B, IND_B = AT("L05") - 0.15;
const STEPS_A = IND_B, STEPS_B = AT("L06") - 0.12;
const CITIES_A = STEPS_B, CITIES_B = AT("L07") - 0.15;
const PHONE_A = CITIES_B, PHONE_B = AT("L08") - 0.1;
const END_A = PHONE_B;

// cast (illustrative)
const OWNER = { look: { skin: SKIN.deep, hair: "wrap" as const, wrap: C.accent }, outfit: { top: "blouse" as const, topColor: "#FFFFFF", bottom: "skirt" as const, bottomColor: "#16181D" } };
const DISTRIB = { look: { skin: SKIN.brown, hair: "short" as const, beard: true }, outfit: { top: "shirt" as const, topColor: "#3D5A80", bottom: "trousers" as const, bottomColor: "#2B2E35" } };
const BUYER = { look: { skin: SKIN.warm, hair: "cap" as const, wrap: "#16181D" }, outfit: { top: "shirt" as const, topColor: "#E9ECEF", bottom: "trousers" as const, bottomColor: "#5B606B" } };
const AK_PHARM = { look: { skin: SKIN.light, hair: "short" as const, glasses: true }, outfit: { top: "coat" as const, topColor: "#FFFFFF", under: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35" } };
const AK_COORD = { look: { skin: SKIN.light, hair: "bun" as const }, outfit: { top: "shirt" as const, topColor: C.accent, bottom: "trousers" as const, bottomColor: "#16181D" } };

const PersonCard: React.FC<{ x: number; y: number; p: number; iso: string; city: string; country: string; who: any; prop?: any; t: number; id: string }> = ({ x, y, p, iso, city, country, who, prop, t, id }) => (
  <g transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * p})`} opacity={Math.min(1, p * 1.5)}>
    <defs><clipPath id={`cp-${id}`}><rect x={0} y={0} width={330} height={260} rx={24} /></clipPath></defs>
    <rect x={0} y={0} width={330} height={260} rx={24} fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
    <g clipPath={`url(#cp-${id})`}>
      <rect x={0} y={0} width={330} height={260} fill={alpha(C.accent, 0.06)} />
      <Person x={262} y={360} s={0.27} {...who} face="neutral" blink={blinkAt(t, x)} prop={prop ?? "none"} armR={prop === "clipboard" ? { up: 30, low: -60 } : { up: 12, low: 6 }} />
    </g>
    <Flag iso={iso} x={22} y={22} w={84} h={56} t={t} pole={false} />
    <text x={22} y={120} fontFamily={DISPLAY} fontSize={34} fontWeight={700} fill={C.ink}>{city}</text>
    <text x={22} y={156} fontFamily={TEXT} fontSize={24} fontWeight={700} letterSpacing={3} fill={C.dim}>{country}</text>
  </g>
);

const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const frame: [number, number, number, number] = [200, 700, 680, 960];
  const { P } = fit(AFRICA_BOX, frame);
  const pt = (c: string) => P(CITIES[c] as [number, number]);
  const cards = [
    { city: "Douala", country: "CAMEROON", iso: "CM", who: OWNER, at: on("L01", 1), x: 40, y: 1400, prop: "bag" },
    { city: "Nairobi", country: "KENYA", iso: "KE", who: DISTRIB, at: on("L01", 2), x: 710, y: 1150, prop: "none" },
    { city: "N'Djamena", country: "CHAD", iso: "TD", who: BUYER, at: on("L01", 4), x: 40, y: 760, prop: "clipboard" },
  ];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={AFRICA_BOX} frame={frame} dim={0.3} showIndia={false} />
      {cards.map((c, i) => { const p = pop(f, fr(c.at - 0.1), 9); const [px, py] = pt(c.city); const cx = c.x + 165, cy = c.y + 130;
        return <g key={i}><path d={`M ${px} ${py} L ${cx} ${cy}`} stroke={C.accent} strokeWidth={4} strokeDasharray="10 8" opacity={p} /><Pin x={px} y={py} p={p} size={0.55} /><PersonCard id={`c${i}`} x={c.x} y={c.y} p={p} iso={c.iso} city={c.city} country={c.country} who={c.who} prop={c.prop} t={t} /></g>; })}
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 560, background: `linear-gradient(${C.bg} 85%, transparent)` }} />
    <Kinetic offset={0} top={160} lines={KW("L01", [[0, 1], [2], [3, 4]], { 0: "base", 1: "accent", 2: "accent", 3: "base", 4: "accent" })} exitAt={on("L01", 5) - 0.05} />
    <Kinetic offset={0} top={160} lines={KW("L01", [[5, 6], [7, 8, 9, 10, 11]], { 5: "dim", 6: "big", 7: "dim", 8: "base", 9: "dim", 10: "dim", 11: "accent" })} />
  </AbsoluteFill>);
};

const ShelfScene: React.FC = () => {
  const f = useCurrentFrame();
  const tag = pop(f, L(f, SHELF_A, on("L02", 7)), 8);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg><PharmacyInterior top={640} empty={[0.1, 0.85 * ease(f, 0, 30), 0.3]} tags={[0, tag, 0]} light={0.3} /></Svg>
    <Kinetic offset={SHELF_A} top={160} lines={KW("L02", [[0, 1, 2, 3], [4, 5, 6], [7, 8]], { 0: "dim", 1: "base", 2: "dim", 3: "accent", 4: "dim", 5: "dim", 6: "base", 7: "big", 8: "accent" })} />
  </AbsoluteFill>);
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame();
  const p = pop(f, L(f, RED_A, on("L03", 3)), 10);
  return (<DarkWorld>
    <Svg>
      <circle cx={540} cy={1180} r={250 * p} fill={alpha("#FFFFFF", 0.12)} />
      <image href={staticFile("brand/logo-on-red.svg")} x={540 - 170 * p} y={1180 - 170 * p} width={340 * p} height={340 * p} />
    </Svg>
    <Kinetic dark offset={RED_A} top={240} lines={KW("L03", [[0, 1, 2], [3, 4]], { 0: "base", 1: "base", 2: "base", 3: "big", 4: "accent" })} />
  </DarkWorld>);
};

const IndiaScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30 + IND_A;
  const box = boxOf("IN", 0.25) as Box;
  const frame: [number, number, number, number] = [180, 560, 720, 760];
  const { P } = fit(box, frame);
  const [mx, my] = P(CITIES.Mohali as [number, number]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="IN" hk={ease(f, 2, 14)} dim={0.6} />
      <Pin x={mx} y={my} p={pop(f, 8)} size={0.8} />
      <text x={mx + 40} y={my - 40} fontFamily={DISPLAY} fontSize={44} fontWeight={700} fill={C.ink} opacity={ease(f, 10, 18)}>Punjab, India</text>
      <Person x={360} y={1880} s={0.56} {...AK_PHARM} face="smile" blink={blinkAt(t)} prop="clipboard" armR={{ up: 30, low: -60 }} />
      <Person x={730} y={1880} s={0.56} {...AK_COORD} face="big-smile" blink={blinkAt(t, 1.4)} prop="phone" armR={{ up: 116, low: -128 }} armL={{ up: 150, low: 170 + 12 * Math.sin(t * 8) }} />
    </Svg>
    <div style={{ position: "absolute", top: 1840, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 24, color: C.dim }}>Illustrative</div>
    <Kinetic offset={IND_A} top={160} lines={KW("L04", [[0, 1, 2, 3], [4, 5], [6, 7]], { 0: "dim", 1: "dim", 2: "dim", 3: "base", 4: "accent", 5: "base", 6: "dim", 7: "big" })} />
  </AbsoluteFill>);
};

const StepsScene: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [
    { at: on("L05", 1), y: 760, label: "FIND", sub: "WHO-GMP certified manufacturers" },
    { at: on("L05", 6), y: 1110, label: "CHECK", sub: "the manufacturer's documents" },
    { at: on("L05", 9), y: 1460, label: "DELIVER", sub: "we follow your order to your door" },
  ];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Thread pts={[[270, 760], [250, 940], [270, 1110], [290, 1290], [270, 1460]]} k={ease(f, L(f, STEPS_A, rows[0].at), L(f, STEPS_A, rows[2].at) + 12)} width={8} bead={false} />
      {rows.map((r, i) => { const p = pop(f, L(f, STEPS_A, r.at - 0.1), 9); return (<g key={i} opacity={Math.min(1, p * 1.5)}>
        {i === 0 && <PharmaPlant x={270} y={r.y} s={0.55 * p} />}
        {i === 1 && <Doc x={270} y={r.y} s={0.62 * p} stamp={pop(f, L(f, STEPS_A, r.at + 0.4))} />}
        {i === 2 && <><Pharmacy x={270} y={r.y + 20} s={0.42 * p} /><Knot x={320} y={r.y + 80} k={ease(f, L(f, STEPS_A, r.at + 0.3), L(f, STEPS_A, r.at + 1.0))} s={0.5} /></>}
        <text x={500} y={r.y + 10} fontFamily={DISPLAY} fontSize={104} fontWeight={700} fill={i === 1 ? C.accent : C.ink}>{r.label}</text>
        <text x={504} y={r.y + 64} fontFamily={TEXT} fontSize={28} fontWeight={600} fill={C.dim}>{r.sub}</text>
      </g>); })}
    </Svg>
    <div style={{ position: "absolute", top: 640, left: 120, fontFamily: TEXT, fontSize: 22, color: C.dim, opacity: ease(f, 6, 14) }}>Illustrative</div>
    <Kinetic offset={STEPS_A} top={170} lines={KW("L05", [[0, 1]], { 0: "dim", 1: "big" })} exitAt={on("L05", 6) - 0.05} />
    <Kinetic offset={STEPS_A} top={170} lines={KW("L05", [[6, 7, 8]], { 6: "big", 7: "dim", 8: "base" })} exitAt={on("L05", 9) - 0.05} />
    <Kinetic offset={STEPS_A} top={170} lines={KW("L05", [[9, 10, 11], [12, 13, 14]], { 9: "dim", 10: "big", 11: "dim", 12: "dim", 13: "dim", 14: "accent" })} />
  </AbsoluteFill>);
};

const CitiesScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const box: Box = [-200, -420, 1000, 380];
  const frame: [number, number, number, number] = [30, 600, 1020, 1000];
  const { P } = fit(box, frame);
  const mo = P(CITIES.Mohali as [number, number]) as Pt;
  const list = [["Douala", 0], ["Nairobi", 1], ["N'Djamena", 2], ["Accra", 3]] as const;
  const anyAt = on("L06", 4);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="IN" dim={0.2} showIndia />
      {list.map(([c, i]) => { const pt = P(CITIES[c] as [number, number]) as Pt; const mid: Pt = [(pt[0] + mo[0]) / 2, Math.min(pt[1], mo[1]) - 140 - i * 30]; const at = on("L06", i);
        return <g key={c}><Thread pts={[mo, mid, pt]} k={ease(f, L(f, CITIES_A, at - 0.3), L(f, CITIES_A, at + 0.4))} width={6} bead={false} /><Pin x={pt[0]} y={pt[1]} p={pop(f, L(f, CITIES_A, at))} size={0.6} /><text x={pt[0] + ({ Douala: -20, Nairobi: 24, "N'Djamena": 20, Accra: -24 } as Record<string, number>)[c]} y={pt[1] + ({ Douala: 58, Nairobi: 52, "N'Djamena": -30, Accra: 52 } as Record<string, number>)[c]} textAnchor={c === "Accra" || c === "Douala" ? "end" : "start"} fontFamily={DISPLAY} fontSize={40} fontWeight={700} fill={C.ink} opacity={ease(f, L(f, CITIES_A, at), L(f, CITIES_A, at) + 6)}>{c}</text></g>; })}
      {["Lagos", "Abidjan", "Kinshasa", "Addis Ababa", "Dar es Salaam", "Johannesburg", "Dakar"].map((c, i) => { const [x, y] = P(CITIES[c] as [number, number]); const p = pop(f, L(f, CITIES_A, anyAt + i * 0.08)); const ph = (t * 1.3 + i * 0.25) % 1; return <g key={c}><circle cx={x} cy={y} r={6 + 22 * ph * p} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - ph) * p} /><circle cx={x} cy={y} r={7 * p} fill={C.ink} /></g>; })}
      <image href={staticFile("brand/logo.svg")} x={mo[0] - 50} y={mo[1] - 170} width={100} height={100} />
    </Svg>
    <Kinetic offset={CITIES_A} top={170} lines={KW("L06", [[0, 1], [2, 3]], { 0: "base", 1: "base", 2: "base", 3: "base" })} exitAt={anyAt - 0.05} />
    <Kinetic offset={CITIES_A} top={170} lines={KW("L06", [[4], [5, 6]], { 4: "big", 5: "dim", 6: "accent" })} />
  </AbsoluteFill>);
};

const PhoneScene: React.FC = () => (<AbsoluteFill style={{ background: C.bg }}>
  <PhoneCTA msg="Hi Akuma Pharma, here is my product list" typeAt={on("L07", 0) - PHONE_A + 0.1} attachAt={on("L07", 4) - PHONE_A} sendAt={on("L07", 7) - PHONE_A} pillAt={on("L07", 6) - PHONE_A} />
  <Kinetic offset={PHONE_A} top={150} lines={KW("L07", [[0, 1, 2], [3, 4], [5, 6, 7]], { 0: "base", 1: "dim", 2: "dim", 3: "base", 4: "base", 5: "dim", 6: "accent", 7: "big" })} />
</AbsoluteFill>);

export const AKV_002_WHO_WE_ARE: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.55), fr(RED_B - 0.25), fr(RED_B + 0.3));
  const win = (a: number, b: number) => interpolate(f, [fr(a), fr(a) + 8, fr(b) - 8, fr(b)], [0, 1, 1, 0], clamp);
  const tradeO = Math.max(win(STEPS_A, CITIES_B), win(PHONE_A, END_A));
  const inRed = t > RED_A + 0.55 && t < RED_B - 0.25;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_B + 0.3}><MapScene /></Span>
      <Span a={SHELF_A} b={SHELF_B + 0.5}><ShelfScene /></Span>
      <Span a={IND_A} b={IND_B}><IndiaScene /></Span>
      <Span a={STEPS_A} b={STEPS_B}><StepsScene /></Span>
      <Span a={CITIES_A} b={CITIES_B}><CitiesScene /></Span>
      <Span a={PHONE_A} b={PHONE_B}><PhoneScene /></Span>
      <Reveal r={r} cx={540} cy={1180}><Span a={RED_A} b={RED_B + 0.4}><RedScene /></Span></Reveal>
      <div style={{ position: "absolute", top: t >= PHONE_A - 0.3 ? 1770 : 1690, left: 150, right: 150, padding: "10px 18px", borderRadius: 16, background: alpha("#FFFFFF", 0.88), textAlign: "center", fontFamily: TEXT, fontSize: 23, fontWeight: 500, color: C.dim, opacity: inRed ? 0 : tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {t > 0.6 && t < END_A && <CornerBug dark={inRed} />}
      <Span a={END_A} b={T.total}><FinalCard today="Africa" lead="Douala, Nairobi, N'Djamena, Accra…" reviewed="2026-11-11" illustrative extraPins={["Douala", "Nairobi", "N'Djamena", "Accra"]} /></Span>
    </AbsoluteFill>
  );
};
