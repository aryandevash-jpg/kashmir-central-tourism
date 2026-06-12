"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TouristNav } from "@/components/tourist/TouristNav";
import { BookingConfirmation } from "@/components/tourist/BookingConfirmation";
import type { Activity, Operator } from "@/lib/types";
import { validateConfirmParams } from "@/lib/validation/booking";
import { calcBookingTotals, formatBookingRef } from "@/lib/utils";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity") ?? "";
  const date = searchParams.get("date") ?? "";
  const time = searchParams.get("time") ?? "";
  const size = searchParams.get("size") ?? "";
  const bookingRef = searchParams.get("booking") ?? undefined;
  const qrToken = searchParams.get("qr") ?? bookingRef;

  const validation = validateConfirmParams({ activity: activityId, date, time, size });
  const groupSize = Number(size) || 1;

  const [activity, setActivity] = useState<Activity | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!validation.valid || !activityId) {
      setLoading(false);
      return;
    }
    import("@/lib/api/client")
      .then(({ api }) => api.getActivity(activityId))
      .then((data) => {
        setActivity(data.activity ?? null);
        setOperator(data.operator ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activityId, validation.valid]);

  if (!validation.valid) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">Invalid booking details</p>
        <ul className="mt-4 space-y-1 text-sm text-red-600">
          {Object.values(validation.errors).map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
        <Link
          href="/explore"
          className="mt-8 inline-flex rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Explore Activities
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="p-8 text-center text-slate-500">Loading confirmation...</p>;
  }

  if (!activity) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">Activity not found</p>
        <Link href="/explore" className="mt-6 inline-block text-sm text-blue-600 hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const totals = calcBookingTotals(activity.basePrice, groupSize);

  return (
    <BookingConfirmation
      status="CONFIRMED"
      activityTitle={activity.title}
      coverImageUrl={activity.coverImageUrl}
      operatorName={operator?.companyName}
      operatorVerified={operator?.isVerified}
      meetingPoint={activity.locationName}
      slotDate={date}
      slotTime={time}
      groupSize={groupSize}
      bookingRef={bookingRef ? formatBookingRef(bookingRef) : undefined}
      qrCodeToken={qrToken}
      subtotal={totals.subtotal}
      taxes={totals.taxes}
      total={totals.total}
      travellerName="Aarav Reddy"
    />
  );
}

export default function BookingConfirmPage() {
  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
