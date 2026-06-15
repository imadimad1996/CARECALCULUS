import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "CHA₂DS₂-VASc Score for Atrial Fibrillation Stroke Risk",
    subtitle: "Estimates stroke risk in patients with atrial fibrillation",
    age: "Age",
    ageUnder65: "Under 65 (0 points)",
    age65to74: "65-74 years (+1 point)",
    age75orOver: "75 years or older (+2 points)",
    sex: "Sex",
    male: "Male (0 points)",
    female: "Female (+1 point)",
    chf: "Congestive Heart Failure history",
    htn: "Hypertension history",
    stroke: "Stroke / TIA / Thromboembolism history",
    vascular: "Vascular disease (e.g., prior MI, PAD, aortic plaque)",
    diabetes: "Diabetes Mellitus history",
    result: "Calculated Score",
    formula: "Sum of points (0 to 9)",
    clinicalTitle: "Recommendation",
    clinicalText: "Score 0 (Men) / 1 (Women): No anticoagulation recommended. Score 1 (Men): Consider anticoagulation. Score ≥ 2: Anticoagulation highly recommended.",
    references: "References: Lip GY, et al. Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the euro heart survey on atrial fibrillation.",
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk"
  },
  fr: {
    title: "Score CHA₂DS₂-VASc",
    subtitle: "Estime le risque d'AVC chez les patients avec fibrillation atriale",
    age: "Âge",
    ageUnder65: "Moins de 65 ans (0 points)",
    age65to74: "65-74 ans (+1 point)",
    age75orOver: "75 ans ou plus (+2 points)",
    sex: "Sexe",
    male: "Homme (0 points)",
    female: "Femme (+1 point)",
    chf: "Insuffisance Cardiaque Congestive",
    htn: "Hypertension Artérielle",
    stroke: "Antécédents d'AVC / AIT / Thromboembolie",
    vascular: "Maladie Vasculaire (ex: IDM, artériopathie périphérique)",
    diabetes: "Antécédent de Diabète",
    result: "Score Calculé",
    formula: "Somme des points (0 à 9)",
    clinicalTitle: "Recommandation",
    clinicalText: "Score 0 (H) / 1 (F) : Pas d'anticoagulation. Score 1 (H) : Anticoagulation à envisager. Score ≥ 2 : Anticoagulation fortement recommandée.",
    references: "Références: Lip GY, et al.",
    low: "Risque Faible",
    moderate: "Risque Modéré",
    high: "Risque Élevé"
  },
  ar: {
    title: "مقياس CHA₂DS₂-VASc",
    subtitle: "تقدير خطر السكتة الدماغية في مرضى الرجفان الأذيني",
    age: "العمر",
    ageUnder65: "أقل من 65 (0 نقطة)",
    age65to74: "65-74 سنة (+1 نقطة)",
    age75orOver: "75 سنة أو أكثر (+2 نقطة)",
    sex: "الجنس",
    male: "ذكر (0 نقطة)",
    female: "أنثى (+1 نقطة)",
    chf: "تاريخ قصور القلب الاحتقاني",
    htn: "تاريخ ارتفاع ضغط الدم",
    stroke: "سكتة دماغية / نوبة إقفارية عابرة / جلطة سابقة",
    vascular: "أمراض الأوعية الدموية (مثل احتشاء العضلة القلبية، مرض الشرايين)",
    diabetes: "تاريخ داء السكري",
    result: "النتيجة المحسوبة",
    formula: "مجموع النقاط (0 إلى 9)",
    clinicalTitle: "التوصية السريرية",
    clinicalText: "الدرجة 0 (للرجال) / 1 (للنساء): لا ينصح بمضادات التخثر. الدرجة 1 (الرجال): يُنظر في وصف مضادات التخثر. الدرجة ≥ 2: ينصح بشدة بمضادات التخثر.",
    references: "المراجع: Lip GY, et al.",
    low: "خطر منخفض",
    moderate: "خطر متوسط",
    high: "خطر عالٍ"
  }
};

export default function Cha2ds2VascScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(0); // 0: <65, 1: 65-74, 2: >=75
  const [sex, setSex] = useState<number>(0); // 0: male, 1: female
  
  const [chf, setChf] = useState<boolean>(false);
  const [htn, setHtn] = useState<boolean>(false);
  const [stroke, setStroke] = useState<boolean>(false);
  const [vascular, setVascular] = useState<boolean>(false);
  const [diabetes, setDiabetes] = useState<boolean>(false);

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const scoreValue = useMemo(() => {
    let score = 0;
    if (age === 1) score += 1;
    if (age === 2) score += 2;
    if (sex === 1) score += 1;
    if (chf) score += 1;
    if (htn) score += 1;
    if (stroke) score += 2;
    if (vascular) score += 1;
    if (diabetes) score += 1;
    return score;
  }, [age, sex, chf, htn, stroke, vascular, diabetes]);

  useEffect(() => {
    if (scoreValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('cha2ds2-vasc', lang, scoreValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scoreValue, lang]);

  const category = useMemo(() => {
    if (scoreValue >= 2) return { label: currentText.high, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' };
    if (scoreValue === 1 && sex === 0) return { label: currentText.moderate, bg: 'bg-amber-500/10 border-amber-500/20', color: 'text-amber-500' };
    if (scoreValue === 1 && sex === 1) return { label: currentText.low, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
    return { label: currentText.low, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };
  }, [scoreValue, sex, currentText]);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
          {currentText.title}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8 space-y-8">
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block">{currentText.age}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setAge(0)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${age === 0 ? 'bg-blue-600 outline-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {currentText.ageUnder65}
                </button>
                <button
                  onClick={() => setAge(1)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${age === 1 ? 'bg-blue-600 outline-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {currentText.age65to74}
                </button>
                <button
                  onClick={() => setAge(2)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${age === 2 ? 'bg-blue-600 outline-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {currentText.age75orOver}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block">{currentText.sex}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setSex(0)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${sex === 0 ? 'bg-blue-600 outline-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {currentText.male}
                </button>
                <button
                  onClick={() => setSex(1)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${sex === 1 ? 'bg-blue-600 outline-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                >
                  {currentText.female}
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              {[
                { label: currentText.chf, state: chf, setter: setChf, pts: 1 },
                { label: currentText.htn, state: htn, setter: setHtn, pts: 1 },
                { label: currentText.diabetes, state: diabetes, setter: setDiabetes, pts: 1 },
                { label: currentText.stroke, state: stroke, setter: setStroke, pts: 2 },
                { label: currentText.vascular, state: vascular, setter: setVascular, pts: 1 },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => item.setter(!item.state)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${item.state ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.state ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                    {item.state && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <span className={`text-sm font-medium ${item.state ? 'text-gray-900' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                    <span className={`text-sm font-mono shrink-0 text-gray-500`}>
                      +{item.pts}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                  {scoreValue}
                </span>
                <span className="text-xl font-medium text-gray-400">/ 9</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                <div className="font-semibold text-sm">
                  {category.label}
                </div>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.age, value: age === 0 ? currentText.ageUnder65 : age === 1 ? currentText.age65to74 : currentText.age75orOver },
                  { label: currentText.sex, value: sex === 0 ? currentText.male : currentText.female },
                  { label: currentText.chf, value: chf ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.htn, value: htn ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.diabetes, value: diabetes ? 'Yes (1)' : 'No (0)' },
                  { label: currentText.stroke, value: stroke ? 'Yes (2)' : 'No (0)' },
                  { label: currentText.vascular, value: vascular ? 'Yes (1)' : 'No (0)' }
                ]}
                results={[
                  { label: currentText.result, value: `${scoreValue} / 9` },
                  { label: 'Stroke Risk Status', value: category.label }
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

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-8 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">{layoutTranslations[lang].reviewedBy}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].specialists}</span>
          <span>&middot;</span>
          <span>{layoutTranslations[lang].updated}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{currentText.clinicalTitle}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">{layoutTranslations[lang].evidenceLit}</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
