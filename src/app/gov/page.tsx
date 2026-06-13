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
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
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
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">District Activity Map — J&K</h2>
          <p className="text-sm text-slate-500">Booking density by district</p>
          <div className="mt-4 flex min-h-[200px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 sm:mt-6 sm:min-h-[240px]">
            <div className="grid w-full grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:gap-3 sm:p-6">
              {districts.map((d) => (
                <div
                  key={d.id}
                  className="rounded-lg px-2 py-2.5 text-center text-xs font-medium text-white shadow-sm sm:px-4 sm:py-3 sm:text-sm"
                  style={{
                    background: d.alertStatus === "ACTIVE" ? "#1d4ed8" : d.alertStatus === "MODERATE" ? "#60a5fa" : "#93c5fd",
                  }}
                >
                  {d.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 sm:mt-4 sm:gap-4">
            <span className="flex items-center gap-1"><span className="h-2.5 w-6 rounded bg-blue-800 sm:w-8" /> High</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-6 rounded bg-blue-300 sm:w-8" /> Low</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="font-bold text-slate-900">District Breakdown</h2>
          
          {/* Mobile card layout */}
          <div className="mt-4 space-y-2 sm:hidden">
            {districts.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${alertColors[d.alertStatus]}`} />
                  <span className="font-medium text-sm">{d.name}</span>
                </div>
                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-900">{formatCurrency(d.totalRevenue)}</p>
                  <p className="text-slate-500">{d.totalBookings.toLocaleString()} bookings</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop table layout */}
          <div className="hidden sm:block">
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
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 sm:gap-4">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Active</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Moderate</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
