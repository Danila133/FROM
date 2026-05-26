import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

/** Base App Thumbnail — must be 1.91:1 (e.g. 1910×1000), max 1 MB */
const WIDTH = 1910;
const HEIGHT = 1000;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#120b1e"/>
      <stop offset="55%" stop-color="#1a0f2e"/>
      <stop offset="100%" stop-color="#31007A"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8700B8" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#653CA2" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#8700B8" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="mark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#8700B8"/>
      <stop offset="38%" stop-color="#653CA2"/>
      <stop offset="50%" stop-color="#E8DFF5"/>
      <stop offset="58%" stop-color="#B49BDA"/>
      <stop offset="100%" stop-color="#31007A"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="48"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <ellipse cx="420" cy="500" rx="280" ry="280" fill="#8700B8" opacity="0.18" filter="url(#blur)"/>
  <ellipse cx="1500" cy="520" rx="320" ry="240" fill="#653CA2" opacity="0.14" filter="url(#blur)"/>
  <rect x="0" y="860" width="${WIDTH}" height="140" fill="url(#glow)"/>

  <g transform="translate(120, 130) scale(1.35)">
    <path fill="url(#mark)" d="M 148 106 H 232 L 420 128 L 400 210 H 232 V 252 L 368 252 L 350 304 H 232 V 390 L 282 436 L 232 420 H 148 V 106 Z"/>
  </g>

  <text x="620" y="430" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="168" font-weight="700" letter-spacing="-2">FROM</text>
  <text x="620" y="540" fill="#E8DFF5" font-family="Inter, Arial, sans-serif" font-size="52" font-weight="500">GM · Deploy · Badges on Base</text>
  <text x="620" y="640" fill="#B49BDA" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="500">More points · Bigger F airdrop</text>

  <rect x="620" y="720" width="420" height="72" rx="36" fill="#653CA2" opacity="0.35" stroke="#8700B8" stroke-width="2"/>
  <text x="830" y="770" fill="#ffffff" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="600">Launch on Base</text>
</svg>`;

const outPath = path.join(publicDir, "app-thumbnail.png");

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outPath);

const meta = await sharp(outPath).metadata();
const { size } = await import("node:fs/promises").then((fs) =>
  fs.stat(outPath),
);

console.log(
  `Wrote ${outPath} — ${meta.width}x${meta.height} (${(size / 1024).toFixed(0)} KB, ratio ${(meta.width / meta.height).toFixed(4)})`,
);
