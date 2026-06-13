"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconCalendar, IconChart, IconMountain, IconSettings } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { MobileNavItem } from "@/components/MobileNavDrawer";

const baseNavItems: Omit<MobileNavItem, "badge">[] = [
  { href: "/operator", label: "Dashboard", icon: IconChart, exact: true },
  { href: "/operator/bookings", label: "Bookings", icon: IconCalendar },
  { href: "/operator/activities", label: "Activities", icon: IconMountain },
  { href: "/operator/analytics", label: "Analytics", icon: IconChart },
  { href: "/operator/settings", label: "Settings", icon: IconSettings },
];

export function OperatorSidebarNav() {
  const pathname = usePathname();
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/operator/booking-count")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && typeof json?.data?.count === "number") {
          setBookingCount(json.data.count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {baseNavItems.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const showBadge = href === "/operator/bookings";

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5" />
              {label}
            </span>
            {showBadge && (
              <span
                className={cn(
                  "min-w-[1.25rem] rounded-full px-2 py-0.5 text-center text-xs font-semibold",
                  active ? "bg-blue-400" : "bg-blue-100 text-blue-600",
                  bookingCount === null && "animate-pulse",
                )}
              >
                {bookingCount ?? "·"}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}

export function useOperatorNavItems(): MobileNavItem[] {
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/operator/booking-count")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && typeof json?.data?.count === "number") {
          setBookingCount(json.data.count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return baseNavItems.map((item) =>
    item.href === "/operator/bookings"
      ? { ...item, badge: bookingCount ?? 0 }
      : item
  );
}
