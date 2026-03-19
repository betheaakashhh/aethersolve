// src/app/industries/real-estate/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const solutions = [
  { title: 'Property Listing Portals', desc: 'Search, filter, and compare properties with advanced map views, virtual tours, and lead capture.' },
  { title: 'Broker CRM Systems', desc: 'Pipeline management, client follow-up automation, property matching, and commission tracking for broker networks.' },
  { title: 'Virtual Tour Platforms', desc: '360° property tours, floor plan viewers, and virtual staging tools that help buyers decide faster.' },
  { title: 'Developer Project Portals', desc: 'Pre-launch booking systems, construction progress updates, and buyer communication portals for developers.' },
  { title: 'Property Management Systems', desc: 'Tenant management, rent collection, maintenance requests, and lease renewal workflows.' },
  { title: 'Real Estate Analytics', desc: 'Market trend dashboards, price benchmarking, and investment analysis tools for agencies and investors.' },
];

export const metadata = {
  title: 'Real Estate Technology — AetherSolve Technologies',
  description: 'Property portals, broker CRMs, virtual tours, and real estate management software.',
};

export default function RealEstatePage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Industries' }, { label: 'Real Estate' }]}
      badge="🏢 Industry"
      title="PropTech That Closes Deals Faster"
      subtitle="Real estate is still one of the most digitally underserved industries in India. We build the platforms that give developers, brokers, and agencies a genuine competitive edge."
      heroColor="#7c3aed"
    >
      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Real Estate Solutions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map(s => (
            <div key={s.title} className="card p-6 hover:-translate-y-1 transition-transform">
              <CheckCircle size={18} className="text-purple-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-purple-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Clients We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Property Developers', 'Broker Networks', 'Real Estate Agencies', 'REIT Platforms', 'Co-Working Spaces', 'PG & Rental Startups', 'Commercial RE Firms', 'Property Investors'].map(c => (
            <div key={c} className="bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 text-center border border-purple-100">{c}</div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['35%', 'Faster Deal Closure'], ['Virtual Tours', '360° Ready'], ['CRM + Portal', 'Integrated'], ['RERA', 'Compliance Tools']].map(([v, l]) => (
          <div key={l} className="bg-purple-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-purple-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}