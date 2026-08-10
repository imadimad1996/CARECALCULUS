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
    title: "Morse Fall Scale (MFS)",
    subtitle: "Identify fall-prone patients in clinical settings",
    history: "History of falling",
    history0: "No (0)",
    history25: "Yes (25)",
    secondary: "Secondary diagnosis",
    secondary0: "No (0)",
    secondary15: "Yes (15)",
    aid: "Ambulatory aid",
    aid0: "None / Bedrest / Nurse assist (0)",
    aid15: "Crutches / Cane / Walker (15)",
    aid30: "Furniture (30)",
    iv: "IV / Heparin Lock",
    iv0: "No (0)",
    iv20: "Yes (20)",
    gait: "Gait",
    gait0: "Normal / Bedrest / Wheelchair (0)",
    gait10: "Weak (10)",
    gait20: "Impaired (20)",
    mental: "Mental status",
    mental0: "Oriented to own ability (0)",
    mental15: "Forgets limitations (15)",
    result: "Calculated MFS Score",
    formula: "MFS Score = Sum of 6 risk parameters",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Low Risk (0-24), Moderate Risk (25-44), High Risk (≥ 45).",
    pillarTitle: "Fall Risk Assessment",
    pillarText: [
      "The Morse Fall Scale (MFS) is a rapid and simple method of assessing a patient’s likelihood of falling. It is a standard component of nursing assessments upon admission, at shift changes, or post-fall.",
      "Patients identified as 'High Risk' require implementation of standard and high-risk fall precautions, including bed alarms, yellow fall-risk wristbands, and potentially a 1:1 sitter."
    ],
    references: "Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the fall-prone patient. Can J Aging. 1989.",
    high: "High Risk (≥ 45)",
    moderate: "Moderate Risk (25-44)",
    low: "Low Risk (< 25)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "What is the Morse Fall Scale?",
    faqA1: "The Morse Fall Scale is a systematic tool used to identify the fall risk status of hospitalized patients based on 6 easily identifiable variables.",
    faqQ2: "What is considered a high fall risk?",
    faqA2: "A score of 45 or higher designates a patient as 'High Risk' for falling.",
  },
  fr: {
    title: "Échelle de Chute de Morse (MFS)",
    subtitle: "Identifier les patients à risque de chute en milieu clinique",
    history: "Antécédents de chute",
    history0: "Non (0)",
    history25: "Oui (25)",
    secondary: "Diagnostic secondaire",
    secondary0: "Non (0)",
    secondary15: "Oui (15)",
    aid: "Aide à la marche",
    aid0: "Aucune / Alité / Aide soignant (0)",
    aid15: "Béquilles / Canne / Déambulateur (15)",
    aid30: "S'appuie sur les meubles (30)",
    iv: "Voie veineuse / Cathéter",
    iv0: "Non (0)",
    iv20: "Oui (20)",
    gait: "Démarche",
    gait0: "Normale / Alité / Fauteuil (0)",
    gait10: "Faible (10)",
    gait20: "Altérée (20)",
    mental: "État mental",
    mental0: "Orienté (0)",
    mental15: "Oublie ses limites (15)",
    result: "Score de Morse",
    formula: "Score MFS = Somme de 6 paramètres",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Risque Faible (0-24), Risque Modéré (25-44), Risque Élevé (≥ 45).",
    pillarTitle: "Évaluation du Risque de Chute",
    pillarText: [
      "L'échelle de chute de Morse (MFS) est une méthode rapide et simple pour évaluer la probabilité de chute d'un patient. C'est un élément standard des évaluations infirmières à l'admission et lors des changements d'équipe.",
      "Les patients identifiés à 'Risque Élevé' nécessitent la mise en place de précautions standards et spécifiques, incluant les alarmes de lit et une surveillance accrue."
    ],
    references: "Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the fall-prone patient. Can J Aging. 1989.",
    high: "Risque Élevé (≥ 45)",
    moderate: "Risque Modéré (25-44)",
    low: "Risque Faible (< 25)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Qu'est-ce que l'échelle de Morse ?",
    faqA1: "C'est un outil systématique utilisé pour identifier le risque de chute des patients hospitalisés, basé sur 6 variables simples.",
    faqQ2: "Qu'est-ce qui est considéré comme un haut risque ?",
    faqA2: "Un score de 45 ou plus désigne un patient comme étant à 'Risque Élevé' de faire une chute.",
  },
  es: {
    title: "Escala de Caídas de Morse (MFS)",
    subtitle: "Identificar pacientes con riesgo de caída en entornos clínicos",
    history: "Historial de caídas",
    history0: "No (0)",
    history25: "Sí (25)",
    secondary: "Diagnóstico secundario",
    secondary0: "No (0)",
    secondary15: "Sí (15)",
    aid: "Ayuda ambulatoria",
    aid0: "Ninguna / En cama / Asistencia (0)",
    aid15: "Muletas / Bastón / Andador (15)",
    aid30: "Muebles (30)",
    iv: "Vía intravenosa / Vía heparinizada",
    iv0: "No (0)",
    iv20: "Sí (20)",
    gait: "Marcha",
    gait0: "Normal / En cama / Silla de ruedas (0)",
    gait10: "Débil (10)",
    gait20: "Alterada (20)",
    mental: "Estado mental",
    mental0: "Orientado respecto a su capacidad (0)",
    mental15: "Olvida sus limitaciones (15)",
    result: "Puntuación de Morse",
    formula: "Puntuación = Suma de 6 parámetros",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Riesgo Bajo (0-24), Riesgo Moderado (25-44), Riesgo Alto (≥ 45).",
    pillarTitle: "Evaluación del Riesgo de Caída",
    pillarText: [
      "La Escala de Caídas de Morse es un método rápido y sencillo para evaluar la probabilidad de que un paciente sufra una caída. Es un componente estándar en las evaluaciones de enfermería.",
      "Los pacientes con 'Riesgo Alto' requieren intervenciones preventivas adicionales, como alarmas de cama y supervisión constante."
    ],
    references: "Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the fall-prone patient. Can J Aging. 1989.",
    high: "Riesgo Alto (≥ 45)",
    moderate: "Riesgo Moderado (25-44)",
    low: "Riesgo Bajo (< 25)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Qué es la Escala de Morse?",
    faqA1: "Es una herramienta sistemática utilizada para identificar el riesgo de caída en pacientes hospitalizados.",
    faqQ2: "¿Qué se considera un alto riesgo de caída?",
    faqA2: "Una puntuación de 45 o más designa a un paciente con 'Riesgo Alto' de sufrir una caída.",
  },
  ar: {
    title: "مقياس مورس للسقوط",
    subtitle: "تحديد المرضى المعرضين لخطر السقوط في الإعدادات السريرية",
    history: "تاريخ السقوط",
    history0: "لا (0)",
    history25: "نعم (25)",
    secondary: "تشخيص ثانوي",
    secondary0: "لا (0)",
    secondary15: "نعم (15)",
    aid: "أداة مساعدة للمشي",
    aid0: "لا شيء / طريح الفراش (0)",
    aid15: "عكاز / عصا / مشاية (15)",
    aid30: "الاستناد على الأثاث (30)",
    iv: "مغذي وريدي",
    iv0: "لا (0)",
    iv20: "نعم (20)",
    gait: "طريقة المشي",
    gait0: "طبيعية / كرسي متحرك (0)",
    gait10: "ضعيفة (10)",
    gait20: "مختلة (20)",
    mental: "الحالة العقلية",
    mental0: "مدرك لقدراته (0)",
    mental15: "ينسى حدوده (15)",
    result: "درجة مقياس مورس",
    formula: "مجموع 6 معايير لتقييم خطر السقوط",
    clinicalTitle: "التفسير السريري",
    clinicalText: "خطر منخفض (0-24)، خطر متوسط (25-44)، خطر مرتفع (≥ 45).",
    pillarTitle: "تقييم خطر السقوط",
    pillarText: [
      "يعد مقياس مورس للسقوط طريقة سريعة وبسيطة لتقييم احتمالية سقوط المريض. وهو جزء أساسي من التقييم التمريضي.",
      "يحتاج المرضى المصنفون بـ 'خطر مرتفع' إلى تطبيق احتياطات مشددة لتجنب السقوط."
    ],
    references: "Morse JM, Morse RM, Tylko SJ. Development of a scale to identify the fall-prone patient. Can J Aging. 1989.",
    high: "خطر مرتفع (≥ 45)",
    moderate: "خطر متوسط (25-44)",
    low: "خطر منخفض (< 25)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "ما هو مقياس مورس؟",
    faqA1: "هو أداة منهجية تُستخدم لتحديد خطر السقوط لدى المرضى المنومين بناءً على 6 متغيرات بسيطة.",
    faqQ2: "متى يعتبر خطر السقوط مرتفعاً؟",
    faqA2: "درجة 45 فما فوق تصنف المريض على أنه ذو 'خطر مرتفع' للسقوط.",
  }
};

export default function MorseFallScale({ lang }: { lang: LangCode }) {
  const [history, setHistory] = useState<number | null>(null);
  const [secondary, setSecondary] = useState<number | null>(null);
  const [aid, setAid] = useState<number | null>(null);
  const [iv, setIv] = useState<number | null>(null);
  const [gait, setGait] = useState<number | null>(null);
  const [mental, setMental] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = history !== null && secondary !== null && aid !== null && iv !== null && gait !== null && mental !== null;
  const totalScore = isComplete ? (history! + secondary! + aid! + iv! + gait! + mental!) : 0;

  const getCategory = (val: number) => {
    if (val >= 45) return { label: currentText.high, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val >= 25) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.low, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(totalScore);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('morse-fall-scale', lang, totalScore);
        trackCalculatorResult('morse-fall-scale', totalScore, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, totalScore, lang, category.label]);

  const renderOption = (type: string, val: number, currentVal: number | null, setter: (v: number) => void) => {
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
          <EmbedCodeButton calculatorSlug="morse-fall-scale" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.history}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[0, 25].map((val) => renderOption('history', val, history, setHistory))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.secondary}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[0, 15].map((val) => renderOption('secondary', val, secondary, setSecondary))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.aid}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 15, 30].map((val) => renderOption('aid', val, aid, setAid))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.iv}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[0, 20].map((val) => renderOption('iv', val, iv, setIv))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.gait}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {[0, 10, 20].map((val) => renderOption('gait', val, gait, setGait))}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.mental}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {[0, 15].map((val) => renderOption('mental', val, mental, setMental))}
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
                  {isComplete ? totalScore : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">/ 125</span>
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
                  { label: currentText.history, value: history !== null ? currentText[`history${history}` as keyof typeof currentText] as string : '--' },
                  { label: currentText.secondary, value: secondary !== null ? currentText[`secondary${secondary}` as keyof typeof currentText] as string : '--' },
                  { label: currentText.aid, value: aid !== null ? currentText[`aid${aid}` as keyof typeof currentText] as string : '--' },
                  { label: currentText.iv, value: iv !== null ? currentText[`iv${iv}` as keyof typeof currentText] as string : '--' },
                  { label: currentText.gait, value: gait !== null ? currentText[`gait${gait}` as keyof typeof currentText] as string : '--' },
                  { label: currentText.mental, value: mental !== null ? currentText[`mental${mental}` as keyof typeof currentText] as string : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${totalScore} / 125` : '-- / 125' },
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
