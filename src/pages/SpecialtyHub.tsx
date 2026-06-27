import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LangCode } from '../types';
import { SPECIALTIES_DB } from '../data/specialties';
import { navItems } from '../routes';
import SEO from '../components/SEO';
import { AlertCircle, ArrowRight } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import SocialShare from '../components/SocialShare';

export default function SpecialtyHub({ lang }: { lang: LangCode }) {
  const { specialtySlug } = useParams<{ specialtySlug: string }>();
  const isRtl = lang === 'ar';

  const specialty = SPECIALTIES_DB.find(s => s.id === specialtySlug);

  if (!specialty) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-bold">Specialty Not Found</h2>
            <p>The medical specialty you are looking for does not exist.</p>
          </div>
        </div>
        <Link to="/" className="mt-6 inline-flex text-blue-600 font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const title = lang === 'fr' ? specialty.nameFr : lang === 'ar' ? specialty.nameAr : specialty.nameEn;
  const description = lang === 'fr' ? specialty.descriptionFr : lang === 'ar' ? specialty.descriptionAr : specialty.descriptionEn;
  
  // SEO optimization
  const seoTitle = `${title} Calculators & Clinical Tools | CareCalculus`;
  const seoDesc = `Access evidence-based medical calculators and clinical decision tools for ${title.toLowerCase()}. ${description}`;
  const Icon = specialty.icon;

  const calculators = specialty.calculators.map(calcPath => 
    navItems.find(item => item.path === `/${calcPath}`)
  ).filter(Boolean) as typeof navItems;

  return (
    <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO 
        logicalPath={`/specialties/${specialtySlug}`} 
        lang={lang} 
        title={seoTitle}
        description={seoDesc}
        keywords={`${title.toLowerCase()} calculators, medical calculators for ${title.toLowerCase()}, clinical tools, care calculus`}
      />
      
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-2">
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="mb-10">
        <SocialShare 
          title={seoTitle} 
          lang={lang} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {calculators.map((calc, i) => {
          const CalcIcon = calc.icon;
          const calcName = lang === 'fr' ? calc.nameFr : lang === 'ar' ? calc.nameAr : calc.nameEn;
          
          return (
            <Link
              key={i}
              to={calc.path}
              className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <CalcIcon className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                {calcName}
              </h2>
              <p className="text-sm text-slate-500 line-clamp-2">
                Calculate {calcName.toLowerCase()} and access clinical decision support.
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-16">
        <AdUnit format="leaderboard" />
      </div>
    </div>
  );
}
