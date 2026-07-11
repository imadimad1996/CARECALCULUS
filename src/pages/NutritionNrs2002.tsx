import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "NRS-2002 Calculator",
    subtitle: "Nutritional Risk Screening 2002. Identify hospitalized patients at nutritional risk.",
    ageLabel: "Age Adjustment",
    age0: "< 70 years (0 points)",
    age1: "≥ 70 years (+1 point)",
    nutritionalLabel: "Nutritional Status (Impaired)",
    nut0: "Normal (0 points)",
    nut1: "Mild: Wt loss > 5% in 3 mos OR Food intake 50-75% (1 pt)",
    nut2: "Moderate: Wt loss > 5% in 2 mos OR BMI 18.5-20.5 OR Food intake 25-50% (2 pts)",
    nut3: "Severe: Wt loss > 5% in 1 mo OR BMI < 18.5 OR Food intake 0-25% (3 pts)",
    diseaseLabel: "Severity of Disease",
    dis0: "Normal nutritional requirements (0 points)",
    dis1: "Mild: Hip fx, COPD, Hemodialysis, Oncology (1 pt)",
    dis2: "Moderate: Major abdominal surgery, Stroke, Severe pneumonia (2 pts)",
    dis3: "Severe: Head injury, ICU, APACHE>10, Bone marrow transplant (3 pts)",
    resultLabel: "Total NRS-2002 Score",
    risk0: "Low Nutritional Risk",
    risk1: "Nutritional Risk",
    action0: "Score < 3: Weekly rescreening. If scheduled for major surgery, a preventive plan is considered.",
    action1: "Score ≥ 3: Patient is nutritionally at risk. A nutritional care plan must be initiated.",
    clinicalTitle: "Clinical Implications",
    clinicalText: "The NRS-2002 is recommended by ESPEN for use in the hospital setting to determine if a patient will benefit from nutritional support.",
    references: "References: Kondrup J, et al. ESPEN Guidelines for Nutrition Screening 2002.",
    faqQ1: "What is NRS-2002?",
    faqA1: "The Nutritional Risk Screening 2002 is a tool designed by ESPEN to detect undernutrition and the risk of undernutrition in hospitalized patients.",
    faqQ2: "What does the score mean?",
    faqA2: "A score of 3 or higher indicates the patient is at nutritional risk and requires a nutritional care plan.",
    faqQ3: "Why is age included?",
    faqA3: "Elderly patients (≥ 70 years) have a higher inherent risk of malnutrition and worse clinical outcomes, so an extra point is added.",
  },
  fr: {
    title: "Calculateur NRS-2002",
    subtitle: "Dépistage du risque nutritionnel 2002 pour les patients hospitalisés.",
    ageLabel: "Ajustement lié à l'âge",
    age0: "< 70 ans (0 point)",
    age1: "≥ 70 ans (+1 point)",
    nutritionalLabel: "Statut Nutritionnel",
    nut0: "Normal (0 point)",
    nut1: "Léger: Perte poids > 5% en 3 mois OU Apports 50-75% (1 pt)",
    nut2: "Modéré: Perte poids > 5% en 2 mois OU IMC 18.5-20.5 OU Apports 25-50% (2 pts)",
    nut3: "Sévère: Perte poids > 5% en 1 mois OU IMC < 18.5 OU Apports 0-25% (3 pts)",
    diseaseLabel: "Sévérité de la Maladie",
    dis0: "Besoins nutritionnels normaux (0 point)",
    dis1: "Léger: Fracture col, BPCO, Hémodialyse, Oncologie (1 pt)",
    dis2: "Modéré: Chirurgie abdo majeure, AVC, Pneumonie sévère (2 pts)",
    dis3: "Sévère: Trauma crânien, Réanimation, APACHE>10, Greffe (3 pts)",
    resultLabel: "Score Total NRS-2002",
    risk0: "Faible Risque Nutritionnel",
    risk1: "Risque Nutritionnel Avéré",
    action0: "Score < 3 : Réévaluation hebdomadaire recommandée.",
    action1: "Score ≥ 3 : Le patient est à risque. Un plan de soins nutritionnels doit être initié.",
    clinicalTitle: "Implications Cliniques",
    clinicalText: "Le NRS-2002 est recommandé par l'ESPEN pour évaluer le bénéfice d'un support nutritionnel en milieu hospitalier.",
    references: "Références: Kondrup J, et al. Recommandations de l'ESPEN 2002.",
    faqQ1: "Qu'est-ce que le NRS-2002 ?",
    faqA1: "C'est un outil conçu par l'ESPEN pour détecter la dénutrition et le risque de dénutrition à l'hôpital.",
    faqQ2: "Que signifie le score ?",
    faqA2: "Un score de 3 ou plus indique un risque nutritionnel nécessitant une intervention diététique rapide.",
    faqQ3: "Pourquoi inclure l'âge ?",
    faqA3: "Les patients de 70 ans et plus sont structurellement plus à risque de morbimortalité liée à la dénutrition (+1 point).",
  }
};

export default function NutritionNrs2002({ lang }: { lang: LangCode }) {
  const [ageScore, setAgeScore] = useState<number>(0);
  const [nutritionalScore, setNutritionalScore] = useState<number>(0);
  const [diseaseScore, setDiseaseScore] = useState<number>(0);

  const currentText = translations[lang];
  const isRtl = false;

  const totalScore = useMemo(() => {
    return ageScore + nutritionalScore + diseaseScore;
  }, [ageScore, nutritionalScore, diseaseScore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('nutrition-nrs2002', lang, totalScore);
    }, 1500);
    return () => clearTimeout(timer);
  }, [totalScore, lang]);

  const getRiskCategory = (score: number) => {
    if (score < 3) return { label: currentText.risk0, action: currentText.action0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    return { label: currentText.risk1, action: currentText.action1, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getRiskCategory(totalScore);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="nutrition-nrs2002" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              {/* Age Adjustment */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.ageLabel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setAgeScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${ageScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.age0}</button>
                  <button type="button" onClick={() => setAgeScore(1)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${ageScore === 1 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.age1}</button>
                </div>
              </div>

              {/* Nutritional Status */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.nutritionalLabel}</label>
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => setNutritionalScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${nutritionalScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.nut0}</button>
                  <button type="button" onClick={() => setNutritionalScore(1)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${nutritionalScore === 1 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.nut1}</button>
                  <button type="button" onClick={() => setNutritionalScore(2)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${nutritionalScore === 2 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.nut2}</button>
                  <button type="button" onClick={() => setNutritionalScore(3)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${nutritionalScore === 3 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.nut3}</button>
                </div>
              </div>

              {/* Severity of Disease */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.diseaseLabel}</label>
                <div className="flex flex-col gap-3">
                  <button type="button" onClick={() => setDiseaseScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.dis0}</button>
                  <button type="button" onClick={() => setDiseaseScore(1)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 1 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.dis1}</button>
                  <button type="button" onClick={() => setDiseaseScore(2)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 2 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.dis2}</button>
                  <button type="button" onClick={() => setDiseaseScore(3)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 3 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.dis3}</button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col p-8">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                {currentText.resultLabel}
              </span>
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-6xl font-bold tracking-tighter transition-all duration-300">
                  {totalScore}
                </span>
                <span className="text-lg font-medium text-gray-400">pts</span>
              </div>
            </div>

            <div className="relative z-10">
              <div className={`p-4 rounded-xl border mb-4 transition-all ${category.bg} ${category.color}`}>
                <div className="font-bold text-lg mb-1">{category.label}</div>
                <div className="text-sm opacity-90">{category.action}</div>
              </div>
              
              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: currentText.ageLabel, value: ageScore },
                  { label: currentText.nutritionalLabel, value: nutritionalScore },
                  { label: currentText.diseaseLabel, value: diseaseScore }
                ]}
                results={[
                  { label: currentText.resultLabel, value: totalScore },
                  { label: 'Risk Category', value: category.label },
                  { label: 'Recommendation', value: category.action }
                ]}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
