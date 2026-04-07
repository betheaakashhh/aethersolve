'use client';
// src/components/public/TestimonialsSection.jsx
import { useEffect, useRef, useState } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

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

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const { on } = useWebSocket('public');
  const [headerRef, headerVis] = useReveal();

  useEffect(() => {
    fetch('/api/testimonials').then(r => r.json()).then(d => { setTestimonials(d.testimonials || []); setLoading(false); });
  }, []);

  useEffect(() => {
    const unsub = on('testimonial_update', (payload) => {
      if (payload.action === 'create') setTestimonials(p => [payload.testimonial, ...p]);
      if (payload.action === 'delete') setTestimonials(p => p.filter(t => t.id !== payload.id));
      if (payload.action === 'update') setTestimonials(p => p.map(t => t.id === payload.testimonial.id ? payload.testimonial : t));
    });
    return unsub;
  }, [on]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (loading) return (
    <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[0,1,2].map(i => <div key={i} style={{ height: '200px', background: 'var(--bg)', borderRadius: '20px', opacity: 0.6 }} />)}

      </div>
      


    </section>
  );

  return (
    <section id="testimonials" style={{ padding: '80px 0', background: 'var(--bg)' }}>
       
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>


        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '64px', opacity: headerVis ? 1 : 0, transform: headerVis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <span className="text-label" style={{ display: 'block', marginBottom: '16px' }}>Client Stories</span>
          <h2 className="text-display" style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Don't take our word for it.
          </h2>
          <p className="text-lead" style={{ maxWidth: '460px', margin: '0 auto' }}>
            Real results from businesses that chose to grow with AetherSolve.
          </p>
        </div>
        

        {testimonials.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-4)', fontFamily: 'var(--font-body)' }}>No testimonials yet.</p>
        ) : (
          <>
            {/* Featured + navigation */}
            <div style={{ marginBottom: '32px' }}>
              <div key={active} style={{
                background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                borderRadius: '24px', padding: 'clamp(28px,4vw,48px)',
                boxShadow: 'var(--card-shadow)',
                maxWidth: '780px', margin: '0 auto',
                animation: 'fadeIn 0.4s ease both',
              }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
                  {[...Array(testimonials[active]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={15} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />
                  ))}
                </div>

                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 600, lineHeight: 1.55, color: 'var(--text)', marginBottom: '28px', letterSpacing: '-0.3px' }}>
                  "{testimonials[active]?.content}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {testimonials[active]?.imageUrl ? (
                      <img src={testimonials[active].imageUrl} alt={testimonials[active].name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#fff', flexShrink: 0 }}>
                        {testimonials[active]?.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>{testimonials[active]?.name}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--text-4)', marginTop: '2px' }}>
                        {testimonials[active]?.role} · {testimonials[active]?.company}
                      </div>
                    </div>
                  </div>

                  {testimonials.length > 1 && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setActive(a => (a - 1 + testimonials.length) % testimonials.length)}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--border-2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                      ><ArrowLeft size={15} /></button>
                      <button onClick={() => setActive(a => (a + 1) % testimonials.length)}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid var(--border-2)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-3)'; }}
                      ><ArrowRight size={15} /></button>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '5px', marginTop: '24px' }}>
                  {testimonials.map((_, i) => (
                    <button key={i} onClick={() => setActive(i)} style={{ height: '3px', borderRadius: '100px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: i === active ? '28px' : '8px', background: i === active ? 'var(--accent)' : 'var(--border-2)' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Grid of all cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '12px' }}>
              {testimonials.map((t, i) => (
                <div key={t.id} onClick={() => setActive(i)} className="card" style={{ padding: '20px', cursor: 'pointer', border: i === active ? '1px solid var(--accent-soft2)' : '1px solid var(--card-border)', background: i === active ? 'var(--accent-soft)' : 'var(--card-bg)' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
                    {[...Array(t.rating || 5)].map((_, j) => <Star key={j} size={11} style={{ fill: 'var(--accent)', color: 'var(--accent)' }} />)}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', lineHeight: 1.65, color: 'var(--text-2)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{t.content}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>{t.name[0]}</div>
                    )}
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{t.name}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-4)', fontFamily: 'var(--font-body)' }}>{t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      
    </section>
  );
}