import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_EMERGENCY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Modified Centor / McIsaac Strep Score",
    subtitle: "Estimates probability of Group A Streptococcal (GAS) pharyngitis to guide rapid testing and antibiotic stewardship",
    ageLabel: "Patient Age Group",
    ageChild: "3 to 14 years (+1 point)",
    ageAdult: "15 to 44 years (0 points)",
    ageOlder: "≥ 45 years (-1 point)",
    tonsilLabel: "Tonsillar Exudate or Swelling",
    tonsilDesc: "White/yellow exudates or marked erythema/enlargement of palatine tonsils (+1 point)",
    nodesLabel: "Tender / Swollen Anterior Cervical Nodes",
    nodesDesc: "Painful lymphadenopathy along anterior cervical chain on palpation (+1 point)",
    feverLabel: "History of Fever (Temperature > 38.0°C / 100.4°F)",
    feverDesc: "Measured fever or documented subjective febrile episodes (+1 point)",
    coughLabel: "Absence of Cough",
    coughDesc: "No rhinorrhea, cough, or viral URI coryzal symptoms (+1 point)",
    yes: "Yes",
    no: "No",
    resultTitle: "McIsaac Score & Antibiotic Guidance",
    scoreLabel: "Total McIsaac Score",
    points: "points",
    probLabel: "Estimated GAS Probability",
    strat01: "Score ≤ 1 — Low Probability of Strep (1% – 10%)",
    strat01Desc: "Group A Strep pharyngitis is highly unlikely. Viral etiology predominates (rhinovirus, adenovirus, EBV, coronavirus). Guidelines (IDSA/AAP) recommend against rapid antigen testing (RADT) or throat cultures. Antibiotics are NOT indicated. Provide symptomatic relief (NSAIDs, lozenges).",
    strat23: "Score 2 – 3 — Intermediate Probability of Strep (15% – 32%)",
    strat23Desc: "Intermediate streptococcal probability. Perform a Rapid Antigen Detection Test (RADT) or rapid molecular PCR. If positive, initiate targeted antibiotic therapy (Amoxicillin or Penicillin V for 10 days). If negative, withhold antibiotics (in children/teens, reflex throat culture is recommended).",
    strat45: "Score ≥ 4 — High Probability of Strep (~52%)",
    strat45Desc: "High likelihood of Group A Streptococcal pharyngitis (~52%). Perform RADT and/or initiate empiric antimicrobial treatment (Amoxicillin 50 mg/kg once daily [max 1000 mg] or Penicillin V). In penicillin-allergic patients, use cephalexin (if non-anaphylactic) or azithromycin/clindamycin.",
    references: "McIsaac WJ, Kellner JD, Aufricht P, Vanjaka A, Low DE. Empirical validation of guidelines for the management of pharyngitis in children and adults. JAMA. 2004;291(13):1587-1595. (PMID: 15069046). Shulman ST, et al. Clinical Practice Guideline for the Diagnosis and Management of Group A Streptococcal Pharyngitis: 2012 Update by the IDSA. Clin Infect Dis. 2012;55(10):e86-e102.",
    faqs: [
      {
        question: "Why does the McIsaac score subtract a point for patients age ≥ 45?",
        answer: "The incidence of Group A Streptococcal pharyngitis and non-suppurative rheumatic fever is overwhelmingly highest in school-aged children (5–15 years) and drops precipitously in mature adults over age 45. Subtracting 1 point reduces overprescribing of antibiotics in older adults who rarely develop GAS pharyngitis."
      },
      {
        question: "Can Centor/McIsaac be used in children under 3 years old?",
        answer: "No. Acute GAS pharyngitis and acute rheumatic fever are exceedingly rare in children under 3 years of age. In infants and toddlers, streptococcal infection typically presents atypically as 'streptococcosis' (rhinorrhea, low-grade fever, excoriated nares) rather than exudative tonsillitis."
      }
    ]
  },
  fr: {
    title: "Score de Centor Modifié (McIsaac - Angine à Streptocoque)",
    subtitle: "Estime la probabilité d'angine à Streptocoque du Groupe A (SGA) pour guider le TDR et l'antibiothérapie",
    ageLabel: "Tranche d'Âge",
    ageChild: "3 à 14 ans (+1 point)",
    ageAdult: "15 à 44 ans (0 point)",
    ageOlder: "≥ 45 ans (-1 point)",
    tonsilLabel: "Exsudat ou Hypertrophie Amygdalienne",
    tonsilDesc: "Présence d'un exsudat pultacé blanc ou hypertrophie nette des amygdales (+1 point)",
    nodesLabel: "Adénopathies Cervicales Antérieures Sensibles",
    nodesDesc: "Ganglions cervicaux antérieurs douloureux à la palpation (+1 point)",
    feverLabel: "Fièvre > 38,0°C",
    feverDesc: "Température corporelle mesurée > 38°C ou fébricule documenté (+1 point)",
    coughLabel: "Absence de Toux",
    coughDesc: "Pas de toux, ni de rhinorrhée évocatrice d'un tableau viral (+1 point)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score de McIsaac & Conduite à Tenir",
    scoreLabel: "Score Total de McIsaac",
    points: "points",
    probLabel: "Probabilité d'Infection à SGA",
    strat01: "Score ≤ 1 — Probabilité Faible de SGA (1% – 10%)",
    strat01Desc: "Origine virale hautement probable. La réalisation d'un Test de Diagnostic Rapide (TDR) n'est pas recommandée selon la HAS/IDSA. Antibiothérapie inutile et contre-indiquée. Traitement purement symptomatique (antalgiques).",
    strat23: "Score 2 – 3 — Probabilité Intermédiaire de SGA (15% – 32%)",
    strat23Desc: "Probabilité modérée. Réalisation obligatoire d'un Test de Diagnostic Rapide (TDR de l'angine). Ne traiter par antibiotique (Amoxicilline 6 jours) QUE si le TDR est positif.",
    strat45: "Score ≥ 4 — Probabilité Élevée de SGA (~52%)",
    strat45Desc: "Probabilité d'infection à streptocoque d'environ 52%. Réaliser le TDR systématique et initier l'antibiothérapie de première intention (Amoxicilline 50 mg/kg/j chez l'enfant, 2g/j chez l'adulte pendant 6 jours) si TDR positif ou selon le protocole de service.",
    references: "McIsaac WJ, et al. JAMA. 2004;291(13):1587-1595. Recommandations HAS / IDSA 2012.",
    faqs: [
      {
        question: "Pourquoi l'âge supérieur à 45 ans retire-t-il 1 point ?",
        answer: "Le portage et l'infection à SGA ainsi que le risque de rhumatisme articulaire aigu (RAA) diminuent drastiquement après 45 ans. Retirer un point évite la surconsommation d'antibiotiques chez l'adulte mûr."
      },
      {
        question: "Le score s'applique-t-il aux enfants de moins de 3 ans ?",
        answer: "Non, les angines streptococciques et le RAA sont exceptionnels chez le nourrisson de moins de 3 ans. Le TDR et les antibiotiques ne sont pas indiqués."
      }
    ]
  }
};

export default function CentorMcisaac({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [agePts, setAgePts] = useState<number>(0); // +1 (3-14), 0 (15-44), -1 (>=45)
  const [tonsils, setTonsils] = useState<boolean>(false);
  const [nodes, setNodes] = useState<boolean>(false);
  const [fever, setFever] = useState<boolean>(false);
  const [noCough, setNoCough] = useState<boolean>(false);

  const totalScore = useMemo(() => {
    let pts = agePts;
    if (tonsils) pts += 1;
    if (nodes) pts += 1;
    if (fever) pts += 1;
    if (noCough) pts += 1;
    return pts;
  }, [agePts, tonsils, nodes, fever, noCough]);

  const interpretation = useMemo(() => {
    if (totalScore >= 4) {
      return { prob: "~51% – 53%", title: t.strat45, desc: t.strat45Desc, color: 'rose' };
    }
    if (totalScore >= 2) {
      return { prob: totalScore === 2 ? "~11% – 17%" : "~28% – 35%", title: t.strat23, desc: t.strat23Desc, color: 'amber' };
    }
    return { prob: totalScore <= 0 ? "~1% – 2.5%" : "~5% – 10%", title: t.strat01, desc: t.strat01Desc, color: 'emerald' };
  }, [totalScore, t]);

  useEffect(() => {
    trackCalculatorUsage('centor-mcisaac', lang, totalScore);
  }, [totalScore, interpretation.prob, lang]);

  const exportInputs = {
    [t.ageLabel]: agePts === 1 ? t.ageChild : agePts === 0 ? t.ageAdult : t.ageOlder,
    [t.tonsilLabel]: tonsils ? t.yes : t.no,
    [t.nodesLabel]: nodes ? t.yes : t.no,
    [t.feverLabel]: fever ? t.yes : t.no,
    [t.coughLabel]: noCough ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${totalScore} ${t.points}`,
    [t.probLabel]: interpretation.prob,
    [t.resultTitle]: interpretation.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/centor-mcisaac"
        howToSteps={[
          "Step 1: Select patient age: 3–14 (+1), 15–44 (0), or ≥45 (-1).",
          "Step 2: Check clinical criteria (+1 each): tonsillar exudates/swelling, tender anterior cervical nodes, fever > 38°C, and absence of cough.",
          "Step 3: Determine need for rapid antigen strep test (RADT). Scores ≤ 1 require no testing/antibiotics; scores 2–3 indicate RADT; scores ≥ 4 indicate RADT or empiric therapy."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Age Selector */}
        <div className="mt-8 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.ageLabel}</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { label: t.ageChild, val: 1 },
              { label: t.ageAdult, val: 0 },
              { label: t.ageOlder, val: -1 },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => setAgePts(item.val)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                  agePts === item.val
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { id: 'tonsil', label: t.tonsilLabel, desc: t.tonsilDesc, val: tonsils, setVal: setTonsils },
            { id: 'nodes', label: t.nodesLabel, desc: t.nodesDesc, val: nodes, setVal: setNodes },
            { id: 'fever', label: t.feverLabel, desc: t.feverDesc, val: fever, setVal: setFever },
            { id: 'cough', label: t.coughLabel, desc: t.coughDesc, val: noCough, setVal: setNoCough },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">
                  {item.label} <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">(+1 point)</span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => item.setVal(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    !item.val
                      ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.no}
                </button>
                <button
                  type="button"
                  onClick={() => item.setVal(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all min-h-[44px] ${
                    item.val
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.yes}
                </button>
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
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">{t.points} (-1 to 5)</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-2">
                  GAS Risk: {interpretation.prob}
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                interpretation.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : interpretation.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {interpretation.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {totalScore <= 1 ? "NO ANTIBIOTICS / NO RADT" : totalScore <= 3 ? "PERFORM RADT FIRST" : "HIGH STREP PROBABILITY"}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {interpretation.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {interpretation.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Modified Centor / McIsaac Score"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="McIsaac: Age 3-14 (+1), 15-44 (0), ≥45 (-1) + Exudates (1) + Tender nodes (1) + Fever (1) + No cough (1)"
              disclaimer="Clinical decision tool for GAS pharyngitis. Guides rapid testing and prevents inappropriate antibiotic use."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_EMERGENCY} lang={lang} />
    </div>
  );
}
