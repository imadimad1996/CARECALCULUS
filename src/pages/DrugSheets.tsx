import React, { useState, useEffect } from 'react';
import { Download, AlertTriangle, Search, Loader2 } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export interface DrugInfo {
  name: string;
  indication: string;
  dose: string;
  concentration: string;
  notes: string;
  class: string;
}

const T = {
  en: {
    printTitle: "CareCalculus Bedside Drug Guideline Matrix",
    printSubtitle: "Printed 2026 — Verified ICU Reference",
    badge: "CRITICAL CARE NODE"
  },
  fr: {
    printTitle: "Matrice des Lignes Directrices des Médicaments au Chevet CareCalculus",
    printSubtitle: "Imprimé 2026 — Référence Réanimation Validée",
    badge: "REANIMATION COMPORTEMENT"
  }
};

export default function DrugSheets({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;
  const [filter, setFilter] = useState('');
  const t = T[lang] || T.en;

  const [drugs, setDrugs] = useState<DrugInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch massive database asynchronously to avoid JS bundle bloat
    const fetchData = async () => {
      try {
        const response = await fetch('/data/massive_drugs_db.json');
        const data = await response.json();
        setDrugs(data);
      } catch (error) {
        console.error("Failed to load massive drugs DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = filter.trim().length === 0 
    ? drugs.slice(0, 50) 
    : drugs.filter(d => 
        d.name.toLowerCase().includes(filter.toLowerCase()) ||
        d.class.toLowerCase().includes(filter.toLowerCase())
      ).slice(0, 100);

  return (
    <div className="w-full max-w-full max-w-4xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4 print:hidden">
        <div>
          <span className="text-[10px] font-mono font-black text-red-600 uppercase tracking-widest">
            {lang === 'fr' ? 'PHARMACOLOGIE EN SOINS CRITIQUES' : isRtl ? 'دليل جرعات أدوية الطوارئ والإنعاش' : 'CRITICAL CARE PHARMACOLOGY'}
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            {lang === 'fr' ? 'Fiches de Référence Médicaments' : isRtl ? 'دليل جرعات أدوية الطوارئ' : 'ICU Drug Reference Sheets'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {lang === 'fr' ? 'Tableaux de posologie et alertes cliniques imprimables.' : isRtl ? 'جدول جرعات أدوية العناية المركزة الجاهز للطباعة والتحميل.' : 'Printable bedside dosing guidelines, infusion velocities, and critical warnings.'}
          </p>
        </div>
        
        <button 
          onClick={() => window.print()}
          className="shrink-0 flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95"
          style={{ minHeight: '40px' }}
        >
          <Download className="w-4 h-4" />
          <span>PRINT SHEET (PDF)</span>
        </button>
      </div>

      <div className="relative mb-6 print:hidden">
        <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
        <input
          type="text"
          placeholder="Search ICU drug name or class (e.g. Sedative)..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full py-2.5 bg-white border border-gray-200 outline-none rounded-xl text-xs font-bold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'}`}
          style={{ minHeight: '40px' }}
        />
      </div>

      {/* Printable Sheet */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-xs print:border-none print:shadow-none print:p-0">
        <div className="hidden print:flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">{t.printTitle}</h2>
            <p className="text-[10px] text-gray-400">{t.printSubtitle}</p>
          </div>
          <span className="text-xs font-bold text-red-600 font-mono">{t.badge}</span>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400 space-y-4">
             <Loader2 className="w-8 h-8 animate-spin text-red-500" />
             <p className="text-xs font-semibold">Loading massive drug database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="text-[10px] text-gray-400 font-mono font-bold uppercase mb-4 print:hidden">
              Showing top {filtered.length} drugs of {drugs.length} total
            </div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-mono font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Drug Name</th>
                  <th className="py-3 px-2">Indication</th>
                  <th className="py-3 px-2">Dosing Range</th>
                  <th className="py-3 px-2">Concentration</th>
                  <th className="py-3 px-2">Critical Alerts</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((drug, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/40">
                    <td className="py-4 px-2">
                      <div className="font-black text-slate-800">{drug.name}</div>
                      <div className="text-[9px] font-mono font-bold text-red-600 uppercase mt-0.5">{drug.class}</div>
                    </td>
                    <td className="py-4 px-2 font-semibold text-gray-500">{drug.indication}</td>
                    <td className="py-4 px-2 font-mono font-bold text-blue-600">{drug.dose}</td>
                    <td className="py-4 px-2 font-mono text-gray-650">{drug.concentration}</td>
                    <td className="py-4 px-2 text-gray-500 leading-normal flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                      <span>{drug.notes}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 font-semibold">
                      No drug matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
