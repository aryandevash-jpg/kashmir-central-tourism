import { IconStar } from "@/components/icons";
import { DEMO_OPERATOR_ID, getActivitiesByOperator, getOperatorBookings } from "@/lib/services";
import { operatorRevenue } from "@/lib/mock-data";
import { categoryLabel, formatCurrency, formatCurrencyDetailed } from "@/lib/utils";

export default async function OperatorAnalyticsPage() {
  const [activities, bookings] = await Promise.all([
    getActivitiesByOperator(DEMO_OPERATOR_ID),
    getOperatorBookings(DEMO_OPERATOR_ID),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const maxRevenue = Math.max(...operatorRevenue.map((r) => r.value));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500">Performance insights for your activities and bookings</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{bookings.length}</p>
          <p className="mt-1 text-xs text-green-600">+8.1% vs last month</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Revenue (recent)</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{formatCurrencyDetailed(totalRevenue)}</p>
          <p className="mt-1 text-xs text-green-600">+12.4% vs last month</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active Activities</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{activities.filter((a) => a.isActive).length}</p>
          <p className="mt-1 text-xs text-slate-400">{activities.length} total listed</p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Monthly Revenue</h2>
        <p className="text-sm text-slate-500">Earnings across all your activities</p>
        <div className="mt-6 flex h-48 items-end gap-3">
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

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">Activity Performance</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase text-slate-400">
              <th className="px-6 py-3">Activity</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">District</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} className="border-t border-slate-50">
                <td className="px-6 py-4 font-medium">{a.title}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {categoryLabel(a.category)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{a.district}</td>
                <td className="px-6 py-4">{formatCurrency(a.basePrice)}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <IconStar className="w-3 h-3 text-amber-400" filled />
                    {a.rating || "—"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                    {a.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
