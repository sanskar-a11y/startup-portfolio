const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000', { waitUntil: 'load' });
  await page.evaluate(() => document.dispatchEvent(new Event('preloaderComplete')));
  await page.waitForFunction('window.__RENDERER__ !== undefined', { timeout: 10000 });
  await page.waitForFunction('window.__UI_STORE__ !== undefined', { timeout: 10000 });
  
  await new Promise(r => setTimeout(r, 2000));

  console.log('=== OVERLAY MID-TRANSITION INTERRUPT AUDIT ===');
  
  const result = await page.evaluate(async () => {
    let peakTweens = 0;
    const interval = setInterval(() => {
      if (window.gsap && window.gsap.globalTimeline) {
         const count = window.gsap.globalTimeline.getChildren(true, true, true).length;
         if (count > peakTweens) peakTweens = count;
      }
    }, 10);
    
    const uiStore = window.__UI_STORE__;

    // Start fade In (0.3s)
    uiStore.getState().fadeIn();
    
    // Wait exactly 150ms (halfway)
    await new Promise(r => setTimeout(r, 150));
    
    // Check intermediate opacity (should be ~0.5)
    const overlays = document.querySelectorAll('div[style*="z-index: 9999"]');
    const midOpacity = overlays[0] ? parseFloat(overlays[0].style.opacity) : -1;
    
    // Force fade out
    uiStore.getState().fadeOut();
    
    // Wait for it to finish (0.3s max)
    await new Promise(r => setTimeout(r, 400));
    
    const finalOpacity = overlays[0] ? parseFloat(overlays[0].style.opacity) : -1;
    
    clearInterval(interval);
    
    return {
       peakTweens,
       midOpacity: midOpacity.toFixed(2),
       finalOpacity: finalOpacity.toFixed(2)
    };
  });
  
  console.log("Interrupt Audit Results:", result);

  await browser.close();
})();
