import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEUROLOGY } from '../data/reviewers';

interface GradeInfo {
  grade: string;
  name: string;
  desc: string;
  mortality: string;
  favorable: string;
  management: string;
}

const translations: Translations = {
  en: {
    title: "Hunt & Hess Scale for Subarachnoid Hemorrhage",
    subtitle: "Grades clinical severity and predicts surgical/in-hospital mortality in aneurysmal SAH",
    selectLabel: "Select Clinical Grade",
    resultTitle: "SAH Grade & Clinical Prognosis",
    gradeLabel: "Hunt & Hess Classification",
    mortalityLabel: "Estimated Mortality",
    favorableLabel: "Favorable Neurological Outcome",
    mgmtTitle: "Clinical Management Recommendations",
    references: "Hunt WE, Hess RM. Surgical risk as related to time of intervention in the repair of intracranial aneurysms. J Neurosurg. 1968;28(1):14-20. (PMID: 5635959). Connolly ES Jr, et al. Guidelines for the Management of Aneurysmal Subarachnoid Hemorrhage. Stroke. 2012;43(6):1711-1737.",
    faqs: [
      {
        question: "When should the Hunt & Hess scale be determined?",
        answer: "Hunt and Hess should be assessed upon emergency presentation after diagnostic confirmation of non-traumatic SAH (via non-contrast CT head or lumbar puncture). It correlates directly with the risk of vasospasm, early rebleeding, and perioperative surgical/endovascular outcomes."
      },
      {
        question: "How does Hunt & Hess differ from the WFNS scale?",
        answer: "The World Federation of Neurosurgical Societies (WFNS) scale relies strictly on Glasgow Coma Scale (GCS) and motor deficit. The Hunt & Hess scale includes subjective headache severity and meningismus, making it highly valuable for initial bedside triage in awake or mildly symptomatic patients."
      }
    ]
  },
  fr: {
    title: "Échelle de Hunt et Hess (Hémorragie Sous-Arachnoïdienne)",
    subtitle: "Évalue la gravité clinique et prédit la mortalité dans l'hémorragie sous-arachnoïdienne anévrysmale",
    selectLabel: "Sélectionner le Grade Clinique",
    resultTitle: "Grade HSA & Pronostic Clinique",
    gradeLabel: "Classification de Hunt & Hess",
    mortalityLabel: "Mortalité Estimée",
    favorableLabel: "Pronostic Neurologique Favorable",
    mgmtTitle: "Recommandations Thérapeutiques",
    references: "Hunt WE, Hess RM. Surgical risk as related to time of intervention in the repair of intracranial aneurysms. J Neurosurg. 1968;28(1):14-20. Recommandations AHA/ASA Stroke 2012 / 2023.",
    faqs: [
      {
        question: "Quand évaluer l'échelle de Hunt et Hess ?",
        answer: "Dès l'admission aux urgences dès que le diagnostic d'HSA anévrysmale est confirmé (scanner sans injection ou ponction lombaire). Elle guide le délai d'exclusion anévrysmale (coiling/clipping) et le niveau de réanimation neuro-vasculaire."
      },
      {
        question: "Quelle différence avec l'échelle WFNS ?",
        answer: "L'échelle WFNS repose strictement sur le score de Glasgow (GCS) et l'existence d'un déficit moteur. L'échelle de Hunt & Hess prend en compte la sévérité des céphalées et la raideur méningée, particulièrement utile chez les patients vigiles."
      }
    ]
  }
};

export default function HuntHessScale({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;
  const [selectedGrade, setSelectedGrade] = useState<number>(1);

  const gradeDetails: Record<number, GradeInfo> = useMemo(() => ({
    1: {
      grade: "Grade 1",
      name: lang === 'fr' ? "Asymptomatique ou céphalée minime" : "Asymptomatic or Mild Headache",
      desc: lang === 'fr' ? "Patient asymptomatique ou céphalée légère avec raideur méningée discrète." : "Asymptomatic, or mild headache and slight nuchal rigidity.",
      mortality: "~1% – 5%",
      favorable: "~80% – 90%",
      management: lang === 'fr' ? "Surveillance en soins intensifs neurovasculaires, nimodipine orale immédiate, angiographie cérébrale en urgence pour occlusion précoce (<24h)." : "Neuro-ICU admission, immediate oral nimodipine 60 mg q4h, emergent CT angiogram / catheter angiography with securement within 24 hours."
    },
    2: {
      grade: "Grade 2",
      name: lang === 'fr' ? "Céphalée modérée à sévère, raideur nucale" : "Moderate to Severe Headache, Nuchal Rigidity",
      desc: lang === 'fr' ? "Céphalée violente, raideur de nuque marquée, aucun déficit neurologique sauf atteinte de nerf crânien (ex. paralysie du III)." : "Moderate to severe headache, nuchal rigidity, no neurologic deficit other than cranial nerve palsy.",
      mortality: "~5% – 10%",
      favorable: "~75% – 85%",
      management: lang === 'fr' ? "Nimodipine, contrôle strict de la pression artérielle systolique (<140-160 mmHg), exclusion précoce de l'anévrisme (coiling ou clipping)." : "Oral nimodipine, strict blood pressure control (SBP < 140–160 mmHg prior to aneurysm securement), early aneurysm repair via endovascular coiling or surgical clipping."
    },
    3: {
      grade: "Grade 3",
      name: lang === 'fr' ? "Somnolence, confusion, déficit focal discret" : "Drowsiness, Confusion, Mild Focal Deficit",
      desc: lang === 'fr' ? "Obnubilation, confusion mentale, léthargie ou déficit focal discret." : "Drowsiness, confusion, or mild focal neurological deficit.",
      mortality: "~15% – 20%",
      favorable: "~60% – 70%",
      management: lang === 'fr' ? "Soins intensifs neurovasculaires, évaluation d'une hydrocéphalie aiguë (dérivation ventriculaire externe si nécessaire), exclusion anévrysmale urgente." : "Neuro-ICU monitoring, evaluate for acute hydrocephalus on repeat imaging (external ventricular drain [EVD] placement if indicated), early aneurysm securement."
    },
    4: {
      grade: "Grade 4",
      name: lang === 'fr' ? "Stupeur, hémiparésie modérée à sévère" : "Stupor, Hemiparesis, Vegetative Signs",
      desc: lang === 'fr' ? "Stupeur, hémiplégie ou hémiparésie sévère, rigidité de décérébration précoce, troubles végétatifs." : "Stupor, moderate to severe hemiparesis, possible early decerebrate rigidity and vegetative disturbances.",
      mortality: "~30% – 40%",
      favorable: "~30% – 45%",
      management: lang === 'fr' ? "Intubation orotrachéale protectrice, dérivation ventriculaire externe d'urgence si hydrocéphalie, exclusion anévrysmale sans délai." : "Endotracheal intubation for airway protection, urgent EVD if ventriculomegaly, ICP monitoring, aggressive hemodynamic management and early aneurysm repair."
    },
    5: {
      grade: "Grade 5",
      name: lang === 'fr' ? "Coma profond, rigidité de décérébration" : "Deep Coma, Decerebrate Posturing, Moribund",
      desc: lang === 'fr' ? "Coma profond, décérébration bilatérale, état moribond." : "Deep coma, decerebrate rigidity, moribund appearance.",
      mortality: "~60% – 80%",
      favorable: "~10% – 20%",
      management: lang === 'fr' ? "Réanimation neuro-chirurgicale maximale, monitorage PIC, dérivation ventriculaire d'urgence si hydrocéphalie réversible." : "Maximal neurocritical resuscitation, emergent EVD if hydrocephalus, ICP control, careful evaluation of pupillary and brainstem reflex recovery prior to intervention."
    }
  }), [lang]);

  const current = gradeDetails[selectedGrade];

  useEffect(() => {
    trackCalculatorUsage('hunt-hess', lang, current.grade);
  }, [selectedGrade, lang]);

  const exportInputs = {
    [t.selectLabel]: `${current.grade}: ${current.name}`
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.gradeLabel]: current.grade,
    [t.mortalityLabel]: current.mortality,
    [t.favorableLabel]: current.favorable,
    [t.mgmtTitle]: current.management
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/hunt-hess"
        howToSteps={[
          "Step 1: Assess mental status, level of consciousness, and presence of severe headache or nuchal rigidity.",
          "Step 2: Evaluate for cranial nerve palsies vs significant focal motor deficits or posturing.",
          "Step 3: Select corresponding Hunt & Hess grade (1 through 5) to determine clinical mortality and management pathway."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5].map((g) => {
            const item = gradeDetails[g];
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`w-full text-left p-4 rounded-xl border transition-all min-h-[52px] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {g}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                    Mortality: {item.mortality}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          selectedGrade <= 2
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : selectedGrade === 3
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{current.grade}</span>
                <span className="text-lg text-slate-700 dark:text-slate-300 font-semibold">— {current.name}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {t.mortalityLabel}: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{current.mortality}</span>
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {t.favorableLabel}: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{current.favorable}</span>
              </span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-750">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">{t.mgmtTitle}</h4>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {current.management}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Hunt & Hess Scale Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Hunt & Hess: Grade 1 (Asymptomatic/mild headache) to Grade 5 (Deep coma, decerebrate posturing)"
              disclaimer="Clinical decision tool for non-traumatic aneurysmal SAH. Correlates with surgical risk and clinical vasospasm."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
