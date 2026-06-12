import React from "react";
import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { staticFile } from "remotion";
import { COLORS } from "../constants";

const font = "system-ui, -apple-system, sans-serif";

export const ScreenExplore: React.FC<{ trekkingActive?: boolean; glowTrek?: number }> = ({
  trekkingActive = false,
  glowTrek = 0,
}) => (
  <div style={{ background: "#F0F7FF", height: "100%", padding: 16, fontFamily: font }}>
    <div style={{ fontSize: 12, color: COLORS.kashmirBlue, fontWeight: 600 }}>Good Morning</div>
    <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>📍 Kashmir, India</div>
    <div style={{ display: "flex", gap: 8, marginTop: 16, overflow: "hidden" }}>
      {["All", "Trekking", "Water", "Snow"].map((t) => (
        <div
          key={t}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background: (t === "Trekking" && trekkingActive) ? COLORS.kashmirBlue : "#fff",
            color: (t === "Trekking" && trekkingActive) ? "#fff" : "#64748B",
          }}
        >
          {t}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
      <ActivityCard title="Frozen Lake Trek" price="₹1,800" glow={glowTrek} image="trek.jpg" />
      <ActivityCard title="Shikara at Sunrise" price="₹950" image="shikara.jpg" />
    </div>
  </div>
);

const ActivityCard: React.FC<{ title: string; price: string; glow?: number; image: string }> = ({
  title,
  price,
  glow = 0,
  image,
}) => (
  <div
    style={{
      borderRadius: 20,
      overflow: "hidden",
      height: 180,
      position: "relative",
      boxShadow: glow > 0 ? `0 0 ${20 + glow * 30}px rgba(37,99,235,${0.3 + glow * 0.4})` : "0 4px 12px rgba(0,0,0,0.1)",
    }}
  >
    <Img src={staticFile(`activities/${image}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 40%, rgba(0,0,0,0.7))" }} />
    <div style={{ position: "absolute", bottom: 12, left: 12, color: "#fff", fontWeight: 800, fontSize: 16 }}>{title}</div>
    <div style={{ position: "absolute", bottom: 12, right: 12, background: "#fff", color: COLORS.kashmirBlue, padding: "4px 10px", borderRadius: 8, fontWeight: 700, fontSize: 12 }}>{price}</div>
  </div>
);

export const ScreenActivityDetail: React.FC<{ rating?: number; includesVisible?: number; bookPulse?: number }> = ({
  rating = 0,
  includesVisible = 0,
  bookPulse = 0,
}) => {
  const includes = ["Guide", "Gear", "Lunch", "Transport"];
  return (
    <div style={{ background: "#F0F7FF", height: "100%", fontFamily: font, overflow: "auto" }}>
      <Img src={staticFile("activities/gondola.jpg")} style={{ width: "100%", height: 200, objectFit: "cover" }} />
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 }}>Gulmarg Gondola Ride</h2>
        <div style={{ marginTop: 8, color: COLORS.kashmirBlue, fontWeight: 700 }}>★ {rating.toFixed(1)} · 312 reviews</div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {includes.slice(0, includesVisible).map((item, i) => (
            <IncludeIcon key={item} label={item} delay={i} />
          ))}
        </div>
        <div style={{ marginTop: 16, background: "#fff", borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: COLORS.kashmirBlue, fontSize: 12 }}>HT</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Himalayan Trails Co. ✓</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Verified Operator · 7 yrs</div>
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            border: `2px solid ${COLORS.kashmirBlue}`,
            borderRadius: 12,
            padding: 14,
            textAlign: "center",
            fontWeight: 800,
            color: COLORS.kashmirBlue,
            boxShadow: bookPulse > 0 ? `0 0 ${bookPulse * 20}px rgba(37,99,235,0.5)` : "none",
          }}
        >
          Book Slot
        </div>
      </div>
    </div>
  );
};

const IncludeIcon: React.FC<{ label: string; delay: number }> = ({ label }) => (
  <div style={{ textAlign: "center", width: 56 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✓</div>
    <div style={{ fontSize: 10, marginTop: 4, color: "#64748B" }}>{label}</div>
  </div>
);

export const ScreenBooking: React.FC<{
  dateSelected?: boolean;
  timeSelected?: boolean;
  groupSize?: number;
  total?: number;
  confirmPulse?: number;
}> = ({ dateSelected, timeSelected, groupSize = 1, total = 0, confirmPulse = 0 }) => (
  <div style={{ background: "#F0F7FF", height: "100%", padding: 16, fontFamily: font }}>
    <h3 style={{ fontWeight: 800, fontSize: 18 }}>Select Your Slot</h3>
    <p style={{ color: "#64748B", fontSize: 13 }}>Gulmarg Gondola Ride</p>
    <div style={{ background: "#fff", borderRadius: 16, padding: 12, marginTop: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>June 2026</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 11 }}>
        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
          <div
            key={d}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: d === 12 && dateSelected ? COLORS.kashmirBlue : "transparent",
              color: d === 12 && dateSelected ? "#fff" : "#334155",
              fontWeight: d === 12 ? 700 : 400,
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
      {["08:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"].map((t) => (
        <div
          key={t}
          style={{
            padding: 12,
            borderRadius: 12,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 13,
            border: `2px solid ${t === "10:30 AM" && timeSelected ? COLORS.kashmirBlue : "#E2E8F0"}`,
            background: t === "10:30 AM" && timeSelected ? "#EFF6FF" : "#fff",
            color: t === "10:30 AM" && timeSelected ? COLORS.kashmirBlue : "#334155",
          }}
        >
          {t}
        </div>
      ))}
    </div>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 16, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontWeight: 600 }}>Group Size</span>
      <span style={{ fontSize: 24, fontWeight: 800 }}>{groupSize}</span>
    </div>
    <div style={{ marginTop: 12, background: "#fff", borderRadius: 16, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18 }}>
        <span>Total</span>
        <span>₹{Math.round(total).toLocaleString("en-IN")}</span>
      </div>
    </div>
    <div
      style={{
        marginTop: 12,
        border: `2px solid ${COLORS.kashmirBlue}`,
        borderRadius: 12,
        padding: 14,
        textAlign: "center",
        fontWeight: 800,
        color: COLORS.kashmirBlue,
        boxShadow: confirmPulse > 0 ? `0 0 ${confirmPulse * 24}px rgba(37,99,235,0.45)` : "none",
      }}
    >
      ✓ Confirm Booking
    </div>
  </div>
);

export const ScreenConfirmation: React.FC<{ qrOpacity?: number; scanLine?: number }> = ({
  qrOpacity = 1,
  scanLine = 0,
}) => (
  <div style={{ background: "#F0F7FF", height: "100%", padding: 24, fontFamily: font, textAlign: "center" }}>
    <div style={{ width: 72, height: 72, borderRadius: "50%", background: COLORS.kashmirBlue, margin: "20px auto", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36 }}>✓</div>
    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A" }}>You&apos;re Going!</h2>
    <p style={{ color: "#64748B", fontSize: 13 }}>Booking Confirmed</p>
    <div style={{ position: "relative", width: 160, height: 160, margin: "24px auto", opacity: qrOpacity }}>
      <QrPlaceholder />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanLine * 100}%`,
          height: 3,
          background: COLORS.saffron,
          opacity: 0.8,
        }}
      />
    </div>
    <div style={{ background: COLORS.saffron, color: "#fff", borderRadius: 12, padding: 14, fontWeight: 700, marginTop: 16, boxShadow: "0 0 20px rgba(245,158,11,0.4)" }}>
      Add to Wallet
    </div>
  </div>
);

const QrPlaceholder = () => (
  <div style={{ width: 160, height: 160, background: "#fff", border: "2px solid #E2E8F0", borderRadius: 12, display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 2, padding: 8 }}>
    {Array.from({ length: 64 }).map((_, i) => (
      <div key={i} style={{ background: i % 2 === 0 ? "#0F172A" : "#fff", borderRadius: 1 }} />
    ))}
  </div>
);
