/** Use local fallback data when Supabase returns no rows. */
export function withEmptyFallback<T>(rows: T[], mock: T[]): T[] {
  return rows.length === 0 ? mock : rows;
}
