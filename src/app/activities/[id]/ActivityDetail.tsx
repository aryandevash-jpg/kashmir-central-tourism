"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconBookmark,
  IconChevronRight,
  IconClock,
  IconLocation,
  IconMountain,
  IconStar,
  IconVerified,
  IconAlert,
} from "@/components/icons";
import { useToast } from "@/components/Toast";
import type { Activity, Operator } from "@/lib/types";
import { difficultyLabel, formatCurrency, formatDuration } from "@/lib/utils";

const includeIcons: Record<string, string> = {
  Guide: "👤",
  Gear: "🎒",
  Lunch: "🍽️",
  Transport: "🚌",
};

interface ActivityDetailProps {
  activity: Activity;
  operator: Operator | null;
}

export function ActivityDetail({ activity, operator }: ActivityDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleBookmark = () => {
    setIsSaved(!isSaved);
    showToast(
      isSaved ? "Removed from saved activities" : "Added to saved activities",
      isSaved ? "info" : "success"
    );
  };

  const handleOperatorClick = () => {
    if (operator) {
      showToast(`${operator.companyName} - ${operator.experienceYears} years experience`, "info");
    }
  };

  const handleLocationClick = () => {
    showToast(`Meeting point: ${activity.locationName}`, "info");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-3xl">
            <Image
              src={activity.coverImageUrl}
              alt={activity.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <button
              type="button"
              onClick={handleBookmark}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
            >
              <IconBookmark 
                className={`w-5 h-5 ${isSaved ? "text-blue-500 fill-blue-500" : "text-slate-700"}`} 
              />
            </button>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
              <IconLocation className="w-4 h-4 text-blue-500" />
              {activity.district}, Kashmir
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{activity.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm">
              <IconStar className="w-4 h-4 text-blue-500" filled />
              <span className="font-semibold">{activity.rating || "—"}</span>
              <span className="text-slate-500">{activity.reviewCount} reviews</span>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
              <IconClock className="w-4 h-4 text-blue-500" />
              {formatDuration(activity.durationMinutes)}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
              <IconMountain className="w-4 h-4 text-blue-500" />
              {difficultyLabel(activity.difficulty)}
            </span>
          </div>

          <p className="mt-6 leading-relaxed text-slate-600">{activity.description}</p>

          {activity.includes.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-bold text-slate-900">Includes</h3>
              <div className="flex flex-wrap gap-4">
                {activity.includes.map((item) => (
                  <div
                    key={item}
                    className="flex w-24 flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <span className="text-2xl">{includeIcons[item] ?? "✓"}</span>
                    <span className="text-xs font-medium text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-4 lg:top-24">
            {operator && (
              <button
                type="button"
                onClick={handleOperatorClick}
                className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {operator.companyName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900">{operator.companyName}</p>
                    {operator.isVerified && <IconVerified className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-slate-500">
                    Verified Operator · {operator.experienceYears} yrs
                  </p>
                </div>
                <IconChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            )}

            <button
              type="button"
              onClick={handleLocationClick}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                <IconLocation className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-slate-900">Meeting Point</p>
                <p className="text-sm text-slate-500">{activity.locationName}</p>
              </div>
              <IconChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">From</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(activity.basePrice)}
              </p>
              <Link
                href={`/activities/${activity.id}/book`}
                className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-blue-500 py-3 text-sm font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                Book Slot
              </Link>
              <Link
                href={`/report?activityId=${activity.id}&operatorId=${activity.operatorId}`}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
              >
                <IconAlert className="h-4 w-4" />
                Report Safety Issue
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
