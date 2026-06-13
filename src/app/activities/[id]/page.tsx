import Link from "next/link";
import { notFound } from "next/navigation";
import { TouristNav } from "@/components/tourist/TouristNav";
import { IconChevronLeft } from "@/components/icons";
import { getActivityWithOperator } from "@/lib/services";
import { ActivityDetail } from "./ActivityDetail";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getActivityWithOperator(id);
  if (!result) notFound();

  const { activity, operator } = result;

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/explore"
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <IconChevronLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <ActivityDetail activity={activity} operator={operator ?? null} />
      </div>
    </div>
  );
}
