'use client';
// src/components/public/HeroSection.jsx
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

// ── Particle canvas ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', () => { mouse.current = { x: -9999, y: -9999 }; });

    const COUNT = 72;
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * 1400, y: Math.random() * 900,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.5 + .5,
      alpha: Math.random() * .35 + .08,
      accent: Math.random() < .16,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const { x: mx, y: my } = mouse.current;
      const REPEL = 130;

      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        const dx = p.x - mx, dy = p.y - my;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < REPEL) {
          const f = (1 - d / REPEL) * 55;
          p.x += (dx / d) * f * .04;
          p.y += (dy / d) * f * .04;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accent
          ? `rgba(255,92,26,${p.alpha})`
          : `rgba(150,150,150,${p.alpha * .55})`;
        ctx.fill();
      });

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i+1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < 105) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(160,160,160,${(1 - d/105) * .07})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }

      // mouse halo
      if (mx > 0 && mx < W) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        g.addColorStop(0, 'rgba(255,92,26,0.06)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', display: 'block',
    }} />
  );
}

// ── Rotating word ─────────────────────────────────────────────────────────────




// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const start = Date.now(), dur = 1600;
        const tick = () => {
          const t = Math.min((Date.now()-start)/dur, 1);
          setN(Math.floor((1 - Math.pow(1-t, 3)) * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// ── Dashboard mockup ──────────────────────────────────────────────────────────
function DashMock() {
  const bars = [38,55,32,78,52,88,68,82,57,93,70,100];
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: '18px', overflow: 'hidden',
      border: '1px solid var(--border)',
      boxShadow: '0 30px 80px rgba(0,0,0,0.11)',
    }}>
      {/* chrome */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'12px 16px', background:'var(--bg-2)', borderBottom:'1px solid var(--border)' }}>
        {['#ff5f57','#febc2e','#28c840'].map(c => <span key={c} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }} />)}
        <div style={{ flex:1, height:'22px', borderRadius:'5px', background:'var(--bg-3)', margin:'0 10px', display:'flex', alignItems:'center', paddingLeft:'10px' }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'10.5px', color:'var(--text-4)' }}>app.aethersolve.com/dashboard</span>
        </div>
      </div>
      {/* body */}
      <div style={{ display:'grid', gridTemplateColumns:'170px 1fr', minHeight:'260px' }}>
        {/* sidebar */}
        <div style={{ background:'var(--bg-2)', padding:'16px 12px', borderRight:'1px solid var(--border)' }}>
          <div style={{ height:'6px', borderRadius:'100px', background:'var(--accent)', width:'64px', marginBottom:'18px' }} />
          {['Overview','Projects','Clients','Analytics','Settings'].map((item, i) => (
            <div key={item} style={{ display:'flex', alignItems:'center', gap:'7px', padding:'7px 9px', borderRadius:'7px', marginBottom:'3px', background: i===0 ? 'var(--accent-soft)' : 'transparent' }}>
              <div style={{ width:'4px', height:'4px', borderRadius:'50%', background: i===0 ? 'var(--accent)' : 'var(--border-2)' }} />
              <div style={{ height:'5.5px', borderRadius:'100px', background: i===0 ? 'var(--accent)' : 'var(--bg-3)', width:`${38+i*10}px` }} />
            </div>
          ))}
        </div>
        {/* main */}
        <div style={{ padding:'16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'12px' }}>
            {[['99.97%','Uptime','var(--accent)'],['<120ms','Response','#22c55e'],['10M+','Req/Day','#3b82f6']].map(([v,l,c]) => (
              <div key={l} style={{ padding:'12px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'10px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'16px', color:c, letterSpacing:'-0.4px' }}>{v}</div>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', color:'var(--text-4)', marginTop:'2px' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'13px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'10px', marginBottom:'9px' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'9.5px', color:'var(--text-4)', marginBottom:'8px', letterSpacing:'0.06em' }}>REQUESTS — 30D</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'3px', height:'52px' }}>
              {bars.map((h, i) => (
                <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0', height:`${h}%`, background: i===11 ? 'var(--accent)' : i>8 ? 'var(--accent-soft2)' : 'var(--bg-3)' }} />
              ))}
            </div>
          </div>
          {[['FinEdge platform deployed','2m'],['EduPath — 1K users online','8m'],['AI pipeline: 4K docs','14m']].map(([t,time]) => (
            <div key={t} style={{ display:'flex', justifyContent:'space-between', padding:'7px 10px', background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:'7px', marginBottom:'5px' }}>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'10.5px', color:'var(--text-2)' }}>{t}</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:'10px', color:'var(--text-4)' }}>{time} ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TICKER items ──────────────────────────────────────────────────────────────
const TICKER = ['Web Development','Mobile Apps','UI/UX Design','ERP Systems','AI Integration','Cloud Hosting','Fintech','EdTech','HealthTech','SaaS Products','DevOps','Analytics'];

// ── Main export ───────────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <>
      <section style={{ position:'relative', background:'var(--bg)', paddingTop:'12px', overflow:'hidden' }}>

        {/* Particles */}
        <div style={{ position:'absolute', inset:0, zIndex:0 }}>
          <ParticleCanvas />
        </div>

       <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[clamp(5rem,16vw,14rem)] font-['Syne'] font-black text-zinc-500/[0.10] whitespace-nowrap select-none pointer-events-none leading-none"
      >
        AetherSolve
      </div>
        {/* Top orange radial */}
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'860px', height:'520px', background:'radial-gradient(ellipse at 50% 0%, rgba(255,92,26,0.07) 0%, transparent 62%)', pointerEvents:'none', zIndex:0 }} />

        {/* ── CENTERED TEXT ── */}
        <div style={{ position:'relative', zIndex:1, maxWidth:'780px', margin:'0 auto', padding:'104px 24px 68px', textAlign:'center' }}>

          {/* Eyebrow */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            padding:'6px 18px', borderRadius:'100px',
            border:'1px solid var(--border-2)', background:'rgba(255,255,255,0.06)',
            backdropFilter:'blur(12px)',
            marginBottom:'36px',
            animation:'fadeUp .8s cubic-bezier(.16,1,.3,1) both',
            background : 'linear-gradient(135deg, rgba(255,92,26,0.08) 0%, rgba(255,92,26,0.02) 100%)',
          }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent)', display:'inline-block', animation:'pulseRing 2s infinite' }} />
            <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:'11.5px', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-3)' }}>
              Ai Automation &amp; Software Systems for Mid-Size Businesses
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontWeight:900,
            fontSize:'clamp(50px, 3.5vw, 98px)',
            lineHeight:0.97,
            letterSpacing:'clamp(-2px,-0.04em,-4.5px)',
            color:'var(--text)',
            marginBottom:'26px',
            animation:'fadeUp .8s cubic-bezier(.16,1,.3,1) .1s both',
            
          }}>
           We <span className="text-accent-1" style={{ color: 'var(--accent)', fontSize:'1.2em', textTransform:'uppercase' }}>automate</span> the operations that cost you <span className='text-accent-2' style={{ color: 'var(--accent)', fontSize:'1.2em', textTransform:'uppercase' }}>time</span> and <span className='text-accent-3' style={{ color: 'var(--accent)', fontSize:'1.2em', textTransform:'uppercase' }}>money</span>.
          </h1>

          {/* Body */}
          <p style={{
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            fontWeight:400, fontSize:'clamp(15px,1.8vw,18px)',
            lineHeight:1.8, color:'var(--text-3)',
            maxWidth:'520px', margin:'0 auto 44px',
            animation:'fadeUp .8s cubic-bezier(.16,1,.3,1) .2s both',
          }}>
            AetherSolve builds AI-powered systems for mid-size businesses — connecting your data, your workflows, and your teams into one intelligent operation.
No generic dashboards. No demo bots. Systems that actually run your business.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'12px', marginBottom:'64px', animation:'fadeUp .8s cubic-bezier(.16,1,.3,1) .3s both' }}>
            <a href="#services" className="btn btn-primary" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'14.5px', padding:'14px 30px', borderRadius:'100px', boxShadow:'0 4px 24px rgba(255,92,26,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(255,92,26,0.42)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(255,92,26,0.3)'; }}
            >
              Explore Services <ArrowRight size={16}/>
            </a>
            <a href="/company/work" style={{
              display:'inline-flex', alignItems:'center', gap:'7px',
              padding:'14px 28px', borderRadius:'100px',
              border:'1.5px solid var(--border-2)', background:'transparent',
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:600, fontSize:'14.5px',
              color:'var(--text)', textDecoration:'none', transition:'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--text-4)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-2)'; e.currentTarget.style.transform='translateY(0)'; }}
            >
              View Our Work <ArrowUpRight size={15}/>
            </a>
          </div>

          {/* Stats */}
          
        </div>

        {/* ── DASHBOARD MOCKUP ── */}
        <div style={{ position:'relative', zIndex:1, maxWidth:'820px', margin:'0 auto', padding:'0 24px', animation:'fadeUp .9s cubic-bezier(.16,1,.3,1) .5s both' }}>
          <DashMock />
        </div>

        {/* ── TICKER ── */}
        <div style={{ overflow:'hidden', marginTop:'72px', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'12px 0', background:'var(--bg-2)', position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', animation:'ticker 34s linear infinite', whiteSpace:'nowrap' }}>
            {[...TICKER,...TICKER,...TICKER].map((item, i) => (
              <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'20px', padding:'0 20px', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'10.5px', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color: i%5===0 ? 'var(--accent)' : 'var(--text-4)', whiteSpace:'nowrap' }}>
                {item}
                <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'var(--border-2)', display:'inline-block' }} />
              </span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ticker { from { transform:translateX(0); } to { transform:translateX(-33.33%); } }
        @keyframes pulseRing {
          0%,100% { box-shadow:0 0 0 0 rgba(255,92,26,.45); }
          50% { box-shadow:0 0 0 6px rgba(255,92,26,0); }
        }
      `}</style>
    </>
  );
}