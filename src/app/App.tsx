import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { SmoothScroll } from './SmoothScroll';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DroneScene } from './components/DroneScene';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Contact } from './components/Contact';
import { DroneAudio } from './components/DroneAudio';

function AppInner() {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Let Lenis handle scroll behaviour — remove browser default smooth
    document.documentElement.style.scrollBehavior = 'auto';
  }, []);

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden font-sans transition-colors duration-500 ${
        isDark
          ? 'bg-[#060608] text-white selection:bg-cyan-500 selection:text-black'
          : 'bg-slate-50 text-slate-900 selection:bg-cyan-500 selection:text-white'
      }`}
    >
      {/* 3D drone — only in dark mode */}
      {mounted && isDark && (
        <ErrorBoundary inline>
          <DroneScene />
        </ErrorBoundary>
      )}

      <Nav />
      {/* Ambient drone audio — synthesized via Web Audio API */}
      {isDark && <DroneAudio />}

      <main className="relative z-20">
        <Hero />
        <div className="h-[10vh] md:h-[40vh]" />
        <section id="services"><Services /></section>
        <section id="about"><About /></section>
        <section id="portfolio"><Portfolio /></section>
        <section id="pricing"><Pricing /></section>
        <section id="contact"><Contact /></section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <SmoothScroll>
          <AppInner />
        </SmoothScroll>
      </ErrorBoundary>
    </ThemeProvider>
  );
}