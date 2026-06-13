"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconChevronLeft } from "@/components/icons";
import type { ActivityCategory, DifficultyLevel } from "@/lib/types";

const categories: { value: ActivityCategory; label: string }[] = [
  { value: "TREKKING", label: "Trekking" },
  { value: "GONDOLA", label: "Gondola/Cable Car" },
  { value: "WATER_TOUR", label: "Water Tour" },
  { value: "SKIING", label: "Skiing" },
  { value: "CAMPING", label: "Camping" },
  { value: "RAFTING", label: "Rafting" },
  { value: "SIGHTSEEING", label: "Sightseeing" },
  { value: "PARAGLIDING", label: "Paragliding" },
  { value: "MOUNTAINEERING", label: "Mountaineering" },
];

const difficulties: { value: DifficultyLevel; label: string }[] = [
  { value: "EASY", label: "Easy - Suitable for all" },
  { value: "MODERATE", label: "Moderate - Some fitness required" },
  { value: "HARD", label: "Hard - Experienced only" },
];

const districts = [
  "Srinagar",
  "Baramulla",
  "Ganderbal",
  "Anantnag",
  "Pulwama",
  "Budgam",
  "Kupwara",
  "Bandipora",
  "Kargil",
  "Leh",
];

const includeOptions = ["Guide", "Gear", "Lunch", "Transport", "Insurance", "Photography"];

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    district: "",
    locationName: "",
    category: "" as ActivityCategory | "",
    difficulty: "MODERATE" as DifficultyLevel,
    durationMinutes: 120,
    basePrice: 1000,
    coverImageUrl: "/activities/default.jpg",
    includes: [] as string[],
    elevation: "",
  });

  const handleIncludeToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      includes: prev.includes.includes(item)
        ? prev.includes.filter((i) => i !== item)
        : [...prev.includes, item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create activity");
      }

      router.push("/operator/activities");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/operator/activities"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <IconChevronLeft className="h-4 w-4" />
        Back to Activities
      </Link>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Add New Activity</h1>
        <p className="mt-1 text-slate-500">Create a new tourism experience for travelers</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Activity Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Gulmarg Gondola Ride"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the experience, what travelers can expect..."
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Difficulty *</label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as DifficultyLevel })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                {difficulties.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">District *</label>
              <select
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Meeting Point *</label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g., Gondola Base Station"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Duration (minutes) *</label>
              <input
                type="number"
                required
                min={30}
                max={1440}
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Price per Person (₹) *</label>
              <input
                type="number"
                required
                min={100}
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: parseInt(e.target.value) || 0 })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Elevation</label>
              <input
                type="text"
                value={formData.elevation}
                onChange={(e) => setFormData({ ...formData, elevation: e.target.value })}
                placeholder="e.g., 3,800m"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">What&apos;s Included</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {includeOptions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleIncludeToggle(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    formData.includes.includes(item)
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Cover Image URL</label>
            <input
              type="text"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              placeholder="/activities/your-image.jpg"
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">Use a URL or path to your activity image</p>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex gap-3">
            <Link
              href="/operator/activities"
              className="flex-1 rounded-xl border border-slate-200 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
