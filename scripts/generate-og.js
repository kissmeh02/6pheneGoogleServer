const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });

    const htmlPath = path.resolve(__dirname, '..', 'webpage', 'assets', 'og-card.html');
    const filePath = 'file:///' + htmlPath.split(path.sep).join('/');
    await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 15000 });

    const outPath = path.resolve(__dirname, '..', 'webpage', 'assets', 'og-card.png');
    await page.screenshot({
        path: outPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1200, height: 630 }
    });

    await browser.close();
    console.log('OG image generated:', outPath);
})();
