import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
const imgSheet1 = 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=400';
const imgSheet2 = 'https://images.unsplash.com/photo-1506744031586-b4a3f0f28fb3?q=80&w=400';

const TIKTOK_URL = 'https://www.tiktok.com/@skyviewcinemas6';

// Each video uses a figma asset sheet with objectPosition to crop the correct half,
// or a standalone Unsplash image. "side" = 'left' | 'right' picks which half of the sheet.
type Video = {
  id: number;
  title: string;
  titleTamil: string;
  location: string;
  views: string;
  tag: string;
  hot?: boolean;
  sheet: string;
  side?: 'left' | 'right' | 'full';
};

const videos: Video[] = [
  {
    id: 1,
    title: 'Yazhpanam',
    titleTamil: 'யாழ்ப்பாணம்',
    location: 'Jaffna, Sri Lanka',
    views: '67.1K',
    tag: 'City Aerial',
    sheet: '/tiktok/yazhpanam.jpg',
    side: 'full',
  },
  {
    id: 2,
    title: 'Meesalai',
    titleTamil: 'மீசாலை',
    location: 'Meesalai, Jaffna',
    views: '8321',
    tag: 'Landscape',
    sheet: '/tiktok/meesalai.jpg',
    side: 'full',
  },
  {
    id: 3,
    title: 'Chavakachcheri (Night)',
    titleTamil: 'Chavakachcheri',
    location: 'Chavakachcheri, Jaffna',
    views: '31.9K',
    tag: 'Night Aerial',
    sheet: '/tiktok/chavakachcheri_night.jpg',
    side: 'full',
  },
  {
    id: 4,
    title: 'Chavakachcheri',
    titleTamil: 'சாவகச்சேரி',
    location: 'Chavakachcheri, Jaffna',
    views: '133K',
    tag: 'Town Aerial',
    hot: true,
    sheet: '/tiktok/chavakachcheri.jpg',
    side: 'full',
  },
  {
    id: 5,
    title: 'Traditional',
    titleTamil: 'Traditional',
    location: 'Pannai, Jaffna',
    views: '20.2K',
    tag: 'Ocean View',
    sheet: '/tiktok/pannai.jpg',
    side: 'full',
  },
];

// Returns inline style for the thumbnail image based on which half of the sheet to show
function getThumbStyle(side: 'left' | 'right' | 'full'): React.CSSProperties {
  if (side === 'full') return { objectFit: 'cover', objectPosition: 'center center' };
  // Sheet is landscape (two portrait clips side by side).
  // We scale the image to 200% width so each half fills the card, then shift left/right.
  return {
    objectFit: 'cover',
    objectPosition: side === 'left' ? '0% center' : '100% center',
    width: '200%',
    maxWidth: '200%',
    left: side === 'left' ? '0' : '-100%',
    position: 'absolute',
    top: 0,
    height: '100%',
  };
}

export function TikTokGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mb-16">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-center justify-between gap-3 mb-6"
      >
        <div className="flex items-center gap-3">
          {/* TikTok icon */}
          <div className="w-9 h-9 rounded-xl bg-[#010101] border border-white/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.81a8.18 8.18 0 004.78 1.52V6.89a4.85 4.85 0 01-1.01-.2z"
                fill="#fe2c55"
              />
            </svg>
          </div>
          <div>
            <div className="text-white font-black text-sm">@skyviewcinemas6</div>
            <div className="text-gray-500 font-mono text-[10px] tracking-widest uppercase">
              Recent Aerial Shots · 🇱🇰 Sri Lanka
            </div>
          </div>
        </div>

        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fe2c55]/15 border border-[#fe2c55]/30 hover:bg-[#fe2c55]/25 hover:border-[#fe2c55]/60 text-[#fe2c55] font-black text-xs uppercase tracking-widest transition-all duration-200 hover:scale-105"
        >
          Follow on TikTok
          <ExternalLink size={12} />
        </a>
      </motion.div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {videos.map((video, i) => (
          <motion.a
            key={video.id}
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            onMouseEnter={() => setHovered(video.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-white/8 hover:border-[#fe2c55]/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(254,44,85,0.2)]"
            style={{ aspectRatio: '9/16' }}
          >
            {/* Thumbnail — split from sheet or full */}
            {video.side === 'full' ? (
              <img
                src={video.sheet}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              /* Overflow wrapper so the 200%-wide img is clipped */
              <div className="absolute inset-0 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <img
                  src={video.sheet}
                  alt={video.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    width: 'auto',
                    minWidth: '200%',
                    left: video.side === 'left' ? '0' : 'auto',
                    right: video.side === 'right' ? '0' : 'auto',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Hot badge */}
            {video.hot && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#fe2c55] text-white font-black text-[9px] uppercase tracking-widest shadow-lg">
                🔥 Top
              </div>
            )}

            {/* Play button on hover */}
            <motion.div
              animate={{
                opacity: hovered === video.id ? 1 : 0,
                scale: hovered === video.id ? 1 : 0.6,
              }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                <Play size={18} fill="white" className="text-white ml-0.5" />
              </div>
            </motion.div>

            {/* TikTok watermark */}
            <div className="absolute top-2 left-2">
              <div className="w-6 h-6 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.81a8.18 8.18 0 004.78 1.52V6.89a4.85 4.85 0 01-1.01-.2z" />
                </svg>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="text-white font-black text-sm leading-tight drop-shadow-lg">
                {video.titleTamil}
              </div>
              {video.titleTamil !== video.title && (
                <div className="text-gray-300 text-[10px] leading-tight mb-1.5 drop-shadow">
                  {video.title}
                </div>
              )}
              <div className="flex items-center gap-1 text-white mt-1">
                <Play size={9} fill="white" className="opacity-80" />
                <span className="font-black text-xs">{video.views}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 px-4 sm:px-6 rounded-xl bg-white/3 border border-white/8"
      >
        {[
          { label: 'Total Views', value: '250K+' },
          { label: 'Videos', value: '10+' },
          { label: 'Locations', value: 'Island-wide' },
          { label: 'Follow', value: '@skyviewcinemas6', link: TIKTOK_URL },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="font-mono text-[10px] tracking-widest text-gray-500 uppercase mb-0.5">
              {s.label}
            </div>
            {s.link ? (
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-black text-[#fe2c55] hover:text-[#ff6b81] transition-colors text-sm"
              >
                {s.value}
              </a>
            ) : (
              <div className="font-black text-white text-sm">{s.value}</div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}