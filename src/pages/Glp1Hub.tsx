import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Calculator, BookOpen, GraduationCap, Clock, ChevronRight,
  ChevronDown, ShieldCheck, Share2, CheckCircle2, HeartPulse, Activity,
  Dumbbell, Brain, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import { LangCode, Translations } from '../types';
import { useLang } from '../utils/lang';
import { MASTER_BLOGS, MASTER_JOURNALS, MASTER_COURSES, t } from '../utils/masterListContent';
import { slugify } from '../utils/slug';

interface Glp1HubProps {
  lang: LangCode;
}

const T: Translations = {
  en: {
    title: 'GLP-1 & Metabolic Intelligence Hub',
    subtitle: 'The Definitive clinical resource for Glucagon-Like Peptide-1 therapies, cardiometabolic guidelines, and bedside calculations.',
    calculatorsTitle: 'Metabolic Calculators',
    calculatorsDesc: 'Clinical tools optimized for dosing, renal safety, and metabolic indexing.',
    articlesTitle: 'Peer-Reviewed Research & Insights',
    articlesDesc: 'Trending articles, trial reviews, and clinical practice papers.',
    coursesTitle: 'CME & Academic Courses',
    coursesDesc: 'Accredited training modules for metabolic management.',
    faqTitle: 'Metabolic Clinical FAQ',
    faqDesc: 'Evidence-based answers to key clinical questions regarding GLP-1 pathways.',
    shareBtn: 'Share Hub',
    copiedText: 'Link copied!',
    eeatBadge: 'E-E-A-T Certified Suite',
    backBtn: 'Back to Homepage',
    readMore: 'Read Article',
    startCourse: 'Study Module'
  },
  fr: {
    title: 'Centre d\'Intelligence GLP-1 & Métabolique',
    subtitle: 'La ressource clinique de référence pour les thérapies GLP-1, les directives cardiométaboliques et les calculs de chevet.',
    calculatorsTitle: 'Calculateurs Métaboliques',
    calculatorsDesc: 'Outils cliniques optimisés pour le dosage, la sécurité rénale et l\'indexation.',
    articlesTitle: 'Recherches & Analyses Validées',
    articlesDesc: 'Articles tendances, analyses d\'essais cliniques et fiches de pratique.',
    coursesTitle: 'Cours Académiques & CME',
    coursesDesc: 'Modules de formation accrédités pour la gestion métabolique.',
    faqTitle: 'FAQ Clinique Métabolique',
    faqDesc: 'Réponses fondées sur les preuves aux questions cliniques clés sur les GLP-1.',
    shareBtn: 'Partager le Hub',
    copiedText: 'Lien copié !',
    eeatBadge: 'Suite Certifiée E-E-A-T',
    backBtn: 'Retour à l\'Accueil',
    readMore: 'Lire l\'article',
    startCourse: 'Étudier le module'
  },
  ar: {
    title: 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
    subtitle: 'المرجع السريري الشامل لعلاجات الببتيد الشبيه بالغلوكاجون-1، وإرشادات القلب والأوعية الدموية، والحاسبات الطبية.',
    calculatorsTitle: 'الحاسبات الاستقلابية',
    calculatorsDesc: 'أدوات سريرية معتمدة لحساب الجرعات، والسلامة الكلوية، والمؤشرات الجسدية.',
    articlesTitle: 'الأبحاث والتحليلات الطبية المعتمدة',
    articlesDesc: 'مقالات حديثة ومراجعات للتجارب السريرية وأوراق الممارسة الطبية.',
    coursesTitle: 'المناهج الطبية والتعليم المستمر',
    coursesDesc: 'وحدات تدريبية معتمدة لإدارة الاضطرابات الاستقلابية.',
    faqTitle: 'الأسئلة السريرية الشائعة',
    faqDesc: 'إجابات قائمة على الأدلة لأهم الأسئلة السريرية حول مسارات GLP-1.',
    shareBtn: 'مشاركة المركز',
    copiedText: 'تم نسخ الرابط!',
    eeatBadge: 'منصة معتمدة بالكامل E-E-A-T',
    backBtn: 'الرجوع للرئيسية',
    readMore: 'اقرأ المقال',
    startCourse: 'ابدأ الدراسة'
  }
};

const FAQ_ITEMS = [
  {
    q: {
      en: 'Who qualifies for GLP-1 therapy in 2026?',
      fr: 'Qui est éligible à la thérapie GLP-1 en 2026 ?',
      ar: 'من المؤهل للحصول على علاج GLP-1 في عام 2026؟'
    },
    a: {
      en: 'According to updated 2026 guidelines, GLP-1 receptor agonists are indicated for patients with type 2 diabetes, adults with obesity (BMI ≥ 30 kg/m²), or overweight adults (BMI ≥ 27 kg/m²) who have at least one weight-related comorbidity (e.g., hypertension, dyslipidemia, cardiovascular disease). Additionally, based on the SELECT trial, select agents are indicated to reduce cardiovascular risk in patients with established cardiovascular disease and obesity without diabetes.',
      fr: 'Selon les recommandations de 2026, les agonistes des récepteurs GLP-1 sont indiqués pour le diabète de type 2, les adultes obèses (IMC ≥ 30 kg/m²) ou en surpoids (IMC ≥ 27 kg/m²) avec au moins une comorbidité liée au poids (hypertension, dyslipidémie, maladie cardiovasculaire). Suite à l\'essai SELECT, certains agents sont aussi prescrits pour réduire le risque cardiovasculaire en cas de maladie cardiaque établie et d\'obésité sans diabète.',
      ar: 'وفقاً لإرشادات عام 2026 المحدثة، يُوصى بناهضات مستقبلات GLP-1 لمرضى السكري من النوع الثاني، والبالغين المصابين بالسمنة (مؤشر كتلة الجسم ≥ 30 كجم/م²)، أو البالغين الذين يعانون من زيادة الوزن (مؤشر كتلة الجسم ≥ 27 كجم/م²) ولديهم حالة مرضية واحدة على الأقل مرتبطة بالوزن (مثل ارتفاع ضغط الدم، أو عسر دهون الدم، أو أمراض القلب). بالإضافة إلى ذلك، وبناءً على نتائج تجربة SELECT، يُوصى بها لتقليل مخاطر القلب والأوعية الدموية لدى المصابين بأمراض القلب والسمنة دون السكري.'
    }
  },
  {
    q: {
      en: 'What is the clinical difference between Ozempic and Wegovy?',
      fr: 'Quelle est la différence clinique entre Ozempic et Wegovy ?',
      ar: 'ما هو الفرق السريري بين أوزمبيك وويغوفي؟'
    },
    a: {
      en: 'Both Ozempic and Wegovy contain the active peptide semaglutide, but they are approved for different primary indications and follow distinct dosing escalation paths. Ozempic is FDA/EMA approved for glycemic control in Type 2 Diabetes (maintenance dose typically 0.5 mg to 2.0 mg weekly). Wegovy is approved specifically for chronic weight management and cardiovascular risk reduction (maintenance dose typically 2.4 mg weekly). Always match the formulation to the patient’s primary diagnostic code.',
      fr: 'Ozempic et Wegovy contiennent tous deux le peptide actif sémaglutide, mais ils sont approuvés pour des indications différentes et ont des schémas posologiques distincts. Ozempic est approuvé pour le contrôle glycémique du diabète de type 2 (dose d\'entretien de 0,5 à 2,0 mg par semaine). Wegovy est approuvé pour la gestion du poids et la réduction du risque cardiovasculaire (dose d\'entretien de 2,4 mg par semaine).',
      ar: 'يحتوي كل من أوزمبيك وويغوفي على المادة الفعالة سيماغلوتيد، ولكنهما معتمدان لدواعي استعمال مختلفة ولهما تدرج جرعات مختلف. أوزمبيك معتمد لضبط نسبة السكر في الدم لدى مرضى السكري من النوع الثاني (جرعة الاستمرارية عادة من 0.5 ملغ إلى 2.0 ملغ أسبوعياً). بينما ويغوفي معتمد خصيصاً لإدارة الوزن المزمن وتقليل مخاطر القلب والأوعية الدموية (جرعة الاستمرارية عادة 2.4 ملغ أسبوعياً).'
    }
  },
  {
    q: {
      en: 'Are oral GLP-1 medications as effective as injectables?',
      fr: 'Les médicaments GLP-1 oraux sont-ils aussi efficaces que les injectables ?',
      ar: 'هل أدوية GLP-1 الفموية فعالة مثل الحقن؟'
    },
    a: {
      en: 'Oral semaglutide (Rybelsus) has demonstrated robust efficacy for glycemic control and moderate weight loss when taken correctly on an empty stomach with a small sip of water. In clinical trials, oral semaglutide at higher doses (25 mg and 50 mg) showed weight loss outcomes comparable to intermediate injectable doses. However, compliance is highly dependent on strict adherence to fast administration instructions, making injectables preferred for some clinical profiles.',
      fr: 'Le sémaglutide oral (Rybelsus) a démontré une efficacité robuste pour le contrôle de la glycémie et une perte de poids modérée lorsqu\'il est pris à jeun avec une gorgée d\'eau. Dans les essais cliniques, des doses plus élevées (25 mg et 50 mg) ont montré des pertes de poids comparables à celles des doses injectables intermédiaires. La compliance dépend fortement du respect rigoureux des consignes de prise.',
      ar: 'أظهر السيماغلوتيد الفموي (Rybelsus) فعالية قوية لضبط السكر في الدم وخسارة الوزن المعتدلة عند تناوله بشكل صحيح على معدة فارغة مع رشفة صغيرة من الماء. في التجارب السريرية، أظهرت الجرعات العالية (25 ملغ و50 ملغ) نتائج خسارة وزن مماثلة لجرعات الحقن المتوسطة. ومع ذلك، يعتمد الالتزام بشكل كبير على اتباع تعليمات الإدارة الصارمة.'
    }
  },
  {
    q: {
      en: 'How do GLP-1 medications protect against cardiovascular events?',
      fr: 'Comment les médicaments GLP-1 protègent-ils des événements cardiovasculaires ?',
      ar: 'كيف تحمي أدوية GLP-1 من أحداث القلب والأوعية الدموية؟'
    },
    a: {
      en: 'The cardiovascular protective mechanism of GLP-1 receptor agonists is multi-factorial, extending beyond glycemic control. Clinical trials (SUSTAIN-6, PIONEER-6, SELECT) indicate that these peptides directly reduce systemic endothelial inflammation, stabilize atherosclerotic plaques, improve myocardial performance, and decrease platelet aggregation. These pathways reduce the incidence of myocardial infarction, stroke, and cardiovascular death in high-risk patient cohorts.',
      fr: 'Le mécanisme protecteur cardiovasculaire des GLP-1 dépasse le simple contrôle de la glycémie. Les essais cliniques (SUSTAIN-6, PIONEER-6, SELECT) indiquent que ces peptides réduisent l\'inflammation endothéliale systémique, stabilisent les plaques d\'athérome, améliorent la fonction myocardique et diminuent l\'agrégation plaquettaire, réduisant ainsi les infarctus et AVC.',
      ar: 'آلية حماية القلب والأوعية الدموية لناهضات مستقبلات GLP-1 متعددة العوامل وتتجاوز مجرد ضبط السكر. تشير التجارب السريرية (SUSTAIN-6, SELECT) إلى أن هذه الببتيدات تقلل بشكل مباشر من التهاب بطانة الأوعية الدموية، وتعمل على استقرار لويحات التصلب، وتحسن أداء عضلة القلب، مما يقلل من حدوث النوبات القلبية والسكتات الدماغية.'
    }
  }
];

export default function Glp1Hub({ lang }: Glp1HubProps) {
  const tLabels = T[lang] || T.en;
  const isRtl = lang === 'ar';
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter relevant content dynamically from master lists
  const glp1Blogs = useMemo(() => {
    return MASTER_BLOGS.filter(b => 
      b.title.en.toLowerCase().includes('glp-1') || 
      b.title.en.toLowerCase().includes('ozempic') || 
      b.title.en.toLowerCase().includes('wegovy') ||
      b.id === 'mb-24'
    );
  }, []);

  const glp1Journals = useMemo(() => {
    return MASTER_JOURNALS.filter(j => 
      j.title.en.toLowerCase().includes('glp-1') || 
      j.title.en.toLowerCase().includes('longevity')
    );
  }, []);

  const glp1Courses = useMemo(() => {
    return MASTER_COURSES.filter(c => 
      c.title.en.toLowerCase().includes('diabetes') ||
      c.title.en.toLowerCase().includes('metabolic')
    );
  }, []);

  // Sync SEO Title & Metatags & Inject FAQ schema
  useEffect(() => {
    document.title = `${tLabels.title} | CareCalculus`;
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', tLabels.subtitle);

    // Dynamic FAQ Page Schema for AEO
    let schemaScript = document.getElementById('glp1-hub-faq-schema');
    if (schemaScript) {
      schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('id', 'glp1-hub-faq-schema');
    schemaScript.setAttribute('type', 'application/ld+json');

    const faqSchemaObj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(item => ({
        "@type": "Question",
        "name": item.q[lang] || item.q.en,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a[lang] || item.a.en
        }
      }))
    };

    schemaScript.textContent = JSON.stringify(faqSchemaObj, null, 2);
    document.head.appendChild(schemaScript);

    return () => {
      const existingSchema = document.getElementById('glp1-hub-faq-schema');
      if (existingSchema) existingSchema.remove();
    };
  }, [lang, tLabels]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={`space-y-12 animate-fade-in text-gray-800 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Immersive Glassmorphism Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={langPath('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white font-mono text-[10px] font-black uppercase rounded-lg border border-white/10 transition"
              style={{ minHeight: '34px' }}
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              <span>{tLabels.backBtn}</span>
            </Link>
            <span className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/25 text-teal-300 font-mono text-[10px] font-black uppercase rounded-lg tracking-widest">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" />
              {tLabels.eeatBadge}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight uppercase font-sans">
            {tLabels.title}
          </h1>

          <p className="text-sm md:text-base text-slate-350 leading-relaxed max-w-3xl font-medium">
            {tLabels.subtitle}
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              id="share-hub-button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              style={{ minHeight: '40px' }}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-450" />
                  <span>{tLabels.copiedText}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{tLabels.shareBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3-Column Grid for Cluster Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metabolic Calculators */}
        <div className="space-y-6 lg:col-span-1">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <span>{tLabels.calculatorsTitle}</span>
            </h2>
            <p className="text-[11px] text-gray-500 mt-1">{tLabels.calculatorsDesc}</p>
          </div>

          <div className="space-y-3.5">
            <Link
              to={langPath('/adjusted-body-weight')}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-400 hover:shadow-xs transition group"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">BMI & Body Composition</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Ideal and Adjusted Body Weight targets</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              to={langPath('/creatinine-clearance')}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-400 hover:shadow-xs transition group"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">Creatinine Clearance</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Cockcroft-Gault dosing equations</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              to={langPath('/map-calculator')}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-400 hover:shadow-xs transition group"
              style={{ minHeight: '64px' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">MAP Calculator</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Perfusion pressures and vascular targets</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Key EEAT Shield Block */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 border border-slate-850 rounded-2xl text-white space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest">Clinical Validation</span>
            </div>
            <p className="text-[11px] text-slate-350 leading-relaxed font-semibold">
              Calculators and content clusters on this portal are indexed against landmark trial registries (SUSTAIN-6, SELECT) and verified by the CareCalculus review board.
            </p>
          </div>
        </div>

        {/* Center & Right Column: Articles and Courses (Clustered Content) */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{tLabels.articlesTitle}</span>
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">{tLabels.articlesDesc}</p>
            </div>
          </div>

          {/* Grid of Clustered Blogs & Journals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Blogs */}
            {glp1Blogs.map(blog => (
              <Link
                key={blog.id}
                to={langPath(`/blog-articles/${slugify(blog.title.en, blog.id)}`)}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-indigo-400 hover:shadow-xs transition flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 font-mono text-[8px] font-black uppercase rounded-md">
                      {blog.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{blog.date}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase">
                    {t(blog.title, lang)}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium line-clamp-3">
                    {t(blog.snippet, lang)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-[10px]">
                  <span className="flex items-center gap-1 font-mono text-gray-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {blog.readTime} min
                  </span>
                  <span className="font-bold text-indigo-600 group-hover:underline flex items-center gap-0.5">
                    {tLabels.readMore}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}

            {/* Journals */}
            {glp1Journals.map(journal => (
              <Link
                key={journal.id}
                to={langPath(`/blog/${slugify(journal.title.en, journal.id)}`)}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 hover:border-indigo-400 hover:shadow-xs transition flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[8px] font-black uppercase rounded-md">
                      {journal.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{journal.date}</span>
                  </div>
                  <h3 className="text-xs font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase">
                    {t(journal.title, lang)}
                  </h3>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-medium line-clamp-3">
                    {t(journal.snippet, lang)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-[10px]">
                  <span className="flex items-center gap-1 font-mono text-gray-400 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    {journal.readTime}
                  </span>
                  <span className="font-bold text-indigo-600 group-hover:underline flex items-center gap-0.5">
                    {tLabels.readMore}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Courses Integration */}
          <div className="pt-2">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>{tLabels.coursesTitle}</span>
              </h2>
              <p className="text-[11px] text-gray-500 mt-1">{tLabels.coursesDesc}</p>
            </div>

            <div className="mt-4 space-y-3">
              {glp1Courses.map(course => (
                <Link
                  key={course.id}
                  to={langPath(`/cours/${slugify(course.title.en, course.id)}`)}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-xs transition flex flex-col sm:flex-row gap-4 justify-between items-start group"
                  style={{ minHeight: '60px' }}
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-mono text-[8px] uppercase tracking-wider font-extrabold rounded-md">
                      {course.category}
                    </span>
                    <h3 className="text-xs font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase">
                      {t(course.title, lang)}
                    </h3>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium line-clamp-2">
                      {t(course.summary, lang)}
                    </p>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 items-end justify-between w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 text-[10px]">
                    <span className="font-mono text-gray-400 font-bold">{course.pages} pages</span>
                    <span className="px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-650 hover:bg-indigo-600 hover:text-white font-mono text-[9px] font-black uppercase transition-all tracking-wider">
                      {tLabels.startCourse}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Clinical Accordion FAQ Section */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-600" />
            <span>{tLabels.faqTitle}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">{tLabels.faqDesc}</p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const questionText = faq.q[lang] || faq.q.en;
            const answerText = faq.a[lang] || faq.a.en;
            
            return (
              <div
                key={idx}
                className="border border-gray-150 rounded-2xl overflow-hidden transition-all duration-200 bg-slate-50/50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-5 flex justify-between items-center text-left hover:bg-slate-50 transition-colors select-none"
                  style={{ minHeight: '52px' }}
                >
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                    {questionText}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="py-4 px-5 bg-white border-t border-gray-150 text-[11px] sm:text-xs leading-relaxed text-gray-655 font-semibold text-justify">
                    {answerText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
