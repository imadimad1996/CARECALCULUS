import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Creatinine Clearance (Cockcroft-Gault)",
    subtitle: "Estimate glomerular filtration rate and adjust drug dosages",
    age: "Age (Years)",
    weight: "Weight (kg)",
    creatinine: "Serum Creatinine",
    creatinineMg: "mg/dL",
    gender: "Gender",
    male: "Male",
    female: "Female",
    result: "Estimated CrCl",
    formula: "CrCl = [(140 - age) × weight(kg)] / (72 × SCr(mg/dL)) [× 0.85 if female]",
    clinicalTitle: "Clinical Application",
    clinicalText: "The Cockcroft-Gault formula remains the standard for numerous pharmacokinetic drug dosing adjustments, notably antibiotics and anticoagulants.",
    references: "References: Cockcroft DW, Gault MH. Prediction of clearance from serum creatinine. Nephron.",
    normal: "Normal Renal Function",
    mild: "Mild Impairment",
    moderate: "Moderate Impairment",
    severe: "Severe Impairment (Renal Failure)",
  },
  fr: {
    title: "Clairance de la Créatinine (Cockcroft-Gault)",
    subtitle: "Estimer le débit de filtration glomérulaire pour ajuster les posologies",
    age: "Âge (Années)",
    weight: "Poids (kg)",
    creatinine: "Créatininémie",
    creatinineMg: "mg/dL",
    gender: "Sexe",
    male: "Homme",
    female: "Femme",
    result: "CrCl Estimée",
    formula: "CrCl = [(140 - âge) × poids(kg)] / (72 × SCr(mg/dL)) [× 0.85 si femme]",
    clinicalTitle: "Application Clinique",
    clinicalText: "La formule de Cockcroft-Gault reste le standard pour l'adaptation posologique de nombreux médicaments (antibiotiques, anticoagulants).",
    references: "Références : Cockcroft DW, Gault MH. Prediction of clearance from serum creatinine. Nephron.",
    normal: "Fonction Rénale Normale",
    mild: "Insuffisance Légère",
    moderate: "Insuffisance Modérée",
    severe: "Insuffisance Sévère",
  }
};

export default function CreatinineClearance({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(65);
  const [weight, setWeight] = useState<number>(70);
  const [creatinine, setCreatinine] = useState<number>(1.2);
  const [isFemale, setIsFemale] = useState<boolean>(false);

  const currentText = translations[lang];
  const isRtl = false;

  const crclValue = useMemo(() => {
    if (age <= 0 || weight <= 0 || creatinine <= 0) return 0;
    let computed = ((140 - age) * weight) / (72 * creatinine);
    if (isFemale) computed = computed * 0.85;
    return parseFloat(computed.toFixed(1));
  }, [age, weight, creatinine, isFemale]);

  useEffect(() => {
    if (crclValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('creatinine-clearance', lang, crclValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [crclValue, lang]);

  const getStage = (val: number) => {
    if (val === 0) return { label: '', color: '' };
    if (val >= 90) return { label: currentText.normal, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
    if (val >= 60) return { label: currentText.mild, bg: 'bg-blue-500/10 border-blue-500/20', color: 'text-blue-500' };
    if (val >= 30) return { label: currentText.moderate, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-500' };
    return { label: currentText.severe, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' };
  };

  const stage = getStage(crclValue);

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
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-3">{currentText.gender}</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsFemale(false)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${!isFemale ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                  >
                    {currentText.male}
                  </button>
                  <button
                    onClick={() => setIsFemale(true)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${isFemale ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                  >
                    {currentText.female}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.age}</label>
                  </div>
                  <input
                    type="number"
                    value={age === 0 ? '' : age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-gray-50/50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="1"
                    max="120"
                  />
                </div>

                <div className="group">
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.weight}</label>
                  </div>
                  <input
                    type="number"
                    value={weight === 0 ? '' : weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-gray-50/50 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-2xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="10"
                    max="300"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.creatinine}</label>
                  <span className="text-xs font-medium text-gray-400 tabular-nums">{currentText.creatinineMg}</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={creatinine === 0 ? '' : creatinine}
                  onChange={(e) => setCreatinine(Number(e.target.value))}
                  className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                  min="0.1"
                  max="15"
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
                  {crclValue > 0 ? crclValue : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">mL/min</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              {crclValue > 0 && (
                <>
                  <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${stage.bg} ${stage.color}`}>
                    <div className="font-semibold text-sm">
                      {stage.label}
                    </div>
                  </div>

                  <ClinicalExportButton
                    title={currentText.title}
                    inputs={[
                      { label: currentText.gender, value: isFemale ? currentText.female : currentText.male },
                      { label: currentText.age, value: `${age} years` },
                      { label: currentText.weight, value: `${weight} kg` },
                      { label: currentText.creatinine, value: `${creatinine} mg/dL` }
                    ]}
                    results={[
                      { label: currentText.result, value: crclValue, unit: 'mL/min' },
                      { label: 'Renal Function Stage', value: stage.label }
                    ]}
                    formula={currentText.formula}
                    disclaimer={currentText.clinicalText}
                    references={currentText.references}
                    lang={lang}
                  />
                </>
              )}
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
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
