"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = ["/ele1.webp", "/ele2.webp", "/ele3.webp", "/ele4.webp", "/ele5a.webp"];
const INTERVAL_MS = 800;
const MIN_DISPLAY_MS = 2000;

export default function Splash({ children }: { children: React.ReactNode }) {
  const [pageLoaded, setPageLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete"
  );
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [index, setIndex] = useState(0);
  const loading = !pageLoaded || !minTimeElapsed;

  useEffect(() => {
    // Land on the hero every time the page loads, rather than wherever the browser's scroll
    // restoration (e.g. a refresh after scrolling down) would otherwise put it.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (pageLoaded) return;
    const onLoad = () => setPageLoaded(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [pageLoaded]);

  useEffect(() => {
    const id = setTimeout(() => setMinTimeElapsed(true), MIN_DISPLAY_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [loading]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff]">
          <div className="relative h-[60px] w-[60px]">
            <Image
              key={IMAGES[index]}
              src={IMAGES[index]}
              alt=""
              fill
              sizes="60px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
