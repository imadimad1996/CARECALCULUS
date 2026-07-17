import { LangCode } from '../types';

interface SchemaProps {
  name: string;
  description: string;
  url: string;
  category?: string;
  authorName?: string;
  datePublished?: string;
}

export function getMedicalCalculatorSchema({
  name,
  description,
  url,
  category = 'MedicalCalculator',
  authorName = 'CareCalculus Clinical Team',
  datePublished = '2026-01-01',
}: SchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['MedicalWebPage', 'SoftwareApplication'],
    name: name,
    description: description,
    url: url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    author: {
      '@type': 'Organization',
      name: authorName,
      url: 'https://carecalculus.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CareCalculus',
      logo: {
        '@type': 'ImageObject',
        url: 'https://carecalculus.com/logo512.png',
      },
    },
    datePublished: datePublished,
    about: {
      '@type': 'MedicalCondition',
      name: category,
    },
    mainEntity: {
      '@type': 'MedicalGuideline',
      name: `Evidence-based guidelines for ${name}`,
      evidenceOrigin: 'Peer-Reviewed Medical Literature',
    },
  };

  return schema;
}
