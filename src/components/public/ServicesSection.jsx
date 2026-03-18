// src/components/public/ServicesSection.jsx
'use client';
import { useState } from 'react';
import { Globe, Smartphone, Brain, Cloud, Shield, BarChart3, Cpu, Database, ArrowRight, CheckCircle } from 'lucide-react';

const tiers = [
  {
    label: 'Tier 1 — Entry Services',
    sublabel: 'How clients find us first',
    color: 'brand',
    services: [
      {
        icon: Globe,
        title: 'Website & App Development',
        desc: 'Tailored web platforms, e-commerce stores, portals, and mobile apps built for performance, scale, and your exact business logic.',
        features: ['Custom UI/UX Design', 'React / Next.js / Flutter', 'SEO Optimised', 'Mobile-first'],
        badge: 'Most Popular',
      },
      {
        icon: Smartphone,
        title: 'UI/UX Design',
        desc: 'Designs that don\'t just look good — they convert. From wireframes to design systems that your users actually enjoy.',
        features: ['Figma Prototyping', 'Design Systems', 'User Research', 'Accessibility'],
        badge: null,
      },
    ],
  },
  {
    label: 'Tier 2 — Recurring Revenue',
    sublabel: 'Where retention lives',
    color: 'teal',
    services: [
      {
        icon: Shield,
        title: 'Annual Maintenance Contracts',
        desc: 'Security patches, updates, uptime monitoring, and technical support — so your platform never goes dark.',
        features: ['24/7 Monitoring', 'Security Patching', 'Performance Tuning', 'Priority Support'],
        badge: 'High Retention',
      },
      {
        icon: Cloud,
        title: 'Cloud Hosting & Management',
        desc: 'Fully managed AWS/GCP infrastructure under the AetherSolve banner. We handle DevOps so you focus on your business.',
        features: ['AWS / GCP / Azure', 'Auto-scaling', 'CDN & Edge', 'CI/CD Pipelines'],
        badge: null,
      },
      {
        icon: BarChart3,
        title: 'SEO & Digital Marketing',
        desc: 'Monthly retainer campaigns driven by keyword data, competitor analysis, and content that actually ranks.',
        features: ['Technical SEO', 'Content Strategy', 'Paid Ads', 'Analytics Reports'],
        badge: null,
      },
    ],
  },
  {
    label: 'Tier 3 — Deep Ecosystem',
    sublabel: 'Long-term partnerships',
    color: 'amber',
    services: [
      {
        icon: Database,
        title: 'Custom ERP / CRM Systems',
        desc: 'Build your operational backbone — HR, payroll, inventory, sales pipeline. When you run on our ERP, we grow together.',
        features: ['Module-based Build', 'Role Permissions', 'Reporting Dashboards', 'API Integrations'],
        badge: 'Goldmine',
      },
      {
        icon: Brain,
        title: 'AI & Automation Integration',
        desc: 'LLM-powered internal tools, workflow automation, intelligent chatbots, and data pipelines — the highest-growth service of this decade.',
        features: ['LangChain / GPT-4o', 'Workflow Bots', 'Predictive Analytics', 'Custom LLM Fine-tuning'],
        badge: 'High Growth',
      },
      {
        icon: Cpu,
        title: 'SaaS Co-Development',
        desc: 'Partner with businesses that have the vision but not the tech team. We build and maintain their SaaS — equity or retainer models.',
        features: ['Full Stack Build', 'Equity / Revenue Share', 'Ongoing Maintenance', 'Scaling Strategy'],
        badge: null,
      },
    ],
  },
];

const colorMap = {
  brand: { pill: 'bg-brand-50 text-brand-700 border-brand-100', badge: 'bg-brand-600 text-white', icon: 'bg-brand-50 text-brand-600', border: 'border-brand-100', dot: 'bg-brand-500' },
  teal: { pill: 'bg-teal-50 text-teal-700 border-teal-100', badge: 'bg-teal-600 text-white', icon: 'bg-teal-50 text-teal-600', border: 'border-teal-100', dot: 'bg-teal-500' },
  amber: { pill: 'bg-amber-50 text-amber-700 border-amber-100', badge: 'bg-amber-500 text-white', icon: 'bg-amber-50 text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
};

export default function ServicesSection() {
  const [activeTier, setActiveTier] = useState(0);

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label mb-4">What We Do</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 mt-3 mb-4">
            A Service Model That
            <span className="gradient-text block">Compounds Over Time</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every project we deliver automatically rolls into recurring services. 
            That's the architecture of a software partner that grows with you — not chases new clients every quarter.
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tiers.map((tier, i) => {
            const c = colorMap[tier.color];
            return (
              <button
                key={i}
                onClick={() => setActiveTier(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeTier === i ? `${c.pill} border` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {tier.label.split('—')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Active tier */}
        {tiers.map((tier, ti) => {
          if (ti !== activeTier) return null;
          const c = colorMap[tier.color];
          return (
            <div key={ti}>
              <div className="flex items-center gap-3 mb-6">
                <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <h3 className="font-semibold text-slate-700">{tier.label}</h3>
                <span className="text-slate-400 text-sm">— {tier.sublabel}</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tier.services.map((svc, si) => {
                  const Icon = svc.icon;
                  return (
                    <div
                      key={si}
                      className={`card p-6 relative group hover:-translate-y-1 transition-transform duration-300 border ${c.border}`}
                    >
                      {svc.badge && (
                        <span className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                          {svc.badge}
                        </span>
                      )}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${c.icon}`}>
                        <Icon size={20} />
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-lg mb-2">{svc.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4">{svc.desc}</p>
                      <ul className="space-y-1.5">
                        {svc.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle size={12} className="text-teal-500 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button className="mt-5 flex items-center gap-1 text-xs font-semibold text-brand-600 hover:gap-2 transition-all">
                        Learn more <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Flow diagram */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">The AetherSolve Client Journey</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Build it', 'Host it', 'Maintain it', 'Grow it', 'Add AI to it'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-gradient-to-br from-brand-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                    {step}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {['One-time', 'Monthly', 'AMC', 'New modules', 'Retainer'][i]}
                  </span>
                </div>
                {i < 4 && <ArrowRight size={16} className="text-slate-300 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
