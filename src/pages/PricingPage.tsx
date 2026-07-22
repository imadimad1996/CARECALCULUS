import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Sparkles, Building2, User, ArrowRight, X, HelpCircle } from 'lucide-react';
import { LangCode } from '../types';
import { PayPalButtonModal } from '../components/PayPalButtonModal';

export default function PricingPage({ lang }: { lang: LangCode }) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);

  const isFr = lang === 'fr';

  const proPrice = billingCycle === 'annual' ? '79.00' : '9.99';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header with Animation */}
      <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20 inline-block mb-4 shadow-sm">
          {isFr ? 'TARIFICATION TRANSPARENTE' : 'TRANSPARENT PRICING'}
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          {isFr ? 'Choisissez le Forfait Adapté à Votre Pratique' : 'Elevate Your Bedside Clinical Practice'}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          {isFr
            ? 'Accès gratuit pour tous les étudiants. Débloquez les exports Epic/Cerner illimités et la file d\'attente de garde avec le Pass Pro.'
            : 'Free forever for students. Unlock 1-click Epic/Cerner progress note exports and offline shift queues with Pro.'}
        </p>

        {/* Modern Segmented Billing Toggle */}
        <div className="mt-10 inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner relative">
          {/* Animated Background Pill */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-900 rounded-full shadow-md transition-all duration-300 ease-out`}
            style={{ left: billingCycle === 'monthly' ? '6px' : 'calc(50%)' }}
          ></div>
          
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer w-40 ${
              billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {isFr ? 'Pass 1 Mois' : '1-Month Pass'}
          </button>
          
          <button
            onClick={() => setBillingCycle('annual')}
            className={`relative z-10 px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer w-48 ${
              billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <span>{isFr ? 'Pass 1 An' : '1-Year Pass'}</span>
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
              {isFr ? '-34%' : 'SAVE 34%'}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch mb-20">
        
        {/* Tier 1: Free Pass */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500 mb-6">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{isFr ? 'Forfait Étudiant' : 'Free Bedside Pass'}</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{isFr ? 'Gratuit' : 'Free Pass'}</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{isFr ? 'Idéal pour les étudiants et internes' : 'For students, residents, and basic calculations.'}</p>

            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-black tracking-tighter">$0</span>
              <span className="text-sm text-slate-500 font-medium pb-2">/ {isFr ? 'toujours' : 'forever'}</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Accès complet aux 88 calculateurs cliniques' : 'Access to all 88 Clinical Calculators'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Support multilingue FR / EN / AR' : 'Trilingual EN / FR / AR Support'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Export texte brut basique' : 'Basic Plain Text Copy/Paste Export'}</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-4 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl transition-all cursor-pointer">
            {isFr ? 'Votre Forfait Actuel' : 'Your Current Plan'}
          </button>
        </div>

        {/* Tier 2: Pro Pass (Featured) */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 bg-slate-900 text-white rounded-3xl p-8 border-2 border-cyan-500 shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative overflow-hidden transform md:-translate-y-4">
          {/* Most Popular Badge */}
          <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-black text-[10px] uppercase px-5 py-1.5 rounded-bl-2xl tracking-widest shadow-md">
            {isFr ? 'PLUS POPULAIRE' : 'MOST POPULAR'}
          </div>

          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-6">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{isFr ? 'Pass Clinicien Pro' : 'Pro Clinician Pass'}</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{isFr ? 'Pro Clinicien' : 'Pro Pass'}</h3>
            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{isFr ? 'Pour les médecins de garde, réanimateurs et urgentistes.' : 'For ER & ICU attendings, fellows, and hospitalists.'}</p>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black tracking-tighter text-white">${proPrice}</span>
                <span className="text-sm text-slate-400 font-medium pb-2">/ {isFr ? 'paiement unique' : 'one-time'}</span>
              </div>
              <span className="inline-block mt-2 px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-md">
                {billingCycle === 'annual' ? (isFr ? 'Accès complet 1 an' : '1-Year Full Access') : (isFr ? 'Accès complet 1 mois' : '1-Month Full Access')}
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-200 mb-8 font-medium">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{isFr ? '1-Clic Export Epic / Cerner SmartPhrase' : '1-Click Epic & Cerner DotPhrase Formatted Export'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{isFr ? 'File d\'attente de garde locale illimitée' : 'Unlimited Local Shift Patient Queue (HIPAA-Ready)'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{isFr ? 'Mode PWA Hors-Ligne intégrale' : 'Full Offline PWA Service Worker (Works in ICU basements)'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{isFr ? '100% Sans Publicité' : '100% Ad-Free Experience'}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setIsPayPalModalOpen(true)}
            className="w-full py-4 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isFr ? 'Obtenir le Pass Pro' : 'Get Pro Pass'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Tier 3: Hospital License */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 bg-white dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{isFr ? 'Licence Hospitalière' : 'Hospital Department'}</span>
            </div>
            <h3 className="text-2xl font-black mb-2">{isFr ? 'Service / Hôpital' : 'Department Pass'}</h3>
            <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{isFr ? 'Pour les services de réanimation et SAMU.' : 'For full hospital units, ER departments & EMS systems.'}</p>

            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-black tracking-tighter">$499</span>
              <span className="text-sm text-slate-500 font-medium pb-2">/ {isFr ? 'an' : 'year'}</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Modèles EHR personnalisés pour l\'hôpital' : 'Custom Hospital EHR DotPhrase Templates'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Serveur Intranet ou PWA dédié' : 'Dedicated Intranet Server Deployment'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <span>{isFr ? 'Facturation par virement / bon de commande' : 'Direct Invoice, Purchase Order, or Wire Transfer'}</span>
              </li>
            </ul>
          </div>

          <a
            href="mailto:contact@carecalculus.com?subject=Hospital%20Department%20License"
            className="w-full py-4 px-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 font-bold rounded-xl transition-all text-center block cursor-pointer"
          >
            {isFr ? 'Contacter l\'Équipe' : 'Contact Sales'}
          </a>
        </div>
      </div>

      {/* Trust & Guarantees */}
      <div className="animate-in fade-in duration-700 delay-500 flex flex-col sm:flex-row items-center justify-center gap-8 py-10 border-y border-slate-200 dark:border-slate-800 mb-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-full text-emerald-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            {isFr ? 'Paiement Sécurisé SSL 256-bit par PayPal' : '256-Bit SSL Encrypted PayPal Processing'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-full text-amber-500">
            <Zap className="w-6 h-6" />
          </div>
          <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            {isFr ? 'Activation Immédiate du Pass Pro' : 'Instant Pro Activation After Checkout'}
          </span>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[600ms]">
        <h3 className="text-2xl font-black mb-8 text-center">{isFr ? 'Comparaison Détaillée des Fonctionnalités' : 'Detailed Feature Comparison'}</h3>
        
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 md:p-6 font-bold text-slate-900 dark:text-slate-100 w-1/2">{isFr ? 'Fonctionnalité' : 'Feature'}</th>
                <th className="p-4 md:p-6 font-bold text-center text-slate-600 dark:text-slate-400 w-1/4">{isFr ? 'Gratuit' : 'Free Pass'}</th>
                <th className="p-4 md:p-6 font-black text-center text-cyan-600 dark:text-cyan-400 w-1/4">Pro Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 md:p-6 text-slate-700 dark:text-slate-300">{isFr ? 'Tous les calculateurs cliniques' : 'All Clinical Calculators (88+)'}</td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 inline-block" /></td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-cyan-500 inline-block" /></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 md:p-6 text-slate-700 dark:text-slate-300">{isFr ? 'Interface Multilingue' : 'Multilingual Interface'}</td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-emerald-500 inline-block" /></td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-cyan-500 inline-block" /></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-slate-50/50 dark:bg-slate-800/10">
                <td className="p-4 md:p-6 font-semibold text-slate-900 dark:text-slate-100">{isFr ? 'Formats Export Epic / Cerner' : 'Epic / Cerner DotPhrase Formats'}</td>
                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-slate-300 dark:text-slate-700 inline-block" /></td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-cyan-500 inline-block" /></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 md:p-6 font-semibold text-slate-900 dark:text-slate-100">{isFr ? 'File d\'attente patients hors-ligne' : 'Offline Patient Shift Queue'}</td>
                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-slate-300 dark:text-slate-700 inline-block" /></td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-cyan-500 inline-block" /></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-slate-50/50 dark:bg-slate-800/10">
                <td className="p-4 md:p-6 font-semibold text-slate-900 dark:text-slate-100">{isFr ? 'Expérience Sans Publicité' : 'Ad-Free Experience'}</td>
                <td className="p-4 md:p-6 text-center"><X className="w-5 h-5 text-slate-300 dark:text-slate-700 inline-block" /></td>
                <td className="p-4 md:p-6 text-center"><Check className="w-5 h-5 text-cyan-500 inline-block" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Grid Redesign */}
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[700ms]">
        <h3 className="text-2xl font-black mb-8 text-center">{isFr ? 'Questions Fréquentes' : 'Frequently Asked Questions'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{isFr ? 'Les calculateurs restent-ils gratuits ?' : 'Are the clinical calculators still free?'}</h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-8 leading-relaxed">
              {isFr ? 'Oui ! L\'ensemble des 88 calculateurs et guides reste 100% gratuit et accessible de manière permanente.' : 'Yes! All 88 clinical calculators and guides remain 100% free and open-access permanently.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{isFr ? 'Comment fonctionne le paiement PayPal ?' : 'How does the PayPal payment work?'}</h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-8 leading-relaxed">
              {isFr ? 'Le paiement est un paiement unique géré par l\'API officielle de PayPal. Vous pouvez utiliser un compte PayPal ou une carte bancaire.' : 'It is a secure, one-time payment processed via the official PayPal API. You can pay with your PayPal account or a debit/credit card.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{isFr ? 'Est-ce un abonnement renouvelable ?' : 'Is this an auto-renewing subscription?'}</h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-8 leading-relaxed">
              {isFr ? 'Non, il s\'agit d\'un paiement unique pour la durée sélectionnée (1 mois ou 1 an). Aucun prélèvement automatique ne sera effectué.' : 'No, this is a strict one-time payment for the selected duration (1 month or 1 year). We will never auto-charge your card.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <div className="flex gap-3 mb-2">
              <HelpCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{isFr ? 'L\'application fonctionne-t-elle hors-ligne ?' : 'Does the app work offline in the hospital?'}</h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-8 leading-relaxed">
              {isFr ? 'Oui, avec le Pass Pro, toute l\'application est mise en cache dans votre navigateur (PWA) pour fonctionner sans connexion (idéal pour les sous-sols de réanimation).' : 'Yes, with the Pro Pass, the entire app is cached in your browser (PWA mode) allowing full functionality without internet (perfect for ICU basements).'}
            </p>
          </div>

        </div>
      </div>

      {/* PayPal Modal */}
      <PayPalButtonModal
        isOpen={isPayPalModalOpen}
        onClose={() => setIsPayPalModalOpen(false)}
        planName={billingCycle === 'annual' ? "CareCalculus Pro 1-Year Pass" : "CareCalculus Pro 1-Month Pass"}
        price={proPrice}
        currency="USD"
        planType={billingCycle}
      />
    </div>
  );
}
