import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../utils/lang';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { lang, langPath } = useLang();

  useEffect(() => {
    const consent = localStorage.getItem('carecalculus-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('carecalculus-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('carecalculus-cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const t = {
    en: {
      title: 'Your Privacy Matters',
      desc: 'We use cookies and similar technologies to improve your experience, measure performance, and serve relevant advertisements via Google AdSense. By clicking "Accept", you consent to our use of cookies.',
      accept: 'Accept All',
      decline: 'Decline Optional',
      privacy: 'Privacy Policy',
    },
    fr: {
      title: 'Votre vie privée compte',
      desc: 'Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience, mesurer les performances et diffuser des annonces pertinentes via Google AdSense. En cliquant sur "Accepter", vous consentez à notre utilisation des cookies.',
      accept: 'Tout accepter',
      decline: 'Refuser les optionnels',
      privacy: 'Politique de confidentialité',
    }
  }[lang] || {
    title: 'Your Privacy Matters',
    desc: 'We use cookies and similar technologies to improve your experience, measure performance, and serve relevant advertisements via Google AdSense. By clicking "Accept", you consent to our use of cookies.',
    accept: 'Accept All',
    decline: 'Decline Optional',
    privacy: 'Privacy Policy',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 sm:p-6 pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-6">
        
        <div className="flex-1 flex gap-4">
          <div className="hidden sm:flex shrink-0 p-3 bg-teal-50 text-teal-600 rounded-xl h-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 sm:hidden text-teal-600" />
              {t.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t.desc} <Link to={langPath('/privacy')} className="text-teal-600 hover:text-teal-800 underline underline-offset-2">{t.privacy}</Link>.
            </p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3 shrink-0">
          <button 
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            {t.decline}
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-500/20 transition-all active:scale-95 cursor-pointer"
          >
            {t.accept}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ml-1 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
