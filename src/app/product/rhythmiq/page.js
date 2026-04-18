'use client';
// src/app/products/rhythmiq/page.js  — or use as a standalone component
// RhythmIQ — Smart Timetable Manager  |  Built by AetherSolve Technologies

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ArrowUpRight,
  Clock, Calendar, Zap, Brain, BarChart3,
  Bell, CheckCircle, Star, Users, TrendingUp,
  Play, Pause, RotateCcw, Moon, Sun,
  BookOpen, Coffee, Target, Award
} from 'lucide-react';

/* ─── font injection ─────────────────────────────────────────── */
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap';

/* ─── scroll reveal hook ─────────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
}
function R({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity .7s ease, transform .7s ease', ...style }}>
      {children}
    </div>
  );
}

/* ─── colour palette (matches AetherSolve but with RhythmIQ tones) ─── */
const C = {
  bg:      '#0b0e14',
  bg2:     '#111520',
  bg3:     '#181d2a',
  surface: '#1c2133',
  border:  'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  text:    '#f0f2f8',
  text2:   '#9aa3b8',
  text3:   '#5a6480',
  accent:  '#7c6bff',   // violet — timetable / schedule feel
  accent2: '#ff6b6b',   // coral
  accent3: '#43d9a2',   // mint
  accentS: 'rgba(124,107,255,0.12)',
};

/* ─── LIVE TIMETABLE PREVIEW (interactive) ───────────────────── */
const SUBJECTS = [
  { name: 'Mathematics',   time: '08:00',  dur: 60, color: '#7c6bff', icon: '∑' },
  { name: 'Physics',       time: '09:15',  dur: 45, color: '#ff6b6b', icon: '⚛' },
  { name: 'Computer Sci.', time: '10:30',  dur: 90, color: '#43d9a2', icon: '</>' },
  { name: 'English',       time: '12:00',  dur: 60, color: '#f59e0b', icon: 'A' },
  { name: 'Break',         time: '13:00',  dur: 30, color: '#3b82f6', icon: '☕' },
  { name: 'Chemistry',     time: '13:30',  dur: 45, color: '#ec4899', icon: '⚗' },
  { name: 'History',       time: '14:30',  dur: 60, color: '#8b5cf6', icon: '📜' },
];
const DAYS = ['Mon','Tue','Wed','Thu','Fri'];

function TimetablePreview() {
  const [active, setActive]     = useState(2);
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [aiSuggestion, setAi]   = useState(false);
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
  const mm     = String(Math.floor(remain / 60)).padStart(2,'0');
  const ss     = String(remain % 60).padStart(2,'0');

  const reset = () => { setRunning(false); setElapsed(0); setAi(false); };

  useEffect(() => {
    if (pct >= 80 && !aiSuggestion) setAi(true);
  }, [pct]);

  return (
    <div style={{ background: C.bg2, borderRadius: '20px', overflow: 'hidden', border: `1px solid ${C.border}`, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', background:C.bg3, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'8px', background: C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Clock size={14} color="#fff" />
          </div>
          <span style={{ fontWeight:700, fontSize:'14px', color:C.text }}>RhythmIQ</span>
          <span style={{ fontSize:'10px', fontWeight:600, padding:'2px 8px', borderRadius:'100px', background:C.accentS, color:C.accent }}>LIVE</span>
        </div>
        <div style={{ display:'flex', gap:'6px' }}>
          {DAYS.map((d,i) => (
            <button key={d} style={{ padding:'4px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:600, border:'none', cursor:'pointer', background: i===2 ? C.accent : C.bg2, color: i===2 ? '#fff' : C.text3, transition:'all .15s' }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'360px' }}>

        {/* Timetable list */}
        <div style={{ borderRight:`1px solid ${C.border}`, padding:'12px', display:'flex', flexDirection:'column', gap:'4px', overflowY:'auto' }}>
          <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.text3, padding:'6px 8px', marginBottom:'4px' }}>
            Wednesday Schedule
          </div>
          {SUBJECTS.map((s, i) => (
            <button key={i} onClick={() => { setActive(i); reset(); }}
              style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 10px', borderRadius:'10px', border:'none', cursor:'pointer', textAlign:'left', background: active === i ? `${s.color}18` : 'transparent', borderLeft: active === i ? `3px solid ${s.color}` : '3px solid transparent', transition:'all .15s', width:'100%' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:`${s.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', flexShrink:0 }}>
                {s.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:'12.5px', color: active===i ? C.text : C.text2, marginBottom:'1px' }}>{s.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:C.text3 }}>{s.time} · {s.dur}min</div>
              </div>
              {active === i && <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:s.color, animation:'pulse 2s infinite' }} />}
            </button>
          ))}
        </div>

        {/* Timer + AI panel */}
        <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>

          {/* Session header */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:'18px', fontWeight:800, color:C.text, letterSpacing:'-0.5px' }}>{sub.name}</div>
              <div style={{ fontSize:'11.5px', color:C.text3, marginTop:'2px' }}>Session · {sub.dur} minutes · {sub.time}</div>
            </div>
            <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:`${sub.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>
              {sub.icon}
            </div>
          </div>

          {/* Big timer */}
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'56px', fontWeight:500, letterSpacing:'-2px', color:C.text, lineHeight:1 }}>
              {mm}:{ss}
            </div>
            <div style={{ fontSize:'11px', color:C.text3, marginTop:'8px', fontFamily:"'DM Mono',monospace" }}>remaining</div>

            {/* Progress ring */}
            <div style={{ margin:'18px auto 0', width:'64px', height:'6px', borderRadius:'100px', background:`${C.accent}20`, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${pct}%`, background:sub.color, borderRadius:'100px', transition:'width .5s linear' }} />
            </div>
            <div style={{ fontSize:'10px', color:C.text3, marginTop:'6px', fontFamily:"'DM Mono',monospace" }}>{Math.round(pct)}% complete</div>
          </div>

          {/* Controls */}
          <div style={{ display:'flex', justifyContent:'center', gap:'10px' }}>
            <button onClick={() => setRunning(r => !r)} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'11px 24px', borderRadius:'100px', border:'none', cursor:'pointer', background:sub.color, color:'#fff', fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'13px', boxShadow:`0 4px 16px ${sub.color}40`, transition:'all .15s' }}>
              {running ? <><Pause size={14}/> Pause</> : <><Play size={14}/> Start</>}
            </button>
            <button onClick={reset} style={{ width:'42px', height:'42px', borderRadius:'100px', border:`1.5px solid ${C.border2}`, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.text3, transition:'all .15s' }}>
              <RotateCcw size={14}/>
            </button>
          </div>

          {/* AI suggestion pill */}
          {aiSuggestion && (
            <div style={{ display:'flex', gap:'10px', padding:'12px 14px', borderRadius:'12px', background:'rgba(67,217,162,0.08)', border:'1px solid rgba(67,217,162,0.2)', animation:'fadeUp .4s ease both' }}>
              <Brain size={15} style={{ color:C.accent3, flexShrink:0, marginTop:'1px' }} />
              <div>
                <div style={{ fontSize:'12px', fontWeight:700, color:C.accent3, marginBottom:'3px' }}>AI Suggestion</div>
                <div style={{ fontSize:'11.5px', color:C.text2, lineHeight:1.6 }}>You're 80% through {sub.name}. Consider a 5-min break before Chemistry — your focus window has been active for 50 min.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURE CARD ───────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, body, color, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <R delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ padding:'28px', borderRadius:'18px', border:`1px solid ${hov ? color+'40' : C.border}`, background: hov ? `${color}0a` : C.surface, transition:'all .25s', cursor:'default', height:'100%' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'16px', color:C.text, marginBottom:'8px', letterSpacing:'-0.3px' }}>{title}</div>
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13.5px', lineHeight:1.75, color:C.text2 }}>{body}</div>
      </div>
    </R>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function RhythmIQPage() {
  const [tab, setTab] = useState(0);

  const features = [
    { icon: Brain,    color:'#7c6bff', title:'AI-Powered Scheduling',      body:'RhythmIQ analyses your workload, deadlines, and energy patterns to auto-generate an optimised weekly timetable. No more manual shuffling.' },
    { icon: Zap,      color:'#ff6b6b', title:'Smart Break Recommendations', body:'Based on session length and subject intensity, the AI suggests ideal break timing and duration — protecting focus without burnout.' },
    { icon: Bell,     color:'#43d9a2', title:'Adaptive Reminders',         body:'Context-aware notifications that nudge you at the right moment — not just by clock time, but by your actual session progress.' },
    { icon: BarChart3,color:'#f59e0b', title:'Weekly Analytics',           body:'Visual insights on study streaks, subject balance, productive hours, and completion rates — presented in clean, readable charts.' },
    { icon: Calendar, color:'#ec4899', title:'Drag-and-Drop Planner',      body:'Rearrange your week visually. Lock critical sessions, mark flex slots, and let the engine optimise around your constraints.' },
    { icon: Target,   color:'#3b82f6', title:'Goal & Deadline Tracking',   body:'Set semester goals and assignment deadlines. RhythmIQ back-calculates required study sessions automatically and alerts when you\'re falling behind.' },
  ];

  const stats = [
    { v: '94%',   l: 'Users hit daily targets',  icon: Target },
    { v: '2.4×',  l: 'Better session completion', icon: TrendingUp },
    { v: '38%',   l: 'Less planning time',        icon: Clock },
    { v: '4.8★',  l: 'Average store rating',      icon: Star },
  ];

  const howItWorks = [
    { n:'01', title:'Set Your Subjects',     body:'Add your subjects, weekly hours needed, and any fixed commitments. Takes under 3 minutes.' },
    { n:'02', title:'AI Builds Your Week',   body:'The engine analyses load distribution and generates a conflict-free, energy-aware timetable.' },
    { n:'03', title:'Start Sessions',        body:'Open today\'s plan, tap a session, and RhythmIQ times and guides you through it.' },
    { n:'04', title:'Review & Improve',      body:'Weekly analytics show what worked. The AI refines next week\'s schedule automatically.' },
  ];

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:${C.bg}; color:${C.text}; font-family:'Plus Jakarta Sans',sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .orbit { animation:spin 18s linear infinite; }
      `}</style>

      <div style={{ background:C.bg, minHeight:'100vh' }}>

        {/* ── NAV ── */}
        <nav style={{ position:'sticky', top:0, zIndex:100, background:`${C.bg}ee`, backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:`linear-gradient(135deg, ${C.accent}, #9d8fff)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Clock size={16} color="#fff" />
              </div>
              <span style={{ fontWeight:800, fontSize:'16px', letterSpacing:'-0.4px' }}>RhythmIQ</span>
              <span style={{ fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'100px', background:C.accentS, color:C.accent, letterSpacing:'0.06em' }}>BETA</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <Link href="/" style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', fontWeight:500, color:C.text2, textDecoration:'none', padding:'7px 12px', borderRadius:'8px', transition:'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.color=C.text}
                onMouseLeave={e => e.currentTarget.style.color=C.text2}
              >
                <ArrowLeft size={13}/> AetherSolve
              </Link>
              <a href="#preview" style={{ padding:'9px 20px', borderRadius:'100px', border:`1.5px solid ${C.border2}`, fontSize:'13px', fontWeight:600, color:C.text2, textDecoration:'none', transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border2; e.currentTarget.style.color=C.text2; }}
              >
                Try Live Preview
              </a>
              <a href="#" style={{ padding:'9px 20px', borderRadius:'100px', background:C.accent, color:'#fff', fontSize:'13px', fontWeight:700, textDecoration:'none', boxShadow:`0 4px 20px ${C.accent}40`, transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >
                Get Free Access
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position:'relative', overflow:'hidden', padding:'100px 24px 80px', textAlign:'center' }}>
          {/* ambient glows */}
          <div style={{ position:'absolute', top:'-100px', left:'50%', transform:'translateX(-50%)', width:'700px', height:'500px', background:`radial-gradient(ellipse, ${C.accent}12 0%, transparent 65%)`, pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'0', right:'10%', width:'400px', height:'300px', background:`radial-gradient(ellipse, ${C.accent2}08 0%, transparent 65%)`, pointerEvents:'none' }} />

          {/* orbit decoration */}
          <div style={{ position:'absolute', top:'60px', right:'80px', opacity:.15, pointerEvents:'none' }} className="orbit">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <circle cx="70" cy="70" r="68" stroke={C.accent} strokeWidth="1" strokeDasharray="6 4" />
              <circle cx="70" cy="4"  r="6" fill={C.accent} />
            </svg>
          </div>
          <div style={{ position:'absolute', bottom:'80px', left:'60px', opacity:.1, pointerEvents:'none' }}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <circle cx="45" cy="45" r="43" stroke={C.accent2} strokeWidth="1" strokeDasharray="4 3" />
              <circle cx="45" cy="2"  r="4" fill={C.accent2} />
            </svg>
          </div>

          <div style={{ maxWidth:'700px', margin:'0 auto', position:'relative', zIndex:1 }}>
            {/* Product badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'6px 16px', borderRadius:'100px', background:C.accentS, border:`1px solid ${C.accent}30`, marginBottom:'28px', animation:'fadeUp .7s ease both' }}>
              <div style={{ width:'16px', height:'16px', borderRadius:'5px', background:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Clock size={9} color="#fff" />
              </div>
              <span style={{ fontSize:'11.5px', fontWeight:700, color:C.accent, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                Product by AetherSolve — Live Now
              </span>
            </div>

            <h1 style={{ fontWeight:900, fontSize:'clamp(44px, 8vw, 84px)', lineHeight:.97, letterSpacing:'clamp(-2px,-0.04em,-4px)', color:C.text, marginBottom:'24px', animation:'fadeUp .7s ease .1s both' }}>
              Your Smartest<br />
              <span style={{ background:`linear-gradient(135deg, ${C.accent}, #c4b5ff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Timetable</span><br />
              Ever Made.
            </h1>

            <p style={{ fontSize:'clamp(15px,1.8vw,18px)', lineHeight:1.8, color:C.text2, maxWidth:'520px', margin:'0 auto 40px', animation:'fadeUp .7s ease .2s both' }}>
              RhythmIQ uses AI to build, manage, and adapt your weekly study or work schedule — automatically optimising for focus, energy, and deadlines.
            </p>

            <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap', animation:'fadeUp .7s ease .3s both' }}>
              <a href="#preview" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 30px', borderRadius:'100px', background:C.accent, color:'#fff', fontWeight:700, fontSize:'14.5px', textDecoration:'none', boxShadow:`0 4px 28px ${C.accent}45`, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; }}
              >
                Try It Live <Play size={14}/>
              </a>
              <a href="#features" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 28px', borderRadius:'100px', border:`1.5px solid ${C.border2}`, color:C.text2, fontWeight:600, fontSize:'14.5px', textDecoration:'none', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.text3; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border2; e.currentTarget.style.color=C.text2; }}
              >
                See All Features <ArrowRight size={14}/>
              </a>
            </div>

            {/* Trust row */}
            <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'20px', marginTop:'40px', paddingTop:'32px', borderTop:`1px solid ${C.border}`, animation:'fadeUp .7s ease .4s both' }}>
              {[['Free to start','No credit card'],['AI-powered','Smart scheduling'],['Web + Mobile','All platforms']].map(([a,b]) => (
                <div key={a} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <CheckCircle size={13} color={C.accent3} />
                  <span style={{ fontSize:'12.5px', fontWeight:600, color:C.text3 }}>{a}</span>
                  <span style={{ fontSize:'11px', color:C.text3, opacity:.6 }}>— {b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'40px 24px', background:C.bg2 }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <R key={s.l} delay={i*80}>
                  <div style={{ textAlign:'center', padding:'20px' }}>
                    <div style={{ fontWeight:900, fontSize:'clamp(28px,3.5vw,40px)', letterSpacing:'-1.5px', color:C.text, lineHeight:1, marginBottom:'6px' }}>{s.v}</div>
                    <div style={{ fontSize:'12px', fontWeight:500, color:C.text3, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.l}</div>
                  </div>
                </R>
              );
            })}
          </div>
        </section>

        {/* ── LIVE PREVIEW ── */}
        <section id="preview" style={{ padding:'100px 24px' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <R style={{ textAlign:'center', marginBottom:'56px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.accent, display:'block', marginBottom:'14px' }}>Live Product Preview</span>
              <h2 style={{ fontWeight:800, fontSize:'clamp(32px,4.5vw,56px)', letterSpacing:'-1.5px', color:C.text, marginBottom:'16px' }}>
                This Is RhythmIQ.<br/>
                <span style={{ color:C.text3, fontWeight:400 }}>Not a mockup — actually works.</span>
              </h2>
              <p style={{ fontSize:'16px', lineHeight:1.8, color:C.text2, maxWidth:'500px', margin:'0 auto' }}>
                Click a subject, hit Start, and see the AI suggestion trigger when you reach 80% of a session. This is the real interface.
              </p>
            </R>

            <R delay={100}>
              <TimetablePreview />
            </R>

            <R delay={200} style={{ marginTop:'16px' }}>
              <div style={{ display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap' }}>
                {[
                  ['Click any subject','to switch session'],
                  ['Hit Start','to run the timer'],
                  ['Reach 80%','to trigger AI tip'],
                  ['Click Reset','to restart'],
                ].map(([a,b]) => (
                  <div key={a} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'100px', background:C.surface, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:'11.5px', fontWeight:700, color:C.text }}>{a}</span>
                    <span style={{ fontSize:'11px', color:C.text3 }}>{b}</span>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding:'100px 24px', background:C.bg2 }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <R style={{ textAlign:'center', marginBottom:'56px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.accent, display:'block', marginBottom:'14px' }}>Features</span>
              <h2 style={{ fontWeight:800, fontSize:'clamp(30px,4vw,52px)', letterSpacing:'-1.5px', color:C.text, marginBottom:'16px' }}>
                Built for how students<br/>actually study.
              </h2>
              <p style={{ fontSize:'16px', lineHeight:1.8, color:C.text2, maxWidth:'460px', margin:'0 auto' }}>
                Everything a timetable should do, powered by an engine that actually understands workload.
              </p>
            </R>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
              {features.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={i * 60} />
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding:'100px 24px' }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <R style={{ textAlign:'center', marginBottom:'64px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.accent, display:'block', marginBottom:'14px' }}>How It Works</span>
              <h2 style={{ fontWeight:800, fontSize:'clamp(30px,4vw,52px)', letterSpacing:'-1.5px', color:C.text }}>
                Set up in minutes.<br/>Focus for the whole week.
              </h2>
            </R>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'24px' }}>
              {howItWorks.map((s, i) => (
                <R key={s.n} delay={i * 80}>
                  <div style={{ position:'relative' }}>
                    {/* connector */}
                    {i < 3 && (
                      <div style={{ position:'absolute', top:'20px', left:'calc(100% + 2px)', width:'calc(100% - 4px)', height:'1px', background:`linear-gradient(90deg, ${C.accent}60, transparent)`, display:'none' }} className="connector" />
                    )}
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                      <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:`linear-gradient(135deg, ${C.accent}30, ${C.accent}10)`, border:`1px solid ${C.accent}30`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono',monospace", fontWeight:500, fontSize:'12px', color:C.accent, flexShrink:0 }}>
                        {s.n}
                      </div>
                      {i < 3 && <ArrowRight size={16} color={C.text3} style={{ flexShrink:0 }} />}
                    </div>
                    <h3 style={{ fontWeight:700, fontSize:'16px', color:C.text, marginBottom:'8px', letterSpacing:'-0.3px' }}>{s.title}</h3>
                    <p style={{ fontSize:'13.5px', lineHeight:1.75, color:C.text2 }}>{s.body}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── SUBJECT PREVIEW TABS ── */}
        <section style={{ padding:'100px 24px', background:C.bg2 }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <R style={{ textAlign:'center', marginBottom:'48px' }}>
              <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.accent, display:'block', marginBottom:'14px' }}>Smart Load Balancing</span>
              <h2 style={{ fontWeight:800, fontSize:'clamp(28px,4vw,48px)', letterSpacing:'-1.5px', color:C.text }}>
                Balanced across every subject.
              </h2>
            </R>

            {/* Tabs */}
            <R delay={100}>
              <div style={{ display:'flex', gap:'6px', marginBottom:'24px', overflowX:'auto', paddingBottom:'4px' }}>
                {['Weekly Overview','Subject Balance','Focus Streaks','Deadline Tracker'].map((t, i) => (
                  <button key={t} onClick={() => setTab(i)} style={{ padding:'9px 18px', borderRadius:'100px', border:'none', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:'13px', whiteSpace:'nowrap', transition:'all .2s', background: tab===i ? C.accent : C.surface, color: tab===i ? '#fff' : C.text3, boxShadow: tab===i ? `0 4px 16px ${C.accent}40` : 'none' }}>
                    {t}
                  </button>
                ))}
              </div>
            </R>

            <R delay={150}>
              <div style={{ background:C.bg3, borderRadius:'18px', border:`1px solid ${C.border}`, padding:'24px', minHeight:'220px' }}>
                {tab === 0 && (
                  <div>
                    <div style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", color:C.text3, marginBottom:'16px', letterSpacing:'0.08em' }}>THIS WEEK — 32h SCHEDULED</div>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'100px' }}>
                      {DAYS.map((d, i) => {
                        const h = [6.5,7,5,8,5.5][i];
                        return (
                          <div key={d} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', color:C.text3 }}>{h}h</div>
                            <div style={{ width:'100%', height:`${h/8*100}%`, borderRadius:'5px 5px 0 0', background: i===2 ? C.accent : `${C.accent}30` }} />
                            <div style={{ fontSize:'11px', fontWeight:600, color: i===2 ? C.text : C.text3 }}>{d}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {tab === 1 && (
                  <div>
                    <div style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", color:C.text3, marginBottom:'16px', letterSpacing:'0.08em' }}>SUBJECT DISTRIBUTION</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      {SUBJECTS.slice(0,5).map(s => (
                        <div key={s.name} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <div style={{ width:'110px', fontSize:'12.5px', fontWeight:600, color:C.text2 }}>{s.name}</div>
                          <div style={{ flex:1, height:'8px', borderRadius:'100px', background:`${s.color}20`, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${s.dur/90*100}%`, background:s.color, borderRadius:'100px' }} />
                          </div>
                          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'10.5px', color:C.text3, width:'36px', textAlign:'right' }}>{s.dur}m</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {tab === 2 && (
                  <div>
                    <div style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", color:C.text3, marginBottom:'16px', letterSpacing:'0.08em' }}>14-DAY FOCUS STREAK</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {Array.from({length:14},(_,i) => ({
                        filled: i < 11,
                        intense: [2,3,5,8,9,10].includes(i),
                      })).map((d, i) => (
                        <div key={i} title={`Day ${i+1}`} style={{ width:'36px', height:'36px', borderRadius:'9px', background: d.filled ? (d.intense ? C.accent : `${C.accent}50`) : C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {d.filled && <div style={{ width:'10px', height:'10px', borderRadius:'50%', background: d.intense ? '#fff' : C.text3 }} />}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:'14px', fontSize:'13px', color:C.text3 }}>🔥 <span style={{ fontWeight:700, color:C.accent }}>11-day</span> current streak — keep going!</div>
                  </div>
                )}
                {tab === 3 && (
                  <div>
                    <div style={{ fontSize:'11px', fontFamily:"'DM Mono',monospace", color:C.text3, marginBottom:'16px', letterSpacing:'0.08em' }}>UPCOMING DEADLINES</div>
                    {[
                      { name:'Physics Assignment',    due:'Tomorrow',   pct:80,  color:'#ff6b6b', urgent:true },
                      { name:'Math Mid-Term Prep',    due:'In 3 days',  pct:55,  color:'#7c6bff' },
                      { name:'CS Project Submission', due:'In 1 week',  pct:35,  color:'#43d9a2' },
                      { name:'English Essay',         due:'In 2 weeks', pct:15,  color:'#f59e0b' },
                    ].map(d => (
                      <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 0', borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                            <span style={{ fontSize:'13px', fontWeight:600, color:C.text }}>{d.name}</span>
                            {d.urgent && <span style={{ fontSize:'9.5px', fontWeight:700, padding:'1px 7px', borderRadius:'100px', background:'rgba(255,107,107,0.15)', color:'#ff6b6b' }}>URGENT</span>}
                          </div>
                          <div style={{ height:'5px', borderRadius:'100px', background:`${d.color}20`, overflow:'hidden' }}>
                            <div style={{ height:'100%', width:`${d.pct}%`, background:d.color, borderRadius:'100px' }} />
                          </div>
                        </div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'11px', color:C.text3, whiteSpace:'nowrap' }}>{d.due}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </R>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section style={{ padding:'80px 24px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
            <R style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'20px' }}>
              <div>
                <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.text3, display:'block', marginBottom:'8px' }}>Built With</span>
                <h3 style={{ fontWeight:800, fontSize:'22px', letterSpacing:'-0.5px', color:C.text }}>Powered by modern, reliable tech.</h3>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {['React Native','Next.js','Supabase','GPT-4o','PostgreSQL','Node.js','Vercel'].map(t => (
                  <span key={t} style={{ padding:'7px 14px', borderRadius:'100px', background:C.surface, border:`1px solid ${C.border}`, fontSize:'12.5px', fontWeight:600, color:C.text2, fontFamily:"'DM Mono',monospace" }}>
                    {t}
                  </span>
                ))}
              </div>
            </R>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding:'100px 24px', textAlign:'center', position:'relative', overflow:'hidden', background:C.bg2 }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'600px', height:'400px', background:`radial-gradient(ellipse, ${C.accent}10, transparent 65%)`, pointerEvents:'none' }} />
          <R style={{ position:'relative', zIndex:1, maxWidth:'600px', margin:'0 auto' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:`linear-gradient(135deg, ${C.accent}, #9d8fff)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', boxShadow:`0 8px 32px ${C.accent}40`, animation:'float 4s ease-in-out infinite' }}>
              <Clock size={24} color="#fff" />
            </div>
            <h2 style={{ fontWeight:900, fontSize:'clamp(36px,5vw,60px)', letterSpacing:'-2px', color:C.text, marginBottom:'20px', lineHeight:1.05 }}>
              Ready to make<br/>your schedule smarter?
            </h2>
            <p style={{ fontSize:'16px', lineHeight:1.8, color:C.text2, marginBottom:'36px' }}>
              Join students and professionals using RhythmIQ to plan smarter, focus longer, and actually hit their goals.
            </p>
            <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
              <a href="#" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'15px 34px', borderRadius:'100px', background:C.accent, color:'#fff', fontWeight:700, fontSize:'15px', textDecoration:'none', boxShadow:`0 6px 32px ${C.accent}50`, transition:'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                Start for Free — No Card Needed <ArrowUpRight size={16}/>
              </a>
            </div>
            <p style={{ marginTop:'16px', fontSize:'12.5px', color:C.text3 }}>
              Built by{' '}
              <Link href="/" style={{ color:C.accent, textDecoration:'none', fontWeight:600 }}>AetherSolve Technologies</Link>
              {' '}· Bhilai, India
            </p>
          </R>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop:`1px solid ${C.border}`, padding:'24px', textAlign:'center' }}>
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
            <span style={{ fontSize:'12.5px', color:C.text3 }}>© {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd.</span>
            <span style={{ color:C.border2 }}>·</span>
            <Link href="/" style={{ fontSize:'12.5px', color:C.text3, textDecoration:'none', transition:'color .15s' }}
              onMouseEnter={e => e.currentTarget.style.color=C.text}
              onMouseLeave={e => e.currentTarget.style.color=C.text3}
            >← Back to AetherSolve</Link>
            <span style={{ color:C.border2 }}>·</span>
            <a href="#" style={{ fontSize:'12.5px', color:C.text3, textDecoration:'none' }}>Privacy</a>
            <a href="#" style={{ fontSize:'12.5px', color:C.text3, textDecoration:'none' }}>Terms</a>
          </div>
        </footer>
      </div>
    </>
  );
}