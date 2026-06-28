---
name: accessibility-a11y
description: Audit and implement WCAG 2.1 AA accessibility standards across web components. Ensures visible keyboard focus rings, proper ARIA attributes, semantic HTML tags, sufficient contrast ratios, and screen reader compatibility for acute medical/clinical environments.
---

# Accessibility (a11y) & Clinical Readability Standards

Medical software must be accessible under high-stress, fast-paced clinical conditions (ER, ICU, operating rooms) and comply with strict accessibility standards.

## 1. Keyboard Navigation & Focus Indicators
- **Visible Focus Rings:** Every interactive element (`<button>`, `<a>`, `<input>`, `<details>`) must display a clear keyboard focus outline (e.g., `focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2`). Never remove outlines without replacing them.
- **Logical Tab Order:** Ensure DOM order matches visual layout so keyboard users can navigate calculators sequentially.

## 2. Semantic HTML & ARIA Attributes
- **Semantic Structure:** Use `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, and `<aside>` instead of generic `<div>` soup.
- **Form Labels:** Every input element must have an associated `<label>` or explicit `aria-label` / `aria-labelledby`.
- **Expandable States:** Accordions and dropdowns must use `<details>`/`<summary>` or toggle appropriate `aria-expanded` attributes.

## 3. High Contrast & Visual Clarity
- **Contrast Ratios:** Text must maintain at least a 4.5:1 contrast ratio against background colors (WCAG AA). Avoid light gray text (`text-gray-400`) on white or colored backgrounds for critical clinical warnings.
- **Color Independence:** Never use color alone to convey clinical alerts. Pair color cues (Red/Amber/Green) with explicit text labels ("High Risk", "Warning") or clear icons (`<AlertTriangle />`).
