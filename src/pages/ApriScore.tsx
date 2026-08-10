import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Droplet } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "APRI Score (Liver Fibrosis)",
    subtitle: "AST to Platelet Ratio Index for predicting significant liver fibrosis",
    ast: "AST Level (IU/L)",
    astUln: "AST Upper Limit of Normal (ULN) (IU/L)",
    platelets: "Platelet Count (10⁹/L)",
    result: "APRI Score",
    points: "",
    interpretation: "Interpretation:",
    formula: "APRI = ((AST / AST_ULN) × 100) / Platelet_Count",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The APRI score is a non-invasive index used to estimate the likelihood of significant liver fibrosis or cirrhosis, primarily validated in Hepatitis C but widely used in other chronic liver diseases.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "< 0.5: High negative predictive value to rule out significant fibrosis or cirrhosis.",
      "0.5 - 1.5: Indeterminate range. Additional testing (e.g., FibroScan, biopsy) is often required.",
      "> 1.5: High likelihood of significant fibrosis or cirrhosis.",
      "> 2.0: Very high likelihood of cirrhosis.",
      "Always interpret in the clinical context. Transient AST elevations (e.g., acute hepatitis, alcohol binge) can falsely elevate the APRI score."
    ],
    references: "Wai CT, et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. Hepatology. 2003;38(2):518-26.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Can APRI replace liver biopsy?",
    faqA1: "It can reduce the need for biopsy by identifying patients at the extremes (very low or very high probability). Those in the indeterminate zone (0.5 - 1.5) often still need further evaluation.",
    faqQ2: "What is a normal AST ULN?",
    faqA2: "It varies by laboratory, but 40 IU/L is a commonly used standard value if the lab's specific reference range is unknown.",
  },
  fr: {
    title: "Score APRI (Fibrose Hépatique)",
    subtitle: "Index AST/Plaquettes pour prédire la fibrose hépatique",
    ast: "Taux d'AST (ASAT) (UI/L)",
    astUln: "Limite Supérieure Normale AST (UI/L)",
    platelets: "Taux de Plaquettes (10⁹/L)",
    result: "Score APRI",
    points: "",
    interpretation: "Interprétation :",
    formula: "APRI = ((AST / LSN_AST) × 100) / Plaquettes",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le score APRI est un index non invasif estimant la probabilité de fibrose hépatique ou de cirrhose, validé principalement pour l'hépatite C mais utilisé dans d'autres hépatopathies.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "< 0.5 : Probabilité très faible de fibrose significative (permet d'exclure).",
      "0.5 - 1.5 : Zone indéterminée. Des examens complémentaires (FibroScan, biopsie) sont souvent requis.",
      "> 1.5 : Forte probabilité de fibrose significative ou de cirrhose.",
      "> 2.0 : Très forte probabilité de cirrhose.",
      "À interpréter selon le contexte clinique (une hépatite aiguë peut fausser le score en augmentant transitoirement les AST)."
    ],
    references: "Wai CT, et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. Hepatology. 2003.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "L'APRI peut-il remplacer la biopsie ?",
    faqA1: "Il réduit le besoin de biopsie pour les valeurs extrêmes. Les patients en zone grise nécessitent d'autres examens.",
    faqQ2: "Quelle est la limite normale supérieure des AST ?",
    faqA2: "Elle varie selon le laboratoire, mais 40 UI/L est une valeur standard couramment utilisée.",
  },
  es: {
    title: "Puntuación APRI (Fibrosis Hepática)",
    subtitle: "Índice AST/Plaquetas para predecir fibrosis hepática",
    ast: "Nivel de AST (UI/L)",
    astUln: "Límite Superior Normal de AST (UI/L)",
    platelets: "Recuento de Plaquetas (10⁹/L)",
    result: "Puntuación APRI",
    points: "",
    interpretation: "Interpretación:",
    formula: "APRI = ((AST / LSN_AST) × 100) / Plaquetas",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La puntuación APRI es un índice no invasivo para estimar la probabilidad de fibrosis hepática significativa o cirrosis. Validado originalmente en Hepatitis C.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "< 0.5: Bajo riesgo de fibrosis significativa o cirrosis.",
      "0.5 - 1.5: Rango indeterminado. Suele requerir pruebas adicionales (ej. FibroScan).",
      "> 1.5: Alta probabilidad de fibrosis significativa o cirrosis.",
      "> 2.0: Probabilidad muy alta de cirrosis.",
      "Las elevaciones transitorias de AST (hepatitis aguda, consumo de alcohol) pueden elevar falsamente el APRI."
    ],
    references: "Wai CT, et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. Hepatology. 2003.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Puede reemplazar a la biopsia?",
    faqA1: "Disminuye la necesidad de biopsia en los extremos. En el rango indeterminado, se necesitan pruebas adicionales.",
    faqQ2: "¿Cuál es el límite superior normal de AST?",
    faqA2: "Varía según el laboratorio, pero 40 UI/L es un valor de referencia frecuentemente usado.",
  },
  ar: {
    title: "مؤشر APRI (تليف الكبد)",
    subtitle: "نسبة إنزيم AST إلى الصفائح الدموية للتنبؤ بتليف الكبد",
    ast: "مستوى AST (IU/L)",
    astUln: "الحد الأعلى الطبيعي لإنزيم AST (IU/L)",
    platelets: "عدد الصفائح الدموية (10⁹/L)",
    result: "نتيجة APRI",
    points: "",
    interpretation: "التفسير:",
    formula: "APRI = ((AST / الحد الأعلى الطبيعي لـ AST) × 100) / الصفائح الدموية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "مؤشر APRI هو مؤشر غير جراحي يستخدم لتقدير احتمالية الإصابة بتليف أو تشمع الكبد، وقد تم التحقق منه بشكل رئيسي في التهاب الكبد C ويستخدم على نطاق واسع في أمراض الكبد المزمنة الأخرى.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "أقل من 0.5: مستبعد جداً وجود تليف كبير أو تشمع كبدي.",
      "0.5 - 1.5: نطاق غير محدد. غالباً ما يتطلب اختبارات إضافية (مثل فايبروسكان أو خزعة).",
      "أكبر من 1.5: احتمالية عالية لوجود تليف كبير أو تشمع كبدي.",
      "أكبر من 2.0: احتمالية عالية جداً لتشمع الكبد.",
      "يجب تفسير النتيجة في السياق السريري. الارتفاع العابر لـ AST (مثل التهاب الكبد الحاد) قد يعطي نتيجة عالية كاذبة."
    ],
    references: "Wai CT, et al. A simple noninvasive index can predict both significant fibrosis and cirrhosis in patients with chronic hepatitis C. Hepatology. 2003.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يمكن أن يحل مؤشر APRI محل خزعة الكبد؟",
    faqA1: "يمكن أن يقلل من الحاجة للخزعة في الحالات القصوى (احتمالية منخفضة جداً أو عالية جداً). الحالات في النطاق الرمادي لا تزال بحاجة لمزيد من التقييم.",
    faqQ2: "ما هو الحد الأعلى الطبيعي لإنزيم AST؟",
    faqA2: "يختلف حسب المختبر، ولكن القيمة 40 وحدة/لتر تُستخدم كمعيار قياسي غالباً إذا لم يكن المعدل المرجعي للمختبر معروفاً.",
  }
};

export default function ApriScore({ lang }: { lang: LangCode }) {
  const [ast, setAst] = useState<string>('');
  const [astUln, setAstUln] = useState<string>('40');
  const [platelets, setPlatelets] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = ast !== '' && !isNaN(parseFloat(ast)) && parseFloat(ast) > 0 &&
                     astUln !== '' && !isNaN(parseFloat(astUln)) && parseFloat(astUln) > 0 &&
                     platelets !== '' && !isNaN(parseFloat(platelets)) && parseFloat(platelets) > 0;
  
  let score = 0;
  let riskLevel = "";

  if (isComplete) {
    const a = parseFloat(ast);
    const uln = parseFloat(astUln);
    const plt = parseFloat(platelets);
    
    score = ((a / uln) * 100) / plt;

    if (score < 0.5) {
      riskLevel = lang === 'fr' ? 'Faible risque de fibrose' : lang === 'es' ? 'Bajo riesgo de fibrosis' : lang === 'ar' ? 'خطر منخفض للتليف' : 'Low risk of significant fibrosis';
    } else if (score <= 1.5) {
      riskLevel = lang === 'fr' ? 'Indéterminé' : lang === 'es' ? 'Indeterminado' : lang === 'ar' ? 'غير محدد' : 'Indeterminate range';
    } else if (score <= 2.0) {
      riskLevel = lang === 'fr' ? 'Forte probabilité de fibrose/cirrhose' : lang === 'es' ? 'Alta probabilidad de fibrosis/cirrosis' : lang === 'ar' ? 'احتمالية عالية للتليف/التشمع' : 'High likelihood of fibrosis/cirrhosis';
    } else {
      riskLevel = lang === 'fr' ? 'Très forte probabilité de cirrhose' : lang === 'es' ? 'Muy alta probabilidad de cirrosis' : lang === 'ar' ? 'احتمالية عالية جداً للتشمع' : 'Very high likelihood of cirrhosis';
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('apri-score', lang, score);
        trackCalculatorResult('apri-score', score, 'index', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, score, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="apri-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.ast}</label>
                  <input
                    type="number"
                    value={ast}
                    onChange={(e) => setAst(e.target.value)}
                    placeholder="e.g. 55"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.astUln}</label>
                  <input
                    type="number"
                    value={astUln}
                    onChange={(e) => setAstUln(e.target.value)}
                    placeholder="e.g. 40"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.platelets}</label>
                <input
                  type="number"
                  value={platelets}
                  onChange={(e) => setPlatelets(e.target.value)}
                  placeholder="e.g. 150"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
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
                <Droplet className="w-5 h-5 text-red-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? score.toFixed(2) : '--'}
                </span>
                {currentText.points && <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>}
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                  score > 1.5 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  score >= 0.5 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide mb-1">
                    {currentText.interpretation}
                  </div>
                  <div className="font-semibold text-lg">{riskLevel}</div>
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
                  { label: "AST", value: `${ast} IU/L` },
                  { label: "AST ULN", value: `${astUln} IU/L` },
                  { label: "Platelets", value: `${platelets} 10⁹/L` }
                ]}
                results={[
                  { label: "APRI Score", value: isComplete ? score.toFixed(2) : '--' },
                  { label: "Interpretation", value: isComplete ? riskLevel : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} lang={lang} />
      </div>
    </>
  );
}
