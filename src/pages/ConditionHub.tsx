import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LangCode } from '../types';
import { CONDITIONS_DB } from '../data/conditions';
import { navItems } from '../routes';
import SEO from '../components/SEO';
import { AlertCircle, ArrowRight } from 'lucide-react';
import AdUnit from '../components/AdUnit';
import SocialShare from '../components/SocialShare';

const T = {
  en: {
    notFound: "Condition Not Found",
    notFoundDesc: "The clinical condition category you are looking for does not exist.",
    returnHome: "Return to Home",
    seoTitle: "{title} Calculators & Clinical Tools | CareCalculus",
    seoDesc: "Access evidence-based {title} calculators and clinical decision tools. {description}",
    calcDesc: "Calculate {name} and access clinical decision support.",
  },
  fr: {
    notFound: "Catégorie non trouvée",
    notFoundDesc: "La catégorie de condition clinique que vous recherchez n'existe pas.",
    returnHome: "Retour à l'accueil",
    seoTitle: "Calculateurs et outils cliniques pour {title} | CareCalculus",
    seoDesc: "Accédez aux calculateurs et outils d'aide à la décision clinique basés sur les preuves pour {title}. {description}",
    calcDesc: "Calculez le {name} et accédez à l'aide à la décision clinique.",
  }
};

export default function ConditionHub({ lang }: { lang: LangCode }) {
  const { conditionSlug } = useParams<{ conditionSlug: string }>();
  const isRtl = false;
  const t = T[lang] || T.en;

  const condition = CONDITIONS_DB.find(c => c.id === conditionSlug);

  if (!condition) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-red-50 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-bold">{t.notFound}</h2>
            <p>{t.notFoundDesc}</p>
          </div>
        </div>
        <Link to="/" className="mt-6 inline-flex text-blue-600 font-semibold hover:underline">
          {t.returnHome}
        </Link>
      </div>
    );
  }

  const title = lang === 'fr' ? condition.nameFr : condition.nameEn;
  const description = lang === 'fr' ? condition.descriptionFr : condition.descriptionEn;
  
  // SEO optimization specifically mirroring competitor practices
  const seoTitle = t.seoTitle.replace('{title}', title);
  const seoDesc = t.seoDesc.replace('{title}', title).replace('{description}', description);
  const Icon = condition.icon;

  const calculators = condition.calculators.map(calcPath => 
    navItems.find(item => item.path === `/${calcPath}`)
  ).filter(Boolean) as typeof navItems;

  return (
    <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO 
        logicalPath={`/conditions/${conditionSlug}`} 
        lang={lang} 
        title={seoTitle}
        description={seoDesc}
        keywords={`${title.toLowerCase()} calculators, clinical tools, medical algorithms, care calculus`}
      />
      
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-2">
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
          const calcName = lang === 'fr' ? calc.nameFr : calc.nameEn;
          
          return (
            <Link
              key={i}
              to={calc.path}
              className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <CalcIcon className="w-6 h-6" />
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {calcName}
              </h2>
              {/* By extracting keywords into the card, we feed the crawler more context */}
              <p className="text-sm text-slate-500 line-clamp-2">
                {t.calcDesc.replace('{name}', calcName)}
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

