// src/app/admin/internships/page.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Eye, Trash2, RefreshCw, Loader2, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

const STATUS_COLORS = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  reviewing: 'bg-blue-50 text-blue-700 border-blue-200',
  approved:  'bg-teal-50 text-teal-700 border-teal-200',
  declined:  'bg-red-50 text-red-700 border-red-200',
};

export default function InternshipsPage() {
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const { on } = useWebSocket('admin');

  const fetchApps = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ isIntern: 'true', limit: 50 });
    if (status !== 'all') params.set('status', status);
    const res = await fetch(`/api/applications?${params}`);
    const d = await res.json();
    setApps(d.applications || []);
    setTotal(d.total || 0);
    setLoading(false);
  }, [status]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  useEffect(() => {
    const unsub = on('new_application', (p) => { if (p.isIntern) fetchApps(); });
    return unsub;
  }, [on, fetchApps]);

  const deleteApp = async (id, e) => {
    e.preventDefault();
    if (!confirm('Delete this application?')) return;
    await fetch(`/api/applications/${id}`, { method: 'DELETE' });
    toast.success('Application deleted');
    fetchApps();
  };

  const filtered = apps.filter(a => {
    const q = search.toLowerCase();
    return !q || `${a.firstName} ${a.lastName} ${a.email} ${a.collegeName} ${a.job?.title}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Internship Applications</h1>
          <p className="text-slate-500 text-sm mt-1">{total} student applications</p>
        </div>
        <button onClick={fetchApps} className="btn-ghost text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['all','pending','approved','declined'].map(s => {
          const count = s === 'all' ? apps.length : apps.filter(a => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`p-3 rounded-xl border text-left transition-all ${status === s ? 'border-brand-300 bg-brand-50' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`text-xl font-bold font-display ${status === s ? 'text-brand-700' : 'text-slate-800'}`}>{count}</div>
              <div className="text-xs text-slate-500 capitalize font-medium">{s}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="admin-card py-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50"
            placeholder="Search by name, email, college..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-brand-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No intern applications found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(app => (
            <div key={app.id} className="admin-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-bold text-sm shrink-0">
                    {app.firstName?.[0]}{app.lastName?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{app.firstName} {app.lastName}</div>
                    <div className="text-xs text-slate-400">{app.email}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${STATUS_COLORS[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <GraduationCap size={11} className="text-amber-500" />
                  <span className="truncate">{app.collegeName || 'College not specified'}</span>
                </div>
                {app.degree && (
                  <div className="text-xs text-slate-400">{app.degree} · {app.yearOfStudy}</div>
                )}
                {app.cgpa && (
                  <div className="text-xs font-semibold text-slate-600">CGPA: {app.cgpa}</div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <div className="text-xs font-medium text-slate-700">{app.job?.title}</div>
                  <div className="text-[10px] text-slate-400">{format(new Date(app.createdAt), 'MMM d, yyyy')}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link href={`/admin/applications/${app.id}`}>
                    <button className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                      <Eye size={14} />
                    </button>
                  </Link>
                  <button
                    onClick={(e) => deleteApp(app.id, e)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
