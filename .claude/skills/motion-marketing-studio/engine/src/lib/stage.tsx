// Worlds and camera: brand backdrop (light), dark "inside" world, slow camera push, circle reveal between worlds.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { B, C, alpha } from "../theme";
import { clamp } from "./time";

/** Light brand world. texture: paper (static grain), clean (soft gradient), grid (blueprint lines). */
export const Backdrop: React.FC<{ children?: React.ReactNode; texture?: "paper" | "clean" | "grid" }> = ({ children, texture = B.texture }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    {texture === "paper" && (
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.3, mixBlendMode: "multiply" }}>
        <filter id="mms-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={11} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.48  0 0 0 0 0.44  0 0 0 0.22 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mms-grain)" />
      </svg>
    )}
    {texture === "grid" && (
      <svg width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <pattern id="mms-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={alpha(C.support[0] ?? C.dim, 0.35)} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mms-grid)" />
      </svg>
    )}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, ${alpha(C.ink, texture === "clean" ? 0.08 : 0.12)} 100%)` }} />
    {children}
  </AbsoluteFill>
);

/** Dark "inside the mechanism" world. */
export const DarkWorld: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.darkSurface} 0%, ${C.dark} 72%)` }}>{children}</AbsoluteFill>
);

/** Slow push over the scene duration (frames). */
export const SceneCam: React.FC<{ dur: number; children: React.ReactNode; push?: number; origin?: string }> = ({ dur, children, push = 0.05, origin = "50% 60%" }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [1, 1 + push], { ...clamp, easing: Easing.bezier(0.33, 0, 0.67, 1) });
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin }}>{children}</AbsoluteFill>;
};

/** Circle reveal with an accent ring (r in px; r > 2300 = full frame). Animate r from the parent. */
export const Reveal: React.FC<{ r: number; cx: number; cy: number; children: React.ReactNode }> = ({ r, cx, cy, children }) => {
  if (r <= 0.5) return null;
  const full = r > 2300;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: full ? undefined : `circle(${r}px at ${cx}px ${cy}px)` }}>{children}</AbsoluteFill>
      {!full && <div style={{ position: "absolute", left: cx - r, top: cy - r, width: 2 * r, height: 2 * r, borderRadius: "50%", border: `${Math.max(5, Math.min(14, r / 30))}px solid ${C.accent}`, boxShadow: `0 0 50px ${alpha(C.accent, 0.45)}` }} />}
    </AbsoluteFill>
  );
};

/** Reveal radius over time: opens [a,b] (seconds → frames handled by caller), closes [c,d]. */
export const revealRadius = (f: number, openA: number, openB: number, closeA?: number, closeB?: number) => {
  const open = interpolate(f, [openA, openB], [0, 2400], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (closeA === undefined || closeB === undefined || f < closeA) return open;
  return interpolate(f, [closeA, closeB], [2400, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
};

/** Small top label for honesty notes ("ILLUSTRATIVE EXAMPLE", "SIMPLIFIED"). */
export const NoteLabel: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => (
  <div style={{ position: "absolute", top: 122, left: 0, right: 0, textAlign: "center", fontFamily: "inherit", fontSize: 20, fontWeight: 700, letterSpacing: 3, color: dark ? C.accent : C.accentDeep, opacity: 0.85 }}>{text}</div>
);
