import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, Award } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEUROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Modified Rankin Scale (mRS) for Neurologic Disability",
    subtitle: "Gold standard outcome measure evaluating degree of disability and dependence in daily activities after stroke",
    selectGrade: "Select Patient Functional Status",
    grade0: "Grade 0: No symptoms at all",
    grade0Desc: "Completely asymptomatic. No residual physical or cognitive deficits.",
    grade1: "Grade 1: No significant disability despite symptoms",
    grade1Desc: "Able to carry out all usual duties and activities despite minor symptoms.",
    grade2: "Grade 2: Slight disability (Independent)",
    grade2Desc: "Unable to carry out all previous activities, but able to look after own affairs without assistance.",
    grade3: "Grade 3: Moderate disability (Ambulatory with help)",
    grade3Desc: "Requires some help with daily living, but able to walk without assistance of another person.",
    grade4: "Grade 4: Moderately severe disability",
    grade4Desc: "Unable to walk without assistance and unable to attend to own bodily needs without assistance.",
    grade5: "Grade 5: Severe disability (Bedridden)",
    grade5Desc: "Bedridden, incontinent, requiring constant nursing care and 24-hour attention.",
    grade6: "Grade 6: Dead",
    grade6Desc: "Patient deceased.",
    result: "Assigned mRS Score",
    outcomeTitle: "Clinical Trial & Functional Outcome",
    references: "van Swieten JC, Koudstaal PJ, Visser MC, Schouten HJ, van Gijn J. Interobserver agreement for the assessment of handicap in stroke patients. Stroke. 1988;19(5):604-607. (PMID: 3363593).",
    faqs: [
      { question: "What does mRS measure?", answer: "The modified Rankin Scale (mRS) measures the degree of functional disability and dependence in daily activities following an ischemic or hemorrhagic stroke." },
      { question: "What score defines a 'favorable outcome' in stroke clinical trials?", answer: "An mRS score of 0 to 2 defines functional independence (favorable outcome in thrombolysis and endovascular mechanical thrombectomy trials)." },
      { question: "What is the critical distinction between Grade 2 and Grade 3?", answer: "Patients with Grade 2 are completely independent in their own personal affairs and basic ADLs. Grade 3 patients require assistance with instrumental or basic activities of daily living, though they can still walk without hands-on human help." }
    ],
    favorable: "mRS 0 – 2: Functional Independence (Favorable Outcome)",
    favorableDesc: "Patient is independent in basic activities of daily living (ADLs). Primary benchmark for successful acute stroke reperfusion therapy.",
    unfavorable: "mRS 3 – 5: Dependent (Unfavorable Outcome)",
    unfavorableDesc: "Patient requires assistance with daily activities or is bedridden. Warrants comprehensive neurorehabilitation, multidisciplinary therapy, and home support.",
    dead: "mRS 6: Mortality",
    deadDesc: "Stroke-related or all-cause mortality."
  },
  fr: {
    title: "Échelle de Rankin Modifiée (mRS)",
    subtitle: "Mesure de référence du handicap fonctionnel et du degré de dépendance après un AVC",
    selectGrade: "Sélectionnez l'état fonctionnel du patient",
    grade0: "Grade 0 : Aucun symptôme",
    grade0Desc: "Patient totalement asymptomatique.",
    grade1: "Grade 1 : Pas d'incapacité significative malgré des symptômes",
    grade1Desc: "Capable d'accomplir toutes les activités habituelles malgré des symptômes minimes.",
    grade2: "Grade 2 : Incapacité légère (Indépendant)",
    grade2Desc: "Incapable d'accomplir toutes les activités antérieures mais autonome pour les actes de la vie courante.",
    grade3: "Grade 3 : Incapacité modérée",
    grade3Desc: "A besoin d'aide pour certains actes, mais marche sans aide humaine.",
    grade4: "Grade 4 : Incapacité modérément sévère",
    grade4Desc: "Incapable de marcher sans assistance et incapable de subvenir à ses besoins corporels sans aide.",
    grade5: "Grade 5 : Incapacité sévère (Alité)",
    grade5Desc: "Alité, grabataire, incontinent, nécessitant des soins infirmiers et une présence permanente.",
    grade6: "Grade 6 : Décès",
    grade6Desc: "Patient décédé.",
    result: "Score mRS Attribué",
    outcomeTitle: "Autonomie Fonctionnelle & Critère d'Essai",
    references: "van Swieten JC, et al. Stroke. 1988;19(5):604-607. (PMID: 3363593).",
    faqs: [
      { question: "Que mesure le score mRS ?", answer: "L'échelle de Rankin modifiée mesure le niveau d'autonomie ou de dépendance dans la vie quotidienne après un AVC." },
      { question: "Quelle valeur correspond à l'indépendance fonctionnelle ?", answer: "Un score mRS entre 0 et 2 définit l'indépendance fonctionnelle (critère de succès dans les essais de thrombolyse et thrombectomie mécanique)." }
    ],
    favorable: "mRS 0 – 2 : Indépendance Fonctionnelle (Évolution Favorable)",
    favorableDesc: "Autonomie conservée pour les actes élémentaires de la vie quotidienne. Objectif thérapeutique majeur.",
    unfavorable: "mRS 3 – 5 : Dépendance Fonctionnelle",
    unfavorableDesc: "Patient dépendant pour les activités quotidiennes ou alité. Nécessite une rééducation active et un aménagement des aides de vie.",
    dead: "mRS 6 : Décès",
    deadDesc: "Décès du patient."
  }
};

export default function ModifiedRankinScale({ lang }: { lang: LangCode }) {
  const [grade, setGrade] = useState<number>(1);

  const currentText = translations[lang] || translations.en;

  useEffect(() => {
    trackCalculatorUsage('modified-rankin-scale', lang, grade);
  }, [grade, lang]);

  const statusType = useMemo(() => {
    if (grade <= 2) return 'favorable';
    if (grade <= 5) return 'unfavorable';
    return 'dead';
  }, [grade]);

  const grades = [
    { score: 0, title: currentText.grade0, desc: currentText.grade0Desc },
    { score: 1, title: currentText.grade1, desc: currentText.grade1Desc },
    { score: 2, title: currentText.grade2, desc: currentText.grade2Desc },
    { score: 3, title: currentText.grade3, desc: currentText.grade3Desc },
    { score: 4, title: currentText.grade4, desc: currentText.grade4Desc },
    { score: 5, title: currentText.grade5, desc: currentText.grade5Desc },
    { score: 6, title: currentText.grade6, desc: currentText.grade6Desc },
  ];

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/modified-rankin-scale"
        scoringSystem="Modified Rankin Scale for Stroke Disability"
        howToSteps={[
          lang === 'fr' ? 'Évaluer le degré de dépendance pour la marche et les activités de la vie quotidienne.' : 'Assess degree of dependence for ambulation and daily personal activities.',
          lang === 'fr' ? 'Sélectionner le grade de 0 (asymptomatique) à 6 (décès).' : 'Select functional grade from 0 (asymptomatic) to 6 (death).',
          lang === 'fr' ? 'Un score mRS 0-2 définit l\'indépendance fonctionnelle.' : 'mRS 0 to 2 defines functional independence in stroke clinical trials.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 mb-2">
          <Award className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Neurologie & Rééducation Fonctionnelle' : 'Neurology & Stroke Rehabilitation'}</span>
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
              {currentText.selectGrade}
            </label>

            <div className="space-y-2.5">
              {grades.map((item) => {
                const isSelected = grade === item.score;
                return (
                  <button
                    key={item.score}
                    type="button"
                    onClick={() => setGrade(item.score)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? item.score <= 2
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                          : item.score <= 5
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                          : 'bg-gray-100 border-gray-500 ring-2 ring-gray-500/20'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                        {item.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        item.score <= 2 ? 'bg-emerald-100 text-emerald-800' : item.score <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-800'
                      }`}>
                        Score {item.score}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  statusType === 'favorable' ? 'text-emerald-400' : statusType === 'unfavorable' ? 'text-amber-400' : 'text-gray-400'
                }`}>
                  {grade}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 6 (Grade)</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                statusType === 'favorable'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : statusType === 'unfavorable'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {statusType === 'favorable' ? currentText.favorable : statusType === 'unfavorable' ? currentText.unfavorable : currentText.dead}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {statusType === 'favorable' ? currentText.favorableDesc : statusType === 'unfavorable' ? currentText.unfavorableDesc : currentText.deadDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={[
                  { label: "Assigned Grade", value: `Grade ${grade}` },
                  { label: "Functional Status", value: grades[grade].title }
                ]}
                results={[
                  { label: "mRS Score", value: `${grade} / 6` },
                  { label: "Functional Independence", value: grade <= 2 ? "Independent (mRS 0-2)" : "Dependent (mRS 3-5)" }
                ]}
                formula="Standardized 7-point ordinal neurological disability scale (0 to 6)"
                disclaimer="mRS 0-2 indicates favorable outcome and functional independence in daily living."
                references="van Swieten JC, et al. Stroke. 1988;19(5):604-607."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_NEUROLOGY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-indigo-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/3363593/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              van Swieten JC et al. (1988) Stroke <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
