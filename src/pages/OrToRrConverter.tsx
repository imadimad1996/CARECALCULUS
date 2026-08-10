import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, ArrowRightLeft } from 'lucide-react';
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
    title: "OR to RR Converter",
    subtitle: "Convert an Odds Ratio (OR) to a Relative Risk (RR) using event rates",
    or: "Odds Ratio (OR) from study",
    pe: "Event Rate in Control Group (p0, as %)",
    result: "Relative Risk (RR)",
    status: "Interpretation:",
    formula: "RR = OR / ((1 - p0) + (p0 × OR))",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Odds Ratios (OR) from logistic regression or case-control studies are commonly mistaken for Relative Risk (RR). They are numerically equal only when the event is rare (< 10%). For common outcomes, OR overestimates the RR. This calculator applies the Zhang & Yu (1998) conversion formula.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "The 'Rare Disease Assumption': When the outcome is rare (< 10%), OR ≈ RR. This is why ORs are often reported as if they were RRs in the media.",
      "When the event is COMMON (> 10%), OR can significantly overestimate the RR. The Zhang & Yu formula corrects for this.",
      "The formula requires knowing the baseline event rate (p0) in the control/unexposed group.",
      "This conversion is most commonly needed when interpreting results from case-control studies, logistic regression, or meta-analyses."
    ],
    references: "Zhang J, Yu KF. What's the relative risk? A method of correcting the odds ratio in cohort studies of common outcomes. JAMA. 1998;280(19):1690-1.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "When is OR approximately equal to RR?",
    faqA1: "When the event rate in both groups is low (< 10%), the denominator of the Zhang formula approaches 1, and OR ≈ RR. This is the 'rare disease assumption'.",
    faqQ2: "Can I always convert OR to RR?",
    faqA2: "Not always. This conversion is only valid for cohort-type data where you have a baseline event rate. In a pure case-control study, you do not have an incidence rate; you only have an OR.",
  },
  fr: {
    title: "Convertisseur RC en RR",
    subtitle: "Convertit un Odds Ratio (OR/RC) en Risque Relatif (RR)",
    or: "Odds Ratio (RC) de l'étude",
    pe: "Taux d'événements dans le groupe contrôle (p0, en %)",
    result: "Risque Relatif (RR)",
    status: "Interprétation :",
    formula: "RR = RC / ((1 - p0) + (p0 × RC))",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Les Odds Ratios (RC) issus de régressions logistiques sont souvent confondus avec le Risque Relatif (RR). Ils sont proches uniquement pour les événements rares (< 10%). Pour les événements fréquents, le RC surestime le RR. Cette calculatrice applique la formule de Zhang & Yu (1998).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Hypothèse de la maladie rare : Quand l'événement est rare (< 10%), RC ≈ RR.",
      "Pour les événements FRÉQUENTS (> 10%), le RC peut surestimer considérablement le RR.",
      "La formule nécessite de connaître le taux d'événements basal dans le groupe contrôle.",
      "Utile pour interpréter les résultats d'études cas-témoin, de régressions logistiques ou de méta-analyses."
    ],
    references: "Zhang J, Yu KF. What's the relative risk? JAMA. 1998.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Quand RC ≈ RR ?",
    faqA1: "Quand le taux d'événements est faible (< 10%) dans les deux groupes. C'est l'hypothèse de la maladie rare.",
    faqQ2: "Peut-on toujours convertir ?",
    faqA2: "Non. Cette conversion nécessite un taux d'incidence de base. Dans une étude cas-témoin pure, on n'a pas ce taux.",
  },
  es: {
    title: "Conversor OR a RR",
    subtitle: "Convierte un Odds Ratio (OR) a Riesgo Relativo (RR)",
    or: "Odds Ratio (OR) del estudio",
    pe: "Tasa de eventos en el grupo control (p0, en %)",
    result: "Riesgo Relativo (RR)",
    status: "Interpretación:",
    formula: "RR = OR / ((1 - p0) + (p0 × OR))",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Los Odds Ratios de estudios de regresión logística frecuentemente se confunden con el Riesgo Relativo. Son iguales solo para eventos raros (< 10%). Para eventos frecuentes, el OR sobreestima el RR. Esta calculadora aplica la fórmula de Zhang & Yu (1998).",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Asunción de enfermedad rara: Cuando el evento es poco frecuente (< 10%), OR ≈ RR.",
      "Para eventos FRECUENTES (> 10%), el OR puede sobreestimar significativamente el RR.",
      "La fórmula requiere conocer la tasa de eventos basal en el grupo control.",
      "Más útil al interpretar estudios caso-control, regresión logística o meta-análisis."
    ],
    references: "Zhang J, Yu KF. What's the relative risk? JAMA. 1998.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Cuándo OR ≈ RR?",
    faqA1: "Cuando la tasa de eventos es baja (< 10%) en ambos grupos. Es la 'asunción de enfermedad rara'.",
    faqQ2: "¿Se puede siempre convertir OR a RR?",
    faqA2: "No. Necesitas una tasa de incidencia basal, que no existe en estudios caso-control puros.",
  },
  ar: {
    title: "محول OR إلى RR",
    subtitle: "تحويل نسبة الأرجحية (OR) إلى الخطر النسبي (RR)",
    or: "نسبة الأرجحية (OR) من الدراسة",
    pe: "معدل الأحداث في المجموعة الضابطة (p0، كنسبة مئوية)",
    result: "الخطر النسبي (RR)",
    status: "التفسير:",
    formula: "RR = OR / ((1 - p0) + (p0 × OR))",
    clinicalTitle: "التفسير السريري",
    clinicalText: "كثيراً ما تُخلط نسبة الأرجحية (OR) الناتجة عن الانحدار اللوجستي مع الخطر النسبي (RR). هما متساويان فقط عندما يكون الحدث نادراً (< 10%). للأحداث الشائعة، يبالغ OR في تقدير RR. تطبق هذه الحاسبة معادلة Zhang & Yu (1998).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "افتراض المرض النادر: عندما يكون الحدث نادراً (< 10%)، يكون OR ≈ RR.",
      "للأحداث الشائعة (> 10%)، قد يبالغ OR في تقدير RR بشكل ملحوظ.",
      "المعادلة تتطلب معرفة معدل الأحداث الأساسي في المجموعة الضابطة.",
      "مفيد بشكل خاص عند تفسير نتائج دراسات الحالة والشاهد، الانحدار اللوجستي، أو التحليل التلوي."
    ],
    references: "Zhang J, Yu KF. What's the relative risk? JAMA. 1998.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "متى يكون OR ≈ RR؟",
    faqA1: "عندما تكون نسبة الأحداث منخفضة (< 10%) في كلتا المجموعتين. هذا ما يسمى 'افتراض المرض النادر'.",
    faqQ2: "هل يمكنني دائماً تحويل OR إلى RR؟",
    faqA2: "لا دائماً. هذا التحويل يتطلب معدل حدوث أساسي لا يتوفر في دراسات الحالة والشاهد الخالصة.",
  }
};

export default function OrToRrConverter({ lang }: { lang: LangCode }) {
  const [orStr, setOrStr] = useState<string>('');
  const [peStr, setPeStr] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = orStr !== '' && peStr !== '' &&
                     !isNaN(parseFloat(orStr)) && parseFloat(orStr) > 0 &&
                     !isNaN(parseFloat(peStr)) && parseFloat(peStr) > 0 && parseFloat(peStr) < 100;

  let rr = 0;
  let bias = 0;

  if (isComplete) {
    const or = parseFloat(orStr);
    const p0 = parseFloat(peStr) / 100;
    rr = or / ((1 - p0) + (p0 * or));
    bias = or - rr;
  }

  const commonEvent = isComplete && parseFloat(peStr) >= 10;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('or-to-rr', lang, rr);
        trackCalculatorResult('or-to-rr', rr, 'RR', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, rr, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-orange-500/10 via-amber-500/5 to-yellow-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="or-to-rr" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">{currentText.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.or}</label>
                <input type="number" value={orStr} onChange={e => setOrStr(e.target.value)} placeholder="e.g. 2.5"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 sm:text-sm font-medium transition-all" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.pe}</label>
                <input type="number" value={peStr} onChange={e => setPeStr(e.target.value)} placeholder="e.g. 20"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500/20 sm:text-sm font-medium transition-all" dir="ltr" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-orange-500/30 via-amber-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{currentText.result}</span>
                <ArrowRightLeft className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? rr.toFixed(2) : '--'}
                </span>
              </div>
              {isComplete && (
                <div className="mt-4 space-y-1 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>OR (input):</span><span className="font-mono">{parseFloat(orStr).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RR (corrected):</span><span className="font-mono font-bold text-white">{rr.toFixed(2)}</span>
                  </div>
                  {Math.abs(bias) > 0.01 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Overestimation (OR - RR):</span><span className="font-mono">{bias.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                  commonEvent ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide">{currentText.status}</div>
                  <div className="font-semibold text-sm">
                    {commonEvent
                      ? (lang === 'fr' ? 'Événement fréquent — OR surestime RR de ' : lang === 'es' ? 'Evento frecuente — OR sobreestima RR en ' : lang === 'ar' ? 'حدث شائع — OR يبالغ في تقدير RR بمقدار ' : 'Common event — OR overestimates RR by ') + Math.abs(bias).toFixed(2)
                      : (lang === 'fr' ? 'Événement rare — OR ≈ RR (conversion fiable)' : lang === 'es' ? 'Evento raro — OR ≈ RR (conversión confiable)' : lang === 'ar' ? 'حدث نادر — OR ≈ RR (التحويل موثوق)' : 'Rare event — OR ≈ RR (reliable conversion)')
                    }
                  </div>
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
                  { label: "Odds Ratio (OR)", value: orStr },
                  { label: "Control Event Rate (p0)", value: `${peStr}%` }
                ]}
                results={[
                  { label: "Relative Risk (RR)", value: isComplete ? rr.toFixed(3) : '--' },
                  { label: "OR Overestimation", value: isComplete ? bias.toFixed(3) : '--' }
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
