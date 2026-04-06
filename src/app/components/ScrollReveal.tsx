import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// ─── RevealFade ──────────────────────────────────────────────────────────────
// Fade + slide into view when element enters viewport
interface RevealFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  once?: boolean;
}
export function RevealFade({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  y = 28,
  x = 0,
  once = true,
}: RevealFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── RevealWords ─────────────────────────────────────────────────────────────
// Animates each word independently into view (staggered)
interface RevealWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
}
export function RevealWords({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.06,
  duration = 0.55,
}: RevealWordsProps) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block ${wordClassName}`}
          style={{ marginRight: '0.28em' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            duration,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ─── RevealStagger ───────────────────────────────────────────────────────────
// Staggers direct children with coordinated enter animation
interface RevealStaggerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
}

const containerVariants = {
  hidden: {},
  visible: (c: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: c.stagger, delayChildren: c.delay },
  }),
};

function makeChildVariant(y: number) {
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };
}

export function RevealStagger({
  children,
  className = '',
  stagger = 0.09,
  delay = 0,
  y = 24,
}: RevealStaggerProps) {
  const childVariants = makeChildVariant(y);
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={containerVariants}
      custom={{ stagger, delay }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={childVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── RevealLine ──────────────────────────────────────────────────────────────
// Reveals a single line of text with a cinematic upward wipe
interface RevealLineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}
export function RevealLine({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
}: RevealLineProps) {
  return (
    <div className={`overflow-hidden leading-[1.15] ${className}`}>
      <motion.div
        initial={{ y: '108%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── ParallaxLayer ───────────────────────────────────────────────────────────
// Applies a scroll-driven vertical parallax offset to its children.
// The ref is placed on the outer div so it measures the element's own
// scroll crossing — no absolute positioning needed on the wrapper.
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number;   // Fraction of viewport: 0.25 = moves ±20px. Negative = reverse.
  className?: string;
}
export function ParallaxLayer({
  children,
  speed = 0.25,
  className = '',
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Keep range modest to avoid clipping issues with overflow:hidden parents
  const range = speed * 80;
  const y = useTransform(scrollYProgress, [0, 1], [`${-range}px`, `${range}px`]);

  return (
    // No overflow:hidden on the outer div — avoids clipping the parallax content
    <div ref={ref} className={className}>
      <motion.div style={{ y, willChange: 'transform' }}>
        {children}
      </motion.div>
    </div>
  );
}
