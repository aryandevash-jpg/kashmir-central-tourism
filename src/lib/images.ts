/** Local activity images — served from /public, no external dependency */
export const ACTIVITY_IMAGES = {
  gondola: "/activities/gondola.jpg",
  trekking: "/activities/trek.jpg",
  waterTour: "/activities/shikara.jpg",
  fallback: "/activities/fallback.jpg",
} as const;

export function activityImageForCategory(
  category: string,
  existing?: string | null
): string {
  // Prefer bundled local images — external URLs (e.g. Unsplash) can 404
  if (existing?.startsWith("/activities/")) return existing;

  const map: Record<string, string> = {
    GONDOLA: ACTIVITY_IMAGES.gondola,
    TREKKING: ACTIVITY_IMAGES.trekking,
    MOUNTAINEERING: ACTIVITY_IMAGES.trekking,
    WATER_TOUR: ACTIVITY_IMAGES.waterTour,
    SKIING: ACTIVITY_IMAGES.gondola,
    CAMPING: ACTIVITY_IMAGES.trekking,
    RAFTING: ACTIVITY_IMAGES.waterTour,
    SIGHTSEEING: ACTIVITY_IMAGES.waterTour,
    PARAGLIDING: ACTIVITY_IMAGES.fallback,
  };

  return map[category] ?? ACTIVITY_IMAGES.fallback;
}
