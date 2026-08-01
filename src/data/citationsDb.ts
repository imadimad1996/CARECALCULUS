export interface Citation {
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid: string;
}

export const citationsDb: Record<string, Citation[]> = {
  '/sofa-score': [
    {
      title: "The SOFA (Sepsis-related Organ Failure Assessment) score to describe organ dysfunction/failure",
      authors: "Vincent JL, Moreno R, Takala J, et al.",
      journal: "Intensive Care Med",
      year: 1996,
      pmid: "8861123"
    },
    {
      title: "The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)",
      authors: "Singer M, Deutschman CS, Seymour CW, et al.",
      journal: "JAMA",
      year: 2016,
      pmid: "26903338"
    }
  ],
  '/qsofa-score': [
    {
      title: "The Third International Consensus Definitions for Sepsis and Septic Shock (Sepsis-3)",
      authors: "Singer M, Deutschman CS, Seymour CW, et al.",
      journal: "JAMA",
      year: 2016,
      pmid: "26903338"
    }
  ],
  '/map-calculator': [
    {
      title: "Mean arterial pressure and mortality in patients with distributive shock: a retrospective analysis of the MIMIC-III database",
      authors: "Houwink AP, Rijkenberg S, Bosman RJ, et al.",
      journal: "Crit Care",
      year: 2016,
      pmid: "26987488"
    }
  ],
  '/creatinine-clearance': [
    {
      title: "Prediction of creatinine clearance from serum creatinine",
      authors: "Cockcroft DW, Gault MH.",
      journal: "Nephron",
      year: 1976,
      pmid: "1244564"
    }
  ],
  '/wells-score': [
    {
      title: "Value of assessment of pretest probability of deep-vein thrombosis in clinical management",
      authors: "Wells PS, Anderson DR, Bormanis J, et al.",
      journal: "Lancet",
      year: 1997,
      pmid: "9413461"
    }
  ],
  '/meld-score': [
    {
      title: "A model to predict survival in patients with end-stage liver disease",
      authors: "Kamath PS, Wiesner RH, Malinchoc M, et al.",
      journal: "Hepatology",
      year: 2001,
      pmid: "11172350"
    }
  ],
  '/glasgow-coma-scale': [
    {
      title: "Assessment of coma and impaired consciousness. A practical scale",
      authors: "Teasdale G, Jennett B.",
      journal: "Lancet",
      year: 1974,
      pmid: "4136544"
    }
  ],
  '/has-bled-score': [
    {
      title: "A novel user-friendly score (HAS-BLED) to assess 1-year risk of major bleeding in patients with atrial fibrillation: the Euro Heart Survey",
      authors: "Pisters R, Lane DA, Nieuwlaat R, et al.",
      journal: "Chest",
      year: 2010,
      pmid: "20299623"
    }
  ],
  '/cha2ds2-vasc-score': [
    {
      title: "Refining clinical risk stratification for predicting stroke and thromboembolism in atrial fibrillation using a novel risk factor-based approach: the euro heart survey on atrial fibrillation",
      authors: "Lip GY, Nieuwlaat R, Pisters R, et al.",
      journal: "Chest",
      year: 2010,
      pmid: "20110424"
    }
  ]
};
