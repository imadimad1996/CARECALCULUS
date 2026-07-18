import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Pill } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function PhenytoinCorrection({ lang }: { lang: LangCode }) {
  const [measuredPhenytoin, setMeasuredPhenytoin] = useState<number | ''>('');
  const [albumin, setAlbumin] = useState<number | ''>('');
  const [isEsrd, setIsEsrd] = useState(false);

  const t = {
    en: {
      title: 'Phenytoin Correction',
      desc: 'Adjusts total phenytoin levels in hypoalbuminemia or renal failure.',
      measuredPhenytoin: 'Measured Phenytoin (mcg/mL)',
      albumin: 'Albumin (g/dL)',
      esrd: 'End Stage Renal Disease (CrCl < 10 mL/min)?',
      resultLabel: 'Corrected Phenytoin',
      unit: 'mcg/mL',
      formula: 'Corrected Phenytoin = Measured / ((Multiplier × Albumin) + 0.1)\nMultiplier = 0.2 (normal), 0.1 (ESRD)',
      interpretation: 'Normal therapeutic range for total phenytoin is typically 10-20 mcg/mL. In patients with low albumin or severe renal failure, the free (active) fraction of phenytoin increases, making the measured total level falsely low.'
    },
    fr: {
      title: 'Correction de la Phénytoïne',
      desc: 'Ajuste les taux de phénytoïne totale en cas d\'hypoalbuminémie ou d\'insuffisance rénale.',
      measuredPhenytoin: 'Phénytoïne mesurée (mcg/mL)',
      albumin: 'Albumine (g/dL)',
      esrd: 'Insuffisance Rénale Terminale (ClCr < 10 mL/min) ?',
      resultLabel: 'Phénytoïne Corrigée',
      unit: 'mcg/mL',
      formula: 'Phénytoïne corrigée = Mesurée / ((Multiplicateur × Albumine) + 0.1)\nMultiplicateur = 0.2 (normal), 0.1 (IRT)',
      interpretation: 'La plage thérapeutique normale de la phénytoïne totale est typiquement de 10-20 mcg/mL. Chez les patients ayant une faible albumine ou une insuffisance rénale sévère, la fraction libre (active) augmente, rendant le taux total mesuré faussement bas.'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    if (measuredPhenytoin === '' || albumin === '') return null;
    const p = Number(measuredPhenytoin);
    const a = Number(albumin);
    if (a <= 0 || p < 0) return null;

    const multiplier = isEsrd ? 0.1 : 0.2;
    const corrected = p / ((multiplier * a) + 0.1);
    return corrected.toFixed(1);
  };

  const result = calculate();

  return (
    <CalculatorShell logicalPath="/phenytoin-correction" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Pill className="w-8 h-8 text-[#0891B2]" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.measuredPhenytoin}</label>
            <input
              type="number"
              value={measuredPhenytoin}
              onChange={(e) => setMeasuredPhenytoin(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0891B2] focus:ring-4 focus:ring-[#0891B2]/10 rounded-2xl text-lg font-semibold transition"
              placeholder="e.g. 8"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.albumin}</label>
            <input
              type="number"
              value={albumin}
              onChange={(e) => setAlbumin(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#0891B2] focus:ring-4 focus:ring-[#0891B2]/10 rounded-2xl text-lg font-semibold transition"
              placeholder="e.g. 2.5"
            />
          </div>

          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer transition">
            <input
              type="checkbox"
              checked={isEsrd}
              onChange={(e) => setIsEsrd(e.target.checked)}
              className="w-5 h-5 text-[#0891B2] border-slate-300 rounded focus:ring-[#0891B2]"
            />
            <span className="font-bold text-slate-700">{dict.esrd}</span>
          </label>
        </div>

        {result !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-[#0891B2] text-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="text-[#CCFBF1] text-sm font-bold uppercase tracking-wider mb-2">
                {dict.resultLabel}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black tracking-tight">{result}</span>
                <span className="text-xl font-medium text-[#CCFBF1]">{dict.unit}</span>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  {dict.interpretation}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <ClinicalExportButton 
                title={dict.title}
                inputs={[
                  { label: "Measured Phenytoin", value: measuredPhenytoin + " mcg/mL" },
                  { label: "Albumin", value: albumin + " g/dL" },
                  { label: "ESRD", value: isEsrd ? "Yes" : "No" }
                ]}
                results={[
                  { label: "Corrected Phenytoin", value: result + " mcg/mL" }
                ]}
                formula="Normal: Phenytoin / (0.2 * Albumin + 0.1); ESRD: Phenytoin / (0.1 * Albumin + 0.1)"
                disclaimer="Therapeutic target is typically 10-20 mcg/mL."
                references=""
                lang={lang}
              />
            </div>
          </div>
        )}

        <div className="mt-12 bg-slate-50 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
            {lang === 'fr' ? 'Formule & Explications' : 'Formula & Explanations'}
          </h3>
          <p className="text-sm text-slate-600 whitespace-pre-line font-mono bg-white p-4 rounded-xl border border-slate-150">
            {dict.formula}
          </p>
        </div>
      </div>
    </CalculatorShell>
  );
}
