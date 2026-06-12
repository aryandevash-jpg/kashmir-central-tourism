import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";

const cards = [
  "Fragmented bookings — WhatsApp, phone calls, walk-ins",
  "No operator compliance tracking — licenses expire unnoticed",
  "Government has zero real-time visibility",
];

export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampScale = spring({ frame: frame - 120, fps, config: { damping: 8, stiffness: 120 } });

  return (
    <SceneEnter background="linear-gradient(180deg, #0D1117 0%, #1E3A5F 50%, #3B82F6 100%)">
      <AbsoluteFill style={{ padding: 80, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
        {cards.map((text, i) => {
          const p = spring({ frame: frame - i * 8, fps, config: { damping: 14 } });
          const x = interpolate(p, [0, 1], [-400, 0]);
          return (
            <div
              key={text}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "24px 32px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transform: `translateX(${x}px)`,
                opacity: p,
                maxWidth: 900,
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}
            >
              <span style={{ fontSize: 28 }}>❌</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", fontFamily: "system-ui, sans-serif" }}>{text}</span>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 280,
            color: "#EF4444",
            opacity: stampScale * 0.35,
            transform: `scale(${stampScale})`,
            pointerEvents: "none",
          }}
        >
          ✕
        </div>
      </AbsoluteFill>
      <Subtitle text="Tourism in Kashmir was disconnected. Until now." startFrame={20} />
    </SceneEnter>
  );
};
