import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "Clinical TDEE & BMR Calculator",
    subtitle: "Calculate Basal Metabolic Rate and Total Daily Energy Expenditure using Mifflin-St Jeor and clinical stress factors.",
    age: "Age (Years)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    height: "Height (cm)",
    weight: "Weight (kg)",
    stressFactor: "Clinical Stress / Activity Factor",
    factor1: "Bedbound / Sedentary (1.2)",
    factor2: "Light Activity / Minor Surgery (1.3)",
    factor3: "Moderate Stress / Infection (1.5)",
    factor4: "Severe Stress / Trauma (1.6)",
    factor5: "Major Burn / Sepsis (2.0)",
    resultBmr: "BMR (kcal/day)",
    resultTdee: "TDEE (kcal/day)",
    formula: "Mifflin-St Jeor × Stress Factor",
    clinicalTitle: "Clinical Implications",
    clinicalText: "Accurate estimation of energy requirements prevents underfeeding and overfeeding in hospitalized patients. Mifflin-St Jeor is highly reliable for non-ventilated patients.",
    references: "References: Academy of Nutrition and Dietetics (AND) guidelines; Mifflin MD, et al. (1990).",
    faqQ1: "What is BMR?",
    faqA1: "Basal Metabolic Rate is the amount of energy expended while at rest in a neutrally temperate environment.",
    faqQ2: "Why use Mifflin-St Jeor?",
    faqA2: "The Mifflin-St Jeor equation is recommended by the Academy of Nutrition and Dietetics as the most accurate predictive equation for resting metabolic rate in healthy and obese adults.",
    faqQ3: "How to apply stress factors?",
    faqA3: "Stress factors adjust the BMR to account for the increased metabolic demands of illness, surgery, or trauma. A factor of 1.2 is used for resting patients, while severe burns can increase metabolic demand to 2.0x BMR.",
  },
  fr: {
    title: "Calculateur Clinique TDEE & BMR",
    subtitle: "Calculez le Métabolisme de Base et la Dépense Énergétique Totale à l'aide de l'équation de Mifflin-St Jeor et des facteurs de stress cliniques.",
    age: "Âge (Années)",
    gender: "Genre",
    male: "Homme",
    female: "Femme",
    height: "Taille (cm)",
    weight: "Poids (kg)",
    stressFactor: "Facteur d'Activité / Stress Clinique",
    factor1: "Alité / Sédentaire (1.2)",
    factor2: "Activité Légère / Chirurgie Mineure (1.3)",
    factor3: "Stress Modéré / Infection (1.5)",
    factor4: "Stress Sévère / Traumatisme (1.6)",
    factor5: "Brûlure Majeure / Sepsis (2.0)",
    resultBmr: "BMR (kcal/jour)",
    resultTdee: "TDEE (kcal/jour)",
    formula: "Mifflin-St Jeor × Facteur de Stress",
    clinicalTitle: "Implications Cliniques",
    clinicalText: "L'estimation précise des besoins énergétiques prévient la sous-alimentation et la suralimentation chez les patients hospitalisés.",
    references: "Références: Directives de l'Academy of Nutrition and Dietetics ; Mifflin MD, et al. (1990).",
    faqQ1: "Qu'est-ce que le BMR ?",
    faqA1: "Le métabolisme de base est la quantité d'énergie dépensée au repos.",
    faqQ2: "Pourquoi utiliser Mifflin-St Jeor ?",
    faqA2: "L'équation de Mifflin-St Jeor est recommandée comme l'équation prédictive la plus précise pour le métabolisme de repos chez les adultes.",
    faqQ3: "Comment appliquer les facteurs de stress ?",
    faqA3: "Les facteurs de stress ajustent le BMR pour tenir compte des demandes métaboliques accrues dues à la maladie ou aux traumatismes.",
  }
};

export default function NutritionTdee({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70); // kg
  const [stressFactor, setStressFactor] = useState<number>(1.2);

  const currentText = translations[lang];
  const isRtl = false;

  const bmrValue = useMemo(() => {
    if (age <= 0 || height <= 0 || weight <= 0) return 0;
    // Mifflin-St Jeor
    // Men = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
    // Women = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    return Math.max(0, Math.round(bmr));
  }, [age, gender, height, weight]);

  const tdeeValue = useMemo(() => {
    return Math.round(bmrValue * stressFactor);
  }, [bmrValue, stressFactor]);

  useEffect(() => {
    if (tdeeValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('nutrition-tdee', lang, tdeeValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [tdeeValue, lang]);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="nutrition-tdee" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              {/* Gender */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.gender}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
                      gender === 'male' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {currentText.male}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`px-4 py-3 rounded-xl border font-semibold text-sm transition-all ${
                      gender === 'female' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {currentText.female}
                  </button>
                </div>
              </div>

              {/* Age */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.age}</label>
                <input
                  type="number"
                  value={age === 0 ? '' : age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all"
                  min="1" max="120"
                />
              </div>

              {/* Height */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.height}</label>
                <input
                  type="number"
                  value={height === 0 ? '' : height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all"
                  min="50" max="250"
                />
              </div>

              {/* Weight */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.weight}</label>
                <input
                  type="number"
                  value={weight === 0 ? '' : weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-xl font-semibold text-gray-900 transition-all"
                  min="10" max="300"
                />
              </div>

              {/* Stress Factor */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.stressFactor}</label>
                <select
                  value={stressFactor}
                  onChange={(e) => setStressFactor(Number(e.target.value))}
                  className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 text-base font-semibold text-gray-900 transition-all appearance-none"
                  style={isRtl ? { backgroundPosition: 'left 1rem center' } : {}}
                >
                  <option value={1.2}>{currentText.factor1}</option>
                  <option value={1.3}>{currentText.factor2}</option>
                  <option value={1.5}>{currentText.factor3}</option>
                  <option value={1.6}>{currentText.factor4}</option>
                  <option value={2.0}>{currentText.factor5}</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col p-8">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.resultBmr}
              </span>
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-5xl font-bold tracking-tighter transition-all duration-300">
                  {bmrValue > 0 ? bmrValue : '--'}
                </span>
                <span className="text-lg font-medium text-gray-400">kcal</span>
              </div>
            </div>

            <div className="relative z-10 border-t border-gray-800 pt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-3">
                {currentText.resultTdee}
              </span>
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-6xl text-emerald-400 font-bold tracking-tighter transition-all duration-300">
                  {tdeeValue > 0 ? tdeeValue : '--'}
                </span>
                <span className="text-lg font-medium text-gray-400">kcal</span>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              {tdeeValue > 0 && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.gender, value: gender === 'male' ? currentText.male : currentText.female },
                    { label: currentText.age, value: `${age} yrs` },
                    { label: currentText.height, value: `${height} cm` },
                    { label: currentText.weight, value: `${weight} kg` },
                    { label: 'Stress Factor', value: stressFactor }
                  ]}
                  results={[
                    { label: 'BMR', value: bmrValue, unit: 'kcal/day' },
                    { label: 'TDEE', value: tdeeValue, unit: 'kcal/day' }
                  ]}
                  formula={currentText.formula}
                  disclaimer={currentText.clinicalText}
                  references={currentText.references}
                  lang={lang}
                />
              )}
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
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Guidelines & References</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{currentText.references}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2 text-base">Formula</h2>
              <p className="text-gray-600 text-sm leading-relaxed font-mono bg-gray-50 p-2 rounded">
                M: 10W + 6.25H - 5A + 5<br/>
                F: 10W + 6.25H - 5A - 161
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 mb-20 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-5 font-semibold text-gray-900">
                {currentText[`faqQ${i}` as keyof Translations['en']]}
              </div>
              <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                {currentText[`faqA${i}` as keyof Translations['en']]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
