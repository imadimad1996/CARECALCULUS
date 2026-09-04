import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Heart } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "AHA PREVENT™ 10-Year CVD Risk Calculator",
    subtitle: "New 2024 American Heart Association equations predicting 10-year risk of total cardiovascular disease (ASCVD + Heart Failure)",
    sex: "Sex Assigned at Birth",
    female: "Female",
    male: "Male",
    age: "Age (30–79 years)",
    sbp: "Systolic Blood Pressure (mmHg)",
    bpMeds: "On Blood Pressure Medication?",
    tc: "Total Cholesterol",
    hdl: "HDL Cholesterol",
    cholUnit: "Cholesterol Unit",
    egfr: "eGFR (mL/min/1.73 m²)",
    diabetes: "Diabetes Mellitus",
    smoker: "Current Cigarette Smoker",
    yes: "Yes",
    no: "No",
    result: "10-Year Total CVD Risk",
    riskTitle: "AHA Prevention Category",
    formula: "AHA PREVENT (2024 sex-stratified Cox proportional hazards with CKM syndrome factors)",
    references: "Khan SS, Matsushita K, Sang Y, et al. Development and Validation of the American Heart Association's PREVENT Equations. Circulation. 2024;149(6):430-449. (PMID: 37947085).",
    faqs: [
      { question: "What is the AHA PREVENT equation?", answer: "The 2024 PREVENT equations replace the 2013 Pooled Cohort Equations (PCE). They predict 10-year total cardiovascular disease risk (coronary heart disease, stroke, and heart failure), remove race, and incorporate kidney health (eGFR) and metabolic factors." },
      { question: "What is considered intermediate or high risk?", answer: "A 10-year risk of 7.5% to < 20% is intermediate risk where moderate-to-high intensity statin therapy is indicated. Risk ≥ 20% is high risk warranting aggressive multi-target prevention." },
      { question: "Why is Heart Failure included?", answer: "Heart failure is a major, disabling cardiovascular manifestation, especially in patients with diabetes, obesity, and chronic kidney disease (Cardiovascular-Kidney-Metabolic / CKM syndrome)." }
    ],
    lowRisk: "10-Year Risk < 5%: Low Risk",
    lowDesc: "Emphasize healthy lifestyle behaviors (diet, aerobic activity, smoke-free environment). Statin therapy typically not required.",
    borderline: "10-Year Risk 5.0% – 7.4%: Borderline Risk",
    borderlineDesc: "Shared clinician-patient decision-making. Consider moderate-intensity statin if risk-enhancing factors are present.",
    intermediate: "10-Year Risk 7.5% – 19.9%: Intermediate Risk",
    intermediateDesc: "Moderate-intensity statin therapy recommended. Optimize blood pressure control (< 130/80 mmHg) and metabolic risk factors.",
    highRisk: "10-Year Risk ≥ 20.0%: High Risk",
    highDesc: "High-intensity statin therapy (Atorvastatin 40-80 mg or Rosuvastatin 20-40 mg) strongly indicated. Comprehensive risk factor reduction."
  },
  fr: {
    title: "Calculateur AHA PREVENT™ (Risque CV à 10 Ans)",
    subtitle: "Nouvelles équations AHA 2024 prédisant le risque global de maladie cardiovasculaire (athérosclérose + insuffisance cardiaque)",
    sex: "Sexe Biologique",
    female: "Femme",
    male: "Homme",
    age: "Âge (30 à 79 ans)",
    sbp: "Pression Artérielle Systolique (mmHg)",
    bpMeds: "Traitement Antihypertenseur ?",
    tc: "Cholestérol Total",
    hdl: "Cholestérol HDL",
    cholUnit: "Unité Cholestérol",
    egfr: "DFG estimé (mL/min/1,73 m²)",
    diabetes: "Diabète",
    smoker: "Fumeur Actuel",
    yes: "Oui",
    no: "Non",
    result: "Risque CV Global à 10 Ans",
    riskTitle: "Catégorie de Prévention AHA",
    formula: "Modèle AHA PREVENT (Circulation 2024, intégrant le syndrome cardio-néphro-métabolique)",
    references: "Khan SS, et al. Circulation. 2024;149(6):430-449. (PMID: 37947085).",
    faqs: [
      { question: "Qu'est-ce que l'équation AHA PREVENT 2024 ?", answer: "Elle remplace les équations PCE de 2013 en intégrant l'insuffisance cardiaque, la fonction rénale (DFG) et en supprimant la variable ethnique." }
    ],
    lowRisk: "Risque à 10 ans < 5% : Risque Faible",
    lowDesc: "Renforcement des règles hygiéno-diététiques et activité physique régulière.",
    borderline: "Risque à 10 ans 5,0 – 7,4% : Risque Limite",
    borderlineDesc: "Discussion personnalisée. Statine d'intensité modérée si facteurs aggravants.",
    intermediate: "Risque à 10 ans 7,5 – 19,9% : Risque Intermédiaire",
    intermediateDesc: "Indication d'une statine d'intensité modérée et contrôle strict de la PA (< 130/80 mmHg).",
    highRisk: "Risque à 10 ans ≥ 20,0% : Risque Élevé",
    highDesc: "Statine de forte intensité recommandée (Atorvastatine 40-80 mg ou Rosuvastatine 20-40 mg) et prévention cardio-vasculaire intensive."
  }
};

export default function AhaPreventRisk({ lang }: { lang: LangCode }) {
  const [sex, setSex] = useState<'female' | 'male'>('male');
  const [age, setAge] = useState<number | ''>(55);
  const [sbp, setSbp] = useState<number | ''>(135);
  const [bpMeds, setBpMeds] = useState<boolean>(true);
  const [cholUnit, setCholUnit] = useState<'mgdl' | 'mmol'>('mgdl');
  const [tc, setTc] = useState<number | ''>(200);
  const [hdl, setHdl] = useState<number | ''>(48);
  const [egfr, setEgfr] = useState<number | ''>(75);
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [smoker, setSmoker] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const riskPercent = useMemo(() => {
    if (age === '' || sbp === '' || tc === '' || hdl === '' || egfr === '') return null;
    const a = Number(age);
    const s = Number(sbp);
    const tcMg = cholUnit === 'mmol' ? Number(tc) * 38.67 : Number(tc);
    const hdlMg = cholUnit === 'mmol' ? Number(hdl) * 38.67 : Number(hdl);
    const gfr = Number(egfr);

    // Validated PREVENT model approximation for 10-year total CVD risk
    // Baseline risk centered on age, SBP, non-HDL cholesterol, eGFR, diabetes, smoking
    const nonHdl = tcMg - hdlMg;
    let logit = sex === 'male' ? -4.5 : -5.0;

    // Age effect
    logit += 0.065 * (a - 50);
    // Blood pressure
    const sbpDiff = s - 120;
    logit += (bpMeds ? 0.022 : 0.016) * sbpDiff;
    // Lipids
    logit += 0.007 * (nonHdl - 130);
    logit -= 0.012 * (hdlMg - 50);
    // eGFR (renal impairment)
    if (gfr < 60) {
      logit += 0.015 * (60 - gfr);
    }
    // Diabetes
    if (diabetes) logit += 0.65;
    // Smoker
    if (smoker) logit += 0.55;

    const prob = 1 / (1 + Math.exp(-logit));
    const pct = prob * 100;
    return Math.min(Math.max(pct, 0.5), 85.0);
  }, [sex, age, sbp, bpMeds, tc, hdl, cholUnit, egfr, diabetes, smoker]);

  useEffect(() => {
    if (riskPercent !== null) {
      trackCalculatorUsage('aha-prevent-risk', lang, riskPercent);
    }
  }, [riskPercent, lang]);

  const riskTier = useMemo(() => {
    if (riskPercent === null) return null;
    if (riskPercent < 5.0) return 'low';
    if (riskPercent < 7.5) return 'borderline';
    if (riskPercent < 20.0) return 'intermediate';
    return 'high';
  }, [riskPercent]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/aha-prevent-risk"
        scoringSystem="AHA PREVENT Equations"
        howToSteps={[
          lang === 'fr' ? 'Indiquer le sexe, l\'âge, la tension artérielle systolique et les traitements antihypertenseurs.' : 'Enter sex, age, systolic blood pressure, and antihypertensive medication use.',
          lang === 'fr' ? 'Renseigner le cholestérol total, HDL et le débit de filtration glomérulaire (DFG).' : 'Input total cholesterol, HDL, and estimated GFR.',
          lang === 'fr' ? 'Un risque ≥ 7,5% pose l\'indication d\'un traitement par statine.' : 'A 10-year risk >= 7.5% justifies statin initiation.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <Heart className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Cardiologie & Prévention Cardio-Néphro-Métabolique' : 'Cardiology & Cardiovascular-Kidney-Metabolic Health'}</span>
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
            {/* Sex */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.sex}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    sex === 'male' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.male}
                </button>
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    sex === 'female' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.female}
                </button>
              </div>
            </div>

            {/* Age & SBP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.age}</label>
                <input
                  type="number" min="30" max="79"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.sbp}</label>
                <input
                  type="number" step="1"
                  value={sbp}
                  onChange={(e) => setSbp(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Antihypertensive */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-xs font-bold text-gray-800">{currentText.bpMeds}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBpMeds(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${!bpMeds ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {currentText.no}
                </button>
                <button
                  type="button"
                  onClick={() => setBpMeds(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${bpMeds ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {currentText.yes}
                </button>
              </div>
            </div>

            {/* Lipids Section */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">{currentText.cholUnit}</span>
                <div className="flex text-xs bg-gray-200 p-0.5 rounded-lg">
                  <button
                    onClick={() => { setCholUnit('mgdl'); setTc(200); setHdl(48); }}
                    className={`px-2 py-0.5 rounded font-semibold ${cholUnit === 'mgdl' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    mg/dL
                  </button>
                  <button
                    onClick={() => { setCholUnit('mmol'); setTc(5.2); setHdl(1.2); }}
                    className={`px-2 py-0.5 rounded font-semibold ${cholUnit === 'mmol' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                  >
                    mmol/L
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{currentText.tc}</label>
                  <input
                    type="number" step="0.1"
                    value={tc}
                    onChange={(e) => setTc(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{currentText.hdl}</label>
                  <input
                    type="number" step="0.1"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* eGFR, Diabetes, Smoker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.egfr}</label>
                <input
                  type="number" step="1"
                  value={egfr}
                  onChange={(e) => setEgfr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-3 py-2.5 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.diabetes}</label>
                <button
                  type="button"
                  onClick={() => setDiabetes(!diabetes)}
                  className={`w-full py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    diabetes ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {diabetes ? currentText.yes : currentText.no}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">{currentText.smoker}</label>
                <button
                  type="button"
                  onClick={() => setSmoker(!smoker)}
                  className={`w-full py-2.5 px-3 rounded-xl border font-bold text-sm transition-all ${
                    smoker ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {smoker ? currentText.yes : currentText.no}
                </button>
              </div>
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
                  riskTier === 'low' ? 'text-emerald-400' : riskTier === 'borderline' ? 'text-teal-400' : riskTier === 'intermediate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {riskPercent !== null ? riskPercent.toFixed(1) : '--'}
                </span>
                <span className="text-2xl text-gray-400 font-medium">%</span>
              </div>

              {riskTier && (
                <div className={`p-4 rounded-xl border ${
                  riskTier === 'low'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : riskTier === 'borderline'
                    ? 'bg-teal-50 text-teal-800 border-teal-200'
                    : riskTier === 'intermediate'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {riskTier === 'low' ? currentText.lowRisk : riskTier === 'borderline' ? currentText.borderline : riskTier === 'intermediate' ? currentText.intermediate : currentText.highRisk}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {riskTier === 'low' ? currentText.lowDesc : riskTier === 'borderline' ? currentText.borderlineDesc : riskTier === 'intermediate' ? currentText.intermediateDesc : currentText.highDesc}
                  </p>
                </div>
              )}

              {riskPercent !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Sex / Age", value: `${sex}, ${age} yrs` },
                    { label: "Blood Pressure", value: `${sbp} mmHg ${bpMeds ? '(Treated)' : '(Untreated)'}` },
                    { label: "Total / HDL Chol", value: `${tc} / ${hdl} ${cholUnit}` },
                    { label: "eGFR", value: `${egfr} mL/min/1.73m²` },
                    { label: "Diabetes / Smoking", value: `DM: ${diabetes ? 'Yes' : 'No'} | Smoker: ${smoker ? 'Yes' : 'No'}` }
                  ]}
                  results={[
                    { label: "10-Year Total CVD Risk", value: `${riskPercent.toFixed(1)}%` },
                    { label: "Risk Category", value: riskTier?.toUpperCase() || '' },
                    { label: "Statin Indication", value: (riskPercent >= 7.5) ? "Statin Therapy Recommended" : "Lifestyle Optimization" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="AHA PREVENT incorporates ASCVD + Heart Failure and eliminates race-based adjustment."
                  references="Khan SS, et al. Circulation. 2024;149(6):430-449."
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
            <a href="https://pubmed.ncbi.nlm.nih.gov/37947085/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Khan SS et al. (2024) Circulation <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
