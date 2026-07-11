import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, ChevronDown, Check, Copy } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import CalculatorInput from '../components/ui/CalculatorInput';
import { layoutTranslations } from '../utils/lang';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Alveolar-Arterial (A-a) Gradient",
    subtitle: "Calculate the A-a oxygen gradient to evaluate gas exchange and localise hypoxemia causes",
    age: "Patient Age",
    pao2: "Arterial Oxygen Tension (PaO2)",
    paco2: "Arterial Carbon Dioxide Tension (PaCO2)",
    fio2: "Fraction of Inspired Oxygen (FiO2)",
    patm: "Barometric Pressure (Patm)",
    result: "Calculated A-a Gradient",
    expectedResult: "Expected Age-Adjusted Gradient",
    normal: "Normal A-a Gradient",
    normalSub: "Within expected limits",
    elevated: "Elevated A-a Gradient",
    elevatedSub: "Suggests gas exchange defect",
    formula: "PAO2 = FiO2 * (Patm - 47) - (PaCO2 / 0.8)",
    gradientFormula: "A-a Gradient = PAO2 - PaO2",
    expectedFormula: "Expected Gradient = (Age / 4) + 4",
    clinicalTitle: "Clinical Interpretation",
    clinicalText: "An elevated A-a gradient indicates an oxygenation defect due to V/Q mismatch (e.g. PE, pneumonia), shunt, or diffusion barrier. A normal gradient in a hypoxemic patient suggests hypoventilation or low inspired oxygen (e.g. altitude).",
    references: "References: West JB. Respiratory Physiology: The Essentials.",
    faqQ1: "What is the Alveolar-Arterial (A-a) oxygen gradient?",
    faqA1: "The A-a gradient is the difference between the partial pressure of oxygen in the alveoli (PAO2) and in arterial blood (PaO2). It evaluates the integrity of the alveolar-capillary membrane.",
    faqQ2: "How is the expected normal A-a gradient calculated?",
    faqA2: "A normal A-a gradient increases with age due to physiological lung senescence. It can be estimated using the formula: Expected Normal Gradient = (Age / 4) + 4.",
    faqQ3: "What does a normal A-a gradient with hypoxemia mean?",
    faqA3: "If a patient is hypoxemic (low PaO2) but has a normal A-a gradient, the cause of hypoxemia is extra-pulmonary: either alveolar hypoventilation (e.g. opioid overdose, neuromuscular disease) or a low fraction of inspired oxygen (e.g. high altitude).",
    faqQ4: "What does an elevated A-a gradient mean?",
    faqA4: "An elevated A-a gradient (> expected age-adjusted value) indicates a pulmonary cause of hypoxemia. This is typically due to ventilation-perfusion (V/Q) mismatch (e.g. pulmonary embolism, COPD, pneumonia), right-to-left shunt (e.g. atelectasis, AVMs), or diffusion limitations.",
  },
  fr: {
    title: "Gradient Alvéolo-Artériel (A-a)",
    subtitle: "Calculer la différence alvéolo-artérielle en oxygène pour explorer une hypoxémie",
    age: "Âge du Patient",
    pao2: "Pression Artérielle en Oxygène (PaO2)",
    paco2: "Pression Artérielle en Gaz Carbonique (PaCO2)",
    fio2: "Fraction Inspirée en Oxygène (FiO2)",
    patm: "Pression Barométrique (Patm)",
    result: "Gradient A-a Calculé",
    expectedResult: "Gradient Normal Attendu",
    normal: "Gradient A-a Normal",
    normalSub: "Dans les limites attendues",
    elevated: "Gradient A-a Élevé",
    elevatedSub: "Suggère un trouble de l'échange gazeux",
    formula: "PAO2 = FiO2 * (Patm - 47) - (PaCO2 / 0,8)",
    gradientFormula: "Gradient A-a = PAO2 - PaO2",
    expectedFormula: "Gradient Attendu = (Âge / 4) + 4",
    clinicalTitle: "Interprétation Clinique",
    clinicalText: "Un gradient A-a élevé indique un défaut de transfert pulmonaire (effet shunt, trouble de diffusion, mismatch V/Q comme dans l'embolie pulmonaire ou la pneumonie). Un gradient normal indique une hypoventilation alvéolaire pure ou de l'altitude.",
    references: "Références : West JB. Respiratory Physiology: The Essentials.",
    faqQ1: "Qu'est-ce que le gradient alvéolo-artériel en oxygène (A-a) ?",
    faqA1: "Le gradient A-a est la différence entre la pression partielle d'oxygène dans les alvéoles pulmonaires (PAO2) et celle mesurée dans le sang artériel (PaO2). Il mesure l'efficacité des échanges gazeux pulmonaires.",
    faqQ2: "Comment calcule-t-on le gradient A-a attendu pour l'âge ?",
    faqA2: "Le gradient A-a augmente physiologiquement avec l'âge. Il est estimé par la formule suivante : Gradient attendu = (Âge / 4) + 4.",
    faqQ3: "Que signifie une hypoxémie avec gradient A-a normal ?",
    faqA3: "Une hypoxémie avec un gradient normal indique que le poumon lui-même est sain mais qu'il y a un manque d'apport d'oxygène aux alvéoles. Les causes courantes sont l'hypoventilation alvéolaire (surdosage en opiacés, maladie neuromusculaire) ou un air inspiré pauvre en oxygène (haute altitude).",
    faqQ4: "Quelles sont les causes d'un gradient A-a élevé ?",
    faqA4: "Un gradient A-a augmenté signale une atteinte intrinsèque du parenchyme ou de la vascularisation pulmonaire. Ses causes principales sont les inégalités de ventilation/perfusion (embolie pulmonaire, BPCO, pneumonie), les shunts anatomiques ou fonctionnels (atélectasie) et les troubles de diffusion.",
  }
};

export default function AaGradient({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number>(40);
  const [pao2, setPao2] = useState<number>(90);
  const [paco2, setPaco2] = useState<number>(40);
  const [fio2, setFio2] = useState<number>(21);
  const [patm, setPatm] = useState<number>(760);
  const [copied, setCopied] = useState(false);

  const currentText = translations[lang];
  const isRtl = false;

  const expectedGradient = useMemo(() => {
    if (age <= 0) return 0;
    return parseFloat(((age / 4) + 4).toFixed(1));
  }, [age]);

  const pAlveolar = useMemo(() => {
    if (fio2 <= 0 || patm <= 0 || paco2 <= 0) return 0;
    const decimalFiO2 = fio2 / 100;
    // PAO2 = FiO2 * (Patm - 47) - (PaCO2 / 0.8)
    const computed = decimalFiO2 * (patm - 47) - (paco2 / 0.8);
    return computed > 0 ? parseFloat(computed.toFixed(1)) : 0;
  }, [fio2, patm, paco2]);

  const aaGradientValue = useMemo(() => {
    if (pAlveolar <= 0 || pao2 <= 0) return 0;
    const computed = pAlveolar - pao2;
    return parseFloat(computed.toFixed(1));
  }, [pAlveolar, pao2]);

  useEffect(() => {
    if (aaGradientValue > 0) {
      const timer = setTimeout(() => {
        trackCalculatorUsage('aa-gradient', lang, aaGradientValue);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [aaGradientValue, lang]);

  const gradientIsElevated = aaGradientValue > expectedGradient;

  const category = useMemo(() => {
    if (aaGradientValue <= 0) return { label: '', color: '', bg: '', sub: '' };
    if (gradientIsElevated) {
      return {
        label: currentText.elevated,
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/20',
        sub: currentText.elevatedSub
      };
    }
    return {
      label: currentText.normal,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      sub: currentText.normalSub
    };
  }, [aaGradientValue, gradientIsElevated, currentText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`A-a Gradient: ${aaGradientValue} mmHg (Expected Normal: ${expectedGradient} mmHg, Status: ${category.label})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <CalculatorInput
                label={currentText.age}
                unit="years"
                value={age}
                min={1}
                max={120}
                placeholder="40"
                onChange={setAge}
              />

              <CalculatorInput
                label={currentText.pao2}
                unit="mmHg"
                value={pao2}
                min={20}
                max={600}
                placeholder="90"
                onChange={setPao2}
              />

              <CalculatorInput
                label={currentText.paco2}
                unit="mmHg"
                value={paco2}
                min={5}
                max={150}
                placeholder="40"
                onChange={setPaco2}
              />

              <CalculatorInput
                label={currentText.fio2}
                unit="%"
                value={fio2}
                min={21}
                max={100}
                placeholder="21"
                onChange={setFio2}
              />

              <CalculatorInput
                label={currentText.patm}
                unit="mmHg"
                value={patm}
                min={300}
                max={900}
                placeholder="760"
                onChange={setPatm}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 flex flex-col justify-between p-8 min-h-[320px]">
            <div className="absolute top-0 right-0 p-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  {currentText.result}
                </span>
                
                <div className="flex items-baseline gap-2 tabular-nums">
                  <span className="text-7xl font-bold tracking-tighter transition-all duration-300">
                    {aaGradientValue !== 0 ? (aaGradientValue > 0 ? aaGradientValue : 0) : '--'}
                  </span>
                  <span className="text-xl font-medium text-gray-400">mmHg</span>
                </div>

                {age > 0 && aaGradientValue !== 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      {currentText.expectedResult}
                    </span>
                    <div className="flex items-baseline gap-2 tabular-nums">
                      <span className="text-3xl font-bold text-blue-400">
                        {expectedGradient}
                      </span>
                      <span className="text-sm font-medium text-gray-400">mmHg</span>
                    </div>
                  </div>
                )}
              </div>
              
              {aaGradientValue !== 0 && (
                <button
                  onClick={handleCopy}
                  className="mt-2 p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700/50 flex items-center justify-center text-gray-300 hover:text-white"
                  title="Copy Result"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </button>
              )}
            </div>

            <div className="relative z-10 mt-10">
              {aaGradientValue !== 0 && (
                <>
                  <div className={`p-4 rounded-xl border flex justify-between items-center transition-all ${category.bg} ${category.color}`}>
                    <div className="font-semibold text-sm">
                      {category.label}
                    </div>
                    <div className="font-mono text-xs opacity-80">
                      {category.sub}
                    </div>
                  </div>

                  <ClinicalExportButton
                    title={currentText.title}
                    inputs={[
                      { label: currentText.age, value: `${age} years` },
                      { label: currentText.pao2, value: `${pao2} mmHg` },
                      { label: currentText.paco2, value: `${paco2} mmHg` },
                      { label: currentText.fio2, value: `${fio2} %` },
                      { label: currentText.patm, value: `${patm} mmHg` }
                    ]}
                    results={[
                      { label: currentText.result, value: aaGradientValue, unit: 'mmHg' },
                      { label: currentText.expectedResult, value: expectedGradient, unit: 'mmHg' },
                      { label: 'Interpretation', value: category.label }
                    ]}
                    formula={`${currentText.formula} & ${currentText.gradientFormula}`}
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
              <div className="font-mono text-[10px] bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight mb-2" dir="ltr">
                {currentText.formula}
              </div>
              <div className="font-mono text-[10px] bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight mb-2" dir="ltr">
                {currentText.gradientFormula}
              </div>
              <div className="font-mono text-[10px] bg-gray-100 text-gray-700 py-2 px-3 rounded-md border border-gray-200 uppercase tracking-tight" dir="ltr">
                {currentText.expectedFormula}
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
              <span className="text-xs text-gray-400 mt-1 inline-block">West JB. Respiratory Physiology: The Essentials (10th Ed).</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{layoutTranslations[lang].seeAlso}</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { label: 'P/F Ratio', path: '/pf-ratio' },
            { label: 'Tidal Volume (ARDS)', path: '/tidal-volume' },
            { label: 'qSOFA Score', path: '/qsofa-score' },
            { label: 'SIRS Criteria', path: '/sirs-criteria' },
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
    </>
  );
}
