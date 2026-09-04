import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Baby } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PEDIATRICS } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "PECARN Pediatric Head Trauma / CT Rule",
    subtitle: "Identifies children at very low risk of clinically important traumatic brain injury (ciTBI) to safely avoid cranial CT radiation",
    ageGroupTitle: "Patient Age Group",
    under2: "Children < 2 years old",
    over2: "Children ≥ 2 years old",
    highRiskSection: "High-Risk Criteria (ciTBI Risk ~4.4% — Head CT Recommended)",
    gcsAltered: "GCS < 15 or signs of altered mental status (agitation, somnolence, slow response)",
    palpableFx: "Palpable skull fracture (< 2 yrs)",
    basilarFx: "Signs of basilar skull fracture (raccoon eyes, Battle sign, hemotympanum, CSF leak) (≥ 2 yrs)",
    intermediateSection: "Intermediate-Risk Criteria (ciTBI Risk ~0.9% — Observation vs CT)",
    scalpHematoma: "Non-frontal scalp hematoma (occipital, parietal, or temporal) (< 2 yrs)",
    locUnder2: "Loss of consciousness ≥ 5 seconds (< 2 yrs)",
    locOver2: "History of any loss of consciousness (≥ 2 yrs)",
    actingAbnormal: "Parent reports child is acting abnormally / not acting like self (< 2 yrs)",
    vomiting: "History of vomiting (≥ 2 yrs)",
    severeHeadache: "Severe headache (≥ 2 yrs)",
    severeMechUnder2: "Severe mechanism (fall > 3 ft [0.9 m], MVC ejection/rollover, pedestrian struck, high-impact object) (< 2 yrs)",
    severeMechOver2: "Severe mechanism (fall > 5 ft [1.5 m], MVC ejection/rollover, pedestrian struck, high-impact object) (≥ 2 yrs)",
    yes: "Yes",
    no: "No",
    result: "Decision & Recommendation",
    references: "Kuppermann N, Holmes JF, Dayan PS, et al. Identification of children at very low risk of clinically-important brain injuries after head trauma: a prospective cohort study. Lancet. 2009;374(9696):1160-1170. (PMID: 19758692).",
    faqs: [
      { question: "What is the primary goal of the PECARN rule?", answer: "The PECARN pediatric head injury decision rule safely rules out clinically important traumatic brain injury (ciTBI: death, neurosurgery, intubation > 24 hr, or hospital admission ≥ 2 nights for persistent symptoms) with > 99.9% negative predictive value, sparing unnecessary ionizing radiation in children." },
      { question: "What is recommended for intermediate-risk children?", answer: "For children with intermediate features (ciTBI risk ~0.9%), shared decision-making is recommended. A 4 to 6-hour period of clinical observation in the ED often avoids CT, as symptoms improve in low-risk children." },
      { question: "Can CT be omitted if all criteria are negative?", answer: "Yes! If all PECARN criteria are absent, the risk of ciTBI is under 0.05% (< 0.02% in infants). Head CT is NOT indicated." }
    ],
    lowRisk: "Very Low Risk (ciTBI < 0.05%): CT Scan NOT Recommended",
    lowRiskDesc: "Negative predictive value > 99.9%. Cranial CT is NOT recommended. Safe for discharge with clear parental concussion / head injury precautions.",
    intermediateRisk: "Intermediate Risk (ciTBI ~0.9%): Observation vs CT",
    intermediateRiskDesc: "CT vs ED observation (4–6 hours) based on clinician experience, multiple vs isolated findings, age < 3 months, worsening symptoms, and shared decision-making.",
    highRisk: "High Risk (ciTBI ~4.3 – 4.4%): Head CT Strongly Recommended",
    highRiskDesc: "Immediate non-contrast head CT scan and urgent pediatric trauma / neurosurgical consultation indicated."
  },
  fr: {
    title: "Règle PECARN (Traumatisme Crânien Pédiatrique)",
    subtitle: "Identifie les enfants à très faible risque de lésion cérébrale grave pour éviter l'irradiation par scanner crânien",
    ageGroupTitle: "Tranche d'Âge de l'Enfant",
    under2: "Enfant < 2 ans",
    over2: "Enfant ≥ 2 ans",
    highRiskSection: "Critères de Haut Risque (Lésion Cérébrale ~4,4% — Scanner Recommandé)",
    gcsAltered: "Glasgow < 15 ou altération de l'état de conscience (agitation, somnolence, regard fixe)",
    palpableFx: "Fracture du crâne palpable à l'examen (< 2 ans)",
    basilarFx: "Signes de fracture de la base du crâne (yeux de raton laveur, Battle, hémotympan) (≥ 2 ans)",
    intermediateSection: "Critères de Risque Intermédiaire (Lésion ~0,9% — Surveillance vs TDM)",
    scalpHematoma: "Hématome du scalp non-frontal (occipital, pariétal ou temporal) (< 2 ans)",
    locUnder2: "Perte de connaissance ≥ 5 secondes (< 2 ans)",
    locOver2: "Notion de perte de connaissance (≥ 2 ans)",
    actingAbnormal: "Comportement anormal selon les parents (< 2 ans)",
    vomiting: "Vomissements répétés (≥ 2 ans)",
    severeHeadache: "Céphalée intense (≥ 2 ans)",
    severeMechUnder2: "Mécanisme violent (chute > 0,9 m [3 pieds], éjection AVP, piéton renversé) (< 2 ans)",
    severeMechOver2: "Mécanisme violent (chute > 1,5 m [5 pieds], éjection AVP, piéton renversé) (≥ 2 ans)",
    yes: "Oui",
    no: "Non",
    result: "Décision Clinique & Imagerie",
    references: "Kuppermann N, et al. Lancet. 2009;374(9696):1160-1170. (PMID: 19758692).",
    faqs: [
      { question: "Quel est l'intérêt de la règle PECARN ?", answer: "Elle permet d'éliminer une lésion cérébrale traumatique grave avec une valeur prédictive négative > 99,9%, évitant l'irradiation cérébrale inutile." }
    ],
    lowRisk: "Risque Très Faible (< 0,05%) : Scanner NON Recommandé",
    lowRiskDesc: "Le scanner crânien n'est PAS indiqué. Retour à domicile possible avec consignes de surveillance parentale écrites.",
    intermediateRisk: "Risque Intermédiaire (~0,9%) : Surveillance Hospitalière vs Scanner",
    intermediateRiskDesc: "Surveillance clinique aux urgences de 4 à 6 heures ou scanner selon l'évolution clinique et l'accord des parents.",
    highRisk: "Risque Élevé (~4,4%) : Scanner Cérébral Recommandé en Urgence",
    highRiskDesc: "Réalisation d'un scanner crânien sans injection et avis neurochirurgical/pédiatrique urgent."
  }
};

export default function PecarnHeadTrauma({ lang }: { lang: LangCode }) {
  const [ageGroup, setAgeGroup] = useState<'under2' | 'over2'>('under2');

  // High risk
  const [gcsAltered, setGcsAltered] = useState<boolean>(false);
  const [skullFracture, setSkullFracture] = useState<boolean>(false);

  // Intermediate risk
  const [scalpHematoma, setScalpHematoma] = useState<boolean>(false);
  const [loc, setLoc] = useState<boolean>(false);
  const [actingAbnormal, setActingAbnormal] = useState<boolean>(false);
  const [vomiting, setVomiting] = useState<boolean>(false);
  const [severeHeadache, setSevereHeadache] = useState<boolean>(false);
  const [severeMech, setSevereMech] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const riskLevel = useMemo(() => {
    // High risk check
    if (gcsAltered || skullFracture) {
      return 'high';
    }

    // Intermediate risk check
    if (ageGroup === 'under2') {
      if (scalpHematoma || loc || actingAbnormal || severeMech) {
        return 'intermediate';
      }
    } else {
      if (loc || vomiting || severeHeadache || severeMech) {
        return 'intermediate';
      }
    }

    return 'low';
  }, [ageGroup, gcsAltered, skullFracture, scalpHematoma, loc, actingAbnormal, vomiting, severeHeadache, severeMech]);

  useEffect(() => {
    trackCalculatorUsage('pecarn-head-trauma', lang, riskLevel === 'high' ? 2 : riskLevel === 'intermediate' ? 1 : 0);
  }, [riskLevel, lang]);

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/pecarn-head-trauma"
        scoringSystem="PECARN Pediatric Head Trauma Prediction Rule"
        howToSteps={[
          lang === 'fr' ? 'Sélectionner la tranche d\'âge de l\'enfant (< 2 ans vs ≥ 2 ans).' : 'Select pediatric age cohort (< 2 years vs >= 2 years).',
          lang === 'fr' ? 'Rechercher les critères de haut risque imposant le scanner crânien.' : 'Screen for high-risk criteria warranting immediate head CT.',
          lang === 'fr' ? 'En l\'absence de tout critère, le scanner n\'est pas indiqué (VPN > 99,9%).' : 'If all criteria absent, head CT is not indicated (NPV > 99.9%).'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <Baby className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Pédiatrie & Médecine d\'Urgence' : 'Pediatrics & Emergency Medicine'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
            {/* Age Group */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.ageGroupTitle}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAgeGroup('under2')}
                  className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                    ageGroup === 'under2' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.under2}
                </button>
                <button
                  type="button"
                  onClick={() => setAgeGroup('over2')}
                  className={`py-3 px-3 rounded-xl border font-bold text-sm transition-all ${
                    ageGroup === 'over2' ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {currentText.over2}
                </button>
              </div>
            </div>

            {/* High-Risk Section */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block mb-1">
                {currentText.highRiskSection}
              </span>

              <button
                type="button"
                onClick={() => setGcsAltered(!gcsAltered)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                  gcsAltered ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {currentText.gcsAltered}
              </button>

              <button
                type="button"
                onClick={() => setSkullFracture(!skullFracture)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                  skullFracture ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}
              >
                {ageGroup === 'under2' ? currentText.palpableFx : currentText.basilarFx}
              </button>
            </div>

            {/* Intermediate-Risk Section */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                {currentText.intermediateSection}
              </span>

              {ageGroup === 'under2' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setScalpHematoma(!scalpHematoma)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      scalpHematoma ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.scalpHematoma}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLoc(!loc)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      loc ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.locUnder2}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActingAbnormal(!actingAbnormal)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      actingAbnormal ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.actingAbnormal}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSevereMech(!severeMech)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      severeMech ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.severeMechUnder2}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setLoc(!loc)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      loc ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.locOver2}
                  </button>

                  <button
                    type="button"
                    onClick={() => setVomiting(!vomiting)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      vomiting ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.vomiting}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSevereHeadache(!severeHeadache)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      severeHeadache ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.severeHeadache}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSevereMech(!severeMech)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      severeMech ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    {currentText.severeMechOver2}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3">
                <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                  riskLevel === 'low' ? 'text-emerald-400' : riskLevel === 'intermediate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {riskLevel === 'low'
                    ? (lang === 'fr' ? 'Pas de scanner' : 'CT Not Indicated')
                    : riskLevel === 'intermediate'
                    ? (lang === 'fr' ? 'Surveillance vs TDM' : 'Observation vs CT')
                    : (lang === 'fr' ? 'Scanner recommandé' : 'Head CT Recommended')}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${
                riskLevel === 'low'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : riskLevel === 'intermediate'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {riskLevel === 'low' ? currentText.lowRisk : riskLevel === 'intermediate' ? currentText.intermediateRisk : currentText.highRisk}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {riskLevel === 'low' ? currentText.lowRiskDesc : riskLevel === 'intermediate' ? currentText.intermediateRiskDesc : currentText.highRiskDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age Cohort", value: ageGroup === 'under2' ? "< 2 years" : "≥ 2 years" },
                  { label: "High Risk Flags", value: (gcsAltered || skullFracture) ? "Present" : "None" },
                  { label: "Intermediate Flags", value: (scalpHematoma || loc || actingAbnormal || vomiting || severeHeadache || severeMech) ? "Present" : "None" }
                ]}
                results={[
                  { label: "Risk Category", value: riskLevel.toUpperCase() },
                  { label: "ciTBI Estimated Risk", value: riskLevel === 'low' ? "< 0.05%" : riskLevel === 'intermediate' ? "~0.9%" : "~4.4%" },
                  { label: "CT Recommendation", value: riskLevel === 'low' ? "CT NOT indicated (Discharge home)" : riskLevel === 'intermediate' ? "Observation (4-6 hr) vs CT" : "Cranial CT Strongly Indicated" }
                ]}
                formula="PECARN Traumatic Brain Injury Multi-Tier Decision Algorithm"
                disclaimer="NPV > 99.9% for ciTBI when all PECARN criteria are negative."
                references="Kuppermann N, et al. Lancet. 2009;374(9696):1160-1170."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PEDIATRICS} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/19758692/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Kuppermann N et al. (2009) The Lancet <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
