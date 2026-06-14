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

const OG_IMAGE = 'https://carecalculus.com/og-image.png';

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
  '/orl': 'ORL / Laryngeal Cancer Specialization & Staging',
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
  '/orl': 'Specialisation ORL & Cancer du Larynx Staging',
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
  '/orl': 'تخصص الأنف والأذن والحنجرة وسرطان الحنجرة',
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
  '/orl': {
    '@type': 'MedicalWebPage',
    name: 'ORL / Laryngeal Cancer Specialization & Staging',
    aspect: 'Oncology & Laryngeal Assessment',
    about: [
      { '@type': 'MedicalCondition', name: 'Laryngeal Cancer' },
      { '@type': 'MedicalCondition', name: 'Head and Neck Squamous Cell Carcinoma' },
    ],
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
};

export function getFaqSchema(path: string) {
  const faqs = faqSchemaDb[path];
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

  return {
    title: meta.title,
    meta,
    url,
    ogImage: OG_IMAGE,
    jsonLd: [...buildJsonLd(logicalPath, lang), ...organizationJsonLd()],
    hreflang,
  };
}
