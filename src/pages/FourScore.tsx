import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEUROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "FOUR Coma Score (Full Outline of UnResponsiveness)",
    subtitle: "Acute neurological coma grading system tailored for intubated and critically ill ICU patients",
    eyeTitle: "Eye Response (E)",
    motorTitle: "Motor Response (M)",
    brainstemTitle: "Brainstem Reflexes (B)",
    respirationTitle: "Respiration (R)",
    resultTitle: "FOUR Coma Score & Neurological State",
    scoreLabel: "Total FOUR Score",
    points: "points",
    normalDesc: "Score 16: Awake, alert, with intact brainstem reflexes and regular respiratory drive.",
    mildDesc: "Score 13 – 15: Mild to moderate impairment of consciousness. Close neurologic monitoring required.",
    modDesc: "Score 9 – 12: Significant stupor or coma. Intubation and neuro-imaging typically indicated.",
    severeDesc: "Score 4 – 8: Deep coma with impaired brainstem reflexes or motor posturing. High in-hospital mortality.",
    critDesc: "Score 0 – 3: Profound coma with absent brainstem reflexes and respiratory drive. Consider formal brain death evaluation if etiology is irreversible.",
    references: "Wijdicks EFM, Bamlet WR, Maramattom BV, Manno EM, McClelland RL. Validation of a new coma scale: The FOUR score. Ann Neurol. 2005;58(4):585-593. (PMID: 16178024). Iyer VN, et al. The FOUR score predicts mortality, endotracheal intubation, and in-hospital complications after traumatic brain injury. Neurocrit Care. 2009;10(1):85-93.",
    faqs: [
      {
        question: "Why is the FOUR score superior to the Glasgow Coma Scale (GCS) in the ICU?",
        answer: "The classic GCS is hindered in intubated patients because the verbal component cannot be tested (often recorded as 1T). The FOUR score replaces verbal testing with brainstem reflexes (pupil, corneal, cough) and assesses respiratory pattern/ventilator triggering, providing much higher granularity in sedated, intubated, or brain-injured patients."
      },
      {
        question: "How does the FOUR score assist in brain death assessment?",
        answer: "A FOUR score of 0 (E0 M0 B0 R0) reflects loss of spontaneous eye opening, flaccid paralysis/myoclonus, absent pupillary, corneal, and cough reflexes, and apnea or complete reliance on the mechanical ventilator, identifying patients who warrant clinical brain death testing."
      }
    ]
  },
  fr: {
    title: "Score FOUR (Coma et Conscience en Réanimation)",
    subtitle: "Évaluation neurologique aiguë adaptée aux patients comateux et intubés en soins intensifs",
    eyeTitle: "Réponse Oculaire (E)",
    motorTitle: "Réponse Motrice (M)",
    brainstemTitle: "Réflexes du Tronc Cérébral (B)",
    respirationTitle: "Respiration (R)",
    resultTitle: "Score FOUR & État Neurologique",
    scoreLabel: "Score FOUR Total",
    points: "points",
    normalDesc: "Score 16 : Patient vigile, conscient, réflexes du tronc intacts et commande respiratoire normale.",
    mildDesc: "Score 13 – 15 : Altération légère à modérée de la conscience. Surveillance neuro rapprochée requise.",
    modDesc: "Score 9 – 12 : Stupeur ou coma franc. Indication habituelle d'intubation et d'imagerie cérébrale urgente.",
    severeDesc: "Score 4 – 8 : Coma profond avec perte de réflexes du tronc ou postures motrices. Mortalité intra-hospitalière élevée.",
    critDesc: "Score 0 – 3 : Coma aréactif avec abolition des réflexes du tronc et de la commande ventilatoire. Évoquer le protocole d'état de mort encéphalique si la lésion est irréversible.",
    references: "Wijdicks EFM, et al. Validation of a new coma scale: The FOUR score. Ann Neurol. 2005;58(4):585-593. Recommandations Neurocritical Care Society.",
    faqs: [
      {
        question: "Pourquoi le score FOUR est-il supérieur au GCS chez le patient intubé ?",
        answer: "Le score de Glasgow (GCS) est inadapté chez le patient intubé car la réponse verbale est impossible à tester (notée 1T). Le score FOUR remplace la composante verbale par l'étude des réflexes du tronc cérébral et l'adaptation au respirateur."
      },
      {
        question: "Quel est l'intérêt du score FOUR dans le diagnostic de mort encéphalique ?",
        answer: "Un score de 0 (E0 M0 B0 R0) signifie une absence totale d'ouverture des yeux, une aréactivité motrice, une abolition des réflexes pupillaire, cornéen et de toux, ainsi qu'une absence de déclenchement ventilatoire."
      }
    ]
  }
};

export default function FourScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [eye, setEye] = useState<number>(4);
  const [motor, setMotor] = useState<number>(4);
  const [brainstem, setBrainstem] = useState<number>(4);
  const [respiration, setRespiration] = useState<number>(4);

  const totalScore = useMemo(() => eye + motor + brainstem + respiration, [eye, motor, brainstem, respiration]);

  const interpretation = useMemo(() => {
    if (totalScore === 16) return { text: "Normal Consciousness", desc: t.normalDesc, color: "emerald" };
    if (totalScore >= 13) return { text: "Mild Impairment", desc: t.mildDesc, color: "emerald" };
    if (totalScore >= 9) return { text: "Moderate Coma / Stupor", desc: t.modDesc, color: "amber" };
    if (totalScore >= 4) return { text: "Deep Coma", desc: t.severeDesc, color: "rose" };
    return { text: "Profound Coma / Suspect Brain Death", desc: t.critDesc, color: "rose" };
  }, [totalScore, t]);

  useEffect(() => {
    trackCalculatorUsage('four-score', lang, totalScore);
  }, [totalScore, eye, motor, brainstem, respiration, lang]);

  const eyeOptions = [
    { val: 4, label: lang === 'fr' ? "4 : Yeux ouverts, poursuite ou clignement sur ordre" : "4: Eyelids open, tracking, or blinking to command" },
    { val: 3, label: lang === 'fr' ? "3 : Yeux ouverts mais sans poursuite oculaire" : "3: Eyelids open but not tracking" },
    { val: 2, label: lang === 'fr' ? "2 : Yeux fermés, ouverture à la voix forte" : "2: Eyelids closed, open to loud voice" },
    { val: 1, label: lang === 'fr' ? "1 : Yeux fermés, ouverture à la stimulation douloureuse" : "1: Eyelids closed, open to pain" },
    { val: 0, label: lang === 'fr' ? "0 : Yeux restant fermés à la douleur" : "0: Eyelids remain closed with pain" },
  ];

  const motorOptions = [
    { val: 4, label: lang === 'fr' ? "4 : Pouce levé, poing serré ou signe V sur ordre" : "4: Thumbs-up, fist, or peace sign to command" },
    { val: 3, label: lang === 'fr' ? "3 : Localisation de la douleur" : "3: Localizing to pain" },
    { val: 2, label: lang === 'fr' ? "2 : Réponse en flexion à la douleur (décortication)" : "2: Flexion response to pain (decorticate)" },
    { val: 1, label: lang === 'fr' ? "1 : Réponse en extension à la douleur (décérébration)" : "1: Extensor posturing to pain (decerebrate)" },
    { val: 0, label: lang === 'fr' ? "0 : Aucune réponse motrice ou état de mal myoclonique" : "0: No response to pain or generalized myoclonus status" },
  ];

  const brainstemOptions = [
    { val: 4, label: lang === 'fr' ? "4 : Réflexes pupillaires et cornéens présents" : "4: Pupil and corneal reflexes present" },
    { val: 3, label: lang === 'fr' ? "3 : Une pupille en mydriase fixe" : "3: One pupil wide and fixed" },
    { val: 2, label: lang === 'fr' ? "2 : Réflexes pupillaires OU cornéens absents" : "2: Pupil or corneal reflexes absent" },
    { val: 1, label: lang === 'fr' ? "1 : Réflexes pupillaires ET cornéens absents" : "1: Pupil and corneal reflexes absent" },
    { val: 0, label: lang === 'fr' ? "0 : Réflexes pupillaires, cornéens ET de toux absents" : "0: Absent pupil, corneal, and cough reflexes" },
  ];

  const respOptions = [
    { val: 4, label: lang === 'fr' ? "4 : Non intubé, rythme respiratoire régulier" : "4: Not intubated, regular breathing pattern" },
    { val: 3, label: lang === 'fr' ? "3 : Non intubé, respiration de Cheyne-Stokes" : "3: Not intubated, Cheyne-Stokes breathing" },
    { val: 2, label: lang === 'fr' ? "2 : Non intubé, respiration irrégulière" : "2: Not intubated, irregular breathing pattern" },
    { val: 1, label: lang === 'fr' ? "1 : Intubé, respire au-dessus de la fréquence respirateur" : "1: Intubated, breathes above ventilator rate" },
    { val: 0, label: lang === 'fr' ? "0 : Intubé, respire à la fréquence respirateur ou apnée" : "0: Intubated, breathes at ventilator rate or apnea" },
  ];

  const exportInputs = {
    [t.eyeTitle]: `E${eye}`,
    [t.motorTitle]: `M${motor}`,
    [t.brainstemTitle]: `B${brainstem}`,
    [t.respirationTitle]: `R${respiration}`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalScore} / 16 ${t.points} (E${eye}M${motor}B${brainstem}R${respiration})`,
    [t.resultTitle]: `${interpretation.text}: ${interpretation.desc}`
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/four-score"
        howToSteps={[
          "Step 1: Evaluate Eye response (0-4) with tracking or blinking to command.",
          "Step 2: Test Motor response (0-4) with thumbs-up or localizing to noxious stimuli.",
          "Step 3: Assess Brainstem reflexes (pupillary, corneal, cough) and Respiratory pattern or ventilator interaction."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 rounded-xl text-purple-600 dark:text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {[
            { title: t.eyeTitle, val: eye, setVal: setEye, options: eyeOptions, code: 'E' },
            { title: t.motorTitle, val: motor, setVal: setMotor, options: motorOptions, code: 'M' },
            { title: t.brainstemTitle, val: brainstem, setVal: setBrainstem, options: brainstemOptions, code: 'B' },
            { title: t.respirationTitle, val: respiration, setVal: setRespiration, options: respOptions, code: 'R' },
          ].map((cat) => (
            <div key={cat.code} className="p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{cat.title}</h3>
                <span className="px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-bold text-sm">
                  {cat.code}{cat.val}
                </span>
              </div>
              <div className="space-y-2">
                {cat.options.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => cat.setVal(opt.val)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all min-h-[44px] ${
                      cat.val === opt.val
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/50 font-semibold text-purple-950 dark:text-purple-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          interpretation.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : interpretation.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{totalScore}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">/ 16 {t.points}</span>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold ml-2">
                  E{eye} M{motor} B{brainstem} R{respiration}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                interpretation.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : interpretation.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {interpretation.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {interpretation.text.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
            {interpretation.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="FOUR Coma Score"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="FOUR Score = Eye (0-4) + Motor (0-4) + Brainstem (0-4) + Respiration (0-4)"
              disclaimer="Clinical coma scale. Validated in critical care and mechanically ventilated patients."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_NEUROLOGY} lang={lang} />
    </div>
  );
}
