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
    title: "FLACC Pain Scale",
    subtitle: "Objective pain assessment for non-verbal children",
    face: "Face",
    face0: "No particular expression or smile (0)",
    face1: "Occasional grimace or frown, withdrawn, disinterested (1)",
    face2: "Frequent to constant quivering chin, clenched jaw (2)",
    legs: "Legs",
    legs0: "Normal position or relaxed (0)",
    legs1: "Uneasy, restless, tense (1)",
    legs2: "Kicking, or legs drawn up (2)",
    activity: "Activity",
    act0: "Lying quietly, normal position, moves easily (0)",
    act1: "Squirming, shifting back and forth, tense (1)",
    act2: "Arched, rigid or jerking (2)",
    cry: "Cry",
    cry0: "No cry (awake or asleep) (0)",
    cry1: "Moans or whimpers; occasional complaint (1)",
    cry2: "Crying steadily, screams or sobs, frequent complaints (2)",
    consolability: "Consolability",
    cons0: "Content, relaxed (0)",
    cons1: "Reassured by occasional touching, hugging or being talked to, distractible (1)",
    cons2: "Difficult to console or comfort (2)",
    result: "FLACC Score",
    formula: "Score = Sum of 5 categories (Face, Legs, Activity, Cry, Consolability)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Relaxed/Comfortable (0), Mild Discomfort (1-3), Moderate Pain (4-6), Severe Discomfort or Pain (7-10).",
    pillarTitle: "Behavioral Pain Assessment",
    pillarText: [
      "The FLACC scale is a measurement used to assess pain for children between the ages of 2 months and 7 years or individuals that are unable to communicate their pain.",
      "Each of the 5 categories (F, L, A, C, C) is scored from 0-2, yielding a total score between 0 and 10."
    ],
    references: "Merkel SI, Voepel-Lewis T, Shayevitz JR, Malviya S. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997.",
    severe: "Severe Pain (7-10)",
    moderate: "Moderate Pain (4-6)",
    mild: "Mild Discomfort (1-3)",
    none: "Relaxed / No Pain (0)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Who is the FLACC scale designed for?",
    faqA1: "It is designed for children aged 2 months to 7 years, or older patients who are cognitively impaired or unable to communicate (e.g., intubated patients).",
    faqQ2: "How long should I observe the patient?",
    faqA2: "Observe the patient for at least 1-5 minutes to properly score each category based on their behavior.",
  },
  fr: {
    title: "Échelle FLACC",
    subtitle: "Évaluation objective de la douleur pour enfants non-verbaux",
    face: "Visage (Face)",
    face0: "Sourire ou pas d'expression particulière (0)",
    face1: "Grimace occasionnelle, renfrogné, replié sur soi (1)",
    face2: "Tremblement constant du menton, mâchoire serrée (2)",
    legs: "Jambes (Legs)",
    legs0: "Position normale ou détendue (0)",
    legs1: "Inquiètes, agitées, tendues (1)",
    legs2: "Donne des coups de pied ou jambes repliées (2)",
    activity: "Activité (Activity)",
    act0: "Allongé calmement, bouge facilement (0)",
    act1: "Se tortille, se balance, tendu (1)",
    act2: "Arqué, rigide ou saccadé (2)",
    cry: "Cris (Cry)",
    cry0: "Pas de cri (0)",
    cry1: "Gémissements ou plaintes occasionnelles (1)",
    cry2: "Pleurs continus, cris, sanglots (2)",
    consolability: "Consolabilité (Consolability)",
    cons0: "Calme, détendu (0)",
    cons1: "Rassuré par le contact ou la voix, se laisse distraire (1)",
    cons2: "Difficile à consoler ou réconforter (2)",
    result: "Score FLACC",
    formula: "Somme de 5 catégories comportementales",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Détendu (0), Inconfort léger (1-3), Douleur modérée (4-6), Douleur sévère (7-10).",
    pillarTitle: "Évaluation Comportementale",
    pillarText: [
      "L'échelle FLACC évalue la douleur des enfants (2 mois à 7 ans) ou des patients incapables de communiquer verbalement.",
      "Chaque catégorie est notée de 0 à 2, pour un total de 0 à 10."
    ],
    references: "Merkel SI, Voepel-Lewis T, Shayevitz JR, Malviya S. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997.",
    severe: "Douleur Sévère (7-10)",
    moderate: "Douleur Modérée (4-6)",
    mild: "Inconfort Léger (1-3)",
    none: "Détendu / Sans Douleur (0)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pour qui est conçue l'échelle FLACC ?",
    faqA1: "Pour les enfants de 2 mois à 7 ans, ou les patients plus âgés incapables de communiquer (ex: patients intubés, troubles cognitifs).",
    faqQ2: "Combien de temps observer le patient ?",
    faqA2: "Observez le patient pendant au moins 1 à 5 minutes pour évaluer correctement son comportement global.",
  },
  es: {
    title: "Escala FLACC",
    subtitle: "Evaluación del dolor para niños no verbales",
    face: "Cara (Face)",
    face0: "Sin expresión particular o sonrisa (0)",
    face1: "Mueca ocasional, retraído, desinteresado (1)",
    face2: "Temblor constante del mentón, mandíbula apretada (2)",
    legs: "Piernas (Legs)",
    legs0: "Posición normal o relajada (0)",
    legs1: "Inquietas, tensas (1)",
    legs2: "Pateando o piernas encogidas (2)",
    activity: "Actividad (Activity)",
    act0: "Acostado tranquilamente, se mueve con facilidad (0)",
    act1: "Se retuerce, tenso (1)",
    act2: "Arqueado, rígido o con espasmos (2)",
    cry: "Llanto (Cry)",
    cry0: "Sin llanto (0)",
    cry1: "Quejidos, llanto ocasional (1)",
    cry2: "Llanto continuo, gritos o sollozos (2)",
    consolability: "Consolabilidad (Consolability)",
    cons0: "Tranquilo, relajado (0)",
    cons1: "Se consuela con el contacto o la voz, se distrae (1)",
    cons2: "Difícil de consolar o confortar (2)",
    result: "Puntuación FLACC",
    formula: "Suma de 5 categorías (F, L, A, C, C)",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Relajado (0), Malestar leve (1-3), Dolor moderado (4-6), Dolor severo (7-10).",
    pillarTitle: "Evaluación Conductual del Dolor",
    pillarText: [
      "La escala FLACC se usa para medir el dolor en niños de 2 meses a 7 años, o pacientes que no pueden comunicarse.",
      "Cada categoría se puntúa de 0 a 2, obteniendo un total de 0 a 10."
    ],
    references: "Merkel SI, Voepel-Lewis T, Shayevitz JR, Malviya S. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997.",
    severe: "Dolor Severo (7-10)",
    moderate: "Dolor Moderado (4-6)",
    mild: "Malestar Leve (1-3)",
    none: "Relajado / Sin Dolor (0)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Para quién está diseñada la escala FLACC?",
    faqA1: "Para niños de 2 meses a 7 años, o pacientes con deterioro cognitivo o incapacidad para comunicarse (ej. intubados).",
    faqQ2: "¿Cuánto tiempo debo observar al paciente?",
    faqA2: "Observe al paciente durante al menos 1-5 minutos para puntuar adecuadamente según su comportamiento.",
  },
  ar: {
    title: "مقياس فلاك (FLACC) للألم",
    subtitle: "تقييم الألم الموضوعي للأطفال والرضع غير القادرين على التعبير",
    face: "الوجه (Face)",
    face0: "لا تعبير معين أو مبتسم (0)",
    face1: "عبوس متقطع، منسحب، غير مهتم (1)",
    face2: "ارتجاف الذقن المستمر، صرير الأسنان (2)",
    legs: "الساقين (Legs)",
    legs0: "وضعية طبيعية أو مسترخية (0)",
    legs1: "غير مرتاح، مضطرب، متوتر (1)",
    legs2: "ركل أو سحب الساقين لأعلى (2)",
    activity: "النشاط (Activity)",
    act0: "مستلق بهدوء، يتحرك بسهولة (0)",
    act1: "يتلوى، يتحرك جيئة وذهاباً، متوتر (1)",
    act2: "تصلب وتشنج، أو متقوس (2)",
    cry: "البكاء (Cry)",
    cry0: "لا يوجد بكاء (0)",
    cry1: "أنين أو تذمر متقطع (1)",
    cry2: "بكاء مستمر، صراخ أو نحيب (2)",
    consolability: "قابلية التهدئة (Consolability)",
    cons0: "راضي، مسترخي (0)",
    cons1: "يهدأ باللمس أو العناق أو التحدث معه، يمكن تشتيته (1)",
    cons2: "من الصعب تهدئته (2)",
    result: "نتيجة مقياس فلاك",
    formula: "مجموع 5 فئات سلوكية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "مسترخي (0)، ألم خفيف/انزعاج (1-3)، ألم متوسط (4-6)، ألم شديد (7-10).",
    pillarTitle: "التقييم السلوكي للألم",
    pillarText: [
      "يستخدم المقياس لتقييم الألم لدى الأطفال من عمر شهرين إلى 7 سنوات، أو أي مريض لا يستطيع التعبير عن الألم كلامياً.",
      "تتكون كل فئة من النقاط 0 إلى 2، ليصبح المجموع الكلي 10 نقاط كحد أقصى."
    ],
    references: "Merkel SI, Voepel-Lewis T, Shayevitz JR, Malviya S. The FLACC: a behavioral scale for scoring postoperative pain in young children. Pediatr Nurs. 1997.",
    severe: "ألم شديد (7-10)",
    moderate: "ألم متوسط (4-6)",
    mild: "انزعاج أو ألم خفيف (1-3)",
    none: "مسترخي / لا يوجد ألم (0)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "من الذي يستخدم مقياس فلاك؟",
    faqA1: "الأطفال من شهرين إلى 7 سنوات، أو المرضى الأكبر سناً غير القادرين على التحدث (مثل المنومين في العناية المركزة على التنفس الصناعي).",
    faqQ2: "ما هي مدة المراقبة المطلوبة؟",
    faqA2: "يجب مراقبة المريض لمدة 1 إلى 5 دقائق للحصول على تقييم دقيق لسلوكه واستجابته.",
  }
};

export default function FlaccScore({ lang }: { lang: LangCode }) {
  const [face, setFace] = useState<number | null>(null);
  const [legs, setLegs] = useState<number | null>(null);
  const [act, setAct] = useState<number | null>(null);
  const [cry, setCry] = useState<number | null>(null);
  const [cons, setCons] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = face !== null && legs !== null && act !== null && cry !== null && cons !== null;
  const totalScore = isComplete ? (face! + legs! + act! + cry! + cons!) : 0;
  
  const getCategory = (val: number) => {
    if (val >= 7) return { label: currentText.severe, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' };
    if (val >= 4) return { label: currentText.moderate, color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' };
    if (val >= 1) return { label: currentText.mild, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' };
    return { label: currentText.none, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(totalScore);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('flacc-score', lang, totalScore);
        trackCalculatorResult('flacc-score', totalScore, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, totalScore, lang, category.label]);

  const renderOption = (val: number, currentVal: number | null, setter: (v: number) => void, textKey: string) => {
    return (
      <button
        key={textKey}
        onClick={() => setter(val)}
        className={`text-left px-5 py-4 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 leading-snug ${currentVal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
      >
        {currentText[textKey as keyof typeof currentText]}
      </button>
    );
  };

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="flacc-score" lang={lang} title={currentText.title} />
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.face}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {renderOption(0, face, setFace, 'face0')}
                  {renderOption(1, face, setFace, 'face1')}
                  {renderOption(2, face, setFace, 'face2')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.legs}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {renderOption(0, legs, setLegs, 'legs0')}
                  {renderOption(1, legs, setLegs, 'legs1')}
                  {renderOption(2, legs, setLegs, 'legs2')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.activity}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {renderOption(0, act, setAct, 'act0')}
                  {renderOption(1, act, setAct, 'act1')}
                  {renderOption(2, act, setAct, 'act2')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.cry}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {renderOption(0, cry, setCry, 'cry0')}
                  {renderOption(1, cry, setCry, 'cry1')}
                  {renderOption(2, cry, setCry, 'cry2')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.consolability}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {renderOption(0, cons, setCons, 'cons0')}
                  {renderOption(1, cons, setCons, 'cons1')}
                  {renderOption(2, cons, setCons, 'cons2')}
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
                    {lang === 'fr' ? 'Sélectionnez les critères' : lang === 'es' ? 'Seleccionar criterios' : lang === 'ar' ? 'حدد المعايير' : 'Select criteria to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.face, value: face !== null ? `${face} pts` : '--' },
                  { label: currentText.legs, value: legs !== null ? `${legs} pts` : '--' },
                  { label: currentText.activity, value: act !== null ? `${act} pts` : '--' },
                  { label: currentText.cry, value: cry !== null ? `${cry} pts` : '--' },
                  { label: currentText.consolability, value: cons !== null ? `${cons} pts` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${totalScore} / 10` : '--' },
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
