import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
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
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">Reviewed by the CareCalculus Clinical Team</span>
          <span>&middot;</span>
          <span>MD, ICU &amp; Emergency Medicine specialists</span>
          <span>&middot;</span>
          <span>Updated 2026</span>
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
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Mathematical Metric</h2>
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
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Evidence & Lit</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
              <a href="https://pubmed.ncbi.nlm.nih.gov/26973543/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Singer et al., JAMA 2016 — Sepsis-3 Definitions (PMID: 26973543) →</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">See Also</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'CURB-65 Score', path: '/curb65-score' },
            { label: 'MAP Calculator', path: '/map-calculator' },
            { label: 'Glasgow Coma Scale', path: '/glasgow-coma-scale' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'What is the qSOFA score?', a: 'The quick SOFA (qSOFA) is a bedside clinical tool for rapid identification of patients likely to have poor outcomes due to infection-related organ dysfunction (sepsis). It scores three criteria: Respiratory Rate ≥22/min, Altered Mentation (GCS <15), and Systolic BP ≤100 mmHg.' },
            { q: 'What qSOFA score is considered high risk?', a: 'A qSOFA score of ≥2 out of 3 indicates high risk of poor outcome and should prompt clinicians to investigate for sepsis, initiate monitoring, and consider ICU-level care, per the Sepsis-3 consensus (Singer et al., JAMA 2016).' },
            { q: 'What is the difference between qSOFA and SOFA?', a: 'qSOFA is a 3-item bedside screening tool usable without lab tests. Full SOFA requires lab values (PaO2, bilirubin, creatinine, platelets) and is used for formal organ failure quantification in the ICU.' },
            { q: 'Should qSOFA replace SIRS criteria for sepsis screening?', a: 'The Sepsis-3 consensus replaced SIRS with qSOFA for out-of-ICU sepsis screening, arguing SIRS lacked specificity. Both tools remain in use across different guidelines and settings.' },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
