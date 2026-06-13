import { notFound } from "next/navigation";
import { TouristNav } from "@/components/tourist/TouristNav";
import { BookSlotForm } from "@/components/tourist/BookSlotForm";
import {
  getActivityWithOperator,
  getSlotsForActivity,
} from "@/lib/services";

export default async function BookSlotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [result, slots] = await Promise.all([
    getActivityWithOperator(id),
    getSlotsForActivity(id),
  ]);

  if (!result) notFound();

  const { activity, operator } = result;
  const availableDates = [
    ...new Set(
      slots.filter((s) => s.isAvailable).map((s) => s.slotDate)
    ),
  ].sort();

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
