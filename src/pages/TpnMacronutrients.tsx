import React, { useState, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, PieChart } from 'lucide-react';
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
    title: "TPN Macronutrients",
    subtitle: "Calculate total calories and macronutrient distribution for TPN",
    dextrose: "Dextrose (g)",
    amino: "Amino Acids (g)",
    lipid: "Lipids (g)",
    result: "Total Calories",
    kcal: "kcal",
    formula: "Dextrose: 3.4 kcal/g, Protein: 4 kcal/g, Lipids: 10 kcal/g",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Parenteral nutrition requires precise calculation of macronutrients to avoid overfeeding or underfeeding. Note that IV dextrose provides 3.4 kcal/g (unlike enteral carbs at 4 kcal/g) because it is a monohydrate.",
    pillarTitle: "Usage Guidelines",
    pillarText: [
      "Dextrose (Carbohydrates): Provides 3.4 kcal/g. Usually accounts for 40-60% of non-protein calories.",
      "Amino Acids (Protein): Provides 4 kcal/g. Goal is usually 1.2 - 2.0 g/kg/day depending on stress level.",
      "Lipids (Fat): Provides 10 kcal/g (due to the addition of glycerol in the emulsion). Typically 20-30% of total calories."
    ],
    references: "McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient. JPEN J Parenter Enteral Nutr. 2016.",
    distribution: "Caloric Distribution",
    faqTitle: "Frequently Asked Questions",
    faqQ1: "Why do lipids provide 10 kcal/g instead of 9?",
    faqA1: "IV lipid emulsions contain glycerol to make them isotonic, which adds extra calories, bringing the total to approximately 10 kcal per gram of fat.",
    faqQ2: "What is the maximum dextrose infusion rate?",
    faqA2: "Typically 4-5 mg/kg/min to prevent hyperglycemia and hepatic steatosis.",
  },
  fr: {
    title: "Macronutriments NPT",
    subtitle: "Calculer les calories et la répartition pour la Nutrition Parentérale Totale",
    dextrose: "Dextrose / Glucides (g)",
    amino: "Acides Aminés / Protéines (g)",
    lipid: "Lipides (g)",
    result: "Calories Totales",
    kcal: "kcal",
    formula: "Dextrose: 3.4 kcal/g, Protéines: 4 kcal/g, Lipides: 10 kcal/g",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "La nutrition parentérale nécessite un calcul précis pour éviter la sur/sous-alimentation. Le dextrose IV apporte 3,4 kcal/g (contre 4 kcal/g pour les glucides oraux) car c'est un monohydrate.",
    pillarTitle: "Recommandations d'Utilisation",
    pillarText: [
      "Dextrose (Glucides) : 3,4 kcal/g. Représente souvent 40-60% des calories non protéiques.",
      "Acides Aminés (Protéines) : 4 kcal/g. L'objectif est de 1,2 à 2,0 g/kg/jour selon l'agression.",
      "Lipides (Graisses) : 10 kcal/g (en raison du glycérol dans l'émulsion). Environ 20-30% des calories totales."
    ],
    references: "McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient. JPEN. 2016.",
    distribution: "Répartition Calorique",
    faqTitle: "Questions Fréquentes",
    faqQ1: "Pourquoi les lipides IV apportent 10 kcal/g au lieu de 9 ?",
    faqA1: "Les émulsions lipidiques IV contiennent du glycérol (pour l'isotonicité), ce qui ajoute des calories.",
    faqQ2: "Quelle est la vitesse d'infusion maximale du dextrose ?",
    faqA2: "Généralement 4-5 mg/kg/min pour éviter l'hyperglycémie et la stéatose hépatique.",
  },
  es: {
    title: "Macronutrientes NPT",
    subtitle: "Calcular calorías y distribución de la Nutrición Parenteral Total",
    dextrose: "Dextrosa / Carbohidratos (g)",
    amino: "Aminoácidos / Proteínas (g)",
    lipid: "Lípidos (g)",
    result: "Calorías Totales",
    kcal: "kcal",
    formula: "Dextrosa: 3.4 kcal/g, Proteína: 4 kcal/g, Lípidos: 10 kcal/g",
    clinicalTitle: "Interpretación Clínica",
    clinicalText: "La NPT requiere un cálculo preciso para evitar la sobre o subalimentación. La dextrosa IV aporta 3.4 kcal/g (a diferencia de los carbohidratos enterales de 4 kcal/g) porque es un monohidrato.",
    pillarTitle: "Pautas de Uso",
    pillarText: [
      "Dextrosa (Carbohidratos): 3.4 kcal/g. Representa el 40-60% de calorías no proteicas.",
      "Aminoácidos (Proteína): 4 kcal/g. Objetivo 1.2 - 2.0 g/kg/día según estrés.",
      "Lípidos (Grasas): 10 kcal/g (por el glicerol en la emulsión). 20-30% de las calorías totales."
    ],
    references: "McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient. JPEN. 2016.",
    distribution: "Distribución Calórica",
    faqTitle: "Preguntas Frecuentes",
    faqQ1: "¿Por qué los lípidos IV aportan 10 kcal/g en lugar de 9?",
    faqA1: "Las emulsiones lipídicas contienen glicerol para la isotonicidad, lo que añade calorías adicionales.",
    faqQ2: "¿Cuál es la tasa máxima de infusión de dextrosa?",
    faqA2: "Normalmente 4-5 mg/kg/min para prevenir hiperglucemia y esteatosis hepática.",
  },
  ar: {
    title: "حاسبة المغذيات للتغذية الوريدية (TPN)",
    subtitle: "حساب السعرات الحرارية الكلية وتوزيع المغذيات الكبرى",
    dextrose: "الدكستروز / الكربوهيدرات (جم)",
    amino: "الأحماض الأمينية / البروتين (جم)",
    lipid: "الدهون (جم)",
    result: "السعرات الحرارية الكلية",
    kcal: "كيلوكالوري",
    formula: "الدكستروز: 3.4، البروتين: 4، الدهون: 10 (سعرة/جم)",
    clinicalTitle: "التفسير السريري",
    clinicalText: "تتطلب التغذية الوريدية حساباً دقيقاً للمغذيات. يوفر الدكستروز الوريدي 3.4 سعرة/جم (وليس 4 سعرة/جم كالكربوهيدرات الفموية) لأنه أحادي الهيدرات.",
    pillarTitle: "إرشادات الاستخدام",
    pillarText: [
      "الدكستروز (الكربوهيدرات): 3.4 سعرة/جم. يشكل عادة 40-60% من السعرات غير البروتينية.",
      "الأحماض الأمينية (البروتين): 4 سعرة/جم. الهدف عادة 1.2 إلى 2.0 جم/كجم/يوم.",
      "الدهون: 10 سعرة/جم (بسبب إضافة الجلسرين إلى المستحلب). تشكل 20-30% من السعرات الكلية."
    ],
    references: "McClave SA, et al. Guidelines for the Provision and Assessment of Nutrition Support Therapy in the Adult Critically Ill Patient. JPEN. 2016.",
    distribution: "توزيع السعرات الحرارية",
    faqTitle: "الأسئلة الشائعة",
    faqQ1: "لماذا تعطي الدهون الوريدية 10 سعرات/جم بدلاً من 9؟",
    faqA1: "لأن مستحلبات الدهون الوريدية تحتوي على الجلسرين لجعلها متساوية التوتر (Isotonic)، مما يضيف سعرات حرارية إضافية.",
    faqQ2: "ما هو الحد الأقصى لسرعة تسريب الدكستروز؟",
    faqA2: "عادة 4-5 مجم/كجم/دقيقة لتجنب ارتفاع سكر الدم وتشحم الكبد.",
  }
};

export default function TpnMacronutrients({ lang }: { lang: LangCode }) {
  const [dextrose, setDextrose] = useState<string>('');
  const [amino, setAmino] = useState<string>('');
  const [lipid, setLipid] = useState<string>('');

  const currentText = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const dexG = parseFloat(dextrose) || 0;
  const aminoG = parseFloat(amino) || 0;
  const lipidG = parseFloat(lipid) || 0;

  const dexKcal = dexG * 3.4;
  const aminoKcal = aminoG * 4;
  const lipidKcal = lipidG * 10;
  
  const totalKcal = dexKcal + aminoKcal + lipidKcal;

  const dexPct = totalKcal > 0 ? (dexKcal / totalKcal) * 100 : 0;
  const aminoPct = totalKcal > 0 ? (aminoKcal / totalKcal) * 100 : 0;
  const lipidPct = totalKcal > 0 ? (lipidKcal / totalKcal) * 100 : 0;

  const isComplete = totalKcal > 0;

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('tpn-macronutrients', lang, totalKcal);
        trackCalculatorResult('tpn-macronutrients', totalKcal, 'kcal', lang);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, totalKcal, lang]);

  return (
    <>
      <JsonLd data={generateMedicalCalculatorSchema(currentText.title, currentText.subtitle)} />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-purple-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="w-full max-w-full max-w-3xl mb-12 relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-indigo-950 bg-clip-text text-transparent mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="tpn-macronutrients" lang={lang} title={currentText.title} />
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
                <label className="text-sm font-semibold text-gray-900">{currentText.dextrose}</label>
                <input
                  type="number" inputMode="decimal"
                  value={dextrose}
                  onChange={(e) => setDextrose(e.target.value)}
                  placeholder="e.g. 250"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.amino}</label>
                <input
                  type="number" inputMode="decimal"
                  value={amino}
                  onChange={(e) => setAmino(e.target.value)}
                  placeholder="e.g. 100"
                  className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 sm:text-sm font-medium transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900">{currentText.lipid}</label>
                <input
                  type="number" inputMode="decimal"
                  value={lipid}
                  onChange={(e) => setLipid(e.target.value)}
                  placeholder="e.g. 50"
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
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {currentText.result}
                </span>
                <PieChart className="w-5 h-5 text-blue-400" />
              </div>
              
              <div className="flex items-baseline gap-2 tabular-nums my-2" dir="ltr">
                <span className="text-7xl font-black tracking-tighter transition-all duration-300 bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {isComplete ? totalKcal.toFixed(0) : '--'}
                </span>
                <span className="text-xl font-bold text-slate-500">{currentText.kcal}</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              {isComplete ? (
                <div className="p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg bg-gray-800/50 border-gray-700/80 text-white">
                  <div className="font-bold text-sm tracking-wide mb-3 opacity-80">
                    {currentText.distribution}
                  </div>
                  
                  <div className="w-full flex h-3 rounded-full overflow-hidden mb-4 bg-gray-700">
                    <div className="bg-blue-500" style={{ width: `${dexPct}%` }} />
                    <div className="bg-purple-500" style={{ width: `${aminoPct}%` }} />
                    <div className="bg-emerald-500" style={{ width: `${lipidPct}%` }} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 opacity-70 mb-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Dex</div>
                      <span className="font-bold">{dexKcal.toFixed(0)} ({dexPct.toFixed(1)}%)</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 opacity-70 mb-1"><div className="w-2 h-2 rounded-full bg-purple-500" /> Pro</div>
                      <span className="font-bold">{aminoKcal.toFixed(0)} ({aminoPct.toFixed(1)}%)</span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 opacity-70 mb-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Fat</div>
                      <span className="font-bold">{lipidKcal.toFixed(0)} ({lipidPct.toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex justify-between items-center transition-all bg-gray-800/50 border-gray-700/80 text-slate-400 backdrop-blur-md">
                  <div className="font-semibold text-sm">
                    {lang === 'fr' ? 'Entrez les grammes' : lang === 'es' ? 'Ingrese gramos' : lang === 'ar' ? 'أدخل جرامات المغذيات' : 'Enter grams to calculate'}
                  </div>
                </div>
              )}

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Dextrose", value: `${dexG} g` },
                  { label: "Amino Acids", value: `${aminoG} g` },
                  { label: "Lipids", value: `${lipidG} g` }
                ]}
                results={[
                  { label: "Total Kcal", value: isComplete ? `${totalKcal.toFixed(0)} kcal` : '--' },
                  { label: "Carbs", value: isComplete ? `${dexPct.toFixed(1)}%` : '--' },
                  { label: "Protein", value: isComplete ? `${aminoPct.toFixed(1)}%` : '--' },
                  { label: "Fat", value: isComplete ? `${lipidPct.toFixed(1)}%` : '--' }
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

