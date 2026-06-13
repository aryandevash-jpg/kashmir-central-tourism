import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";
import { IconAlert } from "@/components/icons";
import { authOrRedirect } from "@/lib/auth/guards";

export default async function ProfilePage() {
  const profile = await authOrRedirect("/profile");

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <div className="mx-auto max-w-lg px-6 py-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">{profile.name}</h1>
          <p className="text-slate-500">{profile.email}</p>
          <p className="mt-1 text-sm font-medium text-blue-600">Visitor</p>

          {profile.phone && (
            <div className="mt-8 space-y-3 text-left">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium">{profile.phone}</p>
              </div>
            </div>
          )}

          <Link
            href="/report"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
          >
            <IconAlert className="h-4 w-4" />
            Report Safety Incident
          </Link>

          <Link
            href="/report?tab=track"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
          >
            Track My Reports
          </Link>

          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
          </form>

          <Link href="/" className="mt-4 inline-block text-sm text-slate-500 hover:text-slate-700">
            ← Switch profile
          </Link>
        </div>
      </div>
    </div>
  );
}
