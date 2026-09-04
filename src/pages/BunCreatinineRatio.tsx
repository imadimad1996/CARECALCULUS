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
    title: "BUN / Creatinine Ratio Calculator",
    subtitle: "Differentiates prerenal azotemia from intrinsic renal failure and gastrointestinal bleeding",
    unitToggle: "Units",
    usUnits: "US Units (mg/dL)",
    siUnits: "SI Units (mmol/L & µmol/L)",
    bunLabel: "Blood Urea Nitrogen (BUN)",
    ureaLabel: "Serum Urea",
    crLabel: "Serum Creatinine",
    resultTitle: "BUN-to-Creatinine Ratio & Clinical Interpretation",
    ratioLabel: "BUN / Creatinine Ratio (Mass)",
    siRatioLabel: "Urea / Creatinine Molar Ratio",
    points: ":1",
    prerenal: "Ratio > 20:1 — Prerenal Azotemia / Upper GI Bleed",
    prerenalDesc: "Strongly suggests prerenal acute kidney injury caused by reduced renal perfusion (dehydration, volume depletion, heart failure, sepsis, hepatorenal syndrome) or increased urea production (upper gastrointestinal bleeding, high-dose corticosteroids, severe catabolism, high-protein diet).",
    normal: "Ratio 10:1 – 20:1 — Normal / Postrenal AKI",
    normalDesc: "Within standard reference boundaries. In the context of elevated serum creatinine, this pattern points toward postrenal obstructive uropathy (BPH, nephrolithiasis) or intrinsic renal AKI with proportional urea retention.",
    intrinsic: "Ratio < 10:1 — Intrinsic Renal AKI / Low Urea States",
    intrinsicDesc: "Points toward intrinsic renal parenchymal injury such as acute tubular necrosis (ATN), acute interstitial nephritis (AIN), or glomerulonephritis. Can also be observed in severe liver failure/cirrhosis (reduced urea cycle synthesis), malnutrition/low-protein diet, or rhabdomyolysis.",
    references: "Baum N, Dichoso CC, Carlton CE Jr. Blood urea nitrogen and serum creatinine. Physiology and interpretations. Urology. 1975;5(5):583-588. (PMID: 1129990). KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138.",
    faqs: [
      {
        question: "Why does the BUN/Creatinine ratio rise above 20:1 in hypovolemia?",
        answer: "When renal perfusion falls, proximal tubular reabsorption of sodium and water increases under the influence of angiotensin II and aldosterone. Urea follows passively, leading to marked BUN retention. In contrast, creatinine is not reabsorbed by proximal tubules, creating an elevated BUN-to-creatinine ratio."
      },
      {
        question: "How does an upper GI bleed elevate the BUN/Cr ratio?",
        answer: "Digestion and absorption of red blood cells in the upper gastrointestinal tract acts as a substantial protein load, delivering excess amino acids to the liver which synthesizes massive amounts of urea, driving the ratio > 20–30:1 even in the absence of primary kidney damage."
      }
    ]
  },
  fr: {
    title: "Ratio Urée / Créatinine (BUN/Cr)",
    subtitle: "Différencie l'insuffisance rénale aiguë pré-rénale (fonctionnelle) de l'atteinte rénale organique",
    unitToggle: "Unités",
    usUnits: "Unités US (mg/dL)",
    siUnits: "Unités SI (mmol/L & µmol/L)",
    bunLabel: "Azote Uréique Sanguin (BUN)",
    ureaLabel: "Urée Plasmatique",
    crLabel: "Créatinine Sérique",
    resultTitle: "Ratio & Interprétation Diagnostique",
    ratioLabel: "Ratio Masse BUN / Créatinine",
    siRatioLabel: "Ratio Molaire Urée / Créatinine",
    points: ":1",
    prerenal: "Ratio > 20:1 — Insuffisance Rénale Fonctionnelle (Pré-rénale) / Hémorragie Digestive",
    prerenalDesc: "Évoque une hypoperfusion rénale (déshydratation, insuffisance cardiaque, sepsis, syndrome hépato-rénal) ou une hyperproduction d'urée (hémorragie digestive haute, corticothérapie forte dose, hypercatabolisme).",
    normal: "Ratio 10:1 – 20:1 — Valeur Normale / Obstruction Post-rénale",
    normalDesc: "Zone de référence standard. En présence d'une élévation de la créatinine, évoquer une insuffisance rénale aiguë obstructive (lithiase, hypertrophie prostatique) ou une atteinte organique équilibrée.",
    intrinsic: "Ratio < 10:1 — Atteinte Rénale Organique (NTA) / Insuffisance Hépatique",
    intrinsicDesc: "Évoque une nécrose tubulaire aiguë (NTA), une néphrite interstitielle ou une glomérulonéphrite. Peut également témoigner d'un défaut de synthèse de l'urée (insuffisance hépato-cellulaire sévère), dénutrition ou rhabdomyolyse.",
    references: "Baum N, et al. Blood urea nitrogen and serum creatinine. Urology. 1975;5(5):583-588. Recommandations KDIGO Insuffisance Rénale Aiguë 2012.",
    faqs: [
      {
        question: "Pourquoi le ratio augmente-t-il dans l'insuffisance fonctionnelle ?",
        answer: "La baisse de la perfusion rénale stimule la réabsorption tubulaire proximale de sodium et d'eau. L'urée est réabsorbée passivement en excès, alors que la créatinine n'est pas réabsorbée, ce qui fait bondir le ratio > 20:1."
      },
      {
        question: "Quel est l'impact d'une hémorragie digestive haute ?",
        answer: "La digestion du sang intra-luminal fournit un afflux massif de protéines métabolisées par le foie en urée, augmentant fortement le BUN/Urée sans altération initiale de la filtration de la créatinine."
      }
    ]
  }
};

export default function BunCreatinineRatio({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;

  const [isSi, setIsSi] = useState<boolean>(false);
  // US defaults: BUN 28 mg/dL, Cr 1.2 mg/dL
  const [bunVal, setBunVal] = useState<string>('28');
  const [crVal, setCrVal] = useState<string>('1.2');

  // SI defaults: Urea 10 mmol/L, Cr 106 µmol/L
  const [ureaSi, setUreaSi] = useState<string>('10');
  const [crSi, setCrSi] = useState<string>('106');

  const { ratioMass, ratioMolar } = useMemo(() => {
    let bunMgDl = 0;
    let crMgDl = 0;
    let ureaMmol = 0;
    let crUmol = 0;

    if (isSi) {
      ureaMmol = parseFloat(ureaSi) || 0;
      crUmol = parseFloat(crSi) || 0;
      // 1 mmol/L urea = 2.8 mg/dL BUN
      bunMgDl = ureaMmol * 2.8;
      // 1 mg/dL cr = 88.4 µmol/L
      crMgDl = crUmol > 0 ? crUmol / 88.4 : 0;
    } else {
      bunMgDl = parseFloat(bunVal) || 0;
      crMgDl = parseFloat(crVal) || 0;
      ureaMmol = bunMgDl / 2.8;
      crUmol = crMgDl * 88.4;
    }

    const mass = crMgDl > 0 ? bunMgDl / crMgDl : 0;
    const molar = crUmol > 0 ? (ureaMmol * 1000) / crUmol : 0;

    return {
      ratioMass: Math.round(mass * 10) / 10,
      ratioMolar: Math.round(molar * 10) / 10
    };
  }, [isSi, bunVal, crVal, ureaSi, crSi]);

  const diagnosticTier = useMemo(() => {
    if (ratioMass > 20) {
      return { tier: 'prerenal', title: t.prerenal, desc: t.prerenalDesc, color: 'amber' };
    }
    if (ratioMass >= 10) {
      return { tier: 'normal', title: t.normal, desc: t.normalDesc, color: 'emerald' };
    }
    return { tier: 'intrinsic', title: t.intrinsic, desc: t.intrinsicDesc, color: 'rose' };
  }, [ratioMass, t]);

  useEffect(() => {
    trackCalculatorUsage('bun-creatinine-ratio', lang, ratioMass);
  }, [ratioMass, ratioMolar, diagnosticTier.tier, lang]);

  const exportInputs = isSi ? {
    [t.ureaLabel]: `${ureaSi} mmol/L`,
    [t.crLabel]: `${crSi} µmol/L`,
  } : {
    [t.bunLabel]: `${bunVal} mg/dL`,
    [t.crLabel]: `${crVal} mg/dL`,
  };
  const toExportList = (obj: Record<string, any>) => Object.entries(obj).map(([label, value]) => ({ label, value: String(value) }));


  const exportResults = {
    [t.ratioLabel]: `${ratioMass}:1`,
    [t.siRatioLabel]: `${ratioMolar}:1`,
    [t.resultTitle]: diagnosticTier.title
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CalcPageSchemas
        name={t.title}
        description={t.subtitle}
        path="/bun-creatinine-ratio"
        howToSteps={[
          "Step 1: Select preferred measurement units (US mg/dL or SI mmol/L & µmol/L).",
          "Step 2: Enter serum BUN (or blood urea) and serum creatinine values.",
          "Step 3: Interpret ratio: >20:1 indicates prerenal azotemia or GI bleeding; 10–20:1 is normal/postrenal; <10:1 points to intrinsic renal injury."
        ]}
        faqs={t.faqs}
      />

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 rounded-xl text-sky-600 dark:text-sky-400">
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
                !isSi ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.usUnits}
            </button>
            <button
              type="button"
              onClick={() => setIsSi(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isSi ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'
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
                  {t.bunLabel} (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={bunVal}
                  onChange={(e) => setBunVal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.crLabel} (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={crVal}
                  onChange={(e) => setCrVal(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-lg font-medium"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.ureaLabel} (mmol/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={ureaSi}
                  onChange={(e) => setUreaSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-lg font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {t.crLabel} (µmol/L)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={crSi}
                  onChange={(e) => setCrSi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 text-lg font-medium"
                />
              </div>
            </>
          )}
        </div>

        {/* Results Box */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          diagnosticTier.color === 'emerald'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : diagnosticTier.color === 'amber'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t.resultTitle}</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{ratioMass}</span>
                <span className="text-xl text-slate-600 dark:text-slate-300 font-bold">{t.points}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">
                  (Molar: {ratioMolar}:1)
                </span>
              </div>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 ${
                diagnosticTier.color === 'emerald'
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                  : diagnosticTier.color === 'amber'
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
              }`}>
                {diagnosticTier.tier === 'prerenal' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                {diagnosticTier.tier.toUpperCase()}
              </span>
            </div>
          </div>

          <h3 className="mt-4 font-bold text-slate-900 dark:text-white text-base">
            {diagnosticTier.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {diagnosticTier.desc}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            <ClinicalExportButton
              calculatorName="BUN / Creatinine Ratio Calculator"
              inputs={toExportList(exportInputs)}
              results={toExportList(exportResults)}
              formula="BUN/Cr Ratio = BUN (mg/dL) / Creatinine (mg/dL)"
              disclaimer="Clinical diagnostic aid. Must be interpreted in context of volume status, medications, and urinary indices (FENa/FEUrea)."
              references={t.references}
              lang={lang}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />
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
