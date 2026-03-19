// src/app/industries/education/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const solutions = [
  { title: 'Learning Management Systems', desc: 'Full-featured LMS with video courses, live classes, quizzes, certificates, and student progress tracking.' },
  { title: 'Student Information Systems', desc: 'Admissions, enrollment, attendance, grades, timetables, and fee management in one platform.' },
  { title: 'Online Exam Platforms', desc: 'Secure, proctored online examinations with AI-based integrity monitoring and instant result processing.' },
  { title: 'EdTech Startup Platforms', desc: 'We build and co-develop SaaS EdTech products — from MVP to scale — for founders with a vision but no tech team.' },
  { title: 'Corporate Training Portals', desc: 'Internal L&D platforms for companies with onboarding, compliance training, and skill development modules.' },
  { title: 'Parent & Teacher Apps', desc: 'Mobile apps for real-time communication between schools, parents, and students.' },
];

export const metadata = {
  title: 'EdTech & Education Software — AetherSolve Technologies',
  description: 'LMS, student information systems, online exam platforms, and custom EdTech solutions for schools, colleges, and startups.',
};

export default function EducationPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Industries' }, { label: 'Education' }]}
      badge="🎓 Industry"
      title="Technology That Makes Learning Better"
      subtitle="From schools and colleges to EdTech startups and corporate training teams — we build the digital infrastructure that powers modern education."
      heroColor="#006ec7"
    >
      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Solutions for Education</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map(s => (
            <div key={s.title} className="card p-6 hover:-translate-y-1 transition-transform">
              <CheckCircle size={18} className="text-brand-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-blue-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Who We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Schools & Boards', 'Colleges & Universities', 'EdTech Startups', 'Coaching Institutes', 'Corporate L&D', 'Skill Dev Centres', 'Test Prep Platforms', 'K-12 Chains'].map(c => (
            <div key={c} className="bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 text-center border border-blue-100">{c}</div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['30+', 'EdTech Projects'], ['50K+', 'Students on Our Platforms'], ['Per-Seat', 'Licensing Models'], ['GDPR Ready', 'Data Compliance']].map(([v, l]) => (
          <div key={l} className="bg-brand-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-brand-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}