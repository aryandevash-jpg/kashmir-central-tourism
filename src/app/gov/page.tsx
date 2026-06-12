import { getDistricts } from "@/lib/services";
import { formatCurrency } from "@/lib/utils";

const summaryCards = [
  { label: "Total Registered Operators", value: "1,847", note: "No change this month", icon: "🏢", color: "border-slate-200" },
  { label: "Monthly Bookings", value: "24,310", note: "+8.4% vs last month", icon: "📅", color: "border-slate-200", trend: "up" },
  { label: "GST Revenue Generated", value: "₹3.2 Cr", note: "+11.2% vs last month", icon: "₹", color: "border-slate-200", trend: "up" },
  { label: "Active Safety Incidents", value: "3", note: "Requires Attention", icon: "⚠️", color: "border-red-200", alert: true },
];

const alertColors = {
  ACTIVE: "bg-green-500",
  MODERATE: "bg-amber-500",
  ALERT: "bg-red-500",
};

export default async function GovOverviewPage() {
  const districts = await getDistricts();

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Department Overview</h1>
          <p className="text-slate-500">State-wide tourism activity and compliance monitoring</p>
        </div>
        <span className="rounded-lg bg-white px-3 py-1.5 text-sm text-slate-500 shadow-sm">
          FY 2024-25 Q4
        </span>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((c) => (
          <div key={c.label} className={`rounded-xl border bg-white p-5 shadow-sm ${c.color}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p>
              <span>{c.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
            <p className={`mt-1 text-xs font-medium ${c.alert ? "text-red-600" : c.trend ? "text-green-600" : "text-slate-400"}`}>
              {c.note}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">District Activity Map — Jammu & Kashmir</h2>
          <p className="text-sm text-slate-500">Booking density by district</p>
          <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="grid grid-cols-3 gap-3 p-8">
              {districts.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg px-4 py-3 text-center text-sm font-medium text-white shadow-sm"
                  style={{
                    background: d.alertStatus === "ACTIVE" ? "#1d4ed8" : d.alertStatus === "MODERATE" ? "#60a5fa" : "#93c5fd",
                  }}
                >
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-3 w-8 rounded bg-blue-800" /> High Activity</span>
            <span className="flex items-center gap-1"><span className="h-3 w-8 rounded bg-blue-300" /> Low Activity</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">District Breakdown</h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-400">
                <th className="pb-3">District</th>
                <th className="pb-3">Bookings</th>
                <th className="pb-3">Revenue</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => (
                <tr key={d.id} className="border-b border-slate-50">
                  <td className="py-3 font-medium">{d.name}</td>
                  <td className="py-3 text-slate-600">{d.totalBookings.toLocaleString()}</td>
                  <td className="py-3 text-slate-600">{formatCurrency(d.totalRevenue)}</td>
                  <td className="py-3">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${alertColors[d.alertStatus]}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Active</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
