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
    title: "HAS-BLED Score for Major Bleeding Risk",
    subtitle: "Estimate the 1-year risk of major bleeding in patients with atrial fibrillation",
    hypertension: "Hypertension (Systolic BP > 160 mmHg)",
    renal: "Abnormal renal function (Dialysis, transplant, or Cr > 2.26 mg/dL / 200 µmol/L)",
    liver: "Abnormal liver function (Chronic liver disease or bilirubin > 2x normal, AST/ALT > 3x normal)",
    stroke: "Stroke history",
    bleeding: "Prior major bleeding or predisposition (e.g. anemia)",
    labileInr: "Labile INR (Unstable/high INRs, time in therapeutic range < 60%)",
    elderly: "Elderly (Age > 65 years)",
    drugs: "Medication usage (Concomitant antiplatelet agents or NSAIDs)",
    alcohol: "Alcohol excess (≥ 8 drinks per week)",
    result: "Calculated Score",
    bleedRisk: "Predicted 1-Year Bleed Risk",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Score ≥ 3 indicates 'high risk' of major bleeding. High scores should prompt addressing modifiable risk factors (e.g. uncontrolled BP, NSAID use, alcohol) and closer patient follow-up, rather than automatically withholding anticoagulants.",
    pearls: [
      "HAS-BLED is highly validated and superior to older tools like HEMORR₂HAGES.",
      "A high score is NOT a contraindication to anticoagulation; it helps identify patients who need closer monitoring and treatment of modifiable risk factors.",
      "Modifiable factors: target SBP < 130, stop NSAIDs/aspirin where possible, limit alcohol, optimize warfarin management."
    ],
    pitfalls: [
      "Labile INR criterion is only applicable to patients taking Vitamin K Antagonists (Warfarin). If the patient is on a DOAC, this point is typically scored as 0."
    ],
    evidence: "Each criterion is assigned 1 point. Total score ranges from 0 to 9.",
    references: "Pisters R, et al. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest 2010;138:1093-1100."
  },
  fr: {
    title: "Score HAS-BLED (Risque Hémorragique)",
    subtitle: "Estimer le risque de saignement majeur à 1 an chez les patients en fibrillation auriculaire",
    hypertension: "Hypertension artérielle (PAS > 160 mmHg)",
    renal: "Insuffisance rénale (Dialyse, transplantation, ou Créat > 200 µmol/L)",
    liver: "Insuffisance hépatique (Cirrhose, bilirubine > 2x la normale, transaminases > 3x la normale)",
    stroke: "Antécédent d'AVC",
    bleeding: "Antécédent d'hémorragie majeure ou prédisposition (ex: anémie sévère)",
    labileInr: "INR labile (Temps dans la cible thérapeutique < 60% sous warfarine)",
    elderly: "Âge > 65 ans",
    drugs: "Médicaments favorisant les saignements (Antiagrégants, AINS)",
    alcohol: "Consommation excessive d'alcool (≥ 8 verres par semaine)",
    result: "Score Calculé",
    bleedRisk: "Risque Hémorragique Estimé à 1 An",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Un score ≥ 3 indique un risque hémorragique élevé. Ce score doit inciter à corriger les facteurs modifiables (HTA non contrôlée, AINS, alcool) et à assurer un suivi rapproché, plutôt qu'à refuser systématiquement l'anticoagulation.",
    pearls: [
      "Le score HAS-BLED est l'outil de référence validé par les recommandations européennes (ESC).",
      "Un score élevé n'est PAS une contre-indication à l'anticoagulation ; il sert à identifier les patients nécessitant une surveillance accrue.",
      "Facteurs modifiables majeurs : contrôle de la PAS < 130 mmHg, arrêt des AINS/Aspirine inutiles, sevrage d'alcool."
    ],
    pitfalls: [
      "Le critère INR labile s'applique uniquement aux patients sous antivitamines K (Sintrom, Coumadine). Si le patient prend un AOD (Eliquis, Xarelto), ce point est compté à 0."
    ],
    evidence: "Chaque critère présent attribue 1 point. Score total de 0 à 9.",
    references: "Pisters R, et al. A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey. Chest 2010;138:1093-1100."
  }
};

const itemsList = [
  { key: 'hypertension', points: 1 },
  { key: 'renal', points: 1 },
  { key: 'liver', points: 1 },
  { key: 'stroke', points: 1 },
  { key: 'bleeding', points: 1 },
  { key: 'labileInr', points: 1 },
  { key: 'elderly', points: 1 },
  { key: 'drugs', points: 1 },
  { key: 'alcohol', points: 1 },
] as const;

export default function HasBledScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang] || translations.en;

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      return acc + (selections[item.key] ? item.points : 0);
    }, 0);
  }, [selections]);

  const riskEstimate = useMemo(() => {
    // Risk percentages based on Euro Heart Survey data:
    // 0: 1.13%, 1: 1.02%, 2: 1.88%, 3: 3.74%, 4: 8.70%, 5: 12.5%, >5: >12.5%
    const rates: Record<number, string> = {
      0: "1.13%",
      1: "1.02%",
      2: "1.88%",
      3: "3.74%",
      4: "8.70%",
      5: "12.5%",
    };
    return rates[scoreValue] || "> 12.5%";
  }, [scoreValue]);

  useEffect(() => {
    if (scoreValue !== 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('has-bled', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}has-bled`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}has-bled`,
            "name": currentText.title,
            "description": currentText.subtitle,
            "inLanguage": lang,
            "about": {
              "@type": "MedicalCondition",
              "name": "Atrial Fibrillation",
              "code": {
                "@type": "MedicalCode",
                "codingSystem": "ICD-10",
                "code": "I48.91"
              }
            }
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title,
            "description": currentText.subtitle,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}has-bled`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Cardiology"
            }
          }
        ]
      }} />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-red-500/5 via-teal-500/5 to-purple-500/5 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 bg-clip-text text-transparent mb-3">
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="has-bled" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-4">
            
            {itemsList.map((item) => (
              <button
                key={item.key}
                onClick={() => toggleSelection(item.key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  selections[item.key]
                    ? 'bg-red-50 border-red-200 text-red-950 shadow-sm'
                    : 'bg-gray-50 border-gray-150 hover:bg-gray-100/70 text-gray-700'
                }`}
              >
                <span className="text-sm font-semibold pr-4 leading-normal">{currentText[item.key]}</span>
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                  selections[item.key]
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  +1
                </span>
              </button>
            ))}

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
              {currentText.result}
            </h3>

            <div className="space-y-6">
              <div>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300 font-mono">
                  {scoreValue} <span className="text-xl font-bold">/ 9</span>
                </span>
              </div>

              <div>
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  {currentText.bleedRisk}
                </span>
                <span className="text-2xl font-black text-red-400 font-mono">
                  {riskEstimate}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-red-400" />
                  {currentText.clinicalTitle}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentText.clinicalText}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end px-2">
            <ClinicalExportButton
              lang={lang}
              calculatorName={currentText.title}
              inputs={itemsList.map(item => ({
                label: currentText[item.key as keyof typeof currentText] as string,
                value: selections[item.key] ? "Yes" : "No"
              }))}
              results={[
                { label: currentText.result as string, value: `${scoreValue} / 9` },
                { label: currentText.bleedRisk as string, value: riskEstimate }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
