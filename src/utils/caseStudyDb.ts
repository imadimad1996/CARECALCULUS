export interface CaseStep {
  title: string;
  description: string;
  vitals?: { hr: number; bp: string; temp: number; rr: number; spo2: number };
  question?: {
    text: string;
    options: string[];
    correctIndex: number;
    rationale: string;
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
        description: "A 68-year-old male with a history of COPD presents from a nursing home with altered mental status, productive cough, and fever. On arrival, he is lethargic and responds only to loud verbal commands.",
        vitals: { hr: 112, bp: "94/56", temp: 38.9, rr: 26, spo2: 89 }
      },
      {
        title: "Step 2: Risk Scoring",
        description: "The clinician must immediately evaluate the risk of organ dysfunction. Which bedside score is most appropriate to evaluate critical illness risk in this non-ICU setting?",
        question: {
          text: "Select the most appropriate clinical scoring scheme:",
          options: ["SIRS Criteria", "qSOFA Score", "MELD Score", "Glasgow Coma Scale (GCS) only"],
          correctIndex: 1,
          rationale: "qSOFA (Quick SOFA) is designed specifically as a rapid bedside tool to identify patients outside the ICU at high risk of death from sepsis (respiratory rate >=22/min, altered mentation, systolic BP <=100 mmHg). The patient meets all 3 criteria."
        }
      }
    ]
  }
];
