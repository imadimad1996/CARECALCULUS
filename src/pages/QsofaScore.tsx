import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, AlertTriangle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "qSOFA Score",
    subtitle: "Quick Sequential Organ Failure Assessment for identifying high-risk patients with suspected infection",
    criteria: [
      "Altered mental status (GCS < 15)",
      "Respiratory Rate ≥ 22 breaths/min",
      "Systolic Blood Pressure ≤ 100 mmHg"
    ],
    yes: "Yes",
    no: "No",
    result: "qSOFA Score",
    points: "points",
    status: "Interpretation:",
    formula: "Score from 0-3 based on Mental Status, RR, and SBP.",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The qSOFA score was introduced in the Sepsis-3 guidelines (2016) as a bedside prompt to identify adult patients with suspected infection who are at greater risk for a poor outcome outside the ICU (prolonged ICU stay or in-hospital mortality).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "0-1 Point: Not high risk. However, continue to monitor and use clinical judgment.",
      "≥ 2 Points: High risk of poor outcome. Indicates organ dysfunction. Consider escalating care, closer monitoring, and early intervention.",
      "qSOFA is NOT a diagnostic test for sepsis; it is a prognostic tool to identify high-risk patients.",
      "Unlike SIRS, qSOFA does not require lab tests, making it ideal for rapid bedside assessment."
    ],
    references: "Singer M, et al. The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3). JAMA. 2016;315(8):801-810.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Does a score of 0 or 1 mean the patient does not have sepsis?",
    faqA1: "No. A low score means they are not currently at high risk for a poor outcome based on this tool, but they could still have an infection requiring prompt treatment.",
    faqQ2: "How is 'altered mental status' defined?",
    faqA2: "Any Glasgow Coma Scale (GCS) score less than 15. This includes any confusion, lethargy, or unresponsiveness.",
  },
  fr: {
    title: "Score qSOFA",
    subtitle: "Évaluation rapide pour identifier les patients à haut risque avec une suspicion d'infection",
    criteria: [
      "Altération de l'état mental (Glasgow < 15)",
      "Fréquence Respiratoire ≥ 22 cycles/min",
      "Pression Artérielle Systolique ≤ 100 mmHg"
    ],
    yes: "Oui",
    no: "Non",
    result: "Score qSOFA",
    points: "points",
    status: "Interprétation :",
    formula: "Score de 0 à 3 basé sur l'État Mental, la FR et la PAS.",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le qSOFA a été introduit dans Sepsis-3 (2016) comme outil clinique au lit du malade pour identifier les patients infectés présentant un risque élevé de mortalité intra-hospitalière ou de séjour prolongé en réanimation.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "0-1 Point : Risque non élevé. Continuer la surveillance selon le jugement clinique.",
      "≥ 2 Points : Haut risque de complications. Signe une dysfonction d'organe. Envisager une intensification des soins.",
      "Le qSOFA n'est PAS un outil diagnostique pour le sepsis ; c'est un outil pronostique.",
      "Contrairement au SIRS, le qSOFA ne nécessite pas d'examens sanguins (rapide au lit du patient)."
    ],
    references: "Singer M, et al. The Third International Consensus Definitions for Sepsis (Sepsis-3). JAMA. 2016.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Un score de 0 ou 1 exclut-il le sepsis ?",
    faqA1: "Non, cela signifie que le risque de mauvais pronostic est faible pour l'instant, mais une infection peut toujours nécessiter un traitement rapide.",
    faqQ2: "Qu'est-ce qu'une altération de l'état mental ?",
    faqA2: "Tout score de Glasgow inférieur à 15 (confusion, léthargie, perte de connaissance).",
  },
  es: {
    title: "Escala qSOFA",
    subtitle: "Evaluación rápida para identificar pacientes de alto riesgo con sospecha de infección",
    criteria: [
      "Alteración del estado mental (GCS < 15)",
      "Frecuencia Respiratoria ≥ 22 resp/min",
      "Presión Arterial Sistólica ≤ 100 mmHg"
    ],
    yes: "Sí",
    no: "No",
    result: "Puntuación qSOFA",
    points: "puntos",
    status: "Interpretación:",
    formula: "Puntuación de 0 a 3 (Estado Mental, FR, y PAS).",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La escala qSOFA se introdujo en las guías Sepsis-3 (2016) como una herramienta rápida para identificar pacientes adultos con sospecha de infección con mayor riesgo de un mal resultado.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "0-1 Puntos: Riesgo bajo. Mantener vigilancia y juicio clínico.",
      "≥ 2 Puntos: Alto riesgo de mal resultado. Indica disfunción orgánica. Considerar escalada de cuidados o UCI.",
      "qSOFA NO diagnostica sepsis; es una herramienta de pronóstico.",
      "A diferencia de SIRS, qSOFA no requiere pruebas de laboratorio, ideal para uso junto a la cama del paciente."
    ],
    references: "Singer M, et al. The Third International Consensus Definitions for Sepsis (Sepsis-3). JAMA. 2016.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Un puntaje de 0 o 1 descarta la sepsis?",
    faqA1: "No. Significa que actualmente no tienen un riesgo alto de mortalidad según esta herramienta, pero pueden requerir tratamiento rápido.",
    faqQ2: "¿Cómo se define el estado mental alterado?",
    faqA2: "Cualquier puntuación en la Escala de Coma de Glasgow (GCS) menor a 15 (confusión, letargo).",
  },
  ar: {
    title: "مقياس qSOFA",
    subtitle: "التقييم السريع لتحديد المرضى المعرضين لمخاطر عالية مع وجود اشتباه بالعدوى",
    criteria: [
      "تغير في الحالة العقلية (مقياس غلاسكو للغيبوبة < 15)",
      "معدل التنفس ≥ 22 نفس/دقيقة",
      "ضغط الدم الانقباضي ≤ 100 ملم زئبق"
    ],
    yes: "نعم",
    no: "لا",
    result: "نتيجة qSOFA",
    points: "نقاط",
    status: "التفسير:",
    formula: "درجة من 0 إلى 3 تعتمد على الحالة العقلية، التنفس، وضغط الدم.",
    clinicalTitle: "التفسير السريري",
    clinicalText: "تم تقديم مقياس qSOFA في إرشادات Sepsis-3 لعام 2016 كأداة سريرية سريعة بجانب السرير لتحديد المرضى البالغين المشتبه في إصابتهم بعدوى والذين هم أكثر عرضة لنتائج سيئة (الوفاة أو العناية المركزة المطولة).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "0-1 نقطة: خطورة منخفضة. ومع ذلك، يجب الاستمرار في المراقبة واستخدام التقييم السريري.",
      "نقطتين أو أكثر (≥ 2): خطر عالي لنتائج سيئة. يشير إلى خلل في وظائف الأعضاء. يجب التفكير في تكثيف الرعاية والنقل للعناية المركزة.",
      "مقياس qSOFA ليس أداة لتشخيص تعفن الدم؛ بل هو أداة إنذار مبكر.",
      "على عكس SIRS، لا يتطلب qSOFA فحوصات مخبرية، مما يجعله مثالياً للتقييم السريع."
    ],
    references: "Singer M, et al. The Third International Consensus Definitions for Sepsis (Sepsis-3). JAMA. 2016.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل تعني الدرجة 0 أو 1 أن المريض لا يعاني من تعفن الدم؟",
    faqA1: "لا. النتيجة المنخفضة تعني أنه ليس في خطر كبير للوفاة وفقاً لهذه الأداة حالياً، لكنه قد يحتاج إلى علاج فوري لعدوى موجودة.",
    faqQ2: "كيف يتم تعريف 'تغير الحالة العقلية'؟",
    faqA2: "أي درجة على مقياس غلاسكو للغيبوبة (GCS) أقل من 15. يشمل ذلك أي ارتباك أو خمول أو عدم استجابة.",
  }
};

export default function QSofaScore({ lang }: { lang: LangCode }) {
  const [answers, setAnswers] = useState<boolean[]>(new Array(3).fill(false));

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const toggleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  const score = answers.filter(Boolean).length;
  const isHighRisk = score >= 2;
  
  let interpretation = "";
  if (isHighRisk) {
    interpretation = lang === 'fr' ? 'Haut risque (≥ 2 points)' : lang === 'es' ? 'Alto riesgo (≥ 2 puntos)' : lang === 'ar' ? 'خطر عالي (≥ 2 نقاط)' : 'High risk (≥ 2 points)';
  } else {
    interpretation = lang === 'fr' ? 'Risque faible à modéré' : lang === 'es' ? 'Riesgo bajo a moderado' : lang === 'ar' ? 'خطر منخفض إلى متوسط' : 'Low/Moderate risk';
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('qsofa-score', lang, score);
      trackCalculatorResult('qsofa-score', score, 'points', lang);
    }, 2000);
    return () => clearTimeout(timer);
  }, [score, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="qsofa-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-4">
              {currentText.criteria.map((criterion, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleAnswer(idx)}
                  className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border ${
                    answers[idx] 
                      ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-500/20' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium pr-4 ${answers[idx] ? 'text-blue-900' : 'text-gray-700'}`}>
                    {criterion}
                  </span>
                  <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out shrink-0 ${answers[idx] ? 'bg-blue-600' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${answers[idx] ? (isRtl ? '-translate-x-6' : 'translate-x-6') : (isRtl ? '-translate-x-1' : 'translate-x-1')}`} />
                  </div>
                </div>
              ))}
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
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {score}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex flex-col gap-1 ${
                isHighRisk ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <div className="font-bold text-sm tracking-wide">
                  {currentText.status}
                </div>
                <div className="font-semibold text-lg">{interpretation}</div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={currentText.criteria.map((c, i) => ({
                  label: c.split(' (')[0].split(' ≤')[0].split(' ≥')[0].trim(),
                  value: answers[i] ? currentText.yes : currentText.no
                }))}
                results={[
                  { label: "qSOFA Score", value: `${score}/3` },
                  { label: "Interpretation", value: interpretation }
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
        <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} lang={lang} />
      </div>
    </>
  );
}
