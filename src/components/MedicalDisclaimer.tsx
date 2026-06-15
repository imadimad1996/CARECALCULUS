import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
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
      title: "Medical Disclaimer",
      warning: "For Educational & Reference Use Only",
      body: "CareCalculus is designed to assist healthcare professionals. It is NOT a substitute for clinical judgment, and it does not provide medical advice. By continuing, you acknowledge that any decisions made based on this tool's output are solely the responsibility of the treating clinician.",
      accept: "I Understand & Accept"
    },
    fr: {
      title: "Avertissement Médical",
      warning: "À usage éducatif et de référence uniquement",
      body: "CareCalculus est conçu pour aider les professionnels de santé. Ce n'est PAS un substitut au jugement clinique et il ne fournit pas de conseils médicaux. En continuant, vous reconnaissez que toute décision prise sur la base des résultats de cet outil relève de la seule responsabilité du clinicien.",
      accept: "Je Comprends et J'accepte"
    },
    ar: {
      title: "إخلاء المسؤولية الطبية",
      warning: "للاستخدام التعليمي والمرجعي فقط",
      body: "تم تصميم CareCalculus لمساعدة المتخصصين في الرعاية الصحية. ولا يعد بديلاً عن الحكم السريري، ولا يقدم استشارات طبية. باستمرارك، فإنك تقر بأن أي قرارات تتخذ بناءً على نتائج هذه الأداة هي مسؤولية الطبيب المعالج وحده.",
      accept: "أفهم وأوافق"
    }
  };

  const currentText = texts[lang];
  const isRtl = lang === 'ar';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 md:p-8 space-y-6">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{currentText.title}</h2>
            <p className="text-sm font-bold text-red-600 uppercase tracking-widest">{currentText.warning}</p>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 leading-relaxed text-center font-medium">
              {currentText.body}
            </p>
          </div>

          <button
            onClick={handleAccept}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{currentText.accept}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
