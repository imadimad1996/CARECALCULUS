import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
