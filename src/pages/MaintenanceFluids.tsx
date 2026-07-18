import React, { useState, useMemo, useEffect } from 'react';
import { Droplet, Activity, Info, BookOpen, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Maintenance IV Fluids (4-2-1 Rule)",
    subtitle: "Calculate hourly pediatric and adult maintenance fluid rates",
    weightLabel: "Weight (kg)",
    resultTitle: "Maintenance Rate",
    rateLabel: "Hourly Rate",
    mlhr: "mL/hr",
    clinicalTitle: "Clinical Context",
    clinicalText: "The Holliday-Segar (4-2-1) rule is the standard method for estimating hourly maintenance intravenous fluid requirements in children and adults who cannot tolerate enteral intake.",
    pearls: [
      "For adults, many clinicians cap the maintenance rate at 100-120 mL/hr to prevent fluid overload.",
      "The formula does NOT account for deficit replacement or ongoing abnormal fluid losses (e.g., fever, diarrhea, drains).",
      "Most maintenance fluids should contain appropriate electrolytes (e.g., D5 1/2 NS with 20mEq KCl/L in children, or Plasmalyte/LR in adults)."
    ],
    pitfalls: [
      "Avoid giving hypotonic fluids (like 0.45% NaCl alone) to children with CNS infections or pulmonary disease due to the risk of severe hyponatremia and cerebral edema.",
      "In obese patients, consider using ideal body weight (IBW) to avoid over-resuscitation."
    ],
    evidence: "Formula:\n- First 10 kg: 4 mL/kg/hr\n- Next 10 kg (11-20 kg): 2 mL/kg/hr\n- Each kg > 20 kg: 1 mL/kg/hr",
    references: "Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957;19(5):823-32."
  },
  fr: {
    title: "Perfusions d'Entretien (Règle 4-2-1)",
    subtitle: "Calculer le débit de perfusion horaire pédiatrique et adulte",
    weightLabel: "Poids (kg)",
    resultTitle: "Débit d'Entretien",
    rateLabel: "Débit Horaire",
    mlhr: "mL/h",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "La règle de Holliday-Segar (4-2-1) est la méthode standard pour estimer les besoins en liquides intraveineux d'entretien horaires chez les enfants et les adultes qui ne peuvent pas tolérer un apport entéral.",
    pearls: [
      "Pour les adultes, de nombreux cliniciens limitent le débit d'entretien à 100-120 mL/h pour prévenir la surcharge hydrique.",
      "La formule ne tient PAS compte du remplacement des déficits ni des pertes liquidiennes anormales continues (ex: fièvre, diarrhée, drains).",
      "Les fluides d'entretien doivent contenir les électrolytes appropriés."
    ],
    pitfalls: [
      "Éviter les fluides hypotoniques chez les enfants atteints d'infections du SNC en raison du risque d'hyponatrémie sévère.",
      "Chez les patients obèses, envisagez d'utiliser le poids corporel idéal (PCI) pour éviter une surcharge."
    ],
    evidence: "Formule :\n- 10 premiers kg : 4 mL/kg/h\n- 10 kg suivants (11-20 kg) : 2 mL/kg/h\n- Chaque kg > 20 kg : 1 mL/kg/h",
    references: "Holliday MA, Segar WE. The maintenance need for water in parenteral fluid therapy. Pediatrics. 1957;19(5):823-32."
  }
};

export default function MaintenanceFluids({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('25');

  const currentText = translations[lang] || translations.en;
  const w = parseFloat(weight) || 0;

  const rate = useMemo(() => {
    if (w <= 0) return null;
    let r = 0;
    if (w <= 10) {
      r = w * 4;
    } else if (w <= 20) {
      r = 40 + ((w - 10) * 2);
    } else {
      r = 60 + ((w - 20) * 1);
    }
    return Math.round(r);
  }, [w]);

  useEffect(() => {
    if (rate !== null && rate > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('maintenance-fluids', lang, rate);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [rate, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}maintenance-fluids`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}maintenance-fluids`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}maintenance-fluids`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Pediatrics"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-blue-500/5 to-sky-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Droplet className="w-3.5 h-3.5" />
          <span>Pediatrics / Critical Care</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="maintenance-fluids" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700">
                {currentText.weightLabel as string}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-lg"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {rate !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 rounded-2xl border text-cyan-800 bg-cyan-500/10 border-cyan-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-sm font-bold opacity-80 mb-1">{currentText.rateLabel as string}</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-extrabold tracking-tight">{rate}</span>
                    <span className="text-xl font-semibold opacity-80">{currentText.mlhr as string}</span>
                  </div>
                  
                  {rate > 120 && (
                    <div className="p-3 mt-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 font-medium">
                        {lang === 'fr' 
                          ? 'Un débit > 120 mL/h est élevé pour un entretien chez l\'adulte typique. Envisagez de plafonner à 100-120 mL/h pour éviter la surcharge hydrique.' 
                          : 'A rate > 120 mL/hr is high for typical adult maintenance. Consider capping at 100-120 mL/hr to prevent fluid overload.'}
                      </p>
                    </div>
                  )}
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.weightLabel as string, value: weight }
                  ]}
                  results={[
                    { label: currentText.rateLabel as string, value: `${rate} ${currentText.mlhr as string}` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' 
                  ? "Entrez le poids du patient pour calculer le débit" 
                  : "Enter patient weight to calculate rate"}
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
