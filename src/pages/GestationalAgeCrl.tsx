import React, { useState, useMemo, useEffect } from 'react';
import { Activity, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Gestational Age from Crown-Rump Length (CRL)",
    subtitle: "Accurate first-trimester ultrasound dating based on Robinson & Fleming equation",
    crlLabel: "Crown-Rump Length (CRL in mm)",
    gaResult: "Estimated Gestational Age",
    weeks: "weeks",
    days: "days",
    accuracyNote: "Accuracy: ± 3 to 5 days (most accurate ultrasound dating parameter in 1st trimester)",
    clinicalTitle: "Ultrasound Dating Guidance (ACOG / ISUOG)",
    clinicalText: "CRL ultrasound measurement is most reliable between 6+0 and 13+6 weeks (CRL 10mm to 84mm). If the discrepancy between LMP and CRL dating is > 5 days in early 1st trimester, due date should be adjusted to ultrasound CRL date.",
    references: "References: Robinson HP, Fleming JE. A critical evaluation of sonar crown-rump length measurements. Br J Obstet Gynaecol 1975; ACOG Committee Opinion No. 700.",
  },
  fr: {
    title: "Âge Gestationnel par Longueur Cranio-Caudale (LCC / CRL)",
    subtitle: "Datation échographique précise du 1er trimestre selon l'équation de Robinson & Fleming",
    crlLabel: "Longueur Cranio-Caudale (LCC / CRL en mm)",
    gaResult: "Âge Gestationnel Estimé",
    weeks: "semaines (SA)",
    days: "jours",
    accuracyNote: "Précision : ± 3 à 5 jours (paramètre de datation échographique le plus précis au 1er trimestre)",
    clinicalTitle: "Recommandations de Datation Échographique (CNGOF / ACOG)",
    clinicalText: "La mesure de la LCC est valide entre 6+0 et 13+6 SA (LCC de 10 mm à 84 mm). Si le décalage entre la date des règles et la LCC est > 5 jours au 1er trimestre précoce, la DPA doit être réévaluée selon la LCC.",
    references: "Références : Robinson HP, Fleming JE 1975 ; Recommandations CNGOF & ACOG No. 700.",
  }
};

export default function GestationalAgeCrl({ lang }: { lang: LangCode }) {
  const [crlMm, setCrlMm] = useState<number>(35);
  const t = translations[lang] || translations.en;

  const { weeks, days, totalDays } = useMemo(() => {
    const crl = Math.max(2, Math.min(120, crlMm));
    // Robinson equation: GA (days) = 8.052 * sqrt(CRL_mm * 1.037) + 23.73
    const gaDays = Math.round(8.052 * Math.sqrt(crl * 1.037) + 23.73);
    const w = Math.floor(gaDays / 7);
    const d = gaDays % 7;

    return { weeks: w, days: d, totalDays: gaDays };
  }, [crlMm]);

  useEffect(() => {
    trackCalculatorUsage('GestationalAgeCrl', lang, weeks);
  }, [lang, weeks]);

  const ehrSummary = `Ultrasound CRL Dating: CRL ${crlMm}mm -> Estimated GA: ${weeks}w + ${days}d (Accuracy +/-3-5d)`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/gestational-age-crl" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Input */}
        <div className="w-full max-w-full max-w-xs mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.crlLabel}</label>
          <input
            type="number"
            min="2"
            max="120"
            step="1"
            value={crlMm}
            onChange={(e) => setCrlMm(parseFloat(e.target.value) || 0)}
            className="w-full p-3 rounded-xl border border-slate-300 font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Output */}
        <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200">
          <span className="text-xs font-mono font-bold uppercase text-teal-800">{t.gaResult}</span>
          <div className="text-4xl font-black text-teal-950 mt-1">{weeks} <span className="text-lg font-bold text-teal-700">{t.weeks}</span> + {days} <span className="text-lg font-bold text-teal-700">{t.days}</span></div>
          <div className="text-xs text-teal-700 font-semibold mt-2">{t.accuracyNote}</div>
        </div>

        {/* Clinical Guidance */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
