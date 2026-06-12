import Image from "next/image";
import Link from "next/link";
import { IconCalendar, IconCheck, IconLocation, IconVerified, IconWallet } from "@/components/icons";
import type { BookingStatus } from "@/lib/types";
import { formatCurrencyDetailed, formatDateGov, formatTime } from "@/lib/utils";

const statusConfig: Record<
  BookingStatus,
  { label: string; headline: string; sub: string; badge: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    headline: "You're Going!",
    sub: "Booking confirmed — get ready for the adventure.",
    badge: "bg-green-100 text-green-700",
  },
  PENDING: {
    label: "Pending",
    headline: "Booking Received",
    sub: "Awaiting operator confirmation. You'll get a QR code once approved.",
    badge: "bg-amber-100 text-amber-700",
  },
  COMPLETED: {
    label: "Completed",
    headline: "Trip Completed",
    sub: "Hope you had a great experience in Kashmir!",
    badge: "bg-blue-100 text-blue-700",
  },
  CANCELLED: {
    label: "Cancelled",
    headline: "Booking Cancelled",
    sub: "This reservation has been cancelled.",
    badge: "bg-red-100 text-red-700",
  },
};

export interface BookingConfirmationProps {
  activityTitle: string;
  coverImageUrl: string;
  operatorName?: string;
  operatorVerified?: boolean;
  meetingPoint?: string;
  slotDate: string;
  slotTime: string;
  groupSize: number;
  bookingRef?: string;
  qrCodeToken?: string;
  subtotal?: number;
  taxes?: number;
  total?: number;
  travellerName?: string;
  status?: BookingStatus;
}

function QrCode({ token }: { token: string }) {
  const seed = token.replace(/-/g, "").slice(0, 16);
  const cells: boolean[] = [];
  for (let i = 0; i < 64; i++) {
    cells.push(parseInt(seed[i % seed.length], 16) % 2 === 0);
  }

  return (
    <div className="mx-auto grid h-48 w-48 grid-cols-8 gap-0.5 rounded-xl border-2 border-slate-200 bg-white p-3">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={filled ? "bg-slate-900" : "bg-white"}
        />
      ))}
    </div>
  );
}

export function BookingConfirmation({
  activityTitle,
  coverImageUrl,
  operatorName,
  operatorVerified,
  meetingPoint,
  slotDate,
  slotTime,
  groupSize,
  bookingRef,
  qrCodeToken = "booking-qr",
  subtotal,
  taxes,
  total,
  travellerName,
  status = "CONFIRMED",
}: BookingConfirmationProps) {
  const config = statusConfig[status];

  return (
    <div className="mx-auto max-w-lg px-6 py-12 text-center">
      <span className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}>
        {config.label}
      </span>

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white">
        <IconCheck className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900">{config.headline}</h1>
      <p className="mt-2 text-slate-500">{config.sub}</p>

      {bookingRef && (
        <p className="mt-3 text-sm font-medium text-slate-600">
          Ref: <span className="font-mono text-slate-900">{bookingRef}</span>
        </p>
      )}

      {status !== "PENDING" && (
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <QrCode token={qrCodeToken} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Show this at the meeting point
          </p>
        </div>
      )}

      {status === "PENDING" && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 p-8">
          <p className="text-sm font-medium text-amber-800">
            QR code will appear here once the operator confirms your slot.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm">
        <Image
          src={coverImageUrl}
          alt={activityTitle}
          width={64}
          height={64}
          className="rounded-xl object-cover"
        />
        <div className="flex-1">
          <p className="font-bold text-slate-900">{activityTitle}</p>
          {operatorName && (
            <div className="flex items-center gap-1 text-sm text-slate-500">
              {operatorName}
              {operatorVerified && <IconVerified className="w-4 h-4 text-blue-500" />}
            </div>
          )}
          <div className="mt-1 flex items-center gap-1.5 text-sm text-blue-600">
            <IconCalendar className="w-4 h-4" />
            {formatDateGov(slotDate)} · {formatTime(slotTime)} · {groupSize} guest
            {groupSize > 1 ? "s" : ""}
          </div>
          {travellerName && (
            <p className="mt-1 text-xs text-slate-500">Booked by {travellerName}</p>
          )}
        </div>
      </div>

      {meetingPoint && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <IconLocation className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Meeting Point</p>
            <p className="text-sm font-semibold text-slate-900">{meetingPoint}</p>
          </div>
        </div>
      )}

      {total !== undefined && (
        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 text-left text-sm shadow-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{formatCurrencyDetailed(subtotal ?? 0)}</span>
          </div>
          <div className="mt-1 flex justify-between text-slate-600">
            <span>Taxes & fees (18%)</span>
            <span>{formatCurrencyDetailed(taxes ?? 0)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
            <span>Total paid</span>
            <span>{formatCurrencyDetailed(total)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-500 py-3 font-semibold text-blue-600 hover:bg-blue-50"
        >
          <IconWallet className="w-5 h-5" />
          Add to Wallet
        </button>
        <Link
          href="/bookings"
          className="flex w-full items-center justify-center rounded-xl border-2 border-blue-500 py-3 font-semibold text-blue-600 hover:bg-blue-50"
        >
          View All Bookings
        </Link>
        <Link
          href="/explore"
          className="flex w-full items-center justify-center rounded-xl bg-blue-500 py-3 font-semibold text-white hover:bg-blue-600"
        >
          Explore More Activities
        </Link>
      </div>
    </div>
  );
}
