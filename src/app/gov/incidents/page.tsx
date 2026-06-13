import { IncidentManager } from "@/components/gov/IncidentManager";
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
      </div>

      <IncidentManager incidents={incidents} operators={operators} />
    </div>
  );
}
