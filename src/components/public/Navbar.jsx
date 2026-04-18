'use client';
// src/components/public/Navbar.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Services',   href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Work',       href: '/company/work' },
  { label: 'Blog',       href: '/company/blog' },
  { label: 'Careers',    href: '#careers' },
  {label: 'Product',     href: '/product/timedule'  }
];

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('ast-theme') || 'light';
    setTheme(saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ast-theme', next);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'var(--navbar-bg)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/newaether.png" alt="AetherSolve" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--text)', letterSpacing: '-0.5px' }}>
              AetherSolve
            </span>
          </Link>

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} className="hidden-mobile">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{
                fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '14px',
                color: 'var(--text-3)', padding: '7px 14px', borderRadius: '10px',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--bg-2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden-mobile">
            {/* aether.ai */}
            <Link href="/services/aipage" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '100px',
                border: '1.5px solid var(--border-2)',
                background: 'var(--surface)', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; }}
              >
                <img src="/aetherbgrem.png" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12.5px', color: 'var(--text)' }}>aether.ai</span>
                <ArrowUpRight size={11} style={{ color: 'var(--text-4)' }} />
              </div>
            </Link>

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{
              width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--border)',
              background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-3)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-3)'; }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <a href="#contact" className="btn btn-primary" style={{ padding: '9px 20px', borderRadius: '100px', fontSize: '13.5px' }}>
              Get In Touch
            </a>
          </div>

          {/* Mobile toggle */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="show-mobile">
            <button onClick={toggleTheme} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
            <button onClick={() => setOpen(!open)} style={{ width: '36px', height: '36px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'var(--navbar-bg)', backdropFilter: 'blur(24px)', borderTop: '1px solid var(--border)', padding: '16px 24px 24px' }}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '12px 16px', borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px', color: 'var(--text-2)', textDecoration: 'none', marginBottom: '2px', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >{l.label}</a>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px', fontSize: '13.5px' }}>
              Get In Touch
            </a>
            <Link href="/services/aipage" onClick={() => setOpen(false)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', border: '1.5px solid var(--border-2)', borderRadius: '100px', fontSize: '13.5px', fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
              <img src="/aetherbgrem.png" alt="" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
              aether.ai
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } }
      `}</style>
    </nav>
  );
}