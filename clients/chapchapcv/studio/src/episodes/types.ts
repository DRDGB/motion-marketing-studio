export type Clip = { id: string; src: [number, number]; at: number; text: string; world?: "light" | "dark" };
export type Timeline = {
  id: string; fps: number; total: number; voSource?: string; audio?: boolean; note?: string;
  clips: Clip[];
  music?: Record<string, unknown>;
  sfx?: { type: string; at: number; gain: number }[];
};
