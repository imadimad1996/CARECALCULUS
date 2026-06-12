import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Newspaper, Clock, Calendar, ChevronRight, Sparkles, ArrowLeft, Share2, CheckCircle2, Bookmark, Tag, User, Lightbulb, TrendingUp, Megaphone } from 'lucide-react';
import { LangCode } from '../types';
import { slugify, findBySlug } from '../utils/slug';

interface BlogArticle {
  id: string;
  title: string;
  titleFr: string;
  titleAr: string;
  snippet: string;
  snippetFr: string;
  snippetAr: string;
  content: string;
  author: string;
  category: 'Clinical Tips' | 'News & Updates' | 'Editorial' | 'Practice' | 'Technology';
  readTime: number;
  date: string;
}

// Editorial blog seeds — lighter, practical companion to the formal Clinical Journal.
const BLOG_SEED: BlogArticle[] = [
  {
    id: 'post-1',
    title: '5 Bedside Pearls for Faster MAP-Guided Resuscitation',
    titleFr: '5 Astuces de Chevet pour une Réanimation Guidée par la PAM',
    titleAr: '٥ نصائح سريرية لإنعاش أسرع موجّه بضغط الشريان المتوسط',
    snippet: 'Practical, no-nonsense bedside habits that help you reach perfusion targets faster without over-titrating vasopressors.',
    snippetFr: 'Des habitudes de chevet pratiques pour atteindre plus vite les cibles de perfusion sans surdoser les vasopresseurs.',
    snippetAr: 'عادات عملية بجانب السرير تساعدك على الوصول لأهداف التروية بسرعة دون الإفراط في رافعات الضغط.',
    content: `### Why MAP, not just systolic
Mean Arterial Pressure reflects organ perfusion far better than a single systolic reading. Anchor your bedside thinking on MAP from the first minute.

### The 5 pearls
1. **Re-zero the transducer** at the phlebostatic axis before trusting any number.
2. **Watch the diastolic** — a collapsing diastolic pressure signals failing vascular tone earlier than the MAP itself.
3. **Mottling beats the monitor** — a rising mottling score over the knee is an honest, free perfusion marker.
4. **Lactate clearance over absolute lactate** — trend it every 2 hours, don't fixate on a single value.
5. **Personalize the target** — chronic hypertensives often need 75–80 mmHg, not the reflex 65.

### Bottom line
Pair these habits with the MAP Calculator to keep your titration tight and your kidneys happy.`,
    author: 'CareCalculus Editorial Team',
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-06-05'
  },
  {
    id: 'post-2',
    title: 'What the 2026 Sepsis Bundle Updates Mean for Your Triage',
    titleFr: 'Ce que les Mises à Jour 2026 du Bundle Sepsis Changent pour Votre Triage',
    titleAr: 'ماذا تعني تحديثات حزمة الإنتان لعام ٢٠٢٦ لفرز مرضاك',
    snippet: 'A plain-language rundown of the refreshed surviving-sepsis guidance and how qSOFA and SIRS now fit together at the door.',
    snippetFr: 'Un résumé clair des nouvelles recommandations sepsis et de la place de qSOFA et SIRS à l’accueil.',
    snippetAr: 'ملخص مبسّط لأحدث إرشادات الإنتان وكيفية دمج مؤشري qSOFA وSIRS عند الاستقبال.',
    content: `### The short version
Screen broad, escalate specific. SIRS still catches early inflammation; qSOFA still flags who is about to deteriorate.

### What changed
* Time-to-antibiotic targets are tighter in confirmed shock.
* Lactate-guided resuscitation is reinforced as a first-hour priority.
* Dual screening (SIRS then qSOFA) is explicitly encouraged to cut alarm fatigue.

### Putting it into practice
Run SIRS at intake, then immediately compute qSOFA on anyone flagged. Both calculators are one tap away in the sidebar.`,
    author: 'Dr. Jean-Pierre Dupont, MD',
    category: 'News & Updates',
    readTime: 5,
    date: '2026-05-28'
  },
  {
    id: 'post-3',
    title: 'Stop Guessing Steroid Equivalents: A Conversion Mindset',
    titleFr: 'Arrêtez de Deviner les Équivalences de Corticoïdes : Une Approche Méthodique',
    titleAr: 'توقف عن تخمين مكافئات الستيرويد: عقلية التحويل الصحيحة',
    snippet: 'A mental model for swapping corticosteroids safely, plus the traps that catch even experienced prescribers.',
    snippetFr: 'Un modèle mental pour changer de corticoïde en sécurité, et les pièges qui surprennent même les experts.',
    snippetAr: 'نموذج ذهني لتبديل الكورتيكوستيرويدات بأمان، مع الأخطاء التي تخدع حتى الخبراء.',
    content: `### Think in potency, not milligrams
Doses only mean something relative to potency. Always convert through a common reference (hydrocortisone equivalents) before deciding.

### The common traps
* Forgetting the **mineralocorticoid** activity when switching off hydrocortisone.
* Ignoring the **half-life** difference — dexamethasone lingers far longer than prednisone.
* Abrupt swaps without tapering, risking adrenal insufficiency.

### Safer workflow
Use the Steroids Equivalence tool to anchor the conversion, then adjust for the clinical context rather than the other way around.`,
    author: 'CareCalculus Editorial Team',
    category: 'Practice',
    readTime: 4,
    date: '2026-05-15'
  },
  {
    id: 'post-4',
    title: 'Calculators at the Bedside: Friend, Not Crutch',
    titleFr: 'Les Calculateurs au Chevet : Un Allié, Pas une Béquille',
    titleAr: 'الحاسبات بجانب السرير: أداة مساعدة لا عكاز',
    snippet: 'An editorial on keeping clinical judgment in the driver’s seat while letting digital tools handle the arithmetic.',
    snippetFr: 'Un éditorial sur l’importance de garder le jugement clinique aux commandes en déléguant le calcul aux outils.',
    snippetAr: 'مقال رأي حول إبقاء الحكم السريري في المقدمة مع ترك الحسابات للأدوات الرقمية.',
    content: `### A confession
Every fast clinician leans on tools. The danger is not using a calculator — it is forgetting to sanity-check what it returns.

### Three habits worth keeping
1. **Predict before you compute.** Guess the answer, then verify. Big mismatches are a gift.
2. **Know the formula’s assumptions.** Cockcroft-Gault and BMI both lie in specific body habitus.
3. **Document the reasoning,** not just the number.

### Closing thought
Tools should compress the boring arithmetic so your attention stays on the patient in front of you.`,
    author: 'CareCalculus Editorial Team',
    category: 'Editorial',
    readTime: 3,
    date: '2026-05-02'
  },
  {
    id: 'post-5',
    title: 'Reading a Tidal Volume Order Like a Lung-Protective Pro',
    titleFr: 'Lire une Prescription de Volume Courant comme un Pro de la Ventilation Protectrice',
    titleAr: 'قراءة أمر حجم المد التنفسي باحترافية الحماية الرئوية',
    snippet: 'How to translate an ARDSNet tidal volume order into the bedside checks that actually protect the lung.',
    snippetFr: 'Comment traduire une prescription de volume courant ARDSNet en vérifications de chevet protectrices.',
    snippetAr: 'كيف تترجم أمر حجم المد التنفسي وفق ARDSNet إلى فحوصات سريرية تحمي الرئة فعلاً.',
    content: `### Start from predicted body weight
Lung-protective volumes scale to predicted body weight, never actual weight. Height and sex drive the math.

### The bedside checklist
* Target **6 mL/kg** PBW, accept 4–8 based on plateau pressure.
* Keep plateau pressure **under 30 cmH₂O**.
* Tolerate permissive hypercapnia within pH limits.

### Make it automatic
The Tidal Volume tool turns height into a target in seconds — then your eyes go back to the plateau pressure and the patient.`,
    author: 'Prof. Alice Vance, MD, Ph.D.',
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-04-19'
  },
  {
    id: 'post-6',
    title: 'Behind the Build: How We Localize Every Calculator into 3 Languages',
    titleFr: 'Dans les Coulisses : Comment Nous Localisons Chaque Calculateur en 3 Langues',
    titleAr: 'خلف الكواليس: كيف نترجم كل حاسبة إلى ثلاث لغات',
    snippet: 'A short technology note on the multilingual, RTL-aware design that powers CareCalculus across English, French, and Arabic.',
    snippetFr: 'Une note technique sur la conception multilingue et RTL qui anime CareCalculus en anglais, français et arabe.',
    snippetAr: 'ملاحظة تقنية موجزة حول التصميم متعدد اللغات الداعم للكتابة من اليمين لليسار في كير كالكولوس.',
    content: `### Why three languages
Clinical decisions happen in many tongues. Supporting English, French, and Arabic — including right-to-left layout — widens safe access.

### What it takes
* Every label carries three strings, not one.
* Layout flips direction for Arabic without breaking the math.
* Region detection presets metric vs imperial units.

### The payoff
A clinician in Casablanca, Paris, or Chicago sees the same trustworthy tool in their own language.`,
    author: 'CareCalculus Engineering',
    category: 'Technology',
    readTime: 3,
    date: '2026-04-04'
  }
];

// Full static class strings per category — Tailwind v4 purges interpolated names,
// so these must be written out literally to survive the build.
const CATEGORY_META: Record<BlogArticle['category'], { icon: any; chip: string }> = {
  'Clinical Tips': { icon: Lightbulb, chip: 'bg-amber-50 border-amber-150 text-amber-700' },
  'News & Updates': { icon: Megaphone, chip: 'bg-blue-50 border-blue-150 text-blue-700' },
  'Editorial': { icon: Newspaper, chip: 'bg-indigo-50 border-indigo-150 text-indigo-700' },
  'Practice': { icon: CheckCircle2, chip: 'bg-emerald-50 border-emerald-150 text-emerald-700' },
  'Technology': { icon: TrendingUp, chip: 'bg-slate-100 border-slate-200 text-slate-700' }
};

interface BlogProps {
  lang: LangCode;
}

export default function Blog({ lang }: BlogProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogArticle['category']>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const isRtl = lang === 'ar';

  // Each article has its own URL: /blog-articles/:slug. Selection is driven by
  // the route param so posts are shareable, bookmarkable, and indexable.
  const openPost = (a: BlogArticle) => navigate(`/blog-articles/${slugify(a.title, a.id)}`);
  const closePost = () => navigate('/blog-articles');

  const t = (en: string, fr: string, ar: string) => (lang === 'fr' ? fr : lang === 'ar' ? ar : en);

  const localizedTitle = (a: BlogArticle) => (lang === 'fr' ? a.titleFr : lang === 'ar' ? a.titleAr : a.title);
  const localizedSnippet = (a: BlogArticle) => (lang === 'fr' ? a.snippetFr : lang === 'ar' ? a.snippetAr : a.snippet);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [slug]);

  const categories: Array<'All' | BlogArticle['category']> = [
    'All', 'Clinical Tips', 'News & Updates', 'Editorial', 'Practice', 'Technology'
  ];

  const localizedCategory = (c: 'All' | BlogArticle['category']) => {
    const map: Record<string, [string, string, string]> = {
      'All': ['All Posts', 'Tous les Articles', 'كل المقالات'],
      'Clinical Tips': ['Clinical Tips', 'Astuces Cliniques', 'نصائح سريرية'],
      'News & Updates': ['News & Updates', 'Actualités', 'أخبار وتحديثات'],
      'Editorial': ['Editorial', 'Éditorial', 'افتتاحية'],
      'Practice': ['Practice', 'Pratique', 'الممارسة'],
      'Technology': ['Technology', 'Technologie', 'تقنية']
    };
    const [en, fr, ar] = map[c];
    return t(en, fr, ar);
  };

  const filtered = useMemo(() => {
    let result = BLOG_SEED;
    if (selectedCategory !== 'All') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.titleFr.toLowerCase().includes(q) ||
        a.titleAr.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.snippet.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, searchTerm]);

  const activePost = useMemo(
    () => findBySlug(BLOG_SEED, slug, a => a.title),
    [slug]
  );

  // Unknown slug → fall back to the directory so deep links never dead-end.
  useEffect(() => {
    if (slug && !activePost) navigate('/blog-articles', { replace: true });
  }, [slug, activePost, navigate]);

  // Dynamic SEO for an open article
  useEffect(() => {
    if (!activePost) return;
    document.title = `${localizedTitle(activePost)} | CareCalculus Blog`;
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', localizedSnippet(activePost));
  }, [activePost, lang]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const sharePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // ---- Full article reader view ----
  if (activePost) {
    const meta = CATEGORY_META[activePost.category];
    const Icon = meta.icon;
    const related = BLOG_SEED.filter(a => a.category === activePost.category && a.id !== activePost.id).slice(0, 3);

    return (
      <div className={`animate-fade-in space-y-6 text-gray-850 ${isRtl ? 'text-right' : 'text-left'}`}>
        {/* Header HUD */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <button
            onClick={closePost}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 font-black text-xs tracking-tight rounded-xl transition border border-gray-200/80"
            style={{ minHeight: '38px' }}
          >
            <ArrowLeft className={`w-4 h-4 shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
            <span>{t('Back to Blog', 'Retour au Blog', 'الرجوع للمدونة')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => toggleBookmark(activePost.id, e)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                bookmarkedIds.includes(activePost.id)
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ minHeight: '38px' }}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(activePost.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span className="hidden sm:inline">
                {bookmarkedIds.includes(activePost.id) ? t('Saved', 'Enregistré', 'محفوظ') : t('Save', 'Enregistrer', 'حفظ')}
              </span>
            </button>
            <button
              onClick={sharePost}
              className="px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              style={{ minHeight: '38px' }}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">{t('Copied', 'Copié', 'تم النسخ')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('Share', 'Partager', 'مشاركة')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Article body */}
        <article className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-200/85 shadow-xs space-y-6 select-text">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[9px] font-black uppercase rounded-md tracking-wider ${meta.chip}`}>
                <Icon className="w-3 h-3" />
                {localizedCategory(activePost.category)}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {activePost.readTime} {t('min read', 'min de lecture', 'دقيقة قراءة')}
              </span>
              <span className="text-gray-200">•</span>
              <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {activePost.date}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {localizedTitle(activePost)}
            </h1>

            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-black uppercase font-mono">
                {activePost.author.replace('Dr. ', '').replace('Prof. ', '').slice(0, 2)}
              </div>
              <div>
                <span className="text-gray-400 block font-mono text-[9px] uppercase tracking-wider">{t('AUTHOR', 'AUTEUR', 'الكاتب')}</span>
                <span className="font-extrabold text-slate-800 flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" />
                  {activePost.author}
                </span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-slate-700 text-xs sm:text-sm md:text-[15px] leading-relaxed">
            {activePost.content.split('\n\n').map((block, i) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={i} className="text-sm font-black text-slate-900 border-l-4 border-blue-600 pl-3 py-1.5 uppercase tracking-tight bg-slate-50/50 rounded-r-md mt-4">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('* ') || /^\d+\.\s/.test(block)) {
                const items = block.split('\n');
                const ordered = /^\d+\.\s/.test(block);
                const List = ordered ? 'ol' : 'ul';
                return (
                  <List key={i} className={`${ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 text-xs sm:text-sm text-gray-650 font-semibold my-4`}>
                    {items.map((li, idx) => (
                      <li key={idx}>{li.replace(/^\*\s/, '').replace(/^\d+\.\s/, '')}</li>
                    ))}
                  </List>
                );
              }
              return (
                <p key={i} className="text-slate-655 leading-relaxed font-semibold my-3">
                  {block}
                </p>
              );
            })}
          </div>
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-gray-100 pb-2">
              {t('More in this category', 'Plus dans cette catégorie', 'المزيد في هذه الفئة')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {related.map(r => (
                <button
                  key={r.id}
                  onClick={() => openPost(r)}
                  className="text-left p-4 border border-gray-150 rounded-2xl hover:border-blue-300 hover:bg-blue-50/20 transition group"
                  style={{ minHeight: '44px' }}
                >
                  <span className="text-[8px] font-mono text-gray-400 font-bold block uppercase">{r.date}</span>
                  <h5 className="text-[11px] font-extrabold text-slate-800 group-hover:text-blue-600 leading-snug line-clamp-2 mt-1">
                    {localizedTitle(r)}
                  </h5>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---- Directory / listing view ----
  return (
    <div className={`space-y-8 animate-fade-in text-gray-850 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[10px] font-bold uppercase rounded-lg tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            {t('CareCalculus Blog', 'Le Blog CareCalculus', 'مدونة كير كالكولوس')}
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {t(
              'Clinical Insights, Tips & News',
              'Conseils Cliniques, Astuces & Actualités',
              'رؤى وأخبار ونصائح سريرية'
            )}
          </h1>

          <p className="text-gray-300 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            {t(
              'Short, practical reads alongside our peer-reviewed Medical Journal — bedside pearls, guideline updates, and editorials to sharpen everyday clinical decisions.',
              'Des lectures courtes et pratiques en complément de notre Journal Médical révisé par les pairs — astuces de chevet, mises à jour de recommandations et éditoriaux.',
              'مقالات قصيرة وعملية إلى جانب مجلتنا الطبية المحكّمة — نصائح سريرية وتحديثات إرشادية ومقالات رأي تشحذ قراراتك اليومية.'
            )}
          </p>

          <div className="pt-4 flex flex-col md:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
              <input
                id="blog-articles-search"
                type="text"
                placeholder={t(
                  'Search posts, authors, topics...',
                  'Rechercher articles, auteurs, sujets...',
                  'ابحث في المقالات والكتّاب والمواضيع...'
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-3 bg-white/10 focus:bg-white text-white focus:text-slate-900 border border-white/10 focus:border-blue-500 outline-none rounded-xl text-xs font-bold font-mono tracking-wide placeholder-gray-400 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/10 ${
                  isRtl ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
                }`}
                style={{ minHeight: '44px' }}
              />
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl shrink-0">
              <Newspaper className="w-4 h-4 text-blue-300" />
              <span className="text-[11px] font-mono font-bold text-gray-200">
                {filtered.length} {t('Posts', 'Articles', 'مقالاً')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-200">
        {categories.map(c => {
          const isActive = selectedCategory === c;
          return (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`py-2 px-3.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 border uppercase tracking-tight flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200/70 hover:bg-gray-50 hover:text-gray-900'
              }`}
              style={{ minHeight: '38px' }}
            >
              <Tag className="w-3 h-3" />
              {localizedCategory(c)}
            </button>
          );
        })}
      </div>

      {/* Posts grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-gray-200/80">
          <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-500">
            {t('No posts match your search.', 'Aucun article ne correspond.', 'لا توجد مقالات مطابقة.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(a => {
            const meta = CATEGORY_META[a.category];
            const Icon = meta.icon;
            return (
              <button
                key={a.id}
                onClick={() => openPost(a)}
                className="text-left bg-white p-5 rounded-3xl border border-gray-200/80 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[8px] font-black uppercase rounded-md tracking-wider ${meta.chip}`}>
                    <Icon className="w-3 h-3" />
                    {localizedCategory(a.category)}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 font-bold">{a.date}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                  {localizedTitle(a)}
                </h3>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed mt-2 line-clamp-3 flex-1">
                  {localizedSnippet(a)}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400">
                    <Clock className="w-3 h-3" />
                    {a.readTime} {t('min', 'min', 'د')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 group-hover:gap-2 transition-all">
                    {t('Read', 'Lire', 'اقرأ')}
                    <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
