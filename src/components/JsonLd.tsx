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
