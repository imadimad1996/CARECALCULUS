import React, { useState } from 'react';
import { Code, Check, X } from 'lucide-react';
import { LangCode } from '../../types';

interface EmbedCodeButtonProps {
  calculatorSlug: string;
  lang: LangCode;
  title: string;
}

export default function EmbedCodeButton({ calculatorSlug, lang, title }: EmbedCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isRtl = lang === 'ar';
  
  // Base URL pointing back to the embed route
  const embedUrl = `https://carecalculus.com${lang === 'en' ? '' : '/' + lang}/embed/${calculatorSlug}`;
  
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; max-width: 800px;"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonText = lang === 'fr' ? 'Intégrer à votre site' : lang === 'ar' ? 'تضمين في موقعك' : 'Embed on your site';
  const modalTitle = lang === 'fr' ? `Intégrer : ${title}` : lang === 'ar' ? `تضمين: ${title}` : `Embed: ${title}`;
  const modalDesc = lang === 'fr' 
    ? 'Copiez et collez le code ci-dessous pour intégrer ce calculateur médical gratuitement sur votre propre site web.' 
    : lang === 'ar' 
    ? 'انسخ والصق الكود أدناه لتضمين هذه الحاسبة الطبية مجانًا على موقع الويب الخاص بك.' 
    : 'Copy and paste the code below to embed this medical calculator for free on your own website.';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg text-xs font-semibold transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <Code className="w-3.5 h-3.5" />
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                {modalTitle}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">{modalDesc}</p>
              
              <div className="relative group">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors shadow-sm flex items-center gap-1 text-xs font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        {lang === 'fr' ? 'Copié' : lang === 'ar' ? 'تم النسخ' : 'Copied'}
                      </>
                    ) : (
                      <>
                        <Code className="w-3.5 h-3.5" />
                        {lang === 'fr' ? 'Copier le code' : lang === 'ar' ? 'نسخ الكود' : 'Copy Code'}
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={embedCode}
                  className="w-full h-28 p-3 pt-3 pb-3 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none selection:bg-blue-500/30 text-left"
                  dir="ltr"
                />
              </div>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-blue-800 flex gap-2">
                  <span className="font-bold text-blue-600">i</span>
                  {lang === 'fr' 
                    ? 'Le calculateur s\'adaptera automatiquement à la largeur du conteneur de votre site web. Aucune clé API requise.'
                    : lang === 'ar'
                    ? 'ستتكيف الحاسبة تلقائيًا مع عرض موقع الويب الخاص بك. لا يتطلب مفتاح API.'
                    : 'The calculator will automatically adapt to the width of your website\'s container. No API key required.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
