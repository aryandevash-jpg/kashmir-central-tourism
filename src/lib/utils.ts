export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateLong(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

/** Local calendar date as YYYY-MM-DD (avoids UTC off-by-one in IST). */
export function localDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysLocal(days: number, from = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

export function formatBookingRef(bookingId: string): string {
  const compact = bookingId.replace(/-/g, "").slice(0, 4).toUpperCase();
  const d = new Date();
  const ymd = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  return `KCT-${ymd}-${compact}`;
}

export function formatDateGov(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

export function categoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    TREKKING: "Trekking",
    GONDOLA: "Gondola",
    WATER_TOUR: "Water",
    SKIING: "Snow",
    CAMPING: "Camping",
    RAFTING: "Rafting",
    SIGHTSEEING: "Culture",
    PARAGLIDING: "Paragliding",
    MOUNTAINEERING: "Mountaineering",
  };
  return labels[cat] ?? cat;
}

export function difficultyLabel(d: string): string {
  return d.charAt(0) + d.slice(1).toLowerCase();
}

export function calcBookingTotals(basePrice: number, groupSize: number) {
  const subtotal = basePrice * groupSize;
  const taxes = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + taxes;
  return { subtotal, taxes, total };
}

export function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
