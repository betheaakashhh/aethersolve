// src/app/industries/finance/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const solutions = [
  { title: 'Fintech Platforms', desc: 'Payments, lending, wallets, and investment platforms built with regulatory compliance from the ground up.' },
  { title: 'NBFC & Lending Software', desc: 'Loan origination, underwriting automation, collections, and portfolio management systems.' },
  { title: 'Insurance Technology', desc: 'Policy management, claims processing, agent portals, and customer-facing insurance platforms.' },
  { title: 'Wealth Management Tools', desc: 'Portfolio tracking, advisory platforms, and robo-advisor integrations for wealth management firms.' },
  { title: 'Compliance & Audit Tools', desc: 'Automated regulatory reporting, audit trail management, and compliance dashboards.' },
  { title: 'Banking Integrations', desc: 'Payment gateway integrations, UPI, NACH, and core banking system connectors.' },
];

export const metadata = {
  title: 'Fintech & Finance Software — AetherSolve Technologies',
  description: 'Fintech platforms, NBFC systems, insurance tech, and compliance tools built with regulatory requirements at the core.',
};

export default function FinancePage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Industries' }, { label: 'Finance & BFSI' }]}
      badge="💰 Industry"
      title="Financial Technology That Handles Real Money Reliably"
      subtitle="In finance, the cost of a software failure is not a bad user experience — it is regulatory action and lost client trust. We build fintech platforms that are secure, compliant, and battle-tested."
      heroColor="#059669"
    >
      <section className="mb-16 bg-green-50 border border-green-100 rounded-2xl p-6">
        <p className="text-green-900 font-semibold text-lg mb-2">Regulatory Complexity is Our Speciality</p>
        <p className="text-green-800 text-sm leading-relaxed">
          RBI guidelines, SEBI regulations, IRDAI requirements, GST compliance — the financial sector 
          has more regulatory requirements than any other. Our BFSI team has built platforms for regulated 
          entities and understands compliance as a feature, not an afterthought.
        </p>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Finance Solutions We Build</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map(s => (
            <div key={s.title} className="card p-6 hover:-translate-y-1 transition-transform">
              <CheckCircle size={18} className="text-green-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-green-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Clients We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Fintech Startups', 'NBFCs & Lenders', 'Insurance Companies', 'Wealth Management', 'Payment Aggregators', 'Microfinance Orgs', 'Crypto Platforms', 'Stock Brokers'].map(c => (
            <div key={c} className="bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 text-center border border-green-100">{c}</div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['RBI', 'Guideline Compliant'], ['PCI-DSS', 'Payment Security'], ['Bank-Grade', 'Encryption'], ['SOC 2', 'Audit Ready']].map(([v, l]) => (
          <div key={l} className="bg-green-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-green-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}