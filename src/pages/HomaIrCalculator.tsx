import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTERNAL_MEDICINE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "HOMA-IR & Beta-Cell Function Calculator",
    subtitle: "Quantifies insulin resistance (HOMA-IR), pancreatic beta-cell secretion (%B), and QUICKI index from fasting levels",
    unitToggle: "Units",
    usUnits: "US Units (mg/dL & µIU/mL)",
    siUnits: "SI Units (mmol/L & pmol/L)",
    gluLabel: "Fasting Blood Glucose",
    insLabel: "Fasting Serum Insulin",
    resultTitle: "HOMA-IR Index & Metabolic Stratification",
    homaLabel: "HOMA-IR Score",
    betaLabel: "Beta-Cell Function (HOMA-%B)",
    quickiLabel: "QUICKI Sensitivity Index",
    optimal: "HOMA-IR < 1.0 — Optimal Insulin Sensitivity",
    optimalDesc: "Normal physiological insulin sensitivity. Peripheral tissues efficiently utilize glucose in response to baseline insulin secretion.",
    mild: "HOMA-IR 1.0 – 1.9 — Early / Mild Insulin Resistance",
    mildDesc: "Subclinical insulin resistance. Common in sedentary lifestyle or early metabolic changes. Lifestyle modification (diet, aerobic and resistance exercise) is highly effective.",
    moderate: "HOMA-IR 2.0 – 2.9 — Significant Insulin Resistance / Metabolic Syndrome",
    moderateDesc: "Established insulin resistance. Frequently co-exists with hepatic steatosis (MASLD/NAFLD), visceral adiposity, hypertriglyceridemia, and prediabetes.",
    severe: "HOMA-IR ≥ 3.0 — Severe Insulin Resistance",
    severeDesc: "Marked insulin resistance. Substantially elevated hazard of overt Type 2 Diabetes mellitus, accelerated atherogenesis, and major adverse cardiovascular events (MACE).",
    references: "Matthews DR, Hosker JP, Rudenski AS, Naylor BA, Treacher DF, Turner RC. Homeostasis model assessment: insulin resistance and beta-cell function from fasting plasma glucose and insulin concentrations in man. Diabetologia. 1985;28(7):412-419. (PMID: 3899825). Katz A, et al. Quantitative insulin sensitivity check index: a simple, accurate method for assessing insulin sensitivity in humans. J Clin Endocrinol Metab. 2000;85(7):2402-2410.",
    faqs: [
      {
        question: "How should fasting glucose and insulin be collected for HOMA-IR?",
        answer: "Samples must be drawn after an overnight fast of 8 to 12 hours. The patient should not smoke, drink coffee, or engage in vigorous exercise immediately prior to phlebotomy. Because insulin secretion is pulsatile, a true steady-state morning sample is required."
      },
      {
        question: "Can HOMA-IR be used in patients on exogenous insulin?",
        answer: "No. HOMA-IR relies on endogenous pancreatic beta-cell feedback kinetics. In patients receiving exogenous basal or prandial insulin, the measured circulating insulin does not reflect physiologic islet secretion, rendering HOMA-IR and HOMA-%B uninterpretable."
      }
    ]
  },
  fr: {
    title: "Calculateur HOMA-IR & Fonction Bêta-Pancréatique",
    subtitle: "Quantifie l'insulino-résistance (HOMA-IR), la sécrétion des cellules bêta (%B) et l'indice QUICKI à jeun",
    unitToggle: "Unités",
    usUnits: "Unités US (mg/dL & µUI/mL)",
    siUnits: "Unités SI (mmol/L & pmol/L)",
    gluLabel: "Glycémie à Jeun",
    insLabel: "Insuline Sérique à Jeun",
    resultTitle: "Indice HOMA-IR & Profil Métabolique",
    homaLabel: "Score HOMA-IR",
    betaLabel: "Fonction Bêta (%B)",
    quickiLabel: "Indice de Sensibilité QUICKI",
    optimal: "HOMA-IR < 1,0 — Insulinosensibilité Optimale",
    optimalDesc: "Sensibilité physiologique normale à l'insuline. Utilisation périphérique optimale du glucose.",
    mild: "HOMA-IR 1,0 – 1,9 — Insulino-résistance Débutante / Modérée",
    mildDesc: "Insulino-résistance infraclinique. Fréquente en cas de sédentarité ou de surpoids débutant. Les règles hygiéno-diététiques permettent une réversibilité complète.",
    moderate: "HOMA-IR 2,0 – 2,9 — Insulino-résistance Avérée / Syndrome Métabolique",
    moderateDesc: "Insulino-résistance établie. Forte corrélation avec la stéatose hépatique métabolique (MASH), l'adiposité viscérale et le prédiabète.",
    severe: "HOMA-IR ≥ 3,0 — Insulino-résistance Sévère",
    severeDesc: "Insulino-résistance majeure. Risque très élevé de diabète de type 2 et d'événements cardiovasculaires athéromateux précoces.",
    references: "Matthews DR, et al. Homeostasis model assessment. Diabetologia. 1985;28(7):412-419. Katz A, et al. J Clin Endocrinol Metab. 2000.",
    faqs: [
      {
        question: "Quelles sont les conditions de prélèvement pour le HOMA-IR ?",
        answer: "Le dosage doit être réalisé après un jeûne strict de 8 à 12 heures le matin, au repos, sans caféine ni tabac."
      },
      {
        question: "Le score est-il interprétable sous insuline exogène ?",
        answer: "Non. Le modèle repose sur la boucle de rétrocontrôle pancréatique physiologique. L'administration d'insuline exogène fausse totalement le calcul."
      }
    ]
  }
};

export default function HomaIrCalculator({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isSi, setIsSi] = useState<boolean>(false);
  // US defaults: Glu 95 mg/dL, Ins 10 µIU/mL -> HOMA-IR = (95 * 10) / 405 = 2.34
  const [gluUs, setGluUs] = useState<string>('95');
  const [insUs, setInsUs] = useState<string>('10');

  // SI defaults: Glu 5.3 mmol/L, Ins 60 pmol/L (10 µIU/mL)
  const [gluSi, setGluSi] = useState<string>('5.3');
  const [insSi, setInsSi] = useState<string>('60');

  const { homaIr, homaBeta, quicki, tierInfo } = useMemo(() => {
    let gMgDl = 0;
    let iUiuMl = 0;

    if (isSi) {
      const gMmol = parseFloat(gluSi) || 0;
      const iPmol = parseFloat(insSi) || 0;
      gMgDl = gMmol * 18.0;
      iUiuMl = iPmol / 6.0; // 1 µIU/mL = 6 pmol/L
    } else {
      gMgDl = parseFloat(gluUs) || 0;
      iUiuMl = parseFloat(insUs) || 0;
    }

    if (gMgDl <= 0 || iUiuMl <= 0) {
      return { homaIr: 0, homaBeta: 0, quicki: 0, tierInfo: { color: 'slate', title: '', desc: '' } };
    }

    const ir = (gMgDl * iUiuMl) / 405.0;
    let beta = 0;
    if (gMgDl > 63) {
      beta = (360.0 * iUiuMl) / (gMgDl - 63.0);
    }

    // QUICKI = 1 / (log10(glucose mg/dL) + log10(insulin µIU/mL))
    const quickiVal = (Math.log10(gMgDl) + Math.log10(iUiuMl)) > 0 ? 1 / (Math.log10(gMgDl) + Math.log10(iUiuMl)) : 0;

    let tierColor = 'emerald';
    let tierTitle = t.optimal;
    let tierDesc = t.optimalDesc;

    if (ir >= 3.0) {
      tierColor = 'rose';
      tierTitle = t.severe;
      tierDesc = t.severeDesc;
    } else if (ir >= 2.0) {
      tierColor = 'amber';
      tierTitle = t.moderate;
      tierDesc = t.moderateDesc;
    } else if (ir >= 1.0) {
      tierColor = 'sky';
      tierTitle = t.mild;
      tierDesc = t.mildDesc;
    }

    return {
      homaIr: Math.round(ir * 100) / 100,
      homaBeta: Math.round(beta * 10) / 10,
      quicki: Math.round(quickiVal * 1000) / 1000,
      tierInfo: { color: tierColor, title: tierTitle, desc: tierDesc }
    };
  }, [isSi, gluUs, insUs, gluSi, insSi, t]);

  useEffect(() => {
    trackCalculatorUsage('homa-ir', lang, homaIr);
  }, [homaIr, homaBeta, quicki, lang]);

  const exportInputs = isSi ? {
    [t.gluLabel]: `${gluSi} mmol/L`,
    [t.insLabel]: `${insSi} pmol/L`,
  } : {
    [t.gluLabel]: `${gluUs} mg/dL`,
    [t.insLabel]: `${insUs} µIU/mL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.homaLabel]: `${homaIr}`,
    [t.betaLabel]: `${homaBeta}%`,
    [t.quickiLabel]: `${quicki}`,
    [t.resultTitle]: tierInfo.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/homa-ir"
        howToSteps={[
          "Step 1: Select preferred unit convention (US mg/dL & µIU/mL vs SI mmol/L & pmol/L).",
          "Step 2: Enter fasting plasma glucose and fasting serum insulin drawn after an 8–12 hour fast.",
          "Step 3: Review HOMA-IR resistance index (<1.0 optimal, ≥2.0 elevated, ≥3.0 severe) alongside pancreatic beta-cell function (%B)."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-50 dark:bg-violet-950/60 rounded-xl text-violet-600 dark:text-violet-400">
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
                !isSi ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsSi(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isSi ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.siUnits}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {!isSi ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.gluLabel} (mg/dL)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={gluUs}
                  onChange={(e) => setGluUs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.insLabel} (µIU/mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={insUs}
                  onChange={(e) => setInsUs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.gluLabel} (mmol/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={gluSi}
                  onChange={(e) => setGluSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.insLabel} (pmol/L)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={insSi}
                  onChange={(e) => setInsSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 text-lg font-medium"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          tierInfo.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : tierInfo.color === 'sky'
            ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
            : tierInfo.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{homaIr}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">HOMA-IR</span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                tierInfo.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : tierInfo.color === 'sky'
                  ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300'
                  : tierInfo.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {tierInfo.color === 'emerald' || tierInfo.color === 'sky' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {homaIr >= 2.0 ? "INSULIN RESISTANT" : "INSULIN SENSITIVE"}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-750 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.betaLabel}:</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{homaBeta}%</span>
            </div>
            <div className="p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-750 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.quickiLabel}:</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{quicki}</span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {tierInfo.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {tierInfo.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="HOMA-IR Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="HOMA-IR = (Glucose [mg/dL] × Insulin [µIU/mL]) / 405. HOMA-%B = (360 × Insulin) / (Glucose - 63)."
              disclaimer="Clinical surrogate index of insulin sensitivity and beta-cell function. Accurate only with fasting samples in the absence of exogenous insulin."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_INTERNAL_MEDICINE} lang={lang} />
    </div>
  );
}
