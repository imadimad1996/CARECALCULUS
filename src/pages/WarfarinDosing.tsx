import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Activity as ActivityIcon } from 'lucide-react';
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
    title: "Warfarin Dose Adjustment",
    subtitle: "Algorithm for adjusting maintenance warfarin based on INR",
    inr: "Current INR",
    target: "Target INR Range",
    target23: "2.0 - 3.0 (Most indications)",
    target2535: "2.5 - 3.5 (Mechanical valves)",
    weeklyDose: "Current Weekly Dose (mg)",
    result: "Adjustment Recommendation",
    mg: "mg/week",
    formula: "Empirical adjustment based on standard ACCP guidelines",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Warfarin adjustments should be based on the total weekly dose. Only adjust if the INR is consistently out of range or if a single value is significantly out of range. Check for interacting drugs or diet changes before altering the dose.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Wait at least 3-4 days after a dose change before rechecking the INR to allow the new dose to reach steady state.",
      "If INR is > 9.0, hold warfarin and administer oral Vitamin K (2.5 - 5 mg) depending on bleeding risk.",
      "In cases of severe bleeding at any elevated INR, administer IV Vitamin K and Prothrombin Complex Concentrate (PCC)."
    ],
    references: "Holbrook A, et al. Evidence-based management of anticoagulant therapy: Antithrombotic Therapy and Prevention of Thrombosis, 9th ed: American College of Chest Physicians Evidence-Based Clinical Practice Guidelines. Chest. 2012.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Should I adjust the dose for a single INR of 1.9 or 3.1?",
    faqA1: "Often, minor out-of-range values (e.g., 1.9 or 3.1 on a 2.0-3.0 goal) can be monitored without a dose change if the patient has been previously stable. Clinical judgment is required.",
    faqQ2: "How is the new weekly dose calculated?",
    faqA2: "The calculator suggests a conservative midpoint adjustment (e.g., if the guideline says 5-10% decrease, it provides the target dose for both a 5% and 10% decrease to guide your prescription).",
  },
  fr: {
    title: "Ajustement de la Warfarine",
    subtitle: "Algorithme d'ajustement de l'anticoagulant selon l'INR",
    inr: "INR Actuel",
    target: "Cible INR",
    target23: "2.0 - 3.0 (La plupart des cas)",
    target2535: "2.5 - 3.5 (Valves mécaniques)",
    weeklyDose: "Dose Hebdomadaire Actuelle (mg)",
    result: "Recommandation",
    mg: "mg/semaine",
    formula: "Ajustement empirique selon les recommandations de l'ACCP",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "L'ajustement doit se baser sur la dose hebdomadaire totale. Vérifiez toujours les interactions médicamenteuses ou les changements alimentaires avant de modifier la dose.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Attendre au moins 3-4 jours après un changement de dose avant de recontrôler l'INR.",
      "Si l'INR > 9.0 : suspendre la warfarine et donner de la Vitamine K per os (2.5 - 5 mg).",
      "En cas de saignement sévère (quel que soit l'INR élevé) : Vitamine K IV et Concentré de Complexe Prothrombinique (CCP)."
    ],
    references: "Holbrook A, et al. Evidence-based management of anticoagulant therapy (ACCP Guidelines). Chest. 2012.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Faut-il modifier la dose pour un INR à 1.9 ou 3.1 ?",
    faqA1: "Souvent, de légers écarts peuvent être surveillés sans changement de dose si le patient était stable. Le jugement clinique prime.",
    faqQ2: "Comment la nouvelle dose hebdomadaire est-elle calculée ?",
    faqA2: "Le calculateur propose une fourchette. Par exemple, si la recommandation est -5 à -10%, il affiche les deux valeurs cibles pour guider la prescription.",
  },
  es: {
    title: "Ajuste de Warfarina",
    subtitle: "Algoritmo de ajuste de mantenimiento basado en el INR",
    inr: "INR Actual",
    target: "Rango INR Objetivo",
    target23: "2.0 - 3.0 (Mayoría de indicaciones)",
    target2535: "2.5 - 3.5 (Válvulas mecánicas)",
    weeklyDose: "Dosis Semanal Actual (mg)",
    result: "Recomendación de Ajuste",
    mg: "mg/semana",
    formula: "Ajuste empírico basado en las pautas de ACCP",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Los ajustes de warfarina deben basarse en la dosis semanal total. Antes de ajustar, verifique si hay interacciones medicamentosas o cambios en la dieta (vitamina K).",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Espere al menos 3-4 días después de un cambio de dosis antes de volver a controlar el INR.",
      "Si INR > 9.0: suspenda la warfarina y administre Vitamina K oral (2.5 - 5 mg).",
      "En caso de sangrado grave con cualquier INR elevado, administre Vitamina K IV y Concentrado de Complejo Protrombínico (PCC)."
    ],
    references: "Holbrook A, et al. Evidence-based management of anticoagulant therapy (ACCP Guidelines). Chest. 2012.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Debo ajustar la dosis por un único INR de 1.9 o 3.1?",
    faqA1: "A menudo, las desviaciones menores se pueden monitorizar sin cambiar la dosis si el paciente ha estado estable previamente. Se requiere criterio clínico.",
    faqQ2: "¿Cómo se calcula la nueva dosis semanal?",
    faqA2: "La calculadora sugiere un rango de ajuste. Por ejemplo, si la guía dice que disminuya un 5-10%, proporciona la dosis para ambas reducciones.",
  },
  ar: {
    title: "تعديل جرعة الوارفارين",
    subtitle: "خوارزمية تعديل جرعة الوارفارين بناءً على تحليل INR",
    inr: "مستوى INR الحالي",
    target: "النطاق المستهدف",
    target23: "2.0 - 3.0 (معظم الحالات)",
    target2535: "2.5 - 3.5 (صمامات القلب الميكانيكية)",
    weeklyDose: "الجرعة الأسبوعية الحالية (مجم)",
    result: "توصية التعديل",
    mg: "مجم/أسبوع",
    formula: "تعديل تجريبي يعتمد على إرشادات ACCP",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يجب أن تستند التعديلات إلى إجمالي الجرعة الأسبوعية. تحقق دائماً من التفاعلات الدوائية أو التغيرات في النظام الغذائي قبل تعديل الجرعة.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "انتظر 3-4 أيام على الأقل بعد تغيير الجرعة قبل إعادة فحص INR.",
      "إذا كان INR > 9.0: أوقف الوارفارين وأعطِ فيتامين ك فموياً (2.5 - 5 مجم).",
      "في حالة النزيف الشديد في أي مستوى INR مرتفع، أعطِ فيتامين ك وريدياً ومركز معقد البروثرومبين (PCC)."
    ],
    references: "Holbrook A, et al. Evidence-based management of anticoagulant therapy (ACCP Guidelines). Chest. 2012.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يجب تعديل الجرعة إذا كان القياس 1.9 أو 3.1 مرة واحدة؟",
    faqA1: "غالباً يمكن مراقبة الانحرافات الطفيفة دون تغيير الجرعة إذا كان المريض مستقراً مسبقاً. التقييم السريري ضروري.",
    faqQ2: "كيف يتم حساب الجرعة الأسبوعية الجديدة؟",
    faqA2: "تقترح الحاسبة نطاقاً. فمثلاً إذا كانت التوصية تقليل الجرعة بنسبة 5-10%، فسيتم إعطاؤك الجرعة الجديدة لكلتا النسبتين كدليل.",
  }
};

export default function WarfarinDosing({ lang }: { lang: LangCode }) {
  const [inr, setInr] = useState<string>('');
  const [target, setTarget] = useState<'2.0' | '2.5'>('2.0');
  const [weeklyDose, setWeeklyDose] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = inr !== '' && !isNaN(parseFloat(inr)) && parseFloat(inr) > 0 &&
                     weeklyDose !== '' && !isNaN(parseFloat(weeklyDose)) && parseFloat(weeklyDose) > 0;

  let recommendation = "";
  let newDoseRange = "";

  if (isComplete) {
    const val = parseFloat(inr);
    const dose = parseFloat(weeklyDose);

    if (target === '2.0') {
      if (val < 1.5) {
        recommendation = "Increase weekly dose by 10-20%";
        newDoseRange = `${(dose * 1.1).toFixed(1)} - ${(dose * 1.2).toFixed(1)}`;
      } else if (val <= 1.9) {
        recommendation = "Increase weekly dose by 5-10%";
        newDoseRange = `${(dose * 1.05).toFixed(1)} - ${(dose * 1.1).toFixed(1)}`;
      } else if (val <= 3.0) {
        recommendation = "No change needed";
        newDoseRange = `${dose.toFixed(1)}`;
      } else if (val <= 3.9) {
        recommendation = "Decrease weekly dose by 5-10%";
        newDoseRange = `${(dose * 0.9).toFixed(1)} - ${(dose * 0.95).toFixed(1)}`;
      } else if (val <= 4.9) {
        recommendation = "Hold 1 dose, then decrease weekly dose by 10%";
        newDoseRange = `${(dose * 0.9).toFixed(1)}`;
      } else if (val <= 8.9) {
        recommendation = "Hold 1-2 doses, then decrease weekly dose by 10-20%";
        newDoseRange = `${(dose * 0.8).toFixed(1)} - ${(dose * 0.9).toFixed(1)}`;
      } else {
        recommendation = "Hold warfarin, give PO Vitamin K 2.5-5mg. Monitor closely.";
        newDoseRange = "Re-evaluate after INR < 3.0";
      }
    } else {
      if (val < 2.0) {
        recommendation = "Increase weekly dose by 10-20%";
        newDoseRange = `${(dose * 1.1).toFixed(1)} - ${(dose * 1.2).toFixed(1)}`;
      } else if (val <= 2.4) {
        recommendation = "Increase weekly dose by 5-10%";
        newDoseRange = `${(dose * 1.05).toFixed(1)} - ${(dose * 1.1).toFixed(1)}`;
      } else if (val <= 3.5) {
        recommendation = "No change needed";
        newDoseRange = `${dose.toFixed(1)}`;
      } else if (val <= 4.5) {
        recommendation = "Decrease weekly dose by 5-10%";
        newDoseRange = `${(dose * 0.9).toFixed(1)} - ${(dose * 0.95).toFixed(1)}`;
      } else if (val <= 5.5) {
        recommendation = "Hold 1 dose, then decrease weekly dose by 10%";
        newDoseRange = `${(dose * 0.9).toFixed(1)}`;
      } else if (val <= 8.9) {
        recommendation = "Hold 1-2 doses, then decrease weekly dose by 10-20%";
        newDoseRange = `${(dose * 0.8).toFixed(1)} - ${(dose * 0.9).toFixed(1)}`;
      } else {
        recommendation = "Hold warfarin, give PO Vitamin K 2.5-5mg. Monitor closely.";
        newDoseRange = "Re-evaluate after INR < 3.5";
      }
    }
  }

  // Translation mapping for recommendations
  const transRec = (rec: string, lang: LangCode) => {
    if (lang === 'en') return rec;
    if (lang === 'fr') {
      if (rec.includes("No change")) return "Aucun changement nécessaire";
      if (rec.includes("Increase weekly dose by 10-20%")) return "Augmenter la dose hebdo de 10-20%";
      if (rec.includes("Increase weekly dose by 5-10%")) return "Augmenter la dose hebdo de 5-10%";
      if (rec.includes("Decrease weekly dose by 5-10%")) return "Diminuer la dose hebdo de 5-10%";
      if (rec.includes("Hold 1 dose, then decrease")) return "Sauter 1 dose, puis diminuer de 10%";
      if (rec.includes("Hold 1-2 doses")) return "Sauter 1 à 2 doses, puis diminuer de 10-20%";
      if (rec.includes("Hold warfarin")) return "Suspendre la warfarine, donner Vitamine K PO 2.5-5mg. Surveiller étroitement.";
    }
    if (lang === 'es') {
      if (rec.includes("No change")) return "No requiere cambios";
      if (rec.includes("Increase weekly dose by 10-20%")) return "Aumentar dosis semanal un 10-20%";
      if (rec.includes("Increase weekly dose by 5-10%")) return "Aumentar dosis semanal un 5-10%";
      if (rec.includes("Decrease weekly dose by 5-10%")) return "Disminuir dosis semanal un 5-10%";
      if (rec.includes("Hold 1 dose, then decrease")) return "Omitir 1 dosis, luego disminuir un 10%";
      if (rec.includes("Hold 1-2 doses")) return "Omitir 1-2 dosis, luego disminuir un 10-20%";
      if (rec.includes("Hold warfarin")) return "Suspender warfarina, dar Vitamina K oral 2.5-5mg. Monitorizar de cerca.";
    }
    if (lang === 'ar') {
      if (rec.includes("No change")) return "لا يحتاج إلى تغيير";
      if (rec.includes("Increase weekly dose by 10-20%")) return "زيادة الجرعة الأسبوعية بنسبة 10-20%";
      if (rec.includes("Increase weekly dose by 5-10%")) return "زيادة الجرعة الأسبوعية بنسبة 5-10%";
      if (rec.includes("Decrease weekly dose by 5-10%")) return "تقليل الجرعة الأسبوعية بنسبة 5-10%";
      if (rec.includes("Hold 1 dose, then decrease")) return "تخطي جرعة واحدة، ثم تقليل الجرعة الأسبوعية بنسبة 10%";
      if (rec.includes("Hold 1-2 doses")) return "تخطي جرعة إلى جرعتين، ثم تقليل الجرعة بنسبة 10-20%";
      if (rec.includes("Hold warfarin")) return "أوقف الوارفارين، وأعطِ فيتامين ك فموياً (2.5-5 مجم). راقب عن كثب.";
    }
    return rec;
  };

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('warfarin-dosing', lang, recommendation);
        trackCalculatorResult('warfarin-dosing', 0, recommendation, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, recommendation, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="warfarin-dosing" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.inr}</label>
                <input
                  type="number"
                  step="0.1"
                  value={inr}
                  onChange={(e) => setInr(e.target.value)}
                  placeholder="e.g. 3.2"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.weeklyDose}</label>
                <input
                  type="number"
                  value={weeklyDose}
                  onChange={(e) => setWeeklyDose(e.target.value)}
                  placeholder="e.g. 35"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.target}</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setTarget('2.0')}
                    className={`w-full py-3 px-4 text-sm font-bold rounded-xl border text-left transition-all ${
                      target === '2.0' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-500/20' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {currentText.target23}
                  </button>
                  <button
                    onClick={() => setTarget('2.5')}
                    className={`w-full py-3 px-4 text-sm font-bold rounded-xl border text-left transition-all ${
                      target === '2.5' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm ring-1 ring-blue-500/20' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {currentText.target2535}
                  </button>
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
                <ActivityIcon className="w-5 h-5 text-blue-400" />
              </div>
              
              {isComplete ? (
                <div className="mt-4">
                  <h3 className={`text-xl font-bold mb-4 ${recommendation.includes("No change") ? 'text-emerald-400' : recommendation.includes("Hold") ? 'text-red-400' : 'text-blue-300'}`}>
                    {transRec(recommendation, lang)}
                  </h3>
                  <div className="pt-4 border-t border-slate-700/50">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">New Target Weekly Dose:</span>
                    <div className="flex items-baseline gap-2 tabular-nums" dir="ltr">
                      <span className="text-3xl font-black text-white">
                        {newDoseRange}
                      </span>
                      {newDoseRange.includes("Re-evaluate") ? null : <span className="text-sm font-bold text-slate-400">mg</span>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                  <span className="text-5xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    --
                  </span>
                </div>
              )}
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {!isComplete && (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez l\'INR et la dose' : lang === 'es' ? 'Ingrese INR y dosis' : lang === 'ar' ? 'أدخل مستوى INR والجرعة' : 'Enter INR and dose'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Current INR", value: inr },
                  { label: "Weekly Dose", value: `${weeklyDose} mg` },
                  { label: "Target", value: target === '2.0' ? '2.0 - 3.0' : '2.5 - 3.5' }
                ]}
                results={[
                  { label: "Action", value: isComplete ? recommendation : '--' },
                  { label: "New Dose", value: isComplete ? `${newDoseRange} mg/week` : '--' }
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
              <ActivityIcon className="w-5 h-5" />
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
