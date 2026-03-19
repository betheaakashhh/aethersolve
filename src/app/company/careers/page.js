// src/app/company/careers/page.js
import PageLayout from '@/components/public/PageLayout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const perks = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Market-leading compensation benchmarked annually against industry data.' },
  { icon: '🏠', title: 'Remote-First', desc: 'Work from anywhere in India. We have no mandatory office days.' },
  { icon: '📚', title: 'Learning Budget', desc: '₹25,000 annual budget for courses, books, conferences, and certifications.' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive health cover for you and your immediate family.' },
  { icon: '⚡', title: 'Real Impact', desc: 'Your work ships to production and is used by real users — no toy projects.' },
  { icon: '🚀', title: 'Career Growth', desc: 'Clear growth paths with semi-annual reviews and promotion cycles.' },
  { icon: '🎯', title: 'Ownership Culture', desc: 'Engineers own features end-to-end — design, build, deploy, and monitor.' },
  { icon: '🤝', title: 'Equity Programs', desc: 'ESOP plans for senior hires who want to share in the company\'s growth.' },
];

export const metadata = {
  title: 'Careers — AetherSolve Technologies',
  description: 'Join AetherSolve Technologies. Open roles in engineering, design, AI, and sales.',
};

export default function CareersCompanyPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'Careers' }]}
      badge="💼 Join Us"
      title="Build the Future of Business Technology With Us"
      subtitle="We are a small team that ships fast, thinks deeply, and cares a lot about the craft. If that sounds like you, we want to talk."
      heroColor="#006ec7"
    >
      <section className="mb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="section-label mb-4 inline-block">Why AetherSolve?</span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-5">A Place Where Your Work Actually Matters</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              At most companies, engineers are feature factories. At AetherSolve, engineers are product owners. 
              You will design, build, deploy, and monitor your own features — with direct visibility into how they 
              impact real businesses.
            </p>
            <p className="text-slate-500 leading-relaxed mb-4">
              We work on genuinely hard problems — real-time ERP systems, LLM-powered automation, 
              healthcare compliance platforms — not another CRUD app. 
            </p>
            <p className="text-slate-500 leading-relaxed">
              We are growing quickly and there is significant opportunity to grow into leadership as the company scales.
            </p>
          </div>
          <div className="bg-brand-50 rounded-2xl p-8">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-display font-bold text-slate-900 mb-2">Remote-First, India-Based</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Our team spans Bengaluru, Mumbai, Delhi, Hyderabad, and beyond. 
              We meet in person quarterly for team off-sites.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[['50+', 'Team Size'], ['4.8/5', 'Glassdoor Rating'], ['Remote', 'Work Mode'], ['India', 'Based']].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl p-3 text-center">
                  <div className="font-display font-bold text-brand-700">{v}</div>
                  <div className="text-[10px] text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <span className="section-label mb-4 inline-block">Benefits</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">What We Offer</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map(p => (
            <div key={p.title} className="card p-5">
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-600 rounded-2xl p-8 text-center text-white">
        <h2 className="font-display text-2xl font-bold mb-3">Ready to Apply?</h2>
        <p className="text-brand-100 mb-6 max-w-xl mx-auto">
          View all open positions — engineering, design, AI, sales, and internships.
        </p>
        <Link href="/#careers" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-xl hover:bg-brand-50 transition-colors">
          See Open Positions <ArrowRight size={15} />
        </Link>
      </section>
    </PageLayout>
  );
}