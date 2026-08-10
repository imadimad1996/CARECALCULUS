import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, HeartPulse } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIO } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Revised Cardiac Risk Index (RCRI)",
    subtitle: "Estimates risk of perioperative cardiac complications for noncardiac surgery",
    criteria: [
      "High-risk surgery (intraperitoneal, intrathoracic, or suprainguinal vascular)",
      "History of ischemic heart disease (e.g. prior MI, positive exercise test, angina)",
      "History of congestive heart failure (e.g. pulmonary edema, paroxysmal nocturnal dyspnea, S3 gallop)",
      "History of cerebrovascular disease (prior TIA or stroke)",
      "Preoperative treatment with insulin",
      "Preoperative serum creatinine > 2.0 mg/dL (177 µmol/L)"
    ],
    yes: "Yes",
    no: "No",
    result: "RCRI Score",
    points: "points",
    risk: "Risk of major cardiac event:",
    formula: "Risk of myocardial infarction, pulmonary edema, ventricular fibrillation, or primary cardiac arrest.",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The RCRI (Lee's Revised Cardiac Risk Index) is a widely used and validated preoperative risk stratification tool. It helps identify patients at higher risk of major adverse cardiac events (MACE) during non-cardiac surgery.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "0 points (Class I): 0.4% risk of major cardiac event.",
      "1 point (Class II): 0.9% risk of major cardiac event.",
      "2 points (Class III): 2.4% risk of major cardiac event.",
      "≥ 3 points (Class IV): 5.4% risk of major cardiac event.",
      "Note: The original study rates are shown. Some modern cohorts (e.g. VISION) suggest the actual risk in current practice may be higher depending on the population."
    ],
    references: "Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999;100(10):1043-9.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Does prior CABG or PCI count as ischemic heart disease?",
    faqA1: "Yes, any history of myocardial infarction, prior positive stress test, prior revascularization, or current angina counts.",
    faqQ2: "What if the patient uses oral antidiabetics, not insulin?",
    faqA2: "Only treatment with insulin before surgery counts as a risk factor in this specific score.",
  },
  fr: {
    title: "Score RCRI (Index de Risque Cardiaque)",
    subtitle: "Estime le risque de complications cardiaques périopératoires en chirurgie non cardiaque",
    criteria: [
      "Chirurgie à haut risque (intrapéritonéale, intrathoracique ou vasculaire sus-inguinale)",
      "Antécédent de cardiopathie ischémique (ex. IDM, angor, test d'effort positif)",
      "Antécédent d'insuffisance cardiaque (ex. OAP, DPN, Bruit B3)",
      "Antécédent de maladie cérébrovasculaire (AIT ou AVC)",
      "Traitement préopératoire par insuline",
      "Créatinine préopératoire > 2.0 mg/dL (> 177 µmol/L)"
    ],
    yes: "Oui",
    no: "Non",
    result: "Score RCRI",
    points: "points",
    risk: "Risque d'événement cardiaque majeur :",
    formula: "Risque d'infarctus, OAP, FV ou arrêt cardiaque.",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le RCRI de Lee est largement utilisé pour stratifier le risque préopératoire. Il identifie les patients à haut risque d'événements cardiaques indésirables majeurs (MACE).",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "0 point (Classe I) : 0,4 % de risque.",
      "1 point (Classe II) : 0,9 % de risque.",
      "2 points (Classe III) : 2,4 % de risque.",
      "≥ 3 points (Classe IV) : 5,4 % de risque.",
      "Remarque : Les taux de l'étude d'origine sont indiqués. Des cohortes modernes suggèrent que le risque réel peut être supérieur."
    ],
    references: "Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Un antécédent de pontage ou d'angioplastie compte-t-il ?",
    faqA1: "Oui, tout antécédent de revascularisation, d'infarctus ou d'angor compte comme cardiopathie ischémique.",
    faqQ2: "Et si le patient prend des antidiabétiques oraux sans insuline ?",
    faqA2: "Seul le traitement par insuline avant l'intervention compte dans ce score.",
  },
  es: {
    title: "Índice de Riesgo Cardíaco Revisado (RCRI)",
    subtitle: "Estima el riesgo de complicaciones cardíacas perioperatorias en cirugía no cardíaca",
    criteria: [
      "Cirugía de alto riesgo (intraperitoneal, intratorácica o vascular suprainguinal)",
      "Antecedente de cardiopatía isquémica (ej. IAM, angina, ergometría positiva)",
      "Antecedente de insuficiencia cardíaca (ej. EAP, disnea paroxística nocturna)",
      "Antecedente de enfermedad cerebrovascular (AIT o ACV)",
      "Tratamiento preoperatorio con insulina",
      "Creatinina preoperatoria > 2.0 mg/dL (177 µmol/L)"
    ],
    yes: "Sí",
    no: "No",
    result: "Puntuación RCRI",
    points: "puntos",
    risk: "Riesgo de evento cardíaco mayor:",
    formula: "Riesgo de IAM, EAP, FV o parada cardíaca primaria.",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "El RCRI de Lee es una herramienta de estratificación del riesgo preoperatorio muy utilizada. Ayuda a identificar a los pacientes con mayor riesgo de MACE en cirugías no cardíacas.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "0 puntos (Clase I): 0.4% de riesgo.",
      "1 punto (Clase II): 0.9% de riesgo.",
      "2 puntos (Clase III): 2.4% de riesgo.",
      "≥ 3 puntos (Clase IV): 5.4% de riesgo.",
      "Nota: Se muestran las tasas del estudio original de 1999."
    ],
    references: "Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿El antecedente de stent o bypass cuenta como cardiopatía isquémica?",
    faqA1: "Sí, cualquier antecedente de revascularización, infarto o angina sintomática cuenta.",
    faqQ2: "¿Y si el paciente toma antidiabéticos orales pero no insulina?",
    faqA2: "Solo se puntúa el tratamiento con insulina.",
  },
  ar: {
    title: "مؤشر الخطر القلبي المُعدّل (RCRI)",
    subtitle: "تقدير خطر حدوث مضاعفات قلبية أثناء الجراحة غير القلبية",
    criteria: [
      "جراحة عالية الخطورة (داخل البطن، داخل الصدر، أو الأوعية الدموية فوق الإربية)",
      "تاريخ لمرض نقص تروية القلب (مثل جلطة سابقة، ذبحة صدرية، اختبار إجهاد إيجابي)",
      "تاريخ لفشل القلب الاحتقاني",
      "تاريخ لأمراض الأوعية الدموية الدماغية (سكتة دماغية أو نوبة نقص تروية عابرة)",
      "العلاج بالأنسولين قبل الجراحة",
      "كرياتينين المصل قبل الجراحة > 2.0 مجم/ديسيلتر (>177 ميكرومول/لتر)"
    ],
    yes: "نعم",
    no: "لا",
    result: "نقاط RCRI",
    points: "نقاط",
    risk: "خطر حدوث حدث قلبي كبير:",
    formula: "خطر احتشاء عضلة القلب، وذمة رئوية، رجفان بطيني، أو توقف القلب.",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يعد مؤشر RCRI (مؤشر لي) أداة واسعة الاستخدام لتقييم المخاطر قبل الجراحة. يساعد في تحديد المرضى المعرضين لخطر أكبر لحدوث أحداث قلبية سلبية كبرى (MACE).",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "0 نقطة (الفئة الأولى): 0.4% خطر حدوث حدث قلبي كبير.",
      "1 نقطة (الفئة الثانية): 0.9% خطر.",
      "2 نقطة (الفئة الثالثة): 2.4% خطر.",
      "≥ 3 نقاط (الفئة الرابعة): 5.4% خطر.",
      "ملاحظة: هذه النسب مستندة إلى الدراسة الأصلية عام 1999."
    ],
    references: "Lee TH, et al. Derivation and prospective validation of a simple index for prediction of cardiac risk of major noncardiac surgery. Circulation. 1999.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل يعتبر وجود دعامة سابقة في القلب مرض نقص تروية؟",
    faqA1: "نعم، أي تاريخ لإعادة التروية (قسطرة أو جراحة) أو جلطة قلبية يعتبر مرض نقص تروية.",
    faqQ2: "ماذا لو كان المريض يستخدم أدوية السكر الفموية بدون أنسولين؟",
    faqA2: "في هذا المؤشر، يقتصر الخطر على العلاج بالأنسولين فقط.",
  }
};

export default function RcriScore({ lang }: { lang: LangCode }) {
  const [answers, setAnswers] = useState<boolean[]>(new Array(6).fill(false));

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const toggleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = !newAnswers[index];
    setAnswers(newAnswers);
  };

  const score = answers.filter(Boolean).length;
  
  let riskPercent = "";
  if (score === 0) riskPercent = "0.4%";
  else if (score === 1) riskPercent = "0.9%";
  else if (score === 2) riskPercent = "2.4%";
  else riskPercent = "5.4%";

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('rcri-score', lang, score);
      trackCalculatorResult('rcri-score', score, 'points', lang);
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
          <EmbedCodeButton calculatorSlug="rcri-score" lang={lang} title={currentText.title} />
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
                <HeartPulse className="w-5 h-5 text-red-400" />
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
                score === 2 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                score === 1 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                <div className="font-bold text-sm tracking-wide mb-1">
                  {currentText.risk}
                </div>
                <div className="text-2xl font-black">{riskPercent}</div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={currentText.criteria.map((c, i) => ({
                  label: c,
                  value: answers[i] ? currentText.yes : currentText.no
                }))}
                results={[
                  { label: "RCRI Score", value: `${score} points` },
                  { label: "Risk of MACE", value: riskPercent }
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
        <MedicalReviewerCard reviewer={REVIEWER_CARDIO} lang={lang} />
      </div>
    </>
  );
}
