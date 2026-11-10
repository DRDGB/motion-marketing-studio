// One composition per prospect. IDs match hq/prospecting/PIPELINE.csv (video_id, with "-" for "_").
import type React from "react";
import { LBF, LBF_FRAMES } from "./LBF";
import { ANTIKA, ANTIKA_FRAMES } from "./ANTIKA";
import { MAKENA, MAKENA_FRAMES } from "./MAKENA";
import { MARIACILE, MARIACILE_FRAMES } from "./MARIACILE";
import { AYES, AYES_FRAMES } from "./AYES";
import { AKABASELE, AKABASELE_FRAMES } from "./AKABASELE";
import { MIA, MIA_FRAMES } from "./MIA";
import { CLOCHETTE, CLOCHETTE_FRAMES } from "./CLOCHETTE";
import { AHLAM, AHLAM_FRAMES } from "./AHLAM";
import { FIVE, FIVE_FRAMES } from "./FIVE";

export const FILMS: { id: string; component: React.FC; frames: number }[] = [
  { id: "SPEC-LBF", component: LBF, frames: LBF_FRAMES },
  { id: "SPEC-ANTIKA", component: ANTIKA, frames: ANTIKA_FRAMES },
  { id: "SPEC-MAKENA", component: MAKENA, frames: MAKENA_FRAMES },
  { id: "SPEC-MARIACILE", component: MARIACILE, frames: MARIACILE_FRAMES },
  { id: "SPEC-AYES", component: AYES, frames: AYES_FRAMES },
  { id: "SPEC-AKABASELE", component: AKABASELE, frames: AKABASELE_FRAMES },
  { id: "SPEC-MIA", component: MIA, frames: MIA_FRAMES },
  { id: "SPEC-CLOCHETTE", component: CLOCHETTE, frames: CLOCHETTE_FRAMES },
  { id: "SPEC-AHLAM", component: AHLAM, frames: AHLAM_FRAMES },
  { id: "SPEC-FIVE", component: FIVE, frames: FIVE_FRAMES },
];
