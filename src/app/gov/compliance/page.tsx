import { getOperators } from "@/lib/services";
import { ComplianceClient } from "./ComplianceClient";

const summary = [
  { label: "Compliant", value: 1412, color: "border-green-200 text-green-700", icon: "✓" },
  { label: "At Risk", value: 298, color: "border-amber-200 text-amber-700", icon: "!" },
  { label: "Non-Compliant", value: 137, color: "border-red-200 text-red-700", icon: "✕" },
];

export default async function GovCompliancePage() {
  const operators = await getOperators();

  return (
    <div>
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

      <ComplianceClient operators={operators} />
    </div>
  );
}
