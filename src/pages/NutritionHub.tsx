import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen, Calculator, Sparkles, ChevronRight, Share2, ArrowLeft, HeartPulse, Activity, Clock
} from 'lucide-react';
import { LangCode, Translations } from '../types';
import { useLang } from '../utils/lang';
import { MASTER_BLOGS, MASTER_JOURNALS, t } from '../utils/masterListContent';
import { slugify } from '../utils/slug';
import SEO from '../components/SEO';
import { HelpCircle, TrendingUp, AlertCircle } from 'lucide-react';
import faqDbRaw from '../data/faqDb.json';

interface NutritionHubProps {
  lang: LangCode;
}

const T: Translations = {
  en: {
    title: 'Clinical Nutrition Hub',
    subtitle: 'Evidence-based tools, leading journals, and clinical calculators for medical nutrition therapy.',
    calculatorsTitle: 'Nutrition Calculators',
    calculatorsDesc: 'Clinical tools optimized for energy requirements and malnutrition risk assessment.',
    articlesTitle: 'Nutrition Journals & Blogs',
    articlesDesc: 'Trending articles, peer-reviewed research, and clinical practice papers.',
    shareBtn: 'Share Hub',
    copiedText: 'Link copied!',
    backBtn: 'Back to Homepage',
    readMore: 'Read Article',
    eeatBadge: 'E-E-A-T Certified Suite'
  },
  fr: {
    title: 'Centre de Nutrition Clinique',
    subtitle: 'Outils fondés sur des preuves, journaux de premier plan et calculateurs pour la thérapie nutritionnelle médicale.',
    calculatorsTitle: 'Calculateurs de Nutrition',
    calculatorsDesc: 'Outils cliniques optimisés pour les besoins énergétiques et le risque de malnutrition.',
    articlesTitle: 'Journaux et Blogs de Nutrition',
    articlesDesc: 'Articles tendances, recherches évaluées par des pairs et articles de pratique.',
    shareBtn: 'Partager le Hub',
    copiedText: 'Lien copié !',
    backBtn: 'Retour à l\'Accueil',
    readMore: 'Lire l\'article',
    eeatBadge: 'Suite Certifiée E-E-A-T'
  }
};

const EXTERNAL_JOURNALS = [
  {
    title: 'The American Journal of Clinical Nutrition (AJCN)',
    url: 'https://ajcn.nutrition.org/',
    desc: {
      en: 'High-quality basic and clinical nutrition research.',
      fr: 'Recherche fondamentale et clinique de haute qualité en nutrition.'
    }
  },
  {
    title: 'Clinical Nutrition',
    url: 'https://www.clinicalnutritionjournal.com/',
    desc: {
      en: 'Leading international journal focused on practical application of nutrition.',
      fr: 'Revue internationale de premier plan axée sur l\'application pratique de la nutrition.'
    }
  },
  {
    title: 'Journal of the Academy of Nutrition and Dietetics (JAND)',
    url: 'https://jandonline.org/',
    desc: {
      en: 'Premier publication for dietetics practice and policy.',
      fr: 'Publication de premier plan pour la pratique et la politique diététique.'
    }
  }
];

export default function NutritionHub({ lang }: NutritionHubProps) {
  const tLabels = T[lang] || T.en;
  const isRtl = false;
  const navigate = useNavigate();
  const { langPath } = useLang();
  const [copied, setCopied] = useState(false);

  // Filter relevant content dynamically from master lists
  const nutritionBlogs = useMemo(() => {
    return MASTER_BLOGS.filter(b => 
      b.title.en.toLowerCase().includes('nutrition') || 
      b.title.en.toLowerCase().includes('diet') || 
      b.title.en.toLowerCase().includes('metabolic') ||
      b.title.en.toLowerCase().includes('weight')
    );
  }, []);

  const nutritionJournals = useMemo(() => {
    return MASTER_JOURNALS.filter(j => 
      j.title.en.toLowerCase().includes('nutrition') || 
      j.title.en.toLowerCase().includes('diet')
    );
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: tLabels.title,
          text: tLabels.subtitle,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const faqs = (faqDbRaw as any)['/nutrition-hub'] || [];

  return (
    <div className={`min-h-screen bg-slate-50 ${isRtl ? 'rtl' : 'ltr'}`}>
      <SEO 
        title={tLabels.title}
        description={tLabels.subtitle}
        lang={lang}
        logicalPath="/nutrition-hub"
      />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white mb-12 shadow-xl border border-emerald-500/20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative px-6 py-12 sm:px-12 sm:py-16 md:py-20 lg:px-16 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-2/3">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/20 backdrop-blur-md px-3 py-1.5 rounded-full text-emerald-100 text-sm font-medium mb-6 border border-emerald-400/30">
                <Sparkles className="w-4 h-4" />
                <span>{tLabels.eeatBadge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white drop-shadow-sm">
                {tLabels.title}
              </h1>
              <p className="text-lg sm:text-xl text-emerald-50 max-w-2xl leading-relaxed opacity-90">
                {tLabels.subtitle}
              </p>
            </div>
            
            <div className={`mt-8 lg:mt-0 flex flex-col sm:flex-row gap-4 ${isRtl ? 'lg:mr-auto lg:ml-0' : 'lg:ml-auto lg:mr-0'}`}>
              <button
                onClick={handleShare}
                className="inline-flex justify-center items-center px-6 py-3 border-2 border-emerald-400/50 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 hover:border-emerald-300 transition-all shadow-lg active:scale-95"
              >
                {copied ? <Activity className="w-5 h-5 mr-2" /> : <Share2 className="w-5 h-5 mr-2" />}
                {copied ? tLabels.copiedText : tLabels.shareBtn}
              </button>
              
              <Link 
                to={langPath('/')}
                className="inline-flex justify-center items-center px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg active:scale-95"
              >
                <ArrowLeft className={`w-5 h-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                {tLabels.backBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* GEO Statistics Banner */}
        <div className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Did you know?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              According to recent ESPEN clinical guidelines, malnutrition affects up to <strong className="text-emerald-700">30-50%</strong> of hospitalized patients. 
              Implementing early medical nutrition therapy and validated screening tools (like NRS-2002 or MUST) can significantly reduce mortality and hospital length of stay.
            </p>
          </div>
        </div>

        {/* Calculators Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-indigo-200">
              <Calculator className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{tLabels.calculatorsTitle}</h2>
              <p className="text-slate-500 mt-1">{tLabels.calculatorsDesc}</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={langPath('/nutrition-tdee')} className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">TDEE & BMR</h3>
              <p className="text-slate-500 text-sm">Total Daily Energy Expenditure & Basal Metabolic Rate calculations.</p>
            </Link>

            <Link to={langPath('/nutrition-must')} className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">MUST Score</h3>
              <p className="text-slate-500 text-sm">Malnutrition Universal Screening Tool for clinical assessment.</p>
            </Link>

            <Link to={langPath('/nutrition-nrs2002')} className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <HeartPulse className="w-5 h-5 text-indigo-600" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">NRS-2002</h3>
              <p className="text-slate-500 text-sm">Nutritional Risk Screening 2002 for hospitalized patients.</p>
            </Link>
          </div>
        </section>

        {/* External Medical Journals Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-amber-200">
              <BookOpen className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">External Academic Journals</h2>
              <p className="text-slate-500 mt-1">Leading peer-reviewed journals in medical nutrition.</p>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXTERNAL_JOURNALS.map((journal, idx) => (
              <a 
                key={idx}
                href={journal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{journal.title}</h3>
                <p className="text-slate-500 text-sm">{journal.desc[lang as keyof typeof journal.desc] || journal.desc.en}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Blogs & Journals Section */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-blue-200">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{tLabels.articlesTitle}</h2>
              <p className="text-slate-500 mt-1">{tLabels.articlesDesc}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Our own Journals mapping */}
            {nutritionJournals.length > 0 && nutritionJournals.map(journal => (
              <Link 
                key={journal.id} 
                to={langPath(`/blog/${slugify(journal.title.en, journal.id)}`)}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[10px] font-black uppercase rounded-md">
                      {journal.category || 'Clinical Review'}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{journal.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {t(journal.title, lang)}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {t(journal.snippet, lang)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-mono text-gray-400 font-bold text-[11px]">
                    <Clock className="w-4 h-4" />
                    {journal.readTime}
                  </span>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    {tLabels.readMore} <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Our own Blogs mapping */}
            {nutritionBlogs.length > 0 && nutritionBlogs.map(blog => (
              <Link 
                key={blog.id} 
                to={langPath(`/blog-articles/${slugify(blog.title.en, blog.id)}`)}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[10px] font-black uppercase rounded-md">
                      {blog.category || 'Medical Blog'}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{blog.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">
                    {t(blog.title, lang)}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {t(blog.snippet, lang)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 font-mono text-gray-400 font-bold text-[11px]">
                    <Clock className="w-4 h-4" />
                    {blog.readTime} min
                  </span>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    {tLabels.readMore} <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {nutritionJournals.length === 0 && nutritionBlogs.length === 0 && (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">More Content Coming Soon</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">We are constantly updating our database with new peer-reviewed clinical nutrition articles.</p>
            </div>
          )}
        </section>
        
        {/* GEO FAQ Section */}
        {faqs.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-slate-200">
                <HelpCircle className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <p className="text-slate-500 mt-1">Common clinical queries related to medical nutrition therapy.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 flex items-start gap-3">
                    <span className="text-emerald-500 font-black">Q.</span>
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed pl-8">
                    <strong className="text-slate-800">A.</strong> {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
      </div>
    </div>
  );
}
