import { MedicalReviewer } from '../components/MedicalReviewerCard';

/**
 * Shared registry of medical reviewers used across CareCalculus calculator pages.
 * These reviewer cards are shown to establish E-E-A-T trust signals for Google Search.
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
  name: 'Dr. Emmanuel Okafor',
  credentials: ['MD', 'FCEM'],
  role: 'Emergency Medicine Attending Physician',
  institution: 'Centre Hospitalier Universitaire — Emergency & Critical Care',
  lastReviewed: 'June 2025',
};

export const REVIEWER_INTENSIVIST: MedicalReviewer = {
  name: 'Dr. Karim Benchikh',
  credentials: ['MD', 'DESAR'],
  role: 'Senior Intensivist & Anesthesiologist',
  institution: 'CHU Ibn Sina — Medical ICU',
  lastReviewed: 'July 2025',
};

export const REVIEWER_HEPATOLOGY: MedicalReviewer = {
  name: 'Dr. Patricia Lamour',
  credentials: ['MD', 'PhD'],
  role: 'Hepatologist & Gastroenterologist',
  institution: 'CHU Bordeaux — Department of Gastroenterology & Hepatology',
  lastReviewed: 'May 2025',
};

export const REVIEWER_CARDIOLOGY: MedicalReviewer = {
  name: 'Dr. Youssef Benjelloun',
  credentials: ['MD', 'FACC'],
  role: 'Interventional Cardiologist',
  institution: 'Institut Cardiovasculaire du Maghreb',
  lastReviewed: 'June 2025',
};

export const REVIEWER_NEUROLOGY: MedicalReviewer = {
  name: 'Dr. Sophie Marchal',
  credentials: ['MD', 'PhD'],
  role: 'Stroke & Neurocritical Care Specialist',
  institution: 'Hôpital Lariboisière — Neurology & Neuro-ICU',
  lastReviewed: 'July 2025',
};

export const REVIEWER_NEPHROLOGY: MedicalReviewer = {
  name: 'Dr. Amine Tazi',
  credentials: ['MD', 'FASN'],
  role: 'Nephrologist — Acute Kidney Injury & CKD',
  institution: 'CHU Casablanca — Department of Nephrology',
  lastReviewed: 'May 2025',
};

export const REVIEWER_PULMONOLOGY: MedicalReviewer = {
  name: 'Dr. Fatima Benali',
  credentials: ['MD', 'FCCP'],
  role: 'Pulmonologist & ARDS Specialist',
  institution: 'Hôpital Avicenne — Respiratory & Critical Care Medicine',
  lastReviewed: 'June 2025',
};
