import Link from "next/link";
import { IconCalendar, IconCheck, IconStar } from "@/components/icons";

const notifications = [
  {
    id: "1",
    type: "booking",
    title: "New Booking Confirmed",
    message: "Aarav Reddy booked Gulmarg Gondola Ride for 2 guests on Jun 15",
    time: "2 hours ago",
    read: false,
    link: "/operator/bookings",
  },
  {
    id: "2",
    type: "review",
    title: "New Review Received",
    message: "Priya Sharma left a 5-star review for Frozen Lake Trek",
    time: "5 hours ago",
    read: false,
    link: "/operator/analytics",
  },
  {
    id: "3",
    type: "booking",
    title: "Booking Completed",
    message: "Rahul Kumar completed Shikara at Sunrise experience",
    time: "1 day ago",
    read: true,
    link: "/operator/bookings",
  },
  {
    id: "4",
    type: "system",
    title: "License Renewal Reminder",
    message: "Your operator license expires in 60 days. Renew to continue operations.",
    time: "2 days ago",
    read: true,
    link: "/operator/settings",
  },
  {
    id: "5",
    type: "booking",
    title: "Booking Cancelled",
    message: "Guest Amit Patel cancelled booking for Jun 20 - full refund processed",
    time: "3 days ago",
    read: true,
    link: "/operator/bookings",
  },
];

const typeIcons = {
  booking: IconCalendar,
  review: IconStar,
  system: IconCheck,
};

const typeStyles = {
  booking: "bg-blue-100 text-blue-600",
  review: "bg-amber-100 text-amber-600",
  system: "bg-green-100 text-green-600",
};

export default function OperatorNotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = typeIcons[notification.type as keyof typeof typeIcons] || IconCheck;
          const style = typeStyles[notification.type as keyof typeof typeStyles] || "bg-slate-100 text-slate-600";

          return (
            <Link
              key={notification.id}
              href={notification.link}
              className={`flex gap-4 rounded-2xl border p-4 transition-colors hover:bg-slate-50 ${
                notification.read
                  ? "border-slate-100 bg-white"
                  : "border-blue-200 bg-blue-50/50"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-semibold ${notification.read ? "text-slate-700" : "text-slate-900"}`}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-500">{notification.message}</p>
                <p className="mt-2 text-xs text-slate-400">{notification.time}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
