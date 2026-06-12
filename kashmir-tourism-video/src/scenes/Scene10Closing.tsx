import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SnowParticles, SaffronUnderline } from "../components/SnowParticles";
import { Subtitle } from "../components/Subtitle";
import { COLORS } from "../constants";

export const Scene10Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const iconsOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" });
  const lineProgress = interpolate(frame, [60, 100], [0, 1], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [80, 110], [0, 1], { extrapolateRight: "clamp" });
  const domainChars = Math.min(22, Math.floor(interpolate(frame, [180, 240], [0, 22], { extrapolateRight: "clamp" })));
  const fadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000", opacity: fadeOut }}>
      <SnowParticles />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: iconsOpacity }}>
        <div style={{ display: "flex", gap: 120, marginBottom: 40, position: "relative" }}>
          <svg style={{ position: "absolute", top: 30, left: 60, width: 280, height: 120 }} viewBox="0 0 280 120">
            <path d={`M40,80 L140,20 L240,80`} fill="none" stroke={COLORS.saffron} strokeWidth="2" strokeDasharray="400" strokeDashoffset={400 * (1 - lineProgress)} />
            <path d={`M40,80 L140,80 L240,80`} fill="none" stroke={COLORS.kashmirBlue} strokeWidth="2" strokeDasharray="300" strokeDashoffset={300 * (1 - lineProgress)} />
          </svg>
          {["📱", "🏪", "🏛"].map((icon) => (
            <div key={icon} style={{ fontSize: 72 }}>{icon}</div>
          ))}
        </div>
        <h1 style={{ color: COLORS.white, fontSize: 52, fontWeight: 800, opacity: titleOpacity, fontFamily: "system-ui, sans-serif", letterSpacing: 2 }}>
          Kashmir Central Tourism System
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 22, marginTop: 12, opacity: titleOpacity, fontFamily: "system-ui, sans-serif" }}>
          One platform. Travellers. Operators. Government.
        </p>
        <p style={{ color: COLORS.saffron, fontSize: 20, marginTop: 8, opacity: titleOpacity, fontFamily: "system-ui, sans-serif" }}>
          Built for the Valley. Ready for scale.
        </p>
        <SaffronUnderline progress={lineProgress} width={400} />
        <p style={{ color: COLORS.white, fontSize: 28, marginTop: 32, fontFamily: "monospace", letterSpacing: 2 }}>
          {"kashmir-tourism.gov.in".slice(0, domainChars)}
        </p>
      </AbsoluteFill>
      <Subtitle text="Built for the Valley. Ready for scale." startFrame={90} />
    </AbsoluteFill>
  );
};
