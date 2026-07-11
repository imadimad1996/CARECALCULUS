import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { Activity, BookOpen, HeartPulse, Menu, X, LayoutDashboard, Calculator, Droplet, Brain, TestTube, AlertOctagon, ArrowRightLeft, AlertTriangle, Stethoscope, Wind, FileText, ShieldCheck, Sparkles, ChevronRight, ChevronDown, Search, Globe, Scale, MonitorPlay, GraduationCap, Newspaper, Scissors, Layers, Award } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router';
import { LangContext, parsePathname, buildPath, PREFIXED_LANGS } from './utils/lang';
import { organizationJsonLd, getLocalizedMeta as seoGetLocalizedMeta, getMedicalSchema, pageUrl as seoPageUrl, getBreadcrumbSchema, buildJsonLd, buildHead } from './utils/seo';
import Logo from './components/Logo';
import AdUnit from './components/AdUnit';
import SocialShare from './components/SocialShare';
import ReadingProgress from './components/ReadingProgress';
import NewsletterCapture from './components/NewsletterCapture';
import CookieConsent from './components/CookieConsent';
import MedicalDisclaimer from './components/MedicalDisclaimer';
import CommandPalette from './components/ui/CommandPalette';
import TrackingScripts from './components/TrackingScripts';
import EmbedLayout from './components/EmbedLayout';
import InstallAppButton from './components/ui/InstallAppButton';
import SidebarNewsletter from './components/SidebarNewsletter';
import StickyMobileAd from './components/StickyMobileAd';
import SmartPasteModal from './components/SmartPasteModal';

import { preloadPages, moduleRoutes, embedRoutes, navItems, TIER_HEADERS, LEGAL_ROUTES, CONTENT_ROUTES, ErrorBoundary, NotFound } from './routes';
import { LangCode } from './types';
import { UnitSystemProvider, useUnitSystem } from './contexts/UnitSystemContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginModal } from './components/auth/LoginModal';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    window.addEventListener('open-login', handleOpenLogin);
    return () => window.removeEventListener('open-login', handleOpenLogin);
  }, []);

  // Language is derived from the URL — the prefix (/fr, /ar) is the single
  // source of truth. `path` is the language-agnostic logical path.
  const { lang, path: logicalPath } = parsePathname(location.pathname);

  // Build a URL for the current language out of a logical path.
  const langPath = (p: string) => {
    const clean = p.startsWith('/') ? p : `/${p}`;
    if (clean === '/glp-1-hub' || clean === '/hub-glp1' || clean === '/مركز-glp1' || decodeURIComponent(clean) === '/مركز-glp1') {
      if (lang === 'fr') return '/fr/hub-glp1';
      return '/glp-1-hub';
    }
    return buildPath(p, lang);
  };

  // Detect layout mode
  const isContentPage = CONTENT_ROUTES.some(r => logicalPath === r || logicalPath.startsWith(r + '/'));
  const isHomePage = logicalPath === '/' || logicalPath === '/home';
  const isEmbedPage = logicalPath.startsWith('/embed/');

  // Switching language navigates to the same logical page under the new prefix/domain.
  const setLang = (next: LangCode) => {
    localStorage.setItem('carecalculus-lang', next);
    const cleanLogical = logicalPath.startsWith('/') ? logicalPath : `/${logicalPath}`;
    
    if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') && !window.location.hostname.endsWith('.pages.dev')) {
      if (next === 'fr') {
        window.location.href = `https://fr.carecalculus.com${cleanLogical === '/' ? '' : cleanLogical}`;
        return;
      }
      if (next === 'en') {
        window.location.href = `https://www.carecalculus.com${cleanLogical === '/' ? '' : cleanLogical}`;
        return;
      }
    }

    if (cleanLogical === '/glp-1-hub' || cleanLogical === '/hub-glp1' || cleanLogical === '/مركز-glp1' || decodeURIComponent(cleanLogical) === '/مركز-glp1') {
      if (next === 'fr') navigate('/fr/hub-glp1');
      else navigate('/glp-1-hub');
      return;
    }
    navigate(buildPath(logicalPath, next));
  };

  // First-visit language routing: only when landing on the bare root ("/") of the English domain do we
  // consult a stored preference / browser language and redirect.
  useEffect(() => {
    if (location.pathname !== '/') return;
    if (typeof window !== 'undefined' && window.location.hostname.startsWith('fr.')) return;
    const stored = localStorage.getItem('carecalculus-lang');
    let preferred: LangCode = 'en';
    if (stored === 'fr' || stored === 'en') {
      preferred = stored;
    } else {
      const browserLangs = navigator.languages || [navigator.language];
      for (const b of browserLangs) {
        const code = b.toLowerCase().slice(0, 2);
        if (code === 'fr') { preferred = 'fr'; break; }
      }
    }
    if (preferred !== 'en') {
      if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1') && !window.location.hostname.endsWith('.pages.dev')) {
        window.location.href = `https://fr.carecalculus.com/`;
      } else {
        navigate(buildPath('/', preferred), { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  const { standard, toggleStandard } = useUnitSystem();
  
  const geoState = {
    standard,
    region: standard === 'Metric (SI)' ? 'Global / SI' : 'US / Imperial'
  };

  const toggleGeoStandard = () => {
    toggleStandard();
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [topSearch, setTopSearch] = useState('');

  const [expandedTiers, setExpandedTiers] = useState<Record<number, boolean>>(() => {
    try {
      const stored = localStorage.getItem('carecalculus-expanded-tiers');
      return stored ? JSON.parse(stored) : { 1: true, 2: false, 3: false, 4: false, 5: false };
    } catch {
      return { 1: true, 2: false, 3: false, 4: false, 5: false };
    }
  });

  const toggleTier = (tier: number) => {
    const next = { ...expandedTiers, [tier]: !expandedTiers[tier] };
    setExpandedTiers(next);
    try {
      localStorage.setItem('carecalculus-expanded-tiers', JSON.stringify(next));
    } catch (e) {}
  };

  const isRtl = false;

  useEffect(() => {
    localStorage.setItem('carecalculus-lang', lang);
  }, [lang]);

  // Helper to determine if a clinical item matches the current search keyword
  const matchesSearch = (item: any, keyword: string) => {
    const q = keyword.toLowerCase().trim();
    if (!q) return true;

    // Direct translation text match
    const en = item.nameEn.toLowerCase();
    const fr = item.nameFr.toLowerCase();
    const ar = item.nameAr.toLowerCase();
    const pathLower = item.path.toLowerCase();

    if (en.includes(q) || fr.includes(q) || ar.includes(q) || pathLower.includes(q)) {
      return true;
    }

    // Advanced Clinical Synonym mapping to make search feel incredibly smart and game-grade
    const synonyms: Record<string, string[]> = {
      'sepsis': ['qsofa', 'sirs', 'infection', 'shock', 'تسمم', 'التهاب'],
      'infection': ['qsofa', 'sirs', 'curb', 'التهاب', 'تسمم'],
      'kidney': ['creatinine', 'renal', 'clearance', 'كلى', 'الكلية', 'تصفية'],
      'renal': ['creatinine', 'clearance', 'كلى', 'الكلية', 'تصفية'],
      'liver': ['meld', 'cirrhosis', 'hepatic', 'كبد', 'الكبد', 'تليف'],
      'lung': ['pf', 'oxygen', 'ratio', 'tidal', 'ards', 'respiratory', 'شريان', 'رئة', 'الرئتين'],
      'respiratory': ['pf', 'ratio', 'tidal', 'ards', 'curb65', 'تنفس', 'رئة'],
      'ventilation': ['tidal', 'ards', 'lung', 'تنفس'],
      'coma': ['gcs', 'glasgow', 'غيبوبة', 'وعي'],
      'stroke': ['cha2ds2-vasc', 'af', 'stroke', 'سكتة', 'جلطة', 'دماغ'],
      'clot': ['wells', 'dvt', 'pe', 'thrombosis', 'جلطة'],
      'weight': ['adjusted', 'body', 'steroids', 'ibw', 'abw', 'وزن', 'الوزن'],
      'steroid': ['steroid', 'cortico', 'conversion', 'كيرتيزون', 'ستيرويد', 'جرعات'],
      'orl': ['orl', 'laryngeal', 'larynx', 'cancer', 'staging', 'tnm', 'حنجرة', 'سرطان'],
      'laryngeal': ['orl', 'laryngeal', 'larynx', 'cancer', 'staging', 'tnm', 'حنجرة', 'سرطان'],
    };

    for (const [key, paths] of Object.entries(synonyms)) {
      if (key.includes(q) || q.includes(key)) {
        if (paths.some(p => pathLower.includes(p))) {
          return true;
        }
      }
    }

    return false;
  };

  // Memoized filtered results for the top-page search
  const filteredTopResults = React.useMemo(() => {
    if (!topSearch) return [];
    return navItems.filter(i => matchesSearch(i, topSearch));
  }, [topSearch]);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [isRtl, lang]);

  // Dynamic header meta, automated hreflang injection, canonical and Open Graph (OG) social card SEO configurations
  useEffect(() => {
    const head = buildHead(logicalPath, lang);
    
    // 1. Dynamic Title
    document.title = head.title;

    // 2. Dynamic Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', head.meta.desc);

    // 3. Dynamic Keywords
    let kwMeta = document.querySelector('meta[name="keywords"]');
    if (!kwMeta) {
      kwMeta = document.createElement('meta');
      kwMeta.setAttribute('name', 'keywords');
      document.head.appendChild(kwMeta);
    }
    kwMeta.setAttribute('content', head.meta.keywords);

    // 4. Dynamic Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', head.url);

    // 5. Open Graph (OG) Tag Matrix
    const isArticlePage = logicalPath.startsWith('/blog/') || logicalPath.startsWith('/blog-articles/');
    const ogTags = {
      'og:title': head.title,
      'og:description': head.meta.desc,
      'og:url': head.url,
      'og:type': isArticlePage ? 'article' : 'website',
      'og:site_name': 'CareCalculus Clinical Suite',
      'og:image': head.ogImage,
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:alt': 'CareCalculus — Free multilingual clinical calculators for ICU, ER and hospital clinicians',
      'og:locale': lang === 'fr' ? 'fr_FR' : ('en_US'),
    };
    Object.entries(ogTags).forEach(([property, content]) => {
      let ogMeta = document.querySelector(`meta[property="${property}"]`);
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.setAttribute('content', content);
    });

    // 6. Twitter Card Tag Matrix
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': head.title,
      'twitter:description': head.meta.desc,
      'twitter:image': head.ogImage,
      'twitter:site': '@CareCalculus',
      'twitter:creator': '@CareCalculus',
    };
    Object.entries(twitterTags).forEach(([name, content]) => {
      let twMeta = document.querySelector(`meta[name="${name}"]`);
      if (!twMeta) {
        twMeta = document.createElement('meta');
        twMeta.setAttribute('name', name);
        document.head.appendChild(twMeta);
      }
      twMeta.setAttribute('content', content);
    });

    // 7. Dynamic Alternate Hreflang Tags (TECHNICAL SEO STEP 1)
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    head.hreflang.forEach(alt => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', alt.hreflang);
      link.setAttribute('href', alt.href);
      document.head.appendChild(link);
    });

    // 8. Schema JSON-LD Structured Data Node
    let schemaScript = document.getElementById('carecalculus-json-ld');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'carecalculus-json-ld');
    schemaScript.setAttribute('type', 'application/ld+json');

    schemaScript.textContent = JSON.stringify(head.jsonLd, null, 2);
    document.head.appendChild(schemaScript);

  }, [logicalPath, lang]);

  // Close sidebar on navigation mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  // Curator logic for related clinical calculators (TECHNICAL SEO STEP 12 PageRank Flow)
  const getRelatedCalculators = (currentPath: string) => {
    const cleanPath = currentPath === '/' ? '/map-calculator' : currentPath;
    const currentItem = navItems.find(item => item.path === cleanPath);
    if (!currentItem) return navItems.slice(0, 3);
    const sameTier = navItems.filter(item => item.path !== cleanPath && item.tier === currentItem.tier);
    const defaults = navItems.filter(item => item.path !== cleanPath && item.tier !== currentItem.tier);
    return [...sameTier, ...defaults].slice(0, 3);
  };

  const currentRelated = getRelatedCalculators(logicalPath);

  // Render the high-performance top keywords navigation bar to facilitate fast routing 
  const renderKeywordsHeader = () => {
    const popularTags = [
      { path: '/map-calculator', en: 'MAP / PAM', fr: 'PAM (Pression)', ar: 'الضغط المتوسط PAM' },
      { path: '/bmi-calculator', en: 'BMI Cliniq', fr: 'IMC Corporel', ar: 'مؤشر كتلة الجسم IMC' },
      { path: '/glasgow-coma-scale', en: 'GCS Score', fr: 'Glasgow (GCS)', ar: 'مقياس غلاسكو GCS' },
      { path: '/creatinine-clearance', en: 'Creatinine Clearance', fr: 'Clairance Créatinine', ar: 'تصفية الكرياتينين' },
      { path: '/qsofa-score', en: 'qSOFA Sepsis', fr: 'qSOFA Sepsis', ar: 'تسمم الدم qSOFA' },
      { path: '/meld-score', en: 'MELD (Liver)', fr: 'Score MELD Hépatique', ar: 'نقاط MELD للكبد' },
      { path: '/wells-score', en: 'Wells (DVT)', fr: 'Wells MTEV / Phlébite', ar: 'مؤشر ويلز للجلطات' },
      { path: '/curb65-score', en: 'CURB-65 Pneumonia', fr: 'CURB-65 Poumon', ar: 'الالتهاب الرئوي CURB65' },
      { path: '/cha2ds2-vasc', en: 'FA Stroke Risk', fr: 'Score FA AVC', ar: 'خطر سكتة الرجفان الأذيني' },
      { path: '/steroid-conversion', en: 'Steroid Conversion', fr: 'Dosage Corticoïdes', ar: 'تحويل الكورتيزون' },
    ];

    const currentPath = logicalPath === '/' ? '/map-calculator' : logicalPath;

    return (
      <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-mono font-black leading-none uppercase tracking-wider text-gray-400">
              {lang === 'fr' 
                ? 'INDEX DES MOTS-CLÉS POPULAIRES' 
                : ('TOP CLINICAL KEYWORD INDEX')}
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-widest hidden sm:inline-block">
            {lang === 'fr' ? '10 Index Principaux' : ('10 Primary Indices')}
          </span>
        </div>

        {/* Beautiful Touch & Horizontal Scrollable Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {popularTags.map((tag) => {
            const isActive = currentPath === tag.path;
            const label = lang === 'fr' ? tag.fr : (tag.en);
            return (
              <Link
                key={tag.path}
                to={langPath(tag.path)}
                className={`py-2 px-3.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all duration-200 shrink-0 border uppercase tracking-tight flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md font-extrabold scale-[1.01]'
                    : 'bg-gray-50 text-gray-600 border-gray-200/70 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300'
                }`}
                style={{ minHeight: '36px' }}
              >
                <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the high-performance GEO regional guidelines standards feedback HUD
  const renderGeoProtocolHUD = () => {
    const getGuidelinesAssociation = () => {
      if (geoState.standard === 'US Customary / Imperial') {
        return lang === 'fr' 
          ? 'Présélection d\'unités américaines (FDA, AHA, ACC) active pour ce navigateur.'
          : ('US standard guidelines (FDA, AHA, ACC) presets configured.');
      }
      if (lang === 'fr') {
        return 'Recommandations Européenne & Française (HAS, SFMU) et système métrique actif.';
      }
      if (false) {
        return 'المعايير المترية للمختبرات وتوصيات الهيئات الطبية الإقليمية نشطة.';
      }
      return 'International medical criteria & SI Metric protocols standard.';
    };

    return (
      <div className="mb-6 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden text-slate-100 animate-fade-in select-all">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-[#22D3EE] uppercase tracking-widest leading-none">
                  CareCalculus GEO-Intelligence Node
                </span>
              </div>
              <h3 className="text-xs font-black tracking-wider uppercase font-mono mt-1 text-slate-200">
                {lang === 'fr' ? 'Protocole Régional Détecté' : ('Active Regional Guidelines Standard')}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                {getGuidelinesAssociation()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-slate-950/95 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Region:</span>
              <span className="text-xs font-bold text-slate-200 uppercase font-mono">{geoState.region}</span>
            </div>

            <div className="bg-slate-950/95 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">Units:</span>
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                {geoState.standard}
              </span>
            </div>

            {/* Quick Standard override control */}
            <button
              onClick={toggleGeoStandard}
              className="py-2 px-3.5 bg-[#0891B2] hover:bg-[#0891B2]/90 text-xs text-white font-mono font-bold rounded-xl transition border border-[#0891B2] shadow-sm cursor-pointer active:scale-95 flex items-center gap-1"
              style={{ minHeight: '44px' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CCFBF1]" />
              <span>{lang === 'fr' ? 'Intervertir' : ('Toggle Unit Mode')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the high-performance top page clinical search bar
  const renderTopPageSearchBar = () => {
    return (
      <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 shrink-0">
            <span className="text-[10px] font-mono font-black text-blue-600 uppercase tracking-widest block">
              {lang === 'fr' ? 'RECHERCHE D’OUTIL DIRECTE' : ('RAPID DECISION SUPPORT SEARCH')}
            </span>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              {lang === 'fr' 
                ? 'Accès aux Protocoles Cliniques' 
                : ('Search Clinical Modules & Tiers')}
            </h2>
          </div>

          <div className="flex-1 max-w-lg w-full relative">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              id="top-page-search-field"
              type="text"
              placeholder={lang === 'fr' ? 'Saisissez sepsis, GCS, calcul de reins, corticoides...' : ('Type sepsis, GCS, renal clearance, steroids conversion...')}
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className={`w-full py-2.5 bg-gray-50 focus:bg-white text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/40 outline-none rounded-xl text-xs font-bold transition-all placeholder-gray-400 ${
                isRtl ? 'pr-11 pl-9 text-right' : 'pl-11 pr-9 text-left'
              }`}
              style={{ minHeight: '44px' }}
            />
            {topSearch && (
              <button
                onClick={() => setTopSearch('')}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition`}
                style={{ minWidth: '24px', minHeight: '24px' }}
                aria-label="Clear top search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Search Results Display */}
        {topSearch && (
          <div className="mt-4 pt-4 border-t border-gray-150 space-y-3">
            <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase tracking-wider">
              {lang === 'fr' ? 'RÉSULTATS DE RECHERCHE CORRESPONDANTS' : ('MATCHING CLINICAL MODULES FOUND')}
            </span>
            {filteredTopResults.length === 0 ? (
              <div className="p-4 text-center bg-gray-50 rounded-xl border border-gray-150 text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
                <AlertOctagon className="w-4 h-4 text-gray-400" />
                <span>{lang === 'fr' ? 'Aucun protocole clinique actif trouvé.' : ('No diagnostic calculator or guidelines found matching query.')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredTopResults.map((item) => {
                  const Icon = item.icon;
                  const itemTitle = lang === 'fr' ? item.nameFr : (item.nameEn);
                  const isCurMatch = logicalPath === item.path || (logicalPath === '/' && item.path === '/map-calculator');
                  return (
                    <Link
                      key={item.path}
                      to={langPath(item.path)}
                      onClick={() => setTopSearch('')}
                      className={`p-3 border rounded-xl flex items-center justify-between hover:border-blue-400 hover:shadow-xs hover:bg-blue-50/10 transition-all ${
                        isCurMatch ? 'border-blue-600 bg-blue-50/20' : 'border-gray-200 bg-white'
                      }`}
                      style={{ minHeight: '52px' }}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`p-1.5 rounded-lg text-xs ${isCurMatch ? 'bg-blue-600 text-white' : 'bg-gray-50 text-slate-500'}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-800 uppercase tracking-tight truncate">
                          {itemTitle}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getLocalizedTierHeader = (tier: number) => {
    return TIER_HEADERS[tier] ? TIER_HEADERS[tier][lang] : `Tier ${tier}`;
  };

  // Unified top navigation: search + popular keywords in one sticky bar (calculator pages)
  const renderUnifiedTopNav = () => {
    const popularTags = [
      { path: '/map-calculator', en: 'MAP', fr: 'PAM', ar: 'MAP' },
      { path: '/glasgow-coma-scale', en: 'GCS', fr: 'Glasgow', ar: 'GCS' },
      { path: '/creatinine-clearance', en: 'Creatinine', fr: 'Créatinine', ar: 'الكرياتينين' },
      { path: '/qsofa-score', en: 'qSOFA', fr: 'qSOFA', ar: 'qSOFA' },
      { path: '/meld-score', en: 'MELD', fr: 'MELD', ar: 'MELD' },
      { path: '/wells-score', en: 'Wells DVT', fr: 'Wells DVT', ar: 'ويلز' },
      { path: '/curb65-score', en: 'CURB-65', fr: 'CURB-65', ar: 'CURB-65' },
      { path: '/cha2ds2-vasc', en: 'CHA₂DS₂', fr: 'FA/AVC', ar: 'CHA₂DS₂' },
      { path: '/steroid-conversion', en: 'Steroids', fr: 'Corticoïdes', ar: 'الكورتيزون' },
      { path: '/bmi-calculator', en: 'BMI', fr: 'IMC', ar: 'BMI' },
    ];
    const currentPath = logicalPath === '/' ? '/map-calculator' : logicalPath;

    return (
      <div className="mb-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {/* Search row */}
        <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <div className="flex-1 relative">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none`} />
            <input
              id="top-nav-search"
              type="text"
              placeholder={lang === 'fr' ? 'Rechercher sepsis, GCS, rein, stéroïdes...' : 'Search: sepsis, GCS, renal, steroids...'}
              value={topSearch}
              onChange={(e) => setTopSearch(e.target.value)}
              className={`w-full py-2 bg-gray-50 focus:bg-white text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/60 outline-none rounded-xl text-xs font-semibold transition-all placeholder-gray-400 ${isRtl ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'}`}
              style={{ minHeight: '40px' }}
            />
            {topSearch && (
              <button onClick={() => setTopSearch('')} className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md hover:bg-gray-100 transition`} aria-label="Clear search">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Install App Button */}
          <InstallAppButton lang={lang} />
          {/* Smart Paste EHR Button */}
          <SmartPasteModal lang={lang} />
          {/* GEO unit toggle chip */}
          <button
            onClick={toggleGeoStandard}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-bold rounded-xl transition border border-slate-700 active:scale-95"
            style={{ minHeight: '40px' }}
            title="Toggle unit standard"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{geoState.standard === 'Metric (SI)' ? 'SI' : 'US'}</span>
          </button>
          {/* Auth Button Desktop */}
          {user ? (
            <button
              onClick={() => logout()}
              className="shrink-0 flex items-center justify-center w-10 h-10 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl transition-all duration-200 border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Sign Out"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">{user.email ? user.email.charAt(0) : 'G'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-teal-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ minHeight: '40px' }}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'fr' ? 'Connexion' : 'Sign In'}</span>
            </button>
          )}
        </div>

        {/* Live search results */}
        {topSearch && (
          <div className="px-4 py-3 bg-[#0891B2]/5 border-b border-[#0891B2]/20">
            {filteredTopResults.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-gray-400" />
                {lang === 'fr' ? 'Aucun protocole trouvé.' : ('No matching calculator found.')}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredTopResults.map((item) => {
                  const Icon = item.icon;
                  const label = lang === 'fr' ? item.nameFr : (item.nameEn);
                  return (
                    <Link key={item.path} to={langPath(item.path)} onClick={() => setTopSearch('')}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#0891B2] hover:bg-[#0891B2]/5 transition-all text-xs font-bold text-gray-800"
                      style={{ minHeight: '40px' }}>
                      <Icon className="w-3.5 h-3.5 text-[#0891B2] shrink-0" />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Keywords pill bar */}
        <div className="px-4 py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {popularTags.map((tag) => {
            const isActive = currentPath === tag.path;
            const label = lang === 'fr' ? tag.fr : (tag.en);
            return (
              <Link key={tag.path} to={langPath(tag.path)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#0891B2] text-white border-[#0891B2] shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={{ minHeight: '32px' }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Breadcrumb + back link for content/reading pages
  const renderContentPageTopBar = () => {
    const sectionMap: Record<string, { en: string; fr: string; ar: string; icon: any }> = {
      '/blog':          { en: 'Medical Journals', fr: 'Journaux Médicaux', ar: 'المجلات الطبية', icon: BookOpen },
      '/blog-articles': { en: 'Blog Articles',    fr: 'Articles de Blog',  ar: 'مقالات المدونة', icon: Newspaper },
      '/presentations': { en: 'Presentations',    fr: 'Présentations',     ar: 'العروض التقديمية', icon: MonitorPlay },
      '/cours':         { en: 'Courses (PDF)',     fr: 'Cours (PDF)',       ar: 'المحاضرات والدروس', icon: GraduationCap },
      '/about':         { en: 'About',            fr: 'À propos',          ar: 'عن المنصة', icon: ShieldCheck },
      '/disclaimer':    { en: 'Medical Disclaimer', fr: 'Avertissement médical', ar: 'إخلاء المسؤولية', icon: ShieldCheck },
      '/privacy':       { en: 'Privacy Policy',   fr: 'Confidentialité',   ar: 'سياسة الخصوصية', icon: ShieldCheck },
      '/terms':         { en: 'Terms of Use',     fr: 'Conditions',        ar: 'شروط الاستخدام', icon: FileText },
      '/glp-1-hub':     { en: 'GLP-1 Hub',        fr: 'Hub GLP-1',         ar: 'مركز أدوية GLP-1',  icon: Sparkles },
      '/hub-glp1':      { en: 'GLP-1 Hub',        fr: 'Hub GLP-1',         ar: 'مركز أدوية GLP-1',  icon: Sparkles },
      '/مركز-glp1':     { en: 'GLP-1 Hub',        fr: 'Hub GLP-1',         ar: 'مركز أدوية GLP-1',  icon: Sparkles },
    };
    const base = CONTENT_ROUTES.find(r => logicalPath === r || logicalPath.startsWith(r + '/'));
    const section = base ? sectionMap[base] : null;
    const SectionIcon = section?.icon;
    const sectionLabel = section ? (lang === 'fr' ? section.fr : section.en) : '';
    const isDetail = base && logicalPath !== base;

    return (
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
          <Link to={langPath('/')} className="flex items-center gap-1.5 hover:text-teal-600 transition-colors font-bold text-gray-700">
            <Logo className="w-5 h-5" mode="light" />
            CareCalculus
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          {isDetail && base ? (
            <>
              <Link to={langPath(base)} className="hover:text-blue-600 transition-colors flex items-center gap-1">
                {SectionIcon && <SectionIcon className="w-3.5 h-3.5" />}
                {sectionLabel}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-400 text-xs truncate max-w-[180px]">
                {lang === 'fr' ? 'Article' : 'Article'}
              </span>
            </>
          ) : (
            <span className="text-blue-600 flex items-center gap-1">
              {SectionIcon && <SectionIcon className="w-3.5 h-3.5" />}
              {sectionLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={langPath('/glp-1-hub')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 transition-all"
            style={{ minHeight: '36px' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {lang === 'fr' ? 'Hub GLP-1' : 'GLP-1 Hub'}
          </Link>
          <Link
            to={langPath('/map-calculator')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition-all"
            style={{ minHeight: '36px' }}
          >
            <Calculator className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'Calculateurs' : 'Calculators'}
          </Link>
        </div>
      </div>
    );
  };

  if (isEmbedPage) {
    return (
      <LangContext.Provider value={{ lang, langPath }}>
        <React.Suspense fallback={<div className="p-4 text-center text-sm text-gray-500">Loading calculator widget...</div>}>
          <Routes>
            <Route path="/">{embedRoutes(lang)}</Route>
            <Route path="/fr">{embedRoutes('fr')}</Route>
          </Routes>
        </React.Suspense>
      </LangContext.Provider>
    );
  }

  return (
   <LangContext.Provider value={{ lang, langPath }}>
    <TrackingScripts />
    <div className={`min-h-screen bg-[#fafafa] text-[#111] transition-colors duration-300 flex flex-col md:flex-row ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <CommandPalette />
      {/* Reading progress indicator for content pages */}
      {isContentPage && <ReadingProgress />}
      
      {/* Accessibility: skip-to-content for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        {lang === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
      </a>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link to={langPath('/')} className="flex items-center gap-2">
          <Logo className="w-8 h-8" mode="light" />
          <span className="font-bold text-lg tracking-tight text-slate-800">Care<span className="text-teal-600 font-black">Calculus</span></span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Auth Button Mobile */}
          {user ? (
            <button
              onClick={() => logout()}
              className="flex items-center justify-center w-10 h-10 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl transition-all duration-200 border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              title="Sign Out"
            >
              <span className="text-xs font-bold uppercase tracking-wider">{user.email ? user.email.charAt(0) : 'G'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2 text-teal-600 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500/30 rounded-lg animate-fade-in bg-teal-50"
              aria-label="Sign In"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <HeartPulse className="w-5 h-5" />
            </button>
          )}
          <InstallAppButton lang={lang} />
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 rounded-lg animate-fade-in"
            aria-label="Global Search"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Search className="w-5 h-5" />
          </button>
          {!isContentPage && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 rounded-xl active:scale-95 transition-all duration-200"
              aria-label="Toggle Navigation Sidebar"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isSidebarOpen ? <X className="w-6 h-6 animate-spin-once" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {!isContentPage && <aside className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-40 w-72 md:w-[280px] bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl border-${isRtl ? 'l' : 'r'} border-slate-200/80 dark:border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.06)] transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:flex-shrink-0 relative overflow-hidden ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full md:translate-x-0' : '-translate-x-full')}`}>
        {/* Subtle ambient lighting backdrop gradient */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-teal-500/10 via-blue-500/5 to-transparent pointer-events-none -z-10" />

        <div className="h-full flex flex-col pt-5 md:pt-8 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          
          <Link to={langPath('/')} className="px-6 mb-6 hidden md:flex items-center justify-between group hover:opacity-95 transition-all duration-200">
            <div className="flex items-center gap-2.5">
              <Logo className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 shadow-sm" mode="light" />
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">Care<span className="text-teal-600 dark:text-teal-400 font-black">Calculus</span></span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-mono text-[9px] font-black tracking-widest border border-teal-200/60 dark:border-teal-800/60 uppercase shadow-2xs">PRO</span>
          </Link>

          {/* Desktop Language Switcher - Segmented Control */}
          <div className="px-6 mb-6">
            <div className="bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner flex gap-1">
              {(['en', 'fr', 'ar'] as LangCode[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2 text-xs font-black rounded-xl uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                    lang === l
                      ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm ring-1 ring-slate-900/5 scale-[1.02]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                  }`}
                  style={{ minHeight: '42px' }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="px-6 mb-5 relative">
            <Search className={`absolute ${isRtl ? 'right-9' : 'left-9'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors group-focus-within:text-teal-500`} />
            <input
              type="text"
              placeholder={lang === 'fr' ? 'Filtrer les outils...' : ('Filter calculators...')}
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className={`w-full py-2.5 bg-slate-100/80 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none rounded-2xl text-xs font-semibold transition-all duration-200 shadow-2xs ${isRtl ? 'pr-10 pl-9 text-right' : 'pl-10 pr-9 text-left'}`}
              style={{ minHeight: '42px' }}
            />
            {sidebarSearch ? (
              <button
                onClick={() => setSidebarSearch('')}
                className={`absolute ${isRtl ? 'left-9' : 'right-9'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className={`hidden sm:inline absolute ${isRtl ? 'left-9' : 'right-9'} top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded-md text-slate-400 shadow-2xs pointer-events-none`}>
                ⌘K
              </span>
            )}
          </div>

          {/* Collapsible/Grouped Tiers Layout */}
          <nav className="flex-1 px-4 space-y-4 pb-6">

            {/* Home link */}
            <Link
              to={langPath('/')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-200 active:scale-[0.98] ${
                isHomePage
                  ? 'bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent text-teal-700 dark:text-teal-300 font-extrabold border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 border-l-4 rtl:border-l-0 rtl:border-r-4 border-transparent'
              }`}
              style={{ minHeight: '46px' }}
            >
              <Logo className="w-5 h-5 shrink-0" mode="light" />
              <span>{lang === 'fr' ? 'Accueil Principal' : 'Clinical Dashboard'}</span>
            </Link>

            {/* TIER I COMPONENT */}
            {navItems.filter(i => i.tier === 1 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleTier(1)}
                  className="w-full text-left rtl:text-right px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-extrabold tracking-wider text-slate-600 dark:text-slate-300 uppercase transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{getLocalizedTierHeader(1)}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${(sidebarSearch || expandedTiers[1]) ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
                </button>
                {(sidebarSearch || expandedTiers[1]) && (
                  <div className="space-y-1 mt-1.5">
                    {navItems.filter(i => i.tier === 1 && matchesSearch(i, sidebarSearch)).map((item) => {
                      const isActive = logicalPath === item.path || (logicalPath === '/' && item.path === '/map-calculator');
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={langPath(item.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 active:scale-[0.98] ${
                            isActive 
                              ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-600' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="line-clamp-2 leading-snug">{lang === 'fr' ? item.nameFr : (item.nameEn)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TIER II COMPONENT */}
            {navItems.filter(i => i.tier === 2 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleTier(2)}
                  className="w-full text-left rtl:text-right px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-extrabold tracking-wider text-slate-600 dark:text-slate-300 uppercase transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{getLocalizedTierHeader(2)}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${(sidebarSearch || expandedTiers[2]) ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
                </button>
                {(sidebarSearch || expandedTiers[2]) && (
                  <div className="space-y-1 mt-1.5">
                    {navItems.filter(i => i.tier === 2 && matchesSearch(i, sidebarSearch)).map((item) => {
                      const isActive = logicalPath === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={langPath(item.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 active:scale-[0.98] ${
                            isActive 
                              ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-600' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="line-clamp-2 leading-snug">{lang === 'fr' ? item.nameFr : (item.nameEn)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TIER III COMPONENT */}
            {navItems.filter(i => i.tier === 3 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleTier(3)}
                  className="w-full text-left rtl:text-right px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-extrabold tracking-wider text-slate-600 dark:text-slate-300 uppercase transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{getLocalizedTierHeader(3)}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${(sidebarSearch || expandedTiers[3]) ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
                </button>
                {(sidebarSearch || expandedTiers[3]) && (
                  <div className="space-y-1 mt-1.5">
                    {navItems.filter(i => i.tier === 3 && matchesSearch(i, sidebarSearch)).map((item) => {
                      const isActive = logicalPath === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={langPath(item.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 active:scale-[0.98] ${
                            isActive 
                              ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-600' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="line-clamp-2 leading-snug">{lang === 'fr' ? item.nameFr : (item.nameEn)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TIER IV COMPONENT (RESOURCES & LIBRARY) */}
            {navItems.filter(i => i.tier === 4 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => toggleTier(4)}
                  className="w-full text-left rtl:text-right px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-extrabold tracking-wider text-slate-600 dark:text-slate-300 uppercase transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{lang === 'fr' ? 'RESSOURCES & BIBLIOTHÈQUE' : ('RESOURCES & LIBRARY')}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${(sidebarSearch || expandedTiers[4]) ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
                </button>
                {(sidebarSearch || expandedTiers[4]) && (
                  <div className="space-y-3 mt-1.5 pl-2 rtl:pl-0 rtl:pr-2">
                    {([
                      { key: 'reading', en: 'Reading', fr: 'Lecture', ar: 'القراءة', dot: 'bg-indigo-500' },
                      { key: 'learning', en: 'Learning', fr: 'Apprentissage', ar: 'التعلّم', dot: 'bg-emerald-500' },
                    ] as const).map((sub) => {
                      const groupItems = navItems.filter(i => i.tier === 4 && (i as any).group === sub.key && matchesSearch(i, sidebarSearch));
                      if (groupItems.length === 0) return null;
                      return (
                        <div key={sub.key} className="space-y-1">
                          <div className="px-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${sub.dot}`} />
                            <span>{lang === 'fr' ? sub.fr : (sub.en)}</span>
                          </div>
                          <div className="space-y-1">
                            {groupItems.map((item) => {
                              const isActive = logicalPath === item.path;
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.path}
                                  to={langPath(item.path)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 active:scale-[0.98] ${
                                    isActive
                                      ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-600'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent'
                                  }`}
                                  style={{ minHeight: '40px' }}
                                >
                                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                                  <span className="line-clamp-2 leading-snug">{lang === 'fr' ? item.nameFr : (item.nameEn)}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* TIER V COMPONENT (UTILITIES) */}
            {navItems.filter(i => i.tier === 5 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <button
                  onClick={() => toggleTier(5)}
                  className="w-full text-left rtl:text-right px-3 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-mono font-extrabold tracking-wider text-slate-600 dark:text-slate-300 uppercase transition-all duration-200 flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <span>{getLocalizedTierHeader(5)}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-transform duration-200 ${(sidebarSearch || expandedTiers[5]) ? '' : (isRtl ? 'rotate-90' : '-rotate-90')}`} />
                </button>
                {(sidebarSearch || expandedTiers[5]) && (
                  <div className="space-y-1 mt-1.5">
                    {navItems.filter(i => i.tier === 5 && matchesSearch(i, sidebarSearch)).map((item) => {
                      const isActive = logicalPath === item.path;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={langPath(item.path)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 active:scale-[0.98] ${
                            isActive 
                              ? 'bg-teal-50 text-teal-800 font-semibold border-l-2 rtl:border-l-0 rtl:border-r-2 border-teal-600' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-normal border-l-2 rtl:border-l-0 rtl:border-r-2 border-transparent'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="line-clamp-2 leading-snug">{lang === 'fr' ? item.nameFr : (item.nameEn)}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Zero results placeholder */}
            {navItems.filter(i => matchesSearch(i, sidebarSearch)).length === 0 && (
              <div className="py-10 px-4 text-center text-xs text-slate-400 font-semibold space-y-2 select-none bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <AlertOctagon className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto animate-pulse" />
                <p>{lang === 'fr' ? 'Aucun outil correspond' : ('No tools found')}</p>
              </div>
            )}

            {/* Faculté de Médecine et de Pharmacie (FMPC) Section */}
            {matchesSearch({ nameEn: 'Faculty of Medicine & Pharmacy FMPC', nameFr: 'Faculté de Médecine et de Pharmacie FMPC', nameAr: 'كلية الطب والصيدلة', path: '/fmp-medecine' }, sidebarSearch) && (
              <div className="space-y-1.5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="px-3 py-2 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/20 text-[11px] font-mono leading-none tracking-wider text-teal-700 dark:text-teal-300 font-extrabold uppercase flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                    <span>{lang === 'fr' ? 'FMP ACCUEIL COURS' : ('FMP ACADEMIC HUB')}</span>
                  </span>
                </div>
                <div className="space-y-1 mt-1.5">
                  <Link
                    to={langPath('/fmp-medecine')}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-[13px] font-medium transition-all duration-200 active:scale-[0.98] ${
                      logicalPath === '/fmp-medecine'
                        ? 'bg-gradient-to-r from-teal-500/15 via-teal-500/5 to-transparent text-teal-700 dark:text-teal-300 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-teal-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white hover:translate-x-1 rtl:hover:-translate-x-1 border-l-4 rtl:border-l-0 rtl:border-r-4 border-transparent'
                    }`}
                    style={{ minHeight: '46px' }}
                  >
                    <GraduationCap className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${logicalPath === '/fmp-medecine' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="line-clamp-2 leading-snug">{lang === 'fr' ? 'Cours & Livres PDF' : ('Courses & PDF Books')}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Sidebar Newsletter subscription widget */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <SidebarNewsletter lang={lang} />
            </div>
          </nav>
        </div>
      </aside>}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 min-w-0 bg-[#fafafa]">
        <div className={`mx-auto px-4 sm:px-6 py-6 md:py-10 relative flex flex-col justify-between min-h-screen ${isContentPage ? 'max-w-6xl' : 'max-w-5xl'}`}>
          <div>

            {/* Global Top Leaderboard Ad — only on content pages to protect calculator UX above-the-fold */}
            {isContentPage && <AdUnit format="leaderboard" className="mb-6" />}

            {/* Unified top navigation widget — calculator pages only */}
            {!isContentPage && !isHomePage && renderUnifiedTopNav()}

            {/* Content-page back-navigation bar */}
            {isContentPage && renderContentPageTopBar()}

            <React.Suspense
              fallback={<div className="py-10 text-center text-sm text-gray-500">Loading clinical module...</div>}
            >
              <Routes>
                {/* English (bare) + French (/fr) + Arabic (/ar) all share the
                    same module routes. Relative child paths let one definition
                    serve every language prefix. Navigate targets are built with
                    langPath so redirects stay inside the active language. */}
                <Route path="/">{moduleRoutes(lang, langPath)}</Route>
                <Route path="/fr">{moduleRoutes('fr', (p) => buildPath(p, 'fr'))}</Route>
                <Route path="*" element={<NotFound lang={lang} />} />
              </Routes>
            </React.Suspense>

            {/* Curator Recommendation flow: satisfies Step 12 (l2) of the core SEO guidelines */}
            {true && (
              <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">
                    {lang === 'fr' ? 'Calculateurs Connexes Recommandés' : ('Suggested Diagnostic Protocols')}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentRelated.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={langPath(item.path)}
                        className="p-4 border border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/20 transition-all duration-200 flex items-center justify-between group"
                        style={{ minHeight: '44px' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-lg transition-all shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-800 block group-hover:text-blue-700 transition-colors">
                              {lang === 'fr' ? item.nameFr : (item.nameEn)}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400 block uppercase font-medium">TIER {item.tier}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Social sharing bar */}
            <div className="mt-8">
              <SocialShare
                title={typeof document !== 'undefined' ? document.title : 'CareCalculus'}
                lang={lang}
              />
            </div>

            {/* In-article ad unit — between content and footer */}
            <AdUnit format="in-article" className="mt-6" />

          </div>

          {/* Absolute bottom of page scientific validation reviews (E-E-A-T CERTIFIED, STEP 13) */}
          <footer className="mt-16 pt-10 pb-6 border-t border-gray-200 text-gray-500 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              
              {/* E-E-A-T panel */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <Logo className="w-7 h-7" mode="light" />
                  <h4 className="font-extrabold text-sm tracking-tight text-slate-800">CareCalculus Clinical Registry</h4>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Toutes les formules de score médical d’urgence et d’équivalences de dosage clinique sont basées sur le consensus professionnel scientifiquement prouvé et publié par les instances d’autorité (AHA, SRLF, ESC, NIH).' 
                    : ('All emergency index calculators, body mass variables, and drug equivalence metrics are strictly reviewed and clinical protocol aligned according to peer-reviewed guides (AHA, ESC, CDC, SFAR).')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-teal-50 rounded-md text-[9px] font-extrabold text-teal-700 border border-teal-100 uppercase tracking-wider">E-E-A-T Certified</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 rounded-md text-[9px] font-extrabold text-emerald-600 border border-emerald-100 uppercase tracking-wider">PubMed Reference Linked</span>
                </div>
              </div>

              {/* Clinical Sources & Validation */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-gray-900 font-mono">
                  {lang === 'fr' ? 'SOURCES & VALIDATION CLINIQUE' : ('CLINICAL SOURCES & VALIDATION')}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'fr'
                    ? 'Chaque formule est tirée de la littérature médicale publiée (AHA, ESC, SFAR, HAS, NIH) et documentée avec ses références originales.'
                    : ('Every formula is derived from published peer-reviewed literature (AHA, ESC, NIH, SFAR, CDC) with the original study or guideline cited for each tool.')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['AHA', 'ESC', 'NIH', 'SFAR', 'CDC', 'HAS', 'SRLF'].map(org => (
                    <span key={org} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[9px] font-mono font-bold text-gray-600 uppercase">{org}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to={langPath('/about')} className="text-[11px] text-blue-600 hover:underline font-semibold">
                    {lang === 'fr' ? 'À propos de nous' : 'About CareCalculus'}
                  </Link>
                  <span className="text-gray-300">·</span>
                  <Link to={langPath('/disclaimer')} className="text-[11px] text-blue-600 hover:underline font-semibold">
                    {lang === 'fr' ? 'Avertissement médical' : 'Medical Disclaimer'}
                  </Link>
                </div>
              </div>

              {/* Internal page links matrix to maximize internal PageRank distribution */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-gray-900 font-mono">
                  {lang === 'fr' ? 'MAILLAGE CLINIQUE STRATÉGIQUE' : ('INTERNAL CRAWLER MAP')}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Parcourez instantanément nos différents calculateurs pour assurer une prise en charge optimale.' 
                    : ('Navigate with zero friction between clinical tools to audit organ parameters and critical thresholds.')}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[10px] font-mono font-semibold">
                  {navItems.slice(0, 6).map(n => (
                    <Link key={n.path} to={langPath(n.path)} className="text-blue-650 hover:text-blue-800 hover:underline truncate">
                      ▸ {lang === 'fr' ? n.nameFr : (n.nameEn)}
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-gray-400">
                © 2026 CareCalculus — Free multilingual clinical decision support.
              </span>
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <Link to={langPath('/about')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'À propos' : 'About'}
                </Link>
                <Link to={langPath('/disclaimer')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Avertissement' : 'Disclaimer'}
                </Link>
                <Link to={langPath('/privacy')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Confidentialité' : 'Privacy'}
                </Link>
                <Link to={langPath('/terms')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Conditions' : 'Terms'}
                </Link>
                {/* Adsterra Smartlink (Sponsor) */}
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {lang === 'fr' ? 'Sponsorisé' : 'Sponsored'}
                </a>
              </div>
            </div>
          </footer>

        </div>
      </main>
      
      {/* Newsletter capture (appears after 2 page views) */}
      <NewsletterCapture lang={lang} />

      {/* GDPR Cookie Consent banner */}
      <CookieConsent lang={lang} />

      {/* Mandatory Medical Disclaimer modal */}
      <MedicalDisclaimer lang={lang} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sticky Mobile Footer Ad */}
      <StickyMobileAd />
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
   </LangContext.Provider>
  );
}

export default function App({ url }: { url?: string }) {
  // During build-time prerendering a `url` is supplied and we render with
  // StaticRouter (no browser history). At runtime in the browser we use
  // BrowserRouter so client-side navigation works normally.
  if (url) {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <UnitSystemProvider>
            <StaticRouter location={url}>
              <AppLayout />
            </StaticRouter>
          </UnitSystemProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UnitSystemProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </UnitSystemProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}


