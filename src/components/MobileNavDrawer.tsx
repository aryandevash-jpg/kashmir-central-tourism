"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconMenu, IconX } from "@/components/icons";
import { cn } from "@/lib/utils";

export type MobileNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
};

export function MobileNavDrawer({
  items,
  title,
  footer,
  menuButtonClassName,
}: {
  items: MobileNavItem[];
  title: string;
  footer?: React.ReactNode;
  menuButtonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={menuButtonClassName ?? "rounded-xl p-2 hover:bg-slate-100 lg:hidden"}
        aria-label="Open menu"
      >
        <IconMenu className={cn("h-5 w-5", !menuButtonClassName && "text-slate-700")} />
      </button>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
          <p className="font-bold text-slate-900">{title}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 hover:bg-slate-50"
            aria-label="Close menu"
          >
            <IconX className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
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
        </nav>

        {footer && <div className="border-t border-slate-100 p-4">{footer}</div>}
      </aside>
    </>
  );
}
