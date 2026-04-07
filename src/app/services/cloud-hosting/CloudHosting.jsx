'use client';
// src/app/services/cloud-hosting/page.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
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

// ── Matrix Canvas Background ──────────────────────────────────────────────────
function MatrixCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(9,9,9,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FF5C1A';
      ctx.font = '14px DM Mono, monospace';
      drops.forEach((y, i) => {
        const char = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(char, i * 20, y * 20);
        if (y * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const id = setInterval(draw, 80);
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { clearInterval(id); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }} />;
}

// ── Terminal ──────────────────────────────────────────────────────────────────
const termLines = [
  { type: 'cmd', text: 'kubectl get pods -n production' },
  { type: 'out-green', text: 'api-server-7d9f    1/1   Running  0  2d' },
  { type: 'out-green', text: 'db-primary-4k2p    1/1   Running  0  2d' },
  { type: 'out-green', text: 'redis-cache-8m1x   1/1   Running  0  2d' },
  { type: 'out-green', text: 'ai-pipeline-3n7q   1/1   Running  0  4h' },
  { type: 'cmd', text: 'kubectl top nodes' },
  { type: 'out-blue', text: 'node-1   CPU: 34%   MEM: 61%' },
  { type: 'out-blue', text: 'node-2   CPU: 28%   MEM: 55%' },
  { type: 'cmd', text: 'tail -f /var/log/nginx/access.log' },
  { type: 'out-muted', text: '10.0.1.45 GET /api/v1/dispatch 200 42ms' },
  { type: 'out-muted', text: '10.0.1.12 POST /api/v1/ai/query 200 118ms' },
  { type: 'out-warn', text: '⚡ Auto-scaled: 2→3 instances (traffic spike)' },
  { type: 'out-green', text: '✓ New instance healthy, routing resumed' },
];

function Terminal() {
  const [lines, setLines] = useState([]);
  const idxRef = useRef(0);
  const timerRef = useRef(null);

  const addLine = useCallback(() => {
    if (idxRef.current >= termLines.length) { idxRef.current = 0; setLines([]); }
    const line = termLines[idxRef.current++];
    setLines(prev => [...prev.slice(-13), { ...line, id: Date.now() + Math.random() }]);
    timerRef.current = setTimeout(addLine, line.type === 'cmd' ? 1200 : 400);
  }, []);

  useEffect(() => { timerRef.current = setTimeout(addLine, 800); return () => clearTimeout(timerRef.current); }, [addLine]);

  const typeColor = { 'out-green': '#4ade80', 'out-blue': '#60a5fa', 'out-muted': '#888', 'out-warn': '#FF5C1A' };

  return (
    <div style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', width: '460px', opacity: 0, animation: 'fadeUp 0.8s 1s forwards' }}>
      <div style={{ background: '#050505', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 0 60px rgba(74,222,128,0.05), 0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ background: '#2A2A2A', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#f87171', '#fbbf24', '#4ade80'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#888', marginLeft: '8px' }}>aethersolve_infra · prod</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4ade80' }}>
            <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            live
          </div>
        </div>
        <div style={{ padding: '20px', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.8, minHeight: '200px' }}>
          {lines.map(l => (
            <div key={l.id} style={{ marginBottom: '2px' }}>
              {l.type === 'cmd'
                ? <><span style={{ color: '#FF5C1A' }}>$ </span><span style={{ color: '#F5F0E8' }}>{l.text}</span></>
                : <span style={{ color: typeColor[l.type] }}>{l.text}</span>
              }
            </div>
          ))}
          <div>
            <span style={{ color: '#FF5C1A' }}>$ </span>
            <span style={{ display: 'inline-block', width: '7px', height: '14px', background: '#4ade80', verticalAlign: 'middle', animation: 'blink 1s infinite' }} />
          </div>
        </div>
      </div>
      {/* Status bars */}
      <div style={{ marginTop: '12px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px 20px' }}>
        {[['API Gateway', '99.9%'], ['Database Cluster', '99.97%'], ['CDN Edge', '100%'], ['AI Pipeline', '99.8%']].map(([name, pct]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888' }}>{name}</span>
            <div style={{ flex: 1, margin: '0 16px', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#4ade80', borderRadius: '2px', width: pct }} />
            </div>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4ade80' }}>{pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Infra Diagram ─────────────────────────────────────────────────────────────
function InfraLayer({ icon, name, desc, tech, status }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', gap: '12px', padding: '20px 24px', background: '#090909', borderRadius: '10px', border: `1px solid ${hover ? 'rgba(255,92,26,0.3)' : 'rgba(255,255,255,0.06)'}`, alignItems: 'center', cursor: 'default', transition: 'all 0.3s', background: hover ? 'rgba(255,92,26,0.03)' : '#090909' }}
    >
      <div style={{ fontSize: '24px', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{name}</div>
        <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{desc}</div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '200px' }}>
        {tech.map(t => <span key={t} style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', padding: '3px 8px', borderRadius: '3px', background: 'rgba(255,92,26,0.1)', color: '#FF5C1A', border: '1px solid rgba(255,92,26,0.2)' }}>{t}</span>)}
      </div>
      <div style={{ marginLeft: '12px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4ade80', flexShrink: 0 }}>{status}</div>
    </div>
  );
}

// ── Latency Spark ─────────────────────────────────────────────────────────────
function LatencySpark() {
  const vals = Array.from({ length: 40 }, () => 20 + Math.random() * 70);
  return (
    <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '3px', marginBottom: '12px' }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: 1, borderRadius: '2px 2px 0 0', height: `${v}%`, background: v > 70 ? '#FF5C1A' : 'rgba(74,222,128,0.6)' }} />
      ))}
    </div>
  );
}

// ── Uptime Calendar ───────────────────────────────────────────────────────────
function UptimeCal() {
  const days = Array.from({ length: 90 }, (_, i) => {
    if (i === 45) return '#f87171';
    return Math.random() > 0.97 ? '#FF5C1A' : 'rgba(74,222,128,0.6)';
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14,1fr)', gap: '3px' }}>
      {days.map((c, i) => <div key={i} style={{ height: '16px', borderRadius: '2px', background: c }} />)}
    </div>
  );
}

// ── Request Counter ───────────────────────────────────────────────────────────
function ReqCounter() {
  const [count, setCount] = useState(847234);
  useEffect(() => {
    const t = setInterval(() => setCount(v => v + Math.floor(Math.random() * 8 + 2)), 350);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', color: '#4ade80', lineHeight: 1 }}>
      {count.toLocaleString('en-IN')}
    </div>
  );
}

// ── Manage Card ───────────────────────────────────────────────────────────────
function ManageCard({ icon, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: '#1A1A1A', border: `1px solid ${hover ? 'rgba(255,92,26,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '10px', padding: '28px', transition: 'all 0.3s', transform: hover ? 'translateY(-4px)' : 'none', cursor: 'default' }}
    >
      <div style={{ fontSize: '28px', marginBottom: '14px' }}>{icon}</div>
      <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</div>
      <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{desc}</div>
    </div>
  );
}

// ── Monitor Card ─────────────────────────────────────────────────────────────
function MonitorCard({ title, statusText, statusColor = '#4ade80', children }) {
  return (
    <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: '#2A2A2A', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#F5F0E8' }}>{title}</span>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: statusColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', background: statusColor, borderRadius: '50%', display: 'inline-block' }} />
          {statusText}
        </span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

// ── SLA Card ─────────────────────────────────────────────────────────────────
function SLACard({ val, label, note }) {
  return (
    <div style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '52px', color: '#FF5C1A', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.6)', marginTop: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</div>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4ade80', marginTop: '8px' }}>{note}</div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CloudHostingPage() {
  return (
    <div style={{ background: '#090909', color: '#F5F0E8', fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes orbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
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
        <a href="#contact" style={{ background: '#FF5C1A', color: '#fff', padding: '10px 24px', borderRadius: '4px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Get infrastructure</a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px', position: 'relative', overflow: 'hidden' }}>
        <MatrixCanvas />
        <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'rgba(255,92,26,0.08)', borderRadius: '50%', filter: 'blur(120px)', top: '-100px', right: '100px', animation: 'orbFloat 12s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'rgba(96,165,250,0.05)', borderRadius: '50%', filter: 'blur(120px)', bottom: '100px', left: '100px', animation: 'orbFloat 16s ease-in-out infinite reverse', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,92,26,0.18)', border: '1px solid rgba(255,92,26,0.3)', padding: '8px 16px', borderRadius: '100px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', marginBottom: '32px', width: 'fit-content', opacity: 0, animation: 'fadeUp 0.8s 0.2s forwards' }}>
          <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          Managed Cloud Infrastructure · Always On
        </div>

        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(64px,9vw,128px)', lineHeight: 0.92, letterSpacing: '2px', marginBottom: '32px', opacity: 0, animation: 'fadeUp 0.8s 0.4s forwards' }}>
          INFRASTRUCTURE<br />THAT <span style={{ color: '#FF5C1A' }}>NEVER</span><br />SLEEPS.
        </h1>

        <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(245,240,232,0.65)', marginBottom: '32px', maxWidth: '540px', opacity: 0, animation: 'fadeUp 0.8s 0.6s forwards' }}>
          Every system we build, we host and maintain. AWS/GCP, auto-scaling, 24/7 monitoring, CI/CD pipelines — so you never think about servers again.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', padding: '12px 24px', borderRadius: '8px', fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#4ade80', marginBottom: '32px', width: 'fit-content', opacity: 0, animation: 'fadeUp 0.8s 0.7s forwards' }}>
          <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80', animation: 'pulse 2s infinite' }} />
          99.97% uptime SLA · guaranteed in writing
        </div>

        <div style={{ display: 'flex', gap: '16px', opacity: 0, animation: 'fadeUp 0.8s 0.8s forwards' }}>
          <a href="#infra" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>See the stack ↓</a>
          <a href="#monitoring" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>View live monitoring</a>
        </div>

        <Terminal />
      </section>

      {/* INFRA DIAGRAM */}
      <section id="infra" style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Architecture</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>BUILT FOR<br />PRODUCTION.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>Every project gets a production-grade stack — not shared hosting, not a single server. Redundant, observable, and scalable from day one.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,92,26,0.15)', borderRadius: '16px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#888', marginBottom: '40px' }}>// aethersolve · production architecture · client stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { icon: '🌐', name: 'CDN & Edge Layer', desc: 'Global content delivery, DDoS protection, SSL termination, edge caching', tech: ['CloudFront', 'Cloudflare', 'WAF'], status: '● 100%' },
                { icon: '⚖️', name: 'Load Balancer & API Gateway', desc: 'Traffic distribution, rate limiting, auth middleware, request routing', tech: ['ALB', 'Nginx', 'Kong'], status: '● 99.99%' },
                { icon: '🐳', name: 'Application Containers', desc: 'Dockerized services, auto-scaling, health checks, rolling deployments via CI/CD', tech: ['Docker', 'ECS/K8s', 'GitHub Actions'], status: '● 99.97%' },
                { icon: '🗄️', name: 'Database & Cache Layer', desc: 'PostgreSQL with read replicas, Redis caching, automated backups, point-in-time recovery', tech: ['RDS PostgreSQL', 'ElastiCache', 'S3 Backups'], status: '● 99.97%' },
                { icon: '📊', name: 'Monitoring & Observability', desc: 'Real-time metrics, error tracking, latency alerts, log aggregation, uptime checks', tech: ['Grafana', 'Prometheus', 'Sentry'], status: '● Active' },
              ].map((layer, i, arr) => (
                <div key={layer.name}>
                  <InfraLayer {...layer} />
                  {i < arr.length - 1 && <div style={{ height: '16px', width: '1px', background: 'rgba(255,92,26,0.2)', marginLeft: '32px' }} />}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHAT WE MANAGE */}
      <section style={{ padding: '100px 60px', background: '#1A1A1A' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Managed Services</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>WE OWN IT.<br />YOU SLEEP.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>Everything that would otherwise require a full-time DevOps engineer — we handle it as part of every project we build.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '16px' }}>
            {[
              { icon: '🔄', title: 'CI/CD Pipelines', desc: 'Every code push automatically tests, builds, and deploys. No manual deployments. No "it worked locally."' },
              { icon: '📈', title: 'Auto-scaling', desc: 'Traffic spike at 2am? Your system scales up automatically. Quiet Sunday? Scales down to save cost. Zero intervention.' },
              { icon: '🔒', title: 'Security Patching', desc: 'OS updates, dependency patches, SSL renewal, vulnerability scanning — applied automatically, logged, and reported.' },
              { icon: '💾', title: 'Automated Backups', desc: 'Daily database backups with 30-day retention. Point-in-time recovery. Tested monthly. Your data is never at risk.' },
              { icon: '🚨', title: '24/7 Alerting', desc: 'We know your system is down before you do. PagerDuty alerts, auto-diagnosis, and response — not just a notification.' },
              { icon: '💰', title: 'Cost Optimization', desc: 'Monthly AWS/GCP bill review, right-sizing recommendations, reserved instance planning. Most clients save 20–40%.' },
              { icon: '🌐', title: 'Domain & DNS', desc: 'Domain management, DNS configuration, subdomain routing, email deliverability — all handled and documented.' },
              { icon: '📋', title: 'Monthly Reports', desc: 'Uptime report, cost breakdown, performance trends, security scan results — delivered to your inbox every month.' },
            ].map(c => <ManageCard key={c.title} {...c} />)}
          </div>
        </Reveal>
      </section>

      {/* LIVE MONITORING */}
      <section id="monitoring" style={{ padding: '100px 60px' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Live Monitoring</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>EVERY METRIC.<br />EVERY SECOND.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>This is what our monitoring looks like for every client — real-time, not a static screenshot.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Latency */}
            <MonitorCard title="API response latency" statusText="p95: 87ms">
              <LatencySpark />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', marginBottom: '16px' }}>
                <span>-60s</span><span>now</span>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {[['p50', '42ms', '#4ade80'], ['p95', '87ms', '#4ade80'], ['p99', '210ms', '#FF5C1A']].map(([l, v, c]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888' }}>{l}</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </MonitorCard>

            {/* Uptime */}
            <MonitorCard title="90-day uptime history" statusText="99.97% this quarter">
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', marginBottom: '12px' }}>Each block = 1 day · Green = 100% · Orange = degraded · Red = incident</div>
              <UptimeCal />
              <div style={{ marginTop: '16px', display: 'flex', gap: '16px', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                <span style={{ color: '#4ade80' }}>■ 100% (87 days)</span>
                <span style={{ color: '#FF5C1A' }}>■ Degraded (2 days)</span>
                <span style={{ color: '#f87171' }}>■ Incident (1 day)</span>
              </div>
            </MonitorCard>

            {/* Request counter */}
            <MonitorCard title="Requests served today" statusText="live">
              <ReqCounter />
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888', marginTop: '4px', marginBottom: '20px' }}>requests since midnight</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[['Error rate', '0.02%', '#4ade80'], ['Cache hit', '94.3%', '#4ade80']].map(([l, v, c]) => (
                  <div key={l} style={{ background: '#090909', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '12px' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888' }}>{l}</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </MonitorCard>

            {/* Alert feed */}
            <MonitorCard title="Recent alerts" statusText="All resolved">
              {[
                { icon: '✅', text: 'Auto-scaled from 2→4 instances · peak traffic handled', time: '2m ago' },
                { icon: '🔒', text: 'SSL certificate renewed automatically · valid 90 days', time: '1h ago' },
                { icon: '💾', text: 'Daily backup completed · 847MB · verified', time: '3h ago' },
                { icon: '📦', text: 'Security patch applied · Node 22.4.1 → 22.5.0', time: 'yesterday' },
                { icon: '⚠️', text: 'CPU spike detected · auto-resolved in 40s · no impact', time: '2d ago' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: '12px' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{a.icon}</span>
                  <span style={{ flex: 1, color: 'rgba(245,240,232,0.7)', lineHeight: 1.4, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{a.text}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888', flexShrink: 0 }}>{a.time}</span>
                </div>
              ))}
            </MonitorCard>

          </div>
        </Reveal>
      </section>

      {/* SLA */}
      <section style={{ padding: '100px 60px', background: '#1A1A1A' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Commitments</div>
        <Reveal><h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(40px,6vw,80px)', lineHeight: 0.95, letterSpacing: '1px', marginBottom: '20px' }}>NUMBERS<br />WE STAND BEHIND.</h2></Reveal>
        <Reveal delay={100}><p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '48px' }}>Not aspirational. Written into the contract. If we miss these, you get refunded.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px' }}>
            <SLACard val="99.97%" label="Uptime SLA" note="~2.6 hours max downtime/year" />
            <SLACard val="<2hr" label="Incident response" note="Critical issues, 24/7" />
            <SLACard val="<120ms" label="API response (p95)" note="Measured from India" />
            <SLACard val="Daily" label="Automated backups" note="30-day retention" />
            <SLACard val="0" label="Manual deploy steps" note="Full CI/CD, always" />
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: '120px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(255,92,26,0.08) 0%, transparent 70%)' }} />
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#FF5C1A', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px', position: 'relative' }}>Deploy with us</div>
        <Reveal>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(48px,8vw,100px)', lineHeight: 0.95, marginBottom: '24px', position: 'relative' }}>
            NEVER THINK<br /><span style={{ color: '#FF5C1A' }}>ABOUT SERVERS.</span>
          </h2>
        </Reveal>
        <Reveal delay={100}><p style={{ fontSize: '18px', color: 'rgba(245,240,232,0.55)', marginBottom: '48px', position: 'relative' }}>Tell us what you're building. We'll design the right infrastructure stack and quote you within 48 hours.</p></Reveal>
        <Reveal delay={200}>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', position: 'relative' }}>
            <a href="mailto:hello@aethersolve.com" style={{ background: '#FF5C1A', color: '#fff', padding: '16px 32px', borderRadius: '4px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>Start the conversation →</a>
            <Link href="/services/ai-automation" style={{ color: '#F5F0E8', padding: '16px 32px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(245,240,232,0.15)', borderRadius: '4px' }}>Back to AI Automation</Link>
          </div>
        </Reveal>
      </section>

      <footer style={{ padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#888', flexWrap: 'wrap', gap: '16px' }}>
        <div>© 2026 AetherSolve Technologies Pvt. Ltd. · Bhilai, Chhattisgarh</div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[['/', 'Home'], ['/services/ai-automation', 'AI Automation'], ['/services/erp-crm', 'ERP & CRM'], ['mailto:hello@aethersolve.com', 'Contact']].map(([href, label]) => (
            <Link key={label} href={href} style={{ color: '#888', textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}