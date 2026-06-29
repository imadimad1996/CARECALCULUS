import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Upload, FileText, Download, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, GraduationCap, RefreshCw, Sparkles, Trash2, Calendar, ClipboardCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LangCode, Translations } from '../types';
import { slugify, findBySlug } from '../utils/slug';
import { useLang } from '../utils/lang';
import { MASTER_COURSES, getLocalizedCourse } from '../utils/masterListContent';


interface MedicalCourse {
  id: string;
  title: string;
  instructor: string;
  date: string;
  size: string;
  pages: number;
  category: string;
  summary: string;
  sections: Array<{
    heading: string;
    text: string;
  }>;
  quiz?: Array<{
    question: string;
    options: string[];
    answerIndex: number;
  }>;
  isUserUploaded?: boolean;
}

export const DEFAULT_COURSES: MedicalCourse[] = [
  {
    id: 'pdf-1',
    title: 'Clinical Nephrology: Cockcroft-Gault & Drug Clearance Kinetics',
    instructor: 'Dean Arthur Pendelton, PharmD (CareCalculus Renal Division)',
    date: '2026-06-02',
    size: '4.8 MB',
    pages: 3,
    category: 'Nephrology / Pharmacology',
    summary: 'A deep-dive tutorial on creatinine clearance, estimating glomerular filtration rate (eGFR), and adjusting therapeutic index dosages.',
    sections: [
      {
        heading: 'Section 1: Glomerular Filtration & Endogenous Clearance',
        text: 'The primary physiological benchmark of renal function is the Glomerular Filtration Rate (GFR). Direct measurement of GFR using exogenous substances such as Inulin is clinically impractical. Consequently, endogenous filtration markers—predominantly Serum Creatinine—are utilized as surrogate anchors. Clinicians must understand that serum levels depend heavily on age, biological sex, and active muscle mass density.'
      },
      {
        heading: 'Section 2: The Mathematical Cockcroft-Gault Equation',
        text: 'Formulated in 1976, Cockcroft-Gault remains the regulatory anchor for pharmaceutical dosing adjustments. Standard formula: ClCr (mL/min) = [((140 - Age) * Weight) / (72 * Scr)]. For females, the entire result is multiplied by 0.85 to compensate for lower typical muscle density. Key Trap: Utilizing actual total body weight in cachectic or obese patients often introduces severe overestimation errors.'
      },
      {
        heading: 'Section 3: Therapeutic Index and Dosing Adjustments',
        text: 'Certain high-potency antibiotics (such as Vancomycin or Aminoglycosides) exhibit very tight therapeutic margins. Sub-therapeutic concentrations trigger bacterial mutations and treatment failure, while excessive levels result in acute tubular necrosis or vestibular toxicity. Continuous renal clearance metrics must guide daily dosing configurations.'
      }
    ],
    quiz: [
      {
        question: 'Why must Cockcroft-Gault score calculations utilize a corrective factor of 0.85 for female patients?',
        options: [
          'To account for lower cardiac output rates.',
          'To compensate for typically lower muscle mass density relative to body mass.',
          'To account for elevated hepatic clearance levels.',
          'To balance arterial pressure variance.'
        ],
        answerIndex: 1
      },
      {
        question: 'Which kidney weight parameter should be preferred for patients exceeding 120% of their Ideal Body Weight?',
        options: [
          'Total Actual Weight',
          'Standard BMI Weight',
          'Adjusted Body Weight (AdjBW)',
          'Dry Weight'
        ],
        answerIndex: 2
      }
    ]
  },
  {
    id: 'pdf-2',
    title: 'Sepsis Pathways: Early Calibration of qSOFA & SIRS Targets',
    instructor: 'Dr. Jean-Pierre Dupont, MD (Infectious Diseases Triage)',
    date: '2026-05-19',
    size: '6.2 MB',
    pages: 3,
    category: 'Critical Care / Infectious Disease',
    summary: 'Essential guidelines for comparing micro-inflammatory SIRS criteria against critical care Sepsis-3 qSOFA organ failure targets.',
    sections: [
      {
        heading: 'Section 1: The Evolutionary Pathology of Sepsis',
        text: 'Sepsis is defined as a life-threatening organ dysfunction caused by a dysregulated host response to infection. Historically, Sepsis-1 associated diagnosis solely with the presence of Systemic Inflammatory Response Syndrome (SIRS). This included markers like high/low temperatures, elevated heart rate, respiratory rates, and white blood cell levels. However, SIRS lacks essential specificity.'
      },
      {
        heading: 'Section 2: Sepsis-3 Guidelines and the qSOFA Score',
        text: 'The quick Sequential Organ Failure Assessment (qSOFA) was introduced to facilitate rapid identification of patients at high risk of death outside the ICU. The metric evaluates three critical clinical variables: respiratory rate (≥22 breaths/min), altered mental status (GCS < 15), and systolic blood pressure (≤100 mmHg). A score ≥ 2 points suggests bad prognostic trajectory.'
      },
      {
        heading: 'Section 3: Emergency Department Triage Protocols',
        text: 'Ideal clinical approaches integrate BOTH screening rubrics. SIRS remains superior for sensitive screening, ensuring that potential bacteremias are caught early for prompt antibiotic coverage. The qSOFA score is then layered as a powerful triage instrument to indicate severe organ dysfunction, indicating the need for immediate critical care escalation.'
      }
    ],
    quiz: [
      {
        question: 'What is the threshold for respiratory rate considered positive in the qSOFA score?',
        options: [
          '≥ 16 breaths per minute',
          '≥ 18 breaths per minute',
          '≥ 22 breaths per minute',
          '≥ 26 breaths per minute'
        ],
        answerIndex: 2
      },
      {
        question: 'Which diagnostic tool possesses higher sensitivity for spotting early bacteremia?',
        options: [
          'qSOFA Score',
          'SIRS Criteria',
          'MELD scoring',
          'Creatinine indices alone'
        ],
        answerIndex: 1
      }
    ]
  }
];

const translations: Translations = {
  en: {
    title: "Clinical Course Lectures (PDF)",
    subtitle: "Upload and study official medical PDF handbooks, conference notes, and CME guidelines",
    dragDrop: "Drag and drop your clinical PDF course here",
    orBrowse: "or browse files from your computer",
    pagesCount: "pages",
    myCourses: "Custom Syllabus Items",
    preseeded: "Clinical Lectures Library",
    studyBtn: "Launch Active Study Mode HUD",
    closeBtn: "Close Textbook",
    downloadBtn: "Download PDF Reference",
    uploadSuccess: "Clinical PDF analyzed and logged to local storage successfully!",
    onlyPdf: "Supported file format is Medical Document (.pdf) only.",
    references: "References: World Health Organization (WHO); European Society of Intensive Care Medicine (ESICM).",
    noUploads: "No custom courses uploaded yet. Drag and drop any .pdf course outline to curate it instantly.",
    quizHeader: "Curator CME Evaluation Block",
    quizSuccess: "Correct! Standard validated response.",
    quizWrong: "Incorrect. Re-evaluate the clinical text above.",
    notesHeader: "Active Clinical Notes Pad"
  },
  fr: {
    title: "Médiathèque des Cours (PDF)",
    subtitle: "Uploadez, archivez et étudiez vos cours cliniques PDF, fiches d'internat et référentiels médicaux",
    dragDrop: "Glissez-déposez vos cours cliniques PDF ici",
    orBrowse: "ou parcourez les fichiers de votre ordinateur",
    pagesCount: "pages",
    myCourses: "Mes Syllabus Personnalisés",
    preseeded: "Bibliothèque de Conférences & d'Internat",
    studyBtn: "Lancer le Mode d'Étude Interactif",
    closeBtn: "Fermer le Manuel",
    downloadBtn: "Télécharger le Fichier PDF",
    uploadSuccess: "Le document PDF a été analysé et archivé avec succès !",
    onlyPdf: "Le format de fichier pris en charge est exclusivement le document PDF (.pdf).",
    references: "Références: Organisation Mondiale de la Santé (OMS); Collège National de Nephrologie / Réanimation.",
    noUploads: "Aucun document PDF uploadé. Glissez-déposez n'importe quelle fiche de cours .pdf ci-dessus.",
    quizHeader: "Module d'Auto-Évaluation CME",
    quizSuccess: "Félicitations! Réponse médicale validée.",
    quizWrong: "Sélection incorrecte. Relisez attentivement le texte clinique.",
    notesHeader: "Prise de Notes Cliniques"
  },
  ar: {
    title: "المحاضرات والمناهج الطبية (PDF)",
    subtitle: "رفع ومراجعة كتب المناهج الطبية بصيغة PDF، وملخصات المحاضرات العلمية والاختبارات التفاعلية",
    dragDrop: "اسحب وأفلت ملف المحاضرة الطبي بصيغة .pdf هنا",
    orBrowse: "أو اختر الملفات من جهاز الكمبيوتر الخاص بك",
    pagesCount: "صفحات",
    myCourses: "مناهجي الطبية المخصصة",
    preseeded: "المحاضرات والمناهج المعتمدة",
    studyBtn: "بدء وضع الدراسة التفاعلي HUD",
    closeBtn: "إغلاق نافذة الكتاب",
    downloadBtn: "تحميل المرجع والأبحاث PDF",
    uploadSuccess: "تم تحليل وأرشفة منهج الـ PDF بنجاح في المكتبة الطبية الرقمية!",
    onlyPdf: "الامتداد المدعوم للملفات هو الكتب الطبية الرقمية (.pdf) فقط.",
    references: "المراجع والمعايير المعتمدة: منظمة الصحة العالمية (WHO)؛ الجمعية الأوروبية لطب العناية المركزة (ESICM).",
    noUploads: "لم يتم رفع أي مناهج مخصصة بعد. اسحب وأفلت أي ملف .pdf بالأعلى لإدراجه فوراً.",
    quizHeader: "اختبار التحقق من الفهم السريري",
    quizSuccess: "إجابة صحيحة بالكامل! معتمدة ضمن المبادئ السريرية.",
    quizWrong: "إجابة غير صحيحة. يرجى إعادة مراجعة النص في الأعلى.",
    notesHeader: "دفتر تدوين الملاحظات الطبية"
  }
};

function getLocalizedDefaultCourse(c: MedicalCourse, lang: LangCode): MedicalCourse {
  if (c.id === 'pdf-1') {
    return {
      ...c,
      title: lang === 'fr' 
        ? 'Néphrologie clinique : Cockcroft-Gault et cinétique de clairance des médicaments' 
        : lang === 'ar' 
        ? 'أحماض الكلى السريرية: حركية تصفية الأدوية ومعادلة كوككروفت-غولت' 
        : 'Clinical Nephrology: Cockcroft-Gault & Drug Clearance Kinetics',
      summary: lang === 'fr'
        ? "Un didacticiel approfondi sur la clairance de la créatinine, l'estimation du débit de filtration glomérulaire (DFG) et l'ajustement de la posologie des médicaments."
        : lang === 'ar'
        ? 'برنامج تعليمي متعمق حول تصفية الكرياتينين، وتقدير معدل الترشيح الكبيبي (eGFR)، وضبط جرعات الأدوية ذات النطاق العلاجي الضيق.'
        : 'A deep-dive tutorial on creatinine clearance, estimating glomerular filtration rate (eGFR), and adjusting therapeutic index dosages.',
      sections: lang === 'fr' ? [
        {
          heading: 'Section 1 : Filtration glomérulaire et clairance endogène',
          text: "Le principal critère d'évaluation physiologique de la fonction rénale est le débit de filtration glomérulaire (DFG). La mesure directe du DFG à l'aide de substances exogènes comme l'inuline est cliniquement impraticable. Par conséquent, les marqueurs de filtration endogènes — principalement la créatinine sérique — sont utilisés comme ancres de substitution. Les cliniciens doivent comprendre que les niveaux sériques dépendent fortement de l'âge, du sexe biologique et de la masse musculaire active."
        },
        {
          heading: 'Section 2 : L\'équation mathématique de Cockcroft-Gault',
          text: "Formulée en 1976, Cockcroft-Gault reste l'ancre réglementaire pour les ajustements posologiques des produits pharmaceutiques. Formule standard : ClCr (mL/min) = [((140 - Âge) * Poids) / (72 * CrS)]. Pour les femmes, le résultat est multiplié par 0,85 pour compenser la masse musculaire plus faible. Piège clé : l'utilisation du poids corporel total réel chez les patients cachectiques ou obèses introduit souvent des erreurs de surestimation majeures."
        },
        {
          heading: 'Section 3 : Index thérapeutique et ajustements posologiques',
          text: "Certains antibiotiques puissants (comme la vancomycine ou les aminosides) présentent des fenêtres thérapeutiques étroites. Des concentrations infra-thérapeutiques déclenchent des mutations bactériennes et un échec du traitement, tandis que des niveaux excessifs entraînent une nécrose tubulaire aiguë ou une toxicité vestibulaire. Des mesures régulières de la clairance rénale doivent guider les configurations posologiques quotidiennes."
        }
      ] : lang === 'ar' ? [
        {
          heading: 'القسم الأول: الترشيح الكبيبي والتصفية الذاتية',
          text: 'المعيار الفسيولوجي الأساسي لوظائف الكلى هو معدل الترشيح الكبيبي (GFR). القياس المباشر لـ GFR باستخدام مواد خارجية مثل الإينولين غير عملي سريرياً. وبناءً على ذلك، يتم استخدام مؤشرات الترشيح الداخلية - وبشكل أساسي الكرياتينين في الدم. يجب على الأطباء فهم أن مستويات الكرياتينين تعتمد بشكل كبير على العمر والجنس العضلي والكتلة العضلية النشطة.'
        },
        {
          heading: 'القسم الثاني: معادلة كوككروفت-غولت الرياضية',
          text: 'صيغت هذه معادلة في عام 1976، وظلت المرجع الأساسي لتعديل جرعات الأدوية. المعادلة القياسية: ClCr (مل/دقيقة) = [((140 - العمر) * الوزن) / (72 * الكرياتينين)]. بالنسبة للإناث، يتم ضرب النتيجة بأكملها في 0.85 للتعويض عن انخفاض الكتلة العضلية لديهن. فخ رئيسي: استخدام الوزن الفعلي للجسم لدى مرضى السمنة أو الهزال غالباً ما يؤدي إلى أخطاء تقديرية كبيرة.'
        },
        {
          heading: 'القسم الثالث: النطاق العلاجي وتعديلات الجرعات',
          text: 'تظهر بعض المضادات الحيوية عالية الفعالية (مثل الفانكومايسين أو الأمينوغليكوزيدات) هوامش علاجية ضيقة جداً. تؤدي التركيزات المنخفضة إلى حدوث طفرات بكتيرية وفشل العلاج، في حين تؤدي المستويات الزائدة إلى نخر أنبوبي حاد أو تسمم أذني. يجب أن توجه قياسات التصفية الكلوية اليومية عملية ضبط الجرعات.'
        }
      ] : c.sections,
      quiz: lang === 'fr' ? [
        {
          question: 'Pourquoi les calculs du score de Cockcroft-Gault doivent-ils utiliser un facteur correctif de 0,85 pour les patientes ?',
          options: [
            'Pour tenir compte de la baisse du débit cardiaque.',
            'Pour compenser une masse musculaire généralement plus faible par rapport à la masse corporelle.',
            'Pour tenir compte de niveaux de clairance hépatique élevés.',
            'Pour équilibrer la variance de la pression artérielle.'
          ],
          answerIndex: 1
        },
        {
          question: 'Quel paramètre de poids doit être privilégié pour les patients dépassant 120 % de leur poids corporel idéal ?',
          options: [
            'Poids total réel',
            'Poids IMC standard',
            'Poids corporel ajusté (AdjBW)',
            'Poids sec'
          ],
          answerIndex: 2
        }
      ] : lang === 'ar' ? [
        {
          question: 'لماذا يجب أن تستخدم حسابات كوككروفت-غولت عاملاً تصحيحياً قدره 0.85 للمريضات من الإناث؟',
          options: [
            'لمراعاة انخفاض معدلات نتاج القلب.',
            'للتعويض عن انخفاض كثافة الكتلة العضلية لديهن مقارنة بالوزن الإجمالي للجسم.',
            'لمراعاة مستويات التصفية الكبدية المرتفعة.',
            'لموازنة تباين ضغط الدم الشرياني.'
          ],
          answerIndex: 1
        },
        {
          question: 'أي من معايير الوزن التالية يجب تفضيله للمرضى الذين يتجاوز وزنهم 120٪ من الوزن المثالي؟',
          options: [
            'الوزن الإجمالي الفعلي',
            'الوزن القياسي لمؤشر كتلة الجسم',
            'الوزن المعدل للجسم (AdjBW)',
            'الوزن الجاف'
          ],
          answerIndex: 2
        }
      ] : c.quiz
    };
  }
  if (c.id === 'pdf-2') {
    return {
      ...c,
      title: lang === 'fr'
        ? 'Voies de sepsis : Étalonnage précoce des cibles qSOFA et SIRS'
        : lang === 'ar'
        ? 'مسارات التسمم الدموي: المعايرة المبكرة لأهداف qSOFA و SIRS'
        : 'Sepsis Pathways: Early Calibration of qSOFA & SIRS Targets',
      summary: lang === 'fr'
        ? "Directives essentielles pour comparer les critères SIRS d'inflammation systémique aux cibles qSOFA de défaillance d'organes en réanimation."
        : lang === 'ar'
        ? 'إرشادات أساسية للمقارنة بين معايير استجابة الالتهاب الجهازية (SIRS) وأهداف فشل الأعضاء السريرية لمؤشر qSOFA.'
        : 'Essential guidelines for comparing micro-inflammatory SIRS criteria against critical care Sepsis-3 qSOFA organ failure targets.',
      sections: lang === 'fr' ? [
        {
          heading: 'Section 1 : L\'évolution de la pathologie du sepsis',
          text: "Le sepsis est défini comme un dysfonctionnement d'organes menaçant le pronostic vital, causé par une réponse déréglée de l'hôte à l'infection. Historiquement, le Sepsis-1 associait le diagnostic uniquement à la présence du syndrome de réponse inflammatoire systémique (SIRS) : température élevée/basse, fréquence cardiaque élevée, fréquence respiratoire élevée et taux de globules blancs. Cependant, le SIRS manque de spécificité essentielle."
        },
        {
          heading: 'Section 2 : Les directives Sepsis-3 et le score qSOFA',
          text: "Le score quick SOFA (qSOFA) a été introduit pour faciliter l'identification rapide des patients présentant un risque élevé de décès hors réanimation. Le score évalue trois variables cliniques critiques : la fréquence respiratoire (>=22 cycles/min), l'état mental altéré (GCS < 15) et la pression artérielle systolique (<=100 mmHg). Un score >= 2 suggère une trajectoire pronostique défavorable."
        },
        {
          heading: 'Section 3 : Protocoles de triage aux urgences',
          text: "Les approches cliniques idéales intègrent les DEUX rubriques de dépistage. Le SIRS reste supérieur pour un dépistage sensible, garantissant que les bactériémies potentielles soient détectées tôt pour une antibiothérapie rapide. Le score qSOFA est ensuite utilisé comme un puissant outil de triage pour indiquer un dysfonctionnement d'organes grave, nécessitant une escalade immédiate vers les soins intensifs."
        }
      ] : lang === 'ar' ? [
        {
          heading: 'القسم الأول: التطور الفسيولوجي للتسمم الدموي (Sepsis)',
          text: 'يُعرَّف التسمم الدموي بأنه خلل وظيفي في الأعضاء يهدد الحياة بسبب استجابة الجسم غير المنتظمة للعدوى. تاريخياً، ربط الأطباء التشخيص فقط بوجود متلازمة الاستجابة الالتهابية الجهازية (SIRS). وكان ذلك يشمل مؤشرات مثل الحرارة المرتفعة/المنخفضة، والنبض السريع، ومعدل التنفس، وكرات الدم البيضاء. ومع ذلك، يفتقر SIRS إلى الخصوصية السريرية المطلوبة.'
        },
        {
          heading: 'القسم الثاني: إرشادات Sepsis-3 ومؤشر qSOFA',
          text: 'تم تقديم مؤشر quick SOFA (qSOFA) لتسهيل التعرف السريع على المرضى المعرضين لخطر الوفاة المرتفع خارج العناية المركزة. يقيم المؤشر ثلاثة متغيرات سريرية مهمة: معدل التنفس (>=22/دقيقة)، وتغير الحالة العقلية (GCS < 15)، وضغط الدم الانقباضي (<=100 ملم زئبقي). النتيجة >= 2 تشير إلى خطورة عالية.'
        },
        {
          heading: 'القسم الثالث: بروتوكولات الفرز في قسم الطوارئ',
          text: 'تدمج الأساليب السريرية المثالية كلا الفحصين. يظل SIRS متفوقاً في الفحص الحسي الأولي، مما يضمن اكتشاف حالات التسمم المحتملة مبكراً لبدء المضادات الحيوية فوراً. ثم يتم تطبيق نقاط qSOFA كأداة فرز قوية لتحديد الخلل الوظيفي الشديد للأعضاء، مما يشير إلى الحاجة لتصعيد الرعاية للعناية المركزة.'
        }
      ] : c.sections,
      quiz: lang === 'fr' ? [
        {
          question: 'Quelle est la variable principale évaluée par le score qSOFA ?',
          options: [
            'Température corporelle',
            'Fréquence respiratoire ≥22/min',
            'Clairance du lactate',
            'Débit cardiaque'
          ],
          answerIndex: 1
        }
      ] : lang === 'ar' ? [
        {
          question: 'ما هي المتغيرات السريرية التي يتم تقييمها بواسطة مؤشر qSOFA؟',
          options: [
            'درجة حرارة الجسم الكلية',
            'معدل التنفس ≥ 22/دقيقة، وتغير الحالة العقلية، وضغط الدم الانقباضي ≤ 100 ملم زئبقي',
            'تصفية اللاكتات وتعداد كرات الدم البيضاء',
            'معدل نتاج القلب الكلي'
          ],
          answerIndex: 1
        }
      ] : c.quiz
    };
  }
  return c;
}

export default function Courses({ lang }: { lang: LangCode }) {
  const t = translations[lang] || translations.en;
  const isRtl = lang === 'ar';

  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { langPath } = useLang();

  const [courses, setCourses] = useState<MedicalCourse[]>(() => {
    const localizedMaster = MASTER_COURSES.map(mc => getLocalizedCourse(mc, lang));
    const localizedDefault = DEFAULT_COURSES.map(c => getLocalizedDefaultCourse(c, lang));
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('carecalculus-pdf-uploads');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return [...localizedDefault, ...localizedMaster, ...parsed];
        } catch (e) {
          return [...localizedDefault, ...localizedMaster];
        }
      }
    }
    return [...localizedDefault, ...localizedMaster];
  });

  // Re-translate courses whenever language changes
  useEffect(() => {
    const localizedMaster = MASTER_COURSES.map(mc => getLocalizedCourse(mc, lang));
    const localizedDefault = DEFAULT_COURSES.map(c => getLocalizedDefaultCourse(c, lang));
    setCourses(prev => {
      const customOnly = prev.filter(c => c.isUserUploaded);
      return [...localizedDefault, ...localizedMaster, ...customOnly];
    });
  }, [lang]);

  // The open course is derived from the URL (/cours/:slug) so each course is
  // directly linkable and survives a reload.
  const selectedCourse = useMemo(() => {
    if (!slug) return null;
    const target = slug.toLowerCase();
    
    // First try standard match in the current state list
    const foundDirect = findBySlug(courses, slug, c => c.title);
    if (foundDirect) return foundDirect;
    
    // Fallback: match by ID or title in any language from master list
    const foundMaster = MASTER_COURSES.find(mc => {
      return (
        slugify(mc.title.en, mc.id) === target ||
        slugify(mc.title.fr, mc.id) === target ||
        slugify(mc.title.ar, mc.id) === target ||
        mc.id.toLowerCase() === target
      );
    });
    
    if (foundMaster) {
      return courses.find(c => c.id === foundMaster.id) || null;
    }
    
    return null;
  }, [courses, slug]);

  // Synchronize slug with localized title on language change
  useEffect(() => {
    if (selectedCourse) {
      const expectedSlug = slugify(selectedCourse.title, selectedCourse.id);
      if (expectedSlug !== slug) {
        navigate(langPath(`/cours/${expectedSlug}`), { replace: true });
      }
    }
  }, [lang, selectedCourse, slug, navigate, langPath]);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<boolean>(false);
  const [isUploadingSim, setIsUploadingSim] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // States for CME interactive quiz
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizResults, setQuizResults] = useState<Record<number, boolean | null>>({});

  // Local state for taking notes
  const [personalNotes, setPersonalNotes] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('carecalculus-study-notes') || "";
    }
    return "";
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('carecalculus-study-notes', personalNotes);
    }
  }, [personalNotes]);

  const saveCustomUploadedCourses = (updatedList: MedicalCourse[]) => {
    const customOnly = updatedList.filter(c => c.isUserUploaded);
    localStorage.setItem('carecalculus-pdf-uploads', JSON.stringify(customOnly));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError(t.onlyPdf);
      return;
    }

    setUploadError(null);
    setIsUploadingSim(true);
    setSimulatedProgress(10);

    // Trigger progressive feedback loader
    const interval = setInterval(() => {
      setSimulatedProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploadingSim(false);
            setUploadSuccessMsg(true);

            const cleanTitle = file.name.replace(/\.[^/.]+$/, "").split('_').join(' ').split('-').join(' ');
            const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

            const parsedNewCourse: MedicalCourse = {
              id: `user-pdf-${Date.now()}`,
              title: cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1),
              instructor: 'Uploaded Clinical Document Reference',
              date: new Date().toISOString().split('T')[0],
              size: formattedSize,
              pages: 2,
              category: 'Self-Directed / General Study',
              summary: `Custom clinical document uploaded by user: ${file.name}. Logged and analyzed successfully for diagnostic screening review.`,
              sections: [
                {
                  heading: 'Document Extraction Summary Node',
                  text: `The medical reference file "${file.name}" has been mapped into CareCalculus syllabus index libraries. Please leverage current peer calculators to audit formulas referenced inside the curriculum.`
                },
                {
                  heading: 'Diagnostic Metrics Audits',
                  text: 'Medical practitioners are advised to correlate calculated outputs against localized patient symptoms, laboratory markers, and real-time hemodynamic monitor traces.'
                }
              ],
              quiz: [
                {
                  question: 'Does calculated data replace dynamic, localized clinical diagnostic decision-making?',
                  options: [
                    'Yes, medical calculators are diagnostic standards.',
                    'No, clinical scores act as surrogate inputs to assist personalized diagnosis.',
                    'Only in emergency situations.',
                    'Only during pediatric assessments.'
                  ],
                  answerIndex: 1
                }
              ],
              isUserUploaded: true
            };

            const newList = [...courses, parsedNewCourse];
            setCourses(newList);
            saveCustomUploadedCourses(newList);

            setTimeout(() => setUploadSuccessMsg(false), 3000);
          }, 450);
          return 100;
        }
        return p + 15;
      });
    }, 180);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDeleteCourse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanList = courses.filter(c => c.id !== id);
    setCourses(cleanList);
    saveCustomUploadedCourses(cleanList);
    if (selectedCourse?.id === id) {
      navigate(langPath('/cours'));
    }
  };

  const startStudying = (course: MedicalCourse) => {
    navigate(langPath(`/cours/${slugify(course.title, course.id)}`));
  };

  // Reset section/quiz progress whenever the open course changes (via the URL).
  useEffect(() => {
    setActiveSectionIndex(0);
    setSelectedAnswers({});
    setQuizResults({});
  }, [slug]);

  // Unknown slug → fall back to the course library.
  useEffect(() => {
    if (slug && !selectedCourse) navigate(langPath('/cours'), { replace: true });
  }, [slug, selectedCourse, navigate]);

  const handleAnswerSubmit = (qIdx: number, oIdx: number, correctIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    const isCorrect = oIdx === correctIdx;
    setQuizResults(prev => ({ ...prev, [qIdx]: isCorrect }));
  };

  const mockDownload = (course: MedicalCourse) => {
    const dummyContent = `MOCK PDF GUIDELINE FOR ${course.title}`;
    const blob = new Blob([dummyContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeSection = selectedCourse ? selectedCourse.sections[activeSectionIndex] : null;

  return (
    <>
      <div className="max-w-4xl mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600 shrink-0" />
          <span>{t.title}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Dynamic Immersive Textbook HUD */}
      <AnimatePresence>
        {selectedCourse && activeSection && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[94vh] shadow-2xl"
              style={{ direction: isRtl ? 'rtl' : 'ltr' }}
            >
              {/* Header block */}
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-md font-mono text-[9px] uppercase tracking-widest font-extrabold select-none">
                    EHR ACCREDITED ACADEMY
                  </span>
                  <h3 className="text-xs font-bold font-mono text-gray-200 uppercase truncate max-w-lg">
                    {selectedCourse.title}
                  </h3>
                </div>
                <button
                  onClick={() => navigate(langPath('/cours'))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-gray-200 transition-all font-semibold hover:text-white cursor-pointer"
                  style={{ minHeight: '44px' }}
                >
                  {t.closeBtn}
                </button>
              </div>

              {/* Main divided window */}
              <div className="flex-1 p-6 md:p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 scrollbar-thin">
                
                {/* Left Outline Rail */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-830">
                    <h4 className="text-[10px] font-mono font-extrabold text-blue-400 uppercase tracking-wider mb-2.5">
                      Course Chapters
                    </h4>
                    
                    <div className="space-y-1.5">
                      {selectedCourse.sections.map((sec, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSectionIndex(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs leading-normal transition-all flex items-center gap-2 ${
                            activeSectionIndex === idx
                              ? 'bg-blue-650 text-white font-bold'
                              : 'text-gray-400 hover:bg-slate-850 hover:text-gray-200'
                          }`}
                          style={{ minHeight: '40px' }}
                        >
                          <span className="font-mono text-[10px] opacity-75">S.{idx + 1}</span>
                          <span className="truncate">{sec.heading}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Textbook Note Taking area */}
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-830 space-y-2">
                    <h4 className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                      <span>{t.notesHeader}</span>
                      <ClipboardCheck className="w-3.5 h-3.5" />
                    </h4>
                    <textarea
                      rows={5}
                      value={personalNotes}
                      onChange={(e) => {
                        setPersonalNotes(e.target.value);
                      }}
                      placeholder="Type personal references, equations, or exam notes here, they will persist automatically..."
                      className="w-full bg-slate-900 border border-slate-750 focus:border-amber-500 rounded-lg p-2.5 text-[11px] text-gray-200 placeholder:text-gray-650 outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Center & Right reading frame */}
                <div className="lg:col-span-9 space-y-6 flex flex-col justify-between">
                  {/* Active Section Study Content */}
                  <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-l-4 border-l-blue-500 border border-slate-800 rounded-xl space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 w-full" />
                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 relative z-10">
                      <span className="text-blue-400 font-mono text-sm">[0{activeSectionIndex + 1}]</span>
                      <span>{activeSection.heading}</span>
                    </h2>
                    
                    <p className="text-gray-350 text-xs sm:text-sm md:text-[15px] leading-relaxed text-justify relative z-10">
                      {activeSection.text}
                    </p>
                  </div>

                  {/* Dynamic Evaluation Quiz Block */}
                  {selectedCourse.quiz && selectedCourse.quiz.length > 0 && (
                    <div className="p-5 bg-slate-950/40 border border-slate-830 rounded-xl space-y-4">
                      <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest font-mono">
                        <HelpCircle className="w-4 h-4 animate-pulse shrink-0" />
                        <span>{t.quizHeader}</span>
                      </div>

                      <div className="space-y-4">
                        {selectedCourse.quiz.map((qz, qIdx) => {
                          const ansState = selectedAnswers[qIdx];
                          const resState = quizResults[qIdx];

                          return (
                            <div key={qIdx} className="space-y-2.5 p-3 bg-slate-900/60 rounded-xl border border-slate-850">
                              <p className="text-xs font-bold text-gray-200">
                                {qIdx + 1}. {qz.question}
                              </p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {qz.options.map((opt, oIdx) => {
                                  const isSelected = ansState === oIdx;
                                  let btnStyle = 'bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-600 hover:text-gray-200';
                                  
                                  if (isSelected) {
                                    btnStyle = resState 
                                      ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300 font-bold'
                                      : 'bg-red-650/25 border-red-500 text-red-300 font-bold';
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      onClick={() => handleAnswerSubmit(qIdx, oIdx, qz.answerIndex)}
                                      className={`text-left px-3.5 py-2.5 rounded-lg text-[11px] leading-snug border transition-all ${btnStyle}`}
                                      style={{ minHeight: '44px' }}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {resState !== undefined && resState !== null && (
                                <p className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                  resState ? 'text-emerald-450' : 'text-red-450'
                                }`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                  <span>{resState ? t.quizSuccess : t.quizWrong}</span>
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Course footer controls */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-850 mt-4">
                    <span className="text-[10px] font-mono text-gray-500">
                      Instructor Unit: {selectedCourse.instructor}
                    </span>
                    <button
                      onClick={() => mockDownload(selectedCourse)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 font-mono uppercase cursor-pointer border border-slate-700"
                      style={{ minHeight: '44px' }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadBtn}</span>
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left col: Drag and drop files */}
        <div className="lg:col-span-5 space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 flex flex-col justify-center items-center min-h-[280px] bg-white ${
              isDragging
                ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-600/10 scale-[0.99]'
                : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/10'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />

            {!isUploadingSim ? (
              <div className="space-y-5">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full inline-flex border border-blue-100 shadow-sm animate-bounce">
                  <Upload className="w-10 h-10" />
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-gray-800 tracking-tight leading-relaxed">
                    {t.dragDrop}
                  </h3>
                  <p className="mt-1.5 text-xs text-gray-400">{t.orBrowse}</p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-mono font-extrabold uppercase">
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF ONLY</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <RefreshCw className="w-10 h-10 text-blue-600 animate-spin mx-auto animate-spin" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono">
                    PARSING & SHIELD-INDEXING PDF...
                  </h4>
                  <p className="text-[10px] text-gray-400">Verifying security signatures and text blocks</p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden max-w-[240px] mx-auto border border-gray-200">
                  <div
                    className="bg-blue-600 h-full transition-all duration-150 rounded-full"
                    style={{ width: `${simulatedProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {uploadError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5 shadow-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{uploadError}</span>
              </motion.div>
            )}

            {uploadSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2.5 shadow-xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t.uploadSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right col: Course Syllabus item list */}
        <div className="lg:col-span-7 space-y-6">
          {/* Curated Preseeded list */}
          <div>
            <h2 className="text-[10px] font-mono leading-none tracking-widest text-slate-400 font-extrabold uppercase pb-3 mb-3 border-b border-gray-100 flex items-center justify-between">
              <span>{t.preseeded}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </h2>

            <div className="space-y-3">
              {courses.filter(c => !c.isUserUploaded).map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => startStudying(cs)}
                  className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-md">
                        {cs.category}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[9px] uppercase tracking-wider font-black rounded-md flex items-center gap-0.5 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                        {lang === 'fr' ? 'Éligible CME' : lang === 'ar' ? 'معتمد للتعليم المستمر' : 'CME Eligible'}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {cs.date}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-normal line-clamp-2">
                      {cs.summary}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0 items-end w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                    <span className="text-[11px] font-mono text-gray-400 font-bold">
                      {cs.pages} {t.pagesCount}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); startStudying(cs); }}
                      className="ml-auto sm:ml-0 py-1.5 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-mono text-[10px] font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>STUDY</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Custom list */}
          <div className="pt-2">
            <h2 className="text-[10px] font-mono leading-none tracking-widest text-slate-400 font-extrabold uppercase pb-3 mb-3 border-b border-gray-100">
              {t.myCourses}
            </h2>

            {courses.filter(c => c.isUserUploaded).length === 0 ? (
              <div className="p-8 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl space-y-2 select-none">
                <FileText className="w-6 h-6 text-gray-300 mx-auto" />
                <p className="text-xs font-semibold text-gray-400">{t.noUploads}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.filter(c => c.isUserUploaded).map((cs) => (
                  <div
                    key={cs.id}
                    onClick={() => startStudying(cs)}
                    className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-md border border-indigo-100">
                          {cs.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {cs.date}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-indigo-600 transition-colors truncate max-w-sm">
                        {cs.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest">
                        SIZE: {cs.size}
                      </p>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 items-end w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <button
                        onClick={(e) => handleDeleteCourse(cs.id, e)}
                        className="p-1 px-2 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                        title="Delete Course Handout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); startStudying(cs); }}
                        className="ml-auto py-1.5 px-3 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-mono text-[10px] font-extrabold uppercase transition-all tracking-wider flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>STUDY</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-150 text-[10px] font-mono text-gray-450 text-center select-none">
        {t.references}
      </div>
    </>
  );
}
