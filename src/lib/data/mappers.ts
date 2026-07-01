import { activityImageForCategory } from "@/lib/images";
import type {
  Activity,
  Booking,
  District,
  EventBanner,
  Incident,
  Operator,
  Slot,
} from "@/lib/types";
import type {
  DbActivity,
  DbBooking,
  DbDistrict,
  DbEvent,
  DbIncident,
  DbOperator,
  DbSlot,
} from "@/lib/supabase/database.types";

export function mapOperator(row: DbOperator): Operator {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    licenseNo: row.license_no,
    activityType: row.activity_type,
    district: row.district,
    licenseStatus: row.license_status,
    licenseExpiry: row.license_expiry,
    insuranceExpiry: row.insurance_expiry,
    safetyRating: Number(row.safety_rating),
    lastInspection: row.last_inspection ?? undefined,
    complianceStatus: row.compliance_status,
    experienceYears: row.experience_years,
    isVerified: row.is_verified,
  };
}

export function mapActivity(
  row: DbActivity,
  includes: string[] = [],
  rating = 0,
  reviewCount = 0
): Activity {
  return {
    id: row.id,
    operatorId: row.operator_id,
    title: row.title,
    description: row.description ?? "",
    district: row.district,
    locationName: row.location_name ?? "",
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    category: row.category,
    difficulty: row.difficulty ?? "MODERATE",
    durationMinutes: row.duration_minutes,
    coverImageUrl: activityImageForCategory(row.category, row.cover_image_url),
    basePrice: Number(row.base_price),
    isActive: row.is_active,
    includes,
    rating,
    reviewCount,
    elevation: row.elevation ?? undefined,
  };
}

export function mapSlot(row: DbSlot): Slot {
  const full = row.booked_count >= row.capacity;
  const slotDate =
    typeof row.slot_date === "string" ? row.slot_date.slice(0, 10) : String(row.slot_date);
  return {
    id: row.id,
    activityId: row.activity_id,
    slotDate,
    slotTime: row.slot_time.length > 5 ? row.slot_time.slice(0, 5) : row.slot_time,
    capacity: row.capacity,
    bookedCount: row.booked_count,
    isAvailable: row.is_available && !full,
  };
}

export function mapBooking(row: DbBooking): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    slotId: row.slot_id,
    activityId: row.activity_id,
    groupSize: row.group_size,
    subtotal: Number(row.subtotal),
    taxes: Number(row.taxes),
    total: Number(row.total),
    status: row.status,
    qrCodeToken: row.qr_code_token,
    bookedAt: row.booked_at,
    confirmedAt: row.confirmed_at ?? undefined,
  };
}

export function mapDistrict(row: DbDistrict): District {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    totalBookings: row.total_bookings,
    totalRevenue: Number(row.total_revenue),
    alertStatus: row.alert_status,
  };
}

export function mapIncident(row: DbIncident): Incident {
  const date = new Date(row.occurred_at);
  const code = `INC-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return {
    id: row.id,
    operatorId: row.operator_id,
    activityId: row.activity_id ?? undefined,
    reportedBy: row.reported_by,
    title: row.title,
    description: row.description,
    severity: row.severity,
    status: row.status,
    district: row.district,
    occurredAt: row.occurred_at,
    resolvedAt: row.resolved_at ?? undefined,
    incidentCode: code,
  };
}

export function mapEvent(row: DbEvent): EventBanner {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    district: row.district ?? undefined,
    category: row.category,
    priority: row.priority,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    isPublished: row.is_published,
    isImportant: row.is_important,
    sourceLabel: row.source_label ?? undefined,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
