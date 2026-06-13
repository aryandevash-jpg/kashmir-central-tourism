import { RegisterOfficerClient } from "./RegisterOfficerClient";

export default function GovRegisterOfficerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Register Government Officer</h1>
        <p className="text-slate-500">
          Provision a new official account for the J&K Tourism Department control center
        </p>
      </div>

      <RegisterOfficerClient />
    </div>
  );
}
