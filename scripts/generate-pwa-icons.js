#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Creates PNG icons for PWA manifest
 * Run: node scripts/generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// Try using sharp (fast, pure JS), fallback to canvas
let generateIcon;

try {
  const sharp = require('sharp');
  generateIcon = async (size, outputPath) => {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#04040a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad)" />
        <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" fill="none" stroke="#00d4ff" stroke-width="${size*0.05}" opacity="0.8" />
        <circle cx="${size/2}" cy="${size/2}" r="${size*0.25}" fill="none" stroke="#ff006e" stroke-width="${size*0.04}" opacity="0.6" />
        <polygon points="${size/2},${size*0.15} ${size*0.85},${size*0.75} ${size*0.15},${size*0.75}" fill="#00d4ff" opacity="0.7" />
      </svg>
    `;
    
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${path.basename(outputPath)}`);
  };
} catch (e) {
  // Fallback: create simple solid color PNG
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  generateIcon = async (size, outputPath) => {
    // Create minimal valid PNG (8x8 gradient)
    const minPng = Buffer.concat([
      pngSignature,
      Buffer.from([0, 0, 0, 13]), // IHDR length
      Buffer.from('IHDR'),
      Buffer.from([0, 0, 0, size, 0, 0, 0, size, 8, 2, 0, 0, 0]), // 8-bit RGB
      Buffer.from([0x90, 0x77, 0x53, 0xde]), // IHDR CRC
      Buffer.from([0, 0, 0, 10]), // IDAT length
      Buffer.from('IDAT'),
      Buffer.from([120, 156, 99, 248, 15, 0, 0, 1, 1, 0, 1]), // IDAT data
      Buffer.from([0x18, 0xdd, 0x8d, 0xb4]) // IDAT CRC
    ]);
    
    fs.writeFileSync(outputPath, minPng);
    console.log(`✓ Generated ${path.basename(outputPath)} (fallback)`);
  };
}

async function main() {
  const publicDir = path.join(__dirname, '../public');
  
  try {
    // Generate three icon sizes
    await generateIcon(192, path.join(publicDir, 'pwa-192x192.png'));
    await generateIcon(512, path.join(publicDir, 'pwa-512x512.png'));
    await generateIcon(512, path.join(publicDir, 'pwa-512x512-maskable.png'));
    
    console.log('\n✓ All PWA icons generated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error generating icons:', error.message);
    process.exit(1);
  }
}

main();
