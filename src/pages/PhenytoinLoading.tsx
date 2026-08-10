import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Syringe } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PHARMACY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Phenytoin Loading Dose",
    subtitle: "Calculate IV loading dose for Phenytoin or Fosphenytoin",
    weight: "Weight (kg)",
    currentLvl: "Current Level (mcg/mL or mg/L)",
    targetLvl: "Target Level (mcg/mL or mg/L)",
    result: "Loading Dose",
    mg: "mg (or mg PE)",
    formula: "Dose = [(Target - Current) × 0.65 L/kg × Wt] / 0.92",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Calculates the loading dose needed to reach a target serum phenytoin concentration. Assumes a Volume of Distribution (Vd) of 0.65 L/kg and a salt fraction (S) of 0.92 for phenytoin sodium.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Phenytoin MAX infusion rate: 50 mg/min to avoid severe hypotension and arrhythmias.",
      "Fosphenytoin MAX infusion rate: 150 mg PE/min.",
      "In elderly or patients with cardiovascular disease, use a slower rate (e.g. 25 mg/min for phenytoin).",
      "Therapeutic range is typically 10 - 20 mcg/mL. A target of 15-20 mcg/mL is often used for loading."
    ],
    references: "Winter ME. Basic Clinical Pharmacokinetics. 5th ed. Lippincott Williams & Wilkins; 2010.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Should I use actual or ideal body weight?",
    faqA1: "For non-obese patients, actual body weight is used. In obesity, a modified weight might be considered, as Vd is larger due to lipid solubility, but usually, an adjusted weight or actual weight is used depending on institutional protocol.",
    faqQ2: "What is 'mg PE' for Fosphenytoin?",
    faqA2: "PE stands for Phenytoin Equivalents. Fosphenytoin is ordered and dosed in terms of mg PE. 1 mg PE is equivalent to 1 mg of phenytoin sodium.",
  },
  fr: {
    title: "Dose de Charge de Phénytoïne",
    subtitle: "Calculer la dose de charge IV pour la Phénytoïne ou Fosphénytoïne",
    weight: "Poids (kg)",
    currentLvl: "Taux Actuel (mcg/mL ou mg/L)",
    targetLvl: "Taux Cible (mcg/mL ou mg/L)",
    result: "Dose de Charge",
    mg: "mg (ou mg PE)",
    formula: "Dose = [(Cible - Actuel) × 0.65 L/kg × Poids] / 0.92",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Calcule la dose de charge nécessaire pour atteindre une concentration sérique cible. Suppose un volume de distribution (Vd) de 0,65 L/kg et une fraction saline (S) de 0,92.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Vitesse MAX Phénytoïne : 50 mg/min pour éviter l'hypotension et les arythmies.",
      "Vitesse MAX Fosphénytoïne : 150 mg PE/min.",
      "Chez les personnes âgées ou cardiaques, ralentir la perfusion (ex: 25 mg/min).",
      "La zone thérapeutique est généralement de 10 à 20 mcg/mL. Une cible de 15-20 mcg/mL est souvent utilisée en charge."
    ],
    references: "Winter ME. Basic Clinical Pharmacokinetics. 5th ed. 2010.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Dois-je utiliser le poids réel ou idéal ?",
    faqA1: "Pour les patients non obèses, le poids réel. En cas d'obésité, un poids ajusté est parfois utilisé selon les protocoles locaux.",
    faqQ2: "Que signifie 'mg PE' pour la Fosphénytoïne ?",
    faqA2: "PE signifie 'Équivalent Phénytoïne'. La fosphénytoïne est prescrite en mg PE. 1 mg PE = 1 mg de phénytoïne sodique.",
  },
  es: {
    title: "Dosis de Carga de Fenitoína",
    subtitle: "Calcular dosis de carga IV de Fenitoína o Fosfenitoína",
    weight: "Peso (kg)",
    currentLvl: "Nivel Actual (mcg/mL o mg/L)",
    targetLvl: "Nivel Objetivo (mcg/mL o mg/L)",
    result: "Dosis de Carga",
    mg: "mg (o mg PE)",
    formula: "Dosis = [(Objetivo - Actual) × 0.65 L/kg × Peso] / 0.92",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Calcula la dosis de carga necesaria para alcanzar una concentración sérica objetivo. Asume un Volumen de Distribución (Vd) de 0.65 L/kg y una fracción de sal (S) de 0.92.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Velocidad MÁX de Fenitoína: 50 mg/min para evitar hipotensión grave y arritmias.",
      "Velocidad MÁX de Fosfenitoína: 150 mg PE/min.",
      "En ancianos o cardiópatas, usar una velocidad menor (ej. 25 mg/min).",
      "El rango terapéutico es 10-20 mcg/mL. A menudo se usa 15-20 mcg/mL como objetivo de carga."
    ],
    references: "Winter ME. Basic Clinical Pharmacokinetics. 5th ed. 2010.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Debo usar peso real o ideal?",
    faqA1: "En pacientes no obesos, se usa el peso real. En obesidad se puede considerar un peso ajustado según el protocolo local.",
    faqQ2: "¿Qué significa 'mg PE' en Fosfenitoína?",
    faqA2: "Equivalentes de Fenitoína. La fosfenitoína se dosifica en mg PE. 1 mg PE = 1 mg de fenitoína sódica.",
  },
  ar: {
    title: "الجرعة التحميلية للفينيتوين",
    subtitle: "حساب الجرعة الوريدية التحميلية للفينيتوين والفوسفينيتوين",
    weight: "الوزن (كجم)",
    currentLvl: "المستوى الحالي (mcg/mL أو mg/L)",
    targetLvl: "المستوى المستهدف (mcg/mL أو mg/L)",
    result: "الجرعة التحميلية",
    mg: "مجم (أو مجم مكافئ)",
    formula: "الجرعة = [(المستهدف - الحالي) × 0.65 لتر/كجم × الوزن] / 0.92",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يحسب الجرعة التحميلية اللازمة للوصول إلى التركيز المستهدف في المصل. يفترض أن حجم التوزيع (Vd) هو 0.65 لتر/كجم وأن معامل الملح (S) هو 0.92.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "السرعة القصوى للفينيتوين: 50 مجم/دقيقة لتجنب انخفاض الضغط الشديد واضطراب النظم.",
      "السرعة القصوى للفوسفينيتوين: 150 مجم PE/دقيقة.",
      "في كبار السن ومرضى القلب، استخدم معدل تسريب أبطأ (مثل 25 مجم/دقيقة).",
      "النطاق العلاجي عادة 10 - 20 ميكروجرام/مل. الهدف الشائع في الجرعة التحميلية هو 15-20 ميكروجرام/مل."
    ],
    references: "Winter ME. Basic Clinical Pharmacokinetics. 5th ed. 2010.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل أستخدم الوزن الفعلي أم المثالي؟",
    faqA1: "في المرضى غير المصابين بالسمنة، يُستخدم الوزن الفعلي. في حالة السمنة، قد يُستخدم وزن معدل حسب البروتوكول المحلي.",
    faqQ2: "ماذا تعني 'mg PE' في الفوسفينيتوين؟",
    faqA2: "تعني 'مكافئ الفينيتوين'. يتم وصف الفوسفينيتوين بمكافئات الفينيتوين (PE). 1 مجم PE يعادل 1 مجم من الفينيتوين الصوديوم.",
  }
};

export default function PhenytoinLoading({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<string>('');
  const [currentLvl, setCurrentLvl] = useState<string>('0');
  const [targetLvl, setTargetLvl] = useState<string>('20');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = weight !== '' && !isNaN(parseFloat(weight)) && 
                     currentLvl !== '' && !isNaN(parseFloat(currentLvl)) &&
                     targetLvl !== '' && !isNaN(parseFloat(targetLvl));

  let result = 0;
  if (isComplete) {
    const w = parseFloat(weight);
    const c = parseFloat(currentLvl);
    const t = parseFloat(targetLvl);
    
    // Check if target is greater than current
    if (t > c) {
      // Vd = 0.65 L/kg, S = 0.92
      result = ((t - c) * 0.65 * w) / 0.92;
    } else {
      result = 0; // No loading dose needed if current >= target
    }
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('phenytoin-loading', lang, result);
        trackCalculatorResult('phenytoin-loading', result, 'mg', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, result, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="phenytoin-loading" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.weight}</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.currentLvl}</label>
                  <input
                    type="number"
                    value={currentLvl}
                    onChange={(e) => setCurrentLvl(e.target.value)}
                    placeholder="0"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.targetLvl}</label>
                  <input
                    type="number"
                    value={targetLvl}
                    onChange={(e) => setTargetLvl(e.target.value)}
                    placeholder="20"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
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
                <Syringe className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? Math.round(result) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">{currentText.mg}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className="p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg bg-red-500/10 border-red-500/20 text-red-400">
                  <div className="font-bold text-sm tracking-wide mb-1">
                    ⚠️ Maximum Infusion Rates
                  </div>
                  <ul className="text-sm opacity-90 list-disc ml-4 space-y-1 mt-2">
                    <li>Phenytoin: 50 mg/min</li>
                    <li>Fosphenytoin: 150 mg PE/min</li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez le poids et les taux' : lang === 'es' ? 'Ingrese peso y niveles' : lang === 'ar' ? 'أدخل الوزن والمستويات' : 'Enter weight and levels'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Weight", value: `${weight} kg` },
                  { label: "Current Level", value: `${currentLvl} mcg/mL` },
                  { label: "Target Level", value: `${targetLvl} mcg/mL` }
                ]}
                results={[
                  { label: "Loading Dose", value: isComplete ? `${Math.round(result)} mg` : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_PHARMACY} lang={lang} />
      </div>
    </>
  );
}
