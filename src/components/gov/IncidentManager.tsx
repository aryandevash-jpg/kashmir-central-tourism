"use client";

import { useState } from "react";
import { IconCheck, IconClock, IconStar, IconX } from "@/components/icons";
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

type TabType = "open" | "review" | "resolved";

interface IncidentManagerProps {
  incidents: Incident[];
  operators: Operator[];
}

export function IncidentManager({ incidents: initialIncidents, operators }: IncidentManagerProps) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [activeTab, setActiveTab] = useState<TabType>("open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"escalate" | "resolve" | null>(null);
  const [actionNote, setActionNote] = useState("");

  const openIncidents = incidents.filter((i) => i.status === "OPEN");
  const reviewIncidents = incidents.filter((i) => i.status === "UNDER_REVIEW");
  const resolvedIncidents = incidents.filter((i) => i.status === "RESOLVED");

  const getTabIncidents = () => {
    switch (activeTab) {
      case "open":
        return openIncidents;
      case "review":
        return reviewIncidents;
      case "resolved":
        return resolvedIncidents;
    }
  };

  const tabIncidents = getTabIncidents();
  const selected = selectedId ? incidents.find((i) => i.id === selectedId) : tabIncidents[0];
  const operator = selected ? operators.find((o) => o.id === selected.operatorId) : undefined;

  const handleEscalate = () => {
    if (!selected) return;
    setModalAction("escalate");
    setShowModal(true);
  };

  const handleMarkResolved = () => {
    if (!selected) return;
    setModalAction("resolve");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selected || !modalAction) return;

    try {
      const res = await fetch("/api/v1/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId: selected.id,
          action: modalAction,
          note: actionNote,
        }),
      });

      if (res.ok) {
        const newStatus = modalAction === "resolve" ? "RESOLVED" : "UNDER_REVIEW";
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === selected.id
              ? { ...i, status: newStatus, resolvedAt: modalAction === "resolve" ? new Date().toISOString() : i.resolvedAt }
              : i
          )
        );
        
        if (modalAction === "resolve") {
          setActiveTab("resolved");
        }
        setSelectedId(null);
      }
    } catch {
      // Handle error silently for now
    }

    setShowModal(false);
    setActionNote("");
    setModalAction(null);
  };

  const tabs = [
    { id: "open" as const, label: "Open", count: openIncidents.length, color: "text-red-600 border-red-500" },
    { id: "review" as const, label: "Under Review", count: reviewIncidents.length, color: "text-amber-600 border-amber-500" },
    { id: "resolved" as const, label: "Resolved", count: resolvedIncidents.length, color: "text-green-600 border-green-500" },
  ];

  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border-2 border-red-300 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Critical</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{incidents.filter((i) => i.severity === "CRITICAL" && i.status !== "RESOLVED").length}</p>
            <span>⚠️</span>
          </div>
        </div>
        <div className="rounded-xl border-2 border-slate-800 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">High</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{incidents.filter((i) => i.severity === "HIGH" && i.status !== "RESOLVED").length}</p>
            <span>ℹ️</span>
          </div>
        </div>
        <div className="rounded-xl border-2 border-amber-300 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Under Review</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{reviewIncidents.length}</p>
            <span>🕐</span>
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-300 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resolved (30D)</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-3xl font-bold">{resolvedIncidents.length}</p>
            <span>✓</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-1 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedId(null);
            }}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors",
              activeTab === tab.id
                ? tab.color
                : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              activeTab === tab.id ? "bg-slate-100" : "bg-slate-50"
            )}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {tabIncidents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-semibold text-slate-700">No {activeTab} incidents</p>
          <p className="mt-2 text-slate-500">
            {activeTab === "resolved" 
              ? "Resolved incidents will appear here"
              : "All incidents have been processed"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full",
                activeTab === "open" ? "animate-pulse bg-red-500" : activeTab === "review" ? "bg-amber-500" : "bg-green-500"
              )} />
              <span className={cn("text-xs font-bold uppercase", 
                activeTab === "open" ? "text-red-600" : activeTab === "review" ? "text-amber-600" : "text-green-600"
              )}>
                {activeTab === "open" ? "Active" : activeTab === "review" ? "In Progress" : "Completed"}
              </span>
            </div>
            <div className="space-y-3">
              {tabIncidents.map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => setSelectedId(inc.id)}
                  className={cn(
                    "w-full rounded-xl p-4 text-left transition-colors",
                    (selected?.id === inc.id)
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={selected?.id === inc.id ? "text-slate-400" : "text-slate-500"}>
                      {new Date(inc.occurredAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className={cn("font-semibold", selected?.id === inc.id ? "text-red-400" : statusStyles[inc.status])}>
                      {inc.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 font-semibold">{inc.title}</p>
                  <p className={cn("mt-1 text-sm line-clamp-2", selected?.id === inc.id ? "text-slate-400" : "text-slate-500")}>
                    {inc.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs", selected?.id === inc.id ? "bg-slate-700" : "bg-slate-100 text-slate-600")}>
                      {inc.district}
                    </span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", severityStyles[inc.severity])}>
                      {inc.severity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{selected.title}</h2>
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
                  <div className={`h-0.5 flex-1 ${selected.status !== "OPEN" ? "bg-amber-300" : "bg-slate-200"}`} />
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selected.status !== "OPEN" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      <IconClock className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${selected.status !== "OPEN" ? "font-medium text-amber-600" : "text-slate-400"}`}>
                      Under Review
                    </span>
                  </div>
                  <div className={`h-0.5 flex-1 ${selected.status === "RESOLVED" ? "bg-green-300" : "bg-slate-200"}`} />
                  <div className="flex flex-col items-center gap-1">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selected.status === "RESOLVED" ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      <IconCheck className="w-4 h-4" />
                    </div>
                    <span className={`text-xs ${selected.status === "RESOLVED" ? "font-medium text-green-600" : "text-slate-400"}`}>
                      Resolved
                    </span>
                  </div>
                </div>
              </div>

              {selected.status !== "RESOLVED" && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button 
                    type="button" 
                    onClick={handleEscalate}
                    className="flex-1 rounded-xl border-2 border-red-300 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    ↑ Escalate to Commissioner
                  </button>
                  <button 
                    type="button" 
                    onClick={handleMarkResolved}
                    className="flex-1 rounded-xl border-2 border-green-400 py-3 text-sm font-semibold text-green-600 hover:bg-green-50"
                  >
                    ✓ Mark Resolved
                  </button>
                </div>
              )}

              {selected.status === "RESOLVED" && selected.resolvedAt && (
                <div className="mt-6 rounded-xl bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    ✓ Resolved on {new Date(selected.resolvedAt).toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {modalAction === "escalate" ? "Escalate Incident" : "Resolve Incident"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setActionNote("");
                  setModalAction(null);
                }}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <IconX className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <p className="mt-3 text-sm text-slate-600">
              {modalAction === "escalate"
                ? "This will escalate the incident to the Commissioner's office for urgent action."
                : "Mark this incident as resolved. This action cannot be undone."}
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Add a note (optional)
              </label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder={modalAction === "escalate" ? "Reason for escalation..." : "Resolution details..."}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setActionNote("");
                  setModalAction(null);
                }}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white ${
                  modalAction === "escalate" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {modalAction === "escalate" ? "Escalate" : "Mark Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
