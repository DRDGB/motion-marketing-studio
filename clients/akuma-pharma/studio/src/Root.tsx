import React from "react";
import { Composition } from "remotion";
import { EPISODES } from "./episodes";
import { loadBrandFonts } from "./fonts";

loadBrandFonts();

export const RemotionRoot: React.FC = () => (
  <>
    {EPISODES.map((e) => (
      <Composition key={e.id} id={e.id} component={e.component} durationInFrames={e.frames} fps={30} width={1080} height={1920} />
    ))}
  </>
);
