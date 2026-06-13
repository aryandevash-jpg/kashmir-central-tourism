"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBell,
  IconCalendar,
  IconChart,
  IconMountain,
  IconSettings,
} from "@/components/icons";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { cn } from "@/lib/utils";
import type { AuthProfile } from "@/lib/auth/session";
import type { Operator } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const baseNavItems = [
  { href: "/operator", label: "Dashboard", icon: IconChart, exact: true },
  { href: "/operator/bookings", label: "Bookings", icon: IconCalendar },
  { href: "/operator/activities", label: "Activities", icon: IconMountain },
  { href: "/operator/analytics", label: "Analytics", icon: IconChart },
  { href: "/operator/settings", label: "Settings", icon: IconSettings },
];

function buildNavItems(bookingCount: number) {
  return baseNavItems.map((item) =>
    item.href === "/operator/bookings" ? { ...item, badge: bookingCount } : item
  );
}

function SidebarNav({
  pathname,
  navItems,
}: {
  pathname: string;
  navItems: ReturnType<typeof buildNavItems>;
}) {
  return (
    <>
      {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
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
            {badge !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  active ? "bg-blue-400" : "bg-blue-100 text-blue-600",
                )}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </>
  );
}

export function OperatorLayout({
  children,
  profile,
  operator,
  bookingCount = 0,
}: {
  children: React.ReactNode;
  profile: AuthProfile;
  operator?: Operator;
  bookingCount?: number;
}) {
  const pathname = usePathname();
  const navItems = buildNavItems(bookingCount);
  const companyName = operator?.companyName ?? "Operator Console";
  const nameInitials = initials(profile.name);

  const operatorFooter = (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
        {nameInitials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{profile.name}</p>
        <p className="text-xs text-green-600">
          {operator?.isVerified ? "Verified Operator" : "Pending Verification"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <IconMountain className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold text-slate-900">{companyName}</p>
              <p className="text-xs text-slate-500">Operator Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <SidebarNav pathname={pathname} navItems={navItems} />
        </nav>

        <div className="border-t border-slate-100 p-4">{operatorFooter}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <MobileNavDrawer
              items={navItems}
              title={companyName}
              footer={operatorFooter}
            />
            <div className="flex min-w-0 items-center gap-2 lg:hidden">
              <IconMountain className="h-5 w-5 shrink-0 text-blue-500" />
              <span className="truncate font-bold text-slate-900">{companyName}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/operator/notifications"
              className="relative rounded-xl p-2 hover:bg-slate-50"
            >
              <IconBell className="h-5 w-5 text-slate-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>
            <Link
              href="/operator/activities/new"
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600 sm:px-4"
            >
              <span className="sm:hidden">+</span>
              <span className="hidden sm:inline">+ New Activity</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
