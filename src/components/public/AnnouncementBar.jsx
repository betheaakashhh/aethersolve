// src/components/public/AnnouncementBar.jsx
'use client';
import { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [current, setCurrent] = useState(0);
  const { on } = useWebSocket('public');

  useEffect(() => {
    const savedDismissed = JSON.parse(sessionStorage.getItem('dismissedAnnouncements') || '[]');
    setDismissed(new Set(savedDismissed));

    fetch('/api/announcements')
      .then(r => r.json())
      .then(d => setAnnouncements(d.announcements || []));
  }, []);

  useEffect(() => {
    const unsub = on('announcement_update', (payload) => {
      if (payload.action === 'create') {
        setAnnouncements(prev => [payload.announcement, ...prev]);
      } else if (payload.action === 'delete') {
        setAnnouncements(prev => prev.filter(a => a.id !== payload.id));
      }
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
    <div className="relative z-50 bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="hidden sm:flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0">
            <Sparkles size={10} />
            NEW
          </span>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-sm truncate">{ann.title}</span>
            <span className="text-white/70 text-sm hidden md:inline truncate">— {ann.content}</span>
          </div>
          {ann.link && (
            <a
              href={ann.link}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full transition-colors shrink-0"
            >
              {ann.linkText || 'Learn more'}
              <ArrowRight size={10} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {visible.length > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {visible.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => dismiss(ann.id)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
