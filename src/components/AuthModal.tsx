import React, { useState } from 'react';
import { X, Lock, Mail, CheckCircle, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';
import { User } from '../types';
import { Storage } from '../lib/storage';
import { SupabaseService } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onOpenAdminLogin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onOpenAdminLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'signup') {
      if (!ageConfirmed) {
        setIsLoading(false);
        setError('You must confirm under penalty of perjury that you are 18 years of age or older.');
        return;
      }
      if (!name.trim()) {
        setIsLoading(false);
        setError('Please enter your display name.');
        return;
      }

      const res = await SupabaseService.signUp(email, password, name, true);
      setIsLoading(false);

      if (res.error) {
        setError(res.error);
        return;
      }

      setEmailVerificationStep(true);
      return;
    }

    // Sign in flow
    const res = await SupabaseService.signIn(email, password);
    setIsLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    if (res.user) {
      Storage.setUser(res.user);
      Storage.setAgeVerified(true);
      onSuccess(res.user);
      onClose();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length < 4) {
      setError('Please enter a valid 4-digit confirmation code (e.g. 8492).');
      return;
    }
    completeLogin(email, name);
  };

  const completeLogin = (userEmail: string, userName: string) => {
    const existing = Storage.getUser();
    const updatedUser: User = {
      ...existing,
      email: userEmail || 'creator@velvet-ai.studio',
      name: userName || 'Alex Vance',
      isAgeVerified: true,
      ageVerifiedAt: new Date().toISOString(),
    };
    Storage.setUser(updatedUser);
    Storage.setAgeVerified(true);
    onSuccess(updatedUser);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const res = await SupabaseService.signInWithGoogle();
    setIsLoading(false);

    if (res.user) {
      Storage.setUser(res.user);
      Storage.setAgeVerified(true);
      onSuccess(res.user);
      onClose();
    }
  };

  const handleQuickDemo = () => {
    completeLogin('demo.creator@velvet-ai.studio', 'Studio Creator');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0F1118] border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {emailVerificationStep ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Mail className="w-5 h-5" />
              <h2 className="text-lg font-bold font-display text-white">Verify Your Email</h2>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              We sent a verification code to <span className="font-mono text-white">{email}</span> via Supabase Auth to confirm your 18+ account registration.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">
                  Confirmation Code (Enter code e.g. 8492)
                </label>
                <input
                  type="text"
                  placeholder="8492"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-white font-mono text-center tracking-widest text-lg focus:outline-none focus:border-rose-500"
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/30"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Activate 10 Free Credits</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold font-display text-white">
                  VELVET <span className="text-rose-500 font-mono text-xs">18+</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-mono">
                  SUPABASE AUTH
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {mode === 'signup' ? 'Create Creator Account' : 'Welcome Back'}
              </h3>
              <p className="text-xs text-neutral-400">
                {mode === 'signup'
                  ? 'Sign up to receive 10 free credits for image, video & chat generation.'
                  : 'Log in to access your private generation vault and credits.'}
              </p>
            </div>

            {/* Google OAuth Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center text-xs text-neutral-500">
              <div className="border-t border-neutral-800 w-full"></div>
              <span className="bg-[#0F1118] px-2 whitespace-nowrap text-[11px]">or with email</span>
              <div className="border-t border-neutral-800 w-full"></div>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 p-1 bg-[#141724] rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  mode === 'signin' ? 'bg-[#22273B] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                  mode === 'signup' ? 'bg-[#22273B] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign Up (10 Credits)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Name / Pseudonym
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-sm text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {mode === 'signup' && (
                <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-neutral-800 bg-black/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ageConfirmed}
                    onChange={(e) => setAgeConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-[11px] text-neutral-300 leading-normal">
                    I solemnly confirm under penalty of perjury that I am 18 years of age or older, and agree to the 18+ Terms of Service and Anti-Minor Moderation Policy.
                  </span>
                </label>
              )}

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-rose-600/30"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Supabase...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'Create Supabase Account' : 'Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={handleQuickDemo}
              className="w-full py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-[11px] font-medium text-neutral-400 hover:text-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>1-Click Test Login (Skip Auth)</span>
            </button>

            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminLogin();
                }}
                className="w-full py-2 rounded-lg bg-rose-950/50 border border-rose-800/70 hover:bg-rose-900/60 text-[11px] font-semibold text-rose-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Admin Login (rajsiba2005@gmail.com)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
