import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Callout } from "../components/Callout";
import { DesktopMockup } from "../components/DesktopMockup";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { useCounterRoll } from "../hooks/useCounterRoll";
import { ScreenOperatorDashboard } from "../screens/DashboardScreens";

export const Scene6Operator: React.FC = () => {
  const frame = useCurrentFrame();
  const revenue = useCounterRoll(842500, 30, 50);
  const bookings = useCounterRoll(1284, 40, 45);
  const travellers = useCounterRoll(312, 50, 40);
  const rating = useCounterRoll(4.82, 60, 35, 2);
  const chartProgress = interpolate(frame, [80, 160], [0, 1], { extrapolateRight: "clamp" });
  const rowsVisible = Math.min(3, Math.floor(interpolate(frame, [120, 150], [0, 3], { extrapolateRight: "clamp" })));
  const barFill = interpolate(frame, [180, 220], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneEnter background="#0D1117">
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DesktopMockup entryFrame={15}>
          <ScreenOperatorDashboard
            revenue={revenue}
            bookings={bookings}
            travellers={travellers}
            rating={rating}
            chartProgress={chartProgress}
            rowsVisible={rowsVisible}
            barFill={barFill}
          />
        </DesktopMockup>
      </AbsoluteFill>
      <Callout text="Live revenue. Smart insights. Zero spreadsheets." startFrame={50} />
      <Subtitle text="Operators get a real-time dashboard — bookings, revenue, and AI-powered slot suggestions." startFrame={20} />
    </SceneEnter>
  );
};
