// src/app/company/work/page.js
import PageLayout from '@/components/public/PageLayout';

const projects = [
  { name: 'FinEdge Solutions', type: 'Fintech Platform', industry: 'Finance', result: '50,000+ daily transactions', desc: 'Built a compliant fintech platform from scratch handling payments, lending, and KYC workflows. Delivered in 6 months.', tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'] },
  { name: 'EduPath Technologies', type: 'LMS Platform', industry: 'EdTech', result: '12,000 active students', desc: 'A full-featured learning management system with video courses, live classes, assessments, and student analytics.', tags: ['Next.js', 'MongoDB', 'Redis', 'Zoom API'] },
  { name: 'LogiTrack India', type: 'ERP + Fleet System', industry: 'Logistics', result: '60% ops cost reduction', desc: 'Custom ERP with real-time fleet tracking, warehouse management, and automated dispatch routing for 200+ vehicles.', tags: ['React', 'Node.js', 'Google Maps', 'IoT'] },
  { name: 'HealthFirst Clinics', type: 'HealthTech Platform', industry: 'Healthcare', result: 'HIPAA-compliant launch', desc: 'Patient portal, telemedicine integration, appointment scheduling, and prescription management for a chain of 12 clinics.', tags: ['React Native', 'Node.js', 'PostgreSQL', 'Twilio'] },
  { name: 'RetailPlus Chain', type: 'E-Commerce + Loyalty', industry: 'Retail', result: '3x online revenue increase', desc: 'D2C e-commerce platform with AI product recommendations, loyalty programme, and inventory sync across 40 stores.', tags: ['Next.js', 'Python', 'ML', 'Shopify API'] },
  { name: 'PropDeal Realty', type: 'Broker CRM', industry: 'Real Estate', result: '35% faster deal closure', desc: 'Property listing portal, virtual tour integration, and CRM for 500+ brokers with pipeline analytics and client communication tools.', tags: ['React', 'Node.js', 'Three.js', 'PostgreSQL'] },
];

const industryColors = {
  Finance: 'bg-green-50 text-green-700',
  EdTech: 'bg-blue-50 text-blue-700',
  Logistics: 'bg-amber-50 text-amber-700',
  Healthcare: 'bg-red-50 text-red-700',
  Retail: 'bg-cyan-50 text-cyan-700',
  'Real Estate': 'bg-purple-50 text-purple-700',
};

export const metadata = {
  title: 'Our Work — AetherSolve Technologies',
  description: 'Case studies and projects from AetherSolve Technologies — fintech, edtech, healthtech, logistics, and more.',
};

export default function WorkPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'Our Work' }]}
      badge="💼 Portfolio"
      title="Work That Speaks for Itself"
      subtitle="A selection of products and platforms we have built, launched, and continue to maintain for clients across India and beyond."
      heroColor="#006ec7"
    >
      <section className="mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.name} className="card p-6 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${industryColors[p.industry] || 'bg-slate-100 text-slate-600'}`}>
                    {p.industry}
                  </span>
                </div>
                <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{p.result}</span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mb-0.5">{p.name}</h3>
              <p className="text-xs text-brand-600 font-semibold mb-3">{p.type}</p>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">Want to See More?</h2>
        <p className="text-slate-500 mb-6 max-w-xl mx-auto">
          Our full portfolio includes 150+ projects across 12 industries. 
          Reach out to request a detailed case study relevant to your industry or use case.
        </p>
        <a href="mailto:hello@aethersolve.com" className="btn-primary inline-flex">
          Request Case Studies →
        </a>
      </section>
    </PageLayout>
  );
}