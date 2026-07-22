export type UnitSystem = 'Metric (SI)' | 'US';

/**
 * Common Unit Conversions for Medical Parameters
 */

// Weight: kg <-> lbs
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}
export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

// Height: cm <-> inches
export function cmToInches(cm: number): number {
  return cm / 2.54;
}
export function inchesToCm(inches: number): number {
  return inches * 2.54;
}

// Temperature: °C <-> °F
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}
export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

// Serum Creatinine: mg/dL <-> µmol/L (Factor: 88.4)
export function scrMgDlToUmolL(mgDl: number): number {
  return mgDl * 88.4;
}
export function scrUmolLToMgDl(umolL: number): number {
  return umolL / 88.4;
}

// Bilirubin: mg/dL <-> µmol/L (Factor: 17.1)
export function biliMgDlToUmolL(mgDl: number): number {
  return mgDl * 17.1;
}
export function biliUmolLToMgDl(umolL: number): number {
  return umolL / 17.1;
}

// Glucose: mg/dL <-> mmol/L (Factor: 18.0)
export function glucoseMgDlToMmolL(mgDl: number): number {
  return mgDl / 18.0;
}
export function glucoseMmolLToMgDl(mmolL: number): number {
  return mmolL * 18.0;
}

// BUN / Urea: mg/dL (BUN) <-> mmol/L (Urea) (Factor: 2.8)
export function bunToUrea(bunMgDl: number): number {
  return bunMgDl * 0.357; // mmol/L
}
export function ureaToBun(ureaMmolL: number): number {
  return ureaMmolL / 0.357; // mg/dL
}
