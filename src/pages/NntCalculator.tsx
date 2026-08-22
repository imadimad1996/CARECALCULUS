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
    title: "Number Needed to Treat (NNT)",
    subtitle: "Calculates NNT, ARR, and Relative Risk from trial data",
    controlTotal: "Control Group: Total Patients",
    controlEvents: "Control Group: Events (Outcomes)",
    expTotal: "Experimental Group: Total Patients",
    expEvents: "Experimental Group: Events (Outcomes)",
    resultNnt: "NNT",
    resultNnh: "NNH",
    points: "patients",
    status: "Interpretation:",
    formula: "ARR = CER - EER; NNT = 1 / ARR",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The Number Needed to Treat (NNT) is the average number of patients who need to be treated to prevent one additional bad outcome. An NNT of 1 means every treated patient benefits; higher numbers mean less benefit. If the treatment causes more harm than good, the result is expressed as Number Needed to Harm (NNH).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Absolute Risk Reduction (ARR): The absolute difference in event rates between groups. Clinically more useful than Relative Risk.",
      "Relative Risk (RR): The ratio of the probability of an event occurring in the exposed group versus the unexposed group.",
      "Relative Risk Reduction (RRR): The proportion of risk reduced by the intervention.",
      "Always round NNT *up* to the next whole number (e.g., 4.1 becomes 5), because you cannot treat a fraction of a patient."
    ],
    references: "Cook RJ, Sackett DL. The number needed to treat: a clinically useful measure of treatment effect. BMJ. 1995;310(6977):452-4.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why is NNT better than Relative Risk Reduction (RRR)?",
    faqA1: "RRR can be misleading. A drug might reduce the risk of a rare disease from 2 in 1,000,000 to 1 in 1,000,000. That's a 50% RRR! But the ARR is only 0.0001%, meaning the NNT is 1,000,000. NNT tells you the actual real-world clinical impact.",
    faqQ2: "What is a 'good' NNT?",
    faqA2: "It depends on the context. For a cheap, safe drug (like aspirin for secondary prevention), an NNT of 50 is acceptable. For an expensive, risky procedure, you'd want an NNT closer to 5-10.",
  },
  fr: {
    title: "Nombre Nécessaire à Traiter (NNT)",
    subtitle: "Calcule le NNT, la RRA et le Risque Relatif",
    controlTotal: "Groupe Contrôle : Total de patients",
    controlEvents: "Groupe Contrôle : Événements (Résultats)",
    expTotal: "Groupe Expérimental : Total de patients",
    expEvents: "Groupe Expérimental : Événements (Résultats)",
    resultNnt: "NNT",
    resultNnh: "NNN (Nuire)",
    points: "patients",
    status: "Interprétation :",
    formula: "RRA = ERC - ERE; NNT = 1 / RRA",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le NNT est le nombre moyen de patients à traiter pour éviter un événement défavorable supplémentaire. Un NNT de 1 signifie que chaque patient bénéficie du traitement. Si le traitement cause plus d'effets indésirables, on parle de Nombre Nécessaire pour Nuire (NNN).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Réduction Absolue du Risque (RRA) : Différence absolue des taux d'événements. Plus utile cliniquement que le Risque Relatif.",
      "Risque Relatif (RR) : Rapport de la probabilité d'un événement dans le groupe exposé par rapport au non exposé.",
      "Le NNT doit toujours être arrondi à l'entier supérieur (ex: 4.1 devient 5)."
    ],
    references: "Cook RJ, Sackett DL. The number needed to treat. BMJ. 1995.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi le NNT est-il meilleur que la Réduction Relative du Risque (RRR) ?",
    faqA1: "La RRR peut être trompeuse pour les événements rares. Le NNT donne l'impact clinique réel dans la vraie vie.",
    faqQ2: "Qu'est-ce qu'un 'bon' NNT ?",
    faqA2: "Cela dépend. Pour un traitement sûr et peu coûteux, un NNT de 50 est acceptable. Pour une chimiothérapie toxique, on vise un NNT beaucoup plus bas.",
  },
  es: {
    title: "Número Necesario a Tratar (NNT)",
    subtitle: "Calcula NNT, RRA y Riesgo Relativo a partir de ensayos clínicos",
    controlTotal: "Grupo Control: Pacientes Totales",
    controlEvents: "Grupo Control: Eventos",
    expTotal: "Grupo Experimental: Pacientes Totales",
    expEvents: "Grupo Experimental: Eventos",
    resultNnt: "NNT",
    resultNnh: "NND (Dañar)",
    points: "pacientes",
    status: "Interpretación:",
    formula: "RRA = RCG - REG; NNT = 1 / RRA",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El NNT es el número promedio de pacientes que deben recibir tratamiento para prevenir un resultado adverso adicional. Un NNT alto indica un beneficio menor. Si el tratamiento aumenta el riesgo, se calcula el Número Necesario para Dañar (NND).",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Reducción Absoluta del Riesgo (RRA): Diferencia absoluta en las tasas de eventos. Más útil clínicamente que el Riesgo Relativo.",
      "Riesgo Relativo (RR): Probabilidad de evento en el grupo experimental dividida por la del control.",
      "Siempre redondee el NNT al entero superior (ej: 4.1 se convierte en 5) porque no se puede tratar a una fracción de paciente."
    ],
    references: "Cook RJ, Sackett DL. The number needed to treat. BMJ. 1995.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué el NNT es mejor que la Reducción Relativa del Riesgo (RRR)?",
    faqA1: "La RRR infla el beneficio en enfermedades raras. El NNT refleja el esfuerzo real necesario para obtener un beneficio.",
    faqQ2: "¿Qué es un 'buen' NNT?",
    faqA2: "Depende del costo y la toxicidad. Para aspirina preventiva, un NNT de 50 está bien. Para cirugía riesgosa, se requiere un NNT de 5-10.",
  },
  ar: {
    title: "العدد المطلوب للعلاج (NNT)",
    subtitle: "حساب NNT والانخفاض المطلق للمخاطر (ARR)",
    controlTotal: "المجموعة الضابطة: إجمالي المرضى",
    controlEvents: "المجموعة الضابطة: عدد الأحداث (النتائج)",
    expTotal: "المجموعة التجريبية: إجمالي المرضى",
    expEvents: "المجموعة التجريبية: عدد الأحداث (النتائج)",
    resultNnt: "NNT",
    resultNnh: "NNH",
    points: "مرضى",
    status: "التفسير:",
    formula: "ARR = CER - EER; NNT = 1 / ARR",
    clinicalTitle: "التفسير السريري",
    clinicalText: "العدد المطلوب للعلاج (NNT) هو متوسط عدد المرضى الذين تحتاج لعلاجهم لمنع نتيجة سيئة واحدة. كلما قل الرقم كان العلاج أفضل. إذا كان العلاج يسبب ضرراً، يسمى العدد المطلوب للضرر (NNH).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "الانخفاض المطلق للمخاطر (ARR): الفرق المطلق في معدلات الأحداث بين المجموعتين. أهم سريرياً من الخطر النسبي.",
      "الخطر النسبي (RR): نسبة احتمال وقوع الحدث في المجموعة التجريبية إلى المجموعة الضابطة.",
      "يجب دائماً تقريب NNT إلى الرقم الصحيح الأكبر (مثلاً 4.1 تصبح 5)، لأنه لا يمكنك علاج جزء من مريض."
    ],
    references: "Cook RJ, Sackett DL. The number needed to treat. BMJ. 1995.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا يعتبر NNT أفضل من الخطر النسبي (RR)؟",
    faqA1: "الخطر النسبي قد يكون مضللاً. إذا قلل دواء خطر مرض نادر من 2 في المليون إلى 1 في المليون، فالخطر النسبي انخفض بنسبة 50٪، لكن NNT هو مليون مريض! NNT يخبرك بالتأثير الحقيقي على أرض الواقع.",
    faqQ2: "ما هو الـ NNT 'الجيد'؟",
    faqA2: "يعتمد على التكلفة والآثار الجانبية. دواء رخيص وآمن (مثل الأسبرين للوقاية) يعتبر NNT=50 جيداً. بينما الجراحة الخطيرة تتطلب NNT أقل من 10.",
  }
};

export default function NntCalculator({ lang }: { lang: LangCode }) {
  const [cTotal, setCTotal] = useState<string>('');
  const [cEvents, setCEvents] = useState<string>('');
  const [eTotal, setETotal] = useState<string>('');
  const [eEvents, setEEvents] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = cTotal !== '' && !isNaN(parseFloat(cTotal)) && parseFloat(cTotal) > 0 &&
                     cEvents !== '' && !isNaN(parseFloat(cEvents)) && parseFloat(cEvents) >= 0 &&
                     eTotal !== '' && !isNaN(parseFloat(eTotal)) && parseFloat(eTotal) > 0 &&
                     eEvents !== '' && !isNaN(parseFloat(eEvents)) && parseFloat(eEvents) >= 0;
  
  let cer = 0;
  let eer = 0;
  let arr = 0;
  let nnt = 0;
  let rr = 0;
  let rrr = 0;
  let isHarm = false;
  let interpretation = "";

  if (isComplete) {
    const ct = parseFloat(cTotal);
    const ce = parseFloat(cEvents);
    const et = parseFloat(eTotal);
    const ee = parseFloat(eEvents);
    
    cer = ce / ct;
    eer = ee / et;
    
    arr = cer - eer;
    rr = cer > 0 ? (eer / cer) : 0;
    rrr = cer > 0 ? ((cer - eer) / cer) : 0;

    if (arr === 0) {
      nnt = Infinity;
      interpretation = lang === 'fr' ? 'Aucun effet' : lang === 'es' ? 'Sin efecto' : lang === 'ar' ? 'لا يوجد تأثير' : 'No effect (No difference between groups)';
    } else if (arr > 0) {
      isHarm = false;
      nnt = Math.ceil(1 / arr);
      interpretation = lang === 'fr' ? `Bénéfice : traiter ${nnt} pour en sauver 1` : 
                       lang === 'es' ? `Beneficio: tratar a ${nnt} para salvar a 1` : 
                       lang === 'ar' ? `فائدة: علاج ${nnt} لمنع حدث واحد` : 
                       `Benefit: Treat ${nnt} patients to prevent 1 outcome`;
    } else {
      isHarm = true;
      nnt = Math.ceil(1 / Math.abs(arr));
      interpretation = lang === 'fr' ? `Nuire : traiter ${nnt} cause 1 préjudice` : 
                       lang === 'es' ? `Daño: tratar a ${nnt} causa 1 evento adverso` : 
                       lang === 'ar' ? `ضرر: علاج ${nnt} يسبب ضرراً لـ 1` : 
                       `Harm: Treating ${nnt} patients causes 1 additional adverse outcome`;
    }
  }

  useEffect(() => {
    if (isComplete && nnt !== Infinity) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('nnt-calculator', lang, nnt);
        trackCalculatorResult('nnt-calculator', nnt, 'patients', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, nnt, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="nnt-calculator" lang={lang} title={currentText.title} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="col-span-1 md:col-span-2 font-semibold text-gray-800 border-b border-gray-200 pb-2">
                    Control Group (e.g. Placebo)
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{currentText.controlTotal}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={cTotal}
                      onChange={(e) => setCTotal(e.target.value)}
                      placeholder="e.g. 100"
                      className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all shadow-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{currentText.controlEvents}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={cEvents}
                      onChange={(e) => setCEvents(e.target.value)}
                      placeholder="e.g. 15"
                      className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all shadow-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-xl border border-gray-200 bg-blue-50/30">
                  <div className="col-span-1 md:col-span-2 font-semibold text-blue-900 border-b border-blue-100 pb-2">
                    Experimental Group (e.g. Treatment)
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{currentText.expTotal}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={eTotal}
                      onChange={(e) => setETotal(e.target.value)}
                      placeholder="e.g. 100"
                      className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all shadow-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">{currentText.expEvents}</label>
                    <input
                      type="number" inputMode="decimal"
                      value={eEvents}
                      onChange={(e) => setEEvents(e.target.value)}
                      placeholder="e.g. 10"
                      className="block w-full rounded-xl border-gray-200 bg-white py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all shadow-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[420px] transition-all duration-300">
            <div className={`absolute top-0 right-0 p-36 rounded-bl-[120px] pointer-events-none animate-pulse ${isHarm ? 'bg-gradient-to-bl from-red-500/30 via-orange-500/10 to-transparent' : 'bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent'}`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {isComplete ? (isHarm ? currentText.resultNnh : currentText.resultNnt) : 'NNT / NNH'}
                </span>
                <Calculator className={`w-5 h-5 ${isHarm ? 'text-red-400' : 'text-blue-400'}`} />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? (nnt === Infinity ? '∞' : nnt) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
              
              {isComplete && (
                <div className="mt-4 space-y-1 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>CER:</span> <span className="font-mono">{(cer * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EER:</span> <span className="font-mono">{(eer * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ARR (Abs. Diff):</span> <span className="font-mono">{(arr * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Relative Risk:</span> <span className="font-mono">{rr.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rel. Risk Reduction:</span> <span className="font-mono">{(rrr * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                  isHarm ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  nnt === Infinity ? 'bg-gray-500/10 border-gray-500/20 text-gray-400' :
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
                  { label: "Control Total", value: cTotal },
                  { label: "Control Events", value: cEvents },
                  { label: "Experimental Total", value: eTotal },
                  { label: "Experimental Events", value: eEvents }
                ]}
                results={[
                  { label: isHarm ? "NNH" : "NNT", value: isComplete ? (nnt === Infinity ? 'Infinity' : nnt.toString()) : '--' },
                  { label: "ARR", value: isComplete ? `${(arr * 100).toFixed(2)}%` : '--' },
                  { label: "Relative Risk", value: isComplete ? rr.toFixed(2) : '--' },
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
        <MedicalReviewerCard reviewer={REVIEWER_PHARMACY} lang={lang} />
      </div>
    </>
  );
}

