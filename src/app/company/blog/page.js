// src/app/company/blog/page.js
import PageLayout from '@/components/public/PageLayout';

const posts = [
  { title: 'Why Custom ERP Beats Off-the-Shelf Software After 3 Years', date: 'March 2025', category: 'Engineering', readTime: '8 min', excerpt: 'The total cost of ownership comparison that SaaS vendors don\'t want you to see — and why the math changes dramatically at scale.' },
  { title: 'Building Production LLM Applications: What Nobody Tells You', date: 'February 2025', category: 'AI', readTime: '12 min', excerpt: 'The gap between a GPT-4o demo and a production AI system is enormous. Here is what we learned building 20+ AI products in 2024.' },
  { title: 'The AetherSolve Tech Stack in 2025', date: 'January 2025', category: 'Engineering', readTime: '6 min', excerpt: 'Every tool, framework, and infrastructure choice we make for client projects — and the reasoning behind each one.' },
  { title: 'React Native vs Flutter in 2025: A Practical Comparison', date: 'December 2024', category: 'Mobile', readTime: '10 min', excerpt: 'After building apps in both frameworks for 3 years, here is our honest assessment of where each one wins.' },
  { title: 'How We Reduced a Client\'s Cloud Bill by 67% in 6 Weeks', date: 'November 2024', category: 'DevOps', readTime: '7 min', excerpt: 'A case study of the infrastructure audit, rightsizing decisions, and architectural changes that cut costs without touching performance.' },
  { title: 'Designing for Trust: UX Patterns for Fintech Applications', date: 'October 2024', category: 'Design', readTime: '9 min', excerpt: 'The specific UI patterns that build user confidence in financial products — backed by our conversion data across 8 fintech clients.' },
];

const categoryColors = {
  Engineering: 'bg-brand-50 text-brand-700',
  AI: 'bg-emerald-50 text-emerald-700',
  Mobile: 'bg-purple-50 text-purple-700',
  DevOps: 'bg-cyan-50 text-cyan-700',
  Design: 'bg-pink-50 text-pink-700',
};

export const metadata = {
  title: 'Blog — AetherSolve Technologies',
  description: 'Engineering insights, product thinking, and technology perspectives from the AetherSolve team.',
};

export default function BlogPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Company' }, { label: 'Blog' }]}
      badge="✍️ Blog"
      title="Insights From the Engineers Building the Future"
      subtitle="We write about what we are learning — engineering decisions, AI experiments, product lessons, and observations from building software for businesses across India."
      heroColor="#006ec7"
    >
      <section className="mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.title} className="card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-slate-100 text-slate-600'}`}>
                  {post.category}
                </span>
                <span className="text-[10px] text-slate-400">{post.readTime} read</span>
              </div>
              <h3 className="font-display font-bold text-slate-900 mb-2 leading-snug">{post.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">{post.date}</span>
                <span className="text-xs font-semibold text-brand-600">Read more →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 rounded-2xl p-8 text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Subscribe to Our Newsletter</h2>
        <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">One email per month. Engineering insights, product lessons, and what we are building.</p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="input-field flex-1 text-sm"
          />
          <button className="btn-primary text-sm px-5 py-2.5">Subscribe</button>
        </div>
      </section>
    </PageLayout>
  );
}