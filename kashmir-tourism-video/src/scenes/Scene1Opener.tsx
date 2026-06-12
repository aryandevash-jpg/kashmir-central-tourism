import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SnowParticles, SaffronUnderline } from "../components/SnowParticles";
import { Subtitle } from "../components/Subtitle";
import { COLORS } from "../constants";

const HEADLINE = "KASHMIR CENTRAL TOURISM SYSTEM";
const TAGLINE = "One platform. Every journey. Across the Valley.";

export const Scene1Opener: React.FC = () => {
  const frame = useCurrentFrame();
  const headlineChars = Math.min(HEADLINE.length, Math.floor(interpolate(frame, [20, 90], [0, HEADLINE.length], { extrapolateRight: "clamp" })));
  const taglineOpacity = interpolate(frame, [70, 95], [0, 1], { extrapolateRight: "clamp" });
  const underlineProgress = interpolate(frame, [90, 115], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SnowParticles />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: COLORS.white, fontSize: 56, fontWeight: 800, letterSpacing: 4, fontFamily: "system-ui, sans-serif", margin: 0, textAlign: "center" }}>
          {HEADLINE.slice(0, headlineChars)}
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 24, marginTop: 16, opacity: taglineOpacity, fontFamily: "system-ui, sans-serif" }}>
          {TAGLINE}
        </p>
        <SaffronUnderline progress={underlineProgress} width={640} />
      </AbsoluteFill>
      <Subtitle text="Discover how Kashmir's tourism is being transformed — digitally." startFrame={30} />
    </AbsoluteFill>
  );
};
