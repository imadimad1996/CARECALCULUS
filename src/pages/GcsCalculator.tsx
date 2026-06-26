import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "Glasgow Coma Scale (GCS)",
    subtitle: "Assess the level of consciousness after traumatic brain injury",
    eye: "Eye Opening Response",
    eye4: "4 - Spontaneous",
    eye3: "3 - To Voice",
    eye2: "2 - To Pain",
    eye1: "1 - None",
    verbal: "Verbal Response",
    verbal5: "5 - Orientated",
    verbal4: "4 - Confused",
    verbal3: "3 - Inappropriate Words",
    verbal2: "2 - Incomprehensible Sounds",
    verbal1: "1 - None",
    motor: "Motor Response",
    motor6: "6 - Obeys Commands",
    motor5: "5 - Localizes to Pain",
    motor4: "4 - Withdraws from Pain",
    motor3: "3 - Flexion to Pain (Decorticate)",
    motor2: "2 - Extension to Pain (Decerebrate)",
    motor1: "1 - None",
    result: "Calculated GCS",
    formula: "GCS = Eye + Verbal + Motor",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Severe (GCS ≤ 8), Moderate (GCS 9-12), Minor (GCS ≥ 13). Intubation is generally recommended for GCS ≤ 8.",
    references: "References: Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Severe Brain Injury (≤8)",
    moderate: "Moderate Brain Injury (9-12)",
    minor: "Minor Brain Injury (13-15)",
    faqQ1: "What is the Glasgow Coma Scale (GCS)?",
    faqA1: "The Glasgow Coma Scale (GCS) is a standardized neurological assessment tool that measures level of consciousness by scoring three components: Eye Opening (E, 1-4), Verbal Response (V, 1-5), and Motor Response (M, 1-6). Total score ranges from 3 to 15.",
    faqQ2: "What GCS score indicates severe brain injury?",
    faqA2: "A GCS score of 8 or below indicates severe brain injury. A score of 9-12 indicates moderate injury, and 13-15 indicates mild injury. Patients with GCS ≤ 8 are generally considered for intubation to protect the airway.",
    faqQ3: "Who developed the Glasgow Coma Scale?",
    faqA3: "The GCS was developed by Teasdale and Jennett in 1974 at the University of Glasgow, published in The Lancet. It has since become the global standard for consciousness assessment after traumatic brain injury.",
    faqQ4: "Can GCS be used in children?",
    faqA4: "The standard GCS is validated for adults and older children. For infants and young children, a modified Pediatric GCS is preferred, which adapts verbal and motor components to age-appropriate responses.",
  },
  fr: {
    title: "Score de Glasgow (GCS)",
    subtitle: "Évaluer le niveau de conscience après un traumatisme crânien",
    eye: "Ouverture des Yeux",
    eye4: "4 - Spontanée",
    eye3: "3 - À la parole",
    eye2: "2 - À la douleur",
    eye1: "1 - Aucune",
    verbal: "Réponse Verbale",
    verbal5: "5 - Orientée",
    verbal4: "4 - Confuse",
    verbal3: "3 - Mots inappropriés",
    verbal2: "2 - Sons incompréhensibles",
    verbal1: "1 - Aucune",
    motor: "Réponse Motrice",
    motor6: "6 - Obéit aux ordres",
    motor5: "5 - Orientée à la douleur",
    motor4: "4 - Évitement de la douleur",
    motor3: "3 - Décortication (Flexion)",
    motor2: "2 - Décérébration (Extension)",
    motor1: "1 - Aucune",
    result: "Score GCS Calculé",
    formula: "GCS = Yeux + Verbe + Moteur",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Sévère (GCS ≤ 8), Modéré (GCS 9-12), Mineur (GCS ≥ 13). L'intubation est généralement recommandée pour GCS ≤ 8.",
    references: "Références : Teasdale G, Jennett B. Assessment of coma and impaired consciousness.",
    severe: "Lésion cérébrale sévère (≤8)",
    moderate: "Lésion cérébrale modérée (9-12)",
    minor: "Lésion cérébrale mineure (13-15)",
    faqQ1: "Qu'est-ce que l'échelle de Glasgow (GCS) ?",
    faqA1: "L'échelle de Glasgow (GCS) est un outil d'évaluation neurologique standardisé mesurant l'état de conscience d'un patient à l'aide de trois critères : ouverture des yeux (E, 1-4), réponse verbale (V, 1-5) et réponse motrice (M, 1-6). Le score total varie de 3 à 15.",
    faqQ2: "Quel score GCS indique un traumatisme crânien sévère ?",
    faqA2: "Un score GCS inférieur ou égal à 8 indique un traumatisme crânien sévère. Un score de 9 à 12 indique un traumatisme modéré et un score de 13 à 15 indique un traumatisme léger. Une intubation protectrice est généralement recommandée pour un GCS ≤ 8.",
    faqQ3: "Qui a développé l'échelle de Glasgow ?",
    faqA3: "L'échelle GCS a été développée en 1974 par Graham Teasdale et Bryan Jennett à l'Université de Glasgow, et publiée dans The Lancet. Elle est depuis devenue la référence mondiale d'évaluation après traumatisme crânien.",
    faqQ4: "L'échelle GCS peut-elle être utilisée chez l'enfant ?",
    faqA4: "L'échelle GCS standard est validée pour l'adulte et l'enfant grand. Pour les nourrissons et jeunes enfants, on utilise l'échelle de Glasgow pédiatrique modifiée, adaptant les critères de réponses verbales et motrices à l'âge.",
  },
  ar: {
    title: "مقياس غلاسكو للغيبوبة (GCS)",
    subtitle: "تقييم مستوى الوعي بعد إصابات الدماغ الرضحية",
    eye: "استجابة فتح العين",
    eye4: "4 - تلقائي",
    eye3: "3 - للصوت",
    eye2: "2 - للألم",
    eye1: "1 - لا توجد",
    verbal: "الاستجابة اللفظية",
    verbal5: "5 - موجه (طبيعي)",
    verbal4: "4 - مشوش",
    verbal3: "3 - كلمات غير مناسبة",
    verbal2: "2 - أصوات غير مفهومة",
    verbal1: "1 - لا توجد",
    motor: "الاستجابة الحركية",
    motor6: "6 - يطيع الأوامر",
    motor5: "5 - يحدد مكان الألم",
    motor4: "4 - ينسحب من الألم",
    motor3: "3 - انثناء غير طبيعي للألم",
    motor2: "2 - امتداد غير طبيعي للألم",
    motor1: "1 - لا توجد",
    result: "نقطة GCS المحسوبة",
    formula: "استجابة العين + اللفظية + الحركية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "شديد (GCS ≤ 8), متوسط (GCS 9-12), طفيف (GCS ≥ 13). يوصى بالتنبيب عادة لـ GCS ≤ 8.",
    references: "المراجع: Teasdale G, Jennett B. تقييم الغيبوبة وضعف الوعي.",
    severe: "إصابة شديدة (≤8)",
    moderate: "إصابة متوسطة (9-12)",
    minor: "إصابة طفيفة (13-15)",
    faqQ1: "ما هو مقياس غلاسكو للغيبوبة (GCS)؟",
    faqA1: "مقياس غلاسكو للغيبوبة (GCS) هو أداة تقييم عصبي معيارية تُستخدم لقياس مستوى وعي المريض بناءً على ثلاثة استجابات: فتح العين (1-4)، الاستجابة اللفظية (1-5)، والاستجابة الحركية (1-6). يتراوح المجموع من 3 إلى 15.",
    faqQ2: "ما هي درجة GCS التي تشير إلى إصابة شديدة في الدماغ؟",
    faqA2: "تشير النتيجة 8 أو أقل إلى إصابة شديدة في الدماغ. النتيجة من 9-12 تشير إلى إصابة متوسطة، ومن 13-15 تشير إلى إصابة طفيفة. ويُنصح عادة بالتنبيب وحماية المجرى التنفسي للمريض عندما تكون النتيجة 8 أو أقل.",
    faqQ3: "من الذي طور مقياس غلاسكو للغيبوبة؟",
    faqA3: "تم تطوير مقياس GCS بواسطة جراهام تيسديل وبريان جينيت عام 1974 في جامعة غلاسكو، ونُشر في مجلة ذا لانسيت. ومنذ ذلك الحين أصبح المعيار العالمي لتقييم الوعي بعد إصابات الدماغ.",
    faqQ4: "هل يمكن استخدام مقياس غلاسكو للأطفال؟",
    faqA4: "المقياس القياسي مخصص للبالغين والأطفال الأكبر سناً. أما بالنسبة للرضع والأطفال الصغار، فيُفضّل استخدام مقياس غلاسكو المعدل للأطفال (Pediatric GCS) الذي يوائم الاستجابات اللفظية والحركية مع مرحلتهم العمرية.",
  }
};

export default function GcsCalculator({ lang }: { lang: LangCode }) {
  const [eye, setEye] = useState<number>(0);
  const [verbal, setVerbal] = useState<number>(0);
  const [motor, setMotor] = useState<number>(0);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const isComplete = eye > 0 && verbal > 0 && motor > 0;
  const gcsValue = isComplete ? eye + verbal + motor : 0;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('glasgow-coma-scale', lang, gcsValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, gcsValue, lang]);


  const getGcsCategory = (val: number) => {
    if (val <= 8) return { label: currentText.severe, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val <= 12) return { label: currentText.moderate, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.minor, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getGcsCategory(gcsValue);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="glasgow-coma-scale" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">{currentText.eye}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[4, 3, 2, 1].map((val) => (
                    <button
                      key={`eye-${val}`}
                      onClick={() => setEye(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${eye === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`eye${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.verbal}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`verbal-${val}`}
                      onClick={() => setVerbal(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${verbal === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`verbal${val}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3 mt-4">{currentText.motor}</label>
                <div className="grid grid-cols-1 gap-2">
                  {[6, 5, 4, 3, 2, 1].map((val) => (
                    <button
                      key={`motor-${val}`}
                      onClick={() => setMotor(val)}
                      className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${motor === val ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'}`}
                      style={{ minHeight: '44px' }}
                    >
                      {currentText[`motor${val}`]}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {isComplete ? gcsValue : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 15</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              {isComplete ? (
                <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                  <div className="font-semibold text-sm">
                    {category.label}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700 text-gray-400">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Sélectionnez les critères pour le résultat' : lang === 'ar' ? 'يرجى تحديد المعايير للنتيجة' : 'Select criteria to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.eye, value: eye > 0 ? `${eye} - ${currentText[`eye${eye}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.verbal, value: verbal > 0 ? `${verbal} - ${currentText[`verbal${verbal}` as keyof typeof currentText]}` : '--' },
                  { label: currentText.motor, value: motor > 0 ? `${motor} - ${currentText[`motor${motor}` as keyof typeof currentText]}` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${gcsValue} / 15` : '-- / 15' },
                  { label: 'Severity Score', value: isComplete ? category.label : '--' }
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

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
              <a href="https://pubmed.ncbi.nlm.nih.gov/4136544/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Teasdale & Jennett, Lancet 1974 (PMID: 4136544) →</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
            { label: 'MAP Calculator', path: '/map-calculator' },
            { label: 'PHQ-9 Score', path: '/phq9-score' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
            { q: currentText.faqQ4, a: currentText.faqA4 },
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
    </>
  );
}
