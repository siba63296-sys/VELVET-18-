import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { User } from '../types';
import { Storage } from '../lib/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminUser: User) => void;
  currentUser?: User;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUser,
}) => {
  const [email, setEmail] = useState('rajsiba2005@gmail.com');
  const [password, setPassword] = useState('Siba2005@');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isAlreadyAdmin = currentUser?.role === 'admin';

  const handleFillCredentials = () => {
    setEmail('rajsiba2005@gmail.com');
    setPassword('Siba2005@');
    setError(null);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = Storage.loginAdminWithCredentials(email, password);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setError(res.error || 'Authentication failed. Please verify admin email and password.');
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess(res.user!);
        onClose();
      }, 700);
    }, 450);
  };

  const handleInstantOneClick = () => {
    setEmail('rajsiba2005@gmail.com');
    setPassword('Siba2005@');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = Storage.loginAdminWithCredentials('rajsiba2005@gmail.com', 'Siba2005@');
      setIsLoading(false);
      if (res.user) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess(res.user!);
          onClose();
        }, 500);
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0D0F17] border border-rose-900/60 rounded-2xl p-6 sm:p-7 shadow-2xl text-neutral-200 shadow-rose-950/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-400 shadow-md shadow-rose-950/60">
            <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-rose-950 border border-rose-800 text-rose-300">
                Admin Console
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">Protected</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white mt-0.5">Admin Panel Login</h2>
            <p className="text-xs text-neutral-400">
              Staff authentication for VELVET 18+ AI Platform
            </p>
          </div>
        </div>

        {/* Already Admin Banner if applicable */}
        {isAlreadyAdmin && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>You are currently signed in as <strong>{currentUser?.email}</strong></span>
            </div>
            <button
              onClick={() => {
                onClose();
              }}
              className="text-[11px] font-bold underline hover:text-white"
            >
              Close
            </button>
          </div>
        )}

        {/* Official Credentials Info Box */}
        <div className="mb-4 p-3.5 rounded-xl bg-[#131622] border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              Admin Access Credentials
            </span>
            <button
              type="button"
              onClick={handleFillCredentials}
              className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline font-mono cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#090A0F] p-2 rounded-lg border border-neutral-900">
            <div>
              <span className="text-neutral-500 block text-[10px]">ADMIN GMAIL:</span>
              <span className="text-rose-300 font-semibold select-all">rajsiba2005@gmail.com</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">PASSWORD:</span>
              <span className="text-neutral-200 select-all">Siba2005@</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Success message */}
        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Authenticated as Super Admin! Redirecting to Admin Panel...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Admin Gmail Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajsiba2005@gmail.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-[#090A0F] border border-neutral-800 focus:border-rose-500 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-[#090A0F] border border-neutral-800 focus:border-rose-500 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 p-0.5"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-200" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-200" />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>

            {/* Quick 1-Click Access for Instant Convenience */}
            <button
              type="button"
              onClick={handleInstantOneClick}
              disabled={isLoading || isSuccess}
              className="w-full py-2 px-3 rounded-xl bg-[#141722] hover:bg-[#1C2030] border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>1-Click Auto Login as Admin (rajsiba2005@gmail.com)</span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 text-center">
          <p className="text-[10px] text-neutral-500 leading-normal">
            Authorized personnel only. All administrative actions, provider modifications, and user adjustments are logged in audit history.
          </p>
        </div>
      </div>
    </div>
  );
};
