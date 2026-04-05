// src/components/public/StatsSection.jsx
'use client';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 150, suffix: '+',    label: 'Projects Delivered',  desc: 'across 8+ industries' },
  { value: 99.97, suffix: '%',  label: 'Uptime SLA',          desc: 'guaranteed availability' },
  { value: 8,  suffix: '+',     label: 'Industries Served',   desc: 'deep domain expertise' },
  { value: 3,  suffix: 'yrs+',  label: 'Average Partnership', desc: 'long-term relationships' },
];

function useCountUp(target, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const isFloat = !Number.isInteger(target);
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;
      setCount(isFloat ? parseFloat(current.toFixed(2)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, desc, index, inView }) {
  const count = useCountUp(value, 1400 + index * 150, inView);
  const isFloat = !Number.isInteger(value);

  return (
    <div
      className="text-center px-4"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.7s ${index * 0.1}s ease, transform 0.7s ${index * 0.1}s ease`,
      }}
    >
      {/* Number */}
      <div
        className="text-zinc-900 dark:text-white"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          marginBottom: '0.5rem',
        }}
      >
        {isFloat ? count.toFixed(2) : count}
        <span style={{ color: '#f97316' }}>{suffix}</span>
      </div>

      {/* Label */}
      <div
        className="text-zinc-800 dark:text-zinc-200"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '3px',
        }}
      >
        {label}
      </div>

      {/* Sub-desc */}
      <div
        className="text-zinc-400 dark:text-zinc-500"
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}
      >
        {desc}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref    = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative bg-white dark:bg-zinc-950 overflow-hidden"
      style={{ padding: '80px 20px' }}
    >
      {/* Top hairline */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '1px',
          height: '64px',
          background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.4), transparent)',
        }}
      />

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '48px 16px',
          alignItems: 'start',
        }}
      >
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} index={i} inView={inView} />
        ))}
      </div>

      {/* Subtle dividers between items (desktop) */}
      <style jsx>{`
        @media (min-width: 640px) {
          .stats-divider { display: block; }
        }
      `}</style>

      {/* Bottom hairline */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '120px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(249,115,22,0.3), transparent)',
        }}
      />
    </section>
  );
}