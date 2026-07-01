"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconAlert,
  IconBell,
  IconChart,
  IconBuilding,
  IconShield,
  IconSettings,
  IconLock,
  IconPlus,
} from "@/components/icons";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { cn } from "@/lib/utils";
import type { AuthProfile } from "@/lib/auth/session";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const monitoringNavItems = [
  { href: "/gov", label: "Overview", icon: IconBuilding, exact: true },
  { href: "/gov/analytics", label: "Activity Analytics", icon: IconChart },
  { href: "/gov/compliance", label: "Operator Compliance", icon: IconShield },
  { href: "/gov/incidents", label: "Incident & Safety Log", icon: IconAlert },
  { href: "/gov/events", label: "Important Events", icon: IconBell },
  { href: "/gov/notifications", label: "Notifications", icon: IconBell },
];

const vendorNavItems = [
  { href: "/gov/vendors/register", label: "Register Vendor", icon: IconPlus },
  { href: "/gov/officers/register", label: "Register Officer", icon: IconBuilding },
];

const pageLabels: Record<string, string> = {
  "/gov": "Overview",
  "/gov/analytics": "Activity Analytics",
  "/gov/compliance": "Operator Compliance",
  "/gov/incidents": "Incident & Safety Log",
  "/gov/events": "Important Events",
  "/gov/notifications": "Notifications",
  "/gov/settings": "Settings",
  "/gov/vendors/register": "Register Vendor",
  "/gov/officers/register": "Register Officer",
};

function getBreadcrumb(pathname: string): string {
  if (pageLabels[pathname]) return pageLabels[pathname];
  const match = Object.keys(pageLabels)
    .filter((k) => k !== "/gov")
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));
  return match ? pageLabels[match] : "Control Center";
}

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  pathname,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  pathname: string;
}) {
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-l-4 border-blue-600 bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Monitoring & Compliance
      </p>
      {monitoringNavItems.map((item) => (
        <NavLink key={item.href} pathname={pathname} {...item} />
      ))}

      <p className="mb-3 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        User Management
      </p>
      {vendorNavItems.map((item) => (
        <NavLink key={item.href} pathname={pathname} {...item} />
      ))}
    </>
  );
}

export function GovLayout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: AuthProfile;
}) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);
  const drawerItems = [...monitoringNavItems, ...vendorNavItems];
  const nameInitials = initials(profile.name);

  const govFooter = (
    <>
      <Link
        href="/gov/settings"
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
          pathname === "/gov/settings"
            ? "bg-blue-50 font-medium text-blue-700"
            : "text-slate-600 hover:bg-slate-50",
        )}
      >
        <IconSettings className="h-5 w-5" />
        Settings
      </Link>
      <form action="/auth/signout" method="post" className="mt-1">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
        >
          <IconLock className="h-5 w-5 shrink-0" />
          Sign out
        </button>
      </form>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
        <IconLock className="h-4 w-4 shrink-0" />
        Secure Gov Session
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-slate-900 text-white">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <MobileNavDrawer
              items={drawerItems}
              title="KCT Control Center"
              footer={govFooter}
              menuButtonClassName="rounded-lg p-2 text-white hover:bg-slate-800 lg:hidden"
            />
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold sm:h-10 sm:w-10">
              KCT
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">
                <span className="sm:hidden">Kashmir Tourism</span>
                <span className="hidden sm:inline">Kashmir Central Tourism System</span>
              </p>
              <nav className="hidden truncate text-xs text-white md:block" aria-label="Breadcrumb">
                Control Center
                <span className="mx-1.5 text-white/50">/</span>
                {breadcrumb}
              </nav>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <span className="hidden text-sm text-slate-300 lg:block">FY 2024-25</span>
            <Link
              href="/gov/notifications"
              className="relative rounded-lg p-2 hover:bg-slate-800"
            >
              <IconBell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                3
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold sm:h-9 sm:w-9">
                {nameInitials}
              </div>
              <div className="hidden min-w-0 md:block">
                <p className="truncate text-sm font-medium">{profile.name}</p>
                <p className="text-xs text-slate-400">Nodal Office</p>
              </div>
            </div>
          </div>
        </div>
        <nav
          className="border-t border-slate-800 px-4 py-1.5 text-xs text-white md:hidden"
          aria-label="Breadcrumb"
        >
          Control Center
          <span className="mx-1.5 text-white/50">/</span>
          {breadcrumb}
        </nav>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <nav className="flex-1 space-y-1 p-4">
            <SidebarNav pathname={pathname} />
          </nav>
          <div className="border-t border-slate-100 p-4">{govFooter}</div>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
