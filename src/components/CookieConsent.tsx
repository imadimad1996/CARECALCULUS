import React, { useState, useEffect } from 'react';
import { LangCode } from '../types';

export default function CookieConsent({ lang }: { lang: LangCode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('carecalculus-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('carecalculus-cookie-consent', accepted ? 'true' : 'false');
    setIsVisible(false);
  };

  const text = {
    en: {
      msg: 'We use cookies and similar technologies to enhance your clinical browsing experience and analyze traffic. By clicking "Accept", you consent to our use of cookies.',
      accept: 'Accept',
      decline: 'Decline'
    },
    fr: {
      msg: 'Nous utilisons des cookies pour améliorer votre expérience de navigation clinique et analyser notre trafic. En cliquant sur "Accepter", vous consentez à notre utilisation des cookies.',
      accept: 'Accepter',
      decline: 'Refuser'
    }
  };

  const t = text[lang];

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] bg-slate-900 border-t border-slate-700 shadow-2xl p-4 sm:p-6 text-white text-sm" dir={'ltr'}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-300 leading-relaxed text-[13px] flex-1">
          {t.msg}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleConsent(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
