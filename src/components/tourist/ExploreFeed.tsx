"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconBell, IconLocation, IconSearch, IconStar } from "@/components/icons";
import type { Activity, ActivityCategory, EventBanner } from "@/lib/types";
import { categoryLabel, cn, formatCurrency } from "@/lib/utils";

const categories: (ActivityCategory | "ALL")[] = [
  "ALL",
  "GONDOLA",
  "TREKKING",
  "WATER_TOUR",
  "SKIING",
  "RAFTING",
  "SIGHTSEEING",
];

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${hours}h ${mins}m`;
}

export function ExploreFeed({
  activities,
  importantEvents,
}: {
  activities: Activity[];
  importantEvents: EventBanner[];
}) {
  useEffect(() => {
    document.documentElement.classList.add("explore-scroll-lock");
    document.body.classList.add("explore-scroll-lock");
    return () => {
      document.documentElement.classList.remove("explore-scroll-lock");
      document.body.classList.remove("explore-scroll-lock");
    };
  }, []);

  const [category, setCategory] = useState<ActivityCategory | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const featuredEvent = importantEvents[0];
  const featuredActivity = useMemo(
    () =>
      activities.reduce<Activity | null>(
        (best, current) => {
          if (!best) return current;
          if (current.rating > best.rating) return current;
          if (current.rating === best.rating && current.reviewCount > best.reviewCount) return current;
          return best;
        },
        null,
      ) ?? undefined,
    [activities],
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const categoryFiltered =
      category === "ALL" ? activities : activities.filter((activity) => activity.category === category);

    return categoryFiltered.filter((activity) => {
      if (!normalizedSearch) return true;
      const haystack = [
        activity.title,
        activity.district,
        activity.locationName,
        activity.category,
        activity.description,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [activities, category, search]);

  const visibleActivities = useMemo(
    () => filtered.filter((activity) => activity.id !== featuredActivity?.id),
    [filtered, featuredActivity?.id],
  );

  return (
    <div className="h-full w-full overflow-hidden px-3 pt-2 pb-20 sm:px-6 sm:pt-4 sm:pb-24">
      <div className="grid h-full items-start gap-4 md:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-[minmax(0,1fr)_320px] md:gap-6">
        <section className="hide-scrollbar min-w-0 overflow-y-auto pr-0.5 md:h-full md:pr-2">
          {/* Mobile: Featured Event Banner */}
          <Link
            href="/events"
            className="mb-4 block rounded-2xl border border-slate-100 bg-white p-3 shadow-sm md:hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <IconBell className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 line-clamp-1">{featuredEvent?.title ?? "Official advisory"}</p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">
                    {featuredEvent?.message ?? "Weather update and event announcements available."}
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                Live
              </span>
            </div>
          </Link>

          {/* Mobile: Featured Activity - Compact Card */}
          {featuredActivity && (
            <div className="mb-4 md:hidden">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Featured activity
              </p>
              <Link
                href={`/activities/${featuredActivity.id}`}
                className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={featuredActivity.coverImageUrl}
                    alt={featuredActivity.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1">{featuredActivity.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                    <IconLocation className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">{featuredActivity.district}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-blue-600">
                    {formatCurrency(featuredActivity.basePrice)}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Sticky Search + Tags */}
          <div className="sticky top-0 z-30 -mx-3 mb-3 bg-[#f0f7ff]/95 px-3 pb-2 pt-2 backdrop-blur md:mx-0 md:mb-5 md:px-0">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activities"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none sm:rounded-xl sm:py-2.5 sm:pl-9 sm:text-sm"
              />
            </div>

            <div className="hide-scrollbar -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-0.5 sm:mt-3 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium transition-colors sm:px-4 sm:py-1.5 sm:text-xs",
                    category === cat
                      ? "border-blue-500 bg-white text-blue-600 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                  )}
                >
                  {cat === "ALL" ? "All" : categoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Cards */}
          {visibleActivities.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No activities found.</p>
          ) : (
            <>
              {/* Mobile: Compact List Cards */}
              <div className="space-y-2.5 md:hidden">
                {visibleActivities.map((activity) => (
                  <Link
                    key={activity.id}
                    href={`/activities/${activity.id}`}
                    className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={activity.coverImageUrl}
                        alt={activity.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-tight">{activity.title}</h3>
                        <span className="shrink-0 text-xs font-semibold text-blue-600">
                          {formatCurrency(activity.basePrice)}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-500">
                        <IconLocation className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{activity.district}{activity.elevation && ` · ${activity.elevation}`}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-0.5">
                          <IconStar className="h-3 w-3 text-amber-400" filled />
                          {activity.rating || "—"}
                        </span>
                        <span>·</span>
                        <span>{formatDuration(activity.durationMinutes)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop: Grid Cards like Anjali reference */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
                {visibleActivities.map((activity) => (
                  <Link
                    key={activity.id}
                    href={`/activities/${activity.id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={activity.coverImageUrl}
                        alt={activity.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600">
                          {activity.title}
                        </h3>
                        <span className="shrink-0 text-sm font-semibold text-slate-900">
                          {formatCurrency(activity.basePrice)}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">
                        {formatDuration(activity.durationMinutes)} · {activity.district}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{activity.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                          {categoryLabel(activity.category)}
                        </span>
                        {activity.difficulty && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                            {activity.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <IconStar className="h-3.5 w-3.5 text-amber-400" filled />
                          {activity.rating || "—"} ({activity.reviewCount})
                        </span>
                        <span className="text-sm font-medium text-blue-600 group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Mobile: Bottom Events Link */}
          <Link
            href="/events"
            className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-700 shadow-sm md:hidden"
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Today&apos;s events</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-900">
                {importantEvents.length} official updates
              </p>
            </div>
            <span aria-hidden className="text-lg text-slate-400">›</span>
          </Link>
        </section>

        {/* Desktop: Right Sidebar */}
        <aside className="hidden space-y-4 overflow-hidden md:block md:h-full">
          <Link href="/events" className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">Featured event</p>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">Live</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">{featuredEvent?.title ?? "Official advisory"}</h2>
            <p className="mt-1.5 text-xs text-slate-600 line-clamp-3">
              {featuredEvent?.message ?? "Weather update, route changes, and event announcements are available for today."}
            </p>
          </Link>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">More events</p>
            <div className="mt-3 space-y-2">
              {importantEvents.slice(1, 4).map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="block rounded-lg border border-slate-100 px-3 py-2 transition-colors hover:bg-slate-50"
                >
                  <p className="text-xs font-semibold text-slate-900 line-clamp-1">{event.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">{event.message}</p>
                </Link>
              ))}
              {importantEvents.length <= 1 && (
                <p className="text-xs text-slate-500">No additional events.</p>
              )}
            </div>
          </div>

          {featuredActivity && (
            <Link
              href={`/activities/${featuredActivity.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Featured ride</p>
              <h3 className="mt-2 text-sm font-semibold text-slate-900">{featuredActivity.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{featuredActivity.district}</p>
              <p className="mt-2 text-sm font-semibold text-blue-600">
                {formatCurrency(featuredActivity.basePrice)} / person
              </p>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
