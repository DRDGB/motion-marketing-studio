// End card from brand tokens: logo (or wordmark), tagline, CTA pill, handle.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { B, C, DISPLAY, TEXT, alpha } from "../theme";
import { clamp } from "./time";

export const EndCard: React.FC<{ cta?: string; dark?: boolean }> = ({ cta = B.cta, dark = true }) => {
  const f = useCurrentFrame();
  const logo = interpolate(f, [2, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const word = interpolate(f, [16, 34], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const btn = interpolate(f, [34, 48], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const fg = dark ? C.light : C.ink;
  return (
    <AbsoluteFill style={{ background: dark ? `radial-gradient(ellipse at 50% 42%, ${C.darkSurface} 0%, ${C.dark} 72%)` : C.bg, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${0.7 + 0.3 * logo})`, opacity: logo }}>
        {B.logo ? <Img src={staticFile(B.logo)} style={{ maxWidth: 560, maxHeight: 360, objectFit: "contain" }} />
          : <div style={{ fontFamily: DISPLAY, fontSize: 120, fontWeight: 900, letterSpacing: -2, color: fg, textAlign: "center", lineHeight: 1 }}>{B.name}</div>}
      </div>
      <div style={{ marginTop: 40, fontFamily: TEXT, fontSize: 38, fontWeight: 500, color: alpha(fg, 0.7), opacity: word, transform: `translateY(${(1 - word) * 20}px)`, textAlign: "center", padding: "0 90px" }}>{B.tagline}</div>
      <div style={{ marginTop: 70, padding: "22px 46px", borderRadius: 60, border: `3px solid ${C.accent}`, color: C.accent, fontFamily: TEXT, fontSize: 36, fontWeight: 700, letterSpacing: 3, opacity: btn, transform: `scale(${0.8 + 0.2 * btn})` }}>{cta}</div>
      {B.handle && <div style={{ marginTop: 34, fontFamily: TEXT, fontSize: 32, color: alpha(fg, 0.55), opacity: btn }}>{B.handle}</div>}
    </AbsoluteFill>
  );
};

/** Small corner logo / bug (top-right), shown during the video after the hook. */
export const CornerBug: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", top: 60, right: 60, opacity: 0.92 }}>
    {B.logo ? <Img src={staticFile(B.logo)} style={{ height: 70, objectFit: "contain" }} />
      : <div style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 900, color: dark ? C.light : C.ink, padding: "10px 16px", borderRadius: 14, border: `3px solid ${C.accent}` }}>{B.name}</div>}
  </div>
);
