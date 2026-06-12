import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';

const translations: Translations = {
  en: {
    title: "CURB-65 Score",
    subtitle: "Pneumonia severity assessment",
    confusion: "Confusion (New disorientation)",
    urea: "BUN > 19 mg/dL (> 7 mmol/L Urea)",
    rr30: "Respiratory rate ≥ 30/min",
    bp: "Blood pressure: Systolic < 90 OR Diastolic ≤ 60 mmHg",
    age65: "Age ≥ 65 years",
    result: "Calculated Score",
    formula: "1 point per positive criterion",
    clinicalTitle: "Management Strategy",
    clinicalText: "Score 0-1: Low risk (Outpatient care). Score 2: Moderate risk (Consider short hospitalization). Score 3-5: Severe (Hospitalize, possibly ICU).",
    references: "References: Lim WS, et al. Defining community acquired pneumonia severity.",
    low: "Low Risk (0-1)",
    inter: "Intermediate Risk (2)",
    high: "High Risk (3-5)"
  },
  fr: {
    title: "Score CURB-65",
    subtitle: "Évaluation de la sévérité de la pneumonie",
    confusion: "Confusion (Nouvelle désorientation)",
    urea: "Urée > 7 mmol/L (BUN > 19 mg/dL)",
    rr30: "Fréquence respiratoire ≥ 30/min",
    bp: "Pression artérielle: Sys < 90 OU Dia ≤ 60 mmHg",
    age65: "Âge ≥ 65 ans",
    result: "Score Calculé",
    formula: "1 point par critère",
    clinicalTitle: "Stratégie de Prise en charge",
    clinicalText: "Score 0-1: Risque faible (Ambulatoire). Score 2: Modéré (Hospitalisation courte). Score 3-5: Sévère (Hospitaliser, potentiellement en réa).",
    references: "Références: Lim WS, et al. Defining community acquired pneumonia severity.",
    low: "Risque Faible (0-1)",
    inter: "Risque Intermédiaire (2)",
    high: "Risque Élevé (3-5)"
  },
  ar: {
    title: "مقياس CURB-65",
    subtitle: "تقييم شدة الالتهاب الرئوي المكتسب من المجتمع",
    confusion: "تخليط ذهني (ارتباك جديد)",
    urea: "اليوريا > 7 mmol/L (أو BUN > 19 mg/dL)",
    rr30: "معدل التنفس ≥ 30/دقيقة",
    bp: "ضغط الدم: الانقباضي < 90 أو الانبساطي ≤ 60 مم زئبق",
    age65: "العمر ≥ 65 سنة",
    result: "النتيجة المحسوبة",
    formula: "نقطة واحدة لكل معيار إيجابي",
    clinicalTitle: "استراتيجية الإدارة",
    clinicalText: "0-1: خطر منخفض (علاج بالمنزل). 2: خطر متوسط (فكر في التنويم). 3-5: خطر عالٍ (تنويم، ربما عناية مركزة).",
    references: "المراجع: Lim WS, et al.",
    low: "خطر منخفض (0-1)",
    inter: "خطر متوسط (2)",
    high: "خطر عالٍ (3-5)"
  }
};

const criteriaList = [
  { key: 'confusion' },
  { key: 'urea' },
  { key: 'rr30' },
  { key: 'bp' },
  { key: 'age65' }
] as const;

export default function Curb65Score({ lang }: { lang: LangCode }) {
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

  const getCategory = (val: number) => {
    if (val <= 1) return { label: currentText.low, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val === 2) return { label: currentText.inter, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.high, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getCategory(scoreValue);

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
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
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
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 5</span>
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
