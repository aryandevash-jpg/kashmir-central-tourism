import Image from "next/image";
import { DEMO_OPERATOR_ID, getActivitiesByOperator } from "@/lib/services";
import { categoryLabel, formatCurrency, formatDuration } from "@/lib/utils";

export default async function OperatorActivitiesPage() {
  const myActivities = await getActivitiesByOperator(DEMO_OPERATOR_ID);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Activities</h1>
      <p className="text-slate-500">Manage your listed tourism experiences</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {myActivities.map((a) => (
          <div key={a.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <Image src={a.coverImageUrl} alt="" width={100} height={100} className="rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-bold text-slate-900">{a.title}</p>
              <p className="text-sm text-slate-500">{categoryLabel(a.category)} · {a.district}</p>
              <p className="mt-1 text-sm">{formatDuration(a.durationMinutes)} · {formatCurrency(a.basePrice)}</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${a.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                {a.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
