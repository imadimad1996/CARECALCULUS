import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Serum Osmolality & Osmolar Gap Calculator",
    subtitle: "Screens for toxic alcohol ingestion (methanol, ethylene glycol) and guides hyponatremia evaluation",
    sodium: "Serum Sodium (Na⁺)",
    glucose: "Serum Glucose",
    bun: "Blood Urea Nitrogen (BUN)",
    ethanol: "Serum Ethanol (optional)",
    measuredOsm: "Measured Serum Osmolality (optional)",
    unitSystem: "Unit System",
    usUnits: "Standard US (mg/dL)",
    siUnits: "SI Units (mmol/L)",
    calcOsm: "Calculated Osmolality",
    osmGap: "Calculated Osmolar Gap",
    normalGapDesc: "Normal Osmolar Gap is < 10 mOsm/kg H₂O.",
    highGapDesc: "Osmolar Gap ≥ 10 mOsm/kg suggests presence of unmeasured osmotically active solutes (toxic alcohols: ethylene glycol, methanol, diethylene glycol, propylene glycol).",
    formula: "Calculated Osm = 2 × Na + (Glucose / 18) + (BUN / 2.8) + (Ethanol / 4.6)",
    references: "Purssell RA, Pudek M, Brubacher J, Abu-Laban RB. Derivation and validation of a formula to calculate the contribution of ethanol to the osmolal gap. Ann Emerg Med. 2001;38(6):653-659. (PMID: 11719745).",
    faqs: [
      { question: "What is the normal osmolar gap?", answer: "A normal osmolar gap is typically between -10 and +10 mOsm/kg. An osmolar gap > 10 mOsm/kg strongly suggests the presence of unmeasured low-molecular-weight solutes." },
      { question: "What causes an elevated osmolar gap?", answer: "Ingestion of toxic alcohols (ethylene glycol, methanol, isopropanol, propylene glycol), severe alcoholic ketoacidosis, diabetic ketoacidosis, mannitol administration, and advanced chronic renal failure." },
      { question: "Why include ethanol in the equation?", answer: "Ethanol distributes in total body water and contributes directly to measured osmolality (Ethanol in mg/dL divided by 4.6). Accounting for ethanol isolates true non-ethanol toxic ingestions." }
    ]
  },
  fr: {
    title: "Osmolalité Plasmatique & Trou Osmolaire",
    subtitle: "Dépistage des intoxications aux alcools toxiques (méthanol, éthylène glycol) et bilan d'hyponatrémie",
    sodium: "Sodium Plasmatique (Na⁺)",
    glucose: "Glycémie",
    bun: "Urée Sérique (BUN)",
    ethanol: "Alcoolémie / Éthanol (optionnel)",
    measuredOsm: "Osmolalité Mesurée (optionnel)",
    unitSystem: "Système d'unités",
    usUnits: "Unités US (mg/dL)",
    siUnits: "Unités SI (mmol/L)",
    calcOsm: "Osmolalité Calculée",
    osmGap: "Trou Osmolaire Calculé",
    normalGapDesc: "Le trou osmolaire physiologique est < 10 mOsm/kg H₂O.",
    highGapDesc: "Trou osmolaire ≥ 10 mOsm/kg évocateur d'osmoles toxiques non dosées (éthylène glycol, méthanol, propylène glycol).",
    formula: "Osmolalité = 2 × Na + Glycémie + Urée (en mmol/L)",
    references: "Purssell RA, et al. Ann Emerg Med. 2001;38(6):653-659. (PMID: 11719745).",
    faqs: [
      { question: "Quelle est la valeur normale du trou osmolaire ?", answer: "Un trou osmolaire normal est inférieur à 10 mOsm/kg. Un trou > 10 mOsm/kg traduit l'accumulation de solutés osmotiquement actifs non mesurés." },
      { question: "Quelles sont les causes d'augmentation du trou osmolaire ?", answer: "Intoxication par alcools toxiques (éthylène glycol/antigel, méthanol, solvants), acidocétose alcoolique ou diabétique majeure, perfusion de mannitol." },
      { question: "Quel est l'intérêt de renseigner l'éthanol ?", answer: "L'éthanol augmente fortement l'osmolalité mesurée. Le soustraire permet d'isoler un éventuel toxique additionnel." }
    ]
  }
};

export default function SerumOsmolality({ lang }: { lang: LangCode }) {
  const [unitMode, setUnitMode] = useState<'us' | 'si'>('us');
  const [sodium, setSodium] = useState<number | ''>(140);
  const [glucose, setGlucose] = useState<number | ''>(100);
  const [bun, setBun] = useState<number | ''>(14);
  const [ethanol, setEthanol] = useState<number | ''>('');
  const [measuredOsm, setMeasuredOsm] = useState<number | ''>(290);

  const currentText = translations[lang] || translations.en;

  const results = useMemo(() => {
    if (sodium === '' || glucose === '' || bun === '') return null;
    const na = Number(sodium);
    const glu = Number(glucose);
    const b = Number(bun);
    const eth = ethanol === '' ? 0 : Number(ethanol);

    let calc = 0;
    if (unitMode === 'us') {
      calc = 2 * na + (glu / 18) + (b / 2.8) + (eth / 4.6);
    } else {
      // SI: mmol/L
      calc = 2 * na + glu + b + eth;
    }

    let gap: number | null = null;
    if (measuredOsm !== '') {
      gap = Number(measuredOsm) - calc;
    }

    return { calculated: calc, gap };
  }, [sodium, glucose, bun, ethanol, measuredOsm, unitMode]);

  useEffect(() => {
    if (results?.calculated) {
      trackCalculatorUsage('serum-osmolality', lang, results.calculated);
    }
  }, [results, lang]);

  const isGapElevated = results?.gap !== null && results?.gap !== undefined && results.gap >= 10;

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/serum-osmolality"
        scoringSystem="Serum Osmolality and Osmolar Gap"
        howToSteps={[
          lang === 'fr' ? 'Choisir les unités US (mg/dL) ou SI (mmol/L).' : 'Choose US (mg/dL) or SI (mmol/L) units.',
          lang === 'fr' ? 'Saisir le sodium, glycémie et urée/BUN.' : 'Enter serum sodium, glucose, and urea/BUN.',
          lang === 'fr' ? 'Ajouter l\'osmolalité mesurée au laboratoire pour obtenir le trou osmolaire.' : 'Optionally enter measured osmolality to determine osmolar gap.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
          <Zap className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Toxicologie & Réanimation' : 'Toxicology & Critical Care'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{currentText.unitSystem}</span>
              <div className="flex text-xs bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => {
                    setUnitMode('us');
                    setSodium(140);
                    setGlucose(100);
                    setBun(14);
                  }}
                  className={`px-3 py-1 rounded font-semibold ${unitMode === 'us' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                >
                  {currentText.usUnits}
                </button>
                <button
                  onClick={() => {
                    setUnitMode('si');
                    setSodium(140);
                    setGlucose(5.5);
                    setBun(5.0);
                  }}
                  className={`px-3 py-1 rounded font-semibold ${unitMode === 'si' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                >
                  {currentText.siUnits}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.sodium} (mEq/L)
                </label>
                <input
                  type="number" step="1"
                  value={sodium}
                  onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.glucose} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.bun} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1"
                  value={bun}
                  onChange={(e) => setBun(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.ethanol} ({unitMode === 'us' ? 'mg/dL' : 'mmol/L'})
                </label>
                <input
                  type="number" step="0.1" placeholder="0"
                  value={ethanol}
                  onChange={(e) => setEthanol(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                  {currentText.measuredOsm} (mOsm/kg)
                </label>
                <input
                  type="number" step="1" placeholder="e.g. 295"
                  value={measuredOsm}
                  onChange={(e) => setMeasuredOsm(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-2.5 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                {currentText.calcOsm}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-5xl md:text-6xl font-extrabold tracking-tight text-amber-300">
                  {results ? results.calculated.toFixed(1) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">mOsm/kg</span>
              </div>

              {results && results.gap !== null && (
                <div className={`p-4 rounded-xl border ${isGapElevated ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{currentText.osmGap}</span>
                    <span className="text-lg font-extrabold">{results.gap > 0 ? `+${results.gap.toFixed(1)}` : results.gap.toFixed(1)} mOsm/kg</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {isGapElevated ? currentText.highGapDesc : currentText.normalGapDesc}
                  </p>
                </div>
              )}

              {results && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Sodium", value: `${sodium} mEq/L` },
                    { label: "Glucose", value: `${glucose} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` },
                    { label: "BUN / Urea", value: `${bun} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` },
                    ...(ethanol !== '' ? [{ label: "Ethanol", value: `${ethanol} ${unitMode === 'us' ? 'mg/dL' : 'mmol/L'}` }] : []),
                    ...(measuredOsm !== '' ? [{ label: "Measured Osmolality", value: `${measuredOsm} mOsm/kg` }] : [])
                  ]}
                  results={[
                    { label: "Calculated Osmolality", value: `${results.calculated.toFixed(1)} mOsm/kg` },
                    ...(results.gap !== null ? [
                      { label: "Osmolar Gap", value: `${results.gap.toFixed(1)} mOsm/kg` },
                      { label: "Gap Status", value: isGapElevated ? "Elevated (≥ 10 mOsm/kg) — Suspect Toxic Ingestion" : "Normal (< 10 mOsm/kg)" }
                    ] : [])
                  ]}
                  formula={currentText.formula}
                  disclaimer="Osmolar gap > 10 mOsm/kg warrants immediate investigation for toxic alcohols (ethylene glycol, methanol)."
                  references="Purssell RA, et al. Ann Emerg Med. 2001;38(6):653-659."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-amber-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/11719745/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Purssell RA et al. (2001) Annals of Emergency Medicine <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
