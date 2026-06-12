import { notFound } from "next/navigation";
import { TouristNav } from "@/components/tourist/TouristNav";
import { BookingConfirmation } from "@/components/tourist/BookingConfirmation";
import { getSampleConfirmation, sampleTotals } from "@/lib/sample-booking";

export default async function PreviewConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getSampleConfirmation(slug);
  if (!entry) notFound();

  const { subtotal, taxes, total } = sampleTotals(entry);

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <BookingConfirmation
        status={entry.status}
        activityTitle={entry.activity.title}
        coverImageUrl={entry.activity.coverImageUrl}
        operatorName={entry.operator.companyName}
        operatorVerified={entry.operator.isVerified}
        meetingPoint={entry.activity.locationName}
        slotDate={entry.slotDate}
        slotTime={entry.slotTime}
        groupSize={entry.groupSize}
        bookingRef={entry.bookingRef}
        qrCodeToken={entry.qrCodeToken}
        subtotal={subtotal}
        taxes={taxes}
        total={total}
        travellerName={entry.travellerName}
      />
    </div>
  );
}
