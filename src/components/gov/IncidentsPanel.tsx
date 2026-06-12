"use client";

import { useState } from "react";
import { IconCheck, IconClock, IconStar } from "@/components/icons";
import type { Incident, Operator } from "@/lib/types";
import { cn } from "@/lib/utils";

const severityStyles = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-slate-900 text-white",
  LOW: "bg-green-100 text-green-700",
};

const statusStyles = {
  OPEN: "text-red-600",
  UNDER_REVIEW: "text-amber-600",
  RESOLVED: "text-green-600",
};

const summaryCards = [
  { label: "Critical", value: 1, border: "border-red-300", icon: "⚠️" },
  { label: "High", value: 2, border: "border-slate-800", icon: "ℹ️" },
  { label: "Under Review", value: 4, border: "border-amber-300", icon: "🕐" },
  { label: "Resolved (30D)", value: 18, border: "border-green-300", icon: "✓" },
];

export function IncidentsPanel({
  incidents,
  operators,
}: {
  incidents: Incident[];
  operators: Operator[];
}) {
  const [selectedId, setSelectedId] = useState(incidents[0]?.id ?? "");
  const selected = incidents.find((i) => i.id === selectedId) ?? incidents[0];
  const operator = selected
    ? operators.find((o) => o.id === selected.operatorId)
    : undefined;

  if (!selected) {
    return <p className="text-slate-500">No incidents recorded.</p>;
  }

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`rounded-xl border-2 bg-white p-4 ${c.border}`}>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{c.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold">{c.value}</p>
              <span>{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            <span className="text-xs font-bold uppercase text-red-600">Live</span>
          </div>
          <div className="space-y-3">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => setSelectedId(inc.id)}
                className={cn(
                  "w-full rounded-xl p-4 text-left transition-colors",
                  selectedId === inc.id
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={selectedId === inc.id ? "text-slate-400" : "text-slate-500"}>
                    {new Date(inc.occurredAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className={cn("font-semibold", selectedId === inc.id ? "text-red-400" : statusStyles[inc.status])}>
                    {inc.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 font-semibold">{inc.title}</p>
                <p className={cn("mt-1 text-sm line-clamp-2", selectedId === inc.id ? "text-slate-400" : "text-slate-500")}>
                  {inc.description}
                </p>
                <span className={cn("mt-2 inline-block rounded-full px-2 py-0.5 text-xs", selectedId === inc.id ? "bg-slate-700" : "bg-slate-100 text-slate-600")}>
                  {inc.district}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{selected.title}</h2>
              <p className="text-sm text-slate-500">
                {selected.incidentCode} · {new Date(selected.occurredAt).toLocaleString("en-IN")}
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${severityStyles[selected.severity]}`}>
              {selected.severity}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-slate-600">{selected.description}</p>

          {operator && (
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-400">Linked Operator</p>
              <p className="mt-1 font-bold text-slate-900">{operator.companyName}</p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <IconStar className="w-3 h-3 text-amber-400" filled />
                  {operator.safetyRating} safety rating
                </span>
                <span>License: {operator.licenseNo}</span>
                <span>District: {operator.district}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-4 text-sm font-bold text-slate-900">Resolution Tracker</p>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <IconCheck className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-500">Reported</span>
              </div>
              <div className="h-0.5 flex-1 bg-amber-300" />
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <IconClock className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-amber-600">Under Review</span>
              </div>
              <div className="h-0.5 flex-1 bg-slate-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <IconCheck className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-400">Resolved</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button type="button" className="flex-1 rounded-xl border-2 border-red-300 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
              ↑ Escalate to Commissioner
            </button>
            <button type="button" className="flex-1 rounded-xl border-2 border-green-400 py-3 text-sm font-semibold text-green-600 hover:bg-green-50">
              ✓ Mark Resolved
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
