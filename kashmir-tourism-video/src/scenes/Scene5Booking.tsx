import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Callout } from "../components/Callout";
import { PhoneMockup } from "../components/PhoneMockup";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { ScreenBooking, ScreenConfirmation } from "../screens/TravellerScreens";

export const Scene5Booking: React.FC = () => {
  const frame = useCurrentFrame();
  const dateSelected = frame > 20;
  const timeSelected = frame > 60;
  const groupSize = Math.min(2, Math.round(interpolate(frame, [100, 130], [1, 2], { extrapolateRight: "clamp" })));
  const total = interpolate(frame, [140, 180], [0, 3358], { extrapolateRight: "clamp" });
  const confirmPulse = interpolate(frame, [200, 230, 260], [0, 1, 0.2], { extrapolateRight: "clamp" });
  const showConfirm = frame > 280;
  const confirmFade = interpolate(frame, [280, 300], [0, 1], { extrapolateRight: "clamp" });
  const qrOpacity = interpolate(frame, [310, 330], [0, 1], { extrapolateRight: "clamp" });
  const scanLine = interpolate(frame, [320, 360], [0, 1], { extrapolateRight: "clamp" });

  return (
    <SceneEnter background="#0D1117">
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PhoneMockup entryFrame={0}>
          {!showConfirm ? (
            <ScreenBooking
              dateSelected={dateSelected}
              timeSelected={timeSelected}
              groupSize={groupSize}
              total={total}
              confirmPulse={confirmPulse}
            />
          ) : (
            <div style={{ opacity: confirmFade }}>
              <ScreenConfirmation qrOpacity={qrOpacity} scanLine={scanLine} />
            </div>
          )}
        </PhoneMockup>
      </AbsoluteFill>
      <Callout text="Instant QR ticket. No paperwork." startFrame={100} side="left" />
      <Subtitle text="Select a date, pick a time slot, confirm — and get your digital ticket instantly." startFrame={15} />
    </SceneEnter>
  );
};
