import React, { useState, useMemo, useEffect } from 'react';
import { Pill, Info } from 'lucide-react';
import { LangCode, Translations } from '../types';
import SEO from '../components/SEO';
import { JsonLd } from '../components/JsonLd';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { trackCalculatorUsage } from '../utils/telemetry';

const translations: Translations = {
  en: {
    title: "Pediatric Weight & BSA Dosage Calculator",
    subtitle: "Precise mg/kg and Body Surface Area (BSA) pediatric drug dosing calculator",
    weight: "Weight (kg)",
    height: "Height (cm)",
    dosePerKg: "Target Dose (mg / kg)",
    frequency: "Dosing Frequency",
    once: "Single / Total Daily Dose",
    bid: "BID (Twice Daily - q12h)",
    tid: "TID (Three times Daily - q8h)",
    qid: "QID (Four times Daily - q6h)",
    concentration: "Liquid Concentration (mg / mL) - Optional",
    bsaResult: "Body Surface Area (BSA)",
    singleDose: "Dose Per Administration",
    dailyTotal: "Total Daily Dose",
    volumeDose: "Liquid Volume Per Dose",
    clinicalTitle: "Safety Warning & Max Adult Doses",
    clinicalText: "Always verify pediatric dose against manufacturer maximum adult dose (e.g. Paracetamol max 1g/dose or 4g/day; Amoxicillin max 1g/dose). Never exceed adult maximums regardless of pediatric weight calculations.",
    references: "References: Mosteller RD. Simplified calculation of body-surface area. N Engl J Med 1987; Harriet Lane Handbook 22nd Ed.",
  },
  fr: {
    title: "Calculateur de Posologie Pédiatrique (mg/kg & Surface Corporelle)",
    subtitle: "Calculateur précis de dosage médicamenteux pédiatrique par mg/kg et surface corporelle (BSA)",
    weight: "Poids (kg)",
    height: "Taille (cm)",
    dosePerKg: "Dose cible (mg / kg)",
    frequency: "Fréquence d'administration",
    once: "Dose unique / quotidienne totale",
    bid: "2 fois par jour (BID - q12h)",
    tid: "3 fois par jour (TID - q8h)",
    qid: "4 fois par jour (QID - q6h)",
    concentration: "Concentration du sirop (mg / mL) - Optionnel",
    bsaResult: "Surface Corporelle (BSA)",
    singleDose: "Dose par prise",
    dailyTotal: "Dose quotidienne totale",
    volumeDose: "Volume à administrer par prise",
    clinicalTitle: "Avertissement de Sécurité & Doses Maximale Adulte",
    clinicalText: "Toujours vérifier que la dose pédiatrique calculée ne dépasse pas la dose maximale adulte (ex: Paracétamol max 1g/prise et 4g/j ; Amoxicilline max 1g/prise). Ne jamais dépasser la dose maximale adulte quel que soit le poids.",
    references: "Références : Mosteller RD. N Engl J Med 1987 ; Manuel Harriet Lane 22e Édition.",
  }
};

export default function PediatricDosage({ lang }: { lang: LangCode }) {
  const [weight, setWeight] = useState<number>(15);
  const [height, setHeight] = useState<number>(98);
  const [dosePerKg, setDosePerKg] = useState<number>(15);
  const [freq, setFreq] = useState<number>(4); // QID
  const [conc, setConc] = useState<number>(24); // e.g. 120mg/5mL = 24mg/mL
  const t = translations[lang];

  const { bsa, totalDailyMg, singleMg, volumeMl } = useMemo(() => {
    const w = Math.max(0.5, weight);
    const h = Math.max(20, height);
    
    // Mosteller formula: BSA = sqrt( (ht * wt) / 3600 )
    const bsaVal = Math.sqrt((h * w) / 3600);
    const totalDaily = w * dosePerKg;
    const single = totalDaily / Math.max(1, freq);
    const vol = conc > 0 ? single / conc : 0;

    return {
      bsa: Math.round(bsaVal * 100) / 100,
      totalDailyMg: Math.round(totalDaily * 10) / 10,
      singleMg: Math.round(single * 10) / 10,
      volumeMl: Math.round(vol * 10) / 10,
    };
  }, [weight, height, dosePerKg, freq, conc]);

  useEffect(() => {
    trackCalculatorUsage('PediatricDosage', lang, singleMg);
  }, [lang, singleMg]);

  const ehrSummary = `Pediatric Dose: Wt ${weight}kg, Ht ${height}cm (BSA ${bsa}m2) -> Dose: ${singleMg}mg per dose (${volumeMl > 0 ? volumeMl + 'mL' : 'mg'}) q${24/freq}h | Total Daily: ${totalDailyMg}mg/day`;

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto space-y-8 pb-12">
      <SEO logicalPath="/pediatric-dosage" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": ["SoftwareApplication", "MedicalWebPage"],
        "name": t.title,
        "description": t.subtitle,
      }} />

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.weight}</label>
            <input
              type="number"
              min="0.5"
              max="120"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.height}</label>
            <input
              type="number"
              min="20"
              max="220"
              step="1"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.dosePerKg}</label>
            <input
              type="number"
              min="0.1"
              max="500"
              step="0.5"
              value={dosePerKg}
              onChange={(e) => setDosePerKg(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.frequency}</label>
            <select
              value={freq}
              onChange={(e) => setFreq(parseInt(e.target.value))}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value={1}>{t.once}</option>
              <option value={2}>{t.bid}</option>
              <option value={3}>{t.tid}</option>
              <option value={4}>{t.qid}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">{t.concentration}</label>
            <input
              type="number"
              min="0"
              max="500"
              step="1"
              value={conc}
              onChange={(e) => setConc(parseFloat(e.target.value) || 0)}
              className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="text-xs font-mono font-bold uppercase text-purple-800">{t.singleDose}</span>
            <div className="text-3xl font-black text-purple-950 mt-1">{singleMg} <span className="text-sm font-bold text-purple-700">mg</span></div>
          </div>
          {conc > 0 && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800">{t.volumeDose}</span>
              <div className="text-3xl font-black text-emerald-950 mt-1">{volumeMl} <span className="text-sm font-bold text-emerald-700">mL</span></div>
            </div>
          )}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-mono font-bold uppercase text-slate-600">{t.bsaResult}</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{bsa} <span className="text-sm font-bold text-slate-500">m²</span></div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-8 space-y-3 text-xs text-slate-600 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" />
            {t.clinicalTitle}
          </h3>
          <p>{t.clinicalText}</p>
          <p className="font-mono text-[11px] text-slate-400">{t.references}</p>
        </div>
      </div>
    </div>
  );
}
