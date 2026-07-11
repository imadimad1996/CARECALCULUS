import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { LangCode } from '../types';

interface ReviewerBadgeProps {
  reviewerName: string;
  lang: LangCode;
  date?: string;
}

export default function ReviewerBadge({ reviewerName, lang, date }: ReviewerBadgeProps) {
  const isRtl = false;
  
  const texts = {
    en: { prefix: "Medically Reviewed by", datePrefix: "Updated" },
    fr: { prefix: "Revue Médicale par", datePrefix: "Mis à jour le" }
  };
  
  const currentText = texts[lang];

  return (
    <div className={`inline-flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-100/50 ${isRtl ? 'flex-row-reverse' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className={`flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
        <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700/70">
          {currentText.prefix}
        </span>
        <span className="text-xs font-bold text-emerald-900">
          {reviewerName}
        </span>
        {date && (
          <span className="text-[9px] text-emerald-600/70 mt-0.5">
            {currentText.datePrefix} {date}
          </span>
        )}
      </div>
    </div>
  );
}
