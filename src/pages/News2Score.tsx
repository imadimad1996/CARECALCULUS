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
    title: "NEWS-2 Score",
    subtitle: "National Early Warning Score for clinical deterioration",
    rr: "Respiration Rate (bpm)",
    rr3b: "≤ 8 (3)",
    rr1: "9 - 11 (1)",
    rr0: "12 - 20 (0)",
    rr2: "21 - 24 (2)",
    rr3t: "≥ 25 (3)",
    scaleChoice: "SpO2 Scale",
    scale1: "Scale 1 (Normal)",
    scale2: "Scale 2 (Hypercapnic respiratory failure)",
    spo2_1_3: "≤ 91 (3)",
    spo2_1_2: "92 - 93 (2)",
    spo2_1_1: "94 - 95 (1)",
    spo2_1_0: "≥ 96 (0)",
    spo2_2_3b: "≤ 83 (3)",
    spo2_2_2b: "84 - 85 (2)",
    spo2_2_1b: "86 - 87 (1)",
    spo2_2_0: "88 - 92 OR ≥ 93 on air (0)",
    spo2_2_1t: "93 - 94 on O2 (1)",
    spo2_2_2t: "95 - 96 on O2 (2)",
    spo2_2_3t: "≥ 97 on O2 (3)",
    airO2: "Air or Oxygen?",
    air: "Air (0)",
    oxygen: "Oxygen (2)",
    sbp: "Systolic BP (mmHg)",
    sbp3b: "≤ 90 (3)",
    sbp2: "91 - 100 (2)",
    sbp1: "101 - 110 (1)",
    sbp0: "111 - 219 (0)",
    sbp3t: "≥ 220 (3)",
    pulse: "Pulse (bpm)",
    pulse3b: "≤ 40 (3)",
    pulse1b: "41 - 50 (1)",
    pulse0: "51 - 90 (0)",
    pulse1t: "91 - 110 (1)",
    pulse2: "111 - 130 (2)",
    pulse3t: "≥ 131 (3)",
    loc: "Consciousness (ACVPU)",
    locAlert: "Alert (0)",
    locCVPU: "CVPU (3)",
    temp: "Temperature (°C)",
    temp3b: "≤ 35.0 (3)",
    temp1b: "35.1 - 36.0 (1)",
    temp0: "36.1 - 38.0 (0)",
    temp1t: "38.1 - 39.0 (1)",
    temp2: "≥ 39.1 (2)",
    result: "NEWS-2 Score",
    formula: "NEWS-2 Score = Sum of 7 physiological parameters",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Low (0-4), Medium (5-6 or RED score 3 in any parameter), High (≥7).",
    pillarTitle: "Early Warning Assessment",
    pillarText: [
      "The National Early Warning Score (NEWS) 2 is the latest version of the scoring system standardising the assessment of acute illness.",
      "A score of 3 in any single parameter represents an extreme variation and triggers an immediate medium or high clinical response."
    ],
    references: "Royal College of Physicians. National Early Warning Score (NEWS) 2. London: RCP, 2017.",
    high: "High Clinical Risk (≥ 7)",
    medium: "Medium Clinical Risk (5-6 or Single Parameter 3)",
    low: "Low Clinical Risk (0-4)",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "When to use SpO2 Scale 2?",
    faqA1: "Use Scale 2 for patients with confirmed hypercapnic respiratory failure (usually due to COPD) who have a prescribed oxygen saturation target of 88-92%.",
    faqQ2: "What does CVPU mean?",
    faqA2: "CVPU stands for Confusion, Voice, Pain, Unresponsive. Any new confusion or reduced consciousness scores a 3.",
  },
  fr: {
    title: "Score NEWS-2",
    subtitle: "Score d'alerte précoce pour la détérioration clinique",
    rr: "Fréquence Respiratoire",
    rr3b: "≤ 8 (3)",
    rr1: "9 - 11 (1)",
    rr0: "12 - 20 (0)",
    rr2: "21 - 24 (2)",
    rr3t: "≥ 25 (3)",
    scaleChoice: "Échelle SpO2",
    scale1: "Échelle 1 (Normal)",
    scale2: "Échelle 2 (Insuffisance respi hypercapnique)",
    spo2_1_3: "≤ 91 (3)",
    spo2_1_2: "92 - 93 (2)",
    spo2_1_1: "94 - 95 (1)",
    spo2_1_0: "≥ 96 (0)",
    spo2_2_3b: "≤ 83 (3)",
    spo2_2_2b: "84 - 85 (2)",
    spo2_2_1b: "86 - 87 (1)",
    spo2_2_0: "88 - 92 OU ≥ 93 Air (0)",
    spo2_2_1t: "93 - 94 O2 (1)",
    spo2_2_2t: "95 - 96 O2 (2)",
    spo2_2_3t: "≥ 97 O2 (3)",
    airO2: "Air ou Oxygène ?",
    air: "Air (0)",
    oxygen: "Oxygène (2)",
    sbp: "Pression Artérielle Systolique",
    sbp3b: "≤ 90 (3)",
    sbp2: "91 - 100 (2)",
    sbp1: "101 - 110 (1)",
    sbp0: "111 - 219 (0)",
    sbp3t: "≥ 220 (3)",
    pulse: "Pouls (bpm)",
    pulse3b: "≤ 40 (3)",
    pulse1b: "41 - 50 (1)",
    pulse0: "51 - 90 (0)",
    pulse1t: "91 - 110 (1)",
    pulse2: "111 - 130 (2)",
    pulse3t: "≥ 131 (3)",
    loc: "Conscience (ACVPU)",
    locAlert: "Alerte (0)",
    locCVPU: "CVPU / Confusion (3)",
    temp: "Température (°C)",
    temp3b: "≤ 35.0 (3)",
    temp1b: "35.1 - 36.0 (1)",
    temp0: "36.1 - 38.0 (0)",
    temp1t: "38.1 - 39.0 (1)",
    temp2: "≥ 39.1 (2)",
    result: "Score NEWS-2",
    formula: "Score = Somme de 7 paramètres physiologiques",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Faible (0-4), Moyen (5-6 ou un paramètre à 3), Élevé (≥7).",
    pillarTitle: "Évaluation Précoce",
    pillarText: [
      "Le NEWS 2 est le système standardisé d'évaluation de la maladie aiguë au Royaume-Uni, largement adopté internationalement.",
      "Un score de 3 dans n'importe quel paramètre déclenche une réponse clinique de niveau moyen à élevé."
    ],
    references: "Royal College of Physicians. National Early Warning Score (NEWS) 2. London: RCP, 2017.",
    high: "Risque Élevé (≥ 7)",
    medium: "Risque Moyen (5-6 ou Paramètre à 3)",
    low: "Risque Faible (0-4)",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Quand utiliser l'échelle SpO2 n°2 ?",
    faqA1: "Pour les patients avec une insuffisance respiratoire hypercapnique (souvent BPCO) avec un objectif de saturation à 88-92%.",
    faqQ2: "Que signifie CVPU ?",
    faqA2: "Confusion, Voix, Douleur (Pain), Inconscient (Unresponsive). Toute nouvelle confusion score à 3.",
  },
  es: {
    title: "Escala NEWS-2",
    subtitle: "Puntuación de alerta temprana para deterioro clínico",
    rr: "Frecuencia Respiratoria",
    rr3b: "≤ 8 (3)",
    rr1: "9 - 11 (1)",
    rr0: "12 - 20 (0)",
    rr2: "21 - 24 (2)",
    rr3t: "≥ 25 (3)",
    scaleChoice: "Escala SpO2",
    scale1: "Escala 1 (Normal)",
    scale2: "Escala 2 (Fallo respiratorio hipercápnico)",
    spo2_1_3: "≤ 91 (3)",
    spo2_1_2: "92 - 93 (2)",
    spo2_1_1: "94 - 95 (1)",
    spo2_1_0: "≥ 96 (0)",
    spo2_2_3b: "≤ 83 (3)",
    spo2_2_2b: "84 - 85 (2)",
    spo2_2_1b: "86 - 87 (1)",
    spo2_2_0: "88 - 92 O ≥ 93 Aire (0)",
    spo2_2_1t: "93 - 94 O2 (1)",
    spo2_2_2t: "95 - 96 O2 (2)",
    spo2_2_3t: "≥ 97 O2 (3)",
    airO2: "¿Aire u Oxígeno?",
    air: "Aire (0)",
    oxygen: "Oxígeno (2)",
    sbp: "Presión Sistólica",
    sbp3b: "≤ 90 (3)",
    sbp2: "91 - 100 (2)",
    sbp1: "101 - 110 (1)",
    sbp0: "111 - 219 (0)",
    sbp3t: "≥ 220 (3)",
    pulse: "Pulso (lpm)",
    pulse3b: "≤ 40 (3)",
    pulse1b: "41 - 50 (1)",
    pulse0: "51 - 90 (0)",
    pulse1t: "91 - 110 (1)",
    pulse2: "111 - 130 (2)",
    pulse3t: "≥ 131 (3)",
    loc: "Conciencia (ACVPU)",
    locAlert: "Alerta (0)",
    locCVPU: "CVPU / Confusión (3)",
    temp: "Temperatura (°C)",
    temp3b: "≤ 35.0 (3)",
    temp1b: "35.1 - 36.0 (1)",
    temp0: "36.1 - 38.0 (0)",
    temp1t: "38.1 - 39.0 (1)",
    temp2: "≥ 39.1 (2)",
    result: "Puntuación NEWS-2",
    formula: "Suma de 7 parámetros fisiológicos",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Bajo (0-4), Medio (5-6 o un parámetro rojo con 3), Alto (≥7).",
    pillarTitle: "Evaluación de Alerta Temprana",
    pillarText: [
      "El National Early Warning Score (NEWS) 2 es el sistema estandarizado para detectar deterioro clínico agudo.",
      "Una puntuación de 3 en un solo parámetro extremo requiere respuesta clínica inmediata."
    ],
    references: "Royal College of Physicians. National Early Warning Score (NEWS) 2. London: RCP, 2017.",
    high: "Riesgo Clínico Alto (≥ 7)",
    medium: "Riesgo Medio (5-6 o un Parámetro = 3)",
    low: "Riesgo Clínico Bajo (0-4)",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Cuándo usar la Escala 2 de SpO2?",
    faqA1: "Para pacientes con insuficiencia respiratoria hipercápnica (EPOC) con un objetivo prescrito de saturación de 88-92%.",
    faqQ2: "¿Qué significa CVPU?",
    faqA2: "Confusión, Voz, Dolor (Pain), No responde (Unresponsive). Nueva confusión suma 3 puntos.",
  },
  ar: {
    title: "مقياس NEWS-2",
    subtitle: "نظام الإنذار المبكر الوطني للتدهور السريري",
    rr: "معدل التنفس",
    rr3b: "≤ 8 (3)",
    rr1: "9 - 11 (1)",
    rr0: "12 - 20 (0)",
    rr2: "21 - 24 (2)",
    rr3t: "≥ 25 (3)",
    scaleChoice: "مقياس الأكسجين SpO2",
    scale1: "المقياس 1 (طبيعي)",
    scale2: "المقياس 2 (فشل تنفسي بفرط الكابنية)",
    spo2_1_3: "≤ 91 (3)",
    spo2_1_2: "92 - 93 (2)",
    spo2_1_1: "94 - 95 (1)",
    spo2_1_0: "≥ 96 (0)",
    spo2_2_3b: "≤ 83 (3)",
    spo2_2_2b: "84 - 85 (2)",
    spo2_2_1b: "86 - 87 (1)",
    spo2_2_0: "88 - 92 أو ≥ 93 بالهواء (0)",
    spo2_2_1t: "93 - 94 بالأكسجين (1)",
    spo2_2_2t: "95 - 96 بالأكسجين (2)",
    spo2_2_3t: "≥ 97 بالأكسجين (3)",
    airO2: "هواء أم أكسجين؟",
    air: "هواء الغرفة (0)",
    oxygen: "أكسجين (2)",
    sbp: "ضغط الدم الانقباضي",
    sbp3b: "≤ 90 (3)",
    sbp2: "91 - 100 (2)",
    sbp1: "101 - 110 (1)",
    sbp0: "111 - 219 (0)",
    sbp3t: "≥ 220 (3)",
    pulse: "النبض",
    pulse3b: "≤ 40 (3)",
    pulse1b: "41 - 50 (1)",
    pulse0: "51 - 90 (0)",
    pulse1t: "91 - 110 (1)",
    pulse2: "111 - 130 (2)",
    pulse3t: "≥ 131 (3)",
    loc: "مستوى الوعي (ACVPU)",
    locAlert: "يقظ / واعي (0)",
    locCVPU: "تخليط عقلي / استجابة للصوت فقط (3)",
    temp: "درجة الحرارة",
    temp3b: "≤ 35.0 (3)",
    temp1b: "35.1 - 36.0 (1)",
    temp0: "36.1 - 38.0 (0)",
    temp1t: "38.1 - 39.0 (1)",
    temp2: "≥ 39.1 (2)",
    result: "درجة مقياس NEWS-2",
    formula: "المجموع الكلي لـ 7 مؤشرات حيوية",
    clinicalTitle: "التفسير السريري",
    clinicalText: "منخفض (0-4)، متوسط (5-6 أو معيار واحد بقيمة 3)، عالي الخطر (≥7).",
    pillarTitle: "الإنذار المبكر",
    pillarText: [
      "مقياس NEWS-2 هو النظام القياسي لتحديد التدهور السريري الحاد للمرضى.",
      "الحصول على درجة 3 في أي معيار منفرد يستدعي استجابة طبية فورية للمريض."
    ],
    references: "Royal College of Physicians. National Early Warning Score (NEWS) 2. London: RCP, 2017.",
    high: "خطر سريري مرتفع (≥ 7)",
    medium: "خطر متوسط (5-6 أو معيار أحمر 3)",
    low: "خطر سريري منخفض (0-4)",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "متى نستخدم المقياس 2 للأكسجين؟",
    faqA1: "يستخدم للمرضى الذين لديهم فشل تنفسي مع احتباس ثاني أكسيد الكربون (مثل مرضى الانسداد الرئوي المزمن COPD) ويكون هدف الأكسجين لديهم 88-92%.",
    faqQ2: "ماذا تعني CVPU؟",
    faqA2: "أي خلل في الوعي: تشوش جديد (Confusion)، الاستجابة للصوت، الاستجابة للألم، أو عدم الاستجابة. جميعها تأخذ 3 نقاط.",
  }
};

export default function News2Score({ lang }: { lang: LangCode }) {
  const [rr, setRr] = useState<number | null>(null);
  const [scaleMode, setScaleMode] = useState<1 | 2>(1);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [air, setAir] = useState<number | null>(null);
  const [sbp, setSbp] = useState<number | null>(null);
  const [pulse, setPulse] = useState<number | null>(null);
  const [loc, setLoc] = useState<number | null>(null);
  const [temp, setTemp] = useState<number | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = rr !== null && spo2 !== null && air !== null && sbp !== null && pulse !== null && loc !== null && temp !== null;
  const totalScore = isComplete ? (rr! + spo2! + air! + sbp! + pulse! + loc! + temp!) : 0;
  
  const hasRedScore = [rr, spo2, sbp, pulse, loc, temp].some(val => val === 3);

  const getCategory = (val: number, hasRed: boolean) => {
    if (val >= 7) return { label: currentText.high, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
    if (val >= 5 || hasRed) return { label: currentText.medium, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.low, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
  };

  const category = getCategory(totalScore, hasRedScore);

  // Reset SpO2 when scale changes
  useEffect(() => {
    setSpo2(null);
  }, [scaleMode]);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('news2-score', lang, totalScore);
        trackCalculatorResult('news2-score', totalScore, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, totalScore, lang, category.label]);

  const renderOption = (val: number, currentVal: number | null, setter: (v: number) => void, textKey: string, isRed = false) => {
    return (
      <button
        key={textKey}
        onClick={() => setter(val)}
        className={`text-center px-4 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${currentVal === val ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-lg shadow-blue-500/25' : (isRed ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : 'bg-white border-gray-200/80 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300 shadow-sm')}`}
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
          <EmbedCodeButton calculatorSlug="news2-score" lang={lang} title={currentText.title} />
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
                  {renderOption(3, rr, setRr, 'rr3b', true)}
                  {renderOption(1, rr, setRr, 'rr1')}
                  {renderOption(0, rr, setRr, 'rr0')}
                  {renderOption(2, rr, setRr, 'rr2')}
                  {renderOption(3, rr, setRr, 'rr3t', true)}
                </div>
              </div>

              <div className="group pt-2">
                <div className="flex justify-between items-center mb-3 mt-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{currentText.scaleChoice}</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
                  <button onClick={() => setScaleMode(1)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${scaleMode === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{currentText.scale1}</button>
                  <button onClick={() => setScaleMode(2)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${scaleMode === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{currentText.scale2}</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {scaleMode === 1 ? (
                    <>
                      {renderOption(3, spo2, setSpo2, 'spo2_1_3', true)}
                      {renderOption(2, spo2, setSpo2, 'spo2_1_2')}
                      {renderOption(1, spo2, setSpo2, 'spo2_1_1')}
                      {renderOption(0, spo2, setSpo2, 'spo2_1_0')}
                    </>
                  ) : (
                    <>
                      {renderOption(3, spo2, setSpo2, 'spo2_2_3b', true)}
                      {renderOption(2, spo2, setSpo2, 'spo2_2_2b')}
                      {renderOption(1, spo2, setSpo2, 'spo2_2_1b')}
                      {renderOption(0, spo2, setSpo2, 'spo2_2_0')}
                      {renderOption(1, spo2, setSpo2, 'spo2_2_1t')}
                      {renderOption(2, spo2, setSpo2, 'spo2_2_2t')}
                      {renderOption(3, spo2, setSpo2, 'spo2_2_3t', true)}
                    </>
                  )}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.airO2}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {renderOption(0, air, setAir, 'air')}
                  {renderOption(2, air, setAir, 'oxygen')}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.sbp}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(3, sbp, setSbp, 'sbp3b', true)}
                  {renderOption(2, sbp, setSbp, 'sbp2')}
                  {renderOption(1, sbp, setSbp, 'sbp1')}
                  {renderOption(0, sbp, setSbp, 'sbp0')}
                  {renderOption(3, sbp, setSbp, 'sbp3t', true)}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.pulse}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(3, pulse, setPulse, 'pulse3b', true)}
                  {renderOption(1, pulse, setPulse, 'pulse1b')}
                  {renderOption(0, pulse, setPulse, 'pulse0')}
                  {renderOption(1, pulse, setPulse, 'pulse1t')}
                  {renderOption(2, pulse, setPulse, 'pulse2')}
                  {renderOption(3, pulse, setPulse, 'pulse3t', true)}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.loc}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {renderOption(0, loc, setLoc, 'locAlert')}
                  {renderOption(3, loc, setLoc, 'locCVPU', true)}
                </div>
              </div>

              <div className="group pt-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-4">{currentText.temp}</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {renderOption(3, temp, setTemp, 'temp3b', true)}
                  {renderOption(1, temp, setTemp, 'temp1b')}
                  {renderOption(0, temp, setTemp, 'temp0')}
                  {renderOption(1, temp, setTemp, 'temp1t')}
                  {renderOption(2, temp, setTemp, 'temp2')}
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
                <span className="text-2xl font-bold text-slate-500">/ 20</span>
              </div>
            </div>

            <div className="relative z-10 mt-10 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-col gap-2 transition-all shadow-lg ${category.bg} ${category.color}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-currentColor animate-pulse" />
                    <span className="font-bold text-sm tracking-wide">
                      {category.label}
                    </span>
                  </div>
                  {hasRedScore && totalScore < 7 && (
                    <div className="text-xs opacity-90 mt-1">
                      ⚠️ {lang === 'fr' ? 'Un ou plusieurs paramètres ont un score de 3 (Rouge).' : lang === 'es' ? 'Uno o más parámetros tienen puntuación 3 (Rojo).' : lang === 'ar' ? 'معيار واحد أو أكثر سجل 3 (خطر شديد).' : 'One or more individual parameters scored a 3 (Red).'}
                    </div>
                  )}
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
                  { label: "SpO2", value: spo2 !== null ? `${spo2} pts` : '--' },
                  { label: currentText.airO2, value: air !== null ? `${air} pts` : '--' },
                  { label: currentText.sbp, value: sbp !== null ? `${sbp} pts` : '--' },
                  { label: currentText.pulse, value: pulse !== null ? `${pulse} pts` : '--' },
                  { label: currentText.loc, value: loc !== null ? `${loc} pts` : '--' },
                  { label: currentText.temp, value: temp !== null ? `${temp} pts` : '--' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${totalScore} / 20` : '--' },
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
