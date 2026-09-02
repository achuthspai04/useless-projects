// Persists the running timer across visits/reloads - just start/end instants, so remaining time
// is always recomputed from wall-clock rather than trusting a stored duration that would drift
// if the tab were closed for a while.
const STORAGE_KEY = "useless-projects-timer-v1";

export interface StoredTimer {
  startAt: number;
  endAt: number;
}

export function loadTimer(): StoredTimer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.startAt !== "number" || typeof parsed?.endAt !== "number") return null;
    if (parsed.endAt <= parsed.startAt) return null;
    return parsed;
  } catch {
    // Corrupt or inaccessible storage (private browsing, quota, hand-edited value) - treat as
    // "no timer" rather than crashing the page over it.
    return null;
  }
}

export function saveTimer(timer: StoredTimer) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  } catch {
    // Ignore - the timer still runs for this session, it just won't survive a reload.
  }
}

export function clearTimer() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
