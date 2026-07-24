import React, { useState, useEffect } from 'react';
import { Lock, FileText, Download, Bell, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Shield } from 'lucide-react';
import { LangCode } from '../types';
import { isProActive } from '../utils/pro';
import { useNavigate } from 'react-router-dom';

interface PremiumGateProps {
  featureName: string;
  lang: LangCode;
  children?: React.ReactNode;
}

export default function PremiumGate({ featureName, lang, children }: PremiumGateProps) {
  const [isPro, setIsPro] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsPro(isProActive());
    const handleStorageChange = () => setIsPro(isProActive());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  if (isPro && children) {
    return <>{children}</>;
  }
  
  const content = {
    en: {
      badge: 'CARECALCULUS PRO',
      title: 'Save 30 Seconds Per Patient on EHR Charting',
      description: `${featureName} is reserved for CareCalculus Pro members. Copy perfectly formatted DotPhrases and SBAR notes directly into Epic or Cerner.`,
      upgrade: 'Unlock 1-Click Epic Exports ($9.99)',
      features: ['1-Click Epic/Cerner Formatted Export', 'Unlimited Local Shift Patient Queue', 'Full Offline PWA (Works in basements)', '100% Ad-Free Experience'],
      hipaa: '100% HIPAA Compliant — All data stays local in browser',
      guarantee: '1-Time Payment • Non-Renewing Pass'
    },
    fr: {
      badge: 'CARECALCULUS PRO',
      title: 'Gagnez 30 Secondes par Patient sur Votre Dossier Médical',
      description: `${featureName} est réservé aux membres CareCalculus Pro. Copiez des DotPhrases et notes SBAR directement dans votre logiciel médical.`,
      upgrade: 'Débloquer les Exports 1-Clic (9.99$)',
      features: ['Export formaté en 1-clic pour Epic/Cerner', 'File d\'attente locale illimitée', 'Mode Hors-ligne intégral PWA', 'Expérience 100% sans publicité'],
      hipaa: '100% Conforme HIPAA — Calculs effectués localement',
      guarantee: 'Paiement Unique • Sans Renouvellement Automatique'
    }
  };

  const text = content[lang] || content.en;

  return (
    <div className="bg-slate-900 rounded-3xl p-8 border border-cyan-500/50 shadow-2xl relative overflow-hidden my-6 text-white animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute -top-10 -right-10 p-4 opacity-10">
        <Sparkles className="w-32 h-32 text-cyan-400" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs font-black tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1 rounded-full border border-cyan-500/20 mb-4 inline-block">
          {text.badge}
        </span>
        <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-cyan-500/10">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight max-w-xl">{text.title}</h3>
        <p className="text-slate-300 mb-6 max-w-md text-sm md:text-base leading-relaxed">{text.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left w-full max-w-lg">
          {text.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-slate-300">{feat}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-black text-base transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 cursor-pointer w-full sm:w-auto mb-4"
        >
          {text.upgrade}
          <ArrowRight className="w-5 h-5" />
        </button>

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
