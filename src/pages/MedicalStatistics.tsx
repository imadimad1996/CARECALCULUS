import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Layers } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function MedicalStatistics({ lang }: { lang: LangCode }) {
  const [tp, setTp] = useState<number | ''>('');
  const [fp, setFp] = useState<number | ''>('');
  const [fn, setFn] = useState<number | ''>('');
  const [tn, setTn] = useState<number | ''>('');

  const t = {
    en: {
      title: 'Diagnostic Test Statistics',
      desc: 'Calculate Sensitivity, Specificity, PPV, and NPV from a 2x2 contingency table.',
      diseasePresent: 'Disease Present (Gold Standard +)',
      diseaseAbsent: 'Disease Absent (Gold Standard -)',
      testPositive: 'Test Positive',
      testNegative: 'Test Negative',
      tp: 'True Positives (TP)',
      fp: 'False Positives (FP)',
      fn: 'False Negatives (FN)',
      tn: 'True Negatives (TN)',
      results: 'Statistical Results',
      sens: 'Sensitivity (Sn)',
      spec: 'Specificity (Sp)',
      ppv: 'Positive Predictive Value (PPV)',
      npv: 'Negative Predictive Value (NPV)',
      prev: 'Prevalence',
      lrPlus: 'Likelihood Ratio (+)',
      lrMinus: 'Likelihood Ratio (-)',
      descSens: 'Probability of a positive test among patients with disease.',
      descSpec: 'Probability of a negative test among patients without disease.',
      descPpv: 'Probability of disease given a positive test.',
      descNpv: 'Probability of no disease given a negative test.'
    },
    fr: {
      title: 'Statistiques de Test Diagnostique',
      desc: 'Calculez Sensibilité, Spécificité, VPP et VPN depuis un tableau 2x2.',
      diseasePresent: 'Maladie Présente (Référence +)',
      diseaseAbsent: 'Maladie Absente (Référence -)',
      testPositive: 'Test Positif',
      testNegative: 'Test Négatif',
      tp: 'Vrais Positifs (VP)',
      fp: 'Faux Positifs (FP)',
      fn: 'Faux Négatifs (FN)',
      tn: 'Vrais Négatifs (VN)',
      results: 'Résultats Statistiques',
      sens: 'Sensibilité (Se)',
      spec: 'Spécificité (Sp)',
      ppv: 'Valeur Prédictive Positive (VPP)',
      npv: 'Valeur Prédictive Négative (VPN)',
      prev: 'Prévalence',
      lrPlus: 'Rapport de Vraisemblance (+)',
      lrMinus: 'Rapport de Vraisemblance (-)',
      descSens: 'Probabilité d\'un test positif chez les malades.',
      descSpec: 'Probabilité d\'un test négatif chez les non-malades.',
      descPpv: 'Probabilité d\'être malade avec un test positif.',
      descNpv: 'Probabilité de ne pas être malade avec un test négatif.'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    if (tp === '' || fp === '' || fn === '' || tn === '') return null;
    const a = Number(tp);
    const b = Number(fp);
    const c = Number(fn);
    const d = Number(tn);

    const diseasePos = a + c;
    const diseaseNeg = b + d;
    const testPos = a + b;
    const testNeg = c + d;
    const total = diseasePos + diseaseNeg;

    if (total === 0) return null;

    const sens = diseasePos > 0 ? a / diseasePos : 0;
    const spec = diseaseNeg > 0 ? d / diseaseNeg : 0;
    const ppv = testPos > 0 ? a / testPos : 0;
    const npv = testNeg > 0 ? d / testNeg : 0;
    const prev = total > 0 ? diseasePos / total : 0;

    const lrPlus = spec !== 1 ? sens / (1 - spec) : Infinity;
    const lrMinus = spec !== 0 ? (1 - sens) / spec : 0;

    return {
      sens: (sens * 100).toFixed(1) + '%',
      spec: (spec * 100).toFixed(1) + '%',
      ppv: (ppv * 100).toFixed(1) + '%',
      npv: (npv * 100).toFixed(1) + '%',
      prev: (prev * 100).toFixed(1) + '%',
      lrPlus: lrPlus === Infinity ? 'Infinity' : lrPlus.toFixed(2),
      lrMinus: lrMinus.toFixed(2)
    };
  };

  const res = calculate();

  return (
    <CalculatorShell logicalPath="/medical-statistics" lang={lang}>
      <div className="max-w-4xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Layers className="w-8 h-8 text-blue-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-3 divide-x divide-y divide-slate-200 text-center">
            <div className="bg-slate-50 p-4 font-bold text-slate-700 flex items-center justify-center">2x2 Table</div>
            <div className="bg-indigo-50 p-4 font-bold text-indigo-800">{dict.diseasePresent}</div>
            <div className="bg-emerald-50 p-4 font-bold text-emerald-800">{dict.diseaseAbsent}</div>

            <div className="bg-slate-50 p-4 font-bold text-slate-700 flex items-center justify-center">{dict.testPositive}</div>
            <div className="p-4 bg-indigo-50/30">
              <label className="text-xs text-slate-500 mb-1 block">{dict.tp}</label>
              <input type="number" value={tp} onChange={(e) => setTp(e.target.value === '' ? '' : Number(e.target.value))} className="w-full text-center px-4 py-2 bg-white border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-lg font-bold" placeholder="TP" />
            </div>
            <div className="p-4 bg-emerald-50/30">
              <label className="text-xs text-slate-500 mb-1 block">{dict.fp}</label>
              <input type="number" value={fp} onChange={(e) => setFp(e.target.value === '' ? '' : Number(e.target.value))} className="w-full text-center px-4 py-2 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-lg font-bold" placeholder="FP" />
            </div>

            <div className="bg-slate-50 p-4 font-bold text-slate-700 flex items-center justify-center">{dict.testNegative}</div>
            <div className="p-4 bg-indigo-50/30">
              <label className="text-xs text-slate-500 mb-1 block">{dict.fn}</label>
              <input type="number" value={fn} onChange={(e) => setFn(e.target.value === '' ? '' : Number(e.target.value))} className="w-full text-center px-4 py-2 bg-white border border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-lg font-bold" placeholder="FN" />
            </div>
            <div className="p-4 bg-emerald-50/30">
              <label className="text-xs text-slate-500 mb-1 block">{dict.tn}</label>
              <input type="number" value={tn} onChange={(e) => setTn(e.target.value === '' ? '' : Number(e.target.value))} className="w-full text-center px-4 py-2 bg-white border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-lg font-bold" placeholder="TN" />
            </div>
          </div>
        </div>

        {res && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold text-slate-800 mb-4 px-2">{dict.results}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                <span className="text-sm font-bold text-slate-500 mb-1">{dict.sens}</span>
                <span className="text-3xl font-black text-indigo-600">{res.sens}</span>
                <span className="text-xs text-slate-400 mt-2">{dict.descSens}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                <span className="text-sm font-bold text-slate-500 mb-1">{dict.spec}</span>
                <span className="text-3xl font-black text-emerald-600">{res.spec}</span>
                <span className="text-xs text-slate-400 mt-2">{dict.descSpec}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                <span className="text-sm font-bold text-slate-500 mb-1">{dict.ppv}</span>
                <span className="text-3xl font-black text-rose-600">{res.ppv}</span>
                <span className="text-xs text-slate-400 mt-2">{dict.descPpv}</span>
              </div>
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col">
                <span className="text-sm font-bold text-slate-500 mb-1">{dict.npv}</span>
                <span className="text-3xl font-black text-amber-600">{res.npv}</span>
                <span className="text-xs text-slate-400 mt-2">{dict.descNpv}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{dict.prev}</div>
                <div className="text-lg font-bold text-slate-800">{res.prev}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{dict.lrPlus}</div>
                <div className="text-lg font-bold text-slate-800">{res.lrPlus}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{dict.lrMinus}</div>
                <div className="text-lg font-bold text-slate-800">{res.lrMinus}</div>
              </div>
            </div>
            
            <div className="mt-8">
              <ClinicalExportButton 
                title={dict.title}
                inputs={[
                  { label: "True Positives (TP)", value: tp },
                  { label: "False Positives (FP)", value: fp },
                  { label: "False Negatives (FN)", value: fn },
                  { label: "True Negatives (TN)", value: tn }
                ]}
                results={[
                  { label: "Sensitivity", value: res.sens },
                  { label: "Specificity", value: res.spec },
                  { label: "Positive Predictive Value (PPV)", value: res.ppv },
                  { label: "Negative Predictive Value (NPV)", value: res.npv },
                  { label: "Likelihood Ratio (+)", value: res.lrPlus },
                  { label: "Likelihood Ratio (-)", value: res.lrMinus },
                  { label: "Prevalence", value: res.prev }
                ]}
                formula="Standard 2x2 contingency table formulas"
                disclaimer="Calculates sensitivity, specificity, and predictive values."
                references="Altman DG, Bland JM. Diagnostic tests. 1: Sensitivity and specificity."
                lang={lang}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
