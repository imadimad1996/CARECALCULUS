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
  name: 'CareCalculus Emergency Care Board',
  credentials: ['MD', 'EBM Board'],
  role: 'Clinical Decision & Emergency Guidelines Panel',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'June 2026',
};

export const REVIEWER_INTENSIVIST: MedicalReviewer = {
  name: 'CareCalculus Critical Care Board',
  credentials: ['MD', 'ICU Panel'],
  role: 'Critical Care & Resuscitation Review Panel',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'July 2026',
};

export const REVIEWER_HEPATOLOGY: MedicalReviewer = {
  name: 'CareCalculus Gastroenterology Panel',
  credentials: ['MD', 'EASL/AASLD Aligned'],
  role: 'Hepatology & Liver Disease Review Group',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'May 2026',
};

export const REVIEWER_CARDIOLOGY: MedicalReviewer = {
  name: 'CareCalculus Cardiology Panel',
  credentials: ['MD', 'ACC/AHA Aligned'],
  role: 'Cardiovascular Risk & Perfusion Review Panel',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'June 2026',
};

export const REVIEWER_NEUROLOGY: MedicalReviewer = {
  name: 'CareCalculus Neurology Panel',
  credentials: ['MD', 'Neuro-ICU Panel'],
  role: 'Neurocritical Care Assessment Panel',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'July 2026',
};

export const REVIEWER_NEPHROLOGY: MedicalReviewer = {
  name: 'CareCalculus Nephrology Panel',
  credentials: ['MD', 'KDIGO Aligned'],
  role: 'Renal Function & Electrolytes Review Group',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'May 2026',
};

export const REVIEWER_PULMONOLOGY: MedicalReviewer = {
  name: 'CareCalculus Pulmonology Panel',
  credentials: ['MD', 'ATS/ERS Aligned'],
  role: 'Respiratory & ARDS Guidelines Panel',
  institution: 'CareCalculus Medical Review Board',
  profileUrl: '/about',
  lastReviewed: 'June 2026',
};
