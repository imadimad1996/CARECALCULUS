import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { Activity } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

export default function ApacheIIScore({ lang }: { lang: LangCode }) {
  const [age, setAge] = useState<string>('0');
  const [temp, setTemp] = useState<string>('0');
  const [map, setMap] = useState<string>('0');
  const [hr, setHr] = useState<string>('0');
  const [rr, setRr] = useState<string>('0');
  const [ph, setPh] = useState<string>('0');
  const [na, setNa] = useState<string>('0');
  const [k, setK] = useState<string>('0');
  const [cr, setCr] = useState<string>('0');
  const [arf, setArf] = useState(false);
  const [hct, setHct] = useState<string>('0');
  const [wbc, setWbc] = useState<string>('0');
  const [gcs, setGcs] = useState<string>('0');
  const [chronic, setChronic] = useState<string>('0');
  const [oxygen, setOxygen] = useState<string>('0');

  const t = {
    en: {
      title: 'APACHE II Score',
      desc: 'Estimates ICU mortality based on worst 24-hour values.',
      age: 'Age',
      temp: 'Temperature (°C)',
      map: 'Mean Arterial Pressure',
      hr: 'Heart Rate',
      rr: 'Respiratory Rate',
      ph: 'Arterial pH',
      na: 'Serum Sodium',
      k: 'Serum Potassium',
      cr: 'Serum Creatinine',
      arf: 'Acute Renal Failure? (Doubles Cr points)',
      hct: 'Hematocrit',
      wbc: 'White Blood Count',
      gcs: 'Glasgow Coma Scale (15 - actual GCS = points)',
      chronic: 'Chronic Health Conditions',
      oxygen: 'Oxygenation (FiO2 / PaO2 / A-a gradient)',
      resultLabel: 'APACHE II Score',
      interpretation: 'Score correlates with estimated mortality (e.g., 25 = ~55%).'
    },
    fr: {
      title: 'Score APACHE II',
      desc: 'Estime la mortalité en réanimation (pires valeurs sur 24h).',
      age: 'Âge',
      temp: 'Température (°C)',
      map: 'Pression Artérielle Moyenne',
      hr: 'Fréquence Cardiaque',
      rr: 'Fréquence Respiratoire',
      ph: 'pH Artériel',
      na: 'Sodium Sérique',
      k: 'Potassium Sérique',
      cr: 'Créatinine Sérique',
      arf: 'Insuffisance rénale aiguë ? (Double les points Cr)',
      hct: 'Hématocrite',
      wbc: 'Globules Blancs',
      gcs: 'Score de Glasgow (15 - GCS actuel = points)',
      chronic: 'Problèmes de santé chroniques',
      oxygen: 'Oxygénation',
      resultLabel: 'Score APACHE II',
      interpretation: 'Le score est corrélé à la mortalité (ex. 25 = ~55%).'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const calculate = () => {
    let crPoints = Number(cr);
    if (arf) crPoints *= 2;

    const total = 
      Number(age) + 
      Number(temp) + 
      Number(map) + 
      Number(hr) + 
      Number(rr) + 
      Number(ph) + 
      Number(na) + 
      Number(k) + 
      crPoints + 
      Number(hct) + 
      Number(wbc) + 
      Number(gcs) + 
      Number(chronic) + 
      Number(oxygen);
    
    return total;
  };

  const score = calculate();

  // Basic mortality estimation approximation
  let estMortality = '';
  if (score <= 4) estMortality = '4%';
  else if (score <= 9) estMortality = '8%';
  else if (score <= 14) estMortality = '15%';
  else if (score <= 19) estMortality = '24%';
  else if (score <= 24) estMortality = '40%';
  else if (score <= 29) estMortality = '55%';
  else if (score <= 34) estMortality = '75%';
  else estMortality = '85%';

  return (
    <CalculatorShell logicalPath="/apache-ii-score" lang={lang}>
      <div className="max-w-4xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <Activity className="w-8 h-8 text-rose-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.age}</label>
            <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">≤ 44 (0)</option>
              <option value="2">45-54 (2)</option>
              <option value="3">55-64 (3)</option>
              <option value="5">65-74 (5)</option>
              <option value="6">≥ 75 (6)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.temp}</label>
            <select value={temp} onChange={(e) => setTemp(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 41°C (4)</option>
              <option value="3">39-40.9°C (3)</option>
              <option value="1">38.5-38.9°C (1)</option>
              <option value="0">36-38.4°C (0)</option>
              <option value="1">34-35.9°C (1)</option>
              <option value="2">32-33.9°C (2)</option>
              <option value="3">30-31.9°C (3)</option>
              <option value="4">≤ 29.9°C (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.map}</label>
            <select value={map} onChange={(e) => setMap(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 160 (4)</option>
              <option value="3">130-159 (3)</option>
              <option value="2">110-129 (2)</option>
              <option value="0">70-109 (0)</option>
              <option value="2">50-69 (2)</option>
              <option value="4">≤ 49 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.hr}</label>
            <select value={hr} onChange={(e) => setHr(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 180 (4)</option>
              <option value="3">140-179 (3)</option>
              <option value="2">110-139 (2)</option>
              <option value="0">70-109 (0)</option>
              <option value="2">55-69 (2)</option>
              <option value="3">40-54 (3)</option>
              <option value="4">≤ 39 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.rr}</label>
            <select value={rr} onChange={(e) => setRr(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 50 (4)</option>
              <option value="3">35-49 (3)</option>
              <option value="1">25-34 (1)</option>
              <option value="0">12-24 (0)</option>
              <option value="1">10-11 (1)</option>
              <option value="2">6-9 (2)</option>
              <option value="4">≤ 5 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.ph}</label>
            <select value={ph} onChange={(e) => setPh(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 7.7 (4)</option>
              <option value="3">7.6-7.69 (3)</option>
              <option value="1">7.5-7.59 (1)</option>
              <option value="0">7.33-7.49 (0)</option>
              <option value="2">7.25-7.32 (2)</option>
              <option value="3">7.15-7.24 (3)</option>
              <option value="4">&lt; 7.15 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.na}</label>
            <select value={na} onChange={(e) => setNa(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 180 (4)</option>
              <option value="3">160-179 (3)</option>
              <option value="2">155-159 (2)</option>
              <option value="1">150-154 (1)</option>
              <option value="0">130-149 (0)</option>
              <option value="2">120-129 (2)</option>
              <option value="3">111-119 (3)</option>
              <option value="4">≤ 110 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.k}</label>
            <select value={k} onChange={(e) => setK(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 7.0 (4)</option>
              <option value="3">6.0-6.9 (3)</option>
              <option value="1">5.5-5.9 (1)</option>
              <option value="0">3.5-5.4 (0)</option>
              <option value="1">3.0-3.4 (1)</option>
              <option value="2">2.5-2.9 (2)</option>
              <option value="4">&lt; 2.5 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.cr}</label>
            <select value={cr} onChange={(e) => setCr(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 3.5 (4)</option>
              <option value="3">2.0-3.4 (3)</option>
              <option value="2">1.5-1.9 (2)</option>
              <option value="0">0.6-1.4 (0)</option>
              <option value="2">&lt; 0.6 (2)</option>
            </select>
            <label className="flex items-center gap-2 mt-2">
              <input type="checkbox" checked={arf} onChange={(e) => setArf(e.target.checked)} className="text-rose-500 rounded" />
              <span className="text-xs font-bold text-rose-600">{dict.arf}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.hct}</label>
            <select value={hct} onChange={(e) => setHct(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 60 (4)</option>
              <option value="2">50-59.9 (2)</option>
              <option value="1">46-49.9 (1)</option>
              <option value="0">30-45.9 (0)</option>
              <option value="2">20-29.9 (2)</option>
              <option value="4">&lt; 20 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.wbc}</label>
            <select value={wbc} onChange={(e) => setWbc(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="4">≥ 40 (4)</option>
              <option value="2">20-39.9 (2)</option>
              <option value="1">15-19.9 (1)</option>
              <option value="0">3-14.9 (0)</option>
              <option value="2">1-2.9 (2)</option>
              <option value="4">&lt; 1 (4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.gcs}</label>
            <input type="number" min="0" max="12" value={gcs} onChange={(e) => setGcs(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700" placeholder="15 - GCS" />
            <span className="text-xs text-slate-500">Ex: if GCS is 10, enter 5</span>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.chronic}</label>
            <select value={chronic} onChange={(e) => setChronic(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">None / Not Applicable (0)</option>
              <option value="2">Elective post-operative patient (2)</option>
              <option value="5">Non-operative or emergency post-operative patient (5)</option>
            </select>
            <p className="text-xs text-slate-500 mt-2">Severe organ insufficiency: Liver (cirrhosis/portal HTN), Cardio (NYHA IV), Resp (severe COPD), Renal (chronic dialysis), Immuno.</p>
          </div>
          
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-bold text-slate-700 mb-2">{dict.oxygen}</label>
            <select value={oxygen} onChange={(e) => setOxygen(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <option value="0">Normal PaO2 &gt; 70 or A-a &lt; 200 (0)</option>
              <option value="1">PaO2 61-70 (1)</option>
              <option value="3">PaO2 55-60 (3)</option>
              <option value="4">PaO2 &lt; 55 (4)</option>
              <option value="2">A-a DO2 200-349 (FiO2 ≥ 0.5) (2)</option>
              <option value="3">A-a DO2 350-499 (FiO2 ≥ 0.5) (3)</option>
              <option value="4">A-a DO2 ≥ 500 (FiO2 ≥ 0.5) (4)</option>
            </select>
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
                Estimated Non-Operative Mortality: ~{estMortality}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <ClinicalExportButton 
              title={dict.title}
              inputs={[
                { label: "APACHE II Score Inputs", value: "Multiple clinical variables assessed" }
              ]}
              results={[
                { label: "APACHE II Score", value: `${score} points` },
                { label: "Estimated Non-Operative Mortality", value: `~${estMortality}` }
              ]}
              formula="APACHE II Scoring Algorithm"
              disclaimer="Estimates ICU mortality based on worst 24-hour physiological values."
              references="Knaus WA, et al. APACHE II: a severity of disease classification system."
              lang={lang}
            />
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
