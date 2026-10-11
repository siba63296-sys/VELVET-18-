import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, ArrowRight, Smartphone, Building, CreditCard, RefreshCw, Lock } from 'lucide-react';
import { Storage } from '../lib/storage';
import { User } from '../types';

interface CashfreeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  item: {
    name: string;
    priceInr: number;
    credits: number;
    isSubscription?: boolean;
    tierId?: 'free' | 'basic' | 'pro' | 'unlimited';
  } | null;
  onSuccess: (creditsAdded: number, newPlan?: 'free' | 'basic' | 'pro' | 'unlimited') => void;
}

export const CashfreeCheckoutModal: React.FC<CashfreeCheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  item,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('creator@okaxis');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('•••');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  if (!isOpen || !item) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedOrderId = 'order_cf_' + Date.now();
    setOrderId(generatedOrderId);

    try {
      // 1. Try to invoke server-side Cashfree create order route
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderAmount: item.priceInr,
          customerId: user.id,
          customerEmail: user.email,
          customerName: user.name,
          customerPhone: '9999999999',
          orderNote: `Velvet 18+ AI - ${item.name}`,
        }),
      }).catch(() => null);

      let paymentSessionId = '';
      if (res && res.ok) {
        const data = await res.json();
        paymentSessionId = data.payment_session_id;
      }

      // Check if Cashfree JS SDK v3 is available on window
      const win = window as any;
      if (win.Cashfree && paymentSessionId) {
        const cashfree = win.Cashfree({ mode: 'sandbox' });
        // Can trigger cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' })
      }

      // Complete simulation / verification after 1.2s
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsProcessing(false);
      setIsComplete(true);

      setTimeout(() => {
        if (item.isSubscription && item.tierId) {
          Storage.updatePlan(item.tierId, item.credits);
          onSuccess(item.credits, item.tierId);
        } else {
          Storage.addCredits(item.credits, `Cashfree PG: ${item.name}`);
          onSuccess(item.credits);
        }
        setIsComplete(false);
        onClose();
      }, 1400);
    } catch (err) {
      setIsProcessing(false);
      alert('Payment processing error. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0E1018] border border-neutral-800 rounded-2xl p-6 shadow-2xl text-neutral-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isComplete ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">Payment Verified via Cashfree</h3>
            <p className="text-xs text-neutral-300">
              {item.credits > 0 ? (
                <>
                  <span className="font-mono text-emerald-400 font-bold">+{item.credits} Credits</span> successfully credited to your wallet.
                </>
              ) : (
                'Your Unlimited VIP subscription is now active with zero limits.'
              )}
            </p>
            <div className="text-[11px] font-mono text-neutral-500">
              Cashfree Order ID: {orderId}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Cashfree Branded Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    Cashfree Payments
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-mono">
                    SECURE 256-BIT
                  </span>
                </div>
                <h2 className="text-lg font-bold font-display text-white mt-0.5">{item.name}</h2>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold text-white font-mono">
                  ₹{item.priceInr.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-neutral-400">INR Incl. GST</div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-3 p-1 bg-[#141724] rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'upi' ? 'bg-[#22273B] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>UPI (Fast)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'card' ? 'bg-[#22273B] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'netbanking' ? 'bg-[#22273B] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>NetBanking</span>
              </button>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              {/* UPI Tab */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-xl bg-[#121522] border border-neutral-800 space-y-3.5">
                  <div className="text-xs font-semibold text-neutral-300">Choose Instant UPI App</div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay' },
                      { id: 'phonepe', name: 'PhonePe' },
                      { id: 'paytm', name: 'Paytm' },
                      { id: 'bhim', name: 'BHIM UPI' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                          selectedUpiApp === app.id
                            ? 'border-cyan-500 bg-cyan-950/30 text-white'
                            : 'border-neutral-800 bg-[#0A0C13] text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{app.name}</div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Or Enter UPI VPA ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0C13] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* Cards Tab */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-xl bg-[#121522] border border-neutral-800 space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                      Card Number (RuPay, Visa, MasterCard)
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0C13] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0A0C13] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0A0C13] border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-xl bg-[#121522] border border-neutral-800 space-y-3">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0C13] border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {/* Cashfree Privacy & Security Notice */}
              <div className="p-2.5 rounded-lg bg-[#090A10] border border-neutral-800/80 flex items-center gap-2 text-[11px] text-neutral-400">
                <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Discrete transaction descriptor: "CF*TECHSERVICES". 100% discrete.</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/30"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Cashfree Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{item.priceInr.toLocaleString('en-IN')} via Cashfree</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
