import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getLocalizedMeta, nameEnMap } from '../src/utils/seo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

async function main() {
  console.log('Reading fonts...');
  const distOgDir = path.join(ROOT, 'dist', 'og-images');
  if (!fs.existsSync(distOgDir)) {
    fs.mkdirSync(distOgDir, { recursive: true });
  }
  const interFontPath = path.join(ROOT, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-600-normal.woff');
  const interFont = fs.readFileSync(interFontPath);

  let logoSvg = '';
  try {
    logoSvg = fs.readFileSync(path.join(ROOT, 'public', 'icon.svg'), 'utf8');
  } catch (e) {
    logoSvg = `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`;
  }

  // Ensure svg has appropriate dimensions for Satori if needed
  if (logoSvg.includes('<svg ')) {
    logoSvg = logoSvg.replace('<svg ', '<svg width="80" height="80" ');
  }

  const routes = Object.keys(nameEnMap).filter(r => !r.startsWith('/%'));
  // Add home
  routes.push('/');

  const langs = ['en', 'fr', 'es'] as const;

  for (const lang of langs) {
    const langDir = path.join(distOgDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    for (const route of routes) {
      const meta = getLocalizedMeta(route, lang);
      const title = meta.title.split(' | ')[0];

      const subtitle = lang === 'fr' 
        ? 'Calculateur Médical Gratuit' 
        : lang === 'es'
        ? 'Calculadora Médica Gratuita'
        : 'Multilingual Care Calculators';

      const element = (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #f3f4f6 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f3f4f6 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: '"Inter"',
            direction: 'ltr',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 80px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '32px',
              border: '2px solid #e5e7eb',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
              maxWidth: '900px',
              width: '80%',
              textAlign: 'center',
            }}
          >
              {/* Logo area */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '40px',
                }}
              >
                <img 
                  src={`data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`}
                  width={80}
                  height={80}
                  alt="Logo"
                />
              </div>

              {/* Title */}
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: 600,
                  color: '#111827',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                }}
              >
                {title}
              </div>

              {/* Subtitle */}
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 600,
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {subtitle}
              </div>
          </div>
        </div>
      );

      const svg = await satori(element as any, {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: interFont,
            weight: 600,
            style: 'normal',
          },
        ],
      });

      const resvg = new Resvg(svg, {
        background: 'rgba(255, 255, 255, 1)',
      });
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      const fileName = route === '/' ? 'index.png' : `${route.replace(/^\//, '')}.png`;
      const filePath = path.join(langDir, fileName);
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(filePath, pngBuffer);
    }
    console.log(`Generated all images for language: ${lang}`);
  }
  console.log('Successfully completed OG Image generation.');
  process.exit(0);
}

main().catch(e => {
  console.error('Failed to generate OG Images:', e);
  process.exit(1);
});
