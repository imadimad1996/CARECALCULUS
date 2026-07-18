import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Pill } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function VancomycinDosing({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [scr, setScr] = useState<number | ''>('');
  const [indication, setIndication] = useState<'severe' | 'moderate'>('severe');

  const t = {
    en: {
      title: 'Vancomycin Dosing (Empiric)',
      desc: 'Calculates initial loading and maintenance dosing for adults.',
      age: 'Age (years)',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      weight: 'Actual Body Weight (kg)',
      height: 'Height (cm)',
      scr: 'Serum Creatinine (mg/dL)',
      indication: 'Indication / Target',
      severe: 'Severe Infection (Target Trough 15-20 mcg/mL)',
      moderate: 'Mild/Moderate Infection (Target 10-15 mcg/mL)',
      resultLabel: 'Recommended Regimen',
      loadingDose: 'Loading Dose',
      maintDose: 'Maintenance Dose',
      crclLabel: 'Estimated CrCl',
      warning: 'Note: This provides empiric dosing. Therapeutic drug monitoring (trough or AUC/MIC) is required after starting therapy.'
    },
    fr: {
      title: 'Dosage Vancomycine (Empirique)',
      desc: 'Calcule la dose de charge et d\'entretien initiale pour les adultes.',
      age: 'Âge (ans)',
      sex: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      weight: 'Poids Actuel (kg)',
      height: 'Taille (cm)',
      scr: 'Créatinine Sérique (mg/dL)',
      indication: 'Indication / Cible',
      severe: 'Infection Sévère (Cible résiduelle 15-20 mcg/mL)',
      moderate: 'Infection Modérée (Cible 10-15 mcg/mL)',
      resultLabel: 'Régime Recommandé',
      loadingDose: 'Dose de Charge',
      maintDose: 'Dose d\'Entretien',
      crclLabel: 'ClCr Estimée',
      warning: 'Note : Dosage empirique. Un suivi thérapeutique pharmacologique (creux ou ASC/CMI) est requis après initiation.'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    if (age === '' || weight === '' || height === '' || scr === '') return null;
    const a = Number(age);
    const w = Number(weight);
    const h = Number(height);
    const c = Number(scr);

    if (a < 18 || w < 20 || h < 100 || c <= 0) return null;

    // IBW
    const heightInches = h / 2.54;
    let ibw = 50 + 2.3 * (heightInches - 60);
    if (sex === 'female') {
      ibw = 45.5 + 2.3 * (heightInches - 60);
    }
    
    // CrCl (Cockcroft-Gault)
    // Use actual weight if less than IBW, otherwise use IBW or AdjBW depending on protocol.
    // For simplicity, using actual weight if < IBW, otherwise AdjBW
    let dosingWeight = w;
    if (w > ibw * 1.2) {
      dosingWeight = ibw + 0.4 * (w - ibw); // AdjBW
    } else if (w > ibw) {
      dosingWeight = ibw;
    }

    let crcl = ((140 - a) * dosingWeight) / (72 * c);
    if (sex === 'female') crcl *= 0.85;

    // Loading Dose (based on actual body weight)
    let ld = 25 * w;
    if (indication === 'severe') ld = Math.min(30 * w, 3000); // max 3000mg
    // Round to nearest 250mg
    ld = Math.round(ld / 250) * 250;

    // Maintenance Dose
    let md = 15 * w; // typically 15-20 mg/kg
    md = Math.round(md / 250) * 250;
    
    let freq = '';
    if (crcl > 90) freq = 'q8h';
    else if (crcl >= 50) freq = 'q12h';
    else if (crcl >= 20) freq = 'q24h';
    else freq = 'q48h - Dose by levels';

    return {
      crcl: crcl.toFixed(1),
      ld: `${ld} mg IV x 1`,
      md: `${md} mg IV ${freq}`
    };
  };

  const result = calculate();

  return (
    <CalculatorShell logicalPath="/vancomycin-dosing" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Pill className="w-8 h-8 text-indigo-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 45" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.sex}</label>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setSex('male')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${sex === 'male' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{dict.male}</button>
              <button onClick={() => setSex('female')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${sex === 'female' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{dict.female}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.weight}</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 70" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.height}</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 175" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.scr}</label>
            <input type="number" value={scr} onChange={(e) => setScr(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 1.0" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.indication}</label>
            <div className="flex flex-col sm:flex-row bg-slate-100 rounded-xl p-1 gap-1">
              <button onClick={() => setIndication('severe')} className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition ${indication === 'severe' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{dict.severe}</button>
              <button onClick={() => setIndication('moderate')} className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition ${indication === 'moderate' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>{dict.moderate}</button>
            </div>
          </div>
        </div>

        {result !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-indigo-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-4">
                {dict.resultLabel}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-indigo-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.loadingDose}</div>
                  <div className="text-2xl md:text-3xl font-black">{result.ld}</div>
                </div>
                <div>
                  <div className="text-indigo-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.maintDose}</div>
                  <div className="text-2xl md:text-3xl font-black">{result.md}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
                <div>
                  <div className="text-indigo-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.crclLabel}</div>
                  <div className="text-lg font-bold">{result.crcl} mL/min</div>
                </div>
              </div>
              
              <div className="mt-6 bg-white/10 p-4 rounded-xl text-xs font-medium text-white/90">
                {dict.warning}
              </div>
            </div>
            
            <div className="mt-4">
              <ClinicalExportButton 
                title={dict.title}
                inputs={[
                  { label: "Age", value: age },
                  { label: "Sex", value: sex },
                  { label: "Weight", value: weight + " kg" },
                  { label: "Height", value: height + " cm" },
                  { label: "Serum Creatinine", value: scr + " mg/dL" },
                  { label: "Indication / Target", value: indication }
                ]}
                results={[
                  { label: "Loading Dose", value: result.ld },
                  { label: "Maintenance Dose", value: result.md },
                  { label: "Estimated CrCl", value: result.crcl + " mL/min" }
                ]}
                formula="Empiric weight-based dosing and Cockcroft-Gault"
                disclaimer="Note: This provides empiric dosing. Therapeutic drug monitoring (trough or AUC/MIC) is required."
                references="Rybak MJ, et al. Therapeutic monitoring of vancomycin for serious methicillin-resistant Staphylococcus aureus infections: A revised consensus guideline."
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
