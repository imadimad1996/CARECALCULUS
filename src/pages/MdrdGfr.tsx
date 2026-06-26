import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "MDRD GFR Equation",
    subtitle: "Estimate Glomerular Filtration Rate (GFR) for adults",
    age: "Age (Years)",
    creatinine: "Serum Creatinine",
    creatinineMg: "mg/dL",
    gender: "Gender",
    male: "Male",
    female: "Female",
    race: "Race",
    black: "Black / African American",
    other: "Other",
    result: "Estimated GFR",
    unit: "mL/min/1.73m²",
    formula: "GFR = 175 × (SCr)⁻¹·¹⁵⁴ × (Age)⁻⁰·²⁰³ × [0.742 if female] × [1.212 if Black]",
    clinicalTitle: "Clinical Application",
    clinicalText: "The MDRD equation is widely used to estimate GFR and stage Chronic Kidney Disease (CKD) in adults.",
    references: "References: Levey AS, et al. A more accurate method to estimate glomerular filtration rate from serum creatinine. Ann Intern Med.",
    normal: "G1: Normal (≥ 90)",
    mild: "G2: Mildly Decreased (60-89)",
    moderateA: "G3a: Mild-Moderate (45-59)",
    moderateB: "G3b: Moderate-Severe (30-44)",
    severe: "G4: Severely Decreased (15-29)",
    failure: "G5: Kidney Failure (< 15)",
  },
  fr: {
    title: "Équation MDRD DFG",
    subtitle: "Estimer le débit de filtration glomérulaire (DFG) pour adultes",
    age: "Âge (Années)",
    creatinine: "Créatininémie",
    creatinineMg: "mg/dL",
    gender: "Sexe",
    male: "Homme",
    female: "Femme",
    race: "Origine",
    black: "Afro-américaine",
    other: "Autre",
    result: "DFG Estimé",
    unit: "mL/min/1.73m²",
    formula: "DFG = 175 × (SCr)⁻¹·¹⁵⁴ × (Âge)⁻⁰·²⁰³ × [0.742 si femme] × [1.212 si Afro-américain]",
    clinicalTitle: "Application Clinique",
    clinicalText: "L'équation MDRD est largement utilisée pour estimer le DFG et classifier la maladie rénale chronique (MRC).",
    references: "Références : Levey AS, et al. A more accurate method to estimate glomerular filtration rate.",
    normal: "G1: Normal (≥ 90)",
    mild: "G2: Légèrement diminué (60-89)",
    moderateA: "G3a: Léger-Modéré (45-59)",
    moderateB: "G3b: Modéré-Sévère (30-44)",
    severe: "G4: Sévèrement diminué (15-29)",
    failure: "G5: Insuffisance rénale (< 15)",
  },
  ar: {
    title: "معادلة MDRD لتقدير GFR",
    subtitle: "تقدير معدل الترشيح الكبيبي (GFR) للبالغين",
    age: "العمر (سنوات)",
    creatinine: "كرياتينين المصل",
    creatinineMg: "مجم/ديسيلتر",
    gender: "الجنس",
    male: "ذكر",
    female: "أنثى",
    race: "العرق",
    black: "أسود / أفريقي أمريكي",
    other: "أخرى",
    result: "GFR المقدر",
    unit: "مل/دقيقة/1.73م²",
    formula: "GFR = 175 × (SCr)⁻¹·¹⁵⁴ × (Age)⁻⁰·²⁰³ × [0.742 للإناث] × [1.212 للعرق الأسود]",
    clinicalTitle: "التطبيق السريري",
    clinicalText: "تُستخدم معادلة MDRD على نطاق واسع لتقدير وظائف الكلى وتصنيف مراحل مرض الكلى المزمن (CKD).",
    references: "المراجع: Levey AS, et al. طريقة أكثر دقة لتقدير معدل الترشيح الكبيبي.",
    normal: "G1: طبيعي (≥ 90)",
    mild: "G2: انخفاض خفيف (60-89)",
    moderateA: "G3a: خفيف-متوسط (45-59)",
    moderateB: "G3b: متوسط-شديد (30-44)",
    severe: "G4: انخفاض شديد (15-29)",
    failure: "G5: فشل كلوي (< 15)",
  }
};

export default function MdrdGfr({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(65);
  const [creatinine, setCreatinine] = useState<number>(1.2);
  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [isBlack, setIsBlack] = useState<boolean>(false);

  const currentText = translations[lang];
  const uiText = layoutTranslations[lang];
  const isRtl = lang === 'ar';

  const gfrValue = useMemo(() => {
    if (age <= 0 || creatinine <= 0) return 0;
    let computed = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
    if (isFemale) computed = computed * 0.742;
    if (isBlack) computed = computed * 1.212;
    return parseFloat(computed.toFixed(1));
  }, [age, creatinine, isFemale, isBlack]);

  useEffect(() => {
    if (gfrValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('mdrd-gfr', lang, gfrValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gfrValue, lang]);

  const getStage = (val: number) => {
    if (val === 0) return { label: '', bg: '', color: '' };
    if (val >= 90) return { label: currentText.normal, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
    if (val >= 60) return { label: currentText.mild, bg: 'bg-green-500/10 border-green-500/20', color: 'text-green-500' };
    if (val >= 45) return { label: currentText.moderateA, bg: 'bg-blue-500/10 border-blue-500/20', color: 'text-blue-500' };
    if (val >= 30) return { label: currentText.moderateB, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-500' };
    if (val >= 15) return { label: currentText.severe, bg: 'bg-orange-500/10 border-orange-500/20', color: 'text-orange-500' };
    return { label: currentText.failure, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' };
  };

  const stage = getStage(gfrValue);

  return (
    <div className={`max-w-4xl mx-auto space-y-6 lg:space-y-8 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className={`p-3 bg-blue-100 text-blue-600 rounded-xl ${isRtl ? 'ml-4' : 'mr-4'}`}>
          <Activity className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            {currentText.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
            {currentText.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 transition-all hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
              <span className={`w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm ${isRtl ? 'ml-3' : 'mr-3'}`}>
                1
              </span>
              {uiText.parameters}
            </h3>

            <div className="space-y-6">
              {/* Gender Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  {currentText.gender}
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setIsFemale(false)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isFemale ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {currentText.male}
                  </button>
                  <button
                    onClick={() => setIsFemale(true)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isFemale ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {currentText.female}
                  </button>
                </div>
              </div>

              {/* Race Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
                  {currentText.race}
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setIsBlack(false)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isBlack ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {currentText.other}
                  </button>
                  <button
                    onClick={() => setIsBlack(true)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isBlack ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {currentText.black}
                  </button>
                </div>
              </div>

              {/* Age */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {currentText.age}
                  </label>
                  <span className="text-xl font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                    {age}
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label={currentText.age}
                />
              </div>

              {/* Creatinine */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {currentText.creatinine} ({currentText.creatinineMg})
                  </label>
                </div>
                <input
                  type="number"
                  min="0.1"
                  max="20"
                  step="0.1"
                  value={creatinine || ''}
                  onChange={(e) => setCreatinine(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 transition-colors"
                  placeholder="e.g. 1.2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
            
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2 flex items-center">
              <Activity className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              {currentText.result}
            </h3>
            
            <div className="flex items-baseline mb-4">
              <span className="text-5xl sm:text-6xl font-display font-bold text-white tracking-tight">
                {gfrValue > 0 ? gfrValue : '--'}
              </span>
              <span className={`text-xl text-slate-400 font-medium ${isRtl ? 'mr-3' : 'ml-3'}`}>
                {currentText.unit}
              </span>
            </div>

            {gfrValue > 0 && (
              <div className={`mt-6 p-4 rounded-xl border ${stage.bg} backdrop-blur-sm`}>
                <p className={`font-semibold ${stage.color} text-lg`}>
                  {stage.label}
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <ClinicalExportButton 
                lang={lang}
                data={{
                  calculator: currentText.title,
                  result: `${gfrValue} ${currentText.unit}`,
                  interpretation: stage.label,
                  parameters: {
                    [currentText.age]: `${age} years`,
                    [currentText.gender]: isFemale ? currentText.female : currentText.male,
                    [currentText.race]: isBlack ? currentText.black : currentText.other,
                    [currentText.creatinine]: `${creatinine} ${currentText.creatinineMg}`
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Info className={`w-5 h-5 text-blue-500 ${isRtl ? 'ml-2' : ''}`} />
              <h3 className="font-semibold text-slate-800">{currentText.clinicalTitle}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {currentText.clinicalText}
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <code className="text-xs text-slate-700 block font-mono">
                {currentText.formula}
              </code>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className={`w-4 h-4 text-slate-400 ${isRtl ? 'ml-2' : ''}`} />
              <h4 className="text-sm font-semibold text-slate-700">Evidence</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {currentText.references}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
