import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

// ── Context so any component can call lenis.scrollTo() ───────────────────────
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // Cinematic feel: slow drag with exponential ease-out
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Smooth touch / trackpad
      touchMultiplier: 1.8,
      wheelMultiplier: 1.0,
      // Prevent sub-pixel jitter
      syncTouch: false,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Store on window IMMEDIATELY so DroneScene can attach in its retry RAF
    (window as any).__lenis = lenis;

    // Make Framer Motion's useScroll + DroneScene window.scrollY stay in sync
    lenis.on('scroll', () => {
      // Dispatch a native scroll event so all window.scroll listeners fire
      window.dispatchEvent(new Event('scroll'));
    });

    // RAF loop — drives Lenis every frame
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      (window as any).__lenis = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}