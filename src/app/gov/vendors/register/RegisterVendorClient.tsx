"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBuilding, IconCheck } from "@/components/icons";
import type { ActivityCategory } from "@/lib/types";

const categories: { value: ActivityCategory; label: string }[] = [
  { value: "TREKKING", label: "Trekking" },
  { value: "GONDOLA", label: "Gondola / Cable Car" },
  { value: "WATER_TOUR", label: "Water Tour" },
  { value: "SKIING", label: "Skiing" },
  { value: "CAMPING", label: "Camping" },
  { value: "RAFTING", label: "Rafting" },
  { value: "SIGHTSEEING", label: "Sightseeing" },
  { value: "PARAGLIDING", label: "Paragliding" },
  { value: "MOUNTAINEERING", label: "Mountaineering" },
];

const districts = [
  "Srinagar", "Baramulla", "Ganderbal", "Anantnag", "Pulwama",
  "Budgam", "Kupwara", "Bandipora", "Kargil", "Leh",
];

export function RegisterVendorClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNo: "",
    activityType: "" as ActivityCategory | "",
    district: "",
    licenseExpiry: "",
    insuranceExpiry: "",
    experienceYears: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        return;
      }

      setRegisteredName(formData.companyName);
      setTemporaryPassword(json.data?.temporaryPassword ?? "");
      setSuccess(true);
      setTimeout(() => router.push("/gov/compliance"), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <IconCheck className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Vendor Registered</h2>
        <p className="mt-2 text-slate-500">
          <strong>{registeredName}</strong> has been added to the compliance registry.
          Verification is pending before they can list activities.
        </p>
        {temporaryPassword && (
          <div className="mx-auto mt-4 max-w-sm rounded-lg bg-slate-50 px-4 py-3 text-left text-sm">
            <p className="font-medium text-slate-700">Temporary password (share securely):</p>
            <p className="mt-1 font-mono text-slate-900">{temporaryPassword}</p>
            <p className="mt-2 text-xs text-slate-500">
              The vendor should sign in at the operator portal and change this password.
            </p>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-400">Redirecting to compliance registry...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <IconBuilding className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">New Vendor Application</h2>
            <p className="text-sm text-slate-500">Register a tourism operator for J&K licensing</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Contact Person
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Business Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Company Name *</label>
              <input
                required
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">License Number *</label>
              <input
                required
                type="text"
                value={formData.licenseNo}
                onChange={(e) => setFormData((p) => ({ ...p, licenseNo: e.target.value }))}
                placeholder="JK-OP-XXXX"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Activity Type *</label>
              <select
                required
                value={formData.activityType}
                onChange={(e) => setFormData((p) => ({ ...p, activityType: e.target.value as ActivityCategory }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select type</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">District *</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Years of Experience</label>
              <input
                type="number"
                min={0}
                max={50}
                value={formData.experienceYears}
                onChange={(e) => setFormData((p) => ({ ...p, experienceYears: Number(e.target.value) }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Compliance Documents
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">License Expiry *</label>
              <input
                required
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => setFormData((p) => ({ ...p, licenseExpiry: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Insurance Expiry *</label>
              <input
                required
                type="date"
                value={formData.insuranceExpiry}
                onChange={(e) => setFormData((p) => ({ ...p, insuranceExpiry: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          New vendors are registered as <strong>unverified</strong>. They must pass compliance review
          before listing activities. Vendor accounts can only be created by government officers.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register Vendor"}
        </button>
      </form>
    </div>
  );
}
