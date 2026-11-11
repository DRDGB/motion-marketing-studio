// Storyboard keyframes for AKV-001 v2 (Lagos scenario). Frame 0..3 = four key moments.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C, DISPLAY, TEXT, alpha } from "../../theme";
import { MapLayer, AFRICA_BOX, boxOf, lerpBox, fit, Pin, CountryLabel, CITIES, Box } from "../../lib/map";
import { Flag } from "../../lib/flags";
import { Person, SKIN, Bubble } from "../../lib/people";
import { PharmacyInterior, Counter } from "../../lib/pharmacy_scene";
import { Thread, Pt } from "../../lib/thread";
import { CornerBug } from "../../lib/endcard";
import { DarkWorld } from "../../lib/stage";

export const STORYBOARD_V2_FRAMES = 4;
const Caption: React.FC<{ a: string; b?: string; accent?: string; dark?: boolean }> = ({ a, b, accent, dark }) => (
  <div style={{ position: "absolute", top: 150, left: 60, right: 60, textAlign: "center" }}>
    <div style={{ fontFamily: TEXT, fontSize: 64, fontWeight: 700, color: dark ? C.light : C.ink, lineHeight: 1.15 }}>{a}</div>
    {b && <div style={{ fontFamily: DISPLAY, fontSize: 104, fontWeight: 700, color: dark ? C.ink : C.accent, fontStyle: "italic", lineHeight: 1.1, marginTop: 8 }}>{b}</div>}
  </div>
);
const Tag: React.FC<{ text: string; y?: number; dark?: boolean }> = ({ text, y = 1800, dark }) => (
  <div style={{ position: "absolute", top: y, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 26, color: dark ? alpha(C.light, 0.8) : C.dim }}>{text}</div>
);

const EMEKA = { look: { skin: SKIN.brown, hair: "short" as const, beard: true }, outfit: { top: "polo" as const, topColor: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35", badge: true } };
const ADA = { look: { skin: SKIN.warm, hair: "wrap" as const, wrap: "#16181D" }, outfit: { top: "coat" as const, topColor: "#FFFFFF", under: C.accent, bottom: "trousers" as const, bottomColor: "#2B2E35" } };
const MAMA = { look: { skin: SKIN.deep, hair: "wrap" as const, wrap: C.accent }, outfit: { top: "blouse" as const, topColor: "#F2B8C0", bottom: "skirt" as const, bottomColor: C.accentDeep } };
const BABA = { look: { skin: SKIN.brown, hair: "grey" as const, glasses: true }, outfit: { top: "shirt" as const, topColor: "#E9ECEF", bottom: "trousers" as const, bottomColor: "#5B606B" } };
const YOUNG = { look: { skin: SKIN.light, hair: "short" as const }, outfit: { top: "tee" as const, topColor: "#16181D", bottom: "trousers" as const, bottomColor: "#3D5A80" } };

const Band: React.FC<{ h?: number; dark?: boolean }> = ({ h = 520, dark }) => <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: `linear-gradient(${dark ? C.dark : C.bg} 82%, transparent)` }} />;
const F0: React.FC = () => {
  const box = lerpBox(AFRICA_BOX, boxOf("NG", 0.6), 0.86) as Box;
  const fr = [40, 560, 1000, 1000] as [number, number, number, number];
  const { P } = fit(box, fr);
  const [lx, ly] = P(CITIES.Lagos as [number, number]);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <MapLayer box={box} frame={fr} highlight="NG" dim={0.6} showIndia={false} />
      <CountryLabel x={P([85, -105])[0]} y={P([85, -105])[1]} text="NIGERIA" color="#FFFFFF" />
      <Pin x={lx} y={ly} p={1} size={1.1} />
      <text x={lx - 40} y={ly + 70} textAnchor="end" fontFamily={DISPLAY} fontSize={56} fontWeight={700} fill={C.ink}>Lagos</text>
      <Flag iso="NG" x={790} y={1180} w={210} h={140} t={0.7} s={1} />
    </svg>
    <Band /><Caption a="Lagos, Nigeria." b="This is Emeka…" />
    <Tag text="Illustrative story" y={1830} />
    <CornerBug />
  </AbsoluteFill>);
};
const F1: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <PharmacyInterior top={420} light={0.8} />
      <Person x={640} y={1300} s={0.5} {...ADA} face="smile" armR={{ up: 35, low: -40 }} prop="bag" propSide="R" />
      <Counter top={420} />
      <Person x={170} y={1700} s={0.62} {...EMEKA} face="big-smile" armL={{ up: 150, low: 170 }} />
      <Person x={520} y={1760} s={0.52} {...MAMA} face="smile" armR={{ up: 20, low: 10 }} />
      <Person x={720} y={1790} s={0.52} {...BABA} face="neutral" prop="stick" propSide="R" armR={{ up: 25, low: 15 }} />
      <Person x={920} y={1810} s={0.52} {...YOUNG} face="smile" prop="phone" propSide="L" armL={{ up: -20, low: -150 }} />
    </svg>
    <Caption a="Every morning," b="customers line up." />
    <Tag text="Illustrative story" y={1860} />
    <CornerBug />
  </AbsoluteFill>
);
const F2: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <PharmacyInterior top={420} empty={[0.15, 1, 0.9]} tags={[0, 1, 1]} light={0.2} />
      <Counter top={420} />
      <Person x={300} y={1760} s={0.66} {...EMEKA} face="worried" brows="up" prop="phone" propSide="R" armR={{ up: 116, low: -128 }} armL={{ up: 15, low: 5 }} />
      <Bubble x={720} y={1250} w={520} text='"Oga, next month."' tx={420} ty={1140} p={1} size={50} italic />
    </svg>
    <Caption a="But today…" b="the shelf is empty." />
    <CornerBug />
  </AbsoluteFill>
);
const F3: React.FC = () => {
  const box: Box = [-200, -420, 1000, 380];
  const fr = [30, 640, 1020, 900] as [number, number, number, number];
  const { P } = fit(box, fr);
  const lagos = P(CITIES.Lagos as [number, number]), mohali = P(CITIES.Mohali as [number, number]);
  const mid: Pt = [(lagos[0] + mohali[0]) / 2, Math.min(lagos[1], mohali[1]) - 120];
  return (<AbsoluteFill><DarkWorld>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <MapLayer box={box} frame={fr} highlight="IN" dark showIndia />
      <Thread pts={[lagos as Pt, mid, mohali as Pt]} k={1} dark bead={false} width={10} />
      <Pin x={lagos[0]} y={lagos[1]} p={1} label="Lagos" dark size={0.9} />
      <image href={staticFile("brand/logo-on-red.svg")} x={mohali[0] - 60} y={mohali[1] - 240} width={120} height={120} />
    </svg>
    <Caption a="Your own team in India…" b="closer than you think." dark />
    <div style={{ position: "absolute", top: 1600, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, color: C.light }}>Akuma Pharma</div>
    <CornerBug dark />
  </DarkWorld></AbsoluteFill>);
};
export const STORYBOARD_V2: React.FC = () => { const f = useCurrentFrame(); return [<F0 key={0} />, <F1 key={1} />, <F2 key={2} />, <F3 key={3} />][Math.min(3, f)]; };
