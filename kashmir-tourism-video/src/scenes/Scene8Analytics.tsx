import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { DesktopMockup } from "../components/DesktopMockup";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { COLORS } from "../constants";
import { ScreenAnalytics } from "../screens/DashboardScreens";

export const Scene8Analytics: React.FC = () => {
  const frame = useCurrentFrame();
  const chartProgress = interpolate(frame, [20, 120], [0, 1], { extrapolateRight: "clamp" });
  const rowsVisible = Math.min(3, Math.floor(interpolate(frame, [100, 160], [0, 3], { extrapolateRight: "clamp" })));

  return (
    <SceneEnter background={COLORS.bgLight}>
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DesktopMockup entryFrame={5}>
          <ScreenAnalytics chartProgress={chartProgress} rowsVisible={rowsVisible} />
        </DesktopMockup>
      </AbsoluteFill>
      <Subtitle text="Track which experiences drive revenue and identify growth opportunities across all districts." startFrame={15} />
    </SceneEnter>
  );
};
