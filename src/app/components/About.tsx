import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, MapPin, Zap, Users } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { RevealFade, RevealLine, RevealStagger } from './ScrollReveal';
import pilotImg from '../../imports/image-5.png';

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1.6) {
  const [count, setCount] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const elapsed  = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      // Cubic ease-out for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, target, duration]);

  return { count, ref };
}

// ─── Individual stat cell with count-up ──────────────────────────────────────
interface StatConfig {
  num:    number | null;
  val?:   string;           // Used when num is null (e.g. "4K")
  suffix: string;
  label:  string;
  icon:   string;
}

function StatCell({ s, i }: { s: StatConfig; i: number }) {
  const { count, ref } = useCountUp(s.num ?? 0, 1.6 + i * 0.1);

  return (
    <TiltCard intensity={8} hoverScale={1.03} glare>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: i * 0.09 }}
        className="p-4 sm:p-6 rounded-2xl bg-white/3 border border-white/8 text-center hover:border-cyan-500/25 transition-all duration-300 hover:bg-white/5"
      >
        <div className="text-3xl mb-3">{s.icon}</div>
        <div ref={s.num !== null ? ref : undefined} className="text-3xl font-black text-cyan-400 mb-1">
          {s.num !== null ? `${count}${s.suffix}` : s.val}
        </div>
        <div className="text-gray-500 font-mono text-xs tracking-widest uppercase">{s.label}</div>
      </motion.div>
    </TiltCard>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS: StatConfig[] = [
  { num: 300,  suffix: '+', label: 'Aerial Missions',    icon: '🛸' },
  { num: null, val: '4K',  suffix: '',  label: 'DJI Quality',       icon: '🎥' },
  { num: 48,   suffix: 'H', label: 'Fast Delivery',     icon: '⚡' },
  { num: 100,  suffix: '%', label: 'Client Satisfaction', icon: '⭐' },
];

const WHY = [
  {
    icon: Award,
    title: 'DJI Certified Pilot',
    desc: 'Trained and certified to fly professionally with DJI drones — safe, legal, and precise.',
  },
  {
    icon: MapPin,
    title: 'Based in Jaffna, Fly Island-Wide',
    desc: "Operating across all of Sri Lanka — from Jaffna's heritage sites to the southern beaches.",
  },
  {
    icon: Zap,
    title: 'Fast 48-Hour Delivery',
    desc: 'Get your edited footage back in 48 hours. No more waiting weeks for your content.',
  },
  {
    icon: Users,
    title: 'Your Vision, Our Expertise',
    desc: 'We plan every shoot around your creative brief — collaborating to exceed your expectations.',
  },
];

const BADGES = [
  { label: 'DJI Certified Pilot',    icon: '✈️' },
  { label: 'Jaffna, Sri Lanka 🇱🇰',  icon: '📍' },
  { label: 'Aerial Cinematography',  icon: '🎬' },
  { label: '4K HDR Footage',         icon: '🎥' },
  { label: 'Island-wide Coverage',   icon: '🗺️' },
];

// ─── About section ────────────────────────────────────────────────────────────
export function About() {
  return (
    <section className="relative w-full py-16 sm:py-28 z-20 bg-[#07070a] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Decorative glows */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -right-40 top-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

        {/* ── Stats bar with count-up ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-16 sm:mb-24">
          {STATS.map((s, i) => (
            <StatCell key={s.label} s={s} i={i} />
          ))}
        </div>

        {/* ── About content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">

          {/* Left: Text */}
          <RevealFade x={-30} y={0} delay={0.05}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400">About Us</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 uppercase">
              <RevealLine delay={0.1}>Sri Lanka's Premier</RevealLine>
              <RevealLine delay={0.2}>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Drone Cinematographer
                </span>
              </RevealLine>
            </h2>

            <RevealFade delay={0.25} y={16}>
              <p className="text-gray-400 leading-relaxed mb-6">
                SkyView Cinemas is a professional drone cinematography service based in{' '}
                <strong className="text-white">Jaffna, Sri Lanka</strong>. Founded by a DJI-certified pilot
                with a passion for storytelling through the sky, we specialize in capturing Sri Lanka's
                extraordinary landscapes, cultural landmarks, and life events from breathtaking aerial perspectives.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Whether you're a filmmaker, hotelier, real estate developer, or someone planning their dream
                wedding — our 4K DJI footage will elevate your project to the next level. 🎥🛸
              </p>
            </RevealFade>

            <RevealFade delay={0.35} y={12}>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.tiktok.com/@skyviewcinemas6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#fe2c55]/50 text-white hover:text-[#fe2c55] text-sm font-mono tracking-wide transition-all duration-200 hover:scale-105"
                >
                  📱 Follow on TikTok
                </a>
                <a
                  href="https://www.instagram.com/paran_eethan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#e1306c]/50 text-white hover:text-[#e1306c] text-sm font-mono tracking-wide transition-all duration-200 hover:scale-105"
                >
                  📸 Instagram
                </a>
              </div>
            </RevealFade>
          </RevealFade>

          {/* Right: Pilot photo + Why-us grid */}
          <div className="flex flex-col items-center gap-10">

            {/* ── Pilot photo — colourful round frame ── */}
            <RevealFade delay={0.15} y={20}>
              <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 flex-shrink-0">
                {/* Spinning rainbow gradient ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #00f3ff, #7c3aed, #ec4899, #f59e0b, #10b981, #00f3ff)',
                    padding: '3px',
                  }}
                />
                {/* Static inner ring for depth */}
                <div className="absolute inset-[3px] rounded-full bg-[#07070a]" />
                {/* Photo */}
                <img
                  src={pilotImg}
                  alt="SkyView Cinemas Pilot"
                  className="absolute inset-[6px] rounded-full object-cover w-[calc(100%-12px)] h-[calc(100%-12px)]"
                />
                {/* Glow bloom */}
                <div className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: '0 0 40px 8px rgba(0,243,255,0.18), 0 0 80px 20px rgba(124,58,237,0.12)' }}
                />
                {/* DJI badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 text-black font-black text-[10px] tracking-widest uppercase shadow-[0_0_16px_rgba(0,243,255,0.5)] whitespace-nowrap"
                >
                  ✈️ DJI Certified Pilot
                </motion.div>
              </div>
            </RevealFade>

            {/* Why-us grid */}
            <RevealStagger stagger={0.1} delay={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {WHY.map((item) => (
                <TiltCard key={item.title} intensity={10} hoverScale={1.03} glare>
                  <div className="p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-cyan-500/25 hover:bg-white/5 transition-all duration-300 group h-full">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                      <item.icon size={18} className="text-cyan-400" />
                    </div>
                    <h4 className="text-white font-black text-sm mb-2 leading-tight">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </TiltCard>
              ))}
            </RevealStagger>
          </div>

        </div>

        {/* ── Pilot credential badges ── */}
        <RevealFade delay={0.2} y={18} className="mt-12 sm:mt-20">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {BADGES.map(b => (
              <div
                key={b.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/4 border border-white/10 text-gray-400 text-xs font-mono tracking-wide"
              >
                <span>{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </RevealFade>
      </div>
    </section>
  );
}