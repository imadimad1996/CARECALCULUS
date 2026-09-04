import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert, Heart } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PEDIATRICS } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Pediatric Blood Pressure Percentiles (AAP 2017)",
    subtitle: "Staging and percentile classification of pediatric blood pressure by age, sex, and height per AAP guidelines",
    unitToggle: "Units",
    metricUnits: "Metric (cm)",
    usUnits: "US (inches)",
    ageLabel: "Child Age (1 – 18 years)",
    sexLabel: "Biological Sex",
    male: "Male",
    female: "Female",
    htLabel: "Height",
    sbpLabel: "Systolic Blood Pressure (mmHg)",
    dbpLabel: "Diastolic Blood Pressure (mmHg)",
    resultTitle: "AAP Pediatric BP Staging & Percentile Category",
    stageLabel: "Blood Pressure Category",
    percentileEst: "Estimated BP Range",
    normalTier: "Normal Blood Pressure (< 90th Percentile)",
    normalDesc: "Both systolic and diastolic blood pressures are below the 90th percentile for age, sex, and height (and < 120/<80). Re-evaluate at routine annual well-child visits.",
    elevatedTier: "Elevated Blood Pressure (90th – < 95th Percentile or 120/<80)",
    elevatedDesc: "Blood pressure is between the 90th and 95th percentiles (or 120–129/<80 for adolescents ≥13). Recommend lifestyle counseling (DASH diet, physical activity, sleep hygiene). Re-check BP in 6 months.",
    stage1Tier: "Stage 1 Hypertension (95th – < 95th + 12 mmHg or 130–139/80–89)",
    stage1Desc: "Meets Stage 1 Hypertension criteria. If asymptomatic, repeat BP measurements across 3 separate clinical visits. Recommend lifestyle modifications. If persistent after 3 visits or symptomatic, initiate workup for secondary hypertension and discuss pharmacotherapy.",
    stage2Tier: "Stage 2 Hypertension (≥ 95th + 12 mmHg or ≥ 140/90 mmHg)",
    stage2Desc: "Meets Stage 2 Hypertension criteria. If symptomatic or SBP/DBP > 30 mmHg above the 95th percentile, refer for prompt emergency or pediatric nephrology/cardiology evaluation within 1 week. Evaluate for hypertensive end-organ damage (echocardiography, retinal exam, renal ultrasound).",
    references: "Flynn JT, Kaelber DC, Baker-Smith CM, et al. Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children and Adolescents. Pediatrics. 2017;140(3):e20171904. (PMID: 28827377).",
    faqs: [
      {
        question: "Why are BP percentiles dependent on height?",
        answer: "Taller children have greater body mass and vascular tree length, naturally requiring higher perfusion pressures. Indexing against height percentiles prevents misclassifying tall, healthy children as hypertensive and avoids missing hypertension in shorter children."
      },
      {
        question: "How does the AAP 2017 guideline differ for children ≥ 13 years old?",
        answer: "For adolescents aged 13 and older, the AAP 2017 guideline eliminated complex percentile lookups and aligned directly with the adult ACC/AHA thresholds: Normal (<120/<80), Elevated (120-129/<80), Stage 1 HTN (130-139/80-89), and Stage 2 HTN (≥140/≥90)."
      }
    ]
  },
  fr: {
    title: "Tension Artérielle Pédiatrique (Normes AAP 2017)",
    subtitle: "Classification et percentiles de pression artérielle de l'enfant et de l'adolescent selon l'âge, le sexe et la taille",
    unitToggle: "Unités",
    metricUnits: "Métrique (cm)",
    usUnits: "US (pouces)",
    ageLabel: "Âge de l'Enfant (1 – 18 ans)",
    sexLabel: "Sexe Biologique",
    male: "Garçon",
    female: "Fille",
    htLabel: "Taille",
    sbpLabel: "Pression Artérielle Systolique (mmHg)",
    dbpLabel: "Pression Artérielle Diastolique (mmHg)",
    resultTitle: "Stade & Percentiles Tensionnels Pédiatriques",
    stageLabel: "Catégorie Tensionnelle",
    percentileEst: "Plage Tensionnelle Estimée",
    normalTier: "Pression Artérielle Normale (< 90e percentile)",
    normalDesc: "PAS et PAD inférieures au 90e percentile pour l'âge, le sexe et la taille (et < 120/80). Contrôle lors de la visite médicale annuelle systématique.",
    elevatedTier: "Pression Artérielle Élevée (90e – < 95e percentile ou 120/<80)",
    elevatedDesc: "Pression comprise entre le 90e et le 95e percentile (ou 120–129/<80 dès 13 ans). Conseils hygiéno-diététiques (réduction du sel, sport régulier). Contrôle tensionnel dans 6 mois.",
    stage1Tier: "Hypertension Artérielle Stade 1 (95e – < 95e + 12 mmHg ou 130–139/80–89)",
    stage1Desc: "Critères d'HTA stade 1 atteints. Recontrôler sur 3 consultations distinctes. En cas de confirmation, bilan étiologique (échographie rénale, ionogramme) et prise en charge pédiatrique spécialisée.",
    stage2Tier: "Hypertension Artérielle Stade 2 (≥ 95e + 12 mmHg ou ≥ 140/90 mmHg)",
    stage2Desc: "Critères d'HTA stade 2. Consultation urgente en néphrologie ou cardiologie pédiatrique dans la semaine. Recherche d'un retentissement viscéral (échocardiographie, fond d'œil).",
    references: "Flynn JT, et al. Clinical Practice Guideline for Screening and Management of High Blood Pressure in Children and Adolescents. Pediatrics. 2017;140(3):e20171904.",
    faqs: [
      {
        question: "Pourquoi les percentiles de tension dépendent-ils de la taille ?",
        answer: "La taille reflète le développement somatique et vasculaire. Indexer sur la taille évite de surdiagnostiquer une HTA chez les grands enfants ou d'en méconnaître une chez les enfants de petite taille."
      },
      {
        question: "Quelle règle s'applique à partir de 13 ans ?",
        answer: "Dès 13 ans, les seuils sont alignés sur ceux de l'adulte (normale < 120/80, HTA stade 1 : 130-139/80-89, HTA stade 2 : ≥ 140/90)."
      }
    ]
  }
};

export default function PediatricBloodPressure({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isUs, setIsUs] = useState<boolean>(false);
  const [age, setAge] = useState<string>('8');
  const [isMale, setIsMale] = useState<boolean>(true);
  const [heightVal, setHeightVal] = useState<string>('128'); // cm or in
  const [sbp, setSbp] = useState<string>('105');
  const [dbp, setDbp] = useState<string>('68');

  const { stagingResult, p90Sbp, p95Sbp, p90Dbp, p95Dbp } = useMemo(() => {
    const ageNum = Math.max(1, Math.min(18, parseFloat(age) || 8));
    const sbpNum = parseFloat(sbp) || 100;
    const dbpNum = parseFloat(dbp) || 60;
    let htCm = parseFloat(heightVal) || 120;

    if (isUs) {
      htCm = htCm * 2.54;
    }

    let p90S = 110;
    let p95S = 115;
    let p90D = 70;
    let p95D = 75;

    let stage = 'normal';
    let title = t.normalTier;
    let desc = t.normalDesc;
    let color = 'emerald';

    if (ageNum >= 13) {
      // Adult ACC/AHA cutoffs per AAP 2017
      p90S = 120;
      p95S = 130;
      p90D = 80;
      p95D = 80;

      if (sbpNum >= 140 || dbpNum >= 90) {
        stage = 'stage2';
        title = t.stage2Tier;
        desc = t.stage2Desc;
        color = 'rose';
      } else if (sbpNum >= 130 || dbpNum >= 80) {
        stage = 'stage1';
        title = t.stage1Tier;
        desc = t.stage1Desc;
        color = 'rose';
      } else if (sbpNum >= 120 && dbpNum < 80) {
        stage = 'elevated';
        title = t.elevatedTier;
        desc = t.elevatedDesc;
        color = 'amber';
      } else {
        stage = 'normal';
        title = t.normalTier;
        desc = t.normalDesc;
        color = 'emerald';
      }
    } else {
      // Formula-based approximation of AAP 2017 median-to-height reference tables for ages 1-12
      // SBP 90th percentile ≈ 100 + (age * 1.5) + (htCm - 100) * 0.1
      const sexAdj = isMale ? 0 : -1;
      p90S = Math.round(98 + (ageNum * 1.4) + ((htCm - 90) * 0.1) + sexAdj);
      p95S = p90S + 4;
      p90D = Math.round(58 + (ageNum * 0.8) + ((htCm - 90) * 0.05) + sexAdj);
      p95D = p90D + 4;

      // Cap at 120/80 for elevated, 130/80 for stage 1
      p90S = Math.min(120, p90S);
      p95S = Math.min(130, p95S);

      const stage2SbpCutoff = p95S + 12;
      const stage2DbpCutoff = p95D + 12;

      if (sbpNum >= stage2SbpCutoff || dbpNum >= stage2DbpCutoff || sbpNum >= 140 || dbpNum >= 90) {
        stage = 'stage2';
        title = t.stage2Tier;
        desc = t.stage2Desc;
        color = 'rose';
      } else if (sbpNum >= p95S || dbpNum >= p95D || sbpNum >= 130 || dbpNum >= 80) {
        stage = 'stage1';
        title = t.stage1Tier;
        desc = t.stage1Desc;
        color = 'rose';
      } else if (sbpNum >= p90S || dbpNum >= p90D || (sbpNum >= 120 && dbpNum < 80)) {
        stage = 'elevated';
        title = t.elevatedTier;
        desc = t.elevatedDesc;
        color = 'amber';
      } else {
        stage = 'normal';
        title = t.normalTier;
        desc = t.normalDesc;
        color = 'emerald';
      }
    }

    return {
      stagingResult: { stage, title, desc, color },
      p90Sbp: p90S,
      p95Sbp: p95S,
      p90Dbp: p90D,
      p95Dbp: p95D,
    };
  }, [age, isMale, heightVal, sbp, dbp, isUs, t]);

  useEffect(() => {
    trackCalculatorUsage('pediatric-bp-percentiles', lang, stagingResult ? 1 : 0);
  }, [age, sbp, dbp, stagingResult.stage, lang]);

  const exportInputs = {
    [t.ageLabel]: `${age} years`,
    [t.sexLabel]: isMale ? t.male : t.female,
    [t.htLabel]: !isUs ? `${heightVal} cm` : `${heightVal} in`,
    [t.sbpLabel]: `${sbp} mmHg`,
    [t.dbpLabel]: `${dbp} mmHg`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.stageLabel]: stagingResult.title.split('(')[0].trim(),
    [t.percentileEst]: `90th percentile: ${p90Sbp}/${p90Dbp} mmHg | 95th percentile: ${p95Sbp}/${p95Dbp} mmHg`,
    [t.resultTitle]: stagingResult.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/pediatric-bp-percentiles"
        howToSteps={[
          "Step 1: Enter child's age (1–18 years), sex, and measured height.",
          "Step 2: Enter seated resting systolic and diastolic blood pressure.",
          "Step 3: Determine blood pressure category according to AAP 2017 percentiles (<90th normal, 90–95th elevated, ≥95th Stage 1 HTN, ≥95th+12 mmHg Stage 2 HTN)."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsUs(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                !isUs ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.metricUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsUs(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isUs ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
          </div>
        </div>

        {/* Demographics & Measurements */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.ageLabel}</label>
            <input
              type="number"
              min="1"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.sexLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsMale(true)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all min-h-[42px] ${
                  isMale ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.male}
              </button>
              <button
                type="button"
                onClick={() => setIsMale(false)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all min-h-[42px] ${
                  !isMale ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.female}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.htLabel} ({!isUs ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              step="0.5"
              min="40"
              max="220"
              value={heightVal}
              onChange={(e) => setHeightVal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.sbpLabel}</label>
            <input
              type="number"
              min="40"
              max="240"
              value={sbp}
              onChange={(e) => setSbp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.dbpLabel}</label>
            <input
              type="number"
              min="20"
              max="140"
              value={dbp}
              onChange={(e) => setDbp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          stagingResult.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : stagingResult.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{sbp} / {dbp}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">mmHg</span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                stagingResult.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : stagingResult.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {stagingResult.color === 'emerald' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {stagingResult.stage.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-white/80 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-750 flex flex-wrap items-center justify-between gap-2 text-sm font-medium">
            <span className="text-slate-600 dark:text-slate-300">Normative Reference Thresholds:</span>
            <div className="flex gap-4 font-mono font-bold text-slate-800 dark:text-slate-200">
              <span>90th percentile: {p90Sbp}/{p90Dbp} mmHg</span>
              <span>95th percentile: {p95Sbp}/{p95Dbp} mmHg</span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {stagingResult.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {stagingResult.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Pediatric Blood Pressure Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="AAP (2017) Pediatric BP Staging by Age, Sex, and Height Percentile"
              disclaimer="Clinical decision tool for children 1-18 years old. Confirm hypertension over 3 separate visits with appropriate cuff size."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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

      <MedicalReviewerCard reviewer={REVIEWER_PEDIATRICS} lang={lang} />
    </div>
  );
}
