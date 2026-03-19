// src/app/services/cloud-hosting/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'Managed Cloud Infrastructure', desc: 'AWS, GCP, and Azure infrastructure managed entirely by AetherSolve — provisioning, monitoring, scaling, and security.' },
  { title: 'CI/CD Pipeline Setup', desc: 'Automated build, test, and deployment pipelines so every code change ships safely and instantly.' },
  { title: 'Auto-Scaling & Load Balancing', desc: 'Your application scales up during traffic spikes and scales down to save costs — automatically.' },
  { title: 'Security & Compliance', desc: 'SSL certificates, firewall rules, intrusion detection, and compliance configurations for GDPR, ISO 27001, and PCI-DSS.' },
  { title: 'Database Management', desc: 'Managed PostgreSQL, MySQL, MongoDB, and Redis — with automated backups, failover, and performance tuning.' },
  { title: 'Annual Maintenance Contracts', desc: 'Monthly reports, security patches, uptime monitoring, and a dedicated support line for your infrastructure.' },
];

const stack = ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Prometheus', 'Grafana', 'Cloudflare'];

export const metadata = {
  title: 'Cloud Hosting & Management — AetherSolve Technologies',
  description: 'Fully managed cloud infrastructure on AWS, GCP, and Azure. DevOps, CI/CD, security, and 24/7 monitoring.',
};

export default function CloudHostingPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'Cloud Hosting' }]}
      badge="☁️ Service"
      title="Managed Cloud — So You Never Think About Infrastructure Again"
      subtitle="We host, monitor, secure, and scale your applications on enterprise-grade cloud infrastructure under the AetherSolve banner. Once your data lives on our managed servers, you can focus entirely on your business."
      heroColor="#0891b2"
    >
      <section className="mb-16 bg-cyan-50 border border-cyan-100 rounded-2xl p-6">
        <p className="text-cyan-900 font-semibold text-lg mb-2">Why Managed Hosting?</p>
        <p className="text-cyan-800 text-sm leading-relaxed">
          Unmanaged cloud is cheap until something breaks at 3 AM. Our managed hosting includes 24/7 monitoring, 
          automated failover, security patching, and a guaranteed response SLA — so downtime becomes someone 
          else's problem. Always.
        </p>
      </section>

      <section className="mb-20">
        <span className="section-label mb-4 inline-block">What's Included</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Everything That Keeps You Online</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-cyan-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-cyan-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Infrastructure Stack</h2>
        <div className="flex flex-wrap gap-3">
          {stack.map(s => (
            <span key={s} className="px-4 py-2 bg-white border border-cyan-100 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{s}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">AMC Plans Include</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            '24/7 uptime monitoring with instant alerts',
            'Monthly security patch cycle',
            'Automated daily database backups (30-day retention)',
            'SSL certificate management and renewal',
            'Performance reports delivered monthly',
            'Priority support with 4-hour response SLA',
            'Quarterly infrastructure cost optimisation review',
            'Annual penetration testing and security audit',
          ].map(item => (
            <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <CheckCircle size={15} className="text-cyan-500 shrink-0" />
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['99.97%', 'Uptime SLA'], ['< 120ms', 'Avg Response Time'], ['AWS/GCP', 'Enterprise Cloud'], ['24/7', 'Monitoring']].map(([v, l]) => (
          <div key={l} className="bg-cyan-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-cyan-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}