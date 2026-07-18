import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Brain, Stethoscope, Wind, TestTube, AlertOctagon, HeartPulse,
  Droplet, ArrowRightLeft, LayoutDashboard, BookOpen, MonitorPlay, GraduationCap,
  Newspaper, Calculator, ChevronRight, ShieldCheck, Globe, Sparkles, AlertTriangle, Search, Award, ArrowRight
} from 'lucide-react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import Logo from '../components/Logo';
import SmartPasteModal from '../components/SmartPasteModal';

interface HomePageProps {
  lang: LangCode;
}

const T = {
  hero: {
    en: { badge: 'Clinical Decision Suite', title: 'Medical Calculators', subtitle: 'Trusted by clinicians worldwide', desc: 'The fastest, most rigorous clinical decision support tools. Designed for the bedside: zero fluff, offline-ready, and strictly aligned with current AHA, KDIGO, and ESPEN guidelines.' },
    fr: { badge: 'Suite de Décision Clinique', title: 'Calculateurs Médicaux', subtitle: 'Utilisé par des cliniciens du monde entier', desc: 'Les outils d\'aide à la décision clinique les plus rapides et rigoureux. Conçus pour le lit du patient : sans fioritures, hors ligne, et strictement alignés sur les recommandations AHA, KDIGO et ESPEN.' },
    
  },
  cta: {
    en: { primary: 'Open Calculators', secondary: 'Browse Library' },
    fr: { primary: 'Accéder aux outils', secondary: 'Parcourir la bibliothèque' },
    
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
    
  },
  stats: {
    en: [
      { value: '50K+', label: 'Clinical Decisions / Mo.' },
      { value: '3', label: 'Supported Languages' },
      { value: '100%', label: 'Expert Peer-Reviewed' },
      { value: 'E-E-A-T', label: 'Guideline-Aligned' },
    ],
    fr: [
      { value: '50K+', label: 'Décisions Cliniques / Mois' },
      { value: '3', label: 'Langues Supportées' },
      { value: '100%', label: 'Validé par Experts' },
      { value: 'E-E-A-T', label: 'Aligné aux Recommandations' },
    ],
    
  },
  search: {
    en: 'Search calculators, clinical scores & ICU reference...',
    fr: 'Rechercher un calculateur, score ou fiche clinique...',
    
  },
  trust: {
    en: 'All tools are validated against peer-reviewed literature (AHA, ESC, CDC, SFAR, NIH) and aligned with international clinical guidelines.',
    fr: 'Tous les outils sont validés selon la littérature médicale révisée (AHA, ESC, HAS, SFMU, NIH) et alignés avec les recommandations internationales.',
    
  },
};

const SPECIALTIES = [
  { id: 'all', en: 'All Categories', fr: 'Toutes catégories' },
  { id: 'emergency', en: 'Emergency & Critical Care', fr: 'Urgences & Soins Intensifs' },
  { id: 'cardiology', en: 'Cardiology', fr: 'Cardiologie' },
  { id: 'pulmonology', en: 'Pulmonology', fr: 'Pneumologie' },
  { id: 'nephrology', en: 'Nephrology', fr: 'Néphrologie' },
  { id: 'gastro', en: 'Gastroenterology', fr: 'Gastro-entérologie' },
  { id: 'neuro', en: 'Neurology', fr: 'Neurologie' },
  { id: 'nutrition', en: 'Nutrition', fr: 'Nutrition' },
  { id: 'pharmaco', en: 'Pharmacology', fr: 'Pharmacologie' },
];

const FEATURED_CALCULATORS = [
  { id: 'map', icon: Activity, en: 'MAP Calculator', fr: 'Calculateur PAM', path: '/map-calculator', specialties: ['cardiology', 'emergency'] },
  { id: 'gcs', icon: Brain, en: 'GCS Score', fr: 'Échelle Glasgow', path: '/glasgow-coma-scale', specialties: ['neuro', 'emergency'] },
  { id: 'qsofa', icon: AlertTriangle, en: 'qSOFA Sepsis', fr: 'qSOFA Sepsis', path: '/qsofa-score', specialties: ['emergency'] },
  { id: 'curb65', icon: Stethoscope, en: 'CURB-65', fr: 'CURB-65', path: '/curb65-score', specialties: ['pulmonology', 'emergency'] },
  { id: 'pf', icon: Wind, en: 'P/F Ratio', fr: 'Rapport P/F', path: '/pf-ratio', specialties: ['pulmonology', 'emergency'] },
  { id: 'creat', icon: TestTube, en: 'Creatinine Clearance', fr: 'Clairance Créatinine', path: '/creatinine-clearance', specialties: ['nephrology'] },
  { id: 'meld', icon: Activity, en: 'MELD Score', fr: 'Score MELD', path: '/meld-score', specialties: ['gastro'] },
  { id: 'wells', icon: AlertOctagon, en: 'Wells Score', fr: 'Score de Wells', path: '/wells-score', specialties: ['pulmonology', 'cardiology'] },
  { id: 'cha2', icon: HeartPulse, en: 'CHA₂DS₂-VASc', fr: 'CHA₂DS₂-VASc', path: '/cha2ds2-vasc', specialties: ['cardiology'] },
  { id: 'tdee', icon: Activity, en: 'Nutrition TDEE', fr: 'Nutrition TDEE', path: '/nutrition-tdee', specialties: ['nutrition'] },
  { id: 'must', icon: Activity, en: 'MUST Score', fr: 'Score MUST', path: '/nutrition-must', specialties: ['nutrition'] },
  { id: 'iv', icon: Droplet, en: 'IV Drip Rate', fr: 'Débit Perfusion', path: '/drip-rate-calculator', specialties: ['pharmaco', 'emergency'] },
  { id: 'steroid', icon: ArrowRightLeft, en: 'Steroid Conversion', fr: 'Équivalences Stéroïdes', path: '/steroid-conversion', specialties: ['pharmaco'] },
  { id: 'ibw', icon: LayoutDashboard, en: 'IBW & ABW', fr: 'Poids Idéal', path: '/adjusted-body-weight', specialties: ['nutrition', 'pharmaco'] },
  { id: 'unit', icon: ArrowRightLeft, en: 'Unit Conversions', fr: 'Conversions d\'Unités', path: '/medical-conversions', specialties: ['pharmaco'] },
];

const LEARNING_RESOURCES = [
  { id: 'journals', icon: BookOpen, en: 'Medical Journals', fr: 'Journaux Médicaux', path: '/blog' },
  { id: 'articles', icon: Newspaper, en: 'Blog Articles', fr: 'Articles de Blog', path: '/blog-articles' },
  { id: 'presentations', icon: MonitorPlay, en: 'Presentations', fr: 'Présentations', path: '/presentations' },
  { id: 'courses', icon: GraduationCap, en: 'Courses (PDF)', fr: 'Cours (PDF)', path: '/cours' },
];


import SEO from '../components/SEO';

export default function HomePage({ lang }: HomePageProps) {
  const { langPath } = useLang();
  const isRtl = false;

  const [activeSpecialty, setActiveSpecialty] = useState('all');

  const filteredCalculators = FEATURED_CALCULATORS.filter(calc =>
    activeSpecialty === 'all' || calc.specialties.includes(activeSpecialty)
  );

  const hero = T.hero[lang];
  const cta = T.cta[lang];
  const searchPlaceholder = T.search[lang];
  const tiers = T.tiers[lang];
  const stats = T.stats[lang];
  const popular = {
    en: { label: 'Popular:', items: [{ name: 'MAP', path: '/map-calculator' }, { name: 'GCS', path: '/glasgow-coma-scale' }, { name: 'Wells', path: '/wells-score' }, { name: 'Creatinine', path: '/creatinine-clearance' }] },
    fr: { label: 'Populaire :', items: [{ name: 'PAM', path: '/map-calculator' }, { name: 'Glasgow', path: '/glasgow-coma-scale' }, { name: 'Wells', path: '/wells-score' }, { name: 'Créatinine', path: '/creatinine-clearance' }] }
  }[lang];

  const bedsideSummary = {
    en: {
      badge: 'Evidence-First Design',
      title: 'Built for bedside speed and precision',
      desc: 'We strip away the noise. CareCalculus is engineered for critical care and emergency medicine where seconds matter. Every formula, cutoff value, and dosing guideline is immediately visible, strictly referenced, and automatically adapted to your patient\'s metrics.',
      chips: [
        { label: 'MAP / perfusion', path: '/map-calculator' },
        { label: 'GCS / neuro', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / sepsis', path: '/qsofa-score' },
        { label: 'CKD-EPI / kidney', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / pneumonia', path: '/curb65-score' },
        { label: 'MELD / liver', path: '/meld-score' },
      ],
      boxBadge: 'Clinical Rigor',
      boxLines: [
        '1. Validated against landmark clinical trials (e.g., Surviving Sepsis, KDIGO).',
        '2. Native multi-lingual support (EN, FR, AR) for cross-border medical teams.',
        '3. Strict version control on all algorithms to guarantee dosing safety.'
      ]
    },
    fr: {
      badge: 'Design fondé sur les preuves',
      title: 'Conçu pour la rapidité au lit du patient',
      desc: 'Nous éliminons le superflu. CareCalculus est conçu pour les soins intensifs et la médecine d\'urgence où chaque seconde compte. Chaque formule, seuil et recommandation posologique est immédiatement visible, strictement référencée et adaptée.',
      chips: [
        { label: 'PAM / perfusion', path: '/map-calculator' },
        { label: 'GCS / neuro', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / sepsis', path: '/qsofa-score' },
        { label: 'CKD-EPI / rein', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / pneumonie', path: '/curb65-score' },
        { label: 'MELD / foie', path: '/meld-score' },
      ],
      boxBadge: 'Rigueur Clinique',
      boxLines: [
        '1. Validé selon les essais cliniques de référence (ex: Surviving Sepsis, KDIGO).',
        '2. Support multilingue natif (EN, FR, AR) pour les équipes médicales internationales.',
        '3. Contrôle de version strict sur tous les algorithmes pour garantir la sécurité.'
      ]
    },
    
  }[lang];

  const tierLabels = [tiers.t1, tiers.t2, tiers.t3, tiers.t4];

  return (
    <div className="space-y-16 pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO logicalPath="/" lang={lang} />
      {/* Hero — clean white, surgical */}
      <section className="relative bg-white border-b border-slate-100 px-6 sm:px-10 py-12 sm:py-16 -mx-4 sm:-mx-6 md:mx-0 md:border md:border-slate-200 md:rounded-xl">
        <div className="relative w-full max-w-[720px] mx-auto flex flex-col items-center text-center">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 bg-teal-50 rounded-full border border-teal-200">
            <Logo className="w-4 h-4" mode="light" />
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-widest">{hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight mb-4 text-center">
            {hero.title}
          </h1>
          <p className="text-lg text-slate-700 font-medium mb-2 text-center">{hero.subtitle}</p>
          <p className="text-base text-slate-600 font-normal leading-relaxed mb-10 w-full max-w-[580px] text-center mx-auto">{hero.desc}</p>

          {/* Search trigger */}
          <div className="mb-5 w-full max-w-[540px] mx-auto">
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200 hover:border-teal-300 shadow-sm transition-all duration-200 group cursor-pointer text-left rtl:text-right"
              style={{ minHeight: '52px' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Search className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-sm font-normal truncate block">{searchPlaceholder}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-bold text-slate-400">
                <span>Ctrl</span><span>+</span><span>K</span>
              </div>
            </button>
          </div>

          {/* Quick-links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs">
            <span className="text-slate-400 font-medium">{popular.label}</span>
            {popular.items.map((item, idx) => (
              <Link
                key={idx}
                to={langPath(item.path)}
                className="px-3 py-1.5 bg-white text-slate-600 hover:text-teal-700 rounded-lg border border-slate-200 hover:border-teal-200 transition-all font-semibold"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SmartPasteModal lang={lang} />
            <Link to={langPath('/map-calculator')} className="btn-primary text-sm">
              <Calculator className="w-4 h-4" />
              {cta.primary}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to={langPath('/blog')} className="btn-secondary text-sm">
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
            {bedsideSummary.badge}
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            {bedsideSummary.title}
          </h2>
          <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-slate-600">
            {bedsideSummary.desc}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {bedsideSummary.chips.map((item) => (
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
              {bedsideSummary.boxBadge}
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              {bedsideSummary.boxLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
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
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Specialty Filter Bar */}
      <section className="w-full relative">
        <div className="flex overflow-x-auto pb-4 pt-2 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 gap-2 snap-x">
          {SPECIALTIES.map((spec) => {
            const isActive = activeSpecialty === spec.id;
            const label = lang === 'fr' ? spec.fr : spec.en;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveSpecialty(spec.id)}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
                  isActive 
                    ? 'bg-teal-600 text-white border-teal-600 shadow-[0_4px_12px_rgba(13,148,136,0.3)]' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Filtered Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCalculators.map((calc) => {
          const CalcIcon = calc.icon;
          const label = lang === 'fr' ? calc.fr : calc.en;
          return (
            <Link
              key={calc.id}
              to={langPath(calc.path)}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all duration-300 group active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  <CalcIcon className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-sm font-black text-slate-800 group-hover:text-teal-700 transition-colors truncate">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          );
        })}
      </section>

      {/* Clinical Library Banner */}
      <section className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            {lang === 'fr' ? 'Base de Données Élargie' : 'Extended Reference'}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
            {lang === 'fr' ? 'Rechercher parmi plus de 750 outils cliniques' : 'Search 750+ Extended Clinical Tools'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-medium">
            {lang === 'fr' 
              ? 'Accédez à notre bibliothèque médicale complète d\'équations, de critères diagnostiques, d\'arbres décisionnels et de convertisseurs.' 
              : 'Access our comprehensive reference library of clinical equations, diagnostic criteria sets, decision trees, and unit converters.'}
          </p>
        </div>
        <Link
          to={langPath('/clinical-library')}
          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition shadow-sm whitespace-nowrap active:scale-95"
        >
          {lang === 'fr' ? 'Explorer la Bibliothèque' : 'Explore Clinical Library'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Learning Resources */}
      <section className="mt-8 pt-8 border-t border-slate-200/60">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">
          {lang === 'fr' ? 'Ressources Pédagogiques' : 'Learning Resources'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEARNING_RESOURCES.map((res) => {
            const ResIcon = res.icon;
            const label = lang === 'fr' ? res.fr : res.en;
            return (
              <Link
                key={res.id}
                to={langPath(res.path)}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-white hover:shadow-sm transition-all duration-300 group"
              >
                <div className="p-2 rounded-lg bg-white text-slate-500 border border-slate-200 group-hover:border-purple-200 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                  <ResIcon className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-purple-700 transition-colors truncate">{label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Adsterra Native Banner */}

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
