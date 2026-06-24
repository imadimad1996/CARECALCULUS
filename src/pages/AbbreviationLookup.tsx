import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import { ABBREVIATIONS_DB } from '../utils/abbreviationDb';

export default function AbbreviationLookup({ lang }: { lang: LangCode }) {
  const { langPath } = useLang();
  const isRtl = lang === 'ar';
  const [search, setSearch] = useState('');

  const filtered = ABBREVIATIONS_DB.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) || 
    item.en.toLowerCase().includes(search.toLowerCase()) || 
    item.fr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto py-6 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
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
          className={`w-full py-2.5 bg-white border border-gray-200 outline-none rounded-xl text-xs font-bold transition-all ${isRtl ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4 text-left'}`}
          style={{ minHeight: '40px' }}
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 space-y-3 shadow-xs">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 font-mono">{item.term}</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-[9px] font-mono font-bold uppercase">{item.category}</span>
              </div>
              <div className="text-xs font-semibold space-y-1 text-gray-600">
                <p><span className="text-gray-400 font-mono">EN:</span> {item.en}</p>
                <p><span className="text-gray-400 font-mono">FR:</span> {item.fr}</p>
                <p className="text-right" dir="rtl"><span className="text-gray-400 font-mono">AR:</span> {item.ar}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-400 font-semibold">
            {lang === 'fr' ? 'Aucune abréviation correspondante' : isRtl ? 'لا توجد اختصارات تطابق بحثك' : 'No abbreviation matches found.'}
          </div>
        )}
      </div>
    </div>
  );
}
