export const MIN_GROUP_SIZE = 1;
export const MAX_GROUP_SIZE = 10;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export interface BookingInput {
  activityId: string;
  slotDate: string;
  slotTime: string;
  groupSize: number;
  userId?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

function isFutureOrToday(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split("-").map(Number);
  const selected = new Date(y, m - 1, d);
  return selected >= today;
}

export function validateBookingInput(input: Partial<BookingInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.activityId?.trim()) {
    errors.activityId = "Activity is required.";
  } else if (!UUID_REGEX.test(input.activityId.trim())) {
    errors.activityId = "Invalid activity ID.";
  }

  if (!input.slotDate?.trim()) {
    errors.slotDate = "Please select a date.";
  } else if (!isValidDate(input.slotDate)) {
    errors.slotDate = "Invalid date format.";
  } else if (!isFutureOrToday(input.slotDate)) {
    errors.slotDate = "Cannot book a date in the past.";
  }

  if (!input.slotTime?.trim()) {
    errors.slotTime = "Please select a time slot.";
  } else {
    const normalized = input.slotTime.trim().slice(0, 5);
    if (!TIME_REGEX.test(normalized) && !TIME_REGEX.test(input.slotTime.trim())) {
      errors.slotTime = "Invalid time slot.";
    }
  }

  const size =
    typeof input.groupSize === "string"
      ? parseInt(input.groupSize, 10)
      : input.groupSize;

  if (size === undefined || size === null || Number.isNaN(size)) {
    errors.groupSize = "Group size is required.";
  } else if (!Number.isInteger(size)) {
    errors.groupSize = "Group size must be a whole number.";
  } else if (size < MIN_GROUP_SIZE) {
    errors.groupSize = `Minimum ${MIN_GROUP_SIZE} guest required.`;
  } else if (size > MAX_GROUP_SIZE) {
    errors.groupSize = `Maximum ${MAX_GROUP_SIZE} guests per booking.`;
  }

  if (input.userId !== undefined && input.userId !== null && !input.userId.trim()) {
    errors.userId = "Invalid user ID.";
  } else if (input.userId?.trim() && !UUID_REGEX.test(input.userId.trim())) {
    errors.userId = "Invalid user ID format.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateConfirmParams(params: {
  activity?: string | null;
  date?: string | null;
  time?: string | null;
  size?: string | null;
}): ValidationResult {
  const size = params.size ? Number(params.size) : NaN;
  return validateBookingInput({
    activityId: params.activity ?? "",
    slotDate: params.date ?? "",
    slotTime: params.time ?? "",
    groupSize: size,
  });
}

export function firstValidationError(result: ValidationResult): string | null {
  const keys = Object.keys(result.errors);
  return keys.length > 0 ? result.errors[keys[0]] : null;
}
