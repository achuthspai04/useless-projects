"use client";

import { useEffect, useState } from "react";
import TimerBoard from "./timer-board";
import TimerToast, { useTimerMilestones } from "./timer-toast";
import { clearTimer, loadTimer, saveTimer, type StoredTimer } from "./storage";

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

function splitDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

/** A datetime-local input's value has no timezone - it means "this clock time here", so it
 *  parses correctly through `new Date(value)` without any extra offset math. */
function parseLocalDateTime(value: string) {
  const ms = new Date(value).getTime();
  return Number.isFinite(ms) ? ms : null;
}

function minDateTimeLocal() {
  // A minute from now, formatted for <input type="datetime-local">, so the picker can't be
  // submitted with an end time that's already effectively "now".
  const d = new Date(Date.now() + 60_000);
  d.setSeconds(0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

const DURATION_PRESETS = [
  { label: "15 min", ms: 15 * 60_000 },
  { label: "30 min", ms: 30 * 60_000 },
  { label: "1 hour", ms: 60 * 60_000 },
  { label: "2 hours", ms: 2 * 60 * 60_000 },
  { label: "4 hours", ms: 4 * 60 * 60_000 },
] as const;

function PresetButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-nanum-pen cursor-pointer rounded-2xl border py-3 text-[17px] transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
        selected
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-[#0e0e0d] hover:border-black/25 hover:shadow-md"
      }`}
    >
      {children}
    </button>
  );
}

// A picker built from two complementary paths rather than one form: most people building a
// timer know roughly how *long* they're working, not the exact clock time it ends at - so
// duration presets are the primary, one-tap path, with the native datetime-local picker tucked
// behind "custom" for the rarer case of a precise end time.
function SetupForm({ onStart }: { onStart: (endAt: number) => void }) {
  const [customOpen, setCustomOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative z-10 flex w-full max-w-[400px] flex-col items-center gap-6 px-6 text-center">
      <h1 className="font-drowner text-[#0e0e0d]" style={{ fontSize: "clamp(32px, 6vw, 48px)" }}>
        set a build timer
      </h1>
      <p className="font-helvetica text-[15px] leading-[1.5] text-[#33322f]">
        Pick how long the build runs for. The board fills in as the clock runs down.
      </p>

      <div className="grid w-full grid-cols-3 gap-2.5">
        {DURATION_PRESETS.map((preset) => (
          <PresetButton key={preset.label} onClick={() => onStart(Date.now() + preset.ms)}>
            {preset.label}
          </PresetButton>
        ))}
        <PresetButton selected={customOpen} onClick={() => setCustomOpen((v) => !v)}>
          custom
        </PresetButton>
      </div>

      {customOpen && (
        <form
          className="flex w-full flex-col items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const endAt = value ? parseLocalDateTime(value) : null;
            if (endAt === null || endAt <= Date.now()) {
              setError("Pick a time in the future.");
              return;
            }
            onStart(endAt);
          }}
        >
          <label className="flex w-full flex-col gap-2 text-left">
            <span className="font-helvetica text-[13px] tracking-[0.04em] text-[#33322f] uppercase">ends at</span>
            <input
              type="datetime-local"
              value={value}
              min={minDateTimeLocal()}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              className="font-helvetica w-full rounded-2xl border border-black/15 bg-white px-4 py-3.5 text-[17px] text-[#0e0e0d] shadow-sm outline-none transition-colors focus:border-black"
              style={{ colorScheme: "light" }}
              required
              autoFocus
            />
          </label>
          {error && <p className="font-helvetica text-[13px] text-[#e82803]">{error}</p>}
          <button
            type="submit"
            className="font-nanum-pen w-full cursor-pointer rounded-full bg-black py-3 text-[20px] text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5"
          >
            start timer
          </button>
        </form>
      )}
    </div>
  );
}

function MinimizedPill({
  hours,
  minutes,
  seconds,
  onExpand,
}: {
  hours: number;
  minutes: number;
  seconds: number;
  onExpand: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className="font-drowner fixed right-5 bottom-5 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-black px-5 py-3 text-[20px] text-white shadow-lg transition-transform duration-200 ease-out hover:-translate-y-0.5"
      style={{ letterSpacing: "0.02em" }}
      aria-label="Expand timer"
    >
      <span className="size-2.5 rounded-full bg-[#ea34df]" />
      {pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </button>
  );
}

export default function TimerApp() {
  // null = no timer running (show setup). Starts null on both server and client - the server
  // never sees localStorage, so hydration would mismatch if the client's first render already
  // reflected a resumed timer - and the effect below reads storage a moment after mount instead.
  const [timer, setTimer] = useState<StoredTimer | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setTimer(loadTimer());
  }, []);

  useEffect(() => {
    if (!timer) {
      setNow(null);
      return;
    }
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const remainingMs = timer && now !== null ? Math.max(0, timer.endAt - now) : null;
  const totalMs = timer ? timer.endAt - timer.startAt : null;
  const progress = remainingMs !== null && totalMs ? 1 - remainingMs / totalMs : 0;
  const { hours, minutes, seconds, totalSeconds } = splitDuration(remainingMs ?? 0);
  const running = timer !== null && remainingMs !== null;
  const ended = running && remainingMs === 0;

  const milestoneMessage = useTimerMilestones(running ? totalSeconds : null, running);

  const startTimer = (endAt: number) => {
    const fresh = { startAt: Date.now(), endAt };
    saveTimer(fresh);
    setTimer(fresh);
    setMinimized(false);
  };

  const resetTimer = () => {
    clearTimer();
    setTimer(null);
    setMinimized(false);
  };

  if (!running) {
    return (
      <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
        <SetupForm onStart={startTimer} />
      </section>
    );
  }

  // The board itself (and its drop queue) stays mounted and running the whole time the timer is
  // "running", minimized or not - minimizing only swaps which UI sits on top of it. Unmounting it
  // on minimize would stop the fill (and reset its drop queue on the way back), which isn't what
  // "minimize" should mean.
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white">
      {/* Keyed on the timer's own start instant so a fresh timer (see "start another") remounts
          a genuinely empty board, rather than reusing the previous one's internal fill state -
          without this, the board's own size/columns often wouldn't have changed between timers,
          so its "reset the fill" effect (keyed on that layout, not on which timer is running)
          would never fire and the new run would start already showing the old one's full board. */}
      <TimerBoard key={timer.startAt} progress={progress} remainingMs={remainingMs} />
      <TimerToast message={milestoneMessage} />

      {minimized ? (
        <MinimizedPill hours={hours} minutes={minutes} seconds={seconds} onExpand={() => setMinimized(false)} />
      ) : (
        <>
          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="font-helvetica absolute top-6 right-6 z-20 cursor-pointer rounded-full bg-black/80 px-4 py-2 text-[13px] text-white backdrop-blur transition-transform duration-200 ease-out hover:-translate-y-0.5"
            aria-label="Minimize timer"
          >
            minimize
          </button>

          {/* Plain, fixed-color text - no card behind it, no color swap as blocks pass behind
              it (both tried and both read worse). Just a faint white halo so the digits stay
              readable once a block is directly behind them, without the text itself changing. */}
          <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
            <p
              className="font-nanum-pen text-[#0e0e0d]"
              style={{ fontSize: "clamp(18px, 3vw, 24px)", textShadow: "0 0 6px rgba(255,255,255,0.6)" }}
            >
              {ended ? "time's up!" : "building ends in"}
            </p>
            <p
              className="font-drowner leading-none text-[#0e0e0d]"
              style={{
                fontSize: "clamp(56px, 13vw, 140px)",
                letterSpacing: "0.02em",
                textShadow: "0 0 8px rgba(255,255,255,0.6)",
              }}
            >
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </p>
            {ended && (
              <button
                type="button"
                onClick={resetTimer}
                className="font-nanum-pen mt-2 cursor-pointer rounded-full bg-black px-6 py-2.5 text-[18px] text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                start another
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
