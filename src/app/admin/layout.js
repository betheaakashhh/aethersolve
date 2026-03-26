// src/app/admin/layout.js
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, GraduationCap, Star,
  Megaphone, LogOut, Zap, Bell, Menu,
  ChevronRight, Briefcase, X, ExternalLink,
  Clock, BarChart3, BookOpen
} from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const navItems = [
  { href: '/admin',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/analytics',     label: 'Analytics',     icon: BarChart3 },
  { href: '/admin/applications',  label: 'Applications',  icon: Users },
  { href: '/admin/internships',   label: 'Internships',   icon: GraduationCap },
  { href: '/admin/blog',          label: 'Blog',          icon: BookOpen },
  { href: '/admin/testimonials',  label: 'Testimonials',  icon: Star },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/jobs',          label: 'Job Postings',  icon: Briefcase },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [admin,         setAdmin]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [bellOpen,      setBellOpen]      = useState(false);

  const bellRef = useRef(null);
  const { on } = useWebSocket('admin');

  // Close bell panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Auth check
  useEffect(() => {
    if (pathname === '/admin/login') { setLoading(false); return; }
    fetch('/api/admin/me')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setAdmin(d.admin); setLoading(false); })
      .catch(() => router.replace('/admin/login'));
  }, [pathname]);

  // WebSocket — new application notifications
  useEffect(() => {
    const unsub = on('new_application', (payload) => {
      const notif = {
        id:        Date.now(),
        applicant: payload.applicant,
        job:       payload.job,
        appId:     payload.id,
        isIntern:  payload.isIntern,
        time:      new Date(),
        read:      false,
      };
      setNotifications(prev => [notif, ...prev.slice(0, 19)]);

      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-slide-down' : ''} bg-white rounded-xl shadow-lg border border-brand-100 p-4 flex items-start gap-3 max-w-sm cursor-pointer`}
          onClick={() => {
            toast.dismiss(t.id);
            router.push(`/admin/applications/${payload.id}`);
          }}
        >
          <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center shrink-0">
            <Bell size={14} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">New Application!</p>
            <p className="text-xs text-slate-500 mt-0.5">
              <span className="font-medium text-slate-700">{payload.applicant}</span>{' '}
              applied for {payload.job}
            </p>
            <p className="text-[10px] text-brand-500 mt-1 font-medium">Click to review →</p>
          </div>
        </div>
      ), { duration: 7000 });
    });
    return unsub;
  }, [on, router]);

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  const markRead  = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearAll  = ()   => setNotifications([]);
  const unread    = notifications.filter(n => !n.read).length;

  // ── Sidebar component (shared desktop + mobile) ──────────────────
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

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-slate-800">
        {admin && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
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

  // ── Early returns ─────────────────────────────────────────────────
  if (pathname === '/admin/login') return children;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── Main layout ───────────────────────────────────────────────────
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

      {/* Right column: topbar + page content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Top bar ── */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">

          {/* Left: hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={18} className="text-slate-600" />
            </button>
            <h1 className="text-sm font-semibold text-slate-700 capitalize">
              {navItems.find(n =>
                n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href))
              )?.label || 'Admin'}
            </h1>
          </div>

          {/* Right: bell + view site */}
          <div className="flex items-center gap-3">

            {/* ── Notification bell ── */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(p => !p)}
                className="relative w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Notifications"
              >
                <Bell size={16} className="text-slate-600" />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {bellOpen && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-slide-down">

                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="text-brand-500" />
                      <span className="text-sm font-semibold text-slate-800">Notifications</span>
                      {unread > 0 && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unread} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAll}
                          className="text-[10px] text-slate-400 hover:text-slate-600 font-medium"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={() => setBellOpen(false)}
                        className="p-1 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <X size={13} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  {/* Notification list */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10">
                        <Bell size={28} className="text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">No notifications yet</p>
                        <p className="text-xs text-slate-300 mt-1">New applications will appear here</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                            !notif.read ? 'bg-brand-50/40' : ''
                          }`}
                          onClick={() => {
                            markRead(notif.id);
                            setBellOpen(false);
                            if (notif.appId) router.push(`/admin/applications/${notif.appId}`);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar icon */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              notif.isIntern ? 'bg-amber-100' : 'bg-brand-100'
                            }`}>
                              {notif.isIntern
                                ? <GraduationCap size={14} className="text-amber-600" />
                                : <Users size={14} className="text-brand-600" />
                              }
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {notif.applicant}
                                </p>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 bg-brand-500 rounded-full shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-slate-500 truncate">
                                Applied for {notif.job}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock size={10} className="text-slate-300" />
                                <p className="text-[10px] text-slate-400">
                                  {format(new Date(notif.time), 'MMM d, h:mm a')}
                                </p>
                              </div>
                            </div>

                            <ExternalLink size={12} className="text-slate-300 shrink-0 mt-1" />
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 mt-2.5 ml-11">
                            <button
                              className="flex-1 text-[11px] font-semibold py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                              onClick={e => {
                                e.stopPropagation();
                                markRead(notif.id);
                                setBellOpen(false);
                                router.push(`/admin/applications/${notif.appId}`);
                              }}
                            >
                              Open &amp; Review
                            </button>
                            <button
                              className="px-3 text-[11px] font-semibold py-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                              onClick={e => { e.stopPropagation(); markRead(notif.id); }}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
                      <Link
                        href="/admin/applications"
                        onClick={() => setBellOpen(false)}
                        className="text-xs text-brand-600 font-semibold hover:underline flex items-center justify-center gap-1"
                      >
                        View all applications <ExternalLink size={10} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* View site link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200"
            >
              View Site →
            </a>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}