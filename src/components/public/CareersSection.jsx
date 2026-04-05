'use client';
// src/components/public/CareersSection.jsx
import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Briefcase, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
}

const deptColors = { Engineering: '#3b82f6', Design: '#ec4899', Sales: '#22c55e', Marketing: '#f59e0b', Infrastructure: '#8b5cf6' };

export default function CareersSection() {
  const [jobs, setJobs]       = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('professional');
  const router = useRouter();
  const [headerRef, headerVis] = useReveal();

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs?isInternship=false').then(r => r.json()),
      fetch('/api/jobs?isInternship=true').then(r => r.json()),
    ]).then(([prof, int]) => { setJobs(prof.jobs || []); setInterns(int.jobs || []); setLoading(false); });
  }, []);

  const displayed = tab === 'professional' ? jobs : interns;

  return (
    <section id="careers" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '56px', opacity: headerVis ? 1 : 0, transform: headerVis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <span className="text-label" style={{ display: 'block', marginBottom: '16px' }}>We're Hiring</span>
          <h2 className="text-display" style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Join the team that<br />builds what's next.
          </h2>
          <p className="text-lead" style={{ maxWidth: '460px', margin: '0 auto 28px' }}>
            Real projects, real ownership, and a culture that invests in your growth.
          </p>

          {/* Perks */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {['Remote-Friendly','Learning Budget','Health Benefits','Equity Programs','Flexible Hours','Real Client Impact'].map(p => (
              <span key={p} style={{ padding: '6px 14px', borderRadius: '100px', border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: '12.5px', fontWeight: 500, color: 'var(--text-3)' }}>
                ✦ {p}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-2)', padding: '4px', borderRadius: '14px', maxWidth: '320px', margin: '0 auto 32px', border: '1px solid var(--border)' }}>
          {[['professional','Professional', Briefcase],['internship','Internships', GraduationCap]].map(([val, label, Icon]) => (
            <button key={val} onClick={() => setTab(val)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700,
              background: tab === val ? 'var(--card-bg)' : 'transparent',
              color: tab === val ? 'var(--accent)' : 'var(--text-4)',
              boxShadow: tab === val ? 'var(--card-shadow)' : 'none',
              transition: 'all 0.2s',
            }}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Internship banner */}
        {tab === 'internship' && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px 20px', borderRadius: '14px', background: 'rgba(255,92,26,0.06)', border: '1.5px solid rgba(255,92,26,0.15)', marginBottom: '24px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13.5px', color: 'var(--text)', marginBottom: '4px' }}>Student-Friendly Internships</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-3)', lineHeight: 1.65 }}>
                3–6 month programs with real ownership, senior mentorship, and a full-time offer possibility. Stipend included.
              </p>
            </div>
          </div>
        )}

        {/* Job cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[0,1,2,3].map(i => <div key={i} style={{ height: '160px', borderRadius: '16px', background: 'var(--bg-2)', animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text-3)', marginBottom: '8px' }}>No openings right now.</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--text-4)' }}>
              Send your profile to{' '}
              <a href="mailto:careers@aethersolve.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>careers@aethersolve.com</a>
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {displayed.map((job, i) => {
              const deptColor = deptColors[job.department] || '#6b7280';
              return (
                <div key={job.id} className="card" style={{ padding: '24px', cursor: 'default' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px', background: deptColor + '12', color: deptColor, fontFamily: 'var(--font-body)' }}>
                      {job.department}
                    </span>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '100px', background: 'var(--bg-2)', color: 'var(--text-4)', fontFamily: 'var(--font-body)', border: '1px solid var(--border)' }}>
                      {job.type}
                    </span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.3px' }}>
                    {job.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-4)' }}>
                      <MapPin size={11} />{job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-4)' }}>
                      <Clock size={11} />{job.type}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                    {(job.skills || []).slice(0,4).map(s => (
                      <span key={s} style={{ fontSize: '11px', fontWeight: 500, background: 'var(--bg-2)', color: 'var(--text-3)', padding: '3px 9px', borderRadius: '100px', border: '1px solid var(--border)', fontFamily: 'var(--font-body)' }}>{s}</span>
                    ))}
                  </div>

                  <button onClick={() => router.push(`/apply/${job.id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: 'var(--accent)', padding: 0, transition: 'gap 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.gap = '9px'}
                    onMouseLeave={e => e.currentTarget.style.gap = '5px'}
                  >
                    Apply Now <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}