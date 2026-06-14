import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { Activity, BookOpen, HeartPulse, Menu, X, LayoutDashboard, Calculator, Droplet, Brain, TestTube, AlertOctagon, ArrowRightLeft, AlertTriangle, Stethoscope, Wind, FileText, ShieldCheck, Sparkles, ChevronRight, Search, Globe, Scale, MonitorPlay, GraduationCap, Newspaper } from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { StaticRouter } from 'react-router';
import { LangContext, parsePathname, buildPath, PREFIXED_LANGS } from './utils/lang';
import { organizationJsonLd, getLocalizedMeta as seoGetLocalizedMeta, getMedicalSchema, pageUrl as seoPageUrl, getBreadcrumbSchema } from './utils/seo';
import Logo from './components/Logo';
import AdUnit from './components/AdUnit';
import SocialShare from './components/SocialShare';
import ReadingProgress from './components/ReadingProgress';
import NewsletterCapture from './components/NewsletterCapture';

// Page import factories kept in one list so they can be (a) wrapped in
// React.lazy for client-side code-splitting and (b) eagerly awaited during
// build-time prerendering, which primes React.lazy's cache so renderToString
// emits the real page body instead of the Suspense fallback.
const pageLoaders = [
  () => import('./pages/MapCalculator'),
  () => import('./pages/BmiCalculator'),
  () => import('./pages/GcsCalculator'),
  () => import('./pages/DripRate'),
  () => import('./pages/CreatinineClearance'),
  () => import('./pages/WellsScore'),
  () => import('./pages/MedicalConversions'),
  () => import('./pages/CorrectedCalcium'),
  () => import('./pages/QsofaScore'),
  () => import('./pages/Curb65Score'),
  () => import('./pages/Cha2ds2VascScore'),
  () => import('./pages/Phq9Score'),
  () => import('./pages/MeldScore'),
  () => import('./pages/SirsCriteria'),
  () => import('./pages/PfRatio'),
  () => import('./pages/TidalVolume'),
  () => import('./pages/AncCalculator'),
  () => import('./pages/AdjustedBodyWeight'),
  () => import('./pages/SteroidConversion'),
  () => import('./pages/MedicalBlog'),
  () => import('./pages/Blog'),
  () => import('./pages/Presentations'),
  () => import('./pages/Courses'),
  () => import('./pages/OrlSpecialization'),
  () => import('./pages/About'),
  () => import('./pages/Disclaimer'),
  () => import('./pages/Privacy'),
  () => import('./pages/Terms'),
  () => import('./pages/Glp1Hub'),
] as const;

const [
  MapCalculator, BmiCalculator, GcsCalculator, DripRate, CreatinineClearance,
  WellsScore, MedicalConversions, CorrectedCalcium, QsofaScore, Curb65Score,
  Cha2ds2VascScore, Phq9Score, MeldScore, SirsCriteria, PfRatio, TidalVolume,
  AncCalculator, AdjustedBodyWeight, SteroidConversion, MedicalBlog, Blog,
  Presentations, Courses, OrlSpecialization, About, Disclaimer, Privacy, Terms,
  Glp1Hub,
] = pageLoaders.map((loader) => React.lazy(loader as any)) as any[];

const HomePage = React.lazy(() => import('./pages/HomePage'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

/**
 * Eagerly resolve every page chunk. Called once before prerendering so that
 * React.lazy resolves synchronously during renderToString. Each loader returns
 * the SAME module promise React.lazy uses (bundler-cached), so awaiting them
 * here transitions the lazy components to their resolved state.
 */
export async function preloadPages() {
  await Promise.all([
    ...pageLoaders.map((load) => load()),
    import('./pages/HomePage'),
  ]);
}

// Routes for the static legal/about pages (no lang prop needed)
const LEGAL_ROUTES = ['/about', '/disclaimer', '/privacy', '/terms'];

// Routes that open in full-width reading mode (no sidebar, no top widgets)
const CONTENT_ROUTES = ['/blog', '/blog-articles', '/presentations', '/cours', '/orl', '/about', '/disclaimer', '/privacy', '/terms', '/glp-1-hub', '/hub-glp1', '/%D9%85%D8%B1%D9%83%D8%B2-glp1', '/مركز-glp1'];

import { LangCode } from './types';

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-red-600 bg-red-50 font-mono text-sm max-w-full overflow-auto h-screen">
          <h1 className="text-xl font-bold mb-4">React Error</h1>
          <pre>{this.state.error?.toString()}</pre>
          <pre className="mt-4 opacity-70">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Structured Clinical Navigation Items with Tier levels & localizations for multi-lingual routing
export const navItems = [
  // Tier 1: Emergency & Critical Care
  { path: '/map-calculator', nameEn: 'MAP Calculator', nameFr: 'Calculateur PAM', nameAr: 'حساب الضغط المتوسط MAP', icon: Activity, tier: 1 },
  { path: '/glasgow-coma-scale', nameEn: 'GCS Calculator', nameFr: 'Échelle de Glasgow', nameAr: 'معيار غلاسكو للغيبوبة GCS', icon: Brain, tier: 1 },
  { path: '/qsofa-score', nameEn: 'qSOFA Score Sepsis', nameFr: 'Score qSOFA Sepsis', nameAr: 'مؤشر qSOFA لتسمم الدم', icon: AlertTriangle, tier: 1 },
  { path: '/sirs-criteria', nameEn: 'SIRS Criteria Sepsis', nameFr: 'Critères SIRS Sepsis', nameAr: 'معايير SIRS للالتهاب العام', icon: AlertTriangle, tier: 1 },
  { path: '/curb65-score', nameEn: 'CURB-65 Pneumonia', nameFr: 'Score CURB-65 Pneumonie', nameAr: 'معيار CURB-65 للالتهاب الرئوي', icon: Stethoscope, tier: 1 },
  { path: '/pf-ratio', nameEn: 'P/F Ratio Lung Injury', nameFr: 'Rapport P/F Respiratoire', nameAr: 'نسبة PaO2/FiO2 للرئتين', icon: Wind, tier: 1 },
  { path: '/tidal-volume', nameEn: 'Tidal Volume ARDS', nameFr: 'Volume Courant (Tidal)', nameAr: 'حجم الهواء التنفسي المتوقع', icon: Wind, tier: 1 },

  // Tier 2: Organ Function & Internal Medicine
  { path: '/creatinine-clearance', nameEn: 'Creatinine Clearance', nameFr: 'Clairance Créatinine', nameAr: 'تصفية الكرياتينين وكفاءة الكلى', icon: TestTube, tier: 2 },
  { path: '/meld-score', nameEn: 'MELD Score Liver', nameFr: 'Score MELD Hépatique', nameAr: 'نقاط MELD لتليف وفشل الكبد', icon: Activity, tier: 2 },
  { path: '/wells-score', nameEn: 'Wells Score', nameFr: 'Score de Wells DVT/PE', nameAr: 'نقاط ويلز للانسداد الرئوي والجلطة', icon: AlertOctagon, tier: 2 },
  { path: '/cha2ds2-vasc', nameEn: 'CHA2DS2-VASc stroke', nameFr: 'Score CHA2DS2-VASc FA', nameAr: 'معيار سكتة الرجفان الأذيني', icon: HeartPulse, tier: 2 },
  { path: '/corrected-calcium', nameEn: 'Corrected Calcium', nameFr: 'Calcium Corrigé Albumin', nameAr: 'الكالسيوم المصحح بالألبومين', icon: TestTube, tier: 2 },
  { path: '/anc-calculator', nameEn: 'ANC Calculator', nameFr: 'Calculateur NAN Neutro', nameAr: 'حساب خلايا الدم المتعادلة ANC', icon: TestTube, tier: 2 },

  // Tier 3: Infusions, Metrics & Pharmacology
  { path: '/drip-rate-calculator', nameEn: 'IV Drip Rate Tool', nameFr: 'Calcul Débit Perfusion', nameAr: 'سرعة تنقيط المحلول الوريدي', icon: Droplet, tier: 3 },
  { path: '/steroid-conversion', nameEn: 'Steroids Equivalence', nameFr: 'Équivalence Corticoïdes', nameAr: 'تحويل جرعات الكورتيزون والستيرويد', icon: ArrowRightLeft, tier: 3 },
  { path: '/adjusted-body-weight', nameEn: 'IBW & ABW Weight', nameFr: 'Poids Idéal & Ajusté', nameAr: 'حساب الوزن المثالي والمعدل', icon: LayoutDashboard, tier: 3 },
  { path: '/medical-conversions', nameEn: 'Unit Conversions', nameFr: 'Conversions d’Unités', nameAr: 'تحويل الوحدات المخبرية والطبية', icon: ArrowRightLeft, tier: 3 },
  { path: '/bmi-calculator', nameEn: 'BMI Calculator', nameFr: 'Calculateur IMC', nameAr: 'مؤشر كتلة وزن الجسم BMI', icon: LayoutDashboard, tier: 3 },
  { path: '/phq9-score', nameEn: 'PHQ-9 Depression', nameFr: 'Score PHQ-9 Dépression', nameAr: 'مقياس PHQ-9 لتشخيص الاكتئاب', icon: Brain, tier: 3 },
  // Tier 4 — Resources & Library (grouped: Reading vs Learning)
  { path: '/glp-1-hub', nameEn: 'GLP-1 Hub', nameFr: 'Hub GLP-1', nameAr: 'مركز أدوية GLP-1', icon: Sparkles, tier: 4, group: 'reading' as const, badge: 'NEW' },
  { path: '/blog', nameEn: 'Medical Journals', nameFr: 'Journaux Médicaux', nameAr: 'المجلات الطبية', icon: BookOpen, tier: 4, group: 'reading' as const, badge: '2k+' },
  { path: '/blog-articles', nameEn: 'Blog', nameFr: 'Blog', nameAr: 'المدونة', icon: Newspaper, tier: 4, group: 'reading' as const, badge: 'NEW' },
  { path: '/orl', nameEn: 'ORL Specialization', nameFr: 'Spécialisation ORL', nameAr: 'تخصص سرطان الحنجرة ORL', icon: HeartPulse, tier: 4, group: 'reading' as const, badge: 'NEW' },
  { path: '/presentations', nameEn: 'Presentations', nameFr: 'Présentations', nameAr: 'العروض التقديمية', icon: MonitorPlay, tier: 4, group: 'learning' as const, badge: 'PPTX' },
  { path: '/cours', nameEn: 'Courses (PDF)', nameFr: 'Cours (PDF)', nameAr: 'المحاضرات والدروس', icon: GraduationCap, tier: 4, group: 'learning' as const, badge: 'PDF' },
];

export const TIER_HEADERS: Record<number, Record<LangCode, string>> = {
  1: {
    en: 'Tier 1 — Emergency & Critical Care',
    fr: 'Tier I — Urgences & Soins Critiques',
    ar: 'الفئة الأولى — الحالات الحرجة والعناية المركزة'
  },
  2: {
    en: 'Tier 2 — Metabolic & Cardiorenal',
    fr: 'Tier II — Métabolique & Cardiorénal',
    ar: 'الفئة الثانية — الاستقلاب والقلب والكلية'
  },
  3: {
    en: 'Tier 3 — Therapeutic & Dosing Metrics',
    fr: 'Tier III — Métriques, Perfusions & Doses',
    ar: 'الفئة الثالثة — المحاليل والقياسات والجرعات'
  }
};


// The set of clinical module routes, defined once with RELATIVE paths so it can
// be mounted under "/", "/fr", and "/ar" without duplication. `langPath` builds
// the redirect targets for the index/fallback routes in the active language.
function moduleRoutes(lang: LangCode, langPath: (p: string) => string) {
  return (
    <>
      <Route index element={<HomePage lang={lang} />} />
      <Route path="home" element={<HomePage lang={lang} />} />
      <Route path="map-calculator" element={<MapCalculator lang={lang} />} />
      <Route path="bmi-calculator" element={<BmiCalculator lang={lang} />} />
      <Route path="glasgow-coma-scale" element={<GcsCalculator lang={lang} />} />
      <Route path="drip-rate-calculator" element={<DripRate lang={lang} />} />
      <Route path="creatinine-clearance" element={<CreatinineClearance lang={lang} />} />
      <Route path="wells-score" element={<WellsScore lang={lang} />} />
      <Route path="medical-conversions" element={<MedicalConversions lang={lang} />} />
      <Route path="corrected-calcium" element={<CorrectedCalcium lang={lang} />} />
      <Route path="qsofa-score" element={<QsofaScore lang={lang} />} />
      <Route path="curb65-score" element={<Curb65Score lang={lang} />} />
      <Route path="cha2ds2-vasc" element={<Cha2ds2VascScore lang={lang} />} />
      <Route path="phq9-score" element={<Phq9Score lang={lang} />} />
      <Route path="meld-score" element={<MeldScore lang={lang} />} />
      <Route path="sirs-criteria" element={<SirsCriteria lang={lang} />} />
      <Route path="pf-ratio" element={<PfRatio lang={lang} />} />
      <Route path="tidal-volume" element={<TidalVolume lang={lang} />} />
      <Route path="anc-calculator" element={<AncCalculator lang={lang} />} />
      <Route path="adjusted-body-weight" element={<AdjustedBodyWeight lang={lang} />} />
      <Route path="steroid-conversion" element={<SteroidConversion lang={lang} />} />
      <Route path="blog" element={<MedicalBlog lang={lang} />} />
      <Route path="blog/:slug" element={<MedicalBlog lang={lang} />} />
      <Route path="blog-articles" element={<Blog lang={lang} />} />
      <Route path="blog-articles/:slug" element={<Blog lang={lang} />} />
      <Route path="presentations" element={<Presentations lang={lang} />} />
      <Route path="presentations/:slug" element={<Presentations lang={lang} />} />
      <Route path="cours" element={<Courses lang={lang} />} />
      <Route path="cours/:slug" element={<Courses lang={lang} />} />
      <Route path="orl" element={<OrlSpecialization lang={lang} />} />
      <Route path="orl/:slug" element={<OrlSpecialization lang={lang} />} />
      <Route path="glp-1-hub" element={<Glp1Hub lang={lang} />} />
      <Route path="hub-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="مركز-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="%D9%85%D8%B1%D9%83%D8%B2-glp1" element={<Glp1Hub lang={lang} />} />
      <Route path="about" element={<About lang={lang} />} />
      <Route path="disclaimer" element={<Disclaimer lang={lang} />} />
      <Route path="privacy" element={<Privacy lang={lang} />} />
      <Route path="terms" element={<Terms lang={lang} />} />
    </>
  );
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Language is derived from the URL — the prefix (/fr, /ar) is the single
  // source of truth. `path` is the language-agnostic logical path.
  const { lang, path: logicalPath } = parsePathname(location.pathname);

  // Build a URL for the current language out of a logical path.
  const langPath = (p: string) => {
    const clean = p.startsWith('/') ? p : `/${p}`;
    if (clean === '/glp-1-hub' || clean === '/hub-glp1' || clean === '/مركز-glp1' || decodeURIComponent(clean) === '/مركز-glp1') {
      if (lang === 'fr') return '/fr/hub-glp1';
      if (lang === 'ar') return '/ar/مركز-glp1';
      return '/glp-1-hub';
    }
    return buildPath(p, lang);
  };

  // Detect layout mode
  const isContentPage = CONTENT_ROUTES.some(r => logicalPath === r || logicalPath.startsWith(r + '/'));
  const isHomePage = logicalPath === '/' || logicalPath === '/home';

  // Switching language navigates to the same logical page under the new prefix.
  const setLang = (next: LangCode) => {
    localStorage.setItem('carecalculus-lang', next);
    const cleanLogical = logicalPath.startsWith('/') ? logicalPath : `/${logicalPath}`;
    if (cleanLogical === '/glp-1-hub' || cleanLogical === '/hub-glp1' || cleanLogical === '/مركز-glp1' || decodeURIComponent(cleanLogical) === '/مركز-glp1') {
      if (next === 'fr') navigate('/fr/hub-glp1');
      else if (next === 'ar') navigate('/ar/مركز-glp1');
      else navigate('/glp-1-hub');
      return;
    }
    navigate(buildPath(logicalPath, next));
  };

  // First-visit language routing: only when landing on the bare root ("/") do we
  // consult a stored preference / browser language and redirect to the matching
  // prefix. Beyond the root, the URL itself is authoritative.
  useEffect(() => {
    if (location.pathname !== '/') return;
    const stored = localStorage.getItem('carecalculus-lang');
    let preferred: LangCode = 'en';
    if (stored === 'fr' || stored === 'ar' || stored === 'en') {
      preferred = stored;
    } else {
      const browserLangs = navigator.languages || [navigator.language];
      for (const b of browserLangs) {
        const code = b.toLowerCase().slice(0, 2);
        if (code === 'fr') { preferred = 'fr'; break; }
        if (code === 'ar') { preferred = 'ar'; break; }
      }
    }
    if (preferred !== 'en') {
      navigate(buildPath('/', preferred), { replace: true });
    }
  }, [location.pathname, navigate]);

  const [geoState, setGeoState] = useState<{
    region: string;
    standard: 'Metric (SI)' | 'US Customary / Imperial';
    zone: string;
  }>(() => {
    let region = 'Global';
    let standard: 'Metric (SI)' | 'US Customary / Imperial' = 'Metric (SI)';
    let zone = 'UTC';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const lowercaseZone = zone.toLowerCase();
      if (lowercaseZone.includes('america') || lowercaseZone.includes('us/') || lowercaseZone.includes('canada')) {
        region = 'North America (US/CA)';
        standard = 'US Customary / Imperial';
      } else if (lowercaseZone.includes('europe') || lowercaseZone.includes('london') || lowercaseZone.includes('paris')) {
        region = 'Europe (EU/UK)';
        standard = 'Metric (SI)';
      } else if (lowercaseZone.includes('africa') || lowercaseZone.includes('middleeast') || lowercaseZone.includes('riyadh') || lowercaseZone.includes('cairo') || lowercaseZone.includes('casablanca')) {
        region = 'Middle East & North Africa (MENA)';
        standard = 'Metric (SI)';
      } else if (lowercaseZone.includes('asia') || lowercaseZone.includes('tokyo') || lowercaseZone.includes('sydney')) {
        region = 'Asia Pacific';
        standard = 'Metric (SI)';
      }
    } catch (e) {
      console.warn("Failed to auto-detect geo metrics.", e);
    }

    const savedStandard = typeof window !== 'undefined' ? localStorage.getItem('carecalculus-standard') : null;
    if (savedStandard === 'Metric (SI)' || savedStandard === 'US Customary / Imperial') {
      standard = savedStandard as 'Metric (SI)' | 'US Customary / Imperial';
    }

    return { region, standard, zone };
  });

  const toggleGeoStandard = () => {
    const nextStandard = geoState.standard === 'Metric (SI)' ? 'US Customary / Imperial' : 'Metric (SI)';
    setGeoState(prev => ({ ...prev, standard: nextStandard }));
    localStorage.setItem('carecalculus-standard', nextStandard);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [topSearch, setTopSearch] = useState('');

  const isRtl = lang === 'ar';

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
    const meta = seoGetLocalizedMeta(logicalPath, lang);
    const pageUrl = seoPageUrl(logicalPath, lang);
    const mainTitle = meta.title;
    const mainDesc = meta.desc;
    
    // 1. Dynamic Title
    document.title = mainTitle;

    // 2. Dynamic Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', mainDesc);

    // 3. Dynamic Keywords
    let kwMeta = document.querySelector('meta[name="keywords"]');
    if (!kwMeta) {
      kwMeta = document.createElement('meta');
      kwMeta.setAttribute('name', 'keywords');
      document.head.appendChild(kwMeta);
    }
    kwMeta.setAttribute('content', meta.keywords);

    // 4. Dynamic Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageUrl);

    // 5. Open Graph (OG) Tag Matrix
    const ogTags = {
      'og:title': mainTitle,
      'og:description': mainDesc,
      'og:url': pageUrl,
      'og:type': 'website',
      'og:site_name': 'CareCalculus Clinical Suite',
      'og:image': 'https://carecalculus.com/og-image.png',
      'og:image:alt': 'CareCalculus — Free multilingual clinical calculators for ICU, ER and hospital clinicians',
      'og:locale': lang === 'fr' ? 'fr_FR' : (lang === 'ar' ? 'ar_AR' : 'en_US'),
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
      'twitter:title': mainTitle,
      'twitter:description': mainDesc,
      'twitter:image': 'https://carecalculus.com/og-image.png',
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
    (['en', 'fr', 'ar'] as const).forEach(l => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', l);
      const prefix = l === 'en' ? '' : `/${l}`;
      const pathSuffix = logicalPath === '/' ? '/map-calculator' : logicalPath;
      link.setAttribute('href', `https://carecalculus.com${prefix}${pathSuffix}`);
      document.head.appendChild(link);
    });

    // Inject x-default language fallback for standard-conforming global indexers
    document.querySelectorAll('link[rel="alternate"][hreflang="x-default"]').forEach(el => el.remove());
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    const xPathSuffix = logicalPath === '/' ? '/map-calculator' : logicalPath;
    xDefaultLink.setAttribute('href', `https://carecalculus.com${xPathSuffix}`);
    document.head.appendChild(xDefaultLink);

    // 8. Schema JSON-LD Structured Data Node
    let schemaScript = document.getElementById('carecalculus-json-ld');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'carecalculus-json-ld');
    schemaScript.setAttribute('type', 'application/ld+json');

    const schemaList: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": meta.title,
        "operatingSystem": "Web Browser",
        "applicationCategory": "HealthApplication",
        "description": meta.desc,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "url": pageUrl,
        "inLanguage": lang,
        "isAccessibleForFree": true,
        "author": {
          "@type": "Organization",
          "name": "CareCalculus",
          "url": "https://carecalculus.com"
        }
      }
    ];

    const medicalNode = getMedicalSchema(logicalPath);
    if (medicalNode) {
      schemaList.push(medicalNode);
    }

    const breadcrumbNode = getBreadcrumbSchema(logicalPath, lang);
    if (breadcrumbNode) {
      schemaList.push(breadcrumbNode);
    }

    // Sitewide Organization + WebSite nodes (E-E-A-T / GEO) on every page.
    schemaList.push(...organizationJsonLd());

    schemaScript.textContent = JSON.stringify(schemaList, null, 2);
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
                : (lang === 'ar' ? 'فهرس البحث الطبي والوصول السريع' : 'TOP CLINICAL KEYWORD INDEX')}
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-400 font-bold uppercase tracking-widest hidden sm:inline-block">
            {lang === 'fr' ? '10 Index Principaux' : (lang === 'ar' ? '١٠ مؤشرات بحث سريعة' : '10 Primary Indices')}
          </span>
        </div>

        {/* Beautiful Touch & Horizontal Scrollable Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {popularTags.map((tag) => {
            const isActive = currentPath === tag.path;
            const label = lang === 'fr' ? tag.fr : (lang === 'ar' ? tag.ar : tag.en);
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
          : (lang === 'ar' ? 'تم تفعيل معايير الوحدات الأمريكية (FDA, AHA, ACC) المعتمدة.' : 'US standard guidelines (FDA, AHA, ACC) presets configured.');
      }
      if (lang === 'fr') {
        return 'Recommandations Européenne & Française (HAS, SFMU) et système métrique actif.';
      }
      if (lang === 'ar') {
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
                <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-widest leading-none">
                  CareCalculus GEO-Intelligence Node
                </span>
              </div>
              <h3 className="text-xs font-black tracking-wider uppercase font-mono mt-1 text-slate-200">
                {lang === 'fr' ? 'Protocole Régional Détecté' : (lang === 'ar' ? 'معيار البروتوكول الإقليمي النشط' : 'Active Regional Guidelines Standard')}
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
              className="py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-xs text-white font-mono font-bold rounded-xl transition border border-blue-500 shadow-sm cursor-pointer active:scale-95 flex items-center gap-1"
              style={{ minHeight: '44px' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{lang === 'fr' ? 'Intervertir' : (lang === 'ar' ? 'تبديل المعيار' : 'Toggle Unit Mode')}</span>
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
              {lang === 'fr' ? 'RECHERCHE D’OUTIL DIRECTE' : (lang === 'ar' ? 'البحث السريري الذكي الفوري' : 'RAPID DECISION SUPPORT SEARCH')}
            </span>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              {lang === 'fr' 
                ? 'Accès aux Protocoles Cliniques' 
                : (lang === 'ar' ? 'الباحث عن المعادلات الطبية والتشخيصية' : 'Search Clinical Modules & Tiers')}
            </h2>
          </div>

          <div className="flex-1 max-w-lg w-full relative">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
            <input
              id="top-page-search-field"
              type="text"
              placeholder={lang === 'fr' ? 'Saisissez sepsis, GCS, calcul de reins, corticoides...' : (lang === 'ar' ? 'ابحث هنا باسم الحاسبة أو المرض (مثل sepsis، غلاسكو، كبد)...' : 'Type sepsis, GCS, renal clearance, steroids conversion...')}
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
              {lang === 'fr' ? 'RÉSULTATS DE RECHERCHE CORRESPONDANTS' : (lang === 'ar' ? 'نتائج الفحص والوصول الفوري المكتشفة' : 'MATCHING CLINICAL MODULES FOUND')}
            </span>
            {filteredTopResults.length === 0 ? (
              <div className="p-4 text-center bg-gray-50 rounded-xl border border-gray-150 text-xs font-semibold text-gray-500 flex items-center justify-center gap-2">
                <AlertOctagon className="w-4 h-4 text-gray-400" />
                <span>{lang === 'fr' ? 'Aucun protocole clinique actif trouvé.' : (lang === 'ar' ? 'لا توجد حاسبة مخصصة تطابق البحث.' : 'No diagnostic calculator or guidelines found matching query.')}</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredTopResults.map((item) => {
                  const Icon = item.icon;
                  const itemTitle = lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn);
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
              placeholder={lang === 'fr' ? 'Rechercher sepsis, GCS, rein, stéroïdes...' : (lang === 'ar' ? 'ابحث: sepsis، غلاسكو، كبد...' : 'Search: sepsis, GCS, renal, steroids...')}
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
        </div>

        {/* Live search results */}
        {topSearch && (
          <div className="px-4 py-3 bg-blue-50/60 border-b border-blue-100">
            {filteredTopResults.length === 0 ? (
              <p className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-gray-400" />
                {lang === 'fr' ? 'Aucun protocole trouvé.' : (lang === 'ar' ? 'لا توجد نتائج مطابقة.' : 'No matching calculator found.')}
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {filteredTopResults.map((item) => {
                  const Icon = item.icon;
                  const label = lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn);
                  return (
                    <Link key={item.path} to={langPath(item.path)} onClick={() => setTopSearch('')}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-xs font-bold text-gray-800"
                      style={{ minHeight: '40px' }}>
                      <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
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
            const label = lang === 'fr' ? tag.fr : (lang === 'ar' ? tag.ar : tag.en);
            return (
              <Link key={tag.path} to={langPath(tag.path)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
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
      '/orl':           { en: 'ORL Specialization', fr: 'Spécialisation ORL', ar: 'تخصص سرطان الحنجرة ORL', icon: HeartPulse },
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
    const sectionLabel = section ? (lang === 'fr' ? section.fr : lang === 'ar' ? section.ar : section.en) : '';
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
                {lang === 'fr' ? 'Article' : lang === 'ar' ? 'المقال' : 'Article'}
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
            {lang === 'fr' ? 'Hub GLP-1' : lang === 'ar' ? 'مركز GLP-1' : 'GLP-1 Hub'}
          </Link>
          <Link
            to={langPath('/map-calculator')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition-all"
            style={{ minHeight: '36px' }}
          >
            <Calculator className="w-3.5 h-3.5" />
            {lang === 'fr' ? 'Calculateurs' : lang === 'ar' ? 'الحاسبات' : 'Calculators'}
          </Link>
        </div>
      </div>
    );
  };

  return (
   <LangContext.Provider value={{ lang, langPath }}>
    <div className={`min-h-screen bg-[#fafafa] text-[#111] transition-colors duration-300 flex flex-col md:flex-row ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Reading progress indicator for content pages */}
      {isContentPage && <ReadingProgress />}
      
      {/* Accessibility: skip-to-content for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        {lang === 'fr' ? 'Aller au contenu principal' : lang === 'ar' ? 'انتقل إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link to={langPath('/')} className="flex items-center gap-2">
          <Logo className="w-8 h-8" mode="light" />
          <span className="font-bold text-lg tracking-tight text-slate-800">Care<span className="text-teal-600 font-black">Calculus</span></span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-0.5 rounded-lg border border-gray-205 flex text-[10px]">
            {(['en', 'fr', 'ar'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 font-bold rounded uppercase transition-all ${lang === l ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-400'}`}
                style={{ minWidth: '24px', minHeight: '24px' }}
              >
                {l}
              </button>
            ))}
          </div>
          {!isContentPage && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 rounded-lg"
              aria-label="Toggle Navigation Sidebar"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Navigation grouped by clinical tiers — hidden on content/reading pages */}
      {!isContentPage && <aside className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-40 w-64 bg-white border-${isRtl ? 'l' : 'r'} border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full md:translate-x-0' : '-translate-x-full')}`}>
        <div className="h-full flex flex-col pt-5 md:pt-8 pb-4 overflow-y-auto">
          
          <Link to={langPath('/')} className="px-6 mb-6 hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="w-10 h-10" mode="light" />
            <span className="font-bold text-2xl tracking-tight text-slate-800">Care<span className="text-teal-600 font-black">Calculus</span></span>
          </Link>

          {/* Desktop Language Switcher (Spacious 44px targets) */}
          <div className="px-6 mb-6">
            <div className="bg-gray-100/90 p-1 rounded-xl border border-gray-200/80 shadow-inner flex">
              {(['en', 'fr', 'ar'] as LangCode[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex-1 py-2 text-xs font-black rounded-lg uppercase tracking-wide transition-all duration-300 ${
                    lang === l
                      ? 'bg-white text-blue-600 shadow-md ring-1 ring-gray-905/5'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Search Bar */}
          <div className="px-6 mb-4">
            <div className="relative">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
              <input
                id="sidebar-search-input"
                type="text"
                placeholder={lang === 'fr' ? 'Rechercher un outil...' : (lang === 'ar' ? 'بحث عن أداة حسابية...' : 'Search clinical tools...')}
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className={`w-full py-2 bg-gray-50 focus:bg-white text-gray-800 border border-gray-200 focus:border-blue-500 rounded-xl text-xs font-semibold outline-none transition-all duration-300 placeholder-gray-400 ${
                  isRtl ? 'pr-9 pl-8 text-right' : 'pl-9 pr-8 text-left'
                }`}
                style={{ minHeight: '38px' }}
              />
              {sidebarSearch && (
                <button
                  onClick={() => setSidebarSearch('')}
                  className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5 rounded-md hover:bg-gray-100 transition`}
                  style={{ minWidth: '20px', minHeight: '20px' }}
                  aria-label="Clear sidebar search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Collapsible/Grouped Tiers Layout */}
          <nav className="flex-1 px-4 space-y-6 pb-6">

            {/* Home link */}
            <Link
              to={langPath('/')}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                isHomePage
                  ? 'bg-teal-50 text-teal-700 font-extrabold border border-teal-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`}
              style={{ minHeight: '44px' }}
            >
              <Logo className="w-5 h-5 shrink-0" mode="light" />
              <span>{lang === 'fr' ? 'Accueil' : lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
            </Link>

            {/* TIER I COMPONENT */}
            {navItems.filter(i => i.tier === 1 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2.5 text-[10px] font-mono leading-none tracking-wider text-gray-400 font-extrabold uppercase border-b border-gray-100 pb-1 flex items-center justify-between">
                  <span>{getLocalizedTierHeader(1)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  {navItems.filter(i => i.tier === 1 && matchesSearch(i, sidebarSearch)).map((item) => {
                    const isActive = logicalPath === item.path || (logicalPath === '/' && item.path === '/map-calculator');
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={langPath(item.path)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 font-extrabold shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="truncate">{lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER II COMPONENT */}
            {navItems.filter(i => i.tier === 2 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2.5 text-[10px] font-mono leading-none tracking-wider text-gray-400 font-extrabold uppercase border-b border-gray-100 pb-1 flex items-center justify-between">
                  <span>{getLocalizedTierHeader(2)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                </div>
                <div className="space-y-0.5">
                  {navItems.filter(i => i.tier === 2 && matchesSearch(i, sidebarSearch)).map((item) => {
                    const isActive = logicalPath === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={langPath(item.path)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 font-extrabold shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="truncate">{lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER III COMPONENT */}
            {navItems.filter(i => i.tier === 3 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-1.5">
                <div className="px-2.5 text-[10px] font-mono leading-none tracking-wider text-gray-400 font-extrabold uppercase border-b border-gray-100 pb-1 flex items-center justify-between">
                  <span>{getLocalizedTierHeader(3)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="space-y-0.5">
                  {navItems.filter(i => i.tier === 3 && matchesSearch(i, sidebarSearch)).map((item) => {
                    const isActive = logicalPath === item.path;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={langPath(item.path)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 font-extrabold shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        style={{ minHeight: '44px' }}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="truncate">{lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn)}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER IV COMPONENT (RESOURCES & LIBRARY — grouped: Reading / Learning) */}
            {navItems.filter(i => i.tier === 4 && matchesSearch(i, sidebarSearch)).length > 0 && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div className="px-2.5 text-[10px] font-mono leading-none tracking-wider text-gray-400 font-extrabold uppercase pb-0.5 flex items-center justify-between">
                  <span>{lang === 'fr' ? 'RESSOURCES & BIBLIOTHÈQUE' : (lang === 'ar' ? 'المصادر والمكتبة' : 'RESOURCES & LIBRARY')}</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                </div>

                {([
                  { key: 'reading', en: 'Reading', fr: 'Lecture', ar: 'القراءة', dot: 'bg-indigo-500' },
                  { key: 'learning', en: 'Learning', fr: 'Apprentissage', ar: 'التعلّم', dot: 'bg-emerald-500' },
                ] as const).map((sub) => {
                  const groupItems = navItems.filter(i => i.tier === 4 && (i as any).group === sub.key && matchesSearch(i, sidebarSearch));
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={sub.key} className="space-y-1">
                      <div className="px-2.5 flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400">
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.dot}`} />
                        <span>{lang === 'fr' ? sub.fr : (lang === 'ar' ? sub.ar : sub.en)}</span>
                      </div>
                      <div className="space-y-0.5">
                        {groupItems.map((item) => {
                          const isActive = logicalPath === item.path;
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={langPath(item.path)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition-all relative ${
                                isActive
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-extrabold shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                              style={{ minHeight: '44px' }}
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                              <span className="truncate">{lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn)}</span>
                              {(item as any).badge && (
                                <span className={`absolute ${isRtl ? 'left-2' : 'right-2'} px-1.5 py-0.5 text-[8px] font-mono font-bold rounded-md border ${
                                  (item as any).badge === 'NEW'
                                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                                }`}>
                                  {(item as any).badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Zero results placeholder */}
            {navItems.filter(i => matchesSearch(i, sidebarSearch)).length === 0 && (
              <div className="py-8 px-2 text-center text-xs text-gray-400 font-semibold space-y-1.5 select-none">
                <AlertOctagon className="w-5 h-5 text-gray-300 mx-auto animate-pulse" />
                <p>{lang === 'fr' ? 'Aucun outil correspond' : (lang === 'ar' ? 'لا توجد أدوات مطابقة' : 'No tools found')}</p>
              </div>
            )}

          </nav>
        </div>
      </aside>}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 min-w-0 bg-[#fafafa]">
        <div className={`mx-auto px-4 sm:px-6 py-6 md:py-10 relative flex flex-col justify-between min-h-screen ${isContentPage ? 'max-w-6xl' : 'max-w-5xl'}`}>
          <div>

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
                <Route path="/ar">{moduleRoutes('ar', (p) => buildPath(p, 'ar'))}</Route>
                <Route path="*" element={<NotFound lang={lang} />} />
              </Routes>
            </React.Suspense>

            {/* Curator Recommendation flow: satisfies Step 12 (l2) of the core SEO guidelines */}
            {true && (
              <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-mono">
                    {lang === 'fr' ? 'Calculateurs Connexes Recommandés' : (lang === 'ar' ? 'أدوات حسابية متعلقة بالتشخيص' : 'Suggested Diagnostic Protocols')}
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
                              {lang === 'fr' ? item.nameFr : (lang === 'ar' ? item.nameAr : item.nameEn)}
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
                    : (lang === 'ar' 
                        ? 'تتبع حاسبة كير الطبية الشاملة أعلى معايير الجودة العلمية المعتمدة المستندة للأبحاث الطبية الموثقة والمنشورة في دوريات الطب والعناية المركزة.' 
                        : 'All emergency index calculators, body mass variables, and drug equivalence metrics are strictly reviewed and clinical protocol aligned according to peer-reviewed guides (AHA, ESC, CDC, SFAR).')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-teal-50 rounded-md text-[9px] font-extrabold text-teal-700 border border-teal-100 uppercase tracking-wider">E-E-A-T Certified</span>
                  <span className="px-2.5 py-0.5 bg-emerald-50 rounded-md text-[9px] font-extrabold text-emerald-600 border border-emerald-100 uppercase tracking-wider">PubMed Reference Linked</span>
                </div>
              </div>

              {/* Clinical Sources & Validation */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-gray-900 font-mono">
                  {lang === 'fr' ? 'SOURCES & VALIDATION CLINIQUE' : (lang === 'ar' ? 'المصادر والمراجع العلمية المعتمدة' : 'CLINICAL SOURCES & VALIDATION')}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'fr'
                    ? 'Chaque formule est tirée de la littérature médicale publiée (AHA, ESC, SFAR, HAS, NIH) et documentée avec ses références originales.'
                    : (lang === 'ar'
                        ? 'كل معادلة مستندة إلى الأدبيات الطبية المنشورة (AHA، ESC، NIH، SFAR) مع توثيق المرجع الأصلي لكل أداة.'
                        : 'Every formula is derived from published peer-reviewed literature (AHA, ESC, NIH, SFAR, CDC) with the original study or guideline cited for each tool.')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['AHA', 'ESC', 'NIH', 'SFAR', 'CDC', 'HAS', 'SRLF'].map(org => (
                    <span key={org} className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[9px] font-mono font-bold text-gray-600 uppercase">{org}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to={langPath('/about')} className="text-[11px] text-blue-600 hover:underline font-semibold">
                    {lang === 'fr' ? 'À propos de nous' : lang === 'ar' ? 'عن المنصة' : 'About CareCalculus'}
                  </Link>
                  <span className="text-gray-300">·</span>
                  <Link to={langPath('/disclaimer')} className="text-[11px] text-blue-600 hover:underline font-semibold">
                    {lang === 'fr' ? 'Avertissement médical' : lang === 'ar' ? 'إخلاء المسؤولية' : 'Medical Disclaimer'}
                  </Link>
                </div>
              </div>

              {/* Internal page links matrix to maximize internal PageRank distribution */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-[10px] uppercase tracking-widest text-gray-900 font-mono">
                  {lang === 'fr' ? 'MAILLAGE CLINIQUE STRATÉGIQUE' : (lang === 'ar' ? 'فهرس الربط الداخلي للمحركات' : 'INTERNAL CRAWLER MAP')}
                </h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {lang === 'fr' 
                    ? 'Parcourez instantanément nos différents calculateurs pour assurer une prise en charge optimale.' 
                    : (lang === 'ar' 
                        ? 'انقر للتنقل السريع بين بروتوكولات الفحص والتقييم السريري لتوفير الوقت.' 
                        : 'Navigate with zero friction between clinical tools to audit organ parameters and critical thresholds.')}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1 text-[10px] font-mono font-semibold">
                  {navItems.slice(0, 6).map(n => (
                    <Link key={n.path} to={langPath(n.path)} className="text-blue-650 hover:text-blue-800 hover:underline truncate">
                      ▸ {lang === 'fr' ? n.nameFr : (lang === 'ar' ? n.nameAr : n.nameEn)}
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
                  {lang === 'fr' ? 'À propos' : lang === 'ar' ? 'عن المنصة' : 'About'}
                </Link>
                <Link to={langPath('/disclaimer')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Avertissement' : lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
                </Link>
                <Link to={langPath('/privacy')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Confidentialité' : lang === 'ar' ? 'الخصوصية' : 'Privacy'}
                </Link>
                <Link to={langPath('/terms')} className="text-gray-400 hover:text-blue-600 transition-colors text-xs">
                  {lang === 'fr' ? 'Conditions' : lang === 'ar' ? 'الشروط' : 'Terms'}
                </Link>
              </div>
            </div>
          </footer>

        </div>
      </main>
      
      {/* Newsletter capture (appears after 2 page views) */}
      <NewsletterCapture lang={lang} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
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
        <StaticRouter location={url}>
          <AppLayout />
        </StaticRouter>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ErrorBoundary>
  );
}


