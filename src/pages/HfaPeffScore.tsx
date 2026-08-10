import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "HFA-PEFF Score for Heart Failure with Preserved Ejection Fraction (HFpEF)",
    subtitle: "European Society of Cardiology (ESC) diagnostic score for establishing HFpEF",
    functional: "1. Functional Domain (E/e' ratio or septal/lateral velocity)",
    funcMajor: "Major Criteria (+2 pts): E/e' ≥ 15 OR septal e' < 7 cm/s (or lateral < 10 cm/s)",
    funcMinor: "Minor Criteria (+1 pt): E/e' 9-14",
    funcNone: "None (+0 pts)",
    morphological: "2. Morphological Domain (LAVI or LVMI)",
    morphMajor: "Major Criteria (+2 pts): LAVI > 34 mL/m² (SR) or LVMI ≥ 149 g/m² (M) / 115 g/m² (F)",
    morphMinor: "Minor Criteria (+1 pt): LAVI 29-34 mL/m² or LVMI 115-148 g/m² (M) / 95-114 g/m² (F)",
    morphNone: "None (+0 pts)",
    biomarker: "3. Biomarker Domain (NT-proBNP / BNP)",
    bioMajor: "Major Criteria (+2 pts): NT-proBNP > 220 pg/mL (SR) / > 660 pg/mL (AF) OR BNP > 80 pg/mL",
    bioMinor: "Minor Criteria (+1 pt): NT-proBNP 125-220 pg/mL (SR) / 375-660 pg/mL (AF) OR BNP 35-80 pg/mL",
    bioNone: "None (+0 pts)",
    result: "Calculated HFA-PEFF Score",
    highProb: "Score 5 - 6: HFpEF Confirmed. Proceed to etiology workup.",
    modProb: "Score 2 - 4: Intermediate / Unclear. Perform Invasive Hemodynamic Exercise Testing or Stress Echo.",
    lowProb: "Score 0 - 1: HFpEF Unlikely. Investigate non-cardiac causes of dyspnea.",
    clinicalTitle: "ESC Heart Failure Association Guidelines",
    clinicalText: "The HFA-PEFF diagnostic algorithm evaluates 4 steps: P (Pre-test assessment), E (Echocardiographic & Biomarker score), F1 (Functional workup/stress test), F2 (Final etiology). A score ≥ 5 establishes HFpEF diagnosis without requiring invasive cardiac catheterization.",
    references: "References: Pieske B et al. How to diagnose HFpEF: the HFA-PEFF diagnostic algorithm. Eur Heart J 2019; ESC Heart Failure Guidelines 2021.",
  },
  fr: {
    title: "Score HFA-PEFF de l'Insuffisance Cardiaque à Fraction d'Éjection Préservée (ICFEP)",
    subtitle: "Score diagnostique de la Société Européenne de Cardiologie (ESC) pour confirmer l'ICFEP",
    functional: "1. Domaine Fonctionnel (Rapport E/e' ou vélocité tissulaire)",
    funcMajor: "Critère Majeur (+2 pts) : E/e' ≥ 15 OU e' septal < 7 cm/s (ou latéral < 10 cm/s)",
    funcMinor: "Critère Mineur (+1 pt) : E/e' 9-14",
    funcNone: "Aucun (+0 pts)",
    morphological: "2. Domaine Morphologique (LAVI ou LVMI)",
    morphMajor: "Critère Majeur (+2 pts) : LAVI > 34 mL/m² (RS) ou LVMI ≥ 149 g/m² (H) / 115 g/m² (F)",
    morphMinor: "Critère Mineur (+1 pt) : LAVI 29-34 mL/m² ou LVMI 115-148 g/m² (H) / 95-114 g/m² (F)",
    morphNone: "Aucun (+0 pts)",
    biomarker: "3. Domaine Biologique (NT-proBNP / BNP)",
    bioMajor: "Critère Majeur (+2 pts) : NT-proBNP > 220 pg/mL (RS) / > 660 pg/mL (FA) OU BNP > 80 pg/mL",
    bioMinor: "Critère Mineur (+1 pt) : NT-proBNP 125-220 pg/mL (RS) / 375-660 pg/mL (FA) OU BNP 35-80 pg/mL",
    bioNone: "Aucun (+0 pts)",
    result: "Score HFA-PEFF Calculé",
    highProb: "Score 5 - 6 : ICFEP Confirmée. Rechercher l'étiologie (Amylose, etc.).",
    modProb: "Score 2 - 4 : Intermédiaire / Douteux. Épreuve d'effort / Échographie de stress indiquée.",
    lowProb: "Score 0 - 1 : ICFEP Improbable. Explorer les causes non cardiaques de la dyspnée.",
    clinicalTitle: "Recommandations ESC HFA",
    clinicalText: "L'algorithme HFA-PEFF comprend 4 étapes : P (Évaluation pré-test), E (Score écho & biomarqueurs), F1 (Test d'effort), F2 (Étiologie). Un score ≥ 5 confirme le diagnostic d'ICFEP sans cathétérisme invasif systématique.",
    references: "Références : Pieske B et al. Eur Heart J 2019 ; Recommandations ESC Insuffisance Cardiaque 2021.",
  }
};

export default function HfaPeffScore({ lang }: { lang: LangCode }) {
  const [funcPts, setFuncPts] = useState<number>(2);
  const [morphPts, setMorphPts] = useState<number>(2);
  const [bioPts, setBioPts] = useState<number>(2);

  const t = translations[lang] || translations.en;

  const score = useMemo(() => funcPts + morphPts + bioPts, [funcPts, morphPts, bioPts]);

  useEffect(() => {
    trackCalculatorUsage('HfaPeffScore', lang, score);
  }, [lang, score]);

  const interpretation = useMemo(() => {
    if (score >= 5) return { text: t.highProb, color: 'bg-rose-50 text-rose-900 border-rose-200' };
    if (score >= 2) return { text: t.modProb, color: 'bg-amber-50 text-amber-900 border-amber-200' };
    return { text: t.lowProb, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
  }, [score, t]);

  const ehrSummary = `HFA-PEFF Score: ${score}/6 (${interpretation.text})`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/hfa-peff-score" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.functional}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.funcMajor },
                { val: 1, label: t.funcMinor },
                { val: 0, label: t.funcNone },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setFuncPts(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    funcPts === opt.val ? 'bg-teal-50 border-teal-500 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.morphological}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.morphMajor },
                { val: 1, label: t.morphMinor },
                { val: 0, label: t.morphNone },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setMorphPts(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    morphPts === opt.val ? 'bg-teal-50 border-teal-500 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">{t.biomarker}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 2, label: t.bioMajor },
                { val: 1, label: t.bioMinor },
                { val: 0, label: t.bioNone },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setBioPts(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    bioPts === opt.val ? 'bg-teal-50 border-teal-500 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className={`p-6 rounded-2xl border ${interpretation.color} space-y-4`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
                <div className="text-4xl font-black tracking-tight">{score} <span className="text-lg font-bold opacity-75">/ 6</span></div>
                <div className="text-sm font-extrabold mt-1">{interpretation.text}</div>
              </div>
              <ClinicalExportButton
                calculatorName={t.title}
                inputs={[
                  { label: t.functional, value: funcPts },
                  { label: t.morphological, value: morphPts },
                  { label: t.biomarker, value: bioPts },
                ]}
                results={[{ label: t.result, value: `${score}/6 (${interpretation.text})` }]}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Clinical Note */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
