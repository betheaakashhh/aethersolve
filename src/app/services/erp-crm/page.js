// src/app/services/erp-crm/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'Custom ERP Systems', desc: 'End-to-end enterprise resource planning — HR, payroll, inventory, procurement, finance, and operations in one unified platform.' },
  { title: 'CRM Platforms', desc: 'Sales pipelines, lead management, customer communication, and revenue analytics tailored to your sales process.' },
  { title: 'HR & Payroll Modules', desc: 'Employee management, attendance, leave tracking, appraisals, and automated payroll with statutory compliance.' },
  { title: 'Inventory & Supply Chain', desc: 'Real-time stock tracking, purchase orders, vendor management, and multi-warehouse support.' },
  { title: 'Finance & Accounting', desc: 'Invoicing, expense tracking, GST/tax compliance, profit & loss, and balance sheet reporting.' },
  { title: 'Custom Reporting & BI', desc: 'Executive dashboards, KPI tracking, and automated reports that give your leadership team real-time visibility.' },
];

const modules = ['HR & Payroll', 'Inventory', 'Finance & Accounts', 'Sales CRM', 'Procurement', 'Project Management', 'Customer Support', 'Analytics Dashboard'];

export const metadata = {
  title: 'ERP & CRM Development — AetherSolve Technologies',
  description: 'Custom ERP and CRM systems that automate operations, reduce costs, and give your business complete visibility.',
};

export default function ERPCRMPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'ERP / CRM' }]}
      badge="⚙️ Service"
      title="Custom ERP & CRM — Your Business, Fully Automated"
      subtitle="When you run on our ERP, we become permanently embedded in your operations. Custom-built to your exact workflows, not forced into a generic template that doesn't fit."
      heroColor="#d97706"
    >
      <section className="mb-16 bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <p className="text-amber-900 font-semibold text-lg mb-2">Why Custom Over Off-the-Shelf?</p>
        <p className="text-amber-800 text-sm leading-relaxed">
          Zoho, SAP, and Salesforce are built for the average business. Your business is not average. 
          A custom ERP built by AetherSolve fits your exact processes, integrates with your existing tools, 
          and costs a fraction of per-seat SaaS licences over a 3-year horizon.
        </p>
      </section>

      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Modules We Build</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Everything Your Operations Need</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-amber-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-slate-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Available Modules</h2>
        <div className="flex flex-wrap gap-3">
          {modules.map(m => (
            <span key={m} className="px-4 py-2 bg-white border border-amber-100 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{m}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">The Long-Term Value</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: 'Zero Per-Seat Costs', desc: 'One-time development investment. No monthly SaaS fees that scale with your headcount.' },
            { title: 'Infinite Customisation', desc: 'Add modules, change workflows, and integrate new tools as your business evolves — without vendor lock-in.' },
            { title: 'Permanent Partnership', desc: 'Once your team runs on our ERP, we become a long-term technology partner — not a one-time vendor.' },
          ].map(item => (
            <div key={item.title} className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-display font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['60%', 'Avg Ops Cost Reduction'], ['30+', 'ERPs Delivered'], ['6 months', 'Avg ROI Timeline'], ['100%', 'Custom Built']].map(([v, l]) => (
          <div key={l} className="bg-amber-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-amber-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}