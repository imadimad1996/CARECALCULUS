import React from 'react';
import { LangCode } from '../types';
import Logo from './Logo';

interface EmbedLayoutProps {
  children: React.ReactNode;
  lang: LangCode;
  calculatorSlug: string;
}

export default function EmbedLayout({ children, lang, calculatorSlug }: EmbedLayoutProps) {
  const isRtl = false;
  
  // Base URL pointing back to the main site for attribution
  const attributionUrl = `https://carecalculus.com${lang === 'en' ? '' : '/' + lang}/${calculatorSlug}`;

  return (
    <div 
      className="min-h-screen bg-slate-50 overflow-x-hidden flex flex-col font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={lang}
    >
      <main className="flex-grow flex flex-col p-2 sm:p-4">
        {/* Render the core calculator without standard header/footer */}
        <div className="flex-1 w-full max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Powered by CareCalculus Attribution Footer */}
      <footer className="mt-auto py-3 px-4 bg-white border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {lang === 'fr' ? 'Propulsé par' : 'Powered by'}
            </span>
            <div className="scale-75 origin-left">
              <Logo />
            </div>
          </div>
          <a 
            href={attributionUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition hover:underline"
          >
            {lang === 'fr' ? 'Utiliser sur CareCalculus.com' : 'Use on CareCalculus.com'}
          </a>
        </div>
      </footer>
    </div>
  );
}
