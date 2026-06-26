# CareCalculus UI/UX Implementation Plan

## Purpose

This document defines the redesign strategy for CareCalculus so the interface moves from a template-like, AI-generated look to a premium 2026 clinical product experience.

The goal is not decorative flair. The goal is a higher-trust, higher-clarity, more intentional interface that feels like a modern clinical operating system:

- fast to scan
- calm under pressure
- trustworthy enough for clinical use
- multilingual and RTL-safe
- responsive across phone, tablet, and desktop
- accessible by default

## Current State Summary

The current product already has strong functional coverage, but the visual system is fragmented.

### What is working

- The product has a clear utility: calculators, references, learning content, and navigation.
- Accessibility basics already exist: skip link, focus ring, language routing, RTL support.
- The product has a recognizable healthcare identity through the logo, iconography, and terminology.
- The app shell already supports a large route surface without collapsing.

### What is not working

- The interface relies on repeated rounded cards, blue-tinted surfaces, and mono-uppercase labels.
- The homepage feels like a stack of generated sections rather than one cohesive landing experience.
- Navigation is duplicated in too many places: sidebar, mobile header, search bar, keyword pills, content top bars.
- Typography is over-prescribed globally, which removes hierarchy and makes every page feel the same.
- Calculator pages are built one-by-one instead of sharing a stronger template system.
- Visual rhythm is inconsistent across pages: spacing, elevation, borders, and states vary too much.

### Root cause

The app currently uses component-level styling without a strong product-level design system.

That means:

- each page solves its own layout in isolation
- every card looks similar
- the UI lacks a strong information hierarchy
- the product feels functional but not designed

## Design Direction

### New product identity

Reframe CareCalculus as a:

- clinical decision cockpit
- multilingual medical utility platform
- trust-first, data-first, command-oriented product

Not as:

- a generic SaaS dashboard
- a landing page with decorative gradients
- a “generated” collection of cards

### Desired visual language

The new interface should feel:

- clinical
- premium
- precise
- calm
- high-information
- modern
- restrained

### Tone

The product should communicate:

- confidence, not hype
- clarity, not clutter
- sophistication, not ornament
- usefulness, not novelty

## Core Design Principles

### 1. One obvious primary action per screen

Each page should answer:

- what is the main action?
- where should the user look first?
- what should they do next?

If a page has 4 equally strong calls to action, it feels generated.

### 2. Information hierarchy before decoration

Use:

- size
- contrast
- spacing
- grouping
- progressive disclosure

before any decorative treatment.

### 3. Calm surfaces, sharp content

The background should stay quiet.

The content should do the work:

- card titles
- results
- units
- labels
- interpretation
- references

### 4. Semantic color usage

Only use strong color when it means something:

- teal / cyan for primary clinical system actions
- emerald for safe/normal states
- amber for caution
- red for danger / abnormal
- slate / neutral for most surfaces

Avoid using blue as the answer to everything.

### 5. Shared system over one-off styling

The new experience should be built from reusable UI primitives, not page-specific Tailwind combinations.

### 6. Accessibility is part of polish

Professional UI is not just visually polished. It must:

- preserve keyboard flow
- keep touch targets large enough
- respect reduced motion
- preserve contrast
- work in RTL
- keep labels readable

## Target Experience Model

CareCalculus should behave like a hybrid of:

- a clinical command center
- a calculator workspace
- a reference hub

### Primary interaction modes

1. Search and launch
2. Calculate and interpret
3. Review and export
4. Navigate and compare

### What the interface should optimize for

- rapid tool discovery
- rapid input
- immediate result visibility
- confidence through supporting evidence
- reduced cognitive load

## Recommended Product Structure

### Top-level structure

1. Home / Launch
2. Calculator workspace
3. Reading / resources
4. Utility tools
5. Support / legal

### Navigation hierarchy

- Primary navigation should be stable and predictable.
- Secondary navigation should not compete with the main task.
- Search should be the main discovery accelerator.
- Keyword pills should become optional shortcuts, not a second navigation system.

### Screen grouping

Use three major surface types:

- `command surface` for discovery and global launch
- `workspace surface` for calculators and tools
- `reading surface` for articles, PDFs, blog, and policy pages

## Detailed Redesign Plan

## Phase 1: Establish the Design System

### Objective

Create a consistent visual and interaction foundation before touching many page layouts.

### Deliverables

- color tokens
- typography tokens
- spacing tokens
- radius scale
- shadow scale
- surface styles
- state styles
- motion tokens
- accessibility defaults

### Files to update

- `src/index.css`
- `src/components/*` shared primitives
- `src/pages/*` only after tokens are in place

### Token strategy

Define semantic tokens such as:

- `--color-bg`
- `--color-surface`
- `--color-surface-strong`
- `--color-border`
- `--color-text`
- `--color-text-muted`
- `--color-primary`
- `--color-primary-strong`
- `--color-success`
- `--color-warning`
- `--color-danger`

### Typography strategy

Replace the current “everything is bold and uppercase” tendency with a proper type scale:

- display title
- page title
- section title
- card title
- body text
- label text
- metadata / microcopy
- numeric output / monospace values

Rules:

- body text should be readable at 16px minimum
- labels should not overpower content
- monospace should be used only for values, formulas, and technical IDs
- headings should not all share the same weight and letter spacing

### Radius and shadow system

Define a deliberate scale:

- small radius for inputs and chips
- medium radius for cards
- large radius for featured surfaces
- subtle shadow for cards
- stronger shadow only for floating surfaces and modals

Avoid:

- random one-off radii
- heavy shadow soup
- excessive blur

### Motion system

Use restrained motion:

- 150 to 250 ms for micro-interactions
- 250 to 350 ms for larger surface transitions
- opacity and transform only
- no layout-jumping animations
- respect `prefers-reduced-motion`

## Phase 2: Redesign the App Shell

### Objective

Simplify the shell so the user always understands where they are and how to move.

### Current shell problems

- too many parallel discovery surfaces
- too much top chrome on mobile
- sidebar is dense and visually noisy
- content pages and utility pages do not feel like they belong to one product

### New shell structure

#### Desktop

- persistent left navigation rail or compact sidebar
- top contextual header
- main content canvas
- optional right utility rail for active page actions

#### Mobile

- compact top app bar
- one primary search access point
- collapsible navigation drawer or sheet
- bottom result dock for active calculators

### Behavior changes

- keep the search entry point consistent
- reduce duplicated keyword surfaces
- reserve sidebar height and spacing carefully
- preserve scroll position on navigation changes
- keep the active section visually obvious

### Navigation priorities

Primary:

- search
- home
- calculators

Secondary:

- reading resources
- utilities
- legal pages

### Shell implementation notes

- consolidate nav styling into one shared component
- remove repeated per-section color styling
- use one active-state language across all navigation items
- ensure hit targets are at least 44px

## Phase 3: Rebuild the Homepage

### Objective

Make the homepage feel like a premium launchpad instead of a collection of cards.

### New homepage structure

1. Hero with clear product promise
2. Fast launch area
3. Module grid
4. Trust and evidence strip
5. Recent / recommended / popular tools
6. Optional content teaser row

### Hero requirements

The hero should include:

- clear product identity
- one dominant headline
- one supporting line
- one primary CTA
- one secondary CTA
- subtle ambient depth
- no cluttered badge cluster

### Hero improvement goals

- stronger contrast
- better spacing
- more intentional typography
- richer but more restrained depth
- fewer decorative gradients

### Fast launch area

Replace the current “keyword pill bar” feel with a command-style quick launch strip:

- search input
- recent tools
- most-used tools
- direct access shortcuts

### Module grid

Use a bento-like grid, not uniform category cards.

Each module card should include:

- category
- short description
- representative icon
- one strong action
- optional status or badge

### Trust strip

Keep trust visible but lighter than the hero.

It should communicate:

- reviewed by clinicians
- guideline-aligned
- multilingual
- offline-ready

### Homepage anti-patterns to remove

- too many equal-weight sections
- small labels shouting at the user
- all cards looking identical
- dense pill bars spanning the entire width
- too much blue

## Phase 4: Standardize Calculator Pages

### Objective

Every calculator should feel like part of the same premium product family.

### Shared calculator layout

Use one reusable template:

1. page title and short clinical summary
2. input section
3. sticky result panel
4. interpretation / next steps
5. supporting references
6. export / share / embed actions

### Calculator page rules

- input fields should be grouped logically
- result should be visible early
- status should be visually distinct
- interpretation should not be buried
- references should look authoritative but calm

### Result panel improvements

The result area should feel like an instrument panel:

- large numeric value
- unit clearly visible
- status chip
- small supporting explanation
- copy/share/export actions

### Input improvements

Inputs should:

- have visible labels
- have helper text when needed
- use consistent spacing
- avoid overly large and awkward type sizes
- keep slider behavior synchronized with numeric input

### Supporting content improvements

For each calculator, standardize:

- clinical significance
- formula
- interpretation thresholds
- references
- FAQ or usage notes

## Phase 5: Create a Shared Component Library

### Objective

Stop solving the same visual patterns repeatedly in page files.

### Components to create or standardize

#### Surface components

- `Surface`
- `SectionCard`
- `InsetPanel`
- `Callout`
- `TrustPanel`

#### Navigation components

- `AppShell`
- `SidebarNav`
- `TopBar`
- `Breadcrumb`
- `QuickSwitch`
- `SearchCommandBar`

#### Action components

- `PrimaryButton`
- `SecondaryButton`
- `IconButton`
- `Chip`
- `Tag`
- `PillLink`

#### Data / result components

- `StatTile`
- `ResultPanel`
- `StatusBadge`
- `InterpretationCard`
- `FormulaBlock`
- `ReferenceList`

#### Form components

- `Field`
- `NumberField`
- `RangeField`
- `FieldHint`
- `FieldError`

### Why this matters

This reduces:

- visual drift
- duplicated Tailwind classes
- inconsistent spacing
- inconsistent active states

And increases:

- speed of implementation
- consistency
- maintainability

## Phase 6: Refresh Information Architecture

### Objective

Make discovery and navigation feel intentional instead of crowded.

### Proposed IA behavior

#### Home

- launch calculators
- show popular modules
- show trust

#### Calculator pages

- input immediately
- result stays visible
- supporting interpretation is progressive

#### Reading pages

- use a calmer editorial layout
- use narrower content width
- keep navigation light

### Search strategy

One global search surface should do most of the work.

It should support:

- calculator name
- symptom / condition term
- synonyms
- language variants

### Reduce competing discovery UI

The following should be simplified:

- duplicate search bars
- repeated pill bars
- repeated keyword indexes
- overly busy contextual headers

## Phase 7: Typography and Content Hierarchy

### Objective

Make the interface feel designed through type, not just color.

### Recommended hierarchy

#### Page titles

- large
- confident
- strong contrast
- limited line length

#### Section titles

- slightly smaller
- medium weight
- more spacing above than below

#### Body copy

- 16px minimum
- comfortable line height
- shorter paragraphs

#### Labels

- not all-uppercase by default
- use small caps or uppercase only where it adds utility
- keep contrast sufficient

#### Technical values

- tabular numerals
- monospace for formulas and IDs

### Content behavior

- do not over-truncate labels
- wrap when possible
- use tooltips only when necessary
- avoid text that competes with the hierarchy

## Phase 8: Color and Surface System

### Objective

Move from “blue everywhere” to a semantic, high-trust clinical palette.

### Color rules

- use slate as the base
- use teal/cyan for primary brand actions
- use emerald for success and normal states
- use amber for caution
- use red sparingly
- keep borders subtle
- keep backgrounds quiet

### Surface rules

- main canvas: neutral and low-noise
- feature panels: slightly elevated
- cards: clearly separated but not over-framed
- modals/sheets: strong enough scrim

### Dark mode

If dark mode is introduced or expanded, it should not be an inverted light theme.

Use:

- desaturated dark surfaces
- lighter text
- clear border contrast
- separate tones for nested levels

## Phase 9: Motion and Interaction

### Objective

Make interactions feel premium and responsive, not flashy.

### Motion rules

- motion must express cause and effect
- motion should help orientation
- motion should never delay task completion
- motion should remain interruptible

### Good motion examples

- card lift on hover
- subtle press scale on buttons
- fade + translate for panels
- crossfade for result replacement

### Bad motion examples

- bouncing everything
- overly long transitions
- layout-shifting animations
- decorative-only motion

### Mobile interaction rules

- touch targets minimum 44px
- spacing between actions at least 8px
- active state visible immediately
- no hover-only affordances

## Phase 10: Accessibility and Internationalization

### Objective

Make the redesign fully usable across languages and input modes.

### Accessibility requirements

- preserve keyboard navigation
- keep skip link
- keep visible focus states
- maintain contrast standards
- use semantic headings
- label icon-only buttons
- announce errors properly
- support reduced motion

### RTL requirements

- mirror layout where needed
- keep reading order logical
- make icons and chevrons direction-aware
- ensure spacing tokens work in both directions

### Internationalization requirements

- keep language switching stable
- avoid hardcoded English-only microcopy
- preserve line length in Arabic and French layouts
- keep language-specific typography readable

## Phase 11: Page-by-Page Rollout Order

### Recommended order

1. global tokens and primitives
2. app shell
3. home page
4. calculator template
5. top-used calculator pages
6. reading/content pages
7. remaining calculators
8. final polish and QA

### Priority pages

Start with the highest traffic and most visible surfaces:

- home page
- MAP calculator
- GCS calculator
- qSOFA calculator
- creatinine clearance
- BMI
- drip rate

### Why this order

These pages define user perception quickly. If they feel premium, the rest of the site can follow the same pattern.

## Phase 12: File-Level Implementation Notes

### `src/index.css`

Move toward:

- semantic color tokens
- consistent type scale
- consistent body spacing
- better focus tokens
- better selection and input styles

Reduce:

- global hardcoded type overrides
- label over-styling
- overly aggressive heading overrides

### `src/App.tsx`

Refactor shell responsibilities into smaller pieces:

- header
- sidebar
- search
- content chrome
- calculator chrome

Reduce repeated layout logic where possible.

### `src/pages/HomePage.tsx`

Rebuild as the product landing surface:

- more intentional hero
- less repetition
- fewer equal-weight cards
- stronger CTA hierarchy

### `src/components/ui/CalculatorInput.tsx`

Turn into a more premium field system:

- label
- helper
- value
- slider
- validation
- consistent spacing

### `src/components/ui/MobileResultDock.tsx`

Make it feel like a proper floating result dock:

- better hierarchy
- clearer status
- stronger tap targets
- softer, more premium elevation

### `src/pages/*` calculator pages

Move toward a common layout composition:

- shared page header
- shared content frame
- shared support sections

## Phase 13: QA and Validation Checklist

### Visual QA

- homepage looks intentional at first glance
- no repeated AI-generated card pattern
- layout feels coherent across breakpoints
- typography hierarchy is obvious
- color usage is semantic, not random

### Interaction QA

- search works quickly
- active nav state is clear
- buttons provide feedback
- result updates are immediate
- back navigation preserves state

### Accessibility QA

- keyboard-only flow works
- focus rings are visible
- screen reader headings are sequential
- contrast is sufficient
- reduced motion is respected

### Responsive QA

- 375px mobile
- large phone
- tablet portrait
- desktop
- RTL layouts
- landscape orientation

### Content QA

- no clipped labels
- no awkward text wrapping
- formulas remain readable
- long localized strings do not break layout

## Phase 14: Success Criteria

The redesign is successful if:

- the UI stops feeling generated
- users can identify the primary action on each page in under 3 seconds
- search feels like the fastest path to a tool
- calculator pages feel unified and premium
- mobile usage feels deliberate, not compressed
- RTL and English layouts feel equally polished
- the interface feels trustworthy in a clinical context

## Risks and Mitigations

### Risk: over-designing with too much visual effect

Mitigation:

- keep effects restrained
- prioritize clarity over novelty
- test on small screens first

### Risk: visual inconsistency during rollout

Mitigation:

- create shared primitives first
- update the shell before individual pages
- avoid one-off page styling

### Risk: breaking RTL or accessibility

Mitigation:

- test each token and shared component in RTL
- keep semantic structure stable
- verify keyboard navigation on every major surface

### Risk: reintroducing clutter

Mitigation:

- enforce one primary CTA
- remove duplicate discovery surfaces
- keep secondary actions subordinate

## Recommended Final Design Outcome

When finished, CareCalculus should feel like:

- a premium clinical command center
- a high-trust medical utility platform
- a multilingual product with serious visual discipline
- a system where every page feels like part of the same product family

The goal is not to look louder.

The goal is to look more confident, more intelligent, and more designed.

