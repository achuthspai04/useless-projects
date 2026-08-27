"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = ["/ele1.webp", "/ele2.webp", "/ele3.webp", "/ele4.webp", "/ele5a.webp"];
const INTERVAL_MS = 800;

export default function Splash({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }
    const onLoad = () => setLoading(false);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
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
