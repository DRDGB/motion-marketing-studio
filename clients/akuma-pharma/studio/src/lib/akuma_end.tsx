// Shared Akuma Pharma CTA pieces (D-023): phone WhatsApp CTA and the pan-African end card.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { C, DISPLAY, TEXT } from "../theme";
import { ease, pop, fr } from "./time";
import { MapLayer, AFRICA_BOX, fit, CITIES } from "./map";

export const WA = "+91 79861 47827"; // Akuma Pharma WhatsApp desk
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;

/** Phone with a chat being typed and sent, plus the big WhatsApp pill. Times are LOCAL seconds. */
export const PhoneCTA: React.FC<{ msg: string; typeAt: number; attachAt?: number; sendAt: number; pillAt: number; y?: number }> = ({ msg, typeAt, attachAt, sendAt, pillAt, y = 1090 }) => {
  const f = useCurrentFrame(); const t = f / 30;
  const typed = Math.max(0, Math.min(1, (t - typeAt) / 1.1));
  const sent = t > sendAt;
  const press = sent ? 1 - 0.12 * Math.max(0, 1 - (t - sendAt) / 0.25) : 1;
  return (<>
    <Svg>
      <g transform={`translate(540 ${y}) scale(${0.78 + 0.12 * pop(f, 2)})`}>
        <rect x={-270} y={-520} width={540} height={1040} rx={64} fill="#16181D" />
        <rect x={-245} y={-490} width={490} height={980} rx={44} fill="#F6F2EC" />
        <rect x={-245} y={-490} width={490} height={130} rx={44} fill={C.accent} />
        <rect x={-245} y={-410} width={490} height={50} fill={C.accent} />
        <circle cx={-170} cy={-418} r={36} fill="#FFFFFF" />
        <image href={staticFile("brand/logo.svg")} x={-200} y={-448} width={60} height={60} />
        <text x={-115} y={-420} fontFamily={TEXT} fontWeight={800} fontSize={34} fill="#FFFFFF">Akuma Pharma</text>
        <text x={-115} y={-382} fontFamily={TEXT} fontWeight={600} fontSize={24} fill="#FFFFFF">{WA}</text>
        <g opacity={typed > 0 ? 1 : 0}>
          <rect x={-200} y={-120} width={420} height={150} rx={26} fill={sent ? C.accent : "#FFFFFF"} stroke="#16181D" strokeWidth={4} />
          <foreignObject x={-185} y={-110} width={390} height={130}>
            <div style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 30, lineHeight: 1.25, color: sent ? "#FFFFFF" : "#16181D" }}>{msg.slice(0, Math.round(msg.length * typed))}</div>
          </foreignObject>
          {attachAt !== undefined && <g transform="translate(-130 70)" opacity={ease(f, fr(attachAt), fr(attachAt) + 8)}>
            <rect x={0} y={0} width={340} height={90} rx={18} fill="#FFFFFF" stroke="#16181D" strokeWidth={4} />
            <rect x={18} y={16} width={46} height={58} rx={6} fill={C.accent} />
            <text x={82} y={56} fontFamily={TEXT} fontWeight={700} fontSize={28} fill="#16181D">product-list.pdf</text>
          </g>}
        </g>
        <rect x={-220} y={380} width={340} height={80} rx={40} fill="#FFFFFF" stroke="#16181D" strokeWidth={4} />
        <g transform={`translate(175 420) scale(${press})`}><circle r={46} fill={C.accent} /><path d="M -18 -18 L 22 0 L -18 18 L -10 0 Z" fill="#FFFFFF" /></g>
      </g>
    </Svg>
    <div style={{ position: "absolute", top: 1640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: ease(f, fr(pillAt) - 6, fr(pillAt) + 4) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.accent, color: "#FFFFFF", borderRadius: 60, padding: "16px 36px", fontFamily: TEXT, fontWeight: 800, fontSize: 46, transform: `scale(${0.85 + 0.15 * pop(f, fr(pillAt))})` }}>
        <span style={{ fontSize: 30, letterSpacing: 2 }}>WHATSAPP</span><span>{WA}</span>
      </div>
    </div>
  </>);
};

const PINS = ["Lagos", "Accra", "Abidjan", "Douala", "Kinshasa", "Nairobi", "Addis Ababa", "Dar es Salaam", "Johannesburg", "Dakar"];
/** End card: logo, name, tagline, CTA, WhatsApp, products link, Africa pins, "<today> today. Your country next?" */
export const FinalCard: React.FC<{ today: string; highlight?: string; reviewed: string; illustrative?: boolean; extraPins?: string[]; lead?: string }> = ({ today, highlight, reviewed, illustrative = true, extraPins = [], lead }) => {
  const f = useCurrentFrame(); const t = f / 30;
  const frame: [number, number, number, number] = [330, 1110, 420, 420];
  const { P } = fit(AFRICA_BOX, frame);
  const pins = [...extraPins, ...PINS.filter((p) => !extraPins.includes(p))];
  return (<AbsoluteFill style={{ background: C.bg }}>
    <Svg>
      <image href={staticFile("brand/logo.svg")} x={540 - 95 * pop(f, 2)} y={170} width={190 * pop(f, 2)} height={190} />
      <MapLayer box={AFRICA_BOX} frame={frame} dim={0.4} showIndia={false} highlight={highlight} hk={1} />
      {pins.map((city, i) => { const c = CITIES[city]; if (!c) return null; const [x, y] = P(c as [number, number]); const p = pop(f, fr(1.0 + i * 0.2)); const ph = (t * 1.2 + i * 0.3) % 1; return <g key={city}><circle cx={x} cy={y} r={7 + 18 * ph * p} fill="none" stroke={C.accent} strokeWidth={3} opacity={(1 - ph) * p} /><circle cx={x} cy={y} r={7 * p} fill={i < extraPins.length ? C.accent : C.ink} /></g>; })}
    </Svg>
    <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 104, fontWeight: 700, color: C.ink, opacity: ease(f, 6, 16) }}>Akuma Pharma</div>
    <div style={{ position: "absolute", top: 510, left: 90, right: 90, textAlign: "center", fontFamily: TEXT, fontSize: 36, fontWeight: 500, color: C.dim, opacity: ease(f, 10, 20) }}>Your sourcing partner in India, all the way to your door.</div>
    <div style={{ position: "absolute", top: 620, width: "100%", display: "flex", justifyContent: "center", opacity: ease(f, 14, 22) }}>
      <div style={{ background: C.accent, color: "#FFFFFF", borderRadius: 60, padding: "18px 44px", fontFamily: TEXT, fontWeight: 800, fontSize: 36, letterSpacing: 3 }}>SEND YOUR PRODUCT LIST</div>
    </div>
    <div style={{ position: "absolute", top: 740, width: "100%", textAlign: "center", fontFamily: TEXT, color: C.ink, opacity: ease(f, 18, 26) }}>
      <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: C.dim }}>WHATSAPP</div>
      <div style={{ fontSize: 76, fontWeight: 800 }}>{WA}</div>
    </div>
    <div style={{ position: "absolute", top: 960, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 34, color: C.ink, opacity: ease(f, 22, 30) }}>See our products: <b>akumaenterprises-pharma.com</b></div>
    <div style={{ position: "absolute", top: 1560, left: 70, right: 70, textAlign: "center", fontFamily: DISPLAY, fontSize: 52, fontWeight: 700, color: C.ink, lineHeight: 1.15, opacity: ease(f, 40, 52) }}>
      {lead ?? `${today} today.`} <span style={{ color: C.accent, fontStyle: "italic" }}>Your country next?</span>
      <div style={{ fontFamily: TEXT, fontSize: 32, fontWeight: 600, color: C.dim, marginTop: 10 }}>Tell us in the comments.</div>
    </div>
    <div style={{ position: "absolute", top: 1790, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 21, color: C.dim, lineHeight: 1.4 }}>
      {illustrative ? "Illustrative · " : ""}Akuma Enterprises, Kharar, Punjab, India · Reviewed: {reviewed} · For licensed pharmaceutical trade · AI-generated narration
    </div>
  </AbsoluteFill>);
};
