/**
 * Compress large PNG images for web delivery.
 * Converts to high-quality JPEG and resizes to max 1920px width.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS = path.resolve(__dirname, '..', 'webpage', 'assets');
const MAX_WIDTH = 1920;
const QUALITY = 82;

const targets = [
    'ballistic-test.png',
    'sports-composite.png',
    'aerospace-panel.png',
    'r2r-production-line.png',
    'kevlar-armor.png',
    'logo-3d.png',
    'og-card.png',
    'ballistic-soldier.png',
];

(async () => {
    for (const file of targets) {
        const src = path.join(ASSETS, file);
        if (!fs.existsSync(src)) { console.log('SKIP (missing):', file); continue; }

        const sizeBefore = fs.statSync(src).size;
        const outFile = file.replace('.png', '.webp');
        const dest = path.join(ASSETS, outFile);

        try {
            await sharp(src)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toFile(dest);

            const sizeAfter = fs.statSync(dest).size;
            const pct = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);
            console.log(`${file} → ${outFile}: ${(sizeBefore/1024/1024).toFixed(1)}MB → ${(sizeAfter/1024).toFixed(0)}KB (${pct}% smaller)`);
        } catch (err) {
            console.error('ERROR:', file, err.message);
        }
    }
    console.log('\nDone. Update HTML to use .webp files with .png fallbacks.');
})();
