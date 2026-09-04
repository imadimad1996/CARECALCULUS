import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Heart } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "HEART Pathway for Early Chest Pain Discharge",
    subtitle: "Accelerated Diagnostic Protocol (ADP) combining HEART score with serial delta-troponins to safely discharge low-risk patients",
    hTitle: "History (Suspicion Level)",
    hSlight: "Slightly suspicious (0)",
    hMod: "Moderately suspicious (+1)",
    hHigh: "Highly suspicious (+2)",
    eTitle: "ECG Findings",
    eNorm: "Normal (0)",
    eNonSpec: "Non-specific repolarization disturbance / LBBB / pacing (+1)",
    eStDep: "Significant ST depression or T-wave inversion (+2)",
    aTitle: "Age",
    aUnder45: "< 45 years (0)",
    a45to64: "45 – 64 years (+1)",
    a65plus: "≥ 65 years (+2)",
    rTitle: "Risk Factors (HTN, Hyperlipidemia, DM, Smoking, Family Hx, BMI > 30)",
    rNone: "No known risk factors (0)",
    r1to2: "1 or 2 risk factors (+1)",
    r3plus: "≥ 3 risk factors or history of atherosclerotic disease (+2)",
    tropTitle: "Serial Troponin Testing (0h and 1–3h)",
    tropBaselineElevated: "Baseline Troponin elevated above 99th percentile URL",
    tropDeltaPositive: "Significant Delta Troponin between 0h and 1–3h",
    yes: "Yes",
    no: "No",
    result: "HEART Pathway Disposition",
    references: "Mahler SA, Reilly RF, Hiestand BC, et al. The HEART Pathway Randomized Trial: Identifying Emergency Department Patients With Acute Chest Pain for Early Discharge. Circ Cardiovasc Qual Outcomes. 2015;8(2):195-203. (PMID: 25737484).",
    faqs: [
      { question: "What is the HEART Pathway?", answer: "The HEART Pathway is a validated clinical decision protocol that couples the HEART score with serial high-sensitivity troponin measurements at 0 and 1–3 hours to safely reduce hospitalizations for acute chest pain." },
      { question: "When is early discharge safe?", answer: "A patient is identified as 'low risk' when the modified HEART score is ≤ 3 AND both the initial and 1–3 hour troponins are normal without a significant delta. 30-day MACE in this group is < 0.5%." }
    ],
    lowRisk: "Low Risk: Early Discharge Protocol (< 0.5% 30-Day MACE)",
    lowRiskDesc: "Modified HEART score ≤ 3 and serial troponins negative. Patient can be safely discharged from the emergency department with outpatient follow-up within 72 hours.",
    highRisk: "Non-Low Risk: Hospital Observation / Inpatient Cardiology Admission",
    highRiskDesc: "Patient fails low-risk clearance criteria (HEART score ≥ 4, elevated baseline troponin, or significant delta troponin). Admit for telemetry, serial biomarker monitoring, and objective ischemia evaluation (CCTA / stress test)."
  },
  fr: {
    title: "HEART Pathway (Protocole d'Évaluation Douleur Thoracique)",
    subtitle: "Protocole diagnostique accéléré associant score HEART et troponines sériées pour autoriser la sortie précoce des urgences",
    hTitle: "Anamnèse (Niveau de Suspicion)",
    hSlight: "Peu suspecte (0)",
    hMod: "Moyennement suspecte (+1)",
    hHigh: "Très suspecte (+2)",
    eTitle: "Électrocardiogramme (ECG)",
    eNorm: "Normal (0)",
    eNonSpec: "Anomalies non spécifiques de la repolarisation / BBG (+1)",
    eStDep: "Sous-décalage ST ou ondes T négatives significatives (+2)",
    aTitle: "Âge",
    aUnder45: "< 45 ans (0)",
    a45to64: "45 à 64 ans (+1)",
    a65plus: "≥ 65 ans (+2)",
    rTitle: "Facteurs de Risque (HTA, Cholestérol, Diabète, Tabac, Hérédité, Obésité)",
    rNone: "Aucun facteur de risque connu (0)",
    r1to2: "1 ou 2 facteurs de risque (+1)",
    r3plus: "≥ 3 facteurs de risque ou athérosclérose coronarienne avérée (+2)",
    tropTitle: "Cinétique des Troponines (H0 et H1–H3)",
    tropBaselineElevated: "Troponine initiale supérieure au 99e percentile",
    tropDeltaPositive: "Variation significative (Delta Troponine) entre H0 et H1-H3",
    yes: "Oui",
    no: "Non",
    result: "Décision HEART Pathway",
    references: "Mahler SA, et al. Circ Cardiovasc Qual Outcomes. 2015;8(2):195-203. (PMID: 25737484).",
    faqs: [
      { question: "Quel est l'intérêt du HEART Pathway ?", answer: "Il permet de doubler le taux de sortie précoce des urgences en toute sécurité (MACE à 30 jours < 0,5%) pour les douleurs thoraciques à bas risque." }
    ],
    lowRisk: "Bas Risque : Sortie Autorisée (MACE à 30 jours < 0,5%)",
    lowRiskDesc: "Score HEART ≤ 3 et troponines négatives sans cinétique. Sortie sécurisée avec consultation cardiologique en ambulatoire sous 72h.",
    highRisk: "Risque Non-Faible : Hospitalisation / Surveillance Continue",
    highRiskDesc: "Critères de sortie non réunis (Score HEART ≥ 4 ou anomalie de la troponine). Hospitalisation en UHCD ou cardiologie pour coronarographie ou coroscanner."
  }
};

export default function HeartPathway({ lang }: { lang: LangCode }) {
  const [history, setHistory] = useState<number>(0);
  const [ecg, setEcg] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [riskFactors, setRiskFactors] = useState<number>(1);
  const [tropBaseline, setTropBaseline] = useState<boolean>(false);
  const [tropDelta, setTropDelta] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const modifiedHeartScore = useMemo(() => {
    return history + ecg + age + riskFactors;
  }, [history, ecg, age, riskFactors]);

  const isLowRisk = useMemo(() => {
    return modifiedHeartScore <= 3 && !tropBaseline && !tropDelta;
  }, [modifiedHeartScore, tropBaseline, tropDelta]);

  useEffect(() => {
    trackCalculatorUsage('heart-pathway', lang, isLowRisk ? 0 : 1);
  }, [isLowRisk, lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/heart-pathway"
        scoringSystem="HEART Pathway Protocol"
        howToSteps={[
          lang === 'fr' ? 'Évaluer les 4 critères cliniques du score HEART (Histoire, ECG, Âge, Facteurs de risque).' : 'Score the 4 clinical components of HEART (History, ECG, Age, Risk factors).',
          lang === 'fr' ? 'Vérifier la négativité de la troponine initiale et l\'absence de delta troponine à H1-H3.' : 'Confirm baseline troponin is normal and delta troponin at 1-3 hours is negative.',
          lang === 'fr' ? 'Un score ≤ 3 sans élévation de troponine permet la sortie précoce (< 0,5% de MACE).' : 'Score <= 3 with negative serial troponins qualifies for safe early discharge.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <Heart className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Médecine d\'Urgence & Cardiologie' : 'Emergency Medicine & Cardiology'}</span>
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
            {/* History */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.hTitle}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pts: 0, label: currentText.hSlight },
                  { pts: 1, label: currentText.hMod },
                  { pts: 2, label: currentText.hHigh }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setHistory(tier.pts)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      history === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ECG */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.eTitle}</label>
              <div className="space-y-2">
                {[
                  { pts: 0, label: currentText.eNorm },
                  { pts: 1, label: currentText.eNonSpec },
                  { pts: 2, label: currentText.eStDep }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setEcg(tier.pts)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      ecg === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.aTitle}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pts: 0, label: currentText.aUnder45 },
                  { pts: 1, label: currentText.a45to64 },
                  { pts: 2, label: currentText.a65plus }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setAge(tier.pts)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      age === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.rTitle}</label>
              <div className="space-y-2">
                {[
                  { pts: 0, label: currentText.rNone },
                  { pts: 1, label: currentText.r1to2 },
                  { pts: 2, label: currentText.r3plus }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setRiskFactors(tier.pts)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      riskFactors === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Serial Troponin */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-purple-700 block">
                {currentText.tropTitle}
              </label>

              <button
                type="button"
                onClick={() => setTropBaseline(!tropBaseline)}
                className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  tropBaseline ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <span>{currentText.tropBaselineElevated}</span>
                <span className="font-bold">{tropBaseline ? currentText.yes : currentText.no}</span>
              </button>

              <button
                type="button"
                onClick={() => setTropDelta(!tropDelta)}
                className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs font-medium transition-all ${
                  tropDelta ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                <span>{currentText.tropDeltaPositive}</span>
                <span className="font-bold">{tropDelta ? currentText.yes : currentText.no}</span>
              </button>
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
              
              <div className="flex items-baseline gap-3">
                <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                  isLowRisk ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isLowRisk
                    ? (lang === 'fr' ? 'Sortie Autorisée' : 'Early Discharge')
                    : (lang === 'fr' ? 'Hospitalisation / Surveillance' : 'Observation / Admission')}
                </span>
              </div>

              <div className="text-xs text-gray-300 py-1 border-y border-white/10">
                <span className="text-gray-400">Modified HEART Score:</span>{' '}
                <span className="font-bold text-white text-base">{modifiedHeartScore} / 8 points</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                isLowRisk ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {isLowRisk ? currentText.lowRisk : currentText.highRisk}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {isLowRisk ? currentText.lowRiskDesc : currentText.highRiskDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Modified HEART Score", value: `${modifiedHeartScore} pts` },
                  { label: "Baseline Troponin", value: tropBaseline ? "Elevated (>99th percentile)" : "Normal" },
                  { label: "Delta Troponin (0-3h)", value: tropDelta ? "Significant Delta (+)" : "Negative Delta (-)" }
                ]}
                results={[
                  { label: "HEART Pathway Decision", value: isLowRisk ? "Low Risk: Safe for Early Discharge" : "Non-Low Risk: Inpatient/Observation Admission" },
                  { label: "30-Day MACE Risk", value: isLowRisk ? "< 0.5%" : "Elevated (Warrants Monitoring)" }
                ]}
                formula="HEART Pathway Accelerated Diagnostic Protocol (Circulation 2015)"
                disclaimer="Low-risk patients (HEART <= 3 and negative serial troponins) have < 0.5% 30-day MACE."
                references="Mahler SA, et al. Circ Cardiovasc Qual Outcomes. 2015;8(2):195-203."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/25737484/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Mahler SA et al. (2015) Circ Cardiovasc Qual Outcomes <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
