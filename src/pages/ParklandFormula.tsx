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
    title: "Parkland Formula for Burns",
    subtitle: "Calculate fluid resuscitation requirements for burn patients in the first 24 hours",
    weightLabel: "Patient Weight",
    tbsaLabel: "TBSA Burned (%)",
    tbsaHelp: "Only include 2nd (partial) and 3rd (full) degree burns",
    totalFluid: "Total Resuscitation Fluid (LR)",
    first8Hrs: "First 8 Hours (50%)",
    next16Hrs: "Next 16 Hours (50%)",
    rateLabel: "Infusion Rate",
    weightUnit: "kg",
    resultTitle: "Fluid Resuscitation Protocol",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Resuscitation fluids should be titrated to maintain a target urine output of 0.5 mL/kg/hr for adults (1.0 mL/kg/hr for children). Begin infusion calculations from the time of injury, not arrival.",
    pearls: [
      "The Parkland Formula is a guidelines-based estimate; fluid rates MUST be titrated based on physiological response (urine output, MAP, heart rate).",
      "Lactated Ringer's (LR) is preferred to avoid hyperchloremic metabolic acidosis associated with normal saline.",
      "Time is calculated from the time of the burn injury. If the patient arrives 2 hours late, the first half must be given over the remaining 6 hours."
    ],
    pitfalls: [
      "Over-resuscitation ('fluid creep') is common and can lead to abdominal compartment syndrome, pulmonary edema, and prolonged mechanical ventilation.",
      "Do not count first-degree burns (erythema only without blistering)."
    ],
    evidence: "Total Fluid (LR) = 4 mL × Weight (kg) × TBSA Burned (%). First half given over first 8 hours, second half over subsequent 16 hours.",
    references: "Baxter CR. Fluid volume and electrolyte changes of the early postburn period. Clin Plast Surg 1974;1:693-703."
  },
  fr: {
    title: "Formule de Parkland pour Brûlures",
    subtitle: "Calculer les besoins de réanimation liquidienne pour les brûlés dans les premières 24 heures",
    weightLabel: "Poids du Patient",
    tbsaLabel: "Surface Brûlée (TBSA %)",
    tbsaHelp: "Inclure uniquement les brûlures de 2e et 3e degrés",
    totalFluid: "Fluide de Réanimation Total (Ringer Lactate)",
    first8Hrs: "8 Premières Heures (50%)",
    next16Hrs: "16 Heures Suivantes (50%)",
    rateLabel: "Débit de Perfusion",
    weightUnit: "kg",
    resultTitle: "Protocole de Réanimation Liquidienne",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Les fluides de réanimation doivent être titrés pour maintenir un débit urinaire cible de 0,5 mL/kg/h chez l'adulte (1,0 mL/kg/h chez l'enfant). Commencer les calculs d'infusion à partir de l'heure de l'accident.",
    pearls: [
      "La formule de Parkland est une estimation ; le débit doit être ajusté en fonction de la diurèse horaire.",
      "Le Ringer Lactate (RL) est préféré pour éviter l'acidose hyperchlorémique provoquée par le sérum salé physiologique.",
      "Le temps est calculé depuis l'heure de la brûlure. En cas de retard de prise en charge, la première moitié doit être perfusée plus rapidement."
    ],
    pitfalls: [
      "La sur-réanimation ('fluid creep') est fréquente et peut entraîner un syndrome du compartiment abdominal ou un œdème pulmonaire.",
      "Ne pas comptabiliser les brûlures du 1er degré (érythème simple)."
    ],
    evidence: "Volume Total (RL) = 4 mL × Poids (kg) × Surface Brûlée (%). La moitié en 8 heures, le reste en 16 heures.",
    references: "Baxter CR. Fluid volume and electrolyte changes of the early postburn period. Clin Plast Surg 1974;1:693-703."
  }
};

export default function ParklandFormula({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('70');
  const [tbsa, setTbsa] = useState<string>('20');

  const currentText = translations[lang] || translations.en;

  const wNum = parseFloat(weight) || 0;
  const tNum = parseFloat(tbsa) || 0;

  const results = useMemo(() => {
    if (wNum <= 0 || tNum <= 0) return null;
    const total = 4 * wNum * tNum; // mL
    const half = total / 2;
    const rateFirst8 = half / 8;
    const rateNext16 = half / 16;

    return {
      total: Math.round(total),
      half: Math.round(half),
      rateFirst8: Math.round(rateFirst8 * 10) / 10,
      rateNext16: Math.round(rateNext16 * 10) / 10
    };
  }, [wNum, tNum]);

  useEffect(() => {
    if (wNum > 0 && tNum > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('parkland-formula', lang, wNum);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [wNum, tNum, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}parkland-formula`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}parkland-formula`,
            "name": currentText.title,
            "description": currentText.subtitle,
            "inLanguage": lang,
            "about": {
              "@type": "MedicalCondition",
              "name": "Thermal Burn",
              "code": {
                "@type": "MedicalCode",
                "codingSystem": "ICD-10",
                "code": "T30.0"
              }
            }
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title,
            "description": currentText.subtitle,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}parkland-formula`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Emergency Medicine"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-orange-500/5 via-teal-500/5 to-purple-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-orange-950 bg-clip-text text-transparent mb-3">
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="parkland-formula" lang={lang} title={currentText.title} />
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
                  {currentText.weightLabel} ({currentText.weightUnit})
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                  placeholder="e.g. 70"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {currentText.tbsaLabel}
                </label>
                <span className="block text-xs text-gray-400 mb-2">{currentText.tbsaHelp}</span>
                <input
                  type="number"
                  value={tbsa}
                  onChange={(e) => setTbsa(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none rounded-2xl text-base font-semibold text-gray-900 transition-all"
                  placeholder="e.g. 20"
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
              {currentText.resultTitle}
            </h3>

            {results ? (
              <div className="space-y-6">
                <div>
                  <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    {currentText.totalFluid}
                  </span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 font-mono">
                    {results.total} <span className="text-lg font-bold">mL</span>
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      {currentText.first8Hrs}
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-200">
                      {results.half} <span className="text-xs">mL</span>
                    </span>
                    <span className="block text-xs text-orange-400 mt-1 font-mono">
                      ~ {results.rateFirst8} mL/h
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                      {currentText.next16Hrs}
                    </span>
                    <span className="text-xl font-bold font-mono text-slate-200">
                      {results.half} <span className="text-xs">mL</span>
                    </span>
                    <span className="block text-xs text-amber-400 mt-1 font-mono">
                      ~ {results.rateNext16} mL/h
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-orange-400" />
                    {currentText.clinicalTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentText.clinicalText}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium text-sm">
                Enter inputs to calculate fluid requirements.
              </div>
            )}
          </div>
          <div className="flex justify-end px-2">
            <ClinicalExportButton
              lang={lang}
              calculatorName={currentText.title}
              inputs={[
                { label: currentText.weightLabel as string, value: `${weight} kg` },
                { label: currentText.tbsaLabel as string, value: `${tbsa} %` }
              ]}
              results={results ? [
                { label: currentText.totalFluid as string, value: `${results.total} mL` },
                { label: currentText.first8Hrs as string, value: `${results.half} mL (${results.rateFirst8} mL/h)` },
                { label: currentText.next16Hrs as string, value: `${results.half} mL (${results.rateNext16} mL/h)` }
              ] : []}
            />
          </div>
        </div>
      </div>
    </>
  );
}
