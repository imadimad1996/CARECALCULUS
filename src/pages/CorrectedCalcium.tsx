import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, FlaskConical } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Corrected Calcium Calculator",
    subtitle: "Adjusts total serum calcium for hypoalbuminemia",
    ca: "Measured Total Calcium (mg/dL)",
    alb: "Serum Albumin (g/dL)",
    result: "Corrected Calcium",
    points: "mg/dL",
    status: "Interpretation:",
    formula: "Corrected Ca = Measured Ca + 0.8 × (4.0 - Albumin)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Approximately 45% of serum calcium is bound to proteins, primarily albumin. In patients with hypoalbuminemia, the measured total calcium may appear falsely low, while the physiologically active ionized calcium remains normal. This formula corrects the total calcium to reflect what it would be if albumin were normal.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Normal Corrected Calcium range: ~ 8.5 to 10.2 mg/dL.",
      "The correction factor assumes that for every 1.0 g/dL decrease in serum albumin below 4.0 g/dL, the total serum calcium drops by 0.8 mg/dL.",
      "This formula becomes less accurate at extremes of albumin (< 2.0 g/dL) or in patients with severe acid-base disturbances.",
      "When in doubt (especially in critically ill ICU patients or those with end-stage renal disease), checking an Ionized Calcium is the gold standard."
    ],
    references: "Payne RB, Little AJ, Williams RB, Milner JR. Interpretation of serum calcium in patients with abnormal serum proteins. Br Med J. 1973;4(5893):643-6.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Should I use this if the patient has renal failure?",
    faqA1: "The corrected calcium formula is notoriously inaccurate in end-stage renal disease (ESRD) and critically ill patients. Direct measurement of ionized calcium is preferred in these populations.",
    faqQ2: "What if the albumin is higher than 4.0?",
    faqA2: "The formula still works mathematically (it will lower the corrected calcium), but clinically, significant hyperalbuminemia is rare and usually due to severe dehydration.",
  },
  fr: {
    title: "Calcium Corrigé",
    subtitle: "Ajuste le calcium sérique total en fonction de l'albumine",
    ca: "Calcium Total Mesuré (mg/dL)",
    alb: "Albumine Sérique (g/dL)",
    result: "Calcium Corrigé",
    points: "mg/dL",
    status: "Interprétation :",
    formula: "Ca Corrigé = Ca Mesuré + 0.8 × (4.0 - Albumine)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Environ 45 % du calcium sérique est lié aux protéines (surtout l'albumine). Une hypoalbuminémie abaisse artificiellement le calcium total mesuré, bien que la fraction active (ionisée) reste souvent normale. Cette formule corrige ce biais.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Norme du calcium corrigé : ~ 8.5 à 10.2 mg/dL.",
      "Le facteur de correction suppose une baisse de 0.8 mg/dL de calcium pour chaque baisse de 1.0 g/dL d'albumine sous 4.0.",
      "Moins précis si l'albumine est très basse (< 2.0 g/dL) ou en cas de troubles acido-basiques sévères.",
      "En réanimation ou insuffisance rénale, le dosage direct du Calcium Ionisé est la référence."
    ],
    references: "Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins. Br Med J. 1973.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Est-ce fiable en cas d'insuffisance rénale terminale ?",
    faqA1: "Non. La formule est peu fiable chez les patients dialysés ou en réanimation. Le calcium ionisé doit être privilégié.",
    faqQ2: "Et si l'albumine est supérieure à 4.0 ?",
    faqA2: "La formule diminuera le calcium corrigé. L'hyperalbuminémie est rare et souvent liée à une déshydratation.",
  },
  es: {
    title: "Calcio Corregido",
    subtitle: "Ajusta el calcio sérico total en presencia de hipoalbuminemia",
    ca: "Calcio Total Medido (mg/dL)",
    alb: "Albúmina Sérica (g/dL)",
    result: "Calcio Corregido",
    points: "mg/dL",
    status: "Interpretación:",
    formula: "Ca Corregido = Ca Medido + 0.8 × (4.0 - Albúmina)",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Alrededor del 45% del calcio sérico está unido a proteínas, principalmente a la albúmina. En hipoalbuminemia, el calcio total puede parecer falsamente bajo. Esta fórmula estima el calcio real.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Rango Normal: ~ 8.5 a 10.2 mg/dL.",
      "La fórmula asume que por cada 1.0 g/dL que baja la albúmina de 4.0, el calcio total baja 0.8 mg/dL.",
      "La fórmula es menos precisa con albúminas muy bajas (< 2.0 g/dL) o alteraciones ácido-base graves.",
      "En pacientes críticos o con enfermedad renal crónica, el estándar de oro es medir el Calcio Ionizado directamente."
    ],
    references: "Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins. Br Med J. 1973.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Debo usar esto en pacientes en diálisis?",
    faqA1: "No se recomienda. En pacientes con enfermedad renal terminal, la fórmula es imprecisa. Se prefiere el Calcio Ionizado.",
    faqQ2: "¿Qué pasa si la albúmina es mayor a 4.0?",
    faqA2: "La fórmula reducirá el calcio corregido. La hiperalbuminemia es rara y suele deberse a deshidratación severa.",
  },
  ar: {
    title: "الكالسيوم المصحح",
    subtitle: "تصحيح مستوى الكالسيوم الكلي بناءً على الألبومين",
    ca: "الكالسيوم الكلي المقاس (mg/dL)",
    alb: "مصل الألبومين (g/dL)",
    result: "الكالسيوم المصحح",
    points: "مجم/ديسيلتر",
    status: "التفسير:",
    formula: "الكالسيوم المصحح = الكالسيوم المقاس + 0.8 × (4.0 - الألبومين)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يرتبط حوالي 45٪ من الكالسيوم في الدم بالبروتينات (بشكل رئيسي الألبومين). عند نقص الألبومين، يبدو الكالسيوم الكلي منخفضاً بشكل زائف رغم أن الكالسيوم النشط (المتأين) قد يكون طبيعياً. هذه المعادلة تصحح هذا الانحياز.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "المعدل الطبيعي للكالسيوم المصحح: ~ 8.5 إلى 10.2 مجم/ديسيلتر.",
      "تعتمد المعادلة على أن كل انخفاض بمقدار 1.0 جم/ديسيلتر في الألبومين عن 4.0 يؤدي لانخفاض الكالسيوم بمقدار 0.8.",
      "تقل دقة المعادلة عند مستويات الألبومين المنخفضة جداً (< 2.0) أو في حالات اضطراب التوازن الحمضي القاعدي.",
      "في العناية المركزة ومرضى الفشل الكلوي، يفضل قياس الكالسيوم المتأين (Ionized Calcium) مباشرة."
    ],
    references: "Payne RB, et al. Interpretation of serum calcium in patients with abnormal serum proteins. Br Med J. 1973.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يمكن استخدامه لمرضى الفشل الكلوي؟",
    faqA1: "تعتبر هذه المعادلة غير دقيقة في مرضى الكلى في المراحل المتأخرة. يُفضل دائماً طلب تحليل الكالسيوم المتأين لهم.",
    faqQ2: "ماذا لو كان الألبومين أعلى من 4.0؟",
    faqA2: "ستقوم المعادلة بخفض قيمة الكالسيوم المصحح. ارتفاع الألبومين نادر وغالباً ما يكون بسبب الجفاف الشديد.",
  }
};

export default function CorrectedCalcium({ lang }: { lang: LangCode }) {
  const [ca, setCa] = useState<string>('');
  const [alb, setAlb] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = ca !== '' && !isNaN(parseFloat(ca)) && parseFloat(ca) > 0 &&
                     alb !== '' && !isNaN(parseFloat(alb)) && parseFloat(alb) > 0;
  
  let correctedCa = 0;
  let interpretation = "";

  if (isComplete) {
    const c = parseFloat(ca);
    const a = parseFloat(alb);
    correctedCa = c + 0.8 * (4.0 - a);

    if (correctedCa < 8.5) {
      interpretation = lang === 'fr' ? 'Hypocalcémie' : lang === 'es' ? 'Hipocalcemia' : lang === 'ar' ? 'نقص الكالسيوم' : 'Hypocalcemia';
    } else if (correctedCa > 10.2) {
      interpretation = lang === 'fr' ? 'Hypercalcémie' : lang === 'es' ? 'Hipercalcemia' : lang === 'ar' ? 'فرط الكالسيوم' : 'Hypercalcemia';
    } else {
      interpretation = lang === 'fr' ? 'Normal (8.5 - 10.2)' : lang === 'es' ? 'Normal (8.5 - 10.2)' : lang === 'ar' ? 'طبيعي (8.5 - 10.2)' : 'Normal (8.5 - 10.2 mg/dL)';
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('corrected-calcium', lang, correctedCa);
        trackCalculatorResult('corrected-calcium', correctedCa, 'mg/dL', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, correctedCa, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="corrected-calcium" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.ca}</label>
                  <input
                    type="number"
                    value={ca}
                    onChange={(e) => setCa(e.target.value)}
                    placeholder="e.g. 7.5"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.alb}</label>
                  <input
                    type="number"
                    value={alb}
                    onChange={(e) => setAlb(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {currentText.result}
                </span>
                <FlaskConical className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? correctedCa.toFixed(2) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                  correctedCa > 10.2 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  correctedCa < 8.5 ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide">
                    {currentText.status}
                  </div>
                  <div className="font-semibold text-lg">{interpretation}</div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez les valeurs' : lang === 'es' ? 'Ingrese los valores' : lang === 'ar' ? 'أدخل القيم' : 'Enter values to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Measured Calcium", value: `${ca} mg/dL` },
                  { label: "Serum Albumin", value: `${alb} g/dL` }
                ]}
                results={[
                  { label: "Corrected Calcium", value: isComplete ? `${correctedCa.toFixed(2)} mg/dL` : '--' },
                  { label: "Interpretation", value: isComplete ? interpretation : '--' }
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

      <div className="mt-16 pt-10 border-t border-gray-200" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
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
            <div className="p-3 min-h-[44px] min-w-[44px].5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mt-0 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle || layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
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

      <div className="mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} lang={lang} />
      </div>
    </>
  );
}
