import { interpolate, useCurrentFrame } from "remotion";

export function useCounterRoll(
  target: number,
  startFrame: number,
  duration = 30,
  decimals = 0
): string {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [startFrame, startFrame + duration], [0, target], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN");
}
