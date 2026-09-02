"use client";

import { useEffect, useRef, useState } from "react";

// Fires once each as remaining time crosses these thresholds (seconds), largest first so a big
// jump backward (resuming a stale tab) doesn't fire several at once out of order.
const MILESTONES = [
  { atSeconds: 3600, text: "1 hour left" },
  { atSeconds: 1800, text: "30 minutes left" },
  { atSeconds: 600, text: "10 minutes left" },
  { atSeconds: 300, text: "5 minutes left" },
  { atSeconds: 60, text: "1 minute left" },
];
const TOAST_MS = 6000;

/**
 * Renders nothing itself - just watches `remainingSeconds` and hands the caller one message at a
 * time through `onMessage` as thresholds are crossed (including "time's up" at zero), so the
 * caller owns how/where the toast actually renders.
 */
export function useTimerMilestones(remainingSeconds: number | null, running: boolean) {
  const [message, setMessage] = useState<string | null>(null);
  const firedRef = useRef<Set<number>>(new Set());
  const prevRef = useRef<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!running) return;
    firedRef.current = new Set();
    prevRef.current = null;
  }, [running]);

  useEffect(() => {
    if (!running || remainingSeconds === null) return;
    const prev = prevRef.current;
    prevRef.current = remainingSeconds;

    const announce = (text: string) => {
      setMessage(text);
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setMessage(null), TOAST_MS);
    };

    if (remainingSeconds <= 0 && !firedRef.current.has(0)) {
      firedRef.current.add(0);
      announce("time's up!");
      return;
    }
    if (prev === null) return;
    for (const { atSeconds, text } of MILESTONES) {
      if (prev > atSeconds && remainingSeconds <= atSeconds && !firedRef.current.has(atSeconds)) {
        firedRef.current.add(atSeconds);
        announce(text);
        break;
      }
    }
  }, [remainingSeconds, running]);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  return message;
}

export default function TimerToast({ message }: { message: string | null }) {
  return (
    <div
      className={`font-nanum-pen pointer-events-none fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-6 py-2.5 text-[18px] text-white shadow-lg transition-all duration-300 ${
        message ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}
    >
      {message ?? ""}
    </div>
  );
}
