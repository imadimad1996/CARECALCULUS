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
    title: "SAPS 3 Score (Simplified Acute Physiology Score 3)",
    subtitle: "Global ICU admission risk prediction model based on patient characteristics and first-hour physiology",
    box1Title: "Box I: Patient Characteristics & Chronic Comorbidities",
    box2Title: "Box II: Circumstances of ICU Admission",
    box3Title: "Box III: First-Hour Physiological Derangements",
    ageLabel: "Patient Age (years)",
    losLabel: "Pre-ICU Hospital Stay (days)",
    comorbCancer: "Metastatic Cancer or Hematologic Malignancy (+11)",
    comorbCirrhosis: "Severe Cirrhosis / Liver Failure (+10)",
    comorbAids: "AIDS / Advanced HIV (+9)",
    comorbChf: "Severe Heart Failure (NYHA IV) (+6)",
    unplanned: "Unplanned ICU Admission (+5)",
    emergencySurg: "Emergency Surgery Prior to Admission (+6)",
    septicShock: "Admission for Severe Sepsis / Septic Shock (+8)",
    gcsDrop: "Lowest GCS ≤ 6 (+15) or 7–12 (+7)",
    hypotension: "Lowest Systolic BP < 80 mmHg (+11) or 80–119 (+5)",
    acidemia: "Arterial pH < 7.25 (+12) or 7.25–7.35 (+5)",
    hypoxemia: "PaO2/FiO2 < 100 (+11) or 100–249 (+7)",
    thrombocyto: "Platelets < 50,000/µL (+13) or 50k–99k (+5)",
    highCr: "Serum Creatinine ≥ 3.5 mg/dL (+10) or 2.0–3.4 (+7)",
    highBili: "Bilirubin ≥ 6.0 mg/dL (+9) or 2.0–5.9 (+5)",
    yes: "Yes",
    no: "No",
    resultTitle: "SAPS 3 Score & Global Hospital Mortality",
    scoreLabel: "Total SAPS 3 Score",
    mortalityLabel: "Predicted In-Hospital Mortality",
    points: "points",
    lowDesc: "Low predicted in-hospital mortality (< 15%). Favorable physiological recovery expected with standard ICU care.",
    modDesc: "Intermediate mortality risk (15% – 35%). Requires invasive hemodynamic monitoring and organ support.",
    highDesc: "High mortality risk (35% – 60%). Significant acute physiological compromise across multiple organ systems.",
    vHighDesc: "Very high mortality risk (> 60%). Severe multiorgan failure upon ICU admission.",
    references: "Moreno RP, Metnitz PG, Almeida E, et al. SAPS 3--From evaluation of the patient to evaluation of the intensive care unit. Part 2: Development of a physiologically based model for predicting in-hospital mortality at ICU admission. Intensive Care Med. 2005;31(10):1345-1355. (PMID: 16132892).",
    faqs: [
      {
        question: "When should data for SAPS 3 be collected?",
        answer: "Unlike APACHE II or SAPS II which collect data over the first 24 hours, SAPS 3 specifically records baseline chronic health and the worst physiological values during the FIRST HOUR of ICU admission, avoiding confounding effects of ICU therapy."
      },
      {
        question: "How is mortality predicted in SAPS 3?",
        answer: "Predicted hospital mortality is determined using the standard global logit equation: Logit = -32.6659 + ln(SAPS3 + 20.5958) × 7.3068; Mortality = exp(Logit) / (1 + exp(Logit))."
      }
    ]
  },
  fr: {
    title: "Score SAPS 3 (Gravité en Réanimation à la 1ère Heure)",
    subtitle: "Modèle international de prédiction de mortalité fondé sur les caractéristiques et la physiologie de la 1ère heure d'admission",
    box1Title: "Boîte I : Antécédents & Comorbidités Chroniques",
    box2Title: "Boîte II : Circonstances d'Admission en Réanimation",
    box3Title: "Boîte III : Altérations Physiologiques de la 1ère Heure",
    ageLabel: "Âge du Patient (années)",
    losLabel: "Séjour Hospitalier Pré-Réanimation (jours)",
    comorbCancer: "Cancer Métastatique ou Hémopathie (+11)",
    comorbCirrhosis: "Cirrhose Sévère / Insuffisance Hépatique (+10)",
    comorbAids: "SIDA / VIH Avancé (+9)",
    comorbChf: "Insuffisance Cardiaque Sévère (NYHA IV) (+6)",
    unplanned: "Admission en Réanimation Non Programmée (+5)",
    emergencySurg: "Chirurgie en Urgence Immédiate (+6)",
    septicShock: "Sepsis Sévère ou Choc Septique (+8)",
    gcsDrop: "Score GCS ≤ 6 (+15) ou 7–12 (+7)",
    hypotension: "PAS < 80 mmHg (+11) ou 80–119 (+5)",
    acidemia: "pH Artériel < 7,25 (+12) ou 7,25–7,35 (+5)",
    hypoxemia: "PaO2/FiO2 < 100 (+11) ou 100–249 (+7)",
    thrombocyto: "Plaquettes < 50 000/µL (+13) ou 50k–99k (+5)",
    highCr: "Créatinine ≥ 3,5 mg/dL (+10) ou 2,0–3,4 (+7)",
    highBili: "Bilirubine ≥ 6,0 mg/dL (+9) ou 2,0–5,9 (+5)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score SAPS 3 & Mortalité Hospitalière",
    scoreLabel: "Score SAPS 3 Total",
    mortalityLabel: "Mortalité Hospitalière Prédite",
    points: "points",
    lowDesc: "Risque de mortalité hospitalière faible (< 15%).",
    modDesc: "Risque de mortalité intermédiaire (15% – 35%).",
    highDesc: "Risque de mortalité élevé (35% – 60%). Défaillances d'organes multiples.",
    vHighDesc: "Risque de mortalité très élevé (> 60%). Défaillance multiviscérale critique dès l'admission.",
    references: "Moreno RP, et al. SAPS 3... Intensive Care Med. 2005;31(10):1345-1355.",
    faqs: [
      {
        question: "Quand recueillir les variables du SAPS 3 ?",
        answer: "Le SAPS 3 se calcule sur les paramètres de la PREMIÈRE HEURE d'admission en réanimation, évitant les biais induits par les traitements de réanimation ultérieurs."
      },
      {
        question: "Comment est calculée la mortalité prédite ?",
        answer: "Via l'équation logistique standard : Logit = -32,6659 + ln(SAPS3 + 20,5958) × 7,3068 ; Mortalité = exp(Logit) / (1 + exp(Logit))."
      }
    ]
  }
};

export default function Saps3Score({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  // Box I
  const [ageTier, setAgeTier] = useState<number>(7); // 60-69 yrs (+7), <40 (0), 40-59 (5), 70-74 (13), 75-79 (16), >=80 (18)
  const [losTier, setLosTier] = useState<number>(0); // <14 days (0), >=14 days (+6)
  const [hasCancer, setHasCancer] = useState<boolean>(false);
  const [hasCirrhosis, setHasCirrhosis] = useState<boolean>(false);
  const [hasChf, setHasChf] = useState<boolean>(false);

  // Box II
  const [isUnplanned, setIsUnplanned] = useState<boolean>(true);
  const [isEmergencySurg, setIsEmergencySurg] = useState<boolean>(false);
  const [isSepticShock, setIsSepticShock] = useState<boolean>(false);

  // Box III
  const [gcsPts, setGcsPts] = useState<number>(0); // 0 (13-15), 7 (7-12), 15 (<=6)
  const [sbpPts, setSbpPts] = useState<number>(0); // 0 (>=120), 5 (80-119), 11 (<80)
  const [phPts, setPhPts] = useState<number>(0); // 0 (>=7.35), 5 (7.25-7.34), 12 (<7.25)
  const [pao2Pts, setPao2Pts] = useState<number>(0); // 0 (>=250), 7 (100-249), 11 (<100)
  const [pltPts, setPltPts] = useState<number>(0); // 0 (>=100k), 5 (50-99k), 13 (<50k)
  const [crPts, setCrPts] = useState<number>(0); // 0 (<2.0), 7 (2.0-3.4), 10 (>=3.5)

  const totalSaps3 = useMemo(() => {
    let pts = 16; // Baseline constant in SAPS 3 Box I
    pts += ageTier;
    pts += losTier;
    if (hasCancer) pts += 11;
    if (hasCirrhosis) pts += 10;
    if (hasChf) pts += 6;

    if (isUnplanned) pts += 5;
    if (isEmergencySurg) pts += 6;
    if (isSepticShock) pts += 8;

    pts += gcsPts;
    pts += sbpPts;
    pts += phPts;
    pts += pao2Pts;
    pts += pltPts;
    pts += crPts;

    return pts;
  }, [ageTier, losTier, hasCancer, hasCirrhosis, hasChf, isUnplanned, isEmergencySurg, isSepticShock, gcsPts, sbpPts, phPts, pao2Pts, pltPts, crPts]);

  const mortalityRate = useMemo(() => {
    // Global standard SAPS 3 equation:
    // Logit = -32.6659 + ln(SAPS3 + 20.5958) * 7.3068
    const logit = -32.6659 + Math.log(totalSaps3 + 20.5958) * 7.3068;
    const expL = Math.exp(logit);
    const prob = (expL / (1.0 + expL)) * 100.0;
    return Math.round(prob * 10) / 10;
  }, [totalSaps3]);

  const riskTier = useMemo(() => {
    if (mortalityRate >= 60) return { text: "Very High Risk", desc: t.vHighDesc, color: 'rose' };
    if (mortalityRate >= 35) return { text: "High Risk", desc: t.highDesc, color: 'rose' };
    if (mortalityRate >= 15) return { text: "Moderate Risk", desc: t.modDesc, color: 'amber' };
    return { text: "Low Risk", desc: t.lowDesc, color: 'emerald' };
  }, [mortalityRate, t]);

  useEffect(() => {
    trackCalculatorUsage('saps-3-score', lang, totalSaps3);
  }, [totalSaps3, mortalityRate, lang]);

  const exportInputs = {
    [t.ageLabel]: `${ageTier} pts`,
    [t.comorbCancer]: hasCancer ? t.yes : t.no,
    [t.comorbCirrhosis]: hasCirrhosis ? t.yes : t.no,
    [t.unplanned]: isUnplanned ? t.yes : t.no,
    [t.emergencySurg]: isEmergencySurg ? t.yes : t.no,
    [t.septicShock]: isSepticShock ? t.yes : t.no,
    [t.gcsDrop]: `${gcsPts} pts`,
    [t.hypotension]: `${sbpPts} pts`,
    [t.acidemia]: `${phPts} pts`,
    [t.hypoxemia]: `${pao2Pts} pts`,
    [t.thrombocyto]: `${pltPts} pts`,
    [t.highCr]: `${crPts} pts`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalSaps3} ${t.points}`,
    [t.mortalityLabel]: `${mortalityRate}%`,
    [t.resultTitle]: `${riskTier.text}: ${riskTier.desc}`
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/saps-3-score"
        howToSteps={[
          "Step 1: Score patient chronic health status and pre-ICU length of stay in Box I.",
          "Step 2: Record circumstances of ICU admission (unplanned, emergency surgery, sepsis) in Box II.",
          "Step 3: Evaluate physiological derangements (GCS, SBP, pH, PaO2/FiO2, platelets, creatinine) during the first hour of ICU admission."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/60 rounded-xl text-cyan-600 dark:text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Box I */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{t.box1Title}</h3>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{t.ageLabel}</label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { label: "< 40 (0)", val: 0 },
                  { label: "40–59 (5)", val: 5 },
                  { label: "60–69 (7)", val: 7 },
                  { label: "70–74 (13)", val: 13 },
                  { label: "75–79 (16)", val: 16 },
                  { label: "≥ 80 (18)", val: 18 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setAgeTier(item.val)}
                    className={`p-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                      ageTier === item.val
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: t.comorbCancer, val: hasCancer, setVal: setHasCancer },
                { label: t.comorbCirrhosis, val: hasCirrhosis, setVal: setHasCirrhosis },
                { label: t.comorbChf, val: hasChf, setVal: setHasChf },
              ].map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => c.setVal(!c.val)}
                  className={`p-3 text-xs font-semibold rounded-lg border transition-all text-left min-h-[44px] ${
                    c.val
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Box II */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{t.box2Title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: t.unplanned, val: isUnplanned, setVal: setIsUnplanned },
                { label: t.emergencySurg, val: isEmergencySurg, setVal: setIsEmergencySurg },
                { label: t.septicShock, val: isSepticShock, setVal: setIsSepticShock },
              ].map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => c.setVal(!c.val)}
                  className={`p-3 text-xs font-semibold rounded-lg border transition-all text-left min-h-[44px] ${
                    c.val
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Box III */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-3">{t.box3Title}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.gcsDrop}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "13–15 (0)", v: 0 }, { l: "7–12 (+7)", v: 7 }, { l: "≤ 6 (+15)", v: 15 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setGcsPts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${gcsPts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.hypotension}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "≥ 120 (0)", v: 0 }, { l: "80–119 (+5)", v: 5 }, { l: "< 80 (+11)", v: 11 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setSbpPts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${sbpPts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.acidemia}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "≥ 7.35 (0)", v: 0 }, { l: "7.25–7.34 (+5)", v: 5 }, { l: "< 7.25 (+12)", v: 12 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setPhPts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${phPts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.hypoxemia}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "≥ 250 (0)", v: 0 }, { l: "100–249 (+7)", v: 7 }, { l: "< 100 (+11)", v: 11 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setPao2Pts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${pao2Pts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.thrombocyto}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "≥ 100k (0)", v: 0 }, { l: "50k–99k (+5)", v: 5 }, { l: "< 50k (+13)", v: 13 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setPltPts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${pltPts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{t.highCr}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ l: "< 2.0 (0)", v: 0 }, { l: "2.0–3.4 (+7)", v: 7 }, { l: "≥ 3.5 (+10)", v: 10 }].map((o) => (
                    <button key={o.v} type="button" onClick={() => setCrPts(o.v)} className={`p-2 text-xs font-semibold rounded-lg border min-h-[40px] ${crPts === o.v ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-slate-800'}`}>{o.l}</button>
                  ))}
                </div>
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
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalSaps3}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">{t.points}</span>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 ml-3">
                  {mortalityRate}% predicted mortality
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
              calculatorName="SAPS 3 ICU Mortality Score"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="SAPS 3 Logit = -32.6659 + ln(SAPS3 + 20.5958) × 7.3068; Predicted Mortality = exp(Logit)/(1+exp(Logit))"
              disclaimer="Global ICU admission risk prediction model based on first-hour physiological data."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
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
