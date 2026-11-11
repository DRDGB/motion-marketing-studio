// Word-synced kinetic typography in the brand's fonts and colours.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, DISPLAY, TEXT, alpha } from "../theme";
import { KWord, WStyle, clamp, fr } from "./time";

const STYLE = (dark: boolean): Record<WStyle, React.CSSProperties> => {
  const ink = dark ? C.light : C.ink;
  const dim = dark ? alpha(C.light, 0.62) : C.dim;
  return {
    base: { fontFamily: TEXT, fontSize: 76, fontWeight: 700, color: ink },
    dim: { fontFamily: TEXT, fontSize: 66, fontWeight: 500, color: dim },
    small: { fontFamily: TEXT, fontSize: 52, fontWeight: 500, color: dim, letterSpacing: 1 },
    big: { fontFamily: DISPLAY, fontSize: 132, fontWeight: 900, color: ink, letterSpacing: -3, lineHeight: 0.98 },
    accent: { fontFamily: DISPLAY, fontSize: 132, fontWeight: 900, color: C.accent, letterSpacing: -3, lineHeight: 0.98 },
    outline: { fontFamily: DISPLAY, fontSize: 132, fontWeight: 900, color: "transparent", WebkitTextStroke: `3px ${ink}`, letterSpacing: -3, lineHeight: 0.98 },
    ghost: { fontFamily: DISPLAY, fontSize: 132, fontWeight: 900, color: alpha(ink, dark ? 0.16 : 0.14), letterSpacing: -3, lineHeight: 0.98 },
  };
};

const Word: React.FC<{ k: KWord; offset: number; dark: boolean }> = ({ k, offset, dark }) => {
  const f = useCurrentFrame();
  const at = fr(k.t - offset) - 2; // lead the voice by ~2 frames: reads as in sync
  const p = interpolate(f, [at, at + 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const heavy = k.style === "accent" || k.style === "big" || k.style === "outline";
  const s = heavy ? interpolate(f, [at, at + 5, at + 10], [1.25, 0.96, 1], clamp) : 1;
  return (
    <span style={{ display: "inline-block", margin: "0 0.16em", opacity: p, transform: `translateY(${(1 - p) * 26}px) scale(${s})`, filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined, ...STYLE(dark)[k.style ?? "base"] }}>
      {k.text}
    </span>
  );
};

/** A block of lines in the top text zone; exits upward at `exitAt` (global seconds). `offset` = the scene's start (seconds). */
export const Kinetic: React.FC<{ lines: KWord[][]; offset: number; top?: number; exitAt?: number; align?: "center" | "left"; dark?: boolean }> = ({ lines, offset, top = 190, exitAt, align = "center", dark = false }) => {
  const f = useCurrentFrame();
  const out = exitAt !== undefined ? interpolate(f, [fr(exitAt - offset) - 6, fr(exitAt - offset)], [1, 0], clamp) : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top, left: 70, right: 70, textAlign: align, opacity: out, transform: `translateY(${(1 - out) * -30}px)` }}>
        {lines.map((line, i) => (
          <div key={i} style={{ lineHeight: 1.12, marginBottom: 6 }}>
            {line.map((k, j) => <Word key={j} k={k} offset={offset} dark={dark} />)}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
