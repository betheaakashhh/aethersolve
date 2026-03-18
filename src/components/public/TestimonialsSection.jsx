// src/components/public/TestimonialsSection.jsx
'use client';
import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const { on } = useWebSocket('public');

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => { setTestimonials(d.testimonials || []); setLoading(false); });
  }, []);

  useEffect(() => {
    const unsub = on('testimonial_update', (payload) => {
      if (payload.action === 'create') {
        setTestimonials(prev => [payload.testimonial, ...prev]);
      } else if (payload.action === 'delete') {
        setTestimonials(prev => prev.filter(t => t.id !== payload.id));
      } else if (payload.action === 'update') {
        setTestimonials(prev => prev.map(t => t.id === payload.testimonial.id ? payload.testimonial : t));
      }
    });
    return unsub;
  }, [on]);

  // Auto-rotate
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActive(a => (a + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const ratingColors = { 5: 'text-amber-400', 4: 'text-amber-400', 3: 'text-slate-400' };

  if (loading) {
    return (
      <section id="testimonials" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="h-8 bg-slate-200 rounded-full w-32 mx-auto mb-4 animate-pulse" />
          <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="section-label mb-4">Client Stories</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">
            Trusted by Teams
            <span className="gradient-text block">That Mean Business</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            We don't chase projects. We build partnerships. Here's what our clients say after working with us.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-slate-400">No testimonials yet.</div>
        ) : (
          <>
            {/* Featured testimonial */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Main card */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-[80px] opacity-60" />
                <Quote size={40} className="text-brand-100 mb-4" />

                {testimonials[active] && (
                  <div key={active} className="animate-fade-in">
                    <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
                      "{testimonials[active].content}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {testimonials[active].imageUrl ? (
                          <img
                            src={testimonials[active].imageUrl}
                            alt={testimonials[active].name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                            {testimonials[active].name[0]}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>

                      <div>
                        <div className="font-display font-bold text-slate-900">{testimonials[active].name}</div>
                        <div className="text-sm text-slate-500">{testimonials[active].role} · {testimonials[active].company}</div>
                        <div className="flex items-center gap-0.5 mt-1">
                          {[...Array(testimonials[active].rating || 5)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="ml-auto flex flex-wrap gap-1.5 justify-end">
                        {(testimonials[active].badges || []).map(badge => (
                          <span key={badge} className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-100">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation dots */}
                <div className="flex gap-1.5 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? 'bg-brand-500 w-6' : 'bg-slate-200 w-1.5 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Side cards */}
              <div className="flex flex-col gap-4">
                {testimonials.slice(0, 3).filter((_, i) => i !== active % 3).slice(0, 2).map((t, i) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-xl border border-slate-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setActive(testimonials.indexOf(t))}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-300 to-teal-300 flex items-center justify-center text-white font-bold text-sm">
                          {t.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{t.name}</div>
                        <div className="text-xs text-slate-400">{t.company}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">"{t.content}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* All testimonials grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer ${
                    i === active ? 'border-brand-200 shadow-sm' : 'border-slate-100'
                  }`}
                  onClick={() => setActive(i)}
                >
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(t.rating || 5)].map((_, j) => (
                      <Star key={j} size={11} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">"{t.content}"</p>
                  <div className="flex items-center gap-2.5">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.role} · {t.company}</div>
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
