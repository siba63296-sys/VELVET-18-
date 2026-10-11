import React, { useState } from 'react';
import { X, Shield, FileText, Scale, Lock } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  defaultTab = '2257',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#0F1118] border border-neutral-800 rounded-2xl flex flex-col shadow-2xl text-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-[#0A0C13]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold font-display text-white">
              Compliance & Legal Documentation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-2 bg-[#121520] border-b border-neutral-800 shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('2257')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === '2257'
                ? 'bg-[#22273B] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            18 U.S.C. § 2257 Notice
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'moderation'
                ? 'bg-[#22273B] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Zero Tolerance Charter
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'terms'
                ? 'bg-[#22273B] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#22273B] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Privacy & DMCA
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-neutral-300">
          {activeTab === '2257' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-display">
                18 U.S.C. § 2257 & 2257A Record-Keeping Exemption Statement
              </h3>
              <p>
                All visual materials including images, videos, and multi-media sequences appearing on or generated through Velvet AI are strictly synthetic computer-generated imagery (CGI) produced entirely via generative neural diffusion models.
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
                <p className="font-medium text-white">Statutory Exemption Criteria:</p>
                <ul className="list-disc pl-4 space-y-1 text-neutral-400">
                  <li>No actual human beings were photographed, recorded, or depicted in any visual depictions.</li>
                  <li>All visual representations are mathematical representations synthesized from algorithmic prompt vectors.</li>
                  <li>Accordingly, this site is exempt from the record-keeping provisions of 18 U.S.C. § 2257 and 28 C.F.R. Part 75.</li>
                </ul>
              </div>
              <p>
                The custodian of records regarding server audit logs and age verification consents can be reached at: <span className="font-mono text-rose-400">compliance@velvet-ai.studio</span>.
              </p>
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-display">
                Zero Tolerance on Minors & Ethical Guardrails Charter
              </h3>
              <p>
                Velvet AI is committed to an absolute ethical boundary. Adult creative freedom does NOT permit illegal, exploitative, or non-consensual content.
              </p>
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-2 text-rose-200">
                <div className="font-semibold text-rose-300">Strictly Prohibited Content:</div>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  <li><strong>Depiction of Minors (CSAM/CSAE):</strong> Absolute zero tolerance. Any attempt to generate depictions of anyone under 18 or simulate underage individuals will result in instantaneous ban and legal referral.</li>
                  <li><strong>Non-Consensual Sexual Content:</strong> Any depiction or narrative of non-consensual sexual acts, sexual assault, drugging, or coercion is permanently blocked.</li>
                  <li><strong>Extreme Violence & Bodily Mutilation:</strong> Graphic violence, gore, torture, or bodily harm is strictly barred.</li>
                  <li><strong>Non-Consensual Deepfakes:</strong> Synthesizing unauthorized likenesses of real, living private individuals or public figures without explicit consent is forbidden.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-display">
                Terms of Service (Adult Content Platform)
              </h3>
              <p>
                By accessing Velvet AI, you represent and warrant that you are at least eighteen (18) years of age (or legal age of majority in your jurisdiction) and possess the legal capacity to enter into binding agreements.
              </p>
              <p>
                <strong>Credits and Billing:</strong> Credits are expended on generation execution. If a generation fails or is terminated by system anomaly, credits are auto-refunded. Unused credits from one-time packs do not expire.
              </p>
              <p>
                <strong>License:</strong> You own the outputs generated through your paid subscriptions subject to continuous adherence to the Ethics Charter.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-display">
                Privacy Policy & DMCA Copyright Notice
              </h3>
              <p>
                We do not sell, rent, or monetize your creative prompts or generations. All generations are isolated within your account and can be permanently purged at any time in compliance with GDPR Right to Erasure.
              </p>
              <p>
                <strong>DMCA Designated Agent:</strong> If you believe content generated or hosted infringes upon your copyright, submit a formal DMCA notice to <span className="font-mono text-white">dmca@velvet-ai.studio</span> with the work identification and proof of ownership.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#0A0C13] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
