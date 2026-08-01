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
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Emergency',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_INTENSIVIST: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Critical Care',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_HEPATOLOGY: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Hepatology',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_CARDIOLOGY: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Cardiology',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_NEUROLOGY: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Neurology',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_NEPHROLOGY: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Nephrology',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};

export const REVIEWER_PULMONOLOGY: MedicalReviewer = {
  name: 'CareCalculus Medical Editorial Team',
  credentials: ['Editorial Review'],
  role: 'Internal Editorial Review — Pulmonology',
  institution: 'CareCalculus Content Team',
  profileUrl: '/about',
  lastReviewed: 'August 2024',
};
