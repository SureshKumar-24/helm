// Script to generate PWA icons
// This creates simple placeholder icons with Financial Helm branding
// For production, replace with professionally designed icons

const fs = require('fs');
const path = require('path');

// SVG template for icons
const createIconSVG = (size, isMaskable = false) => {
  const padding = isMaskable ? size * 0.1 : 0; // 10% padding for maskable icons
  const contentSize = size - (padding * 2);
  const fontSize = contentSize * 0.4;
  const textY = size / 2 + fontSize / 3;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1e40af"/>
  <text x="${size / 2}" y="${textY}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#ffffff" text-anchor="middle">FH</text>
</svg>`;
};

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
const icons = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

console.log('Generating PWA icons...');
console.log('Note: These are placeholder SVG icons. For production, use professionally designed PNG icons.');

icons.forEach(icon => {
  const svgContent = createIconSVG(icon.size, icon.maskable);
  const svgPath = path.join(publicDir, icon.name.replace('.png', '.svg'));
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Created ${icon.name.replace('.png', '.svg')}`);
});

console.log('\nTo convert SVG to PNG, you can use:');
console.log('- Online tools like https://cloudconvert.com/svg-to-png');
console.log('- Command line tools like ImageMagick or Inkscape');
console.log('- Or use the SVG files directly (most browsers support SVG icons)');
