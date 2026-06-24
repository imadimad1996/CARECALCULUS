export interface Abbreviation {
  term: string;
  en: string;
  fr: string;
  ar: string;
  category: string;
}

export const ABBREVIATIONS_DB: Abbreviation[] = [
  { term: "ARDS", en: "Acute Respiratory Distress Syndrome", fr: "Syndrome de Détresse Respiratoire Aiguë (SDRA)", ar: "متلازمة الضائقة التنفسية الحادة", category: "Pulmonology" },
  { term: "MAP", en: "Mean Arterial Pressure", fr: "Pression Artérielle Moyenne (PAM)", ar: "متوسط الضغط الشرياني", category: "Cardiology" },
  { term: "GCS", en: "Glasgow Coma Scale", fr: "Échelle de Glasgow", ar: "مقياس غلاسكو للغيبوبة", category: "Neurology" },
  { term: "DKA", en: "Diabetic Ketoacidosis", fr: "Acidocétose Diabétique", ar: "الحماض الكيتوني السكري", category: "Endocrinology" },
  { term: "CKD", en: "Chronic Kidney Disease", fr: "Insuffisance Rénale Chronique", ar: "المرض الكلوي المزمن", category: "Nephrology" },
  { term: "COPD", en: "Chronic Obstructive Pulmonary Disease", fr: "Bronchopneumopathie Chronique Obstructive (BPCO)", ar: "الانسداد الرئوي المزمن", category: "Pulmonology" },
  { term: "ECG", en: "Electrocardiogram", fr: "Électrocardiogramme (ECG)", ar: "تخطيط كهربائية القلب", category: "Cardiology" },
  { term: "ICP", en: "Intracranial Pressure", fr: "Pression Intracrânienne (PIC)", ar: "الضغط داخل الجمجمة", category: "Neurology" },
  { term: "AKI", en: "Acute Kidney Injury", fr: "Insuffisance Rénale Aiguë", ar: "القصور الكلوي الحاد", category: "Nephrology" },
  { term: "CPR", en: "Cardiopulmonary Resuscitation", fr: "Réanimation Cardio-pulmonaire (RCP)", ar: "الإنعاش القلبي الرئوي", category: "Emergency" }
];
