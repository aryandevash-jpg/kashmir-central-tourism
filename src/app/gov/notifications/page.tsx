import Link from "next/link";
import { IconShield, IconCheck, IconBuilding } from "@/components/icons";

const notifications = [
  {
    id: "1",
    type: "incident",
    severity: "critical",
    title: "Critical Incident Reported",
    message: "Trekker Injury — Sonamarg Trail 4. Rescue team dispatched.",
    time: "2 hours ago",
    read: false,
    link: "/gov/incidents",
  },
  {
    id: "2",
    type: "incident",
    severity: "high",
    title: "Equipment Failure Alert",
    message: "Mechanical fault detected in Gondola Phase II cable system",
    time: "8 hours ago",
    read: false,
    link: "/gov/incidents",
  },
  {
    id: "3",
    type: "compliance",
    severity: "warning",
    title: "License Expiring Soon",
    message: "Valley View Tours license expires on Jul 1, 2025",
    time: "1 day ago",
    read: false,
    link: "/gov/compliance",
  },
  {
    id: "4",
    type: "incident",
    severity: "low",
    title: "Incident Resolved",
    message: "Minor Capsize — Dal Lake Shikara has been resolved",
    time: "2 days ago",
    read: true,
    link: "/gov/incidents",
  },
  {
    id: "5",
    type: "compliance",
    severity: "danger",
    title: "Non-Compliant Operator",
    message: "Kargil Adventure Co. license has expired",
    time: "5 days ago",
    read: true,
    link: "/gov/compliance",
  },
];

const severityStyles = {
  critical: "bg-red-100 text-red-600",
  high: "bg-slate-800 text-white",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-red-100 text-red-600",
  low: "bg-green-100 text-green-600",
};

export default function GovNotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === "critical" && !n.read).length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alerts & Notifications</h1>
          <p className="text-slate-500">
            {unreadCount > 0 ? (
              <>
                {unreadCount} unread
                {criticalCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                    {criticalCount} critical
                  </span>
                )}
              </>
            ) : (
              "All caught up!"
            )}
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
          const Icon = notification.type === "incident" ? IconShield : IconBuilding;
          const style = severityStyles[notification.severity as keyof typeof severityStyles] || "bg-slate-100 text-slate-600";

          return (
            <Link
              key={notification.id}
              href={notification.link}
              className={`flex gap-4 rounded-2xl border p-4 transition-colors hover:bg-slate-50 ${
                notification.read
                  ? "border-slate-100 bg-white"
                  : notification.severity === "critical"
                  ? "border-red-200 bg-red-50/50"
                  : "border-amber-200 bg-amber-50/50"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold ${notification.read ? "text-slate-700" : "text-slate-900"}`}>
                      {notification.title}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style}`}>
                      {notification.severity.toUpperCase()}
                    </span>
                  </div>
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
