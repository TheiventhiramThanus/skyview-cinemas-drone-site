import React, { useRef, useCallback } from 'react';
import { motion, useSpring } from 'motion/react';

// ─── TiltCard ─────────────────────────────────────────────────────────────────
// Wraps any card content with physics-based 3D tilt on mouse/touch hover.
// Uses motion springs for buttery-smooth return-to-rest.
// Safe to nest — does not override children's own motion props.

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt angle in degrees (default 12) */
  intensity?: number;
  /** Show a dynamic glare spot on hover (default true) */
  glare?: boolean;
  /** Scale on hover (default 1.02) */
  hoverScale?: number;
}

export function TiltCard({
  children,
  className = '',
  intensity = 12,
  glare = true,
  hoverScale = 1.02,
}: TiltCardProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Spring-damped rotation values
  const rotX     = useSpring(0, { stiffness: 260, damping: 22 });
  const rotY     = useSpring(0, { stiffness: 260, damping: 22 });
  const scaleVal = useSpring(1,  { stiffness: 260, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      // Normalise cursor position to [-1, 1] from center
      const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;

      rotX.set(-ny * intensity);   // tilt up when cursor is near top
      rotY.set(nx  * intensity);   // tilt right when cursor is near right

      if (glare && glareRef.current) {
        // Move glare spot to cursor position (in %)
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glareRef.current.style.background =
          `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.11) 0%, transparent 58%)`;
        glareRef.current.style.opacity = '1';
      }
    },
    [intensity, glare, rotX, rotY],
  );

  const handleMouseEnter = useCallback(() => {
    scaleVal.set(hoverScale);
  }, [hoverScale, scaleVal]);

  const handleMouseLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    scaleVal.set(1);
    if (glare && glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, [glare, rotX, rotY, scaleVal]);

  // Touch support: treat touch position like mouse
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length === 0) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const t  = e.touches[0];
      const nx = ((t.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ny = ((t.clientY - rect.top)  / rect.height - 0.5) * 2;
      rotX.set(-ny * (intensity * 0.6));   // softer on mobile
      rotY.set(nx  * (intensity * 0.6));
    },
    [intensity, rotX, rotY],
  );

  const handleTouchEnd = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{
        // transformPerspective applies perspective to this element's own 3D space
        transformPerspective: 900,
        rotateX: rotX,
        rotateY: rotY,
        scale:   scaleVal,
        transformOrigin: 'center center',
        // Avoid layout shifts — position:relative is already implicit
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}

      {/* Glare overlay — hidden by default, shown on hover */}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: 0,
            transition: 'opacity 0.25s ease',
            mixBlendMode: 'screen',
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
}
