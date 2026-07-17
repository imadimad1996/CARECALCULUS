import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { LangCode } from '../types';

export default function MedicalDisclaimer({ lang }: { lang: LangCode }) {
  const [accepted, setAccepted] = useState(true); // default true to avoid flash

  useEffect(() => {
    const isAccepted = localStorage.getItem('carecalculus-medical-disclaimer');
    if (!isAccepted) {
      setAccepted(false);
    }
  }, []);

  if (accepted) return null;

  const handleAccept = () => {
    localStorage.setItem('carecalculus-medical-disclaimer', 'true');
    setAccepted(true);
  };

  const texts = {
    en: {
      title: "For educational and reference use only",
      body: "CareCalculus is designed to assist healthcare professionals. It is NOT a substitute for clinical judgment, and it does not provide medical advice. By continuing, you acknowledge that any decisions made based on the results of this tool are the sole responsibility of the clinician.",
      accept: "Accept & Continue"
    },
    fr: {
      title: "À usage éducatif et de référence uniquement",
      body: "CareCalculus est conçu pour aider les professionnels de santé. Ce n'est PAS un substitut au jugement clinique et il ne fournit pas de conseils médicaux. En continuant, vous reconnaissez que toute décision prise sur la base des résultats de cet outil relève de la seule responsabilité du clinicien.",
      accept: "Accepter & Continuer"
    }
  };

  const currentText = texts[lang];
  const isRtl = false;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[100] animate-in slide-in-from-bottom duration-500" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl shrink-0 mt-0.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {currentText.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {currentText.body}
        </p>

        <button
          onClick={handleAccept}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/10"
          style={{ minHeight: '38px' }}
        >
          <span>{currentText.accept}</span>
        </button>
      </div>
    </div>
  );
}

