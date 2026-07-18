import React, { useState, useMemo, useEffect } from 'react';
import { TestTube, Activity, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Osmolal Gap Calculator",
    subtitle: "Identify unmeasured toxic alcohols (Methanol, Ethylene Glycol)",
    measuredLabel: "Measured Osmolality (mOsm/kg)",
    naLabel: "Sodium (mEq/L)",
    bunLabel: "BUN (mg/dL)",
    glcLabel: "Glucose (mg/dL)",
    etohLabel: "Ethanol (mg/dL) - Optional",
    resultTitle: "Osmolal Gap",
    calculatedLabel: "Calculated Osmolality",
    gapLabel: "Osmolal Gap",
    normal: "Normal",
    elevated: "Elevated (Toxic Ingestion Risk)",
    clinicalTitle: "Clinical Context",
    pearls: [
      "A normal osmolal gap is typically < 10 mOsm/kg.",
      "An elevated gap > 10 strongly suggests the presence of unmeasured osmoles, most dangerously toxic alcohols like methanol or ethylene glycol.",
      "As toxic alcohols are metabolized into toxic acids (like formic acid), the osmolal gap will decrease while the anion gap increases."
    ],
    pitfalls: [
      "Do NOT rule out toxic alcohol ingestion simply because the osmolal gap is normal. If the patient presents late, the parent alcohol has already been metabolized, meaning the osmolal gap will be normal but the anion gap will be huge.",
      "Ethanol must be included in the calculated osmolality if present in the patient's blood."
    ],
    evidence: "Calculated Osmolality = (2 × Na) + (BUN / 2.8) + (Glucose / 18) + (Ethanol / 4.6). Gap = Measured - Calculated.",
    references: "Purssell RA, Pudek M, Brubacher J, Abu-Laban RB. Derivation and validation of a formula to calculate the contribution of ethanol to the osmolal gap. Ann Emerg Med. 2001;38(6):653-9."
  },
  fr: {
    title: "Calculateur de Trou Osmolaire",
    subtitle: "Identifier les alcools toxiques non mesurés",
    measuredLabel: "Osmolalité Mesurée (mOsm/kg)",
    naLabel: "Sodium (mEq/L)",
    bunLabel: "Urée (mg/dL)",
    glcLabel: "Glucose (mg/dL)",
    etohLabel: "Éthanol (mg/dL) - Optionnel",
    resultTitle: "Trou Osmolaire",
    calculatedLabel: "Osmolalité Calculée",
    gapLabel: "Trou Osmolaire",
    normal: "Normal",
    elevated: "Élevé (Risque d'Ingestion Toxique)",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Un trou osmolaire normal est généralement < 10 mOsm/kg.",
      "Un trou > 10 suggère fortement la présence d'osmoles non mesurées, notamment des alcools toxiques comme le méthanol ou l'éthylène glycol.",
      "À mesure que les alcools toxiques sont métabolisés en acides, le trou osmolaire diminue tandis que le trou anionique augmente."
    ],
    pitfalls: [
      "N'excluez PAS l'ingestion d'alcool toxique simplement parce que le trou osmolaire est normal au stade tardif.",
      "L'éthanol doit être inclus dans l'osmolalité calculée s'il est présent."
    ],
    evidence: "Osmolalité Calculée = (2 × Na) + (Urée / 2.8) + (Glucose / 18) + (Éthanol / 4.6). Trou = Mesuré - Calculé.",
    references: "Purssell RA, Pudek M, Brubacher J, Abu-Laban RB. Derivation and validation of a formula to calculate the contribution of ethanol to the osmolal gap. Ann Emerg Med. 2001;38(6):653-9."
  }
};

export default function OsmolalGap({ lang }: { lang: LangCode }) {
  const [measured, setMeasured] = useState<string>('290');
  const [na, setNa] = useState<string>('140');
  const [bun, setBun] = useState<string>('14');
  const [glc, setGlc] = useState<string>('90');
  const [etoh, setEtoh] = useState<string>('0');

  const currentText = translations[lang] || translations.en;
  
  const m = parseFloat(measured) || 0;
  const n = parseFloat(na) || 0;
  const b = parseFloat(bun) || 0;
  const g = parseFloat(glc) || 0;
  const e = parseFloat(etoh) || 0;

  const result = useMemo(() => {
    if (m <= 0 || n <= 0) return null;
    
    // Calculated = 2*Na + BUN/2.8 + Glc/18 + EtOH/4.6
    const calculated = (2 * n) + (b / 2.8) + (g / 18) + (e / 4.6);
    const gap = m - calculated;
    
    return {
      calculated: Math.round(calculated * 10) / 10,
      gap: Math.round(gap * 10) / 10
    };
  }, [m, n, b, g, e]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('osmolal-gap', lang, result.gap);
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
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}osmolal-gap`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}osmolal-gap`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}osmolal-gap`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Toxicology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-lime-500/5 via-green-500/5 to-emerald-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-100/50 border border-lime-200 text-lime-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <TestTube className="w-3.5 h-3.5" />
          <span>Toxicology / Critical Care</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="osmolal-gap" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.measuredLabel as string}</label>
                <input type="number" value={measured} onChange={(e) => setMeasured(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 font-mono text-lg" placeholder="290" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.naLabel as string}</label>
                  <input type="number" value={na} onChange={(e) => setNa(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 font-mono text-lg" placeholder="140" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.bunLabel as string}</label>
                  <input type="number" value={bun} onChange={(e) => setBun(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 font-mono text-lg" placeholder="14" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.glcLabel as string}</label>
                  <input type="number" value={glc} onChange={(e) => setGlc(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 font-mono text-lg" placeholder="90" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.etohLabel as string}</label>
                  <input type="number" value={etoh} onChange={(e) => setEtoh(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500 font-mono text-lg" placeholder="0" />
                </div>
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
                <div className={`p-5 rounded-2xl border relative overflow-hidden group ${result.gap > 10 ? 'bg-red-50/50 border-red-200 text-red-900' : 'bg-lime-50/50 border-lime-200 text-lime-900'}`}>
                  <div className="text-sm font-bold opacity-80 mb-1">{currentText.gapLabel as string}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold tracking-tight">{result.gap}</span>
                    <span className="text-xl font-semibold opacity-80">mOsm/kg</span>
                  </div>
                  <div className="text-sm font-medium">
                    {result.gap > 10 ? currentText.elevated as string : currentText.normal as string}
                  </div>
                </div>
                
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex justify-between items-center">
                  <span className="text-sm font-bold">{currentText.calculatedLabel as string}</span>
                  <span className="font-mono font-bold text-lg">{result.calculated}</span>
                </div>

                {result.gap > 10 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">
                      {lang === 'fr' 
                        ? 'Trou osmolaire > 10 ! Suspectez l\'ingestion d\'alcool toxique (Méthanol, Éthylène glycol, Isopropanol) ou une acidocétose sévère. Envisagez le fomépizole ou la dialyse.' 
                        : 'Osmolal gap > 10! Highly suspicious for toxic alcohol ingestion (Methanol, Ethylene Glycol, Isopropanol) or severe ketoacidosis. Consider Fomepizole or dialysis.'}
                    </p>
                  </div>
                )}

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.measuredLabel as string, value: measured },
                    { label: currentText.naLabel as string, value: na },
                    { label: currentText.bunLabel as string, value: bun },
                    { label: currentText.glcLabel as string, value: glc },
                    { label: currentText.etohLabel as string, value: etoh }
                  ]}
                  results={[
                    { label: currentText.calculatedLabel as string, value: `${result.calculated}` },
                    { label: currentText.gapLabel as string, value: `${result.gap}` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Entrez les valeurs pour calculer le trou" : "Enter values to calculate gap"}
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
