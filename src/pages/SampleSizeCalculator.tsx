import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Calculator } from 'lucide-react';
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
    title: "Sample Size Calculator",
    subtitle: "Estimate the required sample size for a clinical study (two proportions)",
    p1: "Event Rate in Control Group (p1, as %)",
    p2: "Expected Event Rate in Experimental Group (p2, as %)",
    alpha: "Significance Level (α)",
    power: "Statistical Power (1 - β)",
    ratio: "Allocation Ratio (n2/n1)",
    result: "Sample Size (n per group)",
    points: "subjects",
    status: "Required:",
    formula: "Based on normal approximation for two proportions (Fleiss with continuity correction).",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "A sample size calculation determines how many participants are needed in a study so that there is a high probability of detecting a true treatment effect if it exists, without having too many participants (which wastes resources). Underpowered studies are unethical and uninformative.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "α (Alpha): The significance level. The probability of a false positive (Type I error). Convention: 0.05 (5%).",
      "Power (1-β): The probability of correctly detecting a true effect. Convention: 0.80 (80%) or 0.90 (90%).",
      "p1 (Control Rate): The expected event rate in the control group (from literature or pilot data).",
      "p2 (Expected Rate): The expected event rate in the treatment group — determines the 'effect size' you want to detect.",
      "A smaller effect size (small difference between p1 and p2) requires a MUCH larger sample size."
    ],
    references: "Fleiss JL, Levin B, Paik MC. Statistical Methods for Rates and Proportions. 3rd Ed. Wiley; 2003.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why does a small effect size need a huge sample?",
    faqA1: "If you're trying to detect a small signal in a lot of noise, you need more data. For example, detecting the difference between 5% and 4.5% event rates requires thousands of patients, while detecting the difference between 5% and 1% only requires tens.",
    faqQ2: "What if my study has unequal group sizes?",
    faqA2: "Use the allocation ratio (k = n2/n1) to account for this. An equal ratio (k=1) is most efficient. Unequal allocation increases the total sample size needed.",
  },
  fr: {
    title: "Calculateur de Taille d'Échantillon",
    subtitle: "Estimer la taille d'échantillon requise pour une étude clinique (deux proportions)",
    p1: "Taux d'événements dans le groupe contrôle (p1, en %)",
    p2: "Taux d'événements attendu dans le groupe expérimental (p2, en %)",
    alpha: "Niveau de signification (α)",
    power: "Puissance statistique (1 - β)",
    ratio: "Ratio d'allocation (n2/n1)",
    result: "Taille d'échantillon (n par groupe)",
    points: "sujets",
    status: "Requis :",
    formula: "Approximation normale pour deux proportions (Fleiss avec correction de continuité).",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le calcul de taille d'échantillon détermine le nombre de participants nécessaires pour détecter un vrai effet traitement avec une probabilité élevée, sans gaspillage de ressources.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "α (Alpha) : Niveau de signification. Probabilité d'un faux positif. Convention : 0.05.",
      "Puissance (1-β) : Probabilité de détecter un vrai effet. Convention : 0.80 ou 0.90.",
      "p1 : Taux attendu dans le groupe contrôle (données de littérature ou pilote).",
      "p2 : Taux attendu dans le groupe traitement — détermine la taille d'effet.",
      "Plus l'effet est petit, plus la taille d'échantillon sera grande."
    ],
    references: "Fleiss JL, Levin B, Paik MC. Statistical Methods for Rates and Proportions. 3rd Ed. Wiley; 2003.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi un petit effet demande un très grand échantillon ?",
    faqA1: "Détecter un petit signal dans un grand bruit nécessite plus de données. Exemple : distinguer 5% de 4.5% nécessite des milliers de patients.",
    faqQ2: "Que faire si les groupes sont de taille inégale ?",
    faqA2: "Utilisez le ratio d'allocation (k = n2/n1). L'égalité (k=1) est la plus efficace statistiquement.",
  },
  es: {
    title: "Calculadora de Tamaño Muestral",
    subtitle: "Estima el tamaño de muestra para un estudio clínico (dos proporciones)",
    p1: "Tasa de eventos en el grupo control (p1, en %)",
    p2: "Tasa de eventos esperada en el grupo experimental (p2, en %)",
    alpha: "Nivel de significancia (α)",
    power: "Potencia estadística (1 - β)",
    ratio: "Ratio de asignación (n2/n1)",
    result: "Tamaño de muestra (n por grupo)",
    points: "sujetos",
    status: "Requerido:",
    formula: "Aproximación normal para dos proporciones (Fleiss con corrección de continuidad).",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El cálculo del tamaño muestral determina cuántos participantes se necesitan para detectar un verdadero efecto del tratamiento con alta probabilidad, evitando el desperdicio de recursos.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "α (Alfa): Nivel de significancia. Probabilidad de un falso positivo. Convención: 0.05.",
      "Potencia (1-β): Probabilidad de detectar un efecto real. Convención: 0.80 o 0.90.",
      "p1: Tasa de eventos esperada en el control (literatura o datos piloto).",
      "p2: Tasa de eventos esperada en el tratamiento — determina el tamaño del efecto.",
      "Un efecto pequeño (diferencia mínima entre p1 y p2) requiere un tamaño muestral mucho mayor."
    ],
    references: "Fleiss JL, Levin B, Paik MC. Statistical Methods for Rates and Proportions. 3rd Ed. Wiley; 2003.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué un efecto pequeño necesita una muestra grande?",
    faqA1: "Detectar una señal pequeña en mucho ruido requiere más datos. Distinguir 5% de 4.5% necesita miles de pacientes.",
    faqQ2: "¿Qué pasa con grupos de tamaño desigual?",
    faqA2: "Use el ratio de asignación (k = n2/n1). La igualdad (k=1) es estadísticamente más eficiente.",
  },
  ar: {
    title: "حاسبة حجم العينة",
    subtitle: "تقدير حجم العينة المطلوب للدراسة السريرية (نسبتان)",
    p1: "معدل الأحداث في المجموعة الضابطة (p1، كنسبة مئوية)",
    p2: "معدل الأحداث المتوقع في المجموعة التجريبية (p2، كنسبة مئوية)",
    alpha: "مستوى الدلالة (α)",
    power: "القوة الإحصائية (1 - β)",
    ratio: "نسبة التخصيص (n2/n1)",
    result: "حجم العينة (n لكل مجموعة)",
    points: "مشارك",
    status: "المطلوب:",
    formula: "تقريب طبيعي لنسبتين (Fleiss مع تصحيح الاستمرارية).",
    clinicalTitle: "التفسير السريري",
    clinicalText: "حساب حجم العينة يحدد عدد المشاركين اللازمين في الدراسة لاكتشاف التأثير الحقيقي للعلاج باحتمالية عالية دون إهدار الموارد. الدراسات ناقصة القوة الإحصائية غير أخلاقية وغير مفيدة.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "α (ألفا): مستوى الدلالة. احتمال النتيجة الإيجابية الكاذبة (خطأ النوع الأول). المتعارف عليه: 0.05.",
      "القوة (1-β): احتمال اكتشاف التأثير الحقيقي. المتعارف عليه: 0.80 أو 0.90.",
      "p1: معدل الأحداث المتوقع في مجموعة الضبط (من الأدبيات الطبية أو دراسة أولية).",
      "p2: معدل الأحداث المتوقع في مجموعة العلاج — يحدد حجم التأثير الذي تريد اكتشافه.",
      "كلما كان حجم التأثير أصغر (الفرق بين p1 و p2 ضئيل)، كلما احتجت إلى عينة أكبر بكثير."
    ],
    references: "Fleiss JL, Levin B, Paik MC. Statistical Methods for Rates and Proportions. 3rd Ed. Wiley; 2003.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا يحتاج التأثير الصغير إلى عينة ضخمة؟",
    faqA1: "للكشف عن إشارة صغيرة في كمية كبيرة من الضجيج الإحصائي، تحتاج إلى المزيد من البيانات. مثلاً، للتمييز بين معدل أحداث 5% و 4.5% تحتاج آلاف المرضى، بينما التمييز بين 5% و 1% يحتاج العشرات فقط.",
    faqQ2: "ماذا لو كانت المجموعتان غير متساويتين في الحجم؟",
    faqA2: "استخدم نسبة التخصيص (k = n2/n1). التساوي (k=1) هو الأكثر كفاءة إحصائياً. أي تفاوت يزيد من الحجم الكلي المطلوب.",
  }
};

// Normal distribution quantile function (inverse CDF approximation)
function zScore(p: number): number {
  const a = [
    -3.969683028665376e+01, 2.209460984245205e+02,
    -2.759285104469687e+02, 1.383577518672690e+02,
    -3.066479806614716e+01, 2.506628277459239e+00
  ];
  const b = [
    -5.447609879822406e+01, 1.615858368580409e+02,
    -1.556989798598866e+02, 6.680131188771972e+01,
    -1.328068155288572e+01
  ];
  const c = [
    -7.784894002430293e-03, -3.223964580411365e-01,
    -2.400758277161838e+00, -2.549732539343734e+00,
    4.374664141464968e+00, 2.938163982698783e+00
  ];
  const d = [
    7.784695709041462e-03, 3.224671290700398e-01,
    2.445134137142996e+00, 3.754408661907416e+00
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
           (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
             ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
}

export default function SampleSizeCalculator({ lang }: { lang: LangCode }) {
  const [p1Str, setP1] = useState<string>('');
  const [p2Str, setP2] = useState<string>('');
  const [alpha, setAlpha] = useState<string>('0.05');
  const [power, setPower] = useState<string>('0.80');
  const [ratio, setRatio] = useState<string>('1');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = p1Str !== '' && p2Str !== '' &&
                     !isNaN(parseFloat(p1Str)) && !isNaN(parseFloat(p2Str)) &&
                     parseFloat(p1Str) > 0 && parseFloat(p2Str) > 0 &&
                     parseFloat(p1Str) < 100 && parseFloat(p2Str) < 100;

  let n1 = 0;
  let totalN = 0;

  if (isComplete) {
    const p1 = parseFloat(p1Str) / 100;
    const p2 = parseFloat(p2Str) / 100;
    const a = parseFloat(alpha) || 0.05;
    const pw = parseFloat(power) || 0.80;
    const k = parseFloat(ratio) || 1;

    const za = zScore(1 - a / 2);
    const zb = zScore(pw);
    const p_bar = (p1 + k * p2) / (1 + k);
    
    // Fleiss formula with continuity correction
    const numerator = (za * Math.sqrt((1 + 1 / k) * p_bar * (1 - p_bar)) +
                       zb * Math.sqrt(p1 * (1 - p1) + (p2 * (1 - p2)) / k)) ** 2;
    const denominator = (p1 - p2) ** 2;
    n1 = Math.ceil(numerator / denominator);
    // Continuity correction
    n1 = Math.ceil(n1 / 4 * (1 + Math.sqrt(1 + 2 * (1 + k) / (Math.abs(p1 - p2) * n1 * k))) ** 2);
    totalN = Math.ceil(n1 * (1 + k));
  }

  useEffect(() => {
    if (isComplete && n1 > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('sample-size-calculator', lang, n1);
        trackCalculatorResult('sample-size-calculator', n1, 'subjects', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, n1, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-blue-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="sample-size-calculator" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.p1}</label>
                  <input type="number" value={p1Str} onChange={e => setP1(e.target.value)} placeholder="e.g. 15"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm font-medium transition-all" dir="ltr" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.p2}</label>
                  <input type="number" value={p2Str} onChange={e => setP2(e.target.value)} placeholder="e.g. 10"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm font-medium transition-all" dir="ltr" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.alpha}</label>
                  <select value={alpha} onChange={e => setAlpha(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm font-medium transition-all">
                    <option value="0.01">0.01 (1%)</option>
                    <option value="0.05">0.05 (5%)</option>
                    <option value="0.10">0.10 (10%)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.power}</label>
                  <select value={power} onChange={e => setPower(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm font-medium transition-all">
                    <option value="0.80">0.80 (80%)</option>
                    <option value="0.85">0.85 (85%)</option>
                    <option value="0.90">0.90 (90%)</option>
                    <option value="0.95">0.95 (95%)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.ratio}</label>
                  <select value={ratio} onChange={e => setRatio(e.target.value)}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/20 sm:text-sm font-medium transition-all">
                    <option value="1">1:1 (Equal)</option>
                    <option value="2">1:2</option>
                    <option value="3">1:3</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[380px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-indigo-500/30 via-purple-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{currentText.result}</span>
                <Calculator className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? n1.toLocaleString() : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
              {isComplete && (
                <div className="mt-4 space-y-1 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Total étude:' : lang === 'es' ? 'Total estudio:' : lang === 'ar' ? 'إجمالي الدراسة:' : 'Total study size:'}</span>
                    <span className="font-mono font-bold text-white">{totalN.toLocaleString()} {currentText.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Alpha (α):' : lang === 'ar' ? 'مستوى الدلالة:' : 'Alpha (α):'}</span>
                    <span className="font-mono">{alpha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'fr' ? 'Puissance:' : lang === 'es' ? 'Potencia:' : lang === 'ar' ? 'القوة:' : 'Power:'}</span>
                    <span className="font-mono">{(parseFloat(power) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className="p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 bg-indigo-500/10 border-indigo-500/20 text-indigo-300">
                  <div className="font-bold text-sm tracking-wide">{currentText.status}</div>
                  <div className="font-semibold">
                    {n1} {currentText.points} {lang === 'fr' ? 'par groupe' : lang === 'es' ? 'por grupo' : lang === 'ar' ? 'لكل مجموعة' : 'per group'} · {totalN} {lang === 'fr' ? 'au total' : lang === 'es' ? 'en total' : lang === 'ar' ? 'إجمالاً' : 'total'}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez les taux d\'événements' : lang === 'es' ? 'Ingrese las tasas de eventos' : lang === 'ar' ? 'أدخل معدلات الأحداث' : 'Enter event rates to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Control Rate (p1)", value: `${p1Str}%` },
                  { label: "Treatment Rate (p2)", value: `${p2Str}%` },
                  { label: "Alpha", value: alpha },
                  { label: "Power", value: `${(parseFloat(power || '0') * 100).toFixed(0)}%` },
                  { label: "Allocation Ratio", value: `1:${ratio}` }
                ]}
                results={[
                  { label: "n per group", value: isComplete ? n1.toString() : '--' },
                  { label: "Total sample size", value: isComplete ? totalN.toString() : '--' }
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
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg shrink-0"><Activity className="w-5 h-5" /></div>
            <div className="w-full">
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].mathMetric}</h2>
              <div className="font-mono text-xs bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 tracking-tight" dir="ltr">{currentText.formula}</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0"><BookOpen className="w-5 h-5" /></div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-10 border-t border-gray-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{currentText.pillarTitle}</h2>
        <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
          {currentText.pillarText.map((p, i) => <p key={i}>{p}</p>)}
        </div>
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
