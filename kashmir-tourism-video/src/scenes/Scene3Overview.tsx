import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneEnter } from "../components/SceneEnter";
import { Subtitle } from "../components/Subtitle";
import { COLORS } from "../constants";

const pillars = [
  { icon: "📱", title: "Traveller App", color: COLORS.kashmirBlue },
  { icon: "🏪", title: "Operator Dashboard", color: "#14B8A6" },
  { icon: "🏛", title: "Government Portal", color: COLORS.saffron },
];

export const Scene3Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineProgress = interpolate(frame, [80, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <SceneEnter background={COLORS.bgLight}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ fontSize: 42, fontWeight: 800, color: "#0F172A", fontFamily: "system-ui, sans-serif", marginBottom: 60 }}>
          One Ecosystem. Three Portals.
        </h2>
        <div style={{ display: "flex", gap: 80, alignItems: "flex-end", position: "relative" }}>
          <svg style={{ position: "absolute", top: 60, left: 120, width: 560, height: 4 }} viewBox="0 0 560 4">
            <line x1="0" y1="2" x2={560 * lineProgress} y2="2" stroke={COLORS.kashmirBlue} strokeWidth="3" />
          </svg>
          {pillars.map((p, i) => {
            const rise = spring({ frame: frame - i * 10, fps, config: { damping: 12, stiffness: 60 } });
            const y = interpolate(rise, [0, 1], [200, 0]);
            return (
              <div key={p.title} style={{ textAlign: "center", transform: `translateY(${y}px)`, opacity: rise }}>
                <div style={{ fontSize: 64 }}>{p.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: p.color, marginTop: 12, fontFamily: "system-ui, sans-serif" }}>{p.title}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Subtitle text="A unified platform connecting travellers, operators, and the J&K government." startFrame={15} />
    </SceneEnter>
  );
};
