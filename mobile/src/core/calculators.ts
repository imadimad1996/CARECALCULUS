export interface CalculatorMeta {
  id: string;
  title: string;
  abbreviation: string;
  category: 'ICU/CCU' | 'Cardiology' | 'Nephrology' | 'Pulmonology' | 'Hepatology' | 'Emergency' | 'Neurology' | 'Endocrinology' | 'Pharmacology';
  summary: string;
  isPopular?: boolean;
  isEmergency?: boolean;
  guidelineReference: string;
  defaultUnitSystem: 'Metric (SI)' | 'US';
}

export const CLINICAL_CALCULATORS_CATALOG: CalculatorMeta[] = [
  {
    id: 'map',
    title: 'Mean Arterial Pressure',
    abbreviation: 'MAP',
    category: 'ICU/CCU',
    summary: 'Perfusion indicator for critical care, sepsis, and vasopressor titration.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Surviving Sepsis Campaign (SSC) 2021 Guidelines',
    defaultUnitSystem: 'US',
  },
  {
    id: 'gcs',
    title: 'Glasgow Coma Scale',
    abbreviation: 'GCS',
    category: 'Neurology',
    summary: 'Neurological assessment of consciousness following acute head injury.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Teasdale & Jennett (Lancet 1974); ATLS 10th Ed.',
    defaultUnitSystem: 'US',
  },
  {
    id: 'qsofa',
    title: 'Quick SOFA Score',
    abbreviation: 'qSOFA',
    category: 'ICU/CCU',
    summary: 'Bedside screening for patients with suspected infection at risk for poor sepsis outcome.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Sepsis-3 Consensus Definitions (JAMA 2016)',
    defaultUnitSystem: 'US',
  },
  {
    id: 'curb65',
    title: 'CURB-65 Pneumonia Severity',
    abbreviation: 'CURB-65',
    category: 'Pulmonology',
    summary: 'Predicts 30-day mortality for community-acquired pneumonia (CAP).',
    isPopular: true,
    isEmergency: false,
    guidelineReference: 'British Thoracic Society (BTS) Pneumonia Guidelines',
    defaultUnitSystem: 'US',
  },
  {
    id: 'meld',
    title: 'MELD Score for End-Stage Liver Disease',
    abbreviation: 'MELD',
    category: 'Hepatology',
    summary: 'Estimates 3-month liver disease mortality for UNOS transplant allocation.',
    isPopular: true,
    isEmergency: false,
    guidelineReference: 'UNOS / Organ Procurement and Transplantation Network (OPTN)',
    defaultUnitSystem: 'US',
  },
  {
    id: 'ckdepi',
    title: 'CKD-EPI 2021 eGFR',
    abbreviation: 'eGFR (CKD-EPI)',
    category: 'Nephrology',
    summary: '2021 Race-Free Kidney Disease eGFR calculator.',
    isPopular: true,
    isEmergency: false,
    guidelineReference: 'NKF-ASN Task Force Reassessing Race in GFR Estimation (2021)',
    defaultUnitSystem: 'US',
  },
  {
    id: 'cha2ds2vasc',
    title: 'CHA₂DS₂-VASc Score for Afib',
    abbreviation: 'CHA₂DS₂-VASc',
    category: 'Cardiology',
    summary: 'Calculates annual stroke risk in non-valvular atrial fibrillation.',
    isPopular: true,
    isEmergency: false,
    guidelineReference: '2023 ACC/AHA/ACCP/HRS Atrial Fibrillation Guideline',
    defaultUnitSystem: 'US',
  },
  {
    id: 'wells-pe',
    title: 'Wells Criteria for Pulmonary Embolism',
    abbreviation: 'Wells (PE)',
    category: 'Pulmonology',
    summary: 'Stratifies clinical risk of acute PE to guide D-Dimer vs CTPA imaging.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Wells PS et al. Thromb Haemost 2000',
    defaultUnitSystem: 'US',
  },
  {
    id: 'anion-gap',
    title: 'Serum Anion Gap & Albumin Correction',
    abbreviation: 'Anion Gap',
    category: 'Nephrology',
    summary: 'Differentiates high anion gap vs normal anion gap metabolic acidosis.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Kraut JA & Madias NE. CJASN 2007',
    defaultUnitSystem: 'US',
  },
  {
    id: 'sodium-correction',
    title: 'Sodium Correction for Hyperglycemia',
    abbreviation: 'Corrected Na',
    category: 'Endocrinology',
    summary: 'Calculates true serum sodium in DKA and HHS hyperosmolar states.',
    isPopular: true,
    isEmergency: true,
    guidelineReference: 'Katz MA. N Engl J Med 1973; Hillier TA et al. Am J Med 1999',
    defaultUnitSystem: 'US',
  },
];
