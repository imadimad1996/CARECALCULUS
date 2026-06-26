import { Activity, AlertTriangle, Wind, TestTube, HeartPulse, Brain } from 'lucide-react';

export const CONDITIONS_DB = [
  {
    id: 'sepsis',
    nameEn: 'Sepsis & Infection',
    nameFr: 'Sepsis & Infection',
    nameAr: 'تسمم الدم والعدوى',
    icon: AlertTriangle,
    descriptionEn: 'Clinical decision tools for early detection, risk stratification, and management of sepsis and systemic inflammatory response syndrome.',
    descriptionFr: 'Outils de décision clinique pour la détection précoce, la stratification du risque et la prise en charge du sepsis et du SIRS.',
    descriptionAr: 'أدوات القرار السريري للكشف المبكر، وتقييم المخاطر، وإدارة تسمم الدم ومتلازمة الاستجابة الالتهابية.',
    calculators: ['qsofa-score', 'sirs-criteria', 'sofa-score', 'map-calculator', 'curb65-score']
  },
  {
    id: 'liver-disease',
    nameEn: 'Liver Disease & Cirrhosis',
    nameFr: 'Maladie du Foie & Cirrhose',
    nameAr: 'أمراض الكبد والتليف',
    icon: Activity,
    descriptionEn: 'Prognostic scoring systems and severity calculators for end-stage liver disease, cirrhosis, and hepatic encephalopathy.',
    descriptionFr: 'Systèmes de score pronostique et calculateurs de sévérité pour l\'insuffisance hépatique terminale et la cirrhose.',
    descriptionAr: 'أنظمة تسجيل وتقييم شدة أمراض الكبد في المرحلة النهائية وتليف الكبد.',
    calculators: ['meld-score', 'child-pugh-score', 'corrected-calcium']
  },
  {
    id: 'atrial-fibrillation',
    nameEn: 'Atrial Fibrillation',
    nameFr: 'Fibrillation Atriale',
    nameAr: 'الرجفان الأذيني',
    icon: HeartPulse,
    descriptionEn: 'Stroke and bleeding risk stratification tools for patients with non-valvular atrial fibrillation to guide anticoagulation therapy.',
    descriptionFr: 'Outils de stratification du risque d\'AVC et de saignement pour guider le traitement anticoagulant dans la FA.',
    descriptionAr: 'أدوات تقييم مخاطر السكتة الدماغية والنزيف لتوجيه العلاج المضاد للتخثر.',
    calculators: ['cha2ds2-vasc', 'wells-score']
  },
  {
    id: 'respiratory-failure',
    nameEn: 'Respiratory Failure & ARDS',
    nameFr: 'Insuffisance Respiratoire & SDRA',
    nameAr: 'الفشل التنفسي ومتلازمة الضائقة',
    icon: Wind,
    descriptionEn: 'Calculators for oxygenation indices, lung-protective ventilation, and acute respiratory distress syndrome (ARDS) severity.',
    descriptionFr: 'Calculateurs d\'indices d\'oxygénation, ventilation protectrice et sévérité du SDRA.',
    descriptionAr: 'حاسبات مؤشرات الأكسجة والتنفس الصناعي وتقييم شدة متلازمة الضائقة التنفسية.',
    calculators: ['pf-ratio', 'aa-gradient', 'tidal-volume']
  },
  {
    id: 'renal-failure',
    nameEn: 'Renal Failure & CKD',
    nameFr: 'Insuffisance Rénale & MRC',
    nameAr: 'الفشل الكلوي وأمراض الكلى',
    icon: TestTube,
    descriptionEn: 'Tools for estimating glomerular filtration rate (GFR), creatinine clearance, and metabolic acidosis assessment.',
    descriptionFr: 'Outils d\'estimation du DFG, de la clairance de la créatinine et d\'évaluation de l\'acidose métabolique.',
    descriptionAr: 'أدوات تقدير معدل الترشيح الكبيبي وتصفية الكرياتينين وتقييم الحماض الأيضي.',
    calculators: ['creatinine-clearance', 'anion-gap', 'anc-calculator']
  }
];
