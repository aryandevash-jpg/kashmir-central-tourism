import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { ScreenCompliance, ScreenIncidents } from "../screens/DashboardScreens";

export const Scene9Compliance: React.FC = () => {
  const frame = useCurrentFrame();
  const rowsVisible = Math.min(3, Math.floor(interpolate(frame, [30, 70], [0, 3], { extrapolateRight: "clamp" })));
  const itemsVisible = Math.min(2, Math.floor(interpolate(frame, [40, 80], [0, 2], { extrapolateRight: "clamp" })));
  const trackerProgress = interpolate(frame, [100, 180], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneEnter background="#0D1117">
      <AbsoluteFill style={{ display: "flex", gap: 24, padding: 60, alignItems: "stretch" }}>
        <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", transform: `translateX(${interpolate(frame, [0, 20], [-60, 0], { extrapolateRight: "clamp" })}px)` }}>
          <ScreenCompliance rowsVisible={rowsVisible} />
        </div>
        <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", transform: `translateX(${interpolate(frame, [10, 30], [60, 0], { extrapolateRight: "clamp" })}px)` }}>
          <ScreenIncidents itemsVisible={itemsVisible} trackerProgress={trackerProgress} />
        </div>
      </AbsoluteFill>
      <Subtitle text="Compliance tracking and live incident management — keeping every traveller safe." startFrame={20} />
    </SceneEnter>
  );
};
