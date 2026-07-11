import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';

const translations: Translations = {
  en: {
    title: "Child-Pugh Score for Cirrhosis",
    subtitle: "Classify severity of liver cirrhosis and estimate prognosis",
    bilirubin: "Total Bilirubin",
    bilirubin1: "< 2.0 mg/dL [< 34 µmol/L] (1 point)",
    bilirubin2: "2.0 - 3.0 mg/dL [34 - 51 µmol/L] (2 points)",
    bilirubin3: "> 3.0 mg/dL [> 51 µmol/L] (3 points)",
    albumin: "Serum Albumin",
    albumin1: "> 3.5 g/dL [> 35 g/L] (1 point)",
    albumin2: "2.8 - 3.5 g/dL [28 - 35 g/L] (2 points)",
    albumin3: "< 2.8 g/dL [< 28 g/L] (3 points)",
    inr: "INR (International Normalized Ratio)",
    inr1: "< 1.7 (1 point)",
    inr2: "1.7 - 2.3 (2 points)",
    inr3: "> 2.3 (3 points)",
    ascites: "Ascites",
    ascites1: "None (1 point)",
    ascites2: "Mild / Diuretic-responsive (2 points)",
    ascites3: "Moderate-to-Severe / Refractory (3 points)",
    enceph: "Hepatic Encephalopathy",
    enceph1: "None (1 point)",
    enceph2: "Grade I - II / Mild (2 points)",
    enceph3: "Grade III - IV / Severe (3 points)",
    result: "Calculated Child-Pugh Score",
    formula: "Child-Pugh = Bilirubin + Albumin + INR + Ascites + Encephalopathy",
    clinicalTitle: "Clinical Interpretation & Caveats",
    clinicalText: "Class A (5-6 points) represents mild/compensated disease (1-year survival: ~100%, 2-year: ~85%). Class B (7-9 points) represents moderate disease (1-year survival: ~81%, 2-year: ~57%). Class C (10-15 points) represents severe/decompensated disease (1-year survival: ~45%, 2-year: ~35%). Clinical Pearl: Ascites and encephalopathy are subjective. Ensure to grade ascites based on ultrasound/physical exam response to diuretics, and grade encephalopathy using the West Haven criteria. Active GI bleeding can transiently skew encephalopathy grades.",
    references: "Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649 (PMID: 4515662).",
    classA: "Class A: Good Prognosis (5-6)",
    classB: "Class B: Moderate Prognosis (7-9)",
    classC: "Class C: Poor Prognosis (10-15)",
    faqQ1: "What is the Child-Pugh score?",
    faqA1: "The Child-Pugh score is a clinical staging system used to assess the prognosis of chronic liver disease, particularly cirrhosis. It evaluates total bilirubin, serum albumin, INR, ascites, and hepatic encephalopathy.",
    faqQ2: "What are the Child-Pugh classification classes?",
    faqA2: "Patients are categorized into three classes: Class A (Score 5-6, 100% 1-year survival, 85% 2-year survival), Class B (Score 7-9, 81% 1-year survival, 57% 2-year survival), and Class C (Score 10-15, 45% 1-year survival, 35% 2-year survival). These survival rates guide eligibility for liver transplantation and surgical risk assessment.",
    faqQ3: "How does the Child-Pugh score differ from the MELD score?",
    faqA3: "The Child-Pugh score includes subjective parameters (ascites and encephalopathy) alongside labs. The MELD score is purely objective and laboratory-based (creatinine, bilirubin, INR, sodium), making it preferred for transplant allocation.",
    faqQ4: "What is the maximum Child-Pugh score?",
    faqA4: "The score ranges from a minimum of 5 points to a maximum of 15 points. Higher scores indicate more severe hepatic impairment and poorer prognosis.",
    pillarTitle: "Historical Derivation, Perioperative Risk Assessment, and Subjective Limitations",
    pillarText: [
      "The Child-Pugh classification system (originally the Child-Turcotte score formulated by C.G. Child and J.G. Turcotte in 1964 and modified by R.N. Pugh in 1973) remains a cornerstone in hepatology for evaluating hepatic functional reserve. Originally developed to predict operative mortality in patients undergoing elective esophageal transection for variceal bleeding, Child-Pugh stratifies chronic cirrhosis into three discrete prognostic classes based on three objective laboratory markers (total bilirubin, serum albumin, INR) and two clinical variables (ascites and hepatic encephalopathy).",
      "In modern perioperative medicine, Child-Pugh class serves as a critical triage gatekeeper for abdominal and extrahepatic surgeries. Patients categorized as Class A tolerate general surgical procedures with acceptable perioperative mortality (~10%), whereas Class B patients face significant morbidity and mortality rates (30-40%), necessitating strict optimization or minimally invasive alternatives. Elective extrahepatic surgery is widely contraindicated in Class C cirrhosis (mortality risk exceeding 80%) due to refractory coagulopathy, severe immunoparesis, and impending acute-on-chronic liver failure.",
      "A significant clinical challenge with Child-Pugh scoring at the bedside is the inherent inter-observer variability of its clinical parameters. Ascites grading (mild vs. moderate/severe) depends on diuretic responsiveness and ultrasound quantification, while hepatic encephalopathy grading relies on subjective interpretation under West Haven criteria. Furthermore, acute gastrointestinal hemorrhage or sedative administration can transiently mimic high-grade hepatic encephalopathy without reflecting true hepatocellular synthetic decline."
    ],
  },
  fr: {
    title: "Score de Child-Pugh",
    subtitle: "Classifier la sévérité de la cirrhose hépatique et estimer le pronostic",
    bilirubin: "Bilirubine Totale",
    bilirubin1: "< 2,0 mg/dL [< 34 µmol/L] (1 point)",
    bilirubin2: "2,0 - 3,0 mg/dL [34 - 51 µmol/L] (2 points)",
    bilirubin3: "> 3,0 mg/dL [> 51 µmol/L] (3 points)",
    albumin: "Albumine Sérique",
    albumin1: "> 3,5 g/dL [> 35 g/L] (1 point)",
    albumin2: "2,8 - 3,5 g/dL [28 - 35 g/L] (2 points)",
    albumin3: "< 2,8 g/dL [< 28 g/L] (3 points)",
    inr: "INR (Rapport normalisé international)",
    inr1: "< 1,7 (1 point)",
    inr2: "1,7 - 2,3 (2 points)",
    inr3: "> 2,3 (3 points)",
    ascites: "Ascite",
    ascites1: "Absente (1 point)",
    ascites2: "Faible / Répond aux diurétiques (2 points)",
    ascites3: "Modérée à Sévère / Réfractaire (3 points)",
    enceph: "Encéphalopathie Hépatique",
    enceph1: "Absente (1 point)",
    enceph2: "Stade I - II / Modérée (2 points)",
    enceph3: "Stade III - IV / Sévère (3 points)",
    result: "Score de Child-Pugh Calculé",
    formula: "Child-Pugh = Bilirubine + Albumine + INR + Ascite + Encéphalopathie",
    clinicalTitle: "Interprétation Clinique & Limites",
    clinicalText: "Classe A (5-6 points) : cirrhose compensée (survie à 1 an : ~100%, 2 ans : ~85%). Classe B (7-9 points) : décompensation modérée (survie à 1 an : ~81%, 2 ans : ~57%). Classe C (10-15 points) : cirrhose décompensée (survie à 1 an : ~45%, 2 ans : ~35%). Note clinique : L'ascite et l'encéphalopathie sont subjectives. Évaluez l'ascite par échographie ou réponse clinique aux diurétiques, et l'encéphalopathie selon les critères de West Haven. Les saignements digestifs actifs peuvent fausser transitoirement les grades d'encéphalopathie.",
    references: "Pugh RN, Murray-Lyon IM, Dawson JL, Pietroni MC, Williams R. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg. 1973;60(8):646-649 (PMID: 4515662).",
    classA: "Classe A : Bon pronostic (5-6)",
    classB: "Classe B : Pronostic modéré (7-9)",
    classC: "Classe C : Pronostic sévère (10-15)",
    faqQ1: "Qu'est-ce que le score de Child-Pugh ?",
    faqA1: "Le score de Child-Pugh est une classification clinique permettant d'évaluer la fonction hépatique et le pronostic des patients atteints de cirrhose ou d'insuffisance hépatocellulaire.",
    faqQ2: "Quels sont les stades de la classification ?",
    faqA2: "Il y a 3 stades : Classe A (5-6 points, survie à 1 an ~100%, à 2 ans ~85%), Classe B (7-9 points, survie à 1 an ~81%, à 2 ans ~57%) et Classe C (10-15 points, survie à 1 an ~45%, à 2 ans ~35%). Ces taux orientent l'évaluation du risque chirurgical et l'éligibilité à la transplantation.",
    faqQ3: "Quelle est la différence entre Child-Pugh et MELD ?",
    faqA3: "Child-Pugh intègre des éléments cliniques subjectifs (ascite, encéphalopathie). Le MELD est un score purement biologique (créatinine, bilirubine, INR, sodium), standardisé pour l'attribution des greffons hépatiques.",
    faqQ4: "Quels critères cliniques sont pris en compte dans le score de Child-Pugh ?",
    faqA4: "Il prend en compte la bilirubine totale, l'albumine sérique, l'INR (ou temps de prothrombine), l'ascite et l'encéphalopathie hépatique.",
    pillarTitle: "Origine Historique, Évaluation du Risque Périopératoire et Limites Subjectives",
    pillarText: [
      "La classification de Child-Pugh (initialement le score de Child-Turcotte formulé en 1964, puis modifié par R.N. Pugh en 1973) constitue un pilier fondamental en hépatologie pour évaluer la réserve fonctionnelle hépatique. Conçu à l'origine pour prédire la mortalité chirurgicale lors de la transection œsophagienne pour rupture de varices, le score Child-Pugh stratifie la cirrhose en trois classes pronostiques distinctes à partir de trois marqueurs biologiques (bilirubine totale, albumine sérique, INR) et deux variables cliniques (ascite et encéphalopathie hépatique).",
      "En médecine périopératoire moderne, la classe Child-Pugh sert de filtre décisif pour les interventions chirurgicales abdominales et extrahépatiques. Les patients de Classe A tolèrent les chirurgies générales avec une mortalité périopératoire acceptable (~10 %), tandis que les patients de Classe B présentent une morbidité et mortalité élevées (30 à 40 %), exigeant une optimisation rigoureuse. La chirurgie élective est formellement contre-indiquée en Classe C (mortalité > 80 %) en raison de la coagulopathie réfractaire et du risque de défaillance multi-viscérale.",
      "Un défi majeur du score Child-Pugh au lit du patient réside dans la variabilité inter-observateur de ses critères cliniques. L'évaluation de l'ascite dépend de la réponse aux diurétiques et de l'échographie, tandis que le grade de l'encéphalopathie repose sur l'interprétation subjective des critères de West Haven. De plus, une hémorragie digestive aiguë ou la sédation peuvent imiter une encéphalopathie sévère sans refléter une perte réelle de fonction hépatocytaire."
    ],
  }
};

export default function ChildPughScore({ lang }: { lang: LangCode }) {
  const [bilirubin, setBilirubin] = useState<number>(1);
  const [albumin, setAlbumin] = useState<number>(1);
  const [inr, setInr] = useState<number>(1);
  const [ascites, setAscites] = useState<number>(1);
  const [enceph, setEnceph] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = false;

  const childPughValue = bilirubin + albumin + inr + ascites + enceph;

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('child-pugh-score', lang, childPughValue);
    }, 1500);
    return () => clearTimeout(timer);
  }, [childPughValue, lang]);

  const getChildPughCategory = (val: number) => {
    if (val <= 6) return { label: currentText.classA, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (val <= 9) return { label: currentText.classB, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.classC, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getChildPughCategory(childPughValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Child-Pugh Score: ${childPughValue} (${category.label})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <EmbedCodeButton calculatorSlug="child-pugh-score" lang={lang} title={currentText.title} />
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.bilirubin}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`bilirubin-${val}`}
                      onClick={() => setBilirubin(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${bilirubin === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`bilirubin${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.albumin}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`albumin-${val}`}
                      onClick={() => setAlbumin(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${albumin === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`albumin${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.inr}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`inr-${val}`}
                      onClick={() => setInr(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${inr === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`inr${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.ascites}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`ascites-${val}`}
                      onClick={() => setAscites(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${ascites === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`ascites${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.enceph}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`enceph-${val}`}
                      onClick={() => setEnceph(val)}
                      className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enceph === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
                      style={{ minHeight: '48px' }}
                    >
                      {currentText[`enceph${val}`]}
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
                    {childPughValue}
                  </span>
                  <span className="text-2xl font-bold text-slate-500">/ 15</span>
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
                  { label: currentText.bilirubin, value: `${bilirubin} - ${currentText[`bilirubin${bilirubin}`]}` },
                  { label: currentText.albumin, value: `${albumin} - ${currentText[`albumin${albumin}`]}` },
                  { label: currentText.inr, value: `${inr} - ${currentText[`inr${inr}`]}` },
                  { label: currentText.ascites, value: `${ascites} - ${currentText[`ascites${ascites}`]}` },
                  { label: currentText.enceph, value: `${enceph} - ${currentText[`enceph${enceph}`]}` }
                ]}
                results={[
                  { label: currentText.result, value: `${childPughValue} / 15` },
                  { label: 'Classification', value: category.label }
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
              <a href="https://pubmed.ncbi.nlm.nih.gov/4515662/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Pugh RN et al., Br J Surg 1973 (PMID: 4515662) →</a>
            </div>
          </div>
        </div>
      </div>

      <AdsterraNativeBanner refreshDependency={childPughValue} />

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
            { label: 'MELD Score', path: '/meld-score' },
            { label: 'SOFA Score', path: '/sofa-score' },
            { label: 'Creatinine Clearance', path: '/creatinine-clearance' },
            { label: 'MAP Calculator', path: '/map-calculator' },
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
