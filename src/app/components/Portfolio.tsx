import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { TikTokGrid } from './TikTokGrid';

export function Portfolio() {
  return (
    <section className="relative w-full py-16 sm:py-28 z-20 bg-[#07070a]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400">Our Work</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Sri Lanka <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">From Above</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Every frame captured by a DJI certified pilot — exploring the island's most spectacular locations.
          </p>
        </motion.div>

        {/* ── TikTok Videos ── */}
        <TikTokGrid />

        {/* ── Social CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12 sm:mt-16 p-6 sm:p-8 rounded-2xl bg-white/3 border border-white/8"
        >
          <p className="text-gray-300 mb-2 font-medium">See more of our work daily on social media</p>
          <p className="text-gray-500 text-sm mb-6">TikTok · Instagram · Facebook — new aerial shots every week 🛸</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.tiktok.com/@skyviewcinemas6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010101] border border-white/10 hover:border-white/30 text-white font-mono text-xs tracking-widest uppercase transition-all hover:scale-105"
            >
              <span className="text-[#fe2c55]">📱</span> TikTok
              <ExternalLink size={10} className="text-gray-500" />
            </a>
            <a
              href="https://www.instagram.com/paran_eethan/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900/30 to-rose-900/30 border border-white/10 hover:border-white/30 text-white font-mono text-xs tracking-widest uppercase transition-all hover:scale-105"
            >
              <span>📸</span> Instagram
              <ExternalLink size={10} className="text-gray-500" />
            </a>
            <a
              href="https://web.facebook.com/profile.php?id=100067223204730"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900/30 border border-white/10 hover:border-white/30 text-white font-mono text-xs tracking-widest uppercase transition-all hover:scale-105"
            >
              <span>💬</span> Facebook
              <ExternalLink size={10} className="text-gray-500" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}