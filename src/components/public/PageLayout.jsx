// src/components/public/PageLayout.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PageLayout({ children, breadcrumb, title, subtitle, badge, heroColor = '#006ec7' }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 shrink-0">
              <Image src="/aether.png" alt="AetherSolve" fill sizes="36px" className="object-contain" priority />
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

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${heroColor}15 0%, ${heroColor}05 100%)` }}>
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs><pattern id="pg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#pg)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 relative">
          {breadcrumb && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-brand-500 transition-colors">Home</Link>
              <span>/</span>
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  {b.href ? <Link href={b.href} className="hover:text-brand-500 transition-colors">{b.label}</Link> : <span className="text-slate-600 font-medium">{b.label}</span>}
                  {i < breadcrumb.length - 1 && <span>/</span>}
                </span>
              ))}
            </div>
          )}
          {badge && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-4" style={{ background: `${heroColor}15`, color: heroColor }}>
              {badge}
            </span>
          )}
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mb-4 max-w-3xl">{title}</h1>
          {subtitle && <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {children}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-1">Ready to get started?</h3>
            <p className="text-slate-500 text-sm">Let's build something great together.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/#contact" className="btn-primary">Get In Touch <ArrowRight size={15} /></Link>
            <Link href="/" className="btn-secondary">View All Services</Link>
          </div>
        </div>
      </div>

      {/* Simple footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs">
        © {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd. All rights reserved.
      </footer>
    </div>
  );
}