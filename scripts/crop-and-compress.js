/**
 * Crop Gemini star logo from bottom-right corner and compress to WebP.
 * Crops 5% from right and 8% from bottom to remove the watermark.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS = path.resolve(__dirname, '..', 'webpage', 'assets');
const MAX_WIDTH = 1920;
const QUALITY = 82;

const targets = [
    { src: 'graphene-lattice-new.png', out: 'graphene-lattice.webp' },
    { src: 'r2r-laser-new.png', out: 'r2r-laser.webp' },
    { src: 'graphene-wave-new.png', out: 'graphene-wave.webp' },
    { src: 'toronto-hex-new.png', out: 'toronto-hex.webp' },
    { src: 'sports-composite-new.png', out: 'sports-composite-new.webp' },
    { src: 'aerospace-new.png', out: 'aerospace-new.webp' },
];

(async () => {
    for (const { src, out } of targets) {
        const srcPath = path.join(ASSETS, src);
        if (!fs.existsSync(srcPath)) { console.log('SKIP:', src); continue; }

        const meta = await sharp(srcPath).metadata();
        const cropRight = Math.floor(meta.width * 0.05);
        const cropBottom = Math.floor(meta.height * 0.08);
        const newW = meta.width - cropRight;
        const newH = meta.height - cropBottom;

        const sizeBefore = fs.statSync(srcPath).size;
        const destPath = path.join(ASSETS, out);

        await sharp(srcPath)
            .extract({ left: 0, top: 0, width: newW, height: newH })
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(destPath);

        const sizeAfter = fs.statSync(destPath).size;
        console.log(`${src} (${meta.width}x${meta.height}) → ${out}: ${(sizeBefore/1024/1024).toFixed(1)}MB → ${(sizeAfter/1024).toFixed(0)}KB`);
    }
    console.log('\nDone.');
})();
