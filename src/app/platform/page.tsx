import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";
import { SAMPLE_CONFIRMATIONS } from "@/lib/sample-booking";

const touristFlows = [
  {
    title: "Explore Activities",
    description: "Browse curated Kashmir experiences with filters and ratings",
    href: "/explore",
    tag: "Tourist",
  },
  {
    title: "Book a Slot",
    description: "Calendar picker, time slots, group size, and live pricing",
    href: "/activities/00000000-0000-0000-0000-000000000020/book",
    tag: "Booking",
  },
  {
    title: "My Bookings",
    description: "Confirmed, pending, and completed reservations",
    href: "/bookings",
    tag: "Tourist",
  },
];

const operatorFlows = [
  { title: "Operator Dashboard", description: "KPIs, revenue chart, recent bookings", href: "/operator", tag: "Operator" },
  { title: "Manage Bookings", description: "Full reservation table with status", href: "/operator/bookings", tag: "Operator" },
  { title: "Analytics", description: "Revenue trends and performance", href: "/operator/analytics", tag: "Operator" },
];

const govFlows = [
  { title: "Gov Overview", description: "District alerts and tourism metrics", href: "/gov", tag: "Government" },
  { title: "Compliance", description: "Operator license and inspection status", href: "/gov/compliance", tag: "Government" },
  { title: "Incidents", description: "Safety reports and escalation workflow", href: "/gov/incidents", tag: "Government" },
];

function FlowCard({
  title,
  description,
  href,
  tag,
}: {
  title: string;
  description: string;
  href: string;
  tag: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
        {tag}
      </span>
      <h3 className="mt-3 font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <p className="mt-3 text-sm font-semibold text-blue-600">Open →</p>
    </Link>
  );
}

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">
          ← Back to portals
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Platform Overview</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Kashmir Central Tourism unifies discovery, booking, operator management, and government
          oversight in one digital platform for J&K.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Booking confirmations</h2>
          <p className="mt-1 text-sm text-slate-500">
            Confirmed, pending, and completed booking states with QR check-in.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {SAMPLE_CONFIRMATIONS.map((entry) => (
              <Link
                key={entry.slug}
                href={`/bookings/confirm/preview/${entry.slug}`}
                className="rounded-2xl border-2 border-blue-100 bg-white p-5 shadow-sm hover:border-blue-300"
              >
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    entry.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : entry.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {entry.status}
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{entry.label}</h3>
                <p className="mt-1 text-sm text-slate-500">{entry.description}</p>
                <p className="mt-3 text-sm font-semibold text-blue-600">View →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Tourist journey</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {touristFlows.map((flow) => (
              <FlowCard key={flow.href} {...flow} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Operator console</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {operatorFlows.map((flow) => (
              <FlowCard key={flow.href} {...flow} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Government portal</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {govFlows.map((flow) => (
              <FlowCard key={flow.href} {...flow} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
