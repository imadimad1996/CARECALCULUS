import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Rumack-Matthew Nomogram for Acetaminophen Toxicity",
    subtitle: "Evaluates risk of hepatotoxicity following acute single-ingestion paracetamol/acetaminophen overdose",
    hoursLabel: "Time Post-Ingestion (Hours)",
    concLabel: "Serum Acetaminophen Concentration",
    unitLabel: "Concentration Unit",
    result: "Toxicity Risk Assessment",
    treatLine: "ABOVE Treatment Line: High risk of hepatotoxicity. INITIATE N-ACETYLCYSTEINE (NAC) IMMEDIATELY.",
    safeLine: "BELOW Treatment Line: Low risk of hepatotoxicity. NAC usually not indicated unless time/ingestion details uncertain.",
    invalidTime: "Nomogram valid only for acute single ingestions between 4 and 24 hours post-ingestion.",
    clinicalTitle: "Emergency Treatment & Antidote Protocol",
    clinicalText: "If ingestion occurred < 4 hours ago, administer activated charcoal (1g/kg) and re-draw APAP level at 4 hours. Do not delay NAC therapy while awaiting APAP level if > 8 hours have elapsed post-ingestion. Standard NAC protocol: IV 21-hour infusion or 72-hour oral protocol.",
    references: "References: Rumack BH, Matthew H. Acetaminophen poisoning and toxicity. Pediatrics 1975; Dart RC et al. N-acetylcysteine for acetaminophen poisoning. N Engl J Med 2007.",
  },
  fr: {
    title: "Nomogramme de Rumack-Matthew (Intoxication au Paracétamol)",
    subtitle: "Évalue le risque d'hépatotoxicité après surdosage aigu en prise unique de paracétamol",
    hoursLabel: "Temps depuis l'ingestion (Heures)",
    concLabel: "Concentration sérique de paracétamol",
    unitLabel: "Unité de mesure",
    result: "Évaluation du Risque de Toxicité",
    treatLine: "AU-DESSUS de la ligne de traitement : Risque élevé d'hépatotoxicité. DEBUTER N-ACETYL-CYSTEINE (NAC) EN URGENCE.",
    safeLine: "EN-DESSOUS de la ligne de traitement : Risque faible. NAC non indiquée sauf doute sur l'heure ou la prise.",
    invalidTime: "Le nomogramme est valide uniquement pour les ingestions aiguës uniques entre 4 et 24 heures.",
    clinicalTitle: "Protocole d'Urgence & Antidote (NAC)",
    clinicalText: "Si l'ingestion date de < 4h, administrer du charbon activé (1g/kg) et contrôler la paracétamolémie à H4. Ne pas retarder la NAC au-delà de H8 en attendant le résultat de la paracétamolémie. Protocole NAC IV sur 21h ou oral sur 72h.",
    references: "Références : Rumack BH, Matthew H. Pediatrics 1975 ; Recommandations SRLF/SFMU Intoxication Paracétamol.",
  }
};

export default function RumackMatthewNomogram({ lang }: { lang: LangCode }) {
  const [hours, setHours] = useState<number>(6);
  const [conc, setConc] = useState<number>(180);
  const [unit, setUnit] = useState<'mcg' | 'umol'>('mcg');
  const t = translations[lang];

  const { isAboveLine, isValidTime, concMcg, thresholdMcg } = useMemo(() => {
    const valid = hours >= 4 && hours <= 24;
    const valMcg = unit === 'umol' ? conc / 6.614 : conc;
    
    // Treatment line starts at 150 mcg/mL at 4h, halves every 4 hours (half-life 4h line)
    // Formula for treatment line (US 150-line): threshold = 150 * (0.5 ^ ((hours - 4) / 4))
    const thresh = 150 * Math.pow(0.5, (hours - 4) / 4);

    return {
      isAboveLine: valMcg >= thresh,
      isValidTime: valid,
      concMcg: Math.round(valMcg * 10) / 10,
      thresholdMcg: Math.round(thresh * 10) / 10,
    };
  }, [hours, conc, unit]);

  useEffect(() => {
    trackCalculatorUsage('RumackMatthewNomogram', lang, conc);
  }, [lang, conc]);

  const ehrSummary = `Rumack-Matthew Paracetamol Toxicity: ${hours}h post-ingestion, APAP level ${conc} ${unit} (${concMcg} mcg/mL vs threshold ${thresholdMcg} mcg/mL) -> ${isAboveLine ? 'ABOVE TREATMENT LINE - INITIATE NAC' : 'Below treatment line'}`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/rumack-matthew-nomogram" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.hoursLabel}</label>
            <input
              type="number"
              min="1"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 4)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.concLabel}</label>
            <input
              type="number"
              min="0"
              max="1000"
              step="1"
              value={conc}
              onChange={(e) => setConc(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.unitLabel}</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="mcg">mcg / mL (mg / L)</option>
              <option value="umol">µmol / L</option>
            </select>
          </div>
        </div>

        {/* Output */}
        {!isValidTime ? (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-sm">
            ⚠️ {t.invalidTime}
          </div>
        ) : (
          <div className={`p-6 rounded-2xl border ${isAboveLine ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-emerald-50 border-emerald-300 text-emerald-950'} space-y-4`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider">{t.result}</span>
                <div className="text-xl font-black mt-1">
                  {isAboveLine ? t.treatLine : t.safeLine}
                </div>
                <div className="text-xs font-mono mt-2 opacity-80">
                  Patient APAP: {concMcg} µg/mL | Treatment Cutoff at {hours}h: {thresholdMcg} µg/mL
                </div>
              </div>
              <ClinicalExportButton
                calculatorName={t.title}
                inputs={[
                  { label: t.hoursLabel, value: hours },
                  { label: t.concLabel, value: `${conc} ${unit}` }
                ]}
                results={[{ label: t.result, value: isAboveLine ? t.treatLine : t.safeLine }]}
                lang={lang}
              />
            </div>
          </div>
        )}

        {/* Emergency Note */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
