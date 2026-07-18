import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { ebmcalcMapping } from '../data/ebmcalc_mapping';
import catalogData from '../data/ebmcalc_catalog.json';
import specialtiesMap from '../data/ebmcalc_specialties_map.json';
import SEO from '../components/SEO';
import { 
  Layers, Calculator, ShieldAlert, CheckCircle, 
  ChevronRight, Activity, BookOpen, ArrowRight, 
  FileText, Scale, Search, ArrowLeft, HeartPulse,
  Brain, FileSpreadsheet, Sparkles, Award
} from 'lucide-react';
import AdUnit from '../components/AdUnit';
import SocialShare from '../components/SocialShare';

interface CatalogItem {
  name: string;
  href: string;
  url: string;
}

export default function ClinicalLibrary({ lang }: { lang: 'en' | 'fr' }) {
  const { view, subId } = useParams<{ view?: string; subId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('ALL');

  // 1. Compatibility Redirect Logic
  // If the user lands on a calculator page path (e.g., /clinical-library/calc/AnionGap.htm)
  // and we have a premium implementation, redirect them immediately.
  useEffect(() => {
    if (view === 'calc' && subId) {
      const mappedPath = ebmcalcMapping[subId];
      if (mappedPath) {
        // Redirect to the existing premium calculator
        const langPrefix = lang === 'fr' ? '/fr' : '';
        navigate(`${langPrefix}${mappedPath}`, { replace: true });
      }
    }
  }, [view, subId, navigate, lang]);

  const isRtl = false;

  // Alphabet letters helper
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Clean titles from suffix/branding text
  const cleanTitle = (title: string) => {
    return title
      .replace(/\(conventional or SI units\)/i, '')
      .replace(/\(conventional and SI units\)/i, '')
      .replace(/\(Metric\)/i, '')
      .replace(/TreeCalc/i, '')
      .replace(/MultiCalc/i, '')
      .replace(/Score System/i, 'Score')
      .replace(/Scoring System/i, 'Score')
      .trim();
  };

  // Render the Fallback Clinical Sheet
  if (view === 'calc' && subId) {
    const filename = subId;
    
    // Find item metadata in catalog to show title
    let foundItem: CatalogItem | null = null;
    let categoryName = 'Clinical Tool';
    
    for (const [catKey, list] of Object.entries(catalogData)) {
      if (catKey === 'specialties') continue;
      const match = (list as CatalogItem[]).find(item => item.href === filename);
      if (match) {
        foundItem = match;
        categoryName = catKey.charAt(0).toUpperCase() + catKey.slice(1);
        break;
      }
    }

    const title = foundItem ? cleanTitle(foundItem.name) : filename.replace('.htm', '').replace(/([A-Z])/g, ' $1').trim();

    const seoTitle = `${title} | Clinical Guideline & Reference | CareCalculus`;
    const seoDesc = `Clinical review, equations, and criteria references for ${title}. Bedside reference sheet from clinical library.`;

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 font-sans">
        <SEO 
          logicalPath={`/clinical-library/calc/${filename}`}
          lang={lang}
          title={seoTitle}
          description={seoDesc}
        />

        <div className="mb-6">
          <Link 
            to="/clinical-library" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'fr' ? 'Retour aux outils cliniques' : 'Back to Clinical Index'}
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              {lang === 'fr' ? 'Référence Clinique' : 'Clinical Guideline'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500 font-semibold">
              Category: {categoryName} • Source: Clinical Reference Library
            </p>
          </div>

          {/* Reference Card body */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                {lang === 'fr' ? 'Aide à la Décision Clinique' : 'Bedside Decision Support'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'fr' 
                  ? `Cette équation/critère fait partie de la bibliothèque de référence clinique. Pour des raisons réglementaires et de sécurité, veuillez vérifier la formule clinique par rapport aux directives locales de votre établissement.` 
                  : `This clinical equation/criteria set is part of the reference library. For regulatory and patient-safety guidelines, please verify calculations against your local institution's approved clinical pathways.`
                }
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-lg">
                {lang === 'fr' ? 'À propos de cette mesure' : 'About this Calculator'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This bedside tool provides evidence-based assessment. Clinical equations and decision criteria tools optimize workflows, reduce diagnostic errors, and ensure standardization across multidisciplinary teams in critical care, internal medicine, and emergency settings.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <AdUnit format="leaderboard" />
        </div>
      </div>
    );
  }

  // Specialty Sub-index Viewer
  if (view === 'specialties' && subId) {
    const specialtyData = (specialtiesMap as any)[subId];
    if (!specialtyData) {
      return (
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Specialty Index Not Found</h2>
          <Link to="/clinical-library" className="text-blue-600 hover:underline mt-4 inline-block">Return to Clinical Dashboard</Link>
        </div>
      );
    }

    const calculatorsList: CatalogItem[] = specialtyData.calculators;
    const title = specialtyData.name;

    // Filter items
    const filteredCalcs = calculatorsList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
        <SEO 
          logicalPath={`/clinical-library/specialties/${subId}`}
          lang={lang}
          title={`${title} Calculators | Clinical Library`}
          description={`Browse and search clinical calculators and scoring criteria for ${title}.`}
        />

        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/clinical-library" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'fr' ? 'Retour' : 'Back'}
          </Link>
          <span className="text-xs font-semibold text-slate-400">Specialty Index</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-slate-500 text-sm">
              Browse {calculatorsList.length} clinical calculators cataloged for this medical specialty.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher un outil...' : 'Search calculators...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl text-sm font-medium outline-none transition"
            />
          </div>

          {/* Grid of calculators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCalcs.map((item, idx) => {
              const mappedPath = ebmcalcMapping[item.href];
              return (
                <Link
                  key={idx}
                  to={mappedPath ? mappedPath : `/clinical-library/calc/${item.href}`}
                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-teal-700 transition-colors">
                      {cleanTitle(item.name)}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                      {mappedPath ? 'Premium TSX Module' : 'Extended Reference'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Global Index Sub-View (Equations, Criteria, Decisions, Convert, Specialties)
  if (view && ['equations', 'criteria', 'decision', 'convert', 'specialties'].includes(view)) {
    const list: CatalogItem[] = (catalogData as any)[view] || [];
    
    // Filtering logic
    const filteredItems = list.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (view === 'equations' || view === 'criteria') {
        if (activeLetter !== 'ALL') {
          return matchesSearch && item.name.toUpperCase().startsWith(activeLetter);
        }
      }
      
      return matchesSearch;
    });

    const pageTitle = view.charAt(0).toUpperCase() + view.slice(1);

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
        <SEO 
          logicalPath={`/clinical-library/${view}`}
          lang={lang}
          title={`Clinical ${pageTitle} | Complete Index`}
          description={`Search and explore clinical ${view} database cataloged for clinical professionals.`}
        />

        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/clinical-library" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'fr' ? 'Dashboard Bibliothèque' : 'Clinical Library Dashboard'}
          </Link>
          <span className="text-xs font-semibold text-slate-400">Library Index</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{pageTitle} Index</h1>
            <p className="text-slate-500 text-sm">
              Search and filter {list.length} compiled reference tools in the library.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher...' : 'Search index...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 rounded-xl text-sm font-medium outline-none transition"
            />
          </div>

          {/* Alphabet bar for Equations and Criteria */}
          {(view === 'equations' || view === 'criteria') && (
            <div className="flex flex-wrap gap-1.5 py-2 border-b border-slate-100">
              <button
                onClick={() => setActiveLetter('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeLetter === 'ALL'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                ALL
              </button>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setActiveLetter(letter)}
                  className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                    activeLetter === letter
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {/* Display Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item, idx) => {
              const isSpecialty = view === 'specialties';
              const mappedPath = ebmcalcMapping[item.href];
              
              const linkTarget = isSpecialty
                ? `/clinical-library/specialties/${item.href}`
                : (mappedPath ? mappedPath : `/clinical-library/calc/${item.href}`);

              return (
                <Link
                  key={idx}
                  to={linkTarget}
                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all duration-200 flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-teal-700 transition-colors">
                      {cleanTitle(item.name)}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-1">
                      {isSpecialty 
                        ? 'Medical Specialty Group' 
                        : (mappedPath ? 'Premium TSX Module' : 'Extended Reference')
                      }
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Main View (/clinical-library)
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-32 space-y-12">
      <SEO 
        logicalPath="/clinical-library"
        lang={lang}
        title="Complete Clinical Reference Database Library | CareCalculus"
        description="Access equations, clinical criteria sets, decision trees, converters, and specialties."
      />

      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Calculator className="w-96 h-96 shrink-0" />
        </div>
        <div className="relative max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Integrate Evidence
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">Clinical Reference Library</h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Replicating comprehensive clinical equations, criteria, decision trees, and converter indices. Connected directly to CARECALCULUS's premium React modules.
          </p>
        </div>
      </div>

      {/* Index Menu Sections Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Database Catalog</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Equations */}
          <Link 
            to="/clinical-library/equations"
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl w-fit">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-teal-700 transition-colors">Equations</h3>
              <p className="text-xs text-slate-500">355 formulas, calculations, and indices.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 mt-2">
              Explore Index <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Criteria */}
          <Link 
            to="/clinical-library/criteria"
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-indigo-700 transition-colors">Criteria Sets</h3>
              <p className="text-xs text-slate-500">392 medical diagnostic scoring systems.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-2">
              Explore Index <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Decisions */}
          <Link 
            to="/clinical-library/decision"
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-amber-700 transition-colors">Decision Trees</h3>
              <p className="text-xs text-slate-500">47 multi-step clinical branch algorithms.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 mt-2">
              Explore Index <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Convert */}
          <Link 
            to="/clinical-library/convert"
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl w-fit">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-pink-700 transition-colors">Converters</h3>
              <p className="text-xs text-slate-500">26 unit and biochemical conversion tables.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 mt-2">
              Explore Index <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Specialties */}
          <Link 
            to="/clinical-library/specialties"
            className="p-6 bg-white border border-slate-100 hover:border-teal-200 rounded-3xl shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group h-48"
          >
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-blue-700 transition-colors">Specialties</h3>
              <p className="text-xs text-slate-500">50 medical index directories.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-2">
              Explore Index <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
