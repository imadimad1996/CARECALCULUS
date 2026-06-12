import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import { playDialTick, playTelemetrySuccess, playTelemetryAlert } from '../utils/audio';
import ClinicalExportButton from '../components/ClinicalExportButton';

const translations: Translations = {
  en: {
    title: "Body Mass Index (BMI)",
    subtitle: "Calculate objective anthropometric measurements for nutritional assessment",
    height: "Height (cm)",
    weight: "Weight (kg)",
    result: "Calculated BMI",
    formula: "BMI = Weight(kg) / (Height(m))²",
    clinicalTitle: "Clinical Implications",
    clinicalText: "BMI is used as a screening tool for overweight and obesity. It must be interpreted with clinical judgement.",
    references: "References: World Health Organization (WHO) BMI Classification.",
    categoryUnder: "Underweight",
    categoryNormal: "Normal",
    categoryOver: "Overweight",
    categoryObese: "Obese",
  },
  fr: {
    title: "Indice de Masse Corporelle (IMC)",
    subtitle: "Calculez des mesures anthropométriques objectives pour l'évaluation nutritionnelle",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    result: "IMC Calculé",
    formula: "IMC = Poids(kg) / (Taille(m))²",
    clinicalTitle: "Implications Cliniques",
    clinicalText: "L'IMC est utilisé comme outil de dépistage du surpoids et de l'obésité. A interpréter avec jugement clinique.",
    references: "Références : Classification IMC de l'Organisation Mondiale de la Santé (OMS).",
    categoryUnder: "Insuffisance pondérale",
    categoryNormal: "Normale",
    categoryOver: "Surpoids",
    categoryObese: "Obésité",
  },
  ar: {
    title: "مؤشر كتلة الجسم (BMI)",
    subtitle: "حساب القياسات الأنثروبومترية الموضوعية للتقييم الغذائي",
    height: "الطول (سم)",
    weight: "الوزن (كجم)",
    result: "المؤشر المحسوب",
    formula: "مؤشر كتلة الجسم = الوزن(كجم) / (الطول(متر))²",
    clinicalTitle: "الآثار السريرية",
    clinicalText: "يستخدم مؤشر كتلة الجسم كأداة فحص لزيادة الوزن والسمنة. يجب تفسيره بحكم سريري.",
    references: "المراجع: تصنيف منظمة الصحة العالمية (WHO) لمؤشر كتلة الجسم.",
    categoryUnder: "نقص الوزن",
    categoryNormal: "طبيعي",
    categoryOver: "زيادة الوزن",
    categoryObese: "سمنة",
  }
};

export default function BmiCalculator({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70); // kg

  const currentText = translations[lang];
  const isRtl = lang === 'ar';

  const bmiValue = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100;
    const computed = weight / (heightInMeters * heightInMeters);
    return parseFloat(computed.toFixed(1));
  }, [height, weight]);

  const getBmiCategory = (bmi: number) => {
    if (bmi === 0) return { label: '', color: '' };
    if (bmi < 18.5) return { label: currentText.categoryUnder, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (bmi < 25) return { label: currentText.categoryNormal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (bmi < 30) return { label: currentText.categoryOver, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.categoryObese, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getBmiCategory(bmiValue);

  const bmiValueIsNormal = bmiValue >= 18.5 && bmiValue < 25;
  useEffect(() => {
    if (bmiValue === 0) return;
    if (bmiValueIsNormal) {
      playTelemetrySuccess();
    } else {
      playTelemetryAlert();
    }
  }, [bmiValueIsNormal]);

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
            <div className="space-y-8">
              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.height}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={height === 0 ? '' : height}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setHeight(v);
                      playDialTick((v - 50) / 200);
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="50"
                    max="250"
                  />
                </div>
                <input 
                  type="range" min="50" max="250" 
                  value={height}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setHeight(v);
                    playDialTick((v - 50) / 200);
                  }}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.weight}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={weight === 0 ? '' : weight}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setWeight(v);
                      playDialTick((v - 10) / 290);
                    }}
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-3xl tabular-nums font-semibold text-gray-900 transition-all placeholder:text-gray-300"
                    min="10"
                    max="300"
                  />
                </div>
                <input 
                  type="range" min="10" max="300" 
                  value={weight}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setWeight(v);
                    playDialTick((v - 10) / 290);
                  }}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
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
                  {bmiValue > 0 ? bmiValue : '--'}
                </span>
                <span className="text-xl font-medium text-gray-400">kg/m²</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
                {bmiValue > 0 && (
                  <>
                    <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                      <div className="font-semibold text-sm">
                        {category.label}
                      </div>
                    </div>
                    
                    <ClinicalExportButton
                      title={currentText.title}
                      inputs={[
                        { label: currentText.height, value: `${height} cm` },
                        { label: currentText.weight, value: `${weight} kg` }
                      ]}
                      results={[
                        { label: currentText.result, value: bmiValue, unit: 'kg/m²' },
                        { label: 'Category', value: category.label }
                      ]}
                      formula={currentText.formula}
                      disclaimer={currentText.clinicalText}
                      references={currentText.references}
                      lang={lang}
                    />
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{currentText.clinicalTitle}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.clinicalText}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="w-full">
              <h3 className="font-semibold text-gray-900 mb-2">Mathematical Metric</h3>
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
              <h3 className="font-semibold text-gray-900 mb-2">Evidence & Lit</h3>
              <p className="text-gray-500 text-xs leading-relaxed italic">{currentText.references}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
