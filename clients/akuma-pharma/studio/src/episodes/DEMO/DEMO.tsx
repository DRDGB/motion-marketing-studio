// DEMO: a designed example of the engine (no voice, no claims). Shows the grammar: one subject per
// line, word-synced type, a circle reveal into the dark "mechanism" world and back, end card.
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import TL from "./timeline.json";
import WORDS from "./words.json";
import { Backdrop, DarkWorld, Reveal, SceneCam, revealRadius } from "../../lib/stage";
import { Kinetic } from "../../lib/kinetic";
import { CornerBug, EndCard } from "../../lib/endcard";
import { Arrow, Bar, Box, Building, Card, Cart, Chat, Check, Coin, Person, Phone } from "../../lib/icons";
import { WordEntry, ease, fr, pop, scenes, wordsApi } from "../../lib/time";
import { B } from "../../theme";

const { onset, w } = wordsApi(WORDS as WordEntry[]);
export const DEMO_FRAMES = fr(TL.total);
const S = { brand: [0, 3.1], words: [3.1, 6.7], one: [6.7, 9.7], mech: [8.9, 18.6], follow: [18.1, 20.2], end: [20.2, TL.total] } as const;
const { seq, loc } = scenes(S);
const HERO = { x: 540, y: 1180 };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => <svg width={1080} height={1920} style={{ position: "absolute" }}>{children}</svg>;

const SceneBrand: React.FC = () => {
  const f = useCurrentFrame();
  const k = pop(f, loc("brand", onset("L01", 0)), 12);
  const lit = f > loc("brand", onset("L01", 5)) ? 1 : 0;
  return (
    <Backdrop>
      <SceneCam dur={seq("brand").durationInFrames}>
        <Svg><Phone x={HERO.x} y={HERO.y} s={1.3 * k} lit={lit} label={B.name} /></Svg>
      </SceneCam>
      <Kinetic offset={S.brand[0]} lines={[[w("L01", 0, "This", "dim"), w("L01", 1, "is", "dim"), w("L01", 2, "your", "base")], [w("L01", 3, "BRAND…", "big")], [w("L01", 4, "in", "dim"), w("L01", 5, "MOTION.", "accent")]]} />
    </Backdrop>
  );
};

const SceneWords: React.FC = () => {
  const f = useCurrentFrame();
  const b = [1, 3, 6].map((i) => pop(f, loc("words", onset("L02", i))));
  return (
    <Backdrop>
      <Svg>
        <Chat x={420} y={1000} s={b[0]} o={Math.min(1, b[0] * 2)} text="word" w={300} />
        <Chat x={640} y={1200} s={b[1]} o={Math.min(1, b[1] * 2)} text="lands" w={300} fromRight />
        <Chat x={440} y={1400} s={b[2]} o={Math.min(1, b[2] * 2)} text="on time" w={340} />
      </Svg>
      <Kinetic offset={S.words[0]} lines={[[w("L02", 0, "Every", "dim"), w("L02", 1, "WORD", "big")], [w("L02", 2, "lands", "base"), w("L02", 3, "as", "dim"), w("L02", 4, "it", "dim"), w("L02", 5, "is", "dim")], [w("L02", 6, "SPOKEN.", "accent")]]} />
    </Backdrop>
  );
};

const SceneOne: React.FC = () => {
  const f = useCurrentFrame();
  const fade = ease(f, loc("one", onset("L03", 1)), loc("one", onset("L03", 3)));
  const ok = ease(f, loc("one", onset("L03", 6)) - 4, loc("one", onset("L03", 6)) + 10);
  const z = ease(f, loc("one", 8.6), loc("one", 9.6));
  return (
    <Backdrop>
      <AbsoluteFill style={{ transform: `scale(${1 + 4 * z * z})`, transformOrigin: `${HERO.x}px ${HERO.y}px` }}>
        <Svg>
          <Card x={210} y={HERO.y + 40} s={0.8} o={1 - fade} rot={-8} />
          <Cart x={870} y={HERO.y + 20} s={1} o={1 - fade} />
          <Box x={HERO.x} y={HERO.y} s={1.1 + 0.3 * fade} label="PRODUCT" />
          <Check x={HERO.x + 150} y={HERO.y - 170} s={ok} k={ok} />
        </Svg>
      </AbsoluteFill>
      <Kinetic offset={S.one[0]} exitAt={8.9} lines={[[w("L03", 0, "ONE", "accent"), w("L03", 1, "subject", "big")], [w("L03", 2, "on", "dim"), w("L03", 3, "screen", "base")], [w("L03", 4, "at", "dim"), w("L03", 5, "a", "dim"), w("L03", 6, "time.", "base")]]} />
    </Backdrop>
  );
};

const Mechanism: React.FC = () => {
  const f = useCurrentFrame();
  const m = (t: number) => fr(t - S.mech[0]);
  const bld = pop(f, m(onset("L04", 3)), 10);
  const per = pop(f, m(onset("L04", 4)) + 4, 10);
  const arrow = ease(f, m(onset("L05", 1)), m(onset("L05", 4)) + 6);
  const coin = ease(f, m(onset("L05", 3)), m(onset("L05", 4)) + 14);
  const bar = ease(f, m(onset("L06", 2)), m(onset("L06", 6)) + 8);
  const flow = f < m(onset("L06", 0)) ? 1 : 1 - ease(f, m(onset("L06", 0)), m(onset("L06", 0)) + 10);
  return (
    <DarkWorld>
      <Svg>
        <g opacity={flow}>
          <Building x={250} y={1350} s={0.85 * bld} o={Math.min(1, bld * 2)} kind="office" label="BUSINESS" dark />
          <Person x={830} y={1500} s={0.75 * per} o={Math.min(1, per * 2)} dark />
          <Arrow d="M 420 1180 Q 560 1020 720 1180" k={arrow} len={420} dark />
          {coin > 0 && coin < 1 && <Coin x={420 + 300 * coin} y={1180 - Math.sin(coin * Math.PI) * 150} r={44} />}
        </g>
        <Bar x={540} y={1250} v={0.8 * bar} o={Math.min(1, bar * 3)} label="The one idea" value="↑" w={760} dark />
      </Svg>
      <Kinetic dark offset={S.mech[0]} exitAt={12.6} lines={[[w("L04", 0, "Then", "dim"), w("L04", 1, "we", "dim"), w("L04", 2, "OPEN", "accent")], [w("L04", 3, "the", "dim"), w("L04", 4, "MECHANISM…", "big")]]} />
      <Kinetic dark offset={S.mech[0]} exitAt={15.0} lines={[[w("L05", 0, "show", "dim"), w("L05", 1, "how", "base"), w("L05", 2, "it", "dim")], [w("L05", 3, "REALLY", "accent"), w("L05", 4, "works,", "big")]]} />
      <Kinetic dark offset={S.mech[0]} lines={[[w("L06", 0, "and", "dim"), w("L06", 1, "land", "base"), w("L06", 2, "the", "dim")], [w("L06", 3, "ONE", "accent"), w("L06", 4, "IDEA", "accent")], [w("L06", 5, "that", "dim"), w("L06", 6, "matters.", "base")]]} />
    </DarkWorld>
  );
};

const SceneFollow: React.FC = () => (
  <Backdrop>
    <Kinetic offset={S.follow[0]} top={700} lines={[[w("L07", 0, "Follow", "big")], [w("L07", 1, "for", "dim"), w("L07", 2, "more.", "accent")]]} />
  </Backdrop>
);

export const DEMO: React.FC = () => {
  const f = useCurrentFrame();
  const r = revealRadius(f, fr(8.9), fr(9.7), fr(17.95), fr(18.6));
  return (
    <AbsoluteFill>
      <Sequence {...seq("brand")}><SceneBrand /></Sequence>
      <Sequence {...seq("words")}><SceneWords /></Sequence>
      <Sequence {...seq("one")}><SceneOne /></Sequence>
      <Sequence {...seq("follow")}><SceneFollow /></Sequence>
      <Sequence {...seq("mech")}><Reveal r={r} cx={HERO.x} cy={HERO.y}><Mechanism /></Reveal></Sequence>
      <Sequence {...seq("end")}><EndCard /></Sequence>
      {f > fr(3.1) && f < fr(S.end[0]) && <CornerBug dark={f > fr(9.7) && f < fr(18.0)} />}
    </AbsoluteFill>
  );
};
