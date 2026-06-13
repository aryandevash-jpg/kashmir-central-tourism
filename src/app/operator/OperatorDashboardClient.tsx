"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconSearch, IconStar } from "@/components/icons";
import { useToast } from "@/components/Toast";
import type { BookingWithDetails } from "@/lib/data/bookings";
import { formatCurrency, formatCurrencyDetailed } from "@/lib/utils";
import type { Activity } from "@/lib/types";

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

const stats = [
  { label: "Total Revenue", value: "₹8,42,500", trend: "+12.4% vs last month", icon: "₹" },
  { label: "Total Bookings", value: "1,284", trend: "+8.1% vs last month", icon: "📅" },
  { label: "Active Travellers", value: "312", trend: "+4.8% vs last month", icon: "👥" },
  { label: "Avg. Rating", value: "4.82", trend: "+0.3% vs last month", icon: "⭐" },
];

const donutData = [
  { label: "Gondola Ride", pct: 48, color: "#3b82f6" },
  { label: "Shikara at Sunrise", pct: 27, color: "#06b6d4" },
  { label: "Frozen Lake Trek", pct: 18, color: "#10b981" },
  { label: "Other", pct: 7, color: "#94a3b8" },
];

interface OperatorDashboardClientProps {
  operatorBookings: BookingWithDetails[];
  activities: Activity[];
  operatorRevenue: { month: string; value: number }[];
}

export function OperatorDashboardClient({
  operatorBookings,
  activities,
  operatorRevenue,
}: OperatorDashboardClientProps) {
  const [timePeriod, setTimePeriod] = useState<"6M" | "1Y" | "All">("6M");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast, ToastContainer } = useToast();

  const maxRevenue = Math.max(1, ...operatorRevenue.map((r) => r.value));

  const filteredBookings = operatorBookings.filter(
    (b) =>
      b.traveller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.activity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTimePeriodChange = (period: "6M" | "1Y" | "All") => {
    setTimePeriod(period);
    showToast(`Showing ${period === "All" ? "all time" : period} revenue data`, "info");
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Welcome back, Imran. Here&apos;s what&apos;s happening with your activities today.
          </p>
        </div>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 lg:w-72"
          />
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{s.label}</p>
              <span className="text-lg">{s.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs font-medium text-green-600">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Revenue Overview</h2>
                <p className="text-sm text-slate-500">Monthly earnings across all activities</p>
              </div>
              <div className="flex gap-2 text-xs">
                {(["6M", "1Y", "All"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleTimePeriodChange(p)}
                    className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                      timePeriod === p
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex h-48 items-end gap-3">
              {operatorRevenue.map((r) => (
                <div key={r.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-blue-400 opacity-70"
                    style={{ height: `${(r.value / maxRevenue) * 160}px` }}
                  />
                  <span className="text-xs text-slate-500">{r.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Recent Bookings</h2>
              <Link
                href="/operator/bookings"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Mobile card layout */}
            <div className="space-y-3 sm:hidden">
              {(searchQuery ? filteredBookings : operatorBookings).slice(0, 5).map((b) => (
                <div key={b.id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {b.traveller
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-sm">{b.traveller}</p>
                        <p className="text-xs text-slate-400">{b.guests} guests</p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[b.status] ?? "bg-slate-100"}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">{b.activity}</span>
                    <span className="font-semibold">{formatCurrencyDetailed(b.amount)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{b.date}</p>
                </div>
              ))}
            </div>

            {/* Desktop table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                    <th className="pb-3 pr-4">Traveller</th>
                    <th className="pb-3 pr-4">Activity</th>
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery ? filteredBookings : operatorBookings).slice(0, 5).map((b) => (
                    <tr key={b.id} className="border-b border-slate-50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {b.traveller
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium">{b.traveller}</p>
                            <p className="text-xs text-slate-400">{b.guests} guests</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{b.activity}</td>
                      <td className="py-3 pr-4 text-slate-600">{b.date}</td>
                      <td className="py-3 pr-4 font-medium">{formatCurrencyDetailed(b.amount)}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[b.status] ?? "bg-slate-100"}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Bookings by Activity</h2>
            <div className="relative mx-auto mb-4 h-36 w-36">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray="48 52"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="27 73"
                  strokeDashoffset="-48"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="18 82"
                  strokeDashoffset="-75"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  strokeDasharray="7 93"
                  strokeDashoffset="-93"
                />
              </svg>
            </div>
            <div className="space-y-2">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-600">{d.label}</span>
                  </div>
                  <span className="font-semibold">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-slate-900">Top Activities</h2>
            <div className="space-y-4">
              {activities.slice(0, 3).map((a) => (
                <Link
                  key={a.id}
                  href={`/activities/${a.id}`}
                  className="flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-slate-50"
                >
                  <Image
                    src={a.coverImageUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{a.title}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <IconStar className="w-3 h-3 text-amber-400" filled />
                      {a.rating} · {a.reviewCount} reviews
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{formatCurrency(a.basePrice)}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-bold text-blue-900">💡 Boost off-peak slots</p>
            <p className="mt-1 text-sm text-blue-700">
              Morning gondola slots are 40% underbooked. Add a promo to fill them.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
