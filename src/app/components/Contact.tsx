import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, MessageCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const WA_NUMBER = '94771713282';
const WA_BASE   = `https://wa.me/${WA_NUMBER}`;

const SOCIAL_LINKS = [
  {
    label: 'TikTok',
    handle: '@skyviewcinemas6',
    url: 'https://www.tiktok.com/@skyviewcinemas6',
    bg: 'bg-[#010101]',
    emoji: '📱',
  },
  {
    label: 'Instagram',
    handle: '@paran_eethan',
    url: 'https://www.instagram.com/paran_eethan/',
    bg: 'bg-gradient-to-br from-purple-900/40 to-rose-900/40',
    emoji: '📸',
  },
  {
    label: 'Facebook',
    handle: 'SkyView Cinemas',
    url: 'https://web.facebook.com/profile.php?id=100067223204730',
    bg: 'bg-blue-900/30',
    emoji: '💬',
  },
];

const SERVICES = [
  'Aerial Photography',
  'Cinematic Film',
  'Real Estate',
  'Wedding / Event',
  'Tourism Content',
  'Custom Package',
];

export function Contact() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Aerial Photography',
    location: '',
    details: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setStatus('submitting');

    // Build the WhatsApp message with all form details
    const msg = [
      `🛸 *New Booking Request — SkyView Cinemas*`,
      ``,
      `👤 *Name:* ${formData.name}`,
      `📧 *Email:* ${formData.email}`,
      `📱 *Phone:* ${formData.phone || 'Not provided'}`,
      `🎬 *Service:* ${formData.type}`,
      `📍 *Location:* ${formData.location || 'Not specified'}`,
      `📝 *Details:* ${formData.details || 'No additional details'}`,
    ].join('\n');

    const waUrl = `${WA_BASE}?text=${encodeURIComponent(msg)}`;

    setTimeout(() => {
      setStatus('success');
      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
      // Reset form after short delay
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', type: 'Aerial Photography', location: '', details: '' });
        setStatus('idle');
      }, 4000);
    }, 800);
  };

  const inputCls =
    'w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 focus:bg-black/60 transition-all duration-200';
  const labelCls = 'block text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2';

  return (
    <section className="relative w-full py-16 sm:py-28 z-20 overflow-hidden bg-[#060608]">
      {/* Radial bg */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(0,243,255,0.05)_0%,transparent_70%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-cyan-400">Let's Work Together</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase mb-4">
            Book Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Aerial Shoot
            </span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Fill the form and it will open WhatsApp with all your details — we respond within 24 hours. 🚀
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10">

          {/* ── Left: Contact Info ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* WhatsApp card */}
            <a
              href={`${WA_BASE}?text=${encodeURIComponent('Hi SkyView Cinemas! I\'d like to book an aerial shoot. 🛸')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 rounded-2xl bg-green-500/10 border border-green-400/20 hover:border-green-400/50 hover:bg-green-500/15 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                💬
              </div>
              <div>
                <div className="font-mono text-xs tracking-widest text-green-400 uppercase mb-1">Fastest Response</div>
                <div className="text-white font-black text-lg">WhatsApp Us</div>
                <div className="text-gray-400 text-sm">+94 77 171 3282</div>
              </div>
              <ExternalLink size={16} className="ml-auto text-green-400/60 group-hover:text-green-400 flex-shrink-0" />
            </a>

            {/* Email */}
            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/3 border border-white/8">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                📧
              </div>
              <div>
                <div className="font-mono text-xs tracking-widest text-cyan-400 uppercase mb-1">Email</div>
                <div className="text-white font-black">skyviewcinemas6@gmail.com</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/3 border border-white/8">
              <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                📍
              </div>
              <div>
                <div className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-1">Based In</div>
                <div className="text-white font-black">Jaffna, Sri Lanka</div>
                <div className="text-gray-400 text-sm">Flying island-wide 🇱🇰</div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <div className="font-mono text-xs tracking-widest text-gray-500 uppercase mb-3">Find Us On</div>
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map(s => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 p-4 rounded-xl border border-white/8 hover:border-white/20 transition-all duration-200 hover:scale-[1.02] ${s.bg}`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <div>
                      <div className="text-white text-sm font-bold">{s.label}</div>
                      <div className="text-gray-500 font-mono text-xs">{s.handle}</div>
                    </div>
                    <ExternalLink size={13} className="ml-auto text-gray-600 group-hover:text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="p-6 sm:p-8 md:p-10 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-sm relative overflow-hidden">
              {/* Corner HUD accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/40 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/40 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40 rounded-br-2xl" />

              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-black text-xl">Send a Booking Request</h3>
                <span className="text-xl">🛸</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">
                Fill in your details — clicking submit will open WhatsApp with everything pre-filled.
              </p>

              {/* Success banner */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/15 border border-green-400/30 rounded-xl flex items-center gap-3 text-green-400"
                >
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <div>
                    <div className="font-black text-sm">WhatsApp opened! 🎉</div>
                    <div className="text-green-500/70 text-xs">Your details are pre-filled — just hit Send.</div>
                  </div>
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={inputCls}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={inputCls}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Phone + Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className={inputCls}
                      placeholder="+94 77 171 3282"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Service Needed</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className={`${inputCls} appearance-none cursor-pointer`}
                    >
                      {SERVICES.map(o => (
                        <option key={o} className="bg-[#060608]">{o}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className={labelCls}>Shoot Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. Jaffna Fort, Trincomalee Beach, Colombo..."
                  />
                </div>

                {/* Details */}
                <div>
                  <label className={labelCls}>Project Details</label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell us about your project — date, duration, and any special requirements..."
                  />
                </div>

                {/* Submit → opens WhatsApp */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(34,197,94,0.25)] hover:shadow-[0_0_35px_rgba(34,197,94,0.45)]"
                >
                  {status === 'submitting' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <MessageCircle size={18} />
                      Send via WhatsApp
                    </>
                  )}
                </button>

                <p className="text-center text-gray-600 text-xs">
                  This will open WhatsApp with your details pre-filled &nbsp;·&nbsp;{' '}
                  <a
                    href={`${WA_BASE}?text=${encodeURIComponent('Hi SkyView Cinemas! 🛸')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline"
                  >
                    Or message us directly
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 sm:mt-20 pt-6 sm:pt-8 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/logodrone.png" 
              alt="SkyView Cinemas" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_8px_rgba(0,243,255,0.3)]" 
            />
          </div>

          <p className="text-gray-600 font-mono text-xs tracking-widest text-center">
            © 2026{' '}
            <a
              href="https://aarastech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400/70 hover:text-cyan-300 transition-colors underline underline-offset-2"
            >
              Aaras Tech
            </a>
            . All Rights Reserved.{' '}
            <span className="text-white/20">|</span>{' '}
            <a href="https://aarastech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Privacy Policy</a>{' '}
            <span className="text-white/20">|</span>{' '}
            <a href="https://aarastech.com/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </p>

          <div className="flex items-center gap-4">
            {[
              { label: 'TikTok',     url: 'https://www.tiktok.com/@skyviewcinemas6' },
              { label: 'Instagram',  url: 'https://www.instagram.com/paran_eethan/' },
              { label: 'Facebook',   url: 'https://web.facebook.com/profile.php?id=100067223204730' },
            ].map(s => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-white font-mono text-[11px] tracking-widest uppercase transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}