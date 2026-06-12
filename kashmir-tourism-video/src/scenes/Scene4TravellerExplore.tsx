import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Callout } from "../components/Callout";
import { PhoneMockup } from "../components/PhoneMockup";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { ScreenActivityDetail, ScreenExplore } from "../screens/TravellerScreens";

export const Scene4TravellerExplore: React.FC = () => {
  const frame = useCurrentFrame();
  const trekkingActive = frame > 40;
  const glowTrek = interpolate(frame, [50, 70, 90], [0, 1, 0.5], { extrapolateRight: "clamp" });
  const showDetail = frame > 160;
  const detailOpacity = interpolate(frame, [160, 180], [0, 1], { extrapolateRight: "clamp" });
  const rating = interpolate(frame, [200, 240], [0, 4.8], { extrapolateRight: "clamp" });
  const includesVisible = Math.min(4, Math.floor(interpolate(frame, [220, 260], [0, 4], { extrapolateRight: "clamp" })));
  const bookPulse = interpolate(frame, [300, 330, 360], [0, 1, 0.3], { extrapolateRight: "clamp" });

  return (
    <SceneEnter background="#0D1117">
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PhoneMockup entryFrame={10}>
          {!showDetail ? (
            <ScreenExplore trekkingActive={trekkingActive} glowTrek={glowTrek} />
          ) : (
            <div style={{ opacity: detailOpacity }}>
              <ScreenActivityDetail rating={rating} includesVisible={includesVisible} bookPulse={bookPulse} />
            </div>
          )}
        </PhoneMockup>
      </AbsoluteFill>
      <Callout text="100+ curated Kashmir experiences" startFrame={60} />
      <Subtitle text="Travellers browse verified experiences — trekking, Shikara rides, gondola rides — all in one app." startFrame={20} />
    </SceneEnter>
  );
};
