'use client';
// src/components/public/ServicesSection.jsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Palette, Database, Brain, Cloud, Shield, BarChart3, ArrowRight, CheckCircle, Zap, Server, Bot } from 'lucide-react';

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
}

function RevealBox({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal(delay);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease', ...style }}>
      {children}
    </div>
  );
}

const services = [
  {
    icon: Bot,
    label: 'AI Automation Systems',
    href: '/services/ai-automation',
    title: 'Automate the work that slows you down.',
    body: 'Automated workflows, intelligent document processing, predictive operations, and LLM-powered internal tools — built on your actual data, not generic models.',
    features: ['RAG pipelines', 'WhatsApp automation', 'Document intelligence', 'Workflow bots'],
    visual: 'ai_automation',
  },
  {
    icon: Database,
    label: 'AI-First ERP & CRM',
    href: '/services/erp-crm',
    title: 'Your operations, fully automated.',
    body: 'Custom operations software built with AI from day one. HR, payroll, inventory, sales — unified, intelligent, and actually used by your team.',
    features: ['Custom ERP', 'Inventory AI', 'Sales pipeline', 'BI dashboards'],
    visual: 'ai_erp',
    flip: true,
  },
  {
    icon: Server,
    label: 'Managed Cloud Infrastructure',
    href: '/services/cloud-hosting',
    title: 'Never think about infrastructure again.',
    body: 'Every system we build, we host and maintain. AWS/GCP infrastructure, 24/7 monitoring, and a team you can call when something breaks.',
    features: ['AWS / GCP', 'Auto-scaling', 'CI/CD', '24/7 uptime'],
    visual: 'ai_cloud',
  },
  {
    icon: Globe,
    label: 'Web Development',
    href: '/services/web-development',
    title: 'Websites that work as hard as you do.',
    body: 'Custom web applications built around your exact business logic — from marketing sites to complex enterprise portals. Fast, SEO-ready, and built to scale.',
    features: ['React / Next.js', 'E-Commerce', 'Web Portals', 'API Development'],
    visual: 'web',
    flip: true,
  },
  {
    icon: Smartphone,
    label: 'Mobile Apps',
    href: '/services/mobile-apps',
    title: 'Apps users actually keep on their phone.',
    body: 'iOS, Android, and cross-platform apps with a focus on retention and performance. From concept through App Store submission.',
    features: ['React Native / Flutter', 'iOS & Android', 'Push Notifications', 'Offline Support'],
    visual: 'mobile',
  },
  {
    icon: Brain,
    label: 'AI Integration',
    href: '/services/ai-integration',
    title: 'Automate the work that slows you down.',
    body: 'LLM-powered chatbots, document intelligence, workflow automation, and predictive analytics. Built for production, not demos.',
    features: ['GPT-4o / Claude', 'Workflow Bots', 'LangChain / RAG', 'Fine-tuning'],
    visual: 'ai',
    flip: true,
  },
  {
    icon: Database,
    label: 'ERP & CRM',
    href: '/services/erp-crm-classic',
    title: 'Your operations, fully automated.',
    body: 'Custom ERP built to your exact workflows — HR, payroll, inventory, sales pipeline. No per-seat fees. No forced templates.',
    features: ['HR & Payroll', 'Inventory', 'CRM Pipelines', 'BI Dashboards'],
    visual: 'erp',
  },
  {
    icon: Cloud,
    label: 'Cloud & Hosting',
    href: '/services/cloud-hosting-full',
    title: 'Never think about infrastructure again.',
    body: 'Fully managed AWS/GCP infrastructure with 24/7 monitoring, auto-scaling, security patching, and a 99.97% uptime SLA.',
    features: ['AWS / GCP / Azure', 'Auto-scaling', 'CI/CD Pipelines', '24/7 Monitoring'],
    visual: 'cloud',
    flip: true,
  },
];

// ─── Animated Visuals ───────────────────────────────────────────────────────

function Visual({ type }) {
  const base = {
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    background: 'var(--surface-2)',
    padding: '20px',
    minHeight: '220px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'relative',
  };

  // ── AI Automation: animated pipeline flow ──────────────────────────────
  if (type === 'ai_automation') return (
    <div style={base}>
      <style>{`
        @keyframes pulse-node { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.8} }
        @keyframes flow-dash { to{stroke-dashoffset:-24} }
        @keyframes scan-line { 0%{top:0%} 100%{top:100%} }
        @keyframes pop-in { 0%{opacity:0;transform:scale(0.7)} 60%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        @keyframes fade-cycle { 0%,80%,100%{opacity:0} 20%,60%{opacity:1} }
      `}</style>

      {/* Title bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-4)', fontFamily:'var(--font-body)' }}>Automation Pipeline</span>
        <span style={{ fontSize:'10px', fontWeight:700, color:'#22c55e', background:'rgba(34,197,94,0.12)', padding:'2px 8px', borderRadius:'100px', fontFamily:'var(--font-body)', animation:'pulse-node 2s ease-in-out infinite' }}>● Live</span>
      </div>

      {/* SVG pipeline */}
      <svg viewBox="0 0 320 130" style={{ width:'100%', flex:1, overflow:'visible' }} xmlns="http://www.w3.org/2000/svg">
        {/* Dashed animated connector lines */}
        {[[55,65,120,65],[175,65,240,65]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 4"
            style={{ animation:`flow-dash 0.8s linear infinite`, animationDelay:`${i*0.3}s` }} />
        ))}
        {/* Branch lines from center node */}
        {[[160,80,80,115],[160,80,240,115]].map(([x1,y1,x2,y2],i)=>(
          <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,92,26,0.3)" strokeWidth="1" strokeDasharray="4 4"
            style={{ animation:`flow-dash 1.2s linear infinite`, animationDelay:`${i*0.5}s` }} />
        ))}

        {/* Nodes */}
        {[
          { cx:28, cy:65, r:22, label:'DOCS', sub:'4.8k files', color:'var(--bg-3)', delay:'0s' },
          { cx:147, cy:65, r:26, label:'RAG', sub:'Engine', color:'var(--accent)', delay:'0.2s', accent:true },
          { cx:272, cy:65, r:22, label:'Router', sub:'23 insights', color:'var(--bg-3)', delay:'0.4s' },
          { cx:80, cy:115, r:18, label:'WhatsApp', sub:'Bot', color:'var(--bg-2)', delay:'0.6s', small:true },
          { cx:240, cy:115, r:18, label:'CRM', sub:'Update', color:'var(--bg-2)', delay:'0.8s', small:true },
        ].map((n,i)=>(
          <g key={i} style={{ animation:`pulse-node ${2+i*0.3}s ease-in-out infinite`, animationDelay:n.delay, transformOrigin:`${n.cx}px ${n.cy}px` }}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={n.accent?'var(--accent)':'var(--bg-3)'} stroke={n.accent?'none':'var(--border)'} strokeWidth="1" />
            <text x={n.cx} y={n.cy - (n.small?2:4)} textAnchor="middle" fontSize={n.small?7:9} fontWeight="700" fill={n.accent?'#fff':'var(--text)'} fontFamily="var(--font-body)">{n.label}</text>
            <text x={n.cx} y={n.cy + (n.small?8:10)} textAnchor="middle" fontSize={n.small?6:8} fill={n.accent?'rgba(255,255,255,0.7)':'var(--text-4)'} fontFamily="var(--font-body)">{n.sub}</text>
          </g>
        ))}

        {/* Animated data packet */}
        <circle r="4" fill="var(--accent)" opacity="0.9">
          <animateMotion dur="1.6s" repeatCount="indefinite" path="M 28,65 L 147,65" />
        </circle>
        <circle r="3" fill="#fff" opacity="0.7">
          <animateMotion dur="1.6s" repeatCount="indefinite" begin="0.8s" path="M 147,65 L 272,65" />
        </circle>
      </svg>
    </div>
  );

  // ── AI ERP: animated ops dashboard ───────────────────────────────────────
  if (type === 'ai_erp') return (
    <div style={base}>
      <style>{`
        @keyframes count-up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bar-grow { from{width:0} to{width:var(--tw)} }
        @keyframes ai-blink { 0%,90%,100%{opacity:0.3} 45%{opacity:1} }
        @keyframes row-slide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2px' }}>
        <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-4)', fontFamily:'var(--font-body)' }}>AI Operations Center</span>
        <span style={{ fontSize:'10px', color:'var(--accent)', fontWeight:700, fontFamily:'var(--font-body)', animation:'ai-blink 1.8s ease infinite' }}>⚡ AI Insight</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
        {[
          { k:'HR', v:'24', sub:'active', color:'var(--accent)', delay:'0s' },
          { k:'PAYROLL', v:'₹12.4L', sub:'processed', color:'#22c55e', delay:'0.1s' },
          { k:'INVENTORY', v:'847', sub:'SKUs', color:'#3b82f6', delay:'0.2s' },
          { k:'CRM', v:'48', sub:'leads', color:'#a855f7', delay:'0.3s' },
        ].map(({ k, v, sub, color, delay }) => (
          <div key={k} style={{ padding:'10px 12px', background:'var(--bg-3)', borderRadius:'10px', border:'1px solid var(--border)', animation:`count-up 0.6s ease both`, animationDelay:delay }}>
            <div style={{ fontSize:'9px', color:'var(--text-4)', fontFamily:'var(--font-body)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{k}</div>
            <div style={{ fontSize:'16px', fontWeight:700, fontFamily:'var(--font-display)', color }}>{v}</div>
            <div style={{ fontSize:'9px', color:'var(--text-4)', fontFamily:'var(--font-body)', marginTop:'2px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Animated progress bar */}
      <div style={{ marginTop:'4px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
          <span style={{ fontSize:'9px', color:'var(--text-4)', fontFamily:'var(--font-body)' }}>Monthly target</span>
          <span style={{ fontSize:'9px', color:'var(--accent)', fontWeight:700, fontFamily:'var(--font-body)' }}>72%</span>
        </div>
        <div style={{ height:'6px', borderRadius:'100px', background:'var(--bg-3)', overflow:'hidden' }}>
          <div style={{ height:'100%', background:'var(--accent)', borderRadius:'100px', '--tw':'72%', animation:'bar-grow 1.4s cubic-bezier(0.4,0,0.2,1) 0.4s both' }} />
        </div>
      </div>

      {/* AI suggestion row */}
      <div style={{ background:'rgba(255,92,26,0.07)', border:'1px solid rgba(255,92,26,0.2)', borderRadius:'8px', padding:'8px 10px', display:'flex', alignItems:'center', gap:'8px', animation:'row-slide 0.5s ease 0.8s both' }}>
        <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Brain size={11} style={{ color:'#fff' }} />
        </div>
        <span style={{ fontSize:'10px', color:'var(--accent)', fontFamily:'var(--font-body)', fontWeight:500 }}>AI: Reorder SKU-2847 — stock drops below threshold in 3 days</span>
      </div>
    </div>
  );

  // ── AI Cloud: animated infra health ─────────────────────────────────────
  if (type === 'ai_cloud') return (
    <div style={base}>
      <style>{`
        @keyframes ping-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes traffic-move { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
        @keyframes node-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,0)} }
        @keyframes metric-tick { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'4px' }}>
        <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-4)', fontFamily:'var(--font-body)' }}>System Status</span>
        <span style={{ fontSize:'10px', fontWeight:700, color:'#22c55e', background:'rgba(34,197,94,0.1)', padding:'2px 8px', borderRadius:'100px', fontFamily:'var(--font-body)', position:'relative' }}>
          ● All Green
          <span style={{ position:'absolute', inset:0, borderRadius:'100px', border:'1px solid rgba(34,197,94,0.5)', animation:'ping-ring 1.5s ease-out infinite' }} />
        </span>
      </div>

      {/* Service rows */}
      {[
        { s:'API Gateway', v:'99.99%', color:'#22c55e', delay:'0s' },
        { s:'Database Cluster', v:'99.97%', color:'#22c55e', delay:'0.1s' },
        { s:'CDN Edge', v:'100%', color:'#22c55e', delay:'0.2s' },
        { s:'Backups', v:'Verified ✓', color:'#22c55e', delay:'0.3s' },
      ].map(({ s, v, color, delay }) => (
        <div key={s} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid var(--border)', animation:`row-slide 0.5s ease ${delay} both` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:color, animation:'node-pulse 2s ease infinite' }} />
            <span style={{ fontSize:'12px', color:'var(--text-2)', fontFamily:'var(--font-body)' }}>{s}</span>
          </div>
          <span style={{ fontSize:'12px', fontWeight:700, color, fontFamily:'var(--font-body)' }}>{v}</span>
        </div>
      ))}

      {/* Live traffic mini-sparkline */}
      <div style={{ marginTop:'4px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
          <span style={{ fontSize:'9px', color:'var(--text-4)', fontFamily:'var(--font-body)' }}>Live traffic</span>
          <span style={{ fontSize:'9px', color:'var(--accent)', fontWeight:700, fontFamily:'var(--font-body)', animation:'metric-tick 1s ease infinite' }}>2.3k req/s</span>
        </div>
        <svg viewBox="0 0 280 28" style={{ width:'100%', height:'28px' }}>
          <polyline points="0,22 30,18 60,14 80,20 110,10 140,16 170,8 200,14 230,6 260,12 280,8"
            fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="400" style={{ animation:'traffic-move 2s linear infinite' }} />
          <polyline points="0,22 30,18 60,14 80,20 110,10 140,16 170,8 200,14 230,6 260,12 280,8"
            fill="url(#sparkFill)" strokeWidth="0" />
          <defs>
            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );

  // ── Original Visuals ─────────────────────────────────────────────────────

  if (type === 'web') return (
    <div style={base}>
      <div style={{ display:'flex', gap:'6px', marginBottom:'4px' }}>
        {['#ff5f57','#febc2e','#28c840'].map(c=><span key={c} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }} />)}
      </div>
      <div style={{ height:'12px', borderRadius:'6px', background:'var(--bg-3)', width:'60%' }} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', flex:1 }}>
        {[0,1,2].map(i=><div key={i} style={{ borderRadius:'10px', background:i===0?'var(--accent-soft)':'var(--bg-3)', border:i===0?'1px solid var(--accent-soft2)':'1px solid var(--border)' }} />)}
      </div>
      <div style={{ height:'8px', borderRadius:'100px', background:'var(--accent)', width:'40%' }} />
    </div>
  );

  if (type === 'mobile') return (
    <div style={{ ...base, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:'16px' }}>
      {[0,1].map(i=>(
        <div key={i} style={{ width:'90px', height:'160px', borderRadius:'16px', border:'2px solid var(--border-2)', background:'var(--bg-3)', display:'flex', flexDirection:'column', padding:'10px', gap:'6px', transform:i===1?'translateY(16px)':'none' }}>
          <div style={{ height:'8px', borderRadius:'100px', background:i===0?'var(--accent)':'var(--bg-2)', width:'50%' }} />
          {[1,2,3].map(j=><div key={j} style={{ flex:1, borderRadius:'6px', background:'var(--bg-2)' }} />)}
        </div>
      ))}
    </div>
  );

  if (type === 'ai') return (
    <div style={base}>
      <div style={{ display:'flex', gap:'8px', alignItems:'flex-start' }}>
        <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Brain size={14} style={{ color:'#fff' }} />
        </div>
        <div style={{ background:'var(--bg-3)', borderRadius:'12px 12px 12px 0', padding:'10px 14px', fontSize:'12px', fontFamily:'var(--font-body)', color:'var(--text-2)', flex:1 }}>
          Analysing 4,847 documents... ✓<br />Extracted 23 key insights.
        </div>
      </div>
      <div style={{ alignSelf:'flex-end', background:'var(--accent-soft2)', border:'1px solid var(--accent-soft2)', borderRadius:'12px 12px 0 12px', padding:'10px 14px', fontSize:'12px', fontFamily:'var(--font-body)', color:'var(--accent)', maxWidth:'80%' }}>
        Summarise Q3 compliance reports
      </div>
      <div style={{ display:'flex', gap:'6px' }}>
        {[1,2,3].map(i=><div key={i} style={{ flex:1, height:'6px', borderRadius:'100px', background:i===1?'var(--accent)':'var(--bg-3)' }} />)}
      </div>
    </div>
  );

  if (type === 'erp') return (
    <div style={base}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
        {[['HR','24 active'],['Payroll','₹12.4L'],['Inventory','847 SKUs'],['CRM','48 leads']].map(([k,v])=>(
          <div key={k} style={{ padding:'12px', background:'var(--bg-3)', borderRadius:'10px', border:'1px solid var(--border)' }}>
            <div style={{ fontSize:'10px', color:'var(--text-4)', fontFamily:'var(--font-body)', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{k}</div>
            <div style={{ fontSize:'15px', fontWeight:700, fontFamily:'var(--font-display)', color:'var(--text)' }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ height:'8px', borderRadius:'100px', background:'var(--bg-3)', overflow:'hidden' }}>
        <div style={{ height:'100%', width:'72%', background:'var(--accent)', borderRadius:'100px' }} />
      </div>
    </div>
  );

  if (type === 'cloud') return (
    <div style={base}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <span style={{ fontSize:'11px', fontWeight:700, fontFamily:'var(--font-body)', color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'0.08em' }}>System Status</span>
        <span style={{ fontSize:'11px', fontWeight:700, color:'#22c55e', background:'rgba(34,197,94,0.1)', padding:'2px 8px', borderRadius:'100px' }}>● All Green</span>
      </div>
      {[['API Gateway','99.99%'],['Database Cluster','99.97%'],['CDN Edge','100%'],['Backups','Verified']].map(([s,v])=>(
        <div key={s} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontSize:'12px', color:'var(--text-2)', fontFamily:'var(--font-body)' }}>{s}</span>
          <span style={{ fontSize:'12px', fontWeight:700, color:'#22c55e', fontFamily:'var(--font-body)' }}>{v}</span>
        </div>
      ))}
    </div>
  );

  return <div style={{ ...base, minHeight:'220px' }} />;
}

export default function ServicesSection() {
  return (
    <section id="services" style={{ background:'var(--bg)', padding:'100px 0' }}>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 24px' }}>

        {/* Section header */}
        <RevealBox style={{ textAlign:'center', marginBottom:'100px' }}>
          <span className="text-label" style={{ display:'block', marginBottom:'16px' }}>What We Build</span>
          <h2 className="text-display" style={{ color:'var(--text)', marginBottom:'20px' }}>
            One focus: <span style={{ color:'var(--accent)' }}>making your operations run themselves</span>.
          </h2>
          <p className="text-lead" style={{ maxWidth:'520px', margin:'0 auto' }}>
            A full-stack technology partner — from the first pixel to production infrastructure.
          </p>
        </RevealBox>

        {/* Alternating service blocks */}
        {services.map((svc, i) => {
          const Icon = svc.icon;
          const isFlip = svc.flip;
          return (
            <div key={svc.label} style={{ marginBottom:'100px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center' }}>

                {/* Text side */}
                <RevealBox delay={i * 50} style={{ order:isFlip ? 2 : 1 }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 12px', borderRadius:'100px', background:'var(--accent-soft)', marginBottom:'20px' }}>
                    <Icon size={13} style={{ color:'var(--accent)' }} />
                    <span style={{ fontSize:'11.5px', fontWeight:700, color:'var(--accent)', fontFamily:'var(--font-body)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{svc.label}</span>
                  </div>

                  <h3 className="text-title" style={{ color:'var(--text)', marginBottom:'16px' }}>{svc.title}</h3>
                  <p className="text-body" style={{ marginBottom:'24px' }}>{svc.body}</p>

                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' }}>
                    {svc.features.map(f => (
                      <span key={f} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', borderRadius:'100px', background:'var(--bg-2)', border:'1px solid var(--border)', fontFamily:'var(--font-body)', fontSize:'12.5px', fontWeight:500, color:'var(--text-2)' }}>
                        <CheckCircle size={11} style={{ color:'var(--accent)', flexShrink:0 }} />
                        {f}
                      </span>
                    ))}
                  </div>

                  <Link href={svc.href}
                    style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-body)', fontSize:'14px', fontWeight:700, color:'var(--accent)', textDecoration:'none', transition:'gap 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.gap = '10px'}
                    onMouseLeave={e => e.currentTarget.style.gap = '6px'}
                  >
                    Learn more <ArrowRight size={15} />
                  </Link>
                </RevealBox>

                {/* Visual side */}
                <RevealBox delay={i * 50 + 100} style={{ order:isFlip ? 1 : 2 }}>
                  <Visual type={svc.visual} />
                </RevealBox>
              </div>

              {i < services.length - 1 && <div style={{ height:'1px', background:'var(--border)', marginTop:'0' }} />}
            </div>
          );
        })}

        {/* Journey strip */}
        <RevealBox>
          <div style={{ background:'#0a0a0a', borderRadius:'24px', padding:'48px', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'400px', height:'200px', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(255,92,26,0.1), transparent 70%)', pointerEvents:'none' }} />
            <p style={{ fontFamily:'var(--font-body)', fontSize:'11px', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:'20px' }}>
              The AetherSolve Model
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'center', gap:'8px', position:'relative', zIndex:1 }}>
              {['Build it','Host it','Maintain it','Grow it','Add AI'].map((s, i) => (
                <div key={s} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ padding:'9px 20px', borderRadius:'100px', fontFamily:'var(--font-body)', fontSize:'13px', fontWeight:700, background:i===4?'var(--accent)': 'rgba(255,255,255,0.08)', color:'#fff', border:i===4?'none':'1px solid rgba(255,255,255,0.1)', boxShadow:i===4?'0 4px 20px rgba(255,92,26,0.4)':'none' }}>
                      {s}
                    </div>
                    <div style={{ fontSize:'9.5px', color:'rgba(255,255,255,0.2)', marginTop:'5px', fontFamily:'var(--font-body)', letterSpacing:'0.06em' }}>
                      {['One-time','Monthly','AMC','New Modules','Retainer'][i]}
                    </div>
                  </div>
                  {i < 4 && <ArrowRight size={14} style={{ color:'rgba(255,255,255,0.2)', flexShrink:0 }} />}
                </div>
              ))}
            </div>
          </div>
        </RevealBox>
      </div>
    </section>
  );
}