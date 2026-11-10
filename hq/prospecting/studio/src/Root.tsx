import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "./fonts";
import { FILMS } from "./films";

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
    {FILMS.map((e) => (
      <Composition key={e.id} id={e.id} component={e.component} durationInFrames={e.frames} fps={30} width={1080} height={1920} />
    ))}
  </>
);
