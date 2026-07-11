import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, AlertOctagon, Calculator, ArrowRightLeft } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

const T = {
  en: {
    code: '404',
    title: 'Page Not Found',
    desc: 'This clinical route doesn\'t exist. Navigate to an active calculator or browse the library.',
    home: 'Go Home',
    calculators: 'Open Calculators',
    popular: 'Popular tools',
  },
  fr: {
    code: '404',
    title: 'Page introuvable',
    desc: 'Cette route clinique n\'existe pas. Naviguez vers un calculateur actif ou parcourez la bibliothèque.',
    home: 'Accueil',
    calculators: 'Voir les outils',
    popular: 'Outils populaires',
  },
  
};

const QUICK_LINKS = [
  { path: '/map-calculator', en: 'MAP Calculator', fr: 'Calculateur PAM' },
  { path: '/glasgow-coma-scale', en: 'GCS Score', fr: 'Score Glasgow' },
  { path: '/creatinine-clearance', en: 'Creatinine Clearance', fr: 'Clairance Créatinine' },
  { path: '/qsofa-score', en: 'qSOFA Sepsis', fr: 'qSOFA Sepsis' },
  { path: '/meld-score', en: 'MELD Liver', fr: 'Score MELD' },
  { path: '/wells-score', en: 'Wells DVT', fr: 'Wells Phlébite' },
];

export default function NotFound({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = false;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertOctagon className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-8xl font-black text-gray-100 leading-none select-none">{t.code}</div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t.title}</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{t.desc}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to={langPath('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-all"
        >
          <HeartPulse className="w-4 h-4" />
          {t.home}
        </Link>
        <Link
          to={langPath('/map-calculator')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-500 transition-all"
        >
          <Calculator className="w-4 h-4" />
          {t.calculators}
        </Link>
      </div>

      <div className="w-full max-w-lg space-y-3">
        <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">{t.popular}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_LINKS.map(link => {
            const label = lang === 'fr' ? link.fr : link.en;
            return (
              <Link
                key={link.path}
                to={langPath(link.path)}
                className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-xs font-bold text-gray-700 min-h-[44px]"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
