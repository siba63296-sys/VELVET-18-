import React, { useState } from 'react';
import { Coins, Check, Zap, CreditCard, Download, ShieldCheck, ArrowUpRight, Smartphone } from 'lucide-react';
import { User, CreditTransaction, CreditPack, SubscriptionTier } from '../types';
import { Storage } from '../lib/storage';
import { CashfreeCheckoutModal } from './CashfreeCheckoutModal';

interface BillingViewProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

const CREDIT_PACKS: CreditPack[] = [
  { id: 'pack_99', name: 'Starter Pack', credits: 50, priceInr: 99 },
  { id: 'pack_399', name: 'Creator Pack', credits: 250, priceInr: 399, badge: 'Popular' },
  { id: 'pack_999', name: 'Studio Pack', credits: 750, priceInr: 999, badge: 'Best Value' },
];

const SUBSCRIPTIONS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free Starter',
    priceInr: 0,
    creditsPerMonth: 10,
    description: '10 free welcome credits upon Supabase signup with standard queue.',
    features: ['10 Free bonus credits', 'Standard Image & Chat access', 'Community support'],
  },
  {
    id: 'basic',
    name: 'Basic Creator',
    priceInr: 199,
    creditsPerMonth: 100,
    description: 'Entry tier for casual creators wanting regular monthly credits.',
    features: [
      '100 Monthly recurring credits',
      'High-resolution diffusion rendering',
      'All standard AI models',
      'Roll-over of unused credits',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    priceInr: 599,
    creditsPerMonth: 500,
    description: 'Priority GPU speed, 4K upscaling, and high-framerate video generation.',
    features: [
      '500 Monthly recurring credits',
      'Priority GPU queue (sub-3 second speed)',
      '4K upscaling & Video Motion engine',
      'Uncensored creative chat personas',
    ],
    popular: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited VIP',
    priceInr: 1999,
    creditsPerMonth: 0,
    description: 'Unlimited zero-credit generations, dedicated GPU cluster & API access.',
    features: [
      'Unlimited image & video generations',
      'Zero credit deductions',
      'Dedicated cluster instance',
      'API access & priority 24/7 support',
    ],
  },
];

export const BillingView: React.FC<BillingViewProps> = ({ user, onUserUpdated }) => {
  const [transactions, setTransactions] = useState<CreditTransaction[]>(Storage.getTransactions());
  const [checkoutItem, setCheckoutItem] = useState<{
    name: string;
    priceInr: number;
    credits: number;
    isSubscription?: boolean;
    tierId?: 'free' | 'basic' | 'pro' | 'unlimited';
  } | null>(null);

  const handleCheckoutSuccess = (creditsAdded: number, newPlan?: 'free' | 'basic' | 'pro' | 'unlimited') => {
    const updated = Storage.getUser();
    onUserUpdated(updated);
    setTransactions(Storage.getTransactions());
  };

  const handleDownloadInvoice = (invoiceId?: string) => {
    alert(`Downloading Cashfree invoice ${invoiceId || 'INV-CURRENT'}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      {/* Header & Balance Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Cashfree Payments (UPI, Cards & NetBanking)</span>
            <span aria-hidden="true">·</span>
            <span>Discrete Billing Protected</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Credits & Subscription Management
          </h1>
        </div>

        {/* Current Balance Box */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-[#0F121C]">
          <div>
            <div className="text-xs text-neutral-400">Current Balance</div>
            <div className="text-2xl font-extrabold font-mono text-white flex items-center gap-1.5 tabular-nums">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>{user.plan === 'unlimited' ? '∞' : user.credits.toFixed(1)}</span>
              <span className="text-xs font-normal text-neutral-400">credits</span>
            </div>
          </div>
          <div className="h-8 border-r border-neutral-800"></div>
          <div>
            <div className="text-xs text-neutral-400">Current Plan</div>
            <div className="text-sm font-bold uppercase text-rose-400 font-display">
              {user.plan}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">Top-Up Credit Packs</h2>
          <p className="text-xs text-neutral-400">
            Instant top-up via UPI or Card through Cashfree PG. Unused credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className="p-5 rounded-xl border border-neutral-800 bg-[#0C0E16] relative flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            >
              {pack.badge && (
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-rose-600 text-white">
                  {pack.badge}
                </span>
              )}
              <div>
                <h3 className="text-base font-bold text-white font-display">{pack.name}</h3>
                <div className="text-2xl font-extrabold text-white font-mono mt-1">
                  ₹{pack.priceInr.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-neutral-400">INR</span>
                </div>
                <div className="mt-2 text-xs text-amber-400 font-mono font-medium">
                  +{pack.credits} Credits (~₹{(pack.priceInr / pack.credits).toFixed(2)}/credit)
                </div>
              </div>

              <button
                onClick={() =>
                  setCheckoutItem({
                    name: pack.name,
                    priceInr: pack.priceInr,
                    credits: pack.credits,
                  })
                }
                className="w-full py-2.5 rounded-lg bg-[#141724] hover:bg-cyan-600 hover:text-white border border-neutral-700 hover:border-transparent text-xs font-semibold text-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Pay ₹{pack.priceInr} via Cashfree</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">Monthly Subscriptions</h2>
          <p className="text-xs text-neutral-400">
            Recurring monthly creator plans powered by Cashfree recurring payments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBSCRIPTIONS.map((tier) => (
            <div
              key={tier.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 ${
                tier.popular
                  ? 'border-rose-500/80 bg-[#10131E] shadow-lg shadow-rose-950/20'
                  : 'border-neutral-800 bg-[#0B0D14]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-display">{tier.name}</h3>
                  {user.plan === tier.id && (
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                      Active
                    </span>
                  )}
                </div>

                <div className="text-2xl font-extrabold text-white font-display">
                  ₹{tier.priceInr.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-neutral-400">/ mo</span>
                </div>

                <p className="text-xs text-neutral-400">{tier.description}</p>

                <ul className="space-y-2 text-xs text-neutral-300">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={user.plan === tier.id}
                onClick={() =>
                  setCheckoutItem({
                    name: `${tier.name} Plan`,
                    priceInr: tier.priceInr,
                    credits: tier.creditsPerMonth,
                    isSubscription: true,
                    tierId: tier.id,
                  })
                }
                className={`w-full py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:cursor-default ${
                  user.plan === tier.id
                    ? 'bg-neutral-800 text-neutral-500'
                    : tier.popular
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-[#151926] hover:bg-neutral-800 text-white border border-neutral-700'
                }`}
              >
                {user.plan === tier.id ? 'Active Plan' : `Choose ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-white">Cashfree Billing Ledger</h2>
          <p className="text-xs text-neutral-400">
            Real-time audit log of credit allocations, auto-refunds, and Cashfree payment orders.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-[#0B0D14] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#10121C] border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4 text-right">Credits Delta</th>
                  <th className="py-3 px-4 text-right">Order Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 text-neutral-400 tabular-nums">
                      {new Date(tx.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-neutral-200 font-sans">{tx.description}</td>
                    <td className="py-3 px-4 text-cyan-400 uppercase text-[10px]">
                      {tx.paymentGateway || 'Cashfree'}
                    </td>
                    <td
                      className={`py-3 px-4 text-right tabular-nums font-bold ${
                        tx.amount > 0
                          ? 'text-emerald-400'
                          : tx.amount < 0
                          ? 'text-rose-400'
                          : 'text-neutral-500'
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {tx.cashfreeOrderId ? (
                        <button
                          onClick={() => handleDownloadInvoice(tx.cashfreeOrderId)}
                          className="text-neutral-400 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{tx.cashfreeOrderId}</span>
                          <Download className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cashfree Checkout Modal */}
      <CashfreeCheckoutModal
        isOpen={!!checkoutItem}
        user={user}
        item={checkoutItem}
        onClose={() => setCheckoutItem(null)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};
