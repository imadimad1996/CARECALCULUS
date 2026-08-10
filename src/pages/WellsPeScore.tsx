import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import { layoutTranslations } from '../utils/lang';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { CalcPageSchemas } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';
import { RiskGauge } from '../components/RiskGauge';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_WELLS } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Wells' Criteria for Pulmonary Embolism (PE)",
    subtitle: "Calculates pretest probability of PE to determine next steps in evaluation",
    dvtSymptoms: "Clinical signs and symptoms of DVT",
    peNumberOne: "PE is #1 diagnosis OR equally likely",
    heartRate: "Heart rate > 100",
    immobilization: "Immobilization at least 3 days OR surgery in the previous 4 weeks",
    previousPE: "Previous, objectively diagnosed PE or DVT",
    hemoptysis: "Hemoptysis",
    malignancy: "Malignancy w/ treatment within 6 months or palliative",
    result: "Calculated Score",
    formula: "Sum of points (0 to 12.5)",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Score > 4 indicates PE is likely; proceed to CTPA. Score ≤ 4 indicates PE is unlikely; consider D-dimer.",
    faqTitle: "Frequently Asked Questions",
    pillarTitle: "Clinical Evidence & Diagnostic Strategy for PE",
    pillarText: [
      "The Wells' Criteria for Pulmonary Embolism is the gold-standard pretest probability clinical prediction rule used to risk-stratify patients presenting with suspected PE. Developed by Dr. Philip S. Wells, the score safely guides diagnostic imaging and laboratory testing, dramatically reducing unnecessary radiation exposure from CT Pulmonary Angiography (CTPA).",
      "In the dichotomous <strong>two-tier model</strong>, patients are stratified into 'PE Unlikely' (Score ≤ 4) and 'PE Likely' (Score > 4). For patients in the unlikely category, a moderate- or high-sensitivity D-dimer assay is recommended; a negative D-dimer safely rules out PE. For patients in the likely category, mandatory CTPA or V/Q scan is indicated regardless of D-dimer results.",
      "In the tricotomous <strong>three-tier model</strong>, risk is stratified into Low Risk (Score < 2), Moderate Risk (Score 2-6), and High Risk (Score > 6). Low and moderate risk categories guide clinicians to perform a D-dimer test (high-sensitivity required for moderate risk). High risk patients should skip D-dimer testing and proceed directly to imaging.",
      "Clinicians must exercise careful judgment when evaluating the 'PE is #1 diagnosis' criterion (+3 points). This requires clinical gestalt to assess if PE is more likely than alternative diagnoses like acute coronary syndrome, pneumonia, pneumothorax, or musculoskeletal pain.",
      "If deep vein thrombosis (DVT) is suspected without pulmonary symptoms, use the <a href='/wells-score' class='text-cyan-600 hover:underline font-semibold'>Wells' Criteria for DVT</a>."
    ],
    faqs: [
      { question: "What is the difference between Wells Score for DVT and PE?", answer: "The Wells Score for DVT is used when you suspect a clot in the leg (Deep Vein Thrombosis). The Wells Score for PE is a completely different set of criteria used when you suspect a clot in the lungs (Pulmonary Embolism). Both use the Wells name but evaluate different clinical signs." },
      { question: "Can the Wells Score be used in pregnant patients?", answer: "No. The standard Wells Criteria are not validated for pregnant or postpartum patients. Specialized algorithms such as the YEARS algorithm modified for pregnancy should be utilized." },
      { question: "When should I use the PERC Rule instead of Wells?", answer: "The PERC Rule should ONLY be applied to patients who have already been deemed to have a LOW clinical pre-test probability for PE (e.g., clinician gestalt < 15%, or a Wells PE Score < 2). If PERC is negative in these patients, no further testing is needed." }
    ],
    howToSteps: [
      "Select all clinical features that apply to the patient.",
      "Ensure you apply clinical gestalt for the 'PE is #1 diagnosis' criteria.",
      "Review the total calculated Wells Score.",
      "Interpret the score using the chosen Risk Stratification Model (2-Tier or 3-Tier)."
    ],
    references: "References: Wells PS, et al. Excluding pulmonary embolism at the bedside without diagnostic imaging: management of patients with suspected pulmonary embolism presenting to the emergency department by using a simple clinical model and d-dimer. Ann Intern Med. 2001;135(2):98-107.",
    likely: "PE Likely",
    unlikely: "PE Unlikely",
    
    modelSelectLabel: "Risk Stratification Model",
    modelToggle2Tier: "2-Tier (Dichotomous)",
    modelToggle3Tier: "3-Tier (Tricotomous)",
    lowRisk: "Low Risk",
    modRisk: "Moderate Risk",
    highRisk: "High Risk",
    managementTitle: "Management Pathway",
    managementTextLow: "Score < 2: Low Risk (pretest probability ~3.6%). Proceed to moderate- or high-sensitivity D-dimer. A negative result safely rules out PE. If PERC rule is 0, D-dimer can be omitted.",
    managementTextMod: "Score 2–6: Moderate Risk (pretest probability ~20.5%). Proceed to high-sensitivity D-dimer (moderate-sensitivity assays are not sufficient). A negative result safely rules out PE. A positive result warrants CTPA.",
    managementTextHigh: "Score > 6: High Risk (pretest probability ~66.7%). Skip D-dimer and proceed directly to diagnostic imaging (CTPA or V/Q scan).",
    managementTextLikely: "Score > 4: PE Likely. Proceed directly to diagnostic imaging (CTPA or V/Q scan). D-dimer should not be used to rule out PE in this group.",
    managementTextUnlikely: "Score ≤ 4: PE Unlikely. Proceed to D-dimer testing. A negative moderate- or high-sensitivity D-dimer safely rules out PE. A positive D-dimer warrants CTPA.",
    criticalActionsTitle: "Critical Actions",
    criticalActionsText: "1. Evaluate for hemodynamic instability (massive PE) which may require immediate thrombolysis or embolectomy. 2. Assess bleeding risk using the RIETE score prior to initiating anticoagulation."
  },
  fr: {
    title: "Score de Wells pour l'Embolie Pulmonaire (EP)",
    subtitle: "Calcule la probabilité pré-test d'EP pour déterminer les prochaines étapes de l'évaluation",
    dvtSymptoms: "Signes cliniques et symptômes de TVP",
    peNumberOne: "L'EP est le diagnostic n°1 OU aussi probable",
    heartRate: "Fréquence cardiaque > 100/min",
    immobilization: "Immobilisation ≥ 3 jours OU chirurgie dans les 4 dernières semaines",
    previousPE: "Antécédent documenté d'EP ou de TVP",
    hemoptysis: "Hémoptysie",
    malignancy: "Cancer actif (traitement dans les 6 mois ou palliatif)",
    result: "Score Calculé",
    formula: "Somme des points (0 à 12.5)",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Score > 4 indique que l'EP est probable ; passez à l'angio-TDM. Score ≤ 4 indique que l'EP est peu probable ; envisagez les D-dimères.",
    faqTitle: "Questions Fréquentes",
    pillarTitle: "Preuves Cliniques et Stratégie Diagnostique de l'EP",
    pillarText: [
      "Le score de Wells pour l'embolie pulmonaire (EP) est la règle de prédiction clinique de référence pour évaluer la probabilité pré-test chez les patients présentant une suspicion d'EP. Développé par le Dr Philip S. Wells, ce score permet de guider en toute sécurité les examens d'imagerie, réduisant drastiquement l'exposition inutile aux radiations de l'angio-scanner pulmonaire.",
      "Dans le <strong>modèle dichotomique</strong>, les patients sont classés en 'EP peu probable' (Score ≤ 4) et 'EP probable' (Score > 4). Chez les patients à faible probabilité, un dosage des D-dimères est recommandé ; des D-dimères négatifs excluent l'EP en toute sécurité. Pour la catégorie probable, une imagerie est indispensable.",
      "Dans le <strong>modèle à trois niveaux</strong>, le risque est stratifié en Risque Faible (Score < 2), Risque Modéré (Score 2-6) et Risque Élevé (Score > 6). Les patients à risque élevé doivent éviter le test des D-dimères et passer directement à l'imagerie.",
      "Le critère 'L'EP est le diagnostic n°1' (+3 points) nécessite un jugement clinique rigoureux (gestalt clinique) pour déterminer si d'autres affections (SCA, pneumonie) sont moins probables."
    ],
    faqs: [
      { question: "Quelle est la différence entre le score de Wells pour TVP et pour EP ?", answer: "Le score pour TVP est utilisé en cas de suspicion de caillot dans la jambe. Le score pour EP est une liste de critères complètement différente pour les caillots dans les poumons." },
      { question: "Peut-on utiliser le score de Wells chez la femme enceinte ?", answer: "Non. Des algorithmes spécifiques (comme l'algorithme YEARS modifié pour la grossesse) doivent être utilisés." },
      { question: "Quand dois-je utiliser la règle PERC au lieu du score de Wells ?", answer: "La règle PERC doit UNIQUEMENT être appliquée aux patients ayant déjà une FAIBLE probabilité clinique pré-test (ex: score de Wells < 2). Si la règle PERC est négative chez ces patients, aucun autre test n'est nécessaire." }
    ],
    howToSteps: [
      "Sélectionnez toutes les caractéristiques cliniques applicables au patient.",
      "Assurez-vous d'appliquer le jugement clinique pour le critère 'L'EP est le diagnostic n°1'.",
      "Consultez le score de Wells calculé.",
      "Interprétez le score selon le modèle de stratification choisi (2 ou 3 niveaux)."
    ],
    references: "Références : Wells PS, et al. Excluding pulmonary embolism at the bedside without diagnostic imaging. Ann Intern Med. 2001;135(2):98-107.",
    likely: "EP Probable",
    unlikely: "EP Peu Probable",
    
    modelSelectLabel: "Modèle de Stratification",
    modelToggle2Tier: "2-Niveaux (Dichotomique)",
    modelToggle3Tier: "3-Niveaux (Trichotomique)",
    lowRisk: "Risque Faible",
    modRisk: "Risque Modéré",
    highRisk: "Risque Élevé",
    managementTitle: "Protocole de Prise en Charge",
    managementTextLow: "Score < 2 : Risque Faible (prévalence ~3,6 %). Effectuer un dosage des D-dimères. D-dimères négatifs excluent l'EP en toute sécurité. Si le score PERC est de 0, les D-dimères peuvent être évités.",
    managementTextMod: "Score 2–6 : Risque Modéré (probabilité pré-test ~20,5 %). Effectuer un dosage des D-dimères de haute sensibilité. D-dimères négatifs excluent l'EP. D-dimères positifs indiquent un angio-TDM.",
    managementTextHigh: "Score > 6 : Risque Élevé (probabilité pré-test ~66,7 %). Éviter les D-dimères, effectuer directement une imagerie (angio-TDM ou scintigraphie V/Q).",
    managementTextLikely: "Score > 4 : EP Probable. Effectuer directement une imagerie (angio-TDM ou scintigraphie V/Q).",
    managementTextUnlikely: "Score ≤ 4 : EP Peu Probable. Effectuer un dosage des D-dimères. Des D-dimères négatifs excluent l'EP. Des D-dimères positifs indiquent un angio-TDM.",
    criticalActionsTitle: "Actions Critiques",
    criticalActionsText: "1. Évaluer l'instabilité hémodynamique (EP massive) pouvant nécessiter une thrombolyse immédiate. 2. Évaluer le risque hémorragique (score RIETE) avant l'anticoagulation."
  }
};

const itemsList = [
  { key: 'dvtSymptoms', points: 3 },
  { key: 'peNumberOne', points: 3 },
  { key: 'heartRate', points: 1.5 },
  { key: 'immobilization', points: 1.5 },
  { key: 'previousPE', points: 1.5 },
  { key: 'hemoptysis', points: 1 },
  { key: 'malignancy', points: 1 }
] as const;

export default function WellsPeScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [riskModel, setRiskModel] = useState<'2-tier' | '3-tier'>('2-tier');

  const currentText = translations[lang];
  const isRtl = false;

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      return acc + (selections[item.key] ? item.points : 0);
    }, 0);
  }, [selections]);

  const category = useMemo(() => {
    if (riskModel === '2-tier') {
      return scoreValue > 4 
        ? { label: currentText.likely, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-600', pathway: currentText.managementTextLikely, level: 'high' }
        : { label: currentText.unlikely, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-600', pathway: currentText.managementTextUnlikely, level: 'low' };
    } else {
      if (scoreValue < 2) {
        return { label: currentText.lowRisk, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-600', pathway: currentText.managementTextLow, level: 'low' };
      } else if (scoreValue <= 6) {
        return { label: currentText.modRisk, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-600', pathway: currentText.managementTextMod, level: 'moderate' };
      } else {
        return { label: currentText.highRisk, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-600', pathway: currentText.managementTextHigh, level: 'high' };
      }
    }
  }, [riskModel, scoreValue, currentText]);

  useEffect(() => {
    if (scoreValue !== 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('wells-pe-score', lang, scoreValue);
        trackCalculatorResult('wells-pe-score', scoreValue, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang, category.label]);

  return (
    <>
      <CalcPageSchemas 
        name={currentText.title}
        description={currentText.subtitle}
        path={`/${lang === 'en' ? '' : lang + '/'}wells-pe-score`}
        scoringSystem="Wells' Criteria for Pulmonary Embolism"
        faqs={currentText.faqs}
        howToSteps={currentText.howToSteps}
      />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-cyan-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="wells-pe-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>

        {/* GEO Definition Block with Glassmorphic Accent */}
        <div className="backdrop-blur-md bg-cyan-50/70 border border-cyan-200/60 shadow-sm rounded-2xl p-5 mt-6 mb-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xs font-bold text-cyan-900 uppercase tracking-widest">
              {lang === 'fr' ? 'Définition Clinique' : 'Clinical Definition'}
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {currentText.pillarText[0]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6 transition-all">
            
            {/* Risk Stratification Model Selector Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50/80 border border-gray-200/40 rounded-2xl mb-2">
              <span className="text-sm font-bold text-gray-700">
                {currentText.modelSelectLabel}
              </span>
              <div className="flex bg-gray-200/60 p-1 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setRiskModel('2-tier')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${riskModel === '2-tier' ? 'bg-white text-cyan-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {currentText.modelToggle2Tier}
                </button>
                <button
                  type="button"
                  onClick={() => setRiskModel('3-tier')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${riskModel === '3-tier' ? 'bg-white text-cyan-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {currentText.modelToggle3Tier}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {itemsList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] flex items-center justify-between gap-4 ${selections[item.key] ? 'border-cyan-500/60 bg-gradient-to-r from-cyan-50/70 to-teal-50/20 shadow-md ring-1 ring-cyan-500/20' : 'border-gray-200/80 bg-white hover:bg-gray-50/60 shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`shrink-0 w-6 h-6 rounded-xl border flex items-center justify-center transition-all duration-200 ${selections[item.key] ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm scale-110' : 'border-gray-300 bg-gray-50'}`}>
                      {selections[item.key] && (
                        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${selections[item.key] ? 'bg-cyan-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className={`sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-5 lg:p-8 lg:min-h-[360px] transition-all duration-300 ${category.level === 'high' ? 'ring-2 ring-red-500/60 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.35)]' : 'ring-1 ring-white/15'}`}>
            <div className={`absolute top-0 right-0 p-36 bg-gradient-to-bl ${category.level === 'high' ? 'from-red-500/40 via-rose-500/20' : category.level === 'moderate' ? 'from-amber-500/30 via-orange-500/10' : 'from-cyan-500/30 via-teal-500/10'} to-transparent rounded-bl-[120px] pointer-events-none animate-pulse`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {currentText.result}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300 backdrop-blur-md">
                  Live Score
                </span>
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2">
                <span className="text-8xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {scoreValue}
                </span>
                <span className="text-2xl font-bold text-slate-500">Points</span>
              </div>

              <div className="my-4">
                <RiskGauge
                  percentage={category.level === 'high' ? 85 : category.level === 'moderate' ? 45 : 15}
                  label={category.label}
                  riskLevel={category.level as any}
                />
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm tracking-wide">
                    {category.label}
                  </span>
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={itemsList.map(item => ({
                  label: currentText[item.key],
                  value: selections[item.key] ? `YES (+${item.points} pt)` : 'NO (0 pt)'
                }))}
                results={[
                  { label: 'Wells Score for PE', value: `${scoreValue} Points` },
                  { label: 'Risk Probability', value: category.label },
                  { label: 'Risk Model', value: riskModel === '3-tier' ? '3-Tier Model' : '2-Tier Model' }
                ]}
                formula={currentText.formula}
                disclaimer={category.pathway}
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
          {/* Dynamic Management Pathway */}
          <div className="flex items-start gap-4 md:col-span-3 bg-cyan-50/40 border border-cyan-100 rounded-2xl p-5 shadow-sm">
            <div className="p-3 min-h-[44px] min-w-[44px] bg-cyan-50 text-cyan-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-cyan-900 mb-2 text-base">{currentText.managementTitle}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{category.pathway}</p>
            </div>
          </div>

          {/* Formula */}
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px] bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.formula}
              </div>
            </div>
          </div>

          {/* Evidence */}
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px] bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/11453709/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer font-medium"
                >
                  {currentText.references}
                </a>
              </p>
            </div>
          </div>

          {/* Critical Actions */}
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px] bg-red-50 text-red-600 rounded-lg shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.criticalActionsTitle}</h2>
              <p className="text-gray-600 text-xs leading-relaxed">{currentText.criticalActionsText}</p>
            </div>
          </div>
        </div>
      </div>

      <ClinicalContextPanel 
        lang={lang}
        pearls={[
          "The Wells criteria should ONLY be applied after history and physical exam suggest PE is a possibility.",
          "For patients with a low pre-test probability (Score < 2), the PERC rule can be used to avoid D-dimer testing.",
          "The 'PE is #1 diagnosis' criterion (+3 points) is highly subjective but carries the most weight, requiring strong clinical gestalt."
        ]}
        pitfalls={[
          "Applying the score to pregnant patients (invalidated population).",
          "Using the score in patients already on anticoagulation therapy.",
          "Relying on moderate-sensitivity D-dimer assays for moderate risk patients (high-sensitivity is required)."
        ]}
        evidence="The Wells criteria for PE was developed to safely rule out PE when combined with a negative D-dimer. The scoring system assigns points based on clinical features. A score of ≤ 4 indicates 'PE unlikely', while a score > 4 indicates 'PE likely'."
        references={[
          "Wells PS, Anderson DR, Rodger M, et al. Excluding pulmonary embolism at the bedside without diagnostic imaging: management of patients with suspected pulmonary embolism presenting to the emergency department by using a simple clinical model and d-dimer. Ann Intern Med. 2001;135(2):98-107. <a href='https://pubmed.ncbi.nlm.nih.gov/11453709/' target='_blank' class='text-cyan-600 hover:underline'>PMID: 11453709</a>"
        ]}
      />

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle}</h2>
        <div className="space-y-3">
          {currentText.faqs.map(({ question, answer }: {question: string, answer: string}) => (
            <details key={question} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{question}</span>
                <span className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </div>

      <MedicalReviewerCard reviewer={REVIEWER_WELLS} lang={lang} />
    </>
  );
}
