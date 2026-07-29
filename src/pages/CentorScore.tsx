import { JsonLd } from '../components/JsonLd';
import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Centor Score (Modified) for Strep Pharyngitis",
    subtitle: "Estimates probability of Group A streptococcal pharyngitis",
    age: "Age",
    age1: "3-14 years (+1)",
    age0: "15-44 years (0)",
    age_1: "≥ 45 years (-1)",
    exudate: "Tonsillar exudate or swelling",
    nodes: "Tender/swollen anterior cervical lymph nodes",
    cough: "Absence of cough",
    fever: "Temperature > 38°C (100.4°F)",
    yes: "Yes (+1)",
    no: "No (0)",
    result: "Calculated Score",
    formula: "Score = Age + Exudate + Nodes + Cough + Fever",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Score ≤ 1: No further testing or antibiotics needed. Score 2-3: Perform rapid strep test and/or throat culture. Score ≥ 4: Perform rapid strep test and/or empiric antibiotics.",
    references: "References: McIsaac WJ, White D, Tannenbaum D, Rowe BH. A clinical score to reduce unnecessary antibiotic use in patients with sore throat. CMAJ. 1998;158(1):75-83.",
    low: "Low Risk (1-2% probability) - No testing/Abx",
    moderate: "Moderate Risk (11-17% probability) - Rapid test/Culture",
    high: "High Risk (28-35% probability) - Rapid test/Culture/Empiric Abx",
    veryHigh: "Very High Risk (51-53% probability) - Empiric Abx or Rapid test",
    faqQ1: "What is the Modified Centor Score?",
    faqA1: "The Modified Centor Score (McIsaac score) estimates the probability that pharyngitis is caused by Group A Streptococcus (GAS). It helps clinicians decide who needs throat swabbing or antibiotics.",
    faqQ2: "Who should not be scored using this tool?",
    faqA2: "Do not use this score for children under 3 years old, as GAS pharyngitis is rare in this age group and acute rheumatic fever is extremely uncommon.",
    faqQ3: "Why is absence of cough a point?",
    faqA3: "Viral pharyngitis typically presents with prominent respiratory symptoms like cough, rhinorrhea, or hoarseness. The absence of these symptoms increases the likelihood of a bacterial etiology.",
    faqQ4: "Should I prescribe antibiotics purely based on a score of 4?",
    faqA4: "Guidelines vary. IDSA guidelines recommend laboratory confirmation (rapid test or culture) for all adults suspected of having GAS, regardless of score, rather than purely empiric treatment."
  },
  fr: {
    title: "Score de MacIsaac (Centor Modifié)",
    subtitle: "Estime la probabilité d'une angine à Streptocoque du groupe A",
    age: "Âge",
    age1: "3-14 ans (+1)",
    age0: "15-44 ans (0)",
    age_1: "≥ 45 ans (-1)",
    exudate: "Exsudat ou hypertrophie amygdalienne",
    nodes: "Adénopathies cervicales antérieures douloureuses",
    cough: "Absence de toux",
    fever: "Fièvre > 38°C (100.4°F)",
    yes: "Oui (+1)",
    no: "Non (0)",
    result: "Score Calculé",
    formula: "Score = Âge + Exsudat + Ganglions + Toux + Fièvre",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Score ≤ 1 : Aucun test ni antibiotique nécessaire. Score 2-3 : TDR (Test de Diagnostic Rapide) ou culture. Score ≥ 4 : TDR et/ou antibiothérapie empirique.",
    references: "Références : McIsaac WJ, et al. A clinical score to reduce unnecessary antibiotic use in patients with sore throat. CMAJ. 1998.",
    low: "Risque Faible (1-2%) - Pas de test ni d'antibiotiques",
    moderate: "Risque Modéré (11-17%) - TDR recommandé",
    high: "Risque Élevé (28-35%) - TDR ou antibiotiques",
    veryHigh: "Très Haut Risque (51-53%) - Antibiotiques ou TDR",
    faqQ1: "Qu'est-ce que le score de MacIsaac ?",
    faqA1: "Le score de MacIsaac (Centor modifié) estime la probabilité qu'une pharyngite soit causée par le streptocoque du groupe A. Il aide à limiter la surprescription d'antibiotiques.",
    faqQ2: "Quelles sont les limites d'âge ?",
    faqA2: "Ne pas utiliser chez les enfants de moins de 3 ans, car l'angine streptococcique y est rare et le RAA (rhumatisme articulaire aigu) est exceptionnel.",
    faqQ3: "Pourquoi l'absence de toux donne-t-elle un point ?",
    faqA3: "Les angines virales s'accompagnent souvent de signes catarrhaux (toux, rhume). Leur absence rend une origine bactérienne (strepto A) plus probable.",
    faqQ4: "L'antibiothérapie probabiliste est-elle recommandée à un score de 4 ?",
    faqA4: "En France (recommandations HAS), le TDR est toujours recommandé chez l'adulte quel que soit le score de MacIsaac avant de prescrire des antibiotiques, sauf si le score est de 0 ou 1 (pas de TDR, pas d'antibiotiques)."
  }
};

export default function CentorScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(0);
  const [exudate, setExudate] = useState<number>(0);
  const [nodes, setNodes] = useState<number>(0);
  const [cough, setCough] = useState<number>(0);
  const [fever, setFever] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang] || translations.en;
  const isRtl = false;

  const score = useMemo(() => {
    return age + exudate + nodes + cough + fever;
  }, [age, exudate, nodes, cough, fever]);

  useEffect(() => {
    trackCalculatorUsage('centor-score', lang);
  }, [lang]);

  const getInterpretation = () => {
    if (score <= 0) return { text: currentText.low, color: 'text-green-600', bg: 'bg-green-50' };
    if (score === 1) return { text: currentText.low, color: 'text-green-600', bg: 'bg-green-50' };
    if (score === 2) return { text: currentText.moderate, color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score === 3) return { text: currentText.high, color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: currentText.veryHigh, color: 'text-red-600', bg: 'bg-red-50' };
  };

  const interp = getInterpretation();

  const handleCopy = () => {
    const text = `Modified Centor Score: ${score}\nInterpretation: ${interp.text}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const YesNoToggle = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <JsonLd path="/centor-score" title="Clinical Decision Support — CareCalculus" description="Evidence-based medical decision support calculator." type="SoftwareApplication" />
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onChange(1)}
          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
            value === 1
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
          }`}
        >
          {currentText.yes}
        </button>
        <button
          onClick={() => onChange(0)}
          className={`p-3 rounded-xl border text-sm font-medium transition-all ${
            value === 0
              ? 'border-gray-400 bg-gray-50 text-gray-700'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {currentText.no}
        </button>
      </div>
    </div>
  );

  return (
    <div className={`max-w-4xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentText.title}</h1>
        <p className="text-gray-600">{currentText.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Age */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.age}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 1, label: currentText.age1 },
                { val: 0, label: currentText.age0 },
                { val: -1, label: currentText.age_1 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setAge(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    age === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <YesNoToggle value={exudate} onChange={setExudate} label={currentText.exudate} />
          <YesNoToggle value={nodes} onChange={setNodes} label={currentText.nodes} />
          <YesNoToggle value={cough} onChange={setCough} label={currentText.cough} />
          <YesNoToggle value={fever} onChange={setFever} label={currentText.fever} />
          
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                {currentText.result}
              </h3>
              
              <div className="flex items-baseline mb-4">
                <span className="text-5xl font-bold text-gray-900">{score}</span>
                <span className="text-gray-500 ml-2">pts</span>
              </div>

              <div className={`p-4 rounded-xl ${interp.bg} border-l-4 ${interp.color.replace('text-', 'border-')} mb-6`}>
                <p className={`font-semibold ${interp.color}`}>{interp.text}</p>
              </div>

              <div className="flex flex-col gap-3">
                <ClinicalExportButton 
                  lang={lang}
                  calculatorName={currentText.title}
                  inputs={[
                    { label: currentText.age, value: age },
                    { label: currentText.exudate, value: exudate },
                    { label: currentText.nodes, value: nodes },
                    { label: currentText.cough, value: cough },
                    { label: currentText.fever, value: fever }
                  ]}
                  results={[
                    { label: currentText.result, value: score }
                  ]}
                  references={currentText.references}
                />
              </div>
            </div>
            
            <ClinicalContextPanel
              lang={lang}
              pearls={[currentText.clinicalText]}
              pitfalls={[]}
              evidence=""
              references={[currentText.references]}
            />
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
          {lang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentText.faqQ1}</h3>
            <p className="text-gray-600 leading-relaxed">{currentText.faqA1}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentText.faqQ2}</h3>
            <p className="text-gray-600 leading-relaxed">{currentText.faqA2}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentText.faqQ3}</h3>
            <p className="text-gray-600 leading-relaxed">{currentText.faqA3}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentText.faqQ4}</h3>
            <p className="text-gray-600 leading-relaxed">{currentText.faqA4}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
