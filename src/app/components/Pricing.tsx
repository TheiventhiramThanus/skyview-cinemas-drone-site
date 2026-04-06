import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, MessageCircle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const plans = [
  {
    emoji: '🚁',
    name: 'Basic',
    tagline: 'Great for social media & small shoots',
    price: 'LKR 10,000',
    desc: 'Perfect for small property shoots, social media reels, or a single location aerial clip.',
    features: [
      '1 Hour flight time',
      '10 edited aerial photos',
      '60 sec 4K video clip',
      'Raw footage included',
      'Delivery in 3 days',
    ],
    highlight: false,
    cta: 'Get Started',
  },
  {
    emoji: '🎬',
    name: 'Standard',
    tagline: 'Most popular — best value',
    price: 'LKR 16,000',
    desc: 'Ideal for weddings, real estate, tourism content, and short cinematic films.',
    features: [
      '3 Hours flight time',
      '25 retouched aerial photos',
      '2–3 min cinematic edit',
      'Color grading included',
      'Priority 48hr delivery',
      'One location revision',
    ],
    highlight: true,
    cta: 'Book This Package',
  },
  {
    emoji: '🏆',
    name: 'Premium',
    tagline: 'Full production, island-wide',
    price: 'LKR 25,000',
    desc: 'Full-day aerial production for major events, commercial campaigns, and cinematic projects across Sri Lanka.',
    features: [
      'Full day shoot (6–8 hrs)',
      'Unlimited aerial shots',
      'Multiple edited videos',
      'Cinematic color grade',
      'Sound design included',
      'Island-wide coverage 🇱🇰',
    ],
    highlight: false,
    cta: 'Request a Quote',
  },
];

export function Pricing() {
  const { isDark } = useTheme();

  return (
    <section className="relative w-full py-16 sm:py-28 z-20 bg-[#060608]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,243,255,0.04)_0%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400">🇱🇰 Sri Lanka Pricing</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Packages</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Transparent local pricing — no hidden fees. All packages include edited footage ready to publish.
          </p>
        </motion.div>

        {/* ── Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden
                ${plan.highlight
                  ? 'bg-gradient-to-b from-cyan-950/40 to-black border-cyan-400/40 shadow-[0_0_50px_rgba(0,243,255,0.12)] md:scale-105'
                  : 'bg-white/3 border-white/10 hover:border-white/25 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]'
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/0 via-cyan-400 to-cyan-500/0" />
              )}
              {plan.highlight && (
                <div className="flex justify-center pt-4">
                  <span className="px-4 py-1 rounded-full bg-cyan-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.4)]">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <div className={`p-5 sm:p-7 flex flex-col flex-1 ${plan.highlight ? 'pt-4' : ''}`}>
                {/* Icon + name */}
                <div className="text-3xl mb-4">{plan.emoji}</div>
                <div className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-1">{plan.tagline}</div>
                <h3 className="text-2xl font-black text-white mb-3">{plan.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-cyan-400' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">/ shoot</span>
                </div>

                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{plan.desc}</p>

                {/* Features */}
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check size={15} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-cyan-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300
                    ${plan.highlight
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]'
                      : 'bg-white/8 hover:bg-white/14 text-white border border-white/15 hover:border-white/30'
                    }`}
                >
                  {plan.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── WhatsApp CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-14 p-6 sm:p-8 rounded-2xl bg-white/3 border border-white/8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 max-w-5xl mx-auto"
        >
          <div>
            <div className="text-white font-black text-xl mb-1">Need a custom package?</div>
            <p className="text-gray-400 text-sm">Multi-location shoots, corporate projects, or tourism campaigns — let's build your perfect plan.</p>
          </div>
          <a
            href="https://wa.me/94771713282?text=Hi%20SkyView%20Cinemas!%20I%20need%20a%20custom%20quote%20for%20my%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 border border-green-400/30 hover:border-green-400/60 text-green-400 font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105"
          >
            <MessageCircle size={18} />
            WhatsApp Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}