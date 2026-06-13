"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IconLocation, IconStar } from "@/components/icons";
import type { Activity, ActivityCategory } from "@/lib/types";
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

export function ExploreFeed({ activities }: { activities: Activity[] }) {
  const [category, setCategory] = useState<ActivityCategory | "ALL">("ALL");

  const filtered =
    category === "ALL"
      ? activities
      : activities.filter((a) => a.category === category);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex items-start justify-between sm:mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">
            {greeting()}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <IconLocation className="h-5 w-5 shrink-0 text-blue-500" />
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Kashmir, India</h1>
            <span className="text-slate-400">▾</span>
          </div>
        </div>
      </div>

      <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-2 sm:mb-8 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "flex-shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              category === cat
                ? "border-blue-500 bg-white text-blue-600 shadow-sm"
                : "border-transparent bg-white/60 text-slate-500 hover:bg-white"
            )}
          >
            {cat === "ALL" ? "All" : categoryLabel(cat)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No activities found for this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="group relative overflow-hidden rounded-3xl shadow-md transition-transform hover:scale-[1.02]"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={activity.coverImageUrl}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 backdrop-blur-sm">
                  <IconLocation className="w-3 h-3 text-blue-500" />
                  {activity.district}
                  {activity.elevation && ` · ${activity.elevation}`}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-sm text-white/90">
                    <IconStar className="w-4 h-4 text-blue-400" filled />
                    <span className="font-semibold">{activity.rating || "—"}</span>
                    <span className="text-white/70">({activity.reviewCount} reviews)</span>
                  </div>
                  <h2 className="text-xl font-bold text-white sm:text-2xl">{activity.title}</h2>
                  <div className="mt-3 flex justify-end">
                    <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600">
                      {formatCurrency(activity.basePrice)} / person
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
