"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBell,
  IconChart,
  IconBuilding,
  IconShield,
  IconSettings,
  IconLock,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/gov", label: "Overview", icon: IconBuilding, exact: true },
  { href: "/gov/analytics", label: "Activity Analytics", icon: IconChart },
  { href: "/gov/compliance", label: "Operator Compliance", icon: IconShield },
  { href: "/gov/incidents", label: "Incident & Safety Log", icon: IconShield },
];

export function GovLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const now = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-slate-900 text-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
              KCT
            </div>
            <div>
              <p className="text-sm font-semibold">Kashmir Central Tourism System</p>
              <p className="text-xs text-slate-400">J&K Tourism Department — Government of India</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden text-sm text-slate-300 md:block">{now}</span>
            <button type="button" className="relative rounded-lg p-2 hover:bg-slate-800">
              <IconBell className="w-5 h-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
                3
              </span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
                RM
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Sh. Rajiv Mehta, IAS</p>
                <p className="text-xs text-slate-400">Nodal Office</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <nav className="flex-1 space-y-1 p-4">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Control Center
            </p>
            {navItems.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "border-l-4 border-blue-600 bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-slate-100 p-4">
            <Link
              href="/gov/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <IconSettings className="w-5 h-5" />
              Settings
            </Link>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <IconLock className="w-4 h-4" />
              Secure Gov Session
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
