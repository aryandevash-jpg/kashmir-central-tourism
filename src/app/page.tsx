import Link from "next/link";
import { IconBuilding, IconCompass, IconMountain } from "@/components/icons";

const glassCard =
  "rounded-2xl border border-white/70 bg-white/55 shadow-[0_8px_32px_rgba(15,23,42,0.2)] ring-1 ring-white/80 backdrop-blur-xl";

const profiles = [
  {
    href: "/explore",
    title: "Tourist",
    label: "For travellers",
    subtitle: "Discover activities, book slots & manage reservations",
    cta: "Continue as Tourist",
    icon: IconCompass,
    accent: "border-t-blue-500",
    iconBg: "bg-blue-500 shadow-blue-500/30",
    hover: "hover:border-blue-300/80 hover:bg-white/70 hover:shadow-blue-900/15",
  },
  {
    href: "/operator",
    title: "Operator / Vendor",
    label: "For vendors",
    subtitle: "Manage activities, bookings & revenue",
    cta: "Continue as Operator",
    icon: IconMountain,
    accent: "border-t-emerald-500",
    iconBg: "bg-emerald-500 shadow-emerald-500/30",
    hover: "hover:border-emerald-300/80 hover:bg-white/70 hover:shadow-emerald-900/15",
  },
  {
    href: "/gov",
    title: "Government Officer",
    label: "For officials",
    subtitle: "Monitor compliance, analytics & safety",
    cta: "Continue as Officer",
    icon: IconBuilding,
    accent: "border-t-slate-700",
    iconBg: "bg-slate-800 shadow-slate-800/30",
    hover: "hover:border-slate-400/80 hover:bg-white/70 hover:shadow-slate-900/15",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full scale-105 object-cover brightness-125 saturate-110"
        aria-hidden
      >
        <source src="/videos/kashmir-himalayas.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/15 via-transparent to-slate-900/25" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 sm:px-6">
        <div className={`w-full max-w-2xl px-8 py-8 text-center ${glassCard}`}>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/30">
            <IconCompass className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Kashmir Central Tourism
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-700 sm:text-lg">
            J&K Tourism Department — Unified Digital Platform
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-5 md:grid-cols-3">
          {profiles.map(
            ({ href, title, label, subtitle, cta, icon: Icon, accent, iconBg, hover }) => (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col border-t-4 p-6 transition-all duration-300 hover:-translate-y-1 ${glassCard} ${accent} ${hover}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {label}
                </p>
                <div
                  className={`mb-4 mt-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110 ${iconBg}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{subtitle}</p>
                <p className="mt-5 text-sm font-semibold text-blue-700 group-hover:underline">
                  {cta} →
                </p>
              </Link>
            ),
          )}
        </div>

        <div className={`flex flex-col items-center gap-3 px-8 py-5 text-center ${glassCard}`}>
          <Link
            href="/platform"
            className="rounded-xl border border-white/80 bg-white/60 px-8 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-white/70 backdrop-blur-md transition-all hover:bg-white/80 hover:shadow-md"
          >
            Platform Overview →
          </Link>
          <p className="text-sm text-slate-600">
            Tourist, operator, and government portals in one system
          </p>
        </div>
      </div>
    </div>
  );
}
