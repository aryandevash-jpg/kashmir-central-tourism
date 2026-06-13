/**
 * Activity cover images — served from /public/activities/
 * Run `npm run images:fetch` to download assets (also mapped for DB seed paths).
 */
export const ACTIVITY_COVER_PATHS = {
  gondola: "/activities/gondola.jpg",
  gondola2: "/activities/gondola2.jpg",
  trek: "/activities/trek.jpg",
  shikara: "/activities/shikara.jpg",
  shikaraSunset: "/activities/shikara-sunset.jpg",
  floatingMarket: "/activities/floating-market.jpg",
  greatLakes: "/activities/great-lakes.jpg",
  thajiwas: "/activities/thajiwas.jpg",
  pahalgam: "/activities/pahalgam.jpg",
  skiing: "/activities/skiing.jpg",
  skiingAdv: "/activities/skiing-adv.jpg",
  rafting: "/activities/rafting.jpg",
  aru: "/activities/aru.jpg",
  tarsar: "/activities/tarsar.jpg",
  default: "/activities/default.jpg",
  fallback: "/activities/fallback.jpg",
} as const;

/** Maps seed.sql cover_image_url values to bundled assets */
export const ACTIVITY_COVER_IMAGES: Record<string, string> = {
  [ACTIVITY_COVER_PATHS.gondola]: ACTIVITY_COVER_PATHS.gondola,
  [ACTIVITY_COVER_PATHS.gondola2]: ACTIVITY_COVER_PATHS.gondola2,
  [ACTIVITY_COVER_PATHS.trek]: ACTIVITY_COVER_PATHS.trek,
  [ACTIVITY_COVER_PATHS.shikara]: ACTIVITY_COVER_PATHS.shikara,
  [ACTIVITY_COVER_PATHS.shikaraSunset]: ACTIVITY_COVER_PATHS.shikaraSunset,
  [ACTIVITY_COVER_PATHS.floatingMarket]: ACTIVITY_COVER_PATHS.floatingMarket,
  [ACTIVITY_COVER_PATHS.greatLakes]: ACTIVITY_COVER_PATHS.greatLakes,
  [ACTIVITY_COVER_PATHS.thajiwas]: ACTIVITY_COVER_PATHS.thajiwas,
  [ACTIVITY_COVER_PATHS.pahalgam]: ACTIVITY_COVER_PATHS.pahalgam,
  [ACTIVITY_COVER_PATHS.skiing]: ACTIVITY_COVER_PATHS.skiing,
  [ACTIVITY_COVER_PATHS.skiingAdv]: ACTIVITY_COVER_PATHS.skiingAdv,
  [ACTIVITY_COVER_PATHS.rafting]: ACTIVITY_COVER_PATHS.rafting,
  [ACTIVITY_COVER_PATHS.aru]: ACTIVITY_COVER_PATHS.aru,
  [ACTIVITY_COVER_PATHS.tarsar]: ACTIVITY_COVER_PATHS.tarsar,
  [ACTIVITY_COVER_PATHS.default]: ACTIVITY_COVER_PATHS.default,
  [ACTIVITY_COVER_PATHS.fallback]: ACTIVITY_COVER_PATHS.fallback,
};

export const ACTIVITY_IMAGES = {
  gondola: ACTIVITY_COVER_PATHS.gondola,
  trekking: ACTIVITY_COVER_PATHS.trek,
  waterTour: ACTIVITY_COVER_PATHS.shikara,
  fallback: ACTIVITY_COVER_PATHS.fallback,
} as const;

const CATEGORY_FALLBACK: Record<string, string> = {
  GONDOLA: ACTIVITY_IMAGES.gondola,
  TREKKING: ACTIVITY_IMAGES.trekking,
  MOUNTAINEERING: ACTIVITY_IMAGES.trekking,
  WATER_TOUR: ACTIVITY_IMAGES.waterTour,
  SKIING: ACTIVITY_COVER_PATHS.skiing,
  CAMPING: ACTIVITY_IMAGES.trekking,
  RAFTING: ACTIVITY_COVER_PATHS.rafting,
  SIGHTSEEING: ACTIVITY_COVER_PATHS.pahalgam,
  PARAGLIDING: ACTIVITY_COVER_PATHS.gondola2,
};

export function activityImageForCategory(
  category: string,
  existing?: string | null
): string {
  if (existing) {
    if (ACTIVITY_COVER_IMAGES[existing]) return ACTIVITY_COVER_IMAGES[existing];
    if (existing.startsWith("https://")) return existing;
    if (existing.startsWith("/activities/")) {
      return CATEGORY_FALLBACK[category] ?? ACTIVITY_IMAGES.fallback;
    }
  }

  return CATEGORY_FALLBACK[category] ?? ACTIVITY_IMAGES.fallback;
}
