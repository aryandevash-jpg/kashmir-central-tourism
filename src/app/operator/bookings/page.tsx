import { DEMO_OPERATOR_ID, getOperatorBookings } from "@/lib/services";
import { formatCurrencyDetailed } from "@/lib/utils";

const statusStyles = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default async function OperatorBookingsPage() {
  const operatorBookings = await getOperatorBookings(DEMO_OPERATOR_ID);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
      <p className="text-slate-500">Manage all reservations for your activities</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase text-slate-400">
              <th className="px-6 py-4">Traveller</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {operatorBookings.map((b) => (
              <tr key={b.id} className="border-t border-slate-50">
                <td className="px-6 py-4 font-medium">{b.traveller}</td>
                <td className="px-6 py-4 text-slate-600">{b.activity}</td>
                <td className="px-6 py-4 text-slate-600">{b.date}</td>
                <td className="px-6 py-4 font-medium">{formatCurrencyDetailed(b.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[b.status] ?? "bg-slate-100"}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
