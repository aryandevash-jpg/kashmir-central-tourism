import { redirect } from "next/navigation";
import { getOperatorByUserId } from "@/lib/services";
import { requireRole } from "@/lib/auth/session";

export default async function OperatorSettingsPage() {
  const profile = await requireRole(["OPERATOR", "SUPER_ADMIN"]);
  const operator = await getOperatorByUserId(profile.id);

  if (!operator) {
    redirect("/auth/login?portal=operator");
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-slate-900">Operator Settings</h1>
      <div className="max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs text-slate-500">Company</p>
          <p className="font-medium">{operator.companyName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">License No.</p>
          <p className="font-medium">{operator.licenseNo}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Contact</p>
          <p className="font-medium">{profile.name}</p>
          <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Verification</p>
          <p className="font-medium">{operator.isVerified ? "Verified" : "Pending approval"}</p>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
