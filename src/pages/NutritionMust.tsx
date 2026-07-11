import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

const translations: Translations = {
  en: {
    title: "MUST Score Calculator",
    subtitle: "Malnutrition Universal Screening Tool for adults to identify adults who are malnourished or at risk.",
    bmiLabel: "Step 1: BMI Score",
    bmi0: "> 20 (0 points)",
    bmi1: "18.5 - 20 (1 point)",
    bmi2: "< 18.5 (2 points)",
    weightLabel: "Step 2: Unplanned Weight Loss (Past 3-6 Months)",
    weight0: "< 5% (0 points)",
    weight1: "5 - 10% (1 point)",
    weight2: "> 10% (2 points)",
    diseaseLabel: "Step 3: Acute Disease Effect",
    disease0: "None (0 points)",
    disease2: "Acutely ill & no nutritional intake for > 5 days (2 points)",
    resultLabel: "Total MUST Score",
    risk0: "Low Risk",
    risk1: "Medium Risk",
    risk2: "High Risk",
    action0: "Routine clinical care. Repeat screening.",
    action1: "Observe. Document dietary intake for 3 days.",
    action2: "Treat. Refer to dietitian, set nutritional goals.",
    clinicalTitle: "Clinical Implications",
    clinicalText: "The MUST score is a 5-step screening tool to identify adults, who are malnourished, at risk of malnutrition (undernutrition), or obese.",
    references: "References: Malnutrition Advisory Group (MAG) of BAPEN.",
    faqQ1: "What is MUST?",
    faqA1: "The Malnutrition Universal Screening Tool (MUST) is a validated tool to identify adults who are malnourished or at risk of malnutrition.",
    faqQ2: "Who should be screened with MUST?",
    faqA2: "It is recommended for all adults upon admission to hospitals, care homes, and in the community.",
    faqQ3: "What happens if a patient is high risk?",
    faqA3: "A score of 2 or more indicates high risk. A dietitian should be involved, and a formal nutritional care plan must be initiated to improve outcomes.",
  },
  fr: {
    title: "Score MUST (Dénutrition)",
    subtitle: "Outil de dépistage universel de la malnutrition pour identifier les adultes dénutris ou à risque.",
    bmiLabel: "Étape 1 : Score IMC",
    bmi0: "> 20 (0 point)",
    bmi1: "18.5 - 20 (1 point)",
    bmi2: "< 18.5 (2 points)",
    weightLabel: "Étape 2 : Perte de Poids Involontaire (3-6 Derniers Mois)",
    weight0: "< 5% (0 point)",
    weight1: "5 - 10% (1 point)",
    weight2: "> 10% (2 points)",
    diseaseLabel: "Étape 3 : Effet de la Maladie Aiguë",
    disease0: "Aucun (0 point)",
    disease2: "Maladie aiguë & pas d'apport nutritionnel > 5 jours (2 points)",
    resultLabel: "Score MUST Total",
    risk0: "Faible Risque",
    risk1: "Risque Moyen",
    risk2: "Haut Risque",
    action0: "Soins cliniques de routine. Répéter le dépistage.",
    action1: "Observer. Documenter les apports sur 3 jours.",
    action2: "Traiter. Référer à un diététicien, fixer des objectifs.",
    clinicalTitle: "Implications Cliniques",
    clinicalText: "Le score MUST est un outil validé pour identifier la dénutrition et guider la prise en charge nutritionnelle en milieu hospitalier et communautaire.",
    references: "Références: Malnutrition Advisory Group (MAG) de BAPEN.",
    faqQ1: "Qu'est-ce que le MUST ?",
    faqA1: "Le MUST est un outil de dépistage validé et simple en 5 étapes, utilisé à travers le monde pour le dépistage de la dénutrition.",
    faqQ2: "Quand utiliser le MUST ?",
    faqA2: "Le dépistage est recommandé à l'admission à l'hôpital ou en EHPAD, puis réévalué périodiquement (ex: hebdomadaire à l'hôpital).",
    faqQ3: "Que faire en cas de haut risque ?",
    faqA3: "Un score de 2 ou plus nécessite une prise en charge nutritionnelle active, généralement avec l'aide d'un(e) diététicien(ne) et une nutrition entérale ou parentérale si nécessaire.",
  }
};

export default function NutritionMust({ lang }: { lang: LangCode }) {
  const [bmiScore, setBmiScore] = useState<number>(0);
  const [weightLossScore, setWeightLossScore] = useState<number>(0);
  const [diseaseScore, setDiseaseScore] = useState<number>(0);

  const currentText = translations[lang];
  const isRtl = false;

  const totalScore = useMemo(() => {
    return bmiScore + weightLossScore + diseaseScore;
  }, [bmiScore, weightLossScore, diseaseScore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackCalculatorUsage('nutrition-must', lang, totalScore);
    }, 1500);
    return () => clearTimeout(timer);
  }, [totalScore, lang]);

  const getRiskCategory = (score: number) => {
    if (score === 0) return { label: currentText.risk0, action: currentText.action0, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (score === 1) return { label: currentText.risk1, action: currentText.action1, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.risk2, action: currentText.action2, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getRiskCategory(totalScore);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="nutrition-must" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-6">
              
              {/* BMI Score */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.bmiLabel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="button" onClick={() => setBmiScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${bmiScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.bmi0}</button>
                  <button type="button" onClick={() => setBmiScore(1)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${bmiScore === 1 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.bmi1}</button>
                  <button type="button" onClick={() => setBmiScore(2)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${bmiScore === 2 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.bmi2}</button>
                </div>
              </div>

              {/* Weight Loss Score */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.weightLabel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="button" onClick={() => setWeightLossScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${weightLossScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.weight0}</button>
                  <button type="button" onClick={() => setWeightLossScore(1)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${weightLossScore === 1 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.weight1}</button>
                  <button type="button" onClick={() => setWeightLossScore(2)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${weightLossScore === 2 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.weight2}</button>
                </div>
              </div>

              {/* Disease Score */}
              <div className="group">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider block mb-2">{currentText.diseaseLabel}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDiseaseScore(0)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 0 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.disease0}</button>
                  <button type="button" onClick={() => setDiseaseScore(2)} className={`px-4 py-3 rounded-xl border text-sm transition-all text-left ${diseaseScore === 2 ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 font-medium'}`}>{currentText.disease2}</button>
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
                  { label: currentText.bmiLabel, value: bmiScore },
                  { label: currentText.weightLabel, value: weightLossScore },
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
