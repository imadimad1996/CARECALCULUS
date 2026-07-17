import fs from 'fs';
import path from 'path';

const FAQ_DB_PATH = path.resolve(process.cwd(), 'src/data/faqDb.json');

const existingDb = JSON.parse(fs.readFileSync(FAQ_DB_PATH, 'utf8'));

// New high-intent clinical Q&As to inject
const newQAs: Record<string, {question: string, answer: string}[]> = {
  "/wells-score": [
    {
      "question": "What is the difference between Wells' Criteria for DVT and PE?",
      "answer": "Wells' Criteria for Deep Vein Thrombosis (DVT) scores localized signs like unilateral calf swelling and collateral superficial veins, whereas Wells' Criteria for Pulmonary Embolism (PE) heavily weights systemic clinical signs, tachycardia, history of DVT/PE, and whether an alternative diagnosis is less likely."
    },
    {
      "question": "How do you interpret a Wells' DVT score of 2 or higher?",
      "answer": "A Wells' DVT score of 2 or higher indicates that DVT is clinically 'likely' (approximately 28% risk). The recommended clinical pathway is to obtain a proximal lower extremity ultrasound. For scores < 2 (DVT unlikely), a high-sensitivity D-Dimer test can be used to rule out DVT."
    },
    {
      "question": "Should a D-Dimer test be done before calculating Wells' Score?",
      "answer": "No. Guidelines recommend calculating the Wells' Score first (pre-test probability). D-Dimer has high sensitivity but low specificity; doing it first leads to unnecessary imaging. Calculate the Wells' Score first to determine if D-Dimer is appropriate (unlikely probability) or if direct imaging is needed (likely probability)."
    }
  ],
  "/cha2ds2-vasc": [
    {
      "question": "What does the CHA2DS2-VASc score estimate?",
      "answer": "The CHA2DS2-VASc score estimates the annual risk of ischemic stroke in patients with non-valvular atrial fibrillation (AF). It guides decisions regarding oral anticoagulation therapy (OAC) to prevent thromboembolic events."
    },
    {
      "question": "At what CHA2DS2-VASc score is anticoagulation recommended?",
      "answer": "Anticoagulation is generally recommended for a CHA2DS2-VASc score of ≥2 in males and ≥3 in females. For a score of 1 in males or 2 in females, anticoagulation should be considered based on individual risk-benefit discussion. A score of 0 (males) or 1 (females) does not require anticoagulation."
    },
    {
      "question": "How does female sex impact the CHA2DS2-VASc score calculation?",
      "answer": "Female sex is a modifier that adds 1 point to the score, reflecting a higher baseline stroke risk in females with atrial fibrillation. However, female sex alone (score of 1) in the absence of other risk factors does not warrant anticoagulation."
    }
  ],
  "/meld-score": [
    {
      "question": "What parameters are used to calculate the MELD Score?",
      "answer": "The Model for End-Stage Liver Disease (MELD) score is calculated using serum bilirubin, serum creatinine, International Normalized Ratio (INR), and serum sodium. It was updated to MELD-Na to improve predictive accuracy for waiting list mortality."
    },
    {
      "question": "What MELD score indicates the need for a liver transplant?",
      "answer": "Patients with a MELD score of 15 or higher are generally placed on the liver transplant waiting list, as the benefit of transplantation exceeds the procedural risk. Higher MELD scores indicate greater disease severity and receive higher priority on the list."
    },
    {
      "question": "How often is the MELD score recalculated for transplant patients?",
      "answer": "The frequency of MELD recalculation depends on its severity: MELD ≥25 is updated every 7 days; MELD 19-24 is updated every 30 days; MELD 11-18 is updated every 90 days; and MELD ≤10 is updated annually."
    }
  ],
  "/sofa-score": [
    {
      "question": "What are the six organ systems assessed by the SOFA score?",
      "answer": "The Sequential Organ Failure Assessment (SOFA) score evaluates: Respiratory (PaO2/FiO2 ratio), Cardiovascular (MAP or need for vasopressors), Renal (creatinine or urine output), Hepatic (bilirubin), Coagulation (platelets), and Neurological (Glasgow Coma Scale) systems."
    },
    {
      "question": "What is the clinical significance of a 2-point increase in the SOFA score?",
      "answer": "A 2-point or greater increase in the SOFA score in the presence of an infection defines sepsis under the Sepsis-3 consensus guidelines, correlating with an in-hospital mortality rate of approximately 10% or higher."
    },
    {
      "question": "Can the SOFA score predict mortality in the ICU?",
      "answer": "Yes. While initially designed to describe organ dysfunction severity over time, sequential calculation of the SOFA score is a strong predictor of ICU mortality. An increasing score during the first 96 hours of admission indicates a worsening clinical trajectory."
    }
  ],
  "/corrected-calcium": [
    {
      "question": "Why must serum calcium be corrected for albumin levels?",
      "answer": "Approximately 40-45% of calcium in blood is bound to proteins, primarily albumin. In cases of hypoalbuminemia, total serum calcium will appear falsely low, while the physiologically active ionized calcium remains normal. Correcting the calcium prevents misdiagnosis of hypocalcemia."
    },
    {
      "question": "What is the formula for corrected calcium?",
      "answer": "The standard Payne formula is: Corrected Calcium (mg/dL) = Measured Total Calcium (mg/dL) + 0.8 × (4.0 − Serum Albumin (g/dL)). If albumin is in g/L, use: Corrected Calcium = Total Calcium + 0.02 × (40 - Albumin)."
    },
    {
      "question": "When should ionized calcium be measured instead of using corrected calcium?",
      "answer": "In critically ill patients, severe acid-base disturbances, renal failure, or during major transfusions, the calcium-albumin binding affinity changes. Under these conditions, the corrected calcium calculation is unreliable, and ionized calcium should be measured directly."
    }
  ],
  "/mdrd-gfr": [
    {
      "question": "What is the difference between MDRD GFR and CKD-EPI GFR?",
      "answer": "The MDRD equation underestimates GFR in patients with normal or near-normal kidney function (GFR >60 mL/min/1.73m²). The CKD-EPI equation is more accurate across the entire range, especially for GFR >60, and is the preferred standard in current clinical guidelines."
    },
    {
      "question": "Why does the MDRD equation include age and sex?",
      "answer": "Glomerular filtration rate is heavily influenced by muscle mass, which generates creatinine. Age and sex serve as surrogate markers for average muscle mass (creatinine production rates decline with age and are lower in females)."
    }
  ],
  "/ckd-epi-gfr": [
    {
      "question": "What does a CKD-EPI GFR score of 45 indicate?",
      "answer": "A GFR of 45 mL/min/1.73m² indicates Stage 3a Chronic Kidney Disease (moderate reduction in GFR). If persistent for 3 months or more, it warrants clinical evaluation, monitoring of progression, cardiovascular risk assessment, and medication dose adjustment."
    },
    {
      "question": "Is the CKD-EPI equation reliable in acute kidney injury (AKI)?",
      "answer": "No. GFR estimation equations like CKD-EPI and MDRD assume a steady-state serum creatinine level. In AKI, creatinine levels fluctuate rapidly, making these equations highly inaccurate. In AKI, urine output and serial creatinine trends should guide management."
    }
  ]
};

// Merge new QAs into existing database
for (const [path, items] of Object.entries(newQAs)) {
  if (!existingDb[path]) {
    existingDb[path] = [];
  }
  
  // Prevent duplicate questions
  for (const item of items) {
    const exists = existingDb[path].some((x: any) => x.question.toLowerCase() === item.question.toLowerCase());
    if (!exists) {
      existingDb[path].push(item);
    }
  }
}

// Write back to file
fs.writeFileSync(FAQ_DB_PATH, JSON.stringify(existingDb, null, 2), 'utf8');
console.log(`Successfully expanded faqDb.json! Updated entries for ${Object.keys(newQAs).length} calculators.`);
