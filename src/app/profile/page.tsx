import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <div className="mx-auto max-w-lg px-6 py-8">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            AR
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Aarav Reddy</h1>
          <p className="text-slate-500">aarav@gmail.com</p>
          <p className="mt-1 text-sm text-blue-600 font-medium">Tourist</p>

          <div className="mt-8 space-y-3 text-left">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-medium">+91 94190 00004</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Member since</p>
              <p className="font-medium">March 2025</p>
            </div>
          </div>

          <Link href="/" className="mt-6 inline-block text-sm text-slate-500 hover:text-slate-700">
            ← Switch profile
          </Link>
        </div>
      </div>
    </div>
  );
}
