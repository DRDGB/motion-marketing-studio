// Episode registry. scripts/new_episode.py inserts new imports/entries at the markers.
import type React from "react";
import { DEMO, DEMO_FRAMES } from "./DEMO/DEMO";
import { AKV_001_CLOSER, AKV_001_CLOSER_FRAMES } from "./AKV_001_CLOSER/AKV_001_CLOSER";
import { AKV_002_COPP, AKV_002_COPP_FRAMES } from "./AKV_002_COPP/AKV_002_COPP";
import { AKV_003_GMP_VS_PQ, AKV_003_GMP_VS_PQ_FRAMES } from "./AKV_003_GMP_VS_PQ/AKV_003_GMP_VS_PQ";
import { AKV_004_FIVE_DOCS, AKV_004_FIVE_DOCS_FRAMES } from "./AKV_004_FIVE_DOCS/AKV_004_FIVE_DOCS";
import { AKV_005_ZONE_IVB, AKV_005_ZONE_IVB_FRAMES } from "./AKV_005_ZONE_IVB/AKV_005_ZONE_IVB";
import { THREAD_TEST, THREAD_TEST_FRAMES } from "./THREAD_TEST/THREAD_TEST";
import { ICON_SHEET, ICON_SHEET_FRAMES } from "./ICON_SHEET/ICON_SHEET";
// @mms-imports

export const EPISODES: { id: string; component: React.FC; frames: number }[] = [
  { id: "DEMO", component: DEMO, frames: DEMO_FRAMES },
  { id: "AKV-001-CLOSER", component: AKV_001_CLOSER, frames: AKV_001_CLOSER_FRAMES },
  { id: "AKV-002-COPP", component: AKV_002_COPP, frames: AKV_002_COPP_FRAMES },
  { id: "AKV-003-GMP-VS-PQ", component: AKV_003_GMP_VS_PQ, frames: AKV_003_GMP_VS_PQ_FRAMES },
  { id: "AKV-004-FIVE-DOCS", component: AKV_004_FIVE_DOCS, frames: AKV_004_FIVE_DOCS_FRAMES },
  { id: "AKV-005-ZONE-IVB", component: AKV_005_ZONE_IVB, frames: AKV_005_ZONE_IVB_FRAMES },
  { id: "THREAD-TEST", component: THREAD_TEST, frames: THREAD_TEST_FRAMES },
  { id: "ICON-SHEET", component: ICON_SHEET, frames: ICON_SHEET_FRAMES },
  // @mms-entries
];
