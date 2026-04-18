'use client';
// src/app/products/page.js
// AetherSolve Product Hub — Google Labs-style product listing page
// Fully responsive: mobile, tablet, desktop
// Uses globals.css CSS variables throughout

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, X, ChevronRight,
  Clock, Sparkles, BookOpen, Cloud,
  BarChart3, Cpu, Rocket, CheckCircle,
  ExternalLink, Zap, Shield,
} from 'lucide-react';

/* ─── FONTS ─────────────────────────────────────────────────── */
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=Manrope:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap';

/* ─── SCROLL REVEAL HOOK ─────────────────────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return [ref, vis];
}
function R({ children, delay = 0, style = {}, tag = 'div' }) {
  const [ref, vis] = useReveal(delay);
  const Tag = tag;
  return (
    <Tag
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity .75s cubic-bezier(.16,1,.3,1), transform .75s cubic-bezier(.16,1,.3,1)`,
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ─── PRODUCT DATA ───────────────────────────────────────────── */
const STATUS_META = {
  live:     { label: 'Live',         bg: 'rgba(16,185,129,.12)',  color: '#10b981', pulse: true  },
  beta:     { label: 'Beta',         bg: 'rgba(139,92,246,.12)', color: '#8b5cf6', pulse: false },
  internal: { label: 'Internal',     bg: 'rgba(245,158,11,.12)', color: '#f59e0b', pulse: false },
  soon:     { label: 'Coming Soon',  bg: 'rgba(136,136,136,.1)', color: '#888888', pulse: false },
};

const PRODUCTS = [
  {
    id: 'timedule',
    name: 'Timedule',
    tagline: 'AI timetable & session manager for students.',
    icon: '⏱',
    color: '#ff5c1a',
    status: 'live',
    tags: ['EdTech', 'AI', 'Productivity'],
    stats: [{ v: '94%', l: 'Goal Rate' }, { v: '2.4×', l: 'Focus Gain' }, { v: '4.8★', l: 'Rating' }],
    url: 'https://timedule.onrender.com',
    description:
      'Timedule is an AI-powered timetable manager that builds, optimises, and adapts your weekly study schedule automatically. It analyses your workload, energy patterns, and deadlines — then generates a conflict-free plan you can actually stick to.',
    longDesc:
      "Forget manual rescheduling. Timedule watches how you study, learns which subjects drain you fastest, and rebuilds your week around your real capacity. With a live session timer, AI-triggered break suggestions, streak tracking, and weekly analytics — it's a complete productivity system, not just a planner.",
    features: [
      { icon: '🧠', title: 'AI Scheduling Engine',   body: 'Auto-generates conflict-free weekly plans based on your subjects, deadlines, and energy curve.' },
      { icon: '⏱', title: 'Live Session Timer',      body: 'Track sessions in real time. AI suggestions trigger at 80% completion to protect your focus.' },
      { icon: '📊', title: 'Weekly Analytics',        body: 'Subject balance charts, streak heatmaps, and deadline proximity views — all in one place.' },
      { icon: '🔔', title: 'Adaptive Reminders',      body: 'Notifications that adapt to your session progress, not just clock time.' },
      { icon: '🎯', title: 'Goal & Deadline Tracker', body: 'Set semester targets and let Timedule back-calculate how many sessions you need daily.' },
    ],
  },
  {
    id: 'aether-ai',
    name: 'Aether.ai',
    tagline: 'AI internal tools built on your business data.',
    icon: '✦',
    color: '#8b5cf6',
    status: 'beta',
    tags: ['AI', 'Automation', 'Enterprise'],
    stats: [{ v: '<2s', l: 'Response' }, { v: '10M+', l: 'Req/Day' }, { v: 'RAG', l: 'Powered' }],
    url: 'https://aethersolve.vercel.app/services/aipage',
    description:
      'Aether.ai turns your existing business data — spreadsheets, PDFs, Tally exports, WhatsApp logs — into a queryable internal AI assistant that actually knows your operations.',
    longDesc:
      "Most AI tools give generic answers. Aether.ai is trained on your actual data: your product catalogue, your customer records, your internal SOPs. Your team asks questions in plain language and gets specific, accurate answers — no IT ticket required.",
    features: [
      { icon: '📄', title: 'RAG Document Engine',      body: 'Ingest PDFs, Excel sheets, and databases. Query them in natural language instantly.' },
      { icon: '💬', title: 'WhatsApp Bot',              body: "Deploy an AI assistant directly into your team's WhatsApp — no app install needed." },
      { icon: '🔗', title: 'CRM & Tally Integration',  body: 'Connects to Tally, custom CRMs, and Google Sheets — reads live data, not stale exports.' },
      { icon: '🔒', title: 'Private & Secure',          body: 'All data stays on your infrastructure. No third-party model training on your business data.' },
      { icon: '📡', title: 'Multi-channel Deploy',      body: 'Web widget, WhatsApp, Slack, or custom API — deploy wherever your team already works.' },
    ],
  },
  {
    id: 'finedge',
    name: 'FinEdge',
    tagline: 'AI-first ERP and financial operations platform.',
    icon: '₹',
    color: '#10b981',
    status: 'live',
    tags: ['FinTech', 'ERP', 'AI'],
    stats: [{ v: '₹12L+', l: 'Processed' }, { v: '847', l: 'SKUs Live' }, { v: '24/7', l: 'Monitoring' }],
    url: 'https://aethersolve.vercel.app/services/erp-crm',
    description:
      'FinEdge is a custom AI-first operations platform built for mid-size Indian businesses — combining HR, payroll, inventory, and sales into one intelligent dashboard that actually runs your business.',
    longDesc:
      'Most ERPs are built for the Fortune 500. FinEdge is built for the businesses that run on Excel and WhatsApp and are ready to level up. AI-generated restocking alerts, automated payroll runs, and a CRM that updates itself from your conversations.',
    features: [
      { icon: '🏭', title: 'Inventory AI',       body: 'Predicts restock needs before you run out. Tracks SKUs across warehouses in real time.' },
      { icon: '💰', title: 'Payroll Automation',  body: 'Process payroll in 3 clicks. Leaves, advances, deductions — all calculated automatically.' },
      { icon: '📈', title: 'Sales Pipeline',      body: 'AI-scored leads, automated follow-up reminders, and revenue forecasting built in.' },
      { icon: '📊', title: 'BI Dashboards',       body: 'Live business intelligence — daily revenue, team performance, margin analysis, all real-time.' },
      { icon: '⚡', title: 'AI Insight Feed',     body: 'Proactive alerts: "Reorder SKU-2847 — stock drops below threshold in 3 days."' },
    ],
  },
  {
    id: 'edupath',
    name: 'EduPath',
    tagline: 'LMS and student portal for institutions.',
    icon: '📚',
    color: '#3b82f6',
    status: 'live',
    tags: ['EdTech', 'LMS', 'SaaS'],
    stats: [{ v: '1K+', l: 'Students' }, { v: '99.9%', l: 'Uptime' }, { v: 'White', l: 'Label' }],
    url: 'https://aethersolve.vercel.app/industries/education',
    description:
      'EduPath is a white-label LMS and student management platform built for coaching institutes, schools, and EdTech startups. Courses, exams, progress tracking, and payments — all in one system.',
    longDesc:
      'Built for Indian institutions that need a real LMS without paying enterprise prices. EduPath handles your entire student lifecycle: enrolment, content delivery, live classes, automated testing, certificates, and fee collection — all from one admin panel.',
    features: [
      { icon: '🎓', title: 'Course & Batch Mgmt',  body: 'Create structured courses, assign batches, track completion per student.' },
      { icon: '📝', title: 'Online Exam Engine',    body: 'MCQ, subjective, and coding tests with auto-grading and result analytics.' },
      { icon: '💳', title: 'Fee & Payment',         body: 'Razorpay integration with instalment support, reminder automation, and receipts.' },
      { icon: '📱', title: 'Student Mobile App',    body: 'Android and iOS app for students — lectures, notes, tests, and notifications.' },
      { icon: '📊', title: 'Analytics Dashboard',   body: 'Attendance rates, subject performance, dropout risk flags — all in one view.' },
    ],
  },
  {
    id: 'cloudops',
    name: 'CloudOps',
    tagline: 'Managed cloud infrastructure with live monitoring.',
    icon: '☁',
    color: '#f59e0b',
    status: 'internal',
    tags: ['Infrastructure', 'DevOps', 'AWS'],
    stats: [{ v: '99.97%', l: 'Uptime' }, { v: '<120ms', l: 'Response' }, { v: '2.3K', l: 'Req/s' }],
    url: 'https://aethersolve.vercel.app/services/cloud-hosting',
    description:
      "CloudOps Console is AetherSolve's internal infrastructure management platform — powering all products and client deployments on AWS and GCP with automated scaling, CI/CD, and live monitoring.",
    longDesc:
      'Every system we build gets hosted here. Auto-scaling clusters, zero-downtime deployments, nightly backups, and a 24/7 alert system that pages our team before clients even notice an issue. Now available as a managed service for AetherSolve clients.',
    features: [
      { icon: '⚖️', title: 'Auto-Scaling',     body: 'Traffic spikes? The cluster scales up automatically and scales back down to save cost.' },
      { icon: '🔄', title: 'CI/CD Pipelines',  body: 'Push to GitHub → staging deploy → auto-test → production. Zero manual steps.' },
      { icon: '📡', title: 'Live Monitoring',   body: 'API gateway, DB cluster, CDN — all monitored with <1min alert response time.' },
      { icon: '💾', title: 'Daily Backups',     body: 'Encrypted nightly snapshots with point-in-time recovery for all databases.' },
      { icon: '🔒', title: 'Security',          body: 'VPC isolation, IAM roles, WAF, and SSL everywhere by default.' },
    ],
  },
  {
    id: 'coming',
    name: 'More Soon',
    tagline: 'Three new products in active development.',
    icon: '🚀',
    color: '#888888',
    status: 'soon',
    tags: ['HealthTech', 'Mobile', 'Analytics'],
    stats: [{ v: '3+', l: 'In Pipeline' }, { v: 'Q3 \'26', l: 'Launch Est.' }, { v: 'Beta', l: 'Access Open' }],
    url: null,
    description:
      'AetherSolve has three products currently in active development across HealthTech, mobile productivity, and analytics. Early access and beta spots are available for interested teams.',
    longDesc:
      "We're building a patient management system for clinics, a mobile-first team task manager, and a no-code analytics dashboard builder. If you're interested in early access or partnership, reach out.",
    features: [
      { icon: '🏥', title: 'ClinicOS (HealthTech)',      body: 'Patient records, appointment booking, billing, and prescription management for small clinics.' },
      { icon: '✅', title: 'TeamBoard (Productivity)',   body: 'Mobile-first kanban and task manager with WhatsApp-based task assignment.' },
      { icon: '📊', title: 'DataLens (Analytics)',       body: 'No-code dashboard builder that connects to any database or spreadsheet.' },
    ],
  },
];

/* ─── PRODUCT CARD ───────────────────────────────────────────── */
function ProductCard({ product, index, onClick }) {
  const [hov, setHov] = useState(false);
  const sm = STATUS_META[product.status];

  return (
    <R delay={index * 70}>
      <div
        onClick={() => onClick(product)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'relative',
          background: 'var(--card-bg)',
          border: `1px solid ${hov ? 'var(--border-2)' : 'var(--card-border)'}`,
          borderRadius: '20px',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all .3s cubic-bezier(.16,1,.3,1)',
          transform: hov ? 'translateY(-6px)' : 'none',
          boxShadow: hov ? '0 24px 60px rgba(0,0,0,.5)' : 'var(--card-shadow)',
        }}
      >
        {/* top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: product.color,
          opacity: hov ? 1 : 0,
          transition: 'opacity .3s',
        }} />

        {/* status badge */}
        <div style={{
          position: 'absolute', top: '16px', right: '16px',
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px', borderRadius: '100px',
          background: sm.bg, color: sm.color,
          fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          <div style={{
            width: '5px', height: '5px', borderRadius: '50%', background: sm.color,
            animation: sm.pulse ? 'pulse 2s infinite' : 'none',
          }} />
          {sm.label}
        </div>

        {/* card body */}
        <div style={{ padding: '22px 22px 0' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `${product.color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', marginBottom: '16px', marginTop: '8px',
          }}>
            {product.icon}
          </div>
          <div style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '19px',
            color: 'var(--text)', letterSpacing: '-0.4px', marginBottom: '7px',
          }}>
            {product.name}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '16px' }}>
            {product.tagline}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {product.tags.map(t => (
              <span key={t} style={{
                padding: '3px 10px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 700,
                background: `${product.color}14`, color: product.color,
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* card footer */}
        <div style={{
          padding: '14px 22px', marginTop: 'auto',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: '18px' }}>
            {product.stats.slice(0, 2).map(s => (
              <div key={s.l}>
                <span style={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '15px', color: 'var(--text)',
                }}>{s.v} </span>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.l}</span>
              </div>
            ))}
          </div>
          <div style={{
            fontSize: '16px', color: 'var(--text-3)',
            transition: 'all .25s',
            opacity: hov ? 1 : 0.5,
            transform: hov ? 'translate(2px,-2px)' : 'none',
          }}>↗</div>
        </div>
      </div>
    </R>
  );
}

/* ─── DETAIL PANEL ───────────────────────────────────────────── */
function DetailPanel({ product, onClose }) {
  const sm = product ? STATUS_META[product.status] : null;

  // Lock body scroll when open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(6px)',
          opacity: product ? 1 : 0,
          transition: 'opacity .3s',
          pointerEvents: product ? 'all' : 'none',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(620px, 100vw)',
        background: 'var(--bg-2)',
        borderLeft: '1px solid var(--border-2)',
        zIndex: 101,
        transform: product ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .4s cubic-bezier(.16,1,.3,1)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {product && (
          <>
            {/* Panel Header */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              background: 'rgba(17,17,17,.96)', backdropFilter: 'blur(16px)',
              borderBottom: '1px solid var(--border)',
              padding: '14px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9px',
                  background: `${product.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>{product.icon}</div>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '15px', color: 'var(--text)' }}>{product.name}</span>
                <span style={{
                  fontSize: '9px', fontWeight: 700, padding: '2px 8px',
                  borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: sm.bg, color: sm.color,
                }}>{sm.label}</span>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  border: '1px solid var(--border-2)', background: 'transparent',
                  cursor: 'pointer', color: 'var(--text-3)', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}
              >✕</button>
            </div>

            {/* Panel Body */}
            <div style={{ padding: '24px 22px', flex: 1 }}>
              {/* Hero block */}
              <div style={{
                borderRadius: '16px', padding: '24px',
                background: `${product.color}0d`,
                border: `1px solid ${product.color}20`,
                marginBottom: '22px',
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: `${product.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', marginBottom: '16px',
                }}>{product.icon}</div>
                <div style={{
                  fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(26px,5vw,34px)',
                  letterSpacing: '-1px', color: 'var(--text)', lineHeight: 1, marginBottom: '10px',
                }}>{product.name}</div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-3)', lineHeight: 1.75 }}>{product.description}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '100px', marginTop: '14px',
                  background: sm.bg, color: sm.color,
                  fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sm.color }} />
                  {sm.label}
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '22px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-4)', display: 'block', marginBottom: '10px' }}>Overview</span>
                <p style={{ fontSize: '14px', lineHeight: 1.85, color: 'var(--text-2)', fontFamily: "'Manrope',sans-serif" }}>{product.longDesc}</p>
              </div>

              {/* Stats */}
              <div style={{ marginBottom: '22px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-4)', display: 'block', marginBottom: '10px' }}>Key Metrics</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
                  {product.stats.map(s => (
                    <div key={s.l} style={{
                      padding: '14px 12px', borderRadius: '12px',
                      background: 'var(--bg-3)', border: '1px solid var(--border)', textAlign: 'center',
                    }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '20px', color: product.color, letterSpacing: '-0.5px' }}>{s.v}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '4px' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-4)', display: 'block', marginBottom: '10px' }}>What It Does</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {product.features.map(f => (
                    <div key={f.title} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px',
                      padding: '12px 14px', borderRadius: '12px',
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        background: `${product.color}15`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', flexShrink: 0,
                      }}>{f.icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text)', marginBottom: '3px', fontFamily: "'Outfit',sans-serif" }}>{f.title}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-3)', lineHeight: 1.65 }}>{f.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel CTA */}
            <div style={{ padding: '16px 22px 28px', borderTop: '1px solid var(--border)' }}>
              {product.url ? (
                <>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      width: '100%', padding: '14px', borderRadius: '14px',
                      background: 'var(--accent)', color: '#fff',
                      fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '14px',
                      textDecoration: 'none', border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,92,26,.3)', transition: 'all .2s',
                    }}
                  >
                    Open {product.name} <ArrowUpRight size={16} />
                  </a>
                  <a
                    href="https://aethersolve.vercel.app/#contact"
                    style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', padding: '8px' }}
                  >
                    Talk to us about this product
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="https://aethersolve.vercel.app/#contact"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      width: '100%', padding: '14px', borderRadius: '14px',
                      background: 'var(--accent)', color: '#fff',
                      fontFamily: "'Manrope',sans-serif", fontWeight: 700, fontSize: '14px',
                      textDecoration: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 24px rgba(255,92,26,.3)',
                    }}
                  >
                    Request Early Access
                  </a>
                  <a
                    href="mailto:hello@aethersolve.com"
                    style={{ display: 'block', textAlign: 'center', marginTop: '10px', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', padding: '8px' }}
                  >
                    hello@aethersolve.com
                  </a>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ─── TICKER ─────────────────────────────────────────────────── */
function Ticker() {
  const items = ['Smart Scheduling', 'AI Automation', 'EdTech LMS', 'ERP Systems', 'Cloud Hosting', 'RAG Pipelines', 'Mobile Apps', 'Live Analytics', 'WhatsApp Bots', 'Managed Infra'];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'ticker 32s linear infinite' }}>
        {doubled.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 26px', whiteSpace: 'nowrap' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Manrope',sans-serif", fontSize: '12.5px', fontWeight: 600, color: 'var(--text-3)' }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState(null);
  const handleOpen  = useCallback((p) => setActiveProduct(p), []);
  const handleClose = useCallback(() => setActiveProduct(null), []);

  return (
    <>
      <style>{`
        @import url('${FONT_URL}');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 2px; }

        /* Keyframes */
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spinSlow  { to{transform:rotate(360deg)} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 28px rgba(255,92,26,0.15)} 50%{box-shadow:0 0 56px rgba(255,92,26,0.35)} }

        .shimmer-text {
          background: linear-gradient(90deg, var(--text) 0%, var(--accent) 40%, var(--text) 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .spin-slow  { animation: spinSlow 22s linear infinite; }
        .float-icon { animation: float 4s ease-in-out infinite; }
        .glow-btn   { animation: glowPulse 3s ease-in-out infinite; }
        .dot-live   { animation: pulse 2s infinite; }

        /* Dot grid background */
        .dot-grid {
          background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        /* ─── RESPONSIVE GRID ─── */

        /* Product grid: 3 cols desktop */
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        /* About grid: 2 cols desktop */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        /* Stats bar */
        .stats-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }

        /* Tablet: ≤900px */
        @media (max-width: 900px) {
          .prod-grid { grid-template-columns: repeat(2, 1fr); }
          .about-grid { grid-template-columns: 1fr; gap: 32px; }
          .hide-tablet { display: none !important; }
          .hero-title { font-size: clamp(42px,9vw,72px) !important; }
        }

        /* Mobile: ≤600px */
        @media (max-width: 600px) {
          .prod-grid { grid-template-columns: 1fr; }
          .stats-bar { gap: 0; }
          .stat-sep { display: none !important; }
          .hero-title { font-size: clamp(38px,11vw,58px) !important; line-height: .92 !important; }
          .hero-sub   { font-size: 14px !important; }
          .hero-pills { gap: 6px !important; }
          .pill-item  { padding: 4px 10px !important; font-size: 11px !important; }
          .section-pad { padding: 56px 18px !important; }
          .nav-inner  { padding: 0 18px !important; }
          .nav-hide   { display: none !important; }
          .about-big  { font-size: clamp(28px,8vw,40px) !important; }
          .hero-pad   { padding: 68px 18px 52px !important; }
        }
      `}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Manrope',sans-serif" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--navbar-bg)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="nav-inner" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/newaether.png" alt="AetherSolve" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--text)', letterSpacing: '-0.5px' }}>
              AetherSolve
            </span>
             <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="nav-hide">Labs</span>
          </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/" className="nav-hide" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none', padding: '6px 12px', borderRadius: '8px' }}>← Home</Link>
              <a href="https://aethersolve.vercel.app/#contact" className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '12.5px' }}>
                Get In Touch
              </a>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="dot-grid hero-pad" style={{ position: 'relative', overflow: 'hidden', padding: '90px 24px 70px', textAlign: 'center' }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '620px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.09) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, right: '5%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Orbit (hidden on mobile via CSS would also work, but we use a simple check) */}
          <div className="spin-slow hide-tablet" style={{ position: 'absolute', top: '40px', right: '7%', opacity: .1, pointerEvents: 'none', width: '150px', height: '150px' }}>
            <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
              <circle cx="75" cy="75" r="73" stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 4" />
              <circle cx="75" cy="2" r="7" fill="var(--accent)" />
            </svg>
          </div>

          <div style={{ maxWidth: '740px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px', borderRadius: '100px',
              background: 'var(--accent-soft)', border: '1px solid var(--accent-soft2)',
              marginBottom: '24px', animation: 'fadeUp .7s ease both',
            }}>
              <div className="dot-live" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Manrope',sans-serif" }}>
                AetherSolve Product Lab · Bhilai, India
              </span>
            </div>

            <h1
              className="hero-title"
              style={{
                fontFamily: "'Outfit',sans-serif", fontWeight: 900,
                fontSize: 'clamp(48px,9vw,100px)',
                lineHeight: .92, letterSpacing: '-0.04em',
                color: 'var(--text)', marginBottom: '22px',
                animation: 'fadeUp .75s ease .1s both',
              }}
            >
              Built for the<br />
              <span className="shimmer-text">real world.</span>
            </h1>

            <p
              className="hero-sub"
              style={{
                fontSize: 'clamp(14px,1.6vw,17px)', lineHeight: 1.8, color: 'var(--text-3)',
                maxWidth: '520px', margin: '0 auto 32px',
                animation: 'fadeUp .75s ease .2s both',
              }}
            >
              Products from AetherSolve that solve real problems — for students, teams, and businesses. Each one built, hosted, and maintained by us.
            </p>

            <div className="hero-pills" style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', animation: 'fadeUp .75s ease .3s both' }}>
              {[['✦', 'Free to explore'], ['✦', 'AI-native'], ['✦', 'Made in India'], ['✦', 'Actively maintained']].map(([ic, txt]) => (
                <div key={txt} className="pill-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 13px', borderRadius: '100px', background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-3)' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '10px' }}>{ic}</span> {txt}
                </div>
              ))}
            </div>
          </div>
        </section>

       

        {/* ── TICKER ── */}
        <Ticker />

        {/* ── PRODUCTS SECTION ── */}
        <section className="section-pad" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <R>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '12px' }}>Our Products</span>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,46px)', letterSpacing: '-1.2px', color: 'var(--text)', lineHeight: 1.05, marginBottom: '10px' }}>
                Every product ships<br />with a purpose.
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-3)', maxWidth: '420px' }}>
                Tap any card to explore the full product — what it does, how it works, and how to access it.
              </p>
            </R>

            <div className="prod-grid">
              {PRODUCTS.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={handleOpen} />
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT STRIP ── */}
        <section style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="about-grid">
              {/* Left */}
              <R>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: '12px' }}>About AetherSolve</span>
                <div className="about-big" style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 'clamp(30px,4vw,50px)', letterSpacing: '-1.5px', color: 'var(--text)', lineHeight: 1, marginBottom: '18px' }}>
                  Software that<br /><span className="shimmer-text">compounds.</span>
                </div>
                <p style={{ fontSize: '13.5px', lineHeight: 1.85, color: 'var(--text-3)', marginBottom: '22px', maxWidth: '440px' }}>
                  AetherSolve builds digital infrastructure for mid-size businesses and student-facing products that actually get used. Based in Bhilai, Chhattisgarh — building for India and beyond.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a href="https://aethersolve.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>
                    Visit AetherSolve ↗
                  </a>
                  <a href="mailto:hello@aethersolve.com" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', borderRadius: '100px', border: '1.5px solid var(--border-2)', fontSize: '13px', fontWeight: 600, color: 'var(--text-3)', textDecoration: 'none' }}>
                    hello@aethersolve.com
                  </a>
                </div>
              </R>

              {/* Right */}
              <R delay={100}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: '🏗️', title: 'We Build It',  body: 'Custom software scoped to your exact workflow, from pixel to production.' },
                    { icon: '☁️', title: 'We Host It',   body: 'AWS/GCP infrastructure with 99.9% uptime SLA — no DevOps overhead for you.' },
                    { icon: '🤖', title: 'We Add AI',    body: 'LLM-powered features, RAG pipelines, and workflow bots built on your actual data.' },
                    { icon: '📈', title: 'We Grow It',   body: 'New modules, features, and integrations added as your business scales.' },
                  ].map(card => (
                    <div key={card.title} style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '16px 18px', borderRadius: '14px',
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                    }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                        background: 'var(--accent-soft)', border: '1px solid var(--accent-soft2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px',
                      }}>{card.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: '14px', color: 'var(--text)', marginBottom: '4px' }}>{card.title}</div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-3)', lineHeight: 1.6 }}>{card.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </R>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse, rgba(255,92,26,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <R style={{ position: 'relative', zIndex: 1, maxWidth: '580px', margin: '0 auto' }}>
            
            <h2 style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 900,
              fontSize: 'clamp(30px,5vw,56px)', letterSpacing: '-1.5px',
              color: 'var(--text)', lineHeight: 1.0, marginBottom: '16px',
            }}>
              Have an idea?<br />Let's build it.
            </h2>
            <p style={{ fontSize: 'clamp(13px,1.5vw,16px)', lineHeight: 1.8, color: 'var(--text-3)', marginBottom: '30px' }}>
              Whether you need a custom product, an AI integration, or want to partner on something new — we're ready.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <a href="https://aethersolve.vercel.app/#contact" className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '14.5px' }}>
                Get In Touch <ArrowUpRight size={15} />
              </a>
              <a href="https://aethersolve.vercel.app/company/work" className="btn btn-secondary" style={{ padding: '14px 26px', fontSize: '14.5px' }}>
                See Our Work
              </a>
            </div>
          </R>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border)', padding: '22px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/newaether.png" alt="AetherSolve" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--text)', letterSpacing: '-0.5px' }}>
              AetherSolve
            </span>
             <span style={{ fontSize: '9.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: 'var(--accent-soft)', color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }} className="nav-hide">Labs</span>
          </Link>
              <span style={{ fontSize: '11.5px', color: 'var(--text-4)' }}>© 2026 AetherSolve Technologies Pvt. Ltd.</span>
            </div>
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              {[
                ['Home', 'https://aethersolve.vercel.app'],
                ['Our Work', 'https://aethersolve.vercel.app/company/work'],
                ['Contact', 'mailto:hello@aethersolve.com'],
                ['Privacy', '#'],
                ['Terms', '#'],
              ].map(([label, href]) => (
                <a key={label} href={href} style={{ fontSize: '12px', color: 'var(--text-4)', textDecoration: 'none' }}>{label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {/* ── DETAIL PANEL ── */}
      <DetailPanel product={activeProduct} onClose={handleClose} />
    </>
  );
}