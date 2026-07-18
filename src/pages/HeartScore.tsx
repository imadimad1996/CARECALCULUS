import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Activity, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "HEART Score for Major Cardiac Events",
    subtitle: "Predicts 6-week risk of MACE in ED patients with chest pain",
    categories: [
      {
        id: 'history',
        title: 'History',
        options: [
          { value: 2, label: 'Highly suspicious' },
          { value: 1, label: 'Moderately suspicious' },
          { value: 0, label: 'Slightly or non-suspicious' }
        ]
      },
      {
        id: 'ecg',
        title: 'ECG',
        options: [
          { value: 2, label: 'Significant ST depression' },
          { value: 1, label: 'Nonspecific repolarization disturbance' },
          { value: 0, label: 'Normal' }
        ]
      },
      {
        id: 'age',
        title: 'Age',
        options: [
          { value: 2, label: '≥ 65 years' },
          { value: 1, label: '45-64 years' },
          { value: 0, label: '≤ 45 years' }
        ]
      },
      {
        id: 'risk',
        title: 'Risk Factors',
        desc: 'HTN, hypercholesterolemia, DM, obesity (BMI > 30), smoking, positive family hx',
        options: [
          { value: 2, label: '≥ 3 risk factors or hx of atherosclerotic disease' },
          { value: 1, label: '1 or 2 risk factors' },
          { value: 0, label: 'No risk factors known' }
        ]
      },
      {
        id: 'troponin',
        title: 'Troponin',
        options: [
          { value: 2, label: '≥ 3x normal limit' },
          { value: 1, label: '1-3x normal limit' },
          { value: 0, label: '≤ normal limit' }
        ]
      }
    ],
    resultTitle: "HEART Score",
    riskTitle: "6-Week MACE Risk",
    clinicalTitle: "Clinical Context",
    pearls: [
      "The HEART score is designed for ED patients presenting with chest pain to identify those safe for early discharge.",
      "MACE includes: all-cause mortality, myocardial infarction, or need for coronary revascularization.",
      "A score of 0-3 generally indicates a low risk (0.9-1.7%) and supports early discharge."
    ],
    pitfalls: [
      "Do NOT use the HEART score if the patient already has definite ECG changes indicating a STEMI or obvious life-threatening ischemia.",
      "Subjective elements like 'History' require clinical gestalt. Be cautious not to downplay atypical symptoms in women or diabetics."
    ],
    evidence: "Risk Strata: 0-3 points (0.9-1.7% MACE, discharge), 4-6 points (12-16.6% MACE, observe/admit), 7-10 points (50-65% MACE, early invasive).",
    references: "Six AJ, Backus BE, Kelder JC. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008;16(6):191-6."
  },
  fr: {
    title: "Score HEART (Risque Cardiaque)",
    subtitle: "Prédit le risque de MACE à 6 semaines aux urgences",
    categories: [
      {
        id: 'history',
        title: 'Histoire',
        options: [
          { value: 2, label: 'Hautement suspecte' },
          { value: 1, label: 'Modérément suspecte' },
          { value: 0, label: 'Légèrement ou non suspecte' }
        ]
      },
      {
        id: 'ecg',
        title: 'ECG',
        options: [
          { value: 2, label: 'Dépression ST significative' },
          { value: 1, label: 'Trouble de repolarisation non spécifique' },
          { value: 0, label: 'Normal' }
        ]
      },
      {
        id: 'age',
        title: 'Âge',
        options: [
          { value: 2, label: '≥ 65 ans' },
          { value: 1, label: '45-64 ans' },
          { value: 0, label: '≤ 45 ans' }
        ]
      },
      {
        id: 'risk',
        title: 'Facteurs de Risque',
        desc: 'HTA, hypercholestérolémie, DT, obésité, tabac, antécédents familiaux',
        options: [
          { value: 2, label: '≥ 3 facteurs ou antécédents de maladie athéroscléreuse' },
          { value: 1, label: '1 ou 2 facteurs de risque' },
          { value: 0, label: 'Aucun facteur de risque connu' }
        ]
      },
      {
        id: 'troponin',
        title: 'Troponine',
        options: [
          { value: 2, label: '≥ 3x la limite normale' },
          { value: 1, label: '1-3x la limite normale' },
          { value: 0, label: '≤ limite normale' }
        ]
      }
    ],
    resultTitle: "Score HEART",
    riskTitle: "Risque de MACE (6 semaines)",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le score HEART est conçu pour identifier les patients pouvant sortir précocement des urgences en toute sécurité.",
      "Un score de 0-3 indique généralement un faible risque (0.9-1.7%) et soutient une sortie précoce."
    ],
    pitfalls: [
      "NE PAS utiliser le score HEART si le patient présente déjà un STEMI évident à l'ECG.",
      "Soyez prudent de ne pas minimiser les symptômes atypiques chez les femmes ou les diabétiques."
    ],
    evidence: "0-3 points (0.9-1.7%, sortie), 4-6 points (12-16.6%, observation), 7-10 points (50-65%, stratégie invasive précoce).",
    references: "Six AJ, Backus BE, Kelder JC. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008;16(6):191-6."
  }
};

export default function HeartScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, number>>({
    history: -1,
    ecg: -1,
    age: -1,
    risk: -1,
    troponin: -1
  });

  const currentText = translations[lang] || translations.en;
  const categories = currentText.categories as any[];
  
  const score = useMemo(() => {
    let total = 0;
    for (const key in selections) {
      if (selections[key] === -1) return null;
      total += selections[key];
    }
    return total;
  }, [selections]);

  const riskAssessment = useMemo(() => {
    if (score === null) return null;
    if (score <= 3) return { risk: '0.9 - 1.7%', action: lang === 'fr' ? 'Sortie précoce envisageable' : 'Discharge' };
    if (score <= 6) return { risk: '12 - 16.6%', action: lang === 'fr' ? 'Observation clinique' : 'Observe / Admit' };
    return { risk: '50 - 65%', action: lang === 'fr' ? 'Stratégie invasive précoce' : 'Early invasive strategies' };
  }, [score, lang]);

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('heart-score', lang, score);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [score, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heart-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heart-score`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}heart-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Emergency Medicine"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-red-500/5 via-rose-500/5 to-pink-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100/50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Emergency Medicine / Cardiology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="heart-score" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-8">
              {categories.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{cat.title}</h3>
                    {cat.desc && <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>}
                  </div>
                  <div className="space-y-2">
                    {cat.options.map((opt: any) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelections({ ...selections, [cat.id]: opt.value })}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                          selections[cat.id] === opt.value
                            ? 'border-red-500 bg-red-50/50 text-red-900'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`shrink-0 ${selections[cat.id] === opt.value ? 'text-red-500' : 'text-slate-400'}`}>
                          {selections[cat.id] === opt.value ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 font-medium text-sm">{opt.label}</div>
                        <div className={`font-bold ${selections[cat.id] === opt.value ? 'text-red-600' : 'text-slate-400'}`}>
                          +{opt.value}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {score !== null && riskAssessment ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-5 rounded-2xl border relative overflow-hidden group ${
                  score >= 7 ? 'bg-red-50 border-red-200 text-red-900' :
                  score >= 4 ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-green-50 border-green-200 text-green-900'
                }`}>
                  <div className="flex items-baseline gap-2 mb-4 justify-center">
                    <span className="text-6xl font-extrabold tracking-tight">{score}</span>
                    <span className="text-xl font-semibold opacity-80">/ 10</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentText.riskTitle as string}</div>
                    <div className="text-3xl font-black">{riskAssessment.risk}</div>
                    <div className="mt-2 text-sm font-bold opacity-80">{riskAssessment.action}</div>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={categories.map(c => ({
                    label: c.title,
                    value: c.options.find((o: any) => o.value === selections[c.id])?.label || 'Not selected'
                  }))}
                  results={[
                    { label: currentText.resultTitle as string, value: `${score}/10` },
                    { label: currentText.riskTitle as string, value: riskAssessment.risk }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Sélectionnez toutes les catégories pour calculer le score" : "Select all categories to calculate score"}
              </div>
            )}
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
