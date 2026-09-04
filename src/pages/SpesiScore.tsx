import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PULMONOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "sPESI (Simplified Pulmonary Embolism Severity Index)",
    subtitle: "Predicts 30-day mortality in acute pulmonary embolism to determine outpatient candidacy",
    ageLabel: "Age > 80 years",
    ageDesc: "Patient is 81 years of age or older (+1)",
    cancerLabel: "History of Cancer",
    cancerDesc: "Active malignancy or cancer diagnosed within past year (+1)",
    cardioLabel: "Chronic Cardiopulmonary Disease",
    cardioDesc: "Heart failure or chronic lung disease (COPD, interstitial lung disease) (+1)",
    hrLabel: "Heart Rate ≥ 110 bpm",
    hrDesc: "Tachycardia at initial clinical evaluation (+1)",
    sbpLabel: "Systolic Blood Pressure < 100 mmHg",
    sbpDesc: "Hypotension / hemodynamic fragility (+1)",
    spo2Label: "Arterial Oxygen Saturation (SpO2) < 90%",
    spo2Desc: "Hypoxemia with or without supplemental oxygen (+1)",
    yes: "Yes (+1)",
    no: "No (0)",
    resultTitle: "sPESI Score & 30-Day Prognosis",
    scoreLabel: "Total sPESI Score",
    points: "points",
    lowRisk: "Score = 0: Low Risk (30-Day Mortality ~1.0%)",
    lowRiskDesc: "Patients with an sPESI of 0 have a low 30-day all-cause mortality rate (~1.0%, 95% CI 0.0%–2.1%). If right ventricular function is normal, troponin is negative, and social support is reliable, outpatient anticoagulation or early hospital discharge within 24–48 hours may be safely considered.",
    highRisk: "Score ≥ 1: High Risk (30-Day Mortality ~10.9%)",
    highRiskDesc: "Patients with an sPESI ≥ 1 have an elevated 30-day all-cause mortality rate (~10.9%, 95% CI 8.5%–13.2%). Inpatient admission is strongly recommended. Evaluate for right ventricular strain (echocardiography or CT PA) and cardiac biomarkers (troponin, BNP) to stratify for intermediate-high vs intermediate-low risk.",
    references: "Jiménez D, Aujesky D, Moores L, et al. Simplification of the pulmonary embolism severity index for prognostication in patients with acute symptomatic pulmonary embolism. Arch Intern Med. 2010;170(15):1383-1389. Konstantinides SV, et al. 2019 ESC Guidelines for the diagnosis and management of acute pulmonary embolism developed in collaboration with the ERS. Eur Heart J. 2020;41(4):543-603.",
    faqs: [
      {
        question: "What is the difference between PESI and sPESI?",
        answer: "The original PESI uses 11 clinical parameters including exact age in years, mental status, temperature, and arterial blood gas values. The simplified PESI (sPESI) evaluates 6 binary (yes/no) variables, offering nearly identical prognostic accuracy and negative predictive value for 30-day mortality while being much faster to compute at the bedside."
      },
      {
        question: "Can an sPESI of 0 guarantee safe outpatient management?",
        answer: "No single clinical score should be used in isolation. Outpatient management requires an sPESI score of 0, absence of severe symptoms or supplemental oxygen requirement, normal hemodynamics, preserved right ventricular function on imaging, negative cardiac biomarkers, intact renal/hepatic function for DOACs, and a stable home environment."
      }
    ]
  },
  fr: {
    title: "Score sPESI (Index de Gravité de l'Embolie Pulmonaire Simplifié)",
    subtitle: "Prédit la mortalité à 30 jours dans l'embolie pulmonaire aiguë pour guider l'hospitalisation",
    ageLabel: "Âge > 80 ans",
    ageDesc: "Patient âgé de 81 ans ou plus (+1)",
    cancerLabel: "Antécédent de Cancer",
    cancerDesc: "Néoplasie active ou diagnostiquée dans l'année écoulée (+1)",
    cardioLabel: "Pathologie Cardiopulmonaire Chronique",
    cardioDesc: "Insuffisance cardiaque ou pneumopathie chronique (BPCO, fibrose) (+1)",
    hrLabel: "Fréquence Cardiaque ≥ 110 bpm",
    hrDesc: "Tachycardie lors de l'évaluation initiale (+1)",
    sbpLabel: "Pression Artérielle Systolique < 100 mmHg",
    sbpDesc: "Hypotension artérielle systolique (+1)",
    spo2Label: "Saturation Artérielle en Oxygène (SpO2) < 90%",
    spo2Desc: "Hypoxémie avec ou sans oxygénothérapie (+1)",
    yes: "Oui (+1)",
    no: "Non (0)",
    resultTitle: "Score sPESI & Pronostic à 30 Jours",
    scoreLabel: "Score sPESI Total",
    points: "points",
    lowRisk: "Score = 0 : Risque Faible (Mortalité à 30 j ~1,0%)",
    lowRiskDesc: "Les patients avec un score sPESI de 0 présentent une mortalité globale à 30 jours très faible (~1,0%). En l'absence de dysfonction ventriculaire droite et si la troponine est normale, une prise en charge ambulatoire ou une sortie précoce peut être discutée selon les recommandations ESC.",
    highRisk: "Score ≥ 1 : Risque Élevé (Mortalité à 30 j ~10,9%)",
    highRiskDesc: "Les patients avec un score sPESI ≥ 1 présentent une mortalité à 30 jours d'environ 10,9%. Une hospitalisation est impérative. Une évaluation échocardiographique du ventricule droit et le dosage des biomarqueurs cardiaques (troponine, BNP) sont requis pour guider la surveillance.",
    references: "Jiménez D, et al. Simplification of the pulmonary embolism severity index for prognostication in patients with acute symptomatic pulmonary embolism. Arch Intern Med. 2010;170(15):1383-1389. Recommandations ESC/ERS 2019.",
    faqs: [
      {
        question: "Quelle est la différence entre PESI et sPESI ?",
        answer: "Le score PESI original comporte 11 variables pondérées complexes. Le score simplifié (sPESI) ne retient que 6 variables binaires (0 ou 1 point) faciles à évaluer en urgence, avec une excellente valeur prédictive négative pour identifier les patients à bas risque."
      },
      {
        question: "Un sPESI de 0 autorise-t-il toujours le retour à domicile ?",
        answer: "Le score sPESI = 0 est une condition nécessaire mais non suffisante. Il faut également vérifier l'absence de dysfonction VD (échocœur ou angioscan), des troponines négatives, une stabilité hémodynamique et un contexte psycho-social favorable."
      }
    ]
  }
};

export default function SpesiScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [ageOver80, setAgeOver80] = useState<boolean>(false);
  const [cancer, setCancer] = useState<boolean>(false);
  const [cardiopulmonary, setCardiopulmonary] = useState<boolean>(false);
  const [hrOver110, setHrOver110] = useState<boolean>(false);
  const [sbpUnder100, setSbpUnder100] = useState<boolean>(false);
  const [spo2Under90, setSpo2Under90] = useState<boolean>(false);

  const score = useMemo(() => {
    let pts = 0;
    if (ageOver80) pts += 1;
    if (cancer) pts += 1;
    if (cardiopulmonary) pts += 1;
    if (hrOver110) pts += 1;
    if (sbpUnder100) pts += 1;
    if (spo2Under90) pts += 1;
    return pts;
  }, [ageOver80, cancer, cardiopulmonary, hrOver110, sbpUnder100, spo2Under90]);

  const isLowRisk = score === 0;

  useEffect(() => {
    trackCalculatorUsage('spesi-score', lang, score);
  }, [score, isLowRisk, lang]);

  const exportInputs = {
    [t.ageLabel]: ageOver80 ? t.yes : t.no,
    [t.cancerLabel]: cancer ? t.yes : t.no,
    [t.cardioLabel]: cardiopulmonary ? t.yes : t.no,
    [t.hrLabel]: hrOver110 ? t.yes : t.no,
    [t.sbpLabel]: sbpUnder100 ? t.yes : t.no,
    [t.spo2Label]: spo2Under90 ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${score} ${t.points}`,
    [t.resultTitle]: isLowRisk ? t.lowRisk : t.highRisk
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/spesi-score"
        howToSteps={[
          "Step 1: Evaluate patient age (>80 years) and history of cancer or cardiopulmonary disease.",
          "Step 2: Check vital signs: heart rate ≥ 110, systolic BP < 100 mmHg, and oxygen saturation < 90%.",
          "Step 3: Sum affirmative items (each 1 point). Score of 0 signifies low 30-day mortality risk."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 rounded-xl text-teal-600 dark:text-teal-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[
            { id: 'age', label: t.ageLabel, desc: t.ageDesc, val: ageOver80, setVal: setAgeOver80 },
            { id: 'cancer', label: t.cancerLabel, desc: t.cancerDesc, val: cancer, setVal: setCancer },
            { id: 'cardio', label: t.cardioLabel, desc: t.cardioDesc, val: cardiopulmonary, setVal: setCardiopulmonary },
            { id: 'hr', label: t.hrLabel, desc: t.hrDesc, val: hrOver110, setVal: setHrOver110 },
            { id: 'sbp', label: t.sbpLabel, desc: t.sbpDesc, val: sbpUnder100, setVal: setSbpUnder100 },
            { id: 'spo2', label: t.spo2Label, desc: t.spo2Desc, val: spo2Under90, setVal: setSpo2Under90 },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">{item.label}</p>
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
                      ? 'bg-teal-600 text-white shadow-md'
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
          isLowRisk
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">/ 6 {t.points}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isLowRisk ? (
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Low Risk (~1.0% mortality)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-semibold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>High Risk (~10.9% mortality)</span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isLowRisk ? t.lowRiskDesc : t.highRiskDesc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="sPESI Score Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Simplified PESI: 1 point each for Age > 80, Cancer, Cardiopulmonary disease, HR ≥ 110 bpm, SBP < 100 mmHg, SpO2 < 90%"
              disclaimer="Clinical decision tool. Outpatient care also requires preserved RV function, negative biomarkers, and adequate social support."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_PULMONOLOGY} lang={lang} />
    </div>
  );
}
