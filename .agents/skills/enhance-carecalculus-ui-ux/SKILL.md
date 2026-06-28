---
name: enhance-carecalculus-ui-ux
description: Autonomous 2026 UI/UX visual and functional enhancement engine. Audits current UI/UX against cutting-edge standards and applies glassmorphism, micro-animations, ambient lighting, high-contrast accessibility, and clinical workbench ergonomics without breaking core functionality. Trigger when user says /enhance-carecalculus-ui-ux.
---

# Enhance CareCalculus 2026 UI/UX Master Engine

You are executing the **2026 UI/UX Enhancement Pipeline**. Your mission is to elevate CareCalculus pages into state-of-the-art, breathtaking clinical workbenches that feel alive, responsive, and ultra-premium while maintaining uncompromising medical clarity.

Follow these 4 phases sequentially on targeted pages or components.

---

## Phase 1: 2026 UI/UX & Accessibility Audit (`frontend-design`, `accessibility-a11y`)
1. **Inspect Target:** Scan the component or page layout.
2. **Identify UX Friction & Dullness:** Look for flat, lifeless buttons, generic borders (`border-gray-200`), lack of hover/active micro-animations, missing keyboard focus rings, or cluttered mobile layouts.
3. **Safety Checklist:** Ensure any planned visual upgrades preserve exact state variables, calculations, telemetry tracking, and ad banner persistence.

---

## Phase 2: 2026 Aesthetic & Animation Injection (`frontend-design`, `ui-styling`)
Inject modern design tokens and visual flair:
1. **Ambient Lighting & Glassmorphism:**
   - Wrap main calculator containers or hero banners in subtle ambient gradient backdrops (e.g., `relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white`).
   - Upgrade result sidebars to sleek glassmorphic panels (`backdrop-blur-xl bg-gray-900/95 ring-1 ring-white/10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)]`).
2. **Tactile Micro-Animations:**
   - Add responsive button mechanics: `hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ease-out`.
   - Selection cards should glow subtly when active (`ring-2 ring-blue-500 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 shadow-md`).
3. **Dynamic Score Polishing:**
   - Ensure calculated numbers transition smoothly and use tabular figures (`tabular-nums tracking-tighter`).

---

## Phase 3: High-Trust Clinical Ergonomics (`agentic-ux`)
1. **Clear Visual Hierarchy:**
   - Differentiate clinical recommendations with color-coded status badges featuring subtle pulsing indicators for critical alerts (`animate-pulse w-2 h-2 rounded-full bg-red-500`).
2. **Thumb-Zone Optimization:**
   - Ensure all mobile interactables have generous padding (`p-4` or `p-5`) and minimum `44px` touch targets.
3. **Zero Layout Shift:**
   - Ensure error borders and active selection rings do not shift DOM height or push down page elements.

---

## Phase 4: Verification & Build Assurance
1. **Run Production Build:** Execute `npm run build` using `run_command` to verify that all Tailwind classes and TypeScript types compile flawlessly.
2. **Autonomous Self-Healing:** Fix any styling conflicts or build errors immediately.
3. **Present Walkthrough:** Showcase the visual upgrades to the user.
