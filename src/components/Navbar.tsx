import React, { useState } from 'react';
import { Sparkles, Coins, Menu, X, Shield, ShieldAlert, User as UserIcon, Lock, KeyRound } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: User;
  onOpenBilling: () => void;
  onOpenAuth: () => void;
  onOpenAdminLogin: () => void;
  onOpenCompliance: () => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenBilling,
  onOpenAuth,
  onOpenAdminLogin,
  onOpenCompliance,
  isAuthenticated,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'image', label: 'Image Studio' },
    { id: 'video', label: 'Video Studio' },
    { id: 'chat', label: 'Creative Chat' },
    { id: 'history', label: 'Vault History' },
    { id: 'pricing', label: 'Pricing & Credits' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-[#08090D]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 group text-left cursor-pointer whitespace-nowrap shrink-0"
        >
          <span className="text-xl font-extrabold font-display tracking-tight text-white group-hover:text-rose-400 transition-colors">
            VELVET <span className="text-rose-500 font-mono text-sm tracking-normal">18+</span>
          </span>
        </button>

        {/* Zone 2: 4-5 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === link.id
                  ? 'text-white font-semibold border-b-2 border-rose-500 pb-0.5'
                  : ''
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onOpenCompliance}
            className="hover:text-white transition-colors text-xs text-neutral-400 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-400" />
            <span>2257 Notice</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action area */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
                      : 'bg-rose-950/60 border border-rose-800/70 hover:bg-rose-900/80 text-rose-300'
                  }`}
                  title="Open Admin Control Console"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950/50 border border-neutral-800 hover:border-rose-900/80 text-xs font-medium text-neutral-400 hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Admin Portal Login (rajsiba2005@gmail.com)"
                >
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Admin Login</span>
                </button>
              )}

              <button
                onClick={onOpenBilling}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141722] hover:bg-[#1C2030] border border-neutral-800 text-xs font-medium text-neutral-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Add Credits"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono tabular-nums font-semibold text-white">
                  {user.credits.toFixed(1)}
                </span>
                <span className="text-neutral-400 hidden sm:inline">Credits</span>
                <span className="text-rose-400 text-xs font-bold">+</span>
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700 hover:border-rose-500 transition-colors shrink-0"
                title="Settings & Profile"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback avatar icon
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminLogin}
                className="px-2.5 py-1.5 text-xs text-neutral-400 hover:text-rose-300 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-1"
                title="Staff / Admin Portal"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin</span>
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm shadow-rose-600/30 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Enter Studio</span>
              </button>
            </div>
          )}

          {/* Mobile hamburger 3-line button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Toggle navigation"
            title="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer (3-line Menu) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-[#0E1017] px-4 py-4 space-y-3">
          {/* Admin Portal Section in 3-line Menu */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/80 via-[#151120] to-[#0E1017] border border-rose-800/70 shadow-lg shadow-rose-950/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Admin Portal Login
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800/80 text-rose-300">
                {user.role === 'admin' ? 'Role: Admin' : 'Staff Only'}
              </span>
            </div>

            {user.role === 'admin' ? (
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-rose-950/60"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Open Admin Control Console</span>
                </button>
                <div className="text-[10px] text-neutral-400 text-center font-mono truncate">
                  Logged in: {user.email}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenAdminLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-rose-950/60 cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>Admin Panel Login</span>
                </button>
                <div className="text-[10px] text-neutral-400 text-center font-mono">
                  Gmail: <span className="text-rose-300 font-semibold">rajsiba2005@gmail.com</span> · Pass: <span className="text-neutral-300">Siba2005@</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation studio links */}
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                  currentView === link.id
                    ? 'bg-rose-500/10 text-rose-400 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenCompliance();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Compliance & 2257 Notice</span>
            </button>
            <button
              onClick={() => {
                onNavigate('settings');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-rose-400 hover:underline"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
