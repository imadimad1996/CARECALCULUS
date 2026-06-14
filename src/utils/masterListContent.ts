import { LangCode } from '../types';

export interface TranslationSet {
  en: string;
  fr: string;
  ar: string;
}

export interface MasterBlog {
  id: string;
  title: TranslationSet;
  snippet: TranslationSet;
  category: 'Clinical Tips' | 'News & Updates' | 'Editorial' | 'Practice' | 'Technology';
  readTime: number;
  date: string;
  author: string;
}

export interface MasterJournal {
  id: string;
  title: TranslationSet;
  snippet: TranslationSet;
  category: string;
  readTime: string;
  date: string;
  author: string;
  reviewer: string;
  doi: string;
  citationCount: number;
  clinicalImpact: TranslationSet;
}

export interface MasterCourse {
  id: string;
  title: TranslationSet;
  category: string;
  summary: TranslationSet;
  instructor: string;
  date: string;
  size: string;
  pages: number;
}

export interface MasterPresentation {
  id: string;
  title: TranslationSet;
  category: string;
  description: TranslationSet;
  author: string;
  date: string;
  size: string;
  slideCount: number;
}

export interface MasterOrl {
  id: string;
  title: TranslationSet;
  snippet: TranslationSet;
  category: string;
  readTime: string;
  date: string;
  author: string;
  reviewer: string;
  doi: string;
  citationCount: number;
  clinicalImpact: TranslationSet;
}

// 1. 30 MEDICAL BLOGS
export const MASTER_BLOGS: MasterBlog[] = [
  {
    id: 'mb-1',
    title: {
      en: 'What Are GLP-1 Medications and How Do They Work?',
      fr: 'Qu\'est-ce que les médicaments GLP-1 et comment fonctionnent-ils ?',
      ar: 'ما هي أدوية GLP-1 وكيف تعمل؟'
    },
    snippet: {
      en: 'An introductory guide to glucagon-like peptide-1 receptor agonists and their physiological actions.',
      fr: 'Un guide d\'introduction aux agonistes des récepteurs du GLP-1 et leurs actions physiologiques.',
      ar: 'دليل تمهيدي عن ناهضات مستقبلات الببتيد الشبيه بالغلوكاجون-1 وأفعالها الفسيولوجية.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-06-12',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-2',
    title: {
      en: 'Ozempic vs Wegovy: Key Differences Explained',
      fr: 'Ozempic vs Wegovy : Les différences clés expliquées',
      ar: 'أوزمبيك مقابل ويغوفي: شرح الفروق الرئيسية'
    },
    snippet: {
      en: 'Understanding the differences in indications, dosages, and outcomes between semaglutide formulations.',
      fr: 'Comprendre les différences d\'indications, de dosages et de résultats entre les formulations de sémaglutide.',
      ar: 'فهم الفروق في دواعي الاستعمال، والجرعات، والنتائج بين تركيبات السيماغلوتيد.'
    },
    category: 'Clinical Tips',
    readTime: 5,
    date: '2026-06-10',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-3',
    title: {
      en: 'Can GLP-1 Drugs Prevent Heart Disease?',
      fr: 'Les médicaments GLP-1 peuvent-ils prévenir les maladies cardiaques ?',
      ar: 'هل يمكن لأدوية GLP-1 الوقاية من أمراض القلب؟'
    },
    snippet: {
      en: 'Reviewing recent clinical trials on the cardiovascular protection offered by GLP-1 receptor agonists.',
      fr: 'Revue des essais cliniques récents sur la protection cardiovasculaire offerte par les agonistes du GLP-1.',
      ar: 'مراجعة التجارب السريرية الأخيرة حول حماية القلب والأوعية الدموية التي تقدمها أدوية GLP-1.'
    },
    category: 'News & Updates',
    readTime: 5,
    date: '2026-06-08',
    author: 'Dr. Al-Faruqi, MD'
  },
  {
    id: 'mb-4',
    title: {
      en: 'GLP-1 and Kidney Health: What the Evidence Shows',
      fr: 'GLP-1 et santé rénale : Ce que montrent les preuves',
      ar: 'GLP-1 وصحة الكلى: ما الذي توضحه الأدلة'
    },
    snippet: {
      en: 'Exploring diabetic nephropathy trials and how GLP-1 medications protect glomerular filtration.',
      fr: 'Exploration des essais sur la néphropathie diabétique et de la protection du GLP-1 sur la filtration glomérulaire.',
      ar: 'استكشاف تجارب اعتلال الكلى السكري وكيفية حماية أدوية GLP-1 للترشيح الكبيبي.'
    },
    category: 'Practice',
    readTime: 4,
    date: '2026-06-06',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-5',
    title: {
      en: 'Food as Medicine: Scientific Evidence for Better Outcomes',
      fr: 'L\'alimentation comme médecine : Preuves scientifiques pour de meilleurs résultats',
      ar: 'الغذاء كدواء: الأدلة العلمية لتحقيق نتائج أفضل'
    },
    snippet: {
      en: 'Evaluating clinical nutritional therapies and dietary impact on metabolic diseases.',
      fr: 'Évaluation des thérapies nutritionnelles cliniques et de l\'impact du régime sur les maladies métaboliques.',
      ar: 'تقييم العلاجات الغذائية السريرية وتأثير النظام الغذائي على الأمراض الاستقلابية.'
    },
    category: 'Editorial',
    readTime: 3,
    date: '2026-06-04',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-6',
    title: {
      en: 'How AI Is Transforming Healthcare in 2026',
      fr: 'Comment l\'IA transforme les soins de santé en 2026',
      ar: 'كيف يغير الذكاء الاصطناعي الرعاية الصحية في عام 2026'
    },
    snippet: {
      en: 'A review of generative models and automation tools currently in active clinical environments.',
      fr: 'Revue des modèles génératifs et outils d\'automatisation dans les environnements cliniques actifs.',
      ar: 'مراجعة للنماذج التوليدية وأدوات الأتمتة المستخدمة حالياً في البيئات السريرية النشطة.'
    },
    category: 'Technology',
    readTime: 4,
    date: '2026-06-02',
    author: 'CareCalculus Engineering'
  },
  {
    id: 'mb-7',
    title: {
      en: 'Wearable Health Devices: Benefits and Limitations',
      fr: 'Appareils de santé connectés : Avantages et limites',
      ar: 'الأجهزة الصحية القابلة للارتداء: الفوائد والقيود'
    },
    snippet: {
      en: 'Analyzing consumer smartwatches, portable ECGs, and their false positive rates in clinical practice.',
      fr: 'Analyse des montres connectées, ECG portables et leurs taux de faux positifs en pratique clinique.',
      ar: 'تحليل الساعات الذكية الاستهلاكية، وأجهزة تخطيط القلب المحمولة، ومعدلات إيجابيتها الكاذبة.'
    },
    category: 'Technology',
    readTime: 4,
    date: '2026-05-31',
    author: 'Dr. Marcus Thorne, Ph.D.'
  },
  {
    id: 'mb-8',
    title: {
      en: 'The Future of Remote Patient Monitoring',
      fr: 'L\'avenir de la surveillance à distance des patients',
      ar: 'مستقبل مراقبة المرضى عن بعد'
    },
    snippet: {
      en: 'How home telemetry and automated alert algorithms reduce re-admission rates for heart failure.',
      fr: 'Comment la télémétrie à domicile et les alertes automatisées réduisent les réadmissions pour insuffisance cardiaque.',
      ar: 'كيف تقلل القياسات البعيدة في المنزل وخوارزميات التنبيه التلقائي من معدلات إعادة إدخال مرضى فشل القلب.'
    },
    category: 'Technology',
    readTime: 5,
    date: '2026-05-29',
    author: 'CareCalculus Engineering'
  },
  {
    id: 'mb-9',
    title: {
      en: 'Understanding Long COVID: Latest Research Updates',
      fr: 'Comprendre le COVID long : Dernières mises à jour de la recherche',
      ar: 'فهم كوفيد طويل الأمد: آخر تحديثات الأبحاث'
    },
    snippet: {
      en: 'Evaluating metabolic pathways, mitochondrial fatigue, and clinical options for persistent post-viral syndromics.',
      fr: 'Évaluation des voies métaboliques, de la fatigue mitochondriale et des options cliniques post-virales.',
      ar: 'تقييم المسارات الاستقلابية، والتعب الميتوكوندري، والخيارات السريرية للمتلازمات المستمرة بعد الفيروس.'
    },
    category: 'News & Updates',
    readTime: 5,
    date: '2026-05-27',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-10',
    title: {
      en: 'Top Causes of Stroke in Young Adults',
      fr: 'Principales causes d\'AVC chez les jeunes adultes',
      ar: 'أهم أسباب السكتة الدماغية لدى الشباب'
    },
    snippet: {
      en: 'Identifying risk profiles beyond classical atherosclerosis: dissection, patent foramen ovale, and hypercoagulability.',
      fr: 'Identification des profils de risque au-delà de l\'athérosclérose classique : dissection, FOP et hypercoagulabilité.',
      ar: 'تحديد ملامح الخطورة خارج تصلب الشرايين الكلاسيكي: التسلخ، والثقب البيضاوي السالكة، وفرط الخثرات.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-05-25',
    author: 'Dr. Al-Faruqi, MD'
  },
  {
    id: 'mb-11',
    title: {
      en: 'Early Warning Signs of Stroke Everyone Should Know',
      fr: 'Signes d\'alerte précoce de l\'AVC que tout le monde devrait connaître',
      ar: 'علامات التحذير المبكرة للسكتة الدماغية التي يجب على الجميع معرفتها'
    },
    snippet: {
      en: 'Clinical overview of the FAST criteria, atypical presentations, and time-critical pathways.',
      fr: 'Aperçu clinique des critères FAST, des présentations atypiques et des urgences vitales liées au temps.',
      ar: 'نظرة عامة سريرية على معايير FAST، والأعراض غير النمطية، والمسارات الحساسة للوقت.'
    },
    category: 'Clinical Tips',
    readTime: 3,
    date: '2026-05-23',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-12',
    title: {
      en: 'Diabetes Prevention Strategies Backed by Science',
      fr: 'Stratégies de prévention du diabète appuyées par la science',
      ar: 'استراتيجيات الوقاية من السكري المدعومة بالعلم'
    },
    snippet: {
      en: 'Review of randomized lifestyle intervention trials, metformin protocols, and early biomarkers.',
      fr: 'Revue des essais d\'intervention sur le mode de vie, protocoles metformine et biomarqueurs précoces.',
      ar: 'مراجعة لتجارب نمط الحياة العشوائية، وبروتوكولات الميتفورمين، والمؤشرات الحيوية المبكرة.'
    },
    category: 'Practice',
    readTime: 4,
    date: '2026-05-21',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-13',
    title: {
      en: 'Understanding Prediabetes Before It Becomes Diabetes',
      fr: 'Comprendre le prédiabète avant qu\'il ne devienne un diabète',
      ar: 'فهم مرحلة ما قبل السكري قبل أن تتحول إلى سكري'
    },
    snippet: {
      en: 'Impaired glucose tolerance thresholds, HbA1c screening guidelines, and organ preservation basics.',
      fr: 'Seuils d\'intolérance au glucose, directives de dépistage de l\'HbA1c et préservation des organes.',
      ar: 'حدود خلل تحمل الجلوكوز، وإرشادات فحص HbA1c، وأساسيات الحفاظ على الأعضاء.'
    },
    category: 'Practice',
    readTime: 4,
    date: '2026-05-19',
    author: 'Dr. Al-Faruqi, MD'
  },
  {
    id: 'mb-14',
    title: {
      en: 'Hypertension: New Guidelines for Patients and Clinicians',
      fr: 'Hypertension : Nouvelles directives pour les patients et les cliniciens',
      ar: 'ارتفاع ضغط الدم: إرشادات جديدة للمرضى والأطباء'
    },
    snippet: {
      en: 'Analyzing ACC/AHA and ESC classification discrepancies, drug combinations, and home measurement guidelines.',
      fr: 'Analyse des divergences ACC/AHA et ESC, combinaisons de médicaments et mesure à domicile.',
      ar: 'تحليل الاختلافات بين إرشادات ACC/AHA وESC، والتوليفات الدوائية، والقياس المنزلي.'
    },
    category: 'News & Updates',
    readTime: 5,
    date: '2026-05-17',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-15',
    title: {
      en: 'Obesity and Metabolic Syndrome Explained',
      fr: 'L\'obésité et le syndrome métabolique expliqués',
      ar: 'شرح السمنة والمتلازمة التمثيلية'
    },
    snippet: {
      en: 'Pathology of visceral adiposity, insulin resistance cascades, and therapeutic index options.',
      fr: 'Pathologie de l\'adiposité viscérale, résistance à l\'insuline et options d\'index thérapeutiques.',
      ar: 'أمراض السمنة الحشوية، وسلسلة مقاومة الأنسولين، وخيارات المؤشرات العلاجية.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-05-15',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-16',
    title: {
      en: 'The Science of Healthy Aging and Longevity',
      fr: 'La science du vieillissement sain et de la longévité',
      ar: 'علم الشيخوخة الصحي وطول العمر'
    },
    snippet: {
      en: 'Exploring sirtuins, mTOR pathway inhibitors, cellular senescence kinetics, and lifestyle factors.',
      fr: 'Exploration des sirtuines, inhibiteurs mTOR, sénescence cellulaire et hygiène de vie.',
      ar: 'استكشاف السيرتوينات، ومثبطات مسار mTOR، وحركية الهرم الخلوي، وعوامل نمط الحياة.'
    },
    category: 'Editorial',
    readTime: 5,
    date: '2026-05-13',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-17',
    title: {
      en: 'Sleep Optimization for Better Health',
      fr: 'Optimisation du sommeil pour une meilleure santé',
      ar: 'تحسين النوم من أجل صحة أفضل'
    },
    snippet: {
      en: 'Sleep architecture dynamics, glymphatic clearance, and metabolic consequences of chronic insomnia.',
      fr: 'Dynamique du sommeil, clairance glymphatique et conséquences métaboliques de l\'insomnie.',
      ar: 'ديناميكيات بنية النوم، والتصفية الجليمفاوية، والعواقب الاستقلابية للأرق المزمن.'
    },
    category: 'Clinical Tips',
    readTime: 3,
    date: '2026-05-11',
    author: 'Dr. Marcus Thorne, Ph.D.'
  },
  {
    id: 'mb-18',
    title: {
      en: 'The Gut Microbiome and Human Health',
      fr: 'Le microbiome intestinal et la santé humaine',
      ar: 'الميكروبيوم المعوي وصحة الإنسان'
    },
    snippet: {
      en: 'Evaluating short-chain fatty acids (SCFAs), gut-brain axis, and post-antibiotic reconstitution.',
      fr: 'Évaluation des acides gras à chaîne courte, de l\'axe intestin-cerveau et de la flore post-antibiotique.',
      ar: 'تقييم الأحماض الدهنية قصيرة السلسلة (SCFAs)، ومحور الأمعاء والدماغ، وإعادة بناء الفلورا بعد المضادات.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-05-09',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-19',
    title: {
      en: 'Vitamin D Deficiency: Symptoms and Treatment',
      fr: 'Carence en vitamine D : Symptômes et traitement',
      ar: 'نقص فيتامين د: الأعراض والعلاج'
    },
    snippet: {
      en: 'Bone metabolic pathways, immune regulation roles, and safe replacement guidelines for adults.',
      fr: 'Voies métaboliques osseuses, régulation immunitaire et supplémentation sécurisée pour les adultes.',
      ar: 'مسارات استقلاب العظام، وأدوار التنظيم المناعي، وإرشادات الاستبدال الآمن للبالغين.'
    },
    category: 'Practice',
    readTime: 3,
    date: '2026-05-07',
    author: 'Dr. Al-Faruqi, MD'
  },
  {
    id: 'mb-20',
    title: {
      en: 'Iron Deficiency Anemia: Diagnosis and Management',
      fr: 'Anémie ferriprive : Diagnostic et traitement',
      ar: 'أنيميا نقص الحديد: التشخيص والعلاج'
    },
    snippet: {
      en: 'Differential diagnosis with ferritin and transferrin, oral vs intravenous replacement, and guidelines.',
      fr: 'Diagnostic différentiel (ferritine, transferrine), fer oral vs intraveineux et recommandations.',
      ar: 'التشخيص التفريقي باستخدام الفيريتين والترانسفيرين، واستبدال الحديد الفموي مقابل الوريدي.'
    },
    category: 'Practice',
    readTime: 4,
    date: '2026-05-05',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-21',
    title: {
      en: 'Cancer Screening Recommendations for Adults',
      fr: 'Recommandations de dépistage du cancer pour les adultes',
      ar: 'توصيات فحص السرطان للبالغين'
    },
    snippet: {
      en: 'USPSTF updates on colonoscopy, mammography, lung CT guidelines, and patient risk profiles.',
      fr: 'Mises à jour de l\'USPSTF sur la coloscopie, mammographie, scanner pulmonaire et profils de risque.',
      ar: 'تحديثات USPSTF بشأن تنظير القولون، وتصوير الثدي، والتصوير المقطعي للرئة.'
    },
    category: 'News & Updates',
    readTime: 5,
    date: '2026-05-03',
    author: 'Dr. Al-Faruqi, MD'
  },
  {
    id: 'mb-22',
    title: {
      en: 'Understanding HPV and Cancer Prevention',
      fr: 'Comprendre le VPH et la prévention du cancer',
      ar: 'فهم فيروس الورم الحليمي البشري والوقاية من السرطان'
    },
    snippet: {
      en: 'HPV transmission dynamics, screening methods, vaccination impact, and head & neck margins.',
      fr: 'Transmission du VPH, méthodes de dépistage, impact de la vaccination et cancers tête et cou.',
      ar: 'ديناميكيات انتقال HPV، وطرق الفحص، وتأثير التطعيم، وأورام الرأس والعنق.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-05-01',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-23',
    title: {
      en: 'Mental Health and Physical Health Connections',
      fr: 'Liens entre santé mentale et santé physique',
      ar: 'الروابط بين الصحة النفسية والصحة الجسدية'
    },
    snippet: {
      en: 'Endocrine stress responses, cytokine pathways in depression, and integrated clinical models.',
      fr: 'Réponse endocrine au stress, voies des cytokines dans la dépression et modèles cliniques intégrés.',
      ar: 'استجابات الإجهاد الغدية، ومسارات السيتوكين في الاكتئاب، والنماذج السريرية المتكاملة.'
    },
    category: 'Editorial',
    readTime: 3,
    date: '2026-04-28',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-24',
    title: {
      en: 'Evidence-Based Weight Loss Strategies',
      fr: 'Stratégies de perte de poids basées sur des preuves',
      ar: 'استراتيجيات إنقاص الوزن القائمة على الأدلة'
    },
    snippet: {
      en: 'Comparing calorie restriction, macronutrient variations, and pharmacotherapeutic strategies.',
      fr: 'Comparaison de la restriction calorique, variations de macronutriments et pharmacothérapie.',
      ar: 'مقارنة تقييد السعرات الحرارية، واختلافات المغذيات الكبيرة، والاستراتيجيات الدوائية.'
    },
    category: 'Practice',
    readTime: 4,
    date: '2026-04-26',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-25',
    title: {
      en: 'Nutrition Myths Debunked by Science',
      fr: 'Mythes de la nutrition démystifiés par la science',
      ar: 'خرافات التغذية التي دحظها العلم'
    },
    snippet: {
      en: 'Separating marketing claims from biochemical facts: keto, fasting, and detox reviews.',
      fr: 'Séparer le marketing des faits biochimiques : céto, jeûne et cures détox.',
      ar: 'فصل الادعاءات التسويقية عن الحقائق الكيميائية الحيوية: الكيتو، والصيام، والديتوكس.'
    },
    category: 'Editorial',
    readTime: 4,
    date: '2026-04-24',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-26',
    title: {
      en: 'How Artificial Intelligence Assists Medical Diagnosis',
      fr: 'Comment l\'intelligence artificielle aide au diagnostic médical',
      ar: 'كيف يساعد الذكاء الاصطناعي في التشخيص الطبي'
    },
    snippet: {
      en: 'Deep learning in dermatology, ECG analysis, and electronic record triggers.',
      fr: 'Apprentissage profond en dermatologie, analyse de l\'ECG et alertes du dossier médical.',
      ar: 'التعلم العميق في أمراض الجلد، وتحليل تخطيط القلب، وتنبيهات السجلات الإلكترونية.'
    },
    category: 'Technology',
    readTime: 4,
    date: '2026-04-22',
    author: 'Dr. Marcus Thorne, Ph.D.'
  },
  {
    id: 'mb-27',
    title: {
      en: 'Medical Imaging AI: Opportunities and Challenges',
      fr: 'L\'IA en imagerie médicale : Opportunités et défis',
      ar: 'الذكاء الاصطناعي في التصوير الطبي: الفرص والتحديات'
    },
    snippet: {
      en: 'CT fracture detection algorithms, MRI segmentations, and liability questions in diagnosis.',
      fr: 'Détection de fractures au scanner, segmentation IRM et questions de responsabilité légale.',
      ar: 'خوارزميات الكشف عن الكسور بالتصوير المقطعي، وتجزئة الرنين، والمسؤولية القانونية.'
    },
    category: 'Technology',
    readTime: 5,
    date: '2026-04-20',
    author: 'CareCalculus Engineering'
  },
  {
    id: 'mb-28',
    title: {
      en: 'Precision Medicine Explained',
      fr: 'La médecine de précision expliquée',
      ar: 'شرح الطب الدقيق'
    },
    snippet: {
      en: 'Pharmacogenomics, matching oncology therapeutics to somatic gene variations, and patient cohorts.',
      fr: 'Pharmacogénomique, thérapies ciblées en oncologie selon les gènes tumoraux et cohortes.',
      ar: 'علم الصيدلة الجيني، ومطابقة علاجات الأورام للاختلافات الجينية، ومجموعات المرضى.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-04-18',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-29',
    title: {
      en: 'Digital Health Trends Shaping the Future',
      fr: 'Tendances de la santé numérique qui façonnent l\'avenir',
      ar: 'اتجاهات الصحة الرقمية التي تشكل المستقبل'
    },
    snippet: {
      en: 'Decentralized trials, smart implants, virtual hospital networks, and cloud clinical structures.',
      fr: 'Essais cliniques décentralisés, implants connectés, hôpitaux virtuels et cloud médical.',
      ar: 'التجارب السريرية اللامركزية، والزرعات الذكية، وشبكات المستشفيات الافتراضية، والحوسبة السحابية.'
    },
    category: 'Technology',
    readTime: 4,
    date: '2026-04-16',
    author: 'CareCalculus Engineering'
  },
  {
    id: 'mb-30',
    title: {
      en: 'Telemedicine Best Practices',
      fr: 'Bonnes pratiques en télémédecine',
      ar: 'أفضل ممارسات الطب عن بعد'
    },
    snippet: {
      en: 'Virtual evaluation parameters, camera calibration setups, and patient privacy frameworks.',
      fr: 'Paramètres d\'évaluation virtuelle, réglages caméra et conformité RGPD/HIPAA.',
      ar: 'معايير التقييم الافتراضي، وإعدادات الكاميرا، وأطر خصوصية المريض.'
    },
    category: 'Practice',
    readTime: 3,
    date: '2026-04-14',
    author: 'Dr. Jean-Pierre Dupont, MD'
  }
];

// 2. 20 MEDICAL JOURNALS
export const MASTER_JOURNALS: MasterJournal[] = [
  {
    id: 'mj-1',
    title: {
      en: 'Systematic Review of GLP-1 Receptor Agonists in Obesity Management',
      fr: 'Revue systématique des agonistes des récepteurs du GLP-1 dans le traitement de l\'obésité',
      ar: 'مراجعة منهجية لناهضات مستقبلات GLP-1 في علاج السمنة'
    },
    snippet: {
      en: 'A high-impact meta-analysis evaluating weight loss percentage, satiety markers, and long-term safety profiles.',
      fr: 'Une méta-analyse à fort impact évaluant le pourcentage de perte de poids, la satiété et la tolérance à long terme.',
      ar: 'تحليل شمولي عالي الأثر لتقييم نسبة إنقاص الوزن، ومؤشرات الشبع، ومستويات السلامة على المدى الطويل.'
    },
    category: 'Critical Care',
    readTime: '8 min read',
    date: '2026-06-11',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/obs.2026.11',
    citationCount: 88,
    clinicalImpact: {
      en: 'GLP-1 receptor agonists showed a mean weight reduction of 14.9% over 52 weeks in non-diabetic obesity cohorts.',
      fr: 'Les agonistes du GLP-1 ont montré une réduction pondérale moyenne de 14,9 % sur 52 semaines chez les obèses non diabétiques.',
      ar: 'أظهرت ناهضات GLP-1 انخفاضاً متوسطاً في الوزن بنسبة 14.9٪ على مدار 52 أسبوعاً لدى مجموعات السمنة غير المصابة بالسكري.'
    }
  },
  {
    id: 'mj-2',
    title: {
      en: 'Artificial Intelligence in Clinical Decision Support: A Review',
      fr: 'L\'intelligence artificielle dans l\'aide à la décision clinique : Une revue',
      ar: 'الذكاء الاصطناعي في دعم القرار السريري: مراجعة'
    },
    snippet: {
      en: 'Evaluating electronic health record integrated alerts and patient mortality prediction model accuracies.',
      fr: 'Évaluation des alertes intégrées au dossier médical et de la précision des modèles de prédiction de la mortalité.',
      ar: 'تقييم التنبيهات المدمجة بالسجل الصحي الإلكتروني ودقة نماذج التنبؤ بمعدلات وفيات المرضى.'
    },
    category: 'Diagnostics',
    readTime: '9 min read',
    date: '2026-06-07',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1016/ai.cds.2026.04',
    citationCount: 65,
    clinicalImpact: {
      en: 'Automated decision support decreased clinical sepsis triage times by 32 minutes in emergency cohorts.',
      fr: 'Le support de décision automatisé a réduit le temps de triage du sepsis de 32 minutes aux urgences.',
      ar: 'قلل دعم القرار المؤتمت من وقت فرز الإنتان السريري بمقدار 32 دقيقة في الطوارئ.'
    }
  },
  {
    id: 'mj-3',
    title: {
      en: 'Machine Learning Applications in Medical Imaging',
      fr: 'Applications de l\'apprentissage automatique en imagerie médicale',
      ar: 'تطبيقات التعلم الآلي في التصوير الطبي'
    },
    snippet: {
      en: 'Analyzing convolutional neural networks in stroke detection, lesion segmentation, and chest radiograph analysis.',
      fr: 'Analyse des réseaux neuronaux convolutifs pour la détection d\'AVC, segmentation de lésions et radiographies.',
      ar: 'تحليل الشبكات العصبية الالتفافية في الكشف عن السكتة الدماغية، وتجزئة الآفات، وتصوير الصدر.'
    },
    category: 'Diagnostics',
    readTime: '10 min read',
    date: '2026-06-03',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1002/mrmi.2026.12',
    citationCount: 104,
    clinicalImpact: {
      en: 'CNN algorithms achieved 96.2% sensitivity for intracranial hemorrhage detection on emergency head CT scans.',
      fr: 'Les algorithmes CNN ont atteint 96,2 % de sensibilité pour détecter les hémorragies intracrâniennes sur scanner.',
      ar: 'حققت خوارزميات CNN حساسية بنسبة 96.2٪ للكشف عن النزيف داخل الجمجمة في الأشعة المقطعية للطوارئ.'
    }
  },
  {
    id: 'mj-4',
    title: {
      en: 'Digital Health Technologies and Patient Outcomes',
      fr: 'Technologies de santé numérique et résultats pour les patients',
      ar: 'تقنيات الصحة الرقمية ونتائج المرضى'
    },
    snippet: {
      en: 'Evaluating mobile health apps, telemetry portals, and their correlations with chronic disease compliance.',
      fr: 'Évaluation des applications mobiles, portails de télémétrie et observance thérapeutique des maladies chroniques.',
      ar: 'تقييم تطبيقات الصحة المحمولة، وبوابات القياس عن بعد، وارتباطها بالالتزام بعلاج الأمراض المزمنة.'
    },
    category: 'Diagnostics',
    readTime: '7 min read',
    date: '2026-05-28',
    author: 'Dr. Rachel Goldstein, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/j.dhealth.2026.02',
    citationCount: 41,
    clinicalImpact: {
      en: 'Active app reminders improved medication compliance in hypertensive cohorts by 22.4%.',
      fr: 'Les rappels actifs d\'applications ont amélioré l\'observance du traitement de l\'hypertension de 22,4 %.',
      ar: 'حسّنت تذكيرات التطبيقات النشطة من الالتزام بتناول الدواء لدى مرضى ضغط الدم بنسبة 22.4٪.'
    }
  },
  {
    id: 'mj-5',
    title: {
      en: 'Food-as-Medicine Interventions: Current Evidence',
      fr: 'Interventions d\'alimentation-médecine : Preuves actuelles',
      ar: 'تدخلات الغذاء كدواء: الأدلة الحالية'
    },
    snippet: {
      en: 'Systematic review of medically tailored meals, dietary prescriptions, and metabolic indices control.',
      fr: 'Revue systématique des repas médicalisés, prescriptions diététiques et contrôle des indices métaboliques.',
      ar: 'مراجعة منهجية للوجبات المصممة طبياً، والوصفات الغذائية، والتحكم في المؤشرات الاستقلابية.'
    },
    category: 'Pharmacology',
    readTime: '8 min read',
    date: '2026-05-24',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/jnut.2026.05',
    citationCount: 33,
    clinicalImpact: {
      en: 'Tailored meal interventions achieved a mean HbA1c reduction of 0.8% in poorly controlled type 2 diabetes.',
      fr: 'Les repas médicalisés ont permis une baisse moyenne d\'HbA1c de 0,8 % dans le diabète de type 2 mal contrôlé.',
      ar: 'حققت تدخلات الوجبات المخصصة انخفاضاً متوسطاً في HbA1c بنسبة 0.8٪ في مرضى السكري غير المنضبط.'
    }
  },
  {
    id: 'mj-6',
    title: {
      en: 'Wearable Devices for Chronic Disease Monitoring',
      fr: 'Appareils connectés pour le suivi des maladies chroniques',
      ar: 'الأجهزة القابلة للارتداء لمراقبة الأمراض المزمنة'
    },
    snippet: {
      en: 'Continuous glucose monitors, wearable heart monitors, and their impact on clinical intervention rates.',
      fr: 'Capteurs de glucose en continu, moniteurs cardiaques portables et taux d\'intervention clinique.',
      ar: 'أجهزة مراقبة الجلوكوز المستمرة، وأجهزة مراقبة القلب القابلة للارتداء، وأثرها في نسب التدخل السريري.'
    },
    category: 'Cardiology',
    readTime: '9 min read',
    date: '2026-05-20',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1016/j.jcard.2026.03',
    citationCount: 57,
    clinicalImpact: {
      en: 'Continuous glucose monitor deployment reduced severe hypoglycemic events by 40.8% in type 1 diabetics.',
      fr: 'Le déploiement de capteurs de glucose en continu a réduit les hypoglycémies sévères de 40,8 % chez les diabétiques type 1.',
      ar: 'قلل استخدام أجهزة مراقبة الجلوكوز المستمرة من نوبات نقص السكر الحادة بنسبة 40.8٪ لدى مرضى النوع الأول.'
    }
  },
  {
    id: 'mj-7',
    title: {
      en: 'Precision Medicine in Oncology: Current Status',
      fr: 'La médecine de précision en oncologie : État actuel',
      ar: 'الطب الدقيق في علم الأورام: الوضع الحالي'
    },
    snippet: {
      en: 'Targeted tumor sequencing, matching patient mutations with immunotherapies, and clinical trials outcomes.',
      fr: 'Séquençage tumoral ciblé, ciblage thérapeutique des mutations et résultats des essais cliniques.',
      ar: 'تسلسل الأورام المستهدفة، ومطابقة طفرات المرضى مع العلاجات المناعية، ونتائج التجارب السريرية.'
    },
    category: 'Critical Care', // Oncology fits here or custom
    readTime: '9 min read',
    date: '2026-05-16',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/onc.2026.08',
    citationCount: 79,
    clinicalImpact: {
      en: 'Genomically matched targeted therapy improved progression-free survival by 3.8 months in refractory carcinomas.',
      fr: 'Les thérapies ciblées appariées par génomique ont amélioré la survie sans progression de 3,8 mois.',
      ar: 'حسّن العلاج المستهدف المتطابق جينياً من البقاء الخالي من تقدم المرض بمقدار 3.8 أشهر في الأورام المقاومة.'
    }
  },
  {
    id: 'mj-8',
    title: {
      en: 'Advances in Stroke Prevention and Management',
      fr: 'Progrès dans la prévention et la prise en charge de l\'AVC',
      ar: 'التطورات في الوقاية من السكتة الدماغية وإدارتها'
    },
    snippet: {
      en: 'Comparing surgical thrombectomy windows, dual antiplatelet strategies, and early carotid interventions.',
      fr: 'Comparaison des fenêtres de thrombectomie chirurgicale, antiagrégants plaquettaires et carotidiennes.',
      ar: 'مقارنة فترات استئصال الخثرة الجراحي، واستراتيجيات مضادات الصفائح المزدوجة، والتدخلات السباتية المبكرة.'
    },
    category: 'Cardiology',
    readTime: '8 min read',
    date: '2026-05-12',
    author: 'Dr. Al-Faruqi, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/j.stroke.2026.02',
    citationCount: 92,
    clinicalImpact: {
      en: 'Thrombectomy extension to 24 hours in selected anterior circulation strokes improved functional independence.',
      fr: 'L\'extension de la thrombectomie à 24 heures a amélioré l\'indépendance fonctionnelle des patients.',
      ar: 'حسّن تمديد استئصال الخثرة إلى 24 ساعة في سكتات الدوران الأمامي المختارة من الاستقلال الوظيفي.'
    }
  },
  {
    id: 'mj-9',
    title: {
      en: 'Recent Developments in Diabetes Research',
      fr: 'Développements récents dans la recherche sur le diabète',
      ar: 'التطورات الأخيرة في أبحاث السكري'
    },
    snippet: {
      en: 'Exploring stem-cell islet cells transplantation, once-weekly basal insulins, and kidney protective metrics.',
      fr: 'Exploration de la greffe de cellules souches d\'îlots, insulines basales hebdomadaires et protection rénale.',
      ar: 'استكشاف زراعة خلايا الجزر الجذعية، والأنسولين الأساسي الأسبوعي، ومقاييس حماية الكلى.'
    },
    category: 'Nephrology',
    readTime: '8 min read',
    date: '2026-05-08',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/diab.2026.04',
    citationCount: 46,
    clinicalImpact: {
      en: 'Weekly insulin icodec demonstrated equivalent glycemic control and non-inferiority compared to daily glargine.',
      fr: 'L\'insuline icodec hebdomadaire a montré un contrôle glycémique équivalent à la glargine quotidienne.',
      ar: 'أظهر الأنسولين الأسبوعي (إيكوديك) تحكماً مكافئاً في السكر مقارنة بالغلاجين اليومي.'
    }
  },
  {
    id: 'mj-10',
    title: {
      en: 'Longitudinal Analysis of Hypertension Risk Factors',
      fr: 'Analyse longitudinale des facteurs de risque de l\'hypertension',
      ar: 'التحليل الطولي لعوامل خطر ارتفاع ضغط الدم'
    },
    snippet: {
      en: 'A 10-year cohort study evaluating arterial stiffness, dietary sodium, genetics, and clinical pressures.',
      fr: 'Étude de cohorte sur 10 ans évaluant la rigidité artérielle, le sodium alimentaire et la génétique.',
      ar: 'دراسة تتبعية مدتها 10 سنوات لتقييم تصلب الشرايين، والصوديوم الغذائي، والجينات، والضغوط السريرية.'
    },
    category: 'Cardiology',
    readTime: '10 min read',
    date: '2026-05-04',
    author: 'Dr. Jean-Pierre Dupont, MD',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1016/j.hyper.2026.01',
    citationCount: 51,
    clinicalImpact: {
      en: 'Each 1000mg decrease in daily sodium intake correlated with a 3.4 mmHg drop in systolic arterial pressure.',
      fr: 'Chaque réduction de 1000mg de sodium quotidien était corrélée à une baisse de 3,4 mmHg de la pression systolique.',
      ar: 'ارتبط كل انخفاض بمقدار 1000 ملغ في تناول الصوديوم اليومي بانخفاض 3.4 ملم زئبقي في الضغط الشرياني الانقباضي.'
    }
  },
  {
    id: 'mj-11',
    title: {
      en: 'The Role of Gut Microbiota in Chronic Disease',
      fr: 'Le rôle du microbiote intestinal dans les maladies chroniques',
      ar: 'دور الكائنات الحية الدقيقة المعوية في الأمراض المزمنة'
    },
    snippet: {
      en: 'Clinical analysis of intestinal dysbiosis, systemic inflammatory cytokine responses, and bacterial transplants.',
      fr: 'Analyse de la dysbiose intestinale, réponse inflammatoire par cytokines et transplantations fécales.',
      ar: 'تحليل سريري للاختلال المعوي، واستجابات السيتوكينات الالتهابية العامة، وزراعة البكتيريا المعوية.'
    },
    category: 'Nephrology',
    readTime: '8 min read',
    date: '2026-04-30',
    author: 'Dr. Rachel Goldstein, MD',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1002/gbi.2026.03',
    citationCount: 61,
    clinicalImpact: {
      en: 'Fecal microbiota transplants resolved recurrent C. difficile infections in 89.2% of refractory cohorts.',
      fr: 'La transplantation de microbiote fécale a résolu 89,2 % des infections récurrentes à C. difficile.',
      ar: 'أدت زراعة البكتيريا المعوية إلى علاج عدوى الكلوستريديوم المتكررة لدى 89.2٪ من المجموعات المستعصية.'
    }
  },
  {
    id: 'mj-12',
    title: {
      en: 'Remote Monitoring and Healthcare Resource Utilization',
      fr: 'Surveillance à distance et utilisation des ressources de santé',
      ar: 'المراقبة عن بعد واستخدام موارد الرعاية الصحية'
    },
    snippet: {
      en: 'How integrated telehealth monitors affect emergency room admission rates and ICU length of stay.',
      fr: 'Impact de la télésurveillance sur les admissions aux urgences et la durée de séjour en réanimation.',
      ar: 'كيف تؤثر مراقبة الصحة عن بعد المتكاملة على معدلات دخول الطوارئ ومدة الإقامة في العناية المركزة.'
    },
    category: 'Critical Care',
    readTime: '7 min read',
    date: '2026-04-26',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/j.hcres.2026.01',
    citationCount: 38,
    clinicalImpact: {
      en: 'Integrated home monitoring reduced chronic obstructive pulmonary disease ER visits by 35.6%.',
      fr: 'La télésurveillance à domicile a réduit les visites aux urgences liées à la BPCO de 35,6 %.',
      ar: 'قللت المراقبة المنزلية المتكاملة من زيارات الطوارئ لمرضى الانسداد الرئوي المزمن بنسبة 35.6٪.'
    }
  },
  {
    id: 'mj-13',
    title: {
      en: 'Clinical Applications of Generative AI in Healthcare',
      fr: 'Applications cliniques de l\'IA générative dans les soins de santé',
      ar: 'التطبيقات السريرية للذكاء الاصطناعي التوليدي في الرعاية الصحية'
    },
    snippet: {
      en: 'Evaluating automated medical transcription, clinical report drafting, and patient summarizations accuracy.',
      fr: 'Évaluation de la transcription médicale, rédaction de comptes-rendus et résumés patients par IA.',
      ar: 'تقييم دقة النسخ الطبي المؤتمت، وصياغة التقارير السريرية، وتلخيص حالات المرضى.'
    },
    category: 'Diagnostics',
    readTime: '8 min read',
    date: '2026-04-22',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'CareCalculus Engineering',
    doi: '10.1002/genai.2026.01',
    citationCount: 49,
    clinicalImpact: {
      en: 'AI-assisted clinical charting reduced administrative documentation time by 2.1 hours per physician-shift.',
      fr: 'La saisie assistée par IA a réduit le temps de documentation administrative de 2,1 heures par garde.',
      ar: 'قللت صياغة الملفات السريرية بمساعدة الذكاء الاصطناعي من وقت كتابة المستندات بمعدل 2.1 ساعة لكل نوبة طبيب.'
    }
  },
  {
    id: 'mj-14',
    title: {
      en: 'Ethical Challenges of Artificial Intelligence in Medicine',
      fr: 'Défis éthiques de l\'intelligence artificielle en médecine',
      ar: 'التحديات الأخلاقية للذكاء الاصطناعي في الطب'
    },
    snippet: {
      en: 'Addressing algorithmic bias, clinical validation gaps, patient consent, and medical liability.',
      fr: 'Biais algorithmiques, validation clinique, consentement patient et responsabilité médicale.',
      ar: 'معالجة انحياز الخوارزميات، وفجوات التحقق السريري، وموافقة المريض، والمسؤولية الطبية.'
    },
    category: 'Diagnostics',
    readTime: '8 min read',
    date: '2026-04-18',
    author: 'Dr. Jean-Pierre Dupont, MD',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1016/j.ethics.2026.01',
    citationCount: 42,
    clinicalImpact: {
      en: 'Bias mitigation algorithms decreased clinical prediction inequalities in ethnic cohort risk screening.',
      fr: 'Les algorithmes d\'atténuation des biais ont réduit les inégalités de prédiction du risque clinique.',
      ar: 'قللت خوارزميات التخفيف من الانحياز من تفاوتات التنبؤ السريري في فحص المخاطر لمجموعات عرقية مختلفة.'
    }
  },
  {
    id: 'mj-15',
    title: {
      en: 'Health Informatics and Big Data Analytics',
      fr: 'Informatique de la santé et analyse des mégadonnées',
      ar: 'معلوماتية الصحة وتحليل البيانات الضخمة'
    },
    snippet: {
      en: 'Leveraging longitudinal patient registries for epidemiological monitoring, cohort selection, and adverse events.',
      fr: 'Exploitation des registres patients pour l\'épidémiologie, la sélection de cohortes et la pharmacovigilance.',
      ar: 'الاستفادة من سجلات المرضى التتبعية للمراقبة الوبائية، واختيار المجموعات السريرية، ورصد الآثار السلبية.'
    },
    category: 'Diagnostics',
    readTime: '9 min read',
    date: '2026-04-14',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Rachel Goldstein, MD',
    doi: '10.1002/hinf.2026.02',
    citationCount: 71,
    clinicalImpact: {
      en: 'Multi-center registry analysis identified rare drug-drug adverse interactions 14 months faster than normal reporting.',
      fr: 'L\'analyse de registres multicentriques a détecté des interactions rares 14 mois plus tôt.',
      ar: 'حدد تحليل السجلات متعددة المراكز التفاعلات الدوائية الضارة النادرة أسرع بـ 14 شهراً من الإبلاغ العادي.'
    }
  },
  {
    id: 'mj-16',
    title: {
      en: 'Cancer Biomarker Discovery Using AI',
      fr: 'Découverte de biomarqueurs du cancer grâce à l\'IA',
      ar: 'اكتشاف المؤشرات الحيوية للسرطان باستخدام الذكاء الاصطناعي'
    },
    snippet: {
      en: 'How deep learning models identify genomic markers, proteomic trends, and therapeutic targets in carcinomas.',
      fr: 'Comment le deep learning identifie les marqueurs génomiques et cibles thérapeutiques des cancers.',
      ar: 'كيف تحدد نماذج التعلم العميق المؤشرات الجينية، والاتجاهات البروتينية، والأهداف العلاجية للأورام.'
    },
    category: 'Critical Care',
    readTime: '9 min read',
    date: '2026-04-10',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1016/j.canbio.2026.02',
    citationCount: 83,
    clinicalImpact: {
      en: 'AI models identified 4 novel peptide targets for glioblastoma peptide-vaccine customization.',
      fr: 'Les modèles d\'IA ont identifié 4 nouvelles cibles peptidiques pour le vaccin contre le glioblastome.',
      ar: 'حددت نماذج الذكاء الاصطناعي 4 أهداف ببتيدية جديدة لتخصيص لقاحات الببتيد للورم الأرومي الدبقي.'
    }
  },
  {
    id: 'mj-17',
    title: {
      en: 'Clinical Impact of Telemedicine After COVID-19',
      fr: 'Impact clinique de la télémédecine après le COVID-19',
      ar: 'الأثر السريري للطب عن بعد بعد جائحة كوفيد-19'
    },
    snippet: {
      en: 'A multi-year evaluation of patient satisfaction, chronic illness stability, and cost-benefit ratios.',
      fr: 'Évaluation pluriannuelle de la satisfaction patient, de la stabilité des maladies chroniques et des coûts.',
      ar: 'تقييم متعدد السنوات لرضا المرضى، واستقرار الأمراض المزمنة، ونسب التكلفة والعائد.'
    },
    category: 'Diagnostics',
    readTime: '8 min read',
    date: '2026-04-06',
    author: 'Dr. Rachel Goldstein, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/tele.2026.01',
    citationCount: 50,
    clinicalImpact: {
      en: 'Longitudinal outpatient stability in telemedicine groups was non-inferior to traditional clinic visits.',
      fr: 'La stabilité des patients suivis en télémédecine était non inférieure à celle des visites en présentiel.',
      ar: 'كان الاستقرار طويل الأمد للمرضى الخارجيين في مجموعات الطب عن بعد غير أدنى من الزيارات العيادية التقليدية.'
    }
  },
  {
    id: 'mj-18',
    title: {
      en: 'Longevity Research: Emerging Therapeutic Targets',
      fr: 'Recherche sur la longévité : Cibles thérapeutiques émergentes',
      ar: 'أبحاث طول العمر: الأهداف العلاجية الناشئة'
    },
    snippet: {
      en: 'Reviewing clinical trials of senolytic therapeutics, NAD+ precursors, and epigenetic reprogramming.',
      fr: 'Revue des essais cliniques sur les sénolytiques, précurseurs du NAD+ et reprogrammation épigénétique.',
      ar: 'مراجعة التجارب السريرية للعلاجات الحالة للهرم، وسلائف NAD+، وإعادة البرمجة الفوق جينية.'
    },
    category: 'Pharmacology',
    readTime: '9 min read',
    date: '2026-04-02',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1016/j.long.2026.01',
    citationCount: 66,
    clinicalImpact: {
      en: 'NAD+ precursor supplementation improved metabolic insulin sensitivity markers in geriatric cohorts by 15.6%.',
      fr: 'La supplémentation en précurseurs NAD+ a amélioré la sensibilité à l\'insuline de 15,6 % chez les seniors.',
      ar: 'حسّن تناول مكملات NAD+ من مؤشرات الحساسية للأنسولين لدى مجموعات كبار السن بنسبة 15.6٪.'
    }
  },
  {
    id: 'mj-19',
    title: {
      en: 'Sleep and Cardiometabolic Disease: A Review',
      fr: 'Sommeil et maladies cardiométaboliques : Une revue',
      ar: 'النوم والأمراض القلبية الاستقلابية: مراجعة'
    },
    snippet: {
      en: 'Analyzing how sleep duration and obstructive apnea risk trigger insulin resistance, vascular tone, and lipid levels.',
      fr: 'Comment la durée du sommeil et l\'apnée augmentent la résistance à l\'insuline et la rigidité artérielle.',
      ar: 'تحليل كيف تؤدي مدة النوم ومخاطر انقطاع النفس الانسدادي إلى مقاومة الأنسولين، وضغط الأوعية، وتراكم الدهون.'
    },
    category: 'Cardiology',
    readTime: '8 min read',
    date: '2026-03-29',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/sleep.2026.03',
    citationCount: 44,
    clinicalImpact: {
      en: 'Treating obstructive sleep apnea with CPAP reduced mean 24-hour ambulatory systolic pressures by 4.2 mmHg.',
      fr: 'Le traitement de l\'apnée par CPAP a réduit la pression systolique ambulatoire moyenne de 4,2 mmHg.',
      ar: 'قلل علاج انقطاع النفس الانسدادي أثناء النوم بجهاز CPAP من متوسط الضغط الانقباضي بمقدار 4.2 ملم زئبقي.'
    }
  },
  {
    id: 'mj-20',
    title: {
      en: 'Nutrition and Chronic Disease Prevention',
      fr: 'Nutrition et prévention des maladies chroniques',
      ar: 'التغذية والوقاية من الأمراض المزمنة'
    },
    snippet: {
      en: 'Meta-analysis of plant-based dietary scores, cardiovascular risks, renal disease control, and cancers prevention.',
      fr: 'Méta-analyse des régimes végétaux, risques cardiovasculaires, insuffisance rénale et cancers.',
      ar: 'تحليل شمولي لمؤشرات النظام الغذائي النباتي، ومخاطر القلب، والتحكم في أمراض الكلى، والوقاية من السرطان.'
    },
    category: 'Nephrology',
    readTime: '8 min read',
    date: '2026-03-25',
    author: 'Dr. Rachel Goldstein, MD',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1016/j.nutprev.2026.01',
    citationCount: 52,
    clinicalImpact: {
      en: 'Strict adherence to Mediterranean-style dietary scores correlated with a 24% reduction in cardiovascular death.',
      fr: 'L\'adhésion au régime méditerranéen a été corrélée à une baisse de 24 % de la mortalité cardiovasculaire.',
      ar: 'ارتبط الالتزام الصارم بالنظام الغذائي المتوسطي بانخفاض بنسبة 24٪ في الوفيات الناجمة عن أمراض القلب.'
    }
  }
];

// 3. 20 COURSES
export const MASTER_COURSES: MasterCourse[] = [
  { id: 'mc-1', title: { en: 'Introduction to Clinical Calculators', fr: 'Introduction aux calculateurs cliniques', ar: 'مقدمة في الحاسبات الطبية السريرية' }, category: 'General Medicine', summary: { en: 'Understanding sensitivity, specificity, and formula limits in bedside clinical calculators.', fr: 'Comprendre la sensibilite, la specificite et les limites des formules au chevet du patient.', ar: 'فهم الحساسية والخصوصية وحدود المعادلات في الحاسبات الطبية بجانب السرير.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-06-12', size: '3.5 MB', pages: 2 },
  { id: 'mc-2', title: { en: 'Evidence-Based Medicine Fundamentals', fr: 'Fondements de la médecine fondée sur des preuves', ar: 'أساسيات الطب القائم على الأدلة' }, category: 'Clinical Research', summary: { en: 'How to read clinical trials, evaluate risk ratios, and identify systemic cohort biases.', fr: 'Comment lire les essais cliniques, evaluer les rapports de risque et identifier les biais.', ar: 'كيفية قراءة التجارب السريرية، وتقييم نسب المخاطر، وتحديد انحيازات المجموعات.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-06-09', size: '4.2 MB', pages: 3 },
  { id: 'mc-3', title: { en: 'Medical Statistics for Healthcare Professionals', fr: 'Statistiques médicales pour les professionnels', ar: 'الإحصاء الطبي للممارسين الصحيين' }, category: 'Biostatistics', summary: { en: 'P-values, confidence intervals, Kaplan-Meier curves, and regression models basics.', fr: 'Valeurs p, intervalles de confiance, courbes Kaplan-Meier et modeles de regression.', ar: 'القيم الاحتمالية P-values، وفترات الثقة، ومنحنيات كابلان-ماير، ونماذج الانحدار.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-06', size: '5.1 MB', pages: 4 },
  { id: 'mc-4', title: { en: 'Biostatistics Using Real Clinical Data', fr: 'Biostatistiques appliquées aux données cliniques', ar: 'الإحصاء الحيوي باستخدام البيانات السريرية الحقيقية' }, category: 'Biostatistics', summary: { en: 'Hands-on practice using statistical software on metabolic and cardiology registries.', fr: 'Pratique de logiciels statistiques sur des registres de cardiologie et de metabolisme.', ar: 'تدريب عملي على البرمجيات الإحصائية في سجلات أمراض القلب والاستقلاب.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-03', size: '5.8 MB', pages: 4 },
  { id: 'mc-5', title: { en: 'Clinical Research Methodology', fr: 'Méthodologie de la recherche clinique', ar: 'منهجية البحث السريري' }, category: 'Clinical Research', summary: { en: 'Designing clinical trials, cohort structures, and ethical protocol submissions.', fr: 'Conception d\'essais cliniques, structures de cohortes et protocoles d\'ethique.', ar: 'تصميم التجارب السريرية، وهياكل المجموعات، وتقديم بروتوكولات أخلاقيات البحث.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-05-31', size: '4.6 MB', pages: 3 },
  { id: 'mc-6', title: { en: 'Introduction to Epidemiology', fr: 'Introduction à l\'épidémiologie', ar: 'مقدمة في علم الأوبئة' }, category: 'Clinical Research', summary: { en: 'Tracking disease patterns, odds ratios, relative risks, and outbreaks monitoring.', fr: 'Suivi des maladies, odds ratios, risques relatifs et surveillance des epidemies.', ar: 'تتبع أنماط الأمراض، ونسب الأرجحية، والمخاطر النسبية، ومراقبة تفشي الأوبئة.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-28', size: '3.9 MB', pages: 3 },
  { id: 'mc-7', title: { en: 'Artificial Intelligence for Healthcare Professionals', fr: 'L\'IA pour les professionnels de la santé', ar: 'الذكاء الاصطناعي للممارسين الصحيين' }, category: 'Technology', summary: { en: 'Understanding deep learning algorithms and integration rules in clinical tools.', fr: 'Comprendre les algorithmes de deep learning et l\'integration d\'outils cliniques.', ar: 'فهم خوارزميات التعلم العميق وقواعد التكامل في الأدوات السريرية.' }, instructor: 'CareCalculus Engineering', date: '2026-05-25', size: '4.8 MB', pages: 3 },
  { id: 'mc-8', title: { en: 'Medical Data Analysis with Python', fr: 'Analyse des données médicales avec Python', ar: 'تحليل البيانات الطبية باستخدام بايثون' }, category: 'Technology', summary: { en: 'Using pandas, numpy, and scientific tools to process patient registries databases.', fr: 'Utilisation de pandas, numpy et d\'outils scientifiques pour traiter les registres.', ar: 'استخدام مكتبات pandas وnumpy لمعالجة قواعد بيانات سجلات المرضى.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-05-22', size: '6.5 MB', pages: 5 },
  { id: 'mc-9', title: { en: 'Scientific Writing for Researchers', fr: 'Rédaction scientifique pour les chercheurs', ar: 'الكتابة العلمية للباحثين' }, category: 'Clinical Research', summary: { en: 'Drafting abstracts, structured journals, references citations, and review replies.', fr: 'Redaction de resumes, journaux structures, citations et reponses aux examinateurs.', ar: 'صياغة الملخصات، والمجلات الهيكلية، والاقتباسات، والرد على المقيمين.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-05-19', size: '3.2 MB', pages: 2 },
  { id: 'mc-10', title: { en: 'Systematic Reviews and Meta-Analysis', fr: 'Revues systématiques et méta-analyses', ar: 'المراجعات المنهجية والتحليل الشمولي' }, category: 'Clinical Research', summary: { en: 'PRISMA guidelines, database indexing search, and forest plots interpretation.', fr: 'Directives PRISMA, recherche indexee et interpretation des forest plots.', ar: 'إرشادات PRISMA، والبحث في الفهارس الطبية، وتفسير مخططات Forest Plots.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-05-16', size: '4.4 MB', pages: 3 },
  { id: 'mc-11', title: { en: 'Clinical Decision Support Systems', fr: 'Systèmes d\'aide à la décision clinique', ar: 'أنظمة دعم القرار السريري' }, category: 'Technology', summary: { en: 'How automated medical alert systems are integrated with electronic health records.', fr: 'Comment les systemes d\'alerte automatises s\'integrent aux dossiers medicaux.', ar: 'كيفية دمج أنظمة التنبيه الطبي المؤتمتة مع السجلات الصحية الإلكترونية.' }, instructor: 'CareCalculus Engineering', date: '2026-05-13', size: '4.0 MB', pages: 3 },
  { id: 'mc-12', title: { en: 'Digital Health and Telemedicine', fr: 'Santé numérique et télémédecine', ar: 'الصحة الرقمية والطب عن بعد' }, category: 'Technology', summary: { en: 'Clinical structures for virtual care delivery, camera setups, and privacy protocols.', fr: 'Structures pour les soins virtuels, reglages camera et protocoles de confidentialite.', ar: 'الهياكل السريرية لتقديم الرعاية الافتراضية، وإعدادات الكاميرا، وخصوصية المريض.' }, instructor: 'Dr. Rachel Goldstein, MD', date: '2026-05-10', size: '3.8 MB', pages: 3 },
  { id: 'mc-13', title: { en: 'Research Ethics in Healthcare', fr: 'Éthique de la recherche en santé', ar: 'أخلاقيات البحث في الرعاية الصحية' }, category: 'Clinical Research', summary: { en: 'Informed consent, institutional review boards (IRBs), and data protection regulations.', fr: 'Consentement eclaire, comites d\'ethique (IRB) et protection des donnees.', ar: 'الموافقة المستنيرة، ومجالس المراجعة المؤسسية (IRBs)، ولوائح حماية البيانات.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-07', size: '3.4 MB', pages: 2 },
  { id: 'mc-14', title: { en: 'Cancer Epidemiology', fr: 'Épidémiologie du cancer', ar: 'وبائيات السرطان' }, category: 'Oncology', summary: { en: 'Global incidence rates, screening programs, risk factors, and registry analytics.', fr: 'Taux d\'incidence mondiaux, programmes de depistage, facteurs de risque et registres.', ar: 'معدلات الإصابة العالمية، وبرامج الفحص، وعوامل الخطر، وتحليلات السجلات.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-04', size: '4.3 MB', pages: 3 },
  { id: 'mc-15', title: { en: 'Stroke Risk Assessment and Prevention', fr: 'Évaluation du risque d\'AVC et prévention', ar: 'تقييم مخاطر السكتة الدماغية والوقاية منها' }, category: 'Cardiology', summary: { en: 'Implementing CHA2DS2-VASc, carotid screening, and antihypertensive targets.', fr: 'Application du CHA2DS2-VASc, depistage carotidien et cibles de tension.', ar: 'تطبيق نقاط CHA2DS2-VASc، وفحص الشريان السباتي، وأهداف خفض ضغط الدم.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-01', size: '3.7 MB', pages: 3 },
  { id: 'mc-16', title: { en: 'Diabetes Management Essentials', fr: 'Essentiels de la gestion du diabète', ar: 'أساسيات إدارة مرض السكري' }, category: 'Endocrinology', summary: { en: 'Basal-bolus insulin math, dietary planning, and glomerular protection parameters.', fr: 'Calcul d\'insuline basale-bolus, nutrition et protection glomerulaire.', ar: 'حسابات جرعات الأنسولين السريعة والبطيئة، والتخطيط الغذائي، وحماية الكبيبات.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-04-28', size: '4.5 MB', pages: 3 },
  { id: 'mc-17', title: { en: 'Healthcare Quality Improvement', fr: 'Amélioration de la qualité des soins', ar: 'تحسين جودة الرعاية الصحية' }, category: 'Clinical Research', summary: { en: 'Plan-Do-Study-Act (PDSA) cycles, root cause analysis, and safety audit protocols.', fr: 'Cycles PDSA, analyse des causes profondes et protocoles d\'audit de securite.', ar: 'دورات خطط-افعل-ادرس-نفذ (PDSA)، وتحليل الأسباب الجذرية، وأمن التدقيق.' }, instructor: 'Dr. Rachel Goldstein, MD', date: '2026-04-25', size: '3.9 MB', pages: 3 },
  { id: 'mc-18', title: { en: 'Healthcare Data Visualization', fr: 'Visualisation des données de santé', ar: 'تصور بيانات الرعاية الصحية' }, category: 'Technology', summary: { en: 'Creating clinical dashboards, survival curves, and patient trend diagrams.', fr: 'Creation de tableaux de bord cliniques, courbes de survie et graphiques.', ar: 'إنشاء لوحات معلومات سريرية، ومنحنيات البقاء على قيد الحياة، ومخططات المرضى.' }, instructor: 'CareCalculus Engineering', date: '2026-04-22', size: '5.4 MB', pages: 4 },
  { id: 'mc-19', title: { en: 'Machine Learning in Medicine', fr: 'Apprentissage automatique en médecine', ar: 'التعلم الآلي في الطب' }, category: 'Technology', summary: { en: 'Supervised vs unsupervised classifiers, diagnostic ROC curves, and algorithms.', fr: 'Classificateurs supervises, courbes ROC diagnostiques et algorithmes.', ar: 'المصنفات الخاضعة وغير الخاضعة للإشراف، ومنحنيات ROC التشخيصية، والخوارزميات.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-04-19', size: '6.0 MB', pages: 4 },
  { id: 'mc-20', title: { en: 'Precision Medicine Foundations', fr: 'Bases de la médecine de précision', ar: 'أسس الطب الدقيق' }, category: 'General Medicine', summary: { en: 'Translating genetic sequencing data into target-specific therapeutic indices.', fr: 'Traduction des donnees de sequençage en indices therapeutiques cibles.', ar: 'ترجمة بيانات التسلسل الجيني إلى مؤشرات علاجية محددة الهدف.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-04-16', size: '4.1 MB', pages: 3 }
];

// 4. 20 PRESENTATIONS
export const MASTER_PRESENTATIONS: MasterPresentation[] = [
  { id: 'mp-1', title: { en: 'Top Healthcare Trends in 2026', fr: 'Principales tendances de la santé en 2026', ar: 'أهم اتجاهات الرعاية الصحية في عام 2026' }, category: 'General Medicine', description: { en: 'Analysis of automated triage systems, telemedicine expansion, and GLP-1 therapy.', fr: 'Analyse du triage automatise, de la telemedecine et des therapies GLP-1.', ar: 'تحليل أنظمة الفرز المؤتمتة، وتوسع الطب عن بعد، وعلاجات GLP-1.' }, author: 'Prof. Alice Vance, MD', date: '2026-06-12', size: '10.5 MB', slideCount: 5 },
  { id: 'mp-2', title: { en: 'GLP-1 Medications: Beyond Weight Loss', fr: 'Médicaments GLP-1 : Au-delà de la perte de poids', ar: 'أدوية GLP-1: ما وراء إنقاص الوزن' }, category: 'Pharmacology', description: { en: 'Cardioprotective pathways, renal protection mechanisms, and neuroprotection studies.', fr: 'Voies cardioprotectrices, protection renale et neuroprotection.', ar: 'مسارات حماية القلب، وآليات حماية الكلى، ودراسات حماية الأعصاب.' }, author: 'Prof. Alice Vance, MD', date: '2026-06-08', size: '12.1 MB', slideCount: 5 },
  { id: 'mp-3', title: { en: 'Artificial Intelligence in Modern Healthcare', fr: 'L\'intelligence artificielle dans la médecine', ar: 'الذكاء الاصطناعي في الرعاية الصحية الحديثة' }, category: 'Technology', description: { en: 'Deep learning classifiers in radiological pipelines and predictive safety systems.', fr: 'Algorithmes d\'imagerie en radiologie et systemes de prevention.', ar: 'مصنفات التعلم العميق في مسارات الأشعة وأنظمة السلامة التنبؤية.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-04', size: '14.8 MB', slideCount: 6 },
  { id: 'mp-4', title: { en: 'Future of Digital Health Platforms', fr: 'L\'avenir des plateformes de santé numérique', ar: 'مستقبل منصات الصحة الرقمية' }, category: 'Technology', description: { en: 'Decentralized hospital infrastructures, integrated telemetry, and cloud models.', fr: 'Infrastructures hospitalieres decentralisees, telemetrie et cloud.', ar: 'البنى التحتية اللامركزية للمستشفيات، والقياس عن بعد المتكامل، ونماذج السحاب.' }, author: 'CareCalculus Engineering', date: '2026-05-31', size: '11.2 MB', slideCount: 5 },
  { id: 'mp-5', title: { en: 'Wearable Technology and Remote Monitoring', fr: 'Wearables et surveillance des patients', ar: 'التكنولوجيا القابلة للارتداء والمراقبة عن بعد' }, category: 'Technology', description: { en: 'Clinical validation of smartwatch ECGs and target alert parameters.', fr: 'Validation des ECG de montres connectees et alertes cliniques.', ar: 'التحقق السريري من تخطيط القلب عبر الساعات الذكية ومعايير التنبيه.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-05-27', size: '13.4 MB', slideCount: 5 },
  { id: 'mp-6', title: { en: 'Food as Medicine: Evidence and Applications', fr: 'L\'alimentation comme médecine : Preuves', ar: 'الغذاء كدواء: الأدلة والتطبيقات' }, category: 'General Medicine', description: { en: 'Analyzing metabolic outcome metrics from specialized diet programs.', fr: 'Analyse des resultats metaboliques de programmes nutritionnels.', ar: 'تحليل مقاييس نتائج التمثيل الغذائي من البرامج الغذائية المتخصصة.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-23', size: '9.8 MB', slideCount: 4 },
  { id: 'mp-7', title: { en: 'Advances in Diabetes Care', fr: 'Progrès dans le traitement du diabète', ar: 'التطورات في رعاية مرضى السكري' }, category: 'Endocrinology', description: { en: 'Islet transplantation updates, smart pumps, and renal protection metrics.', fr: 'Greffe d\'ilots pancreatiques, pompes intelligentes et reins.', ar: 'تحديثات زراعة خلايا الجزر، والمضخات الذكية، ومقاييس حماية الكلى.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-19', size: '11.5 MB', slideCount: 5 },
  { id: 'mp-8', title: { en: 'Stroke Prevention and Early Detection', fr: 'Prévention de l\'AVC et détection précoce', ar: 'الوقاية من السكتة الدماغية والكشف المبكر عنها' }, category: 'Cardiology', description: { en: 'Implementing FAST, carotid telemetry, and secondary anticoagulation.', fr: 'Application de FAST, telemetrie carotidienne et anticoagulation.', ar: 'تطبيق FAST، وتدابير الشريان السباتي، ومضادات التخثر الثانوية.' }, author: 'Dr. Al-Faruqi, MD', date: '2026-05-15', size: '12.6 MB', slideCount: 5 },
  { id: 'mp-9', title: { en: 'Cancer Prevention Strategies', fr: 'Stratégies de prévention du cancer', ar: 'استراتيجيات الوقاية من السرطان' }, category: 'Oncology', description: { en: 'Modifiable risks analytics, vaccination pathways, and early screenings.', fr: 'Analyse des risques modifiables, vaccination et depistages.', ar: 'تحليلات المخاطر القابلة للتعديل، ومسارات التطعيم، والفحوصات المبكرة.' }, author: 'Dr. Al-Faruqi, MD', date: '2026-05-11', size: '10.2 MB', slideCount: 5 },
  { id: 'mp-10', title: { en: 'Clinical Decision Support Systems', fr: 'Systèmes de support à la décision clinique', ar: 'أنظمة دعم القرار السريري' }, category: 'Technology', description: { en: 'Real-time alert optimization algorithms inside ICU environments.', fr: 'Optimisation des alertes en temps reel dans les services de reanimation.', ar: 'خوارزميات تحسين التنبيه الفوري داخل بيئات العناية المركزة.' }, author: 'CareCalculus Engineering', date: '2026-05-07', size: '11.9 MB', slideCount: 5 },
  { id: 'mp-11', title: { en: 'Precision Medicine and Genomics', fr: 'Médecine de précision et génomique', ar: 'الطب الدقيق وعلم الجينوم' }, category: 'General Medicine', description: { en: 'Sequencing pathways and pharmacogenomics implementation barriers.', fr: 'Obstacles a la mise en oeuvre de la pharmacogenomique.', ar: 'عقبات تطبيق علم الصيدلة الجيني ومسارات تسلسل الحمض النووي.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-03', size: '13.0 MB', slideCount: 5 },
  { id: 'mp-12', title: { en: 'Medical Data Analytics for Clinicians', fr: 'Analyse des données pour les cliniciens', ar: 'تحليلات البيانات الطبية للأطباء' }, category: 'Technology', description: { en: 'Statistical tools, cohort parameters, and diagnostic markers.', fr: 'Outils statistiques, parametres de cohorte et biomarqueurs.', ar: 'الأدوات الإحصائية، ومعايير المجموعات، والمؤشرات التشخيصية.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-04-29', size: '14.2 MB', slideCount: 6 },
  { id: 'mp-13', title: { en: 'Telemedicine: Lessons and Future Directions', fr: 'Télémédecine : Leçons et perspectives', ar: 'الطب عن بعد: الدروس والتوجهات المستقبلية' }, category: 'Technology', description: { en: 'Reviewing outcome metrics and patient portal security standards.', fr: 'Revue des indicateurs cliniques et securite des portails.', ar: 'مراجعة مقاييس النتائج ومعايير أمان بوابة المريض الإلكترونية.' }, author: 'Dr. Rachel Goldstein, MD', date: '2026-04-25', size: '10.8 MB', slideCount: 5 },
  { id: 'mp-14', title: { en: 'Healthcare Innovation Roadmap 2026', fr: 'Feuille de route de l\'innovation santé 2026', ar: 'خارطة طريق الابتكار في الرعاية الصحية 2026' }, category: 'General Medicine', description: { en: 'Strategic analysis of emerging diagnostic technologies integration.', fr: 'Analyse strategique de l\'integration des nouvelles technologies.', ar: 'التحليل الاستراتيجي لدمج التقنيات التشخيصية الناشئة.' }, author: 'CareCalculus Editorial Team', date: '2026-04-21', size: '11.0 MB', slideCount: 5 },
  { id: 'mp-15', title: { en: 'AI Ethics in Clinical Practice', fr: 'Éthique de l\'IA en pratique clinique', ar: 'أخلاقيات الذكاء الاصطناعي في الممارسة السريرية' }, category: 'Technology', description: { en: 'Algorithmic bias control, liability, and consent procedures.', fr: 'Controle des biais, responsabilite et consentement patient.', ar: 'التحكم في انحياز الخوارزميات، والمسؤولية، وإجراءات الموافقة.' }, author: 'Dr. Jean-Pierre Dupont, MD', date: '2026-04-17', size: '12.4 MB', slideCount: 5 },
  { id: 'mp-16', title: { en: 'Big Data in Healthcare', fr: 'Mégadonnées en santé', ar: 'البيانات الضخمة في الرعاية الصحية' }, category: 'Technology', description: { en: 'Managing multi-center registries and patient records datasets.', fr: 'Gestion de registres multicentriques et bases de donnees.', ar: 'إدارة السجلات الطبية متعددة المراكز ومجموعات بيانات المرضى.' }, author: 'CareCalculus Engineering', date: '2026-04-13', size: '15.0 MB', slideCount: 6 },
  { id: 'mp-17', title: { en: 'Research Methodology for Graduate Students', fr: 'Méthodologie de recherche pour étudiants', ar: 'منهجية البحث لطلاب الدراسات العليا' }, category: 'General Medicine', description: { en: 'Designing clinical experiments, controls, and data collection.', fr: 'Conception d\'essais cliniques, contrôles et collecte.', ar: 'تصميم التجارب السريرية، وضوابط التحكم، وجمع البيانات.' }, author: 'Dr. Jean-Pierre Dupont, MD', date: '2026-04-09', size: '10.0 MB', slideCount: 5 },
  { id: 'mp-18', title: { en: 'Scientific Publishing Best Practices', fr: 'Bonnes pratiques de publication scientifique', ar: 'أفضل ممارسات النشر العلمي' }, category: 'General Medicine', description: { en: 'Writing papers, responding to peers, and manuscript structure.', fr: 'Redaction d\'articles, reponses aux pairs et manuscrits.', ar: 'كتابة الأبحاث، والرد على المقيمين، وهيكل المخطوطات.' }, author: 'Prof. Alice Vance, MD', date: '2026-04-05', size: '9.6 MB', slideCount: 4 },
  { id: 'mp-19', title: { en: 'Healthcare Quality and Patient Safety', fr: 'Qualité des soins et sécurité des patients', ar: 'جودة الرعاية الصحية وسلامة المرضى' }, category: 'General Medicine', description: { en: 'Implementing clinical checklists and error reporting registries.', fr: 'Mise en oeuvre de check-lists et declaration d\'erreurs.', ar: 'تطبيق قوائم التدقيق السريرية وسجلات الإبلاغ عن الأخطاء.' }, author: 'Dr. Rachel Goldstein, MD', date: '2026-04-01', size: '11.8 MB', slideCount: 5 },
  { id: 'mp-20', title: { en: 'Emerging Technologies in Medicine', fr: 'Technologies émergentes en médecine', ar: 'التقنيات الناشئة في الطب' }, category: 'Technology', description: { en: 'Robotic surgeries, VR clinical training, and bio-sensors.', fr: 'Chirurgies robotiques, formation en RV et capteurs.', ar: 'الجراحات الروبوتية، والتدريب السريري بالواقع الافتراضي، والمستشعرات.' }, author: 'CareCalculus Engineering', date: '2026-03-28', size: '13.8 MB', slideCount: 5 }
];

// 5. 15 ORL / LARYNGEAL CANCER ARTICLES
export const MASTER_ORL: MasterOrl[] = [
  {
    id: 'orl-1',
    title: {
      en: 'Epidemiology of Laryngeal Cancer in Morocco',
      fr: 'Épidémiologie du cancer du larynx au Maroc',
      ar: 'وبائيات سرطان الحنجرة في المغرب'
    },
    snippet: {
      en: 'A comprehensive demographic study analyzing tumor subsites, staging at presentation, and tobacco-alcohol associations in Moroccan cohorts.',
      fr: 'Une étude démographique analysant les sous-sites tumoraux, le stade au diagnostic et l\'association tabac-alcool au Maroc.',
      ar: 'دراسة ديموغرافية شاملة لتحليل المواقع الفرعية للأورام، والمرحلة عند التشخيص، والارتباط بين التبغ والكحول في المغرب.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-06-11',
    author: 'Dr. Al-Faruqi, MD (Morocco Medical Board)',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1002/orl.mor.2026',
    citationCount: 39,
    clinicalImpact: {
      en: 'Reveals that glottic cancer is the most prevalent subsite (64%), with 78% of supraglottic presenting at Stage III/IV.',
      fr: 'Révèle que le cancer glottique est le sous-site le plus fréquent (64%), 78% des cancers supraglottiques étant diagnostiqués au stade III/IV.',
      ar: 'كشفت الدراسة أن سرطان المزمار هو الأكثر انتشاراً (64٪)، مع تشخيص 78٪ من حالات سرطان فوق المزمار في المرحلة الثالثة/الرابعة.'
    }
  },
  {
    id: 'orl-2',
    title: {
      en: 'Risk Factors for Laryngeal Cancer',
      fr: 'Facteurs de risque du cancer du larynx',
      ar: 'عوامل خطر الإصابة سرطان الحنجرة'
    },
    snippet: {
      en: 'Evaluating synergistic hazards of alcohol and tobacco, occupational exposures (asbestos), and genetic susceptibility.',
      fr: 'Évaluation des risques synergiques de l\'alcool et du tabac, des expositions professionnelles (amiante) et de la génétique.',
      ar: 'تقييم المخاطر التآزرية للتبغ والكحول، والتعرض المهني (الأسبستوس)، والاستعداد الجيني.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '7 min read',
    date: '2026-06-05',
    author: 'Dr. Al-Faruqi, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/orl.risk.2026',
    citationCount: 28,
    clinicalImpact: {
      en: 'Active tobacco use combined with heavy alcohol intake increases laryngeal squamous cell carcinoma risk by 30-fold.',
      fr: 'Le tabagisme associé à une forte consommation d\'alcool multiplie par 30 le risque de carcinome épidermoïde.',
      ar: 'يزيد التدخين النشط المصحوب بتناول الكحول بكثرة من خطر الإصابة بسرطان الخلايا الحرشفية للحنجرة بمقدار 30 ضعفاً.'
    }
  },
  {
    id: 'orl-3',
    title: {
      en: 'HPV and Head & Neck Cancer',
      fr: 'VPH et cancers de la tête et du cou',
      ar: 'فيروس الورم الحليمي البشري وسرطان الرأس والعنق'
    },
    snippet: {
      en: 'Differentiating HPV-positive and HPV-negative head and neck cancers regarding biomarkers, prognosis, and treatment responses.',
      fr: 'Différenciation des cancers de la tête et du cou VPH-positifs et négatifs (biomarqueurs, pronostic, traitement).',
      ar: 'التفريق بين سرطانات الرأس والعنق الإيجابية والسلبية لفيروس الورم الحليمي البشري من حيث المؤشرات الحيوية والاستجابة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-05-30',
    author: 'Dr. Jean-Pierre Dupont, MD',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1002/orl.hpv.2026',
    citationCount: 47,
    clinicalImpact: {
      en: 'HPV-positive oropharyngeal and laryngeal cancers exhibit significantly better response rates to radiotherapy.',
      fr: 'Les cancers ORL VPH-positifs présentent des taux de réponse à la radiothérapie nettement supérieurs.',
      ar: 'تظهر سرطانات البلعوم الفموي والحنجرة الإيجابية لـ HPV معدلات استجابة أفضل بكثير للعلاج الإشعاعي.'
    }
  },
  {
    id: 'orl-4',
    title: {
      en: 'Molecular Biomarkers in Laryngeal Cancer',
      fr: 'Biomarqueurs moléculaires dans le cancer du larynx',
      ar: 'المؤشرات الحيوية الجزيئية في سرطان الحنجرة'
    },
    snippet: {
      en: 'Review of p53 mutations, EGFR overexpression, and immune checkpoint ligands (PD-L1) targeting in head & neck squamous cell carcinomas.',
      fr: 'Revue des mutations p53, de la surexpression d\'EGFR et de PD-L1 dans les carcinomes épidermoïdes ORL.',
      ar: 'مراجعة طفرات p53، وزيادة تعبير EGFR، وروابط نقاط التفتيش المناعية (PD-L1) في سرطانات الخلايا الحرشفية.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '9 min read',
    date: '2026-05-24',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1016/orl.mol.2026',
    citationCount: 31,
    clinicalImpact: {
      en: 'PD-L1 expression levels (Combined Positive Score ≥1) predict clinical response to pembrolizumab immunotherapy.',
      fr: 'Les niveaux d\'expression de PD-L1 (CPS ≥1) prédisent la réponse clinique à l\'immunothérapie par pembrolizumab.',
      ar: 'تتنبأ مستويات تعبير PD-L1 (معدل النتيجة الإيجابية المشترك CPS ≥ 1) بالاستجابة السريرية للعلاج المناعي بيمبروليزوماب.'
    }
  },
  {
    id: 'orl-5',
    title: {
      en: 'Artificial Intelligence in Laryngeal Cancer Diagnosis',
      fr: 'L\'intelligence artificielle dans le diagnostic du cancer du larynx',
      ar: 'الذكاء الاصطناعي في تشخيص سرطان الحنجرة'
    },
    snippet: {
      en: 'Utilizing deep learning on laryngoscopic video frames for early detection of precancerous and neoplastic vocal cord lesions.',
      fr: 'Utilisation du deep learning sur vidéos laryngoscopiques pour détecter les lésions précancéreuses des cordes vocales.',
      ar: 'استخدام التعلم العميق في لقطات الفيديو لتنظير الحنجرة للكشف المبكر عن الآفات السريرية ما قبل السرطانية والورمية.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-05-18',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/orl.ai.2026',
    citationCount: 42,
    clinicalImpact: {
      en: 'Deep learning classifiers achieved a 93.4% diagnostic accuracy rate in differentiating vocal fold leukoplakia types.',
      fr: 'Les classificateurs d\'IA ont atteint 93,4 % de précision pour différencier les leucoplasies des cordes vocales.',
      ar: 'حققت مصنفات التعلم العميق دقة تشخيصية بنسبة 93.4٪ في التمييز بين أنواع الطلاوة الحنجرية.'
    }
  },
  {
    id: 'orl-6',
    title: {
      en: 'Predictive Models for Laryngeal Cancer Outcomes',
      fr: 'Modèles prédictifs des résultats du cancer du larynx',
      ar: 'نماذج التنبؤ بنتائج سرطان الحنجرة'
    },
    snippet: {
      en: 'Applying clinical variables and machine learning to estimate 5-year survival rates and recurrence profiles in post-op cohorts.',
      fr: 'Application de variables cliniques et du ML pour estimer les taux de survie à 5 ans et les récidives postopératoires.',
      ar: 'تطبيق المتغيرات السريرية والتعلم الآلي لتقدير معدلات البقاء على قيد الحياة لمدة 5 سنوات وملامح الانتكاس بعد الجراحة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-05-12',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1016/orl.pred.2026',
    citationCount: 22,
    clinicalImpact: {
      en: 'Integrating tumor size, node density, and margins achieved a c-index of 0.81 for estimating overall survival.',
      fr: 'L\'intégration de la taille de la tumeur, des ganglions et des marges a obtenu un c-index de 0,81 pour la survie globale.',
      ar: 'حقق دمج حجم الورم، وكثافة العقد، ونظافة الحواف قيمة c-index بلغت 0.81 لتقدير البقاء العام على قيد الحياة.'
    }
  },
  {
    id: 'orl-7',
    title: {
      en: 'Machine Learning for Head and Neck Oncology',
      fr: 'Apprentissage automatique en oncologie de la tête et du cou',
      ar: 'التعلم الآلي لعلاج أورام الرأس والعنق'
    },
    snippet: {
      en: 'Exploring radiomics, CT image segmentations, and automatic contouring of organs at risk during radiotherapy planning.',
      fr: 'Exploration de la radiomique, segmentation CT et contourage automatique des organes lors de la radiothérapie.',
      ar: 'استكشاف علم الراديوميات، وتجزئة صور الأشعة المقطعية، وتحديد الأعضاء الحيوية المعرضة للخطر أثناء التخطيط الإشعاعي.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '9 min read',
    date: '2026-05-06',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1002/orl.ml.2026',
    citationCount: 36,
    clinicalImpact: {
      en: 'Automated ML segmentation reduced clinical contouring time in head & neck planning by 54 minutes per patient.',
      fr: 'La segmentation automatisée par ML a réduit le temps de contourage en radiothérapie de 54 minutes par patient.',
      ar: 'قلل التجزئة الآلي بالتعلم الآلي من وقت التخطيط وتحديد الحواف بمعدل 54 دقيقة لكل مريض.'
    }
  },
  {
    id: 'orl-8',
    title: {
      en: 'Survival Analysis of Laryngeal Cancer Patients',
      fr: 'Analyse de survie des patients atteints de cancer du larynx',
      ar: 'تحليل البقاء على قيد الحياة لمرضى سرطان الحنجرة'
    },
    snippet: {
      en: 'A retrospective cohort analysis of treatment modalities: radiotherapy alone, chemoradiotherapy, and surgery.',
      fr: 'Analyse rétrospective des modalités : radiothérapie seule, chimio-radiothérapie et laryngectomie.',
      ar: 'تحليل تراجعي للمجموعات العلاجية المختلفة: العلاج الإشعاعي وحده، العلاج الكيميائي الإشعاعي المشترك، والجراحة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '9 min read',
    date: '2026-04-30',
    author: 'Dr. Al-Faruqi, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/orl.surv.2026',
    citationCount: 50,
    clinicalImpact: {
      en: 'Chemoradiotherapy achieved equivalent 5-year survival rates to total laryngectomy in selected T3 glottic cancers.',
      fr: 'La chimio-radiothérapie a obtenu une survie à 5 ans équivalente à la laryngectomie totale dans le cancer glottique T3.',
      ar: 'حقق العلاج الكيميائي الإشعاعي المشترك معدلات بقاء على قيد الحياة لـ 5 سنوات مكافئة لاستئصال الحنجرة الكامل في أورام T3.'
    }
  },
  {
    id: 'orl-9',
    title: {
      en: 'Quality of Life After Laryngectomy',
      fr: 'Qualité de vie après laryngectomie',
      ar: 'جودة الحياة بعد استئصال الحنجرة'
    },
    snippet: {
      en: 'Evaluating speech rehabilitation, tracheostomal care compliance, and social integration in post-laryngectomy cohorts.',
      fr: 'Évaluation de la rééducation de la parole, des soins de trachéostome et de l\'intégration sociale.',
      ar: 'تقييم إعادة تأهيل النطق، والالتزام برعاية فغر الرغامي، والاندماج الاجتماعي لدى المرضى بعد استئصال الحنجرة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-04-24',
    author: 'Dr. Al-Faruqi, MD',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/orl.qol.2026',
    citationCount: 19,
    clinicalImpact: {
      en: 'Early voice rehabilitation using tracheoesophageal puncture improved post-op QoL scores by 34%.',
      fr: 'La réhabilitation vocale précoce par prothèse phonatoire a amélioré les scores de qualité de vie de 34%.',
      ar: 'حسّن التأهيل الصوتي المبكر باستخدام الثقب المريئي الرغامي من درجات جودة الحياة بعد العملية بنسبة 34٪.'
    }
  },
  {
    id: 'orl-10',
    title: {
      en: 'Early Detection Strategies for Laryngeal Cancer',
      fr: 'Stratégies de détection précoce du cancer du larynx',
      ar: 'استراتيجيات الكشف المبكر عن سرطان الحنجرة'
    },
    snippet: {
      en: 'Guidelines for persistent hoarseness assessment, narrow-band imaging laryngoscopy, and screening high-risk smokers.',
      fr: 'Directives d\'évaluation de la raucité persistante, laryngoscopie NBI et dépistage des fumeurs à risque.',
      ar: 'إرشادات لتقييم بحة الصوت المستمرة، وتدابير تنظير الحنجرة بالأشعة الضيقة NBI، وفحص المدخنين ذوي الخطورة العالية.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '7 min read',
    date: '2026-04-18',
    author: 'Dr. Al-Faruqi, MD',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1016/orl.early.2026',
    citationCount: 25,
    clinicalImpact: {
      en: 'Referring Hoarseness lasting >3 weeks directly to laryngoscopy shortened diagnosis delay by 44 days.',
      fr: 'L\'orientation des dysphonies de >3 semaines directement en laryngoscopie a réduit le délai de diagnostic de 44 jours.',
      ar: 'أدى توجيه حالات بحة الصوت المستمرة لأكثر من 3 أسابيع مباشرة إلى تنظير الحنجرة إلى تقليل تأخر التشخيص بمقدار 44 يوماً.'
    }
  },
  {
    id: 'orl-11',
    title: {
      en: 'Genetic Susceptibility in Head and Neck Cancer',
      fr: 'Susceptibilité génétique dans le cancer de la tête et du cou',
      ar: 'الاستعداد الجيني لسرطانات الرأس والعنق'
    },
    snippet: {
      en: 'Analyzing single nucleotide polymorphisms (SNPs) in DNA repair enzymes and alcohol dehydrogenase pathways.',
      fr: 'Analyse des polymorphismes nucléotidiques (SNP) des enzymes de réparation de l\'ADN et métabolisme de l\'alcool.',
      ar: 'تحليل تعدد الأشكال أحادي النكليوتيدات (SNPs) في إنزيمات إصلاح الحمض النووي ومسارات نزع هيدروجين الكحول.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-04-12',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/orl.gen.2026',
    citationCount: 15,
    clinicalImpact: {
      en: 'ADH1B and ALDH2 gene polymorphisms modulate individual mucosal sensitivity to alcohol toxicity.',
      fr: 'Les polymorphismes d\'ADH1B et ALDH2 modulent la sensibilité de la muqueuse à la toxicité de l\'alcool.',
      ar: 'تعدل التعددات الجينية في ADH1B وALDH2 من حساسية الأغشية المخاطية الفردية لسمية الكحول.'
    }
  },
  {
    id: 'orl-12',
    title: {
      en: 'Clinical Decision Support in Oncology',
      fr: 'Aide à la décision clinique en oncologie',
      ar: 'دعم القرار السريري في علم الأورام'
    },
    snippet: {
      en: 'Evaluating electronic guideline-based pathways and multidisciplinary tumor board decision logging systems.',
      fr: 'Évaluation des parcours électroniques basés sur les guides cliniques et des décisions de RCP en oncologie.',
      ar: 'تقييم المسارات الإلكترونية القائمة على الإرشادات الطبية وأنظمة تسجيل قرارات مجالس الأورام متعددة التخصصات.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-04-06',
    author: 'CareCalculus Engineering',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1016/orl.cds.2026',
    citationCount: 23,
    clinicalImpact: {
      en: 'Guideline adherence validation tools increased tumor board compliance with NCCN directives by 18.5%.',
      fr: 'Les outils de validation ont augmenté la conformité des décisions de RCP aux directives NCCN de 18,5%.',
      ar: 'أدت أدوات التحقق من الالتزام بالإرشادات إلى زيادة توافق مجالس الأورام مع توجيهات NCCN بنسبة 18.5٪.'
    }
  },
  {
    id: 'orl-13',
    title: {
      en: 'Cancer Registry Data Analytics',
      fr: 'Analyse des données des registres du cancer',
      ar: 'تحليلات بيانات سجل السرطان'
    },
    snippet: {
      en: 'Analyzing national registries to monitor survival curves, staging distributions, and clinical standards variation.',
      fr: 'Analyse des registres nationaux pour suivre les courbes de survie, les stades et les variations de pratiques.',
      ar: 'تحليل السجلات الوطنية لمراقبة منحنيات البقاء على قيد الحياة، وتوزيع المراحل، والاختلاف في معايير الممارسة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '8 min read',
    date: '2026-03-31',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1002/orl.reg.2026',
    citationCount: 20,
    clinicalImpact: {
      en: 'Identified significant regional discrepancies in access to voice rehabilitation services post-laryngectomy.',
      fr: 'A identifié des disparités régionales significatives dans l\'accès aux soins de rééducation vocale.',
      ar: 'حدد التحليل تباينات إقليمية كبيرة في الوصول إلى خدمات إعادة تأهيل النطق بعد استئصال الحنجرة.'
    }
  },
  {
    id: 'orl-14',
    title: {
      en: 'Precision Oncology for Laryngeal Cancer',
      fr: 'Oncologie de précision pour le cancer du larynx',
      ar: 'علاج الأورام الدقيق لسرطان الحنجرة'
    },
    snippet: {
      en: 'Targeted therapeutics, matching immunotherapy agents to PD-L1 expression levels, and organ preservation trials.',
      fr: 'Thérapies ciblées, immunothérapie selon l\'expression de PD-L1 et essais de préservation laryngée.',
      ar: 'العلاجات المستهدفة، ومطابقة عوامل العلاج المناعي لمستويات تعبير PD-L1، وتجارب الحفاظ على الحنجرة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '9 min read',
    date: '2026-03-25',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Al-Faruqi, MD',
    doi: '10.1016/orl.prec.2026',
    citationCount: 33,
    clinicalImpact: {
      en: 'Biomarker-guided patient enrichment trials increased therapeutic response rates to EGFR inhibitors in oncology.',
      fr: 'Les essais guidés par biomarqueurs ont augmenté les taux de réponse aux inhibiteurs de l\'EGFR.',
      ar: 'أدت التجارب الموجهة بالمؤشرات الحيوية إلى زيادة معدلات الاستجابة العلاجية لمثبطات EGFR في علاج الأورام.'
    }
  },
  {
    id: 'orl-15',
    title: {
      en: 'Future Directions in Head and Neck Cancer Research',
      fr: 'Directions futures de la recherche sur les cancers tête et cou',
      ar: 'الاتجاهات المستقبلية في أبحاث سرطان الرأس والعنق'
    },
    snippet: {
      en: 'Review of novel therapeutic vectors: liquid biopsy biomarkers, cellular immunotherapies, and combination agents.',
      fr: 'Revue des nouveaux vecteurs thérapeutiques : biopsies liquides, immunothérapie cellulaire et associations.',
      ar: 'مراجعة للمحاور العلاجية الجديدة: مؤشرات الخزعة السائلة، والعلاجات المناعية الخلوية، والعوامل المشتركة.'
    },
    category: 'ORL / Laryngeal Cancer',
    readTime: '9 min read',
    date: '2026-03-19',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/orl.fut.2026',
    citationCount: 12,
    clinicalImpact: {
      en: 'Circulating tumor DNA (ctDNA) detection in liquid biopsies predicts disease recurrence 3 months ahead of CT imaging.',
      fr: 'La détection de l\'ADN tumoral circulant (ctDNA) prédit la récidive 3 mois avant l\'imagerie scanner.',
      ar: 'يتنبأ الكشف عن الحمض النووي للأورام في الدورة الدموية (ctDNA) بنكس المرض قبل 3 أشهر من التصوير المقطعي.'
    }
  }
];

// --- Deterministic Medical Content Generator ---
export function generateMasterContent(id: string, title: string, snippet: string, lang: LangCode): string {
  const t = {
    clinicalOverview: { en: 'Clinical Overview & Background', fr: 'Aperçu clinique & contexte', ar: 'نظرة عامة وخلفية سريرية' },
    pathology: { en: 'Pathophysiological Insights', fr: 'Mécanismes physiopathologiques', ar: 'الآليات الفسيولوجية والتشريحية' },
    directives: { en: 'Clinical Directives & Recommendations', fr: 'Directives & recommandations cliniques', ar: 'التوجيهات والتوصيات السريرية' },
    conclusion: { en: 'Conclusions & Consensus Outcomes', fr: 'Conclusions & résultats de consensus', ar: 'الاستنتاجات وتوافق الآراء النهائي' },
    citations: { en: 'Secondary Citations & References', fr: 'Citations & références secondaires', ar: 'المراجع والاقتباسات العلمية المصاحبة' }
  };

  const c = (key: keyof typeof t) => t[key][lang] || t[key]['en'];

  // Keyword extraction for contextual paragraph generation
  const lowerTitle = title.toLowerCase();

  let introParagraph = '';
  let pathParagraph = '';
  let points: string[] = [];
  let closing = '';

  if (lowerTitle.includes('glp-1') || lowerTitle.includes('ozempic') || lowerTitle.includes('wegovy')) {
    if (lang === 'fr') {
      introParagraph = `Les analogues du récepteur GLP-1 (Glucagon-Like Peptide-1) ont révolutionné la prise en charge de l'obésité et du diabète de type 2. Ces peptides augmentent la sécrétion d'insuline dépendante du glucose, retardent la vidange gastrique et régulent l'appétit au niveau hypothalamique.`;
      pathParagraph = `Sur le plan physiologique, le récepteur GLP-1 est exprimé dans les cellules bêta pancréatiques, le système nerveux central et l'appareil cardiovasculaire. Les études montrent que l'activation de ces récepteurs réduit l'inflammation endothéliale et ralentit la progression de la néphropathie diabétique en diminuant l'hyperfiltration glomérulaire.`;
      points = [
        'Surveiller la clairance rénale et ajuster selon les calculateurs de filtration glomérulaire.',
        'Évaluer les symptômes gastro-intestinaux légers à modérés en début de traitement.',
        'Vérifier les antécédents de carcinome médullaire de la thyroïde avant toute prescription.',
        'Titrer progressivement la dose (de 0,25 mg à 1,0+ mg pour le sémaglutide) pour optimiser la tolérance.'
      ];
      closing = `En conclusion, les agonistes du récepteur GLP-1 offrent des bénéfices majeurs au-delà de la perte de poids, notamment en matière de cardioprotection et de préservation rénale chez les patients à haut risque.`;
    } else if (lang === 'ar') {
      introParagraph = `أحدثت ناهضات مستقبلات GLP-1 (الببتيد الشبيه بالغلوكاجون-1) ثورة في علاج السمنة وداء السكري من النوع الثاني. تعمل هذه المركبات على تحفيز إفراز الإنسولين المعتمد على الجلوكوز، وتأخير إفراغ المعدة، وتنظيم الشهية عبر مراكز الشبع في الدماغ.`;
      pathParagraph = `من الناحية الفسيولوجية، تفرز مستقبلات GLP-1 في خلايا بيتا البنكرياسية، والجهاز العصبي، والقلب. تشير الأدلة إلى أن تنشيط هذه المستقبلات يقلل من التهاب الأوعية الدموية ويحمي الكلى عن طريق تقليل الترشيح الكبيبي الزائد.`;
      points = [
        'مراقبة معدل ترشيح الكلى وضبط الجرعات وفقاً لحاسبة الكرياتينين.',
        'تقييم الأعراض المعوية الخفيفة إلى المتوسطة في بداية العلاج.',
        'التحقق من التاريخ العائلي لسرطان الغدة الدرقية النخاعي قبل البدء بالعلاج.',
        'زيادة الجرعة تدريجياً (من 0.25 ملغ إلى 1.0+ ملغ للسيماغلوتيد) لتحسين تحمل الجسم.'
      ];
      closing = `ختاماً، تقدم أدوية GLP-1 فوائد سريرية هامة تتجاوز إنقاص الوزن، لتشمل حماية القلب والأوعية الدموية والكلى لدى الفئات المعرضة لمخاطر مرتفعة.`;
    } else {
      introParagraph = `Glucagon-like peptide-1 (GLP-1) receptor agonists have revolutionized the clinical approach to obesity and type 2 diabetes. By enhancing glucose-dependent insulin secretion, delaying gastric emptying, and promoting central satiety pathways, these agents achieve significant metabolic control.`;
      pathParagraph = `Physiologically, GLP-1 receptors are widely distributed in pancreatic beta cells, cardiac tissue, the central nervous system, and renal vasculature. Activation mitigates endothelial inflammation, decreases glomerular hyperfiltration, and offers profound nephroprotective and cardioprotective benefits.`;
      points = [
        'Monitor creatinine clearance and renal indices to guide dosing adjustments.',
        'Evaluate gastrointestinal side effects during early titration phases.',
        'Screen for personal or family history of medullary thyroid carcinoma.',
        'Titrate dosing slowly (e.g., semaglutide from 0.25 mg to 1.0+ mg weekly) to improve patient tolerance.'
      ];
      closing = `In summary, GLP-1 receptor agonists offer comprehensive clinical utility extending far beyond weight loss, notably preserving renal and cardiovascular integrity in high-risk patient cohorts.`;
    }
  } else if (lowerTitle.includes('ai') || lowerTitle.includes('artificial') || lowerTitle.includes('intelligence') || lowerTitle.includes('machine learning')) {
    if (lang === 'fr') {
      introParagraph = `L'intégration de l'intelligence artificielle et de l'apprentissage automatique dans la pratique clinique redéfinit le triage des patients et la précision diagnostique. Les algorithmes modernes analysent rapidement des bases de données volumineuses pour repérer des anomalies infimes.`;
      pathParagraph = `Les réseaux de neurones convolutifs (CNN) excellent dans la reconnaissance d'images (CT, IRM, radiographies), tandis que les modèles prédictifs s'intègrent aux dossiers de santé pour signaler le risque de décompensation ou d'évolutivité de pathologies complexes.`;
      points = [
        'Toujours valider les alertes algorithmiques par un jugement clinique indépendant.',
        'Surveiller les taux de faux positifs pour atténuer la fatigue des alertes dans les services.',
        'Assurer la protection et le cryptage des données patients selon les normes en vigueur.',
        'Intégrer les variables d\'imagerie aux calculs cliniques pour affiner la stratification du risque.'
      ];
      closing = `L'IA doit être perçue comme un outil d'aide à la décision qui enrichit l'évaluation médicale sans jamais remplacer l'avis final du praticien au chevet du patient.`;
    } else if (lang === 'ar') {
      introParagraph = `يعيد دمج الذكاء الاصطناعي والتعلم الآلي في الممارسة السريرية تشكيل دقة التشخيص وسرعة فرز الحالات الإسعافية. تقوم الخوارزميات المتقدمة بتحليل مجموعات البيانات الكبيرة بسرعة للكشف عن المؤشرات الحيوية الدقيقة.`;
      pathParagraph = `تتفوق الشبكات العصبية الالتفافية (CNN) في تصنيف الصور الطبية (مثل الأشعة المقطعية والرنين)، بينما تساعد النماذج التنبؤية المدمجة في السجلات الطبية في تحديد مخاطر التدهور الفسيولوجي للمرضى بشكل مبكر.`;
      points = [
        'التحقق دائماً من تنبيهات الخوارزميات عبر التقييم السريري المستقل بجانب السرير.',
        'مراقبة معدلات الإيجابية الكاذبة للحد من التعب الناتج عن كثرة التنبيهات.',
        'ضمان تشفير بيانات المرضى وحمايتها وفقاً لمعايير الخصوصية الدولية.',
        'ربط بيانات الأشعة الآلية مع الحاسبات الطبية لزيادة دقة تصنيف المخاطر.'
      ];
      closing = `يعتبر الذكاء الاصطناعي وسيلة دعم ممتازة تعزز من كفاءة القرارات السريرية، دون الاستغناء عن الخبرة الطبية المستقلة للفريق المعالج.`;
    } else {
      introParagraph = `The integration of Artificial Intelligence (AI) and Machine Learning (ML) in clinical medicine is redefining diagnostic precision and patient triage. Modern algorithms process large-scale datasets to uncover micro-patterns and provide real-time decision support.`;
      pathParagraph = `Convolutional Neural Networks (CNNs) demonstrate high sensitivity in image recognition (CT, MRI, radiographs), while predictive model structures integrate with Electronic Health Records (EHRs) to flag impending physiological deterioration or sepsis risk.`;
      points = [
        'Sanity-check all algorithmic outputs against independent clinical judgment.',
        'Monitor false positive rates to mitigate alarm fatigue within high-stress wards.',
        'Ensure patient data encryption and privacy compliant with international regulations.',
        'Combine automated radiomics data with bedside calculator scores to refine risk stratification.'
      ];
      closing = `AI systems serve as diagnostic catalysts, compressing data analysis latency while clinical decision-making remains anchored on the medical practitioner.`;
    }
  } else if (lowerTitle.includes('stroke') || lowerTitle.includes('avc') || lowerTitle.includes('heart') || lowerTitle.includes('hypertension') || lowerTitle.includes('cardiometabolic')) {
    if (lang === 'fr') {
      introParagraph = `Les accidents vasculaires cérébraux et l'hypertension artérielle représentent des défis majeurs en cardiologie et neurologie. L'optimisation précoce des cibles de pression artérielle et l'identification des profils à risque sont cruciales pour prévenir les dommages irréversibles.`;
      pathParagraph = `L'hypertension chronique entraîne un remodelage vasculaire et décale la courbe d'autorégulation cérébrale. Une baisse trop abrupte de la pression peut induire une hypoperfusion, tandis qu'une pression non contrôlée augmente le risque d'hémorragie et de fibrillation auriculaire.`;
      points = [
        'Utiliser le score CHA2DS2-VASc pour évaluer le risque thromboembolique dans la FA.',
        'Maintenir une pression artérielle stable en évitant les fluctuations rapides aux urgences.',
        'Dépister les signes d\'accident vasculaire cérébral en utilisant les critères standardisés (FAST).',
        'Personnaliser les objectifs de pression artérielle moyenne en tenant compte de l\'âge et du profil vasculaire.'
      ];
      closing = `Une approche méthodique combinant évaluation des scores de risque et gestion personnalisée de la perfusion permet d'améliorer significativement le pronostic des maladies cardiovasculaires.`;
    } else if (lang === 'ar') {
      introParagraph = `تمثل السكتة الدماغية وارتفاع ضغط الدم الشرياني تحديات كبرى في طب القلب والأعصاب. ويعد الكشف المبكر والضبط الدقيق لأهداف ضغط الدم من العوامل الحاسمة للوقاية من التلف العصبي الدائم.`;
      pathParagraph = `يؤدي ارتفاع ضغط الدم المزمن إلى إعادة تشكيل الأوعية الدموية وإزاحة منحنى التنظيم الذاتي لتروية الدماغ. قد يتسبب الخفض السريع للضغط في نقص التروية، بينما يزيد الضغط المرتفع من مخاطر النزيف.`;
      points = [
        'استخدام حاسبة CHA2DS2-VASc لتقييم مخاطر السكتة الدماغية في الرجفان الأذيني.',
        'المحافظة على استقرار الضغط الشرياني وتجنب التقلبات الحادة في الطوارئ.',
        'تحديد العلامات المبكرة للسكتة الدماغية باستخدام معيار FAST المعتمد.',
        'تخصيص أهداف ضغط الشريان المتوسط (MAP) بناءً على عمر المريض وسيرته المرضية.'
      ];
      closing = `إن اتباع بروتوكول منظم يجمع بين حاسبات تقييم المخاطر وضبط الضغط الشخصي يسهم بشكل كبير في خفض معدلات الوفيات والمضاعفات الوعائية.`;
    } else {
      introParagraph = `Cerebrovascular accidents and hypertension remain primary clinical challenges in cardiology and neurology. Optimizing perfusion pressure targets and identifying high-risk cardiovascular profiles early are essential to mitigate permanent tissue damage.`;
      pathParagraph = `Chronic hypertension induces vascular remodeling, shifting cerebral autoregulation curves. Injudicious blood pressure drops risk cerebral hypoperfusion, while uncontrolled pressures accelerate intracranial hemorrhage and atrial fibrillation risks.`;
      points = [
        'Leverage the CHA2DS2-VASc score to stratify stroke risk in patients with atrial fibrillation.',
        'Maintain blood pressure stability, avoiding aggressive fluctuations in acute triage.',
        'Screen for acute neurological deficits using standardized clinical scales (FAST).',
        'Personalize target mean arterial pressures based on individual vascular stiffness and age.'
      ];
      closing = `A systematic approach combining standardized risk calculators and patient-specific hemodynamic targets improves overall survival and functional recovery.`;
    }
  } else if (lowerTitle.includes('laryngeal') || lowerTitle.includes('cancer') || lowerTitle.includes('larynx') || lowerTitle.includes('orl') || lowerTitle.includes('hpv') || lowerTitle.includes('oncology')) {
    if (lang === 'fr') {
      introParagraph = `Le carcinome épidermoïde du larynx est l'une des néoplasies des voies aérodigestives supérieures les plus fréquentes. Son diagnostic nécessite une évaluation endoscopique minutieuse et une classification rigoureuse de l'extension tumorale.`;
      pathParagraph = `Le larynx est divisé en trois sous-sites anatomiques : la supraglotte, la glotte et la sous-glotte. L'atteinte tumorale altère les fonctions essentielles de phonation, de déglutition et de respiration, imposant des stratégies thérapeutiques personnalisées basées sur la préservation d'organes.`;
      points = [
        'Classifier précisément la tumeur selon le système TNM de l\'AJCC/UICC.',
        'Dépister systématiquement le statut HPV qui représente un facteur pronostique majeur.',
        'Évaluer la mobilité des cordes vocales par laryngoscopie directe.',
        'Coordonner les soins en réunion de concertation pluridisciplinaire (RCP) pour l\'oncologie ORL.'
      ];
      closing = `Le dépistage précoce devant toute dysphonie persistante de plus de trois semaines et l'utilisation de calculateurs d'extension tumorale TNM permettent d'optimiser le taux de survie des patients.`;
    } else if (lang === 'ar') {
      introParagraph = `يعد سرطان الخلايا الحرشفية في الحنجرة من أكثر أورام الرأس والعنق انتشاراً. يتطلب التشخيص الدقيق تقييماً منظارياً شاملاً وتصنيفاً دقيقاً لمدى امتداد الورم لضمان اختيار العلاج الأنسب.`;
      pathParagraph = `تنقسم الحنجرة إلى ثلاثة أجزاء تشريحية: فوق المزمار، المزمار، وتحت المزمار. يؤدي نمو الورم إلى اضطرابات في النطق، والبلع، والتنفس، مما يتطلب استراتيجيات علاجية تهدف للحفاظ على وظائف الحنجرة.`;
      points = [
        'تصنيف الورم بدقة وفقاً لنظام TNM المعتمد من AJCC/UICC.',
        'فحص حالة فيروس الورم الحليمي البشري (HPV) كونه مؤشراً هاماً لتقدم المرض.',
        'تقييم حركة الحبال الصوتية عبر تنظير الحنجرة المباشر.',
        'مناقشة الحالات ضمن مجالس الأورام متعددة التخصصات لتنسيق العلاج الكيميائي والإشعاعي.'
      ];
      closing = `يسهم الفحص المبكر عند حدوث بحة صوتية مستمرة لأكثر من 3 أسابيع، واستخدام حاسبات تصنيف ورم الحنجرة TNM، في تحسين معدلات البقاء وجودة الحياة بشكل ملحوظ.`;
    } else {
      introParagraph = `Squamous cell carcinoma of the larynx is a primary neoplastic process within head and neck oncology. Accurate diagnosis requires high-resolution endoscopic visualization, tissue biopsy, and rigorous staging of anatomical extensions.`;
      pathParagraph = `The larynx is anatomically divided into the supraglottis, glottis, and subglottis. Tumor extension compromises essential functions of phonation, airway protection, and swallowing, demanding organ-preservation protocols whenever clinically feasible.`;
      points = [
        'Stage the tumor precisely using the AJCC/UICC TNM classification system.',
        'Determine HPV status as a crucial prognostic biomarker in head and neck squamous carcinomas.',
        'Evaluate vocal cord mobility via fiberoptic laryngoscopy or direct visualization.',
        'Manage cases through multidisciplinary tumor boards to coordinate surgery, radiotherapy, and immunotherapies.'
      ];
      closing = `Early referral for laryngoscopy in patients presenting with persistent hoarseness (>3 weeks) combined with automated TNM calculators significantly improves survival outcomes.`;
    }
  } else {
    // Default medical/clinical template
    if (lang === 'fr') {
      introParagraph = `Cette analyse clinique évalue les critères d'optimisation et la physiopathologie associés au sujet traité. Les données cliniques récentes soulignent l'importance d'une approche individualisée pour limiter les complications et optimiser les ressources.`;
      pathParagraph = `Sur le plan biochimique et fonctionnel, l'atteinte d'objectifs validés préserve la perfusion tissulaire, réduit la réponse inflammatoire systémique et améliore les paramètres cinétiques urinaires ou hémodynamiques.`;
      points = [
        'Vérifier les constantes physiologiques avant toute modification thérapeutique.',
        'Se référer aux guides de calcul pour standardiser les prises de décision clinique.',
        'Auditer régulièrement les taux de réussite des interventions au sein du service.',
        'Prendre en compte les comorbidités et le profil d\'âge du patient.'
      ];
      closing = `En conclusion, l'application de protocoles de décision standardisés et fondés sur les preuves améliore la sécurité des soins et le devenir des patients.`;
    } else if (lang === 'ar') {
      introParagraph = `يحلل هذا التقييم السريري معايير التحسين والفيزيولوجيا المرضية المرتبطة بموضوع الدراسة. تؤكد الأبحاث الحديثة على أهمية تخصيص الرعاية الطبية لتحقيق أفضل النتائج الفسيولوجية وتقليل المضاعفات.`;
      pathParagraph = `من الناحية الحيوية والوظيفية، يسهم الحفاظ على المؤشرات الحيوية السليمة في تحسين تروية الأنسجة، والحد من الاستجابات الالتهابية، وضبط الحركية الدوائية ومعدلات التصفية الكلوية.`;
      points = [
        'التحقق من المؤشرات الحيوية الأساسية للمريض قبل تعديل الجرعات العلاجية.',
        'الرجوع للحاسبات السريرية المعتمدة لتوحيد بروتوكولات اتخاذ القرار.',
        'مراجعة وتدقيق معدلات نجاح التدخلات السريرية بشكل دوري في القسم.',
        'مراعاة الفروق الفردية في العمر والأمراض المصاحبة للمريض.'
      ];
      closing = `ختاماً، فإن تطبيق بروتوكولات رعاية سريرية موحدة وقائمة على الأدلة العلمية يسهم بشكل مباشر في رفع سلامة المرضى وتحسين جودة الرعاية.`;
    } else {
      introParagraph = `This clinical analysis evaluates the optimization criteria and pathophysiology associated with the subject. Recent trial evidence underlines the necessity of individualized pathways to minimize clinical complications and optimize hospital resources.`;
      pathParagraph = `Biochemically and functionally, securing validated target thresholds preserves tissue perfusion, mitigates systemic inflammatory responses, and improves renal clearance kinetics or cardiovascular reserve.`;
      points = [
        'Establish baseline physiological parameters before initiating therapeutic adjustments.',
        'Consult validated clinical calculators to standardize bedside decision-making.',
        'Periodically audit intervention outcomes within your clinical unit.',
        'Account for patient age, vascular stiffness, and active metabolic comorbidities.'
      ];
      closing = `In conclusion, adhering to standardized, evidence-based clinical protocols enhances patient safety margins and improves recovery endpoints.`;
    }
  }

  return `### ${c('clinicalOverview')}
${introParagraph}

### ${c('pathology')}
${pathParagraph}

### ${c('directives')}
${points.map((pt, idx) => `${idx + 1}. **${pt}**`).join('\n')}

### ${c('conclusion')}
${closing}

### ${c('citations')}
* *Vance A. et al. Global Clinical Guideline Indexing (2025).*
* *Dupont J-P. et al. Multilingual Decision Support Protocols (2024).*`;
}

// Helper to get localized values from TranslationSet
export const t = (ts: TranslationSet, lang: LangCode): string => {
  return ts[lang] || ts.en;
};

// Course Localization Helper
export function getLocalizedCourse(mc: MasterCourse, lang: LangCode) {
  const isFr = lang === 'fr';
  const isAr = lang === 'ar';

  const qText = isFr 
    ? `Quel est le but principal de ce cours sur "${t(mc.title, lang)}"?`
    : isAr
    ? `ما هو الهدف الأساسي من دراسة "${t(mc.title, lang)}"؟`
    : `What is the primary clinical objective of studying "${t(mc.title, lang)}"?`;

  const options = isFr
    ? [
        'Améliorer la prise de décision clinique basée sur des preuves.',
        'Remplacer le jugement clinique par des algorithmes.',
        'Réduire le temps passé au chevet du patient.',
        'Mémoriser des formules statiques.'
      ]
    : isAr
    ? [
        'تحسين اتخاذ القرار السريري بناءً على الأدلة الطبية.',
        'استبدال التقييم الطبي المستقل بالكامل بالخوارزميات.',
        'تقليل الوقت المخصص لرعاية المريض بجانب السرير.',
        'حفظ المعادلات الطبية القديمة بدون فهم.'
      ]
    : [
        'Improve evidence-based clinical decision making and safety.',
        'Replace independent clinical judgment with automated rules.',
        'Reduce direct patient face-time at the bedside.',
        'Memorize static mathematical formulas without context.'
      ];

  return {
    id: mc.id,
    title: t(mc.title, lang),
    instructor: mc.instructor,
    date: mc.date,
    size: mc.size,
    pages: mc.pages,
    category: mc.category,
    summary: t(mc.summary, lang),
    sections: [
      {
        heading: isFr ? 'Chapitre 1 : Introduction et fondements physiologiques' : isAr ? 'الفصل الأول: المقدمة والأسس الفسيولوجية' : 'Chapter 1: Introduction & Physiological Foundations',
        text: isFr 
          ? `Ce cours explore les concepts clés de ${t(mc.title, lang)}. Les cliniciens doivent maîtriser ces principes pour guider correctement le diagnostic et personnaliser la prise en charge thérapeutique.`
          : isAr
          ? `يستكشف هذا المنهج المفاهيم الأساسية لـ ${t(mc.title, lang)}. يجب على الممارس الصحي إتقان هذه المبادئ لتوجيه التشخيص السريري السليم وتخصيص العلاج.`
          : `This syllabus explores the essential concepts of ${t(mc.title, lang)}. Clinicians must master these foundational principles to guide accurate clinical diagnosis and personalize therapeutic pathways.`
      },
      {
        heading: isFr ? 'Chapitre 2 : Mises en œuvre cliniques et lignes directrices' : isAr ? 'الفصل الثاني: التطبيقات السريرية والإرشادات العملية' : 'Chapter 2: Bedside Implementations & Guidelines',
        text: isFr
          ? `L'application pratique de ces notions nécessite une validation rigoureuse au chevet du patient. L'utilisation de calculateurs d'aide à la décision permet de standardiser les soins et de sécuriser les prescriptions.`
          : isAr
          ? `يتطلب التطبيق العملي لهذه المفاهيم التحقق السريري الدقيق بجانب سرير المريض. يساعد استخدام أدوات دعم القرار في توحيد بروتوكولات الرعاية ورفع مستوى السلامة.`
          : `Bedside application of these concepts requires rigorous physiological validation. Integrating clinical decision support software standardizes patient care and enhances safety margins.`
      }
    ],
    quiz: [
      {
        question: qText,
        options,
        answerIndex: 0
      }
    ]
  };
}

// Presentation Localization Helper
export function getLocalizedPresentation(mp: MasterPresentation, lang: LangCode) {
  const isFr = lang === 'fr';
  const isAr = lang === 'ar';

  return {
    id: mp.id,
    title: t(mp.title, lang),
    author: mp.author,
    date: mp.date,
    size: mp.size,
    slideCount: mp.slideCount,
    category: mp.category,
    description: t(mp.description, lang),
    slides: [
      {
        title: isFr ? 'Diapositive 1: Introduction et Objectifs' : isAr ? 'الشريحة الأولى: المقدمة والأهداف' : 'Slide 1: Introduction & Clinical Objectives',
        points: isFr
          ? [
              `Aperçu historique et pertinence de : ${t(mp.title, lang)}.`,
              'Analyse des indicateurs cliniques et des publications scientifiques de référence.',
              'Objectifs pédagogiques et de sécurité des soins pour ce module.'
            ]
          : isAr
          ? [
              `نبذة تاريخية ومدى أهمية موضوع: ${t(mp.title, lang)}.`,
              'تحليل المؤشرات السريرية والدراسات الطبية المرجعية المعتمدة.',
              'الأهداف التعليمية العامة وضوابط تعزيز سلامة المرضى.'
            ]
          : [
              `Historical overview and clinical relevance of: ${t(mp.title, lang)}.`,
              'Analysis of key clinical metrics and primary scientific literature references.',
              'Learning objectives and safety standards established for this session.'
            ],
        diagramType: 'default' as const
      },
      {
        title: isFr ? 'Diapositive 2: Physiopathologie et Mécanismes' : isAr ? 'الشريحة الثانية: الآليات الفسيولوجية والتشريحية' : 'Slide 2: Pathophysiology & Mechanisms',
        points: isFr
          ? [
              'Explication des cascades biochimiques ou des dérégulations organiques impliquées.',
              'Corrélations avec les variables de laboratoire (créatinine, lactate, etc.).',
              'Différences de réponse selon l\'âge ou les antécédents cardiovasculaires.'
            ]
          : isAr
          ? [
              'شرح تفصيلي للتفاعلات الحيوية والقصور العضوي المرتبط بالحالة.',
              'الارتباط بالتحاليل المخبرية للمريض (مثل الكرياتينين، اللاكتات، إلخ).',
              'فروق الاستجابة الفسيولوجية وفقاً لعمر المريض وحالته الوعائية.'
            ]
          : [
              'Detailed explanation of biochemical cascades or organ dysfunctions involved.',
              'Correlation with key patient laboratory findings (creatinine, lactate, etc.).',
              'Physiological response variations based on patient age and vascular status.'
            ],
        diagramType: 'hemodynamic' as const
      },
      {
        title: isFr ? 'Diapositive 3: Applications Pratiques et Recommandations' : isAr ? 'الشريحة الثالثة: التطبيق العملي والتوصيات' : 'Slide 3: Bedside Applications & Directives',
        points: isFr
          ? [
              'Ajustements thérapeutiques recommandés par les sociétés savantes (AHA, ESC, etc.).',
              'Intégration des calculateurs médicaux pour limiter les risques de dosage.',
              'Évaluation et suivi de l\'état de perfusion ou d\'oxygénation.'
            ]
          : isAr
          ? [
              'التعديلات العلاجية الموصى بها من الهيئات الطبية العالمية.',
              'دمج استخدام الحاسبات السريرية للحد من أخطاء تحديد الجرعات.',
              'متابعة مستويات التروية الدموية أو الأكسجة النسيجية بدقة.'
            ]
          : [
              'Therapeutic adjustments recommended by leading medical associations.',
              'Integrating clinical software calculators to mitigate dosage errors.',
              'Monitoring perfusion parameters or systemic oxygenation indexes.'
            ],
        diagramType: 'pharmacology' as const
      },
      {
        title: isFr ? 'Diapositive 4: Conclusion et Consensus' : isAr ? 'الشريحة الرابعة: الخلاصة وتوافق الآراء' : 'Slide 4: Summary & Consensus Guidelines',
        points: isFr
          ? [
              'Synthèse des points clés et impact sur la mortalité hospitalière.',
              'Directives de sortie de service et suivi ambulatoire des patients.',
              'Importance de l\'éducation thérapeutique continue pour les soignants.'
            ]
          : isAr
          ? [
              'ملخص النقاط الأساسية وأثر التقييم في خفض معدل الوفيات.',
              'بروتوكولات خروج المريض وتنسيق المتابعة الخارجية للرعاية.',
              'أهمية التدريب الطبي المستمر لتطبيق الإرشادات الحديثة.'
            ]
          : [
              'Summary of key take-home points and impact on in-hospital mortality.',
              'Discharge criteria and ambulatory follow-up protocols.',
              'Significance of continuous medical education to maintain best practice.'
            ],
        diagramType: 'default' as const
      }
    ]
  };
}
