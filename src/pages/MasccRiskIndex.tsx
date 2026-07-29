import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "MASCC Risk Index for Febrile Neutropenia",
    subtitle: "Identifies cancer patients with febrile neutropenia at low risk of serious medical complications",
    burden: "Burden of Febrile Neutropenia Illness",
    burdenNone: "No or mild symptoms (+5)",
    burdenMod: "Moderate symptoms (+3)",
    burdenSev: "Severe symptoms (+0)",
    hypotension: "No Hypotension (Systolic BP > 90 mmHg) (+5)",
    copd: "No Chronic Obstructive Pulmonary Disease (COPD) (+4)",
    solidTumor: "Solid Tumor OR Hematologic Malignancy without previous fungal infection (+4)",
    dehydration: "No Dehydration requiring IV fluids (+3)",
    outpatient: "Onset of fever as Outpatient (at home) (+3)",
    age: "Age < 60 years (+2)",
    result: "Calculated MASCC Score",
    lowRisk: "Low Risk for Complications (Score ≥ 21): Outpatient oral antibiotics suitable",
    highRisk: "High Risk for Complications (Score < 21): Inpatient IV empiric antibiotics required",
    clinicalTitle: "ASCO & ESMO Guidelines",
    clinicalText: "Patients with MASCC score ≥ 21 have < 5% risk of severe complications and < 1% mortality. They may be candidates for early discharge and oral fluoroquinolone + amoxicillin/clavulanate therapy after initial evaluation.",
    references: "References: Klastersky J et al. The Multinational Association for Supportive Care in Cancer risk index. J Clin Oncol 2000; ASCO/IDSA Guideline 2018.",
  },
  fr: {
    title: "Score MASCC de la Neutropénie Fébrile",
    subtitle: "Identifie les patients en oncologie à faible risque de complications lors d'une aplasie fébrile",
    burden: "Fardeau des symptômes de la neutropénie fébrile",
    burdenNone: "Symptômes nuls ou légers (+5)",
    burdenMod: "Symptômes modérés (+3)",
    burdenSev: "Symptômes sévères (+0)",
    hypotension: "Absence d'hypotension (PAS > 90 mmHg) (+5)",
    copd: "Absence de BPCO (+4)",
    solidTumor: "Tumeur solide OU Hémopathie sans antécédent d'infection fongique (+4)",
    dehydration: "Absence de déshydratation nécessitant réhydratation IV (+3)",
    outpatient: "Fièvre survenue en Ambulatoire (à domicile) (+3)",
    age: "Âge < 60 ans (+2)",
    result: "Score MASCC Calculé",
    lowRisk: "Faible risque de complications (Score ≥ 21) : Traitement oral ambulatoire envisageable",
    highRisk: "Haut risque de complications (Score < 21) : Hospitalisation & Antibiotiques IV impératifs",
    clinicalTitle: "Recommandations ASCO & ESMO",
    clinicalText: "Les patients ayant un score MASCC ≥ 21 présentent un risque de complications < 5% et une mortalité < 1%. Une prise en charge ambulatoire par fluoroquinolone orale + amoxicilline/acide clavulanique est possible après évaluation.",
    references: "Références : Klastersky J et al. J Clin Oncol 2000 ; Recommandations ASCO/IDSA 2018.",
  }
};

export default function MasccRiskIndex({ lang }: { lang: LangCode }) {
  const [burden, setBurden] = useState<number>(5);
  const [noHypotension, setNoHypotension] = useState<boolean>(true);
  const [noCopd, setNoCopd] = useState<boolean>(true);
  const [solidTumor, setSolidTumor] = useState<boolean>(true);
  const [noDehydration, setNoDehydration] = useState<boolean>(true);
  const [outpatient, setOutpatient] = useState<boolean>(true);
  const [ageUnder60, setAgeUnder60] = useState<boolean>(true);
  const t = translations[lang];

  const score = useMemo(() => {
    let s = burden;
    if (noHypotension) s += 5;
    if (noCopd) s += 4;
    if (solidTumor) s += 4;
    if (noDehydration) s += 3;
    if (outpatient) s += 3;
    if (ageUnder60) s += 2;
    return s;
  }, [burden, noHypotension, noCopd, solidTumor, noDehydration, outpatient, ageUnder60]);

  useEffect(() => {
    trackCalculatorUsage('MasccRiskIndex', lang, score);
  }, [lang, score]);

  const interpretation = useMemo(() => {
    if (score >= 21) return { text: t.lowRisk, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' };
    return { text: t.highRisk, color: 'bg-rose-50 text-rose-900 border-rose-200' };
  }, [score, t]);

  const ehrSummary = `MASCC Febrile Neutropenia Score: ${score}/26 (${score >= 21 ? 'Low Risk' : 'High Risk'})`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/mascc-risk-index" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.burden}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 5, label: t.burdenNone },
                { val: 3, label: t.burdenMod },
                { val: 0, label: t.burdenSev },
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setBurden(opt.val)}
                  className={`p-3 rounded-xl text-xs font-bold text-left border transition-all ${
                    burden === opt.val ? 'bg-purple-50 border-purple-500 text-purple-950' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {[
            { state: noHypotension, setter: setNoHypotension, label: t.hypotension },
            { state: noCopd, setter: setNoCopd, label: t.copd },
            { state: solidTumor, setter: setSolidTumor, label: t.solidTumor },
            { state: noDehydration, setter: setNoDehydration, label: t.dehydration },
            { state: outpatient, setter: setOutpatient, label: t.outpatient },
            { state: ageUnder60, setter: setAgeUnder60, label: t.age },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.setter(!item.state)}
              className={`w-full p-3.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                item.state ? 'bg-purple-50 border-purple-300 text-purple-950' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <span>{item.label}</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold ${item.state ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {item.state ? 'YES' : 'NO'}
              </span>
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className={`p-6 rounded-2xl border ${interpretation.color} space-y-4`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
                <div className="text-4xl font-black tracking-tight">{score} <span className="text-lg font-bold opacity-75">/ 26</span></div>
                <div className="text-sm font-extrabold mt-1">{interpretation.text}</div>
              </div>
              <ClinicalExportButton
                calculatorName={t.title}
                inputs={[{ label: t.burden, value: burden }]}
                results={[{ label: t.result, value: `${score}/26 (${interpretation.text})` }]}
                lang={lang}
              />
            </div>
          </div>
        </div>

        {/* Clinical Note */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
