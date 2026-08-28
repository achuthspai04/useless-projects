let audioCtx: AudioContext | null = null;
let audioUnlockArmed = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
}

// Browsers refuse to play audio before a user gesture. Resume the (lazily created) context on
// the page's first pointer/key interaction so a later scroll-triggered sound is actually allowed
// to play instead of failing silently.
export function armAudioUnlock() {
  if (audioUnlockArmed || typeof window === "undefined") return;
  audioUnlockArmed = true;
  const resume = () => getAudioContext()?.resume();
  (["pointerdown", "keydown", "touchstart"] as const).forEach((evt) =>
    window.addEventListener(evt, resume, { once: true, passive: true })
  );
}

// Synthesizes a pencil-scribble sound (filtered, fluttering noise burst) rather than shipping an
// audio file, so it stays in sync with `durationSec` however that's tuned per animation.
export function playScribbleSound(durationSec: number) {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;

  const sampleCount = Math.floor(ctx.sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    const t = i / ctx.sampleRate;
    // Fast amplitude flutter turns flat noise into a scratchy, back-and-forth texture.
    const flutter = 0.4 + 0.6 * Math.abs(Math.sin(t * 55) * Math.sin(t * 13));
    data[i] = (Math.random() * 2 - 1) * flutter;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2600;
  filter.Q.value = 1.4;

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 7;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 900;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  lfo.start();
  source.start();
  lfo.stop(ctx.currentTime + durationSec);
  source.stop(ctx.currentTime + durationSec);
}
