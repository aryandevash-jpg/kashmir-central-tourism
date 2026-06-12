import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";

const COUNT = 80;

export const SnowParticles: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (i * 137.5) % 100,
        size: 2 + (i % 4),
        speed: 0.3 + (i % 5) * 0.1,
        delay: i * 2,
      })),
    []
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity }}>
      {particles.map((p, i) => {
        const y = ((frame * p.speed + p.delay) % 120) - 10;
        const drift = Math.sin((frame + i * 10) / 40) * 20;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.8)",
              transform: `translateX(${drift}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

export const SaffronUnderline: React.FC<{ progress: number; width?: number }> = ({
  progress,
  width = 520,
}) => (
  <div
    style={{
      height: 4,
      width: width * progress,
      background: "#F59E0B",
      borderRadius: 2,
      marginTop: 16,
    }}
  />
);
