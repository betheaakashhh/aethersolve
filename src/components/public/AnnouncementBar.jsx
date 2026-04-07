'use client';
// src/components/public/AnnouncementBar.jsx
import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const { on } = useWebSocket('public');

  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('dismissedAnnouncements') || '[]');
    setDismissed(new Set(saved));
    fetch('/api/announcements').then(r => r.json()).then(d => setAnnouncements(d.announcements || []));
  }, []);

  useEffect(() => {
    const unsub = on('announcement_update', (payload) => {
      if (payload.action === 'create') setAnnouncements(p => [payload.announcement, ...p]);
      if (payload.action === 'delete') setAnnouncements(p => p.filter(a => a.id !== payload.id));
    });
    return unsub;
  }, [on]);

  const visible = announcements.filter(a => !dismissed.has(a.id));

  const dismiss = (id) => {
    const next = new Set([...dismissed, id]);
    setDismissed(next);
    sessionStorage.setItem('dismissedAnnouncements', JSON.stringify([...next]));
    if (current >= visible.length - 1) setCurrent(Math.max(0, visible.length - 2));
  };

  if (!visible.length) return null;
  const ann = visible[current] || visible[0];
  if (!ann) return null;

  return (
   <div style={{ background: 'var(--surface-2)', color: 'var(--text)', position: 'relative', zIndex: 200, borderBottom: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--accent)', color: '#fff', borderRadius: '100px', padding: '2px 9px', fontSize: '10.5px', fontWeight: 700, fontFamily: 'var(--font-body)', letterSpacing: '0.06em', flexShrink: 0 }}>
            <Sparkles size={9} /> NEW
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ann.title}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-3)', hidden: true }} className="hidden-mobile">
            — {ann.content}
          </span>
          {ann.link && (
            <a href={ann.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 }}>
              {ann.linkText || 'Learn more'} <ArrowRight size={11} />
            </a>
          )}
        </div>
        <button onClick={() => dismiss(ann.id)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', flexShrink: 0, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-3)'; }}
        >
          <X size={13} />
        </button>
      </div>
      <style>{`@media(max-width:767px){.hidden-mobile{display:none!important}}`}</style>
    </div>
  );
}