// src/components/public/HeroSection.jsx
'use client';
import { useEffect, useRef } from 'react';
import { ArrowRight, Play, Star, Users, Code, Award } from 'lucide-react';

const stats = [
  { value: '150+', label: 'Projects Delivered', icon: Code },
  { value: '98%', label: 'Client Retention', icon: Star },
  { value: '12+', label: 'Industries Served', icon: Award },
  { value: '50+', label: 'Team Members', icon: Users },
];

export default function HeroSection() {
  const gradientRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gradientRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      gradientRef.current.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(12,141,233,0.12) 0%, rgba(20,184,166,0.06) 40%, transparent 70%)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white mesh-bg min-h-[90vh] flex flex-col justify-center">
      {/* Dynamic gradient layer */}
      <div ref={gradientRef} className="absolute inset-0 pointer-events-none transition-all duration-700" />

      {/* Geometric decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 600 600" className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0c8de9" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="600" height="600" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-brand-100 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="space-y-8 animate-fade-up">
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-brand-700 tracking-widest uppercase">
                IT Services & Product Company
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 text-slate-900 leading-[1.05] tracking-tight">
                Building
                <span className="block gradient-text">Tomorrow's</span>
                Solutions
                <span className="text-brand-600"> Today.</span>
              </h1>
              <h4 className='font-display text-1xl sm:text-4xl lg:text-3xl font-900 text-slate-600 leading-[0.05] tracking-tight'>
              Think it. AetherSolve it.

              </h4>
            </div>

            {/* Subtext */}
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
              From tailored websites and mobile apps to enterprise ERP systems, AI integrations, 
              and managed cloud infrastructure — we build, host, and grow your digital presence end-to-end.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a href="#services" className="btn-primary text-base px-7 py-3.5">
                Explore Services
                <ArrowRight size={18} />
              </a>
              <a href="#work" className="btn-secondary text-base px-7 py-3.5">
                <Play size={16} className="text-brand-500" />
                View Our Work
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: ['#0c8de9','#14b8a6','#f59e0b','#6366f1'][i] }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
                <span className="font-medium text-slate-600">150+ Happy clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm font-medium text-slate-600 ml-1">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right — Visual Card Stack */}
          <div className="relative hidden lg:block animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Dashboard</span>
                  <span className="flex items-center gap-1.5 text-xs text-teal-600 font-medium bg-teal-50 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                    System Healthy
                  </span>
                </div>

                {/* Fake chart bars */}
                <div className="flex items-end gap-2 h-24 mb-4">
                  {[60, 80, 45, 90, 70, 85, 95, 75, 88, 65, 92, 78].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md"
                      style={{
                        height: `${h}%`,
                        background: i === 10 ? 'linear-gradient(to top, #006ec7, #0c8de9)' : i % 3 === 0 ? '#e0effe' : '#f1f5f9',
                        transition: `height 0.5s ease ${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Uptime', value: '99.97%', color: 'text-teal-600' },
                    { label: 'Response', value: '< 120ms', color: 'text-brand-600' },
                    { label: 'Clients', value: '150+', color: 'text-amber-600' },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className={`text-lg font-bold font-display ${item.color}`}>{item.value}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Award size={16} className="text-teal-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">ISO Certified</div>
                  <div className="text-[10px] text-slate-400">Quality Assured</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Code size={16} className="text-brand-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">10M+ Lines</div>
                  <div className="text-[10px] text-slate-400">Code shipped</div>
                </div>
              </div>

              {/* Background card stack effect */}
              <div className="absolute inset-0 bg-brand-100 rounded-2xl translate-x-4 translate-y-4 -z-10 opacity-40" />
              <div className="absolute inset-0 bg-teal-100 rounded-2xl translate-x-8 translate-y-8 -z-20 opacity-20" />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 bg-brand-50 group-hover:bg-brand-100 rounded-xl flex items-center justify-center transition-colors shrink-0">
                <Icon size={18} className="text-brand-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
