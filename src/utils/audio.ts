// Silicon Valley high-performance web synthesized audio telemetry engine for CareCalculus
// Strictly client-only, uses native Web Audio API with zero external dependencies.

let audioCtx: AudioContext | null = null;
let isSfxEnabled = false;

// Safe lazy loading of AudioContext
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Toggle SFX status
export const setSfxEnabledInStorage = (enabled: boolean) => {
  isSfxEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('carecalculus-audio-sfx', enabled ? 'true' : 'false');
    if (enabled) {
      getAudioContext();
    }
  }
};

export const getSfxEnabledInit = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('carecalculus-audio-sfx');
    isSfxEnabled = saved === 'true'; // Disabled by default for normal client preference compliance, easy to toggle on for game feel
    return isSfxEnabled;
  }
  return false;
};

// Play a tactile micro-click with filtered resonance (like a sleek gaming console menu hover)
export const playTactileClick = () => {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  // Rapid decay click
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.015, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

// Play a sleek, futuristic select tone (like entering a critical menu)
export const playSleekSelect = () => {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();

  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc2.connect(gain2); gain2.connect(ctx.destination);

  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(440, now);
  osc1.frequency.setValueAtTime(880, now + 0.06);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(554.37, now); // major third
  osc2.frequency.setValueAtTime(1108.73, now + 0.06);

  gain1.gain.setValueAtTime(0.02, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  gain2.gain.setValueAtTime(0.012, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

  osc1.start();
  osc1.stop(now + 0.16);
  osc2.start();
  osc2.stop(now + 0.16);
};

// Play a telemetry dial micro beep (for slider drags)
let lastBeepTime = 0;
export const playDialTick = (valFactor: number = 0.5) => {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Throttle dial satisfy feedback to avoid audio engine overflow congestion
  if (now - lastBeepTime < 0.04) return;
  lastBeepTime = now;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  const pitch = 600 + (valFactor * 1000); // changes pitch dynamically with input value level
  osc.frequency.setValueAtTime(pitch, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);

  gain.gain.setValueAtTime(0.008, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  osc.start();
  osc.stop(now + 0.03);
};

// Play a clinical metric success alarm/chime (triggered on good scores or successful calculations)
export const playTelemetrySuccess = () => {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
  osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
  osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(523.25 / 2, now);
  osc2.frequency.setValueAtTime(1046.50 / 2, now + 0.24);

  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.025, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

  osc.start();
  osc.stop(now + 0.5);
  osc2.start();
  osc2.stop(now + 0.5);
};

// Play warning signal for low perfusion or high-risk assessments
export const playTelemetryAlert = () => {
  if (!isSfxEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.linearRampToValueAtTime(140, now + 0.12);
  osc.frequency.linearRampToValueAtTime(180, now + 0.24);

  // Soft high-pass to avoid speaker rumble
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(120, now);
  osc.disconnect(gain);
  osc.connect(hp);
  hp.connect(gain);

  gain.gain.setValueAtTime(0.015, now);
  gain.gain.exponentialRampToValueAtTime(0.015, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  osc.start();
  osc.stop(now + 0.38);
};
