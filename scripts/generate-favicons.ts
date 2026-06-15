import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// Helper to construct a multi-resolution ICO file from PNG buffers
function createIco(pngBuffers: { width: number; height: number; buffer: Buffer }[]): Buffer {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const numImages = pngBuffers.length;

  const header = Buffer.alloc(HEADER_SIZE);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Image type (1 = icon)
  header.writeUInt16LE(numImages, 4); // Number of images

  const entries: Buffer[] = [];
  const datas: Buffer[] = [];

  let currentOffset = HEADER_SIZE + ENTRY_SIZE * numImages;

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(ENTRY_SIZE);

    // Width and Height: 0-255. 256 is represented as 0.
    const w = item.width >= 256 ? 0 : item.width;
    const h = item.height >= 256 ? 0 : item.height;

    entry.writeUInt8(w, 0);
    entry.writeUInt8(h, 1);
    entry.writeUInt8(0, 2); // Color palette (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data

    currentOffset += item.buffer.length;
    entries.push(entry);
    datas.push(item.buffer);
  }

  return Buffer.concat([header, ...entries, ...datas]);
}

async function main() {
  const publicDir = path.join(ROOT, 'public');
  const svgPath = path.join(publicDir, 'favicon.svg');

  if (!fs.existsSync(svgPath)) {
    console.error(`Error: Source SVG file not found at ${svgPath}`);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // 1. Generate standalone PNGs
  const pngTargets = [
    { size: 48, filename: 'favicon-48x48.png' },
    { size: 96, filename: 'favicon-96x96.png' },
    { size: 144, filename: 'favicon-144x144.png' },
    { size: 180, filename: 'apple-touch-icon.png' },
    { size: 192, filename: 'icon-192.png' },
    { size: 512, filename: 'icon-512.png' },
  ];

  console.log('Generating PNG favicons...');
  const renderedPngs: { width: number; height: number; buffer: Buffer }[] = [];

  for (const target of pngTargets) {
    const resvg = new Resvg(svgBuffer, {
      fitTo: {
        mode: 'width',
        value: target.size,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const destPath = path.join(publicDir, target.filename);
    fs.writeFileSync(destPath, pngBuffer);
    console.log(`- Created ${target.filename} (${target.size}x${target.size})`);

    // Cache specific sizes for the ICO file
    if ([16, 32, 48].includes(target.size)) {
      renderedPngs.push({ width: target.size, height: target.size, buffer: pngBuffer });
    }
  }

  // Generate 16x16 and 32x32 specifically for the ICO compilation
  const icoSizes = [16, 32];
  for (const size of icoSizes) {
    const resvg = new Resvg(svgBuffer, {
      fitTo: {
        mode: 'width',
        value: size,
      },
    });
    const pngBuffer = resvg.render().asPng();
    renderedPngs.push({ width: size, height: size, buffer: pngBuffer });
  }

  // Sort by width for tidy ICO structure
  renderedPngs.sort((a, b) => a.width - b.width);

  // 2. Generate favicon.ico containing 16x16, 32x32, and 48x48 resolutions
  console.log('Generating multi-resolution favicon.ico...');
  const icoBuffer = createIco(renderedPngs);
  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('- Created favicon.ico successfully.');

  console.log('Favicon generation completed successfully!');
}

main().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
