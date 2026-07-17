import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "FENa (Fractional Excretion of Sodium)",
    subtitle: "Differentiate between prerenal and intrinsic renal causes of acute kidney injury (AKI)",
    serumNaLabel: "Serum Sodium (mEq/L)",
    urineNaLabel: "Urine Sodium (mEq/L)",
    serumCrLabel: "Serum Creatinine",
    urineCrLabel: "Urine Creatinine",
    crUnitLabel: "Creatinine Units",
    diureticWarning: "Diuretic use: FENa may be falsely elevated in patients taking diuretics. Consider FEUrea instead.",
    fenaResult: "Fractional Excretion of Sodium (FENa)",
    resultTitle: "Diagnostic Interpretation",
    clinicalTitle: "Clinical Context",
    clinicalText: "FENa < 1% indicates a prerenal etiology (volume depletion, heart failure). FENa > 2% indicates intrinsic renal damage (Acute Tubular Necrosis - ATN). FENa between 1% and 2% is a gray zone.",
    pearls: [
      "FENa is most useful in oliguric acute kidney injury (urine output < 400 mL/day).",
      "Low FENa (< 1%) indicates the kidneys are functioning to conserve sodium, representing appropriate response to hypoperfusion.",
      "Exceptions to FENa < 1% rule: contrast nephropathy, acute glomerulonephritis, myoglobinuria/hemoglobinuria, and chronic kidney disease can present with low FENa despite intrinsic injury."
    ],
    pitfalls: [
      "Do NOT use FENa if the patient is on active diuretics; diuretics force sodium wasting, which falsely elevates FENa into the intrinsic range.",
      "Ensure serum and urine creatinine are entered in the same units (both mg/dL or both µmol/L)."
    ],
    evidence: "FENa (%) = (Urine Na × Serum Cr) / (Serum Na × Urine Cr) × 100",
    references: "Espinel CH. The FENa test. Use in the differential diagnosis of acute renal failure. JAMA 1976;236:579-581."
  },
  fr: {
    title: "FENa (Fraction de l'Excrétion du Sodium)",
    subtitle: "Différencier les causes pré-rénales et intrinsèques de l'insuffisance rénale aiguë (IRA)",
    serumNaLabel: "Sodium Sérique (mEq/L)",
    urineNaLabel: "Sodium Urinaire (mEq/L)",
    serumCrLabel: "Créatinine Sérique",
    urineCrLabel: "Créatinine Urinaire",
    crUnitLabel: "Unités de Créatinine",
    diureticWarning: "Usage de diurétiques : La FENa peut être faussement élevée chez les patients sous diurétiques. Envisager la FEUrée à la place.",
    fenaResult: "Fraction d'Excrétion du Sodium (FENa)",
    resultTitle: "Interprétation Diagnostique",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "Une FENa < 1% oriente vers une origine pré-rénale (déshydratation, insuffisance cardiaque). Une FENa > 2% indique une atteinte rénale intrinsèque (Nécrose Tubulaire Aiguë - NTA).",
    pearls: [
      "La FENa est particulièrement utile en cas d'insuffisance rénale aiguë oligurique (diurèse < 400 mL/jour).",
      "Une FENa basse (< 1%) montre que les tubules rénaux sont fonctionnels et réabsorbent activement le sodium en réponse à une hypoperfusion.",
      "Exceptions à la règle FENa < 1% : néphropathie aux produits de contraste, glomérulonéphrite aiguë et obstruction précoce peuvent présenter une FENa basse."
    ],
    pitfalls: [
      "Ne pas utiliser la FENa sous diurétiques car ces traitements augmentent l'élimination du sodium et faussent la FENa à la hausse.",
      "Vérifiez que la créatinine sérique et urinaire sont saisies dans la même unité (toutes deux en mg/dL ou µmol/L)."
    ],
    evidence: "FENa (%) = (Na urinaire × Créatinine sérique) / (Na sérique × Créatinine urinaire) × 100",
    references: "Espinel CH. The FENa test. Use in the differential diagnosis of acute renal failure. JAMA 1976;236:579-581."
  }
};

export default function FenaCalculator({ lang }: { lang: LangCode }) {
  const [serumNa, setSerumNa] = useState<string>('140');
  const [urineNa, setUrineNa] = useState<string>('15');
  const [serumCr, setSerumCr] = useState<string>('1.8');
  const [urineCr, setUrineCr] = useState<string>('40');
  const [onDiuretics, setOnDiuretics] = useState<boolean>(false);
  const [crUnit, setCrUnit] = useState<'mg/dL' | 'µmol/L'>('mg/dL');

  const currentText = translations[lang] || translations.en;

  const sNa = parseFloat(serumNa) || 0;
  const uNa = parseFloat(urineNa) || 0;
  const sCr = parseFloat(serumCr) || 0;
  const uCr = parseFloat(urineCr) || 0;

  const fenaValue = useMemo(() => {
    if (sNa <= 0 || uNa <= 0 || sCr <= 0 || uCr <= 0) return null;
    const fena = (uNa * sCr) / (sNa * uCr) * 100;
    return Math.round(fena * 100) / 100;
  }, [sNa, uNa, sCr, uCr]);

  const interpretation = useMemo(() => {
    if (fenaValue === null) return null;
    if (fenaValue < 1.0) {
      return {
        label: lang === 'fr' ? "Prérénale (Hypovolémie / Hypoperfusion)" : "Prerenal (Hypovolemia / Hypoperfusion)",
        color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
      };
    } else if (fenaValue > 2.0) {
      return {
        label: lang === 'fr' ? "Rénale intrinsèque (NTA probable)" : "Intrinsic Renal (ATN likely)",
        color: "text-red-650 bg-red-500/10 border-red-500/20"
      };
    } else {
      return {
        label: lang === 'fr' ? "Zone grise / Indéterminée (1% - 2%)" : "Gray Zone / Indeterminate (1% - 2%)",
        color: "text-amber-600 bg-amber-500/10 border-amber-500/20"
      };
    }
  }, [fenaValue, lang]);

  useEffect(() => {
    if (sNa > 0 && uNa > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('fena-calculator', lang, sNa);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sNa, uNa, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}fena`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}fena`,
            "name": currentText.title,
            "description": currentText.subtitle,
            "inLanguage": lang,
            "about": {
              "@type": "MedicalCondition",
              "name": "Acute Kidney Injury",
              "code": {
                "@type": "MedicalCode",
                "codingSystem": "ICD-10",
                "code": "N17.9"
              }
            }
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title,
            "description": currentText.subtitle,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}fena`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Nephrology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-teal-500/5 via-cyan-500/5 to-purple-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-teal-950 bg-clip-text text-transparent mb-3">
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="fena" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6">
            
            {/* Diuretic Warning Switch */}
            <div className="flex items-center justify-between p-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                {lang === 'fr' ? 'Le patient prend-il des diurétiques ?' : 'Is patient taking diuretics?'}
              </span>
              <button
                type="button"
                onClick={() => setOnDiuretics(!onDiuretics)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${onDiuretics ? 'bg-amber-600' : 'bg-gray-300'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${onDiuretics ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {onDiuretics && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-medium">
                {currentText.diureticWarning}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.serumNaLabel}
                </label>
                <input
                  type="number"
                  value={serumNa}
                  onChange={(e) => setSerumNa(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.urineNaLabel}
                </label>
                <input
                  type="number"
                  value={urineNa}
                  onChange={(e) => setUrineNa(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                />
              </div>
            </div>

            {/* Creatinine unit switch */}
            <div className="flex justify-end gap-2">
              <span className="text-xs font-bold text-gray-500 self-center">{currentText.crUnitLabel}:</span>
              {(['mg/dL', 'µmol/L'] as const).map(unit => (
                <button
                  key={unit}
                  type="button"
                  onClick={() => setCrUnit(unit)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${crUnit === unit ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {unit}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.serumCrLabel} ({crUnit})
                </label>
                <input
                  type="number"
                  value={serumCr}
                  onChange={(e) => setSerumCr(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {currentText.urineCrLabel} ({crUnit})
                </label>
                <input
                  type="number"
                  value={urineCr}
                  onChange={(e) => setUrineCr(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
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
              {currentText.fenaResult}
            </h3>

            {fenaValue !== null ? (
              <div className="space-y-6">
                <div>
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 font-mono">
                    {fenaValue} <span className="text-2xl font-bold">%</span>
                  </span>
                </div>

                {interpretation && (
                  <div className={`p-4 border rounded-2xl font-bold text-sm ${interpretation.color}`}>
                    {interpretation.label}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-teal-400" />
                    {currentText.resultTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentText.clinicalText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium text-sm">
                Enter inputs to calculate FENa.
              </div>
            )}
          </div>
          
          <div className="flex justify-end px-2">
            <ClinicalExportButton
              lang={lang}
              calculatorName={currentText.title}
              inputs={[
                { label: currentText.serumNaLabel as string, value: `${serumNa} mEq/L` },
                { label: currentText.urineNaLabel as string, value: `${urineNa} mEq/L` },
                { label: currentText.serumCrLabel as string, value: `${serumCr} ${crUnit}` },
                { label: currentText.urineCrLabel as string, value: `${urineCr} ${crUnit}` }
              ]}
              results={fenaValue !== null ? [
                { label: currentText.fenaResult as string, value: `${fenaValue} %` },
                { label: "Interpretation", value: interpretation?.label || "" }
              ] : []}
            />
          </div>
        </div>
      </div>
    </>
  );
}
