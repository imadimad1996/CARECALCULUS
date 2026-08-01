import React from 'react';

interface JsonLdProps {
  data?: Record<string, any>;
  path?: string;
  title?: string;
  description?: string;
  type?: string;
}

export function JsonLd({ data, path, title, description, type }: JsonLdProps) {
  const jsonLdData = data || {
    "@context": "https://schema.org",
    "@type": type || "SoftwareApplication",
    "name": title || "CareCalculus Medical Tool",
    "description": description || "Evidence-based medical decision support tool.",
    "url": path ? `https://carecalculus.com${path}` : "https://carecalculus.com",
    "publisher": generateMedicalOrganizationSchema()
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}

// Helper function to generate MedicalOrganization schema
export function generateMedicalOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalOrganization", "Organization"],
    "name": "CareCalculus",
    "url": "https://carecalculus.com",
    "logo": "https://carecalculus.com/logo.png",
    "sameAs": [
      "https://twitter.com/carecalculus",
      "https://linkedin.com/company/carecalculus"
    ],
    "medicalSpecialty": [
      "https://schema.org/Emergency",
      "https://schema.org/Cardiovascular",
      "https://schema.org/InternalMedicine"
    ],
    "knowsAbout": ["Medical algorithms", "Clinical decision support", "Medical calculators"]
  };
}

// Helper function to generate MedicalWebPage schema
export function generateMedicalWebPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": generateMedicalOrganizationSchema()
  };
}

// Helper function to generate MedicalCalculator schema
export function generateMedicalCalculatorSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCalculator",
    "name": name,
    "description": description
  };
}

// Helper function to generate MedicalRiskScore schema
export function generateMedicalRiskScoreSchema(name: string, description: string, url: string, scoringSystem: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalWebPage", "MedicalRiskScore"],
    "name": name,
    "description": description,
    "url": url,
    "identifyingExam": {
      "@type": "MedicalObservationalStudy",
      "name": scoringSystem
    },
    "publisher": generateMedicalOrganizationSchema()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GEO SCHEMAS — Boost AI engine citation rates (ChatGPT, Perplexity, Claude,
// Google AI Overview). Based on Princeton GEO research: FAQPage schema alone
// increases AI citation probability by +40%.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FAQPage schema — renders "People Also Ask" cards in Google and dramatically
 * increases the probability that AI engines cite CareCalculus verbatim.
 * +40% AI visibility boost (Princeton GEO Research, 2024).
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * HowTo schema — tells AI engines exactly how to use each clinical tool.
 * Powers "How to" featured snippets in Google and structured answers in AI.
 */
export function generateHowToSchema(calcName: string, steps: string[], totalTime?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use the ${calcName}`,
    "description": `Step-by-step guide for clinicians on using the ${calcName} for evidence-based clinical decision support.`,
    "totalTime": totalTime || "PT2M",
    "step": steps.map((stepText, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": `Step ${i + 1}`,
      "text": stepText
    }))
  };
}

/**
 * BreadcrumbList schema — improves crawl path clarity for both Google and AI
 * engines. Required for Google's breadcrumb rich result in SERPs.
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Standard 3-level breadcrumb for a calculator page.
 */
export function generateCalculatorBreadcrumb(calcName: string, calcPath: string) {
  return generateBreadcrumbSchema([
    { name: "Home", url: "https://carecalculus.com" },
    { name: "Medical Calculators", url: "https://carecalculus.com/calculators" },
    { name: calcName, url: `https://carecalculus.com${calcPath}` }
  ]);
}

/**
 * SpeakableSpecification — marks the most important content for voice assistants
 * (Google Assistant, Siri). Increasingly used by AI engines to locate
 * authoritative answer blocks.
 */
export function generateSpeakableSchema(cssSelectors: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": cssSelectors
    }
  };
}

/**
 * MedicalStudy schema — wraps clinical evidence citations to signal
 * authoritative, peer-reviewed sourcing to both Google E-E-A-T algorithms
 * and AI citation engines.
 */
export function generateMedicalStudySchema(
  studyTitle: string,
  doi: string,
  journal: string,
  year: number,
  finding: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalStudy",
    "name": studyTitle,
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "DOI",
      "value": doi
    },
    "publisher": {
      "@type": "Organization",
      "name": journal
    },
    "datePublished": String(year),
    "description": finding
  };
}

/**
 * Composite schema block for a full calculator page — bundles MedicalWebPage +
 * FAQPage + BreadcrumbList + SpeakableSpecification into one render.
 * Use this as the single call from CalculatorShell for maximum GEO coverage.
 */
export interface CalcPageSchemaOptions {
  name: string;
  description: string;
  path: string;
  faqs?: { question: string; answer: string }[];
  howToSteps?: string[];
  scoringSystem?: string;
}

export function CalcPageSchemas({ name, description, path, faqs, howToSteps, scoringSystem }: CalcPageSchemaOptions) {
  const url = `https://carecalculus.com${path}`;
  const schemas: Record<string, any>[] = [];

  // Core medical page schema
  schemas.push(
    scoringSystem
      ? generateMedicalRiskScoreSchema(name, description, url, scoringSystem)
      : generateMedicalWebPageSchema(name, description, url)
  );

  // Breadcrumb (always)
  schemas.push(generateCalculatorBreadcrumb(name, path));

  // FAQ schema — highest GEO impact (+40% citation probability)
  if (faqs && faqs.length > 0) {
    const faqSchema = generateFAQSchema(faqs);
    if (faqSchema) schemas.push(faqSchema);
  }

  // HowTo schema
  if (howToSteps && howToSteps.length > 0) {
    schemas.push(generateHowToSchema(name, howToSteps));
  }

  // Speakable — mark key content for voice/AI extraction
  schemas.push(generateSpeakableSchema([
    "#clinical-definition",
    "#calculator-result",
    "#score-interpretation",
    "h1",
    ".clinical-pearl"
  ]));

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
