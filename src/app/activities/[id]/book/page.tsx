import { notFound } from "next/navigation";
import { TouristNav } from "@/components/tourist/TouristNav";
import { BookSlotForm } from "@/components/tourist/BookSlotForm";
import {
  getActivityById,
  getAvailableDates,
  getOperatorForActivity,
  getSlotsForActivity,
} from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function BookSlotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [activity, operator, availableDates, slots] = await Promise.all([
    getActivityById(id),
    getOperatorForActivity(id),
    getAvailableDates(id),
    getSlotsForActivity(id),
  ]);

  if (!activity) notFound();

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <BookSlotForm
        activity={activity}
        operator={operator ?? null}
        availableDates={availableDates}
        initialSlots={slots}
      />
    </div>
  );
}
