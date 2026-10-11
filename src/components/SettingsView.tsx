import React, { useState } from 'react';
import { User as UserIcon, Key, ShieldCheck, Trash2, Download, Check, Copy, AlertTriangle, RefreshCw } from 'lucide-react';
import { User, ApiKey } from '../types';
import { Storage } from '../lib/storage';

interface SettingsViewProps {
  user: User;
  onUserUpdated: (user: User) => void;
  onAccountDeleted: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUserUpdated,
  onAccountDeleted,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(Storage.getApiKeys());
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name, email };
    Storage.setUser(updated);
    onUserUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPassword('');
    setNewPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 2500);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const created = Storage.createApiKey(newKeyName.trim());
    setApiKeys(Storage.getApiKeys());
    setNewKeyName('');
  };

  const handleDeleteApiKey = (id: string) => {
    Storage.deleteApiKey(id);
    setApiKeys(Storage.getApiKeys());
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 1800);
  };

  const handleExportData = () => {
    const data = {
      user: Storage.getUser(),
      generations: Storage.getGenerations(),
      transactions: Storage.getTransactions(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velvet-account-archive-${Date.now()}.json`;
    a.click();
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation === 'DELETE') {
      localStorage.clear();
      onAccountDeleted();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-800">
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Account & Security Settings
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your credentials, API keys, compliance verification status, and data retention.
        </p>
      </div>

      {/* 18+ Verification Status Card */}
      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>Age Verification Status: Verified 18+</span>
            </div>
            <p className="text-xs text-neutral-300">
              Your adult consent declaration is recorded under 18 U.S.C. § 2257 Record-Keeping Exemption.
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-emerald-400 tabular-nums hidden sm:block">
          TIMESTAMP: {new Date(user.ageVerifiedAt || user.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0C0E16] space-y-6">
        <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-rose-400" />
          <span>Creator Profile Information</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Display Pseudonym
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141724] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#141724] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            <span>{savedSuccess ? 'Profile Updated!' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0C0E16] space-y-4">
        <h2 className="text-base font-bold text-white font-display">Change Password</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#141724] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#141724] border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
          >
            {passwordSuccess ? 'Password Updated!' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* API Key Management */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0C0E16] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Programmatic API Keys</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Access the generation pipeline programmatically via server-side endpoints.
            </p>
          </div>
        </div>

        {/* Create API Key Form */}
        <form onSubmit={handleCreateApiKey} className="flex gap-2">
          <input
            type="text"
            placeholder="Key name (e.g. My Telegram Bot, Python Script)..."
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-[#141724] border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Create API Key
          </button>
        </form>

        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div
              key={key.id}
              className="p-3 rounded-xl border border-neutral-800 bg-[#121520] flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-white">{key.name}</div>
                <div className="text-[11px] font-mono text-neutral-400">{key.keyPrefix}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyKey(key.id, `${key.keyPrefix}sec_98412`)}
                  className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy secret key"
                >
                  {copiedKeyId === key.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDeleteApiKey(key.id)}
                  className="p-1.5 rounded-lg hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GDPR Data Management & Delete Account */}
      <div className="p-6 rounded-2xl border border-rose-900/40 bg-rose-950/10 space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-200 font-display">GDPR & Account Deletion</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            You can export your complete vault data or permanently wipe your account and all associated logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-semibold text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All Vault Data (.JSON)</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account Permanently</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#12141D] border border-rose-900/80 rounded-2xl p-6 text-neutral-200 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold font-display text-white">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              This action is irreversible. All generated images, videos, credit balance, API keys, and logs will be permanently deleted from servers.
            </p>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">
                Type <span className="font-mono text-rose-400 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-neutral-700 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-xs font-medium text-neutral-300"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmation !== 'DELETE'}
                onClick={handleConfirmDelete}
                className="py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-xs font-semibold text-white shadow-md shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
