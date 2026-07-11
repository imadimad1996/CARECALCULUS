import React from 'react';
import { AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'neutral';

export interface ActionableResultProps {
  score: string | number;
  title?: string;
  riskLevel: RiskLevel;
  interpretation: string;
  nextSteps?: string[];
  lang?: 'en' | 'fr' | 'ar';
}

export const ActionableResultPanel: React.FC<ActionableResultProps> = ({
  score,
  title,
  riskLevel,
  interpretation,
  nextSteps,
  lang = 'en'
}) => {
  const isRtl = lang === 'ar';

  const styles = {
    low: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      scoreBg: 'bg-emerald-100/50',
      scoreText: 'text-emerald-700',
      label: { en: 'Low Risk', fr: 'Risque Faible', ar: 'مخاطر منخفضة' }
    },
    medium: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      scoreBg: 'bg-amber-100/50',
      scoreText: 'text-amber-700',
      label: { en: 'Moderate Risk', fr: 'Risque Modéré', ar: 'مخاطر معتدلة' }
    },
    high: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      text: 'text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600" />,
      scoreBg: 'bg-rose-100/50',
      scoreText: 'text-rose-700',
      label: { en: 'High Risk', fr: 'Risque Élevé', ar: 'مخاطر عالية' }
    },
    neutral: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-800',
      icon: <Info className="w-5 h-5 text-teal-600" />,
      scoreBg: 'bg-teal-100/50',
      scoreText: 'text-teal-700',
      label: { en: 'Result', fr: 'Résultat', ar: 'النتيجة' }
    }
  };

  const style = styles[riskLevel];

  const t = {
    nextSteps: { en: 'Management & Next Steps', fr: 'Gestion et Prochaines Étapes', ar: 'الإدارة والخطوات التالية' }
  };

  return (
    <div className={`mt-6 rounded-xl border ${style.border} ${style.bg} overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="p-5 sm:p-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          
          {/* Big Score Box */}
          <div className={`shrink-0 flex flex-col items-center justify-center p-4 rounded-xl ${style.scoreBg} border border-white/50 min-w-[120px]`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 opacity-80">
              {title || style.label[lang]}
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
                {style.label[lang]}
              </h3>
            </div>
            <p className="text-[15px] leading-relaxed text-slate-700 font-medium">
              {interpretation}
            </p>
          </div>
        </div>

        {/* Actionable Next Steps (The MDCalc killer feature) */}
        {nextSteps && nextSteps.length > 0 && (
          <div className="mt-6 pt-5 border-t border-black/5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              {t.nextSteps[lang]}
            </h4>
            <ul className="space-y-2.5">
              {nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <ArrowRight className={`w-4 h-4 mt-0.5 shrink-0 opacity-40 ${isRtl ? 'rotate-180' : ''}`} />
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
