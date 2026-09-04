import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "CRUSADE Bleeding Score in Post-ACS",
    subtitle: "Quantifies in-hospital major bleeding risk in patients with NSTEMI or STEMI undergoing coronary angiography",
    hctTitle: "Baseline Hematocrit (%)",
    crclTitle: "Creatinine Clearance (mL/min)",
    hrTitle: "Heart Rate (bpm)",
    sbpTitle: "Systolic Blood Pressure (mmHg)",
    sexTitle: "Sex",
    male: "Male (0)",
    female: "Female (+8)",
    chfTitle: "Signs of Heart Failure at Presentation",
    vascularTitle: "Prior Vascular Disease (PAD or Stroke)",
    diabetesTitle: "Diabetes Mellitus",
    yes: "Yes",
    no: "No",
    result: "Calculated CRUSADE Score",
    riskTitle: "In-Hospital Major Bleeding Risk",
    references: "Subherwal S, Bach RG, Chen AY, et al. Baseline risk of major bleeding in non-ST-segment-elevation myocardial infarction: the CRUSADE Bleeding Score. Circulation. 2009;119(14):1873-1882. (PMID: 19332463).",
    faqs: [
      { question: "What is the CRUSADE bleeding score?", answer: "The CRUSADE score is a validated risk prediction tool recommended by AHA/ACC and ESC guidelines to stratify the risk of in-hospital major bleeding in patients presenting with acute coronary syndromes (ACS) treated with antithrombotic and invasive therapies." },
      { question: "How does CRUSADE impact antithrombotic therapy?", answer: "Patients with high or very high CRUSADE bleeding risk (score > 40) benefit from bleeding avoidance strategies: radial artery access over femoral access, dose adjustments of anticoagulants for GFR, using bivalirudin or unfractionated heparin with careful monitoring, and PPI co-prescription." }
    ],
    vLow: "Score ≤ 20: Very Low Bleeding Risk (~3.1%)",
    vLowDesc: "Very low risk of major bleeding. Standard dosing of dual antiplatelet therapy (DAPT) and systemic anticoagulation indicated.",
    low: "Score 21 – 30: Low Bleeding Risk (~5.5%)",
    lowDesc: "Low in-hospital bleeding risk. Standard antithrombotic regimens with preferred radial artery access.",
    mod: "Score 31 – 40: Moderate Bleeding Risk (~8.6%)",
    modDesc: "Moderate bleeding hazard. Re-calculate renal dosing for LMWH/DOACs. Ensure proton pump inhibitor (PPI) co-prescription.",
    high: "Score 41 – 50: High Bleeding Risk (~11.9%)",
    highDesc: "High bleeding risk. Mandatory radial vascular access, weight- and renal-adjusted antithrombotics, and cautious glycoprotein IIb/IIIa inhibitor use.",
    vHigh: "Score > 50: Very High Bleeding Risk (~19.5%)",
    vHighDesc: "Extreme bleeding risk approaching 20%. Bleeding avoidance strategies essential: strict radial access, avoid GP IIb/IIIa inhibitors unless bailout, minimize DAPT duration."
  },
  fr: {
    title: "Score CRUSADE (Risque Hémorragique SCA)",
    subtitle: "Évalue le risque d'hémorragie majeure intra-hospitalière chez les patients avec syndrome coronarien aigu",
    hctTitle: "Hématocrite Initial (%)",
    crclTitle: "Clairance de la Créatinine (mL/min)",
    hrTitle: "Fréquence Cardiaque (bpm)",
    sbpTitle: "Pression Artérielle Systolique (mmHg)",
    sexTitle: "Sexe",
    male: "Homme (0)",
    female: "Femme (+8)",
    chfTitle: "Signes d'insuffisance cardiaque à l'admission",
    vascularTitle: "Antécédent vasculaire (AOMI ou AVC)",
    diabetesTitle: "Diabète",
    yes: "Oui",
    no: "Non",
    result: "Score CRUSADE Calculé",
    riskTitle: "Risque d'Hémorragie Majeure Intra-Hospitalière",
    references: "Subherwal S, et al. Circulation. 2009;119(14):1873-1882. (PMID: 19332463).",
    faqs: [
      { question: "À quoi sert le score CRUSADE ?", answer: "Il est recommandé par les sociétés savantes (ESC/AHA) pour quantifier le risque hémorragique lors d'une coronarographie et adapter l'anticoagulation." }
    ],
    vLow: "Score ≤ 20 : Risque Très Faible (~3,1%)",
    vLowDesc: "Risque hémorragique minime. Poursuite des protocoles antithrombotiques usuels.",
    low: "Score 21 – 30 : Risque Faible (~5,5%)",
    lowDesc: "Risque faible. Privilégier l'abord radial.",
    mod: "Score 31 – 40 : Risque Modéré (~8,6%)",
    modDesc: "Adapter les doses d'anticoagulants à la fonction rénale et associer un IPP.",
    high: "Score 41 – 50 : Risque Élevé (~11,9%)",
    highDesc: "Risque élevé. Abord radial impératif, ajustement strict des antithrombotiques.",
    vHigh: "Score > 50 : Risque Très Élevé (~19,5%)",
    vHighDesc: "Risque majeur proche de 20%. Mesures d'épargne hémorragique maximales et réduction de la durée de bithérapie."
  }
};

export default function CrusadeScore({ lang }: { lang: LangCode }) {
  const [hct, setHct] = useState<number | ''>(38);
  const [crcl, setCrcl] = useState<number | ''>(65);
  const [hr, setHr] = useState<number | ''>(78);
  const [sbp, setSbp] = useState<number | ''>(130);
  const [female, setFemale] = useState<boolean>(false);
  const [chf, setChf] = useState<boolean>(false);
  const [vascular, setVascular] = useState<boolean>(false);
  const [diabetes, setDiabetes] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    if (hct === '' || crcl === '' || hr === '' || sbp === '') return null;
    let s = 0;

    // Hematocrit (%)
    const h = Number(hct);
    if (h < 31) s += 9;
    else if (h < 34) s += 7;
    else if (h < 37) s += 3;
    else if (h < 40) s += 2;

    // CrCl (mL/min)
    const c = Number(crcl);
    if (c <= 15) s += 39;
    else if (c <= 30) s += 35;
    else if (c <= 60) s += 28;
    else if (c <= 90) s += 17;
    else if (c <= 120) s += 7;

    // Heart rate (bpm)
    const r = Number(hr);
    if (r <= 70) s += 0;
    else if (r <= 80) s += 1;
    else if (r <= 90) s += 3;
    else if (r <= 100) s += 6;
    else if (r <= 110) s += 8;
    else if (r <= 120) s += 10;
    else s += 11;

    // SBP (mmHg)
    const p = Number(sbp);
    if (p <= 90) s += 10;
    else if (p <= 100) s += 8;
    else if (p <= 120) s += 5;
    else if (p <= 180) s += 1;
    else if (p <= 200) s += 3;
    else s += 5;

    if (female) s += 8;
    if (chf) s += 7;
    if (vascular) s += 6;
    if (diabetes) s += 6;

    return s;
  }, [hct, crcl, hr, sbp, female, chf, vascular, diabetes]);

  useEffect(() => {
    if (score !== null) {
      trackCalculatorUsage('crusade-score', lang, score);
    }
  }, [score, lang]);

  const riskTier = useMemo(() => {
    if (score === null) return null;
    if (score <= 20) return 'vLow';
    if (score <= 30) return 'low';
    if (score <= 40) return 'mod';
    if (score <= 50) return 'high';
    return 'vHigh';
  }, [score]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/crusade-score"
        scoringSystem="CRUSADE Bleeding Score"
        howToSteps={[
          lang === 'fr' ? 'Renseigner l\'hématocrite, clairance rénale, pouls et tension systolique.' : 'Enter baseline hematocrit, CrCl, heart rate, and systolic BP.',
          lang === 'fr' ? 'Indiquer le sexe féminin et les antécédents de diabète, insuffisance cardiaque ou maladie vasculaire.' : 'Check female sex, heart failure signs, diabetes, and vascular disease history.',
          lang === 'fr' ? 'Un score > 40 justifie un abord artériel radial exclusif et la réduction des doses d\'anticoagulants.' : 'Score > 40 indicates high bleeding risk; use radial access and dose-adjusted antithrombotics.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <ShieldAlert className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Cardiologie & Risque Hémorragique' : 'Cardiology & Bleeding Risk'}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.hctTitle}</label>
                <input
                  type="number" step="0.5"
                  value={hct}
                  onChange={(e) => setHct(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.crclTitle}</label>
                <input
                  type="number" step="1"
                  value={crcl}
                  onChange={(e) => setCrcl(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.hrTitle}</label>
                <input
                  type="number" step="1"
                  value={hr}
                  onChange={(e) => setHr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.sbpTitle}</label>
                <input
                  type="number" step="1"
                  value={sbp}
                  onChange={(e) => setSbp(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sex */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.sexTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFemale(false)}
                  className={`py-2 px-3 rounded-xl border font-bold text-sm transition-all ${
                    !female ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.male}
                </button>
                <button
                  type="button"
                  onClick={() => setFemale(true)}
                  className={`py-2 px-3 rounded-xl border font-bold text-sm transition-all ${
                    female ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.female}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {[
                { state: chf, set: setChf, label: currentText.chfTitle, pts: "+7 pts" },
                { state: vascular, set: setVascular, label: currentText.vascularTitle, pts: "+6 pts" },
                { state: diabetes, set: setDiabetes, label: currentText.diabetesTitle, pts: "+6 pts" }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => item.set(!item.state)}
                  className={`w-full flex justify-between items-center p-3 rounded-xl border text-xs font-medium transition-all ${
                    item.state ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-rose-700 font-bold">{item.pts}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  riskTier === 'vLow' ? 'text-emerald-400' : riskTier === 'low' ? 'text-teal-400' : riskTier === 'mod' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {score !== null ? score : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">points</span>
              </div>

              {riskTier && (
                <div className={`p-4 rounded-xl border ${
                  riskTier === 'vLow'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : riskTier === 'low'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : riskTier === 'mod'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {riskTier === 'vLow' ? currentText.vLow : riskTier === 'low' ? currentText.low : riskTier === 'mod' ? currentText.mod : riskTier === 'high' ? currentText.high : currentText.vHigh}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {riskTier === 'vLow' ? currentText.vLowDesc : riskTier === 'low' ? currentText.lowDesc : riskTier === 'mod' ? currentText.modDesc : riskTier === 'high' ? currentText.highDesc : currentText.vHighDesc}
                  </p>
                </div>
              )}

              {score !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Hematocrit", value: `${hct}%` },
                    { label: "CrCl", value: `${crcl} mL/min` },
                    { label: "Heart Rate / SBP", value: `${hr} bpm / ${sbp} mmHg` },
                    { label: "Sex", value: female ? "Female" : "Male" },
                    { label: "Comorbidities", value: [chf && "CHF", vascular && "Vascular", diabetes && "DM"].filter(Boolean).join(', ') || 'None' }
                  ]}
                  results={[
                    { label: "CRUSADE Score", value: `${score} points` },
                    { label: "Bleeding Risk Tier", value: riskTier?.toUpperCase() || '' },
                    { label: "Recommendation", value: score > 40 ? "Radial Access & Bleeding Avoidance Strategies" : "Standard Antithrombotic Care" }
                  ]}
                  formula="CRUSADE Bleeding Risk Equation (Circulation 2009)"
                  disclaimer="Scores > 40 represent high-to-very-high bleeding risk in acute coronary syndromes."
                  references="Subherwal S, et al. Circulation. 2009;119(14):1873-1882."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/19332463/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Subherwal S et al. (2009) Circulation <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
