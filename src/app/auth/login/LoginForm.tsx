"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import type { UserRole } from "@/lib/types";

const DEMO_ACCOUNTS: Record<string, { email: string; password: string; label: string }> = {
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

const ROLE_REDIRECT: Record<UserRole, string> = {
  TOURIST: "/explore",
  OPERATOR: "/operator",
  GOVT_OFFICER: "/gov",
  SUPER_ADMIN: "/gov",
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portal = searchParams.get("portal") ?? "tourist";
  const next = searchParams.get("next");
  const demo = DEMO_ACCOUNTS[portal] ?? DEMO_ACCOUNTS.tourist;

  const [email, setEmail] = useState(demo.email);
  const [password, setPassword] = useState(demo.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Sign in failed");
      setLoading(false);
      return;
    }

    const role = await resolveUserRole(supabase, data.user);

    if (!role) {
      setError(
        "Account profile not found. Run seed.sql, npm run db:seed-auth, then npm run db:apply-auth (or apply auth-migration.sql + rls-policies.sql in Supabase SQL Editor)."
      );
      setLoading(false);
      return;
    }
    router.push(next && !next.startsWith("/auth") ? next : ROLE_REDIRECT[role]);
    router.refresh();
  };

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

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
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
