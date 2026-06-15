import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "MELD Score",
    subtitle: "Model for End-Stage Liver Disease (MELD-Na)",
    bilirubin: "Bilirubin (mg/dL)",
    inr: "INR",
    creatinine: "Creatinine (mg/dL)",
    sodium: "Sodium (mEq/L)",
    dialysis: "Dialysis at least twice in last week",
    result: "MELD-Na Score",
    formula: "MELD Score predicting 3-month mortality",
    clinicalTitle: "Interpretation",
    clinicalText: "MELD usually ranges from 6 to 40. Higher values indicate higher 3-month mortality and prioritize liver transplantation waitlists.",
    references: "References: Kamath PS, et al. A model to predict survival in patients with end-stage liver disease. Biggins SW, et al. Evidence-based incorporation of serum sodium concentration into MELD.",
    yes: "Yes",
    no: "No",
  },
  fr: {
    title: "Score MELD",
    subtitle: "Évaluation de l'insuffisance hépatique terminale (MELD-Na)",
    bilirubin: "Bilirubine (mg/dL)",
    inr: "INR",
    creatinine: "Créatinine (mg/dL)",
    sodium: "Sodium (mEq/L)",
    dialysis: "Dialyse au moins 2 fois la semaine passée",
    result: "Score MELD-Na",
    formula: "Score MELD prédisant la mortalité à 3 mois",
    clinicalTitle: "Interprétation",
    clinicalText: "Le MELD varie généralement de 6 à 40. Des valeurs plus élevées indiquent une mortalité à 3 mois plus sévère (priorité greffe).",
    references: "Références: Kamath PS, et al. Biggins SW, et al.",
    yes: "Oui",
    no: "Non"
  },
  ar: {
    title: "مقياس MELD",
    subtitle: "نموذج لمرض الكبد في المرحلة النهائية (MELD-Na)",
    bilirubin: "البيليروبين (mg/dL)",
    inr: "النسبة المعيارية الدولية (INR)",
    creatinine: "الكرياتينين (mg/dL)",
    sodium: "الصوديوم (mEq/L)",
    dialysis: "غسيل كلى مرتين على الأقل في الأسبوع الماضي",
    result: "نقاط MELD-Na",
    formula: "مقياس MELD لتوقع الوفاة خلال 3 أشهر",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يتراوح MELD عادة بين 6 و 40. القيم الأعلى تشير لزيادة الوفيات وتمنح أولوية لزراعة الكبد.",
    references: "المراجع: Kamath PS, et al.",
    yes: "نعم",
    no: "لا"
  }
};

export default function MeldScore({ lang }: { lang: LangCode }) {
  const [bilirubin, setBilirubin] = useState<number | ''>(1.2);
  const [inr, setInr] = useState<number | ''>(1.1);
  const [creatinine, setCreatinine] = useState<number | ''>(1.0);
  const [sodium, setSodium] = useState<number | ''>(137);
  const [dialysis, setDialysis] = useState<boolean>(false);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const meldScore = useMemo(() => {
    if (bilirubin === '' || inr === '' || creatinine === '' || sodium === '') return null;
    
    // Bounds
    let b = Math.max(1, bilirubin);
    let c = Math.max(1, creatinine);
    let i = Math.max(1, inr);
    
    if (dialysis) {
      c = 4.0;
    } else {
      c = Math.min(4.0, c);
    }
    
    // Original MELD
    let meld = 0.957 * Math.log(c) + 0.378 * Math.log(b) + 1.120 * Math.log(i) + 0.643;
    meld = Math.round(meld * 10);
    
    if (meld > 40) meld = 40;
    
    // MELD-Na
    if (meld > 11) {
      let na = Math.max(125, Math.min(137, sodium));
      meld = meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na));
    }
    
    return Math.round(meld);
  }, [bilirubin, inr, creatinine, sodium, dialysis]);

  useEffect(() => {
    if (meldScore !== null && meldScore > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('meld-score', lang, meldScore);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [meldScore, lang]);

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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.bilirubin}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={bilirubin}
                    onChange={(e) => setBilirubin(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all font-mono"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.inr}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={inr}
                    onChange={(e) => setInr(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all font-mono"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.creatinine}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all font-mono"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.sodium}</label>
                  <input
                    type="number"
                    step="1"
                    value={sodium}
                    onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider block mb-3">{currentText.dialysis}</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDialysis(false)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${!dialysis ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {currentText.no}
                  </button>
                  <button
                    onClick={() => setDialysis(true)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${dialysis ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {currentText.yes}
                  </button>
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
                  {meldScore !== null ? meldScore : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">Points</span>
              </div>
            </div>
            
            {meldScore !== null && (
              <div className="relative z-10 mt-10">
                <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${
                  meldScore >= 20 ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  meldScore >= 10 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  <div className="font-semibold text-sm">
                    {meldScore >= 40 ? '71.3% 3-month mortality' : 
                     meldScore >= 30 ? '52.6% 3-month mortality' :
                     meldScore >= 20 ? '19.6% 3-month mortality' :
                     meldScore >= 10 ? '6.0% 3-month mortality' : '1.9% 3-month mortality'}
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.bilirubin, value: `${bilirubin} mg/dL` },
                    { label: currentText.inr, value: `${inr}` },
                    { label: currentText.creatinine, value: `${creatinine} mg/dL` },
                    { label: currentText.sodium, value: `${sodium} mEq/L` },
                    { label: currentText.dialysis, value: dialysis ? currentText.yes : currentText.no }
                  ]}
                  results={[
                    { label: currentText.result, value: meldScore, unit: 'Points' },
                    { label: 'Estimated 3-Month Mortality', value: meldScore >= 40 ? '71.3%' : meldScore >= 30 ? '52.6%' : meldScore >= 20 ? '19.6%' : meldScore >= 10 ? '6.0%' : '1.9%' }
                  ]}
                  formula="MELD(Na) = MELD + 1.32 * (137 - Na) - (0.033 * MELD * (137 - Na))"
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
