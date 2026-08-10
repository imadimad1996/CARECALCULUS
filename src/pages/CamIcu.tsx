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
    title: "CAM-ICU",
    subtitle: "Confusion Assessment Method for the ICU",
    f1Title: "Feature 1: Acute Change or Fluctuating Course",
    f1Desc: "Is there an acute change from mental status baseline? OR Has the patient's mental status fluctuated during the past 24 hours?",
    f2Title: "Feature 2: Inattention",
    f2Desc: "Squeeze my hand when I say the letter 'A'. (SAVEAHAART). >2 Errors?",
    f3Title: "Feature 3: Altered Level of Consciousness",
    f3Desc: "Is current RASS anything other than 0 (Alert and Calm)?",
    f4Title: "Feature 4: Disorganized Thinking",
    f4Desc: "Questions & Commands (e.g., Will a stone float on water?). >1 Error?",
    yes: "Yes",
    no: "No",
    result: "CAM-ICU Result",
    formula: "Positive if: Feature 1 AND Feature 2 AND (Feature 3 OR Feature 4) are present.",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The CAM-ICU is a validated tool to assess for delirium in ICU patients, including those on mechanical ventilation.",
    pillarTitle: "Assessment Steps",
    pillarText: [
      "If Feature 1 is Absent, STOP. CAM-ICU is Negative (No Delirium).",
      "If Feature 2 is Absent, STOP. CAM-ICU is Negative (No Delirium).",
      "If Feature 3 is Present, CAM-ICU is Positive (Delirium). If Absent, proceed to Feature 4.",
      "If Feature 4 is Present, CAM-ICU is Positive (Delirium)."
    ],
    references: "Ely EW, et al. Evaluation of delirium in critically ill patients: validation of the Confusion Assessment Method for the Intensive Care Unit (CAM-ICU). Crit Care Med. 2001.",
    positive: "Positive (Delirium Present)",
    negative: "Negative (No Delirium)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Can CAM-ICU be used in intubated patients?",
    faqA1: "Yes, it relies on non-verbal responses like squeezing a hand or nodding.",
    faqQ2: "What if the patient is unarousable (RASS -4 or -5)?",
    faqA2: "Do not assess CAM-ICU if the patient is deeply sedated or unarousable. Wait until they are at RASS -3 or lighter.",
  },
  fr: {
    title: "CAM-ICU",
    subtitle: "Méthode d'évaluation de la confusion en réanimation",
    f1Title: "Critère 1 : Modification aiguë ou évolution fluctuante",
    f1Desc: "Y a-t-il un changement aigu de l'état mental de base ? OU L'état mental a-t-il fluctué au cours des dernières 24h ?",
    f2Title: "Critère 2 : Inattention",
    f2Desc: "Serrez ma main quand je dis 'A'. (SAVEAHAART). >2 erreurs ?",
    f3Title: "Critère 3 : Altération du niveau de conscience",
    f3Desc: "Le score RASS actuel est-il différent de 0 (Éveillé et Calme) ?",
    f4Title: "Critère 4 : Pensée désorganisée",
    f4Desc: "Questions & Ordres (ex: Une pierre flotte-t-elle sur l'eau ?). >1 erreur ?",
    yes: "Oui",
    no: "Non",
    result: "Résultat CAM-ICU",
    formula: "Positif si : Critère 1 ET Critère 2 ET (Critère 3 OU Critère 4).",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le CAM-ICU est un outil validé pour évaluer le délire chez les patients en réanimation, y compris sous ventilation mécanique.",
    pillarTitle: "Étapes d'Évaluation",
    pillarText: [
      "Si Critère 1 est Absent, ARRÊT. CAM-ICU Négatif (Pas de délire).",
      "Si Critère 2 est Absent, ARRÊT. CAM-ICU Négatif.",
      "Si Critère 3 est Présent, CAM-ICU Positif (Délire). Sinon, passez au Critère 4.",
      "Si Critère 4 est Présent, CAM-ICU Positif."
    ],
    references: "Ely EW, et al. Evaluation of delirium in critically ill patients. Crit Care Med. 2001.",
    positive: "Positif (Délire Présent)",
    negative: "Négatif (Pas de Délire)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Peut-on utiliser le CAM-ICU chez les patients intubés ?",
    faqA1: "Oui, il repose sur des réponses non verbales (serrer la main, hocher la tête).",
    faqQ2: "Et si le patient est inéveillable (RASS -4 ou -5) ?",
    faqA2: "Ne pas évaluer le CAM-ICU. Attendre que le patient soit à RASS -3 ou plus léger.",
  },
  es: {
    title: "CAM-ICU",
    subtitle: "Método de evaluación de confusión en UCI",
    f1Title: "Característica 1: Cambio Agudo o Fluctuante",
    f1Desc: "¿Hay un cambio agudo en el estado mental basal? O ¿Ha fluctuado el estado mental en las últimas 24 h?",
    f2Title: "Característica 2: Inatención",
    f2Desc: "Apriete mi mano cuando diga la letra 'A' (SAVEAHAART). ¿>2 Errores?",
    f3Title: "Característica 3: Nivel de Conciencia Alterado",
    f3Desc: "¿Es el RASS actual diferente de 0 (Alerta y Tranquilo)?",
    f4Title: "Característica 4: Pensamiento Desorganizado",
    f4Desc: "Preguntas y Órdenes (ej. ¿Una piedra flota en el agua?). ¿>1 Error?",
    yes: "Sí",
    no: "No",
    result: "Resultado CAM-ICU",
    formula: "Positivo si: C1 Y C2 Y (C3 O C4) están presentes.",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El CAM-ICU es una herramienta validada para evaluar el delirio en pacientes de UCI, incluso intubados.",
    pillarTitle: "Pasos de Evaluación",
    pillarText: [
      "Si la Característica 1 está Ausente, PARE. CAM-ICU es Negativo (Sin delirio).",
      "Si la Característica 2 está Ausente, PARE. CAM-ICU es Negativo.",
      "Si la Característica 3 está Presente, CAM-ICU es Positivo. Si no, pase a C4.",
      "Si la Característica 4 está Presente, CAM-ICU es Positivo."
    ],
    references: "Ely EW, et al. Evaluation of delirium in critically ill patients. Crit Care Med. 2001.",
    positive: "Positivo (Delirio Presente)",
    negative: "Negativo (Sin Delirio)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Se puede usar en pacientes intubados?",
    faqA1: "Sí, se basa en respuestas no verbales (apretar la mano, asentir).",
    faqQ2: "¿Qué hacer si el paciente está en coma (RASS -4 o -5)?",
    faqA2: "No evalúe el CAM-ICU. Espere a que el paciente despierte a RASS -3 o superior.",
  },
  ar: {
    title: "مقياس CAM-ICU",
    subtitle: "طريقة تقييم الارتباك في العناية المركزة",
    f1Title: "السمة 1: تغير حاد أو مسار متقلب",
    f1Desc: "هل يوجد تغير حاد عن الحالة العقلية الأساسية؟ أو هل تقلبت الحالة العقلية خلال الـ 24 ساعة الماضية؟",
    f2Title: "السمة 2: تشتت الانتباه",
    f2Desc: "اضغط على يدي عندما أقول حرف 'A' (اختبار الحروف). هل يوجد أكثر من خطأين؟",
    f3Title: "السمة 3: تغير مستوى الوعي",
    f3Desc: "هل مقياس RASS الحالي يختلف عن 0 (يقظ وهادئ)؟",
    f4Title: "السمة 4: تفكير غير منظم",
    f4Desc: "أسئلة وأوامر (مثال: هل يطفو الحجر على الماء؟). هل يوجد أكثر من خطأ واحد؟",
    yes: "نعم",
    no: "لا",
    result: "نتيجة CAM-ICU",
    formula: "إيجابي إذا: السمة 1 والسمة 2 و (السمة 3 أو السمة 4) موجودة.",
    clinicalTitle: "التفسير السريري",
    clinicalText: "أداة معتمدة لتقييم الهذيان لدى مرضى العناية المركزة، بما في ذلك الموصولين بجهاز التنفس الصناعي.",
    pillarTitle: "خطوات التقييم",
    pillarText: [
      "إذا غابت السمة 1، توقف. المقياس سلبي (لا يوجد هذيان).",
      "إذا غابت السمة 2، توقف. المقياس سلبي.",
      "إذا حضرت السمة 3، المقياس إيجابي (يوجد هذيان). إذا غابت، انتقل للسمة 4.",
      "إذا حضرت السمة 4، المقياس إيجابي."
    ],
    references: "Ely EW, et al. Evaluation of delirium in critically ill patients. Crit Care Med. 2001.",
    positive: "إيجابي (يوجد هذيان)",
    negative: "سلبي (لا يوجد هذيان)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يمكن استخدامه لمرضى التنفس الصناعي؟",
    faqA1: "نعم، يعتمد على استجابات غير لفظية مثل ضغط اليد أو الإيماء.",
    faqQ2: "ماذا لو كان المريض في غيبوبة (RASS -4 أو -5)؟",
    faqA2: "لا تقم بإجراء تقييم CAM-ICU. انتظر حتى يرتفع الوعي إلى -3 أو أعلى.",
  }
};

export default function CamIcu({ lang }: { lang: LangCode }) {
  const [f1, setF1] = useState<boolean | null>(null);
  const [f2, setF2] = useState<boolean | null>(null);
  const [f3, setF3] = useState<boolean | null>(null);
  const [f4, setF4] = useState<boolean | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isDelirium = f1 === true && f2 === true && (f3 === true || f4 === true);
  
  // Logic to determine if assessment is complete
  let isComplete = false;
  if (f1 === false) isComplete = true; // Negative
  else if (f1 === true && f2 === false) isComplete = true; // Negative
  else if (f1 === true && f2 === true && f3 === true) isComplete = true; // Positive
  else if (f1 === true && f2 === true && f3 === false && f4 !== null) isComplete = true; // Needs f4

  const category = isComplete 
    ? (isDelirium 
      ? { label: currentText.positive, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
      : { label: currentText.negative, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    ) 
    : { label: '--', color: 'text-gray-500', bg: 'bg-gray-100 border-gray-200' };

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('cam-icu', lang, isDelirium ? 1 : 0);
        trackCalculatorResult('cam-icu', isDelirium ? 1 : 0, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, isDelirium, lang, category.label]);

  const renderToggle = (
    title: string, 
    desc: string, 
    val: boolean | null, 
    setter: (v: boolean) => void,
    disabled: boolean = false
  ) => {
    return (
      <div className={`p-4 md:p-5 rounded-2xl border transition-all ${disabled ? 'opacity-40 grayscale pointer-events-none' : 'bg-white border-gray-200 shadow-sm hover:border-gray-300'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setter(true)}
              className={`flex-1 sm:w-20 py-2 text-sm font-bold rounded-lg transition-all ${val === true ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentText.yes}
            </button>
            <button
              onClick={() => setter(false)}
              className={`flex-1 sm:w-20 py-2 text-sm font-bold rounded-lg transition-all ${val === false ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {currentText.no}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const showF2 = f1 === true;
  const showF3 = f1 === true && f2 === true;
  const showF4 = f1 === true && f2 === true && f3 === false;

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="cam-icu" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-4">
              
              {renderToggle(currentText.f1Title, currentText.f1Desc, f1, setF1)}
              {renderToggle(currentText.f2Title, currentText.f2Desc, f2, setF2, !showF2)}
              {renderToggle(currentText.f3Title, currentText.f3Desc, f3, setF3, !showF3)}
              {renderToggle(currentText.f4Title, currentText.f4Desc, f4, setF4, !showF4)}

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
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-5 rounded-2xl border backdrop-blur-md flex justify-center items-center transition-all shadow-lg ${category.bg} ${category.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-currentColor animate-pulse" />
                    <span className="font-bold text-lg tracking-wide">
                      {category.label}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl border flex justify-center items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Complétez l\'évaluation' : lang === 'es' ? 'Complete la evaluación' : lang === 'ar' ? 'أكمل التقييم' : 'Complete the assessment'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "F1: Acute Change", value: f1 === null ? '--' : (f1 ? 'Yes' : 'No') },
                  { label: "F2: Inattention", value: f2 === null ? '--' : (f2 ? 'Yes' : 'No') },
                  { label: "F3: Altered LOC", value: f3 === null ? '--' : (f3 ? 'Yes' : 'No') },
                  { label: "F4: Disorganized Thinking", value: f4 === null ? '--' : (f4 ? 'Yes' : 'No') }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? category.label : '--' }
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
