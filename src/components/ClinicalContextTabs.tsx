import React, { useState } from 'react';
import { Info, AlertTriangle, BookOpen } from 'lucide-react';

export type ClinicalContextType = {
  whenToUse?: React.ReactNode;
  pearlsPitfalls?: React.ReactNode;
  evidence?: React.ReactNode;
};

interface ClinicalContextTabsProps {
  context: ClinicalContextType;
  lang?: 'en' | 'fr' | 'ar';
}

export const ClinicalContextTabs: React.FC<ClinicalContextTabsProps> = ({ context, lang = 'en' }) => {
  const [activeTab, setActiveTab] = useState<'when' | 'pearls' | 'evidence'>('when');

  if (!context.whenToUse && !context.pearlsPitfalls && !context.evidence) {
    return null;
  }

  // Ensure we don't start on an empty tab if 'whenToUse' is missing
  React.useEffect(() => {
    if (activeTab === 'when' && !context.whenToUse) {
      if (context.pearlsPitfalls) setActiveTab('pearls');
      else if (context.evidence) setActiveTab('evidence');
    }
  }, [context]);

  const t = {
    when: { en: 'When to Use', fr: 'Quand utiliser', ar: 'متى تستخدم' },
    pearls: { en: 'Pearls & Pitfalls', fr: 'Perles et Pièges', ar: 'لآلئ ومزالق' },
    evidence: { en: 'Evidence', fr: 'Preuves', ar: 'الأدلة' }
  };

  const isRtl = lang === 'ar';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex border-b border-slate-200 bg-slate-50/50 overflow-x-auto hide-scrollbar">
        {context.whenToUse && (
          <button
            onClick={() => setActiveTab('when')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-bold transition-colors whitespace-nowrap ${
              activeTab === 'when'
                ? 'text-teal-700 bg-white border-b-2 border-teal-600'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <Info className={`w-4 h-4 ${activeTab === 'when' ? 'text-teal-600' : 'text-slate-400'}`} />
            {t.when[lang]}
          </button>
        )}
        
        {context.pearlsPitfalls && (
          <button
            onClick={() => setActiveTab('pearls')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-bold transition-colors whitespace-nowrap ${
              activeTab === 'pearls'
                ? 'text-amber-700 bg-white border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${activeTab === 'pearls' ? 'text-amber-500' : 'text-slate-400'}`} />
            {t.pearls[lang]}
          </button>
        )}

        {context.evidence && (
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3.5 text-[13px] font-bold transition-colors whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'text-indigo-700 bg-white border-b-2 border-indigo-500'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === 'evidence' ? 'text-indigo-500' : 'text-slate-400'}`} />
            {t.evidence[lang]}
          </button>
        )}
      </div>

      <div className="p-6 text-sm text-slate-700 leading-relaxed bg-white min-h-[120px]">
        {activeTab === 'when' && context.whenToUse && (
          <div className="animate-in fade-in duration-300">
            {context.whenToUse}
          </div>
        )}
        {activeTab === 'pearls' && context.pearlsPitfalls && (
          <div className="animate-in fade-in duration-300 prose prose-sm max-w-none prose-slate prose-li:marker:text-amber-500">
            {context.pearlsPitfalls}
          </div>
        )}
        {activeTab === 'evidence' && context.evidence && (
          <div className="animate-in fade-in duration-300">
            {context.evidence}
          </div>
        )}
      </div>
    </div>
  );
};
