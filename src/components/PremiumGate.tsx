import React, { useState, useEffect } from 'react';
import { Lock, FileText, Download, Bell, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Shield, Star } from 'lucide-react';
import { LangCode } from '../types';
import { isProActive } from '../utils/pro';
import { useNavigate } from 'react-router-dom';
import { trackPremiumGateView, trackPremiumUpgradeClick } from '../utils/telemetry';

interface PremiumGateProps {
  featureName: string;
  lang: LangCode;
  children?: React.ReactNode;
}

export default function PremiumGate({ featureName, lang, children }: PremiumGateProps) {
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const proStatus = isProActive();
    setIsPro(proStatus);
    
    // Only track the view if they are NOT pro
    if (!proStatus) {
      trackPremiumGateView(featureName);
    }
    
    const handleStorageChange = () => setIsPro(isProActive());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [featureName]);
  
  if (isPro && children) {
    return <>{children}</>;
  }
  
  const content = {
    en: {
      badge: 'CARECALCULUS PRO',
      title: `Save 30 mins/shift with 1-Click ${featureName}`,
      description: 'Stop typing the same clinical scores manually. Export perfectly formatted DotPhrases and SBAR notes directly into Epic or Cerner with a single tap.',
      upgrade: 'Get Pro & Save Time',
      subCTA: 'Only $1.66/mo (billed annually at $19.99)',
      socialProof: 'Trusted by 10,000+ Clinicians',
      features: ['1-Click Epic/Cerner Formatted Export', 'Unlimited Local Shift Patient Queue', 'Full Offline PWA (Works in basements)', '100% Ad-Free Experience'],
      hipaa: '100% HIPAA Compliant — All data stays local in browser',
      guarantee: '1-Time Payment • Non-Renewing Pass'
    },
    fr: {
      badge: 'CARECALCULUS PRO',
      title: `Gagnez 30 min/garde avec l'Export ${featureName}`,
      description: 'Ne retapez plus jamais les mêmes scores. Copiez des notes formatées parfaitement pour votre logiciel clinique en un seul clic.',
      upgrade: 'Devenir Pro & Gagner du Temps',
      subCTA: 'Seulement 1,66$/mois (facturé 19,99$ par an)',
      socialProof: 'Approuvé par +10 000 Soignants',
      features: ['Export formaté en 1-clic', 'File d\'attente locale illimitée', 'Mode Hors-ligne intégral PWA', 'Expérience 100% sans publicité'],
      hipaa: '100% Conforme HIPAA — Calculs effectués localement',
      guarantee: 'Paiement Unique • Sans Renouvellement'
    }
  };

  const text = content[lang] || content.en;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden my-8 text-white animate-in fade-in zoom-in-95 duration-500">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-4 right-4 p-4 opacity-20 pointer-events-none">
        <Sparkles className="w-24 h-24 text-cyan-400" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Social Proof */}
        <div className="flex items-center gap-1.5 mb-5 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          </div>
          <span className="text-[11px] font-bold tracking-wide text-slate-300 uppercase">{text.socialProof}</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-4 tracking-tight max-w-2xl leading-tight">
          {text.title}
        </h3>
        <p className="text-slate-300/90 mb-8 max-w-xl text-sm md:text-base leading-relaxed font-medium">
          {text.description}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-10 text-left w-full max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
          {text.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="bg-cyan-500/20 p-1 rounded-full shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200 leading-snug">{feat}</span>
            </div>
          ))}
        </div>

        <div className="w-full max-w-sm flex flex-col items-center">
          <button 
            onClick={() => {
              trackPremiumUpgradeClick(featureName);
              navigate('/pricing');
            }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-black text-lg transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] active:scale-95 cursor-pointer w-full mb-3 border border-cyan-400/30"
          >
            {text.upgrade}
            <ArrowRight className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-cyan-300/90 tracking-wide mb-8">
            {text.subCTA}
          </span>
        </div>

        {/* CRO Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-400 pt-2 border-t border-slate-800/80 w-full max-w-md">
          <span className="flex items-center gap-1.5 text-cyan-300/90">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            {text.hipaa}
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            {text.guarantee}
          </span>
        </div>
      </div>
    </div>
  );
}
