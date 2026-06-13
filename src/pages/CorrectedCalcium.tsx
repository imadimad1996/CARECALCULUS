import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';

const translations: Translations = {
  en: {
    title: "Corrected Calcium",
    subtitle: "Corrects total calcium for hypoalbuminemia",
    calcium: "Measured Total Calcium (mg/dL)",
    albumin: "Serum Albumin (g/dL)",
    result: "Corrected Calcium",
    formula: "Corrected Ca = Measured Ca + 0.8 × (4 - Albumin)",
    clinicalTitle: "Clinical Application",
    clinicalText: "Patients with low albumin may have falsely low total calcium. This formula estimates what the calcium would be if albumin were normal.",
    references: "References: Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins.",
    normal: "Normal (8.8 - 10.4)",
    low: "Hypocalcemia (< 8.8)",
    high: "Hypercalcemia (> 10.4)"
  },
  fr: {
    title: "Calcium Corrigé",
    subtitle: "Corrige la calcémie totale en fonction de l'hypoalbuminémie",
    calcium: "Calcium Total Mesuré (mg/dL)",
    albumin: "Albumine Sérique (g/dL)",
    result: "Calcium Corrigé",
    formula: "Ca Corrigé = Ca mesuré + 0.8 × (4 - Albumine)",
    clinicalTitle: "Application Clinique",
    clinicalText: "Les patients ayant une faible albuminémie peuvent avoir une calcémie totale faussement basse. Cette formule estime la calcémie si l'albumine était normale.",
    references: "Références: Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins.",
    normal: "Normal (8.8 - 10.4)",
    low: "Hypocalcémie (< 8.8)",
    high: "Hypercalcémie (> 10.4)"
  },
  ar: {
    title: "الكالسيوم المصحح",
    subtitle: "تصحيح الكالسيوم الكلي بناءً على نقص ألبومين الدم",
    calcium: "الكالسيوم الكلي المقاس (mg/dL)",
    albumin: "ألبومين المصل (g/dL)",
    result: "الكالسيوم المصحح",
    formula: "الكالسيوم المصحح = الكالسيوم المقاس + 0.8 × (4 - الألبومين)",
    clinicalTitle: "التطبيق السريري",
    clinicalText: "المرضى الذين يعانون من انخفاض الألبومين قد يكون الكالسيوم لديهم منخفضًا بشكل خاطئ. تقدر هذه المعادلة الكالسيوم في حال كان الألبومين طبيعياً.",
    references: "المراجع: Payne RB, et al.",
    normal: "طبيعي (8.8 - 10.4)",
    low: "نقص الكالسيوم (< 8.8)",
    high: "فرط الكالسيوم (> 10.4)"
  }
};

export default function CorrectedCalcium({ lang }: { lang: LangCode }) {
  const [calcium, setCalcium] = useState<number>(8.0);
  const [albumin, setAlbumin] = useState<number>(2.5);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const correctedCa = useMemo(() => {
    if (calcium <= 0 || albumin <= 0) return 0;
    const computed = calcium + 0.8 * (4.0 - albumin);
    return parseFloat(computed.toFixed(1));
  }, [calcium, albumin]);

  const getCategory = (val: number) => {
    if (val === 0) return { label: '', color: '' };
    if (val < 8.8) return { label: currentText.low, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (val > 10.4) return { label: currentText.high, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
    return { label: currentText.normal, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(correctedCa);

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
            <div className="space-y-8">
              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.calcium}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={calcium === 0 ? '' : calcium}
                    onChange={(e) => setCalcium(Number(e.target.value))}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.albumin}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.1"
                    value={albumin === 0 ? '' : albumin}
                    onChange={(e) => setAlbumin(Number(e.target.value))}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>
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
                  {correctedCa > 0 ? correctedCa : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">mg/dL</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
                {correctedCa > 0 && (
                  <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                    <div className="font-semibold text-sm">
                      {category.label}
                    </div>
                  </div>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
