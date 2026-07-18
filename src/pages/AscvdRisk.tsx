import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { HeartPulse } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function AscvdRisk({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [race, setRace] = useState<'white' | 'aa' | 'other'>('white');
  const [tc, setTc] = useState<number | ''>('');
  const [hdl, setHdl] = useState<number | ''>('');
  const [sbp, setSbp] = useState<number | ''>('');
  const [treatedHtn, setTreatedHtn] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [smoker, setSmoker] = useState(false);

  const t = {
    en: {
      title: 'ASCVD Risk Estimator Plus',
      desc: 'Estimates 10-year risk of atherosclerotic cardiovascular disease.',
      age: 'Age (40-79 years)',
      gender: 'Sex',
      male: 'Male',
      female: 'Female',
      race: 'Race',
      white: 'White',
      aa: 'African American',
      other: 'Other',
      tc: 'Total Cholesterol (130-320 mg/dL)',
      hdl: 'HDL Cholesterol (20-100 mg/dL)',
      sbp: 'Systolic Blood Pressure (90-200 mmHg)',
      treatedHtn: 'Receiving Treatment for High Blood Pressure?',
      diabetes: 'Diabetes History?',
      smoker: 'Current Smoker?',
      resultLabel: '10-Year ASCVD Risk',
      unit: '%',
      interpretation: 'Risk < 5%: Low\nRisk 5-7.4%: Borderline\nRisk 7.5-19.9%: Intermediate\nRisk ≥ 20%: High'
    },
    fr: {
      title: 'Estimateur de Risque ASCVD',
      desc: 'Estime le risque à 10 ans de maladie cardiovasculaire athéroscléreuse.',
      age: 'Âge (40-79 ans)',
      gender: 'Sexe',
      male: 'Homme',
      female: 'Femme',
      race: 'Origine Ethnique',
      white: 'Blanc',
      aa: 'Afro-Américain',
      other: 'Autre',
      tc: 'Cholestérol Total (130-320 mg/dL)',
      hdl: 'Cholestérol HDL (20-100 mg/dL)',
      sbp: 'Pression Artérielle Systolique (90-200 mmHg)',
      treatedHtn: 'Traitement pour l\'hypertension ?',
      diabetes: 'Antécédents de diabète ?',
      smoker: 'Fumeur actuel ?',
      resultLabel: 'Risque ASCVD à 10 Ans',
      unit: '%',
      interpretation: 'Risque < 5% : Faible\nRisque 5-7.4% : Limite\nRisque 7.5-19.9% : Intermédiaire\nRisque ≥ 20% : Élevé'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  // Uses ACC/AHA 2013 Pooled Cohort Equations
  const calculateRisk = () => {
    if (age === '' || tc === '' || hdl === '' || sbp === '') return null;
    const a = Number(age);
    const tC = Number(tc);
    const h = Number(hdl);
    const s = Number(sbp);
    
    if (a < 40 || a > 79) return null;

    let lnAge = Math.log(a);
    let lnTotalChol = Math.log(tC);
    let lnHdl = Math.log(h);
    let lnTrtSbp = treatedHtn ? Math.log(s) : 0;
    let lnUntrtSbp = !treatedHtn ? Math.log(s) : 0;
    let isSmoker = smoker ? 1 : 0;
    let isDiabetes = diabetes ? 1 : 0;

    let sum = 0;
    let baselineSurvival = 0;
    let meanCoef = 0;

    if (gender === 'female' && race !== 'aa') {
      sum = -29.799 * lnAge + 4.884 * Math.pow(lnAge, 2) + 13.54 * lnTotalChol - 3.114 * lnAge * lnTotalChol - 13.578 * lnHdl + 3.149 * lnAge * lnHdl + 2.019 * lnTrtSbp + 1.957 * lnUntrtSbp + 7.574 * isSmoker - 1.665 * lnAge * isSmoker + 0.661 * isDiabetes;
      baselineSurvival = 0.9665;
      meanCoef = -29.18;
    } else if (gender === 'female' && race === 'aa') {
      sum = 17.114 * lnAge + 0.94 * lnTotalChol - 18.92 * lnHdl + 4.475 * lnAge * lnHdl + 29.291 * lnTrtSbp - 6.432 * lnAge * lnTrtSbp + 27.82 * lnUntrtSbp - 6.087 * lnAge * lnUntrtSbp + 0.691 * isSmoker + 0.874 * isDiabetes;
      baselineSurvival = 0.9533;
      meanCoef = 86.61;
    } else if (gender === 'male' && race !== 'aa') {
      sum = 12.344 * lnAge + 11.853 * lnTotalChol - 2.664 * lnAge * lnTotalChol - 7.99 * lnHdl + 1.769 * lnAge * lnHdl + 1.797 * lnTrtSbp + 1.764 * lnUntrtSbp + 7.837 * isSmoker - 1.795 * lnAge * isSmoker + 0.658 * isDiabetes;
      baselineSurvival = 0.9144;
      meanCoef = 61.18;
    } else if (gender === 'male' && race === 'aa') {
      sum = 2.469 * lnAge + 0.302 * lnTotalChol - 0.307 * lnHdl + 1.916 * lnTrtSbp + 1.809 * lnUntrtSbp + 0.549 * isSmoker + 0.645 * isDiabetes;
      baselineSurvival = 0.8954;
      meanCoef = 19.54;
    }

    const risk = 1 - Math.pow(baselineSurvival, Math.exp(sum - meanCoef));
    return (risk * 100).toFixed(1);
  };

  const risk = calculateRisk();

  return (
    <CalculatorShell logicalPath="/ascvd-risk" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <HeartPulse className="w-8 h-8 text-rose-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 55" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.sbp}</label>
            <input type="number" value={sbp} onChange={(e) => setSbp(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 120" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.tc}</label>
            <input type="number" value={tc} onChange={(e) => setTc(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 180" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.hdl}</label>
            <input type="number" value={hdl} onChange={(e) => setHdl(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 50" />
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.gender}</label>
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button onClick={() => setGender('male')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${gender === 'male' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}>{dict.male}</button>
                <button onClick={() => setGender('female')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${gender === 'female' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-500'}`}>{dict.female}</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.race}</label>
              <select value={race} onChange={(e) => setRace(e.target.value as any)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:border-rose-500 outline-none">
                <option value="white">{dict.white}</option>
                <option value="aa">{dict.aa}</option>
                <option value="other">{dict.other}</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={treatedHtn} onChange={(e) => setTreatedHtn(e.target.checked)} className="w-4 h-4 text-rose-500 border-slate-300 rounded" />
              <span className="text-sm font-bold text-slate-700">{dict.treatedHtn}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={diabetes} onChange={(e) => setDiabetes(e.target.checked)} className="w-4 h-4 text-rose-500 border-slate-300 rounded" />
              <span className="text-sm font-bold text-slate-700">{dict.diabetes}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} className="w-4 h-4 text-rose-500 border-slate-300 rounded" />
              <span className="text-sm font-bold text-slate-700">{dict.smoker}</span>
            </label>
          </div>
        </div>

        {risk !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-rose-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="text-rose-100 text-sm font-bold uppercase tracking-wider mb-2">
                {dict.resultLabel}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black tracking-tight">{risk}</span>
                <span className="text-xl font-medium text-rose-100">{dict.unit}</span>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/90 leading-relaxed font-medium whitespace-pre-line">
                  {dict.interpretation}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <ClinicalExportButton 
                title={dict.title}
                inputs={[
                  { label: "Age", value: age },
                  { label: "Sex", value: gender },
                  { label: "Race", value: race },
                  { label: "Systolic BP", value: sbp + " mmHg" },
                  { label: "Total Cholesterol", value: tc + " mg/dL" },
                  { label: "HDL Cholesterol", value: hdl + " mg/dL" },
                  { label: "Smoker", value: smoker ? 'Yes' : 'No' },
                  { label: "Diabetes", value: diabetes ? 'Yes' : 'No' },
                  { label: "HTN Treated", value: treatedHtn ? 'Yes' : 'No' }
                ]}
                results={[
                  { label: "10-Year ASCVD Risk", value: risk + "%" }
                ]}
                formula="ACC/AHA 2013 Pooled Cohort Equations"
                disclaimer="10-Year risk of cardiovascular event based on Pooled Cohort Equations."
                references="Stone NJ, et al. 2013 ACC/AHA Guideline on the Treatment of Blood Cholesterol to Reduce Atherosclerotic Cardiovascular Risk in Adults."
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
