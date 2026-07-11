import { LangCode } from '../types';

export interface TranslationSet {
  en: string;
  fr: string;
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
      en: 'GLP-1 Medications in 2026: How They Work, Who Qualifies, and What the Evidence Actually Shows',
      fr: 'Médicaments GLP-1 en 2026 : fonctionnement, éligibilité et ce que montrent réellement les preuves'
    },
    snippet: {
      en: 'An evidence-based guide to glucagon-like peptide-1 receptor agonists, clinical eligibility criteria, and 2026 outcomes.',
      fr: 'Un guide basé sur les preuves pour les agonistes des récepteurs GLP-1, les critères d\'éligibilité et les résultats de 2026.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-06-12',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-2',
    title: {
      en: 'Ozempic vs Wegovy: A Clinician\'s Side-by-Side Comparison of Dosing, Outcomes, and Patient Selection',
      fr: 'Ozempic vs Wegovy : comparaison clinique des dosages, des résultats et de la sélection des patients'
    },
    snippet: {
      en: 'Understanding clinical dosing, efficacy metrics, and patient selection criteria between semaglutide formulations.',
      fr: 'Comprendre les dosages cliniques, l\'efficacité et la sélection des patients pour les formulations de sémaglutide.'
    },
    category: 'Clinical Tips',
    readTime: 5,
    date: '2026-06-10',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-3',
    title: {
      en: 'GLP-1 Drugs and Cardiovascular Risk: What the SUSTAIN-6 and SELECT Trials Tell Us',
      fr: 'Médicaments GLP-1 et risque cardiovasculaire : les enseignements des essais SUSTAIN-6 et SELECT'
    },
    snippet: {
      en: 'An authority review of landmark clinical trials demonstrating the cardiovascular protective effects of GLP-1 therapies.',
      fr: 'Une revue faisant autorité des essais cliniques majeurs démontrant les effets protecteurs cardiovasculaires des thérapies GLP-1.'
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
      fr: 'GLP-1 et santé rénale : Ce que montrent les preuves'
    },
    snippet: {
      en: 'Exploring diabetic nephropathy trials and how GLP-1 medications protect glomerular filtration.',
      fr: 'Exploration des essais sur la néphropathie diabétique et de la protection du GLP-1 sur la filtration glomérulaire.'
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
      fr: 'L\'alimentation comme médecine : Preuves scientifiques pour de meilleurs résultats'
    },
    snippet: {
      en: 'Evaluating clinical nutritional therapies and dietary impact on metabolic diseases.',
      fr: 'Évaluation des thérapies nutritionnelles cliniques et de l\'impact du régime sur les maladies métaboliques.'
    },
    category: 'Editorial',
    readTime: 3,
    date: '2026-06-04',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-6',
    title: {
      en: 'AI in Clinical Practice 2026: What Physicians Are Actually Using — and What\'s Still Hype',
      fr: 'L\'IA en pratique clinique 2026 : ce que les médecins utilisent réellement — et ce qui relève encore du battage médiatique'
    },
    snippet: {
      en: 'A critical review of generative AI models, diagnostic aids, and workflow automation in active clinical practice.',
      fr: 'Une revue critique des modèles d\'IA générative, des aides au diagnostic et de l\'automatisation dans la pratique clinique active.'
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
      fr: 'Appareils de santé connectés : Avantages et limites'
    },
    snippet: {
      en: 'Analyzing consumer smartwatches, portable ECGs, and their false positive rates in clinical practice.',
      fr: 'Analyse des montres connectées, ECG portables et leurs taux de faux positifs en pratique clinique.'
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
      fr: 'L\'avenir de la surveillance à distance des patients'
    },
    snippet: {
      en: 'How home telemetry and automated alert algorithms reduce re-admission rates for heart failure.',
      fr: 'Comment la télémétrie à domicile et les alertes automatisées réduisent les réadmissions pour insuffisance cardiaque.'
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
      fr: 'Comprendre le COVID long : Dernières mises à jour de la recherche'
    },
    snippet: {
      en: 'Evaluating metabolic pathways, mitochondrial fatigue, and clinical options for persistent post-viral syndromics.',
      fr: 'Évaluation des voies métaboliques, de la fatigue mitochondriale et des options cliniques post-virales.'
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
      fr: 'Principales causes d\'AVC chez les jeunes adultes'
    },
    snippet: {
      en: 'Identifying risk profiles beyond classical atherosclerosis: dissection, patent foramen ovale, and hypercoagulability.',
      fr: 'Identification des profils de risque au-delà de l\'athérosclérose classique : dissection, FOP et hypercoagulabilité.'
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
      fr: 'Signes d\'alerte précoce de l\'AVC que tout le monde devrait connaître'
    },
    snippet: {
      en: 'Clinical overview of the FAST criteria, atypical presentations, and time-critical pathways.',
      fr: 'Aperçu clinique des critères FAST, des présentations atypiques et des urgences vitales liées au temps.'
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
      fr: 'Stratégies de prévention du diabète appuyées par la science'
    },
    snippet: {
      en: 'Review of randomized lifestyle intervention trials, metformin protocols, and early biomarkers.',
      fr: 'Revue des essais d\'intervention sur le mode de vie, protocoles metformine et biomarqueurs précoces.'
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
      fr: 'Comprendre le prédiabète avant qu\'il ne devienne un diabète'
    },
    snippet: {
      en: 'Impaired glucose tolerance thresholds, HbA1c screening guidelines, and organ preservation basics.',
      fr: 'Seuils d\'intolérance au glucose, directives de dépistage de l\'HbA1c et préservation des organes.'
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
      fr: 'Hypertension : Nouvelles directives pour les patients et les cliniciens'
    },
    snippet: {
      en: 'Analyzing ACC/AHA and ESC classification discrepancies, drug combinations, and home measurement guidelines.',
      fr: 'Analyse des divergences ACC/AHA et ESC, combinaisons de médicaments et mesure à domicile.'
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
      fr: 'L\'obésité et le syndrome métabolique expliqués'
    },
    snippet: {
      en: 'Pathology of visceral adiposity, insulin resistance cascades, and therapeutic index options.',
      fr: 'Pathologie de l\'adiposité viscérale, résistance à l\'insuline et options d\'index thérapeutiques.'
    },
    category: 'Clinical Tips',
    readTime: 4,
    date: '2026-05-15',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-16',
    title: {
      en: 'The 2026 Longevity Playbook: Evidence-Based Habits, Biomarkers, and Therapies That Actually Extend Healthspan',
      fr: 'Le guide de la longévité 2026 : habitudes basées sur les preuves, biomarqueurs et thérapies qui prolongent la durée de vie en bonne santé'
    },
    snippet: {
      en: 'A comprehensive playbook detailing validated biomarkers, lifestyle interventions, and pharmacological therapies that support healthspan.',
      fr: 'Un guide complet détaillant les biomarqueurs validés, les interventions de style de vie et les thérapies pharmacologiques.'
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
      fr: 'Optimisation du sommeil pour une meilleure santé'
    },
    snippet: {
      en: 'Sleep architecture dynamics, glymphatic clearance, and metabolic consequences of chronic insomnia.',
      fr: 'Dynamique du sommeil, clairance glymphatique et conséquences métaboliques de l\'insomnie.'
    },
    category: 'Clinical Tips',
    readTime: 3,
    date: '2026-05-11',
    author: 'Dr. Marcus Thorne, Ph.D.'
  },
  {
    id: 'mb-18',
    title: {
      en: 'Your Gut Microbiome Is Running Your Health: The Brain, Immunity, and Metabolic Connections You Need to Know',
      fr: 'Votre microbiome intestinal gère votre santé : les connexions cerveau-immunité-métabolisme à connaître'
    },
    snippet: {
      en: 'Evaluating the clinical links between gut microbiota composition, systemic inflammatory responses, and metabolic diseases.',
      fr: 'Évaluation des liens cliniques entre la composition du microbiote intestinal, l\'inflammation et les maladies métaboliques.'
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
      fr: 'Carence en vitamine D : Symptômes et traitement'
    },
    snippet: {
      en: 'Bone metabolic pathways, immune regulation roles, and safe replacement guidelines for adults.',
      fr: 'Voies métaboliques osseuses, régulation immunitaire et supplémentation sécurisée pour les adultes.'
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
      fr: 'Anémie ferriprive : Diagnostic et traitement'
    },
    snippet: {
      en: 'Differential diagnosis with ferritin and transferrin, oral vs intravenous replacement, and guidelines.',
      fr: 'Diagnostic différentiel (ferritine, transferrine), fer oral vs intraveineux et recommandations.'
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
      fr: 'Recommandations de dépistage du cancer pour les adultes'
    },
    snippet: {
      en: 'USPSTF updates on colonoscopy, mammography, lung CT guidelines, and patient risk profiles.',
      fr: 'Mises à jour de l\'USPSTF sur la coloscopie, mammographie, scanner pulmonaire et profils de risque.'
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
      fr: 'Comprendre le VPH et la prévention du cancer'
    },
    snippet: {
      en: 'HPV transmission dynamics, screening methods, vaccination impact, and head & neck margins.',
      fr: 'Transmission du VPH, méthodes de dépistage, impact de la vaccination et cancers tête et cou.'
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
      fr: 'Liens entre santé mentale et santé physique'
    },
    snippet: {
      en: 'Endocrine stress responses, cytokine pathways in depression, and integrated clinical models.',
      fr: 'Réponse endocrine au stress, voies des cytokines dans la dépression et modèles cliniques intégrés.'
    },
    category: 'Editorial',
    readTime: 3,
    date: '2026-04-28',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-24',
    title: {
      en: 'GLP-1, Hormones, and Weight: Why Metabolic Health in Women Requires a Different Approach',
      fr: 'GLP-1, hormones et poids : pourquoi la santé métabolique des femmes nécessite une approche différente'
    },
    snippet: {
      en: 'Analyzing the intersection of hormonal profiles, life-stage metabolic shifts, and GLP-1 receptor agonist response in female patients.',
      fr: 'Analyse de l\'intersection des profils hormonaux, des changements métaboliques et de la réponse au GLP-1 chez les patientes.'
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
      fr: 'Mythes de la nutrition démystifiés par la science'
    },
    snippet: {
      en: 'Separating marketing claims from biochemical facts: keto, fasting, and detox reviews.',
      fr: 'Séparer le marketing des faits biochimiques : céto, jeûne et cures détox.'
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
      fr: 'Comment l\'intelligence artificielle aide au diagnostic médical'
    },
    snippet: {
      en: 'Deep learning in dermatology, ECG analysis, and electronic record triggers.',
      fr: 'Apprentissage profond en dermatologie, analyse de l\'ECG et alertes du dossier médical.'
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
      fr: 'L\'IA en imagerie médicale : Opportunités et défis'
    },
    snippet: {
      en: 'CT fracture detection algorithms, MRI segmentations, and liability questions in diagnosis.',
      fr: 'Détection de fractures au scanner, segmentation IRM et questions de responsabilité légale.'
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
      fr: 'La médecine de précision expliquée'
    },
    snippet: {
      en: 'Pharmacogenomics, matching oncology therapeutics to somatic gene variations, and patient cohorts.',
      fr: 'Pharmacogénomique, thérapies ciblées en oncologie selon les gènes tumoraux et cohortes.'
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
      fr: 'Tendances de la santé numérique qui façonnent l\'avenir'
    },
    snippet: {
      en: 'Decentralized trials, smart implants, virtual hospital networks, and cloud clinical structures.',
      fr: 'Essais cliniques décentralisés, implants connectés, hôpitaux virtuels et cloud médical.'
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
      fr: 'Bonnes pratiques en télémédecine'
    },
    snippet: {
      en: 'Virtual evaluation parameters, camera calibration setups, and patient privacy frameworks.',
      fr: 'Paramètres d\'évaluation virtuelle, réglages caméra et conformité RGPD/HIPAA.'
    },
    category: 'Practice',
    readTime: 3,
    date: '2026-04-14',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-31',
    title: {
      en: 'Oral GLP-1 Medications: Navigating the Transition from Injectable to Oral Therapies in H1 2026',
      fr: 'Médicaments GLP-1 oraux : naviguer dans la transition des thérapies injectables aux thérapies orales au S1 2026'
    },
    snippet: {
      en: 'Exploring oral semaglutide, next-generation peptide formulations, and patient compliance dynamics in clinical practice.',
      fr: 'Exploration du sémaglutide oral, des formulations de peptides de nouvelle génération et de l\'observance des patients.'
    },
    category: 'Clinical Tips',
    readTime: 5,
    date: '2026-06-14',
    author: 'Dr. Jean-Pierre Dupont, MD'
  },
  {
    id: 'mb-32',
    title: {
      en: 'The Gut–Brain Axis in 2026: How Microbiome Health Influences Neurological and Metabolic Pathways',
      fr: 'L\'axe intestin-cerveau en 2026 : comment la santé du microbiome influence les voies neurologiques et métaboliques'
    },
    snippet: {
      en: 'A deep clinical dive into short-chain fatty acids (SCFAs), vagal nerve signaling, and the micro-inflammatory gut-brain connection.',
      fr: 'Une plongée clinique dans les acides gras à chaîne courte (SCFA), la signalisation du nerf vague et l\'inflammation intestin-cerveau.'
    },
    category: 'Clinical Tips',
    readTime: 6,
    date: '2026-06-13',
    author: 'Dr. Marcus Thorne, Ph.D.'
  },
  {
    id: 'mb-33',
    title: {
      en: 'How Bedside Calculators Impact Real Patient Outcomes: A Case-Study Review',
      fr: 'Comment les calculateurs au chevet du patient influencent les résultats réels : revue d\'études de cas'
    },
    snippet: {
      en: 'Reviewing multivariable clinical support tools (CHADS-VASc, Wells, and MAP) and their documented role in reducing diagnostic latency.',
      fr: 'Revue des outils d\'aide à la décision (CHADS-VASc, Wells, PAM) et de leur rôle dans la réduction des délais de diagnostic.'
    },
    category: 'Practice',
    readTime: 5,
    date: '2026-06-11',
    author: 'CareCalculus Editorial Team'
  },
  {
    id: 'mb-34',
    title: {
      en: 'Exercise Prescription as Medicine: Evidence-Based Physical Therapy in Metabolic Management',
      fr: 'La prescription d\'exercices comme médecine : thérapie physique basée sur des preuves dans la gestion métabolique'
    },
    snippet: {
      en: 'Detailing exercise type, intensity thresholds, and cellular adaptations that reverse insulin resistance and support glycemic control.',
      fr: 'Détail du type d\'exercice, des seuils d\'intensité et des adaptations cellulaires qui réduisent la résistance à l\'insuline.'
    },
    category: 'Clinical Tips',
    readTime: 5,
    date: '2026-06-09',
    author: 'Prof. Alice Vance, MD, Ph.D.'
  },
  {
    id: 'mb-35',
    title: {
      en: 'AI and Health Equity in Low-Resource Settings: Balancing Innovation and Access in Global Healthcare',
      fr: 'IA et équité en santé dans les milieux à faibles ressources : équilibrer innovation et accès aux soins mondiaux'
    },
    snippet: {
      en: 'Analyzing clinical validation gaps, regional dataset biases, and implementation strategies for diagnostic AI in global health.',
      fr: 'Analyse des lacunes de validation, des biais des jeux de données régionaux et des stratégies pour l\'IA dans la santé mondiale.'
    },
    category: 'Technology',
    readTime: 6,
    date: '2026-06-07',
    author: 'CareCalculus Engineering'
  },
  {
    id: 'mb-36',
    title: {
      en: 'The GLP-1 Muscle Crisis: What to Eat When You Forget to Eat',
      fr: 'La crise musculaire du GLP-1 : quoi manger quand on oublie de manger'
    },
    snippet: {
      en: 'Ozempic and Wegovy quiet the food noise, but they can cause muscle loss. Here is exactly how to rewrite your diet.',
      fr: 'Les molécules GLP-1 calment la faim, mais peuvent entraîner une fonte musculaire. Voici comment adapter votre alimentation.'
    },
    category: 'Clinical Tips',
    readTime: 5,
    date: '2026-06-25',
    author: 'Dr. Jean-Pierre Dupont, MD'
  }
];

// 2. 20 MEDICAL JOURNALS
export const MASTER_JOURNALS: MasterJournal[] = [
  {
    id: 'mj-new-1',
    title: {
      en: 'ESPEN Guideline on Nutrition and Hydration in Dementia: 2024 Update',
      fr: 'Recommandations de l\'ESPEN sur la nutrition et l\'hydratation dans la démence : mise à jour 2024'
    },
    snippet: {
      en: 'Updated evidence-based recommendations on the prevention and management of malnutrition and dehydration in older adults with dementia.',
      fr: 'Recommandations actualisées basées sur des preuves pour la prévention et la gestion de la malnutrition et de la déshydratation chez les personnes âgées atteintes de démence.'
    },
    category: 'Clinical Guidelines',
    readTime: '15',
    date: '2024-05-15',
    author: 'ESPEN Working Group',
    reviewer: 'Clinical Nutrition Journal',
    doi: '10.1016/j.clnu.2024.04.008',
    citationCount: 45,
    clinicalImpact: {
      en: 'Provides essential protocols to optimize quality of life and nutritional status in dementia patients.',
      fr: 'Fournit des protocoles essentiels pour optimiser la qualité de vie et l\'état nutritionnel des patients atteints de démence.'
    }
  },
  {
    id: 'mj-new-2',
    title: {
      en: 'Clinical Nutrition in Acute and Chronic Kidney Disease: Practical ESPEN Guidelines 2024',
      fr: 'Nutrition clinique dans les maladies rénales aiguës et chroniques : recommandations pratiques de l\'ESPEN 2024'
    },
    snippet: {
      en: 'Key statements and 32 practical recommendations for nutritional assessment, feeding routes, and kidney replacement therapy integration.',
      fr: 'Déclarations clés et 32 recommandations pratiques pour l\'évaluation nutritionnelle, les voies d\'alimentation et l\'intégration de la thérapie de remplacement rénal.'
    },
    category: 'Clinical Guidelines',
    readTime: '20',
    date: '2024-08-20',
    author: 'Alice Sabatino et al.',
    reviewer: 'Clinical Nutrition Journal',
    doi: '10.1016/j.clnu.2024.08.002',
    citationCount: 112,
    clinicalImpact: {
      en: 'Standardizes nutritional interventions tailored to patients undergoing KRT and conservative kidney management.',
      fr: 'Standardise les interventions nutritionnelles adaptées aux patients sous TRR et gestion rénale conservatrice.'
    }
  },
  {
    id: 'mj-new-3',
    title: {
      en: 'ESPEN Practical Guideline: Clinical Nutrition in Acute and Chronic Pancreatitis 2024',
      fr: 'Recommandation pratique ESPEN : nutrition clinique dans la pancréatite aiguë et chronique 2024'
    },
    snippet: {
      en: 'Standardized protocols for optimizing enteral nutrition and metabolic support in patients hospitalized with acute or chronic pancreatitis.',
      fr: 'Protocoles standardisés pour optimiser la nutrition entérale et le soutien métabolique chez les patients hospitalisés pour pancréatite aiguë ou chronique.'
    },
    category: 'Clinical Guidelines',
    readTime: '18',
    date: '2024-02-10',
    author: 'ESPEN Guidelines Committee',
    reviewer: 'Clinical Nutrition Journal',
    doi: '10.1016/j.clnu.2023.12.024',
    citationCount: 89,
    clinicalImpact: {
      en: 'Updates the timing of enteral feeding and management of exocrine pancreatic insufficiency.',
      fr: 'Met à jour le moment de l\'alimentation entérale et la gestion de l\'insuffisance pancréatique exocrine.'
    }
  },
  {
    id: 'mj-1',
    title: {
      en: 'GLP-1 Receptor Agonists in Obesity and Cardiometabolic Disease: A Systematic Review of Efficacy, Safety, and Emerging Indications (2020–2026)',
      fr: 'Agonistes des récepteurs GLP-1 dans l\'obésité et les maladies cardiométaboliques : revue systématique de l\'efficacité, de la sécurité et des indications émergentes (2020-2026)'
    },
    snippet: {
      en: 'A high-impact systematic review and meta-analysis evaluating weight loss percentage, satiety markers, cardiovascular outcomes, and long-term safety profiles.',
      fr: 'Une revue systématique et méta-analyse à fort impact évaluant la perte de poids, la satiété, les résultats cardiovasculaires et la sécurité à long terme.'
    },
    category: 'Critical Care',
    readTime: '8 min read',
    date: '2026-06-11',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Jean-Pierre Dupont, MD',
    doi: '10.1002/obs.2026.11',
    citationCount: 88,
    clinicalImpact: {
      en: 'GLP-1 receptor agonists showed a mean weight reduction of 14.9% over 52 weeks and a 20% reduction in major adverse cardiovascular events (MACE).',
      fr: 'Les agonistes du GLP-1 ont montré une réduction pondérale moyenne de 14,9 % sur 52 semaines et une baisse de 20 % des événements cardiovasculaires majeurs (MACE).'
    }
  },
  {
    id: 'mj-2',
    title: {
      en: 'Large Language Models and Clinical Decision Support: Current Capabilities, Validation Gaps, and Implementation Frameworks — A Narrative Review',
      fr: 'Modèles de langage (LLM) et aide à la décision clinique : capacités actuelles, lacunes de validation et cadres de mise en œuvre — revue narrative'
    },
    snippet: {
      en: 'Evaluating the integration of LLMs with electronic health records, generative clinical transcription tools, diagnostic safety nets, and validation limits.',
      fr: 'Évaluation de l\'intégration des LLM aux dossiers de santé, de la transcription clinique générative et des limites de validation.'
    },
    category: 'Diagnostics',
    readTime: '9 min read',
    date: '2026-06-07',
    author: 'Dr. Marcus Thorne, Ph.D.',
    reviewer: 'Prof. Alice Vance, MD',
    doi: '10.1016/ai.cds.2026.04',
    citationCount: 65,
    clinicalImpact: {
      en: 'Generative clinical drafting tools reduced physician administrative burden by 2.1 hours per shift while clinical decision validation frameworks mitigated diagnostic error rates by 12%.',
      fr: 'Les outils de saisie génératifs ont réduit la charge administrative de 2,1 heures par garde, tandis que les cadres de validation ont baissé les erreurs de 12 %.'
    }
  },
  {
    id: 'mj-3',
    title: {
      en: 'Machine Learning Applications in Medical Imaging',
      fr: 'Applications de l\'apprentissage automatique en imagerie médicale'
    },
    snippet: {
      en: 'Analyzing convolutional neural networks in stroke detection, lesion segmentation, and chest radiograph analysis.',
      fr: 'Analyse des réseaux neuronaux convolutifs pour la détection d\'AVC, segmentation de lésions et radiographies.'
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
      fr: 'Les algorithmes CNN ont atteint 96,2 % de sensibilité pour détecter les hémorragies intracrâniennes sur scanner.'
    }
  },
  {
    id: 'mj-4',
    title: {
      en: 'Digital Health Technologies and Patient Outcomes',
      fr: 'Technologies de santé numérique et résultats pour les patients'
    },
    snippet: {
      en: 'Evaluating mobile health apps, telemetry portals, and their correlations with chronic disease compliance.',
      fr: 'Évaluation des applications mobiles, portails de télémétrie et observance thérapeutique des maladies chroniques.'
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
      fr: 'Les rappels actifs d\'applications ont amélioré l\'observance du traitement de l\'hypertension de 22,4 %.'
    }
  },
  {
    id: 'mj-5',
    title: {
      en: 'Food-as-Medicine Interventions: Current Evidence',
      fr: 'Interventions d\'alimentation-médecine : Preuves actuelles'
    },
    snippet: {
      en: 'Systematic review of medically tailored meals, dietary prescriptions, and metabolic indices control.',
      fr: 'Revue systématique des repas médicalisés, prescriptions diététiques et contrôle des indices métaboliques.'
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
      fr: 'Les repas médicalisés ont permis une baisse moyenne d\'HbA1c de 0,8 % dans le diabète de type 2 mal contrôlé.'
    }
  },
  {
    id: 'mj-6',
    title: {
      en: 'Wearable Devices for Chronic Disease Monitoring',
      fr: 'Appareils connectés pour le suivi des maladies chroniques'
    },
    snippet: {
      en: 'Continuous glucose monitors, wearable heart monitors, and their impact on clinical intervention rates.',
      fr: 'Capteurs de glucose en continu, moniteurs cardiaques portables et taux d\'intervention clinique.'
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
      fr: 'Le déploiement de capteurs de glucose en continu a réduit les hypoglycémies sévères de 40,8 % chez les diabétiques type 1.'
    }
  },
  {
    id: 'mj-7',
    title: {
      en: 'Precision Medicine in Oncology: Current Status',
      fr: 'La médecine de précision en oncologie : État actuel'
    },
    snippet: {
      en: 'Targeted tumor sequencing, matching patient mutations with immunotherapies, and clinical trials outcomes.',
      fr: 'Séquençage tumoral ciblé, ciblage thérapeutique des mutations et résultats des essais cliniques.'
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
      fr: 'Les thérapies ciblées appariées par génomique ont amélioré la survie sans progression de 3,8 mois.'
    }
  },
  {
    id: 'mj-8',
    title: {
      en: 'Advances in Stroke Prevention and Management',
      fr: 'Progrès dans la prévention et la prise en charge de l\'AVC'
    },
    snippet: {
      en: 'Comparing surgical thrombectomy windows, dual antiplatelet strategies, and early carotid interventions.',
      fr: 'Comparaison des fenêtres de thrombectomie chirurgicale, antiagrégants plaquettaires et carotidiennes.'
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
      fr: 'L\'extension de la thrombectomie à 24 heures a amélioré l\'indépendance fonctionnelle des patients.'
    }
  },
  {
    id: 'mj-9',
    title: {
      en: 'Recent Developments in Diabetes Research',
      fr: 'Développements récents dans la recherche sur le diabète'
    },
    snippet: {
      en: 'Exploring stem-cell islet cells transplantation, once-weekly basal insulins, and kidney protective metrics.',
      fr: 'Exploration de la greffe de cellules souches d\'îlots, insulines basales hebdomadaires et protection rénale.'
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
      fr: 'L\'insuline icodec hebdomadaire a montré un contrôle glycémique équivalent à la glargine quotidienne.'
    }
  },
  {
    id: 'mj-10',
    title: {
      en: 'Longitudinal Analysis of Hypertension Risk Factors',
      fr: 'Analyse longitudinale des facteurs de risque de l\'hypertension'
    },
    snippet: {
      en: 'A 10-year cohort study evaluating arterial stiffness, dietary sodium, genetics, and clinical pressures.',
      fr: 'Étude de cohorte sur 10 ans évaluant la rigidité artérielle, le sodium alimentaire et la génétique.'
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
      fr: 'Chaque réduction de 1000mg de sodium quotidien était corrélée à une baisse de 3,4 mmHg de la pression systolique.'
    }
  },
  {
    id: 'mj-11',
    title: {
      en: 'The Role of Gut Microbiota in Chronic Disease',
      fr: 'Le rôle du microbiote intestinal dans les maladies chroniques'
    },
    snippet: {
      en: 'Clinical analysis of intestinal dysbiosis, systemic inflammatory cytokine responses, and bacterial transplants.',
      fr: 'Analyse de la dysbiose intestinale, réponse inflammatoire par cytokines et transplantations fécales.'
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
      fr: 'La transplantation de microbiote fécale a résolu 89,2 % des infections récurrentes à C. difficile.'
    }
  },
  {
    id: 'mj-12',
    title: {
      en: 'Remote Monitoring and Healthcare Resource Utilization',
      fr: 'Surveillance à distance et utilisation des ressources de santé'
    },
    snippet: {
      en: 'How integrated telehealth monitors affect emergency room admission rates and ICU length of stay.',
      fr: 'Impact de la télésurveillance sur les admissions aux urgences et la durée de séjour en réanimation.'
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
      fr: 'La télésurveillance à domicile a réduit les visites aux urgences liées à la BPCO de 35,6 %.'
    }
  },
  {
    id: 'mj-13',
    title: {
      en: 'Clinical Applications of Generative AI in Healthcare',
      fr: 'Applications cliniques de l\'IA générative dans les soins de santé'
    },
    snippet: {
      en: 'Evaluating automated medical transcription, clinical report drafting, and patient summarizations accuracy.',
      fr: 'Évaluation de la transcription médicale, rédaction de comptes-rendus et résumés patients par IA.'
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
      fr: 'La saisie assistée par IA a réduit le temps de documentation administrative de 2,1 heures par garde.'
    }
  },
  {
    id: 'mj-14',
    title: {
      en: 'Ethical Challenges of Artificial Intelligence in Medicine',
      fr: 'Défis éthiques de l\'intelligence artificielle en médecine'
    },
    snippet: {
      en: 'Addressing algorithmic bias, clinical validation gaps, patient consent, and medical liability.',
      fr: 'Biais algorithmiques, validation clinique, consentement patient et responsabilité médicale.'
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
      fr: 'Les algorithmes d\'atténuation des biais ont réduit les inégalités de prédiction du risque clinique.'
    }
  },
  {
    id: 'mj-15',
    title: {
      en: 'Health Informatics and Big Data Analytics',
      fr: 'Informatique de la santé et analyse des mégadonnées'
    },
    snippet: {
      en: 'Leveraging longitudinal patient registries for epidemiological monitoring, cohort selection, and adverse events.',
      fr: 'Exploitation des registres patients pour l\'épidémiologie, la sélection de cohortes et la pharmacovigilance.'
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
      fr: 'L\'analyse de registres multicentriques a détecté des interactions rares 14 mois plus tôt.'
    }
  },
  {
    id: 'mj-16',
    title: {
      en: 'Cancer Biomarker Discovery Using AI',
      fr: 'Découverte de biomarqueurs du cancer grâce à l\'IA'
    },
    snippet: {
      en: 'How deep learning models identify genomic markers, proteomic trends, and therapeutic targets in carcinomas.',
      fr: 'Comment le deep learning identifie les marqueurs génomiques et cibles thérapeutiques des cancers.'
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
      fr: 'Les modèles d\'IA ont identifié 4 nouvelles cibles peptidiques pour le vaccin contre le glioblastome.'
    }
  },
  {
    id: 'mj-17',
    title: {
      en: 'Clinical Impact of Telemedicine After COVID-19',
      fr: 'Impact clinique de la télémédecine après le COVID-19'
    },
    snippet: {
      en: 'A multi-year evaluation of patient satisfaction, chronic illness stability, and cost-benefit ratios.',
      fr: 'Évaluation pluriannuelle de la satisfaction patient, de la stabilité des maladies chroniques et des coûts.'
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
      fr: 'La stabilité des patients suivis en télémédecine était non inférieure à celle des visites en présentiel.'
    }
  },
  {
    id: 'mj-18',
    title: {
      en: 'Pharmacological and Lifestyle Interventions for Healthspan Extension: A Review of Emerging Targets Including Senolytics, NAD+ Precursors, and GLP-1 Pathways',
      fr: 'Interventions pharmacologiques et de style de vie pour l\'extension de la durée de santé : examen des cibles émergentes, y compris les sénolytiques, les précurseurs de NAD+ et les voies GLP-1'
    },
    snippet: {
      en: 'A comprehensive medical review analyzing clinical validation trials of senolytic protocols, NAD+ cofactors, and GLP-1 receptor modulation for metabolic longevity.',
      fr: 'Une revue médicale complète analysant les essais de protocoles sénolytiques, les cofacteurs NAD+ et la modulation des récepteurs GLP-1.'
    },
    category: 'Pharmacology',
    readTime: '9 min read',
    date: '2026-04-02',
    author: 'Prof. Alice Vance, MD, Ph.D.',
    reviewer: 'Dr. Marcus Thorne, Ph.D.',
    doi: '10.1016/j.long.2026.01',
    citationCount: 66,
    clinicalImpact: {
      en: 'NAD+ precursor supplementation improved metabolic insulin sensitivity markers in geriatric cohorts by 15.6% while concurrent GLP-1 therapy preserved cardiovascular reserves.',
      fr: 'La supplémentation en NAD+ a amélioré la sensibilité à l\'insuline de 15,6 % chez les seniors, tandis que la thérapie GLP-1 a préservé les réserves cardiaques.'
    }
  },
  {
    id: 'mj-19',
    title: {
      en: 'Sleep and Cardiometabolic Disease: A Review',
      fr: 'Sommeil et maladies cardiométaboliques : Une revue'
    },
    snippet: {
      en: 'Analyzing how sleep duration and obstructive apnea risk trigger insulin resistance, vascular tone, and lipid levels.',
      fr: 'Comment la durée du sommeil et l\'apnée augmentent la résistance à l\'insuline et la rigidité artérielle.'
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
      fr: 'Le traitement de l\'apnée par CPAP a réduit la pression systolique ambulatoire moyenne de 4,2 mmHg.'
    }
  },
  {
    id: 'mj-20',
    title: {
      en: 'Nutrition and Chronic Disease Prevention',
      fr: 'Nutrition et prévention des maladies chroniques'
    },
    snippet: {
      en: 'Meta-analysis of plant-based dietary scores, cardiovascular risks, renal disease control, and cancers prevention.',
      fr: 'Méta-analyse des régimes végétaux, risques cardiovasculaires, insuffisance rénale et cancers.'
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
      fr: 'L\'adhésion au régime méditerranéen a été corrélée à une baisse de 24 % de la mortalité cardiovasculaire.'
    }
  }
];

// 3. 20 COURSES
export const MASTER_COURSES: MasterCourse[] = [
  { id: 'mc-1', title: { en: 'Introduction to Clinical Calculators', fr: 'Introduction aux calculateurs cliniques' }, category: 'General Medicine', summary: { en: 'Understanding sensitivity, specificity, and formula limits in bedside clinical calculators.', fr: 'Comprendre la sensibilite, la specificite et les limites des formules au chevet du patient.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-06-12', size: '3.5 MB', pages: 2 },
  { id: 'mc-2', title: { en: 'Evidence-Based Medicine Fundamentals', fr: 'Fondements de la médecine fondée sur des preuves' }, category: 'Clinical Research', summary: { en: 'How to read clinical trials, evaluate risk ratios, and identify systemic cohort biases.', fr: 'Comment lire les essais cliniques, evaluer les rapports de risque et identifier les biais.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-06-09', size: '4.2 MB', pages: 3 },
  { id: 'mc-3', title: { en: 'Medical Statistics for Healthcare Professionals', fr: 'Statistiques médicales pour les professionnels' }, category: 'Biostatistics', summary: { en: 'P-values, confidence intervals, Kaplan-Meier curves, and regression models basics.', fr: 'Valeurs p, intervalles de confiance, courbes Kaplan-Meier et modeles de regression.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-06', size: '5.1 MB', pages: 4 },
  { id: 'mc-4', title: { en: 'Biostatistics Using Real Clinical Data', fr: 'Biostatistiques appliquées aux données cliniques' }, category: 'Biostatistics', summary: { en: 'Hands-on practice using statistical software on metabolic and cardiology registries.', fr: 'Pratique de logiciels statistiques sur des registres de cardiologie et de metabolisme.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-03', size: '5.8 MB', pages: 4 },
  { id: 'mc-5', title: { en: 'Clinical Research Methodology', fr: 'Méthodologie de la recherche clinique' }, category: 'Clinical Research', summary: { en: 'Designing clinical trials, cohort structures, and ethical protocol submissions.', fr: 'Conception d\'essais cliniques, structures de cohortes et protocoles d\'ethique.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-05-31', size: '4.6 MB', pages: 3 },
  { id: 'mc-6', title: { en: 'Introduction to Epidemiology', fr: 'Introduction à l\'épidémiologie' }, category: 'Clinical Research', summary: { en: 'Tracking disease patterns, odds ratios, relative risks, and outbreaks monitoring.', fr: 'Suivi des maladies, odds ratios, risques relatifs et surveillance des epidemies.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-28', size: '3.9 MB', pages: 3 },
  { id: 'mc-7', title: { en: 'AI Tools for Clinicians: A Practical Course on LLMs, Imaging AI, and Clinical Decision Support — With Hands-On Case Studies', fr: 'Outils d\'IA pour les cliniciens : cours pratique sur les LLM, l\'IA d\'imagerie et l\'aide à la décision — avec études de cas' }, category: 'Technology', summary: { en: 'A practical, hands-on course covering large language models, radiology algorithms, automated EHR alerts, and clinical safety validations.', fr: 'Un cours pratique couvrant les grands modèles de langage, les algorithmes de radiologie et les alertes automatisées.' }, instructor: 'CareCalculus Engineering', date: '2026-05-25', size: '4.8 MB', pages: 3 },
  { id: 'mc-8', title: { en: 'Python for Clinical Researchers: Analyze Real Patient Data, Build Predictive Models, and Publish Results — Beginner to Intermediate', fr: 'Python pour les chercheurs cliniques : analyse de données réelles, modèles prédictifs et publication — débutant à intermédiaire' }, category: 'Technology', summary: { en: 'A comprehensive guide to analyzing patient registries, visualizing survival curves, and building predictive classifiers using pandas and scikit-learn.', fr: 'Un guide complet pour analyser les registres de patients, visualiser les courbes de survie et concevoir des classificateurs.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-05-22', size: '6.5 MB', pages: 5 },
  { id: 'mc-9', title: { en: 'Scientific Writing for Researchers', fr: 'Rédaction scientifique pour les chercheurs' }, category: 'Clinical Research', summary: { en: 'Drafting abstracts, structured journals, references citations, and review replies.', fr: 'Redaction de resumes, journaux structures, citations et reponses aux examinateurs.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-05-19', size: '3.2 MB', pages: 2 },
  { id: 'mc-10', title: { en: 'Systematic Reviews and Meta-Analysis', fr: 'Revues systématiques et méta-analyses' }, category: 'Clinical Research', summary: { en: 'PRISMA guidelines, database indexing search, and forest plots interpretation.', fr: 'Directives PRISMA, recherche indexee et interpretation des forest plots.' }, instructor: 'Dr. Jean-Pierre Dupont, MD', date: '2026-05-16', size: '4.4 MB', pages: 3 },
  { id: 'mc-11', title: { en: 'Clinical Decision Support Systems', fr: 'Systèmes d\'aide à la décision clinique' }, category: 'Technology', summary: { en: 'How automated medical alert systems are integrated with electronic health records.', fr: 'Comment les systemes d\'alerte automatises s\'integrent aux dossiers medicaux.' }, instructor: 'CareCalculus Engineering', date: '2026-05-13', size: '4.0 MB', pages: 3 },
  { id: 'mc-12', title: { en: 'Digital Health and Telemedicine', fr: 'Santé numérique et télémédecine' }, category: 'Technology', summary: { en: 'Clinical structures for virtual care delivery, camera setups, and privacy protocols.', fr: 'Structures pour les soins virtuels, reglages camera et protocoles de confidentialite.' }, instructor: 'Dr. Rachel Goldstein, MD', date: '2026-05-10', size: '3.8 MB', pages: 3 },
  { id: 'mc-13', title: { en: 'Research Ethics in Healthcare', fr: 'Éthique de la recherche en santé' }, category: 'Clinical Research', summary: { en: 'Informed consent, institutional review boards (IRBs), and data protection regulations.', fr: 'Consentement eclaire, comites d\'ethique (IRB) et protection des donnees.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-07', size: '3.4 MB', pages: 2 },
  { id: 'mc-14', title: { en: 'Cancer Epidemiology', fr: 'Épidémiologie du cancer' }, category: 'Oncology', summary: { en: 'Global incidence rates, screening programs, risk factors, and registry analytics.', fr: 'Taux d\'incidence mondiaux, programmes de depistage, facteurs de risque et registres.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-04', size: '4.3 MB', pages: 3 },
  { id: 'mc-15', title: { en: 'Stroke Risk Assessment and Prevention', fr: 'Évaluation du risque d\'AVC et prévention' }, category: 'Cardiology', summary: { en: 'Implementing CHA2DS2-VASc, carotid screening, and antihypertensive targets.', fr: 'Application du CHA2DS2-VASc, depistage carotidien et cibles de tension.' }, instructor: 'Dr. Al-Faruqi, MD', date: '2026-05-01', size: '3.7 MB', pages: 3 },
  { id: 'mc-16', title: { en: 'Diabetes & Metabolic Disease in 2026: Managing GLP-1 Therapies, CGM Data, and Personalized Treatment Plans', fr: 'Diabète & maladies métaboliques en 2026 : gestion des thérapies GLP-1, données CGM et plans personnalisés' }, category: 'Endocrinology', summary: { en: 'Managing insulin math, analyzing continuous glucose monitoring (CGM) reports, and titrating next-generation GLP-1 receptor agonists.', fr: 'Gérer les calculs d\'insuline, analyser les rapports CGM (glucose en continu) et ajuster les agonistes GLP-1 de nouvelle génération.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-04-28', size: '4.5 MB', pages: 3 },
  { id: 'mc-17', title: { en: 'Healthcare Quality Improvement', fr: 'Amélioration de la qualité des soins' }, category: 'Clinical Research', summary: { en: 'Plan-Do-Study-Act (PDSA) cycles, root cause analysis, and safety audit protocols.', fr: 'Cycles PDSA, analyse des causes profondes et protocoles d\'audit de securite.' }, instructor: 'Dr. Rachel Goldstein, MD', date: '2026-04-25', size: '3.9 MB', pages: 3 },
  { id: 'mc-18', title: { en: 'Healthcare Data Visualization', fr: 'Visualisation des données de santé' }, category: 'Technology', summary: { en: 'Creating clinical dashboards, survival curves, and patient trend diagrams.', fr: 'Creation de tableaux de bord cliniques, courbes de survie et graphiques.' }, instructor: 'CareCalculus Engineering', date: '2026-04-22', size: '5.4 MB', pages: 4 },
  { id: 'mc-19', title: { en: 'Machine Learning in Medicine', fr: 'Apprentissage automatique en médecine' }, category: 'Technology', summary: { en: 'Supervised vs unsupervised classifiers, diagnostic ROC curves, and algorithms.', fr: 'Classificateurs supervises, courbes ROC diagnostiques et algorithmes.' }, instructor: 'Dr. Marcus Thorne, Ph.D.', date: '2026-04-19', size: '6.0 MB', pages: 4 },
  { id: 'mc-20', title: { en: 'Precision Medicine Foundations', fr: 'Bases de la médecine de précision' }, category: 'General Medicine', summary: { en: 'Translating genetic sequencing data into target-specific therapeutic indices.', fr: 'Traduction des donnees de sequençage en indices therapeutiques cibles.' }, instructor: 'Prof. Alice Vance, MD', date: '2026-04-16', size: '4.1 MB', pages: 3 },
  { id: 'mc-21', title: { en: 'Medical Writing for the Digital Age: Create Authority Content That Ranks, Gets Cited, and Builds Your Clinical Brand', fr: 'Rédaction médicale à l\'ère numérique : créer un contenu d\'autorité qui se classe, est cité et développe votre marque clinique' }, category: 'Clinical Research', summary: { en: 'A masterclass for healthcare professionals on writing high-ranking blogs, narrative journal reviews, and optimizing medical content for AI answer engines.', fr: 'Une masterclass pour les professionnels de la santé sur la rédaction de blogs et de revues de journaux narratives.' }, instructor: 'CareCalculus Editorial Team', date: '2026-06-12', size: '4.2 MB', pages: 3 }
];

// 4. 20 PRESENTATIONS
export const MASTER_PRESENTATIONS: MasterPresentation[] = [
  { id: 'mp-1', title: { en: 'Top Healthcare Trends in 2026', fr: 'Principales tendances de la santé en 2026' }, category: 'General Medicine', description: { en: 'Analysis of automated triage systems, telemedicine expansion, and GLP-1 therapy.', fr: 'Analyse du triage automatise, de la telemedecine et des therapies GLP-1.' }, author: 'Prof. Alice Vance, MD', date: '2026-06-12', size: '10.5 MB', slideCount: 5 },
  { id: 'mp-2', title: { en: 'GLP-1 Medications: Beyond Weight Loss', fr: 'Médicaments GLP-1 : Au-delà de la perte de poids' }, category: 'Pharmacology', description: { en: 'Cardioprotective pathways, renal protection mechanisms, and neuroprotection studies.', fr: 'Voies cardioprotectrices, protection renale et neuroprotection.' }, author: 'Prof. Alice Vance, MD', date: '2026-06-08', size: '12.1 MB', slideCount: 5 },
  { id: 'mp-3', title: { en: 'Artificial Intelligence in Modern Healthcare', fr: 'L\'intelligence artificielle dans la médecine' }, category: 'Technology', description: { en: 'Deep learning classifiers in radiological pipelines and predictive safety systems.', fr: 'Algorithmes d\'imagerie en radiologie et systemes de prevention.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-06-04', size: '14.8 MB', slideCount: 6 },
  { id: 'mp-4', title: { en: 'Future of Digital Health Platforms', fr: 'L\'avenir des plateformes de santé numérique' }, category: 'Technology', description: { en: 'Decentralized hospital infrastructures, integrated telemetry, and cloud models.', fr: 'Infrastructures hospitalieres decentralisees, telemetrie et cloud.' }, author: 'CareCalculus Engineering', date: '2026-05-31', size: '11.2 MB', slideCount: 5 },
  { id: 'mp-5', title: { en: 'Wearable Technology and Remote Monitoring', fr: 'Wearables et surveillance des patients' }, category: 'Technology', description: { en: 'Clinical validation of smartwatch ECGs and target alert parameters.', fr: 'Validation des ECG de montres connectees et alertes cliniques.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-05-27', size: '13.4 MB', slideCount: 5 },
  { id: 'mp-6', title: { en: 'Food as Medicine: Evidence and Applications', fr: 'L\'alimentation comme médecine : Preuves' }, category: 'General Medicine', description: { en: 'Analyzing metabolic outcome metrics from specialized diet programs.', fr: 'Analyse des resultats metaboliques de programmes nutritionnels.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-23', size: '9.8 MB', slideCount: 4 },
  { id: 'mp-7', title: { en: 'Advances in Diabetes Care', fr: 'Progrès dans le traitement du diabète' }, category: 'Endocrinology', description: { en: 'Islet transplantation updates, smart pumps, and renal protection metrics.', fr: 'Greffe d\'ilots pancreatiques, pompes intelligentes et reins.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-19', size: '11.5 MB', slideCount: 5 },
  { id: 'mp-8', title: { en: 'Stroke Prevention and Early Detection', fr: 'Prévention de l\'AVC et détection précoce' }, category: 'Cardiology', description: { en: 'Implementing FAST, carotid telemetry, and secondary anticoagulation.', fr: 'Application de FAST, telemetrie carotidienne et anticoagulation.' }, author: 'Dr. Al-Faruqi, MD', date: '2026-05-15', size: '12.6 MB', slideCount: 5 },
  { id: 'mp-9', title: { en: 'Cancer Prevention Strategies', fr: 'Stratégies de prévention du cancer' }, category: 'Oncology', description: { en: 'Modifiable risks analytics, vaccination pathways, and early screenings.', fr: 'Analyse des risques modifiables, vaccination et depistages.' }, author: 'Dr. Al-Faruqi, MD', date: '2026-05-11', size: '10.2 MB', slideCount: 5 },
  { id: 'mp-10', title: { en: 'Clinical Decision Support Systems', fr: 'Systèmes de support à la décision clinique' }, category: 'Technology', description: { en: 'Real-time alert optimization algorithms inside ICU environments.', fr: 'Optimisation des alertes en temps reel dans les services de reanimation.' }, author: 'CareCalculus Engineering', date: '2026-05-07', size: '11.9 MB', slideCount: 5 },
  { id: 'mp-11', title: { en: 'Precision Medicine and Genomics', fr: 'Médecine de précision et génomique' }, category: 'General Medicine', description: { en: 'Sequencing pathways and pharmacogenomics implementation barriers.', fr: 'Obstacles a la mise en oeuvre de la pharmacogenomique.' }, author: 'Prof. Alice Vance, MD', date: '2026-05-03', size: '13.0 MB', slideCount: 5 },
  { id: 'mp-12', title: { en: 'Medical Data Analytics for Clinicians', fr: 'Analyse des données pour les cliniciens' }, category: 'Technology', description: { en: 'Statistical tools, cohort parameters, and diagnostic markers.', fr: 'Outils statistiques, parametres de cohorte et biomarqueurs.' }, author: 'Dr. Marcus Thorne, Ph.D.', date: '2026-04-29', size: '14.2 MB', slideCount: 6 },
  { id: 'mp-13', title: { en: 'Telemedicine: Lessons and Future Directions', fr: 'Télémédecine : Leçons et perspectives' }, category: 'Technology', description: { en: 'Reviewing outcome metrics and patient portal security standards.', fr: 'Revue des indicateurs cliniques et securite des portails.' }, author: 'Dr. Rachel Goldstein, MD', date: '2026-04-25', size: '10.8 MB', slideCount: 5 },
  { id: 'mp-14', title: { en: 'Healthcare Innovation Roadmap 2026', fr: 'Feuille de route de l\'innovation santé 2026' }, category: 'General Medicine', description: { en: 'Strategic analysis of emerging diagnostic technologies integration.', fr: 'Analyse strategique de l\'integration des nouvelles technologies.' }, author: 'CareCalculus Editorial Team', date: '2026-04-21', size: '11.0 MB', slideCount: 5 },
  { id: 'mp-15', title: { en: 'AI Ethics in Clinical Practice', fr: 'Éthique de l\'IA en pratique clinique' }, category: 'Technology', description: { en: 'Algorithmic bias control, liability, and consent procedures.', fr: 'Controle des biais, responsabilite et consentement patient.' }, author: 'Dr. Jean-Pierre Dupont, MD', date: '2026-04-17', size: '12.4 MB', slideCount: 5 },
  { id: 'mp-16', title: { en: 'Big Data in Healthcare', fr: 'Mégadonnées en santé' }, category: 'Technology', description: { en: 'Managing multi-center registries and patient records datasets.', fr: 'Gestion de registres multicentriques et bases de donnees.' }, author: 'CareCalculus Engineering', date: '2026-04-13', size: '15.0 MB', slideCount: 6 },
  { id: 'mp-17', title: { en: 'Research Methodology for Graduate Students', fr: 'Méthodologie de recherche pour étudiants' }, category: 'General Medicine', description: { en: 'Designing clinical experiments, controls, and data collection.', fr: 'Conception d\'essais cliniques, contrôles et collecte.' }, author: 'Dr. Jean-Pierre Dupont, MD', date: '2026-04-09', size: '10.0 MB', slideCount: 5 },
  { id: 'mp-18', title: { en: 'Scientific Publishing Best Practices', fr: 'Bonnes pratiques de publication scientifique' }, category: 'General Medicine', description: { en: 'Writing papers, responding to peers, and manuscript structure.', fr: 'Redaction d\'articles, reponses aux pairs et manuscrits.' }, author: 'Prof. Alice Vance, MD', date: '2026-04-05', size: '9.6 MB', slideCount: 4 },
  { id: 'mp-19', title: { en: 'Healthcare Quality and Patient Safety', fr: 'Qualité des soins et sécurité des patients' }, category: 'General Medicine', description: { en: 'Implementing clinical checklists and error reporting registries.', fr: 'Mise en oeuvre de check-lists et declaration d\'erreurs.' }, author: 'Dr. Rachel Goldstein, MD', date: '2026-04-01', size: '11.8 MB', slideCount: 5 },
  { id: 'mp-20', title: { en: 'Emerging Technologies in Medicine', fr: 'Technologies émergentes en médecine' }, category: 'Technology', description: { en: 'Robotic surgeries, VR clinical training, and bio-sensors.', fr: 'Chirurgies robotiques, formation en RV et capteurs.' }, author: 'CareCalculus Engineering', date: '2026-03-28', size: '13.8 MB', slideCount: 5 }
];



// --- Deterministic Medical Content Generator ---
export function generateMasterContent(id: string, title: string, snippet: string, lang: LangCode): string {
  if (id === 'mb-36') {
    if (lang === 'fr') {
      return `### La crise musculaire du GLP-1 : quoi manger quand on oublie de manger

**Vous avez enfin fait taire les pensées obsessives liées à la nourriture, mais il y a un coût caché dont personne ne vous a parlé dans le cabinet du médecin : vous ne perdez pas seulement de la graisse. Vous brûlez tranquillement votre masse musculaire.**

Des millions de personnes bénéficient des avantages indéniables des médicaments GLP-1. Mais cette suppression miraculeuse de l'appétit s'accompagne d'un coût invisible. Lorsque l'envie de manger disparaît, l'instinct de nourrir correctement son corps disparaît également. Le résultat ? Une vague de patients qui perdent du poids, mais se retrouvent confrontés à une fatigue profonde, une perte de cheveux et une détérioration physique.

Si vous perdez des tailles mais vous sentez plus faible chaque semaine, votre traitement fonctionne, mais votre stratégie nutritionnelle échoue. Voici comment réécrire votre alimentation.

### Le dilemme des "deux bouchées" : Pourquoi les régimes classiques échouent
Les conseils traditionnels reposent sur le volume : remplir son assiette de salades pour tromper l'estomac. Avec le GLP-1, c'est la pire chose à faire. Votre vidange gastrique est déjà ralentie. Si vous remplissez le peu de place disponible avec de la laitue, vous serez rassasié avant d'avoir consommé les blocs de construction structurels. Vous n'avez pas besoin de volume, vous avez besoin de *densité*.

### 1. La règle absolue des 30 grammes de protéines
En déficit calorique sévère, le corps cherche de l'énergie. Sans apport suffisant en protéines, il cannibalise vos muscles. Perdre de la masse maigre détruit votre métabolisme, préparant le terrain pour un rebond de poids catastrophique si vous arrêtez le traitement.
* **La solution :** Un minimum de 30 g de protéines de haute qualité par repas.
* **La réalité :** Manger un gros blanc de poulet avec des nausées est difficile.
* **La stratégie :** Privilégiez les protéines liquides et semi-solides. Le lait filtré, le lactosérum (whey isolate), le yaourt grec et le bouillon d'os sont vos alliés. Buvez vos protéines en premier.

### 2. Privilégiez les micro-repas
Oubliez les "trois repas par jour". Essayer de forcer un repas de 600 calories provoquera des reflux et des troubles gastriques.
Adoptez plutôt une approche fractionnée : 4 à 5 micro-repas par jour. Un micro-repas est un concentré de nutriments, pas une simple collation. Par exemple, 80 g de saumon fumé sur un craquelin riche en fibres, ou deux œufs durs avec quelques noix de macadamia.

### 3. Le piège de l'hydratation et des électrolytes
En mangeant moins, vous réduisez aussi l'eau et les minéraux apportés par la nourriture. C'est la cause principale de la fatigue et des vertiges sous GLP-1.
Boire de l'eau pure ne suffit pas et peut même éliminer le peu d'électrolytes restants.
* **La stratégie :** Ajoutez une poudre d'électrolytes sans sucre à votre eau une fois par jour (sodium, potassium, magnésium). Le magnésium aidera également à lutter contre la constipation.

### 4. Le timing stratégique des fibres
Les fibres sont essentielles mais très rassasiantes. Manger une pomme riche en fibres avant le dîner vous empêchera de manger vos protéines.
* **La stratégie :** Séparez les fibres des protéines. Consommez les aliments fibreux (petits fruits, graines de chia, légumes rôtis) à la fin de la journée ou seuls, pour ne pas encombrer vos apports protéiques.

### En conclusion
Le sémaglutide et le tirzépatide modifient les règles de la faim, mais pas la physiologie humaine. Votre corps a besoin de nutriments pour survivre. Utilisez ce moment de calme pour bâtir une base solide, nourrie et musclée pour le reste de votre vie.`;
    } else if (false) {
      return `### أزمة العضلات المصاحبة لعلاج GLP-1: ماذا تأكل عندما تنسى تناول الطعام

**لقد تمكنت أخيراً من إسكات التفكير المستمر في الطعام، ولكن هناك ضريبة خفية لم يحذرك منها أحد في عيادة الطبيب: أنت لا تفقد الدهون فحسب، بل تحرق كتلتك العضلية بصمت.**

يختبر الملايين من الناس الفوائد الكبيرة لأدوية GLP-1. لكن هذا الكبح المعجز للشهية يأتي بتكلفة باهظة غير معلنة. فعندما يتلاشى الدافع المستمر لتناول الطعام، تتلاشى معه غريزة تغذية جسمك بشكل صحيح. النتيجة؟ موجة من المرضى يفقدون وزناً غير مسبوق، فقط ليجدوا أنفسهم يصارعون التعب الشديد، وتساقط الشعر، وضعف البنية الجسدية.

إذا كنت تفقد مقاسات ملابسك ولكنك تشعر بالضعف أسبوعاً بعد أسبوع، فإن دواءك يعمل، ولكن استراتيجيتك الغذائية تفشل. إليك كيفية إعادة صياغة نظامك الغذائي عندما تنسى تناول الطعام فعلياً.

### معضلة "اللقمتين": لماذا تفشل الحميات القياسية هنا؟
تعتمد نصائح إنقاص الوزن التقليدية على تناول كميات كبيرة: ملء طبقك بالسلطات الضخمة والخخضروات منخفضة السعرات الحرارية لخداع معدتك بالشبع. مع أدوية GLP-1، هذا هو أسوأ شيء يمكنك القيام به.
إن إفراغ معدتك بطيء بالفعل بسبب الدواء. فإذا ملأت المساحة المحدودة في معدتك بالخس والجرجير، فستشعر بالشبع الشديد قبل تناول أي بروتينات بناء أساسية. لا تحتاج إلى حجم؛ بل تحتاج إلى *كثافة*.

### ١. قاعدة الـ ٣0 جراماً من البروتين (غير القابلة للتفاوض)
عندما تكون في عجز حاد في السعرات الحرارية، يبحث جسمك عن الطاقة. وإذا لم تغذه بالبروتين، فسوف يتغذى على أنسجة عضلاتك. لا يتعلق هذا بالمظهر المشدود فحسب؛ بل إن فقدان الكتلة العضلية يدمر معدل الأيض لديك، مما يهيئك لزيادة كارثية في الوزن إذا توقفت عن تناول الدواء.
* **الحل:** تحتاج إلى ما لا يقل عن 30 جراماً من البروتين عالي الجودة في كل وجبة.
* **الواقع:** تناول صدر دجاج كبير عندما تشعر بالغثيان الخفيف هو أمر شاق.
* **الاستراتيجية:** اتجه نحو البروتينات السائلة وشبه الصلبة. الحليب المصفى، مشروبات مصل اللبن (Whey Isolate) الصافية، الزبادي اليوناني، ومرق العظام هي شريان الحياة لك. اشرب البروتين أولاً قبل تناول أي شيء آخر.

### ٢. الوجبات الصغيرة المتعددة بدلاً من الوجبات الكبيرة
يجب التخلي عن فكرة "ثلاث وجبات كاملة في اليوم". فمحاولة إدخال وجبة قياسية تحتوي على 600 سعرة حرارية ستؤدي على الأرجح إلى اضطرابات معوية أو ارتداد حمضي شديد.
بدلاً من ذلك، تناول 4 إلى 5 وجبات صغيرة جداً طوال اليوم. الوجبة الصغيرة ليست مجرد تسلية؛ بل هي كبسولة غذائية مكثفة. مثل 80 جراماً من السلمون المدخن على شريحة بسكويت واحدة غنية بالألياف، أو بيضتين مسلوقتين مع حفنة من مكسرات المكاديميا.

### ٣. فخ الترطيب والإلكتروليتات
نظراً لأنك تأكل أقل بكثير، فإنك تقلل أيضاً بشكل كبير من تناول المياه المرتبطة بالطعام والمعادن النادرة. هذا هو المحرك الأساسي للشعور بالتعب والدوخة المصاحبين لعلاجات GLP-1.
شرب الماء النقي ليس كافياً لحل المشكلة، بل قد يؤدي شرب الماء الزائد إلى غسل الإلكتروليتات القليلة المتبقية في جسمك.
* **الاستراتيجية:** أضف مسحوق إلكتروليتات عالي الجودة وخالٍ من السكر إلى الماء مرة واحدة يومياً (يحتوي الصوديوم والبوتاسيوم والمغنيسيوم). المغنيسيوم تحديداً سيسهم في تخفيف الإمساك الشائع المصاحب لبطء حركة الأمعاء.

### ٤. التوقيت الاستراتيجي للألياف
الألياف ضرورية لصحة الأمعاء، ولكنها أيضاً عامل شبع قوي. إذا تناولت تفاحة غنية بالألياف قبل ساعة من العشاء، فلن تتمكن ببساطة من تناول وجبتك الأساسية.
* **الاستراتيجية:** افصل الألياف عن وجبات البروتين. تناول الأطعمة الغنية بالألياف (مثل التوت أو بذور الشيا أو حصة صغيرة من الخضار المشوية) في نهاية اليوم أو كوجبة صغيرة منفصلة.

### الخلاصة
تغير أدوية مثل السيماغلوتيد والتيرزيباتيد قواعد الجوع، لكنها لا تغير القواعد الأساسية لفيزيولوجيا الإنسان. لا يزال جسمك بحاجة إلى العناصر الأساسية للبقاء على قيد الحياة.
لقد مُنحت فرصة فريدة: الإرادة الكيميائية لاختيار ما يدخل جسمك بدقة دون صراع مع الرغبة الشديدة في تناول الطعام. لا تضيعها في التجويع، بل استخدم هذا الهدوء لبناء أساس عضلي قوي ومغذٍ لبقية حياتك.`;
    } else {
      return `### The GLP-1 Muscle Crisis: What to Eat When You Forget to Eat

**You’ve finally quieted the food noise, but there’s a hidden tax nobody warned you about in the doctor's office: you aren’t just losing fat. You’re quietly burning through your muscle mass.**

Millions of people are experiencing the undeniable, life-changing benefits of GLP-1 medications. But the miraculous suppression of appetite comes with a steep, often unspoken cost. When the relentless drive to eat finally fades, so does the instinct to properly nourish your body. The result? A wave of patients shedding unprecedented weight, only to find themselves battling profound fatigue, hair loss, and a deteriorating physical frame. 

If you are dropping sizes but feeling weaker by the week, your medication is working—but your nutrition strategy is failing. Here is exactly how to rewrite your diet when you literally forget to eat.

### The "Two-Bite" Dilemma: Why Standard Dieting Fails Here
Traditional weight loss advice hinges on volume eating: filling your plate with massive salads and low-calorie vegetables to trick your stomach into feeling full. On a GLP-1, this is the worst thing you can do. 

Your gastric emptying is already delayed. If you fill the limited real estate in your stomach with plain lettuce, you will trigger severe satiety before you’ve consumed any structural building blocks. You don’t need volume anymore; you need *density*.

### 1. The Protein Non-Negotiable (The 30-Gram Rule)
When you are in a steep caloric deficit, your body panics and looks for energy. If you aren't feeding it protein, it will cannibalize your own muscle tissue. This isn't just about looking toned; losing lean mass destroys your metabolic rate, setting you up for catastrophic rebound weight gain if you ever stop the medication.

* **The Fix:** You need a minimum of 30 grams of high-quality protein per meal. 
* **The Reality:** Eating a large chicken breast when you are slightly nauseous is daunting. 
* **The Strategy:** Pivot to liquid and soft-solid proteins. Ultra-filtered milk, whey isolate clear drinks (which taste like juice, not heavy milkshakes), Greek yogurt, and bone broth are your lifelines. Drink your protein first, before you take a single bite of anything else.

### 2. Micro-Meals Over Macro-Plates
The concept of "three square meals a day" needs to be abandoned. Trying to force down a standard 600-calorie meal will likely result in gastrointestinal distress or severe acid reflux. 

Instead, adopt the "grazing apex predator" approach. You need 4 to 5 micro-meals throughout the day. A micro-meal isn't a snack like a handful of chips; it is a condensed capsule of nutrition. Think 3 ounces of smoked salmon on a single high-fiber cracker, or two hard-boiled eggs with a handful of macadamia nuts. 

### 3. The Hydration and Electrolyte Trap
Because you are eating significantly less food, you are also drastically reducing your intake of food-bound water and trace minerals. This is the primary driver of the dreaded "GLP-1 fatigue" and dizziness. 

Drinking plain water isn't enough to fix this. In fact, excessive plain water can flush out the few electrolytes you have left. 
* **The Strategy:** Add a high-quality, zero-sugar electrolyte powder to your water once a day. Look for a balance of sodium, potassium, and magnesium. Magnesium, in particular, will pull double duty by helping alleviate the constipation commonly associated with delayed gastric emptying.

### 4. Strategic Fiber Timing
Fiber is essential for gut health, but it is also a powerful satiety agent. If you eat a high-fiber apple an hour before dinner, you simply won't be able to eat your dinner. 
* **The Strategy:** Separate your fiber from your protein heavy-lifting. Consume your fibrous foods—like berries, chia seeds, or a small portion of roasted vegetables—at the *end* of the day or as a standalone micro-meal, ensuring it doesn't interfere with your daily protein targets.

### The Bottom Line
Medications like semaglutide and tirzepatide change the rules of hunger, but they do not change the fundamental rules of human physiology. Your body still requires building blocks to survive. 

You have been given a unique opportunity: the chemical willpower to choose exactly what goes into your body without battling cravings. Don't waste it on starvation. Use this quiet time to build a resilient, nourished, and muscular foundation for the rest of your life.`;
    }
  }

  const t = {
    clinicalOverview: { en: 'Clinical Overview & Background', fr: 'Aperçu clinique & contexte' },
    pathology: { en: 'Pathophysiological Insights', fr: 'Mécanismes physiopathologiques' },
    directives: { en: 'Clinical Directives & Recommendations', fr: 'Directives & recommandations cliniques' },
    conclusion: { en: 'Conclusions & Consensus Outcomes', fr: 'Conclusions & résultats de consensus' },
    citations: { en: 'Secondary Citations & References', fr: 'Citations & références secondaires' }
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
    } else if (false) {
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
      introParagraph = `Glucagon-like peptide-1 (GLP-1) receptor agonists are first-line pharmacological agents in the management of type 2 diabetes and clinical obesity. By stimulating glucose-dependent insulin secretion, suppressing inappropriate glucagon release, delaying gastric emptying, and activating central satiety pathways, these therapies achieve substantial glycemic stabilization and weight reduction.`;
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
    } else if (false) {
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
      introParagraph = `Les accidents vasculaires cérébraux et l'hypertension artérielle représentent des défis majeurs en cardiologie et neurologie. L'optimisation précoce des cibles de pression artérielle et l'identification des profils à risque sont indispensables pour prévenir les séquelles ischémiques ou hémorragiques irréversibles.`;
      pathParagraph = `L'hypertension chronique entraîne un remodelage vasculaire et décale la courbe d'autorégulation cérébrale. Une baisse trop abrupte de la pression peut induire une hypoperfusion, tandis qu'une pression non contrôlée augmente le risque d'hémorragie et de fibrillation auriculaire.`;
      points = [
        'Utiliser le score CHA2DS2-VASc pour évaluer le risque thromboembolique dans la FA.',
        'Maintenir une pression artérielle stable en évitant les fluctuations rapides aux urgences.',
        'Dépister les signes d\'accident vasculaire cérébral en utilisant les critères standardisés (FAST).',
        'Personnaliser les objectifs de pression artérielle moyenne en tenant compte de l\'âge et du profil vasculaire.'
      ];
      closing = `Une approche méthodique combinant évaluation des scores de risque et gestion personnalisée de la perfusion permet d'améliorer significativement le pronostic des maladies cardiovasculaires.`;
    } else if (false) {
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
    } else if (false) {
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
        'Determine p16/HPV status as a primary prognostic biomarker in head and neck squamous carcinomas.',
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
    } else if (false) {
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
      closing = `Adhering to standardized, evidence-based clinical protocols enhances patient safety margins and optimizes clinical outcomes across acute and ambulatory care settings.`;
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
  const isAr = false;

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
  const isAr = false;

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
