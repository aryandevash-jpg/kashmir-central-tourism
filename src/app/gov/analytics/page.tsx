import { analyticsData } from "@/lib/mock-data";
import { categoryLabel, formatCurrency } from "@/lib/utils";
import { IconDownload, IconStar } from "@/components/icons";

const categories = ["TREKKING", "GONDOLA", "WATER_TOUR", "SIGHTSEEING", "SKIING", "CAMPING"];

export default function GovAnalyticsPage() {
  const maxVal = Math.max(...analyticsData.categories.flatMap((c) => c.data));

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity Analytics</h1>
          <p className="text-slate-500">Booking trends by activity category across all J&K districts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option>All Districts</option>
          </select>
          <input
            type="text"
            readOnly
            value="01 Jan 2025 - 15 Mar 2025"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            type="button"
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${i === 1 ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}
          >
            {categoryLabel(cat)}
          </button>
        ))}
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Bookings Over Time by Activity Category</h2>
          <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <IconDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="relative h-56">
          <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="none">
            {analyticsData.categories.map((cat) => {
              const points = cat.data
                .map((v, i) => `${(i / (cat.data.length - 1)) * 380 + 10},${190 - (v / maxVal) * 170}`)
                .join(" ");
              return (
                <polyline
                  key={cat.name}
                  points={points}
                  fill="none"
                  stroke={cat.color}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            {analyticsData.months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {analyticsData.categories.map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">Top 10 Activities</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase text-slate-400">
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Activity Name</th>
              <th className="px-6 py-3">District</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Bookings</th>
              <th className="px-6 py-3">Revenue</th>
              <th className="px-6 py-3">Avg. Rating</th>
              <th className="px-6 py-3">MoM</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.topActivities.map((a) => (
              <tr key={a.rank} className="border-t border-slate-50">
                <td className="px-6 py-4 font-bold text-slate-400">{a.rank}</td>
                <td className="px-6 py-4 font-medium">{a.name}</td>
                <td className="px-6 py-4 text-slate-600">{a.district}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {categoryLabel(a.category)}
                  </span>
                </td>
                <td className="px-6 py-4">{a.bookings.toLocaleString()}</td>
                <td className="px-6 py-4">{formatCurrency(a.revenue)}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <IconStar className="w-3 h-3 text-amber-400" filled />
                    {a.rating}
                  </span>
                </td>
                <td className={`px-6 py-4 font-medium ${a.momChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {a.momChange >= 0 ? "↑" : "↓"} {Math.abs(a.momChange)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
