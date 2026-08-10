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
    title: "Modified Early Warning Score (MEWS)",
    subtitle: "Identify hospitalized patients at risk for clinical deterioration",
    rr: "Respiratory Rate (bpm)",
    rr2b: "≤ 8 (2)",
    rr0: "9 - 14 (0)",
    rr1: "15 - 20 (1)",
    rr2t: "21 - 29 (2)",
    rr3t: "≥ 30 (3)",
    hr: "Heart Rate (bpm)",
    hr2b: "≤ 40 (2)",
    hr1b: "41 - 50 (1)",
    hr0: "51 - 100 (0)",
    hr1t: "101 - 110 (1)",
    hr2t: "111 - 129 (2)",
    hr3t: "≥ 130 (3)",
    sbp: "Systolic BP (mmHg)",
    sbp3b: "≤ 70 (3)",
    sbp2b: "71 - 80 (2)",
    sbp1b: "81 - 100 (1)",
    sbp0: "101 - 199 (0)",
    sbp2t: "≥ 200 (2)",
    loc: "Consciousness (AVPU)",
    locAlert: "Alert (0)",
    locVoice: "Reacts to Voice (1)",
    locPain: "Reacts to Pain (2)",
    locUnresp: "Unresponsive (3)",
    temp: "Temperature (°C)",
    temp2b: "< 35.0 (2)",
    temp0: "35.0 - 38.4 (0)",
    temp2t: "≥ 38.5 (2)",
    result: "MEWS Score",
    formula: "MEWS Score = Sum of 5 physiological parameters",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Score ≥ 5 is associated with increased risk of death, ICU admission, and cardiac arrest.",
    pillarTitle: "Clinical Deterioration",
    pillarText: [
      "MEWS is used to detect clinical deterioration in hospitalized adult patients.",
      "A score of 5 or more typically triggers a rapid response team or medical emergency team activation."
    ],
    references: "Subbe CP, Kruger M, Rutherford P, Gemmel L. Validation of a modified Early Warning Score in medical admissions. QJM. 2001.",
    high: "High Risk (≥ 5)",
    low: "Low Risk (< 5)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "When should MEWS be calculated?",
    faqA1: "MEWS should be calculated routinely along with vital signs in medical-surgical units to spot deteriorating patients early.",
    faqQ2: "What is AVPU?",
    faqA2: "AVPU is a simplified scale to assess consciousness: Alert, Voice, Pain, Unresponsive.",
  },
  fr: {
    title: "Score MEWS",
    subtitle: "Score d'alerte précoce modifié pour la détérioration",
    rr: "Fréquence Respiratoire",
    rr2b: "≤ 8 (2)",
    rr0: "9 - 14 (0)",
    rr1: "15 - 20 (1)",
    rr2t: "21 - 29 (2)",
    rr3t: "≥ 30 (3)",
    hr: "Fréquence Cardiaque",
    hr2b: "≤ 40 (2)",
    hr1b: "41 - 50 (1)",
    hr0: "51 - 100 (0)",
    hr1t: "101 - 110 (1)",
    hr2t: "111 - 129 (2)",
    hr3t: "≥ 130 (3)",
    sbp: "Tension Artérielle Systolique",
    sbp3b: "≤ 70 (3)",
    sbp2b: "71 - 80 (2)",
    sbp1b: "81 - 100 (1)",
    sbp0: "101 - 199 (0)",
    sbp2t: "≥ 200 (2)",
    loc: "Conscience (AVPU)",
    locAlert: "Alerte (0)",
    locVoice: "Réagit à la voix (1)",
    locPain: "Réagit à la douleur (2)",
    locUnresp: "Inconscient (3)",
    temp: "Température (°C)",
    temp2b: "< 35.0 (2)",
    temp0: "35.0 - 38.4 (0)",
    temp2t: "≥ 38.5 (2)",
    result: "Score MEWS",
    formula: "Score = Somme de 5 paramètres",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Score ≥ 5 est associé à un risque accru de décès, d'admission en réanimation et d'arrêt cardiaque.",
    pillarTitle: "Détérioration Clinique",
    pillarText: [
      "Le MEWS est utilisé pour détecter la détérioration clinique chez les patients adultes hospitalisés.",
      "Un score de 5 ou plus déclenche généralement l'intervention d'une équipe d'urgence médicale."
    ],
    references: "Subbe CP, Kruger M, Rutherford P, Gemmel L. Validation of a modified Early Warning Score in medical admissions. QJM. 2001.",
    high: "Risque Élevé (≥ 5)",
    low: "Risque Faible (< 5)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Quand calculer le MEWS ?",
    faqA1: "Le MEWS doit être calculé en routine avec les signes vitaux pour repérer précocement les patients qui s'aggravent.",
    faqQ2: "Qu'est-ce que l'AVPU ?",
    faqA2: "L'AVPU est une échelle simplifiée de la conscience : Alerte, Voix (Voice), Douleur (Pain), Inconscient (Unresponsive).",
  },
  es: {
    title: "Escala MEWS",
    subtitle: "Escala de alerta temprana modificada para deterioro clínico",
    rr: "Frecuencia Respiratoria",
    rr2b: "≤ 8 (2)",
    rr0: "9 - 14 (0)",
    rr1: "15 - 20 (1)",
    rr2t: "21 - 29 (2)",
    rr3t: "≥ 30 (3)",
    hr: "Frecuencia Cardíaca",
    hr2b: "≤ 40 (2)",
    hr1b: "41 - 50 (1)",
    hr0: "51 - 100 (0)",
    hr1t: "101 - 110 (1)",
    hr2t: "111 - 129 (2)",
    hr3t: "≥ 130 (3)",
    sbp: "Presión Sistólica",
    sbp3b: "≤ 70 (3)",
    sbp2b: "71 - 80 (2)",
    sbp1b: "81 - 100 (1)",
    sbp0: "101 - 199 (0)",
    sbp2t: "≥ 200 (2)",
    loc: "Conciencia (AVPU)",
    locAlert: "Alerta (0)",
    locVoice: "Reacciona a la voz (1)",
    locPain: "Reacciona al dolor (2)",
    locUnresp: "Inconsciente (3)",
    temp: "Temperatura (°C)",
    temp2b: "< 35.0 (2)",
    temp0: "35.0 - 38.4 (0)",
    temp2t: "≥ 38.5 (2)",
    result: "Puntuación MEWS",
    formula: "Suma de 5 parámetros",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Una puntuación ≥ 5 se asocia con un mayor riesgo de muerte, ingreso en UCI y paro cardíaco.",
    pillarTitle: "Deterioro Clínico",
    pillarText: [
      "MEWS se usa para detectar deterioro clínico en pacientes adultos hospitalizados.",
      "Un score de 5 o más suele activar al equipo de respuesta rápida."
    ],
    references: "Subbe CP, Kruger M, Rutherford P, Gemmel L. Validation of a modified Early Warning Score in medical admissions. QJM. 2001.",
    high: "Riesgo Alto (≥ 5)",
    low: "Riesgo Bajo (< 5)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Cuándo se debe calcular MEWS?",
    faqA1: "Debe calcularse de forma rutinaria junto con los signos vitales para detectar el deterioro tempranamente.",
    faqQ2: "¿Qué es AVPU?",
    faqA2: "AVPU es una escala para evaluar la conciencia: Alerta, Voz, Dolor (Pain), Sin respuesta (Unresponsive).",
  },
  ar: {
    title: "مقياس MEWS",
    subtitle: "نظام الإنذار المبكر المعدل للتدهور السريري",
    rr: "معدل التنفس",
    rr2b: "≤ 8 (2)",
    rr0: "9 - 14 (0)",
    rr1: "15 - 20 (1)",
    rr2t: "21 - 29 (2)",
    rr3t: "≥ 30 (3)",
    hr: "معدل ضربات القلب",
    hr2b: "≤ 40 (2)",
    hr1b: "41 - 50 (1)",
    hr0: "51 - 100 (0)",
    hr1t: "101 - 110 (1)",
    hr2t: "111 - 129 (2)",
    hr3t: "≥ 130 (3)",
    sbp: "ضغط الدم الانقباضي",
    sbp3b: "≤ 70 (3)",
    sbp2b: "71 - 80 (2)",
    sbp1b: "81 - 100 (1)",
    sbp0: "101 - 199 (0)",
    sbp2t: "≥ 200 (2)",
    loc: "مستوى الوعي (AVPU)",
    locAlert: "يقظ (0)",
    locVoice: "يستجيب للصوت (1)",
    locPain: "يستجيب للألم (2)",
    locUnresp: "لا يستجيب (3)",
    temp: "درجة الحرارة",
    temp2b: "< 35.0 (2)",
    temp0: "35.0 - 38.4 (0)",
    temp2t: "≥ 38.5 (2)",
    result: "نتيجة MEWS",
    formula: "مجموع 5 معايير فسيولوجية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "تسجيل 5 أو أكثر يرتبط بزيادة خطر الوفاة، دخول العناية المركزة، وتوقف القلب.",
    pillarTitle: "الإنذار المبكر",
    pillarText: [
      "يستخدم مقياس MEWS لاكتشاف التدهور السريري لدى المرضى المنومين البالغين.",
      "عادة ما يؤدي الحصول على نتيجة 5 أو أكثر إلى تفعيل فريق الاستجابة السريعة."
    ],
    references: "Subbe CP, Kruger M, Rutherford P, Gemmel L. Validation of a modified Early Warning Score in medical admissions. QJM. 2001.",
    high: "خطر مرتفع (≥ 5)",
    low: "خطر منخفض (< 5)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "متى يجب حساب MEWS؟",
    faqA1: "يجب حسابه بشكل روتيني مع أخذ العلامات الحيوية لاكتشاف تدهور المرضى مبكراً.",
    faqQ2: "ما هو مقياس AVPU؟",
    faqA2: "هو مقياس مبسط لتقييم الوعي: يقظ، يستجيب للصوت، يستجيب للألم، غير مستجيب.",
  }
};

export default function MewsScore({ lang }: { lang: LangCode }) {
  const [rr, setRr] = useState<number | null>(null);
  const [hr, setHr] = useState<number | null>(null);
  const [sbp, setSbp] = useState<number | null>(null);
  const [loc, setLoc] = useState<number | null>(null);
  const [temp, setTemp] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = rr !== null && hr !== null && sbp !== null && loc !== null && temp !== null;
  const totalScore = isComplete ? (rr! + hr! + sbp! + loc! + temp!) : 0;
  
  const getCategory = (val: number) => {
    if (val >= 5) return { label: currentText.high, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    return { label: currentText.low, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(totalScore);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('mews-score', lang, totalScore);
        trackCalculatorResult('mews-score', totalScore, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, totalScore, lang, category.label]);

  const renderOption = (val: number, currentVal: number | null, setter: (v: number) => void, textKey: string) => {
    return (
      <button
        key={textKey}
        onClick={() => setter(val)}
        className={`text-center px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${currentVal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm'}`}
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
          <EmbedCodeButton calculatorSlug="mews-score" lang={lang} title={currentText.title} />
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
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{currentText.rr}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(2, rr, setRr, 'rr2b')}
                  {renderOption(0, rr, setRr, 'rr0')}
                  {renderOption(1, rr, setRr, 'rr1')}
                  {renderOption(2, rr, setRr, 'rr2t')}
                  {renderOption(3, rr, setRr, 'rr3t')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.hr}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(2, hr, setHr, 'hr2b')}
                  {renderOption(1, hr, setHr, 'hr1b')}
                  {renderOption(0, hr, setHr, 'hr0')}
                  {renderOption(1, hr, setHr, 'hr1t')}
                  {renderOption(2, hr, setHr, 'hr2t')}
                  {renderOption(3, hr, setHr, 'hr3t')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.sbp}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(3, sbp, setSbp, 'sbp3b')}
                  {renderOption(2, sbp, setSbp, 'sbp2b')}
                  {renderOption(1, sbp, setSbp, 'sbp1b')}
                  {renderOption(0, sbp, setSbp, 'sbp0')}
                  {renderOption(2, sbp, setSbp, 'sbp2t')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.loc}</label>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2.5">
                  {renderOption(0, loc, setLoc, 'locAlert')}
                  {renderOption(1, loc, setLoc, 'locVoice')}
                  {renderOption(2, loc, setLoc, 'locPain')}
                  {renderOption(3, loc, setLoc, 'locUnresp')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.temp}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {renderOption(2, temp, setTemp, 'temp2b')}
                  {renderOption(0, temp, setTemp, 'temp0')}
                  {renderOption(2, temp, setTemp, 'temp2t')}
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
                <span className="text-2xl font-bold text-slate-500">/ 14</span>
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
                  { label: currentText.rr, value: rr !== null ? `${rr} pts` : '--' },
                  { label: currentText.hr, value: hr !== null ? `${hr} pts` : '--' },
                  { label: currentText.sbp, value: sbp !== null ? `${sbp} pts` : '--' },
                  { label: currentText.loc, value: loc !== null ? `${loc} pts` : '--' },
                  { label: currentText.temp, value: temp !== null ? `${temp} pts` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${totalScore} / 14` : '-- / 14' },
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
