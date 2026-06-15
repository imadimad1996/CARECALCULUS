import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "SIRS Criteria",
    subtitle: "Systemic Inflammatory Response Syndrome",
    temp: "Temperature > 38°C or < 36°C",
    hr: "Heart Rate > 90/min",
    rr: "Respiratory Rate > 20/min or PaCO2 < 32 mmHg",
    wbc: "WBC > 12,000, < 4,000 or > 10% bands",
    result: "SIRS Criteria Met?",
    formula: "2 or more positive criteria",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "If ≥ 2 criteria are met, the patient has SIRS. If SIRS is present with a suspected infection, it defines sepsis (per older Sepsis-2 guidelines).",
    references: "References: Bone RC, et al. Definitions for sepsis and organ failure.",
    positive: "Positive (≥ 2)",
    negative: "Negative (< 2)"
  },
  fr: {
    title: "Critères SIRS",
    subtitle: "Syndrome de Réponse Inflammatoire Systémique",
    temp: "Température > 38°C ou < 36°C",
    hr: "Fréquence Cardiaque > 90/min",
    rr: "Fréquence Respiratoire > 20/min ou PaCO2 < 32 mmHg",
    wbc: "Leucocytes > 12 000, < 4 000 ou > 10% immatures",
    result: "Critères SIRS Atteints?",
    formula: "2 critères positifs ou plus",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Si ≥ 2 critères, le patient a un SRIS. Associé à une infection suspectée, cela définit le sepsis (selon les anciennes directives Sepsis-2).",
    references: "Références: Bone RC, et al. Definitions for sepsis and organ failure.",
    positive: "Positif (≥ 2)",
    negative: "Négatif (< 2)"
  },
  ar: {
    title: "معايير SIRS",
    subtitle: "متلازمة الاستجابة الالتهابية الجهازية",
    temp: "درجة الحرارة > 38 أو < 36 مئوية",
    hr: "معدل ضربات القلب > 90/دقيقة",
    rr: "معدل التنفس > 20/دقيقة أو PaCO2 < 32 مم زئبق",
    wbc: "كريات الدم البيضاء > 12,000، < 4,000 أو > 10% غير ناضجة",
    result: "هل تنطبق SIRS؟",
    formula: "معياران إيجابيان أو أكثر",
    clinicalTitle: "التفسير السريري",
    clinicalText: "إذا تحقق معيارين أو أكثر، فالمريض مصاب بـ SIRS. إذا كان مصحوباً باشتباه في عدوى فإنه يحدد الإنتان (بحسب إرشادات Sepsis-2 القديمة).",
    references: "المراجع: Bone RC, et al.",
    positive: "إيجابي (≥ 2)",
    negative: "سلبي (< 2)"
  }
};

const criteriaList = [
  { key: 'temp' },
  { key: 'hr' },
  { key: 'rr' },
  { key: 'wbc' }
] as const;

export default function SirsCriteria({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return criteriaList.reduce((acc, item) => {
      return acc + (selections[item.key] ? 1 : 0);
    }, 0);
  }, [selections]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('sirs-criteria', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = scoreValue >= 2 
    ? { label: currentText.positive, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' }
    : { label: currentText.negative, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-4">
              
              {criteriaList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-300'}`}>
                    {selections[item.key] && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6667 3.5L5.25001 9.91667L2.33334 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4 pt-0.5">
                    <span className={`text-base font-medium ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 4</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.temp, value: selections.temp ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.hr, value: selections.hr ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.rr, value: selections.rr ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.wbc, value: selections.wbc ? 'Yes (1)' : 'No (0)' }
                ]}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 4` },
                  { label: 'SIRS Severity Status', value: category.label }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-550 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
