import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Droplet, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Reticulocyte Production Index (RPI)",
    subtitle: "Evaluates bone marrow response to anemia",
    reticLabel: "Reticulocyte Count (%)",
    hctLabel: "Patient Hematocrit (%)",
    normalHctLabel: "Normal Hematocrit (%) - Default 45",
    resultTitle: "Reticulocyte Production Index",
    clinicalTitle: "Clinical Context",
    pearls: [
      "RPI corrects the reticulocyte count for both the degree of anemia and the premature release of reticulocytes from the marrow (shift).",
      "An RPI ≥ 3 indicates an adequate bone marrow response to anemia (usually seen in hemolysis or acute blood loss).",
      "An RPI < 2 indicates an inadequate response (hypoproliferative anemia: iron/B12/folate deficiency, aplastic anemia, anemia of chronic disease)."
    ],
    pitfalls: [
      "If there is no polychromasia on the peripheral smear, the maturation factor correction may not be entirely accurate, but it is still standard practice to calculate RPI for significant anemia.",
      "A normal absolute reticulocyte count can still mean an inadequate response if the patient is severely anemic."
    ],
    evidence: "Formula: RPI = (Retic % × (Pt Hct / Normal Hct)) / Maturation Factor. Maturation Factor: Hct ≥ 36 (1.0), 26-35 (1.5), 16-25 (2.0), ≤ 15 (2.5).",
    references: "Hillman RS, Finch CA. The misused reticulocyte. Br J Haematol. 1969;17(4):313-5."
  },
  fr: {
    title: "Indice de Production Réticulocytaire (IPR)",
    subtitle: "Évalue la réponse de la moelle osseuse à l'anémie",
    reticLabel: "Taux de Réticulocytes (%)",
    hctLabel: "Hématocrite du patient (%)",
    normalHctLabel: "Hématocrite Normal (%) - Défaut 45",
    resultTitle: "Indice Réticulocytaire (IPR)",
    clinicalTitle: "Contexte Clinique",
    pearls: [
      "L'IPR corrige le taux de réticulocytes en fonction de la sévérité de l'anémie et de la libération prématurée des réticulocytes (shift).",
      "Un IPR ≥ 3 indique une réponse médullaire adéquate (généralement en cas d'hémolyse ou d'hémorragie aiguë).",
      "Un IPR < 2 indique une réponse inadéquate (anémie hypoproliférative : carence martiale/B12/folates, aplasie, inflammation)."
    ],
    pitfalls: [
      "En l'absence de polychromasie sur le frottis, la correction par le facteur de maturation peut être moins précise.",
      "Un nombre absolu de réticulocytes 'normal' peut être une réponse inadéquate si l'anémie est sévère."
    ],
    evidence: "Formule : IPR = (Rétic % × (Hct patient / Hct normal)) / Facteur de maturation. Facteur : Hct ≥ 36 (1.0), 26-35 (1.5), 16-25 (2.0), ≤ 15 (2.5).",
    references: "Hillman RS, Finch CA. The misused reticulocyte. Br J Haematol. 1969;17(4):313-5."
  }
};

export default function ReticIndex({ lang }: { lang: LangCode }) {
  const [retic, setRetic] = useState<string>('5.0');
  const [hct, setHct] = useState<string>('25');
  const [normalHct, setNormalHct] = useState<string>('45');

  const currentText = translations[lang] || translations.en;
  
  const r = parseFloat(retic) || 0;
  const h = parseFloat(hct) || 0;
  const n = parseFloat(normalHct) || 45;

  const result = useMemo(() => {
    if (r <= 0 || h <= 0 || n <= 0) return null;
    
    // Determine maturation factor based on Hct
    let mf = 1.0;
    if (h >= 36) mf = 1.0;
    else if (h >= 26) mf = 1.5;
    else if (h >= 16) mf = 2.0;
    else mf = 2.5;

    const rpi = (r * (h / n)) / mf;
    
    return {
      rpi: Math.round(rpi * 100) / 100,
      mf
    };
  }, [r, h, n]);

  const assessment = useMemo(() => {
    if (!result) return null;
    if (result.rpi < 2) return lang === 'fr' ? 'Réponse Inadéquate (Hypoproliférative)' : 'Inadequate Response (Hypoproliferative)';
    if (result.rpi >= 3) return lang === 'fr' ? 'Réponse Adéquate (Hyperproliférative)' : 'Adequate Response (Hyperproliferative/Hemolysis)';
    return lang === 'fr' ? 'Réponse Intermédiaire / Indéterminée' : 'Indeterminate / Borderline Response';
  }, [result, lang]);

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('retic-index', lang, result.rpi);
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
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}retic-index`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}retic-index`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}retic-index`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Hematology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-red-500/5 via-rose-500/5 to-pink-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100/50 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Droplet className="w-3.5 h-3.5" />
          <span>Hematology / Internal Medicine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="retic-index" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.reticLabel as string}</label>
                <input type="number" step="0.1" value={retic} onChange={(e) => setRetic(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-mono text-lg" placeholder="5.0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.hctLabel as string}</label>
                  <input type="number" step="0.1" value={hct} onChange={(e) => setHct(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-mono text-lg" placeholder="25" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{currentText.normalHctLabel as string}</label>
                  <input type="number" step="0.1" value={normalHct} onChange={(e) => setNormalHct(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-mono text-lg" placeholder="45" />
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
                <div className={`p-5 rounded-2xl border relative overflow-hidden group ${
                  result.rpi < 2 ? 'bg-amber-50 border-amber-200 text-amber-900' : 
                  result.rpi >= 3 ? 'bg-green-50 border-green-200 text-green-900' :
                  'bg-slate-50 border-slate-200 text-slate-900'
                }`}>
                  <div className="flex items-baseline gap-2 mb-2 justify-center">
                    <span className="text-5xl font-extrabold tracking-tight">{result.rpi}</span>
                  </div>
                  <div className="text-center text-sm font-bold mt-2">
                    {assessment}
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span>Maturation Factor Applied:</span>
                  <span className="font-mono font-bold">{result.mf.toFixed(1)}</span>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: "Reticulocytes", value: `${retic}%` },
                    { label: "Patient Hct", value: `${hct}%` },
                    { label: "Normal Hct", value: `${normalHct}%` }
                  ]}
                  results={[
                    { label: "RPI", value: `${result.rpi}` },
                    { label: "Assessment", value: assessment as string }
                  ]}
                  disclaimer={lang === 'fr' ? "Ceci est un outil d'aide à la décision. Il ne remplace pas le jugement clinique." : "This tool is for decision support only and does not replace clinical judgment."}
                  references={currentText.references as string}
                  lang={lang}
                />
              </div>
            ) : (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 font-medium text-sm flex flex-col items-center gap-3">
                <Activity className="w-8 h-8 opacity-20" />
                {lang === 'fr' ? "Entrez les valeurs pour calculer l'IPR" : "Enter values to calculate RPI"}
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
