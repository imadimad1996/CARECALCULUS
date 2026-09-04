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
    title: "SMART-COP Score for Severe CAP",
    subtitle: "Predicts requirement for Intensive Respiratory or Vasopressor Support (IRVS) in Community-Acquired Pneumonia",
    ageGroupLabel: "Patient Age",
    ageUnder50: "≤ 50 years",
    ageOver50: "> 50 years",
    sbpLabel: "Systolic Blood Pressure < 90 mmHg",
    sbpDesc: "Hypotension at presentation (+2 points)",
    cxrLabel: "Multilobar Chest Radiograph Infiltration",
    cxrDesc: "Involvement of ≥ 2 lobes on chest X-ray or CT (+1 point)",
    albLabel: "Serum Albumin < 3.5 g/dL (< 35 g/L)",
    albDesc: "Hypoalbuminemia indicating acute inflammation or malnutrition (+1 point)",
    rrLabel: "Tachypnea (High Respiratory Rate)",
    rrDescYoung: "Respiratory rate ≥ 25 breaths/min for age ≤ 50 (+1 point)",
    rrDescOld: "Respiratory rate ≥ 30 breaths/min for age > 50 (+1 point)",
    hrLabel: "Tachycardia (Pulse ≥ 125 bpm)",
    hrDesc: "Resting heart rate meeting severe sepsis criteria (+1 point)",
    confLabel: "Acute Confusion / Altered Mental Status",
    confDesc: "New onset delirium, disorientation, or GCS drop (+1 point)",
    oxyLabel: "Severe Hypoxemia / Oxygenation Deficit",
    oxyDescYoung: "PaO2 < 70 mmHg, SpO2 ≤ 93%, or PaO2/FiO2 < 333 (+2 points)",
    oxyDescOld: "PaO2 < 60 mmHg, SpO2 ≤ 90%, or PaO2/FiO2 < 250 (+2 points)",
    phLabel: "Arterial pH < 7.35",
    phDesc: "Acidemia on arterial blood gas (+2 points)",
    yes: "Yes",
    no: "No",
    resultTitle: "SMART-COP Score & IRVS Probability",
    scoreLabel: "Total SMART-COP Score",
    points: "points",
    lowRisk: "Score 0 – 2: Low Risk of IRVS (~4%)",
    lowRiskDesc: "Low probability of requiring mechanical ventilation or vasopressor support (~4%). Suitable for standard medical ward admission or outpatient care if clinically stable.",
    modRisk: "Score 3 – 4: Moderate Risk of IRVS (~13%)",
    modRiskDesc: "Moderate likelihood of requiring intensive respiratory or vasopressor support (~13%). Step-down or monitored intermediate care bed strongly recommended. Repeat lactate and blood gases.",
    highRisk: "Score 5 – 6: High Risk of IRVS (~33%)",
    highRiskDesc: "High likelihood of respiratory exhaustion or septic shock requiring ICU support (~33%). ICU admission or immediate intensivest consultation indicated.",
    vHighRisk: "Score ≥ 7: Very High Risk of IRVS (~67%)",
    vHighRiskDesc: "Extreme likelihood of requiring invasive mechanical ventilation or inotropic/vasopressor infusions (~67%). Immediate transfer to Intensive Care Unit (ICU) mandated.",
    references: "Charles PG, Wolfe R, Christophi M, et al. SMART-COP: a tool for predicting the need for intensive respiratory or vasopressor support in community-acquired pneumonia. Clin Infect Dis. 2008;47(3):375-384. (PMID: 18558884). Metlay JP, et al. Diagnosis and Treatment of Adults with Community-acquired Pneumonia: ATS/IDSA Guideline. Am J Respir Crit Care Med. 2019;200(7):e45-e67.",
    faqs: [
      {
        question: "Why does SMART-COP outperform CURB-65 and PSI for ICU triage?",
        answer: "CURB-65 and PSI were calibrated to predict 30-day all-cause mortality, which is heavily skewed by elderly age and chronic terminal comorbidities rather than acute reversible organ failure. SMART-COP specifically predicts the need for intensive interventions (mechanical ventilation, non-invasive ventilation, or vasopressors), accurately identifying young or physiologically unstable patients who require early ICU admission."
      },
      {
        question: "How does patient age modify the SMART-COP cutoffs?",
        answer: "Younger patients (age ≤ 50) have higher baseline physiologic reserves; thus, stricter thresholds are applied: RR ≥ 25 (vs ≥ 30 in older adults) and SpO2 ≤ 93% or PaO2 < 70 (vs ≤ 90% or PaO2 < 60 in older adults) trigger the respective points."
      }
    ]
  },
  fr: {
    title: "Score SMART-COP (Pneumonie Aiguë Communautaire Sévère)",
    subtitle: "Prédit le recours à la ventilation mécanique ou aux vasopresseurs (IRVS) en réanimation dans la PAC",
    ageGroupLabel: "Âge du Patient",
    ageUnder50: "≤ 50 ans",
    ageOver50: "> 50 ans",
    sbpLabel: "Pression Artérielle Systolique < 90 mmHg",
    sbpDesc: "Hypotension artérielle à l'admission (+2 points)",
    cxrLabel: "Infiltrat Radiologique Multilobaire",
    cxrDesc: "Atteinte d'au moins 2 lobes sur la radiographie ou le scanner thoracique (+1 point)",
    albLabel: "Albuminémie < 3,5 g/dL (< 35 g/L)",
    albDesc: "Hypoalbuminémie témoignant du sepsis sévère (+1 point)",
    rrLabel: "Polypnée / Fréquence Respiratoire Élevée",
    rrDescYoung: "FR ≥ 25/min si âge ≤ 50 ans (+1 point)",
    rrDescOld: "FR ≥ 30/min si âge > 50 ans (+1 point)",
    hrLabel: "Tachycardie (Pouls ≥ 125 bpm)",
    hrDesc: "Fréquence cardiaque supérieure ou égale à 125/min (+1 point)",
    confLabel: "Confusion Aiguë / Altération de la Conscience",
    confDesc: "Troubles récents du comportement ou baisse du GCS (+1 point)",
    oxyLabel: "Hypoxémie Sévère / Déficit d'Oxygénation",
    oxyDescYoung: "PaO2 < 70 mmHg, SpO2 ≤ 93% ou PaO2/FiO2 < 333 (+2 points)",
    oxyDescOld: "PaO2 < 60 mmHg, SpO2 ≤ 90% ou PaO2/FiO2 < 250 (+2 points)",
    phLabel: "pH Artériel < 7,35",
    phDesc: "Acidémie aux gaz du sang (+2 points)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score SMART-COP & Risque de Réanimation",
    scoreLabel: "Score Total SMART-COP",
    points: "points",
    lowRisk: "Score 0 – 2 : Risque Faible d'IRVS (~4%)",
    lowRiskDesc: "Faible probabilité de nécessité de ventilation ou de catécholamines (~4%). Hospitalisation en secteur conventionnel de pneumologie ou médecine interne.",
    modRisk: "Score 3 – 4 : Risque Modéré d'IRVS (~13%)",
    modRiskDesc: "Risque intermédiaire d'assistance respiratoire ou vasopressive (~13%). Surveillance étroite en unité de soins continus (USC).",
    highRisk: "Score 5 – 6 : Risque Élevé d'IRVS (~33%)",
    highRiskDesc: "Risque élevé d'épuisement respiratoire ou de choc septique (~33%). Admission en Réanimation / Soins Intensifs recommandée.",
    vHighRisk: "Score ≥ 7 : Risque Très Élevé d'IRVS (~67%)",
    vHighRiskDesc: "Probabilité majeure de recours à la ventilation mécanique invasive ou aux drogues vasoactives (~67%). Transfert immédiat en réanimation.",
    references: "Charles PG, et al. SMART-COP: a tool for predicting the need for intensive respiratory or vasopressor support in community-acquired pneumonia. Clin Infect Dis. 2008;47(3):375-384. Recommandations ATS/IDSA 2019.",
    faqs: [
      {
        question: "Pourquoi préférer le SMART-COP au CURB-65 pour la réanimation ?",
        answer: "Le CURB-65 prédit la mortalité à 30 jours (fortement liée à l'âge et aux comorbidités), alors que le SMART-COP prédit spécifiquement le besoin de ventilation mécanique ou de noradrénaline, évitant de retarder l'admission en réanimation chez les patients jeunes."
      },
      {
        question: "Comment l'âge modifie-t-il les seuils du SMART-COP ?",
        answer: "Chez les sujets de ≤ 50 ans, les seuils sont plus stricts (FR ≥ 25 au lieu de 30 ; SpO2 ≤ 93% au lieu de 90%) pour compenser leur meilleure réserve physiologique."
      }
    ]
  }
};

export default function SmartCopScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isOver50, setIsOver50] = useState<boolean>(true);
  const [sbpLow, setSbpLow] = useState<boolean>(false);
  const [cxrMulti, setCxrMulti] = useState<boolean>(false);
  const [albLow, setAlbLow] = useState<boolean>(false);
  const [tachypnea, setTachypnea] = useState<boolean>(false);
  const [tachycardia, setTachycardia] = useState<boolean>(false);
  const [confusion, setConfusion] = useState<boolean>(false);
  const [hypoxemia, setHypoxemia] = useState<boolean>(false);
  const [acidemia, setAcidemia] = useState<boolean>(false);

  const totalScore = useMemo(() => {
    let pts = 0;
    if (sbpLow) pts += 2;
    if (cxrMulti) pts += 1;
    if (albLow) pts += 1;
    if (tachypnea) pts += 1;
    if (tachycardia) pts += 1;
    if (confusion) pts += 1;
    if (hypoxemia) pts += 2;
    if (acidemia) pts += 2;
    return pts;
  }, [sbpLow, cxrMulti, albLow, tachypnea, tachycardia, confusion, hypoxemia, acidemia]);

  const riskTier = useMemo(() => {
    if (totalScore >= 7) return { level: 'vHigh', text: t.vHighRisk, desc: t.vHighRiskDesc, color: 'rose' };
    if (totalScore >= 5) return { level: 'high', text: t.highRisk, desc: t.highRiskDesc, color: 'rose' };
    if (totalScore >= 3) return { level: 'mod', text: t.modRisk, desc: t.modRiskDesc, color: 'amber' };
    return { level: 'low', text: t.lowRisk, desc: t.lowRiskDesc, color: 'emerald' };
  }, [totalScore, t]);

  useEffect(() => {
    trackCalculatorUsage('smart-cop', lang, totalScore);
  }, [totalScore, riskTier.level, lang]);

  const exportInputs = {
    [t.ageGroupLabel]: isOver50 ? t.ageOver50 : t.ageUnder50,
    [t.sbpLabel]: sbpLow ? t.yes : t.no,
    [t.cxrLabel]: cxrMulti ? t.yes : t.no,
    [t.albLabel]: albLow ? t.yes : t.no,
    [t.rrLabel]: tachypnea ? t.yes : t.no,
    [t.hrLabel]: tachycardia ? t.yes : t.no,
    [t.confLabel]: confusion ? t.yes : t.no,
    [t.oxyLabel]: hypoxemia ? t.yes : t.no,
    [t.phLabel]: acidemia ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalScore} / 9 ${t.points}`,
    [t.resultTitle]: riskTier.text
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/smart-cop"
        howToSteps={[
          "Step 1: Select patient age group (≤50 vs >50 years) which determines tachypnea and hypoxemia cutoffs.",
          "Step 2: Check presence of SMART-COP features: Systolic BP <90 (+2), Multilobar CXR (+1), Albumin <3.5 (+1), RR threshold (+1), Pulse ≥125 (+1), Confusion (+1), PaO2/SpO2 deficit (+2), pH <7.35 (+2).",
          "Step 3: Interpret score (0–9). Scores ≥ 3 identify candidates who benefit from high-acuity or ICU monitoring."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Age Selector */}
        <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.ageGroupLabel}</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsOver50(false)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                !isOver50 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.ageUnder50}
            </button>
            <button
              type="button"
              onClick={() => setIsOver50(true)}
              className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                isOver50 ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.ageOver50}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { id: 'sbp', label: t.sbpLabel, desc: t.sbpDesc, val: sbpLow, setVal: setSbpLow, pts: '+2' },
            { id: 'cxr', label: t.cxrLabel, desc: t.cxrDesc, val: cxrMulti, setVal: setCxrMulti, pts: '+1' },
            { id: 'alb', label: t.albLabel, desc: t.albDesc, val: albLow, setVal: setAlbLow, pts: '+1' },
            { id: 'rr', label: t.rrLabel, desc: !isOver50 ? t.rrDescYoung : t.rrDescOld, val: tachypnea, setVal: setTachypnea, pts: '+1' },
            { id: 'hr', label: t.hrLabel, desc: t.hrDesc, val: tachycardia, setVal: setTachycardia, pts: '+1' },
            { id: 'conf', label: t.confLabel, desc: t.confDesc, val: confusion, setVal: setConfusion, pts: '+1' },
            { id: 'oxy', label: t.oxyLabel, desc: !isOver50 ? t.oxyDescYoung : t.oxyDescOld, val: hypoxemia, setVal: setHypoxemia, pts: '+2' },
            { id: 'ph', label: t.phLabel, desc: t.phDesc, val: acidemia, setVal: setAcidemia, pts: '+2' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">
                  {item.label} <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">({item.pts})</span>
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
                      ? 'bg-blue-600 text-white shadow-md'
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
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalScore}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">/ 9 {t.points}</span>
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
                {riskTier.text.split(':')[0]}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {riskTier.text}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {riskTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="SMART-COP Score Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="SMART-COP: SBP<90 (2), Multilobar CXR (1), Albumin<3.5 (1), Tachypnea (1), Pulse≥125 (1), Confusion (1), O2 deficit (2), pH<7.35 (2)"
              disclaimer="Predicts intensive respiratory or vasopressor support in community-acquired pneumonia. Guides ICU triage."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
