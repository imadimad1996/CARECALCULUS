import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Droplet } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NURSING } from '../data/reviewers';
import { cn } from '../utils/cn';

const translations: Translations = {
  en: {
    title: "Insulin Sliding Scale",
    subtitle: "Standardized sliding scale insulin dosing based on blood glucose levels",
    bgLabel: "Blood Glucose",
    unitMgdl: "mg/dL",
    unitMmol: "mmol/L",
    regimen: "Dosing Regimen",
    lowDose: "Low Dose (Total daily < 40 U)",
    stdDose: "Standard Dose (Total daily 40-80 U)",
    highDose: "High Dose (Total daily > 80 U)",
    result: "Recommended Insulin Dose",
    formula: "Dose based on regimen and BG range",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Sliding scale insulin is used to correct hyperglycemia in hospitalized patients. It is typically given in addition to basal/bolus regimens. Hypoglycemia (<70 mg/dL) requires immediate treatment per protocol.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Low Dose: Usually for patients who are elderly, have renal failure, or are very insulin sensitive.",
      "Standard Dose: The most common starting point for most adult patients.",
      "High Dose: Usually for patients with severe insulin resistance, on high-dose steroids, or those requiring >80 units of insulin per day."
    ],
    references: "Umpierrez GE, et al. Management of Hyperglycemia in Hospitalized Patients in Non-Critical Care Setting: An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2012.",
    hypo: "Treat for Hypoglycemia!",
    none: "0 units (Target Range)",
    units: "units",
    callMd: "units (Call MD)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Is sliding scale insulin recommended as monotherapy?",
    faqA1: "No, sliding scale alone is strongly discouraged for long-term use. It should be used as correction insulin alongside basal and nutritional insulin.",
    faqQ2: "When should I notify the physician?",
    faqA2: "Generally, you should notify the physician if blood glucose is <70 mg/dL or persistently >350-400 mg/dL, according to hospital policy.",
  },
  fr: {
    title: "Échelle Mobile d'Insuline",
    subtitle: "Dosage standardisé de l'insuline selon la glycémie",
    bgLabel: "Glycémie",
    unitMgdl: "mg/dL",
    unitMmol: "mmol/L",
    regimen: "Régime Posologique",
    lowDose: "Dose Faible (< 40 U/jour)",
    stdDose: "Dose Standard (40-80 U/jour)",
    highDose: "Dose Élevée (> 80 U/jour)",
    result: "Dose d'Insuline Recommandée",
    formula: "Dose basée sur le régime et la glycémie",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "L'échelle mobile sert à corriger l'hyperglycémie. Elle est souvent ajoutée au schéma basal-bolus. L'hypoglycémie (<70 mg/dL) nécessite un traitement immédiat.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Dose Faible : Souvent pour les personnes âgées, en insuffisance rénale, ou très sensibles à l'insuline.",
      "Dose Standard : Point de départ pour la plupart des adultes.",
      "Dose Élevée : Pour les patients avec insulinorésistance sévère ou sous corticothérapie à forte dose."
    ],
    references: "Umpierrez GE, et al. Management of Hyperglycemia in Hospitalized Patients in Non-Critical Care Setting. J Clin Endocrinol Metab. 2012.",
    hypo: "Traiter pour Hypoglycémie !",
    none: "0 unités (Objectif)",
    units: "unités",
    callMd: "unités (Appeler Médecin)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "L'échelle mobile est-elle recommandée seule ?",
    faqA1: "Non, elle est déconseillée en monothérapie. Elle doit être utilisée comme insuline de correction avec une insuline basale.",
    faqQ2: "Quand appeler le médecin ?",
    faqA2: "Généralement pour une glycémie <70 mg/dL ou persistante >350 mg/dL.",
  },
  es: {
    title: "Escala Móvil de Insulina",
    subtitle: "Dosificación estandarizada de insulina según la glucemia",
    bgLabel: "Glucosa en Sangre",
    unitMgdl: "mg/dL",
    unitMmol: "mmol/L",
    regimen: "Régimen de Dosificación",
    lowDose: "Dosis Baja (< 40 U/día)",
    stdDose: "Dosis Estándar (40-80 U/día)",
    highDose: "Dosis Alta (> 80 U/día)",
    result: "Dosis de Insulina Recomendada",
    formula: "Dosis basada en el régimen y glucemia",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La escala móvil se usa para corregir la hiperglucemia. Por lo general, se administra además de la insulina basal. La hipoglucemia (<70 mg/dL) requiere tratamiento inmediato.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Dosis Baja: A menudo para ancianos, pacientes con insuficiencia renal o muy sensibles a la insulina.",
      "Dosis Estándar: Punto de partida común para la mayoría de los adultos.",
      "Dosis Alta: Para pacientes con resistencia severa a la insulina o en tratamiento con esteroides a altas dosis."
    ],
    references: "Umpierrez GE, et al. Management of Hyperglycemia in Hospitalized Patients in Non-Critical Care Setting. J Clin Endocrinol Metab. 2012.",
    hypo: "¡Tratar por Hipoglucemia!",
    none: "0 unidades (Rango Objetivo)",
    units: "unidades",
    callMd: "unidades (Llamar al MD)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Se recomienda la escala móvil como monoterapia?",
    faqA1: "No, se desaconseja fuertemente. Debe usarse como insulina de corrección junto con insulina basal y nutricional.",
    faqQ2: "¿Cuándo debo notificar al médico?",
    faqA2: "Generalmente, si la glucemia es <70 mg/dL o persistentemente >350 mg/dL.",
  },
  ar: {
    title: "مقياس الإنسولين المتدرج",
    subtitle: "تحديد جرعة الإنسولين بناءً على مستويات سكر الدم",
    bgLabel: "سكر الدم",
    unitMgdl: "ملغ/ديسيلتر",
    unitMmol: "ملمول/لتر",
    regimen: "نظام الجرعات",
    lowDose: "جرعة منخفضة (أقل من 40 وحدة يومياً)",
    stdDose: "جرعة قياسية (40-80 وحدة يومياً)",
    highDose: "جرعة عالية (أكثر من 80 وحدة يومياً)",
    result: "جرعة الإنسولين الموصى بها",
    formula: "الجرعة تعتمد على النظام ونسبة السكر",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يستخدم المقياس المتدرج لتصحيح ارتفاع سكر الدم. يجب معالجة نقص السكر (أقل من 70 ملغ/ديسيلتر) فوراً حسب البروتوكول.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "جرعة منخفضة: لكبار السن، مرضى الفشل الكلوي، أو ذوي الحساسية العالية للإنسولين.",
      "جرعة قياسية: نقطة البداية لمعظم المرضى البالغين.",
      "جرعة عالية: للمرضى الذين يعانون من مقاومة شديدة للإنسولين أو يستخدمون الكورتيزون بجرعات عالية."
    ],
    references: "Umpierrez GE, et al. Management of Hyperglycemia in Hospitalized Patients in Non-Critical Care Setting. J Clin Endocrinol Metab. 2012.",
    hypo: "عالج نقص السكر في الدم!",
    none: "0 وحدة (في النطاق المستهدف)",
    units: "وحدة",
    callMd: "وحدة (أبلغ الطبيب)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يُنصح باستخدام المقياس المتدرج كعلاج وحيد؟",
    faqA1: "لا، لا يُنصح به كعلاج وحيد. يجب استخدامه كإنسولين تصحيحي مع الإنسولين الأساسي.",
    faqQ2: "متى يجب إبلاغ الطبيب؟",
    faqA2: "بشكل عام، إذا كان السكر أقل من 70 أو أعلى من 350-400 بشكل مستمر.",
  }
};

type Regimen = 'low' | 'std' | 'high';
type Unit = 'mgdl' | 'mmol';

export default function InsulinSlidingScale({ lang }: { lang: LangCode }) {
  const [bg, setBg] = useState<string>('');
  const [unit, setUnit] = useState<Unit>('mgdl');
  const [regimen, setRegimen] = useState<Regimen>('std');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const calculateDose = () => {
    if (!bg || isNaN(parseFloat(bg))) return null;
    
    let bgVal = parseFloat(bg);
    if (unit === 'mmol') bgVal = bgVal * 18.0182; // Convert mmol/L to mg/dL

    if (bgVal < 70) return { dose: -1, text: currentText.hypo, isCall: false, color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (bgVal < 150) return { dose: 0, text: currentText.none, isCall: false, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
    
    let dose = 0;
    let isCall = false;

    if (bgVal >= 150 && bgVal <= 199) {
      if (regimen === 'low') dose = 1;
      else if (regimen === 'std') dose = 1;
      else if (regimen === 'high') dose = 2;
    } else if (bgVal >= 200 && bgVal <= 249) {
      if (regimen === 'low') dose = 2;
      else if (regimen === 'std') dose = 3;
      else if (regimen === 'high') dose = 4;
    } else if (bgVal >= 250 && bgVal <= 299) {
      if (regimen === 'low') dose = 3;
      else if (regimen === 'std') dose = 5;
      else if (regimen === 'high') dose = 7;
    } else if (bgVal >= 300 && bgVal <= 349) {
      if (regimen === 'low') dose = 4;
      else if (regimen === 'std') dose = 7;
      else if (regimen === 'high') dose = 10;
    } else {
      isCall = true;
      if (regimen === 'low') dose = 5;
      else if (regimen === 'std') dose = 8;
      else if (regimen === 'high') dose = 12;
    }

    return { 
      dose, 
      text: `${dose} ${isCall ? currentText.callMd : currentText.units}`, 
      isCall,
      color: isCall ? 'text-orange-600' : 'text-blue-600',
      bg: isCall ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'
    };
  };

  const result = calculateDose();

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('insulin-sliding-scale', lang, bg);
        trackCalculatorResult('insulin-sliding-scale', bg, result.text, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result?.text, bg, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="insulin-sliding-scale" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                  {currentText.bgLabel}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number" inputMode="decimal"
                      value={bg}
                      onChange={(e) => setBg(e.target.value)}
                      placeholder="e.g. 180"
                      className="block w-full rounded-2xl border-gray-200 bg-gray-50/50 py-4 px-5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex bg-gray-100 p-1 rounded-2xl shrink-0">
                    <button
                      onClick={() => setUnit('mgdl')}
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${unit === 'mgdl' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {currentText.unitMgdl}
                    </button>
                    <button
                      onClick={() => setUnit('mmol')}
                      className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${unit === 'mmol' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {currentText.unitMmol}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="flex items-center text-sm font-semibold text-gray-900">
                  {currentText.regimen}
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'low', label: currentText.lowDose },
                    { id: 'std', label: currentText.stdDose },
                    { id: 'high', label: currentText.highDose },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRegimen(r.id as Regimen)}
                      className={cn(
                        "text-left px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500",
                        regimen === r.id 
                          ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
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
                <Droplet className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {result ? (
                <div className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-center items-center text-center transition-all shadow-lg ${result.bg} ${result.color}`}>
                  {result.dose > 0 ? (
                    <>
                      <div className="text-6xl font-black mb-1 tabular-nums">{result.dose}</div>
                      <div className="font-bold text-sm tracking-wide uppercase opacity-80">{currentText.units}</div>
                      {result.isCall && <div className="mt-2 text-xs font-bold bg-white/50 px-3 py-1 rounded-full text-orange-700">CALL MD</div>}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 py-3">
                      <span className="font-bold text-lg tracking-wide">
                        {result.text}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl border flex justify-center items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md min-h-[120px]">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez la glycémie' : lang === 'es' ? 'Ingrese la glucemia' : lang === 'ar' ? 'أدخل مستوى السكر' : 'Enter blood glucose'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.bgLabel, value: bg ? `${bg} ${unit === 'mgdl' ? currentText.unitMgdl : currentText.unitMmol}` : '--' },
                  { label: currentText.regimen, value: currentText[regimen === 'low' ? 'lowDose' : regimen === 'std' ? 'stdDose' : 'highDose'] }
                ]}
                results={[
                  { label: currentText.result, value: result ? result.text : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_NURSING} lang={lang} />
      </div>
    </>
  );
}

