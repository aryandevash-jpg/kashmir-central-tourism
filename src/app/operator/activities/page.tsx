import { getActivitiesByOperator } from "@/lib/services";
import { requireOperatorId } from "@/lib/auth/session";
import Link from "next/link";
import { IconPlus } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function OperatorActivitiesPage() {
  const { operatorId } = await requireOperatorId();
  const myActivities = await getActivitiesByOperator(operatorId);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Activities</h1>
          <p className="text-slate-500">Manage your listed tourism experiences</p>
        </div>
        <Link
          href="/operator/activities/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
        >
          <IconPlus className="h-4 w-4" />
          New Activity
        </Link>
      </div>

      {myActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="font-medium text-slate-700">No activities yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first activity to start receiving bookings.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {myActivities.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{a.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{a.district} · {a.category}</p>
              <p className="mt-2 text-sm font-medium text-blue-600">₹{a.basePrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
