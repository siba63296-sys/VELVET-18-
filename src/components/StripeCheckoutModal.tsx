import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { Storage } from '../lib/storage';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    name: string;
    price: number;
    credits: number;
    isSubscription?: boolean;
    tierId?: 'free' | 'pro' | 'unlimited';
  } | null;
  onSuccess: (creditsAdded: number, newPlan?: 'free' | 'pro' | 'unlimited') => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('•••');
  const [zip, setZip] = useState('90210');
  const [complete, setComplete] = useState(false);

  if (!isOpen || !item) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate Stripe payment intent & confirmation
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsProcessing(false);
    setComplete(true);

    setTimeout(() => {
      if (item.isSubscription && item.tierId) {
        Storage.updatePlan(item.tierId, item.credits);
        onSuccess(item.credits, item.tierId);
      } else {
        Storage.addCredits(item.credits, `Credit Pack: ${item.name}`);
        onSuccess(item.credits);
      }
      setComplete(false);
      onClose();
    }, 1200);
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

        {complete ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Payment Successful!</h3>
            <p className="text-xs text-neutral-300">
              {item.credits > 0 ? (
                <>
                  <span className="font-mono text-emerald-400 font-bold">+{item.credits} Credits</span> have been added to your balance.
                </>
              ) : (
                'Your Unlimited VIP membership is now active.'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Stripe Encrypted Checkout</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white">{item.name}</h2>
              <div className="text-2xl font-extrabold text-white font-mono mt-1">
                ${item.price.toFixed(2)}{' '}
                <span className="text-xs font-normal text-neutral-400">USD</span>
              </div>
            </div>

            {/* Simulated Stripe Card Element */}
            <form onSubmit={handlePay} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141724] border border-neutral-700/80 space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Card Information (Stripe Test Mode)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0F1118] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                    />
                    <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 rounded-lg bg-[#0F1118] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 rounded-lg bg-[#0F1118] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                    Postal / Zip Code
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="90210"
                    className="w-full px-3 py-2 rounded-lg bg-[#0F1118] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Discrete 256-bit encrypted billing. Descriptor: "VLVT CREATIVE".</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                {isProcessing ? (
                  <span>Authorizing with Stripe...</span>
                ) : (
                  <span>Pay ${item.price.toFixed(2)} Securely</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
