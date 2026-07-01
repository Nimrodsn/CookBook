import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import sharp from "sharp";

const TERRACOTTA = "#c45c26";
const CREAM = "#fff8f0";

function iconSvg(size) {
  const radius = Math.round(size * 0.18);
  const fontSize = Math.round(size * 0.48);
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${TERRACOTTA}"/>
  <text x="50%" y="54%" font-size="${fontSize}" fill="${CREAM}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-weight="700">C</text>
</svg>`;
}

async function generateIcon(size, outputPath) {
  await sharp(Buffer.from(iconSvg(size))).png().toFile(outputPath);
}

const iconsDir = resolve(process.cwd(), "public", "icons");
await mkdir(iconsDir, { recursive: true });

await generateIcon(192, resolve(iconsDir, "icon-192.png"));
await generateIcon(512, resolve(iconsDir, "icon-512.png"));
await generateIcon(180, resolve(iconsDir, "apple-icon-180.png"));
await generateIcon(32, resolve(iconsDir, "favicon-32.png"));

console.log("Generated public/icons/icon-192.png, icon-512.png, apple-icon-180.png, favicon-32.png");
