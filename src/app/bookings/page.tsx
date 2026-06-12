import Image from "next/image";
import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";
import { IconCalendar } from "@/components/icons";
import { DEMO_TOURIST_ID, getActivities, getBookingsForUser } from "@/lib/services";
import { formatCurrencyDetailed, formatDate } from "@/lib/utils";

const statusStyles = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PENDING: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-green-100 text-green-700",
};

export default async function BookingsPage() {
  const [bookings, activities] = await Promise.all([
    getBookingsForUser(DEMO_TOURIST_ID),
    getActivities(),
  ]);

  const activityMap = new Map(activities.map((a) => [a.id, a]));

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <div className="mx-auto max-w-4xl px-6 py-8">
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
                  className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
                >
                  <Image
                    src={activity.coverImageUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{activity.title}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <IconCalendar className="w-4 h-4" />
                      {formatDate(booking.bookedAt)} · {booking.groupSize} guests
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatCurrencyDetailed(booking.total)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/explore"
            className="inline-flex rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Explore More Activities
          </Link>
          <Link
            href="/platform"
            className="inline-flex rounded-xl border border-blue-500 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Platform Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
