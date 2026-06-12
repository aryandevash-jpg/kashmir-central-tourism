import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const SceneEnter: React.FC<{
  children: React.ReactNode;
  background?: string;
}> = ({ children, background = "#0D1117" }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 8], [0.97, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background,
        position: "relative",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};
