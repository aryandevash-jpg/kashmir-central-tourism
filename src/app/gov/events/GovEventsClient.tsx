"use client";

import { useMemo, useState, useTransition } from "react";
import type { EventBanner, EventCategory, EventPriority } from "@/lib/types";

const categoryOptions: EventCategory[] = ["GENERAL", "SAFETY", "WEATHER", "TRAFFIC", "CULTURE"];
const priorityOptions: EventPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function toLocalDatetimeInput(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export function GovEventsClient({ initialEvents }: { initialEvents: EventBanner[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState<EventCategory>("GENERAL");
  const [priority, setPriority] = useState<EventPriority>("MEDIUM");
  const [isImportant, setIsImportant] = useState(true);
  const [isPublished, setIsPublished] = useState(true);
  const [startsAt, setStartsAt] = useState(toLocalDatetimeInput(new Date().toISOString()));
  const [endsAt, setEndsAt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const activeCount = useMemo(() => events.filter((e) => e.isPublished).length, [events]);

  async function createNewEvent() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            message,
            district: district || undefined,
            category,
            priority,
            isImportant,
            isPublished,
            startsAt: new Date(startsAt).toISOString(),
            endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
            sourceLabel: "Government official portal",
          }),
        });
        const json = (await res.json()) as { data?: EventBanner; error?: string };
        if (!res.ok || !json.data) throw new Error(json.error ?? "Unable to create event");

        setEvents((prev) => [json.data!, ...prev]);
        setTitle("");
        setMessage("");
        setDistrict("");
        setCategory("GENERAL");
        setPriority("MEDIUM");
        setIsImportant(true);
        setIsPublished(true);
        setEndsAt("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to create event");
      }
    });
  }

  async function togglePublished(event: EventBanner) {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventId: event.id,
            patch: { isPublished: !event.isPublished },
          }),
        });
        const json = (await res.json()) as { data?: EventBanner; error?: string };
        if (!res.ok || !json.data) throw new Error(json.error ?? "Unable to update event");

        setEvents((prev) => prev.map((item) => (item.id === event.id ? json.data! : item)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to update event");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Important Events Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          Publish official advisories and event banners for the tourist app.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Active published announcements: <span className="text-blue-600">{activeCount}</span>
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create new event</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="District (optional)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as EventPriority)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {priorityOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Advisory message"
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <div className="mt-3 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={isImportant} onChange={(e) => setIsImportant(e.target.checked)} />
            Mark as important
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publish immediately
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          disabled={isPending || !title.trim() || !message.trim()}
          onClick={createNewEvent}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Publish event"}
        </button>
      </section>

      <section className="space-y-3">
        {events.map((event) => (
          <article key={event.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 text-sm text-slate-600">{event.message}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePublished(event)}
                disabled={isPending}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  event.isPublished ? "bg-slate-100 text-slate-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {event.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{event.category}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{event.priority}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                {event.isPublished ? "Published" : "Draft"}
              </span>
              {event.isImportant && <span className="rounded-full bg-blue-100 px-2.5 py-1">Important</span>}
              {event.district && <span className="rounded-full bg-slate-100 px-2.5 py-1">{event.district}</span>}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
