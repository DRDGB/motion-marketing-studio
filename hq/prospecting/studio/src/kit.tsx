// Spec-film kit for prospect gift videos. Each film passes its own Look (palette + type); nothing is shared
// between prospects except these generic building blocks.
import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const fr = (s: number) => Math.round(s * FPS);
const EZ = Easing.bezier(0.22, 1, 0.36, 1);
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0→1 eased between frames a and b. */
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...CL, easing: EZ });
export const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], CL);
/** Springy 0→1 starting at frame `at`. */
export const pop = (f: number, at: number, damping = 12) =>
  spring({ frame: f - at, fps: FPS, config: { damping, mass: 0.7, stiffness: 150 } });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** Seconds → frames inside a scene: s(1.2) */
export const s = fr;

export type Look = {
  bg: string; bg2: string; ink: string; dim: string; accent: string; accent2: string; card: string;
  display: string; displayWeight?: number; text?: string; upper?: boolean; italicAccent?: boolean; tracking?: number;
};
const LookCtx = React.createContext<Look | null>(null);
export const useLook = () => {
  const l = React.useContext(LookCtx);
  if (!l) throw new Error("Look missing");
  return l;
};

export const Film: React.FC<{ look: Look; children: React.ReactNode }> = ({ look, children }) => (
  <LookCtx.Provider value={look}>
    <AbsoluteFill style={{ background: look.bg, fontFamily: `"${look.text ?? "Inter"}", Inter, sans-serif`, color: look.ink }}>{children}</AbsoluteFill>
  </LookCtx.Provider>
);

/** Soft radial backdrop (no per-frame filters: cheap to render). */
export const Backdrop: React.FC<{ from?: string; to?: string; cy?: number }> = ({ from, to, cy = 55 }) => {
  const L = useLook();
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% ${cy}%, ${from ?? L.bg2} 0%, ${to ?? L.bg} 78%)` }} />;
};

/** A scene between two absolute times (seconds) with a short cross-fade; frames inside are scene-relative. */
export const Scene: React.FC<{ from: number; to: number; fade?: number; children: React.ReactNode }> = ({ from, to, fade = 0.3, children }) => {
  const a = fr(from);
  const d = fr(to) - a;
  return (
    <Sequence from={a} durationInFrames={d} layout="none">
      <Fader dur={d} f0={fr(fade)}>{children}</Fader>
    </Sequence>
  );
};
const Fader: React.FC<{ dur: number; f0: number; children: React.ReactNode }> = ({ dur, f0, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(lin(f, 0, f0), 1 - lin(f, dur - f0, dur));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, ...style }}>{children}</svg>
);

// ---------- Kinetic type ----------
// Markup per word: *word* = accent colour, ^word^ = accent2, _word_ = dim. Lines can carry a size.
export type Line = string | { t: string; size?: number; font?: "display" | "text"; weight?: number };
type Tok = { w: string; role: "base" | "accent" | "accent2" | "dim" };
// A marker may span several words: "*de tout.*" colours both words.
const MARK: Record<string, Tok["role"]> = { "*": "accent", "^": "accent2", "_": "dim" };
const parse = (t: string): Tok[] => {
  let open: Tok["role"] | null = null;
  return t.split(" ").filter(Boolean).map((w) => {
    let role: Tok["role"] = open ?? "base";
    const first = w[0];
    if (!open && MARK[first] && w.length > 1) { role = MARK[first]; open = role; w = w.slice(1); }
    const last = w[w.length - 1];
    if (open && MARK[last] === open) { w = w.slice(0, -1); open = null; }
    return { w, role };
  });
};

export const Type: React.FC<{
  lines: Line[]; at?: number; out?: number; y?: number; size?: number; stagger?: number; lineGap?: number;
  color?: string; align?: "center" | "left"; x?: number; width?: number; font?: "display" | "text";
}> = ({ lines, at = 0, out, y = 300, size = 96, stagger = 0.09, lineGap = 1.08, color, align = "center", x = 80, width = W - 160, font = "display" }) => {
  const f = useCurrentFrame();
  const L = useLook();
  const o2 = out === undefined ? 1 : 1 - ease(f, fr(out), fr(out) + 10);
  let k = 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, textAlign: align, opacity: o2, transform: `translateY(${-50 * (1 - o2)}px)` }}>
      {lines.map((ln, li) => {
        const spec = typeof ln === "string" ? { t: ln } : ln;
        const fz = spec.size ?? size;
        const fam = (spec.font ?? font) === "display" ? L.display : L.text ?? "Inter";
        const isDisp = (spec.font ?? font) === "display";
        return (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: fz * 0.26, lineHeight: lineGap, marginBottom: fz * 0.12 }}>
            {parse(spec.t).map((tk, wi) => {
              const d = fr(at + k++ * stagger);
              const p = ease(f, d, d + 9);
              const c = tk.role === "accent" ? L.accent : tk.role === "accent2" ? L.accent2 : tk.role === "dim" ? L.dim : color ?? L.ink;
              return (
                <span key={wi} style={{
                  fontFamily: `"${fam}", Inter, sans-serif`, fontSize: fz, fontWeight: spec.weight ?? (isDisp ? L.displayWeight ?? 700 : 600),
                  fontStyle: tk.role === "accent" && L.italicAccent && isDisp ? "italic" : "normal",
                  textTransform: L.upper && isDisp ? "uppercase" : "none", letterSpacing: isDisp ? L.tracking ?? 0 : 0,
                  color: c, opacity: p, display: "inline-block", transform: `translateY(${(1 - p) * 38}px)`,
                }}>{tk.w}</span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Generic pieces (colours from the Look) ----------
/** Animated stroke: draw a path from 0→k (needs an approximate length). */
export const Draw: React.FC<{ d: string; k: number; len: number; stroke: string; w?: number; fill?: string; cap?: "round" | "butt" }> = ({ d, k, len, stroke, w = 6, fill = "none", cap = "round" }) => (
  <path d={d} fill={fill} stroke={stroke} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - Math.max(0, Math.min(1, k)))} />
);

/** Map pin drop with a ripple, plus two lines of address under it. */
export const Pin: React.FC<{ at: number; x?: number; y?: number; title: string; sub?: string; dark?: boolean }> = ({ at, x = 540, y = 1060, title, sub }) => {
  const f = useCurrentFrame();
  const L = useLook();
  const p = pop(f, fr(at), 10);
  const r = lin(f, fr(at) + 8, fr(at) + 40);
  const t = ease(f, fr(at) + 10, fr(at) + 24);
  return (
    <>
      <Svg>
        <ellipse cx={x} cy={y + 10} rx={40 + 160 * r} ry={(40 + 160 * r) * 0.32} fill="none" stroke={L.accent} strokeWidth={4} opacity={0.6 * (1 - r)} />
        <ellipse cx={x} cy={y + 10} rx={46} ry={14} fill={L.ink} opacity={0.15 * p} />
        <g transform={`translate(${x} ${y - 220 * (1 - p)}) scale(${0.6 + 0.4 * p})`}>
          <path d="M 0 0 C -30 -60 -95 -110 -95 -180 A 95 95 0 1 1 95 -180 C 95 -110 30 -60 0 0 Z" fill={L.accent} />
          <circle cx={0} cy={-182} r={38} fill={L.bg} />
        </g>
      </Svg>
      <div style={{ position: "absolute", top: y + 70, width: W, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>
        <div style={{ fontFamily: `"${L.display}"`, fontWeight: L.displayWeight ?? 700, fontSize: 66, color: L.ink, textTransform: L.upper ? "uppercase" : "none" }}>{title}</div>
        {sub && <div style={{ fontSize: 40, color: L.dim, marginTop: 14, fontWeight: 600 }}>{sub}</div>}
      </div>
    </>
  );
};

/** Phone / WhatsApp call-to-action pill. */
export const CallPill: React.FC<{ at: number; number: string; label?: string; wa?: boolean; y?: number }> = ({ at, number, label, wa = true, y = 1040 }) => {
  const f = useCurrentFrame();
  const L = useLook();
  const p = pop(f, fr(at), 11);
  const lt = ease(f, fr(at) + 8, fr(at) + 20);
  const green = "#25D366";
  return (
    <div style={{ position: "absolute", top: y, width: W, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {label && <div style={{ fontFamily: `"${L.display}"`, fontWeight: L.displayWeight ?? 700, fontSize: 60, color: L.ink, opacity: lt, marginBottom: 40, textTransform: L.upper ? "uppercase" : "none" }}>{label}</div>}
      <div style={{ transform: `scale(${p})`, display: "flex", alignItems: "center", gap: 28, padding: "26px 46px 26px 26px", borderRadius: 999, background: L.card, boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}>
        <svg width={110} height={110} viewBox="-55 -55 110 110">
          <circle r={55} fill={wa ? green : L.accent} />
          <path transform="translate(-27 -27) scale(2.25)" fill="#fff" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        </svg>
        <div style={{ fontFamily: "Inter", fontWeight: 900, fontSize: 66, color: L.ink, letterSpacing: 1 }}>{number}</div>
      </div>
    </div>
  );
};

/** End card: name, rule, tagline. */
export const EndCard: React.FC<{ name: string; tagline: string; small?: string; size?: number }> = ({ name, tagline, small, size = 130 }) => {
  const f = useCurrentFrame();
  const L = useLook();
  const a = ease(f, 0, 22);
  const rule = ease(f, 10, 34);
  const t = ease(f, 18, 32);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: `"${L.display}"`, fontWeight: L.displayWeight ?? 700, fontSize: size, color: L.ink, textAlign: "center", lineHeight: 1.02,
        letterSpacing: mix(24, L.tracking ?? 2, a), opacity: a, textTransform: L.upper ? "uppercase" : "none", padding: "0 70px" }}>{name}</div>
      <div style={{ width: 380 * rule, height: 5, background: L.accent, margin: "46px 0 40px", borderRadius: 3 }} />
      <div style={{ fontSize: 46, color: L.dim, fontWeight: 600, opacity: t, textAlign: "center", padding: "0 90px", lineHeight: 1.3 }}>{tagline}</div>
      {small && <div style={{ position: "absolute", bottom: 230, fontSize: 34, color: L.dim, opacity: t * 0.8 }}>{small}</div>}
    </AbsoluteFill>
  );
};

/** Small rounded label. */
export const Chip: React.FC<{ at: number; text: string; x: number; y: number; bg?: string; color?: string; size?: number }> = ({ at, text, x, y, bg, color, size = 44 }) => {
  const f = useCurrentFrame();
  const L = useLook();
  const p = pop(f, fr(at), 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p})`, background: bg ?? L.accent, color: color ?? L.bg,
      padding: `${size * 0.4}px ${size * 0.8}px`, borderRadius: 999, fontWeight: 700, fontSize: size, whiteSpace: "nowrap" }}>{text}</div>
  );
};
