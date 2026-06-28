import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Brain, Stethoscope, Wind, TestTube, AlertOctagon, HeartPulse,
  Droplet, ArrowRightLeft, LayoutDashboard, BookOpen, MonitorPlay, GraduationCap,
  Newspaper, Calculator, ChevronRight, ShieldCheck, Globe, Sparkles, AlertTriangle, Search, Award,
} from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import Logo from '../components/Logo';
import AdsterraNativeBanner from '../components/AdsterraNativeBanner';

interface HomePageProps {
  lang: LangCode;
}

const T = {
  hero: {
    en: { badge: 'Clinical Decision Suite', title: 'Medical Calculators', subtitle: 'Trusted by clinicians worldwide', desc: 'Evidence-based tools for critical care, internal medicine, pharmacology, and clinical research - multilingual, offline-ready, peer-reviewed, and structured for fast retrieval by search engines and AI assistants.' },
    fr: { badge: 'Suite de Décision Clinique', title: 'Calculateurs Médicaux', subtitle: 'Utilisé par des cliniciens du monde entier', desc: 'Outils fondés sur les preuves pour les soins intensifs, la médecine interne et la pharmacologie - multilingues, hors ligne, validés et structurés pour une récupération rapide par les moteurs de recherche et les assistants IA.' },
    ar: { badge: 'منصة القرار الطبي السريري', title: 'الحاسبات الطبية المتخصصة', subtitle: 'يثق به الأطباء حول العالم', desc: 'أدوات قائمة على الأدلة للعناية المركزة والطب الباطني وعلم الأدوية - متعددة اللغات، تعمل بدون اتصال، مُراجعة علميًا، ومهيأة للاستخراج السريع بواسطة محركات البحث والمساعدات الذكية.' },
  },
  cta: {
    en: { primary: 'Open Calculators', secondary: 'Browse Library' },
    fr: { primary: 'Accéder aux outils', secondary: 'Parcourir la bibliothèque' },
    ar: { primary: 'فتح الحاسبات', secondary: 'تصفح المكتبة' },
  },
  tiers: {
    en: {
      t1: { label: 'Emergency & Critical Care', desc: '7 validated ICU & emergency scoring tools' },
      t2: { label: 'Metabolic & Cardiorenal', desc: '6 organ function & cardiorenal calculators' },
      t3: { label: 'Therapeutic & Dosing', desc: '6 pharmacology & body metric tools' },
      t4: { label: 'Learning Resources', desc: 'Journals, Blogs, Presentations & Courses' },
    },
    fr: {
      t1: { label: 'Urgences & Soins Intensifs', desc: '7 outils de scoring validés pour réanimation' },
      t2: { label: 'Métabolique & Cardiorénal', desc: '6 calculateurs organes & cardiorenal' },
      t3: { label: 'Thérapeutique & Dosages', desc: '6 outils de pharmacologie & métriques corporels' },
      t4: { label: 'Ressources Pédagogiques', desc: 'Journaux, Blog, Présentations & Cours' },
    },
    ar: {
      t1: { label: 'طوارئ والعناية المركزة', desc: '٧ أدوات تقييم مُعتمدة لوحدات العناية' },
      t2: { label: 'الاستقلاب والقلب والكلية', desc: '٦ حاسبات وظائف الأعضاء والقلب والكلى' },
      t3: { label: 'العلاج والجرعات والقياسات', desc: '٦ أدوات صيدلانية وقياسات جسدية' },
      t4: { label: 'موارد التعلم', desc: 'مجلات وتدوينات وعروض تقديمية ودروس' },
    },
  },
  stats: {
    en: [
      { value: '50K+', label: 'Calculations Monthly' },
      { value: '3', label: 'Languages' },
      { value: '100%', label: 'Peer-Reviewed' },
      { value: 'E-E-A-T', label: 'Certified' },
    ],
    fr: [
      { value: '50K+', label: 'Calculs Mensuels' },
      { value: '3', label: 'Langues' },
      { value: '100%', label: 'Validés par experts' },
      { value: 'E-E-A-T', label: 'Certifié' },
    ],
    ar: [
      { value: '50K+', label: 'حساب شهري' },
      { value: '٣', label: 'لغات مدعومة' },
      { value: '١٠٠٪', label: 'مراجعة علمية' },
      { value: 'E-E-A-T', label: 'معتمد' },
    ],
  },
  search: {
    en: 'Search calculators, clinical scores & ICU reference...',
    fr: 'Rechercher un calculateur, score ou fiche clinique...',
    ar: 'البحث السريع عن الحاسبات والمقاييس والأدوية...',
  },
  trust: {
    en: 'All tools are validated against peer-reviewed literature (AHA, ESC, CDC, SFAR, NIH) and aligned with international clinical guidelines.',
    fr: 'Tous les outils sont validés selon la littérature médicale révisée (AHA, ESC, HAS, SFMU, NIH) et alignés avec les recommandations internationales.',
    ar: 'جميع الأدوات مُراجعة ومُعتمدة وفق الأدبيات الطبية المُحكّمة (AHA, ESC, CDC, SFAR) ومتوافقة مع الإرشادات الدولية.',
  },
};

const TIER_HIGHLIGHTS = [
  {
    tier: 1,
    icon: AlertTriangle,
    color: 'red',
    path: '/map-calculator',
    items: [
      { icon: Activity, en: 'MAP Calculator', fr: 'Calculateur PAM', ar: 'حساب MAP', path: '/map-calculator' },
      { icon: Brain, en: 'GCS Score', fr: 'Échelle Glasgow', ar: 'معيار غلاسكو', path: '/glasgow-coma-scale' },
      { icon: AlertTriangle, en: 'qSOFA Sepsis', fr: 'qSOFA Sepsis', ar: 'مؤشر qSOFA', path: '/qsofa-score' },
      { icon: Stethoscope, en: 'CURB-65', fr: 'CURB-65', ar: 'CURB-65', path: '/curb65-score' },
      { icon: Wind, en: 'P/F Ratio', fr: 'Rapport P/F', ar: 'نسبة P/F', path: '/pf-ratio' },
    ],
  },
  {
    tier: 2,
    icon: TestTube,
    color: 'blue',
    path: '/creatinine-clearance',
    items: [
      { icon: TestTube, en: 'Creatinine Clearance', fr: 'Clairance Créatinine', ar: 'تصفية الكرياتينين', path: '/creatinine-clearance' },
      { icon: Activity, en: 'MELD Score', fr: 'Score MELD', ar: 'نقاط MELD', path: '/meld-score' },
      { icon: AlertOctagon, en: 'Wells Score', fr: 'Score de Wells', ar: 'نقاط ويلز', path: '/wells-score' },
      { icon: HeartPulse, en: 'CHA₂DS₂-VASc', fr: 'CHA₂DS₂-VASc', ar: 'مؤشر CHA₂DS₂-VASc', path: '/cha2ds2-vasc' },
      { icon: Activity, en: 'Nutrition TDEE', fr: 'Nutrition TDEE', ar: 'تغذية TDEE', path: '/nutrition-tdee' },
      { icon: Activity, en: 'MUST Score', fr: 'Score MUST', ar: 'أداة MUST', path: '/nutrition-must' },
    ],
  },
  {
    tier: 3,
    icon: Droplet,
    color: 'emerald',
    path: '/drip-rate-calculator',
    items: [
      { icon: Droplet, en: 'IV Drip Rate', fr: 'Débit Perfusion', ar: 'سرعة التنقيط', path: '/drip-rate-calculator' },
      { icon: ArrowRightLeft, en: 'Steroid Conversion', fr: 'Équivalences Stéroïdes', ar: 'تحويل الستيرويد', path: '/steroid-conversion' },
      { icon: LayoutDashboard, en: 'IBW & ABW', fr: 'Poids Idéal', ar: 'الوزن المثالي', path: '/adjusted-body-weight' },
      { icon: ArrowRightLeft, en: 'Unit Conversions', fr: 'Conversions d\'Unités', ar: 'تحويل الوحدات', path: '/medical-conversions' },
    ],
  },
  {
    tier: 4,
    icon: BookOpen,
    color: 'purple',
    path: '/blog',
    items: [
      { icon: BookOpen, en: 'Medical Journals', fr: 'Journaux Médicaux', ar: 'المجلات الطبية', path: '/blog' },
      { icon: Newspaper, en: 'Blog Articles', fr: 'Articles de Blog', ar: 'مقالات المدونة', path: '/blog-articles' },
      { icon: MonitorPlay, en: 'Presentations', fr: 'Présentations', ar: 'العروض التقديمية', path: '/presentations' },
      { icon: GraduationCap, en: 'Courses (PDF)', fr: 'Cours (PDF)', ar: 'المحاضرات والدروس', path: '/cours' },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  red:     { bg: 'bg-red-50/70',     border: 'border-red-100',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500' },
  blue:    { bg: 'bg-[#0891B2]/5',   border: 'border-[#0891B2]/20',text: 'text-[#0891B2]', badge: 'bg-[#0891B2]/10 text-[#0891B2]', dot: 'bg-[#0891B2]' },
  emerald: { bg: 'bg-emerald-50/70', border: 'border-emerald-100',text: 'text-emerald-700',badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  purple:  { bg: 'bg-purple-50/70',  border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
};

import SEO from '../components/SEO';

export default function HomePage({ lang }: HomePageProps) {
  const { langPath } = useLang();
  const isRtl = lang === 'ar';

  const hero = T.hero[lang];
  const cta = T.cta[lang];
  const searchPlaceholder = T.search[lang];
  const tiers = T.tiers[lang];
  const stats = T.stats[lang];
  const popular = {
    en: { label: 'Popular:', items: [{ name: 'MAP', path: '/map-calculator' }, { name: 'GCS', path: '/glasgow-coma-scale' }, { name: 'Wells', path: '/wells-score' }, { name: 'Creatinine', path: '/creatinine-clearance' }] },
    fr: { label: 'Populaire :', items: [{ name: 'PAM', path: '/map-calculator' }, { name: 'Glasgow', path: '/glasgow-coma-scale' }, { name: 'Wells', path: '/wells-score' }, { name: 'Créatinine', path: '/creatinine-clearance' }] },
    ar: { label: 'شائع:', items: [{ name: 'MAP', path: '/map-calculator' }, { name: 'Glasgow', path: '/glasgow-coma-scale' }, { name: 'Wells', path: '/wells-score' }, { name: 'الكرياتينين', path: '/creatinine-clearance' }] }
  }[lang];

  const aiSummary = {
    en: {
      badge: 'AI-ready answer',
      title: 'What CareCalculus answers',
      desc: 'Use this site when you need a bedside calculator, a dosing reference, or a quick clinical score. The core pages are built around direct definitions, formula blocks, interpretation ranges, and linked references so humans and AI systems can extract the answer quickly.',
      chips: [
        { label: 'MAP / perfusion', path: '/map-calculator' },
        { label: 'GCS / neuro', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / sepsis', path: '/qsofa-score' },
        { label: 'CKD-EPI / kidney', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / pneumonia', path: '/curb65-score' },
        { label: 'MELD / liver', path: '/meld-score' },
      ],
    },
    fr: {
      badge: 'Réponse prête pour IA',
      title: 'Ce que CareCalculus permet de calculer',
      desc: 'Utilisez ce site pour un calcul au lit du patient, une référence de dosage ou un score clinique rapide. Les pages principales sont structurées autour de définitions directes, de formules, de plages d’interprétation et de références reliées pour faciliter l’extraction par les humains et les IA.',
      chips: [
        { label: 'PAM / perfusion', path: '/map-calculator' },
        { label: 'GCS / neuro', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / sepsis', path: '/qsofa-score' },
        { label: 'CKD-EPI / rein', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / pneumonie', path: '/curb65-score' },
        { label: 'MELD / foie', path: '/meld-score' },
      ],
    },
    ar: {
      badge: 'إجابة جاهزة للذكاء الاصطناعي',
      title: 'ما الذي يجيب عنه CareCalculus',
      desc: 'استخدم الموقع عندما تحتاج إلى حاسبة سريرية، أو مرجع للجرعات، أو مقياس سريع بجانب السرير. الصفحات الأساسية مبنية على تعريف مباشر، ومعادلة واضحة، ونطاقات تفسير، ومراجع مرتبطة بحيث يمكن للإنسان وأنظمة الذكاء الاصطناعي استخراج الإجابة بسرعة.',
      chips: [
        { label: 'MAP / التروية', path: '/map-calculator' },
        { label: 'GCS / الأعصاب', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / الإنتان', path: '/qsofa-score' },
        { label: 'CKD-EPI / الكلى', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / الرئة', path: '/curb65-score' },
        { label: 'MELD / الكبد', path: '/meld-score' },
      ],
    },
  }[lang];

  const tierLabels = [tiers.t1, tiers.t2, tiers.t3, tiers.t4];

  return (
    <div className="space-y-12 pb-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO logicalPath="/" lang={lang} />
      {/* Hero */}
      <section className="relative bg-slate-900 rounded-2xl overflow-hidden px-6 sm:px-10 py-10 sm:py-14 text-white shadow-md border border-slate-800">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" />
        <div className="relative z-10 w-full max-w-[760px] mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-xs">
            <Logo className="w-4.5 h-4.5" mode="dark" />
            <span className="text-[10px] font-mono font-extrabold text-emerald-400 uppercase tracking-widest">{hero.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-3 text-center">
            {hero.title}
          </h1>
          <p className="text-sm sm:text-base text-cyan-200/90 font-medium mb-3 text-center tracking-wide">{hero.subtitle}</p>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed mb-8 w-full max-w-[620px] text-center mx-auto">{hero.desc}</p>
          
          {/* Premium Centered Global Search Trigger Card */}
          <div className="mb-4 w-full max-w-[580px] mx-auto">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="w-full flex items-center justify-between px-4 sm:px-5 py-4 bg-slate-900/60 hover:bg-slate-900/85 text-slate-300 rounded-2xl border border-white/10 hover:border-cyan-400/40 shadow-lg backdrop-blur-md transition-all duration-300 group active:scale-[0.98] cursor-pointer text-left rtl:text-right"
              style={{ minHeight: '52px' }}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                <Search className="w-5 h-5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs sm:text-sm font-medium truncate text-slate-300/80 block">{searchPlaceholder}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono font-bold text-cyan-400 border border-white/5 shadow-2xs group-hover:bg-cyan-500/10 group-hover:border-cyan-400/20 transition-colors">
                <span>Ctrl</span>
                <span>+</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Quick-links row to reduce search friction */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 text-[11px] sm:text-xs">
            <span className="text-slate-400 font-medium">{popular.label}</span>
            {popular.items.map((item, idx) => (
              <Link
                key={idx}
                to={langPath(item.path)}
                className="px-2.5 py-0.5 bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 rounded-md border border-white/5 hover:border-cyan-500/20 transition-all font-medium cursor-pointer"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={langPath('/map-calculator')}
              className="btn-primary text-xs"
            >
              <Calculator className="w-4 h-4" />
              {cta.primary}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={langPath('/blog')}
              className="btn-secondary text-xs !text-white !border-white/20 hover:!bg-white/5"
            >
              <BookOpen className="w-4 h-4" />
              {cta.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-[0.24em] text-cyan-700">
            <Sparkles className="w-3.5 h-3.5" />
            {aiSummary.badge}
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {aiSummary.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-slate-600">
            {aiSummary.desc}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {aiSummary.chips.map((item) => (
              <Link
                key={item.path}
                to={langPath(item.path)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              >
                <Search className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-slate-950 px-6 py-6 text-white shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono font-extrabold uppercase tracking-[0.24em] text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Fast citation targets
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <p>1. Direct formula and score explanations are visible on-page.</p>
              <p>2. Pages use English, French, and Arabic with matching alternates.</p>
              <p>3. The site exposes clinical references, FAQs, and clear titles for retrieval.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-2xl font-black tracking-tight text-white">19+</div>
                <div className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-400">calculators</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-2xl font-black tracking-tight text-white">3</div>
                <div className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-400">languages</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const StatIcon = [Calculator, Globe, ShieldCheck, Award][i];
          return (
            <div key={i} className="bg-white/80 border border-slate-200/60 rounded-2xl p-5 flex flex-col items-center justify-between text-center shadow-xs transition-all duration-300 hover:shadow-sm hover:border-cyan-500/20 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-2.5 rounded-xl bg-slate-55/30 text-cyan-600 mb-2.5 group-hover:scale-105 transition-transform duration-300">
                <StatIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-mono leading-none">{s.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Tier cards (Bento Grid) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TIER_HIGHLIGHTS.map((tier, idx) => {
          const c = {
            red:     { border: 'border-red-100',    text: 'text-red-700',    badge: 'bg-red-50 text-red-700' },
            blue:    { border: 'border-cyan-100',   text: 'text-cyan-700',   badge: 'bg-cyan-50 text-cyan-700' },
            emerald: { border: 'border-emerald-100',text: 'text-emerald-700',badge: 'bg-emerald-50 text-emerald-700' },
            purple:  { border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-50 text-purple-700' },
          }[tier.color];
          const tl = tierLabels[idx];
          const TierIcon = tier.icon;
          return (
            <div key={tier.tier} className={`bg-white border ${c.border} rounded-2xl p-6 sm:p-7 space-y-5 shadow-sm transition-all hover:shadow-md cursor-default`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${c.badge} shadow-2xs`}>
                    <TierIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-base font-black tracking-tight ${c.text}`}>{tl.label}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{tl.desc}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {tier.items.map((item) => {
                  const ItemIcon = item.icon;
                  const label = lang === 'fr' ? item.fr : lang === 'ar' ? item.ar : item.en;
                  return (
                    <Link
                      key={item.path}
                      to={langPath(item.path)}
                      className="flex items-center justify-between p-3 bg-white/90 hover:bg-white rounded-xl border border-slate-200/50 hover:border-cyan-500/20 hover:shadow-xs transition-all duration-300 group cursor-pointer active:scale-[0.99]"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-slate-55/40 text-slate-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-600 transition-colors">
                          <ItemIcon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-105" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-cyan-700 transition-colors truncate">{label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Adsterra Native Banner */}
      <AdsterraNativeBanner />

      {/* Clinical Trust & Evidence strip */}
      <section className="bg-slate-900 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-md">
        <div className="p-2.5 rounded-xl bg-[#0891B2]/20 border border-[#0891B2]/30 shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#22D3EE]" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed flex-1 font-medium">{T.trust[lang]}</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-[#0891B2]/20 border border-[#0891B2]/30 rounded-lg text-[10px] font-mono font-bold text-[#22D3EE] uppercase tracking-wider">E-E-A-T</span>
          <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">PubMed</span>
        </div>
      </section>

    </div>
  );
}
