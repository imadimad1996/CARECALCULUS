// Centralized SEO/GEO head builder for CareCalculus.
//
// This is the single source of truth for per-route <title>, meta, canonical,
// hreflang, Open Graph/Twitter cards, and JSON-LD. It is PURE (no DOM access)
// so it can run in three places:
//   1. Client runtime  — App.tsx useEffect injects/updates these tags.
//   2. Build-time prerender — entry-prerender.tsx bakes them into static HTML
//      so crawlers and AI engines (GPTBot, ClaudeBot, PerplexityBot) get a
//      complete document on the very first fetch, with no JS required.
//
// Keep the route metadata maps here in lockstep with navItems in App.tsx.

import { LangCode } from '../types';
import { slugify } from './slug';
import { MASTER_BLOGS, MASTER_JOURNALS, MASTER_COURSES, MASTER_PRESENTATIONS } from './masterListContent';
import { ORIGINAL_CURATED_SEED_POSTS } from '../pages/MedicalBlog';
import { ORIGINAL_BLOG_SEED } from '../pages/Blog';
import { DEFAULT_COURSES } from '../pages/Courses';
import { DEFAULT_SUBJECTS } from '../pages/Presentations';
import { FMP_MODULES, FMP_MODULE_BY_SLUG } from './fmpModules';
import { ISPITS_MODULES, ISPITS_MODULE_BY_SLUG } from './ispitsModules';

export const ORIGIN = 'https://carecalculus.com';

const OG_IMAGE = 'https://carecalculus.com/og-image.png';

export const nameEnMap: Record<string, string> = {
  '/map-calculator': 'Mean Arterial Pressure (MAP) Calculator',
  '/bmi-calculator': 'Body Mass Index (BMI) Calculator',
  '/glasgow-coma-scale': 'Glasgow Coma Scale (GCS) Calculator',
  '/drip-rate-calculator': 'IV Drip Rate Calculator',
  '/creatinine-clearance': 'Creatinine Clearance Calculator',
  '/wells-score': 'Wells Score for DVT/PE Calculator',
  '/medical-conversions': 'Medical Unit Conversions Converter',
  '/corrected-calcium': 'Corrected Calcium Calculator',
  '/qsofa-score': 'qSOFA Score Sepsis Risk Calculator',
  '/curb65-score': 'CURB-65 Pneumonia Severity Calculator',
  '/cha2ds2-vasc': 'CHA2DS2-VASc Stroke Risk Calculator',
  '/phq9-score': 'PHQ-9 Depression Screener',
  '/meld-score': 'MELD Score End-Stage Liver Disease',
  '/sirs-criteria': 'SIRS Criteria Sepsis Calculator',
  '/pf-ratio': 'P/F Ratio Lung Injury Calculator',
  '/tidal-volume': 'Tidal Volume ARDS Calculator',
  '/anc-calculator': 'Absolute Neutrophil Count (ANC) Calculator',
  '/adjusted-body-weight': 'Ideal & Adjusted Body Weight Calculator',
  '/steroid-conversion': 'Corticosteroids Equivalent Dosage Converter',
  '/blog': 'Evidence-Based Medical Journals & Peer Reviews',
  '/blog-articles': 'CareCalculus Blog — Clinical Tips, News & Editorials',
  '/nutrition-tdee': 'TDEE & BMR Nutrition Calculator (Mifflin & Harris-Benedict)',
  '/nutrition-must': 'MUST Score Malnutrition Screening Tool',
  '/nutrition-nrs2002': 'NRS-2002 Nutritional Risk Screening Calculator',
  '/presentations': 'Advanced Medical Presentations Library (PPTX)',
  '/cours': 'Accredited Clinical Course Syllabus (PDF)',
  '/about': 'About CareCalculus — Mission, Sources & Team',
  '/disclaimer': 'Medical Disclaimer — CareCalculus',
  '/privacy': 'Privacy Policy — CareCalculus',
  '/terms': 'Terms of Use — CareCalculus',
  '/glp-1-hub': 'GLP-1 & Metabolic Health Resource Hub',
  '/hub-glp1': 'GLP-1 & Metabolic Health Resource Hub',
  '/مركز-glp1': 'GLP-1 & Metabolic Health Resource Hub',
  '/%D9%85%D8%B1%D9%83%D8%B2-glp1': 'GLP-1 & Metabolic Health Resource Hub',
  '/apgar-score': 'APGAR Score Calculator',
  '/sofa-score': 'SOFA Score ICU Calculator',
  '/child-pugh-score': 'Child-Pugh Score Calculator',
  '/anion-gap': 'Anion Gap Calculator',
  '/aa-gradient': 'Alveolar-Arterial (A-a) Gradient Calculator',
  '/fmp-medecine': 'FMPC Medicine Modules & PDF Handbooks',
  '/ispits': 'ISPITS Paramedical Academy Course Library & PDFs',
};

const nameFrMap: Record<string, string> = {
  '/map-calculator': 'Calculateur PAM - Pression Arterielle Moyenne',
  '/bmi-calculator': 'Calculateur IMC - Indice de Masse Corporelle',
  '/glasgow-coma-scale': 'Echelle de Glasgow - Calculateur Score GCS',
  '/drip-rate-calculator': 'Calcul Debit Perfusion et Gouttes par Minute',
  '/creatinine-clearance': 'Clairance de la Creatinine (Cockcroft-Gault)',
  '/wells-score': 'Score de Wells pour Phlebite et Embolie',
  '/medical-conversions': "Conversions d'Unites Medicales (Glycemie, etc)",
  '/corrected-calcium': 'Calcul Calcium Corrige par Albuminemie',
  '/qsofa-score': 'Score qSOFA Depistage Sepsis Rapide',
  '/curb65-score': 'Score CURB-65 Severite de la Pneumonie',
  '/cha2ds2-vasc': 'Score CHA2DS2-VASc Evaluation Risque FA',
  '/phq9-score': 'Score PHQ-9 Evaluation de la Depression',
  '/meld-score': 'Score MELD Pronostic Insuffisance Hepatique',
  '/sirs-criteria': 'Criteres SIRS Syndrome Reponse Inflammatoire',
  '/pf-ratio': 'Rapport PaO2/FiO2 (Rapport P/F)',
  '/tidal-volume': 'Calcul du Volume Courant (Tidal)',
  '/anc-calculator': 'Nombre Absolu de Neutrophiles (NAN)',
  '/adjusted-body-weight': 'Calcul Poids Ideal et Poids Ajuste',
  '/steroid-conversion': 'Conversion de Corticoides Equivalents',
  '/blog': "Journaux Medicaux Bases sur l'Evidence (2K+)",
  '/blog-articles': 'Blog CareCalculus - Astuces Cliniques & Actualites',
  '/nutrition-tdee': 'Calculateur TDEE & BMR (Mifflin & Harris-Benedict)',
  '/nutrition-must': 'Score MUST (Outil de Dépistage de la Dénutrition)',
  '/nutrition-nrs2002': 'Calculateur NRS-2002 (Risque Nutritionnel)',
  '/presentations': 'Bibliotheque de Presentations Medicales (PPTX)',
  '/cours': 'Referentiel des Cours Academiques (PDF)',
  '/about': 'A propos de CareCalculus - Mission et Sources',
  '/disclaimer': 'Avertissement medical - CareCalculus',
  '/privacy': 'Politique de confidentialite - CareCalculus',
  '/terms': "Conditions d'utilisation - CareCalculus",
  '/glp-1-hub': "Centre d'Intelligence GLP-1 & Métabolique",
  '/hub-glp1': "Centre d'Intelligence GLP-1 & Métabolique",
  '/مركز-glp1': "Centre d'Intelligence GLP-1 & Métabolique",
  '/%D9%85%D8%B1%D9%83%D8%B2-glp1': "Centre d'Intelligence GLP-1 & Métabolique",
  '/apgar-score': 'Calculateur Score APGAR (Nouveau-né)',
  '/sofa-score': 'Calculateur Score SOFA (Réanimation)',
  '/child-pugh-score': 'Calculateur Score Child-Pugh (Cirrhose)',
  '/anion-gap': 'Calculateur Trou Anionique (Acidose)',
  '/aa-gradient': 'Calculateur Gradient Alvéolo-Artériel (A-a)',
  '/fmp-medecine': 'Modules Médecine FMPC & Livres PDF',
  '/ispits': 'Académie Paramédicale ISPITS — Cours & Modules PDF',
};

const nameArMap: Record<string, string> = {
  '/map-calculator': 'حساب متوسط الضغط الشرياني (MAP)',
  '/bmi-calculator': 'حساب مؤشر كتلة الجسم (BMI)',
  '/glasgow-coma-scale': 'مقياس غلاسكو للغيبوبة (GCS)',
  '/drip-rate-calculator': 'حساب معدل التنقيط الوريدي الوريد',
  '/creatinine-clearance': 'حساب تصفية الكرياتينين والكلية',
  '/wells-score': 'نقاط ويلز لتشخيص الجلطة والانسداد الرئوي',
  '/medical-conversions': 'تحويل الوحدات الطبية والقياسات المخبرية',
  '/corrected-calcium': 'حساب الكالسيوم المصحح ببروتين الألبومين',
  '/qsofa-score': 'نقاط qSOFA لتقييم قصور الأعضاء وتسمم الدم',
  '/curb65-score': 'مقياس CURB-65 لتقييم شدة الالتهاب الرئوي',
  '/cha2ds2-vasc': 'مقياس CHA2DS2-VASc لتقييم سكتة الرجفان الأذيني',
  '/phq9-score': 'مقياس PHQ-9 لتشخيص مستويات الاكتئاب',
  '/meld-score': 'نقاط MELD لتليف وفشل الكبد الحاد',
  '/sirs-criteria': 'معايير SIRS لمتلازمة الاستجابة الالتهابية المفرطة',
  '/pf-ratio': 'حساب نسبة PaO2 إلى FiO2 للرائتين',
  '/tidal-volume': 'حساب حجم الهواء المدخل للرئتين',
  '/anc-calculator': 'حساب عدد الخلايا المتعادلة المطلق للدم',
  '/adjusted-body-weight': 'حساب الوزن المثالي والوزن المعدل للمريض',
  '/steroid-conversion': 'تحويل جرعات الكورتيكوستيرويدات والستيرويد',
  '/blog': 'المجلات الطبية والمكتبة العلمية المعتمدة',
  '/blog-articles': 'مدونة كير كالكولوس — نصائح وأخبار سريرية',
  '/nutrition-tdee': 'حساب معدل الأيض الأساسي TDEE و BMR (تغذية)',
  '/nutrition-must': 'أداة MUST لتقييم سوء التغذية',
  '/nutrition-nrs2002': 'أداة NRS-2002 لتقييم المخاطر الغذائية للمستشفيات',
  '/presentations': 'مكتبة العروض التقديمية الطبية (PPTX)',
  '/cours': 'مناهج المحاضرات والدروس السريرية (PDF)',
  '/about': 'عن منصة كير كالكولوس — المهمة والمصادر',
  '/disclaimer': 'إخلاء المسؤولية الطبية — كير كالكولوس',
  '/privacy': 'سياسة الخصوصية — كير كالكولوس',
  '/terms': 'شروط الاستخدام — كير كالكولوس',
  '/glp-1-hub': 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
  '/hub-glp1': 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
  '/مركز-glp1': 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
  '/%D9%85%D8%B1%D9%83%D8%B2-glp1': 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
  '/apgar-score': 'حساب مقياس أبغار لحديثي الولادة (APGAR)',
  '/sofa-score': 'حساب مقياس تقييم فشل الأعضاء المتتابع (SOFA)',
  '/child-pugh-score': 'مؤشر تشايلد بيو لشدة تليف الكبد (Child-Pugh)',
  '/anion-gap': 'حساب الفجوة الأنيونية وحموضة الدم (Anion Gap)',
  '/aa-gradient': 'حساب الفرق الألوفي-الشرياني للأكسجين (A-a Gradient)',
  '/fmp-medecine': 'حقيبة محاضرات كلية الطب والصيدلة (FMPC)',
  '/ispits': 'أكاديمية العلوم التمريضية وتقنيات الصحة ISPITS',
};

export interface RouteMeta {
  title: string;
  desc: string;
  keywords: string;
}

export function getLocalizedMeta(path: string, lang: LangCode): RouteMeta {
  // 1. Journal Articles (/blog/:slug)
  if (path.startsWith('/blog/')) {
    const slug = path.replace(/^\/blog\//, '');
    const combinedJournals = [
      ...ORIGINAL_CURATED_SEED_POSTS,
      ...MASTER_JOURNALS.map(mj => ({
        id: mj.id,
        title: mj.title.en,
        snippet: mj.snippet.en,
        multilingualTitle: { fr: mj.title.fr, ar: mj.title.ar },
        multilingualSnippet: { fr: mj.snippet.fr, ar: mj.snippet.ar },
        category: mj.category,
      }))
    ];
    const post = combinedJournals.find(p => slugify(p.title, p.id) === slug || p.id.toLowerCase() === slug.toLowerCase()) as any;
    if (post) {
      const titleText = (lang === 'fr' && post.multilingualTitle?.fr)
        ? post.multilingualTitle.fr
        : (lang === 'ar' && post.multilingualTitle?.ar)
        ? post.multilingualTitle.ar
        : post.title;
      const snippetText = (lang === 'fr' && post.multilingualSnippet?.fr)
        ? post.multilingualSnippet.fr
        : (lang === 'ar' && post.multilingualSnippet?.ar)
        ? post.multilingualSnippet.ar
        : post.snippet;
      return {
        title: `${titleText} | CareCalculus Scientific Journal`,
        desc: snippetText,
        keywords: `${post.category.toLowerCase()}, peer-reviewed medical study, pubmed clinical, clinical evidence`
      };
    }
  }

  // 2. Blog Articles (/blog-articles/:slug)
  if (path.startsWith('/blog-articles/')) {
    const slug = path.replace(/^\/blog-articles\//, '');
    const combinedBlogs = [
      ...ORIGINAL_BLOG_SEED,
      ...MASTER_BLOGS.map(mb => ({
        id: mb.id,
        title: mb.title.en,
        titleFr: mb.title.fr,
        titleAr: mb.title.ar,
        snippet: mb.snippet.en,
        snippetFr: mb.snippet.fr,
        snippetAr: mb.snippet.ar,
        category: mb.category,
      }))
    ];
    const post = combinedBlogs.find(p => slugify(p.title, p.id) === slug || p.id.toLowerCase() === slug.toLowerCase());
    if (post) {
      const titleText = lang === 'fr' ? post.titleFr : lang === 'ar' ? post.titleAr : post.title;
      const snippetText = lang === 'fr' ? post.snippetFr : lang === 'ar' ? post.snippetAr : post.snippet;
      return {
        title: `${titleText} | CareCalculus Blog`,
        desc: snippetText,
        keywords: `${post.category.toLowerCase()}, clinical tips, medical blog, health advice`
      };
    }
  }

  // 3. Courses (/cours/:slug)
  if (path.startsWith('/cours/')) {
    const slug = path.replace(/^\/cours\//, '');
    const combinedCourses = [
      ...DEFAULT_COURSES,
      ...MASTER_COURSES.map(mc => ({
        id: mc.id,
        title: mc.title,
        summary: mc.summary,
        category: mc.category,
      }))
    ];
    const post = combinedCourses.find(p => {
      const titleEn = typeof p.title === 'string' ? p.title : p.title.en;
      return slugify(titleEn, p.id) === slug || p.id.toLowerCase() === slug.toLowerCase();
    });
    if (post) {
      const titleText = typeof post.title === 'string'
        ? post.title
        : (lang === 'fr' ? post.title.fr : lang === 'ar' ? post.title.ar : post.title.en);
      const snippetText = typeof post.summary === 'string'
        ? post.summary
        : (lang === 'fr' ? post.summary.fr : lang === 'ar' ? post.summary.ar : post.summary.en);
      const categoryText = typeof post.category === 'string'
        ? post.category
        : (lang === 'fr' ? post.category : lang === 'ar' ? post.category : post.category);
      return {
        title: `${titleText} | CareCalculus Course`,
        desc: snippetText,
        keywords: `${categoryText.toLowerCase()}, medical syllabus, pdf tutorial, clinical course`
      };
    }
  }

  // 4. Presentations (/presentations/:slug)
  if (path.startsWith('/presentations/')) {
    const slug = path.replace(/^\/presentations\//, '');
    const combinedDecks = [
      ...DEFAULT_SUBJECTS,
      ...MASTER_PRESENTATIONS.map(mp => ({
        id: mp.id,
        title: mp.title,
        description: mp.description,
        category: mp.category,
      }))
    ];
    const post = combinedDecks.find(p => {
      const titleEn = typeof p.title === 'string' ? p.title : p.title.en;
      return slugify(titleEn, p.id) === slug || p.id.toLowerCase() === slug.toLowerCase();
    });
    if (post) {
      const titleText = typeof post.title === 'string'
        ? post.title
        : (lang === 'fr' ? post.title.fr : lang === 'ar' ? post.title.ar : post.title.en);
      const snippetText = typeof post.description === 'string'
        ? post.description
        : (lang === 'fr' ? post.description.fr : lang === 'ar' ? post.description.ar : post.description.en);
      const categoryText = typeof post.category === 'string'
        ? post.category
        : (lang === 'fr' ? post.category : lang === 'ar' ? post.category : post.category);
      return {
        title: `${titleText} | CareCalculus Presentation`,
        desc: snippetText,
        keywords: `${categoryText.toLowerCase()}, pptx deck, slides, medical study guide`
      };
    }
  }

  // 5. FMPC Modules (/fmp-medecine/:slug)
  if (path.startsWith('/fmp-medecine/')) {
    const slug = path.replace(/^\/fmp-medecine\//, '');
    const mod = FMP_MODULE_BY_SLUG[slug];
    if (mod) {
      if (lang === 'fr') {
        return {
          title: `${mod.name} — Cours FMPC PDF | CareCalculus`,
          desc: `${mod.description}. Consultez et téléchargez le cours complet de ${mod.name} (${mod.year}) de la Faculté de Médecine et de Pharmacie de Casablanca.`,
          keywords: `${mod.name.toLowerCase()}, cours médecine FMPC, fmp casablanca, ${mod.year}, PDF médecine maroc`,
        };
      } else if (lang === 'ar') {
        return {
          title: `${mod.name} — محاضرات كلية الطب | CareCalculus`,
          desc: `${mod.description}. تصفح وحمل منهج ${mod.name} (${mod.year}) الخاص بكلية الطب والصيدلة بالدار البيضاء.`,
          keywords: `${mod.name.toLowerCase()}, محاضرات طبية, كلية الطب بالدار البيضاء, الدار البيضاء, ${mod.year}, PDF`,
        };
      } else {
        return {
          title: `${mod.name} — FMPC Medical Course | CareCalculus`,
          desc: `${mod.description}. Review and download the official ${mod.name} module (${mod.year}) from the Faculty of Medicine & Pharmacy of Casablanca.`,
          keywords: `${mod.name.toLowerCase()}, fmpc casablanca, medical modules, ${mod.year}, medicine pdf`,
        };
      }
    }
  }

  // 6. ISPITS Modules (/ispits/:slug)
  if (path.startsWith('/ispits/')) {
    const slug = path.replace(/^\/ispits\//, '');
    const mod = ISPITS_MODULE_BY_SLUG[slug];
    if (mod) {
      if (lang === 'fr') {
        return {
          title: `${mod.name} — Cours ISPITS PDF | CareCalculus`,
          desc: `${mod.description}. Consultez et téléchargez le cours complet de ${mod.name} (Semestre ${mod.semester}) pour les Instituts Supérieurs des Professions Infirmières et Techniques de Santé (ISPITS).`,
          keywords: `${mod.name.toLowerCase()}, cours infirmiers ispits, ispits maroc, module ${mod.semester}, PDF paramédical maroc`,
        };
      } else if (lang === 'ar') {
        return {
          title: `${mod.name} — محاضرات معاهد التمريض ISPITS | CareCalculus`,
          desc: `${mod.description}. تصفح وحمل منهج ${mod.name} (الفصل الدراسي ${mod.semester}) الخاص بمعاهد التمريض وتقنيات الصحة بالمغرب ISPITS.`,
          keywords: `${mod.name.toLowerCase()}, محاضرات التمريض, معاهد التمريض وتقنيات الصحة, ISPITS, الفصل ${mod.semester}, PDF`,
        };
      } else {
        return {
          title: `${mod.name} — ISPITS Nursing Module | CareCalculus`,
          desc: `${mod.description}. Review and download the official ${mod.name} course (Semester ${mod.semester}) from the Higher Institute of Nursing Professions and Health Techniques (ISPITS) Morocco.`,
          keywords: `${mod.name.toLowerCase()}, ispits nursing, health technology modules, semester ${mod.semester}, paramedic pdf`,
        };
      }
    }
  }

  const nameEn = nameEnMap[path] || 'Multilingual Care Calculators';
  const nameFr = nameFrMap[path] || 'Calculateur Médical Gratuit';
  const nameAr = nameArMap[path] || 'الحاسبة الطبية الشاملة المعتمدة';

  if (lang === 'fr') {
    return {
      title: `${nameFr} | CareCalculus`,
      desc: `Utilisez notre outil gratuit "${nameFr}" conçu pour aider les praticiens hospitaliers. Formule clinique validée scientifiquement avec références PubMed et calcul instantané.`,
      keywords: `${nameFr.toLowerCase().replace(/[^a-zA-Z\s]/g, '')}, calculateur medical, guide, medecine`,
    };
  } else if (lang === 'ar') {
    return {
      title: `${nameAr} | CareCalculus`,
      desc: `استخدم الأداة الطبية المجانية وتطبيق "${nameAr}" الموضح بالمعادلات العلمية ومراجع PubMed. حساب سريري دقيق وموثوق للأطباء ومختلف الممارسين.`,
      keywords: `${nameAr}, حاسبة طبية, أدوات الأطباء, معادلة سريرية`,
    };
  }
  return {
    title: `${nameEn} | CareCalculus`,
    desc: `Access our free "${nameEn}" constructed strictly for hospital clinicians. Highly accurate clinical formula complete with official scientific references.`,
    keywords: `${nameEn.toLowerCase().replace(/[^a-zA-Z\s]/g, '')}, clinical calculator, medical metrics, care calculus`,
  };
}

const medicalSchemaDb: Record<string, any> = {
  '/map-calculator': {
    '@type': 'MedicalWebPage',
    name: 'Mean Arterial Pressure (MAP) Calculator',
    aspect: 'Cardiovascular Assessment',
    about: [
      { '@type': 'MedicalCondition', name: 'Hypotension' },
      { '@type': 'MedicalCondition', name: 'Sepsis' },
    ],
  },
  '/bmi-calculator': {
    '@type': 'MedicalWebPage',
    name: 'Body Mass Index (BMI) Estimation',
    aspect: 'Obesity & Nutritional Triage',
    about: { '@type': 'MedicalCondition', name: 'Obesity' },
  },
  '/glasgow-coma-scale': {
    '@type': 'MedicalWebPage',
    name: 'Glasgow Coma Scale (GCS) Score',
    aspect: 'Neurological Triage',
    about: { '@type': 'MedicalCondition', name: 'Traumatic Brain Injury' },
  },
  '/drip-rate-calculator': {
    '@type': 'MedicalWebPage',
    name: 'IV Infusion & Drip Rate Calculator',
    aspect: 'Therapeutics & Dosing',
    about: { '@type': 'MedicalCondition', name: 'Dehydration' },
  },
  '/creatinine-clearance': {
    '@type': 'MedicalWebPage',
    name: 'Cockcroft-Gault Creatinine Clearance Calculator',
    aspect: 'Renal Pharmacokinetics',
    about: { '@type': 'MedicalCondition', name: 'Renal Failure' },
  },
  '/wells-score': {
    '@type': 'MedicalWebPage',
    name: 'Wells Criteria for Deep Vein Thrombosis (DVT)',
    aspect: 'Thromboembolism Risk Triage',
    about: { '@type': 'MedicalCondition', name: 'Deep Vein Thrombosis' },
  },
  '/medical-conversions': {
    '@type': 'MedicalWebPage',
    name: 'Clinical Unit Converter & Laboratory Conversions',
    aspect: 'Laboratory Metrics Converter',
    about: { '@type': 'MedicalCondition', name: 'Diabetes Mellitus' },
  },
  '/corrected-calcium': {
    '@type': 'MedicalWebPage',
    name: 'Albumin-Corrected Calcium Calculator',
    aspect: 'Electrolyte Disorders',
    about: { '@type': 'MedicalCondition', name: 'Hypercalcemia' },
  },
  '/qsofa-score': {
    '@type': 'MedicalWebPage',
    name: 'qSOFA Sepsis Risk Assessment',
    aspect: 'Sepsis Organ Dysfunction Triage',
    about: { '@type': 'MedicalCondition', name: 'Sepsis' },
  },
  '/curb65-score': {
    '@type': 'MedicalWebPage',
    name: 'CURB-65 Pneumonia Severity Score',
    aspect: 'Infectious Disease Triage',
    about: { '@type': 'MedicalCondition', name: 'Pneumonia' },
  },
  '/cha2ds2-vasc': {
    '@type': 'MedicalWebPage',
    name: 'CHA2DS2-VASc Stroke Risk in Atrial Fibrillation',
    aspect: 'Cardiovascular Stroke Prophylaxis',
    about: { '@type': 'MedicalCondition', name: 'Atrial Fibrillation' },
  },
  '/phq9-score': {
    '@type': 'MedicalWebPage',
    name: 'PHQ-9 Depression Patient Health Questionnaire',
    aspect: 'Psychiatric Triage',
    about: { '@type': 'MedicalCondition', name: 'Depressive Disorder' },
  },
  '/meld-score': {
    '@type': 'MedicalWebPage',
    name: 'MELD Score for End-Stage Liver Disease',
    aspect: 'Hepatology Survival Estimation',
    about: { '@type': 'MedicalCondition', name: 'Liver Cirrhosis' },
  },
  '/sirs-criteria': {
    '@type': 'MedicalWebPage',
    name: 'Systemic Inflammatory Response Syndrome (SIRS)',
    aspect: 'Inflammatory Triage',
    about: { '@type': 'MedicalCondition', name: 'Sepsis' },
  },
  '/pf-ratio': {
    '@type': 'MedicalWebPage',
    name: 'Horovitz P/F Ratio Calculator',
    aspect: 'Pulmonary & ICU Metrics',
    about: { '@type': 'MedicalCondition', name: 'Acute Respiratory Distress Syndrome' },
  },
  '/tidal-volume': {
    '@type': 'MedicalWebPage',
    name: 'ARDSNet Lung-Protective Tidal Volume Calculator',
    aspect: 'Mechanical Ventilation Support',
    about: { '@type': 'MedicalCondition', name: 'Acute Respiratory Distress Syndrome' },
  },
  '/anc-calculator': {
    '@type': 'MedicalWebPage',
    name: 'Absolute Neutrophil Count (ANC) Calculator',
    aspect: 'Hematology Oncology Triage',
    about: { '@type': 'MedicalCondition', name: 'Neutropenia' },
  },
  '/adjusted-body-weight': {
    '@type': 'MedicalWebPage',
    name: 'Ideal & Adjusted Body Weight (Devine Formula)',
    aspect: 'Pharmacokinetic Body Metrics',
    about: { '@type': 'MedicalCondition', name: 'Obesity' },
  },
  '/steroid-conversion': {
    '@type': 'MedicalWebPage',
    name: 'Corticosteroids Dose Equivalents Conversion',
    aspect: 'Endocrinology & Therapeutics',
    about: { '@type': 'MedicalCondition', name: 'Adrenal Insufficiency' },
  },
  '/blog': {
    '@type': 'MedicalWebPage',
    name: 'E-E-A-T Evidence-Based Clinical Medical Journal',
    aspect: 'Scientific Medical Literature Review',
    about: [
      { '@type': 'MedicalCondition', name: 'Sepsis' },
      { '@type': 'MedicalCondition', name: 'Renal Failure' },
    ],
  },
  '/nutrition-tdee': {
    '@type': 'MedicalWebPage',
    name: 'TDEE & BMR Nutrition Calculator',
    aspect: 'Clinical Nutrition & Dietetics',
    about: { '@type': 'MedicalCondition', name: 'Malnutrition' },
  },
  '/nutrition-must': {
    '@type': 'MedicalWebPage',
    name: 'MUST Score Malnutrition Screening Tool',
    aspect: 'Clinical Nutrition & Dietetics',
    about: { '@type': 'MedicalCondition', name: 'Malnutrition' },
  },
  '/nutrition-nrs2002': {
    '@type': 'MedicalWebPage',
    name: 'NRS-2002 Nutritional Risk Screening Calculator',
    aspect: 'Clinical Nutrition & Dietetics',
    about: { '@type': 'MedicalCondition', name: 'Malnutrition' },
  },
  '/glp-1-hub': {
    '@type': 'MedicalWebPage',
    name: 'GLP-1 & Metabolic Health Resource Hub',
    aspect: 'Metabolic & Cardiomedical Guidelines',
    about: [
      { '@type': 'MedicalCondition', name: 'Diabetes Mellitus, Type 2' },
      { '@type': 'MedicalCondition', name: 'Obesity' },
      { '@type': 'MedicalCondition', name: 'Cardiovascular Disease' }
    ],
  },
  '/hub-glp1': {
    '@type': 'MedicalWebPage',
    name: "Centre d'Intelligence GLP-1 & Métabolique",
    aspect: 'Metabolic & Cardiomedical Guidelines',
    about: [
      { '@type': 'MedicalCondition', name: 'Diabetes Mellitus, Type 2' },
      { '@type': 'MedicalCondition', name: 'Obesity' },
      { '@type': 'MedicalCondition', name: 'Cardiovascular Disease' }
    ],
  },
  '/مركز-glp1': {
    '@type': 'MedicalWebPage',
    name: 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
    aspect: 'Metabolic & Cardiomedical Guidelines',
    about: [
      { '@type': 'MedicalCondition', name: 'Diabetes Mellitus, Type 2' },
      { '@type': 'MedicalCondition', name: 'Obesity' },
      { '@type': 'MedicalCondition', name: 'Cardiovascular Disease' }
    ],
  },
  '/%D9%85%D8%B1%D9%83%D8%B2-glp1': {
    '@type': 'MedicalWebPage',
    name: 'مركز معلومات أدوية GLP-1 والصحة الاستقلابية',
    aspect: 'Metabolic & Cardiomedical Guidelines',
    about: [
      { '@type': 'MedicalCondition', name: 'Diabetes Mellitus, Type 2' },
      { '@type': 'MedicalCondition', name: 'Obesity' },
      { '@type': 'MedicalCondition', name: 'Cardiovascular Disease' }
    ],
  },
  '/apgar-score': {
    '@type': 'MedicalWebPage',
    name: 'APGAR Score Calculator',
    aspect: 'Neonatal Assessment & Triage',
    about: { '@type': 'MedicalCondition', name: 'Asphyxia Neonatorum' },
  },
  '/sofa-score': {
    '@type': 'MedicalWebPage',
    name: 'Sequential Organ Failure Assessment (SOFA) Score',
    aspect: 'ICU Organ Dysfunction Severity',
    about: { '@type': 'MedicalCondition', name: 'Sepsis' },
  },
  '/child-pugh-score': {
    '@type': 'MedicalWebPage',
    name: 'Child-Pugh Score for Liver Disease Severity',
    aspect: 'Hepatology Triage & Prognosis',
    about: { '@type': 'MedicalCondition', name: 'Liver Cirrhosis' },
  },
  '/anion-gap': {
    '@type': 'MedicalWebPage',
    name: 'Anion Gap Calculator',
    aspect: 'Acid-Base Disorders',
    about: { '@type': 'MedicalCondition', name: 'Metabolic Acidosis' },
  },
  '/aa-gradient': {
    '@type': 'MedicalWebPage',
    name: 'Alveolar-Arterial (A-a) Oxygen Gradient Calculator',
    aspect: 'Pulmonary Ventilation & Gas Exchange',
    about: { '@type': 'MedicalCondition', name: 'Hypoxemia' },
  },
};

export function getMedicalSchema(path: string) {
  if (path.startsWith('/fmp-medecine/')) {
    const slug = path.replace(/^\/fmp-medecine\//, '');
    const mod = FMP_MODULE_BY_SLUG[slug];
    if (mod) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: mod.name,
        description: mod.description,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: 'Faculté de Médecine et de Pharmacie de Casablanca',
          sameAs: 'https://fmpc.um5.ac.ma/'
        },
        educationalLevel: mod.year,
        inLanguage: 'fr',
        url: `${ORIGIN}/fmp-medecine/${slug}`,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'MAD' }
        }
      };
    }
  }

  if (path.startsWith('/ispits/')) {
    const slug = path.replace(/^\/ispits\//, '');
    const mod = ISPITS_MODULE_BY_SLUG[slug];
    if (mod) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: mod.name,
        description: mod.description,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: 'Institut Supérieur des Professions Infirmières et Techniques de Santé',
          sameAs: 'http://ispits.sante.gov.ma/'
        },
        educationalLevel: `Semester ${mod.semester}`,
        inLanguage: 'fr',
        url: `${ORIGIN}/ispits/${slug}`,
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'MAD' }
        }
      };
    }
  }

  const node = medicalSchemaDb[path];
  return node
    ? {
        '@context': 'https://schema.org',
        audience: {
          '@type': 'MedicalAudience',
          audienceType: 'Clinicians, ICU Doctors, ER Emergency Physicians',
        },
        ...node,
      }
    : null;
}

export function pageUrl(logicalPath: string, lang: LangCode): string {
  return `${ORIGIN}${lang === 'en' ? '' : '/' + lang}${logicalPath}`;
}

const faqSchemaDb: Record<string, { question: string; answer: string }[]> = {
  '/map-calculator': [
    { question: 'What is Mean Arterial Pressure (MAP)?', answer: 'Mean Arterial Pressure (MAP) is the average arterial pressure throughout one cardiac cycle. It reflects the average perfusion pressure driving blood to organs and is calculated as: MAP = DBP + 1/3 × (SBP − DBP).' },
    { question: 'What MAP value indicates adequate organ perfusion?', answer: 'A MAP of at least 65 mmHg is the widely accepted minimum threshold for adequate perfusion of vital organs, particularly in septic shock, as per Surviving Sepsis Campaign and AHA guidelines.' },
    { question: 'When should I use the MAP calculator?', answer: 'Use the MAP calculator in ICU, ER, or any acute care setting where hemodynamic assessment is needed — septic shock resuscitation, vasopressor titration, hypertensive emergencies, and post-operative monitoring.' },
    { question: 'What is the difference between MAP and systolic blood pressure?', answer: 'Systolic blood pressure (SBP) is the peak pressure during ventricular contraction. MAP accounts for the entire cardiac cycle and is a better indicator of tissue perfusion because diastole takes up approximately 2/3 of the cycle.' },
  ],
  '/glasgow-coma-scale': [
    { question: 'What is the Glasgow Coma Scale (GCS)?', answer: 'The Glasgow Coma Scale (GCS) is a standardized neurological assessment tool that measures a patient\'s level of consciousness by scoring three components: Eye Opening (E, 1-4), Verbal Response (V, 1-5), and Motor Response (M, 1-6). Total score ranges from 3 to 15.' },
    { question: 'What GCS score indicates a severe brain injury?', answer: 'A GCS score of 8 or below indicates severe brain injury. A score of 9-12 indicates moderate injury, and 13-15 indicates mild injury. Patients with GCS ≤ 8 are generally considered for intubation to protect the airway.' },
    { question: 'Who developed the Glasgow Coma Scale?', answer: 'The GCS was developed by Teasdale and Jennett in 1974 at the University of Glasgow, published in The Lancet. It has since become the global standard for consciousness assessment after traumatic brain injury.' },
    { question: 'Can GCS be used in children?', answer: 'The standard GCS is validated for adults and older children. For infants and young children, a modified Pediatric GCS (or Children\'s GCS) is preferred, which adapts verbal and motor components to age-appropriate responses.' },
  ],
  '/bmi-calculator': [
    { question: 'What is Body Mass Index (BMI)?', answer: 'BMI is a numeric value derived from a person\'s weight and height, calculated as weight (kg) divided by height squared (m²). It is used as a population-level screening tool for underweight, normal weight, overweight, and obesity categories.' },
    { question: 'What are the WHO BMI classification categories?', answer: 'WHO classifies BMI as: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25–29.9), and Obese (≥30). The obese category is further divided into Class I (30–34.9), II (35–39.9), and III (≥40, severe obesity).' },
    { question: 'What are the limitations of BMI in clinical practice?', answer: 'BMI does not distinguish between fat and muscle mass, does not reflect fat distribution (central vs peripheral), and may misclassify athletes (high muscle) or elderly patients (low muscle). It should be interpreted alongside waist circumference, clinical context, and comorbidities.' },
    { question: 'Is BMI accurate for all ethnicities?', answer: 'No. Studies show that Asian populations have higher cardiometabolic risk at lower BMI thresholds. WHO and several national guidelines recommend lower obesity cut-offs for Asian adults (overweight ≥23, obese ≥27.5).' },
  ],
  '/qsofa-score': [
    { question: 'What is the qSOFA score?', answer: 'The quick SOFA (qSOFA) is a bedside clinical tool for rapid identification of patients likely to have poor outcomes due to infection-related organ dysfunction (sepsis). It scores three criteria: Respiratory Rate ≥22/min, Altered Mentation (GCS <15), and Systolic BP ≤100 mmHg.' },
    { question: 'What qSOFA score is considered high risk?', answer: 'A qSOFA score of ≥2 out of 3 indicates high risk of poor outcome and should prompt clinicians to investigate for sepsis, initiate monitoring, and consider ICU-level care, per the Sepsis-3 consensus (Singer et al., JAMA 2016).' },
    { question: 'What is the difference between qSOFA and SOFA?', answer: 'qSOFA (quick SOFA) is a 3-item bedside screening tool usable without lab tests. Full SOFA (Sequential Organ Failure Assessment) requires lab values (PaO2, bilirubin, creatinine, platelets) and is used for formal organ failure quantification in the ICU.' },
    { question: 'Should qSOFA replace SIRS criteria for sepsis screening?', answer: 'The Sepsis-3 consensus replaced SIRS with qSOFA for out-of-ICU sepsis screening, arguing SIRS lacked specificity. However, SIRS remains relevant in some guidelines and settings. Both tools are available on CareCalculus for comparative assessment.' },
  ],
  '/curb65-score': [
    { question: 'What does CURB-65 stand for?', answer: 'CURB-65 is an acronym: C = Confusion (new disorientation), U = Urea >7 mmol/L (BUN >19 mg/dL), R = Respiratory rate ≥30/min, B = Blood pressure (Systolic <90 or Diastolic ≤60 mmHg), 65 = Age ≥65 years. Each criterion scores 1 point.' },
    { question: 'What CURB-65 score requires hospitalization?', answer: 'Score 0-1: Low risk — outpatient management appropriate. Score 2: Intermediate risk — consider short inpatient admission or close outpatient follow-up. Score 3-5: High risk — hospitalize, consider ICU admission for score ≥4-5.' },
    { question: 'What is the source study for CURB-65?', answer: 'CURB-65 was derived by Lim et al. (2003) from British Thoracic Society community-acquired pneumonia (CAP) guidelines data, published in Thorax (PMID: 12668799). It validated across multiple international CAP cohorts.' },
    { question: 'What is the difference between CURB-65 and PSI (Pneumonia Severity Index)?', answer: 'PSI (PORT score) uses 20 variables and is more complex, providing finer risk stratification for low-risk patients. CURB-65 uses only 5 criteria and is faster at the bedside. Both are validated; CURB-65 is preferred for rapid triage in emergency settings.' },
  ],
  '/orl': [
    { question: 'What is laryngeal cancer staging based on?', answer: 'Laryngeal cancer is staged using the AJCC TNM system, which evaluates the Primary Tumor extension (T), Regional Lymph Node involvement (N), and Distant Metastasis presence (M).' },
    { question: 'What are the anatomical subsites of the larynx?', answer: 'The larynx is divided into three subsites: the supraglottis (above the vocal cords), the glottis (the vocal cords), and the subglottis (below the vocal cords).' },
    { question: 'What is the significance of the T4 stage in laryngeal cancer?', answer: 'T4 indicates advanced disease. T4a represents moderately advanced local disease (invading through thyroid cartilage or trachea), while T4b represents very advanced local disease (invading prevertebral space, mediastinal structures, or carotid encasement).' },
  ],
  '/meld-score': [
    { question: 'What is the MELD score?', answer: 'The Model for End-Stage Liver Disease (MELD) score is a numerical scale (6–40) that predicts 3-month mortality risk in patients with end-stage liver disease. It uses serum bilirubin, serum creatinine, and INR to calculate the score.' },
    { question: 'What MELD score qualifies for liver transplant?', answer: 'A MELD score of 15 or higher generally qualifies a patient for liver transplant listing. Higher scores indicate greater urgency. Scores above 30 are associated with >50% 90-day mortality without transplant.' },
    { question: 'How is MELD score calculated?', answer: 'MELD = 3.78 × ln(bilirubin mg/dL) + 11.2 × ln(INR) + 9.57 × ln(creatinine mg/dL) + 6.43. All values below 1.0 are set to 1.0. Maximum creatinine is capped at 4.0.' },
  ],
  '/wells-score': [
    { question: 'What is the Wells score used for?', answer: 'The Wells score is a clinical prediction rule used to estimate the pretest probability of deep vein thrombosis (DVT) or pulmonary embolism (PE). It helps guide diagnostic testing decisions.' },
    { question: 'What Wells score indicates high risk for DVT?', answer: 'A Wells score of ≥3 indicates high probability of DVT (prevalence ~75%). Score 1-2 is moderate probability (~17%), and ≤0 is low probability (~5%). High-probability patients typically proceed directly to imaging.' },
    { question: 'What is the difference between Wells criteria for DVT and PE?', answer: 'Wells for DVT and Wells for PE are separate scoring systems with different criteria. DVT Wells evaluates leg-specific findings, while PE Wells includes heart rate >100, hemoptysis, and whether PE is the most likely diagnosis.' },
  ],
  '/cha2ds2-vasc': [
    { question: 'What is CHA2DS2-VASc score?', answer: 'CHA2DS2-VASc is a clinical prediction score that estimates stroke risk in patients with non-valvular atrial fibrillation (AF). It guides decisions about anticoagulation therapy. The acronym stands for: Congestive heart failure, Hypertension, Age ≥75 (2 points), Diabetes, Stroke/TIA (2 points), Vascular disease, Age 65-74, Sex category (female).' },
    { question: 'What CHA2DS2-VASc score requires anticoagulation?', answer: 'Per ESC/AHA guidelines: Score 0 (males) or 1 (females) = no anticoagulation needed. Score ≥1 (males) or ≥2 (females) = consider anticoagulation. Score ≥2 (males) or ≥3 (females) = anticoagulation recommended.' },
  ],
  '/creatinine-clearance': [
    { question: 'What is creatinine clearance?', answer: 'Creatinine clearance (CrCl) is a measure of kidney function that estimates the glomerular filtration rate (GFR). It reflects how efficiently the kidneys filter creatinine from the blood and is measured in mL/min.' },
    { question: 'What is the Cockcroft-Gault formula?', answer: 'CrCl = [(140 - Age) × Weight (kg)] / [72 × Serum Creatinine (mg/dL)] × 0.85 if female. It was published by Cockcroft and Gault in 1976 and remains the standard for drug dosing adjustments.' },
    { question: 'What creatinine clearance is considered normal?', answer: 'Normal creatinine clearance is approximately 90-120 mL/min for healthy adults. Values below 60 mL/min indicate chronic kidney disease (CKD) Stage 3 or worse. Below 15 mL/min indicates kidney failure (Stage 5).' },
  ],
  '/corrected-calcium': [
    { question: 'Why do we correct calcium for albumin?', answer: 'Approximately 40% of serum calcium is bound to albumin. When albumin is low (hypoalbuminemia), total calcium appears falsely low even when ionized (active) calcium is normal. The correction formula adjusts for this protein binding.' },
    { question: 'What is the corrected calcium formula?', answer: 'Corrected Calcium (mg/dL) = Measured Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin g/dL). The constant 4.0 represents normal albumin and 0.8 is the correction factor.' },
  ],
  '/drip-rate-calculator': [
    { question: 'How do you calculate IV drip rate?', answer: 'Drip Rate (drops/min) = [Volume (mL) × Drop Factor (drops/mL)] / Time (min). Common drop factors are: 10 drops/mL (blood sets), 15 drops/mL (standard), 20 drops/mL (standard), and 60 drops/mL (micro-drip).' },
    { question: 'What is a normal IV drip rate?', answer: 'Normal IV maintenance rates vary by patient weight: approximately 80-120 mL/hour for adults (roughly 25-40 drops/min with standard tubing). Critical infusions like vasopressors may run at much lower rates (1-20 mL/hr).' },
  ],
  '/steroid-conversion': [
    { question: 'How do you convert between corticosteroids?', answer: 'Corticosteroids have different potencies. Using hydrocortisone 20mg as the reference: Prednisone 5mg = Prednisolone 5mg = Methylprednisolone 4mg = Dexamethasone 0.75mg = Betamethasone 0.6mg = Hydrocortisone 20mg are all equipotent doses.' },
    { question: 'Why is steroid conversion important?', answer: 'Steroid conversion is critical when switching between agents (e.g., IV methylprednisolone to oral prednisone), when tapering steroids, or when comparing dosages across different formulations. Incorrect conversion can cause adrenal crisis or Cushing syndrome.' },
  ],
  '/medical-conversions': [
    { question: 'Why is medical unit conversion necessary?', answer: 'Different laboratories and international guidelines use different units (e.g., mass vs. molar concentrations like mg/dL vs. mmol/L for glucose). Accurate conversion is critical for comparing research, diagnosing patients, and avoiding dosing errors.' },
    { question: 'How do you convert glucose from mg/dL to mmol/L?', answer: 'To convert glucose from mg/dL to mmol/L, divide the mg/dL value by 18.02 (e.g., 180 mg/dL / 18.02 = 10.0 mmol/L). To convert back, multiply by 18.02.' },
    { question: 'How do you convert creatinine from mg/dL to umol/L?', answer: 'To convert creatinine from mg/dL to micromoles per liter (µmol/L), multiply the mg/dL value by 88.4.' }
  ],
  '/pf-ratio': [
    { question: 'What is the P/F ratio?', answer: 'The P/F ratio is the ratio of arterial oxygen partial pressure (PaO2 in mmHg) to fractional inspired oxygen (FiO2 as a decimal). It is used to quantify the severity of hypoxemia and lung injury.' },
    { question: 'What is a normal P/F ratio?', answer: 'A normal P/F ratio is approximately 400 to 500 mmHg. A value below 300 mmHg indicates acute lung injury, and below 200 mmHg is a hallmark of ARDS.' },
    { question: 'How does the P/F ratio classify ARDS?', answer: 'Under the Berlin Definition, ARDS is classified by P/F ratio with PEEP/CPAP ≥5 cmH2O: Mild (201-300 mmHg), Moderate (101-200 mmHg), and Severe (≤100 mmHg).' }
  ],
  '/tidal-volume': [
    { question: 'Why should tidal volume be calculated based on predicted body weight (PBW)?', answer: 'Lung size is determined by biological sex and height, not by actual body weight. Using actual body weight in obese patients would result in excessively large tidal volumes, leading to ventilator-induced lung injury (volutrauma/barotrauma).' },
    { question: 'What is the standard protective tidal volume target in ARDS?', answer: 'The ARDSNet protocol recommends starting at 6 mL/kg of predicted body weight (PBW), with a range between 4 to 8 mL/kg, while maintaining plateau pressure < 30 cmH2O.' },
    { question: 'What formula is used to calculate predicted body weight?', answer: 'The Devine formula is typically used. Males: 50 + 2.3 × (Height in inches - 60). Females: 45.5 + 2.3 × (Height in inches - 60).' }
  ],
  '/anc-calculator': [
    { question: 'What is the Absolute Neutrophil Count (ANC)?', answer: 'The ANC measures the real number of neutrophil granulocytes (both segmentals/mature and bands/immature) in a microliter of blood. It is a key metric for evaluating a patient\'s immune defense.' },
    { question: 'How is ANC calculated?', answer: 'ANC = WBC (cells/µL) × [Segmented Neutrophils (%) + Band Neutrophils (%)] / 100.' },
    { question: 'What ANC level indicates neutropenia?', answer: 'Neutropenia is classified as: Mild (ANC 1000–1500 cells/µL), Moderate (500–1000 cells/µL), and Severe (ANC < 500 cells/µL). Severe neutropenia represents a critical infection risk.' }
  ],
  '/adjusted-body-weight': [
    { question: 'When is Adjusted Body Weight (AjBW) used?', answer: 'Adjusted Body Weight is used for drug dosing (e.g., aminoglycosides, acyclovir) in obese patients (typically when actual body weight is >120% of ideal body weight) to avoid overdosing water-soluble medications.' },
    { question: 'How is Ideal Body Weight calculated?', answer: 'IBW is calculated using the Devine formula: Males: 50.0 kg + 2.3 kg per inch over 5 feet (152.4 cm). Females: 45.5 kg + 2.3 kg per inch over 5 feet.' },
    { question: 'What is the formula for Adjusted Body Weight?', answer: 'AjBW = IBW + 0.4 × (Actual Weight - IBW).' }
  ],
  '/phq9-score': [
    { question: 'What is the PHQ-9?', answer: 'The Patient Health Questionnaire-9 (PHQ-9) is a self-administered diagnostic screening instrument for measuring the severity of depression. It is based on the 9 DSM-IV diagnostic criteria.' },
    { question: 'How is the PHQ-9 scored?', answer: 'Each of the 9 items is scored from 0 (not at all) to 3 (nearly every day), yielding a total score between 0 and 27.' },
    { question: 'What do the PHQ-9 score ranges mean?', answer: 'Scores indicate depression severity: 0-4 (Minimal/None), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately Severe), and 20-27 (Severe).' }
  ],
  '/sirs-criteria': [
    { question: 'What are the SIRS criteria?', answer: 'Systemic Inflammatory Response Syndrome (SIRS) is defined by meeting ≥2 of: Temperature <36°C or >38°C; Heart Rate >90 bpm; Respiratory Rate >20/min or PaCO2 <32 mmHg; WBC Count <4,000/µL, >12,000/µL, or >10% bands.' },
    { question: 'What is the difference between SIRS and Sepsis?', answer: 'SIRS is a systemic inflammatory response to any insult (infectious or non-infectious, e.g., pancreatitis). Sepsis is defined as SIRS (or organ dysfunction) caused by a documented or suspected infection.' },
    { question: 'Is SIRS still used to diagnose sepsis?', answer: 'While Sepsis-3 guidelines transitioned to using the SOFA/qSOFA scores for defining sepsis due to better specificity, SIRS remains widely monitored in clinical triage as a highly sensitive screening tool.' }
  ],
  '/glp-1-hub': [
    { question: 'What are GLP-1 receptor agonists?', answer: 'GLP-1 receptor agonists (GLP-1 RAs) are a class of medications that mimic the glucagon-like peptide-1 hormone, enhancing insulin secretion, suppressing glucagon, delaying gastric emptying, and promoting satiety.' },
    { question: 'What are the primary indications for GLP-1 RAs?', answer: 'They are FDA-approved for the treatment of type 2 diabetes mellitus to improve glycemic control and reduce major adverse cardiovascular events, and for chronic weight management in obesity.' },
    { question: 'What are common side effects of GLP-1 agonists?', answer: 'Gastrointestinal adverse effects are most common, including nausea, vomiting, diarrhea, constipation, and dyspepsia. They are typically mild-to-moderate and transient.' }
  ],
  '/apgar-score': [
    { question: 'What is the APGAR score?', answer: 'The APGAR score is a rapid assessment of a newborn\'s clinical status performed at 1 minute and 5 minutes after birth. It evaluates: Appearance (color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respiration.' },
    { question: 'What does a normal APGAR score mean?', answer: 'An APGAR score of 7 to 10 is considered normal and indicates the newborn is in good health. Scores of 4 to 6 indicate moderate depression, and 0 to 3 indicate severe distress requiring immediate resuscitation.' },
    { question: 'When is the APGAR score calculated?', answer: 'It is calculated routinely at 1 and 5 minutes after birth. If the 5-minute score is low (<7), it may be repeated every 5 minutes up to 20 minutes to monitor resuscitation progress.' }
  ],
  '/sofa-score': [
    { question: 'What is the SOFA score?', answer: 'The Sequential Organ Failure Assessment (SOFA) score is a scoring system used in ICU settings to track a patient\'s organ dysfunction level across six organ systems: respiratory, cardiovascular, hepatic, coagulation, renal, and neurological.' },
    { question: 'How does the SOFA score define organ dysfunction severity?', answer: 'Each of the six organ systems is scored from 0 (normal) to 4 (severe dysfunction), yielding a total score between 0 and 24. A higher score is associated with higher mortality risk.' },
    { question: 'What is the clinical significance of a change in SOFA score?', answer: 'An increase in SOFA score of ≥2 points from baseline indicates acute organ dysfunction, representing a positive screen for sepsis under Sepsis-3 criteria and indicating a 10% or greater hospital mortality risk.' }
  ],
  '/child-pugh-score': [
    { question: 'What is the Child-Pugh score?', answer: 'The Child-Pugh score is a clinical staging system used to assess the prognosis of chronic liver disease, particularly cirrhosis. It evaluates total bilirubin, serum albumin, INR, ascites, and hepatic encephalopathy.' },
    { question: 'What are the Child-Pugh classification classes?', answer: 'Patients are categorized into three classes: Class A (Score 5-6, 100% 1-year survival), Class B (Score 7-9, 81% 1-year survival), and Class C (Score 10-15, 45% 1-year survival).' },
    { question: 'How does the Child-Pugh score differ from the MELD score?', answer: 'The Child-Pugh score includes subjective parameters (ascites and encephalopathy) alongside labs. The MELD score is purely objective and laboratory-based (creatinine, bilirubin, INR, sodium), making it preferred for transplant allocation.' }
  ],
  '/anion-gap': [
    { question: 'What is the serum Anion Gap?', answer: 'The serum anion gap is a calculated metric representing the difference between measured cations (sodium) and measured anions (chloride and bicarbonate). It helps identify the cause of metabolic acidosis.' },
    { question: 'What is a normal serum Anion Gap?', answer: 'A normal anion gap is typically 8 to 12 mEq/L (without potassium) or 12 to 16 mEq/L if potassium is included. However, reference ranges vary by laboratory.' },
    { question: 'What causes a high Anion Gap metabolic acidosis (HAGMA)?', answer: 'Common causes of HAGMA can be remembered using the acronym GOLD MARK: Glycols, Oxoproline, L-lactate, D-lactate, Methanol, Aspirin (salicylates), Renal failure (uremia), and Ketoacidosis.' }
  ],
  '/aa-gradient': [
    { question: 'What is the Alveolar-Arterial (A-a) oxygen gradient?', answer: 'The A-a gradient is the difference between the partial pressure of oxygen in the alveoli (PAO2) and in arterial blood (PaO2). It evaluates the integrity of the alveolar-capillary membrane.' },
    { question: 'How is the expected normal A-a gradient calculated?', answer: 'A normal A-a gradient increases with age. It can be estimated as: Expected Normal Gradient = (Age / 4) + 4. It also depends on the fraction of inspired oxygen (FiO2).' },
    { question: 'What causes an elevated A-a gradient?', answer: 'An elevated A-a gradient indicates an oxygenation defect, caused by ventilation-perfusion (V/Q) mismatch (e.g., pulmonary embolism, pneumonia), right-to-left shunt (e.g., anatomical shunt), or diffusion limitation.' }
  ],
  '/ispits': [
    { question: 'What is the ISPITS Paramedical Academy?', answer: 'The ISPITS Paramedical Academy is an academic library on CareCalculus containing course modules, syllabi, and PDF guides for the Higher Institute of Nursing Professions and Health Techniques (ISPITS Maroc).' },
    { question: 'Who can use the ISPITS modules on CareCalculus?', answer: 'These modules are designed for nursing students, midwives, health technicians, anesthesia technicians, and rehabilitators preparing for exams or clinical practice.' },
    { question: 'Are the ISPITS courses free to download?', answer: 'Yes. All course modules and PDF materials on CareCalculus are 100% free, require no login, and can be viewed or downloaded directly in your browser.' }
  ],
};

const howToSchemaDb: Record<string, { name: string; description: string; steps: { name: string; text: string }[] }> = {
  '/map-calculator': {
    name: 'How to Calculate Mean Arterial Pressure (MAP)',
    description: 'Step-by-step guide to calculating MAP using the CareCalculus MAP calculator.',
    steps: [
      { name: 'Enter Systolic Blood Pressure', text: 'Input the patient\'s systolic blood pressure (SBP) in mmHg using the numeric field or slider. Normal adult SBP range: 90–140 mmHg.' },
      { name: 'Enter Diastolic Blood Pressure', text: 'Input the diastolic blood pressure (DBP) in mmHg. Normal adult DBP range: 60–90 mmHg. Ensure DBP is less than SBP.' },
      { name: 'Read the Calculated MAP', text: 'The MAP is instantly calculated using the formula: MAP = DBP + 1/3 × (SBP − DBP). A result ≥65 mmHg indicates adequate perfusion; <65 mmHg suggests hypoperfusion risk.' },
      { name: 'Interpret the Clinical Status', text: 'Review the color-coded result: green (≥65 mmHg, normal perfusion) or red (<65 mmHg, low perfusion risk). Use this alongside clinical assessment and vasopressor guidance.' },
    ],
  },
  '/glasgow-coma-scale': {
    name: 'How to Score the Glasgow Coma Scale (GCS)',
    description: 'Step-by-step guide to using the CareCalculus GCS calculator for neurological assessment.',
    steps: [
      { name: 'Assess Eye Opening Response', text: 'Observe and select the best eye opening response: 4 = Spontaneous, 3 = To voice/command, 2 = To pain stimulus, 1 = None. Always use the best observed response.' },
      { name: 'Assess Verbal Response', text: 'Engage the patient verbally and select: 5 = Oriented (knows person, place, time), 4 = Confused, 3 = Inappropriate words, 2 = Incomprehensible sounds, 1 = None.' },
      { name: 'Assess Motor Response', text: 'Apply stimulus if needed and select: 6 = Obeys commands, 5 = Localizes pain, 4 = Withdraws, 3 = Flexion (Decorticate), 2 = Extension (Decerebrate), 1 = None.' },
      { name: 'Interpret the Total GCS Score', text: 'The total score (3-15) categorizes severity: ≤8 = Severe (consider intubation), 9-12 = Moderate, 13-15 = Mild. Document as E+V+M components (e.g., E3V4M5 = GCS 12).' },
    ],
  },
  '/bmi-calculator': {
    name: 'How to Calculate Body Mass Index (BMI)',
    description: 'Step-by-step guide to using the CareCalculus BMI calculator for anthropometric assessment.',
    steps: [
      { name: 'Enter Patient Height', text: 'Enter the patient\'s height in centimeters (cm) using the input field or slider. Standard adult range: 140–210 cm.' },
      { name: 'Enter Patient Weight', text: 'Enter the patient\'s weight in kilograms (kg). The calculator accepts values from 10 to 300 kg.' },
      { name: 'Read the BMI Result', text: 'BMI is instantly calculated as Weight(kg) ÷ Height(m)². A BMI between 18.5 and 24.9 is considered normal weight by WHO classification.' },
      { name: 'Interpret the BMI Category', text: 'Review the WHO category: Underweight (<18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (≥30). Always interpret in clinical context — BMI alone is not diagnostic.' },
    ],
  },
  '/qsofa-score': {
    name: 'How to Calculate the qSOFA Score',
    description: 'Step-by-step guide to using the CareCalculus qSOFA Sepsis Risk calculator.',
    steps: [
      { name: 'Assess Respiratory Rate', text: 'Check if the patient\'s respiratory rate is ≥22 breaths/min. If yes, select this criterion (1 point). This is a sensitive early sign of respiratory compensation in sepsis.' },
      { name: 'Assess Mental Status', text: 'Determine if the patient has altered mentation — defined as GCS <15. Any new confusion, disorientation, or decreased alertness qualifies. If present, select this criterion (1 point).' },
      { name: 'Assess Systolic Blood Pressure', text: 'Check if systolic BP is ≤100 mmHg. If yes, select this criterion (1 point). Hypotension in the context of infection suggests early septic shock.' },
      { name: 'Interpret the Total qSOFA Score', text: 'A score of 0-1 indicates low risk. A score of ≥2 indicates high risk of poor outcome — initiate sepsis workup (lactate, blood cultures, empiric antibiotics) and consider ICU escalation.' },
    ],
  },
  '/curb65-score': {
    name: 'How to Calculate the CURB-65 Score for Pneumonia Severity',
    description: 'Step-by-step guide to using the CareCalculus CURB-65 pneumonia severity calculator.',
    steps: [
      { name: 'Assess for New Confusion', text: 'Check for new acute confusion or disorientation (not baseline). This is defined as an MMSE score <8 or any new acute disorientation to person, place, or time.' },
      { name: 'Check Urea / BUN Level', text: 'Check if blood urea nitrogen (BUN) is >19 mg/dL (or urea >7 mmol/L). Elevated BUN in pneumonia indicates dehydration or early sepsis-related renal dysfunction.' },
      { name: 'Measure Respiratory Rate', text: 'Count the patient\'s respiratory rate. If ≥30 breaths/min, select this criterion. Tachypnea in pneumonia reflects ventilatory failure risk.' },
      { name: 'Check Blood Pressure', text: 'Check if systolic BP is <90 mmHg OR diastolic BP is ≤60 mmHg. Hypotension in CAP patients significantly increases 30-day mortality risk.' },
      { name: 'Check Age ≥65', text: 'If the patient is 65 years or older, select this criterion. Age ≥65 is an independent predictor of 30-day mortality in community-acquired pneumonia.' },
      { name: 'Interpret the Total CURB-65 Score', text: 'Score 0-1: Low risk (outpatient care). Score 2: Intermediate (consider hospitalization). Score 3-5: High risk — hospitalize, consider ICU for score ≥4.' },
    ],
  },
  '/meld-score': {
    name: 'How to Calculate MELD Score',
    description: 'Step-by-step guide to calculating the Model for End-Stage Liver Disease (MELD) score.',
    steps: [
      { name: 'Retrieve Laboratory Values', text: 'Obtain the patient\'s serum bilirubin (mg/dL), serum creatinine (mg/dL), and INR from recent blood tests.' },
      { name: 'Check Dialysis Status', text: 'Determine if the patient has had dialysis twice or more within the last week. If yes, the creatinine value is set to 4.0 mg/dL.' },
      { name: 'Input Laboratory Parameters', text: 'Enter the creatinine, bilirubin, and INR values into the respective calculator inputs.' },
      { name: 'Read MELD Score and Risk', text: 'The calculator computes the MELD score and displays the corresponding 3-month survival probability and transplant listing guidance.' }
    ]
  },
  '/wells-score': {
    name: 'How to Calculate Wells Criteria for DVT',
    description: 'Step-by-step guide to calculating the Wells Score to assess pretest probability of DVT.',
    steps: [
      { name: 'Select Clinical Risk Factors', text: 'Review the patient for clinical symptoms such as active cancer, paralysis, leg swelling, collateral superficial veins, and localized tenderness. Check each matching box.' },
      { name: 'Assess Alternative Diagnoses', text: 'Evaluate if an alternative diagnosis (e.g., muscle strain, cellulitis) is at least as likely as DVT. If yes, subtract 2 points.' },
      { name: 'Review the Risk Category', text: 'A score of ≤0 indicates low risk, 1-2 indicates moderate risk, and ≥3 indicates high risk of DVT.' }
    ]
  },
  '/cha2ds2-vasc': {
    name: 'How to Calculate CHA2DS2-VASc Score',
    description: 'Step-by-step guide to calculating stroke risk in patients with non-valvular atrial fibrillation.',
    steps: [
      { name: 'Input Patient Age and Sex', text: 'Select the biological sex and input the patient\'s age. Age ≥75 adds 2 points; age 65-74 adds 1 point.' },
      { name: 'Select Cardiovascular Comorbidities', text: 'Check the boxes for congestive heart failure, hypertension, diabetes, stroke/TIA/thromboembolism (2 points), and vascular disease.' },
      { name: 'Determine Anticoagulation Recommendation', text: 'Review the total score. A score of 0-1 generally requires no or individual anticoagulation choice; score ≥2 recommends oral anticoagulation.' }
    ]
  },
  '/creatinine-clearance': {
    name: 'How to Calculate Creatinine Clearance',
    description: 'Step-by-step guide to estimating creatinine clearance using the Cockcroft-Gault formula.',
    steps: [
      { name: 'Input Patient Characteristics', text: 'Enter the patient\'s age, biological sex, and weight in kilograms.' },
      { name: 'Input Serum Creatinine', text: 'Enter the serum creatinine level in mg/dL or µmol/L.' },
      { name: 'Review GFR and Renal Stage', text: 'Read the estimated creatinine clearance (mL/min) and check the corresponding CKD stage to adjust medication dosages if necessary.' }
    ]
  },
  '/corrected-calcium': {
    name: 'How to Calculate Albumin-Corrected Calcium',
    description: 'Step-by-step guide to calculating corrected calcium in patients with hypoalbuminemia.',
    steps: [
      { name: 'Input Total Calcium', text: 'Enter the measured total serum calcium in mg/dL.' },
      { name: 'Input Serum Albumin', text: 'Enter the measured serum albumin level in g/dL.' },
      { name: 'Evaluate the Adjusted Value', text: 'The corrected calcium is calculated as: Measured Calcium + 0.8 × (4.0 - Albumin). Compare the result against the normal reference range (8.5–10.2 mg/dL).' }
    ]
  },
  '/drip-rate-calculator': {
    name: 'How to Calculate IV Drip Rate',
    description: 'Step-by-step guide to calculating IV infusion and drip rates.',
    steps: [
      { name: 'Enter Infusion Volume', text: 'Enter the total volume to be infused in milliliters (mL).' },
      { name: 'Enter Infusion Time', text: 'Enter the target time period in minutes or hours.' },
      { name: 'Select Drop Factor', text: 'Choose the drop factor of your administration tubing (e.g., 10, 15, 20, or 60 drops/mL).' },
      { name: 'Set the Drip Rate', text: 'Read the output in drops per minute and mL/hr to calibrate the infusion clamp or pump.' }
    ]
  },
  '/steroid-conversion': {
    name: 'How to Convert Corticosteroid Doses',
    description: 'Step-by-step guide to calculating equivalent doses of different corticosteroids.',
    steps: [
      { name: 'Select Input Corticoid', text: 'Select the corticosteroid the patient is currently receiving.' },
      { name: 'Enter Current Dose', text: 'Input the current daily dose in milligrams (mg).' },
      { name: 'Review Equipotent Doses', text: 'The converter instantly displays equivalent doses for Prednisone, Methylprednisolone, Dexamethasone, Hydrocortisone, and others.' }
    ]
  },
  '/medical-conversions': {
    name: 'How to Convert Clinical Units',
    description: 'Step-by-step guide to converting between mass and molar clinical units.',
    steps: [
      { name: 'Select Lab Parameter', text: 'Choose the laboratory parameter you wish to convert (e.g., Glucose, Creatinine, Cholesterol).' },
      { name: 'Enter Current Value', text: 'Enter the clinical value and its current unit (e.g., mg/dL).' },
      { name: 'Read Converted Value', text: 'The tool instantly converts the value to the alternative clinical unit (e.g., mmol/L).' }
    ]
  },
  '/pf-ratio': {
    name: 'How to Calculate P/F Ratio',
    description: 'Step-by-step guide to calculating the PaO2/FiO2 ratio for lung injury assessment.',
    steps: [
      { name: 'Input Arterial PaO2', text: 'Enter the partial pressure of oxygen (PaO2) from the patient\'s arterial blood gas (ABG) in mmHg.' },
      { name: 'Input Inspired FiO2', text: 'Enter the fraction of inspired oxygen (FiO2) as a percentage (e.g., 40% for room air plus supplemental O2, or 21% for ambient air).' },
      { name: 'Read Ratio and ARDS Category', text: 'Review the P/F ratio in mmHg. The calculator classifies the severity of hypoxemia as mild, moderate, or severe ARDS.' }
    ]
  },
  '/tidal-volume': {
    name: 'How to Calculate Tidal Volume',
    description: 'Step-by-step guide to calculating protective tidal volumes for mechanical ventilation.',
    steps: [
      { name: 'Select Biological Sex', text: 'Choose the patient\'s biological sex (male or female).' },
      { name: 'Enter Patient Height', text: 'Enter the patient\'s height in feet/inches or centimeters.' },
      { name: 'Determine Target Volume', text: 'Select the target tidal volume setting (e.g., 6 mL/kg or 8 mL/kg of predicted body weight). The calculator outputs the exact target volume in mL.' }
    ]
  },
  '/anc-calculator': {
    name: 'How to Calculate Absolute Neutrophil Count',
    description: 'Step-by-step guide to calculating ANC to assess immune status.',
    steps: [
      { name: 'Input Total WBC Count', text: 'Enter the total white blood cell count (WBC) in cells/µL.' },
      { name: 'Input Neutrophil Percentages', text: 'Enter the percentage of segmented neutrophils and band neutrophils from the differential.' },
      { name: 'Interpret Neutropenia Risk', text: 'Read the calculated ANC. Values below 500 indicate severe neutropenia and high susceptibility to infections.' }
    ]
  },
  '/adjusted-body-weight': {
    name: 'How to Calculate Ideal and Adjusted Body Weight',
    description: 'Step-by-step guide to calculating weight metrics for clinical dosing.',
    steps: [
      { name: 'Select Biological Sex', text: 'Choose the patient\'s biological sex.' },
      { name: 'Enter Height and Actual Weight', text: 'Enter the patient\'s height (cm or inches) and current actual weight (kg).' },
      { name: 'Analyze Dosing Weights', text: 'Review the calculated Ideal Body Weight (IBW) and Adjusted Body Weight (AjBW) for clinical drug dosing.' }
    ]
  },
  '/phq9-score': {
    name: 'How to Administer and Score the PHQ-9',
    description: 'Step-by-step guide to scoring the Patient Health Questionnaire-9.',
    steps: [
      { name: 'Answer the 9 Questions', text: 'Select a score from 0 (not at all) to 3 (nearly every day) for each of the 9 items representing depressive symptoms over the last two weeks.' },
      { name: 'Review Total Score', text: 'The sum of the 9 questions produces the final score (0 to 27).' },
      { name: 'Read Depression Severity', text: 'Review the corresponding depression severity category and clinical recommendation.' }
    ]
  },
  '/sirs-criteria': {
    name: 'How to Screen for SIRS Criteria',
    description: 'Step-by-step guide to checking the Systemic Inflammatory Response Syndrome criteria.',
    steps: [
      { name: 'Assess Body Temperature', text: 'Enter the patient\'s temperature. Values <36°C or >38°C meet the criterion.' },
      { name: 'Measure Heart Rate and Respiratory Rate', text: 'Enter heart rate (bpm) and respiratory rate (breaths/min) or PaCO2 (mmHg). Heart rate >90 bpm or respiratory rate >20 breaths/min (or PaCO2 <32 mmHg) meet the criteria.' },
      { name: 'Input WBC Count', text: 'Enter white blood cell count (cells/µL) or percentage of immature band cells. WBC >12,000, <4,000, or >10% bands meet the criterion.' },
      { name: 'Count Selected Criteria', text: 'If 2 or more of the 4 criteria are met, the patient is positive for SIRS.' }
    ]
  },
  '/apgar-score': {
    name: 'How to Score the Neonatal APGAR Scale',
    description: 'Step-by-step guide to assessing a newborn\'s status at 1 and 5 minutes.',
    steps: [
      { name: 'Evaluate Appearance', text: 'Select 0 for blue/pale all over, 1 for pink body with blue extremities (acrocyanosis), or 2 for completely pink.' },
      { name: 'Evaluate Pulse', text: 'Select 0 for absent pulse, 1 for slow pulse (<100 bpm), or 2 for normal pulse (≥100 bpm).' },
      { name: 'Evaluate Grimace', text: 'Select 0 for no response to stimulation, 1 for a grimace or weak cry, or 2 for a vigorous cry, sneeze, or cough.' },
      { name: 'Evaluate Activity', text: 'Select 0 for limp/flaccid tone, 1 for some flexion of extremities, or 2 for active motion.' },
      { name: 'Evaluate Respiration', text: 'Select 0 for absent respiration, 1 for slow/irregular/weak cry, or 2 for a strong, robust cry.' },
      { name: 'Review Total APGAR Score', text: 'Review the sum of the components (0 to 10). Scores ≥7 indicate a normal, stable newborn.' }
    ]
  },
  '/sofa-score': {
    name: 'How to Calculate the SOFA Score',
    description: 'Step-by-step guide to calculating the Sequential Organ Failure Assessment (SOFA) score in ICU patients.',
    steps: [
      { name: 'Input Respiratory Status', text: 'Enter the P/F ratio (PaO2/FiO2) and check if mechanical ventilation is active.' },
      { name: 'Input Coagulation & Hepatic Function', text: 'Enter the platelet count (×10³/µL) and total bilirubin level (mg/dL).' },
      { name: 'Input Cardiovascular Perfusion', text: 'Enter the Mean Arterial Pressure (MAP) and select any vasopressors currently being infused (Dopamine, Dobutamine, Epinephrine, or Norepinephrine).' },
      { name: 'Input Neurological Status', text: 'Enter the patient\'s Glasgow Coma Scale (GCS) score.' },
      { name: 'Input Renal Function', text: 'Enter the serum creatinine level (mg/dL) or daily urine output volume.' },
      { name: 'Read Total SOFA Score', text: 'The calculator sums the sub-scores (0-4 per system) to yield the total SOFA score (0-24).' }
    ]
  },
  '/child-pugh-score': {
    name: 'How to Calculate Child-Pugh Score for Cirrhosis',
    description: 'Step-by-step guide to scoring liver cirrhosis severity.',
    steps: [
      { name: 'Input Bilirubin and Albumin', text: 'Enter serum bilirubin (mg/dL) and serum albumin (g/dL).' },
      { name: 'Input INR', text: 'Enter the International Normalized Ratio (INR).' },
      { name: 'Evaluate Ascites', text: 'Select the severity of ascites: None, Mild (diuretic-responsive), or Moderate-to-Severe (diuretic-refractory).' },
      { name: 'Evaluate Encephalopathy', text: 'Select the grade of hepatic encephalopathy: None, Grade 1-2, or Grade 3-4.' },
      { name: 'Read Class and 1-Year Survival', text: 'The sum of all inputs (5-15) determines Child-Pugh Class A, B, or C, indicating the 1-year and 2-year survival probability.' }
    ]
  },
  '/anion-gap': {
    name: 'How to Calculate Serum Anion Gap',
    description: 'Step-by-step guide to calculating anion gap to screen for metabolic acidosis.',
    steps: [
      { name: 'Enter Serum Sodium', text: 'Enter the measured sodium level (Na+) in mEq/L.' },
      { name: 'Enter Chloride and Bicarbonate', text: 'Enter the measured chloride (Cl-) and bicarbonate (HCO3-) levels in mEq/L.' },
      { name: 'Optional: Adjust for Albumin', text: 'If hypoalbuminemia is present, enter the patient\'s albumin level (g/dL) to obtain the corrected anion gap.' },
      { name: 'Read Calculated Anion Gap', text: 'Review the calculated anion gap. A value >12 mEq/L suggests anion gap metabolic acidosis.' }
    ]
  },
  '/aa-gradient': {
    name: 'How to Calculate Alveolar-Arterial (A-a) Oxygen Gradient',
    description: 'Step-by-step guide to calculating A-a gradient for hypoxemia workup.',
    steps: [
      { name: 'Enter Patient Age', text: 'Enter the patient\'s age in years to calculate the expected normal gradient.' },
      { name: 'Enter Arterial PaO2 and PaCO2', text: 'Enter the arterial partial pressures of oxygen (PaO2) and carbon dioxide (PaCO2) from an ABG in mmHg.' },
      { name: 'Enter Inspired FiO2 and Pressure', text: 'Enter the fraction of inspired oxygen (FiO2) and barometric pressure (default is sea level, 760 mmHg).' },
      { name: 'Interpret the Gradient', text: 'Compare the calculated A-a gradient with the expected age-adjusted normal. An elevated gradient suggests V/Q mismatch or shunt.' }
    ]
  },
};

export function getFaqSchema(path: string) {
  let faqs = faqSchemaDb[path];

  if (!faqs && path.startsWith('/fmp-medecine/')) {
    const slug = path.replace(/^\/fmp-medecine\//, '');
    const mod = FMP_MODULE_BY_SLUG[slug];
    if (mod && mod.rank <= 10) {
      faqs = [
        { question: `Qu'est-ce que le module ${mod.name} à la FMPC ?`, answer: `C'est un module officiel de la Faculté de Médecine et de Pharmacie de Casablanca enseigné en ${mod.year}. Il aborde principalement : ${mod.description}.` },
        { question: `Où trouver les cours PDF de ${mod.name} de médecine Casablanca ?`, answer: `Vous pouvez consulter et télécharger gratuitement le support complet en PDF du module ${mod.name} directement sur cette page de la bibliothèque CareCalculus.` },
        { question: `A quelle année d'étude correspond ce cours ?`, answer: `Ce module fait partie du programme officiel de la FMPC pour l'année : ${mod.year}.` }
      ];
    }
  }

  if (!faqs && path.startsWith('/ispits/')) {
    const slug = path.replace(/^\/ispits\//, '');
    const mod = ISPITS_MODULE_BY_SLUG[slug];
    if (mod) {
      faqs = [
        { question: `Qu'est-ce que le cours ${mod.name} en ISPITS ?`, answer: `C'est un cours officiel du programme des Instituts Supérieurs des Professions Infirmières et Techniques de Santé (ISPITS Maroc), enseigné au cours du semestre ${mod.semester}.` },
        { question: `Où télécharger le cours ${mod.name} d'études infirmières au Maroc ?`, answer: `Vous pouvez consulter et télécharger gratuitement les modules et cours d'infirmiers en format PDF directement sur CareCalculus.` },
        { question: `Quelles sont les spécialités concernées par le module ${mod.name} ?`, answer: `Ce module s'adresse aux étudiants des spécialités : ${mod.specialty} (Semestre ${mod.semester}) en ISPITS.` }
      ];
    }
  }

  if (!faqs) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function getHowToSchema(path: string) {
  const howTo = howToSchemaDb[path];
  if (!howTo) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function getFaqData(path: string) {
  return faqSchemaDb[path] ?? null;
}

/** Full JSON-LD graph (array) for a route. */
export function buildJsonLd(logicalPath: string, lang: LangCode) {
  const meta = getLocalizedMeta(logicalPath, lang);
  const url = pageUrl(logicalPath, lang);
  const list: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: meta.title,
      operatingSystem: 'Web Browser',
      applicationCategory: 'HealthApplication',
      description: meta.desc,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      url,
      inLanguage: lang,
      isAccessibleForFree: true,
      author: { '@type': 'Organization', name: 'CareCalculus', url: ORIGIN },
    },
  ];
  const medical = getMedicalSchema(logicalPath);
  if (medical) list.push(medical);
  const faq = getFaqSchema(logicalPath);
  if (faq) list.push(faq);
  const howTo = getHowToSchema(logicalPath);
  if (howTo) list.push(howTo);

  // Course schema for course pages
  if (logicalPath.startsWith('/cours')) {
    list.push({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: meta.title.split(' | ')[0],
      description: meta.desc,
      url,
      inLanguage: lang,
      isAccessibleForFree: true,
      provider: {
        '@type': 'Organization',
        name: 'CareCalculus',
        url: ORIGIN,
      },
      educationalLevel: 'Advanced',
      audience: {
        '@type': 'MedicalAudience',
        audienceType: 'Medical Students, Nurses, Physicians',
      },
    });
  }

  return list;
}

/** Sitewide Organization + WebSite node, emitted on every page for GEO/E-E-A-T. */
export function organizationJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'CareCalculus',
      url: ORIGIN,
      logo: `${ORIGIN}/icon.svg`,
      description:
        'Free, multilingual (English, French, Arabic) clinical calculators, medical scores and dosage tools for nurses, ICU specialists, emergency physicians and healthcare students.',
      sameAs: [
        'https://carecalculus.com',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CareCalculus',
      url: ORIGIN,
      inLanguage: ['en', 'fr', 'ar'],
    },
  ];
}

/** BreadcrumbList schema for calculator/content pages. */
export function getBreadcrumbSchema(logicalPath: string, lang: LangCode): any | null {
  if (logicalPath === '/' || logicalPath === '/home') return null;
  const meta = getLocalizedMeta(logicalPath, lang);
  const pageName = meta.title.split(' | ')[0];
  const homeLabel = lang === 'fr' ? 'Accueil' : lang === 'ar' ? 'الرئيسية' : 'Home';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'CareCalculus',
        item: ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: homeLabel,
        item: `${ORIGIN}${lang === 'en' ? '' : '/' + lang}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageName,
        item: pageUrl(logicalPath, lang),
      },
    ],
  };
}

export interface HeadModel {
  title: string;
  meta: RouteMeta;
  url: string;
  ogImage: string;
  jsonLd: any[];
  hreflang: { hreflang: string; href: string }[];
}

/** Compute the complete head model for a route (pure, no DOM). */
export function buildHead(logicalPath: string, lang: LangCode): HeadModel {
  const meta = getLocalizedMeta(logicalPath, lang);
  const url = pageUrl(logicalPath, lang);
  const pathSuffix = logicalPath === '/' ? '/map-calculator' : logicalPath;

  const hreflang: { hreflang: string; href: string }[] = (['en', 'fr', 'ar'] as LangCode[]).map((l) => ({
    hreflang: l as string,
    href: `${ORIGIN}${l === 'en' ? '' : '/' + l}${pathSuffix}`,
  }));
  hreflang.push({ hreflang: 'x-default', href: `${ORIGIN}${pathSuffix}` });

  const ogImageFileName = logicalPath === '/' ? 'index.png' : `${logicalPath.replace(/^\//, '')}.png`;
  const dynamicOgImage = `${ORIGIN}/og-images/${lang}/${ogImageFileName}`;

  return {
    title: meta.title,
    meta,
    url,
    ogImage: dynamicOgImage,
    jsonLd: [...buildJsonLd(logicalPath, lang), ...organizationJsonLd()],
    hreflang,
  };
}
