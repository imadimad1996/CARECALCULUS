import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLang } from '../utils/lang';

/**
 * Adsterra Native Banner Component
 * 
 * Safely injects the Adsterra native banner script into the React lifecycle.
 * The script uses the unique container ID to render the ad.
 * Automatically falls back to a premium internal promotional card if the ad is blocked.
 */
export default function AdsterraNativeBanner() {
  const { lang, langPath } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const [adBlocked, setAdBlocked] = useState(() => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('local');
  });

  useEffect(() => {
    // Prevent duplicate script injections during React StrictMode or re-renders
    if (scriptLoaded.current || document.getElementById('adsterra-native-banner-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'adsterra-native-banner-script';
    script.type = 'text/javascript';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl29869264.effectivecpmnetwork.com/44cfd4429085b087e60c41dbe6b342fe/invoke.js';

    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, []);

  useEffect(() => {
    // 2-second timeout to check if the Adsterra script ran and filled the container
    const timer = setTimeout(() => {
      if (containerRef.current && containerRef.current.children.length === 0) {
        setAdBlocked(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (adBlocked) {
    const isRtl = lang === 'ar';
    return (
      <div 
        className="w-full max-w-[650px] mx-auto bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100/60 rounded-2xl p-5 my-8 flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300 hover:shadow-xs hover:border-indigo-200/80"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex items-start gap-3.5 text-right md:text-left">
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 justify-center md:justify-start">
              {lang === 'fr' 
                ? 'Hub de Référence Clinique GLP-1' 
                : (lang === 'ar' ? 'مركز معلومات أدوية GLP-1 السريري' : 'GLP-1 Reference Hub')}
            </h4>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              {lang === 'fr' 
                ? 'Découvrez les calculateurs de doses de sémaglutide, tirzépatide et les protocoles de traitement.' 
                : (lang === 'ar' ? 'استكشف أحدث حاسبات جرعات أدوية السكري والتخسيس المعتمدة علميًا.' : 'Semaglutide/Tirzepatide dosage guidelines, calculators, and clinical protocols.')}
            </p>
          </div>
        </div>
        <Link 
          to={langPath('/glp-1-hub')} 
          className="shrink-0 w-full md:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
          style={{ minHeight: '40px' }}
        >
          <span>{lang === 'fr' ? 'Accéder au Hub' : (lang === 'ar' ? 'دخول المركز' : 'Explore Hub')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-8">
      {/* Adsterra requires this exact ID for the native banner to render */}
      <div id="container-44cfd4429085b087e60c41dbe6b342fe" ref={containerRef}></div>
    </div>
  );
}
