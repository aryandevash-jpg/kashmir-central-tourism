import { ACTIVITY_IMAGES } from "./images";
import type {
  Activity,
  Booking,
  District,
  Incident,
  IncidentAction,
  Operator,
  Slot,
  User,
} from "./types";

export const users: User[] = [
  { id: "00000000-0000-0000-0000-000000000001", name: "Rajiv Mehta", email: "rajiv@jktourism.gov.in", phone: "9419000001", role: "GOVT_OFFICER" },
  { id: "00000000-0000-0000-0000-000000000002", name: "Imran Khan", email: "imran@himalayan.in", phone: "9419000002", role: "OPERATOR" },
  { id: "00000000-0000-0000-0000-000000000003", name: "Sara Wani", email: "sara@dallake.in", phone: "9419000003", role: "OPERATOR" },
  { id: "00000000-0000-0000-0000-000000000004", name: "Aarav Reddy", email: "aarav@gmail.com", phone: "9419000004", role: "TOURIST" },
];

export const operators: Operator[] = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    userId: "00000000-0000-0000-0000-000000000002",
    companyName: "Himalayan Trails Co.",
    licenseNo: "JK-OP-2291",
    activityType: "GONDOLA",
    district: "Baramulla",
    licenseStatus: "VALID",
    licenseExpiry: "2026-08-12",
    insuranceExpiry: "2025-08-12",
    safetyRating: 4.8,
    lastInspection: "2025-03-02",
    complianceStatus: "COMPLIANT",
    experienceYears: 7,
    isVerified: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    userId: "00000000-0000-0000-0000-000000000003",
    companyName: "Dal Lake Shikara Union",
    licenseNo: "JK-OP-1182",
    activityType: "WATER_TOUR",
    district: "Srinagar",
    licenseStatus: "VALID",
    licenseExpiry: "2026-03-28",
    insuranceExpiry: "2025-03-28",
    safetyRating: 4.5,
    lastInspection: "2025-02-14",
    complianceStatus: "COMPLIANT",
    experienceYears: 5,
    isVerified: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    userId: "00000000-0000-0000-0000-000000000003",
    companyName: "Alpine Expeditions Pvt Ltd.",
    licenseNo: "JK-OP-3340",
    activityType: "TREKKING",
    district: "Ganderbal",
    licenseStatus: "VALID",
    licenseExpiry: "2026-01-15",
    insuranceExpiry: "2025-06-20",
    safetyRating: 4.6,
    lastInspection: "2025-01-28",
    complianceStatus: "AT_RISK",
    experienceYears: 9,
    isVerified: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    userId: "00000000-0000-0000-0000-000000000002",
    companyName: "Valley View Tours",
    licenseNo: "JK-OP-4412",
    activityType: "SIGHTSEEING",
    district: "Anantnag",
    licenseStatus: "EXPIRING_SOON",
    licenseExpiry: "2025-07-01",
    insuranceExpiry: "2025-04-10",
    safetyRating: 4.2,
    lastInspection: "2024-11-05",
    complianceStatus: "AT_RISK",
    experienceYears: 4,
    isVerified: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    userId: "00000000-0000-0000-0000-000000000003",
    companyName: "Kargil Adventure Co.",
    licenseNo: "JK-OP-5501",
    activityType: "RAFTING",
    district: "Kargil",
    licenseStatus: "EXPIRED",
    licenseExpiry: "2024-12-01",
    insuranceExpiry: "2024-10-15",
    safetyRating: 3.1,
    complianceStatus: "NON_COMPLIANT",
    experienceYears: 2,
    isVerified: false,
  },
];

export const activities: Activity[] = [
  {
    id: "00000000-0000-0000-0000-000000000020",
    operatorId: "00000000-0000-0000-0000-000000000010",
    title: "Gulmarg Gondola Ride",
    description:
      "Glide above the snow-draped meadows of Gulmarg on Asia's highest cable car. Experience breathtaking panoramic views of the Pir Panjal range from Phase I and II stations.",
    district: "Baramulla",
    locationName: "Gondola Base Station, Gulmarg",
    latitude: 34.0484,
    longitude: 74.3805,
    category: "GONDOLA",
    difficulty: "MODERATE",
    durationMinutes: 240,
    coverImageUrl: ACTIVITY_IMAGES.gondola,
    basePrice: 1800,
    isActive: true,
    includes: ["Guide", "Gear", "Lunch", "Transport"],
    rating: 4.8,
    reviewCount: 312,
  },
  {
    id: "00000000-0000-0000-0000-000000000021",
    operatorId: "00000000-0000-0000-0000-000000000010",
    title: "Frozen Lake Trek",
    description:
      "Trek through alpine meadows to a frozen glacial lake at 3,800m. A challenging high-altitude adventure through pristine Himalayan wilderness.",
    district: "Ganderbal",
    locationName: "Sonamarg Base Camp",
    latitude: 34.3027,
    longitude: 75.2892,
    category: "TREKKING",
    difficulty: "HARD",
    durationMinutes: 480,
    coverImageUrl: ACTIVITY_IMAGES.trekking,
    basePrice: 1800,
    isActive: true,
    includes: ["Guide", "Gear"],
    rating: 4.9,
    reviewCount: 218,
    elevation: "2,740m",
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    operatorId: "00000000-0000-0000-0000-000000000011",
    title: "Shikara at Sunrise",
    description:
      "Drift across the mirror-calm Dal Lake at dawn. Watch the first light paint the Zabarwan mountains while floating through lotus gardens and floating markets.",
    district: "Srinagar",
    locationName: "Dal Lake, Nehru Park Ghat",
    latitude: 34.09,
    longitude: 74.82,
    category: "WATER_TOUR",
    difficulty: "EASY",
    durationMinutes: 90,
    coverImageUrl: ACTIVITY_IMAGES.waterTour,
    basePrice: 950,
    isActive: true,
    includes: ["Guide"],
    rating: 4.7,
    reviewCount: 156,
  },
];

function generateSlots(): Slot[] {
  const slots: Slot[] = [];
  const activityIds = activities.map((a) => a.id);
  const times = ["08:00", "10:30", "13:00", "15:30"];
  let id = 1;

  for (const activityId of activityIds) {
    const activityIndex = activityIds.indexOf(activityId);
    for (let day = 1; day <= 21; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const slotDate = date.toISOString().split("T")[0];

      for (const slotTime of times) {
        const isDemoFull = slotTime === "13:00" && day % 7 === 0;
        const bookedCount = isDemoFull ? 20 : ((day + activityIndex) % 4) + 2;
        slots.push({
          id: `slot-${id++}`,
          activityId,
          slotDate,
          slotTime,
          capacity: 20,
          bookedCount,
          isAvailable: !isDemoFull,
        });
      }
    }
  }
  return slots;
}

export const slots = generateSlots();

function futureIso(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString();
}

export const bookings: Booking[] = [
  {
    id: "00000000-0000-0000-0000-000000000030",
    userId: "00000000-0000-0000-0000-000000000004",
    slotId: "slot-1",
    activityId: "00000000-0000-0000-0000-000000000020",
    groupSize: 2,
    subtotal: 3600,
    taxes: 648,
    total: 4248,
    status: "CONFIRMED",
    qrCodeToken: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    bookedAt: futureIso(-3),
    confirmedAt: futureIso(-3),
  },
  {
    id: "00000000-0000-0000-0000-000000000031",
    userId: "00000000-0000-0000-0000-000000000004",
    slotId: "slot-49",
    activityId: "00000000-0000-0000-0000-000000000022",
    groupSize: 1,
    subtotal: 950,
    taxes: 171,
    total: 1121,
    status: "PENDING",
    qrCodeToken: "b2c3d4e5-f6a7-8901-bcde-f1234567890a",
    bookedAt: futureIso(-1),
  },
  {
    id: "00000000-0000-0000-0000-000000000032",
    userId: "00000000-0000-0000-0000-000000000004",
    slotId: "slot-25",
    activityId: "00000000-0000-0000-0000-000000000021",
    groupSize: 3,
    subtotal: 5400,
    taxes: 972,
    total: 6372,
    status: "COMPLETED",
    qrCodeToken: "c3d4e5f6-a7b8-9012-cdef-1234567890ab",
    bookedAt: futureIso(-14),
    confirmedAt: futureIso(-14),
  },
];

export const operatorBookings = [
  { id: "ob-1", traveller: "Aarav Reddy", guests: 2, activity: "Gulmarg Gondola Ride", date: "2025-03-12", amount: 4248, status: "CONFIRMED" as const },
  { id: "ob-2", traveller: "Priya Sharma", guests: 4, activity: "Frozen Lake Trek", date: "2025-03-14", amount: 8496, status: "CONFIRMED" as const },
  { id: "ob-3", traveller: "Rohan Mehta", guests: 1, activity: "Shikara at Sunrise", date: "2025-03-15", amount: 1121, status: "PENDING" as const },
  { id: "ob-4", traveller: "Neha Kapoor", guests: 3, activity: "Gulmarg Gondola Ride", date: "2025-03-16", amount: 6372, status: "CANCELLED" as const },
  { id: "ob-5", traveller: "Vikram Singh", guests: 2, activity: "Frozen Lake Trek", date: "2025-03-18", amount: 4248, status: "CONFIRMED" as const },
];

export const districts: District[] = [
  { id: "d1", name: "Srinagar", slug: "srinagar", totalBookings: 8420, totalRevenue: 11000000, alertStatus: "ACTIVE" },
  { id: "d2", name: "Gulmarg", slug: "gulmarg", totalBookings: 6180, totalRevenue: 9000000, alertStatus: "ACTIVE" },
  { id: "d3", name: "Pahalgam", slug: "pahalgam", totalBookings: 3940, totalRevenue: 5000000, alertStatus: "MODERATE" },
  { id: "d4", name: "Sonamarg", slug: "sonamarg", totalBookings: 2100, totalRevenue: 3200000, alertStatus: "MODERATE" },
  { id: "d5", name: "Kargil", slug: "kargil", totalBookings: 1340, totalRevenue: 2000000, alertStatus: "ALERT" },
  { id: "d6", name: "Anantnag", slug: "anantnag", totalBookings: 2890, totalRevenue: 3800000, alertStatus: "ACTIVE" },
];

export const incidents: Incident[] = [
  {
    id: "inc-001",
    operatorId: "00000000-0000-0000-0000-000000000012",
    activityId: "00000000-0000-0000-0000-000000000021",
    reportedBy: "00000000-0000-0000-0000-000000000001",
    title: "Trekker Injury — Sonamarg Trail 4",
    description:
      "Solo trekker sustained ankle fracture on Trail 4 near Thajiwas Glacier. Rescue team dispatched at 14:05 IST. Victim evacuated via helicopter to SKIMS Srinagar. Trail segment temporarily closed pending safety review.",
    severity: "CRITICAL",
    status: "OPEN",
    district: "Ganderbal",
    occurredAt: "2025-06-11T13:58:00Z",
    incidentCode: "INC-2025-0612",
  },
  {
    id: "inc-002",
    operatorId: "00000000-0000-0000-0000-000000000010",
    activityId: "00000000-0000-0000-0000-000000000020",
    reportedBy: "00000000-0000-0000-0000-000000000002",
    title: "Equipment Failure — Gondola Phase II",
    description: "Mechanical fault detected in Phase II cable system during routine inspection. Operations suspended pending engineer review.",
    severity: "HIGH",
    status: "UNDER_REVIEW",
    district: "Baramulla",
    occurredAt: "2025-06-10T09:30:00Z",
    incidentCode: "INC-2025-0610",
  },
  {
    id: "inc-003",
    operatorId: "00000000-0000-0000-0000-000000000013",
    reportedBy: "00000000-0000-0000-0000-000000000001",
    title: "Overcrowding — Pahalgam Valley Point",
    description: "Excessive tourist density at Betaab Valley viewpoint exceeded safe capacity limits during peak hours.",
    severity: "HIGH",
    status: "UNDER_REVIEW",
    district: "Anantnag",
    occurredAt: "2025-06-09T11:00:00Z",
    incidentCode: "INC-2025-0609",
  },
  {
    id: "inc-004",
    operatorId: "00000000-0000-0000-0000-000000000011",
    activityId: "00000000-0000-0000-0000-000000000022",
    reportedBy: "00000000-0000-0000-0000-000000000004",
    title: "Minor Capsize — Dal Lake Shikara",
    description: "Shikara tipped during sudden wind gust. All passengers rescued safely with no injuries reported.",
    severity: "LOW",
    status: "RESOLVED",
    district: "Srinagar",
    occurredAt: "2025-06-05T16:20:00Z",
    resolvedAt: "2025-06-06T10:00:00Z",
    incidentCode: "INC-2025-0605",
  },
];

export const incidentActions: IncidentAction[] = [
  { id: "ia-1", incidentId: "inc-001", actorId: "00000000-0000-0000-0000-000000000001", actionType: "REPORTED", actedAt: "2025-06-11T13:58:00Z" },
  { id: "ia-2", incidentId: "inc-001", actorId: "00000000-0000-0000-0000-000000000001", actionType: "REVIEWED", note: "Rescue team dispatched", actedAt: "2025-06-11T14:05:00Z" },
];

export const analyticsData = {
  months: ["Jan", "Feb", "Mar"],
  categories: [
    { name: "Gondola", color: "#3b82f6", data: [420, 580, 720] },
    { name: "Shikara", color: "#06b6d4", data: [310, 390, 450] },
    { name: "Water Sports", color: "#8b5cf6", data: [180, 220, 280] },
    { name: "Cultural", color: "#f59e0b", data: [150, 170, 200] },
    { name: "Trekking", color: "#10b981", data: [280, 340, 410] },
  ],
  topActivities: [
    { rank: 1, name: "Gulmarg Gondola Ride", district: "Baramulla", category: "GONDOLA", bookings: 4820, revenue: 8676000, rating: 4.92, momChange: 12.4 },
    { rank: 2, name: "Shikara at Sunrise", district: "Srinagar", category: "WATER_TOUR", bookings: 3210, revenue: 3049500, rating: 4.78, momChange: 8.1 },
    { rank: 3, name: "Frozen Lake Trek", district: "Ganderbal", category: "TREKKING", bookings: 2180, revenue: 3924000, rating: 4.85, momChange: 15.2 },
    { rank: 4, name: "Pahalgam Valley Tour", district: "Anantnag", category: "SIGHTSEEING", bookings: 1940, revenue: 1552000, rating: 4.55, momChange: -2.3 },
    { rank: 5, name: "Betaab Valley Hike", district: "Anantnag", category: "TREKKING", bookings: 1680, revenue: 2520000, rating: 4.62, momChange: 5.7 },
  ],
};

export const operatorRevenue = [
  { month: "Jan", value: 520000 },
  { month: "Feb", value: 610000 },
  { month: "Mar", value: 580000 },
  { month: "Apr", value: 720000 },
  { month: "May", value: 780000 },
  { month: "Jun", value: 842500 },
];

export function getActivityById(id: string) {
  return activities.find((a) => a.id === id);
}

export function getOperatorById(id: string) {
  return operators.find((o) => o.id === id);
}

export function getOperatorForActivity(activityId: string) {
  const activity = getActivityById(activityId);
  if (!activity) return undefined;
  return getOperatorById(activity.operatorId);
}

export function getSlotsForActivity(activityId: string, date?: string) {
  return slots.filter((s) => s.activityId === activityId && (!date || s.slotDate === date));
}

export function getAvailableDates(activityId: string) {
  const activitySlots = slots.filter((s) => s.activityId === activityId && s.isAvailable);
  return [...new Set(activitySlots.map((s) => s.slotDate))].sort();
}
