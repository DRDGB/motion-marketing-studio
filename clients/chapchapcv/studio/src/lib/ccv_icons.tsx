// ChapChapCV pictograms (client-specific): phone + generic app UI, CV page, job cards, portfolio site, cyber café, street.
// All UI is GENERIC and shown with the label "Exemple illustratif" in scenes (no real employers, no real data).
import React from "react";
import { C, TEXT, DISPLAY, alpha } from "../theme";

const INK = "#18181B";
type P = { x: number; y: number; s?: number; o?: number; rot?: number };
const G: React.FC<P & { children: React.ReactNode }> = ({ x, y, s = 1, o = 1, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>{children}</g>
);

/** Phone frame; children are drawn in SCREEN coords (0,0)…(480,960). */
export const Phone: React.FC<P & { children?: React.ReactNode }> = ({ children, ...p }) => (
  <G {...p}>
    <rect x={-265} y={-515} width={530} height={1030} rx={64} fill={INK} />
    <g transform="translate(-240 -480)">
      <clipPath id="ccv-phone"><rect x={0} y={0} width={480} height={960} rx={42} /></clipPath>
      <g clipPath="url(#ccv-phone)"><rect x={0} y={0} width={480} height={960} fill="#FFFFFF" />{children}</g>
    </g>
    <rect x={-60} y={-500} width={120} height={22} rx={11} fill="#000000" />
  </G>
);

/** App header bar inside the phone (screen coords). */
export const AppBar: React.FC<{ title?: string }> = ({ title = "ChapChapCV" }) => (
  <g>
    <rect x={0} y={0} width={480} height={120} fill={C.accent} />
    <text x={32} y={82} fontFamily={TEXT} fontWeight={800} fontSize={36} fill="#FFFFFF">{title}</text>
  </g>
);

/** Question card (screen coords) sliding in; p 0..1. */
export const QCard: React.FC<{ y: number; n: number; label: string; p: number; done?: boolean }> = ({ y, n, label, p, done }) => (
  <g transform={`translate(${24 + 440 * (1 - p)} ${y})`} opacity={Math.min(1, p * 1.4)}>
    <rect x={0} y={0} width={432} height={112} rx={20} fill="#FFFFFF" stroke={alpha(INK, 0.18)} strokeWidth={3} />
    <circle cx={50} cy={56} r={28} fill={done ? C.support[0] : C.accent} />
    <text x={50} y={68} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={30} fill="#FFFFFF">{done ? "✓" : n}</text>
    <text x={96} y={66} fontFamily={TEXT} fontWeight={700} fontSize={28} fill={INK}>{label}</text>
  </g>
);

/** A CV page. fill 0..1 writes the content; hl = indices of bullet lines highlighted orange. */
export const CVDoc: React.FC<P & { fill?: number; hl?: number[]; name?: string }> = ({ fill = 1, hl = [], name = "Awa K.", ...p }) => {
  const lines = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <G {...p}>
      <rect x={-210} y={-290} width={420} height={580} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <rect x={-210} y={-290} width={420} height={120} rx={14} fill={alpha(C.accent, fill > 0.05 ? 1 : 0.12)} />
      <circle cx={-140} cy={-230} r={44} fill={fill > 0.1 ? "#FFFFFF" : alpha(INK, 0.08)} stroke={INK} strokeWidth={4} />
      {fill > 0.1 && <text x={-70} y={-238} fontFamily={TEXT} fontWeight={800} fontSize={34} fill="#FFFFFF">{name}</text>}
      {fill > 0.15 && <rect x={-70} y={-218} width={170} height={14} rx={7} fill={alpha("#FFFFFF", 0.8)} />}
      {lines.map((i) => {
        const vis = fill > 0.2 + i * 0.09;
        const y = -140 + i * 52;
        const isHead = i === 0 || i === 4;
        const w = isHead ? 150 : 300 - (i % 3) * 40;
        return vis ? <g key={i}>
          {!isHead && <circle cx={-170} cy={y + 7} r={6} fill={hl.includes(i) ? C.accent : alpha(INK, 0.5)} />}
          <rect x={isHead ? -180 : -152} y={y} width={w} height={isHead ? 18 : 14} rx={7} fill={isHead ? INK : hl.includes(i) ? C.accent : alpha(INK, 0.28)} />
        </g> : null;
      })}
    </G>
  );
};

/** Sticky note with a short label. */
export const Sticky: React.FC<P & { text: string; color?: string }> = ({ text, color = "#FFE27A", ...p }) => (
  <G {...p}>
    <rect x={-240} y={-70} width={480} height={140} rx={8} fill={color} stroke={INK} strokeWidth={5} />
    <text x={0} y={12} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={32} fill={INK}>{text}</text>
  </G>
);

/** Job offer card (generic). */
export const JobCard: React.FC<P & { title: string; place: string; verified?: number }> = ({ title, place, verified = 0, ...p }) => (
  <G {...p}>
    <rect x={-230} y={-80} width={460} height={160} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
    <rect x={-205} y={-55} width={70} height={70} rx={14} fill={alpha(C.support[0], 0.15)} />
    <rect x={-185} y={-35} width={30} height={30} rx={6} fill={C.support[0]} />
    <text x={-115} y={-20} fontFamily={TEXT} fontWeight={800} fontSize={30} fill={INK}>{title}</text>
    <text x={-115} y={18} fontFamily={TEXT} fontWeight={600} fontSize={24} fill={C.dim}>{place}</text>
    <g opacity={verified} transform={`translate(-115 ${48}) scale(${0.8 + 0.2 * verified})`}>
      <rect x={0} y={-22} width={210} height={36} rx={18} fill={alpha(C.support[0], 0.14)} />
      <circle cx={20} cy={-4} r={12} fill={C.support[0]} /><path d="M 14 -4 L 19 1 L 27 -9" stroke="#FFFFFF" strokeWidth={4} fill="none" />
      <text x={40} y={4} fontFamily={TEXT} fontWeight={800} fontSize={22} fill={C.support[1]}>Offre vérifiée</text>
    </g>
  </G>
);

/** Portfolio website in a browser card, with URL and QR code. */
export const SiteCard: React.FC<P & { url: string; qr?: number }> = ({ url, qr = 1, ...p }) => (
  <G {...p}>
    <rect x={-250} y={-200} width={500} height={400} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <rect x={-250} y={-200} width={500} height={56} rx={18} fill={alpha(INK, 0.06)} />
    {[0, 1, 2].map((i) => <circle key={i} cx={-220 + i * 26} cy={-172} r={8} fill={[C.accent, "#F5B800", C.support[0]][i]} />)}
    <rect x={-130} y={-188} width={360} height={34} rx={17} fill="#FFFFFF" stroke={alpha(INK, 0.2)} strokeWidth={2} />
    <text x={-115} y={-164} fontFamily={TEXT} fontWeight={700} fontSize={22} fill={INK}>{url}</text>
    <circle cx={-160} cy={-60} r={50} fill={alpha(C.accent, 0.2)} stroke={C.accent} strokeWidth={5} />
    <rect x={-90} y={-90} width={200} height={22} rx={11} fill={INK} />
    <rect x={-90} y={-55} width={150} height={14} rx={7} fill={alpha(INK, 0.35)} />
    {[20, 60, 100].map((y) => <rect key={y} x={-210} y={y} width={280} height={14} rx={7} fill={alpha(INK, 0.22)} />)}
    <g transform={`translate(160 80) scale(${qr})`}>
      <rect x={-60} y={-60} width={120} height={120} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 36 }).map((_, i) => ((i * 7 + 3) % 5 < 2 || [0, 5, 30].includes(i)) ? <rect key={i} x={-50 + (i % 6) * 17} y={-50 + Math.floor(i / 6) * 17} width={15} height={15} fill={INK} /> : null)}
    </g>
  </G>
);

/** Cyber café storefront with a price tag. */
export const CyberShop: React.FC<P & { price?: string; tag?: number }> = ({ price = "1 500 F", tag = 1, ...p }) => (
  <G {...p}>
    <rect x={-230} y={-240} width={460} height={360} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
    <rect x={-230} y={-320} width={460} height={90} rx={10} fill={INK} />
    <text x={0} y={-258} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={58} letterSpacing={10} fill="#FFFFFF">CYBER</text>
    <rect x={-200} y={-200} width={240} height={170} rx={6} fill={alpha(INK, 0.08)} stroke={INK} strokeWidth={5} />
    {[-170, -90].map((x) => <g key={x}><rect x={x} y={-180} width={60} height={44} rx={4} fill={INK} /><rect x={x + 20} y={-136} width={20} height={20} fill={INK} /></g>)}
    <rect x={70} y={-200} width={130} height={320} rx={6} fill={alpha(INK, 0.12)} stroke={INK} strokeWidth={5} />
    <g transform={`translate(-80 60) rotate(-8) scale(${tag})`}>
      <rect x={-90} y={-36} width={180} height={72} rx={12} fill="#FFE27A" stroke={INK} strokeWidth={5} />
      <text x={0} y={14} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={38} fill={INK}>{price}</text>
    </g>
  </G>
);

/** Orange Abidjan city taxi (generic). */
export const Taxi: React.FC<P> = (p) => (
  <G {...p}>
    <path d="M -170 0 L -160 -60 Q -150 -80 -120 -84 L -70 -130 Q -60 -140 -40 -140 L 60 -140 Q 80 -140 92 -126 L 130 -84 Q 168 -80 172 -60 L 180 0 Z" fill={C.accent} stroke={INK} strokeWidth={6} />
    <path d="M -58 -124 L 40 -124 L 40 -84 L -96 -84 Z M 56 -124 Q 70 -124 80 -112 L 106 -84 L 56 -84 Z" fill="#CFE8F5" stroke={INK} strokeWidth={4} />
    <rect x={-30} y={-162} width={70} height={24} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    {[-110, 110].map((x) => <g key={x}><circle cx={x} cy={0} r={34} fill={INK} /><circle cx={x} cy={0} r={14} fill="#9AA0A8" /></g>)}
  </G>
);

/** Abidjan-like street backdrop (generic buildings, sky). y0 = ground line. */
export const Street: React.FC<{ y0?: number }> = ({ y0 = 1560 }) => (
  <g>
    <rect x={0} y={0} width={1080} height={y0} fill="#FFF4EC" />
    {[[40, 260, 360], [300, 180, 520], [480, 240, 300], [720, 200, 460], [920, 160, 380]].map(([x, w, h], i) => (
      <g key={i}><rect x={x} y={y0 - h} width={w} height={h} fill={i % 2 ? "#FFFFFF" : alpha(INK, 0.06)} stroke={alpha(INK, 0.35)} strokeWidth={4} />
        {Array.from({ length: Math.floor(h / 70) * 2 }).map((_, k) => <rect key={k} x={x + 24 + (k % 2) * (w / 2 - 10)} y={y0 - h + 30 + Math.floor(k / 2) * 70} width={w / 2 - 50} height={34} rx={4} fill={alpha(INK, 0.12)} />)}
      </g>))}
    <rect x={0} y={y0} width={1080} height={1920 - y0} fill="#E9E4DD" />
    <rect x={0} y={y0 + 120} width={1080} height={10} fill={alpha(INK, 0.15)} />
  </g>
);

/** Thought bubble with an inner label. */
export const Thought: React.FC<P & { text: string }> = ({ text, ...p }) => (
  <G {...p}>
    <circle cx={-110} cy={120} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    <circle cx={-80} cy={80} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    <ellipse cx={0} cy={0} rx={190} ry={90} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
    <rect x={-120} y={-34} width={240} height={68} rx={34} fill={C.accent} />
    <text x={0} y={14} textAnchor="middle" fontFamily={DISPLAY} fontWeight={900} fontSize={40} letterSpacing={4} fill="#FFFFFF">{text}</text>
  </G>
);
