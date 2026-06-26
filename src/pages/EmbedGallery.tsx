import React, { useState } from 'react';
import { navItems } from '../routes';
import { LangCode } from '../types';
import { Code, Copy, CheckCircle2, LayoutTemplate } from 'lucide-react';

export default function EmbedGallery({ lang }: { lang: LangCode }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const embeddableCalculators = navItems.filter(item => 
    !item.path.startsWith('/embed') && 
    !item.path.startsWith('http') &&
    !item.path.includes('conditions') &&
    !['/blog', '/presentations', '/cours', '/compare', '/fmp-medecine'].includes(item.path)
  );

  const getEmbedCode = (path: string) => {
    const fullPath = `https://carecalculus.com/embed${path.startsWith('/') ? path : '/' + path}`;
    return `<iframe src="${fullPath}" width="100%" height="600" frameborder="0" style="border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></iframe>`;
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isRtl = lang === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className={`text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight ${isRtl ? 'leading-normal' : ''}`}>
          Medical Calculators Embed Gallery
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Enhance your EHR, clinical portal, or medical blog by embedding our certified clinical calculators directly into your platform. Free, responsive, and beautifully designed.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {embeddableCalculators.map((calc, idx) => {
          const code = getEmbedCode(calc.path);
          return (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                  <LayoutTemplate className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{calc.nameEn}</h3>
                  <p className="text-sm text-slate-500 mt-1">Embeddable Widget • Fully Responsive</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex-1 border border-slate-100 flex items-center justify-center min-h-[300px] overflow-hidden">
                 <iframe 
                   src={`/embed/${calc.path.replace(/^\//, '')}`}
                   className="w-full h-[400px] border-0 rounded-xl bg-white shadow-sm pointer-events-none transform scale-90 origin-top"
                   title={`${calc.nameEn} Preview`}
                 />
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Code className="w-4 h-4" /> Embed Code
                  </span>
                  <button 
                    onClick={() => handleCopy(calc.path, code)}
                    className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1 hover:text-blue-700 transition-colors"
                  >
                    {copiedId === calc.path ? (
                      <><CheckCircle2 className="w-4 h-4" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy Snippet</>
                    )}
                  </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                  <code className="text-xs text-blue-300 whitespace-nowrap font-mono">
                    {code}
                  </code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
