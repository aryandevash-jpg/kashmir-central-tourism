import { getOperatorBookings } from "@/lib/services";
import { requireOperatorId } from "@/lib/auth/session";
import { formatCurrencyDetailed } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default async function OperatorBookingsPage() {
  const { operatorId } = await requireOperatorId();
  const operatorBookings = await getOperatorBookings(operatorId);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500">Reservations for your activities</p>
      </div>

      {operatorBookings.length === 0 ? (
        <p className="py-12 text-center text-slate-500">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {operatorBookings.map((b) => (
            <div
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{b.activity}</p>
                <p className="text-sm text-slate-500">
                  {b.traveller} · {b.guests} guests · {b.date}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatCurrencyDetailed(b.amount)}</p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[b.status]}`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
