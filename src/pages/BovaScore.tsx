import { CalcPageSchemas } from '../components/JsonLd';
import React, { useState } from 'react';
import { HeartPulse } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function BovaScore({ lang }: { lang: LangCode }) {
  const [hr, setHr] = useState(false);
  const [sbp, setSbp] = useState(false);
  const [rv, setRv] = useState(false);
  const [trop, setTrop] = useState(false);

  const t = {
    en: {
      title: 'Bova Score for PE Complications',
      desc: 'Predicts PE-related complications in normotensive patients.',
      hr: 'Heart Rate ≥ 110 bpm (+1)',
      sbp: 'Systolic BP 90-100 mmHg (+2)',
      rv: 'RV dysfunction on Echo or CT (+2)',
      trop: 'Elevated cardiac troponin (+2)',
      resultLabel: 'Bova Score',
      interpretation: [
        'Stage I (0-2 points): Low risk (~4% 30-day PE-related complications).',
        'Stage II (3-4 points): Intermediate risk (~18% complications).',
        'Stage III (>4 points): High risk (~42% complications).'
      ],
      faqs: [
        { question: "What is the Bova Score used for?", answer: "The Bova Score is used to predict 30-day PE-related complications in normotensive patients with acute pulmonary embolism." },
        { question: "What variables are included in the Bova Score?", answer: "The score evaluates heart rate, systolic blood pressure, right ventricular (RV) dysfunction, and cardiac troponin levels." }
      ],
      howToSteps: [
        "Assess patient's heart rate; check if ≥ 110 bpm.",
        "Assess patient's systolic BP; check if 90-100 mmHg.",
        "Check for RV dysfunction on Echocardiogram or CT scan.",
        "Check for elevated cardiac troponin levels.",
        "Review the calculated stage to determine complication risk."
      ]
    },
    fr: {
      title: 'Score de Bova (Complications EP)',
      desc: 'Prédit les complications de l\'EP chez les patients normotendus.',
      hr: 'Fréquence Cardiaque ≥ 110 bpm (+1)',
      sbp: 'PA Systolique 90-100 mmHg (+2)',
      rv: 'Dysfonction VD à l\'écho ou TDM (+2)',
      trop: 'Troponine cardiaque élevée (+2)',
      resultLabel: 'Score de Bova',
      interpretation: [
        'Stade I (0-2 points) : Faible risque (~4% de complications à 30 jours).',
        'Stade II (3-4 points) : Risque intermédiaire (~18% de complications).',
        'Stade III (>4 points) : Haut risque (~42% de complications).'
      ],
      faqs: [
        { question: "À quoi sert le Score de Bova ?", answer: "Le Score de Bova prédit les complications liées à l'EP (Embolie Pulmonaire) à 30 jours chez les patients normotendus." },
        { question: "Quels sont les critères du Score de Bova ?", answer: "Il évalue la fréquence cardiaque, la pression artérielle systolique, la dysfonction du ventricule droit (VD) et le taux de troponine cardiaque." }
      ],
      howToSteps: [
        "Vérifiez si la fréquence cardiaque est ≥ 110 bpm.",
        "Vérifiez si la PA systolique est entre 90 et 100 mmHg.",
        "Recherchez une dysfonction VD à l'échocardiographie ou au scanner.",
        "Vérifiez si la troponine cardiaque est élevée.",
        "Lisez le stade calculé pour déterminer le risque de complications."
      ]
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    let score = 0;
    if (hr) score += 1;
    if (sbp) score += 2;
    if (rv) score += 2;
    if (trop) score += 2;
    return score;
  };

  const score = calculate();

  const getInterpretation = (score: number) => {
    if (score <= 2) return dict.interpretation[0];
    if (score <= 4) return dict.interpretation[1];
    return dict.interpretation[2];
  };

  return (
    <>
      <CalcPageSchemas 
        name={dict.title}
        description={dict.desc}
        path="/bova-score"
        scoringSystem="Bova Score"
        faqs={dict.faqs}
        howToSteps={dict.howToSteps}
      />
      <div className="w-full max-w-full max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <HeartPulse className="w-8 h-8 text-rose-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { state: hr, setter: setHr, label: dict.hr },
              { state: sbp, setter: setSbp, label: dict.sbp },
              { state: rv, setter: setRv, label: dict.rv },
              { state: trop, setter: setTrop, label: dict.trop }
            ].map((item, idx) => (
              <label key={idx} className={`flex items-center gap-3 p-4 border rounded-2xl cursor-pointer transition ${item.state ? 'bg-rose-50 border-rose-200' : 'hover:bg-slate-50 border-slate-200'}`}>
                <input type="checkbox" checked={item.state} onChange={(e) => item.setter(e.target.checked)} className="w-5 h-5 text-rose-500 border-slate-300 rounded focus:ring-rose-500" />
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-rose-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
            <div className="text-rose-200 text-sm font-bold uppercase tracking-wider mb-2">
              {dict.resultLabel}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black tracking-tight">{score}</span>
              <span className="text-xl font-medium text-rose-200">points</span>
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
                { label: "Heart Rate >= 110 bpm", value: hr ? "Yes" : "No" },
                { label: "Systolic BP 90-100 mmHg", value: sbp ? "Yes" : "No" },
                { label: "RV Dysfunction (Echo or CT)", value: rv ? "Yes" : "No" },
                { label: "Elevated Cardiac Troponin", value: trop ? "Yes" : "No" }
              ]}
              results={[
                { label: "Bova Score", value: `${score} points` },
                { label: "Risk Stage", value: getInterpretation(score) }
              ]}
              formula="Bova Point Scoring"
              disclaimer="Predicts PE-related complications in normotensive patients."
              references="Bova C, et al. A risk stratification model for non-high-risk pulmonary embolism."
              lang={lang}
            />
          </div>
        </div>
      </div>
    </>
  );
}
