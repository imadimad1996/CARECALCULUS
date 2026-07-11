import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, FolderHeart, Activity, Layers, ArrowRight, Share2, Copy, Check, FileText } from 'lucide-react';
import { LangCode } from '../types';
import AiAnswerPanel from './AiAnswerPanel';
import { MedicalReviewerCard, MedicalReviewer } from './MedicalReviewerCard';
import { generateSOAP, generateSBAR, generateDotPhrase, generateShiftHandover, generateCaseShareUrl } from '../utils/soapGenerator';
import { CONDITIONS_DB } from '../data/conditions';
import { SPECIALTIES_DB } from '../data/specialties';
import seoMaps from '../data/seoMaps.json';

const nameEnMap: Record<string, string> = seoMaps.nameEnMap;
const nameFrMap: Record<string, string> = seoMaps.nameFrMap;
const nameArMap: Record<string, string> = seoMaps.nameArMap;

interface CalculatorShellProps {
  logicalPath: string;
  lang: LangCode;
  children: React.ReactNode;
}

const T = {
  en: {
    comparisons: "Clinical Comparisons",
    conditions: "Associated Conditions",
    specialties: "Related Specialties",
    otherTools: "Related Calculators & Scores",
    readMore: "View Hub"
  },
  fr: {
    comparisons: "Comparaisons Cliniques",
    conditions: "Pathologies Associées",
    specialties: "Spécialités Connexes",
    otherTools: "Calculateurs & Scores Liés",
    readMore: "Voir le hub"
  }
};

const comparisonsList = [
  'map-calculator-vs-qsofa-score',
  'qsofa-score-vs-sirs-criteria',
  'qsofa-score-vs-sofa-score',
  'glasgow-coma-scale-vs-qsofa-score',
  'curb65-score-vs-qsofa-score',
  'apgar-score-vs-glasgow-coma-scale',
  'creatinine-clearance-vs-meld-score',
  'bmi-calculator-vs-adjusted-body-weight',
  'meld-score-vs-child-pugh-score',
  'mdrd-gfr-vs-ckd-epi-gfr',
  'creatinine-clearance-vs-mdrd-gfr',
  'creatinine-clearance-vs-ckd-epi-gfr',
  'sofa-score-vs-sirs-criteria',
  'pf-ratio-vs-aa-gradient',
  'bmi-calculator-vs-nutrition-tdee',
  'nutrition-must-vs-nutrition-nrs2002'
];

function cleanName(raw: string): string {
  return raw
    .replace(/\s+Calculator/gi, '')
    .replace(/\s+Score/gi, '')
    .replace(/\s+Tool/gi, '')
    .replace(/\s+Screener/gi, '')
    .replace(/\s+Converter/gi, '')
    .trim();
}

function getCalculatorName(path: string, lang: LangCode): string {
  if (lang === 'fr') return cleanName(nameFrMap[path] || path.substring(1));
  if (false) return cleanName(nameArMap[path] || path.substring(1));
  return cleanName(nameEnMap[path] || path.substring(1));
}

export default function CalculatorShell({ logicalPath, lang, children }: CalculatorShellProps) {
  const slug = logicalPath.substring(1); // e.g. "meld-score"
  const isRtl = false;
  const t = T[lang] || T.en;

  const [calcData, setCalcData] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    const handleData = (e: any) => {
      setCalcData(e.detail);
    };
    window.addEventListener('carecalculus:calc-data', handleData);
    return () => window.removeEventListener('carecalculus:calc-data', handleData);
  }, []);

  // Find related conditions
  const relatedConditions = useMemo(() => {
    return CONDITIONS_DB.filter(c => c.calculators.includes(slug));
  }, [slug]);

  // Find related specialties
  const relatedSpecialties = useMemo(() => {
    return SPECIALTIES_DB.filter(s => s.calculators.includes(slug));
  }, [slug]);

  // Find other calculators in the same conditions or specialties
  const relatedCalculators = useMemo(() => {
    const calcPathsSet = new Set<string>();
    relatedConditions.forEach(c => {
      c.calculators.forEach(calcSlug => {
        if (calcSlug !== slug) {
          calcPathsSet.add(`/${calcSlug}`);
        }
      });
    });
    relatedSpecialties.forEach(s => {
      s.calculators.forEach(calcSlug => {
        if (calcSlug !== slug) {
          calcPathsSet.add(`/${calcSlug}`);
        }
      });
    });
    return Array.from(calcPathsSet).filter(p => nameEnMap[p]); // must exist in map
  }, [relatedConditions, relatedSpecialties, slug]);

  // Find comparisons involving this calculator
  const matchingComparisons = useMemo(() => {
    return comparisonsList.filter(comp => {
      const parts = comp.split('-vs-');
      return parts[0] === slug || parts[1] === slug;
    });
  }, [slug]);

  return (
    <div className="relative space-y-8">
      <div className="relative">
        <AiAnswerPanel logicalPath={logicalPath} lang={lang} />
      </div>

      <div>
        {children}
      </div>

      {/* Universal Medical Reviewer E-E-A-T Signal */}
      <MedicalReviewerCard 
        lang={lang}
        reviewer={{
          name: "Dr. Lynda Szczech",
          credentials: ["MD", "MSCE", "FASN", "FNKF"],
          role: "Nephrologist and Medical Reviewer",
          institution: "CareCalculus Medical Board",
          lastReviewed: "July 2026",
          profileUrl: "#"
        }} 
      />

      {/* Universal Inline EHR & Viral Sharing Bar */}
      {calcData && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl text-white my-8" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>EHR SmartPhrase & Shift Handover</span>
              </div>
              <h3 className="text-base font-black text-white">{calcData.title} — Instant Clinical Export</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {(['soap', 'sbar', 'dotphrase'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    const scoreVal = calcData.results?.[0]?.value || '';
                    const interpVal = calcData.results?.length > 1 
                      ? calcData.results.map((r: any) => `${r.label}: ${r.value}${r.unit ? ` ${r.unit}` : ''}`).join(' | ') 
                      : (calcData.results?.[0] ? `${calcData.results[0].label}: ${calcData.results[0].value}${calcData.results[0].unit ? ` ${calcData.results[0].unit}` : ''}` : '');
                    
                    const noteInput = {
                      calculatorName: calcData.title,
                      score: scoreVal,
                      interpretation: interpVal,
                      inputs: calcData.inputs,
                      lang: calcData.lang
                    };
                    
                    let text = '';
                    if (type === 'soap') text = generateSOAP(noteInput);
                    else if (type === 'sbar') text = generateSBAR(noteInput);
                    else text = generateDotPhrase(noteInput);

                    navigator.clipboard.writeText(text).then(() => {
                      setCopiedType(type);
                      setTimeout(() => setCopiedType(null), 2500);
                    });
                  }}
                  className="flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-mono text-xs font-bold transition border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedType === type ? <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied!</span> : <span>Copy {type === 'soap' ? 'SOAP' : type === 'sbar' ? 'SBAR' : 'DotPhrase'}</span>}
                </button>
              ))}

              <button
                onClick={() => {
                  const scoreVal = calcData.results?.[0]?.value || '';
                  const interpVal = calcData.results?.length > 1 
                    ? calcData.results.map((r: any) => `${r.label}: ${r.value}${r.unit ? ` ${r.unit}` : ''}`).join(' | ') 
                    : (calcData.results?.[0] ? `${calcData.results[0].label}: ${calcData.results[0].value}${calcData.results[0].unit ? ` ${calcData.results[0].unit}` : ''}` : '');
                  
                  const noteInput = {
                    calculatorName: calcData.title,
                    score: scoreVal,
                    interpretation: interpVal,
                    inputs: calcData.inputs,
                    lang: calcData.lang
                  };
                  const handoverText = generateShiftHandover(noteInput);
                  const shareUrl = generateCaseShareUrl(window.location.pathname, calcData.inputs);
                  const fullText = `${handoverText}\n\n🔗 *Live Case Link:* ${shareUrl}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(fullText)}`, '_blank');
                }}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Handover</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic SEO Internal Linking Hub */}
      {(relatedCalculators.length > 0 || matchingComparisons.length > 0 || relatedConditions.length > 0 || relatedSpecialties.length > 0) && (
        <div className="mt-16 pt-10 border-t border-slate-200" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Comparisons & Other Calculators */}
            <div className="space-y-6">
              {matchingComparisons.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-600" />
                    {t.comparisons}
                  </h3>
                  <div className="space-y-2">
                    {matchingComparisons.map(comp => {
                      const parts = comp.split('-vs-');
                      const otherSlug = parts[0] === slug ? parts[1] : parts[0];
                      const otherName = getCalculatorName(`/${otherSlug}`, lang);
                      const currentName = getCalculatorName(logicalPath, lang);
                      const prefix = lang === 'en' ? '' : `/${lang}`;
                      
                      return (
                        <Link
                          key={comp}
                          to={`${prefix}/compare/${comp}`}
                          className="flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 rounded-lg text-sm font-medium text-slate-700 hover:text-teal-800 transition-all"
                        >
                          <span>{currentName} vs {otherName}</span>
                          <ArrowRight className={`w-4 h-4 text-slate-400 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {relatedCalculators.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    {t.otherTools}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCalculators.map(path => {
                      const prefix = lang === 'en' ? '' : `/${lang}`;
                      const name = getCalculatorName(path, lang);
                      return (
                        <Link
                          key={path}
                          to={`${prefix}${path}`}
                          className="px-3.5 py-2 bg-white hover:bg-blue-50/50 border border-gray-200/60 rounded-2xl text-xs font-semibold text-gray-700 hover:text-blue-700 transition-all hover:shadow-sm"
                        >
                          {name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Conditions & Specialties */}
            <div className="space-y-6">
              {relatedConditions.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-rose-500" />
                    {t.conditions}
                  </h3>
                  <div className="space-y-3">
                    {relatedConditions.map(cond => {
                      const prefix = lang === 'en' ? '' : `/${lang}`;
                      const name = lang === 'fr' ? cond.nameFr : cond.nameEn;
                      const desc = lang === 'fr' ? cond.descriptionFr : cond.descriptionEn;
                      
                      return (
                        <Link
                          key={cond.id}
                          to={`${prefix}/conditions/${cond.id}`}
                          className="block p-4 bg-white hover:bg-rose-50/30 border border-gray-200/60 rounded-2xl transition-all hover:shadow-sm group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-sm text-gray-800 group-hover:text-rose-700">{name}</span>
                            <span className="text-xs text-rose-600 hover:underline flex items-center gap-0.5 font-bold">
                              {t.readMore}
                              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{desc}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {relatedSpecialties.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    {t.specialties}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedSpecialties.map(spec => {
                      const prefix = lang === 'en' ? '' : `/${lang}`;
                      const name = lang === 'fr' ? spec.nameFr : spec.nameEn;
                      return (
                        <Link
                          key={spec.id}
                          to={`${prefix}/specialties/${spec.id}`}
                          className="px-3.5 py-2 bg-white hover:bg-emerald-50/50 border border-gray-200/60 rounded-2xl text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-all hover:shadow-sm"
                        >
                          {name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
