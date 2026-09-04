import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldPlus } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_CARDIOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "DAPT Score for Post-PCI Antiplatelet Duration",
    subtitle: "Determines whether to extend dual antiplatelet therapy beyond 12 months after coronary stenting",
    ageTitle: "Patient Age",
    ageUnder65: "< 65 years (0)",
    age65to74: "65 – 74 years (-1)",
    age75plus: "≥ 75 years (-2)",
    riskFactorsTitle: "Clinical & Procedural Characteristics",
    smoker: "Current cigarette smoker (+1)",
    diabetes: "Diabetes mellitus (+1)",
    miPresentation: "Myocardial infarction at presentation (+1)",
    priorPciMi: "Prior PCI or prior MI (+1)",
    paclitaxel: "Paclitaxel-eluting stent (+1)",
    smallStent: "Stent diameter < 3 mm (+1)",
    chfLvef: "Congestive heart failure or LVEF < 30% (+2)",
    veinGraft: "Bypass vein graft stent (+2)",
    result: "Calculated DAPT Score",
    recommendationTitle: "DAPT Duration Decision",
    references: "Yeh RW, Secemsky EA, Kereiakes DJ, et al. Development and Validation of a Prediction Rule for Benefit and Harm of Dual Antiplatelet Therapy Beyond 1 Year After Percutaneous Coronary Intervention. JAMA. 2016;315(16):1735-1749. (PMID: 27022822).",
    faqs: [
      { question: "What is the clinical role of the DAPT Score?", answer: "The DAPT score is applied at 12 months post-PCI in event-free patients who have completed 1 year of DAPT to decide whether extending therapy (up to 30 months) offers net clinical benefit." },
      { question: "What does a score < 2 indicate?", answer: "A score < 2 indicates an unfavorable benefit-to-risk ratio. Extending DAPT yields higher major bleeding with minimal reduction in ischemic events. Discontinue the P2Y12 inhibitor and continue single antiplatelet therapy (typically Aspirin)." },
      { question: "What does a score ≥ 2 indicate?", answer: "A score ≥ 2 indicates a favorable benefit-to-risk profile. Continuing DAPT achieves significant reductions in myocardial infarction and stent thrombosis with manageable bleeding risk." }
    ],
    scoreLow: "DAPT Score < 2: Standard 12-Month Duration",
    scoreLowDesc: "Unfavorable risk-benefit ratio. Extending DAPT beyond 1 year increases bleeding risk without ischemic benefit. Discontinue P2Y12 inhibitor and continue aspirin monotherapy.",
    scoreHigh: "DAPT Score ≥ 2: Extended DAPT Duration Favored",
    scoreHighDesc: "Favorable risk-benefit ratio. Significant reduction in recurrent MI and stent thrombosis outweighs bleeding hazard. Consider extending DAPT up to 30 months."
  },
  fr: {
    title: "Score DAPT (Durée de Bithérapie Antiagrégante)",
    subtitle: "Aide à décider de la prolongation de la DAPT au-delà de 12 mois après angioplastie coronaire (stent actif)",
    ageTitle: "Âge du Patient",
    ageUnder65: "< 65 ans (0)",
    age65to74: "65 à 74 ans (-1)",
    age75plus: "≥ 75 ans (-2)",
    riskFactorsTitle: "Critères Cliniques & Procéduraux",
    smoker: "Tabagisme actif (+1)",
    diabetes: "Diabète connu (+1)",
    miPresentation: "Infarctus (IDM) lors de la procédure index (+1)",
    priorPciMi: "Antécédent d'angioplastie ou d'infarctus (+1)",
    paclitaxel: "Stent actif au Paclitaxel (+1)",
    smallStent: "Diamètre de stent < 3 mm (+1)",
    chfLvef: "Insuffisance cardiaque ou FEVG < 30% (+2)",
    veinGraft: "Stent sur pontage saphène (+2)",
    result: "Score DAPT Calculé",
    recommendationTitle: "Décision Thérapeutique",
    references: "Yeh RW, et al. JAMA. 2016;315(16):1735-1749. (PMID: 27022822).",
    faqs: [
      { question: "Quand calculer le score DAPT ?", answer: "À 12 mois de la pose du stent chez un patient n'ayant pas présenté d'hémorragie ni de récidive ischémique." },
      { question: "Quelle est la règle de décision ?", answer: "Score < 2 : arrêt du deuxième antiagrégant (monothérapie). Score ≥ 2 : bénéfice net à prolonger la bithérapie jusqu'à 30 mois." }
    ],
    scoreLow: "Score DAPT < 2 : Arrêt de la DAPT à 12 Mois",
    scoreLowDesc: "Rapport bénéfice/risque défavorable. Poursuivre la bithérapie expose à un surcroît hémorragique sans gain ischémique prouvé. Poursuivre l'aspirine seule.",
    scoreHigh: "Score DAPT ≥ 2 : Bithérapie Prolongée Recommandée",
    scoreHighDesc: "Bénéfice ischémique démontré. Réduction notable du risque d'infarctus récidivant et de thrombose de stent. Poursuite de la DAPT jusqu'à 30 mois."
  }
};

export default function DaptScore({ lang }: { lang: LangCode }) {
  const [agePoints, setAgePoints] = useState<number>(0);
  const [smoker, setSmoker] = useState<boolean>(true);
  const [diabetes, setDiabetes] = useState<boolean>(false);
  const [miPresentation, setMiPresentation] = useState<boolean>(true);
  const [priorPciMi, setPriorPciMi] = useState<boolean>(false);
  const [paclitaxel, setPaclitaxel] = useState<boolean>(false);
  const [smallStent, setSmallStent] = useState<boolean>(true);
  const [chfLvef, setChfLvef] = useState<boolean>(false);
  const [veinGraft, setVeinGraft] = useState<boolean>(false);

  const currentText = translations[lang] || translations.en;

  const score = useMemo(() => {
    let s = agePoints;
    if (smoker) s += 1;
    if (diabetes) s += 1;
    if (miPresentation) s += 1;
    if (priorPciMi) s += 1;
    if (paclitaxel) s += 1;
    if (smallStent) s += 1;
    if (chfLvef) s += 2;
    if (veinGraft) s += 2;
    return s;
  }, [agePoints, smoker, diabetes, miPresentation, priorPciMi, paclitaxel, smallStent, chfLvef, veinGraft]);

  useEffect(() => {
    trackCalculatorUsage('dapt-score', lang, score);
  }, [score, lang]);

  const isExtendedFavored = score >= 2;

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/dapt-score"
        scoringSystem="DAPT Study Prediction Rule"
        howToSteps={[
          lang === 'fr' ? 'À 12 mois post-angioplastie, évaluer l\'âge du patient (-2 à 0 pt).' : 'At 12 months post-PCI, select patient age category (-2 to 0 pts).',
          lang === 'fr' ? 'Cocher les caractéristiques cliniques et anatomiques de la lésion coronaire.' : 'Check clinical and procedural stent characteristics.',
          lang === 'fr' ? 'Score < 2 : arrêt à 12 mois; Score ≥ 2 : prolongation jusqu\'à 30 mois.' : 'Score < 2: Stop at 12 months; Score >= 2: Extend DAPT up to 30 months.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">
          <ShieldPlus className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Cardiologie Interventionnelle' : 'Interventional Cardiology'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-5">
            {/* Age Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-2">{currentText.ageTitle}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pts: 0, label: currentText.ageUnder65 },
                  { pts: -1, label: currentText.age65to74 },
                  { pts: -2, label: currentText.age75plus }
                ].map((tier) => (
                  <button
                    key={tier.pts}
                    type="button"
                    onClick={() => setAgePoints(tier.pts)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                      agePoints === tier.pts
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1">
                {currentText.riskFactorsTitle}
              </label>

              {[
                { state: smoker, set: setSmoker, label: currentText.smoker },
                { state: diabetes, set: setDiabetes, label: currentText.diabetes },
                { state: miPresentation, set: setMiPresentation, label: currentText.miPresentation },
                { state: priorPciMi, set: setPriorPciMi, label: currentText.priorPciMi },
                { state: paclitaxel, set: setPaclitaxel, label: currentText.paclitaxel },
                { state: smallStent, set: setSmallStent, label: currentText.smallStent },
                { state: chfLvef, set: setChfLvef, label: currentText.chfLvef },
                { state: veinGraft, set: setVeinGraft, label: currentText.veinGraft }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => item.set(!item.state)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                    item.state ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20 font-bold' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
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
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  isExtendedFavored ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {score > 0 ? `+${score}` : score}
                </span>
                <span className="text-xl text-gray-400 font-medium">points</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                isExtendedFavored ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {isExtendedFavored ? currentText.scoreHigh : currentText.scoreLow}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {isExtendedFavored ? currentText.scoreHighDesc : currentText.scoreLowDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Age Score", value: `${agePoints} pts` },
                  { label: "Smoker / DM", value: `Smoker: ${smoker ? 'Yes' : 'No'} | DM: ${diabetes ? 'Yes' : 'No'}` },
                  { label: "MI / Prior PCI", value: `MI: ${miPresentation ? 'Yes' : 'No'} | Prior: ${priorPciMi ? 'Yes' : 'No'}` },
                  { label: "Stent / CHF", value: `Small stent: ${smallStent ? 'Yes' : 'No'} | LVEF<30%: ${chfLvef ? 'Yes' : 'No'}` }
                ]}
                results={[
                  { label: "DAPT Score", value: `${score > 0 ? `+${score}` : score} points` },
                  { label: "Recommendation", value: isExtendedFavored ? "Extend DAPT (Score ≥ 2)" : "Standard 12 Months Only (Score < 2)" },
                  { label: "Risk Profile", value: isExtendedFavored ? "Ischemic Benefit Outweighs Bleeding" : "Bleeding Harm Outweighs Ischemic Benefit" }
                ]}
                formula="DAPT Study Score (-2 to +10 range)"
                disclaimer="Applied at 12 months in event-free patients following coronary stent implantation."
                references="Yeh RW, et al. JAMA. 2016;315(16):1735-1749."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_CARDIOLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-rose-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/27022822/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Yeh RW et al. (2016) JAMA <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
