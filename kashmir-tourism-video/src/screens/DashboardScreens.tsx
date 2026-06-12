import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";

const font = "system-ui, sans-serif";

export const ScreenOperatorDashboard: React.FC<{
  revenue?: string;
  bookings?: string;
  travellers?: string;
  rating?: string;
  chartProgress?: number;
  rowsVisible?: number;
  barFill?: number;
}> = ({
  revenue = "0",
  bookings = "0",
  travellers = "0",
  rating = "0",
  chartProgress = 0,
  rowsVisible = 0,
  barFill = 0,
}) => {
  const rows = [
    { name: "Aarav Reddy", activity: "Gulmarg Gondola", status: "CONFIRMED", amount: "₹4,248" },
    { name: "Priya Sharma", activity: "Frozen Lake Trek", status: "CONFIRMED", amount: "₹8,496" },
    { name: "Rohan Mehta", activity: "Shikara Sunrise", status: "PENDING", amount: "₹1,121" },
  ];

  return (
    <div style={{ background: "#F8FAFC", height: "100%", padding: 24, fontFamily: font, fontSize: 13 }}>
      <div style={{ fontWeight: 800, fontSize: 20, color: "#0F172A" }}>Himalayan Trails Co.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 16 }}>
        {[
          { label: "Total Revenue", value: `₹${revenue}` },
          { label: "Total Bookings", value: bookings },
          { label: "Active Travellers", value: travellers },
          { label: "Avg Rating", value: rating },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div style={{ color: "#64748B", fontSize: 11 }}>{s.label}</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginTop: 4, color: COLORS.kashmirBlue }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, padding: 16, height: 180 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Revenue Trend</div>
        <svg width="100%" height="120" viewBox="0 0 400 120">
          <path
            d="M0,100 L60,80 L120,90 L180,50 L240,60 L300,30 L360,40 L400,20"
            fill="none"
            stroke={COLORS.kashmirBlue}
            strokeWidth="3"
            strokeDasharray="500"
            strokeDashoffset={500 * (1 - chartProgress)}
          />
        </svg>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent Bookings</div>
          {rows.slice(0, rowsVisible).map((r, i) => (
            <div key={r.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: i ? "1px solid #F1F5F9" : "none", opacity: 1 }}>
              <span>{r.name}</span>
              <span style={{ color: r.status === "CONFIRMED" ? COLORS.success : COLORS.saffron, fontWeight: 600, fontSize: 11 }}>{r.status}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12 }}>
          <div style={{ fontWeight: 700 }}>Top Activities</div>
          <div style={{ marginTop: 8 }}>Gulmarg Gondola</div>
          <div style={{ height: 8, background: "#E2E8F0", borderRadius: 4, marginTop: 4 }}>
            <div style={{ height: "100%", width: `${barFill * 100}%`, background: COLORS.kashmirBlue, borderRadius: 4 }} />
          </div>
          <div style={{ marginTop: 12, background: "#EFF6FF", borderRadius: 8, padding: 8, fontSize: 11, color: COLORS.kashmirBlue }}>
            💡 Boost off-peak slots
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScreenGovOverview: React.FC<{
  kpisVisible?: number;
  mapProgress?: number;
}> = ({ kpisVisible = 0, mapProgress = 0 }) => {
  const districts = ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg", "Kargil"];
  const kpis = [
    { label: "Registered Operators", value: "1,847" },
    { label: "Monthly Bookings", value: "24,310" },
    { label: "GST Collected", value: "₹3.2 Cr" },
    { label: "Safety Incidents", value: "3" },
  ];

  return (
    <div style={{ background: "#0F172A", height: "100%", padding: 24, fontFamily: font, color: "#fff" }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>Kashmir Central Tourism System</div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>J&K Tourism Department — Government of India</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 20 }}>
        {kpis.slice(0, kpisVisible).map((k) => (
          <div key={k.label} style={{ background: "#1E293B", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.saffron, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#1E293B", borderRadius: 12, padding: 16, minHeight: 200 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>District Activity Map</div>
          {districts.map((d, i) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, opacity: mapProgress > i / districts.length ? 1 : 0.2 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: `rgba(245,158,11,${1 - i * 0.15})` }} />
              <span style={{ fontSize: 12 }}>{d}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "#1E293B", borderRadius: 12, padding: 16 }}>
          <div style={{ fontWeight: 700 }}>District Breakdown</div>
          {districts.map((d) => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "6px 0", borderBottom: "1px solid #334155" }}>
              <span>{d}</span>
              <span style={{ color: COLORS.saffron }}>{(8000 - districts.indexOf(d) * 1200).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ScreenAnalytics: React.FC<{ chartProgress?: number; rowsVisible?: number }> = ({
  chartProgress = 0,
  rowsVisible = 0,
}) => {
  const activities = [
    { rank: "01", name: "Gulmarg Gondola Ride", revenue: "₹38,42,500", mom: "+12.4%" },
    { rank: "02", name: "Shikara at Sunrise", revenue: "₹30,49,500", mom: "+8.1%" },
    { rank: "03", name: "Frozen Lake Trek", revenue: "₹39,24,000", mom: "+12.1%", highlight: true },
  ];
  const colors = ["#2563EB", "#06B6D4", "#8B5CF6", "#F59E0B", "#10B981"];

  return (
    <div style={{ background: "#F8FAFC", height: "100%", padding: 24, fontFamily: font }}>
      <div style={{ fontWeight: 800, fontSize: 20 }}>Activity Analytics</div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["Trekking", "Gondola"].map((c, i) => (
          <div key={c} style={{ padding: "6px 14px", borderRadius: 999, background: i === 1 ? COLORS.kashmirBlue : "#E2E8F0", color: i === 1 ? "#fff" : "#64748B", fontSize: 12, fontWeight: 600 }}>{c}</div>
        ))}
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginTop: 12, height: 200 }}>
        <svg width="100%" height="160" viewBox="0 0 500 160">
          {colors.map((c, i) => (
            <path
              key={c}
              d={`M0,${120 - i * 15} L100,${100 - i * 12} L200,${110 - i * 10} L300,${70 - i * 8} L400,${80 - i * 6} L500,${50 - i * 4}`}
              fill="none"
              stroke={c}
              strokeWidth="2"
              strokeDasharray="600"
              strokeDashoffset={600 * (1 - chartProgress)}
            />
          ))}
        </svg>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Top 10 Activities</div>
        {activities.slice(0, rowsVisible).map((a) => (
          <div key={a.rank} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #F1F5F9", background: a.highlight ? "#F0FDF4" : "transparent" }}>
            <span><strong>{a.rank}</strong> {a.name}</span>
            <span style={{ fontWeight: 700 }}>{a.revenue} <span style={{ color: COLORS.success, fontSize: 11 }}>{a.mom}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScreenCompliance: React.FC<{ rowsVisible?: number }> = ({ rowsVisible = 0 }) => (
  <div style={{ background: "#F8FAFC", height: "100%", padding: 16, fontFamily: font, fontSize: 12 }}>
    <div style={{ fontWeight: 800, fontSize: 16 }}>Compliance Registry</div>
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <Badge text="1,412 Compliant" color={COLORS.success} />
      <Badge text="137 Non-Compliant" color={COLORS.danger} pulse />
    </div>
    {["Himalayan Trails Co. ✓ Valid", "Valley View Tours ⚠ Expiring", "Kargil Adventure ✗ Expired"].slice(0, rowsVisible).map((r) => (
      <div key={r} style={{ background: "#fff", borderRadius: 8, padding: 10, marginTop: 8, border: r.includes("Valid") ? `2px solid ${COLORS.success}` : "1px solid #E2E8F0" }}>{r}</div>
    ))}
  </div>
);

export const ScreenIncidents: React.FC<{ itemsVisible?: number; trackerProgress?: number }> = ({
  itemsVisible = 0,
  trackerProgress = 0,
}) => (
  <div style={{ background: "#0F172A", height: "100%", padding: 16, fontFamily: font, color: "#fff", fontSize: 12 }}>
    <div style={{ fontWeight: 800, fontSize: 16 }}>Incident Log</div>
    <Badge text="CRITICAL: 1" color={COLORS.danger} pulse />
    {["Trekker Injury — Sonamarg Trail 4", "Equipment Failure — Gondola Phase II"].slice(0, itemsVisible).map((item) => (
      <div key={item} style={{ background: "#1E293B", borderRadius: 8, padding: 10, marginTop: 8, borderLeft: `4px solid ${COLORS.danger}` }}>
        <div style={{ fontWeight: 700 }}>{item}</div>
        <span style={{ color: COLORS.danger, fontSize: 10, fontWeight: 700 }}>CRITICAL</span>
      </div>
    ))}
    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
      {["Reported", "Under Review", "Resolved"].map((step, i) => (
        <React.Fragment key={step}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: trackerProgress > i / 2 ? COLORS.saffron : "#475569" }} />
          <span style={{ opacity: trackerProgress > i / 2 ? 1 : 0.4 }}>{step}</span>
          {i < 2 && <div style={{ width: 30, height: 2, background: COLORS.saffron, opacity: trackerProgress > (i + 0.5) / 2 ? 1 : 0.2 }} />}
        </React.Fragment>
      ))}
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <div style={{ flex: 1, background: COLORS.saffron, borderRadius: 8, padding: 8, textAlign: "center", fontWeight: 700, fontSize: 11 }}>Escalate to Commissioner</div>
      <div style={{ flex: 1, border: `1px solid ${COLORS.kashmirBlue}`, borderRadius: 8, padding: 8, textAlign: "center", fontWeight: 700, fontSize: 11 }}>Mark Resolved</div>
    </div>
  </div>
);

const Badge: React.FC<{ text: string; color: string; pulse?: boolean }> = ({ text, color, pulse }) => {
  const frame = useCurrentFrame();
  const scale = pulse ? 1 + Math.sin(frame / 8) * 0.05 : 1;
  return (
    <div style={{ background: `${color}22`, color, padding: "6px 12px", borderRadius: 999, fontWeight: 700, fontSize: 11, transform: `scale(${scale})`, display: "inline-block", marginTop: 8 }}>
      {text}
    </div>
  );
};
