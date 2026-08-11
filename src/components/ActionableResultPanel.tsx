import React from 'react';
import { AlertCircle, CheckCircle2, Info, ArrowRight, Zap } from 'lucide-react';
import { isProActive } from '../utils/pro';
import NewsletterCapture from './NewsletterCapture';

export type RiskLevel = 'low' | 'medium' | 'high' | 'neutral';

import { LangCode } from '../types';

export interface ActionableResultProps {
  score: string | number;
  title?: string;
  riskLevel: RiskLevel;
  interpretation: string;
  nextSteps?: string[];
  lang?: LangCode;
}

export const ActionableResultPanel: React.FC<ActionableResultProps> = ({
  score,
  title,
  riskLevel,
  interpretation,
  nextSteps,
  lang = 'en'
}) => {
  const isRtl = false;

  const styles = {
    low: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      text: 'text-emerald-800 dark:text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />,
      scoreBg: 'bg-emerald-100/50 dark:bg-emerald-900/30',
      scoreText: 'text-emerald-700 dark:text-emerald-400',
      label: { en: 'Low Risk', fr: 'Risque Faible', es: 'Riesgo Bajo' }
    },
    medium: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/50',
      text: 'text-amber-800 dark:text-amber-400',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />,
      scoreBg: 'bg-amber-100/50 dark:bg-amber-900/30',
      scoreText: 'text-amber-700 dark:text-amber-400',
      label: { en: 'Moderate Risk', fr: 'Risque Modéré', es: 'Riesgo Moderado' }
    },
    high: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900/50',
      text: 'text-rose-800 dark:text-rose-400',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-500" />,
      scoreBg: 'bg-rose-100/50 dark:bg-rose-900/30',
      scoreText: 'text-rose-700 dark:text-rose-400',
      label: { en: 'High Risk', fr: 'Risque Élevé', es: 'Riesgo Alto' }
    },
    neutral: {
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-200 dark:border-teal-900/50',
      text: 'text-teal-800 dark:text-teal-400',
      icon: <Info className="w-5 h-5 text-teal-600 dark:text-teal-500" />,
      scoreBg: 'bg-teal-100/50 dark:bg-teal-900/30',
      scoreText: 'text-teal-700 dark:text-teal-400',
      label: { en: 'Result', fr: 'Résultat', es: 'Resultado' }
    }
  };

  const style = styles[riskLevel] || styles.neutral;

  const t = {
    nextSteps: { en: 'Management & Next Steps', fr: 'Gestion et Prochaines Étapes', es: 'Gestión y Próximos Pasos' }
  };

  return (
    <div className={`relative mt-6 rounded-2xl border ${style.border} ${style.bg} overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-5 sm:p-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          
          {/* Big Score Box */}
          <div className={`relative overflow-hidden shrink-0 flex flex-col items-center justify-center p-4 rounded-xl ${style.scoreBg} border border-white/50 min-w-[120px] ring-1 ring-black/5`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 mix-blend-overlay"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 opacity-80">
              {title || style.label[lang] || style.label.en}
            </span>
            <span className={`text-4xl font-mono font-black ${style.scoreText} tracking-tight leading-none`}>
              {score}
            </span>
          </div>

          {/* Interpretation */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              {style.icon}
              <h3 className={`text-lg font-bold ${style.text}`}>
                {style.label[lang] || style.label.en}
              </h3>
            </div>
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              {interpretation}
            </p>
          </div>
        </div>

        {/* Actionable Next Steps (The MDCalc killer feature) */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="mt-6 pt-5 border-t border-black/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              {t.nextSteps[lang] || t.nextSteps.en}
            </h4>
            <ul className="space-y-2.5">
              {nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <ArrowRight className={`w-4 h-4 mt-0.5 shrink-0 opacity-40 ${isRtl ? 'rotate-180' : ''}`} />
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Inline PRO Upsell & Lead Capture for Free Users */}
        {!isProActive() && (
          <div className="mt-6 pt-5 border-t border-black/5 flex flex-col gap-4">
            <button
              onClick={() => { window.location.href = '/pricing'; }}
              className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-cyan-900/10 to-blue-900/10 border border-cyan-500/30 hover:bg-gradient-to-r hover:from-cyan-900/20 hover:to-blue-900/20 hover:border-cyan-500/50 transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] shadow-sm hover:shadow-md group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 min-h-[44px] min-w-[44px] bg-cyan-500/20 text-cyan-700 rounded-lg group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {lang === 'fr' ? '⚡ Enregistrez ce résultat dans Epic instantanément' : '⚡ Save this result to Epic instantly'}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {lang === 'fr' ? 'Débloquez Pro pour copier des notes parfaitement formatées.' : 'Unlock Pro to copy perfectly formatted SBAR DotPhrases.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-cyan-700 uppercase tracking-widest hidden sm:inline-block">
                  {lang === 'fr' ? 'Débloquer Pro' : 'Unlock Pro'}
                </span>
                <ArrowRight className="w-5 h-5 text-cyan-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <div className="mt-2">
              <NewsletterCapture lang={lang} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
