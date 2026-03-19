// src/app/industries/retail/page.js
import PageLayout from '@/components/public/PageLayout';
import { CheckCircle } from 'lucide-react';

const solutions = [
  { title: 'D2C E-Commerce Platforms', desc: 'Custom-built online stores with AI product recommendations, personalised offers, and seamless checkout flows.' },
  { title: 'Loyalty & Rewards Apps', desc: 'Points programmes, cashback systems, referral tracking, and gamified loyalty experiences that retain customers.' },
  { title: 'Inventory Management', desc: 'Real-time stock tracking across multiple stores and warehouses, automated reorder alerts, and supplier integrations.' },
  { title: 'POS & Billing Systems', desc: 'Fast, reliable point-of-sale systems that sync with your inventory and work offline during connectivity issues.' },
  { title: 'Marketplace Seller Tools', desc: 'Multi-platform listing management, order aggregation, and analytics across Amazon, Flipkart, Meesho, and more.' },
  { title: 'Retail Analytics Dashboards', desc: 'Sales performance, basket analysis, customer lifetime value, and store-level P&L in real time.' },
];

export const metadata = {
  title: 'Retail & D2C Technology — AetherSolve Technologies',
  description: 'E-commerce platforms, loyalty apps, inventory management, and retail analytics for D2C brands and retail chains.',
};

export default function RetailPage() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Industries' }, { label: 'Retail & D2C' }]}
      badge="🛍 Industry"
      title="Retail Technology That Turns Browsers Into Buyers"
      subtitle="The difference between a D2C brand that plateaus and one that scales is usually the quality of its technology. We build the e-commerce, inventory, and analytics systems that let retail businesses compete at any scale."
      heroColor="#0891b2"
    >
      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-10">Retail Solutions We Build</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map(s => (
            <div key={s.title} className="card p-6 hover:-translate-y-1 transition-transform">
              <CheckCircle size={18} className="text-cyan-500 mb-3" />
              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20 bg-cyan-50 rounded-2xl p-8">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Clients We Serve</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {['D2C Brands', 'Retail Chains', 'FMCG Companies', 'Fashion Brands', 'Marketplace Sellers', 'Grocery Startups', 'Electronics Retail', 'Luxury Brands'].map(c => (
            <div key={c} className="bg-white rounded-xl p-4 text-sm font-semibold text-slate-700 text-center border border-cyan-100">{c}</div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="font-display text-3xl font-bold text-slate-900 mb-8">Why Retailers Choose Us</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            { title: 'Speed to Market', desc: 'We launch D2C stores in 6–8 weeks — not 6 months. Your product is live, earning, and learnable before competitors blink.' },
            { title: 'AI-Powered Growth', desc: 'Our recommendation engines drive 20–35% higher average order values. Built in, not bolted on.' },
            { title: 'Omnichannel Ready', desc: 'One platform that covers your website, mobile app, WhatsApp commerce, and physical store POS.' },
          ].map(item => (
            <div key={item.title} className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100">
              <h3 className="font-display font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[['3x', 'Avg Revenue Increase'], ['28%', 'Higher AOV with AI'], ['6–8 weeks', 'Launch Timeline'], ['Omnichannel', 'Web + App + POS']].map(([v, l]) => (
          <div key={l} className="bg-cyan-50 rounded-2xl p-6 text-center">
            <div className="text-2xl font-display font-bold text-cyan-700 mb-1">{v}</div>
            <div className="text-xs text-slate-500 font-medium">{l}</div>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}