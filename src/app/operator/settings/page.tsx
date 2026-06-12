import Link from "next/link";
import { DEMO_OPERATOR_ID, getOperatorById } from "@/lib/services";
import { categoryLabel } from "@/lib/utils";

export default async function OperatorSettingsPage() {
  const operator = await getOperatorById(DEMO_OPERATOR_ID);

  if (!operator) {
    return <p className="text-slate-500">Operator profile not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage your operator profile and preferences</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Company Profile</h2>
          <p className="mt-1 text-sm text-slate-500">Your registered operator details</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500">Company Name</label>
              <input
                readOnly
                value={operator.companyName}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-500">License No.</label>
                <input
                  readOnly
                  value={operator.licenseNo}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Activity Type</label>
                <input
                  readOnly
                  value={categoryLabel(operator.activityType)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-slate-500">District</label>
                <input
                  readOnly
                  value={operator.district}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Experience</label>
                <input
                  readOnly
                  value={`${operator.experienceYears} years`}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Compliance</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">License Status</p>
              <p className="font-medium text-slate-900">{operator.licenseStatus.replace("_", " ")}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Compliance</p>
              <p className="font-medium text-slate-900">{operator.complianceStatus.replace("_", " ")}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">License Expiry</p>
              <p className="font-medium text-slate-900">{operator.licenseExpiry}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Insurance Expiry</p>
              <p className="font-medium text-slate-900">{operator.insuranceExpiry}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">Notifications</h2>
          <p className="mt-1 text-sm text-slate-500">Booking and compliance alerts</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "New booking alerts", enabled: true },
              { label: "Cancellation notices", enabled: true },
              { label: "License expiry reminders", enabled: true },
              { label: "Weekly revenue summary", enabled: false },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                <input type="checkbox" defaultChecked={item.enabled} className="h-4 w-4 rounded accent-blue-500" />
              </label>
            ))}
          </div>
        </section>

        <Link href="/" className="inline-block text-sm text-slate-500 hover:text-slate-700">
          ← Switch profile
        </Link>
      </div>
    </div>
  );
}
