import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../ThemeContext';

// Social media brand configs
const SOCIALS = [
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@skyviewcinemas6',
    url: 'https://www.tiktok.com/@skyviewcinemas6',
    color: '#010101',
    accent: '#fe2c55',
    accent2: '#25f4ee',
    followers: '🎬 Drone Reels',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@paran_eethan',
    url: 'https://www.instagram.com/paran_eethan/',
    color: '#833ab4',
    accent: '#fd1d1d',
    accent2: '#fcb045',
    followers: '📸 Aerial Shots',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'SkyView Cinemas',
    url: 'https://web.facebook.com/profile.php?id=100067223204730',
    color: '#1877f2',
    accent: '#1877f2',
    accent2: '#42b72a',
    followers: '📡 Updates & BTS',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

// Video thumbnail cards for social grid
const VIDEO_CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1648819955157-a9a96e307d56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMGFlcmlhbCUyMGNvYXN0bGluZSUyMGRyb25lfGVufDF8fHx8MTc3NDk0OTE5OXww&ixlib=rb-4.1.0&q=80&w=600',
    caption: 'Jaffna Coastline',
    platform: 'tiktok',
    views: '12.4K',
  },
  {
    img: 'https://images.unsplash.com/photo-1715526575128-88b04cb67556?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMGxhbmRzY2FwZSUyMG5hdHVyZSUyMGFlcmlhbCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3NDk0OTIwM3ww&ixlib=rb-4.1.0&q=80&w=600',
    caption: 'Sri Lanka Highlands',
    platform: 'instagram',
    views: '8.7K',
  },
  {
    img: 'https://images.unsplash.com/photo-1711797750174-c3750dd9d7c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYSUyMHRlbXBsZSUyMGFlcmlhbCUyMGRyb25lfGVufDF8fHx8MTc3NDk0OTIwMHww&ixlib=rb-4.1.0&q=80&w=600',
    caption: 'Sacred Temples',
    platform: 'tiktok',
    views: '21.3K',
  },
  {
    img: 'https://images.unsplash.com/photo-1755020474216-ed177238a993?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMG9jZWFuJTIwYmVhY2glMjBzdW5zZXQlMjB0cm9waWNhbCUyMGFlcmlhbHxlbnwxfHx8fDE3NzQ5NDkyMDN8MA&ixlib=rb-4.1.0&q=80&w=600',
    caption: 'Sunset Ocean Shot',
    platform: 'instagram',
    views: '15.9K',
  },
];

const PLATFORM_COLOR: Record<string, string> = {
  tiktok: '#fe2c55',
  instagram: '#e1306c',
  facebook: '#1877f2',
};

const PLATFORM_LABEL: Record<string, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

export function Showreel() {
  const { isDark } = useTheme();
  const [playing, setPlaying] = useState(false);

  return (
    <section className={`relative w-full py-32 z-20 ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      {/* Top decorative line */}
      <div className={`absolute top-0 w-full h-[1px] ${isDark ? 'bg-gradient-to-r from-transparent via-orange-500/40 to-transparent' : 'bg-gradient-to-r from-transparent via-orange-300/50 to-transparent'}`} />

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className={`font-mono text-sm tracking-[0.2em] mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
            🎥 DJI CINEMATOGRAPHY · JAFFNA, SRI LANKA
          </div>
          <h2 className={`text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Showreel</span>
          </h2>
          <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            Capturing Sri Lanka's breathtaking landscapes from above — follow us on social media for the latest aerial content.
          </p>
        </motion.div>

        {/* ── Main Showreel Video ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`relative aspect-video w-full rounded-2xl overflow-hidden group cursor-pointer border mb-20
            ${isDark
              ? 'border-white/10 shadow-[0_0_50px_rgba(255,170,0,0.15)]'
              : 'border-slate-200 shadow-2xl shadow-orange-200/30'
            }`}
          onClick={() => setPlaying(true)}
        >
          <div className="absolute inset-0 z-0">
            <video
              autoPlay loop muted playsInline
              src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-the-beach-4015-large.mp4"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-2xl group-hover:bg-orange-400/50 transition-colors duration-500 scale-150" />
              <PlayCircle
                size={96}
                className="text-white/90 group-hover:text-white transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,170,0,0.8)] group-hover:scale-110"
                strokeWidth={1}
              />
            </div>
          </div>

          {/* Badges bottom-left */}
          <div className="absolute bottom-8 left-8 z-10 flex items-center gap-3">
            <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded border border-white/20 text-white font-mono text-sm tracking-widest">
              PLAY FILM
            </div>
            <div className="px-3 py-1.5 bg-orange-600/80 backdrop-blur-md rounded border border-orange-400 text-white font-mono text-sm tracking-widest shadow-[0_0_10px_rgba(255,170,0,0.5)]">
              4K 60FPS
            </div>
          </div>

          {/* Brand watermark */}
          <div className="absolute top-6 right-6 z-10">
            <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded border border-white/15 text-white font-mono text-xs tracking-widest">
              🛸 SKYVIEW CINEMAS
            </div>
          </div>
        </motion.div>

        {/* ── Social Media Showcase ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <div className={`font-mono text-xs tracking-[0.25em] uppercase mb-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Follow Our Journey
            </div>
            <h3 className={`text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Watch Us On Social
            </h3>
          </div>

          {/* Social Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {SOCIALS.map((s, i) => (
              <motion.a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative group flex flex-col gap-4 p-6 rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer
                  ${isDark
                    ? 'bg-white/4 border-white/10 hover:border-white/25'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg'
                  }`}
              >
                {/* Glow bg */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 40%, ${s.accent}18 0%, transparent 60%)` }}
                />

                {/* Icon + Name */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: s.id === 'instagram'
                        ? 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)'
                        : s.id === 'tiktok'
                        ? 'linear-gradient(135deg, #010101, #fe2c55)'
                        : `linear-gradient(135deg, ${s.accent}, ${s.accent2})` }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</div>
                      <div className={`font-mono text-[11px] ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{s.handle}</div>
                    </div>
                  </div>
                  <ExternalLink size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-400' : 'text-slate-400'}`} />
                </div>

                {/* Description */}
                <div className={`font-mono text-xs relative z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  {s.followers}
                </div>

                {/* CTA bar */}
                <div
                  className="relative z-10 mt-auto py-2 px-3 rounded-lg text-white text-xs font-bold uppercase tracking-widest text-center"
                  style={{ background: s.id === 'instagram'
                    ? 'linear-gradient(90deg, #833ab4, #fd1d1d)'
                    : s.id === 'tiktok'
                    ? 'linear-gradient(90deg, #010101, #fe2c55 80%)'
                    : s.accent }}
                >
                  {s.id === 'tiktok' ? 'Watch on TikTok' : s.id === 'instagram' ? 'Follow on Instagram' : 'Follow on Facebook'}
                </div>
              </motion.a>
            ))}
          </div>

          {/* ── Video Grid (Latest Posts) ── */}
          <div className="text-center mb-8">
            <div className={`font-mono text-xs tracking-[0.25em] uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              Recent Aerial Shots · 🇱🇰 Sri Lanka
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {VIDEO_CARDS.map((card, i) => (
              <motion.a
                key={i}
                href={card.platform === 'tiktok'
                  ? 'https://www.tiktok.com/@skyviewcinemas6'
                  : 'https://www.instagram.com/paran_eethan/'}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden group block cursor-pointer"
              >
                <img
                  src={card.img}
                  alt={card.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Platform badge */}
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-white font-mono text-[10px] tracking-widest"
                  style={{ background: PLATFORM_COLOR[card.platform] }}
                >
                  {PLATFORM_LABEL[card.platform]}
                </div>

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle size={40} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                </div>

                {/* Caption + views */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white text-xs font-black">{card.caption}</div>
                  <div className="text-white/60 font-mono text-[10px]">👁 {card.views} views</div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom social bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`flex flex-wrap items-center justify-center gap-6 pt-10 border-t ${isDark ? 'border-white/8' : 'border-slate-200'}`}
        >
          <span className={`font-mono text-xs tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
            Find us on
          </span>
          {SOCIALS.map(s => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 font-mono text-xs tracking-wider transition-colors duration-200
                ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <span style={{ color: s.accent }}>{s.icon}</span>
              {s.handle}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
