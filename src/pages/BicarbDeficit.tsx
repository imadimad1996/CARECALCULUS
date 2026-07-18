import React, { useState, useMemo, useEffect } from 'react';
import { Droplet, Activity, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Bicarbonate Deficit Calculator",
    subtitle: "Estimates the mEq of HCO3 needed to correct metabolic acidosis",
    weightLabel: "Patient Weight (kg)",
    measuredLabel: "Measured HCO3 (mEq/L)",
    desiredLabel: "Desired HCO3 (mEq/L)",
    resultTitle: "Total Deficit",
    resultDose: "mEq HCO3",
    clinicalTitle: "Clinical Context",
    pearls: [
      "The formula is: Deficit = 0.5 × Weight(kg) × (Desired HCO3 - Measured HCO3).",
      "In severe metabolic acidosis, the volume of distribution of bicarbonate may increase from 0.5 to 0.8 L/kg or higher.",
      "A common clinical practice is to administer only ONE-HALF (50%) of the calculated deficit initially to avoid overshoot alkalosis."
    ],
    pitfalls: [
      "Rapid correction can cause severe hypokalemia, hypocalcemia (tetany), and paradoxical intracellular (CSF) acidosis.",
      "Treat the underlying cause of the acidosis first (e.g., insulin for DKA, fluids/antibiotics for sepsis). Bicarbonate therapy is controversial and usually reserved for severe acidemia (pH < 7.10)."
    ],
    evidence: "Provides a rough estimate of total body bicarbonate deficit. It assumes a distribution volume of 50% of total body weight.",
    references: "Kraut JA, Madias NE. Metabolic acidosis: pathophysiology, diagnosis and management. Nat Rev Nephrol. 2010;6(5):274-85."
  },
  fr: {
    title: "Déficit en Bicarbonate",
    subtitle: "Estime les mEq de HCO3 nécessaires pour corriger une acidose métabolique",
    weightLabel: "Poids du patient (kg)",
    measuredLabel: "HCO3 Mesuré (mEq/L)",
    desiredLabel: "HCO3 Désiré (mEq/L) - Souvent 24",
    resultTitle: "Déficit Total",
    resultDose: "mEq de HCO3",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Formule : Déficit = 0.5 × Poids(kg) × (HCO3 Désiré - HCO3 Mesuré).",
      "Dans l'acidose sévère, le volume de distribution du bicarbonate peut augmenter (0.8 L/kg).",
      "Il est recommandé d'administrer seulement la MOITIÉ (50%) du déficit calculé initialement pour éviter une alcalose de rebond."
    ],
    pitfalls: [
      "Une correction rapide peut causer une hypokaliémie sévère, une hypocalcémie (tétanie) et une acidose intracellulaire (LCR) paradoxale.",
      "Traitez d'abord la cause sous-jacente (insuline pour l'ACD, fluides pour le sepsis). Le bicarbonate est généralement réservé aux acidémies sévères (pH < 7.10)."
    ],
    evidence: "Fournit une estimation du déficit corporel total en bicarbonate en supposant un volume de distribution de 50% du poids corporel.",
    references: "Kraut JA, Madias NE. Metabolic acidosis: pathophysiology, diagnosis and management. Nat Rev Nephrol. 2010;6(5):274-85."
  }
};

export default function BicarbDeficit({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('70');
  const [measured, setMeasured] = useState<string>('12');
  const [desired, setDesired] = useState<string>('24');

  const currentText = translations[lang] || translations.en;
  
  const w = parseFloat(weight) || 0;
  const m = parseFloat(measured) || 0;
  const d = parseFloat(desired) || 0;

  const result = useMemo(() => {
    if (w <= 0 || m <= 0 || d <= 0) return null;
    if (m >= d) return 0; // No deficit if measured is >= desired
    
    // Formula: 0.5 * weight * (desired - measured)
    const deficit = 0.5 * w * (d - m);
    return Math.round(deficit);
  }, [w, m, d]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('bicarb-deficit', lang, result);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}bicarb-deficit`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}bicarb-deficit`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}bicarb-deficit`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Intensive Care"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-teal-500/5 to-emerald-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Droplet className="w-3.5 h-3.5" />
          <span>Critical Care / Nephrology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="bicarb-deficit" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.weightLabel as string}</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-mono text-lg" placeholder="70" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.measuredLabel as string}</label>
                <input type="number" value={measured} onChange={(e) => setMeasured(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-mono text-lg" placeholder="12" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.desiredLabel as string}</label>
                <input type="number" value={desired} onChange={(e) => setDesired(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 font-mono text-lg" placeholder="24" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {result !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 rounded-2xl border bg-cyan-50 border-cyan-200 text-cyan-900 relative overflow-hidden group">
                  <div className="flex items-baseline gap-2 mb-2 justify-center">
                    <span className="text-5xl font-extrabold tracking-tight">{result}</span>
                    <span className="text-xl font-semibold opacity-80">{currentText.resultDose as string}</span>
                  </div>
                  <div className="text-center text-sm font-medium opacity-80 mt-2">
                    {lang === 'fr' ? 'Déficit Total Calculé' : 'Total Calculated Deficit'}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm text-amber-800 font-bold">
                      {lang === 'fr' 
                        ? 'Dose Initiale Recommandée (50%)' 
                        : 'Recommended Initial Dose (50%)'}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-amber-600">{Math.round(result / 2)}</span>
                      <span className="text-sm font-medium text-amber-700">mEq</span>
                    </div>
                    <p className="text-xs text-amber-700 font-medium leading-relaxed">
                      {lang === 'fr' 
                        ? 'Pour éviter une alcalose de rebond sévère, administrez seulement la moitié de la dose, puis réévaluez les gaz du sang.' 
                        : 'To prevent severe overshoot alkalosis and hypokalemia, administer only half the calculated dose, then recheck ABG/VBG.'}
                    </p>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: "Weight", value: `${weight} kg` },
                    { label: "Measured HCO3", value: `${measured} mEq/L` },
                    { label: "Desired HCO3", value: `${desired} mEq/L` }
                  ]}
                  results={[
                    { label: "Total Deficit", value: `${result} mEq` },
                    { label: "Recommended Initial Dose (50%)", value: `${Math.round(result / 2)} mEq` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Entrez les valeurs pour calculer" : "Enter values to calculate"}
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
