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

