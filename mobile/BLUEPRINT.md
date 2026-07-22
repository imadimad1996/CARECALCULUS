# CareCalculus Mobile Master Blueprint (Android First -> iOS Cross-Platform)

## Executive Summary
CareCalculus Mobile brings 88+ validated clinical decision calculators, offline ICU emergency score cards, EHR DotPhrase generators, and shift patient queues natively to Android (Google Play Store) and iOS (Apple App Store). Built with **React Native (Expo SDK 51+)**, it shares 100% of pure medical calculation logic, formulas, unit conversions, and E-E-A-T references with the web application while leveraging native device hardware features (Offline SQLite, Haptics, Local Push Notifications, and Secure Storage).

---

## 1. Technical Stack & Architecture

### Core Tech Stack
* **Framework**: Expo React Native (TypeScript 5.x)
* **Navigation**: Expo Router v3 (File-based, Type-safe native routing)
* **UI & Design Tokens**: NativeWind v4 (Tailwind CSS for React Native) + React Native Reanimated 3 (60fps micro-animations) + Phosphor Icons
* **Calculation Core**: `@carecalculus/core` (Shared TS package housing all 88+ validated medical formulas)
* **Offline Database**: Expo SQLite (Local patient queue & calculation logs) + MMKV (Lightning-fast key-value state & user preferences)
* **State Management**: Zustand + React Query (TanStack Query v5)
* **Monetization**: RevenueCat (`react-native-purchases`) for Android Google Play Billing & iOS In-App Purchases (Syncing with Web PayPal/Firebase user entitlements)
* **Analytics & Crash Reporting**: Firebase Analytics + Sentry React Native

---

## 2. Directory Structure (`mobile/`)

```
mobile/
├── app/                        # Expo Router Pages & Navigation
│   ├── (auth)/                 # Login, Sign Up, Forgot Password
│   ├── (drawer)/               # Main App Shell (Sidebar & Tabs)
│   │   ├── (tabs)/
│   │   │   ├── index.tsx       # Home / Clinical Dashboard
│   │   │   ├── calculators.tsx # Calculator Catalog & Search
│   │   │   ├── shift-queue.tsx # Bedside Patient Queue
│   │   │   └── settings.tsx    # User Settings & Unit Standard (SI/US)
│   │   ├── calculator/
│   │   │   └── [id].tsx        # Interactive Calculator Screen
│   │   ├── ehr/
│   │   │   └── smart-paste.tsx # EHR DotPhrase Generator
│   │   └── pricing.tsx         # Pro Pass Native Paywall
│   ├── _layout.tsx             # Root Navigation Layout & Providers
│   └── +not-found.tsx          # 404 Screen
├── assets/                     # App Icons, Adaptive Icons, Splash Screen
│   ├── icon.png                # 1024x1024 Master Icon
│   ├── adaptive-icon.png       # Android Vector Foreground (432x432)
│   ├── splash.png              # Native Splash Screen (1242x2436)
│   └── favicon.png
├── src/
│   ├── components/             # Reusable Mobile UI Components
│   │   ├── ui/                 # Buttons, Cards, Inputs, Badges, Modals
│   │   ├── Header.tsx          # Top Bar with SI/US Switch & Pro Badge
│   │   ├── CalculatorInput.tsx # Touch-Optimized Numeric Pad & Sliders
│   │   └── ResultCard.tsx      # Clinical Interpretation & Reference Card
│   ├── core/                   # Medical Calculations Engine (Imported/Linked)
│   │   ├── formulas/           # MAP, GCS, qSOFA, MELD, CKD-EPI, etc.
│   │   └── units/              # Metric (SI) / US Unit Converters
│   ├── hooks/                  # Custom React Hooks (useProStatus, useGeoStandard)
│   ├── services/               # RevenueCat, Firebase, Expo Notifications
│   └── store/                  # Zustand Global Store (Unit System, Queue, User)
├── app.json                    # Expo Configuration (Android & iOS metadata)
├── tsconfig.json               # TypeScript Config
├── tailwind.config.js          # NativeWind Tailwind Design Tokens
└── package.json                # Dependencies & Build Scripts
```

---

## 3. 5-Phase Execution Roadmap (0 to Hero)

### Phase 1: Project Setup & Shared Core Linking
- Initialize Expo project with TypeScript template.
- Link core medical calculation engine (`src/utils/math.ts`, `src/utils/pro.ts`) from web to mobile.
- Set up NativeWind design tokens matching CareCalculus web brand (Teal `#0d9488`, Dark Slate `#0f172a`).

### Phase 2: Core UX & Calculator Engines
- Implement File-based Navigation (`app/(drawer)/(tabs)`).
- Build touch-optimized numeric keypads, toggle sliders, and unit switchers for top 15 ICU/ER score tools (MAP, GCS, qSOFA, CURB-65, P/F Ratio, Creatinine Clearance, MELD, Wells, CHA₂DS₂-VASc).
- Implement Instant Search & Specialty Filters (Cardiology, ICU, Nephrology, Pulmonology, etc.).

### Phase 3: Bedside Queue & Offline Persistence
- Implement MMKV for instant unit standard toggle (SI / US) and offline preference persistence.
- Implement Expo SQLite for local patient queue (`Shift Storage Drawer`), encrypted locally for HIPAA compliance.
- Build offline PWA / Native Service Worker fallback ensuring 100% functionality in hospital basement ICUs with zero cellular signal.

### Phase 4: EHR DotPhrase & Native Monetization
- Build Native Smart Paste EHR DotPhrase formatter with 1-click clipboard copy (`Clipboard.setStringAsync`).
- Integrate RevenueCat for Android In-App Billing (Google Play Purchases) & web entitlement sync via Firebase.
- Add Native Paywall UI with 30-day and 1-year Pro Pass options.

### Phase 5: Android Build & Play Store Deployment
- Configure `app.json` with Android Package `com.carecalculus.app`, permissions (Vibrate, Notifications), and Target SDK 34+.
- Generate Android App Bundle (`eas build --platform android --profile production`).
- Deploy to Google Play Console (Closed Testing -> Production) with ASO-optimized graphics, short description, and screenshot sets.

---

## 4. Android Google Play ASO & Compliance Checklist

- **Package Name**: `com.carecalculus.app`
- **Category**: Medical / Clinical Reference
- **Content Rating**: Everyone / Medical Reference (Peer-reviewed AHA, SRLF, ESC, NIH guidelines cited)
- **Target Android Version**: Android 14 (API Level 34) & backwards compatible to Android 8.0 (API Level 26).
- **Privacy & Security**: Zero remote transmission of patient health data. Local calculation execution & encrypted SQLite storage.
- **Offline First**: All 88+ formulas bundled natively inside the JS binary; 0 network latency required to calculate.
