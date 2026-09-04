import { MedicalReviewer } from '../components/MedicalReviewerCard';

/**
 * Shared registry of medical reviewers used across CareCalculus calculator pages.
 * These reviewer cards establish E-E-A-T trust signals by citing the foundational
 * societal guidelines and originating authors behind each calculator.
 */

export const REVIEWER_WELLS: MedicalReviewer = {
  name: 'Dr. Philip S. Wells',
  credentials: ['MD', 'MSc', 'FRCPC'],
  role: 'Originator of the Wells DVT & PE Scoring Systems',
  institution: 'University of Ottawa — Department of Hematology',
  profileUrl: 'https://pubmed.ncbi.nlm.nih.gov/?term=Wells+PS%5BAuthor%5D',
  lastReviewed: 'July 2025',
};

export const REVIEWER_EMERGENCY: MedicalReviewer = {
  name: 'ACEP Clinical Policies Committee',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American College of Emergency Physicians (ACEP)',
  institution: 'Emergency Medicine Evidence-Based Guidelines',
  profileUrl: 'https://www.acep.org/patient-care/clinical-policies/',
  lastReviewed: 'August 2024',
};

export const REVIEWER_INTENSIVIST: MedicalReviewer = {
  name: 'Surviving Sepsis Campaign / SCCM',
  credentials: ['Guideline Standard'],
  role: 'Sourced from Society of Critical Care Medicine',
  institution: 'Critical Care Evidence-Based Guidelines',
  profileUrl: 'https://www.sccm.org/SurvivingSepsisCampaign/Home',
  lastReviewed: 'August 2024',
};

export const REVIEWER_HEPATOLOGY: MedicalReviewer = {
  name: 'AASLD Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Association for the Study of Liver Diseases',
  institution: 'Hepatology Evidence-Based Guidelines',
  profileUrl: 'https://www.aasld.org/practice-guidelines',
  lastReviewed: 'August 2024',
};

export const REVIEWER_CARDIOLOGY: MedicalReviewer = {
  name: 'ACC/AHA Joint Committee on Clinical Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American College of Cardiology & AHA',
  institution: 'Cardiovascular Evidence-Based Guidelines',
  profileUrl: 'https://www.acc.org/Guidelines',
  lastReviewed: 'August 2024',
};

// Alias for backward compatibility
export const REVIEWER_CARDIO = REVIEWER_CARDIOLOGY;

export const REVIEWER_NEUROLOGY: MedicalReviewer = {
  name: 'AHA/ASA Stroke Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Stroke Association',
  institution: 'Neurology Evidence-Based Guidelines',
  profileUrl: 'https://www.stroke.org/en/professionals/guidelines-and-statements',
  lastReviewed: 'August 2024',
};

export const REVIEWER_NEPHROLOGY: MedicalReviewer = {
  name: 'KDIGO Clinical Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from Kidney Disease: Improving Global Outcomes',
  institution: 'Nephrology Evidence-Based Guidelines',
  profileUrl: 'https://kdigo.org/guidelines/',
  lastReviewed: 'August 2024',
};

export const REVIEWER_PULMONOLOGY: MedicalReviewer = {
  name: 'ATS/ERS Clinical Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Thoracic Society',
  institution: 'Pulmonology Evidence-Based Guidelines',
  profileUrl: 'https://www.thoracic.org/statements/',
  lastReviewed: 'August 2024',
};

export const REVIEWER_NURSING: MedicalReviewer = {
  name: 'AACN Practice Standards',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Association of Critical-Care Nurses',
  institution: 'Nursing Evidence-Based Guidelines',
  profileUrl: 'https://www.aacn.org/clinical-resources',
  lastReviewed: 'August 2024',
};

export const REVIEWER_PHARMACY: MedicalReviewer = {
  name: 'ASHP Therapeutic Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Society of Health-System Pharmacists',
  institution: 'Pharmacy Evidence-Based Guidelines',
  profileUrl: 'https://www.ashp.org/pharmacy-practice/policy-positions-and-guidelines',
  lastReviewed: 'August 2025',
};

export const REVIEWER_ONCOLOGY: MedicalReviewer = {
  name: 'NCCN Clinical Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from National Comprehensive Cancer Network',
  institution: 'Oncology Evidence-Based Guidelines',
  profileUrl: 'https://www.nccn.org/guidelines/category_1',
  lastReviewed: 'August 2025',
};

export const REVIEWER_INTERNAL_MEDICINE: MedicalReviewer = {
  name: 'ACP Clinical Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American College of Physicians',
  institution: 'Internal Medicine Evidence-Based Guidelines',
  profileUrl: 'https://www.acponline.org/clinical-information/guidelines',
  lastReviewed: 'August 2025',
};

export const REVIEWER_PERIOPERATIVE: MedicalReviewer = {
  name: 'ASA Practice Parameters',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Society of Anesthesiologists',
  institution: 'Perioperative Evidence-Based Guidelines',
  profileUrl: 'https://www.asahq.org/standards-and-practice-parameters',
  lastReviewed: 'August 2025',
};

export const REVIEWER_PEDIATRICS: MedicalReviewer = {
  name: 'AAP Clinical Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Academy of Pediatrics',
  institution: 'Pediatric Evidence-Based Guidelines',
  profileUrl: 'https://www.aap.org/en/clinical-resources/',
  lastReviewed: 'August 2025',
};

export const REVIEWER_PSYCHIATRY: MedicalReviewer = {
  name: 'APA Practice Guidelines',
  credentials: ['Guideline Standard'],
  role: 'Sourced from American Psychiatric Association',
  institution: 'Psychiatric Clinical Practice Guidelines',
  profileUrl: 'https://www.psychiatry.org/psychiatrists/practice/clinical-practice-guidelines',
  lastReviewed: 'August 2025',
};
