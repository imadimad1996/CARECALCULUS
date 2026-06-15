/**
 * Telemetry wrapper for CareCalculus.
 * Used to track usage analytics without collecting PHI.
 */

import { LangCode } from '../types';

export function trackCalculatorUsage(calculatorId: string, language: LangCode, result?: string | number) {
  // In a real app, this would send an event to PostHog, Google Analytics, or a custom backend.
  // We ensure no patient health information (PHI) is included. Only usage counts.
  console.info(`[Telemetry] Calculator Used: ${calculatorId} | Lang: ${language} | HasResult: ${result !== undefined}`);
}
