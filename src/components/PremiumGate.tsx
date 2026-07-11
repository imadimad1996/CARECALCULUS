import React, { useState } from 'react';
import { Lock, FileText, Download, Bell, Sparkles, CheckCircle2, LogIn } from 'lucide-react';
import { LangCode } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PremiumGateProps {
  featureName: string;
  lang: LangCode;
  children?: React.ReactNode;
}

export default function PremiumGate({ featureName, lang, children }: PremiumGateProps) {
  const isRtl = lang === 'ar';
  const { user } = useAuth();
  
  if (user && children) {
    return <>{children}</>;
  }
  
  const content = {
    en: {
      title: 'Premium Feature',
      description: `${featureName} is available exclusively to CareCalculus Pro members.`,
      upgrade: 'Upgrade to Pro',
      features: ['PDF export of clinical reports', 'Batch calculations', 'Offline PWA with push notifications', 'Drug interaction alerts'],
    },
    fr: {
      title: 'Fonctionnalité Premium',
      description: `${featureName} est disponible exclusivement pour les membres CareCalculus Pro.`,
      upgrade: 'Passer à la version Pro',
      features: ['Exportation PDF des rapports cliniques', 'Calculs en série', 'PWA hors ligne avec notifications', 'Alertes d\'interactions médicamenteuses'],
    },
    ar: {
      title: 'ميزة بريميوم',
      description: `${featureName} متاح حصرياً لأعضاء CareCalculus Pro.`,
      upgrade: 'الترقية إلى Pro',
      features: ['تصدير تقارير سريرية بتنسيق PDF', 'حسابات مجمعة', 'تطبيق ويب تقدمي (PWA) مع إشعارات', 'تنبيهات التفاعلات الدوائية'],
    }
  };

  const text = content[lang];

  return (
    <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-24 h-24 text-amber-500" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{text.title}</h3>
        <p className="text-slate-600 mb-8 max-w-md">{text.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left w-full max-w-lg">
          {text.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700">{feat}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
          className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-amber-500/30 active:scale-95 outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <LogIn className="w-5 h-5" />
          {lang === 'fr' ? 'Connectez-vous pour accéder' : lang === 'ar' ? 'سجل الدخول للوصول' : 'Sign in to Access'}
        </button>
      </div>
    </div>
  );
}
