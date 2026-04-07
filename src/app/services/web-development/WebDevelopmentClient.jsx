'use client';
// src/app/services/web-development/WebDevelopmentClient.jsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, CheckCircle, Code2, Zap, Shield, BarChart3, Globe, Layers, Monitor, Smartphone, MousePointer, Star, ChevronDown } from 'lucide-react';

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const num = parseFloat(target);
        const timer = setInterval(() => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * num));
          if (progress === 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Scroll reveal wrapper ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Browser mock component ────────────────────────────────────────────────────
function BrowserMock() {
  const [active, setActive] = useState(0);
  const screens = [
    { color: '#f0f7ff', label: 'Landing Page', elements: ['hero', 'nav', 'cards', 'footer'] },
    { color: '#f0fdfa', label: 'Dashboard', elements: ['chart', 'stats', 'table', 'sidebar'] },
    { color: '#fdf4ff', label: 'E-Commerce', elements: ['products', 'cart', 'search', 'filter'] },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % screens.length), 2500);
    return () => clearInterval(t);
  }, []);

  const s = screens[active];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Shadow cards behind */}
      <div className="absolute inset-0 bg-slate-200 rounded-2xl translate-x-3 translate-y-3 opacity-40" />
      <div className="absolute inset-0 bg-slate-100 rounded-2xl translate-x-1.5 translate-y-1.5 opacity-60" />

      {/* Browser window */}
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 flex items-center gap-2 border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full border border-slate-300" />
            aethersolve.com/{s.label.toLowerCase().replace(' ', '-')}
          </div>
        </div>

        {/* Screen content */}
        <div
          className="p-5 transition-all duration-700 min-h-[280px]"
          style={{ background: s.color }}
          key={active}
        >
          {/* Animated skeleton layout */}
          <div className="animate-[fadeIn_.5s_ease]">
            {/* Fake nav */}
            <div className="flex items-center justify-between mb-5">
              <div className="h-5 w-24 bg-brand-200 rounded-full opacity-80" />
              <div className="flex gap-2">
                {[48, 36, 52, 40].map((w, i) => (
                  <div key={i} className="h-3 rounded-full bg-slate-200" style={{ width: w }} />
                ))}
              </div>
              <div className="h-7 w-20 bg-brand-600 rounded-lg" />
            </div>

            {active === 0 && (
              <>
                <div className="h-10 bg-slate-800 rounded-xl w-3/4 mb-3" />
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-1.5" />
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6" />
                <div className="flex gap-3 mb-8">
                  <div className="h-10 w-32 bg-brand-600 rounded-xl" />
                  <div className="h-10 w-28 bg-white border border-slate-200 rounded-xl" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="h-8 w-8 bg-brand-100 rounded-lg mb-2" />
                      <div className="h-3 bg-slate-200 rounded mb-1.5 w-3/4" />
                      <div className="h-2.5 bg-slate-100 rounded w-full" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {active === 1 && (
              <>
                <div className="flex gap-3 mb-4">
                  {[['2,847', 'Users'], ['₹1.2M', 'Revenue'], ['94%', 'Retention'], ['23ms', 'Latency']].map(([v, l]) => (
                    <div key={l} className="flex-1 bg-white rounded-xl p-2.5 shadow-sm text-center">
                      <div className="text-sm font-bold text-slate-800">{v}</div>
                      <div className="text-[10px] text-slate-400">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl p-3 mb-3 shadow-sm">
                  <div className="flex items-end gap-1 h-16">
                    {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 72, 100].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{ height: `${h}%`, background: i === 11 ? '#006ec7' : i > 8 ? '#e0effe' : '#f1f5f9' }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                      <div className="w-5 h-5 bg-brand-100 rounded-full" />
                      <div className="h-2.5 bg-slate-200 rounded flex-1" />
                      <div className="h-2.5 w-12 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {active === 2 && (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                      <div className="h-12 bg-gradient-to-br from-slate-100 to-slate-200" />
                      <div className="p-2">
                        <div className="h-2.5 bg-slate-200 rounded mb-1 w-3/4" />
                        <div className="h-2 bg-slate-100 rounded w-1/2" />
                        <div className="flex justify-between items-center mt-2">
                          <div className="h-3 w-12 bg-brand-100 rounded" />
                          <div className="h-6 w-6 bg-brand-600 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tab indicators */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 flex items-center justify-between">
          <div className="flex gap-1.5">
            {screens.map((_, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-brand-600' : 'w-1.5 bg-slate-300'}`} />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2 animate-[float_3s_ease-in-out_infinite]">
        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        <span className="text-xs font-semibold text-slate-700">99.97% Uptime</span>
      </div>
      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-slate-100 px-3 py-2 flex items-center gap-2 animate-[float_3s_ease-in-out_infinite_.8s]">
        <Zap size={12} className="text-brand-600" />
        <span className="text-xs font-semibold text-slate-700">&lt; 1.8s Load</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const features = [
  { icon: Globe, color: '#006ec7', title: 'Custom Web Applications', desc: 'Tailored platforms built around your exact business logic — from MVPs to enterprise systems handling millions of users.' },
  { icon: BarChart3, color: '#0d9488', title: 'E-Commerce Platforms', desc: 'High-converting stores with smart inventory, payment gateways, and AI-powered product recommendations.' },
  { icon: Zap, color: '#f59e0b', title: 'Progressive Web Apps', desc: 'App-like browser experiences — fast, offline-capable, and installable on any device without app store friction.' },
  { icon: Layers, color: '#8b5cf6', title: 'CMS & Content Platforms', desc: 'Headless CMS setups with intuitive editors so your team updates content without ever touching a developer.' },
  { icon: Code2, color: '#ec4899', title: 'API Development', desc: 'RESTful and GraphQL APIs built for performance, scalability, and seamless third-party integrations.' },
  { icon: Shield, color: '#059669', title: 'Web Portals & Dashboards', desc: 'Data-rich portals with real-time analytics, role-based access control, and enterprise-grade security.' },
];

const stack = [
  { name: 'React / Next.js', icon: '⚛️' },
  { name: 'Node.js', icon: '🟢' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'AWS / GCP', icon: '☁️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'GraphQL', icon: '◈' },
];

const process = [
  { step: '01', title: 'Discovery & Scoping', desc: 'We map your goals, users, and technical constraints — creating a detailed spec before any code is written.' },
  { step: '02', title: 'UI/UX Design', desc: 'Interactive Figma prototypes you can click through and approve before a single component is built.' },
  { step: '03', title: 'Agile Development', desc: 'Two-week sprints with live demo deployments — you see and test real progress continuously.' },
  { step: '04', title: 'Testing & QA', desc: 'Automated test suites, cross-browser checks, load testing, and security scans before launch.' },
  { step: '05', title: 'Launch & Handoff', desc: 'Zero-downtime deployment with documentation, training, and a 30-day post-launch support window.' },
  { step: '06', title: 'AMC & Growth', desc: 'Ongoing maintenance, performance monitoring, feature expansions, and SEO optimisation.' },
];

const testimonials = [
  { name: 'Rajesh Mehta', role: 'CTO, FinEdge Solutions', text: 'The fintech platform AetherSolve built handles 50,000+ daily transactions flawlessly. Engineering excellence at every layer.', rating: 5 },
  { name: 'Priya Sharma', role: 'Founder, EduPath', text: 'Our LMS was live in 4 months and now serves 12,000 students. The team understood our domain deeply.', rating: 5 },
  { name: 'Vikram Singh', role: 'Head of Digital, RetailPlus', text: 'The e-commerce rebuild drove a 3x revenue increase within 6 months. The AI recommendations alone were transformative.', rating: 5 },
];

const useCases = [
  { icon: '🏦', title: 'Fintech Platforms', desc: 'Payments, wallets, lending dashboards with real-time data and compliance baked in.' },
  { icon: '🛍', title: 'D2C E-Commerce', desc: 'Custom storefronts with checkout optimisation, loyalty, and inventory management.' },
  { icon: '🏥', title: 'Healthcare Portals', desc: 'Patient portals, appointment booking, and telemedicine platforms.' },
  { icon: '📚', title: 'EdTech Platforms', desc: 'LMS, live classes, assessments, and student analytics at scale.' },
  { icon: '🏗', title: 'Enterprise Intranets', desc: 'Internal tools, HR portals, and operational dashboards for large teams.' },
  { icon: '📊', title: 'SaaS Products', desc: 'Multi-tenant B2B SaaS from MVP to scale — owned or co-developed.' },
];

export default function WebDevelopmentClient() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="theme-adapt min-h-screen bg-white overflow-x-hidden">
      {/* Styles injected via globals.css */}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/newaether.png" alt="AetherSolve" className="w-9 h-9 object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-slate-900 text-base tracking-tight">AetherSolve</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Technologies</span>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.025]">
          <svg width="100%" height="100%">
            <defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#000" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #006ec7, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #14b8a6, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
            <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/#services" className="hover:text-brand-500 transition-colors">Services</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">Web Development</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 mb-6">
                <Globe size={13} className="text-brand-600" />
                <span className="text-xs font-semibold text-brand-700 tracking-widest uppercase">Web Development</span>
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
                <span className="shimmer-text">Web Development</span>
                <span className="block text-slate-900 mt-1">That Scales With</span>
                <span className="block text-slate-900">Your Business.</span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                We build fast, secure, and beautiful web applications tailored exactly to your requirements — 
                from MVPs to enterprise-grade platforms handling millions of users.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link href="/#contact" className="btn-primary text-base px-7 py-3.5">
                  Start Your Project <ArrowRight size={16} />
                </Link>
                <Link href="/company/work" className="btn-secondary text-base px-7 py-3.5">
                  View Our Work
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                {['React & Next.js experts', 'Delivered in sprints', 'Post-launch AMC included'].map(b => (
                  <span key={b} className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-teal-500" />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — animated browser */}
            <div style={{ animationDelay: '0.2s', animation: 'fadeIn 0.8s ease both' }}>
              <BrowserMock />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span className="text-[10px] text-slate-400 tracking-widest uppercase">Scroll</span>
          <ChevronDown size={14} className="text-slate-400 animate-bounce" />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <Reveal>
        <section className="border-y border-slate-100 bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[['80', '+', 'Websites Delivered'], ['99', '%', 'Uptime SLA'], ['1.8', 's', 'Avg Load Time'], ['150', '+', 'Happy Clients']].map(([n, s, l], i) => (
              <div key={l} className="text-center">
                <div className="font-display text-3xl font-bold text-slate-900 mb-0.5">
                  <Counter target={n} suffix={s} duration={1500 + i * 200} />
                </div>
                <div className="text-sm text-slate-400 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Features ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="section-label mb-4">What We Build</span>
            <h2 className="font-display text-4xl font-bold text-slate-900 mt-3 mb-4">
              Everything Your Business Needs Online
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From a single-page marketing site to a multi-tenant SaaS platform — 
              we build exactly what the problem requires, nothing more.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 80}>
                <div
                  className="card-hover bg-white rounded-2xl border border-slate-100 p-6 cursor-default group"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}15` }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  <div
                    className="mt-4 text-xs font-semibold flex items-center gap-1 transition-all duration-300"
                    style={{ color: f.color, opacity: hoveredFeature === i ? 1 : 0, transform: hoveredFeature === i ? 'translateX(0)' : 'translateX(-8px)' }}
                  >
                    Learn more <ArrowRight size={11} />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-teal-400 bg-teal-400/10 px-3 py-1.5 rounded-full mb-4">Industries We've Built For</span>
              <h2 className="font-display text-4xl font-bold text-white mb-4">Real-World Use Cases</h2>
              <p className="text-slate-400 max-w-xl mx-auto">Every industry has unique requirements. Here's where we've shipped production-grade web products.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((u, i) => (
              <Reveal key={u.title} delay={i * 60}>
                <div className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-2xl p-6 transition-all duration-300 card-hover">
                  <div className="text-3xl mb-3">{u.icon}</div>
                  <h3 className="font-bold text-white mb-1">{u.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{u.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div>
              <span className="section-label mb-4">Technology Stack</span>
              <h2 className="font-display text-4xl font-bold text-slate-900 mt-3 mb-5">
                Tools Chosen for the Problem, Not the Trend
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                We are framework-agnostic. Our default stack is battle-tested across 80+ production deployments — 
                but we adapt to your constraints, team, and scale requirements.
              </p>
              <p className="text-slate-500 leading-relaxed">
                Every technology choice is justified by the problem — we never add complexity for its own sake.
              </p>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid grid-cols-2 gap-3">
              {stack.map((s, i) => (
                <div
                  key={s.name}
                  className="card-hover bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-3 shadow-sm"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="section-label mb-4">Our Process</span>
              <h2 className="font-display text-4xl font-bold text-slate-900 mt-3 mb-4">From Brief to Launch</h2>
              <p className="text-slate-500 max-w-xl mx-auto">No surprises. No scope creep. A structured process that keeps you informed and in control at every stage.</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="relative flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-brand-200">
                      {p.step}
                    </div>
                    {i < 5 && <div className="w-px flex-1 bg-gradient-to-b from-brand-200 to-transparent mt-2 hidden lg:block" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-display font-bold text-slate-900 mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Device mockup strip ── */}
      <Reveal>
        <section className="py-16 overflow-hidden bg-brand-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-10">
            <div className="text-white flex-1">
              <h2 className="font-display text-3xl font-bold mb-3">Built for Every Screen</h2>
              <p className="text-brand-100 leading-relaxed mb-6">
                Every website we build is meticulously tested and optimised across desktop, tablet, and mobile — 
                because 60% of your visitors are on a phone.
              </p>
              <div className="flex flex-wrap gap-3">
                {[Monitor, Smartphone].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                    <Icon size={15} className="text-white" />
                    <span className="text-white text-sm font-medium">{['Desktop', 'Mobile'][i]}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2">
                  <MousePointer size={15} className="text-white" />
                  <span className="text-white text-sm font-medium">Accessibility AA</span>
                </div>
              </div>
            </div>
            {/* Fake responsive bar */}
            <div className="flex items-end gap-3 shrink-0">
              {[
                { w: 180, h: 120, label: 'Desktop' },
                { w: 90, h: 140, label: 'Tablet' },
                { w: 54, h: 110, label: 'Mobile' },
              ].map(d => (
                <div key={d.label} className="flex flex-col items-center gap-2">
                  <div className="bg-white/10 rounded-xl border border-white/20 flex items-center justify-center"
                    style={{ width: d.w, height: d.h }}>
                    <div className="w-3/4 h-3/4 grid gap-1" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      {[0,1,2,3].map(i => <div key={i} className="bg-white/20 rounded" />)}
                    </div>
                  </div>
                  <span className="text-white/60 text-[10px] font-medium">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Testimonials ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-14">
            <span className="section-label mb-4">Client Stories</span>
            <h2 className="font-display text-4xl font-bold text-slate-900 mt-3">What Clients Say</h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <div className="card-hover bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={13} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <Reveal>
        <section className="py-24 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <svg width="100%" height="100%">
              <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-900/50">
              <Globe size={24} className="text-white" />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5">
              Ready to Build Something Exceptional?
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Tell us about your project. We'll come back with a detailed proposal, timeline, and a fixed-price quote — within 48 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#contact" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-900/30">
                Start the Conversation <ArrowRight size={16} />
              </Link>
              <Link href="/company/work" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-7 py-3.5 rounded-xl border border-slate-700 transition-colors">
                See Our Portfolio
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-500 py-6 text-center text-xs border-t border-slate-800">
        © {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd. ·{' '}
        <Link href="/" className="hover:text-slate-300 transition-colors">Back to Home</Link>
      </footer>
    </div>
  );
}
