import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Calculator, BookOpen, GraduationCap, Clock, ChevronRight,
  ChevronDown, ShieldCheck, Share2, CheckCircle2, HeartPulse, Activity,
  Dumbbell, Brain, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import { LangCode, Translations } from '../types';
import { useLang } from '../utils/lang';

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
  }
};

const FAQ_ITEMS = [
  {
    q: {
      en: 'Who qualifies for GLP-1 therapy in 2026?',
      fr: 'Qui est éligible à la thérapie GLP-1 en 2026 ?'
    },
    a: {
      en: 'According to updated 2026 guidelines, GLP-1 receptor agonists are indicated for patients with type 2 diabetes, adults with obesity (BMI ≥ 30 kg/m²), or overweight adults (BMI ≥ 27 kg/m²) who have at least one weight-related comorbidity (e.g., hypertension, dyslipidemia, cardiovascular disease). Additionally, based on the SELECT trial, select agents are indicated to reduce cardiovascular risk in patients with established cardiovascular disease and obesity without diabetes.',
      fr: 'Selon les recommandations de 2026, les agonistes des récepteurs GLP-1 sont indiqués pour le diabète de type 2, les adultes obèses (IMC ≥ 30 kg/m²) ou en surpoids (IMC ≥ 27 kg/m²) avec au moins une comorbidité liée au poids (hypertension, dyslipidémie, maladie cardiovasculaire). Suite à l\'essai SELECT, certains agents sont aussi prescrits pour réduire le risque cardiovasculaire en cas de maladie cardiaque établie et d\'obésité sans diabète.'
    }
  },
  {
    q: {
      en: 'What is the clinical difference between Ozempic and Wegovy?',
      fr: 'Quelle est la différence clinique entre Ozempic et Wegovy ?'
    },
    a: {
      en: 'Both Ozempic and Wegovy contain the active peptide semaglutide, but they are approved for different primary indications and follow distinct dosing escalation paths. Ozempic is FDA/EMA approved for glycemic control in Type 2 Diabetes (maintenance dose typically 0.5 mg to 2.0 mg weekly). Wegovy is approved specifically for chronic weight management and cardiovascular risk reduction (maintenance dose typically 2.4 mg weekly). Always match the formulation to the patient’s primary diagnostic code.',
      fr: 'Ozempic et Wegovy contiennent tous deux le peptide actif sémaglutide, mais ils sont approuvés pour des indications différentes et ont des schémas posologiques distincts. Ozempic est approuvé pour le contrôle glycémique du diabète de type 2 (dose d\'entretien de 0,5 à 2,0 mg par semaine). Wegovy est approuvé pour la gestion du poids et la réduction du risque cardiovasculaire (dose d\'entretien de 2,4 mg par semaine).'
    }
  },
  {
    q: {
      en: 'Are oral GLP-1 medications as effective as injectables?',
      fr: 'Les médicaments GLP-1 oraux sont-ils aussi efficaces que les injectables ?'
    },
    a: {
      en: 'Oral semaglutide (Rybelsus) has demonstrated robust efficacy for glycemic control and moderate weight loss when taken correctly on an empty stomach with a small sip of water. In clinical trials, oral semaglutide at higher doses (25 mg and 50 mg) showed weight loss outcomes comparable to intermediate injectable doses. However, compliance is highly dependent on strict adherence to fast administration instructions, making injectables preferred for some clinical profiles.',
      fr: 'Le sémaglutide oral (Rybelsus) a démontré une efficacité robuste pour le contrôle de la glycémie et une perte de poids modérée lorsqu\'il est pris à jeun avec une gorgée d\'eau. Dans les essais cliniques, des doses plus élevées (25 mg et 50 mg) ont montré des pertes de poids comparables à celles des doses injectables intermédiaires. La compliance dépend fortement du respect rigoureux des consignes de prise.'
    }
  },
  {
    q: {
      en: 'How do GLP-1 medications protect against cardiovascular events?',
      fr: 'Comment les médicaments GLP-1 protègent-ils des événements cardiovasculaires ?'
    },
    a: {
      en: 'The cardiovascular protective mechanism of GLP-1 receptor agonists is multi-factorial, extending beyond glycemic control. Clinical trials (SUSTAIN-6, PIONEER-6, SELECT) indicate that these peptides directly reduce systemic endothelial inflammation, stabilize atherosclerotic plaques, improve myocardial performance, and decrease platelet aggregation. These pathways reduce the incidence of myocardial infarction, stroke, and cardiovascular death in high-risk patient cohorts.',
      fr: 'Le mécanisme protecteur cardiovasculaire des GLP-1 dépasse le simple contrôle de la glycémie. Les essais cliniques (SUSTAIN-6, PIONEER-6, SELECT) indiquent que ces peptides réduisent l\'inflammation endothéliale systémique, stabilisent les plaques d\'athérome, améliorent la fonction myocardique et diminuent l\'agrégation plaquettaire, réduisant ainsi les infarctus et AVC.'
    }
  }
];

export default function Glp1Hub({ lang }: Glp1HubProps) {
  const tLabels = T[lang] || T.en;
  const isRtl = false;
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);



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
