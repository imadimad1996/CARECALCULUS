import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "OASIS Score (Oxford Acute Severity of Illness)",
    subtitle: "Non-laboratory bedside ICU mortality model assessing acute physiology and organ dysfunction",
    ageTitle: "Age",
    losTitle: "Pre-ICU Hospital Stay",
    gcsTitle: "Glasgow Coma Scale (Lowest)",
    hrTitle: "Heart Rate (Worst bpm)",
    mapTitle: "Mean Arterial Pressure (Lowest MAP)",
    rrTitle: "Respiratory Rate (Worst)",
    tempTitle: "Temperature (Worst °C)",
    uopTitle: "Urine Output (First 24h mL)",
    ventTitle: "Mechanical Ventilation in 24h?",
    surgeryTitle: "Elective Surgery Admission?",
    yes: "Yes",
    no: "No",
    resultTitle: "OASIS Score & Predicted ICU Mortality",
    scoreLabel: "Total OASIS Score",
    mortalityLabel: "Predicted In-Hospital Mortality",
    points: "points",
    lowDesc: "Low severity of acute illness. Predicted in-hospital mortality is < 10%.",
    modDesc: "Intermediate ICU illness severity. Predicted in-hospital mortality between 10% and 30%.",
    highDesc: "Severe acute physiological derangement. Predicted in-hospital mortality between 30% and 60%.",
    vHighDesc: "Extreme multiorgan failure. Predicted in-hospital mortality > 60%.",
    references: "Johnson AE, Kramer AA, Clifford GD. A new severity of illness scale using a subset of Acute Physiology And Chronic Health Evaluation data elements shows comparable predictive accuracy. Crit Care Med. 2013;41(7):1711-1720. (PMID: 23660729).",
    faqs: [
      {
        question: "Why does OASIS not require laboratory tests?",
        answer: "OASIS was specifically designed using machine learning on large ICU cohorts (MIMIC-II) to provide rapid, low-cost prognostic scoring immediately at the bedside without waiting for arterial blood gases, bilirubin, or coagulation profiles."
      },
      {
        question: "How is predicted mortality calculated from the OASIS score?",
        answer: "Predicted hospital mortality is calculated using the logistic regression formula: Mortality = 1 / [1 + exp(-(-6.174 + 0.1275 × OASIS))]."
      }
    ]
  },
  fr: {
    title: "Score OASIS (Sévérité en Réanimation Sans Biologie)",
    subtitle: "Modèle pronostique de mortalité en réanimation basé uniquement sur les paramètres cliniques du premier jour",
    ageTitle: "Âge du Patient",
    losTitle: "Délai Avant Entrée en Réanimation",
    gcsTitle: "Score de Glasgow (GCS le plus bas)",
    hrTitle: "Fréquence Cardiaque (FC extrême)",
    mapTitle: "Pression Artérielle Moyenne (PAM minimale)",
    rrTitle: "Fréquence Respiratoire (FR extrême)",
    tempTitle: "Température Corporelle (°C)",
    uopTitle: "Diurèse des 24 Premières Heures (mL)",
    ventTitle: "Ventilation Mécanique aux 24 premières heures ?",
    surgeryTitle: "Chirurgie Programmée (Élective) ?",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score OASIS & Mortalité Prédite",
    scoreLabel: "Score Total OASIS",
    mortalityLabel: "Mortalité Hospitalière Prédite",
    points: "points",
    lowDesc: "Gravité initiale faible. Mortalité hospitalière prédite inférieure à 10%.",
    modDesc: "Gravité modérée. Mortalité hospitalière prédite entre 10% et 30%.",
    highDesc: "Défaillance physiologique sévère. Mortalité hospitalière prédite entre 30% et 60%.",
    vHighDesc: "Défaillance multiviscérale critique. Mortalité hospitalière prédite supérieure à 60%.",
    references: "Johnson AE, et al. A new severity of illness scale... Crit Care Med. 2013;41(7):1711-1720.",
    faqs: [
      {
        question: "Pourquoi le score OASIS ne requiert-il aucun examen de laboratoire ?",
        answer: "OASIS a été calibré pour éliminer les biais liés aux bilans sanguins manquants ou différés, permettant une évaluation instantanée dès l'admission au lit du patient."
      },
      {
        question: "Comment est calculée la mortalité ?",
        answer: "Par la régression logistique validée : Mortalité = 1 / [1 + exp(-(-6,174 + 0,1275 × OASIS))]."
      }
    ]
  }
};

export default function OasisIcuScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [agePts, setAgePts] = useState<number>(6); // 54-77
  const [losPts, setLosPts] = useState<number>(3); // 0.17-4.9 days
  const [gcsPts, setGcsPts] = useState<number>(0); // GCS 15
  const [hrPts, setHrPts] = useState<number>(0); // 51-88
  const [mapPts, setMapPts] = useState<number>(0); // 61-142
  const [rrPts, setRrPts] = useState<number>(0); // 13-22
  const [tempPts, setTempPts] = useState<number>(0); // 36.88-37.49
  const [uopPts, setUopPts] = useState<number>(0); // 2545-6896
  const [ventPts, setVentPts] = useState<number>(9); // Yes
  const [surgPts, setSurgPts] = useState<number>(6); // No (Emergency)

  const totalOasis = useMemo(() => {
    return agePts + losPts + gcsPts + hrPts + mapPts + rrPts + tempPts + uopPts + ventPts + surgPts;
  }, [agePts, losPts, gcsPts, hrPts, mapPts, rrPts, tempPts, uopPts, ventPts, surgPts]);

  const mortalityRate = useMemo(() => {
    // Logit = -6.174 + 0.1275 * OASIS
    const logit = -6.174 + 0.1275 * totalOasis;
    const prob = (1.0 / (1.0 + Math.exp(-logit))) * 100.0;
    return Math.round(prob * 10) / 10;
  }, [totalOasis]);

  const riskTier = useMemo(() => {
    if (mortalityRate >= 60) return { text: "Critical Severity", desc: t.vHighDesc, color: 'rose' };
    if (mortalityRate >= 30) return { text: "High Severity", desc: t.highDesc, color: 'rose' };
    if (mortalityRate >= 10) return { text: "Moderate Severity", desc: t.modDesc, color: 'amber' };
    return { text: "Low Severity", desc: t.lowDesc, color: 'emerald' };
  }, [mortalityRate, t]);

  useEffect(() => {
    trackCalculatorUsage('oasis-score', lang, totalOasis);
  }, [totalOasis, mortalityRate, lang]);

  const exportInputs = {
    [t.ageTitle]: `${agePts} pts`,
    [t.losTitle]: `${losPts} pts`,
    [t.gcsTitle]: `${gcsPts} pts`,
    [t.hrTitle]: `${hrPts} pts`,
    [t.mapTitle]: `${mapPts} pts`,
    [t.rrTitle]: `${rrPts} pts`,
    [t.tempTitle]: `${tempPts} pts`,
    [t.uopTitle]: `${uopPts} pts`,
    [t.ventTitle]: ventPts > 0 ? t.yes : t.no,
    [t.surgeryTitle]: surgPts === 0 ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalOasis} ${t.points}`,
    [t.mortalityLabel]: `${mortalityRate}%`,
    [t.resultTitle]: `${riskTier.text} (${riskTier.desc})`
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/oasis-score"
        howToSteps={[
          "Step 1: Select patient age and pre-ICU length of hospital stay.",
          "Step 2: Score vital signs: GCS, heart rate, MAP, respiratory rate, body temperature, and 24h urine output.",
          "Step 3: Indicate mechanical ventilation and whether ICU admission followed elective surgery."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Variables */}
        <div className="mt-8 space-y-5">
          {/* Age */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.ageTitle}</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "< 24 (0)", val: 0 },
                { label: "24–53 (3)", val: 3 },
                { label: "54–77 (6)", val: 6 },
                { label: "78–89 (9)", val: 9 },
                { label: "≥ 90 (7)", val: 7 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setAgePts(opt.val)}
                  className={`p-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                    agePts === opt.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* GCS */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.gcsTitle}</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "GCS 15 (0)", val: 0 },
                { label: "GCS 14 (3)", val: 3 },
                { label: "GCS 8–13 (4)", val: 4 },
                { label: "GCS 4–7 (7)", val: 7 },
                { label: "GCS 3 (10)", val: 10 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGcsPts(opt.val)}
                  className={`p-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                    gcsPts === opt.val
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ventilation & Surgery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.ventTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVentPts(0)}
                  className={`p-2 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                    ventPts === 0
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.no} (0)
                </button>
                <button
                  type="button"
                  onClick={() => setVentPts(9)}
                  className={`p-2 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                    ventPts === 9
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.yes} (+9)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.surgeryTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSurgPts(0)}
                  className={`p-2 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                    surgPts === 0
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.yes} (0)
                </button>
                <button
                  type="button"
                  onClick={() => setSurgPts(6)}
                  className={`p-2 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                    surgPts === 6
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t.no} (+6)
                </button>
              </div>
            </div>
          </div>

          {/* MAP & Heart Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.mapTitle}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "< 61 (4)", val: 4 },
                  { label: "61–142 (0)", val: 0 },
                  { label: "> 142 (3)", val: 3 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setMapPts(opt.val)}
                    className={`p-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                      mapPts === opt.val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <label className="font-semibold text-slate-900 dark:text-white text-sm block mb-2">{t.hrTitle}</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { label: "<51 (3)", val: 3 },
                  { label: "51-88 (0)", val: 0 },
                  { label: "89-106 (1)", val: 1 },
                  { label: "107-125 (3)", val: 3 },
                  { label: ">125 (6)", val: 6 },
                ].map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setHrPts(opt.val)}
                    className={`p-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                      hrPts === opt.val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          riskTier.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : riskTier.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalOasis}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">{t.points}</span>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 ml-3">
                  {mortalityRate}% mortality
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                riskTier.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : riskTier.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {riskTier.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {riskTier.text.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {riskTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="OASIS ICU Severity Score"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="OASIS Logit = -6.174 + 0.1275 × OASIS; Mortality = 1 / (1 + exp(-Logit))"
              disclaimer="Non-laboratory acute severity scoring tool validated for ICU mortality prediction."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} lang={lang} />
    </div>
  );
}
