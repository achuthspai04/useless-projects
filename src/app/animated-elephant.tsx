"use client";

import { useEffect, useState } from "react";

const DEFAULT_FRAMES = ["/ele5a.webp", "/ele5b.webp", "/ele5c.webp", "/ele5d.webp", "/ele5e.webp"];
const FRAME_INTERVAL_MS = 700;
const CROSSFADE_MS = 150;
const MIN_DELAY_MS = 3000;
const MAX_DELAY_MS = 8000;
const SECONDARY_MIN_GAP_MS = 2000;
const SECONDARY_MAX_GAP_MS = 5000;

export default function AnimatedElephant({
  style,
  frames = DEFAULT_FRAMES,
  secondaryFrames,
  secondaryScale = 1,
  anchor = "center",
  frameIntervalMs = FRAME_INTERVAL_MS,
  repeatCount = 1,
  minDelayMs = MIN_DELAY_MS,
  maxDelayMs = MAX_DELAY_MS,
  floatAnimation = false,
}: {
  style?: React.CSSProperties;
  frames?: string[];
  /** A second burst sequence that plays a random few-second gap after the first loop finishes,
   * using the same frame timing/repeat count and resting back on `frames[0]` when done. */
  secondaryFrames?: string[];
  /** Size of secondaryFrames relative to frames (e.g. 1.05 = 5% taller). Grows from the same
   * baseline (bottom-anchored) so the character's feet stay planted either way. */
  secondaryScale?: number;
  /** Frames may have different intrinsic widths (at a fixed height), so every frame keeps its
   * own aspect ratio rather than being stretched into one box. "left" holds the left edge fixed
   * and grows rightward (e.g. a fire breath); "center" keeps the frame horizontally centered
   * (e.g. a character whose pose/canvas width varies slightly between drawings). */
  anchor?: "left" | "center";
  /** Time each frame is held during a burst. */
  frameIntervalMs?: number;
  /** Number of times each burst sequence plays back-to-back before the next idle break. */
  repeatCount?: number;
  /** Random idle range (ms) between the end of one burst and the start of the next. */
  minDelayMs?: number;
  maxDelayMs?: number;
  /** Adds a slow, autonomous up/down bob (independent of mouse position, unlike the parallax
   * Floating wrapper used elsewhere) alongside the frame animation. */
  floatAnimation?: boolean;
}) {
  const idleSrc = frames[0];
  const [visibleSrc, setVisibleSrc] = useState(idleSrc);

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // `frames` is already showing frames[0] at rest, so its burst skips that first element.
    // `secondaryFrames` starts from that same rest frame (idleSrc), so none of its own frames
    // are skipped - dropping one there would jump straight to its 2nd frame.
    const burstOf = (set: string[], skipFirst: boolean) => {
      const burst = [...(skipFirst ? set.slice(1) : set), idleSrc];
      return Array.from({ length: repeatCount }, () => burst).flat();
    };

    // Schedules `sequence` starting `after` ms from now, returns the ms offset it finishes at.
    const play = (sequence: string[], after: number, onDone?: () => void) => {
      sequence.forEach((src, i) => {
        timeouts.push(setTimeout(() => setVisibleSrc(src), after + frameIntervalMs * (i + 1)));
      });
      const end = after + frameIntervalMs * (sequence.length + 1);
      if (onDone) timeouts.push(setTimeout(onDone, end));
      return end;
    };

    const scheduleNext = () => {
      const delay = minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
      timeouts.push(
        setTimeout(() => {
          const primaryEnd = play(burstOf(frames, true), 0);
          if (secondaryFrames && secondaryFrames.length > 0) {
            const gap = SECONDARY_MIN_GAP_MS + Math.random() * (SECONDARY_MAX_GAP_MS - SECONDARY_MIN_GAP_MS);
            play(burstOf(secondaryFrames, false), primaryEnd + gap, scheduleNext);
          } else {
            timeouts.push(setTimeout(scheduleNext, primaryEnd));
          }
        }, delay)
      );
    };

    scheduleNext();
    return () => timeouts.forEach(clearTimeout);
  }, [frames, secondaryFrames, frameIntervalMs, repeatCount, idleSrc, minDelayMs, maxDelayMs]);

  const renderFrames = (set: string[], heightPct: number) =>
    set.map((src) => (
      // Intrinsic aspect ratio per frame drives width here; next/image's `fill` would
      // stretch every frame to one box, distorting frames whose source canvas differs.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        src={src}
        alt=""
        className={
          anchor === "left"
            ? "absolute left-0 bottom-0 w-auto max-w-none"
            : "absolute left-1/2 bottom-0 w-auto max-w-none -translate-x-1/2"
        }
        style={{
          height: `${heightPct}%`,
          opacity: src === visibleSrc ? 1 : 0,
          transition: `opacity ${CROSSFADE_MS}ms linear`,
        }}
      />
    ));

  return (
    <div className={floatAnimation ? "absolute animate-float-slow" : "absolute"} style={style}>
      {renderFrames(frames, 100)}
      {secondaryFrames && renderFrames(secondaryFrames, 100 * secondaryScale)}
    </div>
  );
}
