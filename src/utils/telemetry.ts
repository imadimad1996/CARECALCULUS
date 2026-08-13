/**
 * Telemetry wrapper for CareCalculus.
 * Used to track usage analytics without collecting PHI.
 */

import { LangCode } from '../types';
import { trackEvent } from './firebase';

export function trackCalculatorUsage(calculatorId: string, language: LangCode, result?: string | number) {
  // We ensure no patient health information (PHI) is included. Only usage counts.
  console.info(`[Telemetry] Calculator Used: ${calculatorId} | Lang: ${language} | Result: ${result !== undefined ? result : 'none'}`);
  
  trackEvent('calculator_used', {
    event_category: 'calculator',
    event_label: calculatorId,
    language: language,
    result_value: result !== undefined ? String(result) : undefined
  });
}

export function trackEhrExport(calculatorId: string, format: string) {
  console.info(`[Telemetry] EHR Export: ${calculatorId} | Format: ${format}`);
  
  trackEvent('ehr_copy', {
    event_category: 'export',
    event_label: calculatorId,
    format: format
  });
}

export function trackNewsletterSignup(source: string) {
  console.info(`[Telemetry] Newsletter Signup | Source: ${source}`);
  
  trackEvent('generate_lead', {
    event_category: 'newsletter',
    event_label: source
  });
}

export function trackPremiumGateView(featureName: string) {
  console.info(`[Telemetry] Premium Gate Viewed | Feature: ${featureName}`);
  trackEvent('premium_gate_view', {
    event_category: 'monetization',
    event_label: featureName
  });
}

export function trackPremiumUpgradeClick(featureName: string) {
  console.info(`[Telemetry] Premium Upgrade Clicked | Feature: ${featureName}`);
  trackEvent('premium_upgrade_click', {
    event_category: 'monetization',
    event_label: featureName
  });
}

export function trackCalculatorResult(calculatorId: string, score: number | string, interpretation: string, lang: string) {
  console.info(`[Telemetry] Calculator Result: ${calculatorId} | Score: ${score} | Lang: ${lang}`);
  trackEvent('calculator_result', {
    event_category: 'calculator',
    calculator_name: calculatorId,
    result_score: String(score),
    result_interpretation: interpretation,
    language: lang,
  });
}

export function trackPricingPageView(source: string) {
  trackEvent('view_item', {
    event_category: 'monetization',
    event_label: 'pricing_page',
    source,
  });
}

export function trackSearchConsoleClick(keyword: string, page: string) {
  trackEvent('search_click', {
    event_category: 'seo',
    keyword,
    page,
  });
}

