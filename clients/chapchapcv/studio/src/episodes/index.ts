// Episode registry. scripts/new_episode.py inserts new imports/entries at the markers.
import type React from "react";
import { DEMO, DEMO_FRAMES } from "./DEMO/DEMO";
import { CCV_001_AWA, CCV_001_AWA_FRAMES } from "./CCV_001_AWA/CCV_001_AWA";
import { CCV_002_APP, CCV_002_APP_FRAMES } from "./CCV_002_APP/CCV_002_APP";
// @mms-imports

export const EPISODES: { id: string; component: React.FC; frames: number }[] = [
  { id: "DEMO", component: DEMO, frames: DEMO_FRAMES },
  { id: "CCV-001-AWA", component: CCV_001_AWA, frames: CCV_001_AWA_FRAMES },
  { id: "CCV-002-APP", component: CCV_002_APP, frames: CCV_002_APP_FRAMES },
  // @mms-entries
];
