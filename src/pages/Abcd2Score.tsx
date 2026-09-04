import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Brain } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEUROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "ABCD² Score for TIA Stroke Risk",
    subtitle: "Estimates subsequent stroke risk at 2, 7, and 90 days after Transient Ischemic Attack (TIA)",
    ageTitle: "Age ≥ 60 years (+1)",
    bpTitle: "Blood Pressure ≥ 140/90 mmHg at acute evaluation (+1)",
    clinicalTitle: "Clinical Presentation",
    clinicalWeakness: "Unilateral limb weakness with or without speech impairment (+2)",
    clinicalSpeech: "Speech impairment without unilateral weakness (+1)",
    clinicalOther: "Other symptoms (e.g. sensory changes only, visual loss) (+0)",
    durationTitle: "Duration of Symptoms",
    duration60: "≥ 60 minutes (+2)",
    duration1059: "10 – 59 minutes (+1)",
    durationUnder10: "< 10 minutes (+0)",
    diabetesTitle: "Diabetes Mellitus (+1)",
    yes: "Yes",
    no: "No",
    result: "Calculated ABCD² Score",
    riskTitle: "Short-Term Stroke Risk Stratification",
    formula: "ABCD² = Age (1) + BP (1) + Clinical (1-2) + Duration (1-2) + Diabetes (1)",
    references: "Johnston SC, Rothwell PM, Nguyen-Huynh MN, et al. Validation and refinement of scores to predict very early stroke risk after transient ischaemic attack. Lancet. 2007;369(9558):283-292. (PMID: 17258668).",
    faqs: [
      { question: "What is the ABCD² score?", answer: "The ABCD² score is a validated clinical risk prediction tool used in the emergency department and urgent clinics to estimate the 2-day, 7-day, and 90-day risk of stroke following a transient ischemic attack (TIA)." },
      { question: "What is the management for a score ≥ 4?", answer: "Patients with an ABCD² score ≥ 4 (moderate to high risk) warrant urgent hospital admission, rapid MRI with diffusion-weighted imaging (DWI), intracranial/extracranial vascular imaging, and initiation of dual antiplatelet therapy (DAPT with Aspirin + Clopidogrel) for 21 days as per CHANCE/POINT trial protocols." },
      { question: "Can a low ABCD² score exclude stroke completely?", answer: "No. Approximately 1% of low-risk patients (scores 0-3) will still experience a stroke within 48 hours. Urgent outpatient workup within 24–48 hours remains mandatory." }
    ],
    lowRisk: "Score 0 – 3: Low Risk",
    lowDesc: "2-day stroke risk: ~1.0%. 7-day risk: ~1.2%. 90-day risk: ~3.1%. Urgent outpatient stroke clinic evaluation within 24–48 hours recommended.",
    modRisk: "Score 4 – 5: Moderate Risk",
    modDesc: "2-day stroke risk: ~4.1%. 7-day risk: ~5.9%. 90-day risk: ~9.8%. Hospital admission or rapid ED observation unit protocol recommended. Consider DAPT (Aspirin + Clopidogrel) if within 24h.",
    highRisk: "Score 6 – 7: High Risk",
    highDesc: "2-day stroke risk: ~8.1%. 7-day risk: ~11.7%. 90-day risk: ~17.8%. Inpatient hospitalization strongly indicated. Urgent neurovascular imaging and early secondary prevention."
  },
  fr: {
    title: "Score ABCD² (Risque d'AVC post-AIT)",
    subtitle: "Estimation du risque d'accident vasculaire cérébral à 2, 7 et 90 jours après un AIT",
    ageTitle: "Âge ≥ 60 ans (+1)",
    bpTitle: "Pression artérielle ≥ 140/90 mmHg lors de l'évaluation (+1)",
    clinicalTitle: "Présentation Clinique",
    clinicalWeakness: "Déficit moteur unilatéral (avec ou sans trouble du langage) (+2)",
    clinicalSpeech: "Trouble du langage isolé sans déficit moteur (+1)",
    clinicalOther: "Autres symptômes (trouble sensitif pur, etc.) (+0)",
    durationTitle: "Durée des Symptômes",
    duration60: "≥ 60 minutes (+2)",
    duration1059: "10 à 59 minutes (+1)",
    durationUnder10: "< 10 minutes (+0)",
    diabetesTitle: "Diabète connu (+1)",
    yes: "Oui",
    no: "Non",
    result: "Score ABCD² Calculé",
    riskTitle: "Stratification du Risque d'AVC Précoce",
    formula: "ABCD² = Âge (1) + PA (1) + Clinique (1-2) + Durée (1-2) + Diabète (1)",
    references: "Johnston SC, et al. Lancet. 2007;369(9558):283-292. (PMID: 17258668).",
    faqs: [
      { question: "À quoi sert le score ABCD² ?", answer: "Il stratifie le risque de récidive sous forme d'AVC constitué dans les 48 heures suivant un accident ischémique transitoire (AIT)." },
      { question: "Quelle est la conduite à tenir pour un score ≥ 4 ?", answer: "Une hospitalisation en unité neuro-vasculaire (UNV) est fortement recommandée avec réalisation d'une IRM cérébrale en urgence et instauration d'une bithérapie antiagrégante (Aspirine + Clopidogrel pendant 21 jours)." }
    ],
    lowRisk: "Score 0 – 3 : Risque Faible",
    lowDesc: "Risque d'AVC à 48h : ~1,0%. Bilan neuro-vasculaire rapide en externe ou hôpital de jour dans les 24-48h.",
    modRisk: "Score 4 – 5 : Risque Modéré",
    modDesc: "Risque d'AVC à 48h : ~4,1%. Hospitalisation en unité neuro-vasculaire (UNV) recommandée pour monitoring et IRM.",
    highRisk: "Score 6 – 7 : Risque Élevé",
    highDesc: "Risque d'AVC à 48h : ~8,1% (et 17,8% à 3 mois). Hospitalisation urgente en soins intensifs neuro-vasculaires indispensable."
  }
};

export default function Abcd2Score({ lang }: { lang: LangCode }) {
  const [age60, setAge60] = useState<boolean>(true);
  const [bpElevated, setBpElevated] = useState<boolean>(true);
  const [clinicalFeature, setClinicalFeature] = useState<'weakness' | 'speech' | 'other'>('weakness');
  const [duration, setDuration] = useState<'over60' | '10to59' | 'under10'>('over60');
  const [diabetes, setDiabetes] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = 0;
    if (age60) s += 1;
    if (bpElevated) s += 1;
    if (clinicalFeature === 'weakness') s += 2;
    else if (clinicalFeature === 'speech') s += 1;
    if (duration === 'over60') s += 2;
    else if (duration === '10to59') s += 1;
    if (diabetes) s += 1;
    return s;
  }, [age60, bpElevated, clinicalFeature, duration, diabetes]);

  useEffect(() => {
    trackCalculatorUsage('abcd2-score', lang, score);
  }, [score, lang]);

  const riskCategory = useMemo(() => {
    if (score <= 3) return 'low';
    if (score <= 5) return 'mod';
    return 'high';
  }, [score]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/abcd2-score"
        scoringSystem="ABCD2 Score for TIA"
        howToSteps={[
          lang === 'fr' ? 'Évaluer l\'âge, la tension artérielle initiale et les antécédents de diabète.' : 'Assess age, acute blood pressure, and diabetes history.',
          lang === 'fr' ? 'Qualifier la présentation clinique (déficit moteur unilatéral vs trouble du langage).' : 'Classify clinical features (unilateral weakness vs speech disturbance).',
          lang === 'fr' ? 'Préciser la durée des symptômes en minutes pour estimer le risque d\'AVC à 48h.' : 'Quantify symptom duration in minutes to stratify 48-hour stroke risk.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <Brain className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Neurologie & Urgences Cérébro-Vasculaires' : 'Neurology & Stroke Care'}</span>
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
            {/* Age */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.ageTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAge60(false)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    !age60 ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  &lt; 60 ({currentText.no})
                </button>
                <button
                  type="button"
                  onClick={() => setAge60(true)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    age60 ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  ≥ 60 (+1)
                </button>
              </div>
            </div>

            {/* Blood pressure */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.bpTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBpElevated(false)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    !bpElevated ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  &lt; 140/90 ({currentText.no})
                </button>
                <button
                  type="button"
                  onClick={() => setBpElevated(true)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    bpElevated ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  ≥ 140/90 (+1)
                </button>
              </div>
            </div>

            {/* Clinical Features */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.clinicalTitle}</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setClinicalFeature('weakness')}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    clinicalFeature === 'weakness' ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {currentText.clinicalWeakness}
                </button>
                <button
                  type="button"
                  onClick={() => setClinicalFeature('speech')}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    clinicalFeature === 'speech' ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {currentText.clinicalSpeech}
                </button>
                <button
                  type="button"
                  onClick={() => setClinicalFeature('other')}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    clinicalFeature === 'other' ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {currentText.clinicalOther}
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.durationTitle}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDuration('over60')}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                    duration === 'over60' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.duration60}
                </button>
                <button
                  type="button"
                  onClick={() => setDuration('10to59')}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                    duration === '10to59' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.duration1059}
                </button>
                <button
                  type="button"
                  onClick={() => setDuration('under10')}
                  className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                    duration === 'under10' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.durationUnder10}
                </button>
              </div>
            </div>

            {/* Diabetes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.diabetesTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiabetes(false)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    !diabetes ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.no} (+0)
                </button>
                <button
                  type="button"
                  onClick={() => setDiabetes(true)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    diabetes ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.yes} (+1)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  riskCategory === 'low' ? 'text-emerald-400' : riskCategory === 'mod' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {score}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 7 points</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                riskCategory === 'low' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : riskCategory === 'mod'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {riskCategory === 'low' ? currentText.lowRisk : riskCategory === 'mod' ? currentText.modRisk : currentText.highRisk}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {riskCategory === 'low' ? currentText.lowDesc : riskCategory === 'mod' ? currentText.modDesc : currentText.highDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age ≥ 60", value: age60 ? "Yes (+1)" : "No (+0)" },
                  { label: "BP ≥ 140/90", value: bpElevated ? "Yes (+1)" : "No (+0)" },
                  { label: "Clinical Feature", value: clinicalFeature === 'weakness' ? "Unilateral weakness (+2)" : clinicalFeature === 'speech' ? "Speech disturbance (+1)" : "Other (+0)" },
                  { label: "Duration", value: duration === 'over60' ? "≥60 min (+2)" : duration === '10to59' ? "10-59 min (+1)" : "<10 min (+0)" },
                  { label: "Diabetes", value: diabetes ? "Yes (+1)" : "No (+0)" }
                ]}
                results={[
                  { label: "ABCD² Score", value: `${score} / 7` },
                  { label: "Risk Level", value: riskCategory === 'low' ? "Low Risk (0-3)" : riskCategory === 'mod' ? "Moderate Risk (4-5)" : "High Risk (6-7)" },
                  { label: "2-Day Stroke Risk", value: riskCategory === 'low' ? "~1.0%" : riskCategory === 'mod' ? "~4.1%" : "~8.1%" }
                ]}
                formula={currentText.formula}
                disclaimer="Score >= 4 warrants hospital admission or rapid observation unit workup and consideration of DAPT."
                references="Johnston SC, et al. Lancet. 2007;369(9558):283-292."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_NEUROLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/17258668/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Johnston SC et al. (2007) The Lancet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
