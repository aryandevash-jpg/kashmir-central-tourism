import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type PhoneMockupProps = {
  children: React.ReactNode;
  entryFrame?: number;
  exitFrame?: number;
  slideFrom?: "bottom" | "left";
};

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  entryFrame = 0,
  exitFrame,
  slideFrom = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - entryFrame, fps, config: { damping: 18, stiffness: 80 } });
  const exit =
    exitFrame !== undefined
      ? 1 -
        spring({
          frame: frame - exitFrame,
          fps,
          config: { damping: 20, stiffness: 100 },
        })
      : 1;

  const translateY = slideFrom === "bottom" ? interpolate(enter, [0, 1], [400, 0]) : 0;
  const translateX = slideFrom === "left" ? interpolate(enter, [0, 1], [-600, 0]) * exit : 0;
  const slideOutX = exitFrame !== undefined ? interpolate(1 - exit, [0, 1], [-800, 0]) : 0;
  const parallax = interpolate(enter, [0, 1], [8, 0]);

  return (
    <div
      style={{
        width: 375,
        height: 812,
        borderRadius: 40,
        background: "#fff",
        boxShadow: "0 40px 80px rgba(0,0,0,0.45), 0 0 0 8px #1a1a1a",
        overflow: "hidden",
        transform: `translateY(${translateY}px) translateX(${translateX + slideOutX}px) rotateX(${parallax}deg) scale(${interpolate(enter * exit, [0, 1], [0.95, 1])})`,
        opacity: enter * exit,
      }}
    >
      <div style={{ width: 120, height: 28, background: "#1a1a1a", borderRadius: 20, margin: "8px auto" }} />
      {children}
    </div>
  );
};
