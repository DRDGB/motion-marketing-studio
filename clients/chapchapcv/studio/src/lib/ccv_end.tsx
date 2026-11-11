// ChapChapCV shared CTA + end card (every video ends the same way: URL + « Créer mon CV » + @chapchapcv + "tu es où ?").
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, Img } from "remotion";
import { B, C, TEXT, DISPLAY } from "../theme";
import { ease, pop, fr } from "./time";
import { MapLayer, AFRICA_BOX, fit, CITIES } from "./map";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;

/** Big URL + orange button + handle. urlAt/btnAt/noteAt are LOCAL frames. */
export const CtaPanel: React.FC<{ urlAt: number; btnAt: number; noteAt?: number; note?: string; button?: string }> = ({ urlAt, btnAt, noteAt, note = "Créez gratuitement. Payez uniquement ce que vous utilisez.", button = "Créer mon CV" }) => {
  const f = useCurrentFrame();
  const url = pop(f, urlAt, 9), btn = pop(f, btnAt, 9);
  return (<>
    <div style={{ position: "absolute", top: 760, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 104, color: C.ink, transform: `scale(${0.8 + 0.2 * url})`, opacity: url }}>chapchap<span style={{ color: C.accent }}>cv</span>.com</div>
    <div style={{ position: "absolute", top: 930, width: "100%", display: "flex", justifyContent: "center", opacity: btn, transform: `scale(${0.85 + 0.15 * btn})` }}>
      <div style={{ background: C.accent, color: "#FFFFFF", borderRadius: 70, padding: "26px 64px", fontFamily: TEXT, fontWeight: 800, fontSize: 56 }}>{button}</div>
    </div>
    <div style={{ position: "absolute", top: 1090, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 700, fontSize: 40, color: C.dim, opacity: btn }}>@chapchapcv</div>
    {noteAt !== undefined && <div style={{ position: "absolute", top: 1220, left: 120, right: 120, textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 34, color: C.ink, opacity: ease(f, noteAt, noteAt + 8), lineHeight: 1.3 }}>{note}</div>}
  </>);
};

const PINS = ["Abidjan", "Dakar", "Douala", "Accra", "Lagos", "Kinshasa", "Nairobi"];
/** End card. `lead` = the continuity line (e.g. "Abidjan aujourd'hui."); `services` = small line under the URL. */
export const CcvEndCard: React.FC<{ lead: string; highlight?: string; services?: string; footer?: string }> = ({ lead, highlight = "CI", services = "CV · Offres d'emploi · Portfolio · @chapchapcv", footer = "Histoire et exemples illustratifs · Voix générée par IA" }) => {
  const f = useCurrentFrame(); const t = f / 30;
  const frame: [number, number, number, number] = [330, 1060, 420, 420];
  const { P } = fit(AFRICA_BOX, frame);
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <image href={staticFile(B.logo ?? "brand/logo.png")} x={190} y={190} width={700} height={170 * pop(f, 2)} preserveAspectRatio="xMidYMid meet" />
      <MapLayer box={AFRICA_BOX} frame={frame} dim={0.4} showIndia={false} highlight={highlight} hk={1} />
      {PINS.map((c, i) => { const [x, y] = P(CITIES[c] as [number, number]); const p = pop(f, fr(1.0 + i * 0.2)); const ph = (t * 1.2 + i * 0.3) % 1; return <g key={c}><circle cx={x} cy={y} r={7 + 18 * ph * p} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - ph) * p} /><circle cx={x} cy={y} r={7 * p} fill={i === 0 ? C.accent : C.ink} /></g>; })}
    </Svg>
    <div style={{ position: "absolute", top: 420, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 70, color: C.ink, opacity: ease(f, 6, 16) }}>Ton CV. Ton job. <span style={{ color: C.accent }}>Chap chap.</span></div>
    <div style={{ position: "absolute", top: 560, width: "100%", display: "flex", justifyContent: "center", opacity: ease(f, 12, 20) }}>
      <div style={{ background: C.accent, color: "#FFFFFF", borderRadius: 60, padding: "18px 48px", fontFamily: TEXT, fontWeight: 800, fontSize: 40 }}>Créer mon CV</div>
    </div>
    <div style={{ position: "absolute", top: 700, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 800, fontSize: 64, color: C.ink, opacity: ease(f, 16, 24) }}>chapchapcv.com</div>
    <div style={{ position: "absolute", top: 800, width: "100%", textAlign: "center", fontFamily: TEXT, fontWeight: 600, fontSize: 32, color: C.dim, opacity: ease(f, 18, 26) }}>{services}</div>
    <div style={{ position: "absolute", top: 1520, left: 50, right: 50, textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 46, color: C.ink, lineHeight: 1.15, opacity: ease(f, 40, 52) }}>
      {lead}<br /><span style={{ color: C.accent }}>Et toi, tu es où ?</span>
      <div style={{ fontFamily: TEXT, fontSize: 32, fontWeight: 600, color: C.dim, marginTop: 10 }}>Dis-le en commentaire.</div>
    </div>
    <div style={{ position: "absolute", top: 1790, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 21, color: C.dim }}>{footer}</div>
  </AbsoluteFill>);
};

/** A client-supplied app screenshot (already in a phone mockup), centred at (cx, cy), fitted to height h. Returns overlay mapper too. */
export const screenBox = (nat: [number, number], cx: number, cy: number, h: number) => {
  const s = h / nat[1]; const w = nat[0] * s; const x = cx - w / 2, y = cy - h / 2;
  return { x, y, w, h, s, P: (px: number, py: number): [number, number] => [x + px * s, y + py * s] };
};
export const Screen: React.FC<{ src: string; nat: [number, number]; cx: number; cy: number; h: number; o?: number; dx?: number; scale?: number }> = ({ src, nat, cx, cy, h, o = 1, dx = 0, scale = 1 }) => {
  const b = screenBox(nat, cx + dx, cy, h * scale);
  return <Img src={staticFile(src)} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, opacity: o, mixBlendMode: "multiply" }} />;
};
