// Drawn characters for Akuma Pharma scenarios (illustrative people; never presented as real customers).
// Front view, flat style with a dark outline. Origin = between the feet; height ≈ 1000 units at s = 1.
import React from "react";
import { C, alpha } from "../theme";

export const SKIN = { deep: "#4A2C1D", brown: "#6B4027", warm: "#8A5634", light: "#A86E45" };
const OUT = "#16181D";
export type Arm = { up: number; low: number }; // degrees from straight down; + = outward from the body
export type Look = {
  skin: string; hair: "short" | "bald" | "wrap" | "puff" | "grey" | "cap"; hairColor?: string; wrap?: string; beard?: boolean; glasses?: boolean;
};
export type Outfit = {
  top: "polo" | "shirt" | "coat" | "blouse" | "tee"; topColor: string; under?: string; bottom: "trousers" | "skirt"; bottomColor: string; shoes?: string; badge?: boolean;
};
export type Prop = "phone" | "box" | "bag" | "stick" | "clipboard" | "none";
export type Face = "smile" | "big-smile" | "neutral" | "sad" | "talk" | "surprised" | "worried";

const rad = (d: number) => (d * Math.PI) / 180;
const limb = (sx: number, sy: number, side: number, a: Arm, L1 = 185, L2 = 165) => {
  const ex = sx + side * L1 * Math.sin(rad(a.up)), ey = sy + L1 * Math.cos(rad(a.up));
  const hx = ex + side * L2 * Math.sin(rad(a.low)), hy = ey + L2 * Math.cos(rad(a.low));
  return { ex, ey, hx, hy };
};

const Mouth: React.FC<{ face: Face; talk: number }> = ({ face, talk }) => {
  const y = -852;
  if (face === "big-smile") return <path d={`M -30 ${y - 6} Q 0 ${y + 30} 30 ${y - 6} Z`} fill="#5A1414" stroke={OUT} strokeWidth={4} />;
  if (face === "smile") return <path d={`M -26 ${y - 4} Q 0 ${y + 18} 26 ${y - 4}`} fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />;
  if (face === "sad") return <path d={`M -22 ${y + 8} Q 0 ${y - 10} 22 ${y + 8}`} fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />;
  if (face === "worried") return <path d={`M -20 ${y + 4} Q -6 ${y - 4} 4 ${y + 2} Q 14 ${y + 8} 22 ${y}`} fill="none" stroke={OUT} strokeWidth={6} strokeLinecap="round" />;
  if (face === "surprised") return <ellipse cx={0} cy={y + 2} rx={12} ry={16} fill="#5A1414" stroke={OUT} strokeWidth={4} />;
  if (face === "talk") return <ellipse cx={0} cy={y + 2} rx={16} ry={4 + 10 * talk} fill="#5A1414" stroke={OUT} strokeWidth={4} />;
  return <path d={`M -20 ${y + 2} L 20 ${y + 2}`} stroke={OUT} strokeWidth={6} strokeLinecap="round" />;
};

const Hand: React.FC<{ x: number; y: number; skin: string }> = ({ x, y, skin }) => <circle cx={x} cy={y} r={27} fill={skin} stroke={OUT} strokeWidth={5} />;

/** A person. armL/armR: viewer's left/right arm. blink 0..1 closes the eyes. talk 0..1 opens the mouth when face = "talk". */
export const Person: React.FC<{
  x: number; y: number; s?: number; o?: number; look: Look; outfit: Outfit; face?: Face; armL?: Arm; armR?: Arm; prop?: Prop; propSide?: "L" | "R";
  blink?: number; talk?: number; lean?: number; flip?: boolean; brows?: "up" | "down" | "flat";
}> = ({ x, y, s = 0.45, o = 1, look, outfit, face = "smile", armL = { up: 12, low: 6 }, armR = { up: 12, low: 6 }, prop = "none", propSide = "R", blink = 0, talk = 0, lean = 0, flip, brows = "flat" }) => {
  const skin = look.skin;
  const shoe = outfit.shoes ?? "#1B1B1F";
  const L = limb(-112, -742, -1, armL), R = limb(112, -742, 1, armR);
  const hand = propSide === "R" ? R : L;
  const coat = outfit.top === "coat";
  const torsoColor = coat ? "#FFFFFF" : outfit.topColor;
  const eyeRy = 10 * (1 - blink) + 1;
  const browY = brows === "up" ? -948 : brows === "down" ? -934 : -940;
  const sleeve = coat ? "#FFFFFF" : outfit.top === "tee" || outfit.top === "polo" ? outfit.topColor : outfit.topColor;
  const armPath = (sx: number, sy: number, l: { ex: number; ey: number; hx: number; hy: number }) => `M ${sx} ${sy} L ${l.ex} ${l.ey} L ${l.hx} ${l.hy}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) rotate(${lean})`} opacity={o}>
      {/* shadow */}
      <ellipse cx={0} cy={6} rx={150} ry={22} fill={alpha("#000000", 0.12)} />
      {/* legs */}
      {outfit.bottom === "trousers" ? (<>
        <path d="M -100 -440 L 100 -440 L 96 -20 L 12 -20 L 0 -330 L -12 -20 L -96 -20 Z" fill={outfit.bottomColor} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      </>) : (<>
        <rect x={-58} y={-180} width={36} height={170} rx={16} fill={skin} stroke={OUT} strokeWidth={5} />
        <rect x={22} y={-180} width={36} height={170} rx={16} fill={skin} stroke={OUT} strokeWidth={5} />
        <path d="M -104 -440 L 104 -440 L 140 -150 Q 0 -128 -140 -150 Z" fill={outfit.bottomColor} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        {/* wrapper pattern */}
        {[-300, -230].map((yy) => <path key={yy} d={`M -128 ${yy} Q 0 ${yy + 14} 128 ${yy}`} stroke={alpha("#FFFFFF", 0.55)} strokeWidth={8} fill="none" />)}
      </>)}
      <ellipse cx={-55} cy={-8} rx={52} ry={18} fill={shoe} />
      <ellipse cx={55} cy={-8} rx={52} ry={18} fill={shoe} />
      {/* torso */}
      <path d="M -122 -728 Q -122 -778 -72 -790 L 72 -790 Q 122 -778 122 -728 L 104 -420 L -104 -420 Z" fill={torsoColor} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      {coat && <>
        <path d="M -122 -728 L -128 -280 L -8 -280 L -8 -790 L -72 -790 Q -122 -778 -122 -728 Z" fill="#FFFFFF" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 122 -728 L 128 -280 L 8 -280 L 8 -790 L 72 -790 Q 122 -778 122 -728 Z" fill="#FFFFFF" stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -8 -790 L -8 -560 L 8 -560 L 8 -790 Z" fill={outfit.under ?? C.accent} />
        <path d="M -40 -790 L -8 -650 M 40 -790 L 8 -650" stroke={OUT} strokeWidth={5} />
        <rect x={50} y={-610} width={52} height={60} rx={6} fill="none" stroke={OUT} strokeWidth={4} />
        <rect x={60} y={-626} width={8} height={26} rx={3} fill={C.accent} />
      </>}
      {outfit.top === "polo" && <>
        <path d="M -40 -792 L 0 -748 L 40 -792 L 22 -720 L -22 -720 Z" fill={alpha("#000000", 0.18)} />
        <path d="M -46 -794 L -14 -748 L -30 -728 Z M 46 -794 L 14 -748 L 30 -728 Z" fill="#FFFFFF" stroke={OUT} strokeWidth={4} />
        {outfit.badge && <g transform="translate(-62 -660)"><rect x={-6} y={-20} width={12} height={40} rx={2} fill="#FFFFFF" /><rect x={-20} y={-6} width={40} height={12} rx={2} fill="#FFFFFF" /></g>}
      </>}
      {outfit.top === "shirt" && <path d="M -40 -792 L 0 -740 L 40 -792 M 0 -740 L 0 -430" stroke={OUT} strokeWidth={5} fill="none" />}
      {outfit.top === "blouse" && <path d="M -60 -790 Q 0 -720 60 -790" fill={alpha("#000000", 0.15)} stroke={OUT} strokeWidth={4} />}
      {/* arms (sleeve + forearm skin) */}
      {[{ sx: -112, l: L }, { sx: 112, l: R }].map(({ sx, l }, i) => (
        <g key={i}>
          <path d={armPath(sx, -742, l)} stroke={OUT} strokeWidth={66} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M ${sx} -742 L ${l.ex} ${l.ey}`} stroke={sleeve} strokeWidth={56} fill="none" strokeLinecap="round" />
          <path d={`M ${l.ex} ${l.ey} L ${l.hx} ${l.hy}`} stroke={coat ? "#FFFFFF" : skin} strokeWidth={coat ? 56 : 48} fill="none" strokeLinecap="round" />
          <Hand x={l.hx} y={l.hy} skin={skin} />
        </g>
      ))}
      {/* props */}
      {prop === "phone" && <g transform={`translate(${hand.hx} ${hand.hy - 10}) rotate(${propSide === "R" ? -15 : 15})`}><rect x={-22} y={-60} width={44} height={86} rx={9} fill={OUT} /><rect x={-16} y={-52} width={32} height={66} rx={5} fill="#3A3F4A" /></g>}
      {prop === "clipboard" && <g transform={`translate(${hand.hx} ${hand.hy - 40})`}><rect x={-45} y={-60} width={90} height={120} rx={8} fill="#7A5236" stroke={OUT} strokeWidth={4} /><rect x={-36} y={-48} width={72} height={98} rx={4} fill="#FFFFFF" /><rect x={-26} y={-30} width={52} height={7} fill={alpha(OUT, 0.5)} /><rect x={-26} y={-12} width={40} height={7} fill={alpha(OUT, 0.5)} /></g>}
      {prop === "bag" && <g transform={`translate(${hand.hx} ${hand.hy + 70})`}><rect x={-55} y={-40} width={110} height={110} rx={10} fill="#FFFFFF" stroke={OUT} strokeWidth={5} /><path d="M -30 -40 Q -30 -80 0 -80 Q 30 -80 30 -40" fill="none" stroke={OUT} strokeWidth={5} /><rect x={-10} y={0} width={20} height={44} fill={OUT} /><rect x={-22} y={12} width={44} height={20} fill={OUT} /></g>}
      {prop === "stick" && <path d={`M ${hand.hx} ${hand.hy} L ${hand.hx + 20} 0`} stroke="#6B4A2F" strokeWidth={16} strokeLinecap="round" />}
      {prop === "box" && <g transform={`translate(${(L.hx + R.hx) / 2} ${(L.hy + R.hy) / 2 - 40})`}><rect x={-120} y={-90} width={240} height={150} rx={8} fill="#FFFFFF" stroke={OUT} strokeWidth={6} /><rect x={-120} y={-90} width={240} height={34} fill={C.accent} /><rect x={-48} y={-30} width={30} height={10} fill={OUT} /><rect x={-38} y={-40} width={10} height={30} fill={OUT} /></g>}
      {/* neck + head */}
      <rect x={-28} y={-822} width={56} height={44} fill={skin} stroke={OUT} strokeWidth={5} />
      <ellipse cx={-80} cy={-900} rx={15} ry={23} fill={skin} stroke={OUT} strokeWidth={5} />
      <ellipse cx={80} cy={-900} rx={15} ry={23} fill={skin} stroke={OUT} strokeWidth={5} />
      <ellipse cx={0} cy={-905} rx={80} ry={93} fill={skin} stroke={OUT} strokeWidth={5} />
      {look.beard && <path d="M -78 -905 Q -74 -818 0 -808 Q 74 -818 78 -905 Q 62 -856 0 -850 Q -62 -856 -78 -905 Z" fill={look.hairColor ?? "#1B1B1B"} />}
      {/* hair */}
      {look.hair === "short" && <path d="M -82 -918 Q -88 -1010 0 -1013 Q 88 -1010 82 -918 Q 74 -968 0 -972 Q -74 -968 -82 -918 Z" fill={look.hairColor ?? "#1B1B1B"} />}
      {look.hair === "grey" && <path d="M -82 -918 Q -86 -985 -40 -1000 Q -50 -965 -78 -935 Z M 82 -918 Q 86 -985 40 -1000 Q 50 -965 78 -935 Z" fill="#CFCFCF" stroke={OUT} strokeWidth={3} />}
      {look.hair === "cap" && <><path d="M -84 -925 Q -84 -1015 0 -1018 Q 84 -1015 84 -925 Z" fill={look.wrap ?? OUT} stroke={OUT} strokeWidth={4} /><path d="M 20 -930 L 130 -925 Q 120 -945 60 -950 Z" fill={look.wrap ?? OUT} stroke={OUT} strokeWidth={4} /></>}
      {look.hair === "puff" && <>{[[-60, -990], [0, -1015], [60, -990], [-30, -1030], [30, -1030]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={48} fill={look.hairColor ?? "#1B1B1B"} />)}</>}
      {look.hair === "wrap" && <>
        <path d="M -98 -925 Q -118 -1068 0 -1082 Q 124 -1072 102 -925 Q 62 -972 0 -972 Q -62 -972 -98 -925 Z" fill={look.wrap ?? C.accent} stroke={OUT} strokeWidth={5} />
        {[-1010, -1040].map((yy) => <path key={yy} d={`M -96 ${yy + 50} Q 0 ${yy} 98 ${yy + 50}`} stroke={alpha("#FFFFFF", 0.6)} strokeWidth={9} fill="none" />)}
        <path d="M 40 -1070 Q 110 -1110 120 -1050 Q 90 -1060 60 -1040 Z" fill={look.wrap ?? C.accent} stroke={OUT} strokeWidth={5} />
      </>}
      {/* face */}
      <path d={`M -48 ${browY} L -14 ${browY + (brows === "down" ? 6 : -2)} M 48 ${browY} L 14 ${browY + (brows === "down" ? 6 : -2)}`} stroke={OUT} strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={-30} cy={-908} rx={9} ry={eyeRy} fill={OUT} />
      <ellipse cx={30} cy={-908} rx={9} ry={eyeRy} fill={OUT} />
      {look.glasses && <g fill="none" stroke={OUT} strokeWidth={5}><circle cx={-30} cy={-906} r={24} /><circle cx={30} cy={-906} r={24} /><path d="M -6 -906 L 6 -906" /></g>}
      <path d="M -4 -892 Q 4 -868 16 -874" fill="none" stroke={alpha(OUT, 0.55)} strokeWidth={5} strokeLinecap="round" />
      <Mouth face={face} talk={talk} />
    </g>
  );
};

/** Speech bubble (screen coords): tail points to (tx, ty). */
export const Bubble: React.FC<{ x: number; y: number; w: number; text: string; tx: number; ty: number; p?: number; dark?: boolean; size?: number; italic?: boolean }> = ({ x, y, w, text, tx, ty, p = 1, dark, size = 46, italic }) => {
  const h = size * 2.2;
  return (
    <g opacity={Math.min(1, p * 1.6)} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p}) translate(${-x} ${-y})`}>
      <path d={`M ${x - w / 2 + 30} ${y + h / 2} L ${tx} ${ty} L ${x - w / 2 + 110} ${y + h / 2} Z`} fill={dark ? C.ink : "#FFFFFF"} stroke={OUT} strokeWidth={5} strokeLinejoin="round" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={dark ? C.ink : "#FFFFFF"} stroke={OUT} strokeWidth={5} />
      <rect x={x - w / 2 + 28} y={y + h / 2 - 8} width={84} height={14} fill={dark ? C.ink : "#FFFFFF"} />
      <text x={x} y={y + size * 0.35} textAnchor="middle" fontFamily="Plus Jakarta Sans" fontWeight={800} fontStyle={italic ? "italic" : "normal"} fontSize={size} fill={dark ? "#FFFFFF" : OUT}>{text}</text>
    </g>
  );
};
