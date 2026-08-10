import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Heart } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage, trackCalculatorResult } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';
import { JsonLd, generateMedicalCalculatorSchema } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "ASCVD Risk Estimator",
    subtitle: "10-Year Risk for Atherosclerotic Cardiovascular Disease (ACC/AHA)",
    age: "Age (20-79 years)",
    sex: "Sex",
    male: "Male",
    female: "Female",
    race: "Race",
    white: "White / Other",
    aa: "African American",
    totChol: "Total Cholesterol (mg/dL)",
    hdl: "HDL Cholesterol (mg/dL)",
    sbp: "Systolic BP (mmHg)",
    bpMed: "On Blood Pressure Medication?",
    diabetes: "Diabetes?",
    smoker: "Current Smoker?",
    yes: "Yes",
    no: "No",
    result: "10-Year ASCVD Risk",
    formula: "Pooled Cohort Equations (ACC/AHA)",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Estimates the 10-year risk of a first hard atherosclerotic cardiovascular disease (ASCVD) event (nonfatal myocardial infarction, CHD death, or fatal/nonfatal stroke).",
    pillarTitle: "Management Guidelines",
    pillarText: [
      "Low Risk (<5%): Emphasize lifestyle to reduce risk factors.",
      "Borderline Risk (5% to <7.5%): Consider statin therapy if risk-enhancing factors are present.",
      "Intermediate Risk (7.5% to <20%): Moderate-intensity statin is recommended.",
      "High Risk (≥20%): High-intensity statin is strongly recommended."
    ],
    references: "Goff DC Jr, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk. J Am Coll Cardiol. 2014.",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Who is this calculator for?",
    faqA1: "Adults aged 40-79 years without a prior history of ASCVD.",
    faqQ2: "What if the patient is younger than 40?",
    faqA2: "The 10-year risk equations are only validated for ages 40-79. For patients 20-39, lifetime risk is typically evaluated instead.",
  },
  fr: {
    title: "Évaluateur de Risque ASCVD",
    subtitle: "Risque à 10 ans de maladie cardiovasculaire athéroscléreuse (ACC/AHA)",
    age: "Âge (20-79 ans)",
    sex: "Sexe",
    male: "Homme",
    female: "Femme",
    race: "Origine",
    white: "Blanc / Autre",
    aa: "Afro-américain",
    totChol: "Cholestérol Total (mg/dL)",
    hdl: "Cholestérol HDL (mg/dL)",
    sbp: "Pression Systolique (mmHg)",
    bpMed: "Sous traitement hypotenseur ?",
    diabetes: "Diabète ?",
    smoker: "Fumeur actif ?",
    yes: "Oui",
    no: "Non",
    result: "Risque ASCVD à 10 ans",
    formula: "Équations de cohorte (ACC/AHA)",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Estime le risque à 10 ans d'un premier événement cardiovasculaire (infarctus non fatal, décès coronarien, ou AVC).",
    pillarTitle: "Recommandations de Gestion",
    pillarText: [
      "Risque Faible (<5%) : Mode de vie sain.",
      "Risque Limite (5% à <7.5%) : Envisager une statine si des facteurs aggravants sont présents.",
      "Risque Intermédiaire (7.5% à <20%) : Statine d'intensité modérée recommandée.",
      "Risque Élevé (≥20%) : Statine de haute intensité fortement recommandée."
    ],
    references: "Goff DC Jr, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk. J Am Coll Cardiol. 2014.",
    faqTitle: "Questions Fréquentes",
    faqQ1: "À qui s'adresse ce calculateur ?",
    faqA1: "Adultes de 40 à 79 ans sans antécédents d'ASCVD.",
    faqQ2: "Et pour les patients de moins de 40 ans ?",
    faqA2: "Les équations à 10 ans ne sont validées que pour les 40-79 ans. Pour les 20-39 ans, on évalue généralement le risque à vie.",
  },
  es: {
    title: "Estimador de Riesgo ASCVD",
    subtitle: "Riesgo a 10 años de enfermedad cardiovascular aterosclerótica (ACC/AHA)",
    age: "Edad (20-79 años)",
    sex: "Sexo",
    male: "Hombre",
    female: "Mujer",
    race: "Raza",
    white: "Blanco / Otro",
    aa: "Afroamericano",
    totChol: "Colesterol Total (mg/dL)",
    hdl: "Colesterol HDL (mg/dL)",
    sbp: "Presión Sistólica (mmHg)",
    bpMed: "¿Tratamiento para la presión arterial?",
    diabetes: "¿Diabetes?",
    smoker: "¿Fumador actual?",
    yes: "Sí",
    no: "No",
    result: "Riesgo ASCVD a 10 años",
    formula: "Ecuaciones de Cohorte (ACC/AHA)",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "Estima el riesgo a 10 años de un primer evento cardiovascular aterosclerótico (infarto no fatal, muerte por enfermedad coronaria o accidente cerebrovascular).",
    pillarTitle: "Pautas de Manejo",
    pillarText: [
      "Riesgo Bajo (<5%): Estilo de vida saludable.",
      "Riesgo Límite (5% a <7.5%): Considerar estatina si hay factores agravantes.",
      "Riesgo Intermedio (7.5% a <20%): Se recomienda estatina de intensidad moderada.",
      "Riesgo Alto (≥20%): Se recomienda encarecidamente estatina de alta intensidad."
    ],
    references: "Goff DC Jr, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk. J Am Coll Cardiol. 2014.",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Para quién es esta calculadora?",
    faqA1: "Adultos de 40 a 79 años sin antecedentes de ASCVD.",
    faqQ2: "¿Qué pasa si el paciente tiene menos de 40 años?",
    faqA2: "Las ecuaciones a 10 años solo están validadas para 40-79 años. Para 20-39 años, se evalúa el riesgo de por vida.",
  },
  ar: {
    title: "مقياس خطر ASCVD",
    subtitle: "خطر الإصابة بأمراض القلب والأوعية الدموية خلال 10 سنوات (ACC/AHA)",
    age: "العمر (20-79 سنة)",
    sex: "الجنس",
    male: "ذكر",
    female: "أنثى",
    race: "العرق",
    white: "أبيض / أخرى",
    aa: "أمريكي من أصل أفريقي",
    totChol: "الكوليسترول الكلي (mg/dL)",
    hdl: "الكوليسترول النافع HDL (mg/dL)",
    sbp: "ضغط الدم الانقباضي (mmHg)",
    bpMed: "هل يتناول أدوية لضغط الدم؟",
    diabetes: "هل يعاني من السكري؟",
    smoker: "هل هو مدخن حالياً؟",
    yes: "نعم",
    no: "لا",
    result: "خطر ASCVD خلال 10 سنوات",
    formula: "معادلات مجمعة (ACC/AHA)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "يقدر الخطر لمدة 10 سنوات لحدوث أول حدث قلبي وعائي تصلبي (احتشاء عضلة القلب، الوفاة بسبب أمراض القلب، أو السكتة الدماغية).",
    pillarTitle: "إرشادات الإدارة",
    pillarText: [
      "خطر منخفض (أقل من 5%): التركيز على نمط الحياة الصحي.",
      "خطر حدي (5% إلى <7.5%): النظر في العلاج بالستاتين إذا وجدت عوامل خطر إضافية.",
      "خطر متوسط (7.5% إلى <20%): يوصى باستخدام ستاتين متوسط القوة.",
      "خطر عالي (≥20%): يوصى بشدة باستخدام ستاتين عالي القوة."
    ],
    references: "Goff DC Jr, et al. 2013 ACC/AHA guideline on the assessment of cardiovascular risk. J Am Coll Cardiol. 2014.",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لمن هذه الحاسبة؟",
    faqA1: "للبالغين الذين تتراوح أعمارهم بين 40 و 79 عاماً ولا يوجد لديهم تاريخ سابق بأمراض القلب والأوعية الدموية.",
    faqQ2: "ماذا لو كان المريض أصغر من 40 عاماً؟",
    faqA2: "تم التحقق من صحة هذه المعادلات للأعمار 40-79 فقط.",
  }
};

// ASCVD Pooled Cohort Equations (2013)
const calculateAscvd = (
  isMale: boolean,
  isAA: boolean,
  age: number,
  tc: number,
  hdl: number,
  sbp: number,
  bpMed: boolean,
  smoker: boolean,
  diabetic: boolean
): number => {
  const lnAge = Math.log(age);
  const lnTc = Math.log(tc);
  const lnHdl = Math.log(hdl);
  const lnSbp = Math.log(sbp);

  let sum = 0;
  let meanTerm = 0;
  let baselineSurvival = 0;

  if (!isMale && !isAA) {
    // White Female
    sum = -29.799 * lnAge + 4.884 * (lnAge ** 2) + 13.540 * lnTc - 3.114 * (lnAge * lnTc)
      - 13.578 * lnHdl + 3.149 * (lnAge * lnHdl)
      + (bpMed ? 2.019 * lnSbp : 1.957 * lnSbp)
      + (smoker ? 7.574 - 1.665 * lnAge : 0)
      + (diabetic ? 0.661 : 0);
    meanTerm = -29.18;
    baselineSurvival = 0.9665;
  } else if (!isMale && isAA) {
    // AA Female
    sum = 17.114 * lnAge + 0.940 * lnTc - 18.920 * lnHdl + 4.475 * (lnAge * lnHdl)
      + (bpMed ? 29.291 * lnSbp - 6.432 * (lnAge * lnSbp) : 27.820 * lnSbp - 6.087 * (lnAge * lnSbp))
      + (smoker ? 0.691 : 0)
      + (diabetic ? 0.874 : 0);
    meanTerm = 86.61;
    baselineSurvival = 0.9533;
  } else if (isMale && !isAA) {
    // White Male
    sum = 12.344 * lnAge + 11.853 * lnTc - 2.664 * (lnAge * lnTc)
      - 7.990 * lnHdl + 1.769 * (lnAge * lnHdl)
      + (bpMed ? 1.797 * lnSbp : 1.764 * lnSbp)
      + (smoker ? 7.837 - 1.795 * lnAge : 0)
      + (diabetic ? 0.658 : 0);
    meanTerm = 61.18;
    baselineSurvival = 0.9144;
  } else if (isMale && isAA) {
    // AA Male
    sum = 2.469 * lnAge + 0.302 * lnTc - 0.307 * lnHdl
      + (bpMed ? 1.916 * lnSbp : 1.809 * lnSbp)
      + (smoker ? 0.549 : 0)
      + (diabetic ? 0.645 : 0);
    meanTerm = 19.54;
    baselineSurvival = 0.8954;
  }

  const risk = 1 - Math.pow(baselineSurvival, Math.exp(sum - meanTerm));
  return risk * 100;
};

export default function AscvdRiskScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<'M' | 'F' | null>(null);
  const [race, setRace] = useState<'White' | 'AA' | null>(null);
  const [tc, setTc] = useState<string>('');
  const [hdl, setHdl] = useState<string>('');
  const [sbp, setSbp] = useState<string>('');
  const [bpMed, setBpMed] = useState<boolean | null>(null);
  const [diabetic, setDiabetic] = useState<boolean | null>(null);
  const [smoker, setSmoker] = useState<boolean | null>(null);

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const isComplete = age && sex && race && tc && hdl && sbp && bpMed !== null && diabetic !== null && smoker !== null;
  
  let riskPercent = 0;
  if (isComplete) {
    riskPercent = calculateAscvd(
      sex === 'M',
      race === 'AA',
      parseFloat(age),
      parseFloat(tc),
      parseFloat(hdl),
      parseFloat(sbp),
      bpMed!,
      smoker!,
      diabetic!
    );
  }

  const getCategory = (val: number) => {
    if (val >= 20) return { label: 'High Risk', color: 'text-red-500', bg: 'bg-red-50 border-red-200' };
    if (val >= 7.5) return { label: 'Intermediate Risk', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' };
    if (val >= 5) return { label: 'Borderline Risk', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' };
    return { label: 'Low Risk', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' };
  };

  const category = getCategory(riskPercent);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('ascvd-risk-score', lang, riskPercent);
        trackCalculatorResult('ascvd-risk-score', riskPercent, category.label, lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, riskPercent, lang, category.label]);

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
          <EmbedCodeButton calculatorSlug="ascvd-risk-score" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3 leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="lg:col-span-7 space-y-6">
          <div className="backdrop-blur-xl bg-white/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-950/5 p-6 md:p-8 transition-all">
            <div className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.age}</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="40"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.sex}</label>
                  {renderToggle(sex, setSex, 'M', 'F', currentText.male, currentText.female)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.race}</label>
                {renderToggle(race, setRace, 'White', 'AA', currentText.white, currentText.aa)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.totChol}</label>
                  <input
                    type="number"
                    value={tc}
                    onChange={(e) => setTc(e.target.value)}
                    placeholder="170"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.hdl}</label>
                  <input
                    type="number"
                    value={hdl}
                    onChange={(e) => setHdl(e.target.value)}
                    placeholder="50"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">{currentText.sbp}</label>
                  <input
                    type="number"
                    value={sbp}
                    onChange={(e) => setSbp(e.target.value)}
                    placeholder="120"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.bpMed}</label>
                {renderToggle(bpMed, setBpMed, true, false, currentText.yes, currentText.no)}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.diabetes}</label>
                {renderToggle(diabetic, setDiabetic, true, false, currentText.yes, currentText.no)}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.smoker}</label>
                {renderToggle(smoker, setSmoker, true, false, currentText.yes, currentText.no)}
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
                <Heart className="w-5 h-5 text-red-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? riskPercent.toFixed(1) : '--'}
                </span>
                <span className="text-2xl font-bold text-slate-500">%</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
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
                    {lang === 'fr' ? 'Complétez les informations' : lang === 'es' ? 'Complete la información' : lang === 'ar' ? 'أكمل إدخال البيانات' : 'Complete all fields to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age", value: age },
                  { label: "Sex", value: sex },
                  { label: "Race", value: race },
                  { label: "Total Chol", value: tc },
                  { label: "HDL", value: hdl },
                  { label: "SBP", value: sbp },
                  { label: "BP Med", value: bpMed ? 'Yes' : 'No' },
                  { label: "Diabetes", value: diabetic ? 'Yes' : 'No' },
                  { label: "Smoker", value: smoker ? 'Yes' : 'No' }
                ]}
                results={[
                  { label: currentText.result, value: isComplete ? `${riskPercent.toFixed(1)}%` : '--' }
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
        <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} lang={lang} />
      </div>
    </>
  );
}
