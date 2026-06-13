"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconBuilding, IconCheck } from "@/components/icons";

export function RegisterOfficerClient() {
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/gov-officers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Registration failed");
        return;
      }

      setRegisteredName(formData.name);
      setTemporaryPassword(json.data?.temporaryPassword ?? "");
      setSuccess(true);
      setTimeout(() => router.push("/gov"), 3000);
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
        <h2 className="mt-4 text-xl font-bold text-slate-900">Officer Account Created</h2>
        <p className="mt-2 text-slate-500">
          <strong>{registeredName}</strong> can now access the government portal.
        </p>
        {temporaryPassword && (
          <div className="mx-auto mt-4 max-w-sm rounded-lg bg-slate-50 px-4 py-3 text-left text-sm">
            <p className="font-medium text-slate-700">Temporary password (share securely):</p>
            <p className="mt-1 font-mono text-slate-900">{temporaryPassword}</p>
            <p className="mt-2 text-xs text-slate-500">
              The officer should change this password after first sign-in.
            </p>
          </div>
        )}
        <p className="mt-4 text-sm text-slate-400">Redirecting to overview...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <IconBuilding className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">New Government Officer</h2>
            <p className="text-sm text-slate-500">Provision portal access for a tourism department official</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Official Email *</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              placeholder="name@jktourism.gov.in"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
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

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Government accounts are created by authorized officers only. A temporary password will be
          generated for the new user to sign in at the government portal.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-800 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Officer Account"}
        </button>
      </form>
    </div>
  );
}
