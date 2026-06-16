const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await page.waitForFunction('window.__UI_STORE__ !== undefined', { timeout: 10000 });
  
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== OVERLAY SPAM AUDIT ===');
  
  const result1 = await page.evaluate(async () => {
    let peakTweens = 0;
    const interval = setInterval(() => {
      if (window.gsap && window.gsap.globalTimeline) {
         const count = window.gsap.globalTimeline.getChildren(true, true, true).length;
         if (count > peakTweens) peakTweens = count;
      }
    }, 10);
    
    const uiStore = window.__UI_STORE__;

    for (let i = 0; i < 50; i++) {
        uiStore.getState().fadeIn();
        await new Promise(r => setTimeout(r, 10));
        uiStore.getState().fadeOut();
        await new Promise(r => setTimeout(r, 10));
    }
    
    uiStore.getState().fadeIn();
    await new Promise(r => setTimeout(r, 500));
    
    // Count DOM nodes
    const overlays = document.querySelectorAll('div[style*="z-index: 9999"]');
    const opacity = overlays[0] ? overlays[0].style.opacity : null;
    
    clearInterval(interval);
    
    return {
       peakTweens,
       overlayNodes: overlays.length,
       finalOpacity: opacity
    };
  });
  
  console.log("Spam Audit Results:", result1);

  await browser.close();
})();
