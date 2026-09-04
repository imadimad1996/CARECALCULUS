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
    title: "Maddrey's Discriminant Function (MDF)",
    subtitle: "Guides corticosteroid therapy and predicts 30-day mortality in severe alcoholic hepatitis",
    patientPt: "Patient Prothrombin Time (PT) [seconds]",
    controlPt: "Control Prothrombin Time (PT) [seconds]",
    biliUnit: "Bilirubin Unit",
    bilirubin: "Total Bilirubin",
    result: "Calculated Maddrey's DF",
    formula: "MDF = 4.6 × [Patient PT − Control PT] + Total Bilirubin (mg/dL)",
    clinicalTitle: "Corticosteroid Indication & 30-Day Prognosis",
    references: "Maddrey WC, Boitnott JK, Bedine MS, Weber FL Jr, Mezey E, White RI Jr. Corticosteroid therapy of alcoholic hepatitis. Gastroenterology. 1978;75(2):193-199. (PMID: 352788). EASL Clinical Practice Guidelines: Management of alcohol-related liver disease. J Hepatol. 2018;69(1):154-181.",
    faqs: [
      { question: "What is Maddrey's Discriminant Function?", answer: "Maddrey's Discriminant Function (DF) is a validated prognostic score calculating disease severity in acute alcohol-associated hepatitis based on prothrombin time prolongation and total serum bilirubin." },
      { question: "What is the clinical significance of DF ≥ 32?", answer: "A score of ≥ 32 defines 'severe' alcoholic hepatitis with a 30-day mortality approaching 35–50% without medical intervention. AASLD and EASL guidelines recommend initiating systemic corticosteroid therapy (oral prednisolone 40 mg/day for 28 days) in eligible patients without active sepsis or gastrointestinal bleeding." },
      { question: "What should be done after starting steroids?", answer: "Patients initiated on prednisolone must be re-evaluated on Day 7 using the Lille Model to determine treatment responsiveness. Non-responders (Lille score ≥ 0.45) should discontinue steroids to avoid opportunistic infections." }
    ],
    lowRisk: "MDF < 32: Non-Severe Alcoholic Hepatitis",
    lowDesc: "30-day mortality is low (<10%). Corticosteroid therapy is NOT indicated. Focus on alcohol cessation, aggressive nutritional support, and alcohol withdrawal management.",
    highRisk: "MDF ≥ 32: Severe Alcoholic Hepatitis (Steroids Indicated)",
    highDesc: "30-day mortality without treatment is 35–50%. Systemic corticosteroids (Prednisolone 40 mg PO daily for 28 days) are recommended if no contraindications (active infection, GI hemorrhage, or renal failure). Re-evaluate with Lille score at Day 7."
  },
  fr: {
    title: "Score de Maddrey (Hépatite Alcoolique)",
    subtitle: "Indication de la corticothérapie et mortalité à 30 jours dans l'hépatite alcoolique aiguë",
    patientPt: "Temps de Prothrombine (TP) Patient [secondes]",
    controlPt: "Temps de Prothrombine (TP) Témoin [secondes]",
    biliUnit: "Unité Bilirubine",
    bilirubin: "Bilirubine Totale",
    result: "Score de Maddrey Calculé",
    formula: "Score = 4,6 × [TP Patient − TP Témoin] + Bilirubine Totale (mg/dL)",
    clinicalTitle: "Indication de Corticothérapie et Pronostic à 30 Jours",
    references: "Maddrey WC, et al. Gastroenterology. 1978;75(2):193-199. (PMID: 352788).",
    faqs: [
      { question: "À quoi sert le score de Maddrey ?", answer: "La fonction discriminante de Maddrey évalue la sévérité d'une poussée d'hépatite alcoolique aiguë (HAA) et guide la prescription de corticoïdes." },
      { question: "Quel est le seuil de décision thérapeutique ?", answer: "Un score de Maddrey ≥ 32 définit une HAA sévère avec un risque de mortalité à 30 jours de 35 à 50%. Il pose l'indication d'une corticothérapie par prednisolone (40 mg/jour pendant 28 jours), en l'absence de contre-indication." },
      { question: "Comment évaluer l'efficacité du traitement ?", answer: "L'efficacité de la corticothérapie doit impérativement être évaluée au 7e jour par le score de Lille pour décider de son maintien ou de son arrêt en cas de non-réponse." }
    ],
    lowRisk: "Maddrey < 32 : HAA Non Sévère (Pas de Corticoïdes)",
    lowDesc: "Mortalité à 30 jours < 10%. La corticothérapie n'apporte aucun bénéfice. Prise en charge axée sur le sevrage alcoolique et le support nutritionnel.",
    highRisk: "Maddrey ≥ 32 : HAA Sévère (Corticothérapie Indiquée)",
    highDesc: "Mortalité spontanée de 35 à 50% à 30 jours. Corticothérapie recommandée (Prednisolone 40 mg/j per os) après élimination d'une infection ou hémorragie digestive. Évaluation de la réponse à J7 par le score de Lille."
  }
};

export default function MaddreysDf({ lang }: { lang: LangCode }) {
  const [patientPt, setPatientPt] = useState<number | ''>(24);
  const [controlPt, setControlPt] = useState<number | ''>(12);
  const [biliUnit, setBiliUnit] = useState<'mgdl' | 'umol'>('mgdl');
  const [bilirubin, setBilirubin] = useState<number | ''>(15);

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (patientPt === '' || controlPt === '' || bilirubin === '') return null;
    const ptDiff = Number(patientPt) - Number(controlPt);
    let biliMg = Number(bilirubin);
    if (biliUnit === 'umol') {
      biliMg = biliMg / 17.1;
    }
    const df = 4.6 * ptDiff + biliMg;
    return df;
  }, [patientPt, controlPt, bilirubin, biliUnit]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('maddreys-df', lang, result);
    }
  }, [result, lang]);

  const isSevere = result !== null && result >= 32;

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/maddreys-df"
        scoringSystem="Maddrey's Discriminant Function"
        howToSteps={[
          lang === 'fr' ? 'Mesurer le temps de prothrombine du patient et le TP témoin en secondes.' : 'Input patient and control prothrombin times in seconds.',
          lang === 'fr' ? 'Renseigner la bilirubine totale (mg/dL ou µmol/L).' : 'Enter total bilirubin in mg/dL or µmol/L.',
          lang === 'fr' ? 'Un score ≥ 32 justifie une corticothérapie (Prednisolone 40 mg/j) si pas d\'infection.' : 'Score >= 32 justifies corticosteroid therapy (Prednisolone 40mg/day) in the absence of infection.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
          <Pill className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Hépatologie & Pharmacologie' : 'Hepatology & Pharmacotherapy'}</span>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.patientPt}</label>
                <input
                  type="number" inputMode="decimal" step="0.1"
                  value={patientPt}
                  onChange={(e) => setPatientPt(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.controlPt}</label>
                <input
                  type="number" inputMode="decimal" step="0.1"
                  value={controlPt}
                  onChange={(e) => setControlPt(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">{currentText.bilirubin}</label>
                <div className="flex text-xs bg-gray-100 p-0.5 rounded-lg border border-gray-200">
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
              <input
                type="number" inputMode="decimal" step="0.1"
                value={bilirubin}
                onChange={(e) => setBilirubin(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
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
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${isSevere ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result !== null ? result.toFixed(1) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">points</span>
              </div>

              {result !== null && (
                <div className={`p-4 rounded-xl border ${isSevere ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                  <div className="font-bold text-sm mb-1">{isSevere ? currentText.highRisk : currentText.lowRisk}</div>
                  <p className="text-xs leading-relaxed opacity-90">{isSevere ? currentText.highDesc : currentText.lowDesc}</p>
                </div>
              )}

              {result !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Patient PT", value: `${patientPt} sec` },
                    { label: "Control PT", value: `${controlPt} sec` },
                    { label: "Bilirubin", value: `${bilirubin} ${biliUnit === 'mgdl' ? 'mg/dL' : 'µmol/L'}` }
                  ]}
                  results={[
                    { label: "Maddrey's Discriminant Function", value: result.toFixed(1) },
                    { label: "Severity Stratification", value: isSevere ? "Severe (MDF ≥ 32)" : "Non-Severe (MDF < 32)" },
                    { label: "Corticosteroid Recommendation", value: isSevere ? "Indicated (Prednisolone 40mg/day)" : "Not Indicated" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="Maddrey DF >= 32 defines severe alcoholic hepatitis; Day 7 Lille score evaluation recommended."
                  references="Maddrey WC, et al. Gastroenterology. 1978;75(2):193-199."
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
            <a href="https://pubmed.ncbi.nlm.nih.gov/352788/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Maddrey WC et al. (1978) Gastroenterology <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
