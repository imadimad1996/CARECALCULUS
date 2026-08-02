import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';

export interface Abbreviation {
  term: string;
  en: string;
  fr: string;
  category: string;
}

export default function AbbreviationLookup({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = false;
  const [search, setSearch] = useState('');
  
  const [abbreviations, setAbbreviations] = useState<Abbreviation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch massive database asynchronously to avoid JS bundle bloat
    const fetchData = async () => {
      try {
        const response = await fetch('/data/massive_abbreviations_db.json');
        const data = await response.json();
        setAbbreviations(data);
      } catch (error) {
        console.error("Failed to load massive abbreviations DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter based on search and limit to 50 results to prevent DOM lag on huge dataset
  const filtered = search.trim().length === 0 
    ? abbreviations.slice(0, 50) 
    : abbreviations.filter(item => 
        item.term.toLowerCase().includes(search.toLowerCase()) || 
        item.en.toLowerCase().includes(search.toLowerCase()) || 
        item.fr.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 50);

  return (
    <div className="w-full max-w-full max-w-3xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-8 text-center sm:text-left">
        <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest">
          {lang === 'fr' ? 'INDEX CLINIQUE EXPRESS' : isRtl ? 'القاموس الطبي للمصطلحات والاختصارات' : 'CLINICAL REFERENCE DICTIONARY'}
        </span>
        <h1 className="text-3xl font-black text-slate-900 mt-1">
          {lang === 'fr' ? 'Dictionnaire des Abréviations' : isRtl ? 'قاموس الاختصارات الطبية' : 'Medical Abbreviation Lookup'}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          {lang === 'fr' ? 'Recherche rapide d\'abréviations cliniques aux urgences et réanimation.' : isRtl ? 'البحث الفوري عن الاختصارات الطبية الشائعة في الطوارئ والعناية المركزة.' : 'Rapidly translate critical abbreviations used in ICU charts and medical reports.'}
        </p>
      </div>

      <div className="relative mb-6">
        <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
        <input
          type="text"
          placeholder={lang === 'fr' ? "Rechercher une abréviation (ex: GCS)..." : isRtl ? "ابحث هنا عن اختصار (مثال: GCS)..." : "Type medical abbreviation (e.g. ARDS)..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full py-2.5 bg-white border border-gray-200 outline-none rounded-xl text-xs font-bold transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'}`}
          style={{ minHeight: '40px' }}
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 space-y-3 shadow-xs">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 space-y-4">
             <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
             <p className="text-xs font-semibold">Loading massive database...</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="text-[10px] text-gray-400 font-mono font-bold uppercase mb-2">
              Showing top {filtered.length} results of {abbreviations.length} total
            </div>
            {filtered.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5 flex flex-col justify-between hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900 font-mono">{item.term}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[9px] font-mono font-bold uppercase">{item.category}</span>
                </div>
                <div className="text-xs font-semibold space-y-1 text-gray-600">
                  <p><span className="text-gray-400 font-mono">EN:</span> {item.en}</p>
                  <p><span className="text-gray-400 font-mono">FR:</span> {item.fr}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="p-8 text-center text-gray-400 font-semibold">
            {lang === 'fr' ? 'Aucune abréviation correspondante' : isRtl ? 'لا توجد اختصارات تطابق بحثك' : 'No abbreviation matches found.'}
          </div>
        )}
      </div>
    </div>
  );
}
