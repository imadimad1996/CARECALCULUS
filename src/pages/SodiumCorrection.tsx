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
    title: "Sodium Correction Rate (Hyponatremia)",
    subtitle: "Adrogué-Madias Formula for safe hyponatremia correction",
    weightLabel: "Weight (kg)",
    naLabel: "Current Serum Sodium (mEq/L)",
    infusateLabel: "Infusate Type",
    fluidVolLabel: "Fluid Volume (Liters)",
    sexLabel: "Patient Sex & Age Group",
    child: "Child",
    adultMale: "Adult Male",
    adultFemale: "Adult Female",
    elderlyMale: "Elderly Male",
    elderlyFemale: "Elderly Female",
    resultTitle: "Estimated Effect",
    change1LLabel: "Na Change per 1L IV Fluid",
    finalNaLabel: "Estimated Final Sodium",
    clinicalTitle: "Clinical Context",
    clinicalText: "The Adrogué-Madias formula estimates the change in serum sodium following the administration of 1 liter of a given infusate. This is critical to prevent central pontine myelinolysis (Osmotic Demyelination Syndrome) from rapid overcorrection.",
    pearls: [
      "Maximum safe correction limit is generally 8 mEq/L per 24 hours for chronic hyponatremia.",
      "Severe symptomatic hyponatremia (seizures, coma) requires rapid initial correction (e.g., 3% NaCl) by 4-6 mEq/L over the first few hours to stop active herniation.",
      "Always monitor serum sodium frequently (every 2-4 hours) during active correction, as the formula is only an estimate and actual response varies."
    ],
    pitfalls: [
      "The formula assumes a closed system. It does not account for concurrent free water loss, diuresis, or other fluid shifts.",
      "Concurrent administration of potassium must be factored in, as 1 mEq of K+ is osmotically equivalent to 1 mEq of Na+."
    ],
    evidence: "Change in Serum Na = (Infusate Na - Serum Na) / (Total Body Water + 1)",
    references: "Adrogué HJ, Madias NE. Hyponatremia. N Engl J Med. 2000;342(21):1581-1589."
  },
  fr: {
    title: "Correction de la Hyponatrémie",
    subtitle: "Formule d'Adrogué-Madias pour corriger le sodium en toute sécurité",
    weightLabel: "Poids (kg)",
    naLabel: "Sodium Sérique Actuel (mEq/L)",
    infusateLabel: "Type de Soluté",
    fluidVolLabel: "Volume Perfusé (Litres)",
    sexLabel: "Sexe et Âge du Patient",
    child: "Enfant",
    adultMale: "Homme Adulte",
    adultFemale: "Femme Adulte",
    elderlyMale: "Homme Âgé",
    elderlyFemale: "Femme Âgée",
    resultTitle: "Effet Estimé",
    change1LLabel: "Variation Na pour 1L de soluté",
    finalNaLabel: "Sodium Final Estimé",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "La formule d'Adrogué-Madias estime la variation du sodium sérique après l'administration d'un litre d'un soluté donné. Ceci est crucial pour éviter la myélinolyse centropontine (syndrome de démyélinisation osmotique).",
    pearls: [
      "La limite de correction de sécurité maximale est généralement de 8 mEq/L par 24 heures pour l'hyponatrémie chronique.",
      "L'hyponatrémie symptomatique sévère (convulsions, coma) nécessite une correction initiale rapide (ex: NaCl 3%) de 4-6 mEq/L dans les premières heures.",
      "Toujours surveiller le sodium fréquemment (toutes les 2 à 4 heures) lors de la correction active, car la formule n'est qu'une estimation."
    ],
    pitfalls: [
      "La formule suppose un système fermé sans tenir compte de la diurèse, de la perte d'eau libre ni des autres mouvements liquidiens.",
      "L'administration de potassium doit être prise en compte car 1 mEq de K+ équivaut osmotiquement à 1 mEq de Na+."
    ],
    evidence: "Variation Na = (Na Soluté - Na Sérique) / (Eau Corporelle Totale + 1)",
    references: "Adrogué HJ, Madias NE. Hyponatremia. N Engl J Med. 2000;342(21):1581-1589."
  }
};

const tbwFactors = {
  child: 0.6,
  adultMale: 0.6,
  adultFemale: 0.5,
  elderlyMale: 0.5,
  elderlyFemale: 0.45
};

const infusates = [
  { id: 'nacl3', label: '3% NaCl (Hypertonic)', na: 513 },
  { id: 'nacl09', label: '0.9% NaCl (Normal Saline)', na: 154 },
  { id: 'ringer', label: 'Ringer Lactate', na: 130 },
  { id: 'nacl045', label: '0.45% NaCl (Half Normal)', na: 77 },
  { id: 'd5w', label: 'D5W (5% Dextrose)', na: 0 }
];

export default function SodiumCorrection({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('70');
  const [na, setNa] = useState<string>('118');
  const [infusate, setInfusate] = useState<string>('nacl3');
  const [fluidVol, setFluidVol] = useState<string>('1.0');
  const [patientType, setPatientType] = useState<keyof typeof tbwFactors>('adultMale');

  const currentText = translations[lang] || translations.en;

  const w = parseFloat(weight) || 0;
  const currentNa = parseFloat(na) || 0;
  const vol = parseFloat(fluidVol) || 0;

  const result = useMemo(() => {
    if (w <= 0 || currentNa <= 0) return null;
    const factor = tbwFactors[patientType];
    const tbw = w * factor;
    const selectedInfusate = infusates.find(i => i.id === infusate);
    const infusateNa = selectedInfusate ? selectedInfusate.na : 0;
    
    // Change per 1L of fluid
    const changePerLiter = (infusateNa - currentNa) / (tbw + 1);
    
    // Total change based on fluid volume given
    const totalChange = changePerLiter * vol;
    
    return {
      changePerLiter: Math.round(changePerLiter * 10) / 10,
      totalChange: Math.round(totalChange * 10) / 10,
      finalNa: Math.round((currentNa + totalChange) * 10) / 10
    };
  }, [w, currentNa, infusate, vol, patientType]);

  useEffect(() => {
    if (result !== null && result.changePerLiter !== 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('sodium-correction', lang, currentNa);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result, currentNa, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}sodium-correction`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}sodium-correction`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}sodium-correction`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Nephrology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-amber-500/5 via-orange-500/5 to-red-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/50 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Activity className="w-3.5 h-3.5" />
          <span>Nephrology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="sodium-correction" lang={lang} title={currentText.title as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.sexLabel as string}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(tbwFactors) as Array<keyof typeof tbwFactors>).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPatientType(type)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        patientType === type
                          ? 'bg-orange-50 border-orange-600 text-orange-700 shadow-sm ring-1 ring-orange-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50/30'
                      }`}
                    >
                      {currentText[type as keyof typeof currentText] as string}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    {currentText.weightLabel as string}
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono text-lg"
                    placeholder="70"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    {currentText.naLabel as string}
                  </label>
                  <input
                    type="number"
                    value={na}
                    onChange={(e) => setNa(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono text-lg"
                    placeholder="118"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.infusateLabel as string}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {infusates.map((inf) => (
                    <button
                      key={inf.id}
                      onClick={() => setInfusate(inf.id)}
                      className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all text-left flex justify-between items-center ${
                        infusate === inf.id
                          ? 'bg-orange-50 border-orange-600 text-orange-700 shadow-sm ring-1 ring-orange-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50/30'
                      }`}
                    >
                      <span>{inf.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.fluidVolLabel as string}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fluidVol}
                  onChange={(e) => setFluidVol(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-mono text-lg"
                  placeholder="1.0"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {result !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 rounded-2xl border text-orange-800 bg-orange-500/10 border-orange-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-sm font-bold opacity-80 mb-1">{currentText.change1LLabel as string}</div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-extrabold tracking-tight">{result.changePerLiter > 0 ? '+' : ''}{result.changePerLiter}</span>
                    <span className="text-lg font-semibold opacity-80">mEq/L</span>
                  </div>
                  
                  <div className="h-px w-full bg-orange-500/20 my-3"></div>
                  
                  <div className="text-xs font-bold opacity-80 mb-1">{currentText.finalNaLabel as string} (after {vol}L)</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold tracking-tight">{result.finalNa}</span>
                    <span className="text-sm font-semibold opacity-80">mEq/L</span>
                  </div>
                </div>
                
                {Math.abs(result.totalChange) > 8 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-medium">
                      {lang === 'fr' 
                        ? 'La variation estimée dépasse la limite de sécurité générale (8 mEq/L/24h).' 
                        : 'Estimated change exceeds general safety limit of 8 mEq/L/24h.'}
                    </p>
                  </div>
                )}

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.weightLabel as string, value: weight },
                    { label: currentText.sexLabel as string, value: currentText[patientType as keyof typeof currentText] as string },
                    { label: currentText.naLabel as string, value: na },
                    { label: currentText.infusateLabel as string, value: infusates.find(i => i.id === infusate)?.label || '' },
                    { label: currentText.fluidVolLabel as string, value: fluidVol }
                  ]}
                  results={[
                    { label: currentText.change1LLabel as string, value: `${result.changePerLiter > 0 ? '+' : ''}${result.changePerLiter} mEq/L` },
                    { label: currentText.finalNaLabel as string, value: `${result.finalNa} mEq/L` }
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
                  ? "Entrez les paramètres du patient pour calculer" 
                  : "Enter patient parameters to calculate"}
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
