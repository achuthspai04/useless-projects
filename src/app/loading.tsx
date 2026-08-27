"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = ["/ele1.webp", "/ele2.webp", "/ele3.webp", "/ele4.webp", "/ele5a.webp"];
const INTERVAL_MS = 800;

export default function Loading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-[#ffffff]">
      <div className="relative h-40 w-40">
        <Image
          key={IMAGES[index]}
          src={IMAGES[index]}
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
