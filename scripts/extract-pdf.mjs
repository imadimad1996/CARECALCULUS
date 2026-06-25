import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'public/pdf');
const OUT_FILE = path.join(ROOT, 'src/data/pdf-transcripts.json');

// Get all PDFs
const pdfFiles = [];
function findPdfs(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findPdfs(fullPath);
    } else if (file.toLowerCase().endsWith('.pdf')) {
      pdfFiles.push(fullPath);
    }
  }
}

findPdfs(PDF_DIR);

async function extractAll() {
  console.log(`Found ${pdfFiles.length} PDFs. Extracting...`);
  const transcripts = {};
  
  for (const pdf of pdfFiles) {
    try {
      const dataBuffer = fs.readFileSync(pdf);
      const data = await pdfParse(dataBuffer);
      const relPath = path.relative(path.join(ROOT, 'public'), pdf).replace(/\\/g, '/');
      
      // Clean up text
      let text = data.text;
      text = text.replace(/\n\s*\n/g, '\n\n').trim();
      
      transcripts[relPath] = {
        numpages: data.numpages,
        info: data.info,
        text: text.substring(0, 50000) // limit to 50k chars per pdf to avoid huge bundle
      };
      console.log(`✅ Extracted: ${relPath} (${data.numpages} pages)`);
    } catch (e) {
      console.error(`❌ Failed to extract: ${pdf}`, e.message);
    }
  }
  
  // Ensure src/data exists
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(OUT_FILE, JSON.stringify(transcripts, null, 2), 'utf8');
  console.log(`\n🎉 Done! Wrote ${Object.keys(transcripts).length} transcripts to ${OUT_FILE}`);
}

extractAll();
