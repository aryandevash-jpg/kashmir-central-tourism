import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type SubtitleProps = {
  text: string;
  startFrame?: number;
};

export const Subtitle: React.FC<SubtitleProps> = ({ text, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const local = Math.max(0, frame - startFrame);
  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        bottom: 56,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          borderRadius: 999,
          padding: "12px 28px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          maxWidth: 1200,
        }}
      >
        {words.map((word, i) => {
          const wordStart = i * 3;
          const opacity = interpolate(local, [wordStart, wordStart + 6], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <span
              key={`${word}-${i}`}
              style={{
                color: "#fff",
                fontSize: 22,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 400,
                opacity,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
