import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants";

export const Callout: React.FC<{ text: string; startFrame?: number; side?: "left" | "right" }> = ({
  text,
  startFrame = 20,
  side = "right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - startFrame, fps, config: { damping: 14 } });
  const x = interpolate(p, [0, 1], [side === "right" ? 40 : -40, 0]);

  return (
    <div
      style={{
        position: "absolute",
        [side]: 80,
        top: "42%",
        transform: `translateX(${x}px)`,
        opacity: p,
        background: "rgba(37,99,235,0.15)",
        border: `2px solid ${COLORS.kashmirBlue}`,
        borderRadius: 16,
        padding: "20px 28px",
        maxWidth: 320,
        color: COLORS.white,
        fontSize: 26,
        fontWeight: 700,
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.3,
      }}
    >
      {text}
    </div>
  );
};
