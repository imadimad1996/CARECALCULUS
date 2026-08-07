/**
 * CareCalculus Automated Google Play Service Account Key Extractor
 * Reads environment variables:
 * - GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICES_JSON (JSON string or Base64 encoded JSON)
 * Writes key safely to ./pc-api-key.json for EAS submit.
 */

const fs = require('fs');
const path = require('path');

const envFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const envKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_SERVICES_JSON;
const targetPath = path.join(__dirname, '..', 'pc-api-key.json');

// 1. If GOOGLE_APPLICATION_CREDENTIALS file exists, copy it
if (envFilePath && fs.existsSync(envFilePath)) {
  try {
    const fileContent = fs.readFileSync(envFilePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    fs.writeFileSync(targetPath, JSON.stringify(parsed, null, 2), 'utf-8');
    console.log(`✅  Successfully initialized Google Play Service Account Key from GOOGLE_APPLICATION_CREDENTIALS (${parsed.client_email})`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Error reading file at GOOGLE_APPLICATION_CREDENTIALS:', err.message);
  }
}

// 2. Fallback to GOOGLE_SERVICE_ACCOUNT_KEY / GOOGLE_SERVICES_JSON string
if (!envKey) {
  console.log('ℹ️  No GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICES_JSON environment variable provided.');
  if (fs.existsSync(targetPath)) {
    console.log('✅  Existing ./pc-api-key.json credential file found.');
    process.exit(0);
  } else {
    console.warn('⚠️  Warning: ./pc-api-key.json does not exist. Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_KEY before submitting.');
    process.exit(0);
  }
}

try {
  let jsonString = envKey.trim();
  
  // Handle Base64 encoded string fallback
  if (!jsonString.startsWith('{')) {
    const decoded = Buffer.from(jsonString, 'base64').toString('utf-8');
    if (decoded.startsWith('{')) {
      jsonString = decoded;
    }
  }

  // Validate JSON structure
  const parsed = JSON.parse(jsonString);
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('JSON is missing client_email or private_key fields.');
  }

  fs.writeFileSync(targetPath, JSON.stringify(parsed, null, 2), 'utf-8');
  console.log(`✅  Successfully generated Google Play Service Account Key at ./pc-api-key.json (${parsed.client_email})`);
} catch (error) {
  console.error('❌  Error processing Google Service Account Key:', error.message);
  process.exit(1);
}
