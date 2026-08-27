"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FRAMES = ["/ele5a.webp", "/ele5b.webp", "/ele5c.webp", "/ele5d.webp", "/ele5e.webp"];
const FRAME_INTERVAL_MS = 700;
const CROSSFADE_MS = 150;
const MIN_DELAY_MS = 3000;
const MAX_DELAY_MS = 8000;

export default function AnimatedElephant({ style }: { style?: React.CSSProperties }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const scheduleNext = () => {
      const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
      timeouts.push(
        setTimeout(() => {
          [1, 2, 3, 4, 0].forEach((frameIndex, i) => {
            timeouts.push(setTimeout(() => setFrame(frameIndex), FRAME_INTERVAL_MS * (i + 1)));
          });
          timeouts.push(setTimeout(scheduleNext, FRAME_INTERVAL_MS * 6));
        }, delay)
      );
    };

    scheduleNext();
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="absolute" style={style}>
      {FRAMES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority
          className="absolute inset-0"
          style={{ opacity: i === frame ? 1 : 0, transition: `opacity ${CROSSFADE_MS}ms linear` }}
        />
      ))}
    </div>
  );
}
