import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Activity, Brain, Stethoscope, Wind, TestTube, AlertOctagon, HeartPulse,
  Droplet, ArrowRightLeft, LayoutDashboard, BookOpen,
  Newspaper, Calculator, ChevronRight, ShieldCheck, Globe, Sparkles, AlertTriangle, Search, Award, ArrowRight, Pill,
  ClipboardCopy
} from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { LangCode } from '../types';
import { useLang } from '../utils/lang';
import Logo from '../components/Logo';
import SmartPasteModal from '../components/SmartPasteModal';
import { CONDITIONS_DB } from '../data/conditions';
import QuickMAPCalculator from '../components/QuickMAPCalculator';

interface HomePageProps {
  lang: LangCode;
}

const T = {
  hero: {
    en: { badge: 'Clinical Decision Suite', title: 'Medical Calculators', subtitle: 'Trusted by clinicians worldwide', desc: 'The fastest, most rigorous clinical decision support tools. Designed for the bedside: zero fluff, offline-ready, and strictly aligned with current AHA, KDIGO, and ESPEN guidelines.' },
    fr: { badge: 'Suite de Décision Clinique', title: 'Calculateurs Médicaux', subtitle: 'Utilisé par des cliniciens du monde entier', desc: 'Les outils d\'aide à la décision clinique les plus rapides et rigoureux. Conçus pour le lit du patient : sans fioritures, hors ligne, et strictly alignés sur les recommandations AHA, KDIGO et ESPEN.' },
    es: { badge: 'Suite de Decisión Clínica', title: 'Calculadoras Médicas', subtitle: 'Utilizado por médicos en todo el mundo', desc: 'Herramientas de soporte de decisiones clínicas más rápidas y rigurosas. Diseñadas para la práctica médica: sin rodeos, listas para uso offline y alineadas con guías AHA, KDIGO y ESPEN.' },
    ar: { badge: 'مجموعة القرار السريري', title: 'الحاسبات الطبية', subtitle: 'موثوق به من قبل الأطباء حول العالم', desc: 'أسرع وأدق أدوات دعم القرار السريري. مصممة للاستخدام بجانب السرير: بدون حشو، تدعم العمل بدون إنترنت، ومتوافقة تماماً مع أحدث إرشادات AHA، KDIGO، و ESPEN.' },
  },
  cta: {
    en: { primary: 'Quick Calculate', secondary: 'Browse Library' },
    fr: { primary: 'Calcul Rapide', secondary: 'Parcourir la bibliothèque' },
    es: { primary: 'Cálculo Rápido', secondary: 'Explorar Biblioteca' },
    ar: { primary: 'حساب سريع', secondary: 'تصفح المكتبة' },
  },
  tiers: {
    en: {
      t1: { label: 'Emergency & Critical Care', desc: '30+ validated ICU & emergency scoring tools' },
      t2: { label: 'Metabolic & Cardiorenal', desc: '25+ organ function & cardiorenal calculators' },
      t3: { label: 'Therapeutic & Dosing', desc: '30+ pharmacology & body metric tools' },
    },
    fr: {
      t1: { label: 'Urgences & Soins Intensifs', desc: '30+ outils de scoring validés pour réanimation' },
      t2: { label: 'Métabolique & Cardiorénal', desc: '25+ calculateurs organes & cardiorenal' },
      t3: { label: 'Thérapeutique & Dosages', desc: '30+ outils de pharmacologie & métriques corporels' },
    },
    es: {
      t1: { label: 'Urgencias y Cuidados Críticos', desc: '30+ escalas validadas para UCI y urgencias' },
      t2: { label: 'Metabólico y Cardiorrenal', desc: '25+ calculadoras de función orgánica' },
      t3: { label: 'Terapéutica y Dosificación', desc: '30+ herramientas farmacológicas y métricas' },
    },
    ar: {
      t1: { label: 'الطوارئ والرعاية الحرجة', desc: 'أكثر من 30 أداة تقييم معتمدة للعناية المركزة والطوارئ' },
      t2: { label: 'الاضطرابات الأيضية والقلبية الكلوية', desc: 'أكثر من 25 حاسبة لوظائف الأعضاء والقلب والكلى' },
      t3: { label: 'الجرعات العلاجية والمقاييس الدوائية', desc: 'أكثر من 30 أداة للمقاييس الدوائية والبدنية' },
    },
  },
  stats: {
    en: [
      { value: '117+', label: 'Validated Clinical Tools' },
      { value: '3', label: 'Languages (EN, FR, ES)' },
      { value: '100%', label: 'Guideline-Sourced (AHA/ESC/KDIGO)' },
      { value: '0 PHI', label: '100% Client-Side & Private' },
    ],
    fr: [
      { value: '117+', label: 'Outils Cliniques Validés' },
      { value: '3', label: 'Langues (EN, FR, ES)' },
      { value: '100%', label: 'Basé sur Recommandations (AHA/ESC/KDIGO)' },
      { value: '0 PHI', label: '100% Local & Privé' },
    ],
    es: [
      { value: '117+', label: 'Herramientas Clínicas Validadas' },
      { value: '3', label: 'Idiomas (EN, FR, ES)' },
      { value: '100%', label: 'Basado en Guías (AHA/ESC/KDIGO)' },
      { value: '0 PHI', label: '100% Local y Privado' },
    ],
    ar: [
      { value: '117+', label: 'أداة سريرية معتمدة' },
      { value: '3', label: 'لغات (EN, FR, ES)' },
      { value: '100%', label: 'مستمد من الإرشادات (AHA/ESC/KDIGO)' },
      { value: '0 PHI', label: 'محلي وخاص 100%' },
    ],
  },
  search: {
    en: 'Search calculators, clinical scores & ICU reference...',
    fr: 'Rechercher un calculateur, score ou fiche clinique...',
    es: 'Buscar calculadoras, escalas clínicas y referencia UCI...',
    ar: 'ابحث عن الحاسبات، التقييمات السريرية والمراجع...',
  },
  trust: {
    en: 'All tools are validated against peer-reviewed literature (AHA, ESC, CDC, SFAR, NIH) and aligned with international clinical guidelines.',
    fr: 'Tous les outils sont validés selon la littérature médicale révisée (AHA, ESC, HAS, SFMU, NIH) et alignés avec les recommandations internationales.',
    es: 'Todas las herramientas están validadas con literatura médica revisada por pares (AHA, ESC, CDC, NIH) y alineadas con guías internacionales.',
    ar: 'جميع الأدوات معتمدة بناءً على الدراسات الطبية المراجعة (AHA, ESC, CDC, NIH) ومتوافقة مع الإرشادات السريرية الدولية.',
  },
};

const SPECIALTIES = [
  { id: 'all', en: 'All Categories', fr: 'Toutes catégories', es: 'Todas las categorías' },
  { id: 'emergency', en: 'Emergency & Critical Care', fr: 'Urgences & Soins Intensifs', es: 'Urgencias y Cuidados Críticos' },
  { id: 'cardiology', en: 'Cardiology', fr: 'Cardiologie', es: 'Cardiología' },
  { id: 'pediatrics', en: 'Pediatrics', fr: 'Pédiatrie', es: 'Pediatría' },
  { id: 'obgyn', en: 'Obstetrics & Gyn', fr: 'Obstétrique & Gynéco', es: 'Obstetricia y Ginecología' },
  { id: 'hematology', en: 'Hematology & Oncology', fr: 'Hématologie & Oncologie', es: 'Hematología y Oncología' },
  { id: 'toxicology', en: 'Toxicology', fr: 'Toxicologie', es: 'Toxicología' },
  { id: 'pulmonology', en: 'Pulmonology', fr: 'Pneumologie', es: 'Neumología' },
  { id: 'nephrology', en: 'Nephrology', fr: 'Néphrologie', es: 'Nefrología' },
  { id: 'gastro', en: 'Gastroenterology', fr: 'Gastro-entérologie', es: 'Gastroenterología' },
  { id: 'neuro', en: 'Neurology', fr: 'Neurologie', es: 'Neurología' },
  { id: 'nutrition', en: 'Nutrition', fr: 'Nutrition' },
  { id: 'pharmaco', en: 'Pharmacology', fr: 'Pharmacologie' },
];

import { ALL_CALCULATORS } from '../data/calculators';

import SEO from '../components/SEO';
import { JsonLd, generateWebSiteSchema, generateFAQSchema } from '../components/JsonLd';

// Animated counter that counts up to a target number on scroll-into-view
function AnimatedStatValue({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const isNumeric = /^\d/.test(value);
  const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/^[0-9]+/, '');
  const [display, setDisplay] = useState(isNumeric ? '0' + suffix : value);

  useEffect(() => {
    if (!isInView || !isNumeric) { setDisplay(value); return; }
    let start = 0;
    const duration = 1200;
    const step = Math.ceil(numericPart / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, numericPart);
      setDisplay(String(start) + suffix);
      if (start >= numericPart) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView]);

  return <div ref={ref} className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-mono leading-none">{display}</div>;
}

export default function HomePage({ lang }: HomePageProps) {
  const { langPath } = useLang();
  const isRtl = false;

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || searchParams.get('specialty') || 'all';
  const [activeSpecialty, setActiveSpecialty] = useState(initialCategory);

  useEffect(() => {
    const categoryParam = searchParams.get('category') || searchParams.get('specialty');
    if (categoryParam) {
      setActiveSpecialty(categoryParam);
    }
  }, [searchParams]);

  const FEATURED_CALCULATORS = ALL_CALCULATORS.filter(c => c.isFeatured);
  const filteredCalculators = FEATURED_CALCULATORS.filter(calc =>
    activeSpecialty === 'all' || calc.specialties.includes(activeSpecialty)
  );

  const hero = T.hero[lang] || T.hero.en;
  const cta = T.cta[lang] || T.cta.en;
  const searchPlaceholder = T.search[lang] || T.search.en;
  const tiers = T.tiers[lang] || T.tiers.en;
  const stats = T.stats[lang] || T.stats.en;

  const popularOptions = {
    en: { label: 'Popular:', items: [{ name: 'MAP', path: '/map-calculator' }, { name: 'GCS', path: '/glasgow-coma-scale' }, { name: 'Wells PE', path: '/wells-pe-score' }, { name: 'Creatinine', path: '/creatinine-clearance' }] },
    fr: { label: 'Populaire :', items: [{ name: 'PAM', path: '/map-calculator' }, { name: 'Glasgow', path: '/glasgow-coma-scale' }, { name: 'Wells EP', path: '/wells-pe-score' }, { name: 'Créatinine', path: '/creatinine-clearance' }] },
    es: { label: 'Popular:', items: [{ name: 'PAM', path: '/map-calculator' }, { name: 'Glasgow', path: '/glasgow-coma-scale' }, { name: 'Wells EP', path: '/wells-pe-score' }, { name: 'Creatinina', path: '/creatinine-clearance' }] },
    ar: { label: 'الأكثر استخداماً:', items: [{ name: 'MAP', path: '/map-calculator' }, { name: 'GCS', path: '/glasgow-coma-scale' }, { name: 'Wells PE', path: '/wells-pe-score' }, { name: 'Creatinine', path: '/creatinine-clearance' }] }
  };
  const popular = popularOptions[lang as keyof typeof popularOptions] || popularOptions.en;

  const bedsideSummaryOptions = {
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
        '2. Native multi-lingual support (EN, FR) for cross-border medical teams.',
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
        '2. Support multilingue natif (EN, FR) pour les équipes médicales internationales.',
        '3. Contrôle de version strict sur tous les algorithmes pour garantir la sécurité.'
      ]
    },
    es: {
      badge: 'Diseño Basado en Evidencia',
      title: 'Diseñado para velocidad y precisión al lado del paciente',
      desc: 'Eliminamos lo innecesario. CareCalculus está diseñado para cuidados intensivos y medicina de urgencias donde cada segundo cuenta. Cada fórmula, valor de corte y pauta de dosificación es inmediatamente visible, estrictamente referenciada y adaptada a los datos de su paciente.',
      chips: [
        { label: 'PAM / perfusión', path: '/map-calculator' },
        { label: 'GCS / neuro', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / sepsis', path: '/qsofa-score' },
        { label: 'CKD-EPI / riñón', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / neumonía', path: '/curb65-score' },
        { label: 'MELD / hígado', path: '/meld-score' },
      ],
      boxBadge: 'Rigor Clínico',
      boxLines: [
        '1. Validado con ensayos clínicos de referencia (p. ej., Surviving Sepsis, KDIGO).',
        '2. Soporte multilingüe nativo (EN, FR, ES) para equipos médicos internacionales.',
        '3. Control estricto de versiones en todos los algoritmos para garantizar la seguridad.'
      ]
    },
    ar: {
      badge: 'تصميم مبني على الأدلة',
      title: 'مصمم للسرعة والدقة بجانب المريض',
      desc: 'نزيل التشتيت تماماً. تم تصميم CareCalculus للعناية المركزة وطب الطوارئ حيث كل ثانية تهم. كل معادلة، قيمة فاصلة، وإرشادات الجرعة مرئية على الفور، وموثقة، وتتكيف تلقائياً مع قياسات مريضك.',
      chips: [
        { label: 'MAP / التروية', path: '/map-calculator' },
        { label: 'GCS / الأعصاب', path: '/glasgow-coma-scale' },
        { label: 'qSOFA / الإنتان', path: '/qsofa-score' },
        { label: 'CKD-EPI / الكلى', path: '/ckd-epi-gfr' },
        { label: 'CURB-65 / الالتهاب الرئوي', path: '/curb65-score' },
        { label: 'MELD / الكبد', path: '/meld-score' },
      ],
      boxBadge: 'الصرامة السريرية',
      boxLines: [
        '1. تم التحقق منها باستخدام التجارب السريرية الرئيسية (مثل Surviving Sepsis, KDIGO).',
        '2. دعم متعدد اللغات أصلي (EN, FR, ES, AR) للفرق الطبية الدولية.',
        '3. مراقبة دقيقة لإصدارات الخوارزميات لضمان سلامة الجرعات.'
      ]
    }
  };
  const bedsideSummary = bedsideSummaryOptions[lang as keyof typeof bedsideSummaryOptions] || bedsideSummaryOptions.en;

  const tierLabels = [tiers.t1, tiers.t2, tiers.t3];

  return (
    <div className="space-y-16 pb-12" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO logicalPath="/" lang={lang} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": "CareCalculus — Evidence-Based Clinical Decision Support Suite",
        "description": hero.desc,
        "url": "https://carecalculus.com",
        "about": {
          "@type": "MedicalSpecialty",
          "name": "Emergency Medicine, Critical Care, Cardiology, Nephrology"
        },
        "hasPart": FEATURED_CALCULATORS.map(c => ({
          "@type": "SoftwareApplication",
          "name": c.title.en,
          "applicationCategory": "HealthApplication",
          "operatingSystem": "All",
          "url": `https://carecalculus.com${c.path}`
        }))
      }} />

      {/* WebSite + SearchAction schema — enables Google Sitelinks Searchbox */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }} />

      {/* FAQPage schema — "People Also Ask" + GEO AI citation boost */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateFAQSchema([
          { question: 'What is CareCalculus?', answer: 'CareCalculus is a free, evidence-based clinical decision support platform providing over 88 medical calculators for ICU, emergency medicine, cardiology, nephrology, and nutrition. All tools are peer-reviewed and aligned with international guidelines including AHA, KDIGO, ESPEN, and Surviving Sepsis.' },
          { question: 'Is CareCalculus free to use?', answer: 'Yes. CareCalculus is completely free for all clinicians. Core calculators including MAP, GCS, qSOFA, MELD, Wells Score, CHA2DS2-VASc, CURB-65, and Creatinine Clearance are accessible without an account.' },
          { question: 'How accurate are the medical calculators on CareCalculus?', answer: 'Every calculator on CareCalculus is validated against landmark peer-reviewed publications and clinical guidelines. Formulas are sourced from original research (e.g., Cockcroft-Gault for creatinine clearance, MDRD and CKD-EPI for GFR) and reviewed by our medical editorial board.' },
          { question: 'Which specialties does CareCalculus cover?', answer: 'CareCalculus covers Emergency & Critical Care, Cardiology, Nephrology, Pulmonology, Gastroenterology, Neurology, Hematology, Pediatrics, Obstetrics, Nutrition, Toxicology, and Pharmacology — offering over 88 validated clinical scoring tools and calculators.' },
          { question: 'Can I use CareCalculus offline?', answer: 'Yes. CareCalculus is a Progressive Web App (PWA) that supports offline use. Once loaded, all core clinical calculators remain fully functional without an internet connection, making them ideal for use in clinical settings with limited connectivity.' },
          { question: 'What is a MAP calculator?', answer: 'A Mean Arterial Pressure (MAP) calculator computes the average arterial pressure during one cardiac cycle. The formula is: MAP = (SBP + 2 × DBP) / 3. Normal MAP is 70–10 mmHg. Values below 65 mmHg indicate inadequate organ perfusion and require immediate clinical action.' },
          { question: 'What is the qSOFA score used for?', answer: 'The quick Sequential Organ Failure Assessment (qSOFA) score is a rapid bedside screening tool for sepsis. It uses three criteria: altered mental status (GCS < 15), respiratory rate ≥ 22/min, and systolic blood pressure ≤ 100 mmHg. A score of ≥ 2 suggests possible sepsis and warrants further evaluation.' }
        ]))
      }} />

      {/* Hero — 2026 Ambient Glassmorphic Clinical Workbench */}
      <section className="relative bg-gradient-to-b from-teal-50/40 via-white to-white dark:from-teal-950/30 dark:via-slate-950 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800 px-6 sm:px-10 py-12 sm:py-16 -mx-4 sm:-mx-6 md:mx-0 md:border md:border-slate-200/80 dark:md:border-slate-800 md:rounded-3xl shadow-sm overflow-hidden">
        {/* Ambient lighting accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-[720px] mx-auto flex flex-col items-center text-center">
          {/* Brand badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 bg-teal-500/10 backdrop-blur-md rounded-full border border-teal-500/20 shadow-xs"
          >
            <Logo className="w-4 h-4" mode="light" />
            <span className="text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">{hero.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-4 text-center"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
            className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2 text-center"
          >{hero.subtitle}</motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
            className="text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed mb-10 w-full max-w-[580px] text-center mx-auto"
          >{hero.desc}</motion.p>

          {/* Search trigger — Glassmorphic */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: 'easeOut' }}
            className="mb-5 w-full max-w-[540px] mx-auto"
            role="search"
          >
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('carecalculus:open-command-palette'))}
              aria-label={`Search clinical calculators — ${searchPlaceholder}`}
              className="w-full flex items-center justify-between px-5 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer text-left rtl:text-right"
              style={{ minHeight: '56px' }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium truncate block text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100">{searchPlaceholder}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shadow-xs">
                <span>Ctrl</span><span>+</span><span>K</span>
              </div>
            </button>
          </motion.div>

          {/* Quick-Launch Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            className="mb-10 w-full"
          >
            <QuickMAPCalculator />
          </motion.div>

          {/* Quick-Launch Clinical Workbench */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38, ease: 'easeOut' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 w-full max-w-[800px] mx-auto px-4"
          >
            {[
              { path: '/map-calculator', name: 'MAP Calc', icon: <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" /> },
              { path: '/wells-score', name: 'Wells Score', icon: <AlertOctagon className="w-6 h-6 text-rose-600 dark:text-rose-400" /> },
              { path: '/synapse-engine', name: 'Guidelines AI', icon: <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> },
              { isSmartPaste: true, name: 'SmartPaste EHR', icon: <ClipboardCopy className="w-6 h-6 text-cyan-600 dark:text-cyan-400" /> }
            ].map((item, idx) => {
              if (item.isSmartPaste) {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      const event = new CustomEvent('carecalculus:open-smart-paste');
                      window.dispatchEvent(event);
                    }}
                    className="group flex flex-col items-center justify-center gap-3 p-4 min-h-[100px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-400 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 text-slate-800 dark:text-slate-100 hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-center tracking-tight">{item.name}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={idx}
                  to={langPath(item.path!)}
                  className="group flex flex-col items-center justify-center gap-3 p-4 min-h-[100px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-400 rounded-3xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 text-slate-800 dark:text-slate-100 hover:-translate-y-1"
                >
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold text-center tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.44 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <SmartPasteModal lang={lang} />
            <button onClick={() => window.dispatchEvent(new CustomEvent('carecalculus:open-command-palette'))} className="btn-primary text-sm cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <Calculator className="w-4 h-4" />
              {cta.primary}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.52 }}
            className="mt-6"
          >
            <Link to={langPath('/for-hospitals')} className="text-xs font-bold text-teal-600 hover:text-teal-700 underline">
              {lang === 'fr' ? 'Déploiement pour Hôpitaux & Cliniques ?' : 'Looking for Hospital Deployment?'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trusted By / Social Proof */}
      <section className="py-8 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by clinicians at leading institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos */}
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><ShieldCheck className="w-6 h-6" /> General Hospital</div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><Award className="w-6 h-6" /> Univ. Medical</div>
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xl"><Stethoscope className="w-6 h-6" /> Critical Care Partners</div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm p-6 sm:p-8">
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
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-2xl font-black tracking-tight text-white">88+</div>
                <div className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-slate-400">calculators</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-2xl font-black tracking-tight text-white">2</div>
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
            <div key={i} className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between text-center shadow-xs transition-all duration-300 hover:shadow-sm hover:border-cyan-500/20 group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/50 to-emerald-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 min-h-[44px] min-w-[44px] rounded-xl bg-slate-50/30 dark:bg-slate-800/30 text-cyan-600 dark:text-cyan-400 mb-2.5 group-hover:scale-105 transition-transform duration-300">
                <StatIcon className="w-5 h-5" />
              </div>
              <div>
                <AnimatedStatValue value={s.value} />
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>


      {/* Specialty Filter Bar */}
      <section className="w-full relative" aria-label="Filter calculators by specialty">
        <div className="flex overflow-x-auto pb-4 pt-2 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 gap-2 snap-x" role="group" aria-label="Specialty filters">
          {SPECIALTIES.map((spec) => {
            const isActive = activeSpecialty === spec.id;
            const label = lang === 'fr' ? spec.fr : spec.en;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveSpecialty(spec.id)}
                aria-pressed={isActive}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${isActive
                    ? 'bg-teal-600 text-white border-teal-600 shadow-[0_4px_12px_rgba(13,148,136,0.3)] scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Filtered Grid — Elevated 2026 Tactile Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCalculators.map((calc) => {
          const CalcIcon = calc.icon;
          const label = lang === 'fr' ? calc.title.fr : calc.title.en;
          const mainCategory = calc.specialties[0] || 'general';
          return (
            <Link
              key={calc.id}
              to={langPath(calc.path)}
              className="relative flex items-center justify-between p-4.5 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/90 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-[0_12px_35px_rgba(13,148,136,0.12)] hover:-translate-y-1 hover:ring-4 hover:ring-teal-500/10 transition-all duration-300 group active:scale-[0.98] overflow-hidden dark:hover:bg-slate-800"
            >
              {/* Subtle top border accent on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 min-h-[44px] min-w-[44px] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-cyan-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-2xs group-hover:shadow-md shrink-0">
                  <CalcIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-teal-950 dark:group-hover:text-teal-300 transition-colors truncate block leading-snug">
                    {label}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-0.5 block truncate">
                    {mainCategory}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </section>



      {/* Clinical Guidelines Directory */}
      <section className="mt-8 pt-8 border-t border-slate-200/60">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
            {lang === 'fr' ? 'Annuaire des protocoles cliniques' : 'Clinical Guidelines Directory'}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
          {CONDITIONS_DB.slice(0, 24).map(cond => (
            <Link
              key={cond.id}
              to={langPath(`/conditions/${cond.id}`)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:underline transition-colors truncate"
            >
              {lang === 'fr' ? cond.nameFr : cond.nameEn}
            </Link>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Link
            to={langPath('/clinical-guide')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            {lang === 'fr' ? 'Voir tout l\'annuaire' : 'View full directory'} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Adsterra Native Banner */}

      {/* Clinical Trust & Evidence strip */}
      <section className="bg-slate-900 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-md">
        <div className="p-3 min-h-[44px] min-w-[44px].5 rounded-xl bg-[#0891B2]/20 border border-[#0891B2]/30 shrink-0">
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
