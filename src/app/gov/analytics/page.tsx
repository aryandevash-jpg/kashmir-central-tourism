import { getActivities, getDistricts } from "@/lib/services";
import { categoryLabel, formatCurrency } from "@/lib/utils";
import { IconStar } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function GovAnalyticsPage() {
  const [activities, districts] = await Promise.all([getActivities(), getDistricts()]);

  const byCategory = activities.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});

  const topActivities = [...activities]
    .sort((a, b) => b.reviewCount - a.reviewCount || b.rating - a.rating)
    .slice(0, 10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Activity Analytics</h1>
        <p className="text-slate-500">Live data from registered activities across J&K districts</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Active Activities</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{activities.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Districts Covered</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{districts.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Categories</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{Object.keys(byCategory).length}</p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Activities by Category</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(byCategory).map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">{categoryLabel(cat)}</span>
              <span className="font-semibold text-slate-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">Top Activities</h2>
        </div>
        {topActivities.length === 0 ? (
          <p className="p-6 text-center text-slate-500">No activities in the database yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="px-6 py-3">Activity</th>
                <th className="px-6 py-3">District</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topActivities.map((a, i) => (
                <tr key={a.id} className="border-t border-slate-50">
                  <td className="px-6 py-4 font-medium">{a.title}</td>
                  <td className="px-6 py-4 text-slate-600">{a.district}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {categoryLabel(a.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(a.basePrice)}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1">
                      <IconStar className="h-3 w-3 text-amber-400" filled />
                      {a.rating || "—"} ({a.reviewCount})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
