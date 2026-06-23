import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';

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
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Class A (5-6 points) represents mild disease. Class B (7-9 points) represents moderate disease. Class C (10-15 points) represents severe disease. High scores correlate with reduced 1-year and 2-year survival.",
    references: "References: Pugh RN, Murray-Lyon IM, Dawson JL, et al. Transection of the oesophagus for bleeding oesophageal varices. Br J Surg 1973.",
    classA: "Class A: Good Prognosis (5-6)",
    classB: "Class B: Moderate Prognosis (7-9)",
    classC: "Class C: Poor Prognosis (10-15)",
    faqQ1: "What is the Child-Pugh score?",
    faqA1: "The Child-Pugh score is a clinical staging system used to assess the prognosis of chronic liver disease, particularly cirrhosis. It evaluates total bilirubin, serum albumin, INR, ascites, and hepatic encephalopathy.",
    faqQ2: "What are the Child-Pugh classification classes?",
    faqA2: "Patients are categorized into three classes: Class A (Score 5-6, 100% 1-year survival), Class B (Score 7-9, 81% 1-year survival), and Class C (Score 10-15, 45% 1-year survival).",
    faqQ3: "How does the Child-Pugh score differ from the MELD score?",
    faqA3: "The Child-Pugh score includes subjective parameters (ascites and encephalopathy) alongside labs. The MELD score is purely objective and laboratory-based (creatinine, bilirubin, INR, sodium), making it preferred for transplant allocation.",
    faqQ4: "What is the maximum Child-Pugh score?",
    faqA4: "The score ranges from a minimum of 5 points to a maximum of 15 points. Higher scores indicate more severe hepatic impairment and poorer prognosis.",
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
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Classe A (5-6 points) : cirrhose compensée (bon pronostic). Classe B (7-9 points) : décompensation modérée. Classe C (10-15 points) : cirrhose décompensée (pronostic sévère).",
    references: "Références : Pugh RN, Murray-Lyon IM, Dawson JL, et al. Br J Surg 1973.",
    classA: "Classe A : Bon pronostic (5-6)",
    classB: "Classe B : Pronostic modéré (7-9)",
    classC: "Classe C : Pronostic sévère (10-15)",
    faqQ1: "Qu'est-ce que le score de Child-Pugh ?",
    faqA1: "Le score de Child-Pugh est une classification clinique permettant d'évaluer la fonction hépatique et le pronostic des patients atteints de cirrhose ou d'insuffisance hépatocellulaire.",
    faqQ2: "Quels sont les stades de la classification ?",
    faqA2: "Il y a 3 stades : Classe A (5-6 points, survie à 1 an ~100%), Classe B (7-9 points, survie à 1 an ~81%) et Classe C (10-15 points, survie à 1 an ~45%).",
    faqQ3: "Quelle est la différence entre Child-Pugh et MELD ?",
    faqA3: "Child-Pugh intègre des éléments cliniques subjectifs (ascite, encéphalopathie). Le MELD est un score purement biologique (créatinine, bilirubine, INR, sodium), standardisé pour l'attribution des greffons hépatiques.",
    faqQ4: "Quels critères cliniques sont pris en compte dans le score de Child-Pugh ?",
    faqA4: "Il prend en compte la bilirubine totale, l'albumine sérique, l'INR (ou temps de prothrombine), l'ascite et l'encéphalopathie hépatique.",
  },
  ar: {
    title: "مؤشر تشايلد بيو لقصور الكبد",
    subtitle: "تصنيف شدة تليف الكبد وتقدير متوسط البقاء على قيد الحياة",
    bilirubin: "البيليروبين الكلي",
    bilirubin1: "أقل من 2.0 ملغ/ديسيلتر [أقل من 34 ميكرومول/لتر] (1 نقطة)",
    bilirubin2: "2.0 - 3.0 ملغ/ديسيلتر [34 - 51 ميكرومول/لتر] (2 نقطة)",
    bilirubin3: "أكثر من 3.0 ملغ/ديسيلتر [أكثر من 51 ميكرومول/لتر] (3 نقاط)",
    albumin: "الألبومين السريري",
    albumin1: "أكبر من 3.5 غ/ديسيلتر (1 نقطة)",
    albumin2: "2.8 - 3.5 غ/ديسيلتر (2 نقطة)",
    albumin3: "أقل من 2.8 غ/ديسيلتر (3 نقاط)",
    inr: "نسبة INR للتخثر",
    inr1: "أقل من 1.7 (1 نقطة)",
    inr2: "1.7 - 2.3 (2 نقطة)",
    inr3: "أكثر من 2.3 (3 نقاط)",
    ascites: "الاستسقاء (تراكم السوائل في البطن)",
    ascites1: "لا يوجد استسقاء (1 نقطة)",
    ascites2: "طفيف / يستجيب لمدرات البول (2 نقطة)",
    ascites3: "متوسط إلى شديد / مقاوم للعلاج (3 نقاط)",
    enceph: "الاعتلال الدماغي الكبدي",
    enceph1: "لا يوجد اعتلال (1 نقطة)",
    enceph2: "درجة 1 - 2 / طفيف (2 نقطة)",
    enceph3: "درجة 3 - 4 / غيبوبة (3 نقاط)",
    result: "درجة تشايلد بيو المحسوبة",
    formula: "البيليروبين + الألبومين + INR + الاستسقاء + الاعتلال الدماغي",
    clinicalTitle: "التفسير السريري والإنذار",
    clinicalText: "الفئة A (5-6 نقاط) تشير لمرض كبدي معوض. الفئة B (7-9 نقاط) تشير لتثبيط معتدل. الفئة C (10-15 نقطة) تشير لفشل كبدي متقدم مع انخفاض ملحوظ في معدل البقاء لعام وعامين.",
    references: "المراجع: بيو وآخرون. استئصال المريء لنزيف الدوالي. المجلة البريطانية للجراحة 1973.",
    classA: "الفئة A: إنذار كبدي جيد (5-6)",
    classB: "الفئة B: إنذار كبدي معتدل (7-9)",
    classC: "الفئة C: إنذار كبدي متقدم (10-15)",
    faqQ1: "ما هو تصنيف تشايلد بيو؟",
    faqA1: "تصنيف تشايلد بيو هو أداة تقييم طبي تُستخدم لتحديد مدى تضرر الكبد وتقدير فرصة البقاء على قيد الحياة لدى مرضى تليف الكبد المزمن.",
    faqQ2: "ما هي درجات تصنيف تشايلد بيو؟",
    faqA2: "يتم تصنيف المرضى إلى ثلاث فئات: الفئة A (5-6 نقاط، إنذار جيد)، الفئة B (7-9 نقاط، إنذار متوسط)، والفئة C (10-15 نقطة، إنذار متقدم/سيء).",
    faqQ3: "كيف يختلف تصنيف تشايلد بيو عن درجة MELD؟",
    faqA3: "يشتمل تشايلد بيو على معايير سريرية ذاتية التقييم مثل الاستسقاء والاعتلال الدماغي الكبدي. بينما يعتمد مقياس MELD بالكامل على فحوصات معملية موضوعية ومحددة.",
    faqQ4: "ما هي الفحوصات المعملية المطلوبة لحساب المقياس؟",
    faqA4: "يتطلب حساب المقياس معرفة ثلاثة فحوصات مخبرية هي: نسبة البيليروبين الكلي، تركيز الألبومين في الدم، ونسبة تجلط الدم INR.",
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
  const isRtl = lang === 'ar';

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
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{currentText.bilirubin}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`bilirubin-${val}`}
                      onClick={() => setBilirubin(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${bilirubin === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`bilirubin${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.albumin}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`albumin-${val}`}
                      onClick={() => setAlbumin(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${albumin === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`albumin${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.inr}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`inr-${val}`}
                      onClick={() => setInr(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${inr === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`inr${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.ascites}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`ascites-${val}`}
                      onClick={() => setAscites(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${ascites === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`ascites${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.enceph}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[1, 2, 3].map((val) => (
                    <button
                      key={`enceph-${val}`}
                      onClick={() => setEnceph(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${enceph === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
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
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  {currentText.result}
                </span>
                
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                    {childPughValue}
                  </span>
                  <span className="text-xl font-medium text-gray-400">/ 15</span>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
                title="Copy Result"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
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

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'MELD Score', path: '/meld-score' },
            { label: 'Creatinine Clearance', path: '/creatinine-clearance' },
            { label: 'Corrected Calcium', path: '/corrected-calcium' },
            { label: 'qSOFA Score', path: '/qsofa-score' },
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
