// src/components/public/Navbar.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

const navLinks = [
  { label: 'Services',      href: '#services' },
  { label: 'Products',      href: '#products' },
  { label: 'Industries',    href: '#industries' },
  { label: 'Work',          href: '/company/work' },
  { label: 'Testimonials',  href: '#testimonials' },
  { label: 'Careers',       href: '#careers' },
  {label: 'Blog',           href: "/company/blog" },
 
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* aether.png from public/ — 36x36 looks clean in a 64px navbar */}
            <div className="relative w-9 h-9 shrink-0">
              <Image
                src="/newaether.png"
                alt="AetherSolve logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-slate-900 text-base tracking-tight">
                AetherSolve
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Technologies
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* ── CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/services/aipage">
           <button className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest overflow-hidden text-black transition-all duration-200"
         
         
           >
          <div className="relative w-9 h-9 shrink-0">
                      <Image
                          src="/aetherbgrem.png"
                          alt="AetherSolve logo"
                          fill
                          sizes="36px"
                          className="object-contain"
                          priority
                          
                      />
                      </div>
                      aether.ai
          </button>
          
          </Link>
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
            >
              Contact
            </a>
            <a
              href="#careers"
              className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              Join Us
            </a>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-slate-700 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-3 flex gap-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl"
              >
                Contact
              </a>
              <a
                href="#careers"
                onClick={() => setOpen(false)}
                className="flex-1 text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl"
              >
                Join Us
              </a>

               <Link href="/services/aipage">
           <button className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest overflow-hidden text-black transition-all duration-200"
         
         
           >
          <div className="relative w-9 h-9 shrink-0">
                      <Image
                          src="/aetherbgrem.png"
                          alt="AetherSolve logo"
                          fill
                          sizes="36px"
                          className="object-contain"
                          priority
                          
                      />
                      </div>
                      aether.ai
          </button>
          
          </Link>
            </div>
            
             
          </div>
        </div>
      )}
    </nav>
  );
}