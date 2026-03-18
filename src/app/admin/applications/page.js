// src/app/admin/applications/page.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronDown, Loader2, Eye, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

const STATUS_OPTS = ['all', 'pending', 'reviewing', 'approved', 'declined'];
const STATUS_COLORS = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewing: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-teal-50 text-teal-700 border-teal-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const { on } = useWebSocket('admin');

  const fetchApps = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20, isIntern: 'false' });
    if (status !== 'all') params.set('status', status);
    const res = await fetch(`/api/applications?${params}`);
    const d = await res.json();
    setApps(d.applications || []);
    setTotal(d.total || 0);
    setLoading(false);
  }, [status, page]);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  useEffect(() => {
    const unsub = on('new_application', () => fetchApps());
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
    return !q || `${a.firstName} ${a.lastName} ${a.email} ${a.job?.title}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total professional applications</p>
        </div>
        <button onClick={fetchApps} className="btn-ghost text-sm">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="admin-card py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-slate-50"
              placeholder="Search by name, email, job..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {STATUS_OPTS.map(s => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize border ${
                  status === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden p-0">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-brand-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-base font-medium">No applications found</p>
            <p className="text-sm mt-1">Try changing your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Applicant', 'Role', 'Status', 'Applied', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                          {app.firstName?.[0]}{app.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{app.firstName} {app.lastName}</div>
                          <div className="text-xs text-slate-400">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-700">{app.job?.title}</div>
                      <div className="text-xs text-slate-400">{app.job?.department}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[app.status]}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400">
                      {format(new Date(app.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {Math.min(page * 20, total)} of {total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-ghost text-sm disabled:opacity-40">← Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="btn-ghost text-sm disabled:opacity-40">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
