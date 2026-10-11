import React, { useState } from 'react';
import {
  Sparkles,
  Video,
  MessageSquare,
  Clock,
  Coins,
  Settings,
  Shield,
  ChevronRight,
  Menu,
  X,
  Home,
  ShieldAlert,
  Lock,
  KeyRound,
} from 'lucide-react';
import { User } from '../types';
import { Storage } from '../lib/storage';

interface DashboardLayoutProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: User;
  onOpenCompliance: () => void;
  onOpenAdminLogin?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenCompliance,
  onOpenAdminLogin,
  children,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { id: 'image', label: 'Generate Image', icon: <Sparkles className="w-4 h-4 text-rose-400" /> },
    { id: 'video', label: 'Generate Video', icon: <Video className="w-4 h-4 text-amber-400" /> },
    { id: 'chat', label: 'Uncensored Chat', icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
    { id: 'history', label: 'Vault History', icon: <Clock className="w-4 h-4 text-blue-400" /> },
    { id: 'pricing', label: 'Credits & Billing', icon: <Coins className="w-4 h-4 text-cyan-400" /> },
    { id: 'settings', label: 'Account Settings', icon: <Settings className="w-4 h-4 text-neutral-400" /> },
  ];

  // If user is admin, add Admin Panel to navigation
  const adminLinks = user.role === 'admin'
    ? [{ id: 'admin', label: 'Admin Panel', icon: <ShieldAlert className="w-4 h-4 text-rose-500" /> }]
    : [];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileSidebarOpen(false);
  };

  const handleTriggerAdminLogin = () => {
    setIsMobileSidebarOpen(false);
    if (onOpenAdminLogin) {
      onOpenAdminLogin();
    } else {
      Storage.loginAdminWithCredentials('rajsiba2005@gmail.com', 'Siba2005@');
      onNavigate('admin');
      window.location.reload();
    }
  };

  const handleToggleRole = () => {
    if (user.role !== 'admin') {
      Storage.loginAdminWithCredentials('rajsiba2005@gmail.com', 'Siba2005@');
      onNavigate('admin');
      window.location.reload();
    } else {
      Storage.toggleUserRole();
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] bg-[#08090D]">
      {/* Desktop Sidebar (240px width as recommended in SaaS reference) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-800/80 bg-[#0A0C13] shrink-0 p-4 justify-between">
        <div className="space-y-6">
          {/* User profile capsule in sidebar */}
          <div className="p-3 rounded-xl border border-neutral-800 bg-[#0E1018] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono uppercase font-medium">
                  {user.plan} Plan
                </div>
              </div>
            </div>

            {/* Quick role badge / toggle */}
            <button
              onClick={handleToggleRole}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase font-bold cursor-pointer transition-colors ${
                user.role === 'admin'
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 hover:bg-rose-900'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Click to toggle Admin / User role"
            >
              {user.role}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 text-[10px] font-mono uppercase text-neutral-500 font-bold mb-2">
              Studio Suite
            </div>
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  currentView === link.id
                    ? 'bg-rose-500/10 text-white font-semibold border border-rose-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {currentView === link.id && (
                  <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
                )}
              </button>
            ))}

            {/* Admin link section */}
            {adminLinks.length > 0 ? (
              <div className="pt-3 mt-3 border-t border-neutral-800/80">
                <div className="px-2 text-[10px] font-mono uppercase text-rose-500 font-bold mb-2 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  <span>Management</span>
                </div>
                {adminLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      currentView === link.id
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-950/40'
                        : 'text-rose-400 hover:text-white hover:bg-rose-950/30 border border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {link.icon}
                      <span className="font-semibold">{link.label}</span>
                    </div>
                    {currentView === link.id && (
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              onOpenAdminLogin && (
                <div className="pt-3 mt-3 border-t border-neutral-800/80">
                  <button
                    onClick={onOpenAdminLogin}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-rose-300 hover:bg-neutral-900/60 border border-neutral-800/80 hover:border-rose-900/60 transition-all cursor-pointer"
                    title="Staff Admin Login (rajsiba2005@gmail.com)"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Admin Login</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">rajsiba</span>
                  </button>
                </div>
              )
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
          <div className="p-2.5 rounded-lg bg-[#0F121C] border border-neutral-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Balance:</span>
              <span className="font-mono text-amber-400 font-bold">
                {user.plan === 'unlimited' ? '∞' : user.credits.toFixed(1)} Credits
              </span>
            </div>
            <button
              onClick={() => handleNav('pricing')}
              className="w-full mt-1.5 py-1.5 rounded-md bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Coins className="w-3 h-3 text-cyan-400" />
              <span>Top Up (Cashfree UPI)</span>
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => onNavigate('landing')}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={onOpenCompliance}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>2257 Notice</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Sub-Header for Sidebar toggle */}
        <div className="lg:hidden px-4 py-2.5 border-b border-neutral-800 bg-[#0B0D14] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold text-neutral-200 p-1.5 px-2.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
            >
              <Menu className="w-4 h-4 text-rose-400" />
              <span>Studio Menu</span>
            </button>

            {/* Quick Admin Login button right in the mobile subheader */}
            {user.role === 'admin' ? (
              <button
                onClick={() => handleNav('admin')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 text-white font-mono text-[11px] font-bold shadow-sm shadow-rose-950/60"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            ) : (
              <button
                onClick={handleTriggerAdminLogin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/90 border border-rose-800 text-rose-300 font-mono text-[11px] font-bold hover:bg-rose-900 transition-colors cursor-pointer"
                title="Login as Admin (rajsiba2005@gmail.com)"
              >
                <Lock className="w-3 h-3 text-rose-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#131622] border border-neutral-800">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-white">{user.credits.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Mobile Drawer (Studio Navigation from 3-line Menu) */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex">
            <div className="w-80 bg-[#0C0E16] h-full p-4 flex flex-col justify-between border-r border-neutral-800 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="font-bold text-white font-display text-base">Studio Navigation</span>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 1. Admin Portal Header Card inside Drawer */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/90 via-[#151122] to-[#0E1018] border border-rose-800/80 shadow-md shadow-rose-950/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      Admin Portal
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                      {user.role === 'admin' ? 'Role: Admin' : 'Staff Only'}
                    </span>
                  </div>

                  {user.role === 'admin' ? (
                    <button
                      onClick={() => handleNav('admin')}
                      className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Open Admin Control Console</span>
                    </button>
                  ) : (
                    <div className="space-y-1.5">
                      <button
                        onClick={handleTriggerAdminLogin}
                        className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-950/60 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5 text-white" />
                        <span>Admin Panel Login</span>
                      </button>
                      <div className="text-[10px] text-neutral-400 text-center font-mono">
                        Gmail: <span className="text-rose-300 font-semibold">rajsiba2005@gmail.com</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Navigation Studio Links */}
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => handleNav(link.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        currentView === link.id
                          ? 'bg-rose-500/10 text-white font-semibold border border-rose-500/30'
                          : 'text-neutral-400 hover:bg-neutral-900'
                      }`}
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </button>
                  ))}

                  {/* 3. Direct Admin Item in Menu List */}
                  <div className="pt-2 border-t border-neutral-800/80">
                    <button
                      onClick={() => {
                        if (user.role === 'admin') {
                          handleNav('admin');
                        } else {
                          handleTriggerAdminLogin();
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        user.role === 'admin'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span>{user.role === 'admin' ? 'Admin Panel (Active)' : 'Admin Panel Login'}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-rose-300">
                        {user.role === 'admin' ? 'Active' : 'rajsiba2005'}
                      </span>
                    </button>
                  </div>
                </nav>
              </div>

              {/* 4. Bottom Actions */}
              <div className="pt-4 border-t border-neutral-800 space-y-2 mt-4">
                {user.role !== 'admin' && (
                  <button
                    onClick={handleTriggerAdminLogin}
                    className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/50 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Login as Admin (rajsiba2005@gmail.com)</span>
                  </button>
                )}
                <button
                  onClick={() => handleNav('pricing')}
                  className="w-full py-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
                >
                  Buy Credits (Cashfree)
                </button>
                <button
                  onClick={handleToggleRole}
                  className="w-full py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-[11px] font-mono cursor-pointer"
                >
                  {user.role === 'admin' ? 'Switch to User Role' : 'Toggle Role to Admin (rajsiba2005)'}
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileSidebarOpen(false)} />
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
