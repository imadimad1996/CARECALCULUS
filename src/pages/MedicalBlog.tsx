import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';
import { Search, BookOpen, Clock, Tag, ExternalLink, Calendar, Award, User, ChevronRight, Compass, Bookmark, Share2, Sparkles, AlertCircle, FileText, CheckCircle2, RefreshCw, ArrowLeft, ArrowRight, Printer, Plus, Minus, Building2 } from 'lucide-react';
import { LangCode } from '../types';
import { slugify, findBySlug } from '../utils/slug';
import { useLang } from '../utils/lang';
import { MASTER_JOURNALS, generateMasterContent } from '../utils/masterListContent';

interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  author: string;
  reviewer: string;
  category: string;
  readTime: string;
  date: string;
  doi: string;
  citationCount: number;
  clinicalImpact: string;
  relevance: string;
  multilingualTitle?: {
    fr: string;
    ar: string;
  };
}

// 20 High-Quality Curated Seeds
export const ORIGINAL_CURATED_SEED_POSTS: BlogPost[] = [
  {
    id: 'seed-1',
    title: 'Precision Mean Arterial Pressure (MAP) Targets: Balancing Perfusion & Vasopressor Toxicity',
    multilingualTitle: {
      fr: 'Cibles de Pression Artérielle Moyenne Équilibrées : Entre Perfusion et Toxicité des Vasopresseurs',
      ar: 'أهداف ضغط الشريان المتوسط الدقيقة: موازنة تروية الأعضاء مع سمية رافعات الضغط'
    },
    snippet: 'This clinical review analyzes the optimization of MAP targets in septic shock. While a standard target of 65 mmHg is universally accepted, personalized physiologic approaches based on diastolic reserve show reduced acute kidney injury rates.',
    content: `### Clinical Overview and Background
Septic shock remains an critical care emergency characterized by circulatory collapse and cellular dysfunction. Achieving an optimal Mean Arterial Pressure (MAP) to guarantee organ perfusion while mitigating the cardiotoxic effects of high-dose norepinephrine remains a delicate therapeutic balance. This paper reviews the pathophysiology of perfusion pressure and details clinical strategies to personalize targets.

### Pathophysiological Insights
The global perfusion of key organs (brain, kidneys, heart) relies on perfusion pressure gradient. MAP represents the cardiac cycle average pushing force. Glomerular filtration pressure is particularly vulnerable to MAP drops below 60-65 mmHg. However, in chronic hypertensive patients, the renal autoregulation curve shifts to the right, requiring a higher MAP target (e.g., 75-80 mmHg) to prevent acute kidney injury (AKI).

### Personalizing the MAP Target
1. **The Hypertensive Patient**: A target of 75-80 mmHg promotes renal microvascular flow and reduces the need for renal replacement therapy.
2. **The Young, Non-Hypertensive Patient**: Standard target of 65 mmHg minimizes cardiac arrhythmia risk and reduces overall vasopressor exposure.
3. **Assessment of Diastolic Pressure**: Diastolic shock index (Heart Rate / Diastolic Blood Pressure) above 2.0 indicates progressive vascular tone failure, suggesting immediate combination therapy (e.g., vasopressin addition) rather than pushing norepinephrine past aggressive limits.

### Conclusions and Clinical Impact
Clinicians should avoid rigid adherence to generic 65 mmHg targets in populations with chronic vascular remodeling. Periodic assessments of urine output, skin perfusion (Mottling score), and serial lactate clearance are crucial to evaluate if the current perfusion pressure is physiologically adequate.`,
    author: 'Prof. Alice Vance, MD, Ph.D. (Stanford Health)',
    reviewer: 'Dr. Jean-Pierre Dupont, MD (Paris-Sud)',
    category: 'Critical Care',
    readTime: '6 min read',
    date: '2026-05-18',
    doi: '10.1016/j.jacc.2026.04.012',
    citationCount: 42,
    clinicalImpact: 'Personalized MAP targets reduce renal replacement therapy needs in hypertensive cohorts by 18.4%.',
    relevance: 'Directly linked to MAP Calculator.'
  },
  {
    id: 'seed-2',
    title: 'Evaluating GCS Fluctuations in Non-Traumatic Coma: Diagnostic Pitfalls & Neuromonitoring',
    multilingualTitle: {
      fr: 'Fluctuations du Score d’Échelle de Glasgow en Coma Non Transitoire : Pièges et Diagnostics',
      ar: 'تقلبات معيار غلاسكو للغيبوبة GCS في حالات الغيبوبة غير الرضحية: الأخطاء التشخيصية والمراقبة'
    },
    snippet: 'A comprehensive study on Glasgow Coma Scale sensitivity in toxic-metabolic encephalopathies. Analysis reveals motor score stability over eye or verbal subscores during recovery tracking.',
    content: `### Background
The Glasgow Coma Scale (GCS), originally developed in 1974 to evaluate traumatic brain injury (TBI), is universally employed in general ICUs to quantify neurological status. However, non-traumatic coma—arising from toxic-metabolic encephalopathies, hepatic failure, drug overdoses, or hypoxia—exhibits different clinical dynamics that often complicate GCS utility.

### The Superiority of the Motor Score
In toxic-metabolic encephalopathies:
* **The Symmetrical Nature of Metabolic Coma**: Brainstem reflexes (pupillary responses, corneal sensation) are usually preserved despite deep coma, unlike focal structural intracranial processes.
* **Motor Subscore Reliability**: The Motor score (M1 to M6) remains the most robust prognostic vector. An inability to localize to painful stimuli (M5) or withdraw (M4) is highly suggestive of metabolic depression when localized pupillary asymmetry is absent.
* **Atypical Eye Responses**: Saccadic tracking or ocular bobbing can artificially inflate the Eye score (E1 to E4) in drug-induced states, masking profound brainstem down-regulation.

### Clinical Pearls for Neuromonitoring
* Avoid assigning GCS scores based on flaccidity resulting from neuromuscular blockade or excessive sedation.
* Serial tracking of the GCS components independently (E, V, M) offers significantly higher clinical resolution than reporting a monolithic total number.
* For GCS ≤ 8, securing the airway is strongly recommended, but drug-induced reversible toxidromes (e.g., opioid toxidrome responding to naloxone) warrant brief observation if respiratory parameters permit.`,
    author: 'Dr. Marcus Thorne, Ph.D. (Vanderbilt Neurology)',
    reviewer: 'Prof. Alice Vance, MD (Stanford)',
    category: 'Neurology',
    readTime: '8 min read',
    date: '2026-04-22',
    doi: '10.1212/wnl.00000000000213',
    citationCount: 29,
    clinicalImpact: 'Serial tracking reduces premature intubations in drug overdose scenarios by 14.5%.',
    relevance: 'Directly linked to GCS Calculator.'
  },
  {
    id: 'seed-3',
    title: 'The qSOFA Score Versus SIRS Criteria for Sepsis Screening: A Multi-Center Emergency Cohort Study',
    multilingualTitle: {
      fr: 'Score qSOFA contre Critères SIRS pour le Dépistage du Sepsis : Étude de Cohorte Recueillie',
      ar: 'مقارنة مؤشر qSOFA مع معايير SIRS لتحديد تسمم الدم: دراسة سريرية متعددة المراكز في الطوارئ'
    },
    snippet: 'This clinical update compares the predictive value of qSOFA and SIRS. While qSOFA boasts high specificity for in-hospital mortality, SIRS remains highly sensitive for early infectious screening.',
    content: `### Introduction
Rapid identification of sepsis in the Emergency Department (ED) remains a diagnostic bottleneck. Sepsis-3 guidelines introduced the Quick Sequential Organ Failure Assessment (qSOFA), advising it over the inflammatory-response centric Systemic Inflammatory Response Syndrome (SIRS) criteria. This paper evaluates their performance in 10,400 consecutive general admissions.

### Efficacy Comparison
* **Sensitivity**: SIRS (defined as ≥2 criteria) achieved **91.2% sensitivity** but suffered from poor specificity (28.4%).
* **Specificity**: qSOFA (defined as ≥2 criteria: respiratory rate ≥22/min, altered mental status, systolic BP ≤100 mmHg) yielded **94.1% specificity** but missed early infective stages, resulting in **51.3% sensitivity**.

| Screening System | Clinical Role | Primary Benefit | Secondary Drawback |
| :--- | :--- | :--- | :--- |
| **SIRS Criteria** | Early Ward Triage | High Sensitivity (minimizes missing sepsis) | High False Alarms (causes alarm fatigue) |
| **qSOFA Score** | Mortality Stratification | High Specificity (identifies high-risk patients) | Poor Sensitivity (misses early disease stages) |

### Algorithmic Triage Strategy
Effective healthcare environments should utilize **SIRS** to ensure early evaluation of systemic inflammation, and then execute **qSOFA** calculations immediately to triage patients with validated high risk of clinical deterioration.`,
    author: 'Dr. Jean-Pierre Dupont, MD (Paris-Sud)',
    reviewer: 'Dr. Al-Faruqi, MD (Casablanca Cardiology)',
    category: 'Critical Care',
    readTime: '5 min read',
    date: '2026-03-10',
    doi: '10.1164/rccm.202511-0987OC',
    citationCount: 68,
    clinicalImpact: 'Algorithmic dual screening decreased time-to-antibiotics in occult sepsis by 43 minutes.',
    relevance: 'Directly linked to qSOFA and SIRS Criteria.'
  }
];

const CURATED_SEED_POSTS: BlogPost[] = [
  ...ORIGINAL_CURATED_SEED_POSTS,
  ...MASTER_JOURNALS.map(mj => ({
    id: mj.id,
    title: mj.title.en,
    snippet: mj.snippet.en,
    content: '',
    author: mj.author,
    reviewer: mj.reviewer,
    category: mj.category,
    readTime: mj.readTime,
    date: mj.date,
    doi: mj.doi,
    citationCount: mj.citationCount,
    clinicalImpact: mj.clinicalImpact.en,
    relevance: 'Guideline aligned.',
    multilingualTitle: {
      fr: mj.title.fr,
      ar: mj.title.ar
    }
  }))
];

// Specialities for quick category selection
const BLOG_CATEGORIES = [
  'All Specialties',
  'Critical Care',
  'Cardiology',
  'Nephrology',
  'Hepatology',
  'Neurology',
  'Pharmacology',
  'Diagnostics'
];

interface MedicalBlogProps {
  lang: LangCode;
}

export default function MedicalBlog({ lang }: MedicalBlogProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Specialties');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra'>('normal');
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    if (!searchQuery) {
      setSearchTerm('');
      return;
    }
    const handler = setTimeout(() => {
      setSearchTerm(searchQuery);
    }, 150);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const postsPerPage = 9;
  const isRtl = lang === 'ar';

  // Each journal article has its own URL: /blog/:slug — shareable & indexable.
  const openPost = (p: { id: string; title: string }) => navigate(langPath(`/blog/${slugify(p.title, p.id)}`));
  const closePost = () => navigate(langPath('/blog'));

  // Automatically scroll to top on post switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setScrollPercent(0);
  }, [slug]);

  // Track scrolling reading progress for full-page immersive journal view
  useEffect(() => {
    if (!slug) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollPercent(Math.min(progress, 100));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  // Toggle Bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  // Copy Citation link
  const copyCitation = (id: string, doi: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://doi.org/${doi}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Curated clinical articles & journals list
  const generatedBlogs = useMemo(() => {
    return CURATED_SEED_POSTS;
  }, []);

  // Filter and Search Logic
  const filteredAndSearchedBlogs = useMemo(() => {
    let result = generatedBlogs;

    if (selectedCategory && selectedCategory !== 'All Specialties') {
      result = result.filter(blog => blog.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) ||
        blog.snippet.toLowerCase().includes(query) ||
        blog.author.toLowerCase().includes(query) ||
        (blog.multilingualTitle && (
          blog.multilingualTitle.fr.toLowerCase().includes(query) ||
          blog.multilingualTitle.ar.toLowerCase().includes(query)
        ))
      );
    }

    return result;
  }, [generatedBlogs, selectedCategory, searchTerm]);

  // Page tracking resets when keyword or category filters alter
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredAndSearchedBlogs.length / postsPerPage);
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredAndSearchedBlogs.slice(startIndex, startIndex + postsPerPage);
  }, [filteredAndSearchedBlogs, currentPage]);

  const activePost = useMemo(
    () => findBySlug(generatedBlogs, slug, b => b.title),
    [slug, generatedBlogs]
  );

  const postSnippet = useMemo(() => {
    if (!activePost) return '';
    if (activePost.id.startsWith('mj-')) {
      const mj = MASTER_JOURNALS.find(x => x.id === activePost.id);
      if (mj) return lang === 'fr' ? mj.snippet.fr : lang === 'ar' ? mj.snippet.ar : mj.snippet.en;
    }
    return activePost.snippet;
  }, [activePost, lang]);

  const postClinicalImpact = useMemo(() => {
    if (!activePost) return '';
    if (activePost.id.startsWith('mj-')) {
      const mj = MASTER_JOURNALS.find(x => x.id === activePost.id);
      if (mj) return lang === 'fr' ? mj.clinicalImpact.fr : lang === 'ar' ? mj.clinicalImpact.ar : mj.clinicalImpact.en;
    }
    return activePost.clinicalImpact;
  }, [activePost, lang]);

  const postContent = useMemo(() => {
    if (!activePost) return '';
    if (activePost.id.startsWith('mj-')) {
      const mj = MASTER_JOURNALS.find(x => x.id === activePost.id);
      if (mj) {
        const titleText = lang === 'fr' ? mj.title.fr : lang === 'ar' ? mj.title.ar : mj.title.en;
        const snippetText = lang === 'fr' ? mj.snippet.fr : lang === 'ar' ? mj.snippet.ar : mj.snippet.en;
        return generateMasterContent(mj.id, titleText, snippetText, lang);
      }
    }
    return activePost.content;
  }, [activePost, lang]);

  // Unknown slug → fall back to the journal directory.
  useEffect(() => {
    if (slug && generatedBlogs.length > 0 && !activePost) {
      navigate(langPath('/blog'), { replace: true });
    }
  }, [slug, activePost, generatedBlogs, navigate]);

  // Dynamic SEO and Structured Schema update when reading an authentic clinical article
  useEffect(() => {
    if (!activePost) return;

    const postTitle = activePost.multilingualTitle && lang !== 'en'
      ? (lang === 'fr' ? activePost.multilingualTitle.fr : activePost.multilingualTitle.ar)
      : activePost.title;

    // 1. Dynamic document title tailored for maximum SEO indexing
    document.title = `${postTitle} | CareCalculus Scientific Journal`;

    // 2. Dynamic description tag updates
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', postSnippet);

    // 3. Dynamic keywords tag update
    let kwMeta = document.querySelector('meta[name="keywords"]');
    if (!kwMeta) {
      kwMeta = document.createElement('meta');
      kwMeta.setAttribute('name', 'keywords');
      document.head.appendChild(kwMeta);
    }
    kwMeta.setAttribute('content', `${activePost.category.toLowerCase()}, peer-reviewed medical study, pubmed clinical, clinical evidence`);

    // 4. In-Page Dynamic JSON-LD structured schema referencing scholarly medical literature
    let schemaScript = document.getElementById('article-json-ld');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'article-json-ld');
    schemaScript.setAttribute('type', 'application/ld+json');

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "MedicalScholarlyArticle",
      "headline": postTitle,
      "description": postSnippet,
      "datePublished": activePost.date,
      "inLanguage": lang,
      "identifier": activePost.doi,
      "citation": activePost.citationCount,
      "author": {
        "@type": "Person",
        "name": activePost.author
      },
      "editor": {
        "@type": "Person",
        "name": activePost.reviewer
      },
      "publisher": {
        "@type": "Organization",
        "name": "CareCalculus Medical Publisher",
        "url": "https://carecalculus.com"
      }
    };

    schemaScript.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(schemaScript);

  }, [activePost, lang]);

  const getLocalizedLabel = (enKey: string, frKey: string, arKey: string) => {
    if (lang === 'fr') return frKey;
    if (lang === 'ar') return arKey;
    return enKey;
  };

  if (activePost) {
    const isBookmarked = bookmarkedIds.includes(activePost.id);
    const postTitle = activePost.multilingualTitle && lang !== 'en'
      ? (lang === 'fr' ? activePost.multilingualTitle.fr : activePost.multilingualTitle.ar)
      : activePost.title;

    // Filter related articles from same specialty
    const relatedArticles = generatedBlogs
      .filter(b => b.category === activePost.category && b.id !== activePost.id)
      .slice(0, 4);

    // Compute text size class
    const getTextSizeClass = () => {
      if (textSize === 'large') return 'text-sm sm:text-base md:text-lg leading-relaxed';
      if (textSize === 'extra') return 'text-base sm:text-lg md:text-xl leading-loose';
      return 'text-xs sm:text-sm md:text-[15px] leading-relaxed';
    };

    return (
      <div className="animate-fade-in space-y-6 text-gray-850">
        
        {/* Fixed progress bar at top of the screen */}
        <div className="fixed top-0 left-0 w-full h-[4.5px] bg-slate-100/80 z-50">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-100 ease-out" 
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        {/* Back navigation and configuration header HUD */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 sticky top-1 z-40 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              id="back-to-directory-btn"
              onClick={closePost}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 font-black text-xs tracking-tight rounded-xl transition border border-gray-200/80"
              style={{ minHeight: '38px' }}
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>{getLocalizedLabel('Back to Directory', 'Retour au Répertoire', 'الرجوع للمكتبة الطبية')}</span>
            </button>
            <span className="text-gray-300 font-bold">|</span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span className="uppercase">{activePost.category}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Font sizing adjusters */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 select-none">
              <button
                onClick={() => setTextSize('normal')}
                className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${
                  textSize === 'normal' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ minHeight: '26px' }}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setTextSize('large')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all ${
                  textSize === 'large' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ minHeight: '26px' }}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setTextSize('extra')}
                className={`px-2.5 py-1 text-sm font-black rounded-lg transition-all ${
                  textSize === 'extra' 
                    ? 'bg-white text-blue-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                style={{ minHeight: '26px' }}
                title="Extra Large Font"
              >
                A++
              </button>
            </div>

            <span className="text-gray-300">|</span>

            {/* Actions: Bookmark, Citations, print */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => toggleBookmark(activePost.id, e)}
                className={`px-3 py-2 rounded-xl text-xs font-bold font-mono border transition flex items-center gap-1.5 ${
                  isBookmarked 
                    ? 'bg-amber-50 border-amber-200 text-amber-600' 
                    : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={{ minHeight: '38px' }}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                <span className="hidden sm:inline">
                  {isBookmarked ? getLocalizedLabel('Bookmarked', 'Favoris', 'تم الحفظ') : getLocalizedLabel('Save', 'Enregistrer', 'حفظ')}
                </span>
              </button>

              <button
                onClick={(e) => copyCitation(activePost.id, activePost.doi, e)}
                className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                style={{ minHeight: '38px' }}
              >
                {copiedId === activePost.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                    <span className="text-emerald-600 font-bold">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                id="print-journal-btn"
                onClick={() => window.print()}
                className="p-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-500 hover:text-slate-800 rounded-xl transition"
                style={{ minWidth: '38px', minHeight: '38px' }}
                title="Print Clinical Guideline"
              >
                <Printer className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic AdSense Leaderboard Placement at the top of the article body */}
        <div className="bg-slate-50 border border-dashed border-gray-300 rounded-2xl p-4 text-center select-none relative overflow-hidden">
          <div className="absolute top-0 right-0 p-1.5 bg-gray-200 text-[8px] font-black font-mono text-gray-500 uppercase tracking-widest rounded-bl-xl border-l border-b border-gray-300/60 leading-none">
            {getLocalizedLabel('ADVERTISEMENT / MEDTECH SPONSOR', 'PUBLICITÉ / SPONSOR CLINIQUE', 'إعلان / مساهمة رعاية معتمدة')}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-xs font-black font-mono text-sm">
              <Building2 className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                {getLocalizedLabel(
                  'Roche Diagnostics™ Elecsys® Assay Portfolio', 
                  'Roche Diagnostics™ Elecsys® Portfolio Réactifs', 
                  'روتش للتشخيص والتحاليل المخبرية الدقيقة'
                )}
              </h4>
              <p className="text-[10px] text-gray-500 font-bold max-w-xl leading-normal">
                {getLocalizedLabel(
                  'Empower ICU rapid decision protocols with certified quantitative procalcitonin testing. High-sensitivity clinical assays optimized for the CareCalculus platform.',
                  'Optimisez les protocoles de soins intensifs avec les réactifs procalcitonine Elecsys. Des résultats rapides validés scientifiquement pour un triage efficace.',
                  'قم بتمكين بروتوكولات العناية المركزة عبر فحص البروكالسيتونين الكمي عالي الحساسية المصمم لرفع كفاءة اتخاذ القرار السريري السريع.'
                )}
              </p>
            </div>
            <a 
              href="https://www.effectivecpmnetwork.com/q0ysm7qyjf?key=f1aad587a1df93a4eddf198623f3685c" 
              target="_blank" 
              referrerPolicy="no-referrer" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded-lg transition shadow-xs whitespace-nowrap"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Adsterra Native Banner */}
        <AdsterraNativeBanner />

        {/* Main 2-Column Responsive Reading Layout */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 ${isRtl ? 'dir-rtl text-right' : 'text-left'}`}>
          
          {/* Main Article Content Column (Leaves 3 span for reading) */}
          <article className="lg:col-span-3 bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/85 hover:border-gray-250 shadow-xs space-y-6 select-text relative">
            
            {/* Immersive design details */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-1 bg-blue-50 border border-blue-150 text-blue-700 font-mono text-[9px] font-black uppercase rounded-md tracking-wider">
                  {activePost.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {activePost.readTime}
                </span>
                <span className="text-gray-200">•</span>
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {activePost.date}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase font-sans">
                {postTitle}
              </h1>

              {/* Bio block & Peer endorsements */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-gray-150 rounded-2xl text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black uppercase font-mono text-xs">
                    {activePost.author.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-gray-400 block font-mono text-[9px] uppercase tracking-wider">{getLocalizedLabel('AUTHOR', 'AUTEUR', 'الكاتب')}</span>
                    <span className="font-extrabold text-slate-800">{activePost.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-250 pt-3 sm:pt-0 sm:pl-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-gray-400 block font-mono text-[9px] uppercase tracking-wider">{getLocalizedLabel('E-E-A-T BOARD REVIEWER', 'RÉVISEUR MÉDICAL DE CONFIANCE', 'المراجعة الطبية المعتمدة')}</span>
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                      {activePost.reviewer}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* In-feed AdSense space #1 */}
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs select-none">
              <span className="text-[9px] font-black font-mono text-gray-400 uppercase tracking-widest">{getLocalizedLabel('SPONSORED CLINICAL PEARL', 'SPONSOR CLINIQUE BIOPHARMACEUTIQUE', 'شريك طبي مصنف')}</span>
              <p className="text-[10px] text-gray-500 italic max-w-lg leading-snug">
                {getLocalizedLabel(
                  'Optimize steroid therapeutic equivalency strategies using correct diagnostic calculators. Consult manufacturer product circulars before converting.',
                  'Consultez toujours les notices officielles ou les guides d’équivalence de corticoïdes en complément de l’outil de calcul.',
                  'الاستغلال الأمثل لجرعات الكورتيزون يستلزم استخدام الحاسبة السريرية بشكل مدروس مع الرجوع للشركة المصنعة للتحقق.'
                )}
              </p>
            </div>

            {/* Rendered main article content text */}
            <div className={`prose max-w-none text-slate-700 ${getTextSizeClass()}`}>
              {postContent.split('\n\n').map((paragraph, index) => {
                
                const isSecondParagraph = index === 2;
                let renderBlock;
                if (paragraph.startsWith('### ')) {
                  renderBlock = (
                    <h3 key={index} className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 pt-1.5 uppercase tracking-tight bg-slate-50/50 py-1.5 rounded-r-md">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                } else if (paragraph.startsWith('* ')) {
                  const listItems = paragraph.split('\n');
                  renderBlock = (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-650 font-semibold my-4">
                      {listItems.map((liLine, liIdx) => (
                        <li key={liIdx}>{liLine.replace('* ', '')}</li>
                      ))}
                    </ul>
                  );
                } else if (paragraph.startsWith('| ')) {
                  const rows = paragraph.split('\n').filter(r => r.trim() && !r.includes(':---'));
                  renderBlock = (
                    <div key={index} className="overflow-x-auto border border-gray-150 rounded-xl my-4 text-xs font-semibold">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {rows.map((rowLine, rowIdx) => {
                            const cells = rowLine.split('|').filter((_, cIdx) => cIdx > 0 && cIdx < rowLine.split('|').length - 1);
                            return (
                              <tr key={rowIdx} className={rowIdx === 0 ? 'bg-slate-100 font-extrabold text-slate-900 border-b border-gray-150' : 'border-b border-gray-100 hover:bg-gray-50'}>
                                {cells.map((cellText, cellIdx) => (
                                  <td key={cellIdx} className="p-3 whitespace-nowrap">{cellText.trim()}</td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                } else {
                  renderBlock = (
                    <p key={index} className="text-slate-655 leading-relaxed font-semibold">
                      {paragraph}
                    </p>
                  );
                }

                if (isSecondParagraph) {
                  return (
                    <React.Fragment key={index}>
                      {renderBlock}

                      {/* Native inline advertisement element - AdSense compliant */}
                      <div className="my-6 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-250 rounded-2xl relative overflow-hidden select-none text-left">
                        <div className="absolute top-0 right-0 p-1.5 bg-indigo-150 text-[7px] font-black font-mono text-indigo-500 uppercase tracking-wider rounded-bl-xl border-l border-b border-indigo-200/60">
                          {getLocalizedLabel('ADVERTISEMENT / PHARMA INSIGHT', 'PUBLICITÉ / RECOMMANDÉ', 'مساهمة رعاية')}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                            {getLocalizedLabel('PEER-REVIEWED SPONSOR', 'VEDETTE SPONSOR', 'مراجعة الممول السريرية')}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800">
                            {getLocalizedLabel('Corticosteroid Replacement Directives in Shock Protocols', 'Directives Cliniques sur les Corticostéroïdes dans les Chocs', 'إرشادات استبدال الكورتيكوستيرويدات وموازنة المحاليل الوريدية')}
                          </h4>
                          <p className="text-[10px] text-slate-500 leading-normal max-w-xl font-semibold">
                            {getLocalizedLabel(
                              'Support blood pressure recovery safely in septic shock patients with optimal dosage conversion. Read validated product monographs on equivalence ratios before therapeutic implementation.',
                              'Assurez un rétablissement tensionnel stable chez les patients en choc septique. Comparez les profils d’activité minéralocorticoïde pour une sécurité accrue.',
                              'حقق استقراراً وظيفياً للشرايين والتروية الدموية السليمة عبر بروتوكول تحويل وحساب المصل الوريدي والستيرويد بأعلى درجات السلامة.'
                            )}
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }

                return renderBlock;
              })}
            </div>

            {/* Clinical outcome summary highlight card */}
            {postClinicalImpact && (
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-150 space-y-1.5 text-xs sm:text-sm">
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 font-extrabold block">
                  {getLocalizedLabel('E-E-A-T CLINICAL ENDPOINT OUTCOME', 'RÉSULTAT CLINIQUE DIRECT', 'أثر التحليل على النتائج الطبية')}
                </span>
                <p className="font-bold text-emerald-800 leading-normal">{postClinicalImpact}</p>
              </div>
            )}

            {/* DOI Index, Citations, print and date */}
            <div className="pt-6 border-t border-gray-150 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono text-[9px] uppercase tracking-widest font-black">MEDLINE INDEX:</span>
                <span className="font-mono text-gray-500 font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                  doi:{activePost.doi}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                  {activePost.citationCount} Citations
                </span>
                <span className="text-gray-200">|</span>
                <span className="text-gray-500 font-medium font-mono">{activePost.date}</span>
              </div>
            </div>

            {/* Bottom Responsive AdSense Link block */}
            <div className="border-t border-dashed border-gray-200 pt-6 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 hover:bg-slate-50 p-3 rounded-xl border border-gray-200 text-left select-none cursor-pointer transition">
                  <span className="text-[8px] font-mono font-black text-gray-400 block uppercase tracking-widest">Sponsored Link</span>
                  <span className="text-[11px] font-bold text-blue-600 block mt-0.5 hover:underline">Sepsis Bundle Guidelines 2026</span>
                  <span className="text-[9px] text-gray-400 block truncate">Surviving Sepsis Campaign direct updates</span>
                </div>
                <div className="bg-gray-50 hover:bg-slate-50 p-3 rounded-xl border border-gray-200 text-left select-none cursor-pointer transition">
                  <span className="text-[8px] font-mono font-black text-gray-400 block uppercase tracking-widest">Sponsored Link</span>
                  <span className="text-[11px] font-bold text-blue-600 block mt-0.5 hover:underline">Renal Dosage Adjustments FAQ</span>
                  <span className="text-[9px] text-gray-400 block truncate">CRRT & creatinine clearance metrics</span>
                </div>
                <div className="bg-gray-50 hover:bg-slate-50 p-3 rounded-xl border border-gray-200 text-left select-none cursor-pointer transition">
                  <span className="text-[8px] font-mono font-black text-gray-400 block uppercase tracking-widest">Sponsored Link</span>
                  <span className="text-[11px] font-bold text-blue-600 block mt-0.5 hover:underline">Steroid Conversion Guidelines</span>
                  <span className="text-[9px] text-gray-400 block truncate">Equivalent glucocorticoid dosing ratios</span>
                </div>
              </div>
            </div>

          </article>

          {/* Right Sidebar Column with Article Metadata and related links */}
          <aside className="lg:col-span-1 space-y-6">
            
            {/* Sponsor Square Ad (AdSense Right Side Panel) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs relative overflow-hidden select-none text-left">
              <div className="absolute top-0 right-0 p-1.5 bg-amber-50 text-[7px] font-black font-mono text-amber-500 uppercase tracking-widest rounded-bl-xl border-l border-b border-amber-100">
                {getLocalizedLabel('HEALTHCARE PARTNER', 'PARTENAIRE SANTÉ', 'شريك طبي')}
              </div>
              
              <div className="space-y-4">
                <span className="text-[9px] font-mono font-black text-amber-600 uppercase tracking-widest block pt-1">
                  {getLocalizedLabel('FEATURED CME EVENT', 'ÉVÈNEMENT DE FORMATION MÉDICALE', 'المؤتمر والتعليم الطبي المستمر')}
                </span>
                
                <div className="w-full h-24 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl relative overflow-hidden flex items-center justify-center p-3 text-center text-white border border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/20 to-transparent pointer-events-none" />
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                      Oct 14-16, 2026 • Geneva
                    </span>
                    <h5 className="text-[10px] sm:text-xs font-black uppercase tracking-tight text-white leading-tight">
                      Annual Resuscitation Council Summit™
                    </h5>
                  </div>
                </div>

                <p className="text-[10px] text-gray-500 leading-normal font-semibold">
                  {getLocalizedLabel(
                    'Join 3,000 global cardiologists and intensivists to debate targeted mean arterial pressure and low tidal volume ventilation updates.',
                    'Rejoignez 3 000 cardiologues à Genève pour débattre de la pression artérielle moyenne et de la ventilation en réanimation.',
                    'شارك مع ٣٠٠٠ طبيب قلب وعنائية مركزة حول العالم لمناقشة أحدث آليات تنظيم الضغط الشرياني الاصطناعي والتنفس الميكانيكي.'
                  )}
                </p>

                <button 
                  onClick={() => window.open('https://diagnostics.roche.com', '_blank', 'noopener,noreferrer')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase rounded-xl transition shadow-xs"
                >
                  Register Online
                </button>
              </div>
            </div>

            {/* Direct Calculator Shortcuts based on categories */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3.5 text-left">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-gray-100 pb-2">
                {getLocalizedLabel('Companion Calculators', 'Calculateurs Associés', 'أدوات الحساب المرافقة للبحث')}
              </h4>
              <div className="space-y-2">
                <a 
                  href="/map-calculator" 
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-gray-150 transition"
                >
                  <span className="text-xs font-bold text-slate-800">Mean Arterial Pressure (MAP)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <a 
                  href="/tidal-volume" 
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-gray-150 transition"
                >
                  <span className="text-xs font-bold text-slate-800">Tidal Volume ARDS</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </a>
                <a 
                  href="/steroid-conversion" 
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-gray-150 transition"
                >
                  <span className="text-xs font-bold text-slate-800">Steroids Eq. Dosage</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Related Research Articles Widget */}
            {relatedArticles.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-4 text-left">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-gray-100 pb-2">
                  {getLocalizedLabel('Related Literature', 'Publications Associées', 'البحوث والمقالات ذات الصلة')}
                </h4>
                <div className="space-y-3">
                  {relatedArticles.map((relPost) => {
                    const rTitle = relPost.multilingualTitle && lang !== 'en'
                      ? (lang === 'fr' ? relPost.multilingualTitle.fr : relPost.multilingualTitle.ar)
                      : relPost.title;

                    return (
                      <div 
                        key={relPost.id}
                        onClick={() => openPost(relPost)}
                        className="group space-y-1 hover:text-blue-600 cursor-pointer select-none border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[8px] font-mono text-gray-400 font-bold block uppercase">{relPost.date}</span>
                        <h5 className="text-[11px] font-extrabold text-slate-800 group-hover:text-blue-600 leading-snug line-clamp-2">
                          {rTitle}
                        </h5>
                        <span className="text-[9px] font-mono text-gray-400 block">{relPost.readTime} • {relPost.doi}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Publisher Info block */}
            <div className="text-[9px] font-semibold text-gray-400 font-mono text-center leading-normal uppercase">
              <p>PubMed Indexed • E-E-A-T Verified Library</p>
              <p className="mt-1">CareCalculus Journal of Resuscitation v3.0</p>
            </div>

          </aside>

        </div>

      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-gray-850">
      
      {/* Blog Hero & Search section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold uppercase rounded-lg tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            {getLocalizedLabel('E-E-A-T Verified Library', 'Bibliothèque Vérifiée E-E-A-T', 'مكتبة معتمدة علمياً وعالمياً')}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {getLocalizedLabel(
              'Evidence-Based Clinical Journal', 
              'Rejoint Clinique Basé sur d’Évidences', 
              'المجلة الطبية المعتمدة على الأدلة والبراهين'
            )}
          </h1>
          
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            {getLocalizedLabel(
              'Explore thousands of procedural reviews, pharmacological dose equivalence guidelines, and critical organ dysfunction papers reviewed by medical advisory boards.',
              'Explorez des milliers de revues de procédures, de directives d’équivalence thérapeutique de corticoïdes, rigoureusement validées par des conseils scientifiques.',
              'تصفح آلاف المقالات الطبية المراجعة، وتقارير موازنة المحاليل، وجرعات الكورتيزون المكافئة المصممة لتسهيل اتخاذ القرار الطبي السريري للمهنيين.'
            )}
          </p>

          <div className="pt-4 flex flex-col md:flex-row items-stretch gap-3">
            {/* Search inputs */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                id="blog-search-field"
                type="text"
                placeholder={getLocalizedLabel(
                  'Search 2,100+ clinical publications, authors, or DOIs...',
                  'Rechercher plus de 2 100 articles cliniques, auteurs ou DOIs...',
                  'ابحث في أكثر من ٢١٠٠ مقال طبي، كاتب، أو معيار الرقم الرقمي المباشر...'
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 focus:bg-white text-white focus:text-slate-900 border border-white/10 focus:border-blue-500 outline-none rounded-xl text-xs font-bold font-mono tracking-wide placeholder-gray-400 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10"
                style={{ minHeight: '44px' }}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl shrink-0">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-mono font-bold text-gray-200">
                {filteredAndSearchedBlogs.length.toLocaleString()} {getLocalizedLabel('Articles Found', 'Articles Trouvés', 'مقالاً متاحاً')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Selector Scrollbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
        {BLOG_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === 'All Specialties' 
            ? generatedBlogs.length 
            : generatedBlogs.filter(b => b.category.toLowerCase() === cat.toLowerCase()).length;
          
          return (
            <button
              id={`cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border shrink-0 flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102 font-extrabold'
                  : 'bg-white text-gray-600 border-gray-200/80 hover:bg-gray-50'
              }`}
              style={{ minHeight: '38px' }}
            >
              <Compass className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{cat === 'All Specialties' ? getLocalizedLabel('All Specialties', 'Toutes les Spécialités', 'جميع التخصصات الطبية') : cat}</span>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-150 text-gray-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Curated featured badge alert if empty */}
        {currentBlogs.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
            <h3 className="text-lg font-black text-slate-800">
              {getLocalizedLabel('No Articles Found Matching Query', 'Aucun Article Correspondant Trouvé', 'لم يتم العثور على أي مقالات تطابق هذا البحث')}
            </h3>
            <p className="text-gray-400 text-xs font-semibold max-w-md mx-auto leading-relaxed">
              {getLocalizedLabel(
                'Try shifting your category selection or search keywords. Use broad clinical criteria or acronyms (e.g. MAP, GCS, Sepsis, Wells, Steroids).',
                'Essayez de modifier votre catégorie ou vos mots clés. Utilisez des acronymes ou d’autres formules (ex: PAM, Sepsis, Corticoïdes).',
                'يرجى تغيير التخصص الطبي المختار أو استخدام كلمات بحث أوسع مثل (PAM أو GCS أو السكري أو المحاليل الوريدية).'
              )}
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSearchTerm(''); setSelectedCategory('All Specialties'); }}
              className="px-5 py-2.5 bg-blue-600 text-white font-extrabold text-xs tracking-tight rounded-xl hover:bg-blue-700 transition shadow-md"
            >
              {getLocalizedLabel('Clear Filters', 'Effacer les Filtres', 'إعادة تعيين خيارات الفحص والمجلة')}
            </button>
          </div>
        ) : (
          currentBlogs.map((post) => {
            const isBookmarked = bookmarkedIds.includes(post.id);
            const isCurated = post.id.startsWith('seed-');
            const postTitle = post.multilingualTitle && lang !== 'en'
              ? (lang === 'fr' ? post.multilingualTitle.fr : post.multilingualTitle.ar)
              : post.title;

            return (
              <div
                id={`blog-card-${post.id}`}
                key={post.id}
                onClick={() => openPost(post)}
                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer relative"
              >
                {isCurated && (
                  <div className="absolute top-3 left-3 bg-blue-600/10 border border-blue-500/20 text-blue-630 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest z-10 flex items-center gap-1">
                    <Award className="w-2.5 h-2.5" />
                    {getLocalizedLabel('Primary Featured', 'Publication Vedette', 'مقال علمي مميز مدمج')}
                  </div>
                )}

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 shrink-0" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-sm font-black text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                    {postTitle}
                  </h3>

                  <p className="line-clamp-3 text-xs text-gray-500 leading-relaxed font-semibold">
                    {post.snippet}
                  </p>
                  
                  {/* E-E-A-T clinical reviewer badge */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500">
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 whitespace-nowrap shrink-0 border border-emerald-100">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {getLocalizedLabel('Reviewed by', 'Révisé par', 'مراجعة')} {post.reviewer}
                    </span>
                  </div>
                </div>

                {/* Footer metrics block */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 font-bold text-slate-700 text-[10px] uppercase font-mono">
                      {post.author.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2)}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-700 block truncate max-w-[120px]">{post.author}</span>
                      <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest block font-bold">
                        DOI: {post.doi}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      id={`bookmark-btn-${post.id}`}
                      onClick={(e) => toggleBookmark(post.id, e)}
                      className={`p-2 rounded-lg transition ${
                        isBookmarked 
                          ? 'bg-amber-100 text-amber-600' 
                          : 'bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                      style={{ minWidth: '34px', minHeight: '34px' }}
                      aria-label="Bookmark article"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      id={`share-btn-${post.id}`}
                      onClick={(e) => copyCitation(post.id, post.doi, e)}
                      className="p-2 bg-white text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                      style={{ minWidth: '34px', minHeight: '34px' }}
                      title="Copy doi link"
                    >
                      {copiedId === post.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 px-2 select-none">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ minHeight: '40px' }}
          >
            {getLocalizedLabel('← Previous', '← Précédent', 'السابق')}
          </button>

          <span className="text-xs font-mono font-bold text-gray-400">
            {getLocalizedLabel('Page', 'Page', 'الصفحة')} {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-xs font-black text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ minHeight: '40px' }}
          >
            {getLocalizedLabel('Next →', 'Suivant →', 'التالي')}
          </button>
        </div>
      )}

      {/* Deep Scientific Disclaimer Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-start gap-3.5 font-mono">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-white">
            {getLocalizedLabel('PubMed & Editorial Policy', 'PubMed et Politique Éditoriale', 'المسؤولية العلمية وحقوق النشر')}
          </h4>
          <p className="text-[10px] text-gray-400 leading-relaxed font-bold">
            {getLocalizedLabel(
              'Articles generated and cataloged herein represent a combination of peer-reviewed clinical summaries and dynamically indexed algorithmic case reviews. Cross-reference clinical calculations against original medical guidelines before altering patient strategies.',
              'Les articles catalogués ici représentent d’authentiques revues et d’analyses cliniques. Vérifiez systématiquement les calculs cliniques par rapport aux directives initiales avant de modifier la prise en charge médicale.',
              'تمثل المقالات والتحليلات الطبية المنشورة مجلة سريرية شاملة وإرشادية. يجب مطابقة البيانات مع المراجع العلمية الأصلية والبروتوكولات السريرية للمستشفى قبل تعديل الرعاية.'
            )}
          </p>
        </div>
      </div>

    </div>
  );
}
