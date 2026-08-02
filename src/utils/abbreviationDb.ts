export interface Abbreviation {
  term: string;
  en: string;
  fr: string;
  category: string;
}

export const ABBREVIATIONS_DB: Abbreviation[] = [
  // Cardiology
  { term: "ACS", en: "Acute Coronary Syndrome", fr: "Syndrome Coronarien Aigu (SCA)", category: "Cardiology" },
  { term: "AFib", en: "Atrial Fibrillation", fr: "Fibrillation Atriale (FA)", category: "Cardiology" },
  { term: "CABG", en: "Coronary Artery Bypass Grafting", fr: "Pontage Aorto-Coronarien (PAC)", category: "Cardiology" },
  { term: "CAD", en: "Coronary Artery Disease", fr: "Maladie Coronarienne", category: "Cardiology" },
  { term: "CHF", en: "Congestive Heart Failure", fr: "Insuffisance Cardiaque Congestive", category: "Cardiology" },
  { term: "CVP", en: "Central Venous Pressure", fr: "Pression Veineuse Centrale (PVC)", category: "Cardiology" },
  { term: "ECG", en: "Electrocardiogram", fr: "Électrocardiogramme (ECG)", category: "Cardiology" },
  { term: "LVEF", en: "Left Ventricular Ejection Fraction", fr: "Fraction d'Éjection Ventriculaire Gauche (FEVG)", category: "Cardiology" },
  { term: "MAP", en: "Mean Arterial Pressure", fr: "Pression Artérielle Moyenne (PAM)", category: "Cardiology" },
  { term: "STEMI", en: "ST-Elevation Myocardial Infarction", fr: "Infarctus du Myocarde avec Sus-décalage du Segment ST", category: "Cardiology" },
  
  // Pulmonology
  { term: "ARDS", en: "Acute Respiratory Distress Syndrome", fr: "Syndrome de Détresse Respiratoire Aiguë (SDRA)", category: "Pulmonology" },
  { term: "BIPAP", en: "Bilevel Positive Airway Pressure", fr: "Ventilation en Pression Positive Continue à Deux Niveaux", category: "Pulmonology" },
  { term: "COPD", en: "Chronic Obstructive Pulmonary Disease", fr: "Bronchopneumopathie Chronique Obstructive (BPCO)", category: "Pulmonology" },
  { term: "CPAP", en: "Continuous Positive Airway Pressure", fr: "Pression Positive Continue (PPC)", category: "Pulmonology" },
  { term: "ETT", en: "Endotracheal Tube", fr: "Sonde d'Intubation Trachéale", category: "Pulmonology" },
  { term: "FiO2", en: "Fraction of Inspired Oxygen", fr: "Fraction Inspirée en Oxygène (FiO2)", category: "Pulmonology" },
  { term: "PEEP", en: "Positive End-Expiratory Pressure", fr: "Pression Expiratoire Positive (PEP)", category: "Pulmonology" },
  { term: "PE", en: "Pulmonary Embolism", fr: "Embolie Pulmonaire (EP)", category: "Pulmonology" },
  { term: "VAP", en: "Ventilator-Associated Pneumonia", fr: "Pneumonie Acquise sous Ventilation Mécanique (PAVM)", category: "Pulmonology" },
  
  // Neurology
  { term: "CPP", en: "Cerebral Perfusion Pressure", fr: "Pression de Perfusion Cérébrale (PPC)", category: "Neurology" },
  { term: "CVA", en: "Cerebrovascular Accident (Stroke)", fr: "Accident Vasculaire Cérébral (AVC)", category: "Neurology" },
  { term: "EEG", en: "Electroencephalogram", fr: "Électroencéphalogramme (EEG)", category: "Neurology" },
  { term: "EVD", en: "External Ventricular Drain", fr: "Dérivation Ventriculaire Externe (DVE)", category: "Neurology" },
  { term: "GCS", en: "Glasgow Coma Scale", fr: "Échelle de Glasgow", category: "Neurology" },
  { term: "ICP", en: "Intracranial Pressure", fr: "Pression Intracrânienne (PIC)", category: "Neurology" },
  { term: "SAH", en: "Subarachnoid Hemorrhage", fr: "Hémorragie Méningée", category: "Neurology" },
  { term: "TBI", en: "Traumatic Brain Injury", fr: "Traumatisme Crânien (TC)", category: "Neurology" },
  { term: "TIA", en: "Transient Ischemic Attack", fr: "Accident Ischémique Transitoire (AIT)", category: "Neurology" },

  // Nephrology
  { term: "AKI", en: "Acute Kidney Injury", fr: "Insuffisance Rénale Aiguë (IRA)", category: "Nephrology" },
  { term: "CKD", en: "Chronic Kidney Disease", fr: "Insuffisance Rénale Chronique (IRC)", category: "Nephrology" },
  { term: "CRRT", en: "Continuous Renal Replacement Therapy", fr: "Épuration Extra-rénale Continue", category: "Nephrology" },
  { term: "ESRD", en: "End-Stage Renal Disease", fr: "Insuffisance Rénale Terminale", category: "Nephrology" },
  { term: "HD", en: "Hemodialysis", fr: "Hémodialyse", category: "Nephrology" },

  // Infectious Disease / Sepsis
  { term: "SIRS", en: "Systemic Inflammatory Response Syndrome", fr: "Syndrome de Réponse Inflammatoire Systémique (SRIS)", category: "Infectious Disease" },
  { term: "VRE", en: "Vancomycin-Resistant Enterococcus", fr: "Entérocoque Résistant à la Vancomycine (ERV)", category: "Infectious Disease" },
  { term: "MRSA", en: "Methicillin-Resistant Staphylococcus Aureus", fr: "Staphylocoque Doré Résistant à la Méticilline (SARM)", category: "Infectious Disease" },
  { term: "CRBSI", en: "Catheter-Related Bloodstream Infection", fr: "Infection Liée au Cathéter (ILC)", category: "Infectious Disease" },
  { term: "UTI", en: "Urinary Tract Infection", fr: "Infection du Tractus Urinaire (Infection Urinaire)", category: "Infectious Disease" },

  // Gastroenterology
  { term: "GI", en: "Gastrointestinal", fr: "Gastro-intestinal", category: "Gastroenterology" },
  { term: "UGIB", en: "Upper Gastrointestinal Bleeding", fr: "Hémorragie Digestive Haute", category: "Gastroenterology" },
  { term: "NGT", en: "Nasogastric Tube", fr: "Sonde Nasogastrique (SNG)", category: "Gastroenterology" },
  { term: "TPN", en: "Total Parenteral Nutrition", fr: "Nutrition Parentérale Totale (NPT)", category: "Gastroenterology" },

  // General / Emergency
  { term: "ABG", en: "Arterial Blood Gas", fr: "Gaz du Sang Artériel (GDS)", category: "Emergency" },
  { term: "BLS", en: "Basic Life Support", fr: "Réanimation Cardiopulmonaire de Base", category: "Emergency" },
  { term: "ACLS", en: "Advanced Cardiovascular Life Support", fr: "Soins Cardiovasculaires Avancés en Réanimation", category: "Emergency" },
  { term: "CPR", en: "Cardiopulmonary Resuscitation", fr: "Réanimation Cardio-pulmonaire (RCP)", category: "Emergency" },
  { term: "DNR", en: "Do Not Resuscitate", fr: "Ne Pas Réanimer (NPR)", category: "Emergency" },
  { term: "FAST", en: "Focused Assessment with Sonography for Trauma", fr: "Échographie Ciblée pour les Traumatismes", category: "Emergency" },
  { term: "STAT", en: "Immediately (Statim)", fr: "Immédiatement (Urgent)", category: "Emergency" },
  
  // Endocrinology
  { term: "DKA", en: "Diabetic Ketoacidosis", fr: "Acidocétose Diabétique", category: "Endocrinology" },
  { term: "HHS", en: "Hyperosmolar Hyperglycemic State", fr: "Syndrome Hyperosmolaire Hyperglycémique", category: "Endocrinology" }
];
