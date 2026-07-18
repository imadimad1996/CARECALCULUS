import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const criteriaList = [
  { id: 'nausea', max: 7, title: { en: 'Nausea and Vomiting', fr: 'Nausées et Vomissements' } },
  { id: 'tremor', max: 7, title: { en: 'Tremor', fr: 'Tremblements' } },
  { id: 'sweats', max: 7, title: { en: 'Paroxysmal Sweats', fr: 'Sueurs Paroxystiques' } },
  { id: 'anxiety', max: 7, title: { en: 'Anxiety', fr: 'Anxiété' } },
  { id: 'agitation', max: 7, title: { en: 'Agitation', fr: 'Agitation' } },
  { id: 'tactile', max: 7, title: { en: 'Tactile Disturbances', fr: 'Troubles Tactiles' } },
  { id: 'auditory', max: 7, title: { en: 'Auditory Disturbances', fr: 'Troubles Auditifs' } },
  { id: 'visual', max: 7, title: { en: 'Visual Disturbances', fr: 'Troubles Visuels' } },
  { id: 'headache', max: 7, title: { en: 'Headache', fr: 'Céphalées' } },
  { id: 'orientation', max: 4, title: { en: 'Orientation and Clouding of Sensorium', fr: 'Orientation et Obnubilation' } }
];

const translations: Translations = {
  en: {
    title: "CIWA-Ar Score (Alcohol Withdrawal)",
    subtitle: "Clinical Institute Withdrawal Assessment for Alcohol, revised",
    resultTitle: "Total Score",
    scoreLabel: "CIWA-Ar Score",
    pts: "points",
    clinicalTitle: "Clinical Context",
    clinicalText: "The CIWA-Ar is a validated 10-item assessment tool used to quantify the severity of alcohol withdrawal syndrome and guide symptom-triggered therapy.",
    pearls: [
      "Symptom-triggered therapy (treating only when CIWA-Ar ≥ 8-10) reduces total benzodiazepine dose and length of stay compared to fixed-schedule dosing.",
      "The maximum possible score is 67.",
      "Assessments should be performed every 1-2 hours initially for severe withdrawal, and every 4-8 hours for mild withdrawal."
    ],
    pitfalls: [
      "Do NOT use the CIWA-Ar score if the patient is unable to communicate (e.g., intubated, severe delirium, dementia); use the RASS or Richmond Agitation-Sedation Scale instead.",
      "Other medical conditions (sepsis, thyrotoxicosis, head trauma) can mimic alcohol withdrawal symptoms, leading to a falsely elevated CIWA-Ar score."
    ],
    evidence: "Scores < 8-10: Mild withdrawal. Scores 10-15: Moderate withdrawal. Scores > 15: Severe withdrawal, increased risk of seizures and delirium tremens.",
    references: "Sullivan JT, et al. Assessment of alcohol withdrawal: the revised clinical institute withdrawal assessment for alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-7."
  },
  fr: {
    title: "Score CIWA-Ar (Sevrage Alcoolique)",
    subtitle: "Évaluation du syndrome de sevrage alcoolique pour guider le traitement",
    resultTitle: "Score Total",
    scoreLabel: "Score CIWA-Ar",
    pts: "points",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "Le CIWA-Ar est un outil validé de 10 items utilisé pour quantifier la sévérité du syndrome de sevrage alcoolique et guider le traitement en fonction des symptômes.",
    pearls: [
      "Le traitement guidé par les symptômes (traitement uniquement si CIWA-Ar ≥ 8-10) réduit la dose totale de benzodiazépines et la durée de séjour.",
      "Le score maximum possible est de 67.",
      "Les évaluations doivent être effectuées toutes les 1 à 2 heures au début pour un sevrage sévère, et toutes les 4 à 8 heures pour un sevrage léger."
    ],
    pitfalls: [
      "NE PAS utiliser le score CIWA-Ar si le patient est incapable de communiquer (ex: intubé, délire sévère) ; utiliser plutôt l'échelle RASS.",
      "D'autres affections médicales (septicémie, traumatisme crânien) peuvent imiter les symptômes du sevrage, faussant le score à la hausse."
    ],
    evidence: "Scores < 8-10 : Sevrage léger. Scores 10-15 : Sevrage modéré. Scores > 15 : Sevrage sévère, risque accru de crises et de delirium tremens.",
    references: "Sullivan JT, et al. Assessment of alcohol withdrawal: the revised clinical institute withdrawal assessment for alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-7."
  }
};

export default function CiwaArScore({ lang }: { lang: LangCode }) {
  const [scores, setScores] = useState<Record<string, number>>({});
  
  const currentText = translations[lang] || translations.en;

  const handleScoreChange = (id: string, val: number) => {
    setScores(prev => ({ ...prev, [id]: val }));
  };

  const totalScore = useMemo(() => {
    return criteriaList.reduce((acc, curr) => acc + (scores[curr.id] || 0), 0);
  }, [scores]);

  const allFilled = criteriaList.every(c => scores[c.id] !== undefined);

  const interpretation = useMemo(() => {
    if (totalScore < 10) return { label: lang === 'fr' ? 'Sevrage Léger' : 'Mild Withdrawal', color: 'text-emerald-600 bg-emerald-500/10' };
    if (totalScore <= 15) return { label: lang === 'fr' ? 'Sevrage Modéré' : 'Moderate Withdrawal', color: 'text-amber-600 bg-amber-500/10' };
    return { label: lang === 'fr' ? 'Sevrage Sévère' : 'Severe Withdrawal', color: 'text-red-600 bg-red-500/10' };
  }, [totalScore, lang]);

  useEffect(() => {
    if (allFilled && totalScore > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('ciwa-ar', lang, totalScore);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allFilled, totalScore, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}ciwa-ar`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}ciwa-ar`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}ciwa-ar`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Psychiatry"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-500/5 via-fuchsia-500/5 to-indigo-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Activity className="w-3.5 h-3.5" />
          <span>Psychiatry / Emergency</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="ciwa-ar" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {criteriaList.map((criteria, index) => (
            <div key={criteria.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 mb-3">
                {index + 1}. {criteria.title[lang as keyof typeof criteria.title] || criteria.title.en} <span className="text-slate-400 font-normal text-xs ml-1">(0-{criteria.max})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: criteria.max + 1 }, (_, i) => i).map((num) => (
                  <button
                    key={num}
                    onClick={() => handleScoreChange(criteria.id, num)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      scores[criteria.id] === num
                        ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-600 ring-offset-2'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-5 rounded-2xl border text-purple-800 bg-purple-500/10 border-purple-500/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-sm font-bold opacity-80 mb-1">{currentText.scoreLabel as string}</div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-extrabold tracking-tight">{totalScore}</span>
                  <span className="text-lg font-semibold opacity-80">{currentText.pts as string}</span>
                </div>
                
                {allFilled && (
                  <>
                    <div className="h-px w-full bg-purple-500/20 my-3"></div>
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-block border ${interpretation.color}`}>
                      {interpretation.label}
                    </div>
                  </>
                )}
                {!allFilled && (
                  <div className="text-xs text-purple-600/70 mt-2 font-medium">
                    {lang === 'fr' ? 'Remplissez tous les critères' : 'Complete all criteria'}
                  </div>
                )}
              </div>

              {allFilled && (
                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={criteriaList.map(c => ({
                    label: c.title[lang as keyof typeof c.title] || c.title.en,
                    value: scores[c.id]?.toString() || '0'
                  }))}
                  results={[
                    { label: currentText.scoreLabel as string, value: `${totalScore} (${interpretation.label})` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <ClinicalContextPanel
        lang={lang}
        pearls={currentText.pearls as string[]}
        pitfalls={currentText.pitfalls as string[]}
        evidence={currentText.evidence as string}
        references={[currentText.references as string]}
      />
    </>
  );
}
