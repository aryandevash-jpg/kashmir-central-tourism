import Link from "next/link";
import { IconBuilding, IconCompass, IconMountain } from "@/components/icons";

const glassCard =
  "rounded-2xl border border-white/70 bg-white/55 shadow-[0_8px_32px_rgba(15,23,42,0.2)] ring-1 ring-white/80 backdrop-blur-xl";

const profiles = [
  {
    href: "/auth/login?portal=tourist",
    signupHref: "/auth/signup",
    title: "Tourist",
    label: "For travellers",
    subtitle: "Discover activities, book slots & manage reservations",
    cta: "Sign in as Visitor",
    signupCta: "Create visitor account",
    icon: IconCompass,
    accent: "border-t-blue-500",
    iconBg: "bg-blue-500 shadow-blue-500/30",
    hover: "hover:border-blue-300/80 hover:bg-white/70 hover:shadow-blue-900/15",
  },
  {
    href: "/auth/login?portal=operator",
    title: "Operator / Vendor",
    label: "For vendors",
    subtitle: "Manage activities, bookings & revenue",
    cta: "Sign in as Vendor",
    icon: IconMountain,
    accent: "border-t-emerald-500",
    iconBg: "bg-emerald-500 shadow-emerald-500/30",
    hover: "hover:border-emerald-300/80 hover:bg-white/70 hover:shadow-emerald-900/15",
  },
  {
    href: "/auth/login?portal=gov",
    title: "Government Officer",
    label: "For officials",
    subtitle: "Monitor compliance, analytics & safety",
    cta: "Sign in as Officer",
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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12">
        <div className={`w-full max-w-2xl px-5 py-6 text-center sm:px-8 sm:py-8 ${glassCard}`}>
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
            ({
              href,
              signupHref,
              title,
              label,
              subtitle,
              cta,
              signupCta,
              icon: Icon,
              accent,
              iconBg,
              hover,
            }) => (
              <div
                key={href}
                className={`group flex flex-col border-t-4 p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${glassCard} ${accent} ${hover}`}
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
                <div className="mt-5 space-y-2">
                  <Link
                    href={href}
                    className="block text-sm font-semibold text-blue-700 group-hover:underline"
                  >
                    {cta} →
                  </Link>
                  {signupHref && signupCta && (
                    <Link href={signupHref} className="block text-sm text-slate-600 hover:text-blue-700">
                      {signupCta} →
                    </Link>
                  )}
                </div>
              </div>
            ),
          )}
        </div>

        <div className={`flex w-full max-w-4xl flex-col items-center gap-3 px-5 py-4 text-center sm:px-8 sm:py-5 ${glassCard}`}>
          <p className="text-sm text-slate-600">
            Visitors can create their own account. Vendors and government users are provisioned by the Tourism Department.
          </p>
        </div>
      </div>
    </div>
  );
}
