import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TouristNav } from "@/components/tourist/TouristNav";
import {
  IconBookmark,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconLocation,
  IconMountain,
  IconStar,
  IconVerified,
} from "@/components/icons";
import { getActivityById, getOperatorForActivity } from "@/lib/services";
import { difficultyLabel, formatCurrency, formatDuration } from "@/lib/utils";

const includeIcons: Record<string, string> = {
  Guide: "👤",
  Gear: "🎒",
  Lunch: "🍽️",
  Transport: "🚌",
};

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await getActivityById(id);
  if (!activity) notFound();

  const operator = await getOperatorForActivity(id);

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <IconChevronLeft className="w-4 h-4" />
          Back to Explore
        </Link>

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
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
              >
                <IconBookmark className="w-5 h-5 text-slate-700" />
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                <IconLocation className="w-4 h-4 text-blue-500" />
                {activity.district}, Kashmir
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">{activity.title}</h1>

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
            <div className="sticky top-24 space-y-4">
              {operator && (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {operator.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-slate-900">{operator.companyName}</p>
                      {operator.isVerified && <IconVerified className="w-4 h-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-slate-500">
                      Verified Operator · {operator.experienceYears} yrs
                    </p>
                  </div>
                  <IconChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              )}

              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
                  <IconLocation className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Meeting Point</p>
                  <p className="text-sm text-slate-500">{activity.locationName}</p>
                </div>
                <IconChevronRight className="w-5 h-5 text-slate-400" />
              </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
