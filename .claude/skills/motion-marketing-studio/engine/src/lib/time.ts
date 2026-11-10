import { Easing, interpolate } from "remotion";
import { ENERGY } from "../theme";

export const FPS = 30;
export const fr = (s: number) => Math.round(s * FPS);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0→1 with a small overshoot, starting at frame `at`. */
export const pop = (f: number, at: number, d = 8) => interpolate(f, [at - 2, at + d / ENERGY], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
/** 0→1 smooth between frames a and b. */
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
/** Visible 0→1→0 window between seconds a and b (8-frame fades), for frame f measured from `offset` seconds. */
export const windowed = (f: number, a: number, b: number, offset = 0) => {
  const A = fr(a - offset), Bf = fr(b - offset);
  return interpolate(f, [A, A + 8, Bf - 8, Bf], [0, 1, 1, 0], clamp);
};
/** Build Sequence props + local-frame helpers from a scene map {name: [start, end]} in seconds. */
export const scenes = <K extends string>(S: Record<K, readonly [number, number]>) => ({
  seq: (k: K) => ({ from: fr(S[k][0]), durationInFrames: Math.max(1, fr(S[k][1]) - fr(S[k][0])) }),
  loc: (k: K, t: number) => fr(t - S[k][0]),
});

export type WordEntry = { clip: string; w: string; t: number };
/** Word API bound to one episode's words.json: onset(clip, i) seconds; w(clip, i, text, style). */
export type WStyle = "base" | "dim" | "small" | "big" | "accent" | "outline" | "ghost";
export type KWord = { text: string; t: number; style?: WStyle };
export const wordsApi = (list: WordEntry[]) => {
  const on = (clip: string, i: number) => {
    const l = list.filter((e) => e.clip === clip);
    if (!l[i]) throw new Error(`No word ${i} in ${clip}`);
    return l[i].t;
  };
  return {
    onset: on,
    w: (clip: string, i: number, text: string, style: WStyle = "base"): KWord => ({ text, t: on(clip, i), style }),
    /** Rough-cut helper: all words of a clip, stacked ~3 per line; the last word is the accent. */
    auto: (clip: string, perLine = 3): KWord[][] => {
      const l = list.filter((e) => e.clip === clip);
      const out: KWord[][] = [];
      l.forEach((e, i) => {
        const style: WStyle = i === l.length - 1 ? "accent" : e.w.replace(/[^\p{L}\p{N}]/gu, "").length > 6 ? "base" : "dim";
        if (i % perLine === 0) out.push([]);
        out[out.length - 1].push({ text: e.w, t: e.t, style });
      });
      return out;
    },
  };
};
