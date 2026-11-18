// Prepare local derivatives from the original supplied gallery artwork.
import sharp from "sharp";
import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const folder = "public/creative-portfolio-gallery";
const assets = [
  ["airfi-logo", "aihifi.jpg.jpeg", 1600],
  ["airfi-identity", "AirFi Logo.jpg.jpeg"],
  ["echo-identity", "Echo logo design-02.jpg.jpeg"],
  ["huse-identity", "Huse Logo Design.jpg.jpeg"],
  ["soltek-identity", "I will design modern minimalist saas tech app logo and brand identity with branding kit_Artboard 1-04.jpg.jpeg"],
  ["solbex-identity", "I will design modern minimalist saas tech app logo and brand identity with branding kit-01.jpg.jpeg"],
  ["nexr-identity", "nexr logo.jpg.jpeg"],
  ["payland-identity", "Payland Logo.jpg.jpeg"],
  ["quantumcore-identity", "Q logo.jpg.jpeg"],
  ["rivora-logo", "rivora.jpg.jpeg", 1600],
  ["sentra-identity", "Sentra Logo.jpg.jpeg"],
  ["sleep-plugg-logo", "Sleep Plug.jpg.jpeg", 1600],
  ["soltek-logo", "Soltek Logo.jpg.jpeg", 1600],
  ["soltex-profile", "Soltex Logo Design 2.jpg.jpeg"],
  ["iluf-website", "Screenshot 2026-11-18 174048.png"],
  ["khadi-trip-website", "Screenshot 2026-11-18 174109.png"],
];

const input = filename => join("public", filename);
const checks = await Promise.allSettled(assets.map(([, source]) => access(input(source))));
const missing = assets.filter((_, index) => checks[index].status === "rejected");
if (missing.length) {
  throw new Error("Missing gallery originals:\n" + missing.map(([, source]) => input(source)).join("\n"));
}

await mkdir(folder, { recursive: true });
const manifest = [];
for (const [id, source, maxWidth = 2400] of assets) {
  const file = id + ".webp";
  const { width, height } = await sharp(input(source))
    .autoOrient()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 92, smartSubsample: true, effort: 5 })
    .toFile(join(folder, file));
  manifest.push({ id, file, source, width, height });
}
await writeFile(join(folder, "sources.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log("Prepared " + manifest.length + " local portfolio previews.");
