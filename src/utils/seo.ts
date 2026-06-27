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


import seoMaps from '../data/seoMaps.json';
import medicalSchemasRaw from '../data/medicalSchemas.json';
import faqDbRaw from '../data/faqDb.json';

const medicalSchemaDb: Record<string, any> = medicalSchemasRaw;
const faqSchemaDb: Record<string, { question: string; answer: string }[]> = faqDbRaw;
export const nameEnMap: Record<string, string> = seoMaps.nameEnMap;
const nameFrMap: Record<string, string> = seoMaps.nameFrMap;
const nameArMap: Record<string, string> = seoMaps.nameArMap;
const keywordsEnMap: Record<string, string> = (seoMaps as any).keywordsEnMap || {};

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
      desc: `Calculateur ${nameFr} gratuit — outil d'aide à la décision clinique utilisé par les médecins, urgentistes et infirmiers. Calcul instantané avec références PubMed, formules validées et support multilingue.`,
      keywords: `${nameFr.toLowerCase().replace(/[^a-zA-Z\s]/g, '')}, calculateur medical, guide, medecine`,
    };
  } else if (lang === 'ar') {
    return {
      title: `${nameAr} | CareCalculus`,
      desc: `حاسبة ${nameAr} المجانية — أداة دعم القرار السريري المستخدمة من قبل الأطباء وممرضي العناية المركزة والطوارئ. حساب فوري مع مراجع PubMed وصيغ معتمدة ودعم متعدد اللغات.`,
      keywords: `${nameAr}, حاسبة طبية, أدوات الأطباء, معادلة سريرية`,
    };
  }
  
  const customKeywords = keywordsEnMap[path];
  
  return {
    title: `${nameEn} | CareCalculus`,
    desc: `Free ${nameEn} — evidence-based clinical decision support tool used by ICU doctors, ER physicians, and nurses worldwide. Instant calculation with PubMed references, validated formulas, and multilingual support.`,
    keywords: customKeywords || `${nameEn.toLowerCase().replace(/[^a-zA-Z\s]/g, '')}, clinical calculator, medical metrics, care calculus`,
  };
}


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
        '@type': 'MedicalWebPage',
        medicalAudience: {
          '@type': 'MedicalAudience',
          audienceType: 'Clinicians, ICU Doctors, ER Emergency Physicians',
        },
        lastReviewed: '2025-01-15',
        reviewedBy: {
          '@type': 'Organization',
          name: 'CareCalculus Clinical Review Board'
        },
        ...node,
      }
    : null;
}

export function pageUrl(logicalPath: string, lang: LangCode): string {
  return `${ORIGIN}${lang === 'en' ? '' : '/' + lang}${logicalPath}`;
}


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
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${ORIGIN}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
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

  // Use the single verified OG image (per-page images are not generated yet)
  const dynamicOgImage = OG_IMAGE;

  return {
    title: meta.title,
    meta,
    url,
    ogImage: dynamicOgImage,
    jsonLd: [...buildJsonLd(logicalPath, lang), ...organizationJsonLd()],
    hreflang,
  };
}
