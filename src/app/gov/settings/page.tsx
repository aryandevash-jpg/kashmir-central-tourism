import { requireRole } from "@/lib/auth/session";

export default async function GovSettingsPage() {
  const profile = await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Department portal configuration</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Officer Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Name</label>
              <input
                readOnly
                value={profile.name}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Email</label>
              <input
                readOnly
                value={profile.email}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500">Department</label>
              <input
                readOnly
                value="J&K Tourism Department — Nodal Office"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Alert Preferences</h2>
          <div className="mt-4 space-y-3">
            {[
              "Critical incident notifications",
              "Compliance expiry alerts",
              "District activity thresholds",
              "Daily summary digest",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
              >
                <span className="text-sm text-slate-700">{label}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Session</h2>
          <p className="mt-2 text-sm text-slate-500">
            End your secure government session and return to the public homepage.
          </p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Sign out
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
