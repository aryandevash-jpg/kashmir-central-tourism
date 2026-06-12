"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IconCheck, IconChevronLeft, IconClock, IconMinus, IconPlus } from "@/components/icons";
import type { Activity, Operator, Slot } from "@/lib/types";
import {
  MAX_GROUP_SIZE,
  MIN_GROUP_SIZE,
  validateBookingInput,
} from "@/lib/validation/booking";
import {
  calcBookingTotals,
  cn,
  formatCurrencyDetailed,
  formatDateLong,
  formatDuration,
  formatTime,
} from "@/lib/utils";

interface BookSlotFormProps {
  activity: Activity;
  operator: Operator | null;
  availableDates: string[];
  initialSlots: Slot[];
}

export function BookSlotForm({
  activity,
  operator,
  availableDates,
  initialSlots,
}: BookSlotFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(availableDates[0] ?? "");
  const [selectedTime, setSelectedTime] = useState("");
  const [groupSize, setGroupSize] = useState(2);
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const slots = useMemo(
    () => initialSlots.filter((s) => s.slotDate === selectedDate),
    [initialSlots, selectedDate]
  );

  const availableSlots = slots.filter(
    (s) => s.isAvailable && s.bookedCount < s.capacity
  );

  const totals = calcBookingTotals(activity.basePrice, groupSize);

  const calendarMonth = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();

  const handleGroupSizeChange = (next: number) => {
    const clamped = Math.min(MAX_GROUP_SIZE, Math.max(MIN_GROUP_SIZE, next));
    setGroupSize(clamped);
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy.groupSize;
      return copy;
    });
  };

  const handleConfirm = async () => {
    const validation = validateBookingInput({
      activityId: activity.id,
      slotDate: selectedDate,
      slotTime: selectedTime,
      groupSize,
    });

    setFieldErrors(validation.errors);

    if (!validation.valid) {
      setError("Please fix the errors below before confirming.");
      return;
    }

    const selectedSlot = slots.find((s) => s.slotTime === selectedTime);
    if (!selectedSlot) {
      setFieldErrors((prev) => ({ ...prev, slotTime: "Selected slot is no longer available." }));
      return;
    }
    if (!selectedSlot.isAvailable || selectedSlot.bookedCount >= selectedSlot.capacity) {
      setFieldErrors((prev) => ({ ...prev, slotTime: "This slot is fully booked. Pick another time." }));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { api } = await import("@/lib/api/client");
      const data = await api.createBooking({
        activityId: activity.id,
        slotDate: selectedDate,
        slotTime: selectedTime,
        groupSize,
      });

      const qr = "qrCodeToken" in data && data.qrCodeToken ? data.qrCodeToken : data.bookingId;
      router.push(
        `/bookings/confirm?activity=${activity.id}&date=${selectedDate}&time=${selectedTime}&size=${groupSize}&booking=${data.bookingId}&qr=${qr}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (availableDates.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">No slots available</p>
        <p className="mt-2 text-slate-500">
          New dates are added regularly. Please check back soon or explore other activities.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/activities/${activity.id}/book`}
            className="rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Refresh Availability
          </Link>
          <Link
            href="/explore"
            className="rounded-xl border border-blue-500 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            Explore Other Activities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        href={`/activities/${activity.id}`}
        className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium shadow-sm"
      >
        <IconChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <h1 className="text-2xl font-bold text-slate-900">Select Your Slot</h1>
      <p className="text-slate-500">{activity.title}</p>

      {operator && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
          <Image
            src={activity.coverImageUrl}
            alt=""
            width={56}
            height={56}
            className="rounded-xl object-cover"
          />
          <div className="flex-1">
            <p className="text-xs text-slate-500">Operated by</p>
            <p className="font-bold text-slate-900">{operator.companyName}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
            <IconClock className="w-4 h-4" />
            {formatDuration(activity.durationMinutes)}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            {calendarMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMonthOffset((m) => m - 1)} className="rounded-lg bg-slate-50 px-3 py-1 text-sm hover:bg-slate-100">‹</button>
            <button type="button" onClick={() => setMonthOffset((m) => m + 1)} className="rounded-lg bg-slate-50 px-3 py-1 text-sm hover:bg-slate-100">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">{d[0]}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const hasSlots = availableDates.includes(dateStr);
            const isSelected = selectedDate === dateStr;
            const isPast = new Date(dateStr) < new Date(new Date().toDateString());

            return (
              <button
                key={day}
                type="button"
                disabled={!hasSlots || isPast}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setSelectedTime("");
                  setFieldErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.slotDate;
                    delete copy.slotTime;
                    return copy;
                  });
                }}
                className={cn(
                  "relative flex flex-col items-center rounded-xl py-2 text-sm transition-colors",
                  isSelected && "bg-blue-500 font-bold text-white",
                  !isSelected && hasSlots && !isPast && "hover:bg-blue-50 text-slate-900",
                  (!hasSlots || isPast) && "text-slate-300 cursor-not-allowed"
                )}
              >
                {day}
                {hasSlots && !isPast && !isSelected && (
                  <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
        {fieldErrors.slotDate && (
          <p className="mt-3 text-sm text-red-600">{fieldErrors.slotDate}</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Time Slot</h2>
          {selectedDate && <span className="text-sm text-slate-500">{formatDateLong(selectedDate)}</span>}
        </div>

        {!selectedDate ? (
          <p className="text-sm text-slate-500">Select a date first to see available times.</p>
        ) : availableSlots.length === 0 ? (
          <p className="text-sm text-amber-600">No time slots left on this date. Try another day.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slots.map((slot) => {
              const full = slot.bookedCount >= slot.capacity;
              const isSelected = selectedTime === slot.slotTime;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={full || !slot.isAvailable}
                  onClick={() => {
                    setSelectedTime(slot.slotTime);
                    setFieldErrors((prev) => {
                      const copy = { ...prev };
                      delete copy.slotTime;
                      return copy;
                    });
                  }}
                  className={cn(
                    "rounded-xl border py-3 text-sm font-semibold transition-colors",
                    isSelected && "border-blue-500 text-blue-600 bg-blue-50",
                    !isSelected && !full && "border-slate-200 hover:border-blue-300",
                    full && "border-slate-100 text-slate-300 line-through cursor-not-allowed"
                  )}
                >
                  {formatTime(slot.slotTime)}
                </button>
              );
            })}
          </div>
        )}
        {fieldErrors.slotTime && (
          <p className="mt-3 text-sm text-red-600">{fieldErrors.slotTime}</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">Group Size</h2>
        <p className="text-sm text-slate-500">
          Adults · {formatCurrencyDetailed(activity.basePrice)} each · max {MAX_GROUP_SIZE}
        </p>
        <div className="mt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => handleGroupSizeChange(groupSize - 1)}
            disabled={groupSize <= MIN_GROUP_SIZE}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 disabled:opacity-40"
          >
            <IconMinus />
          </button>
          <span className="text-2xl font-bold text-slate-900">{groupSize}</span>
          <button
            type="button"
            onClick={() => handleGroupSizeChange(groupSize + 1)}
            disabled={groupSize >= MAX_GROUP_SIZE}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-blue-600 hover:bg-blue-50 disabled:opacity-40"
          >
            <IconPlus />
          </button>
        </div>
        {fieldErrors.groupSize && (
          <p className="mt-3 text-right text-sm text-red-600">{fieldErrors.groupSize}</p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">{groupSize} × {activity.title}</span>
            <span className="font-medium">{formatCurrencyDetailed(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Taxes & fees (18%)</span>
            <span className="font-medium">{formatCurrencyDetailed(totals.taxes)}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-slate-500">Total</span>
          <span className="text-2xl font-bold text-slate-900">{formatCurrencyDetailed(totals.total)}</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || availableDates.length === 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-500 py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconCheck className="w-5 h-5" />
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
