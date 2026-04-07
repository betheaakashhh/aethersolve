'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Brain, Zap, BarChart3, Bot, Workflow, Database,
  ArrowRight, ChevronDown, Sparkles, Shield, Clock,
  TrendingUp, Users, Building2, Package, DollarSign,
  MessageSquare, FileText, Eye, ArrowLeft, Terminal,
  CircuitBoard, Cpu, Network, Activity
} from 'lucide-react';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   PARTICLE CANVAS BACKGROUND
───────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let W, H;
    let particles = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 1.5 + 0.3;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.6 ? '#f59e0b' : Math.random() > 0.5 ? '#006ec7' : '#0a4f96';
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });

      // draw connections
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,110,199,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─────────────────────────────────────────────
   ANIMATED TERMINAL TYPEWRITER
───────────────────────────────────────────── */
function TerminalLine({ lines, delay = 0 }) {
  const [visible, setVisible] = useState([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      lines.forEach((line, i) => {
        setTimeout(() => {
          setVisible(v => [...v, i]);
        }, i * 600);
      });
    }, delay);

    const blink = setInterval(() => setCursor(c => !c), 530);
    return () => { clearTimeout(timer); clearInterval(blink); };
  }, [lines, delay]);

  return (
    <div className="font-mono text-xs sm:text-sm leading-6">
      {lines.map((line, i) => (
        <div key={i} className={`transition-opacity duration-500 ${visible.includes(i) ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-amber-400">❯ </span>
          <span className="text-white/80">{line}</span>
        </div>
      ))}
      <span className={`inline-block w-2 h-4 bg-brand-600 ml-4 align-middle transition-opacity ${cursor ? 'opacity-100' : 'opacity-0'}`} style={{ background: '#006ec7' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   GLOWING STAT CARD
───────────────────────────────────────────── */
function StatCard({ value, label, icon: Icon, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: color }}
      />
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-white/20 transition-colors duration-300">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-xl" style={{ background: `${color}20` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
        </div>
        <div className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          {value}
        </div>
        <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   AI PRODUCT CARD
───────────────────────────────────────────── */
function ProductCard({ icon: Icon, title, description, features, color, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer"
    >
      {/* Glow layer */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-2xl"
        style={{ background: color }}
        animate={{ opacity: hovered ? 0.15 : 0.05 }}
        transition={{ duration: 0.4 }}
      />

      {/* Card */}
      <div className="relative h-full rounded-3xl border border-white/10 bg-[#080d14] p-7 overflow-hidden
        hover:border-white/20 transition-colors duration-500">

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color.split(' ')[2] || '#00e5ff'}, transparent)` }}
          animate={{ opacity: hovered ? 1 : 0.3 }}
        />

        {/* Corner decoration */}
        <div className="absolute top-4 right-4 opacity-10">
          <CircuitBoard size={48} style={{ color: color.split(' ')[2] || '#00e5ff' }} />
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-5 inline-flex p-3 rounded-2xl" style={{ background: `${color.split(' ')[2] || '#00e5ff'}15` }}>
            <Icon size={24} style={{ color: color.split(' ')[2] || '#00e5ff' }} />
          </div>

          <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>

          {/* Features */}
          <ul className="space-y-2">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color.split(' ')[2] || '#00e5ff' }} />
                {f}
              </li>
            ))}
          </ul>

          {/* Bottom row */}
          <motion.div
            className="flex items-center gap-2 mt-7 text-xs font-semibold"
            style={{ color: color.split(' ')[2] || '#00e5ff' }}
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            Explore solution <ArrowRight size={13} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   INDUSTRY TARGET ROW
───────────────────────────────────────────── */
const industries = [
  { icon: Package, label: 'Logistics & Supply Chain', pain: 'Spreadsheet-tracked shipments → AI demand forecasting' },
  { icon: Building2, label: 'Real Estate Agencies', pain: 'Fragmented lead data → Unified AI CRM pipeline' },
  { icon: Users, label: 'Professional Services', pain: 'Manual admin burden → Automated document intelligence' },
  { icon: Cpu, label: 'Manufacturing Firms', pain: 'Manual QC reporting → Real-time defect detection' },
  { icon: DollarSign, label: 'Finance & CA Firms', pain: 'Repetitive compliance work → AI audit assistant' },
  { icon: Network, label: 'HR & People Ops', pain: 'Slow hiring pipelines → Intelligent applicant screening' },
];

/* ─────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────── */
export default function AiPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -80]);

  const [activeTab, setActiveTab] = useState(0);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(s => (s + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const products = [
    {
      icon: BarChart3,
      title: 'AI Operations Dashboard',
      description: 'Replace your Monday morning reporting grind. A live intelligence hub that aggregates your data, surfaces anomalies, and delivers executive-ready insights automatically every Sunday night.',
      features: [
        'Real-time KPI monitoring with anomaly alerts',
        'Natural language query — "show me this week vs last"',
        'Auto-generated weekly PDF reports',
        'Integrates with your existing ERP/CRM/sheets',
      ],
      color: 'linear-gradient(135deg, #006ec7, #0a4f96)',
    },
    {
      icon: Bot,
      title: 'Internal Knowledge Assistant',
      description: 'An AI that knows your entire company — SOPs, policies, product specs, past projects. Your team stops hunting through folders and starts getting answers in seconds.',
      features: [
        'Trained on your private documents & wikis',
        'RAG-powered — always cites the source',
        'Slack/Teams/web chat integration',
        'Role-based access & audit logs',
      ],
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    {
      icon: Workflow,
      title: 'Workflow Automation Engine',
      description: 'Map your most repetitive human workflows — invoice processing, lead qualification, compliance checks — and let an intelligent agent handle them end-to-end.',
      features: [
        'Visual workflow builder for non-technical staff',
        'Multi-step agent with approval gates',
        'Email, WhatsApp, ERP trigger support',
        'Full audit trail & rollback capability',
      ],
      color: 'linear-gradient(135deg, #006ec7, #0284c7)',
    },
    {
      icon: FileText,
      title: 'Document Intelligence Suite',
      description: 'Stop manually reading contracts, invoices, and compliance documents. AI extracts, validates, and routes information — cutting document processing time by 90%.',
      features: [
        'OCR + LLM extraction pipeline',
        'Contract clause analysis & red-flag detection',
        'Invoice reconciliation automation',
        'Searchable archive with semantic search',
      ],
      color: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics Engine',
      description: 'Move from hindsight to foresight. Demand forecasting, churn prediction, inventory optimisation — trained on your historical data, running in production.',
      features: [
        'Demand sensing & inventory forecasting',
        'Customer churn probability scores',
        'Revenue pipeline prediction',
        'Explainable AI — never a black box',
      ],
      color: 'linear-gradient(135deg, #006ec7, #1d4ed8)',
    },
    {
      icon: MessageSquare,
      title: 'Customer Intelligence Layer',
      description: 'Understand every customer interaction at scale. Sentiment analysis, intent detection, and auto-routing ensure no lead falls through the cracks.',
      features: [
        'Multi-channel sentiment analysis',
        'Lead scoring & intent classification',
        'Automated escalation routing',
        'Voice of customer trend reports',
      ],
      color: 'linear-gradient(135deg, #f59e0b, #ea580c)',
    },
  ];

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --brand: #006ec7;
          --amber: #f59e0b;
          --dark: var(--bg);
          --dark2: var(--surface);
          --dark3: var(--surface-2);
        }

        * { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body { background: var(--bg); color: var(--text); overflow-x: hidden; }

        .ai-page {
          background: var(--dark);
          min-height: 100vh;
          position: relative;
          font-family: 'Sora', sans-serif;
        }

        /* Scanline effect */
        .scanline::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,229,255,0.015) 2px,
            rgba(0,229,255,0.015) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #f59e0b 50%, #006ec7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow-blue { box-shadow: 0 0 30px rgba(0,110,199,0.5), 0 0 60px rgba(0,110,199,0.2); }
        .glow-amber { box-shadow: 0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.1); }

        .btn-ai {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          border-radius: 12px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          outline: none;
        }

        .btn-ai-primary {
          background: linear-gradient(135deg, #006ec7, #0a4f96);
          color: #fff;
          box-shadow: 0 0 20px rgba(0,110,199,0.35);
        }
        .btn-ai-primary:hover {
          box-shadow: 0 0 40px rgba(0,110,199,0.55);
          transform: translateY(-2px);
        }

        .btn-ai-ghost {
          background: transparent;
          color: #f59e0b;
          border: 1px solid rgba(245,158,11,0.35);
        }
        .btn-ai-ghost:hover {
          background: rgba(245,158,11,0.06);
          border-color: rgba(245,158,11,0.65);
          box-shadow: 0 0 20px rgba(245,158,11,0.15);
          transform: translateY(-2px);
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,110,199,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,110,199,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .hex-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zM28 100L0 84V50l28-16 28 16v34L28 100z' fill='none' stroke='rgba(0,110,199,0.05)' stroke-width='1'/%3E%3C/svg%3E");
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes data-stream {
          0% { transform: translateY(100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-2 { animation: float 8s ease-in-out infinite 2s; }

        /* Tab styles */
        .tab-btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid transparent;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
        }
        .tab-btn.active {
          background: rgba(0,110,199,0.12);
          border-color: rgba(0,110,199,0.4);
          color: #006ec7;
        }
        .tab-btn:not(.active) {
          color: #64748b;
          border-color: rgba(255,255,255,0.05);
        }
        .tab-btn:not(.active):hover {
          color: #94a3b8;
          border-color: rgba(255,255,255,0.1);
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #04080f; }
        ::-webkit-scrollbar-thumb { background: #006ec7; border-radius: 2px; }
      `}</style>

      <div className="ai-page theme-adapt" ref={containerRef}>

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#04080f]/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 shrink-0">
            <Image
                src="/aetherai.png"
                alt="AetherSolve logo"
                fill
                sizes="36px"
                className="object-contain"
                priority
            />

            </div>
              <div>
                <span className="font-black text-white text-sm tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  Aether<span style={{ color: '#f59e0b' }}>AI</span>
                </span>
                <div className="text-[9px] text-slate-500 tracking-widest uppercase leading-none">by AetherSolve</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {['Products', 'Industries', 'ROI', 'Retainer'].map((item, i) => (
                <a key={i} href={`#${item.toLowerCase()}`}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors px-4 py-2 rounded-lg hover:bg-white/5 font-medium">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="btn-ai btn-ai-ghost text-xs px-4 py-2.5">
                  <ArrowLeft size={13} /> Back
                </button>
              </Link>
              <Link href="/#contact">
                <button className="btn-ai btn-ai-primary text-xs px-5 py-2.5">
                  <Sparkles size={13} /> Get Started
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg scanline" ref={heroRef}>
          <ParticleField />

          {/* Ambient glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,110,199,0.12)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,158,11,0.06)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(0,110,199,0.05)' }} />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 max-w-5xl mx-auto px-4 text-center"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-600/25 bg-blue-600/8 mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#006ec7' }} />
              <span className="text-xs font-mono tracking-widest" style={{ color: '#006ec7' }}>AI SYSTEMS ONLINE — AETHERSOLVE INTELLIGENCE DIVISION</span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-8xl font-black leading-none mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              <span className="gradient-text">AI-POWERED</span>
              <br />
              <span className="text-white/90">INTERNAL</span>
              <br />
              <span className="text-white/60">TOOLS</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            >
              We build bespoke AI systems — dashboards, automation agents, and intelligence layers —
              trained on your data, running inside your business.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-slate-500 text-sm mb-10 font-mono"
            >
              Not generic SaaS. Not off-the-shelf. <span style={{ color: '#f59e0b' }}>Yours.</span>
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/#contact">
                <button className="btn-ai btn-ai-primary">
                  <Zap size={15} /> Build My AI System
                </button>
              </Link>
              <a href="#products">
                <button className="btn-ai btn-ai-ghost">
                  <Eye size={15} /> See What We Build
                </button>
              </a>
            </motion.div>

            {/* Terminal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="absolute inset-0 rounded-2xl blur-xl pointer-events-none" style={{ background: 'rgba(0,110,199,0.12)' }} />
              <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1a]/90 backdrop-blur-sm overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="text-slate-500 text-xs font-mono ml-2">aethersolve@ai-engine ~ %</span>
                </div>
                <div className="p-5">
                  <TerminalLine
                    lines={[
                      'initializing AetherAI core engine...',
                      'loading client data schemas → done',
                      'training on 847 internal documents → done',
                      'deploying custom dashboard ops layer...',
                      'system ready. ROI projection: ₹18L/yr saved',
                    ]}
                    delay={1200}
                  />
                </div>
              </div>
            </motion.div>

            {/* Scroll cue */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-12 flex flex-col items-center gap-2 text-slate-500"
            >
              <span className="text-xs font-mono tracking-widest">SCROLL TO EXPLORE</span>
              <ChevronDown size={16} />
            </motion.div>
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 hex-pattern opacity-50" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: '40–50%', label: 'Ops Cost Reduction', icon: TrendingUp, color: '#f59e0b' },
                { value: '78%', label: 'Orgs using AI in 2026', icon: Activity, color: '#006ec7' },
                { value: '<18%', label: 'Measure true ROI*', icon: BarChart3, color: '#f59e0b' },
                { value: '150+', label: 'Projects Delivered', icon: Shield, color: '#006ec7' },
              ].map((s, i) => (
                <StatCard key={i} {...s} />
              ))}
            </div>
            <p className="text-center text-slate-600 text-xs font-mono mt-4">
              *McKinsey 2026 AI adoption report — that gap is your opportunity
            </p>
          </div>
        </section>

        {/* ── THE GAP ── */}
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <Terminal size={12} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-mono tracking-widest">THE INTELLIGENCE GAP</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                They Know. <span style={{ color: '#006ec7' }}>You Build.</span>
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                78% of organisations use AI — but most use generic off-the-shelf tools
                that don't fit their workflows. The frontier has shifted to
                <span className="text-white font-semibold"> integrated AI ecosystems</span> built on proprietary data.
              </p>
            </motion.div>

            {/* Three columns comparison */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: 'Generic SaaS AI',
                  icon: '✕',
                  color: '#ffffff40',
                  items: ['One-size-fits-all logic', 'Your data leaves your servers', 'Per-seat pricing forever', 'No institutional knowledge', 'No customisation'],
                },
                {
                  label: 'AetherSolve AI',
                  icon: '✓',
                  color: '#006ec7',
                  items: ['Trained on your exact data', 'Runs on your infrastructure', 'One-time build + retainer', 'Knows your business rules', 'Fully extensible'],
                  highlight: true,
                },
                {
                  label: 'Building In-house',
                  icon: '~',
                  color: '#f59e0b',
                  items: ['6–18 month timeline', 'Full-time ML engineer salary', 'Infrastructure overhead', 'Maintenance burden', 'No domain expertise'],
                },
              ].map((col, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className={`relative rounded-2xl border p-6 ${col.highlight
                    ? 'border-blue-600/40 bg-blue-600/5'
                    : 'border-white/8 bg-white/[0.02]'}`}
                >
                  {col.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-black tracking-wide" style={{ background: '#006ec7' }}>
                      RECOMMENDED
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
                      style={{ background: `${col.color}20`, color: col.color }}
                    >
                      {col.icon}
                    </div>
                    <span className="font-bold text-white text-sm">{col.label}</span>
                  </div>
                  <ul className="space-y-3">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                        <span style={{ color: col.color }} className="text-base leading-none mt-0.5">
                          {col.icon}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCTS ── */}
        <section id="products" className="py-24 relative grid-bg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#04080f]/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-4">
                <Cpu size={12} style={{ color: '#006ec7' }} />
                <span className="text-xs font-mono tracking-widest" style={{ color: '#006ec7' }}>AI PRODUCT CATALOGUE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                What We <span className="gradient-text">Actually Build</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Six production-ready AI product categories. Every build is bespoke — your workflows, your data, your infrastructure.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <ProductCard key={i} {...p} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ROI CALCULATOR SECTION ── */}
        <section id="roi" className="py-24 relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-blue-600/4 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: pitch */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
                  <DollarSign size={12} style={{ color: '#006ec7' }} />
                  <span className="text-xs font-mono tracking-widest" style={{ color: '#006ec7' }}>THE BUSINESS CASE</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  The Pitch That<br /><span style={{ color: '#f59e0b' }}>Closes Itself</span>
                </h2>
                <div className="rounded-2xl border border-white/10 bg-[#080d14] p-6 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent" />
                  <p className="text-slate-300 text-sm leading-8 font-mono">
                    <span className="text-slate-500">// real conversation</span><br />
                    "Your team spends <span style={{ color: '#006ec7' }} className="font-bold">8 hours/week</span> pulling Monday reports.<br />
                    That's <span style={{ color: '#006ec7' }} className="font-bold">400 hours/year</span> — roughly{' '}
                    <span style={{ color: '#f59e0b' }} className="font-bold">₹6L in wasted time</span> annually.<br /><br />
                    We build a system that does it in{' '}
                    <span style={{ color: '#f59e0b' }} className="font-bold">2 minutes</span>, every Sunday night, automatically.<br /><br />
                    Project cost: <span style={{ color: '#006ec7' }} className="font-bold">₹2L</span>."
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-slate-400 text-xs font-mono">That conversation closes itself.</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </motion.div>

              {/* Right: ROI visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                {[
                  { label: 'Ops cost reduction', value: '40–50%', bar: 45, color: '#006ec7' },
                  { label: 'Decision cycle speed', value: 'Weeks → Minutes', bar: 90, color: '#f59e0b' },
                  { label: 'Report generation time', value: '−95%', bar: 95, color: '#006ec7' },
                  { label: 'Client retention after AI', value: '98%', bar: 98, color: '#f59e0b' },
                  { label: 'Avg annual time saved', value: '400+ hrs', bar: 75, color: '#006ec7' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                    className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <span className="text-xs font-black" style={{ color: item.color, fontFamily: "'Orbitron', sans-serif" }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.bar}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: item.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── RETAINER ── */}
        <section id="retainer" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl border border-white/10 overflow-hidden"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#04080f] to-amber-900/10" />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

              <div className="relative z-10 p-10 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                      <Clock size={12} className="text-amber-400" />
                      <span className="text-xs text-amber-400 font-mono tracking-widest">RECURRING REVENUE ENGINE</span>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                      The Retainer<br /><span style={{ color: '#f59e0b' }}>Model</span>
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-6">
                      AI systems need ongoing care — LLM API updates, evolving data schemas, new automations.
                      After the initial build, we offer a retainer that keeps your system current and growing.
                    </p>
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                      <div className="text-3xl font-black mb-1" style={{ color: '#f59e0b', fontFamily: "'Orbitron', sans-serif" }}>
                        ₹25K–60K<span className="text-lg text-slate-400 font-normal">/mo</span>
                      </div>
                      <div className="text-slate-400 text-sm">per retainer client — monitoring, updates + 1 new feature/month</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs text-slate-500 font-mono mb-2 uppercase tracking-widest">3 Retainer Clients =</div>
                    {[
                      { label: 'Minimum baseline', value: '₹75K/mo', sub: '3 × ₹25K' },
                      { label: 'Comfortable baseline', value: '₹1.2L/mo', sub: '3 × ₹40K' },
                      { label: 'Premium baseline', value: '₹1.8L/mo', sub: '3 × ₹60K' },
                    ].map((tier, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/[0.02]">
                        <div>
                          <div className="text-white text-sm font-semibold">{tier.label}</div>
                          <div className="text-slate-500 text-xs">{tier.sub}</div>
                        </div>
                        <div className="text-xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                          {tier.value}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-slate-500 font-mono pt-2">
                      + new project work on top of this stable baseline
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── INDUSTRIES ── */}
        <section id="industries" className="py-24 relative hex-pattern">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                <Building2 size={12} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-mono tracking-widest">TARGET INDUSTRIES</span>
              </div>
              <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Who We Target <span style={{ color: '#f59e0b' }}>First</span>
              </h2>
              <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm">
                Mid-size businesses (20–200 staff) where the decision-maker feels the operational pain directly.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {industries.map(({ icon: Icon, label, pain }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="group relative rounded-2xl border border-white/8 bg-[#080d14] p-5
                    hover:border-blue-600/25 transition-colors duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/4 group-hover:to-transparent transition-all duration-500" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-amber-400/10 group-hover:bg-amber-400/15 transition-colors flex-shrink-0">
                      <Icon size={18} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold mb-1">{label}</div>
                      <div className="text-slate-500 text-xs leading-relaxed">{pain}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OVERVIEW TICKER ── */}
        <div className="py-8 border-y border-white/5 overflow-hidden bg-[#04080f]/80 backdrop-blur-sm">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {[...Array(3)].map((_, k) =>
              ['AI Dashboard Ops', '₹2L Build / ₹6L Saved', 'LangChain + LlamaIndex', 'RAG Pipelines', 'GPT-4o + Claude 3.5',
                'Your Data. Your Servers.', '40–50% Cost Reduction', 'Bhilai → India-wide', '150+ Projects Delivered', 'Retainer from ₹25K/mo']
                .map((item, i) => (
                  <span key={`${k}-${i}`} className="text-xs font-mono tracking-widest text-slate-500 flex items-center gap-3">
                    <span style={{ color: '#f59e0b' }}>◆</span> {item}
                  </span>
                ))
            )}
          </motion.div>
        </div>

        {/* ── FINAL CTA ── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,110,199,0.12) 0%, transparent 70%)' }} />

          {/* Pulse rings */}
          {[1, 2, 3].map(i => (
            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: `${200 + i * 150}px`,
                height: `${200 + i * 150}px`,
                border: `1px solid rgba(0,110,199,0.12)`,
                animation: `pulse-ring ${2 + i * 0.5}s ease-out infinite ${i * 0.5}s`,
              }}
            />
          ))}

          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Central AI icon */}
              <div className="float-anim inline-flex mb-8">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center glow-blue" style={{ background: 'linear-gradient(135deg, #006ec7, #0a4f96)' }}>
                  <Brain size={36} className="text-white" />
                </div>
              </div>

              <h2 className="text-5xl sm:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                READY TO<br /><span className="gradient-text">OPERATIONALIZE</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
                Tell us your biggest operational pain point. We'll show you exactly what we'd build,
                how long it takes, and the ROI you can expect in year one.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/#contact">
                  <button className="btn-ai btn-ai-primary text-base px-8 py-4">
                    <Sparkles size={16} /> Start the Conversation
                  </button>
                </Link>
                <Link href="/company/work">
                  <button className="btn-ai btn-ai-ghost text-base px-8 py-4">
                    <Eye size={16} /> See Case Studies
                  </button>
                </Link>
              </div>
              <p className="text-slate-600 text-xs font-mono mt-6">
                Based in Bhilai, Chhattisgarh · Serving India-wide · hello@aethersolve.com
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#020509] py-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-600 font-mono">
            <span>© {new Date().getFullYear()} AetherSolve Technologies Pvt. Ltd.</span>
            <span className="hidden sm:block text-slate-700">·</span>
            <Link href="/" className="hover:text-amber-400 transition-colors" style={{ color: 'rgba(245,158,11,0.5)' }}>← Back to Main Site</Link>
            <span className="hidden sm:block text-slate-700">·</span>
            <span>AI Division — Internal Tools & Automation</span>
          </div>
        </footer>
      </div>
    </>
  );
}
