import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Heart, AlertCircle } from 'lucide-react';
import { LangCode, Translations } from '../types';
import CalculatorShell from '../components/CalculatorShell';
import ReviewBadge from '../components/ReviewBadge';
import EvidencePanel from '../components/EvidencePanel';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import { ActionableResultPanel, RiskLevel } from '../components/ActionableResultPanel';
import { ClinicalContextTabs } from '../components/ClinicalContextTabs';
import EmbedCodeButton from '../components/ui/EmbedCodeButton';

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
    pillarTitle: "Clinical Limitations and Modern Anthropometric Context",
    pillarText: [
      "Body Mass Index (BMI) was originally developed by Adolphe Quetelet in the 19th century as a population-level statistical metric, not as an individual clinical diagnostic tool. While it remains the globally recognized standard for identifying weight categories—due to its simplicity, cost-effectiveness, and non-invasiveness—its clinical utility is inherently limited by its inability to distinguish between lean body mass and adiposity.",
      "A primary physiological drawback of BMI is its failure to account for body fat distribution. Visceral adiposity, rather than subcutaneous fat or overall weight, is the primary driver of cardiometabolic risk, insulin resistance, and systemic inflammation. Therefore, clinical guidelines heavily recommend complementing BMI with waist circumference or waist-to-hip ratio measurements to better stratify cardiovascular and metabolic risk.",
      "Crucially, the interpretation of BMI must be individualized. In athletes and bodybuilders, a high BMI may falsely indicate obesity due to significant muscle hypertrophy. Conversely, in the elderly population or individuals with chronic illnesses, a 'normal' BMI might mask sarcopenic obesity—a condition characterized by severe muscle depletion alongside high fat mass, which carries a poor clinical prognosis. Additionally, ethnic and demographic variations are profound; for instance, Asian populations exhibit elevated risks for type 2 diabetes and cardiovascular disease at significantly lower BMI thresholds compared to Caucasian populations."
    ],
    references: "References: World Health Organization (WHO) BMI Classification.",
    categoryUnder: "Underweight",
    categoryNormal: "Normal",
    categoryOver: "Overweight",
    categoryObese: "Obese",
    faqQ1: "What is Body Mass Index (BMI)?",
    faqA1: "BMI is a numeric value derived from a person's weight and height: Weight(kg) ÷ Height(m)². It is used as a population-level screening tool for underweight, normal weight, overweight, and obesity categories.",
    faqQ2: "What are the WHO BMI classification categories?",
    faqA2: "WHO classifies BMI as: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (≥30). The obese category is further divided into Class I (30–34.9), II (35–39.9), and III (≥40, severe obesity).",
    faqQ3: "What are the limitations of BMI in clinical practice?",
    faqA3: "BMI does not distinguish between fat and muscle mass, does not reflect fat distribution, and may misclassify athletes or elderly patients. It should be interpreted alongside waist circumference, clinical context, and comorbidities.",
    faqQ4: "Is BMI accurate for all ethnicities?",
    faqA4: "Asian populations have higher cardiometabolic risk at lower BMI thresholds. WHO and several national guidelines recommend lower obesity cut-offs for Asian adults: overweight ≥23, obese ≥27.5.",
    heightRange: "Height should be between 50 and 250 cm.",
    weightRange: "Weight should be between 10 and 300 kg.",
    resetBtn: "Reset to Default",
    targetBmi: "Target BMI (Optional)",
    bsa: "Body Surface Area (BSA)",
    weightDiff: "Weight Difference",
    targetExplanation: "To reach target BMI of {bmi}, weight must be {weight} kg ({diff} kg)"
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
    pillarTitle: "Limites Cliniques et Contexte Anthropométrique Moderne",
    pillarText: [
      "L'Indice de Masse Corporelle (IMC) a été initialement développé par Adolphe Quetelet au 19ème siècle comme une mesure statistique à l'échelle de la population, et non comme un outil de diagnostic clinique individuel. Bien qu'il reste la norme mondialement reconnue pour identifier les catégories de poids (en raison de sa simplicité et de son faible coût), son utilité clinique est intrinsèquement limitée par son incapacité à distinguer la masse maigre de l'adiposité.",
      "L'un des principaux inconvénients physiologiques de l'IMC est son incapacité à tenir compte de la répartition des graisses corporelles. L'adiposité viscérale, plutôt que la graisse sous-cutanée ou le poids global, est le principal moteur du risque cardiométabolique, de l'insulinorésistance et de l'inflammation systémique. Par conséquent, les directives cliniques recommandent fortement de compléter l'IMC par des mesures du tour de taille afin de mieux stratifier le risque métabolique.",
      "De plus, l'interprétation de l'IMC doit être hautement individualisée. Chez les athlètes, un IMC élevé peut faussement indiquer une obésité en raison d'une hypertrophie musculaire importante. À l'inverse, chez les personnes âgées, un IMC « normal » peut masquer une obésité sarcopénique (épuisement musculaire sévère associé à une masse grasse élevée), qui est de très mauvais pronostic. Enfin, les variations ethniques sont profondes : les populations asiatiques, par exemple, présentent des risques élevés de diabète de type 2 à des seuils d'IMC nettement inférieurs."
    ],
    references: "Références : Classification IMC de l'Organisation Mondiale de la Santé (OMS).",
    categoryUnder: "Insuffisance pondérale",
    categoryNormal: "Normale",
    categoryOver: "Surpoids",
    categoryObese: "Obésité",
    faqQ1: "Qu'est-ce que l'indice de masse corporelle (IMC) ?",
    faqA1: "L'IMC est une valeur numérique dérivée du poids et de la taille d'une personne : Poids(kg) ÷ Taille(m)². Il est utilisé comme outil de dépistage de l'insuffisance pondérale, du poids normal, du surpoids et de l'obésité.",
    faqQ2: "Quelles sont les catégories de classification de l'IMC de l'OMS ?",
    faqA2: "L'OMS classe l'IMC comme suit : Insuffisance pondérale (<18,5), Poids normal (18,5-24,9), Surpoids (25-29,9) et Obésité (≥30). La catégorie obèse est subdivisée en classe I (30-34,9), II (35-39,9) et III (≥40, obésité sévère).",
    faqQ3: "Quelles sont les limites de l'IMC en pratique clinique ?",
    faqA3: "L'IMC ne distingue pas la masse grasse de la masse musculaire, ne reflète pas la répartition des graisses et peut mal classer les athlètes ou les patients âgés. Il doit être interprété avec la circonférence de la taille, le contexte clinique et les comorbidités.",
    faqQ4: "L'IMC est-il précis pour toutes les ethnies ?",
    faqA4: "Les populations asiatiques présentent un risque cardiométabolique plus élevé à des seuils d'IMC plus bas. L'OMS et plusieurs directives nationales recommandent des seuils d'obésité plus bas pour les adultes asiatiques : surpoids ≥23, obésité ≥27,5.",
    heightRange: "La taille doit être comprise entre 50 et 250 cm.",
    weightRange: "Le poids doit être compris entre 10 et 300 kg.",
    resetBtn: "Réinitialiser",
    targetBmi: "IMC Cible (Optionnel)",
    bsa: "Surface Corporelle (BSA)",
    weightDiff: "Différence de poids",
    targetExplanation: "Pour atteindre l'IMC cible de {bmi}, le poids doit être de {weight} kg ({diff} kg)"
  },
};

export default function BmiCalculator({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(70); // kg
  const [targetBmiStr, setTargetBmiStr] = useState<string>(''); // string for empty input

  const currentText = translations[lang];
  const isRtl = false;
  
  const isHeightWarning = height > 0 && (height < 50 || height > 250);
  const isWeightWarning = weight > 0 && (weight < 10 || weight > 300);

  const bmiValue = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100;
    const computed = weight / (heightInMeters * heightInMeters);
    return parseFloat(computed.toFixed(1));
  }, [height, weight]);

  const bsaValue = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    // DuBois formula: BSA = 0.007184 * W^0.425 * H^0.725
    const computed = 0.007184 * Math.pow(weight, 0.425) * Math.pow(height, 0.725);
    return parseFloat(computed.toFixed(2));
  }, [height, weight]);

  const targetWeight = useMemo(() => {
    if (height <= 0 || !targetBmiStr) return null;
    const t = parseFloat(targetBmiStr);
    if (isNaN(t) || t <= 0) return null;
    const heightInMeters = height / 100;
    return parseFloat((t * (heightInMeters * heightInMeters)).toFixed(1));
  }, [height, targetBmiStr]);

  useEffect(() => {
    if (bmiValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('bmi-calculator', lang, bmiValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bmiValue, lang]);

  const getBmiCategory = (bmi: number) => {
    if (bmi === 0) return { label: '', color: '' };
    if (bmi < 18.5) return { label: currentText.categoryUnder, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
    if (bmi < 25) return { label: currentText.categoryNormal, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (bmi < 30) return { label: currentText.categoryOver, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    return { label: currentText.categoryObese, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
  };

  const category = getBmiCategory(bmiValue);

  const getRiskLevel = (bmi: number): RiskLevel => {
    if (bmi === 0) return 'neutral';
    if (bmi < 18.5) return 'high';
    if (bmi < 25) return 'low';
    if (bmi < 30) return 'medium';
    return 'high';
  };

  const getNextSteps = (bmi: number) => {
    if (bmi === 0) return [];
    if (bmi < 18.5) return [
      currentText.categoryUnder + ": " + (lang === 'fr' ? 'Évaluation nutritionnelle recommandée.' : 'Nutritional assessment recommended.'),
      lang === 'fr' ? 'Dépistage des troubles de l\'alimentation ou de la malnutrition.' : 'Screen for eating disorders or malnutrition.'
    ];
    if (bmi < 25) return [
      currentText.categoryNormal + ": " + (lang === 'fr' ? 'Maintenir le mode de vie actuel.' : 'Maintain current lifestyle.'),
      lang === 'fr' ? 'Bilan de santé annuel de routine.' : 'Routine annual wellness check.'
    ];
    if (bmi < 30) return [
      currentText.categoryOver + ": " + (lang === 'fr' ? 'Conseils sur l\'alimentation et l\'exercice physique.' : 'Diet and exercise counseling.'),
      lang === 'fr' ? 'Dépistage des comorbidités (diabète, hypertension).' : 'Screen for comorbidities (diabetes, hypertension).'
    ];
    return [
      currentText.categoryObese + ": " + (lang === 'fr' ? 'Prise en charge médicale intensive du poids.' : 'Intensive medical weight management.'),
      lang === 'fr' ? 'Évaluation stricte des risques cardiovasculaires.' : 'Strict cardiovascular risk assessment.'
    ];
  };

  const bmiValueIsNormal = bmiValue >= 18.5 && bmiValue < 25;

  // Inject Localized FAQ and MedicalCalculator Schema
  useEffect(() => {
    let schemaScript = document.getElementById('bmi-calculator-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'bmi-calculator-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { q: currentText.faqQ1, a: currentText.faqA1 },
          { q: currentText.faqQ2, a: currentText.faqA2 },
          { q: currentText.faqQ3, a: currentText.faqA3 },
          { q: currentText.faqQ4, a: currentText.faqA4 },
        ].map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a }
        }))
      },
      {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        '@id': window.location.href,
        name: currentText.title,
        description: currentText.subtitle,
        about: {
          '@type': 'MedicalCalculator',
          name: 'BMI and BSA Calculator',
          description: 'Calculates Body Mass Index (BMI), Target Weight, and Body Surface Area (BSA).'
        }
      }
    ]);

    return () => {
      if (schemaScript) schemaScript.remove();
    };
  }, [lang, currentText]);

  return (
    <>
      <div className="max-w-3xl mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-3 ${isRtl ? 'leading-normal' : ''}`}>
            {currentText.title}
          </h1>
          <EmbedCodeButton calculatorSlug="bmi-calculator" lang={lang} title={currentText.title} />
        </div>
        <p className="text-lg text-gray-500 max-w-2xl mt-3">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-gray-950/5 p-6 md:p-8">
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  {layoutTranslations[lang].parameters}
                </h3>
                <button
                  onClick={() => { setHeight(170); setWeight(70); setTargetBmiStr(''); }}
                  className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl border border-gray-200 transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  {currentText.resetBtn}
                </button>
              </div>

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
                    }}
                    className={`w-full bg-gray-50/50 px-4 py-4 border rounded-xl focus:outline-none focus:bg-white focus:ring-4 text-3xl tabular-nums font-semibold transition-all placeholder:text-gray-300 ${
                      isHeightWarning 
                        ? 'border-rose-500 focus:ring-rose-550/10 focus:border-rose-500 text-rose-900 bg-rose-50/10' 
                        : 'border-gray-200 focus:ring-teal-600/10 focus:border-teal-600 text-[#0891B2]'
                    }`}
                    min="50"
                    max="250"
                  />
                </div>
                <input 
                  type="range" min="50" max="250" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                {isHeightWarning && (
                  <p className="text-xs text-rose-550 font-bold mt-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>{currentText.heightRange}</span>
                  </p>
                )}
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
                    }}
                    className={`w-full bg-gray-50/50 px-4 py-4 border rounded-xl focus:outline-none focus:bg-white focus:ring-4 text-3xl tabular-nums font-semibold transition-all placeholder:text-gray-300 ${
                      isWeightWarning 
                        ? 'border-rose-500 focus:ring-rose-550/10 focus:border-rose-500 text-rose-900 bg-rose-50/10' 
                        : 'border-gray-200 focus:ring-teal-600/10 focus:border-teal-600 text-[#0891B2]'
                    }`}
                    min="10"
                    max="300"
                  />
                </div>
                <input 
                  type="range" min="10" max="300" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full mt-4 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                {isWeightWarning && (
                  <p className="text-xs text-rose-550 font-bold mt-1.5 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>{currentText.weightRange}</span>
                  </p>
                )}
              </div>

              <div className="group pt-4 border-t border-gray-100">
                <div className="flex justify-between items-baseline mb-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{currentText.targetBmi}</label>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    value={targetBmiStr}
                    onChange={(e) => setTargetBmiStr(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full bg-gray-50/50 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-teal-600/10 focus:border-teal-600 text-[#0891B2] text-3xl tabular-nums font-semibold transition-all placeholder:text-gray-300"
                    min="10"
                    max="50"
                  />
                </div>
              </div>
            </div>
            
            <ClinicalContextTabs 
              lang={lang}
              context={{
                whenToUse: currentText.clinicalText,
                pearlsPitfalls: (
                  <ul className="space-y-2 list-disc pl-4">
                    {currentText.pillarText.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                ),
                evidence: "World Health Organization (WHO) BMI Classification standards, identifying optimal ranges for metabolic health."
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky bottom-4 lg:top-28 z-20">
            {bmiValue > 0 ? (
              <div className="space-y-4">
                <ActionableResultPanel
                  lang={lang}
                  title={currentText.result}
                  score={`${bmiValue} kg/m²`}
                  riskLevel={getRiskLevel(bmiValue)}
                  interpretation={category.label}
                  nextSteps={getNextSteps(bmiValue)}
                />

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">{currentText.bsa}</span>
                    <span className="text-lg font-black text-[#0891B2]">{bsaValue} m²</span>
                  </div>
                  
                  {targetWeight && targetBmiStr && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-500 uppercase">{currentText.weightDiff}</span>
                        <span className="text-lg font-black text-[#16A34A]">
                          {weight > targetWeight ? '-' : '+'}{Math.abs(weight - targetWeight).toFixed(1)} kg
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {currentText.targetExplanation.replace('{bmi}', targetBmiStr).replace('{weight}', targetWeight.toString()).replace('{diff}', Math.abs(weight - targetWeight).toFixed(1))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm">
                <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  {lang === 'fr' ? 'Entrez la taille et le poids pour voir les résultats' : 'Enter height and weight to see results'}
                </p>
              </div>
            )}
            
            {bmiValue > 0 && (
              <div className="mt-4">
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: currentText.height, value: `${height} cm` },
                    { label: currentText.weight, value: `${weight} kg` }
                  ]}
                  results={[
                    { label: currentText.result, value: bmiValue, unit: 'kg/m²' },
                    { label: 'Category', value: category.label },
                    { label: currentText.bsa, value: bsaValue, unit: 'm²' },
                    ...(targetWeight ? [{ label: `Target Weight (BMI ${targetBmiStr})`, value: targetWeight, unit: 'kg' }] : [])
                  ]}
                  formula={currentText.formula}
                  disclaimer={currentText.clinicalText}
                  references={currentText.references}
                  lang={lang}
                />
              </div>
            )}
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
              <a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">WHO BMI Classification (who.int) →</a>
            </div>
          </div>
        </div>
      </div>
      

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'Ideal & Adjusted Body Weight', path: '/adjusted-body-weight' },
            { label: 'Creatinine Clearance', path: '/creatinine-clearance' },
            { label: 'Tidal Volume (ARDS)', path: '/tidal-volume' },
            { label: 'MELD Score', path: '/meld-score' },
          ].map(({ label, path }) => {
            const prefix = lang === 'en' ? '' : `/${lang}`;
            return (
              <a key={path} href={`${prefix}${path}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors border border-gray-200 hover:border-blue-200">
                {label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-0 pt-0 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{layoutTranslations[lang].faqTitle}</h2>
        <div className="space-y-3">
          {[
            { q: currentText.faqQ1, a: currentText.faqA1 },
            { q: currentText.faqQ2, a: currentText.faqA2 },
            { q: currentText.faqQ3, a: currentText.faqA3 },
            { q: currentText.faqQ4, a: currentText.faqA4 },
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
      
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">WHO BMI Classifications</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Classification</th>
                <th className="px-6 py-4">BMI Range (kg/m²)</th>
                <th className="px-6 py-4 rounded-tr-xl">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-blue-50/50">
                <td className="px-6 py-4">Underweight</td>
                <td className="px-6 py-4 font-mono">&lt; 18.5</td>
                <td className="px-6 py-4 text-amber-600">Increased</td>
              </tr>
              <tr className="hover:bg-green-50/50">
                <td className="px-6 py-4 font-medium text-gray-900">Normal Range</td>
                <td className="px-6 py-4 font-mono font-bold text-[#0891B2]">18.5 - 24.9</td>
                <td className="px-6 py-4 text-green-600">Lowest</td>
              </tr>
              <tr className="hover:bg-orange-50/50">
                <td className="px-6 py-4">Overweight</td>
                <td className="px-6 py-4 font-mono">25.0 - 29.9</td>
                <td className="px-6 py-4 text-orange-600">Increased</td>
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="px-6 py-4">Obese (Class I)</td>
                <td className="px-6 py-4 font-mono">30.0 - 34.9</td>
                <td className="px-6 py-4 text-rose-600">High</td>
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="px-6 py-4">Obese (Class II)</td>
                <td className="px-6 py-4 font-mono">35.0 - 39.9</td>
                <td className="px-6 py-4 text-rose-600">Very High</td>
              </tr>
              <tr className="hover:bg-rose-50/50">
                <td className="px-6 py-4">Obese (Class III)</td>
                <td className="px-6 py-4 font-mono">≥ 40.0</td>
                <td className="px-6 py-4 text-rose-700 font-bold">Extremely High</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <EvidencePanel 
        lang={lang} 
        references={[
          "Nuttall FQ. Body Mass Index: Obesity, BMI, and Health: A Critical Review. Nutr Today. 2015;50(3):117-128. doi:10.1097/NT.0000000000000092",
          "WHO Expert Consultation. Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies. Lancet. 2004;363(9403):157-163.",
          "Romero-Corral A, et al. Accuracy of body mass index in diagnosing obesity in the adult general population. Int J Obes (Lond). 2008;32(6):959-966."
        ]} 
      />
    </>
  );
}
