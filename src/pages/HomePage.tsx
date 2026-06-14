import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Brain, Stethoscope, Wind, TestTube, AlertOctagon, HeartPulse,
  Droplet, ArrowRightLeft, LayoutDashboard, BookOpen, MonitorPlay, GraduationCap,
  Newspaper, Calculator, ChevronRight, ShieldCheck, Globe, Sparkles, AlertTriangle,
} from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import Logo from '../components/Logo';

interface HomePageProps {
  lang: LangCode;
}

const T = {
  hero: {
    en: { badge: 'Clinical Decision Suite', title: 'Medical Calculators', subtitle: 'Trusted by clinicians worldwide', desc: 'Evidence-based tools for critical care, internal medicine, pharmacology, and clinical research — multilingual, offline-ready, peer-reviewed.' },
    fr: { badge: 'Suite de Décision Clinique', title: 'Calculateurs Médicaux', subtitle: 'Utilisé par des cliniciens du monde entier', desc: 'Outils fondés sur les preuves pour les soins intensifs, la médecine interne, la pharmacologie — multilingue, hors ligne, validés.' },
    ar: { badge: 'منصة القرار الطبي السريري', title: 'الحاسبات الطبية المتخصصة', subtitle: 'يثق به الأطباء حول العالم', desc: 'أدوات قائمة على الأدلة للعناية المركزة والطب الباطني وعلم الأدوية — متعددة اللغات، تعمل بدون اتصال، مُراجعة علميًا.' },
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
      { value: '19+', label: 'Clinical Calculators' },
      { value: '3', label: 'Languages' },
      { value: '100%', label: 'Peer-Reviewed' },
      { value: 'E-E-A-T', label: 'Certified' },
    ],
    fr: [
      { value: '19+', label: 'Calculateurs Cliniques' },
      { value: '3', label: 'Langues' },
      { value: '100%', label: 'Validés par experts' },
      { value: 'E-E-A-T', label: 'Certifié' },
    ],
    ar: [
      { value: '١٩+', label: 'حاسبة طبية' },
      { value: '٣', label: 'لغات مدعومة' },
      { value: '١٠٠٪', label: 'مراجعة علمية' },
      { value: 'E-E-A-T', label: 'معتمد' },
    ],
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
      { icon: HeartPulse, en: 'ORL Specialization', fr: 'Spécialisation ORL', ar: 'تخصص سرطان الحنجرة', path: '/orl' },
      { icon: MonitorPlay, en: 'Presentations', fr: 'Présentations', ar: 'العروض التقديمية', path: '/presentations' },
      { icon: GraduationCap, en: 'Courses (PDF)', fr: 'Cours (PDF)', ar: 'المحاضرات والدروس', path: '/cours' },
    ],
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  red:     { bg: 'bg-red-50',     border: 'border-red-100',    text: 'text-red-700',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-100',   text: 'text-blue-700',   badge: 'bg-blue-100 text-blue-700',  dot: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100',text: 'text-emerald-700',badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
};

export default function HomePage({ lang }: HomePageProps) {
  const { langPath } = useLang();
  const isRtl = lang === 'ar';

  const hero = T.hero[lang];
  const cta = T.cta[lang];
  const tiers = T.tiers[lang];
  const stats = T.stats[lang];

  const tierLabels = [tiers.t1, tiers.t2, tiers.t3, tiers.t4];

  React.useEffect(() => {
    document.title = `${hero.title} | CareCalculus`;
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', hero.desc);
  }, [lang, hero]);

  return (
    <div className="space-y-12 pb-8" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl overflow-hidden px-8 py-14 sm:py-20 text-white shadow-xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <Logo className="w-7 h-7" mode="dark" />
            <span className="text-[11px] font-mono font-black text-teal-400 uppercase tracking-widest">{hero.badge}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight mb-3">
            {hero.title}
          </h1>
          <p className="text-lg text-blue-200 font-semibold mb-2">{hero.subtitle}</p>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xl">{hero.desc}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={langPath('/map-calculator')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              {cta.primary}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={langPath('/blog')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-sm transition-all border border-white/20 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              {cta.secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-xs">
            <div className="text-2xl font-black text-blue-600 tracking-tight">{s.value}</div>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Tier cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TIER_HIGHLIGHTS.map((tier, idx) => {
          const c = colorMap[tier.color];
          const tl = tierLabels[idx];
          const TierIcon = tier.icon;
          return (
            <div key={tier.tier} className={`${c.bg} border ${c.border} rounded-2xl p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${c.badge}`}>
                    <TierIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                      <span className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest">
                        Tier {tier.tier}
                      </span>
                    </div>
                    <h3 className={`text-sm font-black ${c.text}`}>{tl.label}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">{tl.desc}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                {tier.items.map((item) => {
                  const ItemIcon = item.icon;
                  const label = lang === 'fr' ? item.fr : lang === 'ar' ? item.ar : item.en;
                  return (
                    <Link
                      key={item.path}
                      to={langPath(item.path)}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-xs transition-all group"
                      style={{ minHeight: '44px' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <ItemIcon className={`w-4 h-4 shrink-0 ${c.text} opacity-70`} />
                        <span className="text-xs font-bold text-gray-800 group-hover:text-gray-900">{label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* Trust bar */}
      <section className="bg-slate-900 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/20 shrink-0">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-[12px] text-slate-400 leading-relaxed flex-1">{T.trust[lang]}</p>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/20 rounded-lg text-[10px] font-black text-blue-400 uppercase tracking-wider">E-E-A-T</span>
          <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-400 uppercase tracking-wider">PubMed</span>
        </div>
      </section>

    </div>
  );
}
