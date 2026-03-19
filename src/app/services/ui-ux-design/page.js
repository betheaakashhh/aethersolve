// src/app/services/ui-ux-design/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'Product Design', desc: 'End-to-end design of web and mobile products — from user research through to pixel-perfect Figma handoffs.' },
  { title: 'Design Systems', desc: 'Scalable component libraries that keep your product consistent as it grows, with full documentation.' },
  { title: 'User Research', desc: 'Interviews, surveys, and usability testing to understand what your users actually need — not what you assume.' },
  { title: 'Wireframing & Prototyping', desc: 'Low and high-fidelity prototypes you can click through and test before a single line of code is written.' },
  { title: 'UX Audits', desc: 'Structured reviews of your existing product to identify friction points, drop-off areas, and conversion blockers.' },
  { title: 'Brand Identity', desc: 'Logos, colour systems, typography, and brand guidelines that create a consistent and memorable identity.' },
];

const tools = ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Adobe Creative Suite', 'Principle', 'Framer', 'Storybook'];

export const metadata = {
  title: 'UI/UX Design Services — AetherSolve Technologies',
  description: 'User-centred design that converts. Product design, design systems, UX audits, and brand identity.',
};

export default function UIUXDesignPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'UI/UX Design' }]}
      badge="🎨 Service"
      title="Design That Converts, Not Just Impresses"
      subtitle="Great design is not just beautiful — it is clear, fast, and purposeful. We create user experiences that guide your customers toward the actions that matter most to your business."
      heroColor="#ec4899"
    >
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Our Design Services</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Design That Solves Real Problems</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-pink-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-pink-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Our Design Tools</h2>
        <p className="text-slate-500 text-sm mb-6">Industry-standard tools used by top product teams worldwide.</p>
        <div className="flex flex-wrap gap-3">
          {tools.map(s => (
            <span key={s} className="px-4 py-2 bg-white border border-pink-100 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{s}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Our Design Philosophy</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: 'User First, Always', desc: 'Every design decision starts with a user need. We never add complexity for aesthetics alone.' },
            { title: 'Data-Informed', desc: 'We use analytics, heatmaps, and user testing to validate decisions — not gut feeling.' },
            { title: 'Handoff Ready', desc: 'Every design is production-ready with specs, assets, and component documentation for developers.' },
          ].map(item => (
            <div key={item.title} className="bg-slate-50 rounded-2xl p-6">
              <h3 className="font-display font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['40%', 'Avg Conversion Lift'], ['60+', 'Products Designed'], ['User-First', 'Design Approach'], ['48hr', 'First Concept Turnaround']].map(([v, l]) => (
          <div key={l} className="bg-pink-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-pink-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}