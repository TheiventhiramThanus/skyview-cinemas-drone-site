import React from 'react';
import { motion } from 'motion/react';
import { Film, Home, Heart, Globe, ArrowRight } from 'lucide-react';
import { TiltCard } from './TiltCard';
import { RevealFade } from './ScrollReveal';

const services = [
  {
    icon: Film,
    emoji: '🎬',
    title: 'Cinematic Films',
    tagline: 'Movie-quality aerial footage',
    description: 'Professional aerial cinematography for commercials, short films, and music videos — with cinematic color grading included.',
    features: ['4K 60fps DJI footage', 'Color graded delivery', 'Cinematic LUTs applied', 'Same-week delivery'],
    color: 'from-purple-500/20 to-blue-500/10',
    accent: '#a855f7',
    image: 'https://images.unsplash.com/photo-1769337950338-e9e7756f8e6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBkcm9uZSUyMGFlcmlhbCUyMGNpdHklMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzQ5NTY1MDR8MA&ixlib=rb-4.1.0&q=80&w=800',
  },
  {
    icon: Home,
    emoji: '🏡',
    title: 'Real Estate',
    tagline: 'Sell faster with aerial views',
    description: 'Stunning property overviews that showcase land, architecture, and surroundings — making your listing stand out.',
    features: ['Top-down property shots', 'Neighborhood context', 'Fast 48hr turnaround', 'MLS-ready resolution'],
    color: 'from-cyan-500/20 to-teal-500/10',
    accent: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1635111031688-9b13c0125d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzQ4OTk2NjJ8MA&ixlib=rb-4.1.0&q=80&w=800',
  },
  {
    icon: Heart,
    emoji: '💍',
    title: 'Weddings & Events',
    tagline: 'Memories from the sky',
    description: 'Capture the full scale and emotion of your special day from above — sweeping shots no ground camera can match.',
    features: ['Ceremony fly-overs', 'Crowd & venue scale', 'Highlight reel cut', 'Discreet operation'],
    color: 'from-rose-500/20 to-orange-500/10',
    accent: '#f43f5e',
    image: 'https://images.unsplash.com/photo-1689185976523-34c831b10577?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMHdlZGRpbmclMjBjZXJlbW9ueSUyMGFlcmlhbCUyMGRyb25lfGVufDF8fHx8MTc3NDk1NjQ5OXww&ixlib=rb-4.1.0&q=80&w=800',
  },
  {
    icon: Globe,
    emoji: '🌴',
    title: 'Tourism & Travel',
    tagline: "Show Sri Lanka's beauty",
    description: "Breathtaking aerial content for hotels, tourism boards, and travel creators highlighting Sri Lanka's hidden gems.",
    features: ['Coastal & landscape shots', 'Sunrise/sunset magic', 'Instagram-ready edits', 'Full island coverage'],
    color: 'from-emerald-500/20 to-cyan-500/10',
    accent: '#10b981',
    image: 'https://images.unsplash.com/photo-1691849233457-837d8e2f9da3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0JTIwYWVyaWFsJTIwdmlldyUyMG9jZWFufGVufDF8fHx8MTc3NDk1NjUwM3ww&ixlib=rb-4.1.0&q=80&w=800',
  },
];

export function Services() {
  return (
    <section className="relative w-full py-16 sm:py-28 z-20 bg-[#060608]">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

        {/* ── Header ── */}
        <RevealFade y={40} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400">What We Do</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Services
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            From Jaffna to the south coast — we fly anywhere in Sri Lanka to bring your vision to life.
          </p>
        </RevealFade>

        {/* ── Service Cards — TiltCard wraps each card ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <TiltCard
              key={service.title}
              intensity={10}
              hoverScale={1.01}
              glare
              className="rounded-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-white/8 bg-white/3 hover:border-white/20 transition-colors duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#060608]/90 via-[#060608]/70 to-[#060608]/50" />
                </div>

                {/* Color accent top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)` }}
                />

                <div className="relative z-10 p-5 sm:p-8">
                  {/* Icon + emoji */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-white/10 bg-white/5 group-hover:scale-110 transition-transform duration-300"
                      style={{ boxShadow: `0 0 20px ${service.accent}30` }}
                    >
                      {service.emoji}
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 mt-2"
                    />
                  </div>

                  {/* Title */}
                  <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: service.accent }}>
                    {service.tagline}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>

                  {/* Feature list */}
                  <ul className="space-y-2">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: service.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <RevealFade delay={0.3} y={20} className="text-center mt-12 sm:mt-16">
          <p className="text-gray-500 mb-5 text-sm">Not sure which service fits? Let's talk it through.</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-cyan-400/40 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-all duration-300"
          >
            Get a Free Quote
            <ArrowRight size={15} />
          </a>
        </RevealFade>
      </div>
    </section>
  );
}
