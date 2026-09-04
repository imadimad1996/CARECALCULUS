import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Divide } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Delta-Delta & Delta Ratio Calculator",
    subtitle: "Detects mixed acid-base disorders in high anion gap metabolic acidosis (HAGMA)",
    sodium: "Serum Sodium (Na⁺) [mEq/L]",
    chloride: "Serum Chloride (Cl⁻) [mEq/L]",
    bicarb: "Serum Bicarbonate (HCO₃⁻) [mEq/L]",
    baselineAg: "Expected Normal Anion Gap",
    baselineHco3: "Expected Normal HCO₃⁻",
    resultRatio: "Delta Ratio (ΔAG / ΔHCO₃)",
    resultGap: "Delta-Delta (ΔAG − ΔHCO₃)",
    anionGap: "Calculated Anion Gap",
    interpretationTitle: "Acid-Base Interpretation",
    formula: "Delta Ratio = (Anion Gap − Normal AG) / (Normal HCO₃ − Measured HCO₃)",
    references: "Wrenn K. The delta (delta) gap: an approach to analyzing confusing acid-base disorders. J Emerg Med. 1990;8(6):743-749. (PMID: 2286762).",
    faqs: [
      { question: "What is the Delta Ratio?", answer: "The Delta Ratio compares the increase in anion gap (ΔAG) above normal to the decrease in serum bicarbonate (ΔHCO3) below normal, uncovering hidden co-existing metabolic alkalosis or non-anion gap metabolic acidosis." },
      { question: "What does a Delta Ratio < 0.8 mean?", answer: "A ratio < 0.8 indicates a mixed High Anion Gap Metabolic Acidosis (HAGMA) AND Non-Anion Gap Metabolic Acidosis (NAGMA), such as DKA plus severe diarrhea or renal tubular acidosis." },
      { question: "What does a Delta Ratio > 2.0 mean?", answer: "A ratio > 2.0 indicates a mixed HAGMA AND concurrent Metabolic Alkalosis (e.g. DKA or lactic acidosis with severe vomiting or diuretic use) or pre-existing respiratory acidosis with renal compensation." }
    ],
    nagmaMixed: "Delta Ratio < 0.8: Mixed HAGMA + NAGMA",
    nagmaDesc: "Bicarbonate dropped more than expected for the anion gap elevation. Indicates concurrent Normal Anion Gap Metabolic Acidosis (e.g., severe diarrhea, saline over-resuscitation, or RTA alongside lactic acidosis/DKA).",
    pureHagma: "Delta Ratio 0.8 – 2.0: Pure HAGMA",
    pureHagmaDesc: "Uncomplicated High Anion Gap Metabolic Acidosis. Bicarbonate drop is stoichiometric with anion gap elevation (typical for DKA [~1.0] or lactic acidosis [~1.6]).",
    alkalosisMixed: "Delta Ratio > 2.0: Mixed HAGMA + Metabolic Alkalosis",
    alkalosisDesc: "Bicarbonate is higher than expected. Indicates concurrent Metabolic Alkalosis (e.g., severe vomiting, nasogastric suction, prior diuretics) or chronic baseline respiratory acidosis with renal retention."
  },
  fr: {
    title: "Calculateur Delta-Delta & Ratio Delta",
    subtitle: "Détection des troubles acido-basiques mixtes en présence d'une acidose métabolique à trou anionique élevé (HAGMA)",
    sodium: "Sodium Plasmatique (Na⁺) [mEq/L]",
    chloride: "Chlore Plasmatique (Cl⁻) [mEq/L]",
    bicarb: "Bicarbonates (HCO₃⁻) [mEq/L]",
    baselineAg: "Trou Anionique Normal de Référence",
    baselineHco3: "Bicarbonates Normaux de Référence",
    resultRatio: "Ratio Delta (ΔTA / ΔHCO₃)",
    resultGap: "Delta-Delta (ΔTA − ΔHCO₃)",
    anionGap: "Trou Anionique Mesuré",
    interpretationTitle: "Interprétation Acido-Basique",
    formula: "Ratio Delta = (Trou Anionique − TA Normal) / (HCO₃ Normal − HCO₃ Mesuré)",
    references: "Wrenn K. J Emerg Med. 1990;8(6):743-749. (PMID: 2286762).",
    faqs: [
      { question: "À quoi sert le ratio Delta ?", answer: "Il compare l'élévation du trou anionique (ΔTA) à la baisse des bicarbonates (ΔHCO3) pour démasquer une acidose hyperchlorémique ou une alcalose métabolique surajoutée." },
      { question: "Que signifie un ratio < 0,8 ?", answer: "Une acidose métabolique mixte associant un trou anionique élevé et un trou anionique normal (ex. acidocétose diabétique + diarrhée profuse)." },
      { question: "Que signifie un ratio > 2,0 ?", answer: "Une acidose à trou anionique élevé associée à une alcalose métabolique (ex. vomissements abondants) ou une insuffisance respiratoire chronique sous-jacente." }
    ],
    nagmaMixed: "Ratio Delta < 0,8 : HAGMA + Acidose Hyperchlorémique (NAGMA)",
    nagmaDesc: "La baisse des bicarbonates est supérieure à la hausse du trou anionique. Témoigne d'une perte additionnelle de bases (diarrhée, perfusion massive de NaCl 0,9%, acidose tubulaire).",
    pureHagma: "Ratio Delta 0,8 – 2,0 : HAGMA Pur (Non Compliqué)",
    pureHagmaDesc: "Acidose métabolique à trou anionique élevé isolée. La baisse des bicarbonates est proportionnelle à la génération d'anions non mesurés (classique dans l'acidocétose et l'acidose lactique).",
    alkalosisMixed: "Ratio Delta > 2,0 : HAGMA + Alcalose Métabolique Surajoutée",
    alkalosisDesc: "Les bicarbonates sont plus élevés qu'attendu. Indique une alcalose métabolique associée (vomissements, sonde nasogastrique, diurétiques) ou une rétention rénale sur hypercapnie chronique."
  }
};

export default function DeltaDeltaCalculator({ lang }: { lang: LangCode }) {
  const [sodium, setSodium] = useState<number | ''>(140);
  const [chloride, setChloride] = useState<number | ''>(96);
  const [bicarb, setBicarb] = useState<number | ''>(12);
  const [normalAg, setNormalAg] = useState<number | ''>(12);
  const [normalHco3, setNormalHco3] = useState<number | ''>(24);

  const currentText = translations[lang] || translations.en;

  const calculations = useMemo(() => {
    if (sodium === '' || chloride === '' || bicarb === '' || normalAg === '' || normalHco3 === '') return null;
    const na = Number(sodium);
    const cl = Number(chloride);
    const hco3 = Number(bicarb);
    const baseAg = Number(normalAg);
    const baseHco3 = Number(normalHco3);

    const ag = na - (cl + hco3);
    const deltaAg = ag - baseAg;
    const deltaHco3 = baseHco3 - hco3;

    if (deltaHco3 === 0) {
      return { ag, deltaAg, deltaHco3, deltaRatio: null, deltaDelta: deltaAg };
    }

    const deltaRatio = deltaAg / deltaHco3;
    const deltaDelta = deltaAg - deltaHco3;
    return { ag, deltaAg, deltaHco3, deltaRatio, deltaDelta };
  }, [sodium, chloride, bicarb, normalAg, normalHco3]);

  useEffect(() => {
    if (calculations?.deltaRatio !== null && calculations?.deltaRatio !== undefined) {
      trackCalculatorUsage('delta-delta', lang, calculations.deltaRatio);
    }
  }, [calculations, lang]);

  const interpretation = useMemo(() => {
    if (!calculations || calculations.deltaRatio === null) return null;
    const r = calculations.deltaRatio;
    if (r < 0.8) return 'nagma';
    if (r <= 2.0) return 'pure';
    return 'alkalosis';
  }, [calculations]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/delta-delta"
        scoringSystem="Delta Ratio and Delta-Delta Gap"
        howToSteps={[
          lang === 'fr' ? 'Saisir le sodium, chlore et bicarbonates sériques.' : 'Enter serum sodium, chloride, and bicarbonate.',
          lang === 'fr' ? 'Vérifier la valeur normale de référence du trou anionique (habituellement 12 mEq/L).' : 'Verify baseline normal anion gap (typically 12 mEq/L).',
          lang === 'fr' ? 'Le ratio < 0,8 révèle une acidose hyperchlorémique; > 2,0 une alcalose métabolique.' : 'Ratio < 0.8 reveals concurrent NAGMA; > 2.0 reveals concurrent metabolic alkalosis.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-700 mb-2">
          <Divide className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Équilibre Acido-Basique & Néphrologie' : 'Acid-Base & Nephrology'}</span>
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
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.sodium}</label>
                <input
                  type="number" step="1"
                  value={sodium}
                  onChange={(e) => setSodium(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.chloride}</label>
                <input
                  type="number" step="1"
                  value={chloride}
                  onChange={(e) => setChloride(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">{currentText.bicarb}</label>
                <input
                  type="number" step="1"
                  value={bicarb}
                  onChange={(e) => setBicarb(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-gray-50 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1 font-semibold">{currentText.baselineAg}</label>
                <input
                  type="number" step="1"
                  value={normalAg}
                  onChange={(e) => setNormalAg(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1 font-semibold">{currentText.baselineHco3}</label>
                <input
                  type="number" step="1"
                  value={normalHco3}
                  onChange={(e) => setNormalHco3(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white px-3 py-2 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-teal-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                {currentText.resultRatio}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  interpretation === 'pure' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {calculations?.deltaRatio !== null && calculations?.deltaRatio !== undefined ? calculations.deltaRatio.toFixed(2) : '--'}
                </span>
                <span className="text-xl text-gray-400 font-medium">ratio</span>
              </div>

              {calculations && (
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-white/10 text-xs">
                  <div>
                    <span className="text-gray-400 block">{currentText.anionGap}</span>
                    <span className="text-base font-bold text-white">{calculations.ag.toFixed(0)} mEq/L</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">{currentText.resultGap}</span>
                    <span className="text-base font-bold text-white">{calculations.deltaDelta > 0 ? `+${calculations.deltaDelta.toFixed(0)}` : calculations.deltaDelta.toFixed(0)}</span>
                  </div>
                </div>
              )}

              {interpretation && (
                <div className={`p-4 rounded-xl border ${
                  interpretation === 'pure' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  <div className="font-bold text-sm mb-1">
                    {interpretation === 'pure' ? currentText.pureHagma : interpretation === 'nagma' ? currentText.nagmaMixed : currentText.alkalosisMixed}
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {interpretation === 'pure' ? currentText.pureHagmaDesc : interpretation === 'nagma' ? currentText.nagmaDesc : currentText.alkalosisDesc}
                  </p>
                </div>
              )}

              {calculations && (
                <ClinicalExportButton
                  title={currentText.title}
                  inputs={[
                    { label: "Sodium", value: `${sodium} mEq/L` },
                    { label: "Chloride", value: `${chloride} mEq/L` },
                    { label: "Bicarbonate", value: `${bicarb} mEq/L` },
                    { label: "Baseline AG / HCO3", value: `${normalAg} / ${normalHco3} mEq/L` }
                  ]}
                  results={[
                    { label: "Anion Gap", value: `${calculations.ag.toFixed(0)} mEq/L` },
                    { label: "Delta Ratio (ΔAG / ΔHCO3)", value: calculations.deltaRatio !== null ? calculations.deltaRatio.toFixed(2) : "N/A" },
                    { label: "Delta-Delta Gap", value: `${calculations.deltaDelta.toFixed(0)} mEq/L` },
                    { label: "Diagnostic Category", value: interpretation === 'pure' ? "Pure HAGMA" : interpretation === 'nagma' ? "Mixed HAGMA + NAGMA" : "Mixed HAGMA + Metabolic Alkalosis" }
                  ]}
                  formula={currentText.formula}
                  disclaimer="Delta Ratio interprets mixed metabolic disorders in high anion gap acidosis."
                  references="Wrenn K. J Emerg Med. 1990;8(6):743-749."
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
            <a href="https://pubmed.ncbi.nlm.nih.gov/2286762/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Wrenn K (1990) Journal of Emergency Medicine <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
