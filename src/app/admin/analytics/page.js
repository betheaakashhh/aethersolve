// src/app/admin/analytics/page.js
'use client';
import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, CheckCircle, XCircle, Clock, GraduationCap } from 'lucide-react';

const COLORS = ['#006ec7', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];

export default function AnalyticsPage() {
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
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  const { stats, weeklyData, departmentChart } = data || {};

  const statCards = [
    { label: 'Total Applications', value: stats?.total, icon: Users, color: '#006ec7', bg: '#f0f7ff' },
    { label: 'Pending', value: stats?.pending, icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Approved', value: stats?.approved, icon: CheckCircle, color: '#14b8a6', bg: '#f0fdfa' },
    { label: 'Declined', value: stats?.declined, icon: XCircle, color: '#ef4444', bg: '#fff1f2' },
    { label: 'Professionals', value: stats?.professionals, icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Interns', value: stats?.interns, icon: GraduationCap, color: '#0891b2', bg: '#ecfeff' },
  ];

  const conversionRate = stats?.total ? Math.round((stats.approved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Application trends and recruitment data</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="admin-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-slate-900">{value ?? 0}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversion rate */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-800">Approval Rate</h3>
          <span className="text-2xl font-bold font-display text-brand-600">{conversionRate}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full transition-all duration-1000"
            style={{ width: `${conversionRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>{stats?.approved} approved</span>
          <span>{stats?.total} total</span>
        </div>
      </div>

      {/* Line chart — daily applications */}
      <div className="admin-card">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={16} className="text-brand-500" />
          <h3 className="font-semibold text-slate-800">Applications Over Time (Last 14 Days)</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              labelStyle={{ fontWeight: 600, color: '#1e293b' }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#006ec7"
              strokeWidth={2.5}
              dot={{ fill: '#006ec7', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#006ec7' }}
              name="Applications"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar chart — by department */}
        <div className="admin-card">
          <h3 className="font-semibold text-slate-800 mb-4">Applications by Department</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={departmentChart || []} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Applications">
                {(departmentChart || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — status breakdown */}
        <div className="admin-card">
          <h3 className="font-semibold text-slate-800 mb-4">Status Breakdown</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: stats?.pending || 0 },
                    { name: 'Approved', value: stats?.approved || 0 },
                    { name: 'Declined', value: stats?.declined || 0 },
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {['#f59e0b', '#14b8a6', '#ef4444'].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: 'Pending', value: stats?.pending || 0, color: '#f59e0b' },
                { label: 'Approved', value: stats?.approved || 0, color: '#14b8a6' },
                { label: 'Declined', value: stats?.declined || 0, color: '#ef4444' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-slate-500 flex-1">{label}</span>
                  <span className="text-xs font-bold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}