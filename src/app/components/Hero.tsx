import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Play, ArrowDown, Camera, Wind, Zap, Star } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import pilotImg from '../../imports/image-5.png';

const CITY_VIDEO =
  'https://assets.mixkit.co/videos/preview/mixkit-city-traffic-at-night-from-a-drone-view-34015-large.mp4';

const STATS = [
  { val: '300+', label: 'Missions Flown',   icon: <Wind size={14} /> },
  { val: '4K',   label: 'DJI Quality',      icon: <Camera size={14} /> },
  { val: '48H',  label: 'Fast Delivery',    icon: <Zap size={14} /> },
];

const FEATURES = [
  { icon: <Camera size={15} />, text: 'Cinematic 4K DJI Footage' },
  { icon: <Wind  size={15} />, text: 'DJI Certified Pilot' },
  { icon: <Star  size={15} />, text: 'Aerial Perspectives of Sri Lanka' },
];

/* ─── Single propeller disc with motion-blur SVG filter ─── */
function Propeller({ uid, cw, isDark }: { uid: string; cw: boolean; isDark: boolean }) {
  const filterId = `mbf-${uid}`;
  const discColor   = isDark ? 'rgba(180,235,255,0.55)' : 'rgba(80,160,200,0.50)';
  const bladeColor  = isDark ? 'rgba(210,245,255,0.70)' : 'rgba(110,175,215,0.70)';
  const hubColor    = isDark ? '#c8eeff' : '#3a90b8';

  return (
    <div
      style={{
        width: 54, height: 54,
        animation: `prop-${cw ? 'cw' : 'ccw'} 0.13s linear infinite`,
        transformOrigin: 'center',
        willChange: 'transform',
      }}
    >
      <svg width="54" height="54" viewBox="-27 -27 54 54" style={{ overflow: 'visible' }}>
        <defs>
          {/* Radial motion blur: strong tangentially, soft radially */}
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.8 0.6" />
          </filter>
        </defs>

        {/* Blurred translucent disc — gives the spinning-disc look */}
        <ellipse cx="0" cy="0" rx="22" ry="22"
          fill={discColor}
          filter={`url(#${filterId})`}
        />

        {/* Two blades as thin rounded rects */}
        <rect x="-22" y="-3" width="44" height="6" rx="3" fill={bladeColor} opacity="0.85" />
        <rect x="-3"  y="-22" width="6" height="44" rx="3" fill={bladeColor} opacity="0.85" />

        {/* Hub */}
        <circle cx="0" cy="0" r="3.5" fill={hubColor} opacity="0.95" />
        <circle cx="0" cy="0" r="1.5" fill={isDark ? '#fff' : '#1a5f80'} opacity="0.9" />
      </svg>
    </div>
  );
}

/* ─── Full drone card: transparent bg + propellers + lighting ─── */
function FlyingDrone({ isDark }: { isDark: boolean }) {
  const hudRef = useRef<HTMLDivElement>(null);
  const tRef   = useRef(0);
  const rafRef = useRef(0);

  /* Live HUD readout only — position is handled by Motion */
  useEffect(() => {
    const tick = () => {
      tRef.current += 0.012;
      const t = tRef.current;
      if (hudRef.current) {
        const alt = (1180 + Math.sin(t * 1.7) * 95).toFixed(0);
        const spd = (22  + Math.abs(Math.sin(t * 2.1)) * 18).toFixed(0);
        hudRef.current.textContent = `ALT ${alt} FT  ·  SPD ${spd} MPH`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* Propeller corner offsets relative to the 280 px drone wrapper */
  const props = [
    { uid: 'fl', cw: true,  top:  '8px',  left:  '16px'  },
    { uid: 'fr', cw: false, top:  '8px',  right: '16px'  },
    { uid: 'bl', cw: false, bottom:'10px', left: '16px'  },
    { uid: 'br', cw: true,  bottom:'10px', right:'16px'  },
  ];

  /* Natural glow filter string */
  const glowFilter = isDark
    ? 'drop-shadow(0 0 18px rgba(80,200,255,0.85)) drop-shadow(0 0 50px rgba(0,180,255,0.4))'
    : 'drop-shadow(0 4px 12px rgba(0,100,180,0.55)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))';

  return (
    /* ── Outer flight motion — smooth looping figure-drift ── */
    <motion.div
      className="absolute z-10 pointer-events-none"
      style={{ top: '50%', left: '50%', x: '-50%', y: '-50%' }}
      animate={{
        /* Gentle figure-8-ish drift that stays visible in hero */
        x: ['-10%', '14%', '22%', '8%', '-6%', '-20%', '-14%', '-10%'],
        y: ['-8%',  '-18%', '0%', '12%', '6%',  '-4%', '-16%', '-8%'],
        rotate: [-3, 4, 2, -4, -2, 3, 5, -3],
      }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.86, 1],
      }}
    >
      {/* ── Inner hover bob ── */}
      <motion.div
        animate={{ y: [0, -10, 0, -6, 0], scaleX: [1, 1.012, 1, 1.008, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* ── Glow aura behind drone ── */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 50% 60%, rgba(0,200,255,0.45) 0%, transparent 65%)'
              : 'radial-gradient(circle at 50% 60%, rgba(0,140,220,0.25) 0%, transparent 60%)',
            transform: 'scale(1.9)',
            filter: 'blur(18px)',
          }}
          animate={{ opacity: [0.6, 1, 0.65, 1, 0.6] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* ── Drone wrapper — background removed via mix-blend-mode ── */}
        <div style={{ position: 'relative', width: 280, height: 220 }}>

          {/* Propellers sit BELOW the drone body */}
          {props.map(p => (
            <div
              key={p.uid}
              style={{
                position: 'absolute',
                top:    p.top,
                left:   p.left,
                right:  (p as any).right,
                bottom: (p as any).bottom,
                zIndex: 1,
              }}
            >
              <Propeller uid={p.uid} cw={p.cw} isDark={isDark} />
            </div>
          ))}

          {/* ── Drone PNG — white/solid bg stripped via screen blend ── */}
          <img
            src={droneImg}
            alt="SkyView Cinemas Drone"
            draggable={false}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              /* screen blend makes white bg fully transparent on dark,
                 multiply makes it transparent on light */
              mixBlendMode: isDark ? 'screen' : 'multiply',
              filter: glowFilter,
              userSelect: 'none',
            }}
          />

          {/* ── Subtle belly-light reflection below drone ── */}
          <div
            style={{
              position: 'absolute',
              bottom: '-18px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '12px',
              background: isDark
                ? 'radial-gradient(ellipse, rgba(0,200,255,0.45) 0%, transparent 70%)'
                : 'radial-gradient(ellipse, rgba(0,130,210,0.25) 0%, transparent 70%)',
              filter: 'blur(6px)',
              zIndex: 0,
            }}
          />
        </div>

        {/* ── HUD tag ── */}
        <motion.div
          ref={hudRef}
          className="absolute left-1/2 font-mono whitespace-nowrap"
          style={{
            top: '-30px',
            transform: 'translateX(-50%)',
            fontSize: '9px',
            letterSpacing: '0.14em',
            color:          isDark ? 'rgba(0,230,255,0.92)' : 'rgba(0,110,190,0.9)',
            background:     isDark ? 'rgba(0,8,22,0.78)' : 'rgba(255,255,255,0.84)',
            border:         `1px solid ${isDark ? 'rgba(0,200,255,0.3)' : 'rgba(0,140,210,0.35)'}`,
            backdropFilter: 'blur(8px)',
            padding:        '2px 8px',
            borderRadius:   '3px',
          }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        >
          ALT 1,180 FT  ·  SPD 22 MPH
        </motion.div>

        {/* ── Downward light beam ── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-52px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '3px',
            height: '52px',
            background: isDark
              ? 'linear-gradient(to bottom, rgba(0,220,255,0.7), transparent)'
              : 'linear-gradient(to bottom, rgba(0,160,230,0.5), transparent)',
            filter: 'blur(2px)',
            borderRadius: '2px',
          }}
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Hero ─── */
export function Hero() {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY }  = useScroll();

  const rawOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const opacity    = useSpring(rawOpacity, { stiffness: 80, damping: 22 });
  const rawY       = useTransform(scrollY, [0, 500], [0, 120]);
  const vidY       = useSpring(rawY,       { stiffness: 80, damping: 22 });

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden"
    >
      {/* ── Background ── */}
      {isDark ? (
        <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity, y: vidY }}>
          <video autoPlay loop muted playsInline src={CITY_VIDEO}
            className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/40 via-[#060608]/60 to-[#060608]" />
          <div className="absolute inset-0 pointer-events-none opacity-25"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,243,255,0.015) 3px,rgba(0,243,255,0.015) 4px)' }} />
        </motion.div>
      ) : (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/40 to-blue-50/60" />
          <div className="absolute inset-0 opacity-40"
            style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.08) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-blue-300/15 rounded-full blur-3xl" />
        </div>
      )}

      {/* ── Main content — two-column on lg ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 sm:pb-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

        {/* ── Left: text block ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">

          {/* Badge */}
          <motion.div
            className={`inline-flex items-center gap-2.5 px-3 sm:px-4 py-1.5 rounded-full border mb-6 sm:mb-8 ${isDark ? 'border-cyan-500/30 bg-cyan-950/40' : 'border-cyan-300 bg-cyan-50'}`}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.span
              className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-cyan-500'}`}
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className={`font-mono text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
              🛸 SkyView Cinemas · DJI Pilot · Jaffna
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className={`text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-5 sm:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Capture{' '}
            <span className={isDark
              ? 'text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500'
              : 'text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-700'}>
              The World
            </span>
            <br />From Above
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            className={`text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Capturing breathtaking aerial perspectives of{' '}
            <span className={isDark ? 'text-gray-100' : 'text-slate-800'}>Sri Lanka</span> —{' '}
            from the shores of <span className={isDark ? 'text-gray-100' : 'text-slate-800'}>Jaffna</span> to the{' '}
            <span className={isDark ? 'text-gray-100' : 'text-slate-800'}>island's hidden wonders</span>.{' '}
            Delivered in stunning 4K by a DJI certified pilot. 🎥🛸
          </motion.p>

          {/* Feature chips */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8 sm:mb-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {FEATURES.map(f => (
              <div key={f.text}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isDark ? 'bg-white/4 border border-white/8 text-gray-300' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
                <span className={isDark ? 'text-cyan-400' : 'text-cyan-600'}>{f.icon}</span>
                {f.text}
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.a href="#contact" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className={`px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-200 ${isDark ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_28px_rgba(0,243,255,0.4)]' : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/30'}`}>
              Book a Flight
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className={`flex items-center justify-center lg:justify-start gap-6 sm:gap-12 pt-6 sm:pt-8 border-t w-full max-w-md ${isDark ? 'border-white/10' : 'border-slate-200'}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <span className={isDark ? 'text-cyan-400/60' : 'text-cyan-500/70'}>{s.icon}</span>
                  <span className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{s.val}</span>
                </div>
                <div className={`font-mono text-[9px] sm:text-[10px] tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Pilot portrait ── */}
        <motion.div
          className="flex-shrink-0 flex items-center justify-center order-1 lg:order-2 pt-10 pb-8 lg:pt-0 lg:pb-0"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Floating bob */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-80 lg:h-80"
          >
            {/* Outer ambient glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(124,58,237,0.1) 50%, transparent 70%)',
                transform: 'scale(1.4)',
                filter: 'blur(24px)',
              }}
            />

            {/* Spinning conic rainbow ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #00f3ff, #7c3aed, #ec4899, #f59e0b, #10b981, #3b82f6, #00f3ff)',
                padding: '4px',
                borderRadius: '9999px',
              }}
            />

            {/* Dark separator ring */}
            <div className="absolute inset-[4px] rounded-full bg-[#060608]" />

            {/* Photo */}
            <img
              src={pilotImg}
              alt="SkyView Cinemas Pilot — Jaffna, Sri Lanka"
              className="absolute inset-[8px] rounded-full object-cover"
              style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 16px)' }}
            />

            {/* Gloss shine overlay */}
            <div
              className="absolute inset-[8px] rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
              }}
            />

            {/* Box glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: '0 0 50px 10px rgba(0,243,255,0.2), 0 0 100px 30px rgba(124,58,237,0.1)' }}
            />

            {/* DJI badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, delay: 1.1 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 text-black font-black text-[10px] tracking-widest uppercase shadow-[0_0_20px_rgba(0,243,255,0.6)] whitespace-nowrap z-10"
            >
              ✈️ DJI Certified Pilot
            </motion.div>

            {/* Location badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, delay: 1.3 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] tracking-widest uppercase whitespace-nowrap z-10"
            >
              📍 Jaffna, Sri Lanka 🇱🇰
            </motion.div>
          </motion.div>
        </motion.div>

      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ opacity }}
      >
        <span className={`font-mono text-[10px] tracking-[0.3em] uppercase ${isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
          Scroll to Explore
        </span>
        <motion.div
          className={`w-[1px] h-8 origin-top ${isDark ? 'bg-gradient-to-b from-cyan-400/60 to-transparent' : 'bg-gradient-to-b from-cyan-600/60 to-transparent'}`}
          animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ArrowDown size={14} className={isDark ? 'text-cyan-400/60' : 'text-cyan-600/60'} />
      </motion.div>
    </section>
  );
}