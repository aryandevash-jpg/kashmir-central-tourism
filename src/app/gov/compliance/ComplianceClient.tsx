"use client";

import { useState } from "react";
import { IconDownload, IconSearch, IconStar } from "@/components/icons";
import { useToast } from "@/components/Toast";
import { categoryLabel } from "@/lib/utils";
import type { Operator } from "@/lib/types";

const licenseStyles: Record<string, string> = {
  VALID: "bg-green-100 text-green-700",
  EXPIRING_SOON: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-red-100 text-red-700",
};

interface ComplianceClientProps {
  operators: Operator[];
}

export function ComplianceClient({ operators }: ComplianceClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast, ToastContainer } = useToast();

  const districts = [...new Set(operators.map((op) => op.district))];

  const filteredOperators = operators.filter((op) => {
    const matchesSearch =
      op.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      op.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === "all" || op.district === selectedDistrict;
    const matchesStatus = selectedStatus === "all" || op.licenseStatus === selectedStatus;
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleExportReport = () => {
    showToast("Generating compliance report...", "info");
    setTimeout(() => {
      showToast("Compliance report downloaded successfully", "success");
    }, 1500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    showToast(`Showing page ${page}`, "info");
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operator Compliance Registry</h1>
          <p className="text-slate-500">License, insurance & safety inspection records across J&K</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search operator, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="VALID">Valid</option>
            <option value="EXPIRING_SOON">Expiring Soon</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <IconDownload className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="space-y-3 sm:hidden">
        {filteredOperators.length === 0 ? (
          <p className="py-8 text-center text-slate-500">No operators match your filters</p>
        ) : (
          filteredOperators.map((op) => (
            <div key={op.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {op.isVerified && <span className="text-green-500 text-sm">✓</span>}
                    <p className="truncate font-semibold text-slate-900">{op.companyName}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {op.district} · {categoryLabel(op.activityType)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${licenseStyles[op.licenseStatus]}`}
                >
                  {op.licenseStatus.replace("_", " ")}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <IconStar className="h-3 w-3 text-amber-400" filled />
                  {op.safetyRating}/5
                </span>
                <span className={op.licenseStatus === "EXPIRED" ? "text-red-600 font-medium" : ""}>
                  Ins: {op.insuranceExpiry}
                </span>
                <span>Insp: {op.lastInspection ?? "—"}</span>
              </div>
            </div>
          ))
        )}
        <div className="flex flex-col gap-3 py-4 text-sm text-slate-500">
          <span>Showing 1–{filteredOperators.length} of 1,847 operators</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`rounded-lg px-3 py-1.5 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= 3}
              className="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Desktop table layout */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:block">
        {filteredOperators.length === 0 ? (
          <p className="py-12 text-center text-slate-500">No operators match your filters</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase text-slate-400">
                <th className="px-4 py-4 lg:px-6">Operator Name</th>
                <th className="px-4 py-4 lg:px-6">District</th>
                <th className="px-4 py-4 lg:px-6">Activity Type</th>
                <th className="px-4 py-4 lg:px-6">License Status</th>
                <th className="px-4 py-4 lg:px-6">Insurance Expiry</th>
                <th className="px-4 py-4 lg:px-6">Safety Rating</th>
                <th className="px-4 py-4 lg:px-6">Last Inspection</th>
              </tr>
            </thead>
            <tbody>
              {filteredOperators.map((op) => (
                <tr key={op.id} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-4 lg:px-6">
                    <div className="flex items-center gap-2">
                      {op.isVerified && <span className="text-green-500">✓</span>}
                      <span className="font-medium">{op.companyName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 lg:px-6">{op.district}</td>
                  <td className="px-4 py-4 text-slate-600 lg:px-6">{categoryLabel(op.activityType)}</td>
                  <td className="px-4 py-4 lg:px-6">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${licenseStyles[op.licenseStatus]}`}
                    >
                      {op.licenseStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-4 lg:px-6 ${op.licenseStatus === "EXPIRED" ? "text-red-600 font-medium" : "text-slate-600"}`}
                  >
                    {op.insuranceExpiry}
                  </td>
                  <td className="px-4 py-4 lg:px-6">
                    <span className="flex items-center gap-1">
                      <IconStar className="h-3 w-3 text-amber-400" filled />
                      {op.safetyRating}/5
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 lg:px-6">{op.lastInspection ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-4 text-sm text-slate-500 lg:px-6">
          <span>Showing 1–{filteredOperators.length} of 1,847 operators</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                className={`rounded-lg px-3 py-1 ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= 3}
              className="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
