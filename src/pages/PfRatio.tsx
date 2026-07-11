import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "P/F Ratio (ARDS)",
    subtitle: "PaO2/FiO2 ratio for evaluating acute respiratory distress syndrome",
    pao2: "PaO2 (mmHg)",
    fio2: "FiO2 (%)",
    result: "P/F Ratio",
    formula: "P/F = PaO2 / (FiO2 as decimal)",
    clinicalTitle: "ARDS Classification (Berlin Definition)",
    clinicalText: "Mild ARDS: 200 - 300. Moderate ARDS: 100 - 200. Severe ARDS: < 100. (Assuming PEEP/CPAP ≥ 5 cmH2O)",
    references: "References: ARDS Definition Task Force. Acute respiratory distress syndrome: the Berlin Definition.",
    normal: "Normal (≥ 300)",
    mild: "Mild ARDS (200 - 300)",
    moderate: "Moderate ARDS (100 - 200)",
    severe: "Severe ARDS (< 100)",
  },
  fr: {
    title: "Rapport P/F (SDRA)",
    subtitle: "Rapport PaO2/FiO2 pour évaluer le SDRA (Berlin)",
    pao2: "PaO2 (mmHg)",
    fio2: "FiO2 (%)",
    result: "Rapport P/F",
    formula: "P/F = PaO2 / (FiO2 en décimal)",
    clinicalTitle: "Classification du SDRA",
    clinicalText: "SDRA Léger: 200 - 300. Modéré: 100 - 200. Sévère: < 100. (Si PEEP/CPAP ≥ 5 cmH2O)",
    references: "Références: ARDS Definition Task Force.",
    normal: "Normal (≥ 300)",
    mild: "SDRA Léger (200 - 300)",
    moderate: "SDRA Modéré (100 - 200)",
    severe: "SDRA Sévère (< 100)",
  }
};

export default function PfRatio({ lang }: { lang: LangCode }) {
  const [pao2, setPao2] = useState<number | ''>(90);
  const [fio2, setFio2] = useState<number | ''>(21);

  const currentText = translations[lang];
  const isRtl = false;

  const pfRatio = useMemo(() => {
    if (pao2 === '' || fio2 === '' || fio2 <= 0) return null;
    const decimalFio2 = fio2 > 1.0 ? fio2 / 100 : fio2;
    return Math.round(pao2 / decimalFio2);
  }, [pao2, fio2]);

  useEffect(() => {
    if (pfRatio !== null && pfRatio > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('oxygenation-ratio', lang, pfRatio);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pfRatio, lang]);

  const getCategory = (val: number) => {
    if (val >= 300) return { label: currentText.normal, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val > 200) return { label: currentText.mild, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (val > 100) return { label: currentText.moderate, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' };
    return { label: currentText.severe, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = pfRatio !== null ? getCategory(pfRatio) : null;

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
            <div className="space-y-6">
              
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.pao2}</label>
                <input
                  type="number"
                  value={pao2}
                  onChange={(e) => setPao2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                />
              </div>
              
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.fio2}</label>
                <input
                  type="number"
                  value={fio2}
                  min="21"
                  max="100"
                  onChange={(e) => setFio2(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                />
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
                  {pfRatio !== null ? pfRatio : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">mmHg</span>
              </div>
            </div>

            {category && (
              <div className="relative z-10 mt-10">
                <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                  <div className="font-semibold text-sm">
                    {category.label}
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.pao2, value: `${pao2} mmHg` },
                    { label: currentText.fio2, value: `${fio2} %` }
                  ]}
                  results={[
                    { label: currentText.result, value: pfRatio !== null ? pfRatio : 0, unit: 'mmHg' },
                    { label: 'ARDS Severity Stage', value: category.label }
                  ]}
                  formula={currentText.formula}
                  disclaimer={currentText.clinicalText}
                  references={currentText.references}
                  lang={lang}
                />
              </div>
            )}
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
