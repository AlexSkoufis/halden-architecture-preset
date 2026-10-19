// Builds responsive AVIF + WebP sets (and a tiny blur placeholder) from assets-src/
// into public/img/, and writes lib/image-manifest.json for the <Img> component.
// Add a photo: put it in assets-src/, add `key: 'file.jpg'` below, add the key to
// ImageKey in lib/content.ts, then run `npm run images`.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'assets-src');
const OUT = path.join(root, 'public', 'img');
const PAPER = '#f3f1ec';

const photos = {
  stonehouse: 'stonehouse.jpg',
  ramp: 'ramp.jpg',
  screenhouse: 'screenhouse.jpg',
  glassfacade: 'glassfacade.jpg',
  walkway: 'walkway.jpg',
  curves: 'curves.jpg',
  stairwall: 'stairwall.jpg',
  facets: 'facets.jpg',
  interior: 'interior.jpg',
  cubes: 'cubes.jpg',
  stairs: 'stairs.jpg',
  cream: 'cream.jpg',
  grid: 'grid.jpg',
  studio: 'studio.jpg',
  steps: 'steps.jpg',
};
const LADDER = [480, 800, 1200, 1600, 2400];

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });
const manifest = {};

for (const [key, file] of Object.entries(photos)) {
  const input = await sharp(path.join(SRC, file)).rotate().flatten({ background: PAPER }).toBuffer();
  const { width, height } = await sharp(input).metadata();
  const widths = LADDER.filter((w) => w < width).concat(width > 2400 ? [] : [width]);
  for (const w of widths) {
    const base = sharp(input).resize({ width: w });
    await base.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${key}-${w}.avif`));
    await base.clone().webp({ quality: 76 }).toFile(path.join(OUT, `${key}-${w}.webp`));
  }
  const blur = await sharp(input).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  manifest[key] = { w: width, h: height, widths, blur: `data:image/webp;base64,${blur.toString('base64')}` };
  console.log('photo', key, `${width}x${height}`, widths.join(','));
}

// Favicon: the studio mark (a square with an offset rule), drawn as SVG.
const mark = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#161614"/>' +
    '<rect x="16" y="16" width="32" height="32" fill="none" stroke="#f3f1ec" stroke-width="3"/>' +
    '<line x1="16" y1="40" x2="48" y2="40" stroke="#f3f1ec" stroke-width="3"/></svg>',
);
await sharp(mark).png().toFile(path.join(root, 'app', 'icon.png'));

await fs.writeFile(path.join(root, 'lib', 'image-manifest.json'), JSON.stringify(manifest, null, 1));
console.log('done');
