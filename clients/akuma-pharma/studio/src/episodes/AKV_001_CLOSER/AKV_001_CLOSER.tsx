// AKV-001 v2 "Closer Than You Think": Emeka's pharmacy, Lagos (scenario format, D-022).
// Script + storyboard: episodes/AKV_001_CLOSER/SCRIPT_AND_VOICE.md. Timings: timeline.json / words.json (whisper map).
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
import { Thread, Knot, Pt } from "../../lib/thread";
import { PharmaPlant, Pharmacist, Doc, Plane, Ship, MedCarton, Pharmacy } from "../../lib/akuma_icons";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CountryLabel, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN, Bubble } from "../../lib/people";
import { PharmacyInterior, Counter } from "../../lib/pharmacy_scene";

const T = TL as unknown as Timeline;
const WL = WORDS as WordEntry[];
export const AKV_001_CLOSER_FRAMES = fr(T.total);
const clip = (id: string) => T.clips.find((c) => c.id === id)!;
const words = (id: string) => WL.filter((w) => w.clip === id);
const on = (id: string, i: number) => words(id)[i].t;
const AT = (id: string) => clip(id).at;
const show = (w: string, nx?: string, pv?: string) => (w === "W-H-O" && nx === "G-M-P" ? "WHO-GMP" : w === "G-M-P" && pv === "W-H-O" ? "" : w);
/** Caption rows from word indices of one line. */
const KW = (id: string, rows: number[][], st: Record<number, WStyle> = {}, def: WStyle = "base"): KWord[][] => {
  const ws = words(id);
  return rows.map((r) => r.map((i) => ({ text: show(ws[i].w, ws[i + 1]?.w, ws[i - 1]?.w), t: ws[i].t, style: st[i] ?? def })).filter((k) => k.text !== ""));
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;
/** Sequence between two global seconds; children get local frames. */
const Span: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => <Sequence from={fr(a)} durationInFrames={Math.max(1, fr(b) - fr(a))}>{children}</Sequence>;
const g = (f: number, a: number) => f / 30 + a; // local frame → global seconds (for a Span starting at a)

// ---------- cast ----------
const EMEKA = { look: { skin: SKIN.brown, hair: "short" as const, beard: true }, outfit: { top: "polo" as const, topColor: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35", badge: true } };
const ADA = { look: { skin: SKIN.warm, hair: "wrap" as const, wrap: "#16181D" }, outfit: { top: "coat" as const, topColor: "#FFFFFF", under: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35" } };
const TUNDE = { look: { skin: SKIN.deep, hair: "short" as const }, outfit: { top: "tee" as const, topColor: "#16181D", bottom: "trousers" as const, bottomColor: "#3D5A80" } };
const MAMA = { look: { skin: SKIN.deep, hair: "wrap" as const, wrap: C.accent }, outfit: { top: "blouse" as const, topColor: "#F2B8C0", bottom: "skirt" as const, bottomColor: C.accentDeep } };
const BABA = { look: { skin: SKIN.brown, hair: "grey" as const, glasses: true }, outfit: { top: "shirt" as const, topColor: "#E9ECEF", bottom: "trousers" as const, bottomColor: "#5B606B" } };
const YOUNG = { look: { skin: SKIN.light, hair: "short" as const }, outfit: { top: "tee" as const, topColor: "#3D5A80", bottom: "trousers" as const, bottomColor: "#2B2E35" } };
const blinkAt = (t: number, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };

// ---------- timing anchors (global seconds) ----------
const MAP_END = on("L01", 2) - 0.1;            // "This is Emeka" → into the pharmacy
const SHOP_A = MAP_END, SHOP_B = AT("L06") - 0.2; // first pharmacy stretch (L01 end … L05)
const RED_A = AT("L06") - 0.55, RED_B = AT("L08") - 0.25;
const PLANT_A = RED_B, PLANT_B = AT("L09") - 0.15;
const ROUTE_A = PLANT_B, ROUTE_B = on("L09", 6) - 0.05;
const DOOR_A = ROUTE_B, DOOR_B = AT("L10") - 0.15;
const FULL_A = DOOR_B, FULL_B = AT("L11") - 0.15;
const PHONE_A = FULL_B, PHONE_B = AT("L12") - 0.1;
const END_A = PHONE_B;

// ---------- scenes ----------
const MapScene: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const k = interpolate(t, [0.15, 2.3], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const box = lerpBox(AFRICA_BOX, boxOf("NG", 0.6), k) as Box;
  const frame: [number, number, number, number] = [40, 560, 1000, 1000];
  const { P } = fit(box, frame);
  const [lx, ly] = P(CITIES.Lagos as [number, number]);
  const lab = P([85, -105]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <MapLayer box={box} frame={frame} highlight="NG" hk={ease(f, 18, 40)} dim={ease(f, 10, 50) * 0.6} showIndia={false} />
      <CountryLabel x={lab[0]} y={lab[1]} text="NIGERIA" color="#FFFFFF" o={ease(f, 44, 54)} />
      <Pin x={lx} y={ly} p={pop(f, fr(on("L01", 0) - 0.1), 10)} size={1.1} />
      <text x={lx - 40} y={ly + 70} textAnchor="end" fontFamily={DISPLAY} fontSize={56} fontWeight={700} fill={C.ink} opacity={ease(f, fr(on("L01", 0)), fr(on("L01", 0)) + 8)}>Lagos</text>
      <Flag iso="NG" x={790} y={1180} w={210} h={140} t={t} raise={ease(f, fr(on("L01", 1) - 0.3), fr(on("L01", 1) + 0.5))} />
    </Svg>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 540, background: `linear-gradient(${C.bg} 82%, transparent)` }} />
    <Kinetic offset={0} lines={KW("L01", [[0, 1]], { 0: "base", 1: "accent" })} exitAt={MAP_END} />
  </AbsoluteFill>);
};

const Shop: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, SHOP_A);
  // shelves empty on "shelf … empty", tags on "Again."
  const em = interpolate(t, [on("L03", 3), on("L03", 5) + 0.6], [0, 1], clamp);
  const tag = pop(f, fr(on("L03", 6) - SHOP_A), 8);
  // customers: queue from L02, leave on "they walk"
  const leave = interpolate(t, [on("L05", 8), on("L05", 12) + 0.4], [0, 1], clamp);
  const cust = (i: number) => {
    const enter = ease(f, fr(AT("L02") - SHOP_A + i * 0.35), fr(AT("L02") - SHOP_A + i * 0.35 + 0.7));
    const x0 = [560, 750, 930][i];
    return { x: x0 + 520 * (1 - enter) - (x0 + 300) * leave, o: Math.min(enter, 1 - leave * 0.9), flip: leave > 0.02 };
  };
  const phase = t < AT("L02") ? "hello" : t < AT("L03") ? "serve" : t < AT("L04") ? "worry" : t < AT("L05") ? "phone" : "sad";
  const emekaFace = phase === "hello" ? "big-smile" : phase === "serve" ? "smile" : phase === "worry" ? "surprised" : phase === "phone" ? "worried" : "sad";
  const armR = phase === "phone" ? { up: 116, low: -128 } : { up: 14, low: 6 };
  const armL = phase === "hello" ? { up: 150, low: 170 + 15 * Math.sin(t * 9) } : { up: 14, low: 6 };
  const bubble = pop(f, fr(on("L04", 4) - SHOP_A - 0.15), 9);
  const typed = Math.max(0, Math.min(1, (t - on("L04", 4) + 0.1) / 0.9));
  const msg = '"Oga, next month."';
  return (
    <SceneCam dur={fr(SHOP_B - SHOP_A)} push={0.06} origin="40% 70%">
      <AbsoluteFill style={{ background: C.bg }}>
        <Svg>
          <PharmacyInterior top={560} empty={[em * 0.2, em, em * 0.95]} tags={[0, tag, tag]} light={1 - em * 0.7} />
          <Person x={650} y={1470} s={0.5} {...ADA} face={phase === "serve" ? "smile" : phase === "hello" ? "smile" : "worried"} blink={blinkAt(t, 1)} armR={phase === "serve" ? { up: 40, low: -40 } : { up: 14, low: 6 }} prop={phase === "serve" ? "bag" : "none"} />
          <Counter top={560} />
          {[0, 1, 2].map((i) => { const c = cust(i); const who = [MAMA, BABA, YOUNG][i]; return c.o > 0.01 ? <Person key={i} x={c.x} y={1890 - i * 12} s={0.5} o={c.o} {...who} flip={c.flip} face={leave > 0.05 ? "neutral" : "smile"} blink={blinkAt(t, i * 1.3)} prop={i === 1 ? "stick" : i === 2 ? "phone" : "none"} propSide={i === 2 ? "L" : "R"} armL={i === 2 ? { up: -20, low: -150 } : { up: 12, low: 6 }} /> : null; })}
          <Person x={230} y={1860} s={0.64} {...EMEKA} face={emekaFace} blink={blinkAt(t)} brows={phase === "phone" || phase === "sad" ? "up" : "flat"} armR={armR} armL={armL} prop={phase === "phone" ? "phone" : "none"} propSide="R" />
          {bubble > 0 && phase === "phone" && <Bubble x={720} y={1230} w={540} text={msg.slice(0, Math.max(1, Math.round(msg.length * typed)))} tx={430} ty={1290} p={bubble} size={50} italic />}
        </Svg>
        <Kinetic offset={SHOP_A} lines={KW("L01", [[2, 3, 4]], { 2: "dim", 3: "dim", 4: "accent" })} exitAt={on("L01", 5) - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L01", [[5, 6, 7, 8], [9]], { 5: "dim", 6: "dim", 7: "dim", 8: "dim", 9: "big" })} exitAt={AT("L02") - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L02", [[0, 1], [2, 3, 4]], { 0: "dim", 1: "base", 2: "base", 3: "base", 4: "accent" })} exitAt={on("L02", 5) - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L02", [[5, 6, 7], [8, 9, 10, 11, 12]], { 5: "dim", 6: "base", 7: "accent", 8: "dim", 9: "dim", 10: "dim", 11: "dim", 12: "base" })} exitAt={AT("L03") - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L03", [[0, 1], [2, 3, 4], [5, 6]], { 0: "dim", 1: "base", 2: "dim", 3: "base", 4: "dim", 5: "accent", 6: "big" })} exitAt={AT("L04") - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L04", [[0, 1, 2], [3]], { 0: "dim", 1: "base", 2: "dim", 3: "big" })} exitAt={AT("L05") - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L05", [[0, 1]], { 0: "big", 1: "accent" })} exitAt={on("L05", 2) - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L05", [[2, 3], [4, 5, 6, 7]], { 2: "dim", 3: "base", 4: "base", 5: "accent", 6: "dim", 7: "dim" })} exitAt={on("L05", 8) - 0.05} />
        <Kinetic offset={SHOP_A} lines={KW("L05", [[8, 9], [10, 11, 12]], { 8: "dim", 9: "base", 10: "dim", 11: "dim", 12: "accent" })} />
        {t < AT("L03") && <div style={{ position: "absolute", top: 110, left: 60, fontFamily: TEXT, fontSize: 24, color: C.dim }}>Illustrative story</div>}
      </AbsoluteFill>
    </SceneCam>
  );
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, RED_A);
  const s = 0.78, ex = 540, ey = 1760;
  const phone: Pt = [ex + 42 * s, ey - 610 * s];
  const mapIn = ease(f, fr(AT("L07") - RED_A - 0.3), fr(AT("L07") - RED_A + 0.3));
  const box: Box = [-200, -420, 1000, 380];
  const frame: [number, number, number, number] = [30, 640, 1020, 900];
  const { P } = fit(box, frame);
  const lagos = P(CITIES.Lagos as [number, number]) as Pt, mohali = P(CITIES.Mohali as [number, number]) as Pt;
  const mid: Pt = [(lagos[0] + mohali[0]) / 2, Math.min(lagos[1], mohali[1]) - 120];
  const tk = ease(f, fr(AT("L07") - RED_A), fr(on("L07", 6) - RED_A));
  return (
    <DarkWorld>
      <Svg>
        <g opacity={1 - mapIn}>
          <circle cx={540} cy={1330} r={360} fill={alpha("#FFFFFF", 0.95)} />
          <Person x={ex} y={ey} s={s} {...EMEKA} face={t > on("L06", 4) ? "smile" : "neutral"} brows={t > on("L06", 4) ? "up" : "flat"} blink={blinkAt(t)} armR={{ up: 30, low: -100 }} prop="phone" />
          <Thread pts={[[1120, 760], [900, 900], [760, 1180], phone]} k={ease(f, fr(on("L06", 4) - RED_A - 0.2), fr(on("L06", 7) - RED_A))} dark="ink" width={10} />
        </g>
        <g opacity={mapIn}>
          <MapLayer box={box} frame={frame} highlight="IN" dark showIndia />
          <Thread pts={[mohali, mid, lagos]} k={tk} dark bead width={10} />
          <Pin x={lagos[0]} y={lagos[1]} p={pop(f, fr(on("L07", 6) - RED_A))} dark size={0.9} />
          <image href={staticFile("brand/logo-on-red.svg")} x={mohali[0] - 60} y={mohali[1] - 240} width={120 * pop(f, fr(AT("L07") - RED_A))} height={120} />
          <text x={540} y={1650} textAnchor="middle" fontFamily={DISPLAY} fontSize={72} fontWeight={700} fill={C.light} opacity={ease(f, fr(on("L07", 1) - RED_A), fr(on("L07", 1) - RED_A) + 8)}>Akuma Pharma</text>
        </g>
      </Svg>
      <Kinetic dark offset={RED_A} top={170} lines={KW("L06", [[0], [1, 2, 3]], { 0: "big", 1: "base", 2: "base", 3: "base" })} exitAt={on("L06", 4) - 0.05} />
      <Kinetic dark offset={RED_A} top={170} lines={KW("L06", [[4, 5], [6, 7]], { 4: "base", 5: "base", 6: "accent", 7: "big" })} exitAt={AT("L07") - 0.05} />
      <Kinetic dark offset={RED_A} top={170} lines={KW("L07", [[2, 3, 4], [5, 6]], { 2: "base", 3: "base", 4: "base", 5: "dim", 6: "base" })} exitAt={on("L07", 7) - 0.05} />
      <Kinetic dark offset={RED_A} top={170} lines={KW("L07", [[7, 8, 9], [10]], { 7: "accent", 8: "base", 9: "base", 10: "big" })} />
    </DarkWorld>
  );
};

const PlantScene: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, PLANT_A);
  const loop: Pt[] = Array.from({ length: 13 }, (_, i) => { const a = Math.PI * 0.75 + (i / 12) * Math.PI * 2; return [540 + 430 * Math.cos(a), 1060 + 240 * Math.sin(a)] as Pt; });
  const docIn = ease(f, fr(on("L08", 8) - PLANT_A - 0.2), fr(on("L08", 8) - PLANT_A + 0.3));
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g opacity={1 - docIn * 0.85}><PharmaPlant x={540} y={1060} s={1.25 * pop(f, 2)} /><Thread pts={loop} k={ease(f, 6, 50)} width={8} /></g>
      <Pharmacist x={900} y={1450} s={0.5 * pop(f, 20)} arm={ease(f, 30, 45)} />
      <g opacity={docIn}><Doc x={520} y={1080} s={1.5 * (0.7 + 0.3 * docIn)} stamp={pop(f, fr(on("L08", 13) - PLANT_A - 0.1))} /></g>
    </Svg>
    <div style={{ position: "absolute", top: 1400, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 26, color: C.dim }}>{docIn < 0.5 ? "Illustrative example: partner manufacturer's site" : "Illustrative"}</div>
    <Kinetic offset={PLANT_A} lines={KW("L08", [[0, 1, 2], [3, 5], [6]], { 0: "dim", 1: "base", 2: "dim", 3: "big", 5: "accent", 6: "base" })} exitAt={on("L08", 7) - 0.05} />
    <Kinetic offset={PLANT_A} lines={KW("L08", [[7, 8, 9], [10], [11, 12, 13]], { 7: "dim", 8: "base", 9: "dim", 10: "accent", 11: "dim", 12: "dim", 13: "big" })} />
  </AbsoluteFill>);
};

const RouteScene: React.FC = () => {
  const f = useCurrentFrame(); const dur = fr(ROUTE_B - ROUTE_A);
  const p = ease(f, 0, dur * 0.6), q = ease(f, dur * 0.4, dur);
  const route: Pt[] = [[60, 1000], [300, 920], [560, 1000], [780, 1130], [1020, 1080]];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Thread pts={route} k={ease(f, 0, dur)} width={8} />
      <g opacity={1 - q}><Plane x={80 + 640 * p} y={950 - 30 * Math.sin(p * 3)} s={0.62} rot={90} /></g>
      <g opacity={q}><Ship x={280 + 420 * q} y={1280} s={0.9} /></g>
      {[0, 1, 2].map((i) => <MedCarton key={i} x={130 + i * 70} y={1400 - i * 30} s={0.55 * pop(f, 4 + i * 4)} />)}
    </Svg>
    <Kinetic offset={ROUTE_A} lines={KW("L09", [[0, 1, 2], [3, 4, 5]], { 0: "dim", 1: "dim", 2: "base", 3: "base", 4: "dim", 5: "accent" })} />
  </AbsoluteFill>);
};

const DoorScene: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, DOOR_A); const dur = fr(DOOR_B - DOOR_A);
  const walk = ease(f, 0, dur * 0.8);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <Pharmacy x={600} y={1250} s={1.5 * pop(f, 2)} />
      <Person x={-60 + 520 * walk} y={1860} s={0.6} {...TUNDE} face="smile" blink={blinkAt(t)} armL={{ up: -35, low: -95 }} armR={{ up: -35, low: -95 }} prop="box" />
      <Thread pts={[[-20, 820], [260, 760], [560, 980], [780, 1325]]} k={ease(f, 0, dur * 0.7)} />
      <Knot x={780} y={1338} k={ease(f, fr(on("L09", 13) - DOOR_A - 0.1), fr(on("L09", 13) - DOOR_A + 0.5))} s={0.9} />
    </Svg>
    <Kinetic offset={DOOR_A} lines={KW("L09", [[6, 7, 8, 9], [10, 11], [12, 13]], { 6: "dim", 7: "dim", 8: "dim", 9: "dim", 10: "base", 11: "accent", 12: "dim", 13: "big" })} />
  </AbsoluteFill>);
};

const FullShop: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, FULL_A);
  const refill = 1 - ease(f, 0, 30);
  return (
    <SceneCam dur={fr(FULL_B - FULL_A)} push={0.05} origin="50% 70%">
      <AbsoluteFill style={{ background: C.bg }}>
        <Svg>
          <PharmacyInterior top={560} empty={[0, refill, refill]} light={1} />
          <Person x={650} y={1470} s={0.5} {...ADA} face="big-smile" blink={blinkAt(t, 2)} armR={{ up: 40, low: -40 }} prop="bag" />
          <Counter top={560} />
          {[0, 1, 2].map((i) => <Person key={i} x={[560, 750, 930][i] + 400 * (1 - ease(f, 8 + i * 6, 26 + i * 6))} y={1890 - i * 12} s={0.5} {...[MAMA, BABA, YOUNG][i]} face="smile" blink={blinkAt(t, i)} prop={i === 1 ? "stick" : "none"} />)}
          <Person x={230} y={1860} s={0.64} {...EMEKA} face="big-smile" blink={blinkAt(t)} armL={{ up: 150, low: 170 + 12 * Math.sin(t * 8) }} />
        </Svg>
        <Kinetic offset={FULL_A} lines={KW("L10", [[0, 1], [2, 3], [4, 5, 6, 7]], { 0: "base", 1: "accent", 2: "base", 3: "accent", 4: "dim", 5: "dim", 6: "base", 7: "big" })} />
      </AbsoluteFill>
    </SceneCam>
  );
};

const PhoneScene: React.FC = () => {
  const f = useCurrentFrame(); const t = g(f, PHONE_A);
  const msg = "Hi Akuma Pharma, here is my product list";
  const typed = Math.max(0, Math.min(1, (t - on("L11", 4)) / 1.2));
  const sent = t > on("L11", 11);
  const press = sent ? 1 - 0.12 * Math.max(0, 1 - (t - on("L11", 11)) / 0.25) : 1;
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <g transform={`translate(540 1180) scale(${0.85 + 0.15 * pop(f, 2)})`}>
        <rect x={-270} y={-520} width={540} height={1040} rx={64} fill="#16181D" />
        <rect x={-245} y={-490} width={490} height={980} rx={44} fill="#F6F2EC" />
        <rect x={-245} y={-490} width={490} height={130} rx={44} fill={C.accent} />
        <rect x={-245} y={-410} width={490} height={50} fill={C.accent} />
        <circle cx={-170} cy={-418} r={36} fill="#FFFFFF" />
        <image href={staticFile("brand/logo.svg")} x={-200} y={-448} width={60} height={60} />
        <text x={-115} y={-408} fontFamily={TEXT} fontWeight={800} fontSize={34} fill="#FFFFFF">Akuma Pharma</text>
        <g opacity={typed > 0 ? 1 : 0}>
          <rect x={-200} y={-120} width={420} height={150} rx={26} fill={sent ? C.accent : "#FFFFFF"} stroke="#16181D" strokeWidth={4} />
          <foreignObject x={-185} y={-110} width={390} height={130}>
            <div style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 30, lineHeight: 1.25, color: sent ? "#FFFFFF" : "#16181D" }}>{msg.slice(0, Math.round(msg.length * typed))}</div>
          </foreignObject>
          <g transform="translate(-130 70)" opacity={ease(f, fr(on("L11", 8) - PHONE_A), fr(on("L11", 8) - PHONE_A) + 8)}>
            <rect x={0} y={0} width={340} height={90} rx={18} fill="#FFFFFF" stroke="#16181D" strokeWidth={4} />
            <rect x={18} y={16} width={46} height={58} rx={6} fill={C.accent} />
            <text x={82} y={56} fontFamily={TEXT} fontWeight={700} fontSize={28} fill="#16181D">product-list.pdf</text>
          </g>
        </g>
        <rect x={-220} y={380} width={340} height={80} rx={40} fill="#FFFFFF" stroke="#16181D" strokeWidth={4} />
        <g transform={`translate(175 420) scale(${press})`}><circle r={46} fill={C.accent} /><path d="M -18 -18 L 22 0 L -18 18 L -10 0 Z" fill="#FFFFFF" /></g>
      </g>
    </Svg>
    <Kinetic offset={PHONE_A} top={150} lines={KW("L11", [[0, 1], [2, 3]], { 0: "dim", 1: "base", 2: "accent", 3: "big" })} exitAt={on("L11", 4) - 0.05} />
    <Kinetic offset={PHONE_A} top={150} lines={KW("L11", [[4, 5, 6], [7, 8], [9, 10, 11]], { 4: "base", 5: "dim", 6: "dim", 7: "base", 8: "base", 9: "dim", 10: "accent", 11: "big" })} />
  </AbsoluteFill>);
};

export const AKV_001_CLOSER: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30;
  const r = revealRadius(f, fr(RED_A), fr(RED_A + 0.6), fr(RED_B - 0.3), fr(RED_B + 0.3));
  const win = (a: number, b: number) => interpolate(f, [fr(a), fr(a) + 8, fr(b) - 8, fr(b)], [0, 1, 1, 0], clamp);
  const tradeO = Math.max(win(PLANT_A, DOOR_A), win(PHONE_A, END_A)); // only over scenes without people (≈ 11 s total)
  const tradeTop = t >= PHONE_A - 0.3 ? 1725 : 1470;
  const inRed = t > RED_A + 0.6 && t < RED_B - 0.3;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {T.audio !== false && <Audio src={staticFile(`episodes/${T.id}/mix.wav`)} />}
      <Backdrop />
      <Span a={0} b={MAP_END + 0.5}><MapScene /></Span>
      <Span a={SHOP_A} b={SHOP_B + 0.6}>
        <Reveal r={revealRadius(f - fr(SHOP_A), 0, 14)} cx={300} cy={1100}><Shop /></Reveal>
      </Span>
      <Span a={PLANT_A} b={PLANT_B}><PlantScene /></Span>
      <Span a={ROUTE_A} b={ROUTE_B}><RouteScene /></Span>
      <Span a={DOOR_A} b={DOOR_B}><DoorScene /></Span>
      <Span a={FULL_A} b={FULL_B}><FullShop /></Span>
      <Span a={PHONE_A} b={PHONE_B}><PhoneScene /></Span>
      <Reveal r={r} cx={540} cy={1200}><Span a={RED_A} b={RED_B + 0.4}><RedScene /></Span></Reveal>
      <div style={{ position: "absolute", top: tradeTop, left: 150, right: 150, padding: "10px 18px", borderRadius: 16, background: alpha("#FFFFFF", 0.88), textAlign: "center", fontFamily: TEXT, fontSize: 23, fontWeight: 500, color: C.dim, opacity: inRed ? 0 : tradeO, lineHeight: 1.3 }}>
        For licensed pharmaceutical trade. Products are supplied only where registered or authorised by the national regulator.
      </div>
      {t > 0.8 && t < END_A && <CornerBug dark={inRed} />}
      <Span a={END_A} b={T.total}>
        <EndCard dark={false} cta="SEND YOUR PRODUCT LIST" />
        <div style={{ position: "absolute", top: 1430, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 40, color: C.ink }}>
          Next: What is <span style={{ color: C.accent, fontStyle: "italic" }}>Akuma Pharma</span>?
        </div>
        <div style={{ position: "absolute", top: 1540, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 23, color: C.dim, lineHeight: 1.4 }}>
          Illustrative story · Akuma Enterprises, Kharar, Punjab, India · Reviewed: 2026-11-11<br />For licensed pharmaceutical trade · AI-generated narration
        </div>
      </Span>
    </AbsoluteFill>
  );
};
