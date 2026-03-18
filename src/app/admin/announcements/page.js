// src/app/admin/announcements/page.js
'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, Save, Megaphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

function AnnouncementForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: '', content: '', link: '', linkText: '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.content) { toast.error('Title and content required'); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="admin-card border-brand-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{initial ? 'Edit Announcement' : 'New Announcement'}</h3>
        <button onClick={onCancel}><X size={16} className="text-slate-400" /></button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Title * <span className="text-slate-400 font-normal">(shown in bold)</span></label>
        <input
          className="input-field text-sm"
          placeholder="🚀 New Service Launched"
          value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Content * <span className="text-slate-400 font-normal">(shown after em-dash)</span></label>
        <input
          className="input-field text-sm"
          placeholder="AetherSolve now offers AI automation integration for enterprise clients."
          value={form.content}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">CTA Link <span className="text-slate-400 font-normal">(optional)</span></label>
          <input
            className="input-field text-sm"
            placeholder="https://... or #section"
            value={form.link}
            onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">CTA Label</label>
          <input
            className="input-field text-sm"
            placeholder="Explore AI Services"
            value={form.linkText}
            onChange={e => setForm(p => ({ ...p, linkText: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> {initial ? 'Update' : 'Publish'}</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm py-2.5">Cancel</button>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { send } = useWebSocket('admin');

  const fetchAll = async () => {
    // Fetch all including inactive for admin
    const res = await fetch('/api/announcements');
    const d = await res.json();
    setAnnouncements(d.announcements || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (form) => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success('Announcement published!');
      setShowForm(false);
      fetchAll();
      send('announcement_update', { action: 'create', announcement: d.announcement });
    } else {
      toast.error(d.error);
    }
  };

  const handleUpdate = async (form) => {
    const res = await fetch(`/api/announcements/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success('Updated!');
      setEditing(null);
      fetchAll();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    fetchAll();
    send('announcement_update', { action: 'delete', id });
  };

  const toggleActive = async (a) => {
    await fetch(`/api/announcements/${a.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !a.isActive }),
    });
    fetchAll();
    send('announcement_update', { action: a.isActive ? 'delete' : 'create', id: a.id });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the update bar shown at the top of the website</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Preview of bar */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 rounded-xl p-3 flex items-center gap-3">
        <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PREVIEW</span>
        <span className="text-white text-sm font-semibold">
          {announcements.find(a => a.isActive)?.title || 'No active announcement'}
        </span>
        <span className="text-white/70 text-sm hidden sm:inline">
          — {announcements.find(a => a.isActive)?.content || 'Create one below'}
        </span>
      </div>

      {showForm && !editing && (
        <AnnouncementForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Megaphone size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No announcements yet</p>
          <p className="text-sm">Create your first announcement to show it on the website.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map(a => (
            <div key={a.id}>
              {editing?.id === a.id ? (
                <AnnouncementForm initial={a} onSave={handleUpdate} onCancel={() => setEditing(null)} />
              ) : (
                <div className={`admin-card transition-all ${!a.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.isActive ? 'bg-brand-100' : 'bg-slate-100'}`}>
                      <Megaphone size={16} className={a.isActive ? 'text-brand-600' : 'text-slate-400'} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm">{a.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.isActive ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                          {a.isActive ? 'LIVE' : 'HIDDEN'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{a.content}</p>
                      {a.link && (
                        <p className="text-xs text-brand-500">→ {a.linkText || a.link} ({a.link})</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-2">
                        Created {format(new Date(a.createdAt), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleActive(a)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title={a.isActive ? 'Hide' : 'Show'}>
                        {a.isActive
                          ? <ToggleRight size={18} className="text-teal-500" />
                          : <ToggleLeft size={18} className="text-slate-400" />
                        }
                      </button>
                      <button onClick={() => { setEditing(a); setShowForm(false); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
