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

// Helper function to generate MedicalWebPage schema
export function generateMedicalWebPageSchema(title: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "CareCalculus",
      "url": "https://carecalculus.com"
    }
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
    "publisher": {
      "@type": "Organization",
      "name": "CareCalculus",
      "url": "https://carecalculus.com"
    }
  };
}
