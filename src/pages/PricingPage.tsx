import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, HelpCircle, Building2, User, ArrowRight } from 'lucide-react';
import { LangCode } from '../types';
import { PayPalButtonModal } from '../components/PayPalButtonModal';

export default function PricingPage({ lang }: { lang: LangCode }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);

  const isFr = lang === 'fr';

  const proPrice = billingCycle === 'annual' ? '79.00' : '9.99';
  const proSubtext = billingCycle === 'annual' ? '$79.00 One-Time Payment for 1 Year Access' : '$9.99 One-Time Payment for 1 Month Access';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
          {isFr ? 'TARIFICATION TRANSPARENTE' : 'TRANSPARENT PRICING'}
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4 mb-4">
          {isFr ? 'Choisissez le Forfait Adapté à Votre Pratique' : 'Elevate Your Bedside Clinical Practice'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          {isFr
            ? 'Accès gratuit pour tous les étudiants. Débloquez les exports Epic/Cerner illimités et la file d\'attente de garde avec le Pass Pro.'
            : 'Free forever for students. Unlock 1-click Epic/Cerner progress note exports and offline shift queues with Pro.'}
        </p>

        {/* Billing Cycle Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {isFr ? 'Pass 1 Mois' : '1-Month Pass'}
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-cyan-600 text-white shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{isFr ? 'Pass 1 An (Économisez 34%)' : '1-Year Pass (Save 34%)'}</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">PROMO</span>
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {/* Tier 1: Free Pass */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-4">
              <User className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{isFr ? 'Forfait Étudiant' : 'Free Bedside Pass'}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{isFr ? 'Gratuit' : 'Free Pass'}</h3>
            <p className="text-xs text-slate-500 mb-6">{isFr ? 'Idéal pour les étudiants et internes' : 'For students, residents, and basic calculations'}</p>

            <div className="mb-6">
              <span className="text-4xl font-black">$0</span>
              <span className="text-xs text-slate-500"> / {isFr ? 'toujours' : 'forever'}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isFr ? 'Accès complet aux 88 calculateurs' : 'Access to all 88 Clinical Calculators'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isFr ? 'Support multilingue FR / EN / AR' : 'Trilingual EN / FR / AR Support'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isFr ? 'Export texte brut basique' : 'Basic Plain Text Export'}</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer">
            {isFr ? 'Utiliser Gratuitement' : 'Start Free'}
          </button>
        </div>

        {/* Tier 2: Pro Pass (Featured) */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border-2 border-cyan-500 shadow-2xl flex flex-col justify-between relative overflow-hidden transform md:-translate-y-2">
          <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-bl-2xl tracking-widest">
            {isFr ? 'PLUS POPULAIRE' : 'MOST POPULAR'}
          </div>

          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{isFr ? 'Pass Clinicien Pro' : 'Pro Clinician Pass'}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{isFr ? 'Pro Clinicien' : 'Pro Pass'}</h3>
            <p className="text-xs text-slate-400 mb-6">{isFr ? 'Pour les médecins de garde, réanimateurs et urgentistes' : 'For ER & ICU attendings, fellows, and hospitalists'}</p>

            <div className="mb-6">
              <span className="text-4xl font-black text-white">${billingCycle === 'annual' ? '79' : '9.99'}</span>
              <span className="text-xs text-slate-400"> / {isFr ? 'paiement unique' : 'one-time'}</span>
              <span className="block text-[11px] text-cyan-400 mt-1 font-mono">{proSubtext}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-bold">{isFr ? '1-Clic Export Epic / Cerner SmartPhrase' : '1-Click Epic & Cerner DotPhrase Export'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-bold">{isFr ? 'File d\'attente de garde locale illimitée' : 'Unlimited Local Shift Patient Queue'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isFr ? 'Mode PWA Hors-Ligne intégrale' : 'Full Offline PWA Service Worker'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isFr ? '100% Sans Publicité' : '100% Ad-Free Experience'}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsPayPalModalOpen(true)}
            className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isFr ? 'Payer par PayPal' : 'Upgrade via PayPal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tier 3: Hospital License */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-4">
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">{isFr ? 'Licence Hospitalière' : 'Hospital Department'}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{isFr ? 'Service / Hôpital' : 'Department Pass'}</h3>
            <p className="text-xs text-slate-500 mb-6">{isFr ? 'Pour les services de réanimation et SAMU' : 'For full hospital units, ER departments & EMS systems'}</p>

            <div className="mb-6">
              <span className="text-4xl font-black">$499</span>
              <span className="text-xs text-slate-500"> / {isFr ? 'an' : 'year'}</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{isFr ? 'Modèles EHR personnalisés pour l\'hôpital' : 'Custom Hospital EHR DotPhrase Templates'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{isFr ? 'Serveur Intranet ou PWA dédié' : 'Dedicated Intranet Server or Local PWA'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{isFr ? 'Facturation PayPal ou virement' : 'Direct PayPal Invoice or Wire Transfer'}</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:contact@carecalculus.com?subject=Hospital%20Department%20License"
            className="w-full py-3 px-4 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs rounded-xl transition text-center block cursor-pointer"
          >
            {isFr ? 'Contacter l\'Équipe' : 'Contact Sales'}
          </a>
        </div>
      </div>

      {/* Trust & Guarantees */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8 border-y border-slate-200 dark:border-slate-800 mb-16 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>{isFr ? 'Paiement Sécurisé SSL 256-bit par PayPal' : '256-Bit SSL Encrypted PayPal Processing'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <span>{isFr ? 'Activation Immédiate du Pass Pro' : 'Instant Pro Activation'}</span>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-center">{isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions'}</h3>
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold mb-1">{isFr ? 'Les calculateurs restent-ils gratuits ?' : 'Are the clinical calculators still free?'}</h4>
            <p className="text-slate-600 dark:text-slate-400">{isFr ? 'Oui ! L\'ensemble des 88 calculateurs et guides reste 100% gratuit et accessible.' : 'Yes! All 88 clinical calculators and guides remain 100% free and open-access.'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold mb-1">{isFr ? 'Comment fonctionne le paiement PayPal ?' : 'How does PayPal payment work?'}</h4>
            <p className="text-slate-600 dark:text-slate-400">{isFr ? 'Le paiement est géré de manière sécurisée par l\'API officielle PayPal. Vous pouvez utiliser votre compte PayPal ou une carte bancaire.' : 'Payments are processed securely via official PayPal Smart Buttons. You can pay with your PayPal account or debit/credit card.'}</p>
          </div>
        </div>
      </div>

      {/* PayPal Modal */}
      <PayPalButtonModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        planName="CareCalculus Pro Pass"
        price={proPrice}
        currency="USD"
      />
    </div>
  );
}
