import React from 'react';
import { UserCheck, ShieldCheck, ExternalLink } from 'lucide-react';

export interface MedicalReviewer {
  name: string;
  credentials: string[];
  role: string;
  institution?: string;
  avatarUrl?: string;
  profileUrl?: string;
  lastReviewed: string;
}

interface MedicalReviewerCardProps {
  reviewer: MedicalReviewer;
  lang?: 'en' | 'fr' | 'ar';
}

export const MedicalReviewerCard: React.FC<MedicalReviewerCardProps> = ({ reviewer, lang = 'en' }) => {
  const isRtl = false;

  const t = {
    reviewedBy: { en: 'Medically Reviewed By', fr: 'Révisé Médicalement Par' },
    lastUpdated: { en: 'Last updated:', fr: 'Dernière mise à jour :' },
    viewProfile: { en: 'View Full Profile', fr: 'Voir le Profil Complet' }
  };

  return (
    <div className="mt-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 overflow-hidden relative" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-start gap-5 relative z-10">
        
        {/* Avatar */}
        <div className="shrink-0 relative">
          {reviewer.avatarUrl ? (
            <img 
              src={reviewer.avatarUrl} 
              alt={reviewer.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-slate-400" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1 border-2 border-white shadow-sm" title="Verified Medical Reviewer">
            <ShieldCheck className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-700">
              {t.reviewedBy[lang]}
            </span>
          </div>
          
          <h4 className="text-base font-bold text-slate-900 mb-1 truncate">
            {reviewer.name}
            {reviewer.credentials.length > 0 && (
              <span className="text-slate-500 font-normal ml-1">
                , {reviewer.credentials.join(', ')}
              </span>
            )}
          </h4>
          
          <div className="text-sm text-slate-600 mb-3 leading-snug">
            {reviewer.role}
            {reviewer.institution && (
              <span className="opacity-80"> • {reviewer.institution}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="text-xs text-slate-500 font-medium">
              {t.lastUpdated[lang]} <span className="text-slate-700">{reviewer.lastReviewed}</span>
            </div>
            
            {reviewer.profileUrl && (
              <a 
                href={reviewer.profileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
              >
                {t.viewProfile[lang]}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
