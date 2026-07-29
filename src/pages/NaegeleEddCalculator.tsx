import React, { useState, useMemo, useEffect } from 'react';
import { HeartPulse, Calendar, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Naegele's Rule EDD & Gestational Age Calculator",
    subtitle: "Calculate Estimated Date of Delivery (EDD) and current gestational age from Last Menstrual Period (LMP)",
    lmpLabel: "First Day of Last Menstrual Period (LMP)",
    cycleLength: "Average Cycle Length (Days)",
    eddTitle: "Estimated Date of Delivery (EDD)",
    gaTitle: "Current Gestational Age",
    trimesterTitle: "Current Trimester",
    weeks: "weeks",
    days: "days",
    trimester1: "1st Trimester (0 - 13+6 weeks)",
    trimester2: "2nd Trimester (14 - 27+6 weeks)",
    trimester3: "3rd Trimester (28+ weeks)",
    formulaTitle: "Naegele's Rule Formula",
    formulaText: "EDD = LMP + 1 Year - 3 Months + 7 Days + (Cycle Length - 28 Days)",
    references: "References: Naegele FC. Lehrbuch der Geburtshülfe 1830; ACOG Committee Opinion No. 700: Methods for Estimating Due Date 2017.",
  },
  fr: {
    title: "Calculateur de Terme (Règle de Naegele) & Âge Gestationnel",
    subtitle: "Date présumée d'accouchement (DPA) et âge gestationnel actuel à partir de la date des dernières règles (DDR)",
    lmpLabel: "Premier jour des dernières règles (DDR)",
    cycleLength: "Durée moyenne du cycle (jours)",
    eddTitle: "Date Présumée d'Accouchement (DPA)",
    gaTitle: "Âge Gestationnel Actuel",
    trimesterTitle: "Trimestre Actuel",
    weeks: "semaines",
    days: "jours",
    trimester1: "1er Trimestre (0 - 13+6 SA)",
    trimester2: "2e Trimestre (14 - 27+6 SA)",
    trimester3: "3e Trimestre (28+ SA)",
    formulaTitle: "Formule de la Règle de Naegele",
    formulaText: "DPA = DDR + 1 An - 3 Mois + 7 Jours + (Durée du cycle - 28 Jours)",
    references: "Références : Naegele FC 1830 ; Recommandations ACOG No. 700 sur l'estimation du terme 2017.",
  }
};

export default function NaegeleEddCalculator({ lang }: { lang: LangCode }) {
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // Default ~10 weeks ago
    return d.toISOString().split('T')[0];
  });
  const [cycleDays, setCycleDays] = useState<number>(28);
  const t = translations[lang];

  const { eddFormatted, totalDays, weeks, remDays, trimester } = useMemo(() => {
    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) {
      return { eddFormatted: '--', totalDays: 0, weeks: 0, remDays: 0, trimester: '--' };
    }

    const cycleAdjustment = cycleDays - 28;
    const edd = new Date(lmp);
    edd.setFullYear(edd.getFullYear() + 1);
    edd.setMonth(edd.getMonth() - 3);
    edd.setDate(edd.getDate() + 7 + cycleAdjustment);

    const now = new Date();
    const diffTime = now.getTime() - lmp.getTime();
    const daysPassed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const w = Math.floor(daysPassed / 7);
    const d = daysPassed % 7;

    let tri = t.trimester1;
    if (w >= 28) tri = t.trimester3;
    else if (w >= 14) tri = t.trimester2;

    return {
      eddFormatted: edd.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      totalDays: daysPassed,
      weeks: w,
      remDays: d,
      trimester: tri,
    };
  }, [lmpDate, cycleDays, lang, t]);

  useEffect(() => {
    trackCalculatorUsage('NaegeleEddCalculator', lang, weeks);
  }, [lang, weeks]);

  const ehrSummary = `OB/GYN Naegele EDD: LMP ${lmpDate} (Cycle ${cycleDays}d) -> EDD: ${eddFormatted} | Current GA: ${weeks}w + ${remDays}d (${trimester})`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/naegele-edd-calculator" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.lmpLabel}</label>
            <input
              type="date"
              value={lmpDate}
              onChange={(e) => setLmpDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.cycleLength}</label>
            <input
              type="number"
              min="20"
              max="45"
              step="1"
              value={cycleDays}
              onChange={(e) => setCycleDays(parseInt(e.target.value) || 28)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-xs font-mono font-bold uppercase text-rose-800">{t.eddTitle}</span>
            <div className="text-xl font-black text-rose-950 mt-1">{eddFormatted}</div>
          </div>
          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200">
            <span className="text-xs font-mono font-bold uppercase text-teal-800">{t.gaTitle}</span>
            <div className="text-2xl font-black text-teal-950 mt-1">{weeks} <span className="text-sm font-bold text-teal-700">{t.weeks}</span> + {remDays} <span className="text-sm font-bold text-teal-700">{t.days}</span></div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono font-bold uppercase text-slate-600">{t.trimesterTitle}</span>
            <div className="text-sm font-black text-slate-900 mt-2">{trimester}</div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600" />
            {t.formulaTitle}
          </h3>
          <p className="font-mono text-[11px] text-slate-700">{t.formulaText}</p>
          <p className="font-mono text-[11px] text-slate-400 mt-2">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
