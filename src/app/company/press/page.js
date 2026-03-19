// src/app/company/press/page.js
import PageLayout from '@/components/public/PageLayout';

const mentions = [
  { outlet: 'YourStory', headline: 'AetherSolve Technologies: The Bengaluru startup building ERP systems that replace Zoho for SMEs', date: 'February 2025' },
  { outlet: 'Inc42', headline: 'How AetherSolve is helping Indian businesses automate operations with custom AI tools', date: 'January 2025' },
  { outlet: 'Economic Times Tech', headline: 'Top 10 IT services companies to watch in 2025 — AetherSolve makes the list', date: 'December 2024' },
  { outlet: 'The Hindu BusinessLine', headline: 'Custom software vs SaaS: Why more Indian SMEs are choosing bespoke development', date: 'November 2024' },
];

export const metadata = {
  title: 'Press — AetherSolve Technologies',
  description: 'Press mentions, media coverage, and press kit for AetherSolve Technologies.',
};

export default function PressPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'Press' }]}
      badge="📰 Press"
      title="AetherSolve in the News"
      subtitle="Media coverage, press mentions, and resources for journalists covering AetherSolve Technologies."
      heroColor="#006ec7"
    >
      {/* Press mentions */}
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Media Coverage</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Recent Coverage</h2>
        <div className="space-y-4">
          {mentions.map(m => (
            <div key={m.headline} className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 text-center leading-tight p-1">
                {m.outlet.split(' ').map(w => w[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-brand-600 mb-1">{m.outlet}</div>
                <h3 className="font-semibold text-slate-800 text-sm leading-snug">{m.headline}</h3>
                <div className="text-xs text-slate-400 mt-1">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press kit */}
      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Press Kit</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { icon: '🖼', title: 'Logo Package', desc: 'SVG, PNG, and ICO formats in light and dark variants. Includes usage guidelines.' },
            { icon: '📄', title: 'Company Fact Sheet', desc: 'Key metrics, founding story, leadership bios, and company overview — one-page PDF.' },
            { icon: '🖼', title: 'Product Screenshots', desc: 'High-resolution screenshots of our key products and platforms for editorial use.' },
            { icon: '👤', title: 'Leadership Photos', desc: 'Professional headshots of the founding team and senior leadership in hi-res.' },
          ].map(item => (
            <div key={item.title} className="card p-5 flex gap-4">
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 mb-3">{item.desc}</p>
                <button className="text-xs font-semibold text-brand-600 hover:underline">Request Download →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-slate-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Press Enquiries</h2>
        <p className="text-slate-500 mb-4">
          For interviews, quotes, or additional information, please contact our communications team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="mailto:press@aethersolve.com" className="btn-primary text-sm">
            press@aethersolve.com
          </a>
          <span className="flex items-center text-sm text-slate-500">Response within 24 hours on business days</span>
        </div>
      </section>
    </PageLayout>
  );
}