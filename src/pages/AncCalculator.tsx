import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Absolute Neutrophil Count (ANC)",
    subtitle: "Determines neutropenia risk during chemotherapy or illness",
    wbc: "WBC Count (cells/µL)",
    neutro: "Segmented Neutrophils (%)",
    bands: "Bands (%)",
    result: "Absolute Neutrophil Count",
    formula: "ANC = WBC × (Segs% + Bands%) / 100",
    clinicalTitle: "Neutropenia Risk",
    clinicalText: "Normal ANC is 1500–8000 cells/µL. < 1500 is Neutropenia. < 500 is Severe Neutropenia (high risk for infection).",
    references: "Standard clinical formula.",
    normal: "Normal (≥ 1500)",
    mild: "Mild (1000 - 1499)",
    moderate: "Moderate (500 - 999)",
    severe: "Severe Neutropenia (< 500)"
  },
  fr: {
    title: "Polynucléaires Neutrophiles Absolus (PNN)",
    subtitle: "Détermine le risque de neutropénie",
    wbc: "Leucocytes (GB) (cellules/mm³)",
    neutro: "Neutrophiles Segmentés (%)",
    bands: "Non segmentés / Immatures (%)",
    result: "PNN Absolus",
    formula: "PNN = GB × (Neutro% + Immatures%) / 100",
    clinicalTitle: "Risque de Neutropénie",
    clinicalText: "Une valeur normale est de 1500–8000/mm³. < 1500: Neutropénie. < 500: Neutropénie Sévère (risque infectieux élevé).",
    references: "Formule clinique standard.",
    normal: "Normal (≥ 1500)",
    mild: "Léger (1000 - 1499)",
    moderate: "Modéré (500 - 999)",
    severe: "Sévère (< 500)"
  },
  ar: {
    title: "العدد المطلق للعدلات (ANC)",
    subtitle: "تحديد خطر قلة العدلات أثناء العلاج الكيميائي أو المرض",
    wbc: "عدد كريات الدم البيضاء (خلية/ميكرولتر)",
    neutro: "العدلات المجزأة (%)",
    bands: "الخلايا الشريطية / غير الناضجة (%)",
    result: "العدد المطلق للعدلات",
    formula: "ANC = (كريات الدم × (العدلات% + الشريطية%)) / 100",
    clinicalTitle: "خطر قلة العدلات",
    clinicalText: "العدد الطبيعي هو 1500-8000. < 1500 يعتبر قلة عدلات. < 500 يعتبر قلة عدلات حادة (خطر عالٍ للعدوى).",
    references: "معادلة سريرية قياسية.",
    normal: "طبيعي (≥ 1500)",
    mild: "خفيف (1000 - 1499)",
    moderate: "معتدل (500 - 999)",
    severe: "شديد (< 500)"
  }
};

export default function AncCalculator({ lang }: { lang: LangCode }) {
  const [wbc, setWbc] = useState<number | ''>(5000);
  const [neutro, setNeutro] = useState<number | ''>(60);
  const [bands, setBands] = useState<number | ''>(2);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const ancValue = useMemo(() => {
    if (wbc === '' || neutro === '' || bands === '') return null;
    return Math.round(Number(wbc) * (Number(neutro) + Number(bands)) / 100);
  }, [wbc, neutro, bands]);

  useEffect(() => {
    if (ancValue !== null && ancValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('anc-calculator', lang, ancValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ancValue, lang]);

  const getCategory = (val: number) => {
    if (val >= 1500) return { label: currentText.normal, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val >= 1000) return { label: currentText.mild, color: 'text-yellow-600', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    if (val >= 500) return { label: currentText.moderate, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' };
    return { label: currentText.severe, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = ancValue !== null ? getCategory(ancValue) : null;

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
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6">
            
            <div className="space-y-4">
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.wbc}</label>
                <input
                  type="number"
                  value={wbc}
                  onChange={(e) => setWbc(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.neutro}</label>
                  <input
                    type="number"
                    value={neutro}
                    onChange={(e) => setNeutro(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
                  />
                </div>
                
                <div className="group">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.bands}</label>
                  <input
                    type="number"
                    value={bands}
                    onChange={(e) => setBands(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl font-semibold text-gray-900"
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
              
              <div className="flex items-baseline gap-2 tabular-nums mb-6">
                <span className="text-6xl font-bold tracking-tighter transition-all duration-300">
                  {ancValue !== null ? ancValue : '--'}
                </span>
                <span className="text-lg font-medium text-gray-400 opacity-60">/µL</span>
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
                    { label: currentText.wbc, value: `${wbc} cells/µL` },
                    { label: currentText.neutro, value: `${neutro} %` },
                    { label: currentText.bands, value: `${bands} %` }
                  ]}
                  results={[
                    { label: currentText.result, value: ancValue !== null ? ancValue : 0, unit: 'cells/µL' },
                    { label: 'Neutropenia Severity', value: category.label }
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
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
