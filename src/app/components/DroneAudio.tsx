import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * DroneAudio — Web Audio API synthesized drone ambience.
 *
 * Sound design:
 *  • 4 oscillators slightly detuned (85 / 87 / 89 / 91 Hz) — 4 motors
 *  • 2nd harmonic layer (~174 Hz) — prop fundamental
 *  • 4th harmonic layer (~348 Hz) — prop wash buzz
 *  • LFO per oscillator (0.05–0.15 Hz) — organic motor variance
 *  • Filtered white noise (BPF @ 1 200 Hz) — air / blade hiss
 *  • Master compressor → smooth, non-harsh output
 *  • Master gain = 0.07, fade-in over 4 s
 *
 * Browsers require a user gesture before starting AudioContext.
 * We listen for the first click / scroll / touchstart then start.
 */

interface DroneAudioNode {
  ctx: AudioContext;
  master: GainNode;
  stop: () => void;
}

function buildDroneAudio(): DroneAudioNode {
  // @ts-ignore - support for older/prefixed browsers
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API not supported in this browser');
  }
  
  const ctx = new AudioContextClass();

  // ── Master chain ──────────────────────────────────────────────────────────
  const master = ctx.createGain();
  // Set initial value immediately
  master.gain.setValueAtTime(0, ctx.currentTime);
  // We'll ramp up after resume is confirmed in the start function
  // but we set the target here for safety
  master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3); 

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 8;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.1;
  compressor.release.value = 0.6;

  master.connect(compressor);
  compressor.connect(ctx.destination);

  const oscillators: OscillatorNode[] = [];
  const baseFreqs: number[] = [];
  const lfos: OscillatorNode[] = [];

  // ── Helper: create one motor oscillator with LFO vibrato ─────────────────
  function addMotor(freq: number, gainVal: number, lfoRate: number, lfoDepth: number) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = lfoRate;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = lfoDepth;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const oscGain = ctx.createGain();
    oscGain.gain.value = gainVal;

    // Slight low-pass to soften
    const lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = freq * 6;
    lpf.Q.value = 0.5;

    osc.connect(lpf);
    lpf.connect(oscGain);
    oscGain.connect(master);

    osc.start();
    lfo.start();
    oscillators.push(osc);
    baseFreqs.push(freq);
    lfos.push(lfo);
  }

  // ── 4 motors (fundamental) ───────────────────────────────────────────────
  addMotor(85,  0.55, 0.07, 0.6);
  addMotor(87,  0.55, 0.11, 0.7);
  addMotor(89,  0.55, 0.05, 0.5);
  addMotor(91,  0.55, 0.13, 0.8);

  // ── 2nd harmonic — propeller fundamental ────────────────────────────────
  addMotor(174, 0.18, 0.09, 1.2);

  // ── 4th harmonic — prop wash ─────────────────────────────────────────────
  addMotor(348, 0.08, 0.17, 1.5);

  // ── Filtered noise — air / blade hiss ───────────────────────────────────
  (function addNoise() {
    const bufLen = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 1200;
    bpf.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    src.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(master);
    src.start();
  })();

  let animId: number;
  function tick() {
    animId = requestAnimationFrame(tick);
    if (ctx.state !== 'running') return;
    
    // Read speed exposed by DroneScene
    const speed = (window as any).__droneSpeed || 0;
    
    // speed usually 0 to ~5. map to 1.0 to 1.8x pitch
    const pitchMul = 1.0 + Math.min(speed, 5.0) * 0.16;
    
    const now = ctx.currentTime;
    oscillators.forEach((osc, i) => {
      osc.frequency.setTargetAtTime(baseFreqs[i] * pitchMul, now, 0.05);
    });
  }
  tick();

  function stop() {
    cancelAnimationFrame(animId);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      try {
        oscillators.forEach(o => o.stop());
        lfos.forEach(l => l.stop());
        ctx.close();
      } catch {}
    }, 1600);
  }

  return { ctx, master, stop };
}

export function DroneAudio() {
  const audioRef = useRef<DroneAudioNode | null>(null);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (audioRef.current) return;
    try {
      const audioNode = buildDroneAudio();
      audioRef.current = audioNode;

      // Ensure the context resumes; some browsers block it until a real task on the context is performed
      audioNode.ctx.resume().then(() => {
        // Once resumed, start fading in smoothly using a decay-based approach (safer than ramp)
        audioNode.master.gain.setTargetAtTime(0.07, audioNode.ctx.currentTime, 0.8);
        setStarted(true);
      });
    } catch (e) {
      console.warn('DroneAudio: could not create AudioContext', e);
    }
  }, []);

  // Attempt autoplay immediately; fallback to user interaction if blocked
  useEffect(() => {
    start();
    
    if (started) return;

    const trigger = () => {
      if (started) return;
      if (!audioRef.current) {
        start();
      } else if (audioRef.current.ctx.state === 'suspended') {
        audioRef.current.ctx.resume()
          .then(() => {
            if (audioRef.current) {
              audioRef.current.master.gain.setTargetAtTime(0.07, audioRef.current.ctx.currentTime, 0.8);
            }
            setStarted(true);
          })
          .catch(() => {});
      } else if (audioRef.current.ctx.state === 'running') {
        if (audioRef.current) {
            audioRef.current.master.gain.setTargetAtTime(0.07, audioRef.current.ctx.currentTime, 0.8);
        }
        setStarted(true);
      }
    };
    
    // Listen to virtually ANY user action to immediately resume audio
    const events = ['click', 'pointerdown', 'keydown', 'mousemove', 'wheel', 'touchstart', 'touchend', 'scroll'];
    
    events.forEach(evt => window.addEventListener(evt, trigger, { passive: true }));

    // Show hint after 1.5 s if not yet started
    hintTimerRef.current = setTimeout(() => {
      if (!audioRef.current || audioRef.current.ctx.state !== 'running') {
        setShowHint(true);
      }
    }, 1500);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, trigger));
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [start, started]);

  // Hide hint once started
  useEffect(() => {
    if (started) setShowHint(false);
  }, [started]);

  // Mute / unmute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const { master, ctx } = audioRef.current;
    if (muted) {
      master.gain.setTargetAtTime(0.07, ctx.currentTime, 0.4);
    } else {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    }
    setMuted(m => !m);
  }, [muted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { audioRef.current?.stop(); };
  }, []);

  return (
    <>
      {/* ── Prominent "Click to unmute" overlay button ─────────────────────── */}
      <AnimatePresence>
        {(!started || showHint) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[80] pointer-events-auto cursor-pointer"
            onClick={() => {
              if (audioRef.current && audioRef.current.ctx.state === 'suspended') {
                 audioRef.current.ctx.resume().then(() => {
                   audioRef.current?.master.gain.setTargetAtTime(0.07, audioRef.current.ctx.currentTime, 0.8);
                   setStarted(true);
                 });
              }
            }}
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-md border border-cyan-400/50 text-cyan-50 font-sans text-sm font-medium tracking-wide uppercase transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-300">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              Click to Unmute
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mute / unmute button (appears after audio starts) ──────────── */}
      <AnimatePresence>
        {started && (
          <motion.button
            key="mute-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            onClick={toggleMute}
            title={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
            className="fixed bottom-6 right-6 z-[80] w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:border-cyan-500/40 text-gray-400 hover:text-cyan-400 transition-all duration-200 shadow-lg group"
          >
            {muted ? (
              /* speaker-off icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              /* speaker-on icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
