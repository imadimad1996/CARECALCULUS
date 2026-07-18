import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Activity, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "TIMI Risk Score for UA/NSTEMI",
    subtitle: "Estimates mortality, new or recurrent MI, or severe recurrent ischemia at 14 days",
    criteria: [
      "Age ≥ 65 years",
      "≥ 3 CAD risk factors (HTN, hyperlipidemia, DM, smoking, family hx)",
      "Known CAD (stenosis ≥ 50%)",
      "Aspirin use in past 7 days",
      "Severe angina (≥ 2 episodes in 24 hrs)",
      "ECG ST changes ≥ 0.5 mm",
      "Positive cardiac marker (Troponin/CK-MB)"
    ],
    resultTitle: "TIMI Score",
    riskTitle: "14-Day Risk (Death, MI, or Urgent Revascularization)",
    clinicalTitle: "Clinical Context",
    pearls: [
      "The TIMI score helps identify patients who will benefit most from early invasive strategies (angiography) vs. conservative management.",
      "A score of 3 or higher is typically considered an indication for an early invasive strategy.",
      "TIMI is best used alongside other scores like GRACE for a comprehensive risk assessment."
    ],
    pitfalls: [
      "TIMI underestimates risk in certain populations (like women) and lacks the continuous variables found in the GRACE score.",
      "Do NOT use this for STEMI; there is a separate TIMI score for STEMI."
    ],
    evidence: "Risk at 14 days: 0-1 (4.7%), 2 (8.3%), 3 (13.2%), 4 (19.9%), 5 (26.2%), 6-7 (40.9%).",
    references: "Antman EM, et al. The TIMI risk score for unstable angina/non-ST elevation MI: A method for prognostication and therapeutic decision making. JAMA. 2000;284(7):835-42."
  },
  fr: {
    title: "Score TIMI (Angor Instable / NSTEMI)",
    subtitle: "Estime le risque de décès, d'infarctus ou d'ischémie récurrente à 14 jours",
    criteria: [
      "Âge ≥ 65 ans",
      "≥ 3 facteurs de risque (HTA, dyslipidémie, diabète, tabac, hérédité)",
      "Coronaropathie connue (sténose ≥ 50%)",
      "Prise d'aspirine dans les 7 derniers jours",
      "Angor sévère (≥ 2 épisodes en 24h)",
      "Modifications ST à l'ECG ≥ 0.5 mm",
      "Marqueur cardiaque positif (Troponine/CK-MB)"
    ],
    resultTitle: "Score TIMI",
    riskTitle: "Risque à 14 jours (Décès, IDM ou Revascularisation)",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le score TIMI aide à identifier les patients qui bénéficieront le plus de stratégies invasives précoces (coronarographie).",
      "Un score de 3 ou plus est généralement considéré comme une indication pour une stratégie invasive précoce.",
      "Il est préférable d'utiliser le TIMI en association avec d'autres scores comme le GRACE."
    ],
    pitfalls: [
      "Le TIMI sous-estime le risque dans certaines populations (comme les femmes) par rapport au score GRACE.",
      "NE PAS utiliser pour les STEMI ; il existe un score TIMI spécifique pour les STEMI."
    ],
    evidence: "Risque à 14 jours : 0-1 (4.7%), 2 (8.3%), 3 (13.2%), 4 (19.9%), 5 (26.2%), 6-7 (40.9%).",
    references: "Antman EM, et al. The TIMI risk score for unstable angina/non-ST elevation MI: A method for prognostication and therapeutic decision making. JAMA. 2000;284(7):835-42."
  }
};

const risks = [
  { score: 0, risk: "4.7%" },
  { score: 1, risk: "4.7%" },
  { score: 2, risk: "8.3%" },
  { score: 3, risk: "13.2%" },
  { score: 4, risk: "19.9%" },
  { score: 5, risk: "26.2%" },
  { score: 6, risk: "40.9%" },
  { score: 7, risk: "40.9%" },
];

export default function TimiScore({ lang }: { lang: LangCode }) {
  const [checks, setChecks] = useState<boolean[]>(Array(7).fill(false));

  const currentText = translations[lang] || translations.en;
  
  const toggleCheck = (index: number) => {
    const next = [...checks];
    next[index] = !next[index];
    setChecks(next);
  };

  const score = useMemo(() => checks.filter(Boolean).length, [checks]);
  const risk = risks[score].risk;

  useEffect(() => {
    if (score > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('timi-score', lang, score);
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
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}timi-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}timi-score`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}timi-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Cardiology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-rose-500/5 via-red-500/5 to-orange-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Cardiology / Emergency</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="timi-score" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-3">
              {(currentText.criteria as string[]).map((criterion, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    checks[idx] 
                      ? 'border-rose-500 bg-rose-50/50 text-rose-900' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`mt-0.5 ${checks[idx] ? 'text-rose-500' : 'text-slate-400'}`}>
                    {checks[idx] ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-base">{criterion}</span>
                  </div>
                  <div className={`font-bold ${checks[idx] ? 'text-rose-600' : 'text-slate-400'}`}>+1</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-5 rounded-2xl border text-rose-800 bg-rose-500/10 border-rose-500/20 relative overflow-hidden group">
                <div className="flex items-baseline gap-2 mb-4 justify-center">
                  <span className="text-6xl font-extrabold tracking-tight">{score}</span>
                  <span className="text-xl font-semibold opacity-80">/ 7</span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{currentText.riskTitle as string}</div>
                  <div className="text-3xl font-black">{risk}</div>
                </div>
              </div>
              
              {score >= 3 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-800 font-medium">
                    {lang === 'fr' 
                      ? 'Score ≥ 3. Considérer une stratégie invasive précoce (coronarographie) et l\'administration de LMWH / anti-GPIIb/IIIa.' 
                      : 'Score ≥ 3. Consider early invasive strategy (angiography) and LMWH / anti-GPIIb/IIIa.'}
                  </p>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title as string}
                inputs={
                  (currentText.criteria as string[]).map((criterion, idx) => ({
                    label: criterion,
                    value: checks[idx] ? 'Yes (+1)' : 'No (0)'
                  }))
                }
                results={[
                  { label: currentText.resultTitle as string, value: `${score}/7` },
                  { label: currentText.riskTitle as string, value: risk }
                ]}
                disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                references={currentText.references as string}
                lang={lang}
              />
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
