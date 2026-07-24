import { Activity, AlertTriangle, Brain, Stethoscope, TestTube, Wind, HeartPulse, Baby, Users, Dna, Bug, MessageSquare, Syringe, Droplet } from 'lucide-react';

export const SPECIALTIES_DB = [
  {
    id: 'intensive-care',
    nameEn: 'Intensive Care (ICU)',
    nameFr: 'Réanimation (USI)',
    nameAr: 'العناية المركزة (ICU)',
    icon: Activity,
    descriptionEn: 'Critical care scoring systems, vasopressor dosing, and respiratory mechanics calculators for ICU clinicians.',
    descriptionFr: 'Systèmes de score de soins critiques, dosage des vasopresseurs et calculateurs de mécanique respiratoire pour les cliniciens en réanimation.',
    descriptionAr: 'أنظمة تسجيل العناية الحرجة، وحساب جرعات الأدوية الرافعة للضغط، وآليات التنفس لأطباء العناية المركزة.',
    calculators: ['map-calculator', 'glasgow-coma-scale', 'sofa-score', 'pf-ratio', 'drip-rate-calculator', 'tidal-volume', 'anion-gap']
  },
  {
    id: 'emergency-medicine',
    nameEn: 'Emergency Medicine',
    nameFr: 'Médecine d\'Urgence',
    nameAr: 'طب الطوارئ',
    icon: AlertTriangle,
    descriptionEn: 'Rapid triage tools, trauma scoring, and clinical decision rules tailored for the emergency department.',
    descriptionFr: 'Outils de triage rapide, score de traumatisme et règles de décision clinique adaptés aux services d\'urgence.',
    descriptionAr: 'أدوات الفرز السريع، وتقييم الإصابات، وقواعد القرار السريري المصممة لقسم الطوارئ.',
    calculators: ['qsofa-score', 'sirs-criteria', 'glasgow-coma-scale', 'curb65-score', 'wells-score', 'anion-gap']
  },
  {
    id: 'internal-medicine',
    nameEn: 'Internal Medicine',
    nameFr: 'Médecine Interne',
    nameAr: 'الطب الباطني',
    icon: Stethoscope,
    descriptionEn: 'Comprehensive medical calculators, risk stratification, and disease severity scores for internal medicine physicians.',
    descriptionFr: 'Calculateurs médicaux complets, stratification des risques et scores de gravité des maladies pour les médecins internistes.',
    descriptionAr: 'حاسبات طبية شاملة، وتقييم المخاطر، ودرجات شدة المرض لأطباء الطب الباطني.',
    calculators: ['bmi-calculator', 'adjusted-body-weight', 'corrected-calcium', 'phq9-score', 'steroid-conversion']
  },
  {
    id: 'nephrology',
    nameEn: 'Nephrology',
    nameFr: 'Néphrologie',
    nameAr: 'طب الكلى',
    icon: TestTube,
    descriptionEn: 'Renal function calculators, glomerular filtration rate (GFR) estimators, and acid-base analysis tools.',
    descriptionFr: 'Calculateurs de la fonction rénale, estimateurs du DFG et outils d\'analyse acido-basique.',
    descriptionAr: 'حاسبات وظائف الكلى، ومقدرات معدل الترشيح الكبيبي (GFR)، وأدوات تحليل الحمض والقاعدة.',
    calculators: ['creatinine-clearance', 'mdrd-gfr', 'ckd-epi-gfr', 'anion-gap']
  },
  {
    id: 'cardiology',
    nameEn: 'Cardiology',
    nameFr: 'Cardiologie',
    nameAr: 'طب القلب',
    icon: HeartPulse,
    descriptionEn: 'Cardiovascular risk assessment, anticoagulation scoring, and hemodynamic calculators for cardiology.',
    descriptionFr: 'Évaluation du risque cardiovasculaire, scores d\'anticoagulation et calculateurs hémodynamiques pour la cardiologie.',
    descriptionAr: 'تقييم مخاطر أمراض القلب والأوعية الدموية، وتسجيل مضادات التخثر، وحاسبات الدورة الدموية.',
    calculators: ['cha2ds2-vasc', 'map-calculator']
  },
  {
    id: 'pulmonology',
    nameEn: 'Pulmonology',
    nameFr: 'Pneumologie',
    nameAr: 'طب الرئة',
    icon: Wind,
    descriptionEn: 'Respiratory function calculators, pneumonia severity scores, and oxygenation indices.',
    descriptionFr: 'Calculateurs de la fonction respiratoire, scores de sévérité de la pneumonie et indices d\'oxygénation.',
    descriptionAr: 'حاسبات وظائف الجهاز التنفسي، ودرجات شدة الالتهاب الرئوي، ومؤشرات الأكسجة.',
    calculators: ['curb65-score', 'pf-ratio', 'aa-gradient', 'tidal-volume']
  },
  {
    id: 'neurology',
    nameEn: 'Neurology',
    nameFr: 'Neurologie',
    nameAr: 'طب الأعصاب',
    icon: Brain,
    descriptionEn: 'Neurological assessment scales, coma scoring, and stroke risk stratification tools.',
    descriptionFr: 'Échelles d\'évaluation neurologique, scores de coma et outils de stratification du risque d\'AVC.',
    descriptionAr: 'مقاييس التقييم العصبي، وتسجيل الغيبوبة، وأدوات تقييم مخاطر السكتة الدماغية.',
    calculators: ['glasgow-coma-scale', 'cha2ds2-vasc']
  },
  {
    id: 'pediatrics',
    nameEn: 'Pediatrics',
    nameFr: 'Pédiatrie',
    nameAr: 'طب الأطفال',
    icon: Baby,
    descriptionEn: 'Neonatal assessment scores, pediatric maintenance fluids, and weight-based dosing calculators.',
    descriptionFr: 'Scores d\'évaluation néonatale, fluides d\'entretien pédiatriques et calculateurs de dosage basés sur le poids.',
    descriptionAr: 'درجات التقييم لحديثي الولادة، وسوائل الصيانة للأطفال، وحاسبات الجرعات بناءً على الوزن.',
    calculators: ['apgar-score']
  },
  {
    id: 'obgyn',
    nameEn: 'Obstetrics & Gynecology',
    nameFr: 'Gynécologie Obstétrique',
    nameAr: 'أمراض النساء والولادة',
    icon: Users,
    descriptionEn: 'Pregnancy dating, fetal assessment scores, and maternal risk calculators.',
    descriptionFr: 'Datation de la grossesse, scores d\'évaluation fœtale et calculateurs de risque maternel.',
    descriptionAr: 'حساب تاريخ الحمل، ودرجات تقييم الجنين، وحاسبات المخاطر للأم.',
    calculators: []
  },
  {
    id: 'endocrinology',
    nameEn: 'Endocrinology',
    nameFr: 'Endocrinologie',
    nameAr: 'أمراض الغدد الصماء',
    icon: Dna,
    descriptionEn: 'Metabolic calculators, corrected electrolytes, and endocrine disorder risk scores.',
    descriptionFr: 'Calculateurs métaboliques, électrolytes corrigés et scores de risque de troubles endocriniens.',
    descriptionAr: 'حاسبات التمثيل الغذائي، وتصحيح الشوارد، ودرجات خطر اضطرابات الغدد الصماء.',
    calculators: ['corrected-calcium']
  },
  {
    id: 'gastroenterology',
    nameEn: 'Gastroenterology',
    nameFr: 'Gastroentérologie',
    nameAr: 'أمراض الجهاز الهضمي',
    icon: Stethoscope,
    descriptionEn: 'Liver disease severity scoring, GI bleed risk assessment, and hepatic calculators.',
    descriptionFr: 'Évaluation de la sévérité des maladies du foie, risque de saignement gastro-intestinal et calculateurs hépatiques.',
    descriptionAr: 'تقييم شدة أمراض الكبد، وتقييم مخاطر نزيف الجهاز الهضمي، وحاسبات الكبد.',
    calculators: ['meld-score', 'child-pugh-score']
  },
  {
    id: 'infectious-disease',
    nameEn: 'Infectious Disease',
    nameFr: 'Maladies Infectieuses',
    nameAr: 'الأمراض المعدية',
    icon: Bug,
    descriptionEn: 'Sepsis criteria, infection risk calculators, and targeted antimicrobial scoring.',
    descriptionFr: 'Critères de septicémie, calculateurs de risque d\'infection et scores antimicrobiens ciblés.',
    descriptionAr: 'معايير الإنتان، وحاسبات مخاطر العدوى، وتسجيل مضادات الميكروبات المستهدفة.',
    calculators: ['qsofa-score', 'sirs-criteria']
  },
  {
    id: 'psychiatry',
    nameEn: 'Psychiatry',
    nameFr: 'Psychiatrie',
    nameAr: 'الطب النفسي',
    icon: MessageSquare,
    descriptionEn: 'Mental health assessment tools, depression screening, and cognitive evaluation scores.',
    descriptionFr: 'Outils d\'évaluation de la santé mentale, dépistage de la dépression et scores d\'évaluation cognitive.',
    descriptionAr: 'أدوات تقييم الصحة العقلية، وفحص الاكتئاب، ودرجات التقييم المعرفي.',
    calculators: ['phq9-score']
  },
  {
    id: 'anesthesiology',
    nameEn: 'Anesthesiology',
    nameFr: 'Anesthésiologie',
    nameAr: 'طب التخدير',
    icon: Syringe,
    descriptionEn: 'Airway assessment, perioperative risk scores, and surgical evaluation calculators.',
    descriptionFr: 'Évaluation des voies respiratoires, scores de risque périopératoire et calculateurs d\'évaluation chirurgicale.',
    descriptionAr: 'تقييم مجرى الهواء، ودرجات المخاطر المحيطة بالجراحة، وحاسبات التقييم الجراحي.',
    calculators: ['map-calculator']
  },
  {
    id: 'hematology-oncology',
    nameEn: 'Hematology & Oncology',
    nameFr: 'Hématologie & Oncologie',
    nameAr: 'أمراض الدم والأورام',
    icon: Droplet,
    descriptionEn: 'Bleeding risk assessment, neutropenia calculators, and hematologic scoring.',
    descriptionFr: 'Évaluation du risque de saignement, calculateurs de neutropénie et scores hématologiques.',
    descriptionAr: 'تقييم مخاطر النزيف، وحاسبات قلة العدلات، والتسجيل الدموي.',
    calculators: ['has-bled-score', 'anc-calculator', 'wells-score']
  }
];
