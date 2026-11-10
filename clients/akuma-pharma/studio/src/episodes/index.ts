// Episode registry. scripts/new_episode.py inserts new imports/entries at the markers.
import type React from "react";
import { DEMO, DEMO_FRAMES } from "./DEMO/DEMO";
import { AKV_001_CLOSER, AKV_001_CLOSER_FRAMES } from "./AKV_001_CLOSER/AKV_001_CLOSER";
import { THREAD_TEST, THREAD_TEST_FRAMES } from "./THREAD_TEST/THREAD_TEST";
import { ICON_SHEET, ICON_SHEET_FRAMES } from "./ICON_SHEET/ICON_SHEET";
import { AKV_002_WHO_WE_ARE, AKV_002_WHO_WE_ARE_FRAMES } from "./AKV_002_WHO_WE_ARE/AKV_002_WHO_WE_ARE";
import { AKV_003_HOW_TO_WORK, AKV_003_HOW_TO_WORK_FRAMES } from "./AKV_003_HOW_TO_WORK/AKV_003_HOW_TO_WORK";
import { AKV_004_COPP, AKV_004_COPP_FRAMES } from "./AKV_004_COPP/AKV_004_COPP";
import { AKV_005_FIVE_DOCS, AKV_005_FIVE_DOCS_FRAMES } from "./AKV_005_FIVE_DOCS/AKV_005_FIVE_DOCS";
import { AKV_006_GMP_VS_PQ, AKV_006_GMP_VS_PQ_FRAMES } from "./AKV_006_GMP_VS_PQ/AKV_006_GMP_VS_PQ";
import { AKV_007_ZONE_IVB, AKV_007_ZONE_IVB_FRAMES } from "./AKV_007_ZONE_IVB/AKV_007_ZONE_IVB";
// @mms-imports

export const EPISODES: { id: string; component: React.FC; frames: number }[] = [
  { id: "DEMO", component: DEMO, frames: DEMO_FRAMES },
  { id: "AKV-001-CLOSER", component: AKV_001_CLOSER, frames: AKV_001_CLOSER_FRAMES },
  { id: "THREAD-TEST", component: THREAD_TEST, frames: THREAD_TEST_FRAMES },
  { id: "ICON-SHEET", component: ICON_SHEET, frames: ICON_SHEET_FRAMES },
  { id: "AKV-002-WHO-WE-ARE", component: AKV_002_WHO_WE_ARE, frames: AKV_002_WHO_WE_ARE_FRAMES },
  { id: "AKV-003-HOW-TO-WORK", component: AKV_003_HOW_TO_WORK, frames: AKV_003_HOW_TO_WORK_FRAMES },
  { id: "AKV-004-COPP", component: AKV_004_COPP, frames: AKV_004_COPP_FRAMES },
  { id: "AKV-005-FIVE-DOCS", component: AKV_005_FIVE_DOCS, frames: AKV_005_FIVE_DOCS_FRAMES },
  { id: "AKV-006-GMP-VS-PQ", component: AKV_006_GMP_VS_PQ, frames: AKV_006_GMP_VS_PQ_FRAMES },
  { id: "AKV-007-ZONE-IVB", component: AKV_007_ZONE_IVB, frames: AKV_007_ZONE_IVB_FRAMES },
  // @mms-entries
];
