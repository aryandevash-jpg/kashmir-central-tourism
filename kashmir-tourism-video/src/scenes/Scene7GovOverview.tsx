import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Callout } from "../components/Callout";
import { DesktopMockup } from "../components/DesktopMockup";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { ScreenGovOverview } from "../screens/DashboardScreens";

export const Scene7GovOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const kpisVisible = Math.min(4, Math.floor(interpolate(frame, [30, 80], [0, 4], { extrapolateRight: "clamp" })));
  const mapProgress = interpolate(frame, [90, 200], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneEnter background="#0D1117">
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${interpolate(frame, [0, 20], [100, 0], { extrapolateRight: "clamp" })}px)`,
        }}
      >
        <DesktopMockup entryFrame={10}>
          <ScreenGovOverview kpisVisible={kpisVisible} mapProgress={mapProgress} />
        </DesktopMockup>
      </AbsoluteFill>
      <Callout text="State-wide tourism intelligence. Live." startFrame={60} side="left" />
      <Subtitle text="The J&K government sees every district — bookings, revenue, and safety — all in real time." startFrame={20} />
    </SceneEnter>
  );
};
