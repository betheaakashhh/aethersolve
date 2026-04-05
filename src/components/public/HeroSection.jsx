'use client';
// src/components/public/HeroSection.jsx
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const WORDS = ['Websites', 'Mobile Apps', 'ERP Systems', 'AI Agents', 'SaaS Products'];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [wordVisible, setWordVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setWordVisible(false);
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setWordVisible(true); }, 320);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  const TICKER = ['Web Development','Mobile Apps','UI/UX Design','ERP Systems','AI Integration','Cloud Hosting','Fintech','EdTech','HealthTech','SaaS','DevOps','Analytics'];

  return (
    <section style={{ background: 'var(--bg)', paddingTop: '64px', overflow: 'hidden' }}>

      {/* ── HERO CENTER ── */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>

        {/* Eyebrow pill */}
        <div className="animate-fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '100px', border: '1.5px solid var(--border-2)', background: 'var(--accent-soft)', marginBottom: '32px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
            IT Services &amp; Product Company
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up stagger-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(44px, 9vw, 88px)', lineHeight: 1.0, letterSpacing: '-3px', color: 'var(--text)', marginBottom: '16px' }}>
          We Build
          <br />
          <span style={{
            color: 'var(--accent)',
            display: 'inline-block',
            opacity: wordVisible ? 1 : 0,
            transform: wordVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.32s ease, transform 0.32s ease',
          }}>
            {WORDS[wordIdx]}
          </span>
          <br />
          That Scale.
        </h1>

        {/* Tagline */}
        <p className="animate-fade-up stagger-2" style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(15px, 1.8vw, 18px)', lineHeight: 1.75, color: 'var(--text-3)', maxWidth: '560px', margin: '0 auto 40px' }}>
          From tailored websites and mobile apps to enterprise ERP systems, AI integrations,
          and managed cloud infrastructure — we build, host, and grow your digital presence end-to-end.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up stagger-3" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '56px' }}>
          <a href="#services" className="btn btn-primary">
            Explore Services <ArrowRight size={16} />
          </a>
          <a href="/company/work" className="btn btn-secondary">
            View Our Work
          </a>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up stagger-4" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '40px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
          {[['150+','Projects Delivered'],['98%','Client Retention'],['50+','Team Members'],['12+','Industries']].map(([v,l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,34px)', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px', lineHeight: 1 }}>{v}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-4)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VISUAL CARD ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px 0' }}>
        <div className="animate-fade-up" style={{
          background: 'var(--bg-3)', borderRadius: '24px', overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.12)',
        }}>
          {/* Window chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 18px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, height: '26px', borderRadius: '6px', background: 'var(--bg-2)', margin: '0 12px', display: 'flex', alignItems: 'center', paddingLeft: '12px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'var(--text-4)' }}>aethersolve.com/dashboard</span>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', minHeight: '300px' }}>
            {/* Sidebar */}
            <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '16px', border: '1px solid var(--border)' }}>
              <div style={{ width: '80px', height: '8px', borderRadius: '100px', background: 'var(--accent)', marginBottom: '20px' }} />
              {['Overview','Projects','Analytics','Clients','Settings'].map((item, i) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', marginBottom: '2px', background: i === 0 ? 'var(--accent-soft)' : 'transparent' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--border-2)', flexShrink: 0 }} />
                  <div style={{ height: '7px', borderRadius: '100px', background: i === 0 ? 'var(--accent)' : 'var(--bg-3)', width: `${45 + i * 8}px` }} />
                </div>
              ))}
            </div>

            {/* Main area */}
            <div>
              {/* Metric cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
                {[['99.97%','Uptime','var(--accent)'],['<120ms','Response','#22c55e'],['10M+','Req/Day','#3b82f6']].map(([v,l,c]) => (
                  <div key={l} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: c }}>{v}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-4)', marginTop: '2px' }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '70px' }}>
                  {[40,60,35,80,55,90,70,85,60,95,72,100].map((h,i) => (
                    <div key={i} style={{ flex: 1, borderRadius: '3px 3px 0 0', height: `${h}%`, background: i===11 ? 'var(--accent)' : i>8 ? 'var(--accent-soft2)' : 'var(--bg-3)', transition: `height 0.6s ease ${i*0.05}s` }} />
                  ))}
                </div>
              </div>

              {/* Activity list */}
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[['FinEdge platform deployed','2m ago'],['EduPath — 1K users online','8m ago'],['AI pipeline processed 4K docs','12m ago']].map(([t,time]) => (
                  <div key={t} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11.5px', color: 'var(--text-2)' }}>{t}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10.5px', color: 'var(--text-4)' }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TICKER ── */}
      <div style={{ overflow: 'hidden', marginTop: '80px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '14px 0', background: 'var(--bg-2)' }}>
        <div className="animate-ticker" style={{ display: 'inline-flex' }}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '24px', padding: '0 24px', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i % 4 === 0 ? 'var(--accent)' : 'var(--text-4)', whiteSpace: 'nowrap' }}>
              {item}
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-2)', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}