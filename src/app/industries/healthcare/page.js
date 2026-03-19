// src/app/industries/healthcare/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const solutions = [
  { title: 'Hospital Management Systems', desc: 'End-to-end HMS covering OPD/IPD, billing, pharmacy, lab, radiology, and medical records.' },
  { title: 'Patient Portals', desc: 'HIPAA-aware portals where patients book appointments, view reports, and communicate with doctors.' },
  { title: 'Telemedicine Platforms', desc: 'Video consultations, e-prescriptions, and follow-up management for clinics and health networks.' },
  { title: 'Health Insurance Tech', desc: 'Claims processing, policy management, and provider network platforms for insurance companies.' },
  { title: 'Diagnostic Lab Systems', desc: 'Sample tracking, report generation, home collection management, and NABL compliance tools.' },
  { title: 'MedTech & Wearables', desc: 'IoT integration for medical devices, patient monitoring, and remote health tracking applications.' },
];

export const metadata = {
  title: 'HealthTech Software — AetherSolve Technologies',
  description: 'Hospital management systems, patient portals, telemedicine, and health insurance tech built with compliance at the core.',
};

export default function HealthcarePage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Industries' }, { label: 'Healthcare' }]}
      badge="🏥 Industry"
      title="Healthcare Technology Built With Compliance at the Core"
      subtitle="Medical software is not like other software — errors have consequences, compliance is mandatory, and patients expect absolute reliability. We build healthcare platforms that meet all three."
      heroColor="#dc2626"
    >
      <section className="mb-16 bg-red-50 border border-red-100 rounded-2xl p-6">
        <p className="text-red-900 font-semibold text-lg mb-2">Compliance-First Development</p>
        <p className="text-red-800 text-sm leading-relaxed">
          Every healthcare platform we build is developed with HIPAA, ABDM (Ayushman Bharat Digital Mission), 
          and relevant data protection standards in mind from day one — not retrofitted after launch.
        </p>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Healthcare Solutions We Build</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map(s => (
            <div key={s.title} className="card p-6 hover:-translate-y-1 transition-transform">
              <CheckCircle size={18} className="text-red-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-red-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Clients We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Hospitals & Clinic Chains', 'Health Insurance Cos.', 'Diagnostic Labs', 'Telemedicine Startups', 'Pharma Companies', 'MedTech Startups', 'Health NGOs', 'Government Health Depts'].map(c => (
            <div key={c} className="bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 text-center border border-red-100">{c}</div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['HIPAA', 'Compliant Builds'], ['ABDM', 'Integration Ready'], ['99.99%', 'Uptime SLA'], ['24/7', 'Critical Support']].map(([v, l]) => (
          <div key={l} className="bg-red-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-red-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}