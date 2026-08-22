"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = ["/ele1.webp", "/ele2.webp", "/ele3.webp", "/ele4.webp", "/ele5.webp"];
const INTERVAL_MS = 500;
const DURATION_MS = 5000;

export default function Splash({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), DURATION_MS);
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
