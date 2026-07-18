import React, { useState } from 'react';
import CalculatorShell from '../components/CalculatorShell';
import { ShieldCheck, AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import ClinicalExportButton from '../components/ClinicalExportButton';
import { LangCode } from '../types';

const MOCK_DB: Record<string, any> = {
  'amiodarone-simvastatin': { severity: 'severe', message: 'Increased risk of myopathy and rhabdomyolysis. Avoid doses of simvastatin > 20 mg/day.' },
  'warfarin-bactrim': { severity: 'severe', message: 'Bactrim significantly increases INR and bleeding risk by inhibiting warfarin metabolism and altering gut flora.' },
  'sildenafil-nitroglycerin': { severity: 'severe', message: 'Concurrent use can cause profound, refractory hypotension and is contraindicated.' },
  'clopidogrel-omeprazole': { severity: 'moderate', message: 'Omeprazole may reduce the antiplatelet effect of clopidogrel by inhibiting CYP2C19.' },
  'lisinopril-spironolactone': { severity: 'moderate', message: 'Increased risk of hyperkalemia. Monitor serum potassium closely.' }
};

export default function DrugInteractions({ lang }: { lang: LangCode }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const t = {
    en: {
      title: 'Drug Interaction Checker',
      desc: 'Check for interactions between two medications. (MVP Demo)',
      drug1: 'Medication 1',
      drug2: 'Medication 2',
      check: 'Check Interactions',
      noInteraction: 'No major interactions found in our database.',
      severity: {
        severe: 'Severe Interaction (Contraindicated / Major Risk)',
        moderate: 'Moderate Interaction (Monitor / Adjust Dose)',
        mild: 'Mild Interaction (Minor clinical significance)'
      },
      warning: 'DISCLAIMER: This is an MVP demonstration tool. Do not use for actual clinical decision making without consulting a definitive pharmacology database (e.g. Lexicomp, Micromedex).'
    },
    fr: {
      title: 'Vérificateur d\'Interactions',
      desc: 'Vérifiez les interactions entre deux médicaments. (Démo MVP)',
      drug1: 'Médicament 1',
      drug2: 'Médicament 2',
      check: 'Vérifier les Interactions',
      noInteraction: 'Aucune interaction majeure trouvée dans notre base.',
      severity: {
        severe: 'Interaction Sévère (Contre-indiqué / Risque Majeur)',
        moderate: 'Interaction Modérée (Surveiller / Ajuster)',
        mild: 'Interaction Légère (Faible importance clinique)'
      },
      warning: 'AVERTISSEMENT : Outil de démonstration MVP. Ne pas utiliser pour la prise de décision clinique sans consulter une base de données de pharmacologie certifiée.'
    }
  };

  const dict = t[lang as keyof typeof t] || t.en;

  const handleCheck = () => {
    if (!drug1 || !drug2) return;
    const key1 = `${drug1.toLowerCase().trim()}-${drug2.toLowerCase().trim()}`;
    const key2 = `${drug2.toLowerCase().trim()}-${drug1.toLowerCase().trim()}`;
    
    if (MOCK_DB[key1]) setResult(MOCK_DB[key1]);
    else if (MOCK_DB[key2]) setResult(MOCK_DB[key2]);
    else setResult('none');
    
    setSearched(true);
  };

  return (
    <CalculatorShell logicalPath="/drug-interactions" lang={lang}>
      <div className="max-w-3xl relative">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 mb-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          {dict.title}
        </h1>
        <p className="text-slate-500 font-medium mb-8">
          {dict.desc}
        </p>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.drug1}</label>
              <input 
                type="text" 
                value={drug1} 
                onChange={(e) => {setDrug1(e.target.value); setSearched(false);}} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-lg font-semibold transition" 
                placeholder="e.g. Warfarin" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{dict.drug2}</label>
              <input 
                type="text" 
                value={drug2} 
                onChange={(e) => {setDrug2(e.target.value); setSearched(false);}} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl text-lg font-semibold transition" 
                placeholder="e.g. Bactrim" 
              />
            </div>
          </div>
          <button 
            onClick={handleCheck}
            disabled={!drug1 || !drug2}
            className="mt-6 w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition shadow-sm"
          >
            {dict.check}
          </button>
        </div>

        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            {result === 'none' ? (
              <div className="bg-slate-100 text-slate-800 p-6 rounded-3xl border border-slate-200 flex items-start gap-4">
                <Info className="w-8 h-8 text-slate-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">{dict.noInteraction}</h3>
                  <p className="text-slate-600 text-sm">No documented interaction between {drug1} and {drug2} in this MVP database.</p>
                </div>
              </div>
            ) : (
              <div className={`p-6 md:p-8 rounded-3xl shadow-xl text-white ${result.severity === 'severe' ? 'bg-rose-600' : 'bg-amber-500'}`}>
                <div className="flex items-center gap-3 mb-4">
                  {result.severity === 'severe' ? <AlertOctagon className="w-8 h-8 text-white" /> : <AlertTriangle className="w-8 h-8 text-white" />}
                  <h3 className="font-bold text-xl">{dict.severity[result.severity as keyof typeof dict.severity]}</h3>
                </div>
                <div className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-2">
                  {drug1} + {drug2}
                </div>
                <p className="text-lg md:text-xl font-medium leading-relaxed bg-white/10 p-4 rounded-2xl">
                  {result.message}
                </p>
                
                <div className="mt-6">
                  <ClinicalExportButton 
                    title={dict.title}
                    inputs={[
                      { label: "Drug 1", value: drug1 },
                      { label: "Drug 2", value: drug2 }
                    ]}
                    results={[
                      { label: "Interaction Severity", value: result.severity.toUpperCase() },
                      { label: "Details", value: result.message }
                    ]}
                    formula="MVP Database Lookup"
                    disclaimer={dict.warning}
                    references="Lexicomp / Micromedex references"
                    lang={lang}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-semibold text-amber-800">
              {dict.warning}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
