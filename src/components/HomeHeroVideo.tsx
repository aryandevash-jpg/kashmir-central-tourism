"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/kashmir-himalayas.web.mp4";
const VIDEO_FALLBACK = "/videos/kashmir-himalayas.mp4";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const start = () => setShouldLoad(true);

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(start, 200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener("loadeddata", tryPlay);
    tryPlay();

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, [shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full scale-105 object-cover brightness-125 saturate-110 transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      <source src={VIDEO_SRC} type="video/mp4" />
      <source src={VIDEO_FALLBACK} type="video/mp4" />
    </video>
  );
}
