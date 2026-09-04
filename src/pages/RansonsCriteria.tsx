import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Flame } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Ranson's Criteria for Acute Pancreatitis Mortality",
    subtitle: "Classic admission and 48-hour prognostic severity score for acute non-gallstone pancreatitis",
    admissionTitle: "Criteria on Admission",
    post48Title: "Criteria at 48 Hours",
    age: "Age > 55 years",
    wbc: "WBC > 16,000 / µL",
    glucose: "Blood Glucose > 200 mg/dL (11.1 mmol/L)",
    ast: "Serum AST (SGOT) > 250 IU/L",
    ldh: "Serum LDH > 350 IU/L",
    calcium: "Serum Calcium < 8.0 mg/dL (2.0 mmol/L)",
    hct: "Hematocrit drop > 10 percentage points",
    pao2: "Arterial PaO2 < 60 mmHg",
    bun: "BUN rise > 5 mg/dL (1.8 mmol/L) despite fluids",
    baseDeficit: "Base deficit > 4 mEq/L (HCO3- < 20)",
    fluid: "Estimated fluid sequestration > 6 Liters",
    result: "Total Ranson Score",
    formula: "Ranson Score = Sum of positive admission (0-5) and 48-hour (0-6) criteria [Max: 11]",
    clinicalTitle: "Mortality Risk & ICU Level-of-Care Guidance",
    references: "Ranson JH, Rifkind KM, Roses DF, Fink SD, Eng K, Spencer FC. Prognostic signs and the role of operative intervention in acute pancreatitis. Surg Gynecol Obstet. 1974;139(1):69-81. (PMID: 4834279).",
    faqs: [
      { question: "What is Ranson's Criteria used for?", answer: "Ranson's Criteria is an 11-factor scoring system assessing the mortality risk and clinical severity of acute pancreatitis at initial presentation and after 48 hours of fluid resuscitation." },
      { question: "How does Ranson score correlate with mortality?", answer: "0–2 points: Mild pancreatitis (~1–3% mortality); safe for general ward. 3–4 points: Severe pancreatitis (~15% mortality); consider high-dependency or ICU care. 5–6 points: Severe pancreatitis (~40% mortality); mandatory ICU admission and aggressive resuscitation. ≥7 points: Critical pancreatitis (~50–100% mortality)." },
      { question: "What is the main limitation of Ranson's Criteria?", answer: "Ranson's requires a 48-hour observation window to calculate completely. For immediate bedside risk assessment upon arrival, newer scores like the BISAP Score or APACHE II can be computed immediately at presentation." }
    ],
    mild: "Mild Acute Pancreatitis (1–3% Mortality)",
    mildDesc: "Score 0–2: Low risk of systemic complications or pancreatic necrosis. Standard IV hydration, analgesia, and general floor monitoring.",
    moderate: "Severe Pancreatitis (~15% Mortality)",
    moderateDesc: "Score 3–4: High risk of organ failure or local pancreatic collections. Recommend Step-down / ICU monitoring, target fluid resuscitation, and contrast CT at 72h.",
    severe: "Severe / Necrotizing Pancreatitis (~40% Mortality)",
    severeDesc: "Score 5–6: Severe acute pancreatitis. Mandatory ICU admission, invasive arterial hemodynamic monitoring, and close monitoring for ARDS and renal failure.",
    critical: "Critical Pancreatitis (>50–100% Mortality)",
    criticalDesc: "Score ≥ 7: Multi-organ failure and life-threatening systemic collapse. Critical care intensivist consultation, vasopressor and ventilator support."
  },
  fr: {
    title: "Score de Ranson pour la Pancréatite Aiguë",
    subtitle: "Évaluation pronostique et mortalité à l'admission et à 48 heures",
    admissionTitle: "Critères à l'Admission",
    post48Title: "Critères à la 48e Heure",
    age: "Âge > 55 ans",
    wbc: "Leucocytes > 16 000 / µL",
    glucose: "Glycémie > 200 mg/dL (11,1 mmol/L)",
    ast: "ASAT > 250 UI/L",
    ldh: "LDH > 350 UI/L",
    calcium: "Calcémie < 8,0 mg/dL (2,0 mmol/L)",
    hct: "Baisse de l'hématocrite > 10 points",
    pao2: "PaO2 artérielle < 60 mmHg",
    bun: "Hausse de l'urée > 5 mg/dL (1,8 mmol/L)",
    baseDeficit: "Déficit en bases > 4 mEq/L",
    fluid: "Séquestration liquidienne estimée > 6 Litres",
    result: "Score de Ranson Total",
    formula: "Score = Somme des critères à l'admission (0-5) et à 48h (0-6) [Max : 11]",
    clinicalTitle: "Risque de Mortalité et Orientation Réanimation",
    references: "Ranson JH, et al. Surg Gynecol Obstet. 1974;139(1):69-81. (PMID: 4834279).",
    faqs: [
      { question: "À quoi sert le score de Ranson ?", answer: "Le score de Ranson évalue la sévérité et prédit la mortalité d'une pancréatite aiguë en combinant des paramètres mesurés à l'admission et à la 48e heure." },
      { question: "Quelle est la corrélation avec la mortalité ?", answer: "0-2 critères : pancréatite bénigne (mortalité 1-3%). 3-4 critères : pancréatite sévère (mortalité ~15%). 5-6 critères : pancréatite grave (mortalité ~40%). ≥7 critères : pancréatite gravissime (>50% de mortalité)." },
      { question: "Quelle est la principale limite du score de Ranson ?", answer: "Il nécessite 48 heures complètes pour être finalisé. Pour une décision immédiate aux urgences dès l'admission, le score BISAP est souvent privilégié." }
    ],
    mild: "Pancréatite Bénigne (Mortalité 1–3%)",
    mildDesc: "Score 0–2 : Faible risque de nécrose ou de défaillance viscérale. Prise en charge standard en service conventionnel avec réhydratation IV.",
    moderate: "Pancréatite Sévère (Mortalité ~15%)",
    moderateDesc: "Score 3–4 : Risque élevé de complications locorégionales et systémiques. Surveillance en unité de soins continus ou réanimation.",
    severe: "Pancréatite Grave (Mortalité ~40%)",
    severeDesc: "Score 5–6 : Pancréatite aiguë grave. Hospitalisation impérative en réanimation, réanimation volémique guidée et surveillance scanographique à 72h.",
    critical: "Pancréatite Gravissime (Mortalité > 50%)",
    criticalDesc: "Score ≥ 7 : Défaillance multiviscérale engageant le pronostic vital immédiat. Prise en charge intensive spécialisée."
  }
};

export default function RansonsCriteria({ lang }: { lang: LangCode }) {
  // Admission criteria (5)
  const [age, setAge] = useState<boolean>(false);
  const [wbc, setWbc] = useState<boolean>(false);
  const [glucose, setGlucose] = useState<boolean>(false);
  const [ast, setAst] = useState<boolean>(false);
  const [ldh, setLdh] = useState<boolean>(false);

  // 48-hour criteria (6)
  const [calcium, setCalcium] = useState<boolean>(false);
  const [hct, setHct] = useState<boolean>(false);
  const [pao2, setPao2] = useState<boolean>(false);
  const [bun, setBun] = useState<boolean>(false);
  const [baseDeficit, setBaseDeficit] = useState<boolean>(false);
  const [fluid, setFluid] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = 0;
    if (age) s += 1;
    if (wbc) s += 1;
    if (glucose) s += 1;
    if (ast) s += 1;
    if (ldh) s += 1;
    if (calcium) s += 1;
    if (hct) s += 1;
    if (pao2) s += 1;
    if (bun) s += 1;
    if (baseDeficit) s += 1;
    if (fluid) s += 1;
    return s;
  }, [age, wbc, glucose, ast, ldh, calcium, hct, pao2, bun, baseDeficit, fluid]);

  useEffect(() => {
    trackCalculatorUsage('ransons-criteria', lang, score);
  }, [score, lang]);

  const riskTier = useMemo(() => {
    if (score <= 2) {
      return {
        label: currentText.mild,
        desc: currentText.mildDesc,
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        barColor: 'bg-emerald-500'
      };
    }
    if (score <= 4) {
      return {
        label: currentText.moderate,
        desc: currentText.moderateDesc,
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        barColor: 'bg-amber-500'
      };
    }
    if (score <= 6) {
      return {
        label: currentText.severe,
        desc: currentText.severeDesc,
        badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
        barColor: 'bg-orange-500'
      };
    }
    return {
      label: currentText.critical,
      desc: currentText.criticalDesc,
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      barColor: 'bg-rose-600'
    };
  }, [score, currentText]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/ransons-criteria"
        scoringSystem="Ranson's Pancreatitis Criteria"
        howToSteps={[
          lang === 'fr' ? 'À l\'admission : cocher âge > 55, GB > 16k, glycémie > 200 mg/dL, ASAT > 250, LDH > 350.' : 'At admission: check age > 55, WBC > 16k, glucose > 200 mg/dL, AST > 250, LDH > 350.',
          lang === 'fr' ? 'À 48 heures : évaluer calcium < 8, chute hématocrite > 10%, PaO2 < 60, hausse urée, déficit bases > 4, séquestration > 6L.' : 'At 48h: check calcium < 8, Hct drop > 10%, PaO2 < 60, BUN rise, base deficit > 4, fluid sequestration > 6L.',
          lang === 'fr' ? 'Calculer le score total (0-11) pour estimer le risque de mortalité.' : 'Sum the positive criteria (0-11) to stratify mortality and ICU level of care.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
          <Flame className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Gastroentérologie & Soins Intensifs' : 'Gastroenterology & Critical Care'}</span>
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
          {/* Admission Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2 border-b border-gray-100 pb-2">
              <Activity className="w-4 h-4" />
              {currentText.admissionTitle} (0–5 pts)
            </h2>
            <div className="space-y-2.5">
              {[
                { label: currentText.age, val: age, set: setAge },
                { label: currentText.wbc, val: wbc, set: setWbc },
                { label: currentText.glucose, val: glucose, set: setGlucose },
                { label: currentText.ast, val: ast, set: setAst },
                { label: currentText.ldh, val: ldh, set: setLdh }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.set(!item.val)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-blue-50/80 border-blue-500/80 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${item.val ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white'}`}>
                      {item.val ? '✓' : ''}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">+1</span>
                </div>
              ))}
            </div>
          </div>

          {/* 48-Hour Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 flex items-center gap-2 border-b border-gray-100 pb-2">
              <AlertTriangle className="w-4 h-4" />
              {currentText.post48Title} (0–6 pts)
            </h2>
            <div className="space-y-2.5">
              {[
                { label: currentText.calcium, val: calcium, set: setCalcium },
                { label: currentText.hct, val: hct, set: setHct },
                { label: currentText.pao2, val: pao2, set: setPao2 },
                { label: currentText.bun, val: bun, set: setBun },
                { label: currentText.baseDeficit, val: baseDeficit, set: setBaseDeficit },
                { label: currentText.fluid, val: fluid, set: setFluid }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => item.set(!item.val)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${item.val ? 'bg-purple-50/80 border-purple-500/80 shadow-sm' : 'bg-gray-50/70 border-gray-200 hover:bg-gray-100/60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${item.val ? 'bg-purple-600 text-white' : 'border border-gray-300 bg-white'}`}>
                      {item.val ? '✓' : ''}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-700">+1</span>
                </div>
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
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${score >= 5 ? 'text-rose-400' : score >= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {score}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 11 criteria</span>
              </div>

              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${riskTier.barColor}`} 
                  style={{ width: `${(score / 11) * 100}%` }}
                />
              </div>

              <div className={`p-4 rounded-xl border ${riskTier.badgeBg}`}>
                <div className="font-bold text-sm mb-1">{riskTier.label}</div>
                <p className="text-xs leading-relaxed opacity-90">{riskTier.desc}</p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Admission Criteria Met", value: (Number(age)+Number(wbc)+Number(glucose)+Number(ast)+Number(ldh)) + " / 5" },
                  { label: "48-Hour Criteria Met", value: (Number(calcium)+Number(hct)+Number(pao2)+Number(bun)+Number(baseDeficit)+Number(fluid)) + " / 6" }
                ]}
                results={[
                  { label: "Ranson Score", value: score, unit: "/ 11" },
                  { label: "Mortality Risk Category", value: riskTier.label },
                  { label: "Triage Guidance", value: riskTier.desc }
                ]}
                formula={currentText.formula}
                disclaimer="Ranson's criteria requires a 48-hour period to complete. In early admission, consider the BISAP score."
                references="Ranson JH, et al. Surg Gynecol Obstet. 1974;139(1):69-81."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence & Guidelines:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/4834279/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Ranson JH et al. (1974) Surg Gynecol Obstet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
