import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Pill } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function AminoglycosideDosing({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [scr, setScr] = useState<number | ''>('');
  const [drug, setDrug] = useState<'gentamicin' | 'amikacin'>('gentamicin');

  const t = {
    en: {
      title: 'Aminoglycoside Dosing',
      desc: 'Extended-interval dosing for Gentamicin/Tobramycin or Amikacin.',
      age: 'Age (years)',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      weight: 'Actual Body Weight (kg)',
      height: 'Height (cm)',
      scr: 'Serum Creatinine (mg/dL)',
      drug: 'Select Drug',
      gentamicin: 'Gentamicin / Tobramycin (7 mg/kg)',
      amikacin: 'Amikacin (15 mg/kg)',
      resultLabel: 'Initial Dosing Regimen',
      dose: 'Initial Dose',
      interval: 'Frequency',
      crclLabel: 'Estimated CrCl',
      warning: 'Note: Contraindicated in CrCl < 20, ascites, burns >20%, or pregnancy. TDM required.'
    },
    fr: {
      title: 'Dosage Aminosides',
      desc: 'Dosage à intervalle prolongé pour Gentamicine/Tobramycine ou Amikacine.',
      age: 'Âge (ans)',
      sex: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      weight: 'Poids Actuel (kg)',
      height: 'Taille (cm)',
      scr: 'Créatinine Sérique (mg/dL)',
      drug: 'Médicament',
      gentamicin: 'Gentamicine / Tobramycine (7 mg/kg)',
      amikacin: 'Amikacine (15 mg/kg)',
      resultLabel: 'Régime Initial',
      dose: 'Dose Initiale',
      interval: 'Fréquence',
      crclLabel: 'ClCr Estimée',
      warning: 'Note : Contre-indiqué si ClCr < 20, ascite, brûlures >20% ou grossesse. Suivi requis.'
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
    
    // Dosing Weight (actual if < IBW, otherwise AdjBW)
    let dosingWeight = w;
    if (w > ibw * 1.2) {
      dosingWeight = ibw + 0.4 * (w - ibw); // AdjBW
    } else if (w > ibw) {
      dosingWeight = ibw;
    }

    // CrCl (Cockcroft-Gault) uses same dosing weight logic here
    let crcl = ((140 - a) * dosingWeight) / (72 * c);
    if (sex === 'female') crcl *= 0.85;

    // Dose
    const multiplier = drug === 'gentamicin' ? 7 : 15;
    let dose = multiplier * dosingWeight;
    
    // Rounding (Gent/Tobra to nearest 10, Amikacin to nearest 50)
    if (drug === 'gentamicin') {
      dose = Math.round(dose / 10) * 10;
    } else {
      dose = Math.round(dose / 50) * 50;
    }

    let interval = '';
    if (crcl >= 60) interval = 'q24h';
    else if (crcl >= 40) interval = 'q36h';
    else if (crcl >= 20) interval = 'q48h';
    else interval = 'Do not use extended interval. Use traditional dosing.';

    return {
      crcl: crcl.toFixed(1),
      dose: `${dose} mg IV`,
      interval: interval
    };
  };

  const result = calculate();

  return (
    <CalculatorShell logicalPath="/aminoglycoside-dosing" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Pill className="w-8 h-8 text-fuchsia-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.drug}</label>
            <div className="flex flex-col sm:flex-row bg-slate-100 rounded-xl p-1 gap-1">
              <button onClick={() => setDrug('gentamicin')} className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition ${drug === 'gentamicin' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500'}`}>{dict.gentamicin}</button>
              <button onClick={() => setDrug('amikacin')} className={`flex-1 py-3 px-2 text-xs sm:text-sm font-bold rounded-lg transition ${drug === 'amikacin' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500'}`}>{dict.amikacin}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 45" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.sex}</label>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button onClick={() => setSex('male')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${sex === 'male' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500'}`}>{dict.male}</button>
              <button onClick={() => setSex('female')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${sex === 'female' ? 'bg-white shadow-sm text-fuchsia-600' : 'text-slate-500'}`}>{dict.female}</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.weight}</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 70" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.height}</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 175" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.scr}</label>
            <input type="number" value={scr} onChange={(e) => setScr(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 1.0" />
          </div>
        </div>

        {result !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-fuchsia-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="text-fuchsia-200 text-sm font-bold uppercase tracking-wider mb-4">
                {dict.resultLabel}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-fuchsia-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.dose}</div>
                  <div className="text-3xl md:text-4xl font-black">{result.dose}</div>
                </div>
                <div>
                  <div className="text-fuchsia-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.interval}</div>
                  <div className="text-3xl md:text-4xl font-black">{result.interval}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20 flex items-center justify-between">
                <div>
                  <div className="text-fuchsia-200 text-xs font-semibold mb-1 uppercase tracking-wide">{dict.crclLabel}</div>
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
                  { label: "Drug Selected", value: drug },
                  { label: "Age", value: age },
                  { label: "Sex", value: sex },
                  { label: "Weight", value: weight + " kg" },
                  { label: "Height", value: height + " cm" },
                  { label: "Serum Creatinine", value: scr + " mg/dL" }
                ]}
                results={[
                  { label: "Dose", value: result.dose },
                  { label: "Interval", value: result.interval },
                  { label: "Estimated CrCl", value: result.crcl + " mL/min" }
                ]}
                formula="Extended-interval dosing (Hartford Nomogram basis)"
                disclaimer="Note: Contraindicated in CrCl < 20, ascites, burns >20%, or pregnancy. TDM required."
                references="Nicolau DP, et al. Experience with a once-daily aminoglycoside program administered to 2,184 patients."
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
