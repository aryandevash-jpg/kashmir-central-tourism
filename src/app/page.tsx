import Link from "next/link";
import { IconBuilding, IconCompass, IconMountain } from "@/components/icons";

const profiles = [
  {
    href: "/explore",
    title: "Tourist",
    subtitle: "Discover activities, book slots & manage reservations",
    icon: IconCompass,
    color: "bg-blue-500",
    hover: "hover:border-blue-300 hover:shadow-blue-100",
  },
  {
    href: "/operator",
    title: "Operator / Vendor",
    subtitle: "Manage activities, bookings & revenue",
    icon: IconMountain,
    color: "bg-emerald-500",
    hover: "hover:border-emerald-300 hover:shadow-emerald-100",
  },
  {
    href: "/gov",
    title: "Government Officer",
    subtitle: "Monitor compliance, analytics & safety",
    icon: IconBuilding,
    color: "bg-slate-800",
    hover: "hover:border-slate-400 hover:shadow-slate-200",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
          <IconCompass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Kashmir Central Tourism
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          J&K Tourism Department — Unified Digital Platform
        </p>
      </div>

      <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
        {profiles.map(({ href, title, subtitle, icon: Icon, color, hover }) => (
          <Link
            key={href}
            href={href}
            className={`group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg ${hover}`}
          >
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white transition-transform group-hover:scale-110`}>
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
            <p className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
              Enter portal →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <Link
          href="/platform"
          className="rounded-xl border-2 border-blue-500 bg-white px-8 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
        >
          Platform Overview →
        </Link>
        <p className="text-sm text-slate-400">
          Tourist, operator, and government portals in one system
        </p>
      </div>
    </div>
  );
}
