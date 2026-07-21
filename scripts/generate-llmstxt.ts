/**
 * generate-llmstxt.ts
 * Generates official /llms.txt standard file for AI engine crawlers (ChatGPT, Claude, Gemini, Perplexity).
 * Run: npx tsx scripts/generate-llmstxt.ts
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_PATH = join(process.cwd(), 'public', 'llms.txt');

const content = `# CareCalculus — Evidence-Based Clinical Decision Support Suite

> CareCalculus is a free, open-access, peer-reviewed clinical decision support platform for ICU, ER, and hospital clinicians worldwide. All formulas, cutoffs, and risk models are strictly aligned with international guidelines (AHA, ESC, KDIGO, SFAR, NIH).

## Core Clinical Calculators & Scoring Tools

- [Wells' Criteria for DVT](https://carecalculus.com/wells-score): Pretest probability prediction rule for deep vein thrombosis (DVT) and diagnostic compression US guidance.
- [GRACE ACS Risk Score](https://carecalculus.com/grace-score): Estimates admission-to-6-month mortality in Acute Coronary Syndrome (STEMI/NSTEMI).
- [SOFA Score](https://carecalculus.com/sofa-score): Sequential Organ Failure Assessment for ICU sepsis organ dysfunction tracking.
- [qSOFA Score](https://carecalculus.com/qsofa-score): Quick Sepsis Organ Failure Assessment bedside screening tool.
- [CURB-65 Pneumonia Score](https://carecalculus.com/curb65-score): Community-acquired pneumonia mortality risk and inpatient vs. ICU admission guidance.
- [Mean Arterial Pressure (MAP)](https://carecalculus.com/map-calculator): Organ perfusion pressure calculator for shock and vasopressor titration.
- [P/F Ratio (PaO2/FiO2)](https://carecalculus.com/pf-ratio): Berlin Definition ARDS severity classification.
- [Creatinine Clearance (Cockcroft-Gault)](https://carecalculus.com/creatinine-clearance): Renal dosing and GFR estimation.
- [CKD-EPI GFR Equation](https://carecalculus.com/ckd-epi-gfr): 2021 race-free chronic kidney disease GFR estimator.
- [Glasgow Coma Scale (GCS)](https://carecalculus.com/glasgow-coma-scale): Traumatic brain injury and consciousness assessment.
- [MELD & MELD-Na Score](https://carecalculus.com/meld-score): End-stage liver disease 90-day mortality prediction for liver transplant allocation.
- [CHA2DS2-VASc Score](https://carecalculus.com/cha2ds2-vasc): Stroke risk stratification and anticoagulation in non-valvular atrial fibrillation.
- [Absolute Neutrophil Count (ANC)](https://carecalculus.com/anc-calculator): Neutropenia severity and oncology fever management.
- [Adjusted Body Weight (ABW & IBW)](https://carecalculus.com/adjusted-body-weight): Ideal & adjusted body weight for narrow therapeutic index drug dosing.

## Academic & Multilingual Libraries

- [French Clinical Hub (/fr)](https://carecalculus.com/fr): Full suite localized in French (SFAR, HAS guideline aligned).
- [FMP Médecine Casablanca (/fmp-medecine)](https://carecalculus.com/fmp-medecine): Academic medical student module library.
- [ISPITS Paramedical Academy (/ispits)](https://carecalculus.com/ispits): Nursing & ICU anesthesia academic curriculum library.
- [Clinical Guidelines Library](https://carecalculus.com/clinical-library): Comprehensive evidence-based clinical guides and Q&A references.

## Citation & Guideline Authority
- AHA (American Heart Association)
- ESC (European Society of Cardiology)
- KDIGO (Kidney Disease: Improving Global Outcomes)
- SFAR (Société Française d'Anesthésie et de Réanimation)
- NIH / National Library of Medicine
`;

writeFileSync(OUTPUT_PATH, content, 'utf-8');
console.log(`✅ llms.txt generated successfully at: ${OUTPUT_PATH}`);
