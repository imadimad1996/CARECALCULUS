import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Wind } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PULMONOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "CURB-65 Score",
    subtitle: "Pneumonia severity score to predict 30-day mortality and guide admission",
    criteria: [
      "Confusion (AMTS ≤ 8 or disorientation in person, place, or time)",
      "Urea > 7 mmol/L (or BUN > 19 mg/dL)",
      "Respiratory Rate ≥ 30 breaths/min",
      "Blood Pressure (SBP < 90 mmHg or DBP ≤ 60 mmHg)",
      "Age ≥ 65 years"
    ],
    yes: "Yes",
    no: "No",
    result: "CURB-65 Score",
    points: "points",
    mortality: "Estimated 30-day Mortality:",
    formula: "Score from 0-5 based on C (Confusion), U (Urea), R (Respiratory Rate), B (Blood Pressure), 65 (Age).",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "CURB-65 is a widely used, validated clinical rule for predicting mortality in community-acquired pneumonia (CAP) and helping to determine the appropriate care setting (outpatient, inpatient, or ICU).",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "0-1 Points: Low risk (< 3% mortality). Consider outpatient treatment.",
      "2 Points: Moderate risk (~ 9-13% mortality). Consider inpatient admission or close outpatient monitoring.",
      "3-5 Points: High risk (17-57% mortality). Inpatient admission required; strongly consider ICU for score 4-5.",
      "Always use clinical judgment. Patients with score 0-1 may still need admission if they cannot take oral medications, lack social support, or are hypoxemic."
    ],
    references: "Lim WS, et al. Defining community acquired pneumonia severity on presentation to hospital: an international derivation and validation study. Thorax. 2003;58(5):377-82.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "What if BUN or Urea is not available yet?",
    faqA1: "You can use the CRB-65 score, which omits the Urea component. CRB-65 of 0 is low risk, while 1-4 points require careful assessment, as a score of 1 might be driven solely by age.",
    faqQ2: "What is AMTS?",
    faqA2: "The Abbreviated Mental Test Score (AMTS) is a 10-point test used to rapidly assess confusion or cognitive impairment.",
  },
  fr: {
    title: "Score CURB-65",
    subtitle: "Score de sévérité de la pneumonie pour guider l'hospitalisation",
    criteria: [
      "Confusion (désorientation temporospatiale ou AMTS ≤ 8)",
      "Urée > 7 mmol/L (ou BUN > 19 mg/dL)",
      "Fréquence Respiratoire ≥ 30 cycles/min",
      "Pression Artérielle (PAS < 90 mmHg ou PAD ≤ 60 mmHg)",
      "Âge ≥ 65 ans"
    ],
    yes: "Oui",
    no: "Non",
    result: "Score CURB-65",
    points: "points",
    mortality: "Mortalité estimée à 30 jours :",
    formula: "Score de 0 à 5 basé sur Confusion, Urée, Respiration, Tension (BP), Âge > 65.",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le CURB-65 est un score validé pour prédire la mortalité des pneumonies aiguës communautaires (PAC) et orienter le patient vers l'ambulatoire, la médecine ou la réanimation.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "0-1 Point : Faible risque. Traitement ambulatoire possible.",
      "2 Points : Risque modéré. Envisager une courte hospitalisation ou un suivi strict.",
      "3-5 Points : Haut risque. Hospitalisation requise ; soins intensifs à envisager (surtout si 4-5).",
      "Le jugement clinique prime. Un score de 0-1 peut nécessiter une hospitalisation pour hypoxémie, vomissements ou isolement social."
    ],
    references: "Lim WS, et al. Defining community acquired pneumonia severity on presentation to hospital. Thorax. 2003.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Que faire si l'urée n'est pas encore connue ?",
    faqA1: "Vous pouvez utiliser le score CRB-65 qui n'inclut pas l'urée. Un CRB-65 de 0 indique un faible risque.",
    faqQ2: "Qu'est-ce que l'AMTS ?",
    faqA2: "C'est l'Abbreviated Mental Test Score, un test sur 10 points évaluant rapidement la confusion.",
  },
  es: {
    title: "Escala CURB-65",
    subtitle: "Escala de gravedad de neumonía para predecir mortalidad a 30 días",
    criteria: [
      "Confusión (desorientación o AMTS ≤ 8)",
      "Urea > 7 mmol/L (o BUN > 19 mg/dL)",
      "Frecuencia Respiratoria ≥ 30 resp/min",
      "Presión Arterial (PAS < 90 mmHg o PAD ≤ 60 mmHg)",
      "Edad ≥ 65 años"
    ],
    yes: "Sí",
    no: "No",
    result: "Puntuación CURB-65",
    points: "puntos",
    mortality: "Mortalidad estimada a 30 días:",
    formula: "Puntuación de 0 a 5 basada en Confusión, Urea, Respiración, Presión (BP), > 65 años.",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "CURB-65 es una regla clínica validada para predecir la mortalidad en la neumonía adquirida en la comunidad (NAC) y determinar si el manejo debe ser ambulatorio o intrahospitalario.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "0-1 Puntos: Riesgo bajo. Tratamiento ambulatorio.",
      "2 Puntos: Riesgo moderado. Considerar ingreso hospitalario.",
      "3-5 Puntos: Riesgo alto. Ingreso necesario; considerar UCI si es 4-5.",
      "El criterio clínico es fundamental. Pacientes con 0-1 puntos pueden requerir ingreso si hay hipoxemia o incapacidad para la vía oral."
    ],
    references: "Lim WS, et al. Defining community acquired pneumonia severity on presentation to hospital. Thorax. 2003.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Qué pasa si no tengo aún los resultados de urea?",
    faqA1: "Puede usar la escala CRB-65, que excluye la urea. Un CRB-65 de 0 implica bajo riesgo.",
    faqQ2: "¿Qué es AMTS?",
    faqA2: "Abbreviated Mental Test Score, un test breve para evaluar confusión en urgencias.",
  },
  ar: {
    title: "مقياس CURB-65",
    subtitle: "مقياس شدة الالتهاب الرئوي لتوجيه خطة العلاج وتوقع الوفيات",
    criteria: [
      "التشوش الذهني (ارتباك أو درجة AMTS ≤ 8)",
      "اليوريا في الدم > 7 مليمول/لتر (أو BUN > 19 مجم/ديسيلتر)",
      "معدل التنفس ≥ 30 نفس/دقيقة",
      "ضغط الدم (الانقباضي < 90 أو الانبساطي ≤ 60 ملم زئبق)",
      "العمر ≥ 65 عاماً"
    ],
    yes: "نعم",
    no: "لا",
    result: "نتيجة CURB-65",
    points: "نقاط",
    mortality: "نسبة الوفيات التقديرية خلال 30 يوماً:",
    formula: "نقطة لكل من: التشوش، اليوريا، التنفس، ضغط الدم، العمر فوق 65.",
    clinicalTitle: "التفسير السريري",
    clinicalText: "مقياس CURB-65 هو أداة سريرية معتمدة للتنبؤ بالوفيات في الالتهاب الرئوي المكتسب من المجتمع وتحديد ما إذا كان العلاج في العيادات الخارجية أو التنويم أو العناية المركزة مناسباً.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "0-1 نقطة: خطر منخفض. غالباً مناسب للعلاج في العيادات الخارجية.",
      "2 نقطة: خطر متوسط. يُفضل التنويم في المستشفى.",
      "3-5 نقاط: خطر عالي. التنويم ضروري، وينصح بالعناية المركزة للدرجات 4 و 5.",
      "التقييم السريري يظل الأهم؛ قد يحتاج المريض (0-1 نقطة) للتنويم إذا كان يعاني من نقص الأكسجة أو لا يستطيع تناول الدواء بالفم."
    ],
    references: "Lim WS, et al. Defining community acquired pneumonia severity on presentation to hospital. Thorax. 2003.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "ماذا لو لم تكن نتيجة اليوريا (BUN) متاحة بعد؟",
    faqA1: "يمكنك استخدام مؤشر CRB-65 الذي لا يتطلب فحص الدم. الدرجة صفر تعني خطورة منخفضة.",
    faqQ2: "كيف يُقيّم التشوش الذهني؟",
    faqA2: "يتم تقييمه من خلال الارتباك الواضح للزمان أو المكان أو الشخص، أو باستخدام اختبار AMTS إذا كان أقل من 8.",
  }
};

export default function Curb65({ lang }: { lang: LangCode }) {
  const [answers, setAnswers] = useState<boolean[]>(new Array(5).fill(false));

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const toggleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  const score = answers.filter(Boolean).length;
  
  let riskPercent = "";
  let recommendation = "";

  if (score === 0) {
    riskPercent = "0.7%";
    recommendation = lang === 'fr' ? "Faible risque (Ambulatoire)" : lang === 'es' ? "Riesgo bajo (Ambulatorio)" : lang === 'ar' ? "خطر منخفض (عيادات خارجية)" : "Low Risk (Outpatient)";
  } else if (score === 1) {
    riskPercent = "3.2%";
    recommendation = lang === 'fr' ? "Faible risque (Ambulatoire)" : lang === 'es' ? "Riesgo bajo (Ambulatorio)" : lang === 'ar' ? "خطر منخفض (عيادات خارجية)" : "Low Risk (Outpatient)";
  } else if (score === 2) {
    riskPercent = "13.0%";
    recommendation = lang === 'fr' ? "Risque modéré (Hospitalisation)" : lang === 'es' ? "Riesgo moderado (Ingreso)" : lang === 'ar' ? "خطر متوسط (تنويم)" : "Moderate Risk (Inpatient)";
  } else if (score === 3) {
    riskPercent = "17.0%";
    recommendation = lang === 'fr' ? "Haut risque (Hospitalisation / Soins Intensifs)" : lang === 'es' ? "Riesgo alto (Ingreso / UCI)" : lang === 'ar' ? "خطر عالي (تنويم / عناية مركزة)" : "High Risk (Inpatient / ICU)";
  } else if (score === 4) {
    riskPercent = "41.5%";
    recommendation = lang === 'fr' ? "Haut risque (Soins Intensifs)" : lang === 'es' ? "Riesgo alto (UCI)" : lang === 'ar' ? "خطر عالي جداً (عناية مركزة)" : "High Risk (ICU)";
  } else {
    riskPercent = "57.0%";
    recommendation = lang === 'fr' ? "Haut risque (Soins Intensifs)" : lang === 'es' ? "Riesgo alto (UCI)" : lang === 'ar' ? "خطر عالي جداً (عناية مركزة)" : "High Risk (ICU)";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('curb-65', lang, score);
      trackCalculatorResult('curb-65', score, 'points', lang);
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
          <EmbedCodeButton calculatorSlug="curb-65" lang={lang} title={currentText.title} />
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
                <Wind className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {score}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                score >= 3 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                score === 2 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <div className="font-bold text-sm tracking-wide mb-1">
                  {currentText.mortality} <span className="font-black text-lg">{riskPercent}</span>
                </div>
                <div className="font-semibold text-sm mt-1">{recommendation}</div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={currentText.criteria.map((c, i) => ({
                  label: c.split('(')[0].trim(),
                  value: answers[i] ? currentText.yes : currentText.no
                }))}
                results={[
                  { label: "CURB-65 Score", value: `${score} points` },
                  { label: "30-day Mortality", value: riskPercent },
                  { label: "Recommendation", value: recommendation }
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
        <MedicalReviewerCard reviewer={REVIEWER_PULMONOLOGY} lang={lang} />
      </div>
    </>
  );
}
