import React, { useState, useMemo } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Wells' Criteria for DVT",
    subtitle: "Determine the pretest probability of deep vein thrombosis",
    cancer: "Active cancer (treatment within 6 months or palliative)",
    paralysis: "Paralysis, paresis, or recent cast of lower extremities",
    bedridden: "Recently bedridden > 3 days, or major surgery within 12 weeks",
    tenderness: "Localized tenderness along the deep venous system",
    swelling: "Entire leg swollen",
    calfSwelling: "Calf swelling > 3 cm compared to asymptomatic leg",
    pittingEdema: "Pitting edema confined to symptomatic leg",
    collateral: "Collateral nonvaricose superficial veins",
    dvthistory: "Previously documented DVT",
    alternativeDiagnoses: "Alternative diagnosis at least as likely as DVT",
    result: "Calculated Score",
    formula: "Sum of points (-2 to 9)",
    clinicalTitle: "Clinical Next Steps",
    clinicalText: "Score ≥ 2 indicates DVT is likely; consider ultrasound. Score < 2 generally indicates DVT is unlikely; a D-dimer may be appropriate.",
    references: "References: Wells PS, et al. Value of assessment of pretest probability of deep-vein thrombosis.",
    likely: "DVT Likely",
    unlikely: "DVT Unlikely"
  },
  fr: {
    title: "Score de Wells pour l'at TVP",
    subtitle: "Déterminer la probabilité pré-test de thrombose veineuse profonde",
    cancer: "Cancer actif (traitement dans les 6 mois ou palliatif)",
    paralysis: "Paralysie, parésie ou plâtre récent des membres inférieurs",
    bedridden: "Alitement récent > 3 jours ou chirurgie majeure (< 12 sem)",
    tenderness: "Sensibilité localisée sur le trajet veineux profond",
    swelling: "Gonflement de toute la jambe",
    calfSwelling: "Gonflement du mollet > 3 cm par rapport à l'autre jambe",
    pittingEdema: "Œdème prenant le godet sur la jambe symptomatique",
    collateral: "Veines superficielles collatérales non variqueuses",
    dvthistory: "Antécédent documenté de TVP",
    alternativeDiagnoses: "Diagnostic alternatif au moins aussi probable que TVP (-2 points)",
    result: "Score Calculé",
    formula: "Somme des points (-2 à 9)",
    clinicalTitle: "Prochaines Étapes Cliniques",
    clinicalText: "Un score ≥ 2 indique que la TVP est probable ; envisagez une échographie. < 2 indique que la TVP est peu probable.",
    references: "Références : Wells PS, et al. Value of assessment of pretest probability of deep-vein thrombosis.",
    likely: "TVP Probable",
    unlikely: "TVP Peu Probable"
  },
  ar: {
    title: "معايير ويلز لتجلط الأوردة العميقة",
    subtitle: "تحديد الاحتمال المسبق لتجلط الأوردة العميقة (DVT)",
    cancer: "سرطان نشط (علاج خلال 6 أشهر أو تلطيفي)",
    paralysis: "شلل، ضعف، أو تجبير حديث في الأطراف السفلية",
    bedridden: "ملازم الفراش حديثًا لـ> 3 أيام أو جراحة كبرى خلال 12 أسبوع",
    tenderness: "ألم موضعي على طول الجهاز الوريدي العميق",
    swelling: "تورم كامل في الساق",
    calfSwelling: "تورم ربلة الساق > 3 سم مقارنة بالساق الطبيعية",
    pittingEdema: "وذمة انطباعية تقتصر على الساق المصابة",
    collateral: "أوردة سطحية جانبية غير دوالية",
    dvthistory: "تاريخ موثق مسبقًا لـ DVT",
    alternativeDiagnoses: "تشخيص بديل محتمل على الأقل مثل DVT (-2 نقطة)",
    result: "النتيجة المحسوبة",
    formula: "مجموع النقاط (من -2 إلى 9)",
    clinicalTitle: "خطوات المعالجة السريرية",
    clinicalText: "درجة ≥ 2 تشير إلى احتمال كبير لـ DVT؛ يوصى بالتصوير بالموجات. درجة < 2 تشير إلى احتمال ضعيف.",
    references: "المراجع: Wells PS, et al. تقييم الاحتمال المسبق لتجلط الأوردة.",
    likely: "محتمل",
    unlikely: "غير محتمل"
  }
};

const itemsList = [
  { key: 'cancer', points: 1 },
  { key: 'paralysis', points: 1 },
  { key: 'bedridden', points: 1 },
  { key: 'tenderness', points: 1 },
  { key: 'swelling', points: 1 },
  { key: 'calfSwelling', points: 1 },
  { key: 'pittingEdema', points: 1 },
  { key: 'collateral', points: 1 },
  { key: 'dvthistory', points: 1 },
  { key: 'alternativeDiagnoses', points: -2 },
] as const;

export default function WellsScore({ lang }: { lang: LangCode }) {
  const [selections, setSelections] = useState<Record<string, boolean>>({});

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const toggleSelection = (key: string) => {
    setSelections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scoreValue = useMemo(() => {
    return itemsList.reduce((acc, item) => {
      return acc + (selections[item.key] ? item.points : 0);
    }, 0);
  }, [selections]);

  const category = scoreValue >= 2 
    ? { label: currentText.likely, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-500' }
    : { label: currentText.unlikely, bg: 'bg-emerald-500/10 border-emerald-500/20', color: 'text-emerald-500' };

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
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-4">
              
              {itemsList.map(item => (
                <div 
                  key={item.key}
                  onClick={() => toggleSelection(item.key)}
                  className={`p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 ${selections[item.key] ? 'border-blue-500 bg-blue-50/30 ring-1 ring-blue-500/30' : 'border-gray-200'}`}
                >
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selections[item.key] ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                    {selections[item.key] && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <span className={`text-sm font-medium ${selections[item.key] ? 'text-gray-900' : 'text-gray-700'}`}>
                      {currentText[item.key]}
                    </span>
                    <span className={`text-sm font-mono shrink-0 ${item.points > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                      {item.points > 0 ? `+${item.points}` : item.points}
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
                <span className="text-xl font-medium text-gray-400">Points</span>
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
                inputs={itemsList.map(item => ({
                  label: currentText[item.key],
                  value: selections[item.key] ? 'YES (+1 pt)' : 'NO (0 pt)'
                }))}
                results={[
                  { label: 'Wells Score', value: `${scoreValue} Points` },
                  { label: 'Risk Probability', value: category.label }
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
          <span className="font-semibold text-gray-500">Reviewed by the CareCalculus Clinical Team</span>
          <span>&middot;</span>
          <span>MD, ICU &amp; Emergency Medicine specialists</span>
          <span>&middot;</span>
          <span>Updated 2026</span>
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
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Mathematical Metric</h2>
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
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Evidence & Lit</h2>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
