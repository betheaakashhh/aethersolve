// src/app/services/web-development/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'Custom Web Applications', desc: 'Fully tailored web apps built around your exact business logic — from simple landing pages to complex enterprise platforms.' },
  { title: 'E-Commerce Platforms', desc: 'High-converting online stores with inventory management, payment gateways, and AI-powered recommendations.' },
  { title: 'Progressive Web Apps', desc: 'App-like experiences in the browser — fast, offline-capable, and installable on any device.' },
  { title: 'CMS & Content Platforms', desc: 'Headless CMS setups with intuitive editors so your team can update content without developers.' },
  { title: 'API Development', desc: 'RESTful and GraphQL APIs built for performance, scalability, and third-party integrations.' },
  { title: 'Web Portals & Dashboards', desc: 'Data-rich portals for clients, employees, or partners with real-time analytics and role-based access.' },
];

const stack = ['React / Next.js', 'Node.js', 'PostgreSQL', 'MongoDB', 'AWS / GCP', 'Docker', 'Tailwind CSS', 'GraphQL'];

const process = [
  { step: '01', title: 'Discovery & Scoping', desc: 'We understand your goals, users, and technical requirements before writing a single line of code.' },
  { step: '02', title: 'UI/UX Design', desc: 'Wireframes, prototypes, and polished designs reviewed and approved by you before development begins.' },
  { step: '03', title: 'Agile Development', desc: 'Two-week sprints with regular demos so you see progress and can provide feedback continuously.' },
  { step: '04', title: 'Testing & QA', desc: 'Automated and manual testing across browsers, devices, and load scenarios.' },
  { step: '05', title: 'Launch & Handoff', desc: 'Smooth deployment with full documentation, training, and a post-launch support window.' },
  { step: '06', title: 'AMC & Growth', desc: 'Ongoing maintenance, feature additions, and performance optimisation after launch.' },
];

export const metadata = {
  title: 'Web Development Services — AetherSolve Technologies',
  description: 'Custom web application development — from e-commerce to enterprise platforms. React, Next.js, Node.js experts.',
};

export default function WebDevelopmentPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'Web Development' }]}
      badge="🌐 Service"
      title="Web Development That Scales With Your Business"
      subtitle="We build fast, secure, and beautiful web applications tailored exactly to your requirements — from MVPs to enterprise-grade platforms that handle millions of users."
      heroColor="#006ec7"
    >
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">What We Build</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Everything Your Business Needs Online</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-brand-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-slate-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Our Technology Stack</h2>
        <div className="flex flex-wrap gap-3">
          {stack.map(s => (
            <span key={s} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{s}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Our Development Process</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map(p => (
            <div key={p.step} className="flex gap-4">
              <div className="text-3xl font-display font-bold text-brand-100 leading-none shrink-0">{p.step}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['80+', 'Websites Delivered'], ['99%', 'Uptime SLA'], ['< 2s', 'Avg Load Time'], ['5★', 'Client Rating']].map(([v, l]) => (
          <div key={l} className="bg-brand-50 rounded-2xl p-6 text-center">
            <div className="text-3xl font-display font-bold text-brand-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}