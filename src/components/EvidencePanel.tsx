import React from 'react';
import { BookOpen } from 'lucide-react';
import { LangCode } from '../types';

export default function EvidencePanel({ lang, references }: { lang: LangCode, references?: string[] }) {
  const isRtl = false;
  
  const title = {
    en: 'Evidence & Literature',
    fr: 'Preuves & Littérature'
  };

  if (!references || references.length === 0) return null;

  return (
    <div className="mt-8 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-6 shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-slate-500" />
        {title[lang]}
      </h3>
      <ul className="space-y-3">
        {references.map((ref, idx) => (
          <li key={idx} className="text-xs text-slate-600 leading-relaxed pl-6 relative">
            <span className="absolute left-0 top-0 text-slate-400 font-mono font-medium">{idx + 1}.</span>
            {ref}
          </li>
        ))}
      </ul>
    </div>
  );
}
