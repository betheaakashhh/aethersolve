'use client';
// src/components/public/PageLayout.jsx
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PageLayout({ children, breadcrumb, title, subtitle, badge, heroColor = 'var(--accent)' }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('ast-theme') || 'light';
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ast-theme', next);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--navbar-bg)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/aether.png" alt="AetherSolve" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px', color: 'var(--text)', letterSpacing: '-0.4px' }}>AetherSolve</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={toggleTheme} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)' }}>
              {theme === 'light' ? <Moon size={13} /> : <Sun size={13} />}
            </button>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', padding: '7px 14px', borderRadius: '10px', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '72px 0 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          {breadcrumb && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Link href="/" style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-4)', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: 'var(--border-2)' }}>/</span>
              {breadcrumb.map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {b.href
                    ? <Link href={b.href} style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-4)', textDecoration: 'none' }}>{b.label}</Link>
                    : <span style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-2)', fontWeight: 600 }}>{b.label}</span>}
                  {i < breadcrumb.length - 1 && <span style={{ color: 'var(--border-2)' }}>/</span>}
                </span>
              ))}
            </div>
          )}
          {badge && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 13px', borderRadius: '100px', background: 'var(--accent-soft)', border: '1.5px solid var(--accent-soft2)', fontFamily: 'var(--font-body)', fontSize: '11.5px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em', marginBottom: '16px' }}>
              {badge}
            </span>
          )}
          <h1 className="text-display" style={{ color: 'var(--text)', marginBottom: '16px', maxWidth: '720px' }}>{title}</h1>
          {subtitle && <p className="text-lead" style={{ maxWidth: '600px' }}>{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        {children}
      </div>

      {/* Footer CTA */}
      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
          <h3 className="text-section" style={{ color: 'var(--text)' }}>Ready to get started?</h3>
          <p className="text-body" style={{ maxWidth: '400px' }}>Let's build something great together.</p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/#contact" className="btn btn-primary">Get In Touch <ArrowRight size={15} /></Link>
            <Link href="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--footer-bg)', padding: '20px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd.
        </p>
      </footer>
    </div>
  );
}