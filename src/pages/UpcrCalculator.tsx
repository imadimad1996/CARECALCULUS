import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info, BookOpen, AlertTriangle, ShieldCheck, Stethoscope, ChevronRight, ExternalLink, ShieldAlert } from 'lucide-react';
import { LangCode, Translations } from '../types';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';
import { CalcPageSchemas } from '../components/JsonLd';
import { MedicalReviewerCard } from '../components/MedicalReviewerCard';
import { REVIEWER_NEPHROLOGY } from '../data/reviewers';

const translations: Translations = {
  en: {
    title: "UPCR & UACR Proteinuria Calculator",
    subtitle: "Converts spot urine protein/albumin and creatinine into 24-hour equivalent proteinuria & KDIGO CKD staging",
    modeLabel: "Assessment Type",
    modeUpcr: "UPCR (Total Protein)",
    modeUacr: "UACR (Albumin)",
    uProtLabel: "Spot Urine Total Protein (mg/dL)",
    uAlbLabel: "Spot Urine Albumin (mg/L or µg/mL)",
    uCrLabel: "Spot Urine Creatinine (mg/dL)",
    resultTitle: "Proteinuria Quantification & KDIGO Staging",
    upcrRatioLabel: "Urine Protein-to-Creatinine Ratio (UPCR)",
    uacrRatioLabel: "Urine Albumin-to-Creatinine Ratio (UACR)",
    est24hLabel: "Estimated 24-Hour Excretion",
    normalProt: "Normal / Physiological Proteinuria (< 0.15 g/day)",
    normalProtDesc: "Total proteinuria within normal physiological limits. No significant glomerular or tubular leakage.",
    modProt: "Mild to Moderate Proteinuria (0.15 – 3.0 g/day)",
    modProtDesc: "Sub-nephrotic proteinuria. Indicates early glomerulopathy, tubulointerstitial disease, hypertensive nephrosclerosis, or diabetic kidney disease. ACEi/ARB or SGLT2i evaluation indicated.",
    nephroticProt: "Nephrotic-Range Proteinuria (> 3.0 – 3.5 g/day)",
    nephroticProtDesc: "Nephrotic-range proteinuria. High risk of nephrotic syndrome (edema, hypoalbuminemia, hyperlipidemia). Urgent nephrology consultation, renal biopsy evaluation, and antithrombotic/statin assessment required.",
    a1Stage: "KDIGO Stage A1: Normal to Mildly Increased (< 30 mg/g)",
    a1Desc: "Normal to mildly increased urinary albumin excretion (< 30 mg/g or < 3 mg/mmol). Low cardiovascular and renal progression risk.",
    a2Stage: "KDIGO Stage A2: Moderately Increased / Microalbuminuria (30 – 300 mg/g)",
    a2Desc: "Moderately increased urinary albumin (30–300 mg/g or 3–30 mg/mmol). Confirms early microvascular endothelial damage, diabetic nephropathy, or early CKD. Guideline-directed medical therapy with ACEi/ARB, SGLT2i, or nsMRA indicated.",
    a3Stage: "KDIGO Stage A3: Severely Increased / Macroalbuminuria (> 300 mg/g)",
    a3Desc: "Severely increased albuminuria (> 300 mg/g or > 30 mg/mmol). Steeply accelerates rate of eGFR loss and cardiovascular mortality. If > 2200 mg/g, corresponds to nephrotic syndrome.",
    references: "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease. Kidney Int. 2024;105(4S):S117-S314. Ginsberg JM, et al. Use of single voided urine samples to estimate quantitative proteinuria. N Engl J Med. 1983;309(25):1543-1546.",
    faqs: [
      {
        question: "Why has spot UPCR/UACR replaced 24-hour urine collection?",
        answer: "24-hour urine collections are notoriously inaccurate due to over- or under-collection by up to 30%. Because tubular creatinine excretion is relatively constant throughout the day, dividing spot urine protein by creatinine mathematically normalizes for urinary concentration, accurately mirroring 24-hour excretion in grams/day."
      },
      {
        question: "When should UACR be ordered instead of UPCR?",
        answer: "UACR (albumin) is the gold standard for screening and monitoring diabetic kidney disease and early CKD per KDIGO and ADA guidelines, as it detects minuscule endothelial injury (30–300 mg/g) undetectable by total protein dipsticks. UPCR is preferred when evaluating suspected tubular proteinuria, myeloma light chains (Bence Jones), or heavy nephrotic syndrome (>3 g/day)."
      }
    ]
  },
  fr: {
    title: "Calculateur UPCR & UACR (Protéinurie / Albuminurie)",
    subtitle: "Convertit le rapport protéine/créatinine ou albumine/créatinine urinaire en débit des 24h et classification KDIGO",
    modeLabel: "Type d'Analyse",
    modeUpcr: "UPCR (Protéinurie Totale)",
    modeUacr: "UACR (Albuminurie)",
    uProtLabel: "Protéines Urinaires Échantillon (mg/dL)",
    uAlbLabel: "Albuminurie Échantillon (mg/L)",
    uCrLabel: "Créatininurie Échantillon (mg/dL)",
    resultTitle: "Quantification & Stade KDIGO",
    upcrRatioLabel: "Rapport Protéinurie / Créatininurie (UPCR)",
    uacrRatioLabel: "Rapport Albuminurie / Créatininurie (UACR)",
    est24hLabel: "Débit Estimé des 24 Heures",
    normalProt: "Protéinurie Physiologique / Normale (< 0,15 g/24h)",
    normalProtDesc: "Excrétion protéique normale. Absence de fuite glomérulaire ou tubulaire significative.",
    modProt: "Protéinurie Non Néphrotique (0,15 – 3,0 g/24h)",
    modProtDesc: "Protéinurie pathologique modérée. Témoigne d'une glomérulopathie débutante, néphroangiosclérose ou néphropathie diabétique. Évaluation d'un traitement néphroprotecteur (IEC/ARA2, iSGLT2).",
    nephroticProt: "Protéinurie de Rang Néphrotique (> 3,0 – 3,5 g/24h)",
    nephroticProtDesc: "Syndrome néphrotique biologique hautement probable. Consultation néphrologique urgente pour ponction-biopsie rénale (PBR) et prévention thromboembolique.",
    a1Stage: "Stade KDIGO A1 : Albuminurie Normale ou Discrète (< 30 mg/g)",
    a1Desc: "Excrétion urinaire d'albumine normale (< 30 mg/g ou < 3 mg/mmol). Risque rénal et cardiovasculaire de base.",
    a2Stage: "Stade KDIGO A2 : Albuminurie Modérée / Microalbuminurie (30 – 300 mg/g)",
    a2Desc: "Albuminurie pathologique précoce (30–300 mg/g). Signe précoce de néphropathie diabétique ou vasculaire. Indication formelle d'un bloqueur du SRAA et/ou d'un inhibiteur du SGLT2.",
    a3Stage: "Stade KDIGO A3 : Macroalbuminurie Sévère (> 300 mg/g)",
    a3Desc: "Albuminurie sévère (> 300 mg/g ou > 30 mg/mmol). Accélération majeure du déclin du DFGe et surmortalité cardiovasculaire.",
    references: "Recommandations KDIGO 2024 Maladie Rénale Chronique. Kidney Int. 2024. Ginsberg JM, et al. N Engl J Med. 1983.",
    faqs: [
      {
        question: "Pourquoi privilégier le ratio spot plutôt que la protéinurie des 24 heures ?",
        answer: "Le recueil des 24h est entaché de 30% d'erreurs d'incomplétude. L'excrétion de créatinine étant constante, diviser par la créatininurie normalise la concentration urinaire et donne une estimation quasi-identique au débit des 24h."
      },
      {
        question: "Quand doser l'UACR plutôt que l'UPCR ?",
        answer: "L'UACR (albumine) est l'examen de choix pour le dépistage et le suivi du diabète et de l'HTA (détecte la microalbuminurie 30-300 mg/g). L'UPCR est préféré pour les protéinuries tubulaires, chaînes légères de myélome ou syndromes néphrotiques massifs."
      }
    ]
  }
};

export default function UpcrCalculator({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [mode, setMode] = useState<'upcr' | 'uacr'>('upcr');
  // Defaults:
  const [protVal, setProtVal] = useState<string>('60'); // mg/dL
  const [albVal, setAlbVal] = useState<string>('80'); // mg/L
  const [crVal, setCrVal] = useState<string>('80'); // mg/dL

  const results = useMemo(() => {
    const cr = parseFloat(crVal) || 0;
    if (cr <= 0) return { ratio: 0, est24h: '0', stage: 'invalid', desc: '', title: '', color: 'slate' };

    if (mode === 'upcr') {
      const p = parseFloat(protVal) || 0;
      // UPCR (mg/mg) = Urine Protein (mg/dL) / Urine Cr (mg/dL)
      const ratio = p / cr;
      const est24hG = ratio; // 1 mg/mg ≈ 1 g/24h

      let color = 'emerald';
      let title = t.normalProt;
      let desc = t.normalProtDesc;

      if (ratio > 3.0) {
        color = 'rose';
        title = t.nephroticProt;
        desc = t.nephroticProtDesc;
      } else if (ratio >= 0.15) {
        color = 'amber';
        title = t.modProt;
        desc = t.modProtDesc;
      }

      return {
        ratio: Math.round(ratio * 100) / 100,
        est24h: `${Math.round(est24hG * 100) / 100} g/24h`,
        stage: ratio > 3.0 ? 'Nephrotic' : ratio >= 0.15 ? 'Sub-nephrotic' : 'Normal',
        desc,
        title,
        color
      };
    } else {
      // UACR: Albumin in mg/L, Cr in mg/dL
      // UACR (mg/g) = [Albumin (mg/L) / (Cr (mg/dL) * 10)] * 1000 = (Albumin / Cr) * 100
      const a = parseFloat(albVal) || 0;
      const uacrMgG = (a / cr) * 100;
      const uacrMgMmol = uacrMgG * 0.113;

      let color = 'emerald';
      let title = t.a1Stage;
      let desc = t.a1Desc;

      if (uacrMgG > 300) {
        color = 'rose';
        title = t.a3Stage;
        desc = t.a3Desc;
      } else if (uacrMgG >= 30) {
        color = 'amber';
        title = t.a2Stage;
        desc = t.a2Desc;
      }

      return {
        ratio: Math.round(uacrMgG),
        ratioSi: Math.round(uacrMgMmol * 10) / 10,
        est24h: `${Math.round(uacrMgG)} mg/24h`,
        stage: uacrMgG > 300 ? 'A3' : uacrMgG >= 30 ? 'A2' : 'A1',
        desc,
        title,
        color
      };
    }
  }, [mode, protVal, albVal, crVal, t]);

  useEffect(() => {
    trackCalculatorUsage('upcr-calculator', lang, results.ratio || 0);
  }, [mode, results.ratio, results.stage, lang]);

  const exportInputs = mode === 'upcr' ? {
    [t.modeLabel]: t.modeUpcr,
    [t.uProtLabel]: `${protVal} mg/dL`,
    [t.uCrLabel]: `${crVal} mg/dL`,
  } : {
    [t.modeLabel]: t.modeUacr,
    [t.uAlbLabel]: `${albVal} mg/L`,
    [t.uCrLabel]: `${crVal} mg/dL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = mode === 'upcr' ? {
    [t.upcrRatioLabel]: `${results.ratio} mg/mg (g/g)`,
    [t.est24hLabel]: results.est24h,
    [t.resultTitle]: results.title
  } : {
    [t.uacrRatioLabel]: `${results.ratio} mg/g (${results.ratioSi} mg/mmol)`,
    [t.est24hLabel]: results.est24h,
    [t.resultTitle]: results.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/upcr-calculator"
        howToSteps={[
          "Step 1: Select test type: UPCR for total proteinuria or UACR for microalbuminuria/CKD staging.",
          "Step 2: Enter spot urine protein/albumin and spot urine creatinine concentrations.",
          "Step 3: Review 24-hour equivalent excretion and corresponding KDIGO risk category (A1, A2, A3)."
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
              onClick={() => setMode('upcr')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                mode === 'upcr' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.modeUpcr}
            </button>
            <button
              type="button"
              onClick={() => setMode('uacr')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                mode === 'uacr' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.modeUacr}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mode === 'upcr' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {t.uProtLabel}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={protVal}
                onChange={(e) => setProtVal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-lg font-medium"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                {t.uAlbLabel}
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={albVal}
                onChange={(e) => setAlbVal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-lg font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              {t.uCrLabel}
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={crVal}
              onChange={(e) => setCrVal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-lg font-medium"
            />
          </div>
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          results.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : results.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{results.ratio}</span>
                <span className="text-lg text-slate-600 dark:text-slate-300 font-bold">
                  {mode === 'upcr' ? 'mg/mg (g/g)' : 'mg/g'}
                </span>
                {mode === 'uacr' && (
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400 ml-2">
                    ({results.ratioSi} mg/mmol)
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                results.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : results.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {results.color === 'rose' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                {results.stage.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.est24hLabel}:</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">{results.est24h}</span>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {results.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {results.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="UPCR / UACR Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula={mode === 'upcr' ? "UPCR (mg/mg) = Urine Protein (mg/dL) / Urine Cr (mg/dL) ≈ g/24h" : "UACR (mg/g) = [Urine Albumin (mg/L) / Urine Cr (mg/dL)] × 100"}
              disclaimer="Clinical decision tool for proteinuria quantification. Confirm abnormal results with repeat testing; exclude transient causes (fever, exercise, UTI)."
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

      <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} lang={lang} />
    </div>
  );
}
