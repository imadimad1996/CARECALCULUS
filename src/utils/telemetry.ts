/**
 * Telemetry wrapper for CareCalculus.
 * Used to track usage analytics without collecting PHI.
 */

import { LangCode } from '../types';

export function trackCalculatorUsage(calculatorId: string, language: LangCode, result?: string | number) {
  // We ensure no patient health information (PHI) is included. Only usage counts.
  console.info(`[Telemetry] Calculator Used: ${calculatorId} | Lang: ${language} | HasResult: ${result !== undefined}`);
  
  // Automatically send event to Google Analytics if available
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'calculator_used', {
      event_category: 'calculator',
      event_label: calculatorId,
      language: language,
      has_result: result !== undefined
    });
  }
}
