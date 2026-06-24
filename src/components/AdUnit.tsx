import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, GraduationCap, ArrowRight } from 'lucide-react';
import { useLang } from '../utils/lang';
import AdsterraNativeBanner from './AdsterraNativeBanner';

/**
 * CareCalculus Responsive Adsterra Unit
 *
 * Sandboxes Adsterra iframe banners to protect React from `document.write`
 * and dynamically renders the Native Banner format.
 * Automatically falls back to a premium internal clinical resources banner
 * if the ad script fails to load or is blocked.
 */

export type AdFormat = 'leaderboard' | 'in-article';

interface AdUnitProps {
  format: AdFormat;
  className?: string;
}

export default function AdUnit({ format, className = '' }: AdUnitProps) {
  if (format === 'in-article') {
    return <AdsterraNativeBanner />;
  }

  const { lang, langPath } = useLang();
  const [adBlocked, setAdBlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('local');
  });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 2-second timeout to check if the Adsterra iframe succeeded in injecting content
    const timer = setTimeout(() => {
      try {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
          // If the script ran successfully, the iframe body will have newly added ad elements.
          // If blocked, only standard style/script tags will remain.
          const hasActiveAd = Array.from(doc.body.children).some(
            (node) => node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE'
          );
          if (!hasActiveAd) {
            setAdBlocked(true);
          }
        } else {
          setAdBlocked(true);
        }
      } catch (e) {
        // Fall back if security blocks DOM access or another runtime error occurs
        setAdBlocked(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 728x90 Banner
  // We use an iframe with srcDoc to sandbox the Adsterra document.write script.
  // This guarantees it won't crash the React SPA while ensuring it refreshes
  // dynamically on route changes.
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
