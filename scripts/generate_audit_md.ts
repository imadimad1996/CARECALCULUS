import fs from 'fs';
import path from 'path';

interface SpecialtyData {
  covered: string[];
  missing: string[];
}

interface AuditJson {
  care_calculus_total_tools: number;
  audit_matrix_total: number;
  covered_in_matrix: number;
  coverage_percentage: string;
  specialties: Record<string, SpecialtyData>;
  top_missing_recommendations: Array<{ name: string; specialty: string }>;
}

const auditFilePath = path.join(process.cwd(), 'dist', 'audit', 'calculator_gap_report.json');
const outputMdPath = path.join(process.cwd(), 'dist', 'audit', 'AUDIT_GAP_REPORT.md');

if (!fs.existsSync(auditFilePath)) {
  console.error("Audit JSON file not found at:", auditFilePath);
  process.exit(1);
}

const data: AuditJson = JSON.parse(fs.readFileSync(auditFilePath, 'utf-8'));

let mdContent = `# 🏥 CareCalculus Global Medical Calculator & Specialty Audit Report\n\n`;
mdContent += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
mdContent += `**CareCalculus Tools Live:** ${data.care_calculus_total_tools}\n`;
mdContent += `**Global Benchmark Coverage Rate:** ${data.coverage_percentage} (${data.covered_in_matrix}/${data.audit_matrix_total} benchmark tools covered)\n\n`;

mdContent += `--- \n\n## 📊 Specialty-by-Specialty Breakdown\n\n`;
mdContent += `| Specialty / Department | Covered Tools | Missing High-Yield Opportunities |\n`;
mdContent += `| :--- | :--- | :--- |\n`;

for (const [specialty, val] of Object.entries(data.specialties)) {
  const coveredStr = val.covered.length > 0 ? val.covered.join(', ') : 'None';
  const missingStr = val.missing.length > 0 ? val.missing.map(m => `**${m}**`).join(', ') : '✅ 100% Covered';
  mdContent += `| **${specialty}** | ${coveredStr} | ${missingStr} |\n`;
}

mdContent += `\n---\n\n## 🎯 Prioritized Action Roadmap for CareCalculus\n\n`;
mdContent += `To expand CareCalculus into new medical specialties and reach 100+ clinical tools, the following calculators are recommended for implementation:\n\n`;

data.top_missing_recommendations.forEach((item, idx) => {
  mdContent += `${idx + 1}. **${item.name}** (*${item.specialty}*)\n`;
});

fs.writeFileSync(outputMdPath, mdContent, 'utf-8');
console.log(`[+] Successfully generated audit Markdown report at: ${outputMdPath}`);
