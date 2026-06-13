import { getActivitiesByOperator, getOperatorBookings } from "@/lib/services";
import { requireOperatorId } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OperatorAnalyticsPage() {
  const { operatorId } = await requireOperatorId();
  const [activities, bookings] = await Promise.all([
    getActivitiesByOperator(operatorId),
    getOperatorBookings(operatorId),
  ]);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      <p className="text-slate-500">Performance overview for your activities</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Bookings</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{bookings.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Activities</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{activities.length}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Activity breakdown</h2>
        {activities.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No activities listed yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {activities.map((a) => (
              <li key={a.id} className="flex justify-between text-sm">
                <span className="text-slate-700">{a.title}</span>
                <span className="font-medium text-slate-900">
                  {bookings.filter((b) => b.activity === a.title).length} bookings
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
