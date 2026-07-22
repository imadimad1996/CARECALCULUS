import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, X, Sparkles } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { activateProPass } from '../utils/pro';

export interface PayPalButtonModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  price?: string;
  currency?: string;
  planType?: 'monthly' | 'annual';
}

const PAYPAL_CLIENT_ID = 'AU0VCz5JZ_ky8LIOb7XrdFVJa3AcwJLQNo2330Ks_BteUsQOOfqvZmYsQ4QDk6aIokjpF_qDKFsK8yJp';

export const PayPalButtonModal: React.FC<PayPalButtonModalProps> = ({
  isOpen,
  onClose,
  planName = 'CareCalculus Pro Clinician Membership',
  price = '9.99',
  currency = 'USD',
  planType = 'monthly',
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      console.log('PayPal Payment Captured:', details);
      
      // 1. Activate client entitlement with duration
      activateProPass(planType);
      
      // 2. Notify backend worker API
      try {
        await fetch('/api/paypal-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: details.id,
            payerEmail: details.payer?.email_address,
            amount: price,
            planType,
            status: details.status
          })
        });
      } catch (err) {
        console.warn('Backend PayPal verification warning:', err);
      }

      setPaymentSuccess(true);
    });
  };

  const handleClose = () => {
    // If they were successful, let's refresh the page so the app picks up the PRO status globally
    if (paymentSuccess) {
      window.location.reload();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Payment Successful!</h3>
            <p className="text-slate-300 text-sm max-w-sm mx-auto">
              Your CareCalculus Pro Clinician Pass is now active. Thank you for supporting evidence-based open clinical software!
            </p>
            <button
              onClick={handleClose}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow-lg cursor-pointer"
            >
              Continue to Workbench
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white">Upgrade to Pro Clinician</h3>
                <p className="text-xs text-slate-400">Unlock Unlimited EHR Exporting & Shift Backup</p>
              </div>
            </div>

            {/* Plan details */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-100 block">{planName}</span>
                <span className="text-xs text-slate-400">One-Time Payment • Non-Renewing Pass</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">${price}</span>
              </div>
            </div>

            {/* Feature checklist */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click Epic & Cerner DotPhrase Progress Note Formatter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Offline Service Worker PWA for Zero-Reception ICU Basements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited Local Shift Patient Queue Storage</span>
              </div>
            </div>

            {/* PayPal Container */}
            <div className="pt-2 min-h-[150px]">
              <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: currency, intent: "capture" }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: planName,
                          amount: {
                            currency_code: currency,
                            value: price,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={handleApprove}
                  onError={(err) => {
                    console.error("PayPal Checkout Error:", err);
                  }}
                />
              </PayPalScriptProvider>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted Secure PayPal Payment Processing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
