import React, { useState, useEffect } from 'react';
import { Lock, FileText, Download, Bell, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
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
    // Also listen for pro status changes across tabs
    const handleStorageChange = () => setIsPro(isProActive());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  if (isPro && children) {
    return <>{children}</>;
  }
  
  const content = {
    en: {
      title: 'Upgrade to Unlock this Feature',
      description: `${featureName} is available exclusively to CareCalculus Pro members. Save 30 seconds per patient by seamlessly copying beautifully formatted results directly into Epic or Cerner.`,
      upgrade: 'Get Pro Pass',
      features: ['1-Click Epic/Cerner Formatted Export', 'Unlimited Local Shift Patient Queue', 'Full Offline PWA (Works in basements)', '100% Ad-Free Experience'],
    },
    fr: {
      title: 'Passez à la version Pro',
      description: `${featureName} est disponible exclusivement pour les membres CareCalculus Pro. Gagnez 30 secondes par patient en copiant des résultats parfaitement formatés directement dans votre logiciel médical.`,
      upgrade: 'Obtenir le Pass Pro',
      features: ['Export formaté en 1-clic', 'File d\'attente locale illimitée', 'Mode Hors-ligne intégral PWA', 'Expérience 100% sans publicité'],
    }
  };

  const text = content[lang];

  return (
    <div className="bg-slate-900 rounded-3xl p-8 border border-cyan-500/50 shadow-2xl relative overflow-hidden my-6 text-white animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute -top-10 -right-10 p-4 opacity-10">
        <Sparkles className="w-32 h-32 text-cyan-400" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-6 ring-4 ring-cyan-500/10">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3">{text.title}</h3>
        <p className="text-cyan-100/80 mb-8 max-w-md leading-relaxed">{text.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left w-full max-w-lg">
          {text.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <span className="text-sm font-medium text-slate-300">{feat}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-extrabold transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95"
        >
          {text.upgrade}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
