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
    title: "Wong-Baker FACES Pain Scale",
    subtitle: "Self-assessment pain scale for children and adults",
    instruction: "Select the face that best describes how much pain the patient is feeling right now:",
    face0: "0 - No Hurt",
    face2: "2 - Hurts Little Bit",
    face4: "4 - Hurts Little More",
    face6: "6 - Hurts Even More",
    face8: "8 - Hurts Whole Lot",
    face10: "10 - Hurts Worst",
    result: "Selected Pain Level",
    formula: "Visual analog self-reporting",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The Wong-Baker FACES Pain Rating Scale is used to help patients self-report their pain level. It is especially useful for children ages 3 and older, and for patients with communication barriers.",
    pillarTitle: "Pain Assessment",
    pillarText: [
      "Point to each face using the words to describe the pain intensity. Ask the child to choose the face that best describes their own pain.",
      "This tool is intended for self-assessment only, not for a provider to guess the patient's pain."
    ],
    references: "Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs. 1988.",
    severe: "Severe Pain (8-10)",
    moderate: "Moderate Pain (4-6)",
    mild: "Mild Pain (2)",
    none: "No Pain (0)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Who can use the FACES scale?",
    faqA1: "It is primarily used for children 3 years and older, but can also be used for adults, especially those who may not speak the local language or have cognitive impairments.",
    faqQ2: "Can a nurse choose the face for the patient?",
    faqA2: "No, this is a self-assessment tool. The patient must choose the face that represents their pain.",
  },
  fr: {
    title: "Échelle de Douleur Wong-Baker",
    subtitle: "Échelle d'auto-évaluation de la douleur pour enfants et adultes",
    instruction: "Sélectionnez le visage qui décrit le mieux la douleur ressentie par le patient actuellement :",
    face0: "0 - Aucune Douleur",
    face2: "2 - Fait un peu mal",
    face4: "4 - Fait un peu plus mal",
    face6: "6 - Fait encore plus mal",
    face8: "8 - Fait très mal",
    face10: "10 - Fait le plus mal possible",
    result: "Niveau de Douleur",
    formula: "Auto-évaluation visuelle",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "L'échelle Wong-Baker est utilisée pour aider les patients à auto-évaluer leur douleur. Très utile pour les enfants de 3 ans et plus, et les patients ayant des difficultés de communication.",
    pillarTitle: "Évaluation de la Douleur",
    pillarText: [
      "Pointez chaque visage en utilisant les mots pour décrire l'intensité. Demandez au patient de choisir le visage qui correspond à sa douleur.",
      "Cet outil est strictement pour l'auto-évaluation."
    ],
    references: "Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs. 1988.",
    severe: "Douleur Sévère (8-10)",
    moderate: "Douleur Modérée (4-6)",
    mild: "Douleur Légère (2)",
    none: "Aucune Douleur (0)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pour qui utiliser cette échelle ?",
    faqA1: "Principalement pour les enfants dès 3 ans, mais aussi pour les adultes ayant des difficultés de communication.",
    faqQ2: "L'infirmière peut-elle choisir à la place du patient ?",
    faqA2: "Non, c'est un outil d'auto-évaluation. Le patient doit choisir lui-même.",
  },
  es: {
    title: "Escala de Dolor Wong-Baker FACES",
    subtitle: "Escala de autoevaluación del dolor para niños y adultos",
    instruction: "Seleccione la cara que mejor describa cuánto dolor siente el paciente en este momento:",
    face0: "0 - No duele",
    face2: "2 - Duele un poco",
    face4: "4 - Duele un poco más",
    face6: "6 - Duele aún más",
    face8: "8 - Duele mucho",
    face10: "10 - El peor dolor",
    result: "Nivel de Dolor",
    formula: "Autoevaluación visual analógica",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La escala de dolor Wong-Baker ayuda a los pacientes a autoevaluar su nivel de dolor. Es útil para niños a partir de los 3 años y pacientes con barreras de comunicación.",
    pillarTitle: "Evaluación del Dolor",
    pillarText: [
      "Señale cada cara usando las palabras para describir la intensidad. Pídale al paciente que elija la cara que mejor describa su dolor.",
      "Esta herramienta es solo para autoevaluación."
    ],
    references: "Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs. 1988.",
    severe: "Dolor Severo (8-10)",
    moderate: "Dolor Moderado (4-6)",
    mild: "Dolor Leve (2)",
    none: "Sin Dolor (0)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Quién puede usar la escala FACES?",
    faqA1: "Principalmente niños de 3 años en adelante, pero también adultos con barreras idiomáticas o deterioro cognitivo.",
    faqQ2: "¿Puede el médico elegir la cara por el paciente?",
    faqA2: "No, es una herramienta de autoevaluación. El paciente debe elegir.",
  },
  ar: {
    title: "مقياس وونغ-بيكر للألم",
    subtitle: "مقياس التقييم الذاتي للألم للأطفال والبالغين",
    instruction: "اختر الوجه الذي يصف بدقة مقدار الألم الذي يشعر به المريض الآن:",
    face0: "0 - لا يوجد ألم",
    face2: "2 - يؤلم قليلاً",
    face4: "4 - يؤلم أكثر قليلاً",
    face6: "6 - يؤلم أكثر",
    face8: "8 - يؤلم كثيراً",
    face10: "10 - أسوأ ألم ممكن",
    result: "مستوى الألم المحدد",
    formula: "تقرير ذاتي بصري",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يُستخدم المقياس لمساعدة المرضى على التعبير عن ألمهم بأنفسهم. مفيد جداً للأطفال من عمر 3 سنوات فأكثر، والمرضى الذين يواجهون صعوبات في التواصل.",
    pillarTitle: "تقييم الألم",
    pillarText: [
      "أشر إلى كل وجه واشرح معناه. اطلب من المريض اختيار الوجه الذي يعبر عن مستوى ألمه.",
      "هذه الأداة مخصصة للتقييم الذاتي فقط، ولا يجوز للممارس الصحي اختيار الوجه نيابة عن المريض."
    ],
    references: "Wong DL, Baker CM. Pain in children: comparison of assessment scales. Pediatr Nurs. 1988.",
    severe: "ألم شديد (8-10)",
    moderate: "ألم متوسط (4-6)",
    mild: "ألم خفيف (2)",
    none: "لا يوجد ألم (0)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "من يمكنه استخدام هذا المقياس؟",
    faqA1: "يُستخدم بشكل أساسي للأطفال من عمر 3 سنوات، وللبالغين الذين يواجهون صعوبات في التحدث أو التواصل.",
    faqQ2: "هل يمكن للممرض اختيار الوجه بالنيابة عن المريض؟",
    faqA2: "لا، إنها أداة للتقييم الذاتي. يجب أن يختار المريض الوجه بنفسه.",
  }
};

const faces = [
  { val: 0, emoji: "😃" },
  { val: 2, emoji: "🙂" },
  { val: 4, emoji: "😐" },
  { val: 6, emoji: "😟" },
  { val: 8, emoji: "😢" },
  { val: 10, emoji: "😭" },
];

export default function WongBakerFaces({ lang }: { lang: LangCode }) {
  const [score, setScore] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = score !== null;
  
  const getCategory = (val: number) => {
    if (val >= 8) return { label: currentText.severe, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
    if (val >= 4) return { label: currentText.moderate, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (val >= 2) return { label: currentText.mild, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    return { label: currentText.none, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(score || 0);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('wong-baker-faces', lang, score);
        trackCalculatorResult('wong-baker-faces', score, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, score, lang, category.label]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="wong-baker-faces" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-6">{currentText.instruction}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {faces.map((f) => {
                    const textKey = `face${f.val}` as keyof typeof currentText;
                    return (
                      <button
                        key={f.val}
                        onClick={() => setScore(f.val)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${score === f.val ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-blue-400 shadow-md shadow-blue-500/10 scale-105' : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'}`}
                      >
                        <span className="text-5xl mb-3 grayscale-[20%]">{f.emoji}</span>
                        <span className={`text-xs font-bold text-center ${score === f.val ? 'text-blue-800' : 'text-gray-600'}`}>
                          {currentText[textKey]}
                        </span>
                      </button>
                    )
                  })}
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
                  {isComplete ? score : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">/ 10</span>
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
                    {lang === 'fr' ? 'Sélectionnez un visage' : lang === 'es' ? 'Seleccionar una cara' : lang === 'ar' ? 'حدد الوجه' : 'Select a face to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Pain Rating", value: score !== null ? currentText[`face${score}` as keyof typeof currentText] as string : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${score} / 10` : '--' },
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
