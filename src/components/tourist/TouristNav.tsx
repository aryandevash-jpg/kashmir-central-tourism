"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCalendar, IconCompass, IconHeart, IconUser, IconAlert } from "@/components/icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explore", label: "Explore", icon: IconCompass },
  { href: "/bookings", label: "Bookings", icon: IconCalendar },
  { href: "/saved", label: "Saved", icon: IconHeart },
  { href: "/report", label: "Report", icon: IconAlert },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export function TouristNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/explore" className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
              <IconCompass className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">Kashmir Tourism</p>
              <p className="hidden text-xs text-slate-500 sm:block">Discover & Book</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/profile"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 md:flex"
          >
            AR
          </Link>
        </div>
      </header>

      <nav className="tourist-bottom-nav fixed bottom-0 left-0 right-0 z-50 border-t border-blue-100 bg-white/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-[10px] font-medium transition-colors sm:text-xs",
                  active ? "text-blue-600" : "text-slate-500",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-blue-600")} />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
