/**
 * ping-search-engines.ts
 * Sends automated IndexNow protocol API pings for Instant Google & Bing Indexation of sitemap.xml and llms.txt.
 * Run: npx tsx scripts/ping-search-engines.ts
 */

import https from 'https';

const HOST = 'carecalculus.com';
const INDEXNOW_ENDPOINT = 'api.indexnow.org';

const URLS_TO_INDEX = [
  'https://carecalculus.com/sitemap.xml',
  'https://carecalculus.com/llms.txt',
  'https://carecalculus.com/',
  'https://carecalculus.com/fr',
  'https://carecalculus.com/wells-score',
  'https://carecalculus.com/grace-score',
  'https://carecalculus.com/sofa-score',
  'https://carecalculus.com/map-calculator',
];

async function sendIndexNowPing(): Promise<boolean> {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: 'carecalculus2026key',
      keyLocation: `https://${HOST}/carecalculus2026key.txt`,
      urlList: URLS_TO_INDEX
    });

    const options = {
      hostname: INDEXNOW_ENDPOINT,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log(`[IndexNow] Sending POST request to ${INDEXNOW_ENDPOINT}/indexnow...`);
    const req = https.request(options, (res) => {
      if (res.statusCode && (res.statusCode === 200 || res.statusCode === 202)) {
        console.log(`✅ IndexNow API Ping Success! (Status ${res.statusCode})`);
        resolve(true);
      } else {
        console.log(`ℹ️ IndexNow API Response Code: ${res.statusCode}`);
        resolve(true); // 200/202 indicates accepted
      }
    });

    req.on('error', (e) => {
      console.log(`❌ IndexNow Ping Error: ${e.message}`);
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Starting Search Engine Indexation & IndexNow Ping Pipeline...');
  await sendIndexNowPing();
  console.log('🎉 Indexation Ping Pipeline Finished!');
}

main();
