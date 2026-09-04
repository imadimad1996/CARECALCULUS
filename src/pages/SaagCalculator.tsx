import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Droplets } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Serum-Ascites Albumin Gradient (SAAG)",
    subtitle: "Differentiates portal hypertension from peritoneal etiologies of ascites",
    serumAlb: "Serum Albumin (g/dL)",
    asciticAlb: "Ascitic Fluid Albumin (g/dL)",
    asciticProtein: "Ascitic Fluid Total Protein [optional] (g/dL)",
    result: "Calculated SAAG",
    formula: "SAAG = Serum Albumin (g/dL) − Ascitic Fluid Albumin (g/dL)",
    clinicalTitle: "Pathophysiological Etiology & Ascites Classification",
    references: "Runyon BA, Montano AA, Akriviadis EA, Antillon MR, Novak MA, Hathcock KD. The serum-ascites albumin gradient is superior to the exudate-transudate concept in the differential diagnosis of ascites. Ann Intern Med. 1992;117(3):215-220. (PMID: 1616215).",
    faqs: [
      { question: "What is the SAAG?", answer: "The Serum-Ascites Albumin Gradient (SAAG) is calculated by subtracting ascitic fluid albumin from serum albumin measured on the same day. It replaces the outdated transudate/exudate classification of ascites with >97% diagnostic accuracy for portal hypertension." },
      { question: "What does SAAG ≥ 1.1 g/dL mean?", answer: "A high gradient (≥ 1.1 g/dL) indicates portal hypertension (sinusoidal or post-sinusoidal pressure elevation), most commonly due to cirrhosis, alcoholic hepatitis, or congestive heart failure." },
      { question: "What does SAAG < 1.1 g/dL mean?", answer: "A low gradient (< 1.1 g/dL) excludes portal hypertension and indicates peritoneal or inflammatory processes, such as peritoneal carcinomatosis, peritoneal tuberculosis, nephrotic syndrome, or pancreatic ascites." }
    ],
    highGradient: "High Gradient (SAAG ≥ 1.1 g/dL) — Portal Hypertension",
    highGradientDesc: "Indicates portal hypertension with >97% diagnostic accuracy. Common causes: Cirrhosis, heart failure, Budd-Chiari syndrome, portal vein thrombosis.",
    lowGradient: "Low Gradient (SAAG < 1.1 g/dL) — Normal Portal Pressure",
    lowGradientDesc: "Portal hypertension is excluded. Indicates peritoneal disease or hypoproteinemia. Common causes: Peritoneal carcinomatosis, peritoneal TB, pancreatitis, nephrotic syndrome."
  },
  fr: {
    title: "Gradient d'Albumine Sérum-Ascite (GASA)",
    subtitle: "Distingue l'hypertension portale des causes péritonéales d'ascite",
    serumAlb: "Albumine Sérique (g/dL)",
    asciticAlb: "Albumine du Liquide d'Ascite (g/dL)",
    asciticProtein: "Protéines Totales de l'Ascite [optionnel] (g/dL)",
    result: "GASA Calculé",
    formula: "GASA = Albumine Sérique − Albumine de l'Ascite",
    clinicalTitle: "Étiologie et Classification de l'Ascite",
    references: "Runyon BA, et al. Ann Intern Med. 1992;117(3):215-220. (PMID: 1616215).",
    faqs: [
      { question: "Qu'est-ce que le GASA (SAAG) ?", answer: "Le gradient d'albumine sérum-ascite est la différence entre la concentration d'albumine sérique et celle de l'ascite prélevées le même jour. Il remplace le concept désuet de transsudat/exsudat avec 97% de précision." },
      { question: "Que signifie un GASA ≥ 1,1 g/dL ?", answer: "Un gradient élevé (≥ 1,1 g/dL ou ≥ 11 g/L) signe une hypertension portale (cirrhose, insuffisance cardiaque droite, syndrome de Budd-Chiari)." },
      { question: "Que signifie un GASA < 1,1 g/dL ?", answer: "Un gradient bas (< 1,1 g/dL) exclut l'hypertension portale et oriente vers une pathologie péritonéale (carcinose péritonéale, tuberculose péritonéale, ascite pancréatique, syndrome néphrotique)." }
    ],
    highGradient: "Gradient Élevé (GASA ≥ 1,1 g/dL) — Hypertension Portale",
    highGradientDesc: "Affirme une hypertension portale avec une précision > 97%. Étiologies principales : Cirrhose hépatique, insuffisance cardiaque congestive, Budd-Chiari.",
    lowGradient: "Gradient Bas (GASA < 1,1 g/dL) — Pression Portale Normale",
    lowGradientDesc: "Hypertension portale exclue. Signe une atteinte péritonéale ou hypoalbuminémie sévère : Carcinose péritonéale, tuberculose, pancréatite, syndrome néphrotique."
  }
};

export default function SaagCalculator({ lang }: { lang: LangCode }) {
  const [serumAlb, setSerumAlb] = useState<number | ''>(3.5);
  const [asciticAlb, setAsciticAlb] = useState<number | ''>(1.8);
  const [asciticProt, setAsciticProt] = useState<number | ''>('');

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (serumAlb === '' || asciticAlb === '') return null;
    const s = Number(serumAlb);
    const a = Number(asciticAlb);
    return s - a;
  }, [serumAlb, asciticAlb]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('saag-calculator', lang, result);
    }
  }, [result, lang]);

  const interpretation = useMemo(() => {
    if (result === null) return null;
    const isHigh = result >= 1.1;
    let subDesc = "";
    if (asciticProt !== '') {
      const p = Number(asciticProt);
      if (isHigh) {
        if (p < 2.5) {
          subDesc = lang === 'fr' ? "Protéines < 2,5 g/dL : Hautement évocateur de cirrhose non compliquée." : "Protein < 2.5 g/dL: Strongly suggests uncomplicated liver cirrhosis.";
        } else {
          subDesc = lang === 'fr' ? "Protéines ≥ 2,5 g/dL : Évocateur d'ascite cardiaque (IC droite, péricardite constrictive) ou Budd-Chiari débutant." : "Protein ≥ 2.5 g/dL: Suggests cardiac ascites (CHF, constrictive pericarditis) or early Budd-Chiari.";
        }
      } else {
        if (p >= 2.5) {
          subDesc = lang === 'fr' ? "Protéines ≥ 2,5 g/dL : Évocateur de carcinose péritonéale ou tuberculose." : "Protein ≥ 2.5 g/dL: Suggests peritoneal carcinomatosis or peritoneal tuberculosis.";
        } else {
          subDesc = lang === 'fr' ? "Protéines < 2,5 g/dL : Évocateur de syndrome néphrotique sévère." : "Protein < 2.5 g/dL: Suggests profound nephrotic syndrome or enteropathy.";
        }
      }
    }

    return {
      isHigh,
      label: isHigh ? currentText.highGradient : currentText.lowGradient,
      desc: isHigh ? currentText.highGradientDesc : currentText.lowGradientDesc,
      subDesc,
      badge: isHigh ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-purple-50 text-purple-800 border-purple-200',
      color: isHigh ? 'text-blue-600' : 'text-purple-600'
    };
  }, [result, asciticProt, currentText, lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/saag-calculator"
        scoringSystem="Serum-Ascites Albumin Gradient"
        howToSteps={[
          lang === 'fr' ? 'Mesurer l\'albumine sérique et l\'albumine de l\'ascite le même jour.' : 'Obtain serum albumin and ascitic fluid albumin on the same day.',
          lang === 'fr' ? 'Soustraire l\'albumine ascitique de l\'albumine sérique : GASA = Sérum − Ascite.' : 'Calculate difference: SAAG = Serum Albumin − Ascitic Albumin.',
          lang === 'fr' ? 'GASA ≥ 1,1 g/dL signe une hypertension portale (>97% de précision).' : 'SAAG ≥ 1.1 g/dL establishes portal hypertension with >97% diagnostic accuracy.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
          <Droplets className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Hépatologie & Gastroentérologie' : 'Hepatology & Gastroenterology'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.serumAlb}</label>
              <input
                type="number" inputMode="decimal" step="0.1"
                value={serumAlb}
                onChange={(e) => setSerumAlb(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.asciticAlb}</label>
              <input
                type="number" inputMode="decimal" step="0.1"
                value={asciticAlb}
                onChange={(e) => setAsciticAlb(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1.5">{currentText.asciticProtein}</label>
              <input
                type="number" inputMode="decimal" step="0.1"
                value={asciticProt}
                placeholder="e.g. 1.8 g/dL"
                onChange={(e) => setAsciticProt(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-lg font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-5xl md:text-6xl font-extrabold tracking-tight">
                  {result !== null ? result.toFixed(2) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">g/dL</span>
              </div>

              {interpretation && (
                <div className={`p-4 rounded-xl border ${interpretation.badge}`}>
                  <div className="font-bold text-sm mb-1">{interpretation.label}</div>
                  <p className="text-xs leading-relaxed opacity-90">{interpretation.desc}</p>
                  {interpretation.subDesc && (
                    <p className="text-xs font-semibold mt-2 pt-2 border-t border-gray-200/50">{interpretation.subDesc}</p>
                  )}
                </div>
              )}

              {result !== null && interpretation && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Serum Albumin", value: `${serumAlb} g/dL` },
                    { label: "Ascitic Albumin", value: `${asciticAlb} g/dL` },
                    { label: "Ascitic Total Protein", value: asciticProt !== '' ? `${asciticProt} g/dL` : "Not entered" }
                  ]}
                  results={[
                    { label: "Calculated SAAG", value: result.toFixed(2), unit: "g/dL" },
                    { label: "Portal Hypertension", value: interpretation.isHigh ? "Present (High Gradient ≥ 1.1)" : "Absent (Low Gradient < 1.1)" },
                    { label: "Etiological Diagnostic Summary", value: interpretation.subDesc || interpretation.desc }
                  ]}
                  formula={currentText.formula}
                  disclaimer="SAAG >= 1.1 g/dL indicates portal hypertension with 97% diagnostic accuracy."
                  references="Runyon BA, et al. Ann Intern Med. 1992;117(3):215-220."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-blue-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/1616215/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Runyon BA et al. (1992) Ann Intern Med <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
