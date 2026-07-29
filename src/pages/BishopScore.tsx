import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';
import ClinicalContextPanel from '../components/ClinicalContextPanel';

const translations: Translations = {
  en: {
    title: "Bishop Score Calculator",
    subtitle: "Assesses cervical readiness for labor induction",
    dilation: "Dilation (cm)",
    dilation0: "0 cm (0 pts)",
    dilation1: "1-2 cm (1 pt)",
    dilation2: "3-4 cm (2 pts)",
    dilation3: "≥ 5 cm (3 pts)",
    effacement: "Effacement (%)",
    effacement0: "0-30% (0 pts)",
    effacement1: "40-50% (1 pt)",
    effacement2: "60-70% (2 pts)",
    effacement3: "≥ 80% (3 pts)",
    station: "Fetal Station",
    station0: "-3 (0 pts)",
    station1: "-2 (1 pt)",
    station2: "-1, 0 (2 pts)",
    station3: "+1, +2 (3 pts)",
    consistency: "Cervical Consistency",
    consistency0: "Firm (0 pts)",
    consistency1: "Medium (1 pt)",
    consistency2: "Soft (2 pts)",
    position: "Cervical Position",
    position0: "Posterior (0 pts)",
    position1: "Midposition (1 pt)",
    position2: "Anterior (2 pts)",
    result: "Calculated Bishop Score",
    formula: "Bishop Score = Dilation + Effacement + Station + Consistency + Position",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "Score ≤ 5: Unfavorable cervix (induction less likely to succeed without cervical ripening). Score ≥ 8: Favorable cervix (high probability of successful induction, similar to spontaneous labor).",
    references: "References: Bishop EH. Pelvic scoring for elective induction. Obstet Gynecol 1964;24:266.",
    unfavorable: "Unfavorable Cervix (≤ 5)",
    intermediate: "Intermediate (6-7)",
    favorable: "Favorable Cervix (≥ 8)",
    faqQ1: "What is the Bishop Score?",
    faqA1: "The Bishop Score is a pre-labor scoring system used to predict whether induction of labor will be required or successful. It evaluates five components of a pelvic examination: cervical dilation, cervical effacement, fetal station, cervical consistency, and cervical position.",
    faqQ2: "What is a 'favorable' vs 'unfavorable' score?",
    faqA2: "A score of 8 or greater indicates a 'favorable' cervix, meaning the chances of a successful vaginal delivery with induction are similar to spontaneous labor. A score of 5 or less indicates an 'unfavorable' cervix, and cervical ripening agents (e.g., prostaglandins) are generally recommended prior to induction.",
    faqQ3: "How does the modified Bishop score differ?",
    faqA3: "Some modern modifications replace effacement with cervical length in centimeters. However, the original Bishop score using percentage effacement remains the most universally taught and utilized standard in OB/GYN.",
    faqQ4: "Can the Bishop score predict preterm birth?",
    faqA4: "While originally designed for elective induction at term, components of the Bishop score (specifically dilation and effacement/cervical length) are heavily used in assessing the risk of preterm labor."
  },
  fr: {
    title: "Score de Bishop",
    subtitle: "Évalue la maturité cervicale pour le déclenchement du travail",
    dilation: "Dilatation (cm)",
    dilation0: "0 cm (0 pt)",
    dilation1: "1-2 cm (1 pt)",
    dilation2: "3-4 cm (2 pts)",
    dilation3: "≥ 5 cm (3 pts)",
    effacement: "Effacement (%)",
    effacement0: "0-30% (0 pt)",
    effacement1: "40-50% (1 pt)",
    effacement2: "60-70% (2 pts)",
    effacement3: "≥ 80% (3 pts)",
    station: "Hauteur de la présentation",
    station0: "-3 (0 pt)",
    station1: "-2 (1 pt)",
    station2: "-1, 0 (2 pts)",
    station3: "+1, +2 (3 pts)",
    consistency: "Consistance du col",
    consistency0: "Ferme (0 pt)",
    consistency1: "Moyenne (1 pt)",
    consistency2: "Souple (2 pts)",
    position: "Position du col",
    position0: "Postérieure (0 pt)",
    position1: "Intermédiaire (1 pt)",
    position2: "Antérieure (2 pts)",
    result: "Score de Bishop Calculé",
    formula: "Score = Dilatation + Effacement + Hauteur + Consistance + Position",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Score ≤ 5 : Col défavorable (le déclenchement nécessite souvent une maturation cervicale). Score ≥ 8 : Col favorable (forte probabilité de succès du déclenchement, similaire au travail spontané).",
    references: "Références : Bishop EH. Pelvic scoring for elective induction. Obstet Gynecol 1964.",
    unfavorable: "Col Défavorable (≤ 5)",
    intermediate: "Intermédiaire (6-7)",
    favorable: "Col Favorable (≥ 8)",
    faqQ1: "Qu'est-ce que le score de Bishop ?",
    faqA1: "Le score de Bishop est un système d'évaluation pré-travail utilisé pour prédire le succès d'un déclenchement artificiel du travail. Il évalue cinq paramètres lors du toucher vaginal : la dilatation, l'effacement, la hauteur de la présentation, la consistance et la position du col.",
    faqQ2: "Que signifie un col 'favorable' ou 'défavorable' ?",
    faqA2: "Un score ≥ 8 indique un col 'favorable', avec des chances de succès d'accouchement par voie basse similaires à celles d'un travail spontané. Un score ≤ 5 indique un col 'défavorable', nécessitant souvent une maturation cervicale (par ex. prostaglandines) avant l'utilisation d'ocytocine.",
    faqQ3: "Quelle est la différence avec le score modifié ?",
    faqA3: "Certaines modifications modernes remplacent l'effacement par la longueur du col en centimètres. Cependant, le score original de Bishop utilisant le pourcentage d'effacement reste le standard le plus universellement enseigné en obstétrique.",
    faqQ4: "Le score de Bishop peut-il prédire un accouchement prématuré ?",
    faqA4: "Bien qu'initialement conçu pour le déclenchement à terme, les composantes du score (en particulier la dilatation et l'effacement/longueur cervicale) sont fortement utilisées pour évaluer le risque de menace d'accouchement prématuré."
  }
};

export default function BishopScore({ lang }: { lang: LangCode }) {
  const [dilation, setDilation] = useState<number>(0);
  const [effacement, setEffacement] = useState<number>(0);
  const [station, setStation] = useState<number>(0);
  const [consistency, setConsistency] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang] || translations.en;
  const isRtl = false;

  const score = useMemo(() => {
    return dilation + effacement + station + consistency + position;
  }, [dilation, effacement, station, consistency, position]);

  useEffect(() => {
    trackCalculatorUsage('bishop-score', lang);
  }, [lang]);

  const getInterpretation = () => {
    if (score <= 5) return { text: currentText.unfavorable, color: 'text-red-600', bg: 'bg-red-50' };
    if (score >= 8) return { text: currentText.favorable, color: 'text-green-600', bg: 'bg-green-50' };
    return { text: currentText.intermediate, color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  const interp = getInterpretation();

  const handleCopy = () => {
    const text = `Bishop Score: ${score}\nInterpretation: ${interp.text}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`max-w-4xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentText.title}</h1>
        <p className="text-gray-600">{currentText.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Dilation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.dilation}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { val: 0, label: currentText.dilation0 },
                { val: 1, label: currentText.dilation1 },
                { val: 2, label: currentText.dilation2 },
                { val: 3, label: currentText.dilation3 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setDilation(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    dilation === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effacement */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.effacement}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { val: 0, label: currentText.effacement0 },
                { val: 1, label: currentText.effacement1 },
                { val: 2, label: currentText.effacement2 },
                { val: 3, label: currentText.effacement3 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setEffacement(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    effacement === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Station */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.station}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { val: 0, label: currentText.station0 },
                { val: 1, label: currentText.station1 },
                { val: 2, label: currentText.station2 },
                { val: 3, label: currentText.station3 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setStation(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    station === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Consistency */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.consistency}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 0, label: currentText.consistency0 },
                { val: 1, label: currentText.consistency1 },
                { val: 2, label: currentText.consistency2 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setConsistency(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    consistency === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentText.position}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 0, label: currentText.position0 },
                { val: 1, label: currentText.position1 },
                { val: 2, label: currentText.position2 }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setPosition(opt.val)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                    position === opt.val
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
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
                <span className="text-gray-500 ml-2">/ 13</span>
              </div>

              <div className={`p-4 rounded-xl ${interp.bg} border-l-4 ${interp.color.replace('text-', 'border-')} mb-6`}>
                <p className={`font-semibold ${interp.color}`}>{interp.text}</p>
              </div>

              <div className="flex flex-col gap-3">
                <ClinicalExportButton 
                  lang={lang}
                  calculatorName={currentText.title}
                  inputs={[
                    { label: currentText.dilation, value: dilation },
                    { label: currentText.effacement, value: effacement },
                    { label: currentText.station, value: station },
                    { label: currentText.consistency, value: consistency },
                    { label: currentText.position, value: position }
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
