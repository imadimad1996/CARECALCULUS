import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_HEPATOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "MELD 3.0 Score (OPTN Liver Allocation)",
    subtitle: "Updated Model for End-Stage Liver Disease incorporating female sex and albumin to eliminate gender allocation disparity",
    sexLabel: "Biological Sex",
    male: "Male",
    female: "Female (+1.33 pts)",
    dialysisLabel: "Dialysis ≥ 2 times in past 7 days, or CVVH ≥ 24 hours?",
    yes: "Yes",
    no: "No",
    biliLabel: "Total Bilirubin (mg/dL)",
    inrLabel: "International Normalized Ratio (INR)",
    crLabel: "Serum Creatinine (mg/dL)",
    naLabel: "Serum Sodium (mEq/L)",
    albLabel: "Serum Albumin (g/dL)",
    resultTitle: "MELD 3.0 Score & 90-Day Waitlist Mortality",
    scoreLabel: "Calculated MELD 3.0 Score",
    points: "points",
    lowMortality: "MELD 3.0 ≤ 15: Low 90-Day Mortality (~2% – 5%)",
    lowMortalityDesc: "Standard medical optimization and outpatient hepatology follow-up. Generally below the conventional threshold where deceased-donor liver transplantation provides a clear survival benefit.",
    modMortality: "MELD 3.0 16 – 24: Intermediate 90-Day Mortality (~15% – 25%)",
    modMortalityDesc: "Transplant evaluation strongly recommended. Deceased donor liver transplantation offers a net survival advantage. Frequent biochemical surveillance warranted.",
    highMortality: "MELD 3.0 25 – 34: High 90-Day Mortality (~35% – 60%)",
    highMortalityDesc: "Urgent prioritization on the active deceased-donor liver transplant waitlist. High risk of decompensation, spontaneous bacterial peritonitis, and acute-on-chronic liver failure (ACLF).",
    critMortality: "MELD 3.0 ≥ 35: Extreme 90-Day Mortality (> 70% – 80%)",
    critMortalityDesc: "Critically ill decompensated cirrhosis. Highest deceased-donor organ allocation tier. Often requires intensive care monitoring and urgent living-donor or regional deceased-donor offer.",
    references: "Kim WR, Mannalithara A, Heimbach JK, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. Gastroenterology. 2021;161(6):1887-1895. (PMID: 34509481). OPTN/UNOS Liver Disease Severity Policy Updates (Implemented 2023).",
    faqs: [
      {
        question: "Why was MELD 3.0 introduced to replace MELD-Na?",
        answer: "Under MELD and MELD-Na, women were 8.6% less likely to receive a liver transplant and had higher waitlist mortality because female candidates have lower baseline serum creatinine for any given glomerular filtration rate. MELD 3.0 incorporates female sex (+1.33 points) and serum albumin, alongside interaction terms with sodium and bilirubin, establishing equitable organ distribution."
      },
      {
        question: "What are the variable boundary caps in MELD 3.0?",
        answer: "Bilirubin is bounded between 1.0 and 50.0 mg/dL; INR between 1.0 and 3.0; Creatinine between 1.0 and 4.0 mg/dL (or set to 4.0 if dialyzed ≥2 times or on CVVH in the last 7 days); Sodium between 125 and 137 mEq/L; and Albumin between 1.5 and 3.5 g/dL. The final MELD 3.0 score is rounded to an integer between 6 and 40."
      }
    ]
  },
  fr: {
    title: "Score MELD 3.0 (Attribution de Greffe Hépatique)",
    subtitle: "Version modernisée du score MELD intégrant le sexe féminin et l'albumine pour corriger les disparités d'allocation",
    sexLabel: "Sexe Biologique",
    male: "Homme",
    female: "Femme (+1,33 pts)",
    dialysisLabel: "Dialyse ≥ 2 séances dans les 7 jours ou hémofiltration continue ≥ 24h ?",
    yes: "Oui",
    no: "Non",
    biliLabel: "Bilirubine Totale (mg/dL)",
    inrLabel: "INR (Rapport International Normalisé)",
    crLabel: "Créatinine Sérique (mg/dL)",
    naLabel: "Natrémie (mEq/L)",
    albLabel: "Albuminémie (g/dL)",
    resultTitle: "Score MELD 3.0 & Mortalité à 90 Jours",
    scoreLabel: "Score MELD 3.0 Calculé",
    points: "points",
    lowMortality: "MELD 3.0 ≤ 15 : Mortalité à 90 Jours Faible (~2% – 5%)",
    lowMortalityDesc: "Optimisation médicale et suivi hépatologique régulier. Seuil inférieur au bénéfice de survie démontré d'une greffe hépatique avec donneur décédé.",
    modMortality: "MELD 3.0 16 – 24 : Mortalité Intermédiaire (~15% – 25%)",
    modMortalityDesc: "Bilan pré-greffe hépatique indiqué. La transplantation apporte un bénéfice de survie net. Surveillance biologique rapprochée.",
    highMortality: "MELD 3.0 25 – 34 : Mortalité Élevée (~35% – 60%)",
    highMortalityDesc: "Priorisation active sur liste d'attente de greffe de foie. Risque majeur de décompensation aiguë sur cirrhose (ACLF) et d'infection du liquide d'ascite.",
    critMortality: "MELD 3.0 ≥ 35 : Mortalité Critique (> 70% – 80%)",
    critMortalityDesc: "Défaillance hépatique terminale en réanimation. Priorité maximale d'attribution des greffons hépatiques selon les règles OPTN/ABM.",
    references: "Kim WR, et al. MELD 3.0: The Model for End-Stage Liver Disease Updated for the Modern Era. Gastroenterology. 2021;161(6):1887-1895. Politiques OPTN/UNOS 2023.",
    faqs: [
      {
        question: "Pourquoi le score MELD 3.0 a-t-il été créé ?",
        answer: "Le score MELD classique pénalisait les femmes (créatininémie plus basse pour une même baisse de DFG). MELD 3.0 rétablit l'équité en attribuant +1,33 point aux femmes et en intégrant l'albumine sérique."
      },
      {
        question: "Quels sont les bornes des variables ?",
        answer: "Bilirubine (1 à 50 mg/dL), INR (1 à 3), Créatinine (1 à 4 mg/dL ou 4 si dialyse), Sodium (125 à 137 mEq/L) et Albumine (1,5 à 3,5 g/dL). Le score final est un entier entre 6 et 40."
      }
    ]
  }
};

export default function Meld3Score({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isFemale, setIsFemale] = useState<boolean>(false);
  const [onDialysis, setOnDialysis] = useState<boolean>(false);
  const [bili, setBili] = useState<string>('2.5');
  const [inr, setInr] = useState<string>('1.6');
  const [cr, setCr] = useState<string>('1.4');
  const [na, setNa] = useState<string>('132');
  const [alb, setAlb] = useState<string>('2.8');

  const meld3Score = useMemo(() => {
    let rawBili = parseFloat(bili) || 1.0;
    let rawInr = parseFloat(inr) || 1.0;
    let rawCr = onDialysis ? 4.0 : (parseFloat(cr) || 1.0);
    let rawNa = parseFloat(na) || 137.0;
    let rawAlb = parseFloat(alb) || 3.5;

    // Apply OPTN bounds
    const boundedBili = Math.max(1.0, Math.min(50.0, rawBili));
    const boundedInr = Math.max(1.0, Math.min(3.0, rawInr));
    const boundedCr = Math.max(1.0, Math.min(4.0, rawCr));
    const boundedNa = Math.max(125.0, Math.min(137.0, rawNa));
    const boundedAlb = Math.max(1.5, Math.min(3.5, rawAlb));

    // MELD 3.0 Formula:
    // 1.33*(female) + 4.56*ln(bili) + 0.82*(137 - na) - 0.24*(137 - na)*ln(bili)
    // + 9.09*ln(inr) + 11.14*ln(cr) + 1.85*(3.5 - alb) - 1.83*(3.5 - alb)*ln(cr) + 6
    const femaleTerm = isFemale ? 1.33 : 0.0;
    const biliTerm = 4.56 * Math.log(boundedBili);
    const naTerm = 0.82 * (137.0 - boundedNa);
    const naBiliInteraction = 0.24 * (137.0 - boundedNa) * Math.log(boundedBili);
    const inrTerm = 9.09 * Math.log(boundedInr);
    const crTerm = 11.14 * Math.log(boundedCr);
    const albTerm = 1.85 * (3.5 - boundedAlb);
    const albCrInteraction = 1.83 * (3.5 - boundedAlb) * Math.log(boundedCr);

    let rawScore = femaleTerm + biliTerm + naTerm - naBiliInteraction + inrTerm + crTerm + albTerm - albCrInteraction + 6.0;

    // Bounded between 6 and 40
    let finalScore = Math.round(rawScore);
    if (finalScore < 6) finalScore = 6;
    if (finalScore > 40) finalScore = 40;

    return finalScore;
  }, [isFemale, onDialysis, bili, inr, cr, na, alb]);

  const mortalityTier = useMemo(() => {
    if (meld3Score >= 35) return { text: t.critMortality, desc: t.critMortalityDesc, color: 'rose' };
    if (meld3Score >= 25) return { text: t.highMortality, desc: t.highMortalityDesc, color: 'rose' };
    if (meld3Score >= 16) return { text: t.modMortality, desc: t.modMortalityDesc, color: 'amber' };
    return { text: t.lowMortality, desc: t.lowMortalityDesc, color: 'emerald' };
  }, [meld3Score, t]);

  useEffect(() => {
    trackCalculatorUsage('meld-3-score', lang, meld3Score);
  }, [meld3Score, isFemale, onDialysis, lang]);

  const exportInputs = {
    [t.sexLabel]: isFemale ? t.female : t.male,
    [t.dialysisLabel]: onDialysis ? t.yes : t.no,
    [t.biliLabel]: `${bili} mg/dL`,
    [t.inrLabel]: `${inr}`,
    [t.crLabel]: onDialysis ? "4.0 mg/dL (Dialysis cap)" : `${cr} mg/dL`,
    [t.naLabel]: `${na} mEq/L`,
    [t.albLabel]: `${alb} g/dL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${meld3Score} ${t.points}`,
    [t.resultTitle]: mortalityTier.text
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/meld-3-score"
        howToSteps={[
          "Step 1: Specify biological sex (female candidates receive +1.33 sex adjustment) and dialysis status.",
          "Step 2: Enter bilirubin, INR, serum creatinine, sodium, and serum albumin.",
          "Step 3: Obtain MELD 3.0 integer score (6–40) used by OPTN for deceased-donor liver allocation."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Patient Status Toggles */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.sexLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsFemale(false)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                  !isFemale ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.male}
              </button>
              <button
                type="button"
                onClick={() => setIsFemale(true)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                  isFemale ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.female}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="block text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.dialysisLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOnDialysis(false)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                  !onDialysis ? 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.no}
              </button>
              <button
                type="button"
                onClick={() => setOnDialysis(true)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[44px] ${
                  onDialysis ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>

        {/* Labs */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.biliLabel}</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="50"
              value={bili}
              onChange={(e) => setBili(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.inrLabel}</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="3"
              value={inr}
              onChange={(e) => setInr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.crLabel}</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="4"
              disabled={onDialysis}
              value={onDialysis ? '4.0' : cr}
              onChange={(e) => setCr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.naLabel}</label>
            <input
              type="number"
              step="1"
              min="125"
              max="137"
              value={na}
              onChange={(e) => setNa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.albLabel}</label>
            <input
              type="number"
              step="0.1"
              min="1.5"
              max="3.5"
              value={alb}
              onChange={(e) => setAlb(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          mortalityTier.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : mortalityTier.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{meld3Score}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">{t.points} (6–40)</span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                mortalityTier.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : mortalityTier.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {mortalityTier.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {mortalityTier.text.split(':')[0]}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {mortalityTier.text}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {mortalityTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="MELD 3.0 Score Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="MELD 3.0: 1.33(F) + 4.56*ln(Bili) + 0.82*(137-Na) - 0.24*(137-Na)*ln(Bili) + 9.09*ln(INR) + 11.14*ln(Cr) + 1.85*(3.5-Alb) - 1.83*(3.5-Alb)*ln(Cr) + 6"
              disclaimer="Official OPTN organ allocation standard. Used for prioritizing deceased donor liver transplantation."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_HEPATOLOGY} lang={lang} />
    </div>
  );
}
