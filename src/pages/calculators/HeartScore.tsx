import React, { useState, useEffect } from 'react';
import { Heart, FileText, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { LangCode } from '../../types';
import { ActionableResultPanel, RiskLevel } from '../../components/ActionableResultPanel';

const I18N = {
  en: {
    title: 'HEART Score for Major Cardiac Events',
    desc: 'Predicts 6-week risk of major adverse cardiac events (MACE) in patients with chest pain.',
    history: 'History (Anamnesis)',
    historyHigh: 'Highly suspicious (+2)',
    historyModerate: 'Moderately suspicious (+1)',
    historySlight: 'Slightly or non-suspicious (0)',
    ekg: 'EKG',
    ekgSt: 'Significant ST-depression (+2)',
    ekgNonSpecific: 'Nonspecific repolarization disturbance (+1)',
    ekgNormal: 'Normal (0)',
    age: 'Age',
    age65: '≥ 65 years (+2)',
    age45: '45 - 64 years (+1)',
    age45Under: '< 45 years (0)',
    riskFactors: 'Risk Factors',
    risk3Plus: '≥ 3 risk factors or history of atherosclerotic disease (+2)',
    risk1to2: '1-2 risk factors (+1)',
    risk0: 'No known risk factors (0)',
    troponin: 'Troponin (Initial)',
    trop3Plus: '≥ 3x normal limit (+2)',
    trop1to3: '1-3x normal limit (+1)',
    tropNormal: '≤ normal limit (0)',
    result: 'HEART Score',
    lowRisk: 'Low risk of MACE',
    intermediateRisk: 'Intermediate risk of MACE',
    highRisk: 'High risk of MACE',
    maceRateLow: 'MACE rate ~1.7%. Discharge may be acceptable.',
    maceRateInt: 'MACE rate ~16.6%. Clinical observation & non-invasive testing recommended.',
    maceRateHigh: 'MACE rate ~50.1%. Early invasive strategies recommended.',
    reset: 'Reset',
    clinicalContext: 'Clinical Context',
    contextText1: 'The HEART score is designed for patients presenting to the emergency department with chest pain of suspected cardiac origin.',
    contextText2: 'Risk factors include: Hypertension, Hypercholesterolemia, Diabetes Mellitus, Family history of CAD, Smoking, Obesity (BMI >30).',
    reference: 'Reference',
    referenceText: 'Six AJ, Backus BE, Kelder JC. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008.'
  },
  fr: {
    title: 'Score HEART pour Événements Cardiaques Majeurs',
    desc: 'Prédit le risque à 6 semaines d\'événements cardiaques indésirables majeurs (MACE) chez les patients souffrant de douleurs thoraciques.',
    history: 'Histoire (Anamnèse)',
    historyHigh: 'Fortement suspect (+2)',
    historyModerate: 'Modérément suspect (+1)',
    historySlight: 'Faiblement ou non suspect (0)',
    ekg: 'ECG',
    ekgSt: 'Sous-décalage ST significatif (+2)',
    ekgNonSpecific: 'Trouble de la repolarisation non spécifique (+1)',
    ekgNormal: 'Normal (0)',
    age: 'Âge',
    age65: '≥ 65 ans (+2)',
    age45: '45 - 64 ans (+1)',
    age45Under: '< 45 ans (0)',
    riskFactors: 'Facteurs de Risque',
    risk3Plus: '≥ 3 facteurs de risque ou antécédents d\'athérosclérose (+2)',
    risk1to2: '1-2 facteurs de risque (+1)',
    risk0: 'Aucun facteur de risque (0)',
    troponin: 'Troponine (Initiale)',
    trop3Plus: '≥ 3x la limite normale (+2)',
    trop1to3: '1-3x la limite normale (+1)',
    tropNormal: '≤ limite normale (0)',
    result: 'Score HEART',
    lowRisk: 'Faible risque de MACE',
    intermediateRisk: 'Risque intermédiaire de MACE',
    highRisk: 'Haut risque de MACE',
    maceRateLow: 'Taux de MACE ~1,7%. Une sortie peut être envisagée.',
    maceRateInt: 'Taux de MACE ~16,6%. Observation clinique & tests non invasifs recommandés.',
    maceRateHigh: 'Taux de MACE ~50,1%. Stratégies invasives précoces recommandées.',
    reset: 'Réinitialiser',
    clinicalContext: 'Contexte Clinique',
    contextText1: 'Le score HEART est conçu pour les patients se présentant aux urgences avec des douleurs thoraciques d\'origine cardiaque présumée.',
    contextText2: 'Les facteurs de risque incluent : HTA, Hypercholestérolémie, Diabète, Antécédents familiaux de coronaropathie, Tabagisme, Obésité (IMC >30).',
    reference: 'Référence',
    referenceText: 'Six AJ, Backus BE, Kelder JC. Chest pain in the emergency room: value of the HEART score. Neth Heart J. 2008.'
  }
};

export default function HeartScore({ lang }: { lang: LangCode }) {
  const t = I18N[lang] || I18N.en;

  const [history, setHistory] = useState<number | null>(null);
  const [ekg, setEkg] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [risk, setRisk] = useState<number | null>(null);
  const [troponin, setTroponin] = useState<number | null>(null);

  const calculateScore = () => {
    if (history === null || ekg === null || age === null || risk === null || troponin === null) return null;
    return history + ekg + age + risk + troponin;
  };

  const getInterpretation = (score: number | null) => {
    if (score === null) return null;
    if (score <= 3) return { label: t.lowRisk, desc: t.maceRateLow, riskLevel: 'low' as RiskLevel };
    if (score <= 6) return { label: t.intermediateRisk, desc: t.maceRateInt, riskLevel: 'medium' as RiskLevel };
    return { label: t.highRisk, desc: t.maceRateHigh, riskLevel: 'high' as RiskLevel };
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  useEffect(() => {
    if (score !== null && interpretation) {
      const inputs = {
        history: history === 2 ? t.historyHigh : history === 1 ? t.historyModerate : t.historySlight,
        ekg: ekg === 2 ? t.ekgSt : ekg === 1 ? t.ekgNonSpecific : t.ekgNormal,
        age: age === 2 ? t.age65 : age === 1 ? t.age45 : t.age45Under,
        riskFactors: risk === 2 ? t.risk3Plus : risk === 1 ? t.risk1to2 : t.risk0,
        troponin: troponin === 2 ? t.trop3Plus : troponin === 1 ? t.trop1to3 : t.tropNormal,
      };

      const event = new CustomEvent('carecalculus:calc-data', {
        detail: {
          title: t.title,
          inputs,
          results: [
            { label: t.result, value: score.toString() },
            { label: 'Risk Group', value: interpretation.label }
          ],
          lang
        }
      });
      window.dispatchEvent(event);
      window.dispatchEvent(new CustomEvent('cc-calculator-result'));
    }
  }, [score, history, ekg, age, risk, troponin, lang, t, interpretation]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500"></div>
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{t.title}</h1>
          </div>
          <p className="text-slate-500 font-medium mb-8 text-sm md:text-base leading-relaxed max-w-3xl">{t.desc}</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* History */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest">
                  <FileText className="w-4 h-4 text-rose-500" /> {t.history}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setHistory(2)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${history === 2 ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-sm ring-1 ring-rose-500' : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/30'}`}>
                    <span>{t.historyHigh}</span>
                  </button>
                  <button onClick={() => setHistory(1)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${history === 1 ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-sm ring-1 ring-amber-500' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50/30'}`}>
                    <span>{t.historyModerate}</span>
                  </button>
                  <button onClick={() => setHistory(0)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${history === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
                    <span>{t.historySlight}</span>
                  </button>
                </div>
              </div>

              {/* EKG */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4 text-blue-500" /> {t.ekg}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setEkg(2)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${ekg === 2 ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'}`}>
                    <span>{t.ekgSt}</span>
                  </button>
                  <button onClick={() => setEkg(1)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${ekg === 1 ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm ring-1 ring-blue-400' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/30'}`}>
                    <span>{t.ekgNonSpecific}</span>
                  </button>
                  <button onClick={() => setEkg(0)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${ekg === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
                    <span>{t.ekgNormal}</span>
                  </button>
                </div>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest">
                  {t.age}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setAge(2)} className={`px-4 py-3 rounded-xl border text-sm font-bold transition text-center ${age === 2 ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30'}`}>
                    {t.age65}
                  </button>
                  <button onClick={() => setAge(1)} className={`px-4 py-3 rounded-xl border text-sm font-bold transition text-center ${age === 1 ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30'}`}>
                    {t.age45}
                  </button>
                  <button onClick={() => setAge(0)} className={`px-4 py-3 rounded-xl border text-sm font-bold transition text-center ${age === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
                    {t.age45Under}
                  </button>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4 text-orange-500" /> {t.riskFactors}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setRisk(2)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${risk === 2 ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50/30'}`}>
                    <span>{t.risk3Plus}</span>
                  </button>
                  <button onClick={() => setRisk(1)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${risk === 1 ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-sm ring-1 ring-orange-400' : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50/30'}`}>
                    <span>{t.risk1to2}</span>
                  </button>
                  <button onClick={() => setRisk(0)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${risk === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
                    <span>{t.risk0}</span>
                  </button>
                </div>
              </div>

              {/* Troponin */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-purple-500" /> {t.troponin}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button onClick={() => setTroponin(2)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${troponin === 2 ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-sm ring-1 ring-purple-500' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/30'}`}>
                    <span>{t.trop3Plus}</span>
                  </button>
                  <button onClick={() => setTroponin(1)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${troponin === 1 ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-sm ring-1 ring-purple-400' : 'bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-purple-50/30'}`}>
                    <span>{t.trop1to3}</span>
                  </button>
                  <button onClick={() => setTroponin(0)} className={`px-4 py-4 rounded-xl border text-sm font-bold transition text-left flex flex-col gap-1 ${troponin === 0 ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/30'}`}>
                    <span>{t.tropNormal}</span>
                  </button>
                </div>
              </div>

              {(history !== null || ekg !== null || age !== null || risk !== null || troponin !== null) && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => {
                      setHistory(null); setEkg(null); setAge(null); setRisk(null); setTroponin(null);
                    }}
                    className="text-sm font-bold text-slate-400 hover:text-slate-600 underline"
                  >
                    {t.reset}
                  </button>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-6">
              {score !== null && interpretation && (
                <ActionableResultPanel 
                  score={score}
                  title={t.result}
                  riskLevel={interpretation.riskLevel}
                  interpretation={`${interpretation.label}. ${interpretation.desc}`}
                  lang={lang}
                />
              )}

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {t.clinicalContext}
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-3">
                  {t.contextText1}
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {t.contextText2}
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {t.reference}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {t.referenceText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
