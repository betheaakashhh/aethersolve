// src/app/services/mobile-apps/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'iOS App Development', desc: 'Native Swift / SwiftUI apps built for iPhone and iPad with App Store optimisation and seamless Apple ecosystem integration.' },
  { title: 'Android App Development', desc: 'Kotlin-based native Android apps with Material Design, push notifications, and Google Play deployment.' },
  { title: 'Cross-Platform Apps', desc: 'React Native and Flutter apps that run on both iOS and Android from a single codebase — faster delivery, lower cost.' },
  { title: 'On-Demand Apps', desc: 'Delivery, booking, and marketplace apps with real-time tracking, payments, and driver/customer interfaces.' },
  { title: 'Enterprise Mobility', desc: 'Internal tools for field teams, warehouse staff, and executives — connected to your ERP or CRM.' },
  { title: 'App Maintenance & Updates', desc: 'OS updates, feature additions, bug fixes, and performance monitoring on annual contracts.' },
];

const platforms = ['React Native', 'Flutter', 'Swift / SwiftUI', 'Kotlin', 'Expo', 'Firebase', 'Stripe', 'Google Maps SDK'];

const process = [
  { step: '01', title: 'Concept & Strategy', desc: 'Market research, competitor analysis, and feature prioritisation to define your MVP.' },
  { step: '02', title: 'UI/UX Design', desc: 'Mobile-first wireframes and interactive prototypes tested with real users.' },
  { step: '03', title: 'Development Sprints', desc: 'Iterative builds with weekly builds you can install and test on your own device.' },
  { step: '04', title: 'QA & Device Testing', desc: 'Tested on 20+ real devices across iOS and Android versions.' },
  { step: '05', title: 'Store Submission', desc: 'We handle App Store and Google Play submission, review responses, and listing optimisation.' },
  { step: '06', title: 'Post-Launch Support', desc: 'Monitoring, crash reporting, and rapid hotfix deployment after go-live.' },
];

export const metadata = {
  title: 'Mobile App Development — AetherSolve Technologies',
  description: 'iOS, Android & cross-platform mobile app development. React Native, Flutter, Swift and Kotlin experts.',
};

export default function MobileAppsPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'Mobile Apps' }]}
      badge="📱 Service"
      title="Mobile Apps That Users Actually Love"
      subtitle="We design and build iOS, Android, and cross-platform mobile applications that are fast, intuitive, and built to retain users — not just acquire them."
      heroColor="#7c3aed"
    >
      <section className="mb-20">
        <span className="section-label mb-4 inline-block">What We Build</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Apps for Every Use Case</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-purple-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-purple-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Technology Stack</h2>
        <div className="flex flex-wrap gap-3">
          {platforms.map(s => (
            <span key={s} className="px-4 py-2 bg-white border border-purple-100 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{s}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">From Idea to App Store</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {process.map(p => (
            <div key={p.step} className="flex gap-4">
              <div className="text-3xl font-display font-bold text-purple-100 leading-none shrink-0">{p.step}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['50+', 'Apps Launched'], ['4.8★', 'Avg Store Rating'], ['iOS + Android', 'Both Platforms'], ['3 months', 'Avg MVP Timeline']].map(([v, l]) => (
          <div key={l} className="bg-purple-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-purple-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}