'use client';
// src/app/products/timedule/page.js
// Timedule — Smart Timetable Manager | Built by AetherSolve Technologies
// Uses global.css CSS variables: --accent, --bg, --bg-2, --bg-3, --surface, --text, --text-2, --text-3, etc.

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ArrowUpRight,
  Clock, Calendar, Zap, Brain, BarChart3,
  Bell, CheckCircle, Star, TrendingUp,
  Play, Pause, RotateCcw,
  BookOpen, Coffee, Target, Award,
  Shield, FileText, Layers, Sparkles,
  ChevronDown, ExternalLink, Users
} from 'lucide-react';

/* ─── FONT INJECTION (matches AetherSolve: Outfit + Manrope) ─── */
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap';

/* ─── SCROLL REVEAL HOOK ──────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
}
function R({ children, delay = 0, style = {}, className = '' }) {
  const [ref, vis] = useReveal(delay);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── SUBJECTS DATA ───────────────────────────────────────── */
const SUBJECTS = [
  { name: 'Mathematics',    time: '08:00', dur: 60, color: 'var(--accent)',  icon: '∑',   tag: 'Core' },
  { name: 'Physics',        time: '09:15', dur: 45, color: '#3b82f6',        icon: '⚛',   tag: 'Science' },
  { name: 'Computer Sci.',  time: '10:30', dur: 90, color: '#10b981',        icon: '</>',  tag: 'Tech' },
  { name: 'English',        time: '12:00', dur: 60, color: '#f59e0b',        icon: 'A',   tag: 'Lang' },
  { name: 'Break',          time: '13:00', dur: 30, color: '#8b5cf6',        icon: '☕',   tag: 'Rest' },
  { name: 'Chemistry',      time: '13:30', dur: 45, color: '#ec4899',        icon: '⚗',   tag: 'Science' },
  { name: 'History',        time: '14:30', dur: 60, color: '#14b8a6',        icon: '📜',   tag: 'Hum.' },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/* ─── LIVE TIMETABLE PREVIEW ──────────────────────────────── */
function TimetablePreview() {
  const [active, setActive]   = useState(2);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [aiTip, setAiTip]     = useState(false);
  const [activeDay, setDay]   = useState(2);
  const iRef = useRef(null);

  useEffect(() => {
    if (running) {
      iRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else clearInterval(iRef.current);
    return () => clearInterval(iRef.current);
  }, [running]);

  const sub    = SUBJECTS[active];
  const pct    = Math.min((elapsed / (sub.dur * 60)) * 100, 100);
  const remain = Math.max(sub.dur * 60 - elapsed, 0);
  const mm     = String(Math.floor(remain / 60)).padStart(2, '0');
  const ss     = String(remain % 60).padStart(2, '0');

  const reset = () => { setRunning(false); setElapsed(0); setAiTip(false); };

  useEffect(() => { if (pct >= 80 && !aiTip) setAiTip(true); }, [pct]);

  return (
    <div style={{
      background: 'var(--bg-2)',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid var(--border)',
      fontFamily: "'Manrope', sans-serif",
      boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
    }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--bg-3)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text)', fontFamily: "'Outfit',sans-serif" }}>Timedule</span>
          <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.08em' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setDay(i)} style={{
              padding: '5px 11px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
              border: 'none', cursor: 'pointer',
              background: activeDay === i ? 'var(--accent)' : 'var(--surface)',
              color: activeDay === i ? '#fff' : 'var(--text-3)',
              transition: 'all .15s',
            }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '380px' }}>
        {/* Subject list */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
          <div style={{ fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '6px 8px', marginBottom: '4px' }}>
            {DAYS[activeDay]}'s Schedule
          </div>
          {SUBJECTS.map((s, i) => (
            <button key={i} onClick={() => { setActive(i); reset(); }} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              textAlign: 'left', width: '100%',
              background: active === i ? `${s.color}15` : 'transparent',
              borderLeft: active === i ? `3px solid ${s.color}` : '3px solid transparent',
              transition: 'all .15s',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', flexShrink: 0 }}>
                {s.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '12.5px', color: active === i ? 'var(--text)' : 'var(--text-2)', marginBottom: '1px' }}>{s.name}</div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-3)' }}>{s.time} · {s.dur}min</div>
              </div>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', background: `${s.color}15`, color: s.color }}>{s.tag}</span>
            </button>
          ))}
        </div>

        {/* Timer panel */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', fontFamily: "'Outfit',sans-serif" }}>{sub.name}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-3)', marginTop: '3px' }}>Session · {sub.dur} min · starts {sub.time}</div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${sub.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              {sub.icon}
            </div>
          </div>

          {/* Timer display */}
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '60px', fontWeight: 500, letterSpacing: '-3px', color: 'var(--text)', lineHeight: 1 }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '8px', fontFamily: "'DM Mono',monospace" }}>remaining</div>
            {/* Progress bar */}
            <div style={{ margin: '16px auto 0', width: '80%', height: '6px', borderRadius: '100px', background: 'var(--bg-3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: sub.color, borderRadius: '100px', transition: 'width .5s linear', boxShadow: `0 0 8px ${sub.color}80` }} />
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '6px', fontFamily: "'DM Mono',monospace" }}>{Math.round(pct)}% complete</div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={() => setRunning(r => !r)} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '11px 28px', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: running ? 'var(--bg-3)' : sub.color,
              color: running ? 'var(--text-2)' : '#fff',
              fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '13px',
              boxShadow: running ? 'none' : `0 4px 20px ${sub.color}50`,
              transition: 'all .2s',
              border: running ? '1.5px solid var(--border-2)' : 'none',
            }}>
              {running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Start Session</>}
            </button>
            <button onClick={reset} style={{
              width: '44px', height: '44px', borderRadius: '100px',
              border: '1.5px solid var(--border-2)', background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', transition: 'all .15s',
            }}>
              <RotateCcw size={14} />
            </button>
          </div>

          {/* AI tip */}
          {aiTip && (
            <div style={{
              display: 'flex', gap: '10px', padding: '13px 15px', borderRadius: '12px',
              background: 'rgba(255,92,26,0.06)', border: '1px solid var(--accent-soft2)',
              animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both',
            }}>
              <Brain size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--accent)', marginBottom: '3px' }}>AI Insight</div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-2)', lineHeight: 1.6 }}>
                  You're 80% through {sub.name}. Your focus has been strong for {Math.floor(elapsed / 60)} min — a 5-min break before the next session will boost retention by ~22%.
                </div>
              </div>
            </div>
          )}

          {/* Visit CTA */}
          <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
            <a href="https://timedule.onrender.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '11px', borderRadius: '12px', background: 'var(--accent-soft)', border: '1px solid var(--accent-soft2)', color: 'var(--accent)', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', transition: 'all .2s' }}>
              Open Full App <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURE CARD ────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, body, color = 'var(--accent)', delay }) {
  const [hov, setHov] = useState(false);
  return (
    <R delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: '28px',
          borderRadius: '20px',
          border: `1px solid ${hov ? color : 'var(--card-border)'}`,
          background: hov ? 'var(--surface-2)' : 'var(--card-bg)',
          transition: 'all .25s cubic-bezier(.16,1,.3,1)',
          cursor: 'default',
          height: '100%',
          transform: hov ? 'translateY(-4px)' : 'none',
          boxShadow: hov ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
        }}
      >
        <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: `color-mix(in srgb, ${color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
          <Icon size={21} color={color} />
        </div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '16.5px', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.3px' }}>{title}</div>
        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-3)' }}>{body}</div>
      </div>
    </R>
  );
}

/* ─── ANIMATED COUNTER ─────────────────────────────────────── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, vis]        = useReveal(0);
  useEffect(() => {
    if (!vis) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [vis, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── TICKER STRIP ─────────────────────────────────────────── */
function Ticker() {
  const items = ['Smart Scheduling','AI Study Plans','Focus Streaks','Deadline Tracking','Break Reminders','Weekly Analytics','Drag & Drop Planner','Goal Setting','Progress Reports','Session Timer'];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', gap: '0', animation: 'ticker 30s linear infinite', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 28px', whiteSpace: 'nowrap' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--text-3)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────────── */
export default function TimedulePage() {
  const [tab, setTab]       = useState(0);
  const [faqOpen, setFaq]   = useState(null);
  const [tcOpen, setTc]     = useState(false);

  const features = [
    { icon: Brain,     title: 'AI-Powered Scheduling',       body: 'Timedule analyses your workload, deadlines, and energy patterns to auto-generate an optimised weekly timetable. No more manual shuffling.' },
    { icon: Zap,       title: 'Smart Break Suggestions',      body: 'Based on session intensity and duration, AI recommends ideal break timing — preventing burnout and protecting deep focus windows.' },
    { icon: Bell,      title: 'Adaptive Reminders',           body: 'Context-aware notifications that nudge you at the right moment — not just by clock time, but by actual session progress percentage.', color: '#10b981' },
    { icon: BarChart3, title: 'Weekly Analytics',             body: 'Visual insights on study streaks, subject balance, productive hours, and completion rates — clean and readable at a glance.', color: '#f59e0b' },
    { icon: Calendar,  title: 'Drag-and-Drop Planner',        body: 'Rearrange your week visually. Lock critical sessions, mark flex slots, and let the engine optimise around your constraints.', color: '#ec4899' },
    { icon: Target,    title: 'Goal & Deadline Tracking',     body: 'Set semester goals and assignment deadlines. Timedule back-calculates required study sessions and alerts when you\'re falling behind.', color: '#3b82f6' },
  ];

  const stats = [
    { value: 94,  suffix: '%',  label: 'Users hit daily targets',   icon: Target },
    { value: 2,   suffix: '.4×', label: 'Better session completion', icon: TrendingUp },
    { value: 38,  suffix: '%',  label: 'Less planning time',        icon: Clock },
    { value: 4,   suffix: '.8★', label: 'Average rating',           icon: Star },
  ];

  const howItWorks = [
    { n: '01', title: 'Add Your Subjects',    body: 'Enter subjects, weekly study goals, and any fixed commitments. Setup takes under 3 minutes.' },
    { n: '02', title: 'AI Builds Your Week',  body: 'The engine analyses load distribution and generates a conflict-free, energy-aware timetable.' },
    { n: '03', title: 'Run Your Sessions',    body: "Open today's plan, tap a subject, and Timedule guides you through it with a live timer and AI tips." },
    { n: '04', title: 'Review & Adapt',       body: "Weekly analytics show what worked. The AI refines next week's schedule automatically based on your data." },
  ];

  const faqs = [
    { q: 'Is Timedule free to use?', a: 'Yes — Timedule is free to start with no credit card required. A Pro plan with advanced AI features and analytics is available for students and institutions.' },
    { q: 'Does it work on mobile?', a: 'Timedule is fully responsive and works on any device. Native iOS and Android apps are in active development.' },
    { q: 'How does the AI know my schedule is optimal?', a: 'The AI uses spaced repetition principles, cognitive load research, and your personal completion patterns to balance subjects and protect recovery time.' },
    { q: 'Can I import from Google Calendar?', a: 'Yes — you can import existing commitments from Google Calendar so Timedule schedules only around your real free time.' },
    { q: 'Who built Timedule?', a: 'Timedule is built by AetherSolve Technologies, based in Bhilai, India — a software and AI company specialising in productivity and EdTech systems.' },
  ];

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');

        /* Global reset (subset — globals.css should already cover these) */
        *, *::before, *::after { box-sizing: border-box; }

        /* Keyframes (supplement globals.css animations) */
        @keyframes fadeUp      { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin-slow   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ticker      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes glow-pulse  { 0%,100%{box-shadow:0 0 32px rgba(255,92,26,0.15)} 50%{box-shadow:0 0 60px rgba(255,92,26,0.35)} }
        @keyframes scanline    { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes shimmerText {
          0%{background-position:-200% center}
          100%{background-position:200% center}
        }

        .float-icon   { animation: float 4s ease-in-out infinite; }
        .spin-ring    { animation: spin-slow 22s linear infinite; }
        .glow-accent  { animation: glow-pulse 3s ease-in-out infinite; }
        .dot-live     { animation: pulse 2s infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, var(--text) 0%, var(--accent) 40%, var(--text) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerText 4s linear infinite;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }

        /* Smooth sections */
        html { scroll-behavior: smooth; }

        /* TC modal overlay */
        .tc-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.75); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 24px;
          animation: fadeIn .2s ease;
        }
        .tc-modal {
          background: var(--bg-2); border: 1px solid var(--border-2);
          border-radius: 20px; max-width: 640px; width: 100%; max-height: 80vh;
          overflow-y: auto; padding: 32px;
          animation: fadeUp .3s cubic-bezier(.16,1,.3,1);
        }

        /* Grid dot bg */
        .dot-grid-bg {
          background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* T&C Modal */}
      {tcOpen && (
        <div className="tc-overlay" onClick={() => setTc(false)}>
          <div className="tc-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={20} color="var(--accent)" />
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '18px', color: 'var(--text)' }}>Terms & Conditions</span>
              </div>
              <button onClick={() => setTc(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '20px', lineHeight: 1 }}>✕</button>
            </div>

            {[
              { title: '1. Acceptance of Terms', body: 'By accessing or using Timedule ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use immediately. These terms apply to all users, including free and paid plan subscribers.' },
              { title: '2. Use of Service', body: 'Timedule is designed for personal academic and professional scheduling. You agree not to misuse the platform, attempt to reverse-engineer its AI systems, or use automated tools to scrape or extract data from the service.' },
              { title: '3. Account & Data', body: 'You are responsible for maintaining the confidentiality of your account credentials. Timedule collects usage data to improve AI scheduling recommendations. We do not sell your personal data to third parties. All data is encrypted at rest and in transit.' },
              { title: '4. AI Suggestions Disclaimer', body: "Timedule's AI-generated schedules are recommendations based on patterns and research. They do not guarantee academic outcomes. Users should exercise personal judgment and consult educators for formal study plans." },
              { title: '5. Intellectual Property', body: 'All content, AI models, algorithms, designs, and software within Timedule are the intellectual property of AetherSolve Technologies Pvt. Ltd. Unauthorised reproduction is strictly prohibited.' },
              { title: '6. Limitation of Liability', body: 'AetherSolve Technologies shall not be held liable for any indirect, incidental, or consequential damages arising from use or inability to use the service. The service is provided "as is" without warranties of any kind.' },
              { title: '7. Modifications', body: 'We reserve the right to update these terms at any time. Continued use of the service after modifications constitutes acceptance of the revised terms. Material changes will be communicated via email or in-app notification.' },
              { title: '8. Contact', body: 'For questions regarding these terms, contact us at hello@aethersolve.com or write to AetherSolve Technologies Pvt. Ltd., Bhilai, Chhattisgarh, India.' },
            ].map(({ title, body }) => (
              <div key={title} style={{ marginBottom: '20px' }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '6px' }}>{title}</div>
                <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '13px', lineHeight: 1.75, color: 'var(--text-3)' }}>{body}</div>
              </div>
            ))}

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-4)', fontFamily: "'Manrope',sans-serif" }}>Last updated: April 2026 · AetherSolve Technologies</span>
              <button onClick={() => setTc(false)} className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '13px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Manrope', sans-serif" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="container" style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={16} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '16px', letterSpacing: '-0.4px', color: 'var(--text)' }}>Timedule</span>
              <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>BETA</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', padding: '7px 12px', borderRadius: '8px', transition: 'color .15s' }}>
                <ArrowLeft size={13} /> AetherSolve
              </Link>
              <a href="#preview" style={{ padding: '9px 18px', borderRadius: '100px', border: '1.5px solid var(--border-2)', fontSize: '13px', fontWeight: 600, color: 'var(--text-2)', textDecoration: 'none', transition: 'all .15s' }}>
                Live Preview
              </a>
              <a href="https://timedule.onrender.com" target="_blank" rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '9px 22px', fontSize: '13px' }}>
                Open App ↗
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', overflow: 'hidden', padding: '110px 24px 90px', textAlign: 'center' }} className="dot-grid-bg">
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '600px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '0', right: '5%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Orbit ring */}
          <div style={{ position: 'absolute', top: '50px', right: '8%', opacity: .12, pointerEvents: 'none' }} className="spin-ring">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
              <circle cx="80" cy="80" r="78" stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 4" />
              <circle cx="80" cy="2" r="7" fill="var(--accent)" />
            </svg>
          </div>
          <div style={{ position: 'absolute', bottom: '10%', left: '5%', opacity: .08, pointerEvents: 'none' }}>
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="48" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 3" />
              <circle cx="50" cy="2" r="5" fill="var(--accent)" />
            </svg>
          </div>

          <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', background: 'var(--accent-soft)', border: '1px solid var(--accent-soft2)', marginBottom: '28px', animation: 'fadeUp .7s ease both' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '5px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={9} color="#fff" />
              </div>
              <span className="text-label" style={{ color: 'var(--accent)' }}>Product by AetherSolve · Live Now</span>
            </div>

            <h1 style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(48px,8.5vw,96px)',
              lineHeight: .95,
              letterSpacing: 'clamp(-2px,-0.04em,-4px)',
              color: 'var(--text)',
              marginBottom: '24px',
              animation: 'fadeUp .75s ease .1s both',
            }}>
              Your Smartest<br />
              <span className="shimmer-text">Timetable</span><br />
              Ever Made.
            </h1>

            <p style={{
              fontSize: 'clamp(15px,1.8vw,19px)', lineHeight: 1.8, color: 'var(--text-3)',
              maxWidth: '540px', margin: '0 auto 40px',
              animation: 'fadeUp .75s ease .2s both',
              fontFamily: "'Manrope',sans-serif",
            }}>
              Timedule uses AI to build, manage, and adapt your weekly study or work schedule — automatically optimising for focus, energy, and deadlines.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', animation: 'fadeUp .75s ease .3s both' }}>
              <a href="#preview" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
                Try Live Preview <Play size={14} />
              </a>
              <a href="https://timedule.onrender.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '15px', padding: '14px 28px' }}>
                Open Full App <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Trust signals */}
            <div style={{
              display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px',
              marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)',
              animation: 'fadeUp .75s ease .4s both',
            }}>
              {[['Free to start', 'No credit card'], ['AI-powered', 'Smart scheduling'], ['Web + Mobile', 'All platforms'], ['Built in India', 'By AetherSolve']].map(([a, b]) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <CheckCircle size={13} color="var(--accent)" />
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-3)' }}>{a}</span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-4)' }}>— {b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── STATS ── */}
        <section style={{ padding: '60px 24px', background: 'var(--bg-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <R key={s.label} delay={i * 80}>
                  <div style={{ textAlign: 'center', padding: '24px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                    <Icon size={18} color="var(--accent)" style={{ marginBottom: '10px' }} />
                    <div style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 900,
                      fontSize: 'clamp(30px,3.5vw,44px)', letterSpacing: '-1.5px',
                      color: 'var(--text)', lineHeight: 1, marginBottom: '6px',
                    }}>
                      <Counter target={s.value} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: "'Manrope',sans-serif" }}>{s.label}</div>
                  </div>
                </R>
              );
            })}
          </div>
        </section>

        {/* ── LIVE PREVIEW ── */}
        <section id="preview" style={{ padding: '110px 24px' }}>
          <div className="container">
            <R style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>Live Product Preview</span>
              <h2 className="text-display" style={{ marginBottom: '16px' }}>
                This Is Timedule.<br />
                <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>Not a mockup — actually works.</span>
              </h2>
              <p className="text-lead" style={{ maxWidth: '500px', margin: '0 auto' }}>
                Click any subject, hit Start, and watch the AI insight trigger when you reach 80% of a session.
              </p>
            </R>

            <R delay={100}>
              <TimetablePreview />
            </R>

            {/* Hint chips */}
            <R delay={200} style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {[['Click any subject', 'to switch'], ['Hit Start', 'to run timer'], ['Reach 80%', 'for AI tip'], ['Reset', 'to restart']].map(([a, b]) => (
                  <div key={a} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>{a}</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-4)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding: '110px 24px', background: 'var(--bg-2)' }}>
          <div className="container">
            <R style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>Features</span>
              <h2 className="text-display" style={{ marginBottom: '16px' }}>
                Built for how students<br />actually study.
              </h2>
              <p className="text-lead" style={{ maxWidth: '480px', margin: '0 auto' }}>
                Everything a timetable should do, powered by an engine that actually understands workload.
              </p>
            </R>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 60} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '110px 24px' }}>
          <div className="container">
            <R style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>How It Works</span>
              <h2 className="text-display">
                Set up in minutes.<br />
                <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>Focus for the whole week.</span>
              </h2>
            </R>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
              {howItWorks.map((s, i) => (
                <R key={s.n} delay={i * 80}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '13px',
                        background: 'var(--accent-soft)', border: '1px solid var(--accent-soft2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'DM Mono',monospace", fontWeight: 500, fontSize: '12px', color: 'var(--accent)', flexShrink: 0,
                      }}>{s.n}</div>
                      {i < 3 && <ArrowRight size={16} color="var(--text-4)" style={{ flexShrink: 0 }} />}
                    </div>
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '16.5px', color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.3px' }}>{s.title}</h3>
                    <p style={{ fontSize: '13.5px', lineHeight: 1.75, color: 'var(--text-3)' }}>{s.body}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANALYTICS TABS ── */}
        <section style={{ padding: '110px 24px', background: 'var(--bg-2)' }}>
          <div className="container">
            <R style={{ textAlign: 'center', marginBottom: '48px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>Smart Load Balancing</span>
              <h2 className="text-title">Balanced across every subject.</h2>
            </R>
            <R delay={80}>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['Weekly Overview', 'Subject Balance', 'Focus Streaks', 'Deadline Tracker'].map((t, i) => (
                  <button key={t} onClick={() => setTab(i)} className="btn" style={{
                    padding: '9px 20px', borderRadius: '100px', border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap',
                    background: tab === i ? 'var(--accent)' : 'var(--surface)',
                    color: tab === i ? '#fff' : 'var(--text-3)',
                    boxShadow: tab === i ? '0 4px 20px rgba(255,92,26,0.35)' : 'none',
                    transition: 'all .2s',
                  }}>{t}</button>
                ))}
              </div>
            </R>
            <R delay={140}>
              <div style={{ background: 'var(--bg-3)', borderRadius: '20px', border: '1px solid var(--border)', padding: '28px', minHeight: '240px' }}>
                {tab === 0 && (
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-4)', marginBottom: '20px', letterSpacing: '0.1em' }}>THIS WEEK — 32h SCHEDULED</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
                      {DAYS.map((d, i) => {
                        const h = [6.5, 7, 5, 8, 5.5][i];
                        return (
                          <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-4)' }}>{h}h</div>
                            <div style={{
                              width: '100%', height: `${h / 8 * 100}%`, borderRadius: '6px 6px 0 0',
                              background: i === 2 ? 'var(--accent)' : 'var(--accent-soft)',
                              boxShadow: i === 2 ? '0 0 16px rgba(255,92,26,0.4)' : 'none',
                              transition: 'all .3s',
                            }} />
                            <div style={{ fontSize: '11.5px', fontWeight: 700, color: i === 2 ? 'var(--text)' : 'var(--text-4)' }}>{d}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {tab === 1 && (
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-4)', marginBottom: '20px', letterSpacing: '0.1em' }}>SUBJECT DISTRIBUTION</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {SUBJECTS.slice(0, 5).map(s => (
                        <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '120px', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-2)', fontFamily: "'Manrope',sans-serif" }}>{s.name}</div>
                          <div style={{ flex: 1, height: '8px', borderRadius: '100px', background: 'var(--bg-2)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${s.dur / 90 * 100}%`, background: s.color, borderRadius: '100px', boxShadow: `0 0 8px ${s.color}60` }} />
                          </div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10.5px', color: 'var(--text-4)', width: '36px', textAlign: 'right' }}>{s.dur}m</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {tab === 2 && (
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-4)', marginBottom: '20px', letterSpacing: '0.1em' }}>14-DAY FOCUS STREAK</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {Array.from({ length: 14 }, (_, i) => ({
                        filled: i < 11, intense: [2, 3, 5, 8, 9, 10].includes(i),
                      })).map((d, i) => (
                        <div key={i} style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: d.filled ? (d.intense ? 'var(--accent)' : 'var(--accent-soft2)') : 'var(--surface)',
                          border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: d.filled && d.intense ? '0 0 10px rgba(255,92,26,0.4)' : 'none',
                        }}>
                          {d.filled && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.intense ? '#fff' : 'var(--text-3)' }} />}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '13.5px', color: 'var(--text-3)', fontFamily: "'Manrope',sans-serif" }}>
                      🔥 <span style={{ fontWeight: 800, color: 'var(--accent)' }}>11-day</span> current streak — keep going!
                    </div>
                  </div>
                )}
                {tab === 3 && (
                  <div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '10px', color: 'var(--text-4)', marginBottom: '20px', letterSpacing: '0.1em' }}>UPCOMING DEADLINES</div>
                    {[
                      { name: 'Physics Assignment', due: 'Tomorrow', pct: 80, color: '#ef4444', urgent: true },
                      { name: 'Math Mid-Term Prep', due: 'In 3 days', pct: 55, color: 'var(--accent)' },
                      { name: 'CS Project', due: 'In 1 week', pct: 35, color: '#10b981' },
                      { name: 'English Essay', due: 'In 2 weeks', pct: 15, color: '#f59e0b' },
                    ].map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', fontFamily: "'Manrope',sans-serif" }}>{d.name}</span>
                            {d.urgent && <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', letterSpacing: '0.08em' }}>URGENT</span>}
                          </div>
                          <div style={{ height: '5px', borderRadius: '100px', background: 'var(--bg-2)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${d.pct}%`, background: d.color, borderRadius: '100px' }} />
                          </div>
                        </div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '11px', color: 'var(--text-4)', whiteSpace: 'nowrap' }}>{d.due}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </R>
          </div>
        </section>

        {/* ── PRODUCTIVITY SHOWCASE ── */}
        <section style={{ padding: '110px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(255,92,26,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative' }}>
            <R style={{ textAlign: 'center', marginBottom: '64px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>Productivity Intelligence</span>
              <h2 className="text-display">
                More than a timer.<br />
                <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>A system that learns you.</span>
              </h2>
            </R>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Big card */}
              <R delay={0} style={{ gridRow: 'span 2' }}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '24px', padding: '32px', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }} className="float-icon">
                    <Brain size={22} color="#fff" />
                  </div>
                  <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '22px', color: 'var(--text)', marginBottom: '12px', letterSpacing: '-0.5px' }}>AI That Understands You</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-3)', marginBottom: '24px' }}>
                    Timedule doesn't just set timers. It tracks when you're most productive, which subjects drain you fastest, and when your focus peaks — then it builds next week's plan around those insights automatically.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Analyses historical session data', 'Adapts to your cognitive rhythm', 'Improves weekly with each session', 'Compares your patterns vs peers'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-2)', fontWeight: 600 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </R>

              {/* Small cards */}
              {[
                { icon: Layers,   title: 'Multi-Device Sync',   body: 'Your timetable syncs instantly across web, tablet, and phone — always current.',          color: '#3b82f6' },
                { icon: Award,    title: 'Streak Rewards',       body: 'Hit your daily goals and earn streaks. Gamification that actually works for students.',     color: '#f59e0b' },
                { icon: Users,    title: 'Study Groups',         body: 'Share timetables with classmates and find overlapping free slots for group sessions.',       color: '#10b981' },
                { icon: Sparkles, title: 'Smart Notifications',  body: 'Reminders that adapt based on your location, current session, and upcoming deadlines.',     color: '#8b5cf6' },
              ].map((card, i) => (
                <R key={card.title} delay={i * 80}>
                  <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `color-mix(in srgb, ${card.color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <card.icon size={18} color={card.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '15px', color: 'var(--text)', marginBottom: '6px' }}>{card.title}</div>
                      <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-3)' }}>{card.body}</div>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
          <div className="container">
            <R style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Built With</span>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--text)' }}>Powered by modern, reliable tech.</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['React Native', 'Next.js', 'Supabase', 'GPT-4o', 'PostgreSQL', 'Node.js', 'Vercel'].map(t => (
                  <span key={t} style={{
                    padding: '7px 16px', borderRadius: '100px',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    fontSize: '12.5px', fontWeight: 600, color: 'var(--text-2)',
                    fontFamily: "'DM Mono',monospace",
                  }}>{t}</span>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: '110px 24px' }}>
          <div className="container-sm">
            <R style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '14px' }}>FAQ</span>
              <h2 className="text-display">Common questions,<br />honest answers.</h2>
            </R>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {faqs.map((f, i) => (
                <R key={f.q} delay={i * 60}>
                  <div style={{ borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden', transition: 'border-color .2s' }}>
                    <button
                      onClick={() => setFaq(faqOpen === i ? null : i)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '15.5px', color: 'var(--text)' }}>{f.q}</span>
                      <ChevronDown size={16} color="var(--text-3)" style={{ transform: faqOpen === i ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0, marginLeft: '12px' }} />
                    </button>
                    {faqOpen === i && (
                      <div style={{ padding: '0 22px 18px', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-3)', animation: 'fadeUp .3s ease', fontFamily: "'Manrope',sans-serif" }}>
                        {f.a}
                      </div>
                    )}
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '110px 24px', textAlign: 'center', background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <R style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '18px',
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 32px rgba(255,92,26,0.4)',
            }} className="float-icon glow-accent">
              <Clock size={26} color="#fff" />
            </div>
            <h2 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 900,
              fontSize: 'clamp(36px,5.5vw,64px)', letterSpacing: '-2px',
              color: 'var(--text)', marginBottom: '20px', lineHeight: 1.0,
            }}>
              Ready to make your<br />schedule smarter?
            </h2>
            <p className="text-lead" style={{ marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
              Join students and professionals using Timedule to plan smarter, focus longer, and actually hit their goals.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://timedule.onrender.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '15px 36px', fontSize: '15.5px' }}>
                Start for Free — No Card Needed <ArrowUpRight size={16} />
              </a>
            </div>
            <p style={{ marginTop: '18px', fontSize: '12.5px', color: 'var(--text-4)', fontFamily: "'Manrope',sans-serif" }}>
              Built by{' '}
              <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>AetherSolve Technologies</Link>
              {' '}· Bhilai, India · <button onClick={() => setTc(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, fontSize: '12.5px', padding: 0, fontFamily: "'Manrope',sans-serif" }}>Terms & Conditions</button>
            </p>
          </R>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border)', padding: '28px 24px' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={12} color="#fff" />
              </div>
              <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '13.5px', color: 'var(--footer-text)' }}>Timedule</span>
              <span style={{ fontSize: '12px', color: 'var(--text-4)' }}>by AetherSolve Technologies Pvt. Ltd.</span>
            </div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{ fontSize: '12.5px', color: 'var(--text-4)', textDecoration: 'none', transition: 'color .15s' }}>← Back to AetherSolve</Link>
              <button onClick={() => setTc(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12.5px', color: 'var(--text-4)', fontFamily: "'Manrope',sans-serif", padding: 0 }}>Terms</button>
              <a href="#" style={{ fontSize: '12.5px', color: 'var(--text-4)', textDecoration: 'none' }}>Privacy</a>
              <a href="mailto:hello@aethersolve.com" style={{ fontSize: '12.5px', color: 'var(--text-4)', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}