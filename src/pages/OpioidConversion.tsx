import React, { useState, useMemo, useEffect } from 'react';
import { Pill, Activity, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Opioid Conversion (MME)",
    subtitle: "Calculate Morphine Milligram Equivalents for common opioids",
    drugLabel: "Opioid & Route",
    doseLabel: "Total Daily Dose (mg)",
    resultTitle: "Morphine Milligram Equivalent (MME)",
    mmeLabel: "Daily MME",
    clinicalTitle: "Clinical Context",
    pearls: [
      "MME is used to assess overdose risk, not to perfectly convert between drugs for pain control.",
      "When converting to a new opioid, standard practice is to reduce the calculated equianalgesic dose by 25-50% due to incomplete cross-tolerance.",
      "Methadone and Fentanyl transdermal conversions are highly variable and complex; they are excluded from this basic calculator."
    ],
    pitfalls: [
      "Do NOT use MME to determine the exact dose of a new opioid. Incomplete cross-tolerance means a 1:1 conversion will likely cause a fatal overdose.",
      "Renal and hepatic impairment significantly alter opioid metabolism and clearance."
    ],
    evidence: "Conversion factors to PO Morphine: Morphine IV/IM (3), Oxycodone PO (1.5), Hydrocodone PO (1), Hydromorphone PO (4), Hydromorphone IV/IM (20), Codeine PO (0.15), Tramadol PO (0.1).",
    references: "CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022. MMWR Recomm Rep 2022;71(No. RR-3):1–95."
  },
  fr: {
    title: "Conversion des Opioïdes (Équivalent Morphine)",
    subtitle: "Calculer les Équivalents Milligrammes de Morphine (MME)",
    drugLabel: "Opioïde et Voie d'Administration",
    doseLabel: "Dose Quotidienne Totale (mg)",
    resultTitle: "Équivalent Milligramme de Morphine (MME)",
    mmeLabel: "MME / jour",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "Le MME est utilisé pour évaluer le risque de surdosage, non pour convertir parfaitement entre les médicaments pour le contrôle de la douleur.",
      "Lors de la conversion vers un nouvel opioïde, la pratique standard consiste à réduire la dose équianalgésique calculée de 25 à 50 % en raison de la tolérance croisée incomplète.",
      "Les conversions de la méthadone et du fentanyl transdermique sont très variables et complexes ; elles sont exclues de cette calculatrice de base."
    ],
    pitfalls: [
      "N'utilisez PAS le MME pour déterminer la dose exacte d'un nouvel opioïde. Une tolérance croisée incomplète signifie qu'une conversion 1:1 risque de provoquer une surdose mortelle.",
      "L'insuffisance rénale et hépatique altèrent considérablement le métabolisme et la clairance des opioïdes."
    ],
    evidence: "Facteurs de conversion vers la Morphine PO : Morphine IV/IM (3), Oxycodone PO (1.5), Hydrocodone PO (1), Hydromorphone PO (4), Hydromorphone IV/IM (20), Codéine PO (0.15), Tramadol PO (0.1).",
    references: "CDC Clinical Practice Guideline for Prescribing Opioids for Pain — United States, 2022. MMWR Recomm Rep 2022;71(No. RR-3):1–95."
  }
};

const opioidFactors = [
  { id: 'morphine_po', name: 'Morphine PO', factor: 1 },
  { id: 'morphine_iv', name: 'Morphine IV / IM', factor: 3 },
  { id: 'oxycodone_po', name: 'Oxycodone PO', factor: 1.5 },
  { id: 'hydrocodone_po', name: 'Hydrocodone PO', factor: 1 },
  { id: 'hydromorphone_po', name: 'Hydromorphone PO (Dilaudid)', factor: 4 },
  { id: 'hydromorphone_iv', name: 'Hydromorphone IV / IM', factor: 20 },
  { id: 'codeine_po', name: 'Codeine PO', factor: 0.15 },
  { id: 'tramadol_po', name: 'Tramadol PO', factor: 0.1 },
];

export default function OpioidConversion({ lang }: { lang: LangCode }) {
  const [drug, setDrug] = useState<string>('oxycodone_po');
  const [dose, setDose] = useState<string>('30');

  const currentText = translations[lang] || translations.en;
  const d = parseFloat(dose) || 0;

  const result = useMemo(() => {
    if (d <= 0) return null;
    const selectedDrug = opioidFactors.find(o => o.id === drug);
    if (!selectedDrug) return null;
    
    const mme = d * selectedDrug.factor;
    return Math.round(mme * 10) / 10;
  }, [d, drug]);

  useEffect(() => {
    if (result !== null && result > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('opioid-conversion', lang, result);
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
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}opioid-conversion`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}opioid-conversion`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}opioid-conversion`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Pain Management"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-500/5 via-fuchsia-500/5 to-pink-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Pill className="w-3.5 h-3.5" />
          <span>Pain Management / Palliative Care</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="opioid-conversion" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-6">
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.drugLabel as string}
                </label>
                <select
                  value={drug}
                  onChange={(e) => setDrug(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium text-slate-700"
                >
                  {opioidFactors.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.doseLabel as string}
                </label>
                <input
                  type="number"
                  value={dose}
                  onChange={(e) => setDose(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono text-lg"
                  placeholder="30"
                />
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
                <div className="p-5 rounded-2xl border text-purple-800 bg-purple-500/10 border-purple-500/20 relative overflow-hidden group">
                  <div className="text-sm font-bold opacity-80 mb-1">{currentText.mmeLabel as string}</div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-extrabold tracking-tight">{result}</span>
                    <span className="text-xl font-semibold opacity-80">mg</span>
                  </div>
                  
                  {result >= 50 && (
                    <div className="p-3 mt-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 font-medium">
                        {lang === 'fr' 
                          ? 'Doses ≥ 50 MME/jour augmentent le risque de surdosage d\'au moins 2x.' 
                          : 'Doses ≥ 50 MME/day increase overdose risk by at least 2x.'}
                      </p>
                    </div>
                  )}
                  {result >= 90 && (
                    <div className="p-3 mt-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 font-medium">
                        {lang === 'fr' 
                          ? 'Doses ≥ 90 MME/jour nécessitent une justification minutieuse. Envisagez de prescrire de la naloxone.' 
                          : 'Doses ≥ 90 MME/day require careful justification. Consider prescribing naloxone.'}
                      </p>
                    </div>
                  )}
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.drugLabel as string, value: opioidFactors.find(o => o.id === drug)?.name || drug },
                    { label: currentText.doseLabel as string, value: `${dose} mg` }
                  ]}
                  results={[
                    { label: currentText.mmeLabel as string, value: `${result} mg` }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Ne pas utiliser pour calculer une dose de conversion exacte sans réduction de tolérance croisée." : "This tool is for decision support only. Do NOT use to calculate exact conversion doses without applying cross-tolerance reduction."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' 
                  ? "Entrez une dose pour calculer le MME" 
                  : "Enter a dose to calculate MME"}
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
