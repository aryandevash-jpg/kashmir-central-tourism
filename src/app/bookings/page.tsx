import Image from "next/image";
import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";
import { IconCalendar } from "@/components/icons";
import { getActivities, getBookingsForUser } from "@/lib/services";
import { authOrRedirect } from "@/lib/auth/guards";
import { formatCurrencyDetailed, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default async function BookingsPage() {
  const profile = await authOrRedirect("/bookings");
  const [bookings, activities] = await Promise.all([
    getBookingsForUser(profile.id),
    getActivities(),
  ]);

  const activityMap = new Map(activities.map((a) => [a.id, a]));

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <p className="text-slate-500">Track and manage your activity reservations</p>

        <div className="mt-8 space-y-4">
          {bookings.length === 0 ? (
            <p className="py-12 text-center text-slate-500">No bookings yet.</p>
          ) : (
            bookings.map((booking) => {
              const activity = activityMap.get(booking.activityId);
              if (!activity) return null;
              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5"
                >
                  <Image
                    src={activity.coverImageUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">{activity.title}</p>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <IconCalendar className="w-4 h-4" />
                      {formatDate(booking.bookedAt)} · {booking.groupSize} guests
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatCurrencyDetailed(booking.total)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/explore"
            className="inline-flex rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Explore More Activities
          </Link>
        </div>
      </div>
    </div>
  );
}
