// Episode registry. scripts/new_episode.py inserts new imports/entries at the markers.
import type React from "react";
import { DEMO, DEMO_FRAMES } from "./DEMO/DEMO";
import { CCV_001_AWA, CCV_001_AWA_FRAMES } from "./CCV_001_AWA/CCV_001_AWA";
// @mms-imports

export const EPISODES: { id: string; component: React.FC; frames: number }[] = [
  { id: "DEMO", component: DEMO, frames: DEMO_FRAMES },
  { id: "CCV-001-AWA", component: CCV_001_AWA, frames: CCV_001_AWA_FRAMES },
  // @mms-entries
];
