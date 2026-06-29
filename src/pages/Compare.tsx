import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Scale, ShieldCheck, ChevronRight } from 'lucide-react';
import { LangCode } from '../types';
import { navItems } from '../routes';
import SEO from '../components/SEO';

interface CompareProps {
  lang: LangCode;
}

const T = {
  en: {
    comparisonGuide: "Clinical Comparison Guide",
    featureComparison: "Feature Comparison",
    feature: "Feature",
    openTool: "Open",
    stdTriage: "Standard protocol for rapid triage",
    validatedGuideline: "Validated in international guidelines",
    detailedCriteria: "Detailed stratification criteria",
    highlySpecific: "Highly specific for complex cases",
    primaryUseCase: "Primary Use Case",
    t1UseCase: "Used for general screening and assessment in {name} contexts.",
    t2UseCase: "Used for specific diagnostic or prognostic evaluation in {name} contexts.",
    complexity: "Complexity Level",
    simple: "Simple",
    advanced: "Advanced",
    timeToAssess: "Time to Assess",
    tierText: "Tier {tier} Tool",
  },
  fr: {
    comparisonGuide: "Guide de Comparaison Clinique",
    featureComparison: "Comparaison des Caractéristiques",
    feature: "Caractéristique",
    openTool: "Ouvrir",
    stdTriage: "Protocole standard pour un triage rapide",
    validatedGuideline: "Validé dans les directives internationales",
    detailedCriteria: "Critères de stratification détaillés",
    highlySpecific: "Très spécifique pour les cas complexes",
    primaryUseCase: "Cas d'usage principal",
    t1UseCase: "Utilisé pour le dépistage général et l'évaluation dans les contextes de {name}.",
    t2UseCase: "Utilisé pour l'évaluation diagnostique ou pronostique spécifique dans les contextes de {name}.",
    complexity: "Niveau de complexité",
    simple: "Simple",
    advanced: "Avancé",
    timeToAssess: "Temps d'évaluation",
    tierText: "Outil Tier {tier}",
  },
  ar: {
    comparisonGuide: "دليل المقارنة السريرية",
    featureComparison: "مقارنة الخصائص",
    feature: "الخاصية",
    openTool: "فتح",
    stdTriage: "البروتوكول القياسي للفرز السريع",
    validatedGuideline: "معتمد في الإرشادات الدولية",
    detailedCriteria: "معايير تصنيف دقيقة للحالات",
    highlySpecific: "محدد للغاية للحالات المعقدة",
    primaryUseCase: "حالة الاستخدام الرئيسية",
    t1UseCase: "يُستخدم للفحص والتقييم العام في سياقات {name}.",
    t2UseCase: "يُستخدم للتقييم التشخيصي أو الإنذاري المحدد في سياقات {name}.",
    complexity: "مستوى التعقيد",
    simple: "بسيط",
    advanced: "متقدم",
    timeToAssess: "وقت التقييم",
    tierText: "أداة من الفئة {tier}",
  }
};

export default function Compare({ lang }: CompareProps) {
  const { slug1, slug2 } = useParams<{ slug1: string; slug2: string }>();
  
  const isRtl = lang === 'ar';
  const t = T[lang] || T.en;

  // Find the tools in navItems
  const tool1 = useMemo(() => navItems.find(item => item.path === `/${slug1}`), [slug1]);
  const tool2 = useMemo(() => navItems.find(item => item.path === `/${slug2}`), [slug2]);

  if (!tool1 || !tool2) {
    return <Navigate to="/" replace />;
  }

  const name1 = lang === 'fr' ? tool1.nameFr : lang === 'ar' ? tool1.nameAr : tool1.nameEn;
  const name2 = lang === 'fr' ? tool2.nameFr : lang === 'ar' ? tool2.nameAr : tool2.nameEn;

  const title = lang === 'fr' ? `${name1} vs ${name2} - Comparaison Clinique` : lang === 'ar' ? `مقارنة: ${name1} ضد ${name2}` : `${name1} vs ${name2} - Clinical Comparison`;
  
  const description = lang === 'fr' 
    ? `Comparez ${name1} et ${name2}. Découvrez quel calculateur médical ou score utiliser selon la situation clinique, les directives et les recommandations d'experts.` 
    : lang === 'ar' 
    ? `قارن بين ${name1} و ${name2}. تعرف على متى تستخدم كل أداة حسابية سريرية بناءً على الإرشادات الطبية وتوصيات الخبراء.` 
    : `Compare ${name1} vs ${name2}. Understand which medical calculator or score to use based on clinical context, guidelines, and expert recommendations.`;

  const comparisonPoints = [
    {
      label: t.primaryUseCase,
      t1: t.t1UseCase.replace('{name}', name1),
      t2: t.t2UseCase.replace('{name}', name2),
    },
    {
      label: t.complexity,
      t1: tool1.tier <= 2 ? t.simple : t.advanced,
      t2: tool2.tier <= 2 ? t.simple : t.advanced,
    },
    {
      label: t.timeToAssess,
      t1: '< 1 min',
      t2: '< 1 min',
    }
  ];

  return (
    <>
      <SEO 
        logicalPath={`/compare/${slug1}-vs-${slug2}`}
        title={title}
        description={description}
        keywords={`${name1}, ${name2}, comparison, medical score vs, ${slug1} vs ${slug2}`}
        lang={lang}
      />
      
      <div className="max-w-4xl mx-auto space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" />
            {t.comparisonGuide}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {name1} <span className="text-gray-400 font-normal italic mx-2">vs</span> {name2}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
 
        {/* Side-by-side Cards */}
        <div className="grid md:grid-cols-2 gap-6 relative">
          {/* Mobile VS Badge */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center font-black text-gray-400 italic hidden md:flex">
            vs
          </div>
 
          {/* Tool 1 Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <tool1.icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{name1}</h2>
            <p className="text-sm text-gray-500 mb-6">{t.tierText.replace('{tier}', String(tool1.tier))}</p>
            
            <div className="w-full flex-grow">
              <ul className={`space-y-3 text-sm text-gray-600 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t.stdTriage}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t.validatedGuideline}</span>
                </li>
              </ul>
            </div>
            
            <Link 
              to={lang === 'en' ? tool1.path : `/${lang}${tool1.path}`}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              {t.openTool} {name1}
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
 
          {/* Tool 2 Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <tool2.icon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{name2}</h2>
            <p className="text-sm text-gray-500 mb-6">{t.tierText.replace('{tier}', String(tool2.tier))}</p>
            
            <div className="w-full flex-grow">
              <ul className={`space-y-3 text-sm text-gray-600 mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t.detailedCriteria}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t.highlySpecific}</span>
                </li>
              </ul>
            </div>
            
            <Link 
              to={lang === 'en' ? tool2.path : `/${lang}${tool2.path}`}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              {t.openTool} {name2}
              <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
 
        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-12">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900">
              {t.featureComparison}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-4 border-b border-gray-200 text-sm font-semibold text-gray-500 w-1/3">{t.feature}</th>
                  <th className="p-4 border-b border-gray-200 text-sm font-bold text-gray-900 w-1/3">{name1}</th>
                  <th className="p-4 border-b border-gray-200 text-sm font-bold text-gray-900 w-1/3">{name2}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {comparisonPoints.map((pt, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-700">{pt.label}</td>
                    <td className="p-4 text-sm text-gray-600">{pt.t1}</td>
                    <td className="p-4 text-sm text-gray-600">{pt.t2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </>
  );
}

