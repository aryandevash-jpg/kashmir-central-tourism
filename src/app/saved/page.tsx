import Link from "next/link";
import { TouristNav } from "@/components/tourist/TouristNav";
import { IconHeart } from "@/components/icons";

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <IconHeart className="mx-auto w-12 h-12 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Saved Activities</h1>
        <p className="mt-2 text-slate-500">Activities you bookmark will appear here.</p>
        <Link
          href="/explore"
          className="mt-6 inline-flex rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white"
        >
          Start Exploring
        </Link>
      </div>
    </div>
  );
}
