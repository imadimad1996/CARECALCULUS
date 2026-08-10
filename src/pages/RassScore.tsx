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
    title: "Richmond Agitation-Sedation Scale (RASS)",
    subtitle: "Assess the level of agitation and sedation in patients",
    instruction: "Select the patient's current state based on observation or response to voice/physical stimulation:",
    plus4: "+4 Combative: Overly combative, violent, immediate danger to staff",
    plus3: "+3 Very agitated: Pulls or removes tube(s) or catheter(s); aggressive",
    plus2: "+2 Agitated: Frequent non-purposeful movement, fights ventilator",
    plus1: "+1 Restless: Anxious but movements not aggressive vigorous",
    zero: " 0 Alert and calm",
    minus1: "-1 Drowsy: Not fully alert, but has sustained awakening (eye-opening/eye contact) to voice (>10 sec)",
    minus2: "-2 Light sedation: Briefly awakens with eye contact to voice (<10 sec)",
    minus3: "-3 Moderate sedation: Movement or eye opening to voice (but no eye contact)",
    minus4: "-4 Deep sedation: No response to voice, but movement or eye opening to physical stimulation",
    minus5: "-5 Unarousable: No response to voice or physical stimulation",
    result: "RASS Score",
    formula: "Observational score from -5 to +4",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The RASS is a 10-point scale. It is used widely in critical care to adjust sedation and to assess for delirium (often in conjunction with the CAM-ICU).",
    pillarTitle: "Assessment Steps",
    pillarText: [
      "Step 1: Observe patient. If alert, restless, or agitated, score 0 to +4.",
      "Step 2: If not alert, state patient's name and say to open eyes and look at speaker. If they respond, score -1 to -3.",
      "Step 3: If no response to voice, physically stimulate patient by shaking shoulder and/or rubbing sternum. If they respond, score -4. If no response, score -5."
    ],
    references: "Sessler CN, et al. The Richmond Agitation-Sedation Scale: validity and reliability in adult intensive care unit patients. Am J Respir Crit Care Med. 2002.",
    agitated: "Agitated (+1 to +4)",
    alert: "Alert & Calm (0)",
    sedated: "Sedated (-1 to -5)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why is RASS important?",
    faqA1: "It helps clinicians titrate sedation to a specific target, avoiding oversedation or undersedation, which are both associated with negative outcomes.",
    faqQ2: "How often should RASS be assessed?",
    faqA2: "Typically every 2 to 4 hours in the ICU, or whenever there is a change in the patient's clinical status or sedation dosage.",
  },
  fr: {
    title: "Échelle de Richmond (RASS)",
    subtitle: "Évalue le niveau d'agitation et de sédation des patients",
    instruction: "Sélectionnez l'état actuel du patient basé sur l'observation ou la réponse à la stimulation :",
    plus4: "+4 Combatif : Violent, danger immédiat pour le personnel",
    plus3: "+3 Très agité : Tire sur les sondes ou cathéters ; agressif",
    plus2: "+2 Agité : Mouvements non intentionnels fréquents, lutte contre le ventilateur",
    plus1: "+1 Inquiet : Anxieux mais mouvements non agressifs",
    zero: " 0 Éveillé et calme",
    minus1: "-1 Somnolent : N'est pas pleinement éveillé, mais se réveille à la voix (>10 sec)",
    minus2: "-2 Sédation légère : Se réveille brièvement à la voix avec contact visuel (<10 sec)",
    minus3: "-3 Sédation modérée : Mouvement ou ouverture des yeux à la voix (sans contact visuel)",
    minus4: "-4 Sédation profonde : Aucune réponse à la voix, mais mouvement à la stimulation physique",
    minus5: "-5 Inéveillable : Aucune réponse à la voix ni à la stimulation physique",
    result: "Score RASS",
    formula: "Score d'observation de -5 à +4",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "L'échelle RASS à 10 points est largement utilisée en réanimation pour ajuster la sédation et évaluer le délire (souvent avec le CAM-ICU).",
    pillarTitle: "Étapes d'Évaluation",
    pillarText: [
      "Étape 1 : Observer le patient. S'il est éveillé ou agité, score de 0 à +4.",
      "Étape 2 : S'il n'est pas éveillé, appelez-le par son nom. S'il répond, score de -1 à -3.",
      "Étape 3 : Si aucune réponse à la voix, stimuler physiquement (friction du sternum). S'il répond : -4. Sinon : -5."
    ],
    references: "Sessler CN, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002.",
    agitated: "Agité (+1 à +4)",
    alert: "Éveillé et Calme (0)",
    sedated: "Sédation (-1 à -5)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi l'échelle RASS est-elle importante ?",
    faqA1: "Elle permet d'ajuster la sédation à un objectif précis, évitant ainsi la sur-sédation ou la sous-sédation.",
    faqQ2: "À quelle fréquence l'évaluer ?",
    faqA2: "Généralement toutes les 2 à 4 heures en réanimation, ou lors d'un changement d'état clinique ou de dosage.",
  },
  es: {
    title: "Escala de Richmond (RASS)",
    subtitle: "Evalúa el nivel de agitación y sedación en pacientes",
    instruction: "Seleccione el estado actual del paciente según la observación o la respuesta a la estimulación:",
    plus4: "+4 Combativo: Violento, peligro inmediato para el personal",
    plus3: "+3 Muy agitado: Tira de tubos o catéteres; agresivo",
    plus2: "+2 Agitado: Movimientos frecuentes sin propósito, lucha contra el ventilador",
    plus1: "+1 Inquieto: Ansioso pero sin movimientos agresivos",
    zero: " 0 Alerta y tranquilo",
    minus1: "-1 Somnoliento: No está completamente alerta, pero mantiene el despertar a la voz (>10 seg)",
    minus2: "-2 Sedación leve: Despierta brevemente con contacto visual a la voz (<10 seg)",
    minus3: "-3 Sedación moderada: Movimiento o apertura de ojos a la voz (sin contacto visual)",
    minus4: "-4 Sedación profunda: Sin respuesta a la voz, pero se mueve con estimulación física",
    minus5: "-5 Imposible de despertar: Sin respuesta a la voz o estimulación física",
    result: "Puntuación RASS",
    formula: "Puntuación observacional de -5 a +4",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "RASS es una escala de 10 puntos ampliamente utilizada en cuidados críticos para ajustar la sedación y evaluar el delirio.",
    pillarTitle: "Pasos de Evaluación",
    pillarText: [
      "Paso 1: Observar al paciente. Si está alerta o agitado, puntúe de 0 a +4.",
      "Paso 2: Si no está alerta, llámelo por su nombre. Si responde, puntúe de -1 a -3.",
      "Paso 3: Si no responde a la voz, estimule físicamente. Si responde, -4. Si no responde, -5."
    ],
    references: "Sessler CN, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002.",
    agitated: "Agitado (+1 a +4)",
    alert: "Alerta y Tranquilo (0)",
    sedated: "Sedado (-1 a -5)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué es importante RASS?",
    faqA1: "Ayuda a los médicos a ajustar la sedación a un objetivo específico, evitando complicaciones.",
    faqQ2: "¿Con qué frecuencia se debe evaluar?",
    faqA2: "Normalmente cada 2-4 horas en UCI, o cuando hay un cambio en el estado clínico.",
  },
  ar: {
    title: "مقياس ريتشموند للتهيج والتهدئة (RASS)",
    subtitle: "تقييم مستوى التهيج والتهدئة لدى المرضى",
    instruction: "حدد حالة المريض الحالية بناءً على الملاحظة أو الاستجابة للتحفيز الصوتي أو الجسدي:",
    plus4: "+4 قتالي: عدواني جداً، عنيف، يشكل خطراً فورياً على الطاقم",
    plus3: "+3 متهيج جداً: يشد الأنابيب أو القسطرة؛ عدواني",
    plus2: "+2 متهيج: حركات متكررة غير هادفة، يقاوم جهاز التنفس الصناعي",
    plus1: "+1 قلق: قلق ولكن حركاته غير عنيفة",
    zero: " 0 يقظ وهادئ",
    minus1: "-1 نعسان: ليس يقظاً تماماً، ولكنه يستيقظ عند النداء (أكثر من 10 ثوانٍ)",
    minus2: "-2 تخدير خفيف: يستيقظ لفترة وجيزة وينظر عند النداء (أقل من 10 ثوانٍ)",
    minus3: "-3 تخدير متوسط: حركة أو فتح العين عند النداء (بدون تواصل بصري)",
    minus4: "-4 تخدير عميق: لا استجابة للصوت، لكن يتحرك عند التحفيز الجسدي",
    minus5: "-5 لا يمكن إيقاظه: لا استجابة للصوت أو التحفيز الجسدي",
    result: "نتيجة RASS",
    formula: "مقياس من -5 إلى +4",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يستخدم مقياس RASS ذو الـ 10 نقاط على نطاق واسع في العناية المركزة لضبط التخدير وتقييم الهذيان (غالباً بالاقتران مع CAM-ICU).",
    pillarTitle: "خطوات التقييم",
    pillarText: [
      "الخطوة 1: راقب المريض. إذا كان يقظاً أو متهيجاً، التقييم من 0 إلى +4.",
      "الخطوة 2: إذا لم يكن يقظاً، ناده باسمه. إذا استجاب، التقييم من -1 إلى -3.",
      "الخطوة 3: إذا لم يستجب للصوت، قم بالتحفيز الجسدي (مثل فرك عظمة القص). إذا استجاب (-4)، وإذا لم يستجب (-5)."
    ],
    references: "Sessler CN, et al. The Richmond Agitation-Sedation Scale. Am J Respir Crit Care Med. 2002.",
    agitated: "متهيج (+1 إلى +4)",
    alert: "يقظ وهادئ (0)",
    sedated: "مخدر (-1 إلى -5)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا مقياس RASS مهم؟",
    faqA1: "يساعد الأطباء على ضبط جرعات التخدير لتجنب التخدير المفرط أو الناقص.",
    faqQ2: "كم مرة يجب تقييمه؟",
    faqA2: "عادة كل 2 إلى 4 ساعات في العناية المركزة، أو عند حدوث تغير في حالة المريض.",
  }
};

const options = [
  { val: 4, key: 'plus4' },
  { val: 3, key: 'plus3' },
  { val: 2, key: 'plus2' },
  { val: 1, key: 'plus1' },
  { val: 0, key: 'zero' },
  { val: -1, key: 'minus1' },
  { val: -2, key: 'minus2' },
  { val: -3, key: 'minus3' },
  { val: -4, key: 'minus4' },
  { val: -5, key: 'minus5' },
];

export default function RassScore({ lang }: { lang: LangCode }) {
  const [score, setScore] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = score !== null;
  
  const getCategory = (val: number) => {
    if (val > 0) return { label: currentText.agitated, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
    if (val === 0) return { label: currentText.alert, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    return { label: currentText.sedated, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
  };

  const category = getCategory(score || 0);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('rass-score', lang, score);
        trackCalculatorResult('rass-score', score, category.label, lang);
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
          <EmbedCodeButton calculatorSlug="rass-score" lang={lang} title={currentText.title} />
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
                <div className="grid grid-cols-1 gap-2.5">
                  {options.map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setScore(opt.val)}
                      className={`text-left px-5 py-4 rounded-2xl border text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 leading-snug
                        ${score === opt.val 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25 font-bold' 
                          : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm font-medium'
                        }`}
                    >
                      {currentText[opt.key as keyof typeof currentText]}
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
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-8xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? (score > 0 ? `+${score}` : score) : '--'}
                </span>
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
                    {lang === 'fr' ? 'Sélectionnez un état' : lang === 'es' ? 'Seleccionar un estado' : lang === 'ar' ? 'حدد الحالة' : 'Select a state to score'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Selected State", value: score !== null ? currentText[options.find(o => o.val === score)?.key as keyof typeof currentText] as string : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? (score > 0 ? `+${score}` : `${score}`) : '--' },
                  { label: 'Status Level', value: isComplete ? category.label : '--' }
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
