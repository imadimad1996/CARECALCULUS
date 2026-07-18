import React, { useState, useMemo, useEffect } from 'react';
import { Wind, Activity, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "PERC Rule for Pulmonary Embolism",
    subtitle: "Rule out PE in low-risk patients without a D-Dimer",
    criteria: [
      "Age ≥ 50 years",
      "Heart rate ≥ 100 bpm",
      "O2 sat on room air < 95%",
      "Prior history of DVT or PE",
      "Recent trauma or surgery (within 4 weeks)",
      "Hemoptysis",
      "Exogenous estrogen use (OCPs, HRT)",
      "Unilateral leg swelling"
    ],
    resultTitle: "PERC Result",
    negative: "PERC Negative (0 criteria met)",
    positive: "PERC Positive (≥ 1 criteria met)",
    actionNegative: "PE ruled out. No D-dimer or imaging needed.",
    actionPositive: "Cannot rule out PE. Proceed with D-dimer or imaging.",
    clinicalTitle: "Clinical Context",
    pearls: [
      "The PERC rule should ONLY be applied to patients who have a LOW clinical pre-test probability for PE (e.g., Wells Score < 2).",
      "If the patient is low-risk AND PERC negative, the risk of PE is < 2%, safely avoiding the need for D-dimer and radiation exposure from CTPA."
    ],
    pitfalls: [
      "Do NOT use the PERC rule if the clinician's pre-test gestalt is moderate or high risk for PE. It will falsely reassure.",
      "A 'PERC Positive' result does NOT mean the patient has a PE; it simply means they require further testing (D-dimer)."
    ],
    evidence: "8-item clinical decision rule designed to identify patients at such low risk for pulmonary embolism that no further testing is required.",
    references: "Kline JA, et al. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247-55."
  },
  fr: {
    title: "Score PERC (Embolie Pulmonaire)",
    subtitle: "Exclure l'EP chez les patients à faible risque sans D-Dimères",
    criteria: [
      "Âge ≥ 50 ans",
      "Fréquence cardiaque ≥ 100 bpm",
      "SaO2 à l'air ambiant < 95%",
      "Antécédent de TVP ou d'EP",
      "Traumatisme ou chirurgie récents (≤ 4 semaines)",
      "Hémoptysie",
      "Prise d'œstrogènes exogènes",
      "Gonflement unilatéral d'une jambe"
    ],
    resultTitle: "Résultat PERC",
    negative: "PERC Négatif (0 critère)",
    positive: "PERC Positif (≥ 1 critère)",
    actionNegative: "EP exclue. D-dimères et imagerie non nécessaires.",
    actionPositive: "Impossible d'exclure l'EP. Procéder aux D-dimères.",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le score PERC doit être appliqué UNIQUEMENT aux patients ayant une FAIBLE probabilité clinique pré-test pour l'EP (ex: Score de Wells < 2).",
      "Si le patient est à faible risque ET PERC négatif, le risque d'EP est < 2%, évitant les D-dimères et le scanner."
    ],
    pitfalls: [
      "NE PAS utiliser le PERC si la probabilité clinique pré-test est modérée ou élevée.",
      "Un PERC positif ne signifie pas une EP, mais que des tests supplémentaires sont requis."
    ],
    evidence: "Règle de décision clinique en 8 points pour éviter les examens inutiles chez les patients suspects d'EP à très faible risque.",
    references: "Kline JA, et al. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247-55."
  }
};

export default function PercRule({ lang }: { lang: LangCode }) {
  const [checks, setChecks] = useState<boolean[]>(Array(8).fill(false));

  const currentText = translations[lang] || translations.en;
  
  const toggleCheck = (index: number) => {
    const next = [...checks];
    next[index] = !next[index];
    setChecks(next);
  };

  const score = useMemo(() => checks.filter(Boolean).length, [checks]);
  const isNegative = score === 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('perc-rule', lang, score);
    }, 1500);
    return () => clearTimeout(timer);
  }, [score, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}perc-rule`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}perc-rule`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}perc-rule`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Emergency Medicine"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-sky-500/5 via-blue-500/5 to-cyan-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

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
          <EmbedCodeButton calculatorSlug="perc-rule" lang={lang} title={currentText.title as string} />
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
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    checks[idx] 
                      ? 'border-sky-500 bg-sky-50/50 text-sky-900' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`shrink-0 ${checks[idx] ? 'text-sky-500' : 'text-slate-400'}`}>
                    {checks[idx] ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-base">{criterion}</span>
                  </div>
                  <div className={`font-bold ${checks[idx] ? 'text-sky-600' : 'text-slate-400'}`}>
                    {checks[idx] ? '+ Yes' : 'No'}
                  </div>
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
              <div className={`p-5 rounded-2xl border relative overflow-hidden group ${
                isNegative ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'
              }`}>
                <div className="text-xl font-black mb-2 text-center">
                  {isNegative ? currentText.negative as string : currentText.positive as string}
                </div>
                <div className="text-sm font-bold opacity-80 text-center">
                  {isNegative ? currentText.actionNegative as string : currentText.actionPositive as string}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  {lang === 'fr' 
                    ? 'AVERTISSEMENT : Ne pas utiliser ce score si la probabilité pré-test (gestalt) d\'EP est modérée ou élevée.' 
                    : 'WARNING: Do not use this rule if the pre-test probability (gestalt) for PE is moderate or high.'}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title as string}
                inputs={
                  (currentText.criteria as string[]).map((criterion, idx) => ({
                    label: criterion,
                    value: checks[idx] ? 'Yes' : 'No'
                  }))
                }
                results={[
                  { label: currentText.resultTitle as string, value: isNegative ? 'Negative (0 criteria)' : `Positive (${score} criteria)` },
                  { label: "Action", value: isNegative ? currentText.actionNegative as string : currentText.actionPositive as string }
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
