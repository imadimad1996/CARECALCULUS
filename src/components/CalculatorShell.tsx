import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, FolderHeart, Activity, Layers, ArrowRight, Share2, Copy, Check, FileText, Lock, HelpCircle, BookOpen } from 'lucide-react';
import { LangCode } from '../types';
import AiAnswerPanel from './AiAnswerPanel';
import { MedicalReviewerCard } from './MedicalReviewerCard';
import { REVIEWER_INTENSIVIST } from '../data/reviewers';
import { generateSOAP, generateSBAR, generateDotPhrase, generateShiftHandover, generateCaseShareUrl } from '../utils/soapGenerator';
import { CONDITIONS_DB } from '../data/conditions';
import { SPECIALTIES_DB } from '../data/specialties';
import seoMaps from '../data/seoMaps.json';
import { CalcPageSchemas } from './JsonLd';
import { motion } from 'motion/react';
import { citationsDb } from '../data/citationsDb';

const nameEnMap: Record<string, string> = seoMaps.nameEnMap;
const nameFrMap: Record<string, string> = seoMaps.nameFrMap;
const nameEsMap: Record<string, string> = (seoMaps as any).nameEsMap || {};

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
    specialties: "Spécialités Associées",
    otherTools: "Autres Outils Cliniques",
    readMore: "Voir le Hub"
  },
  es: {
    comparisons: "Comparaciones Clínicas",
    conditions: "Condiciones Asociadas",
    specialties: "Especialidades Relacionadas",
    otherTools: "Calculadoras y Escalas Relacionadas",
    readMore: "Ver Centro de Información"
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
  if (lang === 'es') return cleanName(nameEsMap[path] || nameEnMap[path] || path.substring(1));
  return cleanName(nameEnMap[path] || path.substring(1));
}

export default function CalculatorShell({ logicalPath, lang, children }: CalculatorShellProps) {
  const slug = logicalPath.substring(1); // e.g. "meld-score"
  const isRtl = false;
  const t = T[lang] || T.en;
  const navigate = useNavigate();

  const [calcData, setCalcData] = useState<any>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem('carecalculus_pro_status') === 'active');
    
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

  // After a calculation result is rendered, nudge newsletter capture
  useEffect(() => {
    const handler = () => {
      const shown = localStorage.getItem('cc-newsletter-shown-post-calc');
      const subscribed = localStorage.getItem('cc-newsletter-subscribed');
      const dismissed = localStorage.getItem('cc-newsletter-dismissed');
      if (!shown && !subscribed && !dismissed) {
        localStorage.setItem('cc-newsletter-shown-post-calc', '1');
        window.dispatchEvent(new CustomEvent('cc-show-newsletter'));
      }
    };
    window.addEventListener('cc-calculator-result', handler);
    return () => window.removeEventListener('cc-calculator-result', handler);
  }, []);

  return (
    <div className="relative space-y-8">
      {/* GEO Schema Stack — FAQPage + BreadcrumbList + HowTo + Speakable
           injected on every calculator page. Based on Princeton GEO research:
           FAQPage schema alone boosts AI citation probability by +40%. */}
      <CalcPageSchemas
        name={nameEnMap[logicalPath] || logicalPath.substring(1)}
        description={`Evidence-based ${nameEnMap[logicalPath] || logicalPath.substring(1)} for clinical decision support, validated against international guidelines.`}
        path={logicalPath}
      />

      <div className="relative">
        <AiAnswerPanel logicalPath={logicalPath} lang={lang} />
      </div>

      <div aria-live="polite">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>

      {/* Clinical Evidence & PubMed Citations */}
      {citationsDb[logicalPath] && citationsDb[logicalPath].length > 0 && (
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {lang === 'fr' ? 'Preuves Cliniques & Références' : 'Clinical Evidence & References'}
          </h2>
          <div className="space-y-4">
            {citationsDb[logicalPath].map((cite, i) => (
              <div key={i} className="flex items-start gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                <div className="p-2 min-h-[36px] min-w-[36px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 text-sm mb-1">{cite.title}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-xs leading-relaxed italic">{cite.authors} {cite.journal} {cite.year}</p>
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${cite.pmid}/`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline mt-1.5 inline-flex items-center gap-1"
                  >
                    PubMed ID: {cite.pmid} <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Universal Medical Reviewer E-E-A-T Signal */}
      <MedicalReviewerCard 
        lang={lang}
        reviewer={{
          name: "Dr. Lynda Szczech",
          credentials: ["MD", "MSCE", "FASN", "FNKF"],
          role: "Nephrologist and Medical Reviewer",
          institution: "CareCalculus Medical Board",
          lastReviewed: "July 2026",
          profileUrl: lang === 'en' ? "/editorial-board" : `/${lang}/editorial-board`
        }} 
      />

      {/* Mobile Sticky Result Bar */}
      {calcData && calcData.results && calcData.results.length > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.5)] z-30 px-4 py-3 pb-safe animate-in slide-in-from-bottom-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{calcData.results[0].label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-teal-700 dark:text-teal-400">{calcData.results[0].value}</span>
              {calcData.results[0].unit && <span className="text-xs font-semibold text-teal-600/80 dark:text-teal-500/80">{calcData.results[0].unit}</span>}
            </div>
          </div>
          {calcData.results.length > 1 && (
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{calcData.results[1].label}</span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{calcData.results[1].value}</span>
            </div>
          )}
        </div>
      )}

      {/* Universal Inline EHR & Viral Sharing Bar */}
      {calcData && (
        <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(8,112,184,0.15)] ring-1 ring-white/5 text-white my-8 group" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
                    if (!isPro) {
                      navigate(lang === 'en' ? '/pricing' : `/${lang}/pricing`);
                      return;
                    }
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
                  className={`flex-1 md:flex-initial px-3.5 py-2.5 rounded-xl ${!isPro ? 'bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/40' : 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-white'} font-mono text-xs font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] border border-white/10 hover:border-white/20 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm relative`}
                >
                  {copiedType === type ? (
                    <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Copied!</span>
                  ) : (
                    <>
                      <span>Copy {type === 'soap' ? 'SOAP' : type === 'sbar' ? 'SBAR' : 'DotPhrase'}</span>
                      {!isPro && <Lock className="w-3 h-3 text-cyan-400" />}
                    </>
                  )}
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
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#25D366]/20"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp Handover</span>
              </button>
              
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
                  window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(handoverText)}`, '_blank');
                }}
                className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1E8BC2] text-white font-bold text-xs transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-[#229ED9]/20"
              >
                <Share2 className="w-4 h-4" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic SEO Internal Linking Hub */}
      {(relatedCalculators.length > 0 || matchingComparisons.length > 0 || relatedConditions.length > 0 || relatedSpecialties.length > 0) && (
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Comparisons & Other Calculators */}
            <div className="space-y-6">
              {matchingComparisons.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-teal-600 dark:text-teal-400" />
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
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-slate-200 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 transition-all"
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />
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
                          className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border border-gray-200/60 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 transition-all hover:shadow-sm"
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
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
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
                          className="block p-4 bg-white dark:bg-slate-900 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 border border-gray-200/60 dark:border-slate-700 rounded-2xl transition-all hover:shadow-sm group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold text-sm text-gray-800 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-400">{name}</span>
                            <span className="text-xs text-rose-600 hover:underline flex items-center gap-0.5 font-bold">
                              {t.readMore}
                              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{desc}</p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {relatedSpecialties.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
                          className="px-3.5 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 border border-gray-200/60 dark:border-slate-700 rounded-2xl text-xs font-semibold text-gray-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all hover:shadow-sm"
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

          {/* E-E-A-T Board-Certified Medical Reviewer Card (10/10 Google Trust Signal) */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <MedicalReviewerCard reviewer={REVIEWER_INTENSIVIST} lang={lang} />
          </div>


        </div>
      )}
    </div>
  );
}
