// src/app/admin/layout.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, GraduationCap, Star,
  Megaphone, LogOut, Zap, Bell, Menu, X,
  ChevronRight, Briefcase
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: Users },
  { href: '/admin/internships', label: 'Internships', icon: GraduationCap },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/jobs', label: 'Job Postings', icon: Briefcase },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { on } = useWebSocket('admin');

  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }
    fetch('/api/admin/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setAdmin(d.admin); setLoading(false); })
      .catch(() => { router.replace('/admin/login'); });
  }, [pathname]);

  useEffect(() => {
    const unsub = on('new_application', (payload) => {
      const msg = `New application from ${payload.applicant} for ${payload.job}`;
      setNotifications(prev => [{ id: Date.now(), msg, time: new Date() }, ...prev.slice(0, 9)]);
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-slide-down' : ''} bg-white rounded-xl shadow-lg border border-brand-100 p-4 flex items-start gap-3 max-w-sm`}>
          <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
            <Bell size={14} className="text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">New Application!</p>
            <p className="text-xs text-slate-500 mt-0.5">{msg}</p>
          </div>
        </div>
      ), { duration: 5000 });
    });
    return unsub;
  }, [on]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  if (pathname === '/admin/login') return children;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'w-64' : 'w-56'} h-full flex flex-col bg-slate-900`}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">AetherSolve</div>
            <div className="text-slate-500 text-[10px] tracking-widest uppercase">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-800">
        {admin && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {admin.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{admin.name}</div>
              <div className="text-slate-500 text-[10px] truncate">{admin.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col">
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} className="text-slate-600" />
            </button>
            <h1 className="text-sm font-semibold text-slate-700 capitalize">
              {navItems.find(n => n.href === pathname)?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <div className="relative">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
                  <Bell size={15} className="text-slate-600" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {Math.min(notifications.length, 9)}
                </span>
              </div>
            )}
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
