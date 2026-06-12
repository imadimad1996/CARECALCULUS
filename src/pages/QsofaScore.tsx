import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';

const translations: Translations = {
  en: {
    title: "qSOFA Score",
    subtitle: "Quick Sepsis-related Organ Failure Assessment",
    rr22: "Respiratory rate ≥ 22/min",
    mentation: "Altered mentation (GCS < 15)",
    sbp100: "Systolic blood pressure ≤ 100 mmHg",
    result: "qSOFA Score",
    formula: "1 point per positive criterion",
    clinicalTitle: "Clinical Management",
    clinicalText: "Score ≥ 2 indicates a high risk of poor outcome and suggests the patient should be investigated for sepsis.",
    references: "References: Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3).",
    lowRisk: "Low Risk (< 2)",
    highRisk: "High Risk of Sepsis (≥ 2)"
  },
  fr: {
    title: "Score qSOFA",
    subtitle: "Évaluation rapide de la défaillance d'organe liée au sepsis",
    rr22: "Fréquence respiratoire ≥ 22/min",
    mentation: "Altération de l'état mental (GCS < 15)",
    sbp100: "Pression artérielle systolique ≤ 100 mmHg",
    result: "Score qSOFA",
    formula: "1 point par critère",
    clinicalTitle: "Prise en charge",
    clinicalText: "Un score ≥ 2 indique un risque élevé de mortalité et suggère d'investiguer un sepsis.",
    references: "Références: Singer M, et al. (Sepsis-3).",
    lowRisk: "Faible Risque (< 2)",
    highRisk: "Haut Risque de Sepsis (≥ 2)"
  },
  ar: {
    title: "مقياس qSOFA",
    subtitle: "التقييم السريع لفشل الأعضاء المرتبط بالإنتان (Sepsis)",
    rr22: "معدل التنفس ≥ 22/دقيقة",
    mentation: "تغير في الحالة العقلية (GCS < 15)",
    sbp100: "ضغط الدم الانقباضي ≤ 100 مم زئبق",
    result: "نقاط qSOFA",
    formula: "نقطة واحدة لكل معيار إيجابي",
    clinicalTitle: "التدبير السريري",
    clinicalText: "درجة ≥ 2 تشير إلى ارتفاع خطر النتائج السيئة ويجب تقييم المريض لاحتمال وجود إنتان.",
    references: "المراجع: إجماع Sepsis-3.",
    lowRisk: "خطر منخفض (< 2)",
    highRisk: "خطر عالٍ للإنتان (≥ 2)"
  }
};

const criteriaList = [
  { key: 'rr22' },
  { key: 'mentation' },
  { key: 'sbp100' }
] as const;

export default function QsofaScore({ lang }: { lang: LangCode }) {
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

  const category = scoreValue >= 2 
    ? { label: currentText.highRisk, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' }
    : { label: currentText.lowRisk, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };

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
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-red-600 border-red-600 text-white' : 'border-gray-300'}`}>
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
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-red-500/10 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 3</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{currentText.clinicalTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900 mb-2">Mathematical Metric</h3>
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
              <h3 className="font-semibold text-gray-900 mb-2">Evidence & Lit</h3>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
