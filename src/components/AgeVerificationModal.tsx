import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { Storage } from '../lib/storage';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
}

export const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  isOpen,
  onVerified,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleEnter = () => {
    if (!agreedToTerms) {
      setHasError(true);
      return;
    }
    Storage.setAgeVerified(true);
    const user = Storage.getUser();
    user.isAgeVerified = true;
    user.ageVerifiedAt = new Date().toISOString();
    Storage.setUser(user);
    onVerified();
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0F1118] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white tracking-tight">
              Age Verification Required
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Restricted Access</span>
              <span aria-hidden="true">·</span>
              <span>18+ Adult Content</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed mb-4">
          This platform is strictly intended for consenting adults aged 18 and older (or the legal age of majority in your jurisdiction). It hosts unfiltered creative generation tools that may produce mature, romantic, and adult AI media.
        </p>

        <div className="p-3.5 rounded-xl bg-[#141824] border border-neutral-800 text-xs text-neutral-400 space-y-2 mb-6">
          <div className="flex items-start gap-2 text-neutral-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Strict Ethical & Legal Boundaries:</span>
          </div>
          <p className="pl-6">
            Under our Zero-Tolerance compliance rules, any prompts depicting minors, ageplay, non-consensual content, extreme violence, or unauthorized real-person likenesses are blocked server-side and recorded.
          </p>
          <div className="pl-6 text-[11px] text-neutral-400">
            18 U.S.C. § 2257 Record-Keeping Exemption documentation applies to all synthetic generative models.
          </div>
        </div>

        <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-800/80 bg-black/40 hover:bg-neutral-900/60 cursor-pointer transition-colors mb-6">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              if (e.target.checked) setHasError(false);
            }}
            className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-0"
          />
          <span className="text-xs text-neutral-300 select-none">
            I certify under penalty of perjury that I am at least <strong>18 years of age</strong>, that adult material is legal in my community, and that I consent to viewing and generating mature content.
          </span>
        </label>

        {hasError && (
          <p className="text-xs text-rose-400 mb-4 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Please confirm your age checkbox above before entering.
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleExit}
            className="px-4 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800 text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Exit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleEnter}
            className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <CheckCircle className="w-4 h-4" />
            <span>I am 18+ (Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
