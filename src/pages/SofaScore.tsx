import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalRiskScoreSchema } from '../components/JsonLd';

const translations: Translations = {
  en: {
    title: "SOFA Score ICU Calculator",
    subtitle: "Track Sequential Organ Failure Assessment to evaluate organ dysfunction severity in the ICU",
    resp: "Respiration (PaO2/FiO2 ratio)",
    resp0: "≥ 400 mmHg (0 points)",
    resp1: "< 400 mmHg (1 point)",
    resp2: "< 300 mmHg (2 points)",
    resp3: "< 200 mmHg with mechanical ventilation (3 points)",
    resp4: "< 100 mmHg with mechanical ventilation (4 points)",
    coag: "Coagulation (Platelets count)",
    coag0: "≥ 150 ×10³/µL (0 points)",
    coag1: "< 150 ×10³/µL (1 point)",
    coag2: "< 100 ×10³/µL (2 points)",
    coag3: "< 50 ×10³/µL (3 points)",
    coag4: "< 20 ×10³/µL (4 points)",
    liver: "Liver (Bilirubin level)",
    liver0: "< 1.2 mg/dL [< 20 µmol/L] (0 points)",
    liver1: "1.2 - 1.9 mg/dL [20-32 µmol/L] (1 point)",
    liver2: "2.0 - 5.9 mg/dL [33-101 µmol/L] (2 points)",
    liver3: "6.0 - 11.9 mg/dL [102-203 µmol/L] (3 points)",
    liver4: "≥ 12.0 mg/dL [> 203 µmol/L] (4 points)",
    cardio: "Cardiovascular (MAP & Vasopressors)",
    cardio0: "No hypotension (0 points)",
    cardio1: "MAP < 70 mmHg (1 point)",
    cardio2: "Dopamine ≤ 5 µg/kg/min or any Dobutamine (2 points)",
    cardio3: "Dopamine > 5, Epi/Norepi ≤ 0.1 µg/kg/min (3 points)",
    cardio4: "Dopamine > 15, Epi/Norepi > 0.1 µg/kg/min (4 points)",
    cns: "Central Nervous System (GCS)",
    cns0: "GCS 15 (0 points)",
    cns1: "GCS 13 - 14 (1 point)",
    cns2: "GCS 10 - 12 (2 points)",
    cns3: "GCS 6 - 9 (3 points)",
    cns4: "GCS < 6 (4 points)",
    renal: "Renal (Creatinine & Urine output)",
    renal0: "Creatinine < 1.2 mg/dL (0 points)",
    renal1: "Creatinine 1.2 - 1.9 mg/dL (1 point)",
    renal2: "Creatinine 2.0 - 3.4 mg/dL (2 points)",
    renal3: "Creatinine 3.5 - 4.9 mg/dL or Urine < 500 mL/day (3 points)",
    renal4: "Creatinine ≥ 5.0 mg/dL or Urine < 200 mL/day (4 points)",
    result: "Calculated SOFA Score",
    formula: "SOFA = Respiration + Coagulation + Liver + Cardiovascular + CNS + Renal",
    clinicalTitle: "ICU Organ Dysfunction",
    clinicalText: "An increase in SOFA score of ≥2 points from baseline indicates acute organ dysfunction, representing a positive screen for sepsis under Sepsis-3 criteria (Singer et al., JAMA 2016).",
    references: "References: Vincent JL, Moreno R, Takala J, et al. The SOFA score. Intensive Care Med 1996.",
    lowRisk: "Low Mortality Risk (< 10%)",
    highRisk: "High Mortality Risk (≥ 10% - 20%)",
    criticalRisk: "Critical Organ Failure (Up to 50%+ Mortality)",
    faqQ1: "What is the SOFA score?",
    faqA1: "The Sequential Organ Failure Assessment (SOFA) score is a scoring system used in ICU settings to track a patient's organ dysfunction level across six organ systems: respiratory, cardiovascular, hepatic, coagulation, renal, and neurological.",
    faqQ2: "How does the SOFA score define organ dysfunction severity?",
    faqA2: "Each of the six organ systems is scored from 0 (normal) to 4 (severe dysfunction), yielding a total score between 0 and 24. A higher score is associated with higher mortality risk.",
    faqQ3: "What is the clinical significance of a change in SOFA score?",
    faqA3: "An increase in SOFA score of ≥2 points from baseline indicates acute organ dysfunction, representing a positive screen for sepsis under Sepsis-3 criteria and indicating a 10% or greater hospital mortality risk.",
    faqQ4: "Can SOFA score be used to diagnose sepsis?",
    faqA4: "Yes. Under Sepsis-3 definitions (2016), sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. Organ dysfunction can be identified as an acute change in total SOFA score ≥2 points consequent to the infection.",
    pillarTitle: "Physiologic Rationale of Sepsis-3, Multi-Organ Assessment, and Delta-SOFA Tracking",
    pillarText: [
      "The Sequential (or Sepsis-related) Organ Failure Assessment (SOFA) score was originally conceptualized by Vincent et al. in 1996 for the European Society of Intensive Care Medicine to objectively quantify systemic morbidity and mortality across six distinct organ systems. In 2016, the Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3) fundamentally shifted the definition of sepsis from a systemic inflammatory response syndrome (SIRS) to life-threatening organ dysfunction caused by a dysregulated host response to infection.",
      "Under Sepsis-3 guidelines, an acute increase in the SOFA score of 2 points or more above baseline is operationalized as the primary diagnostic threshold for sepsis, correlating with an overall hospital mortality rate exceeding 10%. Unlike rapid triage screening tools such as qSOFA, the comprehensive SOFA score demands quantitative laboratory parameters including arterial oxygenation tension to fraction of inspired oxygen (PaO2/FiO2) ratios, platelet counts, total serum bilirubin, and serum creatinine levels alongside vasopressor dosing requirements and Glasgow Coma Scale evaluations.",
      "Clinically, tracking serial changes ('Delta-SOFA') during the initial 48 to 72 hours of resuscitation provides superior prognostic accuracy over single admission values. A rising or non-resolving SOFA score despite broad-spectrum antimicrobial therapy, aggressive fluid resuscitation, and hemodynamic support strongly indicates refractory distributive shock and irreversible microvascular endothelial failure."
    ],
  },
  fr: {
    title: "Score SOFA (Réanimation)",
    subtitle: "Suivre le score d'évaluation séquentielle des défaillances d'organes",
    resp: "Respiration (Rapport PaO2/FiO2)",
    resp0: "≥ 400 mmHg (0 point)",
    resp1: "< 400 mmHg (1 point)",
    resp2: "< 300 mmHg (2 points)",
    resp3: "< 200 mmHg avec ventilation assistée (3 points)",
    resp4: "< 100 mmHg avec ventilation assistée (4 points)",
    coag: "Coagulation (Plaquettes)",
    coag0: "≥ 150 000 /µL (0 point)",
    coag1: "< 150 000 /µL (1 point)",
    coag2: "< 100 000 /µL (2 points)",
    coag3: "< 50 000 /µL (3 points)",
    coag4: "< 20 000 /µL (4 points)",
    liver: "Foie (Bilirubine)",
    liver0: "< 1,2 mg/dL [< 20 µmol/L] (0 point)",
    liver1: "1,2 - 1,9 mg/dL [20-32 µmol/L] (1 point)",
    liver2: "2,0 - 5,9 mg/dL [33-101 µmol/L] (2 points)",
    liver3: "6,0 - 11,9 mg/dL [102-203 µmol/L] (3 points)",
    liver4: "≥ 12,0 mg/dL [> 203 µmol/L] (4 points)",
    cardio: "Cardiovasculaire (PAM et Catécholamines)",
    cardio0: "Pas d'hypotension (0 point)",
    cardio1: "PAM < 70 mmHg (1 point)",
    cardio2: "Dopamine ≤ 5 µg/kg/min ou Dobutamine (2 points)",
    cardio3: "Dopamine > 5, Adré/Noradré ≤ 0.1 µg/kg/min (3 points)",
    cardio4: "Dopamine > 15, Adré/Noradré > 0.1 µg/kg/min (4 points)",
    cns: "Système Nerveux Central (Score de Glasgow)",
    cns0: "GCS 15 (0 point)",
    cns1: "GCS 13 - 14 (1 point)",
    cns2: "GCS 10 - 12 (2 points)",
    cns3: "GCS 6 - 9 (3 points)",
    cns4: "GCS < 6 (4 points)",
    renal: "Rein (Créatinine et Diurèse)",
    renal0: "Créatinine < 1,2 mg/dL (0 point)",
    renal1: "Créatinine 1,2 - 1,9 mg/dL (1 point)",
    renal2: "Créatinine 2,0 - 3,4 mg/dL (2 points)",
    renal3: "Créatinine 3,5 - 4,9 mg/dL ou Diurèse < 500 mL/j (3 points)",
    renal4: "Créatinine ≥ 5,0 mg/dL ou Diurèse < 200 mL/j (4 points)",
    result: "Score SOFA Calculé",
    formula: "SOFA = Respiration + Coagulation + Foie + Cardiovasculaire + SNC + Rein",
    clinicalTitle: "Dysfonctionnement d'Organes",
    clinicalText: "Une augmentation du score SOFA d'au moins 2 points par rapport au score initial indique un dysfonctionnement aigu d'organe, correspondant à un dépistage positif du sepsis (Sepsis-3, Singer et al., JAMA 2016).",
    references: "Références : Vincent JL, Moreno R, Takala J, et al. The SOFA score. Intensive Care Med 1996.",
    lowRisk: "Mortalité faible (< 10%)",
    highRisk: "Mortalité élevée (≥ 10% - 20%)",
    criticalRisk: "Défaillance critique (Mortalité jusqu'à 50%+)",
    faqQ1: "Qu'est-ce que le score SOFA ?",
    faqA1: "Le score SOFA (Sequential Organ Failure Assessment) est un système de notation utilisé en soins intensifs pour suivre le niveau de dysfonctionnement des organes d'un patient à travers six systèmes d'organes.",
    faqQ2: "Comment le score SOFA définit-il la gravité de la dysfonction ?",
    faqA2: "Chacun des six systèmes est noté de 0 (normal) à 4 (dysfonctionnement sévère), donnant un score total allant de 0 à 24. Un score plus élevé est corrélé à un risque accru de mortalité.",
    faqQ3: "Quelle est la signification clinique d'une hausse du score SOFA ?",
    faqA3: "Une hausse d'au moins 2 points par rapport à la valeur de référence indique un dysfonctionnement aigu d'organe, constituant un dépistage positif de sepsis selon les critères Sepsis-3 et signifiant un risque de mortalité hospitalière de 10% ou plus.",
    faqQ4: "Quelle est la différence entre le score SOFA et le score qSOFA ?",
    faqA4: "Le qSOFA (quick SOFA) est un outil de dépistage rapide au lit du patient ne nécessitant pas de tests de laboratoire. Le score SOFA complet requiert des analyses biologiques (PaO2, bilirubine, créatinine, plaquettes) pour évaluer formellement les défaillances.",
    pillarTitle: "Physiopathologie Sepsis-3, Évaluation Multi-Organes et Suivi Delta-SOFA",
    pillarText: [
      "Le score SOFA (Sequential Organ Failure Assessment) a été initialement conçu par Vincent et al. en 1996 pour la Société Européenne de Réanimation afin de quantifier objectivement la morbidité et la mortalité à travers six systèmes d'organes distincts. En 2016, le Troisième Consensus International sur le Sepsis et le Choc Septique (Sepsis-3) a redéfini le sepsis, passant d'un syndrome de réponse inflammatoire systémique (SIRS) à un dysfonctionnement d'organe menaçant le pronostic vital causé par une réponse dysrégulée de l'hôte à l'infection.",
      "Selon les recommandations Sepsis-3, une augmentation aiguë du score SOFA d'au moins 2 points au-dessus de la valeur de référence constitue le seuil diagnostique de sepsis, corrélé à une mortalité hospitalière globale supérieure à 10 %. Contrairement aux outils de triage rapide comme le qSOFA, le score SOFA complet exige des paramètres biologiques quantitatifs, notamment le rapport PaO2/FiO2, la numération plaquettaire, la bilirubine totale et la créatinine sérique, en plus du support vasopresseur et du score de Glasgow.",
      "Sur le plan clinique, le suivi des variations en série ('Delta-SOFA') au cours des 48 à 72 premières heures de réanimation offre une précision pronostique bien supérieure aux valeurs initiales d'admission. Un score SOFA en hausse ou persistant malgré une antibiothérapie à large spectre et une réanimation hémodynamique agressive indique un choc distributif réfractaire et une défaillance microvasculaire irréversible."
    ],
  }
};

export default function SofaScore({ lang }: { lang: LangCode }) {
  const [resp, setResp] = useState<number>(0);
  const [coag, setCoag] = useState<number>(0);
  const [liver, setLiver] = useState<number>(0);
  const [cardio, setCardio] = useState<number>(0);
  const [cns, setCns] = useState<number>(0);
  const [renal, setRenal] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = false;

  const sofaValue = resp + coag + liver + cardio + cns + renal;

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('sofa-score', lang, sofaValue);
    }, 1500);
    return () => clearTimeout(timer);
  }, [sofaValue, lang]);

  const getSofaCategory = (val: number) => {
    if (val <= 6) return { label: currentText.lowRisk, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val <= 11) return { label: currentText.highRisk, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.criticalRisk, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getSofaCategory(sofaValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(`SOFA Score: ${sofaValue}/24 (${category.label})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <JsonLd data={generateMedicalRiskScoreSchema(
        currentText.title, 
        currentText.subtitle, 
        typeof window !== 'undefined' ? window.location.href : 'https://carecalculus.com/sofa-score', 
        "Sequential Organ Failure Assessment"
      )} />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="sofa-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block with Glassmorphic Accent */}
        <div className="backdrop-blur-md bg-blue-50/70 border border-blue-200/60 shadow-sm rounded-2xl p-5 mt-6 mb-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-xs font-bold text-blue-900 uppercase tracking-widest">
              {lang === 'fr' ? 'Définition Clinique' : 'Clinical Definition'}
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {currentText.faqA1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.resp}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`resp-${val}`}
                      onClick={() => setResp(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${resp === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`resp${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.coag}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`coag-${val}`}
                      onClick={() => setCoag(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${coag === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`coag${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.liver}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`liver-${val}`}
                      onClick={() => setLiver(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${liver === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`liver${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.cardio}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`cardio-${val}`}
                      onClick={() => setCardio(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${cardio === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`cardio${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.cns}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`cns-${val}`}
                      onClick={() => setCns(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${cns === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`cns${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.renal}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 1, 2, 3, 4].map((val) => (
                    <button
                      key={`renal-${val}`}
                      onClick={() => setRenal(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${renal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`renal${val}`]}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-8 min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {currentText.result}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live Score
                  </span>
                </div>
                
                <div className="flex items-baseline gap-2 tabular-nums my-2">
                  <span className="text-8xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    {sofaValue}
                  </span>
                  <span className="text-2xl font-bold text-slate-500">/ 24</span>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="mt-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/15 flex items-center justify-center text-slate-300 hover:text-white backdrop-blur-md active:scale-95 shadow-sm"
                title="Copy Result"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                  <span className="font-bold text-sm tracking-wide">
                    {category.label}
                  </span>
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.resp, value: `${resp} - ${currentText[`resp${resp}`]}` },
                  { label: currentText.coag, value: `${coag} - ${currentText[`coag${coag}`]}` },
                  { label: currentText.liver, value: `${liver} - ${currentText[`liver${liver}`]}` },
                  { label: currentText.cardio, value: `${cardio} - ${currentText[`cardio${cardio}`]}` },
                  { label: currentText.cns, value: `${cns} - ${currentText[`cns${cns}`]}` },
                  { label: currentText.renal, value: `${renal} - ${currentText[`renal${renal}`]}` }
                ]}
                results={[
                  { label: currentText.result, value: `${sofaValue} / 24` },
                  { label: 'Mortality Category', value: category.label }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
              <a href="https://pubmed.ncbi.nlm.nih.gov/8861123/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Vincent et al., Intensive Care Med 1996 (PMID: 8861123) →</a>
            </div>
          </div>
        </div>
      </div>


      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'P/F Ratio', path: '/pf-ratio' },
            { label: 'Tidal Volume (ARDS)', path: '/tidal-volume' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
            { q: currentText.faqQ4, a: currentText.faqA4 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
