// Phase 4 motion test: The Thread in both worlds + end card (no voice). 8 s.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, DISPLAY, TEXT } from "../../theme";
import { Backdrop, DarkWorld } from "../../lib/stage";
import { EndCard, CornerBug } from "../../lib/endcard";
import { Thread, Node, Knot, Pt } from "../../lib/thread";
import { PharmaPlant, Pharmacist, Ship, Pharmacy, Folder, DocStack } from "../../lib/akuma_icons";
import { ease, pop, fr } from "../../lib/time";

export const THREAD_TEST_FRAMES = fr(8);

const PATH: Pt[] = [[250, 1400], [300, 1060], [430, 920], [650, 1000], [560, 1300], [760, 1450], [860, 1270]];

const WhiteScene: React.FC = () => {
  const f = useCurrentFrame();
  const k = ease(f, 8, 100);
  return (
    <Backdrop>
      <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 92, fontWeight: 700, color: C.ink, lineHeight: 1.05, opacity: pop(f, 4) }}>
        India is far.<br />Your team there <span style={{ color: C.accent, fontStyle: "italic" }}>isn't.</span>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <PharmaPlant x={250} y={1500} s={0.62 * pop(f, 2)} />
        <Pharmacist x={520} y={860} s={0.5 * pop(f, 34)} arm={ease(f, 44, 56)} />
        <Ship x={560} y={1440} s={0.55 * pop(f, 62)} accent />
        <Pharmacy x={860} y={1180} s={0.48 * pop(f, 80)} />
        <Thread pts={PATH} k={k} />
        <Node x={430} y={920} pop={pop(f, 40)} />
        <Node x={560} y={1300} pop={pop(f, 70)} />
        <Knot x={860} y={1290} k={ease(f, 98, 112)} s={0.8} />
      </svg>
      <div style={{ position: "absolute", bottom: 210, width: "100%", textAlign: "center", fontFamily: TEXT, fontSize: 40, fontWeight: 700, letterSpacing: 4, color: C.dim, opacity: ease(f, 96, 110) }}>FROM THEIR FACTORY · TO YOUR DOOR</div>
      <CornerBug />
    </Backdrop>
  );
};

const RedScene: React.FC = () => {
  const f = useCurrentFrame();
  const spread = 1 - ease(f, 20, 50);
  return (
    <DarkWorld>
      <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontSize: 96, fontWeight: 700, color: C.light, lineHeight: 1.05, opacity: pop(f, 2) }}>
        Forty emails…<br /><span style={{ color: C.ink, fontStyle: "italic" }}>or one folder.</span>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {f < 52 ? <DocStack x={540} y={1050} n={6} spread={spread} dark /> : <Folder x={540} y={1050} s={pop(f, 50)} dark />}
        <Thread pts={[[120, 1500], [400, 1420], [540, 1200]]} k={ease(f, 40, 70)} dark />
      </svg>
      <CornerBug dark />
    </DarkWorld>
  );
};

export const THREAD_TEST: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Sequence from={0} durationInFrames={fr(4)}><WhiteScene /></Sequence>
    <Sequence from={fr(4)} durationInFrames={fr(2.4)}><RedScene /></Sequence>
    <Sequence from={fr(6.4)} durationInFrames={fr(1.6)}><EndCard dark={false} cta="MESSAGE US ON WHATSAPP" /></Sequence>
  </AbsoluteFill>
);
