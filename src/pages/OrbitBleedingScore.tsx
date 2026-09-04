import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "ORBIT Bleeding Risk Score in Atrial Fibrillation",
    subtitle: "Quantifies major bleeding risk in AFib patients on oral anticoagulation (ACC/AHA favored alternative to HAS-BLED)",
    olderLabel: "Older Age (Age ≥ 74 years)",
    olderDesc: "Patient age 74 or older (+1 point)",
    anemiaLabel: "Reduced Hemoglobin / Hematocrit or Anemia",
    anemiaDesc: "Hb < 13 g/dL (male), Hb < 12 g/dL (female), Hct < 40% (M) / < 36% (F), or history of anemia (+2 points)",
    bleedingLabel: "Bleeding History",
    bleedingDesc: "Prior major bleeding, gastrointestinal bleed, or intracranial hemorrhage (+2 points)",
    kidneyLabel: "Insufficient Kidney Function",
    kidneyDesc: "eGFR < 60 mL/min/1.73m² (+1 point)",
    antiplateletLabel: "Treatment with Antiplatelet Agent",
    antiplateletDesc: "Concurrent therapy with aspirin, clopidogrel, ticagrelor, or prasugrel (+1 point)",
    yes: "Yes",
    no: "No",
    resultTitle: "ORBIT Bleeding Score & Risk Tier",
    scoreLabel: "Total ORBIT Score",
    points: "points",
    lowRisk: "Score 0 – 2: Low Bleeding Risk (2.4 / 100 pt-years)",
    lowRiskDesc: "Major bleeding rate of 2.4 events per 100 patient-years. Standard oral anticoagulation (DOAC preferred over warfarin) is strongly favored given that stroke prevention benefits decisively outweigh bleeding risks.",
    medRisk: "Score 3: Medium Bleeding Risk (4.7 / 100 pt-years)",
    medRiskDesc: "Intermediate bleeding hazard (4.7 events per 100 patient-years). DOAC therapy remains indicated in most patients with CHA2DS2-VASc ≥ 2 (men) or ≥ 3 (women). Address modifiable risk factors: discontinue unnecessary antiplatelets/NSAIDs and optimize renal dosing.",
    highRisk: "Score 4 – 7: High Bleeding Risk (8.1 / 100 pt-years)",
    highRiskDesc: "High bleeding risk (8.1 events per 100 patient-years). High bleeding risk does NOT automatically contraindicate anticoagulation, but mandates close monitoring, correcting modifiable causes, stopping unindicated antiplatelets, co-prescribing PPIs, or considering left atrial appendage occlusion (LAAO).",
    references: "O'Brien EC, Holmes DN, Ansell JE, et al. The ORBIT bleeding score: a simple score to predict major bleeding in patients with atrial fibrillation. Eur Heart J. 2015;36(46):3258-3264. (PMID: 26424865). Joglar JA, et al. 2023 ACC/AHA/ACCP/HRS Guideline for the Diagnosis and Management of Atrial Fibrillation. Circulation. 2024;149(1):e1-e156.",
    faqs: [
      {
        question: "Why does the 2023 ACC/AHA Guideline recommend ORBIT over HAS-BLED?",
        answer: "The ORBIT score has demonstrated superior or equivalent calibration in modern DOAC-treated atrial fibrillation cohorts and is easier to calculate because it omits labile INR (irrelevant for DOACs) and poorly defined subjective variables."
      },
      {
        question: "Does a high ORBIT score mean anticoagulation should be withheld?",
        answer: "No. In the vast majority of AFib patients with stroke risk, the ischemic stroke reduction from anticoagulation substantially exceeds the risk of fatal bleeding. A high ORBIT score triggers proactive bleeding mitigation: eliminating aspirin/NSAIDs, managing hypertension, reducing alcohol intake, and scheduling frequent clinical follow-ups."
      }
    ]
  },
  fr: {
    title: "Score de Saignement ORBIT (Fibrillation Atriale)",
    subtitle: "Quantifie le risque d'hémorragie majeure sous anticoagulants chez les patients en FA",
    olderLabel: "Âge ≥ 74 ans",
    olderDesc: "Patient âgé de 74 ans ou plus (+1 point)",
    anemiaLabel: "Hémoglobine/Hématocrite diminué ou Anémie",
    anemiaDesc: "Hb < 13 g/dL (H), Hb < 12 g/dL (F), Hte < 40% (H) / < 36% (F), ou antécédent d'anémie (+2 points)",
    bleedingLabel: "Antécédent Hémorragique",
    bleedingDesc: "Hémorragie digestive, intracrânienne ou saignement majeur préalable (+2 points)",
    kidneyLabel: "Insuffisance Rénale",
    kidneyDesc: "DFGe < 60 mL/min/1.73m² (+1 point)",
    antiplateletLabel: "Traitement Antiagrégant Plaquettaire",
    antiplateletDesc: "Traitement concomitant par aspirine, clopidogrel, ticagrélor (+1 point)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score ORBIT & Stratification du Risque",
    scoreLabel: "Score Total ORBIT",
    points: "points",
    lowRisk: "Score 0 – 2 : Risque Hémorragique Faible (2,4 / 100 patients-années)",
    lowRiskDesc: "Taux d'hémorragie majeure d'environ 2,4 pour 100 patients-années. L'anticoagulation orale (AOD privilégié) présente une balance bénéfice-risque très favorable.",
    medRisk: "Score 3 : Risque Hémorragique Moyen (4,7 / 100 patients-années)",
    medRiskDesc: "Risque intermédiaire (4,7 / 100 patients-années). L'anticoagulation reste généralement indiquée. Corriger les facteurs modifiables : arrêt des AINS/aspirine superflus, contrôle tensionnel.",
    highRisk: "Score 4 – 7 : Risque Hémorragique Élevé (8,1 / 100 patients-années)",
    highRiskDesc: "Risque élevé (8,1 / 100 patients-années). Cela ne contre-indique pas systématiquement l'anticoagulation, mais impose une surveillance rapprochée, l'éradication des antiagrégants non indispensables, une protection gastrique par IPP ou l'évaluation d'une occlusion de l'auricule gauche.",
    references: "O'Brien EC, et al. The ORBIT bleeding score: a simple score to predict major bleeding in patients with atrial fibrillation. Eur Heart J. 2015;36(46):3258-3264. Recommandations AHA/ACC 2023.",
    faqs: [
      {
        question: "Pourquoi les guidelines américaines privilégient-elles le score ORBIT ?",
        answer: "Le score ORBIT a été validé dans de grandes cohortes contemporaines sous AODs et ne dépend pas de l'INR labile (inapplicable aux AODs), tout en ayant une excellente valeur prédictive."
      },
      {
        question: "Un score ORBIT élevé impose-t-il d'arrêter les anticoagulants ?",
        answer: "Non. Le bénéfice sur la prévention de l'AVC embolique reste souvent supérieur au risque hémorragique. Un score élevé sert d'alerte pour corriger les facteurs modifiables et rapprocher le suivi."
      }
    ]
  }
};

export default function OrbitBleedingScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [older, setOlder] = useState<boolean>(false);
  const [anemia, setAnemia] = useState<boolean>(false);
  const [bleeding, setBleeding] = useState<boolean>(false);
  const [kidney, setKidney] = useState<boolean>(false);
  const [antiplatelet, setAntiplatelet] = useState<boolean>(false);

  const score = useMemo(() => {
    let pts = 0;
    if (older) pts += 1;
    if (anemia) pts += 2;
    if (bleeding) pts += 2;
    if (kidney) pts += 1;
    if (antiplatelet) pts += 1;
    return pts;
  }, [older, anemia, bleeding, kidney, antiplatelet]);

  const riskTier = useMemo(() => {
    if (score <= 2) return { level: 'low', text: t.lowRisk, desc: t.lowRiskDesc };
    if (score === 3) return { level: 'medium', text: t.medRisk, desc: t.medRiskDesc };
    return { level: 'high', text: t.highRisk, desc: t.highRiskDesc };
  }, [score, t]);

  useEffect(() => {
    trackCalculatorUsage('orbit-bleeding-score', lang, score);
  }, [score, riskTier.level, lang]);

  const exportInputs = {
    [t.olderLabel]: older ? t.yes : t.no,
    [t.anemiaLabel]: anemia ? t.yes : t.no,
    [t.bleedingLabel]: bleeding ? t.yes : t.no,
    [t.kidneyLabel]: kidney ? t.yes : t.no,
    [t.antiplateletLabel]: antiplatelet ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${score} ${t.points}`,
    [t.resultTitle]: riskTier.text
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/orbit-bleeding-score"
        howToSteps={[
          "Step 1: Evaluate older age (≥74 years: +1 point).",
          "Step 2: Check for reduced hemoglobin/hematocrit or history of anemia (+2 points).",
          "Step 3: Assess bleeding history (+2 points), eGFR < 60 mL/min (+1 point), and antiplatelet therapy (+1 point)."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[
            { id: 'older', label: t.olderLabel, desc: t.olderDesc, val: older, setVal: setOlder, pts: '+1' },
            { id: 'anemia', label: t.anemiaLabel, desc: t.anemiaDesc, val: anemia, setVal: setAnemia, pts: '+2' },
            { id: 'bleeding', label: t.bleedingLabel, desc: t.bleedingDesc, val: bleeding, setVal: setBleeding, pts: '+2' },
            { id: 'kidney', label: t.kidneyLabel, desc: t.kidneyDesc, val: kidney, setVal: setKidney, pts: '+1' },
            { id: 'antiplatelet', label: t.antiplateletLabel, desc: t.antiplateletDesc, val: antiplatelet, setVal: setAntiplatelet, pts: '+1' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">
                  {item.label} <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">({item.pts})</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => item.setVal(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    !item.val
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.no}
                </button>
                <button
                  type="button"
                  onClick={() => item.setVal(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    item.val
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.yes}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          riskTier.level === 'low'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : riskTier.level === 'medium'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">/ 7 {t.points}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                riskTier.level === 'low'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : riskTier.level === 'medium'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {riskTier.level === 'low' && <ShieldCheck className="w-5 h-5" />}
                {riskTier.level !== 'low' && <ShieldAlert className="w-5 h-5" />}
                {riskTier.level.toUpperCase()} RISK
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {riskTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="ORBIT Bleeding Score Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="ORBIT: Older age ≥74 (1), Reduced Hb/anemia (2), Bleeding history (2), Insufficient kidney eGFR<60 (1), Treatment with antiplatelet (1)"
              disclaimer="Clinical decision tool. High bleeding risk does not automatically contraindicate anticoagulation; address modifiable risks and monitor closely."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} lang={lang} />
    </div>
  );
}
