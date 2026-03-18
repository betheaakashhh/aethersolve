// src/app/admin/jobs/page.js
'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Loader2, X, Save, Briefcase, GraduationCap, MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPTS = ['Engineering', 'Design', 'Sales', 'Marketing', 'Infrastructure', 'Operations', 'HR'];
const TYPES = ['full-time', 'part-time', 'contract', 'internship'];
const SKILL_SUGGESTIONS = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Figma', 'SQL', 'TypeScript', 'Flutter', 'GraphQL'];

function JobForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    title: '', department: 'Engineering', location: 'Remote',
    type: 'full-time', isInternship: false, description: '',
    requirements: [''], skills: [],
  });
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const addReq = () => setForm(p => ({ ...p, requirements: [...p.requirements, ''] }));
  const updateReq = (i, v) => setForm(p => ({
    ...p, requirements: p.requirements.map((r, idx) => idx === i ? v : r)
  }));
  const removeReq = (i) => setForm(p => ({
    ...p, requirements: p.requirements.filter((_, idx) => idx !== i)
  }));

  const addSkill = (s) => {
    const skill = s || skillInput.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm(p => ({ ...p, skills: [...p.skills, skill] }));
    setSkillInput('');
  };
  const removeSkill = (s) => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }));

  const handleSave = async () => {
    if (!form.title || !form.department || !form.description) {
      toast.error('Fill required fields'); return;
    }
    setSaving(true);
    await onSave({
      ...form,
      requirements: form.requirements.filter(Boolean),
    });
    setSaving(false);
  };

  return (
    <div className="admin-card border-brand-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{initial ? 'Edit Job Posting' : 'New Job Posting'}</h3>
        <button onClick={onCancel}><X size={16} className="text-slate-400" /></button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Job Title *</label>
          <input className="input-field text-sm" placeholder="Senior Full Stack Developer" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Department</label>
          <select className="input-field text-sm" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type</label>
          <select className="input-field text-sm" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value, isInternship: e.target.value === 'internship' }))}>
            {TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Location</label>
          <input className="input-field text-sm" placeholder="Remote / Hybrid / On-site" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <input type="checkbox" id="intern" checked={form.isInternship} onChange={e => setForm(p => ({ ...p, isInternship: e.target.checked }))} className="w-4 h-4 rounded" />
          <label htmlFor="intern" className="text-sm font-medium text-slate-700">Is Internship Position</label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description *</label>
        <textarea className="input-field text-sm resize-none" rows={4} placeholder="Describe the role, responsibilities, and what makes it exciting..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">Requirements</label>
        <div className="space-y-2">
          {form.requirements.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input-field text-sm flex-1"
                placeholder={`Requirement ${i + 1}`}
                value={r}
                onChange={e => updateReq(i, e.target.value)}
              />
              <button onClick={() => removeReq(i)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500">
                <X size={13} />
              </button>
            </div>
          ))}
          <button onClick={addReq} className="text-xs text-brand-600 font-semibold hover:underline">+ Add requirement</button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">Required Skills</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {form.skills.map(s => (
            <span key={s} className="flex items-center gap-1 text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full border border-brand-100">
              {s}
              <button onClick={() => removeSkill(s)}><X size={9} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field text-sm flex-1"
            placeholder="Add skill..."
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
          />
          <button onClick={() => addSkill()} className="btn-secondary text-xs px-3 py-2">Add</button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).map(s => (
            <button key={s} onClick={() => addSkill(s)} className="text-[10px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 hover:border-brand-300 hover:text-brand-600 transition-all">
              + {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> {initial ? 'Update' : 'Post'} Job</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm py-2.5">Cancel</button>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchAll = async () => {
    const res = await fetch('/api/jobs');
    const d = await res.json();
    setJobs(d.jobs || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (form) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { toast.success('Job posted!'); setShowForm(false); fetchAll(); }
    else toast.error('Failed to create job');
  };

  const handleUpdate = async (form) => {
    const res = await fetch(`/api/jobs/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { toast.success('Updated!'); setEditing(null); fetchAll(); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    setJobs(p => p.filter(j => j.id !== id));
  };

  const toggleActive = async (j) => {
    await fetch(`/api/jobs/${j.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !j.isActive }),
    });
    fetchAll();
  };

  const filtered = jobs.filter(j => filter === 'all' ? true : filter === 'intern' ? j.isInternship : !j.isInternship);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-slate-500 text-sm mt-1">{jobs.length} positions · manage openings</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">
          <Plus size={16} /> Post Job
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[['all', 'All'], ['professional', 'Professional'], ['intern', 'Internships']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${filter === v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200'}`}>
            {l}
          </button>
        ))}
      </div>

      {showForm && !editing && (
        <JobForm onSave={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <div key={job.id}>
              {editing?.id === job.id ? (
                <JobForm initial={job} onSave={handleUpdate} onCancel={() => setEditing(null)} />
              ) : (
                <div className={`admin-card transition-all ${!job.isActive ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${job.isInternship ? 'bg-amber-100' : 'bg-brand-100'}`}>
                      {job.isInternship ? <GraduationCap size={17} className="text-amber-600" /> : <Briefcase size={17} className="text-brand-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-slate-800">{job.title}</h3>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{job.department}</span>
                        {job.isInternship && <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">Internship</span>}
                        {!job.isActive && <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">Hidden</span>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
                        <span>{job.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(job.skills || []).slice(0, 5).map(s => (
                          <span key={s} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => toggleActive(job)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title={job.isActive ? 'Hide' : 'Show'}>
                        {job.isActive ? <ToggleRight size={18} className="text-teal-500" /> : <ToggleLeft size={18} className="text-slate-400" />}
                      </button>
                      <button onClick={() => { setEditing(job); setShowForm(false); }} className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p>No job postings found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
