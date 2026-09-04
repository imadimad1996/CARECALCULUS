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
    title: "Calcium × Phosphate Product (Ca × Pi)",
    subtitle: "Evaluates the risk of metastatic soft-tissue calcification and calciphylaxis in chronic kidney disease",
    unitToggle: "Units",
    usUnits: "US Units (mg/dL)",
    siUnits: "SI Units (mmol/L)",
    caLabel: "Total Serum Calcium",
    piLabel: "Serum Inorganic Phosphate (Phosphorus)",
    resultTitle: "Ca × Pi Product & Calcification Risk",
    productLabel: "Calculated Ca × Pi Product",
    pointsUs: "mg²/dL²",
    pointsSi: "mmol²/L²",
    normalTier: "Product < 55 mg²/dL² (< 4.4 mmol²/L²) — Target Range",
    normalTierDesc: "Mineral metabolism product is within the KDIGO safe target boundary. Low likelihood of extra-skeletal precipitation and calciphylaxis.",
    elevatedTier: "Product 55 – 70 mg²/dL² (4.4 – 5.6 mmol²/L²) — Elevated Metastatic Calcification Hazard",
    elevatedTierDesc: "Supersaturation threshold exceeded. Promotes hydroxyapatite crystallization in arterial tunica media, heart valves, and visceral organs. Discontinue calcium-based phosphate binders; initiate non-calcium binders (e.g. sevelamer, lanthanum) and optimize dialysis clearance.",
    severeTier: "Product > 70 mg²/dL² (> 5.6 mmol²/L²) — Critical Calciphylaxis Hazard",
    severeTierDesc: "Extreme danger of calcific uremic arteriolopathy (calciphylaxis), severe digital/mesenteric ischemia, and fulminant cardiovascular mortality. Hold all active vitamin D sterols and calcium supplements; consider emergent sodium thiosulfate therapy if ischemic skin necrosis develops.",
    references: "Ketteler M, et al. Executive summary of the 2017 KDIGO Chronic Kidney Disease-Mineral and Bone Disorder (CKD-MBD) Guideline Update. Kidney Int. 2017;92(1):26-36. Block GA, et al. Mineral metabolism, mortality, and morbidity in maintenance hemodialysis. J Am Soc Nephrol. 2004;15(8):2208-2218.",
    faqs: [
      {
        question: "Why is the Ca × Pi product of 55 mg²/dL² so clinically significant?",
        answer: "The solubility product of calcium phosphate in human plasma is approximately 55 mg²/dL² (4.4 mmol²/L²). Above this concentration, chemical precipitation of calcium phosphate crystal lattices (hydroxyapatite) spontaneously occurs in soft tissues, particularly vascular smooth muscle cells undergoing osteogenic transdifferentiation."
      },
      {
        question: "Should albumin-corrected calcium be used in the product?",
        answer: "Yes, in patients with severe hypoalbuminemia (albumin < 4.0 g/dL), calculating corrected calcium [Measured Ca + 0.8 × (4.0 - Albumin)] prevents underestimating the true ionized calcium burden and calcification hazard."
      }
    ]
  },
  fr: {
    title: "Produit Phospho-Calcique (Ca × Pi)",
    subtitle: "Évalue le risque de calcifications vasculaires métastatiques et de calciphylaxie dans l'insuffisance rénale chronique",
    unitToggle: "Unités",
    usUnits: "Unités US (mg/dL)",
    siUnits: "Unités SI (mmol/L)",
    caLabel: "Calcémie Totale",
    piLabel: "Phosphatémie (Phosphore Inorganique)",
    resultTitle: "Produit Ca × Pi & Risque de Calcification",
    productLabel: "Produit Phospho-Calcique Calculé",
    pointsUs: "mg²/dL²",
    pointsSi: "mmol²/L²",
    normalTier: "Produit < 55 mg²/dL² (< 4,4 mmol²/L²) — Cible Thérapeutique",
    normalTierDesc: "Produit phospho-calcique dans la cible recommandée par les recommandations KDIGO. Risque faible de précipitation extra-squelettique et de calciphylaxie.",
    elevatedTier: "Produit 55 – 70 mg²/dL² (4,4 – 5,6 mmol²/L²) — Risque Élevé de Calcifications",
    elevatedTierDesc: "Seuil de sursaturation dépassé. Favorise les calcifications de la média artérielle, des valves cardiaques et des tissus mous. Remplacer les chélateurs calciques par des chélateurs non calciques (sevelamer) et optimiser la dialyse.",
    severeTier: "Produit > 70 mg²/dL² (> 5,6 mmol²/L²) — Risque Critique de Calciphylaxie",
    severeTierDesc: "Risque extrême d'artériolopathie urémique calcifiante (calciphylaxie) et de nécrose cutanée ischémique. Arrêt immédiat de la vitamine D active et des apports calciques ; discuter le thiosulfate de sodium.",
    references: "Recommandations KDIGO 2017 CKD-MBD. Kidney Int. 2017. Block GA, et al. J Am Soc Nephrol. 2004.",
    faqs: [
      {
        question: "Pourquoi le seuil de 55 mg²/dL² est-il critique ?",
        answer: "Au-delà de ce produit de solubilité plasmatique (~4,4 mmol²/L²), le phosphate et le calcium précipitent sous forme de cristaux d'hydroxyapatite dans la paroi artérielle et les tissus viscéraux."
      },
      {
        question: "Faut-il utiliser le calcium corrigé ?",
        answer: "En cas d'hypoalbuminémie (< 40 g/L), il est fortement recommandé d'utiliser la calcémie corrigée pour ne pas sous-estimer la charge calcique réelle."
      }
    ]
  }
};

export default function CalciumPhosphateProduct({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isSi, setIsSi] = useState<boolean>(false);
  // US defaults: Ca 9.2 mg/dL, Pi 5.8 mg/dL -> Product 53.36
  const [caUs, setCaUs] = useState<string>('9.2');
  const [piUs, setPiUs] = useState<string>('5.8');

  // SI defaults: Ca 2.3 mmol/L, Pi 1.8 mmol/L -> Product 4.14
  const [caSi, setCaSi] = useState<string>('2.3');
  const [piSi, setPiSi] = useState<string>('1.8');

  const { productUs, productSi } = useMemo(() => {
    let cUs = 0;
    let pUs = 0;
    let cSi = 0;
    let pSi = 0;

    if (isSi) {
      cSi = parseFloat(caSi) || 0;
      pSi = parseFloat(piSi) || 0;
      // 1 mmol/L Ca = 4.008 mg/dL
      cUs = cSi * 4.0;
      // 1 mmol/L Pi = 3.097 mg/dL
      pUs = pSi * 3.1;
    } else {
      cUs = parseFloat(caUs) || 0;
      pUs = parseFloat(piUs) || 0;
      cSi = cUs / 4.0;
      pSi = pUs / 3.1;
    }

    const prodUs = cUs * pUs;
    const prodSi = cSi * pSi;

    return {
      productUs: Math.round(prodUs * 10) / 10,
      productSi: Math.round(prodSi * 100) / 100
    };
  }, [isSi, caUs, piUs, caSi, piSi]);

  const riskTier = useMemo(() => {
    if (productUs > 70) {
      return { tier: 'severe', title: t.severeTier, desc: t.severeTierDesc, color: 'rose' };
    }
    if (productUs >= 55) {
      return { tier: 'elevated', title: t.elevatedTier, desc: t.elevatedTierDesc, color: 'amber' };
    }
    return { tier: 'target', title: t.normalTier, desc: t.normalTierDesc, color: 'emerald' };
  }, [productUs, t]);

  useEffect(() => {
    trackCalculatorUsage('calcium-phosphate-product', lang, productUs);
  }, [productUs, productSi, riskTier.tier, lang]);

  const exportInputs = isSi ? {
    [t.caLabel]: `${caSi} mmol/L`,
    [t.piLabel]: `${piSi} mmol/L`,
  } : {
    [t.caLabel]: `${caUs} mg/dL`,
    [t.piLabel]: `${piUs} mg/dL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.productLabel]: `${productUs} ${t.pointsUs} (${productSi} ${t.pointsSi})`,
    [t.resultTitle]: riskTier.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/calcium-phosphate-product"
        howToSteps={[
          "Step 1: Select units: US units (mg/dL) or SI units (mmol/L).",
          "Step 2: Enter serum total calcium (corrected for albumin if hypoalbuminemic) and serum phosphate.",
          "Step 3: Assess product against KDIGO threshold of 55 mg²/dL² (4.4 mmol²/L²) for vascular calcification and calciphylaxis risk."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
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
              onClick={() => setIsSi(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                !isSi ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsSi(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isSi ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.siUnits}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {!isSi ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.caLabel} (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={caUs}
                  onChange={(e) => setCaUs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.piLabel} (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={piUs}
                  onChange={(e) => setPiUs(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.caLabel} (mmol/L)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={caSi}
                  onChange={(e) => setCaSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.piLabel} (mmol/L)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={piSi}
                  onChange={(e) => setPiSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 text-lg font-medium"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          riskTier.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : riskTier.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {!isSi ? productUs : productSi}
                </span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">
                  {!isSi ? t.pointsUs : t.pointsSi}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">
                  ({!isSi ? `${productSi} mmol²/L²` : `${productUs} mg²/dL²`})
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                riskTier.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : riskTier.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {riskTier.tier === 'target' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                {riskTier.tier.toUpperCase()}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {riskTier.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {riskTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="Calcium × Phosphate Product Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="Ca × Pi Product = Serum Total Calcium × Serum Inorganic Phosphate"
              disclaimer="Clinical decision aid for CKD-MBD. Target < 55 mg²/dL² (< 4.4 mmol²/L²). Use corrected calcium in hypoalbuminemia."
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

      <MedicalReviewerCard reviewer={REVIEWER_NEPHROLOGY} lang={lang} />
    </div>
  );
}
