"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconAlert } from "@/components/icons";
import { useToast } from "@/components/Toast";
import type { Activity, IncidentSeverity, Operator } from "@/lib/types";

const districts = [
  "Srinagar", "Baramulla", "Ganderbal", "Anantnag", "Pulwama",
  "Budgam", "Kupwara", "Bandipora", "Kargil", "Leh",
];

const severityOptions: { value: IncidentSeverity; label: string; desc: string }[] = [
  { value: "LOW", label: "Low", desc: "Minor issue, no immediate danger" },
  { value: "HIGH", label: "High", desc: "Safety concern requiring attention" },
  { value: "CRITICAL", label: "Critical", desc: "Emergency — injury or immediate risk" },
];

interface ReportIncidentClientProps {
  operators: Operator[];
  activities: Activity[];
}

export function ReportIncidentClient({ operators, activities }: ReportIncidentClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast, ToastContainer } = useToast();

  const prefillActivityId = searchParams.get("activityId") ?? "";
  const prefillOperatorId = searchParams.get("operatorId") ?? "";

  const prefillActivity = activities.find((a) => a.id === prefillActivityId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    operatorId: prefillOperatorId || prefillActivity?.operatorId || "",
    activityId: prefillActivityId,
    title: "",
    description: "",
    severity: "HIGH" as IncidentSeverity,
    district: prefillActivity?.district ?? "",
    occurredAt: new Date().toISOString().slice(0, 16),
  });

  const operatorActivities = useMemo(
    () => activities.filter((a) => a.operatorId === formData.operatorId),
    [activities, formData.operatorId],
  );

  const handleOperatorChange = (operatorId: string) => {
    const op = operators.find((o) => o.id === operatorId);
    setFormData((prev) => ({
      ...prev,
      operatorId,
      activityId: "",
      district: op?.district ?? prev.district,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          activityId: formData.activityId || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to submit report");
        return;
      }

      showToast("Incident reported successfully. Authorities have been notified.", "success");
      setTimeout(() => {
        router.push("/report?tab=track");
        router.refresh();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <IconAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Report a Safety Incident</h1>
            <p className="mt-1 text-slate-500">
              Report safety concerns during your tourism activity. All reports are sent to the J&K Tourism Department.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Operator *</label>
              <select
                required
                value={formData.operatorId}
                onChange={(e) => handleOperatorChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select operator</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>{op.companyName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Activity (optional)</label>
              <select
                value={formData.activityId}
                onChange={(e) => {
                  const activity = activities.find((a) => a.id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    activityId: e.target.value,
                    district: activity?.district ?? prev.district,
                  }));
                }}
                disabled={!formData.operatorId}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="">General / not activity-specific</option>
                {operatorActivities.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Incident Title *</label>
            <input
              required
              type="text"
              maxLength={200}
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Brief summary of the incident"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what happened, who was affected, and any immediate actions taken..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">District *</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">When did it occur? *</label>
              <input
                required
                type="datetime-local"
                value={formData.occurredAt}
                onChange={(e) => setFormData((prev) => ({ ...prev, occurredAt: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Severity *</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {severityOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                    formData.severity === opt.value
                      ? "border-red-500 bg-red-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={opt.value}
                    checked={formData.severity === opt.value}
                    onChange={() => setFormData((prev) => ({ ...prev, severity: opt.value }))}
                    className="sr-only"
                  />
                  <p className="font-semibold text-slate-900">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Safety Report"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
