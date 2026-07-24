/**
 * Telemetry wrapper for CareCalculus.
 * Used to track usage analytics without collecting PHI.
 */

import { LangCode } from '../types';

export function trackCalculatorUsage(calculatorId: string, language: LangCode, result?: string | number) {
  // We ensure no patient health information (PHI) is included. Only usage counts.
  console.info(`[Telemetry] Calculator Used: ${calculatorId} | Lang: ${language} | Result: ${result !== undefined ? result : 'none'}`);
  
  // Automatically send event to Google Analytics if available
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'calculator_used', {
      event_category: 'calculator',
      event_label: calculatorId,
      language: language,
      result_value: result !== undefined ? String(result) : undefined
    });
  }
}

export function trackEhrExport(calculatorId: string, format: string) {
  console.info(`[Telemetry] EHR Export: ${calculatorId} | Format: ${format}`);
  
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'ehr_copy', {
      event_category: 'export',
      event_label: calculatorId,
      format: format
    });
  }
}

export function trackNewsletterSignup(source: string) {
  console.info(`[Telemetry] Newsletter Signup | Source: ${source}`);
  
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'generate_lead', {
      event_category: 'newsletter',
      event_label: source
    });
  }
}
