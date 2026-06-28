---
name: agentic-ux
description: Design AI-native workbenches and clinical software interfaces focused on trust, transparency, human-in-the-loop verification, and user control. Use when building complex calculators, diagnostic decision support tools, exportable clinical reports, or interactive user interfaces.
---

# Agentic UX & High-Trust Clinical Interface Design

In medical software and AI co-pilot tools, the primary UX goal is **high-trust clarity**. The user must feel complete control and understand exact calculation logic instantly.

## 1. Transparency & Explainability
- **No Hidden Magic:** Always show the mathematical formula or clinical logic clearly (e.g., displaying exact point additions next to selected checkboxes).
- **Evidence & Guidelines:** Every calculation or recommendation must prominently display its scientific reference (e.g., ESC, AHA, KDIGO guidelines) with clickable publication citations where possible.
- **Confidence & Thresholds:** Clearly delineate risk categories with distinct visual indicators (e.g., Red for High Risk, Amber for Moderate, Emerald for Low Risk).

## 2. Human-in-the-Loop Control
- **Instant Override:** Users must be able to toggle inputs rapidly without page reloads or jarring layout shifts.
- **Reset & Recalculate:** Provide frictionless ways to reset complex forms or copy results instantly to the clinical clipboard.

## 3. Workflow Integration (Clinical Workbenches)
- **Exportable Summaries:** Ensure interfaces integrate clean export features (e.g., `ClinicalExportButton`) allowing doctors to generate structured EMR text or PDF summaries in one click.
- **Zero Input Interference:** Never allow monetization banners, sticky modals, or popups to cover calculation submit buttons or input selectors on mobile devices.
