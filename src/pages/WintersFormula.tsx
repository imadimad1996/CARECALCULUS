import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Winters' Formula for Metabolic Acidosis",
    subtitle: "Calculate expected pCO₂ compensation to check for mixed acid-base disorders",
    hco3Label: "Serum Bicarbonate (HCO₃⁻) (mEq/L)",
    pco2Label: "Measured pCO₂ (mmHg) (Optional)",
    expectedPco2: "Expected pCO₂ Range",
    resultTitle: "Acid-Base Interpretation",
    clinicalTitle: "Clinical Context",
    clinicalText: "If measured pCO₂ > expected range, there is a superimposed respiratory acidosis. If measured pCO₂ < expected range, there is a superimposed respiratory alkalosis.",
    pearls: [
      "Winters' formula should ONLY be applied in the presence of metabolic acidosis.",
      "The formula helps detect secondary respiratory disorders that might otherwise go unnoticed.",
      "Respiratory compensation in metabolic acidosis starts within minutes but takes 12-24 hours to fully complete."
    ],
    pitfalls: [
      "Do not use Winters' formula for metabolic alkalosis or respiratory disorders. It is strictly validated for metabolic acidosis.",
      "Ensure you are using arterial blood gas (ABG) pCO₂ values for maximum clinical accuracy."
    ],
    evidence: "Expected pCO₂ = (1.5 × HCO₃⁻) + 8 ± 2 mmHg",
    references: "Albert MS, et al. Quantitative displacement of acid-base equilibrium in metabolic acidosis. Medicine (Baltimore) 1967;46:95-107."
  },
  fr: {
    title: "Formule de Winters (Acidose Métabolique)",
    subtitle: "Calculer la pCO₂ attendue pour évaluer la compensation respiratoire",
    hco3Label: "Bicarbonate Sérique (HCO₃⁻) (mEq/L)",
    pco2Label: "pCO₂ Mesurée (mmHg) (Optionnel)",
    expectedPco2: "Plage de pCO₂ Attendue",
    resultTitle: "Interprétation de l'Équilibre Acido-Basique",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "Si la pCO₂ mesurée > plage attendue, il y a acidose respiratoire surajoutée. Si la pCO₂ mesurée < plage attendue, il y a alcalose respiratoire surajoutée.",
    pearls: [
      "La formule de Winters s'applique UNIQUEMENT en cas d'acidose métabolique.",
      "Elle permet de détecter des troubles respiratoires secondaires (acidose ou alcalose mixte).",
      "La compensation respiratoire débute en quelques minutes mais nécessite 12 à 24 heures pour être complète."
    ],
    pitfalls: [
      "Ne pas utiliser en cas d'alcalose métabolique ou de trouble respiratoire primaire. Validée uniquement pour l'acidose métabolique.",
      "Privilégiez les valeurs de pCO₂ issues d'un gaz du sang artériel (GSA)."
    ],
    evidence: "pCO₂ Attendue = (1.5 × HCO₃⁻) + 8 ± 2 mmHg",
    references: "Albert MS, et al. Quantitative displacement of acid-base equilibrium in metabolic acidosis. Medicine (Baltimore) 1967;46:95-107."
  }
};

export default function WintersFormula({ lang }: { lang: LangCode }) {
  const [hco3, setHco3] = useState<string>('18');
  const [pco2, setPco2] = useState<string>('');

  const currentText = translations[lang] || translations.en;

  const hNum = parseFloat(hco3) || 0;
  const pNum = parseFloat(pco2) || 0;

  const results = useMemo(() => {
    if (hNum <= 0) return null;
    const base = (1.5 * hNum) + 8;
    const min = base - 2;
    const max = base + 2;

    let interpretation = "";
    let color = "text-slate-200 bg-slate-800/40 border-slate-700";

    if (pNum > 0) {
      if (pNum > max) {
        interpretation = lang === 'fr' 
          ? "Acidose respiratoire surajoutée (Hypoventilation relative)" 
          : "Superimposed Respiratory Acidosis (Relative hypoventilation)";
        color = "text-red-500 bg-red-500/10 border-red-500/20";
      } else if (pNum < min) {
        interpretation = lang === 'fr' 
          ? "Alcalose respiratoire surajoutée (Hyperventilation relative)" 
          : "Superimposed Respiratory Alkalosis (Relative hyperventilation)";
        color = "text-amber-500 bg-amber-500/10 border-amber-500/20";
      } else {
        interpretation = lang === 'fr' 
          ? "Compensation respiratoire adéquate (Trouble métabolique pur)" 
          : "Appropriate Respiratory Compensation (Pure metabolic acidosis)";
        color = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      }
    }

    return {
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      interpretation,
      color
    };
  }, [hNum, pNum, lang]);

  useEffect(() => {
    if (hNum > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('winters-formula', lang, hNum);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hNum, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}winters-formula`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}winters-formula`,
            "name": currentText.title,
            "description": currentText.subtitle,
            "inLanguage": lang,
            "about": {
              "@type": "MedicalCondition",
              "name": "Metabolic Acidosis",
              "code": {
                "@type": "MedicalCode",
                "codingSystem": "ICD-10",
                "code": "E87.2"
              }
            }
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title,
            "description": currentText.subtitle,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}winters-formula`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Pulmonology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-cyan-950 bg-clip-text text-transparent mb-3">
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="winters-formula" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.hco3Label}
                </label>
                <input
                  type="number"
                  value={hco3}
                  onChange={(e) => setHco3(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                  placeholder="e.g. 18"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.pco2Label}
                </label>
                <input
                  type="number"
                  value={pco2}
                  onChange={(e) => setPco2(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                  placeholder="e.g. 35"
                />
              </div>
            </div>

          </div>

          <ClinicalContextPanel
            lang={lang}
            pearls={currentText.pearls}
            pitfalls={currentText.pitfalls}
            evidence={currentText.evidence}
            references={currentText.references}
          />
        </div>

        <div className="lg:col-span-5 space-y-6 sticky top-6">
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 font-mono">
              {currentText.expectedPco2}
            </h3>

            {results ? (
              <div className="space-y-6">
                <div>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300 font-mono">
                    {results.min} - {results.max} <span className="text-lg font-bold">mmHg</span>
                  </span>
                </div>

                {results.interpretation && (
                  <div className={`p-4 border rounded-2xl font-bold text-xs ${results.color}`}>
                    {results.interpretation}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    {currentText.resultTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentText.clinicalText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium text-sm">
                Enter Serum Bicarbonate to calculate expected pCO₂.
              </div>
            )}
          </div>
          
          <div className="flex justify-end px-2">
            <ClinicalExportButton
              lang={lang}
              calculatorName={currentText.title}
              inputs={[
                { label: currentText.hco3Label as string, value: `${hco3} mEq/L` },
                { label: currentText.pco2Label as string, value: pco2 ? `${pco2} mmHg` : "Not provided" }
              ]}
              results={results ? [
                { label: currentText.expectedPco2 as string, value: `${results.min} - ${results.max} mmHg` },
                { label: "Interpretation", value: results.interpretation || "No measured pCO2 provided" }
              ] : []}
            />
          </div>
        </div>
      </div>
    </>
  );
}
