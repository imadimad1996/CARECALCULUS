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
    title: "Free Water Deficit in Hypernatremia",
    subtitle: "Calculate water deficit to safely correct hypernatremia",
    weightLabel: "Weight (kg)",
    naLabel: "Current Serum Sodium (mEq/L)",
    targetNaLabel: "Target Serum Sodium (mEq/L)",
    sexLabel: "Patient Sex & Age Group",
    child: "Child",
    adultMale: "Adult Male",
    adultFemale: "Adult Female",
    elderlyMale: "Elderly Male",
    elderlyFemale: "Elderly Female",
    resultTitle: "Estimated Deficit",
    deficitLabel: "Free Water Deficit",
    liters: "Liters",
    clinicalTitle: "Clinical Context",
    clinicalText: "The Free Water Deficit formula estimates the amount of pure water required to correct hypernatremia back to a target sodium level.",
    pearls: [
      "Target sodium is typically 140 mEq/L, but may be higher if correcting chronic hypernatremia to prevent cerebral edema.",
      "Correction rate should generally not exceed 0.5 mEq/L/hour or 10-12 mEq/L/day in chronic hypernatremia.",
      "In acute hypernatremia (< 48h), correction can be more rapid (1 mEq/L/hour)."
    ],
    pitfalls: [
      "This formula assumes pure water loss. If the patient has concurrent isotonic fluid loss, they will also need volume resuscitation with isotonic crystalloids.",
      "Enteral free water is preferred when possible. If giving IV, use D5W or hypotonic saline, accounting for the sodium content of the fluid."
    ],
    evidence: "Free Water Deficit = TBW × ((Current Na / Target Na) - 1)",
    references: "Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med. 2000;342(20):1493-1499."
  },
  fr: {
    title: "Déficit en Eau Libre (Hypernatrémie)",
    subtitle: "Calculer le déficit en eau pour corriger l'hypernatrémie en toute sécurité",
    weightLabel: "Poids (kg)",
    naLabel: "Sodium Sérique Actuel (mEq/L)",
    targetNaLabel: "Sodium Cible (mEq/L)",
    sexLabel: "Sexe et Âge du Patient",
    child: "Enfant",
    adultMale: "Homme Adulte",
    adultFemale: "Femme Adulte",
    elderlyMale: "Homme Âgé",
    elderlyFemale: "Femme Âgée",
    resultTitle: "Déficit Estimé",
    deficitLabel: "Déficit en Eau Libre",
    liters: "Litres",
    clinicalTitle: "Contexte Clinique",
    clinicalText: "La formule du déficit en eau libre estime la quantité d'eau pure nécessaire pour corriger l'hypernatrémie vers un taux de sodium cible.",
    pearls: [
      "Le sodium cible est généralement de 140 mEq/L, mais peut être plus élevé en cas d'hypernatrémie chronique pour prévenir l'œdème cérébral.",
      "La vitesse de correction ne doit généralement pas dépasser 0,5 mEq/L/heure ou 10 à 12 mEq/L/jour dans l'hypernatrémie chronique.",
      "En cas d'hypernatrémie aiguë (< 48h), la correction peut être plus rapide (1 mEq/L/heure)."
    ],
    pitfalls: [
      "Cette formule suppose une perte d'eau pure. Si le patient présente une perte liquidienne isotonique associée, il aura également besoin d'une réanimation volémique.",
      "L'eau libre par voie entérale est privilégiée. En cas de voie IV, utiliser du G5% ou du sérum salé hypotonique."
    ],
    evidence: "Déficit en eau = Eau Corporelle Totale (ECT) × ((Na Actuel / Na Cible) - 1)",
    references: "Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med. 2000;342(20):1493-1499."
  }
};

const tbwFactors = {
  child: 0.6,
  adultMale: 0.6,
  adultFemale: 0.5,
  elderlyMale: 0.5,
  elderlyFemale: 0.45
};

export default function FreeWaterDeficit({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('70');
  const [na, setNa] = useState<string>('155');
  const [targetNa, setTargetNa] = useState<string>('140');
  const [patientType, setPatientType] = useState<keyof typeof tbwFactors>('adultMale');

  const currentText = translations[lang] || translations.en;

  const w = parseFloat(weight) || 0;
  const currentNa = parseFloat(na) || 0;
  const tNa = parseFloat(targetNa) || 0;

  const deficit = useMemo(() => {
    if (w <= 0 || currentNa <= 0 || tNa <= 0 || currentNa <= tNa) return null;
    const factor = tbwFactors[patientType];
    const tbw = w * factor;
    const res = tbw * ((currentNa / tNa) - 1);
    return Math.round(res * 100) / 100;
  }, [w, currentNa, tNa, patientType]);

  useEffect(() => {
    if (deficit !== null && deficit > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('free-water-deficit', lang, deficit);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [deficit, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}free-water-deficit`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}free-water-deficit`,
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "inLanguage": lang
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title as string,
            "description": currentText.subtitle as string,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}free-water-deficit`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Nephrology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-blue-500/5 to-teal-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/50 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Droplet className="w-3.5 h-3.5" />
          <span>Nephrology</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          {currentText.title as string}
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          {currentText.subtitle as string}
        </p>
        <div className="mt-4 flex gap-3">
          <EmbedCodeButton calculatorSlug="free-water-deficit" lang={lang} title={currentText.title as string} />
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
                          ? 'bg-cyan-50 border-cyan-600 text-cyan-700 shadow-sm ring-1 ring-cyan-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/30'
                      }`}
                    >
                      {currentText[type as keyof typeof currentText] as string}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700">
                  {currentText.weightLabel as string}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-lg"
                  placeholder="70"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    {currentText.naLabel as string}
                  </label>
                  <input
                    type="number"
                    value={na}
                    onChange={(e) => setNa(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-lg"
                    placeholder="155"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">
                    {currentText.targetNaLabel as string}
                  </label>
                  <input
                    type="number"
                    value={targetNa}
                    onChange={(e) => setTargetNa(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono text-lg"
                    placeholder="140"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              {currentText.resultTitle as string}
            </h3>

            {deficit !== null ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-5 rounded-2xl border text-cyan-800 bg-cyan-500/10 border-cyan-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-sm font-bold opacity-80 mb-1">{currentText.deficitLabel as string}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">{deficit.toFixed(1)}</span>
                    <span className="text-lg font-semibold opacity-80">{currentText.liters as string}</span>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title as string}
                  inputs={[
                    { label: currentText.weightLabel as string, value: weight },
                    { label: currentText.sexLabel as string, value: currentText[patientType as keyof typeof currentText] as string },
                    { label: currentText.naLabel as string, value: na },
                    { label: currentText.targetNaLabel as string, value: targetNa }
                  ]}
                  results={[
                    { label: currentText.deficitLabel as string, value: `${deficit.toFixed(1)} ${currentText.liters as string}` }
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
                  ? "Entrez le poids et un sodium actuel > sodium cible" 
                  : "Enter weight and a current sodium > target sodium"}
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
