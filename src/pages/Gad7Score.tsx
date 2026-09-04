import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, HeartPulse } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PSYCHIATRY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "GAD-7 Anxiety Screening & Severity Scale",
    subtitle: "Validated 7-item instrument for screening and measuring Generalized Anxiety Disorder severity over the past 2 weeks",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    options: ["Not at all (0)", "Several days (+1)", "More than half the days (+2)", "Nearly every day (+3)"],
    q1: "1. Feeling nervous, anxious, or on edge",
    q2: "2. Not being able to stop or control worrying",
    q3: "3. Worrying too much about different things",
    q4: "4. Trouble relaxing",
    q5: "5. Being so restless that it's hard to sit still",
    q6: "6. Becoming easily annoyed or irritable",
    q7: "7. Feeling afraid, as if something awful might happen",
    result: "Total GAD-7 Score",
    severityHeading: "Severity Level & Action",
    formula: "GAD-7 = Sum of 7 items (0 to 3 each), Total Range 0 – 21",
    references: "Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097. (PMID: 16717171).",
    faqs: [
      { question: "What is the clinical cutoff for the GAD-7?", answer: "A score of 10 or greater represents the validated clinical cut-point for identifying probable Generalized Anxiety Disorder (sensitivity 89%, specificity 82%). Further clinical evaluation is recommended." },
      { question: "Can GAD-7 be used to monitor treatment response?", answer: "Yes. Serial GAD-7 tracking is strongly recommended to assess response to pharmacotherapy (SSRIs/SNRIs) and cognitive behavioral therapy (CBT). A drop of ≥ 5 points indicates clinically meaningful improvement." },
      { question: "Does GAD-7 assess panic disorder or social phobia?", answer: "While developed for GAD, a score ≥ 10 also exhibits high sensitivity for panic disorder, social anxiety disorder, and PTSD." }
    ],
    minimal: "Score 0 – 4: Minimal Anxiety",
    minimalDesc: "No clinically significant anxiety symptoms reported. Routine follow-up as indicated.",
    mild: "Score 5 – 9: Mild Anxiety",
    mildDesc: "Mild anxiety symptoms. Supportive counseling, lifestyle optimization, and watchful waiting recommended.",
    moderate: "Score 10 – 14: Moderate Anxiety (Clinical Threshold)",
    moderateDesc: "Score ≥ 10 is the clinical cutoff for probable GAD. Formal clinical psychiatric evaluation, CBT, or first-line pharmacotherapy (SSRI/SNRI) indicated.",
    severe: "Score 15 – 21: Severe Anxiety",
    severeDesc: "Severe anxiety impairing daily functioning. Comprehensive psychiatric evaluation and active multimodal treatment (psychotherapy + pharmacotherapy) strongly indicated."
  },
  fr: {
    title: "Échelle GAD-7 (Dépistage & Sévérité de l'Anxiété)",
    subtitle: "Outil validé en 7 items pour dépister et quantifier le trouble d'anxiété généralisée au cours des 2 dernières semaines",
    instructions: "Au cours des 2 dernières semaines, à quelle fréquence avez-vous été gêné(e) par les problèmes suivants ?",
    options: ["Jamais (0)", "Plusieurs jours (+1)", "Plus de la moitié du temps (+2)", "Presque tous les jours (+3)"],
    q1: "1. Vous sentir nerveux(se), anxieux(se) ou sur les nerfs",
    q2: "2. Ne pas être capable d'arrêter ou de contrôler vos inquiétudes",
    q3: "3. Vous faire trop de souci pour différentes choses",
    q4: "4. Avoir des difficultés à vous détendre",
    q5: "5. Être si agité(e) qu'il est difficile de rester assis(e)",
    q6: "6. Être facilement agacé(e) ou irritable",
    q7: "7. Avoir peur que quelque chose d'horrible ne se produise",
    result: "Score Total GAD-7",
    severityHeading: "Niveau de Sévérité & Conduite à Tenir",
    formula: "Score GAD-7 = Somme des 7 items (0 à 3), Plage 0 à 21",
    references: "Spitzer RL, et al. Arch Intern Med. 2006;166(10):1092-1097. (PMID: 16717171).",
    faqs: [
      { question: "Quel est le seuil diagnostique du GAD-7 ?", answer: "Un score ≥ 10 représente le seuil validé orientant vers un trouble anxiété généralisée (sensibilité 89%, spécificité 82%). Une évaluation clinique formelle est recommandée." },
      { question: "Peut-on utiliser le GAD-7 pour le suivi thérapeutique ?", answer: "Oui. Le questionnaire est un excellent outil de suivi de la réponse aux thérapies cognitivo-comportementales (TCC) et aux traitements médicamenteux (ISRS/IRSNa)." }
    ],
    minimal: "Score 0 – 4 : Anxiété Minime",
    minimalDesc: "Pas de symptôme d'anxiété cliniquement significatif. Surveillance simple.",
    mild: "Score 5 – 9 : Anxiété Légère",
    mildDesc: "Symptômes anxieux discrets. Mesures hygiéno-diététiques, relaxation et suivi régulier.",
    moderate: "Score 10 – 14 : Anxiété Modérée (Seuil Clinique)",
    moderateDesc: "Seuil clinique positif pour un trouble d'anxiété généralisée. Évaluation médicale approfondie, indication d'une psychothérapie (TCC) ou d'un traitement de première intention (ISRS).",
    severe: "Score 15 – 21 : Anxiété Sévère",
    severeDesc: "Anxiété majeure avec retentissement fonctionnel marqué. Prise en charge psychiatrique active et multidisciplinaire indispensable."
  }
};

export default function Gad7Score({ lang }: { lang: LangCode }) {
  const [answers, setAnswers] = useState<number[]>([1, 1, 1, 1, 0, 1, 0]);

  const currentText = translations[lang] || translations.en;

  const totalScore = useMemo(() => {
    return answers.reduce((sum, val) => sum + val, 0);
  }, [answers]);

  useEffect(() => {
    trackCalculatorUsage('gad7-score', lang, totalScore);
  }, [totalScore, lang]);

  const severity = useMemo(() => {
    if (totalScore <= 4) return 'minimal';
    if (totalScore <= 9) return 'mild';
    if (totalScore <= 14) return 'moderate';
    return 'severe';
  }, [totalScore]);

  const questions = [
    currentText.q1,
    currentText.q2,
    currentText.q3,
    currentText.q4,
    currentText.q5,
    currentText.q6,
    currentText.q7
  ];

  const handleSelect = (qIdx: number, val: number) => {
    const updated = [...answers];
    updated[qIdx] = val;
    setAnswers(updated);
  };

  return (
    <>
      <CalcPageSchemas
        name={currentText.title}
        description={currentText.subtitle}
        path="/gad7-score"
        scoringSystem="GAD-7 Anxiety Scale"
        howToSteps={[
          lang === 'fr' ? 'Répondre aux 7 questions selon l\'état ressenti au cours des 2 dernières semaines.' : 'Answer each of the 7 questions based on symptoms over the past 2 weeks.',
          lang === 'fr' ? 'Un score ≥ 10 indique une anxiété cliniquement significative (trouble anxieux généralisé probable).' : 'Score >= 10 indicates clinically significant anxiety warrants clinical workup.',
          lang === 'fr' ? 'Un score ≥ 15 justifie une prise en charge active multidisciplinaire.' : 'Score >= 15 indicates severe anxiety requiring active intervention.'
        ]}
        faqs={currentText.faqs}
      />

      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-700 mb-2">
          <HeartPulse className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Psychiatrie & Santé Mentale' : 'Psychiatry & Behavioral Health'}</span>
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
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 pb-2 border-b border-gray-100">
              {currentText.instructions}
            </p>

            <div className="space-y-5">
              {questions.map((q, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">{q}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {currentText.options.map((opt: string, optIdx: number) => {
                      const isSelected = answers[idx] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelect(idx, optIdx)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                            isSelected
                              ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/20 shadow-sm'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-white/10 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 p-24 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col gap-5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block">
                {currentText.result}
              </span>
              
              <div className="flex items-baseline gap-3 tabular-nums">
                <span className={`text-5xl md:text-6xl font-extrabold tracking-tight ${
                  severity === 'minimal' ? 'text-emerald-400' : severity === 'mild' ? 'text-teal-400' : severity === 'moderate' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {totalScore}
                </span>
                <span className="text-xl text-gray-400 font-medium">/ 21 points</span>
              </div>

              <div className={`p-4 rounded-xl border ${
                severity === 'minimal'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : severity === 'mild'
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : severity === 'moderate'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                <div className="font-bold text-sm mb-1">
                  {severity === 'minimal' ? currentText.minimal : severity === 'mild' ? currentText.mild : severity === 'moderate' ? currentText.moderate : currentText.severe}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {severity === 'minimal' ? currentText.minimalDesc : severity === 'mild' ? currentText.mildDesc : severity === 'moderate' ? currentText.moderateDesc : currentText.severeDesc}
                </p>
              </div>

              <ClinicalExportButton
                title={currentText.title}
                inputs={questions.map((q, i) => ({
                  label: `Q${i + 1}`,
                  value: `${answers[i]} pts`
                }))}
                results={[
                  { label: "Total GAD-7 Score", value: `${totalScore} / 21` },
                  { label: "Severity Classification", value: severity.toUpperCase() },
                  { label: "Clinical Cutoff (≥10)", value: totalScore >= 10 ? "Probable GAD (Cutoff Met)" : "Below Diagnostic Cutoff" }
                ]}
                formula={currentText.formula}
                disclaimer="GAD-7 is a validated screening questionnaire; clinical correlation is required for diagnostic confirmation."
                references="Spitzer RL, et al. Arch Intern Med. 2006;166(10):1092-1097."
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <MedicalReviewerCard reviewer={REVIEWER_PSYCHIATRY} />
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-900 block mb-1">Foundational Evidence:</span>
          <p className="italic mb-2">{currentText.references}</p>
          <div className="flex flex-wrap gap-4 text-purple-700">
            <a href="https://pubmed.ncbi.nlm.nih.gov/16717171/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
              Spitzer RL et al. (2006) Archives of Internal Medicine <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
