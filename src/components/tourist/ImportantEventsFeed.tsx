import type { EventBanner } from "@/lib/types";

function formatEventDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const priorityStyles: Record<EventBanner["priority"], string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export function ImportantEventsFeed({ events }: { events: EventBanner[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
        No active announcements right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[event.priority]}`}>
              {event.priority}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {event.category}
            </span>
            {event.district && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {event.district}
              </span>
            )}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">{event.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{event.message}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>Starts: {formatEventDate(event.startsAt)}</span>
            {event.endsAt && <span>Ends: {formatEventDate(event.endsAt)}</span>}
          </div>
        </article>
      ))}
    </div>
  );
}
