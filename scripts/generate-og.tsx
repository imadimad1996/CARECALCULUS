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
  const cairoFontPath = path.join(ROOT, 'node_modules', '@fontsource', 'cairo', 'files', 'cairo-arabic-600-normal.woff');
  
  const interFont = fs.readFileSync(interFontPath);
  const cairoFont = fs.readFileSync(cairoFontPath);

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

  const langs = ['en', 'fr', 'ar'] as const;

  for (const lang of langs) {
    const langDir = path.join(distOgDir, lang);
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }

    for (const route of routes) {
      const meta = getLocalizedMeta(route, lang);
      const title = meta.title.split(' | ')[0];
      const isArabic = lang === 'ar';

      const subtitle = lang === 'fr' 
        ? 'Calculateur Médical Gratuit' 
        : lang === 'ar' 
        ? 'الحاسبة الطبية الشاملة المعتمدة' 
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
            fontFamily: isArabic ? '"Cairo"' : '"Inter"',
            direction: isArabic ? 'rtl' : 'ltr',
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
                  style={{ display: 'flex' }}
                />
                <span style={{ fontSize: '36px', fontWeight: 600, marginLeft: '20px', color: '#111827' }}>CareCalculus</span>
              </div>

            {/* Title */}
            <h1
              style={{
                fontSize: isArabic ? '64px' : '56px',
                fontWeight: 600,
                color: '#111827',
                marginBottom: '24px',
                lineHeight: 1.2,
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '28px',
                color: '#6b7280',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                margin: 0
              }}
            >
              {subtitle}
            </p>
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
          {
            name: 'Cairo',
            data: cairoFont,
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
