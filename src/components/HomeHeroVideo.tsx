"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/kashmir-himalayas.web.mp4";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData ===
      true;
    if (prefersReducedMotion || saveData) return;

    let cancelled = false;

    const loadVideo = () => {
      if (cancelled) return;
      setEnabled(true);
      const video = videoRef.current;
      if (!video) return;
      video.src = VIDEO_SRC;
      video.load();
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(loadVideo, { timeout: 2000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const timer = window.setTimeout(loadVideo, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!enabled) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full scale-105 object-cover brightness-125 saturate-110 transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
