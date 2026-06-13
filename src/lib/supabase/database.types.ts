import type {
  ActivityCategory,
  AlertStatus,
  BookingStatus,
  ComplianceResult,
  ComplianceStatus,
  DifficultyLevel,
  IncidentActionType,
  IncidentSeverity,
  IncidentStatus,
  LicenseStatus,
  UserRole,
} from "@/lib/types";

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  password_hash: string;
  created_at: string;
}

export interface DbOperator {
  id: string;
  user_id: string;
  company_name: string;
  license_no: string;
  activity_type: ActivityCategory;
  district: string;
  license_status: LicenseStatus;
  license_expiry: string;
  insurance_expiry: string;
  safety_rating: number;
  last_inspection: string | null;
  compliance_status: ComplianceStatus;
  experience_years: number;
  is_verified: boolean;
  created_at: string;
}

export interface DbActivity {
  id: string;
  operator_id: string;
  title: string;
  description: string | null;
  district: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  category: ActivityCategory;
  difficulty: DifficultyLevel | null;
  duration_minutes: number;
  cover_image_url: string | null;
  base_price: number;
  is_active: boolean;
  elevation: string | null;
  created_at: string;
}

export interface DbActivityInclude {
  id: string;
  activity_id: string;
  item_name: string;
}

export interface DbSlot {
  id: string;
  activity_id: string;
  slot_date: string;
  slot_time: string;
  capacity: number;
  booked_count: number;
  is_available: boolean;
}

export interface DbBooking {
  id: string;
  user_id: string;
  slot_id: string;
  activity_id: string;
  group_size: number;
  subtotal: number;
  taxes: number;
  total: number;
  status: BookingStatus;
  qr_code_token: string;
  booked_at: string;
  confirmed_at: string | null;
}

export interface DbReview {
  id: string;
  booking_id: string;
  user_id: string;
  activity_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface DbIncident {
  id: string;
  operator_id: string;
  activity_id: string | null;
  reported_by: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  district: string;
  occurred_at: string;
  resolved_at: string | null;
}

export interface DbDistrict {
  id: string;
  name: string;
  slug: string;
  total_bookings: number;
  total_revenue: number;
  alert_status: AlertStatus;
  synced_at: string;
}

export interface DbComplianceCheck {
  id: string;
  operator_id: string;
  inspector_id: string;
  inspection_date: string;
  score: number;
  result: ComplianceResult;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: { Row: DbUser; Insert: Partial<DbUser>; Update: Partial<DbUser> };
      operators: { Row: DbOperator; Insert: Partial<DbOperator>; Update: Partial<DbOperator> };
      activities: { Row: DbActivity; Insert: Partial<DbActivity>; Update: Partial<DbActivity> };
      activity_includes: { Row: DbActivityInclude; Insert: Partial<DbActivityInclude>; Update: Partial<DbActivityInclude> };
      slots: { Row: DbSlot; Insert: Partial<DbSlot>; Update: Partial<DbSlot> };
      bookings: { Row: DbBooking; Insert: Partial<DbBooking>; Update: Partial<DbBooking> };
      reviews: { Row: DbReview; Insert: Partial<DbReview>; Update: Partial<DbReview> };
      incidents: { Row: DbIncident; Insert: Partial<DbIncident>; Update: Partial<DbIncident> };
      districts: { Row: DbDistrict; Insert: Partial<DbDistrict>; Update: Partial<DbDistrict> };
      compliance_checks: { Row: DbComplianceCheck; Insert: Partial<DbComplianceCheck>; Update: Partial<DbComplianceCheck> };
    };
  };
}
