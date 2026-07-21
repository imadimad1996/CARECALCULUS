import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { layoutTranslations } from '../utils/lang';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd } from '../components/JsonLd';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Wells' Criteria for DVT",
    subtitle: "Determine the pretest probability of deep vein thrombosis",
    cancer: "Active cancer (treatment within 6 months or palliative)",
    paralysis: "Paralysis, paresis, or recent cast of lower extremities",
    bedridden: "Recently bedridden > 3 days, or major surgery within 12 weeks",
    tenderness: "Localized tenderness along the deep venous system",
    swelling: "Entire leg swollen",
    calfSwelling: "Calf swelling > 3 cm compared to asymptomatic leg (measured 10 cm below tibial tuberosity)",
    pittingEdema: "Pitting edema confined to symptomatic leg",
    collateral: "Collateral nonvaricose superficial veins",
    dvthistory: "Previously documented DVT",
    alternativeDiagnoses: "Alternative diagnosis at least as likely as DVT",
    result: "Calculated Score",
    formula: "Sum of points (-2 to 9)",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Score ≥ 2 indicates DVT is likely; consider ultrasound. Score < 2 generally indicates DVT is unlikely; a D-dimer may be appropriate.",
    faqTitle: "Frequently Asked Questions",
    pillarTitle: "Clinical Evidence & Diagnostic Strategy for DVT",
    pillarText: [
      "The Wells' Criteria for Deep Vein Thrombosis (DVT) is the gold-standard pretest probability clinical prediction rule used to risk-stratify patients presenting with suspected lower extremity DVT. Developed by Dr. Philip S. Wells, the score safely guides diagnostic imaging and laboratory testing, dramatically reducing unnecessary compression ultrasonography.",
      "In the dichotomous two-tier model, patients are stratified into 'DVT Unlikely' (Score < 2) and 'DVT Likely' (Score ≥ 2). For patients in the unlikely category, a high-sensitivity D-dimer assay is recommended; a negative D-dimer safely rules out DVT without the need for ultrasound. Conversely, for patients in the likely category, mandatory proximal lower extremity venous ultrasound is indicated regardless of D-dimer results.",
      "In the tricotomous three-tier model, risk is stratified into Low Risk (Score ≤ 0), Moderate Risk (Score 1-2), and High Risk (Score ≥ 3). Low and moderate risk categories guide clinicians to perform a D-dimer test (high-sensitivity required for moderate risk). High risk patients should skip D-dimer testing and proceed directly to compression ultrasound. If a proximal US is negative in a high-risk patient, repeat imaging in one week is recommended.",
      "Clinicians must exercise careful judgment when evaluating the 'Alternative diagnosis' criterion (-2 points). This requires clinical experience to assess whether conditions such as cellulitis, Baker's cyst, muscle tear, or superficial thrombophlebitis are as likely or more likely than DVT."
    ],
    faqQ1: "What is the Wells Score for DVT?",
    faqA1: "The Wells Score for DVT is a validated clinical prediction rule that calculates the pretest probability of deep vein thrombosis based on 10 clinical history and physical exam criteria.",
    faqQ2: "What score indicates a likely DVT?",
    faqA2: "A Wells Score of 2 or higher indicates that DVT is likely, warranting diagnostic venous compression ultrasound. A score under 2 indicates DVT is unlikely, where a negative D-dimer safely rules out thrombosis.",
    faqQ3: "Can the Wells Score be used in pregnant patients?",
    faqA3: "No. The standard Wells Criteria are not validated for pregnant or postpartum patients. Specialized algorithms such as the LEFt clinical prediction rule should be utilized during pregnancy.",
    references: "References: Wells PS, et al. Evaluation of DVT: Value of assessment of pretest probability. NEJM 2003;349:1227-1235.",
    likely: "DVT Likely",
    unlikely: "DVT Unlikely",
    
    // New translations for 2-Tier vs 3-Tier
    modelSelectLabel: "Risk Stratification Model",
    modelToggle2Tier: "2-Tier (Dichotomous)",
    modelToggle3Tier: "3-Tier (Tricotomous)",
    lowRisk: "Low Risk",
    modRisk: "Moderate Risk",
    highRisk: "High Risk",
    managementTitle: "Management Pathway",
    managementTextLow: "Score ≤ 0: Low Risk (pretest probability ~5%). Proceed to moderate- or high-sensitivity D-dimer. A negative result rules out DVT (post-test probability <1%). A positive result warrants compression ultrasound.",
    managementTextMod: "Score 1–2: Moderate Risk (pretest probability ~17%). Proceed to high-sensitivity D-dimer (moderate-sensitivity assays are not sufficient). A negative result rules out DVT. A positive result warrants compression ultrasound.",
    managementTextHigh: "Score ≥ 3: High Risk (pretest probability 17%–53%). Skip D-dimer and proceed directly to diagnostic compression ultrasound. Positive US: treat DVT. Negative US: check high-sensitivity D-dimer. If D-dimer is negative, DVT is ruled out. If positive, repeat US in 1 week.",
    managementTextLikely: "Score ≥ 2: DVT Likely. Proceed directly to diagnostic compression ultrasound. Positive US: treat DVT. Negative US: repeat ultrasound in 1 week if high clinical suspicion remains.",
    managementTextUnlikely: "Score < 2: DVT Unlikely. Proceed to D-dimer testing. A negative moderate- or high-sensitivity D-dimer safely rules out DVT. A positive D-dimer warrants compression ultrasound.",
    criticalActionsTitle: "Critical Actions",
    criticalActionsText: "1. Evaluate for concurrent pulmonary embolism (PE) symptoms (e.g., chest pain, dyspnea) using the Wells' PE or PERC scores. 2. Assess bleeding risk using the RIETE score prior to initiating anticoagulation."
  },
  fr: {
    title: "Score de Wells pour l'at TVP",
    subtitle: "Déterminer la probabilité pré-test de thrombose veineuse profonde",
    cancer: "Cancer actif (traitement dans les 6 mois ou palliatif)",
    paralysis: "Paralysie, parésie ou plâtre récent des membres inférieurs",
    bedridden: "Alitement récent > 3 jours ou chirurgie majeure (< 12 sem)",
    tenderness: "Sensibilité localisée sur le trajet veineux profond",
    swelling: "Gonflement de toute la jambe",
    calfSwelling: "Gonflement du mollet > 3 cm par rapport à l'autre jambe (mesuré 10 cm sous la tubérosité tibiale)",
    pittingEdema: "Œdème prenant le godet sur la jambe symptomatique",
    collateral: "Veines superficielles collatérales non variqueuses",
    dvthistory: "Antécédent documenté de TVP",
    alternativeDiagnoses: "Diagnostic alternatif au moins aussi probable que TVP (-2 points)",
    result: "Score Calculé",
    formula: "Somme des points (-2 à 9)",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Un score ≥ 2 indique que la TVP est probable ; envisagez une échographie. < 2 indique que la TVP est peu probable.",
    faqTitle: "Questions Fréquentes",
    pillarTitle: "Preuves Cliniques et Stratégie Diagnostique de la TVP",
    pillarText: [
      "Le score de Wells pour la thrombose veineuse profonde (TVP) est la règle de prédiction clinique de référence pour évaluer la probabilité pré-test chez les patients présentant une suspicion de TVP des membres inférieurs. Développé par le Dr Philip S. Wells, ce score permet de guider en toute sécurité les examens d'imagerie et de laboratoire.",
      "Dans le modèle dichotomique, les patients sont classés en 'TVP peu probable' (Score < 2) et 'TVP probable' (Score ≥ 2). Chez les patients à faible probabilité, un dosage des D-dimères de haute sensibilité est recommandé ; des D-dimères négatifs permettent d'exclure une TVP sans échographie. Pour la catégorie probable, une échographie veineuse des membres inférieurs est indispensable.",
      "Dans le modèle à trois niveaux, le risque est stratifié en Risque Faible (Score ≤ 0), Risque Modéré (Score 1-2) et Risque Élevé (Score ≥ 3). Les catégories de risque faible et modéré guident le clinicien vers un dosage des D-dimères (haute sensibilité requise pour le risque modéré). Les patients à risque élevé doivent éviter le test des D-dimères et passer directement à l'échographie de compression. Si l'échographie proximale est négative, une nouvelle échographie après une semaine est recommandée.",
      "Le critère 'Diagnostic alternatif' (-2 points) nécessite un jugement clinique rigoureux pour déterminer si des affections telles qu'une érysipèle, un kyste de Baker ou une déchirure musculaire sont plus probables qu'une TVP."
    ],
    faqQ1: "Qu'est-ce que le score de Wells pour la TVP ?",
    faqA1: "Le score de Wells pour la TVP est un outil clinique validé qui évalue la probabilité pré-test de thrombose veineuse profonde reposant sur 10 critères anamnestiques et cliniques.",
    faqQ2: "Quel score indique une TVP probable ?",
    faqA2: "Un score de Wells ≥ 2 indique que la TVP est probable, nécessitant une échographie-doppler veineuse. Un score < 2 indique une faible probabilité, où des D-dimères négatifs suffisent à exclure la thrombose.",
    faqQ3: "Le score de Wells est-il applicable chez la femme enceinte ?",
    faqA3: "Non. Le score de Wells standard n'est pas validé pendant la grossesse ou le post-partum. Des algorithmes spécifiques comme le score LEFt doivent être utilisés.",
    references: "Références : Wells PS, et al. Evaluation of DVT: Value of assessment of pretest probability. NEJM 2003;349:1227-1235.",
    likely: "TVP Probable",
    unlikely: "TVP Peu Probable",
    
    // New translations for 2-Tier vs 3-Tier
    modelSelectLabel: "Modèle de Stratification",
    modelToggle2Tier: "2-Niveaux (Dichotomique)",
    modelToggle3Tier: "3-Niveaux (Trichotomique)",
    lowRisk: "Risque Faible",
    modRisk: "Risque Modéré",
    highRisk: "Risque Élevé",
    managementTitle: "Protocole de Prise en Charge",
    managementTextLow: "Score ≤ 0 : Risque Faible (prévalence ~5 %). Effectuer un dosage des D-dimères (sensibilité modérée/élevée). D-dimères négatifs excluent la TVP (probabilité post-test <1 %). D-dimères positifs indiquent une échographie veineuse.",
    managementTextMod: "Score 1–2 : Risque Modéré (probabilité pré-test ~17 %). Effectuer un dosage des D-dimères de haute sensibilité (les dosages de sensibilité modérée ne conviennent pas). D-dimères négatifs excluent la TVP. D-dimères positifs indiquent une échographie.",
    managementTextHigh: "Score ≥ 3 : Risque Élevé (probabilité pré-test 17 %–53 %). Éviter les D-dimères, effectuer directement une échographie-doppler veineuse. Échographie positive : traiter. Échographie négative : doser les D-dimères de haute sensibilité (négatifs : TVP exclue ; positifs : répéter l'échographie à 1 semaine).",
    managementTextLikely: "Score ≥ 2 : TVP Probable. Effectuer directement une échographie-doppler veineuse de compression. Échographie positive : traiter. Échographie négative : répéter l'échographie après 1 semaine si la suspicion clinique persiste.",
    managementTextUnlikely: "Score < 2 : TVP Peu Probable. Effectuer un dosage des D-dimères. Des D-dimères négatifs (sensibilité modérée/élevée) excluent la TVP. Des D-dimères positifs indiquent une échographie-doppler.",
    criticalActionsTitle: "Actions Critiques",
    criticalActionsText: "1. Évaluer les symptômes d'embolie pulmonaire (EP) associée (douleur thoracique, dyspnée) via le score Wells EP ou la règle PERC. 2. Évaluer le risque hémorragique (score RIETE) avant d'instaurer une anticoagulation."
  }
};

const itemsList = [
  { key: 'cancer', points: 1 },
  { key: 'paralysis', points: 1 },
  { key: 'bedridden', points: 1 },
  { key: 'tenderness', points: 1 },
  { key: 'swelling', points: 1 },
  { key: 'calfSwelling', points: 1 },
  { key: 'pittingEdema', points: 1 },
  { key: 'collateral', points: 1 },
  { key: 'dvthistory', points: 1 },
  { key: 'alternativeDiagnoses', points: -2 },
] as const;

export default function WellsScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});
  const [riskModel, setRiskModel] = useState<'2-tier' | '3-tier'>('3-tier');

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

  useEffect(() => {
    if (scoreValue !== 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('wells-score', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = useMemo(() => {
    if (riskModel === '2-tier') {
      return scoreValue >= 2 
        ? { label: currentText.likely, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-600', pathway: currentText.managementTextLikely }
        : { label: currentText.unlikely, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-600', pathway: currentText.managementTextUnlikely };
    } else {
      if (scoreValue <= 0) {
        return { label: currentText.lowRisk, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-600', pathway: currentText.managementTextLow };
      } else if (scoreValue <= 2) {
        return { label: currentText.modRisk, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-600', pathway: currentText.managementTextMod };
      } else {
        return { label: currentText.highRisk, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-600', pathway: currentText.managementTextHigh };
      }
    }
  }, [riskModel, scoreValue, currentText]);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}wells-score`,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}wells-score`,
            "name": currentText.title,
            "description": currentText.subtitle,
            "inLanguage": lang,
            "about": {
              "@type": "MedicalCondition",
              "name": "Deep Vein Thrombosis",
              "alternateName": "DVT",
              "code": {
                "@type": "MedicalCode",
                "codingSystem": "ICD-10",
                "code": "I82.4"
              }
            }
          },
          {
            "@type": "MedicalCalculator",
            "name": currentText.title,
            "description": currentText.subtitle,
            "url": `https://carecalculus.com/${lang === 'en' ? '' : lang + '/'}wells-score`,
            "relevantSpecialty": {
              "@type": "MedicalSpecialty",
              "name": "Emergency Medicine"
            }
          }
        ]
      }} />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-cyan-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="wells-score" lang={lang} title={currentText.title} />
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
            {currentText.faqA1}
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
                  onClick={() => setRiskModel('3-tier')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${riskModel === '3-tier' ? 'bg-white text-cyan-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {currentText.modelToggle3Tier}
                </button>
                <button
                  type="button"
                  onClick={() => setRiskModel('2-tier')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${riskModel === '2-tier' ? 'bg-white text-cyan-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {currentText.modelToggle2Tier}
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
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg transition-colors ${selections[item.key] ? 'bg-cyan-600 text-white shadow-sm' : item.points > 0 ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className={`sticky top-28 backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-8 min-h-[360px] transition-all duration-300 ${scoreValue >= 2 ? 'ring-2 ring-red-500/60 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.35)]' : 'ring-1 ring-white/15'}`}>
            <div className={`absolute top-0 right-0 p-36 bg-gradient-to-bl ${scoreValue >= 2 ? 'from-red-500/40 via-rose-500/20' : 'from-cyan-500/30 via-teal-500/10'} to-transparent rounded-bl-[120px] pointer-events-none animate-pulse`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
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
                  value: selections[item.key] ? 'YES (+1 pt)' : 'NO (0 pt)'
                }))}
                results={[
                  { label: 'Wells Score', value: `${scoreValue} Points` },
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
            <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-cyan-900 mb-2 text-base">{currentText.managementTitle}</h2>
              <p className="text-gray-700 text-sm leading-relaxed">{category.pathway}</p>
            </div>
          </div>

          {/* Formula */}
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

          {/* Evidence */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-600 text-sm leading-relaxed italic">
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/14507948/" 
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
            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg shrink-0">
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

      {/* In-Content Native Ad */}

      {/* MDCalc-Killer Deep Content Panel */}
      <ClinicalContextPanel 
        lang={lang}
        pearls={[
          "The Wells criteria should ONLY be applied after history and physical exam suggest DVT is a possibility.",
          "Do not use in patients with suspected upper extremity DVT.",
          "The 'Alternative diagnosis at least as likely' criterion is highly subjective but carries the most weight (-2 points)."
        ]}
        pitfalls={[
          "Applying the score to pregnant patients (invalidated population).",
          "Using the score in patients already on anticoagulation therapy.",
          "Failing to measure the calf exactly 10 cm below the tibial tuberosity."
        ]}
        evidence="The Wells criteria was originally developed in 1997 and refined in 2003 to safely rule out DVT when combined with a negative D-dimer. The scoring system assigns points based on clinical features (e.g., active cancer +1, entire leg swollen +1). A score of < 2 indicates 'DVT unlikely' (prevalence ~5%), while a score ≥ 2 indicates 'DVT likely' (prevalence ~28%)."
        references={[
          "Wells PS, Anderson DR, Rodger M, et al. Evaluation of D-dimer in the diagnosis of suspected deep-vein thrombosis. N Engl J Med. 2003;349(13):1227-1235. <a href='https://pubmed.ncbi.nlm.nih.gov/14507948/' target='_blank' class='text-cyan-600 hover:underline'>PMID: 14507948</a>",
          "Tovey C, Wyatt S. Diagnosis, investigation, and management of deep vein thrombosis. BMJ. 2003;326(7399):1180-1184."
        ]}
      />

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <span className="text-sm">{q}</span>
                <span className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}

