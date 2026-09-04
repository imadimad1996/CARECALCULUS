import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_PULMONOLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "Revised Geneva Score for Pulmonary Embolism",
    subtitle: "Assesses clinical pre-test probability of acute pulmonary embolism without laboratory or arterial blood gas data",
    ageLabel: "Age > 65 years",
    ageDesc: "Patient is 66 years old or older (+1 point)",
    prevDvtLabel: "Previous DVT or Pulmonary Embolism",
    prevDvtDesc: "Documented history of deep vein thrombosis or PE (+3 points)",
    surgeryLabel: "Surgery or Lower Limb Fracture ≤ 1 Month",
    surgeryDesc: "Surgery under general anesthesia or fracture within the past 4 weeks (+2 points)",
    cancerLabel: "Active Malignancy",
    cancerDesc: "Solid tumor or hematologic cancer active or treated within past year (+2 points)",
    limbPainLabel: "Unilateral Lower-Limb Pain",
    limbPainDesc: "Pain in one calf or thigh (+3 points)",
    hemoptysisLabel: "Hemoptysis",
    hemoptysisDesc: "Coughing up blood (+2 points)",
    hrLabel: "Heart Rate (Pulse)",
    hrNormal: "< 75 bpm (0 points)",
    hrMod: "75 – 94 bpm (+3 points)",
    hrHigh: "≥ 95 bpm (+5 points)",
    dvtSignsLabel: "Pain on Deep Venous Palpation & Unilateral Edema",
    dvtSignsDesc: "Palpable tenderness along deep calf veins with unilateral leg swelling (+4 points)",
    yes: "Yes",
    no: "No",
    resultTitle: "Revised Geneva Score & Pre-Test Probability",
    scoreLabel: "Total Geneva Score",
    points: "points",
    lowProb: "Score 0 – 3: Low Clinical Probability (~8%)",
    lowProbDesc: "Low pre-test probability of pulmonary embolism (~8% prevalence). Guidelines recommend obtaining a high-sensitivity D-dimer assay (or age-adjusted D-dimer). A negative D-dimer safely excludes PE without chest CT angiography.",
    intProb: "Score 4 – 10: Intermediate Clinical Probability (~28%)",
    intProbDesc: "Intermediate pre-test probability (~28% prevalence). Order a high-sensitivity D-dimer assay. If elevated (or age-adjusted cutoff exceeded), proceed immediately to CT pulmonary angiography (CTPA). If D-dimer is strictly negative, PE is ruled out.",
    highProb: "Score ≥ 11: High Clinical Probability (~74%)",
    highProbDesc: "High pre-test probability (~74% prevalence). Do not delay for D-dimer testing. Proceed directly to diagnostic imaging (CT pulmonary angiography or V/Q scan) and initiate empiric therapeutic anticoagulation if no absolute contraindications exist.",
    twoTierTitle: "Simplified 2-Tier Classification",
    unlikely: "PE Unlikely (Score 0 – 5): D-Dimer Rule-Out Recommended",
    likely: "PE Likely (Score ≥ 6): CT Angiography Indicated",
    references: "Le Gal G, Righini M, Roy PM, et al. Prediction of pulmonary embolism in the emergency department: the revised Geneva score. Ann Intern Med. 2006;144(3):165-172. (PMID: 16461960). Konstantinides SV, et al. 2019 ESC Guidelines on Pulmonary Embolism. Eur Heart J. 2020;41(4):543-603.",
    faqs: [
      {
        question: "How does the Revised Geneva Score compare to the Wells PE Score?",
        answer: "The Revised Geneva Score relies entirely on objective clinical variables (no subjective criteria such as 'PE is #1 diagnosis or as likely as an alternative'). Both scores have comparable diagnostic performance and are endorsed with Class I recommendations in international ESC and CHEST guidelines."
      },
      {
        question: "Can we use age-adjusted D-dimer with the Geneva score?",
        answer: "Yes. In patients over 50 years with a low or intermediate Geneva score (or PE-unlikely tier), the ADJUST-PE trial demonstrated that an age-adjusted cutoff (Age × 10 µg/L for FEU) safely increases diagnostic yield and avoids unnecessary CT angiograms."
      }
    ]
  },
  fr: {
    title: "Score de Genève Révisé (Embolie Pulmonaire)",
    subtitle: "Évalue la probabilité clinique pré-test d'embolie pulmonaire aiguë sans gazométrie artérielle",
    ageLabel: "Âge > 65 ans",
    ageDesc: "Patient âgé de 66 ans ou plus (+1 point)",
    prevDvtLabel: "Antécédent de TVP ou d'Embolie Pulmonaire",
    prevDvtDesc: "Antécédent documenté de thrombose veineuse profonde ou d'EP (+3 points)",
    surgeryLabel: "Chirurgie ou Fracture Membre Inférieur ≤ 1 mois",
    surgeryDesc: "Intervention sous anesthésie générale ou fracture dans les 4 semaines (+2 points)",
    cancerLabel: "Cancer Actif",
    cancerDesc: "Tumeur solide ou hémopathie active ou traitée dans l'année (+2 points)",
    limbPainLabel: "Douleur Unilatérale d'un Membre Inférieur",
    limbPainDesc: "Douleur localisée à un mollet ou une cuisse (+3 points)",
    hemoptysisLabel: "Hémoptysie",
    hemoptysisDesc: "Crachats hémoptoïques (+2 points)",
    hrLabel: "Fréquence Cardiaque (Pouls)",
    hrNormal: "< 75 bpm (0 point)",
    hrMod: "75 – 94 bpm (+3 points)",
    hrHigh: "≥ 95 bpm (+5 points)",
    dvtSignsLabel: "Douleur à la Palpation Veineuse Profonde & Œdème Unilatéral",
    dvtSignsDesc: "Douleur sur le trajet veineux profond et œdème unilatéral (+4 points)",
    yes: "Oui",
    no: "Non",
    resultTitle: "Score de Genève Révisé & Probabilité Pré-test",
    scoreLabel: "Score Total de Genève",
    points: "points",
    lowProb: "Score 0 – 3 : Probabilité Faible (~8%)",
    lowProbDesc: "Probabilité clinique faible d'embolie pulmonaire (~8%). Le dosage des D-dimères ultrasensibles (avec seuil ajusté à l'âge après 50 ans) permet d'éliminer le diagnostic sans angioscanner thoracique s'il est négatif.",
    intProb: "Score 4 – 10 : Probabilité Intermédiaire (~28%)",
    intProbDesc: "Probabilité clinique intermédiaire (~28%). Dosage des D-dimères recommandé. En cas de positivité, réaliser un angioscanner thoracique en urgence. En cas de négativité stricte, l'embolie pulmonaire est exclue.",
    highProb: "Score ≥ 11 : Probabilité Forte (~74%)",
    highProbDesc: "Probabilité clinique forte (~74%). Ne pas attendre les D-dimères : réaliser directement un angioscanner thoracique (ou scintigraphie V/Q) et débuter l'anticoagulation curative immédiate en l'absence de contre-indication.",
    twoTierTitle: "Classification Simplifiée en 2 Niveaux",
    unlikely: "EP Peu Probable (Score 0 – 5) : D-Dimères Recommandés",
    likely: "EP Probable (Score ≥ 6) : Angioscanner Indiqué d'Emblée",
    references: "Le Gal G, et al. Prediction of pulmonary embolism in the emergency department: the revised Geneva score. Ann Intern Med. 2006;144(3):165-172. Recommandations ESC 2019.",
    faqs: [
      {
        question: "Quelle différence entre le score de Genève et le score de Wells ?",
        answer: "Le score de Genève révisé est composé à 100% de critères objectifs standardisés, sans item subjectif (contrairement au score de Wells qui inclut le jugement 'autre diagnostic moins probable'). Les deux sont validés de niveau 1."
      },
      {
        question: "Peut-on utiliser le seuil de D-dimères ajusté à l'âge ?",
        answer: "Oui, chez les patients de plus de 50 ans avec probabilité faible ou intermédiaire (ou EP peu probable ≤ 5), le seuil ajusté (Âge × 10 µg/L) est validé par l'étude ADJUST-PE."
      }
    ]
  }
};

export default function RevisedGenevaScore({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [ageOver65, setAgeOver65] = useState<boolean>(false);
  const [prevDvt, setPrevDvt] = useState<boolean>(false);
  const [recentSurgery, setRecentSurgery] = useState<boolean>(false);
  const [cancer, setCancer] = useState<boolean>(false);
  const [limbPain, setLimbPain] = useState<boolean>(false);
  const [hemoptysis, setHemoptysis] = useState<boolean>(false);
  const [hrTier, setHrTier] = useState<number>(0); // 0: <75, 3: 75-94, 5: >=95
  const [dvtPalpation, setDvtPalpation] = useState<boolean>(false);

  const score = useMemo(() => {
    let pts = 0;
    if (ageOver65) pts += 1;
    if (prevDvt) pts += 3;
    if (recentSurgery) pts += 2;
    if (cancer) pts += 2;
    if (limbPain) pts += 3;
    if (hemoptysis) pts += 2;
    pts += hrTier;
    if (dvtPalpation) pts += 4;
    return pts;
  }, [ageOver65, prevDvt, recentSurgery, cancer, limbPain, hemoptysis, hrTier, dvtPalpation]);

  const probabilityTier = useMemo(() => {
    if (score <= 3) return { level: 'low', text: t.lowProb, desc: t.lowProbDesc };
    if (score <= 10) return { level: 'intermediate', text: t.intProb, desc: t.intProbDesc };
    return { level: 'high', text: t.highProb, desc: t.highProbDesc };
  }, [score, t]);

  const isLikely = score >= 6;

  useEffect(() => {
    trackCalculatorUsage('revised-geneva', lang, score);
  }, [score, probabilityTier.level, isLikely, lang]);

  const exportInputs = {
    [t.ageLabel]: ageOver65 ? t.yes : t.no,
    [t.prevDvtLabel]: prevDvt ? t.yes : t.no,
    [t.surgeryLabel]: recentSurgery ? t.yes : t.no,
    [t.cancerLabel]: cancer ? t.yes : t.no,
    [t.limbPainLabel]: limbPain ? t.yes : t.no,
    [t.hemoptysisLabel]: hemoptysis ? t.yes : t.no,
    [t.hrLabel]: hrTier === 0 ? "<75 bpm" : hrTier === 3 ? "75-94 bpm" : "≥95 bpm",
    [t.dvtSignsLabel]: dvtPalpation ? t.yes : t.no,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.scoreLabel]: `${score} ${t.points}`,
    [t.resultTitle]: probabilityTier.text,
    [t.twoTierTitle]: isLikely ? t.likely : t.unlikely
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/revised-geneva"
        howToSteps={[
          "Step 1: Evaluate clinical history: age > 65 (+1), previous DVT/PE (+3), recent surgery/fracture (+2), active cancer (+2).",
          "Step 2: Evaluate physical symptoms and signs: unilateral limb pain (+3), hemoptysis (+2), deep vein palpation/edema (+4).",
          "Step 3: Select heart rate category (<75 = 0, 75-94 = +3, ≥95 = +5). Sum points to obtain pre-test probability tier."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {[
            { id: 'age', label: t.ageLabel, desc: t.ageDesc, val: ageOver65, setVal: setAgeOver65, pts: '+1' },
            { id: 'prevDvt', label: t.prevDvtLabel, desc: t.prevDvtDesc, val: prevDvt, setVal: setPrevDvt, pts: '+3' },
            { id: 'surgery', label: t.surgeryLabel, desc: t.surgeryDesc, val: recentSurgery, setVal: setRecentSurgery, pts: '+2' },
            { id: 'cancer', label: t.cancerLabel, desc: t.cancerDesc, val: cancer, setVal: setCancer, pts: '+2' },
            { id: 'pain', label: t.limbPainLabel, desc: t.limbPainDesc, val: limbPain, setVal: setLimbPain, pts: '+3' },
            { id: 'hemo', label: t.hemoptysisLabel, desc: t.hemoptysisDesc, val: hemoptysis, setVal: setHemoptysis, pts: '+2' },
            { id: 'dvtPalp', label: t.dvtSignsLabel, desc: t.dvtSignsDesc, val: dvtPalpation, setVal: setDvtPalpation, pts: '+4' },
          ].map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-base">
                  {item.label} <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">({item.pts})</span>
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
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {t.yes}
                </button>
              </div>
            </div>
          ))}

          {/* Heart Rate 3-Tier Radio */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-750/50">
            <label className="font-semibold text-slate-900 dark:text-white text-base block mb-1">{t.hrLabel}</label>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">Select observed resting pulse</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { label: t.hrNormal, val: 0 },
                { label: t.hrMod, val: 3 },
                { label: t.hrHigh, val: 5 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setHrTier(opt.val)}
                  className={`p-3 text-sm font-medium rounded-xl border transition-all text-center min-h-[44px] ${
                    hrTier === opt.val
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          probabilityTier.level === 'low'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : probabilityTier.level === 'intermediate'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{score}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-medium">/ 22 {t.points}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                probabilityTier.level === 'low'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : probabilityTier.level === 'intermediate'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {probabilityTier.level.toUpperCase()} PROBABILITY
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {isLikely ? t.likely : t.unlikely}
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {probabilityTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Revised Geneva Score for PE"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Revised Geneva: Age>65 (1), Prior DVT/PE (3), Surgery/fracture ≤1mo (2), Malignancy (2), Limb pain (3), Hemoptysis (2), HR 75-94 (3) / ≥95 (5), Deep vein tenderness (4)"
              disclaimer="Clinical decision tool. Must be interpreted with D-dimer or imaging based on validated institutional diagnostic algorithms."
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

      <MedicalReviewerCard reviewer={REVIEWER_PULMONOLOGY} lang={lang} />
    </div>
  );
}
