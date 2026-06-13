import {
  getActivitiesByOperator,
  getOperatorBookings,
} from "@/lib/services";
import { requireOperatorId } from "@/lib/auth/session";
import type { BookingWithDetails } from "@/lib/data/bookings";
import { OperatorDashboardClient } from "./OperatorDashboardClient";

export const dynamic = "force-dynamic";

function computeMonthlyRevenue(bookings: BookingWithDetails[]) {
  const byMonth = new Map<string, number>();
  for (const b of bookings) {
    const month = b.date.slice(0, 7);
    byMonth.set(month, (byMonth.get(month) ?? 0) + b.amount);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}

export default async function OperatorDashboard() {
  const { operatorId } = await requireOperatorId();
  const [operatorBookings, activities] = await Promise.all([
    getOperatorBookings(operatorId),
    getActivitiesByOperator(operatorId),
  ]);

  return (
    <OperatorDashboardClient
      operatorBookings={operatorBookings}
      activities={activities}
      operatorRevenue={computeMonthlyRevenue(operatorBookings)}
    />
  );
}
