export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 3000;

export const COLORS = {
  bgDark: "#0D1117",
  bgLight: "#F0F4F8",
  saffron: "#F59E0B",
  kashmirBlue: "#2563EB",
  white: "#FFFFFF",
  textMuted: "#94A3B8",
  danger: "#EF4444",
  success: "#22C55E",
  teal: "#14B8A6",
};

export const SCENES = {
  opener: { from: 0, duration: 125 },
  problem: { from: 125, duration: 175 },
  overview: { from: 300, duration: 150 },
  travellerExplore: { from: 450, duration: 425 },
  booking: { from: 875, duration: 375 },
  operator: { from: 1250, duration: 500 },
  govOverview: { from: 1750, duration: 375 },
  analytics: { from: 2125, duration: 250 },
  compliance: { from: 2375, duration: 325 },
  closing: { from: 2700, duration: 300 },
} as const;
