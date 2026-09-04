import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Pill } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Lille Model for Alcoholic Hepatitis",
    subtitle: "Evaluates 7-day corticosteroid response and 6-month mortality in severe acute alcoholic hepatitis",
    age: "Age (years)",
    albumin: "Albumin (g/L)",
    biliDay0: "Day 0 Total Bilirubin",
    biliDay7: "Day 7 Total Bilirubin",
    biliUnit: "Bilirubin Unit",
    renalFailure: "Renal Impairment (Creatinine > 1.3 mg/dL [115 µmol/L])",
    ptElongation: "PT Prolongation (Patient PT − Control PT) [sec]",
    yes: "Yes",
    no: "No",
    result: "Calculated Lille Score",
    riskCategory: "Therapeutic Response & Prognosis",
    formula: "Lille = exp(-R) / (1 + exp(-R)), where R = 3.19 - (0.101 × Age) + (0.147 × Albumin) + (0.0165 × ΔBili) - (0.206 × Renal) - (0.0065 × Bili0) - (0.0096 × PT diff)",
    references: "Louvet A, Naveau S, Abdelnour M, et al. The Lille model: a new tool for therapeutic strategy in patients with severe alcoholic hepatitis treated with steroids. Hepatology. 2007;45(6):1348-1354. (PMID: 17518367).",
    faqs: [
      { question: "What is the Lille Model?", answer: "The Lille Model assesses early responsiveness to systemic corticosteroids in patients with severe acute alcoholic hepatitis (Maddrey DF ≥ 32) after 7 days of treatment." },
      { question: "What does a score < 0.45 indicate?", answer: "A Lille score < 0.45 indicates a 'responder' with an expected 6-month survival rate of approximately 85%. Full 28-day corticosteroid therapy should be continued." },
      { question: "What should be done if the score is ≥ 0.45?", answer: "A Lille score ≥ 0.45 indicates 'non-response' with an expected 6-month survival of only ~25%. Steroids should be discontinued immediately to prevent severe infections, and rapid liver transplant evaluation considered." }
    ],
    responder: "Lille Score < 0.45: Responder",
    responderDesc: "Favorable response to corticosteroid therapy. 6-month survival is ~85%. Complete the 28-day course of prednisolone (40 mg/day).",
    nonResponder: "Lille Score ≥ 0.45: Non-Responder",
    nonResponderDesc: "Treatment failure. 6-month mortality is approximately 75%. Corticosteroids should be stopped to avoid severe immunosuppressive complications. Consider evaluation for early liver transplantation."
  },
  fr: {
    title: "Modèle de Lille (Hépatite Alcoolique)",
    subtitle: "Évaluation de la réponse aux corticoïdes à J7 et survie à 6 mois dans l'hépatite alcoolique aiguë sévère",
    age: "Âge (années)",
    albumin: "Albumine (g/L)",
    biliDay0: "Bilirubine Totale à J0",
    biliDay7: "Bilirubine Totale à J7",
    biliUnit: "Unité Bilirubine",
    renalFailure: "Insuffisance rénale (Créatinine > 115 µmol/L [1,3 mg/dL])",
    ptElongation: "Allongement du TP (TP Patient − TP Témoin) [sec]",
    yes: "Oui",
    no: "Non",
    result: "Score de Lille Calculé",
    riskCategory: "Réponse Thérapeutique et Pronostic",
    formula: "Lille = exp(-R) / (1 + exp(-R))",
    references: "Louvet A, et al. Hepatology. 2007;45(6):1348-1354. (PMID: 17518367).",
    faqs: [
      { question: "Quel est l'objectif du modèle de Lille ?", answer: "Il permet de déterminer à J7 de la corticothérapie si le patient atteint d'hépatite alcoolique aiguë sévère (Maddrey ≥ 32) répond au traitement." },
      { question: "Quelle est la signification du seuil de 0,45 ?", answer: "Un score < 0,45 définit un répondeur (survie à 6 mois ~85%, poursuite des corticoïdes jusqu'à J28). Un score ≥ 0,45 définit un non-répondeur (mortalité à 6 mois ~75%, arrêt des corticoïdes pour limiter le risque infectieux létal)." }
    ],
    responder: "Score < 0,45 : Répondeur aux Corticoïdes",
    responderDesc: "Bonne réponse thérapeutique. Survie à 6 mois estimée à 85%. Poursuivre la corticothérapie (Prednisolone 40 mg/j) jusqu'à J28.",
    nonResponder: "Score ≥ 0,45 : Non-Répondeur (Arrêt des Corticoïdes)",
    nonResponderDesc: "Échec du traitement. Survie à 6 mois d'environ 25%. Arrêt recommandé de la corticothérapie pour éviter les complications infectieuses; évaluer l'indication d'une greffe hépatique précoce."
  }
};

export default function LilleModel({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>(52);
  const [albumin, setAlbumin] = useState<number | ''>(28);
  const [biliUnit, setBiliUnit] = useState<'mgdl' | 'umol'>('mgdl');
  const [biliDay0, setBiliDay0] = useState<number | ''>(18);
  const [biliDay7, setBiliDay7] = useState<number | ''>(12);
  const [renalFailure, setRenalFailure] = useState<boolean>(false);
  const [ptElongation, setPtElongation] = useState<number | ''>(8);

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (age === '' || albumin === '' || biliDay0 === '' || biliDay7 === '' || ptElongation === '') return null;
    
    // Bilirubin in µmol/L for Lille formula
    const b0 = biliUnit === 'mgdl' ? Number(biliDay0) * 17.1 : Number(biliDay0);
    const b7 = biliUnit === 'mgdl' ? Number(biliDay7) * 17.1 : Number(biliDay7);
    const deltaBili = b0 - b7;
    const alb = Number(albumin); // g/L
    const renal = renalFailure ? 1 : 0;
    const ptDiff = Number(ptElongation);

    const R = 3.19 
      - (0.101 * Number(age)) 
      + (0.147 * alb) 
      + (0.0165 * deltaBili) 
      - (0.206 * renal) 
      - (0.0065 * b0) 
      - (0.0096 * ptDiff);

    const score = Math.exp(-R) / (1 + Math.exp(-R));
    return Math.min(Math.max(score, 0), 1);
  }, [age, albumin, biliDay0, biliDay7, biliUnit, renalFailure, ptElongation]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('lille-model', lang, result);
    }
  }, [result, lang]);

  const isResponder = result !== null && result < 0.45;

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/lille-model"
        scoringSystem="Lille Model for Alcoholic Hepatitis"
        howToSteps={[
          lang === 'fr' ? 'Renseigner l\'âge du patient et l\'albumine en g/L.' : 'Enter patient age and serum albumin in g/L.',
          lang === 'fr' ? 'Renseigner la bilirubine à J0 (début des corticoïdes) et à J7.' : 'Enter baseline Day 0 and Day 7 total bilirubin.',
          lang === 'fr' ? 'Indiquer l\'insuffisance rénale et l\'allongement du TP.' : 'Specify renal insufficiency status and prothrombin time elongation in seconds.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
          <Pill className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Hépatologie & Réanimation' : 'Hepatology & Critical Care'}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.age}</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.albumin}</label>
                <input
                  type="number" step="0.1"
                  value={albumin}
                  onChange={(e) => setAlbumin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bilirubin Section */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{currentText.biliUnit}</span>
                <div className="flex text-xs bg-gray-200 p-0.5 rounded-lg">
                  <button
                    onClick={() => setBiliUnit('mgdl')}
                    className={`px-2 py-0.5 rounded font-semibold ${biliUnit === 'mgdl' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    mg/dL
                  </button>
                  <button
                    onClick={() => setBiliUnit('umol')}
                    className={`px-2 py-0.5 rounded font-semibold ${biliUnit === 'umol' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    µmol/L
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{currentText.biliDay0}</label>
                  <input
                    type="number" step="0.1"
                    value={biliDay0}
                    onChange={(e) => setBiliDay0(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{currentText.biliDay7}</label>
                  <input
                    type="number" step="0.1"
                    value={biliDay7}
                    onChange={(e) => setBiliDay7(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* PT diff and Renal failure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.ptElongation}</label>
                <input
                  type="number" step="0.1"
                  value={ptElongation}
                  onChange={(e) => setPtElongation(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.renalFailure}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRenalFailure(false)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      !renalFailure
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {currentText.no}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRenalFailure(true)}
                    className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                      renalFailure
                        ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {currentText.yes}
                  </button>
                </div>
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
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${isResponder ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result !== null ? result.toFixed(3) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">score</span>
              </div>

              {result !== null && (
                <div className={`p-4 rounded-xl border ${isResponder ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                  <div className="font-bold text-sm mb-1">{isResponder ? currentText.responder : currentText.nonResponder}</div>
                  <p className="text-xs leading-relaxed opacity-90">{isResponder ? currentText.responderDesc : currentText.nonResponderDesc}</p>
                </div>
              )}

              {result !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Age", value: `${age} yrs` },
                    { label: "Albumin", value: `${albumin} g/L` },
                    { label: "Day 0 Bilirubin", value: `${biliDay0} ${biliUnit}` },
                    { label: "Day 7 Bilirubin", value: `${biliDay7} ${biliUnit}` },
                    { label: "Renal Impairment", value: renalFailure ? "Yes" : "No" },
                    { label: "PT Prolongation", value: `${ptElongation} sec` }
                  ]}
                  results={[
                    { label: "Lille Score", value: result.toFixed(3) },
                    { label: "Response", value: isResponder ? "Responder (<0.45)" : "Non-Responder (≥0.45)" },
                    { label: "Recommendation", value: isResponder ? "Continue Steroids to Day 28" : "Discontinue Steroids (High Sepsis Risk)" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="Score < 0.45 indicates favorable response; score >= 0.45 indicates non-response with ~75% 6-month mortality."
                  references="Louvet A, et al. Hepatology. 2007;45(6):1348-1354."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-amber-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/17518367/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Louvet A et al. (2007) Hepatology <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
