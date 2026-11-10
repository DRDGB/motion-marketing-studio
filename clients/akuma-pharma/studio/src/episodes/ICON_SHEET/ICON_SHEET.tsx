// Review sheet: every Akuma pharma pictogram on the white world (top) and red world (bottom). 1 frame.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../../theme";
import { PharmaPlant, Pharmacy, Pharmacist, MedCarton, Capsule, Vial, PillBottle, Flask, Blister, Doc, Carton, Ship, Plane, Door, Folder, HeatHumidity } from "../../lib/akuma_icons";

export const ICON_SHEET_FRAMES = 1;
const Row: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <svg width={1080} height={960} style={{ position: "absolute", top: dark ? 960 : 0 }}>
    <PharmaPlant x={230} y={170} s={0.62} dark={dark} />
    <Pharmacy x={560} y={200} s={0.55} dark={dark} />
    <Pharmacist x={870} y={300} s={0.55} dark={dark} arm={0.6} />
    <MedCarton x={150} y={420} s={0.6} dark={dark} />
    <Capsule x={360} y={420} s={0.6} dark={dark} />
    <Vial x={530} y={440} s={0.6} dark={dark} />
    <PillBottle x={680} y={450} s={0.55} dark={dark} />
    <Flask x={160} y={680} s={0.55} dark={dark} level={0.45} />
    <Blister x={360} y={690} s={0.6} dark={dark} accent />
    <Doc x={540} y={690} s={0.55} dark={dark} stamp={1} />
    <Carton x={700} y={700} s={0.5} dark={dark} />
    <Door x={900} y={700} s={0.45} dark={dark} />
    <Ship x={240} y={880} s={0.45} dark={dark} />
    <Plane x={540} y={860} s={0.35} dark={dark} rot={90} />
    <Folder x={760} y={880} s={0.4} dark={dark} />
    <HeatHumidity x={960} y={460} s={0.45} dark={dark} />
  </svg>
);
export const ICON_SHEET: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <div style={{ position: "absolute", top: 960, left: 0, width: 1080, height: 960, background: `radial-gradient(ellipse at 50% 50%, ${C.darkSurface} 0%, ${C.dark} 72%)` }} />
    <Row /><Row dark />
  </AbsoluteFill>
);
