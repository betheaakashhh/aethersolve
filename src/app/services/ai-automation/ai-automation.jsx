'use client';
// src/app/services/ai-automation/page.jsx  (or pages/services/ai-automation.jsx)
import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Reveal hook ───────────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

// ── Pipeline Animator ─────────────────────────────────────────────────────────
const pipelineLogs = [
  { type: 'info',    text: 'Pipeline started · vendor_invoice_processor' },
  { type: 'info',    text: 'Connecting to Tally data source...' },
  { type: 'success', text: '✓ Tally sync complete · 2,847 entries loaded' },
  { type: 'info',    text: 'Running AI extraction on 34 new invoices...' },
  { type: 'success', text: '✓ Extraction complete · 34/34 parsed' },
  { type: 'warn',    text: '⚠ 2 invoices flagged for review (amount mismatch)' },
  { type: 'success', text: '✓ LLM validation passed · 32 invoices approved' },
  { type: 'info',    text: 'Sending WhatsApp summary to accounts manager...' },
  { type: 'success', text: '✓ Message delivered · +91 98xxx xxxxx' },
  { type: 'success', text: '✓ Dashboard updated · Next run: 07:00:00 tomorrow' },
];

function PipelineDemo() {
  const [activeNode, setActiveNode] = useState(-1);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  const nodes = [
    { id: 0, icon: '📁', label: 'Tally/Drive\nData Source' },
    { id: 1, icon: '🔍', label: 'AI Extraction\n& Parsing' },
    { id: 2, icon: '🧠', label: 'LLM\nIntelligence' },
    { id: 3, icon: '✅', label: 'Rule\nValidation' },
    { id: 4, icon: '📲', label: 'WhatsApp\nAlert' },
    { id: 5, icon: '📊', label: 'Dashboard\nUpdate' },
  ];

  const runPipeline = useCallback(() => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setActiveNode(-1);
    let logIdx = 0;
    let nodeIdx = 0;

    function addLog() {
      if (logIdx >= pipelineLogs.length) {
        setTimeout(() => { setRunning(false); setTimeout(runPipeline, 2000); }, 500);
        return;
      }
      const log = pipelineLogs[logIdx++];
      const now = new Date().toTimeString().slice(0, 8);
      setLogs(prev => [...prev.slice(-9), { ...log, time: now, id: Date.now() }]);
      if (nodeIdx <= 5) {
        setActiveNode(nodeIdx);
        if (logIdx % 2 === 0) nodeIdx++;
      }
      setTimeout(addLog, 800 + Math.random() * 300);
    }
    addLog();
  }, [running]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { runPipeline(); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const logColor = { success: '#4ade80', info: '#60a5fa', warn: '#FF5C1A' };

  return (
    <div ref={ref} style={{ background: '#1A1A1A', border: '1px solid rgba(255,92,26,0.2)', borderRadius: '12px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#888', marginBottom: '32px' }}>
        <span style={{ color: '#FF5C1A' }}>// aethersolve.pipeline</span> · vendor_invoice_processor · {running ? 'running' : 'idle'}
      </div>

      {/* Pipeline nodes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {nodes.map((node, i) => (
          <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, minWidth: '80px' }}>
              <div style={{
                width: '52px', height: '52px', background: activeNode >= node.id ? 'rgba(255,92,26,0.15)' : '#2A2A2A',
                border: `1px solid ${activeNode >= node.id ? '#FF5C1A' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', transition: 'all 0.4s ease',
                boxShadow: activeNode === node.id ? '0 0 20px rgba(255,92,26,0.4)' : 'none',
                transform: activeNode === node.id ? 'scale(1.1)' : 'scale(1)',
              }}>
                {node.icon}
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', textAlign: 'center', whiteSpace: 'pre-line', lineHeight: '1.3' }}>{node.label}</div>
            </div>
            {i < nodes.length - 1 && (
              <div style={{ fontSize: '16px', color: activeNode > node.id ? '#FF5C1A' : 'rgba(255,255,255,0.15)', transition: 'color 0.4s ease', flexShrink: 0, paddingBottom: '20px' }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Log output */}
      <div style={{ background: '#050505', borderRadius: '8px', padding: '20px', fontFamily: 'DM Mono, monospace', fontSize: '12px', minHeight: '140px', maxHeight: '160px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '4px' }}>
        {logs.map((l) => (
          <div key={l.id} style={{ animation: 'logSlide 0.3s ease' }}>
            <span style={{ color: '#555', marginRight: '12px' }}>{l.time}</span>
            <span style={{ color: logColor[l.type] }}>{l.text}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#FF5C1A' }}>$</span>
          <span style={{ width: '8px', height: '14px', background: '#FF5C1A', display: 'inline-block', animation: 'blink 1s infinite', verticalAlign: 'middle' }} />
        </div>
      </div>
    </div>
  );
}

// ── Capability Card ───────────────────────────────────────────────────────────
function CapCard({ num, title, desc, tags }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#090909', padding: '40px', cursor: 'default', position: 'relative', overflow: 'hidden',
        transition: 'background 0.3s',
        ...(hover ? { background: 'rgba(255,92,26,0.04)' } : {}),
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: '#FF5C1A', transform: hover ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.4s ease', transformOrigin: 'left',
      }} />
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '60px', color: hover ? 'rgba(255,92,26,0.25)' : 'rgba(255,92,26,0.12)', lineHeight: 1, marginBottom: '16px', transition: 'color 0.3s' }}>{num}</div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: '#F5F0E8', marginBottom: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
      <div style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.7, marginBottom: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{desc}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tags.map(t => (
          <span key={t} style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', padding: '4px 10px', borderRadius: '3px', background: 'rgba(255,92,26,0.1)', color: '#FF5C1A', border: '1px solid rgba(255,92,26,0.2)' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ── How Step ─────────────────────────────────────────────────────────────────
function HowStep({ num, title, desc, code, delay }) {
  const [ref, vis] = useReveal();
  const [hover, setHover] = useState(false);
  return (
    <div ref={ref} style={{ display: 'flex', gap: '40px', marginBottom: '48px', opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(-20px)', transition: `all 0.6s ease ${delay}ms` }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: '56px', height: '56px', flexShrink: 0,
          background: hover ? '#FF5C1A' : '#1A1A1A',
          border: '1px solid rgba(255,92,26,0.3)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: hover ? '#fff' : '#FF5C1A',
          position: 'relative', zIndex: 1, transition: 'all 0.3s', cursor: 'default',
          boxShadow: hover ? '0 0 24px rgba(255,92,26,0.5)' : 'none',
        }}
      >{num}</div>
      <div style={{ paddingTop: '12px' }}>
        <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
        <div style={{ fontSize: '15px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.7, maxWidth: '500px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{desc}</div>
        {code && (
          <div style={{ marginTop: '16px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #FF5C1A', borderRadius: '8px', padding: '16px 20px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'rgba(245,240,232,0.6)', maxWidth: '500px' }} dangerouslySetInnerHTML={{ __html: code }} />
        )}
      </div>
    </div>
  );
}

// ── Use Case Tab Panel ────────────────────────────────────────────────────────
const useCaseData = {
  manufacturing: {
    title: 'Dispatch & Operations Automation',
    desc: "A logistics company's dispatch manager spent 3 hours every morning matching trucks to orders across 4 Excel sheets. We automated the entire morning workflow — AI reads the orders, matches trucks by route and capacity, generates the dispatch plan, and sends it to WhatsApp before the manager's first chai.",
    metrics: [{ v: '3hrs', l: 'saved daily, per manager' }, { v: '94%', l: 'reduction in manual errors' }, { v: '₹0', l: 'extra staff hired' }, { v: '7am', l: 'plan ready, automatically' }],
    flows: [
      { icon: '📊', text: 'Load order database (847 orders)', status: 'done' },
      { icon: '🚛', text: 'Check available trucks (34 vehicles)', status: 'done' },
      { icon: '🧠', text: 'AI route optimization running…', status: 'active' },
      { icon: '📲', text: 'Send dispatch plan via WhatsApp', status: 'pending' },
      { icon: '📈', text: 'Update dashboard & log', status: 'pending' },
    ],
    pipelineName: 'dispatch_pipeline · 07:00:03',
  },
  healthcare: {
    title: 'Patient Record & Billing Intelligence',
    desc: 'A multi-branch clinic had patient records split across handwritten files, Excel, and a legacy software. AI consolidates records, auto-generates discharge summaries, and reconciles insurance billing — cutting billing cycle from 14 days to 2.',
    metrics: [{ v: '14→2', l: 'days billing cycle' }, { v: '100%', l: 'records digitized, auto' }, { v: '₹8L', l: 'recovered pending claims/yr' }, { v: '0', l: 'manual data entry staff needed' }],
    flows: [
      { icon: '📝', text: 'Scan handwritten prescription', status: 'done' },
      { icon: '🔍', text: 'OCR + LLM extraction', status: 'done' },
      { icon: '🧠', text: 'Auto-generate discharge summary', status: 'done' },
      { icon: '💰', text: 'Insurance claim auto-filing', status: 'active' },
      { icon: '📲', text: 'SMS patient & doctor', status: 'pending' },
    ],
    pipelineName: 'patient_record_ai · live',
  },
  finance: {
    title: 'GST & Compliance Automation',
    desc: 'CA firms and finance teams spend 40+ hours a month on GST reconciliation. AI reads your Tally exports, cross-checks GSTR-2B, flags discrepancies, and generates the reconciliation report automatically.',
    metrics: [{ v: '40hrs', l: 'saved per GST cycle' }, { v: '0.01%', l: 'mismatch error rate' }, { v: 'Auto', l: 'GSTR reconciliation' }, { v: '24hr', l: 'notice-to-response time' }],
    flows: [
      { icon: '📁', text: 'Pull Tally export (2,847 entries)', status: 'done' },
      { icon: '🔗', text: 'Fetch GSTR-2B from portal', status: 'done' },
      { icon: '🧠', text: 'AI cross-matching 2,847 lines', status: 'active' },
      { icon: '⚠️', text: 'Flag 3 discrepancies found', status: 'pending' },
      { icon: '📄', text: 'Generate reconciliation report', status: 'pending' },
    ],
    pipelineName: 'gst_reconciliation · monthly',
  },
  education: {
    title: 'Student Operations Intelligence',
    desc: 'Coaching institutes generate massive data — attendance, marks, fees — tracked manually. AI consolidates everything, auto-generates parent reports, predicts at-risk students, and automates fee reminders via WhatsApp.',
    metrics: [{ v: 'Auto', l: 'parent reports generated' }, { v: '92%', l: 'fee collection rate (up from 71%)' }, { v: 'Early', l: 'at-risk student detection' }, { v: '0', l: 'manual report generation' }],
    flows: [
      { icon: '📊', text: 'Sync attendance (1,240 students)', status: 'done' },
      { icon: '🧠', text: 'AI performance analysis', status: 'done' },
      { icon: '⚠️', text: 'Flag 12 at-risk students', status: 'active' },
      { icon: '📲', text: 'WhatsApp fee reminders (87 pending)', status: 'pending' },
      { icon: '📝', text: 'Generate monthly parent reports', status: 'pending' },
    ],
    pipelineName: 'student_ops · daily_run',
  },
  retail: {
    title: 'Inventory & Demand Intelligence',
    desc: 'Retail businesses lose money in two ways: stockouts and overstock. AI watches your sales velocity, supplier lead times, and seasonal patterns — and tells you what to order, how much, and when.',
    metrics: [{ v: '↓68%', l: 'stockout incidents' }, { v: '↓31%', l: 'excess inventory cost' }, { v: 'Auto', l: 'WhatsApp order to supplier' }, { v: 'Daily', l: 'demand forecast update' }],
    flows: [
      { icon: '📦', text: 'Monitor 847 SKUs live', status: 'done' },
      { icon: '🧠', text: 'Demand forecast updated', status: 'done' },
      { icon: '⚠️', text: 'Low stock: 6 SKUs flagged', status: 'active' },
      { icon: '📲', text: 'Auto-order via WhatsApp to supplier', status: 'pending' },
      { icon: '📊', text: 'Update dashboard & owner report', status: 'pending' },
    ],
    pipelineName: 'inventory_ai · real-time',
  },
};

function UseCasePanel({ data }) {
  const statusColor = { done: '#4ade80', active: '#FF5C1A', pending: '#555' };
  const statusText = { done: '✓ done', active: '● live', pending: 'pending' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      <div>
        <h3 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{data.title}</h3>
        <p style={{ fontSize: '15px', color: 'rgba(245,240,232,0.6)', lineHeight: 1.8, marginBottom: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{data.desc}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {data.metrics.map(m => (
            <div key={m.l} style={{ background: '#090909', border: '1px solid rgba(255,92,26,0.15)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#FF5C1A' }}>{m.v}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: '#090909', border: '1px solid rgba(255,92,26,0.1)', borderRadius: '12px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginBottom: '8px' }}>// {data.pipelineName}</div>
        {data.flows.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            background: '#1A1A1A', borderRadius: '6px', fontSize: '13px',
            borderLeft: `3px solid ${f.status === 'done' ? '#4ade80' : f.status === 'active' ? '#FF5C1A' : 'transparent'}`,
            opacity: f.status === 'pending' ? 0.4 : 1,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            transition: 'all 0.3s',
          }}>
            <div style={{ fontSize: '18px' }}>{f.icon}</div>
            <div style={{ flex: 1, color: '#F5F0E8' }}>{f.text}</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: statusColor[f.status] }}>{statusText[f.status]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stack Item ────────────────────────────────────────────────────────────────
function StackItem({ icon, name, role }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#1A1A1A', border: `1px solid ${hover ? 'rgba(255,92,26,0.4)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '8px', padding: '20px 16px', textAlign: 'center',
        transform: hover ? 'translateY(-4px)' : 'none',
        background: hover ? 'rgba(255,92,26,0.05)' : '#1A1A1A',
        transition: 'all 0.3s', cursor: 'default',
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{name}</div>
      <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#888' }}>{role}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AIAutomationPage() {
  const [activeTab, setActiveTab] = useState('manufacturing');

  return (
    <div style={{ background: '#090909', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        @keyframes gridPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-40px) scale(1.05)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes logSlide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scrollHint { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', background: 'rgba(9,9,9,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,92,26,0.15)' }}>
        <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '22px' }}>
                   <Image
                       src="/newaether.png"
                       alt="AetherSolve Logo"
                       width={36}  
                       height={36}
                       style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}
                   />
                   Aether
                   <span style={{ color: '#FF5C1A' }}>
                       Solve
                       </span></div>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Back to home</Link>
        <a href="#contact" style={{ background: '#FF5C1A', color: '#fff', padding: '10px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Talk to us</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,92,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,92,26,0.04) 1px, transparent 1px)', backgroundSize: '60px 60px', animation: 'gridPulse 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'rgba(255,92,26,0.12)', borderRadius: '50%', filter: 'blur(120px)', top: '-200px', right: '-100px', animation: 'orbFloat 10s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(255,92,26,0.06)', borderRadius: '50%', filter: 'blur(120px)', bottom: 0, left: '200px', animation: 'orbFloat 14s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,92,26,0.18)', border: '1px solid rgba(255,92,26,0.3)', padding: '8px 16px', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', marginBottom: '32px', width: 'fit-content', opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards' }}>
          <span style={{ width: '6px', height: '6px', background: '#FF5C1A', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          Core Service · AI Automation Systems
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(72px,10vw,140px)', lineHeight: 0.92, letterSpacing: '2px', marginBottom: '32px', opacity: 0, animation: 'fadeUp 0.8s 0.4s forwards' }}>
          YOUR BUSINESS<br />
          <span style={{ color: '#FF5C1A' }}>ON AUTOPILOT.</span><br />
          <span style={{ WebkitTextStroke: '1px rgba(245,240,232,0.3)', color: 'transparent' }}>PERMANENTLY.</span>
        </h1>

        <p style={{ maxWidth: '560px', fontSize: '18px', lineHeight: 1.7, color: 'rgba(245,240,232,0.65)', marginBottom: '48px', opacity: 0, animation: 'fadeUp 0.8s 0.6s forwards' }}>
          We don't build chatbots. We build the systems that replace the manual work your team does every day — connected to your real data, running without you touching it.
        </p>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', opacity: 0, animation: 'fadeUp 0.8s 0.8s forwards' }}>
          <a href="#demo" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>See it live ↓</a>
          <a href="#usecases" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>View use cases</a>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', left: '60px', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', opacity: 0, animation: 'fadeUp 0.8s 1.2s forwards' }}>
          <div style={{ width: '40px', height: '1px', background: '#888' }} />
          scroll to explore
        </div>
      </section>

      {/* LIVE PIPELINE DEMO */}
      <section id="demo" style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Live Demo</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>WATCH IT<br />WORK.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '60px' }}>A real automation pipeline — processing documents, extracting data, triggering actions. No human in the loop.</p></Reveal>
        <Reveal delay={200}><PipelineDemo /></Reveal>

        {/* Capabilities grid */}
        <Reveal delay={300}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1px', background: 'rgba(255,92,26,0.1)', border: '1px solid rgba(255,92,26,0.1)', borderRadius: '12px', overflow: 'hidden', marginTop: '60px' }}>
            {[
              { num: '01', title: 'RAG Pipelines', desc: 'Your documents, policies, and data become a searchable intelligence layer. Ask anything, get answers from your actual data — not the internet.', tags: ['pgvector', 'LangChain', 'Embeddings', 'Semantic Search'] },
              { num: '02', title: 'WhatsApp Automation', desc: 'Your team already lives in WhatsApp. We bring the AI there — dispatch alerts, approval flows, status updates, all without opening another app.', tags: ['WhatsApp Business API', 'Twilio', 'n8n'] },
              { num: '03', title: 'Document Intelligence', desc: 'Invoices, contracts, reports — AI reads them, extracts the data, validates it against your rules, flags exceptions. Zero manual entry.', tags: ['OCR + LLM', 'Structured Output', 'Validation Rules'] },
              { num: '04', title: 'Workflow Bots', desc: 'Multi-step automated agents that make decisions, call your APIs, send emails, update databases — running on a schedule or triggered by events.', tags: ['n8n', 'Agent chains', 'Tool use', 'Cron triggers'] },
              { num: '05', title: 'Predictive Operations', desc: 'Historical data + AI = early warnings. Inventory stockouts, payment delays, demand spikes — know before it happens.', tags: ['Time-series AI', 'Anomaly detection', 'Forecasting'] },
              { num: '06', title: 'Voice in Hindi', desc: 'Factory floors, field teams, supervisors who don\'t use dashboards. We build voice-first AI interfaces in Hindi and regional languages.', tags: ['Whisper ASR', 'Hindi NLP', 'Voice agents'] },
            ].map(c => <CapCard key={c.num} {...c} />)}
          </div>
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Process</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>HOW WE<br />BUILD IT.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '60px' }}>Every automation we build follows the same 4-phase process. No surprises, no scope creep.</p></Reveal>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '28px', top: '40px', bottom: '40px', width: '1px', background: 'linear-gradient(to bottom, transparent, #FF5C1A, transparent)' }} />
          <HowStep num="1" title="Workflow Audit" desc="We sit with your team for 2–3 days. We map every manual process, find where time is being lost, and identify which ones have the highest automation ROI." code='<span style="color:#FF5C1A">audit</span>.<span style="color:#60a5fa">map_workflows</span>(<span style="color:#4ade80">"your_team"</span>)<br/>→ <span style="color:#4ade80">23 manual processes identified</span><br/>→ <span style="color:#FF5C1A">6 high-ROI automation targets</span>' delay={0} />
          <HowStep num="2" title="Data Integration" desc="We connect to your existing tools — Tally, Excel, Google Sheets, WhatsApp, email, custom databases. Your data stays where it is." code='<span style="color:#FF5C1A">connect</span>(<span style="color:#4ade80">"tally"</span>, <span style="color:#4ade80">"sheets"</span>, <span style="color:#4ade80">"whatsapp"</span>)<br/>→ <span style="color:#60a5fa">Tally sync:</span> <span style="color:#4ade80">✓ live</span><br/>→ <span style="color:#60a5fa">Sheet parser:</span> <span style="color:#4ade80">✓ 847 rows loaded</span>' delay={100} />
          <HowStep num="3" title="AI Pipeline Build" desc="We build the automation using RAG, LLM agents, and workflow tools. Every pipeline is tested against your real data before going live." code='<span style="color:#FF5C1A">pipeline</span>.build({<br/>&nbsp;&nbsp;<span style="color:#60a5fa">trigger:</span> <span style="color:#4ade80">"daily_7am"</span>,<br/>&nbsp;&nbsp;<span style="color:#60a5fa">model:</span> <span style="color:#4ade80">"gpt-4o"</span>,<br/>&nbsp;&nbsp;<span style="color:#60a5fa">output:</span> <span style="color:#4ade80">"whatsapp + dashboard"</span><br/>})' delay={200} />
          <HowStep num="4" title="Deploy, Train, Maintain" desc="We deploy on your infrastructure or ours. We train your team in 1 session. And we maintain it — we're reachable. We fix it." code='<span style="color:#FF5C1A">status</span>: <span style="color:#4ade80">LIVE · 99.97% uptime</span><br/><span style="color:#60a5fa">last_run:</span> <span style="color:#4ade80">today 07:00:03</span><br/><span style="color:#60a5fa">processed:</span> <span style="color:#4ade80">4,847 docs this month</span>' delay={300} />
        </div>
      </section>

      {/* USE CASES */}
      <section id="usecases" style={{ padding: '100px 60px', background: '#1A1A1A' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Use Cases</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '48px' }}>REAL PROBLEMS.<br />REAL RESULTS.</h2></Reveal>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {Object.keys(useCaseData).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === tab ? '#FF5C1A' : 'transparent', border: `1px solid ${activeTab === tab ? '#FF5C1A' : 'rgba(255,255,255,0.1)'}`, color: activeTab === tab ? '#fff' : '#888', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <UseCasePanel data={useCaseData[activeTab]} />
      </section>

      {/* TECH STACK */}
      <section style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Technology</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>THE STACK<br />BEHIND IT.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>Production-grade tools, not experiment frameworks. Every choice is for reliability, maintainability, and speed.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: '12px' }}>
            {[
              { icon: '🧠', name: 'GPT-4o', role: 'LLM Core' },
              { icon: '🤖', name: 'Claude', role: 'Document AI' },
              { icon: '🔗', name: 'LangChain', role: 'RAG Pipelines' },
              { icon: '🗄️', name: 'pgvector', role: 'Vector Store' },
              { icon: '⚡', name: 'n8n', role: 'Workflow Automation' },
              { icon: '💚', name: 'WhatsApp API', role: 'Business Messaging' },
              { icon: '🎙️', name: 'Whisper', role: 'Voice / Hindi ASR' },
              { icon: '🐘', name: 'PostgreSQL', role: 'Data Foundation' },
              { icon: '▲', name: 'Next.js', role: 'Dashboard UI' },
              { icon: '☁️', name: 'AWS / GCP', role: 'Infrastructure' },
              { icon: '🐳', name: 'Docker', role: 'Containerization' },
              { icon: '🔄', name: 'Redis', role: 'Caching / Queues' },
            ].map(s => <StackItem key={s.name} {...s} />)}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: '120px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,92,26,0.1) 0%, transparent 70%)' }} />
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px', position: 'relative' }}>Get Started</div>
        <Reveal>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.95, marginBottom: '24px', position: 'relative' }}>
            READY TO<br /><span style={{ color: '#FF5C1A' }}>AUTOMATE?</span>
          </h2>
        </Reveal>
        <Reveal delay={100}><p style={{ fontSize: '18px', color: 'rgba(245,240,232,0.55)', marginBottom: '48px', position: 'relative' }}>Tell us your most painful manual process. We'll tell you exactly how we'd automate it — free, in 48 hours.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
            <a href="mailto:hello@aethersolve.com" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>Start the conversation →</a>
            <Link href="/services/erp-crm" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>Explore ERP & CRM</Link>
          </div>
        </Reveal>
      </section>

      <footer style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#888', flexWrap: 'wrap', gap: '16px' }}>
        <div>© 2026 AetherSolve Technologies Pvt. Ltd. · Bhilai, Chhattisgarh</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/services/erp-crm', 'ERP & CRM'], ['/services/cloud-hosting', 'Cloud'], ['mailto:hello@aethersolve.com', 'Contact']].map(([href, label]) => (
            <Link key={label} href={href} style={{ color: '#888', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}