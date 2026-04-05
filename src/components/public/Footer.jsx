// src/components/public/Footer.jsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, ArrowRight, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

const links = {
  Services: [
    { label: 'Web Development',   href: '/services/web-development' },
    { label: 'Mobile Apps',       href: '/services/mobile-apps' },
    { label: 'UI/UX Design',      href: '/services/ui-ux-design' },
    { label: 'ERP / CRM',         href: '/services/erp-crm' },
    { label: 'AI Integration',    href: '/services/ai-integration' },
    { label: 'Cloud Hosting',     href: '/services/cloud-hosting' },
  ],
  Company: [
    { label: 'About Us',  href: '/company/about' },
    { label: 'Our Work',  href: '/company/work' },
    { label: 'Careers',   href: '/company/careers' },
    { label: 'Blog',      href: '/company/blog' },
    { label: 'Press',     href: '/company/press' },
  ],
  Industries: [
    { label: 'Education',      href: '/industries/education' },
    { label: 'Healthcare',     href: '/industries/healthcare' },
    { label: 'Finance',        href: '/industries/finance' },
    { label: 'Manufacturing',  href: '/industries/manufacturing' },
    { label: 'Real Estate',    href: '/industries/real-estate' },
    { label: 'Retail',         href: '/industries/retail' },
  ],
};

const socials = [
  { icon: Linkedin, href: 'https://linkedin.com/company/aethersolve', label: 'LinkedIn' },
  { icon: Twitter,  href: 'https://x.com/aethersolve',                label: 'Twitter / X' },
  { icon: Github,   href: 'https://github.com/aethersolve',            label: 'GitHub' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent]   = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSent(true); setEmail(''); }
  };

  return (
    <footer id="contact" className="bg-zinc-950 text-zinc-400 relative overflow-hidden">

      {/* Large decorative text */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[clamp(5rem,16vw,14rem)] font-['Syne'] font-black text-white/[0.025] whitespace-nowrap select-none pointer-events-none leading-none"
      >
        AetherSolve
      </div>

      {/* Top CTA section */}
      <div className="relative border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Left: headline */}
            <div>
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-orange-500 mb-6 block">
                Ready to Build?
              </span>
              <h2 className="font-['Syne'] font-black text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-[-0.03em] text-white mb-6">
                Let's create
                <br />
                something
                <br />
                <span className="text-orange-500">extraordinary.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:hello@aethersolve.com"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-orange-500 text-white text-[14px] font-semibold rounded-full hover:bg-orange-400 transition-all duration-300 shadow-lg shadow-orange-500/20"
                >
                  <Mail size={15} /> hello@aethersolve.com
                </a>
                <a
                  href="#careers"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-zinc-800 text-zinc-300 text-[14px] font-semibold rounded-full hover:border-zinc-600 hover:text-white transition-all duration-300"
                >
                  View Openings <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right: newsletter + contact info */}
            <div className="space-y-8">
              {/* Newsletter */}
              <div>
                <p className="text-[13px] font-semibold text-white mb-1">Stay in the loop</p>
                <p className="text-[12px] text-zinc-500 mb-4">Monthly updates. No spam. Unsubscribe anytime.</p>
                {sent ? (
                  <p className="text-[13px] text-emerald-400 font-medium">✓ You're subscribed!</p>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-white text-zinc-900 text-[13px] font-semibold rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>

              {/* Contact details */}
              <div className="space-y-3">
                {[
                  { icon: Mail,   text: 'hello@aethersolve.com', href: 'mailto:hello@aethersolve.com' },
                  { icon: Phone,  text: '+91 88000 00000',        href: 'tel:+918800000000' },
                  { icon: MapPin, text: 'Bhilai, Chhattisgarh, India', href: null },
                ].map(({ icon: Icon, text, href }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0">
                      <Icon size={13} className="text-orange-500" />
                    </div>
                    {href
                      ? <a href={href} className="text-[13px] hover:text-white transition-colors">{text}</a>
                      : <span className="text-[13px]">{text}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-8 lg:gap-12">

          {/* Brand col */}
          <div className="col-span-2 lg:col-span-3">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-7 h-7 shrink-0">
                <Image src="/newaether.png" alt="AetherSolve" fill sizes="28px" className="object-contain" />
              </div>
              <span className="font-['Syne'] font-bold text-[15px] text-white tracking-tight">AetherSolve</span>
            </div>

            <p className="text-[13px] text-zinc-500 leading-relaxed mb-8 max-w-xs">
              Building digital infrastructure that compounds over time.
              We build, host, maintain, grow, and add AI to your business — permanently.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center hover:border-zinc-600 hover:text-white transition-all duration-200 group"
                >
                  <Icon size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="col-span-1">
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-500 mb-5">{heading}</p>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-[13px] text-zinc-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* aether.ai promo strip */}
      <div className="relative border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[12px] font-bold text-zinc-400">
                Try{' '}
                <Link href="/services/aipage" className="text-orange-500 hover:text-orange-400 transition-colors">
                  aether.ai
                </Link>
                {' '}— AI-powered internal tools built on your data
              </span>
            </div>
            <Link
              href="/services/aipage"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-orange-500 hover:text-orange-400 transition-colors"
            >
              Explore <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <span>© {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}