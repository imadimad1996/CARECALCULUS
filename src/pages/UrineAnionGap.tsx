import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Filter } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Urine Anion Gap (UAG) Calculator",
    subtitle: "Differentiates gastrointestinal bicarbonate loss from renal tubular acidosis (RTA) in normal anion gap metabolic acidosis",
    urineNa: "Urine Sodium (Na⁺) [mEq/L]",
    urineK: "Urine Potassium (K⁺) [mEq/L]",
    urineCl: "Urine Chloride (Cl⁻) [mEq/L]",
    result: "Calculated Urine Anion Gap",
    formula: "UAG = (Urine Na⁺ + Urine K⁺) − Urine Cl⁻",
    clinicalHeading: "Etiological Stratification",
    references: "Batlle DC, Hizon M, Cohen E, Gutterman C, Gupta R. The use of the urinary anion gap in the diagnosis of hyperchloremic metabolic acidosis. N Engl J Med. 1988;318(10):594-599. (PMID: 3344005).",
    faqs: [
      { question: "What is the purpose of the Urine Anion Gap?", answer: "The Urine Anion Gap estimates urinary ammonium (NH4+) excretion indirectly. In hyperchloremic (normal anion gap) metabolic acidosis, it separates renal causes (RTA) from extrarenal causes (diarrhea)." },
      { question: "What does a negative Urine Anion Gap indicate?", answer: "A negative UAG (typically -20 to -50 mEq/L) demonstrates intact renal acidification. The kidneys are robustly excreting ammonium accompanied by chloride, pointing to gastrointestinal bicarbonate loss (severe diarrhea, laxative abuse, enterocutaneous fistula)." },
      { question: "What does a positive Urine Anion Gap indicate?", answer: "A positive UAG (typically +20 to +40 mEq/L) signals impaired renal ammonium excretion, characteristic of distal (Type 1) RTA or hyperkalemic (Type 4) RTA / hypoaldosteronism." }
    ],
    giLoss: "Negative UAG (< 0 mEq/L): Gastrointestinal Loss (Diarrhea)",
    giLossDesc: "Intact renal ammonium excretion (NH₄⁺ paired with Cl⁻). Points to GI bicarbonate loss: diarrhea, laxative misuse, or intestinal drainage.",
    indeterminate: "UAG Near Zero (0 to +10 mEq/L): Indeterminate",
    indeterminateDesc: "Borderline excretion. If clinical ambiguity persists or unmeasured urinary anions are suspected (e.g. ketoacids, penicillin metabolites), calculate the Urine Osmolal Gap.",
    renalRta: "Positive UAG (> 10 mEq/L): Renal Tubular Acidosis (RTA)",
    renalRtaDesc: "Impaired renal ammonium excretion. Consistent with Type 1 (Distal) RTA or Type 4 RTA (hypoaldosteronism). Nephrology consultation recommended."
  },
  fr: {
    title: "Trou Anionique Urinaire (TAU)",
    subtitle: "Différencie les pertes digestives d'alcalins (diarrhée) des acidoses tubulaires rénales (ATR)",
    urineNa: "Sodium Urinaire (Na⁺) [mEq/L ou mmol/L]",
    urineK: "Potassium Urinaire (K⁺) [mEq/L ou mmol/L]",
    urineCl: "Chlore Urinaire (Cl⁻) [mEq/L ou mmol/L]",
    result: "Trou Anionique Urinaire",
    formula: "TAU = (Na⁺ urinaire + K⁺ urinaire) − Cl⁻ urinaire",
    clinicalHeading: "Orientation Étiologique",
    references: "Batlle DC, et al. N Engl J Med. 1988;318(10):594-599. (PMID: 3344005).",
    faqs: [
      { question: "À quoi sert le trou anionique urinaire ?", answer: "Il est le reflet indirect de l'excrétion urinaire d'ammoniac (NH4+). Face à une acidose métabolique à trou anionique plasmatique normal, il distingue l'origine digestive de l'origine rénale." },
      { question: "Que signifie un trou anionique urinaire négatif ?", answer: "Un TAU négatif (< 0) témoigne d'une réponse rénale adaptée : le rein élimine massivement des ions NH4+ accompagnés de chlorures. La cause est donc digestive (diarrhées aiguës)." },
      { question: "Que signifie un trou anionique urinaire positif ?", answer: "Un TAU positif (> 0) indique une anomalie de l'acidification rénale ou de la sécrétion d'ammonium : acidose tubulaire rénale (type 1 distale ou type 4 hypoaldostéronisme)." }
    ],
    giLoss: "TAU Négatif (< 0) : Cause Digestive (Diarrhée)",
    giLossDesc: "Excrétion rénale d'ammonium conservée et adaptée. Cause extra-rénale : pertes digestives de bicarbonates (diarrhées profuses, fistules digestives).",
    indeterminate: "TAU Proche de Zéro (0 à +10) : Zone Indéterminée",
    indeterminateDesc: "Résultat intermédiaire. Envisager le calcul du trou osmolaire urinaire si la présence d'anions non mesurés est suspectée.",
    renalRta: "TAU Positif (> +10) : Acidose Tubulaire Rénale (ATR)",
    renalRtaDesc: "Défaut d'ammoniogénèse ou d'acidification distale. Évocateur d'une acidose tubulaire de type 1 (distale) ou type 4 (hypoaldostéronisme)."
  }
};

export default function UrineAnionGap({ lang }: { lang: LangCode }) {
  const [urineNa, setUrineNa] = useState<number | ''>(40);
  const [urineK, setUrineK] = useState<number | ''>(30);
  const [urineCl, setUrineCl] = useState<number | ''>(95);

  const currentText = translations[lang] || translations.en;

  const result = useMemo(() => {
    if (urineNa === '' || urineK === '' || urineCl === '') return null;
    const uag = (Number(urineNa) + Number(urineK)) - Number(urineCl);
    return uag;
  }, [urineNa, urineK, urineCl]);

  useEffect(() => {
    if (result !== null) {
      trackCalculatorUsage('urine-anion-gap', lang, result);
    }
  }, [result, lang]);

  const category = useMemo(() => {
    if (result === null) return null;
    if (result < 0) return 'gi';
    if (result <= 10) return 'indeterminate';
    return 'rta';
  }, [result]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/urine-anion-gap"
        scoringSystem="Urine Anion Gap"
        howToSteps={[
          lang === 'fr' ? 'Mesurer le sodium, potassium et chlore sur un échantillon urinaire synchrone.' : 'Obtain simultaneous spot urine sodium, potassium, and chloride.',
          lang === 'fr' ? 'Un TAU négatif confirme une perte digestive de bicarbonates (diarrhée).' : 'Negative UAG confirms intact renal acidification and gastrointestinal loss.',
          lang === 'fr' ? 'Un TAU positif oriente vers une acidose tubulaire rénale (ATR type 1 ou 4).' : 'Positive UAG indicates impaired renal ammonium excretion (RTA Type 1 or 4).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Filter className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Néphrologie & Électrolytes' : 'Nephrology & Electrolytes'}</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
          {currentText.title}
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed">
          {currentText.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.urineNa}</label>
                <input
                  type="number" step="1"
                  value={urineNa}
                  onChange={(e) => setUrineNa(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.urineK}</label>
                <input
                  type="number" step="1"
                  value={urineK}
                  onChange={(e) => setUrineK(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.urineCl}</label>
                <input
                  type="number" step="1"
                  value={urineCl}
                  onChange={(e) => setUrineCl(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-900 leading-relaxed">
              <span className="font-bold block mb-1">Clinical Context:</span>
              Indicated in hyperchloremic (normal anion gap) metabolic acidosis. Evaluates renal ammonium secretion capacity without direct laboratory measurement of NH₄⁺.
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  category === 'gi' ? 'text-emerald-400' : category === 'indeterminate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result !== null ? (result > 0 ? `+${result}` : result) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">mEq/L</span>
              </div>

              {category && (
                <div className={`p-4 rounded-xl border ${
                  category === 'gi'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : category === 'indeterminate'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {category === 'gi' ? currentText.giLoss : category === 'indeterminate' ? currentText.indeterminate : currentText.renalRta}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {category === 'gi' ? currentText.giLossDesc : category === 'indeterminate' ? currentText.indeterminateDesc : currentText.renalRtaDesc}
                  </p>
                </div>
              )}

              {result !== null && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Urine Sodium (Na)", value: `${urineNa} mEq/L` },
                    { label: "Urine Potassium (K)", value: `${urineK} mEq/L` },
                    { label: "Urine Chloride (Cl)", value: `${urineCl} mEq/L` }
                  ]}
                  results={[
                    { label: "Urine Anion Gap", value: `${result > 0 ? `+${result}` : result} mEq/L` },
                    { label: "Etiological Interpretation", value: category === 'gi' ? "Negative (GI Bicarbonate Loss / Diarrhea)" : category === 'indeterminate' ? "Indeterminate" : "Positive (Renal Tubular Acidosis / RTA)" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="Negative UAG indicates intact renal acidification with GI loss; positive UAG indicates defective renal ammonium excretion (RTA)."
                  references="Batlle DC, et al. N Engl J Med. 1988;318(10):594-599."
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-teal-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/3344005/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Batlle DC et al. (1988) New England Journal of Medicine <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
