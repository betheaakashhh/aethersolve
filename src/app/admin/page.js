// src/app/admin/page.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, XCircle, Clock, GraduationCap, Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewing: 'bg-blue-50 text-blue-700 border-blue-200',
  approved: 'bg-teal-50 text-teal-700 border-teal-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { console.error('Analytics error:', err); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const { stats, recentApplications, weeklyData } = data || {};

  const statCards = [
    { label: 'Total Applications', value: stats?.total || 0, icon: Users, color: 'brand', link: '/admin/applications' },
    { label: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'amber', link: '/admin/applications?status=pending' },
    { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle, color: 'teal', link: '/admin/applications?status=approved' },
    { label: 'Internship Apps', value: stats?.interns || 0, icon: GraduationCap, color: 'purple', link: '/admin/internships' },
  ];

  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of AetherSolve admin activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} href={link}>
            <div className="admin-card hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
                  <Icon size={17} />
                </div>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-brand-400 transition-colors" />
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Weekly mini chart + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly trend */}
        <div className="lg:col-span-1 admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Weekly Trend</h3>
            <TrendingUp size={15} className="text-brand-500" />
          </div>
          <div className="flex items-end gap-1 h-20">
            {(weeklyData || []).slice(-7).map((d, i) => {
              const max = Math.max(...(weeklyData || []).slice(-7).map(x => x.count), 1);
              const h = Math.max((d.count / max) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 6 ? 'linear-gradient(to top,#006ec7,#0c8de9)' : '#e0effe'
                    }}
                  />
                  <span className="text-[8px] text-slate-400 hidden sm:block">{d.date?.split(' ')[1]}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Last 7 days</span>
            <span className="font-semibold text-slate-700">
              {(weeklyData || []).slice(-7).reduce((a, d) => a + d.count, 0)} total
            </span>
          </div>
        </div>

        {/* Recent applications */}
        <div className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-sm">Recent Applications</h3>
            <Link href="/admin/applications" className="text-xs text-brand-600 hover:underline font-medium">View all →</Link>
          </div>
          <div className="space-y-3">
            {(recentApplications || []).map(app => (
              <Link key={app.id} href={`/admin/applications/${app.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                    {app.firstName?.[0]}{app.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">
                      {app.firstName} {app.lastName}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{app.job?.title}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {format(new Date(app.createdAt), 'MMM d')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {(!recentApplications || recentApplications.length === 0) && (
              <p className="text-center text-slate-400 text-sm py-6">No applications yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Testimonial', href: '/admin/testimonials', icon: '⭐' },
            { label: 'New Announcement', href: '/admin/announcements', icon: '📣' },
            { label: 'Manage Jobs', href: '/admin/jobs', icon: '💼' },
            { label: 'View Analytics', href: '/admin/analytics', icon: '📊' },
          ].map(({ label, href, icon }) => (
            <Link key={label} href={href}>
              <div className="p-4 bg-slate-50 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 rounded-xl cursor-pointer transition-all text-center group">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs font-semibold text-slate-600 group-hover:text-brand-700">{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}