"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBell,
  IconCalendar,
  IconChart,
  IconMountain,
  IconSettings,
  IconBuilding,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/operator", label: "Dashboard", icon: IconChart, exact: true },
  { href: "/operator/bookings", label: "Bookings", icon: IconCalendar, badge: 24 },
  { href: "/operator/activities", label: "Activities", icon: IconMountain },
  { href: "/operator/analytics", label: "Analytics", icon: IconChart },
  { href: "/operator/settings", label: "Settings", icon: IconSettings },
];

export function OperatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
              <IconMountain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Himalayan Trails</p>
              <p className="text-xs text-slate-500">Operator Console</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {label}
                </span>
                {badge && (
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", active ? "bg-blue-400" : "bg-blue-100 text-blue-600")}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              IK
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Imran Khan</p>
              <p className="text-xs text-green-600">Verified Operator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="lg:hidden flex items-center gap-2">
            <IconBuilding className="w-5 h-5 text-blue-500" />
            <span className="font-bold">Himalayan Trails</span>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <button type="button" className="rounded-xl p-2 hover:bg-slate-50">
              <IconBell className="w-5 h-5 text-slate-600" />
            </button>
            <Link
              href="/operator/activities/new"
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              + New Activity
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
