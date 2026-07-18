import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Wind } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function PesiScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<number | ''>('');
  const [male, setMale] = useState(false);
  const [cancer, setCancer] = useState(false);
  const [hf, setHf] = useState(false);
  const [lung, setLung] = useState(false);
  const [hr, setHr] = useState(false);
  const [sbp, setSbp] = useState(false);
  const [rr, setRr] = useState(false);
  const [temp, setTemp] = useState(false);
  const [ams, setAms] = useState(false);
  const [o2sat, setO2sat] = useState(false);

  const t = {
    en: {
      title: 'PESI Score for Pulmonary Embolism',
      desc: 'Predicts 30-day mortality in patients with PE.',
      age: 'Age (1 point per year)',
      male: 'Male Sex (+10)',
      cancer: 'History of Cancer (+30)',
      hf: 'Heart Failure (+10)',
      lung: 'Chronic Lung Disease (+10)',
      hr: 'Heart Rate ≥ 110 bpm (+20)',
      sbp: 'Systolic BP < 100 mmHg (+30)',
      rr: 'Resp Rate ≥ 30/min (+20)',
      temp: 'Temp < 36°C (+20)',
      ams: 'Altered Mental Status (+60)',
      o2sat: 'O₂ Saturation < 90% (+20)',
      resultLabel: 'PESI Score',
      interpretation: [
        'Class I (≤ 65 points): Very low risk (0-1.6% 30-day mortality). Consider outpatient management.',
        'Class II (66-85 points): Low risk (1.7-3.5% mortality). Consider outpatient management.',
        'Class III (86-105 points): Moderate risk (3.2-7.1% mortality).',
        'Class IV (106-125 points): High risk (4.0-11.4% mortality).',
        'Class V (> 125 points): Very high risk (10.0-24.5% mortality).'
      ]
    },
    fr: {
      title: 'Score PESI pour Embolie Pulmonaire',
      desc: 'Prédit la mortalité à 30 jours chez les patients avec EP.',
      age: 'Âge (1 point par année)',
      male: 'Sexe Masculin (+10)',
      cancer: 'Antécédent de Cancer (+30)',
      hf: 'Insuffisance Cardiaque (+10)',
      lung: 'Maladie Pulmonaire Chronique (+10)',
      hr: 'FC ≥ 110 bpm (+20)',
      sbp: 'PA Systolique < 100 mmHg (+30)',
      rr: 'FR ≥ 30/min (+20)',
      temp: 'Température < 36°C (+20)',
      ams: 'Altération de l\'état mental (+60)',
      o2sat: 'Saturation O₂ < 90% (+20)',
      resultLabel: 'Score PESI',
      interpretation: [
        'Classe I (≤ 65 points) : Risque très faible (0-1.6% de mortalité à 30 jours). Envisager traitement ambulatoire.',
        'Classe II (66-85 points) : Risque faible (1.7-3.5%). Envisager traitement ambulatoire.',
        'Classe III (86-105 points) : Risque modéré (3.2-7.1%).',
        'Classe IV (106-125 points) : Risque élevé (4.0-11.4%).',
        'Classe V (> 125 points) : Risque très élevé (10.0-24.5%).'
      ]
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    if (age === '') return null;
    let score = Number(age);
    if (male) score += 10;
    if (cancer) score += 30;
    if (hf) score += 10;
    if (lung) score += 10;
    if (hr) score += 20;
    if (sbp) score += 30;
    if (rr) score += 20;
    if (temp) score += 20;
    if (ams) score += 60;
    if (o2sat) score += 20;
    return score;
  };

  const score = calculate();

  const getInterpretation = (score: number) => {
    if (score <= 65) return dict.interpretation[0];
    if (score <= 85) return dict.interpretation[1];
    if (score <= 105) return dict.interpretation[2];
    if (score <= 125) return dict.interpretation[3];
    return dict.interpretation[4];
  };

  return (
    <CalculatorShell logicalPath="/pesi-score" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Wind className="w-8 h-8 text-sky-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 rounded-2xl text-lg font-semibold transition" placeholder="e.g. 65" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {[
              { state: male, setter: setMale, label: dict.male },
              { state: cancer, setter: setCancer, label: dict.cancer },
              { state: hf, setter: setHf, label: dict.hf },
              { state: lung, setter: setLung, label: dict.lung },
              { state: hr, setter: setHr, label: dict.hr },
              { state: sbp, setter: setSbp, label: dict.sbp },
              { state: rr, setter: setRr, label: dict.rr },
              { state: temp, setter: setTemp, label: dict.temp },
              { state: ams, setter: setAms, label: dict.ams },
              { state: o2sat, setter: setO2sat, label: dict.o2sat },
            ].map((item, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${item.state ? 'bg-sky-50 border-sky-200' : 'hover:bg-slate-50 border-slate-200'}`}>
                <input type="checkbox" checked={item.state} onChange={(e) => item.setter(e.target.checked)} className="w-4 h-4 text-sky-500 border-slate-300 rounded" />
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {score !== null && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-sky-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="text-sky-200 text-sm font-bold uppercase tracking-wider mb-2">
                {dict.resultLabel}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black tracking-tight">{score}</span>
                <span className="text-xl font-medium text-sky-200">points</span>
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-sm text-white/90 leading-relaxed font-medium">
                  {getInterpretation(score)}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <ClinicalExportButton 
                title={dict.title}
                inputs={[
                  { label: "Age", value: age },
                  { label: "Male Sex", value: male ? "Yes" : "No" },
                  { label: "History of Cancer", value: cancer ? "Yes" : "No" },
                  { label: "Heart Failure", value: hf ? "Yes" : "No" },
                  { label: "Chronic Lung Disease", value: lung ? "Yes" : "No" },
                  { label: "HR >= 110 bpm", value: hr ? "Yes" : "No" },
                  { label: "Systolic BP < 100 mmHg", value: sbp ? "Yes" : "No" },
                  { label: "Resp Rate >= 30/min", value: rr ? "Yes" : "No" },
                  { label: "Temp < 36°C", value: temp ? "Yes" : "No" },
                  { label: "Altered Mental Status", value: ams ? "Yes" : "No" },
                  { label: "O₂ Saturation < 90%", value: o2sat ? "Yes" : "No" }
                ]}
                results={[
                  { label: "PESI Score", value: `${score} points` },
                  { label: "Risk Stratification", value: getInterpretation(score) }
                ]}
                formula="PESI Scoring System"
                disclaimer="Predicts 30-day mortality in patients with PE."
                references="Aujesky D, et al. Derivation and validation of a prognostic model for pulmonary embolism."
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
