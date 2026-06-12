import { IncidentsPanel } from "@/components/gov/IncidentsPanel";
import { getIncidents, getOperators } from "@/lib/services";

export default async function GovIncidentsPage() {
  const [incidents, operators] = await Promise.all([
    getIncidents(),
    getOperators(),
  ]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Incident & Safety Log</h1>
          <p className="text-slate-500">Reported incidents across all J&K tourism activities — real-time feed</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {["Severity", "Status", "District", "Last 30 days"].map((f) => (
            <select key={f} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <option>{f === "Last 30 days" ? "Last 30 days" : `All ${f}`}</option>
            </select>
          ))}
        </div>
      </div>

      <IncidentsPanel incidents={incidents} operators={operators} />
    </div>
  );
}
