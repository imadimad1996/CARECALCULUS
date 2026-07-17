import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';

const translations: Translations = {
  en: {
    title: "Glasgow Coma Scale (GCS)",
    subtitle: "Assess the level of consciousness after traumatic brain injury",
    eye: "Eye Opening Response",
    eye4: "4 - Spontaneous",
    eye3: "3 - To Voice",
    eye2: "2 - To Pain",
    eye1: "1 - None",
    verbal: "Verbal Response",
    verbal5: "5 - Orientated",
    verbal4: "4 - Confused",
    verbal3: "3 - Inappropriate Words",
    verbal2: "2 - Incomprehensible Sounds",
    verbal1: "1 - None",
    motor: "Motor Response",
    motor6: "6 - Obeys Commands",
    motor5: "5 - Localizes to Pain",
    motor4: "4 - Withdraws from Pain",
    motor3: "3 - Flexion to Pain (Decorticate)",
    motor2: "2 - Extension to Pain (Decerebrate)",
    motor1: "1 - None",
    result: "Calculated GCS",
    formula: "GCS = Eye + Verbal + Motor",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Severe (GCS ≤ 8), Moderate (GCS 9-12), Minor (GCS ≥ 13). Intubation is generally recommended for GCS ≤ 8.",
    pillarTitle: "Neurological Assessment, Intubation Thresholds, and Limitations",
    pillarText: [
      "The Glasgow Coma Scale (GCS) is a vital clinical tool for objectively assessing the level of consciousness in patients with acute brain injury. A hallmark of the GCS is its tripartite evaluation: Eye Opening, Verbal Response, and Motor Response. The motor component is particularly prognostic; specifically, the transition from 'flexion to pain' (decorticate posturing, indicating damage above the red nucleus) to 'extension to pain' (decerebrate posturing, indicating damage at or below the red nucleus) represents a severe neurological deterioration and impending brainstem herniation.",
      "A critical clinical threshold in the GCS is a score of 8 or less, frequently memorized by the mnemonic 'GCS of 8, intubate.' At this level of severe impairment, patients lose their protective airway reflexes (gag and cough reflexes), dramatically increasing the risk of aspiration pneumonitis and hypoxia, which can exacerbate secondary brain injury. Rapid sequence intubation (RSI) is therefore standard practice to secure the airway and allow for controlled ventilation, aiming to maintain normocapnia.",
      "Despite its ubiquity, the GCS has notable clinical limitations. It cannot be accurately assessed in patients who are chemically paralyzed, sedated, or intubated (often noted as a 'T' in the verbal score, e.g., GCS 10T). It also excludes pupillary reactivity and focal neurological deficits—critical signs when diagnosing unilateral mass lesions such as epidural hematomas. Modern neurological assessments often combine the GCS with the FOUR (Full Outline of UnResponsiveness) score or detailed pupillary examinations to overcome these shortcomings."
    ],
    references: "References: Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Severe Brain Injury (≤8)",
    moderate: "Moderate Brain Injury (9-12)",
    minor: "Minor Brain Injury (13-15)",
    faqQ1: "What is the Glasgow Coma Scale (GCS)?",
    faqA1: "The Glasgow Coma Scale (GCS) is a standardized neurological assessment tool that measures level of consciousness by scoring three components: Eye Opening (E, 1-4), Verbal Response (V, 1-5), and Motor Response (M, 1-6). Total score ranges from 3 to 15.",
    faqQ2: "What GCS score indicates severe brain injury?",
    faqA2: "A GCS score of 8 or below indicates severe brain injury. A score of 9-12 indicates moderate injury, and 13-15 indicates mild injury. Patients with GCS ≤ 8 are generally considered for intubation to protect the airway.",
    faqQ3: "Who developed the Glasgow Coma Scale?",
    faqA3: "The GCS was developed by Teasdale and Jennett in 1974 at the University of Glasgow, published in The Lancet. It has since become the global standard for consciousness assessment after traumatic brain injury.",
    faqQ4: "Can GCS be used in children?",
    faqA4: "The standard GCS is validated for adults and older children. For infants and young children, a modified Pediatric GCS is preferred, which adapts verbal and motor components to age-appropriate responses.",
  },
  fr: {
    title: "Score de Glasgow (GCS)",
    subtitle: "Évaluer le niveau de conscience après un traumatisme crânien",
    eye: "Ouverture des Yeux",
    eye4: "4 - Spontanée",
    eye3: "3 - Au Bruit",
    eye2: "2 - À la Douleur",
    eye1: "1 - Aucune",
    verbal: "Réponse Verbale",
    verbal5: "5 - Orientée",
    verbal4: "4 - Confuse",
    verbal3: "3 - Mots Inappropriés",
    verbal2: "2 - Sons Incompréhensibles",
    verbal1: "1 - Aucune",
    motor: "Réponse Motrice",
    motor6: "6 - Obéit aux Commandes",
    motor5: "5 - Oriente vers la Douleur",
    motor4: "4 - Évitement de la Douleur",
    motor3: "3 - Flexion à la Douleur (Décortication)",
    motor2: "2 - Extension à la Douleur (Décérébration)",
    motor1: "1 - Aucune",
    result: "Score GCS Calculé",
    formula: "GCS = Yeux + Verbe + Moteur",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Sévère (GCS ≤ 8), Modéré (GCS 9-12), Mineur (GCS ≥ 13). L'intubation est généralement recommandée pour GCS ≤ 8.",
    pillarTitle: "Évaluation Neurologique, Seuils d'Intubation et Limites",
    pillarText: [
      "Le score de Glasgow (GCS) est un outil clinique essentiel pour évaluer objectivement le niveau de conscience chez les patients souffrant de lésions cérébrales aiguës. Une caractéristique de ce score est son évaluation tripartite : ouverture des yeux, réponse verbale et réponse motrice. La composante motrice est particulièrement pronostique ; la transition de la « flexion à la douleur » (décortication) à l'« extension à la douleur » (décérébration) représente une détérioration neurologique sévère et un engagement cérébral imminent.",
      "Un seuil clinique critique du GCS est un score inférieur ou égal à 8. À ce niveau d'altération, les patients perdent leurs réflexes de protection des voies aériennes (réflexe nauséeux et de la toux), ce qui augmente considérablement le risque de pneumopathie d'inhalation et d'hypoxie, susceptibles d'aggraver les lésions cérébrales secondaires. L'intubation en séquence rapide (ISR) est donc la pratique standard pour sécuriser les voies aériennes et permettre une ventilation contrôlée.",
      "Malgré son utilisation universelle, le GCS présente des limites cliniques notables. Il ne peut pas être évalué avec précision chez les patients curarisés, sous sédation ou intubés (souvent noté par un « T » dans le score verbal). Il exclut également la réactivité pupillaire et les déficits neurologiques focaux, signes majeurs pour identifier les lésions expansives unilatérales comme un hématome épidural. Les évaluations neurologiques modernes associent souvent le GCS au score FOUR ou à un examen pupillaire détaillé pour combler ces lacunes."
    ],
    references: "Références : Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Lésion cérébrale sévère (≤8)",
    moderate: "Lésion cérébrale modérée (9-12)",
    minor: "Lésion cérébrale mineure (13-15)",
    faqQ1: "Qu'est-ce que l'échelle de Glasgow (GCS) ?",
    faqA1: "L'échelle de Glasgow (GCS) est un outil d'évaluation neurologique standardisé mesurant l'état de conscience d'un patient à l'aide de trois critères : ouverture des yeux (E, 1-4), réponse verbale (V, 1-5) et réponse motrice (M, 1-6). Le score total varie de 3 à 15.",
    faqQ2: "Quel score GCS indique un traumatisme crânien sévère ?",
    faqA2: "Un score GCS inférieur ou égal à 8 indique un traumatisme crânien sévère. Un score de 9 à 12 indique un traumatisme modéré et un score de 13 à 15 indique un traumatisme léger. Une intubation protectrice est généralement recommandée pour un GCS ≤ 8.",
    faqQ3: "Qui a développé l'échelle de Glasgow ?",
    faqA3: "L'échelle GCS a été développée en 1974 par Graham Teasdale et Bryan Jennett à l'Université de Glasgow, et publiée dans The Lancet. Elle est depuis devenue la référence mondiale d'évaluation après traumatisme crânien.",
    faqQ4: "L'échelle GCS peut-elle être utilisée chez l'enfant ?",
    faqA4: "L'échelle GCS standard est validée pour l'adulte et l'enfant grand. Pour les nourrissons et jeunes enfants, on utilise l'échelle de Glasgow pédiatrique modifiée, adaptant les critères de réponses verbales et motrices à l'âge.",
  }
};

export default function GcsCalculator({ lang }: { lang: LangCode }) {
  const [eye, setEye] = useState<number>(0);
  const [verbal, setVerbal] = useState<number>(0);
  const [motor, setMotor] = useState<number>(0);

  const currentText = translations[lang];
  const isRtl = false;

  const isComplete = eye > 0 && verbal > 0 && motor > 0;
  const gcsValue = isComplete ? eye + verbal + motor : 0;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('glasgow-coma-scale', lang, gcsValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, gcsValue, lang]);


  const getGcsCategory = (val: number) => {
    if (val <= 8) return { label: currentText.severe, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val <= 12) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.minor, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getGcsCategory(gcsValue);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-3xl mb-12 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="glasgow-coma-scale" lang={lang} title={currentText.title} />
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.eye}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[4, 3, 2, 1].map((val) => (
                    <button
                      key={`eye-${val}`}
                      onClick={() => setEye(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${eye === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`eye${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.verbal}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`verbal-${val}`}
                      onClick={() => setVerbal(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${verbal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`verbal${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.motor}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[6, 5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`motor-${val}`}
                      onClick={() => setMotor(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${motor === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`motor${val}`]}
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
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
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
                  {isComplete ? gcsValue : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">/ 15</span>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">
                      {category.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Sélectionnez les critères pour le résultat' : 'Select criteria to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.eye, value: eye > 0 ? `${eye} - ${currentText[`eye${eye}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.verbal, value: verbal > 0 ? `${verbal} - ${currentText[`verbal${verbal}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.motor, value: motor > 0 ? `${motor} - ${currentText[`motor${motor}` as keyof typeof currentText]}` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${gcsValue} / 15` : '-- / 15' },
                  { label: 'Severity Score', value: isComplete ? category.label : '--' }
                ]}
                formula={currentText.formula}
                disclaimer={currentText.clinicalText}
                references={currentText.references}
                lang={lang}
              />

              {/* Reciprocity Prompt */}
              {isComplete && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-all backdrop-blur-md shadow-sm">
                  <div className="font-semibold text-center sm:text-left">
                    {lang === 'en' ? 'Did this save you time? Bookmark us or share with a colleague!' : 
                     lang === 'fr' ? 'Cela vous a-t-il fait gagner du temps ? Partagez avec un collègue !' :
                     'هل وفر هذا من وقتك؟ شاركها مع زملائك!'}
                  </div>
                </div>
              )}
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/4136544/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Teasdale & Jennett, Lancet 1974 (PMID: 4136544) →</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* In-Content Native Ad */}

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* GCS Risk Stratification Table */}
      <div className="mt-8 pt-10 border-t border-gray-100 max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {lang === 'fr' ? 'Sévérité du Traumatisme Crânien (GCS)' : 'GCS Injury Severity & Clinical Management'}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right border-collapse text-sm text-gray-600">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-700 font-bold">
                <th className="p-3">{lang === 'fr' ? 'Score GCS' : 'GCS Score'}</th>
                <th className="p-3">{lang === 'fr' ? 'Sévérité du TC' : 'TBI Severity'}</th>
                <th className="p-3">{lang === 'fr' ? 'Mortalité / Pronostic' : 'Pronostic / Mortality'}</th>
                <th className="p-3">{lang === 'fr' ? 'Prise en charge Recommandée' : 'Recommended Action'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono font-bold">13 - 15</td>
                <td className="p-3 text-emerald-600 font-semibold">{lang === 'fr' ? 'Léger' : 'Mild'}</td>
                <td className="p-3">&lt; 1%</td>
                <td className="p-3">{lang === 'fr' ? 'Surveillance clinique, sortie possible si imagerie normale.' : 'Observation, standard neurological checks.'}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono font-bold">9 - 12</td>
                <td className="p-3 text-amber-600 font-semibold">{lang === 'fr' ? 'Modéré' : 'Moderate'}</td>
                <td className="p-3">~2 - 5%</td>
                <td className="p-3">{lang === 'fr' ? 'Hospitalisation, TDM cérébral, surveillance neurologique rapprochée.' : 'Admission, CT head scan, close neurological monitoring.'}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="p-3 font-mono font-bold">3 - 8</td>
                <td className="p-3 text-red-600 font-bold">{lang === 'fr' ? 'Sévérité (Coma)' : 'Severe (Coma)'}</td>
                <td className="p-3">~30 - 40%</td>
                <td className="p-3">{lang === 'fr' ? 'Intubation immédiate (ISR), ventilation, soins intensifs.' : 'Secure airway (Intubation), mechanical ventilation, ICU admission.'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'MAP Calculator', path: '/map-calculator' },
            { label: 'PHQ-9 Score', path: '/phq9-score' },
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
