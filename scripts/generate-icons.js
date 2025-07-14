import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is a simple script to create placeholder icons
// In a real project, you'd use a proper image processing library

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple colored square as placeholder
function createPlaceholderIcon(size) {
  const svg = `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="#3b82f6"/>
  <rect x="${size * 0.25}" y="${size * 0.25}" width="${size * 0.5}" height="${size * 0.5}" fill="white"/>
  <rect x="${size * 0.3125}" y="${size * 0.3125}" width="${size * 0.375}" height="${size * 0.375}" fill="#1e40af"/>
  <rect x="${size * 0.375}" y="${size * 0.375}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.5}" y="${size * 0.375}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.625}" y="${size * 0.375}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.375}" y="${size * 0.5}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.5}" y="${size * 0.5}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.625}" y="${size * 0.5}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.375}" y="${size * 0.625}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.5}" y="${size * 0.625}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
  <rect x="${size * 0.625}" y="${size * 0.625}" width="${size * 0.0625}" height="${size * 0.0625}" fill="white"/>
</svg>`;

  return svg;
}

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
iconSizes.forEach(size => {
  const svg = createPlaceholderIcon(size);
  const filename = `icon-${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Created ${filename}`);
});

console.log('Icon generation complete!');
console.log('Note: For production, convert these SVG files to PNG using an image editor or online tool.'); 