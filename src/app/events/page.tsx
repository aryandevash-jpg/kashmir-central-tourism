import Link from "next/link";
import { ImportantEventsFeed } from "@/components/tourist/ImportantEventsFeed";
import { TouristNav } from "@/components/tourist/TouristNav";
import { roleOrRedirect } from "@/lib/auth/guards";
import { getPublishedEvents } from "@/lib/services";

export default async function EventsPage() {
  await roleOrRedirect(["TOURIST", "SUPER_ADMIN"], "/events");
  const events = await getPublishedEvents();

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <div className="mx-auto max-w-3xl px-4 py-6 pb-24 sm:px-6 sm:py-8 sm:pb-28">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">Important events</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Official announcements</h1>
          </div>
          <Link
            href="/explore"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
          >
            Back
          </Link>
        </div>
        <ImportantEventsFeed events={events} />
      </div>
    </div>
  );
}
