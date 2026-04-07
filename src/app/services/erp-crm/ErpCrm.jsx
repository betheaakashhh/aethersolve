'use client';
// src/app/services/erp-crm/page.jsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

// ── Hero Dashboard ────────────────────────────────────────────────────────────
function HeroDashboard() {
  const [tick, setTick] = useState(0);
  const barVals = [40, 55, 48, 62, 58, 70, 65, 80, 75, 88, 82, 95];

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)', width: '520px', background: '#1A1A1A', border: '1px solid rgba(255,92,26,0.2)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.6)', opacity: 0, animation: 'fadeIn 1s 1s forwards' }}>
      {/* Topbar */}
      <div style={{ background: '#2A2A2A', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#f87171', '#fbbf24', '#4ade80'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#888', marginLeft: '8px' }}>aethersolve_erp · live</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4ade80' }}>
          <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          All systems normal
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '20px' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '16px' }}>
          {[['₹24.8L', 'Monthly Revenue', false], ['847', 'Active SKUs', true], ['48', 'Open Leads', false], ['24', 'Employees', false]].map(([v, l, orange]) => (
            <div key={l} style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: orange ? '#FF5C1A' : '#F5F0E8' }}>{v}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>
        {/* Mini chart */}
        <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', marginBottom: '8px' }}>Revenue trend — AI forecast overlay</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
            {barVals.map((v, i) => (
              <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', background: i === barVals.length - 1 ? '#FF5C1A' : 'rgba(255,92,26,0.3)', height: `${v}%`, transition: 'height 0.8s ease', position: 'relative' }}>
                {i >= barVals.length - 3 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderRadius: '2px 2px 0 0', background: 'rgba(74,222,128,0.6)', height: `${v * 0.15}%` }} />}
              </div>
            ))}
          </div>
        </div>
        {/* Status table */}
        <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '8px 12px', background: '#2A2A2A' }}>
            {['Module', 'Status', 'Last AI run'].map(h => <span key={h} style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888' }}>{h}</span>)}
          </div>
          {[
            ['Payroll', '✓ Processed', 'pill-green', '2m ago'],
            ['Inventory AI', '⚠ 3 alerts', 'pill-orange', 'live'],
            ['CRM pipeline', '→ 6 follow-ups', 'pill-blue', '1h ago'],
            ['WhatsApp bot', '✓ Active', 'pill-green', 'live'],
          ].map(([name, status, type, time]) => (
            <div key={name} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '11px', color: 'rgba(245,240,232,0.7)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{name}</span>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', width: 'fit-content', background: type === 'pill-green' ? 'rgba(74,222,128,0.15)' : type === 'pill-orange' ? 'rgba(255,92,26,0.15)' : 'rgba(96,165,250,0.15)', color: type === 'pill-green' ? '#4ade80' : type === 'pill-orange' ? '#FF5C1A' : '#60a5fa' }}>{status}</span>
              <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#888' }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Module Card ───────────────────────────────────────────────────────────────
function ModuleCard({ icon, title, desc, aiBadge }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: '#1A1A1A', border: `1px solid ${hover ? 'rgba(255,92,26,0.3)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '12px', padding: '32px', cursor: 'pointer', transition: 'all 0.3s',
        transform: hover ? 'translateY(-4px)' : 'none',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: '#FF5C1A', transform: hover ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.4s ease' }} />
      <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{desc}</div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,92,26,0.18)', border: '1px solid rgba(255,92,26,0.3)', padding: '4px 10px', borderRadius: '3px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#FF5C1A' }}>{aiBadge}</div>
    </div>
  );
}

// ── Live Demo Tabs ────────────────────────────────────────────────────────────
function HRPanel() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
        {[['24', 'Total employees', '✓ All records synced', '#4ade80'], ['₹12.4L', 'This month payroll', '🧠 AI processed in 2 min', '#FF5C1A'], ['98.2%', 'Attendance rate', '⚠ 1 anomaly flagged', '#fbbf24']].map(([v, l, ai, c]) => (
          <div key={l} style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: c === '#FF5C1A' ? '#FF5C1A' : '#F5F0E8' }}>{v}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{l}</div>
            <div style={{ fontSize: '11px', color: c, marginTop: '8px', fontFamily: 'DM Mono, monospace' }}>{ai}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr', padding: '8px 16px', background: '#2A2A2A' }}>
          {['', 'Employee', 'Role', 'Attendance', 'Payroll'].map(h => <span key={h} style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888' }}>{h}</span>)}
        </div>
        {[
          { init: 'RK', name: 'Rahul Kumar', role: 'Operations Mgr', att: '26/26', attOk: true, pay: '✓ Processed', payOk: true, color: 'rgba(255,92,26,0.2)', tc: '#FF5C1A' },
          { init: 'PS', name: 'Priya Sharma', role: 'Accounts', att: '25/26', attOk: true, pay: '✓ Processed', payOk: true, color: 'rgba(96,165,250,0.2)', tc: '#60a5fa' },
          { init: 'AV', name: 'Amit Verma', role: 'Sales Executive', att: '⚠ 18/26', attOk: false, pay: '🧠 AI flagged', payOk: false, color: 'rgba(251,191,36,0.2)', tc: '#fbbf24' },
          { init: 'SG', name: 'Sunita Gupta', role: 'HR Manager', att: '26/26', attOk: true, pay: '✓ Processed', payOk: true, color: 'rgba(74,222,128,0.2)', tc: '#4ade80' },
        ].map(e => (
          <div key={e.name} style={{ display: 'grid', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: e.tc, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{e.init}</div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{e.name}</span>
            <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#888' }}>{e.role}</span>
            <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', padding: '2px 8px', borderRadius: '3px', background: e.attOk ? 'rgba(74,222,128,0.15)' : 'rgba(255,92,26,0.15)', color: e.attOk ? '#4ade80' : '#FF5C1A', width: 'fit-content' }}>{e.att}</span>
            <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: e.payOk ? '#4ade80' : '#FF5C1A' }}>{e.pay}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryPanel() {
  const items = [
    { label: 'Cement', stock: 12, critical: true },
    { label: 'Steel', stock: 68, critical: false },
    { label: 'Bricks', stock: 84, critical: false },
    { label: 'Paint', stock: 16, critical: true },
    { label: 'Sand', stock: 72, critical: false },
    { label: 'Tiles', stock: 45, critical: false },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
      <div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginBottom: '12px' }}>🧠 AI inventory alerts</div>
        {[
          { name: 'Cement (OPC 53 Grade)', detail: 'Stock: 12 bags · Min: 100 bags', action: '→ AI auto-ordered 200 bags from Ambuja Cements', type: 'critical' },
          { name: 'Steel Rods (12mm)', detail: 'Stock: 340 pcs · Forecast: 500 next week', action: '→ AI recommends reorder in 3 days', type: 'warn' },
          { name: 'Bricks (Red Clay)', detail: 'Stock: 4,200 · Demand stable', action: '✓ No action needed', type: 'ok' },
          { name: 'Paint (Asian Paints - White)', detail: 'Stock: 8 cans · Lead time: 5 days', action: '→ AI suggests reorder by Thursday', type: 'warn' },
        ].map(a => (
          <div key={a.name} style={{ background: '#090909', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', borderLeft: `3px solid ${a.type === 'critical' ? '#f87171' : a.type === 'warn' ? '#FF5C1A' : '#4ade80'}` }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{a.name}</div>
            <div style={{ fontSize: '12px', color: '#888', fontFamily: 'DM Mono, monospace' }}>{a.detail}</div>
            <div style={{ fontSize: '11px', color: '#FF5C1A', marginTop: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{a.action}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '20px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginBottom: '16px' }}>Stock levels vs AI forecast · top 6 SKUs</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
          {items.map(item => (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', borderRadius: '3px 3px 0 0', background: item.critical ? '#f87171' : item.stock < 50 ? '#FF5C1A' : '#4ade80', height: `${item.stock}%`, transition: 'height 0.8s cubic-bezier(0.34,1.56,0.64,1)' }} />
              <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#888', textAlign: 'center' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CRMPanel() {
  const stages = [
    { label: 'New Leads', count: 12, cards: [{ name: 'Mehta Construction', val: '₹2.4L', ai: '🧠 Score: 82% · Call today' }, { name: 'Raipur Steel Works', val: '₹5.8L', ai: '🧠 Score: 71% · Send proposal' }] },
    { label: 'Contacted', count: 18, cards: [{ name: 'Bhilai Pharma Ltd', val: '₹8.2L', ai: '🧠 Follow up overdue 2d' }, { name: 'Global Logistics', val: '₹3.6L', ai: '✓ Meeting scheduled' }] },
    { label: 'Proposal Sent', count: 11, cards: [{ name: 'Chhattisgarh Edu Board', val: '₹12.0L', ai: '🧠 Close prob: 68%' }] },
    { label: 'Closing', count: 7, cards: [{ name: 'NLC India Ltd', val: '₹6.4L ✓', ai: 'Contract this week', green: true }] },
  ];
  return (
    <div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginBottom: '20px' }}>🧠 AI-scored pipeline · 48 active leads · ₹38.4L potential</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {stages.map(s => (
          <div key={s.label}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {s.label}
              <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>{s.count}</span>
            </div>
            {s.cards.map(c => (
              <div key={c.name} style={{ background: '#090909', border: `1px solid ${c.green ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '6px', padding: '12px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{c.name}</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: c.green ? '#4ade80' : '#FF5C1A' }}>{c.val}</div>
                <div style={{ fontSize: '11px', color: c.green ? '#4ade80' : '#4ade80', marginTop: '6px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{c.ai}</div>
              </div>
            ))}
            <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px', opacity: 0.4 }}>
              <div style={{ fontSize: '13px', color: '#888', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>+{s.count - s.cards.length} more</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Comparison Table ──────────────────────────────────────────────────────────
function CompareRow({ feature, us, sap, tally }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ padding: '14px 24px', fontSize: '13px', color: 'rgba(245,240,232,0.7)', display: 'flex', alignItems: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{feature}</div>
      <div style={{ padding: '14px 24px', background: 'rgba(255,92,26,0.04)', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.04)', borderLeft: '1px solid rgba(255,255,255,0.04)' }}
        dangerouslySetInnerHTML={{ __html: us }} />
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.04)' }}
        dangerouslySetInnerHTML={{ __html: sap }} />
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center' }}
        dangerouslySetInnerHTML={{ __html: tally }} />
    </div>
  );
}

// ── Pricing Card ──────────────────────────────────────────────────────────────
function PricingCard({ tier, price, note, features, featured, cta }) {
  return (
    <div style={{ background: '#1A1A1A', border: `1px solid ${featured ? '#FF5C1A' : 'rgba(255,255,255,0.08)'}`, borderRadius: '16px', padding: '36px', transition: 'all 0.3s', position: 'relative', background: featured ? 'rgba(255,92,26,0.06)' : '#1A1A1A' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {featured && <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#FF5C1A', color: '#fff', padding: '4px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Most Popular</div>}
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#888', marginBottom: '12px' }}>{tier}</div>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: '#F5F0E8', lineHeight: 1, marginBottom: '4px' }}>{price}<sub style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', fontWeight: 400, color: '#888' }}>{price !== 'Custom' ? '/one-time' : ''}</sub></div>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{note}</div>
      {features.map(f => (
        <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', fontSize: '13px', color: 'rgba(245,240,232,0.7)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          <span style={{ color: '#4ade80', flexShrink: 0, fontSize: '14px' }}>✓</span>
          {f}
        </div>
      ))}
      <a href="mailto:hello@aethersolve.com" style={{ display: 'block', textAlign: 'center', marginTop: '24px', padding: '14px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', background: featured ? '#FF5C1A' : 'transparent', color: featured ? '#fff' : '#F5F0E8', border: featured ? 'none' : '1px solid rgba(255,255,255,0.2)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{cta}</a>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ERPCRMPage() {
  const [liveTab, setLiveTab] = useState('hr');

  return (
    <div style={{ background: '#090909', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes hLineAnim { 0%,100%{opacity:0;transform:translateX(-100%)} 50%{opacity:1;transform:translateX(100%)} }
        @keyframes vLineAnim { 0%,100%{opacity:0;transform:translateY(-100%)} 50%{opacity:1;transform:translateY(100%)} }
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
        <Link href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#888', textDecoration: 'none' }}>← Back to home</Link>
        <a href="#contact" style={{ background: '#FF5C1A', color: '#fff', padding: '10px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Get a demo</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 60px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,92,26,0.03) 0%, transparent 50%, rgba(255,92,26,0.05) 100%)' }} />
        {/* Animated lines */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[{ top: '30%', dur: '5s', delay: '0s', type: 'h' }, { top: '60%', dur: '7s', delay: '2s', type: 'h' }, { left: '70%', dur: '6s', delay: '1s', type: 'v' }, { left: '45%', dur: '8s', delay: '3s', type: 'v' }].map((l, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...(l.type === 'h' ? { left: 0, right: 0, top: l.top, height: '1px' } : { top: 0, bottom: 0, left: l.left, width: '1px' }),
              background: l.type === 'h' ? 'linear-gradient(to right, transparent, rgba(255,92,26,0.1), transparent)' : 'linear-gradient(to bottom, transparent, rgba(255,92,26,0.1), transparent)',
              animation: `${l.type === 'h' ? 'hLineAnim' : 'vLineAnim'} ${l.dur} ease-in-out infinite`,
              animationDelay: l.delay,
            }} />
          ))}
        </div>

        <div style={{ maxWidth: '680px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,92,26,0.18)', border: '1px solid rgba(255,92,26,0.3)', padding: '8px 16px', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', marginBottom: '32px', opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards' }}>
            <span style={{ width: '6px', height: '6px', background: '#FF5C1A', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            AI-First ERP & CRM · The Data Foundation
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(64px,9vw,128px)', lineHeight: 0.92, letterSpacing: '2px', marginBottom: '32px', opacity: 0, animation: 'fadeUp 0.8s 0.4s forwards' }}>
            YOUR OPS.<br /><span style={{ color: '#FF5C1A' }}>INTELLIGENT.</span><br />NO PER-SEAT FEES.
          </h1>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(245,240,232,0.65)', marginBottom: '48px', opacity: 0, animation: 'fadeUp 0.8s 0.6s forwards' }}>
            Custom ERP built around how you actually work — not the other way around. HR, payroll, inventory, CRM — unified, AI-powered, and owned by you forever.
          </p>
          <div style={{ display: 'flex', gap: '16px', opacity: 0, animation: 'fadeUp 0.8s 0.8s forwards' }}>
            <a href="#live-demo" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>See the dashboard ↓</a>
            <a href="#compare" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>Compare to SAP / Tally</a>
          </div>
        </div>

        <HeroDashboard />
      </section>

      {/* MODULES */}
      <section style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Modules</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>EVERY MODULE.<br />AI INSIDE.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '60px' }}>Not modules bolted together. A single unified system where every part talks to every other part — and AI runs through all of it.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '16px' }}>
            {[
              { icon: '👥', title: 'HR & Payroll', desc: 'Attendance tracking, leave management, payslip generation, PF/ESI compliance. AI flags anomalies in attendance before month-end chaos.', aiBadge: '🧠 AI: auto-payroll anomaly detection' },
              { icon: '📦', title: 'Inventory Intelligence', desc: 'Real-time stock levels, auto-reorder points, demand forecasting, supplier management. AI predicts stockouts 14 days before they happen.', aiBadge: '🧠 AI: demand forecasting + auto-order' },
              { icon: '🎯', title: 'Sales CRM', desc: 'Lead pipeline, follow-up reminders, deal tracking, conversion analytics. AI scores leads, drafts follow-up messages, and predicts close probability.', aiBadge: '🧠 AI: lead scoring + message drafts' },
              { icon: '📊', title: 'BI Dashboards', desc: 'Real-time revenue, expense, and operations dashboards. Ask questions in plain Hindi or English — AI queries the data and answers.', aiBadge: '🧠 AI: natural language querying' },
              { icon: '💰', title: 'Finance & GST', desc: 'Invoice management, expense tracking, GST reconciliation, Tally sync. AI cross-checks GSTR-2B and flags mismatches before filing deadline.', aiBadge: '🧠 AI: GST auto-reconciliation' },
              { icon: '📲', title: 'WhatsApp Operations', desc: 'Your entire ERP accessible via WhatsApp. Approve leave, check inventory, get daily reports — without opening a single dashboard.', aiBadge: '🧠 AI: conversational ERP access' },
            ].map(m => <ModuleCard key={m.title} {...m} />)}
          </div>
        </Reveal>
      </section>

      {/* LIVE DEMO */}
      <section id="live-demo" style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Live Preview</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>EXPLORE THE<br />DASHBOARD.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>This is what your team would actually use. Real data, real AI actions, real time.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,92,26,0.2)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Tab nav */}
            <div style={{ background: '#2A2A2A', padding: '0 24px', display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[['hr', 'HR & Payroll'], ['inv', 'Inventory'], ['crm', 'CRM Pipeline']].map(([id, label]) => (
                <button key={id} onClick={() => setLiveTab(id)} style={{ padding: '16px 20px', fontSize: '13px', fontWeight: 600, color: liveTab === id ? '#FF5C1A' : '#888', cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: `2px solid ${liveTab === id ? '#FF5C1A' : 'transparent'}`, transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ padding: '32px' }}>
              {liveTab === 'hr' && <HRPanel />}
              {liveTab === 'inv' && <InventoryPanel />}
              {liveTab === 'crm' && <CRMPanel />}
            </div>
          </div>
        </Reveal>
      </section>

      {/* COMPARISON */}
      <section id="compare" style={{ padding: '100px 60px', background: '#1A1A1A' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Why not SAP / Tally?</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>BUILT FOR<br />YOUR SIZE.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>SAP costs ₹40L+. Tally has no AI. Zoho charges per seat forever. We build it once, you own it forever.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ border: '1px solid rgba(255,92,26,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: '#2A2A2A' }}>
              {['Feature', 'AetherSolve ERP', 'SAP / Oracle', 'Tally / Zoho'].map((h, i) => (
                <div key={h} style={{ padding: '16px 24px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: i === 1 ? '#FF5C1A' : '#888', background: i === 1 ? 'rgba(255,92,26,0.08)' : 'transparent', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>{h}</div>
              ))}
            </div>
            {[
              ['AI-powered modules', '<span style="color:#4ade80">✓</span> Every module', '<span style="color:#FF5C1A">Addon ₹₹₹</span>', '<span style="color:#f87171">✗</span>'],
              ['Per-seat pricing', '<span style="color:#4ade80">✗ None ever</span>', '<span style="color:#f87171">₹8K+/user/mo</span>', '<span style="color:#f87171">₹1.5K/user/mo</span>'],
              ['WhatsApp integration', '<span style="color:#4ade80">✓</span> Built-in', '<span style="color:#f87171">✗</span>', '<span style="color:#FF5C1A">Limited</span>'],
              ['Hindi language support', '<span style="color:#4ade80">✓</span> Full', '<span style="color:#f87171">✗</span>', '<span style="color:#FF5C1A">Partial</span>'],
              ['Custom to your workflow', '<span style="color:#4ade80">✓</span> 100%', '<span style="color:#f87171">You adapt to SAP</span>', '<span style="color:#FF5C1A">Templates only</span>'],
              ['One-time ownership', '<span style="color:#4ade80">✓</span> Yours forever', '<span style="color:#f87171">Annual license</span>', '<span style="color:#f87171">SaaS subscription</span>'],
              ['Local support in India', '<span style="color:#4ade80">✓</span> Bhilai team', '<span style="color:#FF5C1A">Global helpdesk</span>', '<span style="color:#FF5C1A">Remote only</span>'],
            ].map(([f, us, sap, tally]) => <CompareRow key={f} feature={f} us={us} sap={sap} tally={tally} />)}
          </div>
        </Reveal>
      </section>

      {/* PRICING */}
      <section style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Investment</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>ONE BUILD.<br />YOURS FOREVER.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>No monthly SaaS fees. No per-seat charges. Build it once, own it permanently.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '20px' }}>
            <PricingCard tier="STARTER" price="₹1.2L" note="For teams of 5–15. 3 core modules. 2-month build." features={['HR + Payroll module', 'Inventory management', 'Basic BI dashboard', '1 AI automation workflow', 'WhatsApp daily reports', '6 months AMC included']} cta="Start here →" />
            <PricingCard tier="GROWTH" price="₹3.5L" note="For teams of 15–50. Full suite. 4-month build." features={['All Starter modules', 'Full CRM pipeline + AI scoring', 'GST auto-reconciliation', '5 AI automation workflows', 'Voice interface (Hindi)', 'WhatsApp full ERP access', '12 months AMC included']} featured cta="Get this →" />
            <PricingCard tier="ENTERPRISE" price="Custom" note="50+ employees. Multi-branch. Complex workflows." features={['Everything in Growth', 'Multi-branch support', 'Custom AI model training', 'API integrations (SAP, Tally)', 'Dedicated support engineer', '24/7 monitoring SLA']} cta="Let's talk →" />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: '120px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,92,26,0.1) 0%, transparent 70%)' }} />
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px', position: 'relative' }}>Get Started</div>
        <Reveal>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.95, marginBottom: '24px', position: 'relative' }}>
            YOUR ERP.<br /><span style={{ color: '#FF5C1A' }}>YOUR RULES.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}><p style={{ fontSize: '18px', color: 'rgba(245,240,232,0.55)', marginBottom: '48px', position: 'relative' }}>Tell us your team size and your biggest operational headache. We'll send you a custom scope and timeline in 48 hours.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
            <a href="mailto:hello@aethersolve.com" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>Request a demo →</a>
            <Link href="/services/cloud-hosting" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>Explore Cloud Hosting</Link>
          </div>
        </Reveal>
      </section>

      <footer style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#888', flexWrap: 'wrap', gap: '16px' }}>
        <div>© 2026 AetherSolve Technologies Pvt. Ltd. · Bhilai, Chhattisgarh</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/services/ai-automation', 'AI Automation'], ['/services/cloud-hosting', 'Cloud'], ['mailto:hello@aethersolve.com', 'Contact']].map(([href, label]) => (
            <Link key={label} href={href} style={{ color: '#888', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}