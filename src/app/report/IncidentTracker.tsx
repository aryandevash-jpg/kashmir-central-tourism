"use client";

import { useState } from "react";
import type { Incident, IncidentStatus, Operator } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  IncidentStatus,
  { label: string; color: string; bg: string; step: number }
> = {
  OPEN: { label: "Open", color: "text-red-600", bg: "bg-red-100", step: 1 },
  UNDER_REVIEW: { label: "Under Review", color: "text-amber-600", bg: "bg-amber-100", step: 2 },
  RESOLVED: { label: "Resolved", color: "text-green-600", bg: "bg-green-100", step: 3 },
};

const severityStyles = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-100 text-orange-700",
  LOW: "bg-green-100 text-green-700",
};

const timelineSteps = [
  { key: "reported", label: "Reported" },
  { key: "review", label: "Under Review" },
  { key: "resolved", label: "Resolved" },
] as const;

function StatusTimeline({ status }: { status: IncidentStatus }) {
  const currentStep = statusConfig[status].step;

  return (
    <div className="mt-4 flex items-center gap-1">
      {timelineSteps.map((step, i) => {
        const stepNum = i + 1;
        const done = stepNum <= currentStep;
        const active = stepNum === currentStep;
        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                  done ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400",
                  active && status === "OPEN" && "bg-red-500",
                  active && status === "UNDER_REVIEW" && "bg-amber-500",
                  active && status === "RESOLVED" && "bg-green-500",
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  "text-center text-[10px] font-medium leading-tight sm:text-xs",
                  done ? "text-slate-700" : "text-slate-400",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div
                className={cn(
                  "mx-1 mb-4 h-0.5 flex-1",
                  stepNum < currentStep ? "bg-blue-400" : "bg-slate-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function IncidentCard({
  incident,
  operatorName,
}: {
  incident: Incident;
  operatorName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[incident.status];
  const occurred = new Date(incident.occurredAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-slate-400">{incident.incidentCode}</p>
          <h3 className="mt-0.5 font-semibold text-slate-900">{incident.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {incident.district} · {occurred}
          </p>
          {operatorName && (
            <p className="mt-0.5 text-xs text-slate-400">Operator: {operatorName}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.bg, status.color)}>
            {status.label}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
              severityStyles[incident.severity],
            )}
          >
            {incident.severity}
          </span>
        </div>
      </div>

      <StatusTimeline status={incident.status} />

      {incident.status === "RESOLVED" && incident.resolvedAt && (
        <p className="mt-3 text-xs text-green-600">
          Resolved on{" "}
          {new Date(incident.resolvedAt).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        {expanded ? "Hide details" : "View details"}
      </button>

      {expanded && (
        <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm leading-relaxed text-slate-600">
          {incident.description}
        </p>
      )}
    </div>
  );
}

interface IncidentTrackerProps {
  incidents: Incident[];
  operators: Operator[];
  userId: string;
}

export function IncidentTracker({ incidents: initialIncidents, operators, userId }: IncidentTrackerProps) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [refreshing, setRefreshing] = useState(false);

  const operatorMap = Object.fromEntries(operators.map((o) => [o.id, o.companyName]));

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/v1/incidents?mine=true");
      if (res.ok) {
        const json = await res.json();
        setIncidents(json.data ?? []);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const openCount = incidents.filter((i) => i.status === "OPEN").length;
  const reviewCount = incidents.filter((i) => i.status === "UNDER_REVIEW").length;
  const resolvedCount = incidents.filter((i) => i.status === "RESOLVED").length;

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">My Reported Incidents</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track the status of safety reports you&apos;ve submitted
          </p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {incidents.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-red-50 px-3 py-3 text-center">
            <p className="text-2xl font-bold text-red-600">{openCount}</p>
            <p className="text-xs text-red-600">Open</p>
          </div>
          <div className="rounded-xl bg-amber-50 px-3 py-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{reviewCount}</p>
            <p className="text-xs text-amber-600">Under Review</p>
          </div>
          <div className="rounded-xl bg-green-50 px-3 py-3 text-center">
            <p className="text-2xl font-bold text-green-600">{resolvedCount}</p>
            <p className="text-xs text-green-600">Resolved</p>
          </div>
        </div>
      )}

      {incidents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-700">No incidents reported yet</p>
          <p className="mt-1 text-sm text-slate-500">
            When you submit a safety report, it will appear here with live status updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              operatorName={operatorMap[incident.operatorId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
