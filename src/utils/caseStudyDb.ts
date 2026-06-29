export interface CaseStep {
  title: string;
  titleFr?: string;
  titleAr?: string;
  description: string;
  descriptionFr?: string;
  descriptionAr?: string;
  vitals?: { hr: number; bp: string; temp: number; rr: number; spo2: number };
  question?: {
    text: string;
    textFr?: string;
    textAr?: string;
    options: string[];
    optionsFr?: string[];
    optionsAr?: string[];
    correctIndex: number;
    rationale: string;
    rationaleFr?: string;
    rationaleAr?: string;
  };
}

export interface ClinicalCase {
  id: string;
  titleEn: string;
  titleFr: string;
  titleAr: string;
  steps: CaseStep[];
}

export const CASE_STUDIES_DB: ClinicalCase[] = [
  {
    id: "sepsis",
    titleEn: "Case #1 — Sepsis & Septic Shock in 68M",
    titleFr: "Cas #1 — Sepsis & Choc Septique chez un Patient de 68 ans",
    titleAr: "حالة رقم ١ — تسمم وصدمة إنتانية لمريض يبلغ ٦٨ عامًا",
    steps: [
      {
        title: "Step 1: Patient Presentation",
        titleFr: "Étape 1 : Présentation du patient",
        titleAr: "الخطوة ١: تقديم حالة المريض",
        description: "A 68-year-old male with a history of COPD presents from a nursing home with altered mental status, productive cough, and fever. On arrival, he is lethargic and responds only to loud verbal commands.",
        descriptionFr: "Un homme de 68 ans ayant des antécédents de BPCO est transféré d'un Ehpad pour altération de l'état mental, toux grasse et fièvre. À son arrivée, il est léthargique et ne répond qu'aux commandes verbales fortes.",
        descriptionAr: "رجل يبلغ من العمر 68 عاماً يعاني من تاريخ مرضي لمرض الانسداد الرئوي المزمن (COPD)، يتم تحويله من دار رعاية المسنين بسبب تغير في الحالة العقلية، وسعال رطب، وحمى. عند وصوله، كان في حالة خمول واستجاب فقط للأوامر اللفظية العالية.",
        vitals: { hr: 112, bp: "94/56", temp: 38.9, rr: 26, spo2: 89 }
      },
      {
        title: "Step 2: Risk Scoring",
        titleFr: "Étape 2 : Évaluation du risque",
        titleAr: "الخطوة ٢: تقييم المخاطر السريرية",
        description: "The clinician must immediately evaluate the risk of organ dysfunction. Which bedside score is most appropriate to evaluate critical illness risk in this non-ICU setting?",
        descriptionFr: "Le clinicien doit immédiatement évaluer le risque de dysfonctionnement d'organes. Quel score de chevet est le plus approprié pour évaluer le risque de maladie grave dans ce contexte hors réanimation ?",
        descriptionAr: "يجب على الممارس الصحي تقييم خطر فشل الأعضاء فوراً. ما هو المقياس السريري بجانب السرير الأكثر ملاءمة لتقييم خطر المرض الحرج في هذا الإطار خارج العناية المركزة؟",
        question: {
          text: "Select the most appropriate clinical scoring scheme:",
          textFr: "Sélectionnez le système de scoring clinique le plus approprié :",
          textAr: "اختر نظام التقييم السريري الأكثر ملاءمة:",
          options: ["SIRS Criteria", "qSOFA Score", "MELD Score", "Glasgow Coma Scale (GCS) only"],
          optionsFr: ["Critères du SIRS", "Score qSOFA", "Score MELD", "Échelle de Glasgow (GCS) seule"],
          optionsAr: ["معايير SIRS", "مؤشر qSOFA", "مؤشر MELD", "مقياس غلاسكو (GCS) فقط"],
          correctIndex: 1,
          rationale: "qSOFA (Quick SOFA) is designed specifically as a rapid bedside tool to identify patients outside the ICU at high risk of death from sepsis (respiratory rate >=22/min, altered mentation, systolic BP <=100 mmHg). The patient meets all 3 criteria.",
          rationaleFr: "Le qSOFA (Quick SOFA) est conçu spécifiquement comme un outil de chevet rapide pour identifier les patients hors réanimation présentant un risque élevé de décès par sepsis (fréquence respiratoire >=22/min, état mental altéré, PA systolique <=100 mmHg). Le patient remplit ces 3 critères.",
          rationaleAr: "تم تصميم مؤشر qSOFA (الـ SOFA السريع) خصيصاً كأداة سريعة بجانب السرير لتحديد المرضى خارج العناية المركزة المعرضين لخطر الوفاة بسبب التسمم الدموي (معدل التنفس >=22/دقيقة، وتغير الحالة العقلية، وضغط الدم الانقباضي <=100 ملم زئبقي). المريض يستوفي المعايير الثلاثة بالكامل."
        }
      }
    ]
  }
];

