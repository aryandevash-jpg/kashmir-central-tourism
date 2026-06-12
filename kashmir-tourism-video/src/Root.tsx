import React from "react";
import { Composition } from "remotion";
import { KashmirTourism, KashmirTourismConfig } from "./KashmirTourism";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id={KashmirTourismConfig.id}
      component={KashmirTourism}
      durationInFrames={KashmirTourismConfig.durationInFrames}
      fps={KashmirTourismConfig.fps}
      width={KashmirTourismConfig.width}
      height={KashmirTourismConfig.height}
    />
  </>
);
