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
    calculators: 'Search Tools',
    popular: 'Popular tools',
  },
  fr: {
    code: '404',
    title: 'Page introuvable',
    desc: 'Cette route clinique n\'existe pas. Naviguez vers un calculateur actif ou parcourez la bibliothèque.',
    home: 'Accueil',
    calculators: 'Chercher des Outils',
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
  { path: '/wells-pe-score', en: 'Wells PE', fr: 'Wells EP' },
];

export default function NotFound({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const t = T[lang];
  const isRtl = false;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center space-y-10 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Premium glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center shadow-inner border border-red-100">
            <AlertOctagon className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-400 leading-none select-none tracking-tighter">
          {t.code}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t.title}</h1>
        <p className="text-base text-slate-500 max-w-md mx-auto leading-relaxed">{t.desc}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto">
        <Link
          to={langPath('/')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
        >
          <HeartPulse className="w-5 h-5" />
          {t.home}
        </Link>
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 border border-slate-200 transition-all hover:shadow-lg active:scale-95"
        >
          <Calculator className="w-5 h-5 text-teal-600" />
          {t.calculators}
        </button>
      </div>

      <div className="w-full max-w-lg space-y-3">
        <p className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">{t.popular}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 gap-2">
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
