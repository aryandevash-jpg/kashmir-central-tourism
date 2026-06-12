import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type DesktopMockupProps = {
  children: React.ReactNode;
  entryFrame?: number;
};

export const DesktopMockup: React.FC<DesktopMockupProps> = ({ children, entryFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - entryFrame, fps, config: { damping: 16, stiffness: 70 } });
  const translateX = interpolate(progress, [0, 1], [200, 0]);
  const scale = interpolate(progress, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        width: 1280,
        height: 800,
        borderRadius: 16,
        background: "#fff",
        border: "1px solid #E2E8F0",
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        overflow: "hidden",
        transform: `translateX(${translateX}px) scale(${scale})`,
        opacity: progress,
      }}
    >
      <div style={{ height: 36, background: "#F1F5F9", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22C55E" }} />
      </div>
      {children}
    </div>
  );
};
