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
    clinicalDefinition: "The Pulmonary Embolism Rule-out Criteria (PERC) is an 8-item clinical decision rule designed to safely rule out pulmonary embolism (PE) in patients where the clinician's pre-test probability is very low (<15%). If all eight criteria are negative, the probability of a PE falls below the testing threshold (typically <2%), allowing clinicians to safely avoid further diagnostic testing—such as D-dimer assays or CT pulmonary angiography (CTPA)—and their associated risks of false positives, contrast nephropathy, and radiation exposure.",
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
      "The PERC rule must ONLY be applied to patients who have already been deemed to have a LOW clinical pre-test probability for PE (e.g., clinician gestalt < 15%, or a Wells Score < 2).",
      "If the patient is low-risk AND PERC negative, the risk of PE drops below 2%. At this threshold, the risks of testing (false-positive D-dimer leading to CTPA, contrast allergy, radiation) outweigh the risk of missing a PE.",
      "Remember the 'Age ≥ 50' criterion is an absolute cutoff. A 50-year-old patient automatically fails PERC and requires a D-dimer if PE is suspected."
    ],
    pitfalls: [
      "Gestalt override: Do NOT use the PERC rule if your clinical gestalt dictates a moderate or high risk for PE. It will falsely reassure you.",
      "A 'PERC Positive' result (≥ 1 criteria met) does NOT mean the patient has a PE. It simply means they fail the rule-out criteria and require further testing (typically a D-dimer or age-adjusted D-dimer).",
      "Do not use in pregnant patients. The PERC rule is not validated in pregnancy."
    ],
    evidence: "<b>Validation:</b><br/>Validated in multiple prospective trials (including the PROPPER trial).<br/>• PERC negative (0 criteria) + low clinical gestalt: PE rate is < 1.8%.<br/>• The rule reduces unnecessary D-dimer testing by approximately 20% in emergency department settings.",
    references: "Kline JA, et al. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247-55."
  },
  fr: {
    title: "Score PERC (Embolie Pulmonaire)",
    subtitle: "Exclure l'EP chez les patients à faible risque sans D-Dimères",
    clinicalDefinition: "La règle PERC (Pulmonary Embolism Rule-out Criteria) est un outil clinique en 8 points conçu pour exclure l'embolie pulmonaire (EP) chez les patients dont la probabilité pré-test est très faible (<15%). Si les huit critères sont négatifs, la probabilité d'EP tombe sous le seuil de test (<2%), permettant aux cliniciens d'éviter en toute sécurité des examens supplémentaires (D-dimères ou angioscanner thoracique) ainsi que les risques associés tels que les faux positifs ou l'exposition aux radiations.",
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
      "Le score PERC doit être appliqué UNIQUEMENT aux patients ayant une FAIBLE probabilité clinique pré-test pour l'EP (ex: gestalt clinique < 15%, ou Score de Wells < 2).",
      "Si le patient est à faible risque ET PERC négatif, le risque d'EP est inférieur à 2%. À ce stade, les risques des examens (D-dimères faux positifs menant au scanner, radiations) l'emportent sur le risque de manquer une EP.",
      "Le critère 'Âge ≥ 50 ans' est absolu. Un patient de 50 ans échoue automatiquement au PERC et nécessite des D-dimères si l'EP est suspectée."
    ],
    pitfalls: [
      "Interférence du Gestalt : NE PAS utiliser le PERC si votre jugement clinique dicte un risque modéré ou élevé d'EP. Il vous rassurera à tort.",
      "Un résultat 'PERC Positif' (≥ 1 critère) ne signifie PAS que le patient fait une EP. Cela signifie simplement qu'il nécessite des tests supplémentaires (généralement des D-dimères).",
      "Ne pas utiliser chez les patientes enceintes. La règle PERC n'est pas validée pour la grossesse."
    ],
    evidence: "<b>Validation :</b><br/>Validé dans plusieurs essais prospectifs (dont l'essai PROPPER).<br/>• PERC négatif (0 critère) + faible probabilité pré-test : Taux d'EP < 1.8%.<br/>• La règle réduit d'environ 20% les prescriptions inutiles de D-dimères aux urgences.",
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
            "description": (currentText.clinicalDefinition || currentText.subtitle) as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": (currentText.clinicalDefinition || currentText.subtitle) as string,
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
        {currentText.clinicalDefinition && (
          <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-3xl border-l-2 border-sky-500 pl-4">
            {currentText.clinicalDefinition as string}
          </p>
        )}
        <div className="mt-6 flex gap-3">
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
