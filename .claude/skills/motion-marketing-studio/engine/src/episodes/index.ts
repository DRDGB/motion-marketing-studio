// Episode registry. scripts/new_episode.py inserts new imports/entries at the markers.
import type React from "react";
import { DEMO, DEMO_FRAMES } from "./DEMO/DEMO";
// @mms-imports

export const EPISODES: { id: string; component: React.FC; frames: number }[] = [
  { id: "DEMO", component: DEMO, frames: DEMO_FRAMES },
  // @mms-entries
];
