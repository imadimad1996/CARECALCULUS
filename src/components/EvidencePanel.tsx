import React from 'react';
import { BookOpen } from 'lucide-react';
import { LangCode } from '../types';

interface EvidencePanelProps {
  lang: LangCode;
  references?: string[] | string;
}

export default function EvidencePanel({ lang, references }: EvidencePanelProps) {
  const isRtl = false;
  
  const title = {
    en: 'Evidence & Literature',
    fr: 'Preuves & Littérature',
    es: 'Evidencia y Literatura'
  };

  const refList = !references 
    ? [] 
    : Array.isArray(references) 
      ? references.map(item => (typeof item === 'string' ? item.trim() : String(item || ''))).filter(item => item.length > 0)
      : typeof references === 'string' && references.trim() 
        ? (references.includes('\n') ? references.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(s => s.length > 0) : [references.trim()])
        : [];

  if (refList.length === 0) return null;

  return (
    <div className="mt-8 bg-slate-50/50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-slate-500" />
        {title[lang] || title.en}
      </h3>
      <ul className="space-y-3">
        {refList.map((ref, idx) => (
          <li key={idx} className="text-xs text-slate-600 leading-relaxed pl-6 relative">
            <span className="absolute left-0 top-0 text-slate-400 font-mono font-medium">{idx + 1}.</span>
            <span dangerouslySetInnerHTML={{ __html: ref }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

