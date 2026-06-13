import { ACTIVITY_IMAGES } from "./images";
import type { BookingStatus } from "./types";
import { calcBookingTotals } from "./utils";

export interface SampleConfirmation {
  slug: string;
  label: string;
  description: string;
  bookingId: string;
  qrCodeToken: string;
  bookingRef: string;
  status: BookingStatus;
  activity: {
    id: string;
    title: string;
    coverImageUrl: string;
    locationName: string;
    basePrice: number;
  };
  operator: {
    companyName: string;
    isVerified: boolean;
  };
  slotDate: string;
  slotTime: string;
  groupSize: number;
  travellerName: string;
}

function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

export const SAMPLE_CONFIRMATIONS: SampleConfirmation[] = [
  {
    slug: "gondola",
    label: "Gulmarg Gondola Ride - Phase I",
    description: "Confirmed booking with QR check-in at the meeting point",
    bookingId: "00000000-0000-0000-0000-000000000030",
    qrCodeToken: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    bookingRef: "KCT-2026-0614-4821",
    status: "CONFIRMED",
    activity: {
      id: "00000000-0000-0000-0000-000000000200",
      title: "Gulmarg Gondola Ride - Phase I",
      coverImageUrl: ACTIVITY_IMAGES.gondola,
      locationName: "Gondola Base Station, Gulmarg",
      basePrice: 1500,
    },
    operator: { companyName: "Himalayan Trails Co.", isVerified: true },
    slotDate: futureDate(3),
    slotTime: "08:00",
    groupSize: 2,
    travellerName: "Aarav Reddy",
  },
  {
    slug: "shikara",
    label: "Shikara Sunrise Experience",
    description: "Pending operator approval before QR is issued",
    bookingId: "00000000-0000-0000-0000-000000000031",
    qrCodeToken: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
    bookingRef: "KCT-2026-0615-7732",
    status: "PENDING",
    activity: {
      id: "00000000-0000-0000-0000-000000000203",
      title: "Shikara Sunrise Experience",
      coverImageUrl: ACTIVITY_IMAGES.waterTour,
      locationName: "Dal Lake, Nehru Park Ghat",
      basePrice: 1200,
    },
    operator: { companyName: "Dal Lake Shikara Union", isVerified: true },
    slotDate: futureDate(5),
    slotTime: "06:30",
    groupSize: 1,
    travellerName: "Aarav Reddy",
  },
  {
    slug: "trek",
    label: "Frozen Lake Trek - Alpather",
    description: "Completed trip with full payment receipt",
    bookingId: "00000000-0000-0000-0000-000000000032",
    qrCodeToken: "c3d4e5f6-a7b8-9012-cdef-1234567890ab",
    bookingRef: "KCT-2026-0601-9104",
    status: "COMPLETED",
    activity: {
      id: "00000000-0000-0000-0000-000000000202",
      title: "Frozen Lake Trek - Alpather",
      coverImageUrl: ACTIVITY_IMAGES.trekking,
      locationName: "Sonamarg Base Camp",
      basePrice: 2500,
    },
    operator: { companyName: "Himalayan Trails Co.", isVerified: true },
    slotDate: futureDate(-7),
    slotTime: "08:00",
    groupSize: 3,
    travellerName: "Aarav Reddy",
  },
];

/** @deprecated use SAMPLE_CONFIRMATIONS[0] */
export const SAMPLE_CONFIRMATION = SAMPLE_CONFIRMATIONS[0];

export function getSampleConfirmation(slug: string): SampleConfirmation | undefined {
  return SAMPLE_CONFIRMATIONS.find((s) => s.slug === slug);
}

export function sampleTotals(sample: SampleConfirmation) {
  return calcBookingTotals(sample.activity.basePrice, sample.groupSize);
}
