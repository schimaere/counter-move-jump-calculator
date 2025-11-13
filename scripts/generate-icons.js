// Simple script to generate placeholder PWA icons
// You can replace these with your actual app icons later

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple SVG icon
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000" rx="${size * 0.2}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" 
        font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">J</text>
</svg>`;
};

// Generate PNG icons from SVG
const sizes = [192, 512];
const generateIcons = async () => {
  for (const size of sizes) {
    const svg = createSVGIcon(size);
    const pngPath = path.join(publicDir, `icon-${size}x${size}.png`);
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(pngPath);
    
    console.log(`Created ${pngPath}`);
  }
  
  console.log('\n✓ PWA icons generated successfully!');
  console.log('\nNote: These are placeholder icons. For production, replace them with your actual app icons.');
  console.log('You can use online tools like:');
  console.log('- https://realfavicongenerator.net/');
  console.log('- https://www.pwabuilder.com/imageGenerator');
};

generateIcons().catch(console.error);

