import React, { useState, useMemo, useEffect } from 'react';
import { Wind, Activity, AlertTriangle, CheckSquare, Square, CheckCircle2, Circle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Revised Geneva Score",
    subtitle: "Calculates the probability of Pulmonary Embolism (PE)",
    hrCategory: "Heart Rate (bpm)",
    hrOptions: [
      { value: 0, label: "< 75" },
      { value: 3, label: "75 - 94" },
      { value: 5, label: "≥ 95" }
    ],
    criteria: [
      { id: 'age', label: 'Age > 65 years', points: 1 },
      { id: 'hx', label: 'Previous DVT or PE', points: 3 },
      { id: 'surg', label: 'Surgery or fracture within 1 month', points: 2 },
      { id: 'malig', label: 'Active malignancy (solid or hematologic, currently active or cured <1 year)', points: 2 },
      { id: 'pain', label: 'Unilateral lower limb pain', points: 3 },
      { id: 'hemoptysis', label: 'Hemoptysis', points: 2 },
      { id: 'dvt_signs', label: 'Pain on deep palpation of lower limb and unilateral edema', points: 4 }
    ],
    resultTitle: "Geneva Score",
    riskTitle: "Clinical Probability of PE",
    clinicalTitle: "Clinical Context",
    pearls: [
      "The Revised Geneva Score relies completely on objective clinical findings, unlike the Wells score which includes the subjective 'PE is #1 diagnosis' criterion.",
      "Patients with a 'Low' or 'Intermediate' probability can safely have PE ruled out with a negative highly-sensitive D-dimer.",
      "Patients with 'High' probability should proceed directly to imaging (CTPA or V/Q scan) regardless of D-dimer results."
    ],
    pitfalls: [
      "Do NOT use this score if the patient is already on therapeutic anticoagulation.",
      "Active malignancy means currently receiving treatment, palliative care, or diagnosed within the last 6 months."
    ],
    evidence: "Risk Strata (Original 3-tier): Low 0-3 points (8%), Intermediate 4-10 points (28%), High ≥ 11 points (74%).",
    references: "Le Gal G, Righini M, Roy PM, et al. Prediction of pulmonary embolism in the emergency department: the revised Geneva score. Ann Intern Med. 2006;144(3):165-71."
  },
  fr: {
    title: "Score de Genève Révisé",
    subtitle: "Calcule la probabilité d'Embolie Pulmonaire (EP)",
    hrCategory: "Fréquence Cardiaque (bpm)",
    hrOptions: [
      { value: 0, label: "< 75" },
      { value: 3, label: "75 - 94" },
      { value: 5, label: "≥ 95" }
    ],
    criteria: [
      { id: 'age', label: 'Âge > 65 ans', points: 1 },
      { id: 'hx', label: 'Antécédent de TVP ou d\'EP', points: 3 },
      { id: 'surg', label: 'Chirurgie ou fracture dans le mois précédent', points: 2 },
      { id: 'malig', label: 'Cancer actif (solide ou hématologique, actif ou guéri < 1 an)', points: 2 },
      { id: 'pain', label: 'Douleur unilatérale du membre inférieur', points: 3 },
      { id: 'hemoptysis', label: 'Hémoptysie', points: 2 },
      { id: 'dvt_signs', label: 'Douleur à la palpation profonde du membre inférieur et œdème unilatéral', points: 4 }
    ],
    resultTitle: "Score de Genève",
    riskTitle: "Probabilité Clinique d'EP",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le Score de Genève révisé repose entièrement sur des critères objectifs, contrairement au score de Wells.",
      "Une probabilité 'Faible' ou 'Intermédiaire' permet d'exclure l'EP avec des D-dimères très sensibles négatifs.",
      "Une probabilité 'Forte' nécessite une imagerie directe (Angioscanner ou Scintigraphie) sans dosage des D-dimères."
    ],
    pitfalls: [
      "NE PAS utiliser ce score si le patient est déjà sous anticoagulation à dose curative.",
      "Un cancer actif signifie un traitement en cours, des soins palliatifs ou un diagnostic dans les 6 derniers mois."
    ],
    evidence: "Risque (3 niveaux) : Faible 0-3 points (8%), Intermédiaire 4-10 points (28%), Fort ≥ 11 points (74%).",
    references: "Le Gal G, Righini M, Roy PM, et al. Prediction of pulmonary embolism in the emergency department: the revised Geneva score. Ann Intern Med. 2006;144(3):165-71."
  }
};

export default function GenevaScore({ lang }: { lang: LangCode }) {
  const [hr, setHr] = useState<number>(-1);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const currentText = translations[lang] || translations.en;
  const criteria = currentText.criteria as {id: string, label: string, points: number}[];
  
  const toggleCheck = (id: string) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const score = useMemo(() => {
    if (hr === -1) return null;
    let total = hr;
    criteria.forEach(c => {
      if (checks[c.id]) total += c.points;
    });
    return total;
  }, [hr, checks, criteria]);

  const riskAssessment = useMemo(() => {
    if (score === null) return null;
    if (score <= 3) return { risk: lang === 'fr' ? 'Faible probabilité' : 'Low probability', percent: '8%' };
    if (score <= 10) return { risk: lang === 'fr' ? 'Probabilité intermédiaire' : 'Intermediate probability', percent: '28%' };
    return { risk: lang === 'fr' ? 'Forte probabilité' : 'High probability', percent: '74%' };
  }, [score, lang]);

  useEffect(() => {
    if (score !== null) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('geneva-score', lang, score);
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
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}geneva-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}geneva-score`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}geneva-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Pulmonology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-500/5 via-blue-500/5 to-indigo-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Wind className="w-3.5 h-3.5" />
          <span>Pulmonology / Emergency</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="geneva-score" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-6">
              
              {/* HR Radio Group */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-800">{currentText.hrCategory as string}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(currentText.hrOptions as any[]).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setHr(opt.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                        hr === opt.value
                          ? 'border-sky-500 bg-sky-50/50 text-sky-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`shrink-0 ${hr === opt.value ? 'text-sky-500' : 'text-slate-400'}`}>
                        {hr === opt.value ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <span className="font-semibold text-sm">{opt.label}</span>
                      <span className={`text-xs font-bold ${hr === opt.value ? 'text-sky-600' : 'text-slate-400'}`}>+{opt.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Checkboxes */}
              <div className="space-y-3">
                {criteria.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCheck(c.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      checks[c.id]
                        ? 'border-sky-500 bg-sky-50/50 text-sky-900' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`shrink-0 ${checks[c.id] ? 'text-sky-500' : 'text-slate-400'}`}>
                      {checks[c.id] ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold text-sm">{c.label}</span>
                    </div>
                    <div className={`font-bold ${checks[c.id] ? 'text-sky-600' : 'text-slate-400'}`}>
                      +{c.points}
                    </div>
                  </button>
                ))}
              </div>
              
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
                  score >= 11 ? 'bg-red-50 border-red-200 text-red-900' :
                  score >= 4 ? 'bg-amber-50 border-amber-200 text-amber-900' :
                  'bg-green-50 border-green-200 text-green-900'
                }`}>
                  <div className="flex items-baseline gap-2 mb-4 justify-center">
                    <span className="text-6xl font-extrabold tracking-tight">{score}</span>
                    <span className="text-xl font-semibold opacity-80">pts</span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentText.riskTitle as string}</div>
                    <div className="text-xl font-black">{riskAssessment.risk}</div>
                    <div className="mt-1 text-lg font-bold opacity-80">{riskAssessment.percent}</div>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.hrCategory as string, value: hr === 0 ? '< 75' : hr === 3 ? '75-94' : '≥ 95' },
                    ...criteria.map(c => ({
                      label: c.label,
                      value: checks[c.id] ? `Yes (+${c.points})` : 'No'
                    }))
                  ]}
                  results={[
                    { label: currentText.resultTitle as string, value: `${score} pts` },
                    { label: currentText.riskTitle as string, value: `${riskAssessment.risk} (${riskAssessment.percent})` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Sélectionnez la fréquence cardiaque" : "Select heart rate to calculate"}
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
