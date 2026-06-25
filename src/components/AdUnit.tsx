import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { useLang } from '../utils/lang';
import AdsterraNativeBanner from './AdsterraNativeBanner';

/**
 * CareCalculus Responsive Google AdSense / Programmatic Ad Unit
 *
 * Renders an AdSense responsive banner unit.
 * Automatically falls back to a premium internal clinical resources banner
 * if the ad script fails to load, is blocked, or publisher ID is default.
 */

// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Google AdSense Publisher ID
export const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX';
export const ADSENSE_LEADERBOARD_SLOT = '1234567890'; // Replace with actual leaderboard Slot ID
export const ADSENSE_SIDEBAR_SLOT = '1122334455'; // Replace with actual sidebar Slot ID

export type AdFormat = 'leaderboard' | 'in-article' | 'sidebar';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  if (format === 'in-article') {
    return <AdsterraNativeBanner />;
  }

  const { lang, langPath } = useLang();
  
  // Default to blocked/fallback if developer publisher ID hasn't been set, 
  // or if we are in local development to display fallback previews.
  const [adBlocked, setAdBlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('local');
    return isLocal || ADSENSE_PUBLISHER_ID === 'ca-pub-XXXXXXXXXXXXXXXX';
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (adBlocked) return;

    // Check if AdSense is loaded and push the ad
    const loadAd = () => {
      if (initialized.current) return;
      
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        initialized.current = true;
      } catch (e) {
        console.warn('AdSense push failed:', e);
        setAdBlocked(true);
      }
    };

    // Give AdSense 1.5 seconds to load or verify if blocked
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

  if (format === 'sidebar') {
    if (adBlocked) {
      return (
        <div className={`bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden select-none text-left ${className}`}>
          <div className="absolute top-0 right-0 p-1.5 bg-amber-50 text-[7px] font-black font-mono text-amber-500 uppercase tracking-widest rounded-bl-xl border-l border-b border-amber-100">
            {lang === 'fr' ? 'PARTENAIRE SANTÉ' : (lang === 'ar' ? 'شريك طبي' : 'HEALTHCARE PARTNER')}
          </div>
          
          <div className="space-y-4">
            <span className="text-[9px] font-mono font-black text-amber-600 uppercase tracking-widest block pt-1">
              {lang === 'fr' ? 'ÉVÈNEMENT DE FORMATION MÉDICALE' : (lang === 'ar' ? 'المؤتمر والتعليم الطبي المستمر' : 'FEATURED CME EVENT')}
            </span>
            
            <div className="w-full h-24 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl relative overflow-hidden flex items-center justify-center p-3 text-center text-white border border-slate-800">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="space-y-1 text-center">
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  Oct 14-16, 2026 • Geneva
                </span>
                <h5 className="text-[10px] sm:text-xs font-black uppercase tracking-tight text-white leading-tight">
                  Annual Resuscitation Council Summit™
                </h5>
              </div>
            </div>

            <p className="text-[10px] text-gray-500 leading-normal font-semibold">
              {lang === 'fr'
                ? 'Rejoignez 3 000 cardiologues à Genève pour débattre de la pression artérielle moyenne et de la ventilation en réanimation.'
                : (lang === 'ar' ? 'شارك مع ٣٠٠٠ طبيب قلب وعنائية مركزة حول العالم لمناقشة أحدث آليات تنظيم الضغط الشرياني الاصطناعي والتنفس الميكانيكي.' : 'Join 3,000 global cardiologists and intensivists to debate targeted mean arterial pressure and low tidal volume ventilation updates.')}
            </p>

            <button 
              onClick={() => window.open('https://diagnostics.roche.com', '_blank', 'noopener,noreferrer')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase rounded-xl transition shadow-xs cursor-pointer active:scale-95"
            >
              {lang === 'fr' ? 'S\'inscrire en ligne' : (lang === 'ar' ? 'التسجيل عبر الإنترنت' : 'Register Online')}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight: '250px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', maxWidth: '300px', height: '250px' }}
          data-ad-client={ADSENSE_PUBLISHER_ID}
          data-ad-slot={ADSENSE_SIDEBAR_SLOT}
          data-ad-format="rectangle"
        />
      </div>
    );
  }

  if (adBlocked) {
    const isRtl = lang === 'ar';
    return (
      <div 
        className={`w-full max-w-[728px] mx-auto bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-xs ${className}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center gap-3 text-right sm:text-left">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              {lang === 'fr' 
                ? 'Cours Cliniques & Livres PDF FMPC' 
                : (lang === 'ar' ? 'دروس وكتب كلية الطب والصيدلة PDF' : 'FMPC Clinical Courses & PDF Books')}
            </h4>
            <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
              {lang === 'fr' 
                ? 'Accédez aux supports d\'études officiels en réanimation et urgences.' 
                : (lang === 'ar' ? 'احصل على الحقيبة التعليمية الكاملة لطب الطوارئ والعناية المركزة.' : 'Access official study materials compiled by medical faculty specialists.')}
            </p>
          </div>
        </div>
        <Link 
          to={langPath('/fmp-medecine')} 
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold rounded-xl border border-blue-700 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
          style={{ minHeight: '38px' }}
        >
          <span>{lang === 'fr' ? 'Consulter' : (lang === 'ar' ? 'تصفح الآن' : 'View Library')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    );
  }

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; overflow: hidden; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '3c062c9261b205d552d240d01fa0a70e',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/3c062c9261b205d552d240d01fa0a70e/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight: '90px' }}>
      <iframe
        ref={iframeRef}
        title="Advertisement"
        srcDoc={srcDoc}
        width="728"
        height="90"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        scrolling="no"
      />
    </div>
  );
}
