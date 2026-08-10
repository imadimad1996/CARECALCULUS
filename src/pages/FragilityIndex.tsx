import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PHARMACY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Fragility Index",
    subtitle: "Assesses the robustness of a statistically significant RCT result",
    cTotal: "Control Group: Total Patients",
    cEvents: "Control Group: Events",
    eTotal: "Experimental Group: Total Patients",
    eEvents: "Experimental Group: Events",
    result: "Fragility Index",
    points: "patients",
    status: "Interpretation:",
    formula: "Number of event conversions needed to make p-value ≥ 0.05 (Fisher's Exact Test iteration).",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The Fragility Index (FI) is the minimum number of patients whose outcome would need to change from a non-event to an event in one group to render the trial's result statistically non-significant (p ≥ 0.05). A low FI (e.g., < 10) indicates that the significant result is fragile and may not be reliable.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "A Fragility Index of 1 means that if just ONE patient in the treatment group had NOT benefited, the p-value would exceed 0.05 and the result would be deemed non-significant.",
      "No universal threshold exists, but FI < 10 or even FI < Sample Loss to Follow-up are considered worrying.",
      "The FI is primarily useful for RCTs with a binary outcome that report a statistically significant p-value.",
      "A high FI indicates a robust trial result. A low FI should prompt careful scrutiny of the clinical significance."
    ],
    references: "Walsh M, et al. The statistical significance of randomized controlled trial results is frequently fragile: a case for a Fragility Index. J Clin Epidemiol. 2014;67(6):622-8.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "What counts as a 'low' Fragility Index?",
    faqA1: "There is no universal cutoff, but an FI < 10 is often flagged as a concern. More importantly, if the FI is less than the number of patients lost to follow-up, the result is considered especially fragile.",
    faqQ2: "Does this only work for significant results?",
    faqA2: "Technically yes — the FI measures how many outcome changes are needed to cross the significance threshold. If the trial result is already non-significant, the analogous measure is the Reverse Fragility Index.",
  },
  fr: {
    title: "Indice de Fragilité",
    subtitle: "Évalue la robustesse d'un résultat d'ECR statistiquement significatif",
    cTotal: "Groupe Contrôle : Total de patients",
    cEvents: "Groupe Contrôle : Événements",
    eTotal: "Groupe Expérimental : Total de patients",
    eEvents: "Groupe Expérimental : Événements",
    result: "Indice de Fragilité",
    points: "patients",
    status: "Interprétation :",
    formula: "Nombre de conversions d'événements pour obtenir p ≥ 0.05 (itérations du test exact de Fisher).",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "L'indice de fragilité (IF) est le nombre minimal de patients dont le résultat devrait changer pour que le p-value dépasse 0.05. Un IF faible (< 10) indique un résultat fragile et peu fiable.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Un IF de 1 signifie qu'un seul patient différent suffirait à rendre le résultat non significatif.",
      "Pas de seuil universel, mais IF < 10 ou IF < nombre de perdus de vue est préoccupant.",
      "Principalement utile pour les ECR avec un critère binaire et p significatif.",
      "Un IF élevé = résultat robuste. Un IF faible = résultat à interpréter avec prudence."
    ],
    references: "Walsh M, et al. The statistical significance of randomized controlled trial results is frequently fragile. J Clin Epidemiol. 2014.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Qu'est-ce qu'un IF 'faible' ?",
    faqA1: "Pas de seuil universel, mais IF < 10 est souvent signalé. Surtout si l'IF est inférieur au nombre de perdus de vue.",
    faqQ2: "Cela ne s'applique-t-il qu'aux résultats significatifs ?",
    faqA2: "Oui — l'IF mesure le passage du seuil de signification. Pour un résultat non significatif, on utilise l'Indice de Fragilité Inverse.",
  },
  es: {
    title: "Índice de Fragilidad",
    subtitle: "Evalúa la robustez de un resultado estadísticamente significativo en un ECA",
    cTotal: "Grupo Control: Total de pacientes",
    cEvents: "Grupo Control: Eventos",
    eTotal: "Grupo Experimental: Total de pacientes",
    eEvents: "Grupo Experimental: Eventos",
    result: "Índice de Fragilidad",
    points: "pacientes",
    status: "Interpretación:",
    formula: "Nº de cambios de eventos necesarios para obtener p ≥ 0.05 (iteraciones de Fisher exacto).",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El Índice de Fragilidad (IF) es el número mínimo de pacientes cuyo resultado tendría que cambiar para que el resultado estadístico pase a ser no significativo (p ≥ 0.05). Un IF bajo (< 10) indica fragilidad.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Un IF de 1 significa que UN SOLO paciente diferente haría el resultado no significativo.",
      "No hay umbral universal, pero IF < 10 o IF < pérdidas de seguimiento es preocupante.",
      "Útil principalmente para ECA con criterio binario y p < 0.05.",
      "IF alto = resultado robusto. IF bajo = interpretar con cautela clínica."
    ],
    references: "Walsh M, et al. Fragility Index. J Clin Epidemiol. 2014.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Qué es un IF 'bajo'?",
    faqA1: "Sin umbral universal, pero IF < 10 es motivo de precaución, especialmente si es menor que las pérdidas de seguimiento.",
    faqQ2: "¿Solo funciona para resultados significativos?",
    faqA2: "Sí — mide cuántos cambios se necesitan para cruzar el umbral de significancia. Para resultados no significativos existe el Índice de Fragilidad Inverso.",
  },
  ar: {
    title: "مؤشر الهشاشة",
    subtitle: "تقييم قوة نتيجة ذات دلالة إحصائية في تجربة عشوائية محكومة",
    cTotal: "المجموعة الضابطة: إجمالي المرضى",
    cEvents: "المجموعة الضابطة: عدد الأحداث",
    eTotal: "المجموعة التجريبية: إجمالي المرضى",
    eEvents: "المجموعة التجريبية: عدد الأحداث",
    result: "مؤشر الهشاشة",
    points: "مرضى",
    status: "التفسير:",
    formula: "عدد تحويلات الأحداث اللازمة للحصول على p ≥ 0.05 (تكرار اختبار Fisher الدقيق).",
    clinicalTitle: "التفسير السريري",
    clinicalText: "مؤشر الهشاشة (FI) هو الحد الأدنى لعدد المرضى الذين يجب أن تتغير نتائجهم من 'لا حدث' إلى 'حدث' لجعل نتيجة الدراسة غير دالة إحصائياً (p ≥ 0.05). مؤشر منخفض يعني نتيجة هشة وغير موثوقة.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "مؤشر هشاشة = 1 يعني أن تغيير نتيجة مريض واحد فقط سيجعل النتيجة غير دالة إحصائياً.",
      "لا يوجد عتبة عالمية، لكن مؤشر < 10 أو أقل من عدد المتسربين من الدراسة يعتبر مثيراً للقلق.",
      "مفيد بشكل أساسي للتجارب العشوائية المحكومة ذات النتائج الثنائية والمعنوية إحصائياً.",
      "مؤشر مرتفع = نتيجة قوية. مؤشر منخفض = تحليل بعناية أكبر."
    ],
    references: "Walsh M, et al. Fragility Index. J Clin Epidemiol. 2014.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "ما الذي يُعتبر مؤشر هشاشة 'منخفضاً'؟",
    faqA1: "لا يوجد حد قاطع، لكن < 10 يعتبر مثيراً للقلق، خاصة إذا كان أقل من عدد المرضى الذين انسحبوا من الدراسة.",
    faqQ2: "هل يعمل فقط للنتائج الدالة إحصائياً؟",
    faqA2: "نعم، يقيس مؤشر الهشاشة عدد التغييرات اللازمة للعبور فوق عتبة p=0.05. للنتائج غير الدالة، يوجد 'مؤشر الهشاشة العكسي'.",
  }
};

// Fisher exact test p-value (one-tailed) approximation using hypergeometric distribution
function fisherExactP(a: number, b: number, c: number, d: number): number {
  const n = a + b + c + d;
  const r1 = a + b;
  const r2 = c + d;
  const c1 = a + c;
  
  // Compute hypergeometric probability for table and all more extreme
  function logComb(n: number, k: number): number {
    if (k < 0 || k > n) return -Infinity;
    let result = 0;
    for (let i = 0; i < k; i++) {
      result += Math.log(n - i) - Math.log(i + 1);
    }
    return result;
  }
  
  const logDenom = logComb(n, c1);
  let p = 0;
  
  const maxA = Math.min(r1, c1);
  const minA = Math.max(0, r1 - (n - c1));
  
  const logObserved = logComb(r1, a) + logComb(r2, c) - logDenom;
  
  for (let i = minA; i <= maxA; i++) {
    const logP = logComb(r1, i) + logComb(r2, c1 - i) - logDenom;
    if (logP <= logObserved + 1e-10) {
      p += Math.exp(logP);
    }
  }
  
  return Math.min(p, 1);
}

export default function FragilityIndex({ lang }: { lang: LangCode }) {
  const [cTotal, setCTotal] = useState<string>('');
  const [cEvents, setCEvents] = useState<string>('');
  const [eTotal, setETotal] = useState<string>('');
  const [eEvents, setEEvents] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = cTotal !== '' && cEvents !== '' && eTotal !== '' && eEvents !== '' &&
                     !isNaN(parseFloat(cTotal)) && !isNaN(parseFloat(cEvents)) &&
                     !isNaN(parseFloat(eTotal)) && !isNaN(parseFloat(eEvents)) &&
                     parseFloat(cTotal) > 0 && parseFloat(eTotal) > 0 &&
                     parseFloat(cEvents) >= 0 && parseFloat(eEvents) >= 0;

  let fi = 0;
  let initialP = 1;
  let interpretation = "";
  let isSignificant = false;

  if (isComplete) {
    let ct = parseFloat(cTotal);
    let ce = parseFloat(cEvents);
    let et = parseFloat(eTotal);
    let ee = parseFloat(eEvents);

    initialP = fisherExactP(ee, et - ee, ce, ct - ce);
    isSignificant = initialP < 0.05;

    if (isSignificant) {
      let n = 0;
      let p = initialP;
      while (p < 0.05 === false && n < 1000) { break; }
      
      // Iterate: move one event at a time from non-event to event in the group with fewer events
      let curEE = ee;
      let curCE = ce;
      while (n < 1000) {
        // Add event to the experimental (treatment) group
        curEE += 1;
        if (curEE > et) break;
        p = fisherExactP(curEE, et - curEE, curCE, ct - curCE);
        n++;
        if (p >= 0.05) break;
      }
      fi = n;

      if (fi <= 3) {
        interpretation = lang === 'fr' ? `FI = ${fi} — Très fragile ⚠️` : lang === 'es' ? `FI = ${fi} — Muy frágil ⚠️` : lang === 'ar' ? `FI = ${fi} — هش جداً ⚠️` : `FI = ${fi} — Very Fragile ⚠️`;
      } else if (fi <= 10) {
        interpretation = lang === 'fr' ? `FI = ${fi} — Fragile (interpréter prudemment)` : lang === 'es' ? `FI = ${fi} — Frágil (interpretar con cautela)` : lang === 'ar' ? `FI = ${fi} — هش (يحتاج تفسيراً دقيقاً)` : `FI = ${fi} — Fragile (interpret with caution)`;
      } else {
        interpretation = lang === 'fr' ? `FI = ${fi} — Résultat robuste ✓` : lang === 'es' ? `FI = ${fi} — Resultado robusto ✓` : lang === 'ar' ? `FI = ${fi} — نتيجة قوية ✓` : `FI = ${fi} — Robust result ✓`;
      }
    } else {
      interpretation = lang === 'fr' ? 'Résultat non significatif (p ≥ 0.05) — FI non applicable' :
                       lang === 'es' ? 'Resultado no significativo (p ≥ 0.05) — FI no aplica' :
                       lang === 'ar' ? 'نتيجة غير دالة (p ≥ 0.05) — لا ينطبق مؤشر الهشاشة' :
                       'Non-significant result (p ≥ 0.05) — FI not applicable';
    }
  }

  useEffect(() => {
    if (isComplete && isSignificant) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('fragility-index', lang, fi);
        trackCalculatorResult('fragility-index', fi, 'patients', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, fi, isSignificant, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-red-500/10 via-rose-500/5 to-pink-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="fragility-index" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">{currentText.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="col-span-2 font-semibold text-gray-800 border-b border-gray-200 pb-2">Control Group</div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{currentText.cTotal}</label>
                  <input type="number" value={cTotal} onChange={e => setCTotal(e.target.value)} placeholder="e.g. 100"
                    className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 sm:text-sm font-medium shadow-sm" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{currentText.cEvents}</label>
                  <input type="number" value={cEvents} onChange={e => setCEvents(e.target.value)} placeholder="e.g. 20"
                    className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 sm:text-sm font-medium shadow-sm" dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-gray-200 bg-blue-50/30">
                <div className="col-span-2 font-semibold text-blue-900 border-b border-blue-100 pb-2">Experimental Group (Treatment)</div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{currentText.eTotal}</label>
                  <input type="number" value={eTotal} onChange={e => setETotal(e.target.value)} placeholder="e.g. 100"
                    className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium shadow-sm" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{currentText.eEvents}</label>
                  <input type="number" value={eEvents} onChange={e => setEEvents(e.target.value)} placeholder="e.g. 12"
                    className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium shadow-sm" dir="ltr" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[380px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-red-500/30 via-rose-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{currentText.result}</span>
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete && isSignificant ? fi : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{isComplete && isSignificant ? currentText.points : ''}</span>
              </div>
              {isComplete && (
                <div className="mt-2 text-sm text-slate-300">
                  Initial p-value: <span className="font-mono font-bold text-white">{initialP < 0.001 ? '< 0.001' : initialP.toFixed(3)}</span>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                  !isSignificant ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
                  fi <= 3 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  fi <= 10 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide">{currentText.status}</div>
                  <div className="font-semibold text-sm">{interpretation}</div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez les données de l\'essai' : lang === 'es' ? 'Ingrese los datos del ensayo' : lang === 'ar' ? 'أدخل بيانات الدراسة' : 'Enter trial data to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Control Total", value: cTotal },
                  { label: "Control Events", value: cEvents },
                  { label: "Experimental Total", value: eTotal },
                  { label: "Experimental Events", value: eEvents }
                ]}
                results={[
                  { label: "Fragility Index (FI)", value: isComplete && isSignificant ? fi.toString() : 'N/A' },
                  { label: "Initial p-value", value: isComplete ? (initialP < 0.001 ? '< 0.001' : initialP.toFixed(3)) : '--' },
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
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Info className="w-5 h-5" /></div>
            <div><h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2><p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p></div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Activity className="w-5 h-5" /></div>
            <div className="w-full"><h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2><div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 tracking-tight" dir="ltr">{currentText.formula}</div></div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><BookOpen className="w-5 h-5" /></div>
            <div><h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2><p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p></div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-3 text-gray-700 leading-relaxed text-sm">{currentText.pillarText.map((p, i) => <p key={i}>{p}</p>)}</div>
      </div>

      <div className="mt-0 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.faqTitle || layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[{ q: currentText.faqQ1, a: currentText.faqA1 }, { q: currentText.faqQ2, a: currentText.faqA2 }].map(({ q, a }) => (
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
        <MedicalReviewerCard reviewer={REVIEWER_PHARMACY} lang={lang} />
      </div>
    </>
  );
}
