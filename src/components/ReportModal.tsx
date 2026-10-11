import React, { useState } from 'react';
import { X, Flag, CheckCircle } from 'lucide-react';
import { Storage } from '../lib/storage';

interface ReportModalProps {
  isOpen: boolean;
  generationId: string | null;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, generationId, onClose }) => {
  const [reason, setReason] = useState<'inappropriate_content' | 'copyright' | 'low_quality' | 'safety_hazard' | 'other'>('inappropriate_content');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !generationId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Storage.submitReport({
      id: 'rep_' + Date.now(),
      generationId,
      reason,
      notes,
      createdAt: new Date().toISOString(),
      status: 'investigating',
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0F1118] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Report Submitted</h3>
            <p className="text-xs text-neutral-400">
              Our safety review team will evaluate this generation within 24 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Flag className="w-5 h-5" />
              <h2 className="text-base font-bold text-white font-display">Report Generation</h2>
            </div>

            <p className="text-xs text-neutral-400">
              Please help us maintain platform compliance by reporting content that infringes upon our Zero-Tolerance or intellectual property policies.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Reason for Report
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="inappropriate_content">Suspected Underage or Non-consensual depiction</option>
                  <option value="safety_hazard">Extreme violence / gore hazard</option>
                  <option value="copyright">Copyright infringement / likeness violation</option>
                  <option value="low_quality">Severe visual deformity / defective render</option>
                  <option value="other">Other compliance concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide context regarding the flagged generation..."
                  className="w-full px-3 py-2 rounded-lg bg-[#141824] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-md shadow-rose-600/30"
              >
                Submit Report to Safety Board
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
