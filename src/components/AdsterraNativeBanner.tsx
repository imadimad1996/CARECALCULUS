import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLang } from '../utils/lang';
import { ADSENSE_PUBLISHER_ID } from './AdUnit';

export const ADSENSE_NATIVE_SLOT = '9876543210'; // Replace with actual native/fluid Slot ID

/**
 * CareCalculus Responsive Google AdSense Native Banner Component
 * 
 * Renders a Google AdSense native fluid ad unit.
 * Automatically falls back to a premium internal promotional card if the ad is blocked.
 */
export default function AdsterraNativeBanner() {
  const { lang, langPath } = useLang();
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const [adBlocked, setAdBlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('local');
    return isLocal || ADSENSE_PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX';
  });

  useEffect(() => {
    if (adBlocked) return;

    const loadAd = () => {
      if (initialized.current) return;
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      } catch (e) {
        console.warn('Native AdSense push failed:', e);
        setAdBlocked(true);
      }
    };

    const timer = setTimeout(() => {
      const isAdBlocked = !(window as any).adsbygoogle || typeof (window as any).adsbygoogle.push !== 'function';
      if (isAdBlocked) {
        setAdBlocked(true);
      } else {
        loadAd();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [adBlocked]);

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
    <div ref={adRef} className="w-full flex justify-center my-8 min-h-[100px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '650px', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={ADSENSE_NATIVE_SLOT}
      />
    </div>
  );
}
