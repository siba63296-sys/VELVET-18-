import React from 'react';
import { Shield, Lock, FileText, Scale } from 'lucide-react';

interface FooterProps {
  onOpenCompliance: (tab?: string) => void;
  onResetAgeGate: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCompliance, onResetAgeGate }) => {
  return (
    <footer className="w-full border-t border-neutral-800/80 bg-[#06070A] text-neutral-400 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-lg font-bold font-display text-white tracking-tight">
              VELVET <span className="text-rose-500 font-mono text-xs">18+</span>
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Ethical mature generative AI platform providing high-fidelity text-to-image, cinematic video motion, and private conversational synthesis.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero prompt resale</span>
              <span aria-hidden="true">·</span>
              <span>Supabase RLS</span>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-200 tracking-wider uppercase">
              Legal & Compliance
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenCompliance('2257')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  18 U.S.C. § 2257 Record-Keeping Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCompliance('terms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Adult Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCompliance('privacy')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy & GDPR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCompliance('dmca')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  DMCA Copyright Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Safety & Ethics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-neutral-200 tracking-wider uppercase">
              Safety Charter
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onOpenCompliance('moderation')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Zero Tolerance on Minors Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCompliance('moderation')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Non-Consensual Imagery Ban
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCompliance('moderation')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Real Person Likeness Restriction
                </button>
              </li>
              <li>
                <button
                  onClick={onResetAgeGate}
                  className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left"
                >
                  Re-test Age Verification Gate
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance Badge Box */}
          <div className="p-4 rounded-xl bg-[#0D0F17] border border-neutral-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <Shield className="w-4 h-4 text-rose-500" />
              <span>18 U.S.C. § 2257 Exemption</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-normal">
              All visual depictions rendered by Velvet AI are synthetic computer-generated simulations produced by generative algorithms. No live human beings were depicted or utilized during real-time generation.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Velvet 18+ AI Studio. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Server-side API protected</span>
            <span aria-hidden="true">·</span>
            <span>Cashfree PCI-DSS Compliant</span>
            <span aria-hidden="true">·</span>
            <span>Strict 18+ Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
