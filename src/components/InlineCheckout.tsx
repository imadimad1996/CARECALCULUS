import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, CreditCard, Lock } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { activateProPass } from '../utils/pro';
import { LangCode } from '../types';

export interface InlineCheckoutProps {
  lang: LangCode;
  planName?: string;
  price?: string;
  currency?: string;
  planType?: 'monthly' | 'annual';
  onSuccess?: () => void;
}

const PAYPAL_CLIENT_ID = 'AU0VCz5JZ_ky8LIOb7XrdFVJa3AcwJLQNo2330Ks_BteUsQOOfqvZmYsQ4QDk6aIokjpF_qDKFsK8yJp';

export const InlineCheckout: React.FC<InlineCheckoutProps> = ({
  lang,
  planName = 'CareCalculus Pro Clinician Membership',
  price = '9.99',
  currency = 'USD',
  planType = 'monthly',
  onSuccess,
}) => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const isFr = lang === 'fr';

  const handleApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      console.log('PayPal/Card Payment Captured:', details);
      
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
        console.warn('Backend verification warning:', err);
      }

      setPaymentSuccess(true);
      if (onSuccess) onSuccess();
    });
  };

  return (
    <div id="inline-checkout-section" className="w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {paymentSuccess ? (
        <div className="text-center py-10 space-y-6">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/30 animate-bounce shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-3xl font-black text-white">
            {isFr ? 'Paiement Confirmé !' : 'Payment Successful!'}
          </h3>
          <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
            {isFr 
              ? 'Votre Pass Pro Clinician CareCalculus est désormais actif. Profitez des exports 1-clic Epic/Cerner et du mode hors-ligne.'
              : 'Your CareCalculus Pro Pass is now active. Thank you for supporting evidence-based clinical software!'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="py-4 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl transition shadow-xl hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isFr ? 'Commencer à Utiliser le Pass Pro' : 'Access Pro Features Now'}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-start md:items-center gap-3">
              <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30 shrink-0 mt-1 md:mt-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg md:text-2xl text-white leading-tight mb-1">
                  {isFr ? 'Paiement Direct par Carte ou PayPal' : 'Direct Card & PayPal Checkout'}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  {isFr ? 'Paiement unique sécurisé sans abonnement récurrent' : 'One-time secure pass • Non-renewing checkout'}
                </p>
              </div>
            </div>

            {/* Accepted Card Badges */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 self-start md:self-auto mt-2 md:mt-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 shrink-0">
                {isFr ? 'Cartes acceptées:' : 'Accepted Cards:'}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Visa Badge */}
                <span className="bg-white text-blue-900 font-black text-[11px] px-2 py-0.5 rounded italic tracking-tighter shadow-sm border border-slate-200">
                  VISA
                </span>
                {/* Mastercard Badge */}
                <span className="bg-slate-900 text-amber-500 font-black text-[10px] px-1.5 py-0.5 rounded tracking-tighter border border-slate-700 flex items-center gap-0.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                  <span className="w-2 h-2 bg-amber-400 rounded-full -ml-1.5 inline-block opacity-80"></span>
                  <span className="ml-1">MC</span>
                </span>
                {/* AMEX Badge */}
                <span className="bg-sky-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded tracking-tight">
                  AMEX
                </span>
                {/* CB Badge */}
                <span className="bg-emerald-700 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded">
                  CB
                </span>
              </div>
            </div>
          </div>

          {/* Highlight Callout for Card Payments */}
          <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3 text-cyan-200 text-xs md:text-sm">
            <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">
                {isFr ? 'Vous n\'avez pas de compte PayPal ?' : 'Don\'t have a PayPal account?'}
              </span>
              {isFr
                ? 'Aucun problème ! Vous pouvez payer directement par Carte Bancaire (Visa, Mastercard, Amex) en cliquant sur le bouton bleu "Payer par carte" ci-dessous.'
                : 'No problem! You can pay directly with your Credit or Debit Card (Visa, Mastercard, Amex) by selecting "Debit or Credit Card" below.'}
            </div>
          </div>

          {/* Selected Plan Summary */}
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-base text-slate-100 block">{planName}</span>
              <span className="text-xs text-slate-400">
                {planType === 'annual' 
                  ? (isFr ? 'Pass 1 An • Accès complet illimité' : '1-Year Pass • Full Unlimited Access') 
                  : (isFr ? 'Pass 1 Mois • Accès complet illimité' : '1-Month Pass • Full Unlimited Access')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-cyan-400">${price}</span>
              <span className="text-[11px] text-slate-400 block font-medium">USD ({isFr ? 'Unique' : 'One-time'})</span>
            </div>
          </div>

          {/* Inline PayPal & Card Buttons */}
          <div className="mt-6 p-4 min-h-[160px] bg-white rounded-2xl border border-slate-200 shadow-inner">
            <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: currency, intent: "capture" }}>
              <PayPalButtons
                style={{ 
                  layout: "vertical", 
                  shape: "rect", 
                  label: "pay",
                  height: 48
                }}
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

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isFr
                ? 'Cryptage SSL 256-bit hautement sécurisé par PayPal & Card Processing'
                : '256-Bit SSL Encrypted Card & PayPal Processing'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
