"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Low-volume brown-noise focus pad. No volume controls — output gain is fixed
 * at 0.04 (quiet enough to fade behind any other sound on the desk).
 *
 * Toggled by the MobileTopBar + NavRail sound buttons via localStorage["sound"].
 * We listen for the cross-tab `storage` event and a same-tab `sound-toggle`
 * CustomEvent so any button anywhere on the page can flip it.
 *
 * WebAudio-generated, so there's nothing to license or host — and it loops
 * forever by construction.
 */
export function FocusAudio() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // Pick up the persisted setting on mount + listen for toggles.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setEnabled(localStorage.getItem("sound") === "true");

    const sync = () => setEnabled(localStorage.getItem("sound") === "true");
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "sound") sync();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("sound-toggle", sync);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("sound-toggle", sync);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!enabled) {
      stopRef.current?.();
      stopRef.current = null;
      return;
    }

    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctx =
      window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    ctxRef.current = ctx;

    // Brown noise via low-passed white noise. Fed through a gentle high-shelf
    // dip + 800Hz low-pass to keep it warm. Equivalent to brain.fm's
    // background bed, minus the binaural beat (which can be unsettling for
    // people new to it).
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 800;
    lowpass.Q.value = 0.7;

    // Subtle slow tremolo to keep it from feeling static.
    const tremoloOsc = ctx.createOscillator();
    tremoloOsc.frequency.value = 0.08; // one cycle every ~12s
    const tremoloGain = ctx.createGain();
    tremoloGain.gain.value = 0.012; // tremolo depth
    tremoloOsc.connect(tremoloGain);

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.04; // hard-fixed quiet
    tremoloGain.connect(masterGain.gain);

    noiseSource.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);

    noiseSource.start();
    tremoloOsc.start();

    // Autoplay policy: first interaction resumes the context if browser
    // suspended it on load.
    const resume = () => {
      ctx.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", resume, { once: true });

    stopRef.current = () => {
      try {
        noiseSource.stop();
        tremoloOsc.stop();
      } catch {}
      ctx.close().catch(() => {});
      window.removeEventListener("pointerdown", resume);
    };

    return () => {
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [enabled]);

  return null;
}
