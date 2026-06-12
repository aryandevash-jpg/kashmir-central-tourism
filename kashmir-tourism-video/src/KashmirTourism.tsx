import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./constants";
import { Scene1Opener } from "./scenes/Scene1Opener";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Overview } from "./scenes/Scene3Overview";
import { Scene4TravellerExplore } from "./scenes/Scene4TravellerExplore";
import { Scene5Booking } from "./scenes/Scene5Booking";
import { Scene6Operator } from "./scenes/Scene6Operator";
import { Scene7GovOverview } from "./scenes/Scene7GovOverview";
import { Scene8Analytics } from "./scenes/Scene8Analytics";
import { Scene9Compliance } from "./scenes/Scene9Compliance";
import { Scene10Closing } from "./scenes/Scene10Closing";

const AudioTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FPS], [0, 0.4], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [TOTAL_FRAMES - FPS * 3, TOTAL_FRAMES], [0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const volume = Math.min(fadeIn, fadeOut);

  return <Audio src={staticFile("audio/bg.mp3")} volume={volume} />;
};

export const KashmirTourism: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0D1117" }}>
    <Sequence from={SCENES.opener.from} durationInFrames={SCENES.opener.duration}>
      <Scene1Opener />
    </Sequence>
    <Sequence from={SCENES.problem.from} durationInFrames={SCENES.problem.duration}>
      <Scene2Problem />
    </Sequence>
    <Sequence from={SCENES.overview.from} durationInFrames={SCENES.overview.duration}>
      <Scene3Overview />
    </Sequence>
    <Sequence from={SCENES.travellerExplore.from} durationInFrames={SCENES.travellerExplore.duration}>
      <Scene4TravellerExplore />
    </Sequence>
    <Sequence from={SCENES.booking.from} durationInFrames={SCENES.booking.duration}>
      <Scene5Booking />
    </Sequence>
    <Sequence from={SCENES.operator.from} durationInFrames={SCENES.operator.duration}>
      <Scene6Operator />
    </Sequence>
    <Sequence from={SCENES.govOverview.from} durationInFrames={SCENES.govOverview.duration}>
      <Scene7GovOverview />
    </Sequence>
    <Sequence from={SCENES.analytics.from} durationInFrames={SCENES.analytics.duration}>
      <Scene8Analytics />
    </Sequence>
    <Sequence from={SCENES.compliance.from} durationInFrames={SCENES.compliance.duration}>
      <Scene9Compliance />
    </Sequence>
    <Sequence from={SCENES.closing.from} durationInFrames={SCENES.closing.duration}>
      <Scene10Closing />
    </Sequence>
    <AudioTrack />
  </AbsoluteFill>
);

export const KashmirTourismConfig = {
  id: "KashmirTourism",
  component: KashmirTourism,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
};
