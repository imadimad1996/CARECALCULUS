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

export const ORIGIN = 'https://carecalculus.com';

const OG_IMAGE =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&h=630&q=80';

const nameEnMap: Record<string, string> = {
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
  '/presentations': 'Advanced Medical Presentations Library (PPTX)',
  '/cours': 'Accredited Clinical Course Syllabus (PDF)',
};

const nameFrMap: Record<string, string> = {
  '/map-calculator': 'Calculateur PAM - Pression Artérielle Moyenne',
  '/bmi-calculator': 'Calculateur IMC - Indice de Masse Corporelle',
  '/glasgow-coma-scale': 'Échelle de Glasgow - Calculateur Score GCS',
  '/drip-rate-calculator': 'Calcul Débit Perfusion et Gouttes par Minute',
  '/creatinine-clearance': 'Clairance de la Créatinine (Cockcroft-Gault)',
  '/wells-score': 'Score de Wells pour Phlébite et Embolie',
  '/medical-conversions': 'Conversions d’Unités Médicales (Glycémie, etc)',
  '/corrected-calcium': 'Calcul Calcium Corrigé par Albuminémie',
  '/qsofa-score': 'Score qSOFA Dépistage Sepsis Rapide',
  '/curb65-score': 'Score CURB-65 Sévérité de la Pneumonie',
  '/cha2ds2-vasc': 'Score CHA2DS2-VASc Evaluation Risque FA',
  '/phq9-score': 'Score PHQ-9 Evaluation de la Dépression',
  '/meld-score': 'Score MELD Pronostic Insuffisance Hépatique',
  '/sirs-criteria': 'Critères SIRS Syndrome Réponse Inflammatoire',
  '/pf-ratio': 'Rapport PaO2/FiO2 (Rapport P/F)',
  '/tidal-volume': 'Calcul du Volume Courant (Tidal)',
  '/anc-calculator': 'Nombre Absolu de Neutrophiles (NAN)',
  '/adjusted-body-weight': 'Calcul Poids Idéal et Poids Ajusté',
  '/steroid-conversion': 'Conversion de Corticoïdes Équivalents',
  '/blog': 'Journaux Médicaux Basés sur l’Évidence (2K+)',
  '/blog-articles': 'Blog CareCalculus — Astuces Cliniques & Actualités',
  '/presentations': 'Bibliothèque de Présentations Médicales (PPTX)',
  '/cours': 'Référentiel des Cours Académiques (PDF)',
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
  '/presentations': 'مكتبة العروض التقديمية الطبية (PPTX)',
  '/cours': 'مناهج المحاضرات والدروس السريرية (PDF)',
};

export interface RouteMeta {
  title: string;
  desc: string;
  keywords: string;
}

export function getLocalizedMeta(path: string, lang: LangCode): RouteMeta {
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
};

export function getMedicalSchema(path: string) {
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
      sameAs: [],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CareCalculus',
      url: ORIGIN,
      inLanguage: ['en', 'fr', 'ar'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${ORIGIN}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
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

  return {
    title: meta.title,
    meta,
    url,
    ogImage: OG_IMAGE,
    jsonLd: [...buildJsonLd(logicalPath, lang), ...organizationJsonLd()],
    hreflang,
  };
}
