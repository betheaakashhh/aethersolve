// src/app/services/ai-integration/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const features = [
  { title: 'LLM-Powered Chatbots', desc: 'Intelligent customer support, internal knowledge bots, and sales assistants powered by GPT-4o and fine-tuned models.' },
  { title: 'Workflow Automation', desc: 'Replace repetitive manual tasks with AI agents that process documents, route requests, and trigger actions automatically.' },
  { title: 'Predictive Analytics', desc: 'Machine learning models that forecast demand, predict churn, flag anomalies, and surface opportunities in your data.' },
  { title: 'Document Intelligence', desc: 'Extract, classify, and process information from invoices, contracts, forms, and reports at scale.' },
  { title: 'AI-Powered Search', desc: 'Semantic search across your internal knowledge base, product catalogue, or customer data.' },
  { title: 'Custom Model Fine-Tuning', desc: 'Fine-tune foundation models on your proprietary data for domain-specific accuracy and performance.' },
];

const tech = ['GPT-4o', 'Claude 3.5', 'LangChain', 'LlamaIndex', 'Python', 'FastAPI', 'Pinecone', 'MLflow', 'HuggingFace', 'TensorFlow'];

export const metadata = {
  title: 'AI & Automation Integration — AetherSolve Technologies',
  description: 'LLM integrations, workflow automation, predictive analytics, and custom AI solutions for your business.',
};

export default function AIIntegrationPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Services', href: '/#services' }, { label: 'AI Integration' }]}
      badge="🤖 Service"
      title="AI Integration — The Highest-Growth Service of This Decade"
      subtitle="Businesses that automate intelligently today will outcompete those that don't by 2027. We build production-grade AI systems that actually work — not demos that impress in a pitch and fail in production."
      heroColor="#059669"
    >
      <section className="mb-16 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
        <p className="text-emerald-900 font-semibold text-lg mb-2">Why AI, Why Now?</p>
        <p className="text-emerald-800 text-sm leading-relaxed">
          The LLM ecosystem is evolving so fast that businesses need a technology partner who keeps up — 
          not a team that learns on your project. AetherSolve has been building production AI systems 
          since 2023, and our clients are already seeing 40–70% reductions in manual processing costs.
        </p>
      </section>

      <section className="mb-20">
        <span className="section-label mb-4 inline-block">What We Build</span>
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">AI Solutions Across Every Function</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:-translate-y-1 transition-transform duration-300">
              <CheckCircle size={18} className="text-emerald-500 mb-3" />
              <h3 className="font-display font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-emerald-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">AI Stack We Work With</h2>
        <div className="flex flex-wrap gap-3">
          {tech.map(t => (
            <span key={t} className="px-4 py-2 bg-white border border-emerald-100 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{t}</span>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Our AI Delivery Approach</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Audit & Identify', desc: 'We map your workflows to find the highest-ROI automation opportunities first — quick wins before complex projects.' },
            { step: '2', title: 'Prototype & Validate', desc: 'A working proof-of-concept in 2 weeks so you can see real output before committing to full build.' },
            { step: '3', title: 'Production Deployment', desc: 'Monitored, documented, and continuously improved AI systems integrated into your existing stack.' },
          ].map(item => (
            <div key={item.step} className="bg-slate-50 rounded-2xl p-6 flex gap-4">
              <div className="text-3xl font-display font-bold text-emerald-100 shrink-0">{item.step}</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['70%', 'Avg Manual Task Reduction'], ['2 weeks', 'PoC Delivery'], ['GPT-4o', 'Latest Models Used'], ['24/7', 'AI Systems Uptime']].map(([v, l]) => (
          <div key={l} className="bg-emerald-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-emerald-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}