// src/app/admin/testimonials/page.js
'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Star, Loader2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

const BADGE_OPTIONS = ['Verified Client', 'Enterprise', 'Fintech', 'EdTech', 'HealthTech', 'SaaS', 'ERP', 'CRM', 'AI/ML', 'Logistics', 'Real Estate', 'Retail', 'Compliance'];

function TestimonialForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', role: '', company: '', content: '',
    imageUrl: '', badges: [], rating: 5,
  });
  const [saving, setSaving] = useState(false);

  const toggleBadge = (b) => setForm(p => ({
    ...p,
    badges: p.badges.includes(b) ? p.badges.filter(x => x !== b) : [...p.badges, b]
  }));

  const handleSave = async () => {
    if (!form.name || !form.role || !form.company || !form.content) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="admin-card border-brand-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{initial ? 'Edit Testimonial' : 'New Testimonial'}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={16} /></button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name *</label>
          <input className="input-field text-sm" placeholder="Rajesh Mehta" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role / Title *</label>
          <input className="input-field text-sm" placeholder="CTO" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Company *</label>
          <input className="input-field text-sm" placeholder="FinEdge Solutions" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Testimonial Content *</label>
        <textarea
          className="input-field text-sm resize-none"
          rows={4}
          placeholder="What did the client say..."
          value={form.content}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Profile Image URL</label>
          <input className="input-field text-sm" placeholder="https://..." value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} />
          <p className="text-[10px] text-slate-400 mt-1">Leave blank for auto-generated avatar</p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rating</label>
          <div className="flex items-center gap-1.5 mt-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}>
                <Star size={22} className={n <= form.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">Badges</label>
        <div className="flex flex-wrap gap-1.5">
          {BADGE_OPTIONS.map(b => (
            <button
              key={b}
              type="button"
              onClick={() => toggleBadge(b)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                form.badges.includes(b)
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> {initial ? 'Update' : 'Create'} Testimonial</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm py-2.5">Cancel</button>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const { send } = useWebSocket('admin');

  const fetchAll = () => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(d => { setTestimonials(d.testimonials || []); setLoading(false); });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (form) => {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success('Testimonial created!');
      setShowForm(false);
      fetchAll();
      send('testimonial_update', { action: 'create', testimonial: d.testimonial });
    } else {
      toast.error(d.error);
    }
  };

  const handleUpdate = async (form) => {
    const res = await fetch(`/api/testimonials/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (res.ok) {
      toast.success('Testimonial updated!');
      setEditing(null);
      fetchAll();
      send('testimonial_update', { action: 'update', testimonial: d.testimonial });
    } else {
      toast.error(d.error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    setTestimonials(prev => prev.filter(t => t.id !== id));
    send('testimonial_update', { action: 'delete', id });
  };

  const toggleActive = async (t) => {
    await fetch(`/api/testimonials/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    fetchAll();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">{testimonials.length} testimonials · manage client stories</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && !editing && (
        <TestimonialForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <div key={t.id}>
              {editing?.id === t.id ? (
                <TestimonialForm initial={t} onSave={handleUpdate} onCancel={() => setEditing(null)} />
              ) : (
                <div className={`admin-card transition-all ${!t.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold shrink-0">
                        {t.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">"{t.content}"</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {(t.badges || []).map(b => (
                      <span key={b} className="text-[10px] font-semibold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleActive(t)}
                      className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-all ${
                        t.isActive ? 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.isActive ? '✓ Active' : 'Hidden'}
                    </button>
                    <button onClick={() => { setEditing(t); setShowForm(false); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
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
