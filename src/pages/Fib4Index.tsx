import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "FIB-4 Index for Liver Fibrosis",
    subtitle: "Non-invasive biomarker score estimating hepatic fibrosis in NAFLD, MASLD, and chronic hepatitis",
    age: "Age (years)",
    ast: "AST (SGOT) [U/L]",
    alt: "ALT (SGPT) [U/L]",
    platelets: "Platelet Count (× 10⁹/L or K/µL)",
    result: "Calculated FIB-4 Index",
    formula: "FIB-4 = (Age × AST) / (Platelets × √ALT)",
    clinicalTitle: "Clinical Interpretation & Hepatology Referral Guidance",
    references: "Sterling RK, Lissen E, Clumeck N, et al. Development of a simple noninvasive index to predict significant fibrosis in patients with HIV/HCV coinfection. Hepatology. 2006;43(6):1317-1325. (PMID: 16729309). Rinella ME, et al. AASLD Practice Guidance on MASLD. Hepatology. 2023;77(5):1797-1835.",
    faqs: [
      { question: "What is the FIB-4 Index?", answer: "The FIB-4 Index is a validated non-invasive clinical score combining age, AST, ALT, and platelet count to evaluate the probability of advanced liver fibrosis (stages F3–F4 cirrhosis) in patients with metabolic dysfunction-associated steatotic liver disease (MASLD / NAFLD) or viral hepatitis." },
      { question: "How are FIB-4 cutoffs interpreted?", answer: "A FIB-4 < 1.30 (< 2.0 in patients aged ≥ 65) has a >90% negative predictive value for advanced fibrosis, allowing safe primary care management. A FIB-4 between 1.30 and 2.67 is indeterminate, indicating the need for transient elastography (FibroScan). A FIB-4 > 2.67 confers high risk for advanced fibrosis/cirrhosis, warranting urgent hepatology referral." },
      { question: "Why is an adjusted cutoff used for patients over 65?", answer: "Because age is directly in the numerator of the formula, unadjusted thresholds lead to a high rate of false-positive high-risk scores in older adults. AASLD and EASL guidelines recommend raising the lower cutoff to 2.0 for individuals aged 65 and older." }
    ],
    lowRisk: "Low Risk for Advanced Fibrosis (F0–F1)",
    lowDesc: "FIB-4 < 1.30 (or < 2.0 if age ≥ 65). Negative predictive value > 90%. Repeat screening in 2–3 years in primary care; lifestyle modification.",
    indetRisk: "Indeterminate Risk (F2 Intermediate)",
    indetDesc: "FIB-4 1.30–2.67. Secondary non-invasive assessment recommended (Vibration-Controlled Transient Elastography / FibroScan or ELF test).",
    highRisk: "High Risk for Advanced Fibrosis / Cirrhosis (F3–F4)",
    highDesc: "FIB-4 > 2.67. Positive predictive value ~80% for severe fibrosis or cirrhosis. Urgent hepatology referral, HCC ultrasound surveillance, and esophageal varices evaluation."
  },
  fr: {
    title: "Score FIB-4 (Fibrose Hépatique)",
    subtitle: "Score non invasif évaluant la fibrose hépatique dans la stéatose (NAFLD / MASLD) et les hépatites",
    age: "Âge (années)",
    ast: "ASAT (SGOT) [UI/L]",
    alt: "ALAT (SGPT) [UI/L]",
    platelets: "Plaquettes (× 10⁹/L ou G/L)",
    result: "Score FIB-4 Calculé",
    formula: "FIB-4 = (Âge × ASAT) / (Plaquettes × √ALAT)",
    clinicalTitle: "Interprétation et Orientation Hépatologique",
    references: "Sterling RK, et al. Hepatology. 2006;43(6):1317-1325. (PMID: 16729309).",
    faqs: [
      { question: "À quoi sert le score FIB-4 ?", answer: "Le FIB-4 est un test sanguin simple combinant l'âge, les ASAT, les ALAT et les plaquettes pour évaluer la probabilité de fibrose hépatique avancée (F3-F4 / cirrhose) sans biopsie." },
      { question: "Comment interpréter les seuils du FIB-4 ?", answer: "FIB-4 < 1,30 (< 2,0 si âge ≥ 65 ans) : élimine une fibrose sévère (VPN > 90%). FIB-4 entre 1,30 et 2,67 : zone intermédiaire (FibroScan recommandé). FIB-4 > 2,67 : forte suspicion de fibrose sévère ou cirrhose (avis hépatologique spécialisé)." },
      { question: "Pourquoi ajuster le seuil chez les personnes de plus de 65 ans ?", answer: "L'âge figurant directement au numérateur, le score brut tend à surestimer le risque chez les seniors. Les recommandations (AFEF/EASL) portent le seuil d'exclusion à 2,0 après 65 ans." }
    ],
    lowRisk: "Faible Risque de Fibrose Avancée (F0–F1)",
    lowDesc: "FIB-4 < 1,30 (< 2,0 si ≥ 65 ans). Valeur prédictive négative > 90%. Suivi en soins primaires avec réévaluation tous les 2 à 3 ans.",
    indetRisk: "Risque Intermédiaire (Zone Grise)",
    indetDesc: "FIB-4 entre 1,30 et 2,67. Nécessite un test de seconde ligne (Élastométrie impulsionnelle / FibroScan).",
    highRisk: "Fort Risque de Fibrose Sévère ou Cirrhose (F3–F4)",
    highDesc: "FIB-4 > 2,67. Avis hépatologique urgent, dépistage de l'hypertension portale et surveillance semestrielle du carcinome hépatocellulaire (CHC)."
  }
};

export default function Fib4Index({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>(52);
  const [ast, setAst] = useState<number | ''>(48);
  const [alt, setAlt] = useState<number | ''>(55);
  const [platelets, setPlatelets] = useState<number | ''>(210);

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (age === '' || ast === '' || alt === '' || platelets === '') return null;
    const a = Number(age);
    const s = Number(ast);
    const l = Number(alt);
    const p = Number(platelets);
    if (a <= 0 || s <= 0 || l <= 0 || p <= 0) return null;

    const fib4 = (a * s) / (p * Math.sqrt(l));
    return fib4;
  }, [age, ast, alt, platelets]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('fib4-index', lang, result);
    }
  }, [result, lang]);

  const riskTier = useMemo(() => {
    if (result === null) return null;
    const isElderly = Number(age) >= 65;
    const lowCutoff = isElderly ? 2.0 : 1.30;

    if (result < lowCutoff) {
      return {
        label: currentText.lowRisk,
        desc: currentText.lowDesc,
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        color: 'text-emerald-600',
        bar: 'bg-emerald-500'
      };
    }
    if (result <= 2.67) {
      return {
        label: currentText.indetRisk,
        desc: currentText.indetDesc,
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        color: 'text-amber-600',
        bar: 'bg-amber-500'
      };
    }
    return {
      label: currentText.highRisk,
      desc: currentText.highDesc,
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      color: 'text-rose-600',
      bar: 'bg-rose-600'
    };
  }, [result, age, currentText]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/fib4-index"
        scoringSystem="FIB-4 Liver Fibrosis Index"
        howToSteps={[
          lang === 'fr' ? 'Entrer l\'âge du patient en années.' : 'Input patient age in years.',
          lang === 'fr' ? 'Saisir les transaminases AST et ALT en UI/L.' : 'Enter serum AST and ALT levels in U/L.',
          lang === 'fr' ? 'Indiquer le taux de plaquettes en G/L (× 10⁹/L).' : 'Enter platelet count in × 10⁹/L (or K/µL).',
          lang === 'fr' ? 'Calculer le FIB-4 : <1.30 (<2.0 si ≥65 ans) exclut la fibrose avancée ; >2.67 indique un haut risque.' : 'Calculate: <1.30 (<2.0 if ≥65) excludes advanced fibrosis; >2.67 indicates high risk.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">
          <Activity className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Hépatologie & Médecine Interne' : 'Hepatology & Primary Care'}</span>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.age}</label>
                <input
                  type="number" inputMode="decimal"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.platelets}</label>
                <input
                  type="number" inputMode="decimal"
                  value={platelets}
                  onChange={(e) => setPlatelets(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.ast}</label>
                <input
                  type="number" inputMode="decimal"
                  value={ast}
                  onChange={(e) => setAst(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.alt}</label>
                <input
                  type="number" inputMode="decimal"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className="text-5xl md:text-6xl font-extrabold tracking-tight">
                  {result !== null ? result.toFixed(2) : '--'}
                </span>
              </div>

              {riskTier && (
                <>
                  <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${riskTier.bar}`} 
                      style={{ width: `${Math.min(100, ((result || 0) / 4) * 100)}%` }}
                    />
                  </div>

                  <div className={`p-4 rounded-xl border ${riskTier.badge}`}>
                    <div className="font-bold text-sm mb-1">{riskTier.label}</div>
                    <p className="text-xs leading-relaxed opacity-90">{riskTier.desc}</p>
                  </div>
                </>
              )}

              {result !== null && riskTier && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Age", value: `${age} years` },
                    { label: "Platelets", value: `${platelets} × 10⁹/L` },
                    { label: "AST", value: `${ast} U/L` },
                    { label: "ALT", value: `${alt} U/L` }
                  ]}
                  results={[
                    { label: "FIB-4 Index", value: result.toFixed(2) },
                    { label: "Fibrosis Risk", value: riskTier.label },
                    { label: "Recommendation", value: riskTier.desc }
                  ]}
                  formula={currentText.formula}
                  disclaimer="FIB-4 is a non-invasive risk estimate. Confirmatory testing (FibroScan) advised for indeterminate or high-risk scores."
                  references="Sterling RK, et al. Hepatology. 2006;43(6):1317-1325."
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
          <div className="flex flex-wrap gap-4 text-amber-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/16729309/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Sterling RK et al. (2006) Hepatology <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
