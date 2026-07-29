import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Bedside Schwartz Pediatric eGFR Calculator",
    subtitle: "Revised Bedside Schwartz equation for estimating Glomerular Filtration Rate (eGFR) in infants & children",
    heightLabel: "Child Height (cm)",
    scrLabel: "Serum Creatinine",
    unitLabel: "Creatinine Unit",
    result: "Calculated Pediatric eGFR",
    unitResult: "mL / min / 1.73 m²",
    normalGfr: "Normal Pediatric Kidney Function (eGFR ≥ 90)",
    mildGfr: "Mildly Decreased eGFR (60 - 89)",
    modGfr: "Moderately Decreased eGFR (30 - 59)",
    sevGfr: "Severely Decreased eGFR / Kidney Failure (< 30)",
    formulaTitle: "Bedside Schwartz Formula",
    formulaText: "eGFR = 0.413 × Height (cm) / Serum Creatinine (mg/dL) [Valid for age 1 to 18 years]",
    references: "References: Schwartz GJ et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol 2009; KDIGO CKD Guidelines 2024.",
  },
  fr: {
    title: "Calculateur de DFG Pédiatrique (Formule de Schwartz au Lit du Malade)",
    subtitle: "Formule de Schwartz révisée (2009) pour estimer le débit de filtration glomérulaire (DFG) chez l'enfant",
    heightLabel: "Taille de l'enfant (cm)",
    scrLabel: "Créatinine sérique",
    unitLabel: "Unité de créatinine",
    result: "DFG Pédiatrique Calculé",
    unitResult: "mL / min / 1,73 m²",
    normalGfr: "Fonction rénal pédiatrique normale (DFG ≥ 90)",
    mildGfr: "Diminution légère du DFG (60 - 89)",
    modGfr: "Diminution modérée du DFG (30 - 59)",
    sevGfr: "Diminution sévère / Insuffisance rénale (< 30)",
    formulaTitle: "Formule de Schwartz Révisée (2009)",
    formulaText: "DFG = 0,413 × Taille (cm) / Créatinine sérique (mg/dL) [Valide de 1 à 18 ans]",
    references: "Références : Schwartz GJ et al. J Am Soc Nephrol 2009 ; Recommandations KDIGO 2024.",
  }
};

export default function SchwartzGfr({ lang }: { lang: LangCode }) {
  const [height, setHeight] = useState<number>(110);
  const [scr, setScr] = useState<number>(0.6);
  const [unit, setUnit] = useState<'mg' | 'umol'>('mg');
  const t = translations[lang];

  const { egfr, category } = useMemo(() => {
    const h = Math.max(30, height);
    const scrMg = unit === 'umol' ? scr / 88.4 : scr;
    const val = scrMg > 0 ? (0.413 * h) / scrMg : 0;
    const roundEgfr = Math.round(val * 10) / 10;

    let cat = t.normalGfr;
    let color = 'bg-emerald-50 text-emerald-900 border-emerald-200';
    if (roundEgfr < 30) {
      cat = t.sevGfr;
      color = 'bg-rose-50 text-rose-900 border-rose-200';
    } else if (roundEgfr < 60) {
      cat = t.modGfr;
      color = 'bg-amber-50 text-amber-900 border-amber-200';
    } else if (roundEgfr < 90) {
      cat = t.mildGfr;
      color = 'bg-teal-50 text-teal-900 border-teal-200';
    }

    return { egfr: roundEgfr, category: { text: cat, color } };
  }, [height, scr, unit, t]);

  useEffect(() => {
    trackCalculatorUsage('SchwartzGfr', lang, egfr);
  }, [lang, egfr]);

  const ehrSummary = `Pediatric eGFR (Bedside Schwartz): Ht ${height}cm, SCr ${scr}${unit} -> eGFR: ${egfr} mL/min/1.73m2 (${category.text})`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/schwartz-pediatric-gfr" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.heightLabel}</label>
            <input
              type="number"
              min="30"
              max="200"
              step="1"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 100)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.scrLabel}</label>
            <input
              type="number"
              min="0.1"
              max="15"
              step="0.05"
              value={scr}
              onChange={(e) => setScr(parseFloat(e.target.value) || 0.5)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.unitLabel}</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
            >
              <option value="mg">mg / dL</option>
              <option value="umol">µmol / L</option>
            </select>
          </div>
        </div>

        {/* Output */}
        <div className={`p-6 rounded-2xl border ${category.color} space-y-4`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
              <div className="text-4xl font-black tracking-tight">{egfr} <span className="text-sm font-bold opacity-75">{t.unitResult}</span></div>
              <div className="text-sm font-extrabold mt-1">{category.text}</div>
            </div>
            <ClinicalExportButton
              calculatorName={t.title}
              inputs={[
                { label: t.heightLabel, value: height },
                { label: t.scrLabel, value: `${scr} ${unit}` }
              ]}
              results={[{ label: t.result, value: `${egfr} ${t.unitResult} (${category.text})` }]}
              lang={lang}
            />
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-600" />
            {t.formulaTitle}
          </h3>
          <p className="font-mono text-[11px] text-slate-700">{t.formulaText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
