import React, { useState, useMemo, useEffect } from 'react';
import { Droplet, Info, BookOpen } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Holliday-Segar Pediatric Maintenance Fluids (4-2-1 Rule)",
    subtitle: "Standard pediatric fluid maintenance rate and electrolyte requirement calculation",
    weightLabel: "Child Body Weight (kg)",
    dailyRate: "Total 24-Hour Maintenance Fluid",
    hourlyRate: "Hourly Maintenance Fluid Rate",
    naReq: "Daily Sodium (Na+) Requirement",
    kReq: "Daily Potassium (K+) Requirement",
    rule1: "1st 10 kg: 100 mL/kg/day (4 mL/kg/hr)",
    rule2: "2nd 10 kg (11-20 kg): + 50 mL/kg/day (+ 2 mL/kg/hr)",
    rule3: "Above 20 kg: + 20 mL/kg/day (+ 1 mL/kg/hr)",
    clinicalTitle: "Clinical Notes & Fluid Choice",
    clinicalText: "Standard maintenance solution for pediatric inpatients is isotonic fluids (e.g., D5 0.9% NS or D5 0.45% NS with 20 mEq KCl/L). Hypotonic fluids (0.2% NS) should be avoided due to hospital-acquired hyponatremia risk.",
    references: "References: Holliday MA, Segar WE. The maintenance requirement for water in parenteral fluid therapy. Pediatrics 1957; AAP Clinical Practice Guideline on Isotonic IV Maintenance Fluids 2018.",
  },
  fr: {
    title: "Apports Hydriques Pédiatriques (Règle d'Holliday-Segar 4-2-1)",
    subtitle: "Calcul du débit de perfusion d'entretien et des besoins électrolytiques en pédiatrie",
    weightLabel: "Poids de l'enfant (kg)",
    dailyRate: "Liquide d'entretien total (24 heures)",
    hourlyRate: "Débit horaire d'entretien",
    naReq: "Besoin quotidien en Sodium (Na+)",
    kReq: "Besoin quotidien en Potassium (K+)",
    rule1: "1ers 10 kg : 100 mL/kg/jour (4 mL/kg/h)",
    rule2: "2es 10 kg (11-20 kg) : + 50 mL/kg/jour (+ 2 mL/kg/h)",
    rule3: "Au-dessus de 20 kg : + 20 mL/kg/jour (+ 1 mL/kg/h)",
    clinicalTitle: "Remarques Cliniques & Choix du Soluté",
    clinicalText: "La solution d'entretien recommandée chez l'enfant hospitalisé est un soluté isotonique (ex: G5% NaCl 0,9% + 20 mEq KCl/L). Les solutés hypotoniques (0,2% NaCl) sont déconseillés en raison du risque d'hyponatramie nosocomiale.",
    references: "Références : Holliday MA, Segar WE. Pediatrics 1957 ; Recommandations AAP sur les solutés isotoniques pédiatriques 2018.",
  }
};

export default function HollidaySegarFluids({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<number>(14);
  const t = translations[lang] || translations.en;

  const { hourly, daily, naMin, naMax, kMin, kMax } = useMemo(() => {
    const w = Math.max(0.5, weight);
    let h = 0;
    let d = 0;

    if (w <= 10) {
      d = w * 100;
      h = w * 4;
    } else if (w <= 20) {
      d = 1000 + (w - 10) * 50;
      h = 40 + (w - 10) * 2;
    } else {
      d = 1500 + (w - 20) * 20;
      h = 60 + (w - 20) * 1;
    }

    return {
      hourly: Math.round(h * 10) / 10,
      daily: Math.round(d),
      naMin: Math.round(w * 2),
      naMax: Math.round(w * 3),
      kMin: Math.round(w * 1),
      kMax: Math.round(w * 2),
    };
  }, [weight]);

  useEffect(() => {
    trackCalculatorUsage('HollidaySegarFluids', lang, hourly);
  }, [lang, hourly]);

  const ehrSummary = `Pediatric Fluid Maintenance (Holliday-Segar): Wt ${weight}kg -> Hourly: ${hourly} mL/hr | 24h Total: ${daily} mL/day | Na+: ${naMin}-${naMax} mEq/day | K+: ${kMin}-${kMax} mEq/day`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/holliday-segar-fluids" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-full max-w-xs mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.weightLabel}</label>
          <input
            type="number" inputMode="decimal"
            min="0.5"
            max="120"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full p-3 rounded-xl border border-slate-300 font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200">
            <span className="text-xs font-mono font-bold uppercase text-cyan-800">{t.hourlyRate}</span>
            <div className="text-3xl font-black text-cyan-950 mt-1">{hourly} <span className="text-sm font-bold text-cyan-700">mL / hr</span></div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono font-bold uppercase text-slate-600">{t.dailyRate}</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{daily} <span className="text-sm font-bold text-slate-500">mL / 24h</span></div>
          </div>
        </div>

        {/* Electrolytes */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">{t.naReq}:</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{naMin} - {naMax} mEq / day</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">{t.kReq}:</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{kMin} - {kMax} mEq / day</div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-slate-500">
            <li>{t.rule1}</li>
            <li>{t.rule2}</li>
            <li>{t.rule3}</li>
          </ul>
          <p className="font-mono text-[11px] text-slate-400 mt-2">{t.references}</p>
        </div>
      </div>
    </div>
  );
}

