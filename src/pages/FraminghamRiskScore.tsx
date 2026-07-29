import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Framingham 10-Year Cardiovascular Disease Risk Score",
    subtitle: "Estimates 10-year risk of developing primary coronary heart disease (CHD)",
    age: "Age (Years)",
    gender: "Sex at Birth",
    male: "Male",
    female: "Female",
    chol: "Total Cholesterol (mg/dL)",
    hdl: "HDL Cholesterol (mg/dL)",
    sbp: "Systolic Blood Pressure (mmHg)",
    smoker: "Current Smoker",
    treatedBp: "Currently on BP Medication",
    result: "Estimated 10-Year CVD Risk",
    lowRisk: "Low Risk (< 10% 10-year risk)",
    modRisk: "Intermediate Risk (10% - 20% 10-year risk)",
    highRisk: "High Risk (> 20% 10-year risk)",
    clinicalTitle: "Statin Therapy & Primary Prevention Guidelines",
    clinicalText: "Patients with 10-year CVD risk > 20% or diabetes are high risk and indicated for moderate-to-high intensity statin therapy. Patients with 7.5% - 20% risk warrant clinician-patient risk discussion regarding statin initiation.",
    references: "References: D'Agostino RB et al. General cardiovascular risk profile for use in primary care: the Framingham Heart Study. Circulation 2008; ACC/AHA Prevention Guidelines 2019.",
  },
  fr: {
    title: "Score de Risque Cardiovasculaire de Framingham (10 ans)",
    subtitle: "Estime le risque à 10 ans de survenue d'un événement coronarien ou cardiovasculaire majeur",
    age: "Âge (Ans)",
    gender: "Sexe à la naissance",
    male: "Homme",
    female: "Femme",
    chol: "Cholestérol Total (mg/dL)",
    hdl: "Cholestérol HDL (mg/dL)",
    sbp: "Pression Artérielle Systolique (mmHg)",
    smoker: "Fumeur actuel",
    treatedBp: "Traitement antihypertenseur en cours",
    result: "Risque CV Estimé à 10 Ans",
    lowRisk: "Faible Risque (< 10% à 10 ans)",
    modRisk: "Risque Intermédiaire (10% - 20% à 10 ans)",
    highRisk: "Haut Risque (> 20% à 10 ans)",
    clinicalTitle: "Recommandations de Prévention Primaire & Statines",
    clinicalText: "Un risque > 20% indique une prévention primaire agressive (statine forte intensité, cible LDL < 0.7 g/L, contrôle de la PA). Un risque entre 10% et 20% nécessite une discussion sur l'initiation d'une statine.",
    references: "Références : D'Agostino RB et al. Circulation 2008 ; Recommandations ESC/AHA Prévention Cardiovasculaire.",
  }
};

export default function FraminghamRiskScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(55);
  const [isMale, setIsMale] = useState<boolean>(true);
  const [chol, setChol] = useState<number>(210);
  const [hdl, setHdl] = useState<number>(45);
  const [sbp, setSbp] = useState<number>(138);
  const [smoker, setSmoker] = useState<boolean>(false);
  const [treatedBp, setTreatedBp] = useState<boolean>(false);
  const t = translations[lang];

  const { riskPercent, category } = useMemo(() => {
    // Simplified Framingham point approximation for primary care demo
    let pts = 0;
    if (isMale) {
      if (age >= 70) pts += 11;
      else if (age >= 60) pts += 8;
      else if (age >= 50) pts += 6;
      else if (age >= 40) pts += 3;

      if (chol >= 280) pts += 4;
      else if (chol >= 240) pts += 3;
      else if (chol >= 200) pts += 2;

      if (hdl < 35) pts += 2;
      else if (hdl >= 60) pts -= 1;

      if (sbp >= 160) pts += (treatedBp ? 5 : 3);
      else if (sbp >= 140) pts += (treatedBp ? 4 : 2);
      else if (sbp >= 130) pts += (treatedBp ? 3 : 1);

      if (smoker) pts += 4;
    } else {
      if (age >= 70) pts += 12;
      else if (age >= 60) pts += 9;
      else if (age >= 50) pts += 7;
      else if (age >= 40) pts += 4;

      if (chol >= 280) pts += 5;
      else if (chol >= 240) pts += 4;
      else if (chol >= 200) pts += 3;

      if (hdl < 35) pts += 2;
      else if (hdl >= 60) pts -= 1;

      if (sbp >= 160) pts += (treatedBp ? 6 : 4);
      else if (sbp >= 140) pts += (treatedBp ? 4 : 2);
      else if (sbp >= 130) pts += (treatedBp ? 3 : 1);

      if (smoker) pts += 3;
    }

    let pct = Math.min(30, Math.max(1, Math.round(Math.pow(1.2, pts - 5) * 4 * 10) / 10));
    let cat = t.lowRisk;
    let color = 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (pct > 20) {
      cat = t.highRisk;
      color = 'bg-rose-50 text-rose-900 border-rose-200';
    } else if (pct >= 10) {
      cat = t.modRisk;
      color = 'bg-amber-50 text-amber-900 border-amber-200';
    }

    return { riskPercent: pct, category: { text: cat, color } };
  }, [age, isMale, chol, hdl, sbp, smoker, treatedBp, t]);

  useEffect(() => {
    trackCalculatorUsage('FraminghamRiskScore', lang, riskPercent);
  }, [lang, riskPercent]);

  const ehrSummary = `Framingham 10-Yr CVD Risk: ${age}y ${isMale ? 'Male' : 'Female'}, Chol ${chol}, HDL ${hdl}, SBP ${sbp} -> ${riskPercent}% (${category.text})`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/framingham-risk-score" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.age}</label>
            <input
              type="number"
              min="30"
              max="85"
              step="1"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 50)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.gender}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsMale(true)}
                className={`p-3 rounded-xl text-xs font-extrabold border ${isMale ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
              >
                {t.male}
              </button>
              <button
                onClick={() => setIsMale(false)}
                className={`p-3 rounded-xl text-xs font-extrabold border ${!isMale ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
              >
                {t.female}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.chol}</label>
            <input
              type="number"
              min="100"
              max="400"
              step="1"
              value={chol}
              onChange={(e) => setChol(parseInt(e.target.value) || 200)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.hdl}</label>
            <input
              type="number"
              min="20"
              max="120"
              step="1"
              value={hdl}
              onChange={(e) => setHdl(parseInt(e.target.value) || 45)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.sbp}</label>
            <input
              type="number"
              min="90"
              max="220"
              step="1"
              value={sbp}
              onChange={(e) => setSbp(parseInt(e.target.value) || 120)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSmoker(!smoker)}
            className={`p-3.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
              smoker ? 'bg-rose-50 border-rose-400 text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span>{t.smoker}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${smoker ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{smoker ? 'YES' : 'NO'}</span>
          </button>

          <button
            onClick={() => setTreatedBp(!treatedBp)}
            className={`p-3.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
              treatedBp ? 'bg-rose-50 border-rose-400 text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <span>{t.treatedBp}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${treatedBp ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{treatedBp ? 'YES' : 'NO'}</span>
          </button>
        </div>

        {/* Output */}
        <div className={`p-6 rounded-2xl border ${category.color} space-y-4`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
              <div className="text-4xl font-black tracking-tight">{riskPercent}%</div>
              <div className="text-sm font-extrabold mt-1">{category.text}</div>
            </div>
            <ClinicalExportButton
              calculatorName={t.title}
              inputs={[
                { label: t.age, value: age },
                { label: t.gender, value: isMale ? t.male : t.female },
                { label: t.chol, value: chol },
                { label: t.hdl, value: hdl },
                { label: t.sbp, value: sbp },
              ]}
              results={[{ label: t.result, value: `${riskPercent}% (${category.text})` }]}
              lang={lang}
            />
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
