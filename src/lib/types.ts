export type UserRole = "TOURIST" | "OPERATOR" | "GOVT_OFFICER" | "SUPER_ADMIN";
export type ActivityCategory =
  | "TREKKING"
  | "GONDOLA"
  | "WATER_TOUR"
  | "SKIING"
  | "CAMPING"
  | "RAFTING"
  | "SIGHTSEEING"
  | "PARAGLIDING"
  | "MOUNTAINEERING";
export type DifficultyLevel = "EASY" | "MODERATE" | "HARD";
export type LicenseStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED";
export type ComplianceStatus = "COMPLIANT" | "AT_RISK" | "NON_COMPLIANT";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type IncidentSeverity = "LOW" | "HIGH" | "CRITICAL";
export type IncidentStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";
export type IncidentActionType = "REPORTED" | "ESCALATED" | "REVIEWED" | "RESOLVED";
export type EventCategory = "GENERAL" | "SAFETY" | "WEATHER" | "TRAFFIC" | "CULTURE";
export type EventPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AlertStatus = "ACTIVE" | "MODERATE" | "ALERT";
export type ComplianceResult = "PASS" | "FAIL" | "CONDITIONAL";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface Operator {
  id: string;
  userId: string;
  companyName: string;
  licenseNo: string;
  activityType: ActivityCategory;
  district: string;
  licenseStatus: LicenseStatus;
  licenseExpiry: string;
  insuranceExpiry: string;
  safetyRating: number;
  lastInspection?: string;
  complianceStatus: ComplianceStatus;
  experienceYears: number;
  isVerified: boolean;
}

export interface Activity {
  id: string;
  operatorId: string;
  title: string;
  description: string;
  district: string;
  locationName: string;
  latitude?: number;
  longitude?: number;
  category: ActivityCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  coverImageUrl: string;
  basePrice: number;
  isActive: boolean;
  includes: string[];
  rating: number;
  reviewCount: number;
  elevation?: string;
}

export interface Slot {
  id: string;
  activityId: string;
  slotDate: string;
  slotTime: string;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  activityId: string;
  groupSize: number;
  subtotal: number;
  taxes: number;
  total: number;
  status: BookingStatus;
  qrCodeToken: string;
  bookedAt: string;
  confirmedAt?: string;
}

export interface District {
  id: string;
  name: string;
  slug: string;
  totalBookings: number;
  totalRevenue: number;
  alertStatus: AlertStatus;
}

export interface Incident {
  id: string;
  operatorId: string;
  activityId?: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  district: string;
  occurredAt: string;
  resolvedAt?: string;
  incidentCode: string;
}

export interface IncidentAction {
  id: string;
  incidentId: string;
  actorId: string;
  actionType: IncidentActionType;
  note?: string;
  actedAt: string;
}

export interface EventBanner {
  id: string;
  title: string;
  message: string;
  district?: string;
  category: EventCategory;
  priority: EventPriority;
  startsAt: string;
  endsAt?: string;
  isPublished: boolean;
  isImportant: boolean;
  sourceLabel?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
