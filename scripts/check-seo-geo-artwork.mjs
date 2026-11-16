import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const configuration = new URL('../src/app/components/seo-geo-services.json', import.meta.url);
const original = await readFile(configuration, 'utf8');
const services = JSON.parse(original);
const hashes = new Set();
for (const service of services) {
  const { image } = service;
  const data = await readFile(new URL(`../public/seo-geo-showcase/${image}`, import.meta.url));
  const { format, width, height } = await sharp(data).metadata();
  if (format !== 'webp' || width !== height || width < 1200) throw Error(`${image}: expected a high-resolution square WebP`);
  const hash = createHash('sha256').update(data).digest('hex');
  if (hashes.has(hash)) throw Error(`${image}: duplicate artwork`);
  hashes.add(hash);
  // Public filenames stay stable; changed bytes invalidate optimized/browser copies.
  service.imageVersion = hash.slice(0, 12);
}
if (hashes.size !== 7) throw Error('Expected seven distinct SEO/GEO images');
const updated = JSON.stringify(services, null, 2) + '\n';
if (updated !== original) await writeFile(configuration, updated);
console.log('SEO/GEO: all seven distinct square WebP photographs verified.');
