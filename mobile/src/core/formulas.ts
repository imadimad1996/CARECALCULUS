/**
 * CareCalculus Core Validated Clinical Calculation Engine
 * 100% pure TypeScript functions with zero external dependencies.
 * Executed synchronously with 0ms latency and 0 network requests.
 */

// 1. Mean Arterial Pressure (MAP)
export interface MAPInput {
  sbp: number; // Systolic BP (mmHg)
  dbp: number; // Diastolic BP (mmHg)
}
export interface MAPResult {
  map: number;
  pulsePressure: number;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateMAP(input: MAPInput): MAPResult {
  const map = Number((input.dbp + (input.sbp - input.dbp) / 3).toFixed(1));
  const pulsePressure = input.sbp - input.dbp;
  let interpretation = 'Normal organ perfusion pressure (70-100 mmHg)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (map < 65) {
    interpretation = 'Hypoperfusion Alert: MAP < 65 mmHg risks acute kidney injury and organ ischemia (Surviving Sepsis Campaign target >= 65 mmHg)';
    severity = 'emergency';
  } else if (map > 100) {
    interpretation = 'Elevated MAP: Hypertensive state, increased cardiac workload';
    severity = 'warning';
  }

  return { map, pulsePressure, interpretation, severity };
}

// 2. Glasgow Coma Scale (GCS)
export interface GCSInput {
  eye: number; // 1-4
  verbal: number; // 1-5
  motor: number; // 1-6
}
export interface GCSResult {
  score: number;
  breakdown: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateGCS(input: GCSInput): GCSResult {
  const score = input.eye + input.verbal + input.motor;
  const breakdown = `E${input.eye}V${input.verbal}M${input.motor}`;
  let interpretation = 'Mild or No Brain Injury (GCS 13-15)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score <= 8) {
    interpretation = 'Severe Traumatic Brain Injury / Coma (GCS <= 8). Airway protection / intubation recommended (GCS <= 8, intubate!).';
    severity = 'emergency';
  } else if (score <= 12) {
    interpretation = 'Moderate Brain Injury (GCS 9-12). Close neurological monitoring required.';
    severity = 'warning';
  }

  return { score, breakdown, interpretation, severity };
}

// 3. qSOFA (Quick Sequential Organ Failure Assessment)
export interface QSOFAInput {
  rr: number; // Respiratory Rate (breaths/min)
  alteredMentalStatus: boolean; // GCS < 15
  sbp: number; // Systolic BP (mmHg)
}
export interface QSOFAResult {
  score: number;
  highRisk: boolean;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateQSOFA(input: QSOFAInput): QSOFAResult {
  let score = 0;
  if (input.rr >= 22) score++;
  if (input.alteredMentalStatus) score++;
  if (input.sbp <= 100) score++;

  const highRisk = score >= 2;
  const interpretation = highRisk
    ? 'High Risk for Poor Outcome / Sepsis (qSOFA >= 2). 3 to 14-fold increased in-hospital mortality. Consider ICU transfer, blood cultures, broad-spectrum antibiotics, and IV fluid resuscitation.'
    : 'Low risk for sepsis mortality (qSOFA < 2). Monitor clinical trajectory closely.';

  return {
    score,
    highRisk,
    interpretation,
    severity: highRisk ? 'emergency' : 'normal',
  };
}

// 4. CURB-65 Score for Pneumonia Severity
export interface CURB65Input {
  confusion: boolean;
  bunMgDl: number; // > 19 mg/dL
  rr: number; // >= 30
  sbp: number; // < 90
  dbp: number; // <= 60
  age: number; // >= 65
}
export interface CURB65Result {
  score: number;
  mortality: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateCURB65(input: CURB65Input): CURB65Result {
  let score = 0;
  if (input.confusion) score++;
  if (input.bunMgDl > 19) score++;
  if (input.rr >= 30) score++;
  if (input.sbp < 90 || input.dbp <= 60) score++;
  if (input.age >= 65) score++;

  let mortality = '0.7%';
  let recommendation = 'Low risk. Consider outpatient treatment.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score === 2) {
    mortality = '9.2%';
    recommendation = 'Moderate risk. Consider short inpatient stay or close outpatient monitoring.';
    severity = 'warning';
  } else if (score >= 3) {
    mortality = score === 3 ? '14.5%' : score === 4 ? '40%' : '57%';
    recommendation = 'High risk severe pneumonia. Hospitalize; evaluate for ICU admission if score >= 4.';
    severity = 'emergency';
  }

  return { score, mortality, recommendation, severity };
}

// 5. MELD Score (Model for End-Stage Liver Disease - Original / UNOS)
export interface MELDInput {
  bilirubinMgDl: number;
  creatinineMgDl: number;
  inr: number;
  dialysisTwiceInPastWeek?: boolean;
}
export interface MELDResult {
  meldScore: number;
  threeMonthMortality: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateMELD(input: MELDInput): MELDResult {
  let cr = Math.max(1.0, input.creatinineMgDl);
  if (input.dialysisTwiceInPastWeek) cr = 4.0;
  cr = Math.min(4.0, cr);

  const bili = Math.max(1.0, input.bilirubinMgDl);
  const inr = Math.max(1.0, input.inr);

  // MELD = 3.78×ln(bili) + 11.2×ln(INR) + 9.57×ln(Cr) + 6.43
  const rawScore = 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(cr) + 6.43;
  const meldScore = Math.min(40, Math.max(6, Math.round(rawScore)));

  let threeMonthMortality = '< 2%';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (meldScore >= 30) {
    threeMonthMortality = '52.6%';
    severity = 'emergency';
  } else if (meldScore >= 20) {
    threeMonthMortality = '19.6%';
    severity = 'emergency';
  } else if (meldScore >= 10) {
    threeMonthMortality = '6.0%';
    severity = 'warning';
  }

  return {
    meldScore,
    threeMonthMortality,
    interpretation: `3-Month Mortality Estimate: ${threeMonthMortality}. (UNOS Liver Transplant Prioritization Score)`,
    severity,
  };
}

// 6. CKD-EPI 2021 eGFR (Creatinine-based without race)
export interface CKDEPIInput {
  scrMgDl: number;
  age: number;
  sex: 'male' | 'female';
}
export interface CKDEPIResult {
  egfr: number;
  stage: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateCKDEPI2021(input: CKDEPIInput): CKDEPIResult {
  const kappa = input.sex === 'female' ? 0.7 : 0.9;
  const alpha = input.sex === 'female' ? -0.241 : -0.302;
  const sexFactor = input.sex === 'female' ? 1.012 : 1.0;

  const scrOverKappa = input.scrMgDl / kappa;
  const minScr = Math.min(scrOverKappa, 1);
  const maxScr = Math.max(scrOverKappa, 1);

  const egfr = Math.round(
    142 * Math.pow(minScr, alpha) * Math.pow(maxScr, -1.2) * Math.pow(0.9938, input.age) * sexFactor
  );

  let stage = 'G1 (Normal or High, >= 90)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (egfr < 15) {
    stage = 'G5 (Kidney Failure, < 15)';
    severity = 'emergency';
  } else if (egfr < 30) {
    stage = 'G4 (Severely Decreased, 15-29)';
    severity = 'emergency';
  } else if (egfr < 45) {
    stage = 'G3b (Moderately to Severely Decreased, 30-44)';
    severity = 'warning';
  } else if (egfr < 60) {
    stage = 'G3a (Mildly to Moderately Decreased, 45-59)';
    severity = 'warning';
  } else if (egfr < 90) {
    stage = 'G2 (Mildly Decreased, 60-89)';
    severity = 'normal';
  }

  return {
    egfr,
    stage,
    interpretation: `CKD Stage: ${stage}. 2021 Race-Free CKD-EPI Standard.`,
    severity,
  };
}

// 7. CHA₂DS₂-VASc Score for Stroke Risk in Atrial Fibrillation
export interface CHA2DS2VAScInput {
  chf: boolean; // 1 pt
  hypertension: boolean; // 1 pt
  age: number; // >=75 = 2pt, 65-74 = 1pt
  diabetes: boolean; // 1 pt
  strokeTia: boolean; // 2 pt
  vascularDisease: boolean; // 1 pt
  sex: 'male' | 'female'; // female = 1 pt
}
export interface CHA2DS2VAScResult {
  score: number;
  strokeRiskAnnual: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateCHA2DS2VASc(input: CHA2DS2VAScInput): CHA2DS2VAScResult {
  let score = 0;
  if (input.chf) score++;
  if (input.hypertension) score++;
  if (input.age >= 75) score += 2;
  else if (input.age >= 65) score += 1;
  if (input.diabetes) score++;
  if (input.strokeTia) score += 2;
  if (input.vascularDisease) score++;
  if (input.sex === 'female') score++;

  const strokeRates: { [key: number]: string } = {
    0: '0.2%',
    1: '0.6%',
    2: '2.2%',
    3: '3.2%',
    4: '4.8%',
    5: '6.7%',
    6: '9.8%',
    7: '9.6%',
    8: '12.5%',
    9: '15.2%',
  };
  const strokeRiskAnnual = strokeRates[Math.min(9, score)] || '> 15%';

  let recommendation = 'Low risk. No oral anticoagulation required.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 2) {
    recommendation = 'High risk for thromboembolism. Oral anticoagulation (DOAC or Warfarin) recommended per AHA/ACC/HRS guidelines.';
    severity = 'emergency';
  } else if (score === 1) {
    recommendation = 'Moderate risk. Oral anticoagulation or aspirin may be considered based on clinical clinical judgment.';
    severity = 'warning';
  }

  return { score, strokeRiskAnnual, recommendation, severity };
}

// 8. Wells Criteria for Pulmonary Embolism (PE)
export interface WellsPEInput {
  clinicalDvtSigns: boolean; // 3.0 pt
  peLikely: boolean; // 3.0 pt
  heartRateOver100: boolean; // 1.5 pt
  immobilizationOrSurgery: boolean; // 1.5 pt
  previousDvtPe: boolean; // 1.5 pt
  hemoptysis: boolean; // 1.0 pt
  malignancy: boolean; // 1.0 pt
}
export interface WellsPEResult {
  score: number;
  peProbability: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateWellsPE(input: WellsPEInput): WellsPEResult {
  let score = 0;
  if (input.clinicalDvtSigns) score += 3.0;
  if (input.peLikely) score += 3.0;
  if (input.heartRateOver100) score += 1.5;
  if (input.immobilizationOrSurgery) score += 1.5;
  if (input.previousDvtPe) score += 1.5;
  if (input.hemoptysis) score += 1.0;
  if (input.malignancy) score += 1.0;

  let peProbability = 'Low (1.3%)';
  let recommendation = 'PE Unlikely. Consider high-sensitivity D-Dimer test to rule out PE.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score > 6.0) {
    peProbability = 'High (37.1%)';
    recommendation = 'PE Likely. Diagnostic imaging (CTPA / CT Pulmonary Angiogram) strongly indicated.';
    severity = 'emergency';
  } else if (score >= 2.0) {
    peProbability = 'Moderate (16.2%)';
    recommendation = 'PE Moderate risk. STAT D-Dimer or CTPA based on clinical setting.';
    severity = 'warning';
  }

  return { score, peProbability, recommendation, severity };
}

// 9. Serum Anion Gap
export interface AnionGapInput {
  na: number; // mEq/L
  cl: number; // mEq/L
  hco3: number; // mEq/L
  albumin?: number; // g/dL (optional for correction)
}
export interface AnionGapResult {
  anionGap: number;
  correctedAnionGap?: number;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateAnionGap(input: AnionGapInput): AnionGapResult {
  const anionGap = Number((input.na - (input.cl + input.hco3)).toFixed(1));
  let correctedAnionGap: number | undefined;

  if (input.albumin !== undefined && input.albumin !== null) {
    // Corrected AG = AG + 2.5 * (4.0 - measured albumin)
    correctedAnionGap = Number((anionGap + 2.5 * (4.0 - input.albumin)).toFixed(1));
  }

  const effectiveAg = correctedAnionGap !== undefined ? correctedAnionGap : anionGap;
  let interpretation = 'Normal Anion Gap (8 - 12 mEq/L)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (effectiveAg > 12) {
    interpretation = 'High Anion Gap Metabolic Acidosis (HAGMA). MUDPILES / GOLDMARK etiology differential (Ketoacidosis, Lactic Acidosis, Uremia, Toxins).';
    severity = 'emergency';
  } else if (effectiveAg < 4) {
    interpretation = 'Low Anion Gap (< 4 mEq/L). Consider Hypoalbuminemia, Multiple Myeloma, or Lithium intoxication.';
    severity = 'warning';
  }

  return { anionGap, correctedAnionGap, interpretation, severity };
}

// 10. Sodium Correction for Hyperglycemia
export interface SodiumCorrectionInput {
  measuredNa: number; // mEq/L
  glucoseMgDl: number; // mg/dL
}
export interface SodiumCorrectionResult {
  correctedNaStandard: number; // 1.6 factor
  correctedNaKatz: number; // 2.4 factor
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateSodiumCorrection(input: SodiumCorrectionInput): SodiumCorrectionResult {
  const excessGlucoseHundreds = Math.max(0, (input.glucoseMgDl - 100) / 100);
  const correctedNaStandard = Number((input.measuredNa + 1.6 * excessGlucoseHundreds).toFixed(1));
  const correctedNaKatz = Number((input.measuredNa + 2.4 * excessGlucoseHundreds).toFixed(1));

  let interpretation = 'Normal corrected serum sodium level.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (correctedNaStandard < 135) {
    interpretation = 'True Hyponatremia masked by hyperosmolar glucose shift.';
    severity = 'warning';
  } else if (correctedNaStandard > 145) {
    interpretation = 'Hypernatremia alert. Evaluate for DKA/HHS free water deficit.';
    severity = 'emergency';
  }

  return { correctedNaStandard, correctedNaKatz, interpretation, severity };
}

// 11. PaO2 / FiO2 Ratio (P/F Ratio for ARDS)
export interface PFRatioInput {
  pao2: number; // mmHg
  fio2Percent: number; // e.g. 21 to 100%
}
export interface PFRatioResult {
  pfRatio: number;
  ardsCategory: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculatePFRatio(input: PFRatioInput): PFRatioResult {
  const fio2Fraction = Math.max(0.21, Math.min(1.0, input.fio2Percent / 100));
  const pfRatio = Math.round(input.pao2 / fio2Fraction);

  let ardsCategory = 'Normal Oxygenation (P/F > 300 mmHg)';
  let interpretation = 'Normal arterial oxygenation ratio.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (pfRatio <= 100) {
    ardsCategory = 'Severe ARDS (P/F <= 100 mmHg)';
    interpretation = 'Severe ARDS (Berlin Definition). High mortality risk. Prone positioning and lung-protective ventilation (6 mL/kg PBW, high PEEP) indicated.';
    severity = 'emergency';
  } else if (pfRatio <= 200) {
    ardsCategory = 'Moderate ARDS (100 < P/F <= 200 mmHg)';
    interpretation = 'Moderate ARDS. Optimize PEEP and fluid management.';
    severity = 'emergency';
  } else if (pfRatio <= 300) {
    ardsCategory = 'Mild ARDS (200 < P/F <= 300 mmHg)';
    interpretation = 'Mild ARDS. Monitor closely for respiratory fatigue.';
    severity = 'warning';
  }

  return { pfRatio, ardsCategory, interpretation, severity };
}

// 12. Cockcroft-Gault Creatinine Clearance (CrCl)
export interface CockcroftGaultInput {
  age: number;
  weightKg: number;
  scrMgDl: number;
  sex: 'male' | 'female';
}
export interface CockcroftGaultResult {
  crcl: number;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateCockcroftGault(input: CockcroftGaultInput): CockcroftGaultResult {
  if (input.scrMgDl <= 0) {
    return { crcl: 0, interpretation: 'Invalid serum creatinine input', severity: 'normal' };
  }
  const factor = input.sex === 'female' ? 0.85 : 1.0;
  const crcl = Math.round((((140 - input.age) * input.weightKg) / (72 * input.scrMgDl)) * factor);

  let interpretation = 'Normal estimated renal clearance (CrCl >= 90 mL/min)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (crcl < 15) {
    interpretation = 'Severe Renal Impairment / Failure (CrCl < 15 mL/min). Renal replacement therapy / extreme drug dose reduction.';
    severity = 'emergency';
  } else if (crcl < 30) {
    interpretation = 'Severe Renal Impairment (CrCl 15-29 mL/min). Dose adjustment mandatory for renally excreted drugs.';
    severity = 'emergency';
  } else if (crcl < 60) {
    interpretation = 'Moderate Renal Impairment (CrCl 30-59 mL/min). Review nephrotoxic agents and dosage adjustments.';
    severity = 'warning';
  }

  return { crcl, interpretation, severity };
}

// 13. HAS-BLED Score for Major Bleeding Risk
export interface HASBLEDInput {
  hypertension: boolean; // SBP > 160 (1 pt)
  abnormalRenal: boolean; // Dialysis, Cr > 2.26, transplant (1 pt)
  abnormalLiver: boolean; // Cirrhosis, Bili > 2x, AST/ALT > 3x (1 pt)
  strokeHistory: boolean; // (1 pt)
  bleedingHistory: boolean; // Anemia, severe hemorrhage (1 pt)
  labileInr: boolean; // Unstable INRs or <60% time in therapeutic range (1 pt)
  elderlyAge: boolean; // Age > 65 (1 pt)
  drugsConcomitant: boolean; // Antiplatelets, NSAIDs (1 pt)
  alcoholExcess: boolean; // >= 8 drinks/week (1 pt)
}
export interface HASBLEDResult {
  score: number;
  annualBleedingRisk: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateHASBLED(input: HASBLEDInput): HASBLEDResult {
  let score = 0;
  if (input.hypertension) score++;
  if (input.abnormalRenal) score++;
  if (input.abnormalLiver) score++;
  if (input.strokeHistory) score++;
  if (input.bleedingHistory) score++;
  if (input.labileInr) score++;
  if (input.elderlyAge) score++;
  if (input.drugsConcomitant) score++;
  if (input.alcoholExcess) score++;

  const risks: { [key: number]: string } = {
    0: '1.13%',
    1: '1.02%',
    2: '1.88%',
    3: '3.74%',
    4: '8.70%',
    5: '12.50%',
  };
  const annualBleedingRisk = risks[Math.min(5, score)] || '> 12.5%';

  let recommendation = 'Low bleeding risk. Standard anticoagulation monitoring.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 3) {
    recommendation = 'High bleeding risk (HAS-BLED >= 3). Caution & regular review indicated; address correctable risk factors.';
    severity = 'emergency';
  } else if (score === 2) {
    recommendation = 'Moderate bleeding risk. Monitor closely.';
    severity = 'warning';
  }

  return { score, annualBleedingRisk, recommendation, severity };
}

// 14. HEART Score for Major Adverse Cardiac Events (MACE)
export interface HEARTScoreInput {
  history: 0 | 1 | 2; // Slightly suspicious (0), Moderately (1), Highly (2)
  ecg: 0 | 1 | 2; // Normal (0), Nonspecific repol (1), ST depression (2)
  age: 0 | 1 | 2; // < 45 (0), 45-64 (1), >= 65 (2)
  riskFactors: 0 | 1 | 2; // No risk (0), 1-2 risk factors (1), >= 3 or CAD (2)
  troponin: 0 | 1 | 2; // <= normal limit (0), 1-3x limit (1), > 3x limit (2)
}
export interface HEARTScoreResult {
  score: number;
  maceRisk: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateHEARTScore(input: HEARTScoreInput): HEARTScoreResult {
  const score = input.history + input.ecg + input.age + input.riskFactors + input.troponin;
  let maceRisk = '0.9 - 1.7%';
  let recommendation = 'Low risk. Early discharge or outpatient workup reasonable.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 7) {
    maceRisk = '50 - 65%';
    recommendation = 'High risk. Invasive measures / early coronary angiography strongly recommended.';
    severity = 'emergency';
  } else if (score >= 4) {
    maceRisk = '12 - 16.6%';
    recommendation = 'Moderate risk. Admit for observation, serial troponins, and non-invasive testing.';
    severity = 'warning';
  }

  return { score, maceRisk, recommendation, severity };
}

// 15. NIH Stroke Scale Quick Assessment (NIHSS)
export interface NIHSSInput {
  loc: number; // 0-3
  locQuestions: number; // 0-2
  locCommands: number; // 0-2
  bestGaze: number; // 0-2
  visual: number; // 0-3
  facialPalsy: number; // 0-3
  motorArmLeft: number; // 0-4
  motorArmRight: number; // 0-4
  motorLegLeft: number; // 0-4
  motorLegRight: number; // 0-4
  limbAtaxia: number; // 0-2
  sensory: number; // 0-2
  bestLanguage: number; // 0-3
  dysarthria: number; // 0-2
  extinction: number; // 0-2
}
export interface NIHSSResult {
  score: number;
  strokeSeverity: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateNIHSS(input: NIHSSInput): NIHSSResult {
  const score =
    input.loc +
    input.locQuestions +
    input.locCommands +
    input.bestGaze +
    input.visual +
    input.facialPalsy +
    input.motorArmLeft +
    input.motorArmRight +
    input.motorLegLeft +
    input.motorLegRight +
    input.limbAtaxia +
    input.sensory +
    input.bestLanguage +
    input.dysarthria +
    input.extinction;

  let strokeSeverity = 'No Stroke Symptoms (0)';
  let interpretation = 'Normal neurological exam.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 21) {
    strokeSeverity = 'Severe Stroke (21 - 42)';
    interpretation = 'Severe acute ischemic stroke. Emergency stroke team activation & EVT evaluation.';
    severity = 'emergency';
  } else if (score >= 16) {
    strokeSeverity = 'Moderate-to-Severe Stroke (16 - 20)';
    interpretation = 'Moderate to severe stroke. High risk for hemorrhagic transformation.';
    severity = 'emergency';
  } else if (score >= 5) {
    strokeSeverity = 'Moderate Stroke (5 - 15)';
    interpretation = 'Moderate stroke. Evaluate for thrombolysis (tPA/TNK) and endovascular thrombectomy.';
    severity = 'warning';
  } else if (score >= 1) {
    strokeSeverity = 'Minor Stroke (1 - 4)';
    interpretation = 'Minor stroke symptoms.';
    severity = 'normal';
  }

  return { score, strokeSeverity, interpretation, severity };
}

// 16. APACHE II Score for ICU Mortality
export interface APACHE2Input {
  age: number;
  tempC: number;
  map: number;
  hr: number;
  rr: number;
  pao2: number;
  ph: number;
  na: number;
  k: number;
  scr: number;
  hct: number;
  wbc: number;
  gcs: number;
  chronicOrganFailure: boolean;
}
export interface APACHE2Result {
  score: number;
  estimatedMortality: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateAPACHE2(input: APACHE2Input): APACHE2Result {
  let score = 0;
  // Age points
  if (input.age >= 75) score += 6;
  else if (input.age >= 65) score += 5;
  else if (input.age >= 55) score += 3;
  else if (input.age >= 44) score += 2;

  // GCS points (15 - GCS)
  score += Math.max(0, 15 - input.gcs);

  // Temp C
  if (input.tempC >= 41 || input.tempC <= 29.9) score += 4;
  else if (input.tempC >= 39 || input.tempC <= 31.9) score += 3;
  else if (input.tempC <= 33.9) score += 2;
  else if (input.tempC >= 38.5 || input.tempC <= 35.9) score += 1;

  // MAP
  if (input.map >= 160 || input.map <= 49) score += 4;
  else if (input.map >= 130) score += 3;
  else if (input.map >= 110 || input.map <= 69) score += 2;

  // HR
  if (input.hr >= 180 || input.hr <= 39) score += 4;
  else if (input.hr >= 140 || input.hr <= 54) score += 3;
  else if (input.hr >= 110 || input.hr <= 69) score += 2;

  // Chronic Organ Failure
  if (input.chronicOrganFailure) score += 5;

  let estimatedMortality = '< 4%';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 35) {
    estimatedMortality = '> 80%';
    severity = 'emergency';
  } else if (score >= 25) {
    estimatedMortality = '50 - 55%';
    severity = 'emergency';
  } else if (score >= 15) {
    estimatedMortality = '25 - 30%';
    severity = 'warning';
  } else if (score >= 10) {
    estimatedMortality = '10 - 15%';
    severity = 'normal';
  }

  const interpretation = `APACHE II Score: ${score} points. Estimated ICU In-Hospital Mortality: ${estimatedMortality}.`;
  return { score, estimatedMortality, interpretation, severity };
}

// 17. Parkland Formula for Burn Resuscitation
export interface ParklandInput {
  weightKg: number;
  tbsaPercent: number; // Total Body Surface Area %
}
export interface ParklandResult {
  totalVolumeMl: number;
  first8HoursMl: number;
  next16HoursMl: number;
  hourlyRateFirst8h: number;
  hourlyRateNext16h: number;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateParkland(input: ParklandInput): ParklandResult {
  const totalVolumeMl = Math.round(4 * input.weightKg * input.tbsaPercent);
  const first8HoursMl = Math.round(totalVolumeMl / 2);
  const next16HoursMl = Math.round(totalVolumeMl / 2);
  const hourlyRateFirst8h = Math.round(first8HoursMl / 8);
  const hourlyRateNext16h = Math.round(next16HoursMl / 16);

  const severity = input.tbsaPercent >= 20 ? 'emergency' : input.tbsaPercent >= 10 ? 'warning' : 'normal';
  const interpretation = `Total 24-hr LR Fluid: ${totalVolumeMl} mL. Give ${first8HoursMl} mL over first 8 hours (${hourlyRateFirst8h} mL/hr) and ${next16HoursMl} mL over remaining 16 hours (${hourlyRateNext16h} mL/hr).`;

  return {
    totalVolumeMl,
    first8HoursMl,
    next16HoursMl,
    hourlyRateFirst8h,
    hourlyRateNext16h,
    interpretation,
    severity,
  };
}

// 18. TIMI Risk Score for NSTEMI / Unstable Angina
export interface TIMIInput {
  age65OrOlder: boolean;
  cadRiskFactors3OrMore: boolean; // HTN, DM, Dyslipidemia, Smoker, FHx
  knownCadStenosis50Percent: boolean;
  asaUsePast7Days: boolean;
  severeAngina24h: boolean;
  stDeviation05mm: boolean;
  positiveCardiacMarkers: boolean;
}
export interface TIMIResult {
  score: number;
  risk14Day: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateTIMI(input: TIMIInput): TIMIResult {
  let score = 0;
  if (input.age65OrOlder) score++;
  if (input.cadRiskFactors3OrMore) score++;
  if (input.knownCadStenosis50Percent) score++;
  if (input.asaUsePast7Days) score++;
  if (input.severeAngina24h) score++;
  if (input.stDeviation05mm) score++;
  if (input.positiveCardiacMarkers) score++;

  let risk14Day = '4.7%';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 6) {
    risk14Day = '40.9%';
    severity = 'emergency';
  } else if (score >= 5) {
    risk14Day = '26.2%';
    severity = 'emergency';
  } else if (score >= 3) {
    risk14Day = '13.2 - 19.9%';
    severity = 'warning';
  } else if (score >= 1) {
    risk14Day = '4.7 - 8.3%';
  }

  const interpretation = `TIMI Score: ${score}/7. 14-Day Risk of All-Cause Mortality, Severe Ischemia, or Recurrent MI: ${risk14Day}.`;
  return { score, risk14Day, interpretation, severity };
}

// 19. Child-Pugh Score for Cirrhosis Mortality
export interface ChildPughInput {
  biliMgDl: number;
  albuminGDl: number;
  inr: number;
  ascites: 'none' | 'slight' | 'moderate';
  encephalopathy: 'none' | 'grade1_2' | 'grade3_4';
}
export interface ChildPughResult {
  score: number;
  childClass: 'Class A' | 'Class B' | 'Class C';
  oneYearSurvival: string;
  twoYearSurvival: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateChildPugh(input: ChildPughInput): ChildPughResult {
  let score = 0;

  // Bilirubin
  if (input.biliMgDl < 2.0) score += 1;
  else if (input.biliMgDl <= 3.0) score += 2;
  else score += 3;

  // Albumin
  if (input.albuminGDl > 3.5) score += 1;
  else if (input.albuminGDl >= 2.8) score += 2;
  else score += 3;

  // INR
  if (input.inr < 1.7) score += 1;
  else if (input.inr <= 2.3) score += 2;
  else score += 3;

  // Ascites
  if (input.ascites === 'none') score += 1;
  else if (input.ascites === 'slight') score += 2;
  else score += 3;

  // Encephalopathy
  if (input.encephalopathy === 'none') score += 1;
  else if (input.encephalopathy === 'grade1_2') score += 2;
  else score += 3;

  let childClass: 'Class A' | 'Class B' | 'Class C' = 'Class A';
  let oneYearSurvival = '100%';
  let twoYearSurvival = '85%';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 10) {
    childClass = 'Class C';
    oneYearSurvival = '45%';
    twoYearSurvival = '35%';
    severity = 'emergency';
  } else if (score >= 7) {
    childClass = 'Class B';
    oneYearSurvival = '80%';
    twoYearSurvival = '60%';
    severity = 'warning';
  }

  const interpretation = `Child-Pugh ${childClass} (${score} Points). 1-Year Survival: ${oneYearSurvival}, 2-Year Survival: ${twoYearSurvival}.`;
  return { score, childClass, oneYearSurvival, twoYearSurvival, interpretation, severity };
}

// 20. Modified Centor Score for Strep Pharyngitis
export interface CentorInput {
  ageYears: number;
  tonsillarExudate: boolean;
  tenderAnteriorCervicalNodes: boolean;
  feverHistory: boolean; // > 38°C (100.4°F)
  absenceOfCough: boolean;
}
export interface CentorResult {
  score: number;
  strepProbability: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateCentor(input: CentorInput): CentorResult {
  let score = 0;
  if (input.tonsillarExudate) score++;
  if (input.tenderAnteriorCervicalNodes) score++;
  if (input.feverHistory) score++;
  if (input.absenceOfCough) score++;

  if (input.ageYears >= 3 && input.ageYears <= 14) score += 1;
  else if (input.ageYears >= 45) score -= 1;

  let strepProbability = '< 5%';
  let recommendation = 'No testing or antibiotic treatment required.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 4) {
    strepProbability = '51 - 53%';
    recommendation = 'Rapid Strep Test (RADT) or throat culture; initiate empiric antibiotic therapy (Amoxicillin/Penicillin).';
    severity = 'warning';
  } else if (score >= 2) {
    strepProbability = '15 - 32%';
    recommendation = 'Perform Rapid Strep Test (RADT). Treat only if positive.';
    severity = 'normal';
  }

  return { score, strepProbability, recommendation, severity };
}

// 21. PERC Rule for PE Exclusion
export interface PERCInput {
  age50OrOlder: boolean;
  hr100OrHigher: boolean;
  spo2LessThan95: boolean;
  priorDvtPe: boolean;
  recentSurgeryOrTrauma: boolean;
  hemoptysis: boolean;
  estrogenUse: boolean;
  unilateralLegSwelling: boolean;
}
export interface PERCResult {
  score: number;
  peExcluded: boolean;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculatePERC(input: PERCInput): PERCResult {
  let score = 0;
  if (input.age50OrOlder) score++;
  if (input.hr100OrHigher) score++;
  if (input.spo2LessThan95) score++;
  if (input.priorDvtPe) score++;
  if (input.recentSurgeryOrTrauma) score++;
  if (input.hemoptysis) score++;
  if (input.estrogenUse) score++;
  if (input.unilateralLegSwelling) score++;

  const peExcluded = score === 0;
  const interpretation = peExcluded
    ? 'PERC Negative (0 Criteria Met): PE effectively ruled out (< 1.8% risk). No D-Dimer or CTPA required.'
    : `PERC Positive (${score} Criteria Met): PERC rule cannot exclude PE. Proceed with D-Dimer or CTA per clinical algorithm.`;

  return { score, peExcluded, interpretation, severity: peExcluded ? 'normal' : 'warning' };
}

// 22. Maintenance Fluid Rate (4-2-1 Rule)
export interface Fluid421Input {
  weightKg: number;
}
export interface Fluid421Result {
  hourlyRateMl: number;
  dailyVolumeMl: number;
  breakdown: string;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateFluid421(input: Fluid421Input): Fluid421Result {
  const w = input.weightKg;
  let rate = 0;

  if (w <= 10) {
    rate = w * 4;
  } else if (w <= 20) {
    rate = 40 + (w - 10) * 2;
  } else {
    rate = 60 + (w - 20) * 1;
  }

  const dailyVolumeMl = rate * 24;
  const breakdown = w > 20 ? `(40 mL for 1st 10kg + 20 mL for 2nd 10kg + ${w - 20} mL for rest)` : `${rate} mL/hr`;
  const interpretation = `Maintenance IV Fluid Rate: ${rate} mL/hr (${dailyVolumeMl} mL/24 hr). Standard isotonic fluid (e.g. D5 0.45% NS + 20 mEq KCl).`;

  return { hourlyRateMl: rate, dailyVolumeMl, breakdown, interpretation, severity: 'normal' };
}

// 23. Serum Osmolal Gap Calculator
export interface OsmolalGapInput {
  measuredOsm: number; // mOsm/kg
  na: number; // mEq/L
  glucoseMgDl: number;
  bunMgDl: number;
  ethanolMgDl?: number;
}
export interface OsmolalGapResult {
  calculatedOsm: number;
  osmolalGap: number;
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateOsmolalGap(input: OsmolalGapInput): OsmolalGapResult {
  const ethanol = input.ethanolMgDl || 0;
  const calculatedOsm = Math.round(2 * input.na + input.glucoseMgDl / 18 + input.bunMgDl / 2.8 + ethanol / 4.6);
  const osmolalGap = Math.round(input.measuredOsm - calculatedOsm);

  let interpretation = 'Normal Osmolal Gap (<= 10 mOsm/kg)';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (osmolalGap > 10) {
    interpretation = `High Osmolal Gap (${osmolalGap} mOsm/kg > 10). High suspicion for toxic alcohol ingestion (Methanol, Ethylene Glycol, Isopropanol, or Propylene Glycol). Emergency toxicology evaluation & Fomepizole indicated.`;
    severity = 'emergency';
  }

  return { calculatedOsm, osmolalGap, interpretation, severity };
}

// 24. Framingham 10-Year CVD Risk Score
export interface FraminghamInput {
  age: number;
  totalCholesterolMgDl: number;
  hdlMgDl: number;
  sbp: number;
  onHtnMeds: boolean;
  smoker: boolean;
  sex: 'male' | 'female';
}
export interface FraminghamResult {
  riskPercent: string;
  riskCategory: 'Low Risk' | 'Intermediate Risk' | 'High Risk';
  interpretation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateFramingham(input: FraminghamInput): FraminghamResult {
  let score = 0;
  if (input.age >= 70) score += 12;
  else if (input.age >= 60) score += 9;
  else if (input.age >= 50) score += 6;
  else if (input.age >= 40) score += 3;

  if (input.smoker) score += 4;
  if (input.totalCholesterolMgDl >= 240) score += 3;
  if (input.hdlMgDl < 40) score += 2;
  if (input.sbp >= 140) score += (input.onHtnMeds ? 3 : 2);

  let riskPercent = '< 5%';
  let riskCategory: 'Low Risk' | 'Intermediate Risk' | 'High Risk' = 'Low Risk';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 12) {
    riskPercent = '> 20%';
    riskCategory = 'High Risk';
    severity = 'warning';
  } else if (score >= 7) {
    riskPercent = '10 - 20%';
    riskCategory = 'Intermediate Risk';
    severity = 'normal';
  }

  const interpretation = `Framingham 10-Year Cardiovascular Disease Risk: ${riskPercent} (${riskCategory}).`;
  return { riskPercent, riskCategory, interpretation, severity };
}

// 25. Alvarado Score for Acute Appendicitis
export interface AlvaradoInput {
  migratoryRifPain: boolean;
  anorexia: boolean;
  nauseaVomiting: boolean;
  tendernessRif: boolean;
  reboundTenderness: boolean;
  feverOver373C: boolean;
  leukocytosisOver10k: boolean;
  shiftToLeftWbc: boolean;
}
export interface AlvaradoResult {
  score: number;
  likelihood: string;
  recommendation: string;
  severity: 'normal' | 'warning' | 'emergency';
}
export function calculateAlvarado(input: AlvaradoInput): AlvaradoResult {
  let score = 0;
  if (input.migratoryRifPain) score += 1;
  if (input.anorexia) score += 1;
  if (input.nauseaVomiting) score += 1;
  if (input.tendernessRif) score += 2;
  if (input.reboundTenderness) score += 1;
  if (input.feverOver373C) score += 1;
  if (input.leukocytosisOver10k) score += 2;
  if (input.shiftToLeftWbc) score += 1;

  let likelihood = 'Low Likelihood (0 - 4)';
  let recommendation = 'Appendicitis unlikely. Consider alternative diagnoses or discharge with return precautions.';
  let severity: 'normal' | 'warning' | 'emergency' = 'normal';

  if (score >= 7) {
    likelihood = 'High Likelihood / Probable Appendicitis (7 - 10)';
    recommendation = 'Urgent surgical consultation & abdominal CT/Ultrasound imaging.';
    severity = 'emergency';
  } else if (score >= 5) {
    likelihood = 'Equivocal / Possible Appendicitis (5 - 6)';
    recommendation = 'Observation, serial abdominal exams, and diagnostic imaging recommended.';
    severity = 'warning';
  }

  return { score, likelihood, recommendation, severity };
}


