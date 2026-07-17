import fs from 'fs';
import path from 'path';

const LAUNCH_DIR = path.resolve(process.cwd(), 'launch-assets');

if (!fs.existsSync(LAUNCH_DIR)) {
  fs.mkdirSync(LAUNCH_DIR);
}

// Generate Product Hunt Launch Data
const productHuntData = {
  name: "CareCalculus",
  tagline: "The fastest, glassmorphic open-source medical calculator.",
  description: "CareCalculus is an ultra-fast, open-source alternative to MDCalc. Built by clinicians, for clinicians. We offer instant clinical export to EHRs, offline PWA support, and beautifully designed medical risk scores and pharmacology converters.",
  topics: ["Health & Fitness", "Developer Tools", "Open Source", "Productivity"],
  makers: ["Clinical Engineering Team"],
  pricing: "Free",
  links: [
    "https://carecalculus.com"
  ],
  firstComment: "Hey Product Hunt! 👋\n\nWe built CareCalculus because we were frustrated by the slow, ad-heavy, and outdated interfaces of legacy medical calculators used during critical ER shifts. \n\nWe wanted something instantly accessible, offline-first, and designed with modern 'glassmorphic' UX principles to make finding the right dose or risk score painless.\n\n✨ Features:\n- Instant EHR SmartPhrase / SOAP exports\n- Completely open-source (react + vite)\n- Multi-lingual (English, French, Arabic)\n- Programmatic Disease-to-Calculator Guides\n\nWe'd love your feedback! Let us know what calculators we should build next.",
};

fs.writeFileSync(
  path.join(LAUNCH_DIR, 'product-hunt-launch.json'),
  JSON.stringify(productHuntData, null, 2)
);

// Generate Directory Submission Variations
const directoryData = [
  {
    type: "Short",
    text: "CareCalculus: The open-source, lightning-fast alternative to legacy medical calculators."
  },
  {
    type: "Medium",
    text: "CareCalculus is an open-source medical calculator platform offering ultra-fast risk scores, drug conversions, and EHR SmartPhrase exports with an award-winning glassmorphic design."
  },
  {
    type: "Long",
    text: "CareCalculus is the modern alternative to MDCalc. Built by clinicians for clinicians, it provides an open-source, offline-first PWA experience for calculating medical risk scores (like SOFA, CHA2DS2-VASc) and drug dosages. It features built-in programmatic clinical guides and one-click EHR SmartPhrase exports to streamline shift handovers in the ER or ICU."
  }
];

fs.writeFileSync(
  path.join(LAUNCH_DIR, 'directory-submissions.json'),
  JSON.stringify(directoryData, null, 2)
);

console.log('Launch assets generated successfully in /launch-assets/');
