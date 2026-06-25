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
    if (typeof window === 'undefined') return false;
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
        className="w-full max-w-[650px] mx-auto my-8 bg-gradient-to-br from-indigo-50/80 to-blue-50/50 border border-indigo-100 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xs group"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="absolute top-0 right-0 p-1.5 bg-indigo-100 text-[8px] font-black font-mono text-indigo-500 uppercase tracking-widest rounded-bl-xl border-l border-b border-indigo-200">
          {lang === 'fr' ? 'Recommandé' : (lang === 'ar' ? 'موصى به' : 'Featured Resource')}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white border border-indigo-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-8 h-8 text-indigo-500" />
          </div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              {lang === 'fr' 
                ? 'Le Guide GLP-1 : Nutrition & Masse Musculaire' 
                : (lang === 'ar' ? 'الدليل السريري: التغذية وكتلة العضلات مع حقن التخسيس' : 'The GLP-1 Diet Blueprint')}
            </h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              {lang === 'fr'
                ? 'Protégez vos patients contre la sarcopénie induite par les agonistes du GLP-1. Un protocole basé sur l\'E-E-A-T.'
                : (lang === 'ar' ? 'احمِ مرضاك من فقدان الكتلة العضلية الناتج عن أدوية التخسيس ببروتوكول معتمد علمياً.' : 'Protect patients from GLP-1 induced sarcopenia with this E-E-A-T validated protocol.')}
            </p>
          </div>
          <Link 
            to={langPath('/blog/glp-1-diet-blueprint')}
            className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-xl shadow-xs transition-colors"
          >
            <span>{lang === 'fr' ? 'Lire le Guide' : (lang === 'ar' ? 'اقرأ الدليل' : 'Read Guide')}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </Link>
        </div>
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
