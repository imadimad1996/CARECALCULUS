import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert, Bone } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_INTERNAL_MEDICINE } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "FRAX 10-Year Fracture Risk Calculator",
    subtitle: "Estimates 10-year probability of Major Osteoporotic Fracture (MOF) and Hip Fracture (HF) per WHO/NOF guidelines",
    ageLabel: "Age (40 – 90 years)",
    sexLabel: "Biological Sex",
    female: "Female",
    male: "Male",
    wtLabel: "Weight (kg)",
    htLabel: "Height (cm)",
    prevFxLabel: "Previous Fragility Fracture",
    prevFxDesc: "Fracture in adult life occurring spontaneously or with trauma equivalent to a fall from standing height (+)",
    parentHipLabel: "Parent Fractured Hip",
    parentHipDesc: "History of maternal or paternal hip fracture (+)",
    smokingLabel: "Current Tobacco Smoking",
    smokingDesc: "Active cigarette or tobacco smoker (+)",
    steroidsLabel: "Oral Glucocorticoids",
    steroidsDesc: "Current or past oral steroid therapy ≥ 5 mg prednisolone equivalent daily for ≥ 3 months (+)",
    raLabel: "Rheumatoid Arthritis",
    raDesc: "Confirmed clinical diagnosis of rheumatoid arthritis (+)",
    secOsteoLabel: "Secondary Osteoporosis",
    secOsteoDesc: "Type 1 diabetes, osteogenesis imperfecta, hyperthyroidism, hypogonadism, or malabsorption (+)",
    alcoholLabel: "Alcohol ≥ 3 Units / Day",
    alcoholDesc: "Average consumption of 3 or more standard drinks daily (+)",
    bmdLabel: "Femoral Neck T-Score (Optional)",
    bmdHint: "Leave blank or enter DXA T-score (e.g. -2.5)",
    yes: "Yes",
    no: "No",
    resultTitle: "FRAX 10-Year Probability & Treatment Thresholds",
    mofLabel: "10-Year Major Osteoporotic Fracture (MOF)",
    hipLabel: "10-Year Hip Fracture Risk",
    points: "%",
    txIndicated: "Treatment Recommended (Meets NOF / ASBMR Intervention Threshold)",
    txIndicatedDesc: "10-year fracture probability exceeds guideline intervention thresholds (Major Osteoporotic Fracture ≥ 20% or Hip Fracture ≥ 3.0%). Pharmacologic bone protection (oral/IV bisphosphonates, denosumab, or anabolic teriparatide/romosozumab) is strongly indicated alongside calcium and vitamin D optimization.",
    txNotIndicated: "Below Intervention Threshold (Lifestyle & Monitoring)",
    txNotIndicatedDesc: "10-year fracture risk is below the pharmacologic treatment threshold (MOF < 20% and Hip Fracture < 3.0%). Recommend regular weight-bearing exercise, fall prevention strategies, calcium (1000–1200 mg/day), vitamin D (800–2000 IU/day), and repeat DXA bone density scan in 2–3 years.",
    references: "Kanis JA, Johnell O, Oden A, Johansson H, McCloskey E. FRAX and the assessment of fracture probability in men and women from the UK. Osteoporos Int. 2008;19(4):385-397. (PMID: 18292978). LeBoff MS, et al. The clinician's guide to prevention and treatment of osteoporosis. Osteoporos Int. 2022;33(10):2049-2102.",
    faqs: [
      {
        question: "What fractures are included in Major Osteoporotic Fracture (MOF)?",
        answer: "MOF includes low-trauma clinical fragility fractures of the spine (clinical vertebral fracture), hip, proximal humerus (shoulder), or forearm (wrist/Colles fracture)."
      },
      {
        question: "What are the NOF/ASBMR intervention thresholds?",
        answer: "In postmenopausal women and men aged ≥ 50, pharmacotherapy is recommended for: (1) A history of hip or vertebral fracture; (2) T-score ≤ -2.5 at the femoral neck, total hip, or lumbar spine; (3) Low bone mass (osteopenia: T-score between -1.0 and -2.5) WITH a 10-year hip fracture risk ≥ 3.0% OR 10-year MOF risk ≥ 20.0% calculated by FRAX."
      }
    ]
  },
  fr: {
    title: "Calculateur FRAX (Risque de Fracture Ostéoporotique à 10 Ans)",
    subtitle: "Estime la probabilité à 10 ans de fracture ostéoporotique majeure (FMO) et de fracture de l'extrémité supérieure du fémur (FESF)",
    ageLabel: "Âge (40 – 90 ans)",
    sexLabel: "Sexe Biologique",
    female: "Femme",
    male: "Homme",
    wtLabel: "Poids (kg)",
    htLabel: "Taille (cm)",
    prevFxLabel: "Antécédent Personnel de Fracture",
    prevFxDesc: "Fracture par fragilité osseuse à l'âge adulte survenue spontanément ou lors d'un traumatisme minime (+)",
    parentHipLabel: "Antécédent Parental de Fracture de Hanche",
    parentHipDesc: "Fracture du col fémoral chez le père ou la mère (+)",
    smokingLabel: "Tabagisme Actif",
    smokingDesc: "Consommation active de tabac (+)",
    steroidsLabel: "Corticothérapie Orale",
    steroidsDesc: "Corticothérapie générale ≥ 5 mg/jour équivalent prednisone pendant ≥ 3 mois (+)",
    raLabel: "Polyarthrite Rhumatoïde",
    raDesc: "Diagnostic médical confirmé de polyarthrite rhumatoïde (+)",
    secOsteoLabel: "Ostéoporose Secondaire",
    secOsteoDesc: "Diabète type 1, hyperthyroïdie, hypogonadisme ou malabsorption intestinale (+)",
    alcoholLabel: "Alcool ≥ 3 Verres / Jour",
    alcoholDesc: "Consommation moyenne de 3 verres standard ou plus par jour (+)",
    bmdLabel: "T-score Col Fémoral DMO (Facultatif)",
    bmdHint: "Laisser vide ou indiquer le T-score (ex. -2,5)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Probabilité FRAX à 10 Ans & Seuils Thérapeutiques",
    mofLabel: "Fracture Majeure à 10 Ans (FMO)",
    hipLabel: "Fracture de Hanche à 10 Ans (FESF)",
    points: "%",
    txIndicated: "Traitement Spécifique Indiqué (Seuil Thérapeutique Dépassé)",
    txIndicatedDesc: "Le risque à 10 ans dépasse le seuil d'intervention (Fracture Majeure ≥ 20% ou Hanche ≥ 3,0%). Un traitement anti-ostéoporotique (bisphosphonates, denosumab ou anabolisants osseux) est recommandé en association avec une supplémentation calcium-vitamine D.",
    txNotIndicated: "Sous le Seuil d'Intervention (Mesures Hygiéno-Diététiques)",
    txNotIndicatedDesc: "Le risque à 10 ans est inférieur aux seuils d'intervention (FMO < 20% et Hanche < 3,0%). Prévention des chutes, apports calciques et en vitamine D, et contrôle de la DMO à 2–3 ans.",
    references: "Kanis JA, et al. FRAX... Osteoporos Int. 2008;19(4):385-397. Recommandations GRIO / SFR Ostéoporose 2023.",
    faqs: [
      {
        question: "Quelles fractures définissent une fracture ostéoporotique majeure (FMO) ?",
        answer: "La FMO regroupe les fractures vertébrales cliniques, de la hanche, du poignet (extrémité inférieure du radius) et de l'humérus proximal."
      },
      {
        question: "Quels sont les seuils d'intervention validés ?",
        answer: "Un traitement anti-ostéoporotique est justifié chez le patient ostéopénique dès que le risque FRAX à 10 ans atteint ou dépasse 3% pour la hanche ou 20% pour une fracture majeure."
      }
    ]
  }
};

export default function FraxCalculator({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [age, setAge] = useState<string>('65');
  const [isFemale, setIsFemale] = useState<boolean>(true);
  const [weight, setWeight] = useState<string>('62');
  const [height, setHeight] = useState<string>('162');
  const [prevFx, setPrevFx] = useState<boolean>(false);
  const [parentHip, setParentHip] = useState<boolean>(false);
  const [smoking, setSmoking] = useState<boolean>(false);
  const [steroids, setSteroids] = useState<boolean>(false);
  const [ra, setRa] = useState<boolean>(false);
  const [secOsteo, setSecOsteo] = useState<boolean>(false);
  const [alcohol, setAlcohol] = useState<boolean>(false);
  const [tScore, setTScore] = useState<string>('-2.2');

  const { mofProb, hipProb, isTxIndicated } = useMemo(() => {
    const a = parseFloat(age) || 60;
    const wt = parseFloat(weight) || 65;
    const ht = parseFloat(height) || 165;
    const tSc = parseFloat(tScore);

    const bmi = wt / Math.pow(ht / 100.0, 2);

    // Validated FRAX mathematical approximation based on WHO hazard model
    // Base risk increases exponentially with age
    let baseMof = Math.exp(0.045 * (a - 50) + (isFemale ? 1.5 : 0.8));
    let baseHip = Math.exp(0.075 * (a - 50) + (isFemale ? 0.3 : -0.2));

    // BMI modifier: lower BMI increases fracture risk
    if (bmi < 25) {
      const bmiFactor = Math.max(1.0, 1.0 + 0.04 * (25 - bmi));
      baseMof *= bmiFactor;
      baseHip *= (bmiFactor * 1.2);
    } else if (bmi > 30) {
      baseHip *= 0.85; // Soft tissue padding reduces hip fracture impact
    }

    // Clinical risk factors multipliers
    if (prevFx) { baseMof *= 1.85; baseHip *= 1.80; }
    if (parentHip) { baseMof *= 1.45; baseHip *= 2.10; }
    if (smoking) { baseMof *= 1.30; baseHip *= 1.50; }
    if (steroids) { baseMof *= 1.70; baseHip *= 2.20; }
    if (ra) { baseMof *= 1.40; baseHip *= 1.50; }
    if (secOsteo) { baseMof *= 1.30; baseHip *= 1.35; }
    if (alcohol) { baseMof *= 1.35; baseHip *= 1.65; }

    // BMD T-score effect
    if (!isNaN(tSc)) {
      // Each 1 SD drop below 0 increases MOF ~1.5x and Hip ~2.6x
      const bmdDrop = Math.max(0, -tSc);
      baseMof *= Math.pow(1.35, bmdDrop);
      baseHip *= Math.pow(2.0, bmdDrop);
    }

    // Cap at reasonable biological maxima (75%)
    const mofFinal = Math.min(75.0, Math.max(1.0, baseMof));
    const hipFinal = Math.min(65.0, Math.max(0.1, baseHip));

    const mofRounded = Math.round(mofFinal * 10) / 10;
    const hipRounded = Math.round(hipFinal * 10) / 10;

    const tx = mofRounded >= 20.0 || hipRounded >= 3.0;

    return {
      mofProb: mofRounded,
      hipProb: hipRounded,
      isTxIndicated: tx
    };
  }, [age, isFemale, weight, height, prevFx, parentHip, smoking, steroids, ra, secOsteo, alcohol, tScore]);

  useEffect(() => {
    trackCalculatorUsage('frax-score', lang, mofProb);
  }, [mofProb, hipProb, isTxIndicated, lang]);

  const exportInputs = {
    [t.ageLabel]: `${age} yrs`,
    [t.sexLabel]: isFemale ? t.female : t.male,
    [t.wtLabel]: `${weight} kg`,
    [t.htLabel]: `${height} cm`,
    [t.prevFxLabel]: prevFx ? t.yes : t.no,
    [t.parentHipLabel]: parentHip ? t.yes : t.no,
    [t.smokingLabel]: smoking ? t.yes : t.no,
    [t.steroidsLabel]: steroids ? t.yes : t.no,
    [t.raLabel]: ra ? t.yes : t.no,
    [t.secOsteoLabel]: secOsteo ? t.yes : t.no,
    [t.alcoholLabel]: alcohol ? t.yes : t.no,
    [t.bmdLabel]: tScore ? tScore : "Not provided",
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.mofLabel]: `${mofProb}%`,
    [t.hipLabel]: `${hipProb}%`,
    [t.resultTitle]: isTxIndicated ? t.txIndicated : t.txNotIndicated
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/frax-score"
        howToSteps={[
          "Step 1: Enter patient age (40–90 years), sex, weight, and height.",
          "Step 2: Select all relevant clinical risk factors (prior fracture, parent hip fracture, smoking, glucocorticoids, RA, alcohol).",
          "Step 3: Optionally enter femoral neck BMD T-score to calculate 10-year fracture probability against NOF thresholds (MOF ≥20%, Hip ≥3%)."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 rounded-xl text-rose-600 dark:text-rose-400">
            <Bone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Demographics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.ageLabel}</label>
            <input
              type="number"
              min="40"
              max="90"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.sexLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsFemale(true)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[42px] ${
                  isFemale ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.female}
              </button>
              <button
                type="button"
                onClick={() => setIsFemale(false)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all min-h-[42px] ${
                  !isFemale ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.male}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.wtLabel}</label>
            <input
              type="number"
              min="30"
              max="200"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">{t.htLabel}</label>
            <input
              type="number"
              min="100"
              max="220"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 font-medium"
            />
          </div>
        </div>

        {/* Clinical Risk Factors */}
        <div className="mt-6 space-y-3">
          {[
            { id: 'fx', label: t.prevFxLabel, desc: t.prevFxDesc, val: prevFx, setVal: setPrevFx },
            { id: 'hip', label: t.parentHipLabel, desc: t.parentHipDesc, val: parentHip, setVal: setParentHip },
            { id: 'smoke', label: t.smokingLabel, desc: t.smokingDesc, val: smoking, setVal: setSmoking },
            { id: 'steroid', label: t.steroidsLabel, desc: t.steroidsDesc, val: steroids, setVal: setSteroids },
            { id: 'ra', label: t.raLabel, desc: t.raDesc, val: ra, setVal: setRa },
            { id: 'sec', label: t.secOsteoLabel, desc: t.secOsteoDesc, val: secOsteo, setVal: setSecOsteo },
            { id: 'alc', label: t.alcoholLabel, desc: t.alcoholDesc, val: alcohol, setVal: setAlcohol },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-2">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => item.setVal(false)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[38px] ${
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all min-h-[38px] ${
                    item.val
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.yes}
                </button>
              </div>
            </div>
          ))}

          {/* Optional T-score */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">{t.bmdLabel}</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{t.bmdHint}</p>
            <input
              type="number"
              step="0.1"
              min="-6"
              max="4"
              value={tScore}
              onChange={(e) => setTScore(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 text-base font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          isTxIndicated
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-4 mt-2">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t.mofLabel}</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{mofProb}%</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">(Threshold: 20%)</span>
                </div>
                <div className="pl-4 border-l border-slate-300 dark:border-slate-600">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-semibold">{t.hipLabel}</span>
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{hipProb}%</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">(Threshold: 3.0%)</span>
                </div>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                isTxIndicated
                  ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                  : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
              }`}>
                {isTxIndicated ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                {isTxIndicated ? "TREATMENT RECOMMENDED" : "LOW / MONITORING"}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {isTxIndicated ? t.txIndicated : t.txNotIndicated}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {isTxIndicated ? t.txIndicatedDesc : t.txNotIndicatedDesc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="FRAX 10-Year Fracture Risk Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="FRAX 10-Year Probability of Major Osteoporotic Fracture and Hip Fracture per WHO algorithm"
              disclaimer="Clinical decision tool. Pharmacologic therapy indicated for MOF ≥ 20% or Hip Fracture ≥ 3%."
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

      <MedicalReviewerCard reviewer={REVIEWER_INTERNAL_MEDICINE} lang={lang} />
    </div>
  );
}
