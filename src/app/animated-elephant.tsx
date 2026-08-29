"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_FRAMES = ["/ele5a.webp", "/ele5b.webp", "/ele5c.webp", "/ele5d.webp", "/ele5e.webp"];
const FRAME_INTERVAL_MS = 700;
const MIN_DELAY_MS = 3000;
const MAX_DELAY_MS = 8000;
const SECONDARY_MIN_GAP_MS = 2000;
const SECONDARY_MAX_GAP_MS = 5000;

export default function AnimatedElephant({
  style,
  className,
  frames = DEFAULT_FRAMES,
  secondaryFrames,
  secondaryScale = 1,
  anchor = "center",
  frameIntervalMs = FRAME_INTERVAL_MS,
  repeatCount = 1,
  minDelayMs = MIN_DELAY_MS,
  maxDelayMs = MAX_DELAY_MS,
  floatAnimation = false,
  onBurstChange,
  onClick,
  ariaLabel,
}: {
  style?: React.CSSProperties;
  /** Merged alongside the root div's own "absolute" (+ "animate-float-slow" if floatAnimation),
   * so a caller can layer on its own transition/transform classes without fighting the base ones. */
  className?: string;
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
  /** Fires true right as a burst (primary, then secondary if any) starts and false once it's
   * back to resting on frames[0] - lets a caller sync something else (e.g. a nearby button's
   * color) to the burst rather than the idle gaps between them. */
  onBurstChange?: (active: boolean) => void;
  /** Makes the creature tappable - when set, the root div gets a pointer cursor and this fires
   * on click, letting a caller wire up its own touch behaviour (vanish, kill/respawn, etc.)
   * without this component needing to know which. */
  onClick?: () => void;
  /** Accessible name for the click target above; only meaningful alongside `onClick`. */
  ariaLabel?: string;
}) {
  const idleSrc = frames[0];
  const [visibleSrc, setVisibleSrc] = useState(idleSrc);
  const rootRef = useRef<HTMLDivElement>(null);
  // Both breakpoints' heroes (and their creatures) are mounted at once and switched with
  // CSS display:none rather than unmounted (see mobile-hero.tsx / page.tsx), so without this a
  // hidden creature would sit there forever running its burst scheduler and re-rendering itself
  // for something nobody can see. `offsetParent === null` is the standard display:none check -
  // this component's own root div has no intrinsic size (its children are all position:absolute,
  // which don't contribute to a parent's auto size), so a ResizeObserver on itself would read
  // zero-size *always*, hidden or not.
  const isHidden = () => rootRef.current !== null && rootRef.current.offsetParent === null;

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
          // Hidden (display:none) - skip this burst rather than animating/re-rendering off-screen,
          // and just try again after another random idle gap.
          if (isHidden()) {
            scheduleNext();
            return;
          }
          const hasSecondary = secondaryFrames && secondaryFrames.length > 0;
          onBurstChange?.(true);
          const primaryEnd = play(
            burstOf(frames, true),
            0,
            hasSecondary
              ? undefined
              : () => {
                  onBurstChange?.(false);
                  scheduleNext();
                }
          );
          if (hasSecondary) {
            const gap = SECONDARY_MIN_GAP_MS + Math.random() * (SECONDARY_MAX_GAP_MS - SECONDARY_MIN_GAP_MS);
            play(burstOf(secondaryFrames, false), primaryEnd + gap, () => {
              onBurstChange?.(false);
              scheduleNext();
            });
          }
        }, delay)
      );
    };

    scheduleNext();
    return () => timeouts.forEach(clearTimeout);
  }, [frames, secondaryFrames, frameIntervalMs, repeatCount, idleSrc, minDelayMs, maxDelayMs, onBurstChange]);

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
        }}
      />
    ));

  return (
    <div
      ref={rootRef}
      className={[
        floatAnimation ? "absolute animate-float-slow" : "absolute",
        onClick ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={onClick ? ariaLabel : undefined}
    >
      {renderFrames(frames, 100)}
      {secondaryFrames && renderFrames(secondaryFrames, 100 * secondaryScale)}
    </div>
  );
}
