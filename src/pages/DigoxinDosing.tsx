import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, HeartPulse } from 'lucide-react';
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
    title: "Digoxin Dosing Calculator",
    subtitle: "Calculate Total Digitalizing Dose (TDD) and Maintenance Dose",
    age: "Age (years)",
    sex: "Sex",
    male: "Male",
    female: "Female",
    height: "Height (cm)",
    weight: "Actual Weight (kg)",
    scr: "Serum Creatinine (mg/dL)",
    tddTitle: "Total Digitalizing Dose (IV)",
    maintTitle: "Daily Maintenance Dose",
    formula: "TDD = 10 mcg/kg IBW. Maint = TDD × [14 + (CrCl/5)] / 100",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Digoxin distributes primarily into lean tissue, so Ideal Body Weight (IBW) is used for dosing. The Total Digitalizing Dose (TDD) is usually given as 50% initially, followed by 25% increments every 6 hours.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Target serum concentrations for heart failure are typically 0.5 - 0.9 ng/mL.",
      "Target for atrial fibrillation may be higher (0.8 - 2.0 ng/mL), but toxicity risk increases significantly above 2.0 ng/mL.",
      "Renal function strictly determines the maintenance dose as digoxin is primarily cleared by the kidneys.",
      "Hypokalemia, hypomagnesemia, and hypercalcemia increase the risk of digoxin toxicity."
    ],
    references: "Jelliffe RW. An improved method of digoxin therapy. Ann Intern Med. 1968.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "How do I switch from IV to PO?",
    faqA1: "Bioavailability of oral tablets is about 70-80% compared to IV. When switching from IV to PO, the dose is generally increased by 20-25%.",
    faqQ2: "What if the patient is obese?",
    faqA2: "Digoxin does not distribute into adipose tissue. Ideal Body Weight (IBW) should be used regardless of how much the actual weight exceeds IBW.",
  },
  fr: {
    title: "Dose de Digoxine",
    subtitle: "Calculer la dose de charge totale et la dose d'entretien",
    age: "Âge (ans)",
    sex: "Sexe",
    male: "Homme",
    female: "Femme",
    height: "Taille (cm)",
    weight: "Poids réel (kg)",
    scr: "Créatinine sérique (mg/dL)",
    tddTitle: "Dose de Charge Totale (IV)",
    maintTitle: "Dose d'Entretien (jour)",
    formula: "Charge = 10 mcg/kg Poids Idéal. Entretien = Charge × [14 + (ClCr/5)] / 100",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "La digoxine se distribue dans la masse maigre, le Poids Idéal (IBW) est donc utilisé. La dose de charge est souvent administrée à 50% d'abord, puis 25% toutes les 6 heures.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Concentrations cibles pour l'insuffisance cardiaque : 0,5 - 0,9 ng/mL.",
      "Cibles pour la FA peuvent être plus élevées (0,8 - 2,0 ng/mL), mais le risque de toxicité augmente fortement > 2,0.",
      "La fonction rénale dicte la dose d'entretien.",
      "L'hypokaliémie et l'hypomagnésémie augmentent le risque de toxicité."
    ],
    references: "Jelliffe RW. An improved method of digoxin therapy. Ann Intern Med. 1968.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Comment passer de l'IV au per os (PO) ?",
    faqA1: "La biodisponibilité des comprimés est de 70-80%. La dose est généralement augmentée de 20-25% lors du passage IV vers PO.",
    faqQ2: "Et si le patient est obèse ?",
    faqA2: "La digoxine ne va pas dans les graisses. Le poids idéal (IBW) doit être utilisé.",
  },
  es: {
    title: "Dosis de Digoxina",
    subtitle: "Calcular Dosis Total de Digitalización y Dosis de Mantenimiento",
    age: "Edad (años)",
    sex: "Sexo",
    male: "Hombre",
    female: "Mujer",
    height: "Altura (cm)",
    weight: "Peso Real (kg)",
    scr: "Creatinina Sérica (mg/dL)",
    tddTitle: "Dosis Total de Digitalización (IV)",
    maintTitle: "Dosis de Mantenimiento (diaria)",
    formula: "DTD = 10 mcg/kg PPI. Mantenimiento = DTD × [14 + (AclCr/5)] / 100",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La digoxina se distribuye principalmente en tejido magro, por lo que se usa el Peso Corporal Ideal (IBW). La Dosis Total (TDD) se suele dar al 50% inicial, seguido de 25% cada 6 horas.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Concentración objetivo para insuficiencia cardíaca: 0.5 - 0.9 ng/mL.",
      "Para fibrilación auricular puede ser mayor (0.8 - 2.0 ng/mL), riesgo tóxico > 2.0.",
      "La función renal determina estrictamente la dosis de mantenimiento.",
      "Hipopotasemia y la hipomagnesemia aumentan el riesgo de toxicidad."
    ],
    references: "Jelliffe RW. An improved method of digoxin therapy. Ann Intern Med. 1968.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Cómo cambiar de IV a VO?",
    faqA1: "La biodisponibilidad de las pastillas es del 70-80%. Al cambiar de IV a VO, la dosis se incrementa un 20-25%.",
    faqQ2: "¿Qué pasa si el paciente es obeso?",
    faqA2: "La digoxina no se distribuye en tejido adiposo. Siempre se debe usar el Peso Corporal Ideal.",
  },
  ar: {
    title: "حاسبة جرعة الديجوكسين",
    subtitle: "حساب الجرعة التحميلية الكلية وجرعة المداومة",
    age: "العمر (سنوات)",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    height: "الطول (سم)",
    weight: "الوزن الفعلي (كجم)",
    scr: "كرياتينين المصل (mg/dL)",
    tddTitle: "الجرعة التحميلية الكلية (وريدي)",
    maintTitle: "جرعة المداومة اليومية",
    formula: "التحميل = 10 ميكروجرام/كجم من الوزن المثالي. المداومة = التحميل × [14 + (تصفية الكرياتينين/5)] / 100",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يتوزع الديجوكسين بشكل أساسي في الأنسجة الخالية من الدهون، لذلك يُستخدم الوزن المثالي للجسم (IBW). تُعطى الجرعة التحميلية الكلية عادة بنسبة 50% مبدئياً، ثم تليها 25% كل 6 ساعات.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "التركيز المستهدف لقصور القلب هو عادة 0.5 - 0.9 نانوجرام/مل.",
      "قد يكون التركيز للرجفان الأذيني أعلى (0.8 - 2.0)، لكن خطر السمية يزداد بشدة فوق 2.0.",
      "تحدد وظائف الكلى جرعة المداومة بصرامة.",
      "نقص البوتاسيوم ونقص المغنيسيوم يزيدان من خطر سمية الديجوكسين."
    ],
    references: "Jelliffe RW. An improved method of digoxin therapy. Ann Intern Med. 1968.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "كيف يمكنني التحويل من الحقن الوريدي (IV) إلى الفموي (PO)؟",
    faqA1: "التوافر الحيوي للأقراص الفموية هو حوالي 70-80%. عند التحويل، تتم زيادة الجرعة عادة بنسبة 20-25%.",
    faqQ2: "ماذا لو كان المريض يعاني من السمنة؟",
    faqA2: "لا يتوزع الديجوكسين في الأنسجة الدهنية. يجب استخدام الوزن المثالي (IBW) دائماً.",
  }
};

export default function DigoxinDosing({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'M' | 'F' | null>(null);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [scr, setScr] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = age && sex && height && weight && scr;

  let tdd = 0;
  let maint = 0;
  let crcl = 0;
  let ibw = 0;

  if (isComplete) {
    const ageNum = parseFloat(age);
    const heightCm = parseFloat(height);
    // const weightKg = parseFloat(weight);
    const scrNum = parseFloat(scr);

    const heightInches = heightCm / 2.54;
    
    // Ideal Body Weight
    if (sex === 'M') {
      ibw = 50 + 2.3 * Math.max(0, heightInches - 60);
    } else {
      ibw = 45.5 + 2.3 * Math.max(0, heightInches - 60);
    }

    // Cockcroft-Gault CrCl using IBW
    crcl = ((140 - ageNum) * ibw) / (72 * scrNum);
    if (sex === 'F') {
      crcl *= 0.85;
    }

    // Cap CrCl to avoid bizarre maint percentages
    if (crcl > 140) crcl = 140;

    // Total Digitalizing Dose (TDD) IV
    tdd = 10 * ibw; // mcg

    // Maintenance Dose IV
    const percentage = (14 + (crcl / 5)) / 100;
    maint = tdd * percentage; // mcg
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('digoxin-dosing', lang, tdd);
        trackCalculatorResult('digoxin-dosing', tdd, 'mcg TDD', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, tdd, lang]);

  const renderToggle = (val: any, setter: any, option1: any, option2: any, label1: string, label2: string) => (
    <div className="flex bg-gray-100 p-1 rounded-xl w-full">
      <button
        onClick={() => setter(option1)}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${val === option1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
      >
        {label1}
      </button>
      <button
        onClick={() => setter(option2)}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${val === option2 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
      >
        {label2}
      </button>
    </div>
  );

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="digoxin-dosing" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.age}</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 65"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.sex}</label>
                  {renderToggle(sex, setSex, 'M', 'F', currentText.male, currentText.female)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.height}</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.weight}</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="75"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.scr}</label>
                <input
                  type="number"
                  step="0.1"
                  value={scr}
                  onChange={(e) => setScr(e.target.value)}
                  placeholder="1.0"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 z-40 lg:top-28 lg:bottom-auto backdrop-blur-2xl bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950 text-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/15 flex flex-col justify-between p-5 lg:p-8 lg:min-h-[360px] transition-all duration-300">
            <div className="absolute top-0 right-0 p-36 bg-gradient-to-bl from-blue-500/30 via-indigo-500/10 to-transparent rounded-bl-[120px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10 space-y-6">
              
              {/* TDD Result */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-300">
                    {currentText.tddTitle}
                  </span>
                  <HeartPulse className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-baseline gap-2 tabular-nums my-1" dir="ltr">
                  <span className="text-5xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    {isComplete ? Math.round(tdd) : '--'}
                  </span>
                  <span className="text-xl font-bold text-slate-500">mcg</span>
                </div>
              </div>

              {/* Maintenance Result */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                    {currentText.maintTitle}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 tabular-nums my-1" dir="ltr">
                  <span className="text-4xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                    {isComplete ? Math.round(maint) : '--'}
                  </span>
                  <span className="text-xl font-bold text-slate-500">mcg / day</span>
                </div>
              </div>

            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className="p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg bg-gray-800/50 border-gray-700/80 text-slate-300 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span>Est. CrCl:</span>
                    <span className="font-bold">{crcl.toFixed(1)} mL/min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ideal Body Wt:</span>
                    <span className="font-bold">{ibw.toFixed(1)} kg</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Complétez les informations' : lang === 'es' ? 'Complete la información' : lang === 'ar' ? 'أكمل إدخال البيانات' : 'Complete all fields to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age", value: `${age} years` },
                  { label: "Sex", value: sex === 'M' ? 'Male' : 'Female' },
                  { label: "Height", value: `${height} cm` },
                  { label: "Weight", value: `${weight} kg` },
                  { label: "Scr", value: `${scr} mg/dL` }
                ]}
                results={[
                  { label: "IBW", value: isComplete ? `${ibw.toFixed(1)} kg` : '--' },
                  { label: "CrCl", value: isComplete ? `${crcl.toFixed(1)} mL/min` : '--' },
                  { label: "TDD", value: isComplete ? `${Math.round(tdd)} mcg` : '--' },
                  { label: "Maintenance", value: isComplete ? `${Math.round(maint)} mcg/day` : '--' }
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
