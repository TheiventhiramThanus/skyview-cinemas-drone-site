import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { useTheme } from '../ThemeContext';
const skyViewLogo = '/logodrone.png';

const NAV_LINKS = [
  { label: 'Services',  href: '#services'  },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Pricing',   href: '#pricing'   },
];

export function Nav() {
  const { isDark } = useTheme();
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted]         = useState(false);

  // Wait for document.body to be available for the portal
  useEffect(() => { setMounted(true); }, []);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active section tracker ── */
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  /* ── Lock body scroll + pause Lenis when menu is open ── */
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (mobileOpen) {
      if (lenis) lenis.stop();
      document.body.style.overflow    = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      if (lenis) lenis.start();
      document.body.style.overflow    = '';
      document.body.style.touchAction = '';
    }
    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow    = '';
      document.body.style.touchAction = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const scrollTo = (href: string) => {
    closeMobile();
    setTimeout(() => {
      const lenis = (window as any).__lenis;
      if (href === '#') {
        lenis ? lenis.scrollTo(0, { duration: 1.8 }) : window.scrollTo({ top: 0 });
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      lenis
        ? lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.8 })
        : (target as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  /* ── Mobile menu — rendered via portal into document.body ──────────────────
     This escapes the overflow-x-hidden wrapper in AppInner which would otherwise
     make `position:fixed` behave like `position:absolute`, causing the sidebar
     to appear scrolled with the page (the "two sidebars" bug).
  ────────────────────────────────────────────────────────────────────────── */
  const mobileMenu = (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobile}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9000,
              background: 'rgba(0,0,0,0.82)',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 9100,
              width: '18rem',
              maxWidth: '85vw',
              display: 'flex',
              flexDirection: 'column',
              background: '#07080e',
              borderLeft: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Panel header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}
            >
              <img
                src={skyViewLogo}
                alt="SkyView Cinemas"
                style={{
                  height: '52px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 8px rgba(0,243,255,0.4))',
                }}
              />
              <button
                onClick={closeMobile}
                style={{
                  width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Nav links */}
            <nav
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: '16px 12px',
                flex: 1,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
              }}
            >
              {NAV_LINKS.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ x: 28, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.07, type: 'spring', stiffness: 280, damping: 26 }}
                    onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 16px',
                      borderRadius: 12,
                      fontFamily: 'monospace',
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      border: isActive ? '1px solid rgba(0,243,255,0.2)' : '1px solid transparent',
                      background: isActive ? 'rgba(0,243,255,0.08)' : 'transparent',
                      color: isActive ? '#22d3ee' : '#d1d5db',
                      transition: 'all 0.18s',
                    }}
                  >
                    <span
                      style={{
                        width: 6, height: 6,
                        borderRadius: '50%',
                        background: 'rgba(0,243,255,0.7)',
                        flexShrink: 0,
                      }}
                    />
                    {link.label}
                  </motion.a>
                );
              })}
            </nav>

            {/* WhatsApp CTA */}
            <div
              style={{
                padding: '12px 12px 32px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}
            >
              <motion.a
                href="https://wa.me/94771713282?text=Hi%20SkyView%20Cinemas!%20I'd%20like%20to%20book%20an%20aerial%20shoot."
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.24, type: 'spring', stiffness: 260, damping: 24 }}
                onClick={closeMobile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '14px 0',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  background: '#06b6d4',
                  color: '#000',
                  borderRadius: 12,
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(0,243,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Phone size={13} /> Book via WhatsApp
              </motion.a>
              <p
                style={{
                  textAlign: 'center',
                  color: '#4b5563',
                  fontFamily: 'monospace',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  marginTop: 10,
                }}
              >
                +94 77 171 3282
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <>
      {/* ══════════════════════════════
          TOP NAV BAR
      ══════════════════════════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-[#060608]/95 backdrop-blur-2xl border-b border-white/8 shadow-[0_2px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">

          {/* Logo */}
          <a
            href="#"
            className="flex items-center group"
            onClick={e => { e.preventDefault(); scrollTo('#'); }}
          >
            <img
              src={skyViewLogo}
              alt="SkyView Cinemas"
              className="h-14 sm:h-16 w-auto object-contain
                drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]
                group-hover:drop-shadow-[0_0_18px_rgba(0,243,255,0.65)]
                transition-all duration-300"
            />
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); scrollTo(link.href); }}
                className={`relative px-4 py-2 rounded-lg font-mono text-[11px] tracking-widest uppercase transition-all duration-200 ${
                  activeSection === link.href.slice(1)
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Right: Book Now + hamburger */}
          <div className="flex items-center gap-2">
            <motion.a
              href="https://wa.me/94771713282?text=Hi%20SkyView%20Cinemas!%20I'd%20like%20to%20book%20an%20aerial%20shoot."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 font-black text-[11px] uppercase tracking-widest bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-200 rounded-lg shadow-[0_0_18px_rgba(0,243,255,0.25)]"
            >
              <Phone size={12} /> Book Now
            </motion.a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 border border-white/12 text-gray-300 hover:text-white hover:bg-white/15 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate: 90,   opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <X size={17} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90,  opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{   rotate: -90,  opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    <Menu size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Portal: renders the overlay directly into document.body,
          completely outside the overflow-x-hidden wrapper */}
      {mounted && createPortal(mobileMenu, document.body)}
    </>
  );
}
