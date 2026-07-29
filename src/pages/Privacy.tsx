import React from 'react';
import { ShieldCheck, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

const T = {
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: June 2026',
    intro: 'CareCalculus is designed with privacy as a default. This page explains what data we collect (very little) and how we use it.',
    sections: [
      {
        heading: 'No Personal Data Collected',
        body: 'CareCalculus does not collect, store, or transmit any personally identifiable information (PII). We do not require account registration. No medical data you enter into our calculators is sent to any server — all calculations are performed locally in your browser.',
      },
      {
        heading: 'Local Storage Only',
        body: 'We use your browser\'s localStorage exclusively to remember your language preference (carecalculus-lang) and unit standard preference (carecalculus-standard). This data never leaves your device and is not shared with any third party.',
      },
      {
        heading: 'Advertising & Third-Party Cookies (Google AdSense)',
        body: 'CareCalculus uses Google AdSense to serve advertisements on our site. Google and its partner advertising networks may use cookies, web beacons, and similar technologies to collect information and serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google Ad Settings (https://www.google.com/settings/ads) or www.aboutads.info.',
      },
      {
        heading: 'No Medical Data Collection',
        body: 'CareCalculus does not collect, store, or transmit any medical data or clinical notes entered into our calculators. All calculations and clinical tools operate strictly locally inside your web browser for complete patient privacy.',
      },
      {
        heading: 'Local Storage Only',
        body: 'We use your browser\'s localStorage exclusively to remember your language preference (carecalculus-lang) and unit standard preference (carecalculus-standard). This data never leaves your device.',
      },
      {
        heading: 'GDPR & CCPA Compliance',
        body: 'Because we collect no personal health data, patient privacy is preserved by design. If you wish to manage advertising preferences or clear stored language/unit preferences, you may adjust your browser settings or opt out of personalized ads at any time.',
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : juillet 2026',
    intro: 'CareCalculus est conçu avec la confidentialité par défaut. Cette page explique quelles données nous collectons et comment les annonces sont gérées.',
    sections: [
      {
        heading: 'Publicité & Cookies Tiers (Google AdSense)',
        body: 'CareCalculus utilise Google AdSense pour diffuser des annonces. Google et ses réseaux partenaires peuvent utiliser des cookies et des balises web pour collecter des informations et diffuser des annonces basées sur vos visites antérieures. Vous pouvez désactiver la publicité personnalisée dans les paramètres des annonces Google (https://www.google.com/settings/ads).',
      },
      {
        heading: 'Aucune collecte de données médicales',
        body: 'CareCalculus ne collecte, ne stocke ni ne transmet aucune donnée médicale ou note clinique saisie dans nos outils. Tous les calculs sont effectués strictement localement dans votre navigateur pour une confidentialité totale des patients.',
      },
      {
        heading: 'Stockage local uniquement',
        body: 'Nous utilisons le localStorage de votre navigateur uniquement pour mémoriser vos préférences de langue (carecalculus-lang) et d\'unités (carecalculus-standard). Ces données ne quittent jamais votre appareil.',
      },
      {
        heading: 'Conformité RGPD & CCPA',
        body: 'Parce que nous ne collectons aucune donnée de santé personnelle, la confidentialité est préservée par conception. Vous pouvez gérer vos préférences publicitaires ou effacer le localStorage à tout moment via les paramètres de votre navigateur.',
      },
    ],
  },
};

export default function Privacy({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = false;

  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-100 rounded-xl">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.title}</h1>
        </div>
        <p className="text-xs text-gray-400 font-mono ml-1">{t.updated}</p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <p className="text-sm text-emerald-800 leading-relaxed font-semibold">{t.intro}</p>
      </div>

      <div className="space-y-4">
        {t.sections.map((section, i) => (
          <section key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-2">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              {section.heading}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          {lang === 'fr'
            ? 'Pour toute question sur cette politique, consultez également nos '
            : 'For any questions about this policy, also see our '}
          <Link to={langPath('/terms')} className="underline text-blue-600 font-semibold hover:text-blue-800">
            {lang === 'fr' ? 'Conditions d\'utilisation' : 'Terms of Use'}
          </Link>.
        </p>
      </div>
    </div>
  );
}
