'use client';
// src/components/public/IndustriesSection.jsx
import { useState, useRef, useEffect } from 'react';
import { GraduationCap, Heart, Banknote, Factory, Building2, ShoppingBag, Landmark, Wifi, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const industries = [
  { icon: GraduationCap, name: 'Education',    tagline: 'EdTech & Academic',        color: '#3b82f6', href: '/industries/education',    desc: 'LMS platforms, student portals, online exams, and EdTech SaaS with recurring per-seat licensing.', clients: ['Schools & Universities','EdTech Startups','Coaching Institutes','Corporate L&D'] },
  { icon: Heart,         name: 'Healthcare',   tagline: 'HealthTech & Compliance',   color: '#ef4444', href: '/industries/healthcare',   desc: 'HIPAA-compliant patient portals, telemedicine, hospital management systems.', clients: ['Hospitals','Health Insurance','Telemedicine','MedTech'] },
  { icon: Banknote,      name: 'Finance',      tagline: 'Fintech & BFSI',            color: '#22c55e', href: '/industries/finance',      desc: 'Fintech platforms, NBFC systems, insurance tech, and compliance tools. Regulatory complexity means permanent IT work.', clients: ['Fintech Startups','NBFCs','Insurance Tech','Wealth Platforms'] },
  { icon: Factory,       name: 'Manufacturing',tagline: 'ERP & Logistics',           color: '#f59e0b', href: '/industries/manufacturing', desc: 'ERP, fleet tracking, warehouse management. Operations-critical software creates zero churn.', clients: ['Manufacturers','Logistics','Supply Chain','Fleet Operators'] },
  { icon: Building2,     name: 'Real Estate',  tagline: 'PropTech & Broker Tools',   color: '#8b5cf6', href: '/industries/real-estate',  desc: 'Property portals, CRM for brokers, virtual tours. Growing digital adoption in a traditionally offline industry.', clients: ['Developers','Broker Networks','Property Portals','REIT'] },
  { icon: ShoppingBag,   name: 'Retail & D2C', tagline: 'E-Commerce & Brand',        color: '#06b6d4', href: '/industries/retail',       desc: 'E-commerce, inventory systems, loyalty apps, and AI-powered recommendations at scale.', clients: ['D2C Brands','Retail Chains','Marketplace Sellers','FMCG'] },
  { icon: Landmark,      name: 'Government',   tagline: 'Smart City & Public Sector',color: '#1d4ed8', href: '/#contact',               desc: 'Smart city platforms, citizen portals, and e-governance solutions. Contracts run for years.', clients: ['State Governments','Smart City','Public Utilities','Defence'] },
  { icon: Wifi,          name: 'IoT',          tagline: 'Industry 4.0',              color: '#0d9488', href: '/#contact',               desc: 'Smart factories, building automation, and connected retail. Hardware plus software creates deep lock-in.', clients: ['Smart Factories','Building Automation','Connected Retail','AgriTech'] },
];

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

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const ind = industries[active];
  const [headerRef, headerVis] = useReveal();
  const [panelRef, panelVis] = useReveal(100);

  return (
    <section id="industries" style={{ padding: '120px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header — centered */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: '64px', opacity: headerVis ? 1 : 0, transform: headerVis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <span className="text-label" style={{ display: 'block', marginBottom: '16px' }}>Industries We Serve</span>
          <h2 className="text-display" style={{ color: 'var(--text)', marginBottom: '16px' }}>
            Deep expertise across<br />every vertical.
          </h2>
          <p className="text-lead" style={{ maxWidth: '480px', margin: '0 auto' }}>
            We build genuine domain expertise — not generalist agencies that learn on your project.
          </p>
        </div>

        {/* Icon tab grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '32px' }}>
          {industries.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;
            return (
              <button key={i} onClick={() => setActive(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '18px 12px', borderRadius: '16px', border: `1.5px solid ${isActive ? item.color + '40' : 'var(--border)'}`,
                background: isActive ? item.color + '0c' : 'var(--surface)',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = item.color + '30'; e.currentTarget.style.background = item.color + '06'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; } }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? item.color + '18' : 'var(--bg-2)', transition: 'all 0.2s' }}>
                  <Icon size={18} style={{ color: isActive ? item.color : 'var(--text-4)', transition: 'color 0.2s' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--text)' : 'var(--text-3)', textAlign: 'center' }}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div ref={panelRef} key={active} style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
          padding: '40px', borderRadius: '24px',
          border: `1px solid ${ind.color}25`,
          background: `linear-gradient(135deg, ${ind.color}06 0%, var(--surface) 100%)`,
          opacity: panelVis ? 1 : 0, transform: panelVis ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s ease',
          animation: 'fadeIn 0.4s ease both',
        }}>
          {/* Left */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: ind.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ind.icon size={22} style={{ color: '#fff' }} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', color: 'var(--text)', letterSpacing: '-0.5px' }}>{ind.name}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12.5px', color: ind.color, fontWeight: 600, marginTop: '2px' }}>{ind.tagline}</p>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.75, color: 'var(--text-2)', marginBottom: '24px' }}>{ind.desc}</p>
            <Link href={ind.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13.5px', fontWeight: 700, color: ind.color, textDecoration: 'none', transition: 'gap 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.gap = '10px'}
              onMouseLeave={e => e.currentTarget.style.gap = '6px'}
            >
              Explore {ind.name} Solutions <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — client types */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: '14px' }}>
              Who We Serve
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ind.clients.map(c => (
                <span key={c} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, padding: '7px 14px', borderRadius: '100px', border: `1.5px solid ${ind.color}30`, color: ind.color, background: ind.color + '08' }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}