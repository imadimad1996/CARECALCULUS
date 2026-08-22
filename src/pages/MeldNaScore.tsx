import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, HeartPulse } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "MELD-Na Score",
    subtitle: "Model for End-Stage Liver Disease (with Sodium)",
    bili: "Bilirubin (mg/dL)",
    cr: "Creatinine (mg/dL)",
    inr: "INR",
    na: "Sodium (mEq/L)",
    dialysis: "Dialysis at least twice in past week?",
    yes: "Yes",
    no: "No",
    result: "MELD-Na Score",
    points: "points",
    estimatedMortality: "Estimated 90-day Mortality:",
    formula: "MELD-Na = MELD + 1.32(137-Na) - [0.033*MELD*(137-Na)]",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "The MELD-Na score is used by UNOS/OPTN to prioritize adult patients for liver transplantation. It incorporates serum sodium into the traditional MELD score to better capture the severity of liver disease.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Bilirubin, Creatinine, and INR values < 1.0 are rounded up to 1.0 by the algorithm.",
      "If the patient is on dialysis (or received CVVH), Creatinine is automatically set to 4.0 mg/dL.",
      "Sodium is bounded between 125 and 137 mEq/L for the calculation.",
      "Maximum possible score is 40."
    ],
    references: "Kim WR, et al. MELD-Na: A Survival Model for Liver Allocation. N Engl J Med. 2008.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why is Sodium included?",
    faqA1: "Hyponatremia is a strong independent predictor of mortality in patients with cirrhosis, largely reflecting severe portal hypertension and splanchnic vasodilation.",
    faqQ2: "What if the patient's sodium is 140?",
    faqA2: "The UNOS formula caps the sodium value at a maximum of 137. So any value >137 is treated as 137 in the math.",
  },
  fr: {
    title: "Score MELD-Na",
    subtitle: "Modèle pour la maladie hépatique terminale (avec Sodium)",
    bili: "Bilirubine (mg/dL)",
    cr: "Créatinine (mg/dL)",
    inr: "INR",
    na: "Sodium (mEq/L)",
    dialysis: "Dialyse (au moins 2 fois la semaine passée) ?",
    yes: "Oui",
    no: "Non",
    result: "Score MELD-Na",
    points: "points",
    estimatedMortality: "Mortalité estimée à 90 jours :",
    formula: "MELD-Na = MELD + 1.32(137-Na) - [0.033*MELD*(137-Na)]",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Le score MELD-Na est utilisé pour évaluer la gravité d'une hépatopathie chronique et prioriser les patients pour une greffe de foie.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Les valeurs de bilirubine, créatinine et INR < 1.0 sont arrondies à 1.0.",
      "Si le patient est sous dialyse, la créatinine est automatiquement fixée à 4.0 mg/dL.",
      "Le sodium est limité entre 125 et 137 mEq/L pour le calcul.",
      "Le score maximum possible est de 40."
    ],
    references: "Kim WR, et al. MELD-Na: A Survival Model for Liver Allocation. N Engl J Med. 2008.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi le sodium est-il inclus ?",
    faqA1: "L'hyponatrémie est un fort facteur prédictif de mortalité dans la cirrhose.",
    faqQ2: "Et si le sodium est à 140 ?",
    faqA2: "La formule plafonne le sodium à 137. Toute valeur supérieure est calculée comme 137.",
  },
  es: {
    title: "Puntuación MELD-Na",
    subtitle: "Modelo para Enfermedad Hepática Terminal (con Sodio)",
    bili: "Bilirrubina (mg/dL)",
    cr: "Creatinina (mg/dL)",
    inr: "INR",
    na: "Sodio (mEq/L)",
    dialysis: "¿Diálisis al menos 2 veces en la última semana?",
    yes: "Sí",
    no: "No",
    result: "Puntuación MELD-Na",
    points: "puntos",
    estimatedMortality: "Mortalidad estimada a 90 días:",
    formula: "MELD-Na = MELD + 1.32(137-Na) - [0.033*MELD*(137-Na)]",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La puntuación MELD-Na se utiliza para priorizar a los pacientes adultos para el trasplante hepático. Incorpora el sodio sérico para capturar mejor la gravedad de la enfermedad hepática.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Los valores de Bilirrubina, Creatinina e INR < 1.0 se redondean a 1.0.",
      "Si el paciente está en diálisis, la creatinina se ajusta automáticamente a 4.0 mg/dL.",
      "El sodio está limitado entre 125 y 137 mEq/L para el cálculo.",
      "La puntuación máxima posible es 40."
    ],
    references: "Kim WR, et al. MELD-Na: A Survival Model for Liver Allocation. N Engl J Med. 2008.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué se incluye el sodio?",
    faqA1: "La hiponatremia es un fuerte predictor independiente de mortalidad en pacientes con cirrosis.",
    faqQ2: "¿Qué pasa si el sodio es 140?",
    faqA2: "La fórmula limita el sodio a un máximo de 137. Valores mayores se tratan como 137.",
  },
  ar: {
    title: "مؤشر MELD-Na",
    subtitle: "نموذج أمراض الكبد في المرحلة النهائية (مع الصوديوم)",
    bili: "البيليروبين (مجم/ديسيلتر)",
    cr: "الكرياتينين (مجم/ديسيلتر)",
    inr: "مستوى INR",
    na: "الصوديوم (mEq/L)",
    dialysis: "هل خضع لغسيل كلوي مرتين على الأقل الأسبوع الماضي؟",
    yes: "نعم",
    no: "لا",
    result: "نتيجة MELD-Na",
    points: "نقطة",
    estimatedMortality: "معدل الوفيات التقديري خلال 90 يوماً:",
    formula: "MELD-Na = MELD + 1.32(137-Na) - [0.033*MELD*(137-Na)]",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يستخدم مؤشر MELD-Na لترتيب أولوية المرضى البالغين لزراعة الكبد. يضيف مستوى الصوديوم في الدم لالتقاط شدة مرض الكبد بدقة أكبر.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "يتم رفع قيم البيليروبين والكرياتينين و INR التي تقل عن 1.0 لتصبح 1.0 تلقائياً.",
      "إذا كان المريض يغسل كلى، يتم تثبيت الكرياتينين عند 4.0 مجم/ديسيلتر تلقائياً.",
      "يتم تحديد نطاق الصوديوم بين 125 و 137 ملي مكافئ/لتر في الحسابات.",
      "أقصى درجة ممكنة هي 40."
    ],
    references: "Kim WR, et al. MELD-Na: A Survival Model for Liver Allocation. N Engl J Med. 2008.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا تم إدراج الصوديوم؟",
    faqA1: "نقص صوديوم الدم هو مؤشر قوي ومستقل على الوفاة في مرضى تشمع الكبد.",
    faqQ2: "ماذا لو كان الصوديوم 140؟",
    faqA2: "الخوارزمية تضع حداً أقصى للصوديوم عند 137، لذا سيُعامل أي رقم أعلى على أنه 137.",
  }
};

export default function MeldNaScore({ lang }: { lang: LangCode }) {
  const [bili, setBili] = useState<string>('');
  const [cr, setCr] = useState<string>('');
  const [inr, setInr] = useState<string>('');
  const [na, setNa] = useState<string>('');
  const [dialysis, setDialysis] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = bili !== '' && !isNaN(parseFloat(bili)) && parseFloat(bili) > 0 &&
                     cr !== '' && !isNaN(parseFloat(cr)) && parseFloat(cr) > 0 &&
                     inr !== '' && !isNaN(parseFloat(inr)) && parseFloat(inr) > 0 &&
                     na !== '' && !isNaN(parseFloat(na)) && parseFloat(na) > 0;
  
  let finalScore = 0;
  let mortality = "";

  if (isComplete) {
    let b = Math.max(1.0, parseFloat(bili));
    let c = dialysis ? 4.0 : Math.max(1.0, parseFloat(cr));
    let i = Math.max(1.0, parseFloat(inr));
    
    // Original MELD
    let meld = 3.78 * Math.log(b) + 11.2 * Math.log(i) + 9.57 * Math.log(c) + 6.43;
    meld = Math.round(meld);
    if (meld > 40) meld = 40;

    if (meld > 11) {
      let n = parseFloat(na);
      if (n < 125) n = 125;
      if (n > 137) n = 137;
      
      let meldNa = meld + 1.32 * (137 - n) - (0.033 * meld * (137 - n));
      finalScore = Math.round(meldNa);
      if (finalScore > 40) finalScore = 40;
    } else {
      finalScore = meld;
    }

    if (finalScore <= 9) mortality = "1.9%";
    else if (finalScore <= 19) mortality = "6.0%";
    else if (finalScore <= 29) mortality = "19.6%";
    else if (finalScore <= 39) mortality = "52.6%";
    else mortality = "71.3%";
  }

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('meld-na-score', lang, finalScore);
        trackCalculatorResult('meld-na-score', finalScore, 'points', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, finalScore, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="meld-na-score" lang={lang} title={currentText.title} />
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
                  <label className="text-sm font-semibold text-gray-900">{currentText.bili}</label>
                  <input
                    type="number" inputMode="decimal"
                    value={bili}
                    onChange={(e) => setBili(e.target.value)}
                    placeholder="e.g. 1.5"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.cr}</label>
                  <input
                    type="number" inputMode="decimal"
                    value={cr}
                    onChange={(e) => setCr(e.target.value)}
                    placeholder="e.g. 1.2"
                    disabled={dialysis}
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all disabled:opacity-50"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.inr}</label>
                  <input
                    type="number" inputMode="decimal"
                    value={inr}
                    onChange={(e) => setInr(e.target.value)}
                    placeholder="e.g. 1.1"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.na}</label>
                  <input
                    type="number" inputMode="decimal"
                    value={na}
                    onChange={(e) => setNa(e.target.value)}
                    placeholder="e.g. 135"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="text-sm font-semibold text-gray-900 block mb-3">{currentText.dialysis}</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => { setDialysis(true); setCr('4.0'); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${dialysis ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {currentText.yes}
                  </button>
                  <button
                    onClick={() => setDialysis(false)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!dialysis ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {currentText.no}
                  </button>
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
                <HeartPulse className="w-5 h-5 text-red-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? finalScore : '--'}
                </span>
                {currentText.points && <span className="text-2xl font-bold text-slate-500">{currentText.points}</span>}
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg ${
                  finalScore >= 30 ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                  finalScore >= 20 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                  finalScore >= 10 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  <div className="font-bold text-sm tracking-wide mb-1">
                    {currentText.estimatedMortality}
                  </div>
                  <div className="font-semibold text-lg">{mortality}</div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez toutes les valeurs' : lang === 'es' ? 'Ingrese los valores' : lang === 'ar' ? 'أدخل جميع القيم' : 'Enter all values'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Bilirubin", value: `${bili} mg/dL` },
                  { label: "Creatinine", value: `${cr} mg/dL` },
                  { label: "INR", value: inr },
                  { label: "Sodium", value: `${na} mEq/L` },
                  { label: "Dialysis", value: dialysis ? 'Yes' : 'No' }
                ]}
                results={[
                  { label: "MELD-Na Score", value: isComplete ? finalScore.toString() : '--' },
                  { label: "Estimated 90-day Mortality", value: isComplete ? mortality : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} lang={lang} />
      </div>
    </>
  );
}

