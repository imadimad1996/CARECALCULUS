export interface Abbreviation {
  term: string;
  en: string;
  fr: string;
  category: string;
}

export const ABBREVIATIONS_DB: Abbreviation[] = [
  { term: "ARDS", en: "Acute Respiratory Distress Syndrome", fr: "Syndrome de Détresse Respiratoire Aiguë (SDRA)", category: "Pulmonology" },
  { term: "MAP", en: "Mean Arterial Pressure", fr: "Pression Artérielle Moyenne (PAM)", category: "Cardiology" },
  { term: "GCS", en: "Glasgow Coma Scale", fr: "Échelle de Glasgow", category: "Neurology" },
  { term: "DKA", en: "Diabetic Ketoacidosis", fr: "Acidocétose Diabétique", category: "Endocrinology" },
  { term: "CKD", en: "Chronic Kidney Disease", fr: "Insuffisance Rénale Chronique", category: "Nephrology" },
  { term: "COPD", en: "Chronic Obstructive Pulmonary Disease", fr: "Bronchopneumopathie Chronique Obstructive (BPCO)", category: "Pulmonology" },
  { term: "ECG", en: "Electrocardiogram", fr: "Électrocardiogramme (ECG)", category: "Cardiology" },
  { term: "ICP", en: "Intracranial Pressure", fr: "Pression Intracrânienne (PIC)", category: "Neurology" },
  { term: "AKI", en: "Acute Kidney Injury", fr: "Insuffisance Rénale Aiguë", category: "Nephrology" },
  { term: "CPR", en: "Cardiopulmonary Resuscitation", fr: "Réanimation Cardio-pulmonaire (RCP)", category: "Emergency" }
];
