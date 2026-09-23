'use client';

// Web Audio synthesizer for Indian Classical Swars
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
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
}

// Base frequencies for Madhya Saptak (assuming Sa = C4 ~ 261.63 Hz)
const SWAR_FREQUENCIES: Record<string, number> = {
  S: 261.63, // Sa
  'R_': 277.18, // Komal Re (C#4)
  R: 293.66, // Shuddha Re (D4)
  'G_': 311.13, // Komal Ga (D#4)
  G: 329.63, // Shuddha Ga (E4)
  M: 349.23, // Shuddha Ma (F4)
  "M'": 369.99, // Teevra Ma (F#4)
  P: 392.0, // Pa (G4)
  'D_': 415.3, // Komal Dha (G#4)
  D: 440.0, // Shuddha Dha (A4)
  'N_': 466.16, // Komal Ni (A#4)
  N: 493.88, // Shuddha Ni (B4)
};

/**
 * Plays a warm harmonium/tanpura style tone for the given swar
 */
export function playSwarSound(swar: string, octave: 'low' | 'mid' | 'high' = 'mid') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let baseNote = swar.toUpperCase();
    if (baseNote.startsWith('(') && baseNote.endsWith(')')) {
      baseNote = baseNote.slice(1, -1);
    }
    baseNote = baseNote.replace(/\u0332/g, '_').replace(/[.']/g, '');

    let freq = SWAR_FREQUENCIES[baseNote] || SWAR_FREQUENCIES[baseNote[0]] || 261.63;

    // Adjust octave
    if (octave === 'low' || swar.includes('.')) {
      freq /= 2;
    } else if (octave === 'high' || swar.includes("'")) {
      freq *= 2;
    }

    const now = ctx.currentTime;

    // Primary oscillator (warm sawtooth/triangle hybrid for harmonium texture)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Sub oscillator for acoustic warmth
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Gain envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45); // Release

    // Connect audio graph
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.48);
    osc2.stop(now + 0.48);
  } catch {
    // Gracefully ignore audio failure if autoplay policy or browser block
  }
}
