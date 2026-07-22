# CareCalculus Mobile Architectural Specification

This document details the software architecture, shared code strategy, data persistence models, and UI design system for the **CareCalculus Native Mobile Application** (Android & iOS).

---

## 1. Shared Calculation Core (`@carecalculus/core`)

To guarantee 100% mathematical consistency across Web and Native Mobile without code duplication:

```
CARECALCULUS MONOREPO
├── src/utils/math.ts        <-- Primary Validated Formulas (MAP, GCS, qSOFA, MELD, CKD-EPI...)
├── src/utils/pro.ts         <-- Pro Entitlement Expiration Logic
└── mobile/
    └── src/core/            <-- Imports directly from ../../../src/utils/math.ts
```

All 88+ formulas remain written in zero-dependency pure TypeScript functions. They execute synchronously on the JavaScript thread with 0ms latency and 0 network requests required.

---

## 2. Local Data Persistence Schema (Offline First & HIPAA Ready)

### A. Expo SQLite (Encrypted Local Shift Patient Queue)
Patient data stored during shifts (e.g. bed numbers, calculated MAP, GCS scores, notes) is stored exclusively on-device in local SQLite:

```sql
CREATE TABLE IF NOT EXISTS shift_queue (
  id TEXT PRIMARY KEY NOT NULL,
  bed_number TEXT NOT NULL,
  patient_initials TEXT,
  calculator_id TEXT NOT NULL,
  calculated_score REAL NOT NULL,
  interpretation TEXT NOT NULL,
  unit_standard TEXT NOT NULL, -- 'Metric (SI)' or 'US'
  timestamp INTEGER NOT NULL,
  notes TEXT
);
```

### B. React Native MMKV (Lightning-Fast Key-Value Storage)
Used for instant configuration and state hydration:

* `unit_standard`: `'Metric (SI)' | 'US'`
* `app_language`: `'en' | 'fr' | 'ar'`
* `pro_entitlement`: `{ isPro: boolean, expiresAt: number, planType: string }`
* `favorite_calculators`: `string[]` (Array of calculator IDs)

---

## 3. UI Design System & Touch Ergonomics

Following **UI-UX Pro Max** mobile guidelines (§281-372):

1. **Touch Targets**: Minimum `44x44pt` tap areas for all buttons, toggles, and input fields to prevent bedside accidental taps.
2. **Haptic Feedback**: Subtle haptic pulse (`ExpoHaptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`) when toggling units (SI / US) or completing a calculation.
3. **Contrast Ratios**: Body text $\ge 4.5:1$ contrast against surface background in both Light Mode (`#ffffff` / `#f8fafc`) and Dark Mode (`#0f172a` / `#1e293b`).
4. **Offline Indicator**: Ambient status banner automatically appears if device loses connection, reassuring the clinician that all 88+ score cards function 100% offline.
