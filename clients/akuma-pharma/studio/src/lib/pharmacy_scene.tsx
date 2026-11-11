// A Lagos-style community pharmacy interior (generic, no brand or product names): sign, shelves of unlabelled
// cartons/bottles/blisters, counter, window to the street. `empty[k]` (0..1) empties shelf section k; tags pop on empty.
import React from "react";
import { C, TEXT, alpha } from "../theme";

const OUT = "#16181D";
const WALL = "#F6F2EC", FLOOR = "#E6E0D6";
const BOX_TOPS = [C.accent, OUT, "#9AA0A8", "#F2B8C0", "#FFFFFF", C.accentDeep];

type Item = { kind: "box" | "bottle" | "blister"; w: number; h: number; top: string };
const rowItems = (seed: number, width: number): Item[] => {
  const out: Item[] = []; let x = 0, k = seed;
  while (x < width - 40) {
    k = (k * 9301 + 49297) % 233280; const r = k / 233280;
    const kind: Item["kind"] = r < 0.55 ? "box" : r < 0.8 ? "bottle" : "blister";
    const w = kind === "box" ? 46 + Math.round(r * 30) : kind === "bottle" ? 34 : 60;
    const h = kind === "box" ? 70 + Math.round(r * 30) : kind === "bottle" ? 78 : 50;
    if (x + w > width) break;
    out.push({ kind, w, h, top: BOX_TOPS[Math.floor(r * 97) % BOX_TOPS.length] });
    x += w + 8;
  }
  return out;
};

const ShelfUnit: React.FC<{ x: number; y: number; w: number; rows: number; seed: number; empty: number; tag?: number }> = ({ x, y, w, rows, seed, empty, tag = 0 }) => {
  const rh = 130;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={w} height={rows * rh + 20} rx={6} fill="#FFFFFF" stroke={OUT} strokeWidth={6} />
      {Array.from({ length: rows }).map((_, r) => {
        const items = rowItems(seed * 31 + r * 7, w - 30);
        const total = items.length;
        return (
          <g key={r} transform={`translate(15 ${r * rh + 12})`}>
            {items.map((it, i) => {
              const gone = empty * (total + 2) > (total - i) + (r % 2) * 0.5; // empties right → left, row by row
              if (gone) return null;
              const xx = items.slice(0, i).reduce((a, b) => a + b.w + 8, 0);
              const by = rh - 14 - it.h;
              if (it.kind === "box") return <g key={i}><rect x={xx} y={by} width={it.w} height={it.h} rx={4} fill="#FFFFFF" stroke={OUT} strokeWidth={4} /><rect x={xx} y={by} width={it.w} height={16} rx={4} fill={it.top} stroke={OUT} strokeWidth={4} /><rect x={xx + 8} y={by + 30} width={it.w - 16} height={6} fill={alpha(OUT, 0.35)} /></g>;
              if (it.kind === "bottle") return <g key={i}><rect x={xx + 8} y={by} width={it.w - 16} height={14} rx={3} fill={OUT} /><rect x={xx} y={by + 12} width={it.w} height={it.h - 12} rx={10} fill={it.top === "#FFFFFF" ? "#F2B8C0" : it.top} stroke={OUT} strokeWidth={4} /><rect x={xx + 5} y={by + 34} width={it.w - 10} height={22} fill="#FFFFFF" /></g>;
              return <g key={i}><rect x={xx} y={by + 10} width={it.w} height={it.h - 10} rx={6} fill="#E9ECEF" stroke={OUT} strokeWidth={4} />{[0, 1, 2].map((c) => <circle key={c} cx={xx + 14 + c * 16} cy={by + 32} r={6} fill={alpha(OUT, 0.6)} />)}</g>;
            })}
            <rect x={-15} y={rh - 14} width={w} height={12} fill={OUT} />
          </g>
        );
      })}
      {tag > 0 && [0.25, 0.62].map((u, i) => (
        <g key={i} transform={`translate(${w / 2} ${rows * rh * u + 20}) rotate(${-6 + 10 * i}) scale(${tag})`}>
          <rect x={-108} y={-24} width={216} height={48} rx={8} fill={C.accent} stroke={OUT} strokeWidth={4} />
          <text x={0} y={8} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={23} letterSpacing={1} fill="#FFFFFF">OUT OF STOCK</text>
        </g>
      ))}
    </g>
  );
};

/** Full interior. Coordinates are screen pixels (1080×1920). Top of the room at `top`. */
export const PharmacyInterior: React.FC<{ top?: number; empty?: number[]; tags?: number[]; window?: boolean; light?: number }> = ({ top = 380, empty = [0, 0, 0], tags = [0, 0, 0], window = true, light = 0 }) => (
  <g>
    <rect x={0} y={top} width={1080} height={1920 - top} fill={WALL} />
    {/* floor */}
    <rect x={0} y={top + 1000} width={1080} height={1920 - top - 1000} fill={FLOOR} />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${i * 120} ${top + 1000} L ${i * 160 - 180} 1920`} stroke={alpha(OUT, 0.08)} strokeWidth={3} />)}
    {/* sign */}
    <g transform={`translate(540 ${top + 70})`}>
      <rect x={-300} y={-55} width={600} height={110} rx={14} fill={OUT} />
      <g transform="translate(-220 0)"><rect x={-34} y={-34} width={68} height={68} rx={12} fill="#FFFFFF" /><rect x={-9} y={-26} width={18} height={52} rx={3} fill={OUT} /><rect x={-26} y={-9} width={52} height={18} rx={3} fill={OUT} /></g>
      <text x={40} y={22} textAnchor="middle" fontFamily={TEXT} fontWeight={800} fontSize={64} letterSpacing={10} fill="#FFFFFF">PHARMACY</text>
    </g>
    {/* window with street light */}
    {window && <g transform={`translate(60 ${top + 170})`}>
      <rect x={0} y={0} width={200} height={300} rx={8} fill={`rgba(255, 214, 150, ${0.35 + 0.35 * light})`} stroke={OUT} strokeWidth={6} />
      <path d="M 100 0 L 100 300 M 0 150 L 200 150" stroke={OUT} strokeWidth={5} />
      {/* small Nigerian flag bunting */}
      {[20, 70, 120, 170].map((bx, i) => <path key={i} d={`M ${bx} 18 L ${bx + 30} 18 L ${bx + 15} 48 Z`} fill={i % 2 ? "#FFFFFF" : "#008751"} stroke={OUT} strokeWidth={2} />)}
    </g>}
    {/* shelves */}
    <ShelfUnit x={290} y={top + 170} w={250} rows={4} seed={3} empty={empty[0]} tag={tags[0]} />
    <ShelfUnit x={560} y={top + 170} w={250} rows={4} seed={5} empty={empty[1]} tag={tags[1]} />
    <ShelfUnit x={830} y={top + 170} w={220} rows={4} seed={8} empty={empty[2]} tag={tags[2]} />
  </g>
);

/** The counter (draw AFTER people standing behind it, BEFORE people in front). */
export const Counter: React.FC<{ top?: number }> = ({ top = 380 }) => (
  <g transform={`translate(0 ${top + 820})`}>
    <rect x={250} y={0} width={830} height={40} fill={OUT} />
    <rect x={262} y={40} width={806} height={230} fill="#FFFFFF" stroke={OUT} strokeWidth={6} />
    <rect x={262} y={40} width={806} height={34} fill={C.accent} />
    <g transform="translate(665 170)"><rect x={-34} y={-34} width={68} height={68} rx={12} fill={OUT} /><rect x={-9} y={-26} width={18} height={52} rx={3} fill="#FFFFFF" /><rect x={-26} y={-9} width={52} height={18} rx={3} fill="#FFFFFF" /></g>
  </g>
);
