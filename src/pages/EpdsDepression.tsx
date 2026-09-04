import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert, PhoneCall, HeartHandshake } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PSYCHIATRY } from '../data/reviewers';

interface EpdsItem {
  id: number;
  prompt: { en: string; fr: string };
  options: { en: string; fr: string; pts: number }[];
}

const epdsQuestions: EpdsItem[] = [
  {
    id: 1,
    prompt: {
      en: "1. I have been able to laugh and see the funny side of things:",
      fr: "1. J'ai pu rire et prendre les choses du bon côté :"
    },
    options: [
      { en: "As much as I always could (0)", fr: "Autant que d'habitude (0)", pts: 0 },
      { en: "Not quite so much now (1)", fr: "Un peu moins maintenant (1)", pts: 1 },
      { en: "Definitely not so much now (2)", fr: "Nettement moins maintenant (2)", pts: 2 },
      { en: "Not at all (3)", fr: "Pas du tout (3)", pts: 3 },
    ]
  },
  {
    id: 2,
    prompt: {
      en: "2. I have looked forward with enjoyment to things:",
      fr: "2. J'ai envisagé l'avenir avec plaisir :"
    },
    options: [
      { en: "As much as I ever did (0)", fr: "Autant que d'habitude (0)", pts: 0 },
      { en: "Rather less than I used to (1)", fr: "Un peu moins que d'habitude (1)", pts: 1 },
      { en: "Definitely less than I used to (2)", fr: "Nettement moins que d'habitude (2)", pts: 2 },
      { en: "Hardly at all (3)", fr: "Presque pas du tout (3)", pts: 3 },
    ]
  },
  {
    id: 3,
    prompt: {
      en: "3. I have blamed myself unnecessarily when things went wrong:",
      fr: "3. Je me suis reproché sans raison que les choses aillent mal :"
    },
    options: [
      { en: "Yes, most of the time (3)", fr: "Oui, la plupart du temps (3)", pts: 3 },
      { en: "Yes, some of the time (2)", fr: "Oui, parfois (2)", pts: 2 },
      { en: "Not very often (1)", fr: "Très rarement (1)", pts: 1 },
      { en: "No, never (0)", fr: "Non, jamais (0)", pts: 0 },
    ]
  },
  {
    id: 4,
    prompt: {
      en: "4. I have been anxious or worried for no good reason:",
      fr: "4. Je me suis sentie inquiète ou soucieuse sans raison valable :"
    },
    options: [
      { en: "No, not at all (0)", fr: "Non, pas du tout (0)", pts: 0 },
      { en: "Hardly ever (1)", fr: "Presque jamais (1)", pts: 1 },
      { en: "Yes, sometimes (2)", fr: "Oui, parfois (2)", pts: 2 },
      { en: "Yes, very often (3)", fr: "Oui, très souvent (3)", pts: 3 },
    ]
  },
  {
    id: 5,
    prompt: {
      en: "5. I have felt scared or panicky for no very good reason:",
      fr: "5. Je me suis sentie effrayée ou paniquée sans motif sérieux :"
    },
    options: [
      { en: "Yes, quite a lot (3)", fr: "Oui, tout à fait (3)", pts: 3 },
      { en: "Yes, sometimes (2)", fr: "Oui, parfois (2)", pts: 2 },
      { en: "No, not much (1)", fr: "Non, pas souvent (1)", pts: 1 },
      { en: "No, not at all (0)", fr: "Non, pas du tout (0)", pts: 0 },
    ]
  },
  {
    id: 6,
    prompt: {
      en: "6. Things have been getting on top of me:",
      fr: "6. Les événements ont eu tendance à me dépasser :"
    },
    options: [
      { en: "Yes, most of the time I haven't been able to cope (3)", fr: "Oui, la plupart du temps je n'ai pu faire face (3)", pts: 3 },
      { en: "Yes, sometimes I haven't been coping as well as usual (2)", fr: "Oui, parfois je n'ai pu faire face (2)", pts: 2 },
      { en: "No, most of the time I have coped quite well (1)", fr: "Non, la plupart du temps je m'en suis sortie (1)", pts: 1 },
      { en: "No, I have been coping as well as ever (0)", fr: "Non, j'ai fait face aussi bien que d'habitude (0)", pts: 0 },
    ]
  },
  {
    id: 7,
    prompt: {
      en: "7. I have been so unhappy that I have had difficulty sleeping:",
      fr: "7. J'ai été si malheureuse que j'ai eu du mal à dormir :"
    },
    options: [
      { en: "Yes, most of the time (3)", fr: "Oui, la plupart du temps (3)", pts: 3 },
      { en: "Yes, sometimes (2)", fr: "Oui, parfois (2)", pts: 2 },
      { en: "Not very often (1)", fr: "Pas très souvent (1)", pts: 1 },
      { en: "No, not at all (0)", fr: "Non, pas du tout (0)", pts: 0 },
    ]
  },
  {
    id: 8,
    prompt: {
      en: "8. I have felt sad or miserable:",
      fr: "8. Je me suis sentie triste ou malheureuse :"
    },
    options: [
      { en: "Yes, most of the time (3)", fr: "Oui, la plupart du temps (3)", pts: 3 },
      { en: "Yes, quite often (2)", fr: "Oui, assez souvent (2)", pts: 2 },
      { en: "Not very often (1)", fr: "Pas très souvent (1)", pts: 1 },
      { en: "No, not at all (0)", fr: "Non, pas du tout (0)", pts: 0 },
    ]
  },
  {
    id: 9,
    prompt: {
      en: "9. I have been so unhappy that I have been crying:",
      fr: "9. J'ai été si malheureuse que j'en ai pleuré :"
    },
    options: [
      { en: "Yes, most of the time (3)", fr: "Oui, la plupart du temps (3)", pts: 3 },
      { en: "Yes, quite often (2)", fr: "Oui, assez souvent (2)", pts: 2 },
      { en: "Only occasionally (1)", fr: "Seulement de temps en temps (1)", pts: 1 },
      { en: "No, never (0)", fr: "Non, jamais (0)", pts: 0 },
    ]
  },
  {
    id: 10,
    prompt: {
      en: "10. The thought of harming myself has occurred to me:",
      fr: "10. Des pensées de me faire du mal m'ont traversé l'esprit :"
    },
    options: [
      { en: "Yes, quite often (3)", fr: "Oui, très souvent (3)", pts: 3 },
      { en: "Sometimes (2)", fr: "Parfois (2)", pts: 2 },
      { en: "Hardly ever (1)", fr: "Presque jamais (1)", pts: 1 },
      { en: "Never (0)", fr: "Jamais (0)", pts: 0 },
    ]
  },
];

const translations: Translations = {
  en: {
    title: "Edinburgh Postnatal Depression Scale (EPDS)",
    subtitle: "Validated 10-item screening tool for postpartum and perinatal maternal depression with suicide risk detection",
    resultTitle: "EPDS Screening Result & Clinical Guidance",
    scoreLabel: "Total EPDS Score",
    points: "points",
    lowRisk: "Score 0 – 9: Depression Unlikely / Normal Adjustment",
    lowRiskDesc: "Screening score is within the normal range. Routine postpartum obstetric follow-up and continued maternal mental health support recommended.",
    modRisk: "Score 10 – 12: Possible Perinatal Depression",
    modRiskDesc: "Elevated score indicates distress or mild-to-moderate postpartum depressive symptoms. Repeat screening in 2–4 weeks and conduct a supportive clinical mental health interview.",
    highRisk: "Score ≥ 13: Probable Postnatal Depression (Clinical Referral Indicated)",
    highRiskDesc: "High likelihood of major depressive disorder in the perinatal period (sensitivity ~86%, specificity ~78%). Comprehensive psychiatric assessment, maternal therapy, and consideration of pharmacotherapy indicated.",
    selfHarmAlert: "CRITICAL ALERT: Positive Self-Harm Ideation (Question 10 > 0)",
    selfHarmDesc: "Patient reported thoughts of self-harm. IMMEDIATE clinical safety evaluation for suicide risk is mandatory regardless of the total score. Do not leave the patient unattended without a safety plan.",
    crisisResources: "Emergency Mental Health Support: US/Canada: Call or text 988 (Suicide & Crisis Lifeline) | UK: Call 111 / 999 | France: Appelez le 3114 | Europe: 112.",
    references: "Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression. Development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry. 1987;150:782-786. (PMID: 3651732). ACOG Committee Opinion No. 757: Screening for Perinatal Depression. Obstet Gynecol. 2018;132(5):e208-e212.",
    faqs: [
      {
        question: "When should the EPDS screening be performed?",
        answer: "ACOG guidelines recommend screening pregnant individuals for depression at least once during pregnancy (often at the comprehensive prenatal visit) and during the postpartum period (at the 2-week, 6-week, and well-child pediatric visits up to 1 year postpartum)."
      },
      {
        question: "What is the critical rule for Question 10?",
        answer: "Question 10 specifically screens for suicidal ideation. Any non-zero answer (1, 2, or 3) requires immediate clinical assessment for active suicide risk and safety planning, even if the total EPDS score is under 10."
      }
    ]
  },
  fr: {
    title: "Échelle d'Édimbourg (Dépression Post-Partum - EPDS)",
    subtitle: "Outil validé de dépistage en 10 questions de la dépression périnatale avec alerte sur les idées suicidaires",
    resultTitle: "Résultat EPDS & Conduite Clinique",
    scoreLabel: "Score Total EPDS",
    points: "points",
    lowRisk: "Score 0 – 9 : Dépistage Négatif (Adaptation Normale)",
    lowRiskDesc: "Score dans les limites habituelles. Poursuite du suivi post-natal classique et soutien à la parentalité.",
    modRisk: "Score 10 – 12 : Suspicion de Dépression Légère à Modérée",
    modRiskDesc: "Score limite évocateur de détresse psychologique. Réévaluation clinique préconisée à 2–4 semaines et entretien d'écoute.",
    highRisk: "Score ≥ 13 : Probabilité Forte d'Épisode Dépressif Post-Partum",
    highRiskDesc: "Forte probabilité d'un épisode dépressif caractérisé du post-partum. Consultation médicale ou psychiatrique indispensable pour prise en charge psychothérapeutique.",
    selfHarmAlert: "ALERTE SÉCURITÉ : Idées d'Auto-Agressivité Positives (Question 10 > 0)",
    selfHarmDesc: "La patiente a exprimé des pensées d'auto-agressivité ou de suicide. Évaluation psychiatrique urgente obligatoire quel que soit le score total.",
    crisisResources: "Numéro national de prévention du suicide (France) : 3114 (gratuit 24h/24) | Urgences : 15 ou 112 | Canada/USA : 988.",
    references: "Cox JL, et al. Br J Psychiatry. 1987;150:782-786. Recommandations HAS / CNGOF Dépression du Post-Partum.",
    faqs: [
      {
        question: "À quels moments réaliser l'EPDS ?",
        answer: "L'EPDS est recommandé lors du bilan prénatal précoce, au séjour en maternité et lors de la consultation post-natale obligatoire entre 6 et 8 semaines (et jusqu'à 1 an)."
      },
      {
        question: "Quelle est la conduite à tenir si la question 10 est positive ?",
        answer: "Toute réponse différente de 'Jamais' à la question 10 nécessite une évaluation immédiate du risque suicidaire, indépendamment du score global."
      }
    ]
  }
};

export default function EpdsDepression({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0
  });

  const totalScore = useMemo(() => {
    return Object.values(answers).reduce((a, b) => a + b, 0);
  }, [answers]);

  const hasSelfHarm = (answers[10] || 0) > 0;

  const riskTier = useMemo(() => {
    if (totalScore >= 13) return { text: t.highRisk, desc: t.highRiskDesc, color: 'rose' };
    if (totalScore >= 10) return { text: t.modRisk, desc: t.modRiskDesc, color: 'amber' };
    return { text: t.lowRisk, desc: t.lowRiskDesc, color: 'emerald' };
  }, [totalScore, t]);

  useEffect(() => {
    trackCalculatorUsage('epds-score', lang, totalScore);
  }, [totalScore, lang]);

  const setAnswerForQ = (qId: number, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const exportInputs = Object.entries(answers).map(([k, v]) => ({
    label: `Q${k}`,
    value: `${v} pts`
  }));

  const exportResults = [
    { label: t.scoreLabel, value: totalScore, unit: `/ 30 ${t.points}` },
    { label: t.resultTitle, value: riskTier.text },
    { label: "Self-Harm Screen (Q10)", value: hasSelfHarm ? "POSITIVE (Active Alert)" : "Negative (0)" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/epds-score"
        howToSteps={[
          "Step 1: Mother answers 10 questions reflecting her feelings over the past 7 days.",
          "Step 2: Sum responses (0 to 3 points per question). A score ≥ 10 suggests distress; ≥ 13 indicates probable depression.",
          "Step 3: Critically review Question 10: any non-zero response requires immediate safety and suicide assessment."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Self Harm Banner if Q10 > 0 */}
        {hasSelfHarm && (
          <div className="mt-6 p-5 rounded-2xl bg-rose-600 text-white shadow-lg animate-pulse">
            <div className="flex items-start gap-3">
              <PhoneCall className="w-7 h-7 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-extrabold text-lg">{t.selfHarmAlert}</h3>
                <p className="text-sm mt-1 leading-relaxed opacity-95">{t.selfHarmDesc}</p>
                <p className="text-xs mt-2 font-bold underline bg-rose-700 p-2 rounded-lg">{t.crisisResources}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="mt-8 space-y-6">
          {epdsQuestions.map((q) => {
            const currentVal = answers[q.id] || 0;
            const isQ10 = q.id === 10;
            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  isQ10 && currentVal > 0
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold text-base sm:text-lg ${isQ10 ? 'text-rose-700 dark:text-rose-400 font-bold' : 'text-slate-900 dark:text-white'}`}>
                    {lang === 'fr' ? q.prompt.fr : q.prompt.en}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {currentVal} pts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt.pts}
                      type="button"
                      onClick={() => setAnswerForQ(q.id, opt.pts)}
                      className={`p-3 text-left text-xs sm:text-sm rounded-lg border transition-all min-h-[44px] ${
                        currentVal === opt.pts
                          ? isQ10 && opt.pts > 0
                            ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                            : 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lang === 'fr' ? opt.fr : opt.en}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          riskTier.color === 'emerald' && !hasSelfHarm
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : riskTier.color === 'amber' && !hasSelfHarm
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalScore}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">/ 30 {t.points}</span>
                {hasSelfHarm && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-600 text-white ml-2">
                    CRITICAL: Q10 POSITIVE
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                riskTier.color === 'emerald' && !hasSelfHarm
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : riskTier.color === 'amber' && !hasSelfHarm
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {riskTier.color === 'emerald' && !hasSelfHarm ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {hasSelfHarm ? "SELF-HARM RISK FLAGGED" : totalScore >= 13 ? "PROBABLE DEPRESSION" : totalScore >= 10 ? "POSSIBLE DEPRESSION" : "DEPRESSION UNLIKELY"}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {riskTier.text}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {riskTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Edinburgh Postnatal Depression Scale (EPDS)"
              inputs={exportInputs}
              results={exportResults}
              formula="EPDS: 10 items (0-3 each, total 0-30). Cutoff ≥ 10 possible depression; ≥ 13 probable depression; Q10 flags self-harm."
              disclaimer="Clinical screening instrument. Positive screens require comprehensive clinical psychiatric interview and suicide risk assessment."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          {lang === 'fr' ? "Questions Fréquentes (FAQ)" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {t.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <MedicalReviewerCard reviewer={REVIEWER_PSYCHIATRY} lang={lang} />
    </div>
  );
}
