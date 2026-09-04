import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Urine Osmolal Gap & Ammonium Calculator",
    subtitle: "Estimates urinary ammonium (NH4+) excretion to differentiate RTA from GI bicarbonate loss in normal anion gap acidosis",
    unitToggle: "Units",
    usUnits: "US Units (mg/dL)",
    siUnits: "SI Units (mmol/L)",
    measOsmLabel: "Measured Urine Osmolality (mOsm/kg)",
    uNaLabel: "Urine Sodium (U_Na, mEq/L)",
    uKLabel: "Urine Potassium (U_K, mEq/L)",
    uUreaLabel: "Urine Urea Nitrogen (UUN, mg/dL)",
    uUreaSiLabel: "Urine Urea (mmol/L)",
    uGluLabel: "Urine Glucose (mg/dL)",
    uGluSiLabel: "Urine Glucose (mmol/L)",
    resultTitle: "Urine Osmolal Gap & Etiologic Diagnosis",
    gapLabel: "Calculated Urine Osmolal Gap",
    nh4Label: "Estimated Urinary Ammonium (NH4+)",
    points: "mOsm/kg",
    mEq: "mEq/L",
    giTier: "Gap > 100 mOsm/kg (NH4+ > 50 mEq/L) — Intact Renal Acid Excretion (GI Loss)",
    giTierDesc: "Robust urinary ammonium excretion demonstrates appropriate renal response to metabolic acidemia. The kidneys are actively excreting acid. Etiology is non-renal: gastrointestinal bicarbonate loss (profuse diarrhea, enteric fistulas, ureterosigmoidostomy, or laxative abuse).",
    rtaTier: "Gap < 100 mOsm/kg (NH4+ < 40 mEq/L) — Impaired Renal Acid Excretion (RTA)",
    rtaTierDesc: "Inappropriately low urinary ammonium excretion in the setting of metabolic acidosis. Points to an intrinsic defect in renal ammoniagenesis or hydrogen ion secretion. Consistent with distal (Type 1) Renal Tubular Acidosis, hyperkalemic (Type 4) RTA / hypoaldosteronism, or renal parenchymal failure.",
    references: "Kamel KS, Ethier JH, Richardson RM, Bear RA, Halperin ML. Urine electrolytes and osmolality: when and how to use them. Am J Nephrol. 1990;10(2):89-102. (PMID: 2191596). Carlisle EJ, Donnelly SM, Halperin ML. Renal tubular acidosis (RTA): recognize the ammonium defect and pucker up for the diagnosis. Am J Kidney Dis. 1991;17(1):1-13.",
    faqs: [
      {
        question: "Why use the Urine Osmolal Gap instead of the Urine Anion Gap (UAG)?",
        answer: "The classic Urine Anion Gap [Na + K - Cl] fails when urine contains unmeasured organic anions (such as ketoacids, hippurate, or high-dose penicillin/carbenicillin), which artificially drives the UAG positive even when ammonium is plentiful. The Urine Osmolal Gap directly measures the osmolal contribution of ammonium salts (NH4+ + accompanying anion), providing an accurate assessment in confounded cases."
      },
      {
        question: "Why is the Urine Osmolal Gap divided by 2 to estimate NH4+?",
        answer: "Urinary ammonium (NH4+) is excreted with an equimolar accompanying unmeasured anion (typically chloride, sulfate, or organic anions). Because one mole of NH4+ salt dissociates into two osmotically active particles, dividing the unexplained osmolal gap by 2 yields the approximate NH4+ concentration in mEq/L."
      }
    ]
  },
  fr: {
    title: "Trou Osmolaire Urinaire & Ammonium (RTA vs Perte Digestive)",
    subtitle: "Estime l'excrétion urinaire d'ammonium (NH4+) dans les acidoses métaboliques à trou anionique plasmatique normal",
    unitToggle: "Unités",
    usUnits: "Unités US (mg/dL)",
    siUnits: "Unités SI (mmol/L)",
    measOsmLabel: "Osmolalité Urinaire Mesurée (mOsm/kg)",
    uNaLabel: "Sodium Urinaire (Na_u, mmol/L)",
    uKLabel: "Potassium Urinaire (K_u, mmol/L)",
    uUreaLabel: "Azote Uréique Urinaire (mg/dL)",
    uUreaSiLabel: "Urée Urinaire (mmol/L)",
    uGluLabel: "Glucose Urinaire (mg/dL)",
    uGluSiLabel: "Glucose Urinaire (mmol/L)",
    resultTitle: "Trou Osmolaire Urinaire & Diagnostic Étiologique",
    gapLabel: "Trou Osmolaire Urinaire Calculé",
    nh4Label: "Ammonium Urinaire Estimé (NH4+)",
    points: "mOsm/kg",
    mEq: "mmol/L",
    giTier: "Trou > 100 mOsm/kg (NH4+ > 50 mmol/L) — Excrétion Rénale d'Acide Intacte (Origine Digestive)",
    giTierDesc: "L'excrétion appropriée d'ammonium prouve que les reins répondent normalement à l'acidose métabolique. L'origine est extra-rénale : perte digestive de bicarbonates (diarrhée aiguë, stomie, fistule digestive).",
    rtaTier: "Trou < 100 mOsm/kg (NH4+ < 40 mmol/L) — Défaut d'Excrétion Rénale d'Acide (ATR)",
    rtaTierDesc: "L'excrétion d'ammonium est anormalement effondrée face à l'acidose. Témoigne d'une acidose tubulaire rénale (ATR distale de type 1, ou ATR de type 4 / hypoaldostéronisme) ou d'une insuffisance rénale avancée.",
    references: "Kamel KS, et al. Urine electrolytes and osmolality: when and how to use them. Am J Nephrol. 1990;10(2):89-102. Carlisle EJ, et al. Am J Kidney Dis. 1991.",
    faqs: [
      {
        question: "Pourquoi préférer le trou osmolaire urinaire au trou anionique urinaire (TAU) ?",
        answer: "Le trou anionique urinaire [Na + K - Cl] devient faussement positif en présence d'anions non mesurés (cétoacides, pénicillines). Le trou osmolaire urinaire mesure directement la charge osmolaire des sels d'ammonium et reste fiable même lors de ces situations pièges."
      },
      {
        question: "Pourquoi divise-t-on le trou osmolaire par 2 pour obtenir le NH4+ ?",
        answer: "L'ion ammonium NH4+ est excrété obligatoirement avec un contre-ion (chlorure ou anion organique). Une mole de sel d'ammonium produit 2 particules osmotiquement actives, d'où la division par 2."
      }
    ]
  }
};

export default function UrineOsmolalGap({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isSi, setIsSi] = useState<boolean>(false);
  // Default values
  const [measOsm, setMeasOsm] = useState<string>('550');
  const [uNa, setUNa] = useState<string>('45');
  const [uK, setUK] = useState<string>('25');
  const [uUreaUs, setUUreaUs] = useState<string>('840'); // mg/dL UUN
  const [uUreaSi, setUUreaSi] = useState<string>('300'); // mmol/L
  const [uGluUs, setUGluUs] = useState<string>('0');
  const [uGluSi, setUGluSi] = useState<string>('0');

  const { calcOsm, osmGap, estNh4 } = useMemo(() => {
    const meas = parseFloat(measOsm) || 0;
    const na = parseFloat(uNa) || 0;
    const k = parseFloat(uK) || 0;

    let ureaTerm = 0;
    let gluTerm = 0;

    if (isSi) {
      ureaTerm = parseFloat(uUreaSi) || 0;
      gluTerm = parseFloat(uGluSi) || 0;
    } else {
      const uun = parseFloat(uUreaUs) || 0;
      const glu = parseFloat(uGluUs) || 0;
      ureaTerm = uun / 2.8;
      gluTerm = glu / 18.0;
    }

    const calculated = 2 * (na + k) + ureaTerm + gluTerm;
    const gap = meas - calculated;
    const nh4 = gap > 0 ? gap / 2 : 0;

    return {
      calcOsm: Math.round(calculated),
      osmGap: Math.round(gap),
      estNh4: Math.round(nh4)
    };
  }, [measOsm, uNa, uK, isSi, uUreaUs, uUreaSi, uGluUs, uGluSi]);

  const isIntactExcretion = osmGap >= 100;

  useEffect(() => {
    trackCalculatorUsage('urine-osmolal-gap', lang, osmGap);
  }, [osmGap, estNh4, isIntactExcretion, lang]);

  const exportInputs = isSi ? {
    [t.measOsmLabel]: `${measOsm} mOsm/kg`,
    [t.uNaLabel]: `${uNa} mmol/L`,
    [t.uKLabel]: `${uK} mmol/L`,
    [t.uUreaSiLabel]: `${uUreaSi} mmol/L`,
    [t.uGluSiLabel]: `${uGluSi} mmol/L`,
  } : {
    [t.measOsmLabel]: `${measOsm} mOsm/kg`,
    [t.uNaLabel]: `${uNa} mEq/L`,
    [t.uKLabel]: `${uK} mEq/L`,
    [t.uUreaLabel]: `${uUreaUs} mg/dL`,
    [t.uGluLabel]: `${uGluUs} mg/dL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.gapLabel]: `${osmGap} ${t.points}`,
    [t.nh4Label]: `~${estNh4} ${t.mEq}`,
    [t.resultTitle]: isIntactExcretion ? t.giTier : t.rtaTier
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/urine-osmolal-gap"
        howToSteps={[
          "Step 1: Measure urine osmolality, urine electrolytes (Na, K), and urine urea/glucose.",
          "Step 2: Calculate expected osmolality: 2×(Na + K) + Glucose + Urea.",
          "Step 3: Subtract calculated from measured osmolality. Gap > 100 mOsm/kg points to GI bicarbonate loss; < 100 mOsm/kg indicates RTA."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsSi(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                !isSi ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsSi(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isSi ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.siUnits}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.measOsmLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={measOsm}
              onChange={(e) => setMeasOsm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.uNaLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={uNa}
              onChange={(e) => setUNa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.uKLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={uK}
              onChange={(e) => setUK(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {!isSi ? t.uUreaLabel : t.uUreaSiLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={!isSi ? uUreaUs : uUreaSi}
              onChange={(e) => !isSi ? setUUreaUs(e.target.value) : setUUreaSi(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {!isSi ? t.uGluLabel : t.uGluSiLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={!isSi ? uGluUs : uGluSi}
              onChange={(e) => !isSi ? setUGluUs(e.target.value) : setUGluSi(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 text-lg font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          isIntactExcretion
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{osmGap}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-bold">{t.points}</span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-2">
                  (Estimated NH4+: ~{estNh4} {t.mEq})
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                isIntactExcretion
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
              }`}>
                {isIntactExcretion ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {isIntactExcretion ? "INTACT RENAL ACID EXCRETION (GI LOSS)" : "DEFECTIVE ACID EXCRETION (RTA)"}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {isIntactExcretion ? t.giTier : t.rtaTier}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isIntactExcretion ? t.giTierDesc : t.rtaTierDesc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Urine Osmolal Gap Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Urine Osm Gap = Measured U_Osm - [2×(U_Na + U_K) + (U_Glucose/18) + (UUN/2.8)]. Estimated NH4+ ≈ Gap / 2."
              disclaimer="Clinical decision aid for normal anion gap metabolic acidosis. Confirmatory testing (bicarbonate loading, urine pH, fludrocortisone/furosemide) may be indicated."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          {lang === 'fr' ? "Questions Fréquentes (FAQ)" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {t.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} lang={lang} />
    </div>
  );
}
