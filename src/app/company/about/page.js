// src/app/company/about/page.js
import PageLayout from '@/components/public/PageLayout';

const values = [
  { icon: '🎯', title: 'Client Outcomes First', desc: 'We measure our success by your success. Every decision we make is evaluated by whether it moves your business forward.' },
  { icon: '🔬', title: 'Engineering Excellence', desc: 'We write code we are proud of. Clean, documented, tested, and built to last — not hacked together to meet a deadline.' },
  { icon: '🤝', title: 'Long-Term Partnership', desc: 'We do not want to be your vendor. We want to be your technology team — embedded, trusted, and growing with you.' },
  { icon: '🚀', title: 'Bias Toward Action', desc: 'We ship. We iterate. We improve. Speed and quality are not opposites — with the right culture, they reinforce each other.' },
  { icon: '🌱', title: 'Continuous Learning', desc: 'The technology landscape changes constantly. We invest heavily in staying ahead so our clients always benefit from the latest.' },
  { icon: '💡', title: 'Radical Transparency', desc: 'We tell clients what they need to hear, not what they want to hear. Honest timelines, honest assessments, honest pricing.' },
];

const team = [
  { name: 'Aryan Mehta', role: 'Founder & CEO', desc: 'Full-stack engineer with 8+ years building products for fintech and edtech companies across India and Southeast Asia.' },
  { name: 'Priya Nair', role: 'Head of Design', desc: 'Product designer specialising in conversion-focused UX. Previously at Zomato and a Y Combinator startup.' },
  { name: 'Rohan Sharma', role: 'CTO', desc: 'Infrastructure and systems architect. Loves Kubernetes, hates downtime. Built platforms serving 10M+ users.' },
  { name: 'Sneha Agarwal', role: 'Head of AI', desc: 'ML engineer and LLM specialist. Published researcher, former data scientist at a Fortune 500 company.' },
];

export const metadata = {
  title: 'About Us — AetherSolve Technologies',
  description: 'Learn about AetherSolve Technologies — our mission, values, and the team building tomorrow\'s digital infrastructure.',
};

export default function AboutPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'About Us' }]}
      badge="🏢 Company"
      title="We Build Digital Infrastructure That Compounds Over Time"
      subtitle="AetherSolve Technologies is a Bengaluru-based IT services and product company. We build, host, maintain, grow, and add AI to the digital operations of businesses across India and beyond."
      heroColor="#006ec7"
    >
      {/* Mission */}
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="section-label mb-4 inline-block">Our Mission</span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-5">
              Make Every Business a Digital Business — Permanently
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              We started AetherSolve because we kept watching businesses get shortchanged — paying for websites 
              that looked beautiful but converted nobody, or buying enterprise software that required six months 
              of consulting to implement and still didn't fit their workflows.
            </p>
            <p className="text-slate-500 leading-relaxed mb-4">
              Our model is different. Every project we deliver automatically rolls into a longer-term relationship — 
              hosting it, maintaining it, growing it, and eventually adding AI to it. We are not chasing new clients 
              every quarter. We are building a company of long-term partners.
            </p>
            <p className="text-slate-500 leading-relaxed">
              The businesses that achieve lasting competitive advantage — Zoho, Freshworks, even global firms like 
              Accenture — all become embedded in their clients' operations. That is the goal for AetherSolve.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['2021', 'Founded'], ['150+', 'Projects Delivered'], ['50+', 'Team Members'], ['12+', 'Industries Served']].map(([v, l]) => (
              <div key={l} className="bg-brand-50 rounded-2xl p-6 text-center">
                <div className="text-3xl font-display font-bold text-brand-700 mb-1">{v}</div>
                <div className="text-xs text-slate-500 font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Our Values</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map(v => (
            <div key={v.title} className="card p-6">
              <div className="text-2xl mb-3">{v.icon}</div>
              <h3 className="font-display font-bold text-slate-900 mb-2">{v.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Leadership</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">The Team Behind AetherSolve</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {team.map(t => (
            <div key={t.name} className="card p-6 flex gap-4">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-lg shrink-0">
                {t.name[0]}
              </div>
              <div>
                <div className="font-display font-bold text-slate-900">{t.name}</div>
                <div className="text-xs text-brand-600 font-semibold mb-2">{t.role}</div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section className="bg-slate-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Where We Are</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { city: 'Bengaluru', country: 'India', label: 'Headquarters', desc: 'Our main engineering and design hub.' },
            { city: 'Remote-First', country: 'India-wide', label: 'Engineering', desc: 'Engineers working across India, in your timezone.' },
            { city: 'Global', country: 'Southeast Asia & Middle East', label: 'Clients', desc: 'Serving clients across 8 countries.' },
          ].map(loc => (
            <div key={loc.city}>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{loc.label}</div>
              <div className="font-display font-bold text-slate-900">{loc.city}</div>
              <div className="text-sm text-slate-500">{loc.country}</div>
              <div className="text-xs text-slate-400 mt-1">{loc.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}