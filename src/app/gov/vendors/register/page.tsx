import { RegisterVendorClient } from "./RegisterVendorClient";

export default function GovRegisterVendorPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Register New Vendor</h1>
        <p className="text-slate-500">
          Onboard a new tourism operator into the J&K Central Tourism licensing system
        </p>
      </div>

      <RegisterVendorClient />
    </div>
  );
}
