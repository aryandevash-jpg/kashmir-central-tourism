type ApiResponse<T> = { data: T } | { error: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || "error" in json) {
    throw new Error("error" in json ? json.error : "Request failed");
  }
  return json.data;
}

export const api = {
  getActivity: (id: string) =>
    request<{ activity: import("@/lib/types").Activity; operator: import("@/lib/types").Operator | null }>(
      `/api/v1/activities/${id}`
    ),

  createBooking: (body: {
    activityId: string;
    slotDate: string;
    slotTime: string;
    groupSize: number;
    userId?: string;
  }) =>
    request<{ bookingId: string; qrCodeToken: string; total: number }>("/api/v1/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getBookings: (userId?: string) =>
    request<import("@/lib/types").Booking[]>(
      `/api/v1/bookings${userId ? `?userId=${userId}` : ""}`
    ),
};
