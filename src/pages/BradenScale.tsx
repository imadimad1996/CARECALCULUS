import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NURSING } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Braden Scale",
    subtitle: "Predict pressure ulcer (bedsore) risk in adult patients",
    sensory: "Sensory Perception",
    sensory4: "4 - No Impairment",
    sensory3: "3 - Slightly Limited",
    sensory2: "2 - Very Limited",
    sensory1: "1 - Completely Limited",
    moisture: "Moisture",
    moisture4: "4 - Rarely Moist",
    moisture3: "3 - Occasionally Moist",
    moisture2: "2 - Often Moist",
    moisture1: "1 - Constantly Moist",
    activity: "Activity",
    activity4: "4 - Walks Frequently",
    activity3: "3 - Walks Occasionally",
    activity2: "2 - Chairfast",
    activity1: "1 - Bedfast",
    mobility: "Mobility",
    mobility4: "4 - No Limitations",
    mobility3: "3 - Slightly Limited",
    mobility2: "2 - Very Limited",
    mobility1: "1 - Completely Immobile",
    nutrition: "Nutrition",
    nutrition4: "4 - Excellent",
    nutrition3: "3 - Adequate",
    nutrition2: "2 - Probably Inadequate",
    nutrition1: "1 - Very Poor",
    friction: "Friction and Shear",
    friction3: "3 - No Apparent Problem",
    friction2: "2 - Potential Problem",
    friction1: "1 - Problem",
    result: "Calculated Braden Score",
    formula: "Braden Score = Sum of 6 subscales",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Severe Risk (≤ 9), High Risk (10-12), Moderate Risk (13-14), Mild Risk (15-18).",
    pillarTitle: "Pressure Ulcer Risk Assessment",
    pillarText: [
      "The Braden Scale is widely used in nursing to assess a patient's risk of developing pressure ulcers. It evaluates six factors: sensory perception, moisture, activity, mobility, nutrition, and friction/shear.",
      "Lower scores indicate a higher risk of pressure ulcer development, prompting targeted interventions like frequent repositioning, specialized mattresses, and nutritional support."
    ],
    references: "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.",
    severe: "Severe Risk (≤ 9)",
    high: "High Risk (10-12)",
    moderate: "Moderate Risk (13-14)",
    mild: "Mild Risk (15-18)",
    noRisk: "No Risk (> 18)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "What is the Braden Scale?",
    faqA1: "The Braden Scale is a risk assessment tool used by nurses to determine a patient's likelihood of developing a pressure ulcer (bedsore).",
    faqQ2: "What does a low score mean?",
    faqA2: "A low score (9 or below) indicates a severe risk of developing pressure ulcers, requiring immediate and aggressive preventive measures.",
  },
  fr: {
    title: "Échelle de Braden",
    subtitle: "Prédire le risque d'escarres chez les patients adultes",
    sensory: "Perception Sensorielle",
    sensory4: "4 - Aucune Altération",
    sensory3: "3 - Légèrement Limitée",
    sensory2: "2 - Très Limitée",
    sensory1: "1 - Complètement Limitée",
    moisture: "Humidité",
    moisture4: "4 - Rarement Humide",
    moisture3: "3 - Occasionnellement Humide",
    moisture2: "2 - Souvent Humide",
    moisture1: "1 - Constamment Humide",
    activity: "Activité",
    activity4: "4 - Marche Fréquemment",
    activity3: "3 - Marche Occasionnellement",
    activity2: "2 - Au Fauteuil",
    activity1: "1 - Au Lit",
    mobility: "Mobilité",
    mobility4: "4 - Aucune Limitation",
    mobility3: "3 - Légèrement Limitée",
    mobility2: "2 - Très Limitée",
    mobility1: "1 - Complètement Immobile",
    nutrition: "Nutrition",
    nutrition4: "4 - Excellente",
    nutrition3: "3 - Adéquate",
    nutrition2: "2 - Probablement Inadéquate",
    nutrition1: "1 - Très Mauvaise",
    friction: "Friction et Cisaillement",
    friction3: "3 - Aucun Problème Apparent",
    friction2: "2 - Problème Potentiel",
    friction1: "1 - Problème",
    result: "Score de Braden Calculé",
    formula: "Score de Braden = Somme de 6 sous-échelles",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Risque Sévère (≤ 9), Risque Élevé (10-12), Risque Modéré (13-14), Risque Faible (15-18).",
    pillarTitle: "Évaluation du Risque d'Escarre",
    pillarText: [
      "L'échelle de Braden est largement utilisée en soins infirmiers pour évaluer le risque de développer des escarres. Elle évalue six facteurs : la perception sensorielle, l'humidité, l'activité, la mobilité, la nutrition et la friction/cisaillement.",
      "Des scores plus bas indiquent un risque plus élevé de développer des escarres, justifiant des interventions préventives ciblées."
    ],
    references: "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.",
    severe: "Risque Sévère (≤ 9)",
    high: "Risque Élevé (10-12)",
    moderate: "Risque Modéré (13-14)",
    mild: "Risque Faible (15-18)",
    noRisk: "Aucun Risque (> 18)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Qu'est-ce que l'échelle de Braden ?",
    faqA1: "L'échelle de Braden est un outil d'évaluation du risque utilisé par le personnel soignant pour déterminer la probabilité qu'un patient développe une escarre.",
    faqQ2: "Que signifie un score bas ?",
    faqA2: "Un score bas (9 ou moins) indique un risque sévère, nécessitant des mesures préventives immédiates et intensives.",
  },
  es: {
    title: "Escala de Braden",
    subtitle: "Predecir el riesgo de úlceras por presión en pacientes adultos",
    sensory: "Percepción Sensorial",
    sensory4: "4 - Sin Deterioro",
    sensory3: "3 - Ligeramente Limitada",
    sensory2: "2 - Muy Limitada",
    sensory1: "1 - Completamente Limitada",
    moisture: "Humedad",
    moisture4: "4 - Rara vez Húmedo",
    moisture3: "3 - Ocasionalmente Húmedo",
    moisture2: "2 - A menudo Húmedo",
    moisture1: "1 - Constantemente Húmedo",
    activity: "Actividad",
    activity4: "4 - Camina Frecuentemente",
    activity3: "3 - Camina Ocasionalmente",
    activity2: "2 - En Silla",
    activity1: "1 - En Cama",
    mobility: "Movilidad",
    mobility4: "4 - Sin Limitaciones",
    mobility3: "3 - Ligeramente Limitada",
    mobility2: "2 - Muy Limitada",
    mobility1: "1 - Completamente Inmóvil",
    nutrition: "Nutrición",
    nutrition4: "4 - Excelente",
    nutrition3: "3 - Adecuada",
    nutrition2: "2 - Probablemente Inadecuada",
    nutrition1: "1 - Muy Pobre",
    friction: "Fricción y Cizallamiento",
    friction3: "3 - Sin Problema Aparente",
    friction2: "2 - Problema Potencial",
    friction1: "1 - Problema",
    result: "Puntuación de Braden",
    formula: "Puntuación de Braden = Suma de 6 subescalas",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Riesgo Severo (≤ 9), Riesgo Alto (10-12), Riesgo Moderado (13-14), Riesgo Leve (15-18).",
    pillarTitle: "Evaluación del Riesgo de Úlcera por Presión",
    pillarText: [
      "La escala de Braden es ampliamente utilizada en enfermería para evaluar el riesgo de un paciente de desarrollar úlceras por presión. Evalúa seis factores: percepción sensorial, humedad, actividad, movilidad, nutrición y fricción/cizallamiento.",
      "Puntuaciones más bajas indican un mayor riesgo de desarrollar úlceras por presión, lo que requiere intervenciones preventivas."
    ],
    references: "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.",
    severe: "Riesgo Severo (≤ 9)",
    high: "Riesgo Alto (10-12)",
    moderate: "Riesgo Moderado (13-14)",
    mild: "Riesgo Leve (15-18)",
    noRisk: "Sin Riesgo (> 18)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Qué es la Escala de Braden?",
    faqA1: "La Escala de Braden es una herramienta de evaluación de riesgos utilizada por las enfermeras para determinar la probabilidad de que un paciente desarrolle una úlcera por presión.",
    faqQ2: "¿Qué significa una puntuación baja?",
    faqA2: "Una puntuación baja (9 o menos) indica un riesgo severo, requiriendo medidas preventivas inmediatas e intensivas.",
  },
  ar: {
    title: "مقياس برادن",
    subtitle: "توقع خطر الإصابة بقرحة الفراش لدى المرضى البالغين",
    sensory: "الإدراك الحسي",
    sensory4: "4 - لا يوجد ضعف",
    sensory3: "3 - محدود قليلاً",
    sensory2: "2 - محدود جداً",
    sensory1: "1 - محدود تماماً",
    moisture: "الرطوبة",
    moisture4: "4 - نادراً ما يكون رطباً",
    moisture3: "3 - رطب أحياناً",
    moisture2: "2 - رطب غالباً",
    moisture1: "1 - رطب باستمرار",
    activity: "النشاط",
    activity4: "4 - يمشي بشكل متكرر",
    activity3: "3 - يمشي أحياناً",
    activity2: "2 - جليس الكرسي",
    activity1: "1 - طريح الفراش",
    mobility: "الحركة",
    mobility4: "4 - لا توجد قيود",
    mobility3: "3 - محدودة قليلاً",
    mobility2: "2 - محدودة جداً",
    mobility1: "1 - غير قادر على الحركة تماماً",
    nutrition: "التغذية",
    nutrition4: "4 - ممتازة",
    nutrition3: "3 - كافية",
    nutrition2: "2 - ربما غير كافية",
    nutrition1: "1 - ضعيفة جداً",
    friction: "الاحتكاك والقص",
    friction3: "3 - لا توجد مشكلة ظاهرة",
    friction2: "2 - مشكلة محتملة",
    friction1: "1 - مشكلة",
    result: "درجة برادن المحسوبة",
    formula: "درجة برادن = مجموع 6 مقاييس فرعية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "خطر شديد (≤ 9)، خطر مرتفع (10-12)، خطر متوسط (13-14)، خطر خفيف (15-18).",
    pillarTitle: "تقييم خطر قرحة الفراش",
    pillarText: [
      "يستخدم مقياس برادن على نطاق واسع في التمريض لتقييم خطر إصابة المريض بقرحة الفراش. وهو يقيم ستة عوامل: الإدراك الحسي، والرطوبة، والنشاط، والحركة، والتغذية، والاحتكاك.",
      "الدرجات المنخفضة تشير إلى خطر أكبر لتطور قرحة الفراش، مما يتطلب تدخلات وقائية موجهة."
    ],
    references: "Bergstrom N, Braden BJ, Laguzza A, Holman V. The Braden Scale for Predicting Pressure Sore Risk. Nurs Res. 1987;36(4):205-210.",
    severe: "خطر شديد (≤ 9)",
    high: "خطر مرتفع (10-12)",
    moderate: "خطر متوسط (13-14)",
    mild: "خطر خفيف (15-18)",
    noRisk: "لا يوجد خطر (> 18)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "ما هو مقياس برادن؟",
    faqA1: "مقياس برادن هو أداة لتقييم المخاطر يستخدمها الممرضون لتحديد احتمالية إصابة المريض بقرحة الفراش.",
    faqQ2: "ماذا تعني الدرجة المنخفضة؟",
    faqA2: "تشير الدرجة المنخفضة (9 أو أقل) إلى خطر شديد للإصابة، مما يتطلب تدابير وقائية فورية.",
  }
};

export default function BradenScale({ lang }: { lang: LangCode }) {
  const [sensory, setSensory] = useState<number>(0);
  const [moisture, setMoisture] = useState<number>(0);
  const [activity, setActivity] = useState<number>(0);
  const [mobility, setMobility] = useState<number>(0);
  const [nutrition, setNutrition] = useState<number>(0);
  const [friction, setFriction] = useState<number>(0);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = sensory > 0 && moisture > 0 && activity > 0 && mobility > 0 && nutrition > 0 && friction > 0;
  const bradenScore = isComplete ? sensory + moisture + activity + mobility + nutrition + friction : 0;

  const getBradenCategory = (val: number) => {
    if (val <= 9) return { label: currentText.severe, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val <= 12) return { label: currentText.high, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
    if (val <= 14) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (val <= 18) return { label: currentText.mild, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    return { label: currentText.noRisk, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getBradenCategory(bradenScore);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('braden-scale', lang, bradenScore);
        trackCalculatorResult('braden-scale', bradenScore, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, bradenScore, lang, category.label]);
  
  const renderOption = (type: string, val: number, currentVal: number, setter: (v: number) => void) => {
    return (
      <button
        key={`${type}-${val}`}
        onClick={() => setter(val)}
        className={`text-left px-5 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${currentVal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
        style={{ minHeight: '48px' }}
      >
        {currentText[`${type}${val}` as keyof typeof currentText]}
      </button>
    );
  };

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      {/* Ambient 2026 Page Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="braden-scale" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>

        <div className="backdrop-blur-md bg-blue-50/70 border border-blue-200/60 shadow-sm rounded-2xl p-5 mt-6 mb-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xs font-bold text-blue-900 uppercase tracking-widest">
              {lang === 'fr' ? 'Définition Clinique' : lang === 'es' ? 'Definición Clínica' : lang === 'ar' ? 'التعريف السريري' : 'Clinical Definition'}
            </h2>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {currentText.faqA1}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.sensory}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[4, 3, 2, 1].map((val) => renderOption('sensory', val, sensory, setSensory))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.moisture}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[4, 3, 2, 1].map((val) => renderOption('moisture', val, moisture, setMoisture))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.activity}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[4, 3, 2, 1].map((val) => renderOption('activity', val, activity, setActivity))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.mobility}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[4, 3, 2, 1].map((val) => renderOption('mobility', val, mobility, setMobility))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.nutrition}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[4, 3, 2, 1].map((val) => renderOption('nutrition', val, nutrition, setNutrition))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.friction}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[3, 2, 1].map((val) => renderOption('friction', val, friction, setFriction))}
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
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-8xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? bradenScore : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">/ 23</span>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md flex justify-between items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">
                      {category.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Sélectionnez les critères' : lang === 'es' ? 'Seleccionar criterios' : lang === 'ar' ? 'حدد المعايير' : 'Select criteria to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.sensory, value: sensory > 0 ? `${sensory} - ${currentText[`sensory${sensory}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.moisture, value: moisture > 0 ? `${moisture} - ${currentText[`moisture${moisture}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.activity, value: activity > 0 ? `${activity} - ${currentText[`activity${activity}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.mobility, value: mobility > 0 ? `${mobility} - ${currentText[`mobility${mobility}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.nutrition, value: nutrition > 0 ? `${nutrition} - ${currentText[`nutrition${nutrition}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.friction, value: friction > 0 ? `${friction} - ${currentText[`friction${friction}` as keyof typeof currentText]}` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${bradenScore} / 23` : '-- / 23' },
                  { label: 'Risk Level', value: isComplete ? category.label : '--' }
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
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
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
      
      {/* Pillar Content Section */}
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

      {/* E-E-A-T Trust Signal — Physician Reviewer Card */}
      <div className="mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <MedicalReviewerCard reviewer={REVIEWER_NURSING} lang={lang} />
      </div>
    </>
  );
}
