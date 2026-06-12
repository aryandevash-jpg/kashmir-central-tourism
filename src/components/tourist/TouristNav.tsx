"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCalendar, IconCompass, IconHeart, IconUser } from "@/components/icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explore", label: "Explore", icon: IconCompass },
  { href: "/bookings", label: "Bookings", icon: IconCalendar },
  { href: "/saved", label: "Saved", icon: IconHeart },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export function TouristNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/explore" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white">
            <IconCompass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Kashmir Tourism</p>
            <p className="text-xs text-slate-500">Discover & Book</p>
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
                  active ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          AR
        </Link>
      </div>
    </header>
  );
}
