const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== INVALID CLICK AUDIT ===');

  const result = await page.evaluate(async () => {
    let cameraTweens = 0;
    const originalTo = window.gsap.to;
    window.gsap.to = function(target, vars) {
      if (target === window.__CAMERA__.position || target === window.__CAMERA__.rotation) {
        cameraTweens++;
      }
      return originalTo.apply(this, arguments);
    };

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Floor
    window.dispatchEvent(new PointerEvent('pointerdown', { clientX: w/2, clientY: h - 10 }));
    // Ceiling
    window.dispatchEvent(new PointerEvent('pointerdown', { clientX: w/2, clientY: 10 }));
    // Wall
    window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 10, clientY: h/2 }));

    await new Promise(r => setTimeout(r, 500));
    
    window.gsap.to = originalTo;

    return {
      cameraTweens
    };
  });

  if (result.cameraTweens === 0) {
     console.log('✅ Invalid click: PASSED. No navigation triggered.');
  } else {
     console.log(`❌ Invalid click: FAILED. Tweens: ${result.cameraTweens}`);
  }

  await browser.close();
})();
