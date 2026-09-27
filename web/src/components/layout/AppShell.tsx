// LEAF - AppShell Layout
// Dark sidebar with LEAF branding, 5 nav items, mobile bottom bar

import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, FileText,
  Settings, Menu, X, LogOut, Bell, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LeafIcon } from '../common/LeafLogo';

const navItems = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/patients',    label: 'Patients',     icon: Users },
  { to: '/assessments', label: 'Assessments',  icon: ClipboardList },
  { to: '/reports',     label: 'Reports',      icon: FileText },
  { to: '/settings',    label: 'Settings',     icon: Settings },
];

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/patients') return 'Patients';
  if (pathname.includes('/assessments/new')) return 'New Assessment';
  if (pathname === '/assessments') return 'Assessments';
  if (pathname.includes('/assessments/')) return 'Assessment Results';
  if (pathname.includes('/compare') || pathname.includes('/history')) return 'History & Trends';
  if (pathname.includes('/patients/')) return 'Patient Details';
  if (pathname === '/reports') return 'Reports';
  if (pathname === '/settings') return 'Settings';
  return 'LEAF';
}

// ─── Desktop Sidebar ──────────────────────────────────────────

interface SidebarProps { isOpen: boolean; onClose: () => void; }

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ background: 'var(--color-sidebar-bg)' }}
        className={`
          fixed top-0 left-0 h-full z-30 w-60 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b" style={{ borderColor: 'var(--color-sidebar-border)' }}>
          <div className="flex items-center gap-2.5">
            <LeafIcon size={34} />
            <div>
              <span className="text-lg font-bold text-white tracking-tight">LEAF</span>
              <p className="text-[9px] text-green-400 leading-tight font-medium">Liver Evaluation & Assessment</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white" aria-label="Close navigation">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Application sections">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                ${isActive
                  ? 'bg-teal-600/20 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-teal-400" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 pb-4 border-t pt-4" style={{ borderColor: 'var(--color-sidebar-border)' }}>
          {/* Disclaimer */}
          <p className="text-[10px] text-slate-500 leading-relaxed mb-3 px-1">
            Clinical decision-support prototype. Does not independently diagnose liver disease.
          </p>
          {/* User row */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'var(--color-sidebar-hover)' }}>
            <div className="w-8 h-8 rounded-full bg-teal-600/30 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-teal-300">
                {user?.display_name?.split(' ').map(w => w[0]).join('').slice(0, 2) ?? 'DR'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.display_name ?? 'Dr. Demo'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role ?? 'clinician'}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              title="Sign out"
              aria-label="Sign out"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── TopBar ───────────────────────────────────────────────────

function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button aria-label="Notifications" className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center border border-teal-200">
          <span className="text-xs font-bold text-teal-700">DR</span>
        </div>
      </div>
    </header>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────

function MobileBottomNav() {
  const mobileItems = navItems.slice(0, 4); // Dashboard, Patients, Assessments, Reports
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-200 flex"
      aria-label="Mobile navigation"
    >
      {mobileItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `
            flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5
            text-[10px] font-medium
            ${isActive ? 'text-teal-600' : 'text-slate-400'}
          `}
        >
          {({ isActive }) => (
            <>
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

// ─── AppShell ─────────────────────────────────────────────────

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6" id="main-content">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
