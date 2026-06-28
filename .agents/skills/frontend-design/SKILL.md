---
name: frontend-design
description: Create stunning, modern, production-grade frontend web interfaces. Emphasizes rich aesthetics, vibrant curated colors, glassmorphism, smooth gradients, engaging micro-animations, modern typography, and responsive mobile-first Tailwind CSS layouts. Use when building or refactoring visual UI components to wow the user.
---

# Frontend Design Mastery & Visual Excellence

When executing UI/UX tasks or creating new frontend interfaces, you MUST prioritize visual excellence that wows at first glance while preserving clean usability.

## Core Aesthetic Guidelines
1. **Curated Color Palettes:**
   - Avoid generic browser default colors (plain blue `#0000ff` or plain red `#ff0000`).
   - Use HSL-tailored palettes, rich slate/slate-950 dark themes, subtle gradients (e.g., `bg-gradient-to-br from-blue-600 to-indigo-700`), and clean translucent borders (`ring-1 ring-white/10`).
2. **Typography & Hierarchy:**
   - Use distinct weight contrasts (e.g., `text-4xl md:text-5xl font-extrabold tracking-tight`).
   - Subtitles should use balanced muted tones (`text-gray-500` or `text-slate-400`) with readable line height (`leading-relaxed`).
3. **Depth & Glassmorphism:**
   - Use modern elevation: `shadow-[0_8px_30px_rgb(0,0,0,0.06)]` or backdrop blurring (`backdrop-blur-md bg-white/80`).
   - Add ambient glow or accent blobs for hero sections to create depth without cluttering inputs.
4. **Interactive Micro-Animations:**
   - Elements must feel alive: use smooth transitions (`transition-all duration-200 ease-in-out`).
   - Interactive cards should subtly elevate on hover (`hover:-translate-y-0.5 hover:shadow-lg`).
   - Button press states (`active:scale-[0.98]`).
5. **Responsive & Thumb-Friendly:**
   - Design mobile-first. Ensure buttons and clickable targets are at least `44px` tall on touchscreen viewports.
   - Use flexible CSS grids (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6`).
