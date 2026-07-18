import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Activity } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function SapsIIScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<string>('0');
  const [hr, setHr] = useState<string>('0');
  const [sbp, setSbp] = useState<string>('0');
  const [temp, setTemp] = useState<string>('0');
  const [gcs, setGcs] = useState<string>('0');
  const [pao2, setPao2] = useState<string>('0');
  const [uo, setUo] = useState<string>('0');
  const [bun, setBun] = useState<string>('0');
  const [wbc, setWbc] = useState<string>('0');
  const [k, setK] = useState<string>('0');
  const [na, setNa] = useState<string>('0');
  const [hco3, setHco3] = useState<string>('0');
  const [bili, setBili] = useState<string>('0');
  const [chronic, setChronic] = useState<string>('0');
  const [admType, setAdmType] = useState<string>('0');

  const t = {
    en: {
      title: 'SAPS II Score',
      desc: 'Simplified Acute Physiology Score II for ICU mortality.',
      age: 'Age',
      hr: 'Heart Rate (worst in 24h)',
      sbp: 'Systolic BP (worst in 24h)',
      temp: 'Temperature',
      gcs: 'Glasgow Coma Scale (lowest in 24h)',
      pao2: 'PaO2/FiO2 (if vented)',
      uo: 'Urine Output (L/24h)',
      bun: 'BUN (mg/dL)',
      wbc: 'WBC (x10³/µL)',
      k: 'Potassium',
      na: 'Sodium',
      hco3: 'Bicarbonate (mEq/L)',
      bili: 'Bilirubin (mg/dL)',
      chronic: 'Chronic Diseases',
      admType: 'Type of Admission',
      resultLabel: 'SAPS II Score',
      interpretation: 'Score correlates with estimated mortality.'
    },
    fr: {
      title: 'Score SAPS II',
      desc: 'Score IGS II de gravité simplifié pour la mortalité en réa.',
      age: 'Âge',
      hr: 'Fréquence Cardiaque',
      sbp: 'Pression Artérielle Systolique',
      temp: 'Température',
      gcs: 'Score de Glasgow',
      pao2: 'PaO2/FiO2 (si ventilé)',
      uo: 'Diurèse (L/24h)',
      bun: 'Urée (mg/dL)',
      wbc: 'Globules Blancs',
      k: 'Potassium',
      na: 'Sodium',
      hco3: 'Bicarbonates',
      bili: 'Bilirubine',
      chronic: 'Maladies chroniques',
      admType: 'Type d\'admission',
      resultLabel: 'Score SAPS II',
      interpretation: 'Le score est corrélé à la mortalité estimée.'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    return (
      Number(age) + Number(hr) + Number(sbp) + Number(temp) + Number(gcs) +
      Number(pao2) + Number(uo) + Number(bun) + Number(wbc) + Number(k) +
      Number(na) + Number(hco3) + Number(bili) + Number(chronic) + Number(admType)
    );
  };

  const score = calculate();
  
  // Est mortality logic: logit = -7.7631 + 0.0737 * score + 0.9971 * ln(score + 1)
  // For simplicity we map directly using the formula.
  const logit = -7.7631 + 0.0737 * score + 0.9971 * Math.log(score + 1);
  const mortality = (Math.exp(logit) / (1 + Math.exp(logit)) * 100).toFixed(1);

  return (
    <CalculatorShell logicalPath="/saps-ii-score" lang={lang}>
      <div className="max-w-4xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Activity className="w-8 h-8 text-fuchsia-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">&lt; 40 (0)</option>
              <option value="7">40-59 (7)</option>
              <option value="12">60-69 (12)</option>
              <option value="15">70-74 (15)</option>
              <option value="16">75-79 (16)</option>
              <option value="18">≥ 80 (18)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.hr}</label>
            <select value={hr} onChange={(e) => setHr(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="11">&lt; 40 (11)</option>
              <option value="2">40-69 (2)</option>
              <option value="0">70-119 (0)</option>
              <option value="4">120-159 (4)</option>
              <option value="7">≥ 160 (7)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.sbp}</label>
            <select value={sbp} onChange={(e) => setSbp(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="13">&lt; 70 (13)</option>
              <option value="5">70-99 (5)</option>
              <option value="0">100-199 (0)</option>
              <option value="2">≥ 200 (2)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.temp}</label>
            <select value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">&lt; 39.0°C (0)</option>
              <option value="3">≥ 39.0°C (3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.gcs}</label>
            <select value={gcs} onChange={(e) => setGcs(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">14-15 (0)</option>
              <option value="5">11-13 (5)</option>
              <option value="7">9-10 (7)</option>
              <option value="13">6-8 (13)</option>
              <option value="26">&lt; 6 (26)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.pao2}</label>
            <select value={pao2} onChange={(e) => setPao2(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">Not ventilated or CPAP (0)</option>
              <option value="6">Ventilated, PaO2/FiO2 ≥ 200 (6)</option>
              <option value="9">Ventilated, PaO2/FiO2 100-199 (9)</option>
              <option value="11">Ventilated, PaO2/FiO2 &lt; 100 (11)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.uo}</label>
            <select value={uo} onChange={(e) => setUo(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">≥ 1.0 L (0)</option>
              <option value="4">0.5-0.99 L (4)</option>
              <option value="11">&lt; 0.5 L (11)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.bun}</label>
            <select value={bun} onChange={(e) => setBun(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">&lt; 28 (0)</option>
              <option value="6">28-83 (6)</option>
              <option value="10">≥ 84 (10)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.wbc}</label>
            <select value={wbc} onChange={(e) => setWbc(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">1-19.9 (0)</option>
              <option value="3">≥ 20 (3)</option>
              <option value="12">&lt; 1.0 (12)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.k}</label>
            <select value={k} onChange={(e) => setK(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">3.0-4.9 (0)</option>
              <option value="3">≥ 5.0 (3)</option>
              <option value="3">&lt; 3.0 (3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.na}</label>
            <select value={na} onChange={(e) => setNa(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">125-144 (0)</option>
              <option value="1">≥ 145 (1)</option>
              <option value="5">&lt; 125 (5)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.hco3}</label>
            <select value={hco3} onChange={(e) => setHco3(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">≥ 20 (0)</option>
              <option value="3">15-19 (3)</option>
              <option value="6">&lt; 15 (6)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.bili}</label>
            <select value={bili} onChange={(e) => setBili(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">&lt; 4.0 (0)</option>
              <option value="4">4.0-5.9 (4)</option>
              <option value="9">≥ 6.0 (9)</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.chronic}</label>
              <select value={chronic} onChange={(e) => setChronic(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="0">None (0)</option>
                <option value="9">Metastatic Cancer (9)</option>
                <option value="10">Hematologic Malignancy (10)</option>
                <option value="17">AIDS (17)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.admType}</label>
              <select value={admType} onChange={(e) => setAdmType(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <option value="0">Scheduled Surgical (0)</option>
                <option value="6">Medical (6)</option>
                <option value="8">Unscheduled Surgical (8)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-fuchsia-600 text-white p-6 md:p-8 rounded-3xl shadow-xl">
            <div className="text-fuchsia-200 text-sm font-bold uppercase tracking-wider mb-2">
              {dict.resultLabel}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-black tracking-tight">{score}</span>
              <span className="text-xl font-medium text-fuchsia-200">points</span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-white/90 leading-relaxed font-medium">
                Estimated Mortality: ~{mortality}%
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <ClinicalExportButton 
              title={dict.title}
              inputs={[
                { label: "SAPS II Score Inputs", value: "Multiple physiological parameters" }
              ]}
              results={[
                { label: "SAPS II Score", value: `${score} points` },
                { label: "Estimated ICU Mortality", value: `~${mortality}%` }
              ]}
              formula="SAPS II Dilation Logit Formula"
              disclaimer="Simplified Acute Physiology Score II for predicting ICU mortality."
              references="Le Gall JR, et al. A new Simplified Acute Physiology Score (SAPS II) based on a European/North American multicenter study."
              lang={lang}
            />
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
