import { getOperators } from "@/lib/services";
import { categoryLabel } from "@/lib/utils";
import { IconDownload, IconSearch, IconStar } from "@/components/icons";

const licenseStyles = {
  VALID: "bg-green-100 text-green-700",
  EXPIRING_SOON: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-red-100 text-red-700",
};

const summary = [
  { label: "Compliant", value: 1412, color: "border-green-200 text-green-700", icon: "✓" },
  { label: "At Risk", value: 298, color: "border-amber-200 text-amber-700", icon: "!" },
  { label: "Non-Compliant", value: 137, color: "border-red-200 text-red-700", icon: "✕" },
];

export default async function GovCompliancePage() {
  const operators = await getOperators();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operator Compliance Registry</h1>
          <p className="text-slate-500">License, insurance & safety inspection records across J&K</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search operator, district..."
              className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm"
            />
          </div>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option>All Districts</option>
          </select>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option>All Status</option>
          </select>
          <button type="button" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
            <IconDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <div key={s.label} className={`rounded-xl border-2 bg-white p-5 ${s.color}`}>
            <p className="text-xs font-bold uppercase tracking-wide">{s.label}</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-4xl font-bold">{s.value.toLocaleString()}</p>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase text-slate-400">
              <th className="px-6 py-4">Operator Name</th>
              <th className="px-6 py-4">District</th>
              <th className="px-6 py-4">Activity Type</th>
              <th className="px-6 py-4">License Status</th>
              <th className="px-6 py-4">Insurance Expiry</th>
              <th className="px-6 py-4">Safety Rating</th>
              <th className="px-6 py-4">Last Inspection</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op.id} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {op.isVerified && <span className="text-green-500">✓</span>}
                    <span className="font-medium">{op.companyName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{op.district}</td>
                <td className="px-6 py-4 text-slate-600">{categoryLabel(op.activityType)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${licenseStyles[op.licenseStatus]}`}>
                    {op.licenseStatus.replace("_", " ")}
                  </span>
                </td>
                <td className={`px-6 py-4 ${op.licenseStatus === "EXPIRED" ? "text-red-600 font-medium" : "text-slate-600"}`}>
                  {op.insuranceExpiry}
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1">
                    <IconStar className="w-3 h-3 text-amber-400" filled />
                    {op.safetyRating}/5
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{op.lastInspection ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
          <span>Showing 1–{operators.length} of 1,847 operators</span>
          <div className="flex gap-2">
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50">Previous</button>
            <button type="button" className="rounded-lg bg-blue-600 px-3 py-1 text-white">1</button>
            <button type="button" className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
