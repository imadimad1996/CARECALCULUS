import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';

const translations: Translations = {
  en: {
    title: "MELD Score",
    subtitle: "Model for End-Stage Liver Disease (MELD-Na)",
    bilirubin: "Bilirubin (mg/dL)",
    inr: "INR",
    creatinine: "Creatinine (mg/dL)",
    sodium: "Sodium (mEq/L)",
    dialysis: "Dialysis at least twice in last week",
    result: "MELD-Na Score",
    formula: "MELD Score predicting 3-month mortality",
    clinicalTitle: "Interpretation & Caveats",
    clinicalText: "MELD-Na ranges from 6 to 40. High scores indicate increased severity of hepatic dysfunction. Clinical Pearl: Patients on warfarin or other oral anticoagulants will have an artificially elevated INR, skewing the MELD score higher without reflecting true hepatic decline.",
    faqA1: "The MELD Score (Model for End-Stage Liver Disease) is a validated prognostic score predicting 3-month mortality in liver cirrhosis. A MELD score ≥15 is the standard threshold for liver transplant listing. For scores ≥40, 3-month mortality reaches 71.3%; for 30-39, it is 52.6%; for 20-29, 19.6%; and for 10-19, 6.0%.",
    references: "Kamath PS, et al. A model to predict survival in patients with end-stage liver disease. Hepatology. 2001;33(2):464-470 (PMID: 11172350). Biggins SW, et al. Evidence-based incorporation of serum sodium concentration into MELD. Gastroenterology. 2008;135(4):1197-1205 (PMID: 18718470).",
    pillarTitle: "Physiologic Derivation, Sodium Incorporation, and Transplant Allocation",
    pillarText: [
      "The Model for End-Stage Liver Disease (MELD) was originally derived by Kamath et al. in 2001 to predict survival following transjugular intrahepatic portosystemic shunt (TIPS) placement and subsequently adopted by UNOS/OPTN as the primary quantitative metric for organ allocation in orthotopic liver transplantation. By objectively integrating serum creatinine, total bilirubin, and INR, MELD captures the interconnected physiological triad of renal impairment, hepatocyte synthetic failure, and coagulopathy.",
      "The addition of serum sodium to formulate MELD-Na in 2008 resolved a critical diagnostic gap in end-stage cirrhosis. Dilutional hyponatremia is a physiological hallmark of portal hypertension: systemic vasodilation induces non-osmotic hypersecretion of arginine vasopressin (AVP), leading to free-water retention. Patients manifesting refractory ascites and profound hyponatremia previously suffered disproportionate pre-transplant mortality despite moderate standard MELD scores. Incorporating sodium (capped between 125 and 137 mEq/L) accurately upweights mortality risk in this high-risk cohort.",
      "A primary clinical limitation when applying MELD-Na at the bedside is its sensitivity to laboratory confounders. Warfarin or direct oral anticoagulants artificially elevate the INR without indicating intrinsic hepatocellular decline. Furthermore, in acute hepatorenal syndrome (HRS-AKI), serum creatinine can lag behind real-time glomerular filtration rate drops due to muscle wasting in sarcopenic cirrhotic patients. Always correlate laboratory shifts with clinical volume status and urinary diagnostic indices."
    ],
    faqTitle: "Frequently Asked Questions",
    faqQ1: "What is the MELD score and why is it used?",
    faqQ2: "How does MELD-Na differ from the original MELD score?",
    faqQ3: "What MELD score qualifies a patient for liver transplant listing?",
    faqQ4: "How does renal function impact the MELD score calculation?",
    faqA2: "MELD-Na incorporates serum sodium concentration (bounded between 125 and 137 mEq/L) into the original equation. Because dilutional hyponatremia reflects severe portal hypertension and free-water retention, MELD-Na significantly improves mortality prediction over the standard MELD score.",
    faqA3: "A MELD score greater than or equal to 15 is the standard clinical threshold where the 1-year mortality benefit of orthotopic liver transplantation outweighs perioperative risks. UNOS allocation policies prioritize patients with the highest MELD-Na scores on regional waiting lists.",
    faqA4: "Serum creatinine has a logarithmic impact in the MELD equation. If a patient undergoes hemodialysis or continuous renal replacement therapy at least twice within the prior 7 days, the serum creatinine variable is automatically fixed at the upper bound of 4.0 mg/dL.",
    yes: "Yes",
    no: "No",
  },
  fr: {
    title: "Score MELD",
    subtitle: "Évaluation de l'insuffisance hépatique terminale (MELD-Na)",
    bilirubin: "Bilirubine (mg/dL)",
    inr: "INR",
    creatinine: "Créatinine (mg/dL)",
    sodium: "Sodium (mEq/L)",
    dialysis: "Dialyse au moins 2 fois la semaine passée",
    result: "Score MELD-Na",
    formula: "Score MELD prédisant la mortalité à 3 mois",
    clinicalTitle: "Interprétation & Limites",
    clinicalText: "Le MELD-Na varie de 6 à 40. Des scores élevés indiquent une gravité accrue. Note clinique : Les patients sous anticoagulants (ex. warfarine) présentent un INR artificiellement élevé, ce qui fausse le score MELD à la hausse sans refléter un déclin hépatique réel.",
    faqA1: "Le score MELD (Model for End-Stage Liver Disease) est un score pronostique validé prédisant la mortalité à 3 mois dans la cirrhose. Un MELD ≥15 est le seuil standard pour l'inscription sur liste de greffe. La mortalité à 3 mois est de 71,3 % pour un score ≥40, 52,6 % pour 30-39, 19,6 % pour 20-29, et 6,0 % pour 10-19.",
    references: "Kamath PS, et al. A model to predict survival in patients with end-stage liver disease. Hepatology. 2001;33(2):464-470 (PMID: 11172350). Biggins SW, et al. Gastroenterology. 2008;135(4):1197-1205 (PMID: 18718470).",
    pillarTitle: "Dérivation Physiologique, Intégration du Sodium et Allocation de Greffe",
    pillarText: [
      "Le score MELD (Model for End-Stage Liver Disease) a été initialement dérivé par Kamath et al. en 2001 pour prédire la survie après la mise en place d'un shunt portosystémique intrahépatique transjugulaire (TIPS), puis adopté comme critère quantitatif principal pour l'allocation des organes en transplantation hépatique. En intégrant objectivement la créatinine sérique, la bilirubine totale et l'INR, le MELD capture la triade physiologique interdépendante de l'atteinte rénale, de la défaillance synthétique hépatocytaire et de la coagulopathie.",
      "L'ajout du sodium sérique pour formuler le MELD-Na en 2008 a comblé une lacune diagnostique majeure dans la cirrhose terminale. L'hyponatrémie de dilution est une caractéristique physiologique de l'hypertension portale : la vasodilatation systémique induit une hypersécrétion non osmotique d'arginine vasopressine (AVP), conduisant à une rétention d'eau libre. Les patients présentant une ascite réfractaire et une hyponatrémie profonde subissaient auparavant une mortalité pré-greffe disproportionnée malgré des scores MELD standards modérés. L'intégration du sodium (borné entre 125 et 137 mEq/L) ajuste précisément ce risque de mortalité.",
      "Une limite clinique essentielle lors de l'application du MELD-Na au lit du patient est sa sensibilité aux facteurs confondants de laboratoire. La warfarine ou les anticoagulants oraux directs augmentent artificiellement l'INR sans indiquer de déclin hépatocellulaire intrinsèque. De plus, dans le syndrome hépatorénal aigu (SHR-IRA), la créatinine sérique peut sous-estimer la chute réelle du débit de filtration glomérulaire en raison de la fonte musculaire chez le cirrhotique sarcopénique. Corrélez toujours les variations de laboratoire avec le statut volumique clinique."
    ],
    faqTitle: "Questions Fréquentes",
    faqQ1: "Qu'est-ce que le score MELD et pourquoi est-il utilisé ?",
    faqQ2: "En quoi le MELD-Na diffère-t-il du score MELD original ?",
    faqQ3: "Quel score MELD qualifie un patient pour une inscription en greffe hépatique ?",
    faqQ4: "Comment la fonction rénale influence-t-elle le calcul du score MELD ?",
    faqA2: "Le MELD-Na intègre la concentration de sodium sérique (bornée entre 125 et 137 mEq/L) dans l'équation d'origine. Étant donné que l'hyponatrémie de dilution reflète une hypertension portale sévère et une rétention d'eau libre, le MELD-Na améliore considérablement la prédiction de mortalité par rapport au MELD standard.",
    faqA3: "Un score MELD supérieur ou égal à 15 représente le seuil clinique standard où le bénéfice de survie à un an d'une transplantation hépatique dépasse les risques périopératoires. Les politiques d'allocation priorisent les patients ayant les scores MELD-Na les plus élevés.",
    faqA4: "La créatinine sérique a un impact logarithmique dans l'équation MELD. Si un patient subit une hémodialyse ou une épuration extra-rénale au moins deux fois au cours des 7 jours précédents, la variable créatinine sérique est automatiquement fixée à la valeur maximale de 4,0 mg/dL.",
    yes: "Oui",
    no: "Non"
  }
};

export default function MeldScore({ lang }: { lang: LangCode }) {
  const [bilirubin, setBilirubin] = useState<number | ''>(1.2);
  const [inr, setInr] = useState<number | ''>(1.1);
  const [creatinine, setCreatinine] = useState<number | ''>(1.0);
  const [sodium, setSodium] = useState<number | ''>(137);
  const [dialysis, setDialysis] = useState<boolean>(false);

  const currentText = translations[lang];
  const isRtl = false;

  const meldScore = useMemo(() => {
    if (bilirubin === '' || inr === '' || creatinine === '' || sodium === '') return null;
    
    // Bounds
    let b = Math.max(1, bilirubin);
    let c = Math.max(1, creatinine);
    let i = Math.max(1, inr);
    
    if (dialysis) {
      c = 4.0;
    } else {
      c = Math.min(4.0, c);
    }
    
    // Original MELD
    let meld = 0.957 * Math.log(c) + 0.378 * Math.log(b) + 1.120 * Math.log(i) + 0.643;
    meld = Math.round(meld * 10);
    
    if (meld > 40) meld = 40;
    
    // MELD-Na
    if (meld > 11) {
      let na = Math.max(125, Math.min(137, sodium));
      meld = meld + 1.32 * (137 - na) - (0.033 * meld * (137 - na));
    }
    
    return Math.round(meld);
  }, [bilirubin, inr, creatinine, sodium, dialysis]);

  useEffect(() => {
    if (meldScore !== null && meldScore > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('meld-score', lang, meldScore);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [meldScore, lang]);

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
          <EmbedCodeButton calculatorSlug="meld-score" lang={lang} title={currentText.title} />
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
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-6 transition-all">
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{currentText.bilirubin}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={bilirubin}
                    onChange={(e) => setBilirubin(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-4 py-3 border border-gray-200/80 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-bold text-gray-900 transition-all font-mono shadow-sm hover:border-gray-300"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{currentText.inr}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={inr}
                    onChange={(e) => setInr(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-4 py-3 border border-gray-200/80 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-bold text-gray-900 transition-all font-mono shadow-sm hover:border-gray-300"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{currentText.creatinine}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={creatinine}
                    onChange={(e) => setCreatinine(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-4 py-3 border border-gray-200/80 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-bold text-gray-900 transition-all font-mono shadow-sm hover:border-gray-300"
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{currentText.sodium}</label>
                  <input
                    type="number"
                    step="1"
                    value={sodium}
                    onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white px-4 py-3 border border-gray-200/80 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-bold text-gray-900 transition-all font-mono shadow-sm hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-3">{currentText.dialysis}</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDialysis(false)}
                    className={`flex-1 p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${!dialysis ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                  >
                    {currentText.no}
                  </button>
                  <button
                    onClick={() => setDialysis(true)}
                    className={`flex-1 p-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${dialysis ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                  >
                    {currentText.yes}
                  </button>
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
                  {meldScore !== null ? meldScore : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">Points</span>
              </div>
            </div>
            
            {meldScore !== null && (
              <div className="relative z-10 mt-10 space-y-4">
                <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${
                  meldScore >= 20 ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                  meldScore >= 10 ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">
                      {meldScore >= 40 ? '71.3% 3-month mortality' : 
                       meldScore >= 30 ? '52.6% 3-month mortality' :
                       meldScore >= 20 ? '19.6% 3-month mortality' :
                       meldScore >= 10 ? '6.0% 3-month mortality' : '1.9% 3-month mortality'}
                    </span>
                  </div>
                </div>

                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.bilirubin, value: `${bilirubin} mg/dL` },
                    { label: currentText.inr, value: `${inr}` },
                    { label: currentText.creatinine, value: `${creatinine} mg/dL` },
                    { label: currentText.sodium, value: `${sodium} mEq/L` },
                    { label: currentText.dialysis, value: dialysis ? currentText.yes : currentText.no }
                  ]}
                  results={[
                    { label: currentText.result, value: meldScore, unit: 'Points' },
                    { label: 'Estimated 3-Month Mortality', value: meldScore >= 40 ? '71.3%' : meldScore >= 30 ? '52.6%' : meldScore >= 20 ? '19.6%' : meldScore >= 10 ? '6.0%' : '1.9%' }
                  ]}
                  formula="MELD(Na) = MELD + 1.32 * (137 - Na) - (0.033 * MELD * (137 - Na))"
                  disclaimer={currentText.clinicalText}
                  references={currentText.references}
                  lang={lang}
                />
              </div>
            )}
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
            </div>
          </div>
        </div>
      </div>

      {/* In-Content Native Ad */}
      <AdsterraNativeBanner refreshDependency={meldScore || 0} />

      {/* Pillar Content Section */}
      <div className="mt-8 pt-10 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText?.map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* See Also Section */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'Child-Pugh Score', path: '/child-pugh-score' },
            { label: 'SOFA Score', path: '/sofa-score' },
            { label: 'Creatinine Clearance', path: '/creatinine-clearance' },
            { label: 'Anion Gap', path: '/anion-gap' },
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

      {/* FAQ Section */}
      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle}</h2>
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
