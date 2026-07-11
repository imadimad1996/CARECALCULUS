import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { LangCode } from '../types';

export default function ReviewBadge({ lang }: { lang: LangCode }) {
  const isRtl = lang === 'ar';
  
  const text = {
    en: 'Reviewed by CareCalculus Clinical Board',
    fr: 'Validé par le Comité Clinique CareCalculus',
    ar: 'تمت المراجعة من قبل اللجنة الطبية لـ CareCalculus'
  };

  const dateText = {
    en: 'Updated: July 2026',
    fr: 'Mis à jour : Juillet 2026',
    ar: 'آخر تحديث: يوليو 2026'
  };

  return (
    <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 px-3 py-1.5 rounded-full mt-4 w-fit shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <ShieldCheck className="w-4 h-4 text-emerald-600" />
      <span className="text-xs font-semibold text-emerald-800">{text[lang]} • <span className="text-emerald-600 font-medium">{dateText[lang]}</span></span>
    </div>
  );
}
