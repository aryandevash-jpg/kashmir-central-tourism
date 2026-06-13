"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "./actions";
import type { Portal } from "@/lib/auth/roles";

const DEMO_ACCOUNTS: Record<Portal, { email: string; password: string; label: string }> = {
  tourist: {
    email: "aarav@gmail.com",
    password: "Demo@123",
    label: "Visitor (Aarav Reddy)",
  },
  operator: {
    email: "imran@himalayan.in",
    password: "Demo@123",
    label: "Vendor (Himalayan Trails Co.)",
  },
  gov: {
    email: "rajiv@jktourism.gov.in",
    password: "Demo@123",
    label: "Government (Sh. Rajiv Mehta)",
  },
};

export function LoginForm({ portal, next }: { portal: Portal; next?: string }) {
  const demo = DEMO_ACCOUNTS[portal];
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Kashmir Central Tourism Platform</p>
        </div>

        <div className="mb-6 flex gap-2">
          {(["tourist", "operator", "gov"] as const).map((p) => (
            <Link
              key={p}
              href={`/auth/login?portal=${p}${next ? `&next=${encodeURIComponent(next)}` : ""}`}
              className={`flex-1 rounded-lg px-2 py-2 text-center text-xs font-semibold capitalize ${
                portal === p
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {p === "gov" ? "Government" : p}
            </Link>
          ))}
        </div>

        <p className="mb-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
          {portal === "tourist" ? (
            <>
              Demo account: <strong>{demo.label}</strong>
            </>
          ) : (
            <>
              Vendor and government accounts are created by the Tourism Department.{" "}
              <span className="font-medium">Sign in with credentials provided to you.</span>
            </>
          )}
        </p>

        {state?.error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</div>
        )}

        <form action={formAction} className="space-y-4">
          {next && <input type="hidden" name="next" value={next} />}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              required
              defaultValue={demo.email}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              required
              defaultValue={demo.password}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {portal === "tourist" && (
          <p className="mt-4 text-center text-sm text-slate-500">
            New visitor?{" "}
            <Link
              href={`/auth/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Create an account
            </Link>
          </p>
        )}

        <Link href="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-700">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
