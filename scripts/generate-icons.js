// Generate placeholder PWA icons as SVG files
// In production, convert these to PNG using a tool like sharp or inkscape
const fs = require('fs');
const path = require('path');

function generateSVGIcon(size) {
  const r = size * 0.12;
  const sw = Math.max(size * 0.02, 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#0a0a0a"/>
  <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#00F0FF" stroke-width="${sw}"/>
  <line x1="${size/2}" y1="${size * 0.2}" x2="${size/2}" y2="${size * 0.35}" stroke="#00F0FF" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size/2}" y1="${size * 0.65}" x2="${size/2}" y2="${size * 0.8}" stroke="#00F0FF" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size * 0.2}" y1="${size/2}" x2="${size * 0.35}" y2="${size/2}" stroke="#00F0FF" stroke-width="${sw}" stroke-linecap="round"/>
  <line x1="${size * 0.65}" y1="${size/2}" x2="${size * 0.8}" y2="${size/2}" stroke="#00F0FF" stroke-width="${sw}" stroke-linecap="round"/>
</svg>`;
}

const publicDir = path.join(__dirname, '..', 'public');

// Write SVG icons
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), generateSVGIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), generateSVGIcon(512));

console.log('PWA icons generated in public/');
