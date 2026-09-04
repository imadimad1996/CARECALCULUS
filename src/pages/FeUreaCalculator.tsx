import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Droplet } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Fractional Excretion of Urea (FEUrea)",
    subtitle: "Differentiates prerenal azotemia from acute tubular necrosis (ATN), especially in patients receiving diuretics",
    serumCr: "Serum Creatinine",
    urineCr: "Urine Creatinine",
    serumUrea: "Serum BUN / Blood Urea",
    urineUrea: "Urine Urea",
    unit: "Unit System",
    usUnits: "Standard US (mg/dL)",
    siUnits: "SI Units (µmol/L & mmol/L)",
    result: "Fractional Excretion of Urea",
    clinicalMeaning: "Diagnostic Interpretation",
    formula: "FEUrea (%) = [(Urine Urea × Serum Creatinine) / (Serum Urea × Urine Creatinine)] × 100",
    references: "Carvounis CP, Nisar S, Guro-Razuman S. Significance of the fractional excretion of urea in the differential diagnosis of acute renal failure. Kidney Int. 2002;62(6):2223-2229. (PMID: 12427149).",
    faqs: [
      { question: "Why use FEUrea instead of FENa?", answer: "Fractional excretion of sodium (FENa) is often falsely elevated (> 1%) in patients taking loop or thiazide diuretics due to drug-induced natriuresis. FEUrea is unaffected by diuretics because urea reabsorption occurs predominantly in the proximal tubule." },
      { question: "What does FEUrea < 35% signify?", answer: "An FEUrea < 35% strongly indicates prerenal acute kidney injury (prerenal azotemia, renal hypoperfusion, volume depletion, hepatorenal syndrome, or heart failure)." },
      { question: "What does FEUrea > 50% indicate?", answer: "An FEUrea > 50% (or > 35%) indicates intrinsic renal damage, most commonly Acute Tubular Necrosis (ATN), with failure of tubular reabsorption." }
    ],
    prerenal: "FEUrea < 35%: Prerenal Azotemia",
    prerenalDesc: "Consistent with intact tubular reabsorption and renal hypoperfusion (prerenal etiology). Diuretics do not alter this diagnostic utility. Fluid resuscitation or optimization of hemodynamics indicated if clinically appropriate.",
    intermediate: "FEUrea 35% – 50%: Intermediate / Indeterminate",
    intermediateDesc: "Gray zone. May represent mixed etiology, evolving acute tubular necrosis, or severe prerenal disease. Correlate with urinalysis, fractional excretion of sodium (if not on diuretics), and clinical context.",
    intrinsic: "FEUrea > 50%: Intrinsic Renal Injury (ATN)",
    intrinsicDesc: "Consistent with impaired tubular function and acute tubular necrosis (ATN). Discontinue nephrotoxins, adjust drug dosages for GFR, and avoid over-resuscitation."
  },
  fr: {
    title: "Fraction d'Excrétion de l'Urée (FEUrea)",
    subtitle: "Différencie l'insuffisance rénale fonctionnelle (prérénale) de la nécrose tubulaire aiguë (NTA), en particulier sous diurétiques",
    serumCr: "Créatinine Plasmatique",
    urineCr: "Créatinine Urinaire",
    serumUrea: "Urée Plasmatique",
    urineUrea: "Urée Urinaire",
    unit: "Système d'unités",
    usUnits: "Unités US (mg/dL)",
    siUnits: "Unités SI (µmol/L et mmol/L)",
    result: "Fraction d'Excrétion de l'Urée",
    clinicalMeaning: "Interprétation Diagnostique",
    formula: "FEUrée (%) = [(Urée Urinaire × Créat Sérique) / (Urée Sérique × Créat Urinaire)] × 100",
    references: "Carvounis CP, et al. Kidney Int. 2002;62(6):2223-2229. (PMID: 12427149).",
    faqs: [
      { question: "Pourquoi préférer la FEUrée à la FENa ?", answer: "La fraction d'excrétion du sodium (FENa) est faussée par les diurétiques de l'anse qui forcent la natriurèse. La FEUrée n'est pas modifiée par les diurétiques car la réabsorption de l'urée se fait au niveau du tubule proximal." },
      { question: "Que signifie une FEUrée < 35 % ?", answer: "Une valeur < 35 % confirme une insuffisance rénale aiguë fonctionnelle (prérénale, hypovolémie, bas débit cardiaque)." },
      { question: "Que signifie une FEUrée > 50 % ?", answer: "Une valeur > 50 % témoigne d'une nécrose tubulaire aiguë (NTA, insuffisance rénale organique parenchymateuse)." }
    ],
    prerenal: "FEUrée < 35 % : IRA Fonctionnelle (Prérénale)",
    prerenalDesc: "Conservation du pouvoir de réabsorption tubulaire. Étiologie hémodynamique / hypoperfusion rénale. Non influencée par les diurétiques de l'anse.",
    intermediate: "FEUrée 35 – 50 % : Zone Grise / Intermédiaire",
    intermediateDesc: "Résultat indéterminé. Peut correspondre à une atteinte mixte ou une NTA débutante. À confronter au sédiment urinaire et au contexte.",
    intrinsic: "FEUrée > 50 % : Nécrose Tubulaire Aiguë (Organique)",
    intrinsicDesc: "Altération de la fonction tubulaire rénale (NTA). Éviter la surcharge hydrosodée et suspendre les agents néphrotoxiques."
  }
};

export default function FeUreaCalculator({ lang }: { lang: LangCode }) {
  const [unitMode, setUnitMode] = useState<'us' | 'si'>('us');
  const [serumCr, setSerumCr] = useState<number | ''>(2.4);
  const [urineCr, setUrineCr] = useState<number | ''>(60);
  const [serumUrea, setSerumUrea] = useState<number | ''>(45);
  const [urineUrea, setUrineUrea] = useState<number | ''>(450);

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (serumCr === '' || urineCr === '' || serumUrea === '' || urineUrea === '') return null;
    const sCr = Number(serumCr);
    const uCr = Number(urineCr);
    const sU = Number(serumUrea);
    const uU = Number(urineUrea);

    if (uCr <= 0 || sU <= 0) return null;

    // Both ureas and both creatinines must have matching unit scale
    // If US: mg/dL
    // If SI: sCr in µmol/L, uCr in mmol/L -> uCr * 1000 µmol/L
    // sU in mmol/L, uU in mmol/L -> identical
    let sCrStandard = sCr;
    let uCrStandard = uCr;
    let sUStandard = sU;
    let uUStandard = uU;

    if (unitMode === 'si') {
      uCrStandard = uCr * 1000; // convert mmol/L to µmol/L to match sCr in µmol/L
    }

    const feUrea = ((uUStandard * sCrStandard) / (sUStandard * uCrStandard)) * 100;
    return Math.max(0, feUrea);
  }, [serumCr, urineCr, serumUrea, urineUrea, unitMode]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('feurea-calculator', lang, result);
    }
  }, [result, lang]);

  const category = useMemo(() => {
    if (result === null) return null;
    if (result < 35) return 'prerenal';
    if (result <= 50) return 'intermediate';
    return 'intrinsic';
  }, [result]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/feurea-calculator"
        scoringSystem="Fractional Excretion of Urea"
        howToSteps={[
          lang === 'fr' ? 'Sélectionner le mode d\'unités (mg/dL ou µmol/L - mmol/L).' : 'Select unit system (mg/dL or SI units).',
          lang === 'fr' ? 'Renseigner la créatinine et l\'urée sanguines et urinaires synchrones.' : 'Input simultaneous plasma and urine creatinine and urea/BUN.',
          lang === 'fr' ? 'FEUrée < 35% confirme l\'insuffisance prérénale même sous diurétiques.' : 'FEUrea < 35% identifies prerenal azotemia even with concurrent diuretic use.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Droplet className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Néphrologie & Soins Intensifs' : 'Nephrology & Critical Care'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{currentText.unit}</span>
              <div className="flex text-xs bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => {
                    setUnitMode('us');
                    setSerumCr(2.4);
                    setUrineCr(60);
                    setSerumUrea(45);
                    setUrineUrea(450);
                  }}
                  className={`px-3 py-1 rounded font-semibold ${unitMode === 'us' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                >
                  {currentText.usUnits}
                </button>
                <button
                  onClick={() => {
                    setUnitMode('si');
                    setSerumCr(212);
                    setUrineCr(5.3);
                    setSerumUrea(16.1);
                    setUrineUrea(160);
                  }}
                  className={`px-3 py-1 rounded font-semibold ${unitMode === 'si' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                >
                  {currentText.siUnits}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.serumCr} ({unitMode === 'us' ? 'mg/dL' : 'µmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={serumCr}
                  onChange={(e) => setSerumCr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.urineCr} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={urineCr}
                  onChange={(e) => setUrineCr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.serumUrea} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={serumUrea}
                  onChange={(e) => setSerumUrea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.urineUrea} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={urineUrea}
                  onChange={(e) => setUrineUrea(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  category === 'prerenal' ? 'text-emerald-400' : category === 'intermediate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result !== null ? result.toFixed(1) : '--'}
                </span>
                <span className="text-2xl text-gray-400 font-medium">%</span>
              </div>

              {category && (
                <div className={`p-4 rounded-xl border ${
                  category === 'prerenal' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : category === 'intermediate'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {category === 'prerenal' ? currentText.prerenal : category === 'intermediate' ? currentText.intermediate : currentText.intrinsic}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {category === 'prerenal' ? currentText.prerenalDesc : category === 'intermediate' ? currentText.intermediateDesc : currentText.intrinsicDesc}
                  </p>
                </div>
              )}

              {result !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Serum Cr", value: `${serumCr} ${unitMode === 'us' ? 'mg/dL' : 'µmol/L'}` },
                    { label: "Urine Cr", value: `${urineCr} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` },
                    { label: "Serum Urea/BUN", value: `${serumUrea} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` },
                    { label: "Urine Urea", value: `${urineUrea} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` }
                  ]}
                  results={[
                    { label: "FEUrea", value: `${result.toFixed(1)}%` },
                    { label: "Etiology", value: category === 'prerenal' ? "Prerenal Azotemia (<35%)" : category === 'intermediate' ? "Indeterminate (35-50%)" : "Intrinsic ATN (>50%)" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="FEUrea is indicated when FENa is invalidated by concurrent loop/thiazide diuretic use."
                  references="Carvounis CP, et al. Kidney Int. 2002;62(6):2223-2229."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/12427149/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Carvounis CP et al. (2002) Kidney International <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
