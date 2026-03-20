// src/components/public/IndustriesSection.jsx
'use client';
import { useState } from 'react';
import {
  GraduationCap, Heart, Banknote, Factory,
  Building2, ShoppingBag, Landmark, Wifi, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const industries = [
  {
    icon: GraduationCap,
    name: 'Education',
    tagline: 'EdTech & Academic Institutions',
    desc: 'LMS platforms, student portals, online exam systems, and coaching institute tools. High volume demand and recurring per-seat licensing models.',
    clients: ['Schools & Universities', 'EdTech Startups', 'Coaching Institutes', 'Corporate Training'],
    color: '#006ec7',
    bg: '#f0f7ff',
    href: '/industries/education',
  },
  {
    icon: Heart,
    name: 'Healthcare',
    tagline: 'HealthTech & Medical Systems',
    desc: 'HIPAA-compliant patient portals, telemedicine, hospital management systems. Compliance requirements mean ongoing IT support — permanently.',
    clients: ['Hospitals & Clinics', 'Health Insurance', 'Telemedicine', 'MedTech Startups'],
    color: '#dc2626',
    bg: '#fff1f2',
    href: '/industries/healthcare',
  },
  {
    icon: Banknote,
    name: 'Finance & BFSI',
    tagline: 'Fintech & Financial Services',
    desc: 'Fintechs, NBFCs, insurance companies. Regulatory complexity means constant IT work — audits, upgrades, and compliance modules never stop.',
    clients: ['Fintechs', 'NBFCs & Lending', 'Insurance Tech', 'Wealth Platforms'],
    color: '#059669',
    bg: '#f0fdf4',
    href: '/industries/finance',
  },
  {
    icon: Factory,
    name: 'Manufacturing',
    tagline: 'ERP & Logistics Automation',
    desc: 'ERP, fleet tracking, warehouse management systems. Operations-critical software creates zero churn — your business cannot function without it.',
    clients: ['Manufacturers', 'Logistics Companies', 'Supply Chain', 'Fleet Operators'],
    color: '#d97706',
    bg: '#fffbeb',
    href: '/industries/manufacturing',
  },
  {
    icon: Building2,
    name: 'Real Estate',
    tagline: 'PropTech & Broker Tools',
    desc: 'Property portals, CRM for brokers, virtual tour platforms. Growing digital adoption in a traditionally offline industry.',
    clients: ['Developers', 'Broker Networks', 'Property Portals', 'REIT Platforms'],
    color: '#7c3aed',
    bg: '#f5f3ff',
    href: '/industries/real-estate',
  },
  {
    icon: ShoppingBag,
    name: 'Retail & D2C',
    tagline: 'E-Commerce & Brand Platforms',
    desc: 'E-commerce, inventory systems, loyalty apps, AI-powered recommendations. Massive volume across categories and regions.',
    clients: ['D2C Brands', 'Retail Chains', 'Marketplace Sellers', 'FMCG Companies'],
    color: '#0891b2',
    bg: '#ecfeff',
    href: '/industries/retail',
  },
  {
    icon: Landmark,
    name: 'Government',
    tagline: 'Smart City & Public Sector',
    desc: 'Longer sales cycles but contracts run for years, sometimes decades. Smart city platforms, citizen portals, and e-governance solutions.',
    clients: ['State Governments', 'Smart City Projects', 'Public Utilities', 'Defence (DPIIT)'],
    color: '#1d4ed8',
    bg: '#eff6ff',
    href: '/#contact',
  },
  {
    icon: Wifi,
    name: 'IoT & Industry 4.0',
    tagline: 'Connected Devices & Automation',
    desc: 'Smart offices, industrial monitoring, connected retail. Hardware plus software creates deeply integrated long-term contracts.',
    clients: ['Smart Factories', 'Building Automation', 'Connected Retail', 'AgriTech'],
    color: '#0d9488',
    bg: '#f0fdfa',
    href: '/#contact',
  },
];

export default function IndustriesSection() {
  const [active, setActive] = useState(0);
  const ind = industries[active];

  return (
    <section id="industries" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="section-label mb-4">Industries We Serve</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">
            Deep Expertise Across
            <span className="gradient-text block">Every Vertical</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We go deep in specific industries rather than serving everyone broadly — building genuine domain expertise that translates to better products and faster delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Industry list */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            {industries.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    active === i
                      ? 'bg-brand-50 border border-brand-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                    style={{ background: active === i ? item.bg : '#f8fafc', color: active === i ? item.color : '#94a3b8' }}
                  >
                    <Icon size={17} />
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${active === i ? 'text-slate-900' : 'text-slate-600'}`}>{item.name}</div>
                    <div className="text-xs text-slate-400">{item.tagline}</div>
                  </div>
                  {active === i && <ArrowRight size={14} className="ml-auto text-brand-500" />}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div
            key={active}
            className="lg:col-span-3 rounded-2xl p-8 animate-fade-in border"
            style={{ background: ind.bg, borderColor: `${ind.color}22` }}
          >
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: ind.color }}
              >
                <ind.icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-900 text-2xl">{ind.name}</h3>
                <p className="text-sm font-medium" style={{ color: ind.color }}>{ind.tagline}</p>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">{ind.desc}</p>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Client Types</p>
              <div className="flex flex-wrap gap-2">
                {ind.clients.map(c => (
                  <span
                    key={c}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                    style={{ background: 'white', color: ind.color, borderColor: `${ind.color}33` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked "See full page" button */}
            <Link
              href={ind.href}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
              style={{ color: ind.color }}
            >
              Explore {ind.name} Solutions <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}